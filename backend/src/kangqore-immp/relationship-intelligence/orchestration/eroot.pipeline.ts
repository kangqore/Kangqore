import { prisma } from '../../../lib/prisma'
import { urgiEventBus } from '../events/eventBus'
import {
  EvidenceRecord,
  RelationshipStrategyObject,
} from '../models/urgi.types'

// eROOT — WAANDA's Perception Stage
// Builds the Relationship Strategy Object (RSO) from real data.
// Every method follows a priority chain: richest source first, safe fallback last.
export class ERootPipeline {

  public async processVisitorInteraction(
    visitorId: string,
    contextData: { leadId?: string; sessionId?: string; conversationId?: string },
  ): Promise<RelationshipStrategyObject> {

    const [activeHypotheses, intents, goals, emotion, trustScore, relationshipStage] =
      await Promise.all([
        this.analyzeIdentity(visitorId, contextData),
        this.analyzeIntent(contextData),
        this.analyzeGoals(contextData),
        this.analyzeEmotion(contextData),
        this.calculateTrustScore(visitorId),
        this.deriveRelationshipStage(visitorId, contextData),
      ])

    const rso: RelationshipStrategyObject = {
      visitorId,
      relationshipStage,
      intent:           intents,
      goals,
      emotion,
      trustScore,
      activeHypotheses,
      suggestedTone:    this.determineSuggestedTone(relationshipStage, emotion),
    }

    urgiEventBus.emitRelationshipStrategyReady(rso)
    return rso
  }

  // ── Identity: what we know about this visitor ────────────────────────────

  private async analyzeIdentity(
    visitorId: string,
    _contextData: { leadId?: string; sessionId?: string; conversationId?: string },
  ): Promise<EvidenceRecord[]> {
    const rows = await prisma.evidenceLedger.findMany({
      where:   { profile: { visitorId } },
      orderBy: { confidenceScore: 'desc' },
      include: { profile: { select: { visitorId: true } } },
    }).catch(() => [])

    return rows.map(r => ({
      id:              r.id,
      factKey:         r.factKey,
      factValue:       r.factValue,
      source:          r.source,
      confidenceScore: r.confidenceScore,
      evidenceType:    r.evidenceType as any,
      timestamp:       r.createdAt,
    }))
  }

  // ── Intent: what the visitor is trying to accomplish ────────────────────

  private async analyzeIntent(
    contextData: { leadId?: string; sessionId?: string; conversationId?: string },
  ): Promise<string[]> {
    const intents: string[] = []

    // 1. Richest: EqoreLead.primaryIntent
    if (contextData.leadId) {
      const lead = await prisma.eqoreLead.findUnique({
        where:  { id: contextData.leadId },
        select: { primaryIntent: true },
      }).catch(() => null)
      if (lead?.primaryIntent) intents.push(lead.primaryIntent)
    }

    // 2. HcipSession.intentSignals (JSON array)
    if (contextData.sessionId) {
      const session = await (prisma as any).hcipSession.findUnique({
        where:  { sessionId: contextData.sessionId },
        select: { intentSignals: true },
      }).catch(() => null)
      if (session?.intentSignals) {
        const signals = session.intentSignals as string[]
        if (Array.isArray(signals)) intents.push(...signals)
      }
    }

    // 3. KimmpSignal where signalCategory='INTENT'
    if (contextData.conversationId) {
      const signals = await prisma.kimmpSignal.findMany({
        where:  { signalCategory: 'INTENT', conversationId: contextData.conversationId },
        select: { signalValue: true },
        take:   10,
      }).catch(() => [])
      intents.push(...signals.map(s => s.signalValue))
    }

    // Deduplicate, filter empty
    return [...new Set(intents.filter(Boolean))]
  }

  // ── Goals: what the visitor is ultimately trying to achieve ─────────────

  private async analyzeGoals(
    contextData: { leadId?: string; sessionId?: string; conversationId?: string },
  ): Promise<string[]> {
    const goals: string[] = []

    // 1. HcipSession.goalsCaptured (JSON array)
    if (contextData.sessionId) {
      const session = await (prisma as any).hcipSession.findUnique({
        where:  { sessionId: contextData.sessionId },
        select: { goalsCaptured: true },
      }).catch(() => null)
      if (session?.goalsCaptured) {
        const captured = session.goalsCaptured as string[]
        if (Array.isArray(captured)) goals.push(...captured)
      }
    }

    // 2. EqoreLead.painPoints + problemStatement
    if (contextData.leadId) {
      const lead = await prisma.eqoreLead.findUnique({
        where:  { id: contextData.leadId },
        select: { painPoints: true, problemStatement: true },
      }).catch(() => null)
      if (lead) {
        if (Array.isArray(lead.painPoints)) goals.push(...(lead.painPoints as string[]))
        if (lead.problemStatement) {
          // Split multi-sentence problem statements into distinct goals
          const sentences = lead.problemStatement
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 10)
          goals.push(...sentences)
        }
      }
    }

    return [...new Set(goals.filter(Boolean))]
  }

  // ── Emotion: visitor's current emotional register ────────────────────────

  private async analyzeEmotion(
    contextData: { leadId?: string; sessionId?: string; conversationId?: string },
  ): Promise<RelationshipStrategyObject['emotion']> {

    // 1. From EqoreLead buying/negative signal balance
    if (contextData.leadId) {
      const lead = await prisma.eqoreLead.findUnique({
        where:  { id: contextData.leadId },
        select: { buyingSignals: true, negativeSignals: true, urgency: true },
      }).catch(() => null)

      if (lead) {
        const buying   = Array.isArray(lead.buyingSignals)   ? (lead.buyingSignals as unknown[]).length   : 0
        const negative = Array.isArray(lead.negativeSignals) ? (lead.negativeSignals as unknown[]).length : 0

        if (negative > 0)              return 'FRUSTRATED'
        if (lead.urgency === 'HIGH')   return 'CURIOUS'   // high urgency = engaged/eager
        if (buying > negative)         return 'EXCITED'
      }
    }

    // 2. KimmpSignal BEHAVIOR signals as secondary signal
    if (contextData.conversationId) {
      const signal = await prisma.kimmpSignal.findFirst({
        where:   { signalCategory: 'BEHAVIOR', conversationId: contextData.conversationId },
        orderBy: { createdAt: 'desc' },
        select:  { signalValue: true },
      }).catch(() => null)

      if (signal) {
        const v = signal.signalValue.toUpperCase()
        if (v.includes('FRUSTRAT') || v.includes('NEGATIVE')) return 'FRUSTRATED'
        if (v.includes('EXCIT')    || v.includes('POSITIVE'))  return 'EXCITED'
        if (v.includes('CONFUS'))                              return 'CONFUSED'
        if (v.includes('CURIOUS')  || v.includes('INTEREST'))  return 'CURIOUS'
      }
    }

    return 'NEUTRAL'
  }

  // ── Trust Score: how well WAANDA knows and trusts this visitor ───────────

  private async calculateTrustScore(visitorId: string): Promise<number> {
    // 1. Explicit trustScore on UnifiedRelationshipProfile
    const profile = await prisma.unifiedRelationshipProfile.findFirst({
      where:  { visitorId },
      select: { trustScore: true },
    }).catch(() => null)

    if (profile && profile.trustScore > 0) return profile.trustScore

    // 2. Average confidenceScore across evidence ledger
    const agg = await prisma.evidenceLedger.aggregate({
      where:   { profile: { visitorId } },
      _avg:    { confidenceScore: true },
      _count:  { id: true },
    }).catch(() => null)

    if (agg && agg._count.id > 0 && agg._avg.confidenceScore !== null) {
      return agg._avg.confidenceScore * 100 // normalise to 0–100
    }

    return 5.0 // safe baseline for new visitors
  }

  // ── Relationship Stage: where this visitor sits in the relationship arc ──

  private async deriveRelationshipStage(
    visitorId: string,
    contextData: { leadId?: string; sessionId?: string; conversationId?: string },
  ): Promise<RelationshipStrategyObject['relationshipStage']> {

    // 1. HcipSession.visitorStage is the authoritative enum
    if (contextData.sessionId) {
      const session = await (prisma as any).hcipSession.findUnique({
        where:  { sessionId: contextData.sessionId },
        select: { visitorStage: true },
      }).catch(() => null)
      if (session?.visitorStage) {
        const stage = session.visitorStage as RelationshipStrategyObject['relationshipStage']
        const valid: RelationshipStrategyObject['relationshipStage'][] =
          ['UNKNOWN', 'KNOWN', 'VERIFIED', 'CUSTOMER', 'ADVOCATE']
        if (valid.includes(stage)) return stage
      }
    }

    // 2. Profile existence → KNOWN
    const profile = await prisma.unifiedRelationshipProfile.findFirst({
      where:  { visitorId },
      select: { id: true },
    }).catch(() => null)

    return profile ? 'KNOWN' : 'UNKNOWN'
  }

  // ── Tone: how WAANDA should communicate with this visitor ────────────────

  private determineSuggestedTone(stage: string, emotion: string): string {
    switch (emotion) {
      case 'FRUSTRATED': return 'EMPATHETIC'
      case 'EXCITED':    return 'ENTHUSIASTIC'
      case 'CURIOUS':    return 'EDUCATIONAL'
      case 'CONFUSED':   return 'CLARIFYING'
      default:           return 'PROFESSIONAL'
    }
  }
}

export const erootPipeline = new ERootPipeline()
