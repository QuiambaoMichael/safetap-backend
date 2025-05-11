// server.js

require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the User model
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Define the /api/signup route
app.post('/api/signup', async (req, res) => {
  const { email, password, role } = req.body;

  // Validate request body
  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields (email, password, role) are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use." });
    }

    // Create new user
    const newUser = new User({ email, password, role });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
