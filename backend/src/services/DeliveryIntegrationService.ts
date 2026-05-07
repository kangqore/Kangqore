import { prisma } from '../lib/prisma';

export type SignalType = 'PR_OPENED' | 'PR_MERGED' | 'CI_PASSED' | 'CI_FAILED' | 'TICKET_UPDATED' | 'DOC_EDITED' | 'MANUAL_UPDATE';
export type ResourceType = 'GITHUB_REPO' | 'JIRA_TICKET' | 'DRIVE_FOLDER';

class DeliveryIntegrationService {

  /**
   * Connect an external resource to a deliverable.
   */
  async connectResource(deliverableId: string, resourceType: ResourceType, externalId: string) {
    return prisma.externalResource.create({
      data: {
        deliverableId,
        resourceType,
        externalId,
        lastSyncAt: new Date()
      }
    });
  }

  /**
   * Get all connected resources for a deliverable.
   */
  async getResources(deliverableId: string) {
    return prisma.externalResource.findMany({
      where: { deliverableId }
    });
  }

  /**
   * Ingest a signal from an external system (or mock generator).
   * This is the "Brain" that decides if status should automatically update.
   */
  async ingestSignal(deliverableId: string, signalType: SignalType, source: string, payload: any) {
    console.log(`📡 Ingesting Signal [${signalType}] for Deliverable ${deliverableId}`);

    // 1. Log the signal (Audit Trail)
    const signal = await prisma.deliverySignal.create({
      data: {
        deliverableId,
        signalType,
        source,
        payload
      }
    });

    // 2. Automate Status Updates (if applicable)
    // NOTE: We preserve manual control by only moving status FORWARD in specific flows,
    // or we can treat these as "Suggestions" if we want to be very conservative.
    // For Phase 7, we implement logical automation "Happy Paths".

    const deliverable = await prisma.deliverable.findUnique({ where: { id: deliverableId } });
    if (!deliverable) return signal;

    const updates: any = {};

    switch (signalType) {
      case 'PR_MERGED':
        // If code is merged, it's ready for review/QA
        if (deliverable.status !== 'COMPLETED' && deliverable.status !== 'IN_REVIEW') {
          updates.status = 'IN_REVIEW';
          updates.completionPercentage = 90; 
        }
        break;

      case 'PR_OPENED':
        // If PR opens, work is definitely "In Progress"
        if (deliverable.status === 'PENDING' || deliverable.status === 'TODO') {
           updates.status = 'IN_PROGRESS';
        }
        break;

      case 'CI_PASSED':
        // Automate Quality Gate
        updates.qualityGateStatus = 'PASSED';
        updates.securityScanPassed = true;
        break;
      
      case 'CI_FAILED':
        updates.qualityGateStatus = 'FAILED';
        break;
      
      case 'DOC_EDITED':
        // Just an activity signal, maybe bump updated time
        updates.updatedAt = new Date();
        break;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.deliverable.update({
        where: { id: deliverableId },
        data: updates
      });
      console.log(`✅ Automated update applied:`, updates);
    }

    // 3. Update Sync Timestamp on related resource
    await prisma.externalResource.updateMany({
        where: { deliverableId, resourceType: { contains: source.split(' ')[0].toUpperCase() } }, // Heuristic match
        data: { lastSyncAt: new Date() }
    });

    return signal;
  }

  /**
   * Get recent signals for UI feed
   */
  async getSignals(deliverableId: string) {
    return prisma.deliverySignal.findMany({
      where: { deliverableId },
      orderBy: { timestamp: 'desc' },
      take: 50
    });
  }
}

export default new DeliveryIntegrationService();
