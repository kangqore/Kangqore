import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Global search
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { q, type = 'all', page = 1, limit = 10 } = req.query;

    if (!q || typeof q !== 'string') {
      throw createError('Search query is required', 400);
    }

    const userId = req.user!.id;
    const userRole = req.user!.role;
    const searchQuery = q.toLowerCase();
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const results: any = {
      projects: [],
      deliverables: [],
      tasks: [],
      users: [],
      leads: [],
      consultations: [],
      media: [],
      insights: []
    };

    // Helper for role filtering
    const clientFilter = userRole === 'ADMIN' ? {} : { clientId: userId };

    const searchPromises: Promise<any>[] = [];

    // 1. Search Projects
    if (type === 'all' || type === 'projects') {
      searchPromises.push(
        prisma.project.findMany({
          where: {
            ...clientFilter,
            OR: [
              { title: { contains: searchQuery, mode: 'insensitive' } },
              { description: { contains: searchQuery, mode: 'insensitive' } }
            ]
          },
          take, skip
        }).then(res => results.projects = res)
      );
    }

    // 2. Search Deliverables
    if (type === 'all' || type === 'deliverables') {
      searchPromises.push(
        prisma.deliverable.findMany({
          where: {
            ...clientFilter,
            OR: [
              { title: { contains: searchQuery, mode: 'insensitive' } },
              { description: { contains: searchQuery, mode: 'insensitive' } }
            ]
          },
          take, skip,
          include: { project: { select: { title: true } } }
        }).then(res => results.deliverables = res)
      );
    }

    // 3. Search Tasks
    if (type === 'all' || type === 'tasks') {
      searchPromises.push(
        prisma.task.findMany({
          where: {
            ...clientFilter,
            OR: [
              { title: { contains: searchQuery, mode: 'insensitive' } },
              { description: { contains: searchQuery, mode: 'insensitive' } }
            ]
          },
          take, skip,
          include: { project: { select: { title: true } } }
        }).then(res => results.tasks = res)
      );
    }

    // 4. Search Users (ADMIN ONLY)
    if (userRole === 'ADMIN' && (type === 'all' || type === 'users')) {
      searchPromises.push(
        prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { email: { contains: searchQuery, mode: 'insensitive' } },
              { company: { contains: searchQuery, mode: 'insensitive' } }
            ]
          },
          select: { id: true, name: true, email: true, role: true, company: true, status: true },
          take, skip
        }).then(res => results.users = res)
      );
    }

    // 5. Search Leads & Contact Messages (ADMIN ONLY)
    if (userRole === 'ADMIN' && (type === 'all' || type === 'leads')) {
      searchPromises.push(
        prisma.contact.findMany({
          where: {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { email: { contains: searchQuery, mode: 'insensitive' } },
              { subject: { contains: searchQuery, mode: 'insensitive' } },
              { message: { contains: searchQuery, mode: 'insensitive' } }
            ]
          },
          take, skip
        }).then(res => results.leads = res)
      );
    }

    // 6. Search Consultations (ADMIN ONLY)
    if (userRole === 'ADMIN' && (type === 'all' || type === 'consultations')) {
      searchPromises.push(
        prisma.consultation.findMany({
          where: {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { email: { contains: searchQuery, mode: 'insensitive' } },
              { service: { contains: searchQuery, mode: 'insensitive' } }
            ]
          },
          take, skip
        }).then(res => results.consultations = res)
      );
    }

    // 7. Search Media Files
    if (type === 'all' || type === 'media') {
       searchPromises.push(
        prisma.mediaFile.findMany({
          where: {
            ...clientFilter,
            OR: [
              { title: { contains: searchQuery, mode: 'insensitive' } },
              { mimeType: { contains: searchQuery, mode: 'insensitive' } }
            ]
          },
          take, skip
        }).then(res => results.media = res)
      );
    }

    // 8. Search Insights
    if (type === 'all' || type === 'insights') {
      searchPromises.push(
        prisma.insight.findMany({
          where: {
            OR: [
              { title: { contains: searchQuery, mode: 'insensitive' } },
              { content: { contains: searchQuery, mode: 'insensitive' } },
              { category: { contains: searchQuery, mode: 'insensitive' } }
            ]
          },
          take, skip,
          include: { author: { select: { name: true, company: true } } }
        }).then(res => results.insights = res)
      );
    }

    await Promise.all(searchPromises);

    const totalResults = Object.values(results).reduce((sum: number, arr: any) => sum + arr.length, 0);

    res.json({
      query: q,
      type,
      results,
      pagination: {
        page: parseInt(page as string),
        limit: take,
        total: totalResults
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
