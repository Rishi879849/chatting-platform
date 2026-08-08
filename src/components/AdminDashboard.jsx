import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkeletonAdmin } from './SkeletonLoader';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Users, 
  Activity, 
  Search,
  Filter,
  Check,
  Ban,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export function AdminDashboard() {
  const { reports = [], auditLogs = [], handleModeratorAction, threads = [], rooms = [], isLoading } = useApp();
  const [reportTab, setReportTab] = useState('PENDING'); // 'PENDING' | 'RESOLVED'
  const [severityFilter, setSeverityFilter] = useState('ALL');

  if (isLoading) {
    return <SkeletonAdmin />;
  }

  const pendingReports = reports.filter(r => r.status === 'PENDING');
  const resolvedReports = reports.filter(r => r.status === 'RESOLVED');

  const displayedReports = (reportTab === 'PENDING' ? pendingReports : resolvedReports).filter(r => {
    if (severityFilter !== 'ALL' && r.severity !== severityFilter) return false;
    return true;
  });

  // Calculate room health analytics
  const safeThreads = threads || [];
  const safeRooms = rooms || [];
  const totalThreadsCount = safeThreads.length;
  const quarantinedCount = safeThreads.filter(t => t.isQuarantined).length;
  const verifiedAuthorsCount = safeThreads.filter(t => t.author?.isVerified).length;
  const verifiedPercentage = totalThreadsCount ? Math.round((verifiedAuthorsCount / totalThreadsCount) * 100) : 100;
  const qualityIndex = Math.max(92, 100 - (quarantinedCount * 4));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Top Header */}
      <div className="bg-[#090e1c] border border-[#1a233a] rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-purple-500/10 via-cyan-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-purple-950/90 to-pink-950/90 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase font-mono shadow-sm">
              Admin & Moderator Suite
            </span>
            <span className="text-slate-400 text-xs font-mono">• DTV Safety Hub</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white mt-1">AcadSphere Moderation Center</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Real-time report queues, automated quarantine audit trails, and academic quality analytics.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-[#050813] border border-[#1a233a] px-3.5 py-2 rounded-xl text-center shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Queue</span>
            <span className="font-mono font-extrabold text-base text-rose-400">{pendingReports.length}</span>
          </div>
          <div className="bg-[#050813] border border-[#1a233a] px-3.5 py-2 rounded-xl text-center shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Quality Index</span>
            <span className="font-mono font-extrabold text-base text-emerald-400">{qualityIndex}%</span>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-2xl p-4 shadow-lg border border-[#1a233a]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Academic Threads</span>
            <FileText className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="font-mono font-extrabold text-2xl text-white mt-2">{totalThreadsCount}</p>
          <span className="text-[11px] text-cyan-400 mt-1 block">Active across {safeRooms.length || 4} rooms</span>
        </div>

        <div className="glass-card rounded-2xl p-4 shadow-lg border border-[#1a233a]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Verified Domain Students</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="font-mono font-extrabold text-2xl text-white mt-2">{verifiedPercentage}%</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">Institutional .ac.in credentials</span>
        </div>

        <div className="glass-card rounded-2xl p-4 shadow-lg border border-[#1a233a]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Auto-Quarantined Items</span>
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </div>
          <p className="font-mono font-extrabold text-2xl text-white mt-2">{quarantinedCount}</p>
          <span className="text-[11px] text-rose-400 mt-1 block">Contact sharing / toxicity flags</span>
        </div>

        <div className="glass-card rounded-2xl p-4 shadow-lg border border-[#1a233a]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">AI Safety Guard Engine</span>
            <Activity className="h-4 w-4 text-purple-400" />
          </div>
          <p className="font-mono font-extrabold text-2xl text-emerald-400 mt-2">Active</p>
          <span className="text-[11px] text-slate-400 mt-1 block">0ms Real-Time Regex Guard</span>
        </div>

      </div>

      {/* Main Queue & Audit Logs Section */}
      <div className="bg-[#090e1c] border border-[#1a233a] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Tabs bar */}
        <div className="bg-[#060a14] px-6 py-4 border-b border-[#1a233a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReportTab('PENDING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                reportTab === 'PENDING'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <span>Pending Action Queue</span>
              <span className="bg-rose-900/80 text-rose-200 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
                {pendingReports.length}
              </span>
            </button>

            <button
              onClick={() => setReportTab('RESOLVED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                reportTab === 'RESOLVED'
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <span>Resolved Audit History</span>
              <span className="bg-slate-900 text-slate-300 px-1.5 py-0.2 rounded text-[10px] font-mono">
                {resolvedReports.length}
              </span>
            </button>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#050813] border border-[#1a233a] rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500/60 focus:outline-none font-mono"
            >
              <option value="ALL">All Severities</option>
              <option value="HIGH">High (Contact Sharing / Abuse)</option>
              <option value="MEDIUM">Medium (Off-topic Drift)</option>
              <option value="LOW">Low (Spam)</option>
            </select>
          </div>
        </div>

        {/* Report Queue List */}
        <div className="p-6">
          {displayedReports.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2 animate-pulse" />
              <span>No reports currently matching the active filter. Community standards strictly enforced!</span>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedReports.map(report => (
                <div 
                  key={report.id}
                  className="bg-[#050813] border border-[#1a233a] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-cyan-500/30 transition-all shadow-inner"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        report.severity === 'HIGH' 
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/40' 
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        {report.severity} SEVERITY
                      </span>

                      <span className="text-xs font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded shadow-sm">
                        {report.category}
                      </span>

                      {report.autoQuarantined && (
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded shadow-sm">
                          🤖 Auto-Quarantined
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-white">
                      Target: "{report.targetTitle || report.targetContent || 'Academic Item'}"
                    </h4>

                    <p className="text-xs text-slate-400">
                      Reason: <span className="text-slate-200">{report.reason}</span>
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                      <span>Author: {report.targetAuthor}</span>
                      <span>• Reported by: {report.reportedBy}</span>
                      <span>• {new Date(report.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  {report.status === 'PENDING' && (
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleModeratorAction(report.id, 'APPROVE_QUARANTINE', 'Confirmed safety violation')}
                        className="bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all shadow-md shadow-rose-950/30"
                      >
                        <Ban className="h-3.5 w-3.5 text-rose-400" />
                        <span>Confirm Quarantine</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleModeratorAction(report.id, 'DISMISS', 'False positive / compliant with guidelines')}
                        className="bg-[#090e1c] hover:bg-[#131d38] border border-[#1a233a] hover:border-emerald-500/40 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all shadow-sm"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Dismiss & Approve</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Audit Logs Table */}
      <div className="bg-[#090e1c] border border-[#1a233a] rounded-2xl p-6 shadow-2xl">
        <h3 className="font-heading font-bold text-base text-white mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span>Immutable Moderation Audit Log</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1a233a] text-slate-400">
                <th className="pb-3 px-3">Timestamp</th>
                <th className="pb-3 px-3">Action Type</th>
                <th className="pb-3 px-3">Target Reference</th>
                <th className="pb-3 px-3">Moderator Reason</th>
                <th className="pb-3 px-3">Executor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a233a]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#050813] transition-colors">
                  <td className="py-3 px-3 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === 'APPROVE_QUARANTINE'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 max-w-xs truncate">{log.target}</td>
                  <td className="py-3 px-3 text-slate-400">{log.reason}</td>
                  <td className="py-3 px-3 text-cyan-300 font-semibold">{log.moderator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

