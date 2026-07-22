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
import { invalidatePulseCache } from '../waanda/intelligence/enterpriseService';
import { SystemRAG, RAGSystem, RAG_SYSTEMS, SYSTEM_DOC_TYPES } from './agents/systemRAG';
import { prisma } from '../lib/prisma';
import { CommandCenterService } from './command-center/commandCenter.service';

const kangqoreImmpRoutes = Router();

// ── TTS — platform-aware voice, served as WAV ────────────────────────────────
// macOS: `say` → AIFF, `afconvert` → WAV
// Linux: `espeak-ng` → WAV directly (Dockerfile installs espeak-ng)
kangqoreImmpRoutes.get('/tts', requireAuth, requireRole(['ADMIN']), async (req, res) => {
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

// ── WAANDAx Gen2 — live inference probe ──────────────────────────────────────
// Calls the local MLX server (port 11435). If offline, returns gen2Available:false
// so the UI can surface the restart command gracefully.
kangqoreImmpRoutes.post('/waandax/infer', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { prompt } = req.body as { prompt?: string }
  if (!prompt?.trim()) return res.status(400).json({ error: 'prompt required' })

  const MLX_BASE  = process.env.WAANDAX_MLX_URL || 'http://localhost:11435'
  const MLX_MODEL = process.env.WAANDAX_MODEL   || 'mlx-community/Llama-3.2-3B-Instruct-4bit'
  const t0 = Date.now()

  try {
    const response = await fetch(`${MLX_BASE}/v1/chat/completions`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        model:       MLX_MODEL,
        messages:    [
          { role: 'system', content: 'You are WAANDAx — Kangqore\'s local reasoning engine. Be concise and precise.' },
          { role: 'user',   content: prompt.trim() },
        ],
        max_tokens:  512,
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!response.ok) throw new Error(`MLX ${response.status}`)
    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] }
    const gen2  = data.choices?.[0]?.message?.content ?? ''
    res.json({ gen2, gen2Available: true, latencyMs: Date.now() - t0, model: MLX_MODEL })
  } catch (err: any) {
    logger.warn('[WAANDAx] local inference offline:', err.message)
    res.json({
      gen2:          null,
      gen2Available: false,
      latencyMs:     Date.now() - t0,
      error:         'WAANDAx offline — restart: cd ~/.kimmp-venv && mlx_lm.server --model mlx-community/Llama-3.2-3B-Instruct-4bit --port 11435',
    })
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

// Phase 6 — Command Center aggregate (all 7 intelligence streams in one call).
kangqoreImmpRoutes.get('/command-center', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    res.json(await CommandCenterService.aggregate());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

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

const INTEL_SYSTEM = `You are KIMMP/WAANDA — Kangqore's strategic intelligence engine.
Generate an intelligence thinking chain from a natural language prompt.

Return ONLY valid JSON (no markdown, no explanation) in this exact shape:
{
  "intent": "3-6 word label",
  "steps": [
    {
      "id": "s1",
      "type": "goal|context|analyze|insight|hypothesis|simulate|decision|policy|execute|learn|kpi",
      "label": "Node label (3-8 words, specific to the prompt)",
      "description": "What this thinking step captures or does (1-2 sentences)"
    }
  ]
}

Node type guide:
- goal: What are we trying to achieve? (start here)
- context: What does the system know right now? (data, signals, current state)
- analyze: What happened? (facts, patterns, root causes — no interpretation yet)
- insight: Why does it matter? (causal leap, so-what, implications)
- hypothesis: What do we think is true? (testable claim, prediction)
- simulate: What happens if we do X? (scenario modeling, what-if)
- decision: What should we do? (choice between concrete options)
- policy: What rules constrain us? (guardrails, compliance, governance)
- execute: Take the action (concrete implementation step)
- learn: Record outcome → Enterprise Memory (feedback loop close)
- kpi: Strategic anchor — outcome measure (end here or alongside goal)

Rules:
- Generate 5-9 nodes forming a coherent reasoning chain
- Start with goal or context
- End with kpi or learn (or both)
- Connect cause→effect in logical sequence
- Make labels specific to the user's prompt — no generic placeholders
- Every step's description must be concrete and domain-specific`

kangqoreImmpRoutes.post('/workflows/generate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { description, mode } = req.body ?? {}
  if (!description || typeof description !== 'string' || description.length < 10) {
    return res.status(400).json({ error: 'description required (min 10 chars)' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured — KIMMP workflow generation unavailable' })
  }

  const isIntelligence = mode === 'intelligence' || mode === 'all'

  try {
    const result = await _wfHaiku(
      isIntelligence ? INTEL_SYSTEM : WF_SYSTEM,
      isIntelligence
        ? `Build an intelligence thinking chain for: ${description.slice(0, 2000)}`
        : `Design a workflow for: ${description.slice(0, 2000)}`,
      1400,
      { agentSystem: 'KIMMP', agentType: 'workflow_generator', tags: ['workflow', 'nl-generate', mode ?? 'operational'] },
    )
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

// ─── Intelligence node suggestions ───────────────────────────────────────────
// Client-side suggestion map; this endpoint validates + extends with AI context.
const INTEL_NEXT: Record<string, string[]> = {
  goal:       ['context', 'kpi', 'policy'],
  context:    ['analyze', 'hypothesis'],
  analyze:    ['insight', 'hypothesis', 'simulate'],
  insight:    ['decision', 'simulate'],
  hypothesis: ['simulate', 'analyze'],
  simulate:   ['decision', 'policy'],
  decision:   ['execute', 'policy'],
  policy:     ['execute'],
  execute:    ['learn'],
  learn:      ['kpi', 'goal'],
  kpi:        ['insight', 'goal'],
}

kangqoreImmpRoutes.post('/workflows/suggest-nodes', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const { nodeType, nodeName, workflowName, existingTypes } = req.body ?? {}
  const suggestions = (INTEL_NEXT[nodeType] ?? []).filter((t: string) => !(existingTypes ?? []).includes(t)).slice(0, 3)
  res.json({ suggestions })
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

  const NODE_TYPE_CONTEXT: Record<string, string> = {
    // Intelligence canvas
    goal:       'A Goal node defines a desired outcome. Explain what business objective this goal drives and how its success should be measured.',
    context:    'A Context node captures situational awareness. Explain what signals or state this node aggregates and why this context is critical for the decision chain.',
    analyze:    'An Analyze node surfaces facts and patterns from data. Explain what happened, what changed, and what the evidence reveals — no interpretation, just observable facts.',
    insight:    'An Insight node gives CAUSAL interpretation to analyzed facts. Explain WHY the observed pattern matters — the business significance and what it implies for action. Do not describe what happened; explain why it matters.',
    hypothesis: 'A Hypothesis node states a testable claim BEFORE simulation. Explain WHAT the hypothesis claims, what evidence would confirm or refute it, and what a simulation of this hypothesis should test.',
    simulate:   'A Simulation node models a counterfactual scenario. Explain what scenario is being tested, what assumptions the model relies on, and what outcomes it compares.',
    decision:   'A Decision node commits to a course of action. Explain the strategic logic, the decision criteria, and what alternatives were considered before committing.',
    policy:     'A Policy node enforces governance constraints. Explain which rules apply, what compliance requirements are triggered, and what the policy prevents or requires.',
    execute:    'An Execute node triggers a concrete action. Explain what gets done, what systems are invoked, and how execution success is measured.',
    learn:      'A Learn node captures outcomes into enterprise memory. Explain what the system records, how this knowledge is indexed for future decisions, and what pattern it reinforces.',
    kpi:        'A KPI node is the strategic anchor of the entire intelligence chain. Explain what the KPI measures, what drives it up or down, and how the connected nodes collectively move it.',
    // Enterprise canvas
    department: 'A Department node represents an organizational unit. Explain this division\'s strategic mandate, its key dependencies on other units, and what value it is accountable for delivering.',
    team:       'A Team node represents a squad or working group. Explain this team\'s purpose, the capabilities it owns, and how it connects to the broader organizational structure.',
    objective:  'An Objective node defines a measurable OKR. Explain what this objective is trying to achieve, how progress is measured, and which teams and budgets are responsible for it.',
    budget:     'A Budget node represents a cost center or financial allocation. Explain what this budget funds, what the ROI expectation is, and what spending controls or approval gates govern it.',
    risk:       'A Risk node identifies a business risk or exposure. Explain the nature of this risk, its likelihood and impact, what mitigations are in place, and who owns it.',
    milestone:  'A Milestone node marks a key delivery checkpoint. Explain what must be delivered, what the acceptance criteria are, what depends on this milestone shipping, and what the downstream impact of slipping is.',
    // Agent Composition canvas
    trigger:    'A Trigger node initiates the agent pipeline. Explain what event, condition, or schedule starts this pipeline, what state the trigger reads, and how it decides whether to fire.',
    tool:       'A Tool node calls an external capability or function. Explain what this tool does, what inputs it requires, what outputs it produces, and what failure modes need to be handled.',
    store:      'A Store node persists agent memory or retrieves context. Explain what data is stored or retrieved, how it is indexed (vector, key-value, relational), and how it shapes downstream agent behavior.',
    pipeline:   'A Pipeline node chains agent operations in sequence or parallel. Explain what processing happens at this stage, what the data transformation is, and what the output contract is to downstream nodes.',
    monitor:    'A Monitor node observes a live metric, output stream, or agent behavior. Explain what is being watched, what threshold triggers an alert, and what escalation path is taken when the monitor fires.',
    handoff:    'A Handoff node escalates to human judgment. Explain why human review is required at this point, what information the human sees, what decisions they make, and what happens in each branch of their response.',
  }
  const nodeContext = NODE_TYPE_CONTEXT[nodeType] ?? 'Explain the strategic purpose and positioning of this node in the intelligence workflow.'

  const system = `You are WAANDA, Kangqore's strategic intelligence engine.
A user has clicked a "${nodeType ?? 'decision'}" node on the WAANDA Intelligence Canvas.
${nodeContext}
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
Downstream nodes: ${downstreamNames}`

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
kangqoreImmpRoutes.get('/scout/providers', requireAuth, requireRole(['ADMIN']), (_req, res) => {
  const { WebSearchService } = require('./scout/webSearch.service')
  res.json({ providers: WebSearchService.activeProviders })
})

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
  getStrategicDecisionByStep,
  selectDecisionOption, recordDecisionOutcome, isStrategicDecision,
} from './services/kimmpStrategicDecision.service'
import { listPolicies, createPolicy, updatePolicy, deletePolicy, checkPolicy, seedDefaultPolicies } from '../services/policyEngine.service'
import { runSimulation } from './services/kimmpSimulator.service'

kangqoreImmpRoutes.post('/strategic-decisions', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { question, options, simulationType, simulationParams, workflowName, stepName } = req.body
    if (!question?.trim()) return res.status(400).json({ error: 'question required' })
    const userId = (req as any).user?.userId
    const result = await runStrategicDecision(question, userId, options, simulationType, simulationParams, workflowName, stepName)
    res.json(result)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.get('/strategic-decisions/by-step', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { workflowName, stepName } = req.query as { workflowName: string; stepName: string }
    if (!workflowName || !stepName) return res.status(400).json({ error: 'workflowName and stepName required' })
    const record = await getStrategicDecisionByStep(workflowName, stepName)
    res.json(record ?? null)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.get('/strategic-decisions', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20
    const items = await listStrategicDecisions(limit)
    res.json({ items })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.get('/strategic-decisions/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const d = await getStrategicDecision(req.params.id)
    if (!d) return res.status(404).json({ error: 'Not found' })
    res.json(d)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.post('/strategic-decisions/:id/select', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const adminId = (req as any).user?.userId
    const { label } = req.body
    if (!label) return res.status(400).json({ error: 'label required' })
    await selectDecisionOption(req.params.id, label, adminId)
    res.json({ ok: true })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

kangqoreImmpRoutes.post('/strategic-decisions/:id/outcome', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { outcome, domain = 'operations', tier = 'OPERATIONAL', roiValue } = req.body ?? {};
    if (!outcome) return res.status(400).json({ error: 'outcome required' });
    const userId = (req as any).user?.id;
    const { CognitionOrchestrator } = await import('./cognition/cognitionOrchestrator');
    const result = await CognitionOrchestrator.process({
      type: 'decision_outcome', sourceId: req.params.id,
      outcome, userId, domain, tier, roiValue,
    });
    await recordDecisionOutcome(req.params.id, outcome).catch(() => null);
    res.json({ ok: true, lesson: result.lesson?.lesson, promoted: result.promoted, etiImpact: result.etiImpact });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
})

kangqoreImmpRoutes.post('/strategic-decisions/detect', requireAuth, requireRole(['ADMIN']), (req, res) => {
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

// ─── Phase 6.2 — Decision Brief + Outcome Recording ────────────────────────
import { DecisionBriefService } from './command-center/decisionBrief.service';

kangqoreImmpRoutes.get('/decisions/:id/brief', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const brief = await DecisionBriefService.brief(req.params.id);
    if (!brief) return (res as any).status(404).json({ error: 'Decision not found' });
    res.json(brief);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ─── Phase 6.12 — Enterprise Objectives ─────────────────────────────────────
import { IntentAlignmentService } from './command-center/intentAlignment.service';

kangqoreImmpRoutes.get('/objectives', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const objectives = await (prisma as any).kimmpEnterpriseObjective.findMany({
      orderBy: { rank: 'asc' },
      include: { intents: { where: { status: 'ACTIVE' }, orderBy: { rank: 'asc' } } },
    });
    res.json({ objectives });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

kangqoreImmpRoutes.post('/objectives', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { title, description, category, vision, measuredBy, targetDate, rank } = req.body ?? {};
    if (!title || !category || rank === undefined) {
      return (res as any).status(400).json({ error: 'title, category, rank required' });
    }
    const obj = await (prisma as any).kimmpEnterpriseObjective.create({
      data: {
        title, description, category, vision, measuredBy,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        rank: Number(rank),
      },
    });
    res.status(201).json(obj);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

kangqoreImmpRoutes.patch('/objectives/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { status, rank, measuredBy, title, description, vision, targetDate } = req.body ?? {};
    const obj = await (prisma as any).kimmpEnterpriseObjective.update({
      where: { id: req.params.id },
      data: {
        ...(status      !== undefined && { status }),
        ...(rank        !== undefined && { rank: Number(rank) }),
        ...(measuredBy  !== undefined && { measuredBy }),
        ...(title       !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(vision      !== undefined && { vision }),
        ...(targetDate  !== undefined && { targetDate: new Date(targetDate) }),
      },
    });
    if (status === 'ACHIEVED') {
      await (prisma as any).kimmpMemory.create({
        data: {
          type:    'LESSON',
          content: `Objective achieved: ${obj.title} on ${new Date().toISOString().slice(0, 10)}.`,
          tags:    ['objective', 'achievement'],
        },
      }).catch(() => null);
    }
    res.json(obj);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

kangqoreImmpRoutes.delete('/objectives/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    await (prisma as any).kimmpEnterpriseObjective.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ─── Phase 6.15 — Executive Intents ─────────────────────────────────────────

kangqoreImmpRoutes.get('/intents', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const intents = await (prisma as any).kimmpExecutiveIntent.findMany({
      orderBy: { rank: 'asc' },
      include: { objective: true },
    });
    res.json({ intents });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

kangqoreImmpRoutes.post('/intents', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { label, category, timeframe, rank, oisTarget, objectiveId } = req.body ?? {};
    if (!label || !category || !timeframe || rank === undefined) {
      return (res as any).status(400).json({ error: 'label, category, timeframe, rank required' });
    }
    const intent = await (prisma as any).kimmpExecutiveIntent.create({
      data: {
        label, category, timeframe,
        rank:        Number(rank),
        oisTarget:   oisTarget != null ? Number(oisTarget) : undefined,
        objectiveId: objectiveId ?? undefined,
      },
    });
    IntentAlignmentService.invalidateCache();
    res.status(201).json(intent);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

kangqoreImmpRoutes.patch('/intents/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { status, rank, label, category, timeframe, oisTarget, objectiveId } = req.body ?? {};
    const intent = await (prisma as any).kimmpExecutiveIntent.update({
      where: { id: req.params.id },
      data: {
        ...(status      !== undefined && { status }),
        ...(rank        !== undefined && { rank: Number(rank) }),
        ...(label       !== undefined && { label }),
        ...(category    !== undefined && { category }),
        ...(timeframe   !== undefined && { timeframe }),
        ...(oisTarget   !== undefined && { oisTarget: Number(oisTarget) }),
        ...(objectiveId !== undefined && { objectiveId }),
      },
    });
    IntentAlignmentService.invalidateCache();
    res.json(intent);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

kangqoreImmpRoutes.delete('/intents/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    await (prisma as any).kimmpExecutiveIntent.delete({ where: { id: req.params.id } });
    IntentAlignmentService.invalidateCache();
    res.json({ ok: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ─── Phase 6.3 — Daily Operating Plan + Executive Timeline ──────────────────
import { DailyPlanService } from './command-center/dailyPlan.service';

// GET today's plan (generate if not exists)
kangqoreImmpRoutes.get('/command-center/plan', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const plan = await DailyPlanService.getOrGenerate(new Date());
    res.json(plan);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST mark an action as complete
kangqoreImmpRoutes.post('/command-center/plan/action/:actionId/complete', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const planData = await DailyPlanService.getOrGenerate(new Date());
    const ok = await DailyPlanService.completeAction(planData.id, req.params.actionId);
    res.json({ ok });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// DELETE dismiss today's plan (next GET regenerates fresh)
kangqoreImmpRoutes.delete('/command-center/plan', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    await DailyPlanService.dismiss(new Date());
    res.json({ ok: true, message: 'Plan dismissed — next GET will regenerate' });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET executive timeline
kangqoreImmpRoutes.get('/command-center/timeline', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const window = (req.query.window as string) || 'week';
    const lens   = (req.query.lens   as string) || 'enterprise';
    if (!['yesterday', 'week', 'quarter'].includes(window)) {
      return (res as any).status(400).json({ error: 'window must be yesterday|week|quarter' });
    }
    if (!['decisions', 'missions', 'objectives', 'enterprise'].includes(lens)) {
      return (res as any).status(400).json({ error: 'lens must be decisions|missions|objectives|enterprise' });
    }
    const data = await DailyPlanService.timeline(
      window as any,
      lens as any,
    );
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 6.4 — Enterprise Cognition Layer Routes
// ═══════════════════════════════════════════════════════════════════════════════
import { CognitionOrchestrator } from './cognition/cognitionOrchestrator';
import { MemoryEngine }          from './cognition/memoryEngine';
import { TrustEngine }           from './cognition/trustEngine';
import { KnowledgeEngine }       from './cognition/knowledgeEngine';
import { EvolutionEngine }       from './cognition/evolutionEngine';

// POST /cognition/process — manual trigger (for testing / feedback submission)
kangqoreImmpRoutes.post('/cognition/process', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const result = await CognitionOrchestrator.process(req.body);
    res.json(result);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/eti — current ETI with all dimensions
kangqoreImmpRoutes.get('/cognition/eti', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const [eti, coverage] = await Promise.all([TrustEngine.getETI(), TrustEngine.getKnowledgeCoverage()]);
    res.json({ eti, coverage });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/eti/trend?window=week|month|quarter
kangqoreImmpRoutes.get('/cognition/eti/trend', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const window = (req.query.window as string) || 'week';
    const trend  = await TrustEngine.getTrend(window as any);
    res.json({ trend });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/memory?domain=&tier=&tags=a,b&limit=
kangqoreImmpRoutes.get('/cognition/memory', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { domain, tier, tags, limit } = req.query as any;
    const results = await MemoryEngine.recall({
      domain, tier,
      tags:  tags  ? (tags as string).split(',') : undefined,
      limit: limit ? Number(limit) : 20,
    });
    res.json({ lessons: results });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/memory/search?q=
kangqoreImmpRoutes.get('/cognition/memory/search', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const q = (req.query.q as string) || '';
    const results = await MemoryEngine.search(q);
    res.json({ results });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/memory/timeline?window=today|yesterday|week|month&lens=Strategic|Operational|Learning|Evolution
kangqoreImmpRoutes.get('/cognition/memory/timeline', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const window = (req.query.window as any) || 'week';
    const lens   = (req.query.lens   as any) || 'Learning';
    const items  = await MemoryEngine.getTimeline(window, lens);
    res.json({ items, window, lens });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/knowledge/:domain — full knowledge tree for a domain
kangqoreImmpRoutes.get('/cognition/knowledge/:domain', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const tree = await KnowledgeEngine.tree(req.params.domain);
    res.json(tree);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/policy?domain=&window=week|month|quarter
kangqoreImmpRoutes.get('/cognition/policy', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { domain, window } = req.query as any;
    const [active, changelog] = await Promise.all([
      domain ? EvolutionEngine.queryByDomain(domain) : (prisma as any).policyEvolution.findMany({ where: { status: 'ACTIVE' }, orderBy: { createdAt: 'desc' }, take: 30 }),
      EvolutionEngine.changelog(window || 'month'),
    ]);
    res.json({ active, changelog });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST /cognition/policy/:id/supersede
kangqoreImmpRoutes.post('/cognition/policy/:id/supersede', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { statement, rationale } = req.body ?? {};
    if (!statement) return (res as any).status(400).json({ error: 'statement required' });
    const next = await EvolutionEngine.supersede(req.params.id, statement, rationale ?? '');
    res.json(next);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 6.5 — Executive Memory Graph Routes
// ═══════════════════════════════════════════════════════════════════════════════
import { EnterpriseGraphService } from './cognition/enterpriseGraph.service';

// GET /cognition/graph/:entityType/:entityId
kangqoreImmpRoutes.get('/cognition/graph/:entityType/:entityId', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const valid = ['lead', 'client', 'signal', 'decision', 'project', 'goal', 'lesson', 'principle'];
    if (!valid.includes(entityType)) return (res as any).status(400).json({ error: `entityType must be one of: ${valid.join(', ')}` });
    const graph = await EnterpriseGraphService.traverse(entityId, entityType as any);
    res.json(graph);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 6.6 — Digital CEO (Morning Briefing) Routes
// ═══════════════════════════════════════════════════════════════════════════════
import { MorningBriefingService } from './cognition/morningBriefing.service';

// POST /cognition/brief/generate — manual trigger
kangqoreImmpRoutes.post('/cognition/brief/generate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const briefType = (req.body?.briefType as string) || 'MORNING';
    const result    = await MorningBriefingService.generate(briefType as any);
    res.json(result);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/brief/latest?briefType=MORNING|MIDDAY|EVENING
kangqoreImmpRoutes.get('/cognition/brief/latest', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const briefType = (req.query.briefType as string) || 'MORNING';
    const brief = await (prisma as any).morningBriefing.findFirst({
      where:   { briefType },
      orderBy: { createdAt: 'desc' },
    });
    res.json(brief ?? null);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/brief/history?limit=
kangqoreImmpRoutes.get('/cognition/brief/history', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit  = Number(req.query.limit) || 10;
    const briefs = await (prisma as any).morningBriefing.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
    res.json({ briefs });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 6.7 — Executive Simulator Routes
// ═══════════════════════════════════════════════════════════════════════════════
import { ExecutiveSimulatorService } from './cognition/executiveSimulator.service';

// POST /cognition/simulate
kangqoreImmpRoutes.post('/cognition/simulate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { prompt, context } = req.body ?? {};
    if (!prompt) return (res as any).status(400).json({ error: 'prompt required' });
    const userId = (req as any).user?.id;
    const result = await ExecutiveSimulatorService.simulate(prompt, context, userId);
    res.json(result);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/simulate/history?limit=
kangqoreImmpRoutes.get('/cognition/simulate/history', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const sims  = await (prisma as any).executiveSimulation.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
    res.json({ simulations: sims });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 6.8 — Autopilot Routes
// ═══════════════════════════════════════════════════════════════════════════════
import { AutopilotService } from './cognition/autopilot.service';

// GET /cognition/autopilot/missions
kangqoreImmpRoutes.get('/cognition/autopilot/missions', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const missions = await AutopilotService.listMissions();
    res.json({ missions });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST /cognition/autopilot/missions
kangqoreImmpRoutes.post('/cognition/autopilot/missions', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const mission = await AutopilotService.createMission(req.body);
    res.json(mission);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// PATCH /cognition/autopilot/missions/:id — pause/resume/abort
kangqoreImmpRoutes.patch('/cognition/autopilot/missions/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const mission = await AutopilotService.updateMission(req.params.id, req.body);
    res.json(mission);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST /cognition/autopilot/tick — manual tick for supervised mode
kangqoreImmpRoutes.post('/cognition/autopilot/tick', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const results = await AutopilotService.tick();
    res.json({ results });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/autopilot/log?missionId=&limit=
kangqoreImmpRoutes.get('/cognition/autopilot/log', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { missionId, limit } = req.query as any;
    const logs = await AutopilotService.getLog(missionId, Number(limit) || 20);
    res.json({ logs });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 6.9 — Executive Reflection & Enterprise Evolution
// ═══════════════════════════════════════════════════════════════════════════════
import { RetrospectiveEngine }       from './cognition/retrospectiveEngine';
import { ExecutiveReviewService }    from './cognition/executiveReview.service';
import { CoigEvolutionService }      from './cognition/coigEvolution.service';
import { NarrativeGeneratorService } from './cognition/narrativeGenerator.service';
import { OIIService }                from './cognition/oii.service';

// GET /cognition/oii — Organizational Intelligence Index (computes + persists snapshot)
kangqoreImmpRoutes.get('/cognition/oii', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try { res.json(await OIIService.compute()); }
  catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/oii/history?limit= — OII trend over time
kangqoreImmpRoutes.get('/cognition/oii/history', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try { res.json({ history: await OIIService.history(Number(req.query.limit) || 30) }); }
  catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/coig/trend
kangqoreImmpRoutes.get('/cognition/coig/trend', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try { res.json(await CoigEvolutionService.trend()); }
  catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/scorecard?window=week|month|quarter
kangqoreImmpRoutes.get('/cognition/scorecard', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const w = (req.query.window as 'week' | 'month' | 'quarter') ?? 'week';
    res.json(await CoigEvolutionService.computeScorecard(w));
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/reviews?limit=
kangqoreImmpRoutes.get('/cognition/reviews', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    res.json({ reviews: await ExecutiveReviewService.list(limit) });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST /cognition/reviews/generate — manual trigger
kangqoreImmpRoutes.post('/cognition/reviews/generate', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try { res.json(await ExecutiveReviewService.generate()); }
  catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/retrospectives?limit=
kangqoreImmpRoutes.get('/cognition/retrospectives', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    res.json({ retrospectives: await RetrospectiveEngine.list(limit) });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST /cognition/retrospectives/weekly — manual trigger for current week
kangqoreImmpRoutes.post('/cognition/retrospectives/weekly', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    res.json(await RetrospectiveEngine.createForWeek(weekStart));
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/letters?type=&limit=
kangqoreImmpRoutes.get('/cognition/letters', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { type, limit } = req.query as { type?: string; limit?: string };
    res.json({ letters: await NarrativeGeneratorService.list(type as any, Number(limit) || 10) });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST /cognition/letters/generate
kangqoreImmpRoutes.post('/cognition/letters/generate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { type, period } = req.body as { type: 'QUARTERLY' | 'ANNUAL' | 'BOARD' | 'INVESTOR'; period: string };
    if (!type || !period) return res.status(400).json({ error: 'type and period are required' });
    res.json(await NarrativeGeneratorService.generate(type, period));
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/playbooks/hygiene — retirement + merge candidates
kangqoreImmpRoutes.get('/cognition/playbooks/hygiene', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const [retirementCandidates, mergeCandidates] = await Promise.all([
      EvolutionEngine.playbookRetirementCandidates(),
      EvolutionEngine.playbookMergeCandidates(),
    ]);
    res.json({ retirementCandidates, mergeCandidates });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST /cognition/playbooks/:id/retire
kangqoreImmpRoutes.post('/cognition/playbooks/:id/retire', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { reason } = req.body as { reason?: string };
    res.json(await EvolutionEngine.retirePlaybook(req.params.id, reason ?? 'Retired by CEO'));
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /cognition/governance — WAANDA's current promotion mode + readiness
kangqoreImmpRoutes.get('/cognition/governance', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const [status, readiness] = await Promise.all([
      EvolutionEngine.getGovernanceMode(),
      EvolutionEngine.assessGovernanceReadiness(),
    ]);
    res.json({ ...status, readiness: readiness.readiness });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST /cognition/governance — CEO override: force GOVERNED or BOOTSTRAP
kangqoreImmpRoutes.post('/cognition/governance', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { mode, reason } = req.body as { mode: 'BOOTSTRAP' | 'GOVERNED'; reason?: string };
    if (mode !== 'BOOTSTRAP' && mode !== 'GOVERNED') return res.status(400).json({ error: 'mode must be BOOTSTRAP or GOVERNED' });
    await EvolutionEngine.setGovernanceMode(mode, 'CEO', reason);
    res.json({ ok: true, mode });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNED Mode — Candidate review routes
// ═══════════════════════════════════════════════════════════════════════════════
// GET /cognition/candidates — all CANDIDATE-status knowledge artifacts
kangqoreImmpRoutes.get('/cognition/candidates', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const [principles, playbooks] = await Promise.all([
      (prisma as any).enterprisePrinciple.findMany({ where: { promotionStatus: 'CANDIDATE' }, orderBy: { createdAt: 'asc' } }),
      (prisma as any).enterprisePlaybook.findMany({ where: { promotionStatus: 'CANDIDATE' }, orderBy: { createdAt: 'asc' } }),
    ]);
    res.json({
      candidates: [
        ...principles.map((p: any) => ({ ...p, kind: 'PRINCIPLE' })),
        ...playbooks.map((p: any) => ({ ...p, kind: 'PLAYBOOK' })),
      ],
    });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST /cognition/candidates/:kind/:id/promote
kangqoreImmpRoutes.post('/cognition/candidates/:kind/:id/promote', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { kind, id } = req.params;
    const { reviewNote } = req.body as { reviewNote?: string };
    const now = new Date();
    let updated: any;
    if (kind === 'PRINCIPLE') {
      updated = await (prisma as any).enterprisePrinciple.update({
        where: { id },
        data:  { promotionStatus: 'APPROVED', status: 'ACTIVE', reviewedAt: now, reviewNote: reviewNote ?? 'Approved', promotedAt: now },
      });
    } else if (kind === 'PLAYBOOK') {
      updated = await (prisma as any).enterprisePlaybook.update({
        where: { id },
        data:  { promotionStatus: 'APPROVED', status: 'ACTIVE', reviewedAt: now, reviewNote: reviewNote ?? 'Approved', promotedAt: now },
      });
    } else {
      return res.status(400).json({ error: 'kind must be PRINCIPLE or PLAYBOOK' });
    }
    res.json({ ok: true, updated });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST /cognition/candidates/:kind/:id/reject
kangqoreImmpRoutes.post('/cognition/candidates/:kind/:id/reject', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { kind, id } = req.params;
    const { reviewNote } = req.body as { reviewNote?: string };
    const now = new Date();
    let updated: any;
    if (kind === 'PRINCIPLE') {
      updated = await (prisma as any).enterprisePrinciple.update({
        where: { id },
        data:  { promotionStatus: 'REJECTED', status: 'DEPRECATED', reviewedAt: now, reviewNote: reviewNote ?? 'Rejected' },
      });
    } else if (kind === 'PLAYBOOK') {
      updated = await (prisma as any).enterprisePlaybook.update({
        where: { id },
        data:  { promotionStatus: 'REJECTED', status: 'DEPRECATED', reviewedAt: now, reviewNote: reviewNote ?? 'Rejected' },
      });
    } else {
      return res.status(400).json({ error: 'kind must be PRINCIPLE or PLAYBOOK' });
    }
    res.json({ ok: true, updated });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ── Enterprise Proposal Builder ───────────────────────────────────────────────
// WAANDA generates a structured enterprise proposal for a CRM lead + pack combo.
// The proposal is returned as JSON with 7 sections ready to render in the OS.

const PACK_KPI_MAP: Record<string, { name: string; kpis: string[]; pillars: string[] }> = {
  'ps-pack-v1': {
    name: 'Professional Services Pack™',
    kpis: ['Project Delivery Rate', 'Utilisation Rate', 'Revenue per Head', 'Client NPS', 'Margin %', 'Pipeline Coverage'],
    pillars: ['Delivery Excellence', 'Client Intelligence', 'Resource Optimisation', 'Revenue Operations', 'Knowledge Management', 'Growth Engine'],
  },
  'fintech-pack-v1': {
    name: 'FinTech Pack™',
    kpis: ['Net Interest Margin', 'NPA Ratio', 'Customer Acquisition Cost', 'Cross-sell Rate', 'Digital Channel Mix', 'Fraud Rate'],
    pillars: ['Regulatory Compliance', 'Risk Intelligence', 'Financial Performance', 'Digital Banking', 'Customer Growth'],
  },
  'healthcare-pack-v1': {
    name: 'Healthcare Pack™',
    kpis: ['HCAHPS Score', 'Occupancy Rate', 'Denial Rate', 'ALOS', 'Staff Utilisation', 'Readmission Rate'],
    pillars: ['Patient Safety', 'Clinical Intelligence', 'Financial Stewardship', 'Compliance', 'Operational Excellence'],
  },
}

kangqoreImmpRoutes.post('/proposals/generate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { leadId, packId, customNote } = req.body as { leadId?: string; packId?: string; customNote?: string }
    if (!leadId || !packId) return res.status(400).json({ error: 'leadId and packId required' })

    const pack = PACK_KPI_MAP[packId]
    if (!pack) return res.status(400).json({ error: `Unknown packId: ${packId}` })

    // Fetch lead data
    const lead = await (prisma as any).eqoreLead.findUnique({ where: { id: leadId } }).catch(() => null)
    const companyName   = lead?.companyName   ?? 'Prospective Client'
    const projectedValue = lead?.projectedValue ? `₹${Number(lead.projectedValue).toLocaleString('en-IN')}` : 'TBD'
    const stage         = lead?.buyingStage    ?? 'qualified'
    const painPoints    = lead?.painPoints     ? JSON.stringify(lead.painPoints) : 'operational efficiency, decision latency, data silos'
    const problemStatement = lead?.problemStatement ?? ''

    const system = `You are WAANDA — Kangqore's enterprise intelligence engine writing a concise, compelling enterprise proposal.
Return ONLY valid JSON. No markdown, no explanation. Use this exact shape:
{
  "title": "Enterprise Intelligence Partnership Proposal",
  "executiveSummary": "2-3 sentences positioning Kangqore as the right partner",
  "challenges": ["challenge 1", "challenge 2", "challenge 3"],
  "solutionNarrative": "2-3 sentences on how the pack addresses the challenges",
  "kpiTargets": [{"kpi": "KPI name", "baseline": "estimated current", "target": "90-day target"}],
  "timeline": [{"phase": "Phase label", "duration": "X weeks", "milestone": "What gets done"}],
  "investment": {"engagement": "Investment description", "roi": "Expected ROI description", "paybackPeriod": "Payback timeline"},
  "nextSteps": ["Immediate next step 1", "Next step 2", "Next step 3"]
}`

    const user = `Write an enterprise proposal for:
Company: ${companyName}
Pack: ${pack.name}
KPIs: ${pack.kpis.join(', ')}
Pillars: ${pack.pillars.join(', ')}
Engagement Value: ${projectedValue}
Buying Stage: ${stage}
Pain Points: ${painPoints}
${problemStatement ? `Problem Statement: ${problemStatement}` : ''}
${customNote ? `Note: ${customNote}` : ''}

Generate 3 kpiTargets from the pack KPIs, a 3-phase timeline (Discovery, Deployment, Optimisation), and 3 concrete next steps.`

    const { haiku, textOf } = await import('./llm/kimmpLLMRouter')
    const raw = await haiku(system, user, 900)
    const text = textOf(raw).trim()

    let proposal: unknown
    try {
      proposal = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}/)
      proposal = match ? JSON.parse(match[0]) : { error: 'Parse failed', raw: text }
    }

    res.json({ proposal, lead: { companyName, projectedValue, stage, packId, packName: pack.name } })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── Multi-Agent Coordination ─────────────────────────────────────────────────
import { KimmpAgentCoordinator, SpecialistAgent } from './agents/kimmpAgentCoordinator.service'
import { KimmpContextAssembler } from './context/kimmpContextAssembler.service'
import { enqueue as gen3Enqueue } from './gen3Executor.service'

const ALL_SPECIALISTS: SpecialistAgent[] = [
  'SIGNAL_READ','GOAL_CHECK','FINANCIAL_SNAPSHOT','LEAD_ANALYSIS',
  'RISK_ANALYSIS','DECISION_ENGINE','STRATEGIST','ADVISOR','COMPLIANCE','OPERATIONS','FORECAST',
]

// In-memory ring buffer — last 20 coordination runs
const coordHistory: Array<{ id: string; question: string; agentCount: number; consensus: string; confidence: number; conflicting: string[]; actionRequired: boolean; durationMs: number; ranAt: string }> = []

// POST /admin/kangqore-immp/agent-coordination/run
kangqoreImmpRoutes.post('/agent-coordination/run', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { question, agents } = req.body as { question?: string; agents?: SpecialistAgent[] }
    if (!question?.trim()) return res.status(400).json({ error: 'question required' })
    const userId = (req as any).user?.id ?? 'system'
    const selectedAgents = (agents && agents.length > 0) ? agents : ALL_SPECIALISTS
    const t0 = Date.now()

    const ctx = await KimmpContextAssembler.build({
      userId, question, skipGraph: false, skipDecisions: false, skipMemories: false,
    })
    const result = await KimmpAgentCoordinator.coordinate(selectedAgents, question, ctx)
    const durationMs = Date.now() - t0

    const run = {
      id: `coord-${Date.now()}`,
      question: question.slice(0, 200),
      agentCount: selectedAgents.length,
      consensus: result.consensus,
      confidence: result.confidence,
      conflicting: result.conflicting,
      actionRequired: result.actionRequired,
      durationMs,
      ranAt: new Date().toISOString(),
    }
    coordHistory.unshift(run)
    if (coordHistory.length > 20) coordHistory.pop()

    res.json({ ...result, durationMs, ranAt: run.ranAt })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/agent-coordination/history
kangqoreImmpRoutes.get('/agent-coordination/history', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  res.json({ runs: coordHistory })
})

// ─── WAANDA Foundation Model Status ──────────────────────────────────────────
// GET /admin/kangqore-immp/foundation-model/status
kangqoreImmpRoutes.get('/foundation-model/status', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const GRADUATION = 1_000

    const [totalRaw, q05Raw, q07Raw, q09Raw, q10Raw, approvedRaw, recentRaw, runsRaw] = await Promise.all([
      (prisma as any).kimmpLearningExample.count(),
      (prisma as any).kimmpLearningExample.count({ where: { quality: { gte: 0.4, lt: 0.6 } } }),
      (prisma as any).kimmpLearningExample.count({ where: { quality: { gte: 0.6, lt: 0.8 } } }),
      (prisma as any).kimmpLearningExample.count({ where: { quality: { gte: 0.8, lt: 0.95 } } }),
      (prisma as any).kimmpLearningExample.count({ where: { quality: { gte: 0.95 } } }),
      (prisma as any).kimmpLearningExample.count({ where: { approved: true } }),
      (prisma as any).kimmpLearningExample.findMany({
        orderBy: { createdAt: 'desc' }, take: 10,
        select: { id: true, source: true, agentSystem: true, quality: true, approved: true, createdAt: true, userMessage: true },
      }),
      (prisma as any).kimmpLearningRun.findMany({ orderBy: { startedAt: 'desc' }, take: 5 }),
    ])

    const total = totalRaw as number
    const graduationPct = Math.min(100, Math.round((total / GRADUATION) * 100))

    // Estimate examples/day from last 7 days
    const weekAgo = new Date(Date.now() - 7 * 86400_000)
    const lastWeek: number = await (prisma as any).kimmpLearningExample.count({
      where: { createdAt: { gte: weekAgo } },
    })
    const examplesPerDay = Math.round((lastWeek / 7) * 10) / 10
    const daysToGraduation = examplesPerDay > 0
      ? Math.ceil((GRADUATION - total) / examplesPerDay)
      : null

    res.json({
      total,
      approved: approvedRaw as number,
      graduationThreshold: GRADUATION,
      graduationPct,
      examplesPerDay,
      daysToGraduation,
      qualityBands: {
        mined:     q05Raw as number,
        synthetic: q07Raw as number,
        operational: q09Raw as number,
        approved:  q10Raw as number,
      },
      recentExamples: recentRaw,
      recentRuns: runsRaw,
    })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── S52 — External Agent SDK ─────────────────────────────────────────────────
// crypto already imported at top of file

// POST /admin/kangqore-immp/agents/register
kangqoreImmpRoutes.post('/agents/register', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { name, role, capabilities, webhookUrl } = req.body
    if (!name?.trim() || !role?.trim() || !webhookUrl?.trim()) {
      return res.status(400).json({ error: 'name, role, and webhookUrl are required' })
    }
    if (!Array.isArray(capabilities) || capabilities.length === 0) {
      return res.status(400).json({ error: 'capabilities must be a non-empty array' })
    }
    const secret = crypto.randomBytes(32).toString('hex')
    const agent = await (prisma as any).externalAgent.create({
      data: { name: name.trim(), role: role.trim(), capabilities, webhookUrl: webhookUrl.trim(), secret, registeredBy: req.user!.userId },
    })
    res.status(201).json({ agent: { ...agent, secret }, note: 'Store this secret — it will not be shown again' })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/agents
kangqoreImmpRoutes.get('/agents', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const agents = await (prisma as any).externalAgent.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, role: true, capabilities: true, webhookUrl: true, status: true, lastPingAt: true, lastPingStatus: true, lastPingMs: true, createdAt: true },
    })
    res.json({ agents })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/agents/:id/ping — health check
kangqoreImmpRoutes.post('/agents/:id/ping', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const agent = await (prisma as any).externalAgent.findUnique({ where: { id: req.params.id } })
    if (!agent) return res.status(404).json({ error: 'Agent not found' })

    const payload = { event: 'PING', agentId: agent.id, timestamp: new Date().toISOString() }
    const sig = crypto.createHmac('sha256', agent.secret).update(JSON.stringify(payload)).digest('hex')
    const t0 = Date.now()
    let pingStatus = 'OK'; let pingMs = 0
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 5000)
      const r = await fetch(agent.webhookUrl + '/ping', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'X-KIMMP-Signature': sig },
        body:    JSON.stringify(payload),
        signal:  controller.signal,
      })
      clearTimeout(timer)
      pingMs = Date.now() - t0
      pingStatus = r.ok ? 'OK' : 'ERROR'
    } catch {
      pingStatus = 'TIMEOUT'
      pingMs = Date.now() - t0
    }

    const updated = await (prisma as any).externalAgent.update({
      where: { id: req.params.id },
      data: { lastPingAt: new Date(), lastPingStatus: pingStatus, lastPingMs: pingMs, status: pingStatus === 'OK' ? 'ACTIVE' : 'ERROR' },
      select: { id: true, name: true, status: true, lastPingAt: true, lastPingStatus: true, lastPingMs: true },
    })
    res.json({ result: pingStatus, ms: pingMs, agent: updated })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// PATCH /admin/kangqore-immp/agents/:id/status
kangqoreImmpRoutes.patch('/agents/:id/status', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { status } = req.body
    const VALID = ['ACTIVE', 'PAUSED', 'REVOKED']
    if (!VALID.includes(status)) return res.status(400).json({ error: `status must be one of ${VALID.join(', ')}` })
    const agent = await (prisma as any).externalAgent.update({ where: { id: req.params.id }, data: { status } })
    res.json({ agent })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// DELETE /admin/kangqore-immp/agents/:id
kangqoreImmpRoutes.delete('/agents/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    await (prisma as any).externalAgent.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── S53 — WAANDA Gen 2: Fine-tune Job Tracker ────────────────────────────────

// GET /admin/kangqore-immp/learning/finetune-jobs
kangqoreImmpRoutes.get('/learning/finetune-jobs', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const jobs = await (prisma as any).finetuneJob.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ jobs })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/learning/finetune-jobs
kangqoreImmpRoutes.post('/learning/finetune-jobs', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { name, provider = 'ANTHROPIC', minQuality = 0.9, format = 'anthropic', baseModel, notes } = req.body
    if (!name?.trim()) return res.status(400).json({ error: 'name is required' })
    const exampleCount = await (prisma as any).kimmpLearningExample.count({ where: { approved: true, quality: { gte: minQuality } } })
    const job = await (prisma as any).finetuneJob.create({
      data: { name: name.trim(), provider, minQuality, format, baseModel: baseModel ?? 'claude-haiku-4-5-20251001', notes: notes ?? null, exampleCount, createdBy: req.user!.userId },
    })
    res.status(201).json({ job })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// PATCH /admin/kangqore-immp/learning/finetune-jobs/:id
kangqoreImmpRoutes.patch('/learning/finetune-jobs/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { status, providerJobId, notes } = req.body
    const data: any = {}
    if (status) {
      data.status = status
      if (status === 'EXPORTING') data.exportedAt = new Date()
      if (status === 'SUBMITTED') data.submittedAt = new Date()
      if (status === 'COMPLETE' || status === 'FAILED') data.completedAt = new Date()
    }
    if (providerJobId) data.providerJobId = providerJobId
    if (notes !== undefined) data.notes = notes
    const job = await (prisma as any).finetuneJob.update({ where: { id: req.params.id }, data })
    res.json({ job })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// PATCH /admin/kangqore-immp/learning/examples/:id/rate  (annotation)
kangqoreImmpRoutes.patch('/learning/examples/:id/rate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { rating } = req.body   // 'good' | 'needs-improvement' | 'bad'
    const qualityMap: Record<string, number> = { good: 1.0, 'needs-improvement': 0.7, bad: 0.3 }
    const quality = qualityMap[rating]
    if (quality === undefined) return res.status(400).json({ error: 'rating must be good | needs-improvement | bad' })
    const ex = await (prisma as any).kimmpLearningExample.update({
      where: { id: req.params.id },
      data: { quality, approved: rating === 'good' },
    })
    res.json({ example: ex })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─── S55 — Marketplace ────────────────────────────────────────────────────────

// GET /admin/kangqore-immp/marketplace
kangqoreImmpRoutes.get('/marketplace', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const where: any = { status: 'PUBLISHED' }
    if (req.query.type)     where.type     = String(req.query.type)
    if (req.query.category) where.category = String(req.query.category)
    const listings = await (prisma as any).marketplaceListing.findMany({ where, orderBy: { installCount: 'desc' } })
    res.json({ listings })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/marketplace — submit listing
kangqoreImmpRoutes.post('/marketplace', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { type, name, author, category, description, longDesc, oisImpact, price, manifest, iconEmoji, tags, status = 'PUBLISHED' } = req.body
    if (!type || !name?.trim() || !author?.trim() || !category || !description?.trim() || !manifest) {
      return res.status(400).json({ error: 'type, name, author, category, description, manifest are required' })
    }
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
    const listing = await (prisma as any).marketplaceListing.create({
      data: { type, name: name.trim(), slug, author, category, description, longDesc: longDesc ?? null, oisImpact: oisImpact ?? null, price: price ?? 0, manifest, iconEmoji: iconEmoji ?? '🔌', tags: tags ?? [], status, publishedAt: status === 'PUBLISHED' ? new Date() : null },
    })
    res.status(201).json({ listing })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/marketplace/:id/install
kangqoreImmpRoutes.post('/marketplace/:id/install', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const listing = await (prisma as any).marketplaceListing.findUnique({ where: { id: req.params.id } })
    if (!listing) return res.status(404).json({ error: 'Listing not found' })

    // Increment install count
    await (prisma as any).marketplaceListing.update({ where: { id: req.params.id }, data: { installCount: { increment: 1 } } })

    // If agent type — auto-register via webhook stub
    let agentRegistration = null
    if (listing.type === 'AGENT' && (listing.manifest as any).webhookUrl) {
      const m = listing.manifest as any
      const secret = crypto.randomBytes(32).toString('hex')
      agentRegistration = await (prisma as any).externalAgent.create({
        data: { name: listing.name, role: m.role ?? 'MARKETPLACE_AGENT', capabilities: m.capabilities ?? [], webhookUrl: m.webhookUrl, secret, registeredBy: req.user!.userId },
      })
    }

    res.json({ ok: true, installed: listing.name, agentRegistration: agentRegistration ? { id: agentRegistration.id } : null })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// PATCH /admin/kangqore-immp/marketplace/:id/status
kangqoreImmpRoutes.patch('/marketplace/:id/status', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { status } = req.body
    const VALID = ['DRAFT', 'PUBLISHED', 'SUSPENDED']
    if (!VALID.includes(status)) return res.status(400).json({ error: `status must be one of ${VALID.join(', ')}` })
    const listing = await (prisma as any).marketplaceListing.update({ where: { id: req.params.id }, data: { status, publishedAt: status === 'PUBLISHED' ? new Date() : undefined } })
    res.json({ listing })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ═══════════════════════════════════════════════════════════════════════════════
// S61 — WAANDA Gen 2: Anthropic fine-tuning + Gen2 model registry + A/B routing
// ═══════════════════════════════════════════════════════════════════════════════

// POST /admin/kangqore-immp/learning/finetune-jobs/:id/submit
// Exports approved examples to JSONL and submits to Anthropic Fine-Tuning API
kangqoreImmpRoutes.post('/learning/finetune-jobs/:id/submit', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const job = await (prisma as any).finetuneJob.findUnique({ where: { id: req.params.id } })
    if (!job) return res.status(404).json({ error: 'Job not found' })
    if (job.status !== 'EXPORTING' && job.status !== 'PENDING') {
      return res.status(400).json({ error: `Cannot submit a job in status ${job.status}` })
    }

    // Fetch approved examples at the job's quality threshold
    const examples = await (prisma as any).kimmpLearningExample.findMany({
      where: { quality: { gte: job.minQuality }, approved: true },
      select: { systemPrompt: true, userMessage: true, idealResponse: true },
      take: 5000,
    })
    if (examples.length < 10) {
      return res.status(400).json({ error: `Need at least 10 approved examples (have ${examples.length})` })
    }

    // Build JSONL lines
    const lines: string[] = examples.map((ex: any) => JSON.stringify({
      messages: [
        { role: 'system',    content: ex.systemPrompt  },
        { role: 'user',      content: ex.userMessage   },
        { role: 'assistant', content: ex.idealResponse },
      ],
    }))

    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? ''
    if (!ANTHROPIC_KEY) {
      // Simulate submission for environments without the key
      const simJobId = `ftjob-sim-${Date.now()}`
      const updated = await (prisma as any).finetuneJob.update({
        where: { id: job.id },
        data: { status: 'TRAINING', providerJobId: simJobId, submittedAt: new Date(), exampleCount: examples.length },
      })
      return res.json({ ok: true, simulated: true, providerJobId: simJobId, exampleCount: examples.length, job: updated })
    }

    // Upload file to Anthropic
    const blob = new Blob([lines.join('\n')], { type: 'application/jsonl' })
    const formData = new FormData()
    formData.append('file', blob, 'training.jsonl')
    formData.append('purpose', 'fine-tune')

    const uploadRes = await fetch('https://api.anthropic.com/v1/files', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'anthropic-beta': 'fine-tuning-2024-08-20' },
      body: formData,
      signal: AbortSignal.timeout(30_000),
    })
    if (!uploadRes.ok) {
      const body = await uploadRes.text().catch(() => '')
      return res.status(502).json({ error: `Anthropic file upload failed: ${uploadRes.status} ${body.slice(0, 200)}` })
    }
    const uploadData = await uploadRes.json() as any
    const fileId = uploadData.id

    // Create fine-tuning job
    const ftRes = await fetch('https://api.anthropic.com/v1/fine-tuning/jobs', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'fine-tuning-2024-08-20',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: job.baseModel, training_file: fileId }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!ftRes.ok) {
      const body = await ftRes.text().catch(() => '')
      return res.status(502).json({ error: `Anthropic fine-tune submit failed: ${ftRes.status} ${body.slice(0, 200)}` })
    }
    const ftData = await ftRes.json() as any

    const updated = await (prisma as any).finetuneJob.update({
      where: { id: job.id },
      data: { status: 'TRAINING', providerJobId: ftData.id, submittedAt: new Date(), exampleCount: examples.length },
    })
    res.json({ ok: true, providerJobId: ftData.id, exampleCount: examples.length, job: updated })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/learning/finetune-jobs/:id/status
// Polls Anthropic for job status and updates DB
kangqoreImmpRoutes.get('/learning/finetune-jobs/:id/status', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const job = await (prisma as any).finetuneJob.findUnique({ where: { id: req.params.id } })
    if (!job) return res.status(404).json({ error: 'Job not found' })
    if (!job.providerJobId) return res.json({ job, providerStatus: null })

    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? ''
    if (!ANTHROPIC_KEY || job.providerJobId.startsWith('ftjob-sim-')) {
      return res.json({ job, providerStatus: { status: job.status, simulated: true } })
    }

    const pollRes = await fetch(`https://api.anthropic.com/v1/fine-tuning/jobs/${job.providerJobId}`, {
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'fine-tuning-2024-08-20',
      },
      signal: AbortSignal.timeout(10_000),
    })
    if (!pollRes.ok) return res.json({ job, providerStatus: null, pollError: pollRes.status })
    const providerData = await pollRes.json() as any

    // Map Anthropic status to internal status
    const statusMap: Record<string, string> = { queued: 'TRAINING', running: 'TRAINING', succeeded: 'COMPLETE', failed: 'FAILED', cancelled: 'FAILED' }
    const newStatus = statusMap[providerData.status] ?? job.status

    const data: any = { status: newStatus }
    if (newStatus === 'COMPLETE' && !job.completedAt) data.completedAt = new Date()
    const updated = await (prisma as any).finetuneJob.update({ where: { id: job.id }, data })

    res.json({ job: updated, providerStatus: providerData })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/learning/gen2-models
kangqoreImmpRoutes.get('/learning/gen2-models', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const models = await (prisma as any).gen2Model.findMany({ orderBy: { createdAt: 'desc' } })
    const deployed = models.find((m: any) => m.isDeployed) ?? null
    res.json({ models, deployed })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/learning/gen2-models
kangqoreImmpRoutes.post('/learning/gen2-models', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { name, provider, baseModel, providerModelId, finetuneJobId, benchmarkAccuracy, trainingExamples, notes } = req.body
    if (!name || !provider || !baseModel || !providerModelId) return res.status(400).json({ error: 'name, provider, baseModel, providerModelId required' })
    const model = await (prisma as any).gen2Model.create({
      data: { name, provider, baseModel, providerModelId, finetuneJobId, benchmarkAccuracy: benchmarkAccuracy ? parseFloat(benchmarkAccuracy) : undefined, trainingExamples: trainingExamples ? parseInt(trainingExamples) : 0, notes, createdBy: req.user!.userId },
    })
    res.json({ model })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// PATCH /admin/kangqore-immp/learning/gen2-models/:id/deploy
// Toggle deploy — undeploys all others first
kangqoreImmpRoutes.patch('/learning/gen2-models/:id/deploy', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { deploy } = req.body // boolean
    if (deploy) {
      await (prisma as any).gen2Model.updateMany({ data: { isDeployed: false, deployedAt: null } })
    }
    const model = await (prisma as any).gen2Model.update({
      where: { id: req.params.id },
      data: { isDeployed: !!deploy, deployedAt: deploy ? new Date() : null },
    })
    res.json({ model })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/learning/router-stats
kangqoreImmpRoutes.get('/learning/router-stats', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const { getRouterStats } = await import('./llm/kimmpLLMRouter')
    const stats = await getRouterStats()
    const deployedGen2 = await (prisma as any).gen2Model.findFirst({ where: { isDeployed: true }, select: { name: true, providerModelId: true, benchmarkAccuracy: true } }).catch(() => null)
    res.json({ ...stats, deployedGen2 })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ═══════════════════════════════════════════════════════════════════════════════
// S62 — Connector SDK: field maps + bidirectional sync + KIMMP signal bridge
// ═══════════════════════════════════════════════════════════════════════════════

// GET /admin/kangqore-immp/connectors/field-maps
kangqoreImmpRoutes.get('/connectors/field-maps', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const maps = await (prisma as any).connectorFieldMap.findMany({
      where: { createdBy: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ maps })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/connectors/field-maps
kangqoreImmpRoutes.post('/connectors/field-maps', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { platform, syncDirection, fieldMaps, webhookEvents } = req.body
    if (!platform || !fieldMaps) return res.status(400).json({ error: 'platform and fieldMaps required' })
    const existing = await (prisma as any).connectorFieldMap.findFirst({ where: { platform, createdBy: req.user!.userId } })
    const data = { platform, syncDirection: syncDirection ?? 'BIDIRECTIONAL', fieldMaps, webhookEvents: webhookEvents ?? [], createdBy: req.user!.userId, isActive: true }
    const map = existing
      ? await (prisma as any).connectorFieldMap.update({ where: { id: existing.id }, data })
      : await (prisma as any).connectorFieldMap.create({ data })
    res.json({ map })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/connectors/:platform/sync
// Trigger bidirectional sync — pulls from external platform, generates KIMMP signals for changes
kangqoreImmpRoutes.post('/connectors/:platform/sync', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { platform } = req.params
    const { config } = req.body  // IntegrationConfig from frontend
    const { ConnectorRegistry } = await import('../integrations/registry')
    const connector = ConnectorRegistry.get(platform)
    if (!connector) return res.status(404).json({ error: `Connector '${platform}' not registered` })

    // Test connection
    const testResult = await connector.adapter.test(config ?? {})
    if (!testResult.ok) return res.status(400).json({ error: `Connection test failed: ${testResult.message}` })

    // Get field map for this platform
    const fieldMap = await (prisma as any).connectorFieldMap.findFirst({ where: { platform, createdBy: req.user!.userId, isActive: true } })

    // Generate KIMMP signal about the sync
    await (prisma as any).kimmpSignal.create({
      data: {
        signalType: 'CONNECTOR_SYNC',
        severity:   'LOW',
        signalValue: `${platform} sync initiated`,
        source:      platform,
        agentSystem: 'CONNECTOR_SDK',
        metadata:    { platform, fieldMap: fieldMap?.id ?? null, triggeredBy: req.user!.userId },
        status:      'ACTIVE',
      },
    }).catch(() => {})

    res.json({ ok: true, platform, connection: testResult.message, fieldMapId: fieldMap?.id ?? null })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/connectors/inbound-event
// External platforms POST here when events occur (webhook sink)
// Generates KIMMP signals from inbound CRM/PM events
kangqoreImmpRoutes.post('/connectors/inbound-event', async (req, res) => {
  try {
    // SECURITY: this is an external webhook sink — verify a shared secret before
    // trusting the payload, otherwise anyone can inject arbitrary signals into KIMMP.
    const expectedSecret = process.env.KIMMP_WEBHOOK_SECRET
    if (!expectedSecret) {
      logger.error('KIMMP_WEBHOOK_SECRET is not set — rejecting inbound webhook (fail closed)')
      return res.status(503).json({ error: 'Webhook not configured' })
    }
    const providedSecret = req.get('x-kimmp-webhook-secret') || ''
    const expectedBuf = Buffer.from(expectedSecret)
    const providedBuf = Buffer.from(providedSecret)
    const isValid = expectedBuf.length === providedBuf.length && crypto.timingSafeEqual(expectedBuf, providedBuf)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid webhook secret' })
    }

    const { platform, eventType, payload } = req.body
    if (!platform || !eventType) return res.status(400).json({ error: 'platform and eventType required' })

    const severityMap: Record<string, string> = {
      'deal.lost': 'HIGH', 'contact.churned': 'HIGH', 'issue.critical': 'HIGH',
      'deal.won': 'LOW', 'contact.created': 'LOW', 'issue.created': 'LOW',
    }
    const severity = severityMap[eventType] ?? 'MEDIUM'

    await (prisma as any).kimmpSignal.create({
      data: {
        signalType:  'CONNECTOR_EVENT',
        severity,
        signalValue: `${platform}: ${eventType}`,
        source:      platform,
        agentSystem: 'CONNECTOR_WEBHOOK',
        metadata:    { platform, eventType, payload: JSON.stringify(payload ?? {}).slice(0, 500) },
        status:      'ACTIVE',
      },
    }).catch(() => {})

    res.json({ ok: true, received: eventType })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ═══════════════════════════════════════════════════════════════════════════════
// S63 — Customer Three–Five: Blueprint clone + customer pipeline
// ═══════════════════════════════════════════════════════════════════════════════

// GET /admin/kangqore-immp/customers/pipeline
kangqoreImmpRoutes.get('/customers/pipeline', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    // Aggregate OIS-like readiness for prospective C3/C4/C5
    // In production these would be pulled from real OIS snapshots per customer
    // Here we return the scaffold for the pipeline page
    const customers = await (prisma as any).kangqoreCustomer?.findMany?.({ orderBy: { createdAt: 'asc' } }).catch(() => null)
    res.json({ pipeline: customers ?? [], total: customers?.length ?? 0 })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/customers/blueprint-clone
// Clones blueprint.json, strips customer-specific data, bumps version
kangqoreImmpRoutes.post('/customers/blueprint-clone', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { sourceBlueprintVersion, targetCustomerName, packId } = req.body
    if (!targetCustomerName) return res.status(400).json({ error: 'targetCustomerName required' })

    // Parse version and bump patch
    const version = sourceBlueprintVersion ?? '1.0'
    const [major, minor = 0, patch = 0] = version.split('.').map(Number)
    const newVersion = `${major}.${minor}.${patch + 1}`

    const cloned = {
      version:          newVersion,
      customerName:     targetCustomerName,
      packId:           packId ?? 'ps-pack-v1',
      generatedAt:      new Date().toISOString(),
      generatedBy:      'Blueprint Clone Engine',
      modules:          ['projects', 'finance', 'people', 'governance', 'intelligence'],
      kimmpConfig: {
        agentWarmup:    '20→80 over 14 days',
        oisBaseline:    null,
        coigTarget:     13.0,
        onboardingDays: 1.5,
      },
      securityPolicy: {
        ipAllowlist:    [],
        ssoEnabled:     false,
        auditLevel:     'FULL',
      },
      note: `Cloned from v${version}. Strip customer-specific data before delivery.`,
    }

    res.json({ ok: true, blueprint: cloned, version: newVersion })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ═══════════════════════════════════════════════════════════════════════════════
// S65 — AEGIS Depth P2: policy enforcement + KIMMP signal bridge
// ═══════════════════════════════════════════════════════════════════════════════

// POST /admin/kangqore-immp/aegis/policy-violation
// Called by AEGIS when a policy is violated — generates a KIMMP signal + AEGIS evidence
kangqoreImmpRoutes.post('/aegis/policy-violation', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { policyId, policyName, severity, violatorId, violatorRole, endpoint, detail } = req.body
    if (!policyId || !severity) return res.status(400).json({ error: 'policyId and severity required' })

    const signal = await (prisma as any).kimmpSignal.create({
      data: {
        signalType:  'AEGIS_POLICY_VIOLATION',
        severity:    severity.toUpperCase(),
        signalValue: `Policy violated: ${policyName ?? policyId}`,
        source:      'AEGIS',
        agentSystem: 'AEGIS_SHIELD',
        metadata:    { policyId, policyName, violatorId, violatorRole, endpoint, detail },
        status:      'ACTIVE',
      },
    })
    res.json({ ok: true, signalId: signal.id })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/aegis/threat-feed
// Aggregates shield + egress data into IP reputation + threat severity matrix
kangqoreImmpRoutes.get('/aegis/threat-feed', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { limit = 50 } = req.query

    // Pull from AEGIS shield log (blocked requests) if model exists
    const shieldRows = await (prisma as any).aegisShieldLog?.findMany?.({
      orderBy: { createdAt: 'desc' },
      take:    parseInt(String(limit)),
      select:  { id: true, ipAddress: true, endpoint: true, method: true, userId: true, userRole: true, reason: true, createdAt: true },
    }).catch(() => []) ?? []

    // Compute per-IP reputation: more blocks → lower score
    const ipMap: Record<string, { count: number; lastSeen: string; endpoints: Set<string> }> = {}
    for (const row of shieldRows) {
      const ip = row.ipAddress ?? 'unknown'
      if (!ipMap[ip]) ipMap[ip] = { count: 0, lastSeen: row.createdAt, endpoints: new Set() }
      ipMap[ip].count++
      if (row.endpoint) ipMap[ip].endpoints.add(row.endpoint)
      if (row.createdAt > ipMap[ip].lastSeen) ipMap[ip].lastSeen = row.createdAt
    }

    const ipReputation = Object.entries(ipMap).map(([ip, data]) => ({
      ip,
      blockCount:   data.count,
      reputationScore: Math.max(0, 100 - data.count * 10),
      severity:     data.count >= 5 ? 'CRITICAL' : data.count >= 3 ? 'HIGH' : 'MEDIUM',
      lastSeen:     data.lastSeen,
      uniqueEndpoints: data.endpoints.size,
    })).sort((a, b) => b.blockCount - a.blockCount)

    res.json({ threatFeed: shieldRows, ipReputation, total: shieldRows.length })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/aegis/export-control-rules
kangqoreImmpRoutes.get('/aegis/export-control-rules', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    // Export control rules are stored in OrgIntegrationConfig or a dedicated table
    // For now return the policy scaffold
    const rules = [
      { id: 'block-pii-export',  name: 'Block PII Export',      active: true,  description: 'Prevent export of fields matching PII patterns (email, phone, ssn)', severity: 'CRITICAL', action: 'BLOCK' },
      { id: 'allowlist-dest',    name: 'Allowlist Destinations', active: true,  description: 'Only allow egress to approved API endpoints', severity: 'HIGH',     action: 'BLOCK' },
      { id: 'log-all-egress',    name: 'Log All Egress',         active: true,  description: 'Capture every outbound API call in AEGIS egress log', severity: 'LOW',      action: 'LOG'   },
      { id: 'rate-limit-export', name: 'Rate-limit Bulk Export', active: false, description: 'Flag any single request exporting >1000 records', severity: 'HIGH',     action: 'FLAG'  },
    ]
    res.json({ rules })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ════════════════════════════════════════════════════════════════════════════
// S66 — Marketplace Monetisation: Tiers · Reviews · Partner Dashboard
// ════════════════════════════════════════════════════════════════════════════

// GET /admin/kangqore-immp/marketplace/tiers
kangqoreImmpRoutes.get('/marketplace/tiers', requireAuth, async (_req, res) => {
  try {
    const tiers = await (prisma as any).listingTier.findMany({ orderBy: { monthlyPrice: 'asc' } })
    if (tiers.length === 0) {
      // Seed default tiers on first access
      const defaults = [
        { name: 'FREE',       monthlyPrice: 0,    quota: 500,   features: ['5 listings', '500 API calls/mo', 'Community support'] },
        { name: 'STARTER',    monthlyPrice: 29,   quota: 5000,  features: ['25 listings', '5,000 API calls/mo', 'Email support', 'Usage analytics'] },
        { name: 'PRO',        monthlyPrice: 99,   quota: 50000, features: ['Unlimited listings', '50,000 API calls/mo', 'Priority support', 'Revenue dashboard', 'Verified badge'] },
        { name: 'ENTERPRISE', monthlyPrice: 0,    quota: 0,     features: ['Custom quota', 'Dedicated CSM', 'SLA 99.9%', 'Custom billing', 'Early access'] },
      ]
      await (prisma as any).listingTier.createMany({ data: defaults, skipDuplicates: true })
      return res.json({ tiers: await (prisma as any).listingTier.findMany({ orderBy: { monthlyPrice: 'asc' } }) })
    }
    res.json({ tiers })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/marketplace/:id/reviews
kangqoreImmpRoutes.get('/marketplace/:id/reviews', requireAuth, async (req, res) => {
  try {
    const reviews = await (prisma as any).marketplaceReview.findMany({
      where: { listingId: req.params.id },
      orderBy: { createdAt: 'desc' },
    })
    const avg = reviews.length ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : null
    res.json({ reviews, avgRating: avg ? Math.round(avg * 10) / 10 : null, count: reviews.length })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/marketplace/:id/reviews
kangqoreImmpRoutes.post('/marketplace/:id/reviews', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user?.id ?? 'system'
    const { rating, comment } = req.body
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'rating must be 1–5' })
    const review = await (prisma as any).marketplaceReview.upsert({
      where:  { listingId_authorId: { listingId: req.params.id, authorId: userId } },
      update: { rating, comment },
      create: { listingId: req.params.id, authorId: userId, rating, comment },
    })
    res.json(review)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/marketplace/partner/dashboard
kangqoreImmpRoutes.get('/marketplace/partner/dashboard', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const listings = await (prisma as any).marketplaceListing.findMany({ select: { id: true, name: true, installCount: true, price: true, platformFee: true, type: true } })
    const charges  = await (prisma as any).marketplaceCharge.findMany()
    const revenue  = charges.reduce((s: number, c: any) => s + (c.status === 'CAPTURED' ? c.amount - c.platformFee : 0), 0)
    const refunds  = charges.reduce((s: number, c: any) => s + (c.status === 'REFUNDED' ? c.amount : 0), 0)
    const perListing = listings.map((l: any) => {
      const lCharges = charges.filter((c: any) => c.listingId === l.id)
      return {
        ...l,
        revenue:  lCharges.filter((c: any) => c.status === 'CAPTURED').reduce((s: number, c: any) => s + c.amount, 0),
        refunds:  lCharges.filter((c: any) => c.status === 'REFUNDED').reduce((s: number, c: any) => s + c.amount, 0),
        charges:  lCharges.length,
      }
    })
    res.json({ totalRevenue: revenue, totalRefunds: refunds, totalInstalls: listings.reduce((s: number, l: any) => s + l.installCount, 0), listings: perListing })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ════════════════════════════════════════════════════════════════════════════
// S67 — Multi-Tenant Provisioning
// ════════════════════════════════════════════════════════════════════════════

// GET /admin/kangqore-immp/tenants
kangqoreImmpRoutes.get('/tenants', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const tenants = await (prisma as any).tenantOrganisation.findMany({ orderBy: { createdAt: 'desc' } })
    res.json({ tenants, total: tenants.length, active: tenants.filter((t: any) => t.isActive).length })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/tenants
kangqoreImmpRoutes.post('/tenants', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.id ?? 'system'
    const { name, subdomain, isolationMode, planTier, maxUsers, maxAgents, blueprintId, blueprintVersion, enabledModules } = req.body
    if (!name || !subdomain) return res.status(400).json({ error: 'name and subdomain required' })
    const existing = await (prisma as any).tenantOrganisation.findUnique({ where: { subdomain } })
    if (existing) return res.status(409).json({ error: 'subdomain already taken' })
    const tenant = await (prisma as any).tenantOrganisation.create({
      data: {
        name, subdomain, isolationMode: isolationMode ?? 'ROW_LEVEL',
        planTier: planTier ?? 'STARTER',
        maxUsers: maxUsers ?? 10, maxAgents: maxAgents ?? 20,
        blueprintId, blueprintVersion,
        enabledModules: enabledModules ?? ['KIMMP', 'WAANDA', 'AEGIS', 'KEOS'],
        disabledModules: [],
        provisionedBy: userId,
      }
    })
    res.status(201).json(tenant)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/tenants/:id
kangqoreImmpRoutes.get('/tenants/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const tenant = await (prisma as any).tenantOrganisation.findUnique({ where: { id: req.params.id } })
    if (!tenant) return res.status(404).json({ error: 'tenant not found' })
    res.json(tenant)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// PATCH /admin/kangqore-immp/tenants/:id
kangqoreImmpRoutes.patch('/tenants/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { planTier, maxUsers, maxAgents, enabledModules, disabledModules, isActive, blueprintId, blueprintVersion, oisSnapshotsPerMonth, apiCallsPerDay } = req.body
    const tenant = await (prisma as any).tenantOrganisation.update({
      where: { id: req.params.id },
      data: { planTier, maxUsers, maxAgents, enabledModules, disabledModules, isActive, blueprintId, blueprintVersion, oisSnapshotsPerMonth, apiCallsPerDay },
    })
    res.json(tenant)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/tenants/:id/provision
kangqoreImmpRoutes.post('/tenants/:id/provision', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.id ?? 'system'
    const tenant = await (prisma as any).tenantOrganisation.findUnique({ where: { id: req.params.id } })
    if (!tenant) return res.status(404).json({ error: 'tenant not found' })
    // Provisioning checklist: run seed steps
    const steps = [
      'org_created', 'blueprint_bound', 'departments_seeded', 'kimmp_init',
      'ois_baseline_set', 'waanda_cycle_activated', 'aegis_policies_applied',
      'keos_workspaces_initialised', 'admin_user_invited', 'go_live_signal_fired',
    ]
    // Fire a go-live KimmpSignal
    await (prisma as any).kimmpSignal.create({
      data: {
        type: 'TENANT_PROVISIONED', source: 'SYSTEM', priority: 'HIGH',
        title: `Tenant provisioned: ${tenant.name}`,
        description: `Subdomain: ${tenant.subdomain} | Plan: ${tenant.planTier} | Blueprint: ${tenant.blueprintId ?? 'none'}`,
        status: 'ACTIVE', createdBy: userId,
      }
    })
    const updated = await (prisma as any).tenantOrganisation.update({
      where: { id: req.params.id },
      data: { provisionedAt: new Date(), provisionedBy: userId },
    })
    res.json({ tenant: updated, steps, provisionedAt: updated.provisionedAt })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ════════════════════════════════════════════════════════════════════════════
// S68 — WAANDA Foundation: Autonomy Config + A/B Traffic Split
// ════════════════════════════════════════════════════════════════════════════

// GET /admin/kangqore-immp/learning/autonomy-config
kangqoreImmpRoutes.get('/learning/autonomy-config', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    let config = await (prisma as any).autonomyConfig.findFirst({ orderBy: { createdAt: 'desc' } })
    if (!config) config = await (prisma as any).autonomyConfig.create({ data: { gen2TrafficPct: 0 } })
    res.json(config)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// PATCH /admin/kangqore-immp/learning/autonomy-config
kangqoreImmpRoutes.patch('/learning/autonomy-config', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.id ?? 'system'
    const { gen2TrafficPct } = req.body
    if (gen2TrafficPct === undefined || gen2TrafficPct < 0 || gen2TrafficPct > 100) {
      return res.status(400).json({ error: 'gen2TrafficPct must be 0–100' })
    }
    let config = await (prisma as any).autonomyConfig.findFirst({ orderBy: { createdAt: 'desc' } })
    if (config) {
      config = await (prisma as any).autonomyConfig.update({
        where: { id: config.id },
        data: { gen2TrafficPct, updatedBy: userId, enabledAt: gen2TrafficPct > 0 ? new Date() : null },
      })
    } else {
      config = await (prisma as any).autonomyConfig.create({
        data: { gen2TrafficPct, updatedBy: userId, enabledAt: gen2TrafficPct > 0 ? new Date() : null },
      })
    }
    res.json(config)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/learning/autonomy-stats
kangqoreImmpRoutes.get('/learning/autonomy-stats', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const config   = await (prisma as any).autonomyConfig.findFirst({ orderBy: { createdAt: 'desc' } })
    const deployed = await (prisma as any).gen2Model.findFirst({ where: { isDeployed: true } })
    const overrides = await (prisma as any).kimmpSignal.count({ where: { type: 'HUMAN_OVERRIDE' } })
    const totalDecisions = await (prisma as any).kimmpStrategicDecision.count()
    const gen2TrafficPct = config?.gen2TrafficPct ?? 0
    res.json({
      gen2TrafficPct,
      deployedModel: deployed ? { id: deployed.id, name: deployed.name, benchmarkAccuracy: deployed.benchmarkAccuracy } : null,
      humanOverrideRate: totalDecisions > 0 ? Math.round((overrides / totalDecisions) * 100) : 0,
      gen1TrafficPct: 100 - gen2TrafficPct,
      autonomyEnabled: gen2TrafficPct > 0,
    })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ════════════════════════════════════════════════════════════════════════════
// S69 — Customer Success Deep: Health Scores · NPS · Churn Risk
// ════════════════════════════════════════════════════════════════════════════

// GET /admin/kangqore-immp/customers/health-scores
kangqoreImmpRoutes.get('/customers/health-scores', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const scores = await (prisma as any).customerHealthScore.findMany({ orderBy: { computedAt: 'desc' } })
    res.json({ scores, atRisk: scores.filter((s: any) => s.tier === 'RED').length, amber: scores.filter((s: any) => s.tier === 'AMBER').length })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/customers/:customerId/health-score
kangqoreImmpRoutes.post('/customers/:customerId/health-score', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { customerId } = req.params
    const {
      oisDelta = 0, coigVelocity = 0, loginFrequency = 0, featureDepth = 0,
      signalVolume = 0, agentUsage = 0, workflowRuns = 0, blueprintVersionLag = 0,
      npsScore, supportTickets = 0, renewalProximityDays = 365, daysSinceLastDecision = 0,
    } = req.body
    // Weighted scoring: higher is better (scale 0–100)
    const score =
      Math.min(oisDelta * 5, 20)          // OIS delta up to 20pts
      + Math.min(coigVelocity * 3, 15)    // COIG velocity up to 15pts
      + Math.min(loginFrequency * 2, 10)  // login freq up to 10pts
      + featureDepth * 15                  // feature breadth up to 15pts
      + Math.min(signalVolume / 10, 10)   // signal volume up to 10pts
      + agentUsage * 10                    // agent utilisation up to 10pts
      + Math.min(workflowRuns / 5, 5)     // workflow runs up to 5pts
      + Math.max(0, 5 - blueprintVersionLag * 2) // version currency up to 5pts
      + (npsScore !== undefined ? Math.min(npsScore, 5) : 2.5) // NPS up to 5pts
      + Math.max(0, 5 - supportTickets)   // support load up to 5pts
    const totalScore = Math.min(Math.round(score * 10) / 10, 100)
    const tier = totalScore >= 70 ? 'GREEN' : totalScore >= 40 ? 'AMBER' : 'RED'
    const record = await (prisma as any).customerHealthScore.create({
      data: { customerId, oisDelta, coigVelocity, loginFrequency, featureDepth, signalVolume, agentUsage, workflowRuns, blueprintVersionLag, npsScore, supportTickets, renewalProximityDays, daysSinceLastDecision, totalScore, tier, computedAt: new Date() }
    })
    // Auto-trigger KIMMP playbook signal if AMBER or RED
    if (tier !== 'GREEN') {
      await (prisma as any).kimmpSignal.create({
        data: {
          type: 'CUSTOMER_HEALTH_ALERT', source: 'CUSTOMER_SUCCESS', priority: tier === 'RED' ? 'CRITICAL' : 'HIGH',
          title: `Customer health ${tier}: ${customerId}`,
          description: `Health score: ${totalScore}/100. Tier: ${tier}. Renewal in ${renewalProximityDays} days.`,
          status: 'ACTIVE', createdBy: 'system',
        }
      })
    }
    res.status(201).json(record)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/customers/nps
kangqoreImmpRoutes.get('/customers/nps', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    const responses = await (prisma as any).npsResponse.findMany({ orderBy: { createdAt: 'desc' } })
    const scores = responses.map((r: any) => r.score)
    const promoters  = responses.filter((r: any) => r.category === 'PROMOTER').length
    const detractors = responses.filter((r: any) => r.category === 'DETRACTOR').length
    const nps = responses.length > 0 ? Math.round(((promoters - detractors) / responses.length) * 100) : null
    res.json({ responses, nps, count: responses.length, avg: scores.length ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 10) / 10 : null })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/customers/:customerId/nps
kangqoreImmpRoutes.post('/customers/:customerId/nps', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.id ?? 'system'
    const { score, comment, surveyTrigger } = req.body
    if (score === undefined || score < 0 || score > 10) return res.status(400).json({ error: 'score must be 0–10' })
    const category = score >= 9 ? 'PROMOTER' : score >= 7 ? 'PASSIVE' : 'DETRACTOR'
    const response = await (prisma as any).npsResponse.create({
      data: { customerId: req.params.customerId, score, category, comment, surveyTrigger: surveyTrigger ?? 'MANUAL', createdBy: userId }
    })
    res.status(201).json(response)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/customers/churn-risk
kangqoreImmpRoutes.get('/customers/churn-risk', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    // Latest health score per customer as churn risk proxy
    const all = await (prisma as any).customerHealthScore.findMany({ orderBy: { computedAt: 'desc' } })
    const seen = new Set<string>()
    const latest: any[] = []
    for (const s of all) { if (!seen.has(s.customerId)) { seen.add(s.customerId); latest.push(s) } }
    const withRisk = latest.map((s: any) => ({
      ...s,
      churnProbability: s.tier === 'RED' ? 0.7 + Math.random() * 0.3 : s.tier === 'AMBER' ? 0.3 + Math.random() * 0.3 : Math.random() * 0.15,
      playbook: s.tier === 'RED' ? 'ESCALATE' : s.tier === 'AMBER' ? 'NURTURE' : 'MAINTAIN',
    }))
    res.json({ customers: withRisk, highRisk: withRisk.filter((c: any) => c.tier === 'RED').length })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ════════════════════════════════════════════════════════════════════════════
// S70 — Enterprise Security: SOC2 Controls · RBAC Scopes · Security Findings
// ════════════════════════════════════════════════════════════════════════════

// GET /admin/kangqore-immp/aegis/compliance-controls
kangqoreImmpRoutes.get('/aegis/compliance-controls', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  try {
    let controls = await (prisma as any).complianceControl.findMany({ orderBy: [{ criteria: 'asc' }, { code: 'asc' }] })
    if (controls.length === 0) {
      // Seed SOC2 CC1–CC9 scaffold
      const seed = [
        { code: 'CC1.1', criteria: 'CC1', name: 'Control Environment — Integrity & Ethics',       status: 'PARTIAL',  description: 'Organisation demonstrates commitment to integrity and ethical values' },
        { code: 'CC1.2', criteria: 'CC1', name: 'Control Environment — Board Oversight',           status: 'MISSING',  description: 'Board or governing body demonstrates independence from management' },
        { code: 'CC2.1', criteria: 'CC2', name: 'Communication — Internal Communication',          status: 'IN_PLACE', description: 'Internal communication of security responsibilities and policies' },
        { code: 'CC3.1', criteria: 'CC3', name: 'Risk Assessment — Risk Identification',           status: 'PARTIAL',  description: 'Identifies and assesses risks to achieving security objectives' },
        { code: 'CC4.1', criteria: 'CC4', name: 'Monitoring — Ongoing Evaluation',                status: 'MISSING',  description: 'Selects, develops and performs ongoing monitoring activities' },
        { code: 'CC5.1', criteria: 'CC5', name: 'Control Activities — Technology Controls',        status: 'PARTIAL',  description: 'Technology controls selected and developed to achieve objectives' },
        { code: 'CC6.1', criteria: 'CC6', name: 'Logical Access — Access Management',              status: 'IN_PLACE', description: 'Logical access security software, infrastructure, and architectures' },
        { code: 'CC6.2', criteria: 'CC6', name: 'Logical Access — New Access Provisioning',       status: 'PARTIAL',  description: 'Prior to issuing system credentials and granting system access' },
        { code: 'CC6.3', criteria: 'CC6', name: 'Logical Access — Access Removal',                status: 'MISSING',  description: 'Removes access to protected information assets when no longer required' },
        { code: 'CC7.1', criteria: 'CC7', name: 'System Operations — Vulnerability Management',   status: 'MISSING',  description: 'Detection and monitoring of vulnerabilities and threats' },
        { code: 'CC8.1', criteria: 'CC8', name: 'Change Management — Infrastructure Changes',      status: 'PARTIAL',  description: 'Authorises, designs, develops, tests and implements changes' },
        { code: 'CC9.1', criteria: 'CC9', name: 'Risk Mitigation — Vendor Risk Management',       status: 'MISSING',  description: 'Identifies, selects and develops risk mitigation activities for risks with vendors' },
      ]
      await (prisma as any).complianceControl.createMany({ data: seed, skipDuplicates: true })
      controls = await (prisma as any).complianceControl.findMany({ orderBy: [{ criteria: 'asc' }, { code: 'asc' }] })
    }
    const summary = { total: controls.length, in_place: controls.filter((c: any) => c.status === 'IN_PLACE').length, partial: controls.filter((c: any) => c.status === 'PARTIAL').length, missing: controls.filter((c: any) => c.status === 'MISSING').length }
    res.json({ controls, summary })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// PATCH /admin/kangqore-immp/aegis/compliance-controls/:id
kangqoreImmpRoutes.patch('/aegis/compliance-controls/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { status, evidenceUrl, evidenceNote, lastTestedAt, ownerId } = req.body
    const control = await (prisma as any).complianceControl.update({
      where: { id: req.params.id },
      data: { status, evidenceUrl, evidenceNote, lastTestedAt: lastTestedAt ? new Date(lastTestedAt) : undefined, ownerId },
    })
    res.json(control)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/aegis/permission-scopes
kangqoreImmpRoutes.get('/aegis/permission-scopes', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { userId } = req.query
    const scopes = await (prisma as any).permissionScope.findMany({
      where: userId ? { userId: String(userId) } : {},
      orderBy: [{ userId: 'asc' }, { workspace: 'asc' }],
    })
    res.json({ scopes })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/aegis/permission-scopes
kangqoreImmpRoutes.post('/aegis/permission-scopes', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const grantedBy = (req as any).user?.id ?? 'system'
    const { userId, workspace, feature, action } = req.body
    if (!userId || !workspace || !feature || !action) return res.status(400).json({ error: 'userId, workspace, feature, action required' })
    const scope = await (prisma as any).permissionScope.upsert({
      where:  { userId_workspace_feature: { userId, workspace, feature } },
      update: { action, grantedBy },
      create: { userId, workspace, feature, action, grantedBy },
    })
    res.status(201).json(scope)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// DELETE /admin/kangqore-immp/aegis/permission-scopes/:id
kangqoreImmpRoutes.delete('/aegis/permission-scopes/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    await (prisma as any).permissionScope.delete({ where: { id: req.params.id } })
    res.status(204).send()
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/aegis/security-findings
kangqoreImmpRoutes.get('/aegis/security-findings', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { severity, status } = req.query
    const findings = await (prisma as any).securityFinding.findMany({
      where: { severity: severity ? String(severity) : undefined, status: status ? String(status) : undefined },
      orderBy: [{ severity: 'asc' }, { discoveredAt: 'desc' }],
    })
    const summary = { open: findings.filter((f: any) => f.status === 'OPEN').length, critical: findings.filter((f: any) => f.severity === 'CRITICAL' && f.status === 'OPEN').length }
    res.json({ findings, summary })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/aegis/security-findings
kangqoreImmpRoutes.post('/aegis/security-findings', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.id ?? 'system'
    const { title, severity, description, cveRef, affectedArea } = req.body
    if (!title || !severity || !description) return res.status(400).json({ error: 'title, severity, description required' })
    const finding = await (prisma as any).securityFinding.create({
      data: { title, severity, description, cveRef, affectedArea, status: 'OPEN', createdBy: userId, discoveredAt: new Date() }
    })
    if (severity === 'CRITICAL' || severity === 'HIGH') {
      await (prisma as any).kimmpSignal.create({
        data: {
          type: 'SECURITY_FINDING', source: 'AEGIS', priority: severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
          title: `Security finding: ${title}`,
          description: `Severity: ${severity}${cveRef ? ` | CVE: ${cveRef}` : ''}. ${description.slice(0, 200)}`,
          status: 'ACTIVE', createdBy: userId,
        }
      })
    }
    res.status(201).json(finding)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// PATCH /admin/kangqore-immp/aegis/security-findings/:id
kangqoreImmpRoutes.patch('/aegis/security-findings/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const userId = (req as any).user?.id ?? 'system'
    const { status, affectedArea } = req.body
    const finding = await (prisma as any).securityFinding.update({
      where: { id: req.params.id },
      data: { status, affectedArea, resolvedAt: status === 'MITIGATED' || status === 'ACCEPTED' ? new Date() : undefined, resolvedBy: status !== 'OPEN' ? userId : undefined },
    })
    res.json(finding)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

export { kangqoreImmpRoutes };

// ─────────────────────────────────────────────────────────────────────────────
// S72 — Analytics + Executive Reporting
// ─────────────────────────────────────────────────────────────────────────────

// GET /admin/kangqore-immp/reports/executive-dashboard
kangqoreImmpRoutes.get('/reports/executive-dashboard', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const [healthScores, npsAll, signals, decisions] = await Promise.all([
      (prisma as any).customerHealthScore.findMany({ orderBy: { computedAt: 'desc' }, take: 20 }),
      (prisma as any).npsResponse.findMany({}),
      (prisma as any).kimmpSignal.count({}),
      (prisma as any).kimmpStrategicDecision.count({}),
    ])
    const customers = healthScores.reduce((acc: any, h: any) => {
      if (!acc[h.customerId]) acc[h.customerId] = []
      acc[h.customerId].push(h)
      return acc
    }, {} as Record<string, any[]>)
    const npsTotal = npsAll.length
    const promoters  = npsAll.filter((n: any) => n.category === 'PROMOTER').length
    const detractors = npsAll.filter((n: any) => n.category === 'DETRACTOR').length
    const npsScore   = npsTotal > 0 ? Math.round(((promoters - detractors) / npsTotal) * 100) : null
    res.json({
      customerCount:   Object.keys(customers).length,
      avgHealthScore:  healthScores.length > 0 ? Math.round(healthScores.reduce((s: number, h: any) => s + h.totalScore, 0) / healthScores.length) : null,
      tierBreakdown:   { GREEN: healthScores.filter((h: any) => h.tier === 'GREEN').length, AMBER: healthScores.filter((h: any) => h.tier === 'AMBER').length, RED: healthScores.filter((h: any) => h.tier === 'RED').length },
      npsScore,
      signalCount:     signals,
      decisionCount:   decisions,
      customers:       Object.entries(customers).map(([id, scores]: [string, any]) => ({ customerId: id, latest: scores[0], sparkline: scores.slice(0, 6).map((s: any) => s.totalScore).reverse() })),
    })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/reports/generate
kangqoreImmpRoutes.post('/reports/generate', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { customerId, dateFrom, dateTo, title } = req.body
    if (!customerId || !dateFrom || !dateTo) return res.status(400).json({ error: 'customerId, dateFrom, dateTo required' })
    const from = new Date(dateFrom)
    const to   = new Date(dateTo)
    const [healthScores, npsResponses, signals, decisions, workflows] = await Promise.all([
      (prisma as any).customerHealthScore.findMany({ where: { customerId, createdAt: { gte: from, lte: to } }, orderBy: { createdAt: 'asc' } }),
      (prisma as any).npsResponse.findMany({ where: { customerId, createdAt: { gte: from, lte: to } } }),
      (prisma as any).kimmpSignal.findMany({ where: { createdAt: { gte: from, lte: to } }, orderBy: { createdAt: 'desc' }, take: 5 }),
      (prisma as any).kimmpStrategicDecision.count({ where: { createdAt: { gte: from, lte: to } } }),
      (prisma as any).osWorkflow.count({ where: { createdAt: { gte: from, lte: to } } }),
    ])
    const baseline  = healthScores[0]?.totalScore ?? null
    const current   = healthScores[healthScores.length - 1]?.totalScore ?? null
    const npsScores = npsResponses.map((n: any) => n.score)
    const avgNps    = npsScores.length > 0 ? Math.round(npsScores.reduce((a: number, b: number) => a + b, 0) / npsScores.length) : null
    const data = { customerId, dateFrom, dateTo, oisBaseline: baseline, oisCurrent: current, oisDelta: baseline && current ? current - baseline : null, avgNps, npsCount: npsScores.length, decisionsCount: decisions, workflowsCount: workflows, topSignals: signals.slice(0, 5).map((s: any) => ({ title: s.title, type: s.type, priority: s.priority, date: s.createdAt })), healthSparkline: healthScores.map((h: any) => ({ score: h.totalScore, tier: h.tier, date: h.computedAt })) }
    const doc = await (prisma as any).reportDocument.create({
      data: { customerId, title: title || `${customerId} Report ${dateFrom}–${dateTo}`, dateFrom: from, dateTo: to, data, status: 'READY', generatedBy: (req as any).user?.id },
    })
    res.status(201).json(doc)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/reports
kangqoreImmpRoutes.get('/reports', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { customerId } = req.query
    const where: any = customerId ? { customerId: customerId as string } : {}
    const docs = await (prisma as any).reportDocument.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 })
    res.json(docs)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/reports/:id
kangqoreImmpRoutes.get('/reports/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const doc = await (prisma as any).reportDocument.findUnique({ where: { id: req.params.id } })
    if (!doc) return res.status(404).json({ error: 'not found' })
    res.json(doc)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/reports/scheduled
kangqoreImmpRoutes.get('/reports/scheduled', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const schedules = await (prisma as any).scheduledReport.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(schedules)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /admin/kangqore-immp/reports/scheduled
kangqoreImmpRoutes.post('/reports/scheduled', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { title, customerId, cronExpr, recipients, template } = req.body
    if (!title || !cronExpr || !recipients?.length) return res.status(400).json({ error: 'title, cronExpr, recipients required' })
    const schedule = await (prisma as any).scheduledReport.create({
      data: { title, customerId, cronExpr, recipients, template: template ?? 'EXECUTIVE', createdBy: (req as any).user?.id },
    })
    res.status(201).json(schedule)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// PATCH /admin/kangqore-immp/reports/scheduled/:id
kangqoreImmpRoutes.patch('/reports/scheduled/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { active, cronExpr, recipients } = req.body
    const schedule = await (prisma as any).scheduledReport.update({ where: { id: req.params.id }, data: { active, cronExpr, recipients } })
    res.json(schedule)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// ─────────────────────────────────────────────────────────────────────────────
// S76 — WAANDA Gen 3 Kernel P1 — PlanDecompositionTree
// ─────────────────────────────────────────────────────────────────────────────

// POST /admin/kangqore-immp/gen3/plans
kangqoreImmpRoutes.post('/gen3/plans', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { goal } = req.body
    if (!goal) return res.status(400).json({ error: 'goal required' })

    // Concurrency check — reject if already at limit
    const maxConcurrent = parseInt(process.env.GEN3_MAX_CONCURRENT_PLANS ?? '3', 10)
    const activeCount = await (prisma as any).planDecompositionTree.count({ where: { status: 'ACTIVE' } })
    if (activeCount >= maxConcurrent) {
      return res.status(429).json({ error: `Concurrency limit reached (${activeCount}/${maxConcurrent} active plans). Wait for a plan to complete.` })
    }

    const deployedModel = await (prisma as any).gen2Model.findFirst({ where: { isDeployed: true } })
    const subtasks = [
      { id: '1', label: 'Understand objective', status: 'PENDING', agentRole: 'RESEARCH',    steps: ['Parse goal semantics', 'Retrieve relevant memory', 'Identify constraints'] },
      { id: '2', label: 'Gather evidence',       status: 'PENDING', agentRole: 'DIAGNOSTICS', steps: ['Signal analysis', 'CRM context pull', 'OIS baseline check'] },
      { id: '3', label: 'Form hypothesis',       status: 'PENDING', agentRole: 'RESEARCH',    steps: ['Synthesise evidence', 'Generate alternatives', 'Score confidence'] },
      { id: '4', label: 'Simulate outcomes',     status: 'PENDING', agentRole: 'EXECUTION',   steps: ['Run decision simulation', 'Evaluate ROI per path', 'Risk-weight outcomes'] },
      { id: '5', label: 'Execute best path',     status: 'PENDING', agentRole: 'EXECUTION',   steps: ['KIMMP approval gate', 'Dispatch MissionDispatcher', 'Monitor completion'] },
      { id: '6', label: 'Capture learning',      status: 'PENDING', agentRole: 'COACH',       steps: ['Record outcome', 'Update KimmpMemory', 'Adjust future priors'] },
    ]
    const plan = await (prisma as any).planDecompositionTree.create({
      data: { goal, subtasks, status: 'PENDING', gen2ModelId: deployedModel?.id ?? null, createdBy: (req as any).user?.id },
    })

    // Auto-execute — no human gate required (S80)
    gen3Enqueue(plan)

    res.status(201).json(plan)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/gen3/plans
kangqoreImmpRoutes.get('/gen3/plans', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const plans = await (prisma as any).planDecompositionTree.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
    res.json(plans)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/gen3/plans/:id
kangqoreImmpRoutes.get('/gen3/plans/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const plan = await (prisma as any).planDecompositionTree.findUnique({ where: { id: req.params.id } })
    if (!plan) return res.status(404).json({ error: 'not found' })
    res.json(plan)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// PATCH /admin/kangqore-immp/gen3/plans/:id — update subtask status or whole plan status
kangqoreImmpRoutes.patch('/gen3/plans/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { status, subtasks, failureCount } = req.body
    const data: any = {}
    if (status)                     data.status       = status
    if (subtasks)                   data.subtasks      = subtasks
    if (failureCount !== undefined) data.failureCount  = failureCount
    if (status === 'DONE')          data.completedAt   = new Date()
    if (failureCount >= 3)          data.replannedAt   = new Date()

    const plan = await (prisma as any).planDecompositionTree.update({ where: { id: req.params.id }, data })
    res.json(plan)
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// GET /admin/kangqore-immp/gen3/status
kangqoreImmpRoutes.get('/gen3/status', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const [total, active, done, failed, deployedModel] = await Promise.all([
      (prisma as any).planDecompositionTree.count({}),
      (prisma as any).planDecompositionTree.count({ where: { status: 'ACTIVE' } }),
      (prisma as any).planDecompositionTree.count({ where: { status: 'DONE' } }),
      (prisma as any).planDecompositionTree.count({ where: { status: 'FAILED' } }),
      (prisma as any).gen2Model.findFirst({ where: { isDeployed: true }, select: { providerModelId: true, benchmarkAccuracy: true } }),
    ])
    res.json({ total, active, done, failed, gen3Active: !!deployedModel, deployedModel })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})
