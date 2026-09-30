import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { CXLogo } from '../components/common/CXLogo';
import {
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  Zap,
  Activity,
  Bot,
  Cpu,
  Layers,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    businessName: '',
    role: 'customer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful! Welcome to CX Intelligence.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a14] text-slate-100 flex flex-col lg:flex-row relative overflow-hidden selection:bg-violet-500 selection:text-white">
      {/* ========================================================================= */}
      {/* LEFT SECTION: BRANDING & ABSTRACT AI NEURAL INTERACTION EXPERIENCE       */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-7/12 xl:w-7/12 relative flex-col justify-between p-12 xl:p-16 border-r border-slate-800/80 bg-[#070a14] overflow-hidden">
        {/* Ambient violet & electric purple radial glow lights */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-violet-600/25 via-purple-600/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-[550px] h-[550px] bg-gradient-to-bl from-indigo-600/20 via-purple-800/20 to-transparent rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-violet-700/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

        {/* Subtle geometric grid backdrop */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

        {/* Top Branding Header */}
        <div className="relative z-10 flex items-center justify-between">
          <CXLogo size="lg" subtitle="Enterprise AI CX Platform" />
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autonomous Intelligence Active</span>
          </div>
        </div>

        {/* Center: Abstract Neural Visual */}
        <div className="relative z-10 my-auto py-8">
          <div className="relative w-full max-w-xl mx-auto h-64 flex items-center justify-center">
            {/* Concentric orbital rings */}
            <div className="absolute w-64 h-64 rounded-full border border-violet-500/20 animate-spin-slow pointer-events-none" />
            <div className="absolute w-88 h-88 rounded-full border border-dashed border-indigo-500/15 pointer-events-none" />

            {/* Core node */}
            <div className="relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[2px] shadow-2xl shadow-violet-600/50 animate-float-slow">
              <div className="w-full h-full bg-[#0b101e] rounded-[22px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-transparent to-cyan-500/20" />
                <Layers className="w-10 h-10 text-white relative z-10" />
              </div>
            </div>

            {/* Feature pill tags */}
            <div className="absolute -top-2 left-6 z-20 px-3.5 py-2 rounded-2xl bg-[#0e1628]/90 border border-violet-500/30 shadow-xl backdrop-blur-xl flex items-center space-x-2.5 animate-float-slow">
              <div className="w-7 h-7 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Multi-Tenant Isolation</p>
                <p className="text-xs font-bold text-white font-mono">Row-Level Security</p>
              </div>
            </div>

            <div className="absolute top-2 right-4 z-20 px-3.5 py-2 rounded-2xl bg-[#0e1628]/90 border border-emerald-500/30 shadow-xl backdrop-blur-xl flex items-center space-x-2.5 animate-float-slow [animation-delay:1.5s]">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Auto-Tuned SLA Engine</p>
                <p className="text-xs font-bold text-emerald-400 font-mono">Instant Priority Sync</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-left max-w-xl">
            <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
              Deploy Next-Gen{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Customer Intelligence.
              </span>
            </h2>
            <p className="mt-3 text-sm xl:text-base text-slate-300/90 leading-relaxed">
              Equip your support team and customer base with grounded conversational AI, automated urgency triaging, and real-time sentiment analytics.
            </p>
          </div>
        </div>

        {/* Bottom Security Info */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-5">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              SOC-2 Certified
            </span>
            <span>•</span>
            <span className="text-slate-300 font-medium">Multi-Tenant Isolated</span>
            <span>•</span>
            <span className="text-slate-300 font-medium">256-bit TLS</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">Fast 2-Minute Setup</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SECTION: REGISTRATION CARD                                          */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 relative z-10 bg-[#070a14]/95">
        <div className="lg:hidden mb-8 text-center flex flex-col items-center">
          <CXLogo size="lg" />
          <p className="text-xs text-slate-400 mt-2">
            Create your CX Intelligence workspace
          </p>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workspace Provisioning</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Create CX Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Set up your account to explore autonomous AI deflection and omnichannel customer intelligence.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/90 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Jordan Hayes"
                    className="w-full bg-[#0b101e] border border-slate-700/80 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jordan@company.com"
                    className="w-full bg-[#0b101e] border border-slate-700/80 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Account Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#0b101e] border border-slate-700/80 hover:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all shadow-inner cursor-pointer"
                >
                  <option value="customer">Customer / Client</option>
                  <option value="support_agent">Support Agent</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              {formData.role === 'admin' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Organization / Company Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="Acme Enterprise"
                      className="w-full bg-[#0b101e] border border-slate-700/80 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 8 characters"
                    className="w-full bg-[#0b101e] border border-slate-700/80 hover:border-slate-600 rounded-xl pl-10 pr-11 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 text-white font-bold"
                isLoading={loading}
                icon={ArrowRight}
              >
                Complete Workspace Registration
              </Button>
            </form>

            <div className="mt-5 text-center pt-2">
              <Link
                to="/login"
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors inline-flex items-center gap-1"
              >
                <span>Already have an enterprise account? Sign in here</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
