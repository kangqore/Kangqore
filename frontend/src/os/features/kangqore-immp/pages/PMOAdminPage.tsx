import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, CheckCircle2, Circle, AlertTriangle, Loader2,
  FolderOpen, Leaf, Trash2, Calendar,
} from 'lucide-react'
import { api } from '@lib/api'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const SURF = 'var(--os-surface-0)'
const GREEN = '#10b981'
const AMBER = '#f59e0b'
const BLUE  = '#3b82f6'
const RED   = '#ef4444'

const CUSTOMER_IDS = [
  { id: 'c0', label: 'Customer Zero', color: GREEN },
  { id: 'c1', label: 'Customer One',  color: BLUE  },
  { id: 'c2', label: 'Customer Two',  color: '#7c3aed' },
  { id: 'c3', label: 'Customer Three',color: AMBER },
]

const SEED_NAMES = [
  'Inception Phase', 'Foundation Sprint', 'Alpha Release', 'Beta Testing',
  'Stakeholder Review', 'Go-Live Preparation', 'Post-Launch Support',
  'Q1 Kickoff', 'Phase 1 Delivery', 'Phase 2 Delivery',
]

function isSeedProject(name: string): boolean {
  return SEED_NAMES.some(s => name?.toLowerCase().includes(s.toLowerCase())) ||
    name?.toLowerCase().startsWith('phase ') ||
    name?.toLowerCase().startsWith('q1 ') ||
    name?.toLowerCase().startsWith('q2 ')
}

interface Project {
  id:          string
  title:       string
  status:      string
  startDate:   string | null
  endDate:     string | null
  clientName:  string | null
  progress:    number | null
  createdAt:   string
}

function ProjectRow({ project, onDelete }: { project: Project; onDelete: (id: string) => void }) {
  const seed = isSeedProject(project.title)
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '22px 1fr 80px 70px auto', alignItems: 'center',
      gap: 12, padding: '9px 14px', background: CARD, borderBottom: `1px solid ${BDR}`,
    }}>
      {seed
        ? <AlertTriangle style={{ width: 13, height: 13, color: AMBER, flexShrink: 0 }} />
        : <Leaf          style={{ width: 13, height: 13, color: GREEN, flexShrink: 0 }} />}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: T1, display: 'flex', alignItems: 'center', gap: 6 }}>
          {project.title}
          {seed && (
            <span style={{ fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: AMBER + '15', color: AMBER, textTransform: 'uppercase', letterSpacing: '.07em' }}>seed</span>
          )}
        </div>
        {project.clientName && <div style={{ fontSize: 10, color: T2 }}>{project.clientName}</div>}
      </div>
      <span style={{ fontSize: 10, color: T2, fontVariantNumeric: 'tabular-nums' }}>
        {project.startDate ? new Date(project.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}
      </span>
      <span style={{
        fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
        background: project.status === 'COMPLETED' ? GREEN + '12' : project.status === 'IN_PROGRESS' ? BLUE + '12' : SURF,
        color: project.status === 'COMPLETED' ? GREEN : project.status === 'IN_PROGRESS' ? BLUE : T2,
      }}>{project.status?.replace('_', ' ')}</span>
      <button onClick={() => onDelete(project.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: RED, opacity: 0.5, padding: '2px 4px' }}
        title="Delete project">
        <Trash2 style={{ width: 11, height: 11 }} />
      </button>
    </div>
  )
}

function AddProjectForm({ onDone }: { onDone: () => void }) {
  const [title,      setTitle]      = useState('')
  const [client,     setClient]     = useState('')
  const [startDate,  setStartDate]  = useState('')
  const [endDate,    setEndDate]    = useState('')
  const [status,     setStatus]     = useState('IN_PROGRESS')

  const createMut = useMutation({
    mutationFn: () => api.post('/admin/projects', {
      title, clientName: client || undefined,
      startDate: startDate || undefined,
      endDate:   endDate   || undefined,
      status,
    }).then(r => r.data),
    onSuccess: () => { onDone(); setTitle(''); setClient('') },
  })

  return (
    <div style={{ padding: '14px 16px', background: GREEN + '04', border: `1px solid ${GREEN}20`, borderRadius: 10, margin: '10px 0' }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.09em', color: GREEN, marginBottom: 10 }}>
        Add Organic Project
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <div>
          <label style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 3 }}>Project Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Q3 ERP Integration"
            style={{ width: '100%', background: CARD, border: `1px solid ${BDR}`, borderRadius: 7, padding: '7px 10px', fontSize: 11, color: T1, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 3 }}>Client Name</label>
          <input value={client} onChange={e => setClient(e.target.value)}
            placeholder="e.g. Acme Corp"
            style={{ width: '100%', background: CARD, border: `1px solid ${BDR}`, borderRadius: 7, padding: '7px 10px', fontSize: 11, color: T1, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 3 }}>Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
            style={{ width: '100%', background: CARD, border: `1px solid ${BDR}`, borderRadius: 7, padding: '7px 10px', fontSize: 11, color: T1, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: 9, fontWeight: 700, color: T2, textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 3 }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ width: '100%', background: CARD, border: `1px solid ${BDR}`, borderRadius: 7, padding: '7px 10px', fontSize: 11, color: T1, outline: 'none', boxSizing: 'border-box' }}>
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => createMut.mutate()} disabled={!title.trim() || createMut.isPending}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: GREEN, color: '#fff', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: !title.trim() || createMut.isPending ? 0.5 : 1 }}>
          {createMut.isPending ? <Loader2 style={{ width: 11, height: 11, animation: 'spin 1s linear infinite' }} /> : <Plus style={{ width: 11, height: 11 }} />}
          Add Project
        </button>
        <button onClick={onDone}
          style={{ padding: '7px 12px', background: SURF, border: `1px solid ${BDR}`, borderRadius: 7, fontSize: 11, cursor: 'pointer', color: T2 }}>
          Cancel
        </button>
      </div>
      {createMut.isError && (
        <p style={{ marginTop: 6, fontSize: 10, color: RED }}>
          {(createMut.error as any)?.response?.data?.error || 'Failed to create project'}
        </p>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function PMOAdminPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pmo-projects'],
    queryFn:  () => api.get('/admin/projects').then(r =>
      Array.isArray(r.data) ? r.data : (r.data?.projects ?? r.data?.data ?? [])
    ),
    staleTime: 15_000,
  })

  const projects: Project[] = data ?? []
  const seedCount    = projects.filter(p => isSeedProject(p.title)).length
  const organicCount = projects.length - seedCount

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/projects/${id}`).then(r => r.data),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['pmo-projects'] }) },
  })

  return (
    <div style={{ maxWidth: 860 }} className="space-y-6">

      {/* ── Header ── */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: T1, margin: 0, letterSpacing: '-.02em' }}>PMO Organic Data</h2>
        <p style={{ fontSize: 11, color: T2, margin: '4px 0 0' }}>
          S100 requires replacing seeded project milestones on C0/C1/C2 with real organic activity. Add projects below.
        </p>
      </div>

      {/* ── Status strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          { label: 'Total Projects',   value: projects.length, color: T1 },
          { label: 'Seed (flagged)',   value: seedCount,       color: AMBER },
          { label: 'Organic',          value: organicCount,    color: GREEN },
          { label: 'Need replacing',   value: seedCount,       color: seedCount > 0 ? RED : GREEN },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 10, padding: '11px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, marginBottom: 2 }}>{s.value}</div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.09em', color: T2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Seed data warning ── */}
      {seedCount > 0 && (
        <div style={{ display: 'flex', gap: 10, padding: '12px 16px', borderRadius: 10, background: AMBER + '08', border: `1px solid ${AMBER}25` }}>
          <AlertTriangle style={{ width: 14, height: 14, color: AMBER, flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 11, color: T2 }}>
            <strong style={{ color: AMBER }}>{seedCount} seed project{seedCount > 1 ? 's' : ''}</strong> detected (flagged with ⚠). These are placeholder records — delete them and add real projects. Seed projects skew OIS and COIG accuracy.
          </div>
        </div>
      )}

      {/* ── Customer context ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {CUSTOMER_IDS.map(c => (
          <div key={c.id} style={{ background: c.color + '06', border: `1px solid ${c.color}20`, borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: c.color, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 4 }}>{c.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {c.id === 'c3'
                ? <Circle style={{ width: 11, height: 11, color: AMBER }} />
                : organicCount > 0
                  ? <CheckCircle2 style={{ width: 11, height: 11, color: GREEN }} />
                  : <AlertTriangle style={{ width: 11, height: 11, color: AMBER }} />}
              <span style={{ fontSize: 10, color: T2 }}>
                {c.id === 'c3' ? 'Add first milestone' : 'Replace seed data'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add project ── */}
      <div>
        {!showForm ? (
          <button onClick={() => setShowForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: GREEN, color: '#fff', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <Plus style={{ width: 13, height: 13 }} /> Add Organic Project
          </button>
        ) : (
          <AddProjectForm onDone={() => { setShowForm(false); refetch() }} />
        )}
      </div>

      {/* ── Project list ── */}
      <div style={{ borderRadius: 12, border: `1px solid ${BDR}`, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BDR}`, background: CARD, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderOpen style={{ width: 13, height: 13, color: BLUE }} />
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: T2 }}>All Projects</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, color: T2 }}>
              <span style={{ color: AMBER }}>⚠ seed</span> · <span style={{ color: GREEN }}>🌱 organic</span>
            </span>
          </div>
        </div>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '22px 1fr 80px 70px auto', gap: 12, padding: '6px 14px', background: SURF }}>
          {['', 'Project', 'Start', 'Status', ''].map((h, i) => (
            <span key={i} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: T2 }}>{h}</span>
          ))}
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '20px 14px', color: T2, fontSize: 11 }}>
            <Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite', color: BLUE }} /> Loading projects…
          </div>
        ) : projects.length === 0 ? (
          <div style={{ padding: '32px 14px', textAlign: 'center', color: T2, fontSize: 12 }}>
            No projects yet. Add your first organic project above.
          </div>
        ) : (
          projects.map(p => (
            <ProjectRow key={p.id} project={p} onDelete={id => deleteMut.mutate(id)} />
          ))
        )}
      </div>

      {/* ── What counts as organic ── */}
      <div style={{ padding: '14px 16px', borderRadius: 10, background: GREEN + '04', border: `1px solid ${GREEN}20` }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: GREEN, textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 8 }}>What makes a project "organic"?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            'Has a real client name matching an active customer',
            'Started after the customer\'s OIS Day 0 baseline date',
            'Title doesn\'t match known seed patterns (Phase 1, Q1 Kickoff, etc.)',
            'Has at least one task or deliverable linked to it',
          ].map((rule, i) => (
            <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start', fontSize: 11, color: T2 }}>
              <CheckCircle2 style={{ width: 11, height: 11, color: GREEN, flexShrink: 0, marginTop: 2 }} />
              {rule}
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
