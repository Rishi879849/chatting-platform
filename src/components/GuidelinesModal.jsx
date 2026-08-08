import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, ShieldCheck, X, CheckCircle2, AlertOctagon, HeartHandshake } from 'lucide-react';

export function GuidelinesModal() {
  const { isGuidelinesModalOpen, setIsGuidelinesModalOpen } = useApp();

  if (!isGuidelinesModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#090e1c] border border-[#1a233a] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-72 h-32 bg-gradient-to-l from-emerald-500/10 via-cyan-500/10 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="bg-[#060a14] px-6 py-4 border-b border-[#1a233a] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-base">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <span className="font-heading">AcadSphere Academic Honor Code</span>
          </div>
          <button 
            onClick={() => setIsGuidelinesModalOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed relative z-10">
          
          <div className="bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 p-4 rounded-2xl text-emerald-300 space-y-1 shadow-md">
            <div className="font-bold text-sm flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Zero-Distraction, Academic-Only Space</span>
            </div>
            <p className="text-[11px] text-emerald-200/90 font-medium">
              AcadSphere is built for pure academic problem-solving, theoretical proofs, computer science concepts, and career development.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-[#050813] p-3.5 rounded-2xl border border-[#1a233a] shadow-inner">
              <AlertOctagon className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">1. No Personal Contact Exchange</strong>
                Sharing phone numbers, WhatsApp links, Telegram handles, email addresses, or social media accounts is strictly prohibited and triggers automatic AI quarantine.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#050813] p-3.5 rounded-2xl border border-[#1a233a] shadow-inner">
              <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">2. High Academic Rigor</strong>
                Support questions with equations ($$ \dots $$) and reproducible code blocks (```cpp ... ```). Avoid vague one-word posts.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#050813] p-3.5 rounded-2xl border border-[#1a233a] shadow-inner">
              <HeartHandshake className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">3. Peer Respect & Decoupled Pseudonymity</strong>
                Be encouraging to fellow learners. Respect anonymous handles; never attempt to dox or uncover real-world identities.
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => setIsGuidelinesModalOpen(false)}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold py-3 rounded-2xl text-xs shadow-lg shadow-emerald-500/25 transition-all"
            >
              I Understand & Agree to the Code
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

