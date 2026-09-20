const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const StudentProfile = require('../models/StudentProfile');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all active assessments
// @route   GET /api/assessments
// @access  Public / Private
exports.getAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ isActive: true })
      .populate('skill', 'name category ayushBranch')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, assessments, 'Assessments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get assessment questions for student quiz (conceals correctOptionKey)
// @route   GET /api/assessments/:id
// @access  Private (Student)
exports.getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('skill', 'name category ayushBranch');

    if (!assessment) {
      return ApiResponse.error(res, 'Assessment not found', 404, 'NOT_FOUND');
    }

    // Explicitly exclude correctOptionKey and explanation
    const questions = await Question.find({ assessment: assessment._id })
      .select('prompt options weightage');

    return ApiResponse.success(res, {
      assessment,
      questions,
      totalQuestions: questions.length
    }, 'Assessment questions loaded');
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assessment answers & auto-grade
// @route   POST /api/assessments/:id/submit
// @access  Private (Student)
exports.submitAssessment = async (req, res, next) => {
  try {
    const { answers, timeTakenSeconds } = req.body; // answers: [{ questionId, selectedOptionKey }]

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return ApiResponse.error(res, 'Assessment not found', 404, 'NOT_FOUND');
    }

    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    // Retrieve questions with their correctOptionKey for scoring
    const questions = await Question.find({ assessment: assessment._id }).select('+correctOptionKey');

    let correctCount = 0;
    let totalWeight = 0;
    let earnedWeight = 0;

    const answerMap = new Map((answers || []).map(a => [a.questionId.toString(), a.selectedOptionKey]));
    const evaluatedAnswers = [];

    questions.forEach(q => {
      const selected = answerMap.get(q._id.toString());
      const isCorrect = selected === q.correctOptionKey;
      const weight = q.weightage || 1;

      totalWeight += weight;
      if (isCorrect) {
        correctCount++;
        earnedWeight += weight;
      }

      evaluatedAnswers.push({
        question: q._id,
        selectedOptionKey: selected,
        isCorrect
      });
    });

    const scorePercentage = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
    const passed = scorePercentage >= (assessment.passingScorePercentage || 60);

    // Save attempt
    const attempt = await AssessmentAttempt.create({
      student: studentProfile._id,
      assessment: assessment._id,
      scorePercentage,
      passed,
      answers: evaluatedAnswers,
      timeTakenSeconds: timeTakenSeconds || 0
    });

    // If passed, update student profile skills
    let skillUpdated = false;
    const existingSkillIndex = studentProfile.skills.findIndex(
      s => s.skill.toString() === assessment.skill.toString()
    );

    let proficiencyLevel = 'Beginner';
    if (scorePercentage >= 80) proficiencyLevel = 'Expert';
    else if (scorePercentage >= 60) proficiencyLevel = 'Intermediate';

    if (existingSkillIndex > -1) {
      // Update existing if score is higher
      if (scorePercentage > (studentProfile.skills[existingSkillIndex].proficiencyScore || 0)) {
        studentProfile.skills[existingSkillIndex].proficiencyScore = scorePercentage;
        studentProfile.skills[existingSkillIndex].proficiency = proficiencyLevel;
        studentProfile.skills[existingSkillIndex].verifiedByAssessment = true;
        studentProfile.skills[existingSkillIndex].lastAssessedAt = new Date();
        skillUpdated = true;
      }
    } else {
      // Add newly assessed skill
      studentProfile.skills.push({
        skill: assessment.skill,
        proficiency: proficiencyLevel,
        proficiencyScore: scorePercentage,
        verifiedByAssessment: true,
        lastAssessedAt: new Date()
      });
      skillUpdated = true;
    }

    if (skillUpdated) {
      await studentProfile.save();
    }

    return ApiResponse.success(res, {
      attemptId: attempt._id,
      scorePercentage,
      passed,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      passingScorePercentage: assessment.passingScorePercentage,
      skillUpdated
    }, passed ? 'Congratulations! Assessment passed.' : 'Assessment completed. Passing threshold not reached.', 200);
  } catch (error) {
    next(error);
  }
};
