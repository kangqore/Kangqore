import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { AlertTriangle, Github, KeyRound, Radio } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', GREY = '#8899aa'

// Overshadow Roadmap P6.3 — this page previously rendered fabricated
// fallback numbers (2,140 "registered developers", fake GitHub repos with
// fake star counts, a fake ambassador programme) even independent of the
// backend response, via `?? '2,140'`-style defaults. Rewritten to show only
// real counts and explicit "not built yet" states — no fallback fabrication.
export function DeveloperCommunityPage() {
  const q = useQuery({ queryKey: ['developer-community'], queryFn: () => api.get('/admin/kangqore-immp/platform/developer-community').then(r => r.data), staleTime: 60_000 })
  const d = q.data
  const s = d?.stats ?? {}

  const NOT_BUILT: Array<{ label: string; on: boolean }> = [
    { label: 'Community forum', on: !!d?.forums },
    { label: 'Q&A system', on: !!d?.qna },
    { label: 'Developer newsletter', on: !!d?.newsletter },
    { label: 'App showcase', on: !!d?.showcase },
    { label: 'Ambassador programme', on: !!d?.ambassadorProgram },
  ]

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Overshadow Roadmap P6.3 — Developer Relations</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Developer Community</h1>
        <p style={{ margin: '6px 0 0', color: GREY, fontSize: 13 }}>What's real today, and what genuinely isn't built yet — no vanity numbers.</p>
      </div>

      {d?.disclaimer && (
        <div style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}30`, borderRadius: 10, padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <AlertTriangle size={14} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11.5, color: '#ccdde0', lineHeight: 1.6 }}>{d.disclaimer}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
        <div style={{ background: '#1a2235', border: `1px solid ${GREEN}25`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <KeyRound size={20} color={GREEN} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: GREEN }}>{s.activeApiKeys ?? 0}</div>
            <div style={{ fontSize: 10, color: GREY }}>Active API keys</div>
          </div>
        </div>
        <div style={{ background: '#1a2235', border: `1px solid ${BLUE}25`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Radio size={20} color={BLUE} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: BLUE }}>{s.activeWebhookSubscriptions ?? 0}</div>
            <div style={{ fontSize: 10, color: GREY }}>Active webhook subscriptions</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '13px 20px', borderBottom: '1px solid #263250', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Github size={14} color={GREY} />
          <span style={{ fontSize: 11, fontWeight: 700, color: GREY, textTransform: 'uppercase', letterSpacing: 1 }}>Open-source repositories</span>
        </div>
        <div style={{ padding: '20px', fontSize: 12, color: GREY, textAlign: 'center' }}>
          No repositories published yet.
        </div>
      </div>

      <div style={{ background: '#1a2235', border: '1px solid #263250', borderRadius: 14, padding: '18px 22px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: GREY, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Programme status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NOT_BUILT.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.on ? GREEN : '#4a5568', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#ccdde0' }}>{item.label}</span>
              <span style={{ fontSize: 10, color: item.on ? GREEN : GREY, marginLeft: 'auto', fontWeight: 700 }}>{item.on ? 'LIVE' : 'NOT BUILT'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
