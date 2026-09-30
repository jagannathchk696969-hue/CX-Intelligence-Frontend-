import React from 'react';
import { Sparkles } from 'lucide-react';

export const SuggestedQuestions = ({ questions = [], onSelect }) => {
  return (
    <div className="py-2">
      <div className="flex items-center space-x-1.5 text-xs text-indigo-400 font-medium mb-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Suggested questions:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q)}
            className="text-xs text-left px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 hover:border-indigo-500/50 transition-all duration-200"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
