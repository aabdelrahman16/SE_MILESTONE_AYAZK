require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Event Management Backend is running");
});

app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/venues", require("./routes/venueRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/guests", require("./routes/guestRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.log(err));