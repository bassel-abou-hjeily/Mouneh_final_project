const Notification = require('../models/notificationModel');

// Add a new notification
exports.addNotification = async (req, res) => {
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
};
// Get all notifications for a specific user
exports.getAllNotifications = async (req, res) => {
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
};
// Delete a notification by ID
exports.deleteNotification = async (req, res) => {
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
};
// Mark all notifications as read for a specific user
exports.markAllNotificationsAsRead = async (req, res) => {
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
};