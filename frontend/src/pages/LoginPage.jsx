import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Bot, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-pattern selection:bg-indigo-500 selection:text-white">
      {/* Dynamic ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none animate-glow-pulse" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation CX Platform</span>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/30 border border-white/20 mb-4">
          <Bot className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Sign In to <span className="text-gradient-primary">CX Intelligence</span>
        </h1>
        <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
          Omnichannel conversational support, real-time sentiment telemetry, and grounded resolution intelligence.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Card elevated className="p-8 border-slate-700/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@apex.com"
                  className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-inner"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 shadow-lg shadow-indigo-600/30"
              isLoading={loading}
              icon={ArrowRight}
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quick Demo Access:
              </span>
              <span className="text-[10px] text-cyan-400 font-semibold">1-Click Sign In</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@apex.com')}
                className="w-full py-2 px-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/40 text-xs text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30 group-hover:scale-105 transition-transform">
                    A
                  </div>
                  <div>
                    <span className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                      System Administrator
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">admin@apex.com</span>
                  </div>
                </div>
                <span className="text-[10px] text-indigo-300 font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                  Select
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('agent.sarah@apex.com')}
                className="w-full py-2 px-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/40 text-xs text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30 group-hover:scale-105 transition-transform">
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
                  Select
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('alex.turner@gmail.com')}
                className="w-full py-2 px-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/40 text-xs text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30 group-hover:scale-105 transition-transform">
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
                  Select
                </span>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link to="/register" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              New business tenant? Register your organization →
            </Link>
          </div>
        </Card>

        {/* Enterprise trust badges */}
        <div className="mt-6 flex items-center justify-center space-x-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SOC 2 Type II</span>
          </span>
          <span>•</span>
          <span>HIPAA Compliant</span>
          <span>•</span>
          <span>256-bit TLS</span>
        </div>
      </div>
    </div>
  );
};
