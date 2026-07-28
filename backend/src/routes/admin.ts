import { Router, Response, NextFunction } from 'express';
import * as os from 'os';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';
import { saveSubscription } from '../services/pushNotification.service';
import { Role } from '@prisma/client';
import { redisConnection } from '../lib/redis';
import { cacheService } from '../services/cache.service';
import { notifyNewEmail } from '../services/notificationService';
// import { generateToken } from '../utils/jwt'; // Removed incompatible utility
import { generateTokenPair } from '../services/token.service';
import { hashPassword } from '../utils/password';
import { generateCustomId } from '../utils/idGenerator';
import { ClientSignalsService } from '../services/ClientSignalsService';
import { ClientConfusionService } from '../services/ClientConfusionService';
import accountabilityService from '../services/AccountabilityService';
import projectProgressService from '../services/ProjectProgressService';
import { SystemLearning } from '../kangqore-immp/agents/systemLearning';
import { KimmpSystemDispatcher } from '../kangqore-immp/agents/systemDispatcher';
import { SignalLedger } from '../kangqore-immp/signals/signalLedger.service';
import { emailService } from '../services/email.service';
import { getRouterStats, getCircuitBreakerStatus } from '../kangqore-immp/llm/kimmpLLMRouter';
import { getRuntimeHealth, setProviderMaintenance } from '../kangqore-immp/runtime/waandaRuntime';
import { getRedisHealth } from '../lib/redis';
import { runBenchmarks, runBenchmarkComparison } from '../scripts/benchmarks/runBenchmarks';
import { runGate4 }  from '../scripts/gate4/gate4Runner';
import { runGate5 }  from '../scripts/gate5/gate5Runner';
import { runGate35 } from '../scripts/gate35/gate35Runner';
import { runGate6 }  from '../scripts/gate6/gate6Runner';
import { issueCertificate, approveCertificate, latestCertificate, listCertificates, revokeCertificate, computeCertificateDiff } from '../scripts/qef/qefCertificateService';
import { evaluateRelease, recordDeployment, recordOutcome, recordRollback, emergencyOverride, preflightCheck, listDecisions, listDeployments, listEnvironments } from '../scripts/rgs/rgsService';
import { AegisLedger } from '../kangqore-aegis/aegisLedger.service';
import { getFlightEvents } from '../scripts/flightRecorder/flightRecorderService';
import { computeGate8, createGate8Snapshot, getGate8History, computeForecast, computeRecommendations } from '../waanda/intelligence/gate8.service';
import { computeEMI, computeCOIG, computePulse, computeAndSaveDNA, getDNA, getActiveDefinition, upsertDefinition, computeCustomerZeroReport, computePlatformActivity, generateOperatingPulse, invalidatePulseCache, logAdoptionEvent, computeCoigWeekReport, computeOnboardingChecklist, listDeploymentHealth, computeRenewalRisk, generateQBR } from '../waanda/intelligence/enterpriseService';
import { assessProject, getProjectOps, sweepAllProjects, simulateTwin, getTwin } from '../waanda/intelligence/projectOps.service';
import { getLatestCoachingInsights, computeCoachingInsights, markInsightActed } from '../waanda/intelligence/enterpriseCoach.service';
import { createDecision, resolveDecision, listDecisions as listEnterpriseDecisions, getDecision, listPolicies, createPolicy, togglePolicy, deletePolicy, checkPolicy } from '../waanda/intelligence/decisionEngine.service';
import { listBlueprints, getBlueprint, generateBlueprint, importBlueprint, archiveBlueprint, activateBlueprint, validateBlueprint, addBlueprintGap, getBlueprintGaps, aggregateBlueprintGaps } from '../waanda/intelligence/blueprintService';
import { PackRegistry } from '../services/packRegistry.service';
import { simulateEnterpriseTwin, listTwinScenarios, compareScenarios } from '../waanda/intelligence/enterpriseTwin.service';
import { computeCapabilityProfiles, getCapabilityProfiles, getRuntimeCallStats } from '../kangqore-immp/runtime/waandaRuntimeIntelligence.service';

const clientSignalsService = new ClientSignalsService();
const clientConfusionService = new ClientConfusionService();

const router = Router();

// Get user statistics by role
// Clear system cache
router.post('/cache/clear', authenticate, authorize([Role.ADMIN]), (req, res) => {
  cacheService.flush();
  res.json({ message: 'Cache cleared successfully' });
});

// Get user statistics by role
router.get('/stats', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30)

    // Monthly buckets for the last 6 months
    const MONTHS = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return { label: d.toLocaleString('en-GB', { month: 'short' }), start: d, end: new Date(d.getFullYear(), d.getMonth() + 1, 1) }
    })

    const [
      total_users, clients, partners, investors, job_seekers, admins,
      totalProjects,
      totalInsights,
      consultPending, consultScheduled, consultCompleted, consultCancelled,
      newUsersThisMonth,
      ...monthCounts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CLIENT'    } }),
      prisma.user.count({ where: { role: 'PARTNER'   } }),
      prisma.user.count({ where: { role: 'INVESTOR'  } }),
      prisma.user.count({ where: { role: 'JOB_SEEKER'} }),
      prisma.user.count({ where: { role: 'ADMIN'     } }),
      prisma.project.count({ where: { status: { not: 'ARCHIVED' } } }),
      (prisma as any).kimmpSignal?.count().catch(() => 0) ?? Promise.resolve(0),
      prisma.consultation.count({ where: { status: 'PENDING'   } }),
      prisma.consultation.count({ where: { status: 'SCHEDULED' } }),
      prisma.consultation.count({ where: { status: 'COMPLETED' } }),
      prisma.consultation.count({ where: { status: 'CANCELLED' } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      ...MONTHS.map(m => prisma.user.count({ where: { createdAt: { gte: m.start, lt: m.end } } })),
    ])

    const prevUsers = total_users - newUsersThisMonth
    const user_growth_rate = prevUsers > 0 ? parseFloat(((newUsersThisMonth / prevUsers) * 100).toFixed(1)) : (total_users > 0 ? 100 : 0)

    res.json({
      total_users,
      totalProjects,
      totalInsights: Number(totalInsights),
      user_growth_rate,
      user_growth: MONTHS.map((m, i) => ({ name: m.label, value: Number(monthCounts[i] ?? 0) })),
      by_role: { clients, partners, investors, job_seekers, admins },
      consultation_stats: {
        pending:   consultPending,
        scheduled: consultScheduled,
        completed: consultCompleted,
        cancelled: consultCancelled,
      },
    })
  } catch (error) {
    next(error)
  }
});

// Get platform analytics
router.get('/analytics', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Calculate date for growth comparison (30 days ago)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      total_users,
      total_consultations,
      total_applications,
      new_users_last_30_days
    ] = await Promise.all([
      prisma.user.count(),
      prisma.consultation.count(),
      prisma.jobApplication.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } })
    ]);

    const previous_users = total_users - new_users_last_30_days;
    let growth_rate = 0;
    
    if (previous_users > 0) {
      growth_rate = (new_users_last_30_days / previous_users) * 100;
    } else if (total_users > 0) {
      growth_rate = 100;
    }

    res.json({
      total_users,
      total_consultations,
      total_applications,
      growth_rate: parseFloat(growth_rate.toFixed(1))
    });
  } catch (error) {
    next(error);
  }
});

// Get all users with pagination, sorting, and filtering
router.get('/users', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, search, role, status, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { company: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (role && role !== 'all') {
      where.role = role;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    // Execute query
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          customId: true,
          email: true,
          name: true,
          company: true,
          role: true,
          status: true,
          phone: true,
          lastLoginAt: true,
          createdAt: true,
          clientProfile: {
            select: {
              governanceRules: true,
              governanceRationale: true,
              governanceApprovedBy: true,
              governanceApprovedAt: true,
              rulesLastUpdated: true,
              rulesAcknowledgedAt: true,
              rulesAcknowledgedBy: true,
              industryDomain: true
            }
          },
          _count: {
            select: {
              projects: true,
              sessions: true,
              risks: { where: { status: 'OPEN' } },
              clientFeedbacks: true
            }
          }
        },
        orderBy: {
          [sortBy as string]: order
        },
        skip,
        take: limitNum
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get detailed user info
router.get('/users/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        sessions: {
          orderBy: { lastActive: 'desc' },
          take: 5
        },
        projects: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        oauthProviders: true,
        adminItems: true,
        _count: {
          select: {
            projects: true,
            tasks: true,
            conversations: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Don't modify the password field as it's not selected, but ensure safety
    const { password, ...safeUser } = user;
    
    res.json({ user: safeUser });
  } catch (error) {
    next(error);
  }
});

// Get system audit logs (GOVERNANCE AGGREGATION ONLY)
router.get('/audit-logs', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, userId, clientId } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Define governance-only actions
    const governanceActions = [
      'RISK_CREATED', 'RISK_UPDATED', 'RISK_ACCEPTED', 'RISK_ESCALATED',
      'DECISION_CREATED', 'DECISION_APPROVED', 'DECISION_REJECTED',
      'CHANGE_REQUEST_SUBMITTED', 'CHANGE_REQUEST_APPROVED', 'CHANGE_REQUEST_REJECTED',
      'DELIVERABLE_SUBMITTED', 'DELIVERABLE_ACCEPTED', 'DELIVERABLE_REJECTED'
    ];

    const where: any = {
      action: { in: governanceActions } // Only governance events
    };
    
    if (userId) {
      where.userId = userId as string;
    }

    if (clientId) {
      // Filter by client - need to parse from resource field or add clientId to AuditLog schema
      // For now, we'll allow filtering by user who is a client
      const clientUser = await prisma.user.findUnique({ where: { id: clientId as string } });
      if (clientUser && clientUser.role === 'CLIENT') {
        where.userId = clientId as string;
      }
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true,
              company: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.auditLog.count({ where })
    ]);

    res.json({
      logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
});

// =====================================================
// USER ACTION ENDPOINTS
// =====================================================

// Suspend a user
router.put('/users/:id/suspend', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.update({
      where: { id },
      data: { status: 'SUSPENDED' },
      select: { id: true, email: true, status: true }
    });
    
    res.json({ message: 'User suspended successfully', user });
  } catch (error) {
    next(error);
  }
});

// Activate a user
router.put('/users/:id/activate', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.update({
      where: { id },
      data: { status: 'ACTIVE' },
      select: { id: true, email: true, status: true }
    });
    
    res.json({ message: 'User activated successfully', user });
  } catch (error) {
    next(error);
  }
});

// Create a new user (Admin Onboarding)
router.post('/users', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, company, phone } = req.body;

    // Basic validation
    if (!email || !password || !name || !role) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check existing
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: `User already exists with role: ${existing.role}` });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const customId = await generateCustomId(role);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        company,
        role: role as any,
        customId,
        phone,
        status: 'ACTIVE'
      }
    });

    // If Client, ensure ClientProfile exists (Pillar 1)
    if (role === 'CLIENT') {
        await prisma.clientProfile.create({
            data: {
                userId: user.id,
                interestedServices: req.body.interestedServices || []
            }
        });
    }

    // Don't return password
    const { password: _, ...safeUser } = user;
    res.status(201).json({ user: safeUser, message: 'User created successfully' });

  } catch (error) {
    next(error);
  }
});

// Delete a user (soft delete by setting status to INACTIVE, or hard delete)
router.delete('/users/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { hard = false } = req.query;
    
    if (hard === 'true') {
      // Hard delete - remove from database
      await prisma.user.delete({ where: { id } });
      res.json({ message: 'User permanently deleted' });
    } else {
      // Soft delete - set status to INACTIVE
      await prisma.user.update({
        where: { id },
        data: { status: 'INACTIVE' }
      });
      res.json({ message: 'User marked as inactive' });
    }
  } catch (error) {
    next(error);
  }
});

// Impersonate a user (Login as User)
router.post('/users/:id/impersonate', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, email: true, name: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Generate compatible token pair for the target user
    const { accessToken } = generateTokenPair(user.id, user.role);

    res.json({ 
      message: `Impersonating ${user.name}`,
      token: accessToken,
      user
    });
  } catch (error) {
    next(error);
  }
});

// Toggle red flag on a user
router.put('/users/:id/flag', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Get current flag status
    const currentUser = await prisma.user.findUnique({ 
      where: { id },
      select: { isRedFlagged: true }
    });
    
    if (!currentUser) {
      res.status(404).json({ error: { message: 'User not found' } });
      return;
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: { isRedFlagged: !currentUser.isRedFlagged },
      select: { id: true, email: true, isRedFlagged: true }
    });
    
    res.json({ 
      message: user.isRedFlagged ? 'User flagged' : 'User unflagged', 
      user 
    });
  } catch (error) {
    next(error);
  }
});

// Update client governance rules (Legacy endpoint - use /governance-rules instead)
router.patch('/clients/:id/governance', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { governanceRules } = req.body; // HTML or Text string

    // Get ClientProfile linked to this User ID
    const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: id }
    });

    if (!clientProfile) {
        return res.status(404).json({ error: 'Client profile not found' });
    }

    const updated = await prisma.clientProfile.update({
        where: { id: clientProfile.id },
        data: {
            governanceRules,
            rulesLastUpdated: new Date(),
            // Reset acknowledgement if rules change (optional, stricter governance)
            rulesAcknowledgedAt: null, 
            rulesAcknowledgedBy: null
        }
    });

    res.json({ message: 'Governance rules updated', clientProfile: updated });
  } catch (error) { next(error); }
});

// Update client governance rules with full metadata (Enhanced)
router.patch('/clients/:id/governance-rules', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { governanceRules, governanceRationale } = req.body;
    const adminEmail = req.user!.email || 'admin@kangqore.com';

    // Get ClientProfile linked to this User ID
    const clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: id }
    });

    if (!clientProfile) {
        return res.status(404).json({ error: 'Client profile not found' });
    }

    const updated = await prisma.clientProfile.update({
        where: { id: clientProfile.id },
        data: {
            governanceRules,
            governanceRationale,
            governanceApprovedBy: adminEmail,
            governanceApprovedAt: new Date(),
            rulesLastUpdated: new Date(),
            // Reset acknowledgement when rules change (forces re-acknowledgement)
            rulesAcknowledgedAt: null, 
            rulesAcknowledgedBy: null
        }
    });

    res.json({ success: true, message: 'Governance rules updated with metadata', clientProfile: updated });
  } catch (error) { next(error); }
});


// =====================================================
// ADMIN PROFILE EDIT ENDPOINT
// =====================================================

// Admin can edit any user's profile
router.patch('/users/:id/profile', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      name, company, phone, location, purpose,
      companyEmail, employeeEmail, collegeEmail,
      linkedin, github, twitter, gmail,
      age, gender, profession,
      role, status, isRedFlagged
    } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      res.status(404).json({ error: { message: 'User not found' } });
      return;
    }

    // Build update data (only include provided fields)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (company !== undefined) updateData.company = company;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (purpose !== undefined) updateData.purpose = purpose;
    if (companyEmail !== undefined) updateData.companyEmail = companyEmail;
    if (employeeEmail !== undefined) updateData.employeeEmail = employeeEmail;
    if (collegeEmail !== undefined) updateData.collegeEmail = collegeEmail;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (github !== undefined) updateData.github = github;
    if (twitter !== undefined) updateData.twitter = twitter;
    if (gmail !== undefined) updateData.gmail = gmail;
    if (age !== undefined) updateData.age = age ? parseInt(age) : null;
    if (gender !== undefined) updateData.gender = gender;
    if (profession !== undefined) updateData.profession = profession;
    
    // Admin can change role, status, and flags
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;
    if (isRedFlagged !== undefined) updateData.isRedFlagged = isRedFlagged;
    
    // Gap 1: Authority Context
    if (req.body.authorityRole !== undefined) updateData.authorityRole = req.body.authorityRole;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        customId: true,
        email: true,
        name: true,
        company: true,
        phone: true,
        role: true,
        status: true,
        companyEmail: true,
        employeeEmail: true,
        collegeEmail: true,
        linkedin: true,
        github: true,
        twitter: true,
        gmail: true,
        location: true,
        purpose: true,
        avatarUrl: true,
        age: true,
        gender: true,
        profession: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ 
      message: 'User profile updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    next(error);
  }
});

// =====================================================
// ADMIN ITEMS ENDPOINTS (Spam, Trash, Important, etc.)
// =====================================================

// Get all admin items by type
router.get('/items', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { type, entityType } = req.query;
    
    const where: any = {};
    if (type) where.type = type;
    if (entityType) where.entityType = entityType;
    
    const items = await prisma.adminItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

// Add an item to a category (star, mark important, spam, trash, schedule)
router.post('/items', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { type, entityType, entityId, notes, scheduledAt } = req.body;
    
    const item = await prisma.adminItem.upsert({
      where: {
        type_entityType_entityId_adminId: {
          type,
          entityType,
          entityId,
          adminId: req.user!.id
        }
      },
      update: { notes, scheduledAt },
      create: {
        type,
        entityType,
        entityId,
        notes,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        adminId: req.user!.id
      }
    });
    
    res.json({ message: 'Item added', item });
  } catch (error) {
    next(error);
  }
});

// Remove an item from a category
router.delete('/items/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    await prisma.adminItem.delete({ where: { id } });
    
    res.json({ message: 'Item removed' });
  } catch (error) {
    next(error);
  }
});

// Get client intent signals
router.get('/client-signals/:clientId', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params;
    const signals = await clientSignalsService.getClientSignals(clientId);
    res.json(signals);
  } catch (error) {
    next(error);
  }
});

// Get client confusion & cognitive load metrics
router.get('/client-confusion/:clientId', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params;
    const metrics = await clientConfusionService.getClientConfusionMetrics(clientId);
    res.json(metrics);
  } catch (error) {
    next(error);
  }
});



// Get admin emails (system logs)


// =====================================================
// GENERIC EMAIL ACTIONS (Star, Spam, Trash, etc.)
// =====================================================

router.post('/email-actions', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { emailIds, action, value, folder } = req.body;

    if (!emailIds || !Array.isArray(emailIds) || emailIds.length === 0) {
      res.status(400).json({ error: 'emailIds array is required' });
      return;
    }

    const updateData: any = {};

    switch (action) {
      case 'star':
        updateData.isAdminStarred = value; // boolean
        break;
      case 'important':
        updateData.isAdminImportant = value; // boolean
        break;
      case 'move':
        if (folder) updateData.adminFolder = folder; // 'TRASH', 'SPAM', 'INBOX', 'ARCHIVE'
        break;
      case 'mark_read':
        updateData.isRead = value;
        break;
      default:
        res.status(400).json({ error: 'Invalid action' });
        return;
    }

    await prisma.emailLog.updateMany({
      where: { id: { in: emailIds } },
      data: updateData
    });

    res.json({ success: true, message: `Updated ${emailIds.length} emails` });
  } catch (error) {
    next(error);
  }
});

// =====================================================
// ADMIN PARTNER EMAILS (2-way messaging with partners)
// =====================================================

// GET /api/admin/partner-emails - Get all partner email conversations
router.get('/partner-emails', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Get all emails that have a partnerId (partner conversations)
    const emails = await prisma.emailLog.findMany({
      where: { 
        partnerId: { not: null }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        partner: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            company: true,
            customId: true
          } 
        }
      }
    });

    // Group by partnerId for conversation view
    const conversationMap = new Map();
    emails.forEach(email => {
      if (!email.partnerId) return;
      if (!conversationMap.has(email.partnerId)) {
        conversationMap.set(email.partnerId, {
          partner: email.partner,
          emails: [],
          lastMessage: null,
          unreadCount: 0
        });
      }
      const conv = conversationMap.get(email.partnerId);
      conv.emails.push(email);
      if (!conv.lastMessage || new Date(email.createdAt) > new Date(conv.lastMessage.createdAt)) {
        conv.lastMessage = email;
      }
      if (email.direction === 'inbound' && !email.isRead) {
        conv.unreadCount++;
      }
    });

    const conversations = Array.from(conversationMap.values());

    res.json({ 
      conversations,
      totalEmails: emails.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/partner-emails/:partnerId - Get thread with specific partner
router.get('/partner-emails/:partnerId', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { partnerId } = req.params;

    const emails = await prisma.emailLog.findMany({
      where: { partnerId },
      orderBy: { createdAt: 'asc' }, // Chronological order for thread view
      include: {
        partner: { 
          select: { 
            id: true, 
            name: true, 
            email: true,
            company: true 
          } 
        }
      }
    });

    // Mark inbound emails as read
    await prisma.emailLog.updateMany({
      where: { 
        partnerId,
        direction: 'inbound',
        isRead: false
      },
      data: { isRead: true }
    });

    const partner = emails[0]?.partner || null;

    res.json({ 
      partner,
      emails,
      threadCount: emails.length
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/partner-emails/reply - Admin sends reply to partner
router.post('/partner-emails/reply', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { partnerId, content, subject, replyToId, attachments } = req.body;

    if (!partnerId || !content) {
      res.status(400).json({ error: 'Partner ID and content are required' });
      return;
    }

    // Get partner info
    const partner = await prisma.user.findUnique({
      where: { id: partnerId },
      select: { name: true, email: true }
    });

    if (!partner) {
      res.status(404).json({ error: 'Partner not found' });
      return;
    }

    // Get threadId from replyTo email if provided
    let threadId = null;
    if (replyToId) {
      const replyToEmail = await prisma.emailLog.findUnique({
        where: { id: replyToId }
      });
      threadId = replyToEmail?.threadId || replyToEmail?.id;
    }

    // Create admin reply
    const newEmail = await prisma.emailLog.create({
      data: {
        subject: subject || 'Reply from Kangqore',
        from: 'admin@kangqore.com',
        to: partner.email || partner.name,
        body: content,
        preview: content.substring(0, 100),
        partnerId,
        threadId,
        replyToId,
        direction: 'outbound', // Admin -> Partner
        isRead: true, // Admin's own message is already "read"
        isUnread: false,
        attachments,
        hasAttachment: attachments && attachments.length > 0
      },
      include: {
        partner: { select: { id: true, name: true, email: true } }
      }
    });

    // Notify partner about new email
    await notifyNewEmail(partnerId, 'partner', newEmail.subject);

    res.status(201).json({ 
      success: true, 
      message: 'Reply sent to partner',
      email: newEmail 
    });
  } catch (error) {
    next(error);
  }
});

// =====================================================
// ADMIN CLIENT EMAILS
// =====================================================

router.get('/client-emails', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const emails = await prisma.emailLog.findMany({
      where: { clientId: { not: null } },
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, name: true, email: true, company: true } }
      }
    });
    // Grouping logic (simplified for brevity, similar to partner)
    const conversationMap = new Map();
    emails.forEach(email => {
      if (!email.clientId) return;
      if (!conversationMap.has(email.clientId)) {
        conversationMap.set(email.clientId, {
          user: email.client,
          emails: [],
          lastMessage: null,
          unreadCount: 0
        });
      }
      const conv = conversationMap.get(email.clientId);
      conv.emails.push(email);
      if (!conv.lastMessage || new Date(email.createdAt) > new Date(conv.lastMessage.createdAt)) {
        conv.lastMessage = email;
      }
      if (email.direction === 'inbound' && !email.isRead) conv.unreadCount++;
    });
    res.json({ conversations: Array.from(conversationMap.values()), totalEmails: emails.length });
  } catch (error) { next(error); }
});

router.get('/client-emails/:clientId', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params;
    const emails = await prisma.emailLog.findMany({
      where: { clientId },
      orderBy: { createdAt: 'asc' },
      include: { client: { select: { id: true, name: true, email: true, company: true } } }
    });
    await prisma.emailLog.updateMany({ where: { clientId, direction: 'inbound', isRead: false }, data: { isRead: true } });
    res.json({ user: emails[0]?.client, emails, threadCount: emails.length });
  } catch (error) { next(error); }
});

router.post('/client-emails/reply', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId, content, subject, replyToId, attachments } = req.body;
    if (!clientId || !content) return res.status(400).json({ error: 'Client ID and content required' });
    
    const client = await prisma.user.findUnique({ where: { id: clientId } });
    if (!client) return res.status(404).json({ error: 'Client not found' });

    let threadId = null;
    if (replyToId) {
        const replyToEmail = await prisma.emailLog.findUnique({ where: { id: replyToId } });
        threadId = replyToEmail?.threadId || replyToEmail?.id;
    }

    const newEmail = await prisma.emailLog.create({
      data: {
        subject: subject || 'Reply from Kangqore',
        from: 'admin@kangqore.com',
        to: client.email || client.name,
        body: content,
        preview: content.substring(0, 100),
        clientId,
        threadId,
        replyToId,
        direction: 'outbound',
        isRead: true, isUnread: false,
        attachments,
        hasAttachment: attachments && attachments.length > 0,
        
        // Gap 6: Immutable Notices
        isImmutable: req.body.isNotice || false,
        category: req.body.isNotice ? 'NOTICE' : 'GENERAL',

      },
      include: { client: { select: { id: true, name: true, email: true } } }
    });

    // Notify client about new email
    await notifyNewEmail(clientId, 'client', newEmail.subject);

    res.status(201).json({ success: true, message: 'Reply sent', email: newEmail });
  } catch (error) { next(error); }
});

// =====================================================
// CLIENT PORTAL INVITE
// =====================================================

router.post('/clients/:clientId/portal-invite', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params;
    const { contacts } = req.body as { contacts: Array<{ name: string; email: string }> };
    if (!contacts?.length) return res.status(400).json({ error: 'At least one contact is required' });

    const portalUrl = `${(process.env.CORS_ORIGINS || 'http://localhost:3001').split(',')[0]}/kangqore-view/login`;
    const adminUser = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { name: true } });
    const clientRecord = await prisma.user.findFirst({ where: { id: clientId }, select: { company: true, name: true } });
    const clientCompany = clientRecord?.company || clientRecord?.name || 'your company';

    const results: Array<{ email: string; status: 'created' | 'exists'; tempPassword?: string }> = [];

    for (const contact of contacts) {
      const existing = await prisma.user.findUnique({ where: { email: contact.email } });
      if (existing) {
        results.push({ email: contact.email, status: 'exists' });
        continue;
      }

      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase() + '!';
      const hashed = await hashPassword(tempPassword);
      const customId = await generateCustomId('CLIENT');

      await prisma.user.create({
        data: {
          email: contact.email,
          name: contact.name,
          password: hashed,
          role: 'CLIENT' as any,
          customId,
          status: 'ACTIVE',
          company: clientCompany,
        }
      });

      try {
        await emailService.sendPortalInviteEmail({
          to: contact.email,
          name: contact.name,
          tempPassword,
          portalUrl,
          invitedByName: adminUser?.name || 'Kangqore Admin',
          clientCompany,
        });
      } catch (emailErr) {
        // Email failure is non-fatal — account is created
      }

      results.push({ email: contact.email, status: 'created', tempPassword });
    }

    res.json({ results, portalUrl });
  } catch (error) { next(error); }
});

// =====================================================
// ADMIN INVESTOR EMAILS
// =====================================================

router.get('/investor-emails', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const emails = await prisma.emailLog.findMany({
      where: { investorId: { not: null } },
      orderBy: { createdAt: 'desc' },
      include: { investor: { select: { id: true, name: true, email: true, company: true } } }
    });
    const conversationMap = new Map();
    emails.forEach(email => {
      if (!email.investorId) return;
      if (!conversationMap.has(email.investorId)) {
        conversationMap.set(email.investorId, {
          user: email.investor,
          emails: [],
          lastMessage: null,
          unreadCount: 0
        });
      }
      const conv = conversationMap.get(email.investorId);
      conv.emails.push(email);
      if (!conv.lastMessage || new Date(email.createdAt) > new Date(conv.lastMessage.createdAt)) {
        conv.lastMessage = email;
      }
      if (email.direction === 'inbound' && !email.isRead) conv.unreadCount++;
    });
    res.json({ conversations: Array.from(conversationMap.values()), totalEmails: emails.length });
  } catch (error) { next(error); }
});

router.get('/investor-emails/:investorId', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { investorId } = req.params;
    const emails = await prisma.emailLog.findMany({
      where: { investorId },
      orderBy: { createdAt: 'asc' },
      include: { investor: { select: { id: true, name: true, email: true, company: true } } }
    });
    await prisma.emailLog.updateMany({ where: { investorId, direction: 'inbound', isRead: false }, data: { isRead: true } });
    res.json({ user: emails[0]?.investor, emails, threadCount: emails.length });
  } catch (error) { next(error); }
});

router.post('/investor-emails/reply', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { investorId, content, subject, replyToId, attachments } = req.body;
    if (!investorId || !content) return res.status(400).json({ error: 'Investor ID and content required' });
    
    const investor = await prisma.user.findUnique({ where: { id: investorId } });
    if (!investor) return res.status(404).json({ error: 'Investor not found' });

    let threadId = null;
    if (replyToId) {
        const replyToEmail = await prisma.emailLog.findUnique({ where: { id: replyToId } });
        threadId = replyToEmail?.threadId || replyToEmail?.id;
    }

    const newEmail = await prisma.emailLog.create({
      data: {
        subject: subject || 'Reply from Kangqore',
        from: 'admin@kangqore.com',
        to: investor.email || investor.name,
        body: content,
        preview: content.substring(0, 100),
        investorId,
        threadId,
        replyToId, direction: 'outbound', isRead: true, isUnread: false
      },
      include: { investor: { select: { id: true, name: true, email: true } } }
    });

    // Notify investor about new email
    await notifyNewEmail(investorId, 'investor', newEmail.subject);

    res.status(201).json({ success: true, message: 'Reply sent', email: newEmail });
  } catch (error) { next(error); }
});

// =====================================================
// ADMIN JOB SEEKER EMAILS
// =====================================================

router.get('/job-seeker-emails', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const emails = await prisma.emailLog.findMany({
      where: { jobSeekerId: { not: null } },
      orderBy: { createdAt: 'desc' },
      include: { jobSeeker: { select: { id: true, name: true, email: true } } }
    });
    const conversationMap = new Map();
    emails.forEach(email => {
      if (!email.jobSeekerId) return;
      if (!conversationMap.has(email.jobSeekerId)) {
        conversationMap.set(email.jobSeekerId, {
          user: email.jobSeeker,
          emails: [],
          lastMessage: null,
          unreadCount: 0
        });
      }
      const conv = conversationMap.get(email.jobSeekerId);
      conv.emails.push(email);
      if (!conv.lastMessage || new Date(email.createdAt) > new Date(conv.lastMessage.createdAt)) {
        conv.lastMessage = email;
      }
      if (email.direction === 'inbound' && !email.isRead) conv.unreadCount++;
    });
    res.json({ conversations: Array.from(conversationMap.values()), totalEmails: emails.length });
  } catch (error) { next(error); }
});

router.get('/job-seeker-emails/:jobSeekerId', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { jobSeekerId } = req.params;
    const emails = await prisma.emailLog.findMany({
      where: { jobSeekerId },
      orderBy: { createdAt: 'asc' },
      include: { jobSeeker: { select: { id: true, name: true, email: true } } }
    });
    await prisma.emailLog.updateMany({ where: { jobSeekerId, direction: 'inbound', isRead: false }, data: { isRead: true } });
    res.json({ user: emails[0]?.jobSeeker, emails, threadCount: emails.length });
  } catch (error) { next(error); }
});

router.post('/job-seeker-emails/reply', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { jobSeekerId, content, subject, replyToId, attachments } = req.body;
    if (!jobSeekerId || !content) return res.status(400).json({ error: 'Job Seeker ID and content required' });
    
    const jobSeeker = await prisma.user.findUnique({ where: { id: jobSeekerId } });
    if (!jobSeeker) return res.status(404).json({ error: 'Job Seeker not found' });

    let threadId = null;
    if (replyToId) {
        const replyToEmail = await prisma.emailLog.findUnique({ where: { id: replyToId } });
        threadId = replyToEmail?.threadId || replyToEmail?.id;
    }

    const newEmail = await prisma.emailLog.create({
      data: {
        subject: subject || 'Reply from Kangqore',
        from: 'hr@kangqore.com',
        to: jobSeeker.email || jobSeeker.name,
        body: content,
        preview: content.substring(0, 100),
        jobSeekerId,
        threadId,
        replyToId, direction: 'outbound', isRead: true, isUnread: false,
        attachments,
        hasAttachment: attachments && attachments.length > 0
      },
      include: { jobSeeker: { select: { id: true, name: true, email: true } } }
    });

    // Notify job seeker about new email
    await notifyNewEmail(jobSeekerId, 'careers', newEmail.subject);

    res.status(201).json({ success: true, message: 'Reply sent', email: newEmail });
  } catch (error) { next(error); }
});


// ============================================
// ACCOUNTABILITY LAYER ENDPOINTS
// ============================================

// Get project accountability ledger
router.get('/accountability/project/:projectId', authenticate, authorize([Role.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    
    const ledger = await accountabilityService.getProjectAccountabilityLedger(projectId);
    const metrics = await accountabilityService.getAccountabilityMetrics(projectId);
    
    res.json({ ledger, metrics });
  } catch (error) {
    next(error);
  }
});

// Get client accountability log
router.get('/accountability/client/:clientId', authenticate, authorize([Role.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params;
    
    const log = await accountabilityService.getClientAccountabilityLog(clientId);
    
    res.json({ log });
  } catch (error) {
    next(error);
  }
});

// Export accountability ledger as CSV
router.get('/accountability/project/:projectId/export', authenticate, authorize([Role.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    
    const ledger = await accountabilityService.getProjectAccountabilityLedger(projectId);
    
    // Build CSV
    const headers = ['Timestamp', 'Event Type', 'Category', 'User', 'Action', 'Subject', 'Impact', 'Note', 'IP Address'];
    const rows = ledger.map((event: any) => [
      new Date(event.timestamp).toISOString(),
      event.type,
      event.category,
      event.user,
      event.action,
      `"${event.subject.replace(/"/g, '""')}"`, // Escape quotes
      event.impact || '',
      event.note ? `"${event.note.replace(/"/g, '""')}"` : '',
      event.ipAddress || ''
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Set headers for download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="accountability-ledger-${projectId}-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

// ============================================
// CANONICAL ACCOUNTABILITY ROUTES
// ============================================

// Get Project Obligations
router.get('/accountability/project/:projectId/obligations', authenticate, authorize([Role.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query;
    
    // @ts-ignore - Enum import issue workaround
    const obligations = await accountabilityService.getProjectObligations(projectId, status);
    
    res.json({ obligations });
  } catch (error) {
    next(error);
  }
});

// Resolve Obligation
router.patch('/accountability/obligations/:id/resolve', authenticate, authorize([Role.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const obligation = await accountabilityService.resolveObligation(id);
    res.json({ obligation });
  } catch (error) {
    next(error);
  }
});

// Trigger Snapshot Generation (Manual)
router.post('/accountability/project/:projectId/snapshot', authenticate, authorize([Role.ADMIN]), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    // For admin triggers, we attribute to the first client found on project for simplicity in this MVP
    // Ideally passed in body
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const snapshot = await accountabilityService.generateDailySnapshot(projectId, project.clientId);
    res.json({ snapshot });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// ACCOUNTABILITY (Governance Layer)
// ==========================================

// Get overdue obligations (Admin Widget)
router.get('/accountability/obligations/overdue', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const obligations = await accountabilityService.getOverdueObligations();
    res.json({ obligations });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// PROJECT PROGRESS VALIDATION (Phase 12)
// ==========================================

// Auto-validate project progress from deliverables
router.post('/projects/:id/validate-progress', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id: projectId } = req.params;
    
    await projectProgressService.validateAndUpdateProgress(projectId);
    
    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        progress: true,
        progressCalculationMethod: true,
        progressConfidence: true,
        progressEvidence: true,
        progressLastValidated: true
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Progress auto-validated from deliverables',
      project: updatedProject 
    });
  } catch (error) {
    next(error);
  }
});

// Manually override project progress with justification
router.post('/projects/:id/override-progress', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id: projectId } = req.params;
    const { progress, reason } = req.body;
    const adminEmail = req.user!.email;
    
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({ error: 'Progress must be a number between 0 and 100' });
    }
    
    if (!reason || typeof reason !== 'string' || reason.trim().length < 10) {
      return res.status(400).json({ error: 'Override reason must be at least 10 characters' });
    }
    
    await projectProgressService.overrideProgress(projectId, progress, reason, adminEmail);
    
    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        progress: true,
        progressCalculationMethod: true,
        progressOverride: true,
        progressOverrideReason: true,
        progressLastValidated: true
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Progress manually overridden',
      project: updatedProject 
    });
  } catch (error) {
    next(error);
  }
});

// ─── Leads list ───────────────────────────────────────────────────────────────
// GET /api/admin/eqore/leads  — lead pipeline list for OS Leads module
router.get('/eqore/leads', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const limit  = Math.min(Number(req.query.limit)  || 200, 500)
    const offset = Number(req.query.offset) || 0
    const status = req.query.status as string | undefined

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    // Auto-seed strategic pipeline leads when DB is empty
    const existingCount = await prisma.eqoreLead.count()
    if (existingCount === 0) {
      const STRATEGIC_LEADS = [
        {
          convId: 'seed-conv-birla-001', sessionId: 'seed-session-birla-001',
          companyName: 'Birla Digital Labs', name: 'Aditya Birla', role: 'Chief Digital Officer',
          email: 'aditya@birladigitallabs.in', phone: '+91 98765 43210',
          leadScore: 95, buyingStage: 'negotiation', projectedValue: 2500000, pipelineWeight: 78,
          urgency: 'HIGH', leadCategory: 'Enterprise', primaryIntent: 'Enterprise OS deployment — WAANDA + AEGIS full stack',
          valueTier: 'ENTERPRISE', assignedOwnerName: 'Mahesh Kumar',
          problemStatement: 'Siloed operations across 6 BUs, no unified intelligence layer. Need OS-level visibility.',
          recommendedAction: 'Activate Blueprint Wizard — PS Pack configured for financial services arm.',
        },
        {
          convId: 'seed-conv-hdfc-001', sessionId: 'seed-session-hdfc-001',
          companyName: 'HDFC Bank Digital', name: 'Ritu Sharma', role: 'EVP — Digital Banking',
          email: 'ritu.sharma@hdfcbank.com', phone: '+91 22 6652 1000',
          leadScore: 88, buyingStage: 'proposal', projectedValue: 18000000, pipelineWeight: 62,
          urgency: 'HIGH', leadCategory: 'Enterprise', primaryIntent: 'FinTech Pack deployment — NPA monitoring + fraud detection OS',
          valueTier: 'ENTERPRISE_PLUS', assignedOwnerName: 'Mahesh Kumar',
          problemStatement: 'NPA ratio rising, manual fraud review bottleneck, regulatory reporting is 3-day lag.',
          recommendedAction: 'Propose FinTech Pack v1.0 — NPA Agent + FraudDetection Agent + Regulatory Agent.',
        },
        {
          convId: 'seed-conv-bajaj-001', sessionId: 'seed-session-bajaj-001',
          companyName: 'Bajaj Finserv Intelligence', name: 'Vikram Mehta', role: 'CTO',
          email: 'vikram.mehta@bajajfinserv.in', phone: '+91 20 3898 9999',
          leadScore: 76, buyingStage: 'qualified', projectedValue: 12000000, pipelineWeight: 48,
          urgency: 'MEDIUM', leadCategory: 'Enterprise', primaryIntent: 'Intelligence Hub — predictive lending + CLTV optimization',
          valueTier: 'ENTERPRISE', assignedOwnerName: 'Mahesh Kumar',
          problemStatement: 'Cross-sell ratio below industry benchmark, CLTV visibility gap across 14M customer base.',
          recommendedAction: 'Qualify FinTech Pack interest — CLTV + Cross-sell agents are key hooks.',
        },
      ]
      for (const l of STRATEGIC_LEADS) {
        await prisma.eqoreConversation.upsert({
          where:  { sessionId: l.sessionId },
          update: {},
          create: { id: l.convId, sessionId: l.sessionId, status: 'CLOSED', visitorType: 'ENTERPRISE_PROSPECT', sourcePage: '/kangqore-view/admin/leads' },
        })
        await prisma.eqoreLead.upsert({
          where:  { conversationId: l.convId },
          update: {},
          create: {
            conversationId: l.convId, sessionId: l.sessionId,
            companyName: l.companyName, name: l.name, role: l.role, email: l.email, phone: l.phone,
            leadScore: l.leadScore, buyingStage: l.buyingStage, projectedValue: l.projectedValue as any,
            pipelineWeight: l.pipelineWeight, urgency: l.urgency, leadCategory: l.leadCategory,
            primaryIntent: l.primaryIntent, valueTier: l.valueTier, assignedOwnerName: l.assignedOwnerName,
            problemStatement: l.problemStatement, recommendedAction: l.recommendedAction,
            status: 'QUALIFIED', leadQuality: 'STRATEGIC',
          },
        })
      }
    }

    const leads = await prisma.eqoreLead.findMany({
      where,
      orderBy: { leadScore: 'desc' },
      take:    limit,
      skip:    offset,
      select: {
        id: true, companyName: true, name: true, role: true, email: true, phone: true,
        leadScore: true, status: true, primaryIntent: true, website: true,
        sourcePage: true, buyingStage: true, urgency: true, projectedValue: true,
        pipelineWeight: true, valueTier: true, createdAt: true, updatedAt: true,
        assignedOwnerName: true, schedulingStatus: true, leadCategory: true,
        painPoints: true, problemStatement: true, recommendedAction: true,
        conversationId: true,
      },
    })

    // Map buyingStage → stage so the frontend toLead() picks it up correctly
    const mapped = leads.map(l => ({
      ...l,
      stage: l.buyingStage?.toLowerCase() ?? 'new',
      projectedValue: l.projectedValue ? Number(l.projectedValue) : 0,
    }))

    const total = await prisma.eqoreLead.count({ where })
    res.json({ leads: mapped, total, limit, offset })
  } catch (err) { next(err) }
})

// ─── Lead inline editing ───────────────────────────────────────────────────
// PATCH /api/admin/leads/:id  — update EqoreLead status and fields via JWT auth
router.patch('/leads/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, companyName, name, role, email, phone } = req.body;

    // Capture previous status for outcome tracking
    const prevLead = await prisma.eqoreLead.findUnique({
      where: { id }, select: { status: true, name: true, companyName: true },
    });
    const prevStatus  = prevLead?.status ?? ''
    const newStatus   = status ? status.toUpperCase() : prevStatus
    const leadLabel   = `${prevLead?.name ?? 'Unknown'} (${prevLead?.companyName ?? 'Unknown'})`

    const lead = await prisma.eqoreLead.update({
      where: { id },
      data: {
        ...(status      && { status: newStatus }),
        ...(companyName !== undefined && { companyName }),
        ...(name        !== undefined && { name }),
        ...(role        !== undefined && { role }),
        ...(email       !== undefined && { email }),
        ...(phone       !== undefined && { phone }),
        updatedAt: new Date(),
      },
    });

    res.json({ lead });

    // ── Outcome tracking + event triggers (fire-and-forget) ──────────────────
    if (status && newStatus !== prevStatus) {
      ;(async () => {
        try {
          const isWon  = newStatus === 'WON'  || newStatus === 'CONVERTED'
          const isLost = newStatus === 'LOST'  || newStatus === 'REJECTED' || newStatus === 'CHURNED'

          // 1. Outcome feedback: auto-rate recent LEAD_INTEL dispatches
          if (isWon || isLost) {
            const recentDispatches: any[] = await (prisma as any).kimmpSystemDispatch.findMany({
              where: {
                system:    'LEAD_INTEL',
                createdAt: { gte: new Date(Date.now() - 30 * 86_400_000) },
                feedback:  null,
              },
              orderBy: { createdAt: 'desc' },
              take: 3,
              select: { id: true },
            }).catch(() => [])

            for (const d of recentDispatches) {
              await SystemLearning.recordFeedback({
                dispatchId: d.id,
                feedback:   isWon ? 'ACCEPTED' : 'DISMISSED',
                correction: isLost
                  ? `Lead ${leadLabel} was lost (${newStatus}) — review scoring approach`
                  : undefined,
              }).catch(() => {})
            }

            // Emit outcome signal
            await SignalLedger.record({
              sourceModule:   'lead-intelligence',
              signalType:     isWon ? 'lead.outcome.won' : 'lead.outcome.lost',
              signalCategory: isWon ? 'OPPORTUNITY' : 'RISK',
              signalValue:    `Lead ${leadLabel} → ${newStatus}`,
              severity:       isWon ? 'LOW' : 'MODERATE',
              confidence:     1,
              metadata:       { leadId: id, previousStatus: prevStatus },
            }).catch(() => {})
          }

          // 1b. Adoption Intelligence — log decision event for every status change
          const adoptionType = (isWon || isLost) ? 'DECISION_ACCEPT' : 'WORKFLOW_TRIGGER'
          logAdoptionEvent(adoptionType, (req as any).user?.id, 'lead', id, {
            fromStatus: prevStatus, toStatus: newStatus, entityLabel: leadLabel,
          }).catch(() => {})

          // 2. Event triggers: fire the right system based on status change
          const userId = req.user?.userId

          if (isWon) {
            // Deal won → trigger all systems with win context
            KimmpSystemDispatcher.triggerLoop({
              trigger: 'event.deal.won',
              input:   `Deal won: ${leadLabel} has converted to a client. Analyse what worked and update our playbooks accordingly.`,
              userId,
            }).catch(() => {})

          } else if (isLost) {
            // Deal lost → SENTINEL post-mortem
            KimmpSystemDispatcher.run('SENTINEL', {
              trigger: 'event.deal.lost',
              input:   `Deal lost: ${leadLabel} status moved to ${newStatus}. Conduct a post-mortem — what went wrong and what risk signals did we miss?`,
              userId,
            }).catch(() => {})

          } else if (['CONTACTED', 'QUALIFIED', 'PROPOSAL'].includes(newStatus)) {
            // Pipeline progression → LEAD_INTEL
            KimmpSystemDispatcher.run('LEAD_INTEL', {
              trigger: `event.lead.${newStatus.toLowerCase()}`,
              input:   `Lead ${leadLabel} moved to ${newStatus}. Assess conversion probability and recommended next actions.`,
              userId,
            }).catch(() => {})
          }

        } catch (err: any) {
          // Silent — never break the response
        }
      })()
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/leads/:id
router.delete('/leads/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await prisma.eqoreLead.delete({ where: { id } })
    res.json({ message: 'Lead deleted' })
  } catch (error) {
    next(error)
  }
})

// =====================================================
// ADMIN INVESTORS — list + updates
// =====================================================

/**
 * GET /api/admin/investors
 * Returns all INVESTOR-role users for the admin investors module.
 */
router.get('/investors', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const investors = await prisma.user.findMany({
      where: { role: 'INVESTOR' },
      select: {
        id: true, name: true, email: true, company: true,
        phone: true, status: true, createdAt: true, lastLoginAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ investors });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/investors/updates
 * Returns all InvestorUpdate records (announcements sent to investors).
 */
router.get('/investors/updates', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updates = await prisma.investorUpdate.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ updates });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/investors/updates
 * Create a new investor update / announcement.
 */
router.post('/investors/updates', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, type = 'announcement', isPublic = true } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'title and content are required' });
    }
    const update = await prisma.investorUpdate.create({
      data: { title, content, type, isPublic },
    });
    res.status(201).json({ update });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/financial-kpis
 * Real-time financial KPIs from Invoice, Contract, Project tables.
 */
router.get('/financial-kpis', authenticate, authorize([Role.ADMIN]), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    const [paidMTD, paidLastMonth, contractTotals, projectStats, invoiceGroups, onTimeCount, budgetAgg] = await Promise.all([
      prisma.invoice.aggregate({
        where: { status: 'PAID', paidAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { status: 'PAID', paidAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        _sum: { amount: true },
      }),
      prisma.contract.aggregate({
        where: { status: 'ACTIVE' },
        _sum: { value: true },
        _count: { id: true },
      }),
      prisma.project.aggregate({
        where: { status: 'ACTIVE' },
        _count: true,
        _sum: { budget: true, spend: true },
      }),
      prisma.invoice.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.project.count({
        where: { status: 'ACTIVE', health: { gte: 70 } },
      }),
      prisma.project.aggregate({
        where: { status: 'ACTIVE' },
        _sum: { budget: true },
      }),
    ])

    const revenueMTD = Number(paidMTD._sum.amount ?? 0)
    const revenueLastMonth = Number(paidLastMonth._sum.amount ?? 0)
    const activeContractValue = Number(contractTotals._sum.value ?? 0)
    const arr = activeContractValue || revenueMTD * 12

    const statusMap: Record<string, number> = {}
    for (const g of invoiceGroups) statusMap[g.status] = g._count.id

    res.json({
      revenueMTD,
      revenueLastMonth,
      arr,
      activeContracts: contractTotals._count.id,
      activeProjects: projectStats._count,
      totalBudget: Number(projectStats._sum.budget ?? 0),
      totalSpend: Number(projectStats._sum.spend ?? 0),
      pendingInvoices: statusMap['SENT'] ?? 0,
      overdueInvoices: statusMap['OVERDUE'] ?? 0,
      draftInvoices: statusMap['DRAFT'] ?? 0,
      onTimeProjectPct: projectStats._count > 0 ? Math.round((onTimeCount / projectStats._count) * 100) : 0,
      pipelineValue: Number(budgetAgg._sum.budget ?? 0),
      mrrDeltaPct: revenueMTD > 0 && revenueLastMonth > 0
        ? Math.round(((revenueMTD - revenueLastMonth) / revenueLastMonth) * 100)
        : 0,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/admin/health-deep
 * Live health check: DB, Redis, KIMMP engine.
 */
router.get('/health-deep', authenticate, authorize([Role.ADMIN]), async (_req: AuthenticatedRequest, res: Response) => {
  const services: Array<{ service: string; status: string; latencyMs?: number }> = []

  services.push({ service: 'API Core', status: 'ONLINE' })
  services.push({ service: 'Auth Service', status: 'ACTIVE' })

  const dbStart = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    services.push({ service: 'DB Postgres', status: 'HEALTHY', latencyMs: Date.now() - dbStart })
  } catch {
    services.push({ service: 'DB Postgres', status: 'OFFLINE', latencyMs: Date.now() - dbStart })
  }

  const redisStart = Date.now()
  try {
    await redisConnection.ping()
    services.push({ service: 'Redis Cache', status: 'ACTIVE', latencyMs: Date.now() - redisStart })
  } catch {
    services.push({ service: 'Redis Cache', status: 'OFFLINE', latencyMs: Date.now() - redisStart })
  }

  try {
    await (prisma as any).kimmpSignal.count()
    services.push({ service: 'KIMMP Engine', status: 'RUNNING' })
  } catch {
    services.push({ service: 'KIMMP Engine', status: 'DEGRADED' })
  }

  services.push({ service: 'Socket.io', status: 'LIVE' })

  // Real OS metrics
  const totalMem = os.totalmem()
  const freeMem  = os.freemem()
  const ramPct   = Math.round(((totalMem - freeMem) / totalMem) * 100)
  const loadAvg  = os.loadavg()[0]                          // 1-min load average
  const cpuCount = os.cpus().length
  const cpuPct   = Math.min(99, Math.round((loadAvg / cpuCount) * 100))
  const onlineCount = services.filter(s => ['ONLINE','ACTIVE','HEALTHY','RUNNING','LIVE'].includes(s.status)).length
  const healthPct   = Math.round((onlineCount / services.length) * 100)

  res.json({
    services,
    checkedAt: new Date().toISOString(),
    system: { cpu: cpuPct, ram: ramPct, network: 0, healthPct },
  })
})

// ─── Quick Create: Lead (Contact) ─────────────────────────────────────────────
router.post('/contacts', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, organization, subject, message } = req.body ?? {}
    if (!name || typeof name !== 'string') return res.status(400).json({ error: '`name` is required' })
    if (!email || typeof email !== 'string') return res.status(400).json({ error: '`email` is required' })
    const contact = await prisma.contact.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() ?? null,
        organization: organization?.trim() ?? null,
        subject: subject?.trim() ?? null,
        message: message?.trim() ?? '(Created via admin)',
        source: 'ADMIN',
        status: 'NEW',
      },
    })
    res.status(201).json({ contact })
  } catch (err) { next(err) }
})

// ─── Quick Create: Project ─────────────────────────────────────────────────────
router.post('/projects', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, clientId, description, dueDate, category } = req.body ?? {}
    if (!title || typeof title !== 'string') return res.status(400).json({ error: '`title` is required' })
    if (!clientId || typeof clientId !== 'string') return res.status(400).json({ error: '`clientId` is required' })
    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        clientId,
        description: description?.trim() ?? null,
        dueDate: dueDate ? new Date(dueDate) : null,
        category: category?.trim() ?? 'Transformation',
        status: 'ACTIVE',
      },
    })
    res.status(201).json({ project })
  } catch (err) { next(err) }
})

// ─── KIMMP: Synthesise live insights from operational data ────────────────────
//
// Returns an array shaped for the frontend `toInsight()` mapper.
// Each insight has: id, category, priority, title, summary, content,
// action, module, confidence, impact.
//
// Signal sources:
//   Ticket (open P1/P2)  → risk / ops
//   Invoice (overdue)    → revenue
//   ClientCRM (health)   → risk
//   Contact (new leads)  → opportunity
//   Project (overdue)    → ops
//
router.get('/kangqore-immp/insights', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
      openTickets,
      overdueInvoices,
      atRiskClients,
      newLeads,
      overdueProjects,
    ] = await Promise.all([
      prisma.ticket.findMany({
        where: { status: { in: ['open', 'pending'] } },
        select: { id: true, priority: true, subject: true, category: true, createdAt: true },
      }),
      prisma.invoice.findMany({
        where: { dueDate: { lt: now }, status: { notIn: ['PAID', 'CANCELLED'] } },
        select: { id: true, amount: true, currency: true, dueDate: true, invoiceNumber: true },
      }),
      (prisma as any).clientCRM?.findMany({
        where: { health: { in: ['at-risk', 'critical'] }, status: 'active' },
        select: { id: true, name: true, health: true, arr: true, satisfactionScore: true },
      }).catch(() => []) as Promise<any[]>,
      prisma.contact.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { id: true, name: true, status: true, createdAt: true },
      }),
      prisma.project.findMany({
        where: { status: 'ACTIVE', dueDate: { lt: now } },
        select: { id: true, title: true, status: true, dueDate: true },
      }),
    ])

    const insights: Record<string, unknown>[] = []

    // ── P1/P2 tickets ──────────────────────────────────────────────────────
    const criticalTickets = openTickets.filter((t: any) => t.priority?.toLowerCase() === 'critical' || t.priority?.toLowerCase() === 'p1')
    const highTickets     = openTickets.filter((t: any) => t.priority?.toLowerCase() === 'high'     || t.priority?.toLowerCase() === 'p2')

    if (criticalTickets.length > 0) {
      insights.push({
        id:         `tickets-critical-${criticalTickets.length}`,
        category:   'risk',
        priority:   'critical',
        title:      `${criticalTickets.length} critical support ticket${criticalTickets.length > 1 ? 's' : ''} open`,
        summary:    `${criticalTickets.length} P1 ticket${criticalTickets.length > 1 ? 's require' : ' requires'} immediate attention. Unresolved critical issues directly impact client satisfaction and SLA compliance.`,
        content:    `Critical tickets: ${criticalTickets.map((t: any) => t.subject).join('; ')}.`,
        action:     'Assign a senior resource to each critical ticket and update the client within 1 hour.',
        module:     'Clients',
        confidence: 100,
        impact:     'High',
        createdAt:  now.toISOString(),
      })
    }

    if (highTickets.length > 0) {
      insights.push({
        id:         `tickets-high-${highTickets.length}`,
        category:   'ops',
        priority:   highTickets.length >= 5 ? 'high' : 'medium',
        title:      `${highTickets.length} high-priority ticket${highTickets.length > 1 ? 's' : ''} awaiting resolution`,
        summary:    `${highTickets.length} P2 ticket${highTickets.length > 1 ? 's are' : ' is'} open. Sustained high-ticket volume can indicate systemic product or delivery issues.`,
        content:    `High-priority tickets: ${highTickets.slice(0, 5).map((t: any) => t.subject).join('; ')}${highTickets.length > 5 ? '…' : ''}.`,
        action:     'Review ticket queue and ensure each P2 has an assigned owner with a resolution ETA.',
        module:     'Clients',
        confidence: 95,
        impact:     'Medium',
        createdAt:  now.toISOString(),
      })
    }

    if (openTickets.length === 0) {
      insights.push({
        id:         'tickets-clear',
        category:   'ops',
        priority:   'low',
        title:      'Support queue clear — no open tickets',
        summary:    'All client support tickets are resolved. This is a positive signal for service delivery quality.',
        content:    'Zero open tickets across all clients. Maintain this state by proactively monitoring client usage.',
        action:     'Consider proactive check-in calls with top clients to surface issues before they become tickets.',
        module:     'Clients',
        confidence: 100,
        impact:     'Low',
        createdAt:  now.toISOString(),
      })
    }

    // ── Overdue invoices ───────────────────────────────────────────────────
    if (overdueInvoices.length > 0) {
      const totalOverdue = overdueInvoices.reduce((sum: number, inv: any) => sum + Number(inv.amount), 0)
      const currency = overdueInvoices[0]?.currency ?? 'USD'
      const oldest   = overdueInvoices.reduce((a: any, b: any) => a.dueDate < b.dueDate ? a : b)
      const daysPast = Math.floor((now.getTime() - new Date(oldest.dueDate).getTime()) / (24 * 60 * 60 * 1000))
      insights.push({
        id:         `invoices-overdue-${overdueInvoices.length}`,
        category:   'revenue',
        priority:   totalOverdue > 10000 ? 'critical' : overdueInvoices.length >= 3 ? 'high' : 'medium',
        title:      `${overdueInvoices.length} overdue invoice${overdueInvoices.length > 1 ? 's' : ''} — ${currency} ${totalOverdue.toLocaleString()} outstanding`,
        summary:    `${overdueInvoices.length} invoice${overdueInvoices.length > 1 ? 's' : ''} past due date, totalling ${currency} ${totalOverdue.toLocaleString()}. Oldest invoice is ${daysPast} days overdue.`,
        content:    `Outstanding invoices: ${overdueInvoices.map((inv: any) => `${inv.invoiceNumber} (${inv.currency} ${Number(inv.amount).toLocaleString()})`).join(', ')}.`,
        action:     'Send overdue notice to all clients with outstanding invoices. Escalate invoices over 30 days to finance lead.',
        module:     'Finance',
        confidence: 99,
        impact:     'High',
        createdAt:  now.toISOString(),
      })
    }

    // ── At-risk clients ────────────────────────────────────────────────────
    if (atRiskClients.length > 0) {
      const criticalClients = atRiskClients.filter((c: any) => c.health === 'critical')
      const atRisk          = atRiskClients.filter((c: any) => c.health === 'at-risk')
      const totalARR        = atRiskClients.reduce((sum: number, c: any) => sum + (c.arr ?? 0), 0)
      insights.push({
        id:         `clients-health-${atRiskClients.length}`,
        category:   'risk',
        priority:   criticalClients.length > 0 ? 'critical' : 'high',
        title:      `${atRiskClients.length} client${atRiskClients.length > 1 ? 's' : ''} at risk — £${(totalARR / 1000).toFixed(0)}k ARR exposed`,
        summary:    `${criticalClients.length} critical and ${atRisk.length} at-risk client${atRiskClients.length > 1 ? 's' : ''} detected. Combined ARR at risk: £${totalARR.toLocaleString()}.`,
        content:    `At-risk clients: ${atRiskClients.map((c: any) => `${c.name} (${c.health}, score: ${c.satisfactionScore})`).join('; ')}.`,
        action:     'Schedule retention calls with all at-risk clients within 48 hours. Prepare QBR decks for critical accounts.',
        module:     'Clients',
        confidence: 87,
        impact:     'Critical',
        createdAt:  now.toISOString(),
      })
    }

    // ── New leads ─────────────────────────────────────────────────────────
    if (newLeads.length > 0) {
      insights.push({
        id:         `leads-new-${newLeads.length}`,
        category:   'opportunity',
        priority:   newLeads.length >= 10 ? 'high' : 'medium',
        title:      `${newLeads.length} new lead${newLeads.length > 1 ? 's' : ''} in the last 7 days`,
        summary:    `${newLeads.length} new contact${newLeads.length > 1 ? 's' : ''} entered the pipeline this week. Early engagement within 24h significantly improves conversion rates.`,
        content:    `New leads: ${newLeads.slice(0, 5).map((l: any) => l.name).join(', ')}${newLeads.length > 5 ? ` and ${newLeads.length - 5} more` : ''}.`,
        action:     'Ensure all new leads have been contacted within 24h and assigned to a sales owner.',
        module:     'Leads',
        confidence: 90,
        impact:     'Medium',
        createdAt:  now.toISOString(),
      })
    }

    // ── Overdue projects ───────────────────────────────────────────────────
    if (overdueProjects.length > 0) {
      insights.push({
        id:         `projects-overdue-${overdueProjects.length}`,
        category:   'ops',
        priority:   overdueProjects.length >= 3 ? 'high' : 'medium',
        title:      `${overdueProjects.length} active project${overdueProjects.length > 1 ? 's' : ''} past due date`,
        summary:    `${overdueProjects.length} project${overdueProjects.length > 1 ? 's are' : ' is'} past their target completion date while still showing active status. This may indicate timeline slippage or missing status updates.`,
        content:    `Overdue projects: ${overdueProjects.map((p: any) => p.title).join('; ')}.`,
        action:     'Review overdue projects with delivery leads. Update status or revise delivery dates with client agreement.',
        module:     'Projects',
        confidence: 92,
        impact:     'High',
        createdAt:  now.toISOString(),
      })
    }

    // ── All-clear ─────────────────────────────────────────────────────────
    if (insights.length === 0) {
      insights.push({
        id:         'all-clear',
        category:   'opportunity',
        priority:   'low',
        title:      'All operational signals healthy',
        summary:    'No critical issues detected across tickets, finance, clients, or delivery. Platform is in a healthy state.',
        content:    'KIMMP has scanned all connected data sources and found no active risk or revenue signals requiring immediate attention.',
        action:     'Continue monitoring. Consider proactive outreach to top clients to maintain relationship health.',
        module:     'System',
        confidence: 95,
        impact:     'Low',
        createdAt:  now.toISOString(),
      })
    }

    res.json({ insights, generatedAt: now.toISOString(), sourceCount: { openTickets: openTickets.length, overdueInvoices: overdueInvoices.length, atRiskClients: atRiskClients.length, newLeads: newLeads.length, overdueProjects: overdueProjects.length } })
  } catch (err) {
    next(err)
  }
})

// ─── Gate 3: AI Benchmarks ───────────────────────────────────────────────────

// GET  /admin/kangqore-immp/benchmarks        → latest run + trend
// GET  /admin/kangqore-immp/benchmarks/runs   → paginated run history
// POST /admin/kangqore-immp/benchmarks/run    → trigger a benchmark run

router.get('/kangqore-immp/benchmarks', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [latest, runs] = await Promise.all([
      (prisma as any).kimmpBenchmarkRun.findFirst({
        orderBy: { startedAt: 'desc' },
        include: {
          results: {
            orderBy: { score: 'asc' },
            select: { promptId: true, category: true, score: true, passed: true, issues: true, confidence: true, responseMs: true, actualModel: true },
          },
        },
      }),
      (prisma as any).kimmpBenchmarkRun.findMany({
        orderBy: { startedAt: 'desc' },
        take: 30,
        select: { id: true, startedAt: true, totalScore: true, passCount: true, failCount: true, driftAlert: true, driftDelta: true, trigger: true },
      }),
    ])

    const trend = runs.map((r: any) => ({ date: r.startedAt, score: r.totalScore, driftAlert: r.driftAlert }))

    res.json({ latest, trend, totalRuns: runs.length })
  } catch (err) { next(err) }
})

router.get('/kangqore-immp/benchmarks/runs', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page  = Math.max(1, Number((req.query as any).page  ?? 1))
    const limit = Math.min(50, Number((req.query as any).limit ?? 20))
    const [runs, total] = await Promise.all([
      (prisma as any).kimmpBenchmarkRun.findMany({
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { results: { select: { promptId: true, score: true, passed: true, category: true } } },
      }),
      (prisma as any).kimmpBenchmarkRun.count(),
    ])
    res.json({ runs, total, page, limit })
  } catch (err) { next(err) }
})

router.post('/kangqore-immp/benchmarks/run', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization ?? ''
    const token = authHeader.replace(/^Bearer\s+/i, '')
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`
    const { modelOverride, provider } = req.body ?? {}
    const summary = await runBenchmarks({ url: backendUrl, token, trigger: 'manual', verbose: false, modelOverride, provider })
    res.json(summary)
  } catch (err) { next(err) }
})

// POST /admin/kangqore-immp/benchmarks/compare — Gen 2 model-vs-model evaluation
router.post('/kangqore-immp/benchmarks/compare', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { modelA, modelB } = req.body ?? {}
    if (!modelA || !modelB) return res.status(400).json({ error: 'modelA and modelB are required' })
    const authHeader = req.headers.authorization ?? ''
    const token = authHeader.replace(/^Bearer\s+/i, '')
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`
    const result = await runBenchmarkComparison({ url: backendUrl, token, trigger: 'manual', verbose: false }, modelA, modelB)
    res.json(result)
  } catch (err) { next(err) }
})

// ─── WAANDA Brain Neural Network Graph Data ──────────────────────────────
router.get('/kangqore-immp/brain/graph', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const nodes = [
      { id: 1, slug: 'kangqore-vis', title: 'KANGQORE VIS', group: 'core', val: 10, excerpt: 'Kangqore Visual Intelligence & Media Cortex', description: 'Visual AI, image synthesis, computer vision & spatial media engine.', file: 'frontend/src/os/features/neural-network/index.tsx' },
      { id: 2, slug: 'kangqore-alis', title: 'KANGQORE ALIS', group: 'core', val: 10, excerpt: 'Agentic Life Intelligence System', description: 'Autonomous agentic lifecycle, self-improving memory & agent orchestration.', file: 'backend/src/kangqore-immp/cognition/' },
      { id: 3, slug: 'eqore', title: 'EQORE', group: 'identity', val: 9, excerpt: 'Enterprise Qore Autonomous AI Console', description: 'Enterprise-wide executive AI console, decision intelligence & multi-agent dispatcher.', file: 'frontend/src/pages/EQoreAIConsole.jsx' },
      { id: 4, slug: 'waanda', title: 'WAANDA', group: 'identity', val: 10, excerpt: 'Autonomous Mission Controller & Neural Cortex', description: 'Supreme neural orchestrator, cognitive dispatcher & autonomous release controller.', file: 'frontend/src/os/features/kangqore-immp/' },
      { id: 5, slug: 'aegis', title: 'AEGIS', group: 'identity', val: 9, excerpt: 'Enterprise AI Security & Guardrails', description: 'Zero-trust security, real-time threat detection & AI guardrails.', file: 'frontend/src/pages/admin/AegisSecurityDashboard.jsx' },
      { id: 6, slug: 'kangqore-immp', title: 'KANGQORE IMMP', group: 'core', val: 10, excerpt: 'Integrated Media & Management Platform', description: 'Central enterprise media, signal ledger, workflows & cognition platform.', file: 'frontend/src/os/features/kangqore-immp/' },
      { id: 7, slug: 'kangqore-view', title: 'KANGQORE VIEW', group: 'identity', val: 8, excerpt: 'Central Operating System Shell', description: 'Primary desktop & web OS environment for enterprise administrative control.', file: 'frontend/src/os/' },
      { id: 8, slug: 'code-admin', title: 'C.O.D.E. Admin', group: 'identity', val: 9, excerpt: 'Code of Observation, Decision & Execution', description: 'Supreme Admin Command Node for Mahesh Kumar, Founder & CEO.', file: 'AGENTS.md' },
      { id: 10, slug: 'bids', title: 'BIDS Framework', group: 'commercial', val: 8, excerpt: 'Business Intelligence & Decision Synthesis', description: 'Strategic business intelligence, ROI modeling & executive decision synthesis.', file: 'frontend/src/pages/BIDSPage.jsx' },
      { id: 11, slug: 'bids-tata-steel', title: 'BIDS Tata Steel', group: 'commercial', val: 8, excerpt: 'Industrial Steel Operations Neural Intelligence', description: 'Specialized BIDS implementation for Tata Steel industrial supply chain & blast furnace optimization.', file: 'frontend/src/pages/BIDSTataSteelPage.jsx' },
      { id: 12, slug: 'ai-concierge', title: 'AI Concierge', group: 'commercial', val: 7, excerpt: 'Interactive Conversational AI Specialist', description: '24/7 intelligent concierge for client engagement, consultation & lead qualification.', file: 'frontend/src/components/concierge/' },
      { id: 13, slug: 'global-capability-centers', title: 'Global Capability Centers', group: 'commercial', val: 8, excerpt: 'Enterprise GCC Automation & Scaling', description: 'Global capability center setup, talent engineering & offshore innovation hubs.', file: 'frontend/src/pages/services/reimagine/GlobalCapabilityCenters.jsx' },
      { id: 14, slug: 'relationship-studio', title: 'Relationship Studio', group: 'commercial', val: 7, excerpt: 'Client Relationship & Intelligence System', description: 'Omnichannel client relationship management & account intelligence.', file: 'frontend/src/pages/RelationshipStudio.jsx' },
      { id: 15, slug: 'growth-funnels', title: 'Growth Funnels & Conversion', group: 'commercial', val: 7, excerpt: 'Commercial Funnel Synthesizer', description: 'Growth funnel optimization, SXO, GEO & performance marketing analytics.', file: 'frontend/src/pages/services/amplify/GrowthFunnelsConversion.jsx' },
      { id: 16, slug: 'cdp-strategy', title: 'CDP Strategy & Data Platform', group: 'commercial', val: 7, excerpt: 'Customer Data Platform & Identity', description: 'Unified customer data architecture, real-time segmentation & identity resolution.', file: 'frontend/src/pages/services/amplify/CDPStrategy.jsx' },
      { id: 20, slug: 'data-science-ai', title: 'Data Science & AI', group: 'architecture', val: 8, excerpt: 'Enterprise Predictive Analytics & ML', description: 'Predictive modeling, deep learning, NLP, computer vision & generative AI.', file: 'frontend/src/pages/services/ai-cognitive/DataScienceAI.jsx' },
      { id: 21, slug: 'mlops-engineering', title: 'MLOps Engineering', group: 'architecture', val: 8, excerpt: 'Production ML Lifecycle Operations', description: 'Continuous model deployment, automated retraining, feature stores & drift monitoring.', file: 'frontend/src/pages/services/ai-cognitive/MLOps.jsx' },
      { id: 22, slug: 'agentic-ai', title: 'Agentic AI & Autonomous Agents', group: 'architecture', val: 9, excerpt: 'Governed Autonomous Agent Swarms', description: 'Autonomous multi-agent swarms, goal-seeking reasoning & tool invocation.', file: 'frontend/src/pages/services/ai-cognitive/AgenticAI.jsx' },
      { id: 23, slug: 'product-digital-engineering', title: 'Product & Digital Engineering', group: 'architecture', val: 8, excerpt: 'Full-Stack Software Architecture', description: 'Modern cloud-native web apps, mobile apps, microservices & scalable platforms.', file: 'frontend/src/pages/services/reimagine/ProductDigitalEngineering.jsx' },
      { id: 24, slug: 'quality-engineering', title: 'Quality Engineering & Assurance', group: 'architecture', val: 7, excerpt: 'Automated Testing & Reliability', description: 'Autonomous test generation, performance benchmarks & continuous quality control.', file: 'frontend/src/pages/services/reimagine/QualityEngineeringAssurance.jsx' },
      { id: 25, slug: 'api-microservices', title: 'API & Microservices Engineering', group: 'architecture', val: 7, excerpt: 'Cloud-Native API Ecosystems', description: 'REST, GraphQL, gRPC API gateways, service mesh & event-driven architecture.', file: 'frontend/src/pages/services/reimagine/APIMicroservicesEngineering.jsx' },
      { id: 26, slug: 'embedded-design-systems', title: 'Embedded Design Systems', group: 'architecture', val: 7, excerpt: 'UI/UX Engineering & Design Token Mesh', description: 'Enterprise UI design tokens, responsive web components & glassmorphic UI systems.', file: 'frontend/src/pages/services/reimagine/EmbeddedDesignSystems.jsx' },
      { id: 27, slug: 'pimcore-platforms', title: 'Pimcore & Enterprise Platforms', group: 'architecture', val: 7, excerpt: 'Digital Experience & PIM/MDM', description: 'Pimcore product information management, enterprise CMS & digital asset management.', file: 'frontend/src/pages/services/platforms/Pimcore.jsx' },
      { id: 28, slug: 'salesforce-servicenow', title: 'Salesforce & ServiceNow Solutions', group: 'architecture', val: 7, excerpt: 'Enterprise CRM & ITSM Automation', description: 'Custom Salesforce Cloud integrations & ServiceNow workflow automation.', file: 'frontend/src/pages/services/platforms/Salesforce.jsx' },
      { id: 29, slug: 'iot-edge', title: 'Internet of Things (IoT)', group: 'architecture', val: 7, excerpt: 'Edge Intelligence & Sensor Mesh', description: 'Industrial IoT, telemetry streaming, edge computing & smart sensor networks.', file: 'frontend/src/pages/services/reimagine/InternetOfThings.jsx' },
      { id: 30, slug: 'operation-technology', title: 'Operation Technology (OT)', group: 'architecture', val: 7, excerpt: 'Industrial Automation & SCADA', description: 'SCADA integration, PLC connectivity & OT cybersecurity.', file: 'frontend/src/pages/services/reimagine/OperationTechnology.jsx' },
      { id: 31, slug: 'blockchain-custom', title: 'Blockchain Custom Solutions', group: 'architecture', val: 7, excerpt: 'Distributed Ledger & Smart Contracts', description: 'Enterprise smart contracts, decentralized identity & cryptographic audit trails.', file: 'frontend/src/pages/services/reimagine/BlockchainCustomSections.jsx' },
      { id: 40, slug: 'signal-ledger', title: 'System Signal Ledger', group: 'chronicle', val: 7, excerpt: 'Event & Telemetry Ingestion', description: 'Unified real-time signal ledger capturing user interactions & system telemetry.', file: 'backend/src/kangqore-immp/signals/signalLedger.service.ts' },
      { id: 41, slug: 'cognitive-knowledge-base', title: 'Cognitive Knowledge Base', group: 'chronicle', val: 8, excerpt: 'Enterprise Ontology & Vector Index', description: 'Semantic knowledge graph, vector store & RAG document indexing.', file: 'backend/src/kangqore-immp/cognition/' },
      { id: 42, slug: 'decision-synthesis', title: 'Decision Synthesis Engine', group: 'chronicle', val: 8, excerpt: 'Multi-Agent Strategic Evaluator', description: 'Evaluates options, calculates risk scores & synthesizes strategic action plans.', file: 'backend/src/kangqore-immp/agents/' },
      { id: 43, slug: 'workflow-orchestrator', title: 'Workflow Orchestrator', group: 'chronicle', val: 7, excerpt: 'Automated Pipeline Execution', description: 'DAG workflow execution engine for multi-step AI tasks and data pipelines.', file: 'backend/src/kangqore-immp/workflows/' },
      { id: 44, slug: 'visitor-identity-matrix', title: 'Visitor Identity Matrix', group: 'chronicle', val: 7, excerpt: 'Footprint & Engagement Tracker', description: 'Anonymous & authenticated visitor identity tracking, session footprint & intent detection.', file: 'frontend/src/hooks/useVisitorIdentity.js' },
      { id: 50, slug: 'ai-governance', title: 'AI Governance & Responsible AI', group: 'ops', val: 8, excerpt: 'Safety, Compliance & Ethics', description: 'EU AI Act compliance, bias detection, explainable AI (XAI) & safety guardrails.', file: 'frontend/src/pages/services/ai-cognitive/AIGovernanceResponsibleAI.jsx' },
      { id: 51, slug: 'finops-cost', title: 'FinOps & AI Cost Optimization', group: 'ops', val: 7, excerpt: 'Resource & Token Metering', description: 'LLM token cost tracking, cloud resource optimization & FinOps telemetry.', file: 'backend/src/kangqore-immp/runtime/waandaRuntime.ts' },
      { id: 52, slug: 'security-risk', title: 'Security & Risk Management', group: 'ops', val: 7, excerpt: 'Zero-Trust Security Matrix', description: 'Role-based access control, cryptographic verification & vulnerability scanning.', file: 'frontend/src/pages/services/reimagine/FinanceRiskManagement.jsx' },
      { id: 53, slug: 'telemetry-health', title: 'Telemetry & System Health', group: 'ops', val: 7, excerpt: 'Real-Time Performance Monitor', description: 'System health probes, circuit breaker status & live latency monitoring.', file: 'backend/src/routes/admin.ts' },
    ]

    const links = [
      { source: 1, target: 4, value: 5 },  { source: 2, target: 4, value: 5 },  { source: 3, target: 4, value: 5 },
      { source: 4, target: 5, value: 5 },  { source: 4, target: 6, value: 5 },  { source: 4, target: 7, value: 4 },
      { source: 8, target: 4, value: 5 },  { source: 8, target: 3, value: 5 },  { source: 4, target: 10, value: 4 },
      { source: 10, target: 11, value: 4 },{ source: 4, target: 12, value: 4 },{ source: 4, target: 13, value: 4 },
      { source: 12, target: 14, value: 3 },{ source: 10, target: 15, value: 3 },{ source: 15, target: 16, value: 3 },
      { source: 4, target: 20, value: 4 }, { source: 20, target: 21, value: 4 },{ source: 4, target: 22, value: 5 },
      { source: 4, target: 23, value: 4 }, { source: 23, target: 24, value: 3 },{ source: 23, target: 25, value: 3 },
      { source: 23, target: 26, value: 3 },{ source: 23, target: 27, value: 3 },{ source: 23, target: 28, value: 3 },
      { source: 23, target: 29, value: 3 },{ source: 29, target: 30, value: 3 },{ source: 23, target: 31, value: 3 },
      { source: 6, target: 40, value: 4 }, { source: 6, target: 41, value: 4 }, { source: 4, target: 42, value: 4 },
      { source: 6, target: 43, value: 4 }, { source: 40, target: 44, value: 3 },{ source: 5, target: 50, value: 4 },
      { source: 4, target: 51, value: 4 }, { source: 5, target: 52, value: 4 }, { source: 4, target: 53, value: 4 },
    ]

    res.json({ count: nodes.length, nodes, links })
  } catch (err) { next(err) }
})

// ─── WAANDA Runtime: maintenance mode toggle ─────────────────────────────────

router.post('/kangqore-immp/runtime/maintenance', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { provider, on } = req.body as { provider: string; on: boolean }
    if (!provider || typeof on !== 'boolean') return res.status(400).json({ error: 'provider (string) and on (boolean) required' })
    setProviderMaintenance(provider, on)
    res.json({ ok: true, provider, maintenance: on })
  } catch (err) { next(err) }
})

// ─── Gate 7: Readiness — consolidated release gate ───────────────────────────
// Returns structured gate statuses suitable for Mission Control Release Control.

router.get('/kangqore-immp/readiness', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [runtimeHealth, redisHealth, dbPing, latestBenchmark, latestGate35, latestGate4, latestGate5, latestGate6] = await Promise.allSettled([
      getRuntimeHealth(),
      Promise.resolve(getRedisHealth()),
      prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
      (prisma as any).kimmpBenchmarkRun.findFirst({
        orderBy: { startedAt: 'desc' },
        select: { totalScore: true, passCount: true, failCount: true, driftAlert: true, startedAt: true },
      }).catch(() => null),
      (prisma as any).waandaGate35Run.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { totalScore: true, passCount: true, failCount: true, completedAt: true },
      }).catch(() => null),
      (prisma as any).kimmpGate4Run.findFirst({
        orderBy: { runAt: 'desc' },
        select: { totalScore: true, passCount: true, failCount: true, completedAt: true },
      }).catch(() => null),
      (prisma as any).waandaGate5Run.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { totalScore: true, passCount: true, failCount: true, completedAt: true },
      }).catch(() => null),
      (prisma as any).waandaGate6Run.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { totalScore: true, passCount: true, failCount: true, pendingCount: true, completedAt: true },
      }).catch(() => null),
    ])

    const runtime  = runtimeHealth.status   === 'fulfilled' ? runtimeHealth.value   : null
    const redis    = redisHealth.status      === 'fulfilled' ? redisHealth.value     : null
    const dbOk     = dbPing.status           === 'fulfilled' ? dbPing.value          : false
    const bench    = latestBenchmark.status  === 'fulfilled' ? latestBenchmark.value : null
    const g35      = latestGate35.status     === 'fulfilled' ? latestGate35.value    : null
    const g4       = latestGate4.status      === 'fulfilled' ? latestGate4.value     : null
    const g5       = latestGate5.status      === 'fulfilled' ? latestGate5.value     : null
    const g6       = latestGate6.status      === 'fulfilled' ? latestGate6.value     : null

    // Gate 1: Functional Correctness — DB reachable = platform runs
    const gate1 = dbOk ? 'PASS' : 'FAIL'

    // Gate 2: Infrastructure Resilience — DB + Redis + at least one LLM provider
    const gate2 = (dbOk && !redis?.degraded && runtime?.anyUp) ? 'PASS'
                : (!dbOk || !runtime?.anyUp) ? 'FAIL' : 'DEGRADED'

    // Gate 3: AI Reliability — last benchmark run score ≥75, no drift alert
    const gate3 = !bench                    ? 'PENDING'
                : bench.driftAlert          ? 'DEGRADED'
                : bench.totalScore >= 75    ? 'PASS' : 'FAIL'

    // Gate 3.5: Runtime Intelligence — failover rate + routing quality
    const gate35 = !g35                    ? 'PENDING'
                 : g35.totalScore >= 70 && g35.passCount >= 4 ? 'PASS'
                 : g35.totalScore >= 50    ? 'DEGRADED' : 'FAIL'

    // Gate 4: Autonomous Operations
    const gate4 = !g4                      ? 'PENDING'
                : g4.totalScore >= 75 && g4.failCount <= 1 ? 'PASS'
                : g4.totalScore >= 60       ? 'DEGRADED' : 'FAIL'

    // Gate 5: Interaction Quality
    const gate5 = !g5                      ? 'PENDING'
                : g5.totalScore >= 75 && (g5.failCount / (g5.passCount + g5.failCount || 1)) <= 0.20 ? 'PASS'
                : g5.totalScore >= 60       ? 'DEGRADED' : 'FAIL'

    // Gate 6: Enterprise Readiness
    const gate6 = !g6                      ? 'PENDING'
                : g6.totalScore >= 70 && g6.failCount <= 5 ? 'PASS'
                : g6.totalScore >= 50       ? 'PARTIAL' : 'FAIL'

    // Overall: weighted across 7 gates (Gate 7 = pending)
    const gateScore = (g: string) => g === 'PASS' ? 100 : g === 'PARTIAL' ? 75 : g === 'DEGRADED' ? 65 : g === 'PENDING' ? 80 : 0
    const overall = Math.round(
      gateScore(gate1)  * 0.10 +
      gateScore(gate2)  * 0.15 +
      gateScore(gate3)  * 0.20 +
      gateScore(gate35) * 0.10 +
      gateScore(gate4)  * 0.15 +
      gateScore(gate5)  * 0.15 +
      gateScore(gate6)  * 0.15
    )

    const blockingIssues: string[] = []
    const warnings: string[] = []
    if (gate1 === 'FAIL')    blockingIssues.push('Database unreachable')
    if (gate2 === 'FAIL')    blockingIssues.push('Infrastructure resilience failure')
    if (gate3 === 'FAIL')    blockingIssues.push('AI benchmark quality below threshold')
    if (gate35 === 'FAIL')   warnings.push('Runtime routing intelligence degraded')
    if (gate4 === 'FAIL')    warnings.push('Autonomous workflow validation failed')
    if (gate5 === 'FAIL')    warnings.push('Interaction quality below threshold')
    if (gate6 === 'FAIL')    blockingIssues.push('Enterprise readiness gate failed')
    if (redis?.degraded)     warnings.push(`Redis in fallback mode (${redis.fallbackDurationSec}s)`)
    if (bench?.driftAlert)   warnings.push('AI quality drift detected')
    if (!runtime?.anyUp)     blockingIssues.push('No LLM providers available')

    const readyForRelease = blockingIssues.length === 0 && overall >= 75

    res.json({
      readyForRelease,
      overall,
      blockingIssues,
      warnings,
      recommendedAction: readyForRelease ? 'Deploy' : blockingIssues.length > 0 ? 'Block' : 'Review',
      timestamp: new Date().toISOString(),
      gates: {
        gate1:  { name: 'Platform Correctness',    status: gate1,  weight: 10 },
        gate2:  { name: 'Platform Resilience',     status: gate2,  weight: 15 },
        gate3:  { name: 'Intelligence Quality',    status: gate3,  weight: 20 },
        gate35: { name: 'Runtime Intelligence',    status: gate35, weight: 10 },
        gate4:  { name: 'Autonomous Operations',   status: gate4,  weight: 15 },
        gate5:  { name: 'Interaction Quality',     status: gate5,  weight: 15 },
        gate6:  { name: 'Enterprise Readiness',    status: gate6,  weight: 15 },
        gate7:  { name: 'Release Readiness',       status: 'PENDING', weight: 0 },
      },
      detail: {
        database:  { ok: dbOk },
        redis:     { ok: !redis?.degraded, mode: redis?.mode, fallbackDurationSec: redis?.fallbackDurationSec ?? 0 },
        ai:        { overall: runtime?.overall, anyUp: runtime?.anyUp, providers: runtime?.providers },
        benchmark: bench ? { score: bench.totalScore, passCount: bench.passCount, driftAlert: bench.driftAlert, at: bench.startedAt } : null,
        runtime35: g35  ? { score: g35.totalScore,  passCount: g35.passCount,  failCount: g35.failCount,  at: g35.completedAt  } : null,
        gate4:     g4   ? { score: g4.totalScore,   passCount: g4.passCount,   failCount: g4.failCount,   at: g4.completedAt   } : null,
        gate5:     g5   ? { score: g5.totalScore,   passCount: g5.passCount,   failCount: g5.failCount,   at: g5.completedAt   } : null,
        gate6:     g6   ? { score: g6.totalScore,   passCount: g6.passCount,   failCount: g6.failCount,   pendingCount: g6.pendingCount, at: g6.completedAt } : null,
      },
    })
  } catch (err) { next(err) }
})

// ─── Gate 2: System Health — LLM Router + Redis + DB ────────────────────────
// Powers the Gate 7 Production Readiness Dashboard.

router.get('/kangqore-immp/system-health', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [routerStats, redisHealth, dbPing] = await Promise.allSettled([
      getRouterStats(),
      Promise.resolve(getRedisHealth()),
      prisma.$queryRaw`SELECT 1`.then(() => ({ ok: true })).catch((e: any) => ({ ok: false, error: e.message })),
    ])

    const router = routerStats.status === 'fulfilled' ? routerStats.value : null
    const redis  = redisHealth.status === 'fulfilled'  ? redisHealth.value  : null
    const db     = dbPing.status === 'fulfilled'       ? dbPing.value       : { ok: false, error: 'Prisma error' }

    const llmProvidersUp = router
      ? (router.activeProviders as string[]).filter(p => {
          const cb = (router.circuitBreakers as any)[p]
          return cb?.state === 'closed' || cb?.state === 'half-open'
        }).length
      : 0

    const healthy = (db as any).ok && !redis?.degraded && llmProvidersUp > 0

    res.json({
      healthy,
      timestamp: new Date().toISOString(),
      gates: {
        database: {
          ok:    (db as any).ok,
          error: (db as any).error ?? null,
        },
        redis: {
          ok:             !redis?.degraded,
          mode:           redis?.mode ?? 'unknown',
          degraded:       redis?.degraded ?? false,
          fallbackEntries: redis?.fallbackEntries ?? 0,
        },
        llm: {
          ok:              llmProvidersUp > 0,
          activeProviders: router?.activeProviders ?? [],
          callsTotal:      router?.callsTotal ?? 0,
          autonomyRatio:   router?.autonomyRatio ?? 0,
          phase:           router?.phase ?? 'unknown',
          circuitBreakers: router?.circuitBreakers ?? {},
          providers:       router?.providers ?? [],
        },
      },
    })
  } catch (err) {
    next(err)
  }
})

// ─── Gate 3.5: Runtime Intelligence ──────────────────────────────────────────

// GET  /admin/kangqore-immp/runtime/intelligence        → profiles + 30d stats
// POST /admin/kangqore-immp/runtime/intelligence/run    → trigger Gate 3.5 check
// POST /admin/kangqore-immp/runtime/intelligence/recompute → recompute profiles

router.get('/kangqore-immp/runtime/intelligence', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [profiles, stats, latest] = await Promise.all([
      getCapabilityProfiles(),
      getRuntimeCallStats(30),
      (prisma as any).waandaGate35Run.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { checks: true },
      }).catch(() => null),
    ])
    res.json({ profiles, stats, latest })
  } catch (err) { next(err) }
})

router.post('/kangqore-immp/runtime/intelligence/recompute', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await computeCapabilityProfiles(30)
    const profiles = await getCapabilityProfiles()
    res.json({ ok: true, profiles })
  } catch (err) { next(err) }
})

router.post('/kangqore-immp/runtime/intelligence/run', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const summary = await runGate35({ trigger: 'manual', verbose: false })
    res.json({ ok: true, summary })
  } catch (err) { next(err) }
})

// ─── Gate 5: Interaction Quality ─────────────────────────────────────────────

// GET  /admin/kangqore-immp/gate5       → latest Gate 5 run + trend
// POST /admin/kangqore-immp/gate5/run   → trigger Playwright e2e suite

router.get('/kangqore-immp/gate5', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [latest, trend] = await Promise.all([
      (prisma as any).waandaGate5Run.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { checks: true },
      }).catch(() => null),
      (prisma as any).waandaGate5Run.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, totalScore: true, passCount: true, failCount: true, durationMs: true, trigger: true, completedAt: true, createdAt: true },
      }).catch(() => []),
    ])

    const gate = !latest ? 'PENDING'
      : latest.totalScore >= 75 && (latest.failCount / Math.max(latest.passCount + latest.failCount, 1)) <= 0.20
      ? 'PASS' : 'FAIL'

    res.json({ gate, latest, trend })
  } catch (err) { next(err) }
})

router.post('/kangqore-immp/gate5/run', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const summary = await runGate5({ trigger: 'manual', verbose: false })
    res.json({ ok: true, summary })
  } catch (err) { next(err) }
})

// ─── Gate 6: Enterprise Readiness ────────────────────────────────────────────

// GET  /admin/kangqore-immp/gate6       → latest Gate 6 run + domain breakdown
// POST /admin/kangqore-immp/gate6/run   → trigger a new Gate 6 run

router.get('/kangqore-immp/gate6', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [latest, trend] = await Promise.all([
      (prisma as any).waandaGate6Run.findFirst({ orderBy: { createdAt: 'desc' }, include: { checks: true } }),
      (prisma as any).waandaGate6Run.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { totalScore: true, passCount: true, failCount: true, pendingCount: true, createdAt: true } }),
    ])
    res.json({ latest, trend })
  } catch (err) { next(err) }
})

router.post('/kangqore-immp/gate6/run', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const summary = await runGate6({ trigger: 'manual', verbose: false })
    res.json({ ok: true, summary })
  } catch (err) { next(err) }
})

// ─── QEF Certificates ─────────────────────────────────────────────────────────
// GET  /admin/kangqore-immp/certificates          → latest cert + release history
// GET  /admin/kangqore-immp/certificates/latest   → just the current cert
// POST /admin/kangqore-immp/certificates/issue    → issue a new certificate

router.get('/kangqore-immp/certificates', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [latest, history] = await Promise.all([
      latestCertificate(),
      listCertificates(20),
    ])
    res.json({ latest, history })
  } catch (err) { next(err) }
})

router.get('/kangqore-immp/certificates/latest', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.json(await latestCertificate())
  } catch (err) { next(err) }
})

router.post('/kangqore-immp/certificates/issue', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { reviewer, approver, draft } = req.body ?? {}
    const cert = await issueCertificate({ trigger: 'manual', reviewer, approver, draft: !!draft, verbose: false })
    res.json({ ok: true, cert })
  } catch (err) { next(err) }
})

router.post('/kangqore-immp/certificates/:certId/approve', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { certId } = req.params
    const { approver } = req.body ?? {}
    if (!approver) { res.status(400).json({ error: 'approver is required' }); return }
    const cert = await approveCertificate(certId, approver)
    res.json({ ok: true, cert })
  } catch (err) { next(err) }
})

router.post('/kangqore-immp/certificates/:certId/revoke', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { certId } = req.params
    const { reason } = req.body ?? {}
    if (!reason) { res.status(400).json({ error: 'reason is required' }); return }
    const cert = await revokeCertificate(certId, reason)
    res.json({ ok: true, cert })
  } catch (err) { next(err) }
})

// GET /certificates/diff?from=QEF-2026-000001&to=QEF-2026-000002
router.get('/kangqore-immp/certificates/diff', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { from, to } = req.query as { from?: string; to?: string }
    if (!from || !to) { res.status(400).json({ error: 'from and to are required' }); return }
    const diff = await computeCertificateDiff(from, to)
    res.json(diff)
  } catch (err) { next(err) }
})

// ─── Gate 4: Autonomous Operations ───────────────────────────────────────────

// GET  /admin/kangqore-immp/gate4       → latest Gate 4 run + 10-run trend
// POST /admin/kangqore-immp/gate4/run   → trigger a new Gate 4 run

router.get('/kangqore-immp/gate4', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [latest, trend] = await Promise.all([
      (prisma as any).kimmpGate4Run.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { results: true },
      }).catch(() => null),
      (prisma as any).kimmpGate4Run.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, totalScore: true, passCount: true, failCount: true, durationMs: true, trigger: true, completedAt: true, createdAt: true },
      }).catch(() => []),
    ])

    const gate = latest
      ? (latest.totalScore >= 75 && latest.failCount <= 1 ? 'PASS' : 'FAIL')
      : 'PENDING'

    res.json({ gate, latest, trend })
  } catch (err) { next(err) }
})

router.post('/kangqore-immp/gate4/run', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const summary = await runGate4({ trigger: 'manual', verbose: false })
    res.json({ ok: true, summary })
  } catch (err) { next(err) }
})

// ─── Gate 7: Release Governance (RGS/1.0) ────────────────────────────────────
//
// GET  /admin/release/environments              → list environments + policies
// GET  /admin/release/environments/:code/status → preflight (no decision record created)
// POST /admin/release/evaluate                  → evaluate + create DeploymentDecision
// POST /admin/release/deploy                    → record an actual deployment
// POST /admin/release/outcome                   → record deployment outcome
// POST /admin/release/rollback                  → authorize + record rollback
// POST /admin/release/override                  → emergency override (2 approvers required)
// GET  /admin/release/decisions                 → decision history
// GET  /admin/release/deployments               → deployment history

router.get('/release/environments', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json(await listEnvironments()) } catch (err) { next(err) }
})

router.get('/release/environments/:code/status', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const certId = req.query.certId as string | undefined
    res.json(await preflightCheck(req.params.code, certId))
  } catch (err) { next(err) }
})

router.post('/release/evaluate', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { certId, environment, approver } = req.body
    if (!certId || !environment) return res.status(400).json({ error: 'certId and environment are required' })
    res.json(await evaluateRelease({ certId, envCode: environment, approver }))
  } catch (err) { next(err) }
})

router.post('/release/deploy', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { decisionId, deployedBy } = req.body
    if (!decisionId || !deployedBy) return res.status(400).json({ error: 'decisionId and deployedBy are required' })
    res.json(await recordDeployment({ decisionId, deployedBy }))
  } catch (err) { next(err) }
})

router.post('/release/outcome', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { deployId, outcome, outcomeNote } = req.body
    if (!deployId || !outcome) return res.status(400).json({ error: 'deployId and outcome are required' })
    res.json(await recordOutcome({ deployId, outcome, outcomeNote }))
  } catch (err) { next(err) }
})

router.post('/release/rollback', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { rollbackOfDeployId, authorizedBy, reason } = req.body
    if (!rollbackOfDeployId || !authorizedBy || !reason) return res.status(400).json({ error: 'rollbackOfDeployId, authorizedBy, and reason are required' })
    res.json(await recordRollback({ rollbackOfDeployId, authorizedBy, reason }))
  } catch (err) { next(err) }
})

router.post('/release/override', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { decisionId, approver1, approver2, reason } = req.body
    if (!decisionId || !approver1 || !approver2 || !reason) return res.status(400).json({ error: 'decisionId, approver1, approver2, and reason are all required' })
    res.json(await emergencyOverride({ decisionId, approver1, approver2, reason }))
  } catch (err) { next(err) }
})

router.get('/release/decisions', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const env   = req.query.environment as string | undefined
    const limit = parseInt(req.query.limit as string ?? '20', 10)
    res.json(await listDecisions(env, limit))
  } catch (err) { next(err) }
})

router.get('/release/deployments', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const env   = req.query.environment as string | undefined
    const limit = parseInt(req.query.limit as string ?? '20', 10)
    res.json(await listDeployments(env, limit))
  } catch (err) { next(err) }
})

// ─── Incident Registry ────────────────────────────────────────────────────────
//
// GET  /admin/release/incidents              → open incidents (affects release decisions)
// POST /admin/release/incidents              → declare a new incident
// PATCH /admin/release/incidents/:id/resolve → resolve an incident

const ACTIVE_INCIDENT_STATUSES = ['NEW', 'TRIAGING', 'IN_PROGRESS', 'ON_HOLD']

router.get('/release/incidents', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const incidents = await prisma.incident.findMany({
      where:   { status: { in: [...ACTIVE_INCIDENT_STATUSES, 'RESOLVED'] } },
      orderBy: { createdAt: 'desc' },
      take:    30,
      select:  { id: true, number: true, title: true, priority: true, status: true, description: true, createdAt: true, resolvedAt: true, resolution: true },
    })
    res.json(incidents)
  } catch (err) { next(err) }
})

router.post('/release/incidents', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, priority, description } = req.body
    if (!title || !priority) return res.status(400).json({ error: 'title and priority are required' })
    if (!['P1-CRITICAL', 'P2-HIGH', 'P3-MEDIUM', 'P4-LOW'].includes(priority)) {
      return res.status(400).json({ error: 'priority must be P1-CRITICAL | P2-HIGH | P3-MEDIUM | P4-LOW' })
    }

    // Generate incident number
    const year   = new Date().getFullYear()
    const prefix = `INC-${year}-`
    const last   = await prisma.incident.findFirst({ where: { number: { startsWith: prefix } }, orderBy: { createdAt: 'desc' }, select: { number: true } })
    const seq    = last ? parseInt(last.number.split('-')[2] ?? '0', 10) + 1 : 1
    const number = `${prefix}${String(seq).padStart(6, '0')}`

    const adminId = (req as any).user?.userId ?? 'ADMIN'
    const incident = await prisma.incident.create({
      data: {
        number,
        title,
        priority,
        description: description ?? '',
        status:      'NEW',
        reportedById: adminId,
        slaDeadline: priority === 'P1-CRITICAL' ? new Date(Date.now() + 60 * 60 * 1000) : priority === 'P2-HIGH' ? new Date(Date.now() + 4 * 60 * 60 * 1000) : null,
      },
      select: { id: true, number: true, title: true, priority: true, status: true, createdAt: true },
    })

    // AEGIS — policy violation (P0/P1 active incidents block deployments)
    if (priority === 'P1-CRITICAL' || priority === 'P2-HIGH') {
      await AegisLedger.logPolicyViolation({
        policy:   'INCIDENT_DECLARED',
        actor:    adminId,
        system:   'RGS',
        detail:   `${number}: ${title}`,
        severity: priority === 'P1-CRITICAL' ? 'CRITICAL' : 'HIGH',
        metadata: { incidentId: incident.id, number, priority },
      })
    }

    res.status(201).json(incident)
  } catch (err) { next(err) }
})

router.patch('/release/incidents/:id/resolve', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { resolution } = req.body
    const adminId = (req as any).user?.userId ?? 'ADMIN'
    const incident = await prisma.incident.update({
      where: { id: req.params.id },
      data:  { status: 'RESOLVED', resolvedAt: new Date(), resolution: `${resolution ?? 'Resolved'} — by ${adminId}` },
      select: { id: true, number: true, title: true, priority: true, status: true, resolvedAt: true },
    })
    res.json(incident)
  } catch (err) { next(err) }
})

// ─── Deployment Provenance ────────────────────────────────────────────────────

router.get('/release/deployments/:deployId/provenance', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { deployId } = req.params

    const deployment = await (prisma as any).deploymentRecord.findUnique({
      where:   { deployId },
      include: { environment: true, decision: { select: { decisionId: true, verdict: true, emergencyOverride: true, evaluatedAt: true, approvals: true, sha256: true } } },
    })
    if (!deployment) return res.status(404).json({ error: 'Deployment not found' })

    const cert = deployment.certId
      ? await (prisma as any).qEFCertificate.findUnique({
          where:  { certId: deployment.certId },
          select: { certId: true, level: true, overallScore: true, gitCommit: true, dockerImage: true, issuedAt: true, certifiedBy: true, qefSchemaVersion: true },
        }).catch(() => null)
      : null

    res.json({
      deployId:       deployment.deployId,
      rgsVersion:     deployment.rgsVersion,
      decisionId:     deployment.decision?.decisionId ?? null,
      verdict:        deployment.decision?.verdict ?? null,
      emergencyOverride: deployment.decision?.emergencyOverride ?? false,
      approvals:      deployment.decision?.approvals ?? [],
      certId:         deployment.certId,
      certLevel:      deployment.certLevel,
      certScore:      cert?.overallScore ?? null,
      certIssuedAt:   cert?.issuedAt ?? null,
      certifiedBy:    cert?.certifiedBy ?? null,
      gitCommit:      cert?.gitCommit ?? null,
      dockerImage:    cert?.dockerImage ?? null,
      environment:    deployment.environment?.name ?? null,
      environmentCode: deployment.environment?.code ?? null,
      deployedBy:     deployment.deployedBy,
      deployedAt:     deployment.deployedAt,
      outcome:        deployment.outcome,
      rollbackOf:     deployment.rollbackOf ?? null,
      sha256Deploy:   deployment.sha256,
      sha256Decision: deployment.decision?.sha256 ?? null,
    })
  } catch (err) { next(err) }
})

// ─── Platform Flight Recorder ─────────────────────────────────────────────────

router.get('/flight-recorder/events', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { from, to, types, sources, limit = '50', offset = '0' } = req.query
    const result = await getFlightEvents({
      from:    from    ? new Date(from as string)    : undefined,
      to:      to      ? new Date(to as string)      : undefined,
      types:   types   ? (types   as string).split(',').filter(Boolean) : undefined,
      sources: sources ? (sources as string).split(',').filter(Boolean) as any[] : undefined,
      limit:   Math.min(200, Math.max(1, parseInt(limit   as string) || 50)),
      offset:  Math.max(0, parseInt(offset as string) || 0),
    })
    res.json(result)
  } catch (err) { next(err) }
})

// ─── Gate 8 — Operational Intelligence + 8.1 Forecast + 8.2 Recommendations ─

// Live OIS computation (no snapshot written)
router.get('/gate8/score', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await computeGate8()
    res.json(result)
  } catch (err) { next(err) }
})

// Create a snapshot (for trend history)
router.post('/gate8/snapshot', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { triggeredBy, deployId } = req.body as { triggeredBy?: 'MANUAL' | 'POST_DEPLOY' | 'AUTO'; deployId?: string }
    const snapshot = await createGate8Snapshot(triggeredBy ?? 'MANUAL', deployId)
    res.status(201).json(snapshot)
  } catch (err) { next(err) }
})

// OIS history (for trend chart)
router.get('/gate8/history', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string || '30', 10), 90)
    const history = await getGate8History(limit)
    res.json(history)
  } catch (err) { next(err) }
})

// Gate 8.1 — Enterprise Forecast™
router.get('/gate8/forecast', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const horizon = Math.min(parseInt(req.query.horizon as string || '30', 10), 90)
    const forecast = await computeForecast(horizon)
    res.json(forecast)
  } catch (err) { next(err) }
})

// Gate 8.2 — Recommendation Engine™
router.get('/gate8/recommendations', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const recs = await computeRecommendations()
    res.json(recs)
  } catch (err) { next(err) }
})

// ─── Enterprise Definition ────────────────────────────────────────────────────
router.get('/enterprise/definition', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const def = await getActiveDefinition()
    res.json(def ?? { active: false })
  } catch (err) { next(err) }
})

router.post('/enterprise/definition', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, goals } = req.body
    if (!name || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({ error: 'name and goals[] required' })
    }
    const def = await upsertDefinition(name, goals)
    res.status(201).json(def)
  } catch (err) { next(err) }
})

// ─── EMI™ — WAANDA Enterprise Maturity Index ─────────────────────────────────
router.get('/enterprise/maturity', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const emi = await computeEMI()
    res.json(emi)
  } catch (err) { next(err) }
})

// ─── COIG — Triple Number ─────────────────────────────────────────────────────
router.get('/enterprise/coig', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const horizon = parseInt(req.query.horizon as string) || 30
    const coig = await computeCOIG(horizon)
    res.json(coig)
  } catch (err) { next(err) }
})

// ─── Enterprise Pulse ─────────────────────────────────────────────────────────
router.get('/enterprise/pulse', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const pulse = await computePulse()
    res.json(pulse)
  } catch (err) { next(err) }
})

// ─── Enterprise DNA ───────────────────────────────────────────────────────────
router.get('/enterprise/dna', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let dna = await getDNA() as any
    // Auto-recompute if missing or stale (>24h)
    if (!dna || (Date.now() - new Date((dna as any).computedAt).getTime()) > 24 * 60 * 60 * 1000) {
      dna = await computeAndSaveDNA()
    }
    res.json(dna ?? { computed: false })
  } catch (err) { next(err) }
})

router.post('/enterprise/dna/compute', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const dna = await computeAndSaveDNA()
    res.json(dna)
  } catch (err) { next(err) }
})

// ─── Customer Zero Report ─────────────────────────────────────────────────────
router.get('/enterprise/customer-zero', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const report = await computeCustomerZeroReport()
    res.json(report)
  } catch (err) { next(err) }
})

router.get('/enterprise/customer-zero/activity', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const activity = await computePlatformActivity()
    res.json(activity)
  } catch (err) { next(err) }
})

router.get('/enterprise/customer-zero/pulse', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const activity = await computePlatformActivity()
    const pulse = await generateOperatingPulse(activity)
    res.json(pulse)
  } catch (err) { next(err) }
})

// GET /admin/enterprise/coig/week-report — Week N milestone report for client leadership
// Shows OIS trajectory, maturity level progression, and COIG delta since Day 0 baseline.
// Used for Week 5 client leadership presentation in S3-B.
router.get('/enterprise/coig/week-report', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const report = await computeCoigWeekReport()
    res.json(report)
  } catch (err) { next(err) }
})

// GET /admin/enterprise/onboarding/checklist — 10-step deployment checklist
// Checks live DB state for each onboarding requirement.
// Complete when completionPct >= 80.
router.get('/enterprise/onboarding/checklist', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const checklist = await computeOnboardingChecklist()
    res.json(checklist)
  } catch (err) { next(err) }
})

// ─── Customer Success Platform (H4) ──────────────────────────────────────────

// GET /admin/enterprise/deployments — all deployments with COIG + health score
router.get('/enterprise/deployments', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json(await listDeploymentHealth()) } catch (err) { next(err) }
})

// GET /admin/enterprise/deployments/:id/renewal-risk — WAANDA renewal risk signal per deployment
router.get('/enterprise/deployments/:id/renewal-risk', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json(await computeRenewalRisk(req.params.id)) } catch (err) { next(err) }
})

// GET /admin/enterprise/deployments/:id/qbr — QBR generation for a deployment
// Optional query: ?clientName=Acme+Corp&quarter=Q3+2026
router.get('/enterprise/deployments/:id/qbr', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { clientName, quarter } = req.query as { clientName?: string; quarter?: string }
    res.json(await generateQBR(req.params.id, clientName, quarter))
  } catch (err) { next(err) }
})

// GET /admin/enterprise/blueprints/gaps/aggregate — cross-deployment gap analysis → PS Pack v1.1 input
router.get('/enterprise/blueprints/gaps/aggregate', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json(await aggregateBlueprintGaps()) } catch (err) { next(err) }
})

// ─── Industry Packs ───────────────────────────────────────────────────────────

const PS_PACK_V1 = {
  id: 'ps-pack-v1',
  name: 'Professional Services Pack™',
  version: '1.0.0',
  industry: 'professional-services',
  description: 'A portable deployment spec extracted from Kangqore Global\'s own professional services operations. Includes ontology, KPIs, goals, policies, agent config, and OIS profile calibrated for PS firms.',
  ontology: {
    entities: [
      { type: 'Client', attributes: ['name', 'industry', 'tier', 'healthScore', 'contractValue', 'nps'] },
      { type: 'Engagement', attributes: ['name', 'type', 'status', 'startDate', 'endDate', 'budget', 'margin'] },
      { type: 'Deliverable', attributes: ['title', 'dueDate', 'status', 'acceptanceCriteria'] },
      { type: 'Consultant', attributes: ['name', 'skills', 'utilization', 'billRate', 'seniority'] },
      { type: 'Invoice', attributes: ['amount', 'dueDate', 'status', 'milestone'] },
      { type: 'Proposal', attributes: ['value', 'probability', 'stage', 'submittedAt'] },
    ],
    relations: [
      { from: 'Client',      to: 'Engagement',  type: 'has' },
      { from: 'Engagement',  to: 'Deliverable', type: 'produces' },
      { from: 'Consultant',  to: 'Engagement',  type: 'assigned_to' },
      { from: 'Engagement',  to: 'Invoice',     type: 'generates' },
      { from: 'Proposal',    to: 'Engagement',  type: 'converts_to' },
    ],
  },
  kpis: [
    { id: 'k1', name: 'Revenue per Engagement',      unit: '₹',  target: 2500000, pillar: 'FINANCIAL'   },
    { id: 'k2', name: 'Client Satisfaction (CSAT)',   unit: '/10', target: 8.5,    pillar: 'CLIENT'      },
    { id: 'k3', name: 'On-Time Delivery Rate',        unit: '%',  target: 92,      pillar: 'DELIVERY'    },
    { id: 'k4', name: 'Consultant Utilization',       unit: '%',  target: 78,      pillar: 'PEOPLE'      },
    { id: 'k5', name: 'Gross Margin',                 unit: '%',  target: 42,      pillar: 'FINANCIAL'   },
    { id: 'k6', name: 'Days Sales Outstanding (DSO)', unit: 'days', target: 42,   pillar: 'FINANCIAL'   },
    { id: 'k7', name: 'Net Promoter Score (NPS)',     unit: '',   target: 55,      pillar: 'CLIENT'      },
    { id: 'k8', name: 'Pipeline Conversion Rate',     unit: '%',  target: 28,      pillar: 'GROWTH'      },
    { id: 'k9', name: 'Employee Retention',           unit: '%',  target: 88,      pillar: 'PEOPLE'      },
    { id: 'k10', name: 'Average Deal Size',           unit: '₹',  target: 1800000, pillar: 'GROWTH'     },
  ],
  goals: [
    { id: 'g1', title: 'Grow annual revenue 40% YoY',              pillar: 'GROWTH',     horizon: '12M' },
    { id: 'g2', title: 'Achieve 90%+ on-time project delivery',    pillar: 'DELIVERY',   horizon: '6M'  },
    { id: 'g3', title: 'Maintain 85%+ client satisfaction (CSAT)', pillar: 'CLIENT',     horizon: '6M'  },
    { id: 'g4', title: 'Reduce DSO below 42 days',                 pillar: 'FINANCIAL',  horizon: '3M'  },
    { id: 'g5', title: 'Increase consultant utilization to 78%+',  pillar: 'PEOPLE',     horizon: '3M'  },
    { id: 'g6', title: 'Launch 2 new service lines by Q4',         pillar: 'INNOVATION', horizon: '9M'  },
  ],
  policies: [
    { id: 'p1', title: 'Signed SOW before kickoff',            domain: 'delivery',  enforcement: 'HARD' },
    { id: 'p2', title: 'Invoice within 7 days of milestone',   domain: 'finance',   enforcement: 'HARD' },
    { id: 'p3', title: 'Change requests >10% need approval',   domain: 'delivery',  enforcement: 'SOFT' },
    { id: 'p4', title: '24h client response SLA',              domain: 'client',    enforcement: 'HARD' },
    { id: 'p5', title: 'QBR for engagements >6 months',       domain: 'client',    enforcement: 'SOFT' },
    { id: 'p6', title: 'Weekly status report to client',       domain: 'delivery',  enforcement: 'SOFT' },
    { id: 'p7', title: 'Risk log updated at each milestone',   domain: 'delivery',  enforcement: 'SOFT' },
    { id: 'p8', title: 'All billable work time-tracked daily', domain: 'finance',   enforcement: 'HARD' },
  ],
  agents: [
    { id: 'a1',  name: 'ClientSuccessAgent',    role: 'Monitors health score, flags at-risk accounts, triggers QBR scheduling' },
    { id: 'a2',  name: 'DeliveryAgent',         role: 'Tracks milestone status, surfaces blockers, alerts on scope creep' },
    { id: 'a3',  name: 'BillingAgent',          role: 'Triggers invoice creation on milestone completion, tracks DSO' },
    { id: 'a4',  name: 'ResourcePlanningAgent', role: 'Matches consultant skills to opportunities, optimizes utilization' },
    { id: 'a5',  name: 'ProposalAgent',         role: 'Generates proposal drafts from template, tracks win/loss patterns' },
    { id: 'a6',  name: 'RiskAgent',             role: 'Maintains risk register, escalates HIGH/CRITICAL risks to PM' },
    { id: 'a7',  name: 'QualityAgent',          role: 'Validates deliverables against acceptance criteria before client handoff' },
    { id: 'a8',  name: 'PipelineAgent',         role: 'Scores leads, predicts close probability, flags stale opportunities' },
    { id: 'a9',  name: 'FinanceAgent',          role: 'P&L per engagement, margin alerts, budget vs actual tracking' },
    { id: 'a10', name: 'TalentAgent',           role: 'Monitors consultant retention signals, flags flight risk, tracks skills gaps' },
    { id: 'a11', name: 'KnowledgeAgent',        role: 'Captures delivery learnings into Enterprise Memory after project close' },
    { id: 'a12', name: 'ComplianceAgent',       role: 'Audits policy adherence (SOW signed, invoices on time, time-tracking)' },
  ],
  oisProfile: {
    pillars: {
      STRATEGIC:    { weight: 0.15, description: 'Goal alignment and executive clarity'    },
      FINANCIAL:    { weight: 0.20, description: 'Revenue, margin, DSO, billing health'    },
      DELIVERY:     { weight: 0.20, description: 'On-time delivery, quality, scope control' },
      CLIENT:       { weight: 0.18, description: 'Satisfaction, NPS, renewal probability'  },
      PEOPLE:       { weight: 0.12, description: 'Utilization, retention, skills coverage' },
      GROWTH:       { weight: 0.10, description: 'Pipeline health, conversion, new logos'  },
      GOVERNANCE:   { weight: 0.05, description: 'Policy compliance, audit trail'          },
    },
    day0Target: 62,
    day90Target: 80,
    day180Target: 88,
  },
  coig: {
    baselineMonthly: 5.0,
    targetMonthly: 9.0,
    drivers: ['on-time delivery improvement', 'CSAT uplift', 'DSO reduction', 'pipeline conversion gain'],
  },
  departments: ['Delivery', 'Sales', 'Finance', 'HR', 'Quality', 'Leadership'],
  workflows: [
    'client-onboarding', 'project-kickoff', 'weekly-status', 'milestone-billing',
    'escalation-handling', 'qbr-preparation', 'project-closeout', 'renewal-negotiation',
  ],
  extractedFrom: 'kangqore-global-operations',
  createdAt: '2026-07-17',
}

const FINTECH_PACK_V1 = {
  id: 'fintech-pack-v1',
  name: 'FinTech Pack™',
  version: '1.0.0',
  industry: 'financial-services',
  description: 'Enterprise intelligence pack for banks, NBFCs, and fintech firms. Covers credit risk, regulatory compliance, fraud detection, portfolio management, and digital-channel growth — calibrated for RBI/SEBI-regulated environments.',
  ontology: {
    entities: [
      { type: 'Portfolio', attributes: ['loanType', 'balance', 'npa', 'yield', 'riskBand'] },
      { type: 'Customer',  attributes: ['segment', 'creditScore', 'ltv', 'churnRisk', 'kycStatus'] },
      { type: 'Product',   attributes: ['type', 'arr', 'margin', 'regulatoryClass', 'launchDate'] },
      { type: 'Compliance',attributes: ['regulation', 'status', 'riskLevel', 'deadlineAt'] },
      { type: 'Transaction',attributes: ['amount', 'channel', 'fraudScore', 'timestamp', 'flag'] },
      { type: 'AdvisorRelationship', attributes: ['segment', 'coverage', 'aum', 'satisfactionScore'] },
    ],
    relations: [
      { from: 'Customer',    to: 'Portfolio',  type: 'holds'         },
      { from: 'Portfolio',   to: 'Product',    type: 'contains'      },
      { from: 'Customer',    to: 'Transaction', type: 'initiates'    },
      { from: 'Product',     to: 'Compliance',  type: 'governed_by'  },
      { from: 'AdvisorRelationship', to: 'Customer', type: 'manages' },
    ],
  },
  kpis: [
    { id: 'k1', name: 'Net Interest Margin (NIM)',         unit: '%',  target: 3.8,     pillar: 'FINANCIAL'   },
    { id: 'k2', name: 'Non-Performing Asset Ratio',        unit: '%',  target: 1.8,     pillar: 'RISK'        },
    { id: 'k3', name: 'Customer Acquisition Cost (CAC)',   unit: '₹',  target: 1200,    pillar: 'GROWTH'      },
    { id: 'k4', name: 'Customer Lifetime Value (CLTV)',    unit: '₹',  target: 185000,  pillar: 'CUSTOMER'    },
    { id: 'k5', name: 'Product Cross-sell Ratio',          unit: 'x',  target: 2.4,     pillar: 'GROWTH'      },
    { id: 'k6', name: 'Regulatory Compliance Score',       unit: '/100', target: 94,    pillar: 'REGULATORY'  },
    { id: 'k7', name: 'Digital Transaction Mix',           unit: '%',  target: 78,      pillar: 'DIGITAL'     },
    { id: 'k8', name: 'AUM Growth Rate',                   unit: '%',  target: 18,      pillar: 'FINANCIAL'   },
    { id: 'k9', name: 'Fraud Loss Ratio',                  unit: '%',  target: 0.05,    pillar: 'RISK'        },
    { id: 'k10', name: 'Customer Churn Rate',              unit: '%',  target: 4.2,     pillar: 'CUSTOMER'    },
  ],
  goals: [
    { id: 'g1', title: 'Reduce NPA ratio below 2% by Q4',               pillar: 'RISK',       horizon: '6M'  },
    { id: 'g2', title: 'Grow digital transaction share to 75%',          pillar: 'DIGITAL',    horizon: '9M'  },
    { id: 'g3', title: 'Achieve 93%+ regulatory compliance score',       pillar: 'REGULATORY', horizon: '3M'  },
    { id: 'g4', title: 'Expand CLTV 25% through cross-selling',          pillar: 'CUSTOMER',   horizon: '12M' },
    { id: 'g5', title: 'Launch 3 new fintech products by mid-year',      pillar: 'GROWTH',     horizon: '6M'  },
    { id: 'g6', title: 'Reduce CAC by 15% via digital-first acquisition',pillar: 'FINANCIAL',  horizon: '9M'  },
  ],
  policies: [
    { id: 'p1', title: 'All credit decisions require model score + human review', domain: 'risk',        enforcement: 'HARD' },
    { id: 'p2', title: 'KYC verification mandatory before product activation',    domain: 'compliance',  enforcement: 'HARD' },
    { id: 'p3', title: 'Fraud score >85 auto-blocks transaction',                 domain: 'risk',        enforcement: 'HARD' },
    { id: 'p4', title: 'Regulatory reports filed within 24h of quarter-end',      domain: 'compliance',  enforcement: 'HARD' },
    { id: 'p5', title: 'NPA classification within 90 days of default',            domain: 'risk',        enforcement: 'HARD' },
    { id: 'p6', title: 'AML screening on all transactions >₹5L',                 domain: 'compliance',  enforcement: 'HARD' },
    { id: 'p7', title: 'Customer data residency — in-country only',               domain: 'data',        enforcement: 'HARD' },
    { id: 'p8', title: 'Dual approval required for limits >₹10M',                 domain: 'risk',        enforcement: 'SOFT' },
  ],
  agents: [
    { id: 'a1',  name: 'CreditRiskAgent',          role: 'Monitors NPA signals, flags at-risk portfolios, triggers provisioning alerts' },
    { id: 'a2',  name: 'FraudDetectionAgent',      role: 'Real-time transaction scoring, anomaly detection, automatic blocking above threshold' },
    { id: 'a3',  name: 'RegulatoryAgent',          role: 'Tracks RBI/SEBI deadlines, files compliance calendar, flags overdue obligations' },
    { id: 'a4',  name: 'CrossSellAgent',           role: 'Cross-sell propensity scoring, next-best-product recommendations per customer segment' },
    { id: 'a5',  name: 'ChurnPredictionAgent',     role: 'Early warning system on behavioural churn signals, triggers retention workflow' },
    { id: 'a6',  name: 'PortfolioAgent',           role: 'Suggests portfolio rebalancing, flags concentration risk, optimizes yield mix' },
    { id: 'a7',  name: 'KYCAgent',                 role: 'Automated KYC verification, periodic refresh scheduling, flags expired docs' },
    { id: 'a8',  name: 'AuditTrailAgent',          role: 'Generates immutable compliance audit trails for all critical actions' },
    { id: 'a9',  name: 'SegmentationAgent',        role: 'Behavioural clustering, micro-segment discovery, refreshes monthly' },
    { id: 'a10', name: 'DynamicPricingAgent',      role: 'Interest rate and fee optimization based on risk profile and market conditions' },
    { id: 'a11', name: 'FinancialForecastAgent',   role: 'AUM, NIM, and revenue forecasting using macro signals + internal trends' },
    { id: 'a12', name: 'AlertDispatchAgent',       role: 'Critical threshold breach notifications across all KPI pillars in real time' },
  ],
  oisProfile: {
    pillars: {
      REGULATORY: { weight: 0.25, description: 'RBI/SEBI compliance, reporting accuracy, deadline adherence' },
      RISK:       { weight: 0.20, description: 'NPA levels, fraud loss, credit quality, concentration risk'   },
      FINANCIAL:  { weight: 0.20, description: 'NIM, AUM, revenue, cost-to-income ratio'                     },
      DIGITAL:    { weight: 0.15, description: 'Digital transaction mix, mobile adoption, API latency'        },
      CUSTOMER:   { weight: 0.12, description: 'CLTV, churn rate, satisfaction, cross-sell depth'            },
      GROWTH:     { weight: 0.08, description: 'New product launches, CAC efficiency, market share'          },
    },
    day0Target: 58,
    day90Target: 75,
    day180Target: 85,
  },
  coig: {
    baselineMonthly: 4.0,
    targetMonthly:   8.5,
    drivers: ['NPA reduction', 'digital transaction mix increase', 'cross-sell uplift', 'compliance automation gain'],
  },
  departments: ['Risk', 'Compliance', 'Digital', 'Retail Banking', 'Treasury', 'Product', 'Finance', 'Operations'],
  workflows: [
    'credit-appraisal', 'kyc-onboarding', 'fraud-investigation', 'regulatory-reporting',
    'portfolio-review', 'product-launch', 'customer-escalation', 'npa-recovery',
  ],
  extractedFrom: 'fintech-operations-reference',
  createdAt: '2026-07-17',
}

const HEALTHCARE_PACK_V1 = {
  id: 'healthcare-pack-v1',
  name: 'Healthcare Pack™',
  version: '1.0.0',
  industry: 'healthcare',
  description: 'Enterprise intelligence pack for hospitals, clinic networks, and healthcare groups. Covers patient safety, clinical outcomes, revenue cycle, compliance (NABH/JCI/HIPAA), and operational efficiency across wards, departments, and care pathways.',
  ontology: {
    entities: [
      { type: 'Patient',     attributes: ['mrn', 'segment', 'chronicConditions', 'riskScore', 'paymentType'] },
      { type: 'Appointment', attributes: ['type', 'status', 'duration', 'noShowRisk', 'departmentId'] },
      { type: 'Procedure',   attributes: ['code', 'cost', 'duration', 'complexity', 'department'] },
      { type: 'Claim',       attributes: ['amount', 'status', 'payer', 'denialReason', 'processingDays'] },
      { type: 'Provider',    attributes: ['specialty', 'utilization', 'satisfactionScore', 'caseload'] },
      { type: 'Department',  attributes: ['name', 'bedOccupancy', 'throughput', 'revenue', 'infectionRate'] },
    ],
    relations: [
      { from: 'Patient',     to: 'Appointment', type: 'books'       },
      { from: 'Appointment', to: 'Procedure',   type: 'results_in'  },
      { from: 'Procedure',   to: 'Claim',       type: 'generates'   },
      { from: 'Provider',    to: 'Appointment', type: 'conducts'    },
      { from: 'Department',  to: 'Provider',    type: 'employs'     },
    ],
  },
  kpis: [
    { id: 'k1', name: 'Patient Satisfaction (HCAHPS)',     unit: '/10',   target: 8.5,  pillar: 'EXPERIENCE'    },
    { id: 'k2', name: 'Average Revenue per Bed Day',       unit: '₹',     target: 22000, pillar: 'FINANCIAL'    },
    { id: 'k3', name: 'Bed Occupancy Rate',                unit: '%',     target: 82,   pillar: 'OPERATIONS'    },
    { id: 'k4', name: 'Claims Denial Rate',                unit: '%',     target: 4.5,  pillar: 'FINANCIAL'     },
    { id: 'k5', name: 'Average Length of Stay (ALOS)',     unit: 'days',  target: 3.8,  pillar: 'CLINICAL'      },
    { id: 'k6', name: 'Staff Utilization Rate',            unit: '%',     target: 80,   pillar: 'OPERATIONS'    },
    { id: 'k7', name: 'Appointment No-Show Rate',          unit: '%',     target: 8,    pillar: 'OPERATIONS'    },
    { id: 'k8', name: 'Surgical Site Infection Rate',      unit: '/1000', target: 0.8,  pillar: 'PATIENT_SAFETY'},
    { id: 'k9', name: '30-Day Readmission Rate',           unit: '%',     target: 5.5,  pillar: 'CLINICAL'      },
    { id: 'k10', name: 'Claims Processing Time',           unit: 'days',  target: 18,   pillar: 'FINANCIAL'     },
  ],
  goals: [
    { id: 'g1', title: 'Achieve NABH/JCI accreditation by Q4',                pillar: 'COMPLIANCE',     horizon: '9M'  },
    { id: 'g2', title: 'Reduce claims denial rate to below 5%',                pillar: 'FINANCIAL',      horizon: '6M'  },
    { id: 'g3', title: 'Improve patient satisfaction to 8.5+/10',             pillar: 'EXPERIENCE',     horizon: '6M'  },
    { id: 'g4', title: 'Reduce bed turnaround time by 20%',                   pillar: 'OPERATIONS',     horizon: '3M'  },
    { id: 'g5', title: 'Grow surgical volumes by 15% YoY',                    pillar: 'FINANCIAL',      horizon: '12M' },
    { id: 'g6', title: 'Enrol 80% chronic patients in preventive care',       pillar: 'CLINICAL',       horizon: '9M'  },
  ],
  policies: [
    { id: 'p1', title: 'Patient consent required before any data sharing',      domain: 'compliance',   enforcement: 'HARD' },
    { id: 'p2', title: 'Critical deterioration alert within 15 minutes',        domain: 'patient_safety',enforcement: 'HARD' },
    { id: 'p3', title: 'Dual sign-off for high-risk procedures (ASA ≥3)',       domain: 'clinical',     enforcement: 'HARD' },
    { id: 'p4', title: 'Claims filed within 48h of patient discharge',          domain: 'finance',      enforcement: 'HARD' },
    { id: 'p5', title: 'Adverse event reported to quality team within 24h',     domain: 'compliance',   enforcement: 'HARD' },
    { id: 'p6', title: 'Drug formulary compliance for all inpatient scripts',   domain: 'clinical',     enforcement: 'SOFT' },
    { id: 'p7', title: 'Infection control audit weekly in ICU and surgical',    domain: 'patient_safety',enforcement: 'SOFT' },
    { id: 'p8', title: 'Discharge checklist mandatory before bed release',      domain: 'operations',   enforcement: 'HARD' },
  ],
  agents: [
    { id: 'a1',  name: 'PatientRiskAgent',        role: 'Predicts readmission and clinical deterioration, triggers rapid-response alerts' },
    { id: 'a2',  name: 'AppointmentAgent',         role: 'No-show prediction, auto-reminder scheduling, slot optimisation' },
    { id: 'a3',  name: 'ClaimsAgent',              role: 'Denial prevention (pre-submission checks), auto-resubmission on rejection' },
    { id: 'a4',  name: 'BedManagementAgent',       role: 'Real-time occupancy tracking, discharge planning, bed allocation' },
    { id: 'a5',  name: 'ComplianceAgent',          role: 'NABH/HIPAA deadline tracking, accreditation milestone management' },
    { id: 'a6',  name: 'StaffingAgent',            role: 'Shift optimisation, overtime alerts, utilisation heatmaps per department' },
    { id: 'a7',  name: 'InfectionControlAgent',    role: 'Monitors SSI and HAI patterns, flags outbreak clusters, triggers protocols' },
    { id: 'a8',  name: 'ClinicalQualityAgent',     role: 'Tracks ALOS, readmission, complication rates — surfaces improvement opportunities' },
    { id: 'a9',  name: 'RevenueCycleAgent',        role: 'Payor mix optimisation, denial management, revenue leakage detection' },
    { id: 'a10', name: 'PharmacyAgent',            role: 'Formulary compliance monitoring, drug interaction alerts, expiry tracking' },
    { id: 'a11', name: 'PatientExperienceAgent',   role: 'HCAHPS score tracking, complaint resolution workflows, NPS improvement' },
    { id: 'a12', name: 'CapacityForecastAgent',    role: 'Demand forecasting for beds, OT slots, staff, and consumables' },
  ],
  oisProfile: {
    pillars: {
      PATIENT_SAFETY: { weight: 0.25, description: 'SSI rates, adverse events, critical alerts, medication errors'     },
      CLINICAL:       { weight: 0.20, description: 'Readmission, ALOS, complication rates, outcome benchmarks'          },
      FINANCIAL:      { weight: 0.18, description: 'Revenue per bed, claims denial, ALOS economics, payor mix'          },
      COMPLIANCE:     { weight: 0.17, description: 'NABH/JCI/HIPAA adherence, audit scores, policy enforcement'        },
      OPERATIONS:     { weight: 0.12, description: 'Bed occupancy, staff utilization, turnaround time, OT efficiency'  },
      EXPERIENCE:     { weight: 0.08, description: 'Patient satisfaction (HCAHPS), complaint resolution, NPS'           },
    },
    day0Target: 55,
    day90Target: 72,
    day180Target: 82,
  },
  coig: {
    baselineMonthly: 3.5,
    targetMonthly:   7.5,
    drivers: ['claims denial reduction', 'bed occupancy improvement', 'patient satisfaction uplift', 'average length of stay reduction'],
  },
  departments: ['Inpatient', 'Outpatient', 'Surgical', 'ICU', 'Emergency', 'Pharmacy', 'Finance', 'Quality', 'HR'],
  workflows: [
    'patient-admission', 'discharge-planning', 'surgical-scheduling', 'claims-submission',
    'infection-control-audit', 'accreditation-prep', 'critical-care-escalation', 'staff-rostering',
  ],
  extractedFrom: 'healthcare-operations-reference',
  createdAt: '2026-07-17',
}

const PACK_MAP: Record<string, unknown> = {
  'ps-pack-v1':         PS_PACK_V1,
  'fintech-pack-v1':    FINTECH_PACK_V1,
  'healthcare-pack-v1': HEALTHCARE_PACK_V1,
}

const AVAILABLE_PACKS = [
  { id: 'ps-pack-v1',         name: 'Professional Services Pack™', version: '1.0.0', industry: 'professional-services', kpis: 10, goals: 6, agents: 12, policies: 8 },
  { id: 'fintech-pack-v1',    name: 'FinTech Pack™',               version: '1.0.0', industry: 'financial-services',   kpis: 10, goals: 6, agents: 12, policies: 8 },
  { id: 'healthcare-pack-v1', name: 'Healthcare Pack™',            version: '1.0.0', industry: 'healthcare',           kpis: 10, goals: 6, agents: 12, policies: 8 },
]

router.get('/enterprise/packs', authenticate, authorize(['ADMIN']), (_req: AuthenticatedRequest, res: Response) => {
  res.json({ packs: AVAILABLE_PACKS })
})

router.get('/enterprise/packs/:slug', authenticate, authorize(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const pack = PACK_MAP[req.params.slug]
  if (pack) return res.json(pack)
  res.status(404).json({ error: `Pack '${req.params.slug}' not found` })
})

// ─── Adoption Event Logging ────────────────────────────────────────────────────
router.post('/adoption/event', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { eventType, entityType, entityId, metadata } = req.body
    const validTypes = ['SESSION', 'AGENT_INVOKE', 'WORKFLOW_TRIGGER', 'DECISION_ACCEPT', 'DECISION_REJECT', 'OVERRIDE', 'REC_ACTED', 'REC_IGNORED']
    if (!validTypes.includes(eventType)) {
      return res.status(400).json({ error: `Invalid eventType. Must be one of: ${validTypes.join(', ')}` })
    }
    const created = await logAdoptionEvent(eventType, (req as any).user?.id, entityType, entityId, metadata)
    res.status(201).json({ id: created.id, eventType })
  } catch (err) { next(err) }
})

// Save baseline snapshot
router.post('/gate8/baseline', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const snap = await createGate8Snapshot('MANUAL', undefined, 'BASELINE')
    invalidatePulseCache()
    res.status(201).json(snap)
  } catch (err) { next(err) }
})

// ─── Enterprise Coach™ ────────────────────────────────────────────────────────

router.get('/enterprise/coach', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const insights = await getLatestCoachingInsights()
    res.json(insights)
  } catch (err) { next(err) }
})

router.post('/enterprise/coach/refresh', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const insights = await computeCoachingInsights()
    res.json(insights)
  } catch (err) { next(err) }
})

router.post('/enterprise/coach/:id/act', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await markInsightActed(req.params.id)
    await logAdoptionEvent('REC_ACTED', (req as any).user?.id, 'coaching_insight', req.params.id, { source: 'enterprise_coach' })
    res.json({ ok: true })
  } catch (err) { next(err) }
})

// ─── Decision Engine (Track C) ────────────────────────────────────────────────

// GET /admin/enterprise/decisions — list recent decisions (optional ?status=OPEN)
router.get('/enterprise/decisions', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string | undefined
    res.json(await listEnterpriseDecisions(status))
  } catch (err) { next(err) }
})

// POST /admin/enterprise/decisions — ask WAANDA a strategic question
router.post('/enterprise/decisions', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { question } = req.body as { question?: string }
    if (!question?.trim()) { res.status(400).json({ error: 'question required' }); return }
    await logAdoptionEvent('AGENT_INVOKE', (req as any).user?.id, 'decision_engine', undefined, { question: question.slice(0, 100) })
    const decision = await createDecision(question.trim())
    res.json(decision)
  } catch (err) { next(err) }
})

// GET /admin/enterprise/decisions/:id — get single decision
router.get('/enterprise/decisions/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const d = await getDecision(req.params.id)
    if (!d) { res.status(404).json({ error: 'not found' }); return }
    res.json(d)
  } catch (err) { next(err) }
})

// POST /admin/enterprise/decisions/:id/resolve — pick an option
router.post('/enterprise/decisions/:id/resolve', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { selected } = req.body as { selected?: string }
    if (!selected) { res.status(400).json({ error: 'selected option label required' }); return }
    const userId = (req as any).user?.id ?? 'ADMIN'
    await logAdoptionEvent('DECISION_ACCEPT', userId, 'enterprise_decision', req.params.id, { selected })
    invalidatePulseCache()
    res.json(await resolveDecision(req.params.id, selected, userId))
  } catch (err) { next(err) }
})

// Policy Engine
router.get('/enterprise/policies', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json(await listPolicies()) } catch (err) { next(err) }
})

router.post('/enterprise/policies', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, trigger, condition, effect, priority } = req.body
    if (!name || !trigger || !effect) { res.status(400).json({ error: 'name, trigger, effect required' }); return }
    res.status(201).json(await createPolicy({ name, description: description ?? '', trigger, condition: condition ?? {}, effect, priority: priority ?? 0 }))
  } catch (err) { next(err) }
})

router.patch('/enterprise/policies/:id/toggle', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { enabled } = req.body as { enabled: boolean }
    res.json(await togglePolicy(req.params.id, enabled))
  } catch (err) { next(err) }
})

router.delete('/enterprise/policies/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { await deletePolicy(req.params.id); res.json({ ok: true }) } catch (err) { next(err) }
})

// Policy check (used internally by agents — also exposed for testing)
router.post('/enterprise/policies/check', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { trigger, params } = req.body as { trigger: string; params: Record<string, unknown> }
    res.json(await checkPolicy(trigger, params ?? {}))
  } catch (err) { next(err) }
})

// ─── Customer Deployments (Blueprint Wizard CRUD) ────────────────────────────
// NOTE: GET /enterprise/deployments (above, line ~2908) is the Customer Success
// Platform handler returning EnterpriseBlueprint health. This set uses the
// /enterprise/customer-deployments prefix to avoid Express first-match shadowing.

router.get('/enterprise/customer-deployments', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let deployments = await prisma.customerDeployment.findMany({ orderBy: { createdAt: 'desc' } })
    // Auto-seed on first use so the Blueprint Wizard always has at least Customer One
    if (deployments.length === 0) {
      await prisma.customerDeployment.createMany({
        data: [
          {
            customerName: 'Kangqore Global',
            industry:     'professional-services',
            pack:         'professional-services',
            milestone:    'LIVE',
            currentOis:   78.9,
            coig:         5.0,
            contactName:  'Mahesh Kumar',
            contactEmail: 'kangqore@gmail.com',
            notes:        'Customer Zero — Kangqore Global. Day 0 OIS 78.9 locked 2026-07-17.',
          },
          {
            customerName: 'Birla Digital Labs',
            industry:     'professional-services',
            pack:         'professional-services',
            milestone:    'ONBOARDING',
            currentOis:   0,
            coig:         0,
            contactName:  'Aditya Birla',
            contactEmail: 'aditya@birladigitallabs.in',
            notes:        'Customer One — Birla Digital Labs. Projected ₹25L. Enterprise PS Pack. Target go-live 2026-09-01.',
          },
        ],
        skipDuplicates: true,
      })
      deployments = await prisma.customerDeployment.findMany({ orderBy: { createdAt: 'desc' } })
    }
    res.json(deployments)
  } catch (err) { next(err) }
})

router.post('/enterprise/customer-deployments', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { customerName, industry, pack, contactName, contactEmail, notes } = req.body as {
      customerName: string; industry: string; pack: string
      contactName?: string; contactEmail?: string; notes?: string
    }
    if (!customerName || !industry) { res.status(400).json({ error: 'customerName and industry required' }); return }
    const d = await prisma.customerDeployment.create({
      data: { customerName, industry, pack: pack ?? 'professional-services', contactName, contactEmail, notes },
    })
    res.status(201).json(d)
  } catch (err) { next(err) }
})

router.patch('/enterprise/customer-deployments/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { currentOis, coig, milestone, goLiveAt, baselineSnapshotId, pack, notes } = req.body
    const d = await prisma.customerDeployment.update({
      where: { id: req.params.id },
      data:  {
        currentOis, coig, milestone, pack,
        goLiveAt: milestone === 'LIVE' ? new Date() : (goLiveAt ? new Date(goLiveAt) : undefined),
        baselineSnapshotId, notes,
      },
    })
    res.json(d)
  } catch (err) { next(err) }
})

router.delete('/enterprise/customer-deployments/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { await prisma.customerDeployment.delete({ where: { id: req.params.id } }); res.json({ ok: true }) }
  catch (err) { next(err) }
})

// ─── Enterprise Blueprint ──────────────────────────────────────────────────────
// The portable, versioned deployment spec. WAANDA reads it. The customer owns it.

// GET  /admin/enterprise/blueprints            — list all blueprints
router.get('/enterprise/blueprints', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json(await listBlueprints()) } catch (err) { next(err) }
})

// GET  /admin/enterprise/blueprints/:id        — get single blueprint (full spec)
router.get('/enterprise/blueprints/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const blueprint = await getBlueprint(req.params.id)
    if (!blueprint) return res.status(404).json({ error: 'Blueprint not found' })
    res.json(blueprint)
  } catch (err) { next(err) }
})

// POST /admin/enterprise/blueprints/generate   — assemble Blueprint from live DB state
router.post('/enterprise/blueprints/generate', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name = 'Enterprise Blueprint', orgName = 'Kangqore', pack = 'professional-services', industry = 'professional-services', orgSize = 'SME' } = req.body
    const result = await generateBlueprint(name, orgName, pack, industry, orgSize)
    res.json(result)
  } catch (err) { next(err) }
})

// POST /admin/enterprise/blueprints/validate   — validate a Blueprint spec before import
router.post('/enterprise/blueprints/validate', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json(validateBlueprint(req.body.spec)) } catch (err) { next(err) }
})

// POST /admin/enterprise/blueprints/import     — provision from Blueprint spec
router.post('/enterprise/blueprints/import', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { spec, name = 'Imported Blueprint' } = req.body
    if (!spec) return res.status(400).json({ error: 'spec is required' })
    const result = await importBlueprint(spec, name)
    res.status(201).json(result)
  } catch (err) { next(err) }
})

// PATCH /admin/enterprise/blueprints/:id/activate — mark as ACTIVE + set deployedAt
router.patch('/enterprise/blueprints/:id/activate', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json(await activateBlueprint(req.params.id)) } catch (err) { next(err) }
})

// POST /admin/enterprise/blueprints/:id/apply-pack — S97 pack activation
// Installs a named industry pack into the platform (ontology types, workflows, policies, agents)
// and records the applied pack on the Blueprint record.
router.post('/enterprise/blueprints/:id/apply-pack', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { packId } = req.body
    if (!packId) return res.status(400).json({ error: 'packId is required' })
    await PackRegistry.install(packId, req.user?.userId)
    // Record applied pack on the blueprint spec
    const bp = await getBlueprint(req.params.id).catch(() => null)
    if (bp) {
      const spec = (bp.spec ?? {}) as Record<string, any>
      const appliedPacks: string[] = Array.isArray(spec.appliedPacks) ? spec.appliedPacks : []
      if (!appliedPacks.includes(packId)) appliedPacks.push(packId)
      await (prisma as any).customerBlueprint.update({
        where: { id: req.params.id },
        data:  { spec: { ...spec, appliedPacks } },
      })
    }
    const stats = await PackRegistry.stats()
    res.json({ ok: true, packId, stats })
  } catch (err) { next(err) }
})

// PATCH /admin/enterprise/blueprints/:id/archive — archive a blueprint
router.patch('/enterprise/blueprints/:id/archive', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json(await archiveBlueprint(req.params.id)) } catch (err) { next(err) }
})

// GET /admin/enterprise/blueprints/:id/gaps — list gaps captured for this deployment
router.get('/enterprise/blueprints/:id/gaps', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const gaps = await getBlueprintGaps(req.params.id)
    res.json({ gaps, count: gaps.length })
  } catch (err) { next(err) }
})

// POST /admin/enterprise/blueprints/:id/gaps — record a pack gap identified during deployment
// Body: { category, description, severity, packVersion }
// category: MISSING_ENTITY | MISSING_POLICY | MISSING_AGENT | MISSING_WORKFLOW | MISSING_CONFIG | INTEGRATION | OTHER
// severity: HIGH | MEDIUM | LOW
router.post('/enterprise/blueprints/:id/gaps', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { category, description, severity, packVersion } = req.body
    if (!category || !description || !severity) {
      return res.status(400).json({ error: 'category, description, and severity are required' })
    }
    const validCategories = ['MISSING_ENTITY', 'MISSING_POLICY', 'MISSING_AGENT', 'MISSING_WORKFLOW', 'MISSING_CONFIG', 'INTEGRATION', 'OTHER']
    const validSeverities = ['HIGH', 'MEDIUM', 'LOW']
    if (!validCategories.includes(category)) return res.status(400).json({ error: `Invalid category. Valid: ${validCategories.join(', ')}` })
    if (!validSeverities.includes(severity))  return res.status(400).json({ error: `Invalid severity. Valid: ${validSeverities.join(', ')}` })
    const gaps = await addBlueprintGap(req.params.id, { category, description, severity, packVersion: packVersion ?? '1.0.0' })
    res.status(201).json({ gaps, count: gaps.length })
  } catch (err) { next(err) }
})

// ─── Wave 1: Project Operational State ────────────────────────────────────────

// GET /admin/projects/:id/ops — cached state; triggers assessment if stale >6h
router.get('/projects/:id/ops', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    let state = await getProjectOps(id)
    if (!state || new Date(state.lastAssessment).getTime() < Date.now() - 6 * 3600_000) {
      state = await assessProject(id)
    }
    res.json(state)
  } catch (err) { next(err) }
})

// POST /admin/projects/:id/ops — force re-assessment
router.post('/projects/:id/ops', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const state = await assessProject(req.params.id)
    res.json(state)
  } catch (err) { next(err) }
})

// POST /admin/projects/ops/sweep — daily sweep of all active projects
router.post('/projects/ops/sweep', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await sweepAllProjects()
    res.json(result)
  } catch (err) { next(err) }
})

// GET /admin/projects/ops/portfolio — all project ops states for Mission Control
router.get('/projects/ops/portfolio', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const db = new PrismaClient()
    const states = await db.projectOperationalState.findMany({
      orderBy: { health: 'asc' },
      include: { project: { select: { title: true, dueDate: true } } },
    })
    await db.$disconnect()
    res.json(states)
  } catch (err) { next(err) }
})

// ─── Wave 1: Project Digital Twin™ ────────────────────────────────────────────

// GET /admin/projects/:id/twin — cached twin or compute fresh
router.get('/projects/:id/twin', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    let twin = await getTwin(id)
    if (!twin || new Date(twin.simulatedAt).getTime() < Date.now() - 6 * 3600_000) {
      twin = await simulateTwin(id)
    }
    res.json(twin)
  } catch (err) { next(err) }
})

// POST /admin/projects/:id/twin/simulate — on-demand simulation with params
router.post('/projects/:id/twin/simulate', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { extraResources } = req.body ?? {}
    const twin = await simulateTwin(req.params.id, extraResources ?? 0)
    res.json(twin)
  } catch (err) { next(err) }
})

// ─── Gate 8.3 — Enterprise Digital Twin™ ─────────────────────────────────────

// POST /admin/gate8/twin/simulate — run a "what if" enterprise scenario
router.post('/gate8/twin/simulate', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { scenario, horizon = 30 } = req.body ?? {}
    if (!scenario || typeof scenario !== 'string' || scenario.trim().length < 5) {
      return res.status(400).json({ error: 'scenario is required (min 5 chars)' })
    }
    const h = [30, 60, 90].includes(Number(horizon)) ? Number(horizon) as 30|60|90 : 30
    const result = await simulateEnterpriseTwin(scenario.trim(), h)
    res.json(result)
  } catch (err) { next(err) }
})

// GET /admin/gate8/twin/scenarios — list past simulation results
router.get('/gate8/twin/scenarios', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 10), 50)
    res.json(await listTwinScenarios(limit))
  } catch (err) { next(err) }
})

// GET /admin/gate8/twin/scenarios/compare — accuracy: predicted OIS delta vs actual OIS trajectory
router.get('/gate8/twin/scenarios/compare', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const minAgeDays = Math.max(1, Number(req.query.minAgeDays ?? 30))
    const limit      = Math.min(Number(req.query.limit ?? 20), 50)
    res.json(await compareScenarios(minAgeDays, limit))
  } catch (err) { next(err) }
})

// S82 — Push subscription registration
router.post('/push-subscribe', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { subscription } = req.body
    if (!subscription?.endpoint || !subscription?.keys?.auth || !subscription?.keys?.p256dh) {
      return res.status(400).json({ error: 'Invalid subscription object' })
    }
    const userId = (req as any).user?.id
    await saveSubscription(subscription.endpoint, subscription.keys.auth, subscription.keys.p256dh, userId)
    res.json({ ok: true })
  } catch (err) { next(err) }
})

// S82 — VAPID public key (frontend needs this to subscribe)
router.get('/push-vapid-key', (_req, res: Response) => {
  const key = process.env.VAPID_PUBLIC_KEY ?? ''
  res.json({ publicKey: key })
})

// ── Permission Scope management (S84 RBAC) ────────────────────────────────────

// GET /admin/permissions — list all permission scopes
router.get('/permissions', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const scopes = await (prisma as any).permissionScope.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(scopes)
  } catch (err) { next(err) }
})

// POST /admin/permissions — grant a permission scope
router.post('/permissions', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, workspace, feature, action } = req.body
    if (!userId || !workspace || !feature || !action) {
      return res.status(400).json({ error: 'userId, workspace, feature, action required' })
    }
    const scope = await (prisma as any).permissionScope.upsert({
      where: { userId_workspace_feature: { userId, workspace, feature } },
      update: { action, grantedBy: req.user?.userId ?? 'system' },
      create: { userId, workspace, feature, action, grantedBy: req.user?.userId ?? 'system' },
    })
    const { createAuditLog, extractRequestMetadata, AUDIT_ACTIONS } = await import('../services/audit.service')
    await createAuditLog({
      userId: req.user?.userId,
      action: AUDIT_ACTIONS.PERMISSION_GRANTED,
      resource: `${workspace}:${feature}:${action}`,
      newValue: { targetUserId: userId, scopeId: scope.id },
      ...extractRequestMetadata(req),
    }).catch(() => {})
    res.status(201).json(scope)
  } catch (err) { next(err) }
})

// DELETE /admin/permissions/:id — revoke a permission scope
router.delete('/permissions/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const scope = await (prisma as any).permissionScope.delete({ where: { id: req.params.id } })
    const { createAuditLog, extractRequestMetadata, AUDIT_ACTIONS } = await import('../services/audit.service')
    await createAuditLog({
      userId: req.user?.userId,
      action: AUDIT_ACTIONS.PERMISSION_REVOKED,
      resource: `${scope.workspace}:${scope.feature}:${scope.action}`,
      newValue: { targetUserId: scope.userId, scopeId: scope.id },
      ...extractRequestMetadata(req),
    }).catch(() => {})
    res.json({ ok: true })
  } catch (err) { next(err) }
})

// ── Onboarding (S85) ─────────────────────────────────────────────────────────

// GET /admin/onboarding — fetch or create the current user's onboarding state
router.get('/onboarding', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    if (!userId) return res.status(401).json({ error: 'Auth required' })
    let state = await (prisma as any).onboardingState.findUnique({ where: { userId } })
    if (!state) {
      state = await (prisma as any).onboardingState.create({ data: { userId } })
    }
    res.json(state)
  } catch (err) { next(err) }
})

// PATCH /admin/onboarding — advance step or mark complete
router.patch('/onboarding', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    if (!userId) return res.status(401).json({ error: 'Auth required' })
    const { currentStep, completed, oisBaseline } = req.body
    const data: any = {}
    if (typeof currentStep === 'number') data.currentStep = currentStep
    if (typeof completed  === 'boolean') {
      data.completed   = completed
      if (completed) data.completedAt = new Date()
    }
    if (typeof oisBaseline === 'number') data.oisBaseline = oisBaseline
    const state = await (prisma as any).onboardingState.upsert({
      where:  { userId },
      update: data,
      create: { userId, ...data },
    })
    res.json(state)
  } catch (err) { next(err) }
})

export default router;

