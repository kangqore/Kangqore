import { prisma } from '../lib/prisma';

export class ClientSignalsService {
  /**
   * Calculates the average time (in hours) taken for a client to approve decisions.
   * Lower is better. High latency indicates hesitation.
   */
  async calculateApprovalLatency(clientId: string): Promise<number> {
    const closedDecisions = await prisma.decision.findMany({
      where: {
        clientId,
        status: { in: ['APPROVED', 'REJECTED'] },
        approvedAt: { not: null },
      },
      select: {
        createdAt: true,
        approvedAt: true,
      },
      take: 20, // Analyze last 20 decisions
    });

    if (closedDecisions.length === 0) return 0;

    const totalDuration = closedDecisions.reduce((sum, decision) => {
      if (!decision.approvedAt) return sum;
      return sum + (decision.approvedAt.getTime() - decision.createdAt.getTime());
    }, 0);

    // Convert ms to hours
    return (totalDuration / closedDecisions.length) / (1000 * 60 * 60);
  }

  /**
   * Calculates average response time (in hours) to messages.
   * Tracks time between a partner/admin message and the next client message in the same thread (implied).
   * simplified for MVP: Average gap between received and sent messages if close in time.
   */
  async calculateResponseDelay(clientId: string): Promise<number> {
    const received = await prisma.message.findMany({
      where: { receiverId: clientId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { createdAt: true },
    });

    if (received.length === 0) return 0;

    let totalGapMs = 0;
    let pairCount = 0;

    for (const msg of received) {
      const reply = await prisma.message.findFirst({
        where: {
          senderId: clientId,
          createdAt: { gt: msg.createdAt },
        },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      });
      if (reply) {
        totalGapMs += reply.createdAt.getTime() - msg.createdAt.getTime();
        pairCount++;
      }
    }

    if (pairCount === 0) return 0;
    return (totalGapMs / pairCount) / (1000 * 60 * 60);
  }

  /**
   * Detects "Silence" - days since last meaningful interaction.
   * Interactions: Login, Message Sent, Decision Made, Document Uploaded
   */
  async measureSilence(clientId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: clientId },
      select: { lastLoginAt: true }
    });

    const lastMessage = await prisma.message.findFirst({
      where: { senderId: clientId },
      orderBy: { createdAt: 'desc' }
    });

    const lastDecision = await prisma.decision.findFirst({
        where: { clientId, status: { in: ['APPROVED', 'REJECTED'] } },
        orderBy: { updatedAt: 'desc' }
    });

    const dates = [
      user?.lastLoginAt,
      lastMessage?.createdAt,
      lastDecision?.updatedAt
    ].filter(Boolean) as Date[];

    if (dates.length === 0) return 30; // Default to high silence if no activity found

    // Max date is the most recent activity
    const lastActivity = new Date(Math.max(...dates.map(d => d.getTime())));
    const now = new Date();
    
    // Return days since last activity
    return Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  }

  async calculateTotalRevenue(clientId: string): Promise<number> {
    const result = await prisma.project.aggregate({
        where: { clientId },
        _sum: { spend: true }
    });
    return Number(result._sum?.spend || 0);
  }

  async getClientSignals(clientId: string) {
    const approvalLatencyHours = await this.calculateApprovalLatency(clientId);
    const silenceDays = await this.measureSilence(clientId);
    const responseDelayHours = await this.calculateResponseDelay(clientId);
    const totalRevenue = await this.calculateTotalRevenue(clientId);

    // Composite Risk Score (0-100)
    // Weighted factors: Silence (40%), Latency (40%), Delay (20%)
    let riskScore = 0;
    
    // Silence Risk: > 3 days is concerning, > 7 is high risk
    if (silenceDays > 7) riskScore += 40;
    else if (silenceDays > 3) riskScore += 20;

    // Latency Risk: > 48 hours is concerning
    if (approvalLatencyHours > 72) riskScore += 40;
    else if (approvalLatencyHours > 48) riskScore += 20;

    // Response Delay: > 24 hours
    if (responseDelayHours > 24) riskScore += 20;

    return {
      clientId,
      signals: {
        approval_latency_hours: Math.round(approvalLatencyHours),
        silence_days: silenceDays,
        response_delay_hours: responseDelayHours,
        intent_score: 100 - riskScore, // 100 is best intent, 0 is dropped off
        risk_level: riskScore > 60 ? 'HIGH' : riskScore > 30 ? 'MEDIUM' : 'LOW',
        total_revenue: totalRevenue
      }
    };
  }
}
