/**
 * eQORE Big Brain Knowledge Graph — Graph Query Service (Phase 5)
 * 
 * Provides relational queries against the knowledge graph.
 * Traversal depth capped at maxDepth=3, maxNodes=50 per CTO directive.
 */

import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';

const MAX_DEPTH = 3;
const MAX_NODES = 50;

export type GraphNodeResult = {
  id: string;
  type: string;
  slug: string;
  label: string;
  description: string | null;
  metadata: any;
};

export type GraphEdgeResult = {
  id: string;
  type: string;
  weight: number;
  confidence: number;
  reason: string | null;
  fromNode: GraphNodeResult;
  toNode: GraphNodeResult;
};

export class GraphQueryService {
  /**
   * Returns services related via CROSS_SELLS or COMPLEMENTS edges.
   */
  static async getRelatedServices(serviceSlug: string): Promise<GraphEdgeResult[]> {
    const node = await prisma.eqoreGraphNode.findUnique({
      where: { type_slug: { type: 'SERVICE', slug: serviceSlug } }
    });
    if (!node) return [];

    const edges = await prisma.eqoreGraphEdge.findMany({
      where: {
        isActive: true,
        OR: [
          { fromNodeId: node.id, type: { in: ['CROSS_SELLS', 'COMPLEMENTS'] } },
          { toNodeId: node.id, type: { in: ['CROSS_SELLS', 'COMPLEMENTS'] } }
        ]
      },
      include: {
        fromNode: true,
        toNode: true
      },
      take: MAX_NODES
    });

    return edges.map(e => this.mapEdge(e));
  }

  /**
   * Returns problems this service solves.
   */
  static async getServiceProblems(serviceSlug: string): Promise<GraphNodeResult[]> {
    const node = await prisma.eqoreGraphNode.findUnique({
      where: { type_slug: { type: 'SERVICE', slug: serviceSlug } }
    });
    if (!node) return [];

    const edges = await prisma.eqoreGraphEdge.findMany({
      where: {
        fromNodeId: node.id,
        type: 'SOLVES',
        isActive: true
      },
      include: { toNode: true },
      take: MAX_NODES
    });

    return edges.map(e => this.mapNode(e.toNode));
  }

  /**
   * Returns industries where this service has proven results.
   */
  static async getIndustryFit(serviceSlug: string): Promise<GraphNodeResult[]> {
    // Service → BELONGS_TO → Department → PROVEN_IN → Industry
    const node = await prisma.eqoreGraphNode.findUnique({
      where: { type_slug: { type: 'SERVICE', slug: serviceSlug } }
    });
    if (!node) return [];

    // Get department
    const deptEdge = await prisma.eqoreGraphEdge.findFirst({
      where: { fromNodeId: node.id, type: 'BELONGS_TO', isActive: true },
      include: { toNode: true }
    });
    if (!deptEdge) return [];

    // Get industries from department
    const industryEdges = await prisma.eqoreGraphEdge.findMany({
      where: { fromNodeId: deptEdge.toNodeId, type: 'PROVEN_IN', isActive: true },
      include: { toNode: true },
      take: MAX_NODES
    });

    return industryEdges.map(e => this.mapNode(e.toNode));
  }

  /**
   * Returns relevant case studies for a service, optionally filtered by industry.
   */
  static async getCaseStudies(serviceSlug: string, industrySlug?: string): Promise<any[]> {
    const where: any = {
      servicesSlugs: { path: [], array_contains: [serviceSlug] }
    };

    // We use the EqoreCaseStudy table directly for richer data
    let caseStudies = await prisma.eqoreCaseStudy.findMany({
      where: {
        isActive: true,
        proofStatus: { not: 'CLIENT_APPROVED' } // Include SEED_EXAMPLE for v1
      },
      include: { industry: true },
      take: 10
    });

    // Filter by service slug (JSON array contains)
    caseStudies = caseStudies.filter(cs => {
      const slugs = (cs.servicesSlugs as string[]) || [];
      return slugs.includes(serviceSlug);
    });

    if (industrySlug) {
      caseStudies = caseStudies.filter(cs => cs.industry?.slug === industrySlug);
    }

    return caseStudies.map(cs => ({
      id: cs.id,
      slug: cs.slug,
      title: cs.title,
      description: cs.description,
      industry: cs.industry?.name || null,
      departmentSlug: cs.departmentSlug,
      outcomeMetrics: cs.outcomeMetrics,
      proofStatus: cs.proofStatus,
      clientName: cs.isAnonymized ? cs.clientName : cs.clientName
    }));
  }

  /**
   * Returns best-fit consultant for a department/service combination.
   */
  static async getConsultantMatch(departmentSlug: string, serviceSlug?: string): Promise<any | null> {
    let consultants = await prisma.eqoreConsultantProfile.findMany({
      where: { isActive: true, availableForRouting: true }
    });

    // Score consultants by relevance
    const scored = consultants.map(c => {
      let score = 0;
      const depts = (c.departmentSlugs as string[]) || [];
      const svcs = (c.serviceSlugs as string[]) || [];

      if (depts.includes(departmentSlug)) score += 50;
      if (serviceSlug && svcs.includes(serviceSlug)) score += 30;

      // Priority boost
      if (c.priorityLevel === 'principal') score += 15;
      else if (c.priorityLevel === 'senior') score += 10;

      return { ...c, matchScore: score };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    const best = scored[0];

    if (!best || best.matchScore === 0) return null;

    return {
      id: best.id,
      slug: best.slug,
      name: best.name,
      title: best.title,
      bio: best.bio,
      expertiseTags: best.expertiseTags,
      matchScore: best.matchScore,
      priorityLevel: best.priorityLevel
    };
  }

  /**
   * Generic graph traversal with configurable depth and edge type filters.
   */
  static async traverseRelationships(
    nodeId: string,
    depth: number = 2,
    edgeTypes?: string[]
  ): Promise<{ nodes: GraphNodeResult[]; edges: GraphEdgeResult[] }> {
    const cappedDepth = Math.min(depth, MAX_DEPTH);
    const visitedNodeIds = new Set<string>();
    const resultNodes: GraphNodeResult[] = [];
    const resultEdges: GraphEdgeResult[] = [];

    const queue: { id: string; currentDepth: number }[] = [{ id: nodeId, currentDepth: 0 }];

    while (queue.length > 0 && resultNodes.length < MAX_NODES) {
      const current = queue.shift()!;
      if (visitedNodeIds.has(current.id) || current.currentDepth > cappedDepth) continue;
      visitedNodeIds.add(current.id);

      const node = await prisma.eqoreGraphNode.findUnique({ where: { id: current.id } });
      if (!node || !node.isActive) continue;
      resultNodes.push(this.mapNode(node));

      if (current.currentDepth < cappedDepth) {
        const edgeWhere: any = {
          isActive: true,
          OR: [{ fromNodeId: current.id }, { toNodeId: current.id }]
        };
        if (edgeTypes && edgeTypes.length > 0) {
          edgeWhere.type = { in: edgeTypes };
        }

        const edges = await prisma.eqoreGraphEdge.findMany({
          where: edgeWhere,
          include: { fromNode: true, toNode: true },
          take: 20
        });

        for (const edge of edges) {
          resultEdges.push(this.mapEdge(edge));
          const neighborId = edge.fromNodeId === current.id ? edge.toNodeId : edge.fromNodeId;
          if (!visitedNodeIds.has(neighborId)) {
            queue.push({ id: neighborId, currentDepth: current.currentDepth + 1 });
          }
        }
      }
    }

    return { nodes: resultNodes, edges: resultEdges };
  }

  /**
   * Builds a complete "Lead Graph Context" for a specific lead.
   */
  static async getFullContext(leadId: string): Promise<any> {
    const lead = await prisma.eqoreLead.findUnique({ where: { id: leadId } });
    if (!lead) return null;

    const matchedServices = (lead.matchedServices as any[]) || [];
    const primaryDept = lead.primaryDepartment;
    const primaryServiceSlug = matchedServices[0]?.slug || matchedServices[0]?.service;

    const context: any = {
      leadId,
      primaryDepartment: primaryDept,
      matchedServiceSlugs: matchedServices.map(s => s.slug || s.service),
      relatedProblems: [],
      relatedIndustries: [],
      crossSellServices: [],
      caseStudies: [],
      recommendedConsultant: null,
      graphVersion: 'graph-query-v1',
      generatedAt: new Date().toISOString()
    };

    if (primaryServiceSlug) {
      // Get problems
      context.relatedProblems = await this.getServiceProblems(primaryServiceSlug);

      // Get industries
      context.relatedIndustries = await this.getIndustryFit(primaryServiceSlug);

      // Get cross-sells
      const related = await this.getRelatedServices(primaryServiceSlug);
      context.crossSellServices = related.map(e => ({
        service: e.fromNode.slug === primaryServiceSlug ? e.toNode : e.fromNode,
        relationshipType: e.type,
        reason: e.reason,
        weight: e.weight
      }));

      // Get case studies
      context.caseStudies = await this.getCaseStudies(primaryServiceSlug);
    }

    if (primaryDept) {
      // Get consultant
      context.recommendedConsultant = await this.getConsultantMatch(
        this.slugifyDept(primaryDept),
        primaryServiceSlug
      );
    }

    return context;
  }

  // --- Mappers ---

  private static mapNode(node: any): GraphNodeResult {
    return {
      id: node.id,
      type: node.type,
      slug: node.slug,
      label: node.label,
      description: node.description,
      metadata: node.metadata
    };
  }

  private static mapEdge(edge: any): GraphEdgeResult {
    return {
      id: edge.id,
      type: edge.type,
      weight: edge.weight,
      confidence: edge.confidence,
      reason: edge.reason,
      fromNode: this.mapNode(edge.fromNode),
      toNode: this.mapNode(edge.toNode)
    };
  }

  private static slugifyDept(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
}
