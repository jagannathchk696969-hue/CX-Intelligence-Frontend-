import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div
          className={`relative w-full ${maxWidth} glass-panel-elevated border border-slate-700/80 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] p-6 overflow-hidden animate-scale-in z-10`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle top edge light reflection */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

          <div className="flex items-start justify-between pb-4 border-b border-slate-800/80">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
              {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-all"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-slate-800/60 via-slate-750/80 to-slate-800/60 rounded-xl ${className}`} />
  );
};
