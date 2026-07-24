import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { Bot, Save } from 'lucide-react'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const TEAL = '#0d9488'

const PARTNER_ID = 'partner-zero'
const TONE_OPTIONS = ['professional', 'friendly', 'formal', 'dynamic']

export function OEMPersonaPage() {
  const qc = useQueryClient()
  const { data } = useQuery({
    queryKey: ['oem-persona', PARTNER_ID],
    queryFn:  () => api.get(`/admin/kangqore-immp/oem/persona/${PARTNER_ID}`).then(r => r.data.persona),
    staleTime: 30_000,
  })
  const persona = data ?? {}

  const [form, setForm] = useState({ personaName: '', toneProfile: 'professional', avatarColor: '#7c3aed', greetingScript: '', systemPrompt: '' })

  const mut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/oem/persona', { partnerId: PARTNER_ID, ...form }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['oem-persona', PARTNER_ID] }),
  })

  const active = { personaName: form.personaName || persona.personaName || 'NOVA', avatarColor: form.avatarColor || persona.avatarColor || '#7c3aed' }

  return (
    <div style={{ maxWidth: 720 }} className="space-y-6">
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: T1, margin: 0 }}>White-label Persona Engine</h2>
        <p style={{ fontSize: 12, color: T2, marginTop: 4 }}>Override WAANDA's name, tone, avatar color, and greeting for this OEM partner's sub-tenants.</p>
      </div>

      {/* Live Preview */}
      <div style={{ background: CARD, border: `1px solid ${active.avatarColor}30`, borderRadius: 14, padding: '20px 22px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Persona Preview</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${active.avatarColor}, ${active.avatarColor}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bot style={{ width: 26, height: 26, color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: T1 }}>{active.personaName}</div>
            <div style={{ fontSize: 11, color: T2, marginTop: 2 }}>{form.greetingScript || persona.greetingScript || `Hello! I'm ${active.personaName}, your AI assistant.`}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          {[form.toneProfile || persona.toneProfile || 'professional'].map((t: string) => (
            <span key={t} style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: active.avatarColor + '12', color: active.avatarColor, border: `1px solid ${active.avatarColor}25`, textTransform: 'uppercase', letterSpacing: '.08em' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em' }}>Persona Name</label>
            <input value={form.personaName || persona.personaName || ''} onChange={e => setForm(f => ({ ...f, personaName: e.target.value }))}
              style={{ display: 'block', width: '100%', marginTop: 5, padding: '8px 12px', borderRadius: 8, border: `1px solid ${BDR}`, background: 'var(--os-surface-0)', color: T1, fontSize: 12 }} />
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em' }}>Avatar Color</label>
            <input type="color" value={form.avatarColor || persona.avatarColor || '#7c3aed'} onChange={e => setForm(f => ({ ...f, avatarColor: e.target.value }))}
              style={{ display: 'block', width: '100%', marginTop: 5, height: 36, borderRadius: 8, border: `1px solid ${BDR}`, background: 'var(--os-surface-0)', cursor: 'pointer' }} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em' }}>Tone Profile</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {TONE_OPTIONS.map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, toneProfile: t }))}
                style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${(form.toneProfile || persona.toneProfile) === t ? TEAL : BDR}`, background: (form.toneProfile || persona.toneProfile) === t ? TEAL + '12' : 'transparent', color: (form.toneProfile || persona.toneProfile) === t ? TEAL : T2, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 10, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.08em' }}>Greeting Script</label>
          <textarea value={form.greetingScript || persona.greetingScript || ''} onChange={e => setForm(f => ({ ...f, greetingScript: e.target.value }))} rows={2}
            style={{ display: 'block', width: '100%', marginTop: 5, padding: '8px 12px', borderRadius: 8, border: `1px solid ${BDR}`, background: 'var(--os-surface-0)', color: T1, fontSize: 12, resize: 'vertical' }} />
        </div>
        <button onClick={() => mut.mutate()} disabled={mut.isPending}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: TEAL, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', width: 'fit-content', opacity: mut.isPending ? 0.6 : 1 }}>
          <Save style={{ width: 13, height: 13 }} />
          {mut.isPending ? 'Saving…' : 'Save Persona Config'}
        </button>
        {mut.isSuccess && <p style={{ fontSize: 10, color: TEAL, margin: 0 }}>Persona config saved. Sub-tenants will inherit this persona.</p>}
      </div>
    </div>
  )
}
