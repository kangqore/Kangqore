import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, ArrowRight, Zap, Target, GitMerge, CheckCircle2, TrendingUp, AlertTriangle, Layers, Lock, RefreshCw
} from 'lucide-react'

// Mock Data for Workflow ROI Tracker
const RECENT_WORKFLOWS = [
  {
    id: 'wkfl-992a',
    action: 'Reassign Engineer',
    event: 'Cycle time reduction',
    metric: 'Deployment frequency +14%',
    outcome: 'Incident reduction & Revenue Impact',
    status: 'VERIFIED',
    roi: '$50k/mo',
    confidence: 94
  },
  {
    id: 'wkfl-881b',
    action: 'Auto-Pause Marketing Spend',
    event: 'Ad spend halted on underperforming channel',
    metric: 'CAC decreased by 22%',
    outcome: 'Net Margin Improved',
    status: 'VERIFIED',
    roi: '$12k/mo',
    confidence: 88
  },
  {
    id: 'wkfl-774c',
    action: 'Escalate Priority Client SLA',
    event: 'Support response time < 5m',
    metric: 'Client NPS +15 pts',
    outcome: 'Contract Renewed',
    status: 'PENDING_VALIDATION',
    roi: 'TBD',
    confidence: 65
  }
]

export default function OutcomeIntelligenceView() {
  const [activeWorkflow, setActiveWorkflow] = useState(RECENT_WORKFLOWS[0])

  return (
    <div className="space-y-8 p-6 bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-slate-900 to-teal-900/40 border border-emerald-500/20 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <Activity className="w-4 h-4" />
          Phase 8: Outcome Intelligence
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Workflow Outcome & ROI Tracker
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl">
          Stop measuring outputs. Start measuring outcomes. The Intelligence Chain perfectly maps tactical KEOS executions directly to strategic financial and operational impacts.
        </p>
      </div>

      {/* The Intelligence Chain UI (Action -> Event -> Metric -> Outcome) */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-300 mb-6 flex items-center gap-2 uppercase tracking-wider">
          <GitMerge className="w-4 h-4 text-emerald-400" />
          The Intelligence Chain: {activeWorkflow.id}
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Action */}
          <motion.div 
            key={`${activeWorkflow.id}-action`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 w-full p-5 rounded-2xl bg-slate-950 border border-slate-800 relative z-10 flex flex-col items-center text-center space-y-3"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">1. Action</div>
              <div className="text-sm font-bold text-white">{activeWorkflow.action}</div>
            </div>
          </motion.div>

          <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block shrink-0" />
          <div className="w-px h-6 bg-slate-800 md:hidden"></div>

          {/* Event */}
          <motion.div 
            key={`${activeWorkflow.id}-event`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 w-full p-5 rounded-2xl bg-slate-950 border border-slate-800 relative z-10 flex flex-col items-center text-center space-y-3"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">2. Event</div>
              <div className="text-sm font-bold text-white">{activeWorkflow.event}</div>
            </div>
          </motion.div>

          <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block shrink-0" />
          <div className="w-px h-6 bg-slate-800 md:hidden"></div>

          {/* Metric */}
          <motion.div 
            key={`${activeWorkflow.id}-metric`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 w-full p-5 rounded-2xl bg-slate-950 border border-slate-800 relative z-10 flex flex-col items-center text-center space-y-3"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">3. Metric</div>
              <div className="text-sm font-bold text-white">{activeWorkflow.metric}</div>
            </div>
          </motion.div>

          <ArrowRight className="w-5 h-5 text-emerald-500 hidden md:block shrink-0" />
          <div className="w-px h-6 bg-emerald-900 md:hidden"></div>

          {/* Outcome */}
          <motion.div 
            key={`${activeWorkflow.id}-outcome`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 w-full p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)] relative z-10 flex flex-col items-center text-center space-y-3"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">4. Outcome</div>
              <div className="text-sm font-bold text-emerald-50">{activeWorkflow.outcome}</div>
            </div>
          </motion.div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Workflow ROI Tracker List */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Recent Executions & ROI
          </h3>
          <div className="space-y-3">
            {RECENT_WORKFLOWS.map((wf) => (
              <div 
                key={wf.id} 
                onClick={() => setActiveWorkflow(wf)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activeWorkflow.id === wf.id 
                    ? 'bg-slate-950 border-emerald-500/40 shadow-lg' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500">{wf.id}</span>
                    <span className="font-bold text-sm text-white">{wf.action}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    wf.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {wf.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="px-2 py-1 bg-slate-950 rounded text-slate-300">Action</span>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <span className="px-2 py-1 bg-slate-950 rounded text-slate-300">Outcome: {wf.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outcome Validation Engine Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Outcome Validation Engine
            </h4>
            
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question:</p>
              <p className="text-sm font-semibold text-slate-300 italic">
                "Did this action actually produce the desired result?"
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs text-slate-400">Target Result Achieved</span>
                {activeWorkflow.status === 'VERIFIED' ? (
                  <span className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> YES
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm font-bold text-amber-400">
                    <AlertTriangle className="w-4 h-4" /> PENDING
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs text-slate-400">Statistical Confidence</span>
                <span className="text-sm font-mono text-white">{activeWorkflow.confidence}%</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">Measured ROI</span>
                <span className="text-lg font-extrabold text-emerald-400">{activeWorkflow.roi}</span>
              </div>
            </div>

            {activeWorkflow.status !== 'VERIFIED' && (
              <button className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Force Telemetry Re-Sync
              </button>
            )}
          </div>
          
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
             <Lock className="w-5 h-5 text-purple-400 shrink-0" />
             <p className="text-[11px] text-slate-400 leading-relaxed">
               All outcome metrics are immutable and cryptographically bound to the original HANUMANAS Decision Token.
             </p>
          </div>
        </div>

      </div>

    </div>
  )
}
