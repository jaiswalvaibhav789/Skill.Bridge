const IndustryProfile = require('../models/IndustryProfile');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const InternshipProgress = require('../models/InternshipProgress');
const StudentProfile = require('../models/StudentProfile');
const ApiResponse = require('../utils/apiResponse');
const { createNotification } = require('../utils/notificationService');
const { logAuditEvent } = require('../utils/auditLogger');

// @desc    Get industry profile
// @route   GET /api/industry/profile
// @access  Private (Industry)
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await IndustryProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Industry profile not found', 404, 'NOT_FOUND');
    }
    return ApiResponse.success(res, profile, 'Industry profile loaded');
  } catch (error) {
    next(error);
  }
};

// @desc    Update industry profile
// @route   PUT /api/industry/profile
// @access  Private (Industry)
exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await IndustryProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Profile not found', 404, 'NOT_FOUND');
    }

    const { companyName, industryType, ayushBranch, website, location, description } = req.body;
    if (companyName) profile.companyName = companyName;
    if (industryType) profile.industryType = industryType;
    if (ayushBranch) profile.ayushBranch = ayushBranch;
    if (website) profile.website = website;
    if (location) profile.location = location;
    if (description) profile.description = description;

    await profile.save();
    return ApiResponse.success(res, profile, 'Industry profile updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Create new opportunity
// @route   POST /api/industry/opportunities
// @access  Private (Industry)
exports.createOpportunity = async (req, res, next) => {
  try {
    const profile = await IndustryProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Industry profile required', 404, 'NOT_FOUND');
    }

    const {
      title,
      type,
      description,
      location,
      stipendOrSalary,
      durationMonths,
      requiredSkills,
      preferredSkills,
      deadline
    } = req.body;

    const opportunity = await Opportunity.create({
      industry: profile._id,
      title,
      type,
      description,
      location,
      stipendOrSalary,
      durationMonths,
      requiredSkills: requiredSkills || [],
      preferredSkills: preferredSkills || [],
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    // Record immutable audit log
    logAuditEvent({
      actor: req.user.id,
      actorRole: req.user.role || 'industry',
      action: 'OPPORTUNITY_CREATED',
      entityType: 'Opportunity',
      entityId: opportunity._id,
      ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      details: { title: opportunity.title, type: opportunity.type, durationMonths: opportunity.durationMonths }
    });

    return ApiResponse.created(res, opportunity, 'Opportunity created successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all opportunities posted by this industry recruiter
// @route   GET /api/industry/opportunities
// @access  Private (Industry)
exports.getMyOpportunities = async (req, res, next) => {
  try {
    const profile = await IndustryProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Industry profile not found', 404, 'NOT_FOUND');
    }

    const opportunities = await Opportunity.find({ industry: profile._id })
      .populate('requiredSkills', 'name')
      .populate('preferredSkills', 'name')
      .sort({ createdAt: -1 });

    const results = await Promise.all(
      opportunities.map(async (opp) => {
        const applicantCount = await Application.countDocuments({ opportunity: opp._id });
        return {
          ...opp.toObject(),
          applicantCount
        };
      })
    );

    return ApiResponse.success(res, results, 'Opportunities retrieved', 200, { totalRecords: results.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for an opportunity sorted by match score
// @route   GET /api/industry/opportunities/:id/applicants
// @access  Private (Industry)
exports.getOpportunityApplicants = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return ApiResponse.error(res, 'Opportunity not found', 404, 'NOT_FOUND');
    }

    const applicants = await Application.find({ opportunity: opportunity._id })
      .populate({
        path: 'student',
        populate: [
          { path: 'user', select: 'email' },
          { path: 'institute', select: 'instituteName' },
          { path: 'skills.skill', select: 'name category' }
        ]
      })
      .populate('missingSkills', 'name category')
      .sort({ matchScore: -1 });

    return ApiResponse.success(res, {
      opportunityTitle: opportunity.title,
      applicants
    }, 'Applicants loaded and ranked by match score', 200, { totalRecords: applicants.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Under_Review, Shortlist, Interview_Scheduled, Offer, Accept, Reject)
// @route   PUT /api/industry/applications/:id/status
// @access  Private (Industry)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, feedback, interviewSchedule } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('opportunity');

    if (!application) {
      return ApiResponse.error(res, 'Application not found', 404, 'NOT_FOUND');
    }

    // State Machine Validation
    const VALID_TRANSITIONS = {
      'Applied': ['Under_Review', 'Shortlisted', 'Rejected'],
      'Under_Review': ['Shortlisted', 'Interview_Scheduled', 'Rejected'],
      'Shortlisted': ['Interview_Scheduled', 'Offered', 'Rejected'],
      'Interview_Scheduled': ['Offered', 'Rejected'],
      'Offered': ['Accepted', 'Rejected'],
      'Accepted': [],
      'Rejected': [],
      'Withdrawn': []
    };

    if (status && status !== application.status) {
      const allowed = VALID_TRANSITIONS[application.status] || [];
      if (!allowed.includes(status)) {
        return ApiResponse.error(
          res,
          `Invalid state transition: Cannot transition from '${application.status}' to '${status}'. Permitted next states: [${allowed.join(', ') || 'Terminal'}]`,
          400,
          'INVALID_STATE_TRANSITION'
        );
      }
      application.status = status;
    }

    if (feedback !== undefined) application.feedback = feedback;

    // Handle Interview Scheduling
    if (status === 'Interview_Scheduled' && interviewSchedule) {
      application.interviewSchedule = {
        scheduledDate: interviewSchedule.scheduledDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        roundName: interviewSchedule.roundName || 'Round 1: Technical Samhita & Practical Viva',
        meetingLink: interviewSchedule.meetingLink || 'https://meet.google.com/ayu-shbr-dge',
        locationDetails: interviewSchedule.locationDetails || 'Virtual Interview Room (Google Meet)',
        instructions: interviewSchedule.instructions || 'Please keep your BAMS transcripts and clinical case records handy.',
        scheduledAt: new Date()
      };
    }

    await application.save();

    // Record immutable audit log for state transition
    logAuditEvent({
      actor: req.user.id,
      actorRole: req.user.role || 'industry',
      action: 'APPLICATION_STATUS_CHANGE',
      entityType: 'Application',
      entityId: application._id,
      ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      details: {
        opportunityId: application.opportunity?._id || application.opportunity,
        opportunityTitle: application.opportunity?.title,
        status: application.status
      }
    });

    // Dispatch real-time notification to candidate
    try {
      const studentProfile = await StudentProfile.findById(application.student).select('user fullName');
      if (studentProfile && studentProfile.user) {
        await createNotification({
          recipient: studentProfile.user,
          title: `Application Status: ${application.status.replace('_', ' ')}`,
          message: `Your application for "${application.opportunity?.title || 'the opportunity'}" has been updated to "${application.status.replace('_', ' ')}".`,
          type: 'APPLICATION_UPDATE',
          link: '/applications'
        });
      }
    } catch (notifErr) {
      console.warn('[Notification Dispatch Warning]', notifErr.message);
    }

    // If status is updated to 'Offered' or 'Accepted', automatically initialize InternshipProgress tracking if not existing
    if (status === 'Offered' || status === 'Accepted') {
      const existingProgress = await InternshipProgress.findOne({ application: application._id });
      if (!existingProgress && application.opportunity) {
        await InternshipProgress.create({
          application: application._id,
          opportunity: application.opportunity._id,
          student: application.student,
          industry: application.opportunity.industry,
          completionStatus: 'Active'
        });
      }
    }

    return ApiResponse.success(res, application, `Candidate application status updated to ${application.status}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Explore pre-ranked talent pool with skill and CGPA filters
// @route   GET /api/industry/talent-pool
// @access  Private (Industry, Admin)
exports.getTalentPool = async (req, res, next) => {
  try {
    const { degree, minCgpa, skillId, search } = req.query;
    const query = {};

    if (degree && degree !== 'All') query.degree = degree;
    if (minCgpa) query.cgpa = { $gte: Number(minCgpa) };
    if (skillId && skillId !== 'All') {
      query['skills.skill'] = skillId;
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await StudentProfile.find(query)
      .populate('institute', 'instituteName code')
      .populate('skills.skill', 'name category')
      .populate('targetCareerRole', 'title averageSalaryRange')
      .select('fullName degree department rollNumber passingYear cgpa portfolioSlug skills targetCareerRole bio')
      .sort({ cgpa: -1 });

    return ApiResponse.success(res, students, 'Talent pool retrieved successfully', 200, { totalCandidates: students.length });
  } catch (error) {
    next(error);
  }
};
