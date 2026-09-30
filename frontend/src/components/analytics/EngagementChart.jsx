import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Card } from '../common/Card';
import { Zap, Layers } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel-elevated p-3.5 rounded-xl border border-slate-700/80 shadow-2xl text-xs space-y-1.5 backdrop-blur-xl">
        <p className="font-semibold text-white border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
          <span>{label}</span>
          <span className="text-[10px] text-slate-400 font-normal">Interaction Telemetry</span>
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-white font-mono">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const EngagementChart = ({ trends = [] }) => {
  return (
    <Card hover className="flex flex-col">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-tight">Daily Interaction Volume & Resolution</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Live Stream
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">AI Instant Autonomous Deflections vs Agent Human Escalations</p>
        </div>
      </div>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorEscalated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" strokeOpacity={0.6} />
            <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px' }}
              formatter={(val) => <span className="text-xs text-slate-300 font-medium ml-1 mr-3">{val}</span>}
            />
            <Area
              type="monotone"
              dataKey="aiResolved"
              name="AI Resolved"
              stroke="#6366F1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorAi)"
            />
            <Area
              type="monotone"
              dataKey="escalatedToHuman"
              name="Escalated to Agent"
              stroke="#F43F5E"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorEscalated)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const CategoryDistributionChart = ({ categories = [] }) => {
  const total = categories.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <Card hover className="flex flex-col">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-tight">Support Volume by Category</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Taxonomy
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Distribution across technical, billing, and general support</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {categories.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">No categories recorded in current filter period.</p>
        ) : (
          categories.map((c, idx) => {
            const pct = Math.round((c.count / total) * 100);
            const gradients = [
              'from-indigo-500 to-cyan-400',
              'from-cyan-500 to-emerald-400',
              'from-purple-500 to-pink-500',
              'from-amber-500 to-orange-500',
            ];
            const activeGradient = gradients[idx % gradients.length];

            return (
              <div key={c.name} className="space-y-1.5 group">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 capitalize flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {c.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono">{c.count}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({pct}%)</span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-900/90 border border-slate-800 overflow-hidden p-0.5">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full bg-gradient-to-r ${activeGradient} rounded-full transition-all duration-700 ease-out shadow-sm`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
