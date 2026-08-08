import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_SERVERS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_THREADS,
  INITIAL_REPORTS, 
  INITIAL_AUDIT_LOGS 
} from '../types/mockData';
import { generatePseudonym, analyzeContent } from '../services/moderationEngine';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. Authenticated User State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('acadsphere_user');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return {
      id: 'usr-1',
      publicHandle: '@aravind_v',
      name: 'Aravind V.',
      pseudonym: 'QuietCoder_4471',
      college: 'IIT Madras',
      collegeEmail: 'aravind@iitm.ac.in',
      isVerified: true,
      role: 'ADMIN',
      badges: ['DSA Specialist', 'Verified Student', 'Peer Reviewer'],
      reputationScore: 320
    };
  });

  // 2. Active Posting Identity Mode: 'ANONYMOUS' | 'PUBLIC'
  const [identityMode, setIdentityMode] = useState('ANONYMOUS');

  // 3. Discord Architecture: Servers & Live Channels
  const [servers, setServers] = useState(() => {
    const saved = localStorage.getItem('acadsphere_servers');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_SERVERS;
  });

  const [activeServerId, setActiveServerId] = useState('srv-dtv');
  const [activeChannelId, setActiveChannelId] = useState('dsa-live-help');

  // 4. Live Chat Messages Stream
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('acadsphere_chat_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_CHAT_MESSAGES;
  });

  // 5. Discussion Threads Dataset
  const [threads, setThreads] = useState(() => {
    const saved = localStorage.getItem('acadsphere_threads');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_THREADS;
  });

  const [selectedThreadId, setSelectedThreadId] = useState('th-1');

  // 6. Views: 'CHAT' | 'FEED' | 'THREAD_DETAIL' | 'ADMIN'
  const [activeView, setActiveView] = useState('CHAT');

  // 7. Search & Feed Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnanswered, setFilterUnanswered] = useState(false);
  const [filterHasSolution, setFilterHasSolution] = useState(false);

  // 8. Skeleton Loading Simulation State
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = (callback, duration = 300) => {
    setIsLoading(true);
    if (callback) callback();
    setTimeout(() => {
      setIsLoading(false);
    }, duration);
  };

  // Moderation & Trust System
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('acadsphere_reports');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_REPORTS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('acadsphere_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [blockedHandles, setBlockedHandles] = useState([]);

  // Modals & Triggers
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Thread modal
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [profileViewTarget, setProfileViewTarget] = useState(null);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem('acadsphere_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('acadsphere_servers', JSON.stringify(servers));
  }, [servers]);

  useEffect(() => {
    localStorage.setItem('acadsphere_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('acadsphere_threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('acadsphere_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('acadsphere_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Derived rooms across all servers
  const rooms = servers.flatMap(s => s.channels || []);

  // Actions
  const toggleIdentityMode = () => {
    const newMode = identityMode === 'ANONYMOUS' ? 'PUBLIC' : 'ANONYMOUS';
    setIdentityMode(newMode);
    addToast(`Switched chat identity to ${newMode === 'ANONYMOUS' ? 'Pseudonymous (' + currentUser.pseudonym + ')' : 'Public (' + currentUser.publicHandle + ')'}`, 'success');
  };

  const regenerateUserPseudonym = () => {
    const newPseudonym = generatePseudonym();
    setCurrentUser(prev => ({ ...prev, pseudonym: newPseudonym }));
    addToast(`Generated new pseudonymous handle: ${newPseudonym}`, 'info');
  };

  const createChannel = (channelData) => {
    const newChannel = {
      id: `chan-${Date.now()}`,
      name: channelData.name.toLowerCase().replace(/\s+/g, '-'),
      category: channelData.category || 'SUBJECT',
      icon: channelData.category === 'CAREER' ? 'Briefcase' : 'Code2',
      description: channelData.description || 'Custom academic chat channel'
    };

    setServers(prev => prev.map(s => {
      if (s.id === activeServerId) {
        return {
          ...s,
          channels: [...s.channels, newChannel]
        };
      }
      return s;
    }));

    simulateLoading(() => {
      setActiveChannelId(newChannel.id);
    }, 250);
    
    setIsCreateChannelModalOpen(false);
    addToast(`Created #${newChannel.name} live room!`, 'success');
  };

  // Real-Time Chat Message Dispatcher
  const sendChatMessage = (messageText) => {
    const analysis = analyzeContent(messageText, '');
    
    if (analysis.autoQuarantine) {
      const newReport = {
        id: `rep-${Date.now()}`,
        messageId: `msg-${Date.now()}`,
        targetContent: messageText,
        targetTitle: messageText.slice(0, 60),
        targetAuthor: identityMode === 'ANONYMOUS' ? currentUser.pseudonym : currentUser.publicHandle,
        reportedBy: 'AI Safety Classifier Engine',
        category: analysis.flags[0]?.type || 'CONTACT_SHARING',
        severity: analysis.severity,
        reason: analysis.actionReason || 'Automated contact-sharing quarantine trigger',
        timestamp: new Date().toISOString(),
        status: 'PENDING',
        autoQuarantined: true
      };
      setReports(prev => [newReport, ...prev]);

      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        moderator: 'AcadSphere AI Guard',
        action: 'AUTO_QUARANTINE',
        target: `Live Message in #${activeChannelId}`,
        reason: analysis.actionReason,
        severity: analysis.severity
      };
      setAuditLogs(prev => [newLog, ...prev]);

      addToast(`❌ Message blocked: ${analysis.actionReason}`, 'error');
      return false;
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      serverId: activeServerId,
      channelId: activeChannelId,
      content: messageText,
      author: {
        isAnonymous: identityMode === 'ANONYMOUS',
        handle: identityMode === 'ANONYMOUS' ? currentUser.pseudonym : currentUser.publicHandle,
        name: identityMode === 'PUBLIC' ? currentUser.name : undefined,
        college: currentUser.college,
        isVerified: currentUser.isVerified,
        badges: currentUser.badges
      },
      createdAt: new Date().toISOString(),
      upvotes: 0,
      hasSolution: false,
      isQuarantined: false
    };

    setChatMessages(prev => [...prev, newMessage]);
    return true;
  };

  const upvoteMessage = (messageId) => {
    setChatMessages(prev => prev.map(m => m.id === messageId ? { ...m, upvotes: m.upvotes + 1 } : m));
    addToast('👍 Upvoted helpful academic message!', 'success');
  };

  const markAcceptedSolution = (messageId) => {
    setChatMessages(prev => prev.map(m => m.id === messageId ? { ...m, isAcceptedSolution: true } : m));
    addToast('🌟 Verified Solution marked in chat stream!', 'success');
  };

  // Thread Management Actions
  const createThread = (threadData) => {
    const analysis = analyzeContent(threadData.content, threadData.title);
    
    if (analysis.autoQuarantine) {
      const newReport = {
        id: `rep-${Date.now()}`,
        messageId: `th-${Date.now()}`,
        targetContent: threadData.content,
        targetTitle: threadData.title,
        targetAuthor: identityMode === 'ANONYMOUS' ? currentUser.pseudonym : currentUser.publicHandle,
        reportedBy: 'AI Safety Classifier Engine',
        category: analysis.flags[0]?.type || 'CONTACT_SHARING',
        severity: analysis.severity,
        reason: analysis.actionReason || 'Automated contact-sharing quarantine trigger',
        timestamp: new Date().toISOString(),
        status: 'PENDING',
        autoQuarantined: true
      };
      setReports(prev => [newReport, ...prev]);
      addToast(`❌ Thread blocked: ${analysis.actionReason}`, 'error');
      setIsCreateModalOpen(false);
      return false;
    }

    const newThread = {
      id: `th-${Date.now()}`,
      serverId: activeServerId,
      channelId: threadData.channelId || activeChannelId,
      title: threadData.title,
      content: threadData.content,
      tags: threadData.tags || ['Academic Discussion'],
      author: {
        isAnonymous: identityMode === 'ANONYMOUS',
        handle: identityMode === 'ANONYMOUS' ? currentUser.pseudonym : currentUser.publicHandle,
        name: identityMode === 'PUBLIC' ? currentUser.name : undefined,
        college: currentUser.college,
        isVerified: currentUser.isVerified,
        badges: currentUser.badges
      },
      createdAt: new Date().toISOString(),
      upvotes: 0,
      hasSolution: false,
      isQuarantined: false,
      replies: []
    };

    setThreads(prev => [newThread, ...prev]);
    setIsCreateModalOpen(false);
    setSelectedThreadId(newThread.id);
    setActiveView('THREAD_DETAIL');
    addToast('🚀 Academic Question Thread published successfully!', 'success');
    return true;
  };

  const upvoteThread = (threadId) => {
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t));
    addToast('👍 Upvoted academic discussion thread!', 'success');
  };

  const addReply = (threadId, replyText) => {
    const analysis = analyzeContent(replyText, '');
    if (analysis.autoQuarantine) {
      addToast(`❌ Answer blocked: ${analysis.actionReason}`, 'error');
      return false;
    }

    const newReply = {
      id: `rep-${Date.now()}`,
      author: {
        isAnonymous: identityMode === 'ANONYMOUS',
        handle: identityMode === 'ANONYMOUS' ? currentUser.pseudonym : currentUser.publicHandle,
        name: identityMode === 'PUBLIC' ? currentUser.name : undefined,
        college: currentUser.college,
        isVerified: currentUser.isVerified,
        badges: currentUser.badges
      },
      content: replyText,
      createdAt: new Date().toISOString(),
      isAcceptedSolution: false
    };

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          replies: [...t.replies, newReply]
        };
      }
      return t;
    }));

    addToast('📝 Academic Answer published to thread!', 'success');
    return true;
  };

  const markReplySolution = (threadId, replyId) => {
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          hasSolution: true,
          replies: t.replies.map(r => r.id === replyId ? { ...r, isAcceptedSolution: true } : r)
        };
      }
      return t;
    }));
    addToast('🌟 Verified Academic Solution accepted!', 'success');
  };

  const submitReport = (reportData) => {
    const newReport = {
      id: `rep-${Date.now()}`,
      messageId: reportData.threadId || reportData.messageId || `item-${Date.now()}`,
      targetContent: reportData.targetContent || reportData.title || 'Post report',
      targetTitle: reportData.title || reportData.targetContent?.slice(0, 60) || 'Academic Post',
      targetAuthor: reportData.authorHandle,
      reportedBy: 'Anonymous Learner',
      category: reportData.category,
      severity: reportData.category === 'CONTACT_SHARING' || reportData.category === 'HARASSMENT' ? 'HIGH' : 'MEDIUM',
      reason: reportData.reason,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      autoQuarantined: false
    };

    setReports(prev => [newReport, ...prev]);
    addToast('🛡️ Post reported confidentially for moderator review.', 'info');
    setReportTarget(null);
  };

  const handleModeratorAction = (reportId, action, reason) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    if (action === 'APPROVE_QUARANTINE') {
      setChatMessages(prev => prev.map(m => m.id === report.messageId ? { ...m, isQuarantined: true } : m));
      setThreads(prev => prev.map(t => t.id === report.messageId ? { ...t, isQuarantined: true } : t));
    } else if (action === 'DISMISS') {
      setChatMessages(prev => prev.map(m => m.id === report.messageId ? { ...m, isQuarantined: false } : m));
      setThreads(prev => prev.map(t => t.id === report.messageId ? { ...t, isQuarantined: false } : t));
    }

    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'RESOLVED' } : r));

    const logEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      moderator: currentUser.name + ' (Admin)',
      action,
      target: `Report #${reportId}`,
      reason: reason || 'Moderator Manual Action',
      severity: 'INFO'
    };

    setAuditLogs(prev => [logEntry, ...prev]);
    addToast(`Moderator action (${action}) complete.`, 'success');
  };

  const blockUserHandle = (handle) => {
    if (!blockedHandles.includes(handle)) {
      setBlockedHandles(prev => [...prev, handle]);
      addToast(`Blocked content from ${handle}.`, 'info');
    }
  };

  const verifyCollegeEmail = (email) => {
    const isAcademic = email.endsWith('.ac.in') || email.endsWith('.edu.in') || email.endsWith('.edu');
    if (isAcademic) {
      const collegeDomain = email.split('@')[1];
      const collegeName = collegeDomain.includes('iitm') ? 'IIT Madras' : 
                          collegeDomain.includes('bits') ? 'BITS Pilani' :
                          collegeDomain.includes('nitt') ? 'NIT Trichy' : 
                          collegeDomain.includes('iitb') ? 'IIT Bombay' :
                          collegeDomain.includes('iiit') ? 'IIIT Hyderabad' : 'Institutional Student';
      
      setCurrentUser(prev => ({
        ...prev,
        collegeEmail: email,
        college: collegeName,
        isVerified: true,
        badges: Array.from(new Set([...prev.badges, 'Verified Student']))
      }));
      addToast(`🎉 Verified ${collegeName} domain! "Verified Student" badge awarded.`, 'success');
      setIsVerificationModalOpen(false);
    } else {
      addToast('❌ Domain must end in .ac.in or .edu.in', 'error');
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      identityMode,
      toggleIdentityMode,
      regenerateUserPseudonym,
      servers,
      activeServerId,
      setActiveServerId,
      activeChannelId,
      setActiveChannelId,
      createChannel,
      rooms,
      chatMessages,
      sendChatMessage,
      upvoteMessage,
      markAcceptedSolution,
      threads,
      createThread,
      upvoteThread,
      addReply,
      markReplySolution,
      selectedThreadId,
      setSelectedThreadId,
      activeView,
      setActiveView,
      searchQuery,
      setSearchQuery,
      filterUnanswered,
      setFilterUnanswered,
      filterHasSolution,
      setFilterHasSolution,
      isLoading,
      setIsLoading,
      simulateLoading,
      reports,
      submitReport,
      handleModeratorAction,
      auditLogs,
      blockedHandles,
      blockUserHandle,
      isCreateChannelModalOpen,
      setIsCreateChannelModalOpen,
      isCreateModalOpen,
      setIsCreateModalOpen,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      isVerificationModalOpen,
      setIsVerificationModalOpen,
      isGuidelinesModalOpen,
      setIsGuidelinesModalOpen,
      reportTarget,
      setReportTarget,
      profileViewTarget,
      setProfileViewTarget,
      verifyCollegeEmail,
      toasts,
      addToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

