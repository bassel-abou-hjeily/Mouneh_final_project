
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
          required: true,
          trim:true,
    },
    email: {
      type: String,
        required: true,
      trim:true,
    },
    password: {
      type: String,
        required: true,
        trim:true,
        },
      role: {
        type: String,
            default:"user"
    },
        status: {
            type: String,
            default:"active"
            
        },
        profilePicture: {
            type: String,
            default:""
        }
  },
  { timestamps: true } // Correct option name
);

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
