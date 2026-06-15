import { FileText, Download, Eye, FolderOpen } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { usePartnerDocuments } from '../usePartnerData'

const MOCK_DOCUMENTS = [
  { id: 'doc1', title: 'Partner Agreement — Urban Mobility Co.',       type: 'CONTRACT',  size: '284 KB', project: 'Urban Mobility Platform',    sharedAt: '2026-03-01T10:00:00Z', format: 'PDF'  },
  { id: 'doc2', title: 'SOW — Urban Mobility Platform v2',             type: 'SOW',       size: '156 KB', project: 'Urban Mobility Platform',    sharedAt: '2026-03-15T09:00:00Z', format: 'PDF'  },
  { id: 'doc3', title: 'Sprint 13 Delivery Report',                    type: 'REPORT',    size: '98 KB',  project: 'Urban Mobility Platform',    sharedAt: '2026-05-31T16:00:00Z', format: 'PDF'  },
  { id: 'doc4', title: 'GreenSpark Project Brief',                     type: 'BRIEF',     size: '210 KB', project: 'GreenSpark Energy Dashboard', sharedAt: '2026-04-01T09:00:00Z', format: 'PDF'  },
  { id: 'doc5', title: 'GreenSpark Technical Spec — v1.2',             type: 'SPEC',      size: '340 KB', project: 'GreenSpark Energy Dashboard', sharedAt: '2026-04-10T14:00:00Z', format: 'PDF'  },
  { id: 'doc6', title: 'Quantum Analytics — Final Handover Pack',      type: 'HANDOVER',  size: '1.2 MB', project: 'Quantum Analytics Suite',    sharedAt: '2026-05-20T16:00:00Z', format: 'ZIP'  },
  { id: 'doc7', title: 'May 2026 Payment Confirmation',                type: 'INVOICE',   size: '45 KB',  project: null,                         sharedAt: '2026-06-01T09:00:00Z', format: 'PDF'  },
]

const TYPE_VARIANT: Record<string, 'info' | 'success' | 'warning' | 'neutral' | 'brand' | 'danger'> = {
  CONTRACT: 'danger', SOW: 'brand', REPORT: 'info', BRIEF: 'neutral',
  SPEC: 'info', HANDOVER: 'success', INVOICE: 'warning',
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

type Doc = typeof MOCK_DOCUMENTS[0]

function shapeDoc(d: Record<string, unknown>): Doc {
  const mime = typeof d.mimeType === 'string' ? d.mimeType.split('/')[1]?.toUpperCase() ?? 'FILE' : 'FILE'
  return {
    id:       String(d.id),
    title:    String(d.title ?? d.name ?? ''),
    type:     String(d.type ?? d.category ?? 'FILE').toUpperCase(),
    size:     String(d.size ?? d.fileSize ?? '—'),
    project:  typeof d.project === 'string' ? d.project : typeof d.projectName === 'string' ? d.projectName : null,
    sharedAt: String(d.sharedAt ?? d.createdAt ?? d.uploadedAt ?? new Date().toISOString()),
    format:   String(d.format ?? mime),
  }
}

export function PartnerDocuments() {
  const { data: liveDocs } = usePartnerDocuments()
  const documents: Doc[] = liveDocs?.length
    ? (liveDocs as Record<string, unknown>[]).map(shapeDoc)
    : MOCK_DOCUMENTS
  const projects = [...new Set(documents.map(d => d.project).filter(Boolean))]

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Documents</h2>
        <p className="text-sm text-slate-500 mt-0.5">{documents.length} files shared with you</p>
      </div>

      {/* Group by project */}
      {[...projects, null].map(proj => {
        const docs = documents.filter(d => d.project === proj)
        if (!docs.length) return null
        return (
          <div key={proj ?? 'general'}>
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen className="w-4 h-4 text-slate-400" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {proj ?? 'General'}
              </p>
            </div>
            <Card padding="none">
              <ul className="divide-y divide-slate-50">
                {docs.map(doc => (
                  <li key={doc.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{doc.title}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                        <Badge variant={TYPE_VARIANT[doc.type] ?? 'neutral'} size="sm">{doc.type}</Badge>
                        <span>{doc.format}</span>
                        <span>{doc.size}</span>
                        <span>{fmtDate(doc.sharedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
