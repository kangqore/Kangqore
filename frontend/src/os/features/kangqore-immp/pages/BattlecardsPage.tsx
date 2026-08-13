import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { AlertTriangle, ShieldCheck, Swords, Handshake } from 'lucide-react'

const GREEN = '#10b981', RED = '#ef4444', BLUE = '#4fc3f7', GREY = '#8899aa'

const VERDICT_STYLE: Record<string, { color: string; label: string; icon: any }> = {
  WON: { color: GREEN, label: 'WON', icon: ShieldCheck },
  CONTESTED: { color: RED, label: 'CONTESTED', icon: Swords },
  TOGETHER: { color: BLUE, label: 'TOGETHER', icon: Handshake },
}

interface Battlecard {
  id: string; name: string; slug: string; iconEmoji: string; tags: string[]
  manifest: { serviceNowModule: string; verdict: string; objection: string; response: string; keyDifferentiators: string[]; proofLink: string }
}

function BattlecardCard({ card }: { card: Battlecard }) {
  const v = VERDICT_STYLE[card.manifest.verdict] ?? VERDICT_STYLE.TOGETHER
  const Icon = v.icon
  return (
    <div style={{ background: '#1a2235', border: `1px solid ${v.color}22`, borderRadius: 16, padding: '20px 22px', flex: 1, minWidth: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{card.iconEmoji}</span>
          <span style={{ fontSize: 14.5, fontWeight: 900, color: '#fff' }}>vs. {card.manifest.serviceNowModule}</span>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 999, background: `${v.color}18`, color: v.color }}>
          <Icon size={11} /> {v.label}
        </span>
      </div>
      <p style={{ fontSize: 12, color: '#ccd2dc', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 8 }}>{card.manifest.objection}</p>
      <p style={{ fontSize: 12, color: GREY, lineHeight: 1.7, marginBottom: 12 }}>{card.manifest.response}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {card.manifest.keyDifferentiators.map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <span style={{ color: v.color, fontSize: 11, marginTop: 2 }}>&bull;</span>
            <span style={{ fontSize: 11.5, color: '#ccd2dc' }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BattlecardsPage() {
  const q = useQuery({ queryKey: ['battlecards'], queryFn: () => api.get('/admin/kangqore-immp/battlecards').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1200 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Overshadow Roadmap P7.1 — Sales Enablement</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>
          <Swords size={22} style={{ verticalAlign: -3, marginRight: 8 }} /> Competitive Battlecards
        </h1>
        <p style={{ margin: '6px 0 0', color: GREY, fontSize: 13, maxWidth: 680 }}>
          The playbook's objection-handling table, live — one card per ServiceNow module, honest about which ones this roadmap actually won.
        </p>
      </div>

      {d && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, padding: '5px 12px', borderRadius: 999, background: `${GREEN}18`, color: GREEN }}>{d.summary.won} won</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, padding: '5px 12px', borderRadius: 999, background: `${RED}18`, color: RED }}>{d.summary.contested} contested</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, padding: '5px 12px', borderRadius: 999, background: `${BLUE}18`, color: BLUE }}>{d.summary.together} coexist</span>
        </div>
      )}

      <div style={{ background: `${BLUE}0c`, border: `1px solid ${BLUE}30`, borderRadius: 12, padding: '12px 16px', marginBottom: 22, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <AlertTriangle size={15} color={BLUE} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: '#ccd2dc', lineHeight: 1.6 }}>{d?.disclaimer}</span>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {(d?.battlecards ?? []).map((c: Battlecard) => <BattlecardCard key={c.id} card={c} />)}
      </div>
    </div>
  )
}
