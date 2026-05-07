import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { cacheMiddleware } from '../middleware/cache';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Apply cache to all public GET routes (5 minutes default)
router.use(cacheMiddleware(300));

// Get all published content (public)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, type, category, tag, search, featured } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      status: 'PUBLISHED' // STRICTLY published content only
    };

    if (type) where.contentType = String(type);
    if (category) where.category = String(category);
    if (tag) where.tags = { contains: String(tag) };
    if (featured === 'true') where.featuredImage = { not: null }; // Example logic for featured
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { excerpt: { contains: String(search), mode: 'insensitive' } },
        { content: { contains: String(search), mode: 'insensitive' } },
        { category: { contains: String(search), mode: 'insensitive' } },
        { tags: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }, // or publishedAt if available
        include: {
          author: {
            select: {
              name: true,
              role: true,
              avatarUrl: true
            }
          }
        }
      }),
      prisma.content.count({ where })
    ]);

    // Format response to match frontend expectations if needed, or keep raw
    const formattedItems = items.map(item => ({
      ...item,
      // Ensure tags is an array if it's stored as comma-separated string
      tags: item.tags ? item.tags.split(',').map(t => t.trim()) : [],
      // Map contentType to human readable if needed, or frontend does it
    }));

    res.json({
      items: formattedItems,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    next(error);
  }
});

// Get single content by Slug (public)
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const content = await prisma.content.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            role: true,
            avatarUrl: true
          }
        }
      }
    });

    if (!content || content.status !== 'PUBLISHED') {
      throw createError('Content not found', 404);
    }

    // Format tags
    const formattedContent = {
      ...content,
      tags: content.tags ? content.tags.split(',').map(t => t.trim()) : []
    };

    res.json(formattedContent);
  } catch (error) {
    next(error);
  }
});

export default router;
