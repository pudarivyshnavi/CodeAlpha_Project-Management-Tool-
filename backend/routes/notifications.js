const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getNotifications)
  .patch(protect, markAllAsRead);

router.route('/:notificationId')
  .patch(protect, markAsRead)
  .delete(protect, deleteNotification);

module.exports = router;
