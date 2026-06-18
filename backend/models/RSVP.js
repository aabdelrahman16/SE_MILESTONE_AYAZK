const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema({
  name: String,
  email: String,
  status: String,
  eventName: String,
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkInTime: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("RSVP", rsvpSchema);
