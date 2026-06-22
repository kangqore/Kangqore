import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../lib/prisma';
import { emailService } from '../services/email.service';
import crypto from 'crypto';
import logger from '../utils/logger';
import bcrypt from 'bcryptjs';
import { hashPassword, comparePassword } from '../utils/password';
import { createSession } from '../services/session.service';
import { createAuditLog, extractRequestMetadata, AUDIT_ACTIONS } from '../services/audit.service';
import { requireAuth, AuthRequest } from '../middleware/rbac';
import { createError } from '../middleware/errorHandler';
import { LoginRequest, RegisterRequest } from '../types/auth';
import { generateCustomId } from '../utils/idGenerator';

const router = Router();

const registerSchema = Joi.object<RegisterRequest>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  company: Joi.string().optional(),
  phone: Joi.string().optional(),
  role: Joi.string().valid('ADMIN', 'CLIENT', 'PARTNER', 'INVESTOR', 'JOB_SEEKER', 'JOURNALIST', 'ANALYST', 'VISITOR').default('CLIENT')
});

const loginSchema = Joi.object<LoginRequest>({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { email, password, name, company, role } = value;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw createError('User already exists', 409);
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const roleToAssign = (role || 'CLIENT') as any; // Cast to avoid type issues with string
    const customId = await generateCustomId(roleToAssign);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        company,
        role: roleToAssign,
        customId
      },
      select: {
        id: true,
        customId: true,
        email: true,
        name: true,
        company: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Create session and get tokens
    const metadata = extractRequestMetadata(req);
    const { tokens } = await createSession({
      userId: user.id,
      role: user.role,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent
    });

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.USER_CREATED,
      newValue: { email, role: user.role },
      ...metadata
    });

    res.status(201).json({
      user,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { email, password } = value;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      throw createError('Invalid credentials', 401);
    }

    // Check if account is suspended
    if (user.status === 'SUSPENDED') {
      throw createError('Account is suspended. Contact administrator.', 403);
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Create session and get tokens
    const metadata = extractRequestMetadata(req);
    const { tokens } = await createSession({
      userId: user.id,
      role: user.role,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent
    });

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.LOGIN,
      ...metadata
    });

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      company: user.company,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      user: userResponse,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req.user as any).userId },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        role: true,
        status: true,
        avatarUrl: true,
        linkedin: true,
        github: true,
        twitter: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.patch('/profile', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    const { name, company, linkedin, github, twitter, phone } = req.body
    if (name !== undefined && (!name || typeof name !== 'string' || !name.trim())) {
      return res.status(400).json({ error: 'Name cannot be empty' })
    }
    const data: Record<string, string | undefined> = {}
    if (name     !== undefined) data.name     = name.trim()
    if (company  !== undefined) data.company  = company?.trim()  || undefined
    if (linkedin !== undefined) data.linkedin = linkedin?.trim() || undefined
    if (github   !== undefined) data.github   = github?.trim()   || undefined
    if (twitter  !== undefined) data.twitter  = twitter?.trim()  || undefined
    if (phone    !== undefined) data.phone    = phone?.trim()    || undefined
    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, company: true, linkedin: true, github: true, twitter: true, phone: true },
    })
    res.json({ user: updated })
  } catch (error) {
    next(error)
  }
})

router.post('/change-password', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both currentPassword and newPassword are required' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.password) return res.status(404).json({ error: 'User not found' })
    const valid = await bcrypt.compare(currentPassword, user.password as string)
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' })
    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } })
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

router.post('/logout-all', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).userId
    await prisma.session.deleteMany({ where: { userId } }).catch(() => {})
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal user existence
      res.json({ message: 'If an account exists, a reset email has been sent.' });
      return;
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    });

    // Send Email
    await emailService.sendPasswordResetEmail(user.email, resetToken);

    res.json({ message: 'If an account exists, a reset email has been sent.' });
  } catch (error) {
    logger.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Error processing request' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    logger.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

export default router;
