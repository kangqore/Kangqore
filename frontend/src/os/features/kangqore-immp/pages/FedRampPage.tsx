import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { AlertTriangle, Flag } from 'lucide-react'

const BLUE = '#4fc3f7', AMBER = '#f59e0b', GREY = '#8899aa'

function GateCard({ flag, title, data }: { flag: string; title: string; data: any }) {
  return (
    <div style={{ background: '#1a2235', border: `1px solid ${AMBER}22`, borderRadius: 16, padding: '22px 24px', flex: 1, minWidth: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 22 }}>{flag}</span>
        <span style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{title}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: `${GREY}18`, border: `1.5px solid ${GREY}40`, color: GREY }}>{data?.status ?? 'NOT_STARTED'}</span>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14, fontSize: 12 }}>
        <div><dt style={{ color: GREY, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sponsoring agency</dt><dd style={{ margin: 0, color: '#ccdde0', fontWeight: 600 }}>{data?.sponsoringAgency ?? '— none yet'}</dd></div>
        <div><dt style={{ color: GREY, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assessor</dt><dd style={{ margin: 0, color: '#ccdde0', fontWeight: 600 }}>{data?.thirdPartyAssessor ?? data?.assessor ?? '— none yet'}</dd></div>
      </dl>
      <p style={{ fontSize: 12, color: GREY, lineHeight: 1.7, margin: 0 }}>{data?.disclaimer}</p>
    </div>
  )
}

export function FedRampPage() {
  const q = useQuery({ queryKey: ['fedramp-moderate'], queryFn: () => api.get('/admin/kangqore-immp/platform/fedramp-moderate').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Overshadow Roadmap P2.3 / P2.4 — Decision Gate</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>FedRAMP &amp; IRAP — Not a Task Yet, a Decision</h1>
        <p style={{ margin: '6px 0 0', color: GREY, fontSize: 13 }}>Neither program is authorized. Neither should start until a real sponsoring opportunity exists.</p>
      </div>

      <div style={{ background: `${AMBER}0c`, border: `1px solid ${AMBER}30`, borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <AlertTriangle size={16} color={AMBER} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12.5, color: '#ccd2dc', lineHeight: 1.7 }}>
          <strong style={{ color: '#fff' }}>The honest long pole on this roadmap.</strong> {d?.fedramp?.gateNote}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <GateCard flag="🇺🇸" title="FedRAMP Moderate" data={d?.fedramp} />
        <GateCard flag="🇦🇺" title="IRAP" data={d?.irap} />
      </div>

      <div style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}22`, borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Flag size={15} color={BLUE} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12.5, color: GREY, lineHeight: 1.7, margin: 0 }}>
          Before doing any FedRAMP- or IRAP-specific engineering work: confirm there is an actual near-term
          federal or Australian public-sector deal in motion that requires it. If there isn't one yet, the
          right move is to leave both gates at NOT_STARTED and revisit this page when there is.
        </p>
      </div>
    </div>
  )
}
