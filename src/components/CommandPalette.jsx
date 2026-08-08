import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Hash, 
  Code2, 
  Database, 
  Cpu, 
  Briefcase, 
  GraduationCap, 
  EyeOff, 
  User, 
  PlusCircle, 
  BarChart2, 
  X,
  CornerDownLeft,
  Radio,
  MessageSquare
} from 'lucide-react';

export function CommandPalette() {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    servers = [], 
    setActiveChannelId, 
    setActiveView,
    toggleIdentityMode,
    setIsCreateModalOpen,
    setSelectedThreadId,
    threads = [],
    simulateLoading
  } = useApp();

  const [query, setQuery] = useState('');

  // Global Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Flatten channels across all servers safely
  const safeServers = servers || [];
  const safeThreads = threads || [];
  const allChannels = safeServers.flatMap(s => (s.channels || []).map(c => ({ ...c, serverName: s.name })));

  const filteredChannels = allChannels.filter(c => 
    (c.name || '').toLowerCase().includes(query.toLowerCase()) || 
    (c.description || '').toLowerCase().includes(query.toLowerCase())
  );

  const filteredThreads = safeThreads.filter(t => 
    (t.title || '').toLowerCase().includes(query.toLowerCase()) ||
    (t.tags || []).some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSelectChannel = (channelId, targetView = 'CHAT') => {
    setActiveChannelId(channelId);
    simulateLoading(() => {
      setActiveView(targetView);
    }, 200);
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  const handleSelectThread = (threadId) => {
    setSelectedThreadId(threadId);
    simulateLoading(() => {
      setActiveView('THREAD_DETAIL');
    }, 200);
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-20 p-4 overflow-y-auto">
        
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={() => setIsCommandPaletteOpen(false)} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative w-full max-w-xl bg-[#090e1c] border border-[#1a233a] rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-l from-indigo-500/10 via-cyan-500/10 to-transparent pointer-events-none" />

          {/* Search Header */}
          <div className="relative border-b border-[#1a233a] p-4 flex items-center gap-3 bg-[#060a14]">
            <Search className="h-5 w-5 text-cyan-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search channels (#dsa), threads, or type action..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
            />
            <button 
              onClick={() => setIsCommandPaletteOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Command List Body */}
          <div className="max-h-[380px] overflow-y-auto p-3 space-y-4 no-scrollbar">
            
            {/* Quick Actions */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Quick Actions</div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    toggleIdentityMode();
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#050813] hover:text-white border border-transparent hover:border-[#1a233a] flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4 text-emerald-400" />
                    <span>Toggle Pseudonymous / Public Identity Mode</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded shadow-sm">Action</span>
                </button>

                <button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#050813] hover:text-white border border-transparent hover:border-[#1a233a] flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4 text-cyan-400" />
                    <span>Ask a New Academic Question Thread</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded shadow-sm">Action</span>
                </button>

                <button
                  onClick={() => {
                    simulateLoading(() => setActiveView('FEED'), 200);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#050813] hover:text-white border border-transparent hover:border-[#1a233a] flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-indigo-400" />
                    <span>Jump to Academic Discussions Feed</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 px-2 py-0.5 rounded shadow-sm">Feed</span>
                </button>
              </div>
            </div>

            {/* Channels List */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Academic Channels</div>
              <div className="space-y-1">
                {filteredChannels.length === 0 ? (
                  <div className="text-xs text-slate-500 px-3 py-2 italic">No channels found.</div>
                ) : (
                  filteredChannels.map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => handleSelectChannel(channel.id, 'CHAT')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-[#050813] hover:text-white border border-transparent hover:border-[#1a233a] flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Hash className="h-4 w-4 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
                        <div>
                          <span className="font-mono font-semibold text-slate-200">{channel.name}</span>
                          <span className="text-[10px] text-slate-400 ml-2">({channel.serverName})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-mono text-cyan-400">Open Chat</span>
                        <CornerDownLeft className="h-3.5 w-3.5 text-cyan-400" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Matching Academic Threads */}
            {query.trim() && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Academic Threads</div>
                <div className="space-y-1">
                  {filteredThreads.slice(0, 4).map(thread => (
                    <button
                      key={thread.id}
                      onClick={() => handleSelectThread(thread.id)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-[#050813] hover:text-white border border-transparent hover:border-[#1a233a] transition-all"
                    >
                      <div className="font-semibold text-slate-200 line-clamp-1">{thread.title}</div>
                      <div className="text-[10px] font-mono text-cyan-400 mt-0.5">Author: {thread.author?.handle}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer keyboard guide */}
          <div className="bg-[#060a14] px-4 py-2.5 border-t border-[#1a233a] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Use ↑ ↓ to navigate</span>
            <span>ESC to close</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}


