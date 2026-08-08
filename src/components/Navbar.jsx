import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  EyeOff, 
  Lock, 
  HelpCircle,
  BarChart2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export function Navbar() {
  const { 
    currentUser, 
    identityMode, 
    toggleIdentityMode, 
    searchQuery = '', 
    setSearchQuery,
    setIsCreateModalOpen,
    setIsVerificationModalOpen,
    setIsGuidelinesModalOpen,
    setProfileViewTarget,
    activeView, 
    setActiveView,
    reports = [],
    simulateLoading
  } = useApp();

  const pendingReportsCount = (reports || []).filter(r => r.status === 'PENDING').length;

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() && activeView !== 'FEED') {
      setActiveView('FEED');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#060a14]/85 backdrop-blur-xl border-b border-[#1a233a] px-4 lg:px-8 py-2.5 shadow-2xl shadow-black/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Branding */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => simulateLoading(() => setActiveView('CHAT'), 200)}
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center group-hover:scale-105 group-hover:shadow-cyan-500/30 transition-all duration-300">
            <div className="h-full w-full bg-[#070b16] rounded-[10px] flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-indigo-300 transition-all">AcadSphere</span>
              <span className="bg-gradient-to-r from-emerald-950/90 to-cyan-950/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase shadow-sm">DTV Verse</span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">Decoupled Academic Intelligence</p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search concepts, DSA math, OS threads, algorithms..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-[#0a1020] border border-[#1e2a47] focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all font-mono shadow-inner"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Identity Toggle Switcher Pill */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={toggleIdentityMode}
            className={`cursor-pointer px-3 py-1.5 rounded-full flex items-center gap-2 transition-all text-xs font-semibold select-none border ${
              identityMode === 'ANONYMOUS' ? 'identity-anon-glow text-emerald-300' : 'identity-public-glow text-indigo-300'
            }`}
            title="Click to toggle between Pseudonymous and Public posting mode"
          >
            {identityMode === 'ANONYMOUS' ? (
              <>
                <EyeOff className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline text-emerald-400/90">Posting as:</span>
                <span className="font-mono text-emerald-200 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">{currentUser.pseudonym}</span>
              </>
            ) : (
              <>
                <User className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline text-indigo-300/90">Posting as:</span>
                <span className="font-mono text-indigo-200 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30 font-semibold">{currentUser.publicHandle}</span>
              </>
            )}
          </motion.div>

          {/* Institutional Verification Status */}
          {currentUser.isVerified ? (
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsVerificationModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 text-emerald-300 border border-emerald-500/40 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:border-emerald-400 transition-all shadow-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{currentUser.college}</span>
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsVerificationModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/60 to-rose-950/60 text-amber-300 border border-amber-500/40 px-2.5 py-1.5 rounded-xl text-xs font-medium hover:border-amber-400 transition-all shadow-sm"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Verify College</span>
            </motion.button>
          )}

          {/* Admin Dashboard Navigation */}
          {currentUser.role === 'ADMIN' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => simulateLoading(() => setActiveView(activeView === 'ADMIN' ? 'CHAT' : 'ADMIN'), 200)}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all relative ${
                activeView === 'ADMIN'
                  ? 'bg-purple-950/90 border-purple-500/60 text-purple-200 shadow-lg shadow-purple-950/50'
                  : 'bg-[#0e1529] border-[#1e2a47] text-slate-300 hover:text-white hover:border-purple-500/30'
              }`}
              title="Admin & Moderation Dashboard"
            >
              <BarChart2 className="h-4 w-4 text-purple-400" />
              <span className="hidden xl:inline">Mod Panel</span>
              {pendingReportsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold shadow-md">
                  {pendingReportsCount}
                </span>
              )}
            </motion.button>
          )}

          {/* Guidelines */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsGuidelinesModalOpen(true)}
            className="p-2 text-slate-400 hover:text-cyan-300 rounded-xl bg-[#0a1020] border border-[#1e2a47] hover:border-cyan-500/30 transition-all"
            title="Academic Honor Code & Guidelines"
          >
            <HelpCircle className="h-4 w-4" />
          </motion.button>

          {/* Create Academic Thread Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all"
          >
            <PlusCircle className="h-4 w-4 text-slate-950" />
            <span className="hidden sm:inline">Ask / Discuss</span>
          </motion.button>

          {/* User Profile View Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setProfileViewTarget(currentUser)}
            className="h-8 w-8 rounded-xl bg-[#0e1529] border border-[#1e2a47] flex items-center justify-center hover:border-cyan-500/40 transition-all shadow-sm"
            title="View Profile & Badges"
          >
            <User className="h-4 w-4 text-slate-300" />
          </motion.button>
        </div>

      </div>
    </header>
  );
}


