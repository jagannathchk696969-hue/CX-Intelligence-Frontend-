import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ChatMessage, TypingIndicator } from '../components/chatbot/ChatMessage';
import { SuggestedQuestions } from '../components/chatbot/SuggestedQuestions';
import { FeedbackModal } from '../components/chatbot/FeedbackModal';
import { chatService } from '../services/chatService';
import { useToast } from '../context/ToastContext';
import { SUGGESTED_QUESTIONS, SENTIMENT_CONFIG } from '../utils/constants';
import { Bot, Send, RotateCcw, ShieldAlert, Sparkles, Activity } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>AI Assistant Studio</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
              Grounded Model
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test and evaluate the conversational assistant, sentiment classification, and knowledge grounding.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleReset}>
            Reset Session
          </Button>
          <Button variant="danger" size="sm" icon={ShieldAlert} onClick={handleEscalate}>
            Escalate to Agent
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Window Column */}
        <div className="lg:col-span-2 flex flex-col h-[650px] glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          {/* Chat Window Header */}
          <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">CX Intelligence Bot</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Grounded in Business Knowledge Base
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-2">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} onOpenFeedback={handleOpenFeedback} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts & Input Bar */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
            <SuggestedQuestions questions={SUGGESTED_QUESTIONS.slice(0, 3)} onSelect={(q) => handleSendMessage(q)} />

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
                placeholder="Ask about policies, pricing, APIs, or refund terms..."
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Button type="submit" variant="primary" size="md" isLoading={loading} icon={Send}>
                Send
              </Button>
            </form>
          </div>
        </div>

        {/* Real-time AI Sentiment & Intent Telemetry Inspector */}
        <div className="space-y-4">
          <Card hover>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Real-Time Sentiment Inspector
              </h3>
            </div>

            {lastAnalysis ? (
              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Detected Sentiment:</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${SENTIMENT_CONFIG[lastAnalysis.sentiment]?.color || ''}`}>
                      {lastAnalysis.sentiment}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Confidence: {Math.round(lastAnalysis.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Detected Intent:</span>
                  <span className="font-mono bg-slate-800 px-2 py-1 rounded-md border border-slate-700 text-indigo-300">
                    {lastAnalysis.intent}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Extracted Keywords:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(lastAnalysis.keywords || []).map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block mb-1">Escalation Status:</span>
                  {lastAnalysis.escalationRecommended ? (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
                      <p className="font-semibold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Recommended
                      </p>
                      <p className="mt-0.5">{lastAnalysis.escalationReason}</p>
                    </div>
                  ) : (
                    <p className="text-emerald-400 text-[11px]">No escalation needed. Safe query.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-8 text-center">
                Send a message to see live sentiment classification, intent parsing, and escalation confidence scores.
              </p>
            )}
          </Card>

          <Card hover>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">Grounding Policy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The AI assistant is strictly bound to approved knowledge base articles. If a customer query cannot be matched with confidence, it offers human escalation rather than fabricating company terms.
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
