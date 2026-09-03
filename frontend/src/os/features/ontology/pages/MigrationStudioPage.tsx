import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UploadCloud, Network, ShieldCheck, Zap, Database, Play, Loader2, ArrowRight, CheckCircle, Search, Layers, Workflow, Check, X } from 'lucide-react'
import { cn } from '@design-system/cn'

const CONNECTORS = [
  { name: 'Monday.com', type: 'Work OS', color: '#ff3d57' },
  { name: 'Jira', type: 'Issue Tracking', color: '#0052cc' },
  { name: 'Asana', type: 'Work Management', color: '#f06a6a' },
  { name: 'Salesforce', type: 'CRM', color: '#00a1e0' },
  { name: 'ServiceNow', type: 'ITSM', color: '#81b5a1' },
  { name: 'SAP', type: 'ERP', color: '#0faaff' },
  { name: 'ClickUp', type: 'Work OS', color: '#7b68ee' },
  { name: 'Smartsheet', type: 'Work Management', color: '#0087cb' },
  { name: 'Notion', type: 'Workspace', color: '#000000' },
  { name: 'Trello', type: 'Kanban', color: '#0079bf' },
  { name: 'Hubspot', type: 'CRM', color: '#ff7a59' },
  { name: 'Planview', type: 'PPM', color: '#005b7f' },
  { name: 'Workday', type: 'HCM', color: '#005cb9' },
  { name: 'Azure DevOps', type: 'Engineering', color: '#0078d7' },
  { name: 'Excel / CSV', type: 'Flat Data', color: '#1d6f42' },
]

export function MigrationStudioPage() {
  const [step, setStep] = useState<'idle' | 'scanning' | 'mapping' | 'sandbox' | 'complete'>('idle')
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null)

  const handleConnect = (name: string) => {
    setSelectedConnector(name)
    setStep('scanning')
  }

  return (
    <div className="space-y-8 min-h-full pb-20">
      
      {/* Header */}
      <section className="relative rounded-3xl overflow-hidden bg-black border border-white/10 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 pointer-events-none" />
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <UploadCloud className="w-6 h-6 text-emerald-400" />
              Migration Studio
            </h2>
            <p className="text-sm text-white/60 mt-1 max-w-2xl">
              Import your entire flat workspace and upgrade it into a multi-dimensional AI-native enterprise model.
            </p>
          </div>
          {step !== 'idle' && (
            <button onClick={() => { setStep('idle'); setSelectedConnector(null) }} className="text-xs font-bold text-white/50 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-2xl border border-white/10">
              Cancel Migration
            </button>
          )}
        </div>
      </section>

      {step === 'idle' && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-5 h-5 text-[var(--os-text-2)]" />
            <h3 className="text-lg font-bold text-[var(--os-text-1)]">Select Source System</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CONNECTORS.map(conn => (
              <div 
                key={conn.name}
                onClick={() => handleConnect(conn.name)}
                className="os-card p-5 cursor-pointer hover:border-emerald-500/50 transition-all group flex flex-col justify-between h-32 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: conn.color }} />
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--os-text-3)]">{conn.type}</span>
                <span className="text-base font-black text-[var(--os-text-1)]">{conn.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {step !== 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <StepIndicator current={step} stepId="scanning" icon={Search} title="1. AI Pre-Scan" desc="WAANDA discovers hidden relations." />
            <StepIndicator current={step} stepId="mapping" icon={Network} title="2. Topology Mapping" desc="Flat boards to Semantic Graph." />
            <StepIndicator current={step} stepId="sandbox" icon={ShieldCheck} title="3. Dry-Run Sandbox" desc="Validate policy collisions." />
          </div>

          {/* Main Stage */}
          <div className="lg:col-span-3">
            {step === 'scanning' && <ScanningView connector={selectedConnector!} onNext={() => setStep('mapping')} />}
            {step === 'mapping' && <MappingView connector={selectedConnector!} onNext={() => setStep('sandbox')} />}
            {step === 'sandbox' && <SandboxView onNext={() => setStep('complete')} />}
            {step === 'complete' && <CompleteView />}
          </div>
        </div>
      )}

    </div>
  )
}

function StepIndicator({ current, stepId, icon: Icon, title, desc }: any) {
  const isPast = ['scanning', 'mapping', 'sandbox', 'complete'].indexOf(current) > ['scanning', 'mapping', 'sandbox', 'complete'].indexOf(stepId)
  const isActive = current === stepId
  const isPending = !isPast && !isActive

  const color = isPast ? 'text-emerald-500' : isActive ? 'text-[var(--os-accent)]' : 'text-[var(--os-text-3)]'
  const border = isPast ? 'border-emerald-500/30' : isActive ? 'border-[var(--os-accent)]' : 'border-[var(--os-border)]'

  return (
    <div className={cn("p-4 rounded-2xl border transition-all", border, isActive ? 'bg-[var(--os-surface-hover)]' : 'bg-transparent')}>
      <div className="flex items-center gap-3">
        <Icon className={cn("w-5 h-5", color)} />
        <div>
          <h4 className={cn("text-sm font-bold", isPending ? 'text-[var(--os-text-2)]' : 'text-[var(--os-text-1)]')}>{title}</h4>
          <p className="text-[10px] text-[var(--os-text-3)] mt-0.5">{desc}</p>
        </div>
      </div>
    </div>
  )
}

function ScanningView({ connector, onNext }: any) {
  useEffect(() => {
    const t = setTimeout(onNext, 3000)
    return () => clearTimeout(t)
  }, [onNext])

  return (
    <div className="os-card h-[500px] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50" />
      <Search className="w-12 h-12 text-[#579bfc] animate-pulse mb-6" />
      <h3 className="text-xl font-black text-[var(--os-text-1)] mb-2">WAANDA Pre-Migration Scan</h3>
      <p className="text-sm text-[var(--os-text-2)] max-w-md mx-auto mb-8">
        Analyzing {connector} workspace structure. Detecting implicit foreign keys, orphaned data, and legacy automations.
      </p>
      
      <div className="w-full max-w-sm space-y-3 text-left">
        <ScanLine text="Found 14 independent Boards" done={true} />
        <ScanLine text="Discovered 3,492 Items" done={true} />
        <ScanLine text="Extracting User Groups" done={true} />
        <ScanLine text="Inferring relationships from reference columns..." done={false} />
      </div>
    </div>
  )
}

function ScanLine({ text, done }: any) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {done ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Loader2 className="w-4 h-4 text-[#579bfc] animate-spin" />}
      <span className={done ? 'text-[var(--os-text-1)]' : 'text-[var(--os-text-2)]'}>{text}</span>
    </div>
  )
}

function MappingView({ connector, onNext }: any) {
  return (
    <div className="os-card h-[500px] flex flex-col p-8 relative overflow-hidden">
      <h3 className="text-xl font-black text-[var(--os-text-1)] mb-6">Graph-to-Graph Topology Projection</h3>
      
      <div className="flex-1 flex items-center justify-between px-10">
        
        {/* Legacy Flat Model */}
        <div className="w-64 space-y-4">
          <div className="text-xs font-black uppercase text-[var(--os-text-3)] mb-4">{connector} (Flat)</div>
          <div className="p-4 bg-[var(--os-surface)] border border-red-500/20 rounded-2xl">Boards</div>
          <div className="p-4 bg-[var(--os-surface)] border border-red-500/20 rounded-2xl">Items</div>
          <div className="p-4 bg-[var(--os-surface)] border border-red-500/20 rounded-2xl">Status Columns</div>
        </div>

        {/* Translation */}
        <div className="flex flex-col items-center">
          <ArrowRight className="w-8 h-8 text-[#579bfc] mb-2" />
          <span className="text-[10px] font-bold text-[#579bfc] bg-blue-500/10 px-2 py-1 rounded-full">AI Mapped</span>
        </div>

        {/* Semantic Graph */}
        <div className="w-64 space-y-4 relative">
          <div className="text-xs font-black uppercase text-emerald-500 mb-4">Kangqore Graph</div>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 font-bold flex justify-between">Projects <span>(Node)</span></div>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 font-bold flex justify-between">Tasks <span>(Node)</span></div>
          <div className="p-4 border-l-2 border-emerald-500 ml-4 pl-4 text-xs font-bold text-[var(--os-text-2)]">HAS_TASK (Edge)</div>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 font-bold flex justify-between">Milestone <span>(Property)</span></div>
        </div>

      </div>

      <div className="flex justify-end mt-6">
        <button onClick={onNext} className="bg-[var(--os-accent)] text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg">
          Approve Topology & Continue
        </button>
      </div>
    </div>
  )
}

function SandboxView({ onNext }: any) {
  useEffect(() => {
    const t = setTimeout(onNext, 4000)
    return () => clearTimeout(t)
  }, [onNext])

  return (
    <div className="os-card h-[500px] flex flex-col p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center gap-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4" /> HANUMANAS Validation Sandbox
        </div>
      </div>

      <h3 className="text-xl font-black text-[var(--os-text-1)] mb-2">Simulating Migration</h3>
      <p className="text-sm text-[var(--os-text-2)] max-w-md mb-8">
        Running a dry-run translation of legacy automations into Kangqore Action Engine pipelines.
      </p>

      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center justify-between p-4 bg-[var(--os-surface-hover)] border border-[var(--os-border)] rounded-2xl">
          <div className="flex items-center gap-3">
            <Workflow className="w-5 h-5 text-indigo-500" />
            <div>
              <div className="text-sm font-bold text-[var(--os-text-1)]">Translation: Status Change → Notification</div>
              <div className="text-[10px] text-[var(--os-text-3)]">Converted to Pipeline: 'Notify on State Change'</div>
            </div>
          </div>
          <Check className="w-5 h-5 text-emerald-500" />
        </div>

        <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-red-500" />
            <div>
              <div className="text-sm font-bold text-[var(--os-text-1)]">Translation: Auto-Delete Item</div>
              <div className="text-[10px] text-red-400">HANUMANAS Collision: Hard Deletes restricted by Policy P-4. Mapped to Soft Delete.</div>
            </div>
          </div>
          <ShieldCheck className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      <div className="absolute bottom-8 right-8 flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
        <span className="text-sm font-bold text-amber-500">Committing Graph...</span>
      </div>
    </div>
  )
}

function CompleteView() {
  return (
    <div className="os-card h-[500px] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border-emerald-500/20">
      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-6">
        <Check className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-black text-[var(--os-text-1)] mb-2">Upgrade Complete</h3>
      <p className="text-sm text-[var(--os-text-2)] max-w-md mx-auto mb-8">
        Your workspace has been successfully migrated and upgraded into the Kangqore Semantic Ontology.
      </p>
      
      <Link to="/kangqore-view/admin/ontology/graph" className="bg-white text-black dark:bg-white dark:text-black px-6 py-3 rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity">
        Explore Your New Enterprise Graph
      </Link>
    </div>
  )
}
