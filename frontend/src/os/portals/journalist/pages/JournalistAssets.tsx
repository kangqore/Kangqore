import { useState } from 'react'
import { Download, Image, FileText, Palette, CheckCircle, AlertTriangle } from 'lucide-react'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

type AssetCategory = 'All' | 'Logos' | 'Photography' | 'Documents' | 'Guidelines'

const ASSETS = [
  // Logos
  { id: 'a1', cat: 'Logos',       icon: Image,    title: 'Primary Logo — Full Colour',     desc: 'SVG + PNG (transparent bg)',       format: 'SVG/PNG', size: '2.1 MB' },
  { id: 'a2', cat: 'Logos',       icon: Image,    title: 'Primary Logo — White',            desc: 'For dark backgrounds',             format: 'SVG/PNG', size: '1.8 MB' },
  { id: 'a3', cat: 'Logos',       icon: Image,    title: 'Icon Mark Only',                  desc: 'Square icon, all variants',        format: 'SVG/PNG', size: '0.9 MB' },
  { id: 'a4', cat: 'Logos',       icon: Image,    title: 'Logo Pack (All Variants)',         desc: 'Full ZIP — all sizes & formats',   format: 'ZIP',     size: '18 MB'  },
  // Photography
  { id: 'a5', cat: 'Photography', icon: Image,    title: 'Team Photography Pack',           desc: 'Leadership headshots, hi-res',     format: 'ZIP',     size: '34 MB'  },
  { id: 'a6', cat: 'Photography', icon: Image,    title: 'Office & Culture Photos',         desc: '12 images, editorial licence',     format: 'ZIP',     size: '48 MB'  },
  { id: 'a7', cat: 'Photography', icon: Image,    title: 'Product Screenshots',             desc: 'BIDS™ platform UI, 2026',          format: 'ZIP',     size: '22 MB'  },
  // Documents
  { id: 'a8', cat: 'Documents',   icon: FileText, title: 'Press Kit',                       desc: 'Company overview, boilerplate',    format: 'PDF',     size: '4.2 MB' },
  { id: 'a9', cat: 'Documents',   icon: FileText, title: 'Executive Bios',                  desc: 'Leadership profiles & headshots',  format: 'PDF',     size: '3.1 MB' },
  { id: 'a10',cat: 'Documents',   icon: FileText, title: 'BIDS™ Product Sheet',              desc: 'One-pager, capabilities',          format: 'PDF',     size: '1.6 MB' },
  { id: 'a11',cat: 'Documents',   icon: FileText, title: 'Corporate Fact Sheet',             desc: 'Key stats, founding story',        format: 'PDF',     size: '0.8 MB' },
  // Guidelines
  { id: 'a12',cat: 'Guidelines',  icon: Palette,  title: 'Brand Guidelines',                desc: 'Full brand manual, colour values', format: 'PDF',     size: '12 MB'  },
  { id: 'a13',cat: 'Guidelines',  icon: Palette,  title: 'Editorial Style Guide',           desc: 'Tone, naming conventions',         format: 'PDF',     size: '2.4 MB' },
]

const PALETTE = [
  { name: 'Kangqore Blue',  hex: '#2564ea', cls: 'bg-os-blue'    },
  { name: 'Signal Cyan',    hex: '#4ab6d4', cls: 'bg-os-cyan'    },
  { name: 'Deep Navy',      hex: 'var(--os-surface)', cls: ''      },
  { name: 'Pure White',     hex: '#ffffff', cls: 'bg-white'      },
]

const FILTERS: AssetCategory[] = ['All', 'Logos', 'Photography', 'Documents', 'Guidelines']

export function JournalistAssets() {
  const [filter, setFilter] = useState<AssetCategory>('All')
  const [requested, setRequested] = useState<Set<string>>(new Set())

  const visible = filter === 'All' ? ASSETS : ASSETS.filter(a => a.cat === filter)

  return (
    <div className="space-y-8">
      <KIMMPSignalBar module="Press Assets" />
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Press Assets</h1>
        <p className="text-[var(--os-text-2)] mt-1 text-sm">
          Sample asset listing — contact press@kangqore.com for actual files.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300 leading-relaxed">
          <span className="font-bold">SAMPLE LISTING — Files are not hosted here.</span> The assets shown are illustrative of what is available. To receive actual files, click the download icon to email the press team directly, or contact{' '}
          <a href="mailto:press@kangqore.com" className="underline">press@kangqore.com</a>. All assets are for editorial use only; modifications to logos require written approval.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === f
                ? 'bg-pink-600 text-white'
                : 'os-card text-[var(--os-text-2)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Assets grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {visible.map(({ id, icon: Icon, title, desc, format, size }) => (
          <div key={id} className="os-card flex items-center gap-3 p-4 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-pink-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--os-text-1)' }}>{title}</p>
              <p className="text-[var(--os-text-2)] text-xs truncate">{desc}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-[var(--os-text-2)]" style={{ background: 'var(--os-surface)', border: '1px solid var(--os-border)' }}>{format}</span>
                <span className="text-[10px] text-[var(--os-text-2)]">{size}</span>
              </div>
            </div>
            <a
              href={`mailto:press@kangqore.com?subject=Asset+Request:+${encodeURIComponent(title)}`}
              onClick={() => setRequested(prev => new Set([...prev, id]))}
              title="Request this asset via email"
              className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                requested.has(id)
                  ? 'bg-[#00c875]/10 text-[#00c875]'
                  : 'text-[var(--os-text-2)] hover:text-white hover:bg-pink-600'
              }`}
            >
              {requested.has(id)
                ? <CheckCircle className="w-4 h-4" />
                : <Download className="w-4 h-4" />
              }
            </a>
          </div>
        ))}
      </div>

      {/* Brand palette */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--os-text-2)] uppercase tracking-wider mb-4">Brand Palette</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PALETTE.map(({ name, hex, cls }) => (
            <div key={name} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--os-border)' }}>
              <div className={`h-14 w-full ${cls}`} />
              <div className="p-2.5" style={{ background: 'var(--os-surface)', borderTop: '1px solid var(--os-border)' }}>
                <p className="text-xs font-semibold text-[var(--os-text-1)]">{name}</p>
                <p className="text-[10px] text-[var(--os-text-2)] font-mono mt-0.5">{hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
