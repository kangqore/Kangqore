import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  FileJson, Zap, Download, Upload, CheckCircle2, AlertTriangle,
  Building2, Target, Shield, GitBranch, BarChart3, Globe2, Archive,
  ChevronDown, ChevronRight, Layers, Loader2, Wand2,
} from 'lucide-react'
import { adminApi } from '@lib/api'
import { isDemo } from '@lib/api'
import { cn } from '@design-system/cn'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface BlueprintMeta {
  id:          string
  name:        string
  version:     string
  pack:        string | null
  industry:    string | null
  status:      string
  checksum:    string | null
  deployedAt:  string | null
  importedAt:  string | null
  createdAt:   string
}

interface BlueprintSpec {
  $blueprint:  string
  version:     string
  generatedAt: string
  pack:        string
  organization: { name: string; industry: string; size: string; pack: string }
  departments:  { id: string; name: string }[]
  goals:        { pillar: string; label: string; target: number; unit: string }[]
  ontology:     { entityTypes: { name: string }[]; relationshipTypes: string[] }
  policies:     { name: string; effect: string; priority: number }[]
  agents:       { id: string; schedule?: string }[]
  playbooks:    { delivery: unknown[]; finance: unknown[]; sales: unknown[]; custom: unknown[] }
  kpis:         { pillarWeights: Record<string, number> }
  oisProfile:   { baseline: number; target: number; checkpointInterval: string }
  emi:          { dimensions: string[] }
  coig:         { northStar: boolean; dimensions: string[] }
  governance:   { approvalLevels: Record<string, string>; auditRetentionDays: number }
}

const GREEN  = '#22c55e'
const BLUE   = '#3b82f6'
const AMBER  = '#f59e0b'
const PURPLE = '#a855f7'
const TEAL   = '#14b8a6'
const RED    = '#ef4444'
const INDIGO = '#6366f1'

const STATUS_COLOR: Record<string, string> = { 
  DRAFT: AMBER, 
  ACTIVE: GREEN, 
  ARCHIVED: '#9ca3af' 
}

// ─── Blueprint tree section ────────────────────────────────────────────────────

function TreeSection({
  icon: Icon, label, color, count, children,
}: { icon: any; label: string; color: string; count?: number; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[var(--os-border)]/50 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2.5 px-4 py-3.5 hover:bg-white/[0.02] transition-colors text-left"
      >
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
        <span className="text-xs font-bold text-[var(--os-text-1)] flex-1">{label}</span>
        {count !== undefined && (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
            {count}
          </span>
        )}
        {children && (open
          ? <ChevronDown className="w-3.5 h-3.5 text-[var(--os-text-3)]" />
          : <ChevronRight className="w-3.5 h-3.5 text-[var(--os-text-3)]" />
        )}
      </button>
      {open && children && (
        <div className="pl-10 pr-4 pb-3 space-y-1.5 bg-black/[0.01] border-t border-[var(--os-border)]/20 pt-2">
          {children}
        </div>
      )}
    </div>
  )
}

function TreeLeaf({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-[11px] border-b border-dashed border-[var(--os-border)]/30 last:border-0">
      <span className="text-[var(--os-text-2)] font-semibold">{label}</span>
      {value !== undefined && <span className="text-[var(--os-text-1)] font-bold">{value}</span>}
    </div>
  )
}

// ─── Blueprint detail view ─────────────────────────────────────────────────────

function BlueprintDetail({ blueprintId }: { blueprintId: string }) {
  const { data, isLoading } = useQuery<{ spec: BlueprintSpec } & BlueprintMeta>({
    queryKey: ['blueprint-detail', blueprintId],
    queryFn:  () => adminApi(`/admin/enterprise/blueprints/${blueprintId}`),
  })

  const qc       = useQueryClient()
  const activateMut = useMutation({
    mutationFn: () => adminApi(`/admin/enterprise/blueprints/${blueprintId}/activate`, { method: 'PATCH' }),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['enterprise-blueprints'] }),
  })
  const archiveMut = useMutation({
    mutationFn: () => adminApi(`/admin/enterprise/blueprints/${blueprintId}/archive`, { method: 'PATCH' }),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['enterprise-blueprints'] }),
  })

  function downloadSpec() {
    if (!data?.spec) return
    const blob = new Blob([JSON.stringify(data.spec, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = `${data.name.replace(/\s+/g, '-').toLowerCase()}-blueprint.json`; a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-[var(--os-text-3)] font-semibold text-xs">
        <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> Loading blueprint spec…
      </div>
    )
  }
  if (!data) return <div className="p-5 text-xs text-red-500 font-bold">Blueprint not found.</div>

  const s = data.spec

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--os-border)] pb-4">
        <div>
          <h3 className="text-base font-extrabold text-[var(--os-text-1)]">{data.name}</h3>
          <div className="text-xs text-[var(--os-text-3)] font-bold mt-1.5 flex items-center gap-2">
            <span>v{data.version}</span>
            <span>•</span>
            <span className="uppercase">{data.pack ?? 'custom'}</span>
            <span>•</span>
            <span>{data.industry ?? '—'}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-2xl text-[9px] font-black" style={{ color: STATUS_COLOR[data.status], background: `${STATUS_COLOR[data.status]}15` }}>{data.status}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={downloadSpec}
            className="flex items-center gap-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 font-bold border border-indigo-500/20 rounded-2xl px-4 py-2 text-xs transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Download
          </button>
          {data.status === 'DRAFT' && (
            <button
              onClick={() => activateMut.mutate()}
              disabled={activateMut.isPending}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl px-4 py-2 text-xs transition-all shadow-sm shadow-emerald-500/10"
            >
              <CheckCircle2 className="w-4 h-4" /> Activate
            </button>
          )}
          {data.status !== 'ARCHIVED' && (
            <button
              onClick={() => archiveMut.mutate()}
              disabled={archiveMut.isPending}
              className="flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-[var(--os-text-2)] hover:text-[var(--os-text-1)] font-bold border border-[var(--os-border)] rounded-2xl px-4 py-2 text-xs transition-all"
            >
              <Archive className="w-4 h-4" /> Archive
            </button>
          )}
        </div>
      </div>

      {/* Checksum */}
      {data.checksum && (
        <div className="text-[10px] text-[var(--os-text-3)] font-mono bg-black/10 border border-[var(--os-border)]/40 p-3 rounded-2xl word-break-all">
          <span className="font-bold text-[var(--os-text-2)]">checksum:</span> {data.checksum}
        </div>
      )}

      {/* Tree view */}
      <div className="rounded-2xl border border-[var(--os-border)] bg-white/[0.01] overflow-hidden">
        <TreeSection icon={Building2} label="Organization" color={BLUE}>
          <TreeLeaf label="Name"     value={s.organization?.name} />
          <TreeLeaf label="Industry" value={s.organization?.industry} />
          <TreeLeaf label="Size"     value={s.organization?.size} />
          <TreeLeaf label="Pack"     value={s.organization?.pack} />
        </TreeSection>

        <TreeSection icon={Layers} label="Departments" color={INDIGO} count={s.departments?.length}>
          {s.departments?.map(d => <TreeLeaf key={d.id} label={d.name} />)}
        </TreeSection>

        <TreeSection icon={Target} label="Goals" color={GREEN} count={s.goals?.length}>
          {s.goals?.map(g => (
            <TreeLeaf key={g.pillar} label={g.label} value={`${g.target} ${g.unit}`} />
          ))}
        </TreeSection>

        <TreeSection icon={Globe2} label="Ontology" color={TEAL} count={s.ontology?.entityTypes?.length}>
          {s.ontology?.entityTypes?.map(t => <TreeLeaf key={t.name} label={t.name} />)}
        </TreeSection>

        <TreeSection icon={Shield} label="Policies" color={RED} count={s.policies?.length}>
          {s.policies?.map(p => <TreeLeaf key={p.name} label={p.name} value={p.effect} />)}
        </TreeSection>

        <TreeSection icon={Zap} label="Agents" color={AMBER} count={s.agents?.length}>
          {s.agents?.map(a => <TreeLeaf key={a.id} label={a.id} value={a.schedule} />)}
        </TreeSection>

        <TreeSection icon={GitBranch} label="Playbooks" color={PURPLE}
          count={(s.playbooks?.delivery?.length ?? 0) + (s.playbooks?.finance?.length ?? 0) + (s.playbooks?.sales?.length ?? 0) + (s.playbooks?.custom?.length ?? 0)}
        >
          <TreeLeaf label="Delivery" value={s.playbooks?.delivery?.length} />
          <TreeLeaf label="Finance"  value={s.playbooks?.finance?.length} />
          <TreeLeaf label="Sales"    value={s.playbooks?.sales?.length} />
          {(s.playbooks?.custom?.length ?? 0) > 0 && <TreeLeaf label="Custom" value={s.playbooks?.custom?.length} />}
        </TreeSection>

        <TreeSection icon={BarChart3} label="OIS Profile" color={TEAL}>
          <TreeLeaf label="Baseline"   value={s.oisProfile?.baseline} />
          <TreeLeaf label="Target"     value={s.oisProfile?.target} />
          <TreeLeaf label="Checkpoint" value={s.oisProfile?.checkpointInterval} />
        </TreeSection>

        <TreeSection icon={BarChart3} label="EMI Dimensions" color={INDIGO} count={s.emi?.dimensions?.length}>
          {s.emi?.dimensions?.map(d => <TreeLeaf key={d} label={d} />)}
        </TreeSection>

        <TreeSection icon={Globe2} label="COIG" color={GREEN}>
          <TreeLeaf label="North Star" value={s.coig?.northStar ? 'Yes' : 'No'} />
          {s.coig?.dimensions?.map(d => <TreeLeaf key={d} label={d} />)}
        </TreeSection>

        <TreeSection icon={Shield} label="Governance" color={AMBER}>
          <TreeLeaf label="Audit Retention" value={`${s.governance?.auditRetentionDays}d`} />
        </TreeSection>
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export function BlueprintPage() {
  const qc       = useQueryClient()
  const navigate = useNavigate()

  const [selectedId,        setSelectedId]       = useState<string | null>(null)
  const [showImport,        setShowImport]        = useState(false)
  const [importText,        setImportText]        = useState('')
  const [importName,        setImportName]        = useState('')
  const [generateName,      setGenerateName]      = useState('Enterprise Blueprint')
  const [generateOrg,       setGenerateOrg]       = useState('Kangqore')
  const [generatePack,      setGeneratePack]      = useState('professional-services')
  const [generateIndustry,  setGenerateIndustry]  = useState('professional-services')
  const [generateSize,      setGenerateSize]      = useState('SME')
  const [validationResult,  setValidationResult]  = useState<{ valid: boolean; errors: string[] } | null>(null)

  const { data: blueprints = [], isLoading } = useQuery<BlueprintMeta[]>({
    queryKey: ['enterprise-blueprints'],
    queryFn:  () => adminApi('/admin/enterprise/blueprints'),
    refetchInterval: 30_000,
  })

  const generateMut = useMutation({
    mutationFn: () => adminApi('/admin/enterprise/blueprints/generate', {
      method: 'POST',
      body: JSON.stringify({ name: generateName, orgName: generateOrg, pack: generatePack, industry: generateIndustry, orgSize: generateSize }),
    }),
    onSuccess: (data: { id: string }) => {
      qc.invalidateQueries({ queryKey: ['enterprise-blueprints'] })
      setSelectedId(data.id)
    },
  })

  const validateMut = useMutation({
    mutationFn: () => {
      let spec: unknown
      try { spec = JSON.parse(importText) } catch { throw new Error('Invalid JSON') }
      return adminApi('/admin/enterprise/blueprints/validate', { method: 'POST', body: JSON.stringify({ spec }) })
    },
    onSuccess: (result: { valid: boolean; errors: string[] }) => setValidationResult(result),
  })

  const importMut = useMutation({
    mutationFn: () => {
      let spec: unknown
      try { spec = JSON.parse(importText) } catch { throw new Error('Invalid JSON — paste valid blueprint.json') }
      return adminApi('/admin/enterprise/blueprints/import', {
        method: 'POST',
        body: JSON.stringify({ spec, name: importName || 'Imported Blueprint' }),
      })
    },
    onSuccess: (data: { blueprintId: string }) => {
      qc.invalidateQueries({ queryKey: ['enterprise-blueprints'] })
      setShowImport(false); setImportText(''); setImportName(''); setValidationResult(null)
      setSelectedId(data.blueprintId)
    },
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      {/* ── Left panel: list + generate + import ── */}
      <div className="lg:col-span-1 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
            <FileJson className="w-6 h-6 text-indigo-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-extrabold text-[var(--os-text-1)]">Enterprise Blueprints</h2>
            <p className="text-[11px] text-[var(--os-text-3)] font-semibold mt-0.5">Versioned deployment specs. Customer owned.</p>
          </div>
          <button
            onClick={() => navigate('/kangqore-view/admin/kangqore-immp/blueprint-customize')}
            className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl px-3 py-1.5 text-[11px] font-bold transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Wizard
          </button>
        </div>

        {/* Generate from live state */}
        <div className="os-card p-5 border border-[var(--os-border)]">
          <div className="text-xs font-bold text-[var(--os-text-1)] mb-4">
            Generate from live state
          </div>
          <div className="flex flex-col gap-3">
            {([
              ['Blueprint name',    generateName,     setGenerateName],
              ['Organization name', generateOrg,      setGenerateOrg],
            ] as [string, string, (v: string) => void][]).map(([label, value, setter]) => (
              <div key={label}>
                <label className="text-[9px] font-bold tracking-wider text-[var(--os-text-3)] uppercase block mb-1">
                  {label}
                </label>
                <input
                  value={value}
                  onChange={e => setter(e.target.value)}
                  className="w-full bg-white/[0.02] border border-[var(--os-border)] rounded-2xl px-3 py-2 text-xs text-[var(--os-text-1)] outline-none"
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold tracking-wider text-[var(--os-text-3)] uppercase block mb-1">
                  INDUSTRY PACK
                </label>
                <select
                  value={generatePack}
                  onChange={e => { setGeneratePack(e.target.value); setGenerateIndustry(e.target.value) }}
                  className="w-full bg-white/[0.02] border border-[var(--os-border)] rounded-2xl px-3 py-2 text-xs text-[var(--os-text-1)] outline-none"
                >
                  <option value="professional-services">Professional Services</option>
                  <option value="legal">Legal</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="construction">Construction</option>
                  <option value="technology">Technology</option>
                  <option value="financial-services">Financial Services</option>
                  <option value="consulting">Consulting</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="education">Education</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold tracking-wider text-[var(--os-text-3)] uppercase block mb-1">
                  ORG SIZE
                </label>
                <select
                  value={generateSize}
                  onChange={e => setGenerateSize(e.target.value)}
                  className="w-full bg-white/[0.02] border border-[var(--os-border)] rounded-2xl px-3 py-2 text-xs text-[var(--os-text-1)] outline-none"
                >
                  <option value="STARTUP">Startup</option>
                  <option value="SME">SME</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          {generateMut.isError && (
            <div className="mt-2 text-xs text-red-500 font-bold">
              {(generateMut.error as Error).message}
            </div>
          )}

          <button
            onClick={() => generateMut.mutate()}
            disabled={generateMut.isPending}
            className="mt-4 w-full flex items-center justify-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white border-none rounded-2xl py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-500/10"
          >
            <Zap className="w-4 h-4" />
            {generateMut.isPending ? 'Generating…' : 'Generate Blueprint'}
          </button>
        </div>

        {/* Import */}
        <div className="os-card p-5 border border-[var(--os-border)]">
          <button
            onClick={() => setShowImport(o => !o)}
            className="w-full flex items-center gap-2 bg-none border-none cursor-pointer p-0 text-xs font-bold text-[var(--os-text-1)]"
          >
            <Upload className="w-4 h-4 text-amber-500" />
            <span>Import Blueprint</span>
            {showImport
              ? <ChevronDown className="w-4 h-4 ml-auto text-[var(--os-text-3)]" />
              : <ChevronRight className="w-4 h-4 ml-auto text-[var(--os-text-3)]" />
            }
          </button>

          {showImport && (
            <div className="mt-4 flex flex-col gap-3">
              <input
                placeholder="Blueprint name"
                value={importName}
                onChange={e => setImportName(e.target.value)}
                className="w-full bg-white/[0.02] border border-[var(--os-border)] rounded-2xl px-3 py-2 text-xs text-[var(--os-text-1)] outline-none"
              />
              <textarea
                placeholder="Paste blueprint.json here…"
                value={importText}
                onChange={e => { setImportText(e.target.value); setValidationResult(null) }}
                rows={6}
                className="w-full bg-white/[0.02] border border-[var(--os-border)] rounded-2xl px-3 py-2 text-[11px] text-[var(--os-text-1)] outline-none font-mono resize-y"
              />

              {validationResult && (
                <div className={cn(
                  'text-[11px] p-3 rounded-2xl border font-semibold',
                  validationResult.valid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
                )}>
                  {validationResult.valid
                    ? '✓ Valid blueprint — ready to import'
                    : validationResult.errors.map((e, i) => <div key={i}>• {e}</div>)
                  }
                </div>
              )}

              {importMut.isError && (
                <div className="text-xs text-red-500 font-bold">
                  {(importMut.error as Error).message}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => validateMut.mutate()}
                  disabled={!importText.trim() || validateMut.isPending}
                  className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-[var(--os-text-1)] border border-[var(--os-border)] rounded-2xl py-2 text-xs font-bold transition-all"
                >
                  Validate
                </button>
                <button
                  onClick={() => importMut.mutate()}
                  disabled={!importText.trim() || importMut.isPending}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black border-none rounded-2xl py-2 text-xs font-bold transition-all shadow-md shadow-amber-500/10"
                >
                  {importMut.isPending ? 'Importing…' : 'Import'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Blueprint list */}
        <div className="os-card border border-[var(--os-border)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--os-border)] text-[10px] font-black text-[var(--os-text-3)] tracking-wider">
            BLUEPRINTS ({blueprints.length})
          </div>
          {isLoading && <div className="p-4 text-xs text-[var(--os-text-3)] font-semibold">Loading…</div>}
          {!isLoading && blueprints.length === 0 && (
            <div className="p-4 text-xs text-[var(--os-text-3)]">No blueprints yet. Generate one from live state.</div>
          )}
          <div className="divide-y divide-[var(--os-border)]/50">
            {blueprints.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                className={cn(
                  'w-full text-left px-4 py-3 transition-all flex flex-col gap-1 border-l-4',
                  selectedId === b.id ? 'bg-indigo-500/[0.04] border-indigo-500' : 'bg-transparent border-transparent hover:bg-white/[0.01]'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--os-text-1)] flex-1">{b.name}</span>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${STATUS_COLOR[b.status] ?? '#6b7280'}15`, color: STATUS_COLOR[b.status] ?? '#6b7280' }}>
                    {b.status}
                  </span>
                </div>
                <div className="text-[10px] text-[var(--os-text-3)] font-semibold">
                  v{b.version} · {b.pack ?? 'custom'} · {new Date(b.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: detail view ── */}
      <div className="lg:col-span-2 os-card p-6 border border-[var(--os-border)] min-h-[400px]">
        {!selectedId && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <FileJson className="w-12 h-12 text-[var(--os-text-3)] opacity-40" />
            <p className="text-xs text-[var(--os-text-2)] text-center max-w-xs font-medium leading-relaxed">
              Select a blueprint to view its full spec, or generate one from your current live state.
            </p>

            {/* Callout */}
            <div className="bg-indigo-500/[0.03] border border-indigo-500/10 rounded-2xl p-5 max-w-md mt-4">
              <div className="flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold text-[var(--os-text-1)] mb-1">
                    Kangqore View Blueprint™
                  </div>
                  <p className="text-[11px] text-[var(--os-text-2)] leading-relaxed font-medium margin-0">
                    Every customer deployment produces a versioned Blueprint — the enterprise equivalent of
                    infrastructure-as-code. The customer owns it. WAANDA executes it.
                    Partners deploy it without touching the core platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedId && <BlueprintDetail blueprintId={selectedId} />}
      </div>
    </div>
  )
}
