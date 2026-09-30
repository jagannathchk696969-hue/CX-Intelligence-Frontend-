import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Users,
  Ticket,
  Sparkles,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CXLogo } from '../common/CXLogo';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const sections = [
    {
      title: 'Core Platform',
      items: [
        { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'AI Assistant', path: '/dashboard/assistant', icon: Bot, badge: 'Live AI', badgeVariant: 'cyan' },
        { label: 'Live Conversations', path: '/dashboard/conversations', icon: MessageSquare },
      ]
    },
    {
      title: 'Customer Operations',
      items: [
        { label: 'Support Tickets', path: '/dashboard/tickets', icon: Ticket },
        { label: 'Customers', path: '/dashboard/customers', icon: Users },
        { label: 'Knowledge Base', path: '/dashboard/knowledge', icon: BookOpen },
      ]
    },
    {
      title: 'Intelligence & Config',
      items: [
        { label: 'Smart Recommendations', path: '/dashboard/recommendations', icon: Sparkles },
        { label: 'CX Analytics', path: '/dashboard/analytics', icon: BarChart3 },
        { label: 'Platform Settings', path: '/dashboard/settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-md lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 glass-panel border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4 border-b border-slate-800/80 justify-between relative overflow-hidden">
          {/* Subtle violet glow */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-violet-500/20 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center z-10">
            <CXLogo size="md" subtitle="AI Enterprise" />
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 border border-violet-400/30'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 hover:border-slate-700/60 border border-transparent'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Profile Card & Sign Out */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-2.5">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                  alt={user?.fullName || 'User'}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-100 truncate">{user?.fullName || 'Demo Admin'}</p>
                <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                  <span className="capitalize">{user?.role?.replace('_', ' ') || 'Admin'}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">Online</span>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-semibold text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all border border-slate-800 hover:border-rose-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
