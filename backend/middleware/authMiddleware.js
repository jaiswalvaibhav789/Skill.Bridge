const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

/**
 * Protect routes - Verifies JWT Bearer Token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.error(
      res,
      'Not authorized to access this route. Missing authentication token.',
      401,
      'UNAUTHORIZED'
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'skillbridge_secret_fallback_key');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return ApiResponse.error(
        res,
        'The user belonging to this token no longer exists.',
        401,
        'USER_NOT_FOUND'
      );
    }
    next();
  } catch (err) {
    return ApiResponse.error(
      res,
      'Not authorized. Invalid or expired token.',
      401,
      'INVALID_TOKEN'
    );
  }
};

/**
 * Grant access to specific roles
 * @param  {...string} roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'Authentication required before role check', 401, 'UNAUTHORIZED');
    }
    const userRole = req.user.role ? req.user.role.toLowerCase() : '';
    const allowedRoles = roles.map(r => r.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return ApiResponse.error(
        res,
        `Role [${req.user.role}] is not authorized to perform this operation`,
        403,
        'FORBIDDEN'
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
