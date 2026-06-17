const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    name: { type: String, required: true },
    email: { type: String, required: true },

    rsvpStatus: {
      type: String,
      enum: ["attending", "not attending", "maybe", "pending"],
      default: "pending",
    },

    dietaryPreference: String,

    checkedIn: { type: Boolean, default: false },

    messageSeen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", guestSchema);