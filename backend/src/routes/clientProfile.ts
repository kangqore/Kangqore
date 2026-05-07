
import express from 'express';
import { prisma } from '../index';
import { requireAuth, requireRole } from '../middleware/rbac';

const router = express.Router();

/**
 * @route GET /api/clients/:clientId/profile
 * @desc Get Client Identity & Authority Profile
 * @access Admin or Specific Client
 */
router.get('/:clientId/profile', requireAuth, async (req, res) => {
    try {
        const { clientId } = req.params;

        // Ensure user is authorized
        if (req.user?.role !== 'ADMIN' && req.user?.userId !== clientId) {
             return res.status(403).json({ error: 'Unauthorized' });
        }

        const profile = await prisma.clientProfile.findUnique({
            where: { userId: clientId },
            include: {
                authorityMatrix: true,
                user: { select: { name: true, company: true, email: true } }
            }
        });

        res.json({ profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

/**
 * @route PUT /api/clients/:clientId/profile
 * @desc Update Client Identity (Identity Pillar)
 * @access Admin Only (Usually)
 */
router.put('/:clientId/profile', requireAuth, requireRole(['ADMIN', 'CLIENT']), async (req, res) => { // Added CLIENT role
    try {
        const { clientId } = req.params;
        const { 
            legalEntityName, registeredAddress, taxId, industryDomain, jurisdiction, dataResidency,
            preferences // extracted from body
        } = req.body;

        // AUTH CHECK: Ensure user is modifying THEIR OWN profile or is ADMIN
        if (req.user?.role !== 'ADMIN' && req.user?.userId !== clientId) {
             return res.status(403).json({ error: 'Unauthorized' });
        }

        // Hack: Store preferences in escalationMatrix if schema update failed, or merge them. 
        // We will fetch existing profile first to merge JSON if needed.
        const existing = await prisma.clientProfile.findUnique({ where: { userId: clientId } });
        
        let newEscalationMatrix = existing?.escalationMatrix || {};
        if (preferences) {
            newEscalationMatrix = { ...(newEscalationMatrix as object), preferences };
        }

        const profile = await prisma.clientProfile.upsert({
            where: { userId: clientId },
            update: {
                legalEntityName, registeredAddress, taxId, industryDomain, jurisdiction, dataResidency,
                escalationMatrix: newEscalationMatrix // Storing preferences here for now
            },
            create: {
                userId: clientId,
                legalEntityName, registeredAddress, taxId, industryDomain, jurisdiction, dataResidency,
                escalationMatrix: newEscalationMatrix
            }
        });

        res.json({ profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

/**
 * @route POST /api/clients/:clientId/authority
 * @desc Add a role to Authority Matrix (Authority Pillar)
 * @access Admin Only
 */
router.post('/:clientId/authority', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    try {
        const { clientId } = req.params;
        const { roleName, name, email, canApproveBudget, canApproveScope, canApproveGoLive, signingLimit } = req.body;

        // Get Profile ID first
        const profile = await prisma.clientProfile.findUnique({ where: { userId: clientId }});
        if (!profile) return res.status(404).json({ error: 'Client Profile not initialized' });

        const authority = await prisma.authorityRole.create({
            data: {
                clientProfileId: profile.id,
                roleName, name, email,
                canApproveBudget, canApproveScope, canApproveGoLive,
                signingLimit: signingLimit ? Number(signingLimit) : null
            }
        });

        res.json({ authority });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add authority role' });
    }
});

/**
 * @route DELETE /api/clients/:clientId/authority/:ruleId
 * @desc Remove an authority role
 * @access Admin Only
 */
router.delete('/:clientId/authority/:roleId', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    try {
        await prisma.authorityRole.delete({ where: { id: req.params.roleId }});
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove authority role' });
    }
});

export default router;
