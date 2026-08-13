import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UploadSimple, MagicWand, CheckCircle, WarningCircle, ClockCounterClockwise } from '@phosphor-icons/react'
import { Loader2 } from 'lucide-react'
import { api } from '@lib/api'

// Overshadow Roadmap P7.2 — "The Migration Accelerator." The 'coexist first'
// answer to a rip-and-replace pitch: read a CSV export (a ServiceNow CMDB
// export is the marketed use case, but this works for any CSV), map columns
// to an existing Object Type's schema, and populate the ontology for real.

interface OntologyType {
  id: string; name: string; displayName: string; icon: string | null; color: string | null
  schema: Record<string, { type: string; required?: boolean; description?: string }>
}

interface ImportBatch {
  id: string; sourceLabel: string; fileName: string | null
  rowCount: number; createdCount: number; updatedCount: number; errorCount: number
  createdAt: string
  type: { displayName: string }
  objectSet: { name: string; lastCount: number } | null
}

function timeAgo(date: string) {
  const d = Date.now() - new Date(date).getTime()
  const m = Math.floor(d / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function guessMapping(headers: string[], schema: Record<string, any>): Record<string, string> {
  const mapping: Record<string, string> = {}
  for (const field of Object.keys(schema)) {
    const norm = field.toLowerCase()
    const hit = headers.find(h => h.toLowerCase().replace(/[\s_-]/g, '') === norm.replace(/[\s_-]/g, ''))
    if (hit) mapping[field] = hit
  }
  return mapping
}

export function MigrationAcceleratorPage() {
  const qc = useQueryClient()
  const [csvText, setCsvText] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [preview, setPreview] = useState<{ headers: string[]; sampleRows: Record<string, string>[]; rowCount: number } | null>(null)
  const [typeId, setTypeId] = useState('')
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [externalIdColumn, setExternalIdColumn] = useState('')
  const [objectSetName, setObjectSetName] = useState('')
  const [result, setResult] = useState<{ createdCount: number; updatedCount: number; errorCount: number } | null>(null)

  const { data: typesData } = useQuery({ queryKey: ['ontology-types'], queryFn: () => api.get('/admin/ontology/types').then(r => r.data) })
  const types: OntologyType[] = typesData?.types ?? []
  const selectedType = types.find(t => t.id === typeId)

  const { data: batchesData } = useQuery({ queryKey: ['csv-import-batches'], queryFn: () => api.get('/admin/ontology/csv-import/batches').then(r => r.data) })
  const batches: ImportBatch[] = batchesData?.batches ?? []

  const doPreview = useMutation({
    mutationFn: () => api.post('/admin/ontology/csv-import/preview', { text: csvText }).then(r => r.data),
    onSuccess: (data) => { setPreview(data); setResult(null) },
  })

  const doImport = useMutation({
    mutationFn: () => api.post('/admin/ontology/csv-import/run', {
      text: csvText, typeId, columnMapping: mapping,
      externalIdColumn: externalIdColumn || undefined,
      objectSetName: objectSetName || undefined,
      fileName: fileName || undefined,
    }).then(r => r.data),
    onSuccess: (data) => {
      setResult(data)
      qc.invalidateQueries({ queryKey: ['csv-import-batches'] })
      qc.invalidateQueries({ queryKey: ['ontology-objects'] })
    },
  })

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => { setCsvText(String(reader.result ?? '')); setPreview(null); setResult(null) }
    reader.readAsText(file)
  }

  function onSelectType(id: string) {
    setTypeId(id)
    const t = types.find(x => x.id === id)
    if (t && preview) setMapping(guessMapping(preview.headers, t.schema))
    if (t) setObjectSetName(`${t.displayName} — CSV Import`)
  }

  const canImport = csvText.trim() && typeId && Object.keys(mapping).length > 0 && !doImport.isPending

  const schemaFields = useMemo(() => selectedType ? Object.keys(selectedType.schema) : [], [selectedType])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-black text-[var(--os-text-1)] flex items-center gap-2"><MagicWand size={18} weight="fill" /> Migration Accelerator</h2>
        <p className="text-xs text-[var(--os-text-2)] mt-0.5">Read a CSV export — a ServiceNow CMDB export is the target use case — and populate the ontology. Coexist first, not rip-and-replace.</p>
      </div>

      {/* Step 1 — source */}
      <div className="os-card p-4 space-y-3">
        <p className="text-xs font-bold text-[var(--os-text-1)]">1. Paste or upload the CSV</p>
        <textarea
          value={csvText}
          onChange={e => { setCsvText(e.target.value); setPreview(null); setResult(null) }}
          placeholder="name,status,tier&#10;Acme Corp,active,enterprise&#10;..."
          rows={5}
          className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs font-mono text-[var(--os-text-1)] outline-none resize-y"
        />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--os-border)] text-[11px] font-semibold text-[var(--os-text-2)] hover:text-[var(--os-text-1)] cursor-pointer">
            <UploadSimple size={13} /> Upload .csv
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={onFile} />
          </label>
          {fileName && <span className="text-[11px] text-[var(--os-text-2)]">{fileName}</span>}
          <button
            onClick={() => doPreview.mutate()}
            disabled={!csvText.trim() || doPreview.isPending}
            className="ml-auto px-4 py-1.5 rounded-lg bg-[var(--os-accent)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            {doPreview.isPending ? <Loader2 size={13} className="animate-spin" /> : null} Preview
          </button>
        </div>
      </div>

      {/* Step 2 — mapping */}
      {preview && (
        <div className="os-card p-4 space-y-4">
          <p className="text-xs font-bold text-[var(--os-text-1)]">2. Map columns to an Object Type</p>
          <p className="text-[11px] text-[var(--os-text-2)]">{preview.rowCount} rows detected · {preview.headers.length} columns: <span className="font-mono">{preview.headers.join(', ')}</span></p>

          <select
            value={typeId}
            onChange={e => onSelectType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none"
          >
            <option value="">Select target Object Type…</option>
            {types.map(t => <option key={t.id} value={t.id}>{t.displayName}</option>)}
          </select>

          {selectedType && (
            <>
              <div className="space-y-1.5">
                {schemaFields.map(field => (
                  <div key={field} className="flex items-center gap-2">
                    <span className="w-40 text-[11px] font-semibold text-[var(--os-text-1)] flex-shrink-0 truncate">
                      {field}{selectedType.schema[field]?.required ? ' *' : ''}
                    </span>
                    <span className="text-[var(--os-text-2)] text-xs">←</span>
                    <select
                      value={mapping[field] ?? ''}
                      onChange={e => setMapping(m => ({ ...m, [field]: e.target.value }))}
                      className="flex-1 px-2 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none"
                    >
                      <option value="">— not mapped —</option>
                      {preview.headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[var(--os-text-2)] uppercase tracking-wide font-semibold">Match existing objects by (optional)</label>
                  <select
                    value={externalIdColumn}
                    onChange={e => setExternalIdColumn(e.target.value)}
                    className="w-full mt-1 px-2 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none"
                  >
                    <option value="">Always create new</option>
                    {preview.headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[var(--os-text-2)] uppercase tracking-wide font-semibold">Object Set (optional)</label>
                  <input
                    value={objectSetName}
                    onChange={e => setObjectSetName(e.target.value)}
                    placeholder="e.g. ServiceNow CMDB Import"
                    className="w-full mt-1 px-2 py-1.5 rounded-md bg-[var(--os-surface-0)] border border-[var(--os-border)] text-xs text-[var(--os-text-1)] outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => doImport.mutate()}
                disabled={!canImport}
                className="w-full py-2.5 rounded-lg bg-[var(--os-accent)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {doImport.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                Import {preview.rowCount} rows into {selectedType.displayName}
              </button>
            </>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="os-card p-4 flex items-center gap-3">
          {result.errorCount > 0 ? <WarningCircle size={20} className="text-amber-400 flex-shrink-0" /> : <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />}
          <p className="text-xs text-[var(--os-text-1)]">
            <span className="font-bold">{result.createdCount} created</span>, <span className="font-bold">{result.updatedCount} updated</span>
            {result.errorCount > 0 && <span className="text-amber-400 font-bold"> , {result.errorCount} errors</span>}
          </p>
        </div>
      )}

      {/* Recent batches */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-[var(--os-text-1)] flex items-center gap-1.5"><ClockCounterClockwise size={14} /> Recent imports</p>
        {batches.length === 0 ? (
          <p className="text-[11px] text-[var(--os-text-2)] py-4 text-center os-card">No CSV imports yet — run one above to see it here.</p>
        ) : (
          <div className="os-card divide-y divide-[var(--os-border)]">
            {batches.map(b => (
              <div key={b.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11.5px] font-semibold text-[var(--os-text-1)] truncate">
                    {b.fileName ?? 'Pasted CSV'} → {b.type.displayName}
                  </p>
                  <p className="text-[10px] text-[var(--os-text-2)] mt-0.5">
                    {b.createdCount} created · {b.updatedCount} updated{b.errorCount > 0 ? ` · ${b.errorCount} errors` : ''} · {timeAgo(b.createdAt)}
                    {b.objectSet && ` · ${b.objectSet.name} (${b.objectSet.lastCount})`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
