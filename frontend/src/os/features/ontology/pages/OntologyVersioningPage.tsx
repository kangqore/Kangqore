import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  GitMerge, GitBranch, Tag, CheckCircle2, Archive, RotateCcw,
  Plus, ChevronDown, ChevronRight, Clock, Layers,
  X, Trash2, Play, AlertTriangle, AlertCircle, Info, Send,
  CheckCheck, XCircle, ShieldAlert
} from 'lucide-react'
import { apiFetch } from '../../../lib/api'
import { cn } from '@design-system/cn'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SnapshotSummary {
  id: string
  version: string
  label: string
  description: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  typeCount: number
  objectCount: number
  relationshipCount: number
  createdBy: string | null
  publishedAt: string | null
  archivedAt: string | null
  createdAt: string
}

interface VersionStats {
  total: number
  published: number
  drafts: number
  latestPublished: { version: string; publishedAt: string } | null
}

interface BranchChange {
  op: string
  payload: Record<string, any>
  appliedAt: string
  appliedBy?: string
}

interface BranchRecord {
  id: string
  name: string
  description: string | null
  status: 'OPEN' | 'COMMITTED' | 'ABANDONED'
  baseSnapshotId: string | null
  changeCount: number
  changes: BranchChange[]
  createdBy: string | null
  committedAt: string | null
  abandonedAt: string | null
  createdAt: string
}

interface BranchStats {
  total: number
  open: number
  committed: number
  abandoned: number
}

interface ChangeImpact {
  op: string
  payload: Record<string, any>
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
  affectedObjects: number
  affectedRelationships: number
  affectedRefs: number
  note: string
}

interface ImpactReport {
  branchId: string
  branchName: string
  changeCount: number
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH'
  changes: ChangeImpact[]
  summary: {
    typesAdded: number; typesModified: number; typesDeleted: number
    objectsAdded: number; objectsModified: number; objectsDeleted: number
    relationshipsAdded: number; relationshipsDeleted: number
  }
}

interface MergeRequest {
  id: string
  branchId: string
  title: string
  description: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MERGED'
  requestedBy: string | null
  reviewedBy: string | null
  reviewNote: string | null
  requestedAt: string
  reviewedAt: string | null
  mergedAt: string | null
}

interface MRStats { pending: number; approved: number; rejected: number; merged: number }

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function statusPill(status: string) {
  const map: Record<string, string> = {
    DRAFT:     'bg-[#fdab3d]/10 text-[#fdab3d]',
    PUBLISHED: 'bg-[#00c875]/10 text-[#00c875]',
    ARCHIVED:  'bg-[var(--os-border)] text-[var(--os-text-2)]',
    OPEN:      'bg-[#579bfc]/10 text-[#579bfc]',
    COMMITTED: 'bg-[#00c875]/10 text-[#00c875]',
    ABANDONED: 'bg-[var(--os-border)] text-[var(--os-text-2)]',
    PENDING:   'bg-[#fdab3d]/10 text-[#fdab3d]',
    APPROVED:  'bg-[#00c875]/10 text-[#00c875]',
    REJECTED:  'bg-[#e2445c]/10 text-[#e2445c]',
    MERGED:    'bg-[#7c3aed]/10 text-[#7c3aed]',
  }
  return cn('px-2 py-0.5 rounded-full text-xs font-medium', map[status] ?? 'bg-gray-100 text-gray-600')
}

function RiskBadge({ risk }: { risk: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const cfg = {
    LOW:    { cls: 'bg-[#00c875]/10 text-[#00c875]', icon: Info },
    MEDIUM: { cls: 'bg-[#fdab3d]/10 text-[#fdab3d]', icon: AlertTriangle },
    HIGH:   { cls: 'bg-[#e2445c]/10 text-[#e2445c]', icon: AlertCircle },
  }[risk]
  return (
    <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', cfg.cls)}>
      <cfg.icon className="w-3 h-3" />
      {risk}
    </span>
  )
}

// ── Create Snapshot Modal ─────────────────────────────────────────────────────

function CreateSnapshotModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [label, setLabel] = useState('')
  const [desc, setDesc] = useState('')
  const [publish, setPublish] = useState(false)

  const mut = useMutation({
    mutationFn: () => apiFetch('/admin/ontology/snapshots', {
      method: 'POST',
      body: JSON.stringify({ label, description: desc || undefined, publish }),
    }),
    onSuccess: () => { onCreated(); onClose() },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-[var(--os-text-1)] flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#579bfc]" />
            Capture Snapshot
          </h3>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--os-text-2)] mb-1">Label *</label>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Pre-migration baseline"
              className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:ring-2 focus:ring-[#579bfc]/40" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--os-text-2)] mb-1">Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="What changed or why this snapshot matters"
              className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none resize-none" />
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--os-text-1)] cursor-pointer">
            <input type="checkbox" checked={publish} onChange={e => setPublish(e.target.checked)} className="rounded" />
            Publish immediately
          </label>
        </div>
        {mut.isError && <p className="mt-3 text-xs text-[#e2445c]">{String((mut.error as any)?.message ?? 'Error')}</p>}
        <div className="flex gap-2 mt-5 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-2xl border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">Cancel</button>
          <button onClick={() => mut.mutate()} disabled={!label.trim() || mut.isPending}
            className="px-4 py-2 text-sm rounded-2xl bg-[#579bfc] text-white font-medium disabled:opacity-50 hover:bg-[#579bfc]/90">
            {mut.isPending ? 'Capturing…' : 'Capture'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Create Branch Modal ───────────────────────────────────────────────────────

function CreateBranchModal({ snapshots, onClose, onCreated }: { snapshots: SnapshotSummary[]; onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [baseId, setBaseId] = useState('')

  const mut = useMutation({
    mutationFn: () => apiFetch('/admin/ontology/branches', {
      method: 'POST',
      body: JSON.stringify({ name, description: desc || undefined, baseSnapshotId: baseId || undefined }),
    }),
    onSuccess: () => { onCreated(); onClose() },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-[var(--os-text-1)] flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#7c3aed]" />
            New Sandbox Branch
          </h3>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--os-text-2)] mb-1">Branch name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. feature/new-risk-model"
              className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--os-text-2)] mb-1">Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="What are you prototyping?"
              className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--os-text-2)] mb-1">Fork from snapshot</label>
            <select value={baseId} onChange={e => setBaseId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none">
              <option value="">Live ontology (HEAD)</option>
              {snapshots.filter(s => s.status === 'PUBLISHED').map(s => (
                <option key={s.id} value={s.id}>{s.version} — {s.label}</option>
              ))}
            </select>
          </div>
        </div>
        {mut.isError && <p className="mt-3 text-xs text-[#e2445c]">{String((mut.error as any)?.message ?? 'Error')}</p>}
        <div className="flex gap-2 mt-5 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-2xl border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">Cancel</button>
          <button onClick={() => mut.mutate()} disabled={!name.trim() || mut.isPending}
            className="px-4 py-2 text-sm rounded-2xl bg-[#7c3aed] text-white font-medium disabled:opacity-50 hover:bg-[#7c3aed]/90">
            {mut.isPending ? 'Creating…' : 'Create Branch'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Request Merge Modal ───────────────────────────────────────────────────────

function RequestMergeModal({ branch, onClose, onCreated }: { branch: BranchRecord; onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState(`Merge ${branch.name}`)
  const [desc, setDesc] = useState('')

  const impactQ = useQuery({
    queryKey: ['branch-impact', branch.id],
    queryFn: () => apiFetch<{ report: ImpactReport }>(`/admin/ontology/branches/${branch.id}/impact`),
  })

  const mut = useMutation({
    mutationFn: () => apiFetch(`/admin/ontology/branches/${branch.id}/merge-request`, {
      method: 'POST',
      body: JSON.stringify({ title, description: desc || undefined }),
    }),
    onSuccess: () => { onCreated(); onClose() },
  })

  const report = impactQ.data?.report

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-[var(--os-card)] border border-[var(--os-border)] rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 pb-0">
          <h3 className="font-semibold text-[var(--os-text-1)] flex items-center gap-2">
            <Send className="w-4 h-4 text-[#7c3aed]" />
            Request Merge — <span className="font-mono text-[#7c3aed]">{branch.name}</span>
          </h3>
          <button onClick={onClose} className="text-[var(--os-text-2)] hover:text-[var(--os-text-1)]"><X className="w-4 h-4" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--os-text-2)] mb-1">Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--os-text-2)] mb-1">Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Explain what this merge achieves"
              className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none resize-none" />
          </div>

          {/* Impact preview */}
          <div className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-[var(--os-text-2)]" />
              <span className="text-xs font-semibold text-[var(--os-text-1)]">Change Impact Analysis</span>
              {report && <RiskBadge risk={report.overallRisk} />}
            </div>

            {impactQ.isLoading && <p className="text-xs text-[var(--os-text-2)]">Analysing…</p>}

            {report && (
              <>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    ['Types +', report.summary.typesAdded, '#00c875'],
                    ['Types ~', report.summary.typesModified, '#579bfc'],
                    ['Types −', report.summary.typesDeleted, '#e2445c'],
                    ['Objs −', report.summary.objectsDeleted, '#e2445c'],
                  ].map(([label, val, color]) => (
                    <div key={label as string} className="rounded-2xl p-2 text-center" style={{ background: `${color}10` }}>
                      <p className="text-[11px] text-[var(--os-text-2)]">{label}</p>
                      <p className="text-base font-bold" style={{ color: color as string }}>{val}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {report.changes.map((ch, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <RiskBadge risk={ch.risk} />
                      <span className="font-mono text-[#579bfc]">{ch.op}</span>
                      <span className="text-[var(--os-text-2)] flex-1">{ch.note}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {mut.isError && <p className="px-5 text-xs text-[#e2445c]">{String((mut.error as any)?.message ?? 'Error')}</p>}

        <div className="flex gap-2 p-5 pt-3 justify-end border-t border-[var(--os-border)]">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-2xl border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">Cancel</button>
          <button onClick={() => mut.mutate()} disabled={!title.trim() || mut.isPending}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-2xl bg-[#7c3aed] text-white font-medium disabled:opacity-50 hover:bg-[#7c3aed]/90">
            <Send className="w-3.5 h-3.5" />
            {mut.isPending ? 'Submitting…' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Snapshot Row ──────────────────────────────────────────────────────────────

function SnapshotRow({ snap, onRefresh }: { snap: SnapshotSummary; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [confirmRollback, setConfirmRollback] = useState(false)

  const publish = useMutation({
    mutationFn: () => apiFetch(`/admin/ontology/snapshots/${snap.id}/publish`, { method: 'POST' }),
    onSuccess: onRefresh,
  })
  const archive = useMutation({
    mutationFn: () => apiFetch(`/admin/ontology/snapshots/${snap.id}/archive`, { method: 'POST' }),
    onSuccess: onRefresh,
  })
  const rollback = useMutation({
    mutationFn: () => apiFetch(`/admin/ontology/snapshots/${snap.id}/rollback`, { method: 'POST' }),
    onSuccess: () => { setConfirmRollback(false); onRefresh() },
  })

  return (
    <div className="border border-[var(--os-border)] rounded-2xl bg-[var(--os-card)] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--os-surface-0)] transition-colors" onClick={() => setExpanded(!expanded)}>
        <button className="text-[var(--os-text-2)]">
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        <Tag className="w-4 h-4 text-[var(--os-text-2)]" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#579bfc]">{snap.version}</span>
            <span className="text-sm font-medium text-[var(--os-text-1)] truncate">{snap.label}</span>
          </div>
          {snap.description && <p className="text-xs text-[var(--os-text-2)] truncate mt-0.5">{snap.description}</p>}
        </div>
        <div className="flex items-center gap-4 text-xs text-[var(--os-text-2)] shrink-0">
          <span>{snap.typeCount} types</span>
          <span>{snap.objectCount} objects</span>
          <span>{snap.relationshipCount} edges</span>
        </div>
        <span className={statusPill(snap.status)}>{snap.status}</span>
        <span className="text-xs text-[var(--os-text-2)] ml-2">{fmt(snap.createdAt)}</span>
      </div>

      {expanded && (
        <div className="border-t border-[var(--os-border)] px-4 py-4 bg-[var(--os-surface-0)]">
          <div className="flex items-center justify-between">
            <div className="space-y-1 text-sm text-[var(--os-text-2)]">
              <div>Created by <span className="text-[var(--os-text-1)]">{snap.createdBy ?? 'system'}</span></div>
              {snap.publishedAt && <div>Published <span className="text-[var(--os-text-1)]">{fmt(snap.publishedAt)}</span></div>}
              {snap.archivedAt && <div>Archived <span className="text-[var(--os-text-1)]">{fmt(snap.archivedAt)}</span></div>}
            </div>
            <div className="flex items-center gap-2">
              {snap.status === 'DRAFT' && (
                <button onClick={() => publish.mutate()} disabled={publish.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-2xl bg-[#00c875]/10 text-[#00c875] hover:bg-[#00c875]/20 font-medium disabled:opacity-50">
                  <CheckCircle2 className="w-3.5 h-3.5" />{publish.isPending ? 'Publishing…' : 'Publish'}
                </button>
              )}
              {snap.status === 'PUBLISHED' && (
                <button onClick={() => archive.mutate()} disabled={archive.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-2xl border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
                  <Archive className="w-3.5 h-3.5" />Archive
                </button>
              )}
              {snap.status !== 'ARCHIVED' && (
                confirmRollback ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#e2445c] font-medium">Roll back live ontology to this snapshot?</span>
                    <button onClick={() => rollback.mutate()} disabled={rollback.isPending}
                      className="px-3 py-1.5 text-xs rounded-2xl bg-[#e2445c] text-white font-medium disabled:opacity-50">
                      {rollback.isPending ? 'Rolling back…' : 'Confirm'}
                    </button>
                    <button onClick={() => setConfirmRollback(false)} className="text-xs text-[var(--os-text-2)]">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmRollback(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-2xl border border-[#e2445c]/40 text-[#e2445c] hover:bg-[#e2445c]/5 font-medium">
                    <RotateCcw className="w-3.5 h-3.5" />Rollback
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Branch Row ────────────────────────────────────────────────────────────────

function BranchRow({ branch, onRefresh }: { branch: BranchRecord; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [confirmAbandon, setConfirmAbandon] = useState(false)

  const abandon = useMutation({
    mutationFn: () => apiFetch(`/admin/ontology/branches/${branch.id}/abandon`, { method: 'POST' }),
    onSuccess: () => { setConfirmAbandon(false); onRefresh() },
  })

  const opColor: Record<string, string> = {
    ADD_TYPE: '#00c875', UPDATE_TYPE: '#579bfc', DELETE_TYPE: '#e2445c',
    ADD_OBJECT: '#00c875', UPDATE_OBJECT: '#579bfc', DELETE_OBJECT: '#e2445c',
    ADD_RELATIONSHIP: '#00c875', DELETE_RELATIONSHIP: '#e2445c', UPDATE_RELATIONSHIP: '#579bfc',
  }

  return (
    <>
      <div className="border border-[var(--os-border)] rounded-2xl bg-[var(--os-card)] overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--os-surface-0)] transition-colors" onClick={() => setExpanded(!expanded)}>
          <button className="text-[var(--os-text-2)]">
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          <GitBranch className="w-4 h-4 text-[var(--os-text-2)]" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#7c3aed]">{branch.name}</span>
              {branch.changeCount > 0 && (
                <span className="text-xs bg-[#7c3aed]/10 text-[#7c3aed] px-1.5 py-0.5 rounded-full">
                  {branch.changeCount} change{branch.changeCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {branch.description && <p className="text-xs text-[var(--os-text-2)] truncate mt-0.5">{branch.description}</p>}
          </div>
          <span className={statusPill(branch.status)}>{branch.status}</span>
          <span className="text-xs text-[var(--os-text-2)] ml-2">{fmt(branch.createdAt)}</span>
        </div>

        {expanded && (
          <div className="border-t border-[var(--os-border)] px-4 py-4 bg-[var(--os-surface-0)]">
            {branch.changes.length > 0 ? (
              <div className="mb-4">
                <p className="text-xs font-medium text-[var(--os-text-2)] mb-2">Staged changes</p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {branch.changes.map((ch, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="font-mono px-1.5 py-0.5 rounded text-white text-[10px] shrink-0 mt-0.5" style={{ backgroundColor: opColor[ch.op] ?? '#888' }}>
                        {ch.op}
                      </span>
                      <span className="text-[var(--os-text-1)] font-mono">{JSON.stringify(ch.payload).slice(0, 80)}</span>
                      <span className="text-[var(--os-text-2)] shrink-0 ml-auto">{fmt(ch.appliedAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--os-text-2)] mb-4">No changes staged yet.</p>
            )}

            {branch.status === 'OPEN' && (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowMergeModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-2xl bg-[#7c3aed]/10 text-[#7c3aed] hover:bg-[#7c3aed]/20 font-medium">
                  <Send className="w-3 h-3" />Request Merge
                </button>
                {confirmAbandon ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#e2445c] font-medium">Abandon this branch?</span>
                    <button onClick={() => abandon.mutate()} disabled={abandon.isPending}
                      className="px-3 py-1.5 text-xs rounded-2xl bg-[#e2445c] text-white font-medium disabled:opacity-50">
                      {abandon.isPending ? 'Abandoning…' : 'Confirm'}
                    </button>
                    <button onClick={() => setConfirmAbandon(false)} className="text-xs text-[var(--os-text-2)]">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmAbandon(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-2xl border border-[#e2445c]/40 text-[#e2445c] hover:bg-[#e2445c]/5 font-medium">
                    <Trash2 className="w-3 h-3" />Abandon
                  </button>
                )}
              </div>
            )}
            {branch.committedAt && <p className="text-xs text-[#00c875]">Committed {fmt(branch.committedAt)}</p>}
            {branch.abandonedAt && <p className="text-xs text-[var(--os-text-2)]">Abandoned {fmt(branch.abandonedAt)}</p>}
          </div>
        )}
      </div>

      {showMergeModal && (
        <RequestMergeModal branch={branch} onClose={() => setShowMergeModal(false)} onCreated={onRefresh} />
      )}
    </>
  )
}

// ── Merge Request Row ─────────────────────────────────────────────────────────

function MergeRequestRow({ mr, onRefresh }: { mr: MergeRequest; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [note, setNote] = useState('')
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  const impactQ = useQuery({
    queryKey: ['branch-impact', mr.branchId],
    queryFn: () => apiFetch<{ report: ImpactReport }>(`/admin/ontology/branches/${mr.branchId}/impact`),
    enabled: expanded,
  })

  const approve = useMutation({
    mutationFn: () => apiFetch(`/admin/ontology/merge-requests/${mr.id}/approve`, {
      method: 'POST', body: JSON.stringify({ note: note || undefined }),
    }),
    onSuccess: () => { setAction(null); onRefresh() },
  })
  const reject = useMutation({
    mutationFn: () => apiFetch(`/admin/ontology/merge-requests/${mr.id}/reject`, {
      method: 'POST', body: JSON.stringify({ note: note || undefined }),
    }),
    onSuccess: () => { setAction(null); onRefresh() },
  })

  const report = impactQ.data?.report

  const statusIcon = {
    PENDING: <Clock className="w-4 h-4 text-[#fdab3d]" />,
    APPROVED: <CheckCheck className="w-4 h-4 text-[#00c875]" />,
    REJECTED: <XCircle className="w-4 h-4 text-[#e2445c]" />,
    MERGED: <GitMerge className="w-4 h-4 text-[#7c3aed]" />,
  }[mr.status]

  return (
    <div className="border border-[var(--os-border)] rounded-2xl bg-[var(--os-card)] overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--os-surface-0)] transition-colors" onClick={() => setExpanded(!expanded)}>
        <button className="text-[var(--os-text-2)]">
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        {statusIcon}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--os-text-1)] truncate">{mr.title}</span>
          </div>
          <p className="text-xs text-[var(--os-text-2)] mt-0.5 font-mono">{mr.branchId.slice(0, 8)}…</p>
        </div>
        <span className={statusPill(mr.status)}>{mr.status}</span>
        <span className="text-xs text-[var(--os-text-2)]">{fmt(mr.requestedAt)}</span>
      </div>

      {expanded && (
        <div className="border-t border-[var(--os-border)] px-4 py-4 bg-[var(--os-surface-0)] space-y-4">
          {mr.description && <p className="text-sm text-[var(--os-text-2)]">{mr.description}</p>}

          <div className="flex flex-wrap gap-4 text-xs text-[var(--os-text-2)]">
            <span>Requested by <strong className="text-[var(--os-text-1)]">{mr.requestedBy ?? 'unknown'}</strong></span>
            {mr.reviewedBy && <span>Reviewed by <strong className="text-[var(--os-text-1)]">{mr.reviewedBy}</strong></span>}
            {mr.reviewNote && <span>Note: <em className="text-[var(--os-text-1)]">{mr.reviewNote}</em></span>}
            {mr.mergedAt && <span>Merged {fmt(mr.mergedAt)}</span>}
          </div>

          {/* Impact analysis */}
          {impactQ.isLoading && <p className="text-xs text-[var(--os-text-2)]">Loading impact analysis…</p>}
          {report && (
            <div className="rounded-2xl border border-[var(--os-border)] p-3 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
                <span className="text-xs font-semibold text-[var(--os-text-1)]">Impact Analysis</span>
                <RiskBadge risk={report.overallRisk} />
                <span className="text-xs text-[var(--os-text-2)] ml-auto">{report.changeCount} change{report.changeCount !== 1 ? 's' : ''}</span>
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {report.changes.map((ch, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <RiskBadge risk={ch.risk} />
                    <span className="font-mono text-[#579bfc]">{ch.op}</span>
                    <span className="text-[var(--os-text-2)] flex-1">{ch.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approve / reject controls */}
          {mr.status === 'PENDING' && (
            <div className="space-y-3">
              {action && (
                <>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                    placeholder={action === 'approve' ? 'Approval note (optional)' : 'Reason for rejection (required)'}
                    className="w-full px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-[var(--os-text-1)] focus:outline-none resize-none" />
                  <div className="flex gap-2">
                    {action === 'approve' ? (
                      <button onClick={() => approve.mutate()} disabled={approve.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-2xl bg-[#00c875] text-white font-medium disabled:opacity-50">
                        <CheckCheck className="w-3.5 h-3.5" />{approve.isPending ? 'Approving…' : 'Approve & Merge'}
                      </button>
                    ) : (
                      <button onClick={() => reject.mutate()} disabled={reject.isPending || !note.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-2xl bg-[#e2445c] text-white font-medium disabled:opacity-50">
                        <XCircle className="w-3.5 h-3.5" />{reject.isPending ? 'Rejecting…' : 'Reject'}
                      </button>
                    )}
                    <button onClick={() => { setAction(null); setNote('') }} className="px-4 py-2 text-sm rounded-2xl border border-[var(--os-border)] text-[var(--os-text-2)] hover:text-[var(--os-text-1)]">
                      Cancel
                    </button>
                  </div>
                </>
              )}
              {!action && (
                <div className="flex gap-2">
                  <button onClick={() => setAction('approve')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-2xl bg-[#00c875]/10 text-[#00c875] hover:bg-[#00c875]/20 font-medium">
                    <CheckCheck className="w-3 h-3" />Approve
                  </button>
                  <button onClick={() => setAction('reject')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-2xl border border-[#e2445c]/40 text-[#e2445c] hover:bg-[#e2445c]/5 font-medium">
                    <XCircle className="w-3 h-3" />Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function OntologyVersioningPage() {
  const qc = useQueryClient()
  const [showCreateSnap, setShowCreateSnap]     = useState(false)
  const [showCreateBranch, setShowCreateBranch] = useState(false)
  const [activeTab, setActiveTab]               = useState<'snapshots' | 'branches' | 'merge-requests'>('snapshots')

  const snapsQuery = useQuery({
    queryKey: ['ontology-snapshots'],
    queryFn: () => apiFetch<{ snapshots: SnapshotSummary[]; stats: VersionStats }>('/admin/ontology/snapshots'),
    refetchInterval: 60_000,
  })
  const branchQuery = useQuery({
    queryKey: ['ontology-branches'],
    queryFn: () => apiFetch<{ branches: BranchRecord[]; stats: BranchStats }>('/admin/ontology/branches'),
    refetchInterval: 60_000,
  })
  const mrQuery = useQuery({
    queryKey: ['ontology-merge-requests'],
    queryFn: () => apiFetch<{ mergeRequests: MergeRequest[]; stats: MRStats }>('/admin/ontology/merge-requests'),
    refetchInterval: 30_000,
  })

  const snaps    = snapsQuery.data?.snapshots     ?? []
  const vsStats  = snapsQuery.data?.stats
  const branches = branchQuery.data?.branches     ?? []
  const brStats  = branchQuery.data?.stats
  const mrs      = mrQuery.data?.mergeRequests    ?? []
  const mrStats  = mrQuery.data?.stats

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['ontology-snapshots'] })
    qc.invalidateQueries({ queryKey: ['ontology-branches'] })
    qc.invalidateQueries({ queryKey: ['ontology-merge-requests'] })
  }

  const pendingCount = mrStats?.pending ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--os-text-1)] flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-[#579bfc]" />
            Ontology Versioning
          </h2>
          <p className="text-sm text-[var(--os-text-2)] mt-0.5">
            Git for Enterprise Knowledge — snapshot, branch, merge, and rollback your ontology.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCreateBranch(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-2xl border border-[var(--os-border)] text-[var(--os-text-1)] hover:bg-[var(--os-surface-0)]">
            <GitBranch className="w-3.5 h-3.5" />New Branch
          </button>
          <button onClick={() => setShowCreateSnap(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-2xl bg-[#579bfc] text-white font-medium hover:bg-[#579bfc]/90">
            <Plus className="w-3.5 h-3.5" />Capture Snapshot
          </button>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Snapshots',     value: vsStats?.total      ?? 0, icon: Tag,          color: '#579bfc' },
          { label: 'Published',     value: vsStats?.published  ?? 0, icon: CheckCircle2, color: '#00c875' },
          { label: 'Open Branches', value: brStats?.open       ?? 0, icon: GitBranch,    color: '#7c3aed' },
          { label: 'Merges Done',   value: mrStats?.merged     ?? 0, icon: GitMerge,     color: '#00c875' },
          { label: 'Pending Review',value: pendingCount,              icon: Clock,        color: pendingCount > 0 ? '#fdab3d' : '#888' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-[var(--os-border)] bg-[var(--os-card)] p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xs text-[var(--os-text-2)]">{s.label}</p>
              <p className="text-xl font-bold text-[var(--os-text-1)]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest published banner */}
      {vsStats?.latestPublished && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#00c875]/5 border border-[#00c875]/20">
          <CheckCircle2 className="w-4 h-4 text-[#00c875]" />
          <div className="text-sm text-[var(--os-text-1)]">
            Current canonical release:{' '}
            <span className="font-mono font-semibold text-[#00c875]">{vsStats.latestPublished.version}</span>
            {' '}— published {fmt(vsStats.latestPublished.publishedAt)}
          </div>
        </div>
      )}

      {/* Pending review alert */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#fdab3d]/5 border border-[#fdab3d]/20 cursor-pointer" onClick={() => setActiveTab('merge-requests')}>
          <Clock className="w-4 h-4 text-[#fdab3d]" />
          <div className="text-sm text-[var(--os-text-1)]">
            <span className="font-semibold text-[#fdab3d]">{pendingCount} merge request{pendingCount !== 1 ? 's' : ''}</span> awaiting your review.
          </div>
          <span className="ml-auto text-xs text-[#fdab3d] font-medium">Review →</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-0.5 border-b border-[var(--os-border)]">
        {([
          { key: 'snapshots',      label: `Snapshots (${snaps.length})` },
          { key: 'branches',       label: `Branches (${branches.length})` },
          { key: 'merge-requests', label: `Merge Requests (${mrs.length})${pendingCount > 0 ? ` · ${pendingCount} pending` : ''}` },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-all',
              activeTab === t.key
                ? 'border-[#579bfc] text-[#579bfc]'
                : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Snapshots */}
      {activeTab === 'snapshots' && (
        <div className="space-y-2">
          {snapsQuery.isLoading && <p className="text-sm text-[var(--os-text-2)]">Loading…</p>}
          {!snapsQuery.isLoading && snaps.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[var(--os-border)] p-8 text-center">
              <Tag className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-2" />
              <p className="text-sm text-[var(--os-text-2)]">No snapshots yet</p>
              <button onClick={() => setShowCreateSnap(true)} className="mt-3 px-4 py-2 text-sm rounded-2xl bg-[#579bfc] text-white">
                Capture First Snapshot
              </button>
            </div>
          )}
          {snaps.map(s => <SnapshotRow key={s.id} snap={s} onRefresh={refresh} />)}
        </div>
      )}

      {/* Branches */}
      {activeTab === 'branches' && (
        <div className="space-y-2">
          {branchQuery.isLoading && <p className="text-sm text-[var(--os-text-2)]">Loading…</p>}
          {!branchQuery.isLoading && branches.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[var(--os-border)] p-8 text-center">
              <GitBranch className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-2" />
              <p className="text-sm text-[var(--os-text-2)]">No branches yet</p>
              <button onClick={() => setShowCreateBranch(true)} className="mt-3 px-4 py-2 text-sm rounded-2xl bg-[#7c3aed] text-white">
                Create First Branch
              </button>
            </div>
          )}
          {branches.map(b => <BranchRow key={b.id} branch={b} onRefresh={refresh} />)}
        </div>
      )}

      {/* Merge Requests */}
      {activeTab === 'merge-requests' && (
        <div className="space-y-2">
          {mrQuery.isLoading && <p className="text-sm text-[var(--os-text-2)]">Loading…</p>}
          {!mrQuery.isLoading && mrs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[var(--os-border)] p-8 text-center">
              <GitMerge className="w-8 h-8 text-[var(--os-text-2)] mx-auto mb-2" />
              <p className="text-sm text-[var(--os-text-2)]">No merge requests yet</p>
              <p className="text-xs text-[var(--os-text-2)] mt-1">Open a branch, stage changes, then submit for review.</p>
            </div>
          )}
          {mrs.map(mr => <MergeRequestRow key={mr.id} mr={mr} onRefresh={refresh} />)}
        </div>
      )}

      {/* Modals */}
      {showCreateSnap && <CreateSnapshotModal onClose={() => setShowCreateSnap(false)} onCreated={refresh} />}
      {showCreateBranch && <CreateBranchModal snapshots={snaps} onClose={() => setShowCreateBranch(false)} onCreated={refresh} />}
    </div>
  )
}
