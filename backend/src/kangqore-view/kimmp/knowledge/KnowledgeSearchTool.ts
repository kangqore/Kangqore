// S318 — "search knowledge" as a Claude tool, exposed the same way S313
// exposes OntologyActions: a fixed Anthropic.Tool definition + an executor,
// merged into commandService.ts's combined tool set alongside Logic Tools
// and OntologyActionToolRegistry. There's no OntologyAction backing this one
// (it's not a business action, just a read), so the schema is hand-written
// rather than generated — the "reuse the same pattern" from S313 is the tool/
// executor shape, not the generator itself.

import type Anthropic from '@anthropic-ai/sdk'
import { unifiedSearch } from './UnifiedKnowledgeSearch'

const TOOL_NAME = 'search_knowledge_base'

export const KnowledgeSearchTool = {
  getTool(): Anthropic.Tool {
    return {
      name: TOOL_NAME,
      description: 'Semantic search over Kangqore\'s public knowledge base and every KIMMP system\'s indexed knowledge (meetings, playbooks, briefings, CVEs, prior decisions). Use when you need grounded, specific facts rather than general knowledge.',
      input_schema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'What to search for, in natural language' },
          k: { type: 'number', description: 'How many results to return (default 5, max 20)' },
        },
        required: ['query'],
      },
    }
  },

  isKnowledgeSearchTool(name: string): boolean {
    return name === TOOL_NAME
  },

  async executor(_name: string, input: any): Promise<string> {
    const query = String(input?.query ?? '')
    const k = Math.min(20, Math.max(1, Number(input?.k) || 5))
    if (!query.trim()) return JSON.stringify({ error: 'query is required' })
    const results = await unifiedSearch(query, k)
    return JSON.stringify({ results: results.map(r => ({ title: r.title, body: r.body, source: r.source, score: Number(r.score.toFixed(3)) })) })
  },
}
