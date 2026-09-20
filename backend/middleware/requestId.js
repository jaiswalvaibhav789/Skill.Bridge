const crypto = require('crypto');

/**
 * Attaches a unique request ID to req and res headers for end-to-end distributed tracing.
 */
const requestId = (req, res, next) => {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = reqId;
  res.setHeader('X-Request-ID', reqId);
  next();
};

module.exports = requestId;
