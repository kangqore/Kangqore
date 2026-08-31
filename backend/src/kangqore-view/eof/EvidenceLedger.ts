// The Evidence Ledger — what happened to this object, from every source that
// already records it.
//
// Enterprises need to answer "what happened", not only "what is the state now".
// Four systems already hold that answer and none of them could be read together:
//
//   OntologyEvent        domain events emitted by governed actions
//   ActionExecution      every action the Action Engine ran, with its effects
//   AgentMissionStep     every stage of every mission, including refusals
//   ObjectComment        what people and agents said about it
//
// Nothing new is written here. The ledger is a read across records that were
// already being kept, which is why it is cheap and why every entry is real.
//
// CDC is deliberately not a source: it is a live firehose with a 500-event ring
// buffer, so it cannot answer questions about last week. Durable history comes
// from the four tables above.

import { prisma } from '../../lib/prisma'

export interface LedgerEntry {
  at: Date
  /** EVENT | ACTION | MISSION | COMMENT */
  source: 'EVENT' | 'ACTION' | 'MISSION' | 'COMMENT'
  kind: string
  title: string
  detail: string | null
  actor: string | null
  actorType: string | null
  /** Anything that lets a reader verify the entry themselves. */
  refs: Record<string, any>
  /** Whether this entry changed the object, as opposed to observing it. */
  mutating: boolean
}

const shorten = (s: string, n = 180) => (s.length > n ? s.slice(0, n - 1) + '…' : s)

export const EvidenceLedger = {
  /**
   * Everything known to have happened to one object, newest first.
   *
   * `since` narrows the window; `sources` narrows the kind. Both matter on a
   * long-lived object, where the full ledger is the least useful view of it.
   */
  async forObject(objectId: string, opts: {
    since?: Date; limit?: number; sources?: LedgerEntry['source'][]
  } = {}): Promise<{ entries: LedgerEntry[]; counts: Record<string, number>; truncated: boolean }> {
    const limit = Math.min(opts.limit ?? 200, 1000)
    const want = (s: LedgerEntry['source']) => !opts.sources?.length || opts.sources.includes(s)
    const since = opts.since
    const entries: LedgerEntry[] = []

    // ── Domain events ────────────────────────────────────────────────────────
    if (want('EVENT')) {
      const events = await prisma.ontologyEvent.findMany({
        where: { objectId, ...(since ? { occurredAt: { gte: since } } : {}) },
        orderBy: { occurredAt: 'desc' }, take: limit,
      })
      for (const e of events) {
        const p = (e.properties ?? {}) as any
        entries.push({
          at: e.occurredAt,
          source: 'EVENT',
          kind: e.eventType,
          title: e.eventType.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase()),
          detail: p.reason ?? p.recommendation ?? p.newDueDate ?? null,
          actor: e.actorId,
          actorType: null,
          refs: { eventId: e.id, ...p },
          mutating: true,
        })
      }
    }

    // ── Governed actions ─────────────────────────────────────────────────────
    if (want('ACTION')) {
      const execs = await prisma.actionExecution.findMany({
        where: { objectId, ...(since ? { createdAt: { gte: since } } : {}) },
        include: { action: { select: { name: true, displayName: true } } },
        orderBy: { createdAt: 'desc' }, take: limit,
      })
      for (const x of execs) {
        const effects = (x.effectsApplied as any[]) ?? []
        entries.push({
          at: x.createdAt,
          source: 'ACTION',
          kind: x.action?.name ?? 'ACTION',
          title: x.action?.displayName ?? x.action?.name ?? 'Action executed',
          detail: x.status === 'SUCCESS'
            ? `${effects.length} effect(s) applied`
            : `Failed: ${x.errorMessage ?? 'no reason recorded'}`,
          actor: x.actorId,
          actorType: x.actorType,
          refs: { executionId: x.id, status: x.status, effects, durationMs: x.durationMs },
          // A failed action changed nothing, and saying otherwise would make
          // the ledger misleading in exactly the place it matters.
          mutating: x.status === 'SUCCESS',
        })
      }
    }

    // ── Missions ─────────────────────────────────────────────────────────────
    if (want('MISSION')) {
      const proposed = await prisma.agentProposedAction.findMany({
        where: { targetId: objectId },
        include: {
          mission: { select: { id: true, intentText: true, status: true, approvedBy: true, approvedAt: true } },
        },
        orderBy: { createdAt: 'desc' }, take: limit,
      })
      for (const a of proposed) {
        if (since && a.createdAt < since) continue
        entries.push({
          at: a.executedAt ?? a.createdAt,
          source: 'MISSION',
          kind: a.actionName,
          title: `${a.actionName} — ${a.status.toLowerCase().replace(/_/g, ' ')}`,
          detail: shorten(a.rationale),
          actor: a.mission?.approvedBy ?? null,
          actorType: 'KIMMP',
          refs: {
            missionId: a.missionId,
            intent: a.mission?.intentText,
            missionStatus: a.mission?.status,
            approvedBy: a.mission?.approvedBy,
            executionId: a.executionId,
          },
          mutating: a.status === 'EXECUTED',
        })
      }
    }

    // ── Thread ───────────────────────────────────────────────────────────────
    if (want('COMMENT')) {
      const comments = await prisma.objectComment.findMany({
        where: { objectId, deletedAt: null, ...(since ? { createdAt: { gte: since } } : {}) },
        orderBy: { createdAt: 'desc' }, take: limit,
      })
      for (const c of comments) {
        entries.push({
          at: c.createdAt,
          source: 'COMMENT',
          kind: c.authorType,
          title: c.authorType === 'HUMAN' ? 'Comment' : `${c.authorType} posted`,
          detail: shorten(c.body),
          actor: c.authorId,
          actorType: c.authorType,
          refs: { commentId: c.id, parentId: c.parentId, evidence: c.evidence },
          mutating: false,
        })
      }
    }

    entries.sort((a, b) => b.at.getTime() - a.at.getTime())

    const counts: Record<string, number> = {}
    for (const e of entries) counts[e.source] = (counts[e.source] ?? 0) + 1

    return {
      entries: entries.slice(0, limit),
      counts,
      truncated: entries.length > limit,
    }
  },

  /**
   * The narrative form — what §8 of the analysis asks for. Rendered from the
   * same entries, so the prose and the record cannot disagree.
   */
  async narrate(objectId: string, limit = 30) {
    const { entries } = await this.forObject(objectId, { limit })
    const object = await prisma.ontologyObject.findUnique({
      where: { id: objectId }, include: { type: { select: { name: true } } },
    })
    if (!object) throw new Error('No such object')

    const title = String((object.properties as any)?.title ?? objectId)
    const lines = [...entries].reverse().map(e => {
      const t = e.at.toISOString().replace('T', ' ').slice(0, 16)
      const who = e.actor ? ` (${e.actor})` : ''
      return `${t}  ${e.title}${who}${e.detail ? ` — ${e.detail}` : ''}`
    })

    return {
      objectId,
      title,
      typeName: object.type.name,
      lines,
      // An object with no history says so, rather than rendering an empty box.
      empty: lines.length === 0,
    }
  },

  /** Ledger across a whole type — the organisation-level view. */
  async forType(typeName: string, opts: { since?: Date; limit?: number } = {}) {
    const type = await prisma.ontologyObjectType.findUnique({
      where: { name: typeName }, select: { id: true },
    })
    if (!type) throw new Error(`No such type: ${typeName}`)

    const objects = await prisma.ontologyObject.findMany({
      where: { typeId: type.id, validTo: null }, select: { id: true, properties: true }, take: 200,
    })
    const ids = objects.map(o => o.id)
    if (!ids.length) return { entries: [], objects: 0 }

    const since = opts.since ?? new Date(Date.now() - 30 * 86_400_000)
    const [execs, comments] = await Promise.all([
      prisma.actionExecution.count({ where: { objectId: { in: ids }, createdAt: { gte: since } } }),
      prisma.objectComment.count({ where: { objectId: { in: ids }, createdAt: { gte: since } } }),
    ])

    // Busiest objects first: where the activity is, is usually the question.
    const perObject = await prisma.actionExecution.groupBy({
      by: ['objectId'],
      where: { objectId: { in: ids }, createdAt: { gte: since } },
      _count: { id: true },
    })
    const titleOf = new Map(objects.map(o => [o.id, String((o.properties as any)?.title ?? o.id)]))

    return {
      objects: ids.length,
      since: since.toISOString(),
      actions: execs,
      comments,
      busiest: perObject
        .sort((a, b) => b._count.id - a._count.id)
        .slice(0, 10)
        .map(r => ({ objectId: r.objectId, title: titleOf.get(r.objectId!) ?? r.objectId, actions: r._count.id })),
    }
  },
}
