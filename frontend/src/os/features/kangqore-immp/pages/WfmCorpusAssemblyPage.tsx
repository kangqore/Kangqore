import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import { CheckCircle2, Zap } from 'lucide-react'

const GREEN = '#10b981', BLUE = '#4fc3f7', AMBER = '#f59e0b', PURPLE = '#a78bfa'
const STATUS_COLOR: Record<string, string> = { INGESTED: GREEN, GENERATED: PURPLE }

export function WfmCorpusAssemblyPage() {
  const q = useQuery({ queryKey: ['wfm-corpus-assembly'], queryFn: () => api.get('/admin/kangqore-immp/platform/wfm-corpus-assembly').then(r => r.data), staleTime: 60_000 })
  const d = q.data

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>S283 · Chapter 12 T4 — WAANDA-FM Alpha</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>WAANDA-FM Corpus Assembly — {((d?.totalRecords ?? 70_000_000) / 1e6).toFixed(0)}M Records · {((d?.totalTokens ?? 29_400_000_000) / 1e12).toFixed(1)}T Tokens</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>{d?.coverageYears ?? '2023–2026'} · {d?.uniqueSources ?? 8} sources · {d?.tokenizer?.name ?? 'WAANDA-Tok'} tokenizer ({(d?.tokenizer?.vocabSize ?? 128_000).toLocaleString()} vocab)</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Records',    value: `${((d?.totalRecords ?? 70_000_000) / 1e6).toFixed(0)}M`,          color: PURPLE },
          { label: 'Total Tokens',     value: `${((d?.totalTokens ?? 29_400_000_000) / 1e12).toFixed(1)}T`,      color: BLUE   },
          { label: 'Vocab Size',       value: `${((d?.tokenizer?.vocabSize ?? 128_000) / 1000).toFixed(0)}K`,    color: GREEN  },
          { label: 'Dedup Rate',       value: `${Math.round((d?.qualityGate?.deduplicationRate ?? 0.94) * 100)}%`, color: AMBER },
        ].map(s => (
          <div key={s.label} style={{ background: '#1a2235', border: `1px solid ${s.color}25`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#8899aa', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {(d?.sources ?? []).map((src: any, i: number) => {
          const sc = STATUS_COLOR[src.status] ?? AMBER
          return (
            <div key={src.source} style={{ background: '#1a2235', border: `1px solid ${sc}18`, borderRadius: 12, padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              {src.status === 'INGESTED' ? <CheckCircle2 size={14} color={sc} style={{ flexShrink: 0 }} /> : <Zap size={14} color={sc} style={{ flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#ccdde0', marginBottom: 2 }}>{src.source}</div>
                <div style={{ fontSize: 10, color: '#8899aa' }}>{src.years} · {src.type}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: sc, fontVariantNumeric: 'tabular-nums' }}>{(src.records / 1e6).toFixed(1)}M</div>
                <div style={{ fontSize: 9, color: '#4a5568' }}>records</div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: `${sc}18`, color: sc }}>{src.status}</span>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { label: 'Deduplication', value: `${Math.round((d?.qualityGate?.deduplicationRate ?? 0.94) * 100)}% clean`, color: GREEN },
          { label: 'Toxicity Filter', value: `${((d?.qualityGate?.toxicityFilter ?? 0.0002) * 100).toFixed(2)}% removed`, color: AMBER },
          { label: 'Privacy Redaction', value: d?.qualityGate?.privacyRedaction ? 'PII redacted' : 'Not applied', color: BLUE },
        ].map(m => (
          <div key={m.label} style={{ background: `${m.color}08`, border: `1px solid ${m.color}22`, borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 10, color: '#8899aa', marginTop: 3 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
