const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const RSVP = require("./models/RSVP");
const Feedback = require("./models/Feedback");
const Guest = require("./models/RSVP");
const Announcement = require("./models/Announcement");



const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/eventApp")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Save RSVP
app.post("/rsvp", async (req, res) => {
  try {
    const { name, email, status, eventName } = req.body;

    const newRSVP = new RSVP({
      name,
      email,
      status,
      eventName
    });

    await newRSVP.save();

    res.json({ success: true, message: "RSVP saved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error saving RSVP" });
  }
});

// Staff: Get all RSVPs
app.get("/staff/rsvps", async (req, res) => {
  try {
    const rsvps = await RSVP.find().sort({ createdAt: -1 });
    res.json(rsvps);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
});

// Messages
app.get("/messages", async (req, res) => {
  try {
    const messages = await Announcement.find().sort({ _id: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

app.post("/messages", async (req, res) => {
  try {
    const { text } = req.body;

    const newMsg = new Announcement({
      text,
      date: new Date().toLocaleString()
    });

    await newMsg.save();

    res.json({ success: true, message: "Announcement sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error sending announcement" });
  }
});


// Feedback

app.post("/feedback", async (req, res) => {
  try {
    const { feedback } = req.body;

    const newFeedback = new Feedback({ feedback });
    await newFeedback.save();

    res.json({ success: true, message: "Feedback saved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error saving feedback" });
  }
});

app.get("/staff/feedback", async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbackList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to load feedback" });
  }
});


// Staff login
app.post("/staff/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@event.com" && password === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get("/staff/checkin", async (req, res) => {
  try {
    const guests = await Guest.find().sort({ name: 1 });
    res.json(guests);
  } catch (err) {
    res.status(500).json({ error: "Failed to load guests" });
  }
});

app.post("/staff/checkin/:id", async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);

    if (!guest) {
      return res.json({ success: false, message: "Guest not found" });
    }

    if (guest.checkedIn) {
      return res.json({ success: false, message: "Already checked in" });
    }

    guest.checkedIn = true;
    guest.checkInTime = new Date();
    await guest.save();

    res.json({ success: true, message: "Guest checked in" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));
