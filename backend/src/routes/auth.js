const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();



// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ msg: "Email already used" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    return res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (e) {
    return res.status(500).json({ msg: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ uid: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    

    return res
    .type("application/json")
    .json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (e) {
    return res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/auth/me (protected)
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.uid).select("-password");
  res.json(user);
});

module.exports = router;
