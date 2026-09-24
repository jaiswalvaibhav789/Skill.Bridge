import axios from 'axios';
import {
  MOCK_USERS,
  MOCK_STUDENT_PROFILE,
  MOCK_OPPORTUNITIES,
  MOCK_APPLICATIONS,
  MOCK_SKILLS,
  MOCK_CAREER_ROLES,
  MOCK_LEARNING_PROGRAMS,
  MOCK_ASSESSMENTS,
  MOCK_INDUSTRY_PROFILE,
  MOCK_FACULTY_PROFILE,
  MOCK_INSTITUTE_PROFILE,
  MOCK_ANALYTICS_SUMMARY
} from './mockData';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token & Request Tracing
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to determine mock response when backend is offline
const resolveMockData = (url = '', method = 'get') => {
  const cleanUrl = url.replace(/^\/api/, '');

  if (cleanUrl.includes('/auth/me')) {
    let savedUser = null;
    let savedProfile = null;
    try {
      savedUser = JSON.parse(localStorage.getItem('skillbridge_demo_user'));
      savedProfile = JSON.parse(localStorage.getItem('skillbridge_demo_profile'));
    } catch {
      // ignore
    }
    return {
      success: true,
      data: {
        user: savedUser || MOCK_USERS.student,
        profile: savedProfile || MOCK_STUDENT_PROFILE
      }
    };
  }

  if (cleanUrl.includes('/students/profile')) {
    return { success: true, profile: MOCK_STUDENT_PROFILE, data: MOCK_STUDENT_PROFILE };
  }
  if (cleanUrl.includes('/students/matched-opportunities') || cleanUrl.includes('/recommendations/opportunities')) {
    return { success: true, data: MOCK_OPPORTUNITIES };
  }
  if (cleanUrl.includes('/students/my-applications')) {
    return { success: true, data: MOCK_APPLICATIONS };
  }
  if (cleanUrl.includes('/recommendations/learning-path')) {
    return { success: true, data: MOCK_LEARNING_PROGRAMS };
  }
  if (cleanUrl.includes('/students/portfolio')) {
    return { success: true, data: MOCK_STUDENT_PROFILE, profile: MOCK_STUDENT_PROFILE };
  }
  if (cleanUrl.includes('/students/verify-credential')) {
    return { success: true, data: { verified: true, score: 85, institute: 'AIIA New Delhi' } };
  }
  if (cleanUrl.includes('/skills')) {
    return { success: true, data: MOCK_SKILLS };
  }
  if (cleanUrl.includes('/assessments')) {
    return { success: true, data: MOCK_ASSESSMENTS };
  }
  if (cleanUrl.includes('/skill-gap/roles')) {
    return { success: true, data: MOCK_CAREER_ROLES };
  }
  if (cleanUrl.includes('/skill-gap/analyze')) {
    return {
      success: true,
      data: {
        role: MOCK_CAREER_ROLES[0],
        readinessScore: 84,
        acquiredSkills: MOCK_STUDENT_PROFILE.skills,
        gaps: [
          { skill: MOCK_SKILLS[4], deficit: 15, priority: 'High', recommendedCourses: [MOCK_LEARNING_PROGRAMS[0]] }
        ]
      }
    };
  }
  if (cleanUrl.includes('/learning/recommended')) {
    return { success: true, data: MOCK_LEARNING_PROGRAMS };
  }
  if (cleanUrl.includes('/learning/my-enrollments')) {
    return { success: true, data: [] };
  }
  if (cleanUrl.includes('/learning')) {
    return { success: true, data: MOCK_LEARNING_PROGRAMS };
  }
  if (cleanUrl.includes('/industry/profile')) {
    return { success: true, profile: MOCK_INDUSTRY_PROFILE, data: MOCK_INDUSTRY_PROFILE };
  }
  if (cleanUrl.includes('/industry/opportunities')) {
    return { success: true, data: MOCK_OPPORTUNITIES };
  }
  if (cleanUrl.includes('/industry/talent-pool')) {
    return { success: true, data: [MOCK_STUDENT_PROFILE] };
  }
  if (cleanUrl.includes('/faculty/profile')) {
    return { success: true, profile: MOCK_FACULTY_PROFILE, data: MOCK_FACULTY_PROFILE };
  }
  if (cleanUrl.includes('/faculty/collaborations') || cleanUrl.includes('/collaborations')) {
    return { success: true, data: [] };
  }
  if (cleanUrl.includes('/institute/students')) {
    return { success: true, data: [MOCK_STUDENT_PROFILE] };
  }
  if (cleanUrl.includes('/analytics/institute/summary') || cleanUrl.includes('/analytics/admin/overview')) {
    return { success: true, data: MOCK_ANALYTICS_SUMMARY };
  }
  if (cleanUrl.includes('/analytics/skill-demand')) {
    return { success: true, data: MOCK_SKILLS };
  }
  if (cleanUrl.includes('/analytics/placement-funnel')) {
    return { success: true, data: { applied: 1420, shortlisted: 840, offered: 520, accepted: 480 } };
  }
  if (cleanUrl.includes('/tracking')) {
    return { success: true, data: [] };
  }
  if (cleanUrl.includes('/teams')) {
    return { success: true, data: [] };
  }
  if (cleanUrl.includes('/notifications')) {
    return { success: true, data: [] };
  }
  if (cleanUrl.includes('/audit-logs/summary')) {
    return { success: true, data: { totalLogs: 124, verifiedHashes: 124 } };
  }
  if (cleanUrl.includes('/audit-logs')) {
    return { success: true, data: [] };
  }
  if (cleanUrl.includes('/chatbot/ask')) {
    return {
      success: true,
      data: {
        reply: 'SkillBridge Ayush AI: Explore opportunities matched with your AYUSH skill matrix.'
      }
    };
  }

  // Generic fallback
  return { success: true, data: [] };
};

// Response Interceptor: Session Expiry & Seamless Offline Mock Fallback
API.interceptors.response.use(
  (response) => {
    // If Vercel rewrites API requests to index.html (string starting with <!doctype)
    if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
      const mock = resolveMockData(response.config?.url, response.config?.method);
      return { ...response, data: mock };
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const errorMsg = error.response.data?.message || '';
      if (errorMsg.includes('expired') || error.response.data?.error === 'TOKEN_EXPIRED') {
        localStorage.removeItem('token');
        localStorage.removeItem('skillbridge_demo_user');
        localStorage.removeItem('skillbridge_demo_profile');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }
    }

    // If backend is unreachable or not yet deployed on Vercel preview (404, 405, 502, network error)
    const isOffline =
      !error.response ||
      error.response.status === 404 ||
      error.response.status === 405 ||
      error.response.status === 502 ||
      error.response.status === 503 ||
      error.code === 'ERR_NETWORK';

    if (isOffline && error.config && error.config.url) {
      // Don't intercept auth login/register so AuthContext can handle role detection
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        const mock = resolveMockData(error.config.url, error.config.method);
        return Promise.resolve({
          data: mock,
          status: 200,
          statusText: 'OK (Mock Preview)',
          headers: {},
          config: error.config
        });
      }
    }

    return Promise.reject(error);
  }
);

// Health & System Info
export const getSystemHealth = () => API.get('/health');
export const getSystemVersion = () => API.get('/version');

// Auth endpoints
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Student endpoints
export const getStudentProfile = () => API.get('/students/profile');
export const updateStudentProfile = (data) => API.put('/students/profile', data);
export const getPublicPortfolio = (slug) => API.get(`/students/portfolio/${slug}`);
export const verifyCredential = (hash) => API.get(`/students/verify-credential/${hash}`);
export const updatePortfolioSlug = (slug) => API.put('/students/portfolio-slug', { slug });
export const generateCredentialBadges = () => API.post('/students/generate-credentials');
export const getMatchedOpportunities = () => API.get('/students/matched-opportunities');
export const applyToOpportunity = (id) => API.post(`/students/apply/${id}`);
export const getStudentApplications = () => API.get('/students/my-applications');
export const withdrawApplication = (id, reason) => API.put(`/students/applications/${id}/withdraw`, { reason });
export const acceptApplicationOffer = (id) => API.put(`/students/applications/${id}/accept`);

// Recommendation Engine endpoints
export const getRecommendedOpportunities = (params) => API.get('/recommendations/opportunities', { params });
export const getCandidateRecommendations = (opportunityId) => API.get(`/recommendations/candidates/${opportunityId}`);
export const getRemedialLearningPath = () => API.get('/recommendations/learning-path');

// Faculty & Collaboration endpoints
export const getFacultyProfile = () => API.get('/faculty/profile');
export const updateFacultyProfile = (data) => API.put('/faculty/profile', data);
export const getFacultyCollaborations = () => API.get('/faculty/collaborations');
export const getAllCollaborations = (params) => API.get('/collaborations', { params });
export const getCollaborationById = (id) => API.get(`/collaborations/${id}`);
export const createCollaboration = (data) => API.post('/collaborations', data);
export const submitCollaborationProposal = (id, data) => API.post(`/collaborations/${id}/apply`, data);
export const reviewCollaborationProposal = (id, data) => API.put(`/collaborations/${id}/review-proposal`, data);
export const respondToConsultingRequest = (id, data) => API.put(`/collaborations/${id}/consulting-response`, data);

// Industry endpoints
export const getIndustryProfile = () => API.get('/industry/profile');
export const updateIndustryProfile = (data) => API.put('/industry/profile', data);
export const getIndustryOpportunities = () => API.get('/industry/opportunities');
export const createOpportunity = (data) => API.post('/industry/opportunities', data);
export const getOpportunityApplicants = (id) => API.get(`/industry/opportunities/${id}/applicants`);
export const updateApplicationStatus = (id, data) => API.put(`/industry/applications/${id}/status`, data);
export const getTalentPool = (params) => API.get('/industry/talent-pool', { params });

// Institute & Analytics endpoints
export const getInstituteStudents = () => API.get('/institute/students');
export const endorseStudentSkill = (data) => API.post('/institute/endorse-skill', data);
export const getInstituteSummary = () => API.get('/analytics/institute/summary');
export const getSkillDemand = () => API.get('/analytics/skill-demand');
export const getPlacementFunnel = () => API.get('/analytics/placement-funnel');
export const getCurriculumGapHeatmap = () => API.get('/analytics/curriculum-heatmap');
export const getAdminOverview = () => API.get('/analytics/admin/overview');

// Skills & Assessments endpoints
export const getSkills = (params) => API.get('/skills', { params });
export const getAssessments = () => API.get('/assessments');
export const getAssessmentById = (id) => API.get(`/assessments/${id}`);
export const submitAssessment = (id, data) => API.post(`/assessments/${id}/submit`, data);

// Skill Gap & Learning endpoints
export const getCareerRoles = () => API.get('/skill-gap/roles');
export const analyzeSkillGap = (roleId) => API.get(`/skill-gap/analyze/${roleId || ''}`);
export const getLearningPrograms = (params) => API.get('/learning', { params });
export const getLearningProgramById = (id) => API.get(`/learning/${id}`);
export const getRecommendedLearningPrograms = () => API.get('/learning/recommended');
export const enrollLearningProgram = (id) => API.post(`/learning/${id}/enroll`);
export const getMyEnrolledPrograms = () => API.get('/learning/my-enrollments');
export const updateLearningProgress = (id, data) => API.put(`/learning/${id}/progress`, data);

// Internship Milestone Tracking endpoints
export const getMyInternshipProgress = () => API.get('/tracking/my-internship');
export const submitWeeklyLog = (data) => API.post('/tracking/milestone', data);
export const getIndustryInterns = () => API.get('/tracking/industry-interns');
export const evaluateWeeklyLog = (progressId, weekNumber, data) =>
  API.put(`/tracking/milestone/${progressId}/${weekNumber}/evaluate`, data);
export const completeInternship = (progressId, data) =>
  API.put(`/tracking/${progressId}/complete`, data);

// AI Team Formation endpoints
export const decomposeProblem = (data) => API.post('/teams/decompose', data);
export const generateComplementaryTeam = (data) => API.post('/teams/generate', data);
export const proposeProjectTeam = (data) => API.post('/teams/propose', data);
export const getMyProjectTeams = () => API.get('/teams/my-teams');
export const updateTeamMemberStatus = (teamId, data) => API.put(`/teams/${teamId}/member-status`, data);

// Notification endpoints
export const getMyNotifications = (params) => API.get('/notifications', { params });
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put('/notifications/mark-all-read');
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);
export const clearAllReadNotifications = () => API.delete('/notifications/clear-all');

// Immutable Audit Log endpoints (Admin)
export const getAuditLogs = (params) => API.get('/audit-logs', { params });
export const getAuditSummary = () => API.get('/audit-logs/summary');
export const getAuditLogById = (id) => API.get(`/audit-logs/${id}`);

// UI Assistant Chatbot endpoint
export const askChatbotAssistant = (data) => API.post('/chatbot/ask', data);

export default API;
