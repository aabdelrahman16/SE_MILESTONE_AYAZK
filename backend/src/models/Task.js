const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["not assigned", "pending", "in progress", "done"],
      default: "not assigned",
    },

    dueDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);