import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';

export interface CrmOpportunityPayload {
  leadId: string;
  opportunityId: string;
  email: string;
  name: string;
  companyName: string;
  leadScore: number;
  urgency: string;
  primaryDepartment: string;
  ownerId: string;
}

export interface CrmSyncResult {
  status: 'SUCCESS' | 'FAILED';
  externalId?: string;
  error?: string;
}

export interface CrmProvider {
  syncOpportunity(payload: CrmOpportunityPayload): Promise<CrmSyncResult>;
}

export class InternalCrmProvider implements CrmProvider {
  async syncOpportunity(payload: CrmOpportunityPayload): Promise<CrmSyncResult> {
    logger.info(`[INTERNAL_CRM] Syncing opportunity ${payload.opportunityId} for lead ${payload.leadId}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For the internal dummy provider, we just return success with a mock external ID
    return {
      status: 'SUCCESS',
      externalId: `INT-${payload.opportunityId.split('-')[0]}`
    };
  }
}

export class EqoreCrmSyncService {
  private provider: CrmProvider;

  constructor() {
    // V1 uses Internal dummy provider. Later this can be injected based on config
    this.provider = new InternalCrmProvider();
  }

  async syncOpportunity(opportunityId: string): Promise<void> {
    try {
      const opp = await prisma.eqoreSalesOpportunity.findUnique({
        where: { id: opportunityId },
        include: { lead: true }
      });

      if (!opp || !opp.lead) {
        throw new Error('Opportunity or Lead not found for CRM sync');
      }

      const payload: CrmOpportunityPayload = {
        leadId: opp.leadId,
        opportunityId: opp.id,
        email: opp.lead.email || 'unknown@example.com',
        name: opp.lead.name || 'Unknown',
        companyName: opp.lead.companyName || 'Unknown',
        leadScore: opp.lead.leadScore,
        urgency: opp.lead.urgency || 'NORMAL',
        primaryDepartment: opp.primaryDepartment || 'General',
        ownerId: opp.ownerId || 'UNASSIGNED'
      };

      const result = await this.provider.syncOpportunity(payload);

      await prisma.eqoreCrmSyncLog.create({
        data: {
          leadId: opp.leadId,
          opportunityId: opp.id,
          crmProvider: 'INTERNAL',
          externalCrmId: result.externalId,
          syncStatus: result.status === 'SUCCESS' ? 'MOCK_SYNCED' : 'FAILED',
          syncPayload: payload as any,
          errorMessage: result.error,
          lastSyncedAt: new Date()
        }
      });

      logger.info(`CRM Sync completed for opportunity ${opportunityId}: ${result.status}`);
    } catch (error) {
      logger.error(`CRM Sync failed for opportunity ${opportunityId}`, error);
      
      // Attempt to log failure
      try {
        await prisma.eqoreCrmSyncLog.create({
          data: {
            leadId: 'UNKNOWN', // Fallbacks if opp fetch failed
            opportunityId: opportunityId,
            crmProvider: 'INTERNAL',
            syncStatus: 'FAILED',
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      } catch (e) {
        // Ignore secondary failure
      }
    }
  }
}

export const eqoreCrmSyncService = new EqoreCrmSyncService();
