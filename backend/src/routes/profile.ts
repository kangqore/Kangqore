import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
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

// ==========================================
// TWO-FACTOR AUTHENTICATION (TOTP)
// ==========================================

function generateRecoveryCodes(count = 8): string[] {
  return Array.from({ length: count }, () => {
    const raw = crypto.randomBytes(5).toString('hex').toUpperCase();
    return `${raw.slice(0, 5)}-${raw.slice(5, 10)}`;
  });
}

/**
 * POST /api/profile/2fa/setup
 * Generates a pending TOTP secret + QR code. Not enabled until /2fa/verify-setup succeeds.
 */
router.post('/2fa/setup', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, twoFactorEnabled: true },
    });
    if (!user) throw createError('User not found', 404);
    if (user.twoFactorEnabled) throw createError('Two-factor authentication is already enabled', 400);

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'Kangqore', secret);
    const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

    // Store the pending secret; twoFactorEnabled stays false until verified
    await prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });

    res.json({ secret, qrCodeDataUrl });
  } catch (error) {
    next(error);
  }
});

const verify2FASetupSchema = Joi.object({
  code: Joi.string().required(),
});

/**
 * POST /api/profile/2fa/verify-setup
 * Confirms the code from the authenticator app and turns 2FA on, returning one-time recovery codes.
 */
router.post('/2fa/verify-setup', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { error, value } = verify2FASetupSchema.validate(req.body);
    if (error) throw createError(error.details[0].message, 400);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });
    if (!user?.twoFactorSecret) throw createError('Start setup first to get a QR code', 400);
    if (user.twoFactorEnabled) throw createError('Two-factor authentication is already enabled', 400);

    const valid = authenticator.check(String(value.code).trim(), user.twoFactorSecret);
    if (!valid) throw createError('Invalid authentication code', 401);

    const recoveryCodes = generateRecoveryCodes();
    const hashedCodes = await Promise.all(recoveryCodes.map(c => bcrypt.hash(c, 10)));

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true, twoFactorRecoveryCodes: hashedCodes },
    });

    const metadata = extractRequestMetadata(req);
    await createAuditLog({ userId, action: 'TWO_FACTOR_ENABLED', ...metadata });

    res.json({ recoveryCodes });
  } catch (error) {
    next(error);
  }
});

const disable2FASchema = Joi.object({
  password: Joi.string().required(),
  code: Joi.string().required(),
});

/**
 * POST /api/profile/2fa/disable
 * Requires current password + a valid TOTP or recovery code.
 */
router.post('/2fa/disable', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { error, value } = disable2FASchema.validate(req.body);
    if (error) throw createError(error.details[0].message, 400);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) throw createError('User not found', 404);
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      throw createError('Two-factor authentication is not enabled', 400);
    }

    const validPassword = await bcrypt.compare(value.password, user.password);
    if (!validPassword) throw createError('Incorrect password', 401);

    const trimmedCode = String(value.code).trim();
    let validCode = authenticator.check(trimmedCode, user.twoFactorSecret);
    if (!validCode) {
      for (const hashed of user.twoFactorRecoveryCodes) {
        if (await bcrypt.compare(trimmedCode.toUpperCase(), hashed)) { validCode = true; break; }
      }
    }
    if (!validCode) throw createError('Invalid authentication code', 401);

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null, twoFactorRecoveryCodes: [] },
    });

    const metadata = extractRequestMetadata(req);
    await createAuditLog({ userId, action: 'TWO_FACTOR_DISABLED', ...metadata });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
