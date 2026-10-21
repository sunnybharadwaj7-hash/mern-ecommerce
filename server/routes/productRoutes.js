// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  getCategories,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// ---------- Public Routes ----------
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// ---------- Private/Admin Routes ----------
// upload.single('image') looks for ONE file in the request, sent under the field name "image"
router.post('/', protect, admin, upload.single('image'), createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;