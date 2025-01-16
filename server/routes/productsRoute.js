
const router = require('express').Router();
const Product = require('../models/productModel');
const User = require('../models/userModel')
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const Notification = require("../models/notificationModel");
const fs = require("fs");
const { title } = require('process');
// Add a new product
router.post('/add-product', authMiddleware, async (req, res) => {
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
});

// Edit a product
router.put("/edit-product/:id", authMiddleware, async (req, res) => {
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
});

// Delete a product
router.delete('/delete-product/:id', authMiddleware, async (req, res) => {
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
});


// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./uploads"); // Save files to "uploads" folder
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post(
    "/upload-image-to-product",
    authMiddleware,
    upload.single("file"),
    async (req, res) => {
        try {
            const productId = req.body.productId;

            // Read the file and convert it to Base64
            const filePath = req.file.path;
            const base64Image = fs.readFileSync(filePath, { encoding: "base64" });

            // Add Base64 image to the product in the database
            await Product.findByIdAndUpdate(productId, {
                $push: { images: `data:${req.file.mimetype};base64,${base64Image}` },
            });

            // Remove the file from the server after encoding
            fs.unlinkSync(filePath);

            res.send({
                success: true,
                message: "Image uploaded and saved successfully as Base64",
            });
        } catch (error) {
            res.send({
                success: false,
                message: error.message,
            });
        }
    }
);
router.get("/get-product-by-id/:id", async (req, res) => {
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
})
// Update Product Status
router.put("/update-product-status/:id", authMiddleware, async (req, res) => {
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
});
// Backend: Get All Products
router.post("/get-products", async (req, res) => {
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
});
module.exports = router;


