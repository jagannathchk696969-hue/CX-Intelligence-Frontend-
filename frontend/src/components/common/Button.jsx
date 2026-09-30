import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none overflow-hidden';

  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-600 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-600 text-white shadow-lg shadow-violet-600/30 border border-violet-400/30 focus:ring-violet-500',
    secondary: 'bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700/80 hover:border-slate-600 shadow-sm focus:ring-slate-500',
    outline: 'border border-slate-700/80 hover:border-violet-500/50 text-slate-300 hover:text-white bg-slate-900/40 hover:bg-violet-500/10 focus:ring-violet-500',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/60 focus:ring-slate-700',
    danger: 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-600/25 border border-rose-500/30 focus:ring-rose-500',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 border border-emerald-500/30 focus:ring-emerald-500',
    cyan: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/25 border border-cyan-500/30 focus:ring-cyan-500',
    violet: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-600/30 border border-violet-400/30 focus:ring-violet-500',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs space-x-1.5 rounded-lg',
    sm: 'px-3 py-1.5 text-xs font-semibold space-x-1.5',
    md: 'px-4 py-2.5 text-xs sm:text-sm font-semibold space-x-2',
    lg: 'px-5 py-3 text-sm sm:text-base font-semibold space-x-2.5',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin mr-2 flex-shrink-0" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
