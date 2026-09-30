import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Card } from '../common/Card';

export const EngagementChart = ({ trends = [] }) => {
  return (
    <Card hover className="flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-white">Daily Interaction Volume & Resolution</h3>
          <p className="text-xs text-slate-400">AI Instant Resolutions vs Agent Human Escalations</p>
        </div>
      </div>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorEscalated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              formatter={(val) => <span className="text-xs text-slate-300 font-medium">{val}</span>}
            />
            <Area
              type="monotone"
              dataKey="aiResolved"
              name="AI Resolved"
              stroke="#6366F1"
              strokeWidth={2}
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
  return (
    <Card hover className="flex flex-col">
      <div className="pb-3 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-white">Support Volume by Category</h3>
        <p className="text-xs text-slate-400">Distribution across technical, billing, and general support</p>
      </div>

      <div className="mt-4 space-y-3">
        {categories.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No categories recorded.</p>
        ) : (
          categories.map((c) => {
            const total = categories.reduce((sum, item) => sum + item.count, 0) || 1;
            const pct = Math.round((c.count / total) * 100);

            return (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200 capitalize">{c.name}</span>
                  <span className="text-slate-400">{c.count} tickets ({pct}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
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
