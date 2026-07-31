import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Network, Boxes, GitBranch, Shield, GitMerge, Cpu, Package } from 'lucide-react'
import { cn } from '@design-system/cn'
import { OntologyExplorer }       from './pages/OntologyExplorer'
import { OntologyObjects }        from './pages/OntologyObjects'
import { ObjectSetsPage }         from './pages/ObjectSetsPage'
import { LineageViewer }          from './pages/LineageViewer'
import { MarkingsManager }        from './pages/MarkingsManager'
import { OntologyVersioningPage } from './pages/OntologyVersioningPage'
import { KoreTypesPage }          from './pages/KoreTypesPage'

const TABS = [
  { path: 'explorer',    label: 'Explorer',     icon: Network    },
  { path: 'objects',     label: 'Objects',      icon: Boxes      },
  { path: 'object-sets', label: 'Object Sets',  icon: Package    },
  { path: 'lineage',     label: 'Lineage',      icon: GitBranch  },
  { path: 'markings',    label: 'Markings',     icon: Shield     },
  { path: 'versioning',  label: 'Versioning',   icon: GitMerge   },
  { path: 'kore-types',  label: 'KORE Types',   icon: Cpu        },
]

export function OntologyModule() {
  const { pathname } = useLocation()

  return (
    <div>
      <div className="mb-6 -mt-2">
        <h1 className="text-[22px] font-black tracking-tight mb-4" style={{ color: 'var(--os-text-1)' }}>Ontology</h1>
        <div className="flex items-center gap-0.5 border-b border-[var(--os-border)]">
          {TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={`/kangqore-view/admin/ontology/${tab.path}`}
              className={({ isActive }) => cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap',
                isActive
                  ? 'border-[#579bfc] text-[#579bfc]'
                  : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      <Routes>
        <Route index               element={<Navigate to="explorer" replace />} />
        <Route path="explorer"     element={<OntologyExplorer />}              />
        <Route path="objects"      element={<OntologyObjects />}               />
        <Route path="object-sets"  element={<ObjectSetsPage />}                />
        <Route path="lineage"      element={<LineageViewer />}                 />
        <Route path="markings"     element={<MarkingsManager />}               />
        <Route path="versioning"   element={<OntologyVersioningPage />}        />
        <Route path="kore-types"   element={<KoreTypesPage />}                 />
        <Route path="*"            element={<Navigate to="explorer" replace />} />
      </Routes>
    </div>
  )
}
