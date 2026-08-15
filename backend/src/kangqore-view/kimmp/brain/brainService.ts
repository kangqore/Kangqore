// ---------------------------------------------------------------------------
// WAANDA Brain — file-based knowledge galaxy for the Neural Cortex page.
//
// Reads the operator's markdown notes directory (default: the Claude project
// memory folder), builds a force-graph of notes (neurons) linked by wikilinks,
// chronology and keyword similarity, and answers questions over them via the
// KIMMP LLM router — the Anthropic key never leaves this process.
//
// Node ids are ALWAYS the node's index in the nodes array. Later features
// (camera fly-to, cluster highlight, live node birth) look nodes up by index.
// ---------------------------------------------------------------------------

import { promises as fs, existsSync } from 'fs'
import path from 'path'
import os from 'os'
import logger from '../../../utils/logger'

export interface BrainNode {
  id: number          // index in the nodes array — the lookup contract
  slug: string
  title: string
  group: string       // color group: identity | architecture | chronicle | commercial | ops | core | capture
  description: string
  excerpt: string
  val: number         // visual size hint
  file: string        // relative filename (for the side panel footer)
}

export interface BrainLink { source: number; target: number }

export interface BrainGraph {
  nodes: BrainNode[]
  links: BrainLink[]
  count: number
  dir: string
}

const DEFAULT_BRAIN_DIR = path.join(
  os.homedir(),
  '.claude/projects/-Users-maheshkumar-Kangqore/memory',
)

export function resolveBrainDir(): string {
  const fromEnv = process.env.WAANDA_BRAIN_DIR
  if (fromEnv && existsSync(fromEnv)) return fromEnv
  if (existsSync(DEFAULT_BRAIN_DIR)) return DEFAULT_BRAIN_DIR
  return path.join(process.cwd(), '..', 'docs')
}

// ── frontmatter + markdown helpers ───────────────────────────────────────────

function parseFrontmatter(raw: string): { attrs: Record<string, string>; body: string } {
  const attrs: Record<string, string> = {}
  if (!raw.startsWith('---')) return { attrs, body: raw }
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { attrs, body: raw }
  const head = raw.slice(3, end)
  const body = raw.slice(end + 4).replace(/^\r?\n/, '')
  for (const line of head.split('\n')) {
    const m = line.match(/^\s*([A-Za-z_-]+):\s*(.+)\s*$/)
    if (m) attrs[m[1].toLowerCase()] = m[2].trim()
  }
  return { attrs, body }
}

function stripMd(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_`>|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'was', 'were', 'has', 'have',
  'not', 'all', 'its', 'via', 'per', 'now', 'new', 'one', 'two', 'complete', 'done', 'next',
  'live', 'merged', 'page', 'pages', 'still', 'also', 'only', 'into', 'over', 'both',
])

function tokens(text: string): string[] {
  return stripMd(text)
    .toLowerCase()
    .split(/[^a-z0-9™]+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t))
}

function classifyGroup(slug: string, relDir: string, type: string): string {
  if (relDir.startsWith('captures')) return 'capture'
  if (/^s\d/.test(slug)) return 'chronicle'
  if (/identity|waanda|kimmp|aegis|wee|jarvis|voice|gen\d|eqore|alis/.test(slug)) return 'identity'
  if (/architecture|wvis|vis|blueprint|runtime|freeze|constitution|spec|schema|scaffold|view|immp/.test(slug)) return 'architecture'
  if (/commercial|bids|phase2|roadmap|revenue|customer|strategy/.test(slug)) return 'commercial'
  if (/user-profile|feedback|dev-env|seed|pending|scout|tts|env/.test(slug)) return 'ops'
  if (type === 'user' || type === 'feedback' || type === 'reference') return 'ops'
  return 'core'
}

function titleFromSlug(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// ── brain loading + caching ──────────────────────────────────────────────────

interface LoadedNote {
  slug: string
  title: string
  group: string
  description: string
  body: string
  file: string
  wikilinks: string[]
}

let cache: { graph: BrainGraph; loadedAt: number } | null = null

export function invalidateBrain() { cache = null }

async function readNotesIn(dir: string, relDir: string): Promise<LoadedNote[]> {
  const notes: LoadedNote[] = []
  let entries: string[] = []
  try { entries = await fs.readdir(dir) } catch { return notes }

  entries.sort()
  if (relDir.startsWith('captures')) {
    // newborn notes must always append at the END of the nodes array so the
    // numeric id === index contract stays stable within a live session
    const times = new Map<string, number>()
    for (const e of entries) {
      try { times.set(e, (await fs.stat(path.join(dir, e))).birthtimeMs) } catch { times.set(e, 0) }
    }
    entries.sort((a, b) => (times.get(a) ?? 0) - (times.get(b) ?? 0))
  }

  for (const entry of entries) {
    if (!entry.endsWith('.md') || entry === 'MEMORY.md') continue
    const full = path.join(dir, entry)
    let raw = ''
    try { raw = await fs.readFile(full, 'utf-8') } catch { continue }
    const { attrs, body } = parseFrontmatter(raw)
    const slug = (attrs.name || entry.replace(/\.md$/, '')).toLowerCase()
    const heading = body.match(/^#\s+(.+)$/m)?.[1]
    const wikilinks = [...body.matchAll(/\[\[([a-z0-9-]+)\]\]/gi)].map(m => m[1].toLowerCase())
    notes.push({
      slug,
      title: heading?.trim() || titleFromSlug(slug),
      group: classifyGroup(slug, relDir, attrs.type || ''),
      description: attrs.description || '',
      body,
      file: relDir ? `${relDir}/${entry}` : entry,
      wikilinks,
    })
  }
  return notes
}

export async function loadBrain(force = false): Promise<BrainGraph> {
  if (!force && cache && Date.now() - cache.loadedAt < 30_000) return cache.graph

  const dir = resolveBrainDir()
  const notes = [
    ...await readNotesIn(dir, ''),
    ...await readNotesIn(path.join(dir, 'captures'), 'captures'),
  ]

  const nodes: BrainNode[] = notes.map((n, i) => ({
    id: i,   // contract: numeric id === position in the nodes array
    slug: n.slug,
    title: n.title,
    group: n.group,
    description: n.description,
    excerpt: stripMd(n.body).slice(0, 480),
    val: Math.max(2, Math.min(10, Math.round(Math.log2(n.body.length + 1)) - 4)),
    file: n.file,
  }))

  const bySlug = new Map(notes.map((n, i) => [n.slug, i]))
  const linkKeys = new Set<string>()
  const links: BrainLink[] = []
  const addLink = (a: number, b: number) => {
    if (a === b || a < 0 || b < 0) return
    const key = a < b ? `${a}-${b}` : `${b}-${a}`
    if (linkKeys.has(key)) return
    linkKeys.add(key)
    links.push({ source: a, target: b })
  }

  // 1. explicit [[wikilinks]]
  notes.forEach((n, i) => n.wikilinks.forEach(w => {
    const j = bySlug.get(w)
    if (j !== undefined) addLink(i, j)
  }))

  // 2. chronicle chain — sprint logs linked in numeric order
  const chronicle = notes
    .map((n, i) => ({ i, num: parseInt(n.slug.match(/^s(\d+)/)?.[1] ?? '', 10) }))
    .filter(c => !isNaN(c.num))
    .sort((a, b) => a.num - b.num)
  for (let k = 1; k < chronicle.length; k++) addLink(chronicle[k - 1].i, chronicle[k].i)

  // 3. keyword similarity — each note attaches to its most related sibling
  const tokenSets = notes.map(n => new Set(tokens(`${n.title} ${n.description}`)))
  const degree = new Map<number, number>()
  links.forEach(l => {
    degree.set(l.source, (degree.get(l.source) ?? 0) + 1)
    degree.set(l.target, (degree.get(l.target) ?? 0) + 1)
  })
  notes.forEach((_, i) => {
    let best = -1; let bestScore = 0
    tokenSets.forEach((other, j) => {
      if (i === j) return
      let score = 0
      tokenSets[i].forEach(t => { if (other.has(t)) score++ })
      if (score > bestScore) { bestScore = score; best = j }
    })
    const isolated = !(degree.get(i) ?? 0)
    if (best >= 0 && (bestScore >= 2 || isolated)) addLink(i, best)
  })

  const graph: BrainGraph = { nodes, links, count: nodes.length, dir }
  cache = { graph, loadedAt: Date.now() }
  return graph
}

// ── retrieval ────────────────────────────────────────────────────────────────

export async function searchNotes(query: string, k = 6): Promise<Array<BrainNode & { score: number }>> {
  const graph = await loadBrain()
  const qTokens = tokens(query)
  if (!qTokens.length) return []
  const scored = graph.nodes.map(n => {
    const title = n.title.toLowerCase()
    const desc = n.description.toLowerCase()
    const body = n.excerpt.toLowerCase()
    let score = 0
    for (const t of qTokens) {
      if (title.includes(t)) score += 3
      if (desc.includes(t)) score += 2
      if (body.includes(t)) score += 1
    }
    return { ...n, score }
  })
  return scored.filter(n => n.score > 0).sort((a, b) => b.score - a.score).slice(0, k)
}

// ── capture (grow the brain) ─────────────────────────────────────────────────

export async function addCapture(text: string): Promise<{ node: BrainNode; relatedId: number | null }> {
  const dir = resolveBrainDir()
  const capturesDir = path.join(dir, 'captures')
  await fs.mkdir(capturesDir, { recursive: true })

  const clean = text.trim().replace(/\s+/g, ' ')
  const titleWords = clean.split(' ').slice(0, 7).join(' ')
  const title = titleWords.charAt(0).toUpperCase() + titleWords.slice(1)
  let slug = titleWords.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'capture'
  if (existsSync(path.join(capturesDir, `${slug}.md`))) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  // anchor the newborn note to its most related sibling via a real wikilink
  const related = (await searchNotes(clean, 2)).filter(n => n.group !== 'capture' || n.slug !== slug)[0] ?? null

  const md = [
    '---',
    `name: ${slug}`,
    `description: ${clean.slice(0, 120)}`,
    'metadata:',
    '  type: capture',
    `created: ${new Date().toISOString()}`,
    '---',
    '',
    `# ${title}`,
    '',
    clean,
    ...(related ? ['', `Related: [[${related.slug}]]`] : []),
    '',
  ].join('\n')

  await fs.writeFile(path.join(capturesDir, `${slug}.md`), md, 'utf-8')
  invalidateBrain()
  const graph = await loadBrain(true)
  const node = graph.nodes.find(n => n.slug === slug)
  if (!node) throw new Error('capture written but not indexed')
  return { node, relatedId: related ? graph.nodes.find(n => n.slug === related.slug)?.id ?? null : null }
}

// ── delete a capture (manage the brain) ──────────────────────────────────────
// Only ever touches files inside captures/ — the slug must match the strict
// format addCapture() generates, and the resolved path is verified to still
// live inside capturesDir before unlinking, so this can't be used to delete
// arbitrary files even if a caller passed a crafted slug.

export async function deleteCapture(slug: string): Promise<boolean> {
  if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) return false
  const dir = path.resolve(resolveBrainDir())
  const capturesDir = path.resolve(dir, 'captures')
  const target = path.resolve(capturesDir, `${slug}.md`)
  if (!target.startsWith(capturesDir + path.sep)) return false
  try {
    await fs.unlink(target)
  } catch {
    return false
  }
  invalidateBrain()
  return true
}

// ── per-session conversation history ─────────────────────────────────────────

interface Turn { role: 'user' | 'assistant'; content: string }
const sessions = new Map<string, { turns: Turn[]; last: number }>()

export function getSession(id: string): Turn[] {
  const now = Date.now()
  for (const [k, v] of sessions) if (now - v.last > 30 * 60_000) sessions.delete(k)
  return sessions.get(id)?.turns ?? []
}

export function pushSession(id: string, ...turns: Turn[]) {
  const s = sessions.get(id) ?? { turns: [], last: 0 }
  s.turns.push(...turns)
  if (s.turns.length > 12) s.turns.splice(0, s.turns.length - 12)
  s.last = Date.now()
  sessions.set(id, s)
  if (sessions.size > 200) {
    const oldest = [...sessions.entries()].sort((a, b) => a[1].last - b[1].last)[0]
    if (oldest) sessions.delete(oldest[0])
  }
}

logger.info(`[Brain] notes directory resolved to ${resolveBrainDir()}`)
