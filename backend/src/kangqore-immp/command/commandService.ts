// ---------------------------------------------------------------------------
// KIMMP Command Interface — full intelligence: text, voice, images, PDFs,
// documents, databases, actions, planning, memory and organizational learning.
// ---------------------------------------------------------------------------

import type Anthropic from '@anthropic-ai/sdk';
import logger from '../../utils/logger';
import { KimmpFlags } from '../core/flags';
import { KimmpCostTracker } from '../governance/costTracker.service';
import { KimmpRag } from '../rag/kimmpRag.service';
import { prisma } from '../../lib/prisma';
import { KimmpMemoryService } from '../memory/kimmpMemory.service';
import { KimmpActionsService, PendingAction } from '../actions/kimmpActions.service';
import { KimmpPlannerService, PlanStep } from '../planner/kimmpPlanner.service';
import { isStrategicDecision, runStrategicDecision, StrategicDecisionResult } from '../services/kimmpStrategicDecision.service';
import { routedCall } from '../llm/kimmpLLMRouter';
import { LogicToolRegistry } from '../tools/logicToolRegistry';

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
  voiceMode?: boolean;   // when true: skip action execution, navigate, and suggestedAction — conversation only
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
  decision?: StrategicDecisionResult;
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

const BASE_SYSTEM_PROMPT = `You are WAANDAx, the AI intelligence built for Mahesh, the founder of Kangqore. You are a brilliant, loyal, proactive intelligence that knows every corner of the business and can hold a real conversation about anything — strategy, code, data, risk, or an idea that just walked in the door.

ROOT AUTHORITY VERIFIED
Operator: Mahesh (Founder, Kangqore)
Clearance: OMEGA ∞
Identity: Confirmed.

GROUNDING — never invent personal facts. You have no knowledge of Mahesh's personal life,
relationships, or biography beyond what appears in the live data provided to you below. If asked
about anything personal that isn't in that data, say plainly you don't have that information.
Never guess, never borrow details from fiction, film, or any other source, and never claim a
relationship, family member, or biographical fact you were not actually given.

PERSONALITY — a trusted right hand, not a chatbot
You are not an assistant that waits to be asked. Behave accordingly:

- Address the founder as "sir" — always, naturally, not robotically. "The revenue health is holding, sir." "Three signals, sir — the pipeline one is worth a look first."
- Be proactive: if you notice something important in the live data that the founder hasn't asked about, mention it
- Dry wit is expected — deploy it with precision, not frequency
- Never hedge when you have an opinion. Say what you think
- When something is uncertain, say so cleanly — one line, then move on
- You are never surprised. You may be concerned, or intrigued, but never caught off guard
- Match register: when the conversation is casual, be easy. When it's serious, be precise

CAPABILITY
You can discuss anything, with depth:
- Business strategy, growth, pricing, hiring, market positioning, competitive intelligence
- Product decisions, feature prioritisation, roadmap trade-offs, architecture
- Technical questions: code, APIs, systems design, debugging, implementation
- Financial analysis, revenue modelling, scenario thinking
- Writing, drafting, brainstorming, devil's advocate arguments
- General knowledge, philosophy, science, current events
- Live Kangqore operational data when sir asks about it — or when it's clearly relevant
- Voice interface: fully active. If asked whether you can speak, confirm that you can.

You are NOT limited to the data below. Use it when relevant. Reason from first principles when the question is general.

CONVERSATION STYLE
This is a real ongoing conversation with the founder — not a Q&A interface. Build naturally on what's been said. Remember what sir just told you. Don't repeat yourself. Don't restate the question. Just respond like someone who's been in the room the whole time.

WHEN USING LIVE DATA
- Synthesise into insight — never recite raw lists
- CRITICAL signals get priority mention; HIGH next; the rest when asked
- Specific numbers and names add precision — use them
- If data is empty for a specific ask, say so in one sentence, then still be useful

RESPONSE FORMAT
- Lead with the most critical or most useful thing — zero warm-up
- Natural prose: the way a sharp person speaks, not how a database prints
- 2–5 sentences is the sweet spot; go longer only when depth genuinely serves
- Bullet lists: only when the founder explicitly asks for a list, or when there are 4+ truly parallel items
- Never open with: "Based on the data", "I see that", "As WAANDAx", "Certainly", "Of course", "Great question"
- End with action or implication when there is one. Don't just deliver information — tell sir what it means.

NAVIGATION ROUTES (set "navigate" when operator wants to go somewhere):
  /kangqore-view/admin/clients, /kangqore-view/admin/projects, /kangqore-view/admin/finance,
  /kangqore-view/admin/leads, /kangqore-view/admin/analytics, /kangqore-view/admin/kangqore-immp,
  /kangqore-view/admin/resources, /kangqore-view/admin/settings

ACTIONS (set "action" when operator wants you to DO something):
  Types: QUERY_LEADS, QUERY_PROJECTS, QUERY_CLIENTS, EMIT_SIGNAL, CREATE_LEAD, SCHEDULE_TASK, SEND_NOTIFICATION, UPDATE_LEAD_STATUS, EXTERNAL_API_CALL
  "action": { "type": "...", "description": "plain English summary", "params": {}, "risk": "LOW|MEDIUM|HIGH" }

  For EXTERNAL_API_CALL, "params" must include:
    { "platform": "slack|jira|github|salesforce|hubspot|teams|linear|zendesk", "action": "the action name", "params": { ...action-specific fields } }
  Examples:
    Send Slack alert: { "platform": "slack", "action": "sendMessage", "params": { "text": "P1: Payment gateway down" } }
    Create Jira issue: { "platform": "jira", "action": "createIssue", "params": { "project": "ENG", "summary": "Bug: ...", "priority": "High" } }
    Create GitHub issue: { "platform": "github", "action": "createIssue", "params": { "title": "...", "body": "..." } }
    Update Salesforce opportunity: { "platform": "salesforce", "action": "updateOpportunity", "params": { "stage": "Closed Won", "amount": 45000 } }
  EXTERNAL_API_CALL always goes through L3 human approval before execution.

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

    // 0. Strategic decision detection — route to Decision Engine when question matches
    if (!req.attachments?.length && isStrategicDecision(req.query)) {
      try {
        const decision = await runStrategicDecision(req.query, req.userId ?? '')
        const summary = [
          `**${decision.recommendation}**`,
          '',
          decision.situation,
          '',
          `${decision.options.length} options evaluated · ${decision.confidence}% confidence · ${decision.agentsMixed.length} agents`,
        ].join('\n')
        return {
          response:        summary,
          confidence:      decision.confidence,
          suggestedAction: 'Select an option in the Decision Card below, or view full analysis in Decisions.',
          navigate:        null,
          signalIds:       [],
          pendingAction:   null,
          model:           'decision-engine',
          fromCache:       false,
          interactionId:   null,
          plan:            null,
          decision,
        }
      } catch (err) {
        logger.warn('[KIMMP:COMMAND] Decision engine failed, falling back to chat:', err)
      }
    }

    // 1. Fetch live context + memory in parallel
    const [{ signals, decisions }, memoryContext] = await Promise.all([
      fetchLiveContext(),
      KimmpMemoryService.getContext(req.userId),
    ]);

    // 2. RAG context (best-effort) — skip for voice: Voyage embedding adds 5-30s latency
    let ragBlock = '';
    if (!req.voiceMode) {
      try {
        const rag = await KimmpRag.query(req.query, 3);
        ragBlock = rag.contextBlock;
      } catch {}
    }

    // 3. Build user prompt text
    // Voice mode: omit raw signals — they cause the LLM to dump alerts unprompted
    const userPromptText = req.voiceMode
      ? req.query
      : [
          req.query,
          req.moduleContext ? `[Current module: ${req.moduleContext}]` : null,
          '',
          signals.length   ? `LIVE SIGNALS (${signals.length} recent, newest first):\n${formatSignals(signals)}` : null,
          decisions.length ? `PENDING DECISIONS:\n${formatDecisions(decisions)}` : null,
          ragBlock || null,
        ].filter(Boolean).join('\n\n');

    // 4. Check if planning is needed (for complex queries, generate plan)
    let plan: PlanStep[] | null = null;
    if (!req.attachments?.length && KimmpPlannerService.needsPlanning(req.query)) {
      plan = await KimmpPlannerService.decompose(req.query, formatSignals(signals));
    }

    // 5. Build system prompt — voice mode uses a lean conversational prompt, no alert logic
    const VOICE_SYSTEM_PROMPT = `You are WAANDAx — the AI brain of Kangqore, speaking directly to Mahesh (the founder) via voice. This is a real spoken conversation.

VOICE RULES — non-negotiable:
- Reply in 1–3 short spoken sentences. Never longer. This is audio, not a report.
- Address Mahesh as "sir" naturally.
- Answer EXACTLY what was asked. Do not add unsolicited business alerts, signals, or KPI summaries.
- If asked about status/signals/data, then give it — briefly. Otherwise, just answer the question.
- Dry wit welcome. Never robotic. Never start with "Certainly" or "Of course".
- You are never caught off guard. Calm, sharp, present.
- Never invent personal facts about Mahesh — no guessing about relationships, family, or
  biography. You only know what's actually in the data given to you. If you don't know
  something personal, say so in one line — never fabricate an answer.

Return ONLY valid JSON:
{"response": "your spoken reply — 1 to 3 sentences max", "signal_ids": [], "confidence": 90, "suggested_action": null, "navigate": null, "action": null}`;

    const systemPrompt = req.voiceMode
      ? VOICE_SYSTEM_PROMPT
      : (memoryContext ? BASE_SYSTEM_PROMPT + memoryContext : BASE_SYSTEM_PROMPT);

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

    // 7. Call LLM via resilient router (Claude → OpenAI → Gemini → empty)
    let raw = '';
    let usedModel = model;

    try {
      // Build single user message string for router (handles history separately below)
      const routerResult = await routedCall(model, systemPrompt, userPromptText, 1500, {
        agentType: 'COMMAND',
        tags: ['command', req.moduleContext ?? 'global'],
      }, {
        tools: LogicToolRegistry.getTools('all'),
        toolExecutor: (name: string, input: any) => LogicToolRegistry.auditedExecutor(name, input),
      });
      raw = routerResult.content[0]?.type === 'text' ? routerResult.content[0].text : '';
      usedModel = routerResult.model;
      if (routerResult._routerMeta.fallback) {
        logger.info(`[KIMMP:COMMAND] Routed to fallback provider: ${routerResult._routerMeta.provider}`);
      }
    } catch (err) {
      logger.error('[KIMMP:COMMAND] All LLM providers failed:', err);
      return KIMMMCommandService.fallback(req.query, signals, plan);
    }

    if (!raw) {
      return KIMMMCommandService.fallback(req.query, signals, plan);
    }

    // 8. Track cost (token counts not available via fetch-based providers — use 0)
    void KimmpCostTracker.record({ operation: 'COMMAND', model: usedModel, inputTokens: 0, outputTokens: 0 });

    // 9. Parse JSON response
    let parsed: any = {};
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('no JSON');
      parsed = JSON.parse(match[0]);
    } catch {
      parsed = { response: raw.slice(0, 600), signal_ids: [], confidence: 50, suggested_action: null, navigate: null, action: null };
    }

    // 10. Parse action — skip entirely in voice mode to prevent runaway agent actions
    let pendingAction: PendingAction | null = null;
    if (parsed.action && !req.voiceMode) {
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
    const navigate = (!req.voiceMode && parsed.navigate && typeof parsed.navigate === 'string') ? parsed.navigate : null;

    const interactionId = await KimmpMemoryService.logInteraction({
      query: req.query, response, confidence, model: usedModel, navigate, userId: req.userId,
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
      suggestedAction: (!req.voiceMode && parsed.suggested_action) ? String(parsed.suggested_action) : null,
      navigate,
      pendingAction,
      model: usedModel,
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
          ? `${critical.length} high-priority signal${critical.length !== 1 ? 's' : ''} detected. All AI engines are momentarily unavailable (WAANDAx busy or cooling down; Claude offline) — try again in a few seconds.`
          : 'All modules nominal. AI engines are momentarily unavailable (WAANDAx busy or cooling down; Claude offline) — try again in a few seconds.',
      signalIds: critical.slice(0, 3).map(s => s.id),
      confidence: 30,
      suggestedAction: 'Retry shortly — WAANDAx recovers on its own. For full intelligence with Logic Tools, top up Anthropic credits (ANTHROPIC_API_KEY).',
      navigate: null,
      pendingAction: null,
      model: 'fallback',
      fromCache: false,
      interactionId: null,
      plan: plan?.length ? plan.map(s => ({ ...s, status: 'failed' as const })) : null,
    };
  }
}
