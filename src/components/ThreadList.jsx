import React from 'react';
import { useApp } from '../context/AppContext';
import { SkeletonThreadCard } from './SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  EyeOff, 
  User, 
  Clock, 
  Flag, 
  Code2, 
  Tag, 
  Filter, 
  Sparkles,
  Hash,
  PlusCircle
} from 'lucide-react';

export function ThreadList() {
  const { 
    threads = [], 
    servers = [],
    activeServerId,
    activeChannelId, 
    searchQuery = '', 
    filterUnanswered, 
    setFilterUnanswered,
    filterHasSolution,
    setFilterHasSolution,
    upvoteThread,
    setSelectedThreadId,
    setActiveView,
    setIsCreateModalOpen,
    setReportTarget,
    setProfileViewTarget,
    blockedHandles = [],
    isLoading,
    simulateLoading
  } = useApp();

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0] || {};
  const activeChannel = activeServer.channels ? activeServer.channels.find(c => c.id === activeChannelId) : null;

  // Filter threads for active channel and criteria
  const filteredThreads = threads.filter(thread => {
    if (thread.isQuarantined) return false;
    if (blockedHandles.includes(thread.author?.handle)) return false;

    // Filter by channel if set
    if (activeChannelId && thread.channelId && thread.channelId !== activeChannelId) {
      return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (thread.title || '').toLowerCase().includes(q);
      const matchContent = (thread.content || '').toLowerCase().includes(q);
      const matchTag = (thread.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTag) return false;
    }

    if (filterUnanswered && (thread.replies || []).length > 0) return false;
    if (filterHasSolution && !thread.hasSolution) return false;

    return true;
  });

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-10">
      
      {/* Aurora Discord-style Channel Header */}
      <div className="bg-[#090e1c] border border-[#1a233a] rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-indigo-500/10 via-cyan-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-cyan-400" />
              <h1 className="font-heading font-extrabold text-xl md:text-2xl text-white font-mono">
                {activeChannel ? activeChannel.name : 'all-study-threads'}
              </h1>
              <span className="bg-gradient-to-r from-indigo-950 to-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                {filteredThreads.length} Discussions
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-medium">
              {activeChannel ? activeChannel.description : 'High-signal academic discussions across Computer Science, Engineering Mathematics, and Placement tracks.'}
            </p>
          </div>

          {/* Filter Pills & Ask Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterUnanswered(!filterUnanswered)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                filterUnanswered 
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 shadow-md shadow-amber-950/40' 
                  : 'bg-[#060a14] border-[#1e2a47] text-slate-400 hover:text-white hover:border-amber-500/30'
              }`}
            >
              <Filter className="h-3.5 w-3.5 text-amber-400" />
              <span>Unanswered Only</span>
            </button>

            <button
              onClick={() => setFilterHasSolution(!filterHasSolution)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                filterHasSolution 
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-950/40' 
                  : 'bg-[#060a14] border-[#1e2a47] text-slate-400 hover:text-white hover:border-emerald-500/30'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Verified Solutions</span>
            </button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 ml-auto md:ml-0 transition-all"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Ask Question</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Threads Feed or Skeleton */}
      {isLoading ? (
        <div className="space-y-3">
          <SkeletonThreadCard />
          <SkeletonThreadCard />
          <SkeletonThreadCard />
        </div>
      ) : filteredThreads.length === 0 ? (
        <div className="bg-[#090e1c] border border-[#1a233a] rounded-2xl p-12 text-center shadow-xl">
          <Sparkles className="h-10 w-10 text-cyan-400/60 mx-auto mb-3 animate-pulse" />
          <h3 className="text-base font-semibold text-white">No discussions found in #{activeChannel?.name || 'channel'}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto mb-4">
            Be the first to post an academic question or concept proof in this channel!
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create First Thread</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredThreads.map((thread, index) => {
              const hasCode = (thread.content || '').includes('```');
              const hasMath = (thread.content || '').includes('$');

              return (
                <motion.div 
                  key={thread.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  whileHover={{ y: -2 }}
                  className="glass-card rounded-2xl p-5 hover:border-cyan-500/40 transition-all cursor-pointer group shadow-lg"
                  onClick={() => {
                    setSelectedThreadId(thread.id);
                    simulateLoading(() => {
                      setActiveView('THREAD_DETAIL');
                    }, 200);
                  }}
                >
                  {/* Author & Badges Line */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      
                      {/* Identity Badge */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfileViewTarget(thread.author);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all hover:scale-105 ${
                          thread.author?.isAnonymous
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono shadow-sm'
                            : 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 shadow-sm'
                        }`}
                      >
                        {thread.author?.isAnonymous ? (
                          <>
                            <EyeOff className="h-3 w-3 text-emerald-400" />
                            <span>{thread.author?.handle}</span>
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3 text-indigo-400" />
                            <span>{thread.author?.handle}</span>
                          </>
                        )}
                      </div>

                      {/* Institutional Badge */}
                      {thread.author?.isVerified && (
                        <span className="badge-tag badge-verified">
                          <ShieldCheck className="h-3 w-3 text-emerald-400" />
                          <span>{thread.author?.college}</span>
                        </span>
                      )}

                      {/* Skill Badges */}
                      {(thread.author?.badges || []).slice(0, 1).map((b, idx) => (
                        <span key={idx} className="badge-tag badge-dsa hidden sm:inline-flex">
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug mb-2 font-heading">
                    {thread.title}
                  </h3>

                  {/* Content Snippet Preview */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 font-sans">
                    {(thread.content || '').replace(/```[\s\S]*?```/g, '[Code Snippet]').replace(/\$\$/g, '')}
                  </p>

                  {/* Indicator Tags & Solution Banner */}
                  <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#1a233a]">
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      {(thread.tags || []).map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-slate-300 bg-[#060a14] border border-[#1e2a47] px-2.5 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}

                      {hasCode && (
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                          <Code2 className="h-3 w-3 text-cyan-400" />
                          <span>Code</span>
                        </span>
                      )}

                      {hasMath && (
                        <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-md shadow-sm">
                          LaTeX Math
                        </span>
                      )}
                    </div>

                    {/* Upvote & Solution Counter */}
                    <div className="flex items-center gap-3 shrink-0">
                      
                      {thread.hasSolution && (
                        <span className="text-xs font-bold text-emerald-300 bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border border-emerald-500/50 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="hidden sm:inline">Solved</span>
                        </span>
                      )}

                      {/* Spring Upvote button */}
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          upvoteThread(thread.id);
                        }}
                        className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 bg-[#060a14] border border-[#1e2a47] hover:border-emerald-500/40 px-2.5 py-1 rounded-xl transition-all shadow-inner"
                      >
                        <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="font-mono font-bold text-slate-200">{thread.upvotes}</span>
                      </motion.button>

                      {/* Replies count */}
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="font-mono">{thread.replies ? thread.replies.length : 0}</span>
                      </div>

                      {/* Report button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReportTarget({
                            threadId: thread.id,
                            title: thread.title,
                            authorHandle: thread.author?.handle
                          });
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Report thread confidentially"
                      >
                        <Flag className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}

