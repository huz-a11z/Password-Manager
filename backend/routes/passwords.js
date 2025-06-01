const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/passwords/add
router.post("/passwords/add", authMiddleware, async (req, res) => {
  const { site, username, encryptedPassword } = req.body;

  if (!site || !username || !encryptedPassword) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.passwords.push({ site, username, encryptedPassword });
    await user.save();

    res.status(201).json({ message: "Password saved successfully" });
  } catch (err) {
    console.error("Error saving password:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/passwords
router.post("/passwords", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.passwords);
  } catch (err) {
    console.error("Error fetching passwords:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// PUT /api/passwords/update/:passwordId
router.put("/passwords/update/:passwordId", authMiddleware, async (req, res) => {
  const { passwordId } = req.params;
  const { site, username, encryptedPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const entry = user.passwords.id(passwordId);
    if (!entry) return res.status(404).json({ message: "Password not found" });

    entry.site = site;
    entry.username = username;
    entry.encryptedPassword = encryptedPassword;

    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/passwords/delete/:passwordId
router.delete("/passwords/delete/:passwordId", authMiddleware, async (req, res) => {
  const { passwordId } = req.params;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.passwords = user.passwords.filter(p => p._id.toString() !== passwordId);
    await user.save();

    res.status(200).json({ message: "Password deleted" });
  } catch (err) {
    console.error("Error deleting password:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
