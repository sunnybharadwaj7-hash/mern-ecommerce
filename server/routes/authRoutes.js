// routes/authRoutes.js
// Defines the URL endpoints related to authentication

const express = require('express');
const router = express.Router(); // creates a mini, standalone router object

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ---------- Public Routes (no token needed) ----------
router.post('/register', registerUser);
router.post('/login', loginUser);

// ---------- Private Route (token required) ----------
// "protect" middleware runs FIRST — only if it calls next() does getMe run
router.get('/me', protect, getMe);

module.exports = router;