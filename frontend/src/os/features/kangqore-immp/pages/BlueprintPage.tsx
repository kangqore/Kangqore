import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  FileJson, Zap, Download, Upload, CheckCircle2, AlertTriangle,
  Building2, Target, Shield, GitBranch, BarChart3, Globe2, Archive,
  ChevronDown, ChevronRight, Layers,
} from 'lucide-react'
import { adminApi } from '@lib/api'

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

// ─── Design tokens ─────────────────────────────────────────────────────────────

const CARD    = 'var(--os-card)'
const BORDER  = 'var(--os-border)'
const TEXT1   = 'var(--os-text-1)'
const TEXT2   = 'var(--os-text-2)'
const SURFACE = 'var(--os-surface-0)'

const GREEN  = '#22c55e'
const BLUE   = '#3b82f6'
const AMBER  = '#f59e0b'
const PURPLE = '#a855f7'
const TEAL   = '#14b8a6'
const RED    = '#ef4444'
const INDIGO = '#6366f1'

const STATUS_COLOR: Record<string, string> = { DRAFT: AMBER, ACTIVE: GREEN, ARCHIVED: TEXT2 }

// ─── Blueprint tree section ────────────────────────────────────────────────────

function TreeSection({
  icon: Icon, label, color, count, children,
}: { icon: any; label: string; color: string; count?: number; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '7px 10px', borderRadius: 6,
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = `${BLUE}08`)}
        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
      >
        <Icon className="w-3.5 h-3.5" style={{ color, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: TEXT1, flex: 1, textAlign: 'left' }}>{label}</span>
        {count !== undefined && (
          <span style={{ fontSize: 10, background: `${color}20`, color, padding: '2px 7px', borderRadius: 20, fontWeight: 700 }}>
            {count}
          </span>
        )}
        {children && (open
          ? <ChevronDown className="w-3 h-3" style={{ color: TEXT2 }} />
          : <ChevronRight className="w-3 h-3" style={{ color: TEXT2 }} />
        )}
      </button>
      {open && children && (
        <div style={{ paddingLeft: 28, paddingBottom: 4 }}>
          {children}
        </div>
      )}
    </div>
  )
}

function TreeLeaf({ label, value }: { label: string; value?: string | number }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '4px 10px', fontSize: 11 }}>
      <span style={{ color: TEXT2 }}>{label}</span>
      {value !== undefined && <span style={{ color: TEXT1, fontWeight: 500 }}>{value}</span>}
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

  if (isLoading) return <div style={{ padding: 20, fontSize: 12, color: TEXT2 }}>Loading blueprint…</div>
  if (!data)     return <div style={{ padding: 20, fontSize: 12, color: RED }}>Blueprint not found.</div>

  const s = data.spec

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: TEXT1, margin: 0 }}>{data.name}</h3>
          <div style={{ fontSize: 11, color: TEXT2, marginTop: 2 }}>
            v{data.version} · {data.pack ?? 'custom'} · {data.industry ?? '—'} ·{' '}
            <span style={{ color: STATUS_COLOR[data.status] ?? TEXT2, fontWeight: 600 }}>{data.status}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={downloadSpec}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}44`,
              borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          {data.status === 'DRAFT' && (
            <button
              onClick={() => activateMut.mutate()}
              disabled={activateMut.isPending}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: GREEN, color: '#fff', border: 'none',
                borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Activate
            </button>
          )}
          {data.status !== 'ARCHIVED' && (
            <button
              onClick={() => archiveMut.mutate()}
              disabled={archiveMut.isPending}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: SURFACE, color: TEXT2, border: `1px solid ${BORDER}`,
                borderRadius: 7, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <Archive className="w-3.5 h-3.5" /> Archive
            </button>
          )}
        </div>
      </div>

      {/* Checksum */}
      {data.checksum && (
        <div style={{ fontSize: 10, color: TEXT2, fontFamily: 'monospace', background: SURFACE, padding: '6px 10px', borderRadius: 6, wordBreak: 'break-all' }}>
          sha256: {data.checksum}
        </div>
      )}

      {/* Tree view */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 4px' }}>
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
          <TreeLeaf label="Block Deletion"  value={s.governance?.blockRecordDeletion ? 'Yes' : 'No'} />
        </TreeSection>
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export function BlueprintPage() {
  const qc = useQueryClient()

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
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'flex-start' }}>

      {/* ── Left panel: list + generate + import ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: `${INDIGO}15`, borderRadius: 9, padding: 7 }}>
            <FileJson className="w-5 h-5" style={{ color: INDIGO }} />
          </div>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: TEXT1, margin: 0 }}>Enterprise Blueprints</h2>
            <p style={{ fontSize: 10, color: TEXT2, margin: 0 }}>Versioned deployment specs. The customer owns it.</p>
          </div>
        </div>

        {/* Generate from live state */}
        <div style={{ background: CARD, border: `1px solid ${INDIGO}33`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: TEXT1, marginBottom: 10 }}>
            Generate from live state
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {([
              ['Blueprint name',    generateName,     setGenerateName],
              ['Organization name', generateOrg,      setGenerateOrg],
            ] as [string, string, (v: string) => void][]).map(([label, value, setter]) => (
              <div key={label}>
                <label style={{ fontSize: 9, color: TEXT2, fontWeight: 700, letterSpacing: 0.5, display: 'block', marginBottom: 3 }}>
                  {label.toUpperCase()}
                </label>
                <input
                  value={value}
                  onChange={e => setter(e.target.value)}
                  style={{
                    width: '100%', background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 5, padding: '6px 9px', fontSize: 11, color: TEXT1, outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              <div>
                <label style={{ fontSize: 9, color: TEXT2, fontWeight: 700, letterSpacing: 0.5, display: 'block', marginBottom: 3 }}>
                  INDUSTRY PACK
                </label>
                <select
                  value={generatePack}
                  onChange={e => { setGeneratePack(e.target.value); setGenerateIndustry(e.target.value) }}
                  style={{
                    width: '100%', background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 5, padding: '6px 9px', fontSize: 11, color: TEXT1, outline: 'none', boxSizing: 'border-box',
                  }}
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
                <label style={{ fontSize: 9, color: TEXT2, fontWeight: 700, letterSpacing: 0.5, display: 'block', marginBottom: 3 }}>
                  ORG SIZE
                </label>
                <select
                  value={generateSize}
                  onChange={e => setGenerateSize(e.target.value)}
                  style={{
                    width: '100%', background: SURFACE, border: `1px solid ${BORDER}`,
                    borderRadius: 5, padding: '6px 9px', fontSize: 11, color: TEXT1, outline: 'none', boxSizing: 'border-box',
                  }}
                >
                  <option value="STARTUP">Startup</option>
                  <option value="SME">SME</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          {generateMut.isError && (
            <div style={{ marginTop: 8, fontSize: 10, color: RED }}>
              {(generateMut.error as Error).message}
            </div>
          )}

          <button
            onClick={() => generateMut.mutate()}
            disabled={generateMut.isPending}
            style={{
              marginTop: 10, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: INDIGO, color: '#fff', border: 'none', borderRadius: 7,
              padding: '8px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            {generateMut.isPending ? 'Generating…' : 'Generate Blueprint'}
          </button>
        </div>

        {/* Import */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
          <button
            onClick={() => setShowImport(o => !o)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: 11, fontWeight: 600, color: TEXT1,
            }}
          >
            <Upload className="w-3.5 h-3.5" style={{ color: AMBER }} />
            Import Blueprint
            {showImport
              ? <ChevronDown className="w-3 h-3 ml-auto" style={{ color: TEXT2 }} />
              : <ChevronRight className="w-3 h-3 ml-auto" style={{ color: TEXT2 }} />
            }
          </button>

          {showImport && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                placeholder="Blueprint name"
                value={importName}
                onChange={e => setImportName(e.target.value)}
                style={{
                  width: '100%', background: SURFACE, border: `1px solid ${BORDER}`,
                  borderRadius: 5, padding: '6px 9px', fontSize: 11, color: TEXT1, outline: 'none', boxSizing: 'border-box',
                }}
              />
              <textarea
                placeholder={'Paste blueprint.json here…'}
                value={importText}
                onChange={e => { setImportText(e.target.value); setValidationResult(null) }}
                rows={6}
                style={{
                  width: '100%', background: SURFACE, border: `1px solid ${BORDER}`,
                  borderRadius: 5, padding: '6px 9px', fontSize: 10, color: TEXT1, outline: 'none',
                  fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box',
                }}
              />

              {validationResult && (
                <div style={{
                  fontSize: 10, padding: '6px 10px', borderRadius: 5,
                  background: validationResult.valid ? `${GREEN}15` : `${RED}15`,
                  border: `1px solid ${validationResult.valid ? GREEN : RED}44`,
                  color: validationResult.valid ? GREEN : RED,
                }}>
                  {validationResult.valid
                    ? '✓ Valid blueprint — ready to import'
                    : validationResult.errors.map((e, i) => <div key={i}>• {e}</div>)
                  }
                </div>
              )}

              {importMut.isError && (
                <div style={{ fontSize: 10, color: RED }}>
                  {(importMut.error as Error).message}
                </div>
              )}

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => validateMut.mutate()}
                  disabled={!importText.trim() || validateMut.isPending}
                  style={{
                    flex: 1, background: SURFACE, color: TEXT1, border: `1px solid ${BORDER}`,
                    borderRadius: 6, padding: '7px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Validate
                </button>
                <button
                  onClick={() => importMut.mutate()}
                  disabled={!importText.trim() || importMut.isPending}
                  style={{
                    flex: 1, background: AMBER, color: '#000', border: 'none',
                    borderRadius: 6, padding: '7px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {importMut.isPending ? 'Importing…' : 'Import'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Blueprint list */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}`, fontSize: 10, fontWeight: 700, color: TEXT2, letterSpacing: 0.5 }}>
            BLUEPRINTS ({blueprints.length})
          </div>
          {isLoading && <div style={{ padding: 14, fontSize: 11, color: TEXT2 }}>Loading…</div>}
          {!isLoading && blueprints.length === 0 && (
            <div style={{ padding: 14, fontSize: 11, color: TEXT2 }}>No blueprints yet. Generate one from live state.</div>
          )}
          {blueprints.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedId(b.id)}
              style={{
                width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                padding: '10px 14px', borderBottom: `1px solid ${BORDER}`,
                background: selectedId === b.id ? `${INDIGO}10` : 'transparent',
                borderLeft: selectedId === b.id ? `3px solid ${INDIGO}` : '3px solid transparent',
                transition: 'background 0.12s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT1, flex: 1 }}>{b.name}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: 0.4,
                  background: `${STATUS_COLOR[b.status] ?? TEXT2}20`, color: STATUS_COLOR[b.status] ?? TEXT2,
                  padding: '2px 6px', borderRadius: 10,
                }}>
                  {b.status}
                </span>
              </div>
              <div style={{ fontSize: 10, color: TEXT2, marginTop: 2 }}>
                v{b.version} · {b.pack ?? 'custom'} · {new Date(b.createdAt).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right panel: detail view ── */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, minHeight: 400 }}>
        {!selectedId && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
            <FileJson className="w-10 h-10" style={{ color: TEXT2, opacity: 0.4 }} />
            <p style={{ fontSize: 12, color: TEXT2, textAlign: 'center', maxWidth: 280 }}>
              Select a blueprint to view its full spec, or generate one from your current live state.
            </p>

            {/* Callout */}
            <div style={{
              background: `${INDIGO}08`, border: `1px solid ${INDIGO}22`, borderRadius: 10,
              padding: '14px 18px', maxWidth: 380, marginTop: 8,
            }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertTriangle className="w-4 h-4" style={{ color: INDIGO, flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: TEXT1, marginBottom: 4 }}>
                    Kangqore View Blueprint™
                  </div>
                  <p style={{ fontSize: 11, color: TEXT2, margin: 0, lineHeight: 1.6 }}>
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
