const express = require('express');
const router = express.Router();
const { getCareerRoles, analyzeSkillGap } = require('../controllers/skillGapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/roles', getCareerRoles);
router.get('/analyze/:roleId?', protect, analyzeSkillGap);

module.exports = router;
