import { useQuery } from '@tanstack/react-query'
import { FileText, Download, Eye, Lock, FolderOpen } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { api } from '@lib/api'

const DATA_ROOM = [
  {
    folder: 'Corporate',
    docs: [
      { id: 'd1', title: 'Certificate of Incorporation',           type: 'LEGAL',    format: 'PDF', size: '124 KB', date: '2022-01-15', restricted: false },
      { id: 'd2', title: 'Articles of Association — v3',           type: 'LEGAL',    format: 'PDF', size: '340 KB', date: '2024-06-01', restricted: false },
      { id: 'd3', title: 'Shareholders Agreement',                 type: 'LEGAL',    format: 'PDF', size: '512 KB', date: '2024-09-10', restricted: true  },
    ],
  },
  {
    folder: 'Financials',
    docs: [
      { id: 'd4', title: 'Audited Accounts — FY 2025',             type: 'FINANCIAL',format: 'PDF', size: '890 KB', date: '2026-03-01', restricted: false },
      { id: 'd5', title: 'Management Accounts — Q1 2026',          type: 'FINANCIAL',format: 'PDF', size: '245 KB', date: '2026-04-15', restricted: false },
      { id: 'd6', title: 'Cap Table — June 2026',                  type: 'FINANCIAL',format: 'XLSX',size: '88 KB',  date: '2026-06-01', restricted: true  },
      { id: 'd7', title: 'Budget & Forecast — FY 2027',            type: 'FINANCIAL',format: 'PDF', size: '310 KB', date: '2026-01-10', restricted: true  },
    ],
  },
  {
    folder: 'Investment',
    docs: [
      { id: 'd8', title: 'Seed Round Term Sheet',                  type: 'INVESTMENT',format: 'PDF',size: '180 KB', date: '2023-11-20', restricted: true  },
      { id: 'd9', title: 'Series A Investor Presentation',         type: 'DECK',     format: 'PDF', size: '4.2 MB', date: '2024-08-15', restricted: false },
      { id: 'd10',title: 'Q2 2026 Investor Update Deck',           type: 'DECK',     format: 'PDF', size: '2.8 MB', date: '2026-06-01', restricted: false },
    ],
  },
  {
    folder: 'Board Materials',
    docs: [
      { id: 'd11',title: 'Board Pack — Q1 2026',                   type: 'BOARD',    format: 'PDF', size: '3.1 MB', date: '2026-03-20', restricted: true  },
      { id: 'd12',title: 'Board Minutes — March 2026',             type: 'MINUTES',  format: 'PDF', size: '95 KB',  date: '2026-04-01', restricted: true  },
    ],
  },
]

const TYPE_V: Record<string, 'danger' | 'info' | 'success' | 'warning' | 'neutral' | 'brand'> = {
  LEGAL: 'danger', FINANCIAL: 'success', INVESTMENT: 'brand', DECK: 'info', BOARD: 'warning', MINUTES: 'neutral',
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

type Doc = typeof DATA_ROOM[0]['docs'][0]

function shapeDoc(d: Record<string, unknown>): Doc {
  return {
    id:         String(d.id),
    title:      String(d.title ?? ''),
    type:       String(d.type ?? 'FILE').toUpperCase(),
    format:     String(d.format ?? d.mimeType ?? 'FILE').toUpperCase().split('/').pop() ?? 'FILE',
    size:       String(d.size ?? '—'),
    date:       String(d.createdAt ?? d.date ?? new Date().toISOString()).slice(0, 10),
    restricted: Boolean(d.restricted ?? false),
  }
}

export function InvestorDocuments() {
  const { data: liveDocs } = useQuery({
    queryKey: ['investor', 'documents'],
    queryFn: () => api.get('/documents/my-documents').then(r => r.data.documents ?? []),
    staleTime: 1000 * 60 * 5,
  })

  const dataRoom = liveDocs?.length
    ? [{ folder: 'Shared Documents', docs: (liveDocs as Record<string, unknown>[]).map(shapeDoc) }]
    : DATA_ROOM

  const totalDocs = dataRoom.reduce((s: number, f: typeof DATA_ROOM[0]) => s + f.docs.length, 0)

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white">Data Room</h2>
        <p className="text-sm text-slate-500 mt-0.5">{totalDocs} documents · confidential investor access</p>
      </div>

      {dataRoom.map((folder: typeof DATA_ROOM[0]) => (
        <div key={folder.folder}>
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen className="w-4 h-4 text-slate-500" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{folder.folder}</p>
            <span className="text-xs text-slate-500">({folder.docs.length})</span>
          </div>
          <Card padding="none">
            <ul className="divide-y divide-[#2E2854]">
              {folder.docs.map((doc: Doc) => (
                <li key={doc.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-900 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-slate-200 truncate">{doc.title}</p>
                      {doc.restricted && <Lock className="w-3 h-3 text-slate-500 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <Badge variant={TYPE_V[doc.type] ?? 'neutral'} size="sm">{doc.type}</Badge>
                      <span>{doc.format}</span>
                      <span>{doc.size}</span>
                      <span>{fmtDate(doc.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-os-s1 text-slate-500 hover:text-slate-500">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-os-s1 text-slate-500 hover:text-slate-500">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ))}
    </div>
  )
}
