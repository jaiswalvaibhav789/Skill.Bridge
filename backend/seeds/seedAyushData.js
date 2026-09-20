const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Skill = require('../models/Skill');
const StudentProfile = require('../models/StudentProfile');
const IndustryProfile = require('../models/IndustryProfile');
const InstituteProfile = require('../models/InstituteProfile');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const ProjectTeam = require('../models/ProjectTeam');
const { calculateSkillMatch } = require('../controllers/matchingController');

dotenv.config();

const ayushSkills = [
  // Ayurveda Clinical
  { name: 'Nadi Pariksha Diagnostics', category: 'Clinical', ayushBranch: 'Ayurveda', description: 'Radial pulse diagnosis for Prakriti and Vikriti assessment.' },
  { name: 'Panchakarma Therapy Protocol', category: 'Clinical', ayushBranch: 'Ayurveda', description: 'Planning and execution of Vamana, Virechana, Basti, Nasya, Raktamokshana.' },
  { name: 'Kshara Sutra Ligation', category: 'Clinical', ayushBranch: 'Ayurveda', description: 'Para-surgical management of fistula-in-ano and hemorrhoids.' },
  { name: 'Rogi Pariksha & Case History', category: 'Clinical', ayushBranch: 'Ayurveda', description: 'Astavidha and Dashavidha patient examination methods.' },
  
  // Ayush Pharma & Manufacturing
  { name: 'Ayush GMP Compliance', category: 'Pharma_Manufacturing', ayushBranch: 'Common', description: 'Schedule T Good Manufacturing Practices for Ayush drugs.' },
  { name: 'Rasa Shastra & Bhasma Kalpana', category: 'Pharma_Manufacturing', ayushBranch: 'Ayurveda', description: 'Herbo-mineral processing, purification (Shodhana), and incineration (Marana).' },
  { name: 'Dravyaguna Herb Identification', category: 'Pharma_Manufacturing', ayushBranch: 'Ayurveda', description: 'Botanical and organoleptic validation of raw medicinal herbs.' },
  { name: 'QC/QA Herbal Extract Testing', category: 'Pharma_Manufacturing', ayushBranch: 'Common', description: 'HPTLC, spectrophotometry, and microbial limit testing for Ayush formulations.' },
  { name: 'Herbal Supply Chain Management', category: 'Pharma_Manufacturing', ayushBranch: 'Common', description: 'GAP (Good Agricultural Practices) and herbal procurement logistics.' },
  { name: 'Schedule T Guidelines', category: 'Pharma_Manufacturing', ayushBranch: 'Common', description: 'Regulatory guidelines for manufacturing infrastructure and validation.' },

  // Research & Regulatory
  { name: 'Ayush Clinical Trial Protocols', category: 'Regulatory_Research', ayushBranch: 'Common', description: 'ICMR and Ministry of Ayush ethical guidelines for human clinical trials.' },
  { name: 'Ayush Pharmacovigilance', category: 'Regulatory_Research', ayushBranch: 'Common', description: 'Adverse Drug Reaction (ADR) monitoring and reporting in Ayush medicines.' },
  { name: 'NAMASTE Portal Morbidity Coding', category: 'Hospital_Admin', ayushBranch: 'Common', description: 'Standardized terminology and morbidity coding aligned with WHO ICD-11.' },
  
  // Informatics, Digital Health & Full-Stack
  { name: 'React', category: 'General_Technical', ayushBranch: 'Common', description: 'Modern reactive frontend development, dashboards, and client state.' },
  { name: 'Node', category: 'General_Technical', ayushBranch: 'Common', description: 'Backend service architecture, REST API design, and async processing.' },
  { name: 'MongoDB', category: 'General_Technical', ayushBranch: 'Common', description: 'NoSQL document data modeling, indexing, and aggregation pipelines.' },
  { name: 'Data Analytics', category: 'General_Technical', ayushBranch: 'Common', description: 'Statistical analysis, quality metrics modeling, and inventory insights.' },
  { name: 'Ayush Hospital EHR & Informatics', category: 'Hospital_Admin', ayushBranch: 'Common', description: 'Electronic health records and Ayush Hospital Management Information Systems.' },
  { name: 'Clinical Patient Counseling', category: 'General_Technical', ayushBranch: 'Common', description: 'Dietary (Pathya-Apathya) and lifestyle modification counseling.' }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillbridge_ayush';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});
    await StudentProfile.deleteMany({});
    await IndustryProfile.deleteMany({});
    await InstituteProfile.deleteMany({});
    await Opportunity.deleteMany({});
    await Application.deleteMany({});
    await ProjectTeam.deleteMany({});

    console.log('[Seed] Cleared collections...');

    // 1. Insert Skills
    const insertedSkills = await Skill.insertMany(ayushSkills);
    console.log(`[Seed] Seeded ${insertedSkills.length} Ayush & Interdisciplinary Skills.`);

    // Quick map to lookup skills by name
    const skillMap = {};
    insertedSkills.forEach(s => { skillMap[s.name] = s._id; });

    // 2. Create Institute User & Profile
    const instituteUser = await User.create({
      email: 'dean@nationalinstituteofayurveda.edu',
      password: 'Password123',
      role: 'institute',
      isVerified: true
    });

    const instituteProfile = await InstituteProfile.create({
      user: instituteUser._id,
      instituteName: 'National Institute of Ayurveda (Deemed University)',
      aisheCode: 'AISHE-AYUSH-NIA-01',
      affiliatedUniversity: 'Ministry of Ayush, Govt of India',
      location: { city: 'Jaipur', state: 'Rajasthan' },
      recognizedDepartments: ['Ayurveda', 'Yoga & Naturopathy']
    });

    // 3. Create Industry User & Profile
    const industryUser = await User.create({
      email: 'hr@daburherbal.com',
      password: 'Password123',
      role: 'industry',
      isVerified: true
    });

    const industryProfile = await IndustryProfile.create({
      user: industryUser._id,
      companyName: 'Dabur Ayush Research & Healthcare Div',
      industryType: 'Pharmaceutical / GMP Unit',
      ayushBranch: 'Ayurveda',
      registrationNumber: 'DL-AYUSH-GMP-2024-998',
      website: 'https://www.dabur.com/ayush',
      location: { city: 'Ghaziabad', state: 'Uttar Pradesh' },
      isApprovedByAdmin: true,
      description: 'Pioneering manufacturer and clinical research institution for standardized Ayush formulations.'
    });

    // 4. Create Diverse Student Users & Profiles for Complementary Team Matching

    // Student 1: Aarav Sharma (Ayurveda Clinical & Botanical Domain Lead)
    const studentUser1 = await User.create({
      email: 'student@ayush.gov.in',
      password: 'Password123',
      role: 'student',
      isVerified: true
    });
    const studentProfile1 = await StudentProfile.create({
      user: studentUser1._id,
      fullName: 'Aarav Sharma',
      institute: instituteProfile._id,
      degree: 'BAMS',
      rollNumber: 'NIA-BAMS-2022-042',
      passingYear: 2026,
      skills: [
        { skill: skillMap['Dravyaguna Herb Identification'], proficiency: 'Expert', isEndorsed: true, endorsedBy: instituteProfile._id },
        { skill: skillMap['Nadi Pariksha Diagnostics'], proficiency: 'Intermediate', isEndorsed: true, endorsedBy: instituteProfile._id },
        { skill: skillMap['Panchakarma Therapy Protocol'], proficiency: 'Expert', isEndorsed: true, endorsedBy: instituteProfile._id },
        { skill: skillMap['Rogi Pariksha & Case History'], proficiency: 'Expert', isEndorsed: true, endorsedBy: instituteProfile._id },
        { skill: skillMap['Ayush GMP Compliance'], proficiency: 'Intermediate', isEndorsed: true, endorsedBy: instituteProfile._id }
      ],
      bio: 'BAMS scholar specialized in raw botanical taxonomy, Dravyaguna herb authentication, and clinical validation protocols.'
    });

    // Student 2: Priya Patel (Frontend & UI/UX Specialist)
    const studentUser2 = await User.create({
      email: 'priya.frontend@ayush.gov.in',
      password: 'Password123',
      role: 'student',
      isVerified: true
    });
    const studentProfile2 = await StudentProfile.create({
      user: studentUser2._id,
      fullName: 'Priya Patel',
      institute: instituteProfile._id,
      degree: 'BAMS',
      rollNumber: 'NIA-IT-2022-018',
      passingYear: 2026,
      skills: [
        { skill: skillMap['React'], proficiency: 'Expert', isEndorsed: true, endorsedBy: instituteProfile._id },
        { skill: skillMap['Ayush Hospital EHR & Informatics'], proficiency: 'Expert', isEndorsed: true, endorsedBy: instituteProfile._id },
        { skill: skillMap['Clinical Patient Counseling'], proficiency: 'Intermediate', isEndorsed: false }
      ],
      bio: 'Full stack UI/UX engineer bridging modern responsive web interfaces with Ayush clinical charting workflows.'
    });

    // Student 3: Rohan Verma (Backend & Cloud Architect)
    const studentUser3 = await User.create({
      email: 'rohan.backend@ayush.gov.in',
      password: 'Password123',
      role: 'student',
      isVerified: true
    });
    const studentProfile3 = await StudentProfile.create({
      user: studentUser3._id,
      fullName: 'Rohan Verma',
      institute: instituteProfile._id,
      degree: 'B.Pharma Ayush',
      rollNumber: 'NIA-PH-2022-033',
      passingYear: 2026,
      skills: [
        { skill: skillMap['Node'], proficiency: 'Expert', isEndorsed: true, endorsedBy: instituteProfile._id },
        { skill: skillMap['MongoDB'], proficiency: 'Expert', isEndorsed: true, endorsedBy: instituteProfile._id },
        { skill: skillMap['Herbal Supply Chain Management'], proficiency: 'Intermediate', isEndorsed: true, endorsedBy: instituteProfile._id },
        { skill: skillMap['Ayush GMP Compliance'], proficiency: 'Intermediate', isEndorsed: false }
      ],
      bio: 'Backend developer and herbal supply chain technologist experienced in building scalable APIs and batch tracking.'
    });

    // Student 4: Dr. Ananya Iyer (Quality & Data Analytics Specialist)
    const studentUser4 = await User.create({
      email: 'ananya.analytics@ayush.gov.in',
      password: 'Password123',
      role: 'student',
      isVerified: true
    });
    const studentProfile4 = await StudentProfile.create({
      user: studentUser4._id,
      fullName: 'Dr. Ananya Iyer',
      institute: instituteProfile._id,
      degree: 'MD/MS Ayush',
      rollNumber: 'NIA-MD-2021-009',
      passingYear: 2025,
      skills: [
        { skill: skillMap['Data Analytics'], proficiency: 'Expert', isEndorsed: true, endorsedBy: instituteProfile._id },
        { skill: skillMap['QC/QA Herbal Extract Testing'], proficiency: 'Expert', isEndorsed: true, endorsedBy: instituteProfile._id },
        { skill: skillMap['Ayush Clinical Trial Protocols'], proficiency: 'Expert', isEndorsed: true, endorsedBy: instituteProfile._id },
        { skill: skillMap['Ayush Pharmacovigilance'], proficiency: 'Intermediate', isEndorsed: true, endorsedBy: instituteProfile._id }
      ],
      bio: 'Ayush clinical data researcher focusing on statistical modeling, HPTLC analytical evaluation, and trial documentation.'
    });

    // 5. Create Admin User
    await User.create({
      email: 'admin@ayush.gov.in',
      password: 'Password123',
      role: 'admin',
      isVerified: true
    });

    // 6. Create Opportunities
    const opp1 = await Opportunity.create({
      industry: industryProfile._id,
      title: 'Ayurvedic Clinical Research & Panchakarma Intern',
      type: 'Internship',
      description: 'Conduct supervised patient assessments, observe Panchakarma therapies, and maintain electronic case record sheets.',
      location: 'New Delhi / Ghaziabad',
      stipendOrSalary: '₹18,000 / month',
      durationMonths: 6,
      requiredSkills: [
        skillMap['Panchakarma Therapy Protocol'],
        skillMap['Rogi Pariksha & Case History'],
        skillMap['Ayush Clinical Trial Protocols']
      ],
      preferredSkills: [
        skillMap['Nadi Pariksha Diagnostics'],
        skillMap['Ayush Hospital EHR & Informatics']
      ],
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'Active'
    });

    const opp2 = await Opportunity.create({
      industry: industryProfile._id,
      title: 'Ayush Quality Control & GMP Junior Analyst',
      type: 'Full-time',
      description: 'Audit Schedule T GMP documentation and oversee raw herb organoleptic authentication.',
      location: 'Haridwar, Uttarakhand',
      stipendOrSalary: '₹4.5 LPA',
      durationMonths: 12,
      requiredSkills: [
        skillMap['Ayush GMP Compliance'],
        skillMap['QC/QA Herbal Extract Testing'],
        skillMap['Dravyaguna Herb Identification']
      ],
      preferredSkills: [
        skillMap['Ayush Pharmacovigilance']
      ],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'Active'
    });

    // 7. Seed Student Application
    const student1SkillIds = studentProfile1.skills.map(s => s.skill);
    const matchCalc = calculateSkillMatch(
      student1SkillIds,
      opp1.requiredSkills,
      opp1.preferredSkills
    );

    await Application.create({
      opportunity: opp1._id,
      student: studentProfile1._id,
      matchScore: matchCalc.matchScore,
      missingSkills: matchCalc.missingSkillIds,
      status: 'Shortlisted',
      feedback: 'Excellent academic background and verified Panchakarma certification.'
    });

    // 8. Seed Default Pre-Formed Project Team (From the User's Screenshot!)
    await ProjectTeam.create({
      title: 'Smart Medicinal Plant Inventory System',
      industry: industryProfile._id,
      problemDescription: 'Design and deploy an automated track-and-trace inventory management system for Ayush raw botanical herbs, verifying organoleptic authenticity and monitoring real-time warehouse stock.',
      category: 'Herbal Inventory & Supply Chain',
      teamSize: 4,
      durationWeeks: 6,
      deliverables: ['Dashboard UI', 'Secure REST API', 'Inventory Tracking Module', 'Herbal QC Analytics'],
      requiredSkills: ['React', 'Node', 'MongoDB', 'Data Analytics'],
      roleBreakdown: [
        {
          roleTitle: 'Frontend & UI Specialist',
          requiredSkills: ['React', 'Ayush Hospital EHR & Informatics'],
          description: 'Builds modern responsive dashboard and interactive plant catalog'
        },
        {
          roleTitle: 'Backend & API Architect',
          requiredSkills: ['Node', 'Herbal Supply Chain Management'],
          description: 'Designs scalable REST API for botanical inventory lots and stock alerts'
        },
        {
          roleTitle: 'Database & Supply Chain Lead',
          requiredSkills: ['MongoDB', 'Ayush GMP Compliance'],
          description: 'Engineers MongoDB batch tracking models and statutory compliance logs'
        },
        {
          roleTitle: 'Ayush Domain & Quality Analyst',
          requiredSkills: ['Data Analytics', 'Dravyaguna Herb Identification', 'QC/QA Herbal Extract Testing'],
          description: 'Validates botanical authenticity, organoleptic specifications, and metrics'
        }
      ],
      teamMembers: [
        {
          student: studentProfile2._id,
          assignedRole: 'Frontend & UI Specialist',
          matchedSkills: ['React', 'Ayush Hospital EHR & Informatics'],
          individualMatchScore: 96,
          status: 'Accepted'
        },
        {
          student: studentProfile3._id,
          assignedRole: 'Backend & API Architect',
          matchedSkills: ['Node', 'MongoDB', 'Herbal Supply Chain Management'],
          individualMatchScore: 94,
          status: 'Accepted'
        },
        {
          student: studentProfile1._id,
          assignedRole: 'Ayush Botanical & GMP Lead',
          matchedSkills: ['Dravyaguna Herb Identification', 'Ayush GMP Compliance'],
          individualMatchScore: 95,
          status: 'Accepted'
        },
        {
          student: studentProfile4._id,
          assignedRole: 'Quality & Data Analytics Specialist',
          matchedSkills: ['Data Analytics', 'QC/QA Herbal Extract Testing'],
          individualMatchScore: 98,
          status: 'Accepted'
        }
      ],
      teamCoverageScore: 96,
      missingSkills: [],
      bridgeRecommendations: [
        'Ayush GAP (Good Agricultural Practices) Micro-Module',
        'Botanical QR Code Serialization Protocol'
      ],
      status: 'Active'
    });

    console.log('\n======================================================');
    console.log('✅ SkillBridge Ayush Database Successfully Seeded!');
    console.log('======================================================');
    console.log('Demo Credentials for All Roles:');
    console.log('  👨‍🎓 Student 1 (Clinical):   student@ayush.gov.in / Password123');
    console.log('  👩‍💻 Student 2 (Frontend):   priya.frontend@ayush.gov.in / Password123');
    console.log('  👨‍💻 Student 3 (Backend):    rohan.backend@ayush.gov.in / Password123');
    console.log('  👩‍🔬 Student 4 (Analytics):  ananya.analytics@ayush.gov.in / Password123');
    console.log('  🏢 Industry:                hr@daburherbal.com / Password123');
    console.log('  🏫 Institute:               dean@nationalinstituteofayurveda.edu / Password123');
    console.log('  🛡️ Admin:                   admin@ayush.gov.in / Password123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
