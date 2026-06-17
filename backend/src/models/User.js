import mongoose from "mongoose";

// Shared User model. Member 2 owns the canonical version.
// Included here so the Vendor & Venue Owner module runs standalone.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["organizer", "staff", "vendor", "guest", "venue_owner"],
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
