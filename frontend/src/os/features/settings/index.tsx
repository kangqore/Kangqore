import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Calendar, Link2, Mail, Globe, GitBranch } from 'lucide-react'
import { cn } from '@design-system/cn'
import { CalendarSettingsPage } from './pages/CalendarSettingsPage'
import { WebhooksSettingsPage }  from './pages/WebhooksSettingsPage'
import { EmailTemplatesPage }    from './pages/EmailTemplatesPage'
import { CustomDomainsPage }     from './pages/CustomDomainsPage'

const TABS = [
  { path: 'calendar',        label: 'Calendar',        icon: Calendar  },
  { path: 'webhooks',        label: 'Webhooks',        icon: Link2     },
  { path: 'email-templates', label: 'Email Templates', icon: Mail      },
  { path: 'custom-domains',  label: 'Custom Domains',  icon: Globe     },
  { path: 'workflows',       label: 'Workflows',       icon: GitBranch },
]

export function SettingsModule() {
  return (
    <div>
      <div className="mb-6 -mt-2">
        <h1 className="text-lg font-bold text-slate-900 mb-4">Settings</h1>
        <div className="flex items-center gap-1 border-b border-slate-200">
          {TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={`/kangqore-view/settings/${tab.path}`}
              className={({ isActive }) => cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap',
                isActive
                  ? 'border-[#2564ea] text-[#2564ea]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      <Routes>
        <Route index                    element={<Navigate to="calendar" replace />}         />
        <Route path="calendar"          element={<CalendarSettingsPage />}                   />
        <Route path="webhooks"          element={<WebhooksSettingsPage />}                   />
        <Route path="email-templates"   element={<EmailTemplatesPage />}                     />
        <Route path="custom-domains"    element={<CustomDomainsPage />}                      />
        {/* Workflows is a full OS module — redirect there */}
        <Route path="workflows"         element={<Navigate to="/kangqore-view/workflows" replace />}    />
        <Route path="*"                 element={<Navigate to="/kangqore-view/settings/calendar" replace />} />
      </Routes>
    </div>
  )
}
