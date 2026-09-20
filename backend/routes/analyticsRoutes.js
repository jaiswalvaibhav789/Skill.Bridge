const express = require('express');
const router = express.Router();
const {
  getInstituteSummary,
  getSkillDemand,
  getPlacementFunnel,
  getCurriculumGapHeatmap,
  getAdminOverview
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public or protected skill demand endpoint
router.get('/skill-demand', getSkillDemand);

// Institute & Admin KPI summary
router.get('/institute/summary', protect, authorize('institute', 'admin'), getInstituteSummary);

// 6-Stage placement absorption funnel
router.get('/placement-funnel', protect, authorize('institute', 'industry', 'admin'), getPlacementFunnel);

// 5-Sector Ayush curriculum gap heatmap and academic council advisories
router.get('/curriculum-heatmap', protect, authorize('institute', 'faculty', 'admin'), getCurriculumGapHeatmap);

// Pan-India Ministry multi-tenant overview
router.get('/admin/overview', protect, authorize('admin'), getAdminOverview);

module.exports = router;
