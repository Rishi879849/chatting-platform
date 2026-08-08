import { db } from '../data/store.js';
import { logAuditEvent, AuditEventType } from '../services/auditLogger.js';

export function getMessages(req, res) {
  const { channelId } = req.query;
  let results = db.messages;

  // Filter out quarantined messages unless admin
  if (!req.user || req.user.role !== 'ADMIN') {
    results = results.filter(m => !m.isQuarantined);
  }

  if (channelId) {
    results = results.filter(m => m.channelId === channelId);
  }

  res.json({
    success: true,
    count: results.length,
    messages: results,
  });
}

export function sendMessage(req, res) {
  const { channelId, content } = req.body;
  const user = req.user;

  // Phone / Contact regex detection
  const phonePattern = /(?:\+91[\-\s]?)?[6-9]\d{9}|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/;
  const isQuarantined = phonePattern.test(content);

  const newMessage = {
    id: `msg-${Date.now()}`,
    channelId,
    authorId: user.id,
    author: {
      handle: user.identityMode === 'ANONYMOUS' ? user.pseudonym : user.publicHandle,
      isAnonymous: user.identityMode === 'ANONYMOUS',
      college: user.college,
      isVerified: user.isVerified,
      role: user.role,
      badges: user.badges || [],
    },
    content,
    upvotes: 0,
    upvotedBy: [],
    isSolution: false,
    isQuarantined,
    createdAt: new Date().toISOString(),
  };

  db.messages.push(newMessage);

  if (isQuarantined) {
    db.reports.push({
      id: `rep-chat-${Date.now()}`,
      threadId: null,
      messageId: newMessage.id,
      title: 'Quarantined Live Chat Contact Exchange',
      authorHandle: newMessage.author.handle,
      category: 'CONTACT_SHARING',
      reason: 'Automated AI phone/contact sharing regex trigger.',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    });

    logAuditEvent(AuditEventType.CONTENT_QUARANTINE, user, {
      messageId: newMessage.id,
      channelId,
      reason: 'Phone number exchange detected in live chat.',
    });
  }

  res.status(201).json({
    success: true,
    message: isQuarantined
      ? 'Message was quarantined by automated moderation.'
      : 'Message delivered to channel.',
    chatMessage: newMessage,
    isQuarantined,
  });
}

export function upvoteMessage(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const msg = db.messages.find(m => m.id === id);
  if (!msg) {
    return res.status(404).json({
      success: false,
      error: 'Message not found.',
      code: 'MESSAGE_NOT_FOUND',
    });
  }

  if (msg.upvotedBy.includes(userId)) {
    msg.upvotedBy = msg.upvotedBy.filter(uid => uid !== userId);
    msg.upvotes = Math.max(0, msg.upvotes - 1);
  } else {
    msg.upvotedBy.push(userId);
    msg.upvotes += 1;
  }

  res.json({
    success: true,
    upvotes: msg.upvotes,
  });
}

export function createChannel(req, res) {
  const { name, category, description } = req.body;

  const existing = db.channels.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    return res.status(409).json({
      success: false,
      error: 'A channel with this name already exists.',
      code: 'CHANNEL_EXISTS',
    });
  }

  const newChannel = {
    id: `chn-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name: name.toLowerCase(),
    category,
    description,
  };

  db.channels.push(newChannel);

  res.status(201).json({
    success: true,
    channel: newChannel,
  });
}
