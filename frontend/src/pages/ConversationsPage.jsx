import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { chatService } from '../services/chatService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatters';
import { SENTIMENT_CONFIG } from '../utils/constants';
import { MessageSquare, ShieldAlert, CheckCircle2, User, Bot, Search, Clock, ArrowRight, Sparkles } from 'lucide-react';

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Real-Time Interaction Transcripts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer <span className="text-gradient-primary">Conversations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Audit live and archived customer dialogues, monitor sentiment scores, and trigger Tier 2 agent handoffs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{filteredConversations.length} Active Sessions</span>
        </div>
      </div>

      {/* Main Split-Pane Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        {/* Left Column: Conversations List */}
        <div className="lg:col-span-4 glass-panel rounded-2xl border border-slate-800/80 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/70">
            <span className="text-xs font-semibold text-white tracking-tight">
              Inbox ({filteredConversations.length})
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-300 px-2.5 py-1 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-xs text-slate-400">Loading conversation threads...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-300">No sessions match your filter.</p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === selectedId;
                const sentiment = c.lastMessage?.sentiment || 'neutral';
                const sentimentConf = SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.neutral;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600/20 to-transparent border-l-4 border-indigo-500 shadow-inner'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                          {c.customer?.name?.[0] || 'C'}
                        </div>
                        <p className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {c.customer?.name || 'Client'}
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                        c.status === 'escalated'
                          ? 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse'
                          : 'text-slate-400 bg-slate-900 border-slate-700/80'
                      }`}>
                        {c.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate pl-8 leading-snug">
                      {c.lastMessage?.content || 'Started conversation'}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 pl-8 text-[10px] text-slate-400">
                      <span className={`px-2 py-0.5 rounded-full border font-medium ${sentimentConf.color}`}>
                        {sentimentConf.label}
                      </span>
                      <span className="font-mono text-[10px]">{formatDate(c.updated_at || c.created_at)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Message Thread Inspection */}
        <div className="lg:col-span-8 glass-panel rounded-2xl border border-slate-800/80 flex flex-col overflow-hidden shadow-2xl">
          {selectedConv ? (
            <>
              {/* Header */}
              <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/70">
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20">
                    {selectedConv.customer?.name?.[0] || 'C'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold text-white tracking-tight">
                        {selectedConv.customer?.name || 'Client Profile'}
                      </p>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">{selectedConv.customer?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedConv.status !== 'escalated' ? (
                    <Button
                      variant="danger"
                      size="sm"
                      icon={ShieldAlert}
                      onClick={() => handleEscalate(selectedConv.id)}
                    >
                      Escalate to Tier 2
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>Escalated to Agent</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-950/30">
                {convLoading ? (
                  <div className="py-20 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span className="text-xs text-slate-400">Retrieving encrypted message history...</span>
                  </div>
                ) : (
                  (selectedConv.messages || []).map((m) => {
                    const isCust = m.sender_type === 'customer';
                    const isAi = m.sender_type === 'ai_assistant';

                    return (
                      <div
                        key={m.id}
                        className={`p-4 rounded-2xl text-xs max-w-lg leading-relaxed shadow-lg transition-all ${
                          isCust
                            ? 'ml-auto bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-indigo-500/15'
                            : isAi
                            ? 'mr-auto glass-panel-elevated border border-slate-700/80 text-slate-100 rounded-tl-none'
                            : 'mr-auto bg-slate-900 border border-slate-700 text-slate-100 rounded-tl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10 text-[10px] text-slate-300">
                          <span className="font-semibold flex items-center gap-1.5">
                            {isCust ? (
                              <>
                                <User className="w-3 h-3 text-cyan-300" />
                                <span>Customer</span>
                              </>
                            ) : isAi ? (
                              <>
                                <Bot className="w-3 h-3 text-indigo-400" />
                                <span>AI CX Assistant</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3 text-emerald-400" />
                                <span>Support Agent</span>
                              </>
                            )}
                          </span>
                          <span className="font-mono text-[10px] opacity-80">{formatDate(m.created_at)}</span>
                        </div>
                        <p className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">{m.content}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs p-8 text-center">
              <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
              <p className="font-semibold text-slate-300 text-sm">No Conversation Selected</p>
              <p className="text-slate-500 mt-1 max-w-xs text-xs">
                Select a customer conversation from the left queue to inspect the full transcript and sentiment analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
