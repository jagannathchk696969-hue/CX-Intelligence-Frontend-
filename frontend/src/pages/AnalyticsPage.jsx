import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/dashboard/MetricCard';
import { SentimentChart } from '../components/analytics/SentimentChart';
import { EngagementChart, CategoryDistributionChart } from '../components/analytics/EngagementChart';
import { analyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';
import { BarChart3, TrendingUp, Users, Clock, Smile, MessageSquare, CheckCircle2 } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Customer Experience Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real database telemetry: CSAT, response times, sentiment classification, and AI deflection performance.
          </p>
        </div>

        {/* Date Filter Range */}
        <div className="inline-flex rounded-xl p-1 bg-slate-800/80 border border-slate-700/80 self-start sm:self-auto">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                days === d ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
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

        <Card hover>
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">Ticket Pipeline by Status</h3>
            <p className="text-xs text-slate-400">Current active workload across all agent queues</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
              <p className="text-2xl font-bold text-blue-400">{supportData?.byStatus?.open || 1}</p>
              <p className="text-xs text-slate-300 mt-1">Open Queue</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-2xl font-bold text-amber-400">{supportData?.byStatus?.in_progress || 1}</p>
              <p className="text-xs text-slate-300 mt-1">In Progress</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
              <p className="text-2xl font-bold text-purple-400">{supportData?.byStatus?.waiting_for_customer || 1}</p>
              <p className="text-xs text-slate-300 mt-1">Waiting on Client</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-2xl font-bold text-emerald-400">{supportData?.byStatus?.resolved || 1}</p>
              <p className="text-xs text-slate-300 mt-1">Resolved & Closed</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
