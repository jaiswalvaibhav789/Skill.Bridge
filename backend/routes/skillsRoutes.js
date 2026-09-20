const express = require('express');
const router = express.Router();
const { getSkills, getSkillById } = require('../controllers/skillsController');

router.get('/', getSkills);
router.get('/:id', getSkillById);

module.exports = router;
