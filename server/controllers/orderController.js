const Order = require('../models/orderModel');

// Place a new order
exports.placeNewOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.send({ success: true, message: "Order placed successfully", data: newOrder });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};
// Get all orders with optional filters
exports.getAllOrders = async (req, res) => {
    try {
        const { product, seller, buyer } = req.body; // Use query parameters for optional filters
        const filters = {}; // Filter by the authenticated user's ID (buyer)

        // Add optional filters dynamically
        if (product) { filters.product = product; }
        if (seller) { filters.seller = seller; }
        if (buyer) { filters.buyer = buyer }

        const orders = await Order.find(filters)
            .populate('product')
            .populate('buyer')
            .populate('seller').sort({ createdAt: -1 });

        res.send({ success: true, data: orders });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};