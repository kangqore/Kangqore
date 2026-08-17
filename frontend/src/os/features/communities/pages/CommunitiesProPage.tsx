import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@lib/api'
import {
  Search, Users, MessageSquare, TrendingUp, Flag, Trash2,
  Pin, CheckCircle, AlertTriangle, ChevronDown, RefreshCw, Zap,
} from 'lucide-react'

interface Community {
  id: string
  name: string
  slug: string
  color: string
  posts: number
  members: number
  flagged: number
}

interface Post {
  id: string
  title: string
  body: string
  authorName: string
  communityId: string
  voteCount: number
  replyCount: number
  flagCount: number
  pinned: boolean
  solved: boolean
  category: string | null
  tags: string[]
  createdAt: string
  community?: { name: string; color: string; slug: string }
}

type Mode = 'feed' | 'search' | 'moderation'

export function CommunitiesProPage() {
  const [mode, setMode]   = useState<Mode>('feed')
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState<Community[]>([])
  const [flagged, setFlagged] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [sort, setSort]       = useState<'hot' | 'new' | 'top'>('hot')
  const [digestLoading, setDigestLoading] = useState(false)
  const [digestMsg, setDigestMsg] = useState('')
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadFeed = useCallback(async () => {
    setLoading(true)
    try {
      const r = await api.get(`/communities/feed?sort=${sort}&limit=30`)
      setPosts(r.data.posts ?? [])
    } finally { setLoading(false) }
  }, [sort])

  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setPosts([]); return }
    setLoading(true)
    try {
      const r = await api.get(`/communities/search?q=${encodeURIComponent(q)}&limit=30`)
      setPosts(r.data.posts ?? [])
    } finally { setLoading(false) }
  }, [])

  const loadModeration = useCallback(async () => {
    setLoading(true)
    try {
      const [sR, fR] = await Promise.all([
        api.get('/communities/mod/stats'),
        api.get('/communities/mod/flagged?limit=50'),
      ])
      setStats(sR.data ?? [])
      setFlagged(fR.data.posts ?? [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (mode === 'feed')       loadFeed()
    if (mode === 'moderation') loadModeration()
  }, [mode, loadFeed, loadModeration])

  const handleSearchChange = (v: string) => {
    setSearchQ(v)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => runSearch(v), 350)
  }

  const handleDelete = async (pid: string) => {
    if (!confirm('Remove this post from the community?')) return
    await api.delete(`/communities/posts/${pid}`)
    setFlagged(p => p.filter(x => x.id !== pid))
    setPosts(p => p.filter(x => x.id !== pid))
  }

  const handlePin = async (pid: string, pinned: boolean) => {
    await api.post(`/communities/posts/${pid}/pin`, { pinned: !pinned })
    setPosts(p => p.map(x => x.id === pid ? { ...x, pinned: !pinned } : x))
  }

  const handleDigest = async () => {
    setDigestLoading(true)
    setDigestMsg('')
    try {
      const r = await api.post('/communities/digest/trigger')
      setDigestMsg(`Generated ${r.data.generated} KIMMP digest signal${r.data.generated !== 1 ? 's' : ''}`)
    } catch {
      setDigestMsg('Failed to generate digest')
    } finally { setDigestLoading(false) }
  }

  const totalFlagged = stats.reduce((s, c) => s + c.flagged, 0)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Communities</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Kangqore Knowledge Network — moderation & search</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDigest}
            disabled={digestLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5" />
            {digestLoading ? 'Generating…' : 'KIMMP Weekly Digest'}
          </button>
          {digestMsg && (
            <span className="text-xs text-emerald-500 font-bold">{digestMsg}</span>
          )}
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-2xl p-1 w-fit">
        {(['feed', 'search', 'moderation'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-2xl text-xs font-bold capitalize transition-all ${
              mode === m
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {m}
            {m === 'moderation' && totalFlagged > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black">
                {totalFlagged}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Feed Mode */}
      {mode === 'feed' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-2xl p-0.5">
              {(['hot', 'new', 'top'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`px-3 py-1 rounded-2xl text-xs font-bold capitalize transition-colors ${
                    sort === s ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button onClick={loadFeed} className="p-1.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors" title="Refresh">
              <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
          <PostList posts={posts} loading={loading} onDelete={handleDelete} onPin={handlePin} showMod />
        </div>
      )}

      {/* Search Mode */}
      {mode === 'search' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search posts by title, body, or tag…"
              value={searchQ}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>
          {searchQ.trim().length >= 2 ? (
            <PostList posts={posts} loading={loading} onDelete={handleDelete} onPin={handlePin} showMod />
          ) : (
            <div className="text-center py-12 text-sm text-gray-400">Type at least 2 characters to search</div>
          )}
        </div>
      )}

      {/* Moderation Mode */}
      {mode === 'moderation' && (
        <div className="space-y-6">
          {/* Per-community stats grid */}
          <div>
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Community Stats</h2>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map(c => (
                  <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{c.posts}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.members}</span>
                      {c.flagged > 0 && (
                        <span className="flex items-center gap-1 text-red-500 font-bold"><Flag className="w-3 h-3" />{c.flagged}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Flagged posts */}
          <div>
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Flagged Posts ({flagged.length})
            </h2>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : flagged.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                No flagged posts
              </div>
            ) : (
              <div className="space-y-2">
                {flagged.map(p => (
                  <FlaggedRow key={p.id} post={p} onDelete={handleDelete} onRefresh={loadModeration} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function PostList({ posts, loading, onDelete, onPin, showMod }: {
  posts: Post[]
  loading: boolean
  onDelete: (id: string) => void
  onPin: (id: string, pinned: boolean) => void
  showMod?: boolean
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }
  if (posts.length === 0) {
    return <div className="py-12 text-center text-sm text-gray-400">No posts found</div>
  }
  return (
    <div className="space-y-2">
      {posts.map(p => (
        <PostRow key={p.id} post={p} onDelete={onDelete} onPin={onPin} showMod={showMod} />
      ))}
    </div>
  )
}

function PostRow({ post, onDelete, onPin, showMod }: {
  post: Post
  onDelete: (id: string) => void
  onPin: (id: string, pinned: boolean) => void
  showMod?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={`rounded-2xl border transition-colors ${
      post.flagCount > 0
        ? 'border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5'
        : post.pinned
        ? 'border-violet-200 dark:border-violet-500/20 bg-violet-50/50 dark:bg-violet-500/5'
        : 'border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]'
    }`}>
      <div className="p-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {post.community && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-2xl" style={{ backgroundColor: post.community.color + '20', color: post.community.color }}>
                {post.community.name}
              </span>
            )}
            {post.pinned && <span className="text-[9px] font-black text-violet-500 uppercase tracking-wide">Pinned</span>}
            {post.flagCount > 0 && (
              <span className="text-[9px] font-black text-amber-500 flex items-center gap-0.5">
                <Flag className="w-2.5 h-2.5" />{post.flagCount} flag{post.flagCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button onClick={() => setExpanded(e => !e)} className="text-left">
            <span className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{post.title}</span>
          </button>
          {expanded && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{post.body?.slice(0, 300)}{post.body?.length > 300 ? '…' : ''}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
            <span>{post.authorName ?? 'Anon'}</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{post.voteCount}</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{post.replyCount}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        {showMod && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onPin(post.id, post.pinned)}
              title={post.pinned ? 'Unpin' : 'Pin'}
              className={`p-1.5 rounded-2xl transition-colors ${post.pinned ? 'text-violet-500 bg-violet-100 dark:bg-violet-500/10' : 'text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10'}`}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(post.id)}
              title="Delete post"
              className="p-1.5 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setExpanded(e => !e)} className="p-1.5 rounded-2xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function FlaggedRow({ post, onDelete, onRefresh }: {
  post: Post
  onDelete: (id: string) => void
  onRefresh: () => void
}) {
  const handleClear = async () => {
    // Reset flagCount to 0 by deleting and not re-flagging — we use pin to "clear reviewed"
    await api.post(`/communities/posts/${post.id}/pin`, { pinned: post.pinned }).catch(() => {})
    onRefresh()
  }
  return (
    <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 flex items-start gap-3">
      <Flag className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{post.title}</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
          {post.authorName} · {post.flagCount} flag{post.flagCount !== 1 ? 's' : ''} · {new Date(post.createdAt).toLocaleDateString()}
        </p>
        {post.body && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{post.body}</p>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={handleClear}
          title="Mark reviewed (keep post)"
          className="p-1.5 rounded-2xl text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
        >
          <CheckCircle className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(post.id)}
          title="Delete post"
          className="p-1.5 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
