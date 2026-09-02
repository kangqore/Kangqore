import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Rocket, CheckCircle2, XCircle, Clock, Zap, Globe2, Shield, Brain, Users } from 'lucide-react'
import { api } from '@lib/api'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const GRN  = '#10b981'
const AMB  = '#f59e0b'
const RED  = '#ef4444'
const BLUE = '#579bfc'
const PURP = '#7c3aed'
const TEAL = '#0d9488'

interface Criterion { id: string; label: string; passed: boolean }
interface Gate9     { criteria: Criterion[]; passed: number; total: number; score: number; alreadyDeclared: boolean; declaration?: any }

const CHAPTER9_TRACKS = [
  { id: 'T1', title: 'Vertical SaaS Licensing', icon: Globe2, color: BLUE, description: 'Package Kangqore OS as a vertical SaaS for specific industries. Each vertical gets a pre-configured Blueprint with industry pack, HANUMANAS profile, and branded WAANDA persona.', status: 'planned' },
  { id: 'T2', title: 'OEM / White-label', icon: Shield, color: TEAL, description: 'Partner organisations deploy Kangqore under their own brand. Blueprint Marketplace is the distribution layer. Commission structure already live.', status: 'planned' },
  { id: 'T3', title: 'International GTM', icon: Globe2, color: GRN, description: 'UK/EU/India regions are technically ready. Chapter 9 is the commercial launch: regional pricing, GDPR/DPA compliance already done.', status: 'ready' },
  { id: 'T4', title: 'Gen4 Foundation Training', icon: Brain, color: PURP, description: 'When corpus reaches 5,000 records, begin Gen4 fine-tuning on Llama 3.1 8B. Replaces Gen1 Claude dependency for 80%+ of KIMMP reasoning.', status: 'pending-threshold' },
]

const STATUS_META: Record<string, { label: string; color: string }> = {
  'planned':           { label: 'Planned',    color: BLUE },
  'ready':             { label: 'Ready',      color: GRN  },
  'pending-threshold': { label: 'Threshold',  color: AMB  },
}

export function PlatformLaunchPage() {
  const qc = useQueryClient()
  const [declaring, setDeclaring] = useState(false)

  const { data, isLoading } = useQuery<Gate9>({
    queryKey: ['platform-v1-status'],
    queryFn: () => api.get('/admin/kangqore-immp/platform/v1-status').then(r => r.data),
    refetchInterval: 15000,
  })
  const { data: ch9Data } = useQuery({
    queryKey: ['chapter-9-brief'],
    queryFn: () => api.get('/admin/kangqore-immp/platform/chapter-9-brief').then(r => r.data),
  })

  const declareMut = useMutation({
    mutationFn: () => api.post('/admin/kangqore-immp/platform/declare-v1', { notes: 'Platform v1.0.0 declared from PlatformLaunchPage.' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['platform-v1-status'] }); setDeclaring(false) },
  })

  const criteria   = data?.criteria ?? []
  const score      = data?.score ?? 0
  const passed     = data?.passed ?? 0
  const total      = data?.total ?? 8
  const allPassed  = passed === total
  const declared   = data?.alreadyDeclared ?? false
  const declaration = data?.declaration

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Platform Launch" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: T1 }}>Platform v1.0 — Launch Control</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
            Gate 9 · 8 criteria · Declare v1.0 · Chapter 9 brief
          </p>
        </div>
        {declared && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
            style={{ background: `${GRN}12`, border: `1px solid ${GRN}30` }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: GRN }} />
            <span className="text-sm font-black" style={{ color: GRN }}>v1.0.0 Declared</span>
          </div>
        )}
      </div>

      {/* Readiness score */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: CARD, border: `1px solid ${BDR}` }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: T1 }}>Gate 9 — Platform Completeness</p>
            <p className="text-xs mt-0.5" style={{ color: T2 }}>{passed}/{total} criteria passing</p>
          </div>
          <p className="text-4xl font-black font-variant-numeric" style={{ color: score >= 100 ? GRN : score >= 75 ? AMB : RED }}>
            {score}%
          </p>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: `${BDR}80` }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${score}%`, background: score >= 100 ? GRN : score >= 75 ? AMB : RED }} />
        </div>
      </div>

      {/* Criteria checklist */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ background: CARD, borderBottom: `1px solid ${BDR}` }}>
          <Rocket className="w-4 h-4" style={{ color: T2 }} />
          <p className="text-sm font-semibold" style={{ color: T1 }}>Gate 9 Criteria</p>
        </div>
        <div style={{ background: CARD }}>
          {criteria.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3 px-5 py-3.5"
              style={{ borderBottom: i < criteria.length - 1 ? `1px solid ${BDR}` : undefined }}>
              {c.passed
                ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: GRN }} />
                : <XCircle     className="w-4 h-4 flex-shrink-0" style={{ color: RED }} />}
              <p className="text-sm flex-1" style={{ color: c.passed ? T1 : T2 }}>{c.label}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: c.passed ? `${GRN}18` : `${RED}18`, color: c.passed ? GRN : RED }}>
                {c.passed ? 'PASS' : 'PENDING'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Declare button */}
      {!declared && (
        <div className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: allPassed ? `${GRN}0a` : `${AMB}0a`, border: `1px solid ${allPassed ? GRN : AMB}30` }}>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: T1 }}>
              {allPassed ? 'All 8 criteria passing — ready to declare!' : `${total - passed} criteria still pending`}
            </p>
            <p className="text-xs mt-0.5" style={{ color: T2 }}>
              {allPassed
                ? 'Declaring v1.0.0 will emit a PLATFORM_MILESTONE KIMMP signal and lock this version in the system config.'
                : 'Complete the remaining criteria before declaring v1.0.0.'}
            </p>
          </div>
          <button
            onClick={() => declareMut.mutate()}
            disabled={!allPassed || declareMut.isPending}
            className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-2xl flex-shrink-0"
            style={{
              background: allPassed ? GRN : `${AMB}40`,
              color: allPassed ? '#fff' : AMB,
              cursor: allPassed ? 'pointer' : 'not-allowed',
            }}>
            <Zap className="w-4 h-4" />
            {declareMut.isPending ? 'Declaring…' : 'Declare v1.0.0'}
          </button>
        </div>
      )}

      {declared && declaration && (
        <div className="rounded-2xl p-5" style={{ background: `${GRN}08`, border: `1px solid ${GRN}25` }}>
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5" style={{ color: GRN }} />
            <p className="text-base font-black" style={{ color: GRN }}>Kangqore Platform v{declaration.version} — Officially Declared</p>
          </div>
          <p className="text-xs" style={{ color: T2 }}>
            Declared {new Date(declaration.declaredAt).toLocaleString('en-GB')} · All {total}/{total} Gate 9 criteria passed
          </p>
        </div>
      )}

      {/* Chapter 9 Brief */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: T1 }}>Chapter 9 — What Comes Next</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${PURP}18`, color: PURP }}>Market Expansion</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CHAPTER9_TRACKS.map(track => {
            const meta  = STATUS_META[track.status]
            return (
              <div key={track.id} className="rounded-2xl p-4 space-y-2"
                style={{ background: `${track.color}08`, border: `1px solid ${track.color}25` }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <track.icon className="w-4 h-4 flex-shrink-0" style={{ color: track.color }} />
                    <p className="text-xs font-black" style={{ color: track.color }}>{track.title}</p>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${meta.color}18`, color: meta.color }}>{meta.label}</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: T2 }}>{track.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
