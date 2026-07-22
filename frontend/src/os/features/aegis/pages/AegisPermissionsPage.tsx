import { useState, useEffect, useCallback } from 'react'
import { api } from '@lib/api'
import { ShieldCheck, Trash2, Plus, Search, RefreshCw } from 'lucide-react'

interface PermissionScope {
  id: string
  userId: string
  workspace: string
  feature: string
  action: 'READ' | 'WRITE' | 'ADMIN'
  grantedBy: string
  createdAt: string
}

const WORKSPACES = ['AEGIS', 'KIMMP', 'WAANDA', 'CRM', 'FINANCE', 'PROJECTS', 'DELIVERY', 'GOVERNANCE', 'HR', 'COMMUNITIES']
const ACTIONS    = ['READ', 'WRITE', 'ADMIN'] as const

const ACTION_CHIP: Record<string, string> = {
  READ:  'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  WRITE: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  ADMIN: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
}

export function AegisPermissionsPage() {
  const [scopes, setScopes]   = useState<PermissionScope[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter]   = useState('')
  const [error, setError]     = useState('')

  // Grant form
  const [gUserId,    setGUserId]    = useState('')
  const [gWorkspace, setGWorkspace] = useState('AEGIS')
  const [gFeature,   setGFeature]   = useState('')
  const [gAction,    setGAction]    = useState<'READ' | 'WRITE' | 'ADMIN'>('READ')
  const [granting,   setGranting]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const r = await api.get('/admin/permissions')
      setScopes(r.data ?? [])
    } catch { setError('Failed to load permission scopes') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!gUserId.trim() || !gFeature.trim()) return
    setGranting(true)
    try {
      const r = await api.post('/admin/permissions', {
        userId:    gUserId.trim(),
        workspace: gWorkspace,
        feature:   gFeature.trim().toLowerCase(),
        action:    gAction,
      })
      setScopes(prev => {
        const idx = prev.findIndex(s => s.id === r.data.id)
        return idx >= 0 ? prev.map(s => s.id === r.data.id ? r.data : s) : [r.data, ...prev]
      })
      setGUserId(''); setGFeature('')
    } catch { setError('Grant failed') }
    finally { setGranting(false) }
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this permission?')) return
    try {
      await api.delete(`/admin/permissions/${id}`)
      setScopes(prev => prev.filter(s => s.id !== id))
    } catch { setError('Revoke failed') }
  }

  const visible = filter.trim()
    ? scopes.filter(s =>
        s.userId.toLowerCase().includes(filter.toLowerCase()) ||
        s.workspace.toLowerCase().includes(filter.toLowerCase()) ||
        s.feature.toLowerCase().includes(filter.toLowerCase())
      )
    : scopes

  // Group by userId for readability
  const grouped = visible.reduce<Record<string, PermissionScope[]>>((acc, s) => {
    ;(acc[s.userId] ??= []).push(s)
    return acc
  }, {})

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#e2445c]" />
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Permission Scopes</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Fine-grained RBAC — {scopes.length} active grant{scopes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={load} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors" title="Refresh">
          <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Grant form */}
      <form onSubmit={handleGrant} className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] space-y-3">
        <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Grant Permission
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="User ID or email"
            value={gUserId}
            onChange={e => setGUserId(e.target.value)}
            required
            className="col-span-2 sm:col-span-1 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e2445c]/30"
          />
          <select
            value={gWorkspace}
            onChange={e => setGWorkspace(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#e2445c]/30"
          >
            {WORKSPACES.map(w => <option key={w}>{w}</option>)}
          </select>
          <input
            type="text"
            placeholder="Feature (e.g. signals)"
            value={gFeature}
            onChange={e => setGFeature(e.target.value)}
            required
            className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e2445c]/30"
          />
          <select
            value={gAction}
            onChange={e => setGAction(e.target.value as 'READ' | 'WRITE' | 'ADMIN')}
            className="px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#e2445c]/30"
          >
            {ACTIONS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        <button
          type="submit"
          disabled={granting || !gUserId.trim() || !gFeature.trim()}
          className="px-4 py-1.5 rounded-lg bg-[#e2445c] hover:bg-[#c73850] text-white text-xs font-bold transition-colors disabled:opacity-50"
        >
          {granting ? 'Granting…' : 'Grant'}
        </button>
      </form>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter by user ID, workspace, or feature…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e2445c]/30"
        />
      </div>

      {/* Scopes list */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-400">
          {filter ? 'No matching permissions' : 'No permission scopes granted yet'}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([userId, userScopes]) => (
            <div key={userId} className="rounded-xl border border-gray-200 dark:border-white/[0.06] overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/[0.06]">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 font-mono">{userId}</span>
                <span className="ml-2 text-[10px] text-gray-400">{userScopes.length} scope{userScopes.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                {userScopes.map(s => (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-mono w-28 truncate flex-shrink-0">{s.workspace}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-1">{s.feature}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${ACTION_CHIP[s.action] ?? ''}`}>
                      {s.action}
                    </span>
                    <span className="text-[10px] text-gray-400 hidden sm:block">
                      by {s.grantedBy.slice(0, 8)}… · {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleRevoke(s.id)}
                      title="Revoke"
                      className="p-1 rounded hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
