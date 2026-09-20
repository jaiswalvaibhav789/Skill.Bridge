import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  }[size] || 'px-4 py-2.5 text-sm gap-2';

  const variantStyles = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500 shadow-sm hover:shadow active:scale-[0.98]',
    ayush: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-sm hover:shadow active:scale-[0.98]',
    secondary: 'bg-slate-800 hover:bg-slate-900 text-white focus:ring-slate-700',
    outline: 'border border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-200',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-sm'
  }[variant] || 'bg-brand-600 hover:bg-brand-700 text-white';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
}
