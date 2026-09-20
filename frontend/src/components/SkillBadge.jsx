import React from 'react';
import { Check } from 'lucide-react';

export default function SkillBadge({ name, isEndorsed = false, proficiency = null, variant = 'default' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition ${
        isEndorsed
          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
          : 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      <span>{name}</span>
      {isEndorsed && (
        <span title="Faculty Endorsed" className="text-emerald-600">
          <Check className="h-3 w-3 stroke-[3]" />
        </span>
      )}
      {proficiency && (
        <span className="text-[10px] text-slate-400 uppercase font-mono ml-0.5">
          ({proficiency[0]})
        </span>
      )}
    </span>
  );
}
