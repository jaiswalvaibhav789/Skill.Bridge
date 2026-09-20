import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = ''
}) {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  const variantStyles = {
    'match-high': 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
    'match-medium': 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold',
    'match-low': 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
    'critical': 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
    'verified': 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold',
    'info': 'bg-blue-50 text-blue-700 border border-blue-200 font-medium',
    'neutral': 'bg-slate-100 text-slate-700 border border-slate-200 font-medium'
  }[variant] || 'bg-slate-100 text-slate-700 border border-slate-200';

  const dotColors = {
    'match-high': 'bg-emerald-500',
    'match-medium': 'bg-amber-500',
    'match-low': 'bg-slate-400',
    'critical': 'bg-rose-500',
    'verified': 'bg-indigo-500',
    'info': 'bg-blue-500',
    'neutral': 'bg-slate-400'
  }[variant] || 'bg-slate-400';

  return (
    <span className={`inline-flex items-center rounded-full ${sizeStyles} ${variantStyles} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors} flex-shrink-0`} />}
      {children}
    </span>
  );
}
