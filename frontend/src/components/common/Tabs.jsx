import React from 'react';

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = ''
}) {
  return (
    <div className={`flex border-b border-slate-200 gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition -mb-px ${
              isActive
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                isActive ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
