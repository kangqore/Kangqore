import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest, authenticate } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { AIService } from '../kangqore-view/kimmp/legacy/AiService';

const router = Router();

// Send a message to the chatbot
router.post('/query', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw createError('Message is required', 400);
    }

    const userId = req.user?.id;
    
    // Load existing conversation or create new one
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId }
      });

      // Verify ownership for logged-in users
      if (userId && conversation?.userId && conversation.userId !== userId) {
        throw createError('Unauthorized access to conversation', 403);
      }
    }

    // Get conversation history
    const messages = conversation?.messages as any[] || [];
    
    // Get AI response
    const aiResponse = await AIService.query({
      message,
      conversationHistory: messages,
      userId
    });

    // Add user message and AI response to history
    const updatedMessages = [
      ...messages,
      {
        role: 'user',
        content: message.trim(),
        timestamp: new Date().toISOString()
      },
      {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      }
    ];

    // Update or create conversation
    if (conversation) {
      conversation = await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          messages: updatedMessages,
          updatedAt: new Date()
        }
      });
    } else {
      conversation = await prisma.conversation.create({
        data: {
          userId: userId || null,
          messages: updatedMessages
        }
      });
    }

    res.json({
      conversationId: conversation.id,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get user's conversation history (protected route)
router.get('/conversations', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 20 // Limit to most recent 20 conversations
    });

    res.json({
      conversations: conversations.map(conv => ({
        id: conv.id,
        messageCount: (conv.messages as any[]).length,
        lastMessage: (conv.messages as any[])[(conv.messages as any[]).length - 1],
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Get specific conversation (protected route)
router.get('/conversations/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const conversation = await prisma.conversation.findUnique({
      where: { id }
    });

    if (!conversation) {
      throw createError('Conversation not found', 404);
    }

    if (conversation.userId !== userId) {
      throw createError('Unauthorized access to conversation', 403);
    }

    res.json({
      id: conversation.id,
      messages: conversation.messages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
    });
  } catch (error) {
    next(error);
  }
});

// Delete conversation (protected route)
router.delete('/conversations/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const conversation = await prisma.conversation.findUnique({
      where: { id }
    });

    if (!conversation) {
      throw createError('Conversation not found', 404);
    }

    if (conversation.userId !== userId) {
      throw createError('Unauthorized access to conversation', 403);
    }

    await prisma.conversation.delete({
      where: { id }
    });

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
