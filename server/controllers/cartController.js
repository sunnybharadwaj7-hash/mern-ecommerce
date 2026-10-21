// controllers/cartController.js
// Contains business logic for shopping cart operations

//const Cart = require('../models/Cart');
//const Product = require('../models/Product');

// @desc    Add a product to the logged-in user's cart (or increase quantity if already there)
// @route   POST /api/cart
// @access  Private
/*const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Confirm the product actually exists before adding it to anyone's cart
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find this user's existing cart, if they have one
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // No cart yet for this user — create a brand new one with this single item
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Cart already exists — check if this specific product is already in it
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        // Already in cart — just increase the quantity
        existingItem.quantity += quantity;
      } else {
        // Not in cart yet — add it as a new item
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    // Populate product details before sending back, so the frontend has everything it needs immediately
    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addToCart };*/
// controllers/cartController.js

const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Add a product to cart (or increase quantity if already there)
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get the logged-in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      // No cart yet is a perfectly normal state (new user, never added anything)
      // Return an empty-cart shape instead of a 404 — simplifies frontend logic
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update the quantity of a specific product in the cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    item.quantity = quantity; // directly set to the new value (not incrementing, this is a full update)
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove a specific product from the cart entirely
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Keep every item EXCEPT the one matching this productId
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeFromCart };