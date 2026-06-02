import {
  Target, LayoutDashboard, Users, DollarSign, Briefcase,
  Handshake, Zap, TrendingUp, GraduationCap, Megaphone,
  GitBranch, Building2, BarChart3, Brain, Settings, CalendarClock,
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
      { id: 'kimmp',       label: 'KIMMP',        icon: Brain,           path: '/os/kimmp'       },
      { id: 'analytics',   label: 'Analytics',   icon: BarChart3,       path: '/os/analytics'   },
    ],
  },
  {
    label: 'CORE',
    items: [
      { id: 'strategy',    label: 'Strategy',    icon: Target,          path: '/os/strategy'    },
      { id: 'projects',    label: 'Projects',    icon: LayoutDashboard, path: '/os/projects'    },
      { id: 'resources',   label: 'Resources',   icon: Users,           path: '/os/resources'   },
      { id: 'finance',     label: 'Finance',     icon: DollarSign,      path: '/os/finance'     },
    ],
  },
  {
    label: 'CRM',
    items: [
      { id: 'consultations', label: 'Consultations', icon: CalendarClock,   path: '/os/consultations' },
      { id: 'clients',       label: 'Clients',       icon: Briefcase,       path: '/os/clients'       },
      { id: 'partners',      label: 'Partners',      icon: Handshake,       path: '/os/partners'      },
      { id: 'leads',         label: 'Leads',         icon: Zap,             path: '/os/leads'         },
      { id: 'investors',     label: 'Investors',     icon: TrendingUp,      path: '/os/investors'     },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { id: 'careers',     label: 'Careers',     icon: GraduationCap,   path: '/os/careers'     },
      { id: 'marketing',   label: 'Marketing',   icon: Megaphone,       path: '/os/marketing'   },
      { id: 'workflows',   label: 'Workflows',   icon: GitBranch,       path: '/os/workflows'   },
      { id: 'departments', label: 'Departments', icon: Building2,       path: '/os/departments' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'settings',    label: 'Settings',    icon: Settings,        path: '/os/settings'    },
    ],
  },
]

export const allNavItems: NavItem[] = navGroups.flatMap(g => g.items)
