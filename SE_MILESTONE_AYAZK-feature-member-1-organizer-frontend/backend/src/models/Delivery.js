import mongoose from "mongoose";

// Delivery - Journey 15. Created when a sourcing request is accepted.
const deliverySchema = new mongoose.Schema(
  {
    sourcingRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SourcingRequest",
      required: true,
    },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    eventName: { type: String },
    status: {
      type: String,
      enum: ["Preparing", "Out for Delivery", "Delivered"],
      default: "Preparing",
    },
    confirmedAt: { type: Date }, // logged on arrival
    delayNote: { type: String }, // notify organizer of delays/changes
  },
  { timestamps: true }
);

export default mongoose.model("Delivery", deliverySchema);
