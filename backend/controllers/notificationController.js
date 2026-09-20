const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get authenticated user's notifications
// @route   GET /api/notifications
// @access  Private
exports.getMyNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const unreadOnly = req.query.unreadOnly === 'true';

    const filter = { recipient: req.user.id };
    if (unreadOnly) {
      filter.isRead = false;
    }

    const [total, unreadCount, notifications] = await Promise.all([
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: req.user.id, isRead: false }),
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
    ]);

    return ApiResponse.success(res, {
      notifications,
      total,
      unreadCount,
      page,
      pages: Math.ceil(total / limit) || 1
    }, 'Notifications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return ApiResponse.error(res, 'Notification not found', 404, 'NOT_FOUND');
    }

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    return ApiResponse.success(res, { notification, unreadCount }, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );

    return ApiResponse.success(res, {
      modifiedCount: result.modifiedCount,
      unreadCount: 0
    }, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id
    });

    if (!notification) {
      return ApiResponse.error(res, 'Notification not found', 404, 'NOT_FOUND');
    }

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    return ApiResponse.success(res, { unreadCount }, 'Notification deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all read notifications
// @route   DELETE /api/notifications/clear-all
// @access  Private
exports.clearAllRead = async (req, res, next) => {
  try {
    const result = await Notification.deleteMany({
      recipient: req.user.id,
      isRead: true
    });

    return ApiResponse.success(res, {
      deletedCount: result.deletedCount
    }, 'Read notifications cleared successfully');
  } catch (error) {
    next(error);
  }
};
