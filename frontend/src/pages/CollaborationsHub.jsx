import React, { useState, useEffect } from 'react';
import {
  getAllCollaborations,
  createCollaboration,
  submitCollaborationProposal,
  reviewCollaborationProposal,
  respondToConsultingRequest
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import {
  Building2,
  GraduationCap,
  FlaskConical,
  Award,
  Calendar,
  Banknote,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  Send,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export default function CollaborationsHub() {
  const { user } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();

  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Proposal Submission Modal State (Faculty)
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedCollabForProposal, setSelectedCollabForProposal] = useState(null);
  const [proposalAbstract, setProposalAbstract] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [estimatedMonths, setEstimatedMonths] = useState(6);
  const [submittingProposal, setSubmittingProposal] = useState(false);

  // New Collaboration Call Wizard (Industry / Ministry / Faculty)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [callTitle, setCallTitle] = useState('');
  const [callType, setCallType] = useState('Joint_R&D');
  const [callDesc, setCallDesc] = useState('');
  const [callBudget, setCallBudget] = useState('₹15,00,000 (Sponsored)');
  const [callDuration, setCallDuration] = useState(12);
  const [callDeliverables, setCallDeliverables] = useState('');
  const [creatingCall, setCreatingCall] = useState(false);

  // Detail View Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCollabDetail, setSelectedCollabDetail] = useState(null);
  const [reviewingAppId, setReviewingAppId] = useState(null);

  const fetchCollaborations = async () => {
    setLoading(true);
    try {
      const res = await getAllCollaborations();
      setCollaborations(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Error fetching collaborations:', err);
      toastError('Failed to load collaborations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, []);

  // Handle Proposal Submission by Faculty
  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!selectedCollabForProposal) return;

    setSubmittingProposal(true);
    try {
      await submitCollaborationProposal(selectedCollabForProposal._id, {
        proposalAbstract,
        proposedBudget: proposedBudget || selectedCollabForProposal.budget,
        estimatedMonths: Number(estimatedMonths)
      });

      toastSuccess('🎉 Research proposal successfully submitted to sponsoring partner!');
      setSubmitModalOpen(false);
      setSelectedCollabForProposal(null);
      setProposalAbstract('');
      setProposedBudget('');
      await fetchCollaborations();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit proposal';
      toastError(msg);
    } finally {
      setSubmittingProposal(false);
    }
  };

  // Handle Proposal Acceptance (Industry)
  const handleReviewProposal = async (collabId, applicationId, decision) => {
    setReviewingAppId(applicationId);
    try {
      await reviewCollaborationProposal(collabId, { applicationId, decision });
      toastSuccess(`Faculty proposal ${decision.toLowerCase()}! Project status transitioned to Approved.`);
      await fetchCollaborations();
      if (selectedCollabDetail) {
        setDetailModalOpen(false);
        setSelectedCollabDetail(null);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to review proposal';
      toastError(msg);
    } finally {
      setReviewingAppId(null);
    }
  };

  // Handle Direct Consulting Response (Faculty)
  const handleConsultingResponse = async (collabId, decision) => {
    try {
      await respondToConsultingRequest(collabId, { decision });
      toastSuccess(`Consulting request ${decision.toLowerCase()}!`);
      await fetchCollaborations();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update consulting request';
      toastError(msg);
    }
  };

  // Handle Creating New Call
  const handleCreateCall = async (e) => {
    e.preventDefault();
    setCreatingCall(true);
    try {
      const deliverablesArray = callDeliverables
        .split('\n')
        .map(d => d.trim())
        .filter(Boolean);

      await createCollaboration({
        title: callTitle,
        type: callType,
        description: callDesc,
        budget: callBudget,
        durationMonths: Number(callDuration),
        deliverables: deliverablesArray
      });

      toastSuccess(`Collaboration Call "${callTitle}" successfully published!`);
      setCreateModalOpen(false);
      setCallTitle('');
      setCallDesc('');
      setCallDeliverables('');
      await fetchCollaborations();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create collaboration';
      toastError(msg);
    } finally {
      setCreatingCall(false);
    }
  };

  // Filtered collaborations
  const filteredCollabs = collaborations.filter(c => {
    const matchesType = selectedType === 'All' || c.type === selectedType;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.industry?.companyName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const typeStyles = {
    'Joint_R&D': 'bg-purple-100 text-purple-900 border-purple-300',
    'Consulting_Request': 'bg-blue-100 text-blue-900 border-blue-300',
    'Faculty_Sabbatical': 'bg-emerald-100 text-emerald-900 border-emerald-300',
    'Grant_Call': 'bg-amber-100 text-amber-900 border-amber-300'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-purple-500/30">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Academia–Industry Research & Sabbatical Ecosystem</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display mb-3 text-white">
              Academia–Industry Collaborations
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              Bridge academic Samhita pharmacology with industrial phytochemistry. Explore sponsored Joint R&D calls,
              advisory consulting opportunities for Ayush professors, and corporate sabbatical residencies.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-2.5 text-center">
                <span className="text-xl font-black text-purple-300 font-display">{collaborations.length}</span>
                <p className="text-[11px] text-slate-400 font-medium">Total R&D Calls</p>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-2.5 text-center">
                <span className="text-xl font-black text-emerald-400 font-display">
                  {collaborations.filter(c => c.type === 'Joint_R&D').length}
                </span>
                <p className="text-[11px] text-slate-400 font-medium">Joint R&D Projects</p>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-2.5 text-center">
                <span className="text-xl font-black text-blue-400 font-display">
                  {collaborations.filter(c => c.type === 'Consulting_Request').length}
                </span>
                <p className="text-[11px] text-slate-400 font-medium">Consulting Calls</p>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-2.5 text-center">
                <span className="text-xl font-black text-amber-300 font-display">100%</span>
                <p className="text-[11px] text-slate-400 font-medium">Funded & IP Protected</p>
              </div>
            </div>
          </div>

          {(user?.role === 'industry' || user?.role === 'faculty' || user?.role === 'admin' || user?.role === 'institute') && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCreateModalOpen(true)}
              className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shrink-0"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Collaboration Call</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Joint_R&D', 'Consulting_Request', 'Faculty_Sabbatical', 'Grant_Call'].map((typeKey) => (
            <button
              key={typeKey}
              onClick={() => setSelectedType(typeKey)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                selectedType === typeKey
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {typeKey.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search R&D calls or partners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* 3. Collaborations Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">Loading collaboration calls...</p>
        </div>
      ) : filteredCollabs.length === 0 ? (
        <Card className="p-12 text-center">
          <FlaskConical className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Collaboration Calls in this Category</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try resetting your search query or choosing "All" across categories.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCollabs.map((collab) => {
            const isConsulting = collab.type === 'Consulting_Request';
            const isApproved = collab.status === 'Approved';
            const hasApplications = (collab.applications || []).length > 0;

            return (
              <Card key={collab._id} className="p-6 border-slate-200 hover:shadow-md transition flex flex-col justify-between">
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${typeStyles[collab.type] || 'bg-slate-100 text-slate-700'}`}>
                      {collab.type.replace('_', ' ')}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {collab.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => {
                      setSelectedCollabDetail(collab);
                      setDetailModalOpen(true);
                    }}
                    className="text-base font-bold text-slate-900 leading-snug mb-2 hover:text-purple-700 cursor-pointer transition"
                  >
                    {collab.title}
                  </h3>

                  {/* Sponsor & Partner Info */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Sponsor: <strong className="text-slate-800">{collab.industry?.companyName || 'Ministry of Ayush'}</strong>
                    </span>
                    {collab.faculty && (
                      <>
                        <span>•</span>
                        <span className="text-indigo-700 font-semibold">
                          Faculty: {collab.faculty.fullName}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {collab.description}
                  </p>

                  {/* Deliverables Preview */}
                  {collab.deliverables?.length > 0 && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Key Deliverables ({collab.deliverables.length})
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {collab.deliverables.slice(0, 2).map((del, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="truncate">{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer Logistics & Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="font-bold text-emerald-700">{collab.budget}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{collab.durationMonths} Months</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setSelectedCollabDetail(collab);
                        setDetailModalOpen(true);
                      }}
                    >
                      Inspect Scope
                    </Button>

                    {/* Faculty Action: Submit Proposal */}
                    {user?.role === 'faculty' && collab.status === 'Open_Call' && !isConsulting && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs bg-purple-600 hover:bg-purple-700 gap-1"
                        onClick={() => {
                          setSelectedCollabForProposal(collab);
                          setSubmitModalOpen(true);
                        }}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Proposal</span>
                      </Button>
                    )}

                    {/* Faculty Action: Accept Direct Consulting */}
                    {user?.role === 'faculty' && isConsulting && collab.status === 'Open_Call' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleConsultingResponse(collab._id, 'Approved')}
                      >
                        Accept Consulting Call
                      </Button>
                    )}

                    {/* Industry / Admin Action: Review Proposals */}
                    {(user?.role === 'industry' || user?.role === 'admin') && hasApplications && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => {
                          setSelectedCollabDetail(collab);
                          setDetailModalOpen(true);
                        }}
                      >
                        Review Proposals ({collab.applications.length})
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. Faculty Proposal Submission Modal */}
      {selectedCollabForProposal && (
        <Modal
          isOpen={submitModalOpen}
          onClose={() => setSubmitModalOpen(false)}
          title={`Submit Research Proposal: ${selectedCollabForProposal.title}`}
          size="lg"
        >
          <form onSubmit={handleSubmitProposal} className="space-y-4">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <span className="font-bold text-slate-800 block mb-0.5">Sponsor Call Requirements:</span>
              <p className="text-slate-600 line-clamp-2">{selectedCollabForProposal.description}</p>
              <div className="flex items-center gap-3 mt-2 text-slate-500 font-semibold">
                <span>Budget Cap: <strong className="text-emerald-700">{selectedCollabForProposal.budget}</strong></span>
                <span>•</span>
                <span>Estimated Duration: {selectedCollabForProposal.durationMonths} Months</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Methodology & Proposal Abstract *
              </label>
              <textarea
                rows={4}
                required
                value={proposalAbstract}
                onChange={(e) => setProposalAbstract(e.target.value)}
                placeholder="Outline institutional instrumentation (HPTLC/HPLC/LC-MS), clinical trial protocols, laboratory qualifications, and expected milestones..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Proposed Research Budget *
                </label>
                <input
                  type="text"
                  required
                  value={proposedBudget}
                  onChange={(e) => setProposedBudget(e.target.value)}
                  placeholder={selectedCollabForProposal.budget}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Timeline (Months) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  required
                  value={estimatedMonths}
                  onChange={(e) => setEstimatedMonths(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSubmitModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="bg-purple-600 hover:bg-purple-700 font-bold"
                isLoading={submittingProposal}
              >
                Submit Official Proposal
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 5. Create Collaboration Call Wizard Modal */}
      {createModalOpen && (
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Publish Academia–Industry Collaboration Call"
          size="lg"
        >
          <form onSubmit={handleCreateCall} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Project / Opportunity Title *
              </label>
              <input
                type="text"
                required
                value={callTitle}
                onChange={(e) => setCallTitle(e.target.value)}
                placeholder="e.g. HPTLC Bioactive Fingerprint Assay of Classical Asava/Arishta Fermentations"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Collaboration Category *
                </label>
                <select
                  value={callType}
                  onChange={(e) => setCallType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Joint_R&D">Joint R&D Project</option>
                  <option value="Consulting_Request">Industrial Consulting Request</option>
                  <option value="Faculty_Sabbatical">Faculty Corporate Sabbatical</option>
                  <option value="Grant_Call">National Ministry Grant Call</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Budget / Honorarium *
                </label>
                <input
                  type="text"
                  required
                  value={callBudget}
                  onChange={(e) => setCallBudget(e.target.value)}
                  placeholder="e.g. ₹20,00,000 (Industry Sponsored)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Scope of Collaboration & Scientific Objectives *
              </label>
              <textarea
                rows={3}
                required
                value={callDesc}
                onChange={(e) => setCallDesc(e.target.value)}
                placeholder="Describe research goals, industrial relevance, sample requirements, and testing parameters..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Project Deliverables (1 per line) *
              </label>
              <textarea
                rows={3}
                required
                value={callDeliverables}
                onChange={(e) => setCallDeliverables(e.target.value)}
                placeholder="Validated HPTLC Chromatogram Protocol&#10;Batch Extraction Efficiency Report&#10;Joint Scopus/SCI Publication"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                isLoading={creatingCall}
              >
                Publish Collaboration Call
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 6. Collaboration Detailed Scope & Proposal Review Modal */}
      {selectedCollabDetail && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={selectedCollabDetail.title}
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`font-bold px-2.5 py-0.5 rounded-full border ${typeStyles[selectedCollabDetail.type]}`}>
                {selectedCollabDetail.type.replace('_', ' ')}
              </span>
              <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {selectedCollabDetail.budget}
              </span>
              <span className="text-slate-500 font-medium">
                Duration: {selectedCollabDetail.durationMonths} Months
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Scope Description
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedCollabDetail.description}
              </p>
            </div>

            {/* Deliverables */}
            {selectedCollabDetail.deliverables?.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Expected Research Deliverables
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {selectedCollabDetail.deliverables.map((d, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submitted Faculty Proposals (Review Mode) */}
            {selectedCollabDetail.applications?.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
                  Submitted Faculty Proposals ({selectedCollabDetail.applications.length})
                </span>

                <div className="space-y-3">
                  {selectedCollabDetail.applications.map((app) => (
                    <div
                      key={app._id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm">
                            {app.applicantFaculty?.fullName || 'Faculty Investigator'}
                          </h5>
                          <p className="text-slate-500">
                            {app.applicantFaculty?.designation} • {app.applicantFaculty?.department}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <p className="text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200/80">
                        "{app.proposalAbstract}"
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                        <span>Proposed Budget: <strong>{app.proposedBudget}</strong> ({app.estimatedMonths} Mos)</span>

                        {(user?.role === 'industry' || user?.role === 'admin') && app.status === 'Submitted' && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-xs bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleReviewProposal(selectedCollabDetail._id, app._id, 'Accepted')}
                              isLoading={reviewingAppId === app._id}
                            >
                              Accept Proposal
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleReviewProposal(selectedCollabDetail._id, app._id, 'Rejected')}
                              isLoading={reviewingAppId === app._id}
                            >
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDetailModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
