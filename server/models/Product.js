// models/Product.js
// Defines the schema (shape) for a Product document in MongoDB

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }, // used later to delete/manage images on Cloudinary
      },
    ],
    // Reference to the User who created this product (must be an admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // stores just the User document's ID
      ref: 'User', // tells Mongoose which model this ID refers to (enables .populate() later)
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;