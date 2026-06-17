import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import venueRoutes from "./routes/venue.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import taskRoutes from "./routes/task.routes.js";
import guestRoutes from "./routes/guest.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Event Management Backend is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/feedback", feedbackRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (err) {
  console.error("Failed to start server:", err);
}