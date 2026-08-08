import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, X, Flag, Lock } from 'lucide-react';

export function ReportModal() {
  const { reportTarget, setReportTarget, submitReport } = useApp();
  const [category, setCategory] = useState('CONTACT_SHARING');
  const [reason, setReason] = useState('');

  if (!reportTarget) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    submitReport({
      threadId: reportTarget.threadId,
      title: reportTarget.title,
      authorHandle: reportTarget.authorHandle,
      category,
      reason: reason.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#090e1c] border border-[#1a233a] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-l from-rose-500/10 via-pink-500/10 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="bg-[#060a14] px-5 py-4 border-b border-[#1a233a] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <ShieldAlert className="h-4 w-4 text-rose-400 animate-pulse" />
            <span className="font-heading">Report Academic Misconduct</span>
          </div>
          <button 
            onClick={() => setReportTarget(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">
          <div className="bg-[#050813] p-3.5 rounded-xl border border-[#1a233a] text-xs shadow-inner">
            <span className="text-slate-400">Target Post: </span>
            <span className="font-semibold text-slate-200">"{reportTarget.title}"</span>
            <span className="text-slate-400 block mt-0.5">Author: <span className="font-mono text-cyan-400">{reportTarget.authorHandle}</span></span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Violation Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#050813] border border-[#1a233a] focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/30 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none font-mono shadow-inner transition-all"
            >
              <option value="CONTACT_SHARING">📱 Contact Sharing Attempt (Phone, Email, Social Link)</option>
              <option value="OFF_TOPIC">🎯 Off-Topic Chatter / Non-Academic Distraction</option>
              <option value="HARASSMENT">🛑 Toxic Behavior / Personal Attack</option>
              <option value="SPAM">⚠️ Spam / Promotional Advertising</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Detailed Explanation</label>
            <textarea
              rows="3"
              placeholder="Describe the violation clearly for the moderator audit queue..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-[#050813] border border-[#1a233a] focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/30 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none shadow-inner transition-all"
            ></textarea>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl text-[11px] text-emerald-300 flex items-center gap-2 shadow-sm">
            <Lock className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span>Your report is 100% confidential and anonymous.</span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setReportTarget(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-40 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all"
            >
              <Flag className="h-3.5 w-3.5" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

