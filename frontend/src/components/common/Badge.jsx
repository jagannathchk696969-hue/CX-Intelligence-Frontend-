import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  ping = false,
  className = '',
}) => {
  const variants = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
    primary: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]',
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]',
  };

  const dotColors = {
    default: 'bg-slate-400',
    primary: 'bg-indigo-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-0.5 text-xs gap-1.5',
    md: 'px-3 py-1 text-xs sm:text-sm gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border backdrop-blur-sm transition-colors ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.sm} ${className}`}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {ping && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                dotColors[variant] || 'bg-slate-400'
              }`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
              dotColors[variant] || 'bg-slate-400'
            }`}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
