import { useState, useEffect, useRef, useCallback, useMemo, Component } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react'
import { api } from '@lib/api'
import { getSocket } from '@lib/socket'
import { useKIMMPStore, KIMMP_MOCK } from '@store/kimmp'
import { useSignalStream, type LiveSignal } from '@lib/useSignalStream'

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = '#2bbdff'   // Stark Electric Blue
const CG = '#0066ff'  // Stark Mid-Blue
const CR = '#ff3333'  // Critical Red
const CA = '#003388'  // Stark Deep Blue

// ─── Scout signal type icons ──────────────────────────────────────────────────
const SCOUT_ICONS: Record<string, string> = {
  COMPETITOR_MOVE:         '⚔',
  MARKET_SHIFT:            '◈',
  TENDER_FOUND:            '◉',
  PARTNERSHIP_OPPORTUNITY: '⟳',
  REGULATION_CHANGE:       '⚖',
  TECH_BREAKTHROUGH:       '⚡',
  CORRELATION_DETECTED:    '◇',
}

// ─── Level System ─────────────────────────────────────────────────────────────
const LEVEL_COLORS: Record<number, string> = { 0: '#3a6a5a', 1: CG, 2: C, 3: CA, 4: CR }
const LEVEL_LABELS: Record<number, string>  = { 0: 'L0 READ', 1: 'L1 SUGGEST', 2: 'L2 DRAFT', 3: 'L3 APPROVAL', 4: 'L4 AUTO' }
function LevelBadge({ level }: { level: number }) {
  const col = LEVEL_COLORS[level] ?? CA
  return (
    <span style={{
      fontSize: 7, fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.08em',
      padding: '1px 5px', borderRadius: 3, border: `1px solid ${col}50`,
      background: `${col}15`, color: col,
    }}>
      {LEVEL_LABELS[level] ?? `L${level}`}
    </span>
  )
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i) }, [])
  return t
}
function useUptime() {
  const s0 = useRef(Date.now())
  const [s, setS] = useState(0)
  useEffect(() => { const i = setInterval(() => setS(Math.floor((Date.now() - s0.current) / 1000)), 1000); return () => clearInterval(i) }, [])
  return `${String(Math.floor(s / 3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
}
function useTicker(base: number, v = 0.015) {
  const [val, setVal] = useState(base)
  useEffect(() => {
    const i = setInterval(() => setVal(x => Math.max(0, +(x + (Math.random()-.5)*2*v*base).toFixed(2))), 3000 + Math.random()*2000)
    return () => clearInterval(i)
  }, [base, v])
  return val
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  return `${Math.floor(s/3600)}h ago`
}

function getModuleDeg(sourceModule: string): number | null {
  const m = sourceModule.toLowerCase()
  if (m.includes('eqore') || m.includes('intent') || m.includes('opport')) return 0
  if (m.includes('lead')  || m.includes('revenue') || m.includes('conver')) return 36
  if (m.includes('alis')  || m.includes('market')  || m.includes('demand')) return 72
  if (m.includes('vis')   || m.includes('content') || m.includes('gap'))    return 108
  if (m.includes('kimmp') || m.includes('intel'))                            return 144
  return null
}

// ─── SVG helpers ──────────────────────────────────────────────────────────────
const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: cx + r * Math.cos((deg - 90) * Math.PI / 180),
  y: cy + r * Math.sin((deg - 90) * Math.PI / 180),
})

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polar(cx, cy, r, startDeg)
  const e = polar(cx, cy, r, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
}
// Counter-clockwise arc — used for bottom-half modules so textPath reads L→R from outside
function arcPathCCW(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polar(cx, cy, r, endDeg)
  const e = polar(cx, cy, r, startDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`
}

function arcWedgePath(cx: number, cy: number, rInner: number, rOuter: number, startDeg: number, endDeg: number) {
  const p1 = polar(cx, cy, rInner, startDeg)
  const p2 = polar(cx, cy, rOuter, startDeg)
  const p3 = polar(cx, cy, rOuter, endDeg)
  const p4 = polar(cx, cy, rInner, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${rInner} ${rInner} 0 ${large} 0 ${p1.x} ${p1.y} Z`
}

// ─── Radial Gauge ─────────────────────────────────────────────────────────────
function Gauge({ value, max = 100, label, sub = '', color = C, size = 140 }: {
  value: number; max?: number; label: string; sub?: string; color?: string; size?: number
}) {
  const r = size * 0.36
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  const dash = circ * 0.75
  const offset = dash - pct * dash
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block mx-auto">
      <defs>
        <filter id={`glow-${label}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* tick marks */}
      {Array.from({length: 60}, (_,i) => {
        const a = -135 + i * 4.5
        const rOuter = r + 10; const rInner = r + (i % 5 === 0 ? 5 : 7)
        const p1 = polar(size/2, size/2, rInner, a); const p2 = polar(size/2, size/2, rOuter, a)
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke={i%5===0 ? `${color}80` : `${color}25`} strokeWidth={i%5===0?1.5:0.8}/>
      })}
      {/* track */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}15`} strokeWidth={7}
        strokeDasharray={`${circ*0.75} ${circ*0.25}`} strokeLinecap="round"
        transform={`rotate(135 ${size/2} ${size/2})`} />
      {/* value arc */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(135 ${size/2} ${size/2})`}
        style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dashoffset 0.8s ease' }} />
      {/* inner glow circle */}
      <circle cx={size/2} cy={size/2} r={r-12} fill={`${color}06`} stroke={`${color}20`} strokeWidth={1} />
      {/* text */}
      <text x={size/2} y={size/2-4} textAnchor="middle" fill={color}
        fontSize={size*0.17} fontWeight="bold" fontFamily="monospace"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
        {value}{max !== 1 ? '%' : ''}
      </text>
      <text x={size/2} y={size/2+size*0.13} textAnchor="middle" fill={`${color}90`}
        fontSize={size*0.09} fontFamily="monospace" fontWeight="600">{label}</text>
      {sub && <text x={size/2} y={size/2+size*0.22} textAnchor="middle" fill={`${color}50`}
        fontSize={size*0.08} fontFamily="monospace">{sub}</text>}
    </svg>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────
function Panel({ title, color = C, children, onClick }: {
  title: string; color?: string; children: ReactNode; onClick?: () => void
}) {
  return (
    <div onClick={onClick} className={onClick ? 'cursor-pointer relative p-[1px] mb-3' : 'relative p-[1px] mb-3'}
      style={{
        background: `linear-gradient(135deg, ${color}60 0%, ${color}20 100%)`,
        clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
      }}
    >
      <div className="relative p-3 w-full h-full" style={{
        background: `linear-gradient(135deg, rgba(0,8,20,0.98) 0%, rgba(0,18,40,0.95) 100%)`,
        clipPath: 'polygon(11px 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%, 0 11px)',
      }}>
        {/* corner accents */}
        <div style={{ position:'absolute', top:0, left:11, width:30, height:2, background:color, boxShadow:`0 0 8px ${color}` }} />
        <div style={{ position:'absolute', top:11, left:0, width:2, height:30, background:color, boxShadow:`0 0 8px ${color}` }} />
        
        <div style={{ position:'absolute', bottom:0, right:11, width:30, height:2, background:color, boxShadow:`0 0 8px ${color}` }} />
        <div style={{ position:'absolute', bottom:11, right:0, width:2, height:30, background:color, boxShadow:`0 0 8px ${color}` }} />

        {/* Scanlines background pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${color}05 3px, ${color}05 4px)`
        }} />

        {/* Title */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <div style={{ fontFamily:'monospace', fontSize:9, fontWeight:800, color:color, letterSpacing:'0.2em' }}>
              [{title.toUpperCase()}]
            </div>
            <div style={{ flex:1, height:1, background:`linear-gradient(90deg, ${color}40, transparent)` }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

function DataRow({ label, value, trend, color = C }: { label: string; value: string; trend?: string; color?: string }) {
  const up = trend?.startsWith('+')
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'4px 0', borderBottom:`1px solid rgba(0,212,255,0.06)` }}>
      <span style={{ fontSize:10, color:'#6aaac8', fontFamily:'monospace' }}>{label}</span>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ fontSize:11, fontWeight:'bold', color:'#c0dff0', fontFamily:'monospace' }}>{value}</span>
        {trend && <span style={{ fontSize:9, fontWeight:700, color: up ? CG : CR, fontFamily:'monospace' }}>{trend}</span>}
      </div>
    </div>
  )
}

// ─── Error Boundary ───────────────────────────────────────────────────────────
class HUDBoundary extends Component<{ children: ReactNode; label: string }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  render() {
    if (this.state.err) return (
      <div style={{ padding:'8px 10px', border:`1px solid ${CR}30`, borderRadius:6, background:`${CR}05` }}>
        <span style={{ fontSize:8, color:CR, fontFamily:'monospace', letterSpacing:'0.1em' }}>
          {this.props.label} — PANEL UNAVAILABLE
        </span>
      </div>
    )
    return this.props.children
  }
}

// ─── Central HUD SVG ──────────────────────────────────────────────────────────
function WaandaGUI({ confidence, health, analytics, sweep, insights, lastSignal, criticalAlert, bootPhase, kpis, userRole }: {
  confidence: number; health: number; analytics: any; sweep: number; insights: any[]
  lastSignal: LiveSignal | null; criticalAlert: LiveSignal | null; bootPhase: number; kpis: any; userRole: string
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [flowKey, setFlowKey] = useState<{deg:number; key:number} | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTilt({
      x: ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8,
      y: ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) *  8,
    })
  }
  const handleTiltEnd = () => setTilt({ x: 0, y: 0 })

  const W = 520, H = 520, cx = 260, cy = 260

  // Trigger data-flow line when a new signal arrives
  useEffect(() => {
    if (!lastSignal) return
    const deg = getModuleDeg(lastSignal.sourceModule)
    if (deg === null) return
    setFlowKey({ deg, key: Date.now() })
    const t = setTimeout(() => setFlowKey(null), 2200)
    return () => clearTimeout(t)
  }, [lastSignal])

  // Ambient particle positions — stable across renders
  const particles = useMemo(() =>
    Array.from({ length: 36 }, (_, i) => {
      const angle = (i / 36) * 360
      const dist  = 50 + (i % 5) * 22
      return { ...polar(cx, cy, dist, angle), dur: 2 + (i % 4) * 0.9, delay: (i * 0.18) % 4, key: i }
    })
  , [])

  const srcPct = (keys: string[], fallback = 38) => {
    const matched = insights.filter((i: any) =>
      keys.some(k =>
        (i.module   ?? '').toLowerCase().includes(k) ||
        (i.category ?? '').toLowerCase().includes(k) ||
        (i.type     ?? '').toLowerCase().includes(k)
      )
    )
    if (!matched.length) return fallback
    const avg = matched.reduce((a: number, x: any) => a + (x.confidence ?? 70), 0) / matched.length
    return Math.min(95, Math.round(avg))
  }

  // 10 modules × 36° each — arc span 26° (±13°), 10° gap between segments
  const modules = [
    { label:'eQORE',    line2:'',             deg:0,   pct: srcPct(['eqore','intent','opportunity'], 72), color:CG, desc:'INTENT_DETECTED', roles:['ADMIN'] },
    { label:'LEAD',     line2:'INTELLIGENCE', deg:36,  pct: srcPct(['lead','revenue','conversion'],  65), color:C,  desc:'LEAD_SCORE_JUMP', roles:['ADMIN'] },
    { label:'KANGQORE', line2:'ALIS',         deg:72,  pct: srcPct(['alis','market','demand'],        58), color:C,  desc:'DEMAND_SPIKE',    roles:['ADMIN'] },
    { label:'KANGQORE', line2:'VIS',          deg:108, pct: srcPct(['vis','content','gap'],           44), color:CG, desc:'CONTENT_GAP',     roles:['ADMIN'] },
    { label:'KANGQORE', line2:'VIEW',         deg:144, pct: confidence,                                    color:C,  desc:'INTELLIGENCE',    roles:['ADMIN'] },
    { label:'REVENUE',  line2:'',             deg:180, pct: kpis?.mrrDeltaPct != null ? Math.min(99, Math.max(1, 50 + kpis.mrrDeltaPct)) : 82, color:CG, desc:'PERFORMANCE', roles:['ADMIN'] },
    { label:'FINANCE',  line2:'',             deg:216, pct: kpis?.totalBudget > 0 ? Math.min(99, Math.max(1, Math.round((1 - (kpis.totalSpend || 0) / kpis.totalBudget) * 60 + 40))) : 67, color:CA, desc:'METRICS', roles:['ADMIN', 'CLIENT'] },
    { label:'CLIENTS',  line2:'',             deg:252, pct: Math.min(99, Math.round(((analytics.clients || 0) / 50) * 100)), color:C, desc:'PORTFOLIO', roles:['ADMIN'] },
    { label:'OPS',      line2:'',             deg:288, pct: 88,                                            color:CA, desc:'EFFICIENCY',      roles:['ADMIN'] },
    { label:'PROJECTS', line2:'',             deg:324, pct: kpis?.onTimeProjectPct ?? 61,                  color:C,  desc:'PIPELINE',        roles:['ADMIN', 'CLIENT'] },
  ]
  const visibleModules = userRole === 'ADMIN' ? modules : modules.filter(m => m.roles.includes(userRole))

  return (
    <div style={{ perspective:'1200px', width:'100%', height:'100%' }}
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltEnd}
    >
    <svg width="100%" height="100%"
      viewBox="90 90 340 340"
      preserveAspectRatio="xMidYMid meet"
      style={{
        overflow:'visible', cursor:'crosshair',
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.6s ease' : 'transform 0.05s linear',
      }}>
      <defs>
        <radialGradient id="centerGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#001833" />
          <stop offset="100%" stopColor="#000812" />
        </radialGradient>
        <filter id="hglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="sglow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="sweepGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor={C} stopOpacity="0" />
          <stop offset="100%" stopColor={C} stopOpacity="0.18" />
        </radialGradient>
        {/* Invisible arc paths — used as rails for curved textPath labels */}
        {visibleModules.flatMap(({ deg, line2 }) => {
          const s = deg - 13, e = deg + 13
          const rev = deg >= 120 && deg <= 240
          const fn = rev ? arcPathCCW : arcPath
          const r1 = line2 ? 126 : 129
          const paths = [
            <path key={`lbl1-${deg}`} id={`lbl1-${deg}`} d={fn(cx, cy, r1, s, e)} fill="none" />
          ]
          if (line2) paths.push(<path key={`lbl2-${deg}`} id={`lbl2-${deg}`} d={fn(cx, cy, 132, s, e)} fill="none" />)
          return paths
        })}
      </defs>

      {/* ── Ambient particles ── */}
      {particles.map(p => (
        <circle key={p.key} cx={p.x} cy={p.y} r={0} fill={C}
          style={{ animation: `particlePop ${p.dur}s ${p.delay}s ease-in-out infinite` }} />
      ))}

      {/* ── Ring 0: Density Outer Ticks ── */}
      <circle cx={cx} cy={cy} r={134} fill="none" stroke={`${C}10`} strokeWidth={0.5} />
      {Array.from({length:360}, (_,i) => {
        const deg = i
        const major = deg % 10 === 0; const mid = deg % 5 === 0
        const rOut = 139, rIn = major ? 130 : mid ? 133 : 136
        if (!major && !mid && i%2!==0) return null // Skip some to create rhythmic density
        return <line key={i} x1={polar(cx,cy,rIn,deg).x} y1={polar(cx,cy,rIn,deg).y} 
          x2={polar(cx,cy,rOut,deg).x} y2={polar(cx,cy,rOut,deg).y}
          stroke={major ? `${C}90` : mid ? `${C}50` : `${C}20`}
          strokeWidth={major ? 1.5 : 0.5} filter={major ? 'url(#hglow)' : undefined} />
      })}

      {/* degree labels */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
        const p = polar(cx, cy, 124, deg)
        return <text key={deg} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          fill={`${C}60`} fontSize={7} fontFamily="monospace" letterSpacing="1px">{deg}°</text>
      })}

      {/* ── Ring 1: Fragmented Module sectors ── */}
      {visibleModules.map(({ label, line2, deg, pct, color }, idx) => {
        const isHovered = hovered === label + deg
        const isFaded = hovered !== null && hovered !== label + deg

        const arcStart = deg - 13, arcEnd = deg + 13
        const valEnd   = deg - 13 + (pct/100) * 26

        // Boot — each arc fades in staggered
        const booted = bootPhase >= 2
        const bootDelay = `${idx * 0.12}s`

        // Pulse — active module (matched last signal) pulses faster
        const isActive = lastSignal && getModuleDeg(lastSignal.sourceModule) === deg
        const isCriticalArc = criticalAlert && getModuleDeg(criticalAlert.sourceModule) === deg
        const arcColor = isCriticalArc ? CR : color

        return (
          <g key={label + deg}
             onMouseEnter={() => setHovered(label + deg)}
             onMouseLeave={() => setHovered(null)}
             style={{
               cursor: 'crosshair',
               opacity: !booted ? 0 : isFaded ? 0.15 : 1,
               transition: `opacity 0.5s ${bootDelay}, filter 0.3s`,
               animation: isCriticalArc ? 'critFlash 0.4s ease-in-out 12' : isActive ? 'arcPulseFast 0.8s ease-in-out infinite' : 'arcPulse 3s ease-in-out infinite',
               animationDelay: booted ? bootDelay : '0s',
             }}>
            {/* wide band background — the interactive arc wedge */}
            <path d={arcWedgePath(cx, cy, 102, 128, arcStart, arcEnd)} 
              fill={`${arcColor}10`} stroke={`${arcColor}30`} strokeWidth={1} />
            {/* fill arc — signal/activity level */}
            <path d={arcWedgePath(cx, cy, 102, 128, arcStart, valEnd)} 
              fill={arcColor} opacity={isHovered ? 0.9 : 0.4}
              style={{ filter:`drop-shadow(0 0 ${isHovered ? 15 : 4}px ${arcColor})`, transition:'all 0.3s' }} />
            {/* blip at fill endpoint */}
            {(() => {
              const p = polar(cx, cy, 115, valEnd)
              return <circle cx={p.x} cy={p.y} r={isHovered ? 3 : 2} fill="#4ab6d4"
                style={{ filter:'drop-shadow(0 0 6px #4ab6d4)', transition:'all 0.3s' }} />
            })()}
            {/* module name curved inside the bar */}
            <text fill="rgba(255,255,255,0.95)" fontSize={6.5}
              fontFamily="monospace" fontWeight="900" letterSpacing="0.12em"
              style={{ filter: isHovered ? 'drop-shadow(0 0 12px #4ab6d4)' : `drop-shadow(0 0 6px ${color})`, transition:'all 0.3s' }}>
              <textPath href={`#lbl1-${deg}`} startOffset="50%" textAnchor="middle">{label}</textPath>
            </text>
            {line2 && (
              <text fill="rgba(255,255,255,0.8)" fontSize={5.5}
                fontFamily="monospace" fontWeight="700" letterSpacing="0.08em"
                style={{ filter: isHovered ? 'drop-shadow(0 0 8px #4ab6d4)' : `drop-shadow(0 0 4px ${color})`, transition:'all 0.3s' }}>
                <textPath href={`#lbl2-${deg}`} startOffset="50%" textAnchor="middle">{line2}</textPath>
              </text>
            )}
          </g>
        )
      })}

      {/* ── Data flow line — fires on new signal ── */}
      {flowKey && (() => {
        const from = polar(cx, cy, 107, flowKey.deg)
        const severity = lastSignal?.severity
        const lc = severity === 'CRITICAL' ? CR : severity === 'HIGH' ? CA : C
        return (
          <line key={flowKey.key}
            x1={from.x} y1={from.y} x2={cx} y2={cy}
            stroke={lc} strokeWidth={1.5} strokeDasharray="220 220"
            style={{ animation:'flowLine 2.2s ease-out forwards', filter:`drop-shadow(0 0 6px ${lc})` }} />
        )
      })()}

      {/* ── Critical alert ring flash ── */}
      {criticalAlert && (
        <circle cx={cx} cy={cy} r={118} fill="none" stroke={CR} strokeWidth={3}
          style={{ animation:'critFlash 0.5s ease-in-out 8', filter:`drop-shadow(0 0 16px ${CR})` }} />
      )}

      {/* ── Technical Decor Strings ── */}
      <text x={cx-90} y={cy-90} fill={`${C}40`} fontSize={6} fontFamily="monospace">AX-993: {health.toFixed(2)}</text>
      <text x={cx+67} y={cy-90} fill={`${C}40`} fontSize={6} fontFamily="monospace">TX-R: {(confidence*1.4).toFixed(1)}</text>
      <text x={cx-90} y={cy+90} fill={`${C}40`} fontSize={6} fontFamily="monospace">MEM: 0x8F2A</text>
      <text x={cx+67} y={cy+90} fill={`${C}40`} fontSize={6} fontFamily="monospace">SYS: STABLE</text>

      {/* ── Ring 2: Core Reactor Assembly ── */}
      <g style={{ animation:'orbit-ccw 20s linear infinite', transformOrigin:`${cx}px ${cy}px` }}>
        {Array.from({length:360}, (_,i) => {
          if (i % 6 !== 0) return null
          const r1 = 88, r2 = i % 18 === 0 ? 94 : 91
          return <line key={i} x1={polar(cx,cy,r1,i).x} y1={polar(cx,cy,r1,i).y} x2={polar(cx,cy,r2,i).x} y2={polar(cx,cy,r2,i).y}
            stroke={`${C}80`} strokeWidth={1.5} />
        })}
      </g>
      <circle cx={cx} cy={cy} r={86} fill="none" stroke={`${C}40`} strokeWidth={2} />

      {/* ── Asymmetric Neural Schematic Overlay (Left Side) ── */}
      <g style={{ opacity: 0.6, pointerEvents: 'none' }}>
        <path d="M 80 180 L 140 180 L 160 220 L 140 260 L 80 260 Z" fill="none" stroke={`${C}30`} strokeWidth={1} />
        <path d="M 90 190 L 130 190 L 145 220 L 130 250 L 90 250 Z" fill="none" stroke={`${CG}50`} strokeWidth={0.5} />
        <circle cx={110} cy={220} r={4} fill={C} style={{ filter:`drop-shadow(0 0 8px ${C})` }} />
        <circle cx={145} cy={220} r={2} fill={CG} />
        <line x1={110} y1={220} x2={145} y2={220} stroke={`${C}60`} strokeWidth={1} strokeDasharray="2 2" />
        <line x1={110} y1={220} x2={130} y2={190} stroke={`${C}40`} strokeWidth={0.5} />
        <line x1={110} y1={220} x2={130} y2={250} stroke={`${C}40`} strokeWidth={0.5} />
        {/* Scrolling hex data next to schematic */}
        <text x={80} y={170} fill={`${C}80`} fontSize={5} fontFamily="monospace">NODE_ALPHA: ONLINE</text>
        <text x={80} y={270} fill={`${C}50`} fontSize={5} fontFamily="monospace">SYN: {confidence.toFixed(1)}%</text>
      </g>

      {/* ── Ring 3: inner highly structured dashes ── */}
      {Array.from({length:72}, (_,i) => {
        const deg = i * 5
        const p1 = polar(cx,cy,72,deg); const p2 = polar(cx,cy,78,deg)
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke={`${C}${i%3===0?'90':'40'}`} strokeWidth={i%3===0?2.5:1} />
      })}
      
      {/* rotating gear sub-ring */}
      <path d={Array.from({length: 12}).map((_,i) => arcWedgePath(cx,cy, 66, 70, i*30, i*30 + 15)).join(' ')} 
        fill={`${C}40`} style={{ animation:'orbit-cw 12s linear infinite', transformOrigin:`${cx}px ${cy}px` }} />

      {/* ── Complex Reactor rings ── */}
      <circle cx={cx} cy={cy} r={42} fill="url(#centerGrad)"
        stroke={`${C}80`} strokeWidth={2} style={{ filter:`drop-shadow(0 0 20px ${C}50)` }} />

      {/* 3 counter-rotating inner targeting reticles */}
      <circle cx={cx} cy={cy} r={38} fill="none" stroke={`${C}60`} strokeWidth={3}
        strokeDasharray="1 4 10 4" style={{ animation:'orbit-ccw 8s linear infinite', transformOrigin:`${cx}px ${cy}px` }} />

      <circle cx={cx} cy={cy} r={32} fill="none" stroke={`${C}90`} strokeWidth={1}
        strokeDasharray="2 4" style={{ animation:'orbit-cw 4s linear infinite', transformOrigin:`${cx}px ${cy}px` }} />

      <circle cx={cx} cy={cy} r={28} fill="none" stroke={`${C}ff`} strokeWidth={0.5}
        strokeDasharray="40 10 20 10" style={{ animation:'orbit-ccw 20s linear infinite', transformOrigin:`${cx}px ${cy}px` }} />

      {/* ── Dynamic Center Core ── */}
      <g style={{ opacity: hovered ? 0 : 1, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
        <circle cx={cx} cy={cy} r={16} fill={C} style={{ filter:`drop-shadow(0 0 15px ${C})`, animation:'arcPulse 2s infinite' }} opacity={0.3} />
        <image href="/assets/kangqore-icon-white.png" x={cx-14} y={cy-14} width={28} height={28}
          opacity={0.9} style={{ filter:`drop-shadow(0 0 8px ${C})` }} />
        <text x={cx} y={cy+56} textAnchor="middle" fill={C} fontSize={8} fontFamily="monospace" fontWeight="900" letterSpacing="0.1em" style={{ filter:`drop-shadow(0 0 4px ${C})` }}>
          {confidence}% CONF
        </text>
        <text x={cx} y={cy+66} textAnchor="middle" fill={`${C}80`} fontSize={6} fontFamily="monospace" letterSpacing="0.1em">
          SYS {health.toFixed(1)}%
        </text>
      </g>
      
      {/* Hovered Module Readout */}
      <g style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
        {hovered && (() => {
          const m = visibleModules.find(x => (x.label + x.deg) === hovered)
          if (!m) return null
          return (
            <g>
              <circle cx={cx} cy={cy} r={34} fill={`${m.color}15`} stroke={m.color} strokeWidth={1} style={{ filter:`drop-shadow(0 0 10px ${m.color})` }} />
              <text x={cx} y={cy - 6} textAnchor="middle" fill="#4ab6d4" fontSize={14} fontWeight="900" fontFamily="monospace" letterSpacing="0.1em" style={{ filter: `drop-shadow(0 0 8px ${m.color})` }}>{m.pct}%</text>
              <text x={cx} y={cy + 8} textAnchor="middle" fill={m.color} fontSize={6} fontFamily="monospace" letterSpacing="0.2em">{m.desc}</text>
              <text x={cx} y={cy + 20} textAnchor="middle" fill="#4ab6d4" fontSize={8} fontWeight="800" fontFamily="monospace" letterSpacing="0.2em">{m.label + (m.line2 ? ' ' + m.line2 : '')}</text>

              <line x1={cx - 18} y1={cy+2} x2={cx + 18} y2={cy+2} stroke={m.color} strokeWidth={0.5} opacity={0.5} />

              {/* Connecting targeting line from center to the hovered arc */}
              <line x1={polar(cx, cy, 34, m.deg).x} y1={polar(cx, cy, 34, m.deg).y}
                    x2={polar(cx, cy, 110, m.deg).x} y2={polar(cx, cy, 110, m.deg).y}
                    stroke={m.color} strokeWidth={1} strokeDasharray="2 4" style={{ filter:`drop-shadow(0 0 4px ${m.color})` }} />
            </g>
          )
        })()}
      </g>

      {/* ── Data readouts at compass points ── */}
      {[
        { deg:0,   val: kpis?.pipelineValue > 0 ? `₹${(kpis.pipelineValue/1e7).toFixed(1)}Cr` : `${analytics.total_users ?? 0}`, label: kpis?.pipelineValue > 0 ? 'PIPELINE' : 'USR' },
        { deg:90,  val: String(analytics.clients ?? 0),                                                                               label:'CLIENTS' },
        { deg:180, val: kpis?.onTimeProjectPct != null ? `${kpis.onTimeProjectPct}%`                   : String(analytics.partners ?? 0), label: kpis?.onTimeProjectPct != null ? 'ON-TIME' : 'PRT' },
        { deg:270, val: kpis?.mrrDeltaPct != null ? `${kpis.mrrDeltaPct > 0 ? '+' : ''}${kpis.mrrDeltaPct}%` : String(analytics.total_visits ?? 0), label: kpis?.mrrDeltaPct != null ? 'MRR Δ' : 'VST' },
      ].map(({ deg, val, label }) => {
        const p = polar(cx, cy, 85, deg)
        const isHovered = hovered === label
        const w = 46, h = 24
        return (
          <g key={deg} className="hud-module" onMouseEnter={() => setHovered(label)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'crosshair' }}>
            {/* Tech Bracket Background */}
            <path d={`M ${p.x - w/2} ${p.y - h/2 + 4} 
                       L ${p.x - w/2 + 4} ${p.y - h/2} 
                       L ${p.x + w/2 - 4} ${p.y - h/2} 
                       L ${p.x + w/2} ${p.y - h/2 + 4} 
                       L ${p.x + w/2} ${p.y + h/2 - 4} 
                       L ${p.x + w/2 - 4} ${p.y + h/2} 
                       L ${p.x - w/2 + 4} ${p.y + h/2} 
                       L ${p.x - w/2} ${p.y + h/2 - 4} Z`} 
              fill={isHovered ? `${C}40` : `${C}10`} stroke={isHovered ? C : `${C}40`} strokeWidth={0.5} 
              style={{ filter:`drop-shadow(0 0 4px ${C}40)`, transition: 'all 0.3s' }} />
            
            {/* Corner accents */}
            <polyline points={`${p.x - w/2},${p.y - h/2 + 8} ${p.x - w/2},${p.y - h/2 + 4} ${p.x - w/2 + 4},${p.y - h/2}`} fill="none" stroke={C} strokeWidth={1} opacity={isHovered ? 1 : 0.5} />
            <polyline points={`${p.x + w/2},${p.y + h/2 - 8} ${p.x + w/2},${p.y + h/2 - 4} ${p.x + w/2 - 4},${p.y + h/2}`} fill="none" stroke={C} strokeWidth={1} opacity={isHovered ? 1 : 0.5} />

            <text x={p.x} y={p.y} textAnchor="middle" fill={isHovered ? "#4ab6d4" : C} fontSize={isHovered ? 10 : 8}
              fontFamily="monospace" fontWeight="800"
              style={{ filter:`drop-shadow(0 0 4px ${C})`, transition: 'all 0.3s' }}>{val}</text>
            <text x={p.x} y={p.y+8} textAnchor="middle" fill={isHovered ? "#4ab6d4" : `${CG}d0`}
              fontSize={5} fontFamily="monospace" letterSpacing="0.2em" fontWeight="bold"
              style={{ transition: 'all 0.3s' }}>{label}</text>
          </g>
        )
      })}
    </svg>
    </div>
  )
}

// ─── HUD Command Bar ──────────────────────────────────────────────────────────

function useTypewriter(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!active || !text) { setDisplayed(text); return }
    setDisplayed('')
    let i = 0
    const id = setInterval(() => { i++; setDisplayed(text.slice(0, i)); if (i >= text.length) clearInterval(id) }, 16)
    return () => clearInterval(id)
  }, [text, active])
  return displayed
}

function useVoiceInput(onResult: (t: string) => void) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const [interim,   setInterim]   = useState('')
  const ref = useRef<any>(null)
  useEffect(() => {
    setSupported(!!(( window as any).SpeechRecognition || (window as any).webkitSpeechRecognition))
  }, [])
  const start = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const r = new SR(); ref.current = r
    r.continuous = false; r.interimResults = true; r.lang = 'en-GB'
    r.onstart  = () => { setListening(true); setInterim('') }
    r.onend    = () => { setListening(false); setInterim('') }
    r.onerror  = () => { setListening(false); setInterim('') }
    r.onresult = (e: any) => {
      let interim = '', final = ''
      for (const res of Array.from(e.results) as any[]) {
        if (res.isFinal) final += res[0].transcript
        else interim += res[0].transcript
      }
      setInterim(interim)
      if (final) { onResult(final.trim()); setInterim('') }
    }
    r.start()
  }, [onResult])
  const stop = useCallback(() => { ref.current?.stop(); setListening(false) }, [])
  return { listening, supported, interim, start, stop }
}

function useTTS() {
  const [speaking, setSpeaking] = useState(false)
  const [muted,    setMuted]    = useState(false)
  const muteRef = useRef(false)

  const speak = useCallback((text: string) => {
    if (muteRef.current || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.78; utter.pitch = 1.0; utter.volume = 1

    const pickVoice = (voices: SpeechSynthesisVoice[]) =>
      voices.find(v => /samantha/i.test(v.name))
      || voices.find(v => /karen|moira|tessa|victoria|zira|hazel|susan|allison|ava|kate|serena/i.test(v.name))
      || voices.find(v => v.lang === 'en-AU')
      || voices.find(v => v.lang.startsWith('en') && !/male|daniel|oliver|arthur/i.test(v.name))
      || null

    const doSpeak = (voices: SpeechSynthesisVoice[]) => {
      const voice = pickVoice(voices)
      if (voice) utter.voice = voice
      utter.onstart = () => setSpeaking(true)
      utter.onend   = () => setSpeaking(false)
      utter.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(utter)
    }

    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      doSpeak(voices)
    } else {
      // Voices load async — wait for the event then speak
      window.speechSynthesis.addEventListener('voiceschanged', function handler() {
        window.speechSynthesis.removeEventListener('voiceschanged', handler)
        doSpeak(window.speechSynthesis.getVoices())
      }, { once: true } as any)
    }
  }, [])

  const silence = useCallback(() => { window.speechSynthesis?.cancel(); setSpeaking(false) }, [])

  const toggleMute = useCallback(() => {
    muteRef.current = !muteRef.current
    setMuted(muteRef.current)
    if (muteRef.current) window.speechSynthesis?.cancel()
  }, [])

  return { speak, silence, speaking, muted, toggleMute }
}

// Animated waveform bars shown while TTS is speaking
function Waveform({ color, active }: { color: string; active: boolean }) {
  const bars = [3, 6, 10, 7, 4, 8, 5, 9, 6, 3]
  return (
    <div style={{ display:'flex', alignItems:'center', gap:2, height:14 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          width: 2, borderRadius: 1,
          background: color,
          boxShadow: active ? `0 0 4px ${color}` : 'none',
          height: active ? h : 2,
          transition: 'height 0.15s ease',
          animation: active ? `waveBar 0.${6+i}s ${i*0.07}s ease-in-out infinite alternate` : 'none',
        }} />
      ))}
    </div>
  )
}

interface AttachmentItem {
  name: string; data: string; type: 'image'|'pdf'|'document'; mimeType: string; preview?: string
}
interface PendingActionUI {
  id: string; type: string; description: string; params: Record<string,any>
  level: number; requiresConfirmation: boolean
}
interface PlanStepUI {
  step: number; description: string; type: string; status: 'pending'|'running'|'done'|'failed'
}

interface HUDCmdResult {
  response: string; confidence: number; suggestedAction: string | null
  model: string; navigate?: string | null
  pendingAction?: PendingActionUI | null
  interactionId?: string | null
  plan?: PlanStepUI[] | null
}

function HUDCommandBar({ insights, color, recentSignals, criticalAlert }: {
  insights: any[]; color: string
  recentSignals: LiveSignal[]; criticalAlert: LiveSignal | null
}) {
  const navigate = useNavigate()
  const [query,    setQuery]    = useState('')
  const [result,   setResult]   = useState<HUDCmdResult | null>(null)
  const [thinking, setThinking] = useState(false)
  const [animate,  setAnimate]  = useState(false)
  const [history,  setHistory]  = useState<Array<{role:'user'|'assistant'; content:string}>>([])
  const [showHistory, setShowHistory] = useState(false)
  const [saved, setSaved] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('kimmp-saved-queries') || '[]') } catch { return [] }
  })
  const [attachments, setAttachments] = useState<AttachmentItem[]>([])
  const [pendingAction, setPendingAction] = useState<PendingActionUI | null>(null)
  const [plan, setPlan] = useState<PlanStepUI[]>([])
  const [interactionId, setInteractionId] = useState<string | null>(null)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const inputRef  = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const greeted   = useRef(false)
  const alertedRef = useRef<string | null>(null)

  const { speak, silence, speaking, muted, toggleMute } = useTTS()

  useEffect(() => {
    if (!criticalAlert || alertedRef.current === criticalAlert.id) return
    alertedRef.current = criticalAlert.id
    speak(`CRITICAL ALERT. ${criticalAlert.sourceModule} — ${criticalAlert.signalValue}. Immediate attention required, sir.`)
  }, [criticalAlert, speak])

  const displayed = useTypewriter(result?.response ?? '', animate)

  useEffect(() => {
    if (greeted.current) return
    greeted.current = true
    const critical = insights.filter((i: any) => i.priority === 'critical').length
    const high     = insights.filter((i: any) => i.priority === 'high').length
    const hour     = new Date().getHours()
    const tod = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
    const greeting = critical > 0
      ? `Good ${tod}, sir. ${critical} critical signal${critical > 1 ? 's' : ''} require immediate attention${high > 0 ? `, along with ${high} high-priority item${high > 1 ? 's' : ''}` : ''}. Shall I brief you?`
      : `Good ${tod}, sir. Kangqore View is online. All modules operating within normal parameters.`
    setTimeout(() => speak(greeting), 1400)
  }, [insights, speak])

  useEffect(() => {
    if (!result || animate) return
    speak(result.response + (result.suggestedAction ? '. ' + result.suggestedAction : ''))
  }, [animate, result, speak])

  // Auto-navigate when KIMMP returns a route
  useEffect(() => {
    if (!result?.navigate) return
    const t = setTimeout(() => navigate(result.navigate!), 1800)
    return () => clearTimeout(t)
  }, [result, navigate])

  const saveQuery = (q: string) => {
    const next = [q, ...saved.filter(s => s !== q)].slice(0, 5)
    setSaved(next)
    localStorage.setItem('kimmp-saved-queries', JSON.stringify(next))
  }
  const removeQuery = (q: string) => {
    const next = saved.filter(s => s !== q)
    setSaved(next)
    localStorage.setItem('kimmp-saved-queries', JSON.stringify(next))
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const data = result.split(',')[1]
        const type: 'image'|'pdf'|'document' = file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'document'
        const preview = type === 'image' ? result : undefined
        setAttachments(prev => [...prev, { name: file.name, data, type, mimeType: file.type, preview }])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const sendFeedback = async (feedback: 'ACCEPTED'|'DISMISSED') => {
    if (!interactionId || feedbackSent) return
    setFeedbackSent(true)
    try {
      await api.post('/admin/kangqore-immp/feedback', { interactionId, feedback })
      if (feedback === 'ACCEPTED' && result) {
        speak('Thank you, sir. I will remember that.')
      }
    } catch {}
  }

  const confirmAction = async (action: PendingActionUI) => {
    try {
      const res = await api.post('/admin/kangqore-immp/actions/confirm', { actionId: action.id })
      setPendingAction(null)
      if (res.data.success) {
        setResult(r => r ? { ...r, response: r.response + '\n\n◉ ' + res.data.summary } : null)
        speak('Done, sir. ' + res.data.summary)
      }
    } catch {
      setPendingAction(null)
    }
  }

  const submit = useCallback(async (q?: string) => {
    const text = (q ?? query).trim()
    if (!text) return
    silence()
    setQuery(text); setThinking(true); setResult(null); setAnimate(false)
    try {
      const res = await api.post('/admin/kangqore-immp/command', {
        query: text,
        history: history.slice(-10),
        moduleContext: recentSignals[0]?.sourceModule,
        attachments: attachments.map(a => ({ type: a.type, data: a.data, mimeType: a.mimeType, name: a.name })),
      })
      setResult(res.data)
      setAnimate(true)
      setAttachments([])
      setInteractionId(res.data.interactionId ?? null)
      setFeedbackSent(false)
      if (res.data.pendingAction) setPendingAction(res.data.pendingAction)
      if (res.data.plan?.length) setPlan(res.data.plan)
      else setPlan([])
      setHistory(h => [...h, { role:'user', content:text }, { role:'assistant', content:res.data.response }])
    } catch {
      const reactive = insights.filter((i: any) => i.type !== 'predictive')
      const top = reactive.filter((i: any) => i.priority === 'critical' || i.priority === 'high')
      setResult({
        response: top.length > 0
          ? `${top.length} high-priority signal${top.length > 1 ? 's' : ''} require attention across ${new Set(top.map((i: any) => i.module)).size} modules.`
          : 'All clear. No critical signals detected across active modules.',
        confidence: 60, suggestedAction: null, model: 'fallback', navigate: null,
      }); setAnimate(true)
    } finally { setThinking(false) }
  }, [query, history, insights, recentSignals, silence])

  const { listening, supported, interim, start, stop } = useVoiceInput(
    useCallback((t: string) => { setQuery(t); submit(t) }, [submit])
  )
  const handleMicClick = useCallback(() => {
    if (listening) { stop(); return }
    silence(); start()
  }, [listening, stop, silence, start])

  const displayedQuery = listening && interim ? interim : query

  const topModule = recentSignals[0]?.sourceModule?.toLowerCase() ?? ''
  const DYNAMIC = recentSignals.length > 0
    ? (topModule.includes('lead') ? 'What happened with leads?' : topModule.includes('eqore') ? 'Latest eQORE signals?' : topModule.includes('finance') ? 'Finance status?' : 'What should I focus on?')
    : 'What should I focus on?'

  const SUGGESTED = [DYNAMIC, 'Show me critical risks', 'Open finance', 'Give me a brief']

  return (
    <div style={{ width:'100%' }}>
      {/* Conversation history thread */}
      {history.length > 0 && (
        <div style={{ marginBottom:4 }}>
          <button onClick={() => setShowHistory(h => !h)}
            style={{ background:'none', border:'none', cursor:'pointer', fontSize:8, color:`${color}50`, fontFamily:'monospace', padding:'2px 0' }}>
            {showHistory ? '▲' : '▼'} {Math.floor(history.length/2)} previous exchange{history.length > 2 ? 's' : ''}
          </button>
          {showHistory && (
            <div style={{ maxHeight:120, overflowY:'auto', borderLeft:`2px solid ${color}20`, paddingLeft:8, marginBottom:4 }}>
              {history.map((h, i) => (
                <div key={i} style={{ padding:'2px 0', borderBottom:`1px solid ${color}08` }}>
                  <span style={{ fontSize:7, color: h.role === 'user' ? `${color}70` : `${CG}70`, fontFamily:'monospace', display:'block' }}>
                    {h.role === 'user' ? '▶ YOU' : '◈ KIMMP'}
                  </span>
                  <span style={{ fontSize:8, color: h.role === 'user' ? `${color}90` : '#8ab0c8', lineHeight:1.4, display:'block' }}>
                    {h.content.slice(0, 120)}{h.content.length > 120 ? '…' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => { setHistory([]); setResult(null); silence() }}
            style={{ background:'none', border:'none', cursor:'pointer', fontSize:7, color:`${CR}50`, fontFamily:'monospace' }}>
            ✕ clear conversation
          </button>
        </div>
      )}

      {/* Attachment pills */}
      {attachments.length > 0 && (
        <div style={{ display:'flex', gap:4, flexWrap:'wrap', padding:'4px 2px', marginBottom:4 }}>
          {attachments.map((a, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:4, padding:'2px 6px',
              background:`${color}10`, border:`1px solid ${color}25`, borderRadius:4 }}>
              {a.preview && (
                <img src={a.preview} alt={a.name} style={{ width:18, height:18, objectFit:'cover', borderRadius:2 }} />
              )}
              {!a.preview && (
                <span style={{ fontSize:8, color:`${CA}80` }}>{a.type === 'pdf' ? '📄' : '📎'}</span>
              )}
              <span style={{ fontSize:7, color:`${color}60`, fontFamily:'monospace', maxWidth:80, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {a.name}
              </span>
              <button onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                style={{ background:'none', border:'none', color:`${CR}50`, cursor:'pointer', fontSize:8, padding:0, lineHeight:1 }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.txt,.csv,.md"
        style={{ display:'none' }} onChange={handleFiles} />

      {/* Input row */}
      <div style={{
        display:'flex', alignItems:'center', gap:8, padding:'6px 10px',
        background: listening ? 'rgba(255,51,85,0.08)' : speaking ? `rgba(0,212,255,0.08)` : `rgba(0,212,255,0.04)`,
        border: `1px solid ${listening ? '#ff335540' : speaking ? `${color}50` : `${color}25`}`,
        borderRadius:8, transition:'all 0.3s',
        boxShadow: speaking ? `0 0 12px ${color}20` : 'none',
      }}>
        <input
          ref={inputRef}
          value={displayedQuery}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder={listening ? 'Listening…' : speaking ? 'Speaking…' : `Ask KIMMP — "take me to finance", "what should I focus on?"…`}
          style={{
            flex:1, background:'transparent', border:'none', outline:'none',
            fontSize:10, color: listening ? '#ff5577' : '#a0d8ef',
            fontFamily:'monospace', letterSpacing:'0.05em',
          }}
        />
        {speaking && <Waveform color={color} active={speaking} />}
        {displayedQuery && !listening && !speaking && (
          <button onClick={() => { setQuery(''); setResult(null); silence() }}
            style={{ background:'none', border:'none', color:`${color}40`, cursor:'pointer', fontSize:10 }}>✕</button>
        )}
        <button onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'}
          style={{ width:24, height:24, borderRadius:4, border:`1px solid ${muted ? '#ff886040' : `${color}25`}`,
            background:'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
          {muted ? <VolumeX size={10} color="#ff8860" /> : <Volume2 size={10} color={`${color}60`} />}
        </button>
        {supported && (
          <button onClick={handleMicClick}
            style={{ width:24, height:24, borderRadius:4, border:`1px solid ${listening ? '#ff3355' : `${color}30`}`,
              background: listening ? 'rgba(255,51,85,0.2)' : 'transparent',
              display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0,
              boxShadow: listening ? '0 0 8px #ff335560' : 'none',
              animation: listening ? 'blink2 1s infinite' : 'none' }}>
            {listening ? <MicOff size={10} color="#ff3355" /> : <Mic size={10} color={`${color}80`} />}
          </button>
        )}
        <button onClick={() => fileInputRef.current?.click()}
          title="Attach image, PDF, or document"
          style={{ width:24, height:24, borderRadius:4, border:`1px solid ${color}25`,
            background:'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0,
            opacity: attachments.length >= 3 ? 0.3 : 1 }}>
          <span style={{ fontSize:10, color:`${color}50` }}>⊕</span>
        </button>
        <button onClick={() => submit()}
          disabled={!displayedQuery.trim() || thinking}
          style={{ width:24, height:24, borderRadius:4, background:`${color}20`,
            border:`1px solid ${color}40`, display:'flex', alignItems:'center',
            justifyContent:'center', cursor:'pointer', flexShrink:0,
            opacity: (!displayedQuery.trim() || thinking) ? 0.3 : 1 }}>
          <Send size={10} color={color} />
        </button>
      </div>

      {thinking && (
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 2px' }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ width:4, height:4, borderRadius:'50%', background:color,
              animation:`orbit-cw 1s ${i*0.2}s ease-in-out infinite`, boxShadow:`0 0 6px ${color}` }} />
          ))}
          <span style={{ fontSize:9, color:`${color}60`, fontFamily:'monospace', letterSpacing:'0.1em' }}>REASONING ACROSS SIGNALS…</span>
        </div>
      )}

      {/* Plan steps display */}
      {plan.length > 0 && !thinking && (
        <div style={{ borderLeft:`2px solid ${color}20`, paddingLeft:8, marginBottom:6, marginTop:4 }}>
          <div style={{ fontSize:7, color:`${color}40`, fontFamily:'monospace', letterSpacing:'0.1em', marginBottom:3 }}>
            EXECUTION PLAN
          </div>
          {plan.map(step => (
            <div key={step.step} style={{ display:'flex', alignItems:'center', gap:6, padding:'2px 0' }}>
              <span style={{ fontSize:7, color:`${color}30`, fontFamily:'monospace', width:12 }}>{step.step}.</span>
              <span style={{ fontSize:8, color: step.status === 'done' ? CG : step.status === 'failed' ? CR : `${color}60` }}>
                {step.description}
              </span>
              {step.status === 'done' && <span style={{ color:CG, fontSize:8 }}>✓</span>}
              {step.status === 'failed' && <span style={{ color:CR, fontSize:8 }}>✗</span>}
            </div>
          ))}
        </div>
      )}

      {/* Pending action confirmation */}
      {pendingAction && !thinking && (
        <div style={{
          border:`1px solid ${LEVEL_COLORS[pendingAction.level] ?? CA}40`,
          borderRadius:8, padding:'8px 10px', margin:'4px 0',
          background:`${LEVEL_COLORS[pendingAction.level] ?? CA}05`,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
            <LevelBadge level={pendingAction.level} />
            <span style={{ fontSize:8, color: LEVEL_COLORS[pendingAction.level] ?? CA, fontFamily:'monospace', letterSpacing:'0.1em' }}>
              KIMMP PROPOSES: {pendingAction.type.replace(/_/g, ' ')}
            </span>
          </div>
          <div style={{ fontSize:9, color:'#a0d8ef', marginBottom:8, lineHeight:1.4 }}>{pendingAction.description}</div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => confirmAction(pendingAction)}
              style={{ fontSize:8, padding:'3px 12px', borderRadius:4, cursor:'pointer', fontFamily:'monospace',
                background:`${CG}15`, border:`1px solid ${CG}40`, color:CG, letterSpacing:'0.08em' }}>
              APPROVE
            </button>
            <button onClick={() => setPendingAction(null)}
              style={{ fontSize:8, padding:'3px 12px', borderRadius:4, cursor:'pointer', fontFamily:'monospace',
                background:`${CR}08`, border:`1px solid ${CR}30`, color:CR, letterSpacing:'0.08em' }}>
              DENY
            </button>
          </div>
        </div>
      )}

      {result && !thinking && (
        <div style={{ padding:'8px 2px', borderTop:`1px solid ${color}15`, marginTop:6 }}>
          <div style={{ display:'flex', gap:6, alignItems:'flex-start' }}>
            <div style={{ width:4, height:4, borderRadius:'50%', flexShrink:0, marginTop:4,
              background: speaking ? color : `${color}80`,
              boxShadow: speaking ? `0 0 8px ${color}` : 'none',
              animation: speaking ? 'blink2 0.6s infinite' : 'none' }} />
            <div style={{ flex:1 }}>
              <p style={{ fontSize:10, color:'#b0d8ef', lineHeight:1.6, fontFamily:'monospace', margin:0 }}>
                {displayed}
                {animate && displayed.length < (result.response?.length ?? 0) && (
                  <span style={{ animation:'blink2 0.5s infinite', color }}> ▌</span>
                )}
              </p>
              {result.suggestedAction && (
                <p style={{ fontSize:9, color:`${color}70`, marginTop:4, fontFamily:'monospace', fontStyle:'italic' }}>
                  → {result.suggestedAction}
                </p>
              )}
              {result.navigate && (
                <p style={{ fontSize:8, color:CG, marginTop:3, fontFamily:'monospace' }}>
                  ↗ Navigating to {result.navigate}…
                </p>
              )}
              <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:6 }}>
                <div style={{ height:2, width:40, background:`${color}20`, borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${result.confidence}%`, background:color, transition:'width 0.8s ease' }} />
                </div>
                <span style={{ fontSize:8, color:`${color}40`, fontFamily:'monospace' }}>{result.confidence}% CONF</span>
                {speaking && <span style={{ fontSize:8, color, fontFamily:'monospace', animation:'blink2 1s infinite' }}>◉ SPEAKING</span>}
                {result.model === 'fallback' && <span style={{ fontSize:8, color:'#ff886040', fontFamily:'monospace' }}>FALLBACK</span>}
                <button onClick={() => saveQuery(query)}
                  title="Save this query"
                  style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', fontSize:8, color:`${color}40`, fontFamily:'monospace' }}>
                  ☆ save
                </button>
                {interactionId && !feedbackSent && (
                  <div style={{ display:'flex', gap:4, marginLeft:'auto' }}>
                    <button onClick={() => sendFeedback('ACCEPTED')}
                      title="Good response"
                      style={{ fontSize:9, background:'none', border:`1px solid ${CG}30`, borderRadius:4, color:`${CG}60`, cursor:'pointer', padding:'2px 6px' }}>
                      👍
                    </button>
                    <button onClick={() => sendFeedback('DISMISSED')}
                      title="Not helpful"
                      style={{ fontSize:9, background:'none', border:`1px solid ${CR}30`, borderRadius:4, color:`${CR}60`, cursor:'pointer', padding:'2px 6px' }}>
                      👎
                    </button>
                  </div>
                )}
                {feedbackSent && (
                  <span style={{ fontSize:8, color:`${CG}50`, fontFamily:'monospace', marginLeft:'auto' }}>✓ feedback received</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggested + Saved queries */}
      {!result && !thinking && (
        <div style={{ marginTop:6 }}>
          {saved.length > 0 && (
            <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:4 }}>
              {saved.map(s => (
                <div key={s} style={{ display:'flex', alignItems:'center', gap:2 }}>
                  <button onClick={() => submit(s)}
                    style={{ fontSize:8, padding:'2px 6px', borderRadius:4, cursor:'pointer', fontFamily:'monospace',
                      background:`${CG}10`, border:`1px solid ${CG}30`, color:`${CG}90`, letterSpacing:'0.05em' }}>
                    ★ {s}
                  </button>
                  <button onClick={() => removeQuery(s)}
                    style={{ background:'none', border:'none', cursor:'pointer', fontSize:7, color:`${CR}40`, padding:0 }}>✕</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {SUGGESTED.map(s => (
              <button key={s} onClick={() => submit(s)}
                style={{ fontSize:8, padding:'3px 8px', borderRadius:4, cursor:'pointer', fontFamily:'monospace',
                  background:`${color}08`, border:`1px solid ${color}20`, color:`${color}70`, letterSpacing:'0.05em' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${color}18`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}50` }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${color}08`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}20` }}
              >{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── KIMMP Decision Queue ─────────────────────────────────────────────────────
function DecisionQueue() {
  const { data, refetch } = useQuery({
    queryKey: ['kimmp-decisions-proposed'],
    queryFn: () => api.get('/admin/kangqore-immp/decisions?status=PROPOSED').then(r => r.data),
    refetchInterval: 30_000,
  })
  const decisions: any[] = data?.decisions ?? []
  if (!decisions.length) return null

  const act = async (id: string, status: 'APPROVED' | 'DISMISSED') => {
    try {
      await api.patch(`/admin/kangqore-immp/decisions/${id}`, { status })
      refetch()
    } catch {}
  }

  return (
    <Panel title={`DECISIONS  •  ${decisions.length} PROPOSED`} color={CA}>
      {decisions.slice(0, 3).map((d: any) => (
        <div key={d.id} style={{ padding:'5px 0', borderBottom:`1px solid ${CA}15` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
            <span style={{ fontSize:8, color:C, fontWeight:800, letterSpacing:'0.08em',
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'80%' }}>
              {d.action ?? d.decisionType ?? 'PROPOSED ACTION'}
            </span>
            <span style={{ fontSize:7, color:`${CA}80`, flexShrink:0, marginLeft:4 }}>{d.priority ?? 'MED'}</span>
          </div>
          {d.targetModule && (
            <span style={{ fontSize:7, color:'#6a9ab8', display:'block', marginBottom:4, fontFamily:'monospace' }}>
              → {d.targetModule}
            </span>
          )}
          <div style={{ display:'flex', gap:4 }}>
            <button onClick={() => act(d.id, 'APPROVED')}
              style={{ flex:1, padding:'3px 0', borderRadius:3, cursor:'pointer', fontWeight:800,
                fontSize:8, letterSpacing:'0.08em', fontFamily:'monospace',
                background:`${CG}15`, border:`1px solid ${CG}40`, color:CG }}>
              ✓ APPROVE
            </button>
            <button onClick={() => act(d.id, 'DISMISSED')}
              style={{ flex:1, padding:'3px 0', borderRadius:3, cursor:'pointer', fontWeight:800,
                fontSize:8, letterSpacing:'0.08em', fontFamily:'monospace',
                background:`${CR}10`, border:`1px solid ${CR}30`, color:CR }}>
              ✗ DISMISS
            </button>
          </div>
        </div>
      ))}
    </Panel>
  )
}

// ─── Digital Twin ─────────────────────────────────────────────────────────────
interface TwinSnapshot {
  revenueHealth: number; pipelineVelocity: number; executionCapacity: number
  riskExposure: number; marketPosition: number; overallScore: number
  metadata?: Record<string, any>; computedAt?: string
}

const TWIN_DIMS = [
  { key: 'revenueHealth',     label: 'REVENUE',   short: 'REV',  angle: -90 },
  { key: 'pipelineVelocity',  label: 'PIPELINE',  short: 'PIPE', angle: -18 },
  { key: 'marketPosition',    label: 'MARKET',    short: 'MKT',  angle:  54 },
  { key: 'executionCapacity', label: 'EXECUTION', short: 'EXEC', angle: 126 },
  { key: 'riskExposure',      label: 'RISK',      short: 'RISK', angle: 198 },
] as const


// ─── Digital Twin — compact widget group (same queryKey, no double fetch) ─────
function TwinWidgets({ onOpen }: { onOpen: () => void }) {
  const [computing, setComputing] = useState(false)
  const { data, refetch } = useQuery<TwinSnapshot>({
    queryKey:        ['kimmp-twin'],
    queryFn:         () => api.get('/admin/kangqore-immp/twin/current').then(r => r.data),
    refetchInterval: 30 * 60_000,
    staleTime:       25 * 60_000,
  })

  const twin: TwinSnapshot = data ?? {
    revenueHealth: 0, pipelineVelocity: 0, executionCapacity: 0,
    riskExposure: 0, marketPosition: 0, overallScore: 0,
  }

  const recompute = async () => {
    setComputing(true)
    await api.post('/admin/kangqore-immp/twin/compute').catch(() => {})
    await refetch()
    setComputing(false)
  }

  const sc = (v: number) => v >= 70 ? CG : v >= 40 ? '#ffaa00' : CR

  return (
    <>
      <Widget label="TWIN SCORE" value={twin.overallScore}
        sub={computing ? 'COMPUTING…' : '/100 OVERALL'}
        color={sc(twin.overallScore)}
        glow={twin.overallScore < 40 || twin.overallScore > 70}
        onClick={onOpen} />
      <Widget label="REVENUE"   value={twin.revenueHealth}     sub="/100" color={sc(twin.revenueHealth)}     glow={twin.revenueHealth     < 35} onClick={onOpen} />
      <Widget label="PIPELINE"  value={twin.pipelineVelocity}  sub="/100" color={sc(twin.pipelineVelocity)}  glow={twin.pipelineVelocity  < 35} onClick={onOpen} />
      <Widget label="MARKET"    value={twin.marketPosition}    sub="/100" color={sc(twin.marketPosition)}    glow={twin.marketPosition    < 35} onClick={onOpen} />
      <Widget label="EXECUTION" value={twin.executionCapacity} sub="/100" color={sc(twin.executionCapacity)} glow={twin.executionCapacity < 35} onClick={onOpen} />
      <Widget label="RISK EXP"  value={twin.riskExposure}      sub="/100" color={sc(twin.riskExposure)}      glow={twin.riskExposure      > 60} onClick={onOpen} />
    </>
  )
}

// ─── Signal Timeline ──────────────────────────────────────────────────────────
function SignalTimeline({ signals }: { signals: LiveSignal[] }) {
  if (!signals.length) return null
  return (
    <div style={{ width:'85%' }}>
      <Panel title="LIVE SIGNAL STREAM" color={CG}>
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {signals.slice(0, 5).map((s, i) => {
            const sc = s.severity === 'CRITICAL' ? CR : s.severity === 'HIGH' ? CA : CG
            return (
              <div key={s.id + i} style={{ display:'flex', alignItems:'flex-start', gap:6, padding:'3px 0', borderBottom:`1px solid ${CG}10` }}>
                <div style={{
                  width:5, height:5, borderRadius:'50%', marginTop:3, flexShrink:0,
                  background: sc, boxShadow:`0 0 4px ${sc}`,
                  animation: i === 0 ? 'blink2 1s infinite' : 'none',
                }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:8, color:sc, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase' }}>{s.sourceModule}</span>
                      {s.sourceModule === 'scout' && (
                        <span style={{ fontSize:7, padding:'1px 4px', borderRadius:3, background:`${CG}15`, border:`1px solid ${CG}30`, color:CG, fontFamily:'monospace' }}>
                          EXT {SCOUT_ICONS[s.signalType] ?? '◈'}
                        </span>
                      )}
                      {s.signalType === 'CORRELATION_DETECTED' && (
                        <span style={{ fontSize:7, padding:'1px 4px', borderRadius:3, background:`${CA}15`, border:`1px solid ${CA}30`, color:CA, fontFamily:'monospace' }}>
                          PATTERN ◇
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize:7, color:`${C}40`, fontFamily:'monospace' }}>{timeAgo(s.createdAt)}</span>
                  </div>
                  <span style={{ fontSize:8, color:'#5a8aa8', lineHeight:1.3, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.signalValue}</span>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}

// ─── Command Center ───────────────────────────────────────────────────────────
function CommandCenter({ liveApprovals }: { liveApprovals: any[] }) {
  const [tab, setTab] = useState<'agents'|'approvals'|'tools'|'scout'>('approvals')
  const [scoutRunning, setScoutRunning] = useState(false)
  const [correlRunning, setCorrelRunning] = useState(false)

  const { data: agentsData, refetch: refetchAgents } = useQuery({
    queryKey: ['kimmp-agents'],
    queryFn: () => api.get('/admin/kangqore-immp/authority/agents').then(r => r.data),
    refetchInterval: 30_000,
  })
  const { data: approvalsData, refetch: refetchApprovals } = useQuery({
    queryKey: ['kimmp-approvals'],
    queryFn: () => api.get('/admin/kangqore-immp/authority/approvals').then(r => r.data),
    refetchInterval: 10_000,
  })
  const { data: toolsData } = useQuery({
    queryKey: ['kimmp-tools'],
    queryFn: () => api.get('/admin/kangqore-immp/authority/tools').then(r => r.data),
    staleTime: 300_000,
  })
  const { data: scoutJobsData, refetch: refetchJobs } = useQuery({
    queryKey: ['kimmp-scout-jobs'],
    queryFn: () => api.get('/admin/kangqore-immp/scout/jobs').then(r => r.data),
    enabled: tab === 'scout',
    refetchInterval: tab === 'scout' ? 30_000 : false,
  })

  const agents:    any[] = agentsData?.agents       ?? []
  const approvals: any[] = approvalsData?.approvals ?? []
  const tools:     any[] = toolsData?.tools         ?? []
  const scoutJobs: any[] = scoutJobsData?.jobs      ?? []

  const totalApprovals = approvals.length + liveApprovals.filter(l => !approvals.find((a: any) => a.id === l.id)).length

  const approveRequest = async (id: string) => {
    await api.post(`/admin/kangqore-immp/authority/approvals/${id}/approve`)
    refetchApprovals()
  }
  const denyRequest = async (id: string) => {
    await api.post(`/admin/kangqore-immp/authority/approvals/${id}/deny`)
    refetchApprovals()
  }
  const setAgentLevel = async (agentId: string, level: number) => {
    await api.patch(`/admin/kangqore-immp/authority/agents/${agentId}/level`, { level })
    refetchAgents()
  }
  const suspendAgent = async (agentId: string) => {
    await api.patch(`/admin/kangqore-immp/authority/agents/${agentId}/suspend`)
    refetchAgents()
  }
  const killAgent = async (agentId: string) => {
    if (!confirm('Kill this agent? This action is logged.')) return
    await api.delete(`/admin/kangqore-immp/authority/agents/${agentId}`)
    refetchAgents()
  }
  const activateAgent = async (agentId: string) => {
    await api.patch(`/admin/kangqore-immp/authority/agents/${agentId}/activate`)
    refetchAgents()
  }
  const runScout = async () => {
    setScoutRunning(true)
    try { await api.post('/admin/kangqore-immp/scout/run') } catch {}
    setTimeout(() => { setScoutRunning(false); refetchJobs() }, 3000)
  }
  const runCorrelation = async () => {
    setCorrelRunning(true)
    try { await api.post('/admin/kangqore-immp/correlation/analyze') } catch {}
    setTimeout(() => setCorrelRunning(false), 4000)
  }

  return (
    <div style={{ width:'85%' }}>
      <Panel title={`COMMAND CENTER${totalApprovals > 0 ? `  •  ${totalApprovals} PENDING` : ''}`} color={CA}>

        {/* Tab bar */}
        <div style={{ display:'flex', gap:4, marginBottom:8 }}>
          {(['approvals','agents','tools','scout'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, fontSize:8, padding:'3px 0', borderRadius:4, cursor:'pointer', fontFamily:'monospace',
                letterSpacing:'0.08em', textTransform:'uppercase',
                background: tab === t ? `${CA}25` : 'transparent',
                border: `1px solid ${tab === t ? CA : `${CA}20`}`,
                color: tab === t ? CA : `${CA}50` }}>
              {t}{t === 'approvals' && totalApprovals > 0 ? ` (${totalApprovals})` : ''}
            </button>
          ))}
        </div>

        {/* Approvals tab */}
        {tab === 'approvals' && (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {approvals.length === 0 && liveApprovals.length === 0 ? (
              <div style={{ fontSize:9, color:`${CA}30`, fontFamily:'monospace', textAlign:'center', padding:'8px 0' }}>
                No pending approvals
              </div>
            ) : (
              approvals.map((a: any) => (
                <div key={a.id} style={{ border:`1px solid ${CA}25`, borderRadius:6, padding:'6px 8px', background:`${CA}05` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                    <LevelBadge level={a.level ?? 3} />
                    <span style={{ fontSize:9, color:CA, fontFamily:'monospace', flex:1 }}>
                      {a.action.replace(/_/g,' ')}
                    </span>
                  </div>
                  <div style={{ fontSize:8, color:'#8ab0c8', marginBottom:6 }}>{a.description}</div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => approveRequest(a.id)}
                      style={{ flex:1, fontSize:8, padding:'2px 0', borderRadius:3, cursor:'pointer',
                        background:`${CG}15`, border:`1px solid ${CG}40`, color:CG, fontFamily:'monospace' }}>
                      APPROVE
                    </button>
                    <button onClick={() => denyRequest(a.id)}
                      style={{ flex:1, fontSize:8, padding:'2px 0', borderRadius:3, cursor:'pointer',
                        background:`${CR}08`, border:`1px solid ${CR}30`, color:CR, fontFamily:'monospace' }}>
                      DENY
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Agents tab */}
        {tab === 'agents' && (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {agents.length === 0 ? (
              <div style={{ fontSize:9, color:`${CA}30`, fontFamily:'monospace', textAlign:'center', padding:'8px 0' }}>
                No agents registered
              </div>
            ) : (
              agents.map((a: any) => {
                const alive = a.status === 'ACTIVE'
                const sc = a.status === 'KILLED' ? CR : a.status === 'SUSPENDED' ? CA : CG
                return (
                  <div key={a.id} style={{ border:`1px solid ${sc}20`, borderRadius:6, padding:'6px 8px', background:`${sc}04` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background:sc, flexShrink:0 }} />
                      <span style={{ fontSize:9, color:sc, fontFamily:'monospace', fontWeight:800, flex:1 }}>{a.name}</span>
                      <LevelBadge level={a.maxLevel ?? 1} />
                    </div>
                    <div style={{ fontSize:8, color:`${sc}60`, marginBottom:5 }}>{a.role}</div>
                    <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                      <span style={{ fontSize:7, color:`${C}40`, fontFamily:'monospace' }}>MAX LVL</span>
                      {[0,1,2,3,4].map(lvl => (
                        <button key={lvl} onClick={() => setAgentLevel(a.id, lvl)}
                          style={{ width:16, height:16, borderRadius:3, cursor:'pointer', fontSize:7, fontFamily:'monospace',
                            background: a.maxLevel === lvl ? `${LEVEL_COLORS[lvl]}30` : 'transparent',
                            border: `1px solid ${a.maxLevel === lvl ? LEVEL_COLORS[lvl] : `${C}15`}`,
                            color: a.maxLevel === lvl ? LEVEL_COLORS[lvl] : `${C}30` }}>
                          {lvl}
                        </button>
                      ))}
                      <div style={{ marginLeft:'auto', display:'flex', gap:4 }}>
                        {alive && (
                          <button onClick={() => suspendAgent(a.id)}
                            style={{ fontSize:7, padding:'1px 5px', borderRadius:3, cursor:'pointer',
                              background:`${CA}10`, border:`1px solid ${CA}30`, color:`${CA}80`, fontFamily:'monospace' }}>
                            SUSPEND
                          </button>
                        )}
                        {!alive && a.status === 'SUSPENDED' && (
                          <button onClick={() => activateAgent(a.id)}
                            style={{ fontSize:7, padding:'1px 5px', borderRadius:3, cursor:'pointer',
                              background:`${CG}10`, border:`1px solid ${CG}30`, color:`${CG}80`, fontFamily:'monospace' }}>
                            ACTIVATE
                          </button>
                        )}
                        {a.status !== 'KILLED' && (
                          <button onClick={() => killAgent(a.id)}
                            style={{ fontSize:7, padding:'1px 5px', borderRadius:3, cursor:'pointer',
                              background:`${CR}10`, border:`1px solid ${CR}30`, color:`${CR}80`, fontFamily:'monospace' }}>
                            KILL
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Tools tab */}
        {tab === 'tools' && (
          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {tools.map((t: any) => (
              <div key={t.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'4px 0', borderBottom:`1px solid ${C}08` }}>
                <div>
                  <span style={{ fontSize:8, color:'#6a9ab8', fontFamily:'monospace' }}>{t.name.replace(/_/g,' ')}</span>
                  <span style={{ fontSize:7, color:`${C}30`, fontFamily:'monospace', display:'block' }}>{t.category}</span>
                </div>
                <LevelBadge level={t.defaultLevel} />
              </div>
            ))}
          </div>
        )}

        {/* Scout tab */}
        {tab === 'scout' && (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={runScout} disabled={scoutRunning}
                style={{ flex:1, fontSize:8, padding:'4px 0', borderRadius:4,
                  cursor: scoutRunning ? 'wait' : 'pointer', fontFamily:'monospace',
                  letterSpacing:'0.08em', textTransform:'uppercase',
                  background:`${CG}15`, border:`1px solid ${CG}40`,
                  color: scoutRunning ? `${CG}40` : CG }}>
                {scoutRunning ? 'SCANNING…' : '▶ FULL SCAN'}
              </button>
              <button onClick={runCorrelation} disabled={correlRunning}
                style={{ flex:1, fontSize:8, padding:'4px 0', borderRadius:4,
                  cursor: correlRunning ? 'wait' : 'pointer', fontFamily:'monospace',
                  letterSpacing:'0.08em', textTransform:'uppercase',
                  background:`${CA}10`, border:`1px solid ${CA}35`,
                  color: correlRunning ? `${CA}40` : CA }}>
                {correlRunning ? 'ANALYZING…' : '◇ CORRELATE'}
              </button>
            </div>
            {scoutJobs.slice(0, 8).map((j: any, i: number) => (
              <div key={j.id ?? i} style={{ display:'flex', justifyContent:'space-between',
                padding:'3px 0', borderBottom:`1px solid ${C}08` }}>
                <div>
                  <span style={{ fontSize:8, color:'#6a9ab8', fontFamily:'monospace' }}>{j.sourceName}</span>
                  <span style={{ fontSize:7, color:`${C}30`, fontFamily:'monospace', display:'block',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:130 }}>{j.query}</span>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <span style={{ fontSize:8, color: j.signalsEmitted > 0 ? CG : `${C}30`, fontFamily:'monospace' }}>{j.signalsEmitted} signals</span>
                  <span style={{ fontSize:7, color: j.status === 'COMPLETED' ? `${CG}50` : `${CR}50`, fontFamily:'monospace', display:'block' }}>{j.status}</span>
                </div>
              </div>
            ))}
            {!scoutJobs.length && (
              <div style={{ fontSize:9, color:`${C}30`, fontFamily:'monospace', textAlign:'center', padding:'10px 0' }}>
                No scan jobs yet — click FULL SCAN to start
              </div>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}

// ─── Proactive Intelligence Panel ────────────────────────────────────────────
const PROACTIVE_CATEGORY_COLOR: Record<string, string> = {
  OPPORTUNITY:  CG,
  LEAD:         C,
  PIPELINE:     CA,
  FINANCE:      CR,
  COMPETITOR:   CR,
  GOAL:         CA,
  INTELLIGENCE: C,
}

// ─── Action Queue Panel ───────────────────────────────────────────────────────
const ACTION_LEVEL_LABEL: Record<number, string> = { 0:'L0 AUTO', 1:'L1 AUTO', 2:'L2 AUTO', 3:'L3 APPROVAL', 4:'BLOCKED' }
const ACTION_ICONS: Record<string, string> = {
  CREATE_GOAL:'◎', DRAFT_EMAIL:'✉', GENERATE_REPORT:'▤', UPDATE_LEAD_STATUS:'◇',
  ADD_MEMORY:'◫', LOG_DECISION:'⊗', DISMISS_ALERT:'✕', COMPLETE_GOAL_TASK:'✓',
  CREATE_LEAD:'⊕', SCHEDULE_TASK:'⊞', SEND_NOTIFICATION:'◉', UPDATE_PROJECT_STATUS:'▣',
  CREATE_GOAL_TASK:'△', EMIT_SIGNAL:'◈',
}

function ActionQueuePanel() {
  const [open, setOpen]         = useState(false)
  const [proposeText, setProposeText] = useState('')
  const [proposing, setProposing]     = useState(false)
  const [tab, setTab]           = useState<'pending'|'history'>('pending')

  const { data: pendingData, refetch: refetchPending } = useQuery({
    queryKey: ['kimmp-pending-actions'],
    queryFn:  () => api.get('/admin/kangqore-immp/authority/approvals').then(r => r.data),
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
  const { data: historyData, refetch: refetchHistory } = useQuery({
    queryKey: ['kimmp-action-history'],
    queryFn:  () => api.get('/admin/kangqore-immp/actions/history?limit=15').then(r => r.data),
    enabled:  open && tab === 'history',
    staleTime: 30_000,
  })

  const pending: any[] = pendingData?.approvals ?? []
  const history: any[] = historyData?.history   ?? []
  const pendingCount   = pending.length

  const approve = async (id: string) => {
    await api.post(`/admin/kangqore-immp/authority/approvals/${id}/approve`).catch(() => {})
    refetchPending()
    refetchHistory()
  }
  const deny = async (id: string) => {
    await api.post(`/admin/kangqore-immp/authority/approvals/${id}/deny`).catch(() => {})
    refetchPending()
  }
  const propose = async () => {
    if (!proposeText.trim()) return
    setProposing(true)
    try {
      await api.post('/admin/kangqore-immp/actions/propose', { description: proposeText.trim() })
      setProposeText('')
      refetchPending()
    } catch {}
    setProposing(false)
  }

  return (
    <div style={{ width:'85%' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'6px 10px', borderRadius:6, background:`${CA}06`, border:`1px solid ${CA}15`,
          cursor:'pointer', marginBottom: open ? 6 : 0 }}>
        <span style={{ fontSize:9, color:`${CA}80`, fontWeight:800, letterSpacing:'0.12em', fontFamily:'monospace' }}>
          ⊞ KIMMP ACTIONS
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {pendingCount > 0 && (
            <span style={{ fontSize:8, color:'#4ab6d4', background:CA, borderRadius:8, padding:'1px 6px', fontFamily:'monospace' }}>
              {pendingCount}
            </span>
          )}
          <span style={{ fontSize:8, color:`${C}40` }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div style={{ background:'rgba(0,8,24,0.92)', borderRadius:6, border:`1px solid ${CA}15`, padding:10 }}>

          {/* Propose input */}
          <div style={{ display:'flex', gap:5, marginBottom:8 }}>
            <input
              value={proposeText} onChange={e => setProposeText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !proposing && propose()}
              placeholder="Tell KIMMP what to do e.g. Draft a follow-up email to cold leads"
              style={{ flex:1, background:`${CA}08`, border:`1px solid ${CA}20`, borderRadius:4,
                color:'#a8c8ef', fontSize:9, padding:'5px 8px', fontFamily:'monospace', outline:'none' }}
            />
            <button onClick={propose} disabled={proposing || !proposeText.trim()}
              style={{ padding:'4px 10px', fontSize:8, borderRadius:4, fontFamily:'monospace',
                letterSpacing:'0.08em', textTransform:'uppercase', cursor: proposing ? 'wait' : 'pointer',
                background: proposing ? `${CA}10` : `${CA}20`, border:`1px solid ${CA}40`,
                color: proposing ? `${CA}40` : CA, flexShrink:0 }}>
              {proposing ? '…' : '↗ GO'}
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:4, marginBottom:8 }}>
            {(['pending','history'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); if (t === 'history') refetchHistory() }}
                style={{ flex:1, padding:'3px 0', fontSize:7, fontFamily:'monospace', letterSpacing:'0.1em',
                  textTransform:'uppercase', cursor:'pointer', borderRadius:4,
                  background: tab === t ? `${CA}20` : 'transparent',
                  border: `1px solid ${tab === t ? CA : `${CA}15`}`,
                  color: tab === t ? CA : `${CA}40` }}>
                {t === 'pending' ? `PENDING (${pendingCount})` : 'HISTORY'}
              </button>
            ))}
          </div>

          {/* Pending approvals */}
          {tab === 'pending' && (
            pending.length === 0
              ? <div style={{ fontSize:8, color:`${C}25`, fontFamily:'monospace', textAlign:'center', padding:'10px 0' }}>
                  No actions pending approval
                </div>
              : pending.map((a: any) => (
                <div key={a.id} style={{ padding:'7px 8px', marginBottom:6, borderRadius:5,
                  background:`${CA}06`, border:`1px solid ${CA}20` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <span style={{ fontSize:10, color:CA }}>{ACTION_ICONS[a.action] ?? '⊗'}</span>
                      <span style={{ fontSize:8, color:'#a8c4e0', fontFamily:'monospace' }}>
                        {a.action?.replace(/_/g,' ')}
                      </span>
                    </div>
                    <span style={{ fontSize:6, color:`${CA}50`, fontFamily:'monospace', padding:'1px 4px',
                      borderRadius:3, border:`1px solid ${CA}20` }}>
                      {ACTION_LEVEL_LABEL[a.level ?? 3]}
                    </span>
                  </div>
                  <div style={{ fontSize:8, color:'#6a94b0', lineHeight:1.4, marginBottom:6 }}>
                    {a.description?.slice(0, 120)}
                  </div>
                  <div style={{ display:'flex', gap:5 }}>
                    <button onClick={() => approve(a.id)}
                      style={{ flex:1, padding:'3px 0', fontSize:8, borderRadius:4,
                        background:`${CG}15`, border:`1px solid ${CG}30`, color:CG,
                        cursor:'pointer', fontFamily:'monospace' }}>
                      ✓ APPROVE
                    </button>
                    <button onClick={() => deny(a.id)}
                      style={{ flex:1, padding:'3px 0', fontSize:8, borderRadius:4,
                        background:`${CR}10`, border:`1px solid ${CR}25`, color:CR,
                        cursor:'pointer', fontFamily:'monospace' }}>
                      ✕ DENY
                    </button>
                  </div>
                </div>
              ))
          )}

          {/* History */}
          {tab === 'history' && (
            history.length === 0
              ? <div style={{ fontSize:8, color:`${C}25`, fontFamily:'monospace', textAlign:'center', padding:'10px 0' }}>
                  No action history yet
                </div>
              : history.map((h: any) => (
                <div key={h.id} style={{ padding:'4px 0', borderBottom:`1px solid ${C}06`, display:'flex', gap:6, alignItems:'center' }}>
                  <span style={{ fontSize:9, color: h.status === 'APPROVED' ? CG : CR, flexShrink:0 }}>
                    {ACTION_ICONS[h.action] ?? '⊗'}
                  </span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:8, color:'#5a8aa8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {h.action?.replace(/_/g,' ')}
                    </div>
                    <div style={{ fontSize:7, color:`${C}25`, fontFamily:'monospace' }}>
                      {h.status} · L{h.level ?? '?'} · {h.reviewedAt ? new Date(h.reviewedAt).toLocaleDateString() : '—'}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  )
}

function ProactiveInsights() {
  const navigate = useNavigate()
  const [scanning, setScanning] = useState(false)

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['kimmp-proactive'],
    queryFn: () => api.get('/admin/kangqore-immp/proactive/alerts').then(r => r.data),
    refetchInterval: 60_000,
  })
  const alerts: any[] = data?.alerts ?? []

  const dismiss = async (id: string) => {
    await api.post(`/admin/kangqore-immp/proactive/alerts/${id}/dismiss`).catch(() => {})
    refetch()
  }

  const dismissAll = async () => {
    await api.post('/admin/kangqore-immp/proactive/alerts/dismiss-all').catch(() => {})
    refetch()
  }

  const triggerScan = async () => {
    setScanning(true)
    await api.post('/admin/kangqore-immp/proactive/scan').catch(() => {})
    setTimeout(() => { setScanning(false); refetch() }, 3000)
  }

  const handleAction = (alert: any) => {
    if (alert.actionType === 'NAVIGATE' && alert.actionPayload?.route) {
      navigate(alert.actionPayload.route)
    }
    dismiss(alert.id)
  }

  if (!alerts.length && !isLoading) {
    return (
      <div style={{ width:'85%' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'5px 10px', borderRadius:6, background:`${C}04`, border:`1px solid ${C}08` }}>
          <span style={{ fontSize:8, color:`${C}25`, fontFamily:'monospace', letterSpacing:'0.08em' }}>
            ◈ KIMMP INSIGHTS — all clear
          </span>
          <button onClick={triggerScan} disabled={scanning}
            style={{ fontSize:7, padding:'2px 7px', borderRadius:3, cursor:'pointer', fontFamily:'monospace',
              background:'transparent', border:`1px solid ${C}15`, color:`${C}25` }}>
            {scanning ? '…' : 'SCAN'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width:'85%' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:9, color:CA, fontWeight:800, letterSpacing:'0.1em', fontFamily:'monospace' }}>
            ◈ KIMMP INSIGHTS
          </span>
          {alerts.length > 0 && (
            <span style={{ fontSize:7, padding:'1px 5px', borderRadius:10, background:`${CA}25`, border:`1px solid ${CA}40`, color:CA, fontFamily:'monospace' }}>
              {alerts.length}
            </span>
          )}
        </div>
        <div style={{ display:'flex', gap:5 }}>
          <button onClick={triggerScan} disabled={scanning}
            style={{ fontSize:7, padding:'2px 7px', borderRadius:3, cursor:'pointer', fontFamily:'monospace',
              background:'transparent', border:`1px solid ${C}20`, color:`${C}40` }}>
            {scanning ? '…' : 'SCAN'}
          </button>
          {alerts.length > 1 && (
            <button onClick={dismissAll}
              style={{ fontSize:7, padding:'2px 7px', borderRadius:3, cursor:'pointer', fontFamily:'monospace',
                background:'transparent', border:`1px solid ${C}15`, color:`${C}30` }}>
              CLEAR ALL
            </button>
          )}
        </div>
      </div>

      {alerts.slice(0, 5).map((alert: any) => {
        const col      = PROACTIVE_CATEGORY_COLOR[alert.category] ?? C
        const sevColor = alert.severity === 'CRITICAL' ? CR : alert.severity === 'HIGH' ? CA : col
        return (
          <div key={alert.id} style={{ marginBottom:5, padding:'7px 9px', borderRadius:6,
            background:`${sevColor}08`, border:`1px solid ${sevColor}25`, position:'relative' }}>
            <button onClick={() => dismiss(alert.id)}
              style={{ position:'absolute', top:5, right:6, fontSize:9, lineHeight:1,
                background:'transparent', border:'none', color:`${C}30`, cursor:'pointer', padding:2 }}>
              ✕
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
              <span style={{ fontSize:7, padding:'1px 4px', borderRadius:2, fontFamily:'monospace',
                background:`${col}20`, border:`1px solid ${col}35`, color:col }}>
                {alert.category}
              </span>
              <span style={{ fontSize:7, padding:'1px 4px', borderRadius:2, fontFamily:'monospace',
                background:`${sevColor}15`, border:`1px solid ${sevColor}30`, color:sevColor }}>
                {alert.severity}
              </span>
            </div>
            <div style={{ fontSize:9, color:'#a8c8d8', fontWeight:800, fontFamily:'monospace', marginBottom:3 }}>
              {alert.title}
            </div>
            <div style={{ fontSize:8, color:'#5a8aa8', lineHeight:1.5, marginBottom: alert.actionType ? 6 : 0 }}>
              {String(alert.description ?? '').slice(0, 200)}{alert.description?.length > 200 ? '…' : ''}
            </div>
            {alert.actionType && (
              <button onClick={() => handleAction(alert)}
                style={{ fontSize:8, padding:'3px 9px', borderRadius:4, cursor:'pointer', fontFamily:'monospace',
                  letterSpacing:'0.06em', textTransform:'uppercase',
                  background:`${sevColor}15`, border:`1px solid ${sevColor}40`, color:sevColor }}>
                {alert.actionType === 'NAVIGATE' ? '→ VIEW' : '→ ACT'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Goal Engine Panel ────────────────────────────────────────────────────────
const TASK_STATUS_COLOR: Record<string, string> = {
  PENDING:     '#3a4a5a',
  IN_PROGRESS: CG,
  DONE:        '#2a5a3a',
  FAILED:      CR,
  SKIPPED:     '#4a4a4a',
}
const GOAL_STATUS_COLOR: Record<string, string> = {
  PENDING_APPROVAL: CA,
  ACTIVE:           CG,
  COMPLETED:        '#2a8a4a',
  CANCELLED:        '#4a4a4a',
  PAUSED:           '#8a6a2a',
}

function GoalsPanel() {
  const [open, setOpen]             = useState(false)
  const [objective, setObjective]   = useState('')
  const [deadline, setDeadline]     = useState('')
  const [creating, setCreating]     = useState(false)
  const [activeGoal, setActiveGoal] = useState<any | null>(null)
  const [leverage, setLeverage]     = useState<any | null>(null)

  const { data: goalsData, refetch } = useQuery({
    queryKey: ['kimmp-goals'],
    queryFn: () => api.get('/admin/kangqore-immp/goals?limit=10').then(r => r.data),
    enabled: open,
    refetchInterval: open ? 30_000 : false,
  })
  const goals: any[] = goalsData?.goals ?? []

  useEffect(() => {
    if (open && !leverage) {
      api.get('/admin/kangqore-immp/leverage').then(r => setLeverage(r.data)).catch(() => {})
    }
  }, [open])

  const createGoal = async () => {
    if (!objective.trim()) return
    setCreating(true)
    try {
      const res = await api.post('/admin/kangqore-immp/goals', { objective: objective.trim(), deadline: deadline || undefined })
      setActiveGoal(res.data)
      setObjective('')
      setDeadline('')
      refetch()
    } catch {}
    setCreating(false)
  }

  const approveGoal = async (id: string) => {
    try {
      const res = await api.post(`/admin/kangqore-immp/goals/${id}/approve`)
      setActiveGoal(res.data)
      refetch()
    } catch {}
  }

  const cancelGoal = async (id: string) => {
    if (!confirm('Cancel this goal?')) return
    await api.post(`/admin/kangqore-immp/goals/${id}/cancel`).catch(() => {})
    setActiveGoal(null)
    refetch()
  }

  const completeTask = async (goalId: string, taskId: string) => {
    try {
      const res = await api.post(`/admin/kangqore-immp/goals/${goalId}/tasks/${taskId}/complete`, { result: 'Completed by ADMIN' })
      setActiveGoal(res.data)
      refetch()
    } catch {}
  }

  return (
    <div style={{ width:'85%' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'6px 10px', borderRadius:6, background:`${C}06`, border:`1px solid ${C}15`,
          cursor:'pointer', marginBottom: open ? 6 : 0 }}>
        <span style={{ fontSize:9, color:`${C}70`, fontWeight:800, letterSpacing:'0.12em', fontFamily:'monospace' }}>
          ◎ KIMMP GOAL ENGINE
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {leverage && leverage.hoursThisWeek > 0 && (
            <span style={{ fontSize:8, color:CG, fontFamily:'monospace' }}>
              {leverage.hoursThisWeek.toFixed(1)}h saved this week
            </span>
          )}
          {goals.filter(g => g.status === 'PENDING_APPROVAL').length > 0 && (
            <span style={{ fontSize:7, padding:'1px 5px', borderRadius:3, background:`${CA}20`, border:`1px solid ${CA}40`, color:CA, fontFamily:'monospace' }}>
              {goals.filter(g => g.status === 'PENDING_APPROVAL').length} PENDING
            </span>
          )}
          <span style={{ fontSize:8, color:`${C}40` }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div style={{ background:'rgba(0,8,24,0.92)', borderRadius:6, border:`1px solid ${C}15`, overflow:'hidden', padding:10 }}>
          {leverage && (
            <div style={{ display:'flex', gap:8, marginBottom:8, padding:'5px 8px', background:`${C}05`, borderRadius:5 }}>
              <div style={{ textAlign:'center', flex:1 }}>
                <div style={{ fontSize:14, color:CG, fontFamily:'monospace', fontWeight:800 }}>{leverage.hoursThisWeek.toFixed(1)}</div>
                <div style={{ fontSize:7, color:`${C}40`, fontFamily:'monospace' }}>hrs/week saved</div>
              </div>
              <div style={{ textAlign:'center', flex:1 }}>
                <div style={{ fontSize:14, color:C, fontFamily:'monospace', fontWeight:800 }}>{leverage.hoursTotal.toFixed(0)}</div>
                <div style={{ fontSize:7, color:`${C}40`, fontFamily:'monospace' }}>hrs total</div>
              </div>
              <div style={{ textAlign:'center', flex:1 }}>
                <div style={{ fontSize:14, color:CA, fontFamily:'monospace', fontWeight:800 }}>{leverage.tasksCompleted}</div>
                <div style={{ fontSize:7, color:`${C}40`, fontFamily:'monospace' }}>tasks done</div>
              </div>
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:5, marginBottom:8 }}>
            <textarea
              value={objective} onChange={e => setObjective(e.target.value)}
              placeholder="Set a goal e.g. Close 3 school partnerships in Jamshedpur by Q3"
              rows={2}
              style={{ width:'100%', background:`${C}08`, border:`1px solid ${C}20`, borderRadius:4,
                color:'#a8d4e8', fontSize:9, padding:'5px 8px', fontFamily:'monospace',
                outline:'none', resize:'none', boxSizing:'border-box' }}
            />
            <div style={{ display:'flex', gap:5 }}>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                style={{ flex:1, background:`${C}06`, border:`1px solid ${C}15`, borderRadius:4,
                  color:'#7a9ab8', fontSize:8, padding:'4px 6px', fontFamily:'monospace', outline:'none' }}
              />
              <button onClick={createGoal} disabled={creating || !objective.trim()}
                style={{ padding:'4px 12px', fontSize:8, borderRadius:4, fontFamily:'monospace',
                  letterSpacing:'0.08em', textTransform:'uppercase', cursor: creating ? 'wait' : 'pointer',
                  background: creating ? `${C}10` : `${C}20`, border:`1px solid ${C}40`,
                  color: creating ? `${C}40` : C }}>
                {creating ? 'DECOMPOSING…' : '◎ SET GOAL'}
              </button>
            </div>
          </div>

          {activeGoal && (
            <div style={{ background:`${C}05`, border:`1px solid ${C}15`, borderRadius:5, padding:8, marginBottom:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <span style={{ fontSize:9, color:C, fontWeight:800, fontFamily:'monospace' }}>
                  {activeGoal.objective.slice(0, 60)}{activeGoal.objective.length > 60 ? '…' : ''}
                </span>
                <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                  <span style={{ fontSize:7, padding:'1px 5px', borderRadius:3, fontFamily:'monospace',
                    background:`${GOAL_STATUS_COLOR[activeGoal.status] ?? C}20`,
                    border:`1px solid ${GOAL_STATUS_COLOR[activeGoal.status] ?? C}40`,
                    color: GOAL_STATUS_COLOR[activeGoal.status] ?? C }}>
                    {activeGoal.status.replace(/_/g,' ')}
                  </span>
                  {activeGoal.status === 'PENDING_APPROVAL' && (
                    <button onClick={() => approveGoal(activeGoal.id)}
                      style={{ fontSize:7, padding:'2px 7px', borderRadius:3, cursor:'pointer', fontFamily:'monospace',
                        background:`${CG}20`, border:`1px solid ${CG}40`, color:CG }}>
                      ✓ APPROVE
                    </button>
                  )}
                  {['PENDING_APPROVAL','ACTIVE'].includes(activeGoal.status) && (
                    <button onClick={() => cancelGoal(activeGoal.id)}
                      style={{ fontSize:7, padding:'2px 7px', borderRadius:3, cursor:'pointer', fontFamily:'monospace',
                        background:`${CR}10`, border:`1px solid ${CR}30`, color:`${CR}70` }}>
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <div style={{ height:3, background:`${C}15`, borderRadius:2, marginBottom:6 }}>
                <div style={{ height:'100%', borderRadius:2, background:CG, transition:'width 0.5s',
                  width:`${activeGoal.progressPct ?? 0}%` }} />
              </div>
              <div style={{ fontSize:7, color:`${C}30`, fontFamily:'monospace', marginBottom:6 }}>
                {activeGoal.progressPct ?? 0}% complete
                {activeGoal.deadline ? ` · deadline ${new Date(activeGoal.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}` : ''}
              </div>
              {activeGoal.tasks?.map((t: any) => (
                <div key={t.id} style={{ display:'flex', alignItems:'center', gap:6, padding:'3px 0', borderBottom:`1px solid ${C}06` }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', flexShrink:0, background: TASK_STATUS_COLOR[t.status] ?? '#3a4a5a' }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <span style={{ fontSize:8, fontFamily:'monospace',
                      color: t.status === 'DONE' ? '#3a5a3a' : t.status === 'IN_PROGRESS' ? '#a8d4e8' : '#5a7a8a',
                      textDecoration: t.status === 'DONE' ? 'line-through' : 'none' }}>
                      {t.step}. {t.title}
                    </span>
                    {t.actionType && t.actionType !== 'MANUAL' && (
                      <span style={{ fontSize:6, marginLeft:4, color:`${CG}60`, fontFamily:'monospace' }}>[AUTO:{t.actionType}]</span>
                    )}
                  </div>
                  {t.status === 'IN_PROGRESS' && t.actionType === 'MANUAL' && (
                    <button onClick={() => completeTask(activeGoal.id, t.id)}
                      style={{ fontSize:7, padding:'1px 6px', borderRadius:3, cursor:'pointer', fontFamily:'monospace',
                        background:`${CG}15`, border:`1px solid ${CG}30`, color:CG, flexShrink:0 }}>
                      DONE
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {goals.length > 0 && (
            <div>
              <div style={{ fontSize:8, color:`${C}30`, fontFamily:'monospace', letterSpacing:'0.1em', marginBottom:4 }}>ACTIVE GOALS</div>
              {goals.filter(g => g.status !== 'CANCELLED').slice(0, 5).map((g: any) => (
                <div key={g.id} onClick={() => setActiveGoal(g)}
                  style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'4px 0', borderBottom:`1px solid ${C}06`, cursor:'pointer' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <span style={{ fontSize:8, color:'#6a9ab8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block', maxWidth:180 }}>
                      {g.objective}
                    </span>
                    <div style={{ height:2, background:`${C}10`, borderRadius:1, marginTop:2, maxWidth:180 }}>
                      <div style={{ height:'100%', borderRadius:1, background: GOAL_STATUS_COLOR[g.status] ?? C, width:`${g.progressPct ?? 0}%` }} />
                    </div>
                  </div>
                  <span style={{ fontSize:7, padding:'1px 4px', borderRadius:2, fontFamily:'monospace', flexShrink:0, marginLeft:6,
                    background:`${GOAL_STATUS_COLOR[g.status] ?? C}15`, color: GOAL_STATUS_COLOR[g.status] ?? C }}>
                    {g.progressPct ?? 0}%
                  </span>
                </div>
              ))}
            </div>
          )}
          {!goals.length && !activeGoal && (
            <div style={{ fontSize:9, color:`${C}25`, fontFamily:'monospace', textAlign:'center', padding:'8px 0' }}>
              No goals yet — set your first goal above
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── eQORE Lead Intelligence Panel ──────────────────────────────────────────
function EqoreIntelPanel() {
  const [open, setOpen] = useState(false)
  const { data: leads }  = useQuery({ queryKey:['eqore-leads'],  queryFn: () => api.get('/admin/eqore/leads?limit=8').then(r => r.data),  refetchInterval:30000, enabled: open })
  const { data: stats }  = useQuery({ queryKey:['eqore-stats'],  queryFn: () => api.get('/admin/eqore/graph/stats').then(r => r.data),    refetchInterval:60000, enabled: open })
  const { data: opps }   = useQuery({ queryKey:['eqore-opps'],   queryFn: () => api.get('/admin/eqore/sales/opportunities?limit=5').then(r => r.data), refetchInterval:60000, enabled: open })

  const leadList: any[] = Array.isArray(leads) ? leads : (leads?.leads ?? [])
  const statusColor = (s: string) => s === 'GOLDEN' ? '#ffd700' : s === 'HOT' ? CR : s === 'WARM' ? '#ffaa00' : '#5a8aa8'
  const statusCounts = leadList.reduce((a: any, l: any) => { a[l.status] = (a[l.status]||0)+1; return a }, {})

  return (
    <div style={{ width:'85%' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:'100%', background:'none', border:'none', cursor:'pointer', padding:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 12px', background:`rgba(0,136,255,0.06)`, borderRadius:8, border:`1px solid ${CG}20` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:9, color:CG, letterSpacing:'0.15em', fontWeight:700 }}>EQORE — LEAD INTELLIGENCE</span>
            {!!leadList.length && <span style={{ fontSize:8, color:`${CG}80`, background:`${CG}15`, padding:'1px 6px', borderRadius:4 }}>{leadList.length} LEADS</span>}
          </div>
          <span style={{ fontSize:9, color:`${CG}60` }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div style={{ padding:'8px 4px', display:'flex', flexDirection:'column', gap:6 }}>
          {/* Status breakdown */}
          {Object.keys(statusCounts).length > 0 && (
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {Object.entries(statusCounts).map(([s,c]: any) => (
                <div key={s} style={{ padding:'2px 8px', borderRadius:4, border:`1px solid ${statusColor(s)}40`, background:`${statusColor(s)}10`, display:'flex', gap:4, alignItems:'center' }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:statusColor(s) }} />
                  <span style={{ fontSize:8, color:statusColor(s), fontWeight:700 }}>{s}</span>
                  <span style={{ fontSize:8, color:`${statusColor(s)}80` }}>{c}</span>
                </div>
              ))}
            </div>
          )}
          {/* Graph stats */}
          {stats && (
            <div style={{ display:'flex', gap:12, padding:'4px 8px', background:'rgba(0,8,24,0.6)', borderRadius:6 }}>
              {[['NODES', stats.nodeCount ?? stats.nodes ?? '—'], ['EDGES', stats.edgeCount ?? stats.edges ?? '—'], ['CLUSTERS', stats.clusters ?? '—']].map(([l,v]) => (
                <div key={l} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
                  <span style={{ fontSize:11, color:CG, fontWeight:700 }}>{v}</span>
                  <span style={{ fontSize:7, color:`${CG}60`, letterSpacing:'0.1em' }}>{l}</span>
                </div>
              ))}
            </div>
          )}
          {/* Recent leads */}
          {leadList.slice(0,6).map((l: any) => (
            <div key={l.id} style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 6px', background:'rgba(0,8,24,0.4)', borderRadius:5 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:statusColor(l.status), flexShrink:0, boxShadow:`0 0 6px ${statusColor(l.status)}` }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:9, color:'#a0c4d8', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.name ?? l.email ?? 'Unknown'}</div>
                <div style={{ fontSize:8, color:'#5a8aa8' }}>{l.primaryDepartment ?? l.department ?? ''}</div>
              </div>
              <span style={{ fontSize:8, color:statusColor(l.status), fontWeight:700, flexShrink:0 }}>{l.status}</span>
              {l.score != null && <span style={{ fontSize:8, color:`${CG}80`, flexShrink:0 }}>{l.score}</span>}
            </div>
          ))}
          {/* Sales opportunities */}
          {Array.isArray(opps) && opps.length > 0 && (
            <div style={{ marginTop:4 }}>
              <div style={{ fontSize:8, color:`${CG}60`, letterSpacing:'0.12em', marginBottom:3 }}>SALES OPPORTUNITIES</div>
              {opps.slice(0,3).map((o: any) => (
                <div key={o.id} style={{ display:'flex', justifyContent:'space-between', padding:'3px 6px', borderBottom:`1px solid ${CG}08` }}>
                  <span style={{ fontSize:8, color:'#6090a8', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.title ?? o.name ?? o.leadName ?? 'Opportunity'}</span>
                  {o.value != null && <span style={{ fontSize:8, color:CG, flexShrink:0 }}>₹{(Number(o.value)/100).toFixed(0)}</span>}
                </div>
              ))}
            </div>
          )}
          {!leadList.length && !stats && <div style={{ fontSize:9, color:'#5a8aa8', padding:'8px 0', textAlign:'center' }}>No lead data</div>}
        </div>
      )}
    </div>
  )
}

// ─── ALIS — Demand Intelligence Panel ────────────────────────────────────────
function AlisIntelPanel() {
  const [open, setOpen] = useState(false)
  const { data: overview } = useQuery({ queryKey:['alis-overview'],  queryFn: () => api.get('/admin/alis/overview').then(r => r.data),     refetchInterval:60000, enabled: open })
  const { data: depts }    = useQuery({ queryKey:['alis-depts'],     queryFn: () => api.get('/admin/alis/departments').then(r => r.data),   refetchInterval:60000, enabled: open })
  const { data: intent }   = useQuery({ queryKey:['alis-intent'],    queryFn: () => api.get('/admin/alis/buyer-intent').then(r => r.data),  refetchInterval:60000, enabled: open })
  const { data: recs }     = useQuery({ queryKey:['alis-recs'],      queryFn: () => api.get('/admin/alis/growth-recs').then(r => r.data),   refetchInterval:120000, enabled: open })
  const { data: alerts }   = useQuery({ queryKey:['alis-alerts'],    queryFn: () => api.get('/admin/alis/alerts').then(r => r.data),        refetchInterval:30000,  enabled: open })

  const deptList:  any[] = Array.isArray(depts)  ? depts  : (depts?.departments  ?? [])
  const recList:   any[] = Array.isArray(recs)   ? recs   : (recs?.recommendations ?? recs?.recs ?? [])
  const alertList: any[] = Array.isArray(alerts) ? alerts : (alerts?.alerts ?? [])
  const intentList:any[] = Array.isArray(intent) ? intent : (intent?.signals ?? intent?.intents ?? [])

  return (
    <div style={{ width:'85%' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:'100%', background:'none', border:'none', cursor:'pointer', padding:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 12px', background:`rgba(0,68,170,0.08)`, borderRadius:8, border:`1px solid ${CA}20` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:9, color:CA, letterSpacing:'0.15em', fontWeight:700 }}>ALIS — DEMAND INTELLIGENCE</span>
            {alertList.length > 0 && <span style={{ fontSize:8, color:CR, background:`${CR}15`, padding:'1px 6px', borderRadius:4 }}>{alertList.length} ALERTS</span>}
          </div>
          <span style={{ fontSize:9, color:`${CA}60` }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div style={{ padding:'8px 4px', display:'flex', flexDirection:'column', gap:6 }}>
          {/* Overview KPIs */}
          {overview && (
            <div style={{ display:'flex', gap:10, padding:'4px 8px', background:'rgba(0,8,24,0.6)', borderRadius:6, flexWrap:'wrap' }}>
              {[
                ['HOT LEADS',  overview.hotLeads   ?? overview.hot    ?? '—'],
                ['PIPELINE',   overview.pipeline   != null ? `₹${(Number(overview.pipeline)/100).toFixed(0)}` : '—'],
                ['WIN RATE',   overview.winRate    != null ? `${overview.winRate}%` : '—'],
                ['AVG SCORE',  overview.avgScore   ?? '—'],
              ].map(([l,v]) => (
                <div key={l} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1, flex:1 }}>
                  <span style={{ fontSize:11, color:CA, fontWeight:700 }}>{v}</span>
                  <span style={{ fontSize:7, color:`${CA}60`, letterSpacing:'0.08em' }}>{l}</span>
                </div>
              ))}
            </div>
          )}
          {/* Demand by department */}
          {deptList.slice(0,5).map((d: any) => (
            <div key={d.name ?? d.department} style={{ display:'flex', alignItems:'center', gap:6, padding:'3px 0' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                  <span style={{ fontSize:8, color:'#8090b0' }}>{d.name ?? d.department}</span>
                  <span style={{ fontSize:8, color:CA }}>{d.hotLeads ?? d.hot ?? 0} hot</span>
                </div>
                <div style={{ height:2, background:`${CA}20`, borderRadius:1 }}>
                  <div style={{ height:'100%', background:CA, borderRadius:1, width:`${Math.min(100,(d.hotLeads ?? d.hot ?? 0)*8)}%`, transition:'width 0.4s' }} />
                </div>
              </div>
            </div>
          ))}
          {/* Buyer intent */}
          {intentList.slice(0,3).map((i: any, idx: number) => (
            <div key={idx} style={{ fontSize:8, color:'#6090a8', padding:'2px 6px', borderLeft:`2px solid ${CA}40` }}>
              {i.signal ?? i.intent ?? i.description ?? JSON.stringify(i).slice(0,80)}
            </div>
          ))}
          {/* Growth recs */}
          {recList.slice(0,2).map((r: any, idx: number) => (
            <div key={idx} style={{ display:'flex', gap:6, padding:'3px 6px', background:`${CA}08`, borderRadius:4 }}>
              <span style={{ fontSize:8, color:CA }}>↗</span>
              <span style={{ fontSize:8, color:'#8090b0', flex:1 }}>{r.title ?? r.recommendation ?? r.text ?? String(r).slice(0,80)}</span>
            </div>
          ))}
          {/* Alerts */}
          {alertList.slice(0,3).map((a: any, idx: number) => (
            <div key={idx} style={{ display:'flex', gap:6, padding:'3px 6px', background:`${CR}08`, borderRadius:4 }}>
              <span style={{ fontSize:8, color:CR }}>⚠</span>
              <span style={{ fontSize:8, color:'#a06070', flex:1 }}>{a.title ?? a.message ?? String(a).slice(0,80)}</span>
            </div>
          ))}
          {!overview && !deptList.length && <div style={{ fontSize:9, color:'#5a8aa8', padding:'8px 0', textAlign:'center' }}>No ALIS data</div>}
        </div>
      )}
    </div>
  )
}

// ─── VIS — Visibility Intelligence Panel ─────────────────────────────────────
function VisIntelPanel() {
  const [open, setOpen] = useState(false)
  const { data: kpi } = useQuery({ queryKey:['vis-kpi'], queryFn: () => api.get('/admin/kangqore-vis/kpi/overview').then(r => r.data), refetchInterval:120000, enabled: open })

  const metrics: any[] = Array.isArray(kpi) ? kpi : (kpi?.metrics ?? kpi?.kpis ?? [])
  const summary = kpi?.summary ?? kpi

  return (
    <div style={{ width:'85%' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:'100%', background:'none', border:'none', cursor:'pointer', padding:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 12px', background:`rgba(0,212,255,0.04)`, borderRadius:8, border:`1px solid ${C}20` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:9, color:C, letterSpacing:'0.15em', fontWeight:700 }}>VIS — VISIBILITY INTELLIGENCE</span>
          </div>
          <span style={{ fontSize:9, color:`${C}60` }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div style={{ padding:'8px 4px', display:'flex', flexDirection:'column', gap:5 }}>
          {metrics.slice(0,8).map((m: any, i: number) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'3px 0', borderBottom:`1px solid ${C}08` }}>
              <span style={{ fontSize:8, color:'#6090a8' }}>{m.label ?? m.metric ?? m.name ?? `Metric ${i+1}`}</span>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                {m.change != null && (
                  <span style={{ fontSize:7, color: Number(m.change) >= 0 ? '#00cc88' : CR }}>
                    {Number(m.change) >= 0 ? '▲' : '▼'} {Math.abs(Number(m.change))}%
                  </span>
                )}
                <span style={{ fontSize:9, color:C, fontWeight:700 }}>{m.value ?? m.score ?? '—'}</span>
              </div>
            </div>
          ))}
          {summary && typeof summary === 'object' && !Array.isArray(summary) && Object.entries(summary).slice(0,6).map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'2px 0' }}>
              <span style={{ fontSize:8, color:'#7aaac8', textTransform:'uppercase', letterSpacing:'0.06em' }}>{k.replace(/_/g,' ')}</span>
              <span style={{ fontSize:8, color:C }}>{String(v)}</span>
            </div>
          ))}
          {!kpi && <div style={{ fontSize:9, color:'#5a8aa8', padding:'8px 0', textAlign:'center' }}>No VIS data</div>}
        </div>
      )}
    </div>
  )
}

// ─── System Nexus — compact widget group ─────────────────────────────────────
function NexusWidgets() {
  const { data: signals } = useQuery({
    queryKey:        ['nexus-signals'],
    queryFn:         () => api.get('/admin/kangqore-immp/signals?limit=50').then(r => r.data),
    refetchInterval: 15000,
  })
  const sigList: any[] = Array.isArray(signals) ? signals : (signals?.signals ?? [])

  const cnt = (id: string) =>
    sigList.filter((s: any) => s.sourceModule === id || (s.sourceModule as string)?.startsWith(id)).length

  const crossCount = sigList.filter((s: any) =>
    ['DEMAND_ACTIONED','CONTENT_ACTIONED','LEAD_STATUS_CHANGE','DEMAND_SPIKE','CONTENT_GAP'].includes(s.signalType)
  ).length

  return (
    <>
      <Widget label="EQORE"     value={cnt('eqore') || 'LIVE'}              color={C}  glow={cnt('eqore') > 0}              sub="CONVERSATIONS" />
      <Widget label="LEAD INTEL" value={cnt('lead-intelligence') || 'LIVE'} color={CG} glow={cnt('lead-intelligence') > 0}  sub="SCORING" />
      <Widget label="ALIS"      value={cnt('alis') || 'LIVE'}               color={C}  glow={cnt('alis') > 0}               sub="DEMAND OPS" />
      <Widget label="VIS"       value={cnt('vis') || 'LIVE'}                color={CG} glow={cnt('vis') > 0}                sub="VISIBILITY" />
      <Widget label="KIMMP"     value={cnt('kimmp') || 'LIVE'}              color='#00ffcc' glow                            sub="BRAIN" />
      <Widget label="LOOPS"     value={crossCount > 0 ? crossCount : '7'}   color='#00ffcc' glow                            sub="ALL ACTIVE" />
    </>
  )
}

// ─── Orchestration Panel ──────────────────────────────────────────────────────
const AGENT_ICONS: Record<string, string> = {
  SCOUT:                 '◈',
  RESEARCH:              '⟳',
  GOAL_CHECK:            '◎',
  SIGNAL_READ:           '◉',
  LEAD_ANALYSIS:         '◇',
  FINANCIAL_SNAPSHOT:    '▣',
  REPORT_GENERATE:       '▤',
  STRATEGIST:            '△',
  ADVISOR:               '⊕',
  FORECAST:              '↗',
  RISK_ANALYSIS:         '⚠',
  OPPORTUNITY_SCAN:      '⊙',
  COMPETITOR_INTEL:      '⚔',
  WORKFLOW_ORCHESTRATOR: '⊞',
  EXEC_SUMMARY:          '▥',
  DECISION_ENGINE:       '⊗',
  MEMORY_RECALL:         '◫',
  TASK_MANAGER:          '☑',
  MEETING_INTEL:         '⊡',
  ORGANIZATION_HEALTH:   '⊛',
  CLIENT_INTEL:          '◐',
  KNOWLEDGE_ENGINE:      '⊜',
  SIMULATION_ENGINE:     '⟴',
  THREAT_DETECTOR:       '⚡',
  VULNERABILITY_MANAGER: '◬',
  SECURITY_POSTURE:      '⊟',
  RISK_MANAGER:          '◭',
  COMPLIANCE_GUARD:      '⊠',
  ATTACK_ANALYZER:       '⚑',
  ACCESS_GOVERNOR:       '⊘',
  ASSET_GUARDIAN:        '◈',
  THIRD_PARTY_RISK:      '⊖',
  RESILIENCE_MONITOR:    '↺',
  SHADOW_AI_DETECTOR:    '◉',
  AGENT_GUARDIAN:        '⊛',
}

function OrchestrationPanel() {
  const [open, setOpen]           = useState(false)
  const [question, setQuestion]   = useState('')
  const [running, setRunning]     = useState(false)
  const [result, setResult]       = useState<any | null>(null)
  const [runningAgents, setRunningAgents] = useState<string[]>([])
  const [traceOpen, setTraceOpen] = useState(false)
  const [expandedAgents, setExpandedAgents] = useState<Set<number>>(new Set())
  const toggleAgent = (i: number) => setExpandedAgents(prev => {
    const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next
  })

  const { data: historyData, refetch } = useQuery({
    queryKey: ['kimmp-orchestrations'],
    queryFn: () => api.get('/admin/kangqore-immp/orchestrate/history?limit=5').then(r => r.data),
    enabled: open,
    staleTime: 60_000,
  })
  const history: any[] = historyData?.history ?? []

  const run = async () => {
    if (!question.trim()) return
    setRunning(true)
    setResult(null)
    const phases = ['DECOMPOSING…', 'DISPATCHING AGENTS…', 'SYNTHESISING…']
    let pi = 0
    const interval = setInterval(() => {
      setRunningAgents([phases[pi % phases.length]])
      pi++
    }, 2000)
    try {
      const res = await api.post('/admin/kangqore-immp/orchestrate', { question: question.trim() })
      setResult(res.data)
      setTraceOpen(false)
      setExpandedAgents(new Set())
      setQuestion('')
      refetch()
    } catch {}
    clearInterval(interval)
    setRunning(false)
    setRunningAgents([])
  }

  const recColor = (rec: string) => {
    if (!rec) return C
    const r = rec.toUpperCase()
    if (r.startsWith('YES')) return CG
    if (r.startsWith('NO')) return CR
    return CA
  }

  return (
    <div style={{ width:'85%' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'6px 10px', borderRadius:6, background:`${C}06`, border:`1px solid ${C}15`,
          cursor:'pointer', marginBottom: open ? 6 : 0 }}>
        <span style={{ fontSize:9, color:`${C}70`, fontWeight:800, letterSpacing:'0.12em', fontFamily:'monospace' }}>
          ⟳ KIMMP ORCHESTRATOR
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {history.length > 0 && <span style={{ fontSize:8, color:`${C}30`, fontFamily:'monospace' }}>{history.length} runs</span>}
          <span style={{ fontSize:8, color:`${C}40` }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div style={{ background:'rgba(0,8,24,0.92)', borderRadius:6, border:`1px solid ${C}15`, overflow:'hidden', padding:10 }}>

          <div style={{ display:'flex', gap:5, marginBottom:8 }}>
            <input
              value={question} onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !running && run()}
              placeholder="Strategic question e.g. Should we bid on the Jharkhand school digitisation tender?"
              style={{ flex:1, background:`${C}08`, border:`1px solid ${C}20`, borderRadius:4,
                color:'#a8d4e8', fontSize:9, padding:'5px 8px', fontFamily:'monospace', outline:'none' }}
            />
            <button onClick={run} disabled={running || !question.trim()}
              style={{ padding:'4px 12px', fontSize:8, borderRadius:4, fontFamily:'monospace',
                letterSpacing:'0.08em', textTransform:'uppercase', cursor: running ? 'wait' : 'pointer',
                background: running ? `${C}10` : `${C}20`, border:`1px solid ${C}40`,
                color: running ? `${C}40` : C, flexShrink:0, whiteSpace:'nowrap' }}>
              {running ? '…' : '⟳ RUN'}
            </button>
          </div>

          {running && (
            <div style={{ padding:'8px 10px', background:`${C}06`, borderRadius:5, marginBottom:8,
              border:`1px solid ${C}12`, display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:C,
                animation:'blink2 0.8s infinite', flexShrink:0 }} />
              <span style={{ fontSize:8, color:`${C}60`, fontFamily:'monospace' }}>
                {runningAgents[0] ?? 'INITIALISING…'}
              </span>
            </div>
          )}

          {result && !running && (
            <div style={{ background:`${C}05`, border:`1px solid ${C}12`, borderRadius:6, padding:8, marginBottom:8 }}>

              {/* Agent pills row */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:7 }}>
                {result.agentResults?.map((a: any, i: number) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:3, padding:'2px 6px',
                    borderRadius:10, background:`${a.success ? CG : CR}10`, border:`1px solid ${a.success ? CG : CR}25` }}>
                    <span style={{ fontSize:8, fontFamily:'monospace' }}>{AGENT_ICONS[a.agentType] ?? '◈'}</span>
                    <span style={{ fontSize:7, color: a.success ? `${CG}80` : `${CR}60`, fontFamily:'monospace' }}>
                      {a.agentType} {a.durationMs ? `${(a.durationMs/1000).toFixed(1)}s` : ''}
                    </span>
                  </div>
                ))}
                <span style={{ fontSize:7, color:`${C}30`, fontFamily:'monospace', alignSelf:'center' }}>
                  {result.durationMs ? `total ${(result.durationMs/1000).toFixed(1)}s` : ''}
                </span>
              </div>

              {result.recommendation && (
                <div style={{ padding:'6px 8px', borderRadius:5, marginBottom:7,
                  background:`${recColor(result.recommendation)}10`,
                  border:`1px solid ${recColor(result.recommendation)}30` }}>
                  <span style={{ fontSize:8, color: recColor(result.recommendation), fontFamily:'monospace', fontWeight:800 }}>
                    {result.recommendation}
                  </span>
                </div>
              )}

              {result.summary && (
                <p style={{ fontSize:8, color:'#7ab0c8', lineHeight:1.6, margin:'0 0 7px 0' }}>
                  {result.summary}
                </p>
              )}

              {result.evidence?.length > 0 && (
                <div style={{ marginBottom:7 }}>
                  <div style={{ fontSize:7, color:`${C}40`, fontFamily:'monospace', letterSpacing:'0.1em', marginBottom:4 }}>EVIDENCE</div>
                  {result.evidence.map((e: any, i: number) => (
                    <div key={i} style={{ display:'flex', gap:5, padding:'2px 0', borderBottom:`1px solid ${C}06` }}>
                      <span style={{ fontSize:7, color:`${CG}60`, fontFamily:'monospace', flexShrink:0 }}>
                        {AGENT_ICONS[e.agent] ?? '◈'} {e.agent}
                      </span>
                      <span style={{ fontSize:7, color:'#5a8898' }}>{e.finding}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:7 }}>
                {result.riskFactors?.length > 0 && (
                  <div>
                    <div style={{ fontSize:7, color:`${CR}60`, fontFamily:'monospace', letterSpacing:'0.08em', marginBottom:3 }}>RISKS</div>
                    {result.riskFactors.map((r: string, i: number) => (
                      <div key={i} style={{ fontSize:7, color:'#7a5868', marginBottom:2 }}>• {r}</div>
                    ))}
                  </div>
                )}
                {result.nextSteps?.length > 0 && (
                  <div>
                    <div style={{ fontSize:7, color:`${CG}60`, fontFamily:'monospace', letterSpacing:'0.08em', marginBottom:3 }}>NEXT STEPS</div>
                    {result.nextSteps.map((s: string, i: number) => (
                      <div key={i} style={{ fontSize:7, color:'#5a8858', marginBottom:2 }}>{i+1}. {s}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Agent Trace toggle ── */}
              {result.agentResults?.length > 0 && (
                <div style={{ borderTop:`1px solid ${C}10`, paddingTop:6 }}>
                  <button
                    onClick={() => { setTraceOpen(o => !o); setExpandedAgents(new Set()) }}
                    style={{
                      display:'flex', alignItems:'center', gap:5, background:'none', border:'none',
                      cursor:'pointer', padding:0, marginBottom: traceOpen ? 8 : 0,
                    }}
                  >
                    <span style={{ fontSize:7, color:`${C}50`, fontFamily:'monospace', letterSpacing:'0.1em' }}>
                      {traceOpen ? '▾' : '▸'} AGENT TRACE ({result.agentResults.length})
                    </span>
                  </button>

                  {traceOpen && (
                    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                      {result.agentResults.map((a: any, i: number) => {
                        const isExpanded = expandedAgents.has(i)
                        return (
                          <div key={i} style={{ border:`1px solid ${a.success ? CG : CR}20`, borderRadius:4, overflow:'hidden' }}>
                            <button
                              onClick={() => toggleAgent(i)}
                              style={{
                                display:'flex', alignItems:'center', gap:6, width:'100%',
                                padding:'4px 8px', background:`${a.success ? CG : CR}08`,
                                border:'none', cursor:'pointer', textAlign:'left',
                              }}
                            >
                              <span style={{ fontSize:8, fontFamily:'monospace' }}>{AGENT_ICONS[a.agentType] ?? '◈'}</span>
                              <span style={{ fontSize:7, fontFamily:'monospace', fontWeight:700, color: a.success ? CG : CR, flex:1 }}>
                                {a.agentType}
                              </span>
                              {a.role && (
                                <span style={{ fontSize:6, color:`${C}35`, fontFamily:'monospace', flex:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                  {a.role}
                                </span>
                              )}
                              <span style={{ fontSize:6, color:`${C}30`, fontFamily:'monospace', flexShrink:0 }}>
                                {a.durationMs ? `${(a.durationMs/1000).toFixed(1)}s` : ''} {isExpanded ? '▾' : '▸'}
                              </span>
                            </button>
                            {isExpanded && (
                              <div style={{ padding:'6px 8px', background:`${C}03` }}>
                                <pre style={{
                                  fontSize:7, color:'#4a8898', fontFamily:'monospace',
                                  whiteSpace:'pre-wrap', wordBreak:'break-word',
                                  margin:0, lineHeight:1.6,
                                }}>
                                  {a.output || '(no output)'}
                                </pre>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop:6, fontSize:7, color:`${C}25`, fontFamily:'monospace' }}>
                conf: {result.confidence}% · intent: {result.intent}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div>
              <div style={{ fontSize:8, color:`${C}25`, fontFamily:'monospace', letterSpacing:'0.1em', marginBottom:4 }}>RECENT ORCHESTRATIONS</div>
              {history.map((h: any) => (
                <div key={h.id} onClick={() => setResult(h)}
                  style={{ padding:'4px 0', borderBottom:`1px solid ${C}06`, cursor:'pointer' }}>
                  <div style={{ fontSize:8, color:'#5a8aa8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {h.question}
                  </div>
                  <div style={{ fontSize:7, color:`${C}25`, fontFamily:'monospace' }}>
                    {h.intent} · {h.agentsUsed?.length ?? 0} agents · {h.confidence}% conf
                  </div>
                </div>
              ))}
            </div>
          )}

          {!history.length && !result && !running && (
            <div style={{ fontSize:9, color:`${C}25`, fontFamily:'monospace', textAlign:'center', padding:'8px 0' }}>
              Ask a strategic question — KIMMP dispatches the right agents automatically
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Research Panel ───────────────────────────────────────────────────────────
function ResearchPanel() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [domain, setDomain] = useState('')
  const [running, setRunning] = useState(false)
  const [activeResult, setActiveResult] = useState<any | null>(null)

  const { data, refetch } = useQuery({
    queryKey: ['kimmp-research'],
    queryFn: () => api.get('/admin/kangqore-immp/research/results?limit=8').then(r => r.data),
    enabled: open,
    staleTime: 60_000,
  })
  const results: any[] = data?.results ?? []

  const runResearch = async () => {
    if (!question.trim()) return
    setRunning(true)
    try {
      const res = await api.post('/admin/kangqore-immp/research/query', { question: question.trim(), domain: domain.trim() || undefined })
      setActiveResult(res.data)
      refetch()
    } catch {}
    setRunning(false)
  }

  return (
    <div style={{ width:'85%' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'6px 10px', borderRadius:6, background:`${CG}06`, border:`1px solid ${CG}15`,
          cursor:'pointer', marginBottom: open ? 6 : 0 }}>
        <span style={{ fontSize:9, color:`${CG}70`, fontWeight:800, letterSpacing:'0.12em', fontFamily:'monospace' }}>
          ⟳ KIMMP RESEARCH AGENT
        </span>
        <span style={{ fontSize:8, color:`${C}40` }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ background:'rgba(0,8,24,0.92)', borderRadius:6, border:`1px solid ${CG}15`, overflow:'hidden', padding:10 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:5, marginBottom:8 }}>
            <input
              value={question} onChange={e => setQuestion(e.target.value)}
              placeholder="Research question e.g. Which IT companies target schools in Jamshedpur?"
              onKeyDown={e => e.key === 'Enter' && runResearch()}
              style={{ width:'100%', background:`${C}08`, border:`1px solid ${C}20`, borderRadius:4,
                color:'#a8d4e8', fontSize:9, padding:'5px 8px', fontFamily:'monospace',
                outline:'none', boxSizing:'border-box' }}
            />
            <div style={{ display:'flex', gap:5 }}>
              <input
                value={domain} onChange={e => setDomain(e.target.value)}
                placeholder="Domain (optional): education, real-estate, government..."
                style={{ flex:1, background:`${C}06`, border:`1px solid ${C}15`, borderRadius:4,
                  color:'#7a9ab8', fontSize:8, padding:'4px 6px', fontFamily:'monospace', outline:'none' }}
              />
              <button onClick={runResearch} disabled={running || !question.trim()}
                style={{ padding:'4px 12px', fontSize:8, borderRadius:4, fontFamily:'monospace',
                  letterSpacing:'0.08em', textTransform:'uppercase', cursor: running ? 'wait' : 'pointer',
                  background: running ? `${CG}10` : `${CG}20`, border:`1px solid ${CG}40`,
                  color: running ? `${CG}40` : CG }}>
                {running ? 'RESEARCHING…' : '▶ RESEARCH'}
              </button>
            </div>
          </div>

          {activeResult && (
            <div style={{ background:`${CG}06`, border:`1px solid ${CG}20`, borderRadius:5, padding:8, marginBottom:8 }}>
              <div style={{ fontSize:9, color:CG, fontWeight:800, letterSpacing:'0.08em', fontFamily:'monospace', marginBottom:5 }}>
                {activeResult.question}
              </div>
              <p style={{ fontSize:9, color:'#8ab0c8', margin:'0 0 6px 0', lineHeight:1.5 }}>{activeResult.summary}</p>
              {activeResult.recommendation && (
                <div style={{ background:`${C}08`, borderRadius:4, padding:'5px 7px', marginBottom:5 }}>
                  <span style={{ fontSize:8, color:C, fontFamily:'monospace', fontWeight:800 }}>RECOMMENDATION  </span>
                  <span style={{ fontSize:8, color:'#7ab8d8' }}>{activeResult.recommendation}</span>
                </div>
              )}
              {activeResult.marketGaps?.length > 0 && (
                <div style={{ marginBottom:4 }}>
                  <span style={{ fontSize:8, color:`${CG}70`, fontFamily:'monospace', fontWeight:800 }}>MARKET GAPS  </span>
                  {activeResult.marketGaps.map((g: string, i: number) => (
                    <div key={i} style={{ fontSize:8, color:'#6a9ab8', paddingLeft:8 }}>• {g}</div>
                  ))}
                </div>
              )}
              {activeResult.competitors?.length > 0 && (
                <div>
                  <div style={{ fontSize:8, color:`${C}60`, fontFamily:'monospace', fontWeight:800, marginBottom:3 }}>COMPETITORS IDENTIFIED</div>
                  {activeResult.competitors.slice(0, 4).map((c: any, i: number) => (
                    <div key={i} style={{ padding:'4px 0', borderBottom:`1px solid ${C}08` }}>
                      <span style={{ fontSize:8, color:'#8ac8e8', fontFamily:'monospace', fontWeight:800 }}>{c.name}</span>
                      {c.strengths?.slice(0, 2).map((s: string, j: number) => (
                        <div key={j} style={{ fontSize:7, color:'#5a8898', paddingLeft:6 }}>+ {s}</div>
                      ))}
                      {c.weaknesses?.slice(0, 1).map((w: string, j: number) => (
                        <div key={j} style={{ fontSize:7, color:`${CR}60`, paddingLeft:6 }}>− {w}</div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop:5, fontSize:7, color:`${C}30`, fontFamily:'monospace' }}>
                conf: {activeResult.confidence}% • {activeResult.sources?.length ?? 0} sources
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div>
              <div style={{ fontSize:8, color:`${C}30`, fontFamily:'monospace', letterSpacing:'0.1em', marginBottom:4 }}>RECENT RESEARCH</div>
              {results.slice(0, 5).map((r: any) => (
                <div key={r.id} onClick={() => setActiveResult(r)}
                  style={{ display:'flex', justifyContent:'space-between', padding:'4px 0',
                    borderBottom:`1px solid ${C}06`, cursor:'pointer' }}>
                  <span style={{ fontSize:8, color:'#5a8aa8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:180 }}>{r.question}</span>
                  <span style={{ fontSize:7, color:`${CG}50`, fontFamily:'monospace', flexShrink:0 }}>{r.confidence}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Reports Panel ────────────────────────────────────────────────────────────
const REPORT_LABELS: Record<string, string> = {
  DAILY_BRIEFING:   'Daily Briefing',
  WEEKLY_EXECUTIVE: 'Weekly Executive',
  MONTHLY_BOARD:    'Monthly Board',
  SALES_PIPELINE:   'Sales Pipeline',
}

function ReportsPanel() {
  const [open, setOpen] = useState(false)
  const [generating, setGenerating] = useState<string | null>(null)
  const [activeReport, setActiveReport] = useState<any | null>(null)

  const { data, refetch } = useQuery({
    queryKey: ['kimmp-reports'],
    queryFn: () => api.get('/admin/kangqore-immp/reports?limit=10').then(r => r.data),
    enabled: open,
    staleTime: 60_000,
  })
  const reports: any[] = data?.reports ?? []

  const generate = async (type: string) => {
    setGenerating(type)
    try {
      const res = await api.post('/admin/kangqore-immp/reports/generate', { type })
      setActiveReport(res.data)
      refetch()
    } catch {}
    setGenerating(null)
  }

  return (
    <div style={{ width:'85%' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'6px 10px', borderRadius:6, background:`${CA}06`, border:`1px solid ${CA}15`,
          cursor:'pointer', marginBottom: open ? 6 : 0 }}>
        <span style={{ fontSize:9, color:`${CA}90`, fontWeight:800, letterSpacing:'0.12em', fontFamily:'monospace' }}>
          ◉ KIMMP REPORTS
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {reports.length > 0 && <span style={{ fontSize:8, color:`${CA}70`, fontFamily:'monospace' }}>{reports.length} generated</span>}
          <span style={{ fontSize:8, color:`${C}40` }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div style={{ background:'rgba(0,8,24,0.92)', borderRadius:6, border:`1px solid ${CA}15`, overflow:'hidden', padding:10 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, marginBottom:8 }}>
            {Object.entries(REPORT_LABELS).map(([type, label]) => (
              <button key={type} onClick={() => generate(type)} disabled={!!generating}
                style={{ padding:'5px 4px', fontSize:8, borderRadius:4, cursor: generating ? 'wait' : 'pointer',
                  fontFamily:'monospace', letterSpacing:'0.05em', textAlign:'center',
                  background: generating === type ? `${CA}20` : `${CA}10`,
                  border:`1px solid ${generating === type ? CA : `${CA}25`}`,
                  color: generating === type ? CA : `${CA}70` }}>
                {generating === type ? 'GENERATING…' : label}
              </button>
            ))}
          </div>

          {activeReport && (
            <div style={{ background:`${CA}06`, border:`1px solid ${CA}20`, borderRadius:5, padding:8, marginBottom:8, maxHeight:300, overflowY:'auto' }}>
              <div style={{ fontSize:9, color:CA, fontWeight:800, letterSpacing:'0.08em', fontFamily:'monospace', marginBottom:5 }}>
                {activeReport.title}
              </div>
              <pre style={{ fontSize:8, color:'#7a9ab8', margin:0, whiteSpace:'pre-wrap', lineHeight:1.6, fontFamily:'monospace' }}>
                {activeReport.content}
              </pre>
            </div>
          )}

          {reports.length > 0 && (
            <div>
              <div style={{ fontSize:8, color:`${C}30`, fontFamily:'monospace', letterSpacing:'0.1em', marginBottom:4 }}>RECENT REPORTS</div>
              {reports.slice(0, 6).map((r: any) => (
                <div key={r.id} onClick={() => setActiveReport(r)}
                  style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'4px 0', borderBottom:`1px solid ${C}06`, cursor:'pointer' }}>
                  <div>
                    <span style={{ fontSize:8, color:'#6a9ab8', fontFamily:'monospace' }}>{r.title}</span>
                    <span style={{ fontSize:7, color:`${C}25`, fontFamily:'monospace', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:180 }}>{r.summary}</span>
                  </div>
                  <span style={{ fontSize:7, color:`${CA}60`, fontFamily:'monospace', flexShrink:0, marginLeft:8 }}>
                    {REPORT_LABELS[r.type] ?? r.type}
                  </span>
                </div>
              ))}
            </div>
          )}
          {!reports.length && !activeReport && (
            <div style={{ fontSize:9, color:`${C}25`, fontFamily:'monospace', textAlign:'center', padding:'8px 0' }}>
              No reports yet — click a report type to generate
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Memory Panel ─────────────────────────────────────────────────────────────
function MemoryPanel() {
  const [open, setOpen] = useState(false)
  const { data } = useQuery({
    queryKey: ['kimmp-memory'],
    queryFn: () => api.get('/admin/kangqore-immp/memory').then(r => r.data),
    refetchInterval: 120_000,
    enabled: open,
  })
  const memories: any[] = data?.memories ?? []
  const typeColor = (t: string) => t === 'USER_PREFERENCE' ? CA : t === 'ORG_KNOWLEDGE' ? CG : C

  return (
    <div style={{ width:'85%' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'6px 10px', borderRadius:6, background:`${C}06`, border:`1px solid ${C}15`,
          cursor:'pointer', marginBottom: open ? 6 : 0, transition:'all 0.2s' }}>
        <span style={{ fontSize:9, color:`${C}70`, fontWeight:800, letterSpacing:'0.12em', fontFamily:'monospace' }}>
          ◈ KIMMP MEMORY
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {memories.length > 0 && (
            <span style={{ fontSize:8, color:`${CG}70`, fontFamily:'monospace' }}>{memories.length} stored</span>
          )}
          <span style={{ fontSize:8, color:`${C}40` }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div style={{ background:'rgba(0,8,24,0.92)', borderRadius:6, border:`1px solid ${C}15`, overflow:'hidden' }}>
          {!memories.length ? (
            <div style={{ padding:'10px', fontSize:9, color:`${C}30`, fontFamily:'monospace', textAlign:'center' }}>
              No memories stored yet. KIMMP learns from every interaction.
            </div>
          ) : (
            memories.slice(0, 15).map((m: any) => (
              <div key={m.id} style={{ display:'flex', gap:8, padding:'5px 10px', borderBottom:`1px solid ${C}08`, alignItems:'flex-start' }}>
                <span style={{ fontSize:7, color:typeColor(m.memoryType), fontFamily:'monospace', flexShrink:0, marginTop:1 }}>
                  {m.memoryType === 'USER_PREFERENCE' ? 'PREF' : m.memoryType === 'ORG_KNOWLEDGE' ? 'ORG' : 'WF'}
                </span>
                <div style={{ flex:1, minWidth:0 }}>
                  <span style={{ fontSize:8, color:`${C}60`, fontFamily:'monospace', display:'block' }}>{m.key}</span>
                  <span style={{ fontSize:8, color:'#6a9ab8', lineHeight:1.3, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.value}</span>
                </div>
                <span style={{ fontSize:7, color:`${C}25`, fontFamily:'monospace', flexShrink:0 }}>{Math.round(m.confidence * 100)}%</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Notification Centre ──────────────────────────────────────────────────────
function NotificationCentre({ signals }: { signals: LiveSignal[] }) {
  const [open, setOpen] = useState(false)
  const [read, setRead] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('nfc-read') || '[]')) } catch { return new Set() }
  })

  const markAllRead = () => {
    const ids = signals.map(s => s.id)
    const next = new Set([...read, ...ids])
    setRead(next)
    localStorage.setItem('nfc-read', JSON.stringify([...next].slice(-200)))
  }

  const unread = signals.filter(s => !read.has(s.id)).length

  if (!signals.length) return null
  return (
    <div style={{ width:'85%' }}>
      <button onClick={() => { setOpen(o => !o); if (!open) markAllRead() }}
        style={{
          width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'6px 10px', borderRadius:6, background:`${CG}08`, border:`1px solid ${CG}20`,
          cursor:'pointer', marginBottom: open ? 6 : 0, transition:'all 0.2s',
        }}>
        <span style={{ fontSize:9, color:CG, fontWeight:800, letterSpacing:'0.12em', fontFamily:'monospace' }}>
          ◉ NOTIFICATION CENTRE
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {unread > 0 && (
            <span style={{
              fontSize:8, background:CR, color:'#4ab6d4', borderRadius:10,
              padding:'1px 5px', fontWeight:800, fontFamily:'monospace',
            }}>{unread}</span>
          )}
          <span style={{ fontSize:8, color:`${CG}60` }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div style={{ background:'rgba(0,8,24,0.92)', borderRadius:6, border:`1px solid ${CG}20`, overflow:'hidden' }}>
          {signals.slice(0, 20).map((s, i) => {
            const sc = s.severity === 'CRITICAL' ? CR : s.severity === 'HIGH' ? CA : CG
            return (
              <div key={s.id + i} style={{
                display:'flex', alignItems:'flex-start', gap:6, padding:'5px 10px',
                borderBottom:`1px solid ${CG}08`,
                background: read.has(s.id) ? 'transparent' : `${sc}05`,
              }}>
                <div style={{ width:5, height:5, borderRadius:'50%', marginTop:3, flexShrink:0, background:sc }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:8, color:sc, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                      {s.sourceModule}
                    </span>
                    <span style={{ fontSize:7, color:`${C}30`, fontFamily:'monospace' }}>{timeAgo(s.createdAt)}</span>
                  </div>
                  <span style={{ fontSize:8, color:'#5a8aa8', lineHeight:1.3, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {s.signalValue}
                  </span>
                </div>
              </div>
            )
          })}
          <button onClick={markAllRead}
            style={{ width:'100%', padding:'5px', background:'transparent', border:'none', cursor:'pointer',
              fontSize:8, color:`${CG}50`, fontFamily:'monospace', letterSpacing:'0.1em' }}>
            MARK ALL READ
          </button>
        </div>
      )}
    </div>
  )
}

// ─── CSS keyframes ─────────────────────────────────────────────────────────────
const CSS = `
@keyframes orbit-cw    { to { transform: rotate(360deg);  } }
@keyframes orbit-ccw   { to { transform: rotate(-360deg); } }
@keyframes scanline    { 0%{top:0;opacity:.5} 80%{opacity:.3} 100%{top:100%;opacity:0} }
@keyframes blink2      { 0%,100%{opacity:1} 50%{opacity:.2} }
@keyframes datapulse   { 0%,100%{opacity:.6} 50%{opacity:1} }
@keyframes hexspin     { to{transform:rotate(60deg)} }
@keyframes waveBar     { from{transform:scaleY(0.3)} to{transform:scaleY(1)} }
@keyframes arcPulse    { 0%,100%{opacity:1} 50%{opacity:0.55} }
@keyframes arcPulseFast{ 0%,100%{opacity:1} 50%{opacity:0.35} }
@keyframes flowLine    { 0%{opacity:1;stroke-dashoffset:220} 70%{opacity:.7} 100%{opacity:0;stroke-dashoffset:0} }
@keyframes critFlash   { 0%,100%{opacity:1} 40%,60%{opacity:.15} }
@keyframes bootArc     { from{opacity:0;stroke-dasharray:0 260} to{opacity:1;stroke-dasharray:260 0} }
@keyframes particlePop { 0%,100%{opacity:0;r:0} 30%,70%{opacity:.7;r:1.4} }
@keyframes widgetPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.88;transform:scale(1.012)} }
.live-blink  { animation: blink2 1.4s ease-in-out infinite; }
.data-pulse  { animation: datapulse 2s ease-in-out infinite; }
.widget-alive{ animation: widgetPulse 2.8s ease-in-out infinite; transition: all 0.3s; cursor: pointer; }
.widget-alive:hover { transform: scale(1.05); filter: drop-shadow(0 0 8px #4ab6d4); }
.hud-module  { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s; transform-origin: 50% 50%; cursor: pointer; }
.hud-module:hover { transform: scale(1.1); filter: brightness(1.5) drop-shadow(0 0 12px #4ab6d4); z-index: 10; }
.hud-label   { transition: all 0.3s; }
.hud-module:hover .hud-label { fill: #4ab6d4; text-shadow: 0 0 15px #4ab6d4; font-size: 8px; font-weight: 900; }
`

// ─── HUD Section Label ────────────────────────────────────────────────────────
function SectionLabel({ text, color = C }: { text: string; color?: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5, margin:'4px 0 2px' }}>
      <div style={{ width:10, height:1, background:color, boxShadow:`0 0 4px ${color}` }} />
      <span style={{ fontSize:6, color:`${color}70`, letterSpacing:'0.22em', fontWeight:900,
        fontFamily:'monospace', whiteSpace:'nowrap' }}>{text}</span>
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${color}40,transparent)` }} />
    </div>
  )
}

// ─── Compact Widget ────────────────────────────────────────────────────────────
function Widget({ label, value, sub, color = C, glow = false, onClick }: {
  label: string; value: string | number; sub?: string
  color?: string; glow?: boolean; onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={glow ? 'widget-alive relative p-[1px]' : 'relative p-[1px]'}
      style={{
        background: glow ? `linear-gradient(135deg, ${color}90 0%, ${color}30 100%)` : `linear-gradient(135deg, ${color}40 0%, ${color}10 100%)`,
        clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s',
      }}
    >
      <div className="relative p-2 w-full h-full flex flex-col justify-between" style={{
        background: `linear-gradient(135deg, rgba(0,8,20,0.95) 0%, rgba(0,18,40,0.9) 100%)`,
        clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
        minHeight: 52,
      }}>
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${color}05 2px, ${color}05 3px)`
        }} />

        {/* Small corner accents */}
        <div style={{ position:'absolute', top:0, left:6, width:10, height:1, background:color }} />
        <div style={{ position:'absolute', top:6, left:0, width:1, height:10, background:color }} />
        <div style={{ position:'absolute', bottom:0, right:6, width:10, height:1, background:color }} />
        <div style={{ position:'absolute', bottom:6, right:0, width:1, height:10, background:color }} />

        {glow && (
          <div className="live-blink" style={{
            position: 'absolute', top: 4, right: 4,
            width: 3, height: 3, borderRadius: '50%',
            background: color, boxShadow: `0 0 6px ${color}`,
          }} />
        )}
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 5.5, color: `${color}80`, letterSpacing: '0.15em',
            fontWeight: 800, textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 2,
          }}>
            {label}
          </div>
          <div style={{
            fontSize: 12, fontWeight: 800, color, fontFamily: 'monospace', lineHeight: 1.1,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            textShadow: glow ? `0 0 8px ${color}80` : 'none'
          }}>
            {value}
          </div>
          {sub && (
            <div style={{
              fontSize: 6, color: `${color}50`, marginTop: 2,
              fontFamily: 'monospace', letterSpacing: '0.08em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {sub}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Widget Modal ─────────────────────────────────────────────────────────────

function GoalModalContent() {
  const { data } = useQuery({
    queryKey: ['goals-modal'],
    queryFn: () => api.get('/admin/kangqore-immp/goals?limit=8').then(r => r.data),
    staleTime: 30_000,
  })
  const goals: any[] = data?.goals ?? []
  const STATUS_COLOR: Record<string, string> = {
    ACTIVE: CG, PENDING_APPROVAL: CA, COMPLETED: C, CANCELLED: CR,
  }
  return (
    <>
      <MRow label="TOTAL GOALS"    value={goals.length}                                              />
      <MRow label="ACTIVE"         value={goals.filter(g => g.status === 'ACTIVE').length}     color={CG} />
      <MRow label="PENDING"        value={goals.filter(g => g.status === 'PENDING_APPROVAL').length} color={CA} />
      <MRow label="COMPLETED"      value={goals.filter(g => g.status === 'COMPLETED').length}  color={C}  />
      {goals.length > 0 && (
        <div style={{ marginTop:10 }}>
          <div style={{ fontSize:8, color:`${C}40`, letterSpacing:'0.12em', marginBottom:6 }}>ACTIVE GOALS</div>
          {goals.filter(g => g.status !== 'CANCELLED').slice(0,5).map((g: any) => (
            <div key={g.id} style={{ padding:'6px 8px', marginBottom:4, borderRadius:5,
              border:`1px solid ${STATUS_COLOR[g.status] ?? C}20`, background:`rgba(0,8,24,0.6)` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:9, color: STATUS_COLOR[g.status] ?? C, fontFamily:'monospace', fontWeight:800 }}>{g.status}</span>
                {g.deadline && <span style={{ fontSize:7, color:`${C}30`, fontFamily:'monospace' }}>{new Date(g.deadline).toLocaleDateString('en-GB')}</span>}
              </div>
              <div style={{ fontSize:9, color:`${C}80`, fontFamily:'monospace', marginTop:3 }}>{g.objective}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function TwinModalContent() {
  const { data } = useQuery<any>({
    queryKey: ['kimmp-twin'],
    staleTime: 25 * 60_000,
  })
  const twin = data ?? { revenueHealth:0, pipelineVelocity:0, executionCapacity:0, riskExposure:0, marketPosition:0, overallScore:0 }
  const sc = (v: number) => v >= 70 ? CG : v >= 40 ? CA : CR
  const dims = [
    { label:'TWIN SCORE',  val: twin.overallScore,       color: sc(twin.overallScore)       },
    { label:'REVENUE',     val: twin.revenueHealth,      color: sc(twin.revenueHealth)      },
    { label:'PIPELINE',    val: twin.pipelineVelocity,   color: sc(twin.pipelineVelocity)   },
    { label:'MARKET',      val: twin.marketPosition,     color: sc(twin.marketPosition)     },
    { label:'EXECUTION',   val: twin.executionCapacity,  color: sc(twin.executionCapacity)  },
    { label:'RISK EXP',    val: twin.riskExposure,       color: sc(100 - twin.riskExposure) },
  ]
  return (
    <>
      {dims.map(({ label, val, color }) => (
        <div key={label} style={{ display:'flex', alignItems:'center', gap:10, padding:'5px 0', borderBottom:`1px solid ${C}10` }}>
          <span style={{ fontSize:8, color:`${C}50`, fontFamily:'monospace', letterSpacing:'0.1em', width:80 }}>{label}</span>
          <div style={{ flex:1, height:4, background:`${C}10`, borderRadius:2, overflow:'hidden' }}>
            <div style={{ width:`${val}%`, height:'100%', background:color, boxShadow:`0 0 6px ${color}`, borderRadius:2, transition:'width 0.8s ease' }} />
          </div>
          <span style={{ fontSize:11, fontWeight:800, color, fontFamily:'monospace', minWidth:28, textAlign:'right' }}>{val}</span>
        </div>
      ))}
    </>
  )
}

function MRow({ label, value, color = C }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'6px 0', borderBottom:`1px solid ${C}10` }}>
      <span style={{ fontSize:9, color:`${C}50`, fontFamily:'monospace', letterSpacing:'0.12em' }}>{label}</span>
      <span style={{ fontSize:12, fontWeight:800, color, fontFamily:'monospace' }}>{value}</span>
    </div>
  )
}

type ModalType = 'finance' | 'clients' | 'signals' | 'approvals' | 'decisions' | 'insights' | 'goals' | 'research' | 'twin'

function WidgetModal({ type, data, onClose }: {
  type: ModalType
  data: {
    mrrCr: number; revCr: number; arrCr: number; mrrTrend: string
    kpis: any; analytics: any
    recentSignals: LiveSignal[]; critical: number; liveApprovals: any[]
    insights: any[]
  }
  onClose: () => void
}) {
  const navigate = useNavigate()

  const ROUTE: Record<ModalType, string> = {
    finance:   '/kangqore-view/admin/finance',
    clients:   '/kangqore-view/admin/clients',
    signals:   '/kangqore-view/admin/kangqore-immp',
    approvals: '/kangqore-view/admin/kangqore-immp',
    decisions: '/kangqore-view/admin/kangqore-immp',
    insights:  '/kangqore-view/admin/kangqore-immp',
    goals:     '/kangqore-view/admin/kangqore-immp',
    research:  '/kangqore-view/admin/kangqore-immp',
    twin:      '/kangqore-view/admin/kangqore-immp',
  }
  const TITLE: Record<ModalType, string> = {
    finance:   'FINANCIAL OVERVIEW',
    clients:   'CLIENT PORTFOLIO',
    signals:   'SIGNAL LEDGER',
    approvals: 'PENDING APPROVALS',
    decisions: 'DECISION QUEUE',
    insights:  'INTELLIGENCE INSIGHTS',
    goals:     'GOAL ENGINE',
    research:  'RESEARCH AGENTS',
    twin:      'DIGITAL TWIN STATUS',
  }
  const COLOR: Record<ModalType, string> = {
    finance: CA, clients: CG, signals: CR, approvals: CA,
    decisions: C, insights: CR, goals: CG, research: C, twin: C,
  }

  const color = COLOR[type]
  const { mrrCr, revCr, arrCr, mrrTrend, kpis, analytics, recentSignals, critical, liveApprovals, insights } = data

  const renderContent = () => {
    switch (type) {
      case 'finance':
        return (
          <>
            <MRow label="MRR"                value={`₹${mrrCr.toFixed(2)}Cr`}         color={CG} />
            <MRow label="MRR TREND"          value={mrrTrend}                           color={mrrTrend.startsWith('+') ? CG : CR} />
            <MRow label="REVENUE (LAST MTH)" value={`₹${revCr.toFixed(2)}Cr`}         color={CG} />
            <MRow label="ARR"                value={`₹${arrCr.toFixed(2)}Cr`}         color={C}  />
            <MRow label="FORECAST (30D)"     value={`₹${(revCr * 1.16).toFixed(2)}Cr`} color={CA} />
            <MRow label="CASH FORECAST (30D)"value={`₹${(revCr * 1.08).toFixed(2)}Cr`} color={CA} />
            {kpis?.activeContracts != null && <MRow label="ACTIVE CONTRACTS" value={kpis.activeContracts} color={CG} />}
            {kpis?.totalBudget > 0 && (
              <MRow label="BUDGET UTILISATION" value={`${Math.round((kpis.totalSpend / kpis.totalBudget) * 100)}%`} />
            )}
          </>
        )

      case 'clients':
        return (
          <>
            <MRow label="TOTAL CLIENTS"  value={analytics.clients      ?? 0} color={CG} />
            <MRow label="PARTNERS"       value={analytics.partners     ?? 0} color={C}  />
            <MRow label="TOTAL USERS"    value={analytics.total_users  ?? 0} color={C}  />
            <MRow label="TOTAL VISITS"   value={analytics.total_visits ?? 0} color={CG} />
          </>
        )

      case 'signals':
        return (
          <>
            <MRow label="TOTAL IN LEDGER" value={recentSignals.length}  color={C}  />
            <MRow label="CRITICAL"        value={critical}              color={critical > 0 ? CR : CG} />
            <div style={{ marginTop:10 }}>
              <div style={{ fontSize:8, color:`${C}40`, letterSpacing:'0.12em', marginBottom:6 }}>RECENT SIGNALS</div>
              {recentSignals.slice(0, 7).map((s, i) => (
                <div key={i} style={{ display:'flex', gap:8, padding:'5px 0',
                  borderBottom:`1px solid ${C}08`, alignItems:'flex-start' }}>
                  <span style={{ fontSize:8, minWidth:58, fontFamily:'monospace', fontWeight:800,
                    color: s.severity === 'CRITICAL' ? CR : s.severity === 'HIGH' ? CA : CG }}>
                    {s.severity}
                  </span>
                  <span style={{ fontSize:8, color:`${C}70`, fontFamily:'monospace', flex:1, lineHeight:1.4 }}>
                    {s.signalType}
                  </span>
                  <span style={{ fontSize:7, color:`${C}30`, fontFamily:'monospace', whiteSpace:'nowrap' }}>
                    {timeAgo(s.createdAt)}
                  </span>
                </div>
              ))}
              {recentSignals.length === 0 && (
                <div style={{ fontSize:9, color:`${C}30`, fontFamily:'monospace' }}>No signals in ledger</div>
              )}
            </div>
          </>
        )

      case 'approvals':
        return (
          <>
            <MRow label="PENDING APPROVALS" value={liveApprovals.length} color={liveApprovals.length > 0 ? CA : CG} />
            <div style={{ marginTop:10 }}>
              {liveApprovals.slice(0, 5).map((a: any, i) => (
                <div key={i} style={{ padding:'7px 10px', marginBottom:5, borderRadius:6,
                  border:`1px solid ${CA}25`, background:`${CA}05` }}>
                  <div style={{ fontSize:9, color:CA, fontFamily:'monospace', fontWeight:800 }}>
                    {a.type ?? a.actionType}
                  </div>
                  <div style={{ fontSize:8, color:`${C}55`, fontFamily:'monospace', marginTop:3, lineHeight:1.4 }}>
                    {a.description}
                  </div>
                </div>
              ))}
              {liveApprovals.length === 0 && (
                <div style={{ fontSize:9, color:`${C}30`, fontFamily:'monospace' }}>All clear — no pending approvals</div>
              )}
            </div>
          </>
        )

      case 'decisions':
      case 'insights':
        return (
          <>
            <MRow label="TOTAL INSIGHTS" value={insights.length}                                         color={C}  />
            <MRow label="CRITICAL"       value={insights.filter(i => i.priority === 'critical').length} color={CR} />
            <MRow label="HIGH"           value={insights.filter(i => i.priority === 'high').length}     color={CA} />
            <div style={{ marginTop:10 }}>
              <div style={{ fontSize:8, color:`${C}40`, letterSpacing:'0.12em', marginBottom:6 }}>TOP INSIGHTS</div>
              {insights.slice(0, 5).map((ins: any, i) => (
                <div key={i} style={{ padding:'6px 9px', marginBottom:4, borderRadius:5,
                  border:`1px solid ${ins.priority === 'critical' ? CR : ins.priority === 'high' ? CA : C}20`,
                  background:`rgba(0,8,24,0.6)` }}>
                  <div style={{ fontSize:8, fontFamily:'monospace', fontWeight:800, letterSpacing:'0.08em',
                    color: ins.priority === 'critical' ? CR : ins.priority === 'high' ? CA : CG }}>
                    {ins.priority?.toUpperCase()}
                  </div>
                  <div style={{ fontSize:9, color:`${C}80`, fontFamily:'monospace', marginTop:3, lineHeight:1.4 }}>
                    {ins.title ?? ins.text ?? ins.description}
                  </div>
                </div>
              ))}
            </div>
          </>
        )

      case 'goals':
        return <GoalModalContent />

      case 'research':
        return (
          <>
            <MRow label="STATUS"          value="ACTIVE" color={CG} />
            <MRow label="TOTAL AGENTS"    value={35}     color={C}  />
            <MRow label="LAYERS"          value={3}      color={C}  />
            <div style={{ marginTop:10, fontSize:8, color:`${C}60`, fontFamily:'monospace', lineHeight:1.8 }}>
              <div style={{ color:`${C}80`, fontWeight:800, marginBottom:4, letterSpacing:'0.1em' }}>AGENT ARCHITECTURE</div>
              <div>● Intelligence Layer — 17 agents</div>
              <div>● Operations Layer —  6 agents</div>
              <div>● Sentinel Layer   — 12 agents</div>
            </div>
          </>
        )

      case 'twin':
        return <TwinModalContent />
    }
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position:'fixed', inset:0, zIndex:999,
        background:'rgba(0,4,14,0.78)', backdropFilter:'blur(5px)',
        display:'flex', alignItems:'center', justifyContent:'center' }}
    >
      <div style={{
        width:460, maxHeight:'80vh', display:'flex', flexDirection:'column',
        background:'linear-gradient(135deg, rgba(0,12,32,0.99) 0%, rgba(0,6,18,0.99) 100%)',
        border:`1px solid ${color}35`, borderTop:`2px solid ${color}`,
        borderRadius:10, boxShadow:`0 0 50px ${color}18, 0 0 100px ${color}06`,
        fontFamily:'monospace',
      }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'12px 16px 10px', borderBottom:`1px solid ${color}18`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:2, height:14, background:color, boxShadow:`0 0 6px ${color}`, borderRadius:1 }} />
            <span style={{ fontSize:10, fontWeight:900, color, letterSpacing:'0.2em' }}>{TITLE[type]}</span>
          </div>
          <button onClick={onClose} style={{
            background:'none', border:`1px solid ${C}20`, borderRadius:4,
            cursor:'pointer', color:`${C}60`, fontSize:12, lineHeight:1, padding:'3px 7px',
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding:'12px 16px', overflowY:'auto', flex:1 }}>
          {renderContent()}
        </div>

        {/* Footer */}
        <div style={{ padding:'10px 16px', borderTop:`1px solid ${color}12`,
          flexShrink:0, display:'flex', justifyContent:'flex-end' }}>
          <button
            onClick={() => { navigate(ROUTE[type]); onClose() }}
            style={{
              display:'flex', alignItems:'center', gap:6,
              background:`${color}10`, border:`1px solid ${color}40`, borderRadius:5,
              padding:'6px 14px', cursor:'pointer', color, fontSize:9,
              fontWeight:800, letterSpacing:'0.15em', transition:'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${color}20` }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${color}10` }}
          >
            OPEN FULL PAGE ↗
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function AdminOverview() {
  const navigate  = useNavigate()
  const clock     = useClock()
  const [modal, setModal] = useState<ModalType | null>(null)
  const uptime   = useUptime()

  // Live signal stream via WebSocket
  const { lastSignal, criticalAlert, recentSignals } = useSignalStream()

  // Real-time approval requests from KIMMP agents
  const [liveApprovals, setLiveApprovals] = useState<any[]>([])
  useEffect(() => {
    try {
      const socket = getSocket()
      const onApproval = (req: any) => {
        setLiveApprovals(prev => [req, ...prev].slice(0, 10))
      }
      socket.on('kimmp:approval_request', onApproval)
      return () => { socket.off('kimmp:approval_request', onApproval) }
    } catch {}
  }, [])

  // Boot sequence — phases 0→4 gate each HUD layer fading in
  const [bootPhase, setBootPhase] = useState(0)
  useEffect(() => {
    const ts = [
      setTimeout(() => setBootPhase(1), 300),
      setTimeout(() => setBootPhase(2), 800),
      setTimeout(() => setBootPhase(3), 1400),
      setTimeout(() => setBootPhase(4), 2000),
    ]
    return () => ts.forEach(clearTimeout)
  }, [])

  // Radar sweep angle — full rotation every 4s
  const [sweep, setSweep] = useState(0)
  useEffect(() => {
    const i = setInterval(() => setSweep(s => (s + 1.5) % 360), 17) // ~60fps
    return () => clearInterval(i)
  }, [])

  // Analytics
  const { data: raw } = useQuery({
    queryKey: ['ov-analytics'],
    queryFn: () => api.get('/analytics').then(r => r.data),
    refetchInterval: 30_000,
  })
  const analytics = raw ?? { total_users:9, total_consultations:0, total_visits:91, clients:40, partners:20, investors:20, job_seekers:20 }

  // Real financial KPIs from DB
  const { data: kpis } = useQuery({
    queryKey: ['financial-kpis'],
    queryFn: () => api.get('/admin/financial-kpis').then(r => r.data),
    refetchInterval: 60_000,
  })

  // Live system health — polls every 15 s
  const { data: healthData } = useQuery({
    queryKey: ['health-deep'],
    queryFn: () => api.get('/admin/health-deep').then(r => r.data),
    refetchInterval: 15_000,
  })

  // User role — gate arc visibility
  const userRole = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}').role ?? 'ADMIN' } catch { return 'ADMIN' }
  }, [])

  // KIMMP
  const storeInsights = useKIMMPStore(s => s.insights)
  const insights = storeInsights.length ? storeInsights : KIMMP_MOCK
  const critical = insights.filter(i => i.priority === 'critical').length
  const conf     = Math.round(insights.reduce((a, i) => a + i.confidence, 0) / (insights.length || 1))

  // Live tickers — used as animated fallback when DB has no records yet
  const health    = useTicker(97,   0.003)
  const mrrTick   = useTicker(2.45, 0.004)
  const revTick   = useTicker(1.62, 0.006)
  const visits    = useTicker(analytics.total_visits || 91, 0.015)
  const agents    = useTicker(31,   0.02)

  // Financial values: real DB data in priority; ticker as warm fallback (amounts assumed ₹)
  const mrrCr  = kpis?.revenueMTD       > 0 ? kpis.revenueMTD       / 1e7 : mrrTick
  const revCr  = kpis?.revenueLastMonth > 0 ? kpis.revenueLastMonth / 1e7 : revTick
  const arrCr  = kpis?.arr              > 0 ? kpis.arr              / 1e7 : mrrCr * 12
  const mrrTrend = kpis?.revenueMTD > 0 && kpis?.revenueLastMonth > 0
    ? `${(((kpis.revenueMTD - kpis.revenueLastMonth) / kpis.revenueLastMonth) * 100).toFixed(0)}%`
    : '+18%'

  const timeStr = clock.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' })
  const dateStr = clock.toLocaleDateString('en-GB', { weekday:'short', day:'2-digit', month:'short', year:'numeric' })

  return (
    <div style={{
      width:'100%', height:'100vh', overflow:'hidden', position:'relative',
      background:'radial-gradient(ellipse at 50% 30%, #001433 0%, #000c22 50%, #000510 100%)',
      fontFamily:'monospace',
    }}>
      <style>{CSS}</style>

      {/* Grid overlay */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
        backgroundImage:`
          linear-gradient(${C}15 1px, transparent 1px),
          linear-gradient(90deg, ${C}15 1px, transparent 1px),
          linear-gradient(${C}05 1px, transparent 1px),
          linear-gradient(90deg, ${C}05 1px, transparent 1px)
        `,
        backgroundSize:'100px 100px, 100px 100px, 20px 20px, 20px 20px',
        backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px'
      }} />

      {/* Scan line */}
      <div style={{ position:'absolute', left:0, right:0, height:2,
        background:`linear-gradient(90deg, transparent, ${C}60, transparent)`,
        animation:'scanline 6s linear infinite', pointerEvents:'none', zIndex:1 }} />

      {/* Corner decorations */}
      {[{t:0,l:0,bt:'bottomRight'},{t:0,r:0,bt:'bottomLeft'},{b:0,l:0,bt:'topRight'},{b:0,r:0,bt:'topLeft'}].map((pos,i)=>(
        <svg key={i} width={60} height={60} style={{ position:'absolute', ...pos as any, pointerEvents:'none', zIndex:1 }}>
          <path d={i===0?'M0 0 L50 0 L50 6 L6 6 L6 50 L0 50 Z':i===1?'M60 0 L10 0 L10 6 L54 6 L54 50 L60 50 Z':i===2?'M0 60 L0 10 L6 10 L6 54 L50 54 L50 60 Z':'M60 60 L60 10 L54 10 L54 54 L10 54 L10 60 Z'}
            fill={`${C}40`} />
        </svg>
      ))}

      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', height:'100%' }}>

        {/* ══ TOP BAR ══ */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'8px 20px', borderBottom:`1px solid ${C}25`,
          background:`linear-gradient(90deg, rgba(0,20,60,0.9), rgba(0,8,24,0.95), rgba(0,20,60,0.9))`,
          backdropFilter:'blur(10px)', flexShrink:0,
        }}>
          {/* Left */}
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div className="live-blink" style={{ width:8, height:8, borderRadius:'50%', background:CG, boxShadow:`0 0 8px ${CG}` }} />
              <span style={{ fontSize:11, fontWeight:800, color:C, letterSpacing:'0.2em', textTransform: 'uppercase' }}>Kangqore View</span>
            </div>
            {[
              { label:'HEALTH', val:`${health.toFixed(0)}%`,    color:CG  },
              { label:'AGENTS', val:Math.round(agents).toString(), color:C },
              { label:'SESSION',val:uptime,                      color:CA  },
            ].map(({label,val,color})=>(
              <div key={label} style={{ display:'flex', alignItems:'center', gap:6, paddingLeft:16, borderLeft:`1px solid ${C}20` }}>
                <span style={{ fontSize:8, color:`${C}50`, letterSpacing:'0.15em' }}>{label}</span>
                <span style={{ fontSize:12, fontWeight:800, color, textShadow:`0 0 8px ${color}` }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Center title removed per user request */}
          <div style={{ textAlign:'center' }}>
          </div>

          {/* Right: clock and exit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, textAlign: 'right' }}>
            <div>
              <div style={{ fontSize:22, fontWeight:900, color:C, letterSpacing:'0.1em',
                textShadow:`0 0 16px ${C}`, lineHeight:1 }}>{timeStr}</div>
              <div style={{ fontSize:9, color:`${C}50`, marginTop:2 }}>{dateStr}</div>
            </div>
            
            <button 
              onClick={() => navigate('/kangqore-view/admin/home')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, height: 32,
                background: `linear-gradient(135deg, ${C}20 0%, transparent 100%)`,
                border: `1px solid ${C}40`, padding: '0 12px', borderRadius: 6,
                cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 0 15px ${C}40`;
                e.currentTarget.style.background = `linear-gradient(135deg, ${C}30 0%, ${C}10 100%)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = `linear-gradient(135deg, ${C}20 0%, transparent 100%)`;
              }}
            >
              <span style={{ fontSize: 9, fontWeight: 800, color: C, letterSpacing: '0.15em' }}>EXIT HUD</span>
              <ArrowRight size={12} color={C} />
            </button>
          </div>
        </div>

        {/* ══ MAIN GRID ══ */}
        <div style={{ flex:1, display:'grid', gridTemplateColumns:'195px 1fr 195px', gap:10, padding:10, minHeight:0 }}>

          {/* ═ LEFT ═ */}
          <div style={{ display:'flex', flexDirection:'column', gap:3, overflowY:'auto' }}>

            {/* ── SYSTEM STATUS — circular gauges like JARVIS ── */}
            <SectionLabel text="SYSTEM STATUS" color={CG} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, justifyItems:'center',
              padding:'4px 0', background:'rgba(0,8,24,0.6)', borderRadius:8, border:`1px solid ${CG}15` }}>
              <Gauge value={Math.round(health)} label="HEALTH" color={CG} size={88} />
              <Gauge value={conf}               label="KIMMP"  color={C}  size={88} />
            </div>

            {/* ── DIGITAL TWIN ── */}
            <SectionLabel text="DIGITAL TWIN" color={C} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
              <TwinWidgets onOpen={() => setModal('twin')} />
            </div>

            {/* ── FINANCIAL ── */}
            <SectionLabel text="FINANCIAL" color={CG} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
              <Widget label="MRR"      value={`₹${mrrCr.toFixed(1)}Cr`}        color={CG} glow={!!mrrTrend?.startsWith('+')} sub={mrrTrend ?? undefined} onClick={() => setModal('finance')} />
              <Widget label="REVENUE"  value={`₹${revCr.toFixed(1)}Cr`}        color={CG} glow sub="+23% MTD"  onClick={() => setModal('finance')} />
              <Widget label="ARR"      value={`₹${arrCr.toFixed(1)}Cr`}        color={C}  sub="ANNUAL"          onClick={() => setModal('finance')} />
              <Widget label="FORECAST" value={`₹${(revCr*1.16).toFixed(1)}Cr`} color={CA} glow sub="+16% 30D"  onClick={() => setModal('finance')} />
            </div>

            {/* ── USERS & REACH ── */}
            <SectionLabel text="USERS & REACH" color={C} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
              <Widget label="USERS"    value={analytics.total_users ?? 0} color={C}  glow={(analytics.total_users ?? 0) > 0} sub="+6%"  onClick={() => setModal('clients')} />
              <Widget label="CLIENTS"  value={analytics.clients     ?? 0} color={CG} glow={(analytics.clients     ?? 0) > 0} sub="+9%"  onClick={() => setModal('clients')} />
              <Widget label="PARTNERS" value={analytics.partners    ?? 0} color={C}  sub="+5%"                                           onClick={() => setModal('clients')} />
              <Widget label="VISITS"   value={Math.round(visits)}         color={CG} glow sub="+21%"                                     onClick={() => setModal('clients')} />
            </div>

            {/* ── OPERATIONS ── */}
            <SectionLabel text="OPERATIONS" color={CR} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
              <Widget label="SIGNALS"  value={recentSignals.length} color={CR} glow={recentSignals.length > 0} sub="IN LEDGER" onClick={() => setModal('signals')} />
              <Widget label="CRITICAL" value={critical}             color={CR} glow={critical > 0}             sub="PRIORITY"  onClick={() => setModal('signals')} />
            </div>
          </div>

          {/* ═ CENTER HUD ═ */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', minHeight:0, gap:8, overflow:'hidden' }}>

            {/* Arc — outer div fills flex space; inner square wrapper sizes to height so arc is never clipped */}
            <div style={{ flex:'1 0 0', width:'100%', minHeight:360, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
              <div style={{ height:'100%', aspectRatio:'1/1', maxWidth:'100%' }}>
                <WaandaGUI confidence={conf} health={+health.toFixed(0)} insights={insights} analytics={analytics} sweep={sweep} lastSignal={lastSignal} criticalAlert={criticalAlert} bootPhase={bootPhase} kpis={kpis} userRole={userRole} />
              </div>
            </div>

            {/* Bottom Group — only essentials under the arc */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, width:'100%', flexShrink:0 }}>

              {/* KIMMP Command Bar */}
              <div style={{ width: '85%' }}>
                <Panel title="KANGQORE VIEW" color={C}>
                  <HUDCommandBar insights={insights} color={C} recentSignals={recentSignals} criticalAlert={criticalAlert} />
                </Panel>
              </div>



            </div>
          </div>

          {/* ═ RIGHT ═ */}
          <div style={{ display:'flex', flexDirection:'column', gap:3, overflowY:'auto' }}>

            {/* ── COMMAND ── */}
            <SectionLabel text="COMMAND" color={CA} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
              <Widget label="APPROVALS" value={liveApprovals.length}             color={CA} glow={liveApprovals.length > 0} sub="PENDING"  onClick={() => setModal('approvals')} />
              <Widget label="DECISIONS" value={insights.length}                  color={C}  glow={insights.length > 0}     sub="IN QUEUE" onClick={() => setModal('decisions')} />
              <Widget label="CASH FCST" value={`₹${(revCr*1.08).toFixed(1)}Cr`} color={CA} sub="30D VIEW"                              onClick={() => setModal('finance')}   />
              <Widget label="CONTRACTS" value={kpis?.activeContracts ?? 0}       color={CG} glow={(kpis?.activeContracts ?? 0) > 0} sub="ACTIVE" onClick={() => setModal('finance')} />
            </div>

            {/* ── MODULE NEXUS ── */}
            <SectionLabel text="MODULE NEXUS" color='#00ffcc' />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
              <NexusWidgets />
            </div>

            {/* ── INTELLIGENCE ── */}
            <SectionLabel text="INTELLIGENCE" color={CR} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
              <Widget label="INSIGHTS" value={insights.filter(i => i.priority === 'critical').length || insights.length}
                color={CR} glow={insights.some(i => i.priority === 'critical')} sub="PROACTIVE" onClick={() => setModal('insights')} />
              <Widget label="GOALS"    value="ENGINE" color={CG} glow sub="ACTIVE"   onClick={() => setModal('goals')}    />
              <Widget label="RESEARCH" value="ACTIVE" color={C}  sub="AGENTS ON"     onClick={() => setModal('research')} />
              <Widget label="MEMORY"   value="ON"     color={CA} glow sub="LEARNING" onClick={() => setModal('insights')} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Widget Modal overlay ── */}
      {modal && (
        <WidgetModal
          type={modal}
          onClose={() => setModal(null)}
          data={{
            mrrCr, revCr, arrCr, mrrTrend: mrrTrend ?? '+0%',
            kpis, analytics,
            recentSignals, critical, liveApprovals,
            insights,
          }}
        />
      )}
    </div>
  )
}
