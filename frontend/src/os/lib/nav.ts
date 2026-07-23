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
  category?: string
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
      { id: 'waanda-observe',    label: 'Observe',     path: `${BASE}/WAANDA/observe`,    category: 'Cycle' },
      { id: 'waanda-understand', label: 'Understand',  path: `${BASE}/WAANDA/understand`, category: 'Cycle' },
      { id: 'waanda-decide',     label: 'Decide',      path: `${BASE}/WAANDA/decide`,     category: 'Cycle' },
      { id: 'waanda-act',        label: 'Act',         path: `${BASE}/WAANDA/act`,        category: 'Cycle' },
      { id: 'waanda-learn',      label: 'Learn',       path: `${BASE}/WAANDA/learn`,      category: 'Cycle' },
      { id: 'waanda-urgi',       label: 'URGI Studio', path: `${BASE}/kangqore-urgi`,     category: 'Studio' },
    ],
  },
  {
    id: 'kimmp',
    label: 'KIMMP',
    icon: BrainIcon,
    defaultPath: `${BASE}/kangqore-immp`,
    matchPrefixes: [`${BASE}/kangqore-immp`],
    sidebarItems: [
      { id: 'kimmp-cc',         label: 'Command Center',  path: `${BASE}/kangqore-immp/command-center`,   category: 'Dashboards' },
      { id: 'kimmp-mc',         label: 'Mission Control', path: `${BASE}/kangqore-immp/mission-control`,  category: 'Dashboards' },
      { id: 'kimmp-briefing',   label: 'Briefing',        path: `${BASE}/kangqore-immp/briefing`,         category: 'Dashboards' },
      
      { id: 'kimmp-index',      label: 'Intelligence',    path: `${BASE}/kangqore-immp`,                  category: 'Intelligence', badge: 'kangqore-immp' },
      { id: 'kimmp-forecast',   label: 'Forecast',        path: `${BASE}/kangqore-immp/forecast`,         category: 'Intelligence' },
      { id: 'kimmp-memory',     label: 'Memory',          path: `${BASE}/kangqore-immp/memory`,           category: 'Intelligence' },
      { id: 'kimmp-cognition',  label: 'Cognition',       path: `${BASE}/kangqore-immp/memory-timeline`,  category: 'Intelligence' },
      { id: 'kimmp-signals',    label: 'Signals',         path: `${BASE}/kangqore-immp/signals`,          category: 'Intelligence' },
      { id: 'kimmp-scout',      label: 'Scout',           path: `${BASE}/kangqore-immp/scout`,            category: 'Intelligence' },
      { id: 'kimmp-research',   label: 'Research',        path: `${BASE}/kangqore-immp/research`,         category: 'Intelligence' },
      
      { id: 'kimmp-ops',        label: 'Operations',      path: `${BASE}/kangqore-immp/operations`,       category: 'Execution & Ops' },
      { id: 'kimmp-actions',    label: 'Actions',         path: `${BASE}/kangqore-immp/actions`,          category: 'Execution & Ops' },
      { id: 'kimmp-goals',      label: 'Goals',           path: `${BASE}/kangqore-immp/goals`,            category: 'Execution & Ops' },
      { id: 'kimmp-alerts',     label: 'Alerts',          path: `${BASE}/kangqore-immp/alerts`,           category: 'Execution & Ops' },
      { id: 'kimmp-workflows',  label: 'Workflows',       path: `${BASE}/kangqore-immp/workflows`,        category: 'Execution & Ops' },
      { id: 'kimmp-gen2',           label: 'Gen 2 Training',         path: `${BASE}/kangqore-immp/training`,              category: 'Execution & Ops' },
      { id: 'kimmp-agent-coord',    label: 'Multi-Agent',            path: `${BASE}/kangqore-immp/agent-coordination`,    category: 'Execution & Ops', badge: 'new' },
      { id: 'kimmp-foundation',     label: 'Foundation Model',       path: `${BASE}/kangqore-immp/foundation-model`,      category: 'Execution & Ops', badge: 'new' },
      { id: 'kimmp-coig',           label: 'COIG™ Dashboard',        path: `${BASE}/kangqore-immp/coig`,                  category: 'Enterprise',      badge: 'new' },
      { id: 'kimmp-ps-pack',        label: 'PS Pack Extraction',     path: `${BASE}/kangqore-immp/ps-pack-extraction`,    category: 'Enterprise',      badge: 'new' },

      { id: 'kimmp-authority',  label: 'Authority',        path: `${BASE}/kangqore-immp/authority`,         category: 'Governance' },
      { id: 'kimmp-ai-health',  label: 'AI Health',       path: `${BASE}/kangqore-immp/ai-governance`,    category: 'Governance' },
      { id: 'kimmp-qef',        label: 'QEF',             path: `${BASE}/kangqore-immp/quality-engineering`, category: 'Governance' },
      { id: 'kimmp-g7',         label: 'G7 Release',      path: `${BASE}/kangqore-immp/release-governance`, category: 'Governance' },
      { id: 'kimmp-g8',         label: 'Gate 8 — OIS',    path: `${BASE}/kangqore-immp/operational-intel`,  category: 'Governance' },
      { id: 'kimmp-decisions',  label: 'Decisions',       path: `${BASE}/kangqore-immp/decisions`,        category: 'Governance' },
      { id: 'kimmp-reflection', label: 'Reflection',      path: `${BASE}/kangqore-immp/reflection`,       category: 'Governance' },
      { id: 'kimmp-reports',    label: 'Reports',         path: `${BASE}/kangqore-immp/reports`,          category: 'Governance' },
      { id: 'kimmp-flight',     label: 'Flight Recorder', path: `${BASE}/kangqore-immp/flight-recorder`,  category: 'Governance' },

      { id: 'kimmp-enterprise',       label: 'Enterprise DNA',      path: `${BASE}/kangqore-immp/enterprise`,         category: 'Enterprise' },
      { id: 'kimmp-customer-zero',  label: 'Customer Zero',       path: `${BASE}/kangqore-immp/customer-zero`,      category: 'Enterprise' },
      { id: 'kimmp-coach',          label: 'Coach',               path: `${BASE}/kangqore-immp/coach`,              category: 'Enterprise' },
      { id: 'kimmp-decision-eng',   label: 'Decision Engine',     path: `${BASE}/kangqore-immp/decision-engine`,    category: 'Enterprise' },
      { id: 'kimmp-deployments',    label: 'Deployments',         path: `${BASE}/kangqore-immp/deployments`,         category: 'Enterprise' },
      { id: 'kimmp-blueprint',      label: 'Blueprint',           path: `${BASE}/kangqore-immp/blueprint`,           category: 'Enterprise' },
      { id: 'kimmp-blueprint-wiz',  label: 'Blueprint Wizard',    path: `${BASE}/kangqore-immp/blueprint-wizard`,    category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-billing-dash',   label: 'KEOS Billing',        path: `${BASE}/kangqore-immp/billing-dashboard`,   category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-pack-activation', label: 'Pack Activation',    path: `${BASE}/kangqore-immp/pack-activation`,     category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-revenue-intel',  label: 'Revenue Intel',       path: `${BASE}/kangqore-immp/revenue-intel`,       category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-proposal',       label: 'Proposal Builder',    path: `${BASE}/kangqore-immp/proposal-builder`,    category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-case-study',     label: 'Case Study C0',       path: `${BASE}/kangqore-immp/case-study`,          category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-customer-one',   label: 'Customer One',         path: `${BASE}/kangqore-immp/customer-one`,        category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-pmo',            label: 'PMO Organic Data',       path: `${BASE}/kangqore-immp/pmo`,                   category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-coig-north-star',label: 'COIG North Star',       path: `${BASE}/kangqore-immp/coig-north-star`,       category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-bp-versions',    label: 'Blueprint Versions',     path: `${BASE}/kangqore-immp/blueprint-versions`,    category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-customer-four',  label: 'Customer Four',          path: `${BASE}/kangqore-immp/customers/four`,        category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-customer-five',  label: 'Customer Five',          path: `${BASE}/kangqore-immp/customers/five`,        category: 'Enterprise', badge: 'new' },
    ],
  },
  {
    id: 'keos',
    label: 'Kangqore KEOS',
    icon: CpuIcon,
    defaultPath: `${BASE}/keos`,
    matchPrefixes: [`${BASE}/keos`],
    sidebarItems: [
      { id: 'keos-personal',       label: 'Personal',       path: `${BASE}/keos?workspace=personal`,      category: 'Personal' },
      { id: 'keos-executive',      label: 'Executive',      path: `${BASE}/keos?workspace=executive`,     category: 'Leadership' },
      { id: 'keos-revenue',        label: 'Revenue',        path: `${BASE}/keos?workspace=revenue`,       category: 'Business' },
      { id: 'keos-operations',     label: 'Operations',     path: `${BASE}/keos?workspace=operations`,    category: 'Business' },
      { id: 'keos-intelligence',   label: 'Intelligence',   path: `${BASE}/keos?workspace=intelligence`,  category: 'Systems' },
      { id: 'keos-platform',       label: 'Platform',       path: `${BASE}/keos?workspace=platform`,      category: 'Systems' },
      { id: 'keos-ecosystem',      label: 'Ecosystem',      path: `${BASE}/keos?workspace=ecosystem`,     category: 'Systems' },
      { id: 'keos-collaboration',  label: 'Collaboration',  path: `${BASE}/keos?workspace=collaboration`, category: 'Org' },
      { id: 'keos-governance',     label: 'Governance',     path: `${BASE}/keos?workspace=governance`,    category: 'Org' },
    ],
  },
  {
    id: 'aegis',
    label: 'AEGIS',
    icon: ShieldCheckeredIcon,
    defaultPath: `${BASE}/aegis`,
    matchPrefixes: [`${BASE}/aegis`],
    sidebarItems: [
      { id: 'aegis-overview',   label: 'Overview',   path: `${BASE}/aegis`,            category: 'Command' },
      { id: 'aegis-live',       label: 'Live Feed',  path: `${BASE}/aegis/live`,       category: 'Command' },
      { id: 'aegis-agents',     label: 'Agents',     path: `${BASE}/aegis/agents`,     category: 'Governance' },
      { id: 'aegis-compliance', label: 'Compliance', path: `${BASE}/aegis/compliance`, category: 'Governance' },
      { id: 'aegis-audit',      label: 'Audit',      path: `${BASE}/aegis/audit`,      category: 'Governance' },
      { id: 'aegis-policy',     label: 'Policy',     path: `${BASE}/aegis/policy`,     category: 'Governance' },
      { id: 'aegis-autonomy',   label: 'Autonomy',   path: `${BASE}/aegis/autonomy`,   category: 'Shield' },
      { id: 'aegis-assets',     label: 'Assets',     path: `${BASE}/aegis/assets`,     category: 'Shield' },
      { id: 'aegis-egress',     label: 'Egress',     path: `${BASE}/aegis/egress`,     category: 'Shield' },
      { id: 'aegis-shield',     label: 'Shield',     path: `${BASE}/aegis/shield`,     category: 'Shield' },
    ],
  },
  {
    id: 'ontology',
    label: 'Ontology',
    icon: GraphIcon,
    defaultPath: `${BASE}/ontology`,
    matchPrefixes: [`${BASE}/ontology`],
    sidebarItems: [
      { id: 'ont-explorer',   label: 'Explorer',   path: `${BASE}/ontology/explorer`,  category: 'Explore' },
      { id: 'ont-objects',    label: 'Objects',    path: `${BASE}/ontology/objects`,   category: 'Explore' },
      { id: 'ont-lineage',    label: 'Lineage',    path: `${BASE}/ontology/lineage`,   category: 'Explore' },
      { id: 'ont-markings',   label: 'Markings',   path: `${BASE}/ontology/markings`,  category: 'Manage' },
      { id: 'ont-versioning', label: 'Versioning', path: `${BASE}/ontology/versioning`, category: 'Manage' },
      { id: 'ont-kore',       label: 'KORE Types', path: `${BASE}/ontology/kore-types`, category: 'Manage' },
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
      `${BASE}/partners`, `${BASE}/investors`, `${BASE}/communities`,
    ],
    sidebarItems: [
      { id: 'visitors',      label: 'Visitors',      path: `${BASE}/visitors`,      category: 'Acquisition'  },
      { id: 'leads',         label: 'Leads',         path: `${BASE}/leads`,         category: 'Acquisition', badge: 'leads' },
      { id: 'clients',       label: 'Clients',       path: `${BASE}/clients`,       category: 'Accounts'     },
      { id: 'consultations', label: 'Consultations', path: `${BASE}/consultations`, category: 'Accounts',    badge: 'consultations' },
      { id: 'scheduling',    label: 'Scheduling',    path: `${BASE}/scheduling`,    category: 'Accounts'     },
      { id: 'comms',         label: 'Communate',     path: `${BASE}/comms`,         category: 'Network',     badge: 'comms' },
      { id: 'communities',   label: 'Communities',   path: `${BASE}/communities`,   category: 'Network'      },
      { id: 'partners',      label: 'Partners',      path: `${BASE}/partners`,      category: 'Network'      },
      { id: 'investors',     label: 'Investors',     path: `${BASE}/investors`,     category: 'Network'      },
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
      { id: 'bids',       label: 'BIDS™',      path: `${BASE}/bids`,       category: 'Strategy' },
      { id: 'ops-centre', label: 'Ops Centre', path: `${BASE}/ops-centre`, category: 'Strategy' },
      { id: 'strategy',   label: 'Strategy',   path: `${BASE}/strategy`,   category: 'Strategy' },
      { id: 'projects',   label: 'Projects',   path: `${BASE}/projects`,   category: 'Delivery' },
      { id: 'delivery',   label: 'Delivery',   path: `${BASE}/delivery`,   category: 'Delivery' },
      { id: 'governance', label: 'Governance', path: `${BASE}/governance`, category: 'Management' },
      { id: 'resources',  label: 'Resources',  path: `${BASE}/resources`,  category: 'Management' },
      { id: 'finance',    label: 'Finance',    path: `${BASE}/finance`,    category: 'Management' },
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
      { id: 'settings-profile',      label: 'Profile',         path: `${BASE}/settings/profile`,         category: 'Account' },
      { id: 'settings-org',          label: 'Organization',    path: `${BASE}/settings/organization`,    category: 'Account' },
      { id: 'settings-calendar',     label: 'Calendar',        path: `${BASE}/settings/calendar`,        category: 'Account' },
      { id: 'settings-webhooks',     label: 'Webhooks',        path: `${BASE}/settings/webhooks`,        category: 'Configuration' },
      { id: 'settings-email',        label: 'Email Templates', path: `${BASE}/settings/email-templates`, category: 'Configuration' },
      { id: 'settings-domains',      label: 'Custom Domains',  path: `${BASE}/settings/custom-domains`,  category: 'Configuration' },
      { id: 'settings-privacy',      label: 'Data Privacy',    path: `${BASE}/settings/data-privacy`,    category: 'Configuration' },
      { id: 'settings-developer',    label: 'Developer',       path: `${BASE}/settings/developer`,       category: 'Platform' },
      { id: 'settings-integrations', label: 'Integrations',    path: `${BASE}/settings/integrations`,    category: 'Platform' },
      { id: 'settings-policies',     label: 'Policies',        path: `${BASE}/settings/policies`,        category: 'Platform' },
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
      { id: 'analytics',      label: 'Analytics',      icon: ChartBarIcon,        path: `${BASE}/analytics`,
        children: [
          { id: 'analytics-overview', label: 'Overview',        path: `${BASE}/analytics`         },
          { id: 'analytics-ois',      label: 'OIS Trend',       path: `${BASE}/analytics/ois`     },
          { id: 'analytics-waanda',   label: 'WAANDA Activity',    path: `${BASE}/analytics/waanda`   },
          { id: 'analytics-modules',  label: 'Module Performance', path: `${BASE}/analytics/modules`  },
          { id: 'analytics-twin',     label: 'Digital Twin™',      path: `${BASE}/analytics/twin`     },
        ],
      },
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
