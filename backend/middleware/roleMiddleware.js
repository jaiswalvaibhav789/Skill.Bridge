const ApiResponse = require('../utils/apiResponse');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(
        res,
        'Authentication required before checking role authorization.',
        401,
        'UNAUTHORIZED'
      );
    }

    const userRole = (req.user.role || '').toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());

    if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
      return ApiResponse.error(
        res,
        `User role '${req.user.role}' is not authorized to access this route.`,
        403,
        'FORBIDDEN'
      );
    }
    next();
  };
};

module.exports = { authorize };
