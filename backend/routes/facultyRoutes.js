const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getCollaborations } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/profile', protect, authorize('faculty', 'admin'), getProfile);
router.put('/profile', protect, authorize('faculty', 'admin'), updateProfile);
router.get('/collaborations', protect, authorize('faculty', 'admin'), getCollaborations);

module.exports = router;
