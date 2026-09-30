import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card } from '../common/Card';

export const SentimentChart = ({ distribution }) => {
  const data = [
    { name: 'Positive', value: distribution?.percentages?.positive || 70, color: '#10B981' },
    { name: 'Neutral', value: distribution?.percentages?.neutral || 20, color: '#64748B' },
    { name: 'Negative', value: distribution?.percentages?.negative || 10, color: '#F43F5E' },
  ];

  return (
    <Card hover className="flex flex-col">
      <div className="pb-3 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-white">Customer Sentiment Proportion</h3>
        <p className="text-xs text-slate-400">Classified from chat interactions & ticket messages</p>
      </div>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#f8fafc' }}
              formatter={(value) => [`${value}%`, 'Ratio']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(val) => <span className="text-xs text-slate-300 font-medium">{val}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
