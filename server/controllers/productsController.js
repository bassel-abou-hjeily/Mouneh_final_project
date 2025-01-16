const Product = require('../models/productModel');
const User = require('../models/userModel');
const Notification = require("../models/notificationModel");
const fs = require("fs");

// Add a new product
exports.addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
       
        res.status(201).send({
            success: true,
            message: "Product added successfully",
            product: newProduct,  // Return the newly created product
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: error.message,
        });
    }
};
exports.editProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct, // Return the updated product
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).send({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
};
// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("seller");
        res.send({
            success: true,
            data: product,

        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })

    }
};
// Update product status
exports.updateProductStatus =
    async (req, res) => {
        try {
            const { status } = req.body;
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { status });
            res.status(200).send({
                success: true,
                message: "Product status updated successfully",
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: error.message,
            });
        }
    };
exports.getProducts = async (req, res) => {
    try {
        const { seller, category = [], status, search } = req.body; // Include search from the request
        let filters = {};

        // Existing filters (seller, status, category)
        if (seller) {
            filters.seller = seller;
        }
        if (status) {
            filters.status = status;
        }
        if (category.length > 0) {
            filters.category = { $in: category };
        }

        // Add search functionality
        if (search) {
            filters.$or = [
                { name: { $regex: search, $options: "i" } }, // Search in the name field (case-insensitive)
                { description: { $regex: search, $options: "i" } }, // Search in the description field (case-insensitive)
            ];
        }

        // Fetch products based on filters
        const products = await Product.find(filters)
            .populate("seller") // If you need seller details
            .sort({ createdAt: -1 }); // Sort by creation date

        res.send({
            success: true,
            data: products,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};