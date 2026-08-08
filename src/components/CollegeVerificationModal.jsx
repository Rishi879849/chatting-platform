import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, X, CheckCircle2, GraduationCap, Building2 } from 'lucide-react';

export function CollegeVerificationModal() {
  const { 
    isVerificationModalOpen, 
    setIsVerificationModalOpen, 
    currentUser, 
    verifyCollegeEmail 
  } = useApp();

  const [emailInput, setEmailInput] = useState(currentUser.collegeEmail || '');

  if (!isVerificationModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCollegeEmail(emailInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#090e1c] border border-[#1a233a] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-l from-emerald-500/10 via-cyan-500/10 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="bg-[#060a14] px-5 py-4 border-b border-[#1a233a] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="font-heading">Verified Student Domain Gate</span>
          </div>
          <button 
            onClick={() => setIsVerificationModalOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-950 via-teal-950 to-cyan-950 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
              <GraduationCap className="h-7 w-7 text-emerald-400" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-white">Unlock "Verified Student" Badge</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Enter your official college/university email address ending in <span className="font-mono text-emerald-400 font-semibold">.ac.in</span> or <span className="font-mono text-cyan-400 font-semibold">.edu.in</span> to earn your institutional badge.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Institutional Email</label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <input
                type="email"
                placeholder="student@iitm.ac.in or learner@bits-pilani.ac.in"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full bg-[#050813] border border-[#1a233a] focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono shadow-inner transition-all"
              />
            </div>
          </div>

          <div className="bg-[#050813] p-3.5 rounded-xl border border-[#1a233a] text-[11px] text-slate-400 space-y-1 shadow-inner">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Decoupled Identity Protection</span>
            </div>
            <p>
              Your verified email is NEVER attached to your pseudonymous posts. It is used solely to issue your institutional trust badge.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsVerificationModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all"
            >
              <ShieldCheck className="h-4 w-4 text-slate-950" />
              <span>Verify Institutional Domain</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

