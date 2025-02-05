const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  tillDate: { type: Date, required: true }
});

module.exports = mongoose.model('Job', jobSchema);
