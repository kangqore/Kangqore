// ---------------------------------------------------------------------------
// KIMMP Phase 5 — RAG layer
//
// Gives KIMMP access to Kangqore's verified knowledge base so its reasoning
// is grounded in what Kangqore actually offers, prices, and delivers — not
// just behavioral signals in isolation.
//
// Wraps the existing `retrieve()` function from concierge.retrieval (same
// Voyage-AI embedding stack, same KnowledgeChunk index). KIMMP uses a
// separate query path so it never contends with eQORE's live chat retrieval.
//
// Degrades gracefully: if VOYAGE_API_KEY is absent or embeddings are not
// indexed, returns an empty context string. This keeps KIMMP functional
// without the RAG key — it just loses the KB grounding.
//
// Flag gate: KIMMP_RAG_ENABLED (default false). Enable once the KB is
// indexed and the quality of RAG-augmented reasoning has been verified.
// ---------------------------------------------------------------------------

import { retrieve } from '../../waanda/intelligence/ConciergeRetrieval';
import { KimmpFlags } from '../core/flags';
import logger from '../../../utils/logger';

export interface RagContext {
  /** Formatted string ready to append to a Claude prompt. Empty when unavailable. */
  contextBlock: string;
  /** Number of KB chunks retrieved. */
  chunkCount: number;
}

const MAX_CONTEXT_CHARS = 2000;

export class KimmpRag {
  /**
   * Retrieve relevant KB chunks for a given query and format them as a
   * prompt context block. Returns an empty context if RAG is disabled,
   * not configured, or retrieval fails.
   */
  static async query(query: string, k = 3): Promise<RagContext> {
    if (!KimmpFlags.ragEnabled()) {
      return { contextBlock: '', chunkCount: 0 };
    }

    try {
      const chunks = await retrieve(query, { k, minScore: 0.3, useMMR: true });
      if (chunks.length === 0) return { contextBlock: '', chunkCount: 0 };

      // Build a compact context block — title + excerpt, capped to avoid token bloat.
      let contextBlock = '--- Kangqore Knowledge Base (relevant context) ---\n';
      let chars = contextBlock.length;

      for (const chunk of chunks) {
        const excerpt = chunk.body.slice(0, 400);
        const entry = `[${chunk.title}]\n${excerpt}\n\n`;
        if (chars + entry.length > MAX_CONTEXT_CHARS) break;
        contextBlock += entry;
        chars += entry.length;
      }

      contextBlock += '--- End KB context ---';
      return { contextBlock, chunkCount: chunks.length };
    } catch (err) {
      logger.warn(`[KIMMP:RAG] retrieval failed: ${(err as Error).message}`);
      return { contextBlock: '', chunkCount: 0 };
    }
  }

  /**
   * Query the KB for context relevant to a conversation and return a compact
   * string suitable for injecting at the end of a Claude user prompt.
   * Returns an empty string if RAG is disabled or unavailable.
   */
  static async contextForConversation(messages: { role: string; content: string }[]): Promise<string> {
    // Build a short summary query from the last few user messages.
    const userText = messages
      .filter((m) => m.role === 'USER' || m.role === 'user')
      .map((m) => m.content)
      .slice(-3)
      .join(' ')
      .slice(0, 500);

    if (!userText.trim()) return '';
    const { contextBlock } = await KimmpRag.query(userText, 3);
    return contextBlock;
  }
}
