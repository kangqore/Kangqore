import logger from '../../utils/logger';

export interface OwnerAssignment {
  ownerId: string;
  ownerName: string;
  team: string;
  reason: string;
}

export class EqoreLeadAssignmentService {
  /**
   * Deterministically assigns an owner based on lead attributes.
   * v1 deterministic rules as per CTO mandate.
   */
  static async assignOwner(lead: any): Promise<OwnerAssignment> {
    const isCrisis = lead.urgency === 'CRISIS' || lead.urgencyLevel === 'CRISIS'; // Handle both possible field names
    const isGolden = lead.leadCategory === 'Golden Lead' || lead.leadCategory === 'Hot Lead'; // Treating Hot/Golden similarly for senior review if needed, but per rule: "CRISIS / Golden Lead -> CTO Desk"

    if (isCrisis || isGolden) {
      return {
        ownerId: 'USR_CTO_DESK',
        ownerName: 'Senior Executive',
        team: 'CTO Desk',
        reason: `Assigned to CTO Desk because urgency=${lead.urgency || lead.urgencyLevel} and leadScore=${lead.leadScore || 0}.`
      };
    }

    const dept = lead.primaryDepartment || '';

    if (dept.includes('AI') || dept.includes('Cognitive')) {
      return {
        ownerId: 'USR_AI_OWNER',
        ownerName: 'AI Solutions Owner',
        team: 'AI & Cognitive Solutions',
        reason: `Assigned to AI Solutions Owner because primary department is ${dept}.`
      };
    }

    if (dept.includes('Cloud')) {
      return {
        ownerId: 'USR_CLOUD_OWNER',
        ownerName: 'Cloud Engineering Owner',
        team: 'Cloud Engineering',
        reason: `Assigned to Cloud Engineering Owner because primary department is ${dept}.`
      };
    }

    if (dept.includes('Cybersecurity') || dept.includes('Security')) {
      return {
        ownerId: 'USR_SEC_OWNER',
        ownerName: 'Security Owner',
        team: 'Cybersecurity',
        reason: `Assigned to Security Owner because primary department is ${dept}.`
      };
    }

    if (dept.includes('Enterprise Applications') || dept.includes('Apps')) {
      return {
        ownerId: 'USR_ENT_APPS_OWNER',
        ownerName: 'Enterprise Apps Owner',
        team: 'Enterprise Applications',
        reason: `Assigned to Enterprise Apps Owner because primary department is ${dept}.`
      };
    }

    if (dept.includes('Digital Marketing') || dept.includes('Conversion')) {
      return {
        ownerId: 'USR_GROWTH_OWNER',
        ownerName: 'Growth Owner',
        team: 'Digital Marketing / Conversion',
        reason: `Assigned to Growth Owner because primary department is ${dept}.`
      };
    }

    // Default Fallback
    return {
      ownerId: 'USR_ADMIN_PRIMARY',
      ownerName: 'Primary Admin',
      team: 'General Sales',
      reason: `Assigned to Primary Admin because no specific department match was found (Dept: ${dept || 'Unknown'}).`
    };
  }
}
