// Intelligent UI & Platform Guide Knowledge Engine for SkillBridge Ayush

const KNOWLEDGE_TOPICS = [
  {
    keywords: ['team', 'complementary', 'formation', 'builder', 'problem', 'decompose', 'group', 'plant inventory', 'hackathon'],
    title: 'AI Complementary Team Formation Engine',
    response: `**AI Complementary Team Formation** is our flagship innovation for SIH 2026. Instead of the outdated *"post internship → get 500 resumes"* paradigm, here is how the 7-step pipeline works:

1. **Industry Problem Submission**: An Ayush industry partner submits a challenge (e.g. *Smart Medicinal Plant Inventory System*).
2. **AI Problem Understanding**: The engine analyzes the scope, team size (typically 4), duration (e.g. 6 weeks), and required deliverables (Dashboard + API + Inventory module).
3. **Required Skills Extraction**: AI extracts multidisciplinary competencies—e.g. **React (Frontend)**, **Node.js (Backend)**, **MongoDB (Database)**, and **Data Analytics & Dravyaguna (Herbal Domain)**.
4. **Student Skill Graph Traversal**: The engine queries all verified students across Ayush & technical institutions.
5. **Complementary Team Generation**: Rather than picking 4 duplicate candidates, it pairs specialists together whose skills synergize to cover 100% of the project scope!
6. **Missing Skill Detection**: Flags if any project requirement is not covered by the team.
7. **Final Proposed Team Roster**: Generates a unified team proposal with role badges, match scores, and 1-click invitation dispatch.`,
    quickLinks: [{ label: 'Open AI Team Builder', path: '/teams' }]
  },
  {
    keywords: ['match', 'score', 'formula', 'calculation', 'algorithm', 'percentage', 'math'],
    title: 'Mathematical Skill Matching Engine',
    response: `SkillBridge Ayush computes an objective, verified **Skill Compatibility Score (0–100%)** using a weighted set-theoretic formula:

- **Required Skills ($R$)** carry **75%** weight:
  $$\\text{Required Ratio} = \\frac{|S \\cap R|}{|R|}$$
- **Preferred Skills ($P$)** carry **25%** weight:
  $$\\text{Preferred Ratio} = \\frac{|S \\cap P|}{|P|}$$
- **Total Weighted Score**:
  $$\\text{Score} = \\text{round}\\left(\\text{Required Ratio} \\times 75 + \\text{Preferred Ratio} \\times 25\\right)$$
- If an opportunity has no preferred skills, the score is based 100% on required competencies.
- Any skill in $R$ missing from the candidate's verified profile is isolated into the **Skill Gap Diagnostic** list with recommended bridge courses.`,
    quickLinks: [
      { label: 'View Student Matching', path: '/student' },
      { label: 'View Recruiter Ranking', path: '/industry' }
    ]
  },
  {
    keywords: ['student', 'apply', 'internship', 'profile', 'application', 'resume', 'degree', 'bams', 'bhms'],
    title: 'Student Portal & Applications',
    response: `In the **Student Portal**, you can:
- View **Recommended Opportunities** automatically ranked from highest to lowest compatibility score.
- See your **Skill Gap Analysis** for each opportunity with missing skills highlighted in red.
- Track real-time status in the **Application Tracker** (*Submitted &rarr; Under Review &rarr; Shortlisted &rarr; Offered*).
- Check your verified clinical badges (**✓ Endorsed by Faculty**) in your Competency portfolio.
- Participate in multidisciplinary capstones via the **AI Team Builder**!`,
    quickLinks: [{ label: 'Go to Student Dashboard', path: '/student' }]
  },
  {
    keywords: ['recruiter', 'industry', 'post', 'hire', 'shortlist', 'applicant', 'company', 'candidate'],
    title: 'Industry Recruiter Features',
    response: `In the **Industry Portal**, recruiters can:
- **Post New Opportunities**: Define role title, stipend, duration, and required vs preferred Ayush skills.
- **Automated Candidate Pre-ranking**: All applicants are immediately scored and sorted by algorithmic compatibility—no manual resume sift needed!
- **1-Click Pipeline Actions**: Move candidates directly between *Shortlisted* and *Offered*.
- **AI Team Builder**: Submit project statements to receive an automatically assembled 4-student complementary team with balanced tech and Ayush domain skills.`,
    quickLinks: [
      { label: 'Go to Industry Dashboard', path: '/industry' },
      { label: 'Launch AI Team Builder', path: '/teams' }
    ]
  },
  {
    keywords: ['college', 'institute', 'endorse', 'verify', 'dean', 'faculty', 'analytics', 'demand', 'aishe'],
    title: 'Institute Oversight & Clinical Verification',
    response: `In the **Institute Dashboard**, college deans and faculty can:
- **Verify Student Clinical Competencies**: Endorse hands-on skills (e.g. *Nadi Pariksha*, *Panchakarma Protocol*, *Kshara Sutra*) completed during clinical rotations to give students verified employer badges.
- **National Skill Demand Barometer**: Monitor the top competencies actively demanded by pharmaceutical and hospital recruiters.
- **Placement Absorption Metrics**: Track enrollment versus successful student placement percentages.`,
    quickLinks: [{ label: 'Go to Institute Analytics', path: '/institute' }]
  },
  {
    keywords: ['login', 'account', 'demo', 'password', 'credentials', 'switch', 'role'],
    title: 'Demo Accounts & Role Access',
    response: `You can test all 4 system roles using pre-seeded demo credentials:

- 👨‍🎓 **Student**: \`student@ayush.gov.in\` / \`Password123\`
- 🏢 **Industry Recruiter**: \`hr@daburherbal.com\` / \`Password123\`
- 🏫 **Institute Dean**: \`dean@nationalinstituteofayurveda.edu\` / \`Password123\`
- 🛡️ **Ministry Admin**: \`admin@ayush.gov.in\` / \`Password123\``,
    quickLinks: [{ label: 'Go to Sign In', path: '/login' }]
  },
  {
    keywords: ['help', 'navigate', 'ui', 'where', 'how', 'tour', 'what is', 'features', 'overview'],
    title: 'SkillBridge Ayush Portal Guide',
    response: `Welcome to **SkillBridge Ayush**! Here is an overview of the navigation:

- **Home (\`/\`)**: Portal vision, SIH problem statement overview, and innovation architecture.
- **AI Team Builder (\`/teams\`)**: The new problem-to-team matching engine assembling 4-student multidisciplinary squads.
- **Student Dashboard (\`/student\`)**: Skill compatibility cards, gap analysis, and application tracking.
- **Industry Dashboard (\`/industry\`)**: Opportunity posting, candidate pre-ranking table, and recruitment pipeline.
- **Institute Analytics (\`/institute\`)**: Clinical rotation skill verification and national demand analytics.

Feel free to ask me anything specific, like *"How does the team generator pick students?"* or *"Explain the matching math!"*`,
    quickLinks: [
      { label: 'Explore Team Builder', path: '/teams' },
      { label: 'View Home Page', path: '/' }
    ]
  }
];

exports.askChatbot = async (req, res, next) => {
  try {
    const { query, currentPath, userRole } = req.body;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    const cleanQuery = query.toLowerCase().trim();

    // Find best match in knowledge base
    let bestMatch = null;
    let highestScore = 0;

    for (const topic of KNOWLEDGE_TOPICS) {
      let score = 0;
      topic.keywords.forEach(kw => {
        if (cleanQuery.includes(kw)) {
          score += kw.length;
        }
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = topic;
      }
    }

    // Default fallback with helpful context
    if (!bestMatch || highestScore === 0) {
      bestMatch = {
        title: 'SkillBridge Ayush Assistant',
        response: `I'm your SkillBridge Ayush guide! I can help explain:
- **AI Complementary Team Formation**: How problem challenges form balanced 4-student teams.
- **Smart Skill Matching Engine**: The 75/25 weighted compatibility formula.
- **Student & Recruiter Portals**: How to apply, endorse skills, or post opportunities.
- **UI Navigation**: Finding any feature or dashboard.

Try asking: *"How does AI complementary team formation work?"* or *"How is match score computed?"*`,
        quickLinks: [
          { label: 'Try AI Team Builder', path: '/teams' },
          { label: 'Explore Student Opportunities', path: '/student' }
        ]
      };
    }

    res.status(200).json({
      success: true,
      data: {
        title: bestMatch.title,
        answer: bestMatch.response,
        quickLinks: bestMatch.quickLinks || []
      }
    });
  } catch (error) {
    next(error);
  }
};
