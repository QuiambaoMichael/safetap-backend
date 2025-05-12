const mongoose = require('mongoose');

// Define the schema
const concernSchema = new mongoose.Schema({
  concernType: { type: String, required: true },
  concern: { type: String, required: true },
  otherConcern: { type: String, default: '' },
  location: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true });

// Helper to format date as "June 6, 2025 10:15 PM"
function formatDate(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Format JSON output
concernSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.createdAt = formatDate(ret.createdAt);
    ret.updatedAt = formatDate(ret.updatedAt);
    return ret;
  }
});

const Concern = mongoose.model('Concern', concernSchema);
module.exports = Concern;
