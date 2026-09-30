import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { chatService } from '../services/chatService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';
import { SENTIMENT_CONFIG } from '../utils/constants';
import { MessageSquare, ShieldAlert, CheckCircle2, User, Bot, Search } from 'lucide-react';

export const ConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedConv, setSelectedConv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [convLoading, setConvLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const toast = useToast();

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const data = await chatService.getConversations();
      setConversations(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const fetchDetail = async () => {
      setConvLoading(true);
      try {
        const detail = await chatService.getConversationById(selectedId);
        setSelectedConv(detail);
      } catch (err) {
        toast.error('Failed to load conversation messages');
      } finally {
        setConvLoading(false);
      }
    };
    fetchDetail();
  }, [selectedId]);

  const handleEscalate = async (id) => {
    try {
      await chatService.escalateConversation(id, 'Agent requested escalation from conversations view');
      toast.success('Conversation escalated to human agent queue');
      fetchConversations();
      const updated = await chatService.getConversationById(id);
      setSelectedConv(updated);
    } catch (err) {
      toast.error('Failed to escalate conversation');
    }
  };

  const filteredConversations = statusFilter
    ? conversations.filter((c) => c.status === statusFilter)
    : conversations;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Customer Conversations</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review live and resolved conversational sessions, sentiment indicators, and escalation records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[680px]">
        {/* Left Column: Conversations List */}
        <div className="lg:col-span-1 glass-panel rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <span className="text-xs font-semibold text-white">Conversations ({filteredConversations.length})</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 px-2 py-1"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
            {loading ? (
              <p className="text-xs text-slate-400 py-8 text-center">Loading sessions...</p>
            ) : filteredConversations.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No conversations found.</p>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === selectedId;
                const sentiment = c.lastMessage?.sentiment || 'neutral';
                const sentimentConf = SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.neutral;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-600/15 border-l-4 border-indigo-500' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-white truncate">{c.customer?.name || 'Client'}</p>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border ${
                        c.status === 'escalated' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-slate-400 bg-slate-800 border-slate-700'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate">{c.lastMessage?.content || 'Started chat'}</p>

                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span className={`px-1.5 py-0.2 rounded border ${sentimentConf.color}`}>
                        {sentimentConf.label}
                      </span>
                      <span>{formatDate(c.updated_at || c.created_at)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Message Thread Inspection */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
          {selectedConv ? (
            <>
              {/* Header */}
              <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 text-xs font-semibold">
                    {selectedConv.customer?.name?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{selectedConv.customer?.name || 'Client'}</p>
                    <p className="text-[11px] text-slate-400">{selectedConv.customer?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedConv.status !== 'escalated' && (
                    <Button
                      variant="danger"
                      size="sm"
                      icon={ShieldAlert}
                      onClick={() => handleEscalate(selectedConv.id)}
                    >
                      Escalate to Tier 2
                    </Button>
                  )}
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3">
                {convLoading ? (
                  <p className="text-xs text-slate-400 py-8 text-center">Loading conversation messages...</p>
                ) : (
                  (selectedConv.messages || []).map((m) => {
                    const isCust = m.sender_type === 'customer';
                    const isAi = m.sender_type === 'ai_assistant';

                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed ${
                          isCust
                            ? 'ml-auto bg-indigo-600 text-white rounded-tr-none'
                            : 'glass-panel border border-slate-800 text-slate-100 rounded-tl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 text-[10px] text-slate-300">
                          <span className="font-semibold">{isCust ? 'Customer' : isAi ? 'AI Assistant' : 'Staff Agent'}</span>
                          <span>{formatDate(m.created_at)}</span>
                        </div>
                        <p className="whitespace-pre-line">{m.content}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              Select a conversation from the left to view message history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
