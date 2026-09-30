import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ChatMessage, TypingIndicator } from '../components/chatbot/ChatMessage';
import { SuggestedQuestions } from '../components/chatbot/SuggestedQuestions';
import { FeedbackModal } from '../components/chatbot/FeedbackModal';
import { chatService } from '../services/chatService';
import { useToast } from '../context/ToastContext';
import { SUGGESTED_QUESTIONS } from '../utils/constants';
import { Bot, Send, ShieldAlert, Sparkles, Star, MessageSquare, RotateCcw, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CXLogo } from '../components/common/CXLogo';

const DEMO_CUSTOMERS = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'Alex Turner', tier: 'Starter', email: 'alex.turner@gmail.com' },
  { id: 'c1000000-0000-0000-0000-000000000002', name: 'Maya Lin', tier: 'Enterprise', email: 'maya.lin@enterprise.io' },
  { id: 'c1000000-0000-0000-0000-000000000003', name: 'David Kim', tier: 'Growth', email: 'david.kim@techscale.com' },
];

export const CustomerPortalPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(DEMO_CUSTOMERS[0]);
  const [messages, setMessages] = useState([
    {
      id: 'cust_welcome_1',
      sender_type: 'ai_assistant',
      content: 'Hello Alex! I am your AI Customer Support Assistant. How can I help you today? You can ask me about billing plans, 30-day money-back refunds, API documentation, or request to connect with a live support agent.',
      created_at: new Date().toISOString(),
      metadata: { grounded: true }
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleReset = (customer = selectedCustomer) => {
    setConversationId(null);
    setMessages([
      {
        id: `cust_welcome_${Date.now()}`,
        sender_type: 'ai_assistant',
        content: `Hello ${customer.name}! How can our AI assistant help you today? Ask about billing, account upgrades, or security policies.`,
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
        toast.info('Your conversation has been routed to Tier 2 live support for expedited assistance.');
      }
    } catch (err) {
      toast.error('Could not reach AI assistant. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!conversationId) {
      toast.info('Please send a message first to establish your live session.');
      return;
    }
    try {
      await chatService.escalateConversation(conversationId, 'Customer requested human support from portal');
      toast.success('Your session is escalated to a live agent. Someone will respond shortly.');
      setMessages((prev) => [
        ...prev,
        {
          id: `sys_${Date.now()}`,
          sender_type: 'system',
          content: 'Session escalated to Tier 2 support engineer. An agent is reviewing your inquiry.',
          created_at: new Date().toISOString(),
        }
      ]);
    } catch (err) {
      toast.error('Failed to escalate session');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 relative overflow-hidden bg-grid-pattern selection:bg-indigo-500 selection:text-white">
      {/* Ambient lighting */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Banner Header */}
      <header className="h-16 glass-panel border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-2xl">
        <div className="flex items-center space-x-3">
          <CXLogo size="md" subtitle="Live Support Portal" />
          <div className="hidden sm:block border-l border-slate-800 pl-3">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <span className="font-medium">Active Customer:</span>
              <select
                value={selectedCustomer.id}
                onChange={(e) => {
                  const cust = DEMO_CUSTOMERS.find((x) => x.id === e.target.value);
                  if (cust) {
                    setSelectedCustomer(cust);
                    handleReset(cust);
                  }
                }}
                className="bg-slate-900/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 font-medium cursor-pointer"
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

        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={() => handleReset()}
            title="Start New Session"
          >
            New Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={Star}
            onClick={() => setFeedbackOpen(true)}
          >
            Feedback
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={ShieldAlert}
            onClick={handleEscalate}
          >
            Speak to Human
          </Button>
          <Link
            to="/dashboard"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold hidden md:inline-block ml-2 transition-colors"
          >
            Agent Workspace →
          </Link>
        </div>
      </header>

      {/* Main Chat Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between z-10">
        <div className="flex-1 glass-panel-elevated border border-slate-700/80 rounded-2xl flex flex-col overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] h-[75vh]">
          {/* Subtle top edge light reflection */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

          {/* Scrollable messages */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-2">
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

          {/* Prompt chips and input */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 space-y-3">
            <SuggestedQuestions
              questions={SUGGESTED_QUESTIONS}
              onSelect={(q) => handleSendMessage(q)}
            />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message (e.g. Can you explain your 30-day refund policy?)..."
                className="flex-1 bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-inner"
              />
              <Button type="submit" variant="primary" size="md" isLoading={loading} icon={Send}>
                Send
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 px-6 text-center text-[11px] text-slate-400 border-t border-slate-800/80 bg-slate-950/60 z-10">
        Powered by CX Intelligence Grounded AI Engine • TLS 1.3 End-to-End Encrypted • Verified Knowledge Grounding
      </footer>

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
  );
};
