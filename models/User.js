// models/User.js
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
