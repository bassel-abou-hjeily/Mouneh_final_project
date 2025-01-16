
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require("../middlewares/authMiddleware");

// New User Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            //return res.status(400).json({ success: false, message: "All fields are required" });
            throw new Error("All fields are required")
        }

        const user = await User.findOne({ email: email });
        if (user) {
            // return res.status(400).json({ success: false, message: "User already exists" });
            throw new Error("User already exists")
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            //return res.status(400).json({ success: false, message: "Email and password are required" });
            throw new Error("Email and password are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            // return res.status(404).json({ success: false, message: "User not found" });
            throw new Error("Invalid password and Email ")
        }

        if (user.status !== "active") {
            // return res.status(403).json({ success: false, message: "Account blocked, contact admin" });
            throw new Error("the user account is blocked,please contact admin");
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // return res.status(400).json({ success: false, message: "Invalid password or Email" });
            throw new Error("Invalid password and Email ");
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: token
        });
    } catch (error) {
        // res.status(500).json({ success: false, message: error.message });
        res.send({ success: false, message: error.message });
    }
});

// Get Current User
router.get("/get-current-user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User fetched successfully", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get All Users (Admin)
router.get('/get-users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Update User Status (Admin)
router.put("/update-user-status/:id", authMiddleware, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
