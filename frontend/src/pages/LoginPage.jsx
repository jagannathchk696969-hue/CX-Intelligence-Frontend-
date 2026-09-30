import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { CXLogo } from '../components/common/CXLogo';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  Zap,
  CheckCircle2,
  Activity,
  Bot,
  MessageSquare,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Welcome back to CX Intelligence!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setTimeout(() => {
      login({ email: demoEmail, password: 'Password123!' })
        .then(() => {
          toast.success(`Logged in as ${demoEmail}`);
          navigate('/dashboard');
        })
        .catch((err) => toast.error(err.message));
    }, 100);
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

        {/* Center: Abstract Neural Visual & Customer Interaction Topology */}
        <div className="relative z-10 my-auto py-8">
          {/* Abstract AI Graphic Container */}
          <div className="relative w-full max-w-xl mx-auto h-72 flex items-center justify-center">
            {/* Concentric orbital rings */}
            <div className="absolute w-72 h-72 rounded-full border border-violet-500/20 animate-spin-slow pointer-events-none" />
            <div className="absolute w-96 h-96 rounded-full border border-dashed border-indigo-500/15 pointer-events-none" />
            <div className="absolute w-[440px] h-[440px] rounded-full border border-purple-500/10 pointer-events-none" />

            {/* Glowing core energy node */}
            <div className="relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[2px] shadow-2xl shadow-violet-600/50 animate-float-slow">
              <div className="w-full h-full bg-[#0b101e] rounded-[22px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-transparent to-cyan-500/20" />
                <Bot className="w-11 h-11 text-white relative z-10" />
              </div>
            </div>

            {/* Floating Satellite Telemetry Cards */}
            {/* Top Left: AI Deflection */}
            <div className="absolute -top-2 left-6 z-20 px-3.5 py-2 rounded-2xl bg-[#0e1628]/90 border border-violet-500/30 shadow-xl backdrop-blur-xl flex items-center space-x-2.5 animate-float-slow">
              <div className="w-7 h-7 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Resolution Deflection</p>
                <p className="text-xs font-bold text-white font-mono">78.4% Autonomous</p>
              </div>
            </div>

            {/* Top Right: Real-Time Sentiment */}
            <div className="absolute top-2 right-4 z-20 px-3.5 py-2 rounded-2xl bg-[#0e1628]/90 border border-emerald-500/30 shadow-xl backdrop-blur-xl flex items-center space-x-2.5 animate-float-slow [animation-delay:1.5s]">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Customer Sentiment</p>
                <p className="text-xs font-bold text-emerald-400 font-mono">+94% Positive CSAT</p>
              </div>
            </div>

            {/* Bottom Left: Knowledge Grounding */}
            <div className="absolute -bottom-2 left-10 z-20 px-3.5 py-2 rounded-2xl bg-[#0e1628]/90 border border-cyan-500/30 shadow-xl backdrop-blur-xl flex items-center space-x-2.5 animate-float-slow [animation-delay:2.5s]">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Corpus Grounding</p>
                <p className="text-xs font-bold text-cyan-300 font-mono">Zero Hallucination</p>
              </div>
            </div>

            {/* Bottom Right: Inference Latency */}
            <div className="absolute bottom-4 right-8 z-20 px-3.5 py-2 rounded-2xl bg-[#0e1628]/90 border border-purple-500/30 shadow-xl backdrop-blur-xl flex items-center space-x-2.5 animate-float-slow [animation-delay:0.8s]">
              <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Live Reasoning</p>
                <p className="text-xs font-bold text-white font-mono">&lt; 350ms TTFT</p>
              </div>
            </div>
          </div>

          {/* Brand Headline & Narrative */}
          <div className="mt-10 text-left max-w-xl">
            <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
              Intelligence Behind Every{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Customer Interaction.
              </span>
            </h2>
            <p className="mt-4 text-sm xl:text-base text-slate-300/90 leading-relaxed">
              Transform customer conversations into meaningful experiences with AI-powered insights,
              intelligent automation, and personalized engagement.
            </p>
          </div>
        </div>

        {/* Bottom Social Proof & Trust Badges */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-5">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              SOC-2 Type II Certified
            </span>
            <span>•</span>
            <span className="text-slate-300 font-medium">HIPAA Compliant</span>
            <span>•</span>
            <span className="text-slate-300 font-medium">256-bit TLS Encryption</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">v2.5 Production</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SECTION: AUTHENTICATION CARD & DIRECT ACCESS                         */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 relative z-10 bg-[#070a14]/95">
        {/* Ambient violet highlight on mobile */}
        <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Mobile Logo View */}
        <div className="lg:hidden mb-8 text-center flex flex-col items-center">
          <CXLogo size="lg" />
          <p className="text-xs text-slate-400 mt-2">
            Next-Gen AI Customer Experience Platform
          </p>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workspace Authentication</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Sign in to your enterprise customer experience workspace.
            </p>
          </div>

          {/* Login Form Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/90 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            {/* Top edge glowing reflection */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#0b101e] border border-slate-700/80 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password Input with Visibility Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <span
                    onClick={() => toast.info('Demo password is set to Password123! across accounts.')}
                    className="text-[11px] text-violet-400 hover:text-violet-300 cursor-pointer font-medium transition-colors"
                  >
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
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

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300">Remember this device</span>
                </label>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 text-white font-bold"
                isLoading={loading}
                icon={ArrowRight}
              >
                Sign In to Workspace
              </Button>
            </form>

            {/* Quick 1-Click Demo Access */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Demo Fast Access:
                </span>
                <span className="text-[10px] text-cyan-400 font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  1-Click Fill & Sign In
                </span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@apex.com')}
                  className="w-full py-2 px-3 rounded-xl bg-[#0b101e]/80 hover:bg-[#11192e] border border-slate-700/80 hover:border-violet-500/50 text-xs text-left flex items-center justify-between transition-all group shadow-sm"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold text-xs border border-violet-500/30 group-hover:scale-105 transition-transform">
                      A
                    </div>
                    <div>
                      <span className="font-bold text-white group-hover:text-violet-300 transition-colors">
                        System Administrator
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">admin@apex.com</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-violet-300 font-bold px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30">
                    Use
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('agent.sarah@apex.com')}
                  className="w-full py-2 px-3 rounded-xl bg-[#0b101e]/80 hover:bg-[#11192e] border border-slate-700/80 hover:border-cyan-500/50 text-xs text-left flex items-center justify-between transition-all group shadow-sm"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs border border-cyan-500/30 group-hover:scale-105 transition-transform">
                      S
                    </div>
                    <div>
                      <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        Support Agent (Sarah)
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">agent.sarah@apex.com</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                    Use
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('alex.turner@gmail.com')}
                  className="w-full py-2 px-3 rounded-xl bg-[#0b101e]/80 hover:bg-[#11192e] border border-slate-700/80 hover:border-emerald-500/50 text-xs text-left flex items-center justify-between transition-all group shadow-sm"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/30 group-hover:scale-105 transition-transform">
                      C
                    </div>
                    <div>
                      <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                        Customer (Alex Turner)
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">alex.turner@gmail.com</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    Use
                  </span>
                </button>
              </div>
            </div>

            {/* Registration link */}
            <div className="mt-5 text-center">
              <Link
                to="/register"
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors inline-flex items-center gap-1"
              >
                <span>New business tenant? Register your organization</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Customer Portal Quick Link */}
          <div className="text-center pt-2">
            <Link
              to="/customer-chat"
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Looking for customer live chat support? Open Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
