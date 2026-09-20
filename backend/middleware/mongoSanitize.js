/**
 * Zero-Dependency NoSQL Injection Defense Middleware
 * Recursively inspects and sanitizes request body, query parameters, and route params
 * by removing any keys starting with '$' or containing '.' which could be interpreted
 * as MongoDB query operators or path traversals.
 */

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // If key starts with '$' or contains '.', strip it to prevent operator injection
    if (/^\$|\./.test(key)) {
      continue;
    }
    clean[key] = sanitizeObject(value);
  }

  return clean;
}

const mongoSanitize = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};

module.exports = {
  mongoSanitize,
  sanitizeObject
};
