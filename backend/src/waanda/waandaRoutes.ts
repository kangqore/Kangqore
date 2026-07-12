// ---------------------------------------------------------------------------
// WAANDA System Routes — boot manifest + domain registry + OS health
// Mounted at /api/admin/waanda (ADMIN only, protected upstream)
// ---------------------------------------------------------------------------

import { Router, Request, Response } from 'express'
import { WAANDA }             from './WaandaBootstrap'
import { WaandaAuthority }    from './WaandaAuthority'
import { DomainRegistry }     from '../os/edf/core/DomainRegistry'
import { CapabilityRegistry } from '../os/kernel/CapabilityRegistry'
import { MissionDispatcher }  from '../immp/core/MissionDispatcher'
import { prisma }             from '../lib/prisma'
import type { SubsystemName, DirectiveType } from './WaandaDirective'
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

// ── Workspace Capability Query ────────────────────────────────────────────
// Called by CapabilityBroker providers when a widget executes a capability.
// Handles: cap.ai.plan / cap.ai.forecast / cap.ai.simulate / cap.ai.analyze / ecf.waanda

waandaRouter.post('/query', async (req: Request, res: Response) => {
  const { prompt, capability, workspaceId } = req.body
  if (!prompt) return res.status(400).json({ error: '`prompt` is required' })

  try {
    const result = await MissionDispatcher.dispatch({
      goal:               prompt,
      description:        `Workspace capability [${capability ?? 'cap.ai.plan'}] from [${workspaceId ?? 'unknown'}]`,
      requester:          (req as any).user?.id ?? 'ADMIN',
      requiredCapability: capability ?? 'cap.ai.plan',
    })
    res.json({ ok: true, response: result, capability: capability ?? 'cap.ai.plan', workspaceId })
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Workspace query failed' })
  }
})

// ── Authority — registered subsystems ────────────────────────────────────

waandaRouter.get('/authority', (_req: Request, res: Response) => {
  res.json({
    system:      'WAANDA',
    layer:       'Supreme Authority Registry',
    initialized: WaandaAuthority._initialized,
    subsystems:  WaandaAuthority.getRegisteredSystems(),
  })
})

// ── Authority — live health of all subsystems ─────────────────────────────

waandaRouter.get('/authority/health', (_req: Request, res: Response) => {
  res.json({
    system:    'WAANDA',
    layer:     'Subsystem Health',
    health:    WaandaAuthority.healthCheck(),
    timestamp: new Date().toISOString(),
  })
})

// ── Authority — issue a directive to a subsystem ─────────────────────────

waandaRouter.post('/authority/directive', async (req: Request, res: Response) => {
  const { to, type, payload, reason } = req.body as {
    to:      SubsystemName
    type:    DirectiveType
    payload: Record<string, unknown>
    reason?: string
  }
  if (!to || !type) return res.status(400).json({ error: '`to` and `type` are required' })

  try {
    const result = await WaandaAuthority.issueDirective(to, type, payload ?? {}, reason)
    res.json({ ok: true, result })
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Directive failed' })
  }
})

// ── Authority — broadcast a directive to all subsystems ──────────────────

waandaRouter.post('/authority/broadcast', async (req: Request, res: Response) => {
  const { type, payload, reason } = req.body as {
    type:    DirectiveType
    payload: Record<string, unknown>
    reason?: string
  }
  if (!type) return res.status(400).json({ error: '`type` is required' })

  try {
    const results = await WaandaAuthority.broadcastDirective(type, payload ?? {}, reason)
    res.json({ ok: true, results })
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'Broadcast failed' })
  }
})

// ── Authority — directive history ─────────────────────────────────────────

waandaRouter.get('/authority/directives', async (req: Request, res: Response) => {
  const limit = Math.min(100, Number(req.query.limit) || 50)
  const to    = req.query.to as string | undefined
  try {
    const rows = await (prisma as any).waandaDirectiveLog.findMany({
      where:   to ? { to } : undefined,
      orderBy: { issuedAt: 'desc' },
      take:    limit,
    })
    res.json({ system: 'WAANDA', layer: 'Directive History', total: rows.length, directives: rows })
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

waandaRouter.get('/authority/directives/:id', async (req: Request, res: Response) => {
  try {
    const row = await (prisma as any).waandaDirectiveLog.findUnique({
      where: { directiveId: req.params.id },
    })
    if (!row) return res.status(404).json({ error: 'Directive not found' })
    res.json(row)
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// ── Intelligence — WAANDA self-awareness (OIS + OII + COIG) ──────────────

waandaRouter.get('/intelligence', async (_req: Request, res: Response) => {
  try {
    const { WaandaIntelligence } = await import('./intelligence/WaandaIntelligence')
    const snapshot = await WaandaIntelligence.compute()
    res.json({ system: 'WAANDA', layer: 'Self-Intelligence', ...snapshot })
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
})

// ── Federated Intelligence — each subsystem's local brain report ──────────

waandaRouter.get('/authority/intelligence', (_req: Request, res: Response) => {
  try {
    const reports = WaandaAuthority.collectIntelligence()
    res.json({
      system:    'WAANDA',
      layer:     'Federated Subsystem Intelligence',
      total:     reports.length,
      reports,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    res.status(500).json({ error: err?.message })
  }
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
