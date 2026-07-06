import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Code2, Key, Plus, Trash2, ExternalLink, Copy, CheckCircle, AlertTriangle } from 'lucide-react'
import { api } from '@lib/api'

interface ApiKey {
  id:         string
  name:       string
  prefix:     string
  lastUsedAt: string | null
  expiresAt:  string | null
  createdAt:  string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="p-1 rounded text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

export function DeveloperPage() {
  const qc = useQueryClient()
  const [createName, setCreateName] = useState('')
  const [newToken, setNewToken]     = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const { data, isLoading } = useQuery<{ keys: ApiKey[] }>({
    queryKey: ['dev-api-keys'],
    queryFn:  () => api.get('/admin/developer/keys').then(r => r.data),
    staleTime: 30_000,
  })

  const create = useMutation({
    mutationFn: () => api.post('/admin/developer/keys', { name: createName, expiresInDays: 365 }),
    onSuccess: (res) => {
      setNewToken(res.data.token)
      setCreateName('')
      setShowCreate(false)
      qc.invalidateQueries({ queryKey: ['dev-api-keys'] })
    },
  })

  const revoke = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/developer/keys/${id}`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['dev-api-keys'] }),
  })

  const keys = data?.keys ?? []

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Docs link */}
      <div className="rounded-2xl p-5 border border-[var(--os-border)]" style={{ background: 'var(--os-card)' }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.1)' }}>
            <Code2 className="w-5 h-5" style={{ color: '#7c3aed' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[var(--os-text-1)] mb-1">API Documentation</p>
            <p className="text-xs font-medium text-[var(--os-text-2)] mb-3">
              Interactive OpenAPI documentation for all Kangqore OS endpoints. Authenticate with any key below.
            </p>
            <a
              href="/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              style={{ background: 'rgba(124,58,237,0.12)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.2)' }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Swagger UI
            </a>
          </div>
        </div>
      </div>

      {/* New token banner */}
      {newToken && (
        <div className="rounded-2xl p-4 border border-green-500/20" style={{ background: 'rgba(0,200,117,0.06)' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-green-500 mb-2">Store this token now — it won't be shown again.</p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)]">
                <code className="text-xs font-mono text-[var(--os-text-1)] truncate flex-1">{newToken}</code>
                <CopyButton text={newToken} />
              </div>
              <button onClick={() => setNewToken(null)} className="mt-2 text-[10px] font-bold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
                I've saved it — dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys */}
      <div className="rounded-2xl border border-[var(--os-border)]" style={{ background: 'var(--os-card)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--os-border)]">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[var(--os-text-2)]" />
            <p className="text-sm font-bold text-[var(--os-text-1)]">API Keys</p>
            <span className="text-xs text-[var(--os-text-2)]">{keys.length} / 10</span>
          </div>
          <button
            onClick={() => setShowCreate(s => !s)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
            style={{ background: 'rgba(87,155,252,0.1)', color: '#579bfc', border: '1px solid rgba(87,155,252,0.2)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            New Key
          </button>
        </div>

        {showCreate && (
          <div className="px-5 py-4 border-b border-[var(--os-border)] flex items-center gap-3">
            <input
              autoFocus
              value={createName}
              onChange={e => setCreateName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createName.trim() && create.mutate()}
              placeholder="Key name (e.g. CI Pipeline, Zapier)"
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:border-[#579bfc]"
            />
            <button
              disabled={!createName.trim() || create.isPending}
              onClick={() => create.mutate()}
              className="px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40 transition-colors"
              style={{ background: '#579bfc', color: '#fff' }}
            >
              {create.isPending ? 'Creating…' : 'Create'}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="p-5 space-y-2">
            {[1,2].map(i => <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'var(--os-surface-0)' }} />)}
          </div>
        )}

        {!isLoading && keys.length === 0 && !showCreate && (
          <div className="py-10 text-center text-sm font-medium text-[var(--os-text-2)]">No API keys yet.</div>
        )}

        {!isLoading && keys.length > 0 && (
          <div className="divide-y divide-[var(--os-border)]">
            {keys.map(k => (
              <div key={k.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--os-text-1)]">{k.name}</p>
                  <p className="text-[10px] font-mono text-[var(--os-text-2)] mt-0.5">{k.prefix}…</p>
                </div>
                <div className="text-right flex-shrink-0 mr-3">
                  <p className="text-[10px] text-[var(--os-text-2)]">
                    {k.lastUsedAt ? `Last used ${new Date(k.lastUsedAt).toLocaleDateString()}` : 'Never used'}
                  </p>
                  {k.expiresAt && (
                    <p className="text-[10px] text-[var(--os-text-2)]">Expires {new Date(k.expiresAt).toLocaleDateString()}</p>
                  )}
                </div>
                <button
                  onClick={() => revoke.mutate(k.id)}
                  disabled={revoke.isPending}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                  title="Revoke key"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick start */}
      <div className="rounded-2xl p-5 border border-[var(--os-border)]" style={{ background: 'var(--os-card)' }}>
        <p className="text-sm font-bold text-[var(--os-text-1)] mb-3">Quick Start</p>
        <pre className="text-xs font-mono text-[var(--os-text-2)] bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-xl p-4 overflow-x-auto leading-relaxed whitespace-pre">{`# List your leads
curl -H "Authorization: Bearer <YOUR_API_KEY>" \\
  https://yourdomain.com/api/admin/eqore/leads

# Dispatch a KIMMP agent
curl -X POST \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"agentId":"EQORE_SCORING"}' \\
  https://yourdomain.com/api/admin/kangqore-immp/dispatch`}</pre>
      </div>

    </div>
  )
}
