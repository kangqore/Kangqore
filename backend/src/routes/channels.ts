import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/rbac';
import { createError } from '../middleware/errorHandler';
import { getIO } from '../socket';

const router = Router();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a Prisma WHERE clause for channels visible to this user/role. */
function channelVisibilityWhere(userId: string, role: string, deptId?: string | null) {
  const memberFilter = { members: { some: { userId } } };

  if (role === 'ADMIN') return {}; // admin sees all

  if (role === 'EXECUTIVE') {
    return {
      OR: [
        { scope: 'GLOBAL' as const },
        { scope: 'EXECUTIVE' as const },
        { type: 'DM' as const, ...memberFilter },
        { type: 'GROUP_DM' as const, ...memberFilter },
        { type: 'PRIVATE' as const, ...memberFilter },
      ],
    };
  }

  if (role === 'TEAM') {
    return {
      OR: [
        { scope: 'GLOBAL' as const },
        ...(deptId ? [{ scope: 'DEPT' as const, deptId }] : []),
        { type: 'DM' as const, ...memberFilter },
        { type: 'GROUP_DM' as const, ...memberFilter },
        { type: 'PRIVATE' as const, ...memberFilter },
      ],
    };
  }

  if (role === 'CLIENT') {
    return {
      OR: [
        { scope: 'GLOBAL' as const, type: 'ANNOUNCEMENT' as const },
        { scope: 'CLIENT_ROOM' as const, ...memberFilter },
        { type: 'DM' as const, ...memberFilter },
        { type: 'GROUP_DM' as const, ...memberFilter },
      ],
    };
  }

  if (role === 'PARTNER') {
    return {
      OR: [
        { scope: 'GLOBAL' as const, type: 'ANNOUNCEMENT' as const },
        { scope: 'PARTNER_ROOM' as const, ...memberFilter },
        { type: 'DM' as const, ...memberFilter },
        { type: 'GROUP_DM' as const, ...memberFilter },
      ],
    };
  }

  // INVESTOR, ANALYST, JOURNALIST, JOB_SEEKER
  return {
    OR: [
      { scope: 'GLOBAL' as const, type: 'ANNOUNCEMENT' as const },
      { type: 'DM' as const, ...memberFilter },
      { type: 'GROUP_DM' as const, ...memberFilter },
    ],
  };
}

const MSG_SELECT = {
  id: true,
  channelId: true,
  content: true,
  parentId: true,
  isPinned: true,
  editedAt: true,
  deletedAt: true,
  attachments: true,
  mentions: true,
  createdAt: true,
  author: { select: { id: true, name: true, avatarUrl: true, role: true } },
  reactions: {
    select: {
      id: true, emoji: true, userId: true,
      user: { select: { id: true, name: true } },
    },
  },
  _count: { select: { replies: true } },
};

// ---------------------------------------------------------------------------
// GET /api/channels — list accessible channels
// ---------------------------------------------------------------------------
router.get('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { deptId: true } });

    const channels = await prisma.channel.findMany({
      where: { isArchived: false, ...channelVisibilityWhere(userId, role, user?.deptId) },
      include: {
        _count: { select: { members: true, messages: true } },
        members: {
          where: { userId },
          select: { lastReadAt: true, lastReadMsgId: true, role: true, notifPref: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ channels });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// POST /api/channels — create channel
// ---------------------------------------------------------------------------
router.post('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    if (!['ADMIN', 'TEAM', 'EXECUTIVE'].includes(role)) throw createError('Forbidden', 403);

    const { name, type = 'PUBLIC', scope = 'GLOBAL', deptId, description } = req.body;
    if (!name?.trim()) throw createError('name is required', 400);

    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const channel = await prisma.channel.create({
      data: {
        name: name.trim(),
        slug: `${slug}-${Date.now()}`,
        type,
        scope,
        deptId: deptId ?? null,
        description: description ?? null,
        createdById: userId,
        members: { create: { userId, role: 'OWNER' } },
      },
      include: { _count: { select: { members: true } } },
    });

    res.status(201).json({ channel });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// GET /api/channels/unread-counts
// ---------------------------------------------------------------------------
router.get('/unread-counts', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { deptId: true } });

    const memberships = await prisma.channelMember.findMany({
      where: { userId },
      select: { channelId: true, lastReadAt: true },
    });

    const counts: Record<string, { messages: number; mentions: number }> = {};

    await Promise.all(memberships.map(async (m) => {
      const since = m.lastReadAt ?? new Date(0);
      const [total, mentionMsgs] = await Promise.all([
        prisma.chatMessage.count({
          where: { channelId: m.channelId, createdAt: { gt: since }, deletedAt: null, authorId: { not: userId } },
        }),
        prisma.chatMessage.findMany({
          where: { channelId: m.channelId, createdAt: { gt: since }, deletedAt: null },
          select: { mentions: true },
        }),
      ]);
      const mentions = mentionMsgs.filter((msg) => {
        const arr = Array.isArray(msg.mentions) ? msg.mentions as string[] : [];
        return arr.includes(userId);
      }).length;
      counts[m.channelId] = { messages: total, mentions };
    }));

    res.json({ counts });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// GET /api/channels/search — full-text search
// ---------------------------------------------------------------------------
router.get('/search', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { deptId: true } });
    const q = (req.query.q as string)?.trim();
    const channelId = req.query.channelId as string | undefined;

    if (!q) return res.json({ results: [] });

    const channelFilter = channelId
      ? { channelId }
      : { channel: { isArchived: false, ...channelVisibilityWhere(userId, role, user?.deptId) } };

    const messages = await prisma.chatMessage.findMany({
      where: { ...channelFilter, content: { contains: q, mode: 'insensitive' }, deletedAt: null },
      select: {
        ...MSG_SELECT,
        channel: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ results: messages });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// GET /api/channels/dm/:userId — get or create DM with another user
// ---------------------------------------------------------------------------
router.get('/dm/:targetUserId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { targetUserId } = req.params;

    if (userId === targetUserId) throw createError('Cannot DM yourself', 400);

    // Find DM channels where current user is a member, then check if target is also a member
    const myDMs = await prisma.channel.findMany({
      where: { type: 'DM', members: { some: { userId } } },
      include: { members: { select: { userId: true } }, _count: { select: { members: true } } },
    });

    const existing = myDMs.find(
      (ch) => ch._count.members === 2 && ch.members.some((m) => m.userId === targetUserId),
    );

    if (existing) {
      return res.json({ channel: existing });
    }

    const target = await prisma.user.findUnique({ where: { id: targetUserId }, select: { name: true } });
    if (!target) throw createError('User not found', 404);

    const channel = await prisma.channel.create({
      data: {
        name: `DM`,
        slug: `dm-${[userId, targetUserId].sort().join('-')}-${Date.now()}`,
        type: 'DM',
        scope: 'GLOBAL',
        createdById: userId,
        members: {
          create: [
            { userId, role: 'MEMBER' },
            { userId: targetUserId, role: 'MEMBER' },
          ],
        },
      },
      include: { _count: { select: { members: true } } },
    });

    res.status(201).json({ channel });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// POST /api/channels/group-dm — create group DM
// ---------------------------------------------------------------------------
router.post('/group-dm', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { userIds } = req.body as { userIds: string[] };

    if (!Array.isArray(userIds) || userIds.length < 2) {
      throw createError('userIds must have at least 2 members', 400);
    }

    const allIds = Array.from(new Set([userId, ...userIds]));

    const channel = await prisma.channel.create({
      data: {
        name: 'Group',
        slug: `group-dm-${Date.now()}`,
        type: 'GROUP_DM',
        scope: 'GLOBAL',
        createdById: userId,
        members: { create: allIds.map((id) => ({ userId: id, role: id === userId ? 'OWNER' : 'MEMBER' })) },
      },
      include: { _count: { select: { members: true } } },
    });

    res.status(201).json({ channel });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// GET /api/channels/:id — channel detail
// ---------------------------------------------------------------------------
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const channel = await prisma.channel.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { members: true, messages: true } },
        members: { where: { userId }, select: { role: true, notifPref: true, lastReadAt: true } },
      },
    });
    if (!channel) throw createError('Channel not found', 404);
    res.json({ channel });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// PATCH /api/channels/:id — edit channel
// ---------------------------------------------------------------------------
router.patch('/:id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const { name, description, isArchived } = req.body;

    const member = await prisma.channelMember.findUnique({ where: { channelId_userId: { channelId: req.params.id, userId } } });
    if (!member && role !== 'ADMIN') throw createError('Forbidden', 403);

    const channel = await prisma.channel.update({
      where: { id: req.params.id },
      data: { ...(name && { name }), ...(description !== undefined && { description }), ...(isArchived !== undefined && { isArchived }) },
    });
    res.json({ channel });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// GET /api/channels/:id/messages — paginated messages
// ---------------------------------------------------------------------------
router.get('/:id/messages', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const before = req.query.before as string | undefined;

    const messages = await prisma.chatMessage.findMany({
      where: {
        channelId: req.params.id,
        parentId: null, // top-level only; threads fetched separately
        ...(before && { createdAt: { lt: (await prisma.chatMessage.findUnique({ where: { id: before } }))?.createdAt ?? new Date() } }),
      },
      select: MSG_SELECT,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json({ messages: messages.reverse(), hasMore: messages.length === limit });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// POST /api/channels/:id/messages — send message
// ---------------------------------------------------------------------------
router.post('/:id/messages', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { content, parentId, mentions, attachments } = req.body;

    if (!content?.trim()) throw createError('content is required', 400);

    // Enforce ANNOUNCEMENT channels are admin-only for posting
    const channel = await prisma.channel.findUnique({ where: { id: req.params.id }, select: { type: true } });
    if (channel?.type === 'ANNOUNCEMENT' && req.user!.role !== 'ADMIN') {
      throw createError('Only admins can post in announcement channels', 403);
    }

    const message = await prisma.chatMessage.create({
      data: {
        channelId: req.params.id,
        authorId: userId,
        content: content.trim(),
        parentId: parentId ?? null,
        mentions: mentions ?? [],
        attachments: attachments ?? [],
      },
      select: MSG_SELECT,
    });

    // Real-time broadcast
    try {
      getIO().to(`channel:${req.params.id}`).emit('chat:message:new', message);
    } catch { /* socket not ready */ }

    res.status(201).json({ message });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// PATCH /api/channels/:id/messages/:msgId — edit message
// ---------------------------------------------------------------------------
router.patch('/:id/messages/:msgId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { content } = req.body;

    const existing = await prisma.chatMessage.findUnique({ where: { id: req.params.msgId } });
    if (!existing) throw createError('Message not found', 404);
    if (existing.authorId !== userId) throw createError('Forbidden', 403);
    if (!content?.trim()) throw createError('content is required', 400);

    const message = await prisma.chatMessage.update({
      where: { id: req.params.msgId },
      data: { content: content.trim(), editedAt: new Date() },
      select: MSG_SELECT,
    });

    try { getIO().to(`channel:${req.params.id}`).emit('chat:message:edit', { id: message.id, content: message.content, editedAt: message.editedAt }); } catch { }

    res.json({ message });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// DELETE /api/channels/:id/messages/:msgId — soft delete
// ---------------------------------------------------------------------------
router.delete('/:id/messages/:msgId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;

    const existing = await prisma.chatMessage.findUnique({ where: { id: req.params.msgId } });
    if (!existing) throw createError('Message not found', 404);
    if (existing.authorId !== userId && role !== 'ADMIN') throw createError('Forbidden', 403);

    await prisma.chatMessage.update({
      where: { id: req.params.msgId },
      data: { deletedAt: new Date(), content: 'This message was deleted.' },
    });

    try { getIO().to(`channel:${req.params.id}`).emit('chat:message:delete', { id: req.params.msgId, deletedAt: new Date() }); } catch { }

    res.json({ success: true });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// POST /api/channels/:id/messages/:msgId/reactions — toggle reaction
// ---------------------------------------------------------------------------
router.post('/:id/messages/:msgId/reactions', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { emoji } = req.body;
    if (!emoji) throw createError('emoji is required', 400);

    const existing = await prisma.messageReaction.findUnique({
      where: { messageId_userId_emoji: { messageId: req.params.msgId, userId, emoji } },
    });

    let action: 'add' | 'remove';
    if (existing) {
      await prisma.messageReaction.delete({ where: { id: existing.id } });
      action = 'remove';
    } else {
      await prisma.messageReaction.create({ data: { messageId: req.params.msgId, userId, emoji } });
      action = 'add';
    }

    const allReactions = await prisma.messageReaction.findMany({
      where: { messageId: req.params.msgId },
      select: { id: true, emoji: true, userId: true, user: { select: { id: true, name: true } } },
    });

    try { getIO().to(`channel:${req.params.id}`).emit('chat:reaction', { messageId: req.params.msgId, emoji, userId, action, allReactions }); } catch { }

    res.json({ action, allReactions });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// PATCH /api/channels/:id/messages/:msgId/pin — toggle pin
// ---------------------------------------------------------------------------
router.patch('/:id/messages/:msgId/pin', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;

    const member = await prisma.channelMember.findUnique({ where: { channelId_userId: { channelId: req.params.id, userId } } });
    if ((!member || !['OWNER', 'ADMIN'].includes(member.role)) && role !== 'ADMIN') {
      throw createError('Only channel admins can pin messages', 403);
    }

    const existing = await prisma.chatMessage.findUnique({ where: { id: req.params.msgId } });
    if (!existing) throw createError('Message not found', 404);

    const message = await prisma.chatMessage.update({
      where: { id: req.params.msgId },
      data: { isPinned: !existing.isPinned },
      select: MSG_SELECT,
    });

    try { getIO().to(`channel:${req.params.id}`).emit('chat:pin', { messageId: message.id, isPinned: message.isPinned }); } catch { }

    res.json({ message });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// GET /api/channels/:id/pins — list pinned messages
// ---------------------------------------------------------------------------
router.get('/:id/pins', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { channelId: req.params.id, isPinned: true, deletedAt: null },
      select: MSG_SELECT,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ messages });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// GET /api/channels/:id/members — member list with presence
// ---------------------------------------------------------------------------
router.get('/:id/members', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const members = await prisma.channelMember.findMany({
      where: { channelId: req.params.id },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true, role: true, deptId: true },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    const userIds = members.map((m) => m.userId);
    const presences = await prisma.userPresence.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, status: true, customStatus: true, statusEmoji: true },
    });
    const presenceMap = Object.fromEntries(presences.map((p) => [p.userId, p]));

    res.json({
      members: members.map((m) => ({
        ...m,
        presence: presenceMap[m.userId] ?? { status: 'OFFLINE' },
      })),
    });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// POST /api/channels/:id/members — add member
// ---------------------------------------------------------------------------
router.post('/:id/members', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    if (!userId) throw createError('userId is required', 400);

    const member = await prisma.channelMember.upsert({
      where: { channelId_userId: { channelId: req.params.id, userId } },
      create: { channelId: req.params.id, userId, role: 'MEMBER' },
      update: {},
    });

    try {
      const channel = await prisma.channel.findUnique({ where: { id: req.params.id } });
      getIO().to(`user:${userId}`).emit('chat:channel:joined', channel);
    } catch { }

    res.status(201).json({ member });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// DELETE /api/channels/:id/members/:userId — remove member
// ---------------------------------------------------------------------------
router.delete('/:id/members/:memberId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, role } = req.user!;
    const { id: channelId, memberId } = req.params;

    if (memberId !== userId && role !== 'ADMIN') {
      const requester = await prisma.channelMember.findUnique({ where: { channelId_userId: { channelId, userId } } });
      if (!requester || !['OWNER', 'ADMIN'].includes(requester.role)) throw createError('Forbidden', 403);
    }

    await prisma.channelMember.delete({ where: { channelId_userId: { channelId, userId: memberId } } });

    res.json({ success: true });
  } catch (err) { next(err); }
});

// ---------------------------------------------------------------------------
// GET /api/channels/:id/threads/:parentId — get thread replies
// ---------------------------------------------------------------------------
router.get('/:id/threads/:parentId', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const replies = await prisma.chatMessage.findMany({
      where: { parentId: req.params.parentId, deletedAt: null },
      select: MSG_SELECT,
      orderBy: { createdAt: 'asc' },
    });
    res.json({ replies });
  } catch (err) { next(err); }
});

export default router;
