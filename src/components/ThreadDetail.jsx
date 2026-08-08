import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkeletonThreadDetail } from './SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { escapeHTML, sanitizeHTML } from '../services/sanitizer';
import { 
  ArrowLeft, 
  ThumbsUp, 
  CheckCircle2, 
  ShieldCheck, 
  EyeOff, 
  User, 
  Clock, 
  Flag, 
  Code2, 
  Send, 
  Award,
  Sparkles,
  Copy,
  Check,
  Binary
} from 'lucide-react';
import { analyzeContent } from '../services/moderationEngine';

/**
 * Formats markdown code blocks, LaTeX equations, and tables cleanly with XSS sanitization
 */
function RenderFormattedContent({ text = '' }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const cleanText = typeof text === 'string' ? text : '';
  // Split by code blocks ```
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(cleanText)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: cleanText.substring(lastIndex, match.index) });
    }
    parts.push({
      type: 'code',
      language: (match[1] || 'cpp').replace(/[^a-zA-Z0-9_-]/g, ''),
      code: match[2].trim()
    });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < cleanText.length) {
    parts.push({ type: 'text', content: cleanText.substring(lastIndex) });
  }

  const handleCopyCode = (codeStr, idx) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-3 text-slate-200 text-sm leading-relaxed">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return (
            <div key={idx} className="code-block-wrapper my-3">
              <div className="code-block-header">
                <span className="flex items-center gap-1.5 text-cyan-400 font-mono">
                  <Code2 className="h-3.5 w-3.5" />
                  <span>{part.language.toUpperCase()}</span>
                </span>
                <button
                  onClick={() => handleCopyCode(part.code, idx)}
                  className="hover:text-white flex items-center gap-1 text-slate-400 text-[11px] bg-slate-800/80 px-2 py-0.5 rounded transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="code-block-content text-xs font-mono">{part.code}</pre>
            </div>
          );
        }

        // Render math blocks ($$...$$) or regular text
        const textContent = part.content;
        const mathParts = textContent.split(/(\$\$[\s\S]*?\$\$)/g);

        return (
          <div key={idx} className="space-y-2">
            {mathParts.map((sub, sIdx) => {
              if (sub.startsWith('$$') && sub.endsWith('$$')) {
                const mathExpr = sub.slice(2, -2).trim();
                return (
                  <div key={sIdx} className="math-block">
                    <div className="text-[10px] text-indigo-400 uppercase tracking-wider mb-1 font-mono">LaTeX Equation</div>
                    <div className="font-mono text-slate-100 text-xs">{mathExpr}</div>
                  </div>
                );
              }
              
              // Handle line breaks & standard paragraph
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

export function ThreadDetail() {
  const { 
    threads = [], 
    selectedThreadId, 
    setActiveView, 
    upvoteThread, 
    addReply, 
    markReplySolution, 
    currentUser,
    setReportTarget,
    setProfileViewTarget,
    isLoading,
    simulateLoading
  } = useApp();

  const [replyText, setReplyText] = useState('');
  const [liveWarning, setLiveWarning] = useState('');

  if (isLoading) {
    return <SkeletonThreadDetail />;
  }

  const thread = (threads || []).find(t => t.id === selectedThreadId);

  if (!thread) {
    return (
      <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-8 text-center max-w-2xl mx-auto my-12">
        <h3 className="text-sm font-semibold text-white">Thread not found or quarantined</h3>
        <button 
          onClick={() => simulateLoading(() => setActiveView('FEED'), 200)}
          className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const insertSnippet = (snippetType) => {
    if (snippetType === 'CODE') {
      const codeTemplate = `\n\`\`\`cpp\n// Academic C++ Proof / Solution\n#include <iostream>\nint main() {\n    return 0;\n}\n\`\`\`\n`;
      setReplyText(prev => prev + codeTemplate);
    } else if (snippetType === 'MATH') {
      const mathTemplate = `\n$$\n\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{1}{k^2} = \\frac{\\pi^2}{6}\n$$\n`;
      setReplyText(prev => prev + mathTemplate);
    }
  };

  // Handle typing in reply box with real-time AI safety check
  const handleReplyChange = (e) => {
    const val = e.target.value;
    setReplyText(val);
    if (val.trim()) {
      const analysis = analyzeContent(val, '');
      if (analysis.warnings.length > 0) {
        setLiveWarning(analysis.warnings[0]);
      } else {
        setLiveWarning('');
      }
    } else {
      setLiveWarning('');
    }
  };

  const handlePublishReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const success = addReply(thread.id, replyText);
    if (success) {
      setReplyText('');
      setLiveWarning('');
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto pb-10">
      
      {/* Back Button */}
      <button
        onClick={() => simulateLoading(() => setActiveView('FEED'), 200)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-all bg-[#090e1c] border border-[#1a233a] hover:border-cyan-500/40 px-3.5 py-2 rounded-xl shadow-md"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Study Feed</span>
      </button>

      {/* Main Thread Card */}
      <div className="bg-[#090e1c] border border-[#1a233a] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-indigo-500/10 via-cyan-500/10 to-transparent pointer-events-none" />
        
        {/* Author Metadata Bar */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-[#1a233a] relative z-10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div 
              onClick={() => setProfileViewTarget(thread.author)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all hover:scale-105 ${
                thread.author.isAnonymous
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono shadow-sm'
                  : 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 shadow-sm'
              }`}
            >
              {thread.author.isAnonymous ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{thread.author.handle}</span>
                </>
              ) : (
                <>
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{thread.author.handle}</span>
                </>
              )}
            </div>

            {thread.author.isVerified && (
              <span className="badge-tag badge-verified">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{thread.author.college}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              {new Date(thread.createdAt).toLocaleString()}
            </span>
            <button
              onClick={() => setReportTarget({ threadId: thread.id, title: thread.title, authorHandle: thread.author.handle })}
              className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
              title="Report Thread"
            >
              <Flag className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-heading font-extrabold text-xl md:text-2xl text-white mb-4 leading-snug">
          {thread.title}
        </h1>

        {/* Thread Content */}
        <RenderFormattedContent text={thread.content} />

        {/* Upvote & Actions */}
        <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-[#1a233a]">
          <div className="flex items-center gap-2 flex-wrap">
            {thread.tags.map((tag, idx) => (
              <span key={idx} className="text-xs font-mono text-slate-300 bg-[#060a14] border border-[#1a233a] px-2.5 py-1 rounded-lg">
                #{tag}
              </span>
            ))}
          </div>

          <button
            onClick={() => upvoteThread(thread.id)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 hover:border-emerald-400 border border-emerald-500/40 text-emerald-300 font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow-md"
          >
            <ThumbsUp className="h-4 w-4 text-emerald-400" />
            <span>Helpful / Upvote ({thread.upvotes})</span>
          </button>
        </div>

      </div>

      {/* Replies Section */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-lg text-white flex items-center justify-between">
          <span>Academic Discussion ({thread.replies.length} Responses)</span>
        </h3>

        {/* Reply List */}
        {thread.replies.length === 0 ? (
          <div className="bg-[#090e1c] border border-[#1a233a] rounded-2xl p-6 text-center text-xs text-slate-400 shadow-inner">
            No responses yet. Be the first to provide a structured academic answer!
          </div>
        ) : (
          <div className="space-y-3">
            {thread.replies.map(reply => (
              <div 
                key={reply.id}
                className={`rounded-2xl p-5 border transition-all shadow-lg ${
                  reply.isAcceptedSolution 
                    ? 'bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border-emerald-500/60 shadow-emerald-500/10' 
                    : 'bg-[#090e1c] border-[#1a233a]'
                }`}
              >
                {/* Reply Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                      reply.author.isAnonymous
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
                    }`}>
                      {reply.author.handle}
                    </span>

                    {reply.author.isVerified && (
                      <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {reply.author.college}
                      </span>
                    )}

                    {reply.isAcceptedSolution && (
                      <span className="text-xs font-bold text-emerald-300 bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/50 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Verified Solution</span>
                      </span>
                    )}
                  </div>

                  {/* Mark as Solution action button */}
                  {!thread.hasSolution && (currentUser.role === 'ADMIN' || thread.author.handle === currentUser.pseudonym || thread.author.handle === currentUser.publicHandle) && (
                    <button
                      onClick={() => markReplySolution(thread.id, reply.id)}
                      className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all shadow-sm"
                    >
                      <Award className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Accept as Solution</span>
                    </button>
                  )}
                </div>

                {/* Reply Content */}
                <RenderFormattedContent text={reply.content} />
              </div>
            ))}
          </div>
        )}

        {/* Reply Composer Input Form */}
        <form onSubmit={handlePublishReply} className="bg-[#090e1c] border border-[#1a233a] rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200">Write Academic Answer</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => insertSnippet('CODE')}
                className="bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 hover:bg-cyan-900/60 shadow-sm"
              >
                <Code2 className="h-3 w-3 text-cyan-400" />
                <span>+ C++ Code</span>
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('MATH')}
                className="bg-purple-950/60 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 hover:bg-purple-900/60 shadow-sm"
              >
                <Binary className="h-3 w-3 text-purple-400" />
                <span>+ LaTeX Math</span>
              </button>
            </div>
          </div>

          {liveWarning && (
            <div className="safety-warning-box mb-3 text-xs flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
              <span>{liveWarning}</span>
            </div>
          )}

          <textarea
            rows="4"
            placeholder="Type your response. LaTeX math ($E=mc^2$) and C++/Python code blocks (```cpp ...) supported. Phone numbers/emails will be auto-quarantined."
            value={replyText}
            onChange={handleReplyChange}
            className="w-full bg-[#050813] border border-[#1a233a] focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
          ></textarea>

          <div className="flex items-center justify-between gap-4 mt-3">
            <div className="text-[11px] text-slate-400 hidden sm:block font-mono">
              Posting as: <strong className="text-emerald-400">{currentUser.pseudonym}</strong> | LaTeX: $$ ... $$
            </div>

            <button
              type="submit"
              disabled={!replyText.trim()}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/25 ml-auto"
            >
              <Send className="h-3.5 w-3.5 text-slate-950" />
              <span>Publish Response</span>
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}

