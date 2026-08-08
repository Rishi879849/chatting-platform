import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, User, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

export function IdentityToggle() {
  const { currentUser, identityMode, toggleIdentityMode, regenerateUserPseudonym } = useApp();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl p-4 mb-6 transition-all duration-500 border overflow-hidden ${
        identityMode === 'ANONYMOUS'
          ? 'bg-gradient-to-r from-[#0d1f19]/90 via-[#0d1727]/90 to-[#111827] border-emerald-500/40 shadow-lg shadow-emerald-950/40'
          : 'bg-gradient-to-r from-[#17153b]/90 via-[#18102b]/90 to-[#111827] border-indigo-500/40 shadow-lg shadow-indigo-950/40'
      }`}
    >
      {/* Background Animated Glow Orb */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          identityMode === 'ANONYMOUS' ? 'bg-emerald-500' : 'bg-indigo-500'
        }`}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left: Mode Context */}
        <div className="flex items-start gap-3">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-xl shrink-0 border transition-all ${
              identityMode === 'ANONYMOUS' 
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 shadow-md shadow-emerald-500/20' 
                : 'bg-indigo-950/80 text-indigo-400 border-indigo-500/40 shadow-md shadow-indigo-500/20'
            }`}
          >
            <AnimatePresence mode="wait">
              {identityMode === 'ANONYMOUS' ? (
                <motion.div
                  key="anon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <EyeOff className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="public"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <User className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Posting Identity:</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                identityMode === 'ANONYMOUS' 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 font-mono' 
                  : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
              }`}>
                {identityMode === 'ANONYMOUS' ? 'Pseudonymous Handle' : 'Public Profile Handle'}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-base font-mono font-extrabold text-white">
                {identityMode === 'ANONYMOUS' ? currentUser.pseudonym : currentUser.publicHandle}
              </span>
              {identityMode === 'ANONYMOUS' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={regenerateUserPseudonym}
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 bg-slate-900/80 border border-slate-800 px-2 py-0.5 rounded-lg transition-colors font-mono"
                  title="Generate a new pseudonymous handle"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Randomize</span>
                </motion.button>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Real identity is completely decoupled from pseudonymous posts.</span>
            </p>
          </div>
        </div>

        {/* Right: Tactile Switcher Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={toggleIdentityMode}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg font-mono ${
            identityMode === 'ANONYMOUS'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Switch to {identityMode === 'ANONYMOUS' ? 'Public Mode' : 'Pseudonymous Mode'}</span>
        </motion.button>

      </div>
    </motion.div>
  );
}
