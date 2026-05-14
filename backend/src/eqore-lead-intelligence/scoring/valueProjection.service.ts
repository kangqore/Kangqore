import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { KANGQORE_SERVICES } from '../taxonomy/kangqoreServiceTaxonomy';

export type ValueProjection = {
  projectedACV: number;
  confidenceScore: number;
  weightedValue: number;
  tier: 'STRATEGIC' | 'HIGH' | 'CORE' | 'PILOT';
  reasoning: string[];
};

export class EqoreValueService {
  /**
   * Estimates the potential Annual Contract Value (ACV) for a lead.
   */
  static async projectLeadValue(leadId: string): Promise<ValueProjection> {
    const lead = await prisma.eqoreLead.findUnique({
      where: { id: leadId },
      include: { conversation: true }
    });

    if (!lead) {
      throw new Error(`Lead ${leadId} not found`);
    }

    let baseACV = 0;
    const reasoning: string[] = [];
    
    // 1. Calculate base ACV from matched services
    const matchedServices = (lead.matchedServices as any[]) || [];
    
    if (matchedServices.length > 0) {
      for (const match of matchedServices) {
        const serviceInfo = KANGQORE_SERVICES[match.service];
        const serviceBase = this.getServiceBaseValue(match.service, serviceInfo?.departmentSlug);
        
        // Weight by fit score (e.g. 90% fit = full value, 40% fit = partial interest)
        const weightedServiceValue = serviceBase * (match.fitScore / 100);
        baseACV += weightedServiceValue;
        reasoning.push(`Matched service "${match.service}" adding ~$${Math.round(weightedServiceValue / 1000)}k based on fit score ${match.fitScore}%`);
      }
    } else {
      // Fallback to department if no specific services matched
      if (lead.primaryDepartment) {
        baseACV = this.getDepartmentBaseValue(lead.primaryDepartment);
        reasoning.push(`No specific services matched, using department average for "${lead.primaryDepartment}"`);
      } else {
        baseACV = 10000; // Baseline for any qualified interaction
        reasoning.push('Baseline initial interaction value');
      }
    }

    // 2. Adjust for Lead Score (Qualification Multiplier)
    // Score < 44: Discount heavily (noise/early)
    // Score > 75: High intent multiplier
    let multiplier = 1.0;
    if (lead.leadScore < 44) {
      multiplier = 0.5;
      reasoning.push('Lowered value due to low qualification score (< 44)');
    } else if (lead.leadScore > 75) {
      multiplier = 1.3;
      reasoning.push('Increased value due to high qualification score (> 75)');
    }

    // 3. Adjust for Buying Stage
    const stageMultipliers: Record<string, number> = {
      'EVALUATION': 1.2,
      'BUDGET_PLANNING': 1.1,
      'RESEARCH': 0.9,
      'PROBLEM_IDENTIFICATION': 0.8,
      'DECISION': 1.5 // Ready to close
    };
    
    if (lead.buyingStage && stageMultipliers[lead.buyingStage]) {
      const stageMult = stageMultipliers[lead.buyingStage];
      multiplier *= stageMult;
      reasoning.push(`Adjusted by stage "${lead.buyingStage}" (x${stageMult})`);
    }

    const projectedACV = Math.round(baseACV * multiplier);
    const confidenceScore = lead.leadConfidence;
    const weightedValue = Math.round(projectedACV * (confidenceScore / 100));

    // Determine Tier
    let tier: ValueProjection['tier'] = 'PILOT';
    if (projectedACV >= 200000) tier = 'STRATEGIC';
    else if (projectedACV >= 100000) tier = 'HIGH';
    else if (projectedACV >= 40000) tier = 'CORE';

    return {
      projectedACV,
      confidenceScore,
      weightedValue,
      tier,
      reasoning
    };
  }

  private static getServiceBaseValue(serviceSlug: string, deptSlug?: string): number {
    // Specific service high-value overrides
    const overrides: Record<string, number> = {
      'agentic-ai': 120000,
      'digital-transformation': 250000,
      'servicenow': 90000,
      'aws': 80000,
      'application-modernization': 150000
    };

    if (overrides[serviceSlug]) return overrides[serviceSlug];
    if (deptSlug) return this.getDepartmentBaseValue(deptSlug);
    return 25000;
  }

  private static getDepartmentBaseValue(deptSlug: string): number {
    const deptValues: Record<string, number> = {
      'ai-cognitive-solutions': 100000,
      'digital-transformation-modernization': 150000,
      'cloud-engineering': 70000,
      'cybersecurity': 60000,
      'enterprise-applications': 80000,
      'product-engineering': 90000,
      'digital-marketing': 30000,
      'conversion-engineering': 40000
    };

    return deptValues[deptSlug] || 35000;
  }

  /**
   * Persists the projection to the database.
   */
  static async updateLeadValue(leadId: string): Promise<void> {
    try {
      const projection = await this.projectLeadValue(leadId);
      
      await prisma.eqoreLead.update({
        where: { id: leadId },
        data: {
          projectedValue: projection.projectedACV,
          pipelineWeight: projection.weightedValue,
          valueReasoning: projection.reasoning as any,
          valueTier: projection.tier
        }
      });

      logger.info(`Updated ROI projection for lead ${leadId}: $${projection.projectedACV} ACV (Tier: ${projection.tier})`);
    } catch (error) {
      logger.error(`Failed to update lead value for ${leadId}`, error);
    }
  }
}
