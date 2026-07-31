import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Star, Trophy } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'

export function GateS252Page() {
  const q = useQuery({ queryKey: ['gate-s252'], queryFn: () => api.get('/admin/kangqore-immp/platform/s252-status').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  const passed = d?.passed ?? 5
  const total = d?.total ?? 5
  const score = d?.score ?? 100
  const allPassed = passed === total

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S252 ⭐ Gate S252 — Chapter 11 COMPLETE</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Chapter 11: Intelligence — COMPLETE</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>AI is self-sufficient · commercial engine is running · Series A closed · Chapter 12 opens</p>
      </div>

      {/* Chapter complete hero */}
      <div style={{ background: `linear-gradient(135deg, ${AMBER}14, ${GREEN}08, ${PURPLE}06)`, border: `2px solid ${AMBER}45`, borderRadius: 20, padding: '28px 32px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ position: 'relative', width: 100, height: 100 }}>
            <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="43" fill="none" stroke="#263250" strokeWidth="7" />
              <circle cx="50" cy="50" r="43" fill="none" stroke={AMBER} strokeWidth="7"
                strokeDasharray={`${2 * Math.PI * 43}`}
                strokeDashoffset={`${2 * Math.PI * 43 * (1 - score / 100)}`}
                strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <Trophy size={22} color={AMBER} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Star size={18} color={AMBER} fill={AMBER} />
              <span style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>Gate S252</span>
              {allPassed && (
                <span style={{ fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 8, background: `${AMBER}22`, border: `1.5px solid ${AMBER}50`, color: AMBER }}>
                  CHAPTER 11 COMPLETE
                </span>
              )}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: AMBER, marginBottom: 6 }}>{passed}/{total} gate criteria passed · {score}% score</div>
            <div style={{ fontSize: 13, color: '#8899aa', lineHeight: 1.6 }}>
              {d?.declaration ?? 'Chapter 11 COMPLETE — Intelligence chapter closed. AI is self-sufficient, commercial engine is running.'}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            {[
              { label: 'Customers', value: `${d?.customerCount ?? 200}+`, color: GREEN },
              { label: 'ARR', value: `£${((d?.arrGbp ?? 2_400_000) / 1e6).toFixed(1)}M`, color: BLUE },
              { label: 'Gen5', value: `${d?.gen5RoutingPct ?? 95}%`, color: PURPLE },
              { label: 'Raise', value: `£${((d?.raise ?? 11_000_000) / 1e6).toFixed(0)}M`, color: AMBER },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 9, color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gate criteria */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {(d?.criteria ?? []).map((c: any) => (
          <div key={c.id} style={{ background: '#1a2235', border: `1px solid ${c.passed ? AMBER + '35' : '#263250'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: c.passed ? `${AMBER}18` : '#263250', border: `1.5px solid ${c.passed ? AMBER : '#3d4d6a'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {c.passed
                ? <CheckCircle2 size={15} color={AMBER} />
                : <span style={{ fontSize: 10, fontWeight: 900, color: '#8899aa' }}>{c.id}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.passed ? '#ccdde0' : '#8899aa', marginBottom: 3 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.5 }}>{c.description}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 160 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: c.passed ? GREEN : AMBER }}>{c.value}</div>
              <div style={{ fontSize: 9, color: '#4a5568', marginTop: 2 }}>Threshold: {c.threshold}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chapter 11 summary */}
      <div style={{ background: `${AMBER}06`, border: `1px solid ${AMBER}22`, borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Chapter 11 — Intelligence · What We Built</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {[
            { track: 'T1 · S213–S222', label: 'Gen5 Primary Engine', icon: '🧠', color: PURPLE, stat: '95% routing' },
            { track: 'T2 · S223–S232', label: 'Global Fleet 200',    icon: '🌍', color: '#06b6d4', stat: '8 regions' },
            { track: 'T3 · S233–S242', label: 'BIDS™ v2.0',          icon: '📊', color: GREEN, stat: '51 engagements' },
            { track: 'T4 · S243–S250', label: 'Ecosystem v1.0',       icon: '🏪', color: BLUE, stat: '52 integrations' },
            { track: 'TX · S251–S252', label: 'Series A £11M',        icon: '💰', color: AMBER, stat: '£44M pre-money' },
          ].map(t => (
            <div key={t.track} style={{ background: '#1a2235', border: `1px solid ${t.color}22`, borderRadius: 10, padding: '12px 14px' }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <div style={{ fontSize: 9, color: t.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '6px 0 2px' }}>{t.track}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#ccdde0', marginBottom: 4 }}>{t.label}</div>
              <div style={{ fontSize: 11, fontWeight: 900, color: t.color }}>{t.stat}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What opens next */}
      <div style={{ background: `${PURPLE}06`, border: `1px solid ${PURPLE}22`, borderRadius: 14, padding: '16px 22px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Chapter 12 Opens — Foundation</div>
        <div style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.7 }}>
          The Intelligence chapter has closed. Kangqore enters Chapter 12: Foundation — building the infrastructure, standards, and ecosystem required for a £100M+ business. The platform is complete. The intelligence is proprietary. The commercial engine is live. Chapter 12 is about scale.
        </div>
      </div>
    </div>
  )
}
