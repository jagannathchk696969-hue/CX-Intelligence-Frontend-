import React, { useState } from 'react';
import { Menu, Search, Bell, Sparkles, ExternalLink, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const TopNavbar = ({ onOpenSidebar, onToggleLiveChat }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 glass-panel border-b border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left side: Hamburger button + Quick search */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets, customers, articles..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right side: AI status indicator, Customer Portal Link, Notification bell, User info */}
      <div className="flex items-center space-x-3">
        {/* Customer Portal / Live Chat Trigger */}
        <div className="inline-flex items-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={onToggleLiveChat}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            title="Open Live Chat Widget"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Customer Live Chat</span>
          </button>
          <Link
            to="/customer-chat"
            target="_blank"
            className="p-1.5 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/20 border-l border-cyan-500/20 transition-colors"
            title="Open Full Screen Portal in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* AI Health Badge */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">Gemini 3.8 AI Engine</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-1.5 right-1.5 ring-2 ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl p-4 shadow-2xl border border-slate-700 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-indigo-400 cursor-pointer">Mark all as read</span>
              </div>
              <div className="py-2 space-y-2.5">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                  <p className="font-semibold text-rose-300">Negative Sentiment Alert</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">Maya Lin's webhook inquiry was escalated.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">15m ago</span>
                </div>
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs">
                  <p className="font-semibold text-indigo-300">Ticket Priority Suggested</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">AI suggested URGENT for production incident #1001.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
