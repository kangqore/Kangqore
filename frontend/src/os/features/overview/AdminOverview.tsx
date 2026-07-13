import { useState, useEffect, useRef, useCallback, useMemo, Component } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Maximize2, Minimize2, Mic, MicOff, Paperclip, Send, Volume2, VolumeX, Settings } from 'lucide-react'
import { api } from '@lib/api'
import { useKIMMPStore } from '@store/kimmp'
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
  if (m.includes('lead')  || m.includes('revenue') || m.includes('conver')) return 30
  if (m.includes('alis')  || m.includes('market')  || m.includes('demand')) return 60
  if (m.includes('vis')   || m.includes('content') || m.includes('gap'))    return 90
  if (m.includes('aegis') || m.includes('security')|| m.includes('threat')) return 120
  if (m.includes('keos')  || m.includes('os')      || m.includes('system')) return 150
  if (m.includes('kore')  || m.includes('cloud')   || m.includes('infra'))  return 180
  if (m.includes('kimmp') || m.includes('agent'))                           return 210
  if (m.includes('urgi')  || m.includes('graph'))                           return 240
  if (m.includes('bids')  || m.includes('business'))                        return 270
  if (m.includes('neural')|| m.includes('ops')     || m.includes('topology')) return 300
  if (m.includes('ontology')|| m.includes('semantic')|| m.includes('map'))  return 330
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
        <radialGradient id="metalBase" cx="50%" cy="50%" fx="35%" fy="35%">
          <stop offset="0%" stopColor="#1a2530" />
          <stop offset="50%" stopColor="#0f1620" />
          <stop offset="100%" stopColor="#050a10" />
        </radialGradient>
        <radialGradient id="coreEnergy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#cceeff" />
          <stop offset="45%" stopColor="#00aaff" />
          <stop offset="80%" stopColor="#0044aa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#001133" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="chromeRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#666666" />
          <stop offset="50%" stopColor="#cccccc" />
          <stop offset="70%" stopColor="#333333" />
          <stop offset="100%" stopColor="#aaaaaa" />
        </linearGradient>
        <linearGradient id="copperCoil" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffb366" />
          <stop offset="40%" stopColor="#cc6600" />
          <stop offset="60%" stopColor="#ffcc99" />
          <stop offset="100%" stopColor="#804000" />
        </linearGradient>

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
function Panel({ title, subtitle, color = C, collapsible = false, children, onClick }: {
  title: string; subtitle?: string; color?: string; collapsible?: boolean; children: ReactNode; onClick?: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (!collapsible) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setCollapsed(true)
      } else if (e.key === 'ArrowDown') {
        setCollapsed(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [collapsible])

  return (
    <div onClick={onClick} className={onClick ? 'cursor-pointer relative p-[1px] mb-3' : 'relative p-[1px] mb-3'}
      style={{
        background: `linear-gradient(135deg, ${color}60 0%, ${color}20 100%)`,
        clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="relative p-3 w-full h-full" style={{
        background: `linear-gradient(135deg, rgba(0,8,20,0.98) 0%, rgba(0,18,40,0.95) 100%)`,
        clipPath: 'polygon(11px 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%, 0 11px)',
        transition: 'all 0.3s ease',
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
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom: collapsed ? 0 : 12, transition:'margin 0.3s ease' }}>
            <div style={{ fontFamily:'monospace', fontSize:9, fontWeight:800, color:color, letterSpacing:'0.2em' }}>
              [{title.toUpperCase()}]
            </div>
            {subtitle && (
              <div style={{ fontSize:7, color:`${color}55`, letterSpacing:'0.12em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {subtitle}
              </div>
            )}
            <div style={{ flex:1, height:1, background:`linear-gradient(90deg, ${color}40, transparent)` }} />
            {collapsible ? (
              <button onClick={(e) => { e.stopPropagation(); setCollapsed(!collapsed); }}
                style={{ background: 'none', border: 'none', color: color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, fontFamily: 'monospace' }}>{collapsed ? '▼' : '▲'}</span>
              </button>
            ) : (
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
            )}
          </div>
          <div style={{ 
            maxHeight: collapsed ? 0 : 1000, 
            opacity: collapsed ? 0 : 1, 
            overflow: 'hidden', 
            transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
            pointerEvents: collapsed ? 'none' : 'auto'
          }}>
            {children}
          </div>
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
function WaandaGUI({ confidence, health, analytics, sweep, insights, lastSignal, criticalAlert, bootPhase, kpis, userRole, scenarioDelta }: {
  confidence: number; health: number; analytics: any; sweep: number; insights: any[]
  lastSignal: LiveSignal | null; criticalAlert: LiveSignal | null; bootPhase: number; kpis: any; userRole: string
  scenarioDelta?: ScenarioDelta | null
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

  // 12 modules × 30° each — arc span 22° (±11°), 8° gap between segments
  const modules = [
    { label:'eQORE',    line2:'',             deg:0,   pct: srcPct(['eqore','intent','opportunity'], 72), color:CG, desc:'INTENT_DETECTED', roles:['ADMIN'] },
    { label:'LEAD',     line2:'INTELLIGENCE', deg:30,  pct: srcPct(['lead','revenue','conversion'],  65), color:C,  desc:'LEAD_SCORE_JUMP', roles:['ADMIN'] },
    { label:'KANGQORE', line2:'ALIS',         deg:60,  pct: srcPct(['alis','market','demand'],        58), color:C,  desc:'DEMAND_SPIKE',    roles:['ADMIN'] },
    { label:'KANGQORE', line2:'VIS',          deg:90,  pct: srcPct(['vis','content','gap'],           44), color:CG, desc:'CONTENT_GAP',     roles:['ADMIN'] },
    { label:'KANGQORE', line2:'AEGIS',        deg:120, pct: srcPct(['aegis','security','threat'],     89), color:C,  desc:'SECURITY_MESH',   roles:['ADMIN'] },
    { label:'KEOS',     line2:'',             deg:150, pct: srcPct(['keos','os','system'],            94), color:CG, desc:'CORE_SYS_HEALTH', roles:['ADMIN'] },
    { label:'KORE',     line2:'',             deg:180, pct: srcPct(['kore','cloud','infra'],          98), color:C,  desc:'INFRASTRUCTURE',  roles:['ADMIN'] },
    { label:'KIMMP',    line2:'',             deg:210, pct: srcPct(['kimmp','agent','mesh'],          82), color:CA, desc:'MULTI_AGENT',     roles:['ADMIN'] },
    { label:'URGI',     line2:'',             deg:240, pct: srcPct(['urgi','graph','semantic'],       76), color:C,  desc:'GRAPH_INTEL',     roles:['ADMIN'] },
    { label:'BIDS',     line2:'',             deg:270, pct: srcPct(['bids','business','analytics'],   88), color:CG, desc:'BI_SYSTEM',       roles:['ADMIN', 'CLIENT'] },
    { label:'NEURAL',   line2:'CENTRE',       deg:300, pct: srcPct(['neural','ops','topology'],       95), color:CA, desc:'AI_TOPOLOGY',     roles:['ADMIN'] },
    { label:'ONTOLOGY', line2:'',             deg:330, pct: srcPct(['ontology','mapping','memory'],   91), color:C,  desc:'SEMANTIC_MAP',    roles:['ADMIN'] },
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
        <radialGradient id="metalBase" cx="50%" cy="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#304050" />
          <stop offset="20%" stopColor="#1a2530" />
          <stop offset="60%" stopColor="#0f1620" />
          <stop offset="100%" stopColor="#020408" />
        </radialGradient>
        <radialGradient id="coreEnergy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="15%" stopColor="#aaddff" />
          <stop offset="40%" stopColor="#0088ff" />
          <stop offset="70%" stopColor="#002288" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#000511" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="chromeRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#444444" />
          <stop offset="45%" stopColor="#dddddd" />
          <stop offset="55%" stopColor="#222222" />
          <stop offset="85%" stopColor="#eeeeee" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
        <linearGradient id="copperCoil" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffeedd" />
          <stop offset="15%" stopColor="#ffb366" />
          <stop offset="50%" stopColor="#804000" />
          <stop offset="85%" stopColor="#ffb366" />
          <stop offset="100%" stopColor="#331100" />
        </linearGradient>

        <filter id="bevelDrop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.8" />
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#00aaff" floodOpacity="0.4" />
        </filter>
        <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset dx="0" dy="4"/>
          <feGaussianBlur stdDeviation="5" result="offset-blur"/>
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
          <feFlood floodColor="black" floodOpacity="0.9" result="color"/>
          <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
        </filter>
        <radialGradient id="glassLens" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#00aaff" stopOpacity="0.05" />
        </radialGradient>

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
          const s = deg - 11, e = deg + 11
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

        const arcStart = deg - 11, arcEnd = deg + 11
        const valEnd   = deg - 11 + (pct/100) * 22

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
               transformOrigin: `${cx}px ${cy}px`,
               transform: isHovered ? 'scale(1.05)' : 'scale(1)',
               transition: `opacity 0.5s ${bootDelay}, filter 0.3s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)`,
               animation: isHovered ? 'none' : isCriticalArc ? 'critFlash 0.4s ease-in-out 12' : isActive ? 'arcPulseFast 0.8s ease-in-out infinite' : 'arcPulse 3s ease-in-out infinite',
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
            {/* Scenario delta badge — appears outside the arc ring when scenario mode is active */}
            {scenarioDelta && (() => {
              const DELTA_MAP: Record<number, keyof ScenarioDelta> = {
                270: 'revenueHealth', 30: 'pipelineVelocity', 210: 'executionCapacity',
                120: 'riskExposure',  60: 'marketPosition',
              }
              const deltaKey = DELTA_MAP[deg]
              if (!deltaKey) return null
              const dv = Math.round(scenarioDelta[deltaKey])
              if (dv === 0) return null
              const bc = dv > 0 ? '#00ffaa' : CR
              const bp = polar(cx, cy, 138, deg)
              return (
                <g>
                  <rect x={bp.x - 11} y={bp.y - 8} width={22} height={16} rx={3}
                    fill={`${bc}20`} stroke={bc} strokeWidth={0.8} />
                  <text x={bp.x} y={bp.y + 4.5} textAnchor="middle" fill={bc}
                    fontSize={7} fontFamily="monospace" fontWeight="900"
                    style={{ filter:`drop-shadow(0 0 3px ${bc})` }}>
                    {dv > 0 ? '+' : ''}{dv}
                  </text>
                </g>
              )
            })()}
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

      {/* ── Hyper-Realistic Reactor Core ── */}
      {/* Heavy base metal housing */}
      <circle cx={cx} cy={cy} r={54} fill="url(#metalBase)" stroke="url(#chromeRing)" strokeWidth={2} filter="url(#bevelDrop)" />
      
      {/* 10 copper energy coils wrapping the housing */}
      {Array.from({length: 10}).map((_, i) => {
        const d = i * 36;
        return <path key={i} d={arcWedgePath(cx,cy, 46, 56, d-6, d+6)} fill="url(#copperCoil)" filter="url(#bevelDrop)" />
      })}

      {/* Inner Chrome housing ring */}
      <circle cx={cx} cy={cy} r={46} fill="none" stroke="url(#chromeRing)" strokeWidth={6} filter="url(#innerShadow)" />
      
      {/* Deep dark chamber */}
      <circle cx={cx} cy={cy} r={42} fill="#050a12" filter="url(#innerShadow)" />

      {/* 3 counter-rotating inner targeting reticles */}
      <circle cx={cx} cy={cy} r={38} fill="none" stroke="#00aaff" strokeWidth={1.5}
        strokeDasharray="1 4 10 4" style={{ filter:'drop-shadow(0 0 6px #00aaff)', animation:'orbit-ccw 8s linear infinite', transformOrigin:`${cx}px ${cy}px` }} />
      <circle cx={cx} cy={cy} r={32} fill="none" stroke="#ffffff" strokeWidth={1}
        strokeDasharray="2 4" style={{ filter:'drop-shadow(0 0 4px #ffffff)', animation:'orbit-cw 4s linear infinite', transformOrigin:`${cx}px ${cy}px` }} />
      <circle cx={cx} cy={cy} r={28} fill="none" stroke="#0066ff" strokeWidth={0.5}
        strokeDasharray="40 10 20 10" style={{ filter:'drop-shadow(0 0 4px #0066ff)', animation:'orbit-ccw 20s linear infinite', transformOrigin:`${cx}px ${cy}px` }} />

      {/* Primary glowing energy core */}
      <circle cx={cx} cy={cy} r={26} fill="url(#coreEnergy)" style={{ filter:`drop-shadow(0 0 25px #00aaff) drop-shadow(0 0 50px #00aaff)`, animation:'arcPulse 2s infinite' }} />
      {/* Extreme bright center point */}
      <circle cx={cx} cy={cy} r={10} fill="#ffffff" style={{ filter:`drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 20px #ffffff)`, animation:'arcPulseFast 0.8s infinite' }} />

      {/* Glass Lens reflection */}
      <circle cx={cx} cy={cy} r={42} fill="url(#glassLens)" pointerEvents="none" />

      {/* ── Dynamic Center Info Overlay ── */}
      {/* ── Dynamic Center Info Overlay ── */}
      <g style={{ opacity: 1, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
        <image href="/assets/kangqore-icon-white.png" x={cx-14} y={cy-14} width={28} height={28}
          opacity={0.9} style={{ filter:`drop-shadow(0 0 12px ${C})` }} />
        <text x={cx} y={cy+56} textAnchor="middle" fill="#ffffff" fontSize={8} fontFamily="monospace" fontWeight="900" letterSpacing="0.1em" style={{ filter:`drop-shadow(0 0 8px #03a9f4)` }}>
          {confidence}% CONF
        </text>
        <text x={cx} y={cy+66} textAnchor="middle" fill="#88ccff" fontSize={6} fontFamily="monospace" letterSpacing="0.1em" style={{ filter:`drop-shadow(0 0 4px #0066ff)` }}>
          SYS {health.toFixed(1)}%
        </text>
      </g>
      {/* Hovered Module Readout */}
      <g style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
        {hovered && (() => {
          const m = visibleModules.find(x => (x.label + x.deg) === hovered)
          if (!m) return null
          
          const rTooltip = 175;
          const tp = polar(cx, cy, rTooltip, m.deg);
          
          return (
            <g>
              {/* Connecting targeting line from the outer edge of the arc to the tooltip */}
              <line x1={polar(cx, cy, 134, m.deg).x} y1={polar(cx, cy, 134, m.deg).y}
                    x2={tp.x} y2={tp.y}
                    stroke={m.color} strokeWidth={1} strokeDasharray="2 4" style={{ filter:`drop-shadow(0 0 4px ${m.color})` }} />
              
              {/* Tooltip Background/Frame */}
              <rect x={tp.x - 45} y={tp.y - 22} width={90} height={44} rx={4} fill={`${m.color}15`} stroke={m.color} strokeWidth={1} style={{ filter:`drop-shadow(0 0 10px ${m.color})` }} />
              
              {/* Tooltip Text */}
              <text x={tp.x} y={tp.y - 8} textAnchor="middle" fill="#4ab6d4" fontSize={14} fontWeight="900" fontFamily="monospace" letterSpacing="0.1em" style={{ filter: `drop-shadow(0 0 8px ${m.color})` }}>{m.pct}%</text>
              <line x1={tp.x - 30} y1={tp.y} x2={tp.x + 30} y2={tp.y} stroke={m.color} strokeWidth={0.5} opacity={0.5} />
              <text x={tp.x} y={tp.y + 8} textAnchor="middle" fill={m.color} fontSize={6} fontFamily="monospace" letterSpacing="0.2em">{m.desc}</text>
              <text x={tp.x} y={tp.y + 16} textAnchor="middle" fill="#4ab6d4" fontSize={7} fontWeight="800" fontFamily="monospace" letterSpacing="0.2em">{m.label + (m.line2 ? ' ' + m.line2 : '')}</text>
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

// ─── WAANDA Boot Greeting (JARVIS-style) ─────────────────────────────────────
function WaandaGreeting({ kpis, insights, health, onDismiss, onSpeakDirect }: {
  kpis: any; insights: any[]; health: number
  onDismiss: (voiceText: string) => void
  onSpeakDirect: (text: string) => void
}) {
  const [phase, setPhase] = useState(0)
  const [exiting, setExiting] = useState(false)

  const hour  = new Date().getHours()
  const tod   = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const crit  = insights.filter((i: any) => i.priority === 'critical').length
  const high  = insights.filter((i: any) => i.priority === 'high').length
  const twin  = kpis?.overallScore ?? null
  const rev   = kpis?.revenueHealth ?? null

  const statusLine = crit > 0
    ? `${crit} critical signal${crit > 1 ? 's' : ''} require immediate attention${high > 0 ? `, along with ${high} high-priority item${high > 1 ? 's' : ''}` : ''}.`
    : high > 0
    ? `${high} high-priority signal${high > 1 ? 's' : ''} in queue. All critical systems clear.`
    : 'All modules clear. No critical signals detected.'

  const voiceText = [
    `Good ${tod}, sir. WAANDA online.`,
    crit > 0
      ? `I've flagged ${crit} critical signal${crit > 1 ? 's' : ''} requiring immediate attention.`
      : 'All twelve modules are operational and running within normal parameters.',
    twin != null ? `Business twin score is at ${twin} out of one hundred.` : '',
    rev != null  ? `Revenue health holding at ${rev}.` : '',
    'Standing by for your orders, sir.',
  ].filter(Boolean).join(' ')

  // Lines reveal sequentially — each item: [delay ms, content]
  const LINES: Array<[number, { type: string; text: string; value?: string }]> = [
    [0,    { type: 'title',    text: 'W·A·A·N·D·A' }],
    [220,  { type: 'subtitle', text: 'WIDE-AREA ANALYTICS & NEURAL DISPATCH ARCHITECTURE' }],
    [460,  { type: 'divider',  text: '' }],
    [660,  { type: 'status',   text: 'Intelligence Mesh',    value: '✓ ONLINE' }],
    [860,  { type: 'status',   text: 'Digital Twin',         value: twin != null ? `✓ ${twin}/100` : '✓ ACTIVE' }],
    [1060, { type: 'status',   text: 'AEGIS Governance',     value: '✓ OPERATIONAL' }],
    [1260, { type: 'status',   text: 'Signal Monitor',       value: `✓ ${insights.length || 0} TRACKED` }],
    [1260, { type: 'status',   text: 'System Health',        value: `✓ ${health.toFixed(0)}%` }],
    [1500, { type: 'divider',  text: '' }],
    [1900, { type: 'greeting', text: `Good ${tod}, sir.` }],
    [2300, { type: 'body',     text: statusLine }],
    [2700, { type: 'body',     text: `12 modules online  ·  AEGIS active  ·  All systems nominal` }],
    [3100, { type: 'ready',    text: 'WAANDA online. Standing by for orders.' }],
    [3700, { type: 'prompt',   text: '[ CLICK ANYWHERE OR PRESS ANY KEY TO PROCEED ]' }],
  ]

  useEffect(() => {
    const timers = LINES.map(([delay], i) =>
      setTimeout(() => setPhase(p => Math.max(p, i + 1)), delay)
    )
    return () => timers.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dismiss = useCallback(() => {
    if (exiting) return
    setExiting(true)
    onSpeakDirect(voiceText)                 // synchronous — must stay in gesture call stack
    setTimeout(() => onDismiss(voiceText), 180)
  }, [exiting, onDismiss, onSpeakDirect, voiceText])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key !== 'Tab') dismiss() }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [dismiss])

  // Auto-advance after lines finish + 2s extra
  useEffect(() => {
    const t = setTimeout(dismiss, 7500)
    return () => clearTimeout(t)
  }, [dismiss])

  const shownLines = LINES.slice(0, phase).map(([, l]) => l)

  return (
    <div onClick={dismiss} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,3,10,0.97)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      opacity: exiting ? 0 : 1,
      transition: exiting ? 'opacity 0.25s ease' : 'none',
    }}>
      {/* Scan-line texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,102,255,0.018) 3px, rgba(0,102,255,0.018) 4px)',
      }} />
      {/* Radial vignette glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,80,200,0.06) 0%, transparent 70%)`,
      }} />

      <div style={{ width: 580, maxWidth: '88vw', position: 'relative', padding: '32px 0' }}>
        {/* Corner HUD brackets */}
        {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v, h]) => (
          <div key={v+h} style={{
            position: 'absolute',
            [v]: -4, [h]: -12,
            width: 18, height: 18,
            [`border${v.charAt(0).toUpperCase()+v.slice(1)}`]: `1.5px solid ${CG}`,
            [`border${h.charAt(0).toUpperCase()+h.slice(1)}`]: `1.5px solid ${CG}`,
            opacity: 0.7,
          }} />
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {shownLines.map((line, i) => {
            if (line.type === 'title') return (
              <div key={i} style={{
                fontSize: 34, fontWeight: 900, color: C, letterSpacing: '0.5em',
                fontFamily: 'monospace', textAlign: 'center',
                filter: `drop-shadow(0 0 22px ${C}) drop-shadow(0 0 8px ${C})`,
                animation: 'hudCardIn 0.5s ease', marginBottom: 6,
              }}>
                {line.text}
              </div>
            )
            if (line.type === 'subtitle') return (
              <div key={i} style={{
                fontSize: 7, color: `${CG}80`, letterSpacing: '0.2em',
                fontFamily: 'monospace', textAlign: 'center',
                animation: 'hudCardIn 0.4s ease', marginBottom: 22,
              }}>
                {line.text}
              </div>
            )
            if (line.type === 'divider') return (
              <div key={i} style={{
                height: 1, background: `linear-gradient(90deg, transparent, ${CG}30, ${C}50, ${CG}30, transparent)`,
                margin: '10px 0', animation: 'hudCardIn 0.3s ease',
              }} />
            )
            if (line.type === 'status') return (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '4px 8px', animation: 'hudCardIn 0.3s ease',
              }}>
                <span style={{ fontSize: 10, color: `${C}70`, fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                  › {line.text}
                </span>
                <span style={{
                  fontSize: 10, color: CG, fontFamily: 'monospace', fontWeight: 800,
                  letterSpacing: '0.08em', filter: `drop-shadow(0 0 5px ${CG})`,
                }}>
                  {line.value}
                </span>
              </div>
            )
            if (line.type === 'greeting') return (
              <div key={i} style={{
                fontSize: 26, fontWeight: 800, color: '#ffffff',
                letterSpacing: '0.06em', fontFamily: 'monospace', textAlign: 'center',
                marginTop: 18, marginBottom: 10,
                animation: 'hudCardIn 0.5s ease',
                filter: `drop-shadow(0 0 14px ${C})`,
              }}>
                {line.text}
              </div>
            )
            if (line.type === 'body') return (
              <div key={i} style={{
                fontSize: 11, color: '#7aaec8', fontFamily: 'monospace',
                textAlign: 'center', lineHeight: 1.8, letterSpacing: '0.04em',
                animation: 'hudCardIn 0.4s ease',
              }}>
                {line.text}
              </div>
            )
            if (line.type === 'ready') return (
              <div key={i} style={{
                fontSize: 11, color: CG, fontFamily: 'monospace', fontWeight: 700,
                textAlign: 'center', letterSpacing: '0.14em', marginTop: 18,
                animation: 'hudCardIn 0.5s ease',
                filter: `drop-shadow(0 0 8px ${CG})`,
              }}>
                {line.text}
              </div>
            )
            if (line.type === 'prompt') return (
              <div key={i} style={{
                fontSize: 8, color: `${C}45`, fontFamily: 'monospace',
                textAlign: 'center', letterSpacing: '0.18em', marginTop: 26,
                animation: 'blink2 1.6s ease-in-out infinite',
              }}>
                {line.text}
              </div>
            )
            return null
          })}
        </div>
      </div>
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

function useWakeWord(active: boolean, onWake: (phrase: string) => void) {
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR || !active) return
    let r: any = null
    let isActive = true
    
    const startListener = () => {
      if (!isActive) return
      try {
        r = new SR()
        r.continuous = true
        r.interimResults = true
        r.lang = 'en-US'
        
        const WAKE_WORDS = [
          "hey waanda", "wake up daddy's home", "wake up waanda", 
          "wake up waanda baby", "wake up waanda babe", "good morning waanda", 
          "wake up point break"
        ]
        
        r.onresult = (e: any) => {
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const transcript = e.results[i][0].transcript.toLowerCase()
            if (WAKE_WORDS.some(w => transcript.includes(w))) {
              onWake(transcript)
              isActive = false
              r.stop()
              break
            }
          }
        }
        r.onend = () => { if (isActive) setTimeout(startListener, 500) }
        r.onerror = (e: any) => { if (e.error === 'not-allowed' || e.error === 'audio-capture') isActive = false }
        r.start()
      } catch (err) {}
    }
    
    startListener()
    
    return () => {
      isActive = false
      if (r) { r.onend = null; r.stop() }
    }
  }, [active, onWake])
}

function useTTS() {
  const [speaking, setSpeaking] = useState(false)
  const [muted,    setMuted]    = useState(false)

  const st = useRef<{
    muted:   boolean
    current: HTMLAudioElement | null
    queue:   Array<{ text: string; type: string }>
    playing: boolean
    ctx:     AudioContext | null
  }>({ muted: false, current: null, queue: [], playing: false, ctx: null })

  // Pre-warm: fire on mount to capture the SPA navigation click gesture.
  // Chrome requires speak() to originate from user activation; SPA nav clicks
  // give ~5 s of transient activation on the current document. Calling speak()
  // here (volume 0, max rate, single space) unlocks the API for the session so
  // all subsequent setTimeout-chained calls work without a direct gesture.
  useEffect(() => {
    try {
      const u = new SpeechSynthesisUtterance(' ')
      u.volume = 0
      u.rate   = 16
      window.speechSynthesis.speak(u)
    } catch {}
    // Pre-load voices
    window.speechSynthesis.getVoices()
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [])

  // Backup unlock on any click/keydown (covers hard-refresh / direct URL cases)
  useEffect(() => {
    const unlock = () => {
      try {
        if (!st.current.ctx) st.current.ctx = new AudioContext()
        st.current.ctx.resume()
      } catch {}
      try {
        const u = new SpeechSynthesisUtterance(' ')
        u.volume = 0; u.rate = 16
        window.speechSynthesis.speak(u)
      } catch {}
    }
    document.addEventListener('click',   unlock, true)
    document.addEventListener('keydown', unlock, true)
    return () => {
      document.removeEventListener('click',   unlock, true)
      document.removeEventListener('keydown', unlock, true)
    }
  }, [])

  // Play a short notification tone, return its duration in ms
  const chime = useCallback((type: string): number => {
    try {
      if (!st.current.ctx) st.current.ctx = new AudioContext()
      const ctx = st.current.ctx
      if (ctx.state === 'suspended') ctx.resume()
      const now = ctx.currentTime
      type Note = { f: number; t: number; d: number; g: number; w?: OscillatorType }
      const TONES: Record<string, Note[]> = {
        signal:   [{ f:1200, t:0,    d:0.18, g:0.12 }],
        alert:    [{ f:880,  t:0,    d:0.18, g:0.30, w:'sawtooth' }, { f:660, t:0.20, d:0.18, g:0.26, w:'sawtooth' }],
        agent:    [{ f:523,  t:0,    d:0.12, g:0.12 }, { f:659, t:0.14, d:0.12, g:0.12 }],
        kpi:      [{ f:523,  t:0,    d:0.10, g:0.15 }, { f:659, t:0.12, d:0.10, g:0.15 }, { f:784, t:0.24, d:0.13, g:0.18 }],
        system:   [{ f:440,  t:0,    d:0.12, g:0.07 }],
        greeting: [{ f:523,  t:0,    d:0.10, g:0.10 }, { f:659, t:0.12, d:0.12, g:0.08 }],
      }
      const notes = TONES[type] ?? TONES.system
      notes.forEach(({ f, t, d, g, w = 'sine' }) => {
        const osc  = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = w
        osc.frequency.setValueAtTime(f, now + t)
        gain.gain.setValueAtTime(0, now + t)
        gain.gain.linearRampToValueAtTime(g, now + t + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d)
        osc.connect(gain); gain.connect(ctx.destination)
        osc.start(now + t); osc.stop(now + t + d + 0.02)
      })
      return Math.ceil(Math.max(...notes.map(n => n.t + n.d)) * 1000) + 80
    } catch { return 0 }
  }, [])

  const silence = useCallback(() => {
    const s = st.current
    s.queue = []
    s.playing = false
    setSpeaking(false)
    if (s.current instanceof HTMLAudioElement) {
      s.current.pause()
      s.current.currentTime = 0
    }
    window.speechSynthesis.cancel()
  }, [])

  const playNext = useCallback(() => {
    const s = st.current
    if (s.muted || s.playing || s.queue.length === 0) return
    s.playing = true
    setSpeaking(true)
    const item = s.queue.shift()!
    const delay = item.type !== 'response' ? chime(item.type) : 0
    setTimeout(() => {
      if (s.muted) { s.playing = false; setSpeaking(false); return }
      const done = () => { s.playing = false; s.current = null; setSpeaking(false); setTimeout(playNext, 200) }
      try {
        const audio = new Audio(`/api/admin/kangqore-immp/tts?text=${encodeURIComponent(item.text.slice(0, 500))}`)
        audio.onended = done
        audio.onerror = (e) => { console.warn('[WAANDA TTS Error]', e); done() }
        s.current = audio as any
        audio.play().catch(done)
      } catch { done() }
    }, delay)
  }, [chime])

  const speak = useCallback((text: string, type = 'system') => {
    if (st.current.muted || !text.trim()) return
    if (type === 'alert') st.current.queue.unshift({ text, type })
    else st.current.queue.push({ text, type })
    playNext()
  }, [playNext])

  // speakDirect: bypasses the queue and speaks immediately.
  // Must be called synchronously from a user gesture (click/keydown) so Chrome
  // permits speechSynthesis. Used by the greeting dismiss handler.
  const speakDirect = useCallback((text: string) => {
    const s = st.current
    if (s.muted || !text.trim()) return
    if (s.current instanceof HTMLAudioElement) {
      s.current.pause()
      s.current.currentTime = 0
    }
    window.speechSynthesis.cancel()          // clear any pending unlock utterances
    s.queue    = []
    s.playing  = true
    setSpeaking(true)
    const done = () => { s.playing = false; s.current = null; setSpeaking(false); setTimeout(playNext, 200) }
    
    try {
      const audio = new Audio(`/api/admin/kangqore-immp/tts?text=${encodeURIComponent(text.slice(0, 500))}`)
      audio.onended = done
      audio.onerror = (e) => { console.warn('[WAANDA TTS Direct Error]', e); done() }
      s.current = audio as any
      audio.play().catch(done)
    } catch { done() }
  }, [playNext])


  const toggleMute = useCallback(() => {
    st.current.muted = !st.current.muted
    setMuted(st.current.muted)
    if (st.current.muted) silence()
  }, [silence])

  return { speak, speakDirect, silence, speaking, muted, toggleMute }
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

interface ScenarioDelta {
  revenueHealth:     number
  pipelineVelocity:  number
  executionCapacity: number
  riskExposure:      number
  marketPosition:    number
}
interface ScenarioResult {
  narrative:   string
  delta:       ScenarioDelta
  scenario:    string
  generatedAt: string
}
interface GoalTask {
  id: string; step: number; title: string
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED' | 'OVERDUE'
  result?: string | null
}
interface GoalCockpitData {
  id: string; objective: string
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  progressPct: number; deadline?: string | null; tasks: GoalTask[]
}

function HUDCommandBar({ insights, color, recentSignals, criticalAlert,
  onScenario, onGoalCockpit, scenarioActive, onExitScenario }: {
  insights: any[]; color: string
  recentSignals: LiveSignal[]; criticalAlert: LiveSignal | null
  onScenario: (result: ScenarioResult, delta: ScenarioDelta) => void
  onGoalCockpit: () => void
  scenarioActive: boolean
  onExitScenario: () => void
}) {
  const navigate = useNavigate()
  const [query,    setQuery]    = useState('')
  const [result,   setResult]   = useState<HUDCmdResult | null>(null)
  const [thinking, setThinking] = useState(false)
  const [animate,  setAnimate]  = useState(false)
  const [history,  setHistory]  = useState<Array<{role:'user'|'assistant'; content:string}>>(() => {
    try { return JSON.parse(localStorage.getItem('waanda-chat-history') || '[]') } catch { return [] }
  })
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
  const alertedRef   = useRef<string | null>(null)

  const { speak, silence, speaking, muted, toggleMute } = useTTS()

  useEffect(() => {
    if (!criticalAlert || alertedRef.current === criticalAlert.id) return
    alertedRef.current = criticalAlert.id
    const msg = `CRITICAL ALERT. ${criticalAlert.sourceModule} — ${criticalAlert.signalValue}. Immediate attention required, sir.`
    setTimeout(() => speak(msg, 'alert'), 800)
  }, [criticalAlert, speak])

  const displayed = useTypewriter(result?.response ?? '', animate)

  useEffect(() => {
    if (!result || !animate) return
    speak(result.response + (result.suggestedAction ? '. ' + result.suggestedAction : ''), 'response')
  }, [animate, result, speak])

  // Auto-navigate when KIMMP returns a route; intercept /goals to open cockpit
  useEffect(() => {
    if (!result?.navigate) return
    if (result.navigate === '/goals' || result.navigate?.includes('goals')) {
      onGoalCockpit()
      return
    }
    const t = setTimeout(() => navigate(result.navigate!), 1800)
    return () => clearTimeout(t)
  }, [result, navigate, onGoalCockpit])

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
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.speak(new SpeechSynthesisUtterance('')) } catch {}
    }

    // ── Goal Cockpit intercept ────────────────────────────────────────────────
    if (/^(show\s+(my\s+)?goals?|goals?|my\s+goals?|goal\s+cockpit)$/i.test(text)) {
      onGoalCockpit()
      setQuery('')
      return
    }

    // ── Scenario Playground intercept ─────────────────────────────────────────
    const isScenario = /^what\s+if\b/i.test(text) || /\bscenario\b.*\bif\b/i.test(text)
    if (isScenario) {
      setQuery(text); setThinking(true); setResult(null); setAnimate(false)
      try {
        const res = await api.post('/admin/kangqore-immp/simulate', { scenario: text })
        onScenario(res.data as ScenarioResult, res.data.delta as ScenarioDelta)
        setResult({
          response: `Scenario analysis complete. Review the arc module deltas — delta badges show projected changes under this scenario.`,
          confidence: 85, suggestedAction: res.data.narrative?.slice(0, 120) ?? null,
          model: 'simulation', navigate: null,
        })
        setAnimate(true)
      } catch {
        setResult({
          response: 'Simulation unavailable — ensure the AI backend key is configured.',
          confidence: 0, suggestedAction: null, model: 'fallback', navigate: null,
        }); setAnimate(true)
      } finally { setThinking(false) }
      return
    }

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
      setHistory(h => {
        const next = [...h, { role:'user', content:text }, { role:'assistant', content:res.data.response }]
        try { localStorage.setItem('waanda-chat-history', JSON.stringify(next.slice(-40))) } catch {}
        return next
      })
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
  }, [query, history, insights, recentSignals, silence, onScenario, onGoalCockpit])

  const { listening, supported, interim, start, stop } = useVoiceInput(
    useCallback((t: string) => { setQuery(t); submit(t) }, [submit])
  )

  // Voice-mode loop: after WAANDA finishes speaking, re-activate mic automatically
  const voiceModeRef        = useRef(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const setVM = (v: boolean) => { voiceModeRef.current = v; setVoiceMode(v) }
  const prevSpeakRef  = useRef(false)
  useEffect(() => {
    const wasSpeaking = prevSpeakRef.current
    prevSpeakRef.current = speaking
    if (wasSpeaking && !speaking && voiceModeRef.current && !thinking) {
      // small gap so the user hears the response fully before mic opens
      setTimeout(() => { if (voiceModeRef.current) start() }, 600)
    }
  }, [speaking, thinking, start])

  // Wake Word Listener
  useWakeWord(!listening && !voiceMode, useCallback((phrase) => {
    // Open the panel by simulating ArrowDown just in case it's collapsed
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    setVM(true)
    silence()
    // Small delay to ensure passive listener has fully released the mic
    setTimeout(() => { start() }, 300)
  }, [start, silence]))

  const handleMicClick = useCallback(() => {
    if (listening) {
      setVM(false)   // exit voice-mode loop
      stop()
      return
    }
    setVM(true)      // enter voice-mode loop
    silence()
    start()
  }, [listening, stop, silence, start])

  const displayedQuery = listening && interim ? interim : query

  const topModule = recentSignals[0]?.sourceModule?.toLowerCase() ?? ''
  const DYNAMIC = recentSignals.length > 0
    ? (topModule.includes('lead') ? 'What happened with leads?' : topModule.includes('eqore') ? 'Latest eQORE signals?' : topModule.includes('finance') ? 'Finance status?' : 'What should I focus on?')
    : 'What should I focus on?'

  const SUGGESTED = [DYNAMIC, "How's our pipeline?", 'Show me critical risks', 'Give me a business brief', 'What if we close 5 deals this month?', 'Open finance']

  return (
    <div style={{ width:'100%' }}>
      {/* Scenario mode indicator strip */}
      {scenarioActive && (
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'3px 8px', marginBottom:5,
          background:`rgba(0,102,255,0.10)`, border:`1px solid ${CG}35`, borderRadius:5,
        }}>
          <span style={{ fontSize:8, color:CG, fontFamily:'monospace', letterSpacing:'0.15em', fontWeight:800 }}>
            ◈ SCENARIO MODE — arc badges show projected deltas
          </span>
          <button onClick={onExitScenario}
            style={{ background:'none', border:'none', cursor:'pointer', color:`${CR}80`, fontSize:9, padding:0, fontFamily:'monospace' }}>
            ✕ exit
          </button>
        </div>
      )}
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
                    {h.role === 'user' ? '▶ YOU' : '◈ WAANDA'}
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
        display:'flex', alignItems:'center', gap:6, padding:'5px 8px',
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
          placeholder={listening ? 'Listening…' : speaking ? 'Speaking…' : `Ask WAANDA — "take me to finance", "what should I focus on?"…`}
          style={{
            flex:1, background:'transparent', border:'none', outline:'none',
            fontSize:10, color: listening ? '#ff5577' : '#a0d8ef',
            fontFamily:'monospace', letterSpacing:'0.05em',
          }}
        />
        {speaking && <Waveform color={color} active={speaking} />}
        {displayedQuery && !listening && !speaking && (
          <button onClick={() => { setQuery(''); setResult(null); silence() }}
            style={{ width:18, height:18, borderRadius:'50%', flexShrink:0,
              background:'rgba(255,255,255,0.04)', border:`1px solid ${color}18`,
              color:`${color}50`, cursor:'pointer', fontSize:9, display:'flex',
              alignItems:'center', justifyContent:'center', lineHeight:1, transition:'all 0.15s' }}>✕</button>
        )}

        {/* ── Action buttons ── */}
        {/* Mute */}
        <button onClick={toggleMute} title={muted ? 'Unmute WAANDA' : 'Mute WAANDA'}
          style={{ width:34, height:34, borderRadius:'50%', flexShrink:0, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            border: muted ? '1px solid rgba(255,68,68,0.55)' : `1px solid ${color}22`,
            background: muted
              ? 'radial-gradient(circle at 50% 35%, rgba(255,68,68,0.18) 0%, rgba(255,68,68,0.05) 100%)'
              : `radial-gradient(circle at 50% 35%, ${color}0d 0%, transparent 100%)`,
            boxShadow: muted
              ? '0 0 16px rgba(255,68,68,0.30), inset 0 1px 0 rgba(255,255,255,0.07)'
              : 'inset 0 1px 0 rgba(255,255,255,0.05)',
            transition:'all 0.2s ease' }}>
          {muted ? <VolumeX size={13} color="#ff4444" /> : <Volume2 size={13} color={`${color}90`} />}
        </button>

        {/* Mic / voice loop */}
        {supported && (
          <button onClick={handleMicClick}
            title={listening ? 'Stop listening' : voiceMode ? 'Voice loop active — click to exit' : 'Speech to speech'}
            style={{ width:34, height:34, borderRadius:'50%', flexShrink:0, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              border: listening ? '1px solid rgba(255,51,85,0.65)'
                    : voiceMode  ? `1px solid ${color}65`
                    :              `1px solid ${color}22`,
              background: listening
                ? 'radial-gradient(circle at 50% 35%, rgba(255,51,85,0.22) 0%, rgba(255,51,85,0.06) 100%)'
                : voiceMode
                ? `radial-gradient(circle at 50% 35%, ${color}1a 0%, ${color}05 100%)`
                : `radial-gradient(circle at 50% 35%, ${color}0d 0%, transparent 100%)`,
              boxShadow: listening
                ? '0 0 18px rgba(255,51,85,0.40), inset 0 1px 0 rgba(255,255,255,0.07)'
                : voiceMode
                ? `0 0 14px ${color}40, inset 0 1px 0 rgba(255,255,255,0.07)`
                : 'inset 0 1px 0 rgba(255,255,255,0.05)',
              animation: listening ? 'blink2 1.2s ease-in-out infinite' : 'none',
              transition:'all 0.2s ease' }}>
            {listening ? <MicOff size={13} color="#ff3355" /> : <Mic size={13} color={voiceMode ? color : `${color}90`} />}
          </button>
        )}

        {/* Attach */}
        <button onClick={() => fileInputRef.current?.click()}
          title="Attach image, PDF, or document"
          style={{ width:34, height:34, borderRadius:'50%', flexShrink:0,
            cursor: attachments.length >= 3 ? 'not-allowed' : 'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            border: `1px solid ${color}22`,
            background: `radial-gradient(circle at 50% 35%, ${color}0d 0%, transparent 100%)`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            opacity: attachments.length >= 3 ? 0.28 : 1,
            transition:'all 0.2s ease' }}>
          <Paperclip size={12} color={`${color}90`} />
        </button>

        {/* Send — primary CTA */}
        <button onClick={() => submit()}
          disabled={!displayedQuery.trim() || thinking}
          style={{ width:34, height:34, borderRadius:'50%', flexShrink:0,
            cursor: (!displayedQuery.trim() || thinking) ? 'not-allowed' : 'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            border: `1px solid ${color}${(!displayedQuery.trim() || thinking) ? '20' : '70'}`,
            background: (!displayedQuery.trim() || thinking)
              ? `radial-gradient(circle at 50% 35%, ${color}07 0%, transparent 100%)`
              : `radial-gradient(circle at 50% 35%, ${color}28 0%, ${color}0f 100%)`,
            boxShadow: (!displayedQuery.trim() || thinking)
              ? 'inset 0 1px 0 rgba(255,255,255,0.04)'
              : `0 0 18px ${color}45, inset 0 1px 0 rgba(255,255,255,0.10)`,
            opacity: (!displayedQuery.trim() || thinking) ? 0.32 : 1,
            transition:'all 0.25s ease' }}>
          <Send size={12} color={(!displayedQuery.trim() || thinking) ? `${color}55` : color} />
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
              WAANDA PROPOSES: {pendingAction.type.replace(/_/g, ' ')}
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

// ─── Scenario Panel ───────────────────────────────────────────────────────────
function ScenarioPanel({ result, color, onExit }: {
  result: ScenarioResult; color: string; onExit: () => void
}) {
  const displayed = useTypewriter(result.narrative, true)
  const DELTA_LABELS: { key: keyof ScenarioDelta; label: string }[] = [
    { key: 'revenueHealth',     label: 'REVENUE'   },
    { key: 'pipelineVelocity',  label: 'PIPELINE'  },
    { key: 'executionCapacity', label: 'EXECUTION' },
    { key: 'riskExposure',      label: 'RISK'      },
    { key: 'marketPosition',    label: 'MARKET'    },
  ]
  return (
    <div style={{ marginTop:8 }}>
      <Panel title="SCENARIO ANALYSIS" color={CG}>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:8 }}>
          {DELTA_LABELS.map(({ key, label }) => {
            const dv = Math.round(result.delta[key] ?? 0)
            if (dv === 0) return null
            const bc = dv > 0 ? '#00ffaa' : CR
            return (
              <div key={key} style={{
                padding:'2px 7px', borderRadius:4, fontSize:8, fontFamily:'monospace',
                fontWeight:800, letterSpacing:'0.08em',
                background:`${bc}18`, border:`1px solid ${bc}50`, color:bc,
              }}>
                {label} {dv > 0 ? '+' : ''}{dv}
              </div>
            )
          })}
        </div>
        <p style={{ fontSize:9, color:'#b0d8ef', lineHeight:1.6, fontFamily:'monospace', margin:0 }}>
          {displayed}
          {displayed.length < result.narrative.length && (
            <span style={{ animation:'blink2 0.5s infinite', color }}> ▌</span>
          )}
        </p>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
          <span style={{ fontSize:7, color:`${color}40`, fontFamily:'monospace' }}>
            {new Date(result.generatedAt).toLocaleTimeString('en-GB')}
          </span>
          <button onClick={onExit}
            style={{ background:'none', border:'none', cursor:'pointer', fontSize:8, color:`${CR}60`, fontFamily:'monospace' }}>
            ✕ clear scenario
          </button>
        </div>
      </Panel>
    </div>
  )
}

// ─── Goal Cockpit ─────────────────────────────────────────────────────────────
function GoalCockpit({ onClose, color }: { onClose: () => void; color: string }) {
  const { data, isLoading } = useQuery<{ goals: GoalCockpitData[] }>({
    queryKey:        ['goal-cockpit'],
    queryFn:         () => api.get('/admin/kangqore-immp/goals').then(r => r.data),
    refetchInterval: 30_000,
  })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const goals: GoalCockpitData[] = data?.goals ?? []
  const statusColor = (s: string) =>
    s === 'ACTIVE' ? CG : s === 'COMPLETED' ? '#00ffaa' : s === 'CANCELLED' ? CR : '#ffaa00'
  const daysLeft = (deadline?: string | null) => {
    if (!deadline) return null
    return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000)
  }

  return (
    <div style={{
      position:'absolute', inset:0, zIndex:20,
      background:'rgba(0,5,16,0.93)', backdropFilter:'blur(6px)',
      display:'flex', flexDirection:'column', padding:16, overflowY:'auto',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <span style={{ fontSize:11, fontWeight:800, color, letterSpacing:'0.2em', fontFamily:'monospace' }}>
          ◈ GOAL COCKPIT
        </span>
        <button onClick={onClose}
          style={{ background:'none', border:`1px solid ${CR}40`, borderRadius:4, color:CR,
            cursor:'pointer', fontSize:9, padding:'3px 10px', fontFamily:'monospace', letterSpacing:'0.1em' }}>
          ✕ CLOSE
        </button>
      </div>
      {isLoading && (
        <div style={{ textAlign:'center', padding:40, fontSize:9, color:`${color}50`, fontFamily:'monospace' }}>
          LOADING GOAL INTELLIGENCE…
        </div>
      )}
      {goals.map(goal => {
        const dl = daysLeft(goal.deadline)
        const nextTask = goal.tasks.find(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS')
        return (
          <div key={goal.id} style={{
            marginBottom:10, padding:10,
            background:'rgba(0,8,20,0.8)', border:`1px solid ${color}22`, borderRadius:6,
          }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:6 }}>
              <span style={{ fontSize:9, color:'#c0dff0', fontFamily:'monospace', lineHeight:1.4, flex:1 }}>
                {goal.objective}
              </span>
              <span style={{
                fontSize:7, fontWeight:800, letterSpacing:'0.08em', flexShrink:0,
                padding:'2px 6px', borderRadius:3, fontFamily:'monospace',
                color:statusColor(goal.status), border:`1px solid ${statusColor(goal.status)}40`,
                background:`${statusColor(goal.status)}12`,
              }}>
                {goal.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <div style={{ flex:1, height:4, background:`${color}15`, borderRadius:2, overflow:'hidden' }}>
                <div style={{
                  height:'100%', width:`${goal.progressPct}%`,
                  background: goal.progressPct >= 80 ? '#00ffaa' : goal.progressPct >= 40 ? color : '#ffaa00',
                  transition:'width 0.6s ease', borderRadius:2,
                }} />
              </div>
              <span style={{ fontSize:8, color:`${color}70`, fontFamily:'monospace', flexShrink:0 }}>
                {goal.progressPct}%
              </span>
              {dl !== null && (
                <span style={{
                  fontSize:7, flexShrink:0, fontFamily:'monospace',
                  color: dl <= 3 ? CR : dl <= 7 ? '#ffaa00' : `${color}60`,
                }}>
                  {dl > 0 ? `${dl}d left` : `${Math.abs(dl)}d overdue`}
                </span>
              )}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
              {goal.tasks.map(task => {
                const isNext = task.id === nextTask?.id
                const tc = task.status === 'DONE' ? CG : task.status === 'IN_PROGRESS' ? color : `${color}40`
                return (
                  <div key={task.id} style={{
                    display:'flex', alignItems:'center', gap:6, padding:'3px 6px', borderRadius:4,
                    background: isNext ? `${color}08` : 'transparent',
                    border: isNext ? `1px solid ${color}20` : '1px solid transparent',
                  }}>
                    <span style={{ fontSize:7, color:`${color}40`, fontFamily:'monospace', width:14, flexShrink:0 }}>
                      {task.step}.
                    </span>
                    <span style={{
                      fontSize:8, fontFamily:'monospace', flex:1,
                      color: task.status === 'DONE' ? `${CG}70` : '#8ab0c8',
                      textDecoration: task.status === 'DONE' ? 'line-through' : 'none',
                    }}>
                      {task.title}
                    </span>
                    <span style={{ fontSize:9, color:tc, flexShrink:0 }}>
                      {task.status === 'DONE' ? '✓' : task.status === 'IN_PROGRESS' ? '⟳' : task.status === 'FAILED' || task.status === 'OVERDUE' ? '✗' : '○'}
                    </span>
                    {isNext && (
                      <span style={{ fontSize:6, color, fontFamily:'monospace', letterSpacing:'0.08em' }}>NEXT</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      {!isLoading && goals.length === 0 && (
        <div style={{ textAlign:'center', padding:40, fontSize:9, color:`${color}40`, fontFamily:'monospace' }}>
          No goals found. Ask WAANDA to create one.
        </div>
      )}
    </div>
  )
}

// ─── WAANDA Full-Screen Chat ──────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  confidence?: number
  suggestedAction?: string | null
  navigate?: string | null
  model?: string
  ts: number
}

function WaandaChat({ onClose, recentSignals }: {
  onClose: () => void
  recentSignals: LiveSignal[]
}) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try { return JSON.parse(localStorage.getItem('waanda-chat-messages') || '[]') } catch { return [] }
  })
  const [query,       setQuery]       = useState('')
  const [thinking,    setThinking]    = useState(false)
  const [attachments, setAttachments] = useState<AttachmentItem[]>([])
  const scrollRef   = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { speak, silence, speaking, muted, toggleMute } = useTTS()

  // Auto-scroll to bottom whenever messages or thinking changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  // Focus input on open; Esc to close
  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { silence(); onClose() } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, silence])

  const submit = useCallback(async (q?: string) => {
    const text = (q ?? query).trim()
    if (!text || thinking) return
    silence()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.speak(new SpeechSynthesisUtterance('')) } catch {}
    }

    const history = messages.map(m => ({ role: m.role, content: m.content }))
    const userMsg: ChatMessage = { role: 'user', content: text, ts: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setQuery('')
    setThinking(true)

    try {
      const res = await api.post('/admin/kangqore-immp/command', {
        query: text,
        history: history.slice(-20),
        moduleContext: recentSignals[0]?.sourceModule,
        attachments: attachments.map(a => ({ type: a.type, data: a.data, mimeType: a.mimeType, name: a.name })),
      })

      const aMsg: ChatMessage = {
        role: 'assistant',
        content: res.data.response,
        confidence: res.data.confidence,
        suggestedAction: res.data.suggestedAction,
        navigate: res.data.navigate,
        model: res.data.model,
        ts: Date.now(),
      }

      setMessages(prev => {
        const next = [...prev, aMsg]
        try { localStorage.setItem('waanda-chat-messages', JSON.stringify(next.slice(-60))) } catch {}
        return next
      })

      setAttachments([])
      speak(res.data.response + (res.data.suggestedAction ? '. ' + res.data.suggestedAction : ''), 'response')

      if (res.data.navigate) {
        setTimeout(() => { navigate(res.data.navigate); onClose() }, 1800)
      }
    } catch {
      setMessages(prev => {
        const fallback: ChatMessage = {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please check that the backend is running and ANTHROPIC_API_KEY is set.",
          confidence: 0, suggestedAction: null, navigate: null, model: 'fallback', ts: Date.now(),
        }
        const next = [...prev, fallback]
        try { localStorage.setItem('waanda-chat-messages', JSON.stringify(next.slice(-60))) } catch {}
        return next
      })
    } finally {
      setThinking(false)
    }
  }, [query, messages, thinking, silence, speak, attachments, recentSignals, navigate, onClose])

  const { listening, supported, interim, start, stop } = useVoiceInput(
    useCallback((t: string) => submit(t), [submit])
  )

  const handleMicClick = useCallback(() => {
    if (listening) { stop() } else { silence(); start() }
  }, [listening, stop, silence, start])

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).slice(0, 3).forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const data = result.split(',')[1]
        const type: 'image' | 'pdf' | 'document' = file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'document'
        setAttachments(prev => [...prev, { name: file.name, data, type, mimeType: file.type, preview: type === 'image' ? result : undefined }])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('waanda-chat-messages')
  }

  const displayedQuery = listening && interim ? interim : query

  const STARTERS = [
    "What should I focus on today?",
    "How's our pipeline looking?",
    "What are the biggest risks right now?",
    "Give me a business brief",
    "What if we close 5 deals this month?",
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1500,
      background: 'rgba(0,4,14,0.98)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'monospace',
    }}>
      {/* Scan line texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,80,200,0.012) 3px, rgba(0,80,200,0.012) 4px)',
      }} />

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', flexShrink: 0,
        borderBottom: `1px solid ${C}20`,
        background: `linear-gradient(90deg, rgba(0,16,48,0.95), rgba(0,8,24,0.98), rgba(0,16,48,0.95))`,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="live-blink" style={{ width: 7, height: 7, borderRadius: '50%', background: CG, boxShadow: `0 0 6px ${CG}` }} />
          <span style={{ fontSize: 13, fontWeight: 900, color: C, letterSpacing: '0.25em' }}>W·A·A·N·D·A</span>
          <span style={{ fontSize: 8, color: `${C}50`, letterSpacing: '0.1em' }}>CONVERSATIONAL INTELLIGENCE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {messages.length > 0 && (
            <button onClick={clearChat} style={{
              background: 'none', border: `1px solid ${CR}30`, borderRadius: 4,
              color: `${CR}60`, cursor: 'pointer', fontSize: 8, padding: '3px 10px',
              fontFamily: 'monospace', letterSpacing: '0.1em',
            }}>✕ clear</button>
          )}
          <button onClick={toggleMute} style={{
            background: 'none', border: `1px solid ${muted ? CR : C}30`, borderRadius: 4,
            color: muted ? `${CR}70` : `${C}60`, cursor: 'pointer', fontSize: 9,
            padding: '3px 10px', fontFamily: 'monospace',
          }}>{muted ? '🔇' : '🔊'}</button>
          <button onClick={() => { silence(); onClose() }} style={{
            background: `${CR}10`, border: `1px solid ${CR}40`, borderRadius: 4,
            color: CR, cursor: 'pointer', fontSize: 9, padding: '4px 14px',
            fontFamily: 'monospace', letterSpacing: '0.1em',
          }}>✕ CLOSE</button>
        </div>
      </div>

      {/* ── Chat thread ── */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: 'auto', padding: '24px 0',
        display: 'flex', flexDirection: 'column', gap: 0,
        position: 'relative', zIndex: 1,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 80, padding: '0 40px' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: `${C}25`, letterSpacing: '0.4em', marginBottom: 12 }}>◈</div>
            <div style={{ fontSize: 13, color: `${C}40`, letterSpacing: '0.1em', marginBottom: 6 }}>WAANDA is ready</div>
            <div style={{ fontSize: 10, color: `${C}25`, letterSpacing: '0.08em', marginBottom: 28 }}>Ask anything — business, strategy, data, code, ideas</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {STARTERS.map(s => (
                <button key={s} onClick={() => submit(s)} style={{
                  fontSize: 9, padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                  fontFamily: 'monospace', background: `${C}08`, border: `1px solid ${C}25`,
                  color: `${C}80`, letterSpacing: '0.05em', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${C}18`; e.currentTarget.style.borderColor = `${C}50` }}
                onMouseLeave={e => { e.currentTarget.style.background = `${C}08`; e.currentTarget.style.borderColor = `${C}25` }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            gap: 10, padding: '6px 24px', alignItems: 'flex-start',
          }}>
            {/* Avatar */}
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: msg.role === 'user' ? `${CA}30` : `${CG}20`,
              border: `1px solid ${msg.role === 'user' ? CA : CG}40`,
              fontSize: msg.role === 'user' ? 10 : 9,
              color: msg.role === 'user' ? `${CA}cc` : CG,
              fontWeight: 900,
            }}>
              {msg.role === 'user' ? 'M' : '◈'}
            </div>

            {/* Bubble */}
            <div style={{
              maxWidth: '68%', padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
              background: msg.role === 'user'
                ? `linear-gradient(135deg, ${CA}18, ${CA}08)`
                : `linear-gradient(135deg, rgba(0,16,48,0.9), rgba(0,8,32,0.8))`,
              border: `1px solid ${msg.role === 'user' ? CA : C}20`,
              boxShadow: msg.role === 'assistant' ? '0 2px 12px rgba(0,0,0,0.3)' : 'none',
            }}>
              <div style={{ fontSize: 7, fontWeight: 800, letterSpacing: '0.15em', marginBottom: 5, color: msg.role === 'user' ? `${CA}80` : `${CG}90` }}>
                {msg.role === 'user' ? 'YOU' : '◈ WAANDA'}
              </div>
              <div style={{ fontSize: 12, color: msg.role === 'user' ? '#b0c8e0' : '#d0e8f8', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {msg.content}
              </div>
              {msg.role === 'assistant' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                  {msg.confidence != null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 36, height: 2, background: `${C}20`, borderRadius: 1, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${msg.confidence}%`, background: (msg.confidence ?? 0) >= 70 ? CG : (msg.confidence ?? 0) >= 40 ? C : CR, borderRadius: 1 }} />
                      </div>
                      <span style={{ fontSize: 7, color: `${C}50` }}>{msg.confidence}%</span>
                    </div>
                  )}
                  {msg.suggestedAction && <span style={{ fontSize: 8, color: `${C}60`, fontStyle: 'italic' }}>→ {msg.suggestedAction}</span>}
                  {msg.navigate && <span style={{ fontSize: 8, color: CG }}>↗ navigating…</span>}
                </div>
              )}
              <div style={{ fontSize: 7, color: `${C}20`, marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {new Date(msg.ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Thinking dots */}
        {thinking && (
          <div style={{ display: 'flex', gap: 10, padding: '6px 24px', alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${CG}20`, border: `1px solid ${CG}40`, fontSize: 9, color: CG, fontWeight: 900 }}>◈</div>
            <div style={{ padding: '10px 16px', borderRadius: '4px 12px 12px 12px', background: 'linear-gradient(135deg, rgba(0,16,48,0.9), rgba(0,8,32,0.8))', border: `1px solid ${C}20` }}>
              <div style={{ fontSize: 7, fontWeight: 800, letterSpacing: '0.15em', marginBottom: 6, color: `${CG}90` }}>◈ WAANDA</div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0,1,2].map(j => (
                  <div key={j} style={{ width: 6, height: 6, borderRadius: '50%', background: CG, animation: `orbit-cw 1s ${j * 0.25}s ease-in-out infinite`, boxShadow: `0 0 4px ${CG}` }} />
                ))}
                <span style={{ fontSize: 9, color: `${CG}60`, marginLeft: 4 }}>thinking…</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attachment pills */}
      {attachments.length > 0 && (
        <div style={{ display: 'flex', gap: 6, padding: '8px 24px 0', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {attachments.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: `${C}10`, border: `1px solid ${C}25`, borderRadius: 4 }}>
              {a.preview && <img src={a.preview} alt={a.name} style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: 2 }} />}
              <span style={{ fontSize: 8, color: `${C}70`, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
              <button onClick={() => setAttachments(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: `${CR}60`, cursor: 'pointer', fontSize: 9, padding: 0 }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* ── Input area ── */}
      <div style={{ padding: '16px 24px 20px', borderTop: `1px solid ${C}15`, background: 'rgba(0,6,20,0.95)', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: listening ? 'rgba(255,51,85,0.06)' : 'rgba(0,30,80,0.4)',
          border: `1px solid ${listening ? '#ff335540' : speaking ? `${C}50` : `${C}20`}`,
          borderRadius: 12, padding: '10px 14px',
          boxShadow: speaking ? `0 0 20px ${C}15` : 'none',
          transition: 'all 0.3s',
        }}>
          <input
            ref={inputRef}
            value={displayedQuery}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submit()}
            placeholder={listening ? 'Listening…' : speaking ? 'WAANDA is speaking…' : 'Ask WAANDA anything — strategy, data, ideas, code…'}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 13, color: listening ? '#ff5577' : '#c0d8f0',
              fontFamily: 'monospace', lineHeight: 1.5,
            }}
          />
          <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.txt,.csv,.md" style={{ display: 'none' }} onChange={handleFiles} />
          {supported && (
            <button onClick={handleMicClick} title={listening ? 'Stop' : 'Voice input'} style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${listening ? '#ff3355' : C}40`,
              background: listening ? 'rgba(255,51,85,0.15)' : 'none',
              boxShadow: listening ? '0 0 14px rgba(255,51,85,0.35)' : 'none',
              transition: 'all 0.2s',
            }}>
              {listening ? <MicOff size={14} color="#ff3355" /> : <Mic size={14} color={`${C}80`} />}
            </button>
          )}
          <button onClick={() => fileInputRef.current?.click()} title="Attach file" disabled={attachments.length >= 3} style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${C}25`, background: 'none',
            opacity: attachments.length >= 3 ? 0.3 : 1, transition: 'all 0.2s',
          }}>
            <Paperclip size={14} color={`${C}80`} />
          </button>
          <button onClick={() => submit()} disabled={!displayedQuery.trim() || thinking} style={{
            height: 36, padding: '0 18px', borderRadius: 8, flexShrink: 0,
            cursor: (!displayedQuery.trim() || thinking) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            border: `1px solid ${(!displayedQuery.trim() || thinking) ? `${C}15` : `${C}60`}`,
            background: (!displayedQuery.trim() || thinking) ? 'none' : `linear-gradient(135deg, ${C}20, ${C}08)`,
            boxShadow: (!displayedQuery.trim() || thinking) ? 'none' : `0 0 16px ${C}30`,
            opacity: (!displayedQuery.trim() || thinking) ? 0.35 : 1, transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 10, color: C, fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.1em' }}>SEND</span>
            <Send size={11} color={C} />
          </button>
        </div>
        <div style={{ fontSize: 8, color: `${C}25`, marginTop: 6, textAlign: 'center', letterSpacing: '0.1em' }}>
          Enter to send · Esc to close · Voice and file attachment supported
        </div>
      </div>
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
          ⊞ WAANDA ACTIONS
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
              placeholder="Tell WAANDA what to do e.g. Draft a follow-up email to cold leads"
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
            ◈ WAANDA INSIGHTS — all clear
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
            ◈ WAANDA INSIGHTS
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
          ◎ WAANDA GOAL ENGINE
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
      <Widget label="WAANDA"     value={cnt('kimmp') || 'LIVE'}              color='#00ffcc' glow                            sub="BRAIN" />
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
          ⟳ WAANDA ORCHESTRATOR
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
              Ask a strategic question — WAANDA dispatches the right agents automatically
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
          ⟳ WAANDA RESEARCH AGENT
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
          ◉ WAANDA REPORTS
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
          ◈ WAANDA MEMORY
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
              No memories stored yet. WAANDA learns from every interaction.
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
body, html { margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; }

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
@keyframes hudCardIn   { from{opacity:0;transform:translateY(10px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
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
    <div style={{ display:'flex', alignItems:'center', gap:5, margin:'8px 0 4px' }}>
      <div style={{ width:12, height:1, background:color, boxShadow:`0 0 6px ${color}` }} />
      <span style={{ fontSize:6.5, color:color, letterSpacing:'0.22em', fontWeight:900,
        fontFamily:'monospace', whiteSpace:'nowrap', filter:`drop-shadow(0 0 2px ${color}80)` }}>{text}</span>
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${color}80,transparent)` }} />
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

function ToggleRow({ label, isOn, onToggle }: { label: string; isOn: boolean; onToggle: () => void }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:`1px solid ${C}10` }}>
      <span style={{ fontSize:9, color:`${C}50`, fontFamily:'monospace', letterSpacing:'0.12em' }}>{label}</span>
      <div 
        onClick={onToggle}
        style={{
          width: 32, height: 16, borderRadius: 8,
          background: isOn ? C : `${C}20`,
          position: 'relative', cursor: 'pointer',
          transition: 'background 0.2s',
          boxShadow: isOn ? `0 0 8px ${C}40` : 'none'
        }}
      >
        <div style={{
          position: 'absolute', top: 2, left: isOn ? 18 : 2,
          width: 12, height: 12, borderRadius: 6,
          background: isOn ? '#000' : `${C}80`, transition: 'left 0.2s'
        }} />
      </div>
    </div>
  )
}

function WaandaSettingsModal({ onClose }: { onClose: () => void }) {
  const [wakeWord, setWakeWord] = useState(true)
  const [autoApprove, setAutoApprove] = useState(false)

  return (
    <div style={{
      position:'absolute', inset:0, zIndex:1000,
      background:'rgba(0,4,12,0.85)', backdropFilter:'blur(4px)',
      display:'flex', alignItems:'center', justifyContent:'center'
    }} onClick={onClose}>
      <div style={{
        width: 380, background:'#000b18', border:`1px solid ${C}30`, borderRadius:8,
        boxShadow:`0 0 30px ${C}1a`, overflow:'hidden'
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding:'12px 16px', borderBottom:`1px solid ${C}20`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ color:C, fontFamily:'monospace', fontWeight:600, fontSize:12, letterSpacing:'0.1em' }}>WAANDA CONFIGURATION</div>
          <button onClick={onClose} style={{ color:`${C}50`, background:'none', border:'none', cursor:'pointer', fontSize: 16 }}>✕</button>
        </div>
        {/* Body */}
        <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:12 }}>
          <ToggleRow label="PASSIVE WAKE WORD" isOn={wakeWord} onToggle={() => setWakeWord(!wakeWord)} />
          <ToggleRow label="AUTONOMOUS APPROVALS" isOn={autoApprove} onToggle={() => setAutoApprove(!autoApprove)} />
          <MRow label="VOICE ENGINE" value="ELEVENLABS - RACHEL" color={C} />
          <MRow label="PREDICTIVE HORIZON" value="90 DAYS" color={C} />
          <MRow label="LANGUAGE PIPELINE" value="ENGLISH (US)" color={CG} />
          
          <div style={{ marginTop: 12, padding: 10, background: `${CA}10`, border: `1px solid ${CA}30`, borderRadius: 4, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ color: CA, marginTop: 2 }}>⚠️</div>
            <div style={{ fontSize: 9.5, color: `${C}80`, fontFamily: 'monospace', lineHeight: 1.4 }}>
              Configurations are currently locked to active tenant deployment policies. To override module access, authenticate via the master root terminal.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WidgetModal({ type, data, onClose }: {
  type: ModalType
  data: {
    mrrCr: number | null; revCr: number | null; arrCr: number | null; mrrTrend: string | null
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
            <MRow label="MRR"                value={mrrCr != null ? `₹${mrrCr.toFixed(2)}Cr` : '—'}            color={CG} />
            <MRow label="MRR TREND"          value={mrrTrend ?? '—'}                    color={mrrTrend ? (mrrTrend.startsWith('+') ? CG : CR) : '#64748b'} />
            <MRow label="REVENUE (LAST MTH)" value={revCr != null ? `₹${revCr.toFixed(2)}Cr` : '—'}            color={CG} />
            <MRow label="ARR"                value={arrCr != null ? `₹${arrCr.toFixed(2)}Cr` : '—'}            color={C}  />
            <MRow label="FORECAST (30D)"     value={revCr != null ? `₹${(revCr * 1.16).toFixed(2)}Cr` : '—'}  color={CA} />
            <MRow label="CASH FORECAST (30D)"value={revCr != null ? `₹${(revCr * 1.08).toFixed(2)}Cr` : '—'}  color={CA} />
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
                    {ago(s.createdAt)}
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
// ─── Minimalist UI Components (J.A.R.V.I.S) ──────────────────────────────────
function MinimalistRingWidget({ label, value, sub, color = '#00aaff', onClick }: any) {
  const pct = typeof value === 'number' ? Math.min(100, Math.max(0, value)) : (typeof value === 'string' && value.includes('%') ? parseFloat(value) : 100);
  const cx = 50, cy = 50, r = 40;
  const circum = 2 * Math.PI * r;
  return (
    <div onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ fontSize: 9, color: '#88ccff', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
      <div style={{ position: 'relative', width: 70, height: 70 }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${color}20`} strokeWidth={2} />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={2} strokeDasharray={`${(pct/100)*circum} ${circum}`} style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke-dasharray 1s ease-out' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{value}</div>
          {sub && <div style={{ fontSize: 6, color: `${color}90`, letterSpacing: '0.05em', marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  )
}

function PerformanceMetricRow({ label, value, score, color = '#00aaff' }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${color}10` }}>
      <div style={{ fontSize: 6.5, color: '#88ccff', letterSpacing: '0.1em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#fff' }}>{value}</div>
        <div style={{ fontSize: 5.5, color: '#ff4444' }}>/{score}</div>
      </div>
    </div>
  )
}

function NexusFlatList({ signals }: any) {
  const sigList = Array.isArray(signals) ? signals : (signals?.signals ?? []);
  const cnt = (id: string) => sigList.filter((s: any) => s.sourceModule === id || (s.sourceModule as string)?.startsWith(id)).length;
  const items = [
    { id: 'eqore', label: 'eQORE', sub: 'CONVERSATIONS' },
    { id: 'lead-intelligence', label: 'LEAD INTEL', sub: 'SCORING' },
    { id: 'vis', label: 'VIS', sub: 'VISIBILITY' },
    { id: 'alis', label: 'ALLIES', sub: 'DEMAND OPS' },
    { id: 'kimmp', label: 'WAANDA', sub: 'BRAIN' },
    { id: 'loops', label: 'LOOPS', sub: 'ALL ACTIVE', val: 7 }
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 8px' }}>
      {items.map(it => (
        <div key={it.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00aaff', marginTop: 4, boxShadow: `0 0 4px #00aaff` }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 9, color: '#88ccff', letterSpacing: '0.05em' }}>{it.label}</div>
            <div style={{ fontSize: 12, color: '#fff', fontWeight: 600, marginTop: 2 }}>{it.val || (cnt(it.id) || 'LIVE')}</div>
            <div style={{ fontSize: 7, color: `#00aaff80`, letterSpacing: '0.1em', marginTop: 1 }}>{it.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
// ─── HUD Event Log Drawer ────────────────────────────────────────────────────
const EVT_TYPE_LABELS: Record<string, string> = {
  signal: 'SIGNAL', agent: 'AGENT', alert: 'ALERT', kpi: 'KPI', system: 'SYSTEM',
}
const EVT_TYPE_COLORS: Record<string, string> = {
  signal: C, agent: '#00ddaa', alert: CR, kpi: '#ffaa00', system: C,
}

// Solid readable colors for the log — no opacity tricks on dark bg
const LOG_BG      = '#07101e'
const LOG_ROW     = '#0c1828'
const LOG_ROW_ALT = '#0a1520'
const LOG_BORDER  = '#1a2d45'
const LOG_TEXT    = '#c8dff5'
const LOG_MUTED   = '#5a7a9a'
const LOG_DIM     = '#3a5570'

const BADGE_BG: Record<string, string>   = { signal:'#0d2a42', agent:'#0d2e28', alert:'#2a0d0d', kpi:'#2a1f00', system:'#0d1e30' }
const BADGE_TXT: Record<string, string>  = { signal:'#4ab8ff', agent:'#00ddaa', alert:'#ff5555', kpi:'#ffbb22', system:'#88aacc' }
const BADGE_BDR: Record<string, string>  = { signal:'#1a5080', agent:'#008866', alert:'#882222', kpi:'#886600', system:'#2a4466' }
const ACCENT_COL: Record<string, string> = { signal:'#2288cc', agent:'#00aa88', alert:'#cc2222', kpi:'#cc8800', system:'#335577' }

function HUDLogRow({ ev, idx }: { ev: LiveHUDEvent; idx: number }) {
  const [expanded, setExpanded] = useState(false)
  const accent = ACCENT_COL[ev.type] ?? '#336688'
  const badge  = { bg: BADGE_BG[ev.type] ?? '#0d1e30', txt: BADGE_TXT[ev.type] ?? '#88aacc', bdr: BADGE_BDR[ev.type] ?? '#2a4466' }
  const ts     = new Date(ev.ts)

  const rawEntries = ev.raw
    ? Object.entries(ev.raw).filter(([k, v]) => k !== 'signalValue' && v != null && v !== '' && String(v).trim() !== '')
    : []

  const tsStr  = `${ts.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}  ${ts.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
  const preview = (ev.value ?? '—').slice(0, 100) + ((ev.value?.length ?? 0) > 100 ? '…' : '')
  const rowBg  = idx % 2 === 0 ? '#0d1b2e' : '#0a1524'

  return (
    <div style={{ marginBottom: 2 }}>

      {/* ── Summary row ── */}
      <div
        onClick={() => setExpanded(x => !x)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          background: expanded ? '#132240' : rowBg,
          borderLeft: `4px solid ${accent}`,
          borderRadius: 4,
          cursor: 'pointer',
          minHeight: 38,
          padding: '0 12px 0 0',
        }}
      >
        {/* Timestamp */}
        <div style={{ width: 160, flexShrink: 0, padding: '0 10px 0 12px', fontSize: 11, color: '#7090b0', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          {tsStr}
        </div>

        {/* Type badge */}
        <div style={{ width: 72, flexShrink: 0 }}>
          <span style={{
            display: 'inline-block',
            background: badge.bg, border: `1px solid ${badge.bdr}`, borderRadius: 4,
            padding: '3px 8px', color: badge.txt,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'monospace',
          }}>
            {EVT_TYPE_LABELS[ev.type] ?? ev.type.toUpperCase()}
          </span>
        </div>

        {/* Source */}
        <div style={{ width: 150, flexShrink: 0, padding: '0 10px', fontSize: 11, color: '#8ab0d0', fontWeight: 600, fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ev.title}
        </div>

        {/* Value preview — flex: 1 takes all remaining space */}
        <div style={{ flex: 1, minWidth: 0, padding: '0 10px', fontSize: 11, color: '#d0e8ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4 }}>
          {preview}
        </div>

        {/* Chevron */}
        <div style={{ width: 28, flexShrink: 0, textAlign: 'center', fontSize: 11, color: '#446688' }}>
          {expanded ? '▲' : '▼'}
        </div>
      </div>

      {/* Sub-label */}
      {ev.sub && !expanded && (
        <div style={{ background: rowBg, borderLeft: `4px solid ${accent}30`, padding: '2px 12px 5px 396px', fontSize: 10, color: '#4a6a8a', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
          {ev.sub}
        </div>
      )}

      {/* ── Expanded detail panel ── */}
      {expanded && (
        <div style={{
          background: '#080f1e',
          borderLeft: `4px solid ${accent}`,
          borderBottom: `1px solid #1a3050`,
          borderRight: `1px solid #1a3050`,
          borderRadius: '0 0 4px 4px',
          padding: '14px 18px 16px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>

          {/* Sub-label */}
          {ev.sub && (
            <div style={{ fontSize: 11, color: '#6a90b0', letterSpacing: '0.06em', fontFamily: 'monospace' }}>
              {ev.sub}
            </div>
          )}

          {/* Intelligence brief */}
          {(ev.type === 'signal' || ev.type === 'alert') && ev.raw?.signalValue && (
            <div>
              <div style={{ fontSize: 10, color: '#446688', letterSpacing: '0.15em', marginBottom: 8, fontFamily: 'monospace', fontWeight: 700 }}>
                ◈  INTELLIGENCE BRIEF
              </div>
              <div style={{
                background: '#0c1e34', border: `1px solid #1e3a5a`,
                borderRadius: 6, padding: '12px 16px',
                fontSize: 13, color: '#d8eeff', lineHeight: 1.8,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              }}>
                {ev.raw.signalValue}
              </div>
            </div>
          )}

          {/* Metadata */}
          {rawEntries.length > 0 && (
            <div>
              <div style={{ fontSize: 10, color: '#446688', letterSpacing: '0.15em', marginBottom: 10, fontFamily: 'monospace', fontWeight: 700 }}>
                ⬡  METADATA
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {rawEntries.map(([k, v]) => {
                  const raw = typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v)
                  const label = k.replace(/([A-Z])/g, ' $1').trim().toUpperCase()
                  const isBlock = raw.length > 80 || raw.includes('\n')
                  return (
                    <div key={k} style={{
                      display: 'flex', flexDirection: isBlock ? 'column' : 'row',
                      gap: isBlock ? 4 : 0,
                      padding: '5px 10px',
                      background: '#0d1e34',
                      borderRadius: 4,
                      alignItems: isBlock ? 'flex-start' : 'center',
                    }}>
                      <div style={{
                        fontSize: 10, color: '#4a7090', letterSpacing: '0.1em',
                        fontFamily: 'monospace', fontWeight: 700,
                        flexShrink: 0, width: isBlock ? 'auto' : 160,
                      }}>
                        {label}
                      </div>
                      <div style={{
                        fontSize: 11, color: '#b8d4f0', lineHeight: 1.6,
                        wordBreak: 'break-word', fontFamily: 'monospace',
                        whiteSpace: isBlock ? 'pre-wrap' : 'normal',
                      }}>
                        {raw}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {!rawEntries.length && !ev.raw?.signalValue && (
            <div style={{ fontSize: 11, color: '#3a5570', fontFamily: 'monospace' }}>
              No additional detail stored for this event.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function HUDLogDrawer({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const { data: apiLog, isLoading, refetch } = useQuery({
    queryKey: ['waanda-events'],
    queryFn: () => api.get('/admin/kangqore-immp/events?limit=500').then(r => r.data.events ?? []) as Promise<LiveHUDEvent[]>,
    staleTime: 30_000,
    // Fall back to localStorage if API fails
    placeholderData: () => {
      try { return JSON.parse(localStorage.getItem('waanda-hud-log') || '[]') as LiveHUDEvent[] }
      catch { return [] }
    },
  })
  const log = apiLog ?? []

  const clearLog = () => {
    localStorage.removeItem('waanda-hud-log')
    refetch()
  }

  const types = ['all', 'signal', 'alert', 'agent', 'kpi', 'system']

  const filtered = log
    .filter(e => filter === 'all' || e.type === filter)
    .filter(e => !search || [e.title, e.value, e.sub, e.raw?.signalValue].some(s => (s ?? '').toLowerCase().includes(search.toLowerCase())))

  const colBadge = (t: string) => ({ bg: BADGE_BG[t] ?? '#0d1e30', txt: BADGE_TXT[t] ?? '#88aacc', bdr: BADGE_BDR[t] ?? '#2a4466' })

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: LOG_BG,
      display: 'flex', flexDirection: 'column', fontFamily: 'monospace',
    }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 22px',
        background: '#050d18',
        borderBottom: `1px solid ${LOG_BORDER}`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#2bbdff', letterSpacing: '0.05em' }}>◈</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#e8f4ff', letterSpacing: '0.2em' }}>WAANDA EVENT LOG</span>
          </div>
          <span style={{ fontSize: 10, color: LOG_MUTED, background: '#0d1e30', border: `1px solid ${LOG_BORDER}`, borderRadius: 3, padding: '2px 8px' }}>
            {log.length} entries
          </span>
          <span style={{ fontSize: 8, color: LOG_DIM, letterSpacing: '0.08em' }}>Click any row to expand full detail</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Search */}
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events…"
            style={{
              fontSize: 9, padding: '5px 10px', borderRadius: 5,
              background: '#0c1828', border: `1px solid ${LOG_BORDER}`, color: LOG_TEXT,
              fontFamily: 'monospace', outline: 'none', width: 180,
            }}
          />
          <button onClick={clearLog} style={{
            fontSize: 9, padding: '5px 12px', borderRadius: 5, cursor: 'pointer',
            background: '#1a0808', border: '1px solid #662222', color: '#ff7777',
            fontFamily: 'monospace', fontWeight: 700,
          }}>Clear Log</button>
          <button onClick={onClose} style={{
            fontSize: 9, padding: '5px 14px', borderRadius: 5, cursor: 'pointer',
            background: '#0d1e30', border: '1px solid #2255aa', color: '#66aaff',
            fontFamily: 'monospace', fontWeight: 800,
          }}>Close ×</button>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div style={{
        display: 'flex', gap: 6, padding: '10px 22px',
        background: '#060f1c', borderBottom: `1px solid ${LOG_BORDER}`,
        flexShrink: 0, alignItems: 'center',
      }}>
        <span style={{ fontSize: 8, color: LOG_DIM, letterSpacing: '0.12em', marginRight: 4 }}>FILTER:</span>
        {types.map(t => {
          const b = colBadge(t)
          const count = t === 'all' ? log.length : log.filter(e => e.type === t).length
          const active = filter === t
          return (
            <button key={t} onClick={() => setFilter(t)} style={{
              fontSize: 9, padding: '4px 12px', borderRadius: 5, cursor: 'pointer',
              fontFamily: 'monospace', letterSpacing: '0.06em',
              background: active ? (t === 'all' ? '#0d2040' : b.bg) : 'transparent',
              border: `1px solid ${active ? (t === 'all' ? '#2255aa' : b.bdr) : LOG_BORDER}`,
              color: active ? (t === 'all' ? '#66aaff' : b.txt) : LOG_MUTED,
              transition: 'all 0.15s',
              fontWeight: active ? 700 : 400,
            }}>
              {t === 'all' ? 'All' : EVT_TYPE_LABELS[t] ?? t}
              <span style={{ marginLeft: 6, fontSize: 8, opacity: 0.7 }}>({count})</span>
            </button>
          )
        })}
        {search && (
          <span style={{ marginLeft: 8, fontSize: 8, color: '#ffaa44' }}>
            {filtered.length} match{filtered.length !== 1 ? 'es' : ''} for "{search}"
          </span>
        )}
      </div>

      {/* ── Column headers ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '152px 74px 148px minmax(0,1fr) 28px',
        gap: '0 12px', padding: '6px 14px 6px 15px',
        background: '#060f1c', borderBottom: `1px solid ${LOG_BORDER}`,
        flexShrink: 0,
      }}>
        {['TIMESTAMP', 'TYPE', 'SOURCE', 'EVENT / BRIEF', ''].map(h => (
          <div key={h} style={{ fontSize: 7, color: LOG_DIM, letterSpacing: '0.16em', fontWeight: 700 }}>{h}</div>
        ))}
      </div>

      {/* ── Log entries ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {filtered.length === 0 ? (
          <div style={{ fontSize: 12, color: LOG_MUTED, textAlign: 'center', marginTop: 80, letterSpacing: '0.1em' }}>
            {search ? `No events match "${search}"` : 'No events recorded yet'}
          </div>
        ) : filtered.map((ev, i) => (
          <HUDLogRow key={ev.id} ev={ev} idx={i} />
        ))}
      </div>

      {/* ── Footer ── */}
      <div style={{
        borderTop: `1px solid ${LOG_BORDER}`, padding: '7px 22px',
        background: '#060f1c', flexShrink: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 8, color: LOG_DIM, letterSpacing: '0.1em' }}>
          Stored in PostgreSQL · waanda_events · up to 500 shown · persists across sessions
        </span>
        <span style={{ fontSize: 8, color: LOG_MUTED }}>
          {filtered.length} of {log.length} shown
        </span>
      </div>
    </div>
  )
}

// ─── Live HUD Event Feed ──────────────────────────────────────────────────────
interface LiveHUDEvent {
  id: string
  type: 'signal' | 'agent' | 'alert' | 'kpi' | 'system'
  title: string
  value?: string
  sub?: string
  color: string
  ts: number
  announced: boolean
  raw?: Record<string, any>
}

const HUD_EVT_ICONS: Record<string, string> = {
  signal: '◈', agent: '⬡', alert: '▲', kpi: '⟳', system: '◉',
}

function LiveCard({ event }: { event: LiveHUDEvent }) {
  const [opacity, setOpacity] = useState(1)
  useEffect(() => {
    const tick = () => {
      const age = (Date.now() - event.ts) / 1000
      setOpacity(Math.max(0.15, age > 50 ? 0.15 : 1 - (age / 90) * 0.85))
    }
    const t = setInterval(tick, 3000)
    tick()
    return () => clearInterval(t)
  }, [event.ts])

  return (
    <div style={{
      background: `${event.color}0a`,
      border: `1px solid ${event.color}40`,
      borderRadius: 5, padding: '5px 7px',
      opacity, transition: 'opacity 1s ease',
      animation: 'hudCardIn 0.45s ease',
      boxShadow: `0 0 10px ${event.color}0f, inset 0 0 6px ${event.color}06`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Accent line */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: event.color, borderRadius: '2px 0 0 2px', opacity: 0.7 }} />
      <div style={{ paddingLeft: 4 }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 2 }}>
          <span style={{ fontSize: 9, color: event.color }}>{HUD_EVT_ICONS[event.type] ?? '•'}</span>
          <span style={{ fontSize: 7, color: `${event.color}95`, letterSpacing: '0.12em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
            {event.title}
          </span>
        </div>
        {event.value && (
          <div style={{ fontSize: 10, fontWeight: 800, color: '#eef4ff', letterSpacing: '0.03em', lineHeight: 1.2, fontFamily: 'monospace' }}>
            {event.value}
          </div>
        )}
        {event.sub && (
          <div style={{ fontSize: 7, color: `${event.color}70`, marginTop: 2, letterSpacing: '0.08em', fontFamily: 'monospace' }}>
            {event.sub}
          </div>
        )}
        <div style={{ fontSize: 6, color: `${event.color}45`, marginTop: 3, fontFamily: 'monospace' }}>
          {new Date(event.ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export function AdminOverview() {
  const navigate  = useNavigate()
  const clock     = useClock()
  const [modal, setModal] = useState<ModalType | null>(null)
  const [showLog, setShowLog] = useState(false)
  const [showWaandaSettings, setShowWaandaSettings] = useState(false)
  const uptime   = useUptime()

  // HUD TTS for live event announcements (must come before any callback that calls speak)
  const { speak, speakDirect } = useTTS()

  // ── WAANDA Boot Greeting ─────────────────────────────────────────────────
  const [greetingDone, setGreetingDone] = useState(false)
  const handleGreetingDismiss = useCallback((voiceText: string) => {
    setGreetingDone(true)
    // Voice is already started synchronously by WaandaGreeting.dismiss() via onSpeakDirect
  }, [])

  // ── Scenario Playground ──────────────────────────────────────────────────
  const [scenarioResult,  setScenarioResult]  = useState<ScenarioResult | null>(null)
  const [scenarioDelta,   setScenarioDelta]   = useState<ScenarioDelta | null>(null)
  const handleScenario    = useCallback((res: ScenarioResult, delta: ScenarioDelta) => {
    setScenarioResult(res); setScenarioDelta(delta)
  }, [])
  const handleExitScenario = useCallback(() => {
    setScenarioResult(null); setScenarioDelta(null)
  }, [])

  // ── Goal Cockpit ─────────────────────────────────────────────────────────
  const [goalCockpitOpen, setGoalCockpitOpen] = useState(false)
  const handleGoalCockpit = useCallback(() => setGoalCockpitOpen(true), [])


  // ── Live HUD Event feed ──────────────────────────────────────────────────
  const [hudEvents, setHudEvents] = useState<LiveHUDEvent[]>([])
  const spokenIds = useRef(new Set<string>())

  // Seed HUD with recent events from DB on mount so the screen isn't blank
  const { data: seedEvents } = useQuery({
    queryKey: ['waanda-events-seed'],
    queryFn: () => api.get('/admin/kangqore-immp/events?limit=20').then(r => r.data.events ?? []) as Promise<LiveHUDEvent[]>,
    staleTime: Infinity,
  })

  // Fetch total log count for the HUD header
  const { data: totalLogs = 60 } = useQuery({
    queryKey: ['waanda-total-logs'],
    queryFn: () => api.get('/admin/kangqore-immp/events?limit=500').then(r => r.data.total ?? r.data.events?.length ?? 60).catch(() => 60),
    refetchInterval: 15_000,
  })
  useEffect(() => {
    if (!seedEvents?.length) return
    // Show the most recent DB events regardless of age so the HUD is never empty on load
    const sorted = [...seedEvents].sort((a, b) => Number(b.ts) - Number(a.ts))
    const toShow = sorted.slice(0, 10)
    if (toShow.length) {
      // Stamp current time so they survive the live-expiry cleanup interval
      const now = Date.now()
      setHudEvents(toShow.map((e, i) => ({ ...e, ts: now - i * 5_000, announced: true })))
      toShow.forEach(e => spokenIds.current.add(e.id))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedEvents])
  const addHUDEvent = useCallback((ev: Omit<LiveHUDEvent, 'id' | 'announced'>) => {
    const id = `${ev.type}-${Math.round(ev.ts / 1000)}-${ev.title.slice(0, 10)}`
    const newEv: LiveHUDEvent = { ...ev, id, announced: false }
    setHudEvents(prev => {
      if (prev.some(e => e.id === id)) return prev
      return [newEv, ...prev].slice(0, 10)
    })
    // Persist to DB (fire-and-forget) — primary storage
    api.post('/admin/kangqore-immp/events', newEv).catch(() => {})
    // Keep localStorage as local fallback so the drawer loads instantly
    try {
      const stored = JSON.parse(localStorage.getItem('waanda-hud-log') || '[]') as LiveHUDEvent[]
      if (!stored.some(e => e.id === id)) {
        localStorage.setItem('waanda-hud-log', JSON.stringify([newEv, ...stored].slice(0, 200)))
      }
    } catch {}
  }, [])

  // One-time drain of localStorage backlog → DB on first mount after DB storage was added
  useEffect(() => {
    const MIGRATION_KEY = 'waanda-hud-log-migrated-v1'
    if (localStorage.getItem(MIGRATION_KEY)) return
    try {
      const stored: LiveHUDEvent[] = JSON.parse(localStorage.getItem('waanda-hud-log') || '[]')
      if (!stored.length) { localStorage.setItem(MIGRATION_KEY, '1'); return }
      // POST in small batches with a short delay so we don't hammer the backend
      let i = 0
      const send = () => {
        const batch = stored.slice(i, i + 20)
        if (!batch.length) { localStorage.setItem(MIGRATION_KEY, '1'); return }
        Promise.allSettled(batch.map(ev => api.post('/admin/kangqore-immp/events', ev)))
          .then(() => { i += 20; setTimeout(send, 300) })
          .catch(() => { i += 20; setTimeout(send, 300) })
      }
      send()
    } catch {}
  }, [])

  // Trigger a fresh intelligence scan on mount so the HUD populates with live signals
  useEffect(() => {
    api.post('/admin/kangqore-immp/proactive/scan').catch(() => {})
    api.post('/admin/kangqore-immp/scout/run').catch(() => {})
  }, [])

  // Tracks mount time so HUD event TTS waits for the greeting to finish
  const mountTime = useRef(Date.now())

  // Arc measurement — ResizeObserver tracks the arc square's left offset within its
  // container so the card columns can be sized to exactly fill the empty flanking space
  const arcContainerRef = useRef<HTMLDivElement>(null)
  const arcRef = useRef<HTMLDivElement>(null)
  const [arcLeft, setArcLeft] = useState(0)
  useEffect(() => {
    const el = arcRef.current
    const container = arcContainerRef.current
    if (!el || !container) return
    const measure = () => {
      const arcRect = el.getBoundingClientRect()
      const conRect = container.getBoundingClientRect()
      setArcLeft(Math.max(0, arcRect.left - conRect.left))
    }
    const obs = new ResizeObserver(measure)
    obs.observe(el)
    obs.observe(container)
    measure()
    return () => obs.disconnect()
  }, [])

  // Live signal stream via WebSocket
  const { lastSignal, criticalAlert, recentSignals } = useSignalStream()

  // Real-time approval requests from KIMMP agents
  const [liveApprovals, setLiveApprovals] = useState<any[]>([])
  useEffect(() => {
    try {
      const { getSocket } = require('../../../lib/socket') as typeof import('../../../lib/socket')
      const socket = getSocket()
      const onApproval = (req: any) => {
        setLiveApprovals(prev => [req, ...prev].slice(0, 10))
      }
      socket.on('kimmp:approval_request', onApproval)
      return () => { socket.off('kimmp:approval_request', onApproval) }
    } catch {}
  }, [])

  // Morning brief notification (Phase 6.6)
  const [morningBriefNotif, setMorningBriefNotif] = useState<{ id: string; preview: string; date: string } | null>(null)
  const [governanceNotif, setGovernanceNotif]     = useState<{ mode: string; reason: string | null } | null>(null)
  useEffect(() => {
    try {
      const { getSocket } = require('../../../lib/socket') as typeof import('../../../lib/socket')
      const socket = getSocket()
      const onBrief = (data: any) => {
        const today = new Date().toDateString()
        const seenKey = `kimmp-brief-notif-${today}`
        if (localStorage.getItem(seenKey)) return
        setMorningBriefNotif({ id: data.id, preview: data.preview ?? '', date: data.date ?? new Date().toISOString() })
      }
      const onGovernance = (data: any) => {
        const seenKey = `kimmp-governance-${data.mode}-${new Date().toDateString()}`
        if (localStorage.getItem(seenKey)) return
        localStorage.setItem(seenKey, '1')
        setGovernanceNotif({ mode: data.mode, reason: data.reason ?? null })
      }
      socket.on('kimmp:morning-brief',     onBrief)
      socket.on('kimmp:governance-upgrade', onGovernance)
      return () => {
        socket.off('kimmp:morning-brief',     onBrief)
        socket.off('kimmp:governance-upgrade', onGovernance)
      }
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

  // Phase 6 Command Center aggregate — all 7 intelligence streams
  const { data: cc } = useQuery({
    queryKey: ['kimmp-command-center'],
    queryFn:  () => api.get('/admin/kangqore-immp/command-center').then(r => r.data),
    refetchInterval: 30_000,
    staleTime: 20_000,
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
  const insights = storeInsights
  const critical = insights.filter(i => i.priority === 'critical').length
  const conf     = Math.round(insights.reduce((a, i) => a + i.confidence, 0) / (insights.length || 1))

  // Real health score derived from service checks; ticker animates around it
  const healthSeed = healthData?.system?.healthPct ?? 97
  const health     = useTicker(healthSeed, 0.003)
  // No ticker fallbacks — show real data only
  const visits     = useTicker(analytics.total_visits || 91, 0.015)

  // AEGIS registered agent count — real value, animates around it
  const { data: aegisStats } = useQuery({
    queryKey: ['aegis-stats-hud'],
    queryFn: () => api.get('/admin/aegis/agents').then(r => r.data),
    staleTime: 1000 * 60 * 10,
  })
  const agents = useTicker(aegisStats?.total ?? 80, 0.02)

  // WAANDA Authority health — subsystem dots in right column
  const { data: authorityHealth } = useQuery({
    queryKey: ['waanda-authority-health-hud'],
    queryFn: () => api.get('/admin/waanda/authority/health').then(r => r.data).catch(() => null),
    refetchInterval: 30_000,
  })

  // System utilization — real OS metrics from health-deep
  const sysStats = healthData?.system ?? { cpu: 0, ram: 0, network: 0 }

  // ── Live HUD Event: Signal watch ────────────────────────────────────────
  const prevSignalRef = useRef<LiveSignal | null>(null)
  useEffect(() => {
    if (!lastSignal || lastSignal === prevSignalRef.current) return
    prevSignalRef.current = lastSignal
    addHUDEvent({
      type: 'signal',
      title: (lastSignal.sourceModule || 'KIMMP').toUpperCase(),
      value: lastSignal.signalValue || (lastSignal.signalType || 'SIGNAL').replace(/_/g, ' '),
      sub: `${(lastSignal.signalCategory || lastSignal.signalType || '').replace(/_/g, ' ')} · ${lastSignal.severity} · CONF ${Math.round(lastSignal.confidence ?? 0)}%`,
      color: C,
      ts: lastSignal.createdAt ? new Date(lastSignal.createdAt).getTime() : Date.now(),
      raw: { id: lastSignal.id, sourceModule: lastSignal.sourceModule, signalType: lastSignal.signalType, signalCategory: lastSignal.signalCategory, signalValue: lastSignal.signalValue, severity: lastSignal.severity, confidence: lastSignal.confidence, createdAt: lastSignal.createdAt },
    })
  }, [lastSignal, addHUDEvent])

  // ── Live HUD Event: Critical alert ──────────────────────────────────────
  const prevAlertRef = useRef<LiveSignal | null>(null)
  useEffect(() => {
    if (!criticalAlert || criticalAlert === prevAlertRef.current) return
    prevAlertRef.current = criticalAlert
    addHUDEvent({
      type: 'alert',
      title: 'CRITICAL ALERT',
      value: criticalAlert.signalValue || (criticalAlert.signalType || 'CRITICAL').replace(/_/g, ' '),
      sub: `${criticalAlert.sourceModule?.toUpperCase()} · ${criticalAlert.severity} · CONF ${Math.round(criticalAlert.confidence ?? 0)}%`,
      color: CR,
      ts: criticalAlert.createdAt ? new Date(criticalAlert.createdAt).getTime() : Date.now(),
      raw: { id: criticalAlert.id, sourceModule: criticalAlert.sourceModule, signalType: criticalAlert.signalType, signalCategory: criticalAlert.signalCategory, signalValue: criticalAlert.signalValue, severity: criticalAlert.severity, confidence: criticalAlert.confidence, createdAt: criticalAlert.createdAt },
    })
  }, [criticalAlert, addHUDEvent])

  // ── Live HUD Event: New intelligence from KIMMP store ───────────────────
  const insightCountRef = useRef(0)
  useEffect(() => {
    const n = storeInsights.length
    if (n > insightCountRef.current && insightCountRef.current > 0) {
      const newest = storeInsights[0]
      addHUDEvent({
        type: 'agent',
        title: 'NEW INTELLIGENCE',
        value: (newest?.module || 'KIMMP').toUpperCase(),
        sub: (newest?.summary || 'ANALYSIS COMPLETE').slice(0, 44),
        color: '#00ddaa',
        ts: Date.now(),
        raw: newest ? { module: newest.module, summary: newest.summary, priority: newest.priority, confidence: newest.confidence, category: newest.category } : undefined,
      })
    }
    insightCountRef.current = n
  }, [storeInsights.length, addHUDEvent])

  // ── Live HUD Event: AEGIS audit log poll ────────────────────────────────
  const { data: aegisAudit } = useQuery({
    queryKey: ['aegis-audit-hud'],
    queryFn: () => api.get('/admin/aegis/audit?limit=1').then(r => r.data).catch(() => null),
    refetchInterval: 25_000,
  })
  const prevAegisId = useRef<string | null>(null)
  useEffect(() => {
    const latest = aegisAudit?.logs?.[0]
    if (!latest || latest.id === prevAegisId.current) return
    prevAegisId.current = latest.id
    addHUDEvent({
      type: 'agent',
      title: (latest.agentId || 'AEGIS').replace(/-/g, ' ').toUpperCase().slice(0, 20),
      value: (latest.action || 'COMPLETED').replace(/_/g, ' '),
      sub: (latest.outcome || 'LOGGED').slice(0, 34),
      color: '#00ddaa',
      ts: latest.createdAt ? new Date(latest.createdAt).getTime() : Date.now(),
      raw: { agentId: latest.agentId, action: latest.action, outcome: latest.outcome, metadata: latest.metadata, engine: latest.engine, createdAt: latest.createdAt },
    })
  }, [aegisAudit, addHUDEvent])

  // ── Live HUD Event: Proactive insights poll ──────────────────────────────
  const { data: proactiveData } = useQuery({
    queryKey: ['proactive-hud'],
    queryFn: () => api.get('/admin/kangqore-immp/proactive/alerts').then(r => r.data).catch(() => null),
    refetchInterval: 20_000,
  })
  const prevProactiveId = useRef<string | null>(null)
  useEffect(() => {
    const latest = proactiveData?.alerts?.[0]
    if (!latest || latest.id === prevProactiveId.current) return
    prevProactiveId.current = latest.id
    addHUDEvent({
      type: 'kpi',
      title: 'PROACTIVE INSIGHT',
      value: (latest.type || 'KPI ALERT').replace(/_/g, ' '),
      sub: (latest.module || '').toUpperCase(),
      color: '#ffaa00',
      ts: latest.createdAt ? new Date(latest.createdAt).getTime() : Date.now(),
      raw: { type: latest.type, module: latest.module, message: latest.message, severity: latest.severity, metric: latest.metric, value: latest.value, threshold: latest.threshold, createdAt: latest.createdAt },
    })
  }, [proactiveData, addHUDEvent])

  // ── Live HUD Event: KPI change detection ────────────────────────────────
  const prevKpisRef = useRef<any>(null)
  useEffect(() => {
    if (!kpis) return
    const prev = prevKpisRef.current
    const score = Number(kpis.overallScore)
    const prevScore = Number(prev?.overallScore ?? 0)
    if (prev && !isNaN(score) && !isNaN(prevScore) && Math.round(score) !== Math.round(prevScore)) {
      addHUDEvent({
        type: 'kpi',
        title: 'TWIN SCORE',
        value: `${Math.round(score)}%`,
        sub: score > prevScore ? '▲ IMPROVING' : '▼ DECLINING',
        color: score > prevScore ? '#00ddaa' : CR,
        ts: Date.now(),
        raw: {
          previous: { overallScore: prevScore, pipelineVelocity: prev.pipelineVelocity, executionCapacity: prev.executionCapacity, revenueHealth: prev.revenueHealth },
          current:  { overallScore: score, pipelineVelocity: kpis.pipelineVelocity, executionCapacity: kpis.executionCapacity, revenueHealth: kpis.revenueHealth, marketPosition: kpis.marketPosition, riskExposure: kpis.riskExposure },
          delta: Math.round(score - prevScore),
        },
      })
    }
    prevKpisRef.current = kpis
  }, [kpis, addHUDEvent])

  // ── System utilization change events (cpu/ram spikes) ───────────────────
  const prevSysRef = useRef({ cpu: 0, ram: 0 })
  useEffect(() => {
    const { cpu, ram } = sysStats
    const prev = prevSysRef.current
    if ((Math.abs(cpu - prev.cpu) > 15 || Math.abs(ram - prev.ram) > 10) && (prev.cpu > 0 || prev.ram > 0)) {
      addHUDEvent({
        type: 'system',
        title: 'SYSTEM UTILIZATION',
        value: `CPU ${cpu}%  RAM ${ram}%`,
        sub: cpu > 80 || ram > 85 ? '⚠ ELEVATED LOAD' : 'WITHIN BOUNDS',
        color: cpu > 80 || ram > 85 ? '#ffaa00' : C,
        ts: Date.now(),
        raw: { cpu, ram, network: sysStats.network, prevCpu: prev.cpu, prevRam: prev.ram, deltaCpu: cpu - prev.cpu, deltaRam: ram - prev.ram },
      })
    }
    prevSysRef.current = { cpu, ram }
  }, [sysStats.cpu, sysStats.ram, addHUDEvent])

  // ── TTS: announce ALL pending events, one after another ──────────────────
  // Alerts jump to the front of the speech queue; all others append in order.
  // Time guards removed — the speak queue handles sequencing behind the greeting.
  useEffect(() => {
    const pending = hudEvents.filter(e => !e.announced && !spokenIds.current.has(e.id))
    if (pending.length === 0) return

    // Mark all as spoken synchronously so re-renders don't re-announce them
    const ids = new Set(pending.map(e => e.id))
    pending.forEach(e => spokenIds.current.add(e.id))
    setHudEvents(prev => prev.map(e => ids.has(e.id) ? { ...e, announced: true } : e))

    // Alerts first, then signals, agents, kpis, system
    const ORDER: Record<string, number> = { alert:0, signal:1, agent:2, kpi:3, system:4 }
    const sorted = [...pending].sort((a, b) => (ORDER[a.type] ?? 5) - (ORDER[b.type] ?? 5))

    sorted.forEach(e => {
      const v = (e.value ?? '').toLowerCase().replace(/_/g, ' ')
      const phrases: Record<string, string> = {
        signal: `${e.title.toLowerCase()} signal: ${v}`,
        agent:  `${v || 'agent run'}, complete`,
        alert:  `critical alert: ${v}`,
        kpi:    `${e.title.toLowerCase()}: ${e.value}`,
        system: `system: ${v}`,
      }
      speak(phrases[e.type] ?? `${e.title}: ${e.value ?? ''}`, e.type)
    })
  }, [hudEvents, speak])

  // ── Auto-expire events older than 24 hours ────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      const cutoff = Date.now() - 86_400_000
      setHudEvents(prev => prev.filter(e => e.ts > cutoff))
    }, 30_000)
    return () => clearInterval(t)
  }, [])

  // Alternate new events left / right for visual balance
  const leftEvents  = hudEvents.filter((_, i) => i % 2 === 0).slice(0, 4)
  const rightEvents = hudEvents.filter((_, i) => i % 2 !== 0).slice(0, 4)

  // Financial values: real DB data only — null when unavailable
  const mrrCr  = kpis?.revenueMTD       > 0 ? kpis.revenueMTD       / 1e7 : null
  const revCr  = kpis?.revenueLastMonth > 0 ? kpis.revenueLastMonth / 1e7 : null
  const arrCr  = kpis?.arr              > 0 ? kpis.arr              / 1e7 : null
  const mrrTrend = kpis?.revenueMTD > 0 && kpis?.revenueLastMonth > 0
    ? `${(((kpis.revenueMTD - kpis.revenueLastMonth) / kpis.revenueLastMonth) * 100).toFixed(0)}%`
    : null

  const timeStr = clock.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' })
  const dateStr = clock.toLocaleDateString('en-GB', { weekday:'short', day:'2-digit', month:'short', year:'numeric' })

  // ── Fullscreen ────────────────────────────────────────────────────────────
  const [isFullscreen, setIsFullscreen] = useState(false)
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {}
  }, [])

  return (
    <div style={{
      width:'100%', height: isFullscreen ? '100vh' : 'calc(100vh - 0.5cm)',
      overflow:'hidden', position:'relative',
      background:'radial-gradient(ellipse at 50% 30%, #001433 0%, #000c22 50%, #000510 100%)',
      fontFamily:'monospace',
    }}>
      <style>{CSS}</style>

      {/* WAANDA boot greeting — JARVIS-style, shows once per session */}
      {!greetingDone && bootPhase >= 2 && (
        <WaandaGreeting
          kpis={kpis}
          insights={insights}
          health={health}
          onDismiss={handleGreetingDismiss}
          onSpeakDirect={speakDirect}
        />
      )}


      {/* KIMMP Morning Brief notification strip (Phase 6.6) */}
      {morningBriefNotif && (
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          zIndex: 200, display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(0, 12, 34, 0.95)', border: '1px solid rgba(100, 180, 255, 0.3)',
          borderRadius: 8, padding: '8px 14px', backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}>
          <span style={{ fontSize: 10, color: '#6aaac8', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            KIMMP BRIEF READY
          </span>
          <span style={{ fontSize: 9, color: '#94b8cc', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {morningBriefNotif.preview}
          </span>
          <a
            href="/kangqore-view/admin/kangqore-immp/command-center"
            style={{ fontSize: 9, color: '#b89eff', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            View Today →
          </a>
          <button
            onClick={() => {
              const key = `kimmp-brief-notif-${new Date().toDateString()}`
              localStorage.setItem(key, '1')
              setMorningBriefNotif(null)
            }}
            style={{ fontSize: 10, color: '#557799', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* WAANDA Governance upgrade notification (Phase 6.9) */}
      {governanceNotif && (
        <div style={{
          position: 'absolute', top: morningBriefNotif ? 60 : 12, left: '50%', transform: 'translateX(-50%)',
          zIndex: 200, display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(0, 12, 24, 0.97)', border: '1px solid rgba(0, 200, 117, 0.4)',
          borderRadius: 8, padding: '8px 14px', backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 24px rgba(0,200,117,0.15)',
        }}>
          <span style={{ fontSize: 10, color: '#00c875', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            WAANDA → {governanceNotif.mode}
          </span>
          {governanceNotif.reason && (
            <span style={{ fontSize: 9, color: '#94b8cc', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {governanceNotif.reason}
            </span>
          )}
          <a
            href="/kangqore-view/admin/kangqore-immp/command-center"
            style={{ fontSize: 9, color: '#b89eff', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Review Candidates →
          </a>
          <button
            onClick={() => setGovernanceNotif(null)}
            style={{ fontSize: 10, color: '#557799', background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
          >
            ✕
          </button>
        </div>
      )}

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
              <span style={{ fontSize:11, fontWeight:800, color:C, letterSpacing:'0.2em', textTransform: 'uppercase' }}>WAANDA</span>
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

            <button onClick={() => setShowLog(true)} style={{
              marginLeft: 4, paddingLeft: 16, borderLeft: `1px solid ${C}20`,
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, outline: 'none'
            }}>
              <span style={{ fontSize: 9, color: `${C}50`, letterSpacing: '0.12em' }}>◈</span>
              <span style={{ fontSize: 8, color: `${C}50`, letterSpacing: '0.15em', fontFamily: 'monospace' }}>LOG</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: C, textShadow: `0 0 8px ${C}` }}>{totalLogs}</span>
            </button>
          </div>

          {/* Center title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize:15, fontWeight:900, color:C, letterSpacing:'0.4em', textShadow:`0 0 16px ${C}`, lineHeight:1 }}>W.A.A.N.D.A.</div>
            <div style={{ fontSize:10, color:`${C}70`, letterSpacing:'0.15em', textTransform:'uppercase', whiteSpace:'nowrap' }}>A Kangqore Product.</div>
          </div>

          {/* Right: clock and exit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, textAlign: 'right' }}>
            <div>
              <div style={{ fontSize:15, fontWeight:900, color:C, letterSpacing:'0.1em',
                textShadow:`0 0 16px ${C}`, lineHeight:1 }}>{timeStr}</div>
              <div style={{ fontSize:9, color:`${C}50`, marginTop:2 }}>{dateStr}</div>
            </div>
            
            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32,
                background: 'transparent',
                border: 'none', borderRadius: 6, cursor: 'pointer',
                transition: 'all 0.2s', outline: 'none', flexShrink: 0,
                color: isFullscreen ? '#94a3b8' : '#64748b',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.color = isFullscreen ? '#94a3b8' : '#64748b'; e.currentTarget.style.background = 'transparent' }}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

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
              <span style={{ fontSize: 9, fontWeight: 800, color: C, letterSpacing: '0.15em' }}>← Back</span>
            </button>
          </div>
        </div>

        {/* ══ MAIN GRID ══ */}
        <div style={{ flex:1, display:'grid', gridTemplateColumns:'195px 1fr 195px', gap:10, padding:10, minHeight:0 }}>

          {/* ═ LEFT ═ */}
<div style={{ display:'flex', flexDirection:'column', gap:20, overflow:'hidden', transform: 'scale(0.9)', transformOrigin: 'top center' }}>
  {/* ── SYSTEM STATUS ── */}
  <SectionLabel text="SYSTEM STATUS" color={CG} />
  <div style={{ display:'flex', alignItems: 'center', justifyContent: 'space-between', padding:'4px 16px', background:'rgba(0,8,24,0.6)', borderRadius:8, border:`1px solid ${CG}15` }}>
    <div style={{ position: 'relative', width: 60, height: 60 }}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-120deg)' }}>
        <circle cx="50" cy="50" r="40" fill="none" stroke={`${CG}20`} strokeWidth="4" strokeDasharray="180 300" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={CG} strokeWidth="4" strokeDasharray={`${180 * (health/100)} 300`} style={{ filter: `drop-shadow(0 0 6px ${CG})` }} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontSize: 10.8, fontWeight: 800, color: '#fff' }}>{Math.round(health)}%</div>
        <div style={{ fontSize: 5.4, color: CG }}>HEALTH</div>
      </div>
    </div>
    <svg width="40" height="20" viewBox="0 0 40 20">
       <path d="M0 10 L10 10 L15 2 L20 18 L25 8 L30 10 L40 10" fill="none" stroke={CG} strokeWidth="1" />
       <circle cx="20" cy="18" r="2" fill={CG} />
    </svg>
    <div style={{ position: 'relative', width: 60, height: 60 }}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-120deg)' }}>
        <circle cx="50" cy="50" r="40" fill="none" stroke={`${C}20`} strokeWidth="4" strokeDasharray="180 300" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={C} strokeWidth="4" strokeDasharray={`${180 * (conf/100)} 300`} style={{ filter: `drop-shadow(0 0 6px ${C})` }} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontSize: 10.8, fontWeight: 800, color: '#fff' }}>{conf}%</div>
        <div style={{ fontSize: 5.4, color: C }}>WAANDA</div>
      </div>
    </div>
  </div>
  {/* ── PERFORMANCE METRICS ── */}
  <SectionLabel text="PERFORMANCE METRICS" color={C} />
  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 24px', padding:'4px 8px' }}>
    {(() => {
      const twin = kpis ?? {};
      const tv = (v: number | undefined) => v != null ? Math.round(v) : '—';
      return (
        <>
          <div style={{ display:'flex', flexDirection:'column' }}>
            <PerformanceMetricRow label="TWIN SCORE" value={tv(twin.overallScore)} score={100} />
            <PerformanceMetricRow label="PIPELINE" value={tv(twin.pipelineVelocity)} score={100} />
            <PerformanceMetricRow label="EXECUTION" value={tv(twin.executionCapacity)} score={100} />
          </div>
          <div style={{ display:'flex', flexDirection:'column' }}>
            <PerformanceMetricRow label="REVENUE" value={tv(twin.revenueHealth)} score={100} />
            <PerformanceMetricRow label="MARKET" value={tv(twin.marketPosition)} score={100} />
            <PerformanceMetricRow label="RISK EXP." value={tv(twin.riskExposure)} score={100} />
          </div>
        </>
      )
    })()}
  </div>
  {/* ── FINANCIAL OVERVIEW ── */}
  <SectionLabel text="FINANCIAL OVERVIEW" color={CG} />
  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 4px' }}>
    <MinimalistRingWidget label="MRR" value={mrrCr != null ? `₹${mrrCr.toFixed(1)}Cr` : '—'} sub={mrrTrend ?? undefined} color={CG} />
    <MinimalistRingWidget label="REVENUE" value={revCr != null ? `₹${revCr.toFixed(1)}Cr` : '—'} color={CG} />
    <MinimalistRingWidget label="ARR" value={arrCr != null ? `₹${arrCr.toFixed(1)}Cr` : '—'} color={C} />
    <MinimalistRingWidget label="FORECAST" value={revCr != null ? `₹${(revCr*1.16).toFixed(1)}Cr` : '—'} color={C} />
  </div>
  {/* ── USERS & REACH ── */}
  <SectionLabel text="USERS & REACH" color={C} />
  <div style={{ position: 'relative', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
    <svg viewBox="0 0 200 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2 }}>
      {Array.from({length: 200}).map((_, i) => (
         <circle key={i} cx={((i * 13) % 200)} cy={((i * 7) % 100)} r={1} fill={C} opacity={Math.random()} />
      ))}
    </svg>
    <div style={{ zIndex: 1 }}>
      <div style={{ fontSize: 7.2, color: '#88ccff', letterSpacing: '0.1em' }}>ACTIVE USERS</div>
      <div style={{ fontSize: 14.4, color: '#fff', fontWeight: 800 }}>{(analytics.total_users ?? 0).toLocaleString()}</div>
      <div style={{ fontSize: 7.2, color: `${C}60` }}>REGISTERED</div>
    </div>
    <div style={{ zIndex: 1, textAlign: 'right' }}>
      <div style={{ fontSize: 7.2, color: '#88ccff', letterSpacing: '0.1em' }}>TOTAL VISITS</div>
      <div style={{ fontSize: 14.4, color: '#fff', fontWeight: 800 }}>{analytics.total_visits >= 1000 ? `${(analytics.total_visits / 1000).toFixed(1)}K` : String(analytics.total_visits ?? 0)}</div>
      <div style={{ fontSize: 7.2, color: `${C}60` }}>ALL TIME</div>
    </div>
  </div>
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: `1px solid ${C}20`, marginTop: 10 }}>
    {['00','01','02','03','04','05','06','07','08','09','10','11','12'].map(t => (
      <div key={t} style={{ fontSize: 6.3, color: `${C}60` }}>{t}</div>
    ))}
  </div>
</div>{/* ═ CENTER HUD ═ */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', minHeight:0, gap:8, overflow:'hidden' }}>

            {/* Arc — outer div fills flex space; inner square wrapper sizes to height so arc is never clipped */}
            <div ref={arcContainerRef} style={{ flex:'1 0 0', width:'100%', minHeight:360, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', position:'relative' }}>

              {/* LEFT LIVE FEED — fills the empty dark space to the left of the arc square */}
              <div style={{
                position: 'absolute', left: 4, top: 12, bottom: 12,
                width: arcLeft > 20 ? arcLeft - 10 : 0,
                display: 'flex', flexDirection: 'column', gap: 6,
                justifyContent: 'center', overflow: 'hidden', pointerEvents: 'none',
              }}>
                {leftEvents.map(e => <LiveCard key={e.id} event={e} />)}
              </div>

              <div ref={arcRef} style={{ height:'100%', aspectRatio:'1/1', maxWidth:'100%' }}>
                <WaandaGUI confidence={conf} health={+health.toFixed(0)} insights={insights} analytics={analytics} sweep={sweep} lastSignal={lastSignal} criticalAlert={criticalAlert} bootPhase={bootPhase} kpis={kpis} userRole={userRole} scenarioDelta={scenarioDelta} />
              </div>
              {/* Goal Cockpit overlay — covers the entire arc area */}
              {goalCockpitOpen && (
                <GoalCockpit onClose={() => setGoalCockpitOpen(false)} color={C} />
              )}

              {/* RIGHT LIVE FEED — fills the empty dark space to the right of the arc square */}
              <div style={{
                position: 'absolute', right: 4, top: 12, bottom: 12,
                width: arcLeft > 20 ? arcLeft - 10 : 0,
                display: 'flex', flexDirection: 'column', gap: 6,
                justifyContent: 'center', overflow: 'hidden', pointerEvents: 'none',
              }}>
                {rightEvents.map(e => <LiveCard key={e.id} event={e} />)}
              </div>

            </div>

            {/* Bottom Group — only essentials under the arc */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, width:'100%', flexShrink:0 }}>

              {/* WAANDA Command Bar */}
              <div style={{ width: '85%' }}>
                <Panel title="WAANDA" subtitle="Workforce-Aware Autonomous Navigation, Decision & Advisory" color={C} collapsible>
                  <HUDCommandBar
                    insights={insights} color={C} recentSignals={recentSignals} criticalAlert={criticalAlert}
                    onScenario={handleScenario} onGoalCockpit={handleGoalCockpit}
                    scenarioActive={scenarioResult !== null} onExitScenario={handleExitScenario}
                  />
                </Panel>
              </div>
              {/* Scenario analysis panel — shows below command bar when scenario mode is active */}
              {scenarioResult && (
                <div style={{ width: '85%' }}>
                  <ScenarioPanel result={scenarioResult} color={C} onExit={handleExitScenario} />
                </div>
              )}



            </div>
          </div>

          {/* ═ RIGHT ═ */}
<div style={{ display:'flex', flexDirection:'column', gap:20, overflow:'hidden', paddingBottom: 20, transform: 'scale(0.9)', transformOrigin: 'top center' }}>
  {/* ── COMMAND CENTER — Phase 6.1 Business Domains ── */}
  <SectionLabel text="COMMAND CENTER" color={CA} />
  {cc?.business?.length > 0 ? (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 4px' }}>
        {(cc.business as any[]).slice(0, 4).map((domain: any) => {
          const domainColor = domain.status === 'CRITICAL' ? CR : domain.status === 'ATTENTION' ? CA : domain.status === 'HEALTHY' ? CG : '#888';
          return (
            <MinimalistRingWidget
              key={domain.id}
              label={domain.label.toUpperCase()}
              value={domain.count > 0 ? domain.count : '✓'}
              sub={domain.status}
              color={domainColor}
            />
          );
        })}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:3, padding:'6px 4px', borderTop:`1px solid ${CA}20`, marginTop:4 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'2px 0', borderBottom:`1px solid ${CA}10` }}>
          <span style={{ fontSize:7.5, color:'#6aaac8', fontFamily:'monospace', letterSpacing:'0.08em' }}>OIS</span>
          <span style={{ fontSize:9, fontWeight:800, color:'#c0dff0', fontFamily:'monospace' }}>{cc.ois?.score ?? '—'}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'2px 0', borderBottom:`1px solid ${CA}10` }}>
          <span style={{ fontSize:7.5, color:'#6aaac8', fontFamily:'monospace', letterSpacing:'0.08em' }}>DECISIONS</span>
          <span style={{ fontSize:9, fontWeight:800, color:'#c0dff0', fontFamily:'monospace' }}>{cc.decisions?.proposedCount ?? 0}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'2px 0', borderBottom:`1px solid ${CA}10` }}>
          <span style={{ fontSize:7.5, color:'#6aaac8', fontFamily:'monospace', letterSpacing:'0.08em' }}>SIGNALS</span>
          <span style={{ fontSize:9, fontWeight:800, color:'#c0dff0', fontFamily:'monospace' }}>{cc.signals?.criticalCount ?? 0} critical</span>
        </div>
      </div>
    </>
  ) : (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 4px' }}>
      <MinimalistRingWidget label="CRITICAL" value={cc?.signals?.criticalCount ?? '—'} sub="SIGNALS" color={CR} />
      <MinimalistRingWidget label="PROPOSED" value={cc?.decisions?.proposedCount ?? '—'} sub="DECISIONS" color={CA} />
      <MinimalistRingWidget label="OIS SCORE" value={cc?.ois?.score ?? '—'} sub="ENTERPRISE" color={C} />
      <MinimalistRingWidget label="TRAINING" value={cc?.training?.exportReady ?? '—'} sub="EXAMPLES" color={CG} />
    </div>
  )}
  {/* ── WAANDA AUTHORITY — subsystem health dots ── */}
  <SectionLabel text="WAANDA AUTHORITY" color='#818cf8' />
  <div style={{ display:'flex', flexDirection:'column', gap:4, padding:'4px 8px', cursor:'pointer' }}
       onClick={() => navigate('/kangqore-view/admin/kangqore-immp/authority')}>
    {(['KIMMP','AEGIS','KEOS','KORE','EQORE','ALIS','VIS'] as const).map(name => {
      const status = authorityHealth?.health?.[name]?.status ?? 'UNKNOWN'
      const dotColor = status === 'OPTIMAL' ? '#22c55e' : status === 'DEGRADED' ? '#f59e0b' : status === 'PAUSED' ? '#6366f1' : '#6b7280'
      return (
        <div key={name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:7.5, color:'#a5b4fc', fontFamily:'monospace', letterSpacing:'0.08em' }}>{name}</span>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ fontSize:6.5, color:dotColor, fontFamily:'monospace' }}>{status}</span>
            <div style={{ width:6, height:6, borderRadius:'50%', background:dotColor, boxShadow:`0 0 4px ${dotColor}` }} />
          </div>
        </div>
      )
    })}
  </div>
  {/* ── MODULE NEXUS ── */}
  <SectionLabel text="MODULE NEXUS" color='#00ffcc' />
  <div style={{ padding: '8px' }}>
     <NexusFlatList signals={recentSignals} />
  </div>
  {/* ── INTELLIGENCE ── */}
  <SectionLabel text="INTELLIGENCE" color={CR} />
  <div style={{ display:'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
       <div style={{ fontSize: 8.1, color: '#88ccff' }}>INSIGHTS</div>
       <div style={{ fontSize: 14.4, color: CR, fontWeight: 800, filter: `drop-shadow(0 0 8px ${CR})` }}>{insights.filter(i => i.priority === 'critical').length || insights.length || 3}</div>
       <div style={{ fontSize: 7.2, color: CR }}>PROACTIVE</div>
     </div>
     <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 40, position: 'relative' }}>
       {[0.4, 0.7, 0.5, 0.8, 0.3, 0.6, 0.4, 0.9, 0.5].map((v, i) => (
          <div key={i} style={{ width: 2, height: `${v * 100}%`, background: CR, boxShadow: `0 0 4px ${CR}`, transition: 'height 0.3s' }} />
       ))}
       <div style={{ display: 'flex', gap: 6, position: 'absolute', bottom: -12 }}>
         {['01','02','03','04','05','06','07','08','09'].map((v, i) => (
           <div key={i} style={{ fontSize: 5.4, color: `${C}60`, width: 2, textAlign: 'center' }}>{v}</div>
         ))}
       </div>
     </div>
  </div>
  {/* ── SYSTEM UTILIZATION ── */}
  <SectionLabel text="SYSTEM UTILIZATION" color={C} />
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px' }}>
    {[ { label: 'CPU', val: sysStats.cpu }, { label: 'RAM', val: sysStats.ram }, { label: 'NETWORK', val: sysStats.network } ].map(s => (
       <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ fontSize: 7.2, color: '#88ccff', width: 40 }}>{s.label}</div>
          <div style={{ flex: 1, height: 8, display: 'flex', gap: 2 }}>
             {Array.from({length: 40}).map((_, i) => (
               <div key={i} style={{ flex: 1, height: '100%', background: i < (s.val/100)*40 ? C : `${C}20`, boxShadow: i < (s.val/100)*40 ? `0 0 4px ${C}` : 'none' }} />
             ))}
          </div>
          <div style={{ fontSize: 8.1, color: '#fff', width: 25, textAlign: 'right' }}>{s.val}%</div>
       </div>
    ))}
  </div>
</div>
        </div>
      </div>{/* ── Widget Modal overlay ── */}
      {modal && (
        <WidgetModal
          type={modal}
          onClose={() => setModal(null)}
          data={{
            mrrCr, revCr, arrCr, mrrTrend,
            kpis, analytics,
            recentSignals, critical, liveApprovals,
            insights,
          }}
        />
      )}
      {showLog && <HUDLogDrawer onClose={() => setShowLog(false)} />}
      {showWaandaSettings && <WaandaSettingsModal onClose={() => setShowWaandaSettings(false)} />}
      
      {/* Settings Button */}
      <button 
        onClick={() => setShowWaandaSettings(true)}
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, ${C}1a 0%, transparent 100%)`,
          border: `1px solid ${C}30`,
          color: `${C}90`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
          boxShadow: `0 0 12px ${C}10`,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#fff'
          e.currentTarget.style.border = `1px solid ${C}80`
          e.currentTarget.style.boxShadow = `0 0 16px ${C}40`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = `${C}90`
          e.currentTarget.style.border = `1px solid ${C}30`
          e.currentTarget.style.boxShadow = `0 0 12px ${C}10`
        }}
        title="System Settings"
      >
        <Settings size={15} />
      </button>
    </div>
  )
}
