import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectProgressService {
  /**
   * Calculate progress based on completed deliverables
   * Returns percentage (0-100)
   */
  async calculateProgressFromDeliverables(projectId: string): Promise<number> {
    const [completed, total] = await Promise.all([
      prisma.deliverable.count({
        where: { 
          projectId, 
          status: { in: ['completed', 'COMPLETED', 'accepted', 'ACCEPTED'] }
        }
      }),
      prisma.deliverable.count({ where: { projectId } })
    ]);

    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  /**
   * Calculate confidence score based on evidence quality
   * Factors:
   * - % of deliverables with evidence (external resources, signals)
   * - Recency of updates (stale data = lower confidence)
   * - Manual override penalty
   * Returns 0-100
   */
  async calculateConfidence(projectId: string): Promise<number> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        deliverables: {
          include: {
            externalResources: true,
            deliverySignals: true
          }
        }
      }
    });

    if (!project) return 0;

    let confidenceScore = 100;

    // Factor 1: Evidence quality (40 points)
    const totalDeliverables = project.deliverables.length;
    if (totalDeliverables > 0) {
      const deliverablesWithEvidence = project.deliverables.filter(d => 
        d.externalResources.length > 0 || d.deliverySignals.length > 0
      ).length;
      const evidenceRatio = deliverablesWithEvidence / totalDeliverables;
      confidenceScore = evidenceRatio * 40;
    } else {
      confidenceScore = 0; // No deliverables = no confidence
    }

    // Factor 2: Recency of validation (30 points)
    if (project.progressLastValidated) {
      const daysSinceValidation = Math.floor(
        (Date.now() - project.progressLastValidated.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceValidation <= 1) {
        confidenceScore += 30; // Fresh validation
      } else if (daysSinceValidation <= 7) {
        confidenceScore += 20; // Recent validation
      } else if (daysSinceValidation <= 30) {
        confidenceScore += 10; // Stale validation
      }
      // Older than 30 days = 0 points
    }

    // Factor 3: Manual override penalty (30 points)
    if (!project.progressOverride) {
      confidenceScore += 30; // Auto-calculated = full points
    } else {
      confidenceScore += 15; // Manual override = half points
    }

    return Math.min(Math.round(confidenceScore), 100);
  }

  /**
   * Auto-validate and update project progress
   * This is the main entry point for automatic validation
   */
  async validateAndUpdateProgress(projectId: string): Promise<void> {
    const autoProgress = await this.calculateProgressFromDeliverables(projectId);
    const confidence = await this.calculateConfidence(projectId);
    
    // Get evidence (completed deliverable IDs)
    const completedDeliverables = await prisma.deliverable.findMany({
      where: { 
        projectId,
        status: { in: ['completed', 'COMPLETED', 'accepted', 'ACCEPTED'] }
      },
      select: { id: true, title: true, updatedAt: true }
    });

    const evidence = {
      deliverables: completedDeliverables.map(d => ({
        id: d.id,
        title: d.title,
        completedAt: d.updatedAt
      })),
      lastCalculated: new Date().toISOString()
    };

    await prisma.project.update({
      where: { id: projectId },
      data: {
        progress: autoProgress,
        progressCalculationMethod: 'AUTO_DELIVERABLES',
        progressEvidence: evidence,
        progressConfidence: confidence,
        progressLastValidated: new Date(),
        progressOverride: false, // Reset override flag
        progressOverrideReason: null
      }
    });
  }

  /**
   * Manually override progress with admin justification
   * This sets the override flag and stores the reason for transparency
   */
  async overrideProgress(
    projectId: string, 
    newProgress: number, 
    reason: string,
    adminEmail: string
  ): Promise<void> {
    if (newProgress < 0 || newProgress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    if (!reason || reason.trim().length < 10) {
      throw new Error('Override reason must be at least 10 characters');
    }

    await prisma.project.update({
      where: { id: projectId },
      data: {
        progress: newProgress,
        progressCalculationMethod: 'MANUAL',
        progressOverride: true,
        progressOverrideReason: reason,
        progressLastValidated: new Date(),
        progressEvidence: {
          manualOverride: true,
          overriddenBy: adminEmail,
          overriddenAt: new Date().toISOString(),
          reason
        }
      }
    });
  }
}

export default new ProjectProgressService();
