import { useState } from 'react'
import {
  FileText, Download, Eye, Lock, Search,
  LayoutGrid, List, FileCode, FileImage, Shield,
} from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'
import { useClientDocuments } from '../useClientData'

type DocCategory = 'contract' | 'report' | 'design' | 'technical' | 'compliance'

interface Document {
  id: string; name: string; category: DocCategory
  project: string; date: string; size: string; confidential: boolean
}

const DOCUMENTS: Document[] = [
  { id: 'd1',  name: 'Master Services Agreement — Synapse Health.pdf',  category: 'contract',   project: 'All Projects',        date: '2026-02-10', size: '1.2 MB', confidential: true  },
  { id: 'd2',  name: 'SOW — Patient Portal v2.pdf',                     category: 'contract',   project: 'Patient Portal v2',   date: '2026-02-28', size: '0.8 MB', confidential: true  },
  { id: 'd3',  name: 'SOW — HIPAA Compliance Layer.pdf',                category: 'contract',   project: 'HIPAA Compliance',    date: '2026-03-25', size: '0.6 MB', confidential: true  },
  { id: 'd4',  name: 'Sprint 12 — Progress Report.pdf',                 category: 'report',     project: 'Patient Portal v2',   date: '2026-05-30', size: '2.1 MB', confidential: false },
  { id: 'd5',  name: 'Sprint 11 — Progress Report.pdf',                 category: 'report',     project: 'Patient Portal v2',   date: '2026-05-16', size: '1.9 MB', confidential: false },
  { id: 'd6',  name: 'HIPAA Audit Report — Phase 2.pdf',                category: 'compliance', project: 'HIPAA Compliance',    date: '2026-05-27', size: '3.4 MB', confidential: true  },
  { id: 'd7',  name: 'Patient Portal — UI Designs v3.fig',              category: 'design',     project: 'Patient Portal v2',   date: '2026-04-28', size: '18 MB',  confidential: false },
  { id: 'd8',  name: 'Patient Portal — Architecture Diagram.pdf',       category: 'technical',  project: 'Patient Portal v2',   date: '2026-03-22', size: '1.5 MB', confidential: false },
  { id: 'd9',  name: 'Analytics Dashboard — Requirements Doc.pdf',      category: 'technical',  project: 'Analytics Dashboard', date: '2026-05-12', size: '0.9 MB', confidential: false },
  { id: 'd10', name: 'Data Processing Agreement.pdf',                   category: 'contract',   project: 'All Projects',        date: '2026-02-10', size: '0.4 MB', confidential: true  },
]

const CAT: Record<DocCategory, { label: string; color: string; icon: React.ElementType }> = {
  contract:   { label: 'Contract',   color: '#579bfc', icon: FileText   },
  report:     { label: 'Report',     color: '#00c875', icon: FileText   },
  design:     { label: 'Design',     color: '#7f53f9', icon: FileImage  },
  technical:  { label: 'Technical',  color: '#c5c7d0', icon: FileCode   },
  compliance: { label: 'Compliance', color: '#e2445c', icon: Shield     },
}

const FOLDERS = [
  { label: 'Contracts & SOWs',   count: 4, category: 'contract'   as DocCategory },
  { label: 'Progress Reports',   count: 2, category: 'report'     as DocCategory },
  { label: 'Design Assets',      count: 1, category: 'design'     as DocCategory },
  { label: 'Technical Docs',     count: 2, category: 'technical'  as DocCategory },
  { label: 'Compliance & Legal', count: 2, category: 'compliance' as DocCategory },
]

export function ClientDocuments() {
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<DocCategory | 'all'>('all')

  const { data: apiDocs } = useClientDocuments()
  const allDocs: Document[] = (apiDocs as Record<string, unknown>[] | undefined)?.length
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

  const visible = allDocs
    .filter(d => catFilter === 'all' || d.category === catFilter)
    .filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.project.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Documents" />

      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Documents & Deliverables</h2>
        <p className="text-[10px] uppercase tracking-widest font-semibold mt-1" style={{ color: 'var(--os-text-2)' }}>{allDocs.length} files shared across your engagement</p>
      </div>

      {/* Folder quick-access */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {FOLDERS.map(f => {
          const cfg = CAT[f.category]
          const Icon = cfg.icon
          const active = catFilter === f.category
          return (
            <button
              key={f.label}
              onClick={() => setCatFilter(active ? 'all' : f.category)}
              className="rounded-2xl p-5 text-left transition-all duration-150 hover:-translate-y-px"
              style={{
                background: active ? cfg.color : 'var(--os-card)',
                border: active ? `2px solid ${cfg.color}` : '1px solid var(--os-border)',
                boxShadow: active ? `0 4px 20px ${cfg.color}35` : 'var(--os-shadow-card)',
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: active ? 'rgba(255,255,255,0.25)' : cfg.color }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold leading-tight" style={{ color: active ? '#fff' : 'var(--os-text-1)' }}>{f.label}</p>
              <p className="text-[10px] mt-1.5" style={{ color: active ? 'rgba(255,255,255,0.7)' : 'var(--os-text-3)' }}>{f.count} files</p>
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--os-text-3)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl outline-none transition-all"
            style={{
              background: 'var(--os-surface)',
              border: '1px solid var(--os-border)',
              color: 'var(--os-text-1)',
            }}
            onFocus={e => { (e.target as HTMLElement).style.borderColor = '#579bfc' }}
            onBlur={e => { (e.target as HTMLElement).style.borderColor = 'var(--os-border)' }}
          />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 p-1 rounded-xl" style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)' }}>
          {([['list', List], ['grid', LayoutGrid]] as const).map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v)}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
              style={{
                background: view === v ? '#579bfc' : 'transparent',
                color: view === v ? '#fff' : 'var(--os-text-2)',
              }}>
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
        {catFilter !== 'all' && (
          <button onClick={() => setCatFilter('all')}
            className="text-xs font-bold px-3 py-2 rounded-full transition-colors"
            style={{ background: '#579bfc', color: '#fff' }}>
            Clear filter ✕
          </button>
        )}
        <span className="text-xs flex-shrink-0" style={{ color: 'var(--os-text-3)' }}>{visible.length} of {allDocs.length} files</span>
      </div>

      {/* Document list */}
      {view === 'list' ? (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--os-border)', boxShadow: 'var(--os-shadow-card)' }}>
          {visible.length === 0 ? (
            <div className="py-14 text-center text-sm" style={{ background: 'var(--os-card)', color: 'var(--os-text-2)' }}>
              No documents match your search.
            </div>
          ) : visible.map((doc, i) => {
            const cfg = CAT[doc.category]
            const CatIcon = cfg.icon
            return (
              <div key={doc.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                style={{
                  background: 'var(--os-card)',
                  borderBottom: i < visible.length - 1 ? '1px solid var(--os-border)' : 'none',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--os-surface)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--os-card)' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: cfg.color }}>
                  <CatIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--os-text-1)' }}>{doc.name}</p>
                    {doc.confidential && <Lock className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--os-text-3)' }} />}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--os-text-2)' }}>{doc.project} · {doc.date} · {doc.size}</p>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full hidden sm:block flex-shrink-0"
                  style={{ background: cfg.color, color: '#fff' }}>
                  {cfg.label}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: 'var(--os-text-3)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--os-surface)'; (e.currentTarget as HTMLElement).style.color = 'var(--os-text-1)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--os-text-3)' }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: 'var(--os-text-3)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--os-surface)'; (e.currentTarget as HTMLElement).style.color = 'var(--os-text-1)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--os-text-3)' }}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(doc => {
            const cfg = CAT[doc.category]
            const CatIcon = cfg.icon
            return (
              <div
                key={doc.id}
                className="rounded-2xl p-4 transition-all duration-150 hover:-translate-y-px"
                style={{
                  background: 'var(--os-card)',
                  border: '1px solid var(--os-border)',
                  boxShadow: 'var(--os-shadow-card)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = cfg.color }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--os-border)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: cfg.color }}>
                    <CatIcon className="w-5 h-5 text-white" />
                  </div>
                  {doc.confidential && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#e2445c' }}>
                      <Lock className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold leading-tight line-clamp-2 mb-1" style={{ color: 'var(--os-text-1)' }}>{doc.name}</p>
                <p className="text-[10px] mb-3" style={{ color: 'var(--os-text-2)' }}>{doc.date} · {doc.size}</p>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--os-border)' }}>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: cfg.color, color: '#fff' }}>
                    {cfg.label}
                  </span>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                      style={{ color: 'var(--os-text-3)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--os-text-1)'; (e.currentTarget as HTMLElement).style.background = 'var(--os-surface)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--os-text-3)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                      style={{ color: 'var(--os-text-3)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--os-text-1)'; (e.currentTarget as HTMLElement).style.background = 'var(--os-surface)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--os-text-3)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
