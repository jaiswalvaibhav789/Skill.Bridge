// Mock Data for Offline / Vercel Preview Mode
// Seamlessly provides realistic data when the cloud backend is not connected.

export const MOCK_USERS = {
  student: {
    _id: 'mock-user-student-1',
    name: 'Ayush Sharma',
    email: 'student.ayush@gmail.com',
    role: 'student',
    isVerified: true
  },
  industry: {
    _id: 'mock-user-industry-1',
    name: 'Dabur Talent Acquisition',
    email: 'careers@dabur.com',
    role: 'industry',
    isVerified: true
  },
  faculty: {
    _id: 'mock-user-faculty-1',
    name: 'Prof. (Dr.) Rajesh Sharma',
    email: 'dr.sharma@aiia.ac.in',
    role: 'faculty',
    isVerified: true
  },
  institute: {
    _id: 'mock-user-institute-1',
    name: 'Director AIIA',
    email: 'director@aiia.ac.in',
    role: 'institute',
    isVerified: true
  },
  admin: {
    _id: 'mock-user-admin-1',
    name: 'Ministry Overseer',
    email: 'admin@ayush.gov.in',
    role: 'admin',
    isVerified: true
  }
};

export const MOCK_SKILLS = [
  { _id: 's1', name: 'Nadi Pariksha (Pulse Diagnosis)', category: 'Clinical', ayushBranch: 'Ayurveda', industryDemandScore: 92, benchmarkScore: 85 },
  { _id: 's2', name: 'Panchakarma Protocol Planning', category: 'Clinical', ayushBranch: 'Ayurveda', industryDemandScore: 88, benchmarkScore: 80 },
  { _id: 's3', name: 'Herbal Extraction & Standardization', category: 'Pharma_Manufacturing', ayushBranch: 'Ayurveda', industryDemandScore: 94, benchmarkScore: 85 },
  { _id: 's4', name: 'Ayush Good Manufacturing Practice (GMP)', category: 'Pharma_Manufacturing', ayushBranch: 'Common', industryDemandScore: 96, benchmarkScore: 90 },
  { _id: 's5', name: 'Clinical Trial GCP Documentation', category: 'Regulatory_Research', ayushBranch: 'Common', industryDemandScore: 90, benchmarkScore: 80 },
  { _id: 's6', name: 'Pharmacovigilance in Herbal Medicine', category: 'Regulatory_Research', ayushBranch: 'Common', industryDemandScore: 82, benchmarkScore: 75 },
  { _id: 's7', name: 'Electronic Health Record (EHR) Operation', category: 'Hospital_Admin', ayushBranch: 'Common', industryDemandScore: 85, benchmarkScore: 75 },
  { _id: 's8', name: 'Ayush Patient Counseling & Dietetics', category: 'Soft_Skills', ayushBranch: 'Common', industryDemandScore: 80, benchmarkScore: 75 }
];

export const MOCK_CAREER_ROLES = [
  {
    _id: 'mock-role-1',
    title: 'Ayush Quality Assurance & GMP Officer',
    slug: 'ayush-qa-gmp-officer',
    description: 'Oversees Schedule T regulatory compliance, in-process herbal extract batch release, and factory hygiene in pharmaceutical units.',
    industrySector: 'Pharmaceuticals',
    averageSalaryRange: '₹4.5 LPA - ₹8.5 LPA',
    demandIndex: 94,
    requiredSkills: [
      { skill: MOCK_SKILLS[3], minProficiencyScore: 85, weight: 1.5 },
      { skill: MOCK_SKILLS[2], minProficiencyScore: 80, weight: 1.2 },
      { skill: MOCK_SKILLS[4], minProficiencyScore: 70, weight: 1.0 }
    ]
  },
  {
    _id: 'mock-role-2',
    title: 'Clinical Ayurveda Consultant & Panchakarma Specialist',
    slug: 'clinical-ayurveda-specialist',
    description: 'Practices classical holistic diagnostics, panchakarma therapy scheduling, and disease management in premier hospital centers.',
    industrySector: 'Healthcare & Clinical',
    averageSalaryRange: '₹6.0 LPA - ₹12.0 LPA',
    demandIndex: 90,
    requiredSkills: [
      { skill: MOCK_SKILLS[0], minProficiencyScore: 85, weight: 1.5 },
      { skill: MOCK_SKILLS[1], minProficiencyScore: 80, weight: 1.3 }
    ]
  }
];

export const MOCK_STUDENT_PROFILE = {
  _id: 'mock-student-profile-1',
  user: MOCK_USERS.student._id,
  fullName: 'Ayush Sharma',
  rollNumber: 'AIIA-2022-BAMS-042',
  degree: 'BAMS',
  department: 'Ayush Medicine & Surgery',
  passingYear: 2026,
  cgpa: 8.4,
  portfolioSlug: 'ayush-sharma-aiia',
  institute: {
    _id: 'mock-inst-1',
    instituteName: 'All India Institute of Ayurveda (AIIA), New Delhi',
    aisheCode: 'C-54321',
    location: { city: 'New Delhi', state: 'Delhi' }
  },
  targetCareerRole: MOCK_CAREER_ROLES[0],
  skills: [
    {
      _id: 'st-sk-1',
      skill: MOCK_SKILLS[0],
      proficiency: 'Intermediate',
      proficiencyScore: 78,
      isEndorsed: true,
      verifiedByAssessment: true,
      credentialHash: 'a89f92d4b91730bf183296c01e91c7847b2c019d5e378ad64f8f4119d8fa7210',
      issuedAt: '2024-05-10T10:00:00.000Z'
    },
    {
      _id: 'st-sk-2',
      skill: MOCK_SKILLS[2],
      proficiency: 'Intermediate',
      proficiencyScore: 72,
      isEndorsed: true,
      verifiedByAssessment: true,
      credentialHash: '3b09f427cd5819ad51b8c028e3b5e4a819b7d34190ad56f874bc091ea2801456',
      issuedAt: '2024-06-12T11:30:00.000Z'
    },
    {
      _id: 'st-sk-3',
      skill: MOCK_SKILLS[3],
      proficiency: 'Advanced',
      proficiencyScore: 88,
      isEndorsed: true,
      verifiedByAssessment: true,
      credentialHash: 'f412d098a834b9e2840c83a15239e0ad7bc418a9928d546cb98fa201b17e4368',
      issuedAt: '2024-07-01T09:15:00.000Z'
    }
  ]
};

export const MOCK_OPPORTUNITIES = [
  {
    _id: 'mock-opp-1',
    title: 'Ayush Quality Control & Analytical Analyst',
    type: 'Internship',
    stipendOrSalary: '₹28,000 / month',
    stipend: '₹28,000 / month',
    durationMonths: 6,
    openingsCount: 3,
    location: 'Ghaziabad, Delhi-NCR',
    workplaceType: 'On-site',
    minCgpa: 7.0,
    description: 'Lead botanical testing, extract fingerprinting, and regulatory documentation according to Ayurvedic Pharmacopoeia of India (API).',
    industry: {
      _id: 'mock-industry-1',
      companyName: 'Dabur Ayush Research & Manufacturing Ltd',
      location: { city: 'Ghaziabad', state: 'Uttar Pradesh' }
    },
    postedBy: {
      _id: 'mock-industry-1',
      companyName: 'Dabur Ayush Research & Manufacturing Ltd',
      location: { city: 'Ghaziabad', state: 'Uttar Pradesh' }
    },
    compatibilityScore: 91,
    matchScore: 91,
    matchReasons: ['92% GMP Coverage', 'Enrolled in AIIA New Delhi', 'High Analytical Chemistry Aptitude'],
    factorBreakdown: {
      skillScore: 92,
      eligibilityScore: 95,
      careerAlignmentScore: 90,
      practicalScore: 85,
      locationScore: 85
    },
    requiredSkills: [
      { _id: 's4', name: 'Ayush Good Manufacturing Practice (GMP)' },
      { _id: 's3', name: 'Herbal Extraction & Standardization' }
    ],
    missingSkills: [],
    deadline: '2026-11-30'
  },
  {
    _id: 'mock-opp-2',
    title: 'Clinical Research Associate (Ayurveda GCP Trials)',
    type: 'Full-time',
    stipendOrSalary: '₹6.2 LPA',
    stipend: '₹6.2 LPA',
    durationMonths: 12,
    openingsCount: 2,
    location: 'Bengaluru, Karnataka',
    workplaceType: 'Hybrid',
    minCgpa: 7.5,
    description: 'Coordinate multi-centric clinical trials for novel Ayurvedic formulations in compliance with Ministry of Ayush ethical guidelines.',
    industry: {
      _id: 'mock-industry-2',
      companyName: 'The Himalaya Drug Company (R&D Center)',
      location: { city: 'Bengaluru', state: 'Karnataka' }
    },
    postedBy: {
      _id: 'mock-industry-2',
      companyName: 'The Himalaya Drug Company (R&D Center)',
      location: { city: 'Bengaluru', state: 'Karnataka' }
    },
    compatibilityScore: 86,
    matchScore: 86,
    matchReasons: ['Verified Pulse Diagnostics', 'BAMS Finalist'],
    factorBreakdown: {
      skillScore: 84,
      eligibilityScore: 90,
      careerAlignmentScore: 88,
      practicalScore: 80,
      locationScore: 80
    },
    requiredSkills: [
      { _id: 's5', name: 'Clinical Trial GCP Documentation' },
      { _id: 's1', name: 'Nadi Pariksha (Pulse Diagnosis)' }
    ],
    missingSkills: [
      { _id: 's5', name: 'Clinical Trial GCP Documentation' }
    ],
    deadline: '2026-12-15'
  },
  {
    _id: 'mock-opp-3',
    title: 'Digital Health & Tele-Ayurveda Fellow',
    type: 'Internship',
    stipendOrSalary: '₹22,000 / month',
    stipend: '₹22,000 / month',
    durationMonths: 3,
    openingsCount: 5,
    location: 'Remote',
    workplaceType: 'Remote',
    minCgpa: 6.5,
    description: 'Assist Senior Vaidyas with digital triaging, NAMASTE Portal morbidity codes, and automated patient follow-ups.',
    industry: {
      _id: 'mock-industry-3',
      companyName: 'Ayush Digital Health Mission Partner',
      location: { city: 'New Delhi', state: 'Delhi' }
    },
    postedBy: {
      _id: 'mock-industry-3',
      companyName: 'Ayush Digital Health Mission Partner',
      location: { city: 'New Delhi', state: 'Delhi' }
    },
    compatibilityScore: 82,
    matchScore: 82,
    matchReasons: ['Remote friendly', 'Hospital EHR Familiarity'],
    factorBreakdown: {
      skillScore: 80,
      eligibilityScore: 85,
      careerAlignmentScore: 82,
      practicalScore: 78,
      locationScore: 95
    },
    requiredSkills: [
      { _id: 's7', name: 'Electronic Health Record (EHR) Operation' }
    ],
    missingSkills: [
      { _id: 's7', name: 'Electronic Health Record (EHR) Operation' }
    ],
    deadline: '2026-10-31'
  }
];

export const MOCK_APPLICATIONS = [
  {
    _id: 'mock-app-1',
    opportunity: MOCK_OPPORTUNITIES[0],
    student: MOCK_STUDENT_PROFILE,
    status: 'Shortlisted',
    appliedDate: '2026-09-18T10:00:00.000Z',
    matchScore: 91,
    notes: 'Candidate passed initial portfolio screening with verified GMP credentials.'
  }
];

export const MOCK_LEARNING_PROGRAMS = [
  {
    _id: 'mock-course-1',
    title: 'Advanced Schedule T GMP Certification for Herbal Pharma',
    category: 'Pharma_Manufacturing',
    durationWeeks: 4,
    enrolledCount: 184,
    rating: 4.8,
    instructor: 'Prof. (Dr.) Rajesh Sharma',
    provider: 'All India Institute of Ayurveda',
    skillsSolvedCount: 2,
    level: 'Advanced',
    targetSkills: ['Ayush Good Manufacturing Practice (GMP)', 'Herbal Extraction & Standardization'],
    modules: [
      { title: 'Module 1: Schedule T Legal Norms & Facility Sanitation', duration: '1.5 hrs' },
      { title: 'Module 2: In-Process Quality Controls & Extraction QC', duration: '2.0 hrs' },
      { title: 'Module 3: Audit Trails, Batch Records & Pharmacopoeial Standards', duration: '2.5 hrs' }
    ]
  },
  {
    _id: 'mock-course-2',
    title: 'Classical Nadi Pariksha & Pulse Diagnostics Mastery',
    category: 'Clinical',
    durationWeeks: 3,
    enrolledCount: 310,
    rating: 4.9,
    instructor: 'Vaidya K. S. Murthy',
    provider: 'National Institute of Ayurveda',
    skillsSolvedCount: 1,
    level: 'Intermediate',
    targetSkills: ['Nadi Pariksha (Pulse Diagnosis)'],
    modules: [
      { title: 'Module 1: Anatomical landmarks of Vata, Pitta, Kapha pulse', duration: '1.5 hrs' },
      { title: 'Module 2: Differentiating Vega, Gati and Sthana in clinical settings', duration: '2.0 hrs' }
    ]
  }
];

export const MOCK_ASSESSMENTS = [
  {
    _id: 'mock-assessment-1',
    title: 'Ayush Good Manufacturing Practice (GMP) Competency Test',
    category: 'Pharma_Manufacturing',
    durationMinutes: 20,
    totalQuestions: 15,
    passingScore: 70,
    questions: [
      {
        _id: 'q1',
        text: 'Under Schedule T of the Drugs and Cosmetics Act, what is the mandatory air handling requirement for aseptic herbal processing areas?',
        options: ['HEPA Filter Class 100', 'Standard Exhaust Fan', 'Class 10,000 Air Filter System', 'No specific filtration mandated'],
        correctAnswer: 2
      },
      {
        _id: 'q2',
        text: 'Which analytical technique is universally mandated by the Ayurvedic Pharmacopoeia of India (API) for herbal fingerprinting?',
        options: ['UV-Vis Spectrophotometry only', 'High-Performance Thin-Layer Chromatography (HPTLC)', 'Paper chromatography', 'Karl Fischer titration'],
        correctAnswer: 1
      }
    ]
  }
];

export const MOCK_INDUSTRY_PROFILE = {
  _id: 'mock-ind-profile-1',
  user: MOCK_USERS.industry._id,
  companyName: 'Dabur Ayush Research & Manufacturing Ltd',
  industryType: 'Pharmaceutical / GMP Unit',
  ayushBranch: 'Ayurveda',
  registrationNumber: 'CIN-L24230DL1975PLC007908',
  website: 'https://www.dabur.com',
  location: { city: 'Ghaziabad', state: 'Uttar Pradesh' },
  isApprovedByAdmin: true,
  description: 'Premier Ayurvedic pharmaceutical and research enterprise producing classical ASU formulations.'
};

export const MOCK_FACULTY_PROFILE = {
  _id: 'mock-fac-profile-1',
  user: MOCK_USERS.faculty._id,
  fullName: 'Prof. (Dr.) Rajesh Sharma',
  department: 'Dravyaguna (Herbal Pharmacology)',
  designation: 'Professor & Dean of Research',
  yearsExperience: 18,
  expertise: ['Herbal Standardization', 'Clinical Phyto-pharmacology', 'Ayush GMP'],
  institute: {
    instituteName: 'All India Institute of Ayurveda (AIIA), New Delhi',
    location: { city: 'New Delhi', state: 'Delhi' }
  },
  bio: 'Senior academician and researcher with over 18 years in Dravyaguna research, patent holder, and member of the Ayush Pharmacopoeia Committee.'
};

export const MOCK_INSTITUTE_PROFILE = {
  _id: 'mock-inst-profile-1',
  user: MOCK_USERS.institute._id,
  instituteName: 'All India Institute of Ayurveda (AIIA), New Delhi',
  aisheCode: 'C-54321',
  affiliatedUniversity: 'Ministry of Ayush',
  location: { city: 'New Delhi', state: 'Delhi' },
  isApproved: true
};

export const MOCK_ANALYTICS_SUMMARY = {
  totalStudents: 1420,
  verifiedCredentialsCount: 3840,
  activeOpportunities: 42,
  placedStudents: 890,
  averageMatchRate: '87.4%',
  placementGrowth: '+24.6%'
};
