const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  unit: { type: String, default: '' },
  color: { type: String, default: '#00d4aa' },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Metric', metricSchema);
