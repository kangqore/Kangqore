import { useLocation, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Calendar, Link2, Mail, Globe, User } from 'lucide-react'
import { cn } from '@design-system/cn'
import { ProfilePage }           from './pages/ProfilePage'
import { CalendarSettingsPage } from './pages/CalendarSettingsPage'
import { WebhooksSettingsPage }  from './pages/WebhooksSettingsPage'
import { EmailTemplatesPage }    from './pages/EmailTemplatesPage'
import { CustomDomainsPage }     from './pages/CustomDomainsPage'
import { AnimatePresence, motion } from 'framer-motion'

const TABS = [
  { path: 'profile',         label: 'Profile',         icon: User      },
  { path: 'calendar',        label: 'Calendar',        icon: Calendar  },
  { path: 'webhooks',        label: 'Webhooks',        icon: Link2     },
  { path: 'email-templates', label: 'Email Templates', icon: Mail      },
  { path: 'custom-domains',  label: 'Custom Domains',  icon: Globe     },
]

export function SettingsModule() {
  const { pathname } = useLocation()

  return (
    <div>
      <div className="mb-6 -mt-2">
        <h1 className="text-lg font-bold text-white mb-4">Settings</h1>
        <div className="flex items-center gap-1 border-b border-white/10 border-t-white/20">
          {TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={`/kangqore-view/admin/settings/${tab.path}`}
              className={({ isActive }) => cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap',
                isActive
                  ? 'border-os-blue text-os-blue'
                  : 'border-transparent text-slate-500 hover:text-slate-200 hover:border-white/10 border-t-white/20'
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
          <Route path="*"                 element={<Navigate to="/kangqore-view/admin/settings/profile" replace />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
