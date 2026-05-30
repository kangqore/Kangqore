import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../lib/prisma';
import { emailService } from '../services/email.service';
import logger from '../utils/logger';
import { createError } from '../middleware/errorHandler';
import { requireAuth, requireRole, AuthRequest } from '../middleware/rbac';

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
router.get('/stats', requireAuth, requireRole(['ADMIN']), async (req: AuthRequest, res: Response, next: NextFunction) => {
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

export default router;
