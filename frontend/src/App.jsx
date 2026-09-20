import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import IndustryDashboard from './pages/IndustryDashboard';
import InstituteDashboard from './pages/InstituteDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import PublicPortfolio from './pages/PublicPortfolio';
import MyPortfolio from './pages/MyPortfolio';
import AssessmentRunner from './pages/AssessmentRunner';
import SkillGapExplorer from './pages/SkillGapExplorer';
import LearningHub from './pages/LearningHub';
import StudentApplications from './pages/StudentApplications';
import InternshipTracker from './pages/InternshipTracker';
import CollaborationsHub from './pages/CollaborationsHub';
import TeamBuilder from './pages/TeamBuilder';
import AdminAuditLogs from './pages/AdminAuditLogs';
import NotFound from './pages/NotFound';
import AyushChatbot from './components/AyushChatbot';
import { useAuth } from './context/AuthContext';

/**
 * Wraps a page in ProtectedRoute + DashboardLayout with sidebar navigation.
 */
function ProtectedDashboard({ allowedRoles, title, subtitle, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <DashboardLayout user={user} onLogout={handleLogout} title={title} subtitle={subtitle}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-semibold text-sm text-slate-600">Initializing SkillBridge Enterprise...</p>
          <p className="text-xs text-slate-400 mt-1">Ministry of Ayush | SIH26044</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 relative">
      <Routes>
        {/* ── Public Routes ───────────────────────────────────────────── */}
        <Route
          path="/"
          element={
            <>
              <Navbar user={user} onLogout={handleLogout} />
              <main className="flex-1"><Home /></main>
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar user={user} onLogout={handleLogout} />
              <main className="flex-1"><Login /></main>
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Navbar user={user} onLogout={handleLogout} />
              <main className="flex-1"><Register /></main>
            </>
          }
        />

        {/* Public Digital Portfolio — no auth required */}
        <Route path="/portfolio/:slug" element={<PublicPortfolio />} />

        {/* ── Student Protected Routes ─────────────────────────────────── */}
        <Route
          path="/student"
          element={
            <ProtectedDashboard
              allowedRoles={['student']}
              title="Student Dashboard"
              subtitle="Your personalised skill intelligence & career hub"
            >
              <StudentDashboard />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/opportunities"
          element={
            <ProtectedDashboard
              allowedRoles={['student']}
              title="Matched Opportunities"
              subtitle="5-Factor AI-matched internships & placements"
            >
              <StudentDashboard />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedDashboard
              allowedRoles={['student', 'admin']}
              title="My Applications"
              subtitle="Track your internship & job applications"
            >
              <StudentApplications />
            </ProtectedDashboard>
          }
        />

        {/* ── Internship Milestone & Deliverable Tracking ────────────────── */}
        <Route
          path="/internship-tracker"
          element={
            <ProtectedDashboard
              allowedRoles={['student', 'industry', 'faculty', 'institute', 'admin']}
              title="Internship Milestone Tracker"
              subtitle="Weekly deliverable logging, mentor feedback & verifiable completion certificate"
            >
              <InternshipTracker />
            </ProtectedDashboard>
          }
        />

        {/* ── Skill Intelligence Routes ─────────────────────────────────── */}
        <Route
          path="/skill-gap"
          element={
            <ProtectedDashboard
              allowedRoles={['student', 'faculty', 'institute', 'admin']}
              title="Skill Gap Analyzer"
              subtitle="Mathematical deficit analysis against industry benchmarks"
            >
              <SkillGapExplorer />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/assessments"
          element={
            <ProtectedDashboard
              allowedRoles={['student', 'faculty', 'institute', 'admin']}
              title="Diagnostic Assessments"
              subtitle="Auto-graded competency evaluations across 10 Ayush domains"
            >
              <AssessmentRunner />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/assessments/:id"
          element={
            <ProtectedDashboard
              allowedRoles={['student', 'faculty', 'institute', 'admin']}
              title="Assessment"
              subtitle="Timed diagnostic MCQ evaluation"
            >
              <AssessmentRunner />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/learning"
          element={
            <ProtectedDashboard
              allowedRoles={['student', 'faculty', 'institute', 'industry', 'admin']}
              title="Learning & Development Hub"
              subtitle="Remedial courses, FDPs and modular skill programs"
            >
              <LearningHub />
            </ProtectedDashboard>
          }
        />

        {/* ── Digital Portfolio ─────────────────────────────────────────── */}
        <Route
          path="/portfolio"
          element={
            <ProtectedDashboard
              allowedRoles={['student', 'admin', 'faculty', 'institute']}
              title="Digital Portfolio"
              subtitle="Verifiable SHA-256 micro-credential ledger"
            >
              <MyPortfolio />
            </ProtectedDashboard>
          }
        />

        {/* ── Industry Routes ───────────────────────────────────────────── */}
        <Route
          path="/industry"
          element={
            <ProtectedDashboard
              allowedRoles={['industry']}
              title="Recruiter Dashboard"
              subtitle="Talent pipeline, vacancy management & candidate kanban"
            >
              <IndustryDashboard />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/industry/post"
          element={
            <ProtectedDashboard
              allowedRoles={['industry', 'admin']}
              title="Post New Opportunity"
              subtitle="Publish internship or placement vacancy to the Ayush ecosystem"
            >
              <IndustryDashboard />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/industry/interns"
          element={
            <ProtectedDashboard
              allowedRoles={['industry', 'admin']}
              title="Active Interns Tracking"
              subtitle="Supervise deliverables, evaluate milestones & issue certificates"
            >
              <InternshipTracker />
            </ProtectedDashboard>
          }
        />

        {/* ── Faculty Routes ────────────────────────────────────────────── */}
        <Route
          path="/faculty"
          element={
            <ProtectedDashboard
              allowedRoles={['faculty', 'admin']}
              title="Faculty Dashboard"
              subtitle="Consulting directory, joint R&D & sabbatical management"
            >
              <FacultyDashboard />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/faculty/collaborations"
          element={
            <ProtectedDashboard
              allowedRoles={['faculty', 'admin']}
              title="Research Collaborations"
              subtitle="Joint R&D proposals, FDPs and academic-industry partnerships"
            >
              <CollaborationsHub />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/faculty/mentorship"
          element={
            <ProtectedDashboard
              allowedRoles={['faculty', 'admin']}
              title="Student Mentorship & Guidance"
              subtitle="Academic mentoring, research advisement & progress monitoring"
            >
              <FacultyDashboard />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/collaborations"
          element={
            <ProtectedDashboard
              allowedRoles={['industry', 'faculty', 'institute', 'admin', 'student']}
              title="Collaborations Hub"
              subtitle="Industry consulting, sabbaticals and research alliances"
            >
              <CollaborationsHub />
            </ProtectedDashboard>
          }
        />

        {/* ── Institute / Admin Routes ──────────────────────────────────── */}
        <Route
          path="/institute"
          element={
            <ProtectedDashboard
              allowedRoles={['institute', 'admin']}
              title="Executive Institutional Dashboard"
              subtitle="Placement funnel, curriculum gap heatmap & skill demand telemetry"
            >
              <InstituteDashboard />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/institute/students"
          element={
            <ProtectedDashboard
              allowedRoles={['institute', 'admin']}
              title="Institutional Student Directory"
              subtitle="Academic rosters, student credentials & verified skill endorsements"
            >
              <InstituteDashboard />
            </ProtectedDashboard>
          }
        />
        <Route
          path="/institute/demand"
          element={
            <ProtectedDashboard
              allowedRoles={['institute', 'admin']}
              title="Skill Demand Heatmap"
              subtitle="Real-time industry requirements telemetry vs academic curriculum"
            >
              <InstituteDashboard />
            </ProtectedDashboard>
          }
        />

        {/* ── Ministry Admin Forensic Audit Logs ───────────────────────── */}
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedDashboard
              allowedRoles={['admin']}
              title="System Audit Logs"
              subtitle="Immutable W3C forensic audit trail — all system events"
            >
              <AdminAuditLogs />
            </ProtectedDashboard>
          }
        />

        {/* ── AI Team Formation ─────────────────────────────────────────── */}
        <Route
          path="/teams"
          element={
            <ProtectedDashboard
              allowedRoles={['industry', 'student', 'institute', 'faculty', 'admin']}
              title="AI Team Builder"
              subtitle="Complementary team formation engine for Ayush project squads"
            >
              <TeamBuilder user={user} />
            </ProtectedDashboard>
          }
        />

        {/* ── 404 Catch-all Fallback Route ────────────────────────────── */}
        <Route
          path="*"
          element={
            user ? (
              <ProtectedDashboard
                allowedRoles={['student', 'industry', 'faculty', 'institute', 'admin']}
                title="Page Not Found"
                subtitle="The requested page could not be located"
              >
                <NotFound />
              </ProtectedDashboard>
            ) : (
              <>
                <Navbar user={user} onLogout={handleLogout} />
                <main className="flex-1">
                  <NotFound />
                </main>
              </>
            )
          }
        />
      </Routes>

      {/* Floating UI Assistant Chatbot — shown on all pages */}
      <AyushChatbot user={user} />
    </div>
  );
}
