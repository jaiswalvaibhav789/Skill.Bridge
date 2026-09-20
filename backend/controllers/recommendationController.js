const StudentProfile = require('../models/StudentProfile');
const IndustryProfile = require('../models/IndustryProfile');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Skill = require('../models/Skill');
const LearningProgram = require('../models/LearningProgram');
const { calculateMultiFactorCompatibility, WEIGHTS } = require('./matchingController');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get smart multi-factor recommended opportunities for student
// @route   GET /api/recommendations/opportunities
// @access  Private (Student)
exports.getRecommendedOpportunities = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id })
      .populate('skills.skill')
      .populate('institute')
      .populate('targetCareerRole');

    if (!profile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    const opportunities = await Opportunity.find({ status: 'Active' })
      .populate('industry', 'companyName industryType location')
      .populate('requiredSkills', 'name category ayushBranch')
      .populate('preferredSkills', 'name category ayushBranch');

    const submittedApplications = await Application.find({ student: profile._id }).select('opportunity status');
    const appliedMap = new Map(submittedApplications.map(app => [app.opportunity.toString(), app.status]));

    const recommendations = await Promise.all(
      opportunities.map(async (opp) => {
        const evalResult = calculateMultiFactorCompatibility({
          studentProfile: profile,
          opportunity: opp
        });

        const missingSkillDetails = await Skill.find({
          _id: { $in: evalResult.missingSkillIds }
        }).select('name category ayushBranch');

        return {
          _id: opp._id,
          title: opp.title,
          type: opp.type,
          industry: opp.industry,
          location: opp.location,
          workplaceType: opp.workplaceType || 'On-site',
          stipendOrSalary: opp.stipendOrSalary,
          durationMonths: opp.durationMonths,
          minCgpa: opp.minCgpa,
          eligibleDegrees: opp.eligibleDegrees || [],
          deadline: opp.deadline,
          requiredSkills: opp.requiredSkills,
          preferredSkills: opp.preferredSkills,
          compatibilityScore: evalResult.compatibilityScore,
          matchScore: evalResult.compatibilityScore, // Backward compatibility alias
          factorBreakdown: evalResult.factorBreakdown,
          weights: evalResult.weights,
          matchReasons: evalResult.matchReasons,
          missingSkills: missingSkillDetails,
          applicationStatus: appliedMap.get(opp._id.toString()) || null
        };
      })
    );

    // Sort descending by Multi-Factor Compatibility Score
    recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return ApiResponse.success(
      res,
      recommendations,
      'Multi-factor recommendations generated successfully',
      200,
      {
        totalRecords: recommendations.length,
        weights: WEIGHTS,
        topMatch: recommendations[0]?.compatibilityScore || 0
      }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI-ranked candidate recommendations for an opportunity (Recruiter view)
// @route   GET /api/recommendations/candidates/:opportunityId
// @access  Private (Industry, Admin)
exports.getCandidateRecommendations = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.opportunityId)
      .populate('industry')
      .populate('requiredSkills')
      .populate('preferredSkills');

    if (!opp) {
      return ApiResponse.error(res, 'Opportunity not found', 404, 'NOT_FOUND');
    }

    // Verify ownership if caller is industry recruiter
    if (req.user.role === 'industry') {
      const industryProfile = await IndustryProfile.findOne({ user: req.user.id });
      if (!industryProfile || opp.industry._id.toString() !== industryProfile._id.toString()) {
        return ApiResponse.error(res, 'Not authorized to access candidate recommendations for this listing', 403, 'FORBIDDEN');
      }
    }

    // Fetch candidate profiles
    const candidates = await StudentProfile.find({})
      .populate('skills.skill')
      .populate('institute', 'instituteName location')
      .populate('targetCareerRole', 'title');

    const rankedCandidates = await Promise.all(
      candidates.map(async (cand) => {
        const evalResult = calculateMultiFactorCompatibility({
          studentProfile: cand,
          opportunity: opp
        });

        const missingSkillDetails = await Skill.find({
          _id: { $in: evalResult.missingSkillIds }
        }).select('name category');

        return {
          studentId: cand._id,
          fullName: cand.fullName,
          degree: cand.degree,
          rollNumber: cand.rollNumber,
          passingYear: cand.passingYear,
          cgpa: cand.cgpa,
          portfolioSlug: cand.portfolioSlug,
          institute: cand.institute,
          targetCareerRole: cand.targetCareerRole,
          compatibilityScore: evalResult.compatibilityScore,
          factorBreakdown: evalResult.factorBreakdown,
          matchReasons: evalResult.matchReasons,
          missingSkills: missingSkillDetails
        };
      })
    );

    rankedCandidates.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return ApiResponse.success(
      res,
      rankedCandidates,
      'Ranked candidate recommendations retrieved',
      200,
      {
        opportunityTitle: opp.title,
        totalCandidatesEvaluated: candidates.length,
        weights: WEIGHTS
      }
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get personalized remedial learning path to close skill gaps for matched roles
// @route   GET /api/recommendations/learning-path
// @access  Private (Student)
exports.getRemedialLearningPath = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id })
      .populate('skills.skill');

    if (!profile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    // Student's verified/endorsed skill IDs
    const acquiredSkillIds = new Set(
      (profile.skills || [])
        .filter(s => s.verifiedByAssessment || s.isEndorsed)
        .map(s => (s.skill?._id || s.skill).toString())
    );

    // Collect missing skills from active opportunities
    const opportunities = await Opportunity.find({ status: 'Active' });
    const missingSkillFrequency = new Map();

    opportunities.forEach(opp => {
      (opp.requiredSkills || []).forEach(skId => {
        const idStr = skId.toString();
        if (!acquiredSkillIds.has(idStr)) {
          missingSkillFrequency.set(idStr, (missingSkillFrequency.get(idStr) || 0) + 1);
        }
      });
    });

    let highPriorityMissingIds = Array.from(missingSkillFrequency.keys());

    // If no missing skills detected from active opps, pull target career role skills
    if (highPriorityMissingIds.length === 0 && profile.targetCareerRole) {
      const CareerRole = require('../models/CareerRole');
      const role = await CareerRole.findById(profile.targetCareerRole);
      if (role) {
        highPriorityMissingIds = (role.requiredSkills || []).map(s => s.toString());
      }
    }

    // Fetch learning programs that teach these skills
    let query = {};
    if (highPriorityMissingIds.length > 0) {
      query = { coveredSkills: { $in: highPriorityMissingIds } };
    }

    let programs = await LearningProgram.find(query)
      .populate('coveredSkills', 'name category ayushBranch');

    if (programs.length === 0) {
      programs = await LearningProgram.find({})
        .populate('coveredSkills', 'name category ayushBranch')
        .limit(4);
    }

    // Score programs by the number of missing skills they solve
    const rankedPrograms = programs.map(prog => {
      const skillsSolved = (prog.coveredSkills || []).filter(sk => 
        highPriorityMissingIds.includes(sk._id.toString())
      );
      return {
        _id: prog._id,
        title: prog.title,
        provider: prog.providerName || prog.providerType || 'Ayush Industry Partner',
        durationWeeks: Math.round((prog.durationHours || 20) / 5) || 4,
        durationHours: prog.durationHours || 20,
        coveredSkills: prog.coveredSkills,
        skillsSolvedCount: skillsSolved.length,
        skillsSolved,
        difficulty: prog.difficulty || 'Intermediate',
        enrolled: (profile.enrolledPrograms || []).some(
          ep => (ep.program?._id || ep.program).toString() === prog._id.toString()
        )
      };
    });

    rankedPrograms.sort((a, b) => b.skillsSolvedCount - a.skillsSolvedCount);

    return ApiResponse.success(
      res,
      rankedPrograms,
      'Remedial learning path generated',
      200,
      {
        criticalMissingSkillsCount: highPriorityMissingIds.length,
        recommendedCoursesCount: rankedPrograms.length
      }
    );
  } catch (error) {
    next(error);
  }
};
