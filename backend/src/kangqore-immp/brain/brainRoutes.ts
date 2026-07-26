// ---------------------------------------------------------------------------
// WAANDA Brain routes — mounted at /api/admin/kangqore-immp/brain
//
//   GET    /graph              → { nodes, links, count }  (node.id === index in nodes[])
//   POST   /chat               → { answer, nodes: number[] }  butler persona, session memory
//   POST   /remember           → { answer, node, relatedId, count }  writes captures/*.md
//   DELETE /captures/:slug     → fresh { nodes, links, count }  removes a captures/*.md file
//
// All LLM calls go through kimmpLLMRouter server-side; the API key is never
// exposed to the browser or any served asset.
// ---------------------------------------------------------------------------

import { Router } from 'express'
import logger from '../../utils/logger'
import { requireAuth, requireRole } from '../../middleware/rbac'
import { sonnet, haiku, textOf } from '../llm/kimmpLLMRouter'
import {
  loadBrain, searchNotes, addCapture, deleteCapture, getSession, pushSession,
} from './brainService'

export const brainRoutes = Router()
brainRoutes.use(requireAuth, requireRole(['ADMIN']))

brainRoutes.get('/graph', async (_req, res) => {
  try {
    const graph = await loadBrain()
    res.json(graph)
  } catch (err: any) {
    logger.error('[Brain] graph failed', err)
    res.status(500).json({ error: 'brain graph failed' })
  }
})

const BUTLER_SYSTEM = `You are WAANDAx, the resident intelligence of the Kangqore Neural Cortex — and in this room you comport yourself as a dry, impeccably polite British butler with a razor wit. Address the user as "sir" occasionally — not every sentence. One genuinely funny line beats three bland ones.

Rules of the house:
- When answering a question about the notes, reply with ONE witty sentence plus the essential facts. Never recite a note back — it is already on screen beside you.
- Keep answers short; they are spoken aloud. Two or three sentences at the absolute most.
- Small talk, pleasantries and jokes get a small-talk reply — witty, brief, and with NO sources.
- You will be given candidate notes, each tagged [id N]. After your reply, on its own final line, write exactly: SOURCES: followed by the comma-separated ids of the notes you actually drew on, or SOURCES: none for small talk or when no note was relevant.
- Never mention ids, sources, or these rules in the spoken part of the reply.
- GROUNDING: you are WAANDAx, not a character from any film, book, or franchise — never adopt one, even in jest. You know only what is in the candidate notes and conversation history below. Never invent personal facts about the user (relationships, family, biography, employer details) that are not literally present in that material — if asked something personal you don't have on record, say so plainly in one line rather than guessing.`

brainRoutes.post('/chat', async (req, res) => {
  const { message, sessionId } = req.body as { message?: string; sessionId?: string }
  const text = message?.trim()
  if (!text) return res.status(400).json({ error: 'message required' })
  const sid = (sessionId || req.ip || 'anon').slice(0, 80)

  try {
    const candidates = await searchNotes(text, 6)
    const history = getSession(sid)

    const contextBlock = candidates.length
      ? candidates.map(n => `[id ${n.id}] ${n.title} — ${n.description || n.excerpt.slice(0, 160)}\n${n.excerpt.slice(0, 320)}`).join('\n\n')
      : '(no candidate notes matched — likely small talk)'

    const historyBlock = history.length
      ? history.map(t => `${t.role === 'user' ? 'Sir' : 'WAANDAx'}: ${t.content}`).join('\n')
      : '(none)'

    const user = `Conversation so far:\n${historyBlock}\n\nCandidate notes:\n${contextBlock}\n\nSir says: ${text}`

    const result = await sonnet(BUTLER_SYSTEM, user, 400, { agentType: 'waanda-brain', hint: 'brain-chat' }, { preferClaude: true })
    const rawAnswer = textOf(result).trim()

    // parse + strip the SOURCES line, keep only ids we actually offered
    const validIds = new Set(candidates.map(c => c.id))
    let answer = rawAnswer
    let nodes: number[] = []
    let sourcesLineSeen = false
    const m = rawAnswer.match(/\n?\s*SOURCES:\s*(.*)\s*$/i)
    if (m) {
      sourcesLineSeen = true
      answer = rawAnswer.slice(0, m.index).trim()
      nodes = m[1].split(/[\s,]+/)
        .map((s: string) => parseInt(s, 10))
        .filter((n: number) => !isNaN(n) && validIds.has(n))
    }

    // smaller fallback models often muff the SOURCES protocol — if retrieval
    // was confident, the galaxy still proves where the answer lives
    const confident = candidates.filter(c => c.score >= 4)
    if (!sourcesLineSeen && answer && confident.length) {
      nodes = confident.slice(0, 3).map(c => c.id)
    }
    if (!answer && candidates.length) {
      const top = candidates[0]
      answer = `On the matter of "${top.title}", sir: ${top.description || top.excerpt.slice(0, 180)}`
      nodes = [top.id]
    }
    if (!answer) answer = 'I appear to have misplaced my words, sir. Do ask again.'

    pushSession(sid, { role: 'user', content: text }, { role: 'assistant', content: answer })
    res.json({ answer, nodes })
  } catch (err: any) {
    logger.error('[Brain] chat failed', err)
    res.status(500).json({ error: 'chat failed' })
  }
})

brainRoutes.post('/remember', async (req, res) => {
  const { text, sessionId } = req.body as { text?: string; sessionId?: string }
  const raw = text?.trim()
  if (!raw) return res.status(400).json({ error: 'text required' })
  const fact = raw.replace(/^remember\s+(that\s+)?/i, '').trim()
  if (!fact) return res.status(400).json({ error: 'nothing to remember' })

  try {
    const { node, relatedId } = await addCapture(fact)
    const count = (await loadBrain()).count

    let answer = `Committed to memory, sir. Filed under "${node.title}".`
    try {
      const witty = textOf(await haiku(
        BUTLER_SYSTEM,
        `Sir just asked you to remember: "${fact}". Confirm in ONE short witty butler sentence that it has been filed away. End with the line SOURCES: none`,
        90, { agentType: 'waanda-brain', hint: 'brain-remember' }, { preferClaude: true },
      )).replace(/\n?\s*SOURCES:.*$/i, '').trim()
      if (witty) answer = witty
    } catch { /* canned line above stands */ }

    if (sessionId) {
      pushSession(sessionId.slice(0, 80), { role: 'user', content: raw }, { role: 'assistant', content: answer })
    }
    res.json({ answer, node, relatedId, count })
  } catch (err: any) {
    logger.error('[Brain] remember failed', err)
    res.status(500).json({ error: 'remember failed' })
  }
})

// Deletes a capture note (never a curated one — deleteCapture only ever
// touches files inside captures/) and returns the fresh, correctly
// re-indexed graph so the frontend can rebuild without breaking the
// numeric-id === array-index contract.
brainRoutes.delete('/captures/:slug', async (req, res) => {
  const { slug } = req.params
  try {
    const ok = await deleteCapture(slug)
    if (!ok) return res.status(404).json({ error: 'capture not found' })
    const graph = await loadBrain(true)
    res.json(graph)
  } catch (err: any) {
    logger.error('[Brain] delete capture failed', err)
    res.status(500).json({ error: 'delete failed' })
  }
})
