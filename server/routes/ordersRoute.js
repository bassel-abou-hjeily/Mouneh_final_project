
const router = require('express').Router();
const Order = require('../models/orderModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Place a new order
router.post('/place-new-order', authMiddleware, async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.send({ success: true, message: "Order placed successfully", data: newOrder });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

router.post('/get-all-orders', authMiddleware, async (req, res) => {
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
}); router.put('/update-order-status/:id', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered','Received','Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).send({ success: false, message: 'Invalid order status' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status });

        if (!updatedOrder) {
            return res.status(404).send({ success: false, message: 'Order not found' });
        }

        res.status(200).send({
            success: true,
            message: "Order status updated successfully",
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});
module.exports = router;
