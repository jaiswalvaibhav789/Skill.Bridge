import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getStudentApplications,
  withdrawApplication,
  acceptApplicationOffer
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import {
  GraduationCap,
  Building2,
  MapPin,
  Calendar,
  Banknote,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileCheck2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Send,
  ExternalLink
} from 'lucide-react';

export default function StudentApplications() {
  const { user } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Active' | 'Offered' | 'Terminal'
  const [processingId, setProcessingId] = useState(null);

  // Withdrawal Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedAppToWithdraw, setSelectedAppToWithdraw] = useState(null);
  const [withdrawReason, setWithdrawReason] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getStudentApplications();
      setApplications(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Error fetching student applications:', err);
      toastError('Failed to load application history');
    } finally {
      setLoading(false);
    }
  };

  // Handle Accept Offer
  const handleAcceptOffer = async (appId) => {
    setProcessingId(appId);
    try {
      await acceptApplicationOffer(appId);
      toastSuccess('🎉 Congratulations! Offer accepted. Internship tracking is now active.');
      await fetchApplications();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to accept offer';
      toastError(msg);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Withdraw
  const handleConfirmWithdraw = async () => {
    if (!selectedAppToWithdraw) return;

    setProcessingId(selectedAppToWithdraw._id);
    try {
      await withdrawApplication(selectedAppToWithdraw._id, withdrawReason || 'Withdrawn by student');
      toastSuccess('Application successfully withdrawn');
      setWithdrawModalOpen(false);
      setSelectedAppToWithdraw(null);
      setWithdrawReason('');
      await fetchApplications();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to withdraw application';
      toastError(msg);
    } finally {
      setProcessingId(null);
    }
  };

  // Status mapping for pipeline stepper
  const STEPS = [
    { key: 'Applied', label: 'Applied' },
    { key: 'Under_Review', label: 'Under Review' },
    { key: 'Shortlisted', label: 'Shortlisted' },
    { key: 'Interview_Scheduled', label: 'Interview' },
    { key: 'Offered', label: 'Offered' },
    { key: 'Accepted', label: 'Accepted' }
  ];

  const getStepIndex = (status) => {
    if (status === 'Withdrawn' || status === 'Rejected') return -1;
    return STEPS.findIndex(s => s.key === status);
  };

  // Filtered applications
  const filteredApps = applications.filter(app => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Active') {
      return ['Applied', 'Under_Review', 'Shortlisted', 'Interview_Scheduled'].includes(app.status);
    }
    if (filterStatus === 'Offered') {
      return ['Offered', 'Accepted'].includes(app.status);
    }
    if (filterStatus === 'Terminal') {
      return ['Rejected', 'Withdrawn'].includes(app.status);
    }
    return true;
  });

  const offeredCount = applications.filter(a => a.status === 'Offered' || a.status === 'Accepted').length;
  const activeCount = applications.filter(a => ['Applied', 'Under_Review', 'Shortlisted', 'Interview_Scheduled'].includes(a.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-indigo-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Recruitment Pipeline & State Machine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display mb-3 text-white">
            My Internship Applications
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Track your candidacies in real-time across institutional review, interview scheduling, offer letters,
            and automated transition into active internship milestone logging.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-white font-display">{applications.length}</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Total Applied</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-indigo-400 font-display">{activeCount}</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Under Active Review</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-emerald-400 font-display">{offeredCount}</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Offers / Accepted</p>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 text-center">
              <span className="text-2xl font-black text-amber-300 font-display">100%</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Audit Traceable</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('All')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterStatus === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Submissions ({applications.length})
          </button>
          <button
            onClick={() => setFilterStatus('Active')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterStatus === 'Active'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            In Progress ({activeCount})
          </button>
          <button
            onClick={() => setFilterStatus('Offered')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterStatus === 'Offered'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Offers & Accepted ({offeredCount})
          </button>
          <button
            onClick={() => setFilterStatus('Terminal')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterStatus === 'Terminal'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Closed / Withdrawn
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/student')}
          className="gap-2 text-xs"
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Find More Internships</span>
        </Button>
      </div>

      {/* 3. Applications List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">Loading your applications...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <Card className="p-12 text-center">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Applications in this Category</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            You haven't submitted applications matching the selected filter. Explore our industry-backed roles.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => navigate('/student')}
          >
            Explore Matched Opportunities
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredApps.map((app) => {
            const opp = app.opportunity;
            const currentStepIdx = getStepIndex(app.status);
            const isTerminalNegative = app.status === 'Rejected' || app.status === 'Withdrawn';
            const isOffered = app.status === 'Offered';
            const isAccepted = app.status === 'Accepted';
            const canWithdraw = ['Applied', 'Under_Review'].includes(app.status);

            return (
              <Card key={app._id} className="p-6 border-slate-200 hover:shadow-md transition">
                
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {opp?.type || 'Internship'}
                      </span>
                      <span className="text-xs text-slate-400">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                      {opp?.title || 'Ayush Quality Officer'}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp?.industry?.companyName || 'Dabur Ayush Research & Manufacturing Ltd'}</span>
                      <span className="text-slate-300">•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp?.location || 'New Delhi'}</span>
                    </p>
                  </div>

                  {/* Match Score & Status Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      app.matchScore >= 80
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {app.matchScore}% Candidate Match
                    </span>

                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                      isAccepted ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      isOffered ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse' :
                      isTerminalNegative ? 'bg-rose-100 text-rose-800' :
                      'bg-indigo-50 text-indigo-800 border border-indigo-200'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Stepper Pipeline */}
                {!isTerminalNegative ? (
                  <div className="py-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Application Progression Pipeline
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      {STEPS.map((step, idx) => {
                        const isDone = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;

                        return (
                          <div
                            key={step.key}
                            className={`p-2.5 rounded-xl border text-center transition ${
                              isDone
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold shadow-xs'
                                : 'bg-slate-50 border-slate-200/70 text-slate-400 font-medium'
                            } ${isCurrent ? 'ring-2 ring-emerald-500/50' : ''}`}
                          >
                            <div className="flex items-center justify-center gap-1 text-xs mb-0.5">
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px]">
                                  {idx + 1}
                                </span>
                              )}
                              <span className="truncate">{step.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                      app.status === 'Withdrawn'
                        ? 'bg-slate-50 text-slate-600 border-slate-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>
                        {app.status === 'Withdrawn'
                          ? 'This application was withdrawn by you.'
                          : 'Application closed by recruiter. We encourage you to improve deficit skills and re-apply in future cycles.'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Interview Invitation Banner if Interview Scheduled */}
                {app.interviewSchedule?.scheduledDate && (
                  <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider mb-1">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span>{app.interviewSchedule.roundName || 'Placement Interview Scheduled'}</span>
                      </div>
                      <p className="text-xs text-indigo-950 font-semibold">
                        Scheduled: {new Date(app.interviewSchedule.scheduledDate).toLocaleString()} • {app.interviewSchedule.locationDetails || 'Virtual Room'}
                      </p>
                      {app.interviewSchedule.instructions && (
                        <p className="text-[11px] text-indigo-800 mt-1 italic">
                          Candidate instructions: "{app.interviewSchedule.instructions}"
                        </p>
                      )}
                    </div>
                    {app.interviewSchedule.meetingLink && (
                      <a
                        href={app.interviewSchedule.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Join Virtual Interview</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Employer Feedback Note */}
                {app.feedback && (
                  <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block mb-0.5">Recruiter Feedback / Instructions:</span>
                    <p className="italic">{app.feedback}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                    {opp?.stipendOrSalary && (
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Banknote className="w-3.5 h-3.5 text-slate-400" />
                        {opp.stipendOrSalary}
                      </span>
                    )}
                    {opp?.durationMonths && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {opp.durationMonths} Months Duration
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Withdraw button */}
                    {canWithdraw && (
                      <button
                        onClick={() => {
                          setSelectedAppToWithdraw(app);
                          setWithdrawModalOpen(true);
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition"
                      >
                        Withdraw Submission
                      </button>
                    )}

                    {/* Accept Offer button */}
                    {isOffered && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-xs gap-1.5 shadow-md animate-bounce"
                        onClick={() => handleAcceptOffer(app._id)}
                        isLoading={processingId === app._id}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Official Offer</span>
                      </Button>
                    )}

                    {/* Accepted status link to tracker */}
                    {isAccepted && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Internship Active & Milestone Tracker Initialized</span>
                      </div>
                    )}
                  </div>
                </div>

              </Card>
            );
          })}
        </div>
      )}

      {/* 4. Withdrawal Reason Modal */}
      {selectedAppToWithdraw && (
        <Modal
          isOpen={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          title="Withdraw Application Submission"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you wish to withdraw your application for{' '}
              <span className="font-bold text-slate-900">
                {selectedAppToWithdraw.opportunity?.title}
              </span>
              ? Once withdrawn, this action cannot be undone.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reason for Withdrawal (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g., Accepted an alternate internship, scheduling conflict..."
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWithdrawModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmWithdraw}
                isLoading={processingId === selectedAppToWithdraw._id}
              >
                Confirm Withdrawal
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
