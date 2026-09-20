import React, { useState, useEffect } from 'react';
import {
  getIndustryProfile,
  getIndustryOpportunities,
  createOpportunity,
  getOpportunityApplicants,
  updateApplicationStatus,
  getTalentPool,
  getSkills,
  getCandidateRecommendations
} from '../services/api';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  Briefcase,
  Users,
  PlusCircle,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Banknote,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Sparkles,
  Send,
  Building2,
  UserCheck,
  Search,
  Filter,
  Video,
  Award,
  ChevronRight
} from 'lucide-react';

export default function IndustryDashboard() {
  const { toastSuccess, toastError, toastInfo } = useToast();

  const [activeTab, setActiveTab] = useState('applicants'); // 'applicants' | 'talent-pool'

  const [profile, setProfile] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);

  // Candidate Review & Interview Scheduling State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [recruiterFeedback, setRecruiterFeedback] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  // Inline Interview Scheduler fields
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewDate, setInterviewDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [roundName, setRoundName] = useState('Round 1: Technical & Samhita Viva');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/ayu-shbr-dge');
  const [meetingRoom, setMeetingRoom] = useState('Google Meet Virtual Boardroom');

  // Talent Pool State & Filters
  const [talentPool, setTalentPool] = useState([]);
  const [talentLoading, setTalentLoading] = useState(false);
  const [talentDegree, setTalentDegree] = useState('All');
  const [talentMinCgpa, setTalentMinCgpa] = useState('');
  const [talentSearch, setTalentSearch] = useState('');

  // AI Recommendations State (Phase 14)
  const [recommendedCandidates, setRecommendedCandidates] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendOppId, setRecommendOppId] = useState('');

  // Form State for new Opportunity Wizard
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Ghaziabad, Delhi-NCR');
  const [stipend, setStipend] = useState('₹6.5 LPA - ₹8.5 LPA');
  const [durationMonths, setDurationMonths] = useState(12);
  const [openingsCount, setOpeningsCount] = useState(2);
  const [workplaceType, setWorkplaceType] = useState('On-site');
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);

  const loadData = async () => {
    try {
      const [profRes, oppsRes, skillsRes] = await Promise.all([
        getIndustryProfile(),
        getIndustryOpportunities(),
        getSkills()
      ]);
      setProfile(profRes.data?.profile || profRes.data?.data);
      const opps = oppsRes.data?.data || [];
      setOpportunities(opps);
      setAllSkills(skillsRes.data?.data || skillsRes.data || []);

      if (opps.length > 0 && !selectedOppId) {
        setSelectedOppId(opps[0]._id);
        fetchApplicants(opps[0]._id);
      }
    } catch (err) {
      console.error('Error fetching industry dashboard data:', err);
      toastError('Failed to load recruiter data');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (oppId) => {
    try {
      const res = await getOpportunityApplicants(oppId);
      setApplicants(res.data?.data?.applicants || res.data?.data || []);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    }
  };

  const fetchTalentPoolData = async () => {
    setTalentLoading(true);
    try {
      const params = {};
      if (talentDegree !== 'All') params.degree = talentDegree;
      if (talentMinCgpa) params.minCgpa = talentMinCgpa;
      if (talentSearch) params.search = talentSearch;

      const res = await getTalentPool(params);
      setTalentPool(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching talent pool:', err);
      toastError('Failed to search campus talent pool');
    } finally {
      setTalentLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'talent-pool') {
      fetchTalentPoolData();
    }
  }, [activeTab, talentDegree, talentMinCgpa]);

  const fetchRecommendations = async (oppId) => {
    if (!oppId) return;
    setLoadingRecommendations(true);
    try {
      const res = await getCandidateRecommendations(oppId);
      setRecommendedCandidates(res.data?.data || []);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to load AI candidate recommendations');
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ai-recommendations') {
      const targetId = recommendOppId || selectedOppId || (opportunities[0]?._id);
      if (targetId) {
        if (!recommendOppId) setRecommendOppId(targetId);
        fetchRecommendations(targetId);
      }
    }
  }, [activeTab, recommendOppId, opportunities]);

  const handleSelectOpportunity = (id) => {
    setSelectedOppId(id);
    fetchApplicants(id);
  };

  const handleOpenReviewModal = (app) => {
    setSelectedApp(app);
    setRecruiterFeedback(app.feedback || '');
    setShowInterviewForm(false);
    setReviewModalOpen(true);
  };

  const handleStatusTransition = async (newStatus, withSchedule = false) => {
    if (!selectedApp) return;

    setTransitioning(true);
    try {
      const payload = {
        status: newStatus,
        feedback: recruiterFeedback
      };

      if (withSchedule || newStatus === 'Interview_Scheduled') {
        payload.interviewSchedule = {
          scheduledDate: interviewDate ? new Date(interviewDate) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          roundName: roundName || 'Round 1: Technical & Samhita Viva',
          meetingLink: meetingLink || 'https://meet.google.com/ayu-shbr-dge',
          locationDetails: meetingRoom || 'Virtual Interview Room (Google Meet)',
          instructions: recruiterFeedback || 'Please keep your BAMS transcripts and clinical log records ready.'
        };
      }

      await updateApplicationStatus(selectedApp._id, payload);
      toastSuccess(`Application updated to: ${newStatus.replace('_', ' ')}`);
      setReviewModalOpen(false);
      setSelectedApp(null);
      setShowInterviewForm(false);
      if (selectedOppId) fetchApplicants(selectedOppId);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update application status';
      toastError(msg);
    } finally {
      setTransitioning(false);
    }
  };

  // Skill toggle in wizard
  const toggleSkill = (skillId) => {
    setSelectedSkillIds(prev =>
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const handlePostOpportunity = async (e) => {
    e.preventDefault();
    if (selectedSkillIds.length === 0) {
      toastInfo('Please select at least 1 required skill competency');
      return;
    }

    setSubmittingPost(true);
    try {
      await createOpportunity({
        title,
        type,
        description,
        location,
        stipendOrSalary: stipend,
        durationMonths: Number(durationMonths),
        openingsCount: Number(openingsCount),
        workplaceType,
        minCgpa: Number(minCgpa),
        eligibleDegrees: ['BAMS', 'BHMS', 'BUMS', 'B.Pharma Ayush', 'MD/MS Ayush'],
        deadline: new Date(deadline).toISOString(),
        requiredSkills: selectedSkillIds
      });

      toastSuccess(`Posting "${title}" successfully published!`);
      setShowPostModal(false);
      setTitle('');
      setDescription('');
      setSelectedSkillIds([]);
      await loadData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error publishing opportunity';
      toastError(msg);
    } finally {
      setSubmittingPost(false);
    }
  };

  const selectedOpp = opportunities.find(o => o._id === selectedOppId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Recruiter Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>Campus Placement & Talent Acquisition Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {profile?.companyName || 'Dabur Ayush Research & Manufacturing Ltd'}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 flex items-center gap-2">
              <span>{profile?.industryType || 'Pharmaceuticals & ASU Healthcare'}</span>
              <span>•</span>
              <span>{profile?.location?.city || 'Ghaziabad'}, {profile?.location?.state || 'Delhi-NCR'}</span>
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setShowPostModal(true)}
            className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Post New Placement Role</span>
          </Button>
        </div>
      </div>

      {/* 2. Top-Level Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('applicants')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'applicants'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Role Applicants Pipeline</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-200">
              {applicants.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('talent-pool')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'talent-pool'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Campus Talent Pool Explorer</span>
            <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-indigo-800 text-indigo-100">
              {talentPool.length || 'Directory'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai-recommendations')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ai-recommendations'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>AI Candidate Recommendations</span>
            <span className="ml-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-100">
              5-Factor
            </span>
          </button>
        </div>
      </div>

      {/* 3. Tab: Role Applicants Pipeline */}
      {activeTab === 'applicants' && (
        <div className="space-y-6">
          
          {/* KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard
              title="Active Postings"
              value={opportunities.length}
              subtitle="Receiving applications"
              icon={Briefcase}
              color="emerald"
            />
            <StatCard
              title="Current Applicants"
              value={applicants.length}
              subtitle="Pre-ranked by Match %"
              icon={Users}
              color="blue"
            />
            <StatCard
              title="In Review / Viva"
              value={applicants.filter(a => ['Under_Review', 'Shortlisted', 'Interview_Scheduled'].includes(a.status)).length}
              subtitle="Active interview stage"
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="Offers / Placed"
              value={applicants.filter(a => ['Offered', 'Accepted'].includes(a.status)).length}
              subtitle="Final selections"
              icon={CheckCircle}
              color="purple"
            />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Tab Header of Opportunities */}
            <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
                  Select Posting:
                </span>
                {opportunities.map((opp) => (
                  <button
                    key={opp._id}
                    onClick={() => handleSelectOpportunity(opp._id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedOppId === opp._id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opp.title} ({opp.type})
                  </button>
                ))}
              </div>

              {selectedOpp && (
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                    {selectedOpp.workplaceType || 'On-site'}
                  </span>
                  <span>Openings: <strong className="text-slate-900">{selectedOpp.openingsCount || 1}</strong></span>
                  <span>CTC: <strong className="text-slate-900">{selectedOpp.stipendOrSalary}</strong></span>
                </div>
              )}
            </div>

            {/* Applicant Shortlisting Table */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg font-display">
                    Candidate Shortlisting (Pre-Ranked by Skill Match %)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Multi-factor benchmark comparing candidate assessment scores with required competencies.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {applicants.length} Candidates Submitted
                </span>
              </div>

              {applicants.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-sm">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-semibold text-slate-600">No applicants received for this role yet.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Applicants matching your required skills will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50/50">
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Degree & College</th>
                        <th className="py-3 px-4">Skill Match %</th>
                        <th className="py-3 px-4">Current Pipeline State</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applicants.map((app) => {
                        const isAccepted = app.status === 'Accepted';
                        const isOffered = app.status === 'Offered';
                        const isInterview = app.status === 'Interview_Scheduled';
                        const isTerminal = ['Rejected', 'Withdrawn'].includes(app.status);

                        return (
                          <tr key={app._id} className="hover:bg-slate-50/70 transition">
                            <td className="py-4 px-4">
                              <p className="font-bold text-slate-900">{app.student?.fullName || 'Ayush Scholar'}</p>
                              <p className="text-xs text-slate-400">{app.student?.user?.email}</p>
                            </td>

                            <td className="py-4 px-4">
                              <span className="font-semibold text-indigo-800 text-xs bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                {app.student?.degree || 'BAMS'}
                              </span>
                              <p className="text-xs text-slate-500 mt-1">
                                {app.student?.institute?.instituteName || 'All India Institute of Ayurveda'} (CGPA: {app.student?.cgpa || 8.4})
                              </p>
                            </td>

                            <td className="py-4 px-4">
                              <span className={`inline-block font-black text-xs px-2.5 py-1 rounded-full border ${
                                app.matchScore >= 80
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border-amber-300'
                              }`}>
                                {app.matchScore}% Match
                              </span>
                            </td>

                            <td className="py-4 px-4">
                              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${
                                isAccepted ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                isOffered ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                isInterview ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                isTerminal ? 'bg-rose-50 text-rose-800 border-rose-200' :
                                'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                {app.status.replace('_', ' ')}
                              </span>
                              {app.interviewSchedule?.scheduledDate && isInterview && (
                                <p className="text-[10px] text-blue-700 font-semibold mt-0.5">
                                  Viva: {new Date(app.interviewSchedule.scheduledDate).toLocaleDateString()}
                                </p>
                              )}
                            </td>

                            <td className="py-4 px-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs font-bold gap-1"
                                onClick={() => handleOpenReviewModal(app)}
                              >
                                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Review & Transition</span>
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Tab: Campus Talent Pool Explorer */}
      {activeTab === 'talent-pool' && (
        <div className="space-y-6">
          
          {/* Talent Pool Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates by name or department..."
                value={talentSearch}
                onChange={(e) => setTalentSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') fetchTalentPoolData(); }}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Degree:</span>
                <select
                  value={talentDegree}
                  onChange={(e) => setTalentDegree(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Degrees</option>
                  <option value="BAMS">BAMS</option>
                  <option value="BHMS">BHMS</option>
                  <option value="BUMS">BUMS</option>
                  <option value="MD/MS Ayush">MD/MS Ayush</option>
                  <option value="B.Pharma Ayush">B.Pharma Ayush</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>Min CGPA:</span>
                <select
                  value={talentMinCgpa}
                  onChange={(e) => setTalentMinCgpa(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Any CGPA</option>
                  <option value="7.0">7.0 +</option>
                  <option value="7.5">7.5 +</option>
                  <option value="8.0">8.0 +</option>
                  <option value="8.5">8.5 +</option>
                </select>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={fetchTalentPoolData}
                className="text-xs bg-indigo-600 hover:bg-indigo-700"
              >
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Talent Pool Grid */}
          {talentLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-500">Searching campus talent pool...</p>
            </div>
          ) : talentPool.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Candidates Match Your Filters</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Try loosening the CGPA threshold or selecting "All Degrees".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {talentPool.map((candidate) => (
                <div
                  key={candidate._id}
                  className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {candidate.degree}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        CGPA: {candidate.cgpa}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 leading-snug mb-1">
                      {candidate.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      {candidate.institute?.instituteName || 'National Institute of Ayurveda'} • Class of {candidate.passingYear}
                    </p>

                    {candidate.targetCareerRole && (
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl mb-3 text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Target Benchmark</span>
                        <p className="font-semibold text-slate-800">{candidate.targetCareerRole.title}</p>
                      </div>
                    )}

                    {/* Competencies */}
                    <div className="space-y-1.5 mb-4">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Verified Competencies ({candidate.skills?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(candidate.skills || []).slice(0, 3).map((sk) => (
                          <span
                            key={sk._id || sk.skill?._id}
                            className="text-[11px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>{sk.skill?.name || 'Skill'}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {candidate.portfolioSlug && (
                      <a
                        href={`/portfolio/${candidate.portfolioSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Portfolio</span>
                      </a>
                    )}

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        toastSuccess(`Direct placement invitation sent to ${candidate.fullName}`);
                      }}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Invite to Apply</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Tab: AI-Ranked Candidate Recommendations (Phase 14) */}
      {activeTab === 'ai-recommendations' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 font-display">
                  Multi-Factor Candidate Matchmaker
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Select an active vacancy to evaluate the candidate talent pool using the 5-factor weighted algorithm.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-600 flex-shrink-0">Posting:</span>
              <select
                value={recommendOppId}
                onChange={(e) => {
                  setRecommendOppId(e.target.value);
                  fetchRecommendations(e.target.value);
                }}
                className="w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
              >
                {opportunities.map((opp) => (
                  <option key={opp._id} value={opp._id}>
                    {opp.title} ({opp.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Model Explanation Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <span>
                <strong>5-Factor Algorithm:</strong> 50% Diagnostic Skills • 20% Academic Degree & CGPA • 15% Career Role • 10% Practical Experience • 5% Location
              </span>
            </div>
            <span className="font-mono font-bold bg-emerald-100 px-2.5 py-1 rounded-lg text-emerald-800 flex-shrink-0">
              {recommendedCandidates.length} Candidates Evaluated
            </span>
          </div>

          {/* Candidates Grid */}
          {loadingRecommendations ? (
            <div className="py-16 text-center text-slate-500">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="font-semibold text-xs">Running multi-factor compatibility evaluation across candidates...</p>
            </div>
          ) : recommendedCandidates.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No matching candidates found for this opportunity criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCandidates.map((cand) => (
                <div
                  key={cand.studentId}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">
                          {cand.fullName}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {cand.degree} • Class of {cand.passingYear} • CGPA {cand.cgpa}
                        </p>
                      </div>
                      <div className="px-2.5 py-1 rounded-xl font-extrabold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {cand.compatibilityScore}% Match
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{cand.institute?.instituteName || 'All India Institute of Ayurveda'}</span>
                    </p>

                    {/* Reasoning Pills */}
                    {cand.matchReasons?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {cand.matchReasons.slice(0, 2).map((reason, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Factor Breakdown */}
                    {cand.factorBreakdown && (
                      <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Skills (50%):</span>
                          <strong className="text-emerald-700">{cand.factorBreakdown.skillScore}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Academic Eligibility (20%):</span>
                          <strong className="text-blue-700">{cand.factorBreakdown.eligibilityScore}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Career Alignment (15%):</span>
                          <strong className="text-indigo-700">{cand.factorBreakdown.careerAlignmentScore}%</strong>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {cand.portfolioSlug && (
                      <a
                        href={`/portfolio/${cand.portfolioSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Verified Dossier</span>
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        toastSuccess(`Direct opportunity invitation dispatched to ${cand.fullName}`);
                      }}
                      className="text-xs"
                    >
                      Invite Candidate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Candidate Review & State Machine Modal */}
      {selectedApp && (
        <Modal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title={`Candidate Review: ${selectedApp.student?.fullName || 'Candidate'}`}
          size="lg"
        >
          <div className="space-y-6">
            
            {/* Candidate Summary */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedApp.student?.fullName}</h4>
                <p className="text-xs text-slate-500">
                  {selectedApp.student?.degree} • {selectedApp.student?.institute?.instituteName} (CGPA: {selectedApp.student?.cgpa || 8.4})
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Email: {selectedApp.student?.user?.email}</p>
              </div>

              {selectedApp.student?.portfolioSlug && (
                <a
                  href={`/portfolio/${selectedApp.student.portfolioSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public Portfolio</span>
                </a>
              )}
            </div>

            {/* Match Score & Skill Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-2">
                  Verified Candidate Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedApp.student?.skills || []).map((sk) => (
                    <span
                      key={sk._id || sk.skill?._id}
                      className="text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{sk.skill?.name || 'Skill'}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-2">
                  Missing Competencies ({selectedApp.missingSkills?.length || 0})
                </span>
                {selectedApp.missingSkills?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApp.missingSkills.map((sk) => (
                      <span
                        key={sk._id || sk}
                        className="text-xs font-medium bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md"
                      >
                        {sk.name || sk}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Candidate fulfills 100% of required competencies!</span>
                  </p>
                )}
              </div>
            </div>

            {/* Inline Interview Scheduling Form */}
            {showInterviewForm ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-blue-600" />
                    <span>Schedule Placement Interview Round</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowInterviewForm(false)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Round Name</label>
                    <input
                      type="text"
                      value={roundName}
                      onChange={(e) => setRoundName(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Meeting Link (Google Meet / Zoom)</label>
                  <input
                    type="text"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStatusTransition('Interview_Scheduled', true)}
                  isLoading={transitioning}
                  className="w-full text-xs bg-blue-600 hover:bg-blue-700 font-bold gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm & Send Interview Invitation</span>
                </Button>
              </div>
            ) : null}

            {/* Recruiter Feedback Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Recruiter Notes & Candidate Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Enter feedback or coordination instructions visible to candidate..."
                value={recruiterFeedback}
                onChange={(e) => setRecruiterFeedback(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>

            {/* State Machine Transition Actions */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                Authorized State Machine Transitions (Current: <strong className="text-slate-900">{selectedApp.status.replace('_', ' ')}</strong>)
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {selectedApp.status === 'Applied' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => handleStatusTransition('Under_Review')}
                      isLoading={transitioning}
                    >
                      Move to Under Review
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleStatusTransition('Shortlisted')}
                      isLoading={transitioning}
                    >
                      Shortlist Candidate
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleStatusTransition('Rejected')}
                      isLoading={transitioning}
                    >
                      Reject
                    </Button>
                  </>
                )}

                {selectedApp.status === 'Under_Review' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleStatusTransition('Shortlisted')}
                      isLoading={transitioning}
                    >
                      Shortlist Candidate
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs bg-blue-600 hover:bg-blue-700 gap-1"
                      onClick={() => setShowInterviewForm(true)}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Schedule Placement Viva</span>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleStatusTransition('Rejected')}
                      isLoading={transitioning}
                    >
                      Reject
                    </Button>
                  </>
                )}

                {selectedApp.status === 'Shortlisted' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs bg-blue-600 hover:bg-blue-700 gap-1"
                      onClick={() => setShowInterviewForm(true)}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Schedule Placement Viva</span>
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleStatusTransition('Offered')}
                      isLoading={transitioning}
                    >
                      Extend Full-Time Offer
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleStatusTransition('Rejected')}
                      isLoading={transitioning}
                    >
                      Reject
                    </Button>
                  </>
                )}

                {selectedApp.status === 'Interview_Scheduled' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleStatusTransition('Offered')}
                      isLoading={transitioning}
                    >
                      Extend Full-Time Offer
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleStatusTransition('Rejected')}
                      isLoading={transitioning}
                    >
                      Reject Candidate
                    </Button>
                  </>
                )}

                {selectedApp.status === 'Offered' && (
                  <>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                      Offer Extended — Waiting for Candidate Acceptance
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleStatusTransition('Accepted')}
                      isLoading={transitioning}
                    >
                      Mark as Accepted & Active
                    </Button>
                  </>
                )}

                {selectedApp.status === 'Accepted' && (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-2 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Candidate Accepted Offer. Successfully Placed!</span>
                  </div>
                )}

                {['Rejected', 'Withdrawn'].includes(selectedApp.status) && (
                  <span className="text-xs text-slate-500 italic">
                    Terminal State: No further transitions permitted for this application.
                  </span>
                )}
              </div>
            </div>

          </div>
        </Modal>
      )}

      {/* 6. Post Placement / Opportunity Wizard Modal */}
      {showPostModal && (
        <Modal
          isOpen={showPostModal}
          onClose={() => setShowPostModal(false)}
          title="Post Placement / Full-Time Industry Role"
          size="lg"
        >
          <form onSubmit={handlePostOpportunity} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Opportunity Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior ASU Quality Control & Schedule T Formulation Chemist"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Role Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Full-time">Full-time Job</option>
                  <option value="Internship">Internship</option>
                  <option value="Clinical Observership">Clinical Observership</option>
                  <option value="Research Fellowship">Research Fellowship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Workplace Setting *
                </label>
                <select
                  value={workplaceType}
                  onChange={(e) => setWorkplaceType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="On-site">On-site Factory/Hospital</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Salary / CTC *
                </label>
                <input
                  type="text"
                  required
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  placeholder="₹6.5 LPA - ₹8.5 LPA"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Openings *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={openingsCount}
                  onChange={(e) => setOpeningsCount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Min CGPA *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="5.0"
                  max="10.0"
                  required
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deadline *
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Required Skills Selection Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Required Competencies ({selectedSkillIds.length} selected) *
                </label>
                <span className="text-[11px] text-slate-400">Click to toggle requirements</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                {allSkills.map((sk) => {
                  const isSelected = selectedSkillIds.includes(sk._id);
                  return (
                    <button
                      type="button"
                      key={sk._id}
                      onClick={() => toggleSkill(sk._id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && '✓ '}
                      {sk.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job Description & Scope of Practice *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Outline day-to-day responsibilities, laboratory testing, clinical trials, and Schedule T duties..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowPostModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                isLoading={submittingPost}
              >
                Publish Job Role
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
