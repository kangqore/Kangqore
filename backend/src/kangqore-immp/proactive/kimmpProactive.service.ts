import Anthropic from '@anthropic-ai/sdk'
import { withWaandax } from '../llm/waandaxAnthropic'
import { prisma } from '../../lib/prisma'
import { SignalLedger } from '../signals/signalLedger.service'
import { KimmpGoalEngine } from '../goals/kimmpGoal.service'
import { emitToAdmins } from '../../socket'
import { KimmpActionProposer } from '../actions/kimmpActionProposer'
import logger from '../../utils/logger'

export interface ProactiveAlert {
  id:              string
  ruleId:          string
  entityId:        string
  category:        string
  title:           string
  description:     string
  severity:        'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  suggestedAction: string | null
  actionType:      string | null   // 'RESEARCH' | 'NAVIGATE' | 'APPROVE_GOAL' | null
  actionPayload:   Record<string, any> | null
  dismissed:       boolean
  createdAt:       string
}

const anthropic = withWaandax(new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' }))

export class KimmpProactiveEngine {

  // ── Main scan — runs all rules, deduplicates, emits alerts ───────────────────
  static async scan(): Promise<ProactiveAlert[]> {
    const fired: ProactiveAlert[] = []
    const rules = [
      this.checkTenderMatch(),
      this.checkLeadsColdAlert(),
      this.checkPipelineDrought(),
      this.checkRevenueAnomaly(),
      this.checkCompetitorMoves(),
      this.checkGoalsAtRisk(),
      this.checkCorrelationOpportunities(),
    ]

    const results = await Promise.allSettled(rules)
    for (const r of results) {
      if (r.status === 'fulfilled') fired.push(...r.value)
    }

    // Persist + emit each new alert (deduplicated)
    for (const alert of fired) {
      await this.persistAndEmit(alert)
    }

    logger.info(`[KIMMP:PROACTIVE] Scan complete — ${fired.length} alerts evaluated`)
    return fired
  }

  // ── Rule 1: Scout found a tender that matches an active goal ──────────────────
  private static async checkTenderMatch(): Promise<ProactiveAlert[]> {
    const alerts: ProactiveAlert[] = []
    try {
      const since = new Date(Date.now() - 48 * 3600_000)
      const tenderSignals = await (prisma as any).kimmpSignal.findMany({
        where: { signalType: 'TENDER_FOUND', createdAt: { gte: since } },
        take: 10, orderBy: { createdAt: 'desc' },
      })
      if (!tenderSignals.length) return []

      const activeGoals = await KimmpGoalEngine.list(10)
      const relevantGoals = activeGoals.filter((g: any) => g.status === 'ACTIVE')

      for (const signal of tenderSignals) {
        const val = String(signal.signalValue ?? '').toLowerCase()
        const matchedGoal = relevantGoals.find((g: any) =>
          ['school', 'education', 'msme', 'government', 'digital'].some(kw =>
            val.includes(kw) && g.objective.toLowerCase().includes(kw)
          )
        )
        if (matchedGoal) {
          alerts.push({
            id:              '',
            ruleId:          'TENDER_MATCH',
            entityId:        signal.id,
            category:        'OPPORTUNITY',
            title:           'Tender matches active goal',
            description:     `${signal.signalValue?.slice(0, 180)} — matches goal: "${matchedGoal.objective.slice(0, 80)}"`,
            severity:        'HIGH',
            suggestedAction: 'Run deep research on this tender',
            actionType:      'RESEARCH',
            actionPayload:   { question: `Research this tender opportunity: ${signal.signalValue?.slice(0, 200)}`, domain: 'government tenders' },
            dismissed:       false,
            createdAt:       new Date().toISOString(),
          })
        }
      }
    } catch {}
    return alerts
  }

  // ── Rule 2: High-value leads going cold ──────────────────────────────────────
  private static async checkLeadsColdAlert(): Promise<ProactiveAlert[]> {
    try {
      const cutoff = new Date(Date.now() - 2 * 24 * 3600_000)
      const coldLeads = await (prisma as any).eqoreLead.findMany({
        where: {
          updatedAt:  { lt: cutoff },
          leadScore:  { gte: 60 },
          status:     { notIn: ['CLOSED_WON', 'CLOSED_LOST', 'DISQUALIFIED'] },
        },
        take: 10,
        select: { id: true, name: true, companyName: true, leadScore: true, status: true },
      })
      if (!coldLeads.length) return []

      return [{
        id:              '',
        ruleId:          'LEADS_COLD',
        entityId:        `cold_${coldLeads.length}`,
        category:        'LEAD',
        title:           `${coldLeads.length} high-value lead${coldLeads.length > 1 ? 's' : ''} going cold`,
        description:     `${coldLeads.map((l: any) => `${l.name ?? 'Unknown'}${l.companyName ? ` (${l.companyName})` : ''} — score ${l.leadScore}`).slice(0, 3).join(' · ')} — no activity in 2+ days`,
        severity:        coldLeads.length >= 3 ? 'HIGH' : 'MODERATE',
        suggestedAction: 'Review and trigger follow-up for these leads',
        actionType:      'NAVIGATE',
        actionPayload:   { route: '/kangqore-view/admin/leads' },
        dismissed:       false,
        createdAt:       new Date().toISOString(),
      }]
    } catch {
      return []
    }
  }

  // ── Rule 3: No new leads in 6 hours ──────────────────────────────────────────
  private static async checkPipelineDrought(): Promise<ProactiveAlert[]> {
    try {
      const since = new Date(Date.now() - 6 * 3600_000)
      const recentLeads = await (prisma as any).eqoreLead.count({ where: { createdAt: { gte: since } } })
      if (recentLeads > 0) return []

      return [{
        id:              '',
        ruleId:          'PIPELINE_DROUGHT',
        entityId:        'global',
        category:        'PIPELINE',
        title:           'No new leads in 6 hours',
        description:     'The lead pipeline has received no new entries in the past 6 hours. Top-of-funnel activity may have stalled.',
        severity:        'HIGH',
        suggestedAction: 'Review lead generation channels and trigger Scout scan for opportunities',
        actionType:      'NAVIGATE',
        actionPayload:   { route: '/kangqore-view/admin/leads' },
        dismissed:       false,
        createdAt:       new Date().toISOString(),
      }]
    } catch {
      return []
    }
  }

  // ── Rule 4: Revenue this month below last month by 25%+ ──────────────────────
  private static async checkRevenueAnomaly(): Promise<ProactiveAlert[]> {
    try {
      const now          = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfLast  = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endOfLast    = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

      const [thisMTD, lastMonth] = await Promise.all([
        (prisma as any).invoice.aggregate({
          where: { status: 'PAID', createdAt: { gte: startOfMonth } },
          _sum: { amount: true },
        }).catch(() => ({ _sum: { amount: 0 } })),
        (prisma as any).invoice.aggregate({
          where: { status: 'PAID', createdAt: { gte: startOfLast, lte: endOfLast } },
          _sum: { amount: true },
        }).catch(() => ({ _sum: { amount: 0 } })),
      ])

      const mtd  = Number(thisMTD._sum.amount  ?? 0)
      const last = Number(lastMonth._sum.amount ?? 0)
      if (last === 0 || mtd === 0) return []

      // Pro-rate last month to same day-of-month for fair comparison
      const dayOfMonth = now.getDate()
      const daysInLastMonth = endOfLast.getDate()
      const proratedLast = (last / daysInLastMonth) * dayOfMonth

      const dropPct = Math.round(((proratedLast - mtd) / proratedLast) * 100)
      if (dropPct < 25) return []

      return [{
        id:              '',
        ruleId:          'REVENUE_ANOMALY',
        entityId:        `${now.getFullYear()}-${now.getMonth()}`,
        category:        'FINANCE',
        title:           `Revenue ${dropPct}% below last month (pro-rated)`,
        description:     `MTD revenue ₹${(mtd / 100).toFixed(0)} vs pro-rated last month ₹${(proratedLast / 100).toFixed(0)}. Investigate billing pipeline.`,
        severity:        dropPct >= 40 ? 'CRITICAL' : 'HIGH',
        suggestedAction: 'Review outstanding invoices and pipeline value',
        actionType:      'NAVIGATE',
        actionPayload:   { route: '/kangqore-view/admin/finance' },
        dismissed:       false,
        createdAt:       new Date().toISOString(),
      }]
    } catch {
      return []
    }
  }

  // ── Rule 5: 30+ competitor signals in 48h → board-level alert ────────────────
  private static async checkCompetitorMoves(): Promise<ProactiveAlert[]> {
    try {
      const since = new Date(Date.now() - 48 * 3600_000)
      const count = await (prisma as any).kimmpSignal.count({
        where: { signalType: 'COMPETITOR_MOVE', createdAt: { gte: since } },
      })
      if (count < 30) return []

      const signals = await (prisma as any).kimmpSignal.findMany({
        where: { signalType: 'COMPETITOR_MOVE', createdAt: { gte: since } },
        take: 5, orderBy: { severity: 'desc' },
      })
      if (!signals.length) return []

      // One consolidated alert for the surge — board-level severity
      return [{
        id:              '',
        ruleId:          'COMPETITOR_MOVES',
        entityId:        `competitor_surge_${since.toISOString().slice(0, 10)}`,
        category:        'COMPETITOR',
        title:           `Competitor surge — ${count} signals in 48h`,
        description:     `${count} competitor moves detected in the past 48 hours. Top: ${signals.map((s: any) => String(s.signalValue ?? '').slice(0, 80)).join(' · ').slice(0, 300)}`,
        severity:        'CRITICAL',
        suggestedAction: 'Run deep competitor research and prepare board briefing',
        actionType:      'RESEARCH',
        actionPayload:   {
          question: `We have detected ${count} competitor signals in 48 hours. Analyze the landscape and summarise strategic implications for Kangqore.`,
          domain:   'competitor analysis',
        },
        dismissed:       false,
        createdAt:       new Date().toISOString(),
      }]
    } catch {
      return []
    }
  }

  // ── Rule 6: Active goals at risk (deadline within 7d, <70% complete) ─────────
  private static async checkGoalsAtRisk(): Promise<ProactiveAlert[]> {
    const alerts: ProactiveAlert[] = []
    try {
      const goals = await KimmpGoalEngine.list(20)
      const now   = Date.now()
      for (const g of goals) {
        if (g.status !== 'ACTIVE' || !g.deadline) continue
        const daysLeft = Math.ceil((new Date(g.deadline).getTime() - now) / 86_400_000)
        if (daysLeft > 0 && daysLeft <= 7 && (g.progressPct ?? 0) < 70) {
          alerts.push({
            id:              '',
            ruleId:          'GOAL_AT_RISK',
            entityId:        g.id,
            category:        'GOAL',
            title:           `Goal at risk — ${daysLeft}d left, ${g.progressPct ?? 0}% done`,
            description:     `"${g.objective.slice(0, 120)}" is ${g.progressPct ?? 0}% complete with ${daysLeft} day${daysLeft > 1 ? 's' : ''} to deadline.`,
            severity:        daysLeft <= 3 ? 'CRITICAL' : 'HIGH',
            suggestedAction: 'Review remaining tasks and accelerate execution',
            actionType:      'NAVIGATE',
            actionPayload:   { route: '/kangqore-view/admin/kangqore-immp' },
            dismissed:       false,
            createdAt:       new Date().toISOString(),
          })
        }
      }
    } catch {}
    return alerts
  }

  // ── Rule 7: Correlation patterns not yet actioned ─────────────────────────────
  private static async checkCorrelationOpportunities(): Promise<ProactiveAlert[]> {
    try {
      const since = new Date(Date.now() - 24 * 3600_000)
      const correlations = await (prisma as any).kimmpSignal.findMany({
        where: { signalType: 'CORRELATION_DETECTED', createdAt: { gte: since } },
        take: 2, orderBy: { severity: 'desc' },
      })
      if (!correlations.length) return []

      return correlations.map((s: any): ProactiveAlert => ({
        id:              '',
        ruleId:          'CORRELATION_PATTERN',
        entityId:        s.id,
        category:        'INTELLIGENCE',
        title:           'Cross-signal pattern detected',
        description:     String(s.signalValue ?? '').slice(0, 220),
        severity:        s.severity ?? 'MODERATE',
        suggestedAction: 'Review correlation and determine if action is required',
        actionType:      null,
        actionPayload:   null,
        dismissed:       false,
        createdAt:       new Date().toISOString(),
      }))
    } catch {
      return []
    }
  }

  // ── Persist alert with deduplication; emit via WebSocket ─────────────────────
  private static async persistAndEmit(alert: Omit<ProactiveAlert, 'id'>): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + 24 * 3600_000)

      // Check if a non-dismissed alert for this rule+entity already exists
      const existing = await (prisma as any).kimmpProactiveAlert.findFirst({
        where: {
          ruleId:    alert.ruleId,
          entityId:  alert.entityId,
          dismissed: false,
          expiresAt: { gt: new Date() },
        },
      })
      if (existing) return  // already alerted, don't spam

      const saved = await (prisma as any).kimmpProactiveAlert.create({
        data: {
          ruleId:          alert.ruleId,
          entityId:        alert.entityId,
          category:        alert.category,
          title:           alert.title,
          description:     alert.description,
          severity:        alert.severity,
          suggestedAction: alert.suggestedAction,
          actionType:      alert.actionType,
          actionPayload:   alert.actionPayload ?? undefined,
          dismissed:       false,
          expiresAt,
        },
      })

      // Emit to ADMIN dashboard via WebSocket
      try {
        emitToAdmins('kimmp:proactive_alert', { ...saved, createdAt: saved.createdAt?.toISOString() })
      } catch {}

      // Also write to Signal Ledger so it appears in SignalTimeline
      await SignalLedger.record({
        sourceModule:   'kimmp',
        signalType:     'PROACTIVE_ALERT',
        signalCategory: 'SYSTEM',
        signalValue:    `[${alert.category}] ${alert.title}: ${alert.description.slice(0, 150)}`,
        severity:       alert.severity,
        confidence:     85,
        metadata:       { ruleId: alert.ruleId, alertId: saved.id },
      }).catch(() => {})

      // Auto-propose an action based on the alert category (non-blocking)
      KimmpActionProposer.proposeFromAlert(
        alert.category,
        alert.title,
        { ...(alert.actionPayload ?? {}), alertId: saved.id },
      ).catch(() => {})

    } catch (err: any) {
      logger.warn(`[KIMMP:PROACTIVE] Failed to persist alert (${alert.ruleId}): ${err.message}`)
    }
  }

  // ── Public CRUD ───────────────────────────────────────────────────────────────
  static async getActiveAlerts(): Promise<any[]> {
    return (prisma as any).kimmpProactiveAlert.findMany({
      where:   { dismissed: false, expiresAt: { gt: new Date() } },
      orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
      take:    20,
    }).catch(() => [])
  }

  static async dismiss(id: string): Promise<void> {
    await (prisma as any).kimmpProactiveAlert.update({ where: { id }, data: { dismissed: true } }).catch(() => {})
  }

  static async dismissAll(): Promise<void> {
    await (prisma as any).kimmpProactiveAlert.updateMany({
      where: { dismissed: false },
      data:  { dismissed: true },
    }).catch(() => {})
  }
}
