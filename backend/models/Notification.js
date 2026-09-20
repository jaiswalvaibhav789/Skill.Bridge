const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'APPLICATION_UPDATE',
      'OPPORTUNITY_MATCH',
      'ASSESSMENT_COMPLETED',
      'SKILL_ENDORSED',
      'MENTOR_FEEDBACK',
      'SYSTEM_ALERT'
    ],
    default: 'SYSTEM_ALERT'
  },
  link: {
    type: String,
    default: ''
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
