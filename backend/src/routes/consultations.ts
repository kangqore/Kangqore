import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../lib/prisma';
import { emailService } from '../services/email.service';
import logger from '../utils/logger';
import { createError } from '../middleware/errorHandler';
// import { requireAuth, requireRole, AuthRequest } from '../middleware/rbac';
import { authenticate, authorize, AuthenticatedRequest as AuthRequest } from '../middleware/auth';
import { KimmpSystemDispatcher } from '../kangqore-immp/agents/systemDispatcher';

const router = Router();

// Validation schemas
const consultationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().allow(''),
  company: Joi.string().max(100).optional().allow(''),
  service: Joi.string().max(100).optional().allow(''),
  services: Joi.array().items(Joi.string()).optional(), // Added multiple services
  topic: Joi.string().max(200).optional().allow(''), // Added topic
  preferredDate: Joi.string().optional().allow(''),
  message: Joi.string().max(2000).optional().allow(''),
  source: Joi.string().max(50).optional()
});

/**
 * POST /api/consultations
 * Submit a consultation request (public)
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = consultationSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { name, email, phone, company, service, services, topic, preferredDate, message, source } = value;

    // Create consultation request
    const consultation = await prisma.consultation.create({
      data: {
        name,
        email,
        phone,
        company,
        service: service || (services && services.length > 0 ? services[0] : null), // Fallback or primary service
        services: services || [],
        topic, // Save topic
        preferredDate,
        message,
        source: source || 'website'
      }
    });

    // Send confirmation email to user
   try {
      await emailService.sendEmail({
        to: email,
        subject: 'Consultation Request Received - Kangqore',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Thank you for your consultation request!</h2>
            <p>Dear ${name},</p>
            <p>We have received your consultation request and our team will get back to you within 24 hours.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Request Details:</h3>
              <p><strong>Service:</strong> ${service || 'Not specified'}</p>
              ${services && services.length > 0 ? `<p><strong>Additional Interests:</strong> ${services.join(', ')}</p>` : ''}
              ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ''}
              <p><strong>Preferred Date:</strong> ${preferredDate || 'Flexible'}</p>
              ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
            </div>
            <p>Best regards,<br/>The Kangqore Team</p>
          </div>
        `
      });

      // Send notification to admin
      await emailService.sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@kangqore.com',
        subject: `New Consultation Request from ${name}`,
        html: `
          <h3>New Consultation Request</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Service:</strong> ${service || 'Not specified'}</p>
          ${services && services.length > 0 ? `<p><strong>Additional Interests:</strong> ${services.join(', ')}</p>` : ''}
          ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ''}
          <p><strong>Preferred Date:</strong> ${preferredDate || 'Flexible'}</p>
          ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
          <p><strong>Source:</strong> ${source || 'website'}</p>
        `
      });
    } catch (emailError) {
      logger.error('Failed to send consultation emails:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Consultation request submitted successfully',
      consultation: {
        id: consultation.id,
        name: consultation.name,
        email: consultation.email
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/consultations
 * Get all consultation requests (admin only)
 */
router.get('/', authenticate, authorize(['ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const where = status ? { status: status as any } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.consultation.count({ where })
    ]);

    res.json({
      consultations,
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
 * GET /api/consultations/stats
 * Get consultation statistics (admin only)
 */
router.get('/stats', authenticate, authorize(['ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [total, pending, contacted, scheduled, completed, rescheduled] = await Promise.all([
      prisma.consultation.count(),
      prisma.consultation.count({ where: { status: 'PENDING' } }),
      prisma.consultation.count({ where: { status: 'CONTACTED' } }),
      prisma.consultation.count({ where: { status: 'SCHEDULED' } }),
      prisma.consultation.count({ where: { status: 'COMPLETED' } }),
      prisma.consultation.count({ where: { status: 'RESCHEDULED' } })
    ]);

    res.json({
      stats: {
        total,
        pending,
        contacted,
        scheduled,
        completed,
        rescheduled
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/consultations/:id
 * Update consultation status (admin only)
 */
router.patch('/:id', authenticate, authorize(['ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes, scheduledAt, meetingMode, meetingLink, location } = req.body;

    const existingConsultation = await prisma.consultation.findUnique({ where: { id } });
    if (!existingConsultation) return res.status(404).json({ error: 'Consultation not found' });

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (meetingMode) updateData.meetingMode = meetingMode;
    if (meetingLink !== undefined) updateData.meetingLink = meetingLink;
    if (location !== undefined) updateData.location = location;
    
    if (scheduledAt) {
      const newDate = new Date(scheduledAt);
      updateData.scheduledAt = newDate;
      
      // If it's a reschedule (different from current scheduledAt)
      if (existingConsultation.scheduledAt && existingConsultation.scheduledAt.getTime() !== newDate.getTime()) {
        updateData.previousScheduledAt = existingConsultation.scheduledAt;
        updateData.status = 'RESCHEDULED';
      } else if (!existingConsultation.scheduledAt) {
        // First time scheduling
        updateData.status = 'SCHEDULED';
      }
    }

    if (status === 'CONTACTED' && !updateData.contactedAt) {
      updateData.contactedAt = new Date();
    }

    const consultation = await prisma.consultation.update({
      where: { id },
      data: updateData
    });

    // Send notification if rescheduled
    if (scheduledAt) {
      logger.info(`Consultation ${id} rescheduled to ${scheduledAt}. Sending notifications...`);
      
      try {
        // 1. Send Email
        await emailService.sendEmail({
          to: consultation.email,
          subject: 'Update: Your Consultation has been Rescheduled - Kangqore',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e40af;">Consultation Rescheduled</h2>
              <p>Dear ${consultation.name},</p>
              <p>Your consultation request regarding <strong>${consultation.service || 'our services'}</strong> has been updated.</p>
              
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1e40af;">New Meeting Time:</h3>
                <p style="font-size: 18px; font-weight: bold;">
                  ${new Date(scheduledAt).toLocaleString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZoneName: 'short' 
                  })}
                <p style="font-size: 18px; font-weight: bold;">
                  ${new Date(scheduledAt).toLocaleString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' 
                  })}
                </p>
                <p><strong>Mode:</strong> ${meetingMode || 'To be confirmed'}</p>
                ${meetingLink ? `<p><strong>Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
                ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
                ${notes ? `<p><strong>Note from Admin:</strong> ${notes}</p>` : ''}
              </div>
              
              <p>Please log in to your dashboard to confirm this time.</p>
              <p>Best regards,<br/>The Kangqore Team</p>
            </div>
          `
        });
        logger.info(`Reschedule email sent to ${consultation.email}`);

        // 2. Send In-App Notification (if user exists)
        const user = await prisma.user.findUnique({ where: { email: consultation.email } });
        if (user) {
            let dashboardLink = '/dashboard';
            switch (user.role) {
                case 'CLIENT': dashboardLink = '/dashboard/client/meetings'; break;
                case 'PARTNER': dashboardLink = '/dashboard/partner/meetings'; break;
                case 'INVESTOR': dashboardLink = '/dashboard/investor/meetings'; break;
                case 'JOB_SEEKER': dashboardLink = '/dashboard/careers/interviews'; break;
                case 'ADMIN': dashboardLink = '/dashboard/admin/consultations'; break;
            }

            let modeText = meetingMode ? ` (${meetingMode})` : '';
            await prisma.notification.create({
                data: {
                    userId: user.id,
                    title: 'Consultation Rescheduled',
                    message: `Your consultation regarding ${consultation.service || 'services'} has been rescheduled to ${new Date(scheduledAt).toLocaleString()}${modeText}.`,
                    type: 'INFO',
                    link: dashboardLink
                }
            });
            logger.info(`In-app notification created for user ${user.id} (${user.role})`);
        }

      } catch (notifyError) {
        logger.error('Failed to send reschedule notifications:', notifyError);
      }
    }

    res.json({ consultation });

    // ── EQORE trigger on completion (fire-and-forget) ─────────────────────────
    if (status === 'COMPLETED') {
      const uid = (req as any).user?.userId
      KimmpSystemDispatcher.run('EQORE', {
        trigger: 'event.consultation.completed',
        input:   `Consultation completed with ${consultation.name}${consultation.company ? ` (${consultation.company})` : ''} regarding "${consultation.service || consultation.topic || 'services'}". Analyse the outcome, update client intelligence, and recommend next engagement steps.`,
        userId:  uid,
      }).catch(() => {})
    }
  } catch (error) {
    next(error);
  }
});


// Schedule a consultation (Convert to Meeting)
router.post('/:id/schedule', authenticate, authorize(['ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, startTime, endTime, joinLink, platform, notes, meetingMode, location } = req.body;

    // 1. Get Consultation
    const consultation = await prisma.consultation.findUnique({ where: { id } });
    if (!consultation) {
      res.status(404).json({ message: 'Consultation not found' });
      return;
    }

    // 2. Find User by Email (to link Meeting)
    const user = await prisma.user.findUnique({ where: { email: consultation.email } });

    // 3. Create Meeting (Only if user exists)
    let meeting;
    if (user) {
      meeting = await prisma.meeting.create({
        data: {
          title: title || `Consultation: ${consultation.service}`,
          type: 'VIDEO',
          platform: platform || 'ZOOM',
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          meetingMode: meetingMode || 'ONLINE',
          location: location || null,
          joinLink,
          clientId: user.id,
          createdBy: req.user!.id,
          status: 'SCHEDULED'
        }
      });
    }

    // 4. Update Consultation Status
    const updatedConsultation = await prisma.consultation.update({
      where: { id },
      data: {
        status: 'SCHEDULED',
        scheduledAt: new Date(startTime),
        assignedTo: req.user!.id,
        notes: notes ? `${consultation.notes || ''}\n[Scheduled]: ${notes}` : consultation.notes
      }
    });

    res.json({ 
      message: 'Consultation scheduled successfully', 
      consultation: updatedConsultation,
      meeting 
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/consultations/:id/action-reschedule
 * User confirms, modifies, or cancels a rescheduled consultation
 */
router.post('/:id/action-reschedule', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body; // action: CONFIRM, MODIFY, CANCEL
    const userId = req.user?.userId;

    const consultation = await prisma.consultation.findUnique({ where: { id } });
    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

    // Ensure this user owns this consultation (via email)
    if (req.user?.role !== 'ADMIN') {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.email !== consultation.email) {
            return res.status(403).json({ error: 'Unauthorized to act on this consultation' });
        }
    }

    let nextStatus = consultation.status;
    let message = '';

    if (action === 'CONFIRM') {
      nextStatus = 'SCHEDULED' as any;
      message = 'Reschedule confirmed';
    } else if (action === 'MODIFY') {
      // Logic for modification request could be complex, for now we keep as RESCHEDULED 
      // but maybe add a flag or note for admin.
      message = 'Modification requested';
    } else if (action === 'CANCEL') {
      nextStatus = 'CANCELLED' as any;
      message = 'Reschedule cancelled';
    }

    const updated = await prisma.consultation.update({
      where: { id },
      data: {
        status: nextStatus,
        notes: notes ? `${consultation.notes || ''}\n\n[User ${action}]: ${notes}` : consultation.notes
      }
    });

    res.json({ success: true, message, consultation: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
