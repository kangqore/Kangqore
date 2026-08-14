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
  RadioIcon,
  MagicWandIcon,
  RobotIcon,
  TrophyIcon,
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
      { id: 'kimmp-behavior',   label: 'Behavior',        path: `${BASE}/kangqore-immp/behavior`,         category: 'Intelligence' },
      
      { id: 'kimmp-ops',        label: 'Operations',      path: `${BASE}/kangqore-immp/operations`,       category: 'Execution & Ops' },
      { id: 'kimmp-actions',    label: 'Actions',         path: `${BASE}/kangqore-immp/actions`,          category: 'Execution & Ops' },
      { id: 'kimmp-goals',      label: 'Goals',           path: `${BASE}/kangqore-immp/goals`,            category: 'Execution & Ops' },
      { id: 'kimmp-alerts',     label: 'Alerts',          path: `${BASE}/kangqore-immp/alerts`,           category: 'Execution & Ops' },
      { id: 'kimmp-workflows',  label: 'Workflows',       path: `${BASE}/kangqore-immp/workflows`,        category: 'Execution & Ops' },
      { id: 'kimmp-gen2',           label: 'Gen 2 Training',         path: `${BASE}/kangqore-immp/training`,              category: 'Execution & Ops' },
      { id: 'kimmp-waanda-gen2',    label: 'WAANDAx Gen 2',          path: `${BASE}/kangqore-immp/waanda-gen2`,           category: 'Execution & Ops', badge: 'new' },
      { id: 'kimmp-gen3',           label: 'Gen 3 Runtime',          path: `${BASE}/kangqore-immp/gen3`,                  category: 'Execution & Ops', badge: 'new' },
      { id: 'kimmp-gen2-accuracy',  label: 'Gen 2 Accuracy',         path: `${BASE}/kangqore-immp/gen2-accuracy`,         category: 'Execution & Ops', badge: 'new' },
      { id: 'kimmp-agent-coord',    label: 'Multi-Agent',            path: `${BASE}/kangqore-immp/agent-coordination`,    category: 'Execution & Ops', badge: 'new' },
      { id: 'kimmp-foundation',     label: 'Foundation Model',       path: `${BASE}/kangqore-immp/foundation-model`,      category: 'Execution & Ops', badge: 'new' },
      { id: 'kimmp-coig',           label: 'COIG™ Dashboard',        path: `${BASE}/kangqore-immp/coig`,                  category: 'Execution & Ops', badge: 'new' },
      { id: 'kimmp-ps-pack',        label: 'PS Pack Extraction',     path: `${BASE}/kangqore-immp/ps-pack-extraction`,    category: 'Execution & Ops', badge: 'new' },

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
      { id: 'kimmp-tenants',        label: 'Tenants',             path: `${BASE}/kangqore-immp/tenants`,             category: 'Enterprise' },
      { id: 'kimmp-blueprint',      label: 'Blueprint',           path: `${BASE}/kangqore-immp/blueprint`,           category: 'Enterprise' },
      { id: 'kimmp-blueprint-cust', label: 'Blueprint Customize', path: `${BASE}/kangqore-immp/blueprint-customize`, category: 'Enterprise' },
      { id: 'kimmp-blueprint-wiz',  label: 'Blueprint Wizard',    path: `${BASE}/kangqore-immp/blueprint-wizard`,    category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-billing-dash',   label: 'KEOS Billing',        path: `${BASE}/kangqore-immp/billing-dashboard`,   category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-revenue-pipeline', label: 'Revenue Pipeline',  path: `${BASE}/kangqore-immp/revenue-pipeline`,    category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-pack-activation', label: 'Pack Activation',    path: `${BASE}/kangqore-immp/pack-activation`,     category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-industry-packs', label: 'Industry Packs',      path: `${BASE}/kangqore-immp/industry-packs`,      category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-revenue-intel',  label: 'Revenue Intel',       path: `${BASE}/kangqore-immp/revenue-intel`,       category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-proposal',       label: 'Proposal Builder',    path: `${BASE}/kangqore-immp/proposal-builder`,    category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-case-study',     label: 'Case Study C0',       path: `${BASE}/kangqore-immp/case-study`,          category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-exec-dashboard', label: 'Exec Dashboard',      path: `${BASE}/kangqore-immp/exec-dashboard`,      category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-customer-csp',   label: 'Customer Success Platform', path: `${BASE}/kangqore-immp/customer-success-platform`, category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-customer-pipeline', label: 'Customer Pipeline',       path: `${BASE}/kangqore-immp/customers/pipeline`,          category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-renewals',          label: 'Renewals',               path: `${BASE}/kangqore-immp/renewals`,                    category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-churn-risk',        label: 'Churn Risk',             path: `${BASE}/kangqore-immp/churn-risk`,                  category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-pmo',               label: 'PMO Organic Data',       path: `${BASE}/kangqore-immp/pmo`,                         category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-coig-north-star',   label: 'COIG North Star',        path: `${BASE}/kangqore-immp/coig-north-star`,             category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-bp-versions',       label: 'Blueprint Versions',     path: `${BASE}/kangqore-immp/blueprint-versions`,          category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-churn-early-warning', label: 'Churn Early Warning',  path: `${BASE}/kangqore-immp/churn-early-warning`,         category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-bp-marketplace',    label: 'Blueprint Marketplace',  path: `${BASE}/kangqore-immp/blueprint-marketplace`,       category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-partner-network',   label: 'Partner Network',        path: `${BASE}/kangqore-immp/partner-network`,             category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-partner-cert',      label: 'Partner Certification',  path: `${BASE}/kangqore-immp/partner-certification`,       category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-vertical-editions', label: 'Vertical Editions',      path: `${BASE}/kangqore-immp/vertical-editions`,           category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-vertical-analytics',label: 'Vertical Analytics',     path: `${BASE}/kangqore-immp/vertical-analytics`,          category: 'Enterprise', badge: 'new' },
      { id: 'kimmp-sdk-v2',            label: 'SDK v2',                 path: `${BASE}/kangqore-immp/sdk-v2`,                      category: 'Governance', badge: 'new' },
      { id: 'kimmp-compliance-overview', label: 'Compliance Overview',  path: `${BASE}/kangqore-immp/compliance-overview`,         category: 'Governance', badge: 'new' },
      { id: 'kimmp-contested-modules', label: 'Contested Modules',    path: `${BASE}/kangqore-immp/contested-modules`,           category: 'Governance', badge: 'new' },
      { id: 'kimmp-gtm-pipeline',    label: 'Proof Points & Analysts', path: `${BASE}/kangqore-immp/gtm-pipeline`,               category: 'Governance', badge: 'new' },
      { id: 'kimmp-partner-ecosystem', label: 'Partner Ecosystem',   path: `${BASE}/kangqore-immp/partner-ecosystem`,          category: 'Governance', badge: 'new' },
      { id: 'kimmp-battlecards',       label: 'Battlecards',         path: `${BASE}/kangqore-immp/battlecards`,                category: 'Governance', badge: 'new' },
      { id: 'kimmp-soc2-audit',        label: 'SOC2 Type II',           path: `${BASE}/kangqore-immp/soc2-audit`,                  category: 'Governance', badge: 'new' },
      { id: 'kimmp-region-admin',      label: 'Region Admin',           path: `${BASE}/kangqore-immp/region-admin`,                category: 'Governance', badge: 'new' },
      { id: 'kimmp-privacy-dashboard', label: 'Privacy & GDPR',         path: `${BASE}/kangqore-immp/privacy-dashboard`,           category: 'Governance', badge: 'new' },
      { id: 'kimmp-platform-launch',   label: 'Platform v1.0 Launch',   path: `${BASE}/kangqore-immp/platform-launch`,             category: 'Governance', badge: 'new' },

      { id: 'kimmp-arr-intel',           label: 'ARR Intelligence',       path: `${BASE}/kangqore-immp/arr-intelligence`,   category: 'Revenue Ops', badge: 'new' },
      { id: 'kimmp-dunning',             label: 'Dunning Automation',     path: `${BASE}/kangqore-immp/dunning`,            category: 'Revenue Ops', badge: 'new' },
      { id: 'kimmp-enterprise-pipeline', label: 'Enterprise Sales Pipeline', path: `${BASE}/kangqore-immp/enterprise-pipeline`, category: 'Revenue Ops', badge: 'new' },
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
      { id: 'aegis-autonomy',     label: 'Autonomy',     path: `${BASE}/aegis/autonomy`,     category: 'Shield' },
      { id: 'aegis-assets',       label: 'Assets',       path: `${BASE}/aegis/assets`,       category: 'Shield' },
      { id: 'aegis-egress',       label: 'Egress',       path: `${BASE}/aegis/egress`,       category: 'Shield' },
      { id: 'aegis-shield',       label: 'Shield',       path: `${BASE}/aegis/shield`,       category: 'Shield' },
      { id: 'aegis-permissions',  label: 'Permissions',  path: `${BASE}/aegis/permissions`,  category: 'Shield' },
      { id: 'aegis-enforcement',  label: 'Enforcement',  path: `${BASE}/aegis/enforcement`,  category: 'Shield',      badge: 'new' },
      { id: 'aegis-findings',     label: 'Findings',     path: `${BASE}/aegis/findings`,     category: 'Governance',  badge: 'new' },
      { id: 'aegis-ai-security-view', label: 'AI Security View', path: `${BASE}/aegis/ai-security-view`, category: 'Governance', badge: 'new' },
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
      { id: 'ont-object-sets', label: 'Object Sets', path: `${BASE}/ontology/object-sets`, category: 'Explore' },
      { id: 'ont-actions',    label: 'Actions',    path: `${BASE}/ontology/actions`,   category: 'Explore' },
      { id: 'ont-executions', label: 'Execution Log', path: `${BASE}/ontology/executions`, category: 'Explore' },
      { id: 'ont-policy-gate', label: 'Policy Gate', path: `${BASE}/ontology/policy-gate`, category: 'Govern' },
      { id: 'ont-approvals', label: 'Approvals',   path: `${BASE}/ontology/approvals`, category: 'Govern' },
      { id: 'ont-map',        label: 'Map View',    path: `${BASE}/ontology/map`,       category: 'Explore' },
      { id: 'ont-pipelines',  label: 'Pipelines',   path: `${BASE}/ontology/pipelines`, category: 'Manage' },
      { id: 'ont-migration',  label: 'Migration Accelerator', path: `${BASE}/ontology/migration`, category: 'Manage' },
      { id: 'ont-developer',  label: 'Developer',   path: `${BASE}/ontology/developer`, category: 'Manage' },
      { id: 'ont-lineage',    label: 'Lineage',    path: `${BASE}/ontology/lineage`,   category: 'Explore' },
      { id: 'ont-markings',   label: 'Markings',   path: `${BASE}/ontology/markings`,  category: 'Manage' },
      { id: 'ont-versioning', label: 'Versioning', path: `${BASE}/ontology/versioning`, category: 'Manage' },
      { id: 'ont-kore',       label: 'KORE Types', path: `${BASE}/ontology/kore-types`, category: 'Manage' },
    ],
  },
  {
    id: 'neural-network',
    label: 'Neural Network',
    icon: ShareNetworkIcon,
    defaultPath: `${BASE}/neural-network`,
    matchPrefixes: [`${BASE}/neural-network`],
    sidebarItems: [
      { id: 'nn-cortex',      label: '3D Neural Cortex',   path: `${BASE}/neural-network`,                 category: 'Cortex' },
      { id: 'nn-identity',    label: 'Identity Neurons',    path: `${BASE}/neural-network?group=identity`,    category: 'Cortex' },
      { id: 'nn-arch',        label: 'Architecture Stack',  path: `${BASE}/neural-network?group=architecture`,category: 'Cortex' },
      { id: 'nn-commercial',  label: 'Commercial Synapses', path: `${BASE}/neural-network?group=commercial`,  category: 'Cortex' },
      { id: 'nn-ops',         label: 'Ops Telemetry',       path: `${BASE}/neural-network?group=ops`,         category: 'Cortex' },
      { id: 'nn-captures',    label: 'Star Captures',       path: `${BASE}/neural-network?group=capture`,     category: 'Cortex', badge: 'live' },
    ],
  },
  {
    id: 'relay',
    label: 'RELAY',
    icon: ChatCircleDotsIcon,
    defaultPath: `${BASE}/relay`,
    matchPrefixes: [`${BASE}/relay`],
    sidebarItems: [],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    icon: HardDrivesIcon,
    defaultPath: `${BASE}/intelligence`,
    matchPrefixes: [
      `${BASE}/intelligence`,
      `${BASE}/systems`,
      `${BASE}/agent-logs`, `${BASE}/analytics`,
    ],
    sidebarItems: [
      { id: 'intel-descriptive',  label: 'What is happening?',  path: `${BASE}/intelligence`,                category: 'Enterprise Brain', badge: 'new' },
      { id: 'intel-predictive',   label: 'Predictions',         path: `${BASE}/intelligence/predictive`,     category: 'Enterprise Brain', badge: 'new' },
      { id: 'intel-prescriptive', label: 'Recommendations',     path: `${BASE}/intelligence/prescriptive`,   category: 'Enterprise Brain', badge: 'new' },
      { id: 'intel-autonomous',   label: 'Autonomous',          path: `${BASE}/intelligence/autonomous`,     category: 'Enterprise Brain', badge: 'new' },
      { id: 'systems',            label: 'Systems',             path: `${BASE}/systems`,                     category: 'Platform'          },
      { id: 'agent-logs',         label: 'Agent Logs',          path: `${BASE}/agent-logs`,                  category: 'Platform'          },
      { id: 'analytics',          label: 'Analytics',           path: `${BASE}/analytics`,                   category: 'Platform'          },
    ],
  },
  {
    id: 'work',
    label: 'Work OS',
    icon: SquaresFourIcon,
    defaultPath: `${BASE}/work/board`,
    matchPrefixes: [`${BASE}/work`],
    sidebarItems: [
      { id: 'work-board',       label: 'Board',          path: `${BASE}/work/board`,       category: 'Work OS', badge: 'new' },
      { id: 'work-table',       label: 'Table',          path: `${BASE}/work/table`,       category: 'Work OS' },
      { id: 'work-timeline',    label: 'Timeline',       path: `${BASE}/work/timeline`,    category: 'Work OS' },
      { id: 'work-graph',       label: 'Dependency',     path: `${BASE}/work/graph`,       category: 'Work OS' },
      { id: 'work-workload',    label: 'Workload',       path: `${BASE}/work/workload`,    category: 'Work OS' },
      { id: 'work-goals',       label: 'Goals',          path: `${BASE}/work/goals`,       category: 'Strategy' },
      { id: 'work-portfolio',   label: 'Portfolio',      path: `${BASE}/work/portfolio`,   category: 'Strategy' },
      { id: 'work-executive',   label: 'Command Center', path: `${BASE}/work/executive`,   category: 'Strategy' },
      { id: 'work-automations', label: 'Automations',    path: `${BASE}/work/automations`, category: 'Automation' },
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
      { id: 'settings-developer',    label: 'Developer',        path: `${BASE}/settings/developer`,        category: 'Platform' },
      { id: 'settings-integrations', label: 'Integrations',    path: `${BASE}/settings/integrations`,    category: 'Platform' },
      { id: 'settings-policies',     label: 'Policies',        path: `${BASE}/settings/policies`,        category: 'Platform' },
      { id: 'settings-semantic',     label: 'Semantic Mapping', path: `${BASE}/settings/semantic-mapping`, category: 'Platform' },
      { id: 'settings-packs',        label: 'Packs',           path: `${BASE}/settings/packs`,            category: 'Platform' },
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
      { id: 'kimmp-gateway',  label: 'Intelligence Gateway', icon: RadioIcon,     path: `${BASE}/kimmp-gateway/explorer`  },
      { id: 'kimmp-prompts',  label: 'Prompt Registry',      icon: MagicWandIcon, path: `${BASE}/kimmp-gateway/prompts`   },
      { id: 'aip-parity',     label: 'AIP Parity',           icon: TrophyIcon,    path: `${BASE}/kimmp-gateway/parity`    },
      { id: 'agent-studio',   label: 'Agent Studio',         icon: RobotIcon,     path: `${BASE}/agent-studio/builder`    },
      { id: 'systems',        label: 'Systems',        icon: HardDrivesIcon,      path: `${BASE}/systems`        },
      { id: 'aegis',          label: 'AEGIS',          icon: ShieldCheckeredIcon, path: `${BASE}/aegis`          },
      { id: 'ontology',       label: 'Ontology',       icon: GraphIcon,           path: `${BASE}/ontology`       },
      { id: 'neural-network', label: 'Neural Network', icon: ShareNetworkIcon,    path: `${BASE}/neural-network` },
      { id: 'agent-logs',     label: 'Agent Logs',     icon: ScrollIcon,          path: `${BASE}/agent-logs`     },
      { id: 'analytics',      label: 'Analytics',      icon: ChartBarIcon,        path: `${BASE}/analytics`,
        children: [
          { id: 'analytics-overview', label: 'Overview',           path: `${BASE}/analytics`            },
          { id: 'analytics-ois',      label: 'OIS Trend',          path: `${BASE}/analytics/ois`        },
          { id: 'analytics-waanda',   label: 'WAANDA Activity',    path: `${BASE}/analytics/waanda`     },
          { id: 'analytics-modules',  label: 'Module Performance', path: `${BASE}/analytics/modules`    },
          { id: 'analytics-twin',     label: 'Digital Twin™',      path: `${BASE}/analytics/twin`       },
          { id: 'analytics-agents',   label: 'Agent Performance',  path: `${BASE}/analytics/agents`     },
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
