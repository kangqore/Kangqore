import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Brain, TrendingUp, TrendingDown, AlertCircle, CheckCircle2,
  Lightbulb, ChevronRight, Zap, BarChart2, Users, RefreshCw,
  Sliders, Clock, Activity, Terminal, ShieldAlert, Maximize2, Minimize2,
  MessageCircle, X, Send,
} from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

// ─── Palette / Theme ──────────────────────────────────────────────────────────
const C = '#00aaff'     // Electric Blue
const CG = '#00c875'    // Mid-Green
const CR = '#ff3333'    // Critical Red
const CA = '#7f53f9'    // Deep Violet

// ─── Geometry Helpers ─────────────────────────────────────────────────────────
const polar = (cx: number, cy: number, r: number, deg: number) => ({
  x: cx + r * Math.cos((deg - 90) * Math.PI / 180),
  y: cy + r * Math.sin((deg - 90) * Math.PI / 180),
})

function arcWedgePath(cx: number, cy: number, rInner: number, rOuter: number, startDeg: number, endDeg: number) {
  const p1 = polar(cx, cy, rInner, startDeg)
  const p2 = polar(cx, cy, rOuter, startDeg)
  const p3 = polar(cx, cy, rOuter, endDeg)
  const p4 = polar(cx, cy, rInner, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${p3.x} ${p3.y} L ${p4.x} ${p4.y} A ${rInner} ${rInner} 0 ${large} 0 ${p1.x} ${p1.y} Z`
}

// CCW arc for textPaths
function arcPathCCW(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polar(cx, cy, r, endDeg)
  const e = polar(cx, cy, r, startDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polar(cx, cy, r, startDeg)
  const e = polar(cx, cy, r, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
}

// ─── CSS Animations ───────────────────────────────────────────────────────────
const CSS = `
@keyframes orbit-cw    { to { transform: rotate(360deg);  } }
@keyframes orbit-ccw   { to { transform: rotate(-360deg); } }
@keyframes scanline    { 0%{top:0;opacity:.5} 80%{opacity:.3} 100%{top:100%;opacity:0} }
@keyframes blink2      { 0%,100%{opacity:1} 50%{opacity:.2} }
@keyframes datapulse   { 0%,100%{opacity:.6} 50%{opacity:1} }
@keyframes arcPulse    { 0%,100%{opacity:1} 50%{opacity:0.55} }
@keyframes arcPulseFast{ 0%,100%{opacity:1} 50%{opacity:0.35} }
@keyframes flowLine    { 0%{opacity:1;stroke-dashoffset:220} 70%{opacity:.7} 100%{opacity:0;stroke-dashoffset:0} }
@keyframes critFlash   { 0%,100%{opacity:1} 40%,60%{opacity:.15} }
@keyframes particlePop { 0%,100%{opacity:0;r:0} 30%,70%{opacity:.7;r:1.4} }
@keyframes widgetPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.88;transform:scale(1.012)} }
@keyframes hudCardIn   { from{opacity:0;transform:translateY(10px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
.live-blink  { animation: blink2 1.4s ease-in-out infinite; }
.data-pulse  { animation: datapulse 2s ease-in-out infinite; }
.widget-alive{ animation: widgetPulse 2.8s ease-in-out infinite; transition: all 0.3s; cursor: pointer; }
.widget-alive:hover { transform: scale(1.05); filter: drop-shadow(0 0 8px #00aaff); }
.hud-module  { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s; transform-origin: 50% 50%; cursor: pointer; }
.hud-module:hover { transform: scale(1.06); filter: brightness(1.5) drop-shadow(0 0 10px #00aaff); z-index: 10; }
`

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface LiveHUDEvent {
  id: string
  type: 'signal' | 'agent' | 'alert' | 'kpi' | 'system'
  title: string
  value?: string
  sub?: string
  color: string
  ts: number
  announced: boolean
}

// ─── Sub-Components ───────────────────────────────────────────────────────────
function SectionLabel({ text, color = C }: { text: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, margin: '8px 0 4px' }}>
      <div style={{ width: 12, height: 1, background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{
        fontSize: 6.5, color, letterSpacing: '0.22em', fontWeight: 900,
        fontFamily: 'monospace', whiteSpace: 'nowrap', filter: `drop-shadow(0 0 2px ${color}80)`
      }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}80, transparent)` }} />
    </div>
  )
}

function MinimalistRingWidget({ label, value, sub, color = C, onClick }: any) {
  const pct = typeof value === 'number' ? Math.min(100, Math.max(0, value)) : 100
  const cx = 50, cy = 50, r = 40
  const circum = 2 * Math.PI * r
  return (
    <div onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ fontSize: 7.2, color: '#88ccff', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
      <div style={{ position: 'relative', width: 70, height: 70 }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${color}15`} strokeWidth={2} />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={2} strokeDasharray={`${(pct / 100) * circum} ${circum}`} style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke-dasharray 1s ease-out' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{value}%</div>
          {sub && <div style={{ fontSize: 6, color: `${color}90`, letterSpacing: '0.05em', marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  )
}

function PerformanceMetricRow({ label, value, score, color = C, onClick }: any) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${color}10`, cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ fontSize: 6.5, color: '#88ccff', letterSpacing: '0.1em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#fff' }}>{value}</div>
        <div style={{ fontSize: 5.5, color: CR }}>/{score}</div>
      </div>
    </div>
  )
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
      </div>
    </div>
  )
}

// ─── WAANDA Boot Greeting (Immersive screen reveal) ───────────────────────────
function WaandaGreeting({ health, onDismiss }: { health: number; onDismiss: (voiceText: string) => void }) {
  const [phase, setPhase] = useState(0)
  const [exiting, setExiting] = useState(false)

  const hour = new Date().getHours()
  const tod = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  const voiceText = `Good ${tod}, user. WAANDA client interface online. All modules configured.`

  const LINES: Array<[number, { type: string; text: string; value?: string }]> = [
    [0,    { type: 'title',    text: 'W·A·A·N·D·A  HUD' }],
    [200,  { type: 'subtitle', text: 'CLIENT-SPECIFIC OPERATIONAL MESH & SIGNAL HUD' }],
    [400,  { type: 'divider',  text: '' }],
    [600,  { type: 'status',   text: 'Delivery telemetry',    value: '✓ NOMINAL' }],
    [800,  { type: 'status',   text: 'SLA compliance track',  value: '✓ ACTIVE' }],
    [1000, { type: 'status',   text: 'Risk Sentinel',         value: '✓ ONLINE' }],
    [1200, { type: 'status',   text: 'System health',         value: `✓ ${health.toFixed(0)}%` }],
    [1400, { type: 'divider',  text: '' }],
    [1700, { type: 'greeting', text: `Good ${tod}, client.` }],
    [2100, { type: 'body',     text: `Telemetry segments operational  ·  AEGIS shield active` }],
    [2500, { type: 'ready',    text: 'WAANDA online. Standing by for commands.' }],
    [3000, { type: 'prompt',   text: '[ CLICK ANYWHERE TO ACCESS TELEMETRY ]' }],
  ]

  useEffect(() => {
    const timers = LINES.map(([delay], i) =>
      setTimeout(() => setPhase(p => Math.max(p, i + 1)), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const dismiss = useCallback(() => {
    if (exiting) return
    setExiting(true)
    setTimeout(() => onDismiss(voiceText), 180)
  }, [exiting, onDismiss, voiceText])

  useEffect(() => {
    const onKey = () => dismiss()
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [dismiss])

  const shownLines = LINES.slice(0, phase).map(([, l]) => l)

  return (
    <div onClick={dismiss} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,3,10,0.98)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      opacity: exiting ? 0 : 1,
      transition: exiting ? 'opacity 0.25s ease' : 'none',
    }}>
      {/* Scanline */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,170,255,0.015) 3px, rgba(0,170,255,0.015) 4px)',
      }} />
      <div style={{ width: 560, maxWidth: '88vw', position: 'relative', padding: '32px 0', fontFamily: 'monospace' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {shownLines.map((l, i) => {
            if (l.type === 'title') return <div key={i} style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '0.15em' }}>{l.text}</div>
            if (l.type === 'subtitle') return <div key={i} style={{ fontSize: 9, color: `${C}c0`, letterSpacing: '0.08em' }}>{l.text}</div>
            if (l.type === 'divider') return <div key={i} style={{ height: 1, background: `${C}30`, margin: '4px 0' }} />
            if (l.type === 'status') return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#a0c0d8' }}>
                <span>{l.text}</span>
                <span className="live-blink" style={{ color: C }}>{l.value}</span>
              </div>
            )
            if (l.type === 'greeting') return <div key={i} style={{ fontSize: 13, color: '#fff', fontWeight: 800, marginTop: 8 }}>{l.text}</div>
            if (l.type === 'ready') return <div key={i} style={{ fontSize: 12, color: CG, fontWeight: 800, marginTop: 8 }}>{l.text}</div>
            if (l.type === 'prompt') return <div key={i} style={{ fontSize: 8, color: `${C}60`, letterSpacing: '0.1em', marginTop: 16, textAlign: 'center' }}>{l.text}</div>
            return <div key={i} style={{ fontSize: 11, color: '#6ab0d0', lineHeight: 1.5 }}>{l.text}</div>
          })}
        </div>
      </div>
    </div>
  )
}

// ─── WAANDA Panel ─────────────────────────────────────────────────────────────
function Panel({ title, subtitle, color = C, children, onClick }: {
  title: string; subtitle?: string; color?: string; children: React.ReactNode; onClick?: () => void
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
        <div style={{ position: 'absolute', top: 0, left: 11, width: 30, height: 2, background: color, boxShadow: `0 0 8px ${color}` }} />
        <div style={{ position: 'absolute', top: 11, left: 0, width: 2, height: 30, background: color, boxShadow: `0 0 8px ${color}` }} />
        <div style={{ position: 'absolute', bottom: 0, right: 11, width: 30, height: 2, background: color, boxShadow: `0 0 8px ${color}` }} />
        <div style={{ position: 'absolute', bottom: 11, right: 0, width: 2, height: 30, background: color, boxShadow: `0 0 8px ${color}` }} />
        {/* Scanlines background pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${color}05 3px, ${color}05 4px)`
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 800, color, letterSpacing: '0.2em' }}>
              [{title.toUpperCase()}]
            </div>
            {subtitle && (
              <div style={{ fontSize: 7, color: `${color}55`, letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>
                {subtitle}
              </div>
            )}
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}40, transparent)` }} />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── WAANDA Radial Core ───────────────────────────────────────────────────────
function WaandaGUI({
  confidence, health, sweep, lastSignal, criticalAlert, bootPhase, visibleModules, hovered, setHovered, selectedModule, setSelectedModule
}: {
  confidence: number; health: number; sweep: number
  lastSignal: any; criticalAlert: any; bootPhase: number
  visibleModules: any[]; hovered: string | null; setHovered: (h: string | null) => void
  selectedModule: number | null; setSelectedModule: (idx: number | null) => void
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTilt({
      x: ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -8,
      y: ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) *  8,
    })
  }
  const handleTiltEnd = () => setTilt({ x: 0, y: 0 })

  const cx = 260, cy = 260

  return (
    <div style={{ perspective: '1200px', width: '100%', height: '100%' }}
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltEnd}
    >
      <svg width="100%" height="100%"
        viewBox="90 90 340 340"
        preserveAspectRatio="xMidYMid meet"
        style={{
          overflow: 'visible', cursor: 'crosshair',
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
            <stop offset="40%" stopColor="#00aaff" />
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
          
          {visibleModules.map(({ label, line2, deg, type }) => {
            const s = deg - 22, e = deg + 22
            const rev = deg >= 120 && deg <= 240
            const fn = rev ? arcPathCCW : arcPath
            const r1 = type === 'project' ? 129 : 95
            return (
              <path
                key={`lbl-${deg}`}
                id={`lbl-${deg}`}
                d={fn(cx, cy, r1, s, e)}
                fill="none"
              />
            )
          })}
        </defs>

        {/* ── Ring 0: Density Outer Ticks ── */}
        <circle cx={cx} cy={cy} r={134} fill="none" stroke={`${C}10`} strokeWidth={0.5} />
        {Array.from({ length: 360 }, (_, i) => {
          const deg = i
          const major = deg % 10 === 0; const mid = deg % 5 === 0
          const rOut = 139, rIn = major ? 130 : mid ? 133 : 136
          if (!major && !mid && i % 2 !== 0) return null
          return <line key={i} x1={polar(cx, cy, rIn, deg).x} y1={polar(cx, cy, rIn, deg).y}
            x2={polar(cx, cy, rOut, deg).x} y2={polar(cx, cy, rOut, deg).y}
            stroke={major ? `${C}90` : mid ? `${C}50` : `${C}20`}
            strokeWidth={major ? 1.5 : 0.5} filter={major ? 'url(#hglow)' : undefined} />
        })}

        {/* degree labels */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
          const p = polar(cx, cy, 124, deg)
          return <text key={deg} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill={`${C}60`} fontSize={7} fontFamily="monospace" letterSpacing="1px">{deg}°</text>
        })}

        {/* ── Concentric Sectors Rings: Outer (Project) and Inner (Client Success) ── */}
        {visibleModules.map(({ label, line2, deg, pct, color, desc, type }, idx) => {
          const isHovered = hovered === label
          const isSelected = selectedModule === idx
          const isFaded = hovered !== null && !isHovered

          // Outer Ring (Project): Radius 102 to 128
          // Inner Ring (Client Success): Radius 78 to 94
          const rInner = type === 'project' ? 102 : 78
          const rOuter = type === 'project' ? 128 : 94

          const arcStart = deg - 24
          const arcEnd = deg + 24
          const valEnd = deg - 24 + (pct / 100) * 48

          const booted = bootPhase >= 2
          const bootDelay = `${idx * 0.12}s`

          const isCriticalArc = criticalAlert && (idx === 1 && pct < 70) // SLA critical warning
          const arcColor = isCriticalArc ? CR : color

          return (
            <g key={label}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelectedModule(idx)}
              style={{
                cursor: 'crosshair',
                opacity: !booted ? 0 : isFaded ? 0.25 : 1,
                transition: `opacity 0.3s, filter 0.3s`,
                animation: isCriticalArc ? 'critFlash 0.4s ease-in-out infinite' : 'arcPulse 3s ease-in-out infinite',
                animationDelay: booted ? bootDelay : '0s',
              }}>
              <path d={arcWedgePath(cx, cy, rInner, rOuter, arcStart, arcEnd)}
                fill={`${arcColor}10`} stroke={`${arcColor}30`} strokeWidth={0.5} />
              
              <path d={arcWedgePath(cx, cy, rInner, rOuter, arcStart, valEnd)}
                fill={arcColor} opacity={isSelected || isHovered ? 0.9 : 0.4}
                style={{ filter: `drop-shadow(0 0 ${isSelected || isHovered ? 12 : 3}px ${arcColor})`, transition: 'all 0.3s' }} />

              {(() => {
                const p = polar(cx, cy, (rInner + rOuter) / 2, valEnd)
                return <circle cx={p.x} cy={p.y} r={isSelected || isHovered ? 3.5 : 2.5} fill="#4ab6d4"
                  style={{ filter: 'drop-shadow(0 0 6px #4ab6d4)', transition: 'all 0.3s' }} />
              })()}

              <text fill="rgba(255,255,255,0.95)" fontSize={type === 'project' ? 6.5 : 5.2}
                fontFamily="monospace" fontWeight="900" letterSpacing="0.12em"
                style={{ filter: isSelected || isHovered ? 'drop-shadow(0 0 12px #4ab6d4)' : `drop-shadow(0 0 6px ${color})`, transition: 'all 0.3s' }}>
                <textPath href={`#lbl-${deg}`} startOffset="50%" textAnchor="middle">{label}</textPath>
              </text>
            </g>
          )
        })}


        {/* ── Ring 2: Core Reactor Assembly ── */}
        <circle cx={cx} cy={cy} r={74} fill="none" stroke={`${C}30`} strokeWidth={1} />

        {/* ── Ring 3: inner highly structured dashes ── */}
        {Array.from({ length: 72 }, (_, i) => {
          const deg = i * 5
          const p1 = polar(cx, cy, 56, deg); const p2 = polar(cx, cy, 62, deg)
          return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={`${C}${i % 3 === 0 ? '90' : '40'}`} strokeWidth={i % 3 === 0 ? 2 : 0.8} />
        })}

        {/* ── Hyper-Realistic Reactor Core with Expanded Confidence Readout HTML ── */}
        <circle cx={cx} cy={cy} r={54} fill="url(#metalBase)" stroke="url(#chromeRing)" strokeWidth={2} filter="url(#bevelDrop)" />
        {Array.from({ length: 10 }).map((_, i) => {
          const d = i * 36
          return <path key={i} d={arcWedgePath(cx, cy, 46, 52, d - 6, d + 6)} fill="url(#copperCoil)" filter="url(#bevelDrop)" />
        })}
        <circle cx={cx} cy={cy} r={46} fill="none" stroke="url(#chromeRing)" strokeWidth={6} filter="url(#innerShadow)" />
        <circle cx={cx} cy={cy} r={42} fill="#050a12" filter="url(#innerShadow)" />
        
        {/* Core light energy source */}
        <circle cx={cx} cy={cy} r={42} fill="url(#coreEnergy)" style={{ filter: `drop-shadow(0 0 15px #00aaff)`, opacity: 0.2 }} />
        
        {/* Embedded HTML ForeignObject for beautiful high-tech expanded confidence readout */}
        <foreignObject x={cx - 38} y={cy - 38} width={76} height={76} style={{ pointerEvents: 'none' }}>
          <div style={{
            width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            fontFamily: 'monospace', lineHeight: 1.15, pointerEvents: 'none',
          }}>
            {hovered ? (() => {
              const m = visibleModules.find(x => x.label === hovered)
              if (!m) return null
              return (
                <>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff', textShadow: '0 0 6px #00aaff' }}>{m.pct}%</span>
                  <span style={{ fontSize: '4.8px', color: '#00aaff', fontWeight: 800, textTransform: 'uppercase', marginTop: '1.5px', letterSpacing: '0.04em' }}>{m.label.split(' ')[0]}</span>
                  <span style={{ fontSize: '4px', color: '#88ccff', fontWeight: 700, textTransform: 'uppercase', marginTop: '1px' }}>{m.label.split(' ')[1] || ''}</span>
                  <span style={{ fontSize: '3.6px', color: '#4b7090', marginTop: '2.5px', textTransform: 'uppercase' }}>{m.desc.slice(0, 16)}</span>
                </>
              )
            })() : (
              <>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#fff', textShadow: '0 0 6px #00aaff' }}>{confidence}%</span>
                <span style={{ fontSize: '5px', color: '#00aaff', fontWeight: 800, letterSpacing: '0.05em', marginTop: '1.5px' }}>WAANDA CONF</span>
                <span style={{ fontSize: '4.2px', color: '#a0c0d8', fontWeight: 700, marginTop: '2.5px' }}>DECISION: {health}%</span>
                <span style={{ fontSize: '3.8px', color: '#5a7a9a', marginTop: '1px' }}>EVIDENCE: 84 SRC</span>
                <span style={{ fontSize: '3.4px', color: '#00c875', marginTop: '3px', animation: 'blink2 1.5s infinite' }}>UPDATED 12S AGO</span>
              </>
            )}
          </div>
        </foreignObject>

        <circle cx={cx} cy={cy} r={42} fill="url(#glassLens)" pointerEvents="none" />
      </svg>
    </div>
  )
}

// ─── Clock Hook ──────────────────────────────────────────────────────────────
function useClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(i)
  }, [])
  return t
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ClientWaanda() {
  const navigate = useNavigate()
  const clock = useClock()
  
  const [bootPhase, setBootPhase] = useState(0)
  const [sweep, setSweep] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [greetingDone, setGreetingDone] = useState(false)
  
  // Hover & selection states
  const [hovered, setHovered] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<number | null>(0)
  const [scenarioActive, setScenarioActive] = useState(false)

  // Sliders for Scenario simulator
  const [deadlineAccelerate, setDeadlineAccelerate] = useState(0)
  const [budgetAdjust, setBudgetAdjust] = useState(0)
  const [scopeAdd, setScopeAdd] = useState(0)

  // Dynamic Telemetry logs
  const [hudEvents, setHudEvents] = useState<LiveHUDEvent[]>([])

  // Modal State for Ring Widget Details
  const [activeModal, setActiveModal] = useState<'delivery' | 'sla' | 'budget' | 'velocity' | 'risk' | null>(null)

  // ── WAANDA Chat ───────────────────────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; streaming?: boolean }>>([])
  const [chatInput, setChatInput] = useState('')
  const [chatStreaming, setChatStreaming] = useState(false)
  const [chatConvId, setChatConvId] = useState<string | null>(() => localStorage.getItem('waanda-client-conv') ?? null)
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLTextAreaElement>(null)

  // Restore last conversation on open
  useEffect(() => {
    if (!chatOpen || chatMessages.length > 0) return
    const stored = localStorage.getItem('waanda-client-conv')
    if (!stored) return
    const token = localStorage.getItem('token')
    fetch(`/api/client/waanda/history?conversationId=${encodeURIComponent(stored)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data || !Array.isArray(data.messages) || data.messages.length === 0) return
        const restored = data.messages
          .filter((m: any) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .map((m: any) => ({ role: m.role, content: m.content }))
        if (restored.length > 0) setChatMessages(restored)
      })
      .catch(() => {})
  }, [chatOpen])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const sendChatMessage = useCallback(async () => {
    const text = chatInput.trim()
    if (!text || chatStreaming) return
    setChatInput('')
    setChatMessages((prev) => [...prev, { role: 'user', content: text }])
    setChatStreaming(true)

    const token = localStorage.getItem('token')
    let buffer = ''
    let assistantIdx = -1

    try {
      const res = await fetch('/api/client/waanda/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: text, conversationId: chatConvId }),
      })

      if (!res.ok || !res.body) throw new Error('stream failed')

      setChatMessages((prev) => {
        assistantIdx = prev.length
        return [...prev, { role: 'assistant', content: '', streaming: true }]
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const blocks = buffer.split('\n\n')
        buffer = blocks.pop() ?? ''
        for (const block of blocks) {
          if (!block.trim()) continue
          let event = 'message'
          const dataLines: string[] = []
          for (const line of block.split('\n')) {
            if (line.startsWith('event:')) event = line.slice(6).trim()
            else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim())
          }
          if (dataLines.length === 0) continue
          try {
            const payload = JSON.parse(dataLines.join(''))
            if (event === 'delta' && payload.text) {
              setChatMessages((prev) => {
                const next = [...prev]
                if (assistantIdx >= 0 && next[assistantIdx]) {
                  next[assistantIdx] = { ...next[assistantIdx], content: next[assistantIdx].content + payload.text }
                }
                return next
              })
            } else if (event === 'done') {
              if (payload.conversationId) {
                setChatConvId(payload.conversationId)
                localStorage.setItem('waanda-client-conv', payload.conversationId)
              }
              setChatMessages((prev) => {
                const next = [...prev]
                if (assistantIdx >= 0 && next[assistantIdx]) {
                  next[assistantIdx] = { ...next[assistantIdx], streaming: false }
                }
                return next
              })
            } else if (event === 'error') {
              setChatMessages((prev) => {
                const next = [...prev]
                if (assistantIdx >= 0 && next[assistantIdx]) {
                  next[assistantIdx] = { role: 'assistant', content: payload.message ?? 'WAANDA is temporarily unavailable.', streaming: false }
                }
                return next
              })
            }
          } catch { /* non-JSON chunk */ }
        }
      }
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: 'WAANDA is temporarily unavailable. Please try again.' }])
    } finally {
      setChatStreaming(false)
    }
  }, [chatInput, chatStreaming, chatConvId])

  // UAT Checklist items state
  const [checklist, setChecklist] = useState([
    { id: 1, label: 'AEGIS GUARD CORE INTEGRATION', status: 'PASSED', time: '10:42 UTC' },
    { id: 2, label: 'API MONDAY.COM CONNECTOR', status: 'PASSED', time: '12:15 UTC' },
    { id: 3, label: 'TELEMETRY SIGNAL STREAM', status: 'VERIFYING', time: 'Active' },
    { id: 4, label: 'HIPAA COMPLIANCE SCAN', status: 'PASSED', time: '09:00 UTC' },
    { id: 5, label: 'CLIENT FEEDBACK LOOP', status: 'PENDING', time: 'Scheduled' },
  ])

  // Project updates state
  const projectUpdates = [
    { text: 'Sprint 13 verification successfully complete.', time: 'July 03' },
    { text: 'API integration nodes with Monday.com finalized.', time: 'July 01' },
    { text: 'UAT client dashboard updates compiled for build.', time: 'June 30' },
  ]

  // Hover state for the bottom timeline roadmap ribbon
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)

  // Clock state
  const timeStr = clock.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = clock.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })

  // Boot sequence
  useEffect(() => {
    const ts = [
      setTimeout(() => setBootPhase(1), 300),
      setTimeout(() => setBootPhase(2), 800),
      setTimeout(() => setBootPhase(3), 1400),
      setTimeout(() => setBootPhase(4), 2000),
    ]
    return () => ts.forEach(clearTimeout)
  }, [])

  // Radar sweep animation
  useEffect(() => {
    const i = setInterval(() => setSweep(s => (s + 1.5) % 360), 17)
    return () => clearInterval(i)
  }, [])

  // Speech synthesiser trigger
  const speak = useCallback((text: string) => {
    try {
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 1.05
      u.volume = 0.95
      window.speechSynthesis.speak(u)
    } catch {}
  }, [])

  const handleGreetingDismiss = useCallback((voiceText: string) => {
    setGreetingDone(true)
    speak(voiceText)
  }, [speak])

  // Fullscreen trigger
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

  // Recalculations for Scenario Impact Simulator
  const simulatedOutputs = useMemo(() => {
    const baseSLA = 96
    const baseRisk = 15

    let sla = baseSLA
    sla -= deadlineAccelerate * 4
    sla -= scopeAdd * 3
    sla += (budgetAdjust >= 10 ? Math.floor(budgetAdjust / 10) * 2 : 0)
    sla = Math.min(100, Math.max(50, sla))
    const slaDelta = sla - baseSLA

    let risk = baseRisk
    risk += deadlineAccelerate * 8
    risk += scopeAdd * 6
    risk -= (budgetAdjust >= 10 ? Math.floor(budgetAdjust / 10) * 3 : 0)
    risk = Math.min(100, Math.max(5, risk))
    const riskDelta = risk - baseRisk

    let dateShiftDays = 0
    dateShiftDays -= deadlineAccelerate * 7
    dateShiftDays += scopeAdd * 5
    dateShiftDays -= (budgetAdjust >= 10 ? Math.floor(budgetAdjust / 10) * 2 : 0)

    const baseDate = new Date('2026-07-14')
    const finalDate = new Date(baseDate)
    finalDate.setDate(baseDate.getDate() + dateShiftDays)

    return {
      sla,
      slaDelta,
      risk,
      riskDelta,
      dateShiftDays,
      forecastedDate: finalDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  }, [deadlineAccelerate, budgetAdjust, scopeAdd])

  // Periodic Telemetry Updates
  useEffect(() => {
    const defaultSignals: Omit<LiveHUDEvent, 'id' | 'announced'>[] = [
      { type: 'signal', title: 'HIPAA COMPLIANCE', value: 'UAT Checklist: Passed', color: CG, ts: Date.now() - 3600000 },
      { type: 'signal', title: 'DELIVERY DISPATCH', value: 'Sprint 13 review completed successfully.', color: C, ts: Date.now() - 2400000 },
      { type: 'alert',  title: 'SLA WATCHDOG', value: 'Sprint velocity variance warning detected.', color: CR, ts: Date.now() - 1200000 },
      { type: 'kpi',    title: 'FINANCE MESH', value: 'Invoice INV-2026-042 processed.', color: CG, ts: Date.now() - 600000 },
    ]
    setHudEvents(defaultSignals.map((s, i) => ({ ...s, id: `seed-${i}`, announced: true })))

    const interval = setInterval(() => {
      const eventList: Omit<LiveHUDEvent, 'id' | 'announced'>[] = [
        { type: 'signal', title: 'UAT DEPLOYMENT', value: 'Client Portal build (v2.4.0) complete.', color: C, ts: Date.now() },
        { type: 'signal', title: 'INTELLIGENCE CORE', value: 'Sprint velocity model calibration complete.', color: CG, ts: Date.now() },
        { type: 'alert',  title: 'AEGIS AUDIT', value: 'Resource limits checked by sentinel agent.', color: CR, ts: Date.now() },
        { type: 'kpi',    title: 'MRR TRAJECTORY', value: 'Forecast update uploaded in ontology.', color: C, ts: Date.now() },
      ]
      const randomEv = eventList[Math.floor(Math.random() * eventList.length)]
      const id = `${randomEv.type}-${Date.now()}`
      setHudEvents(prev => [{ ...randomEv, id, announced: false }, ...prev].slice(0, 10))
    }, 14000)

    return () => clearInterval(interval)
  }, [])

  // Module configurations for Concentric Dial (Outer: Project, Inner: Client Success)
  const modules = [
    // Outer Ring (Project) - degs: 0, 72, 144, 216, 288
    { label: 'DELIVERY PACE', deg: 0,   pct: 93,  color: C,  desc: 'Pace vs targets', type: 'project' },
    { label: 'SLA COMPLIANCE', deg: 72,  pct: simulatedOutputs.sla,  color: CG, desc: 'SLA conformance', type: 'project' },
    { label: 'BUDGET HEALTH', deg: 144, pct: 88,  color: C,  desc: 'Spent vs planned', type: 'project' },
    { label: 'SPRINT VELOCITY', deg: 216, pct: 87,  color: CG, desc: 'Sprint completed velocity', type: 'project' },
    { label: 'PROJECT RISK', deg: 288, pct: simulatedOutputs.risk, color: CR, desc: 'Simulated overall risk', type: 'project' },
    
    // Inner Ring (Client Success) - degs: 36, 108, 180, 252, 324
    { label: 'TRUST INDEX', deg: 36,  pct: 94,  color: CA, desc: 'Client trust rating', type: 'success' },
    { label: 'SATISFACTION', deg: 108, pct: 91,  color: C,  desc: 'Sync feedback score', type: 'success' },
    { label: 'ENGAGEMENT', deg: 180, pct: 89,  color: CG, desc: 'Collab sync index', type: 'success' },
    { label: 'ADOPTION RATE', deg: 252, pct: 82,  color: C,  desc: 'Usage velocity', type: 'success' },
    { label: 'COMMUNICATION', deg: 324, pct: 95,  color: CA, desc: 'Mail response index', type: 'success' }
  ]

  const selectedModData = selectedModule !== null ? modules[selectedModule] : null

  const leftEvents = hudEvents.filter((_, i) => i % 2 === 0).slice(0, 4)
  const rightEvents = hudEvents.filter((_, i) => i % 2 !== 0).slice(0, 4)

  const toggleChecklistItem = (id: number) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'PASSED' ? 'VERIFYING' : item.status === 'VERIFYING' ? 'PENDING' : 'PASSED'
        return { ...item, status: nextStatus, time: nextStatus === 'PASSED' ? 'Updated' : nextStatus === 'VERIFYING' ? 'Active' : 'Scheduled' }
      }
      return item
    }))
  }

  return (
    <div style={{
      width: '100%', height: isFullscreen ? '100vh' : 'calc(100vh - 0.5cm)',
      overflow: 'hidden', position: 'relative',
      background: 'radial-gradient(ellipse at 50% 30%, #001433 0%, #000c22 50%, #000510 100%)',
      fontFamily: 'monospace',
    }}>
      <style>{CSS}</style>

      {/* Boot reveal */}
      {!greetingDone && bootPhase >= 2 && (
        <WaandaGreeting health={97} onDismiss={handleGreetingDismiss} />
      )}

      {/* Grid overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(${C}15 1px, transparent 1px),
          linear-gradient(90deg, ${C}15 1px, transparent 1px),
          linear-gradient(${C}05 1px, transparent 1px),
          linear-gradient(90deg, ${C}05 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
        backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px'
      }} />

      {/* Scanline */}
      <div style={{ position: 'absolute', left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${C}60, transparent)`,
        animation: 'scanline 6s linear infinite', pointerEvents: 'none', zIndex: 1 }} />

      {/* Corner decorations */}
      {[{ t: 0, l: 0 }, { t: 0, r: 0 }, { b: 0, l: 0 }, { b: 0, r: 0 }].map((pos, i) => (
        <svg key={i} width={60} height={60} style={{ position: 'absolute', ...pos as any, pointerEvents: 'none', zIndex: 1 }}>
          <path d={i === 0 ? 'M0 0 L50 0 L50 6 L6 6 L6 50 L0 50 Z' : i === 1 ? 'M60 0 L10 0 L10 6 L54 6 L54 50 L60 50 Z' : i === 2 ? 'M0 60 L0 10 L6 10 L6 54 L50 54 L50 60 Z' : 'M60 60 L60 10 L54 10 L54 54 L10 54 L10 60 Z'}
            fill={`${C}40`} />
        </svg>
      ))}

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ══ TOP BAR ══ */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 20px', borderBottom: `1px solid ${C}25`,
          background: `linear-gradient(90deg, rgba(0,20,60,0.9), rgba(0,8,24,0.95), rgba(0,20,60,0.9))`,
          backdropFilter: 'blur(10px)', flexShrink: 0,
        }}>
          {/* Left info status block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="live-blink" style={{ width: 8, height: 8, borderRadius: '50%', background: CG, boxShadow: `0 0 8px ${CG}` }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: C, letterSpacing: '0.2em', textTransform: 'uppercase' }}>WAANDA</span>
            </div>
            {[
              { label: 'HEALTH', val: '97%', color: CG },
              { label: 'DELIVERY', val: 'PACE OK', color: C },
              { label: 'SESSION', val: 'ONLINE', color: CA },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 16, borderLeft: `1px solid ${C}20` }}>
                <span style={{ fontSize: 8, color: `${C}50`, letterSpacing: '0.15em' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color, textShadow: `0 0 8px ${color}` }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Center Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: C, letterSpacing: '0.4em', textShadow: `0 0 16px ${C}`, lineHeight: 1 }}>W.A.A.N.D.A.</div>
            <div style={{ fontSize: 10, color: `${C}70`, letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>A Kangqore Product.</div>
          </div>

          {/* Right Clock & Exit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, textAlign: 'right' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: C, letterSpacing: '0.1em', textShadow: `0 0 16px ${C}`, lineHeight: 1 }}>{timeStr}</div>
              <div style={{ fontSize: 9, color: `${C}50`, marginTop: 2 }}>{dateStr}</div>
            </div>

            {/* Screen mode toggle */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', outline: 'none', color: '#64748b' }}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            <button
              onClick={() => navigate('/kangqore-view/client')}
              className="live-blink"
              style={{
                display: 'flex', alignItems: 'center', gap: 6, height: 32,
                background: `linear-gradient(135deg, ${C}20 0%, transparent 100%)`,
                border: `1px solid ${C}40`, padding: '0 12px', borderRadius: 6,
                cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
              }}
            >
              <span style={{ fontSize: 9, fontWeight: 800, color: C, letterSpacing: '0.15em' }}>← Back</span>
            </button>
          </div>
        </div>

        {/* ══ MAIN GRID (Three Columns matching Admin HUD layout exactly) ══ */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '195px 1fr 195px', gap: 10, padding: 10, minHeight: 0 }}>

          {/* ═ LEFT COLUMN (Metrics, Gauges, Status) ═ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, overflow: 'hidden', transform: 'scale(0.9)', transformOrigin: 'top center' }}>
            
            <SectionLabel text="SYSTEM STATUS" color={CG} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 16px', background: 'rgba(0,8,24,0.6)', borderRadius: 8, border: `1px solid ${CG}15` }}>
              <div style={{ position: 'relative', width: 60, height: 60 }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-120deg)' }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke={`${CG}20`} strokeWidth="4" strokeDasharray="180 300" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={CG} strokeWidth="4" strokeDasharray="174 300" style={{ filter: `drop-shadow(0 0 6px ${CG})` }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 10.8, fontWeight: 800, color: '#fff' }}>97%</div>
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
                  <circle cx="50" cy="50" r="40" fill="none" stroke={C} strokeWidth="4" strokeDasharray="162 300" style={{ filter: `drop-shadow(0 0 6px ${C})` }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 10.8, fontWeight: 800, color: '#fff' }}>91%</div>
                  <div style={{ fontSize: 5.4, color: C }}>WAANDA</div>
                </div>
              </div>
            </div>

            <SectionLabel text="DELIVERY PERFORMANCE" color={C} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px', padding: '4px 8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <PerformanceMetricRow label="PACE SCORE" value={93} score={100} onClick={() => setActiveModal('delivery')} />
                <PerformanceMetricRow label="SLA TARGET" value={simulatedOutputs.sla} score={100} onClick={() => setActiveModal('sla')} />
                <PerformanceMetricRow label="SYNC INDEX" value={100} score={100} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <PerformanceMetricRow label="BUDGET VAL" value={88} score={100} onClick={() => setActiveModal('budget')} />
                <PerformanceMetricRow label="VELOCITY" value={87} score={100} onClick={() => setActiveModal('velocity')} />
                <PerformanceMetricRow label="RISK INDEX" value={simulatedOutputs.risk} score={100} onClick={() => setActiveModal('risk')} />
              </div>
            </div>

            <SectionLabel text="ENGAGEMENT OVERVIEW" color={CG} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 4px' }}>
              <MinimalistRingWidget label="DELIVERY" value={93} color={CG} onClick={() => setActiveModal('delivery')} />
              <MinimalistRingWidget label="SLA TARGET" value={simulatedOutputs.sla} color={CG} onClick={() => setActiveModal('sla')} />
              <MinimalistRingWidget label="BUDGET" value={88} color={C} onClick={() => setActiveModal('budget')} />
              <MinimalistRingWidget label="VELOCITY" value={87} color={C} onClick={() => setActiveModal('velocity')} />
            </div>

            {/* Interactive Milestone & UAT Feature Checklist */}
            <SectionLabel text="UAT VERIFICATION MESH" color={C} />
            <div className="flex flex-col gap-1.5 p-1">
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className="flex items-center justify-between p-1.5 rounded bg-white/[0.02] border border-white/[0.04] cursor-pointer hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[7.5px] font-bold text-white tracking-wider truncate">{item.label}</span>
                    <span className="text-[5.5px] text-slate-500 font-mono mt-0.5">{item.time}</span>
                  </div>
                  <span className={`text-[6.5px] font-black px-1.5 py-0.5 rounded font-mono ${
                    item.status === 'PASSED' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' :
                    item.status === 'VERIFYING' ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20 live-blink' :
                    'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* ═ CENTER HUD COLUMN ═ */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: 0, gap: 8, overflow: 'hidden' }}>
            
            <div style={{ flex: '1 0 0', width: '100%', minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              
              {/* LEFT TELEMETRY LIVE FEED */}
              <div style={{ position: 'absolute', left: 4, top: 12, bottom: 12, width: 140, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center', overflow: 'hidden', pointerEvents: 'none' }}>
                {leftEvents.map(e => <LiveCard key={e.id} event={e} />)}
              </div>

              {/* Radial HUD centerpiece (High fidelity Admin Waanda arc reactor replication) */}
              <div style={{ height: '100%', aspectRatio: '1/1', maxWidth: '100%', position: 'relative' }}>
                <WaandaGUI
                  confidence={91}
                  health={97}
                  sweep={sweep}
                  lastSignal={null}
                  criticalAlert={null}
                  bootPhase={bootPhase}
                  visibleModules={modules}
                  hovered={hovered}
                  setHovered={setHovered}
                  selectedModule={selectedModule}
                  setSelectedModule={setSelectedModule}
                />
              </div>

              {/* RIGHT TELEMETRY LIVE FEED */}
              <div style={{ position: 'absolute', right: 4, top: 12, bottom: 12, width: 140, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center', overflow: 'hidden', pointerEvents: 'none' }}>
                {rightEvents.map(e => <LiveCard key={e.id} event={e} />)}
              </div>

            </div>

            {/* Bottom Panel command strip */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '90%', flexShrink: 0 }}>
              
              <div style={{ width: '100%' }}>
                <Panel title="WAANDA COMMAND STRIP" subtitle="Simulation & Telemetry Operations" color={C}>
                  <div className="flex items-center justify-between gap-4 py-1.5 px-3 bg-white/[0.01] border border-white/[0.04] rounded-lg">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setScenarioActive(x => !x)}
                        style={{
                          background: scenarioActive ? `${CA}25` : `${C}10`,
                          border: `1px solid ${scenarioActive ? CA : C}60`,
                          color: scenarioActive ? '#fff' : C,
                          padding: '4px 10px', borderRadius: 4, fontSize: 8.5, fontWeight: 800, letterSpacing: '0.12em', cursor: 'pointer'
                        }}
                      >
                        {scenarioActive ? '✕ EXIT SIMULATOR' : '◈ ACTIVATE SIMULATOR'}
                      </button>
                    </div>
                    
                    {selectedModData ? (
                      <div className="text-right">
                        <span className="block text-[6.5px] text-slate-500 uppercase">Selected Module</span>
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{selectedModData.label} - {selectedModData.desc}</span>
                      </div>
                    ) : (
                      <span className="text-[8px] text-slate-500">Click a reactor segment to target telemetry.</span>
                    )}
                  </div>
                </Panel>
              </div>

              {/* Dynamic Scenario Simulator Panel */}
              {scenarioActive && (
                <div style={{ width: '100%', animation: 'hudCardIn 0.3s ease' }}>
                  <Panel title="SCENARIO INPUT MODULE" subtitle="Modify constraints to model project trajectory deltas" color={CA}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2 px-3">
                      
                      {/* Control 1 */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-slate-300 uppercase">UAT Acceleration</span>
                          <span className="text-violet-400 font-bold font-mono">+{deadlineAccelerate} Weeks</span>
                        </div>
                        <input
                          type="range" min="0" max="8" value={deadlineAccelerate}
                          onChange={(e) => setDeadlineAccelerate(Number(e.target.value))}
                          className="w-full h-1 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-violet-500"
                        />
                      </div>

                      {/* Control 2 */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-slate-300 uppercase">Budget Offset</span>
                          <span className="text-violet-400 font-bold font-mono">{budgetAdjust > 0 ? '+' : ''}{budgetAdjust}%</span>
                        </div>
                        <input
                          type="range" min="-20" max="50" step="5" value={budgetAdjust}
                          onChange={(e) => setBudgetAdjust(Number(e.target.value))}
                          className="w-full h-1 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-violet-500"
                        />
                      </div>

                      {/* Control 3 */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-slate-300 uppercase">Scope Addition</span>
                          <span className="text-violet-400 font-bold font-mono">+{scopeAdd} Epics</span>
                        </div>
                        <input
                          type="range" min="0" max="5" value={scopeAdd}
                          onChange={(e) => setScopeAdd(Number(e.target.value))}
                          className="w-full h-1 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-violet-500"
                        />
                      </div>

                    </div>
                  </Panel>
                </div>
              )}

            </div>
          </div>

          {/* ═ RIGHT COLUMN (Telemetry Outputs, Operational Hub, System Health) ═ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden', paddingBottom: 20, transform: 'scale(0.9)', transformOrigin: 'top center' }}>
            
            <SectionLabel text="SIMULATION OUTFLOW" color={CA} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 4px' }}>
              
              {/* Output cards displaying deltas dynamically */}
              <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-white/[0.04] bg-white/[0.01]">
                <span className="text-[7.2px] text-slate-500 uppercase">Simulated SLA</span>
                <span className="text-[12px] font-bold text-white font-mono mt-1">{simulatedOutputs.sla}%</span>
                {simulatedOutputs.slaDelta !== 0 && (
                  <span className={`text-[6.5px] font-bold mt-1 px-1 rounded-sm ${simulatedOutputs.slaDelta > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                    {simulatedOutputs.slaDelta > 0 ? '+' : ''}{simulatedOutputs.slaDelta}% SLA
                  </span>
                )}
              </div>

              {/* Clickable Project Risk card */}
              <div
                onClick={() => setActiveModal('risk')}
                className="flex flex-col items-center justify-center p-2 rounded-lg border border-white/[0.04] bg-white/[0.01] cursor-pointer hover:bg-white/[0.03] transition-all"
              >
                <span className="text-[7.2px] text-slate-500 uppercase">Project Risk</span>
                <span className="text-[12px] font-bold text-white font-mono mt-1">{simulatedOutputs.risk}%</span>
                {simulatedOutputs.riskDelta !== 0 && (
                  <span className={`text-[6.5px] font-bold mt-1 px-1 rounded-sm ${simulatedOutputs.riskDelta < 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                    {simulatedOutputs.riskDelta > 0 ? '+' : ''}{simulatedOutputs.riskDelta}% Risk
                  </span>
                )}
              </div>

              <div className="col-span-2 p-2 rounded-lg border border-white/[0.04] bg-white/[0.01] text-center">
                <span className="text-[7.2px] text-slate-500 uppercase block">Go-live Target (UAT)</span>
                <span className="text-[11px] font-bold text-white font-mono mt-1 block">{simulatedOutputs.forecastedDate}</span>
                {simulatedOutputs.dateShiftDays !== 0 && (
                  <span className={`text-[6.5px] font-bold inline-block mt-1 px-1.5 rounded-sm ${simulatedOutputs.dateShiftDays < 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                    {simulatedOutputs.dateShiftDays} Days
                  </span>
                )}
              </div>

            </div>

            {/* Interactive Operations Hub: Projects, Meetings, Updates, Relay, Support */}
            <SectionLabel text="OPERATIONAL MESH" color={C} />
            <div className="flex flex-col gap-2 p-1">
              
              {/* 1. Projects Widget */}
              <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04] flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[8px] text-slate-300 font-bold tracking-wider">PROJECTS ACTIVE</div>
                    <div className="text-[10px] text-white font-mono mt-0.5">2 Active Phases</div>
                  </div>
                  <button
                    onClick={() => navigate('/kangqore-view/client/projects')}
                    style={{ fontSize: 7, fontWeight: 900, background: `${C}15`, border: `1px solid ${C}40`, color: '#fff', padding: '3px 8px', borderRadius: 4, cursor: 'pointer' }}
                  >
                    GATEWAY ↗
                  </button>
                </div>
              </div>

              {/* 2. Meetings Widget */}
              <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04] flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[8px] text-slate-300 font-bold tracking-wider">MEETINGS STATUS</div>
                    <div className="text-[10px] text-white font-mono mt-0.5">1 upcoming · 1 completed</div>
                  </div>
                  <button
                    onClick={() => navigate('/kangqore-view/client/meetings')}
                    style={{ fontSize: 7, fontWeight: 900, background: `${C}15`, border: `1px solid ${C}40`, color: '#fff', padding: '3px 8px', borderRadius: 4, cursor: 'pointer' }}
                  >
                    CALENDAR ↗
                  </button>
                </div>
              </div>

              {/* 3. Messages & Relay Widget */}
              <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04] flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[8px] text-slate-300 font-bold tracking-wider">MESSAGES & RELAY</div>
                    <div className="text-[10px] text-white font-mono mt-0.5">2 unread mail streams</div>
                  </div>
                  <button
                    onClick={() => navigate('/kangqore-view/client/relay')}
                    style={{ fontSize: 7, fontWeight: 900, background: `${C}15`, border: `1px solid ${C}40`, color: '#fff', padding: '3px 8px', borderRadius: 4, cursor: 'pointer' }}
                  >
                    RELAY ↗
                  </button>
                </div>
              </div>

              {/* 4. Support Tickets Widget */}
              <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04] flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[8px] text-slate-300 font-bold tracking-wider">SUPPORT GATEWAY</div>
                    <div className="text-[10px] text-white font-mono mt-0.5">Raise Tickets & Support</div>
                  </div>
                  <button
                    onClick={() => navigate('/kangqore-view/client/support')}
                    style={{ fontSize: 7, fontWeight: 900, background: `${C}15`, border: `1px solid ${C}40`, color: '#fff', padding: '3px 8px', borderRadius: 4, cursor: 'pointer' }}
                  >
                    TICKETS ↗
                  </button>
                </div>
              </div>

              {/* 5. Project Updates Widget */}
              <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04] flex flex-col gap-1.5">
                <span className="text-[8px] text-slate-400 font-bold tracking-wider mb-1 block">RECENT PROJECT UPDATES</span>
                {projectUpdates.map((update, index) => (
                  <div key={index} className="flex justify-between items-start text-[7.5px] border-b border-white/5 pb-1 last:border-0 last:pb-0">
                    <span className="text-slate-300 truncate w-32">{update.text}</span>
                    <span className="text-slate-500 font-mono">{update.time}</span>
                  </div>
                ))}
              </div>

            </div>

            <SectionLabel text="SYSTEM UTILIZATION" color={C} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px' }}>
              {[ { label: 'CPU', val: 12 }, { label: 'RAM', val: 34 }, { label: 'NETWORK', val: 40 } ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ fontSize: 7.2, color: '#88ccff', width: 40 }}>{s.label}</div>
                  <div style={{ flex: 1, height: 8, display: 'flex', gap: 2 }}>
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} style={{ flex: 1, height: '100%', background: i < (s.val / 100) * 40 ? C : `${C}20`, boxShadow: i < (s.val / 100) * 40 ? `0 0 4px ${C}` : 'none' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 8.1, color: '#fff', width: 25, textAlign: 'right' }}>{s.val}%</div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* ── TIMELINE RIBBON (Gleaming project release trajectory slider at bottom) ── */}
        <div style={{ width: '90%', margin: '0 auto 10px', flexShrink: 0 }}>
          <Panel title="OPERATIONAL RELEASE TRAJECTORY" subtitle="Milestones toward Production rollout" color={C}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2 px-6 py-2.5 bg-white/[0.01] border border-white/[0.04] rounded-lg relative overflow-hidden">
                {/* Glow connector path line */}
                <div style={{ position: 'absolute', top: '42%', left: '8%', right: '8%', height: 1, background: `linear-gradient(90deg, ${CG} 45%, ${C} 58%, rgba(255,255,255,0.06) 80%)`, zIndex: 0 }} />
                {[
                  { label: 'Sprint Review', status: 'done', date: 'June 29', desc: 'Development sprint review finalized.' },
                  { label: 'UAT Build', status: 'done', date: 'July 01', desc: 'The User Acceptance Testing environment build generated.' },
                  { label: 'Client Demo', status: 'active', date: 'Today', desc: 'The current step, indicating they are actively reviewing this live WAANDA.' },
                  { label: 'Production', status: 'pending', date: 'July 14', desc: 'The scheduled live deployment release target date.' },
                  { label: 'Hypercare', status: 'pending', date: 'July 28', desc: 'The post-launch close monitoring support window.' },
                ].map((step, idx) => {
                  const isDone = step.status === 'done'
                  const isActive = step.status === 'active'
                  const statusLabel = isDone ? 'Completed' : isActive ? 'Active/Current' : 'Upcoming'
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center relative z-10 text-center cursor-help"
                      style={{ width: '18%' }}
                      onMouseEnter={() => setHoveredStep(`[${step.label} (${statusLabel} - ${step.date})]: ${step.desc}`)}
                      onMouseLeave={() => setHoveredStep(null)}
                    >
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%',
                        background: isDone ? CG : isActive ? C : '#050a12',
                        border: `2px solid ${isDone ? CG : isActive ? C : 'rgba(255,255,255,0.2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isActive ? `0 0 10px ${C}` : 'none',
                        animation: isActive ? 'blink2 1.8s infinite' : 'none'
                      }}>
                        {isDone && <CheckCircle2 size={8} className="text-[#050a12] fill-none" strokeWidth={3} />}
                        {isActive && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }} />}
                      </div>
                      <span style={{ fontSize: 7.5, fontWeight: isActive || isDone ? 900 : 500, color: isDone ? CG : isActive ? '#fff' : '#64748b', marginTop: 4, letterSpacing: '0.05em' }}>{step.label}</span>
                      <span style={{ fontSize: 6, color: '#4b7090', fontFamily: 'monospace', marginTop: 1 }}>{step.date}</span>
                    </div>
                  )
                })}
              </div>

              {/* Dynamic Interactive Release Telemetry Info Panel */}
              <div style={{
                textAlign: 'center', fontSize: 8, color: hoveredStep ? '#fff' : '#4b7090',
                fontFamily: 'monospace', minHeight: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: hoveredStep ? 'rgba(0,170,255,0.03)' : 'transparent',
                border: hoveredStep ? `1px solid ${C}20` : '1px solid transparent',
                borderRadius: 4, padding: '3px 8px', transition: 'all 0.2s'
              }}>
                <span>◈</span>
                <span>{hoveredStep || 'HOVER ANY MILESTONE NODE TO VIEW RELEASE TELEMETRY DETAILS'}</span>
              </div>
            </div>
          </Panel>
        </div>

      </div>

      {/* ─── Detail Modals Overlay ─── */}
      {activeModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setActiveModal(null) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(0,4,14,0.78)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <div style={{
            width: 440, display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(135deg, rgba(0,12,32,0.99) 0%, rgba(0,6,18,0.99) 100%)',
            border: `1px solid ${C}35`, borderTop: `2px solid ${C}`,
            borderRadius: 10, boxShadow: `0 0 50px rgba(0,170,255,0.18)`,
            fontFamily: 'monospace',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 10px', borderBottom: `1px solid ${C}18` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 2, height: 14, background: C, borderRadius: 1 }} />
                <span style={{ fontSize: 10, fontWeight: 900, color: C, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  {activeModal === 'delivery' ? 'DELIVERY PACE ANALYSIS' :
                   activeModal === 'sla' ? 'SLA CONFORMANCE JOURNAL' :
                   activeModal === 'budget' ? 'BUDGET MARGIN TRACK' :
                   activeModal === 'velocity' ? 'SPRINT VELOCITY TELEMETRY' :
                   'RISK EXPOSURE LEDGER'}
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: `1px solid ${C}20`, borderRadius: 4, cursor: 'pointer', color: `${C}60`, fontSize: 12, padding: '3px 7px' }}>✕</button>
            </div>

            {/* Body */}
            <div style={{ padding: '16px', fontSize: 10, color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeModal === 'delivery' && (
                <>
                  <div style={{ fontSize: 8, color: '#88ccff' }}>HISTORICAL SPRINTS TARGET VS ACTUAL</div>
                  {['Sprint 10 (Target: 40, Actual: 42)', 'Sprint 11 (Target: 45, Actual: 45)', 'Sprint 12 (Target: 45, Actual: 38)', 'Sprint 13 (Target: 40, Actual: 44)'].map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid white/0.05', borderRadius: 4 }}>
                      <span>{s.split(' (')[0]}</span>
                      <span style={{ color: idx === 2 ? CR : CG, fontWeight: 'bold' }}>{s.split(' (')[1].replace(')', '')}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 8, color: '#88ccff', marginTop: 10 }}>DELIVERY CLASSIFICATION</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: '93%', height: '100%', background: CG }} />
                    </div>
                    <span>93% Pace</span>
                  </div>
                </>
              )}

              {activeModal === 'sla' && (
                <>
                  <div style={{ fontSize: 8, color: '#88ccff' }}>DAILY SLA COMPLIANCE LOG</div>
                  {['June 30: 98.4%', 'July 01: 96.0%', 'July 02: 97.2%', 'July 03: 98.1%'].map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid white/0.05', borderRadius: 4 }}>
                      <span>{s.split(': ')[0]}</span>
                      <span style={{ color: CG, fontWeight: 'bold' }}>{s.split(': ')[1]}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 8, color: '#88ccff', marginTop: 10 }}>SLA STATUS DESCRIPTION</div>
                  <p style={{ color: `${C}90`, lineHeight: 1.5 }}>Operational target SLA is configured at 95.0%. Penalty clauses activate if 3-day trailing average slips below the nominal threshold.</p>
                </>
              )}

              {activeModal === 'budget' && (
                <>
                  <div style={{ fontSize: 8, color: '#88ccff' }}>RESOURCE SPEND POOL BREAKDOWN</div>
                  {[
                    { label: 'Engineering Leads Pool', val: '420 hrs / 500 hrs', spent: 84 },
                    { label: 'AI Operations & Telemetry', val: '180 hrs / 200 hrs', spent: 90 },
                    { label: 'QA / Verification Automations', val: '120 hrs / 150 hrs', spent: 80 }
                  ].map((item, idx) => (
                    <div key={idx} style={{ padding: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid white/0.05', borderRadius: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span>{item.label}</span>
                        <span style={{ fontWeight: 'bold', color: C }}>{item.val}</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${item.spent}%`, height: '100%', background: C }} />
                      </div>
                    </div>
                  ))}
                </>
              )}

              {activeModal === 'velocity' && (
                <>
                  <div style={{ fontSize: 8, color: '#88ccff' }}>COMPLETED SPRINT VELOCITIES</div>
                  {['Sprint 10: 42 Story Points', 'Sprint 11: 45 Story Points', 'Sprint 12: 38 Story Points', 'Sprint 13: 40 Story Points'].map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid white/0.05', borderRadius: 4 }}>
                      <span>{s.split(': ')[0]}</span>
                      <span style={{ color: C, fontWeight: 'bold' }}>{s.split(': ')[1]}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 8, color: '#88ccff', marginTop: 10 }}>VELOCITY FLUCTUATION</div>
                  <p style={{ color: `${C}90`, lineHeight: 1.5 }}>Nominal velocity is 40 Story Points per sprint. Current metrics show high consistency (variance: 7.2%).</p>
                </>
              )}

              {activeModal === 'risk' && (
                <>
                  <div style={{ fontSize: 8, color: '#88ccff' }}>PROJECT ACTIVE RISK FACTOR MESH</div>
                  {[
                    { label: 'UAT Deadline Acceleration', val: `${deadlineAccelerate * 8}% Risk`, color: deadlineAccelerate > 4 ? CR : deadlineAccelerate > 0 ? '#ffaa00' : CG },
                    { label: 'Scope Epic Overrun', val: `${scopeAdd * 6}% Risk`, color: scopeAdd > 3 ? CR : scopeAdd > 0 ? '#ffaa00' : CG },
                    { label: 'HIPAA Auditing Compliance', val: '5% Risk (Nominal)', color: CG },
                    { label: 'Monday.com Bridge Latency', val: '8% Risk (Nominal)', color: CG },
                    { label: 'SLA Trailing Fluctuation', val: '18% Risk (Elevated)', color: '#ffaa00' }
                  ].map((r, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid white/0.05', borderRadius: 4 }}>
                      <span>{r.label}</span>
                      <span style={{ color: r.color, fontWeight: 'bold' }}>{r.val}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 8, color: '#88ccff', marginTop: 10 }}>TOTAL DERIVED RISK INDEX</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${simulatedOutputs.risk}%`, height: '100%', background: simulatedOutputs.risk > 30 ? CR : simulatedOutputs.risk > 15 ? '#ffaa00' : CG }} />
                    </div>
                    <span>{simulatedOutputs.risk}% Risk</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '10px 16px', borderTop: `1px solid ${C}12`, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setActiveModal(null)} style={{ background: `${C}10`, border: `1px solid ${C}40`, borderRadius: 5, padding: '6px 14px', cursor: 'pointer', color: C, fontSize: 9, fontWeight: 800, letterSpacing: '0.15em' }}>CLOSE TELEMETRY</button>
            </div>
          </div>
        </div>
      )}

      {/* ── WAANDA Chat Panel ─────────────────────────────────────────────────── */}

      {/* Floating trigger button */}
      <button
        onClick={() => setChatOpen(o => !o)}
        title="Ask WAANDA"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9000,
          width: 52, height: 52, borderRadius: '50%',
          background: chatOpen ? `${C}22` : C,
          border: `1.5px solid ${C}`,
          color: chatOpen ? C : '#0a0f1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: `0 0 18px ${C}55`,
          transition: 'all 0.2s ease',
        }}
      >
        {chatOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Chat slide-up panel */}
      {chatOpen && (
        <div style={{
          position: 'fixed', bottom: 92, right: 28, zIndex: 8999,
          width: 360, maxWidth: 'calc(100vw - 40px)',
          height: 460,
          background: '#0d1424',
          border: `1px solid ${C}30`,
          borderRadius: 14,
          boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${C}15`,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: `1px solid ${C}20`,
            display: 'flex', alignItems: 'center', gap: 10,
            background: `${C}08`,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: `${C}18`, border: `1px solid ${C}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain size={14} color={C} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#e8f0ff', letterSpacing: '0.05em' }}>WAANDA</div>
              <div style={{ fontSize: 9, color: `${C}90`, letterSpacing: '0.1em' }}>YOUR INTELLIGENCE PARTNER</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: CG, boxShadow: `0 0 6px ${CG}` }} />
              <span style={{ fontSize: 8, color: CG, letterSpacing: '0.08em' }}>LIVE</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {chatMessages.length === 0 && (
              <div style={{ color: `${C}60`, fontSize: 11, textAlign: 'center', marginTop: 40, lineHeight: 1.6 }}>
                <Brain size={28} color={`${C}40`} style={{ margin: '0 auto 10px' }} />
                Ask WAANDA about your projects,<br />milestones, or deliverables.
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '8px 12px',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role === 'user' ? C : `${C}12`,
                  border: msg.role === 'assistant' ? `1px solid ${C}25` : 'none',
                  color: msg.role === 'user' ? '#0a0f1a' : '#c8d8f0',
                  fontSize: 11,
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {msg.content}
                  {msg.streaming && (
                    <span style={{ display: 'inline-block', width: 6, height: 12, background: C, marginLeft: 3, borderRadius: 1, animation: 'blink2 0.9s ease-in-out infinite', verticalAlign: 'middle' }} />
                  )}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px',
            borderTop: `1px solid ${C}20`,
            display: 'flex', alignItems: 'flex-end', gap: 8,
            background: `${C}05`,
          }}>
            <textarea
              ref={chatInputRef}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage() }
              }}
              placeholder="Ask WAANDA…"
              rows={1}
              style={{
                flex: 1, resize: 'none', background: `${C}0a`,
                border: `1px solid ${C}30`, borderRadius: 8,
                padding: '7px 10px', color: '#d8e8ff', fontSize: 11,
                fontFamily: 'inherit', outline: 'none', lineHeight: 1.4,
                maxHeight: 72, overflowY: 'auto',
              }}
            />
            <button
              onClick={sendChatMessage}
              disabled={chatStreaming || !chatInput.trim()}
              style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                background: chatStreaming || !chatInput.trim() ? `${C}20` : C,
                border: 'none', cursor: chatStreaming || !chatInput.trim() ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
            >
              <Send size={14} color={chatStreaming || !chatInput.trim() ? `${C}60` : '#0a0f1a'} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
