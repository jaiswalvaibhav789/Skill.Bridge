const StudentProfile = require('../models/StudentProfile');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Skill = require('../models/Skill');
const { calculateSkillMatch, calculateMultiFactorCompatibility } = require('./matchingController');
const ApiResponse = require('../utils/apiResponse');
const { generateCredentialHash, verifyCredentialIntegrity, generateLedgerMetadata } = require('../utils/credentialHelper');

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student)
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id })
      .populate('skills.skill')
      .populate('institute', 'instituteName aisheCode location')
      .populate('targetCareerRole');

    if (!profile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    return ApiResponse.success(res, profile, 'Student profile loaded');
  } catch (error) {
    next(error);
  }
};

// @desc    Get public digital portfolio by unique slug
// @route   GET /api/students/portfolio/:slug
// @access  Public
exports.getPublicPortfolio = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ portfolioSlug: req.params.slug })
      .populate('skills.skill', 'name category ayushBranch industryDemandScore')
      .populate('skills.endorsedBy', 'instituteName aisheCode location')
      .populate('institute', 'instituteName location affiliatedUniversity aisheCode')
      .populate('targetCareerRole', 'title averageSalaryRange industrySector');

    if (!profile) {
      return ApiResponse.error(res, 'Digital portfolio not found', 404, 'NOT_FOUND');
    }

    // Ensure verified skills have persistent cryptographic credential hashes
    let hasUpdatedHashes = false;
    profile.skills.forEach(s => {
      if ((s.verifiedByAssessment || s.isEndorsed) && !s.credentialHash) {
        const timestamp = s.issuedAt || s.lastAssessedAt || profile.createdAt || new Date();
        s.issuedAt = timestamp;
        s.credentialHash = generateCredentialHash({
          studentId: profile._id.toString(),
          skillId: s.skill?._id?.toString() || s.skill?.toString(),
          score: s.proficiencyScore || 70,
          endorsedBy: s.endorsedBy?._id?.toString() || profile.institute?._id?.toString(),
          timestamp
        });
        hasUpdatedHashes = true;
      }
    });

    if (hasUpdatedHashes) {
      await profile.save();
    }

    // Build verifiable credentials ledger
    const credentialsLedger = profile.skills
      .filter(s => s.verifiedByAssessment || s.isEndorsed || s.credentialHash)
      .map(s => {
        const hash = s.credentialHash;
        const issuedTimestamp = s.issuedAt || s.lastAssessedAt || profile.createdAt;
        return {
          hash,
          skillId: s.skill?._id,
          skillName: s.skill?.name || 'Ayush Competency',
          category: s.skill?.category || 'Clinical & Technical',
          ayushBranch: s.skill?.ayushBranch || 'Ayurveda',
          proficiency: s.proficiency,
          proficiencyScore: s.proficiencyScore,
          isEndorsed: s.isEndorsed,
          verifiedByAssessment: s.verifiedByAssessment,
          endorsedBy: s.endorsedBy?.instituteName || profile.institute?.instituteName || 'All India Institute of Ayurveda',
          issuedAt: issuedTimestamp,
          verificationUrl: `/api/students/verify-credential/${hash}`,
          ledgerProof: generateLedgerMetadata(hash, issuedTimestamp)
        };
      });

    const publicView = {
      id: profile._id,
      portfolioSlug: profile.portfolioSlug,
      fullName: profile.fullName,
      degree: profile.degree,
      department: profile.department,
      passingYear: profile.passingYear,
      institute: profile.institute,
      targetCareerRole: profile.targetCareerRole,
      skills: profile.skills.map(s => ({
        skillId: s.skill?._id,
        name: s.skill?.name,
        category: s.skill?.category,
        proficiency: s.proficiency,
        proficiencyScore: s.proficiencyScore,
        verified: s.verifiedByAssessment,
        endorsed: s.isEndorsed,
        credentialHash: s.credentialHash,
        issuedAt: s.issuedAt
      })),
      credentialsLedger,
      projects: profile.projects,
      certifications: profile.certifications,
      bio: profile.bio,
      auditLedger: credentialsLedger.length > 0 ? credentialsLedger[0].ledgerProof : generateLedgerMetadata('genesis', profile.updatedAt)
    };

    return ApiResponse.success(res, publicView, 'Public portfolio retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile and skills
// @route   PUT /api/students/profile
// @access  Private (Student)
exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Profile not found', 404, 'NOT_FOUND');
    }

    const { fullName, degree, rollNumber, passingYear, skills, bio, resumeUrl, targetCareerRole, projects, certifications } = req.body;
    if (fullName) profile.fullName = fullName;
    if (degree) profile.degree = degree;
    if (rollNumber) profile.rollNumber = rollNumber;
    if (passingYear) profile.passingYear = passingYear;
    if (bio) profile.bio = bio;
    if (resumeUrl) profile.resumeUrl = resumeUrl;
    if (targetCareerRole) profile.targetCareerRole = targetCareerRole;
    if (skills) profile.skills = skills;
    if (projects) profile.projects = projects;
    if (certifications) profile.certifications = certifications;

    await profile.save();
    const updated = await StudentProfile.findById(profile._id)
      .populate('skills.skill')
      .populate('targetCareerRole');

    return ApiResponse.success(res, updated, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all opportunities ranked by Multi-Factor Compatibility % and missing skills
// @route   GET /api/students/matched-opportunities
// @access  Private (Student)
exports.getMatchedOpportunities = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id })
      .populate('skills.skill')
      .populate('institute')
      .populate('targetCareerRole');

    if (!profile) {
      return ApiResponse.error(res, 'Student profile required', 404, 'NOT_FOUND');
    }

    // Fetch active opportunities
    const opportunities = await Opportunity.find({ status: 'Active' })
      .populate('industry', 'companyName industryType location')
      .populate('requiredSkills', 'name category ayushBranch')
      .populate('preferredSkills', 'name category ayushBranch');

    // Fetch already submitted applications for this student
    const submittedApplications = await Application.find({ student: profile._id }).select('opportunity status');
    const appliedMap = new Map(submittedApplications.map(app => [app.opportunity.toString(), app.status]));

    // Calculate multi-factor compatibility for each opportunity
    const matchedResults = await Promise.all(
      opportunities.map(async (opp) => {
        const evalResult = calculateMultiFactorCompatibility({
          studentProfile: profile,
          opportunity: opp
        });

        const missingSkillDetails = await Skill.find({ _id: { $in: evalResult.missingSkillIds } }).select('name category');

        return {
          _id: opp._id,
          title: opp.title,
          type: opp.type,
          industry: opp.industry,
          location: opp.location,
          workplaceType: opp.workplaceType || 'On-site',
          minCgpa: opp.minCgpa,
          eligibleDegrees: opp.eligibleDegrees || [],
          stipendOrSalary: opp.stipendOrSalary,
          durationMonths: opp.durationMonths,
          deadline: opp.deadline,
          requiredSkills: opp.requiredSkills,
          preferredSkills: opp.preferredSkills,
          matchScore: evalResult.compatibilityScore,
          compatibilityScore: evalResult.compatibilityScore,
          factorBreakdown: evalResult.factorBreakdown,
          weights: evalResult.weights,
          matchReasons: evalResult.matchReasons,
          missingSkills: missingSkillDetails,
          applicationStatus: appliedMap.get(opp._id.toString()) || null
        };
      })
    );

    // Sort descending by Multi-Factor Compatibility Score
    matchedResults.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return ApiResponse.success(res, matchedResults, 'Matched opportunities retrieved', 200, { totalRecords: matchedResults.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for an opportunity
// @route   POST /api/students/apply/:opportunityId
// @access  Private (Student)
exports.applyOpportunity = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    const opportunity = await Opportunity.findById(req.params.opportunityId);
    if (!opportunity || opportunity.status !== 'Active') {
      return ApiResponse.error(res, 'Active opportunity not found', 404, 'NOT_FOUND');
    }

    // Check if already applied
    const existing = await Application.findOne({
      opportunity: opportunity._id,
      student: profile._id
    });
    if (existing) {
      return ApiResponse.error(res, 'You have already applied to this opportunity', 400, 'ALREADY_APPLIED');
    }

    // Compute snapshot match score
    const studentSkillIds = profile.skills.map(s => s.skill);
    const requiredSkillIds = opportunity.requiredSkills;
    const preferredSkillIds = opportunity.preferredSkills;

    const { matchScore, missingSkillIds } = calculateSkillMatch(
      studentSkillIds,
      requiredSkillIds,
      preferredSkillIds
    );

    const application = await Application.create({
      opportunity: opportunity._id,
      student: profile._id,
      matchScore,
      missingSkills: missingSkillIds,
      status: 'Applied'
    });

    return ApiResponse.created(res, application, 'Application submitted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by student
// @route   GET /api/students/my-applications
// @access  Private (Student)
exports.getMyApplications = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Profile not found', 404, 'NOT_FOUND');
    }

    const applications = await Application.find({ student: profile._id })
      .populate({
        path: 'opportunity',
        select: 'title type location stipendOrSalary',
        populate: { path: 'industry', select: 'companyName' }
      })
      .populate('missingSkills', 'name category')
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, applications, 'Applications retrieved', 200, { totalRecords: applications.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw an active application
// @route   PUT /api/students/applications/:id/withdraw
// @access  Private (Student)
exports.withdrawApplication = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    const application = await Application.findOne({
      _id: req.params.id,
      student: profile._id
    });

    if (!application) {
      return ApiResponse.error(res, 'Application not found', 404, 'NOT_FOUND');
    }

    if (['Accepted', 'Rejected', 'Withdrawn'].includes(application.status)) {
      return ApiResponse.error(
        res,
        `Cannot withdraw application with terminal status '${application.status}'`,
        400,
        'INVALID_STATE_TRANSITION'
      );
    }

    application.status = 'Withdrawn';
    if (req.body.reason) {
      application.feedback = `Withdrawn by applicant: ${req.body.reason}`;
    }

    await application.save();

    return ApiResponse.success(res, application, 'Application successfully withdrawn');
  } catch (error) {
    next(error);
  }
};

// @desc    Accept an offered internship/opportunity
// @route   PUT /api/students/applications/:id/accept
// @access  Private (Student)
exports.acceptOffer = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    const application = await Application.findOne({
      _id: req.params.id,
      student: profile._id
    }).populate('opportunity');

    if (!application) {
      return ApiResponse.error(res, 'Application not found', 404, 'NOT_FOUND');
    }

    if (application.status !== 'Offered') {
      return ApiResponse.error(
        res,
        `Only offered applications can be accepted. Current status is '${application.status}'`,
        400,
        'INVALID_STATE_TRANSITION'
      );
    }

    application.status = 'Accepted';
    await application.save();

    // Ensure InternshipProgress record is created
    const InternshipProgress = require('../models/InternshipProgress');
    const existingProgress = await InternshipProgress.findOne({ application: application._id });
    if (!existingProgress && application.opportunity) {
      await InternshipProgress.create({
        application: application._id,
        opportunity: application.opportunity._id,
        student: profile._id,
        industry: application.opportunity.industry,
        completionStatus: 'Active'
      });
    }

    return ApiResponse.success(res, application, 'Offer accepted! Internship progress tracking initialized.');
  } catch (error) {
    next(error);
  }
};

// @desc    Cryptographically verify a student's micro-credential by SHA-256 hash
// @route   GET /api/students/verify-credential/:hash
// @access  Public
exports.verifyCredential = async (req, res, next) => {
  try {
    const rawHash = (req.params.hash || '').trim().toLowerCase();
    if (!rawHash || rawHash.length < 10) {
      return ApiResponse.error(res, 'Invalid credential hash format', 400, 'INVALID_HASH');
    }

    // Query for student with matching credentialHash in skills or certifications
    let profile = await StudentProfile.findOne({
      $or: [
        { 'skills.credentialHash': rawHash },
        { 'certifications.credentialHash': rawHash }
      ]
    })
      .populate('skills.skill')
      .populate('skills.endorsedBy', 'instituteName aisheCode location')
      .populate('institute', 'instituteName location affiliatedUniversity aisheCode')
      .populate('targetCareerRole', 'title industrySector');

    // Fallback search: if hash not yet saved on record, check all profiles' computed hashes
    if (!profile) {
      const candidates = await StudentProfile.find({
        $or: [
          { 'skills.verifiedByAssessment': true },
          { 'skills.isEndorsed': true }
        ]
      })
        .populate('skills.skill')
        .populate('institute');

      for (const cand of candidates) {
        for (const sk of cand.skills) {
          if (sk.verifiedByAssessment || sk.isEndorsed) {
            const timestamp = sk.issuedAt || sk.lastAssessedAt || cand.createdAt;
            const computed = generateCredentialHash({
              studentId: cand._id.toString(),
              skillId: sk.skill?._id?.toString() || sk.skill?.toString(),
              score: sk.proficiencyScore || 70,
              endorsedBy: sk.endorsedBy?.toString() || cand.institute?._id?.toString(),
              timestamp
            });
            if (computed.toLowerCase() === rawHash) {
              sk.credentialHash = computed;
              sk.issuedAt = timestamp;
              await cand.save();
              profile = cand;
              break;
            }
          }
        }
        if (profile) break;
      }
    }

    if (!profile) {
      return ApiResponse.error(
        res,
        'Cryptographic credential hash signature not found or has been revoked in the National Ayush Registry.',
        404,
        'CREDENTIAL_NOT_FOUND'
      );
    }

    // Locate the matching skill or certification
    const matchedSkill = profile.skills.find(s => (s.credentialHash || '').toLowerCase() === rawHash);
    const matchedCert = !matchedSkill ? profile.certifications.find(c => (c.credentialHash || '').toLowerCase() === rawHash) : null;

    const issuedTimestamp = matchedSkill ? (matchedSkill.issuedAt || matchedSkill.lastAssessedAt || profile.createdAt) : (matchedCert?.issueDate || profile.createdAt);
    const auditLedger = generateLedgerMetadata(rawHash, issuedTimestamp);

    const credentialData = {
      valid: true,
      verificationStatus: 'AUTHENTIC_AND_VERIFIED',
      credentialHash: rawHash,
      credentialType: matchedSkill ? 'Micro-Credential Competency' : 'Accredited Certification',
      skillName: matchedSkill?.skill?.name || matchedCert?.title || 'Verified Ayush Skill',
      category: matchedSkill?.skill?.category || 'Diagnostic & Technical Proficiency',
      ayushBranch: matchedSkill?.skill?.ayushBranch || 'Ayurveda',
      proficiency: matchedSkill?.proficiency || 'Proficient',
      proficiencyScore: matchedSkill?.proficiencyScore || 85,
      isEndorsed: matchedSkill ? matchedSkill.isEndorsed : true,
      verifiedByAssessment: matchedSkill ? matchedSkill.verifiedByAssessment : true,
      student: {
        id: profile._id,
        fullName: profile.fullName,
        degree: profile.degree,
        department: profile.department,
        rollNumber: profile.rollNumber,
        passingYear: profile.passingYear,
        portfolioSlug: profile.portfolioSlug
      },
      issuer: {
        instituteName: profile.institute?.instituteName || 'All India Institute of Ayurveda',
        aisheCode: profile.institute?.aisheCode || 'U-0109',
        location: profile.institute?.location || 'New Delhi, India',
        governingBody: 'National Commission for Indian System of Medicine (NCISM)'
      },
      issuedAt: issuedTimestamp,
      auditLedger
    };

    return ApiResponse.success(
      res,
      credentialData,
      'Cryptographic credential successfully verified against Ayush National Registry'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update student public portfolio custom URL slug
// @route   PUT /api/students/portfolio-slug
// @access  Private (Student)
exports.updatePortfolioSlug = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    const { slug } = req.body;
    if (!slug || typeof slug !== 'string') {
      return ApiResponse.error(res, 'Portfolio slug is required', 400, 'INVALID_SLUG');
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (cleanSlug.length < 3) {
      return ApiResponse.error(res, 'Slug must be at least 3 characters long', 400, 'SLUG_TOO_SHORT');
    }

    const existing = await StudentProfile.findOne({
      portfolioSlug: cleanSlug,
      _id: { $ne: profile._id }
    });

    if (existing) {
      return ApiResponse.error(res, 'This portfolio URL slug is already in use by another student', 400, 'SLUG_ALREADY_EXISTS');
    }

    profile.portfolioSlug = cleanSlug;
    await profile.save();

    return ApiResponse.success(
      res,
      { portfolioSlug: cleanSlug },
      'Public portfolio slug updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Generate cryptographic micro-credential signatures for all verified competencies
// @route   POST /api/students/generate-credentials
// @access  Private (Student)
exports.generateCredentialBadges = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id })
      .populate('skills.skill')
      .populate('institute');

    if (!profile) {
      return ApiResponse.error(res, 'Student profile not found', 404, 'NOT_FOUND');
    }

    let generatedCount = 0;
    profile.skills.forEach(s => {
      if (s.verifiedByAssessment || s.isEndorsed) {
        if (!s.credentialHash) {
          const timestamp = s.issuedAt || s.lastAssessedAt || profile.createdAt || new Date();
          s.issuedAt = timestamp;
          s.credentialHash = generateCredentialHash({
            studentId: profile._id.toString(),
            skillId: s.skill?._id?.toString() || s.skill?.toString(),
            score: s.proficiencyScore || 70,
            endorsedBy: s.endorsedBy?.toString() || profile.institute?._id?.toString(),
            timestamp
          });
          generatedCount++;
        }
      }
    });

    await profile.save();

    return ApiResponse.success(
      res,
      {
        generatedCount,
        portfolioSlug: profile.portfolioSlug,
        verifiedSkillsCount: profile.skills.filter(s => s.credentialHash).length
      },
      `Generated ${generatedCount} new cryptographic credential signatures`
    );
  } catch (error) {
    next(error);
  }
};
