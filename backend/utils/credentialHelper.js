const crypto = require('crypto');

/**
 * Deterministically generates a SHA-256 cryptographic credential hash
 * @param {Object} params
 * @param {string} params.studentId
 * @param {string} params.skillId
 * @param {number} params.score
 * @param {string} params.endorsedBy
 * @param {string|Date} params.timestamp
 * @returns {string} 64-character SHA-256 hex digest
 */
function generateCredentialHash({ studentId, skillId, score, endorsedBy, timestamp }) {
  const normalizedTime = timestamp ? new Date(timestamp).toISOString().split('T')[0] : '2025-01-01';
  const payload = `${studentId}:${skillId}:${Math.round(score)}:${endorsedBy || 'INSTITUTION_VERIFIED'}:${normalizedTime}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Validates whether a provided hash matches the record parameters
 * @param {Object} params
 * @returns {boolean}
 */
function verifyCredentialIntegrity({ studentId, skillId, score, endorsedBy, timestamp, providedHash }) {
  if (!providedHash || typeof providedHash !== 'string') return false;
  const expectedHash = generateCredentialHash({ studentId, skillId, score, endorsedBy, timestamp });
  return expectedHash.toLowerCase() === providedHash.trim().toLowerCase();
}

/**
 * Generates simulated blockchain / national registry audit metadata
 * @param {string} hash
 * @param {Date|string} issuedAt
 * @returns {Object}
 */
function generateLedgerMetadata(hash, issuedAt) {
  // Deterministic block number from first 6 hex digits of the hash
  const blockNumber = 100000 + (parseInt((hash || 'a1b2c3').substring(0, 6), 16) % 900000);
  
  return {
    blockNumber,
    digestAlgorithm: 'SHA-256 (256-bit Cryptographic Hash)',
    entropyBits: 256,
    tamperEvident: true,
    ledgerNetwork: 'Ayush National Digital Health & Education Credential Registry (ANDH-ECR)',
    governingAuthority: 'National Commission for Indian System of Medicine (NCISM) & Ministry of Ayush',
    standard: 'W3C Verifiable Credentials Standard v1.1 Compatible',
    timestamp: issuedAt ? new Date(issuedAt).toISOString() : new Date().toISOString()
  };
}

module.exports = {
  generateCredentialHash,
  verifyCredentialIntegrity,
  generateLedgerMetadata
};
