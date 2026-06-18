import { useQuery } from '@tanstack/react-query'
import { FileText, Download, Eye, FolderOpen, Lock } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { api } from '@lib/api'

const DOCUMENTS = [
  {
    folder: 'Role & Process',
    docs: [
      { id: 'd1', title: 'Senior Backend Engineer — Job Description',  type: 'JD',           format: 'PDF', size: '124 KB', date: '2026-05-08', restricted: false },
      { id: 'd2', title: 'Kangqore Engineering Interview Process Guide', type: 'GUIDE',       format: 'PDF', size: '86 KB',  date: '2026-05-08', restricted: false },
      { id: 'd3', title: 'Technical Assessment Brief',                  type: 'ASSESSMENT',  format: 'PDF', size: '210 KB', date: '2026-05-16', restricted: false },
    ],
  },
  {
    folder: 'Company',
    docs: [
      { id: 'd4', title: 'Kangqore Company Overview Deck',  type: 'DECK',     format: 'PDF', size: '3.2 MB', date: '2026-05-08', restricted: false },
      { id: 'd5', title: 'Engineering Handbook — v4.1',     type: 'HANDBOOK', format: 'PDF', size: '890 KB', date: '2026-04-01', restricted: false },
    ],
  },
  {
    folder: 'Offer (Pending)',
    docs: [
      { id: 'd6', title: 'Offer Letter — Senior Backend Engineer',   type: 'OFFER',  format: 'PDF', size: '180 KB', date: null, restricted: true },
      { id: 'd7', title: 'Employment Contract',                      type: 'CONTRACT',format:'PDF', size: '340 KB', date: null, restricted: true },
    ],
  },
]

const TYPE_V: Record<string, 'info' | 'neutral' | 'warning' | 'success' | 'brand' | 'danger'> = {
  JD: 'info', GUIDE: 'neutral', ASSESSMENT: 'warning',
  DECK: 'brand', HANDBOOK: 'neutral', OFFER: 'success', CONTRACT: 'danger',
}

const fmtDate = (s: string | null) => s
  ? new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  : 'Not yet available'

type DocItem = typeof DOCUMENTS[0]['docs'][0]

export function CareersDocuments() {
  const { data: liveDocs } = useQuery({
    queryKey: ['careers', 'documents'],
    queryFn: () => api.get('/documents/my-documents').then(r => r.data.documents ?? []),
    staleTime: 1000 * 60 * 5,
  })

  const folders = liveDocs?.length
    ? [{ folder: 'Shared Documents', docs: (liveDocs as Record<string, unknown>[]).map((d): DocItem => ({
        id:         String(d.id),
        title:      String(d.title ?? ''),
        type:       String(d.type ?? 'FILE').toUpperCase(),
        format:     'PDF',
        size:       String(d.size ?? '—'),
        date:       String(d.createdAt ?? d.date ?? new Date().toISOString()).slice(0, 10),
        restricted: false,
      })) }]
    : DOCUMENTS

  const total     = folders.reduce((s, f) => s + f.docs.length, 0)
  const available = folders.reduce((s, f) => s + f.docs.filter((d: DocItem) => d.date).length, 0)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-white">Documents</h2>
        <p className="text-sm text-slate-500 mt-0.5">{available} of {total} documents available</p>
      </div>

      {folders.map(folder => (
        <div key={folder.folder}>
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen className="w-4 h-4 text-slate-500" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{folder.folder}</p>
          </div>
          <Card padding="none">
            <ul className="divide-y divide-[#2E2854]">
              {folder.docs.map(doc => {
                const locked = !doc.date
                return (
                  <li key={doc.id} className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${locked ? 'opacity-50' : 'hover:bg-[#0F172A] group'}`}>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      {locked
                        ? <Lock className="w-4 h-4 text-slate-500" />
                        : <FileText className="w-4 h-4 text-amber-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{doc.title}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                        <Badge variant={TYPE_V[doc.type] ?? 'neutral'} size="sm">{doc.type}</Badge>
                        {!locked && <><span>{doc.format}</span><span>{doc.size}</span></>}
                        <span>{fmtDate(doc.date)}</span>
                      </div>
                    </div>
                    {!locked && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-[#151C2F] text-slate-500 hover:text-slate-500">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-[#151C2F] text-slate-500 hover:text-slate-500">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      ))}
    </div>
  )
}
