const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  feedback: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
