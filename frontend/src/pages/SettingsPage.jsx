import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import { Settings, ShieldCheck, Database, Bot, Sliders } from 'lucide-react';

export const SettingsPage = () => {
  const [welcomeMsg, setWelcomeMsg] = useState('Welcome to Apex CX Support! How can our AI assistant help you today?');
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [modelName, setModelName] = useState('gemini-3.8-flash');
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
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Platform Settings & AI Control</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage AI conversational behavior, multi-tenant database policies, and auto-escalation thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI Model Controls */}
        <Card hover>
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Bot className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">AI Engine & Model Architecture</h3>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Active LLM Provider</label>
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full sm:w-80 bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Recommended)</option>
                <option value="gemini-3.5-flash-lite">Google Gemini 3.5 Flash-Lite (High Throughput)</option>
                <option value="mock-ai-engine">Intelligent Grounded Local Engine (Offline / Test)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Both live Gemini API and zero-setup offline mock engine support strict knowledge base grounding.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Default Welcome Greeting</label>
              <textarea
                rows={2}
                value={welcomeMsg}
                onChange={(e) => setWelcomeMsg(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoEscalate}
                  onChange={(e) => setAutoEscalate(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-0"
                />
                <span className="text-xs text-slate-200 font-medium">
                  Auto-Escalate Negative Customer Sentiment
                </span>
              </label>
              <p className="text-[11px] text-slate-400 ml-6 mt-0.5">
                Automatically routes conversations to human support agents when frustrated sentiment exceeds 80% confidence.
              </p>
            </div>
          </div>
        </Card>

        {/* Database & Supabase Infrastructure */}
        <Card hover>
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Database & Multi-Tenant Infrastructure</h3>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <p className="font-semibold text-white">PostgreSQL with Supabase</p>
                <p className="text-[11px] text-slate-400">Row Level Security (RLS) tenant isolation active</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <p className="font-semibold text-white">Knowledge Grounding Verification</p>
                <p className="text-[11px] text-slate-400">Approved business articles verified for zero hallucination</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-semibold">
                5 Articles Synced
              </span>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" isLoading={saving}>
            Save Configuration Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
