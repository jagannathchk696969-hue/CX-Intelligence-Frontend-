import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatRelativeTime } from '../../utils/formatters';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '../../utils/constants';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PriorityTicketsTable = ({ tickets = [] }) => {
  const priorityTickets = tickets
    .filter(t => t.status !== 'resolved' && t.status !== 'closed')
    .sort((a, b) => {
      const pWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
    })
    .slice(0, 4);

  return (
    <Card hover className="relative overflow-hidden group">
      {/* Subtle top edge light reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Active Priority Tickets</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">High-impact issues requiring agent investigation</p>
        </div>
        <Link
          to="/dashboard/tickets"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center space-x-1 transition-colors"
        >
          <span>All Tickets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-800/60 mt-2">
        {priorityTickets.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            <p className="font-semibold text-slate-300">All customer issues resolved!</p>
            <p className="text-[11px] text-slate-500 mt-1">No open priority tickets pending agent review.</p>
          </div>
        ) : (
          priorityTickets.map((t) => {
            const pConf = TICKET_PRIORITIES[t.priority?.toUpperCase()] || TICKET_PRIORITIES.MEDIUM;
            const sConf = TICKET_STATUSES[t.status?.toUpperCase()] || TICKET_STATUSES.OPEN;

            return (
              <Link
                key={t.id}
                to="/dashboard/tickets"
                className="py-3 flex items-center justify-between hover:bg-slate-800/40 px-2.5 rounded-xl transition-all block group/row"
              >
                <div className="min-w-0 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${pConf.color}`}>
                      {pConf.label}
                    </span>
                    <p className="text-xs font-bold text-white group-hover/row:text-indigo-300 transition-colors truncate">
                      {t.subject}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-1">
                    Customer: <span className="text-slate-300 font-medium">{t.customer?.name || 'Enterprise Client'}</span> • Assigned: <span className="text-slate-300">{t.assignedAgent?.fullName || 'Unassigned'}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${sConf.color}`}>
                    {sConf.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatRelativeTime(t.created_at)}
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
