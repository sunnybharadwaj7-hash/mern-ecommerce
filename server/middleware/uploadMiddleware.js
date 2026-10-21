// middleware/uploadMiddleware.js
// Configures Multer to accept image uploads and send them directly to Cloudinary

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure WHERE and HOW uploaded files get stored (in this case, directly to Cloudinary)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mern_ecommerce_products', // organizes uploads into a specific folder in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // reject any other file type
    transformation: [{ width: 800, height: 800, crop: 'limit' }], // auto-resize large images to save space/bandwidth
  },
});

// Create the actual Multer instance using this storage configuration
const upload = multer({ storage });

module.exports = upload;