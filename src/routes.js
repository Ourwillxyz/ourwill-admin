import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { initDB } from "./db.js";
import { auth, requireAdmin } from "./middleware.js";

const router = express.Router();
let db;

// Initialize DB before using routes
initDB().then(d => { db = d; });

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get("SELECT * FROM users WHERE username = ?", username);
  if (!user) return res.json({ success: false, error: "Invalid credentials" });
  const passOk = await bcrypt.compare(password, user.password);
  if (!passOk) return res.json({ success: false, error: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, username: user.username, isAdmin: !!user.isAdmin, group: user.groupName || null },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
  res.json({ success: true, token });
});

// Current user info
router.get("/me", auth, async (req, res) => {
  const user = await db.get("SELECT id, username, isAdmin, groupName FROM users WHERE id = ?", req.user.id);
  if (!user) return res.status(404).json({ success: false, error: "User not found" });
  res.json({ success: true, user: { ...user, isAdmin: !!user.isAdmin, group: user.groupName } });
});

// List users (admin only)
router.get("/users", auth, requireAdmin, async (req, res) => {
  const users = await db.all("SELECT id, username, isAdmin, groupName FROM users");
  res.json({ success: true, users: users.map(u => ({
    ...u,
    isAdmin: !!u.isAdmin,
    group: u.groupName
  })) });
});

// Assign/change group (admin only)
router.put("/users/:id/group", auth, requireAdmin, async (req, res) => {
  const { group } = req.body;
  const validGroups = ["candidate", "agent", "returning officer", "observer"];
  if (!validGroups.includes(group)) {
    return res.status(400).json({ success: false, error: "Invalid group" });
  }
  await db.run("UPDATE users SET groupName = ? WHERE id = ?", group, req.params.id);
  res.json({ success: true });
});

// Delete user (admin only)
router.delete("/users/:id", auth, requireAdmin, async (req, res) => {
  await db.run("DELETE FROM users WHERE id = ?", req.params.id);
  res.json({ success: true });
});

// (Optional) Create new user (admin only)
router.post("/users", auth, requireAdmin, async (req, res) => {
  const { username, password, group, isAdmin } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, error: "Username & password required" });
  try {
    await db.run(
      "INSERT INTO users (username, password, isAdmin, groupName) VALUES (?, ?, ?, ?)",
      username, await bcrypt.hash(password, 10), !!isAdmin ? 1 : 0, group || null
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: "User exists or error" });
  }
});

export default router;
