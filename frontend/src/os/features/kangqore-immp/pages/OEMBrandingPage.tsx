import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Save, Palette } from 'lucide-react'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const PURP = '#7c3aed'

const PARTNER_ID = 'partner-zero'

export function OEMBrandingPage() {
  const qc = useQueryClient()
  const { data } = useQuery({
    queryKey: ['oem-config', PARTNER_ID],
    queryFn:  () => api.get(`/admin/kangqore-immp/oem/config/${PARTNER_ID}`).then(r => r.data.config),
    staleTime: 30_000,
  })
  const [form, setForm] = useState({ brandName: '', tagline: '', logoUrl: '', primaryColor: '#7c3aed', accentColor: '#10b981', domainSlug: '' })
  const cfg = data ?? {}

  const mut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/oem/config', { partnerId: PARTNER_ID, ...form }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['oem-config', PARTNER_ID] }),
  })

  const field = (label: string, key: keyof typeof form, type = 'text') => (
    <div>
      <label style={{ fontSize: 10, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</label>
      <input
        type={type}
        value={form[key] || (cfg as any)?.[key] || ''}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={{ display: 'block', width: '100%', marginTop: 5, padding: '8px 12px', borderRadius: 8, border: `1px solid ${BDR}`, background: 'var(--os-surface-0)', color: T1, fontSize: 12 }}
      />
    </div>
  )

  return (
    <div style={{ maxWidth: 720 }} className="space-y-6">
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: T1, margin: 0 }}>OEM Branding Config</h2>
        <p style={{ fontSize: 12, color: T2, marginTop: 4 }}>Configure partner branding — logo, colors, domain slug, and tagline for white-label deployments.</p>
      </div>

      {cfg && (
        <div style={{ padding: '14px 18px', borderRadius: 12, background: PURP + '08', border: `1px solid ${PURP}25` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T2, marginBottom: 8 }}>Current config</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { label: 'Brand', value: cfg.brandName },
              { label: 'Tagline', value: cfg.tagline },
              { label: 'Domain', value: cfg.domainSlug },
            ].map(s => s.value ? (
              <div key={s.label}>
                <div style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase' }}>{s.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T1 }}>{s.value}</div>
              </div>
            ) : null)}
            {cfg.primaryColor && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, background: cfg.primaryColor }} />
                <div style={{ width: 20, height: 20, borderRadius: 5, background: cfg.accentColor }} />
                <div style={{ fontSize: 10, color: T2 }}>Brand colors</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Palette style={{ width: 16, height: 16, color: PURP }} />
          <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>Update Branding</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {field('Brand Name', 'brandName')}
          {field('Domain Slug', 'domainSlug')}
          {field('Tagline', 'tagline')}
          {field('Logo URL', 'logoUrl')}
          {field('Primary Color', 'primaryColor', 'color')}
          {field('Accent Color', 'accentColor', 'color')}
        </div>
        <button onClick={() => mut.mutate()} disabled={mut.isPending}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: PURP, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', width: 'fit-content', opacity: mut.isPending ? 0.6 : 1 }}>
          <Save style={{ width: 13, height: 13 }} />
          {mut.isPending ? 'Saving…' : 'Save Branding Config'}
        </button>
        {mut.isSuccess && <p style={{ fontSize: 10, color: '#10b981', margin: 0 }}>Branding config saved.</p>}
        {mut.isError && <p style={{ fontSize: 10, color: '#ef4444', margin: 0 }}>Save failed.</p>}
      </div>
    </div>
  )
}
