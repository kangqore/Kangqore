
import express from 'express';
import { prisma } from '../index';
import { requireAuth, requireRole } from '../middleware/rbac';

const router = express.Router();

/**
 * @route GET /api/projects/:projectId/context
 * @desc Get Project Context (Objectives & Constraints)
 * @access Admin, Client, Connected Partner
 */
router.get('/:projectId/context', requireAuth, async (req, res) => {
    try {
        const { projectId } = req.params;
        
        // TODO: Strict Access Control per project
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                title: true,
                objectives: true,
                constraints: true,
                priorityOrder: true
            }
        });

        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ context: project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch context' });
    }
});

/**
 * @route PUT /api/projects/:projectId/context
 * @desc Update Constraints & Priority ("The Iron Triangle")
 * @access Admin Only (Client can request via Change Request)
 */
router.put('/:projectId/context', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    try {
        const { projectId } = req.params;
        const { constraints, priorityOrder } = req.body;

        const project = await prisma.project.update({
            where: { id: projectId },
            data: {
                constraints, // Expecting JSON object
                priorityOrder
            }
        });

        res.json({ context: project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update context' });
    }
});

/**
 * @route POST /api/projects/:projectId/objectives
 * @desc Add a Business Objective (Why are we doing this?)
 * @access Admin Only
 */
router.post('/:projectId/objectives', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    try {
        const { projectId } = req.params;
        const { description, type, kpiMetric } = req.body;

        const objective = await prisma.businessObjective.create({
            data: {
                projectId,
                description,
                type, // PRIMARY, SECONDARY, NON_GOAL
                kpiMetric
            }
        });

        res.json({ objective });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create objective' });
    }
});

/**
 * @route DELETE /api/objectives/:id
 * @desc Remove an objective
 * @access Admin Only
 */
router.delete('/objectives/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
    try {
        await prisma.businessObjective.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete objective' });
    }
});

export default router;
