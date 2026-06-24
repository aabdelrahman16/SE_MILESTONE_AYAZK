import mongoose from "mongoose";

// Sourcing request - Journey 14.
// Created by an organizer, received and reviewed by a vendor.
const sourcingRequestSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventName: { type: String }, // simple ref to event (Member 2 owns full Event model)
    eventLocation: { type: String },
    requestedItems: [
      {
        item: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    deliveryDate: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Declined"],
      default: "Pending",
    },
    messages: [
      {
        from: { type: String, enum: ["organizer", "vendor"] },
        text: { type: String },
        sentAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("SourcingRequest", sourcingRequestSchema);
