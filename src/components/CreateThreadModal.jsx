import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  EyeOff, 
  User, 
  Code2, 
  Binary, 
  ShieldAlert, 
  Send, 
  Sparkles, 
  ShieldCheck,
  Hash
} from 'lucide-react';
import { analyzeContent } from '../services/moderationEngine';

export function CreateThreadModal() {
  const { 
    isCreateModalOpen, 
    setIsCreateModalOpen, 
    servers = [], 
    activeServerId, 
    activeChannelId, 
    identityMode, 
    toggleIdentityMode, 
    currentUser,
    createThread 
  } = useApp();

  const activeServer = (servers || []).find(s => s.id === activeServerId) || servers[0] || {};
  const [selectedChannelId, setSelectedChannelId] = useState(activeChannelId || activeServer.channels?.[0]?.id || 'dsa-live-help');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [liveWarning, setLiveWarning] = useState('');
  const [autoQuarantineRisk, setAutoQuarantineRisk] = useState(false);

  if (!isCreateModalOpen) return null;

  const handleContentChange = (newTitle, newContent) => {
    setTitle(newTitle);
    setContent(newContent);

    if (newTitle || newContent) {
      const analysis = analyzeContent(newContent, newTitle);
      if (analysis.warnings.length > 0) {
        setLiveWarning(analysis.warnings[0]);
      } else {
        setLiveWarning('');
      }
      setAutoQuarantineRisk(analysis.autoQuarantine);
    } else {
      setLiveWarning('');
      setAutoQuarantineRisk(false);
    }
  };

  const insertSnippet = (snippetType) => {
    if (snippetType === 'CODE') {
      const codeTemplate = `\n\`\`\`cpp\n// Insert your C++ / Python code here\n#include <iostream>\nint main() {\n    return 0;\n}\n\`\`\`\n`;
      setContent(prev => prev + codeTemplate);
    } else if (snippetType === 'MATH') {
      const mathTemplate = `\n$$\n\\frac{\\partial L}{\\partial W} = \\sum_{i=1}^N (y_i - \\hat{y}_i) x_i\n$$\n`;
      setContent(prev => prev + mathTemplate);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    createThread({
      channelId: selectedChannelId,
      title: title.trim(),
      content: content.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ['Academic Discussion']
    });

    setTitle('');
    setContent('');
    setTagsInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="bg-[#090e1c] border border-[#1a233a] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-indigo-500/10 via-cyan-500/10 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="bg-[#060a14] px-6 py-4 border-b border-[#1a233a] flex items-center justify-between relative z-10">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-white">Publish Academic Thread</h2>
            <p className="text-xs text-slate-400">Ask a structured question or share an academic proof in {activeServer.name}</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">
          
          {/* Identity Mode Selector Banner */}
          <div className="flex items-center justify-between gap-3 bg-[#050813] border border-[#1a233a] p-3 rounded-2xl shadow-inner">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Posting identity:</span>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                identityMode === 'ANONYMOUS' 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-sm' 
                  : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40 shadow-sm'
              }`}>
                {identityMode === 'ANONYMOUS' ? currentUser.pseudonym : currentUser.publicHandle}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleIdentityMode}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 transition-colors"
            >
              Switch to {identityMode === 'ANONYMOUS' ? 'Public Mode' : 'Pseudonymous Mode'}
            </button>
          </div>

          {/* Real-Time Moderation Sliding Warning Banner */}
          <AnimatePresence>
            {liveWarning && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="safety-warning-box text-xs flex items-start gap-2.5 overflow-hidden"
              >
                <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400 mt-0.5 animate-pulse" />
                <div>
                  <p className="font-bold text-amber-300">Safety Guardrail Alert Triggered</p>
                  <p className="mt-0.5 text-slate-200">{liveWarning}</p>
                  {autoQuarantineRisk && (
                    <p className="mt-1 text-[11px] text-rose-300 font-mono">
                      ⚠️ Submission will be automatically quarantined for moderator review if contact information is detected.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Channel Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Select Channel</label>
            <select
              value={selectedChannelId}
              onChange={(e) => setSelectedChannelId(e.target.value)}
              className="w-full bg-[#050813] border border-[#1a233a] focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none font-mono shadow-inner transition-all"
            >
              {activeServer.channels?.map(c => (
                <option key={c.id} value={c.id}>
                  #{c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Thread Title</label>
            <input
              type="text"
              placeholder="e.g. Mathematical proof of Dijkstra's algorithm correctness under non-negative edge weights"
              value={title}
              onChange={(e) => handleContentChange(e.target.value, content)}
              required
              className="w-full bg-[#050813] border border-[#1a233a] focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono shadow-inner transition-all"
            />
          </div>

          {/* Snippet Quick-Helper Tools */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Thread Body (Markdown & Math)</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => insertSnippet('CODE')}
                className="bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 hover:bg-cyan-900/60 transition-colors shadow-sm"
              >
                <Code2 className="h-3 w-3 text-cyan-400" />
                <span>+ C++ Code</span>
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('MATH')}
                className="bg-purple-950/60 text-purple-300 border border-purple-500/30 px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 hover:bg-purple-900/60 transition-colors shadow-sm"
              >
                <Binary className="h-3 w-3 text-purple-400" />
                <span>+ LaTeX Math</span>
              </button>
            </div>
          </div>

          {/* Content Textarea */}
          <textarea
            rows="6"
            placeholder="Write your academic query... Use $$ ... $$ for equations or ```cpp ... ``` for code snippets."
            value={content}
            onChange={(e) => handleContentChange(title, e.target.value)}
            required
            className="w-full bg-[#050813] border border-[#1a233a] focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none shadow-inner transition-all"
          ></textarea>

          {/* Tags Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Tags (Comma Separated)</label>
            <input
              type="text"
              placeholder="Graph Theory, Shortest Path, Complexity"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-[#050813] border border-[#1a233a] focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono shadow-inner transition-all"
            />
          </div>

          {/* Form Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[#1a233a]">
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Checked by AcadSphere AI Guard before publishing</span>
            </p>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !content.trim()}
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <Send className="h-3.5 w-3.5 text-slate-950" />
                <span>Publish Thread</span>
              </button>
            </div>
          </div>

        </form>
      </motion.div>
    </div>
  );
}

