const express = require('express');
const router = express.Router();
const {
  getProfile,
  getStudents,
  endorseSkill
} = require('../controllers/instituteController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('institute', 'admin'));

router.get('/profile', getProfile);
router.get('/students', getStudents);
router.post('/endorse-skill', endorseSkill);

module.exports = router;
