// controllers/productController.js
// Contains business logic for product-related routes

const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Please provide all required product fields' });
    }
    const images = [];
    if (req.file) {
      images.push({
        url: req.file.path,        // the final Cloudinary-hosted URL
        public_id: req.file.filename, // Cloudinary's internal ID for this specific image (needed to delete it later)
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      images,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all products (supports search, filters, pagination)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    if (keyword) {
      filter.name = {
        $regex: keyword,
        $options: 'i',
      };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      page: pageNumber,
      totalPages: Math.ceil(totalProducts / pageSize),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get list of distinct product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, category, stock } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.status(200).json({ message: 'Product removed successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getCategories,
  updateProduct,
  deleteProduct,
};