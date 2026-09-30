import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glow = false,
  elevated = false,
  ...props
}) => {
  return (
    <div
      className={`relative rounded-2xl p-6 transition-all duration-300 ${
        elevated ? 'glass-panel-elevated' : 'glass-panel'
      } ${
        hover
          ? 'hover:border-slate-600/80 hover:shadow-2xl hover:-translate-y-0.5'
          : ''
      } ${glow ? 'glow-indigo' : ''} ${className}`}
      {...props}
    >
      {/* Subtle top edge light reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none rounded-t-2xl" />
      {children}
    </div>
  );
};
