const dns = require('dns');
// The Google DNS workaround is only for your local network
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

connectDB();

const app = express();

// Render sits behind a proxy, so this lets rate limiting see the real client IP
app.set('trust proxy', 1);

// Adds secure HTTP headers
app.use(helmet());

// Only your own frontend(s) may call the API. Comma-separate multiple URLs.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      // origin is undefined for Postman / server-to-server calls
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
  })
);

app.use(express.json({ limit: '1mb' }));

// General limit: 300 requests per 15 min per IP
app.use(
  '/api',
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false })
);

// Strict limit on login/register to slow down password guessing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: 'Too many attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});