const AuditLog = require('../models/AuditLog');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get paginated and filtered system audit logs
// @route   GET /api/audit-logs
// @access  Private (Admin)
exports.getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const { action, entityType, actorRole, startDate, endDate } = req.query;

    const filter = {};
    if (action) {
      filter.action = action;
    }
    if (entityType) {
      filter.entityType = entityType;
    }
    if (actorRole) {
      filter.actorRole = actorRole;
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [total, logs] = await Promise.all([
      AuditLog.countDocuments(filter),
      AuditLog.find(filter)
        .populate('actor', 'email role')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
    ]);

    return ApiResponse.success(res, {
      logs,
      total,
      page,
      pages: Math.ceil(total / limit) || 1
    }, 'Audit logs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get forensic summary telemetry of audit events
// @route   GET /api/audit-logs/summary
// @access  Private (Admin)
exports.getAuditSummary = async (req, res, next) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      totalEvents,
      eventsLast24h,
      roleDistribution,
      actionDistribution,
      entityDistribution
    ] = await Promise.all([
      AuditLog.countDocuments(),
      AuditLog.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
      AuditLog.aggregate([
        { $group: { _id: '$actorRole', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      AuditLog.aggregate([
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ]),
      AuditLog.aggregate([
        { $group: { _id: '$entityType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    return ApiResponse.success(res, {
      totalEvents,
      eventsLast24h,
      roleDistribution: roleDistribution.map(r => ({ role: r._id || 'SYSTEM', count: r.count })),
      topActions: actionDistribution.map(a => ({ action: a._id, count: a.count })),
      entityDistribution: entityDistribution.map(e => ({ entityType: e._id, count: e.count })),
      immutableStandard: 'W3C / Ministry of Ayush Statutory Governance Trail (Append-Only)'
    }, 'Audit log summary telemetry retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get individual audit log detail with full payload snapshot
// @route   GET /api/audit-logs/:id
// @access  Private (Admin)
exports.getAuditLogById = async (req, res, next) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate('actor', 'email role');
    if (!log) {
      return ApiResponse.error(res, 'Audit log entry not found', 404, 'NOT_FOUND');
    }
    return ApiResponse.success(res, log, 'Audit log entry retrieved successfully');
  } catch (error) {
    next(error);
  }
};
