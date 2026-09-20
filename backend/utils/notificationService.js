const Notification = require('../models/Notification');

/**
 * Creates and persists a single user notification
 * @param {Object} params
 * @param {string|ObjectId} params.recipient - User ObjectId
 * @param {string} params.title - Notification header
 * @param {string} params.message - Descriptive message body
 * @param {string} [params.type='SYSTEM_ALERT'] - Notification category enum
 * @param {string} [params.link=''] - Frontend destination link
 * @returns {Promise<Object|null>} Created notification document or null on error
 */
async function createNotification({ recipient, title, message, type = 'SYSTEM_ALERT', link = '' }) {
  try {
    if (!recipient || !title || !message) {
      console.warn('[NotificationService] Missing required parameters for notification dispatch');
      return null;
    }

    const notification = await Notification.create({
      recipient,
      title: title.trim(),
      message: message.trim(),
      type,
      link: link.trim()
    });

    return notification;
  } catch (error) {
    console.error('[NotificationService Error]', error.message);
    return null;
  }
}

/**
 * Creates multiple notifications in bulk
 * @param {Array<Object>} items
 * @returns {Promise<number>} Count of created notifications
 */
async function createBulkNotifications(items = []) {
  try {
    if (!items.length) return 0;
    const result = await Notification.insertMany(items, { ordered: false });
    return result.length;
  } catch (error) {
    console.error('[NotificationService Bulk Error]', error.message);
    return 0;
  }
}

module.exports = {
  createNotification,
  createBulkNotifications
};
