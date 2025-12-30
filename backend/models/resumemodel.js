const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  fileName: String,
  extractedText: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Resume", resumeSchema);
