import mongoose from "mongoose";

// Booking request - Journeys 24 & 25.
// Created by an organizer (Member 1/2), responded to by venue owner (Member 3).
const bookingRequestSchema = new mongoose.Schema(
  {
    venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventType: { type: String },
    date: { type: Date, required: true },
    expectedAttendees: { type: Number },
    specialRequirements: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Declined"],
      default: "Pending",
    },
    counterProposal: { type: String }, // adjusted pricing / alternative dates
  },
  { timestamps: true }
);

export default mongoose.model("BookingRequest", bookingRequestSchema);
