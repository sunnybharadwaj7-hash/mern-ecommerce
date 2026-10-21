// utils/generateToken.js
// Helper function to generate a JWT for a given user ID

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // payload — data embedded inside the token (just the user's ID, keep it minimal)
    process.env.JWT_SECRET, // secret key used to sign the token (must stay private on the server)
    { expiresIn: '30d' } // token becomes invalid after 30 days
  );
};

module.exports = generateToken;