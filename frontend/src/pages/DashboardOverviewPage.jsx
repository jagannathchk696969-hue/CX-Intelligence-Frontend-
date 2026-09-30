import React, { useState, useEffect } from 'react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { SentimentOverviewWidget } from '../components/dashboard/SentimentOverviewWidget';
import { RecentConversationsTable } from '../components/dashboard/RecentConversationsTable';
import { PriorityTicketsTable } from '../components/dashboard/PriorityTicketsTable';
import { analyticsService } from '../services/analyticsService';
import { chatService } from '../services/chatService';
import { ticketService } from '../services/ticketService';
import { Users, MessageSquare, Ticket, Clock, Star, Zap } from 'lucide-react';

export const DashboardOverviewPage = () => {
  const [period, setPeriod] = useState(30);
  const [overview, setOverview] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ov, sent, convs, tix] = await Promise.all([
          analyticsService.getOverview(period),
          analyticsService.getSentimentDistribution(period),
          chatService.getConversations(),
          ticketService.getTickets(),
        ]);
        setOverview(ov);
        setSentimentData(sent);
        setConversations(convs);
        setTickets(tix);
      } catch (err) {
        console.error('Failed to load dashboard overview data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  return (
    <div className="space-y-6">
      {/* Page Header with Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-[10px] font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autonomous CX Telemetry Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive <span className="text-gradient-primary">CX Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time customer experience health, automated AI resolution telemetry, and sentiment monitoring.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="inline-flex rounded-xl p-1 bg-slate-900/90 border border-slate-700/80 self-start sm:self-auto shadow-inner">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                period === days
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Last {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Customers"
          value={overview?.totalCustomers || '5'}
          change="+18.2%"
          isPositive={true}
          icon={Users}
          gradient="from-indigo-600 to-indigo-800"
        />
        <MetricCard
          title="Total Conversations"
          value={overview?.totalConversations || '3'}
          change="+24.5%"
          isPositive={true}
          icon={MessageSquare}
          gradient="from-cyan-500 to-blue-600"
        />
        <MetricCard
          title="Open Support Tickets"
          value={overview?.openTickets || '3'}
          change="-12.0%"
          isPositive={true}
          icon={Ticket}
          gradient="from-amber-500 to-orange-600"
        />
        <MetricCard
          title="Customer Satisfaction"
          value={`${overview?.csatScore || '4.8'} / 5.0`}
          change="+0.3 pt"
          isPositive={true}
          icon={Star}
          gradient="from-emerald-500 to-teal-600"
        />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-slate-800">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Avg Response Time</p>
            <p className="text-xl font-bold text-white mt-1">{overview?.avgFirstResponseMinutes || 8.5} mins</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-slate-800">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Avg Resolution Time</p>
            <p className="text-xl font-bold text-white mt-1">{overview?.avgResolutionHours || 4.2} hours</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-slate-800">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">AI Autonomous Resolution</p>
            <p className="text-xl font-bold text-white mt-1">{overview?.aiResolutionRate || 78.4}%</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Star className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Middle Row: Sentiment Telemetry + Priority Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SentimentOverviewWidget distribution={sentimentData} />
        </div>
        <div className="lg:col-span-2">
          <PriorityTicketsTable tickets={tickets} />
        </div>
      </div>

      {/* Bottom Row: Recent Live Conversations */}
      <div>
        <RecentConversationsTable conversations={conversations} />
      </div>
    </div>
  );
};
