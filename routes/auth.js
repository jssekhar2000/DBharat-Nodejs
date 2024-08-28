require("dotenv").config({ path: "./.env" });
const express = require("express");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const sendMailOnRegister = require('../services/mail');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup route
router.post("/register", async (req, res) => {
  const { name, phone, collegeId, email, password } = req.body;

  try {
    let student = await Student.findOne({ email });
    if (student) {
      return res
        .status(400)
        .json({ message: "User with this username or email already exists" });
    }

    student = new Student({ name, email, password, collegeId, phone });
    await student.save();

    const payload = { userId: student.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
    
    sendMailOnRegister(email, name);
    
    res.status(201).json({
        data: {
          token: token,
        },
      });
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      // Mongoose validation error
      return res.status(400).json({ message: err.message });
    }

    if (err.code && err.code === 11000) {
      // Duplicate key error (e.g., email already exists)
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generic server error
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { userId: student.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
        data: {
          token: token,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
