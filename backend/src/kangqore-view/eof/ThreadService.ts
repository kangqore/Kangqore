// The contextual thread — conversation attached to the object it is about.
//
// The problem is context fragmentation: the task in one tool, the discussion in
// another, the decision in someone's memory. A thread that hangs off the
// OntologyObject cannot drift away from the record it concerns.
//
// Two things separate this from a comment box:
//
//   • an agent posts here too. When KIMMP raises a risk it says so in the same
//     thread a person would, with its evidence attached, so the reasoning is
//     part of the record rather than a notification that vanishes.
//   • a mention can name a ROLE rather than a person. "@Approver" resolves
//     through the object's own responsibility columns, so routing follows the
//     model instead of whoever someone remembered to type.

import { prisma } from '../../lib/prisma'
import { RESPONSIBILITY_ROLES } from './EnterpriseObjectModel'

/**
 * Reactions are a fixed vocabulary, not free emoji. Each one means something
 * the system can act on — "needs review" is a state, not a feeling — which is
 * what keeps lightweight signalling from becoming noise.
 */
export const REACTIONS = {
  ACKNOWLEDGED: { emoji: '👍', label: 'Acknowledged' },
  AGREED:       { emoji: '✅', label: 'Agreed' },
  NEEDS_REVIEW: { emoji: '👀', label: 'Needs review' },
  RISK:         { emoji: '⚠️', label: 'Risk' },
  HIGH_IMPACT:  { emoji: '🔥', label: 'High impact' },
  BLOCKED:      { emoji: '🚧', label: 'Blocked' },
  THANKS:       { emoji: '🙏', label: 'Thanks' },
} as const
export type ReactionKey = keyof typeof REACTIONS

/** `@word` where the word is a known responsibility role, else a user handle. */
const MENTION_RE = /@([A-Za-z][A-Za-z0-9._-]{1,40})/g

export interface PostInput {
  objectId: string
  body: string
  parentId?: string
  authorType?: 'HUMAN' | 'KIMMP' | 'HANUMANAS' | 'AUTOMATION'
  authorId?: string
  sourceModule?: string
  evidence?: any[]
}

export const ThreadService = {
  reactionVocabulary() {
    return Object.entries(REACTIONS).map(([key, v]) => ({ key, ...v }))
  },

  /**
   * Post to an object's thread. Mentions are parsed out of the body and stored
   * as rows, so "who was asked for what" is queryable rather than buried in
   * prose.
   */
  async post(input: PostInput) {
    const object = await prisma.ontologyObject.findUnique({
      where: { id: input.objectId },
      select: { id: true, properties: true },
    })
    if (!object) throw new Error('No such object')
    if (!input.body?.trim()) throw new Error('A comment needs a body')

    if (input.parentId) {
      const parent = await prisma.objectComment.findUnique({
        where: { id: input.parentId }, select: { objectId: true },
      })
      if (!parent) throw new Error('No such parent comment')
      if (parent.objectId !== input.objectId) {
        throw new Error('A reply must be on the same object as its parent')
      }
    }

    const comment = await prisma.objectComment.create({
      data: {
        objectId: input.objectId,
        parentId: input.parentId ?? null,
        body: input.body.trim(),
        authorType: input.authorType ?? 'HUMAN',
        authorId: input.authorId ?? null,
        sourceModule: input.sourceModule ?? null,
        evidence: (input.evidence ?? []) as any,
      },
    })

    // ── Mentions ─────────────────────────────────────────────────────────────
    const props = (object.properties ?? {}) as any
    const roles = new Set<string>(RESPONSIBILITY_ROLES as readonly string[])
    const seen = new Set<string>()
    const mentions: any[] = []

    for (const m of input.body.matchAll(MENTION_RE)) {
      const raw = m[1]
      if (seen.has(raw.toLowerCase())) continue
      seen.add(raw.toLowerCase())

      // A role mention resolves through the object's own responsibility
      // columns — @Approver means whoever approves THIS object.
      const role = [...roles].find(r => r.toLowerCase() === raw.toLowerCase())
      if (role) {
        mentions.push({
          commentId: comment.id, kind: 'ROLE', role,
          userId: typeof props[role] === 'string' ? props[role] : null,
        })
        continue
      }
      mentions.push({ commentId: comment.id, kind: 'USER', userId: raw })
    }
    if (mentions.length) await prisma.commentMention.createMany({ data: mentions })

    return this.get(comment.id)
  },

  /** An agent's post. Same thread, same accountability, marked as non-human. */
  postAsAgent(objectId: string, body: string, opts: {
    module: string; evidence?: any[]; authorType?: 'KIMMP' | 'HANUMANAS' | 'AUTOMATION'
  }) {
    return this.post({
      objectId, body,
      authorType: opts.authorType ?? 'KIMMP',
      authorId: opts.module,
      sourceModule: opts.module,
      evidence: opts.evidence,
    })
  },

  async get(commentId: string) {
    return prisma.objectComment.findUnique({
      where: { id: commentId },
      include: { mentions: true, reactions: true },
    })
  },

  /** The whole thread for an object, nested one level, newest root last. */
  async thread(objectId: string, limit = 200) {
    const rows = await prisma.objectComment.findMany({
      where: { objectId, deletedAt: null },
      include: { mentions: true, reactions: true },
      orderBy: { createdAt: 'asc' },
      take: limit,
    })

    const byId = new Map(rows.map(r => [r.id, { ...r, replies: [] as any[] }]))
    const roots: any[] = []
    for (const r of byId.values()) {
      if (r.parentId && byId.has(r.parentId)) byId.get(r.parentId)!.replies.push(r)
      else roots.push(r)
    }

    const tally = (c: any) => {
      const counts: Record<string, number> = {}
      for (const r of c.reactions) counts[r.reaction] = (counts[r.reaction] ?? 0) + 1
      c.reactionCounts = counts
      c.replies?.forEach(tally)
      return c
    }
    roots.forEach(tally)

    return {
      comments: roots,
      total: rows.length,
      // Stated so an empty thread reads as empty rather than broken.
      agentPosts: rows.filter(r => r.authorType !== 'HUMAN').length,
    }
  },

  async react(commentId: string, reaction: string, actorId: string) {
    if (!(reaction in REACTIONS)) {
      throw new Error(`"${reaction}" is not a reaction. Valid: ${Object.keys(REACTIONS).join(', ')}`)
    }
    const existing = await prisma.commentReaction.findUnique({
      where: { commentId_actorId_reaction: { commentId, actorId, reaction } },
    })
    // Clicking the same reaction twice removes it, which is what every product
    // that has one does.
    if (existing) {
      await prisma.commentReaction.delete({ where: { id: existing.id } })
      return { reaction, applied: false }
    }
    await prisma.commentReaction.create({ data: { commentId, reaction, actorId } })
    return { reaction, applied: true }
  },

  /** Soft delete: the thread is a record, so a post is struck through, not erased. */
  async remove(commentId: string, actorId: string) {
    const c = await prisma.objectComment.findUnique({ where: { id: commentId } })
    if (!c) throw new Error('No such comment')
    if (c.authorType === 'HUMAN' && c.authorId && c.authorId !== actorId) {
      throw new Error('Only the author can delete their comment')
    }
    return prisma.objectComment.update({
      where: { id: commentId }, data: { deletedAt: new Date() },
    })
  },

  /** What is waiting on a person — the point of mentioning them. */
  async inbox(userId: string, limit = 50) {
    const mentions = await prisma.commentMention.findMany({
      where: { userId, acknowledgedAt: null },
      include: { comment: { select: { id: true, objectId: true, body: true, createdAt: true, authorId: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    const objectIds = [...new Set(mentions.map(m => m.comment.objectId))]
    const objects = await prisma.ontologyObject.findMany({
      where: { id: { in: objectIds } },
      include: { type: { select: { name: true } } },
    })
    const byObject = new Map(objects.map(o => [o.id, o]))

    return {
      mentions: mentions.map(m => {
        const o = byObject.get(m.comment.objectId)
        return {
          id: m.id,
          kind: m.kind,
          role: m.role,
          commentId: m.comment.id,
          body: m.comment.body,
          createdAt: m.comment.createdAt,
          object: o
            ? { id: o.id, title: String((o.properties as any)?.title ?? o.id), typeName: o.type.name }
            : null,
        }
      }),
      unread: mentions.length,
    }
  },

  acknowledge(mentionId: string) {
    return prisma.commentMention.update({
      where: { id: mentionId }, data: { acknowledgedAt: new Date() },
    })
  },
}
