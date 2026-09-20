const ApiResponse = require('../utils/apiResponse');

/**
 * Production Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || 'SERVER_ERROR';
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // Log error with request ID
  const reqId = req.id || 'N/A';
  console.error(`[Error Trace] [ReqID: ${reqId}] [${req.method} ${req.originalUrl}]:`, err);

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    errorCode = 'RESOURCE_NOT_FOUND';
    message = `Resource not found with specified identifier: ${err.value}`;
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = 'DUPLICATE_KEY_ERROR';
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for '${field}'. Must be unique across records.`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    errorCode = 'VALIDATION_ERROR';
    const issues = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
    message = 'Data validation failed against database schema';
    details = issues;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'Authentication token is malformed or invalid';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired. Please refresh session';
  }

  return ApiResponse.error(res, message, statusCode, errorCode, details);
};

module.exports = errorHandler;
