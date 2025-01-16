
const router = require('express').Router();
const Product = require('../models/productModel');
const User = require('../models/userModel')
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const Notification = require("../models/notificationModel");
const fs = require("fs");
const { title } = require('process');
const productsController = require('../controllers/productsController');

// Add a new product
router.post('/add-product', authMiddleware, productsController.addProduct);

// Edit a product
router.put("/edit-product/:id", authMiddleware, productsController.editProduct);

// Delete a product
router.delete('/delete-product/:id', authMiddleware, productsController.deleteProduct);


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
router.get("/get-product-by-id/:id", authMiddleware, productsController.getProductById)
// Update Product Status
router.put("/update-product-status/:id", authMiddleware, productsController.updateProductStatus);

// Backend: Get All Products
router.post("/get-products", authMiddleware, productsController.getProducts);
module.exports = router;


