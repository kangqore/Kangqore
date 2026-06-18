import {
  Target, LayoutDashboard, Users, DollarSign, Briefcase,
  Handshake, Zap, TrendingUp, GraduationCap, Megaphone,
  GitBranch, Building2, BarChart3, Brain, Settings, CalendarClock, Activity, Scale, Inbox, Radar, House,
  ScrollText, Server,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  path: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

const BASE = '/kangqore-view/admin'

export const HOME_NAV_ITEM: NavItem = {
  id: 'home',
  label: 'Home',
  icon: House,
  path: `${BASE}/home`,
}

export const navGroups: NavGroup[] = [
  {
    label: 'INTELLIGENCE',
    items: [
      { id: 'overview',      label: 'WAANDA',      icon: Radar,           path: `${BASE}/WAANDA`         },
      { id: 'kangqore-immp', label: 'KIMMP',        icon: Brain,           path: `${BASE}/kangqore-immp`  },
      { id: 'systems',       label: 'Systems',     icon: Server,          path: `${BASE}/systems`        },
      { id: 'agent-logs',    label: 'Agent Logs',  icon: ScrollText,      path: `${BASE}/agent-logs`     },
      { id: 'analytics',     label: 'Analytics',   icon: BarChart3,       path: `${BASE}/analytics`      },
    ],
  },
  {
    label: 'CRM',
    items: [
      { id: 'leads',         label: 'Leads',         icon: Zap,           path: `${BASE}/leads`         },
      { id: 'clients',       label: 'Clients',       icon: Briefcase,     path: `${BASE}/clients`       },
      { id: 'consultations', label: 'Consultations', icon: CalendarClock, path: `${BASE}/consultations` },
      { id: 'comms',         label: 'Comms',         icon: Inbox,         path: `${BASE}/comms`         },
      { id: 'partners',      label: 'Partners',      icon: Handshake,     path: `${BASE}/partners`      },
      { id: 'investors',     label: 'Investors',     icon: TrendingUp,    path: `${BASE}/investors`     },
    ],
  },
  {
    label: 'CORE',
    items: [
      { id: 'strategy',    label: 'Strategy',    icon: Target,          path: `${BASE}/strategy`       },
      { id: 'projects',    label: 'Projects',    icon: LayoutDashboard, path: `${BASE}/projects`       },
      { id: 'delivery',    label: 'Delivery',    icon: Activity,        path: `${BASE}/delivery`       },
      { id: 'governance',  label: 'Governance',  icon: Scale,           path: `${BASE}/governance`     },
      { id: 'resources',   label: 'Resources',   icon: Users,           path: `${BASE}/resources`      },
      { id: 'finance',     label: 'Finance',     icon: DollarSign,      path: `${BASE}/finance`        },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { id: 'careers',     label: 'Careers',     icon: GraduationCap,   path: `${BASE}/careers`        },
      { id: 'marketing',   label: 'Marketing',   icon: Megaphone,       path: `${BASE}/marketing`      },
      { id: 'workflows',   label: 'Workflows',   icon: GitBranch,       path: `${BASE}/workflows`      },
      { id: 'departments', label: 'Departments', icon: Building2,       path: `${BASE}/departments`    },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'settings',    label: 'Settings',    icon: Settings,        path: `${BASE}/settings`       },
    ],
  },
]

export const allNavItems: NavItem[] = [HOME_NAV_ITEM, ...navGroups.flatMap(g => g.items)]
