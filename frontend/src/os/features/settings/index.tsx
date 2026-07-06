import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Calendar, Link2, Mail, Globe, User, Shield, ShieldCheck, Code2, Building2, Plug, GitMerge, Package } from 'lucide-react'
import { cn } from '@design-system/cn'
import { ProfilePage }           from './pages/ProfilePage'
import { CalendarSettingsPage } from './pages/CalendarSettingsPage'
import { WebhooksSettingsPage }  from './pages/WebhooksSettingsPage'
import { EmailTemplatesPage }    from './pages/EmailTemplatesPage'
import { CustomDomainsPage }     from './pages/CustomDomainsPage'
import { DataPrivacyPage }       from './pages/DataPrivacyPage'
import { DeveloperPage }         from './pages/DeveloperPage'
import { OrganizationPage }      from './pages/OrganizationPage'
import { IntegrationsPage }      from './pages/IntegrationsPage'
import { PoliciesPage }          from './pages/PoliciesPage'
import { SemanticMappingPage }   from './pages/SemanticMappingPage'
import { PacksPage }             from './pages/PacksPage'
import { AnimatePresence, motion } from 'framer-motion'

const TABS = [
  { path: 'profile',         label: 'Profile',         icon: User      },
  { path: 'calendar',        label: 'Calendar',        icon: Calendar  },
  { path: 'webhooks',        label: 'Webhooks',        icon: Link2     },
  { path: 'email-templates', label: 'Email Templates', icon: Mail      },
  { path: 'custom-domains',  label: 'Custom Domains',  icon: Globe     },
  { path: 'data-privacy',    label: 'Data & Privacy',  icon: Shield    },
  { path: 'developer',       label: 'Developer',       icon: Code2     },
  { path: 'organization',    label: 'Organisation',    icon: Building2 },
  { path: 'integrations',   label: 'Integrations',    icon: Plug        },
  { path: 'policies',         label: 'Policies',          icon: ShieldCheck },
  { path: 'semantic-mapping', label: 'Semantic Mapping',  icon: GitMerge    },
  { path: 'packs',            label: 'Packs',             icon: Package     },
]

export function SettingsModule() {
  const { pathname } = useLocation()

  return (
    <div>
      <div className="mb-6 -mt-2">
        <h1 className="text-[22px] font-black tracking-tight mb-4" style={{ color: 'var(--os-text-1)' }}>Settings</h1>
        <div className="flex items-center gap-0.5 border-b border-[var(--os-border)]">
          {TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={`/kangqore-view/admin/settings/${tab.path}`}
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

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15,ease:'easeOut'}}>

        <Routes>
          <Route index                    element={<Navigate to="profile" replace />}           />
          <Route path="profile"           element={<ProfilePage />}                             />
          <Route path="calendar"          element={<CalendarSettingsPage />}                    />
          <Route path="webhooks"          element={<WebhooksSettingsPage />}                    />
          <Route path="email-templates"   element={<EmailTemplatesPage />}                      />
          <Route path="custom-domains"    element={<CustomDomainsPage />}                       />
          <Route path="data-privacy"      element={<DataPrivacyPage />}                         />
          <Route path="developer"         element={<DeveloperPage />}                           />
          <Route path="organization"      element={<OrganizationPage />}                        />
          <Route path="integrations"      element={<IntegrationsPage />}                        />
          <Route path="policies"          element={<PoliciesPage />}                            />
          <Route path="semantic-mapping"  element={<SemanticMappingPage />}                     />
          <Route path="packs"             element={<PacksPage />}                                />
          <Route path="*"                 element={<Navigate to="/kangqore-view/admin/settings/profile" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
