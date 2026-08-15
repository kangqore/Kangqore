import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../lib/prisma';
import { emailService } from '../kangqore-view/eaf/channels/EmailService';
import logger from '../utils/logger';
import { createError } from '../middleware/errorHandler';
import { requireAuth, requireRole, AuthRequest } from '../middleware/rbac';
import { SignalLedger } from '../kangqore-immp/signals/signalLedger.service';
import { SystemRAG } from '../kangqore-immp/agents/systemRAG';

const router = Router();

// Validation schema
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().allow(''),
  organization: Joi.string().optional().allow(''),
  region: Joi.string().optional().allow(''),
  inquiryType: Joi.string().optional().allow(''),
  subject: Joi.string().max(200).optional().allow(''),
  message: Joi.string().min(1).max(5000).required(),
  source: Joi.string().max(50).optional(),
  interestedServices: Joi.array().items(Joi.string()).optional(),
  city: Joi.string().optional().allow(''),
  consent: Joi.boolean().optional()
});

/**
 * POST /api/contact
 * Submit a contact form (public)
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { name, email, phone, organization, region, city, inquiryType, subject, message, source, interestedServices } = value;

    // Create contact submission
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        organization,
        region: city ? `${region} (${city})` : region,
        inquiryType,
        subject: subject || inquiryType || 'New Contact Inquiry',
        message,
        source: source || 'contact-page',
        interestedServices: interestedServices || []
      }
    });

    // Send confirmation email to user
    try {
      await emailService.sendEmail({
        to: email,
        subject: 'We received your message - Kangqore',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">Thank you for contacting us!</h2>
            <p>Dear ${name},</p>
            <p>We have received your message and will respond within 24 hours.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Message:</h3>
              <p><strong>Organization:</strong> ${organization || 'N/A'}</p>
              <p><strong>Region:</strong> ${region || 'N/A'} ${city ? `(${city})` : ''}</p>
              <p><strong>Inquiry Type:</strong> ${inquiryType || 'General'}</p>
              ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
              ${interestedServices && interestedServices.length > 0 ? `<p><strong>Interested Services:</strong> ${interestedServices.join(', ')}</p>` : ''}
              <p>${message}</p>
            </div>
            <p>Best regards,<br/>The Kangqore Team</p>
          </div>
        `
      });

      // Send notification to admin
      await emailService.sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@kangqore.com',
        subject: `New Contact Form: ${subject || inquiryType || 'No Subject'}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Organization:</strong> ${organization || 'N/A'}</p>
          <p><strong>Region:</strong> ${region || 'N/A'} ${city ? `(${city})` : ''}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Inquiry Type:</strong> ${inquiryType || 'General'}</p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          ${interestedServices && interestedServices.length > 0 ? `<p><strong>Interested Services:</strong> ${interestedServices.join(', ')}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><strong>Source:</strong> ${source || 'contact-page'}</p>
        `
      });
    } catch (emailError) {
      logger.error('Failed to send contact emails:', emailError);
    }

    // Fire-and-forget: emit KIMMP signal + index into LEAD_INTEL RAG
    ;(async () => {
      try {
        const services = interestedServices?.length
          ? ` Interested in: ${(interestedServices as string[]).join(', ')}.`
          : ''
        const signalValue = `${inquiryType || 'General'} inquiry from ${name}${organization ? ` (${organization})` : ''}${services} — "${message.slice(0, 200)}${message.length > 200 ? '…' : ''}"`

        await SignalLedger.record({
          sourceModule:    'contact-form',
          signalType:      'contact.form.submission',
          signalCategory:  'INTENT',
          signalValue,
          confidence:      0.85,
          severity:        'MODERATE',
          metadata: {
            contactId:    contact.id,
            name, email,
            organization: organization ?? null,
            region:       region ?? null,
            inquiryType:  inquiryType ?? null,
            source:       source ?? 'contact-page',
          },
        })

        await SystemRAG.ingest({
          system:  'LEAD_INTEL',
          docType: 'inquiry',
          title:   `Contact: ${name}${organization ? ` — ${organization}` : ''} (${inquiryType || 'General'})`,
          body:    `Name: ${name}\nEmail: ${email}\nOrganization: ${organization || 'N/A'}\nRegion: ${region || 'N/A'}\nInquiry: ${inquiryType || 'General'}\n${subject ? `Subject: ${subject}\n` : ''}Message: ${message}${services}`,
          source:  `contact-form:${contact.id}`,
          tags:    ['contact', 'lead', inquiryType || 'general', source || 'contact-page'].filter(Boolean),
        })
      } catch (err: any) {
        logger.warn('[KIMMP] Contact signal/RAG ingest failed:', err.message)
      }
    })()

    // [New] Check if this email belongs to an existing user and create a Message for them
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await prisma.message.create({
          data: {
            content: message,
            senderId: user.id,
            receiverId: null as any, // Sent to Admin
            isRead: false,
            channelId: 'CONTACT_FORM'
          }
        });
      }
    } catch (msgError) {
      logger.error('Failed to create internal message:', msgError);
    }

    res.status(201).json({
      message: 'Your message has been sent successfully. We will get back to you soon!',
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/contact
 * Get all contact submissions (admin only)
 */
router.get('/', requireAuth, requireRole(['ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, inquiryType, page = 1, limit = 20 } = req.query;

    const where: any = {};
    if (status) where.status = status;
    
    // Add filtering by inquiryType (supports comma-separated list)
    if (inquiryType) {
      const types = (inquiryType as string).split(',');
      where.inquiryType = { in: types };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.contact.count({ where })
    ]);

    res.json({
      contacts,
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
 * PATCH /api/contact/:id
 * Update contact status (admin only)
 */
router.patch('/:id', requireAuth, requireRole(['ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (status === 'REPLIED' && !updateData.repliedAt) {
      updateData.repliedAt = new Date();
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: updateData
    });

    res.json({ contact });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/contact/stats
 * Get contact form statistics (admin only)
 */
router.get('/stats', requireAuth, requireRole(['ADMIN']), async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [total, newContacts, inProgress, replied] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'NEW' } }),
      prisma.contact.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.contact.count({ where: { status: 'REPLIED' } })
    ]);

    res.json({
      stats: {
        total,
        new: newContacts,
        inProgress,
        replied
      }
    });
  } catch (error) {
    next(error);
  }
});

// ── BIDS™ Self-Serve Request Funnel ─────────────────────────────────────────

const bidsRequestSchema = Joi.object({
  firstName:        Joi.string().min(1).max(100).required(),
  lastName:         Joi.string().min(1).max(100).required(),
  email:            Joi.string().email().required(),
  phone:            Joi.string().optional().allow(''),
  company:          Joi.string().min(1).max(200).required(),
  industry:         Joi.string().required(),
  employees:        Joi.string().required(),
  country:          Joi.string().optional().allow(''),
  primaryChallenge: Joi.string().required(),
  urgency:          Joi.string().valid('exploring', 'active_evaluation', 'urgent').required(),
  howDidYouHear:    Joi.string().optional().allow(''),
  consent:          Joi.boolean().valid(true).required(),
})

/**
 * POST /api/contact/bids-request
 * BIDS™ self-serve prospect funnel — creates DRAFT engagement + notifies admins.
 */
router.post('/bids-request', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = bidsRequestSchema.validate(req.body)
    if (error) throw createError(error.details[0].message, 400)

    const { firstName, lastName, email, phone, company, industry, employees, country, primaryChallenge, urgency, howDidYouHear } = value
    const fullName = `${firstName} ${lastName}`.trim()

    // Upsert ClientCRM by company name
    let crm = await (prisma as any).clientCRM.findFirst({ where: { name: company } })
    if (!crm) {
      crm = await (prisma as any).clientCRM.create({
        data: { name: company, industry, country: country || null, status: 'onboarding', tier: 'standard' },
      })
    }

    // Create ClientContact (ignore if duplicate email on that org)
    await (prisma as any).clientContact.create({
      data: { clientId: crm.id, name: fullName, role: 'Primary Contact', email, phone: phone || null, isPrimary: true },
    }).catch(() => {})

    // Create DRAFT BidsEngagement with all prospect data in intakeData
    const engagement = await prisma.bidsEngagement.create({
      data: {
        clientName:  company,
        industry,
        status:      'DRAFT' as any,
        intakeData: {
          firstName, lastName, email, phone: phone || null,
          company, industry, employees, country: country || null,
          primaryChallenge, urgency, howDidYouHear: howDidYouHear || null,
          requestedAt: new Date().toISOString(),
          source: 'self-serve',
        } as any,
        deliverables: [] as any,
      },
    })

    // In-app notifications for all ADMIN users
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' as any } })
    const urgencyLabel = urgency === 'urgent' ? '🔴 Urgent' : urgency === 'active_evaluation' ? '🟡 Active Eval' : '🟢 Exploring'
    await Promise.allSettled(admins.map(admin =>
      prisma.notification.create({
        data: {
          userId:  admin.id,
          title:   `New BIDS™ Request — ${company}`,
          message: `${fullName} from ${company} (${industry}, ${employees}) — ${urgencyLabel}`,
          type:    'BIDS_REQUEST',
          link:    `/kangqore-view/admin/bids/engagements/${engagement.id}`,
        },
      })
    ))

    const frontendUrl = process.env.FRONTEND_URL || 'https://kangqore.com'

    // Admin email alert
    emailService.sendEmail({
      to: process.env.ADMIN_EMAIL || 'kangqore@gmail.com',
      subject: `${urgencyLabel} BIDS™ Request — ${company} (${industry})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #2564ea;">New BIDS™ Assessment Request</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Company</td><td style="font-weight: 600;">${company}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Contact</td><td>${fullName} — <a href="mailto:${email}">${email}</a>${phone ? ` · ${phone}` : ''}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Industry</td><td>${industry}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Team Size</td><td>${employees}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Country</td><td>${country || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Primary Challenge</td><td>${primaryChallenge.replace(/_/g, ' ')}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Urgency</td><td>${urgencyLabel}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Source</td><td>${howDidYouHear || 'Not specified'}</td></tr>
          </table>
          <div style="margin: 24px 0;">
            <a href="${frontendUrl}/kangqore-view/admin/bids/engagements/${engagement.id}"
               style="display: inline-block; padding: 12px 24px; background: linear-gradient(90deg, #2564ea, #4ab6d4); color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Review &amp; Activate Assessment →
            </a>
          </div>
        </div>
      `,
    }).catch(() => {})

    // Prospect confirmation email
    emailService.sendEmail({
      to: email,
      subject: 'BIDS™ Assessment Request Received — Kangqore',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #2564ea;">Your Assessment Request is Under Review</h2>
          <p>Dear ${firstName},</p>
          <p>Thank you for requesting a BIDS™ Diagnostic Assessment for <strong>${company}</strong>.
             Our team will review your request and activate your private diagnostic portal within <strong>24 hours</strong>.</p>
          <div style="background: #f0f4ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-weight: 600; font-size: 13px;">What happens next:</p>
            <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #4a5568; line-height: 1.8;">
              <li>Our team reviews your request (within 24h)</li>
              <li>Your private diagnostic portal is activated</li>
              <li>You complete the 16-pillar BIDS™ intake at your pace</li>
              <li>WAANDA™ generates your diagnostic report and transformation roadmap</li>
            </ol>
          </div>
          <p>Questions? Reply to this email or reach us at <a href="mailto:hello@kangqore.com">hello@kangqore.com</a>.</p>
          <p>Best regards,<br/><strong>The Kangqore Team</strong></p>
        </div>
      `,
    }).catch(() => {})

    res.status(201).json({ success: true, message: 'Assessment request received.' })
  } catch (err) {
    next(err)
  }
})

export default router;
