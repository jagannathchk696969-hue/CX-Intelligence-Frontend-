import React from 'react';
import { Card } from '../common/Card';
import { Smile, Meh, Frown } from 'lucide-react';

export const SentimentOverviewWidget = ({ distribution }) => {
  const p = distribution?.percentages || { positive: 70, neutral: 20, negative: 10 };
  const counts = distribution?.counts || { positive: 14, neutral: 4, negative: 2 };

  return (
    <Card hover className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white">Customer Sentiment Telemetry</h3>
          <span className="text-[11px] text-slate-400">Total Analyzed: {distribution?.totalAnalyzed || 20}</span>
        </div>

        {/* Progress Bar Breakdown */}
        <div className="mt-5 space-y-2">
          <div className="h-3 w-full rounded-full bg-slate-800 flex overflow-hidden p-0.5">
            <div
              style={{ width: `${p.positive}%` }}
              className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
              title={`Positive: ${p.positive}%`}
            />
            <div
              style={{ width: `${p.neutral}%` }}
              className="bg-slate-500 h-full transition-all duration-500"
              title={`Neutral: ${p.neutral}%`}
            />
            <div
              style={{ width: `${p.negative}%` }}
              className="bg-rose-500 h-full rounded-r-full transition-all duration-500"
              title={`Negative: ${p.negative}%`}
            />
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="flex items-center justify-center text-emerald-400 mb-1">
              <Smile className="w-4 h-4 mr-1" />
              <span className="text-xs font-semibold">{p.positive}%</span>
            </div>
            <p className="text-[11px] text-slate-400">{counts.positive} Positive</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-700/30 border border-slate-700 text-center">
            <div className="flex items-center justify-center text-slate-300 mb-1">
              <Meh className="w-4 h-4 mr-1" />
              <span className="text-xs font-semibold">{p.neutral}%</span>
            </div>
            <p className="text-[11px] text-slate-400">{counts.neutral} Neutral</p>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <div className="flex items-center justify-center text-rose-400 mb-1">
              <Frown className="w-4 h-4 mr-1" />
              <span className="text-xs font-semibold">{p.negative}%</span>
            </div>
            <p className="text-[11px] text-slate-400">{counts.negative} Negative</p>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 mt-4 border-t border-slate-800/80 pt-3">
        * Sentiment auto-triggers priority escalation when negative threshold exceeds 80% confidence.
      </p>
    </Card>
  );
};
