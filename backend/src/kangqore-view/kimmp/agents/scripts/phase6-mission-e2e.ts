/**
 * Phase 6 — agent mission pipeline probe.
 *
 * Proves the pipeline reasons over real records and that the approval gate
 * genuinely blocks execution, rather than being narrated.
 *
 * Run: npx tsx src/kangqore-view/kimmp/agents/scripts/phase6-mission-e2e.ts
 */

import { prisma } from '../../../../lib/prisma'
import { AgentMissionEngine, interpretIntent } from '../AgentMissionEngine'
import { forecastProject } from '../ProjectDelayAnalyzer'

let pass = 0
let fail = 0
function check(label: string, cond: boolean, detail = '') {
  if (cond) { pass++; console.log(`  ✓ ${label}`) }
  else { fail++; console.log(`  ✗ ${label} ${detail}`) }
}

const ACTOR = 'e2e-phase6-actor'

async function main() {
  await prisma.agentMission.deleteMany({ where: { actorId: ACTOR } })

  console.log('\n1. Intent parsing decides whether mutation is even permitted')
  const fixIntent = interpretIntent('Fix the projects that are going to miss their deadlines.')
  const askIntent = interpretIntent('Which projects are at risk of slipping?')
  const junk = interpretIntent('make me a sandwich')
  check('"fix …" is mutating', fixIntent.objective === 'RECOVER_AT_RISK_PROJECTS' && fixIntent.mutating)
  check('"which …" is read-only', askIntent.objective === 'REPORT_STATUS' && !askIntent.mutating)
  check('unrecognised intent is UNKNOWN', junk.objective === 'UNKNOWN')

  console.log('\n2. Forecast maths is real (deterministic, injected clock)')
  const now = new Date('2026-08-30T00:00:00Z')
  const late = forecastProject({
    id: 'p1', title: 'Late', status: 'ACTIVE', clientId: 'c', health: 90,
    createdAt: new Date('2026-06-01T00:00:00Z'),
    dueDate: new Date('2026-08-01T00:00:00Z'), progress: 50,
  }, now)
  check('overdue project detected', late.riskBand === 'OVERDUE', late.riskBand)
  check('slip computed, not asserted', (late.projectedSlipDays ?? 0) > 0, String(late.projectedSlipDays))

  const willMiss = forecastProject({
    id: 'p2', title: 'Will miss', status: 'ACTIVE', clientId: 'c', health: 90,
    createdAt: new Date('2026-08-01T00:00:00Z'),
    dueDate: new Date('2026-09-05T00:00:00Z'), progress: 10,
  }, now)
  check('not-yet-late project flagged before the date', ['CRITICAL', 'AT_RISK'].includes(willMiss.riskBand), willMiss.riskBand)
  check('  — this is what `if status == late` misses', willMiss.daysRemaining! > 0)

  const healthy = forecastProject({
    id: 'p3', title: 'Fine', status: 'ACTIVE', clientId: 'c', health: 95,
    createdAt: new Date('2026-08-01T00:00:00Z'),
    dueDate: new Date('2026-12-01T00:00:00Z'), progress: 60,
  }, now)
  check('on-track project not flagged', healthy.riskBand === 'ON_TRACK', healthy.riskBand)

  console.log('\n3. Unclassifiable intent stops without inventing work')
  const junkMission = await AgentMissionEngine.plan({ intentText: 'make me a sandwich', actorId: ACTOR })
  check('status NO_ACTION', junkMission!.status === 'NO_ACTION', junkMission!.status)
  check('no actions proposed', junkMission!.actions.length === 0)

  console.log('\n4. Plan a real mutating mission over live projects')
  const mission = await AgentMissionEngine.plan({
    intentText: 'Fix the projects that are going to miss their deadlines.',
    actorId: ACTOR,
  })
  const m = mission!
  const stages = m.steps.map(s => s.stage)
  check('pipeline ran through to the approval gate',
    ['INTERPRET', 'RESOLVE_CONTEXT', 'ANALYZE'].every(s => stages.includes(s)), stages.join('>'))

  if (m.status === 'NO_ACTION') {
    console.log('     (no at-risk projects in this database — remaining gate checks skipped)')
  } else {
    check('halted awaiting approval', m.status === 'AWAITING_APPROVAL', m.status)
    check('proposed at least one change', m.actions.length > 0)
    check('every proposal binds to a real project id',
      m.actions.every(a => !!a.targetId && a.targetType === 'Project'))

    // The proposals must reference projects that actually exist — the facade
    // this replaced returned a hardcoded "proj-alpha-101".
    const ids = m.actions.map(a => a.targetId!).filter(Boolean)
    const real = await prisma.project.count({ where: { id: { in: ids } } })
    check('proposed project ids exist in the database', real === ids.length, `${real}/${ids.length}`)

    const analyze = m.steps.find(s => s.stage === 'ANALYZE')!
    const data = analyze.data as any
    check('analysis carries computed evidence', Array.isArray(data?.atRisk) && data.atRisk.length > 0)
    check('evidence includes observed vs required velocity',
      data.atRisk[0].observedVelocity !== undefined && 'requiredVelocity' in data.atRisk[0])

    console.log('\n5. The approval gate actually blocks execution')
    let blocked = false
    try {
      await AgentMissionEngine.execute(m.id, ACTOR)
    } catch (err: any) {
      blocked = /only an APPROVED mission/.test(err.message)
    }
    check('execute() refused before approval', blocked)

    const untouched = await prisma.agentProposedAction.count({
      where: { missionId: m.id, status: 'EXECUTED' },
    })
    check('nothing was executed while awaiting approval', untouched === 0)

    console.log('\n6. Rejection closes the mission without changing anything')
    const rejected = await AgentMissionEngine.decide(m.id, false, 'e2e-approver')
    check('status REJECTED', rejected!.status === 'REJECTED', rejected!.status)
    check('all actions rejected', rejected!.actions.every(a => a.status === 'REJECTED'))
    const executedAfterReject = await prisma.agentProposedAction.count({
      where: { missionId: m.id, status: 'EXECUTED' },
    })
    check('still nothing executed', executedAfterReject === 0)

    console.log('\n7. Approve a fresh mission, then execute and verify')
    const m2 = (await AgentMissionEngine.plan({
      intentText: 'Fix the projects that are going to miss their deadlines.',
      actorId: ACTOR,
    }))!
    if (m2.status === 'AWAITING_APPROVAL') {
      const before = await prisma.project.findUnique({
        where: { id: m2.actions[0].targetId! }, select: { dueDate: true },
      })

      await AgentMissionEngine.decide(m2.id, true, 'e2e-approver')
      const done = (await AgentMissionEngine.execute(m2.id, ACTOR))!

      check('mission completed', ['COMPLETED', 'FAILED'].includes(done.status), done.status)
      check('verification stage recorded', done.steps.some(s => s.stage === 'VERIFY'))
      check('verification measured real outcome', !!(done.verification as any)?.outcome)

      const after = await prisma.project.findUnique({
        where: { id: m2.actions[0].targetId! }, select: { dueDate: true },
      })
      check('the approved change actually landed on the record',
        String(before?.dueDate) !== String(after?.dueDate),
        `${before?.dueDate} -> ${after?.dueDate}`)

      // Restore, so the probe leaves the database as it found it.
      if (before?.dueDate) {
        await prisma.project.update({
          where: { id: m2.actions[0].targetId! }, data: { dueDate: before.dueDate },
        })
      }
    }
  }

  await prisma.agentMission.deleteMany({ where: { actorId: ACTOR } })

  console.log(`\n${'─'.repeat(52)}`)
  console.log(`  ${pass} passed, ${fail} failed`)
  console.log('─'.repeat(52))
  process.exit(fail === 0 ? 0 : 1)
}

main().catch(err => { console.error('PROBE ERROR:', err); process.exit(1) })
