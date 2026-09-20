import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'emerald' }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-sky-50 text-sky-700 border-sky-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl border ${colors[color] || colors.emerald}`}>
          <Icon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}
