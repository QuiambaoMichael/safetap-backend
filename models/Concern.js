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

// Helper function to format date
function formatDate(date) {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${mm}/${dd}/${yyyy} : ${hh}:${min}`;
}

// Modify how documents are serialized to JSON
concernSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.createdAt = formatDate(ret.createdAt);
    ret.updatedAt = formatDate(ret.updatedAt);
    return ret;
  }
});

const Concern = mongoose.model('Concern', concernSchema);
module.exports = Concern;
