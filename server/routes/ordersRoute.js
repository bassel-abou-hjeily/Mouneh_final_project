
const router = require('express').Router();
const Order = require('../models/orderModel');
const authMiddleware = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');
// Place a new order
router.post('/place-new-order', authMiddleware,orderController.placeNewOrder);

router.post('/get-all-orders', authMiddleware,orderController.getAllOrders);
router.put('/update-order-status/:id', authMiddleware, async (req, res) => {
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
