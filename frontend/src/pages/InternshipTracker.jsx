import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getMyInternshipProgress,
  submitWeeklyLog,
  getIndustryInterns,
  evaluateWeeklyLog,
  completeInternship
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  Briefcase,
  Building2,
  User,
  Star,
  FileText,
  ShieldCheck,
  Send,
  ChevronRight,
  Sparkles,
  Download,
  ExternalLink,
  PlusCircle,
  RefreshCw,
  TrendingUp,
  MapPin,
  Calendar,
  Check,
  ArrowRight
} from 'lucide-react';

export default function InternshipTracker() {
  const { user } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();
  const navigate = useNavigate();

  const isIndustry = user?.role === 'industry';
  const isStudent = user?.role === 'student';

  // Student states
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'submit' | 'certificate'

  // Weekly submission form state
  const [submitting, setSubmitting] = useState(false);
  const [weekNumber, setWeekNumber] = useState(1);
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [hoursWorked, setHoursWorked] = useState(40);
  const [studentReflections, setStudentReflections] = useState('');

  // Industry states
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalWeek, setEvalWeek] = useState(null);
  const [mentorFeedback, setMentorFeedback] = useState('');
  const [mentorRating, setMentorRating] = useState(5);
  const [evalStatus, setEvalStatus] = useState('Approved');
  const [evaluating, setEvaluating] = useState(false);

  // Final Completion Modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completionTarget, setCompletionTarget] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [finalRemarks, setFinalRemarks] = useState('');
  const [technicalScore, setTechnicalScore] = useState(5);
  const [teamworkScore, setTeamworkScore] = useState(5);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isIndustry) {
        const res = await getIndustryInterns();
        const internList = res.data?.data || res.data || [];
        setInterns(internList);
        if (internList.length > 0 && !selectedIntern) {
          setSelectedIntern(internList[0]);
        }
      } else {
        const res = await getMyInternshipProgress();
        const progData = res.data?.data || res.data || null;
        setProgress(progData);
        if (progData?.weeklyLogs?.length) {
          setWeekNumber(progData.weeklyLogs.length + 1);
        }
      }
    } catch (err) {
      if (err.response?.data?.code === 'NO_ACTIVE_INTERNSHIP') {
        setProgress(null);
      } else {
        console.error('Error loading internship tracking data:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit Milestone (Student)
  const handleSubmitMilestone = async (e) => {
    e.preventDefault();
    if (!tasksCompleted.trim()) {
      toastError('Please specify the key tasks and deliverables completed.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        weekNumber: Number(weekNumber),
        tasksCompleted: tasksCompleted.trim(),
        hoursWorked: Number(hoursWorked) || 40,
        studentReflections: studentReflections.trim()
      };
      const res = await submitWeeklyLog(payload);
      toastSuccess(`🎉 Week ${weekNumber} milestone log submitted for mentor review!`);
      setProgress(res.data?.data || res.data);
      setTasksCompleted('');
      setStudentReflections('');
      setWeekNumber(Number(weekNumber) + 1);
      setActiveTab('milestones');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to submit weekly log');
    } finally {
      setSubmitting(false);
    }
  };

  // Evaluate Milestone (Industry)
  const handleSaveEvaluation = async () => {
    if (!selectedIntern || !evalWeek) return;
    setEvaluating(true);
    try {
      const res = await evaluateWeeklyLog(selectedIntern._id, evalWeek, {
        mentorFeedback,
        mentorRating: Number(mentorRating),
        status: evalStatus
      });
      toastSuccess(`Week ${evalWeek} log evaluated successfully!`);
      setEvalModalOpen(false);
      // Update local state
      const updated = res.data?.data || res.data;
      setInterns((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      setSelectedIntern(updated);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to evaluate milestone');
    } finally {
      setEvaluating(false);
    }
  };

  // Conclude Internship & Issue Certificate (Industry)
  const handleConfirmCompletion = async () => {
    if (!completionTarget) return;
    setCompleting(true);
    try {
      const res = await completeInternship(completionTarget._id, {
        finalRemarks: finalRemarks || 'Successfully completed internship with distinction.',
        technicalScore: Number(technicalScore),
        teamworkScore: Number(teamworkScore)
      });
      toastSuccess('🎉 Internship concluded & tamper-proof cryptographic certificate issued!');
      setCompleteModalOpen(false);
      const updated = res.data?.data || res.data;
      setInterns((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      setSelectedIntern(updated);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to complete internship');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading Internship Tracker...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // INDUSTRY SUPERVISOR VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (isIndustry) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/60 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/30">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Supervisor Internship Management</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mb-2">
              Active Interns & Milestone Tracking
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Supervise student deliverables, conduct weekly viva evaluations, grade milestone logs, and issue
              W3C-compliant SHA-256 completion credentials.
            </p>
          </div>
        </div>

        {interns.length === 0 ? (
          <Card className="p-12 text-center">
            <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Active Interns Currently</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              When candidates accept your internship offers, their milestone trackers will automatically appear here.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => navigate('/industry')}
            >
              Go to Candidate Applications
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Interns List */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Active Interns ({interns.length})
              </h2>
              {interns.map((intern) => {
                const isSelected = selectedIntern?._id === intern._id;
                const studentName = intern.student?.fullName || 'Student Intern';
                const oppTitle = intern.opportunity?.title || 'Ayush Internship';
                const completedWeeks = intern.weeklyLogs?.filter((l) => l.status === 'Approved').length || 0;

                return (
                  <div
                    key={intern._id}
                    onClick={() => setSelectedIntern(intern)}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{studentName}</h4>
                        <p className="text-xs text-slate-500 font-medium truncate max-w-[180px]">{oppTitle}</p>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          intern.completionStatus === 'Completed'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {intern.completionStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
                      <span>{completedWeeks} Weeks Approved</span>
                      <span>Started {new Date(intern.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Intern Details & Milestones */}
            <div className="lg:col-span-2 space-y-6">
              {selectedIntern && (
                <>
                  <Card className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {selectedIntern.opportunity?.type || 'Internship'}
                          </span>
                          <span className="text-xs text-slate-400">
                            Roll: {selectedIntern.student?.rollNumber || 'AYUSH-2026'}
                          </span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900">
                          {selectedIntern.student?.fullName || 'Student Intern'}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                          {selectedIntern.opportunity?.title} • Mentor: {selectedIntern.mentor?.name || 'Dr. Anand Verma'}
                        </p>
                      </div>

                      {selectedIntern.completionStatus !== 'Completed' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-xs gap-1.5 shadow-md"
                          onClick={() => {
                            setCompletionTarget(selectedIntern);
                            setCompleteModalOpen(true);
                          }}
                        >
                          <Award className="w-4 h-4" />
                          <span>Conclude & Issue Certificate</span>
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 bg-purple-50 text-purple-800 px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-bold">
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span>Certificate Issued ({selectedIntern.certificate?.certificateId})</span>
                        </div>
                      )}
                    </div>

                    {/* Weekly Logs List */}
                    <div className="mt-6 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Milestone Progress Submissions
                      </h3>

                      {selectedIntern.weeklyLogs?.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-xs">
                          No milestone logs submitted by student yet.
                        </div>
                      ) : (
                        selectedIntern.weeklyLogs.map((log) => (
                          <div
                            key={log.weekNumber}
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-slate-900">
                                  Week {log.weekNumber}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    log.status === 'Approved'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : log.status === 'Needs_Revision'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {log.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500 font-medium">
                                  {log.hoursWorked} hrs logged
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs py-1 px-2.5 h-auto"
                                  onClick={() => {
                                    setEvalWeek(log.weekNumber);
                                    setMentorFeedback(log.mentorFeedback || '');
                                    setMentorRating(log.mentorRating || 5);
                                    setEvalStatus(log.status || 'Approved');
                                    setEvalModalOpen(true);
                                  }}
                                >
                                  Evaluate
                                </Button>
                              </div>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed font-medium">
                              <strong className="text-slate-900">Tasks:</strong> {log.tasksCompleted}
                            </p>

                            {log.studentReflections && (
                              <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200/60">
                                "{log.studentReflections}"
                              </p>
                            )}

                            {log.mentorFeedback && (
                              <div className="mt-2 pt-2 border-t border-slate-200/70 text-xs text-emerald-900 flex items-center justify-between">
                                <span><strong>Supervisor Note:</strong> {log.mentorFeedback}</span>
                                <span className="font-bold flex items-center gap-1 text-amber-600">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  {log.mentorRating}/5
                                </span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        )}

        {/* Milestone Evaluation Modal */}
        <Modal
          isOpen={evalModalOpen}
          onClose={() => setEvalModalOpen(false)}
          title={`Evaluate Milestone (Week ${evalWeek})`}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Evaluation Decision
              </label>
              <select
                value={evalStatus}
                onChange={(e) => setEvalStatus(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Approved">Approved (Meets Industry Rigor)</option>
                <option value="Reviewed">Reviewed (Satisfactory)</option>
                <option value="Needs_Revision">Needs Revision (Deficient Deliverables)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Performance Rating (1 - 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setMentorRating(star)}
                    className="p-1.5 focus:outline-none hover:scale-110 transition"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= mentorRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">{mentorRating} / 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Supervisor Feedback & Remarks
              </label>
              <textarea
                rows={3}
                value={mentorFeedback}
                onChange={(e) => setMentorFeedback(e.target.value)}
                placeholder="Specific guidance regarding Good Manufacturing Practice, data accuracy, lab protocols..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEvalModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSaveEvaluation}
                isLoading={evaluating}
              >
                Submit Evaluation
              </Button>
            </div>
          </div>
        </Modal>

        {/* Complete Internship Modal */}
        <Modal
          isOpen={completeModalOpen}
          onClose={() => setCompleteModalOpen(false)}
          title="Conclude Internship & Issue W3C Certificate"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              This will officially close the internship tenure for{' '}
              <span className="font-bold text-slate-900">
                {completionTarget?.student?.fullName}
              </span>
              , calculate cumulative competency scores, and generate an immutable SHA-256 signed digital certificate.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Technical Score (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={technicalScore}
                  onChange={(e) => setTechnicalScore(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Teamwork Score (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={teamworkScore}
                  onChange={(e) => setTeamworkScore(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Final Assessment Citation / Remarks
              </label>
              <textarea
                rows={3}
                value={finalRemarks}
                onChange={(e) => setFinalRemarks(e.target.value)}
                placeholder="e.g. Demonstrated exemplary acumen in Ayush standard formulations and QA protocols..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setCompleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleConfirmCompletion}
                isLoading={completing}
              >
                Issue Verifiable Certificate
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STUDENT VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (!progress) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Card className="p-12 text-center border-slate-200">
          <CalendarCheck className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 font-display">
            No Active Internship Tracking Found
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            Internship tracking activates automatically once you receive and accept an official internship offer from an
            Ayush industry recruiter.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Button
              variant="primary"
              size="md"
              className="bg-emerald-600 hover:bg-emerald-700 text-xs gap-2"
              onClick={() => navigate('/applications')}
            >
              <FileText className="w-4 h-4" />
              <span>Check My Applications</span>
            </Button>
            <Button
              variant="outline"
              size="md"
              className="text-xs gap-2"
              onClick={() => navigate('/opportunities')}
            >
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span>Explore Opportunities</span>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const logs = progress.weeklyLogs || [];
  const approvedCount = logs.filter((l) => l.status === 'Approved').length;
  const totalHours = logs.reduce((acc, curr) => acc + (curr.hoursWorked || 0), 0);
  const isCompleted = progress.completionStatus === 'Completed';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/30">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Industrial Tenure Milestone Tracker</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display mb-2 text-white">
            {progress.opportunity?.title || 'Ayush Quality Officer Internship'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium flex items-center gap-2 mb-6">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>{progress.industry?.companyName || 'Dabur Ayush Research & Manufacturing Ltd'}</span>
            <span>•</span>
            <User className="w-4 h-4 text-emerald-400" />
            <span>Mentor: {progress.mentor?.name || 'Dr. Anand Verma'} ({progress.mentor?.designation || 'Lead QC Supervisor'})</span>
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-white font-display">{logs.length}</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Logs Submitted</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-emerald-400 font-display">{approvedCount}</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Approved Milestones</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-indigo-400 font-display">{totalHours}h</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Total Hours Logged</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-amber-300 font-display">
                {isCompleted ? '100%' : `${Math.min(100, approvedCount * 25)}%`}
              </span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Tenure Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'milestones'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Weekly Milestones ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('submit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'submit'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Submit Milestone Log</span>
        </button>
        <button
          onClick={() => setActiveTab('certificate')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'certificate'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Completion Certificate</span>
        </button>
      </div>

      {/* Tab 1: Milestones List */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {logs.length === 0 ? (
            <Card className="p-8 text-center">
              <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800">No Weekly Logs Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Submit your first week's summary using the "Submit Milestone Log" tab.
              </p>
            </Card>
          ) : (
            logs.map((log) => (
              <Card key={log.weekNumber} className="p-6 border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">
                      W{log.weekNumber}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Week {log.weekNumber} Deliverable Report
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {log.hoursWorked} Hours
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        log.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : log.status === 'Needs_Revision'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Tasks & Deliverables Completed
                  </h4>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    {log.tasksCompleted}
                  </p>
                </div>

                {log.studentReflections && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Reflections & Key Learnings
                    </h4>
                    <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200/60">
                      "{log.studentReflections}"
                    </p>
                  </div>
                )}

                {log.mentorFeedback && (
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Supervisor Evaluation (Dr. Anand Verma)
                      </span>
                      {log.mentorRating && (
                        <span className="text-xs font-extrabold text-amber-600 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {log.mentorRating} / 5 Stars
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-900 font-medium italic">
                      "{log.mentorFeedback}"
                    </p>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Submit Weekly Log Form */}
      {activeTab === 'submit' && (
        <Card className="p-6 sm:p-8 max-w-2xl border-slate-200">
          <div className="mb-6">
            <h2 className="text-lg font-black text-slate-900 font-display">
              Submit Weekly Milestone Log
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Document your tasks, hours, and practical learnings for continuous supervisor accreditation.
            </p>
          </div>

          <form onSubmit={handleSubmitMilestone} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Week Number
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hours Worked
                </label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tasks & Experiments Completed <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={tasksCompleted}
                onChange={(e) => setTasksCompleted(e.target.value)}
                placeholder="e.g. Performed TLC testing on Withania somnifera batches; assisted senior chemist in HPLC column calibration..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Personal Reflections & Industry Learnings (Optional)
              </label>
              <textarea
                rows={3}
                value={studentReflections}
                onChange={(e) => setStudentReflections(e.target.value)}
                placeholder="What did you learn about Good Laboratory Practice (GLP) or industrial scale formulation?"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('milestones')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 gap-1.5 text-xs"
                isLoading={submitting}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Weekly Milestone</span>
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 3: Cryptographic Certificate */}
      {activeTab === 'certificate' && (
        <Card className="p-8 max-w-3xl mx-auto border-slate-200 text-center">
          {progress.certificate?.issued ? (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wider">
                  Verifiable Cryptographic Credential
                </span>
                <h2 className="text-2xl font-black text-slate-900 font-display mt-3">
                  Certificate of Internship Completion
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Accredited by Ministry of Ayush Academia-Industry Collaborative Framework (SIH26044).
                </p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-3 font-mono text-xs text-slate-700">
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-400 font-sans font-semibold">Certificate ID:</span>
                  <span className="font-bold text-slate-900">{progress.certificate.certificateId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-400 font-sans font-semibold">Issued Date:</span>
                  <span>{new Date(progress.certificate.issueDate || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/70 pb-2">
                  <span className="text-slate-400 font-sans font-semibold">Overall Score:</span>
                  <span className="font-bold text-emerald-700">
                    {progress.finalEvaluation?.overallScorePercentage || 95}% Distinction
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans font-semibold block mb-1">SHA-256 Ledger Hash:</span>
                  <p className="text-[11px] text-slate-500 break-all bg-white p-2 rounded-lg border border-slate-200">
                    {progress.certificate.certificateHash}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 gap-1.5 text-xs"
                  onClick={() => navigate('/portfolio')}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>View in Digital Portfolio</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-8">
              <ShieldCheck className="w-14 h-14 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Certificate Pending Tenure Completion</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Your industry supervisor will issue your tamper-proof SHA-256 digital certificate upon final review of your
                scheduled milestones.
              </p>
              <div className="w-48 bg-slate-100 rounded-full h-2.5 mx-auto overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, approvedCount * 25)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {approvedCount} of 4 minimum milestone logs approved
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
