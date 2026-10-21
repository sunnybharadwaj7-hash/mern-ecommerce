const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.status(200).json(wishlist || { products: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/wishlist  body: { productId }
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
    } else if (!wishlist.products.some((p) => p.toString() === productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const populated = await Wishlist.findById(wishlist._id).populate('products');
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.productId
    );
    await wishlist.save();

    const populated = await Wishlist.findById(wishlist._id).populate('products');
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };