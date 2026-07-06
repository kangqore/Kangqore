import { Building2 } from 'lucide-react'

const ACCENT = '#F59E0B'

type EntityStatus = 'ACTIVE' | 'DORMANT'

interface LegalEntity {
  id: string
  name: string
  jurisdiction: string
  type: string
  incorporated: string
  status: EntityStatus
  regAddress: string
  regNumber: string
}

const ENTITIES: LegalEntity[] = [
  {
    id: 'ENT-001',
    name: 'Kangqore Ltd',
    jurisdiction: 'United Kingdom',
    type: 'Private Limited Company (Trading)',
    incorporated: '12 Mar 2019',
    status: 'ACTIVE',
    regAddress: '1 Canada Square, Canary Wharf, London, E14 5AB',
    regNumber: 'CH: 11842563',
  },
  {
    id: 'ENT-002',
    name: 'Kangqore Labs Ltd',
    jurisdiction: 'United Kingdom',
    type: 'Private Limited Company (R&D)',
    incorporated: '04 Sep 2021',
    status: 'ACTIVE',
    regAddress: '1 Canada Square, Canary Wharf, London, E14 5AB',
    regNumber: 'CH: 13764891',
  },
  {
    id: 'ENT-003',
    name: 'Kangqore Inc',
    jurisdiction: 'United States (Delaware)',
    type: 'C-Corporation (US Operations)',
    incorporated: '22 Jan 2022',
    status: 'ACTIVE',
    regAddress: '651 N Broad St, Suite 206, Middletown, DE 19709, USA',
    regNumber: 'EIN: 88-1234567',
  },
  {
    id: 'ENT-004',
    name: 'Kangqore EU BV',
    jurisdiction: 'Netherlands',
    type: 'Besloten Vennootschap (EU Operations)',
    incorporated: '15 Jun 2022',
    status: 'ACTIVE',
    regAddress: 'Keizersgracht 424, 1016 GC Amsterdam, Netherlands',
    regNumber: 'KVK: 86312745',
  },
  {
    id: 'ENT-005',
    name: 'Kangqore IP Holdings Ltd',
    jurisdiction: 'United Kingdom',
    type: 'Private Limited Company (IP Holding)',
    incorporated: '30 Nov 2023',
    status: 'DORMANT',
    regAddress: '1 Canada Square, Canary Wharf, London, E14 5AB',
    regNumber: 'CH: 15194302',
  },
]

const STATUS_COLOR: Record<EntityStatus, string> = {
  ACTIVE:  '#10B981',
  DORMANT: '#F59E0B',
}

const JX_FLAG: Record<string, string> = {
  'United Kingdom': '🇬🇧',
  'United States (Delaware)': '🇺🇸',
  'Netherlands': '🇳🇱',
}

export function LegalEntities() {
  const active      = ENTITIES.filter(e => e.status === 'ACTIVE').length
  const dormant     = ENTITIES.filter(e => e.status === 'DORMANT').length
  const jurisdictions = new Set(ENTITIES.map(e => e.jurisdiction)).size

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <Building2 size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Entity Register</h1>
          <p className="text-sm text-[var(--os-text-2)]">All Kangqore group legal entities across jurisdictions</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Entities', value: String(ENTITIES.length), color: ACCENT         },
          { label: 'Active',         value: String(active),          color: '#10B981'       },
          { label: 'Dormant',        value: String(dormant),         color: '#F59E0B'       },
          { label: 'Jurisdictions',  value: String(jurisdictions),   color: '#2564ea'       },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Entity Cards */}
      <div className="space-y-3">
        {ENTITIES.map(e => {
          const sc   = STATUS_COLOR[e.status]
          const flag = JX_FLAG[e.jurisdiction] ?? '🌍'
          return (
            <div
              key={e.id}
              className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{flag}</span>
                  <div>
                    <p className="text-base font-bold text-white">{e.name}</p>
                    <p className="text-xs text-[var(--os-text-2)] mt-0.5">{e.type}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${sc}22`, color: sc }}>
                  {e.status.charAt(0) + e.status.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-xs text-[var(--os-text-2)] mb-0.5">Jurisdiction</p>
                  <p className="text-sm text-[var(--os-text-1)]">{e.jurisdiction}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--os-text-2)] mb-0.5">Incorporated</p>
                  <p className="text-sm text-[var(--os-text-1)]">{e.incorporated}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--os-text-2)] mb-0.5">Reg. Number</p>
                  <p className="text-sm text-[var(--os-text-1)]">{e.regNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--os-text-2)] mb-0.5">Reg. Address</p>
                  <p className="text-xs text-[var(--os-text-2)] leading-snug">{e.regAddress}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
