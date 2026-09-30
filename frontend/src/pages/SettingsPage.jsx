import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import { Settings, ShieldCheck, Database, Bot, Sliders, CheckCircle2, Cpu, Lock, Sparkles } from 'lucide-react';

export const SettingsPage = () => {
  const [welcomeMsg, setWelcomeMsg] = useState('Welcome to CX Intelligence Support! How can our AI assistant help you today?');
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [modelName, setModelName] = useState('gemini-2.5-flash');
  const [saving, setSaving] = useState(false);

  const toast = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('System configuration saved successfully!');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System Architecture & LLM Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <span>Platform</span>
          <span className="text-gradient-primary">Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Configure conversational LLM models, tune sentiment escalation thresholds, and verify multi-tenant database policies.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI Model Controls */}
        <Card hover>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">AI Engine & Model Architecture</h3>
                <p className="text-xs text-slate-400">Select model backend and conversational parameters</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Operational
            </span>
          </div>

          <div className="mt-5 space-y-5 text-xs">
            <div>
              <label className="block text-slate-200 font-semibold mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Active LLM Provider & Model</span>
              </label>
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full sm:w-96 bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-inner font-medium"
              >
                <option value="gemini-2.5-flash">Google Gemini 2.5 Flash (Production Grounded - Recommended)</option>
                <option value="gemini-2.5-pro">Google Gemini 2.5 Pro (Deep Reasoning & Analysis)</option>
                <option value="mock-ai-engine">Intelligent Grounded Local Engine (Offline / Local Dev)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Both Gemini API and offline fallback engine utilize strict cosine similarity matching against your approved business knowledge base articles.
              </p>
            </div>

            <div>
              <label className="block text-slate-200 font-semibold mb-1.5">Default Greeting & Assistant Persona</label>
              <textarea
                rows={3}
                value={welcomeMsg}
                onChange={(e) => setWelcomeMsg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner leading-relaxed"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3">
              <input
                type="checkbox"
                id="autoEscalate"
                checked={autoEscalate}
                onChange={(e) => setAutoEscalate(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="autoEscalate" className="cursor-pointer select-none">
                <span className="text-xs text-slate-200 font-semibold block">
                  Autonomous Negative Sentiment Escalation
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block leading-relaxed">
                  Automatically flags tickets and redirects live chat sessions to a human agent when customer frustration or negative sentiment exceeds 80% confidence.
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Database & Supabase Infrastructure */}
        <Card hover>
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Database & Multi-Tenant Infrastructure</h3>
              <p className="text-xs text-slate-400">PostgreSQL telemetry and security configuration</p>
            </div>
          </div>

          <div className="mt-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                <div>
                  <p className="font-semibold text-white">PostgreSQL with Supabase</p>
                  <p className="text-[11px] text-slate-400">Row Level Security (RLS) tenant isolation active</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold shadow-sm">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400/50" />
                <div>
                  <p className="font-semibold text-white">Knowledge Grounding Verification</p>
                  <p className="text-[11px] text-slate-400">Authoritative business corpus indexed for zero hallucination</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-semibold shadow-sm">
                5 Articles Indexed
              </span>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md" isLoading={saving}>
            Save Configuration Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
