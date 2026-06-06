import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/rbac';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Public Tracking Route (Must be before auth middleware)
router.post('/track', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { referrer } = req.body;
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    
    // Simple device detection
    const device = /mobile/i.test(userAgent) ? 'mobile' : /tablet/i.test(userAgent) ? 'tablet' : 'desktop';
    const browser = /firefox/i.test(userAgent) ? 'Firefox' : /chrome/i.test(userAgent) ? 'Chrome' : /safari/i.test(userAgent) ? 'Safari' : 'Other';
    // OS detection omitted for brevity - defaulting to null or simple parse if needed
    
    // Optional: Get User ID if token present (manually verify to avoid requiring auth)
    let userId = undefined;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
       // We won't verify here to avoid overhead/errors, just tracking visit
    }

    await prisma.visit.create({
      data: {
        ip,
        referrer,
        device,
        browser,
      }
    });

    res.json({ success: true });
  } catch (error) {
    // Silent fail for tracking
    console.warn('Tracking error:', error);
    res.json({ success: false });
  }
});

// Middleware: Require Admin for subsequent routes
router.use(requireAuth, requireRole(['ADMIN']));

/**
 * GET /api/admin/analytics
 * Get high-level stats (Total Users, Consultations, Applications)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalUsers,
      totalConsultations,
      totalApplications,
      totalVisits
    ] = await Promise.all([
      prisma.user.count(),
      prisma.consultation.count(),
      prisma.jobApplication.count(),
      prisma.visit.count()
    ]);

    // Role Distribution
    const [clients, partners, investors, jobSeekers] = await Promise.all([
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.user.count({ where: { role: 'PARTNER' } }),
      prisma.user.count({ where: { role: 'INVESTOR' } }),
      prisma.user.count({ where: { role: 'JOB_SEEKER' } })
    ]);

    // Calculate Percentages for Pie Chart
    const total = clients + partners + investors + jobSeekers;
    const stats = {
      total_users: totalUsers,
      total_consultations: totalConsultations,
      total_applications: totalApplications,
      total_visits: totalVisits,
      // Distribution
      clients: Math.round((clients / total) * 100) || 0,
      partners: Math.round((partners / total) * 100) || 0,
      investors: Math.round((investors / total) * 100) || 0,
      job_seekers: Math.round((jobSeekers / total) * 100) || 0
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/analytics/traffic
 * Get traffic data (Visits)
 */
router.get('/traffic', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Recent 50 visits
    const recent = await prisma.visit.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ip: true,
        country: true,
        city: true,
        region: true,
        device: true,
        os: true,
        browser: true,
        referrer: true,
        createdAt: true
      }
    });

    // Aggregate by Day (Last 7 days)
    // Note: Raw query might be better for aggregation, but doing simple JS aggregation for now
    // to avoid DB-specific raw SQL complexities in this demo context.
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const visitsLast7Days = await prisma.visit.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: { createdAt: true }
    });

    // Group by Day
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trafficMap: Record<string, number> = {};
    
    // Initialize map
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = days[d.getDay()];
        trafficMap[dayName] = 0;
    }

    visitsLast7Days.forEach(v => {
      const dayName = days[v.createdAt.getDay()];
      if (trafficMap[dayName] !== undefined) {
        trafficMap[dayName]++;
      }
    });

    const trafficData = Object.entries(trafficMap).map(([name, visits]) => ({ name, visits }));

    // Group by Country
    const countryMap: Record<string, number> = {};
    recent.forEach(v => {
      const c = v.country || 'Unknown';
      countryMap[c] = (countryMap[c] || 0) + 1;
    });
    
    const countryData = Object.entries(countryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    res.json({
      total: recent.length, // total in this batch
      recent,
      byDay: trafficData,
      byCountry: countryData
    });

  } catch (error) {
    next(error);
  }
});

export default router;
