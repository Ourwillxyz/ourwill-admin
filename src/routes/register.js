import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, county, subcounty, ward, polling_centre, password, role } = req.body;
    // Validate required fields
    if (!name || !email || !mobile || !county || !subcounty || !ward || !polling_centre || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    // Check if user exists by email or mobile
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(409).json({ message: "Email or mobile already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare for verification (optional, implement later)
    const verificationCode = crypto.randomBytes(20).toString("hex");

    const user = new User({
      name,
      email,
      mobile,
      county,
      subcounty,
      ward,
      polling_centre,
      password: hashedPassword,
      role: role || "observer",
      isVerified: false,
      verificationCode
    });
    await user.save();

    // TODO: Send verification email/SMS using verificationCode

    res.status(201).json({ message: "Registration successful. Please verify your email or mobile to activate your account." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
