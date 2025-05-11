require('dotenv').config();
const mongoose = require('mongoose');




const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');

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

// Basic route for signup
app.post('/signup', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.json({ success: false, message: "All fields required" });
  }

  // Here you'd save to MongoDB using a schema, this is a placeholder
  return res.json({ success: true, message: "User registered (placeholder)" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
