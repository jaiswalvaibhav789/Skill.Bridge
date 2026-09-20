const LearningProgram = require('../models/LearningProgram');
const StudentProfile = require('../models/StudentProfile');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all learning programs with filters
// @route   GET /api/learning
// @access  Public
exports.getLearningPrograms = async (req, res, next) => {
  try {
    const { type, difficulty, search, providerType } = req.query;
    const query = { isActive: true };

    if (type && type !== 'All') query.type = type;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (providerType && providerType !== 'All') query.providerType = providerType;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { providerName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const programs = await LearningProgram.find(query)
      .populate('coveredSkills', 'name category')
      .sort({ rating: -1, enrolledStudentsCount: -1 });

    return ApiResponse.success(res, programs, 'Learning programs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get single learning program by ID
// @route   GET /api/learning/:id
// @access  Public
exports.getProgramById = async (req, res, next) => {
  try {
    const program = await LearningProgram.findById(req.params.id)
      .populate('coveredSkills', 'name category description');

    if (!program) {
      return ApiResponse.error(res, 'Learning program not found', 404, 'NOT_FOUND');
    }

    return ApiResponse.success(res, program, 'Learning program retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended learning programs based on student's missing skills
// @route   GET /api/learning/recommended
// @access  Private (Student)
exports.getRecommendedPrograms = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return ApiResponse.error(res, 'Student profile required', 404, 'NOT_FOUND');
    }

    const acquiredSkillIds = (studentProfile.skills || []).map(s => s.skill.toString());

    // Find programs covering skills the student does NOT yet hold
    const recommended = await LearningProgram.find({
      coveredSkills: { $nin: acquiredSkillIds },
      isActive: true
    })
      .populate('coveredSkills', 'name category')
      .limit(6);

    return ApiResponse.success(res, recommended, 'Recommended programs retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll authenticated student in a learning program
// @route   POST /api/learning/:id/enroll
// @access  Private (Student)
exports.enrollProgram = async (req, res, next) => {
  try {
    const programId = req.params.id;
    const program = await LearningProgram.findById(programId);
    if (!program) {
      return ApiResponse.error(res, 'Learning program not found', 404, 'NOT_FOUND');
    }

    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return ApiResponse.error(res, 'Student profile not found. Complete your profile before enrolling.', 404, 'PROFILE_NOT_FOUND');
    }

    // Check if already enrolled
    const alreadyEnrolled = (studentProfile.enrolledPrograms || []).some(
      (ep) => ep.program && ep.program.toString() === programId
    );

    if (alreadyEnrolled) {
      return ApiResponse.error(res, 'You are already enrolled in this program', 409, 'ALREADY_ENROLLED');
    }

    // Add to student's enrolledPrograms
    if (!studentProfile.enrolledPrograms) {
      studentProfile.enrolledPrograms = [];
    }

    studentProfile.enrolledPrograms.push({
      program: program._id,
      enrolledAt: new Date(),
      status: 'In_Progress',
      progressPercentage: 5
    });

    await studentProfile.save();

    // Increment enrolled count
    program.enrolledStudentsCount = (program.enrolledStudentsCount || 0) + 1;
    await program.save();

    return ApiResponse.success(
      res,
      {
        programId: program._id,
        title: program.title,
        status: 'In_Progress',
        progressPercentage: 5
      },
      'Successfully enrolled in learning program',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all programs enrolled by current student
// @route   GET /api/learning/my-enrollments
// @access  Private (Student)
exports.getMyEnrolledPrograms = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id })
      .populate({
        path: 'enrolledPrograms.program',
        populate: {
          path: 'coveredSkills',
          select: 'name category'
        }
      });

    if (!studentProfile) {
      return ApiResponse.error(res, 'Student profile required', 404, 'NOT_FOUND');
    }

    const enrollments = (studentProfile.enrolledPrograms || []).filter(ep => ep.program != null);

    return ApiResponse.success(res, enrollments, 'Enrolled programs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress in an enrolled program
// @route   PUT /api/learning/:id/progress
// @access  Private (Student)
exports.updateProgramProgress = async (req, res, next) => {
  try {
    const programId = req.params.id;
    const { progressDelta = 25 } = req.body;

    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    const enrollment = (studentProfile.enrolledPrograms || []).find(
      ep => ep.program && ep.program.toString() === programId
    );

    if (!enrollment) {
      return ApiResponse.error(res, 'You are not enrolled in this program', 404, 'NOT_ENROLLED');
    }

    enrollment.progressPercentage = Math.min(100, (enrollment.progressPercentage || 0) + Number(progressDelta));
    if (enrollment.progressPercentage >= 100) {
      enrollment.status = 'Completed';
      enrollment.completedAt = new Date();
    } else {
      enrollment.status = 'In_Progress';
    }

    await studentProfile.save();

    return ApiResponse.success(
      res,
      enrollment,
      enrollment.status === 'Completed' ? 'Congratulations! Course completed.' : 'Progress updated successfully'
    );
  } catch (error) {
    next(error);
  }
};
