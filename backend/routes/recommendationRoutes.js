const express = require('express');
const router = express.Router();
const {
  getRecommendedOpportunities,
  getCandidateRecommendations,
  getRemedialLearningPath
} = require('../controllers/recommendationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student Multi-Factor Opportunity Recommendations
router.get('/opportunities', protect, authorize('student', 'admin'), getRecommendedOpportunities);

// Recruiter AI Candidate Recommendations for a Specific Opportunity
router.get('/candidates/:opportunityId', protect, authorize('industry', 'admin'), getCandidateRecommendations);

// Personalized Remedial Learning Path based on Opportunity Skill Deficits
router.get('/learning-path', protect, authorize('student', 'admin'), getRemedialLearningPath);

module.exports = router;
