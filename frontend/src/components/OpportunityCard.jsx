import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Banknote,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  GraduationCap,
  Briefcase,
  Compass,
  Globe
} from 'lucide-react';
import SkillBadge from './SkillBadge';

export default function OpportunityCard({ opportunity, onApply, applying }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const {
    _id,
    title,
    industry,
    location,
    workplaceType,
    minCgpa,
    eligibleDegrees = [],
    stipendOrSalary,
    durationMonths,
    compatibilityScore,
    matchScore,
    factorBreakdown,
    matchReasons = [],
    requiredSkills = [],
    missingSkills = [],
    applicationStatus
  } = opportunity;

  const displayScore = compatibilityScore !== undefined ? compatibilityScore : (matchScore !== undefined ? matchScore : 80);

  // Score color badge
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    if (score >= 60) return 'bg-amber-50 text-amber-800 border-amber-300';
    return 'bg-rose-50 text-rose-800 border-rose-300';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs hover:shadow-md transition border border-slate-200 p-6 flex flex-col justify-between">
      <div>
        {/* Header: Title, Company & Compatibility Score Badge */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition font-display">
                {title}
              </h3>
              {workplaceType && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  {workplaceType}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-emerald-800">
              {industry?.companyName || 'Ayush Healthcare Partner'}
            </p>
          </div>

          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 flex-shrink-0 shadow-2xs ${getScoreColor(displayScore)}`}>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{displayScore}% Compatible</span>
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-slate-500 mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{durationMonths} Months</span>
          </div>
          <div className="flex items-center gap-1">
            <Banknote className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">{stipendOrSalary}</span>
          </div>
          {minCgpa > 0 && (
            <div className="flex items-center gap-1 text-slate-600">
              <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
              <span>Min CGPA: {minCgpa}</span>
            </div>
          )}
        </div>

        {/* Dynamic Match Reason Badges (Phase 14 feature) */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {matchReasons.slice(0, 3).map((reason, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60"
              >
                {reason}
              </span>
            ))}
          </div>
        )}

        {/* Multi-Factor Breakdown Toggle */}
        {factorBreakdown && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
            >
              <span>5-Factor Compatibility Math</span>
              {showBreakdown ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showBreakdown && (
              <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                {/* 1. Skill Score */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span className="font-medium">1. Diagnostic Skill Coverage (50% weight)</span>
                    <strong className="text-slate-900">{factorBreakdown.skillScore}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${factorBreakdown.skillScore}%` }} />
                  </div>
                </div>

                {/* 2. Academic Eligibility */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span className="font-medium">2. Academic Eligibility & CGPA (20% weight)</span>
                    <strong className="text-slate-900">{factorBreakdown.eligibilityScore}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${factorBreakdown.eligibilityScore}%` }} />
                  </div>
                </div>

                {/* 3. Career Role Alignment */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span className="font-medium">3. Career Role Alignment (15% weight)</span>
                    <strong className="text-slate-900">{factorBreakdown.careerAlignmentScore}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${factorBreakdown.careerAlignmentScore}%` }} />
                  </div>
                </div>

                {/* 4. Practical Experience */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span className="font-medium">4. Practical Experience & Projects (10% weight)</span>
                    <strong className="text-slate-900">{factorBreakdown.practicalScore}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: `${factorBreakdown.practicalScore}%` }} />
                  </div>
                </div>

                {/* 5. Geographic Proximity */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                    <span className="font-medium">5. Location & Remote Flexibility (5% weight)</span>
                    <strong className="text-slate-900">{factorBreakdown.locationScore}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: `${factorBreakdown.locationScore}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Required Skills */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Required Competencies</p>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.map((sk) => (
              <SkillBadge key={sk._id || sk} name={sk.name || sk} variant="default" />
            ))}
          </div>
        </div>

        {/* Skill Gap Alert (Missing Skills) */}
        {missingSkills && missingSkills.length > 0 && (
          <div className="mb-4 bg-amber-50/80 border border-amber-200/80 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-amber-900 text-xs font-semibold mb-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-700" />
              <span>Diagnostic Gaps ({missingSkills.length} unverified):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((sk) => (
                <span
                  key={sk._id || sk}
                  className="bg-amber-100 text-amber-800 text-[11px] font-medium px-2 py-0.5 rounded-md border border-amber-200/60"
                >
                  {sk.name || sk}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        {applicationStatus ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Applied • Status: {applicationStatus}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onApply(_id)}
            disabled={applying}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition disabled:opacity-50 shadow-xs hover:shadow flex items-center justify-center gap-2"
          >
            {applying ? 'Submitting Application...' : 'Apply with Empirical Profile'}
          </button>
        )}
      </div>
    </div>
  );
}
