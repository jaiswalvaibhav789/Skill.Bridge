const express = require('express');
const router = express.Router();
const { getAssessments, getAssessmentById, submitAssessment } = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAssessments);
router.get('/:id', protect, getAssessmentById);
router.post('/:id/submit', protect, submitAssessment);

module.exports = router;
