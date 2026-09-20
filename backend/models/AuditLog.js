const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actorRole: {
    type: String,
    default: 'SYSTEM'
  },
  action: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: { createdAt: true, updatedAt: false } }); // Immutable audit log

AuditLogSchema.index({ entityType: 1, entityId: 1 });
AuditLogSchema.index({ actor: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
