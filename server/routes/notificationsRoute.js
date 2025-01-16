const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Notification = require('../models/notificationModel');
//add a Notification
router.post('/notify', authMiddleware,notificationController.addNotification);

router.get("/get-all-notifications", authMiddleware,notificationController.getAllNotifications);

//delete a Notification
router.delete("/delete-Notification/:id", authMiddleware, notificationController.deleteNotification)
//read all Notification  by user
router.put('/read-all-notifiations', authMiddleware,notificationController.markAllNotificationsAsRead )
module.exports = router;