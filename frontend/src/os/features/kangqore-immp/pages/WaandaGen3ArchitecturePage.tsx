import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2 } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

const PHASES = [
  {
    id: 'P1', label: 'Data & Corpus',
    desc: '500B+ token corpus: Kangqore production decisions, BIDS datasets, enterprise intelligence, synthetic reasoning chains.',
    color: BLUE, status: 'PLANNED',
  },
  {
    id: 'P2', label: 'Architecture Design',
    desc: '70B parameter sparse MoE (Mixture of Experts). Domain routing via 8 expert heads: Strategy, Finance, Compliance, Tech, HR, Ops, CRM, BIDS.',
    color: PURPLE, status: 'PLANNED',
  },
  {
    id: 'P3', label: 'Pre-training & RLKF',
    desc: 'Pre-train on 500B corpus. RLKF = Reinforcement Learning from Kangqore Feedback — replaces human feedback with KIMMP decision outcomes.',
    color: AMBER, status: 'PLANNED',
  },
  {
    id: 'P4', label: 'Enterprise Alignment',
    desc: 'DPO + Constitutional AI alignment. Bias audits, HANUMANAS-gated evals, SOC 2 / ISO 27001 compliance reasoning layer.',
    color: GREEN, status: 'PLANNED',
  },
  {
    id: 'P5', label: 'Production Deployment',
    desc: 'Multi-region serving: UK/EU/India. Blueprint-aware context injection. WAANDA Studio orchestration native.',
    color: '#e879f9', status: 'PLANNED',
  },
]

export function WaandaGen3ArchitecturePage() {
  const q = useQuery({ queryKey: ['gen3-architecture'], queryFn: () => api.get('/admin/kangqore-immp/platform/gen3-architecture').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S221 · WAANDA Gen3 Architecture</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA Foundation Model v3 Blueprint</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>70B+ sparse MoE · RLKF alignment · 8 expert heads · enterprise-grade reasoning · Kangqore-native intelligence</p>
      </div>

      {/* Hero spec card */}
      <div style={{ background: `linear-gradient(135deg, ${PURPLE}12, ${BLUE}08)`, border: `1px solid ${PURPLE}35`, borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{d?.targetParams ?? '70B+'}  <span style={{ fontSize: 16, color: PURPLE }}>parameters</span></div>
            <div style={{ fontSize: 13, color: '#8899aa' }}>{d?.architecture ?? 'Sparse Mixture of Experts (MoE) · 8 domain expert heads'}</div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: 'Training Data', value: '500B+ tokens', color: BLUE },
              { label: 'Alignment', value: 'RLKF', color: AMBER },
              { label: 'Serving', value: 'Multi-region', color: GREEN },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Approved badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '6px 14px' }}>
          <CheckCircle2 size={14} color={GREEN} />
          <span style={{ fontSize: 11, fontWeight: 700, color: GREEN }}>Architecture Approved — {d?.approvedBy ?? 'Board approved, S221'}</span>
        </div>
      </div>

      {/* Expert heads */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>8 Domain Expert Heads (MoE)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { head: 'Strategy', color: PURPLE, icon: '🎯' },
            { head: 'Finance', color: GREEN, icon: '💹' },
            { head: 'Compliance', color: BLUE, icon: '⚖️' },
            { head: 'Technology', color: AMBER, icon: '🔧' },
            { head: 'HR & Org', color: '#f472b6', icon: '👥' },
            { head: 'Operations', color: '#34d399', icon: '⚙️' },
            { head: 'CRM & GTM', color: '#60a5fa', icon: '🤝' },
            { head: 'BIDS™ Intel', color: '#fb923c', icon: '📊' },
          ].map(h => (
            <div key={h.head} style={{ background: h.color + '08', border: `1px solid ${h.color}20`, borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{h.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: h.color }}>{h.head}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase roadmap */}
      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1 }}>Gen3 Development Phases</div>
        {PHASES.map((p, i) => (
          <div key={p.id} style={{ padding: '14px 20px', borderBottom: i < PHASES.length - 1 ? '1px solid #1e2a40' : 'none', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: p.color + '18', border: `1.5px solid ${p.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: p.color, flexShrink: 0 }}>{p.id}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#ccdde0', marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.5 }}>{p.desc}</div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 4, background: '#263250', color: '#8899aa', flexShrink: 0 }}>{p.status}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: '12px 16px', background: PURPLE + '08', border: `1px solid ${PURPLE}25`, borderRadius: 8, fontSize: 11, color: '#8899aa', lineHeight: 1.6 }}>
        Gen3 development begins after Gen5 achieves 95% routing. Gen5 corpus = training data foundation for Gen3. Estimated timeline: 18–24 months from Gen5 primary declaration.
      </div>
    </div>
  )
}
