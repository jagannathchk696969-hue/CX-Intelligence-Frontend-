import React from 'react';
import { Sparkles } from 'lucide-react';

export const SuggestedQuestions = ({ questions = [], onSelect }) => {
  return (
    <div className="py-1">
      <div className="flex items-center space-x-1.5 text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>Frequently Asked:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(q)}
            className="text-xs text-left px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-200 active:scale-[0.98]"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
