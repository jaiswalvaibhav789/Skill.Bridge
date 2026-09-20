/**
 * Custom Operational Error Class
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, errorCode = 'SERVER_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg = 'Bad Request', details = null) {
    return new ApiError(msg, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(msg = 'Unauthorized access', details = null) {
    return new ApiError(msg, 401, 'UNAUTHORIZED', details);
  }

  static forbidden(msg = 'Access forbidden', details = null) {
    return new ApiError(msg, 403, 'FORBIDDEN', details);
  }

  static notFound(msg = 'Resource not found', details = null) {
    return new ApiError(msg, 404, 'NOT_FOUND', details);
  }

  static conflict(msg = 'Resource conflict', details = null) {
    return new ApiError(msg, 409, 'CONFLICT', details);
  }

  static unprocessable(msg = 'Unprocessable Entity', details = null) {
    return new ApiError(msg, 422, 'UNPROCESSABLE_ENTITY', details);
  }

  static internal(msg = 'Internal Server Error', details = null) {
    return new ApiError(msg, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}

module.exports = ApiError;
