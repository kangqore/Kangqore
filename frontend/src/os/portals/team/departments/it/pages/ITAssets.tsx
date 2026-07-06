import { useState } from 'react'
import { HardDrive, Search } from 'lucide-react'
import { ItemDetailPanel, type RelatedItem, type PanelField } from '../../../components/board/ItemDetailPanel'

type AssetType   = 'Server' | 'Laptop' | 'Network' | 'Software' | 'Mobile'
type AssetStatus = 'ACTIVE' | 'MAINTENANCE' | 'RETIRED' | 'SPARE'

interface Asset {
  id:         string
  name:       string
  type:       AssetType
  status:     AssetStatus
  owner:      string
  location:   string
  refreshDue: string
  age:        string
}

const ASSETS: Asset[] = [
  { id: 'AST-0001', name: 'prod-db-01',                    type: 'Server',   status: 'ACTIVE',      owner: 'Infra',     location: 'AWS EU-West-1',     refreshDue: 'Jun 2026',        age: '2.1yr' },
  { id: 'AST-0002', name: 'prod-db-02',                    type: 'Server',   status: 'MAINTENANCE', owner: 'Infra',     location: 'AWS EU-West-1',     refreshDue: 'Jun 2026',        age: '2.1yr' },
  { id: 'AST-0047', name: 'MacBook Pro M3 — Arjun S.',     type: 'Laptop',   status: 'ACTIVE',      owner: 'Arjun S.',  location: 'London HQ',         refreshDue: 'Mar 2027',        age: '0.8yr' },
  { id: 'AST-0048', name: 'MacBook Pro M1 — Kavya R.',     type: 'Laptop',   status: 'ACTIVE',      owner: 'Kavya R.',  location: 'London HQ',         refreshDue: 'Nov 2024',        age: '3.2yr' },
  { id: 'AST-0102', name: 'FortiGate 200F — EU VPN GW',    type: 'Network',  status: 'MAINTENANCE', owner: 'Network',   location: 'AWS EU-West-1',     refreshDue: 'Jan 2026',        age: '1.4yr' },
  { id: 'AST-0103', name: 'Cisco Catalyst 9300 — HQ',      type: 'Network',  status: 'ACTIVE',      owner: 'Network',   location: 'London HQ',         refreshDue: 'Aug 2025',        age: '2.8yr' },
  { id: 'AST-0201', name: 'GitHub Enterprise — 50 seats',  type: 'Software', status: 'ACTIVE',      owner: 'IT',        location: 'Cloud',             refreshDue: 'Renews Sep 2025', age: '1.0yr' },
  { id: 'AST-0202', name: 'Datadog Pro — monitoring',      type: 'Software', status: 'ACTIVE',      owner: 'IT',        location: 'Cloud',             refreshDue: 'Renews Nov 2025', age: '0.5yr' },
  { id: 'AST-0049', name: 'MacBook Air M2 — Sneha G.',     type: 'Laptop',   status: 'SPARE',       owner: 'IT Store',  location: 'London HQ',         refreshDue: 'Feb 2027',        age: '0.4yr' },
]

const T_COLOR: Record<AssetType, string>   = { Server: '#2564ea', Laptop: '#8B5CF6', Network: '#06B6D4', Software: '#10B981', Mobile: '#F97316' }
const S_COLOR: Record<AssetStatus, string> = { ACTIVE: '#10B981', MAINTENANCE: '#F59E0B', RETIRED: 'var(--os-text-2)', SPARE: '#6366F1' }

const CMDB_LINKS: Record<string, RelatedItem[]> = {
  'AST-0102': [
    { id: 'IT-0051', label: 'VPN gateway latency spike — EU region', type: 'Incident', status: 'IN_PROGRESS', color: '#F97316' },
  ],
  'AST-0002': [
    { id: 'IT-0046', label: 'Disk usage > 90% — prod-db-02', type: 'Incident', status: 'RESOLVED', color: '#10B981' },
  ],
  'AST-0201': [
    { id: 'IT-0048', label: 'CI pipeline failing — GitHub Actions', type: 'Incident', status: 'OPEN', color: '#F59E0B' },
    { id: 'CHG-0012', label: 'GitHub Enterprise licence renewal', type: 'Change', status: 'PENDING_CAB', color: '#6366F1' },
  ],
  'AST-0103': [
    { id: 'CHG-0009', label: 'Network firmware upgrade — Catalyst 9300', type: 'Change', status: 'APPROVED', color: '#6366F1' },
  ],
}

const DETAIL_FIELDS: PanelField[] = [
  { label: 'ID',          field: 'id' },
  { label: 'Type',        field: 'type' },
  { label: 'Status',      field: 'status' },
  { label: 'Owner',       field: 'owner' },
  { label: 'Location',    field: 'location' },
  { label: 'Refresh Due', field: 'refreshDue' },
  { label: 'Age',         field: 'age' },
]

export function ITAssets() {
  const [search,      setSearch]  = useState('')
  const [typeFilter,  setType]    = useState<AssetType | 'all'>('all')
  const [selected,    setSelected] = useState<Asset | null>(null)

  const visible = ASSETS.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase())
    const matchType   = typeFilter === 'all' || a.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <HardDrive className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Asset Inventory (CMDB)</h1>
          <p className="text-[var(--os-text-2)] mt-1 text-sm">
            All hardware and software assets — click any row to see linked incidents and change records.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets',   value: ASSETS.length.toString(),                                       color: '#2564ea' },
          { label: 'Active',         value: ASSETS.filter(a => a.status === 'ACTIVE').length.toString(),    color: '#10B981' },
          { label: 'Maintenance',    value: ASSETS.filter(a => a.status === 'MAINTENANCE').length.toString(),color: '#F59E0B' },
          { label: 'CMDB Links',     value: Object.values(CMDB_LINKS).flat().length.toString(),             color: '#6366F1' },
        ].map(s => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Type filter + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--os-text-2)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assets…"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-sm text-[var(--os-text-1)] placeholder:text-[var(--os-text-2)] focus:outline-none focus:ring-1 focus:ring-white/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'Server', 'Laptop', 'Network', 'Software'] as const).map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                typeFilter === t ? 'bg-blue-600 text-white' : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Asset list */}
      <div className="space-y-2">
        {visible.map(a => {
          const hasLinks = !!CMDB_LINKS[a.id]
          return (
            <div
              key={a.id}
              onClick={() => setSelected(a)}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors cursor-pointer"
            >
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                style={{ background: `${T_COLOR[a.type]}22`, color: T_COLOR[a.type] }}
              >
                {a.type}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">{a.name}</p>
                  {hasLinks && (
                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 flex-shrink-0">
                      {CMDB_LINKS[a.id].length} linked
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--os-text-2)] mt-0.5">{a.id} · {a.owner} · {a.location} · Age: {a.age}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <p className="text-xs text-[var(--os-text-2)]">{a.refreshDue}</p>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${S_COLOR[a.status]}22`, color: S_COLOR[a.status] }}
                >
                  {a.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* CMDB Detail Panel */}
      {selected && (
        <ItemDetailPanel
          item={selected}
          fields={DETAIL_FIELDS}
          relatedItems={CMDB_LINKS[selected.id]}
          accentColor="#2564ea"
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
