import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Bot, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const GREEN = '#10b981'

const REGIONS = [
  { key: 'UK',    label: 'United Kingdom 🇬🇧', color: '#3b82f6', accentBg: 'rgba(59,130,246,0.08)' },
  { key: 'EU',    label: 'European Union 🇪🇺',  color: '#7c3aed', accentBg: 'rgba(124,58,237,0.08)' },
  { key: 'INDIA', label: 'India 🇮🇳',           color: '#f59e0b', accentBg: 'rgba(245,158,11,0.08)' },
]

const TONE_PROFILES = ['formal', 'professional', 'friendly', 'dynamic']

export function RegionalPersonaPage() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<any>({})

  const personasQ = useQuery({
    queryKey: ['intl-personas'],
    queryFn:  () => api.get('/admin/kangqore-immp/intl/regional-personas').then(r => r.data.personas),
    staleTime: 30_000,
  })

  const upsertMut = useMutation({
    mutationFn: (body: any) => api.post('/admin/kangqore-immp/intl/regional-personas/upsert', body).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['intl-personas'] }); setEditing(null) },
  })

  const personas: any[] = Array.isArray(personasQ.data) ? personasQ.data : []

  return (
    <div style={{ maxWidth: 900 }} className="space-y-6">
      <div style={{ padding: '18px 22px', borderRadius: 14, background: GREEN + '08', border: `1px solid ${GREEN}25` }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: GREEN, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>S152 — Regional WAANDA Personas</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: T1, marginBottom: 4 }}>Configure WAANDA persona per region</div>
        <div style={{ fontSize: 12, color: T2 }}>Each region gets a tuned persona: tone, language hint, regulatory context, calendar format. Sub-tenants inherit their region's persona.</div>
      </div>

      {REGIONS.map(r => {
        const persona = personas.find((p: any) => p.region === r.key)
        const isEditing = editing === r.key

        return (
          <div key={r.key} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: r.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot style={{ width: 16, height: 16, color: r.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: T1 }}>{r.label}</div>
                <div style={{ fontSize: 10, color: T2 }}>{persona ? `${persona.personaName} · ${persona.toneStyle}` : 'Not configured'}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!isEditing && (
                  <button onClick={() => { setEditing(r.key); setForm(persona ?? { region: r.key, toneStyle: 'professional' }) }}
                    style={{ fontSize: 11, fontWeight: 700, padding: '6px 14px', background: r.color + '12', color: r.color, border: `1px solid ${r.color}30`, borderRadius: 8, cursor: 'pointer' }}>
                    {persona ? 'Edit' : 'Configure'}
                  </button>
                )}
                {isEditing && (
                  <>
                    <button onClick={() => upsertMut.mutate(form)} disabled={upsertMut.isPending}
                      style={{ fontSize: 11, fontWeight: 700, padding: '6px 14px', background: GREEN, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', opacity: upsertMut.isPending ? 0.6 : 1 }}>
                      {upsertMut.isPending ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(null)}
                      style={{ fontSize: 11, fontWeight: 700, padding: '6px 14px', background: 'transparent', color: T2, border: `1px solid ${BDR}`, borderRadius: 8, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { key: 'personaName',       label: 'Persona Name',        placeholder: 'e.g. WAANDA UK' },
                  { key: 'languageHint',       label: 'Language Hint',       placeholder: 'e.g. en-GB' },
                  { key: 'calendarFormat',     label: 'Calendar Format',     placeholder: 'e.g. DD/MM/YYYY' },
                  { key: 'regulatoryContext',  label: 'Regulatory Context',  placeholder: 'FCA | ICO | …' },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{f.label}</div>
                    <input value={form[f.key] ?? ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                      style={{ width: '100%', padding: '8px 12px', background: 'var(--os-bg)', border: `1px solid ${BDR}`, borderRadius: 8, fontSize: 12, color: T1, outline: 'none' }} />
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Tone Style</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {TONE_PROFILES.map(t => (
                      <button key={t} onClick={() => setForm({ ...form, toneStyle: t })}
                        style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: form.toneStyle === t ? r.color : r.accentBg, color: form.toneStyle === t ? '#fff' : r.color, border: `1px solid ${r.color}30` }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : persona ? (
              <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Persona Name',    value: persona.personaName },
                  { label: 'Tone Style',      value: persona.toneStyle?.toUpperCase() },
                  { label: 'Language',        value: persona.languageHint },
                  { label: 'Calendar',        value: persona.calendarFormat },
                ].map(f => (
                  <div key={f.label} style={{ padding: '10px 14px', borderRadius: 10, background: r.accentBg, border: `1px solid ${r.color}15` }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{f.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T1 }}>{f.value}</div>
                  </div>
                ))}
                <div style={{ gridColumn: 'span 2', padding: '10px 14px', borderRadius: 10, background: r.accentBg, border: `1px solid ${r.color}15` }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>Regulatory Context</div>
                  <div style={{ fontSize: 11, color: T1 }}>{persona.regulatoryContext}</div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px 20px', fontSize: 12, color: T2 }}>Not yet configured — click Configure to set up this region's persona.</div>
            )}
          </div>
        )
      })}

      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/kangqore-view/admin/kangqore-immp/uk-launch" style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>UK Launch <ChevronRight style={{ width: 12, height: 12 }} /></Link>
        <Link to="/kangqore-view/admin/kangqore-immp/eu-launch"    style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>EU Launch <ChevronRight style={{ width: 12, height: 12 }} /></Link>
        <Link to="/kangqore-view/admin/kangqore-immp/india-launch" style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>India Launch <ChevronRight style={{ width: 12, height: 12 }} /></Link>
      </div>
    </div>
  )
}
