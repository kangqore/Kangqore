import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Briefcase, Kanban, Zap as Lightning, Truck, Receipt, FileText,
  User, AlertTriangle as Warning, Box as Cube, Plus, ArrowRight, Sparkles as Sparkle, Play, CheckCircle,
  Users, Building, Scroll, Laptop, AppWindow, Server, Siren, Workflow, MapPin, Shield, Scale, Target,
  Search, Puzzle, LayoutTemplate, Network
} from 'lucide-react'
import { api } from '@lib/api'

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase, Kanban, Lightning, Truck, Receipt, FileText, User, Warning, Cube, CheckCircle,
  Users, Building, Scroll, Laptop, AppWindow, Server, Siren, Workflow, MapPin, Shield, Scale, Target
}

function TypeCard({ type }: { type: any }) {
  const Icon = ICON_MAP[type.icon] ?? Cube
  const color = type.color ?? '#6366f1'

  return (
    <Link
      to={`/kangqore-view/admin/ontology/objects?typeId=${type.id}`}
      className="os-card p-5 hover:border-[var(--os-accent)] transition-all group flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <ArrowRight
          size={14}
          className="text-[var(--os-text-2)] opacity-0 group-hover:opacity-100 transition-opacity mt-1"
        />
      </div>

      <div>
        <p className="text-sm font-bold text-[var(--os-text-1)]">{type.displayName}</p>
        {type.description && (
          <p className="text-[11px] text-[var(--os-text-2)] mt-0.5 leading-relaxed line-clamp-2">
            {type.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-[var(--os-border)]">
        <span className="text-[10px] text-[var(--os-text-2)]">
          <span className="font-bold text-[var(--os-text-1)]">{type._count?.instances ?? 0}</span> objects
        </span>
        <span className="text-[var(--os-border)]">·</span>
        <span className="text-[10px] text-[var(--os-text-2)]">
          <span className="font-bold text-[var(--os-text-1)]">{type._count?.actions ?? 0}</span> actions
        </span>
      </div>
    </Link>
  )
}

export function OntologyExplorer() {
  const qc = useQueryClient()
  const [seeded, setSeeded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['ontology-types'],
    queryFn: () => api.get('/admin/ontology/types').then(r => r.data),
  })

  const seed = useMutation({
    mutationFn: () => api.post('/admin/ontology/types/seed', {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ontology-types'] })
      setSeeded(true)
    },
  })

  const types: any[] = data?.types ?? []

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header & Semantic Search */}
      <section className="relative rounded-3xl overflow-hidden bg-black border border-white/10 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <Network className="w-6 h-6 text-[#579bfc]" />
            Enterprise Ontology Explorer
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-2xl">
            The semantic digital twin of the enterprise. Model your entire operating reality inside Kangqore.
          </p>
          
          <div className="mt-6 max-w-3xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Semantic Search: 'Find all active client contracts over $100k'..."
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-[#579bfc]/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#579bfc] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
              Query Graph
            </button>
          </div>
        </div>
      </section>

      {/* Core Ontology Objects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--os-text-1)]">Core Object Types</h3>
          {types.length === 0 && !isLoading && (
            <button
              onClick={() => seed.mutate()}
              disabled={seed.isPending || seeded}
              className="px-3 py-1.5 text-xs font-bold bg-[var(--os-accent)] text-white rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {seed.isPending ? 'Seeding...' : 'Seed Enterprise Objects'}
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-sm text-[var(--os-text-2)]">Loading types...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {types.map(type => (
              <TypeCard key={type.id} type={type} />
            ))}
          </div>
        )}
      </section>

      {/* Templates & Extensions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="os-card p-6 border-dashed border-2 hover:border-[#579bfc]/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[var(--os-text-1)]">Industry Ontologies</h3>
          </div>
          <p className="text-sm text-[var(--os-text-2)] mb-4">
            Deploy pre-built semantic structures for Healthcare, Financial Services, SaaS Engineering, and Manufacturing.
          </p>
          <div className="text-xs font-bold text-blue-500 group-hover:underline">Browse Templates →</div>
        </div>

        <div className="os-card p-6 border-dashed border-2 hover:border-[#f59e0b]/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <Puzzle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[var(--os-text-1)]">Customer Extensions</h3>
          </div>
          <p className="text-sm text-[var(--os-text-2)] mb-4">
            Define custom object types, properties, and relationship rules unique to your operating reality.
          </p>
          <div className="text-xs font-bold text-amber-500 group-hover:underline">Create Custom Object →</div>
        </div>

      </section>
    </div>
  )
}
