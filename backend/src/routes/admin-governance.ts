
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// =====================================================
// DECISION LOGS
// =====================================================

// Get all decisions with filtering
router.get('/decisions', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { projectId, status, search } = req.query;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const decisions = await prisma.decision.findMany({
      where,
      include: {
        project: { select: { title: true } },
        client: { select: { name: true, company: true } },
        approver: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ decisions });
  } catch (error) {
    console.error('Error fetching decisions:', error);
    res.status(500).json({ error: 'Failed to fetch decisions' });
  }
});

// =====================================================
// RAID REGISTER (Risks, Assumptions, Issues, Dependencies)
// =====================================================

// Get aggregated RAID log
router.get('/raid', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { projectId, type, search } = req.query; // type = 'Risk', 'Assumption', 'Issue', 'Dependency'

    // We can't query across 4 tables efficiently with one Prisma call if filtering by specific fields
    // But for a dashboard, we usually want all of them.

    // 1. Build generic filters where possible
    const baseWhere: any = {};
    if (projectId) baseWhere.projectId = projectId;
    
    // Search is tricky across 4 tables efficiently, we'll do simple per-table search
    const searchFilter = search ? {
        OR: [
            { title: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } }
        ]
    } : {};
    
    const tableWhere = { ...baseWhere, ...searchFilter };

    // 2. Fetch data based on requested type (or all)
    let risks: any[] = [], assumptions: any[] = [], issues: any[] = [], dependencies: any[] = [];

    const promises = [];

    if (!type || type === 'Risk') {
        promises.push(prisma.risk.findMany({
            where: tableWhere,
            include: { project: { select: { title: true } } },
            orderBy: { createdAt: 'desc' }
        }).then(data => risks = data));
    }

    if (!type || type === 'Assumption') {
        promises.push(prisma.assumption.findMany({
            where: tableWhere,
            include: { project: { select: { title: true } } },
            orderBy: { createdAt: 'desc' }
        }).then(data => assumptions = data));
    }

    if (!type || type === 'Issue') {
        promises.push(prisma.issue.findMany({
            where: tableWhere,
            include: { project: { select: { title: true } } },
            orderBy: { createdAt: 'desc' }
        }).then(data => issues = data));
    }

    if (!type || type === 'Dependency') {
        promises.push(prisma.dependency.findMany({
            where: tableWhere,
            include: { project: { select: { title: true } } },
            orderBy: { createdAt: 'desc' }
        }).then(data => dependencies = data));
    }

    await Promise.all(promises);

    // 3. Format response
    // We can return separate arrays, or a unified list with a 'type' field.
    // Unified list is better for sorting/mixing in a grid.
    
    const formatItem = (item: any, type: string) => ({
        ...item,
        type, 
        projectTitle: item.project?.title || 'Unknown Project'
    });

    const combined = [
        ...risks.map(i => formatItem(i, 'Risk')),
        ...assumptions.map(i => formatItem(i, 'Assumption')),
        ...issues.map(i => formatItem(i, 'Issue')),
        ...dependencies.map(i => formatItem(i, 'Dependency')),
    ];

    // Sort combined list by created date desc
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ 
        items: combined,
        counts: {
            risks: risks.length,
            assumptions: assumptions.length,
            issues: issues.length,
            dependencies: dependencies.length
        }
    });

  } catch (error) {
    console.error('Error fetching RAID log:', error);
    res.status(500).json({ error: 'Failed to fetch RAID log' });
  }
});

// =====================================================
// CHANGE CONTROL
// =====================================================

// Get all change requests
router.get('/changes', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const { projectId, status, search } = req.query;

        const where: any = {};
        if (projectId) where.projectId = projectId;
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        const changes = await prisma.changeRequest.findMany({
            where,
            include: {
                project: { select: { title: true } },
                client: { select: { name: true, company: true } },
                invoice: { select: { amount: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ changes });
    } catch (error) {
        console.error('Error fetching changes:', error);
        res.status(500).json({ error: 'Failed to fetch changes' });
    }
});

export default router;
