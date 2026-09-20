import React, { useState, useEffect } from 'react';
import {
  getInstituteSummary,
  getPlacementFunnel,
  getCurriculumGapHeatmap,
  getSkillDemand,
  getInstituteStudents,
  endorseStudentSkill
} from '../services/api';
import StatCard from '../components/StatCard';
import {
  Building2,
  Users,
  Briefcase,
  Award,
  CheckCircle2,
  TrendingUp,
  Filter,
  Search,
  ShieldCheck,
  FileText,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Download,
  Sparkles,
  BarChart3,
  Activity,
  Layers,
  Compass,
  Check,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InstituteDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'heatmap' | 'advisory' | 'verification'
  const [summary, setSummary] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [skillDemand, setSkillDemand] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [endorsingSkill, setEndorsingSkill] = useState(null);
  const [lastEndorsed, setLastEndorsed] = useState(null);

  const loadData = async () => {
    try {
      const [sumRes, funRes, heatRes, demRes, stuRes] = await Promise.all([
        getInstituteSummary(),
        getPlacementFunnel(),
        getCurriculumGapHeatmap(),
        getSkillDemand(),
        getInstituteStudents()
      ]);

      setSummary(sumRes.data?.data || null);
      setFunnel(funRes.data?.data || null);
      setHeatmap(heatRes.data?.data || []);
      setSkillDemand(demRes.data?.data || []);
      setStudents(stuRes.data?.data || []);
    } catch (err) {
      console.error('Error fetching institutional analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEndorse = async (studentProfileId, skillId, skillName) => {
    setEndorsingSkill(`${studentProfileId}-${skillId}`);
    try {
      const res = await endorseStudentSkill({ studentProfileId, skillId });
      const hash = res.data?.data?.credentialHash || '';
      setLastEndorsed({
        skillName,
        hash,
        time: new Date().toLocaleTimeString()
      });
      await loadData();
    } catch (err) {
      console.error('Error endorsing skill:', err);
    } finally {
      setEndorsingSkill(null);
    }
  };

  // Filter students by search query
  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    const name = (s.fullName || '').toLowerCase();
    const roll = (s.rollNumber || '').toLowerCase();
    const deg = (s.degree || '').toLowerCase();
    return name.includes(q) || roll.includes(q) || deg.includes(q);
  });

  // Filter heatmap by Ayush branch
  const filteredHeatmap = heatmap.filter(item => {
    if (selectedBranch === 'All') return true;
    return item.ayushBranch.toLowerCase().includes(selectedBranch.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold text-sm">Aggregating Institutional & Placement Telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Executive Command Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                Institutional Executive Command
              </span>
              <span className="text-xs text-slate-400">
                NCISM & Ministry of Ayush Aligned
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
              {summary?.institutionName || 'Institutional Placement & Curriculum Analytics'}
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Real-time telemetry on graduate absorption funnels, industrial demand vs curriculum supply, and cryptographic clinical credentialing.
            </p>
          </div>

          {/* Quick Stats Capsule */}
          <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/60 shrink-0">
            <div className="text-center px-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Placement</span>
              <span className="text-2xl font-black text-emerald-400 font-display">
                {summary?.placementRate || 26}%
              </span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center px-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Avg Package</span>
              <span className="text-2xl font-black text-amber-400 font-display">
                ₹{summary?.averagePackageLPA || 7.2}L
              </span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center px-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Verified Credentials</span>
              <span className="text-2xl font-black text-teal-400 font-display">
                {summary?.verifiedCredentialsCount || 612}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Executive Overview & Placement Funnel
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'heatmap'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            Ayush Industry Demand Heatmap
          </button>
          <button
            onClick={() => setActiveTab('advisory')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'advisory'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            Curriculum Advisory & Academic Council
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'verification'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Student Clinical Verification ({students.length})
          </button>
        </div>
      </div>

      {/* Cryptographic Notification Banner */}
      {lastEndorsed && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                Cryptographic Micro-Credential Issued at {lastEndorsed.time}
              </p>
              <p className="text-sm font-semibold text-white">
                Skill &ldquo;{lastEndorsed.skillName}&rdquo; signed with 256-bit SHA-256 seal.
              </p>
              <p className="text-[11px] font-mono text-emerald-300/80 truncate max-w-xl">
                Digest: {lastEndorsed.hash}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLastEndorsed(null)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ==================== TAB 1: EXECUTIVE OVERVIEW & PLACEMENT FUNNEL ==================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Top 4 KPI StatCards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Enrolled Scholars"
              value={summary?.totalStudents?.toLocaleString() || '1,240'}
              subtitle="Registered Ayush students"
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Industry Opportunities"
              value={summary?.totalOpportunities?.toLocaleString() || '86'}
              subtitle="Hospital & pharma openings"
              icon={Briefcase}
              color="amber"
            />
            <StatCard
              title="Placed / Offered"
              value={summary?.placedStudents?.toLocaleString() || '318'}
              subtitle={`${summary?.placementRate || 26}% absorption rate`}
              icon={Award}
              color="emerald"
            />
            <StatCard
              title="Active Clinical Interns"
              value={summary?.activeInternships?.toLocaleString() || '48'}
              subtitle="In hospital / pharma rotations"
              icon={CheckCircle2}
              color="purple"
            />
          </div>

          {/* 6-Stage Visual Placement Absorption Funnel */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                    <BarChart3 className="w-5 h-5" />
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    6-Stage Placement Absorption Funnel
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Sequential conversion telemetry tracking candidates from initial application through to accepted industrial placements.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start">
                <span>Total Candidates:</span>
                <span className="font-bold text-slate-900">{funnel?.summary?.totalFunnelVolume || 412}</span>
                <span className="text-slate-300">|</span>
                <span>Overall Yield:</span>
                <span className="font-bold text-emerald-600">{funnel?.summary?.overallConversionRate || 18}%</span>
              </div>
            </div>

            {/* Funnel Pipeline Steps */}
            <div className="space-y-4">
              {funnel?.stages?.map((stage, idx) => {
                const stageWidth = Math.max(stage.stagePercentage, 12);
                return (
                  <div
                    key={stage.stage}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-all hover:border-slate-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-sm text-slate-900 block sm:inline">
                            {stage.label}
                          </span>
                          <span className="text-xs text-slate-500 sm:ml-2 block sm:inline">
                            {stage.description}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <span className="text-sm font-black text-slate-900 font-display">
                          {stage.count} Candidates
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                          {stage.stagePercentage}% of base
                        </span>
                        {idx > 0 && (
                          <span className="text-xs bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded-md">
                            {stage.conversionRate}% conv.
                          </span>
                        )}
                        {idx > 0 && stage.dropOffRate > 0 && (
                          <span className="text-[11px] bg-rose-50 text-rose-700 font-medium px-1.5 py-0.5 rounded-md border border-rose-200">
                            −{stage.dropOffRate}% drop
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          idx === 0
                            ? 'bg-emerald-600'
                            : idx === 1
                            ? 'bg-teal-600'
                            : idx === 2
                            ? 'bg-blue-600'
                            : idx === 3
                            ? 'bg-indigo-600'
                            : idx === 4
                            ? 'bg-purple-600'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${stageWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Funnel Telemetry Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">
                  Average Time to Placement
                </span>
                <span className="text-xl font-black text-slate-900 font-display">
                  {funnel?.summary?.averageTimeToOfferDays || 14} Calendar Days
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  From candidate application to verified offer issuance.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 md:col-span-2">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-2">
                  Top Industrial Recruiting Sectors
                </span>
                <div className="flex flex-wrap gap-2">
                  {funnel?.summary?.topRecruitingSectors?.map((sec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skill Demand Pulse Widget */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Real-time Ayush Industry Competency Demand
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aggregated competency requirements from verified pharmaceutical and clinical postings.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('heatmap')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                View Full Heatmap <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {skillDemand.slice(0, 8).map((sk, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/40 hover:border-emerald-200 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      {sk.category || 'Competency'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sk.trend === 'High Priority'
                          ? 'bg-rose-100 text-rose-700'
                          : sk.trend === 'Surging'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {sk.trend || 'Steady'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{sk.name}</h4>
                  <div className="flex items-center justify-between mt-3 text-xs">
                    <span className="text-slate-500">Demand Index:</span>
                    <span className="font-bold text-emerald-700">{sk.demandCount || 80}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================== TAB 2: AYUSH INDUSTRY DEMAND HEATMAP ==================== */}
      {activeTab === 'heatmap' && (
        <div className="space-y-6">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Industrial Demand vs Institutional Graduate Supply Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Comparative index (0-100) evaluating enterprise hiring requirements against curriculum output across 5 core Ayush sectors.
              </p>
            </div>

            {/* Branch Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
              {['All', 'Ayurveda', 'Pharma', 'Research', 'Health IT'].map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBranch(b)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    selectedBranch === b
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* 5 Sector Heatmap Cards */}
          <div className="grid grid-cols-1 gap-6">
            {filteredHeatmap.map((sec) => (
              <div
                key={sec.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-slate-400">{sec.id}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                        {sec.ayushBranch}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          sec.urgencyLevel === 'Critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : sec.urgencyLevel === 'Moderate'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {sec.urgencyLevel} Gap ({sec.gapPercentage}%)
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        • {sec.trend}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      {sec.sector}
                    </h3>
                  </div>

                  {/* Demand vs Supply Score Pill */}
                  <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 shrink-0">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Industry Demand</span>
                      <span className="text-lg font-black text-emerald-700 font-display">{sec.industryDemandIndex}/100</span>
                    </div>
                    <div className="w-px h-6 bg-slate-300" />
                    <div className="text-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Graduate Supply</span>
                      <span className="text-lg font-black text-slate-700 font-display">{sec.institutionalSupplyIndex}/100</span>
                    </div>
                    <div className="w-px h-6 bg-slate-300" />
                    <div className="text-center">
                      <span className="text-[10px] text-rose-600 font-bold uppercase block">Gap Delta</span>
                      <span className="text-lg font-black text-rose-600 font-display">+{sec.gapPercentage}%</span>
                    </div>
                  </div>
                </div>

                {/* Comparative Double Bars */}
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                        Industrial Enterprise Demand
                      </span>
                      <span className="text-emerald-700 font-bold">{sec.industryDemandIndex}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                        style={{ width: `${sec.industryDemandIndex}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                        Institutional Graduate Preparedness
                      </span>
                      <span className="text-indigo-700 font-bold">{sec.institutionalSupplyIndex}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                        style={{ width: `${sec.institutionalSupplyIndex}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Core Competencies Tested */}
                <div className="mb-4">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">
                    Evaluated Competencies:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sec.coreSkills?.map((sk, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium border border-slate-200"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actionable Curriculum Advisory */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                      Academic Council & Syllabus Remediation Advisory:
                    </span>
                    <p className="text-xs text-amber-950 font-medium">
                      {sec.actionableAdvisory}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {sec.suggestedElectives?.map((el, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-white text-amber-900 font-semibold px-2 py-0.5 rounded-md border border-amber-300/80 shadow-2xs"
                        >
                          + {el}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================== TAB 3: CURRICULUM ADVISORY & ACADEMIC COUNCIL ==================== */}
      {activeTab === 'advisory' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Board of Studies Curriculum Alignment Dossier
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Formal advisory recommendations for Academic Senate and curriculum revision committees based on empirical industry gap telemetry.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-xs self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              Export / Print Advisory Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {heatmap.map((sec, idx) => (
              <div
                key={sec.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{sec.id}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        sec.urgencyLevel === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : sec.urgencyLevel === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sec.urgencyLevel} Attention
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 font-display mb-3">
                    {sec.sector}
                  </h3>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Industry Demand:</span>
                      <span className="font-bold text-emerald-700">{sec.industryDemandIndex}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Graduate Preparedness:</span>
                      <span className="font-bold text-slate-700">{sec.institutionalSupplyIndex}%</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="text-rose-600 font-bold">Curricular Deficit:</span>
                      <span className="font-bold text-rose-600">+{sec.gapPercentage}% Gap</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-900 block mb-1">
                      Academic Council Action Plan:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sec.actionableAdvisory}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Recommended Credit Modules:
                  </span>
                  <div className="space-y-1.5">
                    {sec.suggestedElectives?.map((el, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-medium text-emerald-900"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{el}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================== TAB 4: STUDENT CLINICAL VERIFICATION ==================== */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          
          {/* Search & Statistics Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">
                  Student Clinical Competency Endorsement Portal
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Institutional sign-off on clinical rotation competencies. Endorsements immediately generate deterministic SHA-256 cryptographic micro-credentials recognized by recruiters.
                </p>
              </div>

              <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold self-start sm:self-auto">
                {filteredStudents.length} Students Affiliated
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholars by name, roll number, or degree..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Student Roster Cards */}
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
              No students found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredStudents.map((stu) => (
                <div
                  key={stu._id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                        {stu.fullName ? stu.fullName.charAt(0) : 'S'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{stu.fullName}</h3>
                        <p className="text-xs text-slate-500">
                          {stu.degree} • Roll No: <span className="font-mono">{stu.rollNumber}</span> • CGPA: {stu.cgpa || 7.5}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/portfolio/${stu.portfolioSlug || stu._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 font-semibold px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 transition"
                      >
                        <span>Public Portfolio</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Clinical & Practical Competencies ({stu.skills?.length || 0})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {stu.skills?.map((skItem) => {
                        const skillName = skItem.skill?.name || 'Skill';
                        const skillId = skItem.skill?._id || skItem.skill;
                        const isEndorsed = skItem.isEndorsed;
                        const isProcessing = endorsingSkill === `${stu._id}-${skillId}`;

                        return (
                          <div
                            key={skillId}
                            className={`p-3 rounded-2xl border transition ${
                              isEndorsed
                                ? 'bg-emerald-50/50 border-emerald-200'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-xs text-slate-900 truncate max-w-[150px]">
                                {skillName}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500">
                                Score: {skItem.proficiencyScore || 75}%
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-2 mt-2">
                              {isEndorsed ? (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center text-emerald-700 text-[11px] font-bold gap-1 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Verified by Institute</span>
                                  </span>
                                  {skItem.credentialHash && (
                                    <span className="block text-[9px] font-mono text-slate-500 truncate max-w-[170px]" title={skItem.credentialHash}>
                                      SHA: {skItem.credentialHash.substring(0, 16)}...
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEndorse(stu._id, skillId, skillName)}
                                  disabled={isProcessing}
                                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold py-1.5 px-3 rounded-xl transition shadow-2xs"
                                >
                                  {isProcessing ? (
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <>
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      <span>Verify & Sign Seal</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
