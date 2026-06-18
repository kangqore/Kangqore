import { FileText, Download, Eye, Lock, FolderOpen } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Button } from '@design-system/components/Button'
import { useClientDocuments } from '../useClientData'

type DocCategory = 'contract' | 'report' | 'design' | 'technical' | 'compliance'

interface Document {
  id: string
  name: string
  category: DocCategory
  project: string
  date: string
  size: string
  confidential: boolean
}

const DOCUMENTS: Document[] = [
  { id: 'd1',  name: 'Master Services Agreement — Synapse Health.pdf',  category: 'contract',   project: 'All Projects',             date: '2026-02-10', size: '1.2 MB', confidential: true  },
  { id: 'd2',  name: 'SOW — Patient Portal v2.pdf',                     category: 'contract',   project: 'Patient Portal v2',        date: '2026-02-28', size: '0.8 MB', confidential: true  },
  { id: 'd3',  name: 'SOW — HIPAA Compliance Layer.pdf',                category: 'contract',   project: 'HIPAA Compliance',         date: '2026-03-25', size: '0.6 MB', confidential: true  },
  { id: 'd4',  name: 'Sprint 12 — Progress Report.pdf',                 category: 'report',     project: 'Patient Portal v2',        date: '2026-05-30', size: '2.1 MB', confidential: false },
  { id: 'd5',  name: 'Sprint 11 — Progress Report.pdf',                 category: 'report',     project: 'Patient Portal v2',        date: '2026-05-16', size: '1.9 MB', confidential: false },
  { id: 'd6',  name: 'HIPAA Audit Report — Phase 2.pdf',                category: 'compliance', project: 'HIPAA Compliance',         date: '2026-05-27', size: '3.4 MB', confidential: true  },
  { id: 'd7',  name: 'Patient Portal — UI Designs v3.fig',              category: 'design',     project: 'Patient Portal v2',        date: '2026-04-28', size: '18 MB',  confidential: false },
  { id: 'd8',  name: 'Patient Portal — Architecture Diagram.pdf',       category: 'technical',  project: 'Patient Portal v2',        date: '2026-03-22', size: '1.5 MB', confidential: false },
  { id: 'd9',  name: 'Analytics Dashboard — Requirements Doc.pdf',      category: 'technical',  project: 'Analytics Dashboard',      date: '2026-05-12', size: '0.9 MB', confidential: false },
  { id: 'd10', name: 'Data Processing Agreement.pdf',                   category: 'contract',   project: 'All Projects',             date: '2026-02-10', size: '0.4 MB', confidential: true  },
]

const CATEGORY_CONFIG: Record<DocCategory, { label: string; color: string }> = {
  contract:   { label: 'Contract',   color: 'bg-blue-50 text-blue-700'   },
  report:     { label: 'Report',     color: 'bg-green-50 text-green-700' },
  design:     { label: 'Design',     color: 'bg-purple-50 text-purple-700'},
  technical:  { label: 'Technical',  color: 'bg-[#151C2F] text-slate-300' },
  compliance: { label: 'Compliance', color: 'bg-red-50 text-red-700'     },
}

const FOLDERS: { label: string; count: number; icon: string }[] = [
  { label: 'Contracts & SOWs',   count: 4, icon: '📄' },
  { label: 'Progress Reports',   count: 2, icon: '📊' },
  { label: 'Design Assets',      count: 1, icon: '🎨' },
  { label: 'Technical Docs',     count: 2, icon: '⚙️' },
  { label: 'Compliance & Legal', count: 2, icon: '🔒' },
]

export function ClientDocuments() {
  const { data: apiDocs } = useClientDocuments()

  const documents = (apiDocs as Record<string, unknown>[] | undefined)?.length
    ? (apiDocs as Record<string, unknown>[]).map(d => ({
        id:           String(d.id),
        name:         String(d.name ?? d.fileName ?? d.title ?? 'Document'),
        category:     (['contract','report','design','technical','compliance'].includes(String(d.category ?? '').toLowerCase())
                        ? String(d.category).toLowerCase()
                        : 'technical') as DocCategory,
        project:      String((d.project as Record<string,unknown>)?.title ?? d.projectName ?? 'General'),
        date:         String(d.createdAt ?? d.uploadedAt ?? '').slice(0, 10),
        size:         String(d.fileSize ?? '—'),
        confidential: Boolean(d.confidential ?? d.isPrivate ?? false),
      }))
    : DOCUMENTS
  return (
    <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Documents & Deliverables</h2>
        <p className="text-sm text-slate-500 mt-1">All shared files, contracts, reports, and assets for your engagement.</p>
      </div>

      {/* Folder quick-access */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {FOLDERS.map(f => (
          <button key={f.label} className="bg-[#151C2F] border border-[#2E2854] rounded-xl p-4 text-left hover:border-blue-300 hover:bg-blue-50/30 transition-all">
            <span className="text-2xl mb-2 block">{f.icon}</span>
            <p className="text-sm font-medium text-white leading-tight">{f.label}</p>
            <p className="text-xs text-slate-500 mt-1">{f.count} files</p>
          </button>
        ))}
      </div>

      {/* All documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-blue-500" />
            All Documents ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-[#2E2854]">
            {documents.map(doc => {
              const cfg = CATEGORY_CONFIG[doc.category]
              return (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#0F172A] transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#151C2F] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                      {doc.confidential && <Lock className="w-3 h-3 text-slate-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.project} · {doc.date} · {doc.size}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:block ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" title="Preview">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Download">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
