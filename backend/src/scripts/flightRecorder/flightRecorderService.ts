// ---------------------------------------------------------------------------
// Platform Flight Recorder — chronological event replay from all platform sources.
// Aggregates: HANUMANAS, QEF Certs, KIMMP Goals/Decisions/Memories, Workflows,
// Incidents, and RGS Deployments into a unified timeline.
// ---------------------------------------------------------------------------

import { prisma } from '../../lib/prisma'

export type FlightSource = 'KIMMP' | 'HANUMANAS' | 'QEF' | 'RGS' | 'WORKFLOW' | 'INCIDENT'

export interface FlightEvent {
  id:        string
  timestamp: Date
  type:      string
  source:    FlightSource
  title:     string
  detail?:   string
  actor?:    string
  severity?: string
  metadata?: Record<string, unknown>
}

export interface FlightRecorderOpts {
  from?:    Date
  to?:      Date
  types?:   string[]
  sources?: FlightSource[]
  limit?:   number
  offset?:  number
}

export async function getFlightEvents(opts: FlightRecorderOpts = {}): Promise<{ events: FlightEvent[]; total: number }> {
  const limit = Math.min(Math.max(1, opts.limit ?? 50), 200)

  const timeWhere = (field = 'createdAt') => {
    const w: Record<string, unknown> = {}
    if (opts.from) w.gte = opts.from
    if (opts.to)   w.lte = opts.to
    return Object.keys(w).length ? { [field]: w } : {}
  }

  const [aegisRows, certRows, goalRows, decisionRows, memoryRows, workflowRows, incidentRows, deployRows] =
    await Promise.all([
      (prisma as any).hanumanasAuditLog.findMany({
        where:   timeWhere(),
        orderBy: { createdAt: 'desc' },
        take:    limit,
        select:  { id: true, eventType: true, system: true, trigger: true, actor: true, priority: true, metadata: true, createdAt: true },
      }).catch(() => []),

      (prisma as any).qEFCertificate.findMany({
        where:   timeWhere(),
        orderBy: { createdAt: 'desc' },
        take:    30,
        select:  { id: true, certId: true, level: true, overallScore: true, certificateStatus: true, certifiedBy: true, createdAt: true },
      }).catch(() => []),

      prisma.kimmpGoal.findMany({
        where:   timeWhere(),
        orderBy: { createdAt: 'desc' },
        take:    30,
        select:  { id: true, objective: true, owner: true, status: true, createdAt: true },
      }).catch(() => []),

      prisma.kimmpDecision.findMany({
        where:   timeWhere(),
        orderBy: { createdAt: 'desc' },
        take:    30,
        select:  { id: true, decisionType: true, recommendedAction: true, targetModule: true, confidence: true, priority: true, createdAt: true },
      }).catch(() => []),

      prisma.kimmpMemory.findMany({
        where:   timeWhere(),
        orderBy: { createdAt: 'desc' },
        take:    30,
        select:  { id: true, type: true, content: true, tags: true, createdAt: true },
      }).catch(() => []),

      prisma.osWorkflowRun.findMany({
        where:   timeWhere('startedAt'),
        orderBy: { startedAt: 'desc' },
        take:    30,
        select:  { id: true, workflowName: true, status: true, triggeredBy: true, startedAt: true, duration: true },
      }).catch(() => []),

      prisma.incident.findMany({
        where:   timeWhere(),
        orderBy: { createdAt: 'desc' },
        take:    30,
        select:  { id: true, number: true, title: true, priority: true, status: true, createdAt: true, resolvedAt: true },
      }).catch(() => []),

      (prisma as any).deploymentRecord.findMany({
        where:   timeWhere('deployedAt'),
        orderBy: { deployedAt: 'desc' },
        take:    30,
        select:  { id: true, deployId: true, certId: true, deployedBy: true, outcome: true, deployedAt: true },
      }).catch(() => []),
    ])

  const events: FlightEvent[] = []

  for (const r of aegisRows as any[]) {
    events.push({
      id:        r.id,
      timestamp: new Date(r.createdAt),
      type:      r.eventType,
      source:    'HANUMANAS',
      title:     formatAegisTitle(r),
      actor:     r.actor,
      severity:  r.priority,
      metadata:  r.metadata as Record<string, unknown>,
    })
  }

  for (const r of certRows as any[]) {
    events.push({
      id:        r.id,
      timestamp: new Date(r.createdAt),
      type:      'CERT_ISSUED',
      source:    'QEF',
      title:     `Certificate Issued — ${r.certId}`,
      detail:    `${(r.level ?? '').replace(/_/g, ' ')} · Score ${r.overallScore?.toFixed(1) ?? '—'}`,
      actor:     r.certifiedBy,
    })
  }

  for (const r of goalRows as any[]) {
    events.push({
      id:        r.id,
      timestamp: new Date(r.createdAt),
      type:      'GOAL_CREATED',
      source:    'KIMMP',
      title:     `Goal Created — ${r.objective.substring(0, 80)}`,
      detail:    `Status: ${r.status}`,
      actor:     r.owner ?? 'WAANDA',
    })
  }

  for (const r of decisionRows as any[]) {
    events.push({
      id:        r.id,
      timestamp: new Date(r.createdAt),
      type:      'DECISION_GENERATED',
      source:    'KIMMP',
      title:     `Decision Generated — ${r.decisionType}`,
      detail:    r.recommendedAction.substring(0, 120),
      actor:     'WAANDA',
      severity:  r.priority === 1 ? 'HIGH' : undefined,
    })
  }

  for (const r of memoryRows as any[]) {
    events.push({
      id:        r.id,
      timestamp: new Date(r.createdAt),
      type:      'MEMORY_RECORDED',
      source:    'KIMMP',
      title:     `Memory Recorded — ${r.type}`,
      detail:    r.content.substring(0, 120),
      actor:     'WAANDA',
    })
  }

  for (const r of workflowRows as any[]) {
    events.push({
      id:        r.id,
      timestamp: new Date(r.startedAt),
      type:      'WORKFLOW_EXECUTED',
      source:    'WORKFLOW',
      title:     `Workflow — ${r.workflowName}`,
      detail:    `${r.status}${r.duration ? ` · ${r.duration}s` : ''}`,
      actor:     r.triggeredBy,
      severity:  r.status === 'failed' ? 'HIGH' : undefined,
    })
  }

  for (const r of incidentRows as any[]) {
    events.push({
      id:        r.id,
      timestamp: new Date(r.createdAt),
      type:      'INCIDENT_DECLARED',
      source:    'INCIDENT',
      title:     `Incident — ${r.number}: ${r.title}`,
      detail:    r.status,
      severity:  r.priority,
    })
    if (r.resolvedAt) {
      events.push({
        id:        `${r.id}_resolved`,
        timestamp: new Date(r.resolvedAt),
        type:      'INCIDENT_RESOLVED',
        source:    'INCIDENT',
        title:     `Incident Resolved — ${r.number}`,
        detail:    r.title,
      })
    }
  }

  for (const r of deployRows as any[]) {
    events.push({
      id:        r.id,
      timestamp: new Date(r.deployedAt),
      type:      'DEPLOYMENT_EXECUTED',
      source:    'RGS',
      title:     `Deployment — ${r.deployId}`,
      detail:    `${r.certId}${r.outcome ? ` · ${r.outcome}` : ' · in progress'}`,
      actor:     r.deployedBy,
      severity:  r.outcome === 'FAILED' ? 'HIGH' : undefined,
    })
  }

  events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  let filtered = events
  if (opts.types?.length)   filtered = filtered.filter(e => opts.types!.includes(e.type))
  if (opts.sources?.length) filtered = filtered.filter(e => opts.sources!.includes(e.source))

  const total     = filtered.length
  const paginated = filtered.slice(opts.offset ?? 0, (opts.offset ?? 0) + limit)

  return { events: paginated, total }
}

function formatAegisTitle(r: { eventType: string; system?: string; trigger?: string; endpoint?: string }): string {
  switch (r.eventType) {
    case 'ACTIVATION':                   return `KIMMP Activated — ${r.system ?? r.trigger ?? ''}`
    case 'AUTONOMOUS':                   return `Autonomous Action — ${r.system ?? r.trigger ?? ''}`
    case 'ACCESS_DENIED':                return `Access Denied — ${r.endpoint ?? ''}`
    case 'KNOWLEDGE_ASSET':              return `Knowledge Asset Recorded`
    case 'POLICY_VIOLATION':             return `Policy Violation — ${r.trigger ?? ''}`
    case 'DEPLOYMENT_AUTHORIZED':        return `Deployment Authorized`
    case 'DEPLOYMENT_BLOCKED':           return `Deployment Blocked`
    case 'DEPLOYMENT_EMERGENCY_OVERRIDE': return `Emergency Override Applied`
    case 'DEPLOYMENT_ROLLBACK_INITIATED': return `Rollback Initiated`
    case 'DEPLOYMENT_COMPLETED':         return `Deployment Completed`
    case 'EGRESS':                       return `Data Egress — ${r.endpoint ?? ''}`
    default:                             return r.eventType
  }
}
