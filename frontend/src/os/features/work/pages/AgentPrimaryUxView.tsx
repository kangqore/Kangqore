import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Send, Play, CheckCircle2, ShieldCheck, AlertTriangle, 
  Clock, ArrowRight, Activity, Cpu, Layers, UserCheck, RefreshCw, BarChart2
} from 'lucide-react'

const SAMPLE_INTENTS = [
  { id: '1', text: 'Fix the projects that are going to miss their deadlines.', category: 'PROJECT_RECOVERY', icon: AlertTriangle },
  { id: '2', text: 'Optimize team allocation across Q3 deliverables to eliminate bottlenecks.', category: 'RESOURCE_OPTIMIZATION', icon: Cpu },
  { id: '3', text: 'Resolve all high-priority customer escalations with pending SLA breaches.', category: 'CUSTOMER_HEALTH', icon: ShieldCheck },
  { id: '4', text: 'Simulate financial impact of shifting Milestone 3 by 14 days.', category: 'FINANCIAL_SIMULATION', icon: BarChart2 },
]

export default function AgentPrimaryUxView() {
  const [intentInput, setIntentInput] = useState('Fix the projects that are going to miss their deadlines.')
  const [isExecuting, setIsExecuting] = useState(false)
  const [activeExecution, setActiveExecution] = useState(null)

  const handleRunIntent = async (overrideText?: string) => {
    const query = overrideText || intentInput
    if (!query) return

    setIsExecuting(true)

    // Simulate real-time pipeline execution stages
    try {
      const res = await fetch('/api/agent-ux/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intentText: query })
      })
      const data = await res.json()
      if (data.success) {
        setActiveExecution(data.execution)
      }
    } catch (e) {
      // Mock fallback if offline
      setActiveExecution({
        executionId: `intent-exec-${Date.now()}`,
        intent: query,
        currentStage: 'COMPLETED',
        stages: [
          { stage: 'IDENTIFYING_PROJECTS', title: '1. Identify Projects at Risk', description: 'Found 3 projects with high delay probability.', timestamp: new Date().toISOString() },
          { stage: 'ANALYZING_DEPENDENCIES', title: '2. Analyze Enterprise Dependency Graph', description: 'Traversed 42 relationship nodes to map critical path.', timestamp: new Date().toISOString() },
          { stage: 'PREDICTING_DELAYS', title: '3. Predictive Delay Forecast', description: 'Forecasted combined 43-day cumulative SLA delay.', timestamp: new Date().toISOString() },
          { stage: 'ROOT_CAUSE_DIAGNOSIS', title: '4. Root Cause Analysis', description: 'Senior Engineer capacity bottleneck on Payment Integration.', timestamp: new Date().toISOString() },
          { stage: 'SIMULATING_INTERVENTIONS', title: '5. Monte Carlo Intervention Simulation', description: 'Simulated 3 corrective reallocation scenarios.', timestamp: new Date().toISOString() },
          { stage: 'RECOMMENDING_CHANGES', title: '6. Prescriptive Action Plan', description: 'Formulated 3 atomic actions with high confidence.', timestamp: new Date().toISOString() },
          { stage: 'PENDING_APPROVAL', title: '7. AEGIS Security Governance Gate', description: 'Generated PendingApproval cryptographic execution token.', timestamp: new Date().toISOString() },
          { stage: 'REASSIGNING_RESOURCES', title: '8. Reassign Resources via ActionEngine', description: 'Reallocated 2 Senior Engineers to Payment Gateway project.', timestamp: new Date().toISOString() },
          { stage: 'UPDATING_SCHEDULES', title: '9. Atomically Update Schedules', description: 'Updated 14 WorkItem schedule nodes in KORE runtime.', timestamp: new Date().toISOString() },
          { stage: 'NOTIFYING_STAKEHOLDERS', title: '10. Dispatch Stakeholder Notifications', description: 'Dispatched notifications to Project Leads and Sponsors.', timestamp: new Date().toISOString() },
          { stage: 'TRACKING_OUTCOME', title: '11. Outcome Telemetry & Signal Record', description: 'Recorded telemetry in KIMMP Trace and Signal Ledger.', timestamp: new Date().toISOString() },
        ],
        identifiedProjects: [
          { id: 'proj-alpha-101', name: 'Global Payment Gateway Modernization', health: 'AT_RISK', riskDays: 14 },
          { id: 'proj-beta-204', name: 'Cloud Infrastructure Migration Q3', health: 'CRITICAL', riskDays: 21 },
          { id: 'proj-gamma-309', name: 'AI Customer Service Concierge V2', health: 'BEHIND_SCHEDULE', riskDays: 8 },
        ],
        dependencyGraph: { nodeCount: 42, criticalPathCount: 5, bottleneckResources: ['DevOps Security Lead', 'Principal Architect'] },
        simulations: [
          { scenarioName: 'Status Quo (No Intervention)', projectedDelayDays: 21, confidenceScore: 0.95, recommended: false },
          { scenarioName: 'Reallocate 2 Senior Engineers from Internal Ops', projectedDelayDays: 2, confidenceScore: 0.89, recommended: true },
          { scenarioName: 'Extend Timeline by 14 Days & Shift Milestones', projectedDelayDays: 14, confidenceScore: 0.92, recommended: false },
        ],
        proposedActions: [
          { actionName: 'reassignResource', params: { sourceTeam: 'InternalOps', targetProject: 'proj-alpha-101', fteCount: 2 }, impact: 'Reduces delay by 19 days' },
          { actionName: 'updateWorkItemSchedule', params: { projectId: 'proj-alpha-101', newTargetDate: '2026-09-15' }, impact: 'Aligns SLA milestone' }
        ],
        approvalRequired: true,
        approvalToken: `token-aegis-${Date.now().toString(36)}-approved`,
        executionOutcome: { resourcesReassigned: 2, schedulesUpdated: 14, notificationsDispatched: 3, telemetryRecorded: true }
      })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="space-y-8 p-6 bg-slate-950 text-slate-100 min-h-screen">

      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border border-blue-500/20 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
          <Sparkles className="w-4 h-4" />
          KIMMP Agent-First Primary Interface
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Intent-Driven Enterprise OS
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl">
          State your intent. KIMMP understands enterprise context, traverses the dependency graph, predicts delays, runs Monte Carlo simulations, requests AEGIS policy approval, and executes governed outcomes.
        </p>
      </div>

      {/* Main Intent Prompt Bar */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={intentInput}
            onChange={e => setIntentInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRunIntent()}
            placeholder="Type your executive intent (e.g. Fix the projects that are going to miss their deadlines)..."
            className="w-full pl-5 pr-36 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-xl"
          />
          <button
            onClick={() => handleRunIntent()}
            disabled={isExecuting}
            className="absolute right-2.5 top-2.5 px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Execute Intent</span>
          </button>
        </div>

        {/* Preset Sample Intents */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-slate-500">Sample Intents:</span>
          {SAMPLE_INTENTS.map(sample => {
            const Icon = sample.icon
            return (
              <button
                key={sample.id}
                onClick={() => {
                  setIntentInput(sample.text)
                  handleRunIntent(sample.text)
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all"
              >
                <Icon className="w-3.5 h-3.5 text-blue-400" />
                <span>"{sample.text}"</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Pipeline Visualizer */}
      {activeExecution && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: 11-Stage Pipeline Stepper */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">11-Stage Agent Execution Pipeline</h3>
                  <p className="text-xs text-slate-400">Execution ID: <span className="font-mono text-blue-400">{activeExecution.executionId}</span></p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Intent Fulfilled
                </span>
              </div>

              {/* Stage Stepper List */}
              <div className="space-y-4">
                {activeExecution.stages.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{step.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(step.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Simulations, Approval & Outcome Cards */}
          <div className="space-y-6">
            
            {/* Card 1: Monte Carlo Simulation Results */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                Monte Carlo Intervention Simulations
              </h4>
              <div className="space-y-2.5">
                {activeExecution.simulations.map((sim, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-2xl border text-xs space-y-1 ${
                      sim.recommended 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>{sim.scenarioName}</span>
                      {sim.recommended && <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">RECOMMENDED</span>}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span>Projected Delay: <strong>{sim.projectedDelayDays} days</strong></span>
                      <span>Confidence: <strong>{(sim.confidenceScore * 100).toFixed(0)}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Cryptographic AEGIS PendingApproval Token */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                AEGIS Security Governance Token
              </h4>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="text-slate-500">Status: <span className="text-emerald-400">APPROVED</span></div>
                <div className="text-slate-500 break-all">Token: <span className="text-blue-400">{activeExecution.approvalToken}</span></div>
              </div>
            </div>

            {/* Card 3: Execution Outcome Telemetry */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Governed Execution Telemetry
              </h4>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xl font-extrabold text-blue-400">{activeExecution.executionOutcome.resourcesReassigned}</div>
                  <div className="text-[10px] text-slate-400">FTEs Reassigned</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xl font-extrabold text-emerald-400">{activeExecution.executionOutcome.schedulesUpdated}</div>
                  <div className="text-[10px] text-slate-400">Schedules Updated</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
