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
import { SystemRAG, RAGSystem, RAG_SYSTEMS, SYSTEM_DOC_TYPES } from './agents/systemRAG';
import { prisma } from '../lib/prisma';

const kangqoreImmpRoutes = Router();

// ── TTS — macOS native voice, served as WAV ──────────────────────────────────
// Uses `say` (macOS built-in) → AIFF, then `afconvert` → WAV (Chrome-compatible).
// Bypasses the browser's broken speechSynthesis API entirely.
kangqoreImmpRoutes.get('/tts', async (req, res) => {
  const raw  = typeof req.query.text === 'string' ? req.query.text : ''
  const text = raw.slice(0, 500).replace(/['"\\`$!;|&<>()]/g, ' ').trim()
  if (!text) return res.status(400).json({ error: 'text required' })

  const id       = crypto.randomBytes(8).toString('hex')
  const aiffPath = path.join(os.tmpdir(), `waanda_${id}.aiff`)
  const wavPath  = path.join(os.tmpdir(), `waanda_${id}.wav`)

  try {
    await new Promise<void>((resolve, reject) =>
      execFile('say', ['-v', 'Samantha', '-r', '155', '-o', aiffPath, text], e => e ? reject(e) : resolve())
    )
    await new Promise<void>((resolve, reject) =>
      execFile('afconvert', [aiffPath, wavPath, '-d', 'LEI16', '-f', 'WAVE'], e => e ? reject(e) : resolve())
    )
    res.setHeader('Content-Type', 'audio/wav')
    res.setHeader('Cache-Control', 'no-store')
    await streamPipeline(createReadStream(wavPath), res)
  } catch (err: any) {
    logger.error('[TTS] generation failed', err)
    if (!res.headersSent) res.status(500).json({ error: 'TTS failed' })
  } finally {
    fsPromises.unlink(aiffPath).catch(() => {})
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

export { kangqoreImmpRoutes };
