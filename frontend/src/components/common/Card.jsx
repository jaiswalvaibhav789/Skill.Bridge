import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  action,
  icon: Icon,
  variant = 'default',
  className = '',
  bodyClassName = '',
  ...props
}) {
  const variantStyles = {
    default: 'bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow',
    glass: 'glass-panel shadow-glass',
    flat: 'bg-slate-50 border border-slate-200',
    elevated: 'bg-white border border-slate-100 shadow-elevated'
  }[variant] || 'bg-white border border-slate-200 shadow-sm';

  const hasHeader = title || subtitle || action || Icon;

  return (
    <div className={`rounded-2xl overflow-hidden ${variantStyles} ${className}`} {...props}>
      {hasHeader && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && <h3 className="font-display font-semibold text-slate-900 text-base leading-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}
