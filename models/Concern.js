const mongoose = require('mongoose');

// Define the schema for the concern collection
const concernSchema = new mongoose.Schema({
  concernType: { type: String, required: true }, // e.g., Clinic, Services, etc.
  concern: { type: String, required: true }, // Medical concern selected
  otherConcern: { type: String, default: '' }, // Optional additional concern
  location: { type: String, required: true }, // Location of the user
  email: { type: String, required: true }, // User email
  name: { type: String, required: true } // User full name
}, { timestamps: true });

const Concern = mongoose.model('Concern', concernSchema);

module.exports = Concern;
