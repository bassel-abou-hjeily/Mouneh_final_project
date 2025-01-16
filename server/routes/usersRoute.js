
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require("../middlewares/authMiddleware");
const {
    registerUser,
    loginUser,
    getCurrentUser,
    getUsers,
    updateUserStatus
} = require('../controllers/userController');

// New User Registration
router.post('/register', registerUser);

// User Login
router.post('/login',loginUser)
// Get Current User
router.get("/get-current-user", authMiddleware,
    getCurrentUser);

// Get All Users (Admin)
router.get('/get-users', authMiddleware,getUsers)

// Update User Status (Admin)
router.put("/update-user-status/:id", authMiddleware, updateUserStatus);

module.exports = router;
