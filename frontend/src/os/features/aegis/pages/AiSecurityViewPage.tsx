import { useQuery } from '@tanstack/react-query'
import { ShieldAlert, Radio, ClipboardCheck, AlertTriangle } from 'lucide-react'
import { api } from '@lib/api'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const RED = '#ef4444'
const AMB = '#f59e0b'
const BLUE = '#579bfc'
const GRN = '#10b981'

interface Incident { id: string; eventType: string; system: string | null; actor: string; autonomous: boolean; endpoint: string | null; priority: string | null; createdAt: string }
interface ReviewItem { id: string; agentName: string | null; tool: string; action: string; description: string; level: number; requestedAt: string; expiresAt: string }
interface SecurityView {
  aiTouchedIncidents30d: number; pendingActionReviews: number; openSecurityFindings: number; criticalOpenFindings: number
  recentIncidents: Incident[]; pendingReviewQueue: ReviewItem[]; disclaimer: string
}

const EVENT_COLOR: Record<string, string> = { POLICY_VIOLATION: RED, ACCESS_DENIED: AMB, EGRESS: BLUE }

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl p-4 text-center" style={{ background: SURF, border: `1px solid ${BDR}` }}>
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: T2 }}>{label}</p>
    </div>
  )
}

export function AiSecurityViewPage() {
  const { data } = useQuery<SecurityView>({
    queryKey: ['ai-security-view'],
    queryFn: () => api.get('/admin/kangqore-immp/platform/ai-security-view').then(r => r.data),
    staleTime: 30_000,
  })

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black tracking-tight flex items-center gap-2" style={{ color: T1 }}>
          <ShieldAlert className="w-5 h-5" style={{ color: RED }} /> AI Security View
        </h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
          Overshadow Roadmap P4.2 — AI-touched incidents &amp; pending action reviews, not a SIEM
        </p>
      </div>

      <div className="rounded-xl p-3 flex items-start gap-2.5" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}30` }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: BLUE }} />
        <p className="text-xs leading-relaxed" style={{ color: T2 }}>{data?.disclaimer}</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <StatCard label="AI-touched incidents (30d)" value={data?.aiTouchedIncidents30d ?? 0} color={RED} />
        <StatCard label="Pending action reviews" value={data?.pendingActionReviews ?? 0} color={AMB} />
        <StatCard label="Open security findings" value={data?.openSecurityFindings ?? 0} color={BLUE} />
        <StatCard label="Critical open findings" value={data?.criticalOpenFindings ?? 0} color={RED} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: CARD, borderBottom: `1px solid ${BDR}` }}>
            <Radio className="w-4 h-4" style={{ color: T2 }} />
            <p className="text-sm font-semibold" style={{ color: T1 }}>Recent AI-touched events</p>
          </div>
          <div style={{ background: CARD }}>
            {(data?.recentIncidents ?? []).length === 0 && <p className="text-xs text-center py-8" style={{ color: T2 }}>No policy violations, access denials, or egress events logged yet.</p>}
            {data?.recentIncidents.map((r, i) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: i < data.recentIncidents.length - 1 ? `1px solid ${BDR}` : undefined }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: EVENT_COLOR[r.eventType] ?? T2 }} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold" style={{ color: T1 }}>{r.eventType.replace('_', ' ')}</span>
                  <span className="text-[11px] ml-2" style={{ color: T2 }}>{r.system ?? r.endpoint ?? r.actor}{r.autonomous ? ' · autonomous' : ''}</span>
                </div>
                <span className="text-[10px] flex-shrink-0" style={{ color: T2 }}>{new Date(r.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: CARD, borderBottom: `1px solid ${BDR}` }}>
            <ClipboardCheck className="w-4 h-4" style={{ color: T2 }} />
            <p className="text-sm font-semibold" style={{ color: T1 }}>Pending action reviews</p>
          </div>
          <div style={{ background: CARD }}>
            {(data?.pendingReviewQueue ?? []).length === 0 && <p className="text-xs text-center py-8" style={{ color: T2 }}>No agent actions currently waiting on human review.</p>}
            {data?.pendingReviewQueue.map((r, i) => (
              <div key={r.id} className="px-4 py-2.5" style={{ borderBottom: i < data.pendingReviewQueue.length - 1 ? `1px solid ${BDR}` : undefined }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold" style={{ color: T1 }}>{r.agentName ?? 'Unknown agent'} · {r.action}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${AMB}18`, color: AMB }}>L{r.level}</span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: T2 }}>{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
