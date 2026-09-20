const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  createOpportunity,
  getMyOpportunities,
  getOpportunityApplicants,
  updateApplicationStatus,
  getTalentPool
} = require('../controllers/industryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('industry', 'admin'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/opportunities', createOpportunity);
router.get('/opportunities', getMyOpportunities);
router.get('/opportunities/:id/applicants', getOpportunityApplicants);
router.put('/applications/:id/status', updateApplicationStatus);
router.get('/talent-pool', getTalentPool);

module.exports = router;
