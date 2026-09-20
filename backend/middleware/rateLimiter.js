const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/apiResponse');

// Standard API Rate Limiter (500 requests per minute in dev, 5000 in test)
const standardApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 5000 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Too many requests from this IP, please try again after 60 seconds',
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  }
});

// Sensitive Auth Rate Limiter (200 requests per 15 min in dev, 2000 in test)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 2000 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Too many authentication attempts. Please try again after 15 minutes',
      429,
      'AUTH_RATE_LIMIT_EXCEEDED'
    );
  }
});

module.exports = {
  standardApiLimiter,
  authLimiter
};
