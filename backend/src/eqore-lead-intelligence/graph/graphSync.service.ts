/**
 * eQORE Big Brain Knowledge Graph — Graph Sync Service (Phase 5)
 * 
 * Keeps the graph synchronized with taxonomy changes.
 * Idempotent: uses upserts. Deactivates missing nodes instead of deleting.
 */

import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { GraphSeedService } from './graphSeed.service';

const SYNC_VERSION = 'graph-sync-v1';

export class GraphSyncService {
  /**
   * Full graph sync: re-seeds everything and deactivates orphaned nodes.
   */
  static async syncAll(): Promise<{ nodes: number; edges: number; deactivated: number }> {
    try {
      logger.info('Starting full graph sync...');

      // 1. Re-seed all (idempotent upserts)
      const result = await GraphSeedService.seedAll();

      // 2. Deactivate nodes whose version doesn't match the latest seed
      const deactivated = await prisma.eqoreGraphNode.updateMany({
        where: { version: { not: 'graph-seed-v1' }, isActive: true },
        data: { isActive: false }
      });

      // 3. Deactivate orphaned edges
      await prisma.eqoreGraphEdge.updateMany({
        where: { version: { not: 'graph-seed-v1' }, isActive: true },
        data: { isActive: false }
      });

      // 4. Log sync event
      logger.info(`Graph sync completed: ${result.nodes} nodes, ${result.edges} edges, ${deactivated.count} deactivated`);

      return {
        nodes: result.nodes,
        edges: result.edges,
        deactivated: deactivated.count
      };
    } catch (error) {
      logger.error('GraphSyncService.syncAll failed:', error);
      throw error;
    }
  }

  /**
   * Get graph statistics for admin visibility.
   */
  static async getStats() {
    const [nodeCount, edgeCount, activeNodes, activeEdges] = await Promise.all([
      prisma.eqoreGraphNode.count(),
      prisma.eqoreGraphEdge.count(),
      prisma.eqoreGraphNode.count({ where: { isActive: true } }),
      prisma.eqoreGraphEdge.count({ where: { isActive: true } })
    ]);

    const nodesByType = await prisma.eqoreGraphNode.groupBy({
      by: ['type'],
      _count: true,
      where: { isActive: true }
    });

    const edgesByType = await prisma.eqoreGraphEdge.groupBy({
      by: ['type'],
      _count: true,
      where: { isActive: true }
    });

    return {
      totalNodes: nodeCount,
      totalEdges: edgeCount,
      activeNodes,
      activeEdges,
      nodesByType: Object.fromEntries(nodesByType.map(n => [n.type, n._count])),
      edgesByType: Object.fromEntries(edgesByType.map(e => [e.type, e._count]))
    };
  }
}
