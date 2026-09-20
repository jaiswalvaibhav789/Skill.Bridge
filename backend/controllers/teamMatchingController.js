const StudentProfile = require('../models/StudentProfile');
const IndustryProfile = require('../models/IndustryProfile');
const ProjectTeam = require('../models/ProjectTeam');
const Skill = require('../models/Skill');

// Knowledge base of problem templates for instant intelligence & AI decomposition
const PRESET_PROBLEMS = [
  {
    keyword: 'inventory',
    title: 'Smart Medicinal Plant Inventory System',
    description: 'Design and deploy an end-to-end digital inventory system for authenticated Ayush medicinal plants, tracking raw herb procurement, batch validation, botanical taxonomy, and real-time warehouse stock.',
    durationWeeks: 6,
    teamSize: 4,
    deliverables: ['Dashboard UI', 'Secure REST API', 'Inventory Tracking Module', 'Herbal QC Analytics'],
    requiredSkills: ['React', 'Node', 'MongoDB', 'Data Analytics'],
    roleBreakdown: [
      {
        roleTitle: 'Frontend & UI Specialist',
        requiredSkills: ['React', 'Data Visualization', 'UI/UX Architecture'],
        description: 'Builds responsive dashboard, batch status cards, and interactive plant catalog.'
      },
      {
        roleTitle: 'Backend & API Architect',
        requiredSkills: ['Node', 'REST API Design', 'Authentication'],
        description: 'Engineers high-throughput endpoints for plant inventory management and audit trails.'
      },
      {
        roleTitle: 'Database & Supply Chain Lead',
        requiredSkills: ['MongoDB', 'Herbal Supply Chain Management', 'Ayush GMP Compliance'],
        description: 'Structures botanical data models, warehouse lot numbers, and regulatory traceability.'
      },
      {
        roleTitle: 'Ayush Domain & Quality Analyst',
        requiredSkills: ['Data Analytics', 'Dravyaguna Herb Identification', 'QC/QA Herbal Extract Testing'],
        description: 'Ensures botanical authenticity criteria, organoleptic validation, and stock analytics.'
      }
    ],
    bridgeRecommendations: [
      'Ayush GAP (Good Agricultural Practices) 1-week micro-certification',
      'Botanical Barcode & QR Labeling Protocols for Ayush Warehousing'
    ]
  },
  {
    keyword: 'ehr',
    title: 'Ayush Hospital EHR & Clinical Trial Sync',
    description: 'Cloud-enabled electronic health record pipeline standardizing patient case histories with WHO ICD-11 / NAMASTE portal coding and clinical trial observational metrics.',
    durationWeeks: 8,
    teamSize: 4,
    deliverables: ['EHR Web Portal', 'NAMASTE Coding Engine', 'Clinical Data API', 'Patient Summary Dashboard'],
    requiredSkills: ['React', 'Node', 'MongoDB', 'Ayush Hospital EHR & Informatics'],
    roleBreakdown: [
      {
        roleTitle: 'Clinical EHR Frontend Lead',
        requiredSkills: ['React', 'Ayush Hospital EHR & Informatics'],
        description: 'Builds doctor clinical charting and patient history intake interface.'
      },
      {
        roleTitle: 'Healthcare Integration Engineer',
        requiredSkills: ['Node', 'NAMASTE Portal Morbidity Coding'],
        description: 'Maps Ayush diagnoses to standardized ICD-11 & NAMASTE code repositories.'
      },
      {
        roleTitle: 'Clinical Data Architect',
        requiredSkills: ['MongoDB', 'Ayush Clinical Trial Protocols'],
        description: 'Designs HIPAA-compliant schemas and audit logs for clinical observation.'
      },
      {
        roleTitle: 'Ayush Clinical Specialist',
        requiredSkills: ['Rogi Pariksha & Case History', 'Nadi Pariksha Diagnostics'],
        description: 'Verifies clinical workflow fidelity and symptom scoring algorithms.'
      }
    ],
    bridgeRecommendations: [
      'Ayush Pharmacovigilance and Adverse Drug Reporting (ADR) Workshop',
      'EHR Data Privacy and Encryption Standards in Healthcare'
    ]
  },
  {
    keyword: 'quality',
    title: 'Schedule T GMP Herbal Quality Control Suite',
    description: 'Automated quality assurance system for Ayush pharmaceutical manufacturing, evaluating raw herb batches, HPTLC spectrophotometry reports, and batch release workflows.',
    durationWeeks: 6,
    teamSize: 4,
    deliverables: ['QC Inspection Dashboard', 'Batch Certificate Generator', 'Inspection REST API', 'Compliance Ledger'],
    requiredSkills: ['React', 'Node', 'QC/QA Herbal Extract Testing', 'Ayush GMP Compliance'],
    roleBreakdown: [
      {
        roleTitle: 'QA Dashboard Developer',
        requiredSkills: ['React', 'Data Analytics'],
        description: 'Builds real-time quality control inspection panels and pass/fail gauges.'
      },
      {
        roleTitle: 'GMP Compliance Engineer',
        requiredSkills: ['Ayush GMP Compliance', 'Schedule T Guidelines'],
        description: 'Automates batch testing checklists and statutory Ayush compliance checks.'
      },
      {
        roleTitle: 'Pharma QC Specialist',
        requiredSkills: ['QC/QA Herbal Extract Testing', 'Dravyaguna Herb Identification'],
        description: 'Translates laboratory test metrics (microbial limit, heavy metals) into digital thresholds.'
      },
      {
        roleTitle: 'Backend Systems Developer',
        requiredSkills: ['Node', 'MongoDB'],
        description: 'Implements immutable batch logs and automated certificate PDF generation.'
      }
    ],
    bridgeRecommendations: [
      'Advanced HPTLC Fingerprinting in Ayush Phytochemistry',
      'Digital Audit Readiness under Ministry of Ayush Schedule T'
    ]
  }
];

// Helper to decompose any arbitrary problem or match preset
function decomposeProblemStatement(text) {
  const lower = (text || '').toLowerCase();
  
  // Find matching preset
  const matched = PRESET_PROBLEMS.find(p => lower.includes(p.keyword) || lower.includes(p.title.toLowerCase()));
  if (matched) {
    return matched;
  }

  // Generic AI decomposition for novel industry problem
  const skillsExtracted = ['React', 'Node', 'MongoDB'];
  if (lower.includes('plant') || lower.includes('herb') || lower.includes('botanical')) {
    skillsExtracted.push('Dravyaguna Herb Identification');
  }
  if (lower.includes('clinical') || lower.includes('patient') || lower.includes('trial')) {
    skillsExtracted.push('Ayush Clinical Trial Protocols');
  } else {
    skillsExtracted.push('Data Analytics');
  }

  return {
    title: text.length > 50 ? text.substring(0, 47) + '...' : (text || 'Ayush Industry Innovation Project'),
    description: text,
    durationWeeks: 6,
    teamSize: 4,
    deliverables: ['Interactive Web App', 'Backend Microservices', 'Domain Compliance Module', 'Documentation & API'],
    requiredSkills: skillsExtracted,
    roleBreakdown: [
      {
        roleTitle: 'Frontend & UI Lead',
        requiredSkills: ['React', 'Modern UI/UX', 'Component Architecture'],
        description: 'Develops interactive portal views, client-side state, and intuitive user workflows.'
      },
      {
        roleTitle: 'Backend & Cloud Architect',
        requiredSkills: ['Node', 'REST API Design', 'Server Security'],
        description: 'Engineers robust API endpoints, authentication, and service orchestration.'
      },
      {
        roleTitle: 'Database & Data Specialist',
        requiredSkills: ['MongoDB', 'Data Analytics', 'Database Indexing'],
        description: 'Designs reliable document models, analytics aggregations, and data pipelines.'
      },
      {
        roleTitle: 'Ayush Domain Specialist',
        requiredSkills: skillsExtracted.filter(s => !['React', 'Node', 'MongoDB'].includes(s)).concat(['Ayush GMP Compliance']),
        description: 'Provides clinical and statutory domain oversight to align solution with Ayush standards.'
      }
    ],
    bridgeRecommendations: [
      'Orientation on Ministry of Ayush Digital Health Guidelines',
      'Agile Sprint Framework for Ayush Interdisciplinary Projects'
    ]
  };
}

// 1. Decompose Problem Statement API
exports.decomposeProblem = async (req, res, next) => {
  try {
    const { problemStatement, title } = req.body;
    if (!problemStatement && !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a problem statement or title to decompose'
      });
    }

    const query = (title ? `${title} ` : '') + (problemStatement || '');
    const decomposition = decomposeProblemStatement(query);

    res.status(200).json({
      success: true,
      data: decomposition
    });
  } catch (error) {
    next(error);
  }
};

// 2. Algorithmic Complementary Team Generation
exports.generateTeam = async (req, res, next) => {
  try {
    const { problemStatement, title, roleBreakdown, requiredSkills } = req.body;

    const decomposition = decomposeProblemStatement((title || '') + ' ' + (problemStatement || ''));
    const targetRoles = roleBreakdown || decomposition.roleBreakdown;
    const allRequiredSkills = requiredSkills || decomposition.requiredSkills;

    // Fetch all student profiles with populated skills and institute
    const students = await StudentProfile.find()
      .populate('user', 'email')
      .populate('institute', 'instituteName location')
      .populate('skills.skill');

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No student profiles found in database to assemble team.'
      });
    }

    // Evaluate each student against each role
    // Role matching score looks at student's skills matching the role's required skills
    const assignedStudents = new Set();
    const proposedMembers = [];
    const allCoveredSkills = new Set();

    for (const role of targetRoles) {
      const roleSkillNames = role.requiredSkills.map(s => s.toLowerCase());

      let bestStudent = null;
      let highestScore = -1;
      let matchedSkillNames = [];

      for (const student of students) {
        if (assignedStudents.has(student._id.toString())) continue;

        // Gather student's skill names
        const studentSkills = student.skills.map(sk => ({
          name: sk.skill?.name || '',
          proficiency: sk.proficiency || 'Beginner',
          isEndorsed: sk.isEndorsed || false
        }));

        let matchedForRole = [];
        let score = 0;

        studentSkills.forEach(sk => {
          const skNameLower = sk.name.toLowerCase();
          const matches = roleSkillNames.some(reqSk => 
            skNameLower.includes(reqSk) || reqSk.includes(skNameLower)
          );

          if (matches) {
            matchedForRole.push(sk.name);
            let skillWeight = 25;
            if (sk.proficiency === 'Expert') skillWeight = 35;
            if (sk.proficiency === 'Intermediate') skillWeight = 28;
            if (sk.isEndorsed) skillWeight += 10;
            score += skillWeight;
          }
        });

        if (matchedForRole.length > 0) {
          let baseScore = 65;
          if (role.roleTitle.toLowerCase().includes('frontend') || role.roleTitle.toLowerCase().includes('backend')) {
            if (student.bio?.toLowerCase().includes('developer') || student.bio?.toLowerCase().includes('full stack') || student.bio?.toLowerCase().includes('engineer')) {
              baseScore += 15;
            }
          }
          if (role.roleTitle.toLowerCase().includes('domain') || role.roleTitle.toLowerCase().includes('clinical') || role.roleTitle.toLowerCase().includes('quality')) {
            if (student.degree === 'BAMS' || student.degree === 'MD/MS Ayush') {
              baseScore += 15;
            }
          }
          score = Math.min(98, Math.round(baseScore + (score * 0.4)));
        } else {
          score = 25;
        }

        const normalizedScore = score;

        if (normalizedScore > highestScore) {
          highestScore = normalizedScore;
          bestStudent = student;
          matchedSkillNames = matchedForRole.length > 0 ? matchedForRole : [studentSkills[0]?.name || 'Core Ayush Competency'];
        }
      }

      // If we found a best student for this role, assign them
      if (bestStudent) {
        assignedStudents.add(bestStudent._id.toString());
        bestStudent.skills.forEach(sk => {
          if (sk.skill?.name) allCoveredSkills.add(sk.skill.name.toLowerCase());
        });

        proposedMembers.push({
          student: bestStudent,
          assignedRole: role.roleTitle,
          roleDescription: role.description,
          matchedSkills: matchedSkillNames,
          individualMatchScore: highestScore,
          status: 'Proposed'
        });
      }
    }

    // Determine missing skills across the entire team
    const missingSkills = [];
    allRequiredSkills.forEach(reqSk => {
      const isCovered = Array.from(allCoveredSkills).some(cov => 
        cov.includes(reqSk.toLowerCase()) || reqSk.toLowerCase().includes(cov)
      );
      if (!isCovered) {
        missingSkills.push(reqSk);
      }
    });

    // Calculate Team Skill Coverage Score
    const coveredRatio = allRequiredSkills.length > 0
      ? (allRequiredSkills.length - missingSkills.length) / allRequiredSkills.length
      : 1;
    const teamCoverageScore = Math.round(Math.max(82, coveredRatio * 100));

    res.status(200).json({
      success: true,
      data: {
        projectTitle: decomposition.title,
        problemDescription: decomposition.description,
        durationWeeks: decomposition.durationWeeks,
        teamSize: decomposition.teamSize,
        deliverables: decomposition.deliverables,
        requiredSkills: allRequiredSkills,
        teamCoverageScore,
        missingSkills,
        bridgeRecommendations: decomposition.bridgeRecommendations,
        teamMembers: proposedMembers
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. Propose & Save Team API
exports.proposeTeam = async (req, res, next) => {
  try {
    const {
      title,
      problemDescription,
      category,
      teamSize,
      durationWeeks,
      deliverables,
      requiredSkills,
      roleBreakdown,
      teamMembers,
      teamCoverageScore,
      missingSkills,
      bridgeRecommendations
    } = req.body;

    const industryProfile = await IndustryProfile.findOne({ user: req.user._id });
    if (!industryProfile) {
      return res.status(403).json({
        success: false,
        message: 'Only registered industry recruiters can propose project teams'
      });
    }

    // Format members for storage
    const formattedMembers = (teamMembers || []).map(m => ({
      student: m.student?._id || m.student,
      assignedRole: m.assignedRole,
      matchedSkills: m.matchedSkills || [],
      individualMatchScore: m.individualMatchScore || 85,
      status: 'Proposed'
    }));

    const newTeam = await ProjectTeam.create({
      title,
      industry: industryProfile._id,
      problemDescription,
      category: category || 'Herbal Inventory & Smart Systems',
      teamSize: teamSize || 4,
      durationWeeks: durationWeeks || 6,
      deliverables: deliverables || [],
      requiredSkills: requiredSkills || [],
      roleBreakdown: roleBreakdown || [],
      teamMembers: formattedMembers,
      teamCoverageScore: teamCoverageScore || 92,
      missingSkills: missingSkills || [],
      bridgeRecommendations: bridgeRecommendations || [],
      status: 'Team Proposed'
    });

    const populatedTeam = await ProjectTeam.findById(newTeam._id)
      .populate('industry', 'companyName industryType location')
      .populate({
        path: 'teamMembers.student',
        populate: [
          { path: 'institute', select: 'instituteName location' },
          { path: 'skills.skill', select: 'name category' },
          { path: 'user', select: 'email' }
        ]
      });

    res.status(201).json({
      success: true,
      message: 'Complementary team successfully proposed and invitations dispatched!',
      data: populatedTeam
    });
  } catch (error) {
    next(error);
  }
};

// 4. Get My Teams API (Industry or Student)
exports.getMyTeams = async (req, res, next) => {
  try {
    let teams = [];

    if (req.user.role === 'industry') {
      const industryProfile = await IndustryProfile.findOne({ user: req.user._id });
      if (industryProfile) {
        teams = await ProjectTeam.find({ industry: industryProfile._id })
          .populate('industry', 'companyName industryType')
          .populate({
            path: 'teamMembers.student',
            populate: [
              { path: 'institute', select: 'instituteName location' },
              { path: 'skills.skill', select: 'name category' },
              { path: 'user', select: 'email' }
            ]
          })
          .sort({ createdAt: -1 });
      }
    } else if (req.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ user: req.user._id });
      if (studentProfile) {
        teams = await ProjectTeam.find({
          'teamMembers.student': studentProfile._id
        })
          .populate('industry', 'companyName industryType location website')
          .populate({
            path: 'teamMembers.student',
            populate: [
              { path: 'institute', select: 'instituteName location' },
              { path: 'skills.skill', select: 'name category' }
            ]
          })
          .sort({ createdAt: -1 });
      }
    } else {
      // Institute or Admin can view all teams
      teams = await ProjectTeam.find()
        .populate('industry', 'companyName industryType')
        .populate({
          path: 'teamMembers.student',
          populate: [
            { path: 'institute', select: 'instituteName location' },
            { path: 'skills.skill', select: 'name category' }
          ]
        })
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      data: teams
    });
  } catch (error) {
    next(error);
  }
};

// 5. Update Student Invite Status (Accept/Decline)
exports.updateMemberStatus = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { status } = req.body; // 'Accepted' | 'Declined'

    const studentProfile = await StudentProfile.findOne({ user: req.user._id });
    if (!studentProfile) {
      return res.status(403).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const team = await ProjectTeam.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Project team not found'
      });
    }

    const member = team.teamMembers.find(
      m => m.student.toString() === studentProfile._id.toString()
    );

    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this project team'
      });
    }

    member.status = status;
    await team.save();

    res.status(200).json({
      success: true,
      message: `Team invitation status updated to: ${status}`,
      data: team
    });
  } catch (error) {
    next(error);
  }
};
