const InstituteProfile = require('../models/InstituteProfile');
const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');
const ApiResponse = require('../utils/apiResponse');
const { generateCredentialHash } = require('../utils/credentialHelper');
const { createNotification } = require('../utils/notificationService');
const { logAuditEvent } = require('../utils/auditLogger');

// @desc    Get institute profile
// @route   GET /api/institute/profile
// @access  Private (Institute)
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await InstituteProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Institute profile not found', 404, 'INSTITUTE_NOT_FOUND');
    }
    return ApiResponse.success(res, { profile, ...profile.toObject() }, 'Institute profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students affiliated with this institute
// @route   GET /api/institute/students
// @access  Private (Institute)
exports.getStudents = async (req, res, next) => {
  try {
    const profile = await InstituteProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Institute profile required', 404, 'PROFILE_REQUIRED');
    }

    const students = await StudentProfile.find({ institute: profile._id })
      .populate('user', 'email')
      .populate('skills.skill', 'name category ayushBranch');

    return ApiResponse.success(res, students, 'Institute students retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Endorse a student skill with cryptographic micro-credential seal
// @route   POST /api/institute/endorse-skill
// @access  Private (Institute)
exports.endorseSkill = async (req, res, next) => {
  try {
    const { studentProfileId, skillId } = req.body;
    const institute = await InstituteProfile.findOne({ user: req.user.id });

    if (!institute) {
      return ApiResponse.error(res, 'Institute authorization required', 403, 'FORBIDDEN');
    }

    const student = await StudentProfile.findOne({
      _id: studentProfileId,
      institute: institute._id
    });

    if (!student) {
      return ApiResponse.error(res, 'Student not found in your institute', 404, 'STUDENT_NOT_FOUND');
    }

    const skillItem = student.skills.find(
      s => s.skill && (s.skill.toString() === skillId || s.skill._id?.toString() === skillId)
    );

    if (!skillItem) {
      return ApiResponse.error(res, 'Student does not list this skill', 404, 'SKILL_NOT_FOUND');
    }

    skillItem.isEndorsed = true;
    skillItem.endorsedBy = institute._id;
    skillItem.issuedAt = new Date();

    // Generate deterministic SHA-256 micro-credential seal
    skillItem.credentialHash = generateCredentialHash({
      studentId: student._id.toString(),
      skillId: (skillItem.skill._id || skillItem.skill).toString(),
      score: skillItem.proficiencyScore || 85,
      endorsedBy: institute.institutionName || institute._id.toString(),
      timestamp: skillItem.issuedAt
    });

    await student.save();

    // Record immutable audit event
    logAuditEvent({
      actor: req.user.id,
      actorRole: 'institute',
      action: 'CREDENTIAL_SEAL_MINTED',
      entityType: 'StudentProfile',
      entityId: student._id,
      ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      details: {
        studentId: student._id,
        skillId: skillItem.skill,
        credentialHash: skillItem.credentialHash,
        institutionName: institute.institutionName
      }
    });

    // Dispatch notification to student
    try {
      if (student.user) {
        await createNotification({
          recipient: student.user,
          title: 'Clinical Competency Verified & Sealed',
          message: `${institute.institutionName || 'Your institution'} verified your clinical rotation competency. A tamper-evident SHA-256 micro-credential has been minted to your ledger.`,
          type: 'SKILL_ENDORSED',
          link: '/portfolio'
        });
      }
    } catch (notifErr) {
      console.warn('[Notification Dispatch Warning]', notifErr.message);
    }

    return ApiResponse.success(res, {
      studentProfileId: student._id,
      skillId: skillItem.skill,
      isEndorsed: true,
      credentialHash: skillItem.credentialHash,
      issuedAt: skillItem.issuedAt,
      endorsedBy: institute.institutionName
    }, 'Clinical competency endorsed and cryptographic micro-credential issued successfully');
  } catch (error) {
    next(error);
  }
};
