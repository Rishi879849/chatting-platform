import React from 'react';
import { useApp } from '../context/AppContext';
import { User, ShieldCheck, Award, EyeOff, X, Ban, Sparkles } from 'lucide-react';

export function UserProfileModal() {
  const { profileViewTarget, setProfileViewTarget, blockUserHandle, blockedHandles } = useApp();

  if (!profileViewTarget) return null;

  const isBlocked = blockedHandles.includes(profileViewTarget.handle);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#090e1c] border border-[#1a233a] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-l from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="bg-[#060a14] px-5 py-4 border-b border-[#1a233a] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
            <User className="h-4 w-4 text-cyan-400" />
            <span className="font-heading">Academic Learner Identity</span>
          </div>
          <button 
            onClick={() => setProfileViewTarget(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-center relative z-10">
          
          {/* Avatar Icon */}
          <div className={`h-16 w-16 rounded-2xl mx-auto flex items-center justify-center border shadow-xl ${
            profileViewTarget.isAnonymous
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-emerald-500/20'
              : 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300 shadow-indigo-500/20'
          }`}>
            {profileViewTarget.isAnonymous ? <EyeOff className="h-8 w-8 text-emerald-400 animate-pulse" /> : <User className="h-8 w-8 text-indigo-400" />}
          </div>

          <div>
            <h3 className="font-heading font-extrabold text-lg text-white font-mono">
              {profileViewTarget.handle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {profileViewTarget.isAnonymous ? 'Pseudonymous Academic Identity' : (profileViewTarget.name || 'Public Verified Profile')}
            </p>
          </div>

          {/* Institutional Badge */}
          {profileViewTarget.college && (
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 text-emerald-300 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{profileViewTarget.college}</span>
            </div>
          )}

          {/* Earned Non-Gamified Badges */}
          <div className="bg-[#050813] p-4 rounded-2xl border border-[#1a233a] text-left shadow-inner">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>Earned Academic Badges</span>
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {profileViewTarget.badges && profileViewTarget.badges.length > 0 ? (
                profileViewTarget.badges.map((badge, idx) => (
                  <span key={idx} className="bg-[#0d1428] text-slate-200 border border-cyan-500/30 px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3 text-cyan-400" />
                    <span>{badge}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No badges earned yet.</span>
              )}
            </div>
          </div>

          {/* Privacy Decoupling Note */}
          <div className="bg-[#050813] p-3 rounded-xl border border-[#1a233a] text-[11px] text-slate-400 leading-relaxed text-left shadow-inner">
            🔒 <strong className="text-slate-200">Decoupled Privacy Guarantee:</strong> In accordance with Digital Twin Verse guidelines, pseudonymous identities cannot be reverse-engineered to reveal private contact details or offline identity.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {!isBlocked ? (
              <button
                onClick={() => {
                  blockUserHandle(profileViewTarget.handle);
                  setProfileViewTarget(null);
                }}
                className="w-full bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-950/30"
              >
                <Ban className="h-3.5 w-3.5 text-rose-400" />
                <span>Block Content from {profileViewTarget.handle}</span>
              </button>
            ) : (
              <span className="text-xs text-rose-400 font-mono">User handle is blocked</span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

