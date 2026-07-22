import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/rbac'

export const communitiesRouter = Router()

const SEED_COMMUNITIES = [
  { name: 'k/architecture',  slug: 'architecture', description: 'Platform & Cloud Architecture',               color: '#3B82F6', topicTags: ['cloud','microservices','platform'] },
  { name: 'k/ai-agents',     slug: 'ai-agents',    description: 'Agentic AI & Cognition',                     color: '#10B981', topicTags: ['agents','waanda','llm'] },
  { name: 'k/governance',    slug: 'governance',   description: 'Enterprise Trust & Compliance',               color: '#8B5CF6', topicTags: ['compliance','aegis','security'] },
  { name: 'k/workflows',     slug: 'workflows',    description: 'Automation & Engineering',                    color: '#FB923C', topicTags: ['automation','bpmn','ops'] },
  { name: 'k/showcase',      slug: 'showcase',     description: 'Member Demos & Launches',                    color: '#F43F5E', topicTags: ['demo','launch','community'] },
  { name: 'k/kangqore-os',   slug: 'kangqore-os',  description: 'Kangqore OS · Enterprise Operating System', color: '#d4a017', topicTags: ['os','bids','platform'] },
  { name: 'k/bids',          slug: 'bids',         description: 'BIDS™ · Business Intelligence Delivery System', color: '#2564ea', topicTags: ['bids','enterprise','intelligence'] },
]

async function seedCommunities() {
  const count = await (prisma as any).communityGroup.count()
  if (count > 0) return
  for (const c of SEED_COMMUNITIES) {
    await (prisma as any).communityGroup.create({ data: c })
  }
}

// GET /api/communities
communitiesRouter.get('/', async (req, res) => {
  try {
    await seedCommunities()
    const groups = await (prisma as any).communityGroup.findMany({
      orderBy: { memberCount: 'desc' },
      include: { _count: { select: { posts: true, members: true } } },
    })
    res.json(groups)
  } catch (e) {
    res.status(500).json({ error: (e as Error).message })
  }
})

// GET /api/communities/search?q=term&limit=20  — must come before /:id
communitiesRouter.get('/search', async (req, res) => {
  try {
    const { q, limit = '20' } = req.query as Record<string, string>
    if (!q || q.trim().length < 2) return res.json({ posts: [], total: 0 })
    const term = q.trim()
    const posts = await (prisma as any).communityPost.findMany({
      where: {
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { body:  { contains: term, mode: 'insensitive' } },
          { tags:  { has: term.toLowerCase() } },
        ],
      },
      take: Math.min(parseInt(limit), 50),
      orderBy: { createdAt: 'desc' },
      include: { community: { select: { name: true, color: true, slug: true } } },
    })
    res.json({ posts, total: posts.length })
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// GET /api/communities/mod/stats  — moderation stats per community
communitiesRouter.get('/mod/stats', requireAuth, async (req, res) => {
  try {
    const groups = await (prisma as any).communityGroup.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { posts: true, members: true } },
      },
    })
    const flagged = await (prisma as any).communityPost.groupBy({
      by: ['communityId'],
      where: { flagCount: { gt: 0 } },
      _sum: { flagCount: true },
      _count: { id: true },
    })
    const flaggedMap = Object.fromEntries(flagged.map((f: any) => [f.communityId, { count: f._count.id, total: f._sum.flagCount ?? 0 }]))
    const stats = groups.map((g: any) => ({
      id: g.id, name: g.name, slug: g.slug, color: g.color,
      posts: g._count.posts, members: g._count.members,
      flagged: flaggedMap[g.id]?.count ?? 0,
    }))
    res.json(stats)
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// GET /api/communities/mod/flagged?limit=50  — posts with flags
communitiesRouter.get('/mod/flagged', requireAuth, async (req, res) => {
  try {
    const { limit = '50' } = req.query as Record<string, string>
    const posts = await (prisma as any).communityPost.findMany({
      where: { flagCount: { gt: 0 } },
      orderBy: { flagCount: 'desc' },
      take: parseInt(limit),
      include: { community: { select: { name: true, color: true, slug: true } } },
    })
    res.json({ posts, total: posts.length })
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// POST /api/communities/digest/trigger  — generate KIMMP weekly digest per community
communitiesRouter.post('/digest/trigger', requireAuth, async (req, res) => {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const groups = await (prisma as any).communityGroup.findMany({ select: { id: true, name: true, slug: true } })
    const signals = []
    for (const g of groups) {
      const top = await (prisma as any).communityPost.findMany({
        where: { communityId: g.id, createdAt: { gte: since } },
        orderBy: [{ voteCount: 'desc' }, { replyCount: 'desc' }],
        take: 3,
        select: { title: true, voteCount: true, replyCount: true },
      })
      if (top.length === 0) continue
      const summary = top.map((p: any, i: number) => `${i + 1}. "${p.title}" (${p.voteCount} votes, ${p.replyCount} replies)`).join(' · ')
      const sig = await (prisma as any).kimmpSignal.create({
        data: {
          type: 'COMMUNITY_DIGEST',
          priority: 'low',
          title: `Weekly Digest: ${g.name}`,
          summary: `Top posts this week — ${summary}`,
          module: 'Communities',
          confidence: 100,
        },
      }).catch(() => null)
      if (sig) signals.push(sig)
    }
    res.json({ ok: true, generated: signals.length })
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// GET /api/communities/feed?sort=hot|new|top&page=1&limit=20&category=all  — must come before /:id
communitiesRouter.get('/feed', async (req, res) => {
  try {
    await seedCommunities()
    const { sort = 'hot', page = '1', limit = '20', category } = req.query as Record<string, string>
    const skip  = (parseInt(page) - 1) * parseInt(limit)
    const where: any = {}
    if (category && category !== 'all') where.category = category

    const orderBy = sort === 'new' ? { createdAt: 'desc' as const }
      : sort === 'top' ? { voteCount: 'desc' as const }
      : [{ pinned: 'desc' as const }, { replyCount: 'desc' as const }, { voteCount: 'desc' as const }]

    const [posts, total] = await Promise.all([
      (prisma as any).communityPost.findMany({
        where, orderBy, skip, take: parseInt(limit),
        include: { community: { select: { name: true, color: true, slug: true } }, comments: { orderBy: { createdAt: 'asc' as const }, take: 3 } },
      }),
      (prisma as any).communityPost.count({ where }),
    ])
    res.json({ posts, total, page: parseInt(page), limit: parseInt(limit) })
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// POST /api/communities — admin only
communitiesRouter.post('/', requireAuth, async (req, res) => {
  try {
    const { name, slug, description, isPrivate, topicTags, color } = req.body
    if (!name || !slug) return res.status(400).json({ error: 'name and slug required' })
    const group = await (prisma as any).communityGroup.create({
      data: { name, slug, description, isPrivate: !!isPrivate, topicTags: topicTags ?? [], color, createdBy: (req as any).user?.id },
    })
    res.status(201).json(group)
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// POST /api/communities/:id/join
communitiesRouter.post('/:id/join', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user?.id ?? 'anon'
    const existing = await (prisma as any).communityMember.findUnique({ where: { userId_communityId: { userId, communityId: req.params.id } } })
    if (existing) return res.json(existing)
    const member = await (prisma as any).communityMember.create({ data: { userId, communityId: req.params.id } })
    await (prisma as any).communityGroup.update({ where: { id: req.params.id }, data: { memberCount: { increment: 1 } } })
    res.status(201).json(member)
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// GET /api/communities/:id/posts?sort=hot|new|top&page=1&limit=20
communitiesRouter.get('/:id/posts', async (req, res) => {
  try {
    const { sort = 'hot', page = '1', limit = '20', category } = req.query as Record<string, string>
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const where: any = { communityId: req.params.id }
    if (category && category !== 'all') where.category = category

    const orderBy = sort === 'new' ? { createdAt: 'desc' }
      : sort === 'top' ? { voteCount: 'desc' }
      : [{ pinned: 'desc' }, { replyCount: 'desc' }, { voteCount: 'desc' }]

    const [posts, total] = await Promise.all([
      (prisma as any).communityPost.findMany({
        where, orderBy, skip, take: parseInt(limit),
        include: { comments: { orderBy: { createdAt: 'asc' }, take: 3 }, _count: { select: { votes: true, comments: true } } },
      }),
      (prisma as any).communityPost.count({ where }),
    ])
    res.json({ posts, total, page: parseInt(page), limit: parseInt(limit) })
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// POST /api/communities/:id/posts
communitiesRouter.post('/:id/posts', requireAuth, async (req, res) => {
  try {
    const { title, body, category, tags, mediaUrls } = req.body
    if (!title || !body) return res.status(400).json({ error: 'title and body required' })
    const user = (req as any).user
    const post = await (prisma as any).communityPost.create({
      data: { title, body, category, tags: tags ?? [], mediaUrls: mediaUrls ?? [], communityId: req.params.id, authorId: user?.id ?? 'anon', authorName: user?.name ?? user?.email ?? 'Anonymous' },
    })
    res.status(201).json(post)
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// POST /api/communities/posts/:pid/flag  — toggle flag on a post
communitiesRouter.post('/posts/:pid/flag', requireAuth, async (req, res) => {
  try {
    const { reason } = req.body
    const post = await (prisma as any).communityPost.update({
      where: { id: req.params.pid },
      data: { flagCount: { increment: 1 } },
      select: { id: true, flagCount: true, title: true },
    })
    if (post.flagCount === 1) {
      await (prisma as any).kimmpSignal.create({
        data: { type: 'CONTENT_FLAGGED', priority: 'medium', title: `Post flagged: ${post.title}`, summary: reason ? `Reason: ${reason}` : 'Community member flagged this post for review.', module: 'Communities', confidence: 80 },
      }).catch(() => {})
    }
    res.json({ flagCount: post.flagCount })
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// POST /api/communities/posts/:pid/comments
communitiesRouter.post('/posts/:pid/comments', requireAuth, async (req, res) => {
  try {
    const { body, parentId } = req.body
    if (!body) return res.status(400).json({ error: 'body required' })
    const user = (req as any).user
    const comment = await (prisma as any).communityComment.create({
      data: { body, postId: req.params.pid, parentId: parentId ?? null, authorId: user?.id ?? 'anon', authorName: user?.name ?? user?.email ?? 'Anonymous' },
    })
    await (prisma as any).communityPost.update({
      where: { id: req.params.pid },
      data: { replyCount: { increment: 1 } },
    })

    // Parse @mentions and emit KIMMP signal per mentioned username
    const mentions = (body as string).match(/@(\w+)/g)?.map((m: string) => m.slice(1)) ?? []
    if (mentions.length > 0) {
      await (prisma as any).kimmpSignal.create({
        data: { type: 'COMMUNITY_MENTION', priority: 'low', title: `@mention in community post`, summary: `${user?.name ?? 'Someone'} mentioned @${mentions.join(', @')} in a comment.`, module: 'Communities', confidence: 95 },
      }).catch(() => {})
    }

    // KIMMP trending signal when post reaches 10+ comments
    const post = await (prisma as any).communityPost.findUnique({ where: { id: req.params.pid }, select: { replyCount: true, title: true } })
    if (post && post.replyCount >= 10 && post.replyCount % 10 === 0) {
      await (prisma as any).kimmpSignal.create({
        data: { type: 'TRENDING_TOPIC', priority: 'medium', title: `Trending: ${post.title}`, summary: `Post reached ${post.replyCount} comments — community trending topic.`, module: 'Communities', confidence: 85 },
      }).catch(() => {})
    }
    res.status(201).json(comment)
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// POST /api/communities/posts/:pid/vote  body: { value: 1 | -1 }
communitiesRouter.post('/posts/:pid/vote', requireAuth, async (req, res) => {
  try {
    const { value } = req.body
    if (value !== 1 && value !== -1) return res.status(400).json({ error: 'value must be 1 or -1' })
    const userId = (req as any).user?.id ?? 'anon'
    const existing = await (prisma as any).communityVote.findUnique({ where: { postId_userId: { postId: req.params.pid, userId } } })
    let delta = value
    if (existing) {
      delta = value - existing.value
      await (prisma as any).communityVote.update({ where: { id: existing.id }, data: { value } })
    } else {
      await (prisma as any).communityVote.create({ data: { postId: req.params.pid, userId, value } })
    }
    const post = await (prisma as any).communityPost.update({ where: { id: req.params.pid }, data: { voteCount: { increment: delta } }, select: { voteCount: true } })
    res.json({ voteCount: post.voteCount })
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// POST /api/communities/posts/:pid/pin  — mod action
communitiesRouter.post('/posts/:pid/pin', requireAuth, async (req, res) => {
  try {
    const { pinned } = req.body
    const post = await (prisma as any).communityPost.update({ where: { id: req.params.pid }, data: { pinned: !!pinned } })
    res.json(post)
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// DELETE /api/communities/posts/:pid  — mod action
communitiesRouter.delete('/posts/:pid', requireAuth, async (req, res) => {
  try {
    await (prisma as any).communityPost.delete({ where: { id: req.params.pid } })
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})

// DELETE /api/communities/comments/:cid  — mod action
communitiesRouter.delete('/comments/:cid', requireAuth, async (req, res) => {
  try {
    const comment = await (prisma as any).communityComment.delete({ where: { id: req.params.cid } })
    await (prisma as any).communityPost.update({ where: { id: comment.postId }, data: { replyCount: { decrement: 1 } } })
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: (e as Error).message }) }
})
