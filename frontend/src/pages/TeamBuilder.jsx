import React, { useState, useEffect } from 'react';
import {
  decomposeProblem,
  generateComplementaryTeam,
  proposeProjectTeam,
  getMyProjectTeams,
  updateTeamMemberStatus
} from '../services/api';
import {
  Sparkles,
  Users,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Award,
  Send,
  Building2,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import SkillBadge from '../components/SkillBadge';

export default function TeamBuilder({ user }) {
  const isIndustry = user?.role === 'industry' || user?.role === 'admin';
  const isStudent = user?.role === 'student';

  // Form State
  const [problemTitle, setProblemTitle] = useState('Smart Medicinal Plant Inventory System');
  const [problemDescription, setProblemDescription] = useState(
    'Design and deploy an end-to-end digital inventory system for authenticated Ayush medicinal plants, tracking raw herb procurement, batch validation, botanical taxonomy, and real-time warehouse stock.'
  );
  const [teamSize, setTeamSize] = useState(4);
  const [durationWeeks, setDurationWeeks] = useState(6);

  // Generation & Result State
  const [loading, setLoading] = useState(false);
  const [proposing, setProposing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedTeam, setGeneratedTeam] = useState(null);
  const [savedTeams, setSavedTeams] = useState([]);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Preset quick problems
  const presets = [
    {
      title: 'Smart Medicinal Plant Inventory System',
      description: 'Design and deploy an end-to-end digital inventory system for authenticated Ayush medicinal plants, tracking raw herb procurement, batch validation, botanical taxonomy, and real-time warehouse stock.',
      duration: 6,
      skills: ['React', 'Node', 'MongoDB', 'Data Analytics']
    },
    {
      title: 'Ayush Hospital EHR & Clinical Trial Sync',
      description: 'Cloud-enabled electronic health record pipeline standardizing patient case histories with WHO ICD-11 / NAMASTE portal coding and clinical trial observational metrics.',
      duration: 8,
      skills: ['React', 'Node', 'MongoDB', 'Ayush Hospital EHR & Informatics']
    },
    {
      title: 'Schedule T GMP Herbal Quality Control Suite',
      description: 'Automated quality assurance system for Ayush pharmaceutical manufacturing, evaluating raw herb batches, HPTLC spectrophotometry reports, and batch release workflows.',
      duration: 6,
      skills: ['React', 'Node', 'QC/QA Herbal Extract Testing', 'Ayush GMP Compliance']
    }
  ];

  const loadTeams = async () => {
    try {
      const res = await getMyProjectTeams();
      setSavedTeams(res.data.data || []);
    } catch (err) {
      console.error('Error fetching project teams:', err);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleSelectPreset = (p) => {
    setProblemTitle(p.title);
    setProblemDescription(p.description);
    setDurationWeeks(p.duration);
  };

  const handleGenerateTeam = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setFeedbackMsg('');
    setCurrentStep(2);

    try {
      const res = await generateComplementaryTeam({
        title: problemTitle,
        problemStatement: problemDescription,
        teamSize,
        durationWeeks
      });
      setGeneratedTeam(res.data.data);
      setCurrentStep(7);
    } catch (err) {
      setFeedbackMsg(err.response?.data?.message || 'Failed to generate team');
    } finally {
      setLoading(false);
    }
  };

  const handleProposeTeam = async () => {
    if (!generatedTeam) return;
    setProposing(true);
    setFeedbackMsg('');

    try {
      await proposeProjectTeam({
        title: generatedTeam.projectTitle,
        problemDescription: generatedTeam.problemDescription,
        category: 'Herbal Inventory & Supply Chain',
        teamSize: generatedTeam.teamSize,
        durationWeeks: generatedTeam.durationWeeks,
        deliverables: generatedTeam.deliverables,
        requiredSkills: generatedTeam.requiredSkills,
        teamMembers: generatedTeam.teamMembers,
        teamCoverageScore: generatedTeam.teamCoverageScore,
        missingSkills: generatedTeam.missingSkills,
        bridgeRecommendations: generatedTeam.bridgeRecommendations
      });
      setFeedbackMsg('🎉 Complementary team proposed and official invitations dispatched to all students!');
      await loadTeams();
    } catch (err) {
      setFeedbackMsg(err.response?.data?.message || 'Failed to propose team');
    } finally {
      setProposing(false);
    }
  };

  const handleStudentMemberStatus = async (teamId, status) => {
    try {
      await updateTeamMemberStatus(teamId, { status });
      setFeedbackMsg(`Successfully marked your invitation as: ${status}`);
      await loadTeams();
    } catch (err) {
      setFeedbackMsg(err.response?.data?.message || 'Failed to update invite status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero / Innovation Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-500/20">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>SIH 2026 Core Innovation • SIH26044</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            AI Complementary Team Formation Engine
          </h1>
          <p className="mt-3 text-emerald-100/80 text-sm sm:text-base leading-relaxed">
            Eliminating the traditional <span className="italic text-white font-bold">"post internship &rarr; receive 500 resumes"</span> bottleneck. Industry recruiters submit an authentic challenge, and our AI constructs a balanced, synergistic 4-member squad across Frontend, Backend, Domain, and Quality Analytics.
          </p>
        </div>
      </div>

      {/* Visual Pipeline Architecture (Direct from user screenshot) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Innovation Pipeline: From Problem to Multidisciplinary Squad
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {[
            { step: '1', title: 'Industry Problem', desc: 'Recruiter challenge' },
            { step: '2', title: 'AI Understands', desc: 'Scope decomposition' },
            { step: '3', title: 'Required Skills', desc: 'Competency set R' },
            { step: '4', title: 'Skill Graph Search', desc: 'Verified talent pool' },
            { step: '5', title: 'Synergy Matching', desc: 'Zero-overlap squad' },
            { step: '6', title: 'Gap Detection', desc: 'Missing skill alerts' },
            { step: '7', title: 'Team Proposed', desc: '1-click invite dispatch' }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border transition-all ${
                currentStep >= idx + 1
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className={`inline-block w-5 h-5 rounded-full text-[10px] leading-5 font-black mb-1 ${
                currentStep >= idx + 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {item.step}
              </span>
              <p className="text-[11px] truncate">{item.title}</p>
              <p className="text-[9px] text-slate-400 hidden sm:block truncate">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Recruiter / Builder Section */}
      {isIndustry && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Problem Submission & Presets */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-emerald-600" />
                <span>Industry Problem Specification</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select a benchmark Ayush problem statement or enter your custom industrial R&D challenge.
              </p>
            </div>

            {/* Benchmark Presets */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Quick Benchmarks (From SIH Prototype)
              </label>
              <div className="space-y-2">
                {presets.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                      problemTitle === p.title
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="truncate font-semibold">{p.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{p.duration} weeks • {p.skills.join(', ')}</p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerateTeam} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Problem Description</label>
                <textarea
                  rows="3"
                  required
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Squad Size</label>
                  <input
                    type="number"
                    min="2"
                    max="6"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    min="2"
                    max="24"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Searching Student Skill Graph...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Form AI Complementary Team</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Generated Complementary Squad & Gap Diagnostics */}
          <div className="lg:col-span-7 space-y-6">
            {!generatedTeam ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
                <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <h3 className="font-bold text-slate-700 text-base">No Squad Formed Yet</h3>
                <p className="text-xs max-w-md mx-auto mt-1">
                  Submit or select an industry problem on the left. The engine will decompose the problem and assemble a complementary team of 4 specialists.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateTeam}
                  className="mt-4 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
                >
                  Quick Demo: Form Squad for "Smart Medicinal Plant Inventory"
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Team Coverage & Synergy Overview Banner */}
                <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-emerald-500/30">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                        AI Assembled Team Proposed
                      </span>
                      <h3 className="text-xl font-extrabold mt-0.5">{generatedTeam.projectTitle}</h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Timeline: {generatedTeam.durationWeeks} weeks • Deliverables: {generatedTeam.deliverables?.join(' + ')}
                      </p>
                    </div>

                    <div className="text-right bg-emerald-900/60 border border-emerald-500/40 rounded-xl px-4 py-2">
                      <p className="text-[10px] uppercase font-semibold text-emerald-300">Team Skill Coverage</p>
                      <p className="text-2xl font-black text-white">{generatedTeam.teamCoverageScore}%</p>
                    </div>
                  </div>

                  {/* Required Skills Chips */}
                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-300">Target Tech Stack & Domain:</span>
                    {generatedTeam.requiredSkills?.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-semibold"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Missing Skill Detection / Bridge Learning */}
                  <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/20 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Skill Gap Diagnostics:</span>
                    </div>
                    {generatedTeam.missingSkills?.length > 0 ? (
                      <p className="text-amber-300">
                        Missing from team: {generatedTeam.missingSkills.join(', ')}
                      </p>
                    ) : (
                      <p className="text-emerald-100 text-[11px]">
                        ✓ All required cross-functional skills (100%) are covered by this synergistic student squad!
                      </p>
                    )}
                    {generatedTeam.bridgeRecommendations?.length > 0 && (
                      <div className="mt-2 text-[10px] text-slate-300">
                        <span className="font-semibold text-emerald-400">Micro-learning Bridges: </span>
                        {generatedTeam.bridgeRecommendations.join(' • ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4-Member Complementary Squad Roster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {generatedTeam.teamMembers?.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-emerald-300 transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Role Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                            {m.assignedRole}
                          </span>
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {m.individualMatchScore}% Fit
                          </span>
                        </div>

                        {/* Candidate Info */}
                        <h4 className="font-bold text-slate-900 text-sm">
                          {m.student?.fullName}
                        </h4>
                        <p className="text-[11px] text-emerald-800 font-semibold">
                          {m.student?.degree} • {m.student?.institute?.instituteName || 'Ayush Institute'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 italic line-clamp-2">
                          "{m.student?.bio}"
                        </p>

                        {/* Matched Competencies */}
                        <div className="mt-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Synergistic Skills
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {m.matchedSkills?.map((sk, skIdx) => (
                              <span
                                key={skIdx}
                                className="text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 font-medium"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Roll: {m.student?.rollNumber}</span>
                        <span className="font-semibold text-emerald-700">Ready to Assign</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Propose Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleGenerateTeam}
                    disabled={loading}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
                  >
                    Regenerate Squad
                  </button>
                  <button
                    type="button"
                    onClick={handleProposeTeam}
                    disabled={proposing}
                    className="px-6 py-2.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{proposing ? 'Dispatching Invites...' : 'Propose & Dispatch Team Invitations'}</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      )}

      {/* Active / Proposed Project Teams Showcase (Visible to both Students & Recruiters) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-700" />
              <span>{isStudent ? 'My Multidisciplinary Project Teams' : 'Active & Proposed Project Teams'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isStudent
                ? 'Review capstones and team invitations where your verified skills were synergized by AI.'
                : 'Manage cross-functional student teams assembled for company challenges.'}
            </p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-bold border border-emerald-200">
            {savedTeams.length} Teams
          </span>
        </div>

        {savedTeams.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No active project teams recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {savedTeams.map((team) => (
              <div
                key={team._id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{team.title}</h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        team.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {team.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{team.problemDescription}</p>
                    <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                      Organization: {team.industry?.companyName || 'Ayush Industry Partner'} • {team.durationWeeks} Weeks
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Team Coverage: {team.teamCoverageScore}%
                    </span>
                  </div>
                </div>

                {/* Team Roster Mini Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200">
                  {team.teamMembers?.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs"
                    >
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider truncate">
                        {m.assignedRole}
                      </p>
                      <p className="font-bold text-slate-900 truncate">
                        {m.student?.fullName || 'Scholar'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {m.student?.institute?.instituteName || 'College'}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px]">
                        <span className="font-semibold text-slate-600">Fit: {m.individualMatchScore}%</span>
                        <span className={`font-bold px-1.5 py-0.2 rounded ${
                          m.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Student Acceptance Action */}
                {isStudent && (
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">
                      Invited as Team Specialist for this industry challenge
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStudentMemberStatus(team._id, 'Accepted')}
                        className="px-3 py-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition"
                      >
                        Accept Team Invite
                      </button>
                      <button
                        onClick={() => handleStudentMemberStatus(team._id, 'Declined')}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
