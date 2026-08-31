// Unstructured input becomes candidate structure.
//
// The single rule this is built around: **extraction proposes, it never
// writes.** A document saying "Acme Ltd, £400,000" produces a candidate that a
// person or a policy promotes into the graph. Extraction confident enough to be
// wrong is precisely how an ontology fills with fiction, and a graph nobody
// trusts is worse than an empty one.
//
// Scope, stated plainly rather than implied: this reads text. Plain text,
// Markdown, CSV and JSON are parsed directly. PDF, DOCX and images are accepted,
// recorded as UNREADABLE, and wait for a parser — they are not silently dropped
// and they are not pretended to have been read. Extraction over the text uses
// deterministic patterns for the things patterns genuinely catch (money, dates,
// emails, companies) and a model where one is available for the rest.

import { prisma } from '../../lib/prisma'
import { OntologyGateway, SYSTEM_ACTOR, type GatewayActor } from './OntologyGateway'
import { ModelIntrospection } from './ModelIntrospection'
import { routedCall } from '../kimmp/llm/kimmpLLMRouter'

/** Types we can read today. Anything else is recorded honestly as unreadable. */
const TEXTUAL = [
  'text/plain', 'text/markdown', 'text/csv', 'application/json',
  'text/html', 'application/xml', 'text/xml',
]

export interface ExtractedField {
  field: string
  value: string | number
  confidence: number
  sourceText: string
}

// ── Deterministic extractors ─────────────────────────────────────────────────
// These earn their place because they are exact: a regex that finds "£400,000"
// is not guessing. Anything requiring judgement is left to the model pass.

const PATTERNS: Array<{ field: string; re: RegExp; parse?: (m: string) => any; confidence: number }> = [
  { field: 'email', re: /\b[\w.+-]+@[\w-]+\.[\w.]{2,}\b/g, confidence: 0.95 },
  {
    field: 'value',
    re: /[£$€]\s?([\d,]+(?:\.\d{2})?)(?:\s?(k|m|bn))?/gi,
    parse: (m: string) => {
      const cleaned = m.replace(/[£$€,\s]/g, '').toLowerCase()
      const n = parseFloat(cleaned)
      if (/k$/.test(cleaned)) return parseFloat(cleaned) * 1_000
      if (/m$/.test(cleaned)) return parseFloat(cleaned) * 1_000_000
      if (/bn$/.test(cleaned)) return parseFloat(cleaned) * 1_000_000_000
      return n
    },
    confidence: 0.9,
  },
  { field: 'dueDate', re: /\b\d{4}-\d{2}-\d{2}\b/g, confidence: 0.85 },
  { field: 'phone', re: /\+\d{1,3}[\s-]?\d[\d\s-]{7,}\d/g, confidence: 0.7 },
]

/** Company-ish names: a capitalised run ending in a legal suffix. */
const COMPANY_RE = /\b([A-Z][\w&.'-]*(?:\s+[A-Z][\w&.'-]*){0,3})\s+(Ltd|Limited|Inc|LLC|PLC|GmbH|Pty|Corp|Corporation|Group)\b/g

function extractDeterministic(text: string): ExtractedField[] {
  const found: ExtractedField[] = []
  const seen = new Set<string>()

  for (const p of PATTERNS) {
    for (const m of text.matchAll(p.re)) {
      const raw = m[0]
      const key = `${p.field}:${raw}`
      if (seen.has(key)) continue
      seen.add(key)
      const start = Math.max(0, (m.index ?? 0) - 40)
      found.push({
        field: p.field,
        value: p.parse ? p.parse(raw) : raw,
        confidence: p.confidence,
        sourceText: text.slice(start, (m.index ?? 0) + raw.length + 40).replace(/\s+/g, ' ').trim(),
      })
    }
  }

  for (const m of text.matchAll(COMPANY_RE)) {
    const name = `${m[1]} ${m[2]}`.trim()
    if (seen.has(`title:${name}`)) continue
    seen.add(`title:${name}`)
    found.push({
      field: 'title', value: name, confidence: 0.75,
      sourceText: text.slice(Math.max(0, (m.index ?? 0) - 30), (m.index ?? 0) + name.length + 30).replace(/\s+/g, ' ').trim(),
    })
  }

  return found
}

export const IngestionEngine = {
  readableTypes: () => [...TEXTUAL],

  /**
   * Take a document in. Text is stored and extracted; anything else is recorded
   * as UNREADABLE rather than half-parsed into nonsense.
   */
  async ingest(input: {
    filename: string; mimeType: string; content: Buffer | string
    uploadedBy?: string; linkedObjectId?: string
  }) {
    const buf = typeof input.content === 'string' ? Buffer.from(input.content, 'utf8') : input.content
    const readable = TEXTUAL.some(t => input.mimeType.startsWith(t))

    const doc = await prisma.ingestionDocument.create({
      data: {
        filename: input.filename,
        mimeType: input.mimeType,
        sizeBytes: buf.length,
        text: readable ? buf.toString('utf8').slice(0, 500_000) : null,
        status: readable ? 'PENDING' : 'UNREADABLE',
        error: readable ? null
          : `${input.mimeType} needs a parser that is not installed. The file is stored and can be re-processed once one is.`,
        uploadedBy: input.uploadedBy ?? null,
        linkedObjectId: input.linkedObjectId ?? null,
      },
    })
    return doc
  },

  /**
   * Turn a document's text into candidates. Deterministic patterns first; a
   * model pass adds what patterns cannot see, when one is reachable.
   */
  async extract(documentId: string, opts: { typeName?: string; useModel?: boolean } = {}) {
    const doc = await prisma.ingestionDocument.findUnique({ where: { id: documentId } })
    if (!doc) throw new Error('No such document')
    if (!doc.text) {
      return { documentId, candidates: 0, status: doc.status, reason: doc.error ?? 'No readable text' }
    }

    const typeName = opts.typeName ?? 'Customer'
    if (!ModelIntrospection.typeNames().includes(typeName)) {
      throw new Error(`"${typeName}" is not an enterprise object type`)
    }

    const fields = extractDeterministic(doc.text)
    const notes: string[] = []

    // Model pass — additive, and never overrides a deterministic hit.
    if (opts.useModel) {
      try {
        const schema = ModelIntrospection.catalogue().find(t => t.name === typeName)
        const columns = [...(schema?.columns.CORE ?? []), ...(schema?.columns.ENTERPRISE ?? [])].slice(0, 15)
        const out: any = await routedCall(
          'claude-haiku-4-5-20251001',
          `Extract fields for a ${typeName} record. Reply as a JSON object using only these keys: ${columns.join(', ')}. ` +
          'Omit any key you cannot support from the text. Reply with JSON only.',
          doc.text.slice(0, 6000),
          400,
          { agentType: 'ingestion', tags: ['ingestion', typeName] },
        )
        const text = String(out?.text ?? out?.content ?? '')
        const json = text.match(/\{[\s\S]*\}/)?.[0]
        if (json) {
          const parsed = JSON.parse(json)
          const already = new Set(fields.map(f => f.field))
          for (const [k, v] of Object.entries(parsed)) {
            if (already.has(k) || v === null || v === '') continue
            fields.push({
              field: k, value: v as any,
              // Model-extracted values are held to a lower confidence than a
              // regex match, because they are a different kind of claim.
              confidence: 0.55,
              sourceText: '(model extraction)',
            })
          }
        }
      } catch (e: any) {
        notes.push(`Model pass unavailable: ${e?.message ?? e}`)
      }
    }

    if (!fields.length) {
      await prisma.ingestionDocument.update({ where: { id: documentId }, data: { status: 'EXTRACTED' } })
      return { documentId, candidates: 0, fields: 0, notes: [...notes, 'Nothing recognisable was found in the text'] }
    }

    // One candidate per document: the fields describe a single proposed record.
    const properties: Record<string, any> = {}
    for (const f of fields) if (properties[f.field] === undefined) properties[f.field] = f.value
    const confidence = fields.reduce((s, f) => s + f.confidence, 0) / fields.length

    const candidate = await prisma.ingestionCandidate.create({
      data: {
        documentId,
        typeName,
        properties: properties as any,
        confidence: Math.round(confidence * 100) / 100,
        sourceText: fields.map(f => f.sourceText).join('\n').slice(0, 4000),
      },
    })
    await prisma.ingestionDocument.update({ where: { id: documentId }, data: { status: 'EXTRACTED' } })

    return {
      documentId,
      candidateId: candidate.id,
      candidates: 1,
      fields: fields.length,
      confidence: candidate.confidence,
      extracted: properties,
      notes,
    }
  },

  candidates(status = 'PROPOSED', limit = 50) {
    return prisma.ingestionCandidate.findMany({
      where: { status },
      include: { document: { select: { filename: true, mimeType: true, createdAt: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  },

  /**
   * Promote a candidate into the graph. This is the only path from extracted
   * text to a real object, and it is deliberately a separate, deliberate act.
   */
  async promote(candidateId: string, actorId: string, actor: GatewayActor = SYSTEM_ACTOR) {
    const c = await prisma.ingestionCandidate.findUnique({ where: { id: candidateId } })
    if (!c) throw new Error('No such candidate')
    if (c.status !== 'PROPOSED') throw new Error(`Candidate is already ${c.status}`)

    const type = await prisma.ontologyObjectType.findUnique({
      where: { name: c.typeName }, select: { id: true },
    })
    if (!type) throw new Error(`Type ${c.typeName} is not in the ontology`)

    const props = { ...(c.properties as any), status: 'DRAFT', sourceDocument: c.documentId }
    const r = await OntologyGateway.createObject(actor, { typeId: type.id, properties: props })
    if (r.status !== 'OK') throw new Error(r.reason ?? r.status)

    await prisma.ingestionCandidate.update({
      where: { id: candidateId },
      data: { status: 'PROMOTED', promotedObjectId: r.data.id, decidedBy: actorId, decidedAt: new Date() },
    })

    // Created as DRAFT, never as live work — a promoted extraction still has to
    // be looked at before it counts.
    return { objectId: r.data.id, typeName: c.typeName, status: 'DRAFT' }
  },

  async reject(candidateId: string, actorId: string) {
    return prisma.ingestionCandidate.update({
      where: { id: candidateId },
      data: { status: 'REJECTED', decidedBy: actorId, decidedAt: new Date() },
    })
  },
}
