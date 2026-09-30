import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${
        hover ? 'hover:border-slate-600 hover:shadow-xl' : ''
      } ${glow ? 'glow-indigo' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
