import { useState } from 'react'
import { Activity, AlertTriangle, ShieldAlert, Users, DollarSign, Brain, Sparkles, ChevronRight, Zap, Target, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@design-system/cn'

export function ExecutiveCommandCenter() {
  const [query, setQuery] = useState('')

  return (
    <div className="space-y-10 min-h-full pb-20">
      
      {/* HEADER & CO-PILOT */}
      <section className="relative rounded-3xl overflow-hidden bg-black border border-white/10 p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-black to-[#F59E0B]/10 pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-[#F59E0B]" />
              Executive Command Center
            </h1>
            <p className="mt-2 text-white/60 max-w-2xl text-lg">
              Enterprise intelligence at your fingertips. Ask WAANDA for synthesis, or review real-time risk telemetry below.
            </p>
          </div>

          <div className="max-w-4xl relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Sparkles className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <input
              type="text"
              className="w-full bg-white/5 border border-white/20 text-white placeholder-white/40 rounded-2xl py-5 pl-14 pr-6 text-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50 transition-all shadow-inner"
              placeholder="Ask WAANDA..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <PromptSuggestion text="What changed since yesterday?" onClick={setQuery} />
            <PromptSuggestion text="Why is revenue at risk?" onClick={setQuery} />
            <PromptSuggestion text="Which three decisions matter most today?" onClick={setQuery} />
            <PromptSuggestion text="What can be safely automated?" onClick={setQuery} />
            <PromptSuggestion text="Show me decisions requiring my approval." onClick={setQuery} />
          </div>
        </div>
      </section>

      {/* HEALTH & RISK METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <RiskCard title="Enterprise Health" value="88%" trend="+2" status="optimal" icon={Activity} />
        <RiskCard title="Revenue Risk" value="Low" trend="Stable" status="good" icon={DollarSign} />
        <RiskCard title="Operational Risk" value="Elevated" trend="Monitoring" status="warning" icon={Zap} />
        <RiskCard title="Customer Risk" value="Critical" trend="Action Req." status="danger" icon={Target} />
        <RiskCard title="People Risk" value="Nominal" trend="Stable" status="good" icon={Users} />
      </section>

      {/* INTELLIGENCE FEEDS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Decisions */}
        <div className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-3xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-extrabold text-[var(--os-text-1)]">Pending Decisions</h2>
            <div className="ml-auto bg-indigo-500/10 text-indigo-500 text-xs font-bold px-2 py-1 rounded-full">3</div>
          </div>
          <div className="space-y-4 flex-1">
            <DecisionItem 
              title="Approve $2.4M cloud infrastructure budget expansion"
              impact="High"
              urgency="Today"
            />
            <DecisionItem 
              title="Authorize WAANDA to auto-remediate Tier 1 support SLA breaches"
              impact="Medium"
              urgency="This Week"
            />
            <DecisionItem 
              title="Sign-off on SOC 2 Type II final audit report submission"
              impact="Critical"
              urgency="Tomorrow"
            />
          </div>
        </div>

        {/* Emerging Anomalies */}
        <div className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-3xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
            <h2 className="text-lg font-extrabold text-[var(--os-text-1)]">Emerging Anomalies</h2>
          </div>
          <div className="space-y-4 flex-1">
            <AnomalyItem 
              title="Delivery velocity dropped 14% across EMEA accounts"
              detected="4 hours ago"
              severity="warning"
            />
            <AnomalyItem 
              title="Unusual spike in cloud egress costs (+45% vs baseline)"
              detected="Yesterday"
              severity="danger"
            />
            <AnomalyItem 
              title="Client engagement score down 2 points for 'Acme Corp'"
              detected="2 days ago"
              severity="info"
            />
          </div>
        </div>

        {/* AI Activity & Policy Violations */}
        <div className="bg-[var(--os-surface)] border border-[var(--os-border)] rounded-3xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-extrabold text-[var(--os-text-1)]">AI Activity & Policy</h2>
          </div>
          <div className="space-y-4 flex-1">
            <AiActivityItem 
              title="KIMMP autonomous load balancing executed (US-East)"
              status="Executed"
              type="success"
            />
            <AiActivityItem 
              title="WAANDA auto-reply blocked by AEGIS (DLP policy P-14)"
              status="Blocked"
              type="danger"
            />
            <AiActivityItem 
              title="Data sanitization complete for GDPR offboarding (User #948)"
              status="Verified"
              type="success"
            />
          </div>
        </div>

      </section>

    </div>
  )
}

function PromptSuggestion({ text, onClick }: { text: string, onClick: (t: string) => void }) {
  return (
    <button
      onClick={() => onClick(text)}
      className="text-sm font-medium text-white/80 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full px-4 py-2 transition-all flex items-center gap-2"
    >
      {text}
      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
    </button>
  )
}

function RiskCard({ title, value, trend, status, icon: Icon }: any) {
  const colors = {
    optimal: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    good: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
  }
  const colorClass = colors[status as keyof typeof colors]

  return (
    <div className={cn("p-5 rounded-3xl border flex flex-col justify-between h-36 relative overflow-hidden", colorClass)}>
      <div className="flex justify-between items-start">
        <span className="text-sm font-bold opacity-80">{title}</span>
        <Icon className="w-5 h-5 opacity-50" />
      </div>
      <div>
        <div className="text-3xl font-black tracking-tight">{value}</div>
        <div className="text-xs font-bold opacity-70 mt-1 uppercase tracking-wider">{trend}</div>
      </div>
    </div>
  )
}

function DecisionItem({ title, impact, urgency }: any) {
  return (
    <div className="p-4 bg-[var(--os-surface-hover)] border border-[var(--os-border)] rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-colors">
      <p className="text-sm font-bold text-[var(--os-text-1)] mb-2 leading-tight">{title}</p>
      <div className="flex gap-2 text-[10px] font-black uppercase tracking-wider">
        <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">Impact: {impact}</span>
        <span className="text-[var(--os-text-3)] bg-[var(--os-surface)] border border-[var(--os-border)] px-2 py-0.5 rounded-full">{urgency}</span>
      </div>
    </div>
  )
}

function AnomalyItem({ title, detected, severity }: any) {
  const badgeColor = severity === 'danger' ? 'text-red-500 bg-red-500/10' :
                     severity === 'warning' ? 'text-amber-500 bg-amber-500/10' :
                     'text-blue-500 bg-blue-500/10'
                     
  return (
    <div className="p-4 bg-[var(--os-surface-hover)] border border-[var(--os-border)] rounded-2xl cursor-pointer hover:border-amber-500/50 transition-colors">
      <p className="text-sm font-bold text-[var(--os-text-1)] mb-2 leading-tight">{title}</p>
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
        <span className="text-[var(--os-text-3)]">{detected}</span>
        <span className={cn("px-2 py-0.5 rounded-full", badgeColor)}>Alert</span>
      </div>
    </div>
  )
}

function AiActivityItem({ title, status, type }: any) {
  const isBlocked = type === 'danger'
  return (
    <div className="p-4 bg-[var(--os-surface-hover)] border border-[var(--os-border)] rounded-2xl">
      <p className="text-sm font-bold text-[var(--os-text-1)] mb-2 leading-tight">{title}</p>
      <div className="flex gap-2 items-center text-[10px] font-black uppercase tracking-wider">
        {isBlocked ? (
          <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> {status}
          </span>
        ) : (
          <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Activity className="w-3 h-3" /> {status}
          </span>
        )}
      </div>
    </div>
  )
}
