const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust the path if necessary
const { promisify } = require('util'); // To promisify jwt.verify function

const handleError = (res, statusCode, message) => {
    return res.status(statusCode).json({
        status: 'fail',
        message: message,
    });
};

// Middleware to protect routes
module.exports = async (req, res, next) => {
    try {
        let token;

        // Check if the authorization header exists and starts with "Bearer"
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // Extract token
        }

        // If no token is provided, return an error
        if (!token) {
            return handleError(res, 401, "You are not logged in. Please provide a valid token.");
        }

        // Verify the token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Check if the user exists in the database
        const currentUser = await User.findById(decoded.userId).select('_id'); // Fetch only necessary fields
        if (!currentUser) {
            return handleError(res, 401, "User belonging to this token no longer exists.");
        }

        // Attach the user ID to the request object
        req.userId = currentUser._id;

        next();
    } catch (err) {
        console.error("Error during authentication:", err);

        // Handle token-specific errors
        if (err.name === 'JsonWebTokenError') {
            return handleError(res, 401, "Invalid or expired token. Please log in again.");
        }

        if (err.name === 'TokenExpiredError') {
            return handleError(res, 401, "Token has expired. Please log in again.");
        }

        // Handle unexpected errors (e.g., internal server errors)
        return handleError(res, 500, "An unexpected error occurred. Please try again later.");
    }
};

