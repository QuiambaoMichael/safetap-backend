require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Ensure your User model includes fullname and phone
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

// Clinic Concern Schema and Model
const clinicConcernSchema = new mongoose.Schema({
  email: { type: String, required: true },
  fullname: { type: String, required: true },
  concern: { type: String, required: true },
  otherConcern: { type: String, default: '' },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ClinicConcern = mongoose.model('ClinicConcern', clinicConcernSchema);

// Sign-up route
app.post('/api/signup', async (req, res) => {
  const { fullname, phone, email, password, role } = req.body;

  if (!fullname || !phone || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
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

    return res.status(200).json({ success: true, message: "Login successful", role: user.role });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route to submit clinic concerns
app.post('/api/submit-clinic', async (req, res) => {
  const { email, fullname, concern, otherConcern, location } = req.body;

  if (!email || !fullname || !concern || !location) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // Optionally, check if the user exists in the database to verify the email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Save the clinic concern in the database
    const newConcern = new ClinicConcern({
      email,
      fullname,
      concern,
      otherConcern,
      location
    });

    await newConcern.save();

    return res.status(200).json({ success: true, message: "Concern submitted successfully" });

  } catch (err) {
    console.error("Error submitting concern:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
