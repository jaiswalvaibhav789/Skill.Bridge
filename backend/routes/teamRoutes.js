const express = require('express');
const router = express.Router();
const {
  decomposeProblem,
  generateTeam,
  proposeTeam,
  getMyTeams,
  updateMemberStatus
} = require('../controllers/teamMatchingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// Problem decomposition & AI team generation available to industry & admin
router.post('/decompose', authorize('industry', 'admin'), decomposeProblem);
router.post('/generate', authorize('industry', 'admin'), generateTeam);
router.post('/propose', authorize('industry', 'admin'), proposeTeam);

// Retrieve teams for current user (industry sees created teams, student sees invited teams)
router.get('/my-teams', getMyTeams);

// Student response to invitation
router.put('/:teamId/member-status', authorize('student'), updateMemberStatus);

module.exports = router;
