import {
  HouseIcon,
  CompassIcon,
  BrainIcon,
  CpuIcon,
  ChartBarIcon,
  LightningIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  CalendarDotsIcon,
  ChatTextIcon,
  ChatCircleDotsIcon,
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
  FootprintsIcon,
  GraphIcon,
  ShareNetworkIcon,
} from '@phosphor-icons/react'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'

export interface NavSubItem {
  id: string
  label: string
  path: string
}

export interface NavItem {
  id: string
  label: string
  icon: PhosphorIcon
  path: string
  children?: NavSubItem[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

// ── Rail types ────────────────────────────────────────────────────────────────

export interface RailSidebarItem {
  id: string
  label: string
  path: string
  badge?: string
}

export interface RailEntry {
  id: string
  label: string
  icon: PhosphorIcon
  /** Path to navigate to when the Rail item is clicked */
  defaultPath: string
  /** URL prefixes that make this Rail item "active" */
  matchPrefixes: string[]
  /** Items to render in the WorkspaceSidebar when this Rail item is active */
  sidebarItems: RailSidebarItem[]
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE = '/kangqore-view/admin'

// ── Rail config ───────────────────────────────────────────────────────────────

export const RAIL_ITEMS: RailEntry[] = [
  {
    id: 'home',
    label: 'Home',
    icon: HouseIcon,
    defaultPath: `${BASE}/home`,
    matchPrefixes: [`${BASE}/home`],
    sidebarItems: [
      { id: 'waanda-observe',    label: 'Observe',    path: `${BASE}/WAANDA/observe`    },
      { id: 'waanda-understand', label: 'Understand', path: `${BASE}/WAANDA/understand` },
      { id: 'waanda-decide',     label: 'Decide',     path: `${BASE}/WAANDA/decide`     },
      { id: 'waanda-act',        label: 'Act',        path: `${BASE}/WAANDA/act`        },
      { id: 'waanda-learn',      label: 'Learn',      path: `${BASE}/WAANDA/learn`      },
    ],
  },
  {
    id: 'waanda',
    label: 'WAANDA',
    icon: CompassIcon,
    defaultPath: `${BASE}/WAANDA`,
    matchPrefixes: [`${BASE}/WAANDA`, `${BASE}/kangqore-urgi`],
    sidebarItems: [
      { id: 'waanda-observe',    label: 'Observe',     path: `${BASE}/WAANDA/observe`    },
      { id: 'waanda-understand', label: 'Understand',  path: `${BASE}/WAANDA/understand` },
      { id: 'waanda-decide',     label: 'Decide',      path: `${BASE}/WAANDA/decide`     },
      { id: 'waanda-act',        label: 'Act',         path: `${BASE}/WAANDA/act`        },
      { id: 'waanda-learn',      label: 'Learn',       path: `${BASE}/WAANDA/learn`      },
      { id: 'waanda-urgi',       label: 'URGI Studio', path: `${BASE}/kangqore-urgi`     },
    ],
  },
  {
    id: 'kimmp',
    label: 'KIMMP',
    icon: BrainIcon,
    defaultPath: `${BASE}/kangqore-immp`,
    matchPrefixes: [`${BASE}/kangqore-immp`],
    sidebarItems: [
      { id: 'kimmp-cc',         label: 'Command Center',  path: `${BASE}/kangqore-immp/command-center`    },
      { id: 'kimmp-index',      label: 'Intelligence',    path: `${BASE}/kangqore-immp`,                   badge: 'kangqore-immp' },
      { id: 'kimmp-mc',         label: 'Mission Control', path: `${BASE}/kangqore-immp/mission-control`   },
      { id: 'kimmp-briefing',   label: 'Briefing',        path: `${BASE}/kangqore-immp/briefing`          },
      { id: 'kimmp-forecast',   label: 'Forecast',        path: `${BASE}/kangqore-immp/forecast`          },
      { id: 'kimmp-memory',     label: 'Memory',          path: `${BASE}/kangqore-immp/memory`            },
      { id: 'kimmp-goals',      label: 'Goals',           path: `${BASE}/kangqore-immp/goals`             },
      { id: 'kimmp-alerts',     label: 'Alerts',          path: `${BASE}/kangqore-immp/alerts`            },
      { id: 'kimmp-signals',    label: 'Signals',         path: `${BASE}/kangqore-immp/signals`           },
      { id: 'kimmp-scout',      label: 'Scout',           path: `${BASE}/kangqore-immp/scout`             },
      { id: 'kimmp-research',   label: 'Research',        path: `${BASE}/kangqore-immp/research`          },
      { id: 'kimmp-reports',    label: 'Reports',         path: `${BASE}/kangqore-immp/reports`           },
      { id: 'kimmp-actions',    label: 'Actions',         path: `${BASE}/kangqore-immp/actions`           },
      { id: 'kimmp-decisions',  label: 'Decisions',       path: `${BASE}/kangqore-immp/decisions`         },
      { id: 'kimmp-ops',        label: 'Operations',      path: `${BASE}/kangqore-immp/operations`        },
      { id: 'kimmp-workflows',  label: 'Workflows',       path: `${BASE}/kangqore-immp/workflows`         },
      { id: 'kimmp-ai-health',  label: 'AI Health',       path: `${BASE}/kangqore-immp/ai-governance`     },
      { id: 'kimmp-qef',        label: 'QEF',             path: `${BASE}/kangqore-immp/quality-engineering`},
      { id: 'kimmp-g7',         label: 'G7 Release',      path: `${BASE}/kangqore-immp/release-governance`},
      { id: 'kimmp-blueprint',  label: 'Blueprint',       path: `${BASE}/kangqore-immp/blueprint`         },
    ],
  },
  {
    id: 'keos',
    label: 'Kangqore KEOS',
    icon: CpuIcon,
    defaultPath: `${BASE}/keos`,
    matchPrefixes: [`${BASE}/keos`],
    sidebarItems: [
      { id: 'keos-personal',       label: 'Personal',       path: `${BASE}/keos?workspace=personal`       },
      { id: 'keos-executive',      label: 'Executive',      path: `${BASE}/keos?workspace=executive`      },
      { id: 'keos-revenue',        label: 'Revenue',        path: `${BASE}/keos?workspace=revenue`        },
      { id: 'keos-operations',     label: 'Operations',     path: `${BASE}/keos?workspace=operations`     },
      { id: 'keos-intelligence',   label: 'Intelligence',   path: `${BASE}/keos?workspace=intelligence`   },
      { id: 'keos-platform',       label: 'Platform',       path: `${BASE}/keos?workspace=platform`       },
      { id: 'keos-collaboration',  label: 'Collaboration',  path: `${BASE}/keos?workspace=collaboration`  },
      { id: 'keos-governance',     label: 'Governance',     path: `${BASE}/keos?workspace=governance`     },
      { id: 'keos-ecosystem',      label: 'Ecosystem',      path: `${BASE}/keos?workspace=ecosystem`      },
    ],
  },
  {
    id: 'aegis',
    label: 'AEGIS',
    icon: ShieldCheckeredIcon,
    defaultPath: `${BASE}/aegis`,
    matchPrefixes: [`${BASE}/aegis`],
    sidebarItems: [
      { id: 'aegis-overview',   label: 'Overview',   path: `${BASE}/aegis`             },
      { id: 'aegis-agents',     label: 'Agents',     path: `${BASE}/aegis/agents`      },
      { id: 'aegis-compliance', label: 'Compliance', path: `${BASE}/aegis/compliance`  },
      { id: 'aegis-audit',      label: 'Audit',      path: `${BASE}/aegis/audit`       },
      { id: 'aegis-autonomy',   label: 'Autonomy',   path: `${BASE}/aegis/autonomy`    },
      { id: 'aegis-assets',     label: 'Assets',     path: `${BASE}/aegis/assets`      },
      { id: 'aegis-egress',     label: 'Egress',     path: `${BASE}/aegis/egress`      },
      { id: 'aegis-shield',     label: 'Shield',     path: `${BASE}/aegis/shield`      },
      { id: 'aegis-policy',     label: 'Policy',     path: `${BASE}/aegis/policy`      },
      { id: 'aegis-live',       label: 'Live Feed',  path: `${BASE}/aegis/live`        },
    ],
  },
  {
    id: 'ontology',
    label: 'Ontology',
    icon: GraphIcon,
    defaultPath: `${BASE}/ontology`,
    matchPrefixes: [`${BASE}/ontology`],
    sidebarItems: [
      { id: 'ont-explorer',   label: 'Explorer',   path: `${BASE}/ontology/explorer`   },
      { id: 'ont-objects',    label: 'Objects',    path: `${BASE}/ontology/objects`     },
      { id: 'ont-lineage',    label: 'Lineage',    path: `${BASE}/ontology/lineage`     },
      { id: 'ont-markings',   label: 'Markings',   path: `${BASE}/ontology/markings`    },
      { id: 'ont-versioning', label: 'Versioning', path: `${BASE}/ontology/versioning`  },
      { id: 'ont-kore',       label: 'KORE Types', path: `${BASE}/ontology/kore-types`  },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    icon: HardDrivesIcon,
    defaultPath: `${BASE}/systems`,
    matchPrefixes: [
      `${BASE}/systems`, `${BASE}/neural-network`,
      `${BASE}/agent-logs`, `${BASE}/analytics`, `${BASE}/relay`,
    ],
    sidebarItems: [
      { id: 'systems',        label: 'Systems',        path: `${BASE}/systems`        },
      { id: 'neural-network', label: 'Neural Network', path: `${BASE}/neural-network` },
      { id: 'agent-logs',     label: 'Agent Logs',     path: `${BASE}/agent-logs`     },
      { id: 'analytics',      label: 'Analytics',      path: `${BASE}/analytics`      },
      { id: 'relay',          label: 'RELAY',          path: `${BASE}/relay`,          badge: 'comms' },
    ],
  },
  {
    id: 'crm',
    label: 'CRM',
    icon: UsersIcon,
    defaultPath: `${BASE}/leads`,
    matchPrefixes: [
      `${BASE}/visitors`, `${BASE}/leads`, `${BASE}/clients`,
      `${BASE}/consultations`, `${BASE}/scheduling`, `${BASE}/comms`,
      `${BASE}/partners`, `${BASE}/investors`,
    ],
    sidebarItems: [
      { id: 'visitors',      label: 'Visitors',      path: `${BASE}/visitors`      },
      { id: 'leads',         label: 'Leads',         path: `${BASE}/leads`,         badge: 'leads'         },
      { id: 'clients',       label: 'Clients',       path: `${BASE}/clients`                               },
      { id: 'consultations', label: 'Consultations', path: `${BASE}/consultations`, badge: 'consultations' },
      { id: 'scheduling',    label: 'Scheduling',    path: `${BASE}/scheduling`                            },
      { id: 'comms',         label: 'Communate',     path: `${BASE}/comms`,         badge: 'comms'         },
      { id: 'partners',      label: 'Partners',      path: `${BASE}/partners`                              },
      { id: 'investors',     label: 'Investors',     path: `${BASE}/investors`                             },
    ],
  },
  {
    id: 'core',
    label: 'Core',
    icon: CrosshairIcon,
    defaultPath: `${BASE}/strategy`,
    matchPrefixes: [
      `${BASE}/bids`, `${BASE}/ops-centre`, `${BASE}/strategy`,
      `${BASE}/projects`, `${BASE}/delivery`, `${BASE}/governance`,
      `${BASE}/resources`, `${BASE}/finance`,
    ],
    sidebarItems: [
      { id: 'bids',       label: 'BIDS™',      path: `${BASE}/bids`       },
      { id: 'ops-centre', label: 'Ops Centre', path: `${BASE}/ops-centre` },
      { id: 'strategy',   label: 'Strategy',   path: `${BASE}/strategy`   },
      { id: 'projects',   label: 'Projects',   path: `${BASE}/projects`   },
      { id: 'delivery',   label: 'Delivery',   path: `${BASE}/delivery`   },
      { id: 'governance', label: 'Governance', path: `${BASE}/governance` },
      { id: 'resources',  label: 'Resources',  path: `${BASE}/resources`  },
      { id: 'finance',    label: 'Finance',    path: `${BASE}/finance`    },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: SirenIcon,
    defaultPath: `${BASE}/workflows`,
    matchPrefixes: [
      `${BASE}/careers`, `${BASE}/marketing`,
      `${BASE}/workflows`, `${BASE}/departments`,
    ],
    sidebarItems: [
      { id: 'careers',     label: 'Careers',     path: `${BASE}/careers`     },
      { id: 'marketing',   label: 'Marketing',   path: `${BASE}/marketing`   },
      { id: 'workflows',   label: 'Workflows',   path: `${BASE}/workflows`   },
      { id: 'departments', label: 'Departments', path: `${BASE}/departments` },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: GearIcon,
    defaultPath: `${BASE}/settings`,
    matchPrefixes: [`${BASE}/settings`],
    sidebarItems: [
      { id: 'settings-profile',      label: 'Profile',         path: `${BASE}/settings/profile`          },
      { id: 'settings-org',          label: 'Organization',    path: `${BASE}/settings/organization`     },
      { id: 'settings-calendar',     label: 'Calendar',        path: `${BASE}/settings/calendar`         },
      { id: 'settings-webhooks',     label: 'Webhooks',        path: `${BASE}/settings/webhooks`         },
      { id: 'settings-email',        label: 'Email Templates', path: `${BASE}/settings/email-templates`  },
      { id: 'settings-domains',      label: 'Custom Domains',  path: `${BASE}/settings/custom-domains`   },
      { id: 'settings-privacy',      label: 'Data Privacy',    path: `${BASE}/settings/data-privacy`     },
      { id: 'settings-developer',    label: 'Developer',       path: `${BASE}/settings/developer`        },
      { id: 'settings-integrations', label: 'Integrations',    path: `${BASE}/settings/integrations`     },
      { id: 'settings-policies',     label: 'Policies',        path: `${BASE}/settings/policies`         },
    ],
  },
]

/** Returns the active RailEntry for the current pathname, or null for Home / no match */
export function getActiveRailItem(pathname: string): RailEntry | null {
  for (const item of RAIL_ITEMS) {
    if (item.matchPrefixes.some(p => pathname.startsWith(p))) return item
  }
  return null
}

// ── Legacy navGroups (kept for any code still referencing them) ───────────────

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
      { id: 'keos',           label: 'Kangqore KEOS', icon: CpuIcon,             path: `${BASE}/keos`           },
      {
        id: 'overview', label: 'WAANDA', icon: CompassIcon, path: `${BASE}/WAANDA`,
        children: [
          { id: 'waanda-observe',    label: 'Observe',     path: `${BASE}/WAANDA/observe`    },
          { id: 'waanda-understand', label: 'Understand',  path: `${BASE}/WAANDA/understand` },
          { id: 'waanda-decide',     label: 'Decide',      path: `${BASE}/WAANDA/decide`     },
          { id: 'waanda-act',        label: 'Act',         path: `${BASE}/WAANDA/act`        },
          { id: 'waanda-learn',      label: 'Learn',       path: `${BASE}/WAANDA/learn`      },
          { id: 'waanda-urgi',       label: 'URGI Studio', path: `${BASE}/kangqore-urgi`     },
        ],
      },
      { id: 'kangqore-immp',  label: 'KIMMP',          icon: BrainIcon,           path: `${BASE}/kangqore-immp`  },
      { id: 'systems',        label: 'Systems',        icon: HardDrivesIcon,      path: `${BASE}/systems`        },
      { id: 'aegis',          label: 'AEGIS',          icon: ShieldCheckeredIcon, path: `${BASE}/aegis`          },
      { id: 'ontology',       label: 'Ontology',       icon: GraphIcon,           path: `${BASE}/ontology`       },
      { id: 'neural-network', label: 'Neural Network', icon: ShareNetworkIcon,    path: `${BASE}/neural-network` },
      { id: 'agent-logs',     label: 'Agent Logs',     icon: ScrollIcon,          path: `${BASE}/agent-logs`     },
      { id: 'analytics',      label: 'Analytics',      icon: ChartBarIcon,        path: `${BASE}/analytics`      },
      { id: 'relay',          label: 'RELAY',          icon: ChatCircleDotsIcon,  path: `${BASE}/relay`          },
    ],
  },
  {
    label: 'CRM',
    items: [
      { id: 'visitors',      label: 'Visitors',      icon: FootprintsIcon,    path: `${BASE}/visitors`      },
      { id: 'leads',         label: 'Leads',         icon: LightningIcon,     path: `${BASE}/leads`         },
      { id: 'clients',       label: 'Clients',       icon: BriefcaseIcon,     path: `${BASE}/clients`       },
      { id: 'consultations', label: 'Consultations', icon: CalendarCheckIcon, path: `${BASE}/consultations` },
      { id: 'scheduling',    label: 'Scheduling',    icon: CalendarDotsIcon,  path: `${BASE}/scheduling`    },
      { id: 'comms',         label: 'Communate',     icon: ChatTextIcon,      path: `${BASE}/comms`         },
      { id: 'partners',      label: 'Partners',      icon: HandshakeIcon,     path: `${BASE}/partners`      },
      { id: 'investors',     label: 'Investors',     icon: TrendUpIcon,       path: `${BASE}/investors`     },
    ],
  },
  {
    label: 'CORE',
    items: [
      { id: 'bids',       label: 'BIDS™',      icon: CrosshairIcon,      path: `${BASE}/bids`       },
      { id: 'ops-centre', label: 'Ops Centre', icon: SirenIcon,          path: `${BASE}/ops-centre` },
      { id: 'strategy',   label: 'Strategy',   icon: StrategyIcon,       path: `${BASE}/strategy`   },
      { id: 'projects',   label: 'Projects',   icon: SquaresFourIcon,    path: `${BASE}/projects`   },
      { id: 'delivery',   label: 'Delivery',   icon: PulseIcon,          path: `${BASE}/delivery`   },
      { id: 'governance', label: 'Governance', icon: ScalesIcon,         path: `${BASE}/governance` },
      { id: 'resources',  label: 'Resources',  icon: UsersIcon,          path: `${BASE}/resources`  },
      { id: 'finance',    label: 'Finance',    icon: CurrencyDollarIcon, path: `${BASE}/finance`    },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { id: 'careers',     label: 'Careers',     icon: GraduationCapIcon, path: `${BASE}/careers`     },
      { id: 'marketing',   label: 'Marketing',   icon: MegaphoneIcon,     path: `${BASE}/marketing`   },
      { id: 'workflows',   label: 'Workflows',   icon: GitBranchIcon,     path: `${BASE}/workflows`   },
      { id: 'departments', label: 'Departments', icon: BuildingsIcon,     path: `${BASE}/departments` },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'settings', label: 'Settings', icon: GearIcon, path: `${BASE}/settings` },
    ],
  },
]

export const allNavItems: NavItem[] = [HOME_NAV_ITEM, ...navGroups.flatMap(g => g.items)]
