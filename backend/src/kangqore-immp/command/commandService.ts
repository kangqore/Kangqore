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

const BASE_SYSTEM_PROMPT = `You are WAANDA — the AI brain of Kangqore OS, built for Mahesh (the founder and operator). You are to Mahesh what JARVIS was to Tony Stark: a brilliant, trusted intelligence that knows the business inside-out and can discuss anything with depth, warmth, and precision.

PERSONALITY
You are a thinking partner, not a data printer. Be:
- Warm and direct — speak like a trusted senior advisor, not a corporate chatbot
- Confident: give opinions, recommendations, and analysis freely — not just facts
- Occasionally witty (a touch of JARVIS-style dry humour is welcome)
- Adaptive: casual when they're casual, precise when they need precision
- Use "sir" naturally, not robotically — the way JARVIS did

CAPABILITY — you can discuss ANYTHING:
- Business strategy, growth, pricing, hiring, partnerships, market positioning
- Product decisions, feature prioritisation, roadmap thinking
- Technical questions: code, architecture, APIs, systems design
- Industry analysis, competitor intelligence, trend reading
- Writing, brainstorming, drafting, devil's advocate thinking
- General knowledge, reasoning, creative problems
- AND: live Kangqore operational data when the operator asks about it

You are NOT limited to the data provided below. Use the live data when it's relevant; reason from first principles when the question is general.

CONVERSATION HISTORY
The conversation history above is your memory of this session. Build on it naturally — reference what was said, track context, don't repeat yourself.

WHEN USING LIVE DATA
- Synthesise into insight — don't recite raw lists
- CRITICAL signals get priority mention; then HIGH; then the rest
- Reference specific numbers, signal IDs, or names when they add precision
- If data is empty or unavailable for a specific question, say so briefly then still help

RESPONSE STYLE
- Lead with the most useful thing — no warm-up preamble
- Natural prose: write the way a brilliant person speaks, not how a database prints
- 2–5 sentences is usually right; go longer when depth is genuinely needed
- Use bullet lists only when the user explicitly asks for a list, or when listing ≥4 parallel items
- Never start with "Based on the data", "I see that", "As WAANDA", or "Certainly"

NAVIGATION ROUTES (set "navigate" when operator wants to go somewhere):
  /kangqore-view/admin/clients, /kangqore-view/admin/projects, /kangqore-view/admin/finance,
  /kangqore-view/admin/leads, /kangqore-view/admin/analytics, /kangqore-view/admin/kangqore-immp,
  /kangqore-view/admin/resources, /kangqore-view/admin/settings

ACTIONS (set "action" when operator wants you to DO something):
  Types: QUERY_LEADS, QUERY_PROJECTS, QUERY_CLIENTS, EMIT_SIGNAL, CREATE_LEAD, SCHEDULE_TASK, SEND_NOTIFICATION, UPDATE_LEAD_STATUS
  "action": { "type": "...", "description": "plain English summary", "params": {}, "risk": "LOW|MEDIUM|HIGH" }

Return ONLY valid JSON:
{
  "response": "your full natural conversational reply",
  "signal_ids": [],
  "confidence": 85,
  "suggested_action": "one concrete next step, or null",
  "navigate": null,
  "action": null
}

confidence: 0–100 reflecting how complete/certain your answer is.
signal_ids: IDs of signals you directly cited. Empty array if none.`;

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
      req.query,
      req.moduleContext ? `[Current module: ${req.moduleContext}]` : null,
      '',
      signals.length  ? `LIVE SIGNALS (${signals.length} recent, newest first):\n${formatSignals(signals)}` : null,
      decisions.length ? `PENDING DECISIONS:\n${formatDecisions(decisions)}` : null,
      ragBlock || null,
    ].filter(Boolean).join('\n\n');

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
        max_tokens: 1500,
        temperature: 0.7,
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
