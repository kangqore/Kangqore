import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Globe, CheckCircle2, Clock, XCircle, Plus, Trash2, Copy, Check, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-xs font-mono text-[var(--os-text-1)]">
      <span className="flex-1 truncate">{value}</span>
      <button
        onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
        className="text-[var(--os-text-3)] hover:text-[var(--os-text-1)] transition-colors flex-shrink-0"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

interface CustomDomain {
  id: string
  domain: string
  status: 'ACTIVE' | 'PENDING' | 'FAILED'
  verifiedAt?: string
  createdAt: string
  purpose?: string
}

const STATUS_CONFIG = {
  ACTIVE:  { variant: 'success' as const, Icon: CheckCircle2, color: 'text-green-500', label: 'Verified'  },
  PENDING: { variant: 'warning' as const, Icon: Clock,         color: 'text-orange-500', label: 'Pending' },
  FAILED:  { variant: 'danger'  as const, Icon: XCircle,       color: 'text-red-500',    label: 'Failed'  },
}

export function CustomDomainsPage() {
  const queryClient = useQueryClient()
  const [newDomain, setNewDomain] = useState('')
  const [adding, setAdding] = useState(false)

  const { data: domains = [], isLoading } = useQuery<CustomDomain[]>({
    queryKey: ['custom-domains'],
    queryFn: () => api.get('/scheduling/custom-domains').then(r => r.data.domains ?? r.data ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 2,
  })

  const [verifying, setVerifying] = useState<string | null>(null)

  const verifyDomain = useMutation({
    mutationFn: (id: string) => api.post(`/scheduling/custom-domains/${id}/verify`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['custom-domains'] }); setVerifying(null) },
  })

  const { mutate: addDomain, isPending: adding_ } = useMutation({
    mutationFn: () => api.post('/scheduling/custom-domains', { domain: newDomain }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-domains'] })
      setNewDomain('')
      setAdding(false)
    },
  })

  const { mutate: removeDomain } = useMutation({
    mutationFn: (id: string) => api.delete(`/scheduling/custom-domains/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['custom-domains'] }),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Custom Domains</h2>
          <p className="text-sm text-[var(--os-text-2)] mt-1">
            Use your own domain for booking pages and client-facing URLs.
          </p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setAdding(a => !a)}>
          Add domain
        </Button>
      </div>

      {/* Add form */}
      {adding && (
        <Card>
          <CardBody className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--os-text-1)] mb-1.5 block">Domain</label>
              <input
                type="text"
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                placeholder="book.yourcompany.com"
                className="w-full h-9 rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="border border-[var(--os-border)] rounded-2xl overflow-hidden text-xs">
              <div className="px-4 py-2.5 border-b border-[var(--os-border)] bg-[var(--os-surface-0)]">
                <p className="font-semibold text-[var(--os-text-1)]">DNS Configuration — add both records to your DNS provider</p>
              </div>
              <div className="divide-y divide-[var(--os-border)]">
                {[
                  { type: 'CNAME', name: newDomain || 'your-subdomain.com', value: 'app.kangqore.com', desc: 'Primary routing record' },
                  { type: 'TXT',   name: `_kangqore-verify.${newDomain || 'your-subdomain.com'}`, value: 'kangqore-verify=pending', desc: 'Ownership verification' },
                ].map(rec => (
                  <div key={rec.type} className="px-4 py-3 grid grid-cols-[48px_1fr_1fr] gap-3 items-start bg-[var(--os-card)]">
                    <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-[var(--os-border)] text-[var(--os-text-2)] text-center mt-0.5">{rec.type}</span>
                    <div>
                      <p className="text-[10px] text-[var(--os-text-3)] mb-1">Name</p>
                      <CopyField value={rec.name} />
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--os-text-3)] mb-1">Value · {rec.desc}</p>
                      <CopyField value={rec.value} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 bg-[var(--os-surface-0)] text-[var(--os-text-3)] border-t border-[var(--os-border)]">
                DNS propagation may take up to 24 hours. Click "Verify" on your domain after adding these records.
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => addDomain()} disabled={!newDomain.includes('.') || adding_} loading={adding_}>
                Add &amp; verify
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {isLoading && <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]"><Spinner size="sm" /> Loading…</div>}

      {!isLoading && domains.length === 0 && !adding && (
        <Card>
          <CardBody className="text-center py-10">
            <Globe className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-3" />
            <p className="text-sm font-medium text-[var(--os-text-1)]">No custom domains</p>
            <p className="text-xs text-[var(--os-text-2)] mt-1">Add a domain to brand your booking and portal URLs.</p>
          </CardBody>
        </Card>
      )}

      {domains.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Domains</CardTitle></CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-[var(--os-border)]">
              {domains.map(d => {
                const cfg = STATUS_CONFIG[d.status] ?? STATUS_CONFIG.PENDING
                return (
                  <div key={d.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--os-surface-0)] transition-colors">
                    <cfg.Icon className={`w-4 h-4 flex-shrink-0 ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--os-text-1)] font-mono">{d.domain}</p>
                      <p className="text-xs text-[var(--os-text-2)] mt-0.5">
                        Added {new Date(d.createdAt).toLocaleDateString()}
                        {d.verifiedAt && ` · Verified ${new Date(d.verifiedAt).toLocaleDateString()}`}
                        {d.purpose && ` · ${d.purpose}`}
                      </p>
                    </div>
                    <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                    {d.status === 'PENDING' && (
                      <Button size="sm" variant="ghost"
                        onClick={() => { setVerifying(d.id); verifyDomain.mutate(d.id) }}
                        disabled={verifying === d.id}
                      >
                        {verifying === d.id
                          ? <><RefreshCw className="w-3 h-3 animate-spin" /> Checking…</>
                          : <><RefreshCw className="w-3 h-3" /> Verify</>}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDomain(d.id)}
                      title="Remove domain"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
