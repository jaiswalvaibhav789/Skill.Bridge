const crypto = require('crypto');
const InternshipProgress = require('../models/InternshipProgress');
const StudentProfile = require('../models/StudentProfile');
const IndustryProfile = require('../models/IndustryProfile');
const ApiResponse = require('../utils/apiResponse');
const { createNotification } = require('../utils/notificationService');
const { logAuditEvent } = require('../utils/auditLogger');

// @desc    Get current student's active internship progress
// @route   GET /api/tracking/my-internship
// @access  Private (Student)
exports.getMyInternshipProgress = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    const progress = await InternshipProgress.findOne({ student: studentProfile._id })
      .populate('opportunity', 'title type location stipendOrSalary')
      .populate('industry', 'companyName location');

    if (!progress) {
      return ApiResponse.error(res, 'No active internship found for this candidate', 404, 'NO_ACTIVE_INTERNSHIP');
    }

    return ApiResponse.success(res, progress, 'Active internship progress loaded');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all interns tracked by this industry user
// @route   GET /api/tracking/industry-interns
// @access  Private (Industry)
exports.getIndustryInterns = async (req, res, next) => {
  try {
    const industryProfile = await IndustryProfile.findOne({ user: req.user.id });
    if (!industryProfile) {
      return ApiResponse.error(res, 'Industry profile not found', 404, 'NOT_FOUND');
    }

    const interns = await InternshipProgress.find({ industry: industryProfile._id })
      .populate('student', 'fullName degree rollNumber')
      .populate('opportunity', 'title type')
      .sort({ updatedAt: -1 });

    return ApiResponse.success(res, interns, 'Industry interns retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Student submits weekly progress log
// @route   POST /api/tracking/milestone
// @access  Private (Student)
exports.submitWeeklyLog = async (req, res, next) => {
  try {
    const { weekNumber, tasksCompleted, hoursWorked, studentReflections } = req.body;

    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    const progress = await InternshipProgress.findOne({
      student: studentProfile._id,
      completionStatus: 'Active'
    });

    if (!progress) {
      return ApiResponse.error(res, 'No active internship found to submit logs for', 404, 'NOT_FOUND');
    }

    // Check if log for this week already exists
    const existingIndex = progress.weeklyLogs.findIndex(l => l.weekNumber === Number(weekNumber));
    if (existingIndex > -1) {
      progress.weeklyLogs[existingIndex].tasksCompleted = tasksCompleted;
      progress.weeklyLogs[existingIndex].hoursWorked = hoursWorked || 40;
      progress.weeklyLogs[existingIndex].studentReflections = studentReflections || '';
      progress.weeklyLogs[existingIndex].status = 'Submitted';
    } else {
      progress.weeklyLogs.push({
        weekNumber: Number(weekNumber),
        tasksCompleted,
        hoursWorked: hoursWorked || 40,
        studentReflections: studentReflections || '',
        status: 'Submitted'
      });
    }

    await progress.save();
    return ApiResponse.success(res, progress, `Week ${weekNumber} log submitted successfully`);
  } catch (error) {
    next(error);
  }
};

// @desc    Mentor / Industry evaluates weekly log
// @route   PUT /api/tracking/milestone/:progressId/:weekNumber/evaluate
// @access  Private (Industry)
exports.evaluateWeeklyLog = async (req, res, next) => {
  try {
    const { progressId, weekNumber } = req.params;
    const { mentorFeedback, mentorRating, status } = req.body;

    const progress = await InternshipProgress.findById(progressId);
    if (!progress) {
      return ApiResponse.error(res, 'Internship record not found', 404, 'NOT_FOUND');
    }

    const log = progress.weeklyLogs.find(l => l.weekNumber === Number(weekNumber));
    if (!log) {
      return ApiResponse.error(res, `Milestone log for week ${weekNumber} not found`, 404, 'NOT_FOUND');
    }

    if (mentorFeedback) log.mentorFeedback = mentorFeedback;
    if (mentorRating) log.mentorRating = mentorRating;
    log.status = status || 'Approved';
    log.reviewedAt = new Date();

    await progress.save();

    // Record immutable audit event
    logAuditEvent({
      actor: req.user.id,
      actorRole: 'industry',
      action: 'INTERNSHIP_MILESTONE_EVALUATED',
      entityType: 'InternshipProgress',
      entityId: progress._id,
      ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      details: { weekNumber, rating: mentorRating, status: log.status }
    });

    // Notify student of mentor feedback
    try {
      const student = await StudentProfile.findById(progress.student).select('user');
      if (student && student.user) {
        await createNotification({
          recipient: student.user,
          title: `Milestone Evaluated (Week ${weekNumber})`,
          message: `Your industry mentor reviewed your Week ${weekNumber} milestone log (Rating: ${mentorRating || 4}/5, Status: ${log.status}).`,
          type: 'MENTOR_FEEDBACK',
          link: '/internship-tracker'
        });
      }
    } catch (notifErr) {
      console.warn('[Notification Dispatch Warning]', notifErr.message);
    }

    return ApiResponse.success(res, progress, `Week ${weekNumber} evaluated and marked as ${log.status}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Complete internship & issue verifiable cryptographic certificate
// @route   PUT /api/tracking/:progressId/complete
// @access  Private (Industry)
exports.completeInternship = async (req, res, next) => {
  try {
    const { progressId } = req.params;
    const { finalRemarks, technicalScore, teamworkScore } = req.body;

    const progress = await InternshipProgress.findById(progressId)
      .populate('student', 'fullName rollNumber')
      .populate('opportunity', 'title');

    if (!progress) {
      return ApiResponse.error(res, 'Internship record not found', 404, 'NOT_FOUND');
    }

    const certificateId = `CERT-AYUSH-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const hashPayload = `${certificateId}:${progress.student._id}:${progress.opportunity._id}:${new Date().toISOString()}`;
    const certificateHash = crypto.createHash('sha256').update(hashPayload).digest('hex');

    progress.completionStatus = 'Completed';
    progress.endDate = new Date();
    progress.finalEvaluation = {
      technicalCompetence: technicalScore || 5,
      professionalPunctuality: 5,
      teamworkAndCommunication: teamworkScore || 5,
      overallScorePercentage: Math.round(((technicalScore || 5) + (teamworkScore || 5)) * 10),
      finalRemarks: finalRemarks || 'Successfully completed internship tenure with high diligence.',
      evaluatedAt: new Date()
    };
    progress.certificate = {
      issued: true,
      certificateId,
      certificateHash,
      issueDate: new Date(),
      downloadUrl: `/certificates/${certificateId}.pdf`
    };

    await progress.save();

    // Record immutable audit event
    logAuditEvent({
      actor: req.user.id,
      actorRole: 'industry',
      action: 'INTERNSHIP_COMPLETED',
      entityType: 'InternshipProgress',
      entityId: progress._id,
      ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      details: { certificateId, certificateHash }
    });

    // Notify student of completion certificate
    try {
      const student = await StudentProfile.findById(progress.student).select('user');
      if (student && student.user) {
        await createNotification({
          recipient: student.user,
          title: 'Internship Successfully Completed!',
          message: `Congratulations! Your internship has been concluded and Certificate ID ${certificateId} has been generated.`,
          type: 'ASSESSMENT_COMPLETED',
          link: '/internship-tracker'
        });
      }
    } catch (notifErr) {
      console.warn('[Notification Dispatch Warning]', notifErr.message);
    }

    return ApiResponse.success(res, progress, 'Internship completed and verifiable certificate issued');
  } catch (error) {
    next(error);
  }
};
