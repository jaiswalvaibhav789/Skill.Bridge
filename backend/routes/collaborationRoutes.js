const express = require('express');
const router = express.Router();
const {
  getAllCollaborations,
  getCollaborationById,
  createCollaboration,
  submitProposal,
  reviewProposal,
  respondConsultingRequest
} = require('../controllers/collaborationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getAllCollaborations);
router.get('/:id', getCollaborationById);

router.post('/', protect, authorize('industry', 'faculty', 'institute', 'admin'), createCollaboration);
router.post('/:id/apply', protect, authorize('faculty', 'admin'), submitProposal);
router.put('/:id/review-proposal', protect, authorize('industry', 'admin'), reviewProposal);
router.put('/:id/consulting-response', protect, authorize('faculty', 'admin'), respondConsultingRequest);

module.exports = router;
