import React, { useState } from 'react';
import { Menu, Search, Bell, Sparkles, ExternalLink, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { CXLogo } from '../common/CXLogo';

export const TopNavbar = ({ onOpenSidebar, onToggleLiveChat }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 glass-panel border-b border-slate-800/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left side: Hamburger + Brand on mobile + Quick Search */}
      <div className="flex items-center space-x-3.5">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-all"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <CXLogo size="sm" showText={false} />
        </div>

        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets, customers, articles..."
            className="w-full bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 rounded-xl pl-9 pr-14 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-inner"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700 pointer-events-none">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right side: Customer Portal trigger, AI Health Badge, Notification Bell */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Customer Portal / Live Chat Trigger */}
        <div className="inline-flex items-center rounded-xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-cyan-500/10 border border-cyan-500/30 overflow-hidden shadow-sm hover:border-cyan-400/50 transition-all">
          <button
            type="button"
            onClick={onToggleLiveChat}
            className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all"
            title="Open Live Customer Chat"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="hidden xs:inline">Customer Live Chat</span>
            <span className="xs:hidden">Chat</span>
          </button>
          <Link
            to="/customer-chat"
            target="_blank"
            className="p-1.5 text-cyan-400 hover:text-white hover:bg-cyan-500/25 border-l border-cyan-500/20 transition-all"
            title="Open Customer Chat in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* AI Engine Status Indicator */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">Gemini 2.5 Flash</span>
          <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20">
            Active
          </span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/80 relative transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-1.5 right-1.5 ring-2 ring-slate-950" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 glass-panel-elevated rounded-2xl p-4 shadow-2xl border border-slate-700/80 z-50 animate-scale-in">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                <span className="text-xs font-bold text-white tracking-wide">Live Telemetry Alerts</span>
                <span className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer font-semibold">
                  Mark all as read
                </span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs transition-colors hover:bg-rose-500/15">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-rose-300">Negative Sentiment Escalation</p>
                    <span className="text-[10px] text-slate-400">12m ago</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-1">Customer inquiry escalated to Tier 2 live support engineer.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs transition-colors hover:bg-indigo-500/15">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-indigo-300">Smart Priority Recommendation</p>
                    <span className="text-[10px] text-slate-400">45m ago</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-1">AI assigned URGENT priority for enterprise webhook timeout.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
