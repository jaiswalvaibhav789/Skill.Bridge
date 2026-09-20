const express = require('express');
const router = express.Router();
const {
  getAuditLogs,
  getAuditSummary,
  getAuditLogById
} = require('../controllers/auditLogController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAuditLogs);
router.get('/summary', getAuditSummary);
router.get('/:id', getAuditLogById);

module.exports = router;
