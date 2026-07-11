// ---------------------------------------------------------------------------
// KIMMP — route registry
//
// PR 1 is a passive, read-only intelligence layer: it analyzes text on demand
// and is NOT yet wired into the live eQORE conversation flow.
// Mounted by backend/src/index.ts at /api/admin/kangqore-immp.
// ---------------------------------------------------------------------------

import { Router } from 'express';
import { execFile } from 'child_process';
import { createReadStream, promises as fsPromises } from 'fs';
import { pipeline as streamPipeline } from 'stream/promises';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import logger from '../utils/logger';
import { requireAuth, requireRole } from '../middleware/rbac';
import { KIMMP_VERSION } from './core/types';
import { KimmpFlags } from './core/flags';
import { BehaviorAnalysisController } from './controllers/behaviorAnalysis.controller';
import { pageFactoryRoutes } from './page-factory/routes';
import { SignalLedgerController } from './controllers/signalLedger.controller';
import { DecisionEngineController } from './controllers/decisionEngine.controller';
import { VisSignalProducer } from '../kangqore-vis/signals/visSignalProducer.service';
import { KimmpAuditLog } from './governance/auditLog.service';
import { SwarmManager } from './orchestrator/swarmManager.service';
import { KimmpCostTracker } from './governance/costTracker.service';
import { PermissionMatrix } from './governance/permissionMatrix';
import { WorkflowExecutor } from './workflow/workflowExecutor.service';
import { KimmpPredictionService } from './prediction/kimmpPrediction.service';
import { PredictionStore } from './prediction/predictionStore.service';
import { KimmpRag } from './rag/kimmpRag.service';
import { KIMMMCommandService } from './command/commandService';
import { KimmpMemoryService } from './memory/kimmpMemory.service';
import { KimmpActionsService } from './actions/kimmpActions.service';
import { KimmpAuthorityEngine } from './authority/kimmpAuthority.service';
import { KimmpActionProposer } from './actions/kimmpActionProposer';
import { KimmpScoutService, SCOUT_SOURCES } from './scout/kimmpScout.service';
import { KimmpCorrelationEngine } from './correlation/kimmpCorrelation.service';
import { KimmpResearchService } from './research/kimmpResearch.service';
import { KimmpReportService, ReportType } from './reports/kimmpReport.service';
import { KimmpGoalEngine } from './goals/kimmpGoal.service';
import { KimmpProactiveEngine } from './proactive/kimmpProactive.service';
import { KimmpOrchestrator, runSimulationEngine, parseAdjustedScores } from './orchestrator/kimmpOrchestrator.service';
import { KimmpDigitalTwin } from './twin/kimmpTwin.service';
import { KimmpSystemDispatcher } from './agents/systemDispatcher';
import { SystemType, SYSTEM_AGENTS } from './agents/agentRegistry';
import { SystemLearning } from './agents/systemLearning';
import { invalidatePulseCache } from '../scripts/gate8/enterpriseService';
import { SystemRAG, RAGSystem, RAG_SYSTEMS, SYSTEM_DOC_TYPES } from './agents/systemRAG';
import { prisma } from '../lib/prisma';

const kangqoreImmpRoutes = Router();

// ── TTS — platform-aware voice, served as WAV ────────────────────────────────
// macOS: `say` → AIFF, `afconvert` → WAV
// Linux: `espeak-ng` → WAV directly (Dockerfile installs espeak-ng)
kangqoreImmpRoutes.get('/tts', async (req, res) => {
  const raw  = typeof req.query.text === 'string' ? req.query.text : ''
  const text = raw.slice(0, 500).replace(/['"\\`$!;|&<>()]/g, ' ').trim()
  if (!text) return res.status(400).json({ error: 'text required' })

  const id      = crypto.randomBytes(8).toString('hex')
  const wavPath = path.join(os.tmpdir(), `waanda_${id}.wav`)

  try {
    if (process.platform === 'darwin') {
      const aiffPath = path.join(os.tmpdir(), `waanda_${id}.aiff`)
      try {
        await new Promise<void>((resolve, reject) =>
          execFile('say', ['-v', 'Samantha', '-r', '155', '-o', aiffPath, text], e => e ? reject(e) : resolve())
        )
        await new Promise<void>((resolve, reject) =>
          execFile('afconvert', [aiffPath, wavPath, '-d', 'LEI16', '-f', 'WAVE'], e => e ? reject(e) : resolve())
        )
      } finally {
        fsPromises.unlink(aiffPath).catch(() => {})
      }
    } else {
      // Linux (Docker): espeak-ng writes WAV directly; +f3 = female British voice
      await new Promise<void>((resolve, reject) =>
        execFile('espeak-ng', ['-v', 'en-gb+f3', '-s', '150', '-w', wavPath, text], e => e ? reject(e) : resolve())
      )
    }
    res.setHeader('Content-Type', 'audio/wav')
    res.setHeader('Cache-Control', 'no-store')
    await streamPipeline(createReadStream(wavPath), res)
  } catch (err: any) {
    logger.error('[TTS] generation failed', err)
    if (!res.headersSent) res.status(500).json({ error: 'TTS failed' })
  } finally {
    fsPromises.unlink(wavPath).catch(() => {})
  }
})

// Health — unauthenticated, mirrors the eQORE health route style.
kangqoreImmpRoutes.get('/health', (_req, res) => {
  res.json({
    module: 'kangqore-immp',
    layer: 'human-behavior-intelligence',
    version: KIMMP_VERSION,
    status: KimmpFlags.enabled() ? 'OK' : 'DISABLED',
    tier2: KimmpFlags.tier2Enabled() ? 'ENABLED' : 'DISABLED',
    reasonerModel: KimmpFlags.reasonerModel(),
    persistence: KimmpFlags.persist() ? 'ENABLED' : 'DISABLED',
  });
});

// Behavior Intelligence — admin only.
kangqoreImmpRoutes.post(
  '/behavior/analyze',
  requireAuth,
  requireRole(['ADMIN']),
  BehaviorAnalysisController.analyze
);

kangqoreImmpRoutes.get(
  '/behavior/profiles/:id',
  requireAuth,
  requireRole(['ADMIN']),
  BehaviorAnalysisController.getProfile
);

// Shadow-mode review (PR 2.5) — recent observations of live eQORE traffic.
kangqoreImmpRoutes.get(
  '/shadow/observations',
  requireAuth,
  requireRole(['ADMIN']),
  BehaviorAnalysisController.listShadowObservations
);

// Shadow backfill (PR 2.6) — run KIMMP over existing eQORE conversation history.
kangqoreImmpRoutes.get(
  '/shadow/backfill',
  requireAuth,
  requireRole(['ADMIN']),
  BehaviorAnalysisController.backfill
);

// KIMMP → Lead Intelligence (Phase 2) — KIMMP's behavioral read of a lead.
kangqoreImmpRoutes.get(
  '/leads/:leadId/behavior',
  requireAuth,
  requireRole(['ADMIN']),
  BehaviorAnalysisController.leadBehavior
);

// KIMMP → ALIS (Phase 2) — market-level behavioral snapshot.
kangqoreImmpRoutes.get(
  '/market/behavior-signals',
  requireAuth,
  requireRole(['ADMIN']),
  BehaviorAnalysisController.marketSignals
);

// Signal Ledger (Phase 1) — the cross-system signal hub.
kangqoreImmpRoutes.post('/signals', requireAuth, requireRole(['ADMIN']), SignalLedgerController.ingest);
kangqoreImmpRoutes.get('/signals', requireAuth, requireRole(['ADMIN']), SignalLedgerController.query);

// WVIS Phase 3 — KPI live metric binding: aggregate signals into KPI-friendly metrics.
kangqoreImmpRoutes.get('/signals/kpi', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const signals = await prisma.kimmpSignal.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { signalType: true, signalCategory: true, confidence: true, severity: true, createdAt: true },
    })
    const byType: Record<string, number> = {}
    let totalConf = 0
    let criticalCount = 0
    signals.forEach(s => {
      const key = (s.signalType ?? '').toUpperCase() || s.signalCategory
      byType[key] = (byType[key] ?? 0) + 1
      totalConf += s.confidence ?? 0
      if (s.severity === 'CRITICAL') criticalCount++
    })
    const avgConfidence = signals.length ? Math.round((totalConf / signals.length) * 100) : 0
    const health = Math.min(98, Math.max(0, avgConfidence))
    const KPI_TYPES = ['FINANCIAL', 'RISK', 'STRATEGIC', 'OPERATIONAL', 'MARKET']
    const metrics = KPI_TYPES.map(t => ({
      label: t.charAt(0) + t.slice(1).toLowerCase(),
      current: byType[t] ?? 0,
      target:  8,
      unit:    'signals',
      trend:   (byType[t] ?? 0) >= 4 ? 'up' : (byType[t] ?? 0) >= 2 ? 'stable' : 'down',
    })).filter(m => m.current > 0)
    res.json({ health, avgConfidence, criticalCount, signalCount: signals.length, metrics })
  } catch {
    res.json({ health: 0, avgConfidence: 0, criticalCount: 0, signalCount: 0, metrics: [] })
  }
})

// Phase 2 — VIS → Signal Ledger: emit CONTENT signals from page opportunities.
kangqoreImmpRoutes.post('/signals/scan-vis', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const result = await VisSignalProducer.scanAndEmit();
    res.json({ ok: true, ...result });
  } catch (e: any) {
    res.status(500).json({ error: 'VIS signal scan failed', message: e.message });
  }
});

// Decision Engine (Phase 3) — proposes next-best actions from signals.
kangqoreImmpRoutes.post('/decisions/evaluate', requireAuth, requireRole(['ADMIN']), DecisionEngineController.evaluate);
kangqoreImmpRoutes.get('/decisions', requireAuth, requireRole(['ADMIN']), DecisionEngineController.list);
kangqoreImmpRoutes.patch('/decisions/:id', requireAuth, requireRole(['ADMIN']), DecisionEngineController.updateStatus);

// Phase 3 Workflow Executor — execute an APPROVED decision.
kangqoreImmpRoutes.post('/decisions/:id/execute', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const actorId: string = (req as any).user?.userId ?? 'UNKNOWN';
  try {
    const result = await WorkflowExecutor.execute(req.params.id, actorId);
    res.json(result);
  } catch (e: any) {
    const status = e.message?.includes('not found') ? 404
      : e.message?.includes('only APPROVED') ? 422
      : 500;
    res.status(status).json({ error: e.message });
  }
});

// Phase 4 — Governance endpoints (audit log, cost summary, permission matrix).
kangqoreImmpRoutes.get('/governance/audit', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 100;
    const entries = await KimmpAuditLog.query({ limit });
    res.json({ entries, count: (entries ?? []).length });
  } catch (e: any) {
    res.status(500).json({ error: 'Audit log unavailable', message: e.message });
  }
});

kangqoreImmpRoutes.get('/governance/cost', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const summary = await KimmpCostTracker.summary(days);
    if (!summary) return res.status(503).json({ error: 'Cost ledger unavailable — apply the Phase 4 migration.' });
    res.json({ summary, windowDays: days });
  } catch (e: any) {
    res.status(500).json({ error: 'Cost summary failed', message: e.message });
  }
});

kangqoreImmpRoutes.get('/governance/permissions', requireAuth, requireRole(['ADMIN']), (_req, res) => {
  const types = ['RESPONSE_POLICY', 'SALES_ALERT', 'CONTENT_OPPORTUNITY', 'MARKET_ALERT', 'HUMAN_HANDOFF'];
  res.json({ permissions: Object.fromEntries(types.map(t => [t, PermissionMatrix.ruleFor(t)])) });
});

// Phase 5 — Predictions: run or retrieve predictions for a lead.
kangqoreImmpRoutes.post('/predictions/run/:leadId', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const prediction = await KimmpPredictionService.predict(req.params.leadId);
    if (!prediction) return res.status(503).json({ error: 'Predictions disabled (KIMMP_PREDICTIONS_ENABLED=false) or lead not found.' });
    const id = await PredictionStore.save(prediction);
    res.json({ prediction, storedId: id });
  } catch (e: any) {
    res.status(500).json({ error: 'Prediction failed', message: e.message });
  }
});

kangqoreImmpRoutes.get('/predictions/:leadId', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const history = await PredictionStore.historyForLead(req.params.leadId);
    res.json({ predictions: history, count: history.length });
  } catch (e: any) {
    res.status(500).json({ error: 'Prediction history unavailable', message: e.message });
  }
});

// Phase 5 — RAG: test knowledge base retrieval for a query.
kangqoreImmpRoutes.get('/rag/query', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    if (!q.trim()) return res.status(400).json({ error: 'q query param required' });
    const result = await KimmpRag.query(q, 5);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: 'RAG query failed', message: e.message });
  }
});

// ─── Command Interface — natural language queries answered by Claude ───────────
kangqoreImmpRoutes.post('/command', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  if (!KimmpFlags.commandEnabled()) {
    return res.status(503).json({ error: 'KIMMP Command Interface is disabled (KIMMP_COMMAND_ENABLED=false).' });
  }

  const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
  if (!query) return res.status(400).json({ error: '`query` string is required.' });
  if (query.length > 500) return res.status(400).json({ error: '`query` must be under 500 characters.' });

  const moduleContext = typeof req.body?.moduleContext === 'string' ? req.body.moduleContext : undefined;
  const history: any[] = Array.isArray(req.body?.history) ? req.body.history.slice(0, 20) : [];
  const attachments: any[] = Array.isArray(req.body?.attachments) ? req.body.attachments.slice(0, 5) : [];
  const userId = (req as any).user?.id ?? undefined;

  try {
    const result = await KIMMMCommandService.run({ query, moduleContext, history, attachments, userId });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Command failed', message: err.message });
  }
});

// ─── Feedback — record operator rating on a KIMMP response ───────────────────
kangqoreImmpRoutes.post('/feedback', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { interactionId, feedback, correction } = req.body ?? {}
  if (!interactionId || !['ACCEPTED', 'DISMISSED', 'CORRECTED'].includes(feedback)) {
    return res.status(400).json({ error: 'interactionId and feedback (ACCEPTED|DISMISSED|CORRECTED) required' })
  }
  await KimmpMemoryService.recordFeedback(interactionId, feedback, correction)
  res.json({ ok: true })
})

// ─── Memory — return all stored KIMMP learned knowledge ──────────────────────
kangqoreImmpRoutes.get('/memory', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  const memories = await KimmpMemoryService.getAll()
  res.json({ memories })
})

// ─── Action Confirm — execute a queued pending action ────────────────────────
kangqoreImmpRoutes.post('/actions/confirm', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { actionId } = req.body ?? {}
  if (!actionId) return res.status(400).json({ error: 'actionId required' })
  const adminId = (req as any).user?.id ?? 'ADMIN'
  const result = await KimmpActionsService.confirm(actionId, adminId)
  res.json(result)
})

// ─── Action Propose — natural language → structured action ───────────────────
kangqoreImmpRoutes.post('/actions/propose', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const description = typeof req.body?.description === 'string' ? req.body.description.trim() : ''
  if (!description) return res.status(400).json({ error: '`description` string is required' })
  const context = typeof req.body?.context === 'string' ? req.body.context : undefined
  try {
    const outcome = await KimmpActionProposer.proposeFromDescription(description, context)
    res.json(outcome)
  } catch (err: any) {
    res.status(500).json({ error: 'Proposal failed', message: err.message })
  }
})

// ─── Action History — recently executed actions ───────────────────────────────
kangqoreImmpRoutes.get('/actions/history', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 20), 50)
  const history = await (prisma as any).kimmpApprovalRequest.findMany({
    where:   { status: { in: ['APPROVED','DENIED'] } },
    orderBy: { requestedAt: 'desc' },
    take:    limit,
    select:  { id:true, action:true, description:true, tool:true, level:true, status:true, requestedAt:true, reviewedAt:true, reviewedBy:true },
  }).catch(() => [])
  res.json({ history })
})

// ─── Authority — approval queue ───────────────────────────────────────────────
kangqoreImmpRoutes.get('/authority/approvals', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  const approvals = await KimmpAuthorityEngine.getPending()
  res.json({ approvals })
})

kangqoreImmpRoutes.post('/authority/approvals/:id/approve', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const adminId = (req as any).user?.id ?? 'ADMIN'
  const approved = await KimmpAuthorityEngine.approve(req.params.id, adminId)
  if (!approved) return res.status(404).json({ error: 'Approval request not found or already reviewed' })
  // Execute the action now that it's approved
  const result = await KimmpActionsService.execute(approved.action as any, approved.input?.params ?? {})
  res.json({ ok: true, result })
})

kangqoreImmpRoutes.post('/authority/approvals/:id/deny', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const adminId = (req as any).user?.id ?? 'ADMIN'
  await KimmpAuthorityEngine.deny(req.params.id, adminId)
  res.json({ ok: true })
})

// ─── Authority — agent registry ───────────────────────────────────────────────
kangqoreImmpRoutes.get('/authority/agents', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  const agents = await KimmpAuthorityEngine.getAllAgents()
  res.json({ agents })
})

kangqoreImmpRoutes.post('/authority/agents', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { name, role, description, maxLevel, tools, model, systemPrompt } = req.body ?? {}
  if (!name || !role) return res.status(400).json({ error: 'name and role required' })
  const agent = await KimmpAuthorityEngine.createAgent({ name, role, description, maxLevel, tools, model, systemPrompt })
  res.json({ agent })
})

kangqoreImmpRoutes.patch('/authority/agents/:id/level', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const level = Number(req.body?.level)
  if (isNaN(level) || level < 0 || level > 4) return res.status(400).json({ error: 'level must be 0-4' })
  const agent = await KimmpAuthorityEngine.setLevel(req.params.id, level)
  res.json({ agent })
})

kangqoreImmpRoutes.patch('/authority/agents/:id/suspend', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  await KimmpAuthorityEngine.suspend(req.params.id)
  res.json({ ok: true })
})

kangqoreImmpRoutes.patch('/authority/agents/:id/activate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  await KimmpAuthorityEngine.activate(req.params.id)
  res.json({ ok: true })
})

kangqoreImmpRoutes.delete('/authority/agents/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  await KimmpAuthorityEngine.kill(req.params.id)
  res.json({ ok: true })
})

// ─── Authority — tool registry ────────────────────────────────────────────────
kangqoreImmpRoutes.get('/authority/tools', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  const tools = await KimmpAuthorityEngine.getAllTools()
  res.json({ tools })
})

// ─── Workflows — list active workflows ───────────────────────────────────────
kangqoreImmpRoutes.get('/workflows', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const workflows = await (prisma as any).kimmpWorkflow.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    res.json({ workflows })
  } catch {
    res.json({ workflows: [] })
  }
})

// ─── KIMMP Workflow Generator — natural language → structured workflow ────────
// KIMMP parses a plain-English workflow description and returns a structured
// JSON workflow with trigger, steps, SLA, and risk score. This is the feature
// that makes ServiceNow irrelevant: describe in English, KIMMP builds it.

import { haiku as _wfHaiku, textOf as _wfTextOf } from './llm/kimmpLLMRouter'

const WF_SYSTEM = `You are KIMMP/WAANDA — Kangqore's workflow intelligence engine.
Parse natural-language workflow descriptions into structured JSON automation plans.

Return ONLY valid JSON (no markdown, no explanation) in this exact shape:
{
  "intent": "short intent label (3-6 words)",
  "triggerType": "event|schedule|kimmp|manual",
  "triggerEvent": "client.created|invoice.overdue|lead.cold|churn.risk|sla.breach|issue.raised|custom",
  "triggerFilter": "optional JS-style filter condition string",
  "triggerSchedule": "optional cron expression if schedule trigger",
  "steps": [
    {
      "id": "s1",
      "type": "action|condition|notification|delay|approval|integration",
      "label": "step label",
      "description": "what this step does",
      "sla": "optional SLA window like 24h",
      "config": {}
    }
  ],
  "estimatedDuration": "total estimated time like 48h",
  "riskScore": 0-100,
  "kimmpNote": "KIMMP's recommendation or risk note",
  "category": "sales|delivery|finance|hr|ops|marketing"
}`

kangqoreImmpRoutes.post('/workflows/generate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { description } = req.body ?? {}
  if (!description || typeof description !== 'string' || description.length < 10) {
    return res.status(400).json({ error: 'description required (min 10 chars)' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured — KIMMP workflow generation unavailable' })
  }

  try {
    const result = await _wfHaiku(WF_SYSTEM, `Design a workflow for: ${description.slice(0, 2000)}`, 1200, {
      agentSystem: 'KIMMP',
      agentType: 'workflow_generator',
      tags: ['workflow', 'nl-generate'],
    })
    const raw = _wfTextOf(result)

    let parsed: any
    try {
      const match = raw.match(/\{[\s\S]*\}/)
      parsed = match ? JSON.parse(match[0]) : null
    } catch {
      parsed = null
    }

    if (!parsed?.steps?.length) {
      return res.status(422).json({ error: 'Could not parse workflow from description. Please try rephrasing.' })
    }

    res.json({ workflow: parsed, raw })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Validation explain ───────────────────────────────────────────────────────
// Takes a single validation issue + node/workflow context, returns a plain-English
// explanation of why it's a problem and exactly how to fix it.
kangqoreImmpRoutes.post('/validation/explain', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { code, message, nodeType, nodeName, workflowName, stepCount } = req.body ?? {}
  if (!code || !message) return res.status(400).json({ error: 'code and message required' })

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }

  const system = `You are WAANDA, Kangqore's AI intelligence engine, acting as a senior workflow architect.
A user has opened a validation issue on their enterprise workflow canvas.
Respond with a short, practical explanation (3–5 sentences max) structured as:
1. WHY this matters at runtime or in production
2. WHAT breaks or fails silently without the fix
3. EXACTLY how to fix it — specific action on the canvas

Be concrete. Name real consequences. Do not use generic language.
Do not start with "I". Do not repeat the error code. Do not add headers.`

  const prompt = `Validation issue on workflow canvas:
Workflow: "${workflowName ?? 'unknown'}" (${stepCount ?? '?'} steps)
Affected node: "${nodeName ?? 'unknown'}" (type: ${nodeType ?? 'unknown'})
Issue code: ${code}
Issue message: ${message}

Explain this to the workflow designer.`

  try {
    const result = await _wfHaiku(system, prompt, 400, {
      agentSystem: 'KIMMP',
      agentType:   'validation_explainer',
      tags:        ['validation', 'explain'],
    })
    const explanation = _wfTextOf(result).trim()
    res.json({ explanation })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Compile Pipeline ─────────────────────────────────────────────────────────
// Stage 2 of the compile pipeline: policy check + version hash + memory record.
// Validate (Stage 1) runs client-side. Review (Stage 3) calls /workflows/review.
// Deploy (Stage 4) calls PATCH /os-workflows/:id.
kangqoreImmpRoutes.post('/workflows/compile', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { workflowId, workflowName, steps, canvasMode } = req.body ?? {}
  if (!steps?.length) return res.status(400).json({ error: 'steps required' })

  // 1. Version hash — deterministic SHA-256 of the step payload
  const payload     = JSON.stringify({ steps, canvasMode: canvasMode ?? 'workflow' })
  const versionHash = crypto.createHash('sha256').update(payload).digest('hex').slice(0, 12)

  // 2. Policy check — graceful if kimmp_policies table not yet migrated
  const policyViolations: Array<{ policyName: string; effect: string; reason: string }> = []
  try {
    const policies = await prisma.kimmpPolicy.findMany({ where: { enabled: true } })
    const stepTypes = (steps as Array<{ type: string }>).map(s => s.type)

    for (const p of policies) {
      const trigger = p.trigger as string
      const effect  = p.effect as string
      const matches = trigger === '*' || stepTypes.some(t =>
        t.toLowerCase().includes(trigger.toLowerCase()) || trigger.toLowerCase().includes(t.toLowerCase())
      )
      if (matches && (effect === 'DENY' || effect === 'REQUIRE_APPROVAL')) {
        policyViolations.push({ policyName: p.name, effect, reason: p.description ?? `Policy "${p.name}" applies to this workflow` })
      }
    }
  } catch { /* table may not exist yet — treat as 0 violations */ }

  // 3. Write compile record to KimmpMemory — graceful if table not migrated
  let memoryId: string | null = null
  try {
    const record = await prisma.kimmpMemory.create({
      data: {
        type:    'DECISION',
        content: JSON.stringify({
          event:             'WORKFLOW_COMPILED',
          workflowId:        workflowId ?? null,
          workflowName:      workflowName ?? 'unknown',
          versionHash,
          stepCount:         steps.length,
          canvasMode:        canvasMode ?? 'workflow',
          policyViolations:  policyViolations.length,
          compiledAt:        new Date().toISOString(),
        }),
        tags: ['compile', 'workflow', canvasMode ?? 'workflow'],
      },
    })
    memoryId = record.id
  } catch { /* no-op */ }

  const status = policyViolations.some(v => v.effect === 'DENY') ? 'policy_blocked' : 'compiled'

  res.json({
    versionHash,
    compiledAt:       new Date().toISOString(),
    stepCount:        steps.length,
    canvasMode:       canvasMode ?? 'workflow',
    policyViolations,
    status,
    memoryId,
  })
})

// ─── Intelligence Canvas — Decision node deep-explain ─────────────────────────
// Called when user clicks a Decision node in Intelligence mode.
// Returns structured strategic analysis: purpose, evidence, reasoning, confidence, alternatives.
kangqoreImmpRoutes.post('/workflows/explain-decision', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { nodeName, nodeType, workflowName, ancestors, descendants, stepCount } = req.body ?? {}
  if (!nodeName) return res.status(400).json({ error: 'nodeName required' })

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }

  const system = `You are WAANDA, Kangqore's strategic intelligence engine.
A user has clicked a "${nodeType ?? 'decision'}" node on the WAANDA Intelligence Canvas.
Return a JSON object with exactly these keys:
{
  "purpose": "1–2 sentences: what business objective this node serves",
  "reasoning": "2–3 sentences: the strategic logic and decision criteria",
  "confidence": <integer 0-100: how well this node is positioned in the workflow>,
  "evidence": ["list of 3–5 data types or signals this node should consider"],
  "alternatives": ["2–3 alternative approaches the designer could consider"],
  "policies": ["2–3 governance or compliance considerations"],
  "dependencies": <integer: number of upstream nodes>
}
Return ONLY the JSON object. No markdown, no prose, no code fences.`

  const upstreamNames  = (ancestors  as string[] | undefined)?.join(', ') || 'none'
  const downstreamNames = (descendants as string[] | undefined)?.join(', ') || 'none'

  const prompt = `Intelligence canvas node analysis request:
Workflow: "${workflowName ?? 'unknown'}" (${stepCount ?? '?'} nodes total)
Node: "${nodeName}" (type: ${nodeType ?? 'decision'})
Upstream nodes: ${upstreamNames}
Downstream nodes: ${downstreamNames}

Generate a strategic analysis for this node.`

  try {
    const raw    = _wfTextOf(await _wfHaiku(system, prompt, 600, {
      agentSystem: 'KIMMP', agentType: 'decision_explainer', tags: ['intelligence', 'decision'],
    })).trim()

    let parsed: Record<string, unknown>
    try {
      const jsonStart = raw.indexOf('{')
      const jsonEnd   = raw.lastIndexOf('}')
      parsed = JSON.parse(jsonStart >= 0 ? raw.slice(jsonStart, jsonEnd + 1) : raw)
    } catch {
      parsed = { purpose: raw, reasoning: '', confidence: 75, evidence: [], alternatives: [], policies: [], dependencies: (ancestors as string[] | undefined)?.length ?? 0 }
    }
    res.json(parsed)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Intelligence Canvas — AI Workflow Review ─────────────────────────────────
// Analyses the full workflow and returns structured critique + improvement suggestions.
kangqoreImmpRoutes.post('/workflows/review', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { workflowName, steps, validationIssues } = req.body ?? {}
  if (!steps?.length) return res.status(400).json({ error: 'steps required' })

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }

  const system = `You are WAANDA, Kangqore's AI intelligence engine, acting as an expert enterprise workflow architect.
Review the workflow and return a JSON object:
{
  "summary": "1–2 sentences: overall assessment",
  "riskBefore": "Low" | "Medium" | "High",
  "riskAfter": "Low" | "Medium" | "High",
  "estimatedTimeSaving": "e.g. 22%",
  "suggestions": [
    { "type": "optimization" | "risk" | "architecture" | "compliance", "text": "specific actionable suggestion" }
  ]
}
Return ONLY valid JSON. No markdown, no prose, no code fences.
Be specific: name actual steps, not generic advice. Max 5 suggestions.`

  const stepList = (steps as Array<{ name: string; type: string }>)
    .map((s, i) => `${i + 1}. [${s.type}] ${s.name}`)
    .join('\n')

  const issueList = (validationIssues as Array<{ code: string; message: string }> | undefined)
    ?.map(i => `• ${i.code}: ${i.message}`)
    .join('\n') || 'none'

  const prompt = `Workflow to review: "${workflowName ?? 'unknown'}"

Steps:
${stepList}

Validation issues already detected:
${issueList}

Provide your structured review.`

  try {
    const raw = _wfTextOf(await _wfHaiku(system, prompt, 700, {
      agentSystem: 'KIMMP', agentType: 'workflow_reviewer', tags: ['review', 'intelligence'],
    })).trim()

    let parsed: Record<string, unknown>
    try {
      const jsonStart = raw.indexOf('{')
      const jsonEnd   = raw.lastIndexOf('}')
      parsed = JSON.parse(jsonStart >= 0 ? raw.slice(jsonStart, jsonEnd + 1) : raw)
    } catch {
      parsed = { summary: raw, riskBefore: 'Medium', riskAfter: 'Medium', estimatedTimeSaving: 'unknown', suggestions: [] }
    }
    res.json(parsed)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Scout — external intelligence ───────────────────────────────────────────
kangqoreImmpRoutes.get('/scout/sources', requireAuth, requireRole(['ADMIN']), (_req, res) => {
  res.json({ sources: SCOUT_SOURCES.map(s => ({
    name:           s.name,
    signalType:     s.signalType,
    signalCategory: s.signalCategory,
    cadenceMinutes: s.cadenceMinutes,
    queryCount:     s.queries.length,
  })) })
})

kangqoreImmpRoutes.post('/scout/run', requireAuth, requireRole(['ADMIN']), (_req, res) => {
  KimmpScoutService.runAll().catch(() => {})
  res.json({ ok: true, message: 'Full Scout scan triggered — signals will appear in the ledger shortly' })
})

kangqoreImmpRoutes.post('/scout/run/:source', requireAuth, requireRole(['ADMIN']), (req, res) => {
  const slug   = req.params.source.toLowerCase()
  const source = SCOUT_SOURCES.find(s => s.name.toLowerCase().replace(/\s+/g, '-') === slug)
  if (!source) return res.status(404).json({ error: 'Source not found' })
  KimmpScoutService.runSource(source).catch(() => {})
  res.json({ ok: true, message: `Scout scan triggered: ${source.name}` })
})

kangqoreImmpRoutes.get('/scout/jobs', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  const jobs = await KimmpScoutService.getRecentJobs(30)
  res.json({ jobs })
})

// ─── Correlation — cross-signal pattern detection ─────────────────────────────
kangqoreImmpRoutes.post('/correlation/analyze', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const windowHours = Math.min(Number(req.body?.windowHours ?? 24), 168)
  const patterns    = await KimmpCorrelationEngine.analyze(windowHours)
  res.json({ patterns })
})

// ─── Proactive Intelligence ───────────────────────────────────────────────────
kangqoreImmpRoutes.get('/proactive/alerts', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  const alerts = await KimmpProactiveEngine.getActiveAlerts()
  res.json({ alerts })
})

kangqoreImmpRoutes.post('/proactive/alerts/:id/dismiss', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  await KimmpProactiveEngine.dismiss(req.params.id)
  res.json({ ok: true })
})

kangqoreImmpRoutes.post('/proactive/alerts/dismiss-all', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  await KimmpProactiveEngine.dismissAll()
  res.json({ ok: true })
})

kangqoreImmpRoutes.post('/proactive/scan', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  KimmpProactiveEngine.scan().catch(() => {})
  res.json({ ok: true, message: 'Proactive scan triggered' })
})

// ─── Goal Engine ──────────────────────────────────────────────────────────────
kangqoreImmpRoutes.post('/goals', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { objective, deadline } = req.body ?? {}
  if (!objective || typeof objective !== 'string') {
    return res.status(400).json({ error: '`objective` string is required' })
  }
  const userId = (req as any).user?.id ?? undefined
  try {
    const goal = await KimmpGoalEngine.create(objective.trim().slice(0, 500), deadline, userId)
    res.json(goal)
  } catch (err: any) {
    res.status(500).json({ error: 'Goal creation failed', message: err.message })
  }
})

kangqoreImmpRoutes.get('/goals', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 20), 50)
  const goals = await KimmpGoalEngine.list(limit)
  res.json({ goals })
})

kangqoreImmpRoutes.get('/goals/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const goal = await KimmpGoalEngine.getById(req.params.id)
  if (!goal) return res.status(404).json({ error: 'Not found' })
  res.json(goal)
})

kangqoreImmpRoutes.post('/goals/:id/approve', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const adminId = (req as any).user?.id ?? 'ADMIN'
  try {
    const goal = await KimmpGoalEngine.approve(req.params.id, adminId)
    res.json(goal)
  } catch (err: any) {
    res.status(500).json({ error: 'Approval failed', message: err.message })
  }
})

kangqoreImmpRoutes.post('/goals/:id/cancel', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  await KimmpGoalEngine.cancel(req.params.id)
  res.json({ ok: true })
})

kangqoreImmpRoutes.post('/goals/:id/tasks/:taskId/complete', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const result = typeof req.body?.result === 'string' ? req.body.result : undefined
  try {
    const goal = await KimmpGoalEngine.completeTask(req.params.id, req.params.taskId, result)
    res.json(goal)
  } catch (err: any) {
    res.status(500).json({ error: 'Task completion failed', message: err.message })
  }
})

kangqoreImmpRoutes.get('/leverage', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  const score = await KimmpGoalEngine.getLeverageScore()
  res.json(score)
})

// ─── Research Agent — active competitive intelligence ─────────────────────────
kangqoreImmpRoutes.post('/research/query', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : ''
  if (!question) return res.status(400).json({ error: '`question` string is required' })
  if (question.length > 500) return res.status(400).json({ error: '`question` must be under 500 characters' })
  const domain = typeof req.body?.domain === 'string' ? req.body.domain.trim() || undefined : undefined
  try {
    const result = await KimmpResearchService.query(question, domain)
    res.json(result)
  } catch (err: any) {
    res.status(500).json({ error: 'Research failed', message: err.message })
  }
})

kangqoreImmpRoutes.get('/research/results', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 10), 50)
  const results = await KimmpResearchService.list(limit)
  res.json({ results })
})

kangqoreImmpRoutes.get('/research/results/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const result = await KimmpResearchService.getById(req.params.id)
  if (!result) return res.status(404).json({ error: 'Not found' })
  res.json(result)
})

// ─── Report Engine ────────────────────────────────────────────────────────────
const VALID_REPORT_TYPES: ReportType[] = ['DAILY_BRIEFING', 'WEEKLY_EXECUTIVE', 'MONTHLY_BOARD', 'SALES_PIPELINE']

kangqoreImmpRoutes.post('/reports/generate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const type = req.body?.type as ReportType
  if (!VALID_REPORT_TYPES.includes(type)) {
    return res.status(400).json({ error: `type must be one of: ${VALID_REPORT_TYPES.join(', ')}` })
  }
  const userId = (req as any).user?.id ?? undefined
  try {
    const report = await KimmpReportService.generate(type, userId)
    res.json(report)
  } catch (err: any) {
    res.status(500).json({ error: 'Report generation failed', message: err.message })
  }
})

kangqoreImmpRoutes.get('/reports', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 20), 50)
  const reports = await KimmpReportService.list(limit)
  res.json({ reports })
})

kangqoreImmpRoutes.get('/reports/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const report = await KimmpReportService.getById(req.params.id)
  if (!report) return res.status(404).json({ error: 'Not found' })
  res.json(report)
})

// ─── Digital Twin ─────────────────────────────────────────────────────────────
kangqoreImmpRoutes.get('/twin/current', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  let snapshot = await KimmpDigitalTwin.current()
  if (!snapshot) {
    // No snapshot yet — compute one now
    snapshot = await KimmpDigitalTwin.compute()
  }
  res.json(snapshot)
})

kangqoreImmpRoutes.get('/twin/history', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 48), 96)
  const history = await KimmpDigitalTwin.history(limit)
  res.json({ history })
})

kangqoreImmpRoutes.post('/twin/compute', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  const snapshot = await KimmpDigitalTwin.compute()
  res.json(snapshot)
})

// ─── Multi-Agent Orchestration ────────────────────────────────────────────────
kangqoreImmpRoutes.post('/orchestrate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : ''
  if (!question) return res.status(400).json({ error: '`question` string is required' })
  if (question.length > 600) return res.status(400).json({ error: '`question` must be under 600 characters' })
  const userId = (req as any).user?.id ?? undefined
  try {
    const result = await KimmpOrchestrator.run(question, userId)
    res.json(result)
  } catch (err: any) {
    res.status(500).json({ error: 'Orchestration failed', message: err.message })
  }
})

kangqoreImmpRoutes.get('/orchestrate/history', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 50), 100)
  const history = await KimmpOrchestrator.list(limit)
  res.json({ history })
})

kangqoreImmpRoutes.get('/orchestrate/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const record = await KimmpOrchestrator.get(req.params.id)
  if (!record) return res.status(404).json({ error: 'Not found' })
  res.json(record)
})

// ─── System Learning — reinforcement from operator feedback ───────────────────

// Rate a system briefing: ACCEPTED | DISMISSED | CORRECTED
// This is how systems learn — every rating shapes future agent selection.
kangqoreImmpRoutes.post('/systems/dispatch/:id/feedback', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { feedback, correction } = req.body ?? {}
  if (!['ACCEPTED','DISMISSED','CORRECTED'].includes(feedback)) {
    return res.status(400).json({ error: 'feedback must be ACCEPTED | DISMISSED | CORRECTED' })
  }
  if (feedback === 'CORRECTED' && !correction) {
    return res.status(400).json({ error: 'correction text is required when feedback is CORRECTED' })
  }
  const result = await SystemLearning.recordFeedback({
    dispatchId: req.params.id,
    feedback,
    correction: correction ?? undefined,
  })
  if (!result.ok) return res.status(404).json({ error: 'Dispatch record not found — cannot record feedback' })
  if (feedback === 'ACCEPTED') invalidatePulseCache()
  res.json({ ok: true, memoryId: result.memoryId })
})

// Learning summary — how much has each system learned?
kangqoreImmpRoutes.get('/systems/learning/summary', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  const summary = await SystemLearning.registrySummary()
  res.json({ summary, governedBy: 'KIMMP/WAANDA' })
})

// Per-system learning detail
kangqoreImmpRoutes.get('/systems/:system/learning', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const system = req.params.system.toUpperCase() as SystemType
  if (!VALID_SYSTEMS.includes(system)) {
    return res.status(400).json({ error: `System must be one of: ${VALID_SYSTEMS.join(', ')}` })
  }
  const summary = await SystemLearning.systemSummary(system)
  res.json({ system, ...summary })
})

// ─── System RAG — per-system knowledge base (EQORE, LEAD_INTEL, ALIS, VIS, SENTINEL, KIMMP) ──

// Index state: how many docs are loaded per system
kangqoreImmpRoutes.get('/rag/status', requireAuth, requireRole(['ADMIN']), (_req, res) => {
  res.json({
    indexState:    SystemRAG.indexState(),
    systems:       RAG_SYSTEMS,
    docTypesBySys: SYSTEM_DOC_TYPES,
    embeddingNote: 'Voyage voyage-3-large (1024-dim). Requires VOYAGE_API_KEY to embed; documents stored regardless and will be embedded on next ingest if key added.',
  })
})

// Ingest a document into a system's knowledge base
kangqoreImmpRoutes.post('/rag/:system/ingest', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const system = req.params.system.toUpperCase() as RAGSystem
  if (!RAG_SYSTEMS.includes(system)) {
    return res.status(400).json({ error: `system must be one of: ${RAG_SYSTEMS.join(', ')}` })
  }
  const { docType, title, body, source, tags } = req.body ?? {}
  if (!docType || !title || !body) {
    return res.status(400).json({ error: 'docType, title, and body are required' })
  }
  const result = await SystemRAG.ingest({ system, docType, title, body, source, tags })
  res.status(result.ok ? 201 : 500).json(result)
})

// List documents for a system
kangqoreImmpRoutes.get('/rag/:system', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const system = req.params.system.toUpperCase() as RAGSystem
  if (!RAG_SYSTEMS.includes(system)) {
    return res.status(400).json({ error: `system must be one of: ${RAG_SYSTEMS.join(', ')}` })
  }
  const limit   = Math.min(Number(req.query.limit ?? 50), 200)
  const docType = req.query.docType as string | undefined
  const docs    = await SystemRAG.list(system, limit, docType)
  res.json({
    system,
    count:    docs.length,
    docTypes: SYSTEM_DOC_TYPES[system],
    docs,
  })
})

// Test retrieval — query a system's knowledge base
kangqoreImmpRoutes.post('/rag/:system/retrieve', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const system = req.params.system.toUpperCase() as RAGSystem
  if (!RAG_SYSTEMS.includes(system)) {
    return res.status(400).json({ error: `system must be one of: ${RAG_SYSTEMS.join(', ')}` })
  }
  const { query, topK = 5 } = req.body ?? {}
  if (!query) return res.status(400).json({ error: 'query is required' })
  const chunks  = await SystemRAG.retrieve(system, query, Math.min(Number(topK), 10))
  const block   = SystemRAG.formatRAGBlock(system, chunks)
  res.json({ system, query, chunkCount: chunks.length, chunks, promptBlock: block })
})

// Soft-delete a document from a system's knowledge base
kangqoreImmpRoutes.delete('/rag/doc/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const result = await SystemRAG.delete(req.params.id)
  res.status(result.ok ? 200 : 404).json(result)
})

// Page Factory (PR-A1) — generated-page store + lifecycle API.
kangqoreImmpRoutes.use('/page-factory', pageFactoryRoutes);

// ─── Agent Registry & System Dispatch — governed by KIMMP/WAANDA ─────────────
// All 35 agents permanently assigned to 5 systems. KIMMP governs all.

const VALID_SYSTEMS: SystemType[] = ['EQORE', 'LEAD_INTEL', 'ALIS', 'VIS', 'SENTINEL']

kangqoreImmpRoutes.get('/systems/status', requireAuth, requireRole(['ADMIN']), (_req, res) => {
  res.json(KimmpSystemDispatcher.registryStatus())
})

kangqoreImmpRoutes.get('/systems/history', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 20), 50)
  const history = await KimmpSystemDispatcher.history(limit)
  res.json({ history })
})

kangqoreImmpRoutes.get('/systems/:system', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const system = req.params.system.toUpperCase() as SystemType
  if (!VALID_SYSTEMS.includes(system)) {
    return res.status(400).json({ error: `System must be one of: ${VALID_SYSTEMS.join(', ')}` })
  }
  const record = req.query.id
    ? await KimmpSystemDispatcher.get(req.query.id as string)
    : null
  res.json({
    system,
    agents: SYSTEM_AGENTS[system],
    agentCount: SYSTEM_AGENTS[system].length,
    ...(record ? { lastRun: record } : {}),
  })
})

kangqoreImmpRoutes.post('/systems/:system/run', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const system = req.params.system.toUpperCase() as SystemType
  if (!VALID_SYSTEMS.includes(system)) {
    return res.status(400).json({ error: `System must be one of: ${VALID_SYSTEMS.join(', ')}` })
  }
  const trigger   = typeof req.body?.trigger   === 'string' ? req.body.trigger   : 'manual'
  const input     = typeof req.body?.input     === 'string' ? req.body.input     : undefined
  const userId    = (req as any).user?.id ?? undefined
  try {
    const briefing = await KimmpSystemDispatcher.run(system, { trigger, input, userId })
    res.json(briefing)
  } catch (err: any) {
    res.status(500).json({ error: `System dispatch failed`, message: err.message })
  }
})

// ─── LOOPS — Cross-system cascade: LEAD_INTEL → ALIS → EQORE → VIS ──────────
// SENTINEL runs in background after every LOOP. KIMMP synthesises all outputs.

kangqoreImmpRoutes.post('/loops/trigger', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const input  = typeof req.body?.input  === 'string' ? req.body.input  : undefined
  const userId = (req as any).user?.id ?? undefined
  // Fire in background — LOOPS cascade takes time
  res.json({ ok: true, message: 'LOOPS cascade initiated — LEAD_INTEL → ALIS → EQORE → VIS → KIMMP synthesis. Results available in /systems/history shortly.' })
  KimmpSystemDispatcher.triggerLoop({ trigger: 'loops.manual', input, userId }).catch(err => {
    logger.error('[KIMMP:LOOPS] Cascade error:', err)
  })
})

kangqoreImmpRoutes.post('/loops/trigger/sync', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const input  = typeof req.body?.input  === 'string' ? req.body.input  : undefined
  const userId = (req as any).user?.id ?? undefined
  try {
    const result = await KimmpSystemDispatcher.triggerLoop({ trigger: 'loops.manual', input, userId })
    res.json(result)
  } catch (err: any) {
    res.status(500).json({ error: 'LOOPS cascade failed', message: err.message })
  }
})

// ─── Scenario Playground — direct SIMULATION_ENGINE endpoint ─────────────────
// Called by WAANDA command bar when query matches /^what\s+if\b/i or /\bscenario\b/i.
// Returns structured twin score deltas for the arc delta overlay.
kangqoreImmpRoutes.post('/simulate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const scenario = typeof req.body?.scenario === 'string' ? req.body.scenario.trim() : ''
  if (!scenario) return res.status(400).json({ error: '`scenario` string is required' })
  if (scenario.length > 600) return res.status(400).json({ error: '`scenario` must be under 600 characters' })
  try {
    const { output } = await runSimulationEngine({ scenario, variables: req.body?.variables ?? {} })
    const liveTwin = await KimmpDigitalTwin.current().catch(() => null)
    const baseline = {
      revenueHealth:     liveTwin?.revenueHealth     ?? 50,
      pipelineVelocity:  liveTwin?.pipelineVelocity  ?? 50,
      executionCapacity: liveTwin?.executionCapacity ?? 50,
      riskExposure:      liveTwin?.riskExposure      ?? 50,
      marketPosition:    liveTwin?.marketPosition    ?? 50,
    }
    const raw = parseAdjustedScores(output)
    const delta = {
      revenueHealth:     raw?.revenueHealth     != null ? raw.revenueHealth     - baseline.revenueHealth     : 0,
      pipelineVelocity:  raw?.pipelineVelocity  != null ? raw.pipelineVelocity  - baseline.pipelineVelocity  : 0,
      executionCapacity: raw?.executionCapacity != null ? raw.executionCapacity - baseline.executionCapacity : 0,
      riskExposure:      raw?.riskExposure      != null ? raw.riskExposure      - baseline.riskExposure      : 0,
      marketPosition:    raw?.marketPosition    != null ? raw.marketPosition    - baseline.marketPosition    : 0,
    }
    res.json({ narrative: output, delta, scenario, generatedAt: new Date().toISOString() })
  } catch (err: any) {
    res.status(500).json({ error: 'Simulation failed', message: err.message })
  }
})

// ─── WAANDA Event Log ─────────────────────────────────────────────────────────

kangqoreImmpRoutes.post('/events', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id, type, title, value, sub, color, ts, announced, raw } = req.body ?? {}
    if (!type || !title || !color || ts == null) return res.status(400).json({ error: 'Missing required fields' })
    await prisma.waandaEvent.upsert({
      where:  { id: String(id ?? '') },
      update: {},
      create: { id: String(id), type: String(type), title: String(title), value: value != null ? String(value) : null, sub: sub != null ? String(sub) : null, color: String(color), ts: BigInt(Math.round(Number(ts))), announced: Boolean(announced), raw: raw ?? null },
    })
    res.json({ ok: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

kangqoreImmpRoutes.get('/events', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit  = Math.min(Number(req.query.limit  ?? 500), 2000)
    const type   = req.query.type ? String(req.query.type) : undefined
    const search = req.query.search ? String(req.query.search) : undefined
    const events = await prisma.waandaEvent.findMany({
      where: {
        ...(type   ? { type }                                                             : {}),
        ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { value: { contains: search, mode: 'insensitive' } }, { sub: { contains: search, mode: 'insensitive' } }] } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    // BigInt ts → number for JSON serialisation
    res.json({ events: events.map(e => ({ ...e, ts: Number(e.ts) })) })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ─── KIMMP Self-Growth / Learning Corpus ─────────────────────────────────────

import {
  getStats, runLearningCycle, exportJSONL,
} from './learning/kimmpLearning.service'
import { getRouterStats } from './llm/kimmpLLMRouter'

// GET /admin/kangqore-immp/learning/stats
kangqoreImmpRoutes.get('/learning/stats', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const stats = await getStats()
    res.json(stats)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// POST /admin/kangqore-immp/learning/run
kangqoreImmpRoutes.post('/learning/run', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    runLearningCycle('manual').catch(() => {})
    res.json({ ok: true, message: 'Learning cycle triggered' })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// GET /admin/kangqore-immp/learning/examples?limit=50&source=&approved=&system=
kangqoreImmpRoutes.get('/learning/examples', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit    = Math.min(Number(req.query.limit ?? 50), 500)
    const source   = req.query.source !== undefined   ? String(req.query.source)   : undefined
    const approved = req.query.approved !== undefined ? req.query.approved === 'true' : undefined
    const system   = req.query.system !== undefined   ? String(req.query.system)   : undefined
    const examples = await (prisma as any).kimmpLearningExample.findMany({
      where: {
        ...(source   ? { source }                        : {}),
        ...(approved !== undefined ? { approved }        : {}),
        ...(system   ? { agentSystem: system }           : {}),
      },
      orderBy: [{ quality: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      select: {
        id: true, source: true, userMessage: true, idealResponse: true,
        quality: true, approved: true, agentSystem: true, agentType: true, tags: true, createdAt: true,
      },
    })
    res.json({ examples })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /admin/kangqore-immp/learning/examples/:id/approve
kangqoreImmpRoutes.patch('/learning/examples/:id/approve', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    await (prisma as any).kimmpLearningExample.update({
      where: { id: req.params.id },
      data: { approved: true, quality: 1.0 },
    })
    res.json({ ok: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// GET /admin/kangqore-immp/learning/export  — downloads JSONL
kangqoreImmpRoutes.get('/learning/export', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const jsonl = await exportJSONL()
    res.setHeader('Content-Type', 'text/plain')
    res.setHeader('Content-Disposition', 'attachment; filename="kimmp-training-corpus.jsonl"')
    res.send(jsonl)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// GET /admin/kangqore-immp/learning/runs  — cycle history
kangqoreImmpRoutes.get('/learning/runs', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const runs = await (prisma as any).kimmpLearningRun.findMany({
      orderBy: { startedAt: 'desc' },
      take: 20,
    })
    res.json({ runs })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// GET /admin/kangqore-immp/learning/router/stats  — LLM router autonomy progress
kangqoreImmpRoutes.get('/learning/router/stats', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const stats = await getRouterStats()
    res.json(stats)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ─── Strategic Decisions ──────────────────────────────────────────────────────
import {
  runStrategicDecision, listStrategicDecisions, getStrategicDecision,
  selectDecisionOption, recordDecisionOutcome, isStrategicDecision,
} from './services/kimmpStrategicDecision.service'
import { listPolicies, createPolicy, updatePolicy, deletePolicy, checkPolicy, seedDefaultPolicies } from '../services/policyEngine.service'
import { runSimulation } from './services/kimmpSimulator.service'

kangqoreImmpRoutes.post('/decisions', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { question, options, simulationType, simulationParams } = req.body
    if (!question?.trim()) return res.status(400).json({ error: 'question required' })
    const userId = (req as any).user?.userId
    const result = await runStrategicDecision(question, userId, options, simulationType, simulationParams)
    res.json(result)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.get('/decisions', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20
    const items = await listStrategicDecisions(limit)
    res.json({ items })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.get('/decisions/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const d = await getStrategicDecision(req.params.id)
    if (!d) return res.status(404).json({ error: 'Not found' })
    res.json(d)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.post('/decisions/:id/select', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const adminId = (req as any).user?.userId
    const { label } = req.body
    if (!label) return res.status(400).json({ error: 'label required' })
    await selectDecisionOption(req.params.id, label, adminId)
    res.json({ ok: true })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.post('/decisions/:id/outcome', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { outcome } = req.body
    if (!outcome) return res.status(400).json({ error: 'outcome required' })
    await recordDecisionOutcome(req.params.id, outcome)
    res.json({ ok: true })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.post('/decisions/detect', requireAuth, requireRole(['ADMIN']), (req, res) => {
  const { question } = req.body
  res.json({ isDecision: isStrategicDecision(question ?? '') })
})

// ─── Policy Engine ────────────────────────────────────────────────────────────

kangqoreImmpRoutes.get('/policies', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    await seedDefaultPolicies()
    res.json({ items: await listPolicies() })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.post('/policies', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const p = await createPolicy(req.body)
    res.status(201).json(p)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.patch('/policies/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const p = await updatePolicy(req.params.id, req.body)
    res.json(p)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.delete('/policies/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    await deletePolicy(req.params.id)
    res.json({ ok: true })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.post('/policies/check', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const result = await checkPolicy(req.body)
    res.json(result)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── Simulation ───────────────────────────────────────────────────────────────

kangqoreImmpRoutes.post('/simulate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { type, params } = req.body
    if (!type) return res.status(400).json({ error: 'type required' })
    const result = await runSimulation(type, params ?? {})
    res.json(result)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── WAOE — WAANDA Autonomous Operations Engine ───────────────────────────────

import { WAOE } from './waoe/waoe.service'
import { getMissionControlData } from './waoe/missionControl.service'
import { WIR } from './wir/wir.service'
import { PromptRegistry } from './wir/promptRegistry.service'
import { EvaluationFramework } from './wir/evaluationFramework.service'
import { CostIntelligence } from './wir/costIntelligence.service'
import { AIModelRegistry } from './wir/modelRegistry.service'

// Mission Control
kangqoreImmpRoutes.get('/waoe/mission-control', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const data = await getMissionControlData(userId)
    res.json(data)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// Status
kangqoreImmpRoutes.get('/waoe/status', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try { res.json(await WAOE.status()) }
  catch (e: any) { res.status(500).json({ error: e.message }) }
})

// Run WAOE for a goal (plan → compile → execute)
kangqoreImmpRoutes.post('/waoe/run', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const { goal, goalId, coordinateAgents } = req.body
    if (!goal) return res.status(400).json({ error: 'goal required' })
    const result = await WAOE.run({ goal, userId, goalId, coordinateAgents })
    res.status(result.ok ? 200 : 207).json(result)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// Evaluate a single goal
kangqoreImmpRoutes.post('/waoe/goals/:goalId/evaluate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const result = await WAOE.evaluateGoal(req.params.goalId, userId)
    res.json(result)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// Run a full goal evaluation cycle
kangqoreImmpRoutes.post('/waoe/goals/cycle', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const results = await WAOE.runGoalCycle(userId)
    res.json({ results })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// Goal evaluation history
kangqoreImmpRoutes.get('/waoe/goals/:goalId/evaluations', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20
    res.json({ items: await WAOE.getGoalEvaluations(req.params.goalId, limit) })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// List workflows
kangqoreImmpRoutes.get('/waoe/workflows', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20
    res.json({ items: await WAOE.listWorkflows(limit) })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// Get workflow detail
kangqoreImmpRoutes.get('/waoe/workflows/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const wf = await WAOE.getWorkflow(req.params.id)
    if (!wf) return res.status(404).json({ error: 'Not found' })
    res.json(wf)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// List all runs (optionally filtered by workflow)
kangqoreImmpRoutes.get('/waoe/runs', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit      = parseInt(req.query.limit as string) || 20
    const workflowId = req.query.workflowId as string | undefined
    res.json({ items: await WAOE.listRuns(workflowId, limit) })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// Get run detail + trace
kangqoreImmpRoutes.get('/waoe/runs/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const run = await WAOE.getRun(req.params.id)
    if (!run) return res.status(404).json({ error: 'Not found' })
    res.json(run)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// Approve and resume a paused run
kangqoreImmpRoutes.post('/waoe/runs/:id/approve', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const { note } = req.body
    const result = await WAOE.approveAndResume(req.params.id, userId, note)
    res.json(result)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// Reject a paused run
kangqoreImmpRoutes.post('/waoe/runs/:id/reject', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const { reason } = req.body
    if (!reason) return res.status(400).json({ error: 'reason required' })
    await WAOE.rejectRun(req.params.id, userId, reason)
    res.json({ ok: true })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// Add comment to a run
kangqoreImmpRoutes.post('/waoe/runs/:id/comments', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.userId
    const { content, type } = req.body
    if (!content) return res.status(400).json({ error: 'content required' })
    const comment = await WAOE.addComment(req.params.id, userId, content, type)
    res.status(201).json(comment)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// Workflow memory / lessons
kangqoreImmpRoutes.get('/waoe/lessons', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    res.json({ items: await WAOE.getRecentLessons(limit) })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── WIR — WAANDA Intelligence Runtime (Track E) ─────────────────────────────

// E6: AI Governance Dashboard
kangqoreImmpRoutes.get('/wir/dashboard', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try { res.json(await WIR.dashboard()) }
  catch (e: any) { res.status(500).json({ error: e.message }) }
})

// E1: Model Registry
kangqoreImmpRoutes.get('/wir/models', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try { res.json({ models: AIModelRegistry.list(), health: AIModelRegistry.health() }) }
  catch (e: any) { res.status(500).json({ error: e.message }) }
})

// E2: Prompt Registry — list
kangqoreImmpRoutes.get('/wir/prompts', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try { res.json({ prompts: await PromptRegistry.list(), names: await PromptRegistry.listNames() }) }
  catch (e: any) { res.status(500).json({ error: e.message }) }
})

// E2: Prompt Registry — get single
kangqoreImmpRoutes.get('/wir/prompts/:name', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const version = req.query.version ? parseInt(req.query.version as string) : undefined
    const content = await PromptRegistry.get(req.params.name, version)
    if (!content) return res.status(404).json({ error: 'Prompt not found' })
    res.json({ name: req.params.name, version, content })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// E2: Create new prompt version
kangqoreImmpRoutes.post('/wir/prompts/:name', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId  = (req as any).user?.userId
    const { content, notes } = req.body
    if (!content) return res.status(400).json({ error: 'content required' })
    const prompt = await PromptRegistry.create(req.params.name, content, notes, userId)
    res.status(201).json(prompt)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// E2: Rollback prompt to version
kangqoreImmpRoutes.post('/wir/prompts/:name/rollback', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { version } = req.body
    if (!version) return res.status(400).json({ error: 'version required' })
    await PromptRegistry.rollback(req.params.name, version)
    res.json({ ok: true, name: req.params.name, version })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// E3: Cost intelligence
kangqoreImmpRoutes.get('/wir/costs', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30
    res.json(await CostIntelligence.summary(days))
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// E4: Evaluations — list
kangqoreImmpRoutes.get('/wir/evaluations', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    res.json({ items: await EvaluationFramework.list(undefined, limit) })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// E4: Score a decision
kangqoreImmpRoutes.post('/wir/evaluations/decision/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const scores = await EvaluationFramework.scoreDecision(req.params.id)
    if (!scores) return res.status(404).json({ error: 'Decision not found or could not be scored' })
    res.json(scores)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// E4: Score a workflow
kangqoreImmpRoutes.post('/wir/evaluations/workflow/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const scores = await EvaluationFramework.scoreWorkflow(req.params.id)
    if (!scores) return res.status(404).json({ error: 'Workflow run not found' })
    res.json(scores)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// E4: Agent quality aggregates
kangqoreImmpRoutes.get('/wir/evaluations/quality', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const days = parseInt(req.query.days as string) || 30
    res.json({ quality: await EvaluationFramework.agentQuality(days) })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── KIMMP Swarm (Agent Registry) ──────────────────────────────────────────────
import { SwarmActivityEngine } from './orchestrator/swarmActivity.engine';

kangqoreImmpRoutes.get('/swarm', requireAuth, requireRole(['ADMIN']), (_req, res) => {
  const topology = SwarmManager.getTopology();
  res.json({ agents: topology });
});

kangqoreImmpRoutes.post('/swarm/spawn', requireAuth, requireRole(['ADMIN']), (req, res: any) => {
  const { id, name, role } = req.body ?? {};
  if (!id || !name || !role) return res.status(400).json({ error: 'id, name, and role required' });
  SwarmManager.spawnAgent(id, name, role);
  SwarmActivityEngine.registerAgent(id, role); // register with live activity engine
  res.json({ ok: true, message: `Spawned ${name}` });
});

// Returns agents with live taskProgress and completedTasks attached
kangqoreImmpRoutes.get('/swarm/enriched', requireAuth, requireRole(['ADMIN']), (_req, res) => {
  res.json({ agents: SwarmActivityEngine.getEnrichedTopology() });
});

export { kangqoreImmpRoutes };
