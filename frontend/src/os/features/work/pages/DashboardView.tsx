// The executive dashboard, grouped by the question each panel answers.
//
// Executives do not want 47 boards; they want to know what is happening, why,
// what it means, and what to do. So panels are grouped by those four questions
// rather than by widget type, and the grouping is the layout.
//
// The rule the screen is built around: an empty panel states why it is empty.
// A confident zero on an executive screen is worse than an admission that the
// graph is quiet, because someone acts on the first.

import { useQuery } from '@tanstack/react-query'
import { Loader2, AlertTriangle, Info, TrendingDown, Activity } from 'lucide-react'
import { api } from '@lib/api'

const T1 = 'var(--os-text-1)'
const T2 = 'var(--os-text-2)'
const BDR = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'

const QUESTIONS: { id: string; label: string; sub: string }[] = [
  { id: 'WHAT',     label: 'What is happening',  sub: 'The state of the work right now' },
  { id: 'WHY',      label: 'Why',                sub: 'What the intelligence layer found, and on what evidence' },
  { id: 'SO_WHAT',  label: 'What it means',      sub: 'The value at stake, priced from real contracts and budgets' },
  { id: 'NOW_WHAT', label: 'What to do',         sub: 'Where the load sits, and what has actually changed' },
]

const money = (n: number) => '£' + n.toLocaleString('en-GB', { maximumFractionDigits: 0 })

export function DashboardView() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'executive'],
    queryFn: () => api.get('/admin/work-os/dashboards/executive').then(r => r.data),
    refetchInterval: 60_000,
  })

  if (isLoading) return <Loading label="Resolving panels…" />
  if (error) return <ErrorText err={error} />

  const panels = data?.panels ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
      <p style={{ margin: 0, fontSize: 13, color: T2, maxWidth: 660, lineHeight: 1.6 }}>
        {data?.dashboard?.description}{' '}
        Every figure is resolved when this page loads — no panel stores a number,
        so none of them can be stale.
      </p>

      {QUESTIONS.map(q => {
        const group = panels.filter((p: any) => p.question === q.id)
        if (!group.length) return null
        return (
          <div key={q.id}>
            <div style={{ marginBottom: 11 }}>
              <div style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em',
                color: T2, fontWeight: 650,
              }}>{q.label}</div>
              <div style={{ fontSize: 11.5, color: T2, marginTop: 2 }}>{q.sub}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 12 }}>
              {group.map((p: any) => (
                <div key={p.key} style={{ gridColumn: `span ${Math.min(p.span, 12)}` }}>
                  <Panel p={p} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Panel({ p }: { p: any }) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${BDR}`, borderRadius: 10,
      padding: 15, height: '100%', minWidth: 0,
    }}>
      <div style={{ fontSize: 12.5, color: T2, fontWeight: 550, marginBottom: 11 }}>{p.title}</div>

      {p.error ? (
        <Note tone="#ef4444" icon={<AlertTriangle size={13} />} text={p.error} />
      ) : p.empty ? (
        // The honest state, and deliberately not a zero.
        <Note tone={T2} icon={<Info size={13} />} text={p.empty} />
      ) : (
        <Body p={p} />
      )}
    </div>
  )
}

function Body({ p }: { p: any }) {
  const d = p.data
  if (!d) return <Note tone={T2} icon={<Info size={13} />} text="Nothing returned." />

  switch (p.render) {
    case 'stat':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: 14 }}>
          {Object.entries(d).map(([k, v]) => (
            <div key={k}>
              <div style={{
                fontSize: 21, fontWeight: 650, color: statTone(k, v as any),
                fontVariantNumeric: 'tabular-nums',
              }}>{String(v)}</div>
              <div style={{ fontSize: 10.5, color: T2, textTransform: 'capitalize' }}>
                {k.replace(/([A-Z])/g, ' $1')}
              </div>
            </div>
          ))}
        </div>
      )

    case 'breakdown': {
      const entries: [string, number][] = d.entries ?? d.byType?.map((t: any) => [t.name, t.count]) ?? []
      // Parenthesised: `??` and `||` cannot be mixed unparenthesised, and the
      // fallback of 1 exists only to keep the bar widths from dividing by zero.
      const total = (d.total ?? entries.reduce((s, [, n]) => s + n, 0)) || 1
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {d.declared !== undefined && (
            <div style={{ fontSize: 11.5, color: T2, marginBottom: 3 }}>
              {d.populated} of {d.declared} types populated · {d.objects} objects
            </div>
          )}
          {entries.slice(0, 8).map(([k, n]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ fontSize: 11.5, color: T1, minWidth: 116 }}>
                {k.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())}
              </span>
              <span style={{ flex: 1, height: 5, background: SURF, borderRadius: 3, overflow: 'hidden' }}>
                <span style={{ display: 'block', width: `${(n / total) * 100}%`, height: '100%', background: '#2564ea' }} />
              </span>
              <span style={{ fontSize: 11.5, color: T2, fontVariantNumeric: 'tabular-nums', minWidth: 22, textAlign: 'right' }}>{n}</span>
            </div>
          ))}
        </div>
      )
    }

    case 'list': {
      const items = d.items ?? d.buckets ?? []
      if (!items.length) return <Note tone={T2} icon={<Info size={13} />} text="Nothing to list." />
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {d.unassigned > 0 && (
            <div style={{ fontSize: 11.5, color: '#f59e0b' }}>
              {d.unassigned} of {d.totalOpen} open items have no owner
            </div>
          )}
          {items.slice(0, 6).map((i: any, n: number) => (
            <div key={i.id ?? n} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
              <span style={{ fontSize: 12.5, color: T1, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {i.title ?? (i.assigneeId ?? 'Unassigned')}
              </span>
              {i.predictedRisk != null && (
                <span style={{ fontSize: 11.5, color: i.predictedRisk >= 0.5 ? '#ef4444' : '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>
                  {Math.round(i.predictedRisk * 100)}%
                </span>
              )}
              {i.open != null && <span style={{ fontSize: 11.5, color: T2 }}>{i.open} open</span>}
              {i.dueDate && (
                <span style={{ fontSize: 11, color: T2 }}>{new Date(i.dueDate).toLocaleDateString()}</span>
              )}
            </div>
          ))}
          {d.scored != null && (
            <div style={{ fontSize: 11, color: T2, marginTop: 2 }}>{d.scored} of {d.total} scored</div>
          )}
        </div>
      )
    }

    case 'exposure':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 27, fontWeight: 650, color: d.exposure?.quantified > 0 ? '#ef4444' : T2, fontVariantNumeric: 'tabular-nums' }}>
              {d.exposure?.quantified > 0 ? money(d.exposure.quantified) : '—'}
            </span>
            <span style={{ fontSize: 12, color: T2 }}>
              against {d.target?.title} · {Math.round((d.confidence ?? 0) * 100)}% confidence
            </span>
          </div>

          {d.caveat && (
            <Note tone="#f59e0b" icon={<AlertTriangle size={13} />} text={d.caveat} />
          )}

          {d.threats?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {d.threats.map((t: any) => (
                <div key={t.objectId} style={{ display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 12.5 }}>
                  <TrendingDown size={12} style={{ color: '#ef4444', flexShrink: 0 }} />
                  <span style={{ color: T1, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                  <span style={{ color: T2, fontVariantNumeric: 'tabular-nums' }}>
                    {t.exposure != null ? money(t.exposure) : 'unpriced'}
                  </span>
                  <span style={{ color: '#ef4444', fontVariantNumeric: 'tabular-nums' }}>{Math.round(t.predictedRisk * 100)}%</span>
                </div>
              ))}
            </div>
          )}

          {d.actions?.length > 0 && (
            <div style={{ borderTop: `1px solid ${BDR}`, paddingTop: 10 }}>
              <div style={{ fontSize: 11, color: T2, marginBottom: 5 }}>Recommended</div>
              {d.actions.map((a: any) => (
                <div key={a.rank} style={{ fontSize: 12, color: T1, padding: '2px 0' }}>
                  {a.rank}. {a.action} — <span style={{ color: T2 }}>{a.targetTitle}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )

    case 'timeline':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ display: 'flex', gap: 16, fontSize: 12.5 }}>
            <Metric label="objects" value={d.objects} />
            <Metric label="actions" value={d.actions} tone={d.actions === 0 ? T2 : '#10b981'} />
            <Metric label="comments" value={d.comments} />
          </div>
          {d.busiest?.length > 0 ? (
            <div style={{ marginTop: 4 }}>
              {d.busiest.slice(0, 5).map((b: any) => (
                <div key={b.objectId} style={{ display: 'flex', gap: 10, fontSize: 12, padding: '2px 0' }}>
                  <Activity size={11} style={{ color: T2, flexShrink: 0, marginTop: 3 }} />
                  <span style={{ color: T1, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</span>
                  <span style={{ color: T2 }}>{b.actions}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 11.5, color: T2 }}>
              No governed action has run in this window.
            </div>
          )}
        </div>
      )

    default:
      return <pre style={{ fontSize: 11, color: T2, margin: 0, overflow: 'auto' }}>{JSON.stringify(d, null, 1).slice(0, 400)}</pre>
  }
}

function statTone(k: string, v: any) {
  if (typeof v !== 'number' || v === 0) return T1
  if (/blocked|overdue|escalated/i.test(k)) return '#ef4444'
  if (/atRisk/i.test(k)) return '#f59e0b'
  if (/done|completed/i.test(k)) return '#10b981'
  return T1
}

function Metric({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <span>
      <span style={{ fontSize: 16, fontWeight: 620, color: tone ?? T1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ fontSize: 11, color: T2, marginLeft: 5 }}>{label}</span>
    </span>
  )
}

function Note({ tone, icon, text }: { tone: string; icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: tone, lineHeight: 1.5 }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ color: tone === T2 ? T2 : tone }}>{text}</span>
    </div>
  )
}

function Loading({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'center', color: T2, fontSize: 13, padding: 16 }}>
      <Loader2 size={15} className="animate-spin" /> {label}
    </div>
  )
}

function ErrorText({ err }: { err: any }) {
  const msg = (err as any)?.response?.data?.error ?? (err as any)?.message ?? 'Something went wrong'
  return (
    <div style={{ fontSize: 12.5, color: '#ef4444', display: 'flex', gap: 7, alignItems: 'center' }}>
      <AlertTriangle size={14} /> {msg}
    </div>
  )
}
