import mongoose from "mongoose";

// Vendor profile - owned by Member 3.
// Journey 13: profile details (company name, supplies offered, location, pricing, contact).
const vendorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    suppliesOffered: [{ type: String }], // e.g. ["Catering", "Flowers", "Lighting"]
    mainLocation: { type: String },
    contactInfo: {
      phone: { type: String },
      email: { type: String },
    },
    pricingList: [
      {
        item: { type: String, required: true },
        price: { type: Number, required: true },
        unit: { type: String, default: "each" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
