import express from "express";
import Guest from "../models/Guest.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const guests = await Guest.find().populate("event user");
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const guest = await Guest.create(req.body);
    res.status(201).json(guest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id/rsvp", async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      { rsvpStatus: req.body.rsvpStatus, dietaryPreference: req.body.dietaryPreference },
      { new: true }
    );
    if (!guest) return res.status(404).json({ message: "Guest not found" });
    res.json(guest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id/checkin", async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      { checkedIn: true },
      { new: true }
    );
    if (!guest) return res.status(404).json({ message: "Guest not found" });
    res.json(guest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;