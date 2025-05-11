const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Import User model
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Sign-up route
app.post('/api/signup', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      role
    });

    // Save the new user to the database
    await newUser.save();
    return res.status(201).json({ success: true, message: "User registered successfully" });

  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
