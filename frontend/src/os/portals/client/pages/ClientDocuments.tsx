import { useState } from 'react'
import {
  FileText, Download, Eye, Lock, Search,
  LayoutGrid, List, FileCode, FileImage, Shield,
} from 'lucide-react'
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
  contract:   { label: 'Contract',   color: '#2564ea', icon: FileText   },
  report:     { label: 'Report',     color: '#00c875', icon: FileText   },
  design:     { label: 'Design',     color: '#7f53f9', icon: FileImage  },
  technical:  { label: 'Technical',  color: '#64748b', icon: FileCode   },
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

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Documents & Deliverables</h2>
        <p className="text-sm text-slate-500 mt-1">{allDocs.length} files shared across your engagement.</p>
      </div>

      {/* Folder quick-access */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {FOLDERS.map(f => {
          const cfg = CAT[f.category]
          const Icon = cfg.icon
          const active = catFilter === f.category
          return (
            <button key={f.label}
              onClick={() => setCatFilter(active ? 'all' : f.category)}
              className="rounded-2xl p-5 text-left transition-all duration-150 group"
              style={{
                background: active
                  ? `linear-gradient(135deg, ${cfg.color}14 0%, ${cfg.color}08 100%)`
                  : '#0d1117',
                border: `1px solid ${active ? cfg.color + '40' : '#1f2a4a'}`,
                boxShadow: active ? `0 0 20px ${cfg.color}18` : 'none',
              }}
              onMouseEnter={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = `${cfg.color}30`
                  el.style.boxShadow = `0 4px 20px ${cfg.color}14`
                  el.style.background = `linear-gradient(135deg, ${cfg.color}08 0%, ${cfg.color}04 100%)`
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = '#1f2a4a'
                  el.style.boxShadow = 'none'
                  el.style.background = '#0d1117'
                }
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-150 group-hover:scale-110"
                style={{ background: `${cfg.color}18`, boxShadow: `0 0 12px ${cfg.color}20` }}>
                <Icon className="w-5 h-5" style={{ color: cfg.color } as React.CSSProperties} />
              </div>
              <p className="text-xs font-semibold text-white leading-tight">{f.label}</p>
              <p className="text-[10px] mt-1.5" style={{ color: cfg.color + 'aa' }}>{f.count} files</p>
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents…"
            className="w-full pl-9 pr-3 py-2 text-sm text-slate-300 rounded-xl outline-none transition-colors"
            style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(30, 41, 59, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}
            onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(37,100,234,0.5)' }}
            onBlur={e => { (e.target as HTMLElement).style.borderColor = '#1f2a4a' }}
          />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 p-1 rounded-xl" style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(30, 41, 59, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          {([['list', List], ['grid', LayoutGrid]] as const).map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v)}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
              style={{ background: view === v ? '#151C2F' : 'transparent',
                       color: view === v ? '#2564ea' : '#64748b' }}>
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
        {catFilter !== 'all' && (
          <button onClick={() => setCatFilter('all')}
            className="text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            style={{ background: 'rgba(37,100,234,0.08)', border: '1px solid rgba(37,100,234,0.2)', color: '#2564ea' }}>
            Clear filter ✕
          </button>
        )}
        <span className="text-xs text-slate-600 flex-shrink-0">{visible.length} of {allDocs.length} files</span>
      </div>

      {/* Document list */}
      {view === 'list' ? (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(30, 41, 59, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          {visible.length === 0 ? (
            <div className="py-14 text-center text-sm text-slate-500" style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)' }}>
              No documents match your search.
            </div>
          ) : visible.map((doc, i) => {
            const cfg = CAT[doc.category]
            const CatIcon = cfg.icon
            return (
              <div key={doc.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                style={{
                  background: i % 2 === 0 ? '#0d1117' : '#080c18',
                  borderBottom: i < visible.length - 1 ? '1px solid #1a2340' : 'none',
                }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}20` }}>
                  <CatIcon className="w-4 h-4" style={{ color: cfg.color } as React.CSSProperties} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                    {doc.confidential && <Lock className="w-3 h-3 text-slate-600 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{doc.project} · {doc.date} · {doc.size}</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full hidden sm:block flex-shrink-0"
                  style={{ color: cfg.color, background: `${cfg.color}14`, border: `1px solid ${cfg.color}25` }}>
                  {cfg.label}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 transition-colors"
                    style={{ border: '1px solid transparent' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#151C2F'; (e.currentTarget as HTMLElement).style.borderColor = '#2E2854' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent' }}>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 transition-colors"
                    style={{ border: '1px solid transparent' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#151C2F'; (e.currentTarget as HTMLElement).style.borderColor = '#2E2854' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent' }}>
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
              <div key={doc.id} className="rounded-2xl p-4 group transition-all duration-150"
                style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(32px) saturate(200%)', WebkitBackdropFilter: 'blur(32px) saturate(200%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(30, 41, 59, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${cfg.color}30` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1f2a4a' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}20` }}>
                    <CatIcon className="w-5 h-5" style={{ color: cfg.color } as React.CSSProperties} />
                  </div>
                  {doc.confidential && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: '#151C2F' }}>
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-1">{doc.name}</p>
                <p className="text-[10px] text-slate-500 mb-3">{doc.date} · {doc.size}</p>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #1a2340' }}>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: cfg.color, background: `${cfg.color}14` }}>
                    {cfg.label}
                  </span>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 transition-colors">
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
