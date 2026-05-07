import { PrismaClient } from '@prisma/client';
import { generateTokenPair, verifyRefreshToken, TokenPair } from './token.service';

const prisma = new PrismaClient();

export interface SessionData {
  id: string;
  userId: string;
  refreshToken: string;
  ipAddress: string | null;
  userAgent: string | null;
  lastActive: Date;
  expiresAt: Date;
  createdAt: Date;
}

export interface CreateSessionData {
  userId: string;
  role: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create a new session for a user
 * Returns access token, refresh token, and session ID
 */
export const createSession = async (data: CreateSessionData): Promise<{ tokens: TokenPair; sessionId: string }> => {
  const { userId, role, ipAddress, userAgent } = data;

  // Generate token pair
  const tokens = generateTokenPair(userId, role);

  // Calculate expiry (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Create session in database
  const session = await prisma.session.create({
    data: {
      userId,
      refreshToken: tokens.refreshToken,
      ipAddress,
      userAgent,
      expiresAt,
      lastActive: new Date()
    }
  });

  return {
    tokens,
    sessionId: session.id
  };
};

/**
 * Refresh access token using refresh token
 * Returns new token pair and updates session
 */
export const refreshSession = async (refreshToken: string): Promise<TokenPair | null> => {
  // Verify refresh token
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return null;
  }

  // Find session in database
  const session = await prisma.session.findFirst({
    where: {
      refreshToken,
      expiresAt: {
        gt: new Date() // Not expired
      }
    },
    include: {
      user: true
    }
  });

  if (!session) {
    return null;
  }

  // Generate new token pair
  const newTokens = generateTokenPair(session.userId, session.user.role);

  // Update session with new refresh token
  await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshToken: newTokens.refreshToken,
      lastActive: new Date()
    }
  });

  return newTokens;
};

/**
 * Get all active sessions for a user
 */
export const getUserSessions = async (userId: string): Promise<SessionData[]> => {
  const sessions = await prisma.session.findMany({
    where: {
      userId,
      expiresAt: {
        gt: new Date()
      }
    },
    orderBy: {
      lastActive: 'desc'
    }
  });

  return sessions;
};

/**
 * Delete a specific session (single logout)
 */
export const deleteSession = async (sessionId: string): Promise<boolean> => {
  try {
    await prisma.session.delete({
      where: { id: sessionId }
    });
    return true;
  } catch (error) {
    console.error('Failed to delete session:', error);
    return false;
  }
};

/**
 * Delete all sessions for a user (logout all)
 */
export const deleteAllUserSessions = async (userId: string): Promise<number> => {
  const result = await prisma.session.deleteMany({
    where: { userId }
  });

  return result.count;
};

/**
 * Delete session by refresh token
 */
export const deleteSessionByToken = async (refreshToken: string): Promise<boolean> => {
  try {
    await prisma.session.deleteMany({
      where: { refreshToken }
    });
    return true;
  } catch (error) {
    console.error('Failed to delete session by token:', error);
    return false;
  }
};

/**
 * Clean up expired sessions (should be run periodically)
 */
export const cleanupExpiredSessions = async (): Promise<number> => {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  });

  return result.count;
};

/**
 * Update session activity timestamp
 */
export const updateSessionActivity = async (sessionId: string): Promise<void> => {
  await prisma.session.update({
    where: { id: sessionId },
    data: {
      lastActive: new Date()
    }
  });
};
