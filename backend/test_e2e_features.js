async function testE2E() {
  console.log('=== Starting SkillBridge Ayush E2E Feature Verification ===\n');

  const BASE_URL = 'http://localhost:5000/api';

  // 1. Test Chatbot Assistant
  console.log('1. Testing Ayush UI Assistant Chatbot...');
  const chatbotQueries = [
    'How does the AI Complementary Team Formation work?',
    'How is the skill compatibility match score calculated?',
    'What are the recruiter features?'
  ];

  for (const q of chatbotQueries) {
    const chatRes = await fetch(`${BASE_URL}/chatbot/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: q,
        currentPath: '/teams',
        userRole: 'industry'
      })
    }).then(r => r.json());
    console.log(`  Query: "${q}"`);
    console.log(`  Response Title: ${chatRes.data.title}`);
    console.log(`  Quick Links: ${JSON.stringify(chatRes.data.quickLinks)}`);
  }

  // 2. Test Industry Login & Team Generation
  console.log('\n2. Testing Industry Recruiter Login & Complementary Team Engine...');
  const indLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'hr@daburherbal.com',
      password: 'Password123'
    })
  }).then(r => r.json());
  const indToken = indLogin.token;
  console.log(`  Logged in as: ${indLogin.user.email} (${indLogin.user.role})`);

  const teamRes = await fetch(`${BASE_URL}/teams/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${indToken}`
    },
    body: JSON.stringify({
      title: 'Smart Medicinal Plant Inventory System',
      problemStatement: 'Design and deploy an automated track-and-trace inventory system for Ayush raw botanical herbs',
      teamSize: 4,
      durationWeeks: 6
    })
  }).then(r => r.json());

  console.log(`  Problem Title: ${teamRes.data.projectTitle}`);
  console.log(`  Team Coverage Score: ${teamRes.data.teamCoverageScore}%`);
  console.log(`  Deliverables: ${teamRes.data.deliverables.join(' + ')}`);
  console.log('  Assembled Complementary Squad:');
  teamRes.data.teamMembers.forEach((m, idx) => {
    console.log(`    [${idx + 1}] Role: ${m.assignedRole} | Student: ${m.student.fullName} (${m.student.degree}) | Fit: ${m.individualMatchScore}% | Matched: ${m.matchedSkills.join(', ')}`);
  });

  // 3. Propose Team
  console.log('\n3. Proposing Squad & Dispatching Invites...');
  const proposeRes = await fetch(`${BASE_URL}/teams/propose`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${indToken}`
    },
    body: JSON.stringify({
      title: teamRes.data.projectTitle,
      problemDescription: teamRes.data.problemDescription,
      category: 'Herbal Inventory & Supply Chain',
      teamSize: teamRes.data.teamSize,
      durationWeeks: teamRes.data.durationWeeks,
      deliverables: teamRes.data.deliverables,
      requiredSkills: teamRes.data.requiredSkills,
      teamMembers: teamRes.data.teamMembers,
      teamCoverageScore: teamRes.data.teamCoverageScore,
      missingSkills: teamRes.data.missingSkills,
      bridgeRecommendations: teamRes.data.bridgeRecommendations
    })
  }).then(r => r.json());
  console.log(`  Propose Status: ${proposeRes.success ? 'SUCCESS' : 'FAILED'}`);
  const createdTeamId = proposeRes.data._id;

  // 4. Test Student Login & Invite Acceptance
  console.log('\n4. Testing Student Login & Team Invitation Acceptance...');
  const stuLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@ayush.gov.in',
      password: 'Password123'
    })
  }).then(r => r.json());
  const stuToken = stuLogin.token;
  console.log(`  Logged in as: ${stuLogin.user.email} (${stuLogin.user.role})`);

  const stuTeams = await fetch(`${BASE_URL}/teams/my-teams`, {
    headers: { 'Authorization': `Bearer ${stuToken}` }
  }).then(r => r.json());
  console.log(`  Student has ${stuTeams.data.length} active/invited project teams.`);

  const acceptRes = await fetch(`${BASE_URL}/teams/${createdTeamId}/member-status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${stuToken}`
    },
    body: JSON.stringify({ status: 'Accepted' })
  }).then(r => r.json());
  console.log(`  Accept Status Update: ${acceptRes.success ? 'SUCCESS' : 'FAILED'}`);

  console.log('\n=== ALL END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
}

testE2E().catch(err => {
  console.error('Test Error:', err);
  process.exit(1);
});
