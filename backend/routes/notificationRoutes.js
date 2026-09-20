const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMyNotifications);
router.put('/mark-all-read', markAllAsRead);
router.delete('/clear-all', clearAllRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
