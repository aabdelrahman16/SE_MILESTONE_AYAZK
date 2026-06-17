import mongoose from "mongoose";

// Invoice - Journey 16.
const invoiceSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    delivery: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" },
    eventName: { type: String },
    lineItems: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    notes: { type: String }, // supporting / itemized breakdown
    status: {
      type: String,
      enum: ["Pending Review", "Approved", "Paid"],
      default: "Pending Review",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
