const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Notification = require('../models/notificationModel');
//add a Notification
router.post('/notify', authMiddleware, async (req, res) => {
    try {
        const newNotification = new Notification(req.body);
        await newNotification.save();
        res.send({
            success: true,
            message: "Notification added successfully",

        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
});
router.get("/get-all-notifications", authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.userId, // Use the userId set in middleware
        }).sort({ createdAt: -1 });
        res.send({
            success: true,
            data: notifications,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

//delete a Notification
router.delete("/delete-Notification/:id", authMiddleware, async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.send({
            success: true,
            message: "Notification  deleted successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})
//read all Notification  by user
router.put('/read-all-notifiations', authMiddleware, async (req, res) => {
    try {
        await Notification.updateMany({
            /* user: req.body.userId, read: false*/ 
            user: req.userId, read: false
        }, { $set: { read: true } });
        res.send({
            success: true,
            message: "All notifications marked as read",
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})
module.exports = router;