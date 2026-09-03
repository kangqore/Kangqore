import { PrismaClient } from '@prisma/client'
import * as crypto from 'crypto'
import { HanumanasLedger } from '../../kangqore-view/esf/hanumanas/hanumanasLedger.service'

const prisma = new PrismaClient()

export const RGS_SCHEMA_VERSION = 'RGS/1.0'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReleaseVerdict = 'DEPLOY' | 'REVIEW' | 'BLOCK'
export type FactorSeverity = 'BLOCKER' | 'WARNING'
export type FactorCategory = 'CERTIFICATION' | 'RUNTIME' | 'ENVIRONMENT' | 'POLICY' | 'APPROVAL'

export interface DecisionFactor {
  id:          string
  category:    FactorCategory
  severity:    FactorSeverity
  description: string
  evidence?:   Record<string, unknown>
}

export interface Approval {
  approver:   string
  role:       string
  approvedAt: string
}

// ─── Non-overridable blockers (spec §6.3) ─────────────────────────────────────

const NON_OVERRIDABLE = new Set(['CERT_REQUIRED', 'CERT_REVOKED'])

// ─── Cert level ordering ──────────────────────────────────────────────────────

const CERT_LEVEL_RANK: Record<string, number> = {
  NOT_CERTIFIED:        0,
  CERTIFIED:            1,
  ADVANCED_CERTIFIED:   2,
  ENTERPRISE_CERTIFIED: 3,
}

// ─── Sequential ID helpers ────────────────────────────────────────────────────

async function nextDecisionId(): Promise<string> {
  const year  = new Date().getFullYear()
  const prefix = `RGS-${year}-`
  const last = await prisma.deploymentDecision.findFirst({
    where:   { decisionId: { startsWith: prefix } },
    orderBy: { evaluatedAt: 'desc' },
    select:  { decisionId: true },
  })
  const seq = last ? parseInt(last.decisionId.split('-')[2] ?? '0', 10) + 1 : 1
  return `${prefix}${String(seq).padStart(6, '0')}`
}

async function nextDeployId(): Promise<string> {
  const year  = new Date().getFullYear()
  const prefix = `DEP-${year}-`
  const last = await prisma.deploymentRecord.findFirst({
    where:   { deployId: { startsWith: prefix } },
    orderBy: { deployedAt: 'desc' },
    select:  { deployId: true },
  })
  const seq = last ? parseInt(last.deployId.split('-')[2] ?? '0', 10) + 1 : 1
  return `${prefix}${String(seq).padStart(6, '0')}`
}

// ─── Change window check ──────────────────────────────────────────────────────

interface ChangeWindow {
  daysOfWeek: number[]
  startHour:  number
  endHour:    number
  timezone?:  string
}

function isInChangeWindow(windows: ChangeWindow[]): boolean {
  if (!windows.length) return false
  const now = new Date()
  const day = now.getUTCDay()
  const hour = now.getUTCHours()
  return windows.some(w => w.daysOfWeek.includes(day) && hour >= w.startHour && hour < w.endHour)
}

// ─── Factor builders ──────────────────────────────────────────────────────────

function blocker(id: string, category: FactorCategory, description: string, evidence?: Record<string, unknown>): DecisionFactor {
  return { id, category, severity: 'BLOCKER', description, evidence }
}
function warning(id: string, category: FactorCategory, description: string, evidence?: Record<string, unknown>): DecisionFactor {
  return { id, category, severity: 'WARNING', description, evidence }
}

// ─── Core evaluator ───────────────────────────────────────────────────────────

async function computeFactors(input: {
  certId:      string
  envCode:     string
  approver?:   string
}): Promise<{ factors: DecisionFactor[]; env: any; cert: any }> {
  const factors: DecisionFactor[] = []

  const env = await prisma.deploymentEnvironment.findUnique({ where: { code: input.envCode } })
  if (!env) throw new Error(`Environment '${input.envCode}' not found`)

  // ── 1. QEF Certificate ─────────────────────────────────────────────────────
  if (env.certRequired) {
    const cert = await (prisma as any).qEFCertificate.findFirst({
      where:   { certId: input.certId },
      orderBy: { issuedAt: 'desc' },
    })

    if (!cert) {
      factors.push(blocker('CERT_REQUIRED', 'CERTIFICATION',
        'No QEF certificate found. A valid certificate is required before deployment.'))
      return { factors, env, cert: null }
    }

    if (cert.certificateStatus === 'REVOKED') {
      factors.push(blocker('CERT_REVOKED', 'CERTIFICATION',
        `Certificate ${cert.certId} has been revoked.`,
        { revokedReason: cert.revokedReason, revokedAt: cert.revokedAt }))
    }

    if (cert.certificateStatus !== 'ACTIVE') {
      if (cert.certificateStatus === 'DRAFT') {
        factors.push(blocker('CERT_NOT_ACTIVE', 'CERTIFICATION',
          `Certificate ${cert.certId} is in DRAFT status and has not been approved.`))
      } else if (cert.certificateStatus === 'SUPERSEDED') {
        factors.push(warning('CERT_SUPERSEDED', 'CERTIFICATION',
          `Certificate ${cert.certId} has been superseded. Deploy the latest ACTIVE certificate.`))
      }
    }

    if (env.minCertLevel && cert.certificateStatus === 'ACTIVE') {
      const required = CERT_LEVEL_RANK[env.minCertLevel] ?? 0
      const actual   = CERT_LEVEL_RANK[cert.level] ?? 0
      if (actual < required) {
        factors.push(blocker('CERT_LEVEL_INSUFFICIENT', 'CERTIFICATION',
          `Certificate level ${cert.level} is below the minimum required for ${env.code} (${env.minCertLevel}).`,
          { required: env.minCertLevel, actual: cert.level, score: cert.overallScore }))
      } else if (actual === required && required < 3) {
        factors.push(warning('CERT_LEVEL_ADVISORY', 'CERTIFICATION',
          `Certificate level meets minimum (${cert.level}) but ${env.code} recommends a higher tier.`,
          { current: cert.level }))
      }

      const certAge = Date.now() - new Date(cert.issuedAt).getTime()
      const seventyTwoHours = 72 * 60 * 60 * 1000
      if (certAge > seventyTwoHours) {
        factors.push(warning('CERT_AGE_ADVISORY', 'CERTIFICATION',
          `Certificate is ${Math.round(certAge / 3600000)}h old. Evidence may not reflect current platform state.`,
          { issuedAt: cert.issuedAt }))
      }
    }

    // ── 2. Incident registry — P0/P1 block, P2 warning ───────────────────────
    try {
      // Active = any non-resolved/closed status
      const ACTIVE_STATUSES = ['NEW', 'TRIAGING', 'IN_PROGRESS', 'ON_HOLD']

      const openIncidents = await prisma.incident.findMany({
        where: { status: { in: ACTIVE_STATUSES } },
        select: { id: true, number: true, title: true, priority: true, status: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      })

      // P1-CRITICAL maps to P0 (most critical), P2-HIGH to P1
      const p0 = openIncidents.filter(i => i.priority === 'P1-CRITICAL')
      const p1 = openIncidents.filter(i => i.priority === 'P2-HIGH')
      const p2 = openIncidents.filter(i => i.priority === 'P3-MEDIUM')

      if (p0.length > 0) {
        factors.push(blocker('P0_INCIDENT_ACTIVE', 'RUNTIME',
          `${p0.length} critical incident${p0.length > 1 ? 's' : ''} active: ${p0.map(i => i.number).join(', ')} — deployment blocked until resolved.`,
          { incidents: p0.map(i => ({ number: i.number, title: i.title, status: i.status })) }))
      }

      if (p1.length > 0) {
        factors.push(blocker('P1_INCIDENT_ACTIVE', 'RUNTIME',
          `${p1.length} high-priority incident${p1.length > 1 ? 's' : ''} active: ${p1.map(i => i.number).join(', ')}.`,
          { incidents: p1.map(i => ({ number: i.number, title: i.title, status: i.status })) }))
      }

      if (p2.length > 0 && p0.length === 0 && p1.length === 0) {
        factors.push(warning('P2_INCIDENT_ACTIVE', 'RUNTIME',
          `${p2.length} medium-priority incident${p2.length > 1 ? 's' : ''} open — review before deploying.`,
          { incidents: p2.map(i => ({ number: i.number, title: i.title })) }))
      }
    } catch {}

    // ── 3. Runtime health — G6 Enterprise Readiness ───────────────────────────
    try {
      const latestRun = await (prisma as any).waandaGate6Run?.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { totalScore: true, passCount: true, failCount: true, verdict: true },
      }).catch(() => null)

      if (latestRun) {
        if (latestRun.verdict === 'FAIL') {
          factors.push(blocker('ENVIRONMENT_CRITICAL_DOWN', 'ENVIRONMENT',
            `Enterprise Readiness (QEF-G6) is currently FAIL — critical environment checks failing.`,
            { score: latestRun.totalScore, failCount: latestRun.failCount }))
        } else if (latestRun.totalScore < 60) {
          factors.push(warning('RUNTIME_DEGRADED', 'RUNTIME',
            `Runtime health score is ${latestRun.totalScore.toFixed(0)}% — platform operating below target.`,
            { score: latestRun.totalScore }))
        }
      }
    } catch {}

    // ── 4. Change window policy ───────────────────────────────────────────────
    if (env.changeWindowEnabled) {
      const windows = (env.changeWindows as unknown as ChangeWindow[]) ?? []
      if (!isInChangeWindow(windows)) {
        factors.push(blocker('OUTSIDE_CHANGE_WINDOW', 'POLICY',
          `Deployment is outside the declared change window for ${env.code}.`,
          { windows }))
      }
    }

    // ── 5. Deployment approval ────────────────────────────────────────────────
    if (env.approvalRequired && !input.approver) {
      factors.push(blocker('APPROVAL_REQUIRED', 'APPROVAL',
        `Deployment to ${env.code} requires explicit human approval.`))
    }

    // ── 6. Rollback readiness ─────────────────────────────────────────────────
    const prevDeployment = await prisma.deploymentRecord.findFirst({
      where:   { environmentId: env.id, outcome: 'SUCCESS' },
      orderBy: { deployedAt: 'desc' },
    })
    if (!prevDeployment) {
      factors.push(warning('ROLLBACK_UNKNOWN', 'ENVIRONMENT',
        'No previous successful deployment found — rollback path is unverified.'))
    } else {
      const prevCert = await (prisma as any).qEFCertificate.findFirst({
        where: { certId: prevDeployment.certId },
      })
      if (prevCert?.certificateStatus === 'REVOKED') {
        factors.push(warning('ROLLBACK_DEGRADED', 'ENVIRONMENT',
          `Previous deployment's certificate (${prevDeployment.certId}) has been revoked — rollback would redeploy invalid evidence.`))
      }
    }

    return { factors, env, cert }
  }

  return { factors, env, cert: null }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function evaluateRelease(input: {
  certId:    string
  envCode:   string
  approver?: string
}) {
  const { factors, env, cert } = await computeFactors(input)

  const blockers = factors.filter(f => f.severity === 'BLOCKER')
  const warnings = factors.filter(f => f.severity === 'WARNING')
  const verdict: ReleaseVerdict = blockers.length > 0 ? 'BLOCK' : warnings.length > 0 ? 'REVIEW' : 'DEPLOY'

  const decisionId = await nextDecisionId()
  const validUntil = new Date(Date.now() + env.decisionValidityMs)

  const approvals: Approval[] = input.approver && env.approvalRequired
    ? [{ approver: input.approver, role: 'Release Authority', approvedAt: new Date().toISOString() }]
    : []

  const hashInput = JSON.stringify({ decisionId, rgsVersion: RGS_SCHEMA_VERSION, verdict, certId: input.certId, envCode: input.envCode, blockers, warnings, validUntil: validUntil.toISOString() })
  const sha256 = crypto.createHash('sha256').update(hashInput).digest('hex')

  const decision = await prisma.deploymentDecision.create({
    data: {
      decisionId,
      rgsVersion:    RGS_SCHEMA_VERSION,
      verdict,
      certId:        input.certId,
      certLevel:     cert?.level ?? 'NOT_CERTIFIED',
      environmentId: env.id,
      blockers:      blockers as any,
      warnings:      warnings as any,
      approvals:     approvals as any,
      evaluatedBy:   'WAANDA Release Engine',
      validUntil,
      sha256,
    },
    include: { environment: true },
  })

  // HANUMANAS audit — every decision is logged regardless of verdict
  await HanumanasLedger.logDeployment({
    eventType:   verdict === 'BLOCK' ? 'DEPLOYMENT_BLOCKED' : 'DEPLOYMENT_AUTHORIZED',
    decisionId,
    certId:      input.certId,
    environment: input.envCode,
    verdict,
    actor:       input.approver ?? 'WAANDA Release Engine',
    blockers:    blockers.map(b => b.id),
    metadata:    { warnings: warnings.map(w => w.id), certLevel: cert?.level },
  })

  return decision
}

export async function recordDeployment(input: {
  decisionId: string
  deployedBy: string
}) {
  const decision = await prisma.deploymentDecision.findUniqueOrThrow({
    where: { decisionId: input.decisionId },
    include: { environment: true },
  })

  if (decision.verdict !== 'DEPLOY') {
    throw new Error(`Decision ${input.decisionId} has verdict ${decision.verdict} — only DEPLOY decisions can authorize a deployment.`)
  }
  if (new Date() > decision.validUntil) {
    throw new Error(`Decision ${input.decisionId} has expired at ${decision.validUntil.toISOString()}. Re-evaluate before deploying.`)
  }

  const deployId = await nextDeployId()
  const hashInput = JSON.stringify({ deployId, rgsVersion: RGS_SCHEMA_VERSION, decisionId: input.decisionId, certId: decision.certId, environmentId: decision.environmentId, deployedBy: input.deployedBy })
  const sha256 = crypto.createHash('sha256').update(hashInput).digest('hex')

  const record = await prisma.deploymentRecord.create({
    data: {
      deployId,
      rgsVersion:    RGS_SCHEMA_VERSION,
      decisionId:    decision.id,
      certId:        decision.certId,
      certLevel:     decision.certLevel,
      environmentId: decision.environmentId,
      deployedBy:    input.deployedBy,
      sha256,
    },
    include: { environment: true, decision: true },
  })

  await HanumanasLedger.logDeployment({
    eventType:   'DEPLOYMENT_AUTHORIZED',
    decisionId:  input.decisionId,
    deployId,
    certId:      decision.certId,
    environment: record.environment.code,
    actor:       input.deployedBy,
    metadata:    { certLevel: decision.certLevel },
  })

  return record
}

export async function recordOutcome(input: {
  deployId:    string
  outcome:     'SUCCESS' | 'FAILED' | 'ROLLED_BACK'
  outcomeNote?: string
}) {
  const record = await prisma.deploymentRecord.update({
    where:   { deployId: input.deployId },
    data:    { outcome: input.outcome, outcomeAt: new Date(), outcomeNote: input.outcomeNote },
    include: { environment: true, decision: true },
  })

  await HanumanasLedger.logDeployment({
    eventType:   'DEPLOYMENT_COMPLETED',
    decisionId:  record.decision.decisionId,
    deployId:    input.deployId,
    certId:      record.certId,
    environment: record.environment.code,
    actor:       record.deployedBy,
    outcome:     input.outcome,
    metadata:    { outcomeNote: input.outcomeNote },
  })

  return record
}

export async function recordRollback(input: {
  rollbackOfDeployId: string
  authorizedBy:       string
  reason:             string
}) {
  const original = await prisma.deploymentRecord.findUniqueOrThrow({
    where:   { deployId: input.rollbackOfDeployId },
    include: { decision: true, environment: true },
  })

  // ── Rollback readiness: verify there is a prior successful deployment to return to ──
  const priorSuccessful = await prisma.deploymentRecord.findFirst({
    where: {
      environmentId: original.environmentId,
      outcome:       'SUCCESS',
      deployedAt:    { lt: original.deployedAt },
    },
    orderBy: { deployedAt: 'desc' },
    select:  { deployId: true, certId: true, deployedAt: true },
  })

  if (!priorSuccessful) {
    throw new Error(
      `Rollback rejected: no prior successful deployment found in ${original.environment.code}. ` +
      `Cannot verify rollback target — the platform has no known-good prior state to restore.`
    )
  }

  const rollbackTargetCertRevoked = priorSuccessful.certId
    ? await (prisma as any).qEFCertificate.findFirst({
        where:  { certId: priorSuccessful.certId, certificateStatus: 'REVOKED' },
        select: { certId: true },
      }).catch(() => null)
    : null

  if (rollbackTargetCertRevoked) {
    throw new Error(
      `Rollback rejected: the rollback target deployment ${priorSuccessful.deployId} was issued under ` +
      `certificate ${priorSuccessful.certId} which has since been REVOKED. Restoring it would deploy invalid evidence.`
    )
  }

  // Issue a fast-track decision for the rollback
  const decisionId = await nextDecisionId()
  const validUntil = new Date(Date.now() + original.environment.decisionValidityMs)
  const hashInput  = JSON.stringify({ decisionId, verdict: 'DEPLOY', type: 'ROLLBACK', rollbackOf: input.rollbackOfDeployId })
  const sha256d    = crypto.createHash('sha256').update(hashInput).digest('hex')

  const rollbackDecision = await prisma.deploymentDecision.create({
    data: {
      decisionId,
      rgsVersion:    RGS_SCHEMA_VERSION,
      verdict:       'DEPLOY',
      certId:        original.certId,
      certLevel:     original.certLevel,
      environmentId: original.environmentId,
      blockers:      [] as any,
      warnings:      [] as any,
      approvals:     [{ approver: input.authorizedBy, role: 'Release Authority', approvedAt: new Date().toISOString() }] as any,
      evaluatedBy:   'WAANDA Release Engine (Rollback)',
      validUntil,
      sha256:        sha256d,
    },
  })

  const deployId  = await nextDeployId()
  const hashInput2 = JSON.stringify({ deployId, rgsVersion: RGS_SCHEMA_VERSION, decisionId: rollbackDecision.id, rollbackOf: input.rollbackOfDeployId })
  const sha256r   = crypto.createHash('sha256').update(hashInput2).digest('hex')

  await prisma.deploymentRecord.update({
    where: { deployId: input.rollbackOfDeployId },
    data:  { outcome: 'ROLLED_BACK', outcomeAt: new Date(), outcomeNote: `Rolled back: ${input.reason}` },
  })

  const rollbackRecord = await prisma.deploymentRecord.create({
    data: {
      deployId,
      rgsVersion:    RGS_SCHEMA_VERSION,
      decisionId:    rollbackDecision.id,
      certId:        original.certId,
      certLevel:     original.certLevel,
      environmentId: original.environmentId,
      deployedBy:    input.authorizedBy,
      rollbackOf:    input.rollbackOfDeployId,
      sha256:        sha256r,
    },
    include: { environment: true, decision: true },
  })

  await HanumanasLedger.logDeployment({
    eventType:   'DEPLOYMENT_ROLLBACK_INITIATED',
    decisionId:  rollbackDecision.decisionId,
    deployId,
    certId:      original.certId,
    environment: original.environment.code,
    actor:       input.authorizedBy,
    reason:      input.reason,
    metadata:    { rollbackOf: input.rollbackOfDeployId },
  })

  return rollbackRecord
}

export async function emergencyOverride(input: {
  decisionId: string
  approver1:  string
  approver2:  string
  reason:     string
}) {
  const original = await prisma.deploymentDecision.findUniqueOrThrow({
    where:   { decisionId: input.decisionId },
    include: { environment: true },
  })

  if (original.verdict !== 'BLOCK') {
    throw new Error(`Decision ${input.decisionId} is not a BLOCK verdict — no override needed.`)
  }

  const blockers = (original.blockers as unknown as DecisionFactor[]) ?? []
  const nonOverridable = blockers.filter(b => NON_OVERRIDABLE.has(b.id))
  if (nonOverridable.length > 0) {
    throw new Error(`Cannot override: ${nonOverridable.map(b => b.id).join(', ')} — these blockers are non-overridable under RGS §6.3.`)
  }

  const newDecisionId = await nextDecisionId()
  const validUntil    = new Date(Date.now() + original.environment.decisionValidityMs)
  const approvals: Approval[] = [
    { approver: input.approver1, role: 'Release Authority', approvedAt: new Date().toISOString() },
    { approver: input.approver2, role: 'Release Authority', approvedAt: new Date().toISOString() },
  ]

  const hashInput = JSON.stringify({ newDecisionId, rgsVersion: RGS_SCHEMA_VERSION, verdict: 'DEPLOY', emergencyOverride: true, originalDecisionId: input.decisionId, reason: input.reason })
  const sha256 = crypto.createHash('sha256').update(hashInput).digest('hex')

  const overrideDecision = await prisma.deploymentDecision.create({
    data: {
      decisionId:       newDecisionId,
      rgsVersion:       RGS_SCHEMA_VERSION,
      verdict:          'DEPLOY',
      certId:           original.certId,
      certLevel:        original.certLevel,
      environmentId:    original.environmentId,
      blockers:         [] as any,
      warnings:         blockers as any,   // original blockers preserved as warnings for audit trail
      approvals:        approvals as any,
      emergencyOverride: true,
      overrideReason:   input.reason,
      evaluatedBy:      'WAANDA Release Engine (Emergency Override)',
      validUntil,
      sha256,
    },
    include: { environment: true },
  })

  await HanumanasLedger.logDeployment({
    eventType:   'DEPLOYMENT_EMERGENCY_OVERRIDE',
    decisionId:  newDecisionId,
    certId:      original.certId,
    environment: overrideDecision.environment.code,
    actor:       `${input.approver1} + ${input.approver2}`,
    blockers:    blockers.map(b => b.id),
    reason:      input.reason,
    metadata:    { originalDecisionId: input.decisionId, approver1: input.approver1, approver2: input.approver2 },
  })

  return overrideDecision
}

export async function preflightCheck(envCode: string, certId?: string) {
  const input = { certId: certId ?? '', envCode }
  const { factors, env, cert } = certId
    ? await computeFactors(input)
    : { factors: [] as DecisionFactor[], env: await prisma.deploymentEnvironment.findUnique({ where: { code: envCode } }), cert: null }

  const blockers = factors.filter(f => f.severity === 'BLOCKER')
  const warnings = factors.filter(f => f.severity === 'WARNING')
  const previewVerdict: ReleaseVerdict = blockers.length > 0 ? 'BLOCK' : warnings.length > 0 ? 'REVIEW' : 'DEPLOY'

  return { environment: env, factors, previewVerdict, cert }
}

export async function listDecisions(envCode?: string, limit = 20) {
  const env = envCode ? await prisma.deploymentEnvironment.findUnique({ where: { code: envCode } }) : null
  return prisma.deploymentDecision.findMany({
    where:   env ? { environmentId: env.id } : {},
    orderBy: { evaluatedAt: 'desc' },
    take:    limit,
    include: { environment: true },
  })
}

export async function listDeployments(envCode?: string, limit = 20) {
  const env = envCode ? await prisma.deploymentEnvironment.findUnique({ where: { code: envCode } }) : null
  return prisma.deploymentRecord.findMany({
    where:   env ? { environmentId: env.id } : {},
    orderBy: { deployedAt: 'desc' },
    take:    limit,
    include: { environment: true, decision: { select: { decisionId: true, verdict: true, emergencyOverride: true } } },
  })
}

export async function listEnvironments() {
  return prisma.deploymentEnvironment.findMany({ where: { enabled: true }, orderBy: { createdAt: 'asc' } })
}

export async function seedDefaultEnvironments() {
  const envs = [
    {
      code: 'dev',
      name: 'Development',
      certRequired: false,
      minCertLevel: null,
      approvalRequired: false,
      changeWindowEnabled: false,
      decisionValidityMs: 8 * 60 * 60 * 1000,
    },
    {
      code: 'staging',
      name: 'Staging',
      certRequired: true,
      minCertLevel: 'CERTIFIED',
      approvalRequired: false,
      changeWindowEnabled: false,
      decisionValidityMs: 4 * 60 * 60 * 1000,
    },
    {
      code: 'production',
      name: 'Production',
      certRequired: true,
      minCertLevel: 'ADVANCED_CERTIFIED',
      approvalRequired: true,
      changeWindowEnabled: true,
      changeWindows: [
        { daysOfWeek: [1, 2, 3, 4, 5], startHour: 4, endHour: 14, timezone: 'UTC' },  // Mon-Fri 09:30-19:30 IST
      ],
      decisionValidityMs: 2 * 60 * 60 * 1000,
    },
  ]

  for (const env of envs) {
    await prisma.deploymentEnvironment.upsert({
      where:  { code: env.code },
      update: {},
      create: env as any,
    })
  }

  console.log('✓ Default environments seeded: dev, staging, production')
}
