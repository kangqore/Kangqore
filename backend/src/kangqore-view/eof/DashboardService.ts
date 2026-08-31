// Dashboards that resolve against real services.
//
// The previous arrangement was 97 hardcoded widget components behind a
// compile-time registry, so adding or reordering a panel meant a code change
// and a redeploy. Here a panel stores only the question — a source key and its
// arguments — and the answer is fetched at read time from the service that
// already owns it. A panel therefore cannot hold a stale number, because it
// holds no number at all.
//
// The four questions come from §17 of the analysis, and the panels are grouped
// by them rather than by widget type:
//
//   WHAT      what is happening
//   WHY       why is it happening
//   SO_WHAT   what does it mean, in money
//   NOW_WHAT  what should we do
//
// A source that returns nothing says so. An executive dashboard that renders a
// confident zero is worse than one that admits the graph is quiet.

import { prisma } from '../../lib/prisma'
import { WorkViewService } from './WorkViewService'
import { DecisionEngine } from './DecisionEngine'
import { EvidenceLedger } from './EvidenceLedger'
import { ModelIntrospection } from './ModelIntrospection'

export interface ResolvedPanel {
  key: string
  title: string
  question: string
  render: string
  span: number
  data: any
  /** Set when the panel has nothing to show, and why. */
  empty?: string
  error?: string
}

/**
 * Every source a panel may name. Adding one here is the only code change a new
 * panel needs; the panel itself is data.
 */
const SOURCES: Record<string, (params: any) => Promise<{ data: any; empty?: string }>> = {
  /** Headline counts across work. */
  'work.summary': async () => {
    const ex = await WorkViewService.executive()
    return {
      data: ex.summary,
      empty: ex.summary.total === 0 ? 'No work items exist yet.' : undefined,
    }
  },

  'work.byStatus': async () => {
    const ex = await WorkViewService.executive()
    const entries = Object.entries(ex.byStatus).sort((a, b) => b[1] - a[1])
    return {
      data: { entries, total: ex.summary.total },
      empty: entries.length === 0 ? 'Nothing to group.' : undefined,
    }
  },

  /** Items the intelligence layer scored as at risk, with their causes. */
  'work.atRisk': async (p: any) => {
    const ex = await WorkViewService.executive()
    const items = ex.atRiskItems.slice(0, p?.limit ?? 6)
    return {
      data: { items, scored: ex.summary.scored, total: ex.summary.total },
      empty: items.length === 0
        ? ex.summary.scored === 0
          ? 'Nothing has been scored yet — run the intelligence fields.'
          : 'Nothing is currently at risk.'
        : undefined,
    }
  },

  'work.overdue': async (p: any) => {
    const ex = await WorkViewService.executive()
    const items = ex.overdueItems.slice(0, p?.limit ?? 6)
    return { data: { items }, empty: items.length === 0 ? 'Nothing is overdue.' : undefined }
  },

  /** Money at risk against an outcome, and the threats carrying it. */
  'outcome.exposure': async (p: any) => {
    const targets = await resolveTargets()
    const target = p?.targetId
      ? targets.find(t => t.id === p.targetId)
      : targets[0]
    if (!target) return { data: null, empty: 'No goals or outcomes exist to assess.' }

    const a = await DecisionEngine.assess({ targetId: target.id })
    return {
      data: {
        target: a.target,
        exposure: a.exposure,
        confidence: a.confidence,
        caveat: a.caveat,
        threats: a.threats.slice(0, p?.limit ?? 5),
        actions: a.recommendedActions.slice(0, p?.limit ?? 5),
      },
      empty: a.summary.contributorsExamined === 0
        ? 'Nothing contributes to this outcome yet.'
        : undefined,
    }
  },

  /** Load per assignee — including the unassigned bucket, usually the story. */
  'work.workload': async () => {
    const w = await WorkViewService.workload()
    return {
      data: { buckets: w.buckets.slice(0, 8), totalOpen: w.totalOpen, unassigned: w.unassigned },
      empty: w.totalOpen === 0 ? 'No open work.' : undefined,
    }
  },

  /** What has actually happened, per type. */
  'ledger.activity': async (p: any) => {
    const typeName = p?.typeName ?? 'Project'
    const l = await EvidenceLedger.forType(typeName)
    const quiet = (l as any).actions === 0 && (l as any).comments === 0
    return {
      data: l,
      empty: quiet ? `Nothing has happened to any ${typeName} in this window.` : undefined,
    }
  },

  /** How much of the model is actually populated. */
  'ontology.coverage': async () => {
    const names = ModelIntrospection.typeNames()
    const types = await prisma.ontologyObjectType.findMany({
      where: { name: { in: names } },
      select: { name: true, _count: { select: { instances: true } } },
    })
    const populated = types.filter(t => t._count.instances > 0)
    return {
      data: {
        declared: names.length,
        populated: populated.length,
        objects: types.reduce((s, t) => s + t._count.instances, 0),
        byType: populated
          .map(t => ({ name: t.name, count: t._count.instances }))
          .sort((a, b) => b.count - a.count),
      },
    }
  },
}

async function resolveTargets() {
  const types = await prisma.ontologyObjectType.findMany({
    where: { name: { in: ['EnterpriseGoal', 'Outcome'] } }, select: { id: true },
  })
  const objects = await prisma.ontologyObject.findMany({
    where: { typeId: { in: types.map(t => t.id) }, validTo: null },
    take: 20,
  })
  return objects.map(o => ({ id: o.id, title: String((o.properties as any)?.title ?? o.id) }))
}

export const DashboardService = {
  sources: () => Object.keys(SOURCES),

  list(workspace?: string) {
    return prisma.dashboard.findMany({
      where: workspace ? { workspace } : {},
      include: { _count: { select: { panels: true } } },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    })
  },

  /**
   * Resolve every panel. Each is fetched independently so one failing source
   * degrades a single panel rather than blanking the dashboard — the failure
   * mode that makes people distrust the whole screen.
   */
  async resolve(key: string): Promise<{ dashboard: any; panels: ResolvedPanel[] }> {
    const dashboard = await prisma.dashboard.findUnique({
      where: { key },
      include: { panels: { orderBy: { order: 'asc' } } },
    })
    if (!dashboard) throw new Error(`No dashboard with key "${key}"`)

    const panels = await Promise.all(dashboard.panels.map(async (p): Promise<ResolvedPanel> => {
      const base = { key: p.key, title: p.title, question: p.question, render: p.render, span: p.span }
      const source = SOURCES[p.source]
      if (!source) {
        return { ...base, data: null, error: `No source named "${p.source}"` }
      }
      try {
        const { data, empty } = await source(p.params ?? {})
        return { ...base, data, empty }
      } catch (e: any) {
        return { ...base, data: null, error: e?.message ?? String(e) }
      }
    }))

    return {
      dashboard: {
        key: dashboard.key, name: dashboard.name,
        description: dashboard.description, columns: dashboard.columns,
      },
      panels,
    }
  },

  async create(input: {
    key: string; name: string; description?: string; workspace?: string
    ownerId?: string; panels?: Array<Omit<any, 'id'>>
  }) {
    return prisma.dashboard.create({
      data: {
        key: input.key, name: input.name,
        description: input.description ?? null,
        workspace: input.workspace ?? null,
        ownerId: input.ownerId ?? null,
        panels: input.panels?.length
          ? { create: input.panels.map((p: any, i: number) => ({ ...p, order: p.order ?? i })) }
          : undefined,
      },
      include: { panels: true },
    })
  },

  async addPanel(dashboardKey: string, panel: {
    key: string; title: string; source: string
    question?: string; render?: string; span?: number; params?: any; order?: number
  }) {
    if (!SOURCES[panel.source]) {
      throw new Error(`"${panel.source}" is not a source. Available: ${Object.keys(SOURCES).join(', ')}`)
    }
    const d = await prisma.dashboard.findUnique({ where: { key: dashboardKey }, select: { id: true } })
    if (!d) throw new Error('No such dashboard')

    const count = await prisma.dashboardPanel.count({ where: { dashboardId: d.id } })
    return prisma.dashboardPanel.create({
      data: {
        dashboardId: d.id, key: panel.key, title: panel.title, source: panel.source,
        question: panel.question ?? 'WHAT', render: panel.render ?? 'stat',
        span: panel.span ?? 3, params: (panel.params ?? {}) as any,
        order: panel.order ?? count,
      },
    })
  },

  removePanel(panelId: string) {
    return prisma.dashboardPanel.delete({ where: { id: panelId } })
  },

  /** Reorder without a redeploy — the thing the hardcoded registry could not do. */
  async reorder(dashboardKey: string, panelIds: string[]) {
    const d = await prisma.dashboard.findUnique({ where: { key: dashboardKey }, select: { id: true } })
    if (!d) throw new Error('No such dashboard')
    await Promise.all(panelIds.map((id, i) =>
      prisma.dashboardPanel.updateMany({ where: { id, dashboardId: d.id }, data: { order: i } })))
    return { reordered: panelIds.length }
  },
}
