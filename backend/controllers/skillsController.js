const Skill = require('../models/Skill');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all skills with category & branch filtering
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res, next) => {
  try {
    const { category, ayushBranch, search } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }
    if (ayushBranch) {
      query.ayushBranch = ayushBranch;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skills = await Skill.find(query).sort({ industryDemandScore: -1, name: 1 });
    return ApiResponse.success(res, skills, 'Skills retrieved successfully', 200, { totalRecords: skills.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skill by ID
// @route   GET /api/skills/:id
// @access  Public
exports.getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return ApiResponse.error(res, 'Skill not found', 404, 'NOT_FOUND');
    }
    return ApiResponse.success(res, skill, 'Skill details retrieved');
  } catch (error) {
    next(error);
  }
};
