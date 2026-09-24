import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getStudentProfile,
  getMatchedOpportunities,
  applyToOpportunity,
  getStudentApplications,
  getRemedialLearningPath
} from '../services/api';
import StatCard from '../components/StatCard';
import OpportunityCard from '../components/OpportunityCard';
import SkillBadge from '../components/SkillBadge';
import {
  MOCK_STUDENT_PROFILE,
  MOCK_OPPORTUNITIES,
  MOCK_APPLICATIONS,
  MOCK_LEARNING_PROGRAMS
} from '../services/mockData';
import {
  Award,
  Briefcase,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Compass,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [remedialPrograms, setRemedialPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState('');
  const [sortFactor, setSortFactor] = useState('multi-factor');

  const loadData = async () => {
    setLoading(true);
    try {
      const [profRes, oppRes, appRes, remedyRes] = await Promise.allSettled([
        getStudentProfile(),
        getMatchedOpportunities(),
        getStudentApplications(),
        getRemedialLearningPath()
      ]);

      const prof = profRes.status === 'fulfilled' ? (profRes.value.data?.profile || profRes.value.data?.data || profRes.value.data) : null;
      setProfile(prof || MOCK_STUDENT_PROFILE);

      const opps = oppRes.status === 'fulfilled' ? (oppRes.value.data?.data || oppRes.value.data) : null;
      setOpportunities(Array.isArray(opps) && opps.length > 0 ? opps : MOCK_OPPORTUNITIES);

      const apps = appRes.status === 'fulfilled' ? (appRes.value.data?.data || appRes.value.data) : null;
      setApplications(Array.isArray(apps) && apps.length > 0 ? apps : MOCK_APPLICATIONS);

      const remedy = remedyRes.status === 'fulfilled' ? (remedyRes.value.data?.data || remedyRes.value.data) : null;
      setRemedialPrograms(Array.isArray(remedy) && remedy.length > 0 ? remedy : MOCK_LEARNING_PROGRAMS);
    } catch (err) {
      console.error('Error fetching student dashboard data:', err);
      setProfile(MOCK_STUDENT_PROFILE);
      setOpportunities(MOCK_OPPORTUNITIES);
      setApplications(MOCK_APPLICATIONS);
      setRemedialPrograms(MOCK_LEARNING_PROGRAMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApply = async (opportunityId) => {
    setApplyingId(opportunityId);
    setMessage('');
    try {
      await applyToOpportunity(opportunityId);
      setMessage('Application submitted successfully with empirical multi-factor compatibility evaluation!');
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplyingId(null);
    }
  };

  // Sort opportunities based on user selected factor
  const sortedOpportunities = [...opportunities].sort((a, b) => {
    if (sortFactor === 'skill') {
      return (b.factorBreakdown?.skillScore || b.matchScore || 0) - (a.factorBreakdown?.skillScore || a.matchScore || 0);
    }
    if (sortFactor === 'eligibility') {
      return (b.factorBreakdown?.eligibilityScore || 0) - (a.factorBreakdown?.eligibilityScore || 0);
    }
    if (sortFactor === 'career') {
      return (b.factorBreakdown?.careerAlignmentScore || 0) - (a.factorBreakdown?.careerAlignmentScore || 0);
    }
    // Default: Multi-Factor Composite Score
    return (b.compatibilityScore || b.matchScore || 0) - (a.compatibilityScore || a.matchScore || 0);
  });

  const avgMatchScore = opportunities.length > 0
    ? Math.round(opportunities.reduce((acc, curr) => acc + (curr.compatibilityScore || curr.matchScore || 0), 0) / opportunities.length)
    : 82;

  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Offered' || a.status === 'Accepted').length;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-semibold text-sm">Evaluating Multi-Factor Recommendations & Skill Profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Overview Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multi-Factor Recommendation Engine Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">
            Welcome, {profile?.fullName || 'Ayush Scholar'}
          </h1>
          <p className="text-emerald-200 text-sm mt-1">
            {profile?.degree || 'BAMS'} ({profile?.department || 'Ayush Medicine'}) • {profile?.institute?.instituteName || 'All India Institute of Ayurveda'}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3 text-left md:text-right">
          <p className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold">Enrollment Identifier</p>
          <p className="font-mono text-sm font-bold text-white mt-0.5">{profile?.rollNumber || 'AIIA-2022-042'}</p>
          {profile?.targetCareerRole && (
            <p className="text-xs text-slate-300 mt-1">
              Target: <strong className="text-emerald-300">{profile.targetCareerRole.title}</strong>
            </p>
          )}
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-emerald-600 hover:text-emerald-800 text-xs font-bold">Dismiss</button>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Avg Compatibility"
          value={`${avgMatchScore}%`}
          subtitle="5-Factor Weighted Score"
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Applications"
          value={applications.length || '0'}
          subtitle="Pipeline Submissions"
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Active Stages"
          value={shortlistedCount || '0'}
          subtitle="Shortlisted & Offers"
          icon={CheckCircle}
          color="amber"
        />
      </div>

      {/* Multi-Factor Formula Indicator Banner */}
      <div className="p-4 bg-slate-900 rounded-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              5-Factor Weighted Compatibility Model
            </h4>
            <p className="text-xs text-slate-300">
              Rankings dynamically weight <strong>50% Diagnostic Skills</strong> + <strong>20% Academic Eligibility</strong> + <strong>15% Career Role</strong> + <strong>10% Projects</strong> + <strong>5% Location</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Sort By:</span>
          <select
            value={sortFactor}
            onChange={(e) => setSortFactor(e.target.value)}
            className="bg-slate-800 text-white text-xs rounded-xl px-3 py-1.5 border border-slate-700 focus:outline-none focus:border-emerald-500 font-semibold"
          >
            <option value="multi-factor">Overall Compatibility</option>
            <option value="skill">Skill Coverage (50%)</option>
            <option value="eligibility">Academic Eligibility (20%)</option>
            <option value="career">Career Role Match (15%)</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Matched Opportunities Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Ranked Opportunities Feed
              </h2>
              <p className="text-xs text-slate-500">
                Sorted by {sortFactor === 'multi-factor' ? 'Multi-Factor Compatibility' : sortFactor}
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {opportunities.length} Matches Found
            </span>
          </div>

          <div className="space-y-4">
            {sortedOpportunities.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                onApply={handleApply}
                applying={applyingId === opp._id}
              />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Verified Skills, Application Tracker, & Remedial Learning */}
        <div className="space-y-6">
          {/* My Verified Skills Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              My Ayush Competencies ({profile?.skills?.length || 0})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Competencies with <span className="text-emerald-600 font-bold">✓</span> are verified via standardized diagnostic assessments or institute endorsement.
            </p>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.map((item) => (
                <SkillBadge
                  key={item.skill?._id || item._id}
                  name={item.skill?.name || 'Ayush Skill'}
                  isEndorsed={item.isEndorsed}
                  proficiency={item.proficiency}
                />
              ))}
            </div>
          </div>

          {/* Remedial Learning Path Widget (Phase 14 feature) */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
                  Remedial Courses
                </h3>
              </div>
              <Link to="/learning" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-xs text-slate-600">
              Personalized programs recommended to close diagnostic gaps in your top matched opportunities:
            </p>

            {remedialPrograms.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No critical skill deficits detected. Keep up the high performance!</p>
            ) : (
              <div className="space-y-2.5">
                {remedialPrograms.slice(0, 3).map((prog, idx) => (
                  <div key={prog._id || idx} className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-xs text-slate-900 leading-tight">{prog.title}</h5>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex-shrink-0">
                        Closes {prog.skillsSolvedCount || 1} gap(s)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{prog.provider || 'All India Institute of Ayurveda'} • {prog.durationWeeks || 4} Weeks</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Application Tracker Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recruitment Pipeline
              </h3>
              <Link to="/applications" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
                View Tracker
              </Link>
            </div>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-400">No active recruitment applications yet.</p>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 3).map((app, idx) => (
                  <div key={app._id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold text-slate-800">{app.opportunity?.title || 'Ayush Quality Control Analyst'}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      {app.opportunity?.industry?.companyName || app.opportunity?.postedBy?.companyName || 'Dabur Ayush Research & Manufacturing Ltd'}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px]">
                      <span className="font-semibold text-slate-600">Compatibility: {app.matchScore}%</span>
                      <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
