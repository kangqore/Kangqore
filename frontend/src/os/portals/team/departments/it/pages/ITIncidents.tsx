import { useState } from 'react'
import { Bug, Clock } from 'lucide-react'
import { BoardEngine, type ColumnDef, type KanbanGroup, type PanelField } from '../../../components/board/BoardEngine'

type Priority = 'P1' | 'P2' | 'P3' | 'P4'
type IStatus  = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'

interface Incident {
  id:       string
  title:    string
  priority: Priority
  status:   IStatus
  assignee: string
  opened:   string
  sla:      string
  slaOk:    boolean
}

const INITIAL: Incident[] = [
  { id: 'IT-0051', title: 'VPN gateway latency spike — EU region',   priority: 'P2', status: 'IN_PROGRESS', assignee: 'Rohan M.',   opened: '2h ago',    sla: '6h remaining',  slaOk: true  },
  { id: 'IT-0050', title: 'Login failure — Okta SSO intermittent',   priority: 'P2', status: 'IN_PROGRESS', assignee: 'Arjun S.',   opened: '4h ago',    sla: '4h remaining',  slaOk: true  },
  { id: 'IT-0049', title: 'Email delivery delayed — Office 365',     priority: 'P3', status: 'OPEN',        assignee: 'Unassigned', opened: '6h ago',    sla: '2h remaining',  slaOk: true  },
  { id: 'IT-0048', title: 'CI pipeline failing — GitHub Actions',    priority: 'P3', status: 'OPEN',        assignee: 'Priya N.',   opened: 'Yesterday', sla: 'BREACHED',      slaOk: false },
  { id: 'IT-0047', title: 'NTP sync drift — 3 servers > 5s offset', priority: 'P4', status: 'OPEN',        assignee: 'Unassigned', opened: 'Yesterday', sla: '18h remaining', slaOk: true  },
  { id: 'IT-0046', title: 'Disk usage > 90% — prod-db-02',          priority: 'P2', status: 'RESOLVED',    assignee: 'Rohan M.',   opened: '2 days ago',sla: 'Met',           slaOk: true  },
  { id: 'IT-0045', title: 'SSL cert expiry — internal dashboard',    priority: 'P3', status: 'RESOLVED',    assignee: 'Arjun S.',   opened: '3 days ago',sla: 'Met',           slaOk: true  },
]

const P_COLOR: Record<Priority, string> = { P1: '#EF4444', P2: '#F97316', P3: '#F59E0B', P4: '#6B7280' }
const S_COLOR: Record<IStatus, string>  = { OPEN: '#F59E0B', IN_PROGRESS: '#2564ea', RESOLVED: '#10B981' }

const KANBAN_GROUPS: KanbanGroup[] = [
  { id: 'OPEN',        label: 'Open',        color: '#F59E0B' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: '#2564ea' },
  { id: 'RESOLVED',    label: 'Resolved',    color: '#10B981' },
]

const COLUMNS: ColumnDef[] = [
  {
    id: 'priority', header: 'Pri', field: 'priority',
    editable: true, type: 'select',
    options: ['P1', 'P2', 'P3', 'P4'],
    colorMap: P_COLOR,
    width: '70px',
  },
  {
    id: 'id', header: 'ID', field: 'id', width: '90px',
    render: item => <span className="text-xs font-mono text-[var(--os-text-2)]">{item.id}</span>,
  },
  {
    id: 'title', header: 'Title', field: 'title',
    editable: true, type: 'text',
  },
  {
    id: 'assignee', header: 'Assignee', field: 'assignee',
    editable: true, type: 'select',
    options: ['Rohan M.', 'Arjun S.', 'Priya N.', 'Kavya R.', 'Unassigned'],
    width: '120px',
  },
  {
    id: 'status', header: 'Status', field: 'status',
    editable: true, type: 'select',
    options: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
    colorMap: S_COLOR,
    width: '140px',
  },
  {
    id: 'sla', header: 'SLA', field: 'sla', width: '140px',
    render: item => (
      <span className="flex items-center gap-1.5 text-xs" style={{ color: item.slaOk ? '#10B981' : '#EF4444' }}>
        <Clock className="w-3 h-3" />
        {item.sla}
      </span>
    ),
  },
]

const DETAIL_FIELDS: PanelField[] = [
  { label: 'ID',        field: 'id' },
  { label: 'Priority',  field: 'priority' },
  { label: 'Status',    field: 'status' },
  { label: 'Assignee',  field: 'assignee' },
  { label: 'Opened',    field: 'opened' },
  { label: 'SLA',       field: 'sla' },
]

export function ITIncidents() {
  const [items, setItems] = useState<Incident[]>(INITIAL)

  function handleUpdate(id: string, field: string, value: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Bug className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Incidents</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">
            P1–P4 queue — inline editing, drag-to-resolve kanban, and per-item comment threads.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open',          value: items.filter(i => i.status !== 'RESOLVED').length.toString(), color: '#F59E0B' },
          { label: 'SLA Breached',  value: items.filter(i => !i.slaOk && i.status !== 'RESOLVED').length.toString(), color: '#EF4444' },
          { label: 'Resolved (7d)', value: items.filter(i => i.status === 'RESOLVED').length.toString(), color: '#10B981' },
          { label: 'MTTR (7d)',     value: '3.4h', color: '#2564ea' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Board Engine: Table + Kanban */}
      <BoardEngine
        items={items}
        columns={COLUMNS}
        statusField="status"
        kanbanGroups={KANBAN_GROUPS}
        accentColor="#2564ea"
        detailFields={DETAIL_FIELDS}
        onUpdate={handleUpdate}
        renderKanbanCard={(item: Incident, isDragging) => (
          <div
            className={`p-3 rounded-xl bg-slate-800/60 border transition-all ${
              isDragging ? 'shadow-2xl border-blue-500/40' : 'border-white/10 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: `${P_COLOR[item.priority]}22`, color: P_COLOR[item.priority] }}
              >
                {item.priority}
              </span>
              <span className="text-xs text-[var(--os-text-2)] font-mono">{item.id}</span>
            </div>
            <p className="text-xs font-medium text-white leading-snug mb-2">{item.title}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--os-text-2)]">{item.assignee}</span>
              <span className="text-xs" style={{ color: item.slaOk ? '#10B981' : '#EF4444' }}>
                {item.sla}
              </span>
            </div>
          </div>
        )}
      />
    </div>
  )
}
