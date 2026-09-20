const FacultyProfile = require('../models/FacultyProfile');
const Opportunity = require('../models/Opportunity');
const LearningProgram = require('../models/LearningProgram');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get current faculty profile
// @route   GET /api/faculty/profile
// @access  Private (Faculty)
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await FacultyProfile.findOne({ user: req.user.id })
      .populate('institute', 'instituteName aisheCode location');

    if (!profile) {
      return ApiResponse.error(res, 'Faculty profile not found', 404, 'NOT_FOUND');
    }

    return ApiResponse.success(res, profile, 'Faculty profile retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Update faculty profile
// @route   PUT /api/faculty/profile
// @access  Private (Faculty)
exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await FacultyProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Faculty profile not found', 404, 'NOT_FOUND');
    }

    const { department, designation, yearsExperience, expertise, researchInterests, publications, industryConsultingHistory, bio } = req.body;
    if (department) profile.department = department;
    if (designation) profile.designation = designation;
    if (yearsExperience !== undefined) profile.yearsExperience = yearsExperience;
    if (expertise) profile.expertise = expertise;
    if (researchInterests) profile.researchInterests = researchInterests;
    if (publications) profile.publications = publications;
    if (industryConsultingHistory) profile.industryConsultingHistory = industryConsultingHistory;
    if (bio) profile.bio = bio;

    await profile.save();
    return ApiResponse.success(res, profile, 'Faculty profile updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get faculty development programs & research collaboration opportunities
// @route   GET /api/faculty/collaborations
// @access  Private (Faculty)
exports.getCollaborations = async (req, res, next) => {
  try {
    const researchFellowships = await Opportunity.find({
      type: { $in: ['Research Fellowship', 'Clinical Observership'] },
      status: 'Active'
    }).populate('industry', 'companyName location');

    const fdps = await LearningProgram.find({
      type: { $in: ['FDP', 'HandsOn_Training'] },
      isActive: true
    });

    return ApiResponse.success(res, {
      researchFellowships,
      facultyDevelopmentPrograms: fdps
    }, 'Faculty collaboration opportunities retrieved');
  } catch (error) {
    next(error);
  }
};
