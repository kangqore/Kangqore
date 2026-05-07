import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import Joi from 'joi';

const router = Router();

// Validation Schemas
const createContentSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  contentType: Joi.string().required(), // BLOG, CASE_STUDY, etc.
  content: Joi.string().required(),
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED').default('DRAFT'),
  excerpt: Joi.string().optional().allow(''),
  featuredImage: Joi.string().optional().allow(''),
  metaTitle: Joi.string().optional().allow(''),
  metaDesc: Joi.string().optional().allow(''),
  keywords: Joi.string().optional().allow(''),
  category: Joi.string().optional().allow(''),
  tags: Joi.string().optional().allow(''),
  author: Joi.string().optional().allow(''),
  metadata: Joi.object().optional()
});

const updateContentSchema = Joi.object({
  title: Joi.string().optional(),
  slug: Joi.string().optional(),
  contentType: Joi.string().optional(),
  content: Joi.string().optional(),
  status: Joi.string().valid('DRAFT', 'PUBLISHED', 'ARCHIVED').optional(),
  excerpt: Joi.string().optional().allow(''),
  featuredImage: Joi.string().optional().allow(''),
  metaTitle: Joi.string().optional().allow(''),
  metaDesc: Joi.string().optional().allow(''),
  keywords: Joi.string().optional().allow(''),
  category: Joi.string().optional().allow(''),
  tags: Joi.string().optional().allow(''),
  author: Joi.string().optional().allow(''),
  metadata: Joi.object().optional()
});

// =====================================================
// STATS ROUTES (must be before :id routes!)
// =====================================================

// Get Content Stats
router.get('/stats/overview', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const total = await prisma.content.count();
    
    const byType = await prisma.content.groupBy({
      by: ['contentType'],
      _count: { _all: true }
    });
    
    const byStatus = await prisma.content.groupBy({
      by: ['status'],
      _count: { _all: true }
    });

    res.json({
      total,
      byType: byType.reduce((acc, curr) => ({ ...acc, [curr.contentType]: curr._count._all }), {}),
      byStatus: byStatus.reduce((acc, curr) => ({ ...acc, [curr.status]: curr._count._all }), {})
    });
  } catch (error) {
    next(error);
  }
});

// =====================================================
// CRUD ROUTES
// =====================================================

// Create Content
router.post('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = createContentSchema.validate(req.body);
    if (error) throw createError(error.details[0].message, 400);

    const existing = await prisma.content.findUnique({
      where: { slug: value.slug }
    });
    if (existing) throw createError('Content with this slug already exists', 400);

    // Remove author string if present, as it conflicts with the author relation
    const { author, ...contentData } = value;

    const content = await prisma.content.create({
      data: {
        ...contentData,
        authorId: req.user!.id
      }
    });

    res.status(201).json(content);
  } catch (error) {
    next(error);
  }
});

// List Content (Admin)
router.get('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, type, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (type) where.contentType = String(type);
    if (status) where.status = String(status);
    
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
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { name: true } }
        }
      }),
      prisma.content.count({ where })
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
});

// Get One
router.get('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const content = await prisma.content.findUnique({
      where: { id: req.params.id },
      include: { author: { select: { name: true } } }
    });

    if (!content) throw createError('Content not found', 404);

    res.json(content);
  } catch (error) {
    next(error);
  }
});

// Update
router.put('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = updateContentSchema.validate(req.body);
    if (error) throw createError(error.details[0].message, 400);

    // Check slug uniqueness if changing
    if (value.slug) {
      const existing = await prisma.content.findFirst({
        where: { 
          slug: value.slug,
          id: { not: req.params.id }
        }
      });
      if (existing) throw createError('Content with this slug already exists', 400);
    }

    // Remove author from update data as it cannot be updated directly via this endpoint
    // and it's not a field on the model (it's a relation)
    const { author, ...updateData } = value;

    const content = await prisma.content.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json(content);
  } catch (error) {
    next(error);
  }
});

// Delete
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.content.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// =====================================================
// ANALYTICS ROUTES
// =====================================================

// Track a content view (public endpoint)
router.post('/track/view', async (req, res) => {
  try {
    const { contentId, referrer } = req.body;
    if (!contentId) {
      res.status(400).json({ error: 'contentId required' });
      return;
    }

    const viewerIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const device = /mobile/i.test(userAgent) ? 'mobile' : /tablet/i.test(userAgent) ? 'tablet' : 'desktop';
    const browser = /firefox/i.test(userAgent) ? 'Firefox' : /chrome/i.test(userAgent) ? 'Chrome' : /safari/i.test(userAgent) ? 'Safari' : 'Other';

    // Get userId if logged in
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (e) {}
    }

    await prisma.contentView.create({
      data: { contentId, userId, viewerIp, userAgent: userAgent.substring(0, 500), device, browser, referrer }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('View tracking error:', error);
    res.json({ success: false });
  }
});

// Track a content share (public endpoint)
router.post('/track/share', async (req, res) => {
  try {
    const { contentId, platform } = req.body;
    if (!contentId || !platform) {
      res.status(400).json({ error: 'contentId and platform required' });
      return;
    }

    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (e) {}
    }

    await prisma.contentShare.create({ data: { contentId, platform, userId } });
    res.json({ success: true });
  } catch (error) {
    console.error('Share tracking error:', error);
    res.json({ success: false });
  }
});

// Get content analytics summary (admin only)
router.get('/analytics/summary', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [totalViews, totalShares, viewsByDevice, sharesByPlatform, topViewed, topShared] = await Promise.all([
      prisma.contentView.count(),
      prisma.contentShare.count(),
      prisma.contentView.groupBy({ by: ['device'], _count: { _all: true } }),
      prisma.contentShare.groupBy({ by: ['platform'], _count: { _all: true } }),
      prisma.contentView.groupBy({ by: ['contentId'], _count: { _all: true }, orderBy: { _count: { contentId: 'desc' } }, take: 10 }),
      prisma.contentShare.groupBy({ by: ['contentId'], _count: { _all: true }, orderBy: { _count: { contentId: 'desc' } }, take: 10 })
    ]);

    // Get content details
    const topIds = [...new Set([...topViewed.map(v => v.contentId), ...topShared.map(s => s.contentId)])];
    const contents = await prisma.content.findMany({ where: { id: { in: topIds } }, select: { id: true, title: true, contentType: true } });
    const contentMap = Object.fromEntries(contents.map(c => [c.id, c]));

    res.json({
      totalViews,
      totalShares,
      byDevice: viewsByDevice.reduce((a, c) => ({ ...a, [c.device || 'unknown']: c._count._all }), {}),
      byPlatform: sharesByPlatform.reduce((a, c) => ({ ...a, [c.platform]: c._count._all }), {}),
      topViewed: topViewed.map(v => ({ ...contentMap[v.contentId], views: v._count._all })),
      topShared: topShared.map(s => ({ ...contentMap[s.contentId], shares: s._count._all }))
    });
  } catch (error) {
    next(error);
  }
});

// Get demographics (admin only)
router.get('/analytics/demographics', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const viewsWithUsers = await prisma.contentView.findMany({ where: { userId: { not: null } }, select: { userId: true } });
    const uniqueUserIds = [...new Set(viewsWithUsers.map(v => v.userId).filter(Boolean))] as string[];
    
    const users = await prisma.user.findMany({
      where: { id: { in: uniqueUserIds } },
      select: { role: true, age: true, gender: true, profession: true }
    });

    const anonymousCount = await prisma.contentView.count({ where: { userId: null } });

    const byRole: Record<string, number> = { VISITOR: anonymousCount };
    const byGender: Record<string, number> = { unknown: 0 };
    const byAgeGroup: Record<string, number> = { '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0, unknown: 0 };
    const byProfession: Record<string, number> = {};

    users.forEach(u => {
      byRole[u.role] = (byRole[u.role] || 0) + 1;
      byGender[u.gender || 'unknown'] = (byGender[u.gender || 'unknown'] || 0) + 1;
      
      if (u.age) {
        const group = u.age < 25 ? '18-24' : u.age < 35 ? '25-34' : u.age < 45 ? '35-44' : u.age < 55 ? '45-54' : '55+';
        byAgeGroup[group]++;
      } else {
        byAgeGroup.unknown++;
      }
      
      byProfession[u.profession || 'Not specified'] = (byProfession[u.profession || 'Not specified'] || 0) + 1;
    });

    res.json({
      totalViewers: uniqueUserIds.length + anonymousCount,
      registeredViewers: uniqueUserIds.length,
      anonymousViewers: anonymousCount,
      byRole,
      byGender,
      byAgeGroup,
      byProfession
    });
  } catch (error) {
    next(error);
  }
});

export default router;
