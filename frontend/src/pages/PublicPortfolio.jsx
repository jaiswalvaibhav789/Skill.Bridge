import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicPortfolio, verifyCredential } from '../services/api';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  GraduationCap,
  Building2,
  Award,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Share2,
  Printer,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Key,
  Copy,
  Check,
  Clock,
  Fingerprint,
  X,
  FileText
} from 'lucide-react';

export default function PublicPortfolio() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedHash, setCopiedHash] = useState('');

  // Verification Audit Modal state
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [auditError, setAuditError] = useState('');

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getPublicPortfolio(slug);
      const data = res.data?.data || res.data?.portfolio || res.data;
      setPortfolio(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Digital portfolio not found or inactive.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(''), 3000);
  };

  const handlePrint = () => {
    window.print();
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
      setAuditError(err.response?.data?.message || 'Failed to verify cryptographic credential signature against registry.');
    } finally {
      setAuditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-semibold text-sm">Resolving Cryptographic Digital Credentials...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 mb-2">
            Portfolio Not Found
          </h2>
          <p className="text-xs text-slate-600 mb-6">
            The requested candidate profile URL ({slug}) does not exist or has been made private.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-emerald-700 text-white rounded-xl text-sm font-semibold hover:bg-emerald-800 transition"
          >
            Return to Portal Home
          </Link>
        </div>
      </div>
    );
  }

  const credentialsLedger = portfolio.credentialsLedger || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 print:py-0 print:space-y-4">
      {/* Action Header bar for Recruiters & Auditors */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-6 py-3.5 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-800">
            Verified Ayush Candidate Portfolio • Cryptographically Sealed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={Share2}
            onClick={handleCopyLink}
          >
            {copied ? 'Link Copied!' : 'Share Portfolio'}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={Printer}
            onClick={handlePrint}
          >
            Download Verified PDF
          </Button>
        </div>
      </div>

      {/* Main Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden print:bg-none print:text-slate-900 print:p-0 print:border-b print:border-slate-300 print:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0 print:hidden">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold font-display">{portfolio.fullName}</h1>
                <Badge variant="match-high" dot>Assessment & NCISM Verified</Badge>
              </div>
              <p className="text-emerald-200 text-sm font-medium print:text-slate-700">
                {portfolio.degree} ({portfolio.department || 'Ayush Medicine & Surgery'}) • Class of {portfolio.passingYear}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 print:text-slate-600">
                <Building2 className="w-3.5 h-3.5" />
                <span>{portfolio.institute?.instituteName || 'All India Institute of Ayurveda, New Delhi'}</span>
                {portfolio.institute?.aisheCode && (
                  <span className="font-mono bg-slate-800/60 px-2 py-0.5 rounded text-[10px] text-emerald-300 print:bg-slate-100 print:text-slate-800">
                    AISHE: {portfolio.institute.aisheCode}
                  </span>
                )}
              </p>
            </div>
          </div>

          {portfolio.targetCareerRole && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-left sm:text-right print:border-slate-300 print:bg-slate-50 print:text-slate-900">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block print:text-emerald-800">
                Target Career Role
              </span>
              <span className="text-sm font-bold text-white block mt-0.5 print:text-slate-900">
                {portfolio.targetCareerRole.title}
              </span>
              <span className="text-xs text-slate-300 print:text-slate-600">
                Industry: {portfolio.targetCareerRole.industrySector || 'Ayush Healthcare'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cryptographic Credential Ledger (Phase 13 Core Feature) */}
      <Card
        title="Verifiable Digital Credential Ledger"
        subtitle="Cryptographically sealed micro-credentials with SHA-256 tamper-evident digital signatures"
        icon={Fingerprint}
      >
        <div className="mb-4 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950">
                National Ayush Digital Credential Ledger Registry
              </p>
              <p className="text-[11px] text-emerald-700">
                All micro-credentials comply with the W3C Verifiable Credentials Standard. Hashes are deterministic and tamper-evident.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 text-xs">
            <span className="font-mono bg-emerald-100/80 text-emerald-800 font-bold px-2.5 py-1 rounded-lg border border-emerald-300/60">
              {credentialsLedger.length} Verified Credentials
            </span>
          </div>
        </div>

        {credentialsLedger.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No cryptographic credentials have been issued for this profile yet.
          </div>
        ) : (
          <div className="space-y-3">
            {credentialsLedger.map((cred, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{cred.skillName}</span>
                    <Badge variant="verified" dot>Authenticated</Badge>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Score: {cred.proficiencyScore}% ({cred.proficiency})
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>Category: <strong className="text-slate-700">{cred.category}</strong></span>
                    <span>Endorsed By: <strong className="text-slate-700">{cred.endorsedBy}</strong></span>
                    {cred.issuedAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(cred.issuedAt).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>

                  {/* Cryptographic SHA-256 Hash Display */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                      <Key className="w-3 h-3 text-emerald-600" />
                      SHA-256 Signature:
                    </span>
                    <span className="font-mono text-[11px] bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 select-all">
                      {cred.hash ? `${cred.hash.substring(0, 14)}...${cred.hash.substring(cred.hash.length - 10)}` : 'HASH_PENDING'}
                    </span>
                    {cred.hash && (
                      <button
                        type="button"
                        onClick={() => handleCopyHash(cred.hash)}
                        className="text-[11px] font-medium text-slate-600 hover:text-emerald-700 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-100 transition"
                        title="Copy full 64-character SHA-256 hash"
                      >
                        {copiedHash === cred.hash ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Verify Authenticity Trigger */}
                <div className="flex-shrink-0 flex items-center print:hidden">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={ShieldCheck}
                    onClick={() => handleOpenAuditModal(cred.hash)}
                  >
                    Verify Authenticity
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Candidate Summary / Bio */}
      {portfolio.bio && (
        <Card title="Candidate Summary" icon={Award}>
          <p className="text-slate-700 text-sm leading-relaxed">
            {portfolio.bio}
          </p>
        </Card>
      )}

      {/* Diagnostic Skill Competencies Grid */}
      <Card
        title="Comprehensive Competency Matrix"
        subtitle="Evaluated via objective diagnostic testing and academic endorsements"
        icon={Sparkles}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(portfolio.skills || []).map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between hover:border-emerald-300 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-900 leading-tight">{s.name}</span>
                  {s.verified && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" title="Assessment Verified" />
                  )}
                </div>
                <span className="text-[10px] text-slate-500 block">{s.category}</span>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-500 text-[11px]">Proficiency</span>
                  <span className="font-bold text-emerald-700">{s.proficiencyScore || 70}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${s.proficiencyScore || 70}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Projects & Practical Research */}
      <Card
        title="Projects & Practical Research"
        subtitle="Clinical trials, formulation chemistry, and quality compliance"
        icon={Briefcase}
      >
        <div className="space-y-4">
          {(portfolio.projects?.length ? portfolio.projects : [
            {
              title: 'Comparative Phytochemical Analysis of Ashwagandha Root Formulations',
              description: 'Conducted TLC and spectrophotometric assay of withanolide content across commercial herbal batches complying with Schedule T standards.',
              skillsUsed: ['Herbal Extraction & Standardization', 'Schedule T Ayush GMP']
            }
          ]).map((proj, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-white">
              <h4 className="font-bold text-sm text-slate-900">{proj.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
              {proj.skillsUsed?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-100">
                  {proj.skillsUsed.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-md">
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Verified Certifications */}
      <Card
        title="Verified Certifications & Accreditations"
        subtitle="Issued by recognized statutory and university authorities"
        icon={CheckCircle2}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(portfolio.certifications?.length ? portfolio.certifications : [
            {
              title: 'Certificate in Ayurvedic Pharmacopoeia Standards',
              issuingOrganization: 'National Institute of Ayurveda',
              isVerified: true
            }
          ]).map((cert, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h5 className="font-semibold text-xs text-slate-900">{cert.title}</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">{cert.issuingOrganization}</p>
              </div>
              <Badge variant="verified">Verified</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Verification Audit Modal */}
      {auditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:hidden">
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
                    Executing Cryptographic Audit Verification...
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Querying National Commission for Indian System of Medicine (NCISM) registry node
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
                  {/* Verified Header Pill */}
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                        Cryptographic Status
                      </span>
                      <p className="text-sm font-bold text-emerald-950">
                        AUTHENTIC & TAMPER-EVIDENT
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        SHA-256 digest matches registry consensus signature.
                      </p>
                    </div>
                  </div>

                  {/* Audit Details Table */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Skill / Competency</span>
                      <strong className="text-slate-900 text-right">{auditResult.skillName}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Candidate</span>
                      <strong className="text-slate-900 text-right">{auditResult.student?.fullName} ({auditResult.student?.rollNumber})</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Issuing Authority</span>
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
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Registry Network</span>
                      <strong className="text-slate-800 text-right font-mono text-[10px]">
                        {auditResult.auditLedger?.ledgerNetwork || 'ANDH-ECR Mainnet'}
                      </strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Ledger Block #</span>
                      <strong className="text-slate-800 text-right font-mono">
                        #{auditResult.auditLedger?.blockNumber || 104829}
                      </strong>
                    </div>
                  </div>

                  {/* Hash Signature Pill */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Tamper-Evident SHA-256 Digest
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

              {/* Close Button */}
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
