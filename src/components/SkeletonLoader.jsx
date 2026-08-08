import React from 'react';
import { motion } from 'framer-motion';

export function SkeletonChatMessage() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/30 border border-slate-800/40 animate-pulse my-2">
      <div className="h-9 w-9 rounded-xl bg-slate-800 shrink-0 shimmer" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-24 bg-slate-800 rounded shimmer" />
          <div className="h-3 w-16 bg-slate-800/70 rounded-full shimmer" />
          <div className="h-3 w-12 bg-slate-800/40 rounded shimmer ml-auto" />
        </div>
        <div className="h-3 w-full bg-slate-800/60 rounded shimmer" />
        <div className="h-3 w-4/5 bg-slate-800/50 rounded shimmer" />
        <div className="h-16 w-full bg-slate-950/80 rounded-lg border border-slate-800/60 shimmer mt-2" />
      </div>
    </div>
  );
}

export function SkeletonThreadCard() {
  return (
    <div className="bg-[#111827]/70 border border-[#1e293b] rounded-2xl p-5 space-y-3.5 animate-pulse">
      {/* Top author row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-28 bg-slate-800 rounded-full shimmer" />
          <div className="h-5 w-20 bg-slate-800/60 rounded-full shimmer" />
        </div>
        <div className="h-3.5 w-16 bg-slate-800/50 rounded shimmer" />
      </div>

      {/* Title */}
      <div className="h-5 w-3/4 bg-slate-800 rounded shimmer" />

      {/* Description lines */}
      <div className="space-y-1.5">
        <div className="h-3.5 w-full bg-slate-800/60 rounded shimmer" />
        <div className="h-3.5 w-5/6 bg-slate-800/50 rounded shimmer" />
      </div>

      {/* Bottom tags & metrics */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 bg-slate-800/70 rounded shimmer" />
          <div className="h-5 w-20 bg-slate-800/70 rounded shimmer" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-7 w-16 bg-slate-800 rounded-lg shimmer" />
          <div className="h-7 w-12 bg-slate-800/70 rounded-lg shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonThreadDetail() {
  return (
    <div className="space-y-5 max-w-4xl mx-auto animate-pulse">
      {/* Back button skeleton */}
      <div className="h-8 w-36 bg-slate-800 rounded-xl shimmer" />

      {/* Main card skeleton */}
      <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-7 w-32 bg-slate-800 rounded-full shimmer" />
            <div className="h-6 w-24 bg-slate-800/70 rounded-full shimmer" />
          </div>
          <div className="h-4 w-24 bg-slate-800/50 rounded shimmer" />
        </div>

        <div className="h-7 w-4/5 bg-slate-800 rounded shimmer" />
        
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-800/60 rounded shimmer" />
          <div className="h-4 w-11/12 bg-slate-800/60 rounded shimmer" />
          <div className="h-28 w-full bg-slate-950 rounded-xl border border-slate-800 shimmer my-3" />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="h-6 w-32 bg-slate-800/70 rounded shimmer" />
          <div className="h-9 w-36 bg-emerald-950/40 rounded-xl shimmer" />
        </div>
      </div>

      {/* Replies skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-48 bg-slate-800 rounded shimmer" />
        <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-5 space-y-3">
          <div className="h-5 w-28 bg-slate-800 rounded-full shimmer" />
          <div className="h-4 w-full bg-slate-800/60 rounded shimmer" />
          <div className="h-4 w-3/4 bg-slate-800/50 rounded shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonAdmin() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-5 w-44 bg-slate-800 rounded shimmer" />
          <div className="h-7 w-64 bg-slate-800 rounded shimmer" />
        </div>
        <div className="flex gap-3">
          <div className="h-12 w-24 bg-slate-800 rounded-xl shimmer" />
          <div className="h-12 w-24 bg-slate-800 rounded-xl shimmer" />
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#111827] border border-[#1e293b] rounded-2xl p-4 space-y-3">
            <div className="h-4 w-28 bg-slate-800 rounded shimmer" />
            <div className="h-8 w-16 bg-slate-800 rounded shimmer" />
            <div className="h-3 w-32 bg-slate-800/60 rounded shimmer" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6 space-y-4">
        <div className="h-6 w-48 bg-slate-800 rounded shimmer" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 w-full bg-slate-900/60 rounded-xl shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}
