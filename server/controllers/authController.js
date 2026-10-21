// controllers/authController.js
// Contains the actual logic for authentication-related routes

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // data sent by the frontend

    // Basic validation — check nothing is missing
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if a user with this email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create the new user
    // (password hashing happens automatically via the pre('save') hook in User.js)
    const user = await User.create({ name, email, password });

    if (user) {
      // Successfully created — send back user info + a token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate (login) a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // IMPORTANT: check both "user exists" AND "password matches" with the SAME error message
    // This prevents attackers from figuring out which emails are registered (user enumeration)
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Credentials are correct — send back user info + a fresh token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get logged-in user's own profile
// @route   GET /api/auth/me
// @access  Private (requires valid JWT)
const getMe = async (req, res) => {
  // req.user is attached by our authMiddleware after verifying the token
  res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, getMe };