const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    date: { type: Date, required: true },
    time: String,

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
    },

    budget: {
      planned: { type: Number, default: 0 },
      actual: { type: Number, default: 0 },
    },

    status: {
      type: String,
      enum: ["planned", "ongoing", "completed", "cancelled"],
      default: "planned",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);