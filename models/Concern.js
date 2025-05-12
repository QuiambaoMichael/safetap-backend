const mongoose = require('mongoose');

// Define schema
const concernSchema = new mongoose.Schema({
  concernType: { type: String, required: true },
  concern: { type: String, required: true },
  otherConcern: { type: String, default: '' },
  location: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true }
}, { timestamps: true });

// Format function with Manila timezone
function formatDateToManila(date) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date));
}

// Customize the output of JSON
concernSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.createdAt = formatDateToManila(ret.createdAt);
    ret.updatedAt = formatDateToManila(ret.updatedAt);
    return ret;
  }
});

const Concern = mongoose.model('Concern', concernSchema);
module.exports = Concern;
