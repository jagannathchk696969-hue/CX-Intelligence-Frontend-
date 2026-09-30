import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Bot, Lock, Mail, User, Building, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    businessName: '',
    role: 'customer',
  });
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-grid-pattern selection:bg-indigo-500 selection:text-white">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none animate-glow-pulse" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/30 border border-white/20 mb-4">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create <span className="text-gradient-primary">CX Workspace</span>
        </h1>
        <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
          Deploy enterprise-grade conversational AI, ticketing, and customer telemetry.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Card elevated className="p-8 border-slate-700/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jordan@company.com"
                  className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Account Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-inner"
              >
                <option value="customer">Customer / Client</option>
                <option value="support_agent">Support Agent</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>

            {formData.role === 'admin' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Business / Organization Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Acme Tech Solutions"
                    className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-inner"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 8 characters"
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
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Already have an enterprise account? Sign in here →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
