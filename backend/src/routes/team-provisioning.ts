import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../utils/password';
import { requireAuth, AuthRequest } from '../middleware/rbac';
import { createError } from '../middleware/errorHandler';
import crypto from 'crypto';
import { createAuditLog, AUDIT_ACTIONS } from '../kangqore-view/kernel/audit/AuditService';
import { generateCustomId } from '../utils/idGenerator';

const router = Router();

const provisionSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).required(),
  teamCategory: Joi.string().required(),
  isDepartmentHr: Joi.boolean().default(false)
});

/**
 * Provision a new team member
 * ONLY Department Leads can call this, and it automatically binds the user to their department.
 */
router.post('/provision', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    
    // Strict RBAC: Only a Department Lead can provision users
    if (!user.isDepartmentLead || !user.deptId) {
      throw createError('Forbidden: Only Department Leads can provision team members.', 403);
    }

    const { error, value } = provisionSchema.validate(req.body);
    if (error) {
      throw createError(error.details[0].message, 400);
    }

    const { email, name, teamCategory, isDepartmentHr } = value;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw createError('User already exists in the system.', 409);
    }

    // Generate secure activation credentials
    const tempPassword = crypto.randomBytes(12).toString('hex');
    const hashedPassword = await hashPassword(tempPassword);
    
    // Assign custom ID based on role
    const customId = await generateCustomId('TEAM');

    // Fetch Lead's Department to ensure it's active and extract slug
    const leadDepartment = await prisma.department.findUnique({
      where: { id: user.deptId }
    });
    
    if (!leadDepartment || leadDepartment.status !== 'active') {
      throw createError('Forbidden: Department is inactive or invalid.', 403);
    }

    // Execute provisioning in a strict transaction
    const newTeamMember = await prisma.$transaction(async (tx) => {
      // Create the permanently bound user account
      const member = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'TEAM',
          deptId: leadDepartment.id,
          organizationId: leadDepartment.organizationId,
          departmentSlug: leadDepartment.slug,
          teamCategory,
          isDepartmentHr,
          customId
        }
      });
      
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'TEAM_MEMBER_PROVISIONED',
          resource: member.id,
          newValue: {
            email,
            teamCategory,
            deptId: leadDepartment.id,
            departmentSlug: leadDepartment.slug
          }
        }
      });
      
      return member;
    });

    res.json({
      message: 'Team member provisioned successfully.',
      member: {
        id: newTeamMember.id,
        email: newTeamMember.email,
        name: newTeamMember.name,
        departmentSlug: newTeamMember.departmentSlug,
        teamCategory: newTeamMember.teamCategory,
        isDepartmentHr: newTeamMember.isDepartmentHr
      },
      activationCredentials: {
        email,
        temporaryPassword: tempPassword
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
