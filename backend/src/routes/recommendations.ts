import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { IntelligenceService } from '../services/intelligenceService';

const router = Router();
const prisma = new PrismaClient();

// GET /api/recommendations - Get personalized content recommendations
router.get('/', async (req: Request, res: Response) => {
  try {
    const { contentId, limit = '4' } = req.query;
    const userId = (req as any).user?.userId;
    const sessionId = req.headers['x-session-id'] as string;
    
    const maxResults = Math.min(parseInt(limit as string), 10);
    let recommendations: any[] = [];

    // Strategy 0: Intelligence Engine (Python AI)
    try {
      if (userId) {
        const aiRecommendations = await IntelligenceService.generateRecommendations(userId);
        if (aiRecommendations && aiRecommendations.recommendations && aiRecommendations.recommendations.length > 0) {
           // recommendations = aiRecommendations.recommendations; 
           // Note: Data structure might need mapping to match Content model
           // For now, we use the IDs to fetch full objects from DB to ensure validity
           const aiRecIds = aiRecommendations.recommendations.map((r: any) => r.content_id);
           const aiContent = await prisma.content.findMany({
             where: { id: { in: aiRecIds }, status: 'PUBLISHED' },
             select: {
                id: true, slug: true, title: true, contentType: true, excerpt: true, 
                featuredImage: true, createdAt: true, tags: true, 
                _count: { select: { views: true } }
             }
           });
           recommendations = aiContent;
        }
      }
    } catch (err) {
      console.warn('Intelligence Engine unavailable, falling back to DB logic');
    }
    
    // Fallback Strategies (1, 2, 3) executed if recommendations still shortage


    // Get current content details if contentId provided
    let currentContent: any = null;
    if (contentId) {
      currentContent = await prisma.content.findUnique({
        where: { id: contentId as string },
        select: { id: true, contentType: true, tags: true, category: true }
      });
    }

    // Strategy 1: Get similar content by tags/type
    if (currentContent) {
      const tags = currentContent.tags ? JSON.parse(currentContent.tags) : [];
      
      // Find content with matching tags or same type
      const similar = await prisma.content.findMany({
        where: {
          id: { not: currentContent.id },
          status: 'PUBLISHED',
          OR: [
            { contentType: currentContent.contentType },
            { category: currentContent.category }
          ]
        },
        select: {
          id: true,
          slug: true,
          title: true,
          contentType: true,
          excerpt: true,
          featuredImage: true,
          createdAt: true,
          tags: true,
          _count: { select: { views: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: maxResults * 2 // Get more to filter
      });

      // Score by tag overlap
      recommendations = similar.map(content => {
        const contentTags = content.tags ? JSON.parse(content.tags) : [];
        const tagOverlap = tags.filter((t: string) => contentTags.includes(t)).length;
        return { ...content, score: tagOverlap + (content._count?.views || 0) / 100 };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
    }

    // Strategy 2: Based on reading history (if user/session available)
    if (recommendations.length < maxResults && (userId || sessionId)) {
      const historyWhere: any = {};
      if (userId) historyWhere.userId = userId;
      else if (sessionId) historyWhere.sessionId = sessionId;

      const readHistory = await prisma.readingHistory.findMany({
        where: historyWhere,
        select: { contentId: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      const readIds = readHistory.map(h => h.contentId);
      const excludeIds = [currentContent?.id, ...readIds, ...recommendations.map(r => r.id)].filter(Boolean);

      // Get content types user has read
      const preferredTypes = await prisma.content.findMany({
        where: { id: { in: readIds } },
        select: { contentType: true }
      });
      const types = [...new Set(preferredTypes.map(p => p.contentType))];

      // Get similar to what they've read
      if (types.length > 0) {
        const fromHistory = await prisma.content.findMany({
          where: {
            id: { notIn: excludeIds },
            status: 'PUBLISHED',
            contentType: { in: types }
          },
          select: {
            id: true,
            slug: true,
            title: true,
            contentType: true,
            excerpt: true,
            featuredImage: true,
            createdAt: true,
            _count: { select: { views: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: maxResults - recommendations.length
        });

        recommendations = [...recommendations, ...fromHistory];
      }
    }

    // Strategy 3: Fallback to popular content
    if (recommendations.length < maxResults) {
      const excludeIds = [currentContent?.id, ...recommendations.map(r => r.id)].filter(Boolean);
      
      const popular = await prisma.content.findMany({
        where: {
          id: { notIn: excludeIds },
          status: 'PUBLISHED'
        },
        select: {
          id: true,
          slug: true,
          title: true,
          contentType: true,
          excerpt: true,
          featuredImage: true,
          createdAt: true,
          _count: { select: { views: true } }
        },
        orderBy: { views: { _count: 'desc' } },
        take: maxResults - recommendations.length
      });

      recommendations = [...recommendations, ...popular];
    }

    // Clean up response
    const result = recommendations.slice(0, maxResults).map(({ score, _count, ...content }) => ({
      ...content,
      views: _count?.views || 0
    }));

    res.json(result);
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// POST /api/recommendations/track - Track reading history
router.post('/track', async (req: Request, res: Response) => {
  try {
    const { contentId, duration, completed } = req.body;
    const userId = (req as any).user?.userId;
    const sessionId = req.headers['x-session-id'] as string || req.body.sessionId;

    if (!contentId) {
      return res.status(400).json({ error: 'contentId is required' });
    }

    // Check if content exists
    const content = await prisma.content.findUnique({
      where: { id: contentId }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Create or update reading history entry
    await prisma.readingHistory.create({
      data: {
        contentId,
        userId: userId || null,
        sessionId: sessionId || null,
        duration: duration || null,
        completed: completed || false
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Track reading error:', error);
    res.status(500).json({ error: 'Failed to track reading' });
  }
});

export default router;
