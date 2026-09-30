import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ChatMessage, TypingIndicator } from '../components/chatbot/ChatMessage';
import { SuggestedQuestions } from '../components/chatbot/SuggestedQuestions';
import { FeedbackModal } from '../components/chatbot/FeedbackModal';
import { CXLogo } from '../components/common/CXLogo';
import { chatService } from '../services/chatService';
import { useToast } from '../context/ToastContext';
import { SUGGESTED_QUESTIONS } from '../utils/constants';
import {
  Bot,
  Send,
  ShieldAlert,
  Sparkles,
  Star,
  MessageSquare,
  RotateCcw,
  User,
  ShieldCheck,
  Maximize2,
  Minimize2,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Activity,
  Cpu,
  Layers,
  Building,
  Mail,
  Zap,
  ChevronRight,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DEMO_CUSTOMERS = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Alex Turner',
    tier: 'Starter Plan',
    email: 'alex.turner@gmail.com',
    industry: 'Consumer Tech',
    slaTime: '< 15 mins',
    status: 'Online',
    unread: 0,
    lastActive: 'Just now',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Maya Lin',
    tier: 'Enterprise VIP',
    email: 'maya.lin@enterprise.io',
    industry: 'Financial SaaS',
    slaTime: '< 2 mins P1',
    status: 'Active',
    unread: 1,
    lastActive: '3m ago',
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'David Kim',
    tier: 'Growth Tier',
    email: 'david.kim@techscale.com',
    industry: 'E-Commerce',
    slaTime: '< 5 mins',
    status: 'Idle',
    unread: 0,
    lastActive: '12m ago',
  },
];

export const CustomerPortalPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(DEMO_CUSTOMERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileTab, setMobileTab] = useState('chat'); // 'customers' | 'chat' | 'context'
  const [conversationId, setConversationId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [escalated, setEscalated] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'cust_welcome_1',
      sender_type: 'ai_assistant',
      content: 'Hello Alex! I am your CX Intelligence Support Assistant. How can I assist you today? You can ask me about billing plans, 30-day money-back refunds, API documentation, or request to connect with a live support engineer.',
      created_at: new Date().toISOString(),
      metadata: { grounded: true }
    }
  ]);

  const messagesEndRef = useRef(null);
  const workspaceRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      workspaceRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleSelectCustomer = (cust) => {
    setSelectedCustomer(cust);
    handleReset(cust);
    setMobileTab('chat');
  };

  const handleReset = (customer = selectedCustomer) => {
    setConversationId(null);
    setEscalated(false);
    setLastAnalysis(null);
    setMessages([
      {
        id: `cust_welcome_${Date.now()}`,
        sender_type: 'ai_assistant',
        content: `Hello ${customer.name}! I am your CX Intelligence Support Assistant. How can I assist you with your ${customer.tier} account today? Ask about billing, account upgrades, API limits, or compliance policies.`,
        created_at: new Date().toISOString(),
        metadata: { grounded: true }
      }
    ]);
    toast.info(`New live session initiated for ${customer.name}.`);
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
      if (res.analysis) {
        setLastAnalysis(res.analysis);
      }

      setMessages((prev) => [
        ...prev.map((m) => (m.id === userMessage.id ? res.customerMessage : m)),
        res.aiMessage,
      ]);

      if (res.autoEscalated) {
        setEscalated(true);
        toast.info('Negative sentiment detected: Conversation routed to Tier 2 live support for expedited resolution.');
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
      await chatService.escalateConversation(conversationId, 'Customer requested human support from live portal');
      setEscalated(true);
      toast.success('Your session is escalated to a live agent. An engineer will respond shortly.');
      setMessages((prev) => [
        ...prev,
        {
          id: `sys_${Date.now()}`,
          sender_type: 'system',
          content: 'Session escalated to Tier 2 support engineer. A specialist is reviewing your inquiry history.',
          created_at: new Date().toISOString(),
        }
      ]);
    } catch (err) {
      toast.error('Failed to escalate session');
    }
  };

  const filteredCustomers = DEMO_CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      ref={workspaceRef}
      className="min-h-screen bg-[#070a14] text-slate-100 flex flex-col justify-between relative overflow-hidden bg-grid-pattern selection:bg-violet-500 selection:text-white"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-gradient-to-br from-violet-600/15 via-purple-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[350px] bg-gradient-to-tl from-cyan-600/15 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* TOP HEADER: PRODUCT TITLE, STATUS & ACTION BAR                            */}
      {/* ========================================================================= */}
      <header className="h-16 glass-panel border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-2xl">
        <div className="flex items-center space-x-3.5">
          <CXLogo size="md" subtitle="Customer Live Support" />
          <div className="hidden md:flex items-center space-x-2 pl-3 border-l border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium">
              Every Customer Conversation Matters
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Tab Switcher */}
          <div className="lg:hidden flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setMobileTab('customers')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                mobileTab === 'customers' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              Profiles
            </button>
            <button
              onClick={() => setMobileTab('chat')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                mobileTab === 'chat' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setMobileTab('context')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                mobileTab === 'context' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              Intel
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={() => handleReset()}
            title="Start New Session"
            className="hidden sm:inline-flex text-slate-300 hover:text-white"
          >
            New Session
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Star}
            onClick={() => setFeedbackOpen(true)}
            className="hidden sm:inline-flex text-slate-300"
          >
            Feedback
          </Button>

          {escalated ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Escalated to Agent</span>
            </div>
          ) : (
            <Button
              variant="danger"
              size="sm"
              icon={ShieldAlert}
              onClick={handleEscalate}
            >
              Speak to Human
            </Button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/80 transition-all hidden sm:inline-flex"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Workspace'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <Link
            to="/dashboard"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold hidden xl:inline-flex items-center gap-1 pl-2 transition-colors"
          >
            <span>Agent Console</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3-PANEL WORKSPACE CONTAINER                                               */}
      {/* ========================================================================= */}
      <div className="flex-1 w-full max-w-[1720px] mx-auto p-3 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 z-10 h-[calc(100vh-8rem)]">
        
        {/* ======================================================================= */}
        {/* PANEL 1: LEFT CONVERSATION & CUSTOMER PROFILE SELECTOR                  */}
        {/* ======================================================================= */}
        <div
          className={`lg:col-span-3 glass-panel rounded-3xl border border-slate-800/90 flex-col overflow-hidden shadow-2xl bg-[#0b1020]/80 backdrop-blur-xl ${
            mobileTab === 'customers' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Panel Header */}
          <div className="p-4 border-b border-slate-800/80 bg-[#0e1628]/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-violet-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Customer Profiles ({filteredCustomers.length})
              </h2>
            </div>
            <button
              onClick={() => handleReset()}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search box */}
          <div className="p-3 border-b border-slate-800/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search profiles or tiers..."
                className="w-full bg-[#080d1a] border border-slate-800 hover:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 shadow-inner"
              />
            </div>
          </div>

          {/* Customer list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 custom-scrollbar p-2 space-y-1.5">
            {filteredCustomers.map((cust) => {
              const isSelected = cust.id === selectedCustomer.id;
              return (
                <div
                  key={cust.id}
                  onClick={() => handleSelectCustomer(cust)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-transparent border-violet-500/50 shadow-lg shadow-violet-950/40'
                      : 'border-transparent hover:bg-slate-900/60 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                          {cust.name[0]}
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-2 ring-slate-950" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {cust.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate font-mono">{cust.email}</p>
                      </div>
                    </div>

                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 whitespace-nowrap">
                      {cust.tier}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pl-10 pt-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>SLA: {cust.slaTime}</span>
                    </span>
                    <span className="text-emerald-400 font-medium">{cust.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick SLA Commitment Bar */}
          <div className="p-3.5 border-t border-slate-800/80 bg-[#080d1a]/80 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Live Queue Health:</span>
              <span className="text-emerald-400 font-mono font-bold">100% Operational</span>
            </div>
            <p className="text-[10px] text-slate-500">Autonomous AI triages standard queries instantly.</p>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* PANEL 2: CENTRAL LIVE SUPPORT CHAT WORKSPACE                            */}
        {/* ======================================================================= */}
        <div
          className={`lg:col-span-6 glass-panel-elevated rounded-3xl border border-slate-800/90 flex-col overflow-hidden shadow-2xl bg-[#0b1020]/95 backdrop-blur-2xl relative ${
            mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Subtle top edge glow */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent pointer-events-none" />

          {/* Chat Workspace Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#0e1628]/90 via-[#111a30]/80 to-[#0e1628]/90 border-b border-slate-800/80 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-violet-600/30">
                  <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-2 ring-slate-950 animate-pulse" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white tracking-tight truncate">
                    CX Intelligence Live Assistant
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Live & Available
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  Supporting <span className="text-violet-300 font-semibold">{selectedCustomer.name}</span> ({selectedCustomer.tier})
                </p>
              </div>
            </div>

            {/* Knowledge Base Grounding Indicator Badge */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-[11px]">Grounded in Knowledge Base</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 custom-scrollbar bg-[#070a14]/40">
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

          {/* Suggested Question Chips & Input Composer */}
          <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#0a0f1d]/90 backdrop-blur-md space-y-3">
            {/* Suggested prompts carousel/chips */}
            <SuggestedQuestions
              questions={SUGGESTED_QUESTIONS}
              onSelect={(q) => handleSendMessage(q)}
            />

            {/* Input Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a question (e.g. Can you explain your 30-day money-back policy?)..."
                  className="w-full bg-[#080d1a] border border-slate-700/80 hover:border-slate-600 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all shadow-inner"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                icon={Send}
                className="h-11 px-5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 text-white font-bold"
              >
                Send
              </Button>
            </form>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* PANEL 3: RIGHT CUSTOMER CONTEXT & LIVE INTELLIGENCE TELEMETRY           */}
        {/* ======================================================================= */}
        <div
          className={`lg:col-span-3 glass-panel rounded-3xl border border-slate-800/90 flex-col overflow-y-auto custom-scrollbar shadow-2xl bg-[#0b1020]/80 backdrop-blur-xl p-4 sm:p-5 space-y-4 ${
            mobileTab === 'context' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Header */}
          <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Live Customer Intelligence
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Real-Time
            </span>
          </div>

          {/* Active Profile Card */}
          <div className="p-4 rounded-2xl bg-[#080d1a]/90 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
                {selectedCustomer.name[0]}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{selectedCustomer.name}</h4>
                <p className="text-[11px] text-cyan-400 font-semibold">{selectedCustomer.tier}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-mono text-[11px] text-slate-200 truncate">{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Industry:</span>
                <span className="text-slate-200">{selectedCustomer.industry}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">SLA Response:</span>
                <span className="text-emerald-400 font-bold font-mono">{selectedCustomer.slaTime}</span>
              </div>
            </div>
          </div>

          {/* Live Session Telemetry Card */}
          <div className="p-4 rounded-2xl bg-[#080d1a]/90 border border-slate-800 space-y-3">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-violet-400" />
              <span>Session Telemetry</span>
            </h5>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400">Active Model</p>
                <p className="text-xs font-bold text-violet-300 font-mono mt-0.5">Gemini 2.5</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400">Turns Logged</p>
                <p className="text-xs font-bold text-white font-mono mt-0.5">{messages.length}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400">Escalation State</p>
                <p className={`text-xs font-bold font-mono mt-0.5 ${escalated ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {escalated ? 'Tier 2 Agent' : 'AI Handled'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400">Sentiment Score</p>
                <p className="text-xs font-bold text-cyan-300 font-mono mt-0.5">
                  {lastAnalysis?.sentiment ? lastAnalysis.sentiment.toUpperCase() : 'NEUTRAL'}
                </p>
              </div>
            </div>
          </div>

          {/* Verified Grounding Guarantee */}
          <div className="p-4 rounded-2xl bg-[#080d1a]/90 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounding Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every response is bounded to approved company policies. Questions about refunds, terms, and SLAs are verified against database articles with zero hallucination.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              icon={Star}
              onClick={() => setFeedbackOpen(true)}
              className="w-full justify-center text-xs"
            >
              Rate Response Experience
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={ShieldAlert}
              onClick={handleEscalate}
              className="w-full justify-center text-xs"
            >
              Request Live Human Agent
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-2.5 px-6 text-center text-[11px] text-slate-500 border-t border-slate-800/60 bg-[#070a14]/90 z-10 flex items-center justify-between">
        <span>CX Intelligence • Customer Live Support Workspace</span>
        <span className="font-mono text-[10px]">TLS 1.3 End-to-End Encrypted • Grounded AI Model</span>
      </footer>

      {/* Feedback Rating Modal */}
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
