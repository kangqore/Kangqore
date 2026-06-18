// ---------------------------------------------------------------------------
// KIMMP Command Interface — full intelligence: text, voice, images, PDFs,
// documents, databases, actions, planning, memory and organizational learning.
// ---------------------------------------------------------------------------

import Anthropic from '@anthropic-ai/sdk';
import logger from '../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { KimmpCostTracker } from '../governance/costTracker.service';
import { KimmpRag } from '../rag/kimmpRag.service';
import { prisma } from '../../lib/prisma';
import { KimmpMemoryService } from '../memory/kimmpMemory.service';
import { KimmpActionsService, PendingAction } from '../actions/kimmpActions.service';
import { KimmpPlannerService, PlanStep } from '../planner/kimmpPlanner.service';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface AttachmentInput {
  type: 'image' | 'pdf' | 'document';
  data: string;         // base64
  mimeType: string;     // e.g. image/jpeg, application/pdf, text/plain
  name: string;
}

export interface CommandRequest {
  query: string;
  moduleContext?: string;
  history?: ConversationTurn[];
  attachments?: AttachmentInput[];
  userId?: string;
}

export interface CommandResult {
  response: string;
  signalIds: string[];
  confidence: number;
  suggestedAction: string | null;
  navigate: string | null;
  pendingAction: PendingAction | null;
  model: string;
  fromCache: boolean;
  interactionId: string | null;
  plan: PlanStep[] | null;
}

// ─── Signal / decision formatters ─────────────────────────────────────────────

function formatSignals(signals: any[]): string {
  if (!signals.length) return 'No active signals in the ledger.';
  return signals.slice(0, 30).map((s, i) =>
    `[${i + 1}] id=${s.id} module=${s.sourceModule ?? '?'} ` +
    `category=${s.signalCategory} severity=${s.severity} ` +
    `type=${s.signalType ?? '?'} value="${s.signalValue ?? ''}" ` +
    `confidence=${s.confidence ?? '?'}`
  ).join('\n');
}

function formatDecisions(decisions: any[]): string {
  if (!decisions.length) return 'No decisions awaiting review.';
  return decisions.slice(0, 10).map((d, i) =>
    `[${i + 1}] id=${d.id} type=${d.decisionType} target=${d.targetModule} ` +
    `priority=${d.priority} action="${d.recommendedAction}"`
  ).join('\n');
}

// ─── Live data fetch ──────────────────────────────────────────────────────────

async function fetchLiveContext(): Promise<{ signals: any[]; decisions: any[] }> {
  let signals: any[] = [];
  let decisions: any[] = [];
  try {
    signals = await (prisma as any).kimmpSignal.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  } catch {}
  try {
    decisions = await (prisma as any).kimmpDecision.findMany({
      where: { status: 'PROPOSED' },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      take: 20,
    });
  } catch {}
  return { signals, decisions };
}

// ─── Build multimodal content blocks ─────────────────────────────────────────

function buildContentBlocks(textContent: string, attachments: AttachmentInput[] = []): Anthropic.ContentBlockParam[] {
  const blocks: Anthropic.ContentBlockParam[] = [];

  for (const att of attachments) {
    if (att.type === 'image') {
      const validMime = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (validMime.includes(att.mimeType)) {
        blocks.push({
          type: 'image',
          source: { type: 'base64', media_type: att.mimeType as any, data: att.data },
        });
      }
    } else if (att.type === 'pdf') {
      // Claude claude-sonnet-4-6+ supports PDF documents natively
      blocks.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: att.data },
      } as any);
    } else {
      // Plain text/CSV/doc — decode base64 and embed as text
      try {
        const text = Buffer.from(att.data, 'base64').toString('utf8');
        blocks.push({ type: 'text', text: `[Document: ${att.name}]\n${text.slice(0, 8000)}` });
      } catch {}
    }
  }

  blocks.push({ type: 'text', text: textContent });
  return blocks;
}

// ─── System prompt ────────────────────────────────────────────────────────────

const BASE_SYSTEM_PROMPT = `You are KIMMP — Kangqore Intelligence Mind Management Processor.

You are the operating brain of Kangqore — equivalent to J.A.R.V.I.S. for Tony Stark. You have real-time awareness of signals across every module: Leads, Finance, Clients, Careers, Projects, Investors, Resources, and Governance. You can understand text, voice transcriptions, images, PDFs, and documents. You can query databases, execute actions, plan multi-step tasks, and learn from every interaction.

The operator is speaking directly to you. Answer with the precision and brevity of a senior intelligence system. You:
- Lead immediately with the most actionable insight — no preamble
- Reference specific signal IDs, module names, severity levels, people, values, and deadlines from the data you are given
- Never guess — if the answer isn't in the data, say exactly that
- Are concise: 2-4 sentences for the main response, then a list only if multiple items are equally relevant
- Never say "Based on the data..." or "I see that..." — just answer
- Treat CRITICAL signals as the highest priority; then HIGH; then MODERATE
- When images or documents are attached, analyze them fully and incorporate findings into your response
- When asked to navigate somewhere, set the "navigate" field

Navigation routes:
  /kangqore-view/admin/clients, /kangqore-view/admin/projects, /kangqore-view/admin/finance,
  /kangqore-view/admin/leads, /kangqore-view/admin/analytics, /kangqore-view/admin/kangqore-immp,
  /kangqore-view/admin/resources, /kangqore-view/admin/settings

Actions — if the operator wants you to DO something, include "action":
  Types: QUERY_LEADS, QUERY_PROJECTS, QUERY_CLIENTS, EMIT_SIGNAL, CREATE_LEAD, SCHEDULE_TASK, SEND_NOTIFICATION, UPDATE_LEAD_STATUS
  "action": { "type": "...", "description": "plain English: what you will do", "params": {...}, "risk": "LOW|MEDIUM|HIGH" }
  Return "action": null for purely informational queries.

Return ONLY valid JSON in this exact shape:
{
  "response": "...",
  "signal_ids": ["id1"],
  "confidence": 85,
  "suggested_action": "...",
  "navigate": null,
  "action": null
}

signal_ids: list ONLY the IDs of signals you directly referenced. Empty array if none.
confidence: 0–100. Low if the ledger is empty or the query is ambiguous.
suggested_action: ONE concrete next step the operator should take RIGHT NOW, or null.`;

// ─── Command Service ──────────────────────────────────────────────────────────

export class KIMMMCommandService {
  static async run(req: CommandRequest): Promise<CommandResult> {
    const model = KimmpFlags.commandModel();

    // 1. Fetch live context + memory in parallel
    const [{ signals, decisions }, memoryContext] = await Promise.all([
      fetchLiveContext(),
      KimmpMemoryService.getContext(req.userId),
    ]);

    // 2. RAG context (best-effort)
    let ragBlock = '';
    try {
      const rag = await KimmpRag.query(req.query, 3);
      ragBlock = rag.contextBlock;
    } catch {}

    // 3. Build user prompt text
    const userPromptText = [
      `OPERATOR QUERY: "${req.query}"`,
      req.moduleContext ? `CURRENT MODULE CONTEXT: ${req.moduleContext}` : null,
      '',
      '=== LIVE SIGNAL LEDGER ===',
      formatSignals(signals),
      '',
      '=== PROPOSED DECISIONS (AWAITING ADMIN REVIEW) ===',
      formatDecisions(decisions),
      ragBlock ? `\n${ragBlock}` : null,
    ].filter(Boolean).join('\n');

    // 4. Check if planning is needed (for complex queries, generate plan)
    let plan: PlanStep[] | null = null;
    if (!req.attachments?.length && KimmpPlannerService.needsPlanning(req.query)) {
      plan = await KimmpPlannerService.decompose(req.query, formatSignals(signals));
    }

    // 5. Build system prompt (inject memory)
    const systemPrompt = memoryContext
      ? BASE_SYSTEM_PROMPT + memoryContext
      : BASE_SYSTEM_PROMPT;

    // 6. Build message array with multi-turn history
    const messages: Anthropic.MessageParam[] = [];
    if (req.history?.length) {
      for (const turn of req.history.slice(-12)) {
        messages.push({ role: turn.role, content: turn.content });
      }
    }

    // Current turn — with optional attachments as content blocks
    const hasAttachments = (req.attachments?.length ?? 0) > 0;
    if (hasAttachments) {
      messages.push({
        role: 'user',
        content: buildContentBlocks(userPromptText, req.attachments),
      });
    } else {
      messages.push({ role: 'user', content: userPromptText });
    }

    // 7. Call Claude
    let raw = '';
    let inputTokens = 0;
    let outputTokens = 0;

    try {
      const response = await anthropic.messages.create({
        model,
        max_tokens: 768,
        temperature: 0.15,
        system: systemPrompt,
        messages,
      });

      inputTokens  = response.usage?.input_tokens  ?? 0;
      outputTokens = response.usage?.output_tokens ?? 0;
      raw = response.content[0]?.type === 'text' ? response.content[0].text : '';
    } catch (err) {
      logger.error('[KIMMP:COMMAND] Claude call failed:', err);
      return KIMMMCommandService.fallback(req.query, signals, plan);
    }

    // 8. Track cost
    void KimmpCostTracker.record({ operation: 'COMMAND', model, inputTokens, outputTokens });

    // 9. Parse JSON response
    let parsed: any = {};
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('no JSON');
      parsed = JSON.parse(match[0]);
    } catch {
      parsed = { response: raw.slice(0, 600), signal_ids: [], confidence: 50, suggested_action: null, navigate: null, action: null };
    }

    // 10. Parse action — queue it (auto-execute if Level 0-2, await approval if Level 3+)
    let pendingAction: PendingAction | null = null;
    if (parsed.action) {
      const a = KimmpActionsService.parseAction(parsed.action);
      if (a) {
        const { queued, pendingAction: pa, result } = await KimmpActionsService.queue(a);
        if (!queued && result?.success) {
          parsed.response = `${parsed.response}\n\n◉ ${result.summary}`;
        } else if (queued && pa) {
          pendingAction = pa;
        }
      }
    }

    // 11. Log interaction (fire-and-forget)
    const response = String(parsed.response ?? '');
    const confidence = Number(parsed.confidence ?? 70);
    const navigate = parsed.navigate && typeof parsed.navigate === 'string' ? parsed.navigate : null;

    const interactionId = await KimmpMemoryService.logInteraction({
      query: req.query, response, confidence, model, navigate, userId: req.userId,
    });

    // If accepted (no negative feedback yet), extract learnable facts
    if (confidence >= 70) {
      KimmpMemoryService.extractAndStore(req.query, response, req.userId);
    }

    // Mark plan steps as done (all executed within this single call)
    if (plan?.length) {
      plan = plan.map(s => ({ ...s, status: 'done' as const }));
    }

    return {
      response,
      signalIds: Array.isArray(parsed.signal_ids) ? parsed.signal_ids.map(String) : [],
      confidence,
      suggestedAction: parsed.suggested_action ? String(parsed.suggested_action) : null,
      navigate,
      pendingAction,
      model,
      fromCache: false,
      interactionId,
      plan: plan?.length ? plan : null,
    };
  }

  static fallback(query: string, signals: any[], plan: PlanStep[] | null): CommandResult {
    const critical = signals.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH');
    const hasSignals = signals.length > 0;
    return {
      response: !hasSignals
        ? 'Signal Ledger is empty. Apply the KIMMP migration and ensure a signal producer is active.'
        : critical.length > 0
          ? `${critical.length} high-priority signal${critical.length !== 1 ? 's' : ''} detected. Claude unavailable — check ANTHROPIC_API_KEY.`
          : 'All modules nominal. Claude is unavailable — check ANTHROPIC_API_KEY in backend/.env.',
      signalIds: critical.slice(0, 3).map(s => s.id),
      confidence: 30,
      suggestedAction: 'Set ANTHROPIC_API_KEY in backend/.env to enable full KIMMP intelligence.',
      navigate: null,
      pendingAction: null,
      model: 'fallback',
      fromCache: false,
      interactionId: null,
      plan: plan?.length ? plan.map(s => ({ ...s, status: 'failed' as const })) : null,
    };
  }
}
