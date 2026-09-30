import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/dashboard/MetricCard';
import { SentimentChart } from '../components/analytics/SentimentChart';
import { EngagementChart, CategoryDistributionChart } from '../components/analytics/EngagementChart';
import { analyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';
import { BarChart3, TrendingUp, Users, Clock, Smile, MessageSquare, CheckCircle2, ShieldCheck, Calendar } from 'lucide-react';

export const AnalyticsPage = () => {
  const [days, setDays] = useState(30);
  const [overview, setOverview] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [trends, setTrends] = useState([]);
  const [supportData, setSupportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [ov, sent, tr, sup] = await Promise.all([
          analyticsService.getOverview(days),
          analyticsService.getSentimentDistribution(days),
          analyticsService.getEngagementTrends(days === 7 ? 7 : 14),
          analyticsService.getSupportBreakdown(),
        ]);
        setOverview(ov);
        setSentimentData(sent);
        setTrends(tr);
        setSupportData(sup);
      } catch (err) {
        toast.error('Failed to load customer analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [days]);

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Platform Intelligence Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Experience <span className="text-gradient-primary">Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time telemetry measuring CSAT, autonomous AI deflection, resolution velocity, and sentiment classification.
          </p>
        </div>

        {/* Date Filter Range */}
        <div className="inline-flex items-center rounded-xl p-1 bg-slate-900/90 border border-slate-700/80 shadow-inner backdrop-blur-xl self-start lg:self-center">
          <Calendar className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                days === d
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d === 7 ? 'Last 7 Days' : d === 30 ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Customer Satisfaction"
          value={`${overview?.csatScore || 4.8} / 5.0`}
          change="+0.3 pt"
          isPositive={true}
          icon={Smile}
          gradient="from-emerald-500 to-teal-600"
        />
        <MetricCard
          title="AI Resolution Deflection"
          value={`${overview?.aiResolutionRate || 78.4}%`}
          change="+4.6%"
          isPositive={true}
          icon={CheckCircle2}
          gradient="from-indigo-600 to-cyan-600"
        />
        <MetricCard
          title="Avg First Response"
          value={`${overview?.avgFirstResponseMinutes || 8.5}m`}
          change="-2.1m"
          isPositive={true}
          icon={Clock}
          gradient="from-blue-600 to-indigo-700"
        />
        <MetricCard
          title="Mean Resolution Time"
          value={`${overview?.avgResolutionHours || 4.2}h`}
          change="-1.2h"
          isPositive={true}
          icon={TrendingUp}
          gradient="from-purple-600 to-pink-600"
        />
      </div>

      {/* Recharts Row 1: Daily Engagement Trends + Sentiment Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EngagementChart trends={trends} />
        </div>
        <div className="lg:col-span-1">
          <SentimentChart distribution={sentimentData} />
        </div>
      </div>

      {/* Recharts Row 2: Category Breakdown + Ticket Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryDistributionChart categories={supportData?.byCategory || []} />

        <Card hover className="flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white tracking-tight">Ticket Pipeline by Status</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Operations
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Active workload balance across omnichannel support queues</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 text-center relative overflow-hidden group hover:border-blue-500/40 transition-all">
              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/10 rounded-bl-full pointer-events-none" />
              <p className="text-3xl font-black text-blue-400 font-mono tracking-tight">
                {supportData?.byStatus?.open || 1}
              </p>
              <p className="text-xs font-semibold text-slate-200 mt-1">Open Queue</p>
              <span className="text-[10px] text-blue-400/80 font-medium">Awaiting Triaging</span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-center relative overflow-hidden group hover:border-amber-500/40 transition-all">
              <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 rounded-bl-full pointer-events-none" />
              <p className="text-3xl font-black text-amber-400 font-mono tracking-tight">
                {supportData?.byStatus?.in_progress || 1}
              </p>
              <p className="text-xs font-semibold text-slate-200 mt-1">In Progress</p>
              <span className="text-[10px] text-amber-400/80 font-medium">Under Active Review</span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 text-center relative overflow-hidden group hover:border-purple-500/40 transition-all">
              <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/10 rounded-bl-full pointer-events-none" />
              <p className="text-3xl font-black text-purple-400 font-mono tracking-tight">
                {supportData?.byStatus?.waiting_for_customer || 1}
              </p>
              <p className="text-xs font-semibold text-slate-200 mt-1">Waiting on Client</p>
              <span className="text-[10px] text-purple-400/80 font-medium">Customer Reply Pending</span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 text-center relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
              <p className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                {supportData?.byStatus?.resolved || 1}
              </p>
              <p className="text-xs font-semibold text-slate-200 mt-1">Resolved & Closed</p>
              <span className="text-[10px] text-emerald-400/80 font-medium">SLA Satisfied</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
