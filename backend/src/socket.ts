/**
 * Socket.io Server Configuration
 * Handles real-time communication for notifications and chat
 */

import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma';
import { onConnect, onDisconnect, setPresence } from './services/presenceService';
import { SwarmManager } from './kangqore-immp/orchestrator/swarmManager.service';
import { SwarmActivityEngine } from './kangqore-immp/orchestrator/swarmActivity.engine';

// Extend Socket type to include user data
interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  userName?: string;
}

// User to socket mapping for targeted messaging
const userSockets = new Map<string, Set<string>>();

let io: Server;

/**
 * Initialize Socket.io server
 */
export function initializeSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5500', 'http://localhost:5173', 'http://localhost:5174'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // JWT Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
        userId: string;
        role: string;
        name?: string;
      };

      // Attach user info to socket
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      socket.userName = decoded.name;

      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    
    console.log(`🔌 User connected: ${userId} (${socket.userRole})`);

    // Add socket to user's socket set
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId)!.add(socket.id);

    // Join user's personal room for targeted messaging
    socket.join(`user:${userId}`);

    // Admin joins admin room for receiving all client messages
    if (socket.userRole === 'ADMIN') {
      socket.join('admin');
    }

    // ── RELAY: join all channel rooms visible to this user ──
    // Combines explicit membership + role-scoped public channels so every user
    // receives real-time events for channels they can see, even without a
    // ChannelMember row (e.g. global #general for a new TEAM member).
    const role = socket.userRole ?? 'TEAM';
    Promise.all([
      // Explicit member channels (private, DMs, etc.)
      prisma.channelMember.findMany({ where: { userId }, select: { channelId: true } }),
      // Role-scoped public channels
      role === 'ADMIN'
        ? prisma.channel.findMany({ where: { isArchived: false }, select: { id: true } })
        : role === 'EXECUTIVE'
          ? prisma.channel.findMany({ where: { isArchived: false, scope: { in: ['GLOBAL', 'EXECUTIVE'] }, type: { notIn: ['DM', 'GROUP_DM'] } }, select: { id: true } })
          : role === 'TEAM'
            ? prisma.user.findUnique({ where: { id: userId }, select: { deptId: true } }).then((u) =>
                prisma.channel.findMany({
                  where: { isArchived: false, OR: [{ scope: 'GLOBAL' }, ...(u?.deptId ? [{ scope: 'DEPT' as const, deptId: u.deptId }] : [])] },
                  select: { id: true },
                }),
              )
            : prisma.channel.findMany({ where: { isArchived: false, scope: 'GLOBAL', type: 'ANNOUNCEMENT' }, select: { id: true } }),
    ])
      .then(([memberships, visibleChannels]) => {
        const ids = new Set<string>(memberships.map((m) => m.channelId));
        visibleChannels.forEach((c) => ids.add(c.id));
        ids.forEach((id) => socket.join(`channel:${id}`));
      })
      .catch(() => {});

    // RELAY: mark user online
    onConnect(userId);

    // Handle typing indicators
    socket.on('typing:start', (data: { receiverId?: string }) => {
      if (data.receiverId) {
        socket.to(`user:${data.receiverId}`).emit('typing:indicator', {
          userId,
          isTyping: true
        });
      } else {
        // Typing to admin
        socket.to('admin').emit('typing:indicator', {
          userId,
          isTyping: true
        });
      }
    });

    socket.on('typing:stop', (data: { receiverId?: string }) => {
      if (data.receiverId) {
        socket.to(`user:${data.receiverId}`).emit('typing:indicator', {
          userId,
          isTyping: false
        });
      } else {
        socket.to('admin').emit('typing:indicator', {
          userId,
          isTyping: false
        });
      }
    });

    // Handle message read acknowledgment
    socket.on('message:read', async (data: { messageIds: string[] }) => {
      try {
        await prisma.message.updateMany({
          where: {
            id: { in: data.messageIds },
            receiverId: userId
          },
          data: { isRead: true }
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // ── RELAY: typing indicators ──
    socket.on('chat:typing:start', (data: { channelId: string }) => {
      if (data?.channelId) {
        socket.to(`channel:${data.channelId}`).emit('chat:typing:start', {
          userId, userName: socket.userName, channelId: data.channelId,
        });
        // Auto-stop after 4 seconds
        setTimeout(() => {
          socket.to(`channel:${data.channelId}`).emit('chat:typing:stop', { userId, channelId: data.channelId });
        }, 4000);
      }
    });

    socket.on('chat:typing:stop', (data: { channelId: string }) => {
      if (data?.channelId) {
        socket.to(`channel:${data.channelId}`).emit('chat:typing:stop', { userId, channelId: data.channelId });
      }
    });

    // ── RELAY: mark messages read ──
    socket.on('chat:message:read', async (data: { channelId: string; lastReadMsgId: string }) => {
      if (!data?.channelId) return;
      try {
        const msg = await prisma.chatMessage.findUnique({ where: { id: data.lastReadMsgId }, select: { createdAt: true } });
        await prisma.channelMember.updateMany({
          where: { channelId: data.channelId, userId },
          data: { lastReadAt: msg?.createdAt ?? new Date(), lastReadMsgId: data.lastReadMsgId },
        });
      } catch { /* non-fatal */ }
    });

    // ── RELAY: presence update ──
    socket.on('presence:set', async (data: { status: 'ONLINE' | 'AWAY' | 'DND' | 'OFFLINE'; customStatus?: string }) => {
      if (!data?.status) return;
      await setPresence(userId, data.status, data.customStatus);
      // Broadcast to all connected users (they'll filter in-app)
      io.emit('presence:update', { userId, status: data.status });
    });

    // ── PAGE PRESENCE ──
    socket.on('page:enter', (data: { pageKey: string }) => {
      if (!data?.pageKey) return;
      socket.join(`page:${data.pageKey}`);
      socket.to(`page:${data.pageKey}`).emit('page:viewer:joined', {
        userId, userName: (socket as any).userName ?? 'Unknown', pageKey: data.pageKey,
      });
    });

    socket.on('page:leave', (data: { pageKey: string }) => {
      if (!data?.pageKey) return;
      socket.leave(`page:${data.pageKey}`);
      socket.to(`page:${data.pageKey}`).emit('page:viewer:left', { userId, pageKey: data.pageKey });
    });

    // ── CANVAS COLLABORATION (S54) ────────────────────────────────────────────
    // canvas:join  — join a canvas editing session (room = canvas:{canvasId})
    socket.on('canvas:join', (data: { canvasId: string }) => {
      if (!data?.canvasId) return;
      const room = `canvas:${data.canvasId}`;
      socket.join(room);
      // Announce presence to everyone else in the room
      socket.to(room).emit('canvas:presence:joined', {
        userId, userName: (socket as any).userName ?? 'User',
        canvasId: data.canvasId,
        color: `hsl(${(parseInt(userId.slice(-4), 16) % 360)},70%,55%)`,
      });
    });

    socket.on('canvas:leave', (data: { canvasId: string }) => {
      if (!data?.canvasId) return;
      const room = `canvas:${data.canvasId}`;
      socket.leave(room);
      socket.to(room).emit('canvas:presence:left', { userId, canvasId: data.canvasId });
    });

    // cursor position broadcast — throttled by client, relayed to room peers
    socket.on('canvas:cursor', (data: { canvasId: string; x: number; y: number }) => {
      if (!data?.canvasId) return;
      socket.to(`canvas:${data.canvasId}`).emit('canvas:cursor', { userId, x: data.x, y: data.y });
    });

    // node selection lock — first to claim owns it; others see a dim overlay
    socket.on('canvas:select', (data: { canvasId: string; nodeId: string | null }) => {
      if (!data?.canvasId) return;
      socket.to(`canvas:${data.canvasId}`).emit('canvas:select', { userId, nodeId: data.nodeId });
    });

    // canvas comment with optional @mention
    socket.on('canvas:comment', (data: { canvasId: string; nodeId: string; text: string; mentions?: string[] }) => {
      if (!data?.canvasId || !data?.nodeId || !data?.text) return;
      const room = `canvas:${data.canvasId}`;
      io.to(room).emit('canvas:comment', {
        id: Date.now().toString(),
        userId, userName: (socket as any).userName ?? 'User',
        nodeId: data.nodeId, text: data.text,
        mentions: data.mentions ?? [],
        ts: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${userId}`);

      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }

      // RELAY: 30-second grace before marking offline
      onDisconnect(userId, (userSockets.get(userId)?.size ?? 0) > 0, (uid, status) => {
        io.emit('presence:update', { userId: uid, status });
      });
    });

    // Send initial connection success
    socket.emit('connected', {
      message: 'Real-time connection established',
      userId
    });

    // Send live swarm topology to this authenticated socket
    SwarmManager.sendTopologyToSocket(socket);

    // Allow clients to re-request topology at any time
    socket.on('request:swarm_topology', () => {
      SwarmManager.sendTopologyToSocket(socket);
    });
  });

  // Attach SwarmManager to broadcast KIMMP agent updates
  SwarmManager.attachSocket(io);

  // Start the live activity engine — agents begin cycling through real tasks
  SwarmActivityEngine.start();

  return io;
}

/**
 * Get Socket.io server instance
 */
export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

/**
 * Emit event to a specific user
 */
export function emitToUser(userId: string, event: string, data: any): void {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
}

/**
 * Emit event to all admins
 */
export function emitToAdmins(event: string, data: any): void {
  if (io) {
    io.to('admin').emit(event, data);
  }
}

/**
 * Check if a user is currently online
 */
export function isUserOnline(userId: string): boolean {
  return userSockets.has(userId) && userSockets.get(userId)!.size > 0;
}

/**
 * Get number of online users
 */
export function getOnlineUsersCount(): number {
  return userSockets.size;
}

export { io };
