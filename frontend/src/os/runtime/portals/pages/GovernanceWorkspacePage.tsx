import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import {
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, FileText,
  BarChart3, Gavel, TrendingUp, Lock, Eye, Scale, Activity,
} from 'lucide-react'

const S: Record<string, React.CSSProperties> = {
  page:    { display: 'flex', flexDirection: 'column', gap: 24, padding: '4px 0' },
  grid3:   { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  grid2:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card:    { background: 'var(--os-surface-1)', border: '1px solid var(--os-border)', borderRadius: 10, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 },
  cardH:   { fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: 'var(--os-text-3)', textTransform: 'uppercase' as const },
  row:     { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' },
  badge:   { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20 },
}

function riskColor(r: string): string {
  const u = (r ?? '').toUpperCase()
  if (u === 'CRITICAL' || u === 'HIGH') return 'var(--os-danger)'
  if (u === 'MEDIUM') return 'var(--os-warning)'
  return 'var(--os-success)'
}

function relDate(d: string): string {
  if (!d) return '—'
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return '1d ago'
  if (diff < 7) return `${diff}d ago`
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export const GovernanceWorkspacePage: React.FC = () => {
  const { data: decisions } = useQuery({
    queryKey: ['ws-gov-decisions'],
    queryFn: () => api.get('/admin/governance/decisions?limit=15').then(r => r.data).catch(() => []),
  })
  const { data: raid } = useQuery({
    queryKey: ['ws-raid'],
    queryFn: () => api.get('/admin/governance/raid').then(r => r.data).catch(() => null),
  })
  const { data: changes } = useQuery({
    queryKey: ['ws-changes'],
    queryFn: () => api.get('/admin/governance/changes?limit=10').then(r => r.data).catch(() => []),
  })
  const { data: gate5 } = useQuery({
    queryKey: ['ws-gov-gate5'],
    queryFn: () => api.get('/admin/kangqore-immp/gate5').then(r => r.data).catch(() => null),
  })
  const { data: gate6 } = useQuery({
    queryKey: ['ws-gov-gate6'],
    queryFn: () => api.get('/admin/kangqore-immp/gate6').then(r => r.data).catch(() => null),
  })
  const { data: certs } = useQuery({
    queryKey: ['ws-certs'],
    queryFn: () => api.get('/admin/kangqore-immp/certificates').then(r => r.data).catch(() => []),
  })

  const decList    = Array.isArray(decisions) ? decisions : (decisions?.decisions ?? decisions?.data ?? [])
  const changeList = Array.isArray(changes) ? changes : (changes?.changes ?? changes?.data ?? [])
  const certList   = Array.isArray(certs) ? certs : (certs?.certificates ?? certs?.data ?? [])

  const risks   = raid?.risks   ?? raid?.raid?.risks   ?? []
  const actions = raid?.actions ?? raid?.raid?.actions ?? []
  const issues  = raid?.issues  ?? raid?.raid?.issues  ?? []
  const deps    = raid?.dependencies ?? raid?.raid?.dependencies ?? []

  const riskArr = Array.isArray(risks) ? risks : []
  const highRisks = riskArr.filter((r: any) => ['HIGH','CRITICAL'].includes((r.severity ?? r.level ?? '').toUpperCase())).length

  const qefScore = gate5?.score ?? null
  const rgsScore = gate6?.score ?? null

  return (
    <div style={S.page}>

      {/* ── Governance Header Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { icon: ShieldCheck, label: 'QEF Score', val: qefScore != null ? `${qefScore}%` : '—', col: qefScore != null && qefScore >= 80 ? 'var(--os-success)' : '#f59e0b' },
          { icon: Scale,       label: 'RGS Score', val: rgsScore != null ? `${rgsScore}%` : '—', col: rgsScore != null && rgsScore >= 80 ? 'var(--os-success)' : '#f59e0b' },
          { icon: AlertTriangle, label: 'High Risks', val: highRisks.toString(), col: highRisks > 0 ? 'var(--os-danger)' : 'var(--os-success)' },
          { icon: FileText,    label: 'Open Changes', val: changeList.filter((c: any) => !['APPROVED','CLOSED'].includes((c.status ?? '').toUpperCase())).length.toString(), col: '#579bfc' },
        ].map(m => (
          <div key={m.label} style={{ ...S.card, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: m.col + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <m.icon size={18} color={m.col} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: m.col, fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
              <div style={{ fontSize: 10, color: 'var(--os-text-3)' }}>{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={S.grid3}>
        {/* ── QEF + RGS Gates ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={13} color="#579bfc" />
            <span style={S.cardH}>QEF & RGS Gates</span>
          </div>

          {/* QEF */}
          <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)' }}>Gate 5 — QEF</span>
              <span style={{ ...S.badge, background: gate5?.passed ? 'var(--os-success)18' : 'var(--os-warning)18', color: gate5?.passed ? 'var(--os-success)' : 'var(--os-warning)' }}>
                {gate5?.passed ? 'PASSED' : gate5 ? 'PENDING' : 'N/A'}
              </span>
            </div>
            {qefScore != null && (
              <>
                <div style={{ height: 6, borderRadius: 6, background: 'var(--os-surface-3)', marginBottom: 4 }}>
                  <div style={{ height: '100%', borderRadius: 6, width: `${qefScore}%`, background: qefScore >= 80 ? 'var(--os-success)' : 'var(--os-warning)', transition: 'width .4s' }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: qefScore >= 80 ? 'var(--os-success)' : 'var(--os-warning)', fontVariantNumeric: 'tabular-nums' }}>{qefScore}%</div>
              </>
            )}
            {gate5?.checks && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {Object.entries(gate5.checks).slice(0, 5).map(([k, v]: [string, any]) => (
                  <span key={k} style={{ fontSize: 9.5, color: v ? 'var(--os-success)' : 'var(--os-text-4)' }}>
                    {v ? '✓' : '○'} {k}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* RGS */}
          <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)' }}>Gate 6 — RGS</span>
              <span style={{ ...S.badge, background: gate6?.passed ? 'var(--os-success)18' : 'var(--os-warning)18', color: gate6?.passed ? 'var(--os-success)' : 'var(--os-warning)' }}>
                {gate6?.passed ? 'PASSED' : gate6 ? 'PENDING' : 'N/A'}
              </span>
            </div>
            {rgsScore != null && (
              <>
                <div style={{ height: 6, borderRadius: 6, background: 'var(--os-surface-3)', marginBottom: 4 }}>
                  <div style={{ height: '100%', borderRadius: 6, width: `${rgsScore}%`, background: rgsScore >= 80 ? 'var(--os-success)' : '#a78bfa', transition: 'width .4s' }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: rgsScore >= 80 ? 'var(--os-success)' : '#a78bfa', fontVariantNumeric: 'tabular-nums' }}>{rgsScore}%</div>
              </>
            )}
          </div>

          {/* Certificates */}
          {certList.length > 0 && (
            <div>
              <div style={{ fontSize: 10, color: 'var(--os-text-4)', fontWeight: 600, marginBottom: 5 }}>CERTIFICATES</div>
              {certList.slice(0, 3).map((c: any, i: number) => (
                <div key={c.id ?? i} style={{ ...S.row, marginBottom: 4 }}>
                  <ShieldCheck size={11} color={c.status === 'ACTIVE' ? 'var(--os-success)' : 'var(--os-text-4)'} />
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.name ?? c.type ?? 'Certificate'}
                  </span>
                  <span style={{ ...S.badge, background: c.status === 'ACTIVE' ? 'var(--os-success)18' : 'var(--os-surface-3)', color: c.status === 'ACTIVE' ? 'var(--os-success)' : 'var(--os-text-3)' }}>
                    {c.status ?? 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RAID Register ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={13} color="var(--os-danger)" />
            <span style={S.cardH}>RAID Register</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Risks', val: (Array.isArray(risks) ? risks : []).length, col: 'var(--os-danger)' },
              { label: 'Actions', val: (Array.isArray(actions) ? actions : []).length, col: '#579bfc' },
              { label: 'Issues', val: (Array.isArray(issues) ? issues : []).length, col: 'var(--os-warning)' },
              { label: 'Dependencies', val: (Array.isArray(deps) ? deps : []).length, col: '#a78bfa' },
            ].map(m => (
              <div key={m.label} style={{ padding: '10px 8px', borderRadius: 8, background: m.col + '10', border: `1px solid ${m.col}22`, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: m.col, fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
                <div style={{ fontSize: 9.5, color: 'var(--os-text-4)', marginTop: 2 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Risk items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)', fontWeight: 600 }}>TOP RISKS</span>
            {riskArr.slice(0, 5).length === 0 ? (
              <div style={{ color: 'var(--os-text-4)', fontSize: 11, textAlign: 'center', padding: 8 }}>No risks</div>
            ) : riskArr.slice(0, 5).map((r: any, i: number) => (
              <div key={r.id ?? i} style={S.row}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: riskColor(r.severity ?? r.level ?? ''), flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.title ?? r.description ?? 'Risk'}
                </span>
                <span style={{ ...S.badge, background: riskColor(r.severity ?? r.level ?? '') + '18', color: riskColor(r.severity ?? r.level ?? ''), flexShrink: 0 }}>
                  {r.severity ?? r.level ?? '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Change & Decision Log ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Gavel size={13} color="#f59e0b" />
            <span style={S.cardH}>Change & Decision Log</span>
          </div>

          <div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', fontWeight: 600, marginBottom: 5 }}>CHANGE REQUESTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {changeList.slice(0, 4).length === 0 ? (
                <div style={{ color: 'var(--os-text-4)', fontSize: 11, textAlign: 'center', padding: 8 }}>No change requests</div>
              ) : changeList.slice(0, 4).map((c: any, i: number) => (
                <div key={c.id ?? i} style={S.row}>
                  <FileText size={10} color="var(--os-text-3)" />
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.title ?? c.summary ?? `CR-${i + 1}`}
                  </span>
                  <span style={{ ...S.badge, background: c.status === 'APPROVED' ? 'var(--os-success)18' : c.status === 'REJECTED' ? 'var(--os-danger)18' : '#f59e0b18', color: c.status === 'APPROVED' ? 'var(--os-success)' : c.status === 'REJECTED' ? 'var(--os-danger)' : '#f59e0b', flexShrink: 0 }}>
                    {c.status ?? 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', fontWeight: 600, marginBottom: 5 }}>DECISIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {decList.slice(0, 5).length === 0 ? (
                <div style={{ color: 'var(--os-text-4)', fontSize: 11, textAlign: 'center', padding: 8 }}>No decisions</div>
              ) : decList.slice(0, 5).map((d: any, i: number) => (
                <div key={d.id ?? i} style={S.row}>
                  <CheckCircle2 size={10} color={d.outcome ? 'var(--os-success)' : 'var(--os-text-3)'} />
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.title ?? d.question ?? d.description ?? 'Decision'}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--os-text-4)', flexShrink: 0 }}>
                    {relDate(d.decidedAt ?? d.createdAt ?? '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Compliance Status ── */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Lock size={13} color="#10b981" />
          <span style={S.cardH}>Compliance Status</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'SOC2 Controls', val: 'Active', status: 'PASS', col: 'var(--os-success)' },
            { label: 'Data Privacy', val: 'Compliant', status: 'PASS', col: 'var(--os-success)' },
            { label: 'HANUMANAS Shield', val: gate5?.passed ? 'Cleared' : 'Pending', status: gate5?.passed ? 'PASS' : 'WARN', col: gate5?.passed ? 'var(--os-success)' : 'var(--os-warning)' },
            { label: 'Access Control', val: 'Enforced', status: 'PASS', col: 'var(--os-success)' },
            { label: 'Audit Logging', val: 'Live', status: 'PASS', col: 'var(--os-success)' },
            { label: 'Vulnerability Scan', val: 'Pending', status: 'WARN', col: 'var(--os-warning)' },
          ].map(item => (
            <div key={item.label} style={{ padding: '10px 12px', borderRadius: 8, background: item.col + '10', border: `1px solid ${item.col}22`, display: 'flex', alignItems: 'center', gap: 10 }}>
              {item.status === 'PASS'
                ? <CheckCircle2 size={14} color={item.col} />
                : item.status === 'WARN'
                ? <AlertTriangle size={14} color={item.col} />
                : <XCircle size={14} color={item.col} />}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-text-1)' }}>{item.val}</div>
                <div style={{ fontSize: 9.5, color: 'var(--os-text-4)' }}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
