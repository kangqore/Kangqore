// ---------------------------------------------------------------------------
// WAANDA System Routes — boot manifest + domain registry + OS health
// Mounted at /api/admin/waanda (ADMIN only, protected upstream)
// ---------------------------------------------------------------------------

import { Router, Request, Response } from 'express'
import { WAANDA }          from './WaandaBootstrap'
import { DomainRegistry }  from '../os/edf/core/DomainRegistry'
import { CapabilityRegistry } from '../os/kernel/CapabilityRegistry'
import { MissionDispatcher } from '../immp/core/MissionDispatcher'
import {
  COGNITIVE_STAGE_MAP,
  STAGE_QUESTIONS,
  WaandaCognitivePipeline,
  CognitiveStage,
} from './types'

export const waandaRouter = Router()

// ── OS Health ─────────────────────────────────────────────────────────────

waandaRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    system:   'WAANDA',
    fullName: 'Kangqore Enterprise Cognitive Operating System',
    status:   WAANDA._booted ? 'OPERATIONAL' : 'BOOTING',
    booted:   WAANDA._booted,
    bootedAt: WAANDA._bootedAt,
    timestamp: new Date().toISOString(),
  })
})

// ── Boot Manifest — full phase-by-phase boot log ──────────────────────────

waandaRouter.get('/status', (_req: Request, res: Response) => {
  res.json(WAANDA.status())
})

// ── Enterprise Domain Registry ────────────────────────────────────────────

waandaRouter.get('/domains', (_req: Request, res: Response) => {
  const domains = DomainRegistry.getAll()
  res.json({
    system:  'WAANDA',
    layer:   'Enterprise Domain Registry',
    total:   domains.length,
    domains: domains.map(d => ({
      id:           d.metadata.id,
      name:         d.metadata.name,
      version:      d.metadata.version,
      purpose:      d.metadata.purpose,
      ready:        DomainRegistry.isDomainReady(d.metadata.id),
      objects:      d.objects.length,
      capabilities: d.capabilities.length,
      goals:        d.goals.length,
      events:       d.events.length,
      hasExecutive: !!d.executive,
    })),
  })
})

// ── Capability Registry (from KEOS kernel) ────────────────────────────────

waandaRouter.get('/capabilities', async (_req: Request, res: Response) => {
  const capabilities = await CapabilityRegistry.listCapabilities().catch(() => [])
  res.json({
    system:       'WAANDA',
    layer:        'Enterprise Capability Registry',
    total:        capabilities.length,
    capabilities,
  })
})

// ── Cognitive Pipeline — the constitutional map ───────────────────────────

waandaRouter.get('/pipeline', (_req: Request, res: Response) => {
  const stages: CognitiveStage[] = ['OBSERVE', 'UNDERSTAND', 'DECIDE', 'ACT', 'LEARN']

  const byStage = stages.reduce((acc, stage) => {
    acc[stage] = []
    return acc
  }, {} as Record<CognitiveStage, string[]>)

  for (const [subsystem, stage] of Object.entries(COGNITIVE_STAGE_MAP)) {
    byStage[stage].push(subsystem)
  }

  const pipeline: WaandaCognitivePipeline[] = stages.map(stage => ({
    stage,
    question:   STAGE_QUESTIONS[stage],
    subsystems: byStage[stage],
    status:     WAANDA._booted ? 'ACTIVE' : 'INACTIVE',
  }))

  res.json({
    system:    'WAANDA',
    layer:     'Cognitive Pipeline',
    rule:      'No subsystem owns a business workflow. Every subsystem extends one stage of WAANDA\'s cognitive lifecycle.',
    pipeline,
    timestamp: new Date().toISOString(),
  })
})

// ── Execute Mission (KEOS Kernel) ─────────────────────────────────────────

waandaRouter.post('/mission', async (req: Request, res: Response) => {
  const { goal, description, requiredCapability } = req.body
  if (!goal) return res.status(400).json({ error: '`goal` is required' })

  try {
    const result = await MissionDispatcher.dispatch({
      goal,
      description,
      requester:          (req as any).user?.id ?? 'ADMIN',
      requiredCapability,
    })
    res.json({ system: 'WAANDA', layer: 'KIMMP Runtime → KEOS Kernel', mission: result })
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Mission failed' })
  }
})
