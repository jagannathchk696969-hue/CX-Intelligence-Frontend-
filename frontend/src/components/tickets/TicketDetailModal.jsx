import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '../../utils/constants';
import { Send, User, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';

export const TicketDetailModal = ({
  isOpen,
  onClose,
  ticket,
  onUpdateStatus,
  onAddMessage,
}) => {
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [statusVal, setStatusVal] = useState(ticket?.status || 'open');

  if (!ticket) return null;

  const priorityConf = TICKET_PRIORITIES[ticket.priority?.toUpperCase()] || TICKET_PRIORITIES.MEDIUM;
  const statusConf = TICKET_STATUSES[ticket.status?.toUpperCase()] || TICKET_STATUSES.OPEN;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await onAddMessage(ticket.id, { content: replyText, isInternal });
      setReplyText('');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatusVal(newStatus);
    await onUpdateStatus(ticket.id, { status: newStatus });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ticket.subject}
      subtitle={`Ticket #${ticket.id.slice(0, 8)} • Created ${formatDate(ticket.created_at)}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Ticket Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${priorityConf.color}`}>
              {priorityConf.label}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${statusConf.color}`}>
              {statusConf.label}
            </span>
            <span className="text-xs text-slate-400 capitalize bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
              {ticket.category}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Status:</span>
            <select
              value={statusVal}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 px-2.5 py-1 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_for_customer">Waiting on Customer</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Customer Information */}
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs flex justify-between items-center">
          <div>
            <span className="text-slate-400">Customer: </span>
            <span className="font-semibold text-white">{ticket.customer?.name || 'Client'}</span>
            <span className="text-slate-400"> ({ticket.customer?.email || 'N/A'})</span>
          </div>
          {ticket.sentiment_score !== null && (
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400">AI Sentiment Index:</span>
              <span className={`font-semibold ${ticket.sentiment_score < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {ticket.sentiment_score}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-sm text-slate-200">
          <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Initial Issue Description:</p>
          <p className="whitespace-pre-line leading-relaxed">{ticket.description}</p>
        </div>

        {/* Timeline Messages */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conversation History & Notes:</p>
          {(ticket.messages || []).length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">No replies or notes recorded yet.</p>
          ) : (
            ticket.messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  m.is_internal
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-slate-800/60 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5 font-semibold">
                    {m.is_internal && <Lock className="w-3 h-3 text-amber-400" />}
                    <span>{m.is_internal ? 'Internal Staff Note' : (m.sender_type === 'customer' ? 'Customer Reply' : 'Agent Response')}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{formatDate(m.created_at)}</span>
                </div>
                <p className="whitespace-pre-line">{m.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Reply Composer */}
        <form onSubmit={handleSend} className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300">Add Reply or Internal Note:</span>
            <label className="flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                Internal Note (Staff only)
              </span>
            </label>
          </div>

          <textarea
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={isInternal ? 'Write an internal staff note...' : 'Write a customer-visible reply...'}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              variant={isInternal ? 'secondary' : 'primary'}
              isLoading={sending}
              icon={Send}
            >
              {isInternal ? 'Save Internal Note' : 'Send Customer Reply'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
