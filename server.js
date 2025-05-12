require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Concern = require('./models/Concern'); // Updated import
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

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
  const { fullname, phone, email, password, role } = req.body;

  if (!fullname || !phone || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      phone,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: "User registered successfully" });

  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Include fullname in the response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      role: user.role,
      fullname: user.fullname  // Sending fullname
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route to submit a concern
app.post('/api/submit-concern', async (req, res) => {
  const { concernType, concern, otherConcern, location, email, name } = req.body;

  if (!concernType || !concern || !location || !email || !name) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ email, fullname: name });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const now = new Date();
    const options = {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(now);

    const newConcern = new Concern({
      concernType,
      concern,
      otherConcern,
      location,
      email,
      name,
      createdAt: formattedDate,
      updatedAt: formattedDate,
      status: 'unresolved' // Default status is unresolved
    });

    await newConcern.save();

    return res.status(201).json({
      success: true,
      message: "Concern submitted successfully",
      concern: newConcern
    });

  } catch (err) {
    console.error("Error submitting concern:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route to fetch concerns with a specific status
app.get('/api/concerns', async (req, res) => {
  const { status } = req.query;  // Get the status filter from query parameter

  try {
    const query = status ? { status } : {}; // If status is provided, filter by it
    const concerns = await Concern.find(query);

    return res.status(200).json({
      success: true,
      concerns
    });
  } catch (err) {
    console.error("Error fetching concerns:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route to mark a concern as resolved
app.put('/api/resolve-concern', async (req, res) => {
  const { concernId } = req.body;

  if (!concernId) {
    return res.status(400).json({ success: false, message: "Concern ID is required" });
  }

  try {
    const concern = await Concern.findById(concernId);
    if (!concern) {
      return res.status(404).json({ success: false, message: "Concern not found" });
    }

    concern.status = 'resolved';  // Mark as resolved
    concern.updatedAt = new Date().toISOString();  // Update the timestamp

    await concern.save();

    return res.status(200).json({
      success: true,
      message: "Concern marked as resolved",
      concern: concern
    });

  } catch (err) {
    console.error("Error resolving concern:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
