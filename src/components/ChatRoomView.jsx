import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkeletonChatMessage } from './SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { escapeHTML, sanitizeHTML } from '../services/sanitizer';
import { 
  Hash, 
  ThumbsUp, 
  CheckCircle2, 
  ShieldCheck, 
  EyeOff, 
  User, 
  Flag, 
  Code2, 
  Copy, 
  Check, 
  ArrowDown, 
  Sparkles,
  Award
} from 'lucide-react';

/**
 * Formats markdown code blocks and LaTeX math formulas inside chat bubbles with XSS defenses
 */
function FormatChatBubble({ content = '' }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const cleanContent = typeof content === 'string' ? content : '';
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(cleanContent)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: cleanContent.substring(lastIndex, match.index) });
    }
    parts.push({
      type: 'code',
      language: (match[1] || 'cpp').replace(/[^a-zA-Z0-9_-]/g, ''),
      code: match[2].trim()
    });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < cleanContent.length) {
    parts.push({ type: 'text', text: cleanContent.substring(lastIndex) });
  }

  const handleCopyCode = (codeStr, idx) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-2 text-slate-200 text-xs leading-relaxed">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return (
            <div key={idx} className="code-block-wrapper my-2">
              <div className="code-block-header">
                <span className="flex items-center gap-1 text-cyan-400 font-mono">
                  <Code2 className="h-3 w-3" />
                  <span>{part.language.toUpperCase()}</span>
                </span>
                <button
                  onClick={() => handleCopyCode(part.code, idx)}
                  className="hover:text-white flex items-center gap-1 text-slate-400 text-[10px] bg-slate-800 px-2 py-0.5 rounded transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="code-block-content text-xs">{part.code}</pre>
            </div>
          );
        }

        const mathParts = part.text.split(/(\$\$[\s\S]*?\$\$)/g);

        return (
          <div key={idx} className="space-y-1">
            {mathParts.map((sub, sIdx) => {
              if (sub.startsWith('$$') && sub.endsWith('$$')) {
                const mathExpr = sub.slice(2, -2).trim();
                return (
                  <div key={sIdx} className="math-block">
                    <div className="text-[9px] text-indigo-400 font-mono uppercase tracking-wider mb-0.5">LaTeX Equation</div>
                    <div className="font-mono text-slate-100 text-xs">{mathExpr}</div>
                  </div>
                );
              }
              return (
                <p key={sIdx} className="whitespace-pre-line text-slate-300">
                  {sub}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function ChatRoomView() {
  const { 
    chatMessages = [], 
    servers = [], 
    activeServerId, 
    activeChannelId, 
    upvoteMessage, 
    markAcceptedSolution,
    currentUser,
    setReportTarget,
    setProfileViewTarget,
    blockedHandles = [],
    isLoading
  } = useApp();

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0] || {};
  const activeChannel = activeServer.channels ? activeServer.channels.find(c => c.id === activeChannelId) : null;

  // Filter messages for active channel
  const channelMessages = chatMessages.filter(m => {
    if (m.isQuarantined) return false;
    if (blockedHandles.includes(m.author?.handle)) return false;
    return !activeChannelId || m.channelId === activeChannelId;
  });

  // Auto scroll to bottom when new message arrives
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [channelMessages.length]);

  // Handle scroll listener to show "Jump to Bottom" button
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 150;
    setShowScrollBottom(isFarFromBottom);
  };


  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#070c18] border border-[#1a233a] rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Discord Channel Header Bar */}
      <div className="h-14 bg-[#090e1c] border-b border-[#1a233a] px-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-cyan-400" />
          <div>
            <h1 className="font-heading font-extrabold text-sm text-white font-mono flex items-center gap-2">
              <span>{activeChannel ? activeChannel.name : 'general-chat'}</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-md shadow-cyan-400/50" title="Live academic room active" />
            </h1>
            <p className="text-[11px] text-slate-400 line-clamp-1 font-medium">
              {activeChannel?.description || 'Real-time academic discussion room.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-gradient-to-r from-indigo-950/80 to-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-full shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">Real-Time Chat Streaming</span>
        </div>
      </div>

      {/* Live Chat Message Stream Area */}
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative no-scrollbar bg-[#050813]/60"
      >
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonChatMessage />
            <SkeletonChatMessage />
            <SkeletonChatMessage />
          </div>
        ) : channelMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-xs text-slate-500">
            <Hash className="h-10 w-10 text-cyan-400/30 mb-2 animate-bounce" />
            <p className="font-semibold text-slate-300 text-sm">Welcome to #{activeChannel?.name || 'chat'}!</p>
            <p className="mt-0.5 text-slate-400">This is the start of the real-time academic discussion.</p>
          </div>
        ) : (
          <AnimatePresence>
            {channelMessages.map((msg, index) => {
              const prevMsg = channelMessages[index - 1];
              const isGrouped = prevMsg && 
                prevMsg.author.handle === msg.author.handle && 
                (new Date(msg.createdAt) - new Date(prevMsg.createdAt)) < 300000; // 5 min grouping

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`group relative flex items-start gap-3 rounded-2xl p-2.5 transition-all hover:bg-[#0d1428]/80 ${
                    isGrouped ? 'pt-0.5' : 'mt-3'
                  } ${msg.isAcceptedSolution ? 'bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/50 shadow-lg shadow-emerald-500/10' : ''}`}
                >
                  
                  {/* Left Avatar Icon */}
                  {!isGrouped ? (
                    <div 
                      onClick={() => setProfileViewTarget(msg.author)}
                      className={`h-9 w-9 rounded-xl shrink-0 flex items-center justify-center cursor-pointer font-bold text-xs border transition-transform hover:scale-105 shadow-md ${
                        msg.author.isAnonymous
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-emerald-950/50'
                          : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40 shadow-indigo-950/50'
                      }`}
                    >
                      {msg.author.isAnonymous ? <EyeOff className="h-4 w-4 text-emerald-400" /> : <User className="h-4 w-4 text-indigo-400" />}
                    </div>
                  ) : (
                    <div className="w-9 shrink-0 text-right text-[9px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 select-none pt-0.5">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}

                  {/* Message Main Body */}
                  <div className="flex-1 min-w-0">
                    
                    {/* Author Line */}
                    {!isGrouped && (
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span 
                          onClick={() => setProfileViewTarget(msg.author)}
                          className={`font-mono text-xs font-bold cursor-pointer hover:underline ${
                            msg.author.isAnonymous ? 'text-emerald-300' : 'text-indigo-300'
                          }`}
                        >
                          {msg.author.handle}
                        </span>

                        {msg.author.isVerified && (
                          <span className="badge-tag badge-verified">
                            <ShieldCheck className="h-3 w-3 text-emerald-400" />
                            <span>{msg.author.college}</span>
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        {msg.isAcceptedSolution && (
                          <span className="text-[10px] font-bold text-emerald-300 bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/50 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            <span>Verified Solution</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Chat Bubble Formatted Content */}
                    <FormatChatBubble content={msg.content} />

                  </div>

                  {/* Quick Action Hover Bar */}
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-all bg-[#090e1c] border border-[#1a233a] rounded-xl px-2 py-1 flex items-center gap-1.5 shadow-2xl z-10">
                    {/* Upvote button */}
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => upvoteMessage(msg.id)}
                      className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[11px] font-mono p-1 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Upvote helpful chat answer"
                    >
                      <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="font-bold text-slate-200">{msg.upvotes}</span>
                    </motion.button>

                    {/* Mark Solution button */}
                    {(currentUser.role === 'ADMIN' || currentUser.publicHandle === msg.author.handle) && !msg.isAcceptedSolution && (
                      <button
                        onClick={() => markAcceptedSolution(msg.id)}
                        className="text-slate-400 hover:text-emerald-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Mark as Verified Solution"
                      >
                        <Award className="h-3.5 w-3.5 text-emerald-400" />
                      </button>
                    )}

                    {/* Report button */}
                    <button
                      onClick={() => setReportTarget({
                        messageId: msg.id,
                        targetContent: msg.content,
                        authorHandle: msg.author.handle
                      })}
                      className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Report chat message"
                    >
                      <Flag className="h-3.5 w-3.5 text-slate-400 hover:text-rose-400" />
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Jump to Latest Button */}
      {showScrollBottom && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-20 right-8 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 z-20"
        >
          <ArrowDown className="h-3.5 w-3.5 text-slate-950" />
          <span>Jump to Latest Messages</span>
        </motion.button>
      )}

    </div>
  );
}

