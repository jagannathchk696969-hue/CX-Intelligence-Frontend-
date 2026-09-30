import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, ShieldAlert, Sparkles, Star, MessageSquare, X, Maximize2, RotateCcw, User, CheckCircle2 } from 'lucide-react';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { SuggestedQuestions } from './SuggestedQuestions';
import { FeedbackModal } from './FeedbackModal';
import { chatService } from '../../services/chatService';
import { useToast } from '../../context/ToastContext';
import { SUGGESTED_QUESTIONS } from '../../utils/constants';

const DEMO_CUSTOMERS = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'Alex Turner', tier: 'Starter', email: 'alex.turner@gmail.com' },
  { id: 'c1000000-0000-0000-0000-000000000002', name: 'Maya Lin', tier: 'Enterprise', email: 'maya.lin@enterprise.io' },
  { id: 'c1000000-0000-0000-0000-000000000003', name: 'David Kim', tier: 'Growth', email: 'david.kim@techscale.com' },
];

export const LiveChatWidget = ({ isOpen, onClose, onToggle }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(DEMO_CUSTOMERS[0]);
  const [conversationId, setConversationId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'widget_welcome',
      sender_type: 'ai_assistant',
      content: `Hello! I am your AI Customer Support Assistant. How can I help you today? You can ask about our 30-day refund policy, API webhooks, or request to connect with a live agent.`,
      created_at: new Date().toISOString(),
      metadata: { grounded: true }
    }
  ]);

  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const handleReset = () => {
    setConversationId(null);
    setMessages([
      {
        id: `widget_welcome_${Date.now()}`,
        sender_type: 'ai_assistant',
        content: `New chat started for ${selectedCustomer.name}. How can our AI assistant help you today?`,
        created_at: new Date().toISOString(),
        metadata: { grounded: true }
      }
    ]);
    toast.info('New chat session started.');
  };

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMessage = {
      id: `usr_${Date.now()}`,
      sender_type: 'customer',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const res = await chatService.sendMessage({
        message: text,
        conversationId,
        customerId: selectedCustomer.id,
      });

      setConversationId(res.conversationId);
      setMessages((prev) => [
        ...prev.map((m) => (m.id === userMessage.id ? res.customerMessage : m)),
        res.aiMessage,
      ]);

      if (res.autoEscalated) {
        toast.info('Negative sentiment detected: Escalated to human support queue.');
      }
    } catch (err) {
      toast.error('Could not reach AI assistant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!conversationId) {
      toast.info('Send a message first to establish an active session.');
      return;
    }
    try {
      await chatService.escalateConversation(conversationId, 'Customer requested human support from live chat widget');
      toast.success('Session escalated to Tier 2 live support.');
      setMessages((prev) => [
        ...prev,
        {
          id: `sys_${Date.now()}`,
          sender_type: 'system',
          content: 'Session escalated to Tier 2 support engineer. A human agent will join shortly.',
          created_at: new Date().toISOString(),
        }
      ]);
    } catch (err) {
      toast.error('Failed to escalate session');
    }
  };

  return (
    <>
      {/* Floating Trigger Button (when closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium text-xs shadow-2xl hover:shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 animate-fade-in group"
          aria-label="Open Live Chat"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-2 ring-indigo-900 animate-pulse" />
          </div>
          <span>Customer Live Chat</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">AI</span>
        </button>
      )}

      {/* Floating Messenger Window (when open) */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full sm:w-[420px] h-[600px] max-h-[85vh] glass-panel border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up bg-slate-950/95 backdrop-blur-xl">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/80 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-xs font-bold text-white truncate">Customer Live Chat</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                  <span>Chatting as:</span>
                  <select
                    value={selectedCustomer.id}
                    onChange={(e) => {
                      const c = DEMO_CUSTOMERS.find((x) => x.id === e.target.value);
                      if (c) setSelectedCustomer(c);
                    }}
                    className="bg-slate-800 border border-slate-700 rounded px-1 text-[10px] text-cyan-300 focus:outline-none"
                  >
                    {DEMO_CUSTOMERS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.tier})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleReset}
                title="Restart Chat"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <a
                href="/customer-chat"
                target="_blank"
                rel="noreferrer"
                title="Open in Full Screen Portal"
                className="p-1.5 text-slate-400 hover:text-cyan-300 rounded-lg hover:bg-slate-700/60 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                title="Close Chat"
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Grounded in Knowledge Base
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setFeedbackOpen(true)}
                className="text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                <Star className="w-3 h-3 text-amber-400" />
                <span>Rate</span>
              </button>
              <button
                type="button"
                onClick={handleEscalate}
                className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                <span>Escalate</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-2">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                message={m}
                onOpenFeedback={() => setFeedbackOpen(true)}
              />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Chips */}
          <div className="px-3 pt-2 pb-1 border-t border-slate-800/80 bg-slate-900/60">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              {SUGGESTED_QUESTIONS.slice(0, 3).map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex-shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-800 bg-slate-950 flex items-center space-x-2 flex-shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything or request support..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Feedback Modal */}
          <FeedbackModal
            isOpen={feedbackOpen}
            onClose={() => setFeedbackOpen(false)}
            onSubmit={async (data) => {
              await chatService.submitFeedback(data);
              toast.success('Thank you for rating our support assistant!');
            }}
            conversationId={conversationId}
          />
        </div>
      )}
    </>
  );
};
