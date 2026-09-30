import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../common/Card';

export const MetricCard = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  gradient = 'from-indigo-600 to-indigo-800',
}) => {
  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{value}</h4>
        {change !== undefined && (
          <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
    </Card>
  );
};
