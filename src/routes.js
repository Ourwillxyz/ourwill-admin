import express from "express";
import bcrypt from "bcryptjs";
import User from "./models/user.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "observer"
    });
    await user.save();

    res.status(201).json({ message: "Registration successful." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
