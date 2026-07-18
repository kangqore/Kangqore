import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../lib/prisma';
import { emailService } from '../services/email.service';
import logger from '../utils/logger';
import { createError } from '../middleware/errorHandler';
import { requireAuth, requireRole, AuthRequest } from '../middleware/rbac';
import { notifyNewEmail } from '../services/notificationService';
import { escapeHtml } from '../utils/sanitize';

const router = Router();

// Validation schema
const applicationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().allow(''),
  position: Joi.string().min(2).max(200).required(),
  resumeUrl: Joi.string().uri().optional().allow(''),
  coverLetter: Joi.string().max(5000).optional().allow(''),
  linkedin: Joi.string().uri().optional().allow(''),
  portfolio: Joi.string().uri().optional().allow(''),
  experience: Joi.string().max(50).optional().allow(''),
  location: Joi.string().max(100).optional().allow(''),
  expectedSalary: Joi.string().max(50).optional().allow(''),
  source: Joi.string().max(50).optional()
});

/**
 * POST /api/careers/apply
 * Submit a job application (public)
 */
function shapeJob(j: Awaited<ReturnType<typeof prisma.job.findMany>>[0] & { _count?: { applications: number } }) {
  return {
    id:           j.id,
    title:        j.title,
    department:   j.department ?? 'general',
    type:         j.type,
    location:     j.location ?? 'Remote',
    description:  j.description,
    status:       j.status.toLowerCase(),
    salaryRange:  j.salaryRange ?? '',
    requirements: j.requirements,
    applications: j._count?.applications ?? 0,
    createdAt:    j.createdAt.toISOString().slice(0, 10),
  }
}

// GET /api/careers/jobs — list of open roles (public)
router.get('/jobs', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { applications: true } } },
    })
    res.json({ jobs: jobs.map(shapeJob) })
  } catch (err) {
    next(err)
  }
})

// GET /api/careers/jobs/all — all jobs including non-open (admin only)
router.get('/jobs/all', requireAuth, requireRole(['ADMIN']), async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { applications: true } } },
    })
    res.json({ jobs: jobs.map(shapeJob) })
  } catch (err) {
    next(err)
  }
})

// POST /api/careers/jobs — create a job (admin only)
router.post('/jobs', requireAuth, requireRole(['ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, department, location, type, salaryRange, requirements } = req.body
    if (!title || !description || !type) return res.status(400).json({ message: 'title, description, type are required' })
    const job = await prisma.job.create({
      data: { title, description, department: department ?? 'general', location: location ?? 'Remote', type, salaryRange: salaryRange ?? '', requirements: requirements ?? [], status: 'OPEN' },
      include: { _count: { select: { applications: true } } },
    })
    res.status(201).json(shapeJob(job))
  } catch (err) {
    next(err)
  }
})

// PATCH /api/careers/jobs/:id — update a job (admin only)
router.patch('/jobs/:id', requireAuth, requireRole(['ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, department, location, type, status, salaryRange, requirements } = req.body
    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: {
        ...(title        !== undefined && { title }),
        ...(description  !== undefined && { description }),
        ...(department   !== undefined && { department }),
        ...(location     !== undefined && { location }),
        ...(type         !== undefined && { type }),
        ...(status       !== undefined && { status: status.toUpperCase() }),
        ...(salaryRange  !== undefined && { salaryRange }),
        ...(requirements !== undefined && { requirements }),
      },
      include: { _count: { select: { applications: true } } },
    })
    res.json(shapeJob(job))
  } catch (err) {
    next(err)
  }
})

router.post('/apply', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = applicationSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { 
      name, email, phone, position, resumeUrl, coverLetter, 
      linkedin, portfolio, experience, location, expectedSalary, source 
    } = value;

    // Create job application
    const application = await prisma.jobApplication.create({
      data: {
        name,
        email,
        phone,
        position,
        resumeUrl,
        coverLetter,
        linkedin,
        portfolio,
        experience,
        location,
        expectedSalary,
        source: source || 'careers-page'
      }
    });

    // Send confirmation email to applicant
    try {
      await emailService.sendEmail({
        to: email,
        subject: `Application Received: ${position} - Kangqore`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Thank you for applying!</h2>
            <p>Dear ${name},</p>
            <p>We have received your application for the <strong>${position}</strong> position and our recruitment team will review it shortly.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Application Details:</h3>
              <p><strong>Position:</strong> ${position}</p>
              <p><strong>Experience:</strong> ${experience || 'Not specified'}</p>
              ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
            </div>
            <p>We will contact you if your profile matches our requirements.</p>
            <p>Best regards,<br/>The Kangqore HR Team</p>
          </div>
        `
      });

      // Send notification to HR/Admin
      await emailService.sendEmail({
        to: process.env.HR_EMAIL || process.env.ADMIN_EMAIL || 'hr@kangqore.com',
        subject: `New Job Application: ${position} - ${name}`,
        html: `
          <h3>New Job Application Received</h3>
          <p><strong>Position:</strong> ${position}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Experience:</strong> ${experience || 'Not specified'}</p>
          <p><strong>Location:</strong> ${location || 'Not specified'}</p>
          ${expectedSalary ? `<p><strong>Expected Salary:</strong> ${expectedSalary}</p>` : ''}
          ${linkedin ? `<p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>` : ''}
          ${portfolio ? `<p><strong>Portfolio:</strong> <a href="${portfolio}">${portfolio}</a></p>` : ''}
          ${resumeUrl ? `<p><strong>Resume:</strong> <a href="${resumeUrl}">Download</a></p>` : ''}
          ${coverLetter ? `<p><strong>Cover Letter:</strong><br/>${coverLetter}</p>` : ''}
          <p><strong>Source:</strong> ${source || 'careers-page'}</p>
        `
      });
    } catch (emailError) {
      logger.error('Failed to send application emails:', emailError);
    }

    res.status(201).json({
      message: 'Your application has been submitted successfully. We will review it and get back to you soon.',
      application: {
        id: application.id,
        name: application.name,
        email: application.email,
        position: application.position
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/careers/my-application
 * Get the authenticated job seeker's own application (matched by email)
 */
router.get('/my-application', requireAuth, requireRole(['JOB_SEEKER', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const application = await prisma.jobApplication.findFirst({
      where: { email: req.user!.email },
      orderBy: { createdAt: 'desc' },
      include: { job: { select: { title: true, department: true, location: true } } },
    })

    if (!application) return res.status(404).json({ message: 'No application found' })

    res.json({
      id:             application.id,
      role:           application.position,
      appliedDate:    application.createdAt.toISOString().slice(0, 10),
      status:         application.status,
      location:       application.job?.location ?? application.location ?? '—',
      salary:         application.expectedSalary ?? '—',
      notes:          application.notes ?? '',
      interviewedAt:  application.interviewedAt?.toISOString().slice(0, 10) ?? null,
    })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/careers/applications
 * Get all job applications (admin only)
 */
router.get('/applications', requireAuth, requireRole(['ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, position, page = 1, limit = 20 } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (position) where.position = position;

    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.jobApplication.count({ where })
    ]);

    res.json({
      applications,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/careers/applications/:id
 * Update application status (admin only)
 */
router.patch('/applications/:id', requireAuth, requireRole(['ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes, interviewedAt } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (interviewedAt) updateData.interviewedAt = new Date(interviewedAt);

    const application = await prisma.jobApplication.update({
      where: { id },
      data: updateData
    });

    res.json({ application });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/careers/stats
 * Get application statistics (admin only)
 */
router.get('/stats', requireAuth, requireRole(['ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [total, received, reviewing, shortlisted, interviewing, offered] = await Promise.all([
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: 'RECEIVED' } }),
      prisma.jobApplication.count({ where: { status: 'REVIEWING' } }),
      prisma.jobApplication.count({ where: { status: 'SHORTLISTED' } }),
      prisma.jobApplication.count({ where: { status: 'INTERVIEWING' } }),
      prisma.jobApplication.count({ where: { status: 'OFFERED' } })
    ]);

    res.json({
      stats: {
        total,
        received,
        reviewing,
        shortlisted,
        interviewing,
        offered
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/careers/emails
 * Get emails for the logged-in job seeker
 */
/**
 * GET /api/careers/emails
 * Get emails for the logged-in job seeker
 */
router.get('/emails', requireAuth, requireRole(['JOB_SEEKER', 'ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { folder, starred, important, search } = req.query;
    const where: any = { jobSeekerId: userId };
    
    if (folder) where.jobSeekerFolder = (folder as string).toUpperCase();
    else if (!starred && !important && !search) where.jobSeekerFolder = { notIn: ['SPAM', 'TRASH'] };
    
    if (starred === 'true') where.isJobSeekerStarred = true;
    if (important === 'true') where.isJobSeekerImportant = true;
    if (search) {
        where.OR = [
            { subject: { contains: search as string, mode: 'insensitive' } },
            { body: { contains: search as string, mode: 'insensitive' } }
        ];
    }
    
    const emails = await prisma.emailLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        jobSeeker: { select: { name: true, email: true } }
      }
    });
    res.json({ emails });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/careers/emails/reply
 * Job Seeker reply to admin/HR
 */
router.post('/emails/reply', requireAuth, requireRole(['JOB_SEEKER']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { emailId, content: rawContent, subject } = req.body;
    const userId = req.user!.userId;

    const jobSeeker = await prisma.user.findUnique({ where: { id: userId } });
    if (!jobSeeker) throw createError('User not found', 404);

    if (!rawContent) throw createError('Content required', 400);
    const content = escapeHtml(rawContent);

    let originalEmail = null;
    let threadId = null;
    let replySubject = subject || 'Job Seeker Message';

    if (emailId) {
      originalEmail = await prisma.emailLog.findUnique({ where: { id: emailId } });
      if (originalEmail) {
        threadId = originalEmail.threadId || originalEmail.id;
        replySubject = subject || `Re: ${originalEmail.subject}`;
      }
    }

    const newEmail = await prisma.emailLog.create({
      data: {
        subject: replySubject,
        from: jobSeeker.email || jobSeeker.name,
        to: 'hr@kangqore.com',
        body: content,
        preview: content.substring(0, 100),
        jobSeekerId: userId,
        threadId: threadId || undefined,
        replyToId: emailId || undefined,
        direction: 'inbound',
        hasAttachment: !!(req.body.attachments && req.body.attachments.length > 0),
        attachments: req.body.attachments || [],
        isRead: false,
        isUnread: true,
        jobSeekerFolder: 'SENT',
        adminFolder: 'INBOX'
      },
      include: {
        jobSeeker: { select: { name: true, email: true } }
      }
    });

    // Notify all admins about the new email
    try {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true }
      });
      for (const admin of admins) {
        await notifyNewEmail(admin.id, 'admin', replySubject);
      }
    } catch (notifyError) {
      console.warn('Could not send email notification:', notifyError);
    }

    res.status(201).json({ success: true, message: 'Sent', email: newEmail });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/careers/emails/:id/folder
router.patch('/emails/:id/folder', requireAuth, requireRole(['JOB_SEEKER']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { folder } = req.body;
    const userId = req.user!.userId;
    await prisma.emailLog.updateMany({
      where: { id, jobSeekerId: userId },
      data: { jobSeekerFolder: folder }
    });
    res.json({ success: true });
  } catch (error) { next(error); }
});

// PATCH /api/careers/emails/:id/flags
router.patch('/emails/:id/flags', requireAuth, requireRole(['JOB_SEEKER']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { starred, important, isRead } = req.body;
    const userId = req.user!.userId;
    const data: any = {};
    if (starred !== undefined) data.isJobSeekerStarred = starred;
    if (important !== undefined) data.isJobSeekerImportant = important;
    if (isRead !== undefined) data.isRead = isRead;
    
    await prisma.emailLog.updateMany({
      where: { id, jobSeekerId: userId },
      data
    });
    res.json({ success: true });
  } catch (error) { next(error); }
});

export default router;
