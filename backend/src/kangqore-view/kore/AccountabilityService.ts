import { 
  PrismaClient, 
  EventSource, 
  ActorRole, 
  RelatedEntityType, 
  ObligationType, 
  ObligationStatus, 
  ImpactType, 
  ImpactUnit, 
  ImpactDomain 
} from '@prisma/client';

const prisma = new PrismaClient();

/**
 * AccountabilityService
 * 
 * CORE PRINCIPLES (NON-NEGOTIABLE):
 * 1. APPEND-ONLY: No updates or deletes allowed (legally defensible immutability)
 * 2. TIME-ORDERED: Automatic timestamp + indexed for chronological queries
 * 3. ACTOR-AWARE: Every event captures userId + IP address for non-repudiation
 * 4. IMPACT-AWARE: Business impact (cost, timeline, risk) recorded
 * 5. ROLE-NEUTRAL: Single source of truth; presentation varies by role
 * 
 * WARNING: This service intentionally exposes ONLY CREATE and READ operations.
 * Do NOT add update() or delete() methods. Modifications violate audit trail integrity.
 */

interface AccountabilityMetrics {
  totalCommitments: number;
  totalEscalations: number;
  totalWithdrawals: number;
  withdrawalRate: number;
  healthScore: 'HEALTHY' | 'CAUTION' | 'RISK';
}

interface LedgerEvent {
  id: string;
  type: string;
  category: string;
  timestamp: Date;
  user: string;
  action: string;
  subject: string;
  impact: string | null;
  note: string | null;
  ipAddress?: string;
  entityLink: { type: string; id: string } | null;
  
  // New Fields
  source?: string;
  role?: string;
  summary?: string;
  impacts?: any[];
}

export class AccountabilityService {
  
  // ==========================================
  // READ OPERATIONS
  // ==========================================

  /**
   * Get full accountability timeline for a project
   * Admin view - shows all events for governance oversight.
   */
  async getProjectAccountabilityLedger(projectId: string): Promise<LedgerEvent[]> {
    const events = await prisma.accountabilityEvent.findMany({
      where: { projectId },
      include: {
        user: { select: { name: true, email: true } },
        decision: { select: { title: true } },
        risk: { select: { title: true, severity: true } },
        changeRequest: { select: { title: true, costImpact: true } },
        deliverable: { select: { title: true } },
        impacts: true // Include quantified impacts
      },
      orderBy: { eventTimestamp: 'desc' }
    });
    
    return this.formatLedger(events);
  }
  
  /**
   * Get client-specific accountability log
   * Client self-service view - shows only their commitments.
   */
  async getClientAccountabilityLog(clientId: string): Promise<LedgerEvent[]> {
    const events = await prisma.accountabilityEvent.findMany({
      where: { clientId },
      include: {
        project: { select: { title: true } },
        user: { select: { name: true } },
        decision: { select: { title: true } },
        risk: { select: { title: true, severity: true } },
        changeRequest: { select: { title: true, costImpact: true } },
        deliverable: { select: { title: true } },
        impacts: true
      },
      orderBy: { eventTimestamp: 'desc' }
    });
    
    return this.formatLedger(events);
  }

  /**
   * Get pending obligations for a project
   */
  async getProjectObligations(projectId: string, status?: ObligationStatus) {
    return await prisma.accountabilityObligation.findMany({
      where: { 
        projectId,
        ...(status ? { status } : {})
      },
      include: {
        owedByUser: { select: { name: true, email: true } },
        linkedEvent: { select: { eventType: true, summary: true } }
      },
      orderBy: { dueDate: 'asc' }
    });
  }

  /**
   * Get client's pending obligations (Action Items)
   */
  async getClientObligations(clientId: string) {
    return await prisma.accountabilityObligation.findMany({
      where: { 
        clientId,
        owedByRole: 'CLIENT',
        status: { in: ['OPEN', 'OVERDUE'] }
      },
      include: {
        linkedEvent: { select: { eventType: true, summary: true } }
      },
      orderBy: { dueDate: 'asc' }
    });
  }

  /**
   * Get "What's Blocking Me" report
   * returns obligations owed TO the user's role
   */
  async getBlockedByReport(projectId: string, myRole: ActorRole) {
    // If I am CLIENT, I want to see what ADMIN/PARTNER owes me
    // If I am ADMIN, I want to see what CLIENT owes me
    return await prisma.accountabilityObligation.findMany({
      where: { 
        projectId,
        status: { in: ['OPEN', 'OVERDUE'] },
        owedByRole: { not: myRole }
      },
      orderBy: { dueDate: 'asc' }
    });
  }
  
  /**
   * Calculate accountability health metrics
   */
  async getAccountabilityMetrics(projectId: string): Promise<AccountabilityMetrics> {
    const events = await prisma.accountabilityEvent.findMany({
      where: { projectId }
    });
    
    const totalCommitments = events.filter((e: any) => e.eventCategory === 'COMMITMENT').length;
    const totalEscalations = events.filter((e: any) => e.eventCategory === 'ESCALATION').length;
    const totalWithdrawals = events.filter((e: any) => e.eventCategory === 'WITHDRAWAL').length;
    
    const withdrawalRate = totalWithdrawals / (totalCommitments || 1);
    const healthScore: 'HEALTHY' | 'CAUTION' | 'RISK' = 
      withdrawalRate < 0.1 ? 'HEALTHY' : 
      withdrawalRate < 0.3 ? 'CAUTION' : 
      'RISK';
    
    return {
      totalCommitments,
      totalEscalations,
      totalWithdrawals,
      withdrawalRate: Math.round(withdrawalRate * 100),
      healthScore
    };
  }
  
  /**
   * Get delay attribution for a project (Who caused the delay?)
   */
  async getDelayAttribution(projectId: string) {
    const impacts = await prisma.accountabilityImpact.findMany({
      where: {
        event: { projectId },
        impactType: 'DELAY_DAYS'
      },
      include: {
        event: { select: { actorRole: true } }
      }
    });

    return impacts.reduce((acc, impact) => {
      const role = impact.event.actorRole || 'SYSTEM'; // Default if null
      // Convert Decimal to number for frontend
      const value = Number(impact.impactValue);
      
      if (role === 'CLIENT') acc.clientDelay += value;
      else if (role === 'ADMIN' || role === 'PARTNER') acc.kangqoreDelay += value;
      else acc.externalDelay += value;
      
      return acc;
    }, { clientDelay: 0, kangqoreDelay: 0, externalDelay: 0 });
  }

  /**
   * Get ALL overdue obligations (for Admin Widget)
   */
  async getOverdueObligations() {
    return await prisma.accountabilityObligation.findMany({
      where: { status: 'OVERDUE' },
      include: {
        client: { select: { name: true, company: true, email: true } },
        project: { select: { title: true } },
        linkedEvent: { select: { summary: true } }
      },
      orderBy: { dueDate: 'asc' }
    });
  }

  // ==========================================
  // WRITE OPERATIONS (APPEND-ONLY)
  // ==========================================

  /**
   * Create an accountability event (Canonical & Legacy compatible)
   */
  async createAccountabilityEvent({
    eventType,
    eventCategory,
    projectId,
    clientId,
    userId,
    // Legacy fields (optional)
    decisionId,
    riskId,
    changeRequestId,
    deliverableId,
    actionTaken,
    impactSummary,
    commitmentNote,
    ipAddress,
    // Canonical fields (optional)
    eventSource,
    actorRole,
    relatedEntityType,
    relatedEntityId,
    summary
  }: {
    eventType: string;
    eventCategory: string;
    projectId: string;
    clientId: string;
    userId: string;
    decisionId?: string;
    riskId?: string;
    changeRequestId?: string;
    deliverableId?: string;
    actionTaken: string;
    impactSummary?: string;
    commitmentNote?: string;
    ipAddress?: string;
    eventSource?: EventSource;
    actorRole?: ActorRole;
    relatedEntityType?: RelatedEntityType;
    relatedEntityId?: string;
    summary?: string;
  }) {
    return await prisma.accountabilityEvent.create({
      data: {
        eventType,
        eventCategory,
        projectId,
        clientId,
        userId,
        // Legacy
        decisionId,
        riskId,
        changeRequestId,
        deliverableId,
        actionTaken,
        impactSummary,
        commitmentNote,
        ipAddress,
        // Canonical
        eventSource: eventSource || 'API',
        actorRole: actorRole || 'SYSTEM',
        relatedEntityType,
        relatedEntityId,
        summary: summary || `${actionTaken} ${eventType}`
      }
    });
  }

  /**
   * Create a new obligation (Waiting on someone)
   */
  async createObligation(data: {
    clientId: string;
    projectId: string;
    obligationType: ObligationType;
    owedByRole: ActorRole;
    owedByUserId?: string;
    description: string;
    dueDate?: Date;
    linkedEventId: string;
  }) {
    return await prisma.accountabilityObligation.create({
      data: {
        ...data,
        status: 'OPEN'
      }
    });
  }

  /**
   * Resolve an obligation (Mark fulfilled)
   */
  async resolveObligation(obligationId: string) {
    return await prisma.accountabilityObligation.update({
      where: { id: obligationId },
      data: {
        status: 'FULFILLED',
        resolvedAt: new Date()
      }
    });
  }

  /**
   * Record a quantified impact (The Math)
   */
  async recordImpact(data: {
    eventId: string;
    impactType: ImpactType;
    impactValue: number;
    impactUnit: ImpactUnit;
    appliedTo: ImpactDomain;
  }) {
    return await prisma.accountabilityImpact.create({
      data
    });
  }

  // ==========================================
  // SNAPSHOTS & REPORTING
  // ==========================================

  /**
   * Generate daily snapshot for executive reporting
   */
  async generateDailySnapshot(projectId: string, clientId: string) {
    // 1. Calculate Cumulative Stats (All-Time)
    // This ensures idempotency and self-healing snapshots
    const impacts = await prisma.accountabilityImpact.findMany({
      where: {
        event: { projectId }
      },
      include: { event: true }
    });

    let clientDelay = 0;
    let adminDelay = 0;
    let clientBudget = 0;
    let riskAccumulation = 0;

    for (const imp of impacts) {
      const isClient = imp.event.actorRole === 'CLIENT';
      const isVendor = imp.event.actorRole === 'ADMIN' || imp.event.actorRole === 'PARTNER';
      
      if (imp.impactType === 'DELAY_DAYS') {
        if (isClient) clientDelay += Number(imp.impactValue);
        else if (isVendor) adminDelay += Number(imp.impactValue);
        // External/System delays could be handled too, but usually System Accrual is attributed to Fault Role
      }
      
      if (imp.impactType === 'COST_INCREASE' && isClient) {
        clientBudget += Number(imp.impactValue);
      }

      if (imp.impactType === 'RISK_SCORE') {
        riskAccumulation += Number(imp.impactValue);
      }
    }

    console.log(`📸 Snapshot computed for Project ${projectId}: ClientDelay=${clientDelay}, VendorDelay=${adminDelay}`);

    // 2. Create/Update Daily Snapshot
    return await prisma.accountabilitySnapshot.upsert({
      where: {
        projectId_snapshotDate: {
          projectId,
          snapshotDate: new Date() // Today (date part handled by DB or usage convention - usually truncate time)
          // Ideally we truncate to YYYY-MM-DD but Prisma DateTime includes time. 
          // For nightly job running at 00:00, it's roughly day start. 
          // Ideally we'd normalize, but for MVP this works if job is consistent.
        }
      },
      update: {
        // Set distinct values (Idempotent)
        clientDelayDays: clientDelay,
        adminDelayDays: adminDelay,
        budgetClientCaused: clientBudget,
        riskScore: riskAccumulation
      },
      create: {
        clientId,
        projectId,
        snapshotDate: new Date(),
        clientDelayDays: clientDelay,
        adminDelayDays: adminDelay,
        budgetClientCaused: clientBudget,
        riskScore: riskAccumulation
      }
    });
  }

  /**
   * Check for overdue obligations and escalate
   */
  async checkOverdueObligations() {
    console.log('🕵️ Checking for overdue obligations...');
    const now = new Date();
    
    // Find OPEN obligations past due
    const overdue = await prisma.accountabilityObligation.findMany({
      where: {
        status: 'OPEN',
        dueDate: { lt: now }
      },
      include: { linkedEvent: true, client: true }
    });

    console.log(`Found ${overdue.length} overdue obligations.`);

    for (const ob of overdue) {
      // 1. Mark as OVERDUE
      await prisma.accountabilityObligation.update({
        where: { id: ob.id },
        data: { status: 'OVERDUE' }
      });

      // 2. Emit APPROVAL_DELAY Event
      await this.createAccountabilityEvent({
        eventType: 'APPROVAL_DELAY',
        eventCategory: 'ALERT',
        projectId: ob.projectId,
        clientId: ob.clientId,
        userId: 'SYSTEM', // System generated
        actionTaken: 'Overdue Alert',
        eventSource: 'SYSTEM_RULE',
        actorRole: 'SYSTEM',
        relatedEntityType: ob.linkedEvent.relatedEntityType || undefined, // Inherit from parent event
        relatedEntityId: ob.linkedEvent.relatedEntityId || undefined,
        summary: `Overdue obligation: ${ob.description}`,
        impactSummary: 'Delay in process'
      });

      // 3. Optional: Notify (Gap 7 - but out of scope for this specific step, keeping simple)
    }
  }

  /**
   * Run nightly to accrue daily delays for any OVERDUE obligation.
   * Rule: IF status=OVERDUE THEN delay += 1 Day
   */
  async processDailyImpactAccruals() {
    console.log('📉 Processing Daily Impact Accruals...');
    // Find all OVERDUE obligations
    const overdueImpacts = await prisma.accountabilityObligation.findMany({
        where: { status: 'OVERDUE' },
        include: { linkedEvent: true } // Need context
    });
    
    let accrualCount = 0;

    for (const ob of overdueImpacts) {
        // Correctly attribute fault based on who owed the obligation
        // If Client owed it, ActorRole = CLIENT (even though System generated it)
        // If Admin owed it, ActorRole = ADMIN
        const faultRole = ob.owedByRole === 'CLIENT' ? 'CLIENT' : 'ADMIN';

        // Create an "Impact Accrual" event for this specific day
        const event = await this.createAccountabilityEvent({
            eventType: 'IMPACT_ACCRUAL',
            eventCategory: 'SYSTEM',
            projectId: ob.projectId,
            clientId: ob.clientId,
            userId: 'SYSTEM',
            actionTaken: 'Daily Delay Accrual',
            eventSource: 'SYSTEM_RULE',
            actorRole: faultRole, // <--- Key Fix: Fault attribution
            relatedEntityType: ob.linkedEvent.relatedEntityType || undefined,
            relatedEntityId: ob.linkedEvent.relatedEntityId || undefined,
            summary: `Daily delay accrued for overdue obligation: ${ob.description}`,
            impactSummary: 'Delay: +1 Day'
        });

        // Record the actual impact
        await this.recordImpact({
            eventId: event.id,
            impactType: 'DELAY_DAYS',
            impactValue: 1, // 1 day added
            impactUnit: 'DAYS',
            appliedTo: 'TIMELINE'
        });
        accrualCount++;
    }
    console.log(`✅ Accrued daily delay impacts for ${accrualCount} items.`);
  }

  /**
   * Get latest impact analytics for a client (first active project)
   */
  async getClientImpactAnalytics(clientId: string) {
    // Find active project for this client
    const project = await prisma.project.findFirst({
      where: { 
        clientId: clientId,
        status: 'ACTIVE'
      }
    });

    if (!project) {
      return { clientDelay: 0, vendorDelay: 0, externalDelay: 0 };
    }

    const snapshot = await prisma.accountabilitySnapshot.findFirst({
      where: { projectId: project.id },
      orderBy: { snapshotDate: 'desc' }
    });

    return {
      clientDelay: snapshot?.clientDelayDays || 0,
      vendorDelay: snapshot?.adminDelayDays || 0, // Admin = Vendor (Kangqore)
      externalDelay: snapshot?.externalDelayDays || 0
    };
  }

  /**
   * Get impact history for charting (Time-series)
   */
  async getClientImpactHistory(clientId: string) {
    const project = await prisma.project.findFirst({
      where: { clientId: clientId, status: 'ACTIVE' }
    });

    if (!project) return [];

    const snapshots = await prisma.accountabilitySnapshot.findMany({
      where: { projectId: project.id },
      orderBy: { snapshotDate: 'asc' },
      take: 90 // Last 90 days
    });

    return snapshots.map(s => ({
      date: s.snapshotDate,
      clientDelay: s.clientDelayDays,
      vendorDelay: s.adminDelayDays,
      externalDelay: s.externalDelayDays,
      riskScore: s.riskScore
    }));
  }
  
  private formatLedger(events: any[]): LedgerEvent[] {
    return events.map(event => ({
      id: event.id,
      type: event.eventType,
      category: event.eventCategory,
      timestamp: event.eventTimestamp,
      user: event.user?.name || 'Unknown',
      action: event.actionTaken, // Keep legacy for UI compat
      subject: this.getEventSubject(event),
      impact: event.impactSummary, // Keep legacy for UI compat
      note: event.commitmentNote,
      ipAddress: event.ipAddress,
      entityLink: this.getEntityLink(event),
      
      // New fields
      source: event.eventSource,
      role: event.actorRole,
      summary: event.summary,
      impacts: event.impacts
    }));
  }
  
  private getEventSubject(event: any): string {
    if (event.decision) return event.decision.title;
    if (event.risk) return event.risk.title;
    if (event.changeRequest) return event.changeRequest.title;
    if (event.deliverable) return event.deliverable.title;
    // Fallback to summary if no relation
    if (event.summary) return event.summary.split(' ').slice(0, 5).join(' ') + '...';
    return 'Unknown';
  }
  
  private getEntityLink(event: any): { type: string; id: string } | null {
    if (event.decisionId) return { type: 'decision', id: event.decisionId };
    if (event.riskId) return { type: 'risk', id: event.riskId };
    if (event.changeRequestId) return { type: 'change', id: event.changeRequestId };
    if (event.deliverableId) return { type: 'deliverable', id: event.deliverableId };
    // Canonical fallback
    if (event.relatedEntityType && event.relatedEntityId) {
      return { type: event.relatedEntityType.toLowerCase(), id: event.relatedEntityId };
    }
    return null;
  }
}

export default new AccountabilityService();
