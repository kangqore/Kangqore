import { useState } from 'react'

// S303 — lightweight SVG sparkline, no chart library. Native <title> gives a
// hover tooltip per point for free; clicking opens a larger inline view for
// "zoom" without a separate zoom/pan engine.

export interface SeriesPoint { timestamp: string; value: number; unit?: string | null }

function Trace({ data, width, height, color, strokeWidth = 1.5, showDots = false }: {
  data: SeriesPoint[]; width: number; height: number; color: string; strokeWidth?: number; showDots?: boolean
}) {
  const values = data.map(d => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const coords = data.map((d, i) => ({
    x: data.length > 1 ? (i / (data.length - 1)) * width : width / 2,
    y: height - ((d.value - min) / range) * (height - 6) - 3,
  }))
  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ')

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
      {showDots && coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={3} fill={color}>
          <title>{data[i].value}{data[i].unit ? ` ${data[i].unit}` : ''} — {new Date(data[i].timestamp).toLocaleString()}</title>
        </circle>
      ))}
    </svg>
  )
}

export function Sparkline({ data, color = '#579bfc', width = 120, height = 28, expandable = true }: {
  data: SeriesPoint[]; color?: string; width?: number; height?: number; expandable?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  if (data.length < 2) return <span style={{ fontSize: 10, color: 'var(--os-text-2)' }}>Not enough data yet</span>

  const last = data[data.length - 1]
  const first = data[0]
  const delta = last.value - first.value
  const trendColor = delta > 0 ? '#10b981' : delta < 0 ? '#ef4444' : color

  return (
    <>
      <div
        onClick={() => expandable && setExpanded(true)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: expandable ? 'zoom-in' : 'default' }}
        title={expandable ? 'Click to zoom' : undefined}
      >
        <Trace data={data} width={width} height={height} color={trendColor} />
        <span style={{ fontSize: 10, fontWeight: 700, color: trendColor }}>
          {last.value}{last.unit ? ` ${last.unit}` : ''}
        </span>
      </div>
      {expanded && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => e.target === e.currentTarget && setExpanded(false)}
        >
          <div style={{ background: 'var(--os-card)', border: '1px solid var(--os-border)', borderRadius: 16, padding: 20, width: 420 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text-1)' }}>
                {data.length} points · {first.value} → {last.value}{last.unit ? ` ${last.unit}` : ''}
              </span>
              <button onClick={() => setExpanded(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--os-text-2)' }}>✕</button>
            </div>
            <Trace data={data} width={380} height={140} color={trendColor} strokeWidth={2} showDots />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontSize: 9, color: 'var(--os-text-2)' }}>{new Date(first.timestamp).toLocaleDateString()}</span>
              <span style={{ fontSize: 9, color: 'var(--os-text-2)' }}>{new Date(last.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
