/**
 * Standardized API Response Helper
 */
class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200, meta = null) {
    const payload = {
      success: true,
      statusCode,
      message,
      data
    };

    if (meta) {
      payload.meta = meta;
    }

    return res.status(statusCode).json(payload);
  }

  static created(res, data = null, message = 'Resource created successfully', meta = null) {
    return ApiResponse.success(res, data, message, 201, meta);
  }

  static error(res, message = 'An error occurred', statusCode = 500, errorCode = 'SERVER_ERROR', details = null) {
    const payload = {
      success: false,
      statusCode,
      error: errorCode,
      message
    };

    if (details) {
      payload.details = details;
    }

    return res.status(statusCode).json(payload);
  }
}

module.exports = ApiResponse;
