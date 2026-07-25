import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa', TEAL = '#06b6d4'

const VERTICAL_PACKS = [
  {
    key: 'STANDARD',
    name: 'BIDS™ Standard',
    icon: '🎯',
    color: BLUE,
    subtitle: 'Universal diagnostic for any sector',
    pillars: 16,
    description: 'Full 16-pillar diagnostic with equal weighting across all dimensions. Best for generalist consulting engagements and cross-sector benchmarking.',
    boosts: [],
    benchmark: { strategic: 64, operational: 61, technology: 58, commercial: 67 },
  },
  {
    key: 'ARIA',
    name: 'BIDS™ ARIA',
    icon: '🏥',
    color: GREEN,
    subtitle: 'HealthTech Edition',
    pillars: 16,
    description: 'Weighted for healthcare and life sciences. Elevates Risk & Compliance, Data Intelligence, and Digital Maturity to reflect NHS/regulatory complexity.',
    boosts: ['Risk & Compliance +12', 'Data Intelligence +10', 'Digital Maturity +8', 'Financial Health +5'],
    benchmark: { strategic: 58, operational: 71, technology: 67, commercial: 55 },
  },
  {
    key: 'LEX',
    name: 'BIDS™ LEX',
    icon: '⚖️',
    color: AMBER,
    subtitle: 'LegalTech Edition',
    pillars: 16,
    description: 'Calibrated for law firms, legal departments, and compliance-heavy businesses. Prioritises Operational Excellence, Risk & Compliance, and Data Intelligence.',
    boosts: ['Risk & Compliance +12', 'Operational Excellence +10', 'Data Intelligence +8', 'Leadership Effectiveness +5'],
    benchmark: { strategic: 62, operational: 74, technology: 53, commercial: 58 },
  },
  {
    key: 'FINX',
    name: 'BIDS™ FINX',
    icon: '💰',
    color: PURPLE,
    subtitle: 'FinTech Edition',
    pillars: 16,
    description: 'Engineered for financial services, fintechs, and investment firms. Elevated Financial Health, Risk & Compliance, Digital Maturity, and Data Intelligence.',
    boosts: ['Financial Health +12', 'Risk & Compliance +10', 'Digital Maturity +8', 'Data Intelligence +8'],
    benchmark: { strategic: 69, operational: 63, technology: 72, commercial: 64 },
  },
]

function BenchmarkBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: '#8899aa' }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 3, background: '#263250', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 999 }} />
      </div>
    </div>
  )
}

export function BidsVerticalPacksPage() {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<string | null>(null)
  const [form, setForm] = useState({ customerId: '', customerName: '', title: '' })

  const engQ = useQuery({ queryKey: ['bids-engagements'], queryFn: () => api.get('/admin/kangqore-immp/bids/engagements').then(r => r.data), staleTime: 20_000 })

  const createMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/bids/engagements', { ...form, tier: 'STANDARD', verticalPack: selected }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bids-engagements'] }); setForm({ customerId: '', customerName: '', title: '' }) },
  })

  const countByPack = (key: string) => (engQ.data?.engagements ?? []).filter((e: any) => e.verticalPack === key).length

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S195 · Vertical Packs</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>BIDS™ Vertical Editions</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>HealthTech (ARIA) · LegalTech (LEX) · FinTech (FINX) · vertical-weighted scoring · industry benchmark baselines</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 24 }}>
        {VERTICAL_PACKS.map(p => (
          <div key={p.key} onClick={() => setSelected(p.key === selected ? null : p.key)}
            style={{ background: '#1a2235', border: `1px solid ${selected === p.key ? p.color + '60' : '#263250'}`, borderRadius: 14, padding: '20px 22px', cursor: 'pointer', transition: 'border-color .15s', background: selected === p.key ? p.color + '08' : '#1a2235' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: p.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: p.color, fontWeight: 700 }}>{p.subtitle}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: p.color }}>{countByPack(p.key)}</div>
                <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase' }}>engagements</div>
              </div>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: 11, color: '#8899aa', lineHeight: 1.6 }}>{p.description}</p>
            {p.boosts.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Vertical Weighting Boosts</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {p.boosts.map(b => (
                    <span key={b} style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: p.color + '18', color: p.color }}>{b}</span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Industry Benchmark Baselines</div>
              <BenchmarkBar label="Strategic" value={p.benchmark.strategic} color={p.color} />
              <BenchmarkBar label="Operational" value={p.benchmark.operational} color={p.color} />
              <BenchmarkBar label="Technology" value={p.benchmark.technology} color={p.color} />
              <BenchmarkBar label="Commercial" value={p.benchmark.commercial} color={p.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Create engagement with selected pack */}
      {selected && (
        <div style={{ background: '#1a2235', border: `1px solid ${VERTICAL_PACKS.find(p => p.key === selected)?.color ?? BLUE}40`, borderRadius: 12, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            New {VERTICAL_PACKS.find(p => p.key === selected)?.name} Engagement
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
            <input placeholder="Customer ID" value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}
              style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 12 }} />
            <input placeholder="Customer Name" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
              style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 12 }} />
            <input placeholder="Engagement Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={{ background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 12 }} />
            <button onClick={() => createMut.mutate()} disabled={!form.customerId || !form.customerName || !form.title || createMut.isPending}
              style={{ background: VERTICAL_PACKS.find(p => p.key === selected)?.color ?? BLUE, border: 'none', color: '#0d1824', padding: '9px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 12, fontWeight: 700, opacity: createMut.isPending ? 0.7 : 1, whiteSpace: 'nowrap' }}>
              {createMut.isPending ? 'Opening…' : 'Open Engagement'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
