// ---------------------------------------------------------------------------
// KIMMP Report Engine — generates executive reports from live OS data
//
// Supports: DAILY_BRIEFING, WEEKLY_EXECUTIVE, MONTHLY_BOARD, SALES_PIPELINE
// Reports are synthesised by Claude Sonnet and persisted as Markdown.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk'
import { withKrisnam } from '../llm/krisnamAnthropic'
import { prisma } from '../../../lib/prisma'
import logger from '../../../utils/logger'

export type ReportType = 'DAILY_BRIEFING' | 'WEEKLY_EXECUTIVE' | 'MONTHLY_BOARD' | 'SALES_PIPELINE'

export interface Report {
  id: string
  type: ReportType
  title: string
  summary: string
  content: string   // markdown
  fromDate: string
  toDate: string
  generatedAt: string
  generatedBy?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TYPE_LABELS: Record<ReportType, string> = {
  DAILY_BRIEFING:   'Daily Briefing',
  WEEKLY_EXECUTIVE: 'Weekly Executive Report',
  MONTHLY_BOARD:    'Monthly Board Report',
  SALES_PIPELINE:   'Sales Pipeline Report',
}

// ---------------------------------------------------------------------------
// Data collection
// ---------------------------------------------------------------------------

async function collectData(type: ReportType): Promise<{ since: Date; context: string }> {
  const now = new Date()
  let since: Date

  if (type === 'DAILY_BRIEFING') {
    since = new Date(now.getTime() - 24 * 3_600_000)
  } else if (type === 'WEEKLY_EXECUTIVE') {
    since = new Date(now.getTime() - 7 * 24 * 3_600_000)
  } else if (type === 'MONTHLY_BOARD') {
    since = new Date(now.getTime() - 30 * 24 * 3_600_000)
  } else {
    // SALES_PIPELINE — no time window for leads
    since = new Date(now.getTime() - 30 * 24 * 3_600_000)
  }

  // ── Signals ──────────────────────────────────────────────────────────────
  let signals: any[] = []
  try {
    signals = await (prisma as any).kimmpSignal.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { severity: 'desc' },
      take: 50,
    })
  } catch {}

  // ── Leads ─────────────────────────────────────────────────────────────────
  let leads: any[] = []
  try {
    if (type === 'SALES_PIPELINE') {
      leads = await (prisma as any).eqoreLead.findMany({
        orderBy: { leadScore: 'desc' },
        take: 30,
      })
    } else {
      leads = await (prisma as any).eqoreLead.findMany({
        where: { createdAt: { gte: since } },
        take: 20,
      })
    }
  } catch {}

  // ── Projects ──────────────────────────────────────────────────────────────
  let projects: any[] = []
  try {
    projects = await prisma.project.findMany({
      where: { status: { in: ['IN_PROGRESS', 'ACTIVE'] as any } },
      take: 15,
      select: { id: true, title: true, status: true, health: true, budget: true, spend: true },
    })
  } catch {}

  // ── Financials (graceful) ─────────────────────────────────────────────────
  let financials = { revenueMTD: 0, revenueLastMonth: 0, pendingInvoices: 0, pipelineValue: 0 }
  try {
    const invoices = await (prisma as any).invoice.findMany({
      where: { createdAt: { gte: since } },
      select: { amount: true, status: true, currency: true },
      take: 100,
    })
    financials.revenueMTD = invoices
      .filter((i: any) => i.status === 'PAID')
      .reduce((s: number, i: any) => s + Number(i.amount ?? 0), 0)
    financials.pendingInvoices = invoices.filter((i: any) => i.status === 'PENDING').length
  } catch {}

  // ── Clients (monthly + board) ─────────────────────────────────────────────
  let clients: any[] = []
  if (type === 'MONTHLY_BOARD') {
    try {
      clients = await (prisma as any).clientCrm.findMany({
        where: { status: 'active' },
        select: { id: true, name: true, health: true, arr: true, tier: true },
        take: 20,
      })
    } catch {}
  }

  // ── Format context block ──────────────────────────────────────────────────
  const lines: string[] = [
    `## Report Period: ${since.toLocaleDateString('en-IN')} → ${now.toLocaleDateString('en-IN')}`,
    '',
    `### Signals (${signals.length} total)`,
    ...signals.slice(0, 15).map(
      s => `- [${s.severity}] ${s.signalType} (${s.signalCategory}): ${String(s.signalValue ?? '').slice(0, 120)}`
    ),
    '',
    `### Leads (${leads.length} total)`,
    ...leads.slice(0, 10).map(
      l => `- ${l.name ?? l.email ?? l.id} | score: ${l.leadScore ?? 'N/A'} | status: ${l.status ?? 'N/A'}`
    ),
    '',
    `### Active Projects (${projects.length})`,
    ...projects.map(
      p => `- ${p.title} | health: ${p.health ?? 'N/A'} | budget: ${p.budget ?? 0} | spend: ${p.spend ?? 0}`
    ),
    '',
    `### Financials`,
    `- Revenue (period): ₹${financials.revenueMTD.toLocaleString('en-IN')}`,
    `- Pending invoices: ${financials.pendingInvoices}`,
  ]

  if (clients.length > 0) {
    lines.push('', `### Clients (${clients.length} active)`)
    lines.push(...clients.map(c => `- ${c.name} | health: ${c.health} | ARR: ₹${c.arr ?? 0} | tier: ${c.tier}`))
  }

  return { since, context: lines.join('\n') }
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class KimmpReportService {
  // ── generate ────────────────────────────────────────────────────────────────
  static async generate(type: ReportType, userId?: string): Promise<Report> {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }
    const client = withKrisnam(new Anthropic({ apiKey }))

    // Collect data
    const { since, context } = await collectData(type)
    const now = new Date()

    // Build Claude request
    const systemPrompt =
      `You are KIMMP generating a ${type.replace(/_/g, ' ')} for the ADMIN of Kangqore. ` +
      `Write in confident, decisive executive style. No hedging. Lead with the most important insight. ` +
      `Format as clean Markdown with: ## sections, bullet points where needed, bold for key numbers. ` +
      `Be specific — name actual signals, leads, projects from the data. ` +
      `The ADMIN reads this first thing in the morning. Make every sentence earn its place.`

    const userPrompt =
      `Generate a ${TYPE_LABELS[type]} for Kangqore.\n\n` +
      `DATA CONTEXT:\n${context}\n\n` +
      `Write the full report now as clean Markdown. No preamble, no "here is your report". ` +
      `Start directly with the first ## section.`

    let content = ''
    try {
      const resp = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        temperature: 0.1,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      })
      content = (resp.content[0] as any)?.text ?? ''
    } catch (err: any) {
      logger.error('[KIMMP:REPORT] Claude synthesis failed:', err.message)
      content = `## ${TYPE_LABELS[type]}\n\nReport generation failed: ${err.message}`
    }

    // Extract summary: first non-empty non-heading paragraph
    const summary = content.split('\n').find(l => l.trim() && !l.startsWith('#'))?.slice(0, 300) ?? ''

    // Persist
    const title = `${TYPE_LABELS[type]} — ${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`

    const saved = await (prisma as any).kimmpReport.create({
      data: {
        type,
        title,
        summary,
        content,
        fromDate: since,
        toDate: now,
        generatedBy: userId ?? null,
      },
    })

    return {
      id: saved.id,
      type,
      title: saved.title,
      summary: saved.summary,
      content: saved.content,
      fromDate: saved.fromDate.toISOString(),
      toDate: saved.toDate.toISOString(),
      generatedAt: saved.generatedAt.toISOString(),
      generatedBy: saved.generatedBy ?? undefined,
    }
  }

  // ── list ─────────────────────────────────────────────────────────────────────
  static async list(limit = 20): Promise<Report[]> {
    try {
      const rows = await (prisma as any).kimmpReport.findMany({
        orderBy: { generatedAt: 'desc' },
        take: limit,
      })
      return rows.map((r: any) => ({
        id: r.id,
        type: r.type as ReportType,
        title: r.title,
        summary: r.summary,
        content: r.content,
        fromDate: r.fromDate.toISOString(),
        toDate: r.toDate.toISOString(),
        generatedAt: r.generatedAt.toISOString(),
        generatedBy: r.generatedBy ?? undefined,
      }))
    } catch {
      return []
    }
  }

  // ── getById ──────────────────────────────────────────────────────────────────
  static async getById(id: string): Promise<Report | null> {
    try {
      const r = await (prisma as any).kimmpReport.findUnique({ where: { id } })
      if (!r) return null
      return {
        id: r.id,
        type: r.type as ReportType,
        title: r.title,
        summary: r.summary,
        content: r.content,
        fromDate: r.fromDate.toISOString(),
        toDate: r.toDate.toISOString(),
        generatedAt: r.generatedAt.toISOString(),
        generatedBy: r.generatedBy ?? undefined,
      }
    } catch {
      return null
    }
  }
}
