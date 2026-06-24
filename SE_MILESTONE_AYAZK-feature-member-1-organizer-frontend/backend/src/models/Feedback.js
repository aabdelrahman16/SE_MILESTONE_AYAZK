import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    foodRating: Number,
    venueRating: Number,
    organizationRating: Number,

    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);