/**
 * Socket.io Server Configuration
 * Handles real-time communication for notifications and chat
 */

import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma } from './lib/prisma';

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
    });

    // Send initial connection success
    socket.emit('connected', {
      message: 'Real-time connection established',
      userId
    });
  });

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
