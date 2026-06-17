import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.find().populate("event guest");
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;