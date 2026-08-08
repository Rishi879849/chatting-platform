import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Hash, X, PlusCircle, BookOpen, Briefcase } from 'lucide-react';

export function CreateChannelModal() {
  const { 
    isCreateChannelModalOpen, 
    setIsCreateChannelModalOpen, 
    createChannel, 
    servers = [], 
    activeServerId 
  } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('SUBJECT');
  const [description, setDescription] = useState('');

  const activeServer = (servers || []).find(s => s.id === activeServerId) || servers[0] || {};

  if (!isCreateChannelModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    createChannel({
      name: name.trim(),
      category,
      description: description.trim()
    });

    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#090e1c] border border-[#1a233a] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-l from-indigo-500/10 via-cyan-500/10 to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="bg-[#060a14] px-5 py-4 border-b border-[#1a233a] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Hash className="h-4 w-4 text-cyan-400" />
            <span className="font-heading">Create Channel in {activeServer?.name}</span>
          </div>
          <button 
            onClick={() => setIsCreateChannelModalOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Channel Name</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. dsa-graph-algorithms"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#050813] border border-[#1a233a] focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono shadow-inner transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#050813] border border-[#1a233a] focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none font-mono shadow-inner transition-all"
            >
              <option value="SUBJECT">📚 Academic Subject Channel</option>
              <option value="CAREER">💼 Career & Internship Channel</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              rows="3"
              placeholder="What will learners discuss in this channel?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#050813] border border-[#1a233a] focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none shadow-inner transition-all"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateChannelModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-40 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Create Channel</span>
            </button>
          </div>
        </form>

      </motion.div>
    </div>
  );
}

