import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Shield, List, Zap, BookOpen, ShieldOff, ArrowUpRight, FileText, Bot, ClipboardCheck, Radio, ShieldAlert, Wallet, ShieldCheck } from 'lucide-react'
import { cn } from '@design-system/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { AegisOverviewPage }       from './pages/AegisOverviewPage'
import { AegisAuditPage }          from './pages/AegisAuditPage'
import { AegisAutonomyPage }       from './pages/AegisAutonomyPage'
import { AegisAssetsPage }         from './pages/AegisAssetsPage'
import { AegisShieldPage }         from './pages/AegisShieldPage'
import { AegisEgressPage }         from './pages/AegisEgressPage'
import { AegisPolicyPage }         from './pages/AegisPolicyPage'
import { AegisAgentsPage }         from './pages/AegisAgentsPage'
import { AegisCompliancePage }     from './pages/AegisCompliancePage'
import { AegisLiveFeedPage }       from './pages/AegisLiveFeedPage'
import { SecurityFindingsPage }    from './pages/SecurityFindingsPage'
import { AiSecurityViewPage }      from './pages/AiSecurityViewPage'
import { AegisPermissionsPage }    from './pages/AegisPermissionsPage'
import { AegisBudgetPage }         from './pages/AegisBudgetPage'
import { EnterpriseTrustView }     from './pages/EnterpriseTrustView'

const BASE = '/kangqore-view/admin/aegis'

const TABS = [
  { path: '',             end: true,  label: 'Overview',    icon: Shield         },
  { path: 'trust',        end: false, label: 'Trust Center',icon: ShieldCheck      },
  { path: 'live',         end: false, label: 'Live Feed',   icon: Radio          },
  { path: 'agents',       end: false, label: 'Agents',      icon: Bot            },
  { path: 'compliance',   end: false, label: 'Compliance',  icon: ClipboardCheck },
  { path: 'audit',        end: false, label: 'Audit',       icon: List           },
  { path: 'permissions',  end: false, label: 'Permissions', icon: Shield         },
  { path: 'autonomy',     end: false, label: 'Autonomy',    icon: Zap            },
  { path: 'assets',       end: false, label: 'Assets',      icon: BookOpen       },
  { path: 'egress',       end: false, label: 'Egress',      icon: ArrowUpRight   },
  { path: 'shield',       end: false, label: 'Shield',      icon: ShieldOff      },
  { path: 'policy',       end: false, label: 'Policy',      icon: FileText       },
  { path: 'findings',     end: false, label: 'Findings',    icon: ShieldAlert    },
  { path: 'enforcement',  end: false, label: 'Enforcement', icon: Wallet         },
]

export function AegisModule() {
  const { pathname } = useLocation()

  return (
    <div>
      <div className="mb-6 -mt-2">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-[#e2445c]" />
          <h1 className="text-sm font-bold text-[var(--os-text-1)] uppercase tracking-widest">AEGIS</h1>
          <span className="text-[10px] text-[var(--os-text-2)] font-mono ml-1 hidden sm:block">Autonomous Executive Governance & Intelligence Shield</span>
        </div>
        <div className="flex items-center gap-0.5 border-b border-[var(--os-border)] overflow-x-auto scrollbar-none">
          {TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path === '' ? BASE : `${BASE}/${tab.path}`}
              end={tab.end}
              className={({ isActive }) => cn(
                'flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap flex-shrink-0',
                isActive
                  ? 'border-[#e2445c] text-[#e2445c]'
                  : 'border-transparent text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <Routes>
            <Route index element={<AegisOverviewPage />} />
            <Route path="trust" element={<EnterpriseTrustView />} />
            <Route path="live" element={<AegisLiveFeedPage />} />
            <Route path="agents"          element={<AegisAgentsPage />}      />
            <Route path="compliance"      element={<AegisCompliancePage />}  />
            <Route path="audit"           element={<AegisAuditPage />}       />
            <Route path="autonomy"        element={<AegisAutonomyPage />}    />
            <Route path="assets"          element={<AegisAssetsPage />}      />
            <Route path="egress"          element={<AegisEgressPage />}      />
            <Route path="shield"          element={<AegisShieldPage />}      />
            <Route path="policy"          element={<AegisPolicyPage />}         />
            <Route path="permissions"     element={<AegisPermissionsPage />}    />
            <Route path="live"            element={<AegisLiveFeedPage />}       />
            <Route path="findings"        element={<SecurityFindingsPage />}    />
            <Route path="ai-security-view" element={<AiSecurityViewPage />}     />
            <Route path="enforcement"     element={<AegisBudgetPage />}          />
            <Route path="*"               element={<Navigate to={BASE} replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
