const CareerRole = require('../models/CareerRole');
const StudentProfile = require('../models/StudentProfile');
const LearningProgram = require('../models/LearningProgram');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all benchmark career roles
// @route   GET /api/skill-gap/roles
// @access  Public
exports.getCareerRoles = async (req, res, next) => {
  try {
    const roles = await CareerRole.find()
      .populate('requiredSkills.skill', 'name category ayushBranch industryDemandScore')
      .populate('preferredSkills', 'name category ayushBranch')
      .sort({ demandIndex: -1 });

    return ApiResponse.success(res, roles, 'Career roles retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Perform mathematical Skill Gap Analysis for the authenticated student
// @route   GET /api/skill-gap/analyze/:roleId?
// @access  Private (Student)
exports.analyzeSkillGap = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id })
      .populate('skills.skill');

    if (!studentProfile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    const roleId = req.params.roleId || studentProfile.targetCareerRole;
    if (!roleId) {
      return ApiResponse.error(res, 'No target career role specified or configured in profile', 400, 'ROLE_REQUIRED');
    }

    const careerRole = await CareerRole.findById(roleId)
      .populate('requiredSkills.skill', 'name category ayushBranch')
      .populate('preferredSkills', 'name category ayushBranch');

    if (!careerRole) {
      return ApiResponse.error(res, 'Career role not found', 404, 'NOT_FOUND');
    }

    // Map student's existing skills to a fast lookup map: skillId -> proficiencyScore
    const studentSkillMap = new Map();
    (studentProfile.skills || []).forEach(item => {
      const sId = item.skill._id ? item.skill._id.toString() : item.skill.toString();
      studentSkillMap.set(sId, {
        score: item.proficiencyScore || 50,
        level: item.proficiency || 'Beginner',
        verified: item.verifiedByAssessment || false
      });
    });

    const gapDetails = [];
    const deficientSkillIds = [];
    let totalTargetScore = 0;
    let totalStudentScore = 0;

    careerRole.requiredSkills.forEach(reqSkill => {
      const skillDoc = reqSkill.skill;
      const sId = skillDoc._id.toString();
      const targetScore = reqSkill.minProficiencyScore || 75;
      const studentData = studentSkillMap.get(sId);

      const currentScore = studentData ? studentData.score : 0;
      const gap = targetScore - currentScore;

      totalTargetScore += targetScore;
      totalStudentScore += Math.min(targetScore, currentScore);

      let criticality = 'Satisfactory';
      if (!studentData || gap >= 30) {
        criticality = 'Critical';
        deficientSkillIds.push(skillDoc._id);
      } else if (gap >= 20) {
        criticality = 'High';
        deficientSkillIds.push(skillDoc._id);
      } else if (gap >= 10) {
        criticality = 'Medium';
        deficientSkillIds.push(skillDoc._id);
      } else if (gap > 0) {
        criticality = 'Low';
      }

      gapDetails.push({
        skillId: skillDoc._id,
        skillName: skillDoc.name,
        category: skillDoc.category,
        currentScore,
        targetScore,
        gapPercentage: Math.max(0, gap),
        criticality,
        isVerified: studentData ? studentData.verified : false
      });
    });

    // Overall role readiness percentage
    const roleReadinessPercentage = totalTargetScore > 0 
      ? Math.round((totalStudentScore / totalTargetScore) * 100)
      : 100;

    // Fetch recommended courses addressing deficient skills
    const recommendedPrograms = await LearningProgram.find({
      coveredSkills: { $in: deficientSkillIds },
      isActive: true
    }).populate('coveredSkills', 'name').limit(5);

    return ApiResponse.success(res, {
      careerRole: {
        id: careerRole._id,
        title: careerRole.title,
        industrySector: careerRole.industrySector,
        averageSalaryRange: careerRole.averageSalaryRange,
        demandIndex: careerRole.demandIndex
      },
      roleReadinessPercentage,
      gapDetails,
      summary: {
        totalRequiredSkills: careerRole.requiredSkills.length,
        criticalGapsCount: gapDetails.filter(g => g.criticality === 'Critical').length,
        highGapsCount: gapDetails.filter(g => g.criticality === 'High').length,
        satisfactoryCount: gapDetails.filter(g => g.criticality === 'Satisfactory').length
      },
      recommendedPrograms
    }, 'Skill gap analysis generated successfully');
  } catch (error) {
    next(error);
  }
};
