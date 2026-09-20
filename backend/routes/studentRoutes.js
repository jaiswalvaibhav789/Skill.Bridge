const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getMatchedOpportunities,
  applyOpportunity,
  getMyApplications,
  withdrawApplication,
  acceptOffer,
  getPublicPortfolio,
  verifyCredential,
  updatePortfolioSlug,
  generateCredentialBadges
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes: shareable digital portfolio & cryptographic verification
router.get('/portfolio/:slug', getPublicPortfolio);
router.get('/verify-credential/:hash', verifyCredential);

// Protected routes (Student only)
router.get('/profile', protect, authorize('student'), getProfile);
router.put('/profile', protect, authorize('student'), updateProfile);
router.put('/portfolio-slug', protect, authorize('student'), updatePortfolioSlug);
router.post('/generate-credentials', protect, authorize('student'), generateCredentialBadges);
router.get('/matched-opportunities', protect, authorize('student'), getMatchedOpportunities);
router.post('/apply/:opportunityId', protect, authorize('student'), applyOpportunity);
router.get('/my-applications', protect, authorize('student'), getMyApplications);
router.put('/applications/:id/withdraw', protect, authorize('student'), withdrawApplication);
router.put('/applications/:id/accept', protect, authorize('student'), acceptOffer);

module.exports = router;
