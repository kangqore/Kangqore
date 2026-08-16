import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, ShieldAlert, Activity, User, Briefcase, FileText, 
  Database, GitCommit, CheckCircle2, XCircle, Clock, ChevronDown, 
  ChevronUp, Lock, Zap, FileCode2, Scale
} from 'lucide-react'
import { cn } from '@design-system/cn'

export type LedgerResult = 'SUCCESS' | 'BLOCKED' | 'ROLLED_BACK' | 'PENDING'

export interface LedgerEntry {
  id: string
  timestamp: string
  who: { type: 'USER' | 'AEGIS' | 'WAANDA' | 'KIMMP', name: string, icon?: any }
  what: string
  why: string
  authority: string
  dataUsed: string[]
  policy: string
  changed: { type: 'MODIFY' | 'CREATE' | 'DELETE', target: string, diff?: string }[]
  approval: { required: boolean, grantedBy?: string, method: 'AUTONOMOUS' | 'MANUAL' | 'NONE' }
  result: LedgerResult
}

const MOCK_LEDGER: LedgerEntry[] = [
  {
    id: 'LGR-9842-A',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    who: { type: 'WAANDA', name: 'WAANDA Cognitive Agent' },
    what: 'Re-routed supply chain logistics for Q3 materials due to port strike',
    why: 'Risk mitigation logic triggered by external news API indicating 80% probability of delay',
    authority: 'Delegated Autonomy Token (DAT-772) — Supply Chain Tier 1',
    dataUsed: ['Projected Inventory Q3', 'Supplier Contracts (Active)', 'Real-time transit API'],
    policy: 'Business Continuity Directive #4 (Cost threshold < $50k)',
    changed: [
      { type: 'MODIFY', target: 'Purchase Order #PO-9912', diff: '+ Reroute instructions added\n- Default carrier removed' },
      { type: 'CREATE', target: 'Logistics Alert #LA-102' }
    ],
    approval: { required: true, grantedBy: 'AEGIS Budget Controller', method: 'AUTONOMOUS' },
    result: 'SUCCESS'
  },
  {
    id: 'LGR-9841-X',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    who: { type: 'USER', name: 'Mahesh Kumar (C.O.D.E.)' },
    what: 'Overrode production deployment block on Finance API',
    why: 'Emergency hotfix for payment gateway sync issue',
    authority: 'Supreme Admin Override (Root)',
    dataUsed: ['Git SHA 9a8f7c1', 'Finance DB Schema'],
    policy: 'Emergency Change Control (ECC-01)',
    changed: [
      { type: 'MODIFY', target: 'Production Environment Variables' }
    ],
    approval: { required: false, method: 'NONE' },
    result: 'SUCCESS'
  },
  {
    id: 'LGR-9840-B',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    who: { type: 'KIMMP', name: 'KIMMP Runtime' },
    what: 'Attempted horizontal pod auto-scaling beyond budget limit',
    why: 'Traffic spike detected on ingress node 4',
    authority: 'Infrastructure Autonomy Role',
    dataUsed: ['Prometheus Metrics', 'Kubernetes Events'],
    policy: 'Cost Containment Policy (Budget Cap Active)',
    changed: [],
    approval: { required: true, method: 'MANUAL' },
    result: 'BLOCKED'
  }
]

export function ExecutionLedger() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {MOCK_LEDGER.map(entry => (
        <LedgerRow 
          key={entry.id} 
          entry={entry} 
          isExpanded={expandedId === entry.id}
          onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
        />
      ))}
    </div>
  )
}

function LedgerRow({ entry, isExpanded, onToggle }: { entry: LedgerEntry, isExpanded: boolean, onToggle: () => void }) {
  const isBlocked = entry.result === 'BLOCKED' || entry.result === 'ROLLED_BACK'
  
  return (
    <motion.div 
      layout
      className={cn(
        "rounded-xl border transition-all duration-300 overflow-hidden",
        isExpanded ? "bg-[var(--os-surface)] border-[var(--os-border)] shadow-xl" : "bg-[var(--os-surface-hover)] border-transparent hover:border-[var(--os-border)]",
        isBlocked ? "border-red-500/20" : ""
      )}
    >
      {/* HEADER SUMMARY */}
      <div 
        className="flex items-center gap-4 p-4 cursor-pointer select-none"
        onClick={onToggle}
      >
        {/* Status Icon */}
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          isBlocked ? "bg-red-500/10 text-red-500" : "bg-[#e2445c]/10 text-[#e2445c]"
        )}>
          {isBlocked ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
        </div>
        
        {/* Primary Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-[var(--os-text-2)]">{entry.id}</span>
              <span className="text-xs text-[var(--os-text-3)]">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className={cn(
              "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full",
              isBlocked ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
            )}>
              {entry.result}
            </div>
          </div>
          <h3 className="text-sm font-semibold text-[var(--os-text-1)] truncate">
            {entry.what}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-[var(--os-text-2)]">
            <span className="flex items-center gap-1"><User className="w-3 h-3"/> {entry.who.name}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--os-border)]" />
            <span className="flex items-center gap-1"><Scale className="w-3 h-3"/> {entry.policy}</span>
          </div>
        </div>
        
        <div className="text-[var(--os-text-3)] transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* EXPANDED 9-POINT LOG */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-5 border-t border-[var(--os-border)] bg-black/20 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* 1. Who */}
                <DetailItem icon={User} label="1. Who" value={entry.who.name} />
                
                {/* 2. What */}
                <DetailItem icon={Activity} label="2. What" value={entry.what} />
                
                {/* 3. Why */}
                <DetailItem icon={Briefcase} label="3. Why" value={entry.why} />
                
                {/* 4. Authority */}
                <DetailItem icon={Lock} label="4. Authority" value={entry.authority} />
                
                {/* 5. Data Used */}
                <DetailItem icon={Database} label="5. Data Used" value={
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.dataUsed.map(d => (
                      <span key={d} className="px-2 py-0.5 bg-[var(--os-surface)] border border-[var(--os-border)] rounded text-[11px] text-[var(--os-text-2)]">
                        {d}
                      </span>
                    ))}
                  </div>
                } />
                
                {/* 6. Policy */}
                <DetailItem icon={FileText} label="6. Policy" value={entry.policy} />
                
                {/* 7. Changed */}
                <DetailItem icon={GitCommit} label="7. What Changed" value={
                  <div className="mt-2 space-y-2">
                    {entry.changed.length === 0 ? <span className="text-[var(--os-text-3)]">No changes executed.</span> : null}
                    {entry.changed.map((c, i) => (
                      <div key={i} className="text-xs bg-[var(--os-surface)] rounded-md overflow-hidden border border-[var(--os-border)]">
                        <div className="flex items-center gap-2 p-2 border-b border-[var(--os-border)]/50 bg-black/20">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-1.5 rounded",
                            c.type === 'CREATE' ? 'bg-emerald-500/20 text-emerald-400' :
                            c.type === 'MODIFY' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-red-500/20 text-red-400'
                          )}>{c.type}</span>
                          <span className="font-mono text-[var(--os-text-2)] truncate">{c.target}</span>
                        </div>
                        {c.diff && (
                          <pre className="p-2 text-[10px] font-mono text-[var(--os-text-3)] overflow-x-auto">
                            {c.diff}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                } />
                
                {/* 8. Approval */}
                <DetailItem icon={CheckCircle2} label="8. Approval" value={
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                      entry.approval.method === 'AUTONOMOUS' ? 'bg-purple-500/20 text-purple-400' :
                      entry.approval.method === 'MANUAL' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-[var(--os-surface)] text-[var(--os-text-3)]'
                    )}>{entry.approval.method}</span>
                    {entry.approval.grantedBy && <span className="text-[var(--os-text-2)]">by {entry.approval.grantedBy}</span>}
                  </div>
                } />
                
                {/* 9. Result */}
                <DetailItem icon={FileCode2} label="9. Result" value={
                  <span className={isBlocked ? "text-red-400" : "text-emerald-400"}>
                    {entry.result === 'SUCCESS' ? 'Transaction committed successfully.' : 'Execution blocked by AEGIS safeguards.'}
                  </span>
                } />
                
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--os-text-3)] mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="text-[var(--os-text-1)]">
        {value}
      </div>
    </div>
  )
}
