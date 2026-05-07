import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest, blockRoleModification } from '../middleware/rbac';
import { createAuditLog, extractRequestMetadata, AUDIT_ACTIONS } from '../services/audit.service';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas - Note: name and email are NOT editable
const updateProfileSchema = Joi.object({
  company: Joi.string().max(100).optional().allow('', null),
  companyEmail: Joi.string().email().optional().allow('', null),
  employeeEmail: Joi.string().email().optional().allow('', null),
  collegeEmail: Joi.string().email().optional().allow('', null),
  linkedin: Joi.string().optional().allow('', null),
  github: Joi.string().optional().allow('', null),
  twitter: Joi.string().optional().allow('', null),
  gmail: Joi.string().email().optional().allow('', null),
  location: Joi.string().max(100).optional().allow('', null),
  purpose: Joi.string().max(2000).optional().allow('', null), // Increased limit for message box
  phone: Joi.string().max(50).optional().allow('', null),
  documents: Joi.array().items(Joi.string()).optional(),
  
  // Demographics
  age: Joi.number().integer().min(18).max(120).optional().allow(null),
  gender: Joi.string().valid('Male', 'Female', 'Other', 'Prefer not to say').optional().allow(null, ''),
  profession: Joi.string().max(100).optional().allow(null, ''),
  
  // Portfolio (Flexible JSON)
  portfolio: Joi.object().optional().allow(null)
});

const updateAvatarSchema = Joi.object({
  avatarUrl: Joi.string().uri().required()
});

/**
 * GET /api/profile/me
 * Get current user's profile
 */
router.get('/me', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        customId: true,
        email: true,
        name: true,
        company: true,
        phone: true,
        role: true,
        companyEmail: true,
        employeeEmail: true,
        collegeEmail: true,
        linkedin: true,
        github: true,
        twitter: true,
        gmail: true,
        location: true,
        purpose: true,
        documents: true,
        avatarUrl: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        // Demographics
        age: true,
        gender: true,
        profession: true,
        portfolio: true
      }
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/profile
 * Update user profile (excluding role and primary email)
 */
router.patch('/', requireAuth, blockRoleModification, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    // Validate input
    console.log('Received Profile Update Body:', JSON.stringify(req.body, null, 2)); // DEBUG
    const { error, value } = updateProfileSchema.validate(req.body, { 
      abortEarly: false, 
      allowUnknown: true, 
      stripUnknown: true 
    });
    
    if (error) {
      console.error('Validation Error Details:', JSON.stringify(error.details, null, 2)); // DEBUG
      throw createError(`Validation failed: ${error.details.map(x => x.message).join(', ')}`, 400);
    }

    // Block primary email change
    if ('email' in req.body) {
      throw createError('Primary email cannot be changed', 403);
    }

    // Get old values for audit log
    const oldUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        company: true,
        companyEmail: true,
        employeeEmail: true,
        linkedin: true,
        github: true,
        twitter: true,
        gmail: true,
        age: true,
        gender: true,
        profession: true
      }
    });

    // Block name change (name should not be editable)
    if ('name' in req.body) {
      delete value.name;
    }

    // Gmail is optional now, no compulsion

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: value,
      select: {
        id: true,
        customId: true,
        email: true,
        name: true,
        company: true,
        phone: true,
        role: true,
        companyEmail: true,
        employeeEmail: true,
        collegeEmail: true,
        linkedin: true,
        github: true,
        twitter: true,
        gmail: true,
        location: true,
        purpose: true,
        documents: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // Demographics
        age: true,
        gender: true,
        profession: true
      }
    });

    // Create audit log
    const metadata = extractRequestMetadata(req);
    await createAuditLog({
      userId,
      action: AUDIT_ACTIONS.USER_UPDATED,
      oldValue: oldUser,
      newValue: value,
      ...metadata
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/profile/avatar
 * Update user's avatar URL
 */
router.patch('/avatar', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    // Validate input
    const { error, value } = updateAvatarSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { avatarUrl } = value;

    // Get old avatar for audit
    const oldUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true }
    });

    // Update avatar
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true
      }
    });

    // Create audit log
    const metadata = extractRequestMetadata(req);
    await createAuditLog({
      userId,
      action: AUDIT_ACTIONS.USER_UPDATED,
      oldValue: { avatarUrl: oldUser?.avatarUrl },
      newValue: { avatarUrl },
      ...metadata
    });

    res.json({
      message: 'Avatar updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

// Validation schema for password change
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required'
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'New password must be at least 8 characters',
    'string.empty': 'New password is required'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Confirm password is required'
  })
});

/**
 * POST /api/profile/change-password
 * Change user's password
 */
router.post('/change-password', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    // Validate input
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { currentPassword, newPassword } = value;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true, email: true }
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    // Check if user has a password (might be OAuth-only)
    if (!user.password) {
      throw createError('Cannot change password for OAuth-only accounts. Please set a password first.', 400);
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    
    if (!isValidPassword) {
      throw createError('Current password is incorrect', 401);
    }

    // Check new password isn't same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw createError('New password must be different from current password', 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    // Create audit log
    const metadata = extractRequestMetadata(req);
    await createAuditLog({
      userId,
      action: AUDIT_ACTIONS.PASSWORD_CHANGE || 'PASSWORD_CHANGE',
      oldValue: null,
      newValue: null, // Don't log password values
      ...metadata
    });

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
