import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '../../utils/constants';
import { Send, User, Lock, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';

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
      subtitle={`Ticket #${ticket.id.slice(0, 8)} • Logged ${formatDate(ticket.created_at)}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Ticket Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold shadow-sm ${priorityConf.color}`}>
              {priorityConf.label}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold shadow-sm ${statusConf.color}`}>
              {statusConf.label}
            </span>
            <span className="text-xs text-slate-300 capitalize bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/80 font-medium">
              {ticket.category}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Change Status:</span>
            <select
              value={statusVal}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_for_customer">Waiting on Customer</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Customer Information Bar */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
              {ticket.customer?.name?.[0] || 'C'}
            </div>
            <div>
              <span className="text-slate-400">Customer: </span>
              <span className="font-semibold text-white">{ticket.customer?.name || 'Client'}</span>
              <span className="text-slate-400 font-mono text-[11px]"> ({ticket.customer?.email || 'N/A'})</span>
            </div>
          </div>
          {ticket.sentiment_score !== null && (
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400">AI Sentiment Index:</span>
              <span className={`font-bold font-mono text-xs ${ticket.sentiment_score < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {ticket.sentiment_score > 0 ? `+${ticket.sentiment_score}` : ticket.sentiment_score}
              </span>
            </div>
          )}
        </div>

        {/* Description Callout */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-cyan-500" />
          <p className="text-[11px] text-indigo-400 font-semibold mb-1 uppercase tracking-wider">Initial Issue Description:</p>
          <p className="whitespace-pre-line leading-relaxed text-slate-200">{ticket.description}</p>
        </div>

        {/* Timeline Messages */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Conversation History & Internal Notes</span>
            </p>
            <span className="text-[10px] text-slate-500">{(ticket.messages || []).length} logs</span>
          </div>

          {(ticket.messages || []).length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
              No replies or internal notes recorded yet. Use the composer below.
            </div>
          ) : (
            ticket.messages.map((m) => {
              const isInternalNote = m.is_internal;
              const isCustomer = m.sender_type === 'customer';

              return (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                    isInternalNote
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-200 shadow-sm'
                      : isCustomer
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                      : 'bg-indigo-950/20 border-indigo-500/30 text-indigo-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5 font-semibold text-[11px]">
                      {isInternalNote ? (
                        <>
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-400 uppercase tracking-wide">Internal Staff Note</span>
                        </>
                      ) : isCustomer ? (
                        <>
                          <User className="w-3 h-3 text-cyan-400" />
                          <span className="text-cyan-300">Customer Reply</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          <span className="text-indigo-300">Agent Response</span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{formatDate(m.created_at)}</span>
                  </div>
                  <p className="whitespace-pre-line leading-relaxed">{m.content}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Reply Composer */}
        <form onSubmit={handleSend} className="space-y-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Compose Response</span>
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
              />
              <span className="flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3 text-amber-400" />
                <span className={isInternal ? 'text-amber-300 font-semibold' : 'text-slate-400'}>
                  Staff-Only Note
                </span>
              </span>
            </label>
          </div>

          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={isInternal ? 'Write a private internal note (visible only to support agents)...' : 'Write a customer-visible reply...'}
            className={`w-full bg-slate-900/90 border rounded-xl p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all shadow-inner ${
              isInternal
                ? 'border-amber-500/40 focus:ring-amber-500'
                : 'border-slate-700/80 focus:ring-indigo-500'
            }`}
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
