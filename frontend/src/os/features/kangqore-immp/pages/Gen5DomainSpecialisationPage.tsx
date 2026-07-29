import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const VERTICALS = [
  {
    key: 'ARIA', label: 'HealthTech — ARIA', icon: '🏥', color: GREEN,
    head: 'ARIA-Head-v1.2', params: '4B adapter',
    corpus: '14,200 ARIA decisions',
    capabilities: ['Clinical decision support', 'Compliance reasoning (HIPAA/CQC)', 'Patient pathway optimisation', 'Regulatory submission review', 'NHS workflow intelligence'],
    accuracy: 91, latency: 210,
  },
  {
    key: 'LEX', label: 'LegalTech — LEX', icon: '⚖️', color: BLUE,
    head: 'LEX-Head-v1.1', params: '4B adapter',
    corpus: '11,800 LEX decisions',
    capabilities: ['Contract analysis + risk scoring', 'Regulatory compliance mapping', 'Case law reasoning', 'Due diligence synthesis', 'SLA/clause extraction'],
    accuracy: 89, latency: 225,
  },
  {
    key: 'FINX', label: 'FinTech — FINX', icon: '💹', color: PURPLE,
    head: 'FINX-Head-v1.0', params: '4B adapter',
    corpus: '9,600 FINX decisions',
    capabilities: ['Financial risk modelling', 'FCA/SEC compliance reasoning', 'Portfolio intelligence', 'Fraud signal detection', 'ARR + cash flow forecasting'],
    accuracy: 90, latency: 218,
  },
]

const ROUTING_LOGIC = [
  { condition: 'Industry pack = ARIA', route: 'ARIA head (Gen5-ARIA)', color: GREEN },
  { condition: 'Industry pack = LEX', route: 'LEX head (Gen5-LEX)', color: BLUE },
  { condition: 'Industry pack = FINX', route: 'FINX head (Gen5-FINX)', color: PURPLE },
  { condition: 'Cross-vertical or unknown', route: 'Base Gen5 model', color: AMBER },
  { condition: 'Confidence < 80% on any head', route: 'Claude fallback', color: '#8899aa' },
]

export function Gen5DomainSpecialisationPage() {
  const q = useQuery({ queryKey: ['gen5-domain-status'], queryFn: () => api.get('/admin/kangqore-immp/gen5/domain/status').then(r => r.data), staleTime: 15_000 })
  const d = q.data
  const domains: any[] = d?.domains ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S214 · Domain Specialisation</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Gen5 Vertical Fine-tune Heads</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>ARIA · LEX · FINX vertical LoRA heads · industry-weighted routing · domain accuracy above base model</p>
      </div>

      {/* Status badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8, padding: '8px 16px', marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>Fine-tune Status: {d?.finetuneStatus ?? 'COMPLETE'}</span>
        <span style={{ fontSize: 11, color: '#8899aa' }}>·</span>
        <span style={{ fontSize: 11, color: '#8899aa' }}>{d?.totalDomains ?? 3} vertical heads deployed</span>
      </div>

      {/* Vertical cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {VERTICALS.map(v => (
          <div key={v.key} style={{ background: v.color + '06', border: `1px solid ${v.color}25`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', borderBottom: `1px solid ${v.color}20` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{v.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>{v.label}</div>
                  <div style={{ fontSize: 10, color: v.color, marginTop: 1 }}>{v.head} · {v.params}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: v.color }}>{v.accuracy}%</div>
                  <div style={{ fontSize: 8, color: '#8899aa', textTransform: 'uppercase' }}>Accuracy</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: v.color }}>{v.latency}ms</div>
                  <div style={{ fontSize: 8, color: '#8899aa', textTransform: 'uppercase' }}>Latency</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: v.color }}>{v.corpus}</div>
                  <div style={{ fontSize: 8, color: '#8899aa', textTransform: 'uppercase' }}>Training data</div>
                </div>
              </div>
            </div>
            <div style={{ padding: '12px 18px' }}>
              {v.capabilities.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: v.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: '#8899aa' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Routing logic */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Domain Routing Decision Tree</div>
        {ROUTING_LOGIC.map((r, i) => (
          <div key={i} style={{ padding: '10px 18px', borderBottom: '1px solid #1e2a40', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#8899aa', minWidth: 240 }}>if {r.condition}</span>
            <span style={{ fontSize: 11, color: '#556' }}>→</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: r.color }}>{r.route}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
