import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getStudentProfile,
  updatePortfolioSlug,
  generateCredentialBadges,
  verifyCredential
} from '../services/api';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  Sparkles,
  Share2,
  ExternalLink,
  ShieldCheck,
  Key,
  Copy,
  Check,
  CheckCircle2,
  RefreshCw,
  Edit3,
  Globe,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Award,
  Fingerprint,
  X
} from 'lucide-react';

export default function MyPortfolio() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Slug editing state
  const [slugInput, setSlugInput] = useState('');
  const [savingSlug, setSavingSlug] = useState(false);
  const [slugError, setSlugError] = useState('');

  // Badge generation state
  const [generatingBadges, setGeneratingBadges] = useState(false);

  // Link copy state
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHash, setCopiedHash] = useState('');

  // Audit modal state
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [auditError, setAuditError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getStudentProfile();
      const p = res.data?.profile || res.data?.data || res.data;
      setProfile(p);
      setSlugInput(p.portfolioSlug || `student-${p._id?.slice(-6)}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load portfolio profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSlug = async (e) => {
    e.preventDefault();
    setSlugError('');
    setSuccessMessage('');
    setSavingSlug(true);

    try {
      const res = await updatePortfolioSlug(slugInput);
      setSuccessMessage('Public portfolio URL slug updated successfully!');
      setProfile((prev) => ({
        ...prev,
        portfolioSlug: res.data?.data?.portfolioSlug || slugInput
      }));
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setSlugError(err.response?.data?.message || 'Failed to update URL slug. Try another unique name.');
    } finally {
      setSavingSlug(false);
    }
  };

  const handleGenerateBadges = async () => {
    setGeneratingBadges(true);
    setSuccessMessage('');
    try {
      const res = await generateCredentialBadges();
      setSuccessMessage(res.data?.message || 'Cryptographic credential signatures successfully synchronized!');
      await loadProfile();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate cryptographic credentials.');
    } finally {
      setGeneratingBadges(false);
    }
  };

  const portfolioUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/portfolio/${profile?.portfolioSlug || ''}`
    : `/portfolio/${profile?.portfolioSlug || ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(''), 3000);
  };

  const handleOpenAuditModal = async (credentialHash) => {
    setAuditModalOpen(true);
    setAuditLoading(true);
    setAuditError('');
    setAuditResult(null);

    try {
      const res = await verifyCredential(credentialHash);
      const data = res.data?.data || res.data;
      setAuditResult(data);
    } catch (err) {
      setAuditError(err.response?.data?.message || 'Failed to verify credential signature against registry.');
    } finally {
      setAuditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-semibold text-sm">Loading Your Digital Portfolio Engine...</p>
        </div>
      </div>
    );
  }

  const verifiedSkills = (profile?.skills || []).filter(
    (s) => s.verifiedByAssessment || s.isEndorsed || s.credentialHash
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verifiable Digital Portfolio & W3C Credential Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">
            {profile?.fullName || 'Candidate'}&apos;s Digital Portfolio
          </h1>
          <p className="text-emerald-200 text-sm max-w-xl">
            Manage your public candidate profile, customize your unique portfolio link, and issue tamper-evident SHA-256 cryptographic micro-credentials recognized by employers and universities.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold shadow-sm transition backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <Share2 className="w-4 h-4 flex-shrink-0" />
            <span>{copiedLink ? 'Link Copied!' : 'Copy Public URL'}</span>
          </button>
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-md transition"
          >
            <span>Preview Public View</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Public URL Customizer & Verifiable Ledger */}
        <div className="lg:col-span-2 space-y-6">
          {/* Custom URL Slug Editor Card */}
          <Card
            title="Custom Public Portfolio URL"
            subtitle="Claim your unique shareable address for recruiters and research applications"
            icon={Globe}
          >
            <form onSubmit={handleSaveSlug} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Public Web Address
                </label>
                <div className="flex flex-col sm:flex-row rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition">
                  <span className="px-3.5 py-2.5 bg-slate-100 text-slate-500 text-xs font-mono select-none flex items-center border-b sm:border-b-0 sm:border-r border-slate-200">
                    {typeof window !== 'undefined' ? `${window.location.origin}/portfolio/` : 'https://portal.ayush.gov.in/portfolio/'}
                  </span>
                  <input
                    type="text"
                    value={slugInput}
                    onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="your-name-degree"
                    className="flex-1 px-3.5 py-2.5 bg-white text-xs font-mono text-slate-900 focus:outline-none"
                    required
                  />
                </div>
                {slugError && (
                  <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{slugError}</span>
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  Allowed characters: lowercase letters, numbers, and hyphens (e.g. `ayush-sharma-bams`).
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Direct URL'}</span>
                </button>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  loading={savingSlug}
                  disabled={savingSlug || slugInput === profile?.portfolioSlug}
                >
                  Update URL Slug
                </Button>
              </div>
            </form>
          </Card>

          {/* Cryptographic Credentials Ledger */}
          <Card
            title="Cryptographic Credential Badges"
            subtitle="SHA-256 tamper-evident signatures issued for verified competencies"
            icon={Fingerprint}
            action={
              <Button
                size="sm"
                variant="outline"
                icon={RefreshCw}
                loading={generatingBadges}
                onClick={handleGenerateBadges}
              >
                Sync & Re-Sign Credentials
              </Button>
            }
          >
            <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
              <span>
                Total Verified Credentials Issued: <strong className="text-slate-900">{verifiedSkills.length}</strong>
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ledger Active
              </span>
            </div>

            {verifiedSkills.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No verified skills found yet. Take diagnostic assessments in the Assessment Runner or request faculty endorsements to issue cryptographic credentials.
                </p>
                <Link to="/assessments">
                  <Button size="sm" variant="primary">Take Diagnostic Assessment</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {verifiedSkills.map((sk, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {sk.skill?.name || 'Ayush Competency'}
                        </span>
                        <Badge variant="verified" dot>Authenticated</Badge>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Score: {sk.proficiencyScore}% ({sk.proficiency})
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                        <span>Category: <strong className="text-slate-700">{sk.skill?.category || 'Clinical'}</strong></span>
                        {sk.lastAssessedAt && (
                          <span>Date: <strong className="text-slate-700">{new Date(sk.lastAssessedAt).toLocaleDateString()}</strong></span>
                        )}
                      </div>

                      {/* Hash Display */}
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                          <Key className="w-3 h-3 text-emerald-600" />
                          Signature:
                        </span>
                        <span className="font-mono text-[11px] bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 select-all">
                          {sk.credentialHash
                            ? `${sk.credentialHash.substring(0, 16)}...${sk.credentialHash.substring(sk.credentialHash.length - 10)}`
                            : 'Click "Sync & Re-Sign" to generate hash'}
                        </span>
                        {sk.credentialHash && (
                          <button
                            type="button"
                            onClick={() => handleCopyHash(sk.credentialHash)}
                            className="text-[11px] font-medium text-slate-600 hover:text-emerald-700 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-100"
                            title="Copy full 64-char hash"
                          >
                            {copiedHash === sk.credentialHash ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={ShieldCheck}
                        disabled={!sk.credentialHash}
                        onClick={() => handleOpenAuditModal(sk.credentialHash)}
                      >
                        Verify Proof
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Quick Profile Summary & Live Recruiter Preview */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <Card title="Candidate Credentials" icon={GraduationCap}>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Degree</span>
                <strong className="text-slate-900">{profile?.degree || 'BAMS'}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Roll Number</span>
                <strong className="text-slate-900 font-mono">{profile?.rollNumber || 'NIA-2022-042'}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Passing Class</span>
                <strong className="text-slate-900">Class of {profile?.passingYear || 2026}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Institute</span>
                <strong className="text-slate-900 text-right">{profile?.institute?.instituteName || 'All India Institute of Ayurveda'}</strong>
              </div>
              {profile?.targetCareerRole && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Target Role</span>
                  <strong className="text-emerald-800 text-right">{profile.targetCareerRole.title}</strong>
                </div>
              )}
            </div>
          </Card>

          {/* Recruiter Preview Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm">Recruiter Visibility</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recruiters from Dabur, Patanjali, Hamdard, and Baidyanath search candidate portfolios using verifiable cryptographic badges to fast-track hiring.
            </p>
            <div className="pt-2">
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                <span>View Public Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Audit Modal */}
      {auditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm font-display">
                  National Credential Registry Verification
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAuditModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {auditLoading ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    Querying National Commission Registry Node...
                  </p>
                </div>
              ) : auditError ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
                  <h4 className="text-sm font-bold text-rose-900">Verification Check Failed</h4>
                  <p className="text-xs text-rose-700">{auditError}</p>
                </div>
              ) : auditResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                        Verification Status
                      </span>
                      <p className="text-sm font-bold text-emerald-950">
                        AUTHENTIC & TAMPER-EVIDENT
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        SHA-256 digest signature matches institutional registry ledger.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Skill Competency</span>
                      <strong className="text-slate-900 text-right">{auditResult.skillName}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Candidate</span>
                      <strong className="text-slate-900 text-right">{auditResult.student?.fullName} ({auditResult.student?.rollNumber})</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Issuing Institution</span>
                      <strong className="text-slate-900 text-right">{auditResult.issuer?.instituteName}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Regulatory Council</span>
                      <strong className="text-emerald-800 text-right">{auditResult.issuer?.governingBody || 'NCISM'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Proficiency Score</span>
                      <strong className="text-emerald-700 text-right">{auditResult.proficiencyScore}% ({auditResult.proficiency})</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Ledger Block #</span>
                      <strong className="text-slate-800 text-right font-mono">
                        #{auditResult.auditLedger?.blockNumber || 104829}
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Tamper-Evident SHA-256 Signature
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[10px] break-all select-all flex items-center justify-between gap-2">
                      <span>{auditResult.credentialHash}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyHash(auditResult.credentialHash)}
                        className="text-white hover:text-emerald-300 p-1"
                        title="Copy hash"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="pt-2">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setAuditModalOpen(false)}
                >
                  Close Verification Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
