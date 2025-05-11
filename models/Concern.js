const mongoose = require('mongoose');

// Define the schema for the concerns collection
const concernSchema = new mongoose.Schema({
  concernType: { type: String, required: true }, // Clinic, Services, etc.
  concern: { type: String, required: true },
  otherConcern: { type: String, default: '' },
  location: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true });

const Concern = mongoose.model('Concern', concernSchema); // Will map to 'concerns' collection

module.exports = Concern;
