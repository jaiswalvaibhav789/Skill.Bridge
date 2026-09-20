/**
 * Multi-Factor Compatibility Formula Constants
 * Total: 100%
 */
const WEIGHTS = {
  SKILL: 0.50,           // 50%
  ELIGIBILITY: 0.20,     // 20%
  CAREER_ALIGNMENT: 0.15,// 15%
  PRACTICAL: 0.10,       // 10%
  LOCATION: 0.05         // 5%
};

/**
 * Calculates Skill Compatibility Score % and Missing Competencies (Standard Skill Matching)
 * @param {Array<string|ObjectId>} studentSkillIds 
 * @param {Array<string|ObjectId>} requiredSkillIds 
 * @param {Array<string|ObjectId>} preferredSkillIds 
 * @returns {Object} { matchScore, missingSkillIds }
 */
function calculateSkillMatch(studentSkillIds = [], requiredSkillIds = [], preferredSkillIds = []) {
  const studentSet = new Set(studentSkillIds.map(id => id.toString()));
  const requiredList = requiredSkillIds.map(id => id.toString());
  const preferredList = preferredSkillIds.map(id => id.toString());

  let matchedRequiredCount = 0;
  const missingSkillIds = [];

  requiredList.forEach(skillId => {
    if (studentSet.has(skillId)) {
      matchedRequiredCount++;
    } else {
      missingSkillIds.push(skillId);
    }
  });

  const requiredRatio = requiredList.length > 0 
    ? (matchedRequiredCount / requiredList.length) 
    : 1;

  let preferredRatio = 0;
  if (preferredList.length > 0) {
    let matchedPreferredCount = 0;
    preferredList.forEach(skillId => {
      if (studentSet.has(skillId)) matchedPreferredCount++;
    });
    preferredRatio = matchedPreferredCount / preferredList.length;
  }

  // Weighted formula: 75% required skills, 25% preferred skills
  const matchScore = preferredList.length > 0
    ? Math.round((requiredRatio * 75) + (preferredRatio * 25))
    : Math.round(requiredRatio * 100);

  return {
    matchScore: Math.min(100, Math.max(0, matchScore)),
    missingSkillIds
  };
}

/**
 * Calculates Comprehensive 5-Factor Weighted Compatibility between Candidate and Opportunity
 * Formula: 50% Skill Match + 20% Academic Eligibility + 15% Career Role + 10% Practical + 5% Location
 * @param {Object} params
 * @param {Object} params.studentProfile
 * @param {Object} params.opportunity
 * @returns {Object} Comprehensive compatibility evaluation
 */
function calculateMultiFactorCompatibility({ studentProfile, opportunity }) {
  if (!studentProfile || !opportunity) {
    return {
      compatibilityScore: 0,
      matchScore: 0,
      factorBreakdown: {
        skillScore: 0,
        eligibilityScore: 0,
        careerAlignmentScore: 0,
        practicalScore: 0,
        locationScore: 0
      },
      weights: WEIGHTS,
      matchReasons: [],
      missingSkillIds: [],
      matchedSkillIds: []
    };
  }

  const matchReasons = [];

  // --- Factor 1: Skill Compatibility Score (Weight: 50%) ---
  const studentSkillMap = new Map();
  (studentProfile.skills || []).forEach(s => {
    const sId = (s.skill?._id || s.skill || s._id || s).toString();
    studentSkillMap.set(sId, {
      proficiency: s.proficiency || 'Intermediate',
      score: s.proficiencyScore || 70,
      verified: !!s.verifiedByAssessment,
      endorsed: !!s.isEndorsed
    });
  });

  const requiredSkillIds = (opportunity.requiredSkills || []).map(s => (s._id || s).toString());
  const preferredSkillIds = (opportunity.preferredSkills || []).map(s => (s._id || s).toString());

  let matchedRequiredWeight = 0;
  const missingSkillIds = [];
  const matchedSkillIds = [];

  requiredSkillIds.forEach(reqId => {
    if (studentSkillMap.has(reqId)) {
      const sk = studentSkillMap.get(reqId);
      const profMultiplier = (sk.score || 70) / 100;
      matchedRequiredWeight += Math.max(0.5, Math.min(1.0, profMultiplier));
      matchedSkillIds.push(reqId);
    } else {
      missingSkillIds.push(reqId);
    }
  });

  const reqRatio = requiredSkillIds.length > 0 ? (matchedRequiredWeight / requiredSkillIds.length) : 1;

  let prefRatio = 0;
  if (preferredSkillIds.length > 0) {
    let matchedPrefWeight = 0;
    preferredSkillIds.forEach(prefId => {
      if (studentSkillMap.has(prefId)) {
        const sk = studentSkillMap.get(prefId);
        matchedPrefWeight += (sk.score || 70) / 100;
        matchedSkillIds.push(prefId);
      }
    });
    prefRatio = matchedPrefWeight / preferredSkillIds.length;
  } else {
    prefRatio = reqRatio;
  }

  const skillScore = Math.round(Math.min(100, (reqRatio * 80) + (prefRatio * 20)));
  if (skillScore >= 70) {
    matchReasons.push(`⚡ High Competency Coverage (${skillScore}% diagnostic match)`);
  }

  // --- Factor 2: Academic Eligibility (Weight: 20%) ---
  let degreeScore = 100;
  const studentDegree = (studentProfile.degree || '').trim();
  const eligibleDegrees = (opportunity.eligibleDegrees || []).map(d => d.trim().toLowerCase());

  if (eligibleDegrees.length > 0) {
    const isDirectMatch = eligibleDegrees.some(d => d.toLowerCase() === studentDegree.toLowerCase());
    if (isDirectMatch) {
      degreeScore = 100;
      matchReasons.push(`🎯 100% Academic Degree Match (${studentDegree})`);
    } else {
      degreeScore = 55;
    }
  } else {
    degreeScore = 100;
  }

  let cgpaScore = 100;
  const minCgpa = opportunity.minCgpa || 0;
  const studentCgpa = studentProfile.cgpa || 7.5;
  if (minCgpa > 0) {
    if (studentCgpa >= minCgpa) {
      cgpaScore = 100;
      matchReasons.push(`🎓 Academic Standard Met (CGPA ${studentCgpa} ≥ ${minCgpa})`);
    } else if (studentCgpa >= minCgpa - 0.5) {
      cgpaScore = 75;
    } else {
      cgpaScore = Math.max(30, Math.round((studentCgpa / minCgpa) * 100));
    }
  }

  const eligibilityScore = Math.round((degreeScore * 0.6) + (cgpaScore * 0.4));

  // --- Factor 3: Career Role Alignment (Weight: 15%) ---
  let careerAlignmentScore = 50;
  const targetRole = studentProfile.targetCareerRole;
  const targetTitle = (targetRole?.title || targetRole?.name || '').toLowerCase();
  const oppTitle = (opportunity.title || '').toLowerCase();
  const oppDesc = (opportunity.description || '').toLowerCase();

  if (targetTitle) {
    const targetKeywords = targetTitle.split(/\s+/).filter(w => w.length > 2);
    const hasKeywordMatch = targetKeywords.some(w => oppTitle.includes(w) || oppDesc.includes(w));
    if (hasKeywordMatch || (oppTitle.includes('gmp') && targetTitle.includes('gmp')) || (oppTitle.includes('clinical') && targetTitle.includes('clinical'))) {
      careerAlignmentScore = 95;
      matchReasons.push(`⭐ Career Role Alignment (${targetRole?.title || 'Target Role'})`);
    } else {
      careerAlignmentScore = 70;
    }
  } else {
    careerAlignmentScore = 75;
  }

  // --- Factor 4: Practical Experience & Projects (Weight: 10%) ---
  let practicalScore = 50;
  const projects = studentProfile.projects || [];
  const certs = studentProfile.certifications || [];
  let relevantProjectsCount = 0;

  projects.forEach(p => {
    const skillsUsed = (p.skillsUsed || []).map(s => s.toLowerCase());
    const hasRelevantSkill = skillsUsed.some(sk => 
      oppTitle.includes(sk) || 
      oppDesc.includes(sk) ||
      requiredSkillIds.length > 0
    );
    if (hasRelevantSkill) relevantProjectsCount++;
  });

  const verifiedCertsCount = certs.filter(c => c.isVerified).length;

  if (relevantProjectsCount >= 1 || verifiedCertsCount >= 1) {
    practicalScore = Math.min(100, 70 + (relevantProjectsCount * 15) + (verifiedCertsCount * 10));
    matchReasons.push(`🔬 Practical Project Portfolio Match (${projects.length} project(s), ${verifiedCertsCount} verified cert(s))`);
  } else if (projects.length > 0) {
    practicalScore = 65;
  }

  // --- Factor 5: Location & Workplace Mode (Weight: 5%) ---
  let locationScore = 70;
  const workplaceType = opportunity.workplaceType || 'On-site';
  const oppLocRaw = opportunity.location;
  const oppLocation = typeof oppLocRaw === 'string'
    ? oppLocRaw.toLowerCase()
    : `${oppLocRaw?.city || ''} ${oppLocRaw?.state || ''}`.toLowerCase();

  const instLocRaw = studentProfile.institute?.location;
  const instLocation = typeof instLocRaw === 'string'
    ? instLocRaw.toLowerCase()
    : `${instLocRaw?.city || ''} ${instLocRaw?.state || ''}`.toLowerCase();

  if (workplaceType === 'Remote') {
    locationScore = 100;
    matchReasons.push(`🌐 Remote Flexibility (Available pan-India)`);
  } else if (workplaceType === 'Hybrid') {
    locationScore = 85;
  } else {
    if (oppLocation && instLocation && 
      ((oppLocation.includes('delhi') && instLocation.includes('delhi')) || 
       (oppLocation.includes('ghaziabad') && instLocation.includes('delhi')) ||
       (oppLocation.includes('ncr') && instLocation.includes('delhi')))) {
      locationScore = 100;
      matchReasons.push(`📍 Regional Proximity (${opportunity.location?.city || opportunity.location || 'Local Region'})`);
    } else {
      locationScore = 75;
    }
  }

  // Final Multi-Factor Composite Score
  const compatibilityScore = Math.min(100, Math.max(0, Math.round(
    (skillScore * WEIGHTS.SKILL) +
    (eligibilityScore * WEIGHTS.ELIGIBILITY) +
    (careerAlignmentScore * WEIGHTS.CAREER_ALIGNMENT) +
    (practicalScore * WEIGHTS.PRACTICAL) +
    (locationScore * WEIGHTS.LOCATION)
  )));

  return {
    compatibilityScore,
    matchScore: compatibilityScore, // Backward compatibility alias
    factorBreakdown: {
      skillScore,
      eligibilityScore,
      careerAlignmentScore,
      practicalScore,
      locationScore
    },
    weights: WEIGHTS,
    matchReasons,
    missingSkillIds,
    matchedSkillIds
  };
}

module.exports = {
  WEIGHTS,
  calculateSkillMatch,
  calculateMultiFactorCompatibility
};
