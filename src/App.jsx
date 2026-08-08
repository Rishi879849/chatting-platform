import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ServerSidebar } from './components/ServerSidebar';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ChatRoomView } from './components/ChatRoomView';
import { ChatComposer } from './components/ChatComposer';
import { ThreadList } from './components/ThreadList';
import { ThreadDetail } from './components/ThreadDetail';
import { AdminDashboard } from './components/AdminDashboard';
import { CommandPalette } from './components/CommandPalette';
import { CreateChannelModal } from './components/CreateChannelModal';
import { CreateThreadModal } from './components/CreateThreadModal';
import { ReportModal } from './components/ReportModal';
import { CollegeVerificationModal } from './components/CollegeVerificationModal';
import { UserProfileModal } from './components/UserProfileModal';
import { GuidelinesModal } from './components/GuidelinesModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  MessageSquare,
  Radio,
  PlusCircle,
  FileQuestion
} from 'lucide-react';

function AppContent() {
  const { 
    activeView, 
    setActiveView,
    currentUser, 
    setIsVerificationModalOpen, 
    setIsGuidelinesModalOpen,
    setIsCreateModalOpen,
    setSelectedThreadId,
    setSearchQuery,
    toasts,
    servers,
    activeServerId,
    activeChannelId,
    simulateLoading
  } = useApp();

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0];
  const activeChannel = activeServer.channels ? activeServer.channels.find(c => c.id === activeChannelId) : null;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navbar Header */}
      <Navbar />

      {/* Main Discord Workspace Layout */}
      <div className="flex-1 flex min-w-0">
        
        {/* Left-Most Server Sidebar Rail */}
        <ServerSidebar />

        {/* Channel Navigation Sidebar Drawer */}
        <Sidebar />

        {/* Center Main Content Area */}
        <main className="flex-1 p-3 lg:p-4 min-w-0 flex flex-col overflow-hidden">
          
          <AnimatePresence mode="wait">
            {activeView === 'CHAT' ? (
              <motion.div
                key="chat-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <ChatRoomView />
                <ChatComposer />
              </motion.div>
            ) : activeView === 'FEED' ? (
              <motion.div
                key="feed-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto"
              >
                <ThreadList />
              </motion.div>
            ) : activeView === 'THREAD_DETAIL' ? (
              <motion.div
                key="detail-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto"
              >
                <ThreadDetail />
              </motion.div>
            ) : (
              <motion.div
                key="admin-view"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto"
              >
                <AdminDashboard />
              </motion.div>
            )}
          </AnimatePresence>

        </main>

        {/* Right Context & Focus Panel */}
        <aside className="w-72 shrink-0 hidden xl:flex flex-col border-l border-[#1a233a] p-4 min-h-[calc(100vh-61px)] bg-[#070c18] space-y-4">
          
          {/* Institutional Student Status */}
          <div className="bg-[#090e1c] border border-[#1a233a] rounded-2xl p-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-2">
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              <span className="font-heading">DTV Learner Status</span>
            </div>
            
            <div className="bg-[#050813] p-3 rounded-xl border border-[#1a233a] mb-3 shadow-inner">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>{currentUser.college}</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 block mt-0.5 font-medium">Domain Verified (.ac.in)</span>
            </div>

            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="w-full bg-[#0d1428] hover:bg-[#131d38] text-slate-200 text-xs font-semibold py-2 rounded-xl border border-[#1a233a] hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Manage Verified Domain</span>
            </button>
          </div>

          {/* Room Mode Switcher Quick Pill */}
          <div className="bg-[#090e1c] border border-[#1a233a] rounded-2xl p-4 shadow-xl space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>View Mode</span>
              <span className="text-[10px] font-mono text-cyan-400 font-normal">#{activeChannel?.name || 'chat'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => simulateLoading(() => setActiveView('CHAT'), 200)}
                className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                  activeView === 'CHAT'
                    ? 'bg-gradient-to-r from-emerald-950/90 to-teal-950/90 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-950/50'
                    : 'bg-[#050813] text-slate-400 border-[#1a233a] hover:text-white hover:border-cyan-500/30'
                }`}
              >
                <Radio className="h-4 w-4 text-emerald-400" />
                <span>Live Chat</span>
              </button>

              <button
                onClick={() => simulateLoading(() => setActiveView('FEED'), 200)}
                className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                  activeView === 'FEED' || activeView === 'THREAD_DETAIL'
                    ? 'bg-gradient-to-r from-indigo-950/90 to-purple-950/90 text-indigo-200 border-indigo-500/50 shadow-md shadow-indigo-950/50'
                    : 'bg-[#050813] text-slate-400 border-[#1a233a] hover:text-white hover:border-cyan-500/30'
                }`}
              >
                <MessageSquare className="h-4 w-4 text-indigo-400" />
                <span>Threads Feed</span>
              </button>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-extrabold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all mt-1"
            >
              <PlusCircle className="h-3.5 w-3.5 text-slate-950" />
              <span>Ask a Question Thread</span>
            </button>
          </div>

          {/* High Yield Topics */}
          <div className="bg-[#090e1c] border border-[#1a233a] rounded-2xl p-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
              <span>High-Yield CS Topics</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div 
                onClick={() => {
                  setSearchQuery('Knapsack');
                  setSelectedThreadId('th-1');
                  simulateLoading(() => setActiveView('THREAD_DETAIL'), 200);
                }}
                className="bg-[#050813] p-2.5 rounded-xl border border-[#1a233a] hover:border-cyan-500/40 transition-all cursor-pointer group shadow-inner"
              >
                <span className="font-semibold text-slate-200 group-hover:text-cyan-300 block text-[11px] transition-colors">Dynamic Programming 1D Knapsack</span>
                <span className="text-[10px] font-mono text-emerald-400">Space Reduction Proof</span>
              </div>

              <div 
                onClick={() => {
                  setSearchQuery('Peterson');
                  setSelectedThreadId('th-2');
                  simulateLoading(() => setActiveView('THREAD_DETAIL'), 200);
                }}
                className="bg-[#050813] p-2.5 rounded-xl border border-[#1a233a] hover:border-indigo-500/40 transition-all cursor-pointer group shadow-inner"
              >
                <span className="font-semibold text-slate-200 group-hover:text-indigo-300 block text-[11px] transition-colors">Peterson's OS Synchronization</span>
                <span className="text-[10px] font-mono text-indigo-400">Memory Barriers & Atomic Fences</span>
              </div>
            </div>
          </div>

          {/* AcadSphere Pledge */}
          <div className="bg-gradient-to-br from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 rounded-2xl p-4 text-xs mt-auto shadow-lg">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span className="font-heading">AcadSphere Guarantee</span>
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-relaxed mb-3 font-medium">
              Real-time academic chat. Tactile privacy decoupling. Zero contact exchange.
            </p>
            <button
              onClick={() => setIsGuidelinesModalOpen(true)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Read Community Honor Code
            </button>
          </div>

        </aside>

      </div>

      {/* Global Command Palette & Modals */}
      <CommandPalette />
      <CreateChannelModal />
      <CreateThreadModal />
      <ReportModal />
      <CollegeVerificationModal />
      <UserProfileModal />
      <GuidelinesModal />

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map(t => (
          <motion.div 
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className={`pointer-events-auto px-4 py-3 rounded-2xl border text-xs font-semibold shadow-2xl backdrop-blur-xl flex items-center gap-2 ${
              t.type === 'success' 
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/60 shadow-emerald-500/20' 
                : t.type === 'error' 
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/60 shadow-rose-500/20' 
                : t.type === 'warning' 
                ? 'bg-amber-950/90 text-amber-200 border-amber-500/60 shadow-amber-500/20'
                : 'bg-[#090e1c]/90 text-slate-200 border-[#1a233a] shadow-black/60'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
            {t.type === 'error' && <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />}
            {t.type === 'warning' && <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

