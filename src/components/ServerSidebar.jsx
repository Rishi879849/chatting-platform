import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Code2, 
  Briefcase, 
  Sparkles, 
  Plus, 
  ShieldCheck, 
  BarChart2, 
  HelpCircle,
  Hash
} from 'lucide-react';

const ICON_MAP = {
  GraduationCap,
  Code2,
  Briefcase,
  Sparkles
};

export function ServerSidebar() {
  const { 
    servers = [], 
    activeServerId, 
    setActiveServerId, 
    setActiveChannelId, 
    activeView, 
    setActiveView, 
    currentUser, 
    reports = [],
    setIsGuidelinesModalOpen,
    simulateLoading
  } = useApp();

  const pendingReportsCount = (reports || []).filter(r => r.status === 'PENDING').length;

  return (
    <nav className="w-[72px] shrink-0 bg-[#040711] border-r border-[#1a233a] flex flex-col items-center py-3 select-none z-30 shadow-2xl">
      
      {/* Platform Home Icon / DTV Brand */}
      <div 
        onClick={() => {
          simulateLoading(() => {
            setActiveServerId('srv-dtv');
            setActiveView('CHAT');
          }, 200);
        }}
        className="relative group cursor-pointer mb-3"
      >
        <div className="h-12 w-12 rounded-[18px] group-hover:rounded-[12px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center">
          <div className="h-full w-full bg-[#070b16] rounded-[16px] group-hover:rounded-[10px] flex items-center justify-center transition-all duration-300">
            <GraduationCap className="h-6 w-6 text-cyan-400" />
          </div>
        </div>

        {/* Active Pill */}
        {activeServerId === 'srv-dtv' && (activeView === 'CHAT' || activeView === 'FEED') && (
          <motion.div 
            layoutId="activeServerPill"
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-r-full shadow-lg shadow-cyan-500/50"
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
        )}

        {/* Tooltip */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-[#090e1e] text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-cyan-500/30 shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          AcadSphere Home
        </div>
      </div>

      <div className="w-8 h-[2px] bg-[#1a233a] rounded-full mb-3" />

      {/* Servers List */}
      <div className="flex-1 space-y-3 w-full flex flex-col items-center overflow-y-auto no-scrollbar">
        {servers.map(server => {
          const IconComp = ICON_MAP[server.icon] || GraduationCap;
          const isActive = activeServerId === server.id && activeView !== 'ADMIN';

          return (
            <div 
              key={server.id}
              onClick={() => {
                simulateLoading(() => {
                  setActiveServerId(server.id);
                  if (server.channels && server.channels.length > 0) {
                    setActiveChannelId(server.channels[0].id);
                  }
                  if (activeView === 'ADMIN') {
                    setActiveView('CHAT');
                  }
                }, 200);
              }}
              className="relative group cursor-pointer"
            >
              {/* Active Indicator Pill */}
              {isActive && (
                <motion.div 
                  layoutId="activeServerPill"
                  className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-indigo-400 to-cyan-400 rounded-r-full shadow-lg shadow-indigo-500/50"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}

              {/* Hover Indicator Pill */}
              {!isActive && (
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-slate-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-all" />
              )}

              <motion.div 
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={`h-12 w-12 rounded-[24px] group-hover:rounded-[14px] flex items-center justify-center font-heading font-extrabold text-sm transition-all duration-300 relative ${
                  isActive 
                    ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-xl shadow-indigo-600/40 border border-cyan-400/40' 
                    : 'bg-[#0a1020] border border-[#1a233a] text-slate-300 hover:bg-[#131d38] hover:text-white hover:border-cyan-500/30'
                }`}
              >
                <IconComp className="h-5 w-5" />

                {/* Unread Badge */}
                {server.unreadCount > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center border-2 border-[#040711] shadow-md">
                    {server.unreadCount}
                  </span>
                )}
              </motion.div>

              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-[#090e1e] text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#1a233a] shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {server.name}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-8 h-[2px] bg-[#1a233a] rounded-full my-3" />

      {/* Admin Panel Icon */}
      {currentUser.role === 'ADMIN' && (
        <div 
          onClick={() => simulateLoading(() => setActiveView(activeView === 'ADMIN' ? 'CHAT' : 'ADMIN'), 200)}
          className="relative group cursor-pointer mb-2"
        >
          {activeView === 'ADMIN' && (
            <motion.div 
              layoutId="activeServerPill"
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r-full shadow-lg shadow-purple-500/50"
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          )}
          <motion.div 
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`h-12 w-12 rounded-[24px] group-hover:rounded-[14px] flex items-center justify-center transition-all duration-300 relative ${
              activeView === 'ADMIN'
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-600/40 border border-pink-400/40'
                : 'bg-[#0a1020] border border-[#1a233a] text-purple-400 hover:bg-[#131d38] hover:border-purple-500/30'
            }`}
          >
            <BarChart2 className="h-5 w-5" />
            {pendingReportsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#040711] shadow-md">
                {pendingReportsCount}
              </span>
            )}
          </motion.div>
          <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-[#090e1e] text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-purple-500/30 shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Moderator Command Center
          </div>
        </div>
      )}

      {/* Guidelines Icon */}
      <div 
        onClick={() => setIsGuidelinesModalOpen(true)}
        className="relative group cursor-pointer"
      >
        <div className="h-10 w-10 rounded-full bg-[#0a1020] border border-[#1a233a] flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-[#131d38] hover:border-cyan-500/30 transition-all shadow-sm">
          <HelpCircle className="h-4 w-4" />
        </div>
        <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-[#090e1e] text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#1a233a] shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          Academic Honor Code
        </div>
      </div>

    </nav>
  );
}


