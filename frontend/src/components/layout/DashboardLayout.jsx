import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { LiveChatWidget } from '../chatbot/LiveChatWidget';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [liveChatOpen, setLiveChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient background lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-1/4 w-[500px] h-[350px] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <TopNavbar
          onOpenSidebar={() => setSidebarOpen(true)}
          onToggleLiveChat={() => setLiveChatOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Floating Customer Live Chat Widget */}
      <LiveChatWidget
        isOpen={liveChatOpen}
        onClose={() => setLiveChatOpen(false)}
        onToggle={() => setLiveChatOpen((prev) => !prev)}
      />
    </div>
  );
};
