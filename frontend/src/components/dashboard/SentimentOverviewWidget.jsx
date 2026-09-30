import React from 'react';
import { Card } from '../common/Card';
import { Smile, Meh, Frown } from 'lucide-react';

export const SentimentOverviewWidget = ({ distribution }) => {
  const p = distribution?.percentages || { positive: 70, neutral: 20, negative: 10 };
  const counts = distribution?.counts || { positive: 14, neutral: 4, negative: 2 };

  return (
    <Card hover className="flex flex-col justify-between relative overflow-hidden group">
      {/* Subtle top edge light reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Customer Sentiment Telemetry</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Real-time emotion & intent detection</p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25">
            {distribution?.totalAnalyzed || 20} Analyzed
          </span>
        </div>

        {/* Progress Bar Breakdown with Glow */}
        <div className="mt-5 space-y-2">
          <div className="h-3 w-full rounded-full bg-slate-900 border border-slate-800 flex overflow-hidden p-0.5 shadow-inner">
            <div
              style={{ width: `${p.positive}%` }}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-l-full shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all duration-500"
              title={`Positive: ${p.positive}%`}
            />
            <div
              style={{ width: `${p.neutral}%` }}
              className="bg-gradient-to-r from-slate-600 to-slate-500 h-full transition-all duration-500"
              title={`Neutral: ${p.neutral}%`}
            />
            <div
              style={{ width: `${p.negative}%` }}
              className="bg-gradient-to-r from-rose-500 to-red-500 h-full rounded-r-full shadow-[0_0_12px_rgba(244,63,94,0.4)] transition-all duration-500"
              title={`Negative: ${p.negative}%`}
            />
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="grid grid-cols-3 gap-2.5 mt-5">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center group-hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-center text-emerald-400 mb-1">
              <Smile className="w-4 h-4 mr-1" />
              <span className="text-xs font-bold">{p.positive}%</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400">{counts.positive} Positive</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-700/80 text-center group-hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-center text-slate-300 mb-1">
              <Meh className="w-4 h-4 mr-1" />
              <span className="text-xs font-bold">{p.neutral}%</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400">{counts.neutral} Neutral</p>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-center group-hover:border-rose-500/40 transition-colors">
            <div className="flex items-center justify-center text-rose-400 mb-1">
              <Frown className="w-4 h-4 mr-1" />
              <span className="text-xs font-bold">{p.negative}%</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400">{counts.negative} Negative</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>⚡ Auto-escalates on negative confidence &gt; 80%</span>
      </div>
    </Card>
  );
};
