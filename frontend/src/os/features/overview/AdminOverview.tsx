import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { api } from '@lib/api'
import { useKIMMPStore, KIMMP_MOCK } from '@store/kimmp'

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = '#00d4ff'   // Primary Stark Cyan
const CG = '#0088ff'  // Stark Mid-Blue (replaces green)
const CR = '#ff3355'  // Keep red for critical errors
const CA = '#0044aa'  // Stark Deep Blue (replaces orange/purple)

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
    <div onClick={onClick} className={onClick ? 'cursor-pointer' : ''}
      style={{
        background: 'linear-gradient(135deg, rgba(0,8,24,0.95) 0%, rgba(0,15,40,0.9) 100%)',
        border: `1px solid ${color}30`,
        borderTop: `1px solid ${color}60`,
        borderRadius: 8,
        boxShadow: `0 0 20px ${color}10, inset 0 1px 0 ${color}20`,
        position: 'relative',
        overflow: 'hidden',
        padding: '10px 12px',
      }}
    >
      {/* corner accent */}
      <div style={{ position:'absolute', top:0, left:0, width:32, height:32,
        background: `linear-gradient(135deg, ${color}20 0%, transparent 60%)`,
        borderBottomRightRadius: 16 }} />
      <div style={{ position:'absolute', bottom:0, right:0, width:24, height:24,
        background: `linear-gradient(315deg, ${color}15 0%, transparent 60%)`,
        borderTopLeftRadius: 12 }} />
      {/* title */}
      <div className="flex items-center gap-2 mb-2">
        <div style={{ width:2, height:12, background: color, boxShadow:`0 0 6px ${color}`, borderRadius:1 }} />
        <span style={{ fontSize:9, fontFamily:'monospace', fontWeight:800, letterSpacing:'0.18em',
          color, textTransform:'uppercase' }}>{title}</span>
        <div style={{ flex:1, height:1, background:`linear-gradient(90deg, ${color}30, transparent)`, marginLeft:4 }} />
      </div>
      {children}
    </div>
  )
}

function DataRow({ label, value, trend, color = C }: { label: string; value: string; trend?: string; color?: string }) {
  const up = trend?.startsWith('+')
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'4px 0', borderBottom:`1px solid rgba(0,212,255,0.06)` }}>
      <span style={{ fontSize:10, color:'#3a6a8a', fontFamily:'monospace' }}>{label}</span>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <span style={{ fontSize:11, fontWeight:'bold', color:'#c0dff0', fontFamily:'monospace' }}>{value}</span>
        {trend && <span style={{ fontSize:9, fontWeight:700, color: up ? CG : CR, fontFamily:'monospace' }}>{trend}</span>}
      </div>
    </div>
  )
}

// ─── Central HUD SVG ──────────────────────────────────────────────────────────
function JarvisHUD({ confidence, health, analytics, sweep }: {
  confidence: number; health: number; analytics: any; sweep: number
}) {
  const W = 520, H = 520, cx = 260, cy = 260

  const modules = [
    { label:'REVENUE',  deg:0,   pct:82, color:CG  },
    { label:'CLIENTS',  deg:45,  pct:74, color:C   },
    { label:'PROJECTS', deg:90,  pct:61, color:C   },
    { label:'OPS',      deg:135, pct:88, color:CA  },
    { label:'FINANCE',  deg:180, pct:67, color:CG  },
    { label:'PEOPLE',   deg:225, pct:79, color:CA },
    { label:'KIMMP',    deg:270, pct:confidence, color:C },
    { label:'SYSTEM',   deg:315, pct:health, color:CG },
  ]

  return (
    <svg width="70%" viewBox={`0 0 ${W} ${H}`} style={{ maxHeight: '70%', overflow:'visible' }}>
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
      </defs>

      {/* ── Ring 0: Density Outer Ticks ── */}
      <circle cx={cx} cy={cy} r={240} fill="none" stroke={`${C}10`} strokeWidth={0.5} />
      {Array.from({length:360}, (_,i) => {
        const deg = i
        const major = deg % 10 === 0; const mid = deg % 5 === 0
        const rOut = 248, rIn = major ? 232 : mid ? 237 : 243
        if (!major && !mid && i%2!==0) return null // Skip some to create rhythmic density
        return <line key={i} x1={polar(cx,cy,rIn,deg).x} y1={polar(cx,cy,rIn,deg).y} 
          x2={polar(cx,cy,rOut,deg).x} y2={polar(cx,cy,rOut,deg).y}
          stroke={major ? `${C}90` : mid ? `${C}50` : `${C}20`}
          strokeWidth={major ? 1.5 : 0.5} filter={major ? 'url(#hglow)' : undefined} />
      })}

      {/* degree labels */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
        const p = polar(cx, cy, 222, deg)
        return <text key={deg} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          fill={`${C}60`} fontSize={7} fontFamily="monospace" letterSpacing="1px">{deg}°</text>
      })}

      {/* ── Ring 1: Fragmented Module sectors ── */}
      {modules.map(({ label, deg, pct, color }) => {
        const arcStart = deg - 18, arcEnd = deg + 18
        const valEnd   = deg - 18 + (pct/100) * 36
        const labelPt  = polar(cx, cy, 195, deg)
        return (
          <g key={label}>
            {/* fragmented background sector arc */}
            <path d={arcPath(cx,cy,205,arcStart,arcEnd)} fill="none"
              stroke={`${color}15`} strokeWidth={14} strokeLinecap="butt" strokeDasharray="2 2" />
            {/* primary thick arc */}
            <path d={arcPath(cx,cy,205,arcStart,valEnd)} fill="none"
              stroke={color} strokeWidth={12} strokeLinecap="butt"
              style={{ filter:`drop-shadow(0 0 8px ${color})` }} />
            {/* secondary thin outer tracking arc */}
            <path d={arcPath(cx,cy,215,arcStart,arcEnd)} fill="none"
              stroke={`${color}40`} strokeWidth={1} strokeLinecap="butt" strokeDasharray="4 6" />
            {/* tracking blip */}
            {(() => {
              const p = polar(cx, cy, 215, valEnd)
              return <circle cx={p.x} cy={p.y} r={2} fill="#fff" style={{filter:`drop-shadow(0 0 6px #fff)`}}/>
            })()}
            {/* label */}
            <text x={labelPt.x} y={labelPt.y} textAnchor="middle" dominantBaseline="middle"
              fill={`${color}ee`} fontSize={6.5} fontFamily="monospace" fontWeight="800"
              letterSpacing="0.2em">{label}</text>
          </g>
        )
      })}

      {/* ── Technical Decor Strings ── */}
      <text x={cx-160} y={cy-160} fill={`${C}40`} fontSize={6} fontFamily="monospace">AX-993: {health.toFixed(2)}</text>
      <text x={cx+120} y={cy-160} fill={`${C}40`} fontSize={6} fontFamily="monospace">TX-R: {(confidence*1.4).toFixed(1)}</text>
      <text x={cx-160} y={cy+160} fill={`${C}40`} fontSize={6} fontFamily="monospace">MEM: 0x8F2A</text>
      <text x={cx+120} y={cy+160} fill={`${C}40`} fontSize={6} fontFamily="monospace">SYS: STABLE</text>

      {/* ── Ring 2: fast counter-rotating dashes ── */}
      <g style={{ animation:'orbit-ccw 15s linear infinite', transformOrigin:`${cx}px ${cy}px` }}>
        {Array.from({length:180}, (_,i) => {
          const deg = i * 2
          const isGap = i % 10 === 0
          if (isGap) return null
          const p1 = polar(cx,cy,172,deg); const p2 = polar(cx,cy,175,deg)
          return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={`${C}40`} strokeWidth={1} />
        })}
      </g>
      <circle cx={cx} cy={cy} r={170} fill="none" stroke={`${C}18`} strokeWidth={1} />

      {/* ── Radar sweep wedge ── */}
      <g style={{ transformOrigin:`${cx}px ${cy}px`, transform:`rotate(${sweep}deg)` }}>
        <path d={`M ${cx} ${cy} ${arcPath(cx,cy,165,-20,0)} Z`}
          fill="url(#sweepGrad)" opacity={0.6} />
        <line x1={cx} y1={cy} x2={polar(cx,cy,165,0).x} y2={polar(cx,cy,165,0).y}
          stroke={C} strokeWidth={1.5} style={{ filter:`drop-shadow(0 0 6px ${C})` }} />
      </g>

      {/* ── Ring 3: inner highly structured dashes ── */}
      {Array.from({length:64}, (_,i) => {
        const deg = i * 5.625
        const p1 = polar(cx,cy,128,deg); const p2 = polar(cx,cy,134,deg)
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke={`${C}${i%4===0?'80':'30'}`} strokeWidth={i%4===0?2:0.5} />
      })}
      {/* rotating sub-ring */}
      <circle cx={cx} cy={cy} r={126} fill="none" stroke={`${C}40`} strokeWidth={0.5} 
        strokeDasharray="4 8" style={{ animation:'orbit-cw 20s linear infinite', transformOrigin:`${cx}px ${cy}px` }} />

      {/* ── Confidence & Health inner arcs ── */}
      <path d={arcPath(cx,cy,115,-135,-135+(confidence/100)*270)} fill="none"
        stroke={CG} strokeWidth={3} strokeLinecap="butt" strokeDasharray="1 2"
        style={{ filter:`drop-shadow(0 0 6px ${CG})` }} />
      <path d={arcPath(cx,cy,115,-135,135)} fill="none"
        stroke={`${CG}15`} strokeWidth={3} strokeLinecap="butt" />

      <path d={arcPath(cx,cy,106,-135,-135+(health/100)*270)} fill="none"
        stroke={C} strokeWidth={5} strokeLinecap="butt"
        style={{ filter:`drop-shadow(0 0 6px ${C})` }} />
      <path d={arcPath(cx,cy,106,-135,135)} fill="none"
        stroke={`${C}12`} strokeWidth={5} strokeLinecap="butt" />

      {/* ── Cardinal crosshair lines ── */}
      {[0,90,180,270].map(deg => {
        const p1 = polar(cx,cy,78,deg); const p2 = polar(cx,cy,95,deg)
        return <line key={deg} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke={C} strokeWidth={1} style={{ filter:`drop-shadow(0 0 4px ${C})` }} />
      })}
      {[45,135,225,315].map(deg => {
        const p1 = polar(cx,cy,78,deg); const p2 = polar(cx,cy,88,deg)
        return <line key={deg} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke={`${C}60`} strokeWidth={0.5} />
      })}

      {/* ── Complex Reactor rings ── */}
      <circle cx={cx} cy={cy} r={72} fill="url(#centerGrad)"
        stroke={`${C}40`} strokeWidth={1} style={{ filter:`drop-shadow(0 0 15px ${C}30)` }} />
      
      {/* 3 counter-rotating inner targeting reticles */}
      <circle cx={cx} cy={cy} r={64} fill="none" stroke={`${C}40`} strokeWidth={4}
        strokeDasharray="4 2 12 6" style={{ animation:'orbit-ccw 10s linear infinite', transformOrigin:`${cx}px ${cy}px` }} />
      
      <circle cx={cx} cy={cy} r={54} fill="none" stroke={`${C}60`} strokeWidth={1}
        strokeDasharray="2 4" style={{ animation:'orbit-cw 6s linear infinite', transformOrigin:`${cx}px ${cy}px` }} />
        
      <circle cx={cx} cy={cy} r={46} fill="none" stroke={`${C}80`} strokeWidth={0.5}
        strokeDasharray="40 10 20 10" style={{ animation:'orbit-ccw 25s linear infinite', transformOrigin:`${cx}px ${cy}px` }} />

      {/* ── Center logo ── */}
      <image href="/assets/kangqore-icon-white.png" x={cx-16} y={cy-16} width={32} height={32}
        opacity={0.8} style={{ filter:`drop-shadow(0 0 6px ${C})` }} />

      {/* ── Arc labels ── */}
      <text x={cx} y={cy+82} textAnchor="middle" fill={CG} fontSize={8} fontFamily="monospace" fontWeight="800" letterSpacing="0.1em">
        {confidence}% CONF
      </text>
      <text x={cx} y={cy+92} textAnchor="middle" fill={`${C}80`} fontSize={6} fontFamily="monospace" letterSpacing="0.1em">
        SYS {health.toFixed(1)}%
      </text>

      {/* ── Data readouts at compass points ── */}
      {[
        { deg:0,   val:`${analytics.total_users}`, label:'USR' },
        { deg:90,  val:`${analytics.clients}`,     label:'CLI' },
        { deg:180, val:`${analytics.partners}`,    label:'PRT' },
        { deg:270, val:`${analytics.total_visits}`,label:'VST' },
      ].map(({ deg, val, label }) => {
        const p = polar(cx, cy, 152, deg)
        return (
          <g key={deg}>
            <text x={p.x} y={p.y-4} textAnchor="middle" fill={C} fontSize={9}
              fontFamily="monospace" fontWeight="800"
              style={{ filter:`drop-shadow(0 0 4px ${C})` }}>{val}</text>
            <text x={p.x} y={p.y+6} textAnchor="middle" fill={`${C}60`}
              fontSize={6} fontFamily="monospace" letterSpacing="0.2em">{label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── CSS keyframes ─────────────────────────────────────────────────────────────
const CSS = `
@keyframes orbit-cw  { to { transform: rotate(360deg);  } }
@keyframes orbit-ccw { to { transform: rotate(-360deg); } }
@keyframes scanline  { 0%{top:0;opacity:.5} 80%{opacity:.3} 100%{top:100%;opacity:0} }
@keyframes blink2    { 0%,100%{opacity:1} 50%{opacity:.2} }
@keyframes datapulse { 0%,100%{opacity:.6} 50%{opacity:1} }
@keyframes hexspin   { to{transform:rotate(60deg)} }
.live-blink { animation: blink2 1.4s ease-in-out infinite; }
.data-pulse { animation: datapulse 2s ease-in-out infinite; }
`

// ─── Main ─────────────────────────────────────────────────────────────────────
export function AdminOverview() {
  const navigate = useNavigate()
  const clock    = useClock()
  const uptime   = useUptime()

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

  // KIMMP
  const storeInsights = useKIMMPStore(s => s.insights)
  const insights = storeInsights.length ? storeInsights : KIMMP_MOCK
  const critical = insights.filter(i => i.priority === 'critical').length
  const conf     = Math.round(insights.reduce((a, i) => a + i.confidence, 0) / (insights.length || 1))

  // Live tickers
  const health  = useTicker(97,   0.003)
  const mrr     = useTicker(2.45, 0.004)
  const rev     = useTicker(1.62, 0.006)
  const visits  = useTicker(analytics.total_visits || 91, 0.015)
  const agents  = useTicker(31,   0.02)

  const timeStr = clock.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' })
  const dateStr = clock.toLocaleDateString('en-GB', { weekday:'short', day:'2-digit', month:'short', year:'numeric' })

  return (
    <div style={{
      width:'100%', minHeight:'100%', position:'relative',
      background:'radial-gradient(ellipse at 50% 30%, #001433 0%, #000c22 50%, #000510 100%)',
      fontFamily:'monospace',
    }}>
      <style>{CSS}</style>

      {/* Grid overlay */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
        backgroundImage:`linear-gradient(${C}08 1px, transparent 1px), linear-gradient(90deg, ${C}08 1px, transparent 1px)`,
        backgroundSize:'40px 40px' }} />

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
              <span style={{ fontSize:11, fontWeight:800, color:C, letterSpacing:'0.2em' }}>KANGQORE-OS</span>
              <span style={{ fontSize:9, color:`${C}60` }}>v2.0 JARVIS</span>
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

          {/* Center title */}
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:13, fontWeight:900, color:C, letterSpacing:'0.35em',
              textShadow:`0 0 20px ${C}, 0 0 40px ${C}60` }}>STARK — KANGQORE</div>
            <div style={{ fontSize:8, color:`${C}50`, letterSpacing:'0.2em' }}>DIGITAL INTELLIGENCE SYSTEM</div>
          </div>

          {/* Right: clock and exit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, textAlign: 'right' }}>
            <div>
              <div style={{ fontSize:22, fontWeight:900, color:C, letterSpacing:'0.1em',
                textShadow:`0 0 16px ${C}`, lineHeight:1 }}>{timeStr}</div>
              <div style={{ fontSize:9, color:`${C}50`, marginTop:2 }}>{dateStr}</div>
            </div>
            
            <button 
              onClick={() => navigate('/kangqore-view/admin/kimmp')}
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
        <div style={{ flex:1, display:'grid', gridTemplateColumns:'220px 1fr 220px', gap:10, padding:10, minHeight:0 }}>

          {/* ═ LEFT ═ */}
          <div style={{ display:'flex', flexDirection:'column', gap:8, overflow:'hidden' }}>

            {/* Gauges row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6,
              padding:8, borderRadius:8, border:`1px solid ${C}20`,
              background:'rgba(0,8,24,0.8)' }}>
              <Gauge value={Math.round(health)} label="HEALTH" color={CG} size={100} />
              <Gauge value={conf} label="KIMMP" color={C} size={100} />
            </div>

            <Panel title="Revenue Intelligence" color={CG}>
              <DataRow label="MRR"          value={`₹${mrr.toFixed(2)} Cr`}    trend="+18%" color={CG} />
              <DataRow label="Revenue MTD"  value={`₹${rev.toFixed(2)} Cr`}    trend="+23%" color={CG} />
              <DataRow label="ARR"          value={`₹${(mrr*12).toFixed(1)} Cr`} />
              <DataRow label="Forecast 30D" value={`₹${(rev*1.16).toFixed(2)} Cr`} trend="+16%" />
              <DataRow label="Consultations" value={analytics.total_consultations.toString()} />
            </Panel>

            <Panel title="User Analytics" color={C}>
              <DataRow label="Total Users"  value={analytics.total_users.toString()}   trend="+6%"  />
              <DataRow label="Clients"      value={analytics.clients.toString()}        trend="+9%"  />
              <DataRow label="Partners"     value={analytics.partners.toString()}       trend="+5%"  />
              <DataRow label="Investors"    value={analytics.investors.toString()}                   />
              <DataRow label="Job Seekers"  value={analytics.job_seekers.toString()}               />
              <DataRow label="Site Visits"  value={Math.round(visits).toString()}       trend="+21%" />
            </Panel>

            <Panel title="System Status" color={CA}>
              {[
                { label:'API Core',      val:'ONLINE',  ok:true  },
                { label:'Auth Service',  val:'ACTIVE',  ok:true  },
                { label:'KIMMP Engine',  val:'RUNNING', ok:true  },
                { label:'Socket.io',     val:'LIVE',    ok:true  },
                { label:'DB Postgres',   val:'HEALTHY', ok:true  },
                { label:'Redis Cache',   val:'ACTIVE',  ok:true  },
              ].map(({ label, val, ok }) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'3px 0', borderBottom:`1px solid ${CA}10` }}>
                  <span style={{ fontSize:9, color:'#4a6a8a', fontFamily:'monospace' }}>{label}</span>
                  <span style={{ fontSize:9, fontWeight:700, color: ok ? CG : CR,
                    textShadow:`0 0 6px ${ok ? CG : CR}`, fontFamily:'monospace' }}>{val}</span>
                </div>
              ))}
            </Panel>
          </div>

          {/* ═ CENTER HUD ═ */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 30, minHeight:0 }}>

            {/* HUD */}
            <div style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <JarvisHUD confidence={conf} health={+health.toFixed(0)} insights={insights} analytics={analytics} sweep={sweep} />
            </div>

            {/* Bottom module bar */}
            <div style={{
              display:'flex', alignItems:'center', gap:10, padding:'8px 12px',
              background:'rgba(0,8,24,0.9)', borderRadius:10, border:`1px solid ${C}20`,
              flexShrink:0, width:'100%', justifyContent:'center', flexWrap:'wrap',
            }}>
              {[
                { label:'KIMMP',    path:'/kangqore-view/admin/kimmp',       color:C         },
                { label:'ANALYTICS',path:'/kangqore-view/admin/analytics',   color:CG        },
                { label:'CLIENTS',  path:'/kangqore-view/admin/clients',     color:C         },
                { label:'PROJECTS', path:'/kangqore-view/admin/projects',    color:CG        },
                { label:'FINANCE',  path:'/kangqore-view/admin/finance',     color:CA        },
                { label:'PEOPLE',   path:'/kangqore-view/admin/resources',   color:CA        },
                { label:'LEADS',    path:'/kangqore-view/admin/leads',       color:CG        },
                { label:'SETTINGS', path:'/kangqore-view/admin/settings',    color:`${C}80`  },
              ].map(({ label, path, color }) => (
                <button key={label} onClick={() => navigate(path)}
                  style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                    background:'transparent', border:'none', cursor:'pointer', padding:'4px 8px',
                  }}>
                  <div style={{
                    width:36, height:36, borderRadius:'50%', border:`1.5px solid ${color}60`,
                    background:`${color}08`, display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow:`0 0 10px ${color}20`, transition:'all 0.2s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${color}60`; (e.currentTarget as HTMLDivElement).style.borderColor = color }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 10px ${color}20`; (e.currentTarget as HTMLDivElement).style.borderColor = `${color}60` }}
                  >
                    <div style={{ width:8, height:8, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}` }} />
                  </div>
                  <span style={{ fontSize:7, color:`${color}90`, letterSpacing:'0.12em', fontWeight:700 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ═ RIGHT ═ */}
          <div style={{ display:'flex', flexDirection:'column', gap:8, overflow:'hidden' }}>

            <Panel title={`KIMMP Signals  •  ${critical} CRITICAL`} color={CR}>
              {insights.slice(0,4).map((ins) => (
                <div key={ins.id} style={{
                  padding:'5px 0', borderBottom:`1px solid ${CR}10`,
                  display:'flex', flexDirection:'column', gap:2
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:8, fontWeight:800, color:
                      ins.priority==='critical' ? CR : ins.priority==='high' ? CA : C,
                      letterSpacing:'0.1em' }}>{ins.priority.toUpperCase()}</span>
                    <span style={{ fontSize:8, color:`${C}50` }}>{ins.confidence}% conf</span>
                  </div>
                  <span style={{ fontSize:9, color:'#a0c8e0', lineHeight:1.4, fontFamily:'monospace' }}>{ins.title}</span>
                  <span style={{ fontSize:8, color:'#3a6080', lineHeight:1.3 }}>{ins.action}</span>
                </div>
              ))}
              <button onClick={() => navigate('/kangqore-view/admin/kimmp')}
                style={{ marginTop:6, width:'100%', padding:'5px', borderRadius:4,
                  background:`${CR}10`, border:`1px solid ${CR}30`, color:CR,
                  fontSize:9, fontWeight:700, cursor:'pointer', letterSpacing:'0.1em' }}>
                VIEW ALL SIGNALS →
              </button>
            </Panel>

            <Panel title="Financial Overview" color={CA}>
              <DataRow label="MRR"          value={`₹${mrr.toFixed(2)} Cr`} trend="+18%" />
              <DataRow label="Revenue MTD"  value={`₹${rev.toFixed(2)} Cr`} trend="+23%" />
              <DataRow label="ARR"          value={`₹${(mrr*12).toFixed(1)} Cr`}         />
              <DataRow label="Cash Forecast" value={`₹${(rev*1.08).toFixed(2)} Cr`}       />
            </Panel>

            <Panel title="Live Activity" color={CG}>
              {insights.slice(0,5).map((ins, i) => (
                <div key={ins.id} style={{ display:'flex', alignItems:'flex-start', gap:6, padding:'4px 0', borderBottom:`1px solid ${CG}08` }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', marginTop:3, flexShrink:0,
                    background: ins.priority==='critical' ? CR : ins.priority==='high' ? CA : CG,
                    boxShadow:`0 0 5px ${ins.priority==='critical' ? CR : CG}` }} />
                  <span style={{ fontSize:9, color:'#6090a8', lineHeight:1.4, flex:1 }}>{ins.title}</span>
                  <span style={{ fontSize:8, color:'#2a4a60', flexShrink:0 }}>{(i+1)*3}m</span>
                </div>
              ))}
            </Panel>

            <Panel title="AI Insight" color="#a78bfa">
              <div style={{ fontSize:10, color:'#b0d0e8', lineHeight:1.6, marginBottom:6 }}>
                {insights[0]?.summary}
              </div>
              <div style={{ fontSize:9, color:'#4a6a8a', lineHeight:1.5, marginBottom:8 }}>
                {insights[0]?.action}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:9, color:'#a78bfa60' }}>Impact: {insights[0]?.impact}</span>
                <button onClick={() => navigate('/kangqore-view/admin/kimmp')}
                  style={{ fontSize:9, color:'#a78bfa', background:'none', border:'none',
                    cursor:'pointer', fontWeight:700, fontFamily:'monospace' }}>
                  VIEW →
                </button>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}
