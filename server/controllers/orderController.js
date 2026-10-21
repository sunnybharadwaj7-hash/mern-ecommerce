const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders  body: { shippingAddress }
// Builds the order from the user's cart, then creates a Razorpay order
const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Total is calculated on the server from live prices. Never trust a total from the client.
    let totalPrice = 0;
    const items = [];
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({ message: 'A product in your cart no longer exists' });
      }
      if (item.product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${item.product.name}` });
      }
      totalPrice += item.product.price * item.quantity;
      items.push({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images?.[0]?.url || '',
        quantity: item.quantity,
      });
    }

    // Razorpay amounts are in paise (1 rupee = 100 paise)
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      totalPrice,
      razorpayOrderId: rzpOrder.id,
    });

    res.status(201).json({
      orderId: order._id,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Please fill all address fields' });
    }
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

// POST /api/orders/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user._id,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Already processed, so don't reduce stock twice
    if (order.paymentStatus === 'paid') return res.status(200).json(order);

    // Recompute the signature with our secret and compare with what Razorpay sent
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      order.paymentStatus = 'failed';
      await order.save();
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // Reduce stock and clear the cart
    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } });
    }
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only the owner or an admin can view an order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed to view this order' });
    }
    res.status(200).json(order);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createOrder, verifyPayment, getMyOrders, getOrderById };