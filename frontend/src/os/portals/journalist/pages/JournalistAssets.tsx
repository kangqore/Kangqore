import { useState } from 'react'
import { Download, Image, FileText, Film, Palette, CheckCircle } from 'lucide-react'

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
  { name: 'Deep Navy',      hex: '#151C2F', cls: 'bg-os-s1'      },
  { name: 'Pure White',     hex: '#ffffff', cls: 'bg-white'      },
]

const FILTERS: AssetCategory[] = ['All', 'Logos', 'Photography', 'Documents', 'Guidelines']

export function JournalistAssets() {
  const [filter, setFilter] = useState<AssetCategory>('All')
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set())

  const visible = filter === 'All' ? ASSETS : ASSETS.filter(a => a.cat === filter)

  function handleDownload(id: string) {
    setDownloaded(prev => new Set([...prev, id]))
  }

  return (
    <div className="px-6 lg:px-10 py-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Press Assets</h1>
        <p className="text-slate-500 mt-1 text-sm">Brand assets for verified press and media use. Please review the editorial guidelines before publishing.</p>
      </div>

      {/* Usage note */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
        All assets are licensed for editorial press use only. Modifications to logos or brand marks are not permitted without written approval from <a href="mailto:press@kangqore.com" className="underline">press@kangqore.com</a>.
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
                : 'bg-os-s1 border border-os-border text-slate-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Assets grid */}
      <div className="grid sm:grid-cols-2 gap-3">
        {visible.map(({ id, icon: Icon, title, desc, format, size }) => (
          <div key={id} className="flex items-center gap-3 p-4 rounded-2xl border border-os-border bg-os-s1 hover:bg-os-s2 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-pink-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{title}</p>
              <p className="text-slate-500 text-xs truncate">{desc}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-os-s2 text-slate-400">{format}</span>
                <span className="text-[10px] text-slate-500">{size}</span>
              </div>
            </div>
            <button
              onClick={() => handleDownload(id)}
              className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                downloaded.has(id)
                  ? 'bg-os-success/10 text-os-success'
                  : 'bg-os-s2 text-slate-400 hover:text-white hover:bg-pink-600'
              }`}
            >
              {downloaded.has(id)
                ? <CheckCircle className="w-4 h-4" />
                : <Download className="w-4 h-4" />
              }
            </button>
          </div>
        ))}
      </div>

      {/* Brand palette */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Brand Palette</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PALETTE.map(({ name, hex, cls }) => (
            <div key={name} className="rounded-xl border border-os-border overflow-hidden">
              <div className={`h-14 w-full ${cls}`} />
              <div className="p-2.5 bg-os-s1">
                <p className="text-xs font-semibold text-slate-200">{name}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
