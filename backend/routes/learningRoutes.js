const express = require('express');
const router = express.Router();
const {
  getLearningPrograms,
  getRecommendedPrograms,
  getProgramById,
  enrollProgram,
  getMyEnrolledPrograms,
  updateProgramProgress
} = require('../controllers/learningController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getLearningPrograms);
router.get('/recommended', protect, getRecommendedPrograms);
router.get('/my-enrollments', protect, getMyEnrolledPrograms);
router.get('/:id', getProgramById);
router.post('/:id/enroll', protect, enrollProgram);
router.put('/:id/progress', protect, updateProgramProgress);

module.exports = router;
