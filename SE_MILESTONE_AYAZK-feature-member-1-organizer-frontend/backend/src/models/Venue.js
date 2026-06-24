import mongoose from "mongoose";

// Venue listing - Journey 23. Owned by a venue owner.
const venueSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true }, // e.g. "Cairo"
    capacity: { type: Number },
    sizeSqm: { type: Number }, // dimensions (m²)
    amenities: [{ type: String }],
    pricePerDay: { type: Number },
    photos: [{ type: String }], // URLs
    unavailableDates: [{ type: Date }], // availability calendar
    status: {
      type: String,
      enum: ["active", "inactive", "removed"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Venue", venueSchema);
