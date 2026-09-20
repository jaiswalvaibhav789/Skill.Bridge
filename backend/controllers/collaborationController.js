const CollaborationProposal = require('../models/CollaborationProposal');
const FacultyProfile = require('../models/FacultyProfile');
const IndustryProfile = require('../models/IndustryProfile');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all active collaborations with query filters
// @route   GET /api/collaborations
// @access  Public / Authenticated
exports.getAllCollaborations = async (req, res, next) => {
  try {
    const { type, status, search } = req.query;
    const query = {};

    if (type && type !== 'All') query.type = type;
    if (status && status !== 'All') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const collaborations = await CollaborationProposal.find(query)
      .populate('industry', 'companyName industryType location')
      .populate('faculty', 'fullName designation department')
      .populate('institute', 'instituteName location')
      .populate('applications.applicantFaculty', 'fullName designation department')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, collaborations, 'Collaborations retrieved successfully', 200, {
      totalRecords: collaborations.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single collaboration by ID
// @route   GET /api/collaborations/:id
// @access  Public / Authenticated
exports.getCollaborationById = async (req, res, next) => {
  try {
    const collaboration = await CollaborationProposal.findById(req.params.id)
      .populate('industry', 'companyName industryType location contactEmail website')
      .populate('faculty', 'fullName designation department publications industryConsultingHistory')
      .populate('institute', 'instituteName location')
      .populate({
        path: 'applications.applicantFaculty',
        populate: { path: 'institute', select: 'instituteName' }
      });

    if (!collaboration) {
      return ApiResponse.error(res, 'Collaboration not found', 404, 'NOT_FOUND');
    }

    return ApiResponse.success(res, collaboration, 'Collaboration details retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Create new Collaboration Call or Consulting Request
// @route   POST /api/collaborations
// @access  Private (Industry, Faculty, Institute, Admin)
exports.createCollaboration = async (req, res, next) => {
  try {
    const { title, type, description, budget, durationMonths, deliverables, targetFacultyId } = req.body;

    let initiatorType = 'Industry';
    let industryId = null;
    let facultyId = null;
    let instituteId = null;

    if (req.user.role === 'industry') {
      initiatorType = 'Industry';
      const indProfile = await IndustryProfile.findOne({ user: req.user.id });
      if (indProfile) industryId = indProfile._id;
    } else if (req.user.role === 'faculty') {
      initiatorType = 'Faculty';
      const facProfile = await FacultyProfile.findOne({ user: req.user.id });
      if (facProfile) {
        facultyId = facProfile._id;
        instituteId = facProfile.institute;
      }
    } else if (req.user.role === 'institute') {
      initiatorType = 'Institute';
    } else if (req.user.role === 'admin') {
      initiatorType = 'Ministry';
    }

    // If consulting request targeted to a specific faculty member
    if (type === 'Consulting_Request' && targetFacultyId) {
      facultyId = targetFacultyId;
    }

    const collaboration = await CollaborationProposal.create({
      title,
      type: type || 'Joint_R&D',
      initiatorType,
      industry: industryId,
      faculty: facultyId,
      institute: instituteId,
      description,
      budget: budget || 'Funded / Sponsored',
      durationMonths: Number(durationMonths) || 12,
      deliverables: Array.isArray(deliverables) ? deliverables : (deliverables ? [deliverables] : []),
      status: 'Open_Call'
    });

    return ApiResponse.created(res, collaboration, 'Collaboration posting created successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Faculty submits proposal to an open collaboration call
// @route   POST /api/collaborations/:id/apply
// @access  Private (Faculty)
exports.submitProposal = async (req, res, next) => {
  try {
    const facProfile = await FacultyProfile.findOne({ user: req.user.id });
    if (!facProfile) {
      return ApiResponse.error(res, 'Faculty profile required to submit proposal', 404, 'NOT_FOUND');
    }

    const collaboration = await CollaborationProposal.findById(req.params.id);
    if (!collaboration) {
      return ApiResponse.error(res, 'Collaboration call not found', 404, 'NOT_FOUND');
    }

    if (collaboration.status !== 'Open_Call') {
      return ApiResponse.error(res, 'This collaboration call is no longer accepting submissions', 400, 'CALL_CLOSED');
    }

    // Prevent duplicate proposal by same faculty
    const alreadyApplied = (collaboration.applications || []).some(
      app => app.applicantFaculty.toString() === facProfile._id.toString()
    );

    if (alreadyApplied) {
      return ApiResponse.error(res, 'You have already submitted a proposal for this call', 400, 'ALREADY_SUBMITTED');
    }

    const { proposalAbstract, proposedBudget, estimatedMonths } = req.body;
    if (!proposalAbstract) {
      return ApiResponse.error(res, 'Proposal abstract and methodology are required', 400, 'VALIDATION_ERROR');
    }

    collaboration.applications.push({
      applicantFaculty: facProfile._id,
      proposalAbstract,
      proposedBudget: proposedBudget || collaboration.budget,
      estimatedMonths: Number(estimatedMonths) || collaboration.durationMonths,
      status: 'Submitted',
      submittedAt: new Date()
    });

    await collaboration.save();

    return ApiResponse.success(res, collaboration, 'Research proposal submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Review and approve/reject proposal (Industry / Overseer)
// @route   PUT /api/collaborations/:id/review-proposal
// @access  Private (Industry, Admin)
exports.reviewProposal = async (req, res, next) => {
  try {
    const { applicationId, decision } = req.body; // decision: 'Accepted' | 'Rejected'
    const collaboration = await CollaborationProposal.findById(req.params.id);

    if (!collaboration) {
      return ApiResponse.error(res, 'Collaboration not found', 404, 'NOT_FOUND');
    }

    const targetApp = (collaboration.applications || []).id(applicationId);
    if (!targetApp) {
      return ApiResponse.error(res, 'Application proposal not found', 404, 'NOT_FOUND');
    }

    targetApp.status = decision;
    if (decision === 'Accepted') {
      collaboration.status = 'Approved';
      collaboration.faculty = targetApp.applicantFaculty;
    }

    await collaboration.save();

    return ApiResponse.success(res, collaboration, `Proposal ${decision.toLowerCase()} successfully`);
  } catch (error) {
    next(error);
  }
};

// @desc    Faculty responds to direct consulting request (Accept/Decline)
// @route   PUT /api/collaborations/:id/consulting-response
// @access  Private (Faculty)
exports.respondConsultingRequest = async (req, res, next) => {
  try {
    const { decision } = req.body; // 'Approved' | 'Declined'
    const facProfile = await FacultyProfile.findOne({ user: req.user.id });
    if (!facProfile) {
      return ApiResponse.error(res, 'Faculty profile required', 404, 'NOT_FOUND');
    }

    const collaboration = await CollaborationProposal.findById(req.params.id);
    if (!collaboration) {
      return ApiResponse.error(res, 'Consulting request not found', 404, 'NOT_FOUND');
    }

    collaboration.status = decision === 'Approved' ? 'Approved' : 'Declined';
    await collaboration.save();

    return ApiResponse.success(res, collaboration, `Consulting request marked as ${decision}`);
  } catch (error) {
    next(error);
  }
};
