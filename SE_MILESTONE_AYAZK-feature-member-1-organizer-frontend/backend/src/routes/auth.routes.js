import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import { signToken } from "../middleware/auth.js";

const router = express.Router();

// Register (vendor or venue_owner self-registration) - Journeys 13 & 22
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!["vendor", "venue_owner"].includes(role)) {
      return res.status(400).json({ message: "Self-registration allowed for vendor or venue_owner only" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    // Auto-create vendor profile shell so they can fill details later
    if (role === "vendor") {
      await Vendor.create({ user: user._id, companyName: companyName || name });
    }

    res.status(201).json({ token: signToken(user), user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.active) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ token: signToken(user), user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const safeUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

export default router;
