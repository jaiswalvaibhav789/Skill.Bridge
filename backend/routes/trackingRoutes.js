const express = require('express');
const router = express.Router();
const {
  getMyInternshipProgress,
  getIndustryInterns,
  submitWeeklyLog,
  evaluateWeeklyLog,
  completeInternship
} = require('../controllers/trackingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my-internship', protect, authorize('student'), getMyInternshipProgress);
router.post('/milestone', protect, authorize('student'), submitWeeklyLog);

router.get('/industry-interns', protect, authorize('industry', 'admin'), getIndustryInterns);
router.put('/milestone/:progressId/:weekNumber/evaluate', protect, authorize('industry', 'admin'), evaluateWeeklyLog);
router.put('/:progressId/complete', protect, authorize('industry', 'admin'), completeInternship);

module.exports = router;
