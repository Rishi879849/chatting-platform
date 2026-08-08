import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  EyeOff, 
  User, 
  Code2, 
  Binary, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles,
  Hash
} from 'lucide-react';
import { analyzeContent } from '../services/moderationEngine';

export function ChatComposer() {
  const { 
    currentUser, 
    identityMode, 
    toggleIdentityMode, 
    sendChatMessage, 
    activeChannelId, 
    servers, 
    activeServerId 
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [liveWarning, setLiveWarning] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0];
  const activeChannel = activeServer.channels ? activeServer.channels.find(c => c.id === activeChannelId) : null;

  // Real-time character-by-character safety check as user types
  const handleChange = (e) => {
    const val = e.target.value;
    setMessageText(val);

    if (val.trim()) {
      const analysis = analyzeContent(val, '');
      if (analysis.warnings.length > 0) {
        setLiveWarning(analysis.warnings[0]);
      } else {
        setLiveWarning('');
      }
      setIsBlocked(analysis.autoQuarantine);
    } else {
      setLiveWarning('');
      setIsBlocked(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!messageText.trim()) return;

    const success = sendChatMessage(messageText.trim());
    if (success) {
      setMessageText('');
      setLiveWarning('');
      setIsBlocked(false);
    }
  };

  const insertSnippet = (snippetType) => {
    if (snippetType === 'CODE') {
      const codeTemplate = `\n\`\`\`cpp\n// Insert C++ / Python code here\n#include <iostream>\nint main() {\n    return 0;\n}\n\`\`\`\n`;
      setMessageText(prev => prev + codeTemplate);
    } else if (snippetType === 'MATH') {
      const mathTemplate = `\n$$\n\\frac{\\partial L}{\\partial W} = \\sum_{i=1}^N (y_i - \\hat{y}_i) x_i\n$$\n`;
      setMessageText(prev => prev + mathTemplate);
    }
  };

  return (
    <div className="mt-3 bg-[#090e1c] border border-[#1a233a] rounded-2xl p-3 shadow-2xl relative">
      
      {/* Real-Time Moderation Sliding Warning Banner */}
      <AnimatePresence>
        {liveWarning && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: 10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mb-3 bg-gradient-to-r from-amber-950/90 to-rose-950/90 border border-amber-500/40 p-3 rounded-xl text-xs text-amber-200 flex items-start gap-2.5 shadow-md overflow-hidden"
          >
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300">Safety Guardrail Alert</p>
              <p className="mt-0.5 text-slate-200">{liveWarning}</p>
              {isBlocked && (
                <p className="mt-1 text-[11px] text-rose-300 font-mono">
                  🛑 Submission disabled until personal contact details are removed.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Helper Tools & Identity Pill */}
      <div className="flex items-center justify-between gap-3 mb-2">
        
        {/* Tactile Identity Switcher Pill */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleIdentityMode}
          className={`cursor-pointer px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all ${
            identityMode === 'ANONYMOUS'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 font-mono shadow-sm shadow-emerald-500/10'
              : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/10'
          }`}
          title="Click to toggle chat identity"
        >
          {identityMode === 'ANONYMOUS' ? (
            <>
              <EyeOff className="h-3.5 w-3.5 text-emerald-400" />
              <span>Chatting as: <strong className="text-white font-mono">{currentUser.pseudonym}</strong></span>
            </>
          ) : (
            <>
              <User className="h-3.5 w-3.5 text-indigo-400" />
              <span>Chatting as: <strong className="text-white">{currentUser.publicHandle}</strong></span>
            </>
          )}
        </motion.div>

        {/* Code & Math Helpers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => insertSnippet('CODE')}
            className="bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 hover:bg-cyan-900/60 transition-colors shadow-sm"
          >
            <Code2 className="h-3 w-3 text-cyan-400" />
            <span>+ C++ Code</span>
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('MATH')}
            className="bg-purple-950/60 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 hover:bg-purple-900/60 transition-colors shadow-sm"
          >
            <Binary className="h-3 w-3 text-purple-400" />
            <span>+ LaTeX Math</span>
          </button>
        </div>

      </div>

      {/* Main Textarea Input */}
      <div className="relative">
        <textarea
          rows="2"
          placeholder={`Message #${activeChannel ? activeChannel.name : 'dsa-chat'}... (LaTeX $$...$$ and Markdown \`\`\`cpp supported)`}
          value={messageText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full bg-[#050813] border border-[#1a233a] focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl p-3 pr-12 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none resize-none transition-all shadow-inner"
        ></textarea>

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!messageText.trim() || isBlocked}
          className="absolute right-2.5 bottom-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-40 text-slate-950 p-2 rounded-xl shadow-lg shadow-emerald-500/25 transition-all font-bold"
          title="Send Message"
        >
          <Send className="h-4 w-4 text-slate-950" />
        </motion.button>
      </div>

      {/* Bottom Footer Note */}
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
          <span>AcadSphere Real-Time Safety Guard</span>
        </span>
        <span>Zero personal contact exchange strictly enforced</span>
      </div>

    </div>
  );
}
