import express from "express";
import BookingRequest from "../models/BookingRequest.js";

const router = express.Router();

// Get all booking requests
router.get("/", async (req, res) => {
  try {
    const bookings = await BookingRequest.find()
      .populate("venue")
      .populate("owner", "name email role")
      .populate("organizer", "name email role");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one booking request
router.get("/:id", async (req, res) => {
  try {
    const booking = await BookingRequest.findById(req.params.id)
      .populate("venue")
      .populate("owner", "name email role")
      .populate("organizer", "name email role");

    if (!booking) return res.status(404).json({ message: "Booking request not found" });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create booking request
router.post("/", async (req, res) => {
  try {
    const booking = await BookingRequest.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Approve / decline booking request
router.patch("/:id/respond", async (req, res) => {
  try {
    const { status, counterProposal } = req.body;

    if (!["Pending", "Approved", "Declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await BookingRequest.findByIdAndUpdate(
      req.params.id,
      { status, counterProposal },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking request not found" });

    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete booking request
router.delete("/:id", async (req, res) => {
  try {
    const booking = await BookingRequest.findByIdAndDelete(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking request not found" });

    res.json({ message: "Booking request deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;