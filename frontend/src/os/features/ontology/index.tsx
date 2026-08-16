import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Network, Boxes, GitBranch, Shield, GitMerge, Cpu, Package, Zap, ScrollText, ShieldCheck, HourglassIcon, MapPin, Workflow, Terminal, UploadCloud } from 'lucide-react'
import { cn } from '@design-system/cn'
import { OntologyExplorer }       from './pages/OntologyExplorer'
import { OntologyGraphExplorer }  from './pages/OntologyGraphExplorer'
import { OntologyObjects }        from './pages/OntologyObjects'
import { ObjectSetsPage }         from './pages/ObjectSetsPage'
import { ActionsPage }            from './pages/ActionsPage'
import { ActionExecutionPage }    from './pages/ActionExecutionPage'
import { PolicyGatePage }         from './pages/PolicyGatePage'
import { PendingApprovalsPage }   from './pages/PendingApprovalsPage'
import { MapViewPage }            from './pages/MapViewPage'
import { PipelineDashboardPage }  from './pages/PipelineDashboardPage'
import { MigrationAcceleratorPage } from './pages/MigrationAcceleratorPage'
import { DeveloperPortalPage }    from './pages/DeveloperPortalPage'
import { LineageViewer }          from './pages/LineageViewer'
import { MarkingsManager }        from './pages/MarkingsManager'
import { OntologyVersioningPage } from './pages/OntologyVersioningPage'
import { KoreTypesPage }          from './pages/KoreTypesPage'
import ActionLibraryPage           from './pages/ActionLibraryPage'

const TABS = [
  { path: 'explorer',       label: 'Directory',           icon: Boxes        },
  { path: 'graph',          label: 'Graph Explorer',      icon: Network      },
  { path: 'objects',        label: 'Objects',             icon: Boxes        },
  { path: 'object-sets',    label: 'Object Sets',         icon: Package      },
  { path: 'action-library', label: 'Action Library',      icon: Zap          },
  { path: 'actions',        label: 'Actions',             icon: Zap          },
  { path: 'executions',     label: 'Execution Log',       icon: ScrollText   },
  { path: 'policy-gate',    label: 'Policy Gate',         icon: ShieldCheck  },
  { path: 'approvals',      label: 'Approvals',           icon: HourglassIcon },
  { path: 'map',            label: 'Map View',            icon: MapPin       },
  { path: 'pipelines',      label: 'Pipelines',           icon: Workflow     },
  { path: 'migration',      label: 'Migration Accelerator', icon: UploadCloud },
  { path: 'developer',      label: 'Developer',           icon: Terminal     },
  { path: 'lineage',        label: 'Lineage',             icon: GitBranch    },
  { path: 'markings',       label: 'Markings',            icon: Shield       },
  { path: 'versioning',     label: 'Versioning',          icon: GitMerge     },
  { path: 'kore-types',     label: 'KORE Types',          icon: Cpu          },
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
        <Route path="graph"        element={<OntologyGraphExplorer />}         />
        <Route path="objects"      element={<OntologyObjects />}               />
        <Route path="object-sets"  element={<ObjectSetsPage />}                />
        <Route path="action-library" element={<ActionLibraryPage />}              />
        <Route path="actions"      element={<ActionsPage />}                   />
        <Route path="executions"   element={<ActionExecutionPage />}           />
        <Route path="policy-gate"  element={<PolicyGatePage />}                />
        <Route path="approvals"    element={<PendingApprovalsPage />}          />
        <Route path="map"          element={<MapViewPage />}                   />
        <Route path="pipelines"    element={<PipelineDashboardPage />}         />
        <Route path="migration"    element={<MigrationAcceleratorPage />}      />
        <Route path="developer"    element={<DeveloperPortalPage />}           />
        <Route path="lineage"      element={<LineageViewer />}                 />
        <Route path="markings"     element={<MarkingsManager />}               />
        <Route path="versioning"   element={<OntologyVersioningPage />}        />
        <Route path="kore-types"   element={<KoreTypesPage />}                 />
        <Route path="*"            element={<Navigate to="explorer" replace />} />
      </Routes>
    </div>
  )
}
