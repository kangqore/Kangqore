import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Globe, CheckCircle2, Clock, XCircle, Plus, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

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
          <h2 className="text-lg font-bold text-white">Custom Domains</h2>
          <p className="text-sm text-slate-500 mt-1">
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
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Domain</label>
              <input
                type="text"
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                placeholder="book.yourcompany.com"
                className="w-full h-9 rounded-xl border border-white/10 border-t-white/20 bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-sm text-white px-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="bg-slate-900 rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
              <p className="font-semibold text-slate-200">DNS Setup Required</p>
              <p>Add a CNAME record pointing to <code className="font-mono bg-slate-200 px-1 rounded">app.kangqore.com</code></p>
              <p className="text-slate-500">Verification may take up to 24 hours after DNS propagation.</p>
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

      {isLoading && <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner size="sm" /> Loading…</div>}

      {!isLoading && domains.length === 0 && !adding && (
        <Card>
          <CardBody className="text-center py-10">
            <Globe className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-300">No custom domains</p>
            <p className="text-xs text-slate-500 mt-1">Add a domain to brand your booking and portal URLs.</p>
          </CardBody>
        </Card>
      )}

      {domains.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Domains</CardTitle></CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-[#2E2854]">
              {domains.map(d => {
                const cfg = STATUS_CONFIG[d.status] ?? STATUS_CONFIG.PENDING
                return (
                  <div key={d.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-900 transition-colors">
                    <cfg.Icon className={`w-4 h-4 flex-shrink-0 ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white font-mono">{d.domain}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Added {new Date(d.createdAt).toLocaleDateString()}
                        {d.verifiedAt && ` · Verified ${new Date(d.verifiedAt).toLocaleDateString()}`}
                        {d.purpose && ` · ${d.purpose}`}
                      </p>
                    </div>
                    <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
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
