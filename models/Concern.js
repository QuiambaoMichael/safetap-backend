const mongoose = require('mongoose');

// Define schema
const concernSchema = new mongoose.Schema({
  concernType: { type: String, required: true },
  concern: { type: String, required: true },
  otherConcern: { type: String, default: '' },
  location: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: String },
  updatedAt: { type: String }
});

const Concern = mongoose.model('Concern', concernSchema);
module.exports = Concern;