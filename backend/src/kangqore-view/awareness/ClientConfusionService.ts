import { prisma } from '../../lib/prisma';

export class ClientConfusionService {
  /**
   * HESITATION ZONES: Decisions the client revisited multiple times (>3 views)
   * Indicates uncertainty or lack of information
   */
  async getHesitationZones(clientId: string) {
    const viewCounts = await prisma.decisionView.groupBy({
      by: ['decisionId'],
      where: { userId: clientId },
      _count: { decisionId: true },
      _sum: { duration: true },
    });

    const hesitationDecisions = viewCounts.filter(v => v._count.decisionId >= 3);

    // Fetch full decision details
    const decisions = await prisma.decision.findMany({
      where: {
        id: { in: hesitationDecisions.map(h => h.decisionId) }
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
      }
    });

    return hesitationDecisions.map(h => {
      const decision = decisions.find(d => d.id === h.decisionId);
      return {
        ...decision,
        viewCount: h._count.decisionId,
        totalDuration: h._sum.duration || 0
      };
    });
  }

  /**
   * TIME PARALYSIS: Decisions where cumulative view time > 10 minutes
   * Suggests cognitive overload or complex wording
   */
  async getTimeParalysisCases(clientId: string) {
    const viewCounts = await prisma.decisionView.groupBy({
      by: ['decisionId'],
      where: { userId: clientId },
      _sum: { duration: true },
      _count: { decisionId: true },
    });

    const prolongedDecisions = viewCounts.filter(
      v => (v._sum.duration || 0) > 600 // >10 minutes
    );

    const decisions = await prisma.decision.findMany({
      where: {
        id: { in: prolongedDecisions.map(p => p.decisionId) }
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
      }
    });

    return prolongedDecisions.map(p => {
      const decision = decisions.find(d => d.id === p.decisionId);
      return {
        ...decision,
        totalDuration: p._sum.duration || 0,
        averageDuration: Math.round((p._sum.duration || 0) / (p._count.decisionId || 1)),
        viewCount: p._count.decisionId
      };
    });
  }

  /**
   * DECISION REOPENS: Decisions moved back to DRAFT after being APPROVED/PENDING
   * Indicates buyer's remorse or new information discovery
   */
  async getDecisionReopens(clientId: string) {
    const reopens = await prisma.decisionStatusHistory.findMany({
      where: {
        userId: clientId,
        fromStatus: { in: ['APPROVED', 'PENDING_APPROVAL', 'REJECTED'] },
        toStatus: 'DRAFT'
      },
      include: {
        decision: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            createdAt: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return reopens.map(r => ({
      ...r.decision,
      reopenedAt: r.createdAt,
      fromStatus: r.fromStatus,
      reopenId: r.id
    }));
  }

  /**
   * COMPOSITE CONFUSION SCORE (0-100)
   * Higher score = more confused client
   */
  calculateConfusionScore(hesitationCount: number, paralysisCount: number, reopenCount: number) {
    let score = 0;
    
    // Hesitation Zones: 30% weight
    if (hesitationCount >= 5) score += 30;
    else if (hesitationCount >= 2) score += 15;

    // Time Paralysis: 40% weight (most important signal)
    if (paralysisCount >= 3) score += 40;
    else if (paralysisCount >= 1) score += 20;

    // Decision Reopens: 30% weight
    if (reopenCount >= 3) score += 30;
    else if (reopenCount >= 1) score += 15;

    return score;
  }

  async getClientConfusionMetrics(clientId: string) {
    const [hesitationZones, paralysisCases, reopens] = await Promise.all([
      this.getHesitationZones(clientId),
      this.getTimeParalysisCases(clientId),
      this.getDecisionReopens(clientId)
    ]);

    const confusionScore = this.calculateConfusionScore(
      hesitationZones.length,
      paralysisCases.length,
      reopens.length
    );

    const riskLevel = confusionScore > 60 ? 'HIGH' : confusionScore > 30 ? 'MEDIUM' : 'LOW';

    return {
      clientId,
      confusion_score: confusionScore,
      risk_level: riskLevel,
      metrics: {
        hesitation_zones: hesitationZones,
        time_paralysis_cases: paralysisCases,
        decision_reopens: reopens
      },
      summary: {
        total_hesitations: hesitationZones.length,
        total_paralysis: paralysisCases.length,
        total_reopens: reopens.length
      }
    };
  }
}
