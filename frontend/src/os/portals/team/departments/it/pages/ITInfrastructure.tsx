import { useState } from 'react'
import { Wifi, CheckCircle2, AlertCircle, XCircle, Server, Activity, Cpu, ArrowRight } from 'lucide-react'

type SysStatus = 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE'

interface System {
  id:        string
  name:      string
  status:    SysStatus
  uptime:    String
  latency:   string
  incidents: number
  description: string
}

const SYSTEMS: System[] = [
  { id: 'edge-cdn',     name: 'Frontend CDN (CloudFront)',   status: 'OPERATIONAL', uptime: '100%',   latency: '18ms',  incidents: 0, description: 'Edge content delivery network and cache proxy.' },
  { id: 'edge-okta',    name: 'Okta SSO',                   status: 'OPERATIONAL', uptime: '99.99%', latency: '82ms',  incidents: 0, description: 'Identity provider & security assertion manager.' },
  { id: 'edge-vpn',     name: 'VPN Gateway (EU)',            status: 'DEGRADED',    uptime: '98.70%', latency: '430ms', incidents: 2, description: 'Client access gateway for remote developer tunnels.' },
  { id: 'app-api',      name: 'Production API (EU-West-1)',  status: 'OPERATIONAL', uptime: '99.98%', latency: '42ms',  incidents: 0, description: 'Core microservices backend gateway node.' },
  { id: 'app-cicd',     name: 'GitHub Actions (CI/CD)',      status: 'DEGRADED',    uptime: '97.80%', latency: '—',     incidents: 1, description: 'Automated software integration build pipeline.' },
  { id: 'app-datadog',  name: 'Datadog Monitoring',          status: 'OPERATIONAL', uptime: '99.95%', latency: '12ms',  incidents: 0, description: 'Continuous metrics harvester & log pipeline.' },
  { id: 'app-email',    name: 'Email (Office 365)',          status: 'DEGRADED',    uptime: '99.12%', latency: '—',     incidents: 1, description: 'Inbound / outbound transactional notification MTA.' },
  { id: 'data-db1',     name: 'Production DB (prod-db-01)',  status: 'OPERATIONAL', uptime: '99.97%', latency: '8ms',   incidents: 0, description: 'Primary PostgreSQL storage cluster instance.' },
  { id: 'data-db2',     name: 'Production DB (prod-db-02)',  status: 'DEGRADED',    uptime: '99.21%', latency: '210ms', incidents: 1, description: 'Standby read-replica and analytical query sync.' },
  { id: 'data-s3',      name: 'AWS S3 (Document Store)',     status: 'OPERATIONAL', uptime: '100%',   latency: '24ms',  incidents: 0, description: 'Binary assets, uploads, and report archive pool.' },
]

const WINDOWS = [
  { name: 'VPN firmware patch — EU GW',         date: 'Tonight 22:00–02:00', risk: 'Emergency', impact: 'EU VPN 2h downtime' },
  { name: 'PostgreSQL upgrade — prod-db-01',    date: '28 Jun 01:00–04:00',  risk: 'Moderate',  impact: 'DB read-only 3h' },
  { name: 'OS patches — all prod servers',      date: '30 Jun 00:00–03:00',  risk: 'Low',       impact: 'Rolling restart' },
]

const S_CONFIG: Record<SysStatus, { color: string; label: string; icon: typeof CheckCircle2 }> = {
  OPERATIONAL: { color: '#30d158', label: 'Operational', icon: CheckCircle2 },
  DEGRADED:    { color: '#ff9f0a', label: 'Degraded',    icon: AlertCircle },
  OUTAGE:      { color: '#ff453a', label: 'Outage',      icon: XCircle },
}

const RISK_COLOR: Record<string, string> = { Emergency: '#ff453a', Moderate: '#ff9f0a', Low: '#30d158' }

const CONNECTIONS = [
  { from: 'edge-cdn', to: 'app-api', color: '#64d2ff' },
  { from: 'edge-okta', to: 'app-api', color: '#30d158' },
  { from: 'edge-okta', to: 'app-datadog', color: '#30d158' },
  { from: 'edge-vpn', to: 'app-api', color: '#ff9f0a' },
  { from: 'edge-vpn', to: 'app-email', color: '#ff9f0a' },
  { from: 'app-api', to: 'data-db1', color: '#30d158' },
  { from: 'app-api', to: 'data-db2', color: '#ff9f0a' },
  { from: 'app-cicd', to: 'data-db1', color: '#ff9f0a' },
  { from: 'app-datadog', to: 'data-db2', color: '#30d158' },
  { from: 'app-email', to: 'data-s3', color: '#ff9f0a' },
]

const NODE_COORDS: Record<string, { x: string; y: string; layer: string }> = {
  'edge-cdn': { x: '20%', y: '15%', layer: 'Gateway CDN' },
  'edge-okta': { x: '50%', y: '15%', layer: 'Gateway Auth' },
  'edge-vpn': { x: '80%', y: '15%', layer: 'Gateway Network' },
  'app-api': { x: '15%', y: '50%', layer: 'Service API' },
  'app-cicd': { x: '38%', y: '50%', layer: 'Service CI/CD' },
  'app-datadog': { x: '62%', y: '50%', layer: 'Service Monitor' },
  'app-email': { x: '85%', y: '50%', layer: 'Service MTA' },
  'data-db1': { x: '20%', y: '85%', layer: 'Data Primary' },
  'data-db2': { x: '50%', y: '85%', layer: 'Data Replica' },
  'data-s3': { x: '80%', y: '85%', layer: 'Data Object' },
}

export function ITInfrastructure() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  
  const operational = SYSTEMS.filter(s => s.status === 'OPERATIONAL').length
  const degraded    = SYSTEMS.filter(s => s.status === 'DEGRADED').length
  
  const selectedNode = hoveredId ? SYSTEMS.find(s => s.id === hoveredId) : null

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-10">
      
      {/* Immersive Apple-Style Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 shadow-md">
            <Wifi className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Infrastructure Map</h1>
            <p className="text-[var(--os-text-2)] mt-1.5 text-sm max-w-xl">
              Live service status topology, data pipelines, network gateways, and upcoming scheduled maintenance windows.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <p className="text-[10px] text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Health Index</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">94.8%</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <p className="text-[10px] text-[var(--os-text-2)] font-semibold uppercase tracking-wider">Incidents</p>
            <p className="text-xl font-bold text-orange-400 mt-0.5">{degraded} warning</p>
          </div>
        </div>
      </div>

      {/* Dynamic Network Node Topology Container */}
      <div className="relative p-8 rounded-3xl border border-white/10 bg-slate-950/20 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <div className="absolute top-4 left-6 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-widest">Active Data Pipelines</span>
        </div>

        <div className="relative w-full h-[380px] mt-6">
          {/* Connecting SVG Pipelines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {CONNECTIONS.map((c, idx) => {
              const start = NODE_COORDS[c.from]
              const end = NODE_COORDS[c.to]
              if (!start || !end) return null
              
              const isHighlighted = hoveredId === c.from || hoveredId === c.to
              const isAnyHovered = hoveredId !== null
              const opacity = isAnyHovered ? (isHighlighted ? 0.8 : 0.04) : 0.25
              const strokeWidth = isHighlighted ? 3 : 1.5

              return (
                <g key={idx} className="transition-all duration-300">
                  {/* Underlay glow shadow line */}
                  <line 
                    x1={start.x} y1={start.y} 
                    x2={end.x} y2={end.y} 
                    stroke={c.color} 
                    strokeWidth={strokeWidth + 2} 
                    opacity={isHighlighted ? 0.3 : 0} 
                    className="blur-sm transition-all duration-300"
                  />
                  {/* Main structural pipeline line */}
                  <line 
                    x1={start.x} y1={start.y} 
                    x2={end.x} y2={end.y} 
                    stroke={c.color} 
                    strokeWidth={strokeWidth} 
                    opacity={opacity} 
                    className="transition-all duration-300"
                  />
                  {/* Laser pipeline pulsing overlay */}
                  {(!isAnyHovered || isHighlighted) && (
                    <line 
                      x1={start.x} y1={start.y} 
                      x2={end.x} y2={end.y} 
                      stroke={c.color} 
                      strokeWidth={strokeWidth + 1} 
                      strokeDasharray="6 14"
                      opacity={isHighlighted ? 0.95 : 0.45} 
                      className="animate-flow transition-all duration-300"
                    />
                  )}
                </g>
              )
            })}
          </svg>

          {/* Interactive Server Nodes */}
          {SYSTEMS.map(s => {
            const coord = NODE_COORDS[s.id]
            if (!coord) return null
            const cfg = S_CONFIG[s.status]
            
            const isHovered = hoveredId === s.id
            const isAnyHovered = hoveredId !== null
            const isTargeted = isAnyHovered && (hoveredId === s.id || CONNECTIONS.some(c => (c.from === s.id && c.to === hoveredId) || (c.to === s.id && c.from === hoveredId)))
            
            const activeOpacity = isAnyHovered ? (isTargeted ? 'opacity-100 scale-105' : 'opacity-20 scale-95') : 'opacity-100'

            return (
              <div 
                key={s.id}
                className={`absolute w-36 h-20 -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl border transition-all duration-500 cursor-pointer z-10 select-none ${activeOpacity} ${
                  isHovered 
                    ? 'bg-slate-900 border-white/20 shadow-2xl scale-110' 
                    : 'bg-[#0b1224]/85 border-white/5 shadow-lg'
                }`}
                style={{ 
                  left: coord.x, 
                  top: coord.y,
                  boxShadow: isHovered ? `0 20px 40px -10px ${cfg.color}35, 0 0 20px -5px ${cfg.color}` : undefined
                }}
                onMouseEnter={() => setHoveredId(s.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] text-[var(--os-text-2)] uppercase tracking-widest font-bold font-mono">{coord.layer}</span>
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: cfg.color }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: cfg.color }} />
                  </div>
                </div>
                <p className="text-xs font-bold text-white truncate">{s.name.split(' ')[0]}</p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-[var(--os-text-2)] font-mono">
                  <span>{s.uptime}</span>
                  <span>{s.latency !== '—' ? s.latency : 'offline'}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Node Details Drawer */}
        <div className={`mt-6 p-4 rounded-2xl border border-white/5 bg-white/[0.01] transition-all duration-500 overflow-hidden ${
          selectedNode ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
          {selectedNode && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center flex-shrink-0">
                <Server className="w-5 h-5 text-[var(--os-text-2)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-white">{selectedNode.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" 
                    style={{ background: `${S_CONFIG[selectedNode.status].color}15`, color: S_CONFIG[selectedNode.status].color }}>
                    {S_CONFIG[selectedNode.status].label}
                  </span>
                </div>
                <p className="text-xs text-[var(--os-text-2)] mt-1">{selectedNode.description}</p>
                <div className="flex gap-6 mt-2.5 text-[11px] text-[var(--os-text-2)] font-mono">
                  <span>Uptime: <strong className="text-[var(--os-text-1)]">{selectedNode.uptime}</strong></span>
                  <span>Latency: <strong className="text-[var(--os-text-1)]">{selectedNode.latency}</strong></span>
                  <span>Active Incidents: <strong className="text-[var(--os-text-1)]">{selectedNode.incidents}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid: systems stats & upcoming maintenance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Systems List with Sparklines */}
        <div className="p-6 rounded-3xl border border-white/10 bg-slate-950/20 backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--os-text-2)] uppercase tracking-widest">Health Registry</h2>
            <span className="text-xs text-[var(--os-text-2)] font-semibold">{operational}/{SYSTEMS.length} Systems OK</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {SYSTEMS.slice(0, 6).map(s => {
              const cfg = S_CONFIG[s.status]
              return (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                    <p className="text-xs font-semibold text-[var(--os-text-1)] truncate">{s.name}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 font-mono">
                    <span className="text-[11px] text-[var(--os-text-2)]">{s.latency !== '—' ? `${s.latency}` : 'n/a'}</span>
                    <span className="text-[11px] text-[var(--os-text-1)] font-bold w-12 text-right">{s.uptime}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Maintenance Windows */}
        <div className="p-6 rounded-3xl border border-white/10 bg-slate-950/20 backdrop-blur-2xl space-y-4">
          <h2 className="text-sm font-bold text-[var(--os-text-2)] uppercase tracking-widest">Maintenance Windows</h2>
          <div className="space-y-3">
            {WINDOWS.map(w => (
              <div key={w.name} className="flex gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg h-fit flex-shrink-0 uppercase tracking-wider" 
                  style={{ background: `${RISK_COLOR[w.risk]}15`, color: RISK_COLOR[w.risk] }}>
                  {w.risk}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{w.name}</h4>
                  <p className="text-[11px] text-[var(--os-text-2)] mt-1 font-mono">{w.date}</p>
                  <p className="text-[11px] text-[var(--os-text-2)] mt-0.5">{w.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
