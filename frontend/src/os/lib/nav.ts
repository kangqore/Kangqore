import {
  HouseIcon,
  CompassIcon,
  BrainIcon,
  ChartBarIcon,
  LightningIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  CalendarDotsIcon,
  ChatTextIcon,
  HandshakeIcon,
  TrendUpIcon,
  StrategyIcon,
  SquaresFourIcon,
  PulseIcon,
  ScalesIcon,
  UsersIcon,
  CurrencyDollarIcon,
  GraduationCapIcon,
  MegaphoneIcon,
  GitBranchIcon,
  BuildingsIcon,
  GearIcon,
  ScrollIcon,
  HardDrivesIcon,
  ShieldCheckeredIcon,
  CrosshairIcon,
  SirenIcon,
  PlugsConnectedIcon,
} from '@phosphor-icons/react'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'

export interface NavItem {
  id: string
  label: string
  icon: PhosphorIcon
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
  icon: HouseIcon,
  path: `${BASE}/home`,
}

export const navGroups: NavGroup[] = [
  {
    label: 'INTELLIGENCE',
    items: [
      { id: 'overview',      label: 'WAANDA',        icon: CompassIcon,       path: `${BASE}/WAANDA`         },
      { id: 'kangqore-immp', label: 'KIMMP',          icon: BrainIcon,         path: `${BASE}/kangqore-immp`  },
      { id: 'systems',       label: 'Systems',        icon: HardDrivesIcon,    path: `${BASE}/systems`        },
      { id: 'aegis',         label: 'AEGIS',          icon: ShieldCheckeredIcon, path: `${BASE}/aegis`        },
      { id: 'agent-logs',    label: 'Agent Logs',     icon: ScrollIcon,        path: `${BASE}/agent-logs`     },
      { id: 'analytics',     label: 'Analytics',      icon: ChartBarIcon,      path: `${BASE}/analytics`      },
    ],
  },
  {
    label: 'CRM',
    items: [
      { id: 'leads',         label: 'Leads',          icon: LightningIcon,     path: `${BASE}/leads`         },
      { id: 'clients',       label: 'Clients',        icon: BriefcaseIcon,     path: `${BASE}/clients`       },
      { id: 'consultations', label: 'Consultations',  icon: CalendarCheckIcon, path: `${BASE}/consultations` },
      { id: 'scheduling',    label: 'Scheduling',     icon: CalendarDotsIcon,  path: `${BASE}/scheduling`    },
      { id: 'comms',         label: 'Communate',      icon: ChatTextIcon,      path: `${BASE}/comms`         },
      { id: 'partners',      label: 'Partners',       icon: HandshakeIcon,     path: `${BASE}/partners`      },
      { id: 'investors',     label: 'Investors',      icon: TrendUpIcon,       path: `${BASE}/investors`     },
    ],
  },
  {
    label: 'CORE',
    items: [
      { id: 'bids',        label: 'BIDS™',       icon: CrosshairIcon,      path: `${BASE}/bids`           },
      { id: 'ops-centre',  label: 'Ops Centre',  icon: SirenIcon,          path: `${BASE}/ops-centre`     },
      { id: 'connect',     label: 'Connect',     icon: PlugsConnectedIcon, path: `${BASE}/connect`        },
      { id: 'strategy',    label: 'Strategy',    icon: StrategyIcon,      path: `${BASE}/strategy`       },
      { id: 'projects',    label: 'Projects',    icon: SquaresFourIcon,   path: `${BASE}/projects`       },
      { id: 'delivery',    label: 'Delivery',    icon: PulseIcon,         path: `${BASE}/delivery`       },
      { id: 'governance',  label: 'Governance',  icon: ScalesIcon,        path: `${BASE}/governance`     },
      { id: 'resources',   label: 'Resources',   icon: UsersIcon,         path: `${BASE}/resources`      },
      { id: 'finance',     label: 'Finance',     icon: CurrencyDollarIcon,path: `${BASE}/finance`        },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { id: 'careers',     label: 'Careers',     icon: GraduationCapIcon, path: `${BASE}/careers`        },
      { id: 'marketing',   label: 'Marketing',   icon: MegaphoneIcon,     path: `${BASE}/marketing`      },
      { id: 'workflows',   label: 'Workflows',   icon: GitBranchIcon,     path: `${BASE}/workflows`      },
      { id: 'departments', label: 'Departments', icon: BuildingsIcon,     path: `${BASE}/departments`    },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'settings',    label: 'Settings',    icon: GearIcon,            path: `${BASE}/settings`      },
    ],
  },
]

export const allNavItems: NavItem[] = [HOME_NAV_ITEM, ...navGroups.flatMap(g => g.items)]
