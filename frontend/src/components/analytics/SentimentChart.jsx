import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../common/Card';
import { Heart } from 'lucide-react';

const CustomSentimentTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-panel-elevated p-3 rounded-xl border border-slate-700/80 shadow-2xl text-xs space-y-1 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-semibold text-white">{data.name} Sentiment</span>
        </div>
        <p className="text-slate-300 text-[11px] font-mono">
          Ratio: <span className="font-bold text-white text-xs">{data.value}%</span> of interactions
        </p>
      </div>
    );
  }
  return null;
};

export const SentimentChart = ({ distribution }) => {
  const data = [
    { name: 'Positive', value: distribution?.percentages?.positive || 70, color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)' },
    { name: 'Neutral', value: distribution?.percentages?.neutral || 20, color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.3)' },
    { name: 'Negative', value: distribution?.percentages?.negative || 10, color: '#F43F5E', glow: 'rgba(244, 63, 94, 0.4)' },
  ];

  return (
    <Card hover className="flex flex-col">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-tight">Customer Sentiment Proportion</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              NLP Model
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Real-time tone classification from chats & support tickets</p>
        </div>
      </div>

      <div className="h-56 w-full mt-2 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={4}
              dataKey="value"
              stroke="#0f172a"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomSentimentTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black text-white font-mono tracking-tight">
            {distribution?.percentages?.positive || 70}%
          </span>
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Positive</span>
        </div>
      </div>

      {/* Styled Legend Chips */}
      <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-800/80">
        {data.map((d) => (
          <div key={d.name} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-[11px] font-medium text-slate-300">{d.name}</span>
            </div>
            <span className="text-xs font-bold text-white font-mono">{d.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
