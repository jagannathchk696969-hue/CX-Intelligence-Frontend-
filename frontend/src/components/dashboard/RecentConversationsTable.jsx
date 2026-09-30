import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatRelativeTime } from '../../utils/formatters';
import { SENTIMENT_CONFIG } from '../../utils/constants';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentConversationsTable = ({ conversations = [] }) => {
  return (
    <Card hover>
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-white">Live Customer Interactions</h3>
          <p className="text-xs text-slate-400">Real-time conversations assisted by AI</p>
        </div>
        <Link
          to="/dashboard/conversations"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-800/80 mt-2">
        {conversations.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No conversations recorded yet.</p>
        ) : (
          conversations.slice(0, 4).map((c) => {
            const sentiment = c.lastMessage?.sentiment || 'neutral';
            const sentimentConf = SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.neutral;

            return (
              <div key={c.id} className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition-colors">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-indigo-400">
                    {c.customer?.name?.[0] || 'C'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{c.customer?.name || 'Guest User'}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs">{c.lastMessage?.content || 'Started session'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${sentimentConf.color}`}>
                    {sentimentConf.label}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatRelativeTime(c.updated_at || c.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
