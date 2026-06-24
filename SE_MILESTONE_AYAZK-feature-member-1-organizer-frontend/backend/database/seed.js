import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/User.js";
import Vendor from "../src/models/Vendor.js";
import SourcingRequest from "../src/models/SourcingRequest.js";
import Delivery from "../src/models/Delivery.js";
import Invoice from "../src/models/Invoice.js";
import Venue from "../src/models/Venue.js";
import BookingRequest from "../src/models/BookingRequest.js";

dotenv.config();

const run = async () => {
  await connectDB();
  console.log("Clearing collections...");
  await Promise.all([
    User.deleteMany({}),
    Vendor.deleteMany({}),
    SourcingRequest.deleteMany({}),
    Delivery.deleteMany({}),
    Invoice.deleteMany({}),
    Venue.deleteMany({}),
    BookingRequest.deleteMany({}),
  ]);

  const pw = await bcrypt.hash("password123", 10);

  // Users
  const organizer = await User.create({
    name: "Layla Organizer", email: "organizer@demo.com", password: pw, role: "organizer",
  });
  const vendorUser1 = await User.create({
    name: "Karim Catering", email: "vendor1@demo.com", password: pw, role: "vendor",
  });
  const vendorUser2 = await User.create({
    name: "Nour Florals", email: "vendor2@demo.com", password: pw, role: "vendor",
  });
  const ownerUser = await User.create({
    name: "Hassan Properties", email: "owner@demo.com", password: pw, role: "venue_owner",
  });

  // Vendors
  const vendor1 = await Vendor.create({
    user: vendorUser1._id,
    companyName: "Karim Catering Co.",
    suppliesOffered: ["Catering", "Beverages"],
    mainLocation: "Cairo",
    contactInfo: { phone: "+20 100 000 0001", email: "vendor1@demo.com" },
    pricingList: [
      { item: "Buffet per head", price: 250, unit: "per guest" },
      { item: "Coffee station", price: 1500, unit: "per event" },
    ],
  });
  const vendor2 = await Vendor.create({
    user: vendorUser2._id,
    companyName: "Nour Florals",
    suppliesOffered: ["Flowers", "Decor"],
    mainLocation: "Giza",
    contactInfo: { phone: "+20 100 000 0002", email: "vendor2@demo.com" },
    pricingList: [{ item: "Centerpiece", price: 400, unit: "each" }],
  });

  // Sourcing requests
  const req1 = await SourcingRequest.create({
    vendor: vendor1._id, organizer: organizer._id,
    eventName: "Tech Summit 2026", eventLocation: "Cairo",
    requestedItems: [{ item: "Buffet per head", quantity: 200 }],
    deliveryDate: new Date(Date.now() + 7 * 864e5), status: "Pending",
  });
  await SourcingRequest.create({
    vendor: vendor1._id, organizer: organizer._id,
    eventName: "Wedding Gala", eventLocation: "Cairo",
    requestedItems: [{ item: "Coffee station", quantity: 1 }],
    deliveryDate: new Date(Date.now() + 14 * 864e5), status: "Accepted",
  });
  await SourcingRequest.create({
    vendor: vendor2._id, organizer: organizer._id,
    eventName: "Tech Summit 2026", eventLocation: "Cairo",
    requestedItems: [{ item: "Centerpiece", quantity: 20 }],
    deliveryDate: new Date(Date.now() + 7 * 864e5), status: "Pending",
  });

  // Delivery + invoice for the accepted request
  const accepted = await SourcingRequest.findOne({ status: "Accepted" });
  const delivery = await Delivery.create({
    sourcingRequest: accepted._id, vendor: vendor1._id,
    eventName: accepted.eventName, status: "Out for Delivery",
  });
  await Invoice.create({
    vendor: vendor1._id, organizer: organizer._id, delivery: delivery._id,
    eventName: accepted.eventName,
    lineItems: [{ description: "Coffee station", quantity: 1, unitPrice: 1500 }],
    total: 1500, status: "Pending Review",
  });

  // Venues
  const venue1 = await Venue.create({
    owner: ownerUser._id, name: "Nile View Hall", description: "Spacious riverside hall",
    location: "Cairo", capacity: 300, sizeSqm: 450,
    amenities: ["Parking", "AV System", "Catering Kitchen"], pricePerDay: 12000,
    photos: [], status: "active",
  });
  const venue2 = await Venue.create({
    owner: ownerUser._id, name: "Garden Pavilion", description: "Outdoor garden space",
    location: "Giza", capacity: 150, sizeSqm: 600,
    amenities: ["Garden", "Stage"], pricePerDay: 8000, photos: [], status: "active",
  });

  // Booking requests
  await BookingRequest.create({
    venue: venue1._id, owner: ownerUser._id, organizer: organizer._id,
    eventType: "Conference", date: new Date(Date.now() + 30 * 864e5),
    expectedAttendees: 250, specialRequirements: "Stage + projector", status: "Pending",
  });
  await BookingRequest.create({
    venue: venue2._id, owner: ownerUser._id, organizer: organizer._id,
    eventType: "Wedding", date: new Date(Date.now() + 45 * 864e5),
    expectedAttendees: 120, status: "Approved",
  });

  console.log("Seed complete.");
  console.log("Logins (password: password123):");
  console.log("  organizer@demo.com | vendor1@demo.com | vendor2@demo.com | owner@demo.com");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });
