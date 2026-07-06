import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'

const ACCENT = '#6366F1'

type QCResult = 'PASS' | 'FAIL' | 'HOLD'

interface QCRecord {
  id: string
  batchId: string
  product: string
  inspectionDate: string
  inspector: string
  result: QCResult
  defectCount: number
  notes: string
}

const QC_RECORDS: QCRecord[] = [
  { id: 'QC-0341', batchId: 'BX-2026-041', product: 'Control Unit Model X',  inspectionDate: '22 Jun 2026', inspector: 'Arjun M.',  result: 'PASS', defectCount: 2,  notes: '2 minor cosmetic defects on casing. Within acceptable tolerance (≤3).' },
  { id: 'QC-0340', batchId: 'SA-2026-038', product: 'Sensor Array v3',        inspectionDate: '21 Jun 2026', inspector: 'Kavya P.',  result: 'HOLD', defectCount: 18, notes: 'HOLD — intermittent calibration drift detected in 3% of units. Investigation underway.' },
  { id: 'QC-0339', batchId: 'PS-2026-036', product: 'Power Supply Unit 24V',  inspectionDate: '20 Jun 2026', inspector: 'Ravi S.',   result: 'PASS', defectCount: 0,  notes: 'Full batch passed. All units within voltage tolerance ±0.2V.' },
  { id: 'QC-0338', batchId: 'EA-2026-034', product: 'Enclosure Assembly B',   inspectionDate: '19 Jun 2026', inspector: 'Arjun M.',  result: 'PASS', defectCount: 1,  notes: '1 unit with misaligned bracket — rejected and replaced.' },
  { id: 'QC-0337', batchId: 'TM-2026-033', product: 'Thermal Module TM-12',   inspectionDate: '18 Jun 2026', inspector: 'Kavya P.',  result: 'PASS', defectCount: 0,  notes: 'Perfect batch. All thermal resistance measurements nominal.' },
  { id: 'QC-0336', batchId: 'CK-2026-031', product: 'Connector Kit CK-8',     inspectionDate: '17 Jun 2026', inspector: 'Deepa R.',  result: 'HOLD', defectCount: 34, notes: 'HOLD — plastic housing on Type-B connector showing micro-fractures. Supplier notified.' },
  { id: 'QC-0335', batchId: 'FF-2026-029', product: 'Firmware Flash Unit v2',  inspectionDate: '16 Jun 2026', inspector: 'Ravi S.',   result: 'FAIL', defectCount: 7,  notes: 'FAIL — 7 units failed firmware verification test. Batch returned to production for rework.' },
  { id: 'QC-0334', batchId: 'BX-2026-040', product: 'Control Unit Model X',   inspectionDate: '15 Jun 2026', inspector: 'Deepa R.',  result: 'PASS', defectCount: 3,  notes: 'Borderline pass — 3 units at tolerance limit. Flag for next batch review.' },
]

const RESULT_COLOR: Record<QCResult, string> = {
  PASS: '#10B981',
  FAIL: '#EF4444',
  HOLD: '#F59E0B',
}

export function SupplyChainQC() {
  const [filter, setFilter] = useState<'ALL' | QCResult>('ALL')

  const inspectedMTD = QC_RECORDS.length + 26
  const passRate     = ((QC_RECORDS.filter(q => q.result === 'PASS').length / QC_RECORDS.length) * 100).toFixed(1)
  const onHold       = QC_RECORDS.filter(q => q.result === 'HOLD').length
  const defectRate   = '0.8%'

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'ALL',  label: 'All' },
    { key: 'PASS', label: 'Pass' },
    { key: 'FAIL', label: 'Fail' },
    { key: 'HOLD', label: 'Hold' },
  ]

  const visible = filter === 'ALL' ? QC_RECORDS : QC_RECORDS.filter(q => q.result === filter)

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ACCENT}20` }}>
          <ShieldCheck size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Quality Control</h1>
          <p className="text-sm text-[var(--os-text-2)]">Batch inspection results, hold items & defect tracking — MTD</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Batches Inspected', value: String(inspectedMTD), color: ACCENT    },
          { label: 'Pass Rate',         value: `${passRate}%`,       color: '#10B981' },
          { label: 'On Hold',           value: String(onHold),       color: '#F59E0B' },
          { label: 'Defect Rate',       value: defectRate,           color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="p-5 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
            <p className="text-[var(--os-text-2)] text-xs font-medium uppercase tracking-wider">{k.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === t.key
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/60 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] border border-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* QC Records */}
      <div className="space-y-2">
        {visible.map(q => {
          const rc = RESULT_COLOR[q.result]
          return (
            <div
              key={q.id}
              className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-start gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-mono text-[var(--os-text-2)]">{q.id}</p>
                    <p className="text-xs font-mono text-[var(--os-text-2)]">{q.batchId}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">{q.product}</p>
                  <p className="text-xs text-[var(--os-text-2)] mt-0.5">Inspector: {q.inspector} · {q.inspectionDate}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-[var(--os-text-2)]">Defects</p>
                    <p className="text-sm font-bold" style={{ color: q.defectCount === 0 ? '#10B981' : q.defectCount > 10 ? '#EF4444' : '#F59E0B' }}>
                      {q.defectCount}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${rc}22`, color: rc }}>
                    {q.result}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[var(--os-text-2)] mt-2">{q.notes}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
