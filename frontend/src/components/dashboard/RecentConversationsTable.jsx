import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatRelativeTime } from '../../utils/formatters';
import { SENTIMENT_CONFIG } from '../../utils/constants';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentConversationsTable = ({ conversations = [] }) => {
  return (
    <Card hover className="relative overflow-hidden group">
      {/* Subtle top edge light reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Live Customer Interactions</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time omnichannel conversations augmented by AI</p>
        </div>
        <Link
          to="/dashboard/conversations"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center space-x-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-800/60 mt-2">
        {conversations.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            <p className="font-semibold text-slate-300">No active interactions</p>
            <p className="text-[11px] text-slate-500 mt-1">New customer conversations will automatically stream here.</p>
          </div>
        ) : (
          conversations.slice(0, 4).map((c) => {
            const sentiment = c.lastMessage?.sentiment || 'neutral';
            const sentimentConf = SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.neutral;

            return (
              <Link
                key={c.id}
                to="/dashboard/conversations"
                className="py-3 flex items-center justify-between hover:bg-slate-800/40 px-2.5 rounded-xl transition-all block group/item"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-cyan-300 flex-shrink-0 group-hover/item:scale-105 transition-transform">
                    {c.customer?.name?.[0] || 'C'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover/item:text-indigo-300 transition-colors truncate">
                      {c.customer?.name || 'Enterprise Customer'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate max-w-sm mt-0.5 font-sans">
                      {c.lastMessage?.content || 'Session active'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 flex-shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${sentimentConf.color}`}>
                    {sentimentConf.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatRelativeTime(c.updated_at || c.created_at)}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </Card>
  );
};
