/**
 * eQORE Big Brain Knowledge Graph — Recommendation Service (Phase 5)
 * 
 * Higher-level recommendation logic that consumes graphQuery.service.ts
 * and persists enriched context to the lead record.
 */

import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { GraphQueryService } from './graphQuery.service';

const GRAPH_CONTEXT_VERSION = 'graph-rec-v1';

export class GraphRecommendationService {
  /**
   * Full lead enrichment: builds graph context and persists it.
   * Called after service matching completes.
   */
  static async enrichLeadContext(leadId: string): Promise<boolean> {
    try {
      const context = await GraphQueryService.getFullContext(leadId);
      if (!context) {
        logger.warn(`GraphRecommendation: No context generated for lead ${leadId}`);
        return false;
      }

      // Build cross-sell recommendations
      const crossSells = context.crossSellServices.slice(0, 5).map((cs: any) => ({
        slug: cs.service?.slug,
        label: cs.service?.label,
        type: cs.service?.type,
        relationshipType: cs.relationshipType,
        reason: cs.reason,
        weight: cs.weight
      }));

      // Build case study recommendations
      const caseStudies = context.caseStudies.slice(0, 3).map((cs: any) => ({
        slug: cs.slug,
        title: cs.title,
        industry: cs.industry,
        outcomeMetrics: cs.outcomeMetrics,
        proofStatus: cs.proofStatus
      }));

      // Build consultant recommendation
      const consultant = context.recommendedConsultant ? {
        slug: context.recommendedConsultant.slug,
        name: context.recommendedConsultant.name,
        title: context.recommendedConsultant.title,
        expertiseTags: context.recommendedConsultant.expertiseTags,
        matchScore: context.recommendedConsultant.matchScore
      } : null;

      // Persist to lead
      await prisma.eqoreLead.update({
        where: { id: leadId },
        data: {
          graphContext: context,
          graphEnrichedAt: new Date(),
          graphContextVersion: GRAPH_CONTEXT_VERSION,
          recommendedCrossSells: crossSells.length > 0 ? crossSells : undefined,
          recommendedCaseStudies: caseStudies.length > 0 ? caseStudies : undefined,
          recommendedConsultant: consultant || undefined
        }
      });

      // Log enrichment event
      await prisma.eqoreLeadEvent.create({
        data: {
          leadId,
          eventType: 'GRAPH_ENRICHMENT_COMPLETED',
          reason: `Graph context enriched with ${crossSells.length} cross-sells, ${caseStudies.length} case studies, consultant: ${consultant?.name || 'none'}`,
          eventData: {
            version: GRAPH_CONTEXT_VERSION,
            crossSellCount: crossSells.length,
            caseStudyCount: caseStudies.length,
            hasConsultant: !!consultant,
            problemCount: context.relatedProblems?.length || 0,
            industryCount: context.relatedIndustries?.length || 0
          } as any
        }
      });

      logger.info(`Graph enrichment completed for lead ${leadId}: ${crossSells.length} cross-sells, ${caseStudies.length} case studies`);
      return true;

    } catch (error) {
      logger.error(`GraphRecommendation.enrichLeadContext failed for lead ${leadId}:`, error);
      return false;
    }
  }

  /**
   * Recommend cross-sell services based on matched services.
   */
  static async recommendCrossSell(leadId: string) {
    const lead = await prisma.eqoreLead.findUnique({ where: { id: leadId } });
    if (!lead) return [];

    const matchedServices = (lead.matchedServices as any[]) || [];
    const allCrossSells: any[] = [];

    for (const match of matchedServices) {
      const slug = match.slug || match.service;
      if (!slug) continue;
      const related = await GraphQueryService.getRelatedServices(slug);
      for (const r of related) {
        const neighborSlug = r.fromNode.slug === slug ? r.toNode.slug : r.fromNode.slug;
        if (!matchedServices.some(m => (m.slug || m.service) === neighborSlug)) {
          allCrossSells.push({
            slug: neighborSlug,
            label: r.fromNode.slug === slug ? r.toNode.label : r.fromNode.label,
            type: r.type,
            reason: r.reason,
            weight: r.weight
          });
        }
      }
    }

    // Deduplicate by slug
    const seen = new Set<string>();
    return allCrossSells.filter(cs => {
      if (seen.has(cs.slug)) return false;
      seen.add(cs.slug);
      return true;
    }).slice(0, 5);
  }

  /**
   * Find the most relevant case study for a lead.
   */
  static async recommendCaseStudy(leadId: string) {
    const lead = await prisma.eqoreLead.findUnique({ where: { id: leadId } });
    if (!lead) return [];

    const matchedServices = (lead.matchedServices as any[]) || [];
    const allCaseStudies: any[] = [];

    for (const match of matchedServices) {
      const slug = match.slug || match.service;
      if (!slug) continue;
      const studies = await GraphQueryService.getCaseStudies(slug);
      allCaseStudies.push(...studies);
    }

    // Deduplicate by slug
    const seen = new Set<string>();
    return allCaseStudies.filter(cs => {
      if (seen.has(cs.slug)) return false;
      seen.add(cs.slug);
      return true;
    }).slice(0, 3);
  }

  /**
   * Match the best consultant for a lead's consultation.
   */
  static async recommendConsultant(leadId: string) {
    const lead = await prisma.eqoreLead.findUnique({ where: { id: leadId } });
    if (!lead || !lead.primaryDepartment) return null;

    const matchedServices = (lead.matchedServices as any[]) || [];
    const primaryServiceSlug = matchedServices[0]?.slug || matchedServices[0]?.service;
    const deptSlug = lead.primaryDepartment.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    return GraphQueryService.getConsultantMatch(deptSlug, primaryServiceSlug);
  }
}
