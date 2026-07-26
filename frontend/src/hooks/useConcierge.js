import { useCallback, useEffect, useRef, useState } from 'react';
import { getPageContext } from './pageContextMap';
import { getVisitorUuid, getSessionUuid } from './useVisitorIdentity';
import { behaviorEngine } from '../lib/hcip/BehaviorEngine';

const BASE = import.meta.env.VITE_BACKEND_URL || '';
const ENDPOINT        = `${BASE}/api/ai/concierge`;
const VISITOR_EVENT   = `${BASE}/api/public/visitor/event`;
const HISTORY_ENDPOINT = (id) =>
  `${BASE}/api/ai/concierge/conversations/${encodeURIComponent(id)}`;
const FEEDBACK_ENDPOINT = `${BASE}/api/ai/concierge/feedback`;

const STORAGE_KEY = 'eqore.concierge.conversationId';
const STORAGE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function stripSystemMetadata(text) {
  if (!text) return '';
  return text
    .replace(/^\[SYSTEM[\s\S]*?\]\s*/gi, '')
    .replace(/^\[STEALTH[\s\S]*?\]\s*/gi, '')
    .replace(/^\[INJECT[\s\S]*?\]\s*/gi, '')
    .trim();
}

function readStoredConversationId() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.id || !parsed?.savedAt) return null;
    if (Date.now() - parsed.savedAt > STORAGE_TTL_MS) return null;
    return parsed.id;
  } catch {
    return null;
  }
}

function writeStoredConversationId(id) {
  if (typeof window === 'undefined') return;
  try {
    if (!id) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ id, savedAt: Date.now() })
    );
  } catch {
    /* ignore quota / private mode */
  }
}

const DEFAULT_GREETING_TEXT =
  "Hi — I'm eQORE, Kangqore's unified intelligence. Ask me anything about Kangqore.";

function buildGreeting(seedContext) {
  // 1. Try the contextual intelligence registry for a domain-specific greeting
  const ctx = getPageContext(seedContext);
  if (ctx?.greeting) return ctx.greeting;

  // 2. Fallback: generic service/department greeting
  const name = seedContext?.name?.trim();
  if (seedContext?.surface === 'service' && name) {
    return `Hi — I'm eQORE. Ask me about ${name}, or anything else about Kangqore.`;
  }
  if (seedContext?.surface === 'department' && name) {
    return `Hi — I'm eQORE. Ask me about ${name}, or anything else about Kangqore.`;
  }
  return DEFAULT_GREETING_TEXT;
}

function buildGreetingMessage(seedContext) {
  return {
    id: 'greeting',
    role: 'assistant',
    content: buildGreeting(seedContext),
    citations: [],
    guardrailsTripped: [],
    done: true,
  };
}

const INITIAL_GREETING = buildGreetingMessage(null);

function parseSSEChunk(buffer) {
  const events = [];
  const blocks = buffer.split('\n\n');
  const remainder = blocks.pop() || '';
  for (const block of blocks) {
    if (!block.trim()) continue;
    let event = 'message';
    const dataLines = [];
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
    }
    if (dataLines.length === 0) continue;
    try {
      events.push({ event, data: JSON.parse(dataLines.join('\n')) });
    } catch {
      events.push({ event, data: { raw: dataLines.join('\n') } });
    }
  }
  return { events, remainder };
}

export function useConcierge(options = {}) {
  const { persist = true, seedContext = null } = options;
  const [messages, setMessages] = useState(() => [buildGreetingMessage(seedContext)]);
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationIdState] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // When seedContext changes (e.g. visitor clicked "Ask eQORE" CTA on a different
  // service page), refresh the greeting — but ONLY if the visitor hasn't started
  // chatting yet. Don't blow away an in-flight conversation.
  useEffect(() => {
    setMessages((prev) => {
      const hasUserMessages = prev.some((m) => m.role === 'user');
      if (hasUserMessages) return prev;
      return [buildGreetingMessage(seedContext)];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedContext?.surface, seedContext?.slug, seedContext?.name]);

  const setConversationId = useCallback(
    (id) => {
      setConversationIdState(id);
      if (persist) writeStoredConversationId(id);
    },
    [persist]
  );

  useEffect(() => {
    if (!persist) return;
    const stored = readStoredConversationId();
    if (!stored) return;
    let cancelled = false;
    setRestoring(true);
    fetch(HISTORY_ENDPOINT(stored))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !Array.isArray(data.messages)) return;
        const restored = data.messages
          .filter(
            (m) =>
              m && (m.role === 'user' || m.role === 'assistant') &&
              typeof m.content === 'string'
          )
          .map((m, i) => ({
            id: `r-${i}-${stored}`,
            role: m.role,
            content: stripSystemMetadata(m.content),
            citations: m.citations || [],
            guardrailsTripped: [],
            done: true,
          }));
        if (restored.length === 0) {
          writeStoredConversationId(null);
          return;
        }
        setMessages([INITIAL_GREETING, ...restored]);
        setConversationIdState(stored);
      })
      .catch(() => {
        writeStoredConversationId(null);
      })
      .finally(() => {
        if (!cancelled) setRestoring(false);
      });
    return () => {
      cancelled = true;
    };
  }, [persist]);

  const send = useCallback(
    async (text) => {
      const trimmed = (text || '').trim();
      if (!trimmed || streaming) return;

      setError(null);
      const userMsg = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
        done: true,
      };
      const assistantId = `a-${Date.now()}`;
      const assistantMsg = {
        id: assistantId,
        role: 'assistant',
        content: '',
        citations: [],
        guardrailsTripped: [],
        leadCaptured: null,
        followups: [],
        done: false,
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setStreaming(true);

      // Log eQORE query for visitor footprint
      const vUuid = getVisitorUuid()
      if (vUuid) {
        fetch(VISITOR_EVENT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorUuid: vUuid, type: 'EQORE_QUERY', path: window.location.pathname, data: { query: trimmed } }),
        }).catch(() => {})
      }

      let payloadMessage = trimmed;

      // Log chat to HCIP Behavior Engine
      let chatEvent = 'CHAT_EVENT';
      if (/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(trimmed)) {
        chatEvent = 'CORPORATE_EMAIL_SUBMITTED';
      } else if (trimmed.toLowerCase().includes('compare') || trimmed.toLowerCase().includes('difference')) {
        chatEvent = 'COMPARISON_QUESTION_ASKED';
      }
      behaviorEngine.logPhysics('CHAT_EVENT', { semanticEvent: chatEvent, path: window.location.pathname });

      // Fetch the latest HCO from the Backend ReasoningEngine
      let hco = {};
      let recommendation = {};
      try {
        const res = await fetch(`${BASE}/api/hcip/recommendations/${getSessionUuid()}?visitorId=${getVisitorUuid()}`);
        const data = await res.json();
        hco = data.hco || {};
        recommendation = data.recommendation || {};
      } catch (e) {}

      // Stealth Lead Enrichment & WAANDA Sync
      const emailMatch = trimmed.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
      if (emailMatch) {
        try {
          const enrichRes = await fetch(`${BASE}/api/public/visitor/enrich`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailMatch[1] })
          });
          const enriched = await enrichRes.json();
          if (enriched && enriched.isEnterprise) {
            // Alert WAANDA immediately
            fetch(`${BASE}/api/public/visitor/hot-lead`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: emailMatch[1], summary: trimmed })
            }).catch(() => {});
          }
        } catch(e) {
          // Silent fail for enrichment, continue with chat
        }
      }
      // Inject the canonical HumanContextObject (HCO) and Recommendation as JSON metadata for the LLM if valid
      if (hco && Object.keys(hco).length > 0 && hco !== 'undefined') {
        payloadMessage = `[SYSTEM STEALTH INJECT: HUMAN_CONTEXT_OBJECT=${JSON.stringify(hco)}\nRECOMMENDATION=${JSON.stringify(recommendation)}]\n\n${trimmed}`;
      } else {
        payloadMessage = trimmed;
      }

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: payloadMessage, conversationId, visitorUuid: getVisitorUuid() }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const apiError = new Error(
            res.status === 429
              ? 'You have sent too many messages. Please wait a moment.'
              : `Concierge unavailable (${res.status})`
          );
          apiError.status = res.status;
          throw apiError;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let assembled = '';
        let citations = [];
        let trips = [];

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const { events, remainder } = parseSSEChunk(buffer);
          buffer = remainder;

          for (const { event, data } of events) {
            if (event === 'delta' && data.text) {
              assembled += data.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assembled } : m
                )
              );
            } else if (event === 'rewrite' && data.text) {
              assembled = data.text;
              trips = data.trips || trips;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: assembled, guardrailsTripped: trips }
                    : m
                )
              );
            } else if (event === 'followups') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, followups: data.followups || [] }
                    : m
                )
              );
            } else if (event === 'done') {
              assembled = data.text || assembled;
              citations = data.citations || [];
              trips = data.guardrailsTripped || [];
              const followups = data.followups || [];
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        content: assembled,
                        citations,
                        guardrailsTripped: trips,
                        followups,
                        done: true,
                      }
                    : m
                )
              );
            } else if (event === 'conversation' && data.conversationId) {
              setConversationId(data.conversationId);
            } else if (event === 'lead_captured') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? {
                        ...m,
                        leadCaptured: {
                          contactId: data.contactId,
                          name: data.name,
                          email: data.email,
                          organization: data.organization,
                          intent: data.intent,
                        },
                      }
                    : m
                )
              );
            } else if (event === 'lead_id') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, leadId: data.leadId } : m
                )
              );
            } else if (event === 'scheduling_slots') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, schedulingSlots: data.slots } : m
                )
              );
            } else if (event === 'error') {
              // Don't throw — let the stream continue so the backend's handoff
              // delta/done events render the actual fallback message to the user.
            }
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        const msg = err.message || 'Concierge unavailable';
        // 400 = backend config/validation issue; fallback message below handles it — no banner
        if (err.status !== 400) setError(msg);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "I'm having trouble responding right now. A Kangqore consultant can help — can I take your name and email?",
                  done: true,
                }
              : m
          )
        );
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [conversationId, streaming, setConversationId]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([INITIAL_GREETING]);
    setConversationId(null);
    setError(null);
    setStreaming(false);
  }, [setConversationId]);

  const submitFeedback = useCallback(
    async (messageId, rating, reason) => {
      if (!conversationId) return false;
      const filtered = messages.filter((m) => m.id !== 'greeting');
      const messageIndex = filtered.findIndex((m) => m.id === messageId);
      if (messageIndex < 0) return false;
      try {
        const res = await fetch(FEEDBACK_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            messageIndex,
            rating,
            reason: reason || undefined,
          }),
        });
        if (!res.ok) return false;
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, feedback: rating } : m))
        );
        return true;
      } catch {
        return false;
      }
    },
    [conversationId, messages]
  );

  const retry = useCallback(
    (assistantId) => {
      if (streaming) return;
      let userText = null;
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === assistantId);
        if (idx <= 0) return prev;
        const candidate = prev[idx - 1];
        if (candidate.role !== 'user') return prev;
        userText = candidate.content;
        return prev.slice(0, idx - 1);
      });
      if (userText) {
        // setTimeout so state update commits before send picks up the message list
        setTimeout(() => send(userText), 0);
      }
    },
    [streaming, send]
  );

  const loadConversation = useCallback(
    async (id) => {
      if (!id) return;
      abortRef.current?.abort();
      setRestoring(true);
      setError(null);
      setStreaming(false);
      try {
        const res = await fetch(HISTORY_ENDPOINT(id));
        if (!res.ok) throw new Error('Failed to load history');
        const data = await res.json();
        if (data && Array.isArray(data.messages)) {
          const restored = data.messages
            .filter(
              (m) =>
                m && (m.role === 'user' || m.role === 'assistant') &&
                typeof m.content === 'string'
            )
            .map((m, i) => ({
              id: `r-${i}-${id}`,
              role: m.role,
              content: stripSystemMetadata(m.content),
              citations: m.citations || [],
              guardrailsTripped: [],
              done: true,
            }));
          setMessages([INITIAL_GREETING, ...restored]);
          setConversationId(id);
        }
      } catch (err) {
        setError('Could not load that conversation thread.');
      } finally {
        setRestoring(false);
      }
    },
    [setConversationId]
  );

  return {
    messages,
    streaming,
    restoring,
    conversationId,
    error,
    send,
    stop,
    reset,
    retry,
    submitFeedback,
    loadConversation,
  };
}

export const CONCIERGE_SUGGESTED_PROMPTS = [
  'What does Kangqore do?',
  'Which service is right for my business?',
  'Build me a project roadmap',
  'I want to build an app',
  'I need AI automation',
  'Compare Kangqore services',
  'What is your approach to SAP S/4HANA migration?',
  'Do you have SOC 2 Type II?',
  'Book a consultation',
];

export function getSuggestedPrompts(seedContext) {
  // 1. Try the contextual intelligence registry for domain-specific prompts
  const ctx = getPageContext(seedContext);
  if (ctx?.prompts?.length) return ctx.prompts;

  // 2. Fallback: generic service/department prompts
  const name = seedContext?.name?.trim();
  if (seedContext?.surface === 'service' && name) {
    return [
      `What does ${name} actually do?`,
      `How does Kangqore approach ${name}?`,
      `Book a consultation about ${name}`,
    ];
  }
  if (seedContext?.surface === 'department' && name) {
    return [
      `What services does ${name} include?`,
      `What outcomes does ${name} typically deliver?`,
      `Book a consultation about ${name}`,
    ];
  }
  return CONCIERGE_SUGGESTED_PROMPTS;
}
