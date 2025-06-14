const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const { generateToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");

// Register
router.post("/signup", async (req, res) => {
  const { email, masterKey } = req.body;

  try {
    console.log("trying here")
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedMasterKey = await bcrypt.hash(masterKey, 10);

    const user = new User({ email, masterKey: hashedMasterKey, passwords: [] });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, masterKey } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });
    else console.log("User exists")

    const isMatch = await bcrypt.compare(masterKey, user.masterKey);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,    // MUST be false on HTTP localhost (no HTTPS)
      sameSite: "None",  // "lax" or "strict" works on localhost without HTTPS
      maxAge: 24 * 60 * 60 * 1000,  // e.g. 1 day
      path: "/",
    })
      .status(200)
      .json({ message: "Login successful", userId: user._id });
  } catch (err) {
    console.log(err)
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "Strict"
  });
  res.sendStatus(200);
});


module.exports = router;
