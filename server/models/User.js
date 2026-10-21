// models/User.js
// Defines the schema (shape) for a User document in MongoDB

const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // we need this to hash passwords automatically

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'], // custom error message if missing
      trim: true, // removes extra whitespace from both ends
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // no two users can have the same email
      lowercase: true, // always store emails in lowercase (prevents "A@x.com" vs "a@x.com" duplicates)
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // only these two values are allowed
      default: 'user', // every new signup is a normal user unless we manually change it
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

// ---------- Mongoose Middleware (Hooks) ----------
// This function runs automatically BEFORE a user document is saved to the database
userSchema.pre('save', async function () {
  // Only hash the password if it's new or being changed
  // (prevents re-hashing an already-hashed password when updating other fields)
  if (!this.isModified('password')) {
    return; // simply return — no next() needed with async functions
  }

  const salt = await bcrypt.genSalt(10); // generates a random string added to the password before hashing
  this.password = await bcrypt.hash(this.password, salt); // replace plain password with hashed version
  // no next() call needed — Mongoose waits for this async function's promise to resolve
});

// ---------- Custom Instance Method ----------
// Lets us call user.matchPassword('someInput') later during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;