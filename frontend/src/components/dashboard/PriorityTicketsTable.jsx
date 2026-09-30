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
    <Card hover>
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-white">Active Priority Tickets</h3>
          <p className="text-xs text-slate-400">Escalated and high-impact issues requiring agent action</p>
        </div>
        <Link
          to="/dashboard/tickets"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center space-x-1"
        >
          <span>All Tickets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-800/80 mt-2">
        {priorityTickets.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No open tickets. All customer issues resolved!</p>
        ) : (
          priorityTickets.map((t) => {
            const pConf = TICKET_PRIORITIES[t.priority.toUpperCase()] || TICKET_PRIORITIES.MEDIUM;
            const sConf = TICKET_STATUSES[t.status.toUpperCase()] || TICKET_STATUSES.OPEN;

            return (
              <div key={t.id} className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition-colors">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pConf.color}`}>
                      {pConf.label}
                    </span>
                    <p className="text-xs font-semibold text-white truncate">{t.subject}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    Customer: {t.customer?.name || 'Client'} • Assigned: {t.assignedAgent?.fullName || 'Unassigned'}
                  </p>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${sConf.color}`}>
                    {sConf.label}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatRelativeTime(t.created_at)}
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
