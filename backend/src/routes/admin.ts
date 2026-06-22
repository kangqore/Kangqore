import { Router, Response, NextFunction } from 'express';
import * as os from 'os';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';
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

export default router;
