import {
  Target, LayoutDashboard, Users, DollarSign, Briefcase,
  Handshake, Zap, TrendingUp, GraduationCap, Megaphone,
  GitBranch, Building2, BarChart3, Brain, Settings, CalendarClock, Activity, Scale, Inbox,
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

export const navGroups: NavGroup[] = [
  {
    label: 'INTELLIGENCE',
    items: [
      { id: 'kimmp',       label: 'KIMMP',        icon: Brain,           path: '/kangqore-view/kimmp'       },
      { id: 'analytics',   label: 'Analytics',   icon: BarChart3,       path: '/kangqore-view/analytics'   },
    ],
  },
  {
    label: 'CORE',
    items: [
      { id: 'strategy',    label: 'Strategy',    icon: Target,          path: '/kangqore-view/strategy'    },
      { id: 'projects',    label: 'Projects',    icon: LayoutDashboard, path: '/kangqore-view/projects'    },
      { id: 'delivery',    label: 'Delivery',    icon: Activity,        path: '/kangqore-view/delivery'    },
      { id: 'governance',  label: 'Governance',  icon: Scale,           path: '/kangqore-view/governance'  },
      { id: 'resources',   label: 'Resources',   icon: Users,           path: '/kangqore-view/resources'   },
      { id: 'finance',     label: 'Finance',     icon: DollarSign,      path: '/kangqore-view/finance'     },
    ],
  },
  {
    label: 'CRM',
    items: [
      { id: 'consultations', label: 'Consultations', icon: CalendarClock,   path: '/kangqore-view/consultations' },
      { id: 'comms',         label: 'Comms',         icon: Inbox,           path: '/kangqore-view/comms'         },
      { id: 'clients',       label: 'Clients',       icon: Briefcase,       path: '/kangqore-view/clients'       },
      { id: 'partners',      label: 'Partners',      icon: Handshake,       path: '/kangqore-view/partners'      },
      { id: 'leads',         label: 'Leads',         icon: Zap,             path: '/kangqore-view/leads'         },
      { id: 'investors',     label: 'Investors',     icon: TrendingUp,      path: '/kangqore-view/investors'     },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { id: 'careers',     label: 'Careers',     icon: GraduationCap,   path: '/kangqore-view/careers'     },
      { id: 'marketing',   label: 'Marketing',   icon: Megaphone,       path: '/kangqore-view/marketing'   },
      { id: 'workflows',   label: 'Workflows',   icon: GitBranch,       path: '/kangqore-view/workflows'   },
      { id: 'departments', label: 'Departments', icon: Building2,       path: '/kangqore-view/departments' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'settings',    label: 'Settings',    icon: Settings,        path: '/kangqore-view/settings'    },
    ],
  },
]

export const allNavItems: NavItem[] = navGroups.flatMap(g => g.items)
