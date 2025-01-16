
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        default: [],
        required: true,
    },
    deliveryAvailable: {
        type: Boolean,
        default: false,
        required: true,  // Corrected 'require' to 'required'
    },
    warrantyAvailable : {
        type: Boolean,
        default: false,
        required: true,  // Corrected 'require' to 'required'
    },
    glutenFree : {
        type: Boolean,
        default: false,
        required: true,  // Corrected 'require' to 'required'
    },
  sugarFree : {
        type: Boolean,
        default: false,
        required: true,  // Corrected 'require' to 'required'
    },
  localProduct : {
        type: Boolean,
        default: false,
        required: true,  // Corrected 'require' to 'required'
    },
  seasonalProduct : {
        type: Boolean,
        default: false,
        required: true,  // Corrected 'require' to 'required'
    },
  halal : {
        type: Boolean,
        default: false,
        required: true,  // Corrected 'require' to 'required'
    },
  veganFriendly : {
        type: Boolean,
        default: false,
        required: true,  // Corrected 'require' to 'required'
    },
  naturalProduct : {
        type: Boolean,
        default: false,
        required: true,  // Corrected 'require' to 'required'
    },
  noPreservatives : {
        type: Boolean,
        default: false,
        required: true,  // Corrected 'require' to 'required'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        default: "pending",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("products", productSchema);
