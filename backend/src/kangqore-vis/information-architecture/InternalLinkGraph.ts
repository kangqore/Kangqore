import { prisma } from '../../lib/prisma';

export interface GraphNode {
  id: string;
  url: string;
  pageType: string;
}

export interface GraphEdge {
  sourceId: string;
  targetId: string;
}

export class InternalLinkGraph {
  static async build(): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const blueprints = await prisma.kangqoreVisPageBlueprint.findMany({
      select: { id: true, url: true, pageType: true },
    });
    const links = await prisma.kangqoreVisInternalLink.findMany({
      select: { sourceId: true, targetId: true },
    });

    return {
      nodes: blueprints.map((b) => ({ id: b.id, url: b.url, pageType: b.pageType })),
      edges: links,
    };
  }
}
