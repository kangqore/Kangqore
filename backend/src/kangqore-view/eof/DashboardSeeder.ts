// The default executive dashboard.
//
// Panels are grouped by the four questions from §17 rather than by widget type,
// because "what is happening / why / what does it mean / what should we do" is
// the order an executive actually asks them in, and a dashboard that answers
// only the first is a status board.

import { prisma } from '../../lib/prisma'
import { DashboardService } from './DashboardService'

const PANELS = [
  // WHAT
  { key: 'summary',   title: 'Work',              source: 'work.summary',      question: 'WHAT',     render: 'stat',       span: 12 },
  { key: 'status',    title: 'By state',          source: 'work.byStatus',     question: 'WHAT',     render: 'breakdown',  span: 6 },
  { key: 'coverage',  title: 'Model coverage',    source: 'ontology.coverage', question: 'WHAT',     render: 'breakdown',  span: 6 },

  // WHY
  { key: 'at-risk',   title: 'At risk, and why',  source: 'work.atRisk',       question: 'WHY',      render: 'list',       span: 6 },
  { key: 'overdue',   title: 'Overdue',           source: 'work.overdue',      question: 'WHY',      render: 'list',       span: 6 },

  // SO WHAT
  { key: 'exposure',  title: 'Value at risk',     source: 'outcome.exposure',  question: 'SO_WHAT',  render: 'exposure',   span: 12 },

  // NOW WHAT
  { key: 'workload',  title: 'Where the load is', source: 'work.workload',     question: 'NOW_WHAT', render: 'list',       span: 6 },
  { key: 'activity',  title: 'What changed',      source: 'ledger.activity',   question: 'NOW_WHAT', render: 'timeline',   span: 6,
    params: { typeName: 'Project' } },
]

export async function seedDashboards() {
  const existing = await prisma.dashboard.findUnique({
    where: { key: 'executive' }, select: { id: true },
  })
  if (existing) {
    // Panels are the definition; replace them so editing this file is the whole
    // update path, exactly as it is for templates and the object model.
    await prisma.dashboardPanel.deleteMany({ where: { dashboardId: existing.id } })
    await prisma.dashboardPanel.createMany({
      data: PANELS.map((p, i) => ({
        dashboardId: existing.id, ...p, params: (p as any).params ?? {}, order: i,
      })) as any,
    })
    return { created: 0, updated: 1, panels: PANELS.length }
  }

  await DashboardService.create({
    key: 'executive',
    name: 'Executive',
    description: 'What is happening, why, what it means in money, and what to do about it.',
    workspace: 'executive',
    panels: PANELS.map((p, i) => ({ ...p, params: (p as any).params ?? {}, order: i })),
  })
  await prisma.dashboard.update({ where: { key: 'executive' }, data: { isSystem: true, isDefault: true } })
  return { created: 1, updated: 0, panels: PANELS.length }
}
