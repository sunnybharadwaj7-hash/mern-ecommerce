const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [users, products, orders, revenue] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);
    res.status(200).json({ users, products, orders, revenue: revenue[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/admin/users/:id/role   body: { role }
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    // Stops you from locking yourself out
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid user ID' });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.status(200).json({ message: 'User removed' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid user ID' });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/admin/orders/:id/status   body: { orderStatus }
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    if (!['processing', 'shipped', 'delivered', 'cancelled'].includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = orderStatus;
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid order ID' });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
};