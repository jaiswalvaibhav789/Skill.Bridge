const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Skill = require('../models/Skill');
const InstituteProfile = require('../models/InstituteProfile');
const IndustryProfile = require('../models/IndustryProfile');
const FacultyProfile = require('../models/FacultyProfile');
const StudentProfile = require('../models/StudentProfile');
const CareerRole = require('../models/CareerRole');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const LearningProgram = require('../models/LearningProgram');
const InternshipProgress = require('../models/InternshipProgress');
const CollaborationProposal = require('../models/CollaborationProposal');
const { generateCredentialHash } = require('../utils/credentialHelper');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillbridge_ayush';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB');

    // Clean existing data
    await Promise.all([
      User.deleteMany({}),
      Skill.deleteMany({}),
      InstituteProfile.deleteMany({}),
      IndustryProfile.deleteMany({}),
      FacultyProfile.deleteMany({}),
      StudentProfile.deleteMany({}),
      CareerRole.deleteMany({}),
      Opportunity.deleteMany({}),
      Application.deleteMany({}),
      Assessment.deleteMany({}),
      Question.deleteMany({}),
      LearningProgram.deleteMany({}),
      InternshipProgress.deleteMany({}),
      CollaborationProposal.deleteMany({})
    ]);
    console.log('[Seeder] Cleaned existing collections');

    // 1. Seed Standard Skills
    const skillsData = [
      { name: 'Nadi Pariksha (Pulse Diagnosis)', category: 'Clinical', ayushBranch: 'Ayurveda', industryDemandScore: 92, benchmarkScore: 85, description: 'Traditional diagnostic pulse examination.' },
      { name: 'Panchakarma Protocol Planning', category: 'Clinical', ayushBranch: 'Ayurveda', industryDemandScore: 88, benchmarkScore: 80, description: 'Administering classical bio-cleansing therapies.' },
      { name: 'Herbal Extraction & Standardization', category: 'Pharma_Manufacturing', ayushBranch: 'Ayurveda', industryDemandScore: 94, benchmarkScore: 85, description: 'Phytochemical solvent extraction, HPLC/HPTLC QC profiling.' },
      { name: 'Ayush Good Manufacturing Practice (GMP)', category: 'Pharma_Manufacturing', ayushBranch: 'Common', industryDemandScore: 96, benchmarkScore: 90, description: 'Schedule T regulatory compliance and quality assurance in herbal units.' },
      { name: 'Clinical Trial GCP Documentation', category: 'Regulatory_Research', ayushBranch: 'Common', industryDemandScore: 90, benchmarkScore: 80, description: 'Good Clinical Practice documentation for Ayush drug trials.' },
      { name: 'Pharmacovigilance in Herbal Medicine', category: 'Regulatory_Research', ayushBranch: 'Common', industryDemandScore: 82, benchmarkScore: 75, description: 'Adverse drug reaction monitoring and ASU drug safety reporting.' },
      { name: 'Electronic Health Record (EHR) Operation', category: 'Hospital_Admin', ayushBranch: 'Common', industryDemandScore: 85, benchmarkScore: 75, description: 'Operating digital clinical record systems and telemedicine modules.' },
      { name: 'Ayush Patient Counseling & Dietetics', category: 'Soft_Skills', ayushBranch: 'Common', industryDemandScore: 80, benchmarkScore: 75, description: 'Dietary counseling (Pathya-Apathya) and lifestyle guidance.' },
      { name: 'Yoga Therapy & Asana Prescriptions', category: 'Clinical', ayushBranch: 'Yoga_Naturopathy', industryDemandScore: 84, benchmarkScore: 80, description: 'Therapeutic yoga interventions for chronic lifestyle disorders.' },
      { name: 'Ayush Tele-consultation Protocol', category: 'General_Technical', ayushBranch: 'Common', industryDemandScore: 78, benchmarkScore: 70, description: 'Remote triage, digital prescription compliance, and remote patient follow-up.' }
    ];
    const insertedSkills = await Skill.insertMany(skillsData);
    console.log(`[Seeder] Seeded ${insertedSkills.length} Skills`);

    const skillMap = {};
    insertedSkills.forEach(s => { skillMap[s.name] = s._id; });

    // 2. Seed Users
    const hashedPassword = await bcrypt.hash('Password@123', 10);

    const users = await User.insertMany([
      { email: 'admin@ayush.gov.in', password: hashedPassword, role: 'admin', isVerified: true, status: 'active' },
      { email: 'director@aiia.ac.in', password: hashedPassword, role: 'institute', isVerified: true, status: 'active' },
      { email: 'dr.sharma@aiia.ac.in', password: hashedPassword, role: 'faculty', isVerified: true, status: 'active' },
      { email: 'careers@dabur.com', password: hashedPassword, role: 'industry', isVerified: true, status: 'active' },
      { email: 'student.ayush@gmail.com', password: hashedPassword, role: 'student', isVerified: true, status: 'active' }
    ]);
    console.log(`[Seeder] Seeded ${users.length} Users with credentials (Password@123)`);

    const [adminUser, instUser, facultyUser, industryUser, studentUser] = users;

    // 3. Seed Institute Profile
    const institute = await InstituteProfile.create({
      user: instUser._id,
      instituteName: 'All India Institute of Ayurveda (AIIA), New Delhi',
      aisheCode: 'C-54321',
      affiliatedUniversity: 'Ministry of Ayush',
      recognizedDepartments: ['Ayurveda'],
      location: {
        city: 'New Delhi',
        state: 'Delhi'
      },
      isApproved: true
    });
    console.log('[Seeder] Seeded Institute Profile');

    // 4. Seed Industry Profile
    const industry = await IndustryProfile.create({
      user: industryUser._id,
      companyName: 'Dabur Ayush Research & Manufacturing Ltd',
      industryType: 'Pharmaceutical / GMP Unit',
      ayushBranch: 'Ayurveda',
      registrationNumber: 'CIN-L24230DL1975PLC007908',
      website: 'https://www.dabur.com',
      location: {
        city: 'Ghaziabad',
        state: 'Uttar Pradesh'
      },
      isApprovedByAdmin: true,
      description: 'Premier Ayurvedic pharmaceutical and research enterprise producing classical ASU formulations.'
    });
    console.log('[Seeder] Seeded Industry Profile');

    // 5. Seed Faculty Profile
    const faculty = await FacultyProfile.create({
      user: facultyUser._id,
      institute: institute._id,
      fullName: 'Prof. (Dr.) Rajesh Sharma',
      department: 'Dravyaguna (Herbal Pharmacology)',
      designation: 'Professor',
      yearsExperience: 18,
      expertise: ['Herbal Standardization', 'Clinical Phyto-pharmacology', 'Ayush GMP'],
      researchInterests: ['Standardization of Ashwagandha extract', 'Comparative Chromatography in ASU drugs'],
      publications: [
        { title: 'Standardization Markers in Withania somnifera Extracts', journal: 'Journal of Ayush Sciences', year: 2023, doiOrLink: 'https://doi.org/10.1016/j.jaim.2023.100' }
      ],
      industryConsultingHistory: [
        { companyName: 'Dabur Research Foundation', projectTitle: 'Quality control optimization of Polyherbal formulations', year: 2024, description: 'HPTLC finger-printing protocol validation.' }
      ],
      bio: 'Senior academician and researcher with over 18 years in Dravyaguna research, patent holder, and member of the Ayush Pharmacopoeia Committee.'
    });
    console.log('[Seeder] Seeded Faculty Profile');

    // 6. Seed Career Roles
    const careerRoles = await CareerRole.insertMany([
      {
        title: 'Ayush Quality Assurance & GMP Officer',
        slug: 'ayush-qa-gmp-officer',
        description: 'Oversees Schedule T regulatory compliance, in-process herbal extract batch release, and factory hygiene in pharmaceutical units.',
        industrySector: 'Pharmaceuticals',
        requiredSkills: [
          { skill: skillMap['Ayush Good Manufacturing Practice (GMP)'], minProficiencyScore: 85, weight: 1.5 },
          { skill: skillMap['Herbal Extraction & Standardization'], minProficiencyScore: 80, weight: 1.2 },
          { skill: skillMap['Clinical Trial GCP Documentation'], minProficiencyScore: 70, weight: 1.0 }
        ],
        preferredSkills: [skillMap['Pharmacovigilance in Herbal Medicine']],
        averageSalaryRange: '₹4.5 LPA - ₹8.5 LPA',
        demandIndex: 94
      },
      {
        title: 'Clinical Ayush Resident Physician',
        slug: 'clinical-ayush-resident',
        description: 'Conducts classical clinical diagnosis (Nadi Pariksha), crafts Panchakarma therapy regimens, and monitors patient recovery in hospital settings.',
        industrySector: 'Clinical Healthcare',
        requiredSkills: [
          { skill: skillMap['Nadi Pariksha (Pulse Diagnosis)'], minProficiencyScore: 80, weight: 1.5 },
          { skill: skillMap['Panchakarma Protocol Planning'], minProficiencyScore: 85, weight: 1.3 },
          { skill: skillMap['Electronic Health Record (EHR) Operation'], minProficiencyScore: 70, weight: 1.0 }
        ],
        preferredSkills: [skillMap['Ayush Patient Counseling & Dietetics']],
        averageSalaryRange: '₹5.0 LPA - ₹9.0 LPA',
        demandIndex: 90
      }
    ]);
    console.log(`[Seeder] Seeded ${careerRoles.length} Career Roles`);

    // 7. Seed Student Profile with Verifiable Cryptographic Credentials
    const studentProfileId = new mongoose.Types.ObjectId();
    const issueDate = new Date('2025-01-15');
    const pulseHash = generateCredentialHash({
      studentId: studentProfileId.toString(),
      skillId: skillMap['Nadi Pariksha (Pulse Diagnosis)'].toString(),
      score: 75,
      endorsedBy: institute._id.toString(),
      timestamp: issueDate
    });
    const extractionHash = generateCredentialHash({
      studentId: studentProfileId.toString(),
      skillId: skillMap['Herbal Extraction & Standardization'].toString(),
      score: 68,
      endorsedBy: institute._id.toString(),
      timestamp: issueDate
    });
    const certHash = generateCredentialHash({
      studentId: studentProfileId.toString(),
      skillId: 'NIA-CERT-PHARMACOPOEIA-2024',
      score: 90,
      endorsedBy: institute._id.toString(),
      timestamp: new Date('2024-03-15')
    });

    const student = await StudentProfile.create({
      _id: studentProfileId,
      user: studentUser._id,
      fullName: 'Ayush Sharma',
      institute: institute._id,
      degree: 'BAMS',
      department: 'Ayush Medicine & Surgery',
      rollNumber: 'AIIA-2022-BAMS-042',
      passingYear: 2026,
      cgpa: 8.4,
      targetCareerRole: careerRoles[0]._id,
      portfolioSlug: 'ayush-sharma-aiia',
      skills: [
        {
          skill: skillMap['Nadi Pariksha (Pulse Diagnosis)'],
          proficiency: 'Intermediate',
          proficiencyScore: 75,
          isEndorsed: true,
          endorsedBy: institute._id,
          verifiedByAssessment: true,
          lastAssessedAt: issueDate,
          credentialHash: pulseHash,
          issuedAt: issueDate
        },
        {
          skill: skillMap['Herbal Extraction & Standardization'],
          proficiency: 'Intermediate',
          proficiencyScore: 68,
          isEndorsed: true,
          endorsedBy: institute._id,
          verifiedByAssessment: true,
          lastAssessedAt: issueDate,
          credentialHash: extractionHash,
          issuedAt: issueDate
        },
        {
          skill: skillMap['Ayush Good Manufacturing Practice (GMP)'],
          proficiency: 'Beginner',
          proficiencyScore: 45,
          isEndorsed: false,
          verifiedByAssessment: false
        }
      ],
      projects: [
        {
          title: 'Comparative Phytochemical Analysis of Ashwagandha Root Formulations',
          description: 'Conducted TLC and spectrophotometric assay of withanolide content across 3 commercial batches.',
          skillsUsed: ['Herbal Extraction & Standardization', 'Ayush Good Manufacturing Practice (GMP)']
        }
      ],
      certifications: [
        {
          title: 'Certificate in Ayurvedic Pharmacopoeia Standards',
          issuingOrganization: 'National Institute of Ayurveda',
          issueDate: new Date('2024-03-15'),
          isVerified: true,
          credentialHash: certHash
        }
      ],
      bio: 'Final-year BAMS student at AIIA passionate about evidence-based Ayurvedic medicine, Schedule T herbal GMP, and quality control.'
    });
    console.log('[Seeder] Seeded Student Profile with SHA-256 Credentials');

    // 8. Seed Assessments & Questions
    const gmpAssessment = await Assessment.create({
      title: 'Ayush Schedule T & Herbal GMP Certification Quiz',
      skill: skillMap['Ayush Good Manufacturing Practice (GMP)'],
      category: 'Pharma_Manufacturing',
      difficulty: 'Intermediate',
      timeLimitMinutes: 10,
      passingScorePercentage: 70,
      totalQuestions: 4,
      isActive: true
    });

    await Question.insertMany([
      {
        assessment: gmpAssessment._id,
        prompt: 'Under Schedule T of the Drugs and Cosmetics Rules, what is the minimum floor area required for basic tablet manufacturing in ASU units?',
        options: [
          { optionKey: 'A', text: '100 sq. feet' },
          { optionKey: 'B', text: '200 sq. feet' },
          { optionKey: 'C', text: '500 sq. feet' },
          { optionKey: 'D', text: '1000 sq. feet' }
        ],
        correctOptionKey: 'B',
        explanation: 'Schedule T specifies a minimum manufacturing floor area of 200 sq. ft for tablet sections.',
        weightage: 1
      },
      {
        assessment: gmpAssessment._id,
        prompt: 'Which document must accompany every raw herbal batch to verify identity, moisture content, and heavy metal limits?',
        options: [
          { optionKey: 'A', text: 'Bill of Lading' },
          { optionKey: 'B', text: 'Certificate of Analysis (CoA)' },
          { optionKey: 'C', text: 'Customs Duty Slip' },
          { optionKey: 'D', text: 'Clinical Summary Report' }
        ],
        correctOptionKey: 'B',
        explanation: 'A Certificate of Analysis (CoA) certifies botanical identity, moisture, pesticide residues, and heavy metals.',
        weightage: 1
      },
      {
        assessment: gmpAssessment._id,
        prompt: 'What is the primary objective of HVAC air handling units in an ASU herbal extraction cleanroom?',
        options: [
          { optionKey: 'A', text: 'To reduce lighting costs' },
          { optionKey: 'B', text: 'To prevent cross-contamination and control airborne particulates' },
          { optionKey: 'C', text: 'To accelerate solvent evaporation' },
          { optionKey: 'D', text: 'To generate nitrogen gas' }
        ],
        correctOptionKey: 'B',
        explanation: 'HVAC systems maintain differential pressure and filtration to prevent microbial and particulate cross-contamination.',
        weightage: 1
      },
      {
        assessment: gmpAssessment._id,
        prompt: 'In Pharmacovigilance of ASU drugs, which national institute functions as the National Pharmacovigilance Centre (NPvC)?',
        options: [
          { optionKey: 'A', text: 'All India Institute of Ayurveda (AIIA), New Delhi' },
          { optionKey: 'B', text: 'ICMR Headquarters' },
          { optionKey: 'C', text: 'CDSCO Bhawan' },
          { optionKey: 'D', text: 'National Institute of Pharmaceutical Education' }
        ],
        correctOptionKey: 'A',
        explanation: 'AIIA New Delhi is designated as the National Pharmacovigilance Centre for ASU & H drugs.',
        weightage: 1
      }
    ]);
    console.log('[Seeder] Seeded Assessment and 4 Question entities');

    // 9. Seed Learning Programs
    const seededLearningPrograms = await LearningProgram.insertMany([
      {
        title: 'Masterclass in Schedule T: ASU Drug Good Manufacturing Practice',
        providerType: 'Industry',
        providerName: 'Dabur Ayush Research Academy',
        type: 'Course',
        description: 'Comprehensive 24-hour training on cleanroom design, batch manufacturing records (BMR), sterility validation, and regulatory audits for ASU drug manufacturing units.',
        coveredSkills: [skillMap['Ayush Good Manufacturing Practice (GMP)'], skillMap['Herbal Extraction & Standardization']],
        difficulty: 'Intermediate',
        durationHours: 24,
        cost: 'Free (Sponsored by Ayush Ministry)',
        enrollmentUrl: '#',
        rating: 4.9,
        enrolledStudentsCount: 342
      },
      {
        title: 'Advanced Phytochemical Chromatography (HPLC / HPTLC)',
        providerType: 'Institute',
        providerName: 'AIIA Central Research Labs',
        type: 'HandsOn_Training',
        description: 'Hands-on instrumentation training on qualitative fingerprinting and quantitative marker compound assaying of Ayurvedic botanical extracts.',
        coveredSkills: [skillMap['Herbal Extraction & Standardization']],
        difficulty: 'Advanced',
        durationHours: 30,
        cost: '₹1,500 (Subsidized)',
        enrollmentUrl: '#',
        rating: 4.8,
        enrolledStudentsCount: 184
      },
      {
        title: 'National Pharmacovigilance & Herbal Safety Assessor Certification',
        providerType: 'Ministry',
        providerName: 'Ayush National Pharmacovigilance Commission',
        type: 'Certification',
        description: 'Official certification on ADR reporting, Uppsala Monitoring Centre classification, herb-drug interaction monitoring, and Schedule Y compliance.',
        coveredSkills: [skillMap['Pharmacovigilance in Herbal Medicine'], skillMap['Clinical Trial GCP Documentation']],
        difficulty: 'Intermediate',
        durationHours: 40,
        cost: 'Free (National Grid)',
        enrollmentUrl: '#',
        rating: 4.9,
        enrolledStudentsCount: 512
      },
      {
        title: 'Clinical Trial GCP & Ethical Review Board Protocol Workshop',
        providerType: 'Autonomous_Body',
        providerName: 'ICMR-CCRAS Joint Clinical Board',
        type: 'Workshop',
        description: '3-day intensive workshop on CTRI trial registration, informed consent audits, double-blind randomization protocols, and clinical study report writing.',
        coveredSkills: [skillMap['Clinical Trial GCP Documentation']],
        difficulty: 'Advanced',
        durationHours: 18,
        cost: '₹750',
        enrollmentUrl: '#',
        rating: 4.7,
        enrolledStudentsCount: 220
      },
      {
        title: 'Digital EHR & Ayush Grid Telemedicine Systems',
        providerType: 'Ministry',
        providerName: 'National Ayush Mission (NAM) Tech Cell',
        type: 'Course',
        description: 'Implementation guide for Ayush Hospital Management Information Systems (A-HMIS), ABDM health records, and clinical tele-consultation workflows.',
        coveredSkills: [skillMap['Electronic Health Record (EHR) Operation']],
        difficulty: 'Beginner',
        durationHours: 15,
        cost: 'Free',
        enrollmentUrl: '#',
        rating: 4.6,
        enrolledStudentsCount: 410
      },
      {
        title: 'Faculty Development Program: Next-Gen Ayush Pedagogy & Research',
        providerType: 'Institute',
        providerName: 'All India Institute of Ayurveda',
        type: 'FDP',
        description: 'Specialized FDP for academic educators to integrate modern analytical instrumentation with classical Samhita principles, grant writing, and NEP-2020 frameworks.',
        coveredSkills: [skillMap['Herbal Extraction & Standardization'], skillMap['Clinical Trial GCP Documentation']],
        difficulty: 'Advanced',
        durationHours: 36,
        cost: 'Free for Faculty',
        enrollmentUrl: '#',
        rating: 4.95,
        enrolledStudentsCount: 95
      }
    ]);
    console.log(`[Seeder] Seeded ${seededLearningPrograms.length} Learning Programs`);

    // Attach initial enrolled course to demo student
    await StudentProfile.findByIdAndUpdate(student._id, {
      enrolledPrograms: [
        {
          program: seededLearningPrograms[0]._id,
          enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'In_Progress',
          progressPercentage: 45
        }
      ]
    });
    console.log('[Seeder] Attached demo enrolled course to student profile');

    // 10. Seed Opportunities
    const opportunities = await Opportunity.insertMany([
      {
        industry: industry._id,
        title: 'Herbal QC & GMP Trainee Chemist',
        type: 'Internship',
        description: 'Join Dabur central quality testing lab. Hands-on exposure to raw material testing, Schedule T compliance, and extract batch validation.',
        location: 'Ghaziabad, Delhi-NCR',
        stipendOrSalary: '₹18,000 / month',
        durationMonths: 6,
        requiredSkills: [
          skillMap['Ayush Good Manufacturing Practice (GMP)'],
          skillMap['Herbal Extraction & Standardization']
        ],
        preferredSkills: [skillMap['Clinical Trial GCP Documentation']],
        status: 'Active',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        industry: industry._id,
        title: 'Junior Clinical Research Associate (Ayush)',
        type: 'Full-time',
        description: 'Coordinate multi-center Ayurvedic clinical trial documentation, patient enrollment, and pharmacovigilance data entry.',
        location: 'Delhi-NCR / Remote Hybrid',
        stipendOrSalary: '₹5.5 LPA - ₹7.0 LPA',
        durationMonths: 12,
        requiredSkills: [
          skillMap['Clinical Trial GCP Documentation'],
          skillMap['Electronic Health Record (EHR) Operation']
        ],
        preferredSkills: [skillMap['Pharmacovigilance in Herbal Medicine']],
        status: 'Active',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
      }
    ]);
    console.log(`[Seeder] Seeded ${opportunities.length} Opportunities`);

    // 11. Seed Application
    const application = await Application.create({
      opportunity: opportunities[0]._id,
      student: student._id,
      matchScore: 68,
      missingSkills: [skillMap['Ayush Good Manufacturing Practice (GMP)']],
      status: 'Shortlisted',
      feedback: 'Good academic background in herbal extraction. Recommended to complete Schedule T GMP module.'
    });
    console.log('[Seeder] Seeded Application with 68% Match Score');

    // 12. Seed Internship Progress
    await InternshipProgress.create({
      application: application._id,
      opportunity: opportunities[0]._id,
      student: student._id,
      industry: industry._id,
      mentor: {
        name: 'Dr. Anand Verma',
        email: 'anand.verma@dabur.com',
        designation: 'Senior QC Manager'
      },
      startDate: new Date('2026-08-01'),
      weeklyLogs: [
        {
          weekNumber: 1,
          tasksCompleted: 'Cleanroom orientation, Schedule T safety protocols, and standard operating procedures (SOP) review.',
          hoursWorked: 40,
          studentReflections: 'Learned air pressure differential measurements and cleanroom gowning procedures.',
          mentorFeedback: 'Prompt attendance and thorough documentation.',
          mentorRating: 5,
          status: 'Approved',
          submittedAt: new Date('2026-08-07'),
          reviewedAt: new Date('2026-08-08')
        },
        {
          weekNumber: 2,
          tasksCompleted: 'Conducted spectrophotometric assay of withanolides across 3 commercial batches of raw Withania somnifera roots.',
          hoursWorked: 42,
          studentReflections: 'Calculated moisture percentage and compared results with Ayush Pharmacopoeia limits.',
          mentorFeedback: 'Good analytical precision. Continue mastering HPTLC calibration.',
          mentorRating: 4,
          status: 'Approved',
          submittedAt: new Date('2026-08-14'),
          reviewedAt: new Date('2026-08-15')
        }
      ],
      completionStatus: 'Active'
    });
    console.log('[Seeder] Seeded Active Internship Progress with 2 weekly milestone logs');

    // 13. Seed Academia-Industry Collaboration Proposals & R&D Calls
    const seededCollaborations = await CollaborationProposal.insertMany([
      {
        title: 'Phytochemical Standardization & Heavy Metal Chelation of Classical Bhasma Preparations',
        type: 'Joint_R&D',
        initiatorType: 'Industry',
        industry: industry._id,
        institute: institute._id,
        description: 'Collaborative R&D project to develop validated HPTLC fingerprinting and ICP-MS trace elemental profiles for Swarna Bhasma formulations adhering to AYUSH and US-FDA pharmacopeia standards.',
        budget: '₹25,00,000 (Industry Sponsored)',
        durationMonths: 18,
        deliverables: [
          'HPTLC Fingerprint Method Validation Report',
          'ICP-MS Heavy Metal Impurity Limits Protocol',
          'Joint Scopus/SCI Publication',
          'Draft Ayush Pharmacopoeia Monograph Revision'
        ],
        status: 'Open_Call'
      },
      {
        title: 'Ayush Good Manufacturing Practice (GMP) Cleanroom Validation & Schedule T Facility Audit',
        type: 'Consulting_Request',
        initiatorType: 'Industry',
        industry: industry._id,
        faculty: faculty._id,
        institute: institute._id,
        description: 'Direct expert advisory call targeting Prof. Rajesh Sharma (Dravyaguna Dept) to conduct on-site GMP design qualification (DQ) and operational qualification (OQ) for our new herbal softgel extraction plant.',
        budget: '₹3,50,000 (Expert Honorarium)',
        durationMonths: 3,
        deliverables: [
          'Schedule T Airflow & HEPA Filter Audit Checklist',
          'Batch Manufacturing Record (BMR) Streamlining',
          'Faculty Sign-off Certificate'
        ],
        status: 'Open_Call'
      },
      {
        title: 'Industry-in-Residence Corporate Sabbatical Fellowship (ASU Extract Fractionation)',
        type: 'Faculty_Sabbatical',
        initiatorType: 'Industry',
        industry: industry._id,
        institute: institute._id,
        description: 'Semester-long sabbatical opportunity for Ayush academic faculty to work alongside Dabur central R&D scientists on counter-current supercritical fluid extraction (SFE) of bioactive Ayurvedic botanicals.',
        budget: '₹1,20,000 / month Stipend + Lab Access',
        durationMonths: 6,
        deliverables: [
          'Pilot Plant Scale-up Optimization Protocol',
          'Industrial Curriculum Transfer for M.D./Ph.D. Scholars',
          'Joint Patent Application Submission'
        ],
        status: 'Open_Call'
      },
      {
        title: 'National Ayush Mission (NAM) Clinical Efficacy Validation in Diabetic Neuropathy',
        type: 'Grant_Call',
        initiatorType: 'Ministry',
        institute: institute._id,
        description: 'Ministry sponsored multi-center grant call for AYUSH medical colleges to conduct CTRI-registered double-blind clinical trials evaluating classical polyherbal formulations.',
        budget: '₹48,00,000 (Ministry Grant)',
        durationMonths: 24,
        deliverables: [
          'CTRI Registration & Ethical Board Clearance Dossier',
          'Patient Case Report Forms (e-CRF)',
          'Comprehensive Clinical Study Report (CSR)'
        ],
        status: 'Open_Call'
      }
    ]);
    console.log(`[Seeder] Seeded ${seededCollaborations.length} Collaboration Proposals & Research Calls`);

    console.log('\n======================================================');
    console.log('🎉 Enterprise Seed Data Successfully Initialized!');
    console.log('Sample Accounts for Demonstration:');
    console.log('• Student:   student.ayush@gmail.com  / Password@123');
    console.log('• Industry:  careers@dabur.com        / Password@123');
    console.log('• Faculty:   dr.sharma@aiia.ac.in     / Password@123');
    console.log('• Institute: director@aiia.ac.in      / Password@123');
    console.log('• Admin:     admin@ayush.gov.in       / Password@123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
