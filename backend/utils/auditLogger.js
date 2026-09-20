const AuditLog = require('../models/AuditLog');

/**
 * Asynchronously and defensively records an immutable audit log event
 * @param {Object} params
 * @param {string|ObjectId} [params.actor] - User ObjectId who initiated the action
 * @param {string} [params.actorRole='SYSTEM'] - Role of the actor
 * @param {string} params.action - Action identifier (e.g. APPLICATION_STATUS_CHANGE, CREDENTIAL_SEAL_MINTED)
 * @param {string} params.entityType - Target entity name (e.g. Application, StudentProfile, Opportunity)
 * @param {string|ObjectId} [params.entityId] - Target entity identifier
 * @param {string} [params.ipAddress='127.0.0.1'] - Client IP address
 * @param {Object} [params.details={}] - Supplemental event metadata
 * @returns {Promise<Object|null>}
 */
async function logAuditEvent({
  actor = null,
  actorRole = 'SYSTEM',
  action,
  entityType,
  entityId = null,
  ipAddress = '127.0.0.1',
  details = {}
}) {
  try {
    if (!action || !entityType) {
      console.warn('[AuditLogger] Action and EntityType are required for audit trail');
      return null;
    }

    // Defensive serialization of details
    let safeDetails = details;
    if (typeof details === 'object' && details !== null) {
      safeDetails = JSON.parse(JSON.stringify(details));
    }

    const auditEntry = await AuditLog.create({
      actor: actor || undefined,
      actorRole,
      action,
      entityType,
      entityId: entityId || undefined,
      ipAddress,
      details: safeDetails
    });

    return auditEntry;
  } catch (error) {
    // Non-blocking: audit failure must never break core user flows
    console.error('[AuditLogger Error]', error.message);
    return null;
  }
}

module.exports = {
  logAuditEvent
};
