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
    <Card hover className="relative overflow-hidden group">
      {/* Subtle top edge light reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
          {title}
        </p>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 border border-white/15 group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{value}</h4>
        {change !== undefined && (
          <div
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/25'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
    </Card>
  );
};
