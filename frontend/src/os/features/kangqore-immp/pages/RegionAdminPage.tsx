import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Globe2, MapPin, Shield, RefreshCw, ChevronRight } from 'lucide-react'
import { api } from '@lib/api'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const GRN  = '#10b981'
const BLUE = '#579bfc'
const AMB  = '#f59e0b'
const PURP = '#7c3aed'

const REGION_COLOR: Record<string, string> = { US: BLUE, UK: GRN, EU: PURP, INDIA: AMB }
const REGION_FLAG:  Record<string, string> = { US: '🇺🇸', UK: '🇬🇧', EU: '🇪🇺', INDIA: '🇮🇳' }

interface RegionConfig { id: string; region: string; displayName: string; storageRegion: string; gdprApplicable: boolean; dataResidencyNote: string }
interface DistEntry { region: string; count: number; pct: number }

export function RegionAdminPage() {
  const qc = useQueryClient()
  const [assignTenantId, setAssignTenantId] = useState('')
  const [assignRegion, setAssignRegion]     = useState('US')

  const { data: regionsData } = useQuery({
    queryKey: ['regions'],
    queryFn: () => api.get('/admin/kangqore-immp/regions').then(r => r.data),
  })
  const { data: distData } = useQuery({
    queryKey: ['regions-distribution'],
    queryFn: () => api.get('/admin/kangqore-immp/regions/distribution').then(r => r.data),
  })
  const { data: tenantsData } = useQuery({
    queryKey: ['tenants-brief'],
    queryFn: () => api.get('/admin/kangqore-immp/tenants').then(r => r.data),
  })

  const assignMut = useMutation({
    mutationFn: ({ tenantId, region }: { tenantId: string; region: string }) =>
      api.post(`/admin/kangqore-immp/regions/${tenantId}/assign`, { region }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['regions-distribution'] }); qc.invalidateQueries({ queryKey: ['tenants-brief'] }) },
  })

  const regions: RegionConfig[] = regionsData?.regions ?? []
  const dist: DistEntry[]       = distData?.distribution ?? []
  const total: number           = distData?.total ?? 0
  const tenants                 = tenantsData?.tenants ?? []

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Region Admin" />

      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: T1 }}>Multi-region Administration</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
          US · UK · EU · India · Data residency · GDPR applicability
        </p>
      </div>

      {/* Region config cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {regions.map(r => {
          const color = REGION_COLOR[r.region] ?? BLUE
          const flag  = REGION_FLAG[r.region]  ?? '🌐'
          const distEntry = dist.find(d => d.region === r.region)
          return (
            <div key={r.id} className="rounded-xl p-4 space-y-3"
              style={{ background: `${color}0c`, border: `1.5px solid ${color}30` }}>
              <div className="flex items-start justify-between">
                <span className="text-2xl">{flag}</span>
                {r.gdprApplicable && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${PURP}18`, color: PURP }}>GDPR</span>
                )}
              </div>
              <div>
                <p className="text-sm font-black" style={{ color: T1 }}>{r.displayName}</p>
                <p className="text-[10px] font-mono mt-0.5" style={{ color: color }}>{r.storageRegion}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-black font-variant-numeric" style={{ color }}>
                  {distEntry?.count ?? 0}
                </p>
                <p className="text-[10px]" style={{ color: T2 }}>{distEntry?.pct ?? 0}% of tenants</p>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: T2 }}>{r.dataResidencyNote}</p>
            </div>
          )
        })}
      </div>

      {/* Distribution bar */}
      {dist.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BDR}` }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: T1 }}>Fleet Distribution — {total} tenants</p>
            <button onClick={() => qc.invalidateQueries({ queryKey: ['regions-distribution'] })}
              className="p-1 rounded-lg" style={{ color: T2 }}>
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex h-6 rounded-lg overflow-hidden gap-0.5">
            {dist.map(d => {
              const color = REGION_COLOR[d.region] ?? BLUE
              return (
                <div key={d.region} style={{ flex: d.count, background: color, opacity: 0.8 }}
                  title={`${d.region}: ${d.count} tenants (${d.pct}%)`} />
              )
            })}
          </div>
          <div className="flex gap-4 mt-2">
            {dist.map(d => (
              <div key={d.region} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: REGION_COLOR[d.region] ?? BLUE }} />
                <span className="text-[10px] font-semibold" style={{ color: T2 }}>{REGION_FLAG[d.region]} {d.region} ({d.count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign region panel */}
      <div className="rounded-xl p-5 space-y-4" style={{ background: CARD, border: `1px solid ${BDR}` }}>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" style={{ color: BLUE }} />
          <p className="text-sm font-semibold" style={{ color: T1 }}>Assign Tenant Region</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: T2 }}>Tenant</label>
            <select value={assignTenantId} onChange={e => setAssignTenantId(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg"
              style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}>
              <option value="">Select tenant…</option>
              {tenants.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name} — {t.region ?? 'US'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{ color: T2 }}>Region</label>
            <select value={assignRegion} onChange={e => setAssignRegion(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg"
              style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}>
              {['US','UK','EU','INDIA'].map(r => (
                <option key={r} value={r}>{REGION_FLAG[r]} {r}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => { if (assignTenantId) assignMut.mutate({ tenantId: assignTenantId, region: assignRegion }) }}
          disabled={!assignTenantId || assignMut.isPending}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg"
          style={{ background: BLUE, color: '#fff', opacity: (!assignTenantId || assignMut.isPending) ? 0.5 : 1 }}>
          <Globe2 className="w-3.5 h-3.5" />
          {assignMut.isPending ? 'Assigning…' : 'Assign Region'}
        </button>
        {assignMut.isSuccess && (
          <p className="text-xs font-semibold" style={{ color: GRN }}>✓ Region assigned successfully</p>
        )}
      </div>

      {/* Tenant table */}
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ background: CARD, borderBottom: `1px solid ${BDR}` }}>
          <Shield className="w-4 h-4" style={{ color: T2 }} />
          <p className="text-sm font-semibold" style={{ color: T1 }}>All Tenants — Region Assignment</p>
        </div>
        <div style={{ background: CARD }}>
          {tenants.slice(0, 25).map((t: any, i: number) => {
            const region = t.region ?? 'US'
            const color  = REGION_COLOR[region] ?? BLUE
            return (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3"
                style={{ borderBottom: i < tenants.length - 1 ? `1px solid ${BDR}` : undefined }}>
                <p className="text-sm font-medium flex-1 truncate" style={{ color: T1 }}>{t.name}</p>
                <span className="text-[10px] font-mono" style={{ color: T2 }}>{t.planTier}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${color}18`, color }}>
                  {REGION_FLAG[region]} {region}
                </span>
                <ChevronRight className="w-3.5 h-3.5" style={{ color: T2 }} />
              </div>
            )
          })}
          {tenants.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: T2 }}>No tenants yet. Provision customers first.</p>
          )}
        </div>
      </div>
    </div>
  )
}
