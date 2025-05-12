const mongoose = require('mongoose');

const concernSchema = new mongoose.Schema({
  concernType: { type: String, required: true },
  concern: { type: String, required: true },
  otherConcern: { type: String, default: '' },
  location: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  status: { type: String, default: 'unresolved' } // Default to unresolved
});

module.exports = mongoose.model('Concern', concernSchema);
