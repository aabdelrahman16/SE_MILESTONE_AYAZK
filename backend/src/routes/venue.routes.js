import express from "express";
import Venue from "../models/Venue.js";
import BookingRequest from "../models/BookingRequest.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// ---- Journey 23: Venue listing management ----
// My listings
router.get("/mine", protect, restrictTo("venue_owner"), async (req, res) => {
  const venues = await Venue.find({ owner: req.user.id }).sort("-createdAt");
  res.json(venues);
});

// Create listing
router.post("/", protect, restrictTo("venue_owner"), async (req, res) => {
  const venue = await Venue.create({ ...req.body, owner: req.user.id });
  res.status(201).json(venue);
});

// Update listing
router.put("/:id", protect, restrictTo("venue_owner"), async (req, res) => {
  const venue = await Venue.findOne({ _id: req.params.id, owner: req.user.id });
  if (!venue) return res.status(404).json({ message: "Venue not found" });
  Object.assign(venue, req.body);
  await venue.save();
  res.json(venue);
});

// Deactivate / remove listing
router.patch("/:id/status", protect, restrictTo("venue_owner"), async (req, res) => {
  const { status } = req.body; // active | inactive | removed
  const venue = await Venue.findOne({ _id: req.params.id, owner: req.user.id });
  if (!venue) return res.status(404).json({ message: "Venue not found" });
  venue.status = status;
  await venue.save();
  res.json(venue);
});

// Public browse + filter (organizer venue search - Journey 2)
router.get("/", protect, async (req, res) => {
  const { location, minSize, date } = req.query;
  const filter = { status: "active" };
  if (location) filter.location = new RegExp(location, "i");
  if (minSize) filter.sizeSqm = { $gte: Number(minSize) };
  let venues = await Venue.find(filter).populate("owner", "name");
  // filter out venues unavailable on the requested date
  if (date) {
    const d = new Date(date).toDateString();
    venues = venues.filter(
      (v) => !v.unavailableDates.some((u) => new Date(u).toDateString() === d)
    );
  }
  res.json(venues);
});

// ---- Journey 24: Booking request management ----
router.get("/bookings/requests", protect, restrictTo("venue_owner"), async (req, res) => {
  const { status } = req.query;
  const filter = { owner: req.user.id };
  if (status) filter.status = status;
  const requests = await BookingRequest.find(filter)
    .populate("venue", "name location")
    .populate("organizer", "name email")
    .sort("-createdAt");
  res.json(requests);
});

router.patch("/bookings/requests/:id/respond", protect, restrictTo("venue_owner"), async (req, res) => {
  const { status, counterProposal } = req.body;
  const request = await BookingRequest.findOne({ _id: req.params.id, owner: req.user.id });
  if (!request) return res.status(404).json({ message: "Booking request not found" });
  if (status) request.status = status;
  if (counterProposal !== undefined) request.counterProposal = counterProposal;
  await request.save();

  // block the date on the venue calendar when approved
  if (status === "Approved") {
    const venue = await Venue.findById(request.venue);
    if (venue) {
      venue.unavailableDates.push(request.date);
      await venue.save();
    }
  }
  res.json(request);
});

// ---- Journey 25: Confirmed bookings overview ----
router.get("/bookings/confirmed", protect, restrictTo("venue_owner"), async (req, res) => {
  const { venue } = req.query;
  const filter = { owner: req.user.id, status: "Approved" };
  if (venue) filter.venue = venue;
  const bookings = await BookingRequest.find(filter)
    .populate("venue", "name location")
    .populate("organizer", "name email")
    .sort("date");
  res.json(bookings);
});

// ---- Journey 26: Performance & reporting ----
router.get("/reports/summary", protect, restrictTo("venue_owner"), async (req, res) => {
  const venues = await Venue.find({ owner: req.user.id });
  const allRequests = await BookingRequest.find({ owner: req.user.id });
  const approved = allRequests.filter((r) => r.status === "Approved");

  const perVenue = venues.map((v) => {
    const vReqs = allRequests.filter((r) => String(r.venue) === String(v._id));
    const vApproved = vReqs.filter((r) => r.status === "Approved");
    return {
      venue: v.name,
      totalRequests: vReqs.length,
      approved: vApproved.length,
      bookingRate: vReqs.length ? (vApproved.length / vReqs.length) : 0,
      revenue: vApproved.length * (v.pricePerDay || 0),
    };
  });

  res.json({
    totalBookings: approved.length,
    totalRevenue: perVenue.reduce((s, p) => s + p.revenue, 0),
    perVenue,
  });
});

export default router;
