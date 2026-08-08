import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  Hash, 
  Code2, 
  Database, 
  Cpu, 
  Sparkles, 
  Network, 
  Binary, 
  Briefcase, 
  GraduationCap, 
  GitFork, 
  Plus, 
  Search, 
  BookOpen, 
  ChevronDown, 
  ShieldCheck,
  Radio,
  MessageSquare
} from 'lucide-react';

export function Sidebar() {
  const { 
    servers = [], 
    activeServerId, 
    activeChannelId, 
    setActiveChannelId, 
    activeView,
    setActiveView,
    setIsCreateChannelModalOpen,
    setIsCommandPaletteOpen,
    simulateLoading
  } = useApp();

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0] || {};
  const subjectChannels = activeServer.channels ? activeServer.channels.filter(c => c.category === 'SUBJECT' || c.category === 'OFFICIAL') : [];
  const careerChannels = activeServer.channels ? activeServer.channels.filter(c => c.category === 'CAREER') : [];

  const handleChannelClick = (channelId) => {
    simulateLoading(() => {
      setActiveChannelId(channelId);
      if (activeView === 'ADMIN') {
        setActiveView('CHAT');
      }
    }, 200);
  };

  return (
    <aside className="w-60 shrink-0 hidden md:flex flex-col bg-[#070c18] border-r border-[#1a233a] min-h-[calc(100vh-61px)] select-none">
      
      {/* Server Header Title */}
      <div className="h-14 border-b border-[#1a233a] px-4 flex items-center justify-between font-heading font-extrabold text-sm text-white bg-[#090e1e]">
        <div className="flex items-center gap-2 truncate">
          <span className="truncate bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">{activeServer.name || 'AcadSphere'}</span>
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">DTV</span>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
      </div>

      {/* Cmd + K Search Trigger Button */}
      <div className="p-3 pb-1">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full bg-[#0d1428] hover:bg-[#131d38] border border-[#1e2a47] rounded-xl px-3 py-2 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-between transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-cyan-400" />
            <span>Search channels...</span>
          </div>
          <kbd className="bg-[#060a14] text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">⌘K</kbd>
        </button>
      </div>

      {/* View Mode Switcher within sidebar */}
      <div className="p-3 pt-2">
        <div className="bg-[#050813] border border-[#1a233a] rounded-xl p-1 grid grid-cols-2 gap-1 text-[11px] font-semibold shadow-inner">
          <button
            onClick={() => simulateLoading(() => setActiveView('CHAT'), 150)}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeView === 'CHAT'
                ? 'bg-gradient-to-r from-emerald-950/90 to-teal-950/90 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Radio className="h-3.5 w-3.5 text-emerald-400" />
            <span>Live Chat</span>
          </button>

          <button
            onClick={() => simulateLoading(() => setActiveView('FEED'), 150)}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeView === 'FEED' || activeView === 'THREAD_DETAIL'
                ? 'bg-gradient-to-r from-indigo-950/90 to-purple-950/90 text-indigo-200 border border-indigo-500/50 shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
            <span>Threads</span>
          </button>
        </div>
      </div>

      {/* Channels Drawer */}
      <div className="flex-1 overflow-y-auto px-2 space-y-5 no-scrollbar">
        
        {/* Category 1: Academic Subject Rooms */}
        <div>
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Academic Channels</span>
            <button
              onClick={() => setIsCreateChannelModalOpen(true)}
              className="text-slate-400 hover:text-cyan-400 p-0.5 rounded hover:bg-slate-800 transition-colors"
              title="Create Channel"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {subjectChannels.map(channel => {
              const isActive = activeChannelId === channel.id && activeView !== 'ADMIN';
              return (
                <button
                  key={channel.id}
                  onClick={() => handleChannelClick(channel.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between group transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-950/90 to-purple-950/80 text-white font-semibold border border-indigo-500/40 shadow-md shadow-indigo-950/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="truncate font-mono">{channel.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category 2: Career Tracks */}
        {careerChannels.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Career & Internships</span>
            </div>

            <div className="space-y-0.5">
              {careerChannels.map(channel => {
                const isActive = activeChannelId === channel.id && activeView !== 'ADMIN';
                return (
                  <button
                    key={channel.id}
                    onClick={() => handleChannelClick(channel.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between group transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-amber-950/90 to-orange-950/80 text-white font-semibold border border-amber-500/40 shadow-md shadow-amber-950/30' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span className="truncate font-mono">{channel.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Community Honor Code Widget */}
      <div className="p-3 border-t border-[#1a233a] bg-[#050813]">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span>Zero Distraction</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
          AI Auto-Quarantine active for phone/email exchange.
        </p>
      </div>

    </aside>
  );
}


