import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { TicketDetailModal } from '../components/tickets/TicketDetailModal';
import { TicketFormModal } from '../components/tickets/TicketFormModal';
import { ticketService } from '../services/ticketService';
import { customerService } from '../services/customerService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '../utils/constants';
import { Plus, Search, Filter, MessageSquare, AlertCircle } from 'lucide-react';

export const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const toast = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await ticketService.getTickets({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        search: search || undefined,
      });
      setTickets(data);
    } catch (err) {
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter, search]);

  useEffect(() => {
    customerService.getCustomers().then(setCustomers).catch(() => {});
  }, []);

  const handleOpenDetail = async (ticket) => {
    try {
      const fullTicket = await ticketService.getTicketById(ticket.id);
      setSelectedTicket(fullTicket);
      setDetailOpen(true);
    } catch (err) {
      toast.error('Failed to fetch ticket conversation history');
    }
  };

  const handleUpdateStatus = async (ticketId, updates) => {
    try {
      const updated = await ticketService.updateTicket(ticketId, updates);
      toast.success('Ticket status updated successfully');
      fetchTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket((prev) => ({ ...prev, ...updated }));
      }
    } catch (err) {
      toast.error('Failed to update ticket');
    }
  };

  const handleAddMessage = async (ticketId, data) => {
    try {
      const msg = await ticketService.addMessage(ticketId, data);
      toast.success(data.isInternal ? 'Internal staff note saved' : 'Customer reply dispatched');
      // Refresh detail
      const fullTicket = await ticketService.getTicketById(ticketId);
      setSelectedTicket(fullTicket);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to append reply');
    }
  };

  const handleCreateTicket = async (data) => {
    try {
      const newTix = await ticketService.createTicket(data);
      toast.success(`Ticket created! AI suggested priority: ${newTix.ai_suggested_priority.toUpperCase()}`);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to create ticket');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Support Tickets</h1>
          <p className="text-xs text-slate-400 mt-1">
            Omnichannel ticket queue with automated AI urgency ranking, internal collaboration, and customer replies.
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={() => setCreateOpen(true)}>
          New Ticket
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card hover className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject, description..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_for_customer">Waiting on Customer</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Ticket Table */}
      <Card hover className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Subject & Details</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Loading tickets...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No tickets found matching your query.</td>
                </tr>
              ) : (
                tickets.map((t) => {
                  const pConf = TICKET_PRIORITIES[t.priority.toUpperCase()] || TICKET_PRIORITIES.MEDIUM;
                  const sConf = TICKET_STATUSES[t.status.toUpperCase()] || TICKET_STATUSES.OPEN;

                  return (
                    <tr
                      key={t.id}
                      onClick={() => handleOpenDetail(t)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-medium text-slate-100 max-w-xs">
                        <div className="truncate font-semibold text-white">{t.subject}</div>
                        <div className="text-[11px] text-slate-400 truncate">{t.description}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {t.customer?.name || 'Client'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pConf.color}`}>
                          {pConf.label}
                        </span>
                        {t.ai_suggested_priority && t.ai_suggested_priority !== t.priority && (
                          <span className="block text-[9px] text-amber-400 mt-0.5">
                            AI: {t.ai_suggested_priority}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sConf.color}`}>
                          {sConf.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {t.assignedAgent?.fullName || <span className="text-slate-500 italic">Unassigned</span>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formatDate(t.created_at)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(t);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 text-xs font-medium"
                        >
                          View Thread
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Ticket Modals */}
      <TicketDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        ticket={selectedTicket}
        onUpdateStatus={handleUpdateStatus}
        onAddMessage={handleAddMessage}
      />

      <TicketFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateTicket}
        customers={customers}
      />
    </div>
  );
};
