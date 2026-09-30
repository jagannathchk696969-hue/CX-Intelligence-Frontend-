import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ChatMessage, TypingIndicator } from '../components/chatbot/ChatMessage';
import { SuggestedQuestions } from '../components/chatbot/SuggestedQuestions';
import { FeedbackModal } from '../components/chatbot/FeedbackModal';
import { chatService } from '../services/chatService';
import { useToast } from '../context/ToastContext';
import { SUGGESTED_QUESTIONS, SENTIMENT_CONFIG } from '../utils/constants';
import { Bot, Send, RotateCcw, ShieldAlert, Sparkles, Activity, ShieldCheck, Cpu } from 'lucide-react';

export const AssistantStudioPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender_type: 'ai_assistant',
      content: 'Welcome to CX Intelligence Assistant Studio! Ask me anything regarding company policies, pricing plans, API rates, compliance certifications, or SLA times. I will ground my answer strictly in approved knowledge base articles.',
      created_at: new Date().toISOString(),
      metadata: { grounded: true }
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
      });

      setConversationId(res.conversationId);
      setLastAnalysis(res.analysis);

      setMessages((prev) => [
        ...prev.map((m) => (m.id === userMessage.id ? res.customerMessage : m)),
        res.aiMessage,
      ]);

      if (res.autoEscalated) {
        toast.info('Negative sentiment detected: Session auto-escalated to human support queue.');
      }
    } catch (err) {
      toast.error('AI assistant service is currently unavailable. Using offline knowledge search.');
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!conversationId) {
      toast.info('Send a message first to establish an active conversation session.');
      return;
    }
    try {
      await chatService.escalateConversation(conversationId, 'Manual agent test escalation from Studio');
      toast.success('Conversation successfully escalated to Human Agent Tier 2.');
      setMessages((prev) => [
        ...prev,
        {
          id: `sys_${Date.now()}`,
          sender_type: 'system',
          content: 'Session escalated to Tier 2 live support. Reason: Manual escalation request. A human agent will join shortly.',
          created_at: new Date().toISOString(),
        }
      ]);
    } catch (err) {
      toast.error('Failed to escalate session.');
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome_1',
        sender_type: 'ai_assistant',
        content: 'Conversation session reset. How can I assist you with verified knowledge base information?',
        created_at: new Date().toISOString(),
        metadata: { grounded: true }
      }
    ]);
    setConversationId(null);
    setLastAnalysis(null);
    toast.info('Conversation session cleared.');
  };

  const handleOpenFeedback = (msg) => {
    setSelectedMessage(msg);
    setFeedbackOpen(true);
  };

  const handleFeedbackSubmit = async (data) => {
    await chatService.submitFeedback(data);
    toast.success('Thank you! Your feedback was logged for model tuning.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Conversational AI Playground</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>AI Assistant</span>
            <span className="text-gradient-primary">Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Test and evaluate the conversational assistant, sentiment detection, knowledge grounding, and fallback policies.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleReset}>
            Reset Sandbox
          </Button>
          <Button variant="danger" size="sm" icon={ShieldAlert} onClick={handleEscalate}>
            Escalate to Human
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Window Column */}
        <div className="lg:col-span-8 flex flex-col h-[700px] glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
          {/* Chat Window Header */}
          <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/70">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white tracking-tight">CX Intelligence Bot</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Grounded in Business Knowledge Base
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Gemini 2.5 Flash</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-3 custom-scrollbar bg-slate-950/20">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} onOpenFeedback={handleOpenFeedback} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts & Input Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/70 space-y-3.5">
            <SuggestedQuestions questions={SUGGESTED_QUESTIONS.slice(0, 3)} onSelect={(q) => handleSendMessage(q)} />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2.5"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about policies, pricing, enterprise SLAs, APIs..."
                className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner"
              />
              <Button type="submit" variant="primary" size="md" isLoading={loading} icon={Send}>
                Send
              </Button>
            </form>
          </div>
        </div>

        {/* Real-time AI Sentiment & Intent Telemetry Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <Card hover>
            <div className="flex items-center space-x-2 pb-3.5 border-b border-slate-800/80">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Real-Time Telemetry Inspector
              </h3>
            </div>

            {lastAnalysis ? (
              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1 font-medium">Detected Tone & Sentiment:</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold capitalize shadow-sm ${SENTIMENT_CONFIG[lastAnalysis.sentiment]?.color || ''}`}>
                      {lastAnalysis.sentiment}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Confidence: {Math.round(lastAnalysis.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1 font-medium">Classified Intent:</span>
                  <span className="font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-indigo-300 inline-block font-semibold">
                    {lastAnalysis.intent}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1 font-medium">Extracted Keywords:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(lastAnalysis.keywords || []).map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-slate-400 block mb-1.5 font-medium">Escalation Assessment:</span>
                  {lastAnalysis.escalationRecommended ? (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-rose-300">
                        <ShieldAlert className="w-3.5 h-3.5" /> Escalation Recommended
                      </p>
                      <p className="text-rose-200/90 leading-relaxed">{lastAnalysis.escalationReason}</p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Autonomous deflection active. Sentiment stable.</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Activity className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Send a query to the sandbox to view live sentiment classification, intent parsing, and escalation indicators.
                </p>
              </div>
            )}
          </Card>

          <Card hover>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Grounding & Anti-Hallucination Policy
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mt-3">
              The AI assistant is strictly bound to approved business knowledge base articles. If a customer query cannot be matched with confidence, it safely offers human escalation rather than fabricating terms.
            </p>
          </Card>
        </div>
      </div>

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
        conversationId={conversationId}
      />
    </div>
  );
};
