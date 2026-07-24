import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Package, Plus } from 'lucide-react'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const BLUE = '#3b82f6'
const GREEN = '#10b981'

const PARTNER_ID = 'partner-zero'
const STATUS_COLOR: Record<string, string> = { PUBLISHED: GREEN, DRAFT: '#f59e0b', ARCHIVED: '#6b7280' }

export function OEMBlueprintPackagerPage() {
  const qc = useQueryClient()
  const { data } = useQuery({
    queryKey: ['oem-blueprints', PARTNER_ID],
    queryFn:  () => api.get(`/admin/kangqore-immp/oem/blueprints?partnerId=${PARTNER_ID}`).then(r => r.data.packages as any[]),
    staleTime: 30_000,
  })
  const packages: any[] = data ?? []

  const [form, setForm] = useState({ packageName: '', description: '', industryPack: '', version: '1.0.0' })
  const [open, setOpen] = useState(false)

  const mut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/oem/blueprints', { partnerId: PARTNER_ID, ...form }).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['oem-blueprints', PARTNER_ID] }); setOpen(false); setForm({ packageName: '', description: '', industryPack: '', version: '1.0.0' }) },
  })

  return (
    <div style={{ maxWidth: 900 }} className="space-y-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: T1, margin: 0 }}>OEM Blueprint Packager</h2>
          <p style={{ fontSize: 12, color: T2, marginTop: 4 }}>Create branded Blueprint bundles — wrap a Blueprint + branding + industry pack into a publishable partner product.</p>
        </div>
        <button onClick={() => setOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: BLUE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          <Plus style={{ width: 13, height: 13 }} /> New Package
        </button>
      </div>

      {open && (
        <div style={{ background: CARD, border: `1px solid ${BLUE}30`, borderRadius: 14, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Create Blueprint Package</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { label: 'Package Name', key: 'packageName' as const },
              { label: 'Version', key: 'version' as const },
              { label: 'Industry Pack', key: 'industryPack' as const },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 10, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em' }}>{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm(o => ({ ...o, [f.key]: e.target.value }))}
                  style={{ display: 'block', width: '100%', marginTop: 5, padding: '8px 12px', borderRadius: 8, border: `1px solid ${BDR}`, background: 'var(--os-surface-0)', color: T1, fontSize: 12 }} />
              </div>
            ))}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm(o => ({ ...o, description: e.target.value }))} rows={2}
                style={{ display: 'block', width: '100%', marginTop: 5, padding: '8px 12px', borderRadius: 8, border: `1px solid ${BDR}`, background: 'var(--os-surface-0)', color: T1, fontSize: 12, resize: 'vertical' }} />
            </div>
          </div>
          <button onClick={() => mut.mutate()} disabled={mut.isPending || !form.packageName}
            style={{ padding: '9px 18px', background: BLUE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', width: 'fit-content', opacity: !form.packageName ? 0.5 : 1 }}>
            {mut.isPending ? 'Publishing…' : 'Publish Package'}
          </button>
        </div>
      )}

      {packages.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: T2 }}>
          <Package style={{ width: 32, height: 32, color: BLUE, margin: '0 auto 10px' }} />
          <p style={{ fontSize: 12 }}>No Blueprint packages yet. Create one above.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {packages.map((pkg: any) => (
            <div key={pkg.id} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <Package style={{ width: 20, height: 20, color: BLUE, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>{pkg.packageName}</div>
                <div style={{ fontSize: 10, color: T2 }}>{pkg.description || '—'} · v{pkg.version} · {pkg.industryPack || 'Generic'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: STATUS_COLOR[pkg.status] + '12', color: STATUS_COLOR[pkg.status], border: `1px solid ${STATUS_COLOR[pkg.status]}25` }}>{pkg.status}</span>
                <span style={{ fontSize: 10, color: T2, fontVariantNumeric: 'tabular-nums' }}>{pkg.downloadCount} installs</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
