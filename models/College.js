const mongoose = require('mongoose');

// College Schema
const CollegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true,
    unique: true
  }
});

const College = mongoose.model('Colleges', CollegeSchema);
module.exports = College;