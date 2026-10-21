// routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes require login
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:productId', protect, updateCartItem);
router.delete('/:productId', protect, removeFromCart);

module.exports = router;