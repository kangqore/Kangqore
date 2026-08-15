import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';
import { IntelligenceService } from '../kangqore-view/awareness/IntelligenceService';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Client dashboard stats
router.get('/client/stats', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const [activeProjects, deliverables, pendingTasks] = await Promise.all([
      prisma.project.count({
        where: {
          clientId: userId,
          status: 'ACTIVE'
        }
      }),
      prisma.deliverable.count({
        where: {
          clientId: userId
        }
      }),
      prisma.task.count({
        where: {
          clientId: userId,
          status: 'todo'
        }
      })
    ]);

    res.json({
      activeProjects,
      deliverables,
      pendingTasks
    });
  } catch (error) {
    next(error);
  }
});

// Gap 31: Client Dashboard Summary (Translation Layer)
router.get('/client/summary', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        // 1. Fetch relevant projects for metrics
        const projects = await prisma.project.findMany({
            where: { clientId: userId, status: 'ACTIVE' },
            select: {
                budget: true,
                spend: true,
                progressConfidence: true,
                adminConfidenceScore: true,
                clientSentimentScore: true
            }
        });

        // 2. Health & Confidence Calculation
        const now = new Date();
        const [criticalRisks, highRisks, overdueTasks, nextDeliverable, actionItems] = await Promise.all([
            prisma.risk.count({
                where: { clientId: userId, status: 'OPEN', severity: 'CRITICAL', isClientVisible: true }
            }),
            prisma.risk.count({
                where: { clientId: userId, status: 'OPEN', severity: 'HIGH', isClientVisible: true }
            }),
            prisma.task.count({
                where: { clientId: userId, status: { not: 'done' }, dueDate: { lt: now } }
            }),
            prisma.deliverable.findFirst({
                where: { clientId: userId, status: { not: 'completed' } },
                orderBy: { dueDate: 'asc' },
                select: { title: true, dueDate: true }
            }),
            prisma.task.count({
                where: { clientId: userId, status: { not: 'done' }, title: { contains: '[ACTION]' } }
            })
        ]);

        let healthScore = 100 - (criticalRisks * 15) - (highRisks * 7) - (overdueTasks * 5);
        if (healthScore < 0) healthScore = 0;
        
        let healthStatus = 'On Track';
        if (healthScore < 85) healthStatus = 'Watch';
        if (healthScore < 65) healthStatus = 'At Risk';

        // Average Confidence
        const avgConfidence = projects.length > 0
            ? Math.round(projects.reduce((acc, p) => acc + (p.adminConfidenceScore || 90), 0) / projects.length)
            : 92;

        // 3. Financials (Real Aggregation)
        const totalBudget = projects.reduce((acc, p) => acc + Number(p.budget || 0), 0);
        const totalSpend = projects.reduce((acc, p) => acc + Number(p.spend || 0), 0);
        const budgetPercent = totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0;

        // 4. Next Action Logic
        let nextAction = 'Approve MVP Phase';
        let nextActionDue = '2 days';

        if (nextDeliverable) {
            nextAction = nextDeliverable.title;
            if (nextDeliverable.dueDate) {
                const diffTime = nextDeliverable.dueDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                nextActionDue = diffDays < 0 ? 'Overdue' : diffDays === 0 ? 'Due Today' : `${diffDays} days`;
            }
        }

        res.json({
            health: {
                score: healthScore,
                status: healthStatus,
                trend: 'stable'
            },
            timelineConfidence: avgConfidence,
            financials: {
                budgetUtilized: budgetPercent,
                totalSpend,
                totalBudget
            },
            nextAction: {
                title: nextAction,
                due: nextActionDue
            },
            actionsRequired: actionItems + highRisks
        });

    } catch (error) { next(error); }
});

// Client Dashboard: Projects
router.get('/client/projects', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await prisma.project.findMany({
      where: { clientId: req.user!.id, status: 'ACTIVE' },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        _count: { select: { tasks: true, deliverables: true } }
      }
    });
    res.json({ projects });
  } catch (error) { next(error); }
});

// Client Dashboard: Deliverables
router.get('/client/deliverables', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deliverables = await prisma.deliverable.findMany({
      where: { clientId: req.user!.id, status: { not: 'completed' } },
      orderBy: { updatedAt: 'desc' },
      take: 5
    });
    res.json({ deliverables });
  } catch (error) { next(error); }
});

// Client Dashboard: Documents (Mock/Placeholder using MediaFile)
router.get('/client/documents', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // In future, link to Project > Deliverables > Files
    const documents = await prisma.mediaFile.findMany({
      where: { uploadedBy: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    res.json({ documents });
  } catch (error) { next(error); }
});

// Client Dashboard: Updates (Mock for now)
router.get('/client/updates', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Mock updates
    const updates = [
      { id: 1, message: 'Welcome to your new dashboard!', created_at: new Date() },
      { id: 2, message: 'Your project "Website Redesign" is now active.', created_at: new Date(Date.now() - 86400000) }
    ];
    res.json({ updates });
  } catch (error) { next(error); }
});

// Client Dashboard: Tickets
router.get('/client/tickets', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const tickets = await prisma.ticket.findMany({
      where:   { clientId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, subject: true, category: true,
        priority: true, status: true,
        createdAt: true, updatedAt: true, assignedTo: true,
        _count: { select: { messages: true } },
      },
    });
    res.json({ tickets });
  } catch (error) { next(error); }
});

// Partner Dashboard: Stats
router.get('/partner/stats', authenticate, authorize(['PARTNER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const [tasks, completedCount, overdueCount] = await Promise.all([
      prisma.task.findMany({
        where:  { partnerId: userId },
        select: { projectId: true, status: true, dueDate: true },
      }),
      prisma.task.count({ where: { partnerId: userId, status: 'completed' } }),
      prisma.task.count({
        where: {
          partnerId: userId,
          dueDate:   { lt: new Date() },
          status:    { notIn: ['completed', 'approved'] },
        },
      }),
    ]);
    const assignedPrograms = new Set(tasks.map(t => t.projectId).filter(Boolean)).size;
    res.json({
      assigned_programs: assignedPrograms,
      tasks_completed:   completedCount,
      pending_deadlines: overdueCount,
      certifications:    0,
    });
  } catch (error) { next(error); }
});

// Partner Dashboard: Programs
router.get('/partner/programs', authenticate, authorize(['PARTNER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const tasks = await prisma.task.findMany({
      where:    { partnerId: userId },
      distinct: ['projectId'],
      select:   { projectId: true, status: true },
    });
    const projects = await prisma.project.findMany({
      where:  { id: { in: tasks.map(t => t.projectId) } },
      select: { id: true, title: true, status: true, clientId: true },
    });
    const clientIds = [...new Set(projects.map(p => p.clientId))];
    const clients   = await prisma.user.findMany({
      where:  { id: { in: clientIds } },
      select: { id: true, name: true, company: true },
    });
    const clientMap = Object.fromEntries(clients.map(c => [c.id, c]));
    res.json({
      programs: projects.map(p => ({
        id:          p.id,
        name:        p.title,
        status:      p.status,
        client_name: clientMap[p.clientId]?.company ?? clientMap[p.clientId]?.name ?? 'Unknown',
      })),
    });
  } catch (error) { next(error); }
});

// Partner Dashboard: Tasks
router.get('/partner/tasks', authenticate, authorize(['PARTNER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const tasks = await prisma.task.findMany({
      where:   { partnerId: userId, status: { not: 'completed' } },
      orderBy: { dueDate: 'asc' },
      take:    20,
      select:  { id: true, title: true, status: true, dueDate: true },
    });
    res.json({ tasks });
  } catch (error) { next(error); }
});

// Partner Dashboard: Documents
router.get('/partner/documents', authenticate, authorize(['PARTNER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Mock documents
    res.json({
      documents: [
        { id: 1, name: 'Partner Agreement 2024.pdf', type: 'Contract' },
        { id: 2, name: 'Technical Requirements.docx', type: 'Spec' }
      ]
    });
  } catch (error) { next(error); }
});

// Partner Dashboard: Certifications
router.get('/partner/certifications', authenticate, authorize(['PARTNER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Mock certs
    res.json({
      certifications: [
        { id: 1, name: 'Advanced Cloud Architect', expiry_date: new Date(Date.now() + 31536000000) }
      ]
    });
  } catch (error) { next(error); }
});

// Investor Dashboard: Stats (Mock for now)
router.get('/investor/stats', authenticate, authorize(['INVESTOR']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.json({
      revenue: 5200000,
      revenue_change: 12.5,
      growth_rate: 15.2,
      active_clients: 85,
      pipeline_value: 1200000,
      kpis: {
        customer_retention: '94%',
        burn_rate: '$45k/mo',
        runway: '18 months'
      }
    }); // Mock stats
  } catch (error) { next(error); }
});

// Investor Dashboard: Financials (Mock)
router.get('/investor/financials', authenticate, authorize(['INVESTOR']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.json({
        financials: [
            { period: '2025 Q1', revenue: 1500000, profit: 450000, margin: 30 },
            { period: '2024 Q4', revenue: 1400000, profit: 400000, margin: 28 },
            { period: '2024 Q3', revenue: 1200000, profit: 300000, margin: 25 },
            { period: '2024 Q2', revenue: 1100000, profit: 250000, margin: 22 }
        ]
    });
  } catch (error) { next(error); }
});

// Investor Dashboard: ESG (Mock)
router.get('/investor/esg', authenticate, authorize(['INVESTOR']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.json({
        esg_reports: [
            { id: 1, title: 'Annual Sustainability Report 2024', score: 92 },
            { id: 2, title: 'Diversity & Inclusion Metrics', score: 88 }
        ]
    });
  } catch (error) { next(error); }
});

// Investor Dashboard: Leadership Updates
router.get('/investor/leadership-updates', authenticate, authorize(['INVESTOR']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updates = await prisma.content.findMany({
      where: {
        contentType: 'leadership_update',
        status: 'published' // Ensure status matches what admin sets (lowercase 'published')
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        author: {
          select: { name: true }
        }
      }
    });

    // Map to frontend expectation
    const formattedUpdates = updates.map(u => ({
        id: u.id,
        title: u.title,
        date: u.createdAt,
        author: u.author.name,
        message: u.excerpt || u.content.substring(0, 100) + '...'
    }));

    res.json({ updates: formattedUpdates });
  } catch (error) { next(error); }
});

// Investor Dashboard: Board Materials
router.get('/investor/board-materials', authenticate, authorize(['INVESTOR']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
     const materials = await prisma.content.findMany({
      where: {
        contentType: 'board_material',
        status: 'published'
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    // Map to frontend expectation
    const formattedMaterials = materials.map(m => ({
        id: m.id,
        title: m.title,
        date: m.createdAt,
        // Use featuredImage as the file download link for now
        url: m.featuredImage, 
        type: 'Document'
    }));

    res.json({ materials: formattedMaterials });
  } catch (error) { next(error); }
});

// =====================================================
// JOB SEEKER DASHBOARD ROUTES
// =====================================================

// Job Seeker: Stats
router.get('/careers/stats', authenticate, authorize(['JOB_SEEKER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userEmail = req.user!.email;

    // 1. Applications Count
    const applications = await prisma.jobApplication.findMany({
      where: { email: userEmail }
    });
    
    // Group by status
    const stats = {
      applications_sent: applications.length,
      under_review: applications.filter(a => ['RECEIVED', 'REVIEWING', 'SHORTLISTED'].includes(a.status)).length,
      interviews_scheduled: applications.filter(a => a.status === 'INTERVIEWING').length,
      offers_received: applications.filter(a => a.status === 'OFFERED' || a.status === 'ACCEPTED').length
    };

    res.json(stats);
  } catch (error) { next(error); }
});

// Job Seeker: Applications
router.get('/careers/applications', authenticate, authorize(['JOB_SEEKER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userEmail = req.user!.email;

    // Use Prisma to find real applications
    const apps = await (prisma as any).jobApplication.findMany({
      where: { email: userEmail },
      include: { job: true }, // Include Job details
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const formattedApps = apps.map((app: any) => ({
      id: app.id,
      job_title: app.job?.title || app.position, // Use linked Job title or fallback
      company: 'Kangqore',
      status: app.status.toLowerCase(),
      applied_at: app.createdAt,
      updated_at: app.updatedAt
    }));

    res.json({ applications: formattedApps });
  } catch (error) { next(error); }
});

// Job Seeker: Jobs
router.get('/careers/jobs', authenticate, authorize(['JOB_SEEKER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const jobs = await (prisma as any).job.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ jobs });
  } catch (error) { next(error); }
});

// Job Seeker: Interviews
router.get('/careers/interviews', authenticate, authorize(['JOB_SEEKER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
     const interviews = await prisma.meeting.findMany({
        where: { jobSeekerId: req.user!.id } as any, 
        orderBy: { startTime: 'asc' },
        include: { 
           creator: { select: { name: true, company: true } } 
        }
     });

     const consultations = await prisma.consultation.findMany({
        where: { 
            email: req.user!.email,
            OR: [
                { service: { contains: 'Job', mode: 'insensitive' } },
                { service: { contains: 'Career', mode: 'insensitive' } },
                { service: { contains: 'Interview', mode: 'insensitive' } },
                { service: { contains: 'Hiring', mode: 'insensitive' } },
                { meetingMode: 'INTERVIEW' }
            ]
        },
        orderBy: { createdAt: 'desc' }
     });

     const formattedInterviews = interviews.map(m => ({
        id: m.id,
        job_title: m.title, 
        company: (m as any).creator?.company || 'Kangqore',
        interview_date: m.startTime,
        duration: Math.round((new Date(m.endTime).getTime() - new Date(m.startTime).getTime()) / 60000) + ' min',
        interview_type: m.type,
        meeting_mode: (m as any).meetingMode,
        location: (m as any).location,
        join_link: m.joinLink
     }));

    res.json({ interviews: formattedInterviews, consultations });
  } catch (error) { next(error); }
});

// Admin dashboard stats
// Job Seeker: Documents
router.get('/careers/documents', authenticate, authorize(['JOB_SEEKER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
     const userEmail = req.user!.email;
     const apps = await prisma.jobApplication.findMany({
        where: { email: userEmail },
        orderBy: { createdAt: 'desc' }
     });

     let docs: any[] = [];
     
     apps.forEach(app => {
        if (app.resumeUrl) {
           docs.push({ 
              id: `resume-${app.id}`, 
              title: `Resume - ${app.position}`, 
              type: 'Resume', 
              url: app.resumeUrl, 
              date: app.createdAt 
           });
        }
        if (app.coverLetter && app.coverLetter.startsWith('http')) {
             docs.push({ 
              id: `cover-${app.id}`, 
              title: `Cover Letter - ${app.position}`, 
              type: 'Cover Letter', 
              url: app.coverLetter, 
              date: app.createdAt 
           });
        }
        if (app.portfolio) {
             docs.push({ 
              id: `portfolio-${app.id}`, 
              title: `Portfolio - ${app.position}`, 
              type: 'Portfolio', 
              url: app.portfolio, 
              date: app.createdAt 
           });
        }
     });

    res.json(docs);
  } catch (error) { next(error); }

});

// Admin dashboard stats
router.get('/admin/stats', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const range = req.query.range as string || '30d';
    
    // Calculate date range
    let startDate = new Date();
    switch (range) {
      case '7d': startDate.setDate(startDate.getDate() - 7); break;
      case '30d': startDate.setMonth(startDate.getMonth() - 1); break;
      case '90d': startDate.setMonth(startDate.getMonth() - 3); break;
      case '12m': startDate.setFullYear(startDate.getFullYear() - 1); break;
      case 'all': startDate = new Date(0); break;
      default: startDate.setMonth(startDate.getMonth() - 1);
    }

    const [
      totalUsers,
      clientCount,
      partnerCount,
      investorCount,
      jobSeekerCount,
      adminCount,
      activeUsers,
      suspendedUsers,
      totalProjects,
      totalInsights,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.user.count({ where: { role: 'PARTNER' } }),
      prisma.user.count({ where: { role: 'INVESTOR' } }),
      prisma.user.count({ where: { role: 'JOB_SEEKER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { status: 'SUSPENDED' } }),
      prisma.project.count(),
      prisma.insight.count(),
      prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, name: true, email: true, role: true, company: true, createdAt: true, status: true }
      })
    ]);

    // Generate user growth data for chart
    const userGrowth: { name: string; value: number }[] = [];
    const now = new Date();
    
    // Group users by day/week/month depending on range
    if (range === '7d' || range === '30d') {
      // Daily data
      const days = range === '7d' ? 7 : 30;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const count = await prisma.user.count({
          where: {
            createdAt: { gte: dayStart, lte: dayEnd }
          }
        });
        
        userGrowth.push({
          name: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: count
        });
      }
    } else {
      // Monthly data for longer ranges
      const months = range === '90d' ? 3 : range === '12m' ? 12 : 6;
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
        
        const count = await prisma.user.count({
          where: {
            createdAt: { gte: monthStart, lte: monthEnd }
          }
        });
        
        userGrowth.push({
          name: monthStart.toLocaleDateString('en-US', { month: 'short' }),
          value: count
        });
      }
    }

    // Calculate growth rate (compare last period with previous)
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    const [lastMonthUsers, previousMonthUsers] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: lastMonthStart } } }),
      prisma.user.count({ where: { createdAt: { gte: twoMonthsAgo, lt: lastMonthStart } } })
    ]);
    
    const growthRate = previousMonthUsers > 0 
      ? Math.round(((lastMonthUsers - previousMonthUsers) / previousMonthUsers) * 100)
      : lastMonthUsers > 0 ? 100 : 0;

    res.json({
      total_users: totalUsers,
      totalUsers, // Keep for backward compatibility
      user_growth_rate: growthRate,
      user_growth: userGrowth,
      recent_signups: recentUsers,
      by_role: {
        clients: clientCount,
        partners: partnerCount,
        investors: investorCount,
        job_seekers: jobSeekerCount,
        admins: adminCount
      },
      by_status: {
        active: activeUsers,
        suspended: suspendedUsers,
        inactive: totalUsers - activeUsers - suspendedUsers
      },
      totalProjects,
      totalInsights,
      consultation_stats: {
        pending: await prisma.consultation.count({ where: { status: 'PENDING' } }),
        scheduled: await prisma.consultation.count({ where: { status: 'SCHEDULED' } }),
        completed: await prisma.consultation.count({ where: { status: 'COMPLETED' } }),
        rejected: await prisma.consultation.count({ where: { status: 'CANCELLED' } })
      },
      email_stats: [
        { name: 'Mon', sent: 120, received: 140 },
        { name: 'Tue', sent: 132, received: 120 },
        { name: 'Wed', sent: 101, received: 150 },
        { name: 'Thu', sent: 134, received: 110 },
        { name: 'Fri', sent: 190, received: 160 },
        { name: 'Sat', sent: 90, received: 80 },
        { name: 'Sun', sent: 80, received: 60 }
      ]
    });
  } catch (error) {
    next(error);
  }
});


// Get insights with analytics
router.get('/insights', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { category, limit = 10, offset = 0 } = req.query;

    // Try to get insights from Python service first
    try {
      const insights = await IntelligenceService.getInsights({
        category: category as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });
      res.json(insights);
    } catch (serviceError) {
      // Fallback to database if Python service is unavailable
      console.warn('Python service unavailable, falling back to database');
      
      const insights = await prisma.insight.findMany({
        where: category ? { category: category as string } : {},
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        include: {
          author: {
            select: {
              name: true,
              company: true
            }
          }
        }
      });

      res.json(insights);
    }
  } catch (error) {
    next(error);
  }
});

// Create insight (delegates to Python service)
router.post('/insights', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, category, content, tags } = req.body;
    const user = req.user!;

    const insight = await IntelligenceService.createInsight({
      title,
      category,
      content,
      tags: tags || '',
      authorId: user.id,
      authorName: user.name,
      authorCompany: user.company || ''
    });

    res.status(201).json(insight);
  } catch (error) {
    next(error);
  }
});

// Get analytics
router.get('/analytics', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const analytics = await IntelligenceService.getAnalytics({
      userId: req.user!.id,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string
    });

    res.json(analytics);
  } catch (error) {
    next(error);
  }
});

// Get recommendations
router.get('/recommendations', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const recommendations = await IntelligenceService.generateRecommendations(req.user!.id);
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
});

export default router;
