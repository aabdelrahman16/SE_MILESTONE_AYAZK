import express from "express";
import Vendor from "../models/Vendor.js";
import User from "../models/User.js";
import SourcingRequest from "../models/SourcingRequest.js";
import Delivery from "../models/Delivery.js";
import Invoice from "../models/Invoice.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// Helper: get the vendor profile belonging to the logged-in user
const getMyVendor = async (req) => Vendor.findOne({ user: req.user.id });

// ---- Journey 13: Profile ----
// Get my vendor profile
router.get("/me", protect, restrictTo("vendor"), async (req, res) => {
  const vendor = await getMyVendor(req);
  if (!vendor) return res.status(404).json({ message: "Vendor profile not found" });
  res.json(vendor);
});

// Update my vendor profile
router.put("/me", protect, restrictTo("vendor"), async (req, res) => {
  const vendor = await getMyVendor(req);
  if (!vendor) return res.status(404).json({ message: "Vendor profile not found" });
  const fields = ["companyName", "suppliesOffered", "mainLocation", "contactInfo", "pricingList"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) vendor[f] = req.body[f];
  });
  await vendor.save();
  res.json(vendor);
});

// Public list of vendors (used by organizers - Journey 4) + filter/search
router.get("/", protect, async (req, res) => {
  const { search, supply, location } = req.query;
  const filter = {};
  if (supply) filter.suppliesOffered = supply;
  if (location) filter.mainLocation = new RegExp(location, "i");
  if (search) filter.companyName = new RegExp(search, "i");
  const vendors = await Vendor.find(filter).populate("user", "name email");
  res.json(vendors);
});

// ---- Journey 14: Sourcing requests ----
// View incoming sourcing requests for me
router.get("/requests/incoming", protect, restrictTo("vendor"), async (req, res) => {
  const vendor = await getMyVendor(req);
  const requests = await SourcingRequest.find({ vendor: vendor._id })
    .populate("organizer", "name email")
    .sort("-createdAt");
  res.json(requests);
});

// Accept or decline a request
router.patch("/requests/:id/respond", protect, restrictTo("vendor"), async (req, res) => {
  const { status } = req.body; // "Accepted" | "Declined"
  if (!["Accepted", "Declined"].includes(status)) {
    return res.status(400).json({ message: "status must be Accepted or Declined" });
  }
  const request = await SourcingRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  request.status = status;
  await request.save();

  // On acceptance, create a delivery record automatically
  if (status === "Accepted") {
    await Delivery.create({
      sourcingRequest: request._id,
      vendor: request.vendor,
      eventName: request.eventName,
    });
  }
  res.json(request);
});

// Send a clarification message on a request
router.post("/requests/:id/message", protect, restrictTo("vendor"), async (req, res) => {
  const request = await SourcingRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  request.messages.push({ from: "vendor", text: req.body.text });
  await request.save();
  res.json(request);
});

// ---- Journey 15: Deliveries ----
router.get("/deliveries", protect, restrictTo("vendor"), async (req, res) => {
  const vendor = await getMyVendor(req);
  const deliveries = await Delivery.find({ vendor: vendor._id })
    .populate("sourcingRequest")
    .sort("-createdAt");
  res.json(deliveries);
});

router.patch("/deliveries/:id", protect, restrictTo("vendor"), async (req, res) => {
  const { status, delayNote } = req.body;
  const delivery = await Delivery.findById(req.params.id);
  if (!delivery) return res.status(404).json({ message: "Delivery not found" });
  if (status) {
    delivery.status = status;
    if (status === "Delivered") delivery.confirmedAt = new Date();
  }
  if (delayNote !== undefined) delivery.delayNote = delayNote;
  await delivery.save();
  res.json(delivery);
});

// ---- Journey 16: Invoices ----
router.get("/invoices", protect, restrictTo("vendor"), async (req, res) => {
  const vendor = await getMyVendor(req);
  const invoices = await Invoice.find({ vendor: vendor._id }).sort("-createdAt");
  res.json(invoices);
});

router.post("/invoices", protect, restrictTo("vendor"), async (req, res) => {
  const vendor = await getMyVendor(req);
  let { organizer, delivery, eventName, lineItems, notes } = req.body;
  // Demo fallback: if no organizer supplied, attach to the first organizer in DB.
  if (!organizer) {
    const anyOrganizer = await User.findOne({ role: "organizer" });
    organizer = anyOrganizer?._id;
  }
  const total = (lineItems || []).reduce(
    (sum, li) => sum + li.unitPrice * (li.quantity || 1),
    0
  );
  const invoice = await Invoice.create({
    vendor: vendor._id,
    organizer,
    delivery,
    eventName,
    lineItems,
    notes,
    total,
  });
  res.status(201).json(invoice);
});

export default router;
