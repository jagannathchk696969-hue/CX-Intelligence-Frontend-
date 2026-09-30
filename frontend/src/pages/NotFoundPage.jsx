import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 bg-grid-pattern relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 shadow-2xl shadow-indigo-500/20 animate-glow-pulse">
          <AlertCircle className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3">
          Error 404 • Resource Not Found
        </span>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Lost in <span className="text-gradient-primary">Hyperspace</span>
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          The requested page or route does not exist, has been archived, or has migrated to another workspace.
        </p>

        <Link to="/dashboard">
          <Button variant="primary" size="lg" icon={ArrowLeft}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
