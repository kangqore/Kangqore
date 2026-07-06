import type { ComponentType } from 'react'
import {
  HouseSimpleIcon, CheckSquareIcon, MegaphoneIcon, BookOpenIcon,
  BrainIcon, UsersThreeIcon, CalendarCheckIcon, ChatCircleDotsIcon,
  BugIcon, HeadsetIcon, WrenchIcon, HardDriveIcon, ArticleIcon, NetworkIcon, KanbanIcon,
  LightningIcon, ListChecksIcon, PlugsConnectedIcon, DesktopIcon,
  UserFocusIcon, UserPlusIcon, GraduationCapIcon, StarIcon, CalendarBlankIcon, FileTextIcon, CertificateIcon,
  ChartBarIcon, InvoiceIcon, ReceiptIcon, TrendUpIcon, VaultIcon, StackIcon, BuildingsIcon,
  WarningCircleIcon, ShieldWarningIcon, KeyIcon, ShieldCheckIcon, MagnifyingGlassIcon, BellIcon,
  ScalesIcon, HandshakeIcon, BuildingIcon,
  ChartLineUpIcon, ArrowUpIcon, ActivityIcon, FunnelIcon,
  MapPinIcon, StorefrontIcon, ClipboardTextIcon,
  FactoryIcon, PackageIcon, TruckIcon, AnchorIcon, TreeStructureIcon,
  PaletteIcon, RocketLaunchIcon, HeartIcon, CompassIcon, CodeIcon, FlagIcon,
  GavelIcon, ChartPieIcon, DatabaseIcon, TargetIcon, RobotIcon, FlaskIcon,
  LightbulbFilamentIcon, PuzzlePieceIcon, GearSixIcon, SlidersHorizontalIcon,
} from '@phosphor-icons/react'

export interface NavItem {
  id:    string
  label: string
  icon:  ComponentType<any>
  path:  string
}

export interface NavGroup {
  label: string
  color: string
  items: NavItem[]
}

export interface DeptConfig {
  id:          string
  name:        string
  label:       string
  description: string
  accentColor: string
  base:        string
  navGroups:   NavGroup[]
}

const mySpace = (base: string): NavItem[] => [
  { id: 'workspace',      label: 'Workspace',     icon: HouseSimpleIcon,    path: base },
  { id: 'my-work',        label: 'My Work',       icon: CheckSquareIcon,    path: `${base}/my-work` },
  { id: 'relay',          label: 'RELAY',         icon: ChatCircleDotsIcon, path: `${base}/relay` },
  { id: 'announcements',  label: 'Announcements', icon: MegaphoneIcon,      path: `${base}/announcements` },
  { id: 'resources',      label: 'Resources',     icon: BookOpenIcon,       path: `${base}/resources` },
  { id: 'service-centre', label: 'Service Centre',icon: HeadsetIcon,        path: `${base}/service-centre` },
]

const teamItems = (base: string): NavItem[] => [
  { id: 'members',   label: 'Members',     icon: UsersThreeIcon,    path: `${base}/members` },
  { id: 'standups',  label: 'Standups',    icon: CalendarCheckIcon, path: `${base}/standups` },
  { id: 'kimmp',     label: 'KIMMP Brief', icon: BrainIcon,         path: `${base}/kimmp` },
  { id: 'skills',    label: 'Skills',      icon: CertificateIcon,   path: `${base}/skills` },
  { id: 'analytics', label: 'Analytics',   icon: ChartBarIcon,      path: `${base}/analytics` },
  { id: 'schedule',  label: 'Schedule',    icon: CalendarBlankIcon, path: `${base}/schedule` },
]

const B = (slug: string) => `/kangqore-view/team/${slug}`

export const DEPT_CONFIGS: DeptConfig[] = [
  {
    id: 'it', name: 'Information Technology', label: 'IT',
    description: 'Infrastructure, incidents, service requests & change management',
    accentColor: '#2564ea', base: B('it'),
    navGroups: [
      { label: 'MY SPACE',  color: '#2564ea', items: mySpace(B('it')) },
      { label: 'IT OPS',    color: '#4ab6d4', items: [
        { id: 'agent-workspace',  label: 'Agent Workspace',    icon: DesktopIcon,         path: `${B('it')}/agent-workspace` },
        { id: 'incidents',        label: 'Incidents',          icon: BugIcon,             path: `${B('it')}/incidents` },
        { id: 'service-requests', label: 'Service Requests',   icon: HeadsetIcon,         path: `${B('it')}/service-requests` },
        { id: 'change-mgmt',      label: 'Change Management',  icon: WrenchIcon,          path: `${B('it')}/change-mgmt` },
        { id: 'assets',           label: 'Assets',             icon: HardDriveIcon,       path: `${B('it')}/assets` },
        { id: 'knowledge-base',   label: 'Knowledge Base',     icon: ArticleIcon,         path: `${B('it')}/knowledge-base` },
        { id: 'infrastructure',   label: 'Infrastructure',     icon: NetworkIcon,         path: `${B('it')}/infrastructure` },
        { id: 'sprint-board',     label: 'Sprint Board',       icon: KanbanIcon,          path: `${B('it')}/sprint-board` },
        { id: 'playbooks',        label: 'Playbooks',          icon: ListChecksIcon,      path: `${B('it')}/playbooks` },
        { id: 'automations',      label: 'Automations',        icon: LightningIcon,       path: `${B('it')}/automations` },
        { id: 'approvals',        label: 'Approvals',          icon: ListChecksIcon,      path: `${B('it')}/approvals` },
        { id: 'integrations',     label: 'Integrations',       icon: PlugsConnectedIcon,  path: `${B('it')}/integrations` },
        { id: 'routing',          label: 'Routing',            icon: FunnelIcon,          path: `${B('it')}/routing` },
        { id: 'on-call',          label: 'On-Call',            icon: BellIcon,            path: `${B('it')}/on-call` },
        { id: 'supervisor',       label: 'Supervisor',         icon: UserFocusIcon,       path: `${B('it')}/supervisor` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('it')) },
    ],
  },
  {
    id: 'hr', name: 'Human Resources', label: 'HR',
    description: 'People, recruitment, performance & culture',
    accentColor: '#8B5CF6', base: B('hr'),
    navGroups: [
      { label: 'MY SPACE',  color: '#8B5CF6', items: mySpace(B('hr')) },
      { label: 'PEOPLE OPS',color: '#A78BFA', items: [
        { id: 'headcount',   label: 'Headcount',   icon: UserFocusIcon,     path: `${B('hr')}/headcount` },
        { id: 'recruitment', label: 'Recruitment', icon: UserPlusIcon,      path: `${B('hr')}/recruitment` },
        { id: 'onboarding',  label: 'Onboarding',  icon: GraduationCapIcon, path: `${B('hr')}/onboarding` },
        { id: 'performance', label: 'Performance', icon: StarIcon,          path: `${B('hr')}/performance` },
        { id: 'leave',       label: 'Leave',        icon: CalendarBlankIcon, path: `${B('hr')}/leave` },
        { id: 'policies',    label: 'Policies',     icon: FileTextIcon,      path: `${B('hr')}/policies` },
        { id: 'training',    label: 'Training',     icon: CertificateIcon,   path: `${B('hr')}/training` },
        { id: 'playbooks',   label: 'Playbooks',    icon: ListChecksIcon,    path: `${B('hr')}/playbooks` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('hr')) },
    ],
  },
  {
    id: 'finance', name: 'Finance', label: 'Finance',
    description: 'Budgets, invoices, expenses & financial forecasting',
    accentColor: '#10B981', base: B('finance'),
    navGroups: [
      { label: 'MY SPACE',    color: '#10B981', items: mySpace(B('finance')) },
      { label: 'FINANCE OPS', color: '#34D399', items: [
        { id: 'budget',      label: 'Budget Tracker',   icon: ChartBarIcon,  path: `${B('finance')}/budget` },
        { id: 'invoices',    label: 'Invoices',         icon: InvoiceIcon,   path: `${B('finance')}/invoices` },
        { id: 'expenses',    label: 'Expenses',         icon: ReceiptIcon,   path: `${B('finance')}/expenses` },
        { id: 'forecasting', label: 'Forecasting',      icon: TrendUpIcon,   path: `${B('finance')}/forecasting` },
        { id: 'month-end',   label: 'Month-End Close',  icon: VaultIcon,     path: `${B('finance')}/month-end` },
        { id: 'approvals',   label: 'Approvals',        icon: StackIcon,     path: `${B('finance')}/approvals` },
        { id: 'vendors',     label: 'Vendor Contracts', icon: BuildingsIcon, path: `${B('finance')}/vendors` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('finance')) },
    ],
  },
  {
    id: 'security', name: 'Security', label: 'Security',
    description: 'Risk, vulnerabilities, compliance & security operations',
    accentColor: '#EF4444', base: B('security'),
    navGroups: [
      { label: 'MY SPACE',     color: '#EF4444', items: mySpace(B('security')) },
      { label: 'SECURITY OPS', color: '#F87171', items: [
        { id: 'risk-register',   label: 'Risk Register',       icon: WarningCircleIcon,   path: `${B('security')}/risk-register` },
        { id: 'vulnerabilities', label: 'Vulnerabilities',     icon: BugIcon,             path: `${B('security')}/vulnerabilities` },
        { id: 'sec-incidents',   label: 'Security Incidents',  icon: ShieldWarningIcon,   path: `${B('security')}/incidents` },
        { id: 'access-reviews',  label: 'Access Reviews',      icon: KeyIcon,             path: `${B('security')}/access-reviews` },
        { id: 'controls',        label: 'Compliance Controls', icon: ShieldCheckIcon,     path: `${B('security')}/controls` },
        { id: 'pen-test',        label: 'Pen Test Tracker',    icon: MagnifyingGlassIcon, path: `${B('security')}/pen-test` },
        { id: 'awareness',       label: 'Security Awareness',  icon: BellIcon,            path: `${B('security')}/awareness` },
        { id: 'playbooks',       label: 'Playbooks',           icon: ListChecksIcon,      path: `${B('security')}/playbooks` },
        { id: 'routing',         label: 'Routing',             icon: FunnelIcon,          path: `${B('security')}/routing` },
        { id: 'on-call',         label: 'On-Call',             icon: BellIcon,            path: `${B('security')}/on-call` },
        { id: 'supervisor',      label: 'Supervisor',          icon: UserFocusIcon,       path: `${B('security')}/supervisor` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('security')) },
    ],
  },
  {
    id: 'legal', name: 'Legal', label: 'Legal',
    description: 'Contracts, matters, NDAs & compliance calendar',
    accentColor: '#F59E0B', base: B('legal'),
    navGroups: [
      { label: 'MY SPACE',  color: '#F59E0B', items: mySpace(B('legal')) },
      { label: 'LEGAL OPS', color: '#FBBF24', items: [
        { id: 'contracts',  label: 'Contract Register',   icon: HandshakeIcon,     path: `${B('legal')}/contracts` },
        { id: 'matters',    label: 'Legal Matters',       icon: ScalesIcon,        path: `${B('legal')}/matters` },
        { id: 'ndas',       label: 'NDA Tracker',         icon: FileTextIcon,      path: `${B('legal')}/ndas` },
        { id: 'calendar',   label: 'Compliance Calendar', icon: CalendarBlankIcon, path: `${B('legal')}/calendar` },
        { id: 'entities',   label: 'Entity Register',     icon: BuildingIcon,      path: `${B('legal')}/entities` },
        { id: 'approvals',  label: 'Approval Queue',      icon: StackIcon,         path: `${B('legal')}/approvals` },
        { id: 'clauses',    label: 'Clause Library',      icon: ArticleIcon,       path: `${B('legal')}/clauses` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('legal')) },
    ],
  },
  {
    id: 'support', name: 'Customer Support', label: 'Support',
    description: 'Ticket queue, SLA tracking, CSAT & agent performance',
    accentColor: '#06B6D4', base: B('support'),
    navGroups: [
      { label: 'MY SPACE',    color: '#06B6D4', items: mySpace(B('support')) },
      { label: 'SUPPORT OPS', color: '#22D3EE', items: [
        { id: 'agent-workspace', label: 'Agent Workspace',  icon: DesktopIcon,     path: `${B('support')}/agent-workspace` },
        { id: 'queue',           label: 'Ticket Queue',     icon: StackIcon,       path: `${B('support')}/queue` },
        { id: 'sla',             label: 'SLA Dashboard',    icon: ChartLineUpIcon, path: `${B('support')}/sla` },
        { id: 'escalations',     label: 'Escalations',      icon: ArrowUpIcon,     path: `${B('support')}/escalations` },
        { id: 'csat',            label: 'CSAT',             icon: StarIcon,        path: `${B('support')}/csat` },
        { id: 'knowledge',       label: 'Knowledge Base',   icon: ArticleIcon,     path: `${B('support')}/knowledge` },
        { id: 'performance',     label: 'Agent Performance',icon: ActivityIcon,    path: `${B('support')}/performance` },
        { id: 'backlog',         label: 'Backlog',          icon: FunnelIcon,      path: `${B('support')}/backlog` },
        { id: 'playbooks',       label: 'Playbooks',        icon: ListChecksIcon,  path: `${B('support')}/playbooks` },
        { id: 'routing',         label: 'Routing',          icon: FunnelIcon,      path: `${B('support')}/routing` },
        { id: 'on-call',         label: 'On-Call',          icon: BellIcon,        path: `${B('support')}/on-call` },
        { id: 'supervisor',      label: 'Supervisor',       icon: UserFocusIcon,   path: `${B('support')}/supervisor` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('support')) },
    ],
  },
  {
    id: 'facilities', name: 'Facilities', label: 'Facilities',
    description: 'Work orders, space management, assets & inspections',
    accentColor: '#F97316', base: B('facilities'),
    navGroups: [
      { label: 'MY SPACE',      color: '#F97316', items: mySpace(B('facilities')) },
      { label: 'FACILITIES OPS',color: '#FB923C', items: [
        { id: 'work-orders',  label: 'Work Orders',      icon: WrenchIcon,       path: `${B('facilities')}/work-orders` },
        { id: 'space',        label: 'Space Management', icon: MapPinIcon,       path: `${B('facilities')}/space` },
        { id: 'assets',       label: 'Asset Register',   icon: ClipboardTextIcon,path: `${B('facilities')}/assets` },
        { id: 'vendors',      label: 'Vendor Directory', icon: StorefrontIcon,   path: `${B('facilities')}/vendors` },
        { id: 'inspections',  label: 'Inspections',      icon: CheckSquareIcon,  path: `${B('facilities')}/inspections` },
        { id: 'leases',       label: 'Lease Register',   icon: KeyIcon,          path: `${B('facilities')}/leases` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('facilities')) },
    ],
  },
  {
    id: 'supply-chain', name: 'Manufacturing & Supply Chain', label: 'Supply Chain',
    description: 'Production, inventory, suppliers, logistics & quality control',
    accentColor: '#6366F1', base: B('supply-chain'),
    navGroups: [
      { label: 'MY SPACE',   color: '#6366F1', items: mySpace(B('supply-chain')) },
      { label: 'SUPPLY OPS', color: '#818CF8', items: [
        { id: 'production',  label: 'Production Orders', icon: FactoryIcon,      path: `${B('supply-chain')}/production` },
        { id: 'inventory',   label: 'Inventory',         icon: PackageIcon,      path: `${B('supply-chain')}/inventory` },
        { id: 'suppliers',   label: 'Suppliers',         icon: TruckIcon,        path: `${B('supply-chain')}/suppliers` },
        { id: 'qc',          label: 'Quality Control',   icon: ShieldCheckIcon,  path: `${B('supply-chain')}/qc` },
        { id: 'procurement', label: 'Procurement',       icon: ReceiptIcon,      path: `${B('supply-chain')}/procurement` },
        { id: 'logistics',   label: 'Logistics',         icon: AnchorIcon,       path: `${B('supply-chain')}/logistics` },
        { id: 'bom',         label: 'Bill of Materials', icon: TreeStructureIcon,path: `${B('supply-chain')}/bom` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('supply-chain')) },
    ],
  },

  // ── New departments ────────────────────────────────────────────────────────

  {
    id: 'marketing', name: 'Marketing', label: 'Marketing',
    description: 'Campaigns, content, brand, SEO & demand generation',
    accentColor: '#EC4899', base: B('marketing'),
    navGroups: [
      { label: 'MY SPACE',      color: '#EC4899', items: mySpace(B('marketing')) },
      { label: 'MARKETING OPS', color: '#F472B6', items: [
        { id: 'campaigns', label: 'Campaigns',  icon: MegaphoneIcon,       path: `${B('marketing')}/campaigns` },
        { id: 'content',   label: 'Content',    icon: ArticleIcon,         path: `${B('marketing')}/content` },
        { id: 'brand',     label: 'Brand',      icon: PaletteIcon,         path: `${B('marketing')}/brand` },
        { id: 'seo',       label: 'SEO',        icon: MagnifyingGlassIcon, path: `${B('marketing')}/seo` },
        { id: 'events',    label: 'Events',     icon: CalendarBlankIcon,   path: `${B('marketing')}/events` },
        { id: 'budget',    label: 'Budget',     icon: ChartBarIcon,        path: `${B('marketing')}/budget` },
        { id: 'playbooks', label: 'Playbooks',  icon: ListChecksIcon,      path: `${B('marketing')}/playbooks` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('marketing')) },
    ],
  },
  {
    id: 'sales', name: 'Sales', label: 'Sales',
    description: 'Pipeline, leads, proposals, accounts & revenue targets',
    accentColor: '#0EA5E9', base: B('sales'),
    navGroups: [
      { label: 'MY SPACE',  color: '#0EA5E9', items: mySpace(B('sales')) },
      { label: 'SALES OPS', color: '#38BDF8', items: [
        { id: 'agent-workspace', label: 'Agent Workspace', icon: DesktopIcon,      path: `${B('sales')}/agent-workspace` },
        { id: 'pipeline',        label: 'Pipeline',        icon: FunnelIcon,        path: `${B('sales')}/pipeline` },
        { id: 'leads',           label: 'Leads',           icon: UserPlusIcon,      path: `${B('sales')}/leads` },
        { id: 'proposals',       label: 'Proposals',       icon: FileTextIcon,      path: `${B('sales')}/proposals` },
        { id: 'accounts',        label: 'Accounts',        icon: BuildingIcon,      path: `${B('sales')}/accounts` },
        { id: 'targets',         label: 'Targets',         icon: ChartLineUpIcon,   path: `${B('sales')}/targets` },
        { id: 'contracts',       label: 'Contracts',       icon: HandshakeIcon,     path: `${B('sales')}/contracts` },
        { id: 'playbooks',       label: 'Playbooks',       icon: ListChecksIcon,    path: `${B('sales')}/playbooks` },
        { id: 'routing',         label: 'Routing',         icon: FunnelIcon,        path: `${B('sales')}/routing` },
        { id: 'supervisor',      label: 'Supervisor',      icon: UserFocusIcon,     path: `${B('sales')}/supervisor` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('sales')) },
    ],
  },
  {
    id: 'customer-success', name: 'Customer Success', label: 'Customer Success',
    description: 'Account health, QBRs, renewals & expansion revenue',
    accentColor: '#14B8A6', base: B('customer-success'),
    navGroups: [
      { label: 'MY SPACE', color: '#14B8A6', items: mySpace(B('customer-success')) },
      { label: 'CS OPS',   color: '#2DD4BF', items: [
        { id: 'agent-workspace', label: 'Agent Workspace',  icon: DesktopIcon,       path: `${B('customer-success')}/agent-workspace` },
        { id: 'accounts',        label: 'Accounts',         icon: BuildingIcon,       path: `${B('customer-success')}/accounts` },
        { id: 'health',          label: 'Health Dashboard', icon: HeartIcon,          path: `${B('customer-success')}/health` },
        { id: 'qbrs',            label: 'QBRs',             icon: ChartLineUpIcon,    path: `${B('customer-success')}/qbrs` },
        { id: 'renewals',        label: 'Renewals',         icon: CalendarBlankIcon,  path: `${B('customer-success')}/renewals` },
        { id: 'onboarding',      label: 'Onboarding',       icon: GraduationCapIcon,  path: `${B('customer-success')}/onboarding` },
        { id: 'expansion',       label: 'Expansion',        icon: TrendUpIcon,        path: `${B('customer-success')}/expansion` },
        { id: 'playbooks',       label: 'Playbooks',        icon: ListChecksIcon,     path: `${B('customer-success')}/playbooks` },
        { id: 'routing',         label: 'Routing',          icon: FunnelIcon,         path: `${B('customer-success')}/routing` },
        { id: 'supervisor',      label: 'Supervisor',       icon: UserFocusIcon,      path: `${B('customer-success')}/supervisor` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('customer-success')) },
    ],
  },
  {
    id: 'product', name: 'Product', label: 'Product',
    description: 'Roadmap, sprints, features, releases & user research',
    accentColor: '#A855F7', base: B('product'),
    navGroups: [
      { label: 'MY SPACE',    color: '#A855F7', items: mySpace(B('product')) },
      { label: 'PRODUCT OPS', color: '#C084FC', items: [
        { id: 'roadmap',   label: 'Roadmap',   icon: CompassIcon,         path: `${B('product')}/roadmap` },
        { id: 'sprints',   label: 'Sprints',   icon: KanbanIcon,          path: `${B('product')}/sprints` },
        { id: 'features',  label: 'Features',  icon: ListChecksIcon,      path: `${B('product')}/features` },
        { id: 'releases',  label: 'Releases',  icon: RocketLaunchIcon,    path: `${B('product')}/releases` },
        { id: 'research',  label: 'Research',  icon: MagnifyingGlassIcon, path: `${B('product')}/research` },
        { id: 'design',    label: 'Design',    icon: PaletteIcon,         path: `${B('product')}/design` },
        { id: 'playbooks', label: 'Playbooks', icon: ListChecksIcon,      path: `${B('product')}/playbooks` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('product')) },
    ],
  },
  {
    id: 'engineering', name: 'Engineering', label: 'Engineering',
    description: 'Sprints, architecture, deployments, tech debt & monitoring',
    accentColor: '#84CC16', base: B('engineering'),
    navGroups: [
      { label: 'MY SPACE',        color: '#84CC16', items: mySpace(B('engineering')) },
      { label: 'ENGINEERING OPS', color: '#A3E635', items: [
        { id: 'sprints',      label: 'Sprints',       icon: KanbanIcon,      path: `${B('engineering')}/sprints` },
        { id: 'repos',        label: 'Repositories',  icon: CodeIcon,        path: `${B('engineering')}/repos` },
        { id: 'architecture', label: 'Architecture',  icon: NetworkIcon,     path: `${B('engineering')}/architecture` },
        { id: 'deployments',  label: 'Deployments',   icon: RocketLaunchIcon,path: `${B('engineering')}/deployments` },
        { id: 'tech-debt',    label: 'Tech Debt',     icon: WrenchIcon,      path: `${B('engineering')}/tech-debt` },
        { id: 'monitoring',   label: 'Monitoring',    icon: ActivityIcon,    path: `${B('engineering')}/monitoring` },
        { id: 'playbooks',    label: 'Playbooks',     icon: ListChecksIcon,  path: `${B('engineering')}/playbooks` },
        { id: 'on-call',      label: 'On-Call',       icon: BellIcon,        path: `${B('engineering')}/on-call` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('engineering')) },
    ],
  },
  {
    id: 'delivery', name: 'Delivery', label: 'Delivery',
    description: 'Client projects, resource allocation, SOWs & delivery governance',
    accentColor: '#F43F5E', base: B('delivery'),
    navGroups: [
      { label: 'MY SPACE',     color: '#F43F5E', items: mySpace(B('delivery')) },
      { label: 'DELIVERY OPS', color: '#FB7185', items: [
        { id: 'projects',   label: 'Projects',    icon: ClipboardTextIcon, path: `${B('delivery')}/projects` },
        { id: 'resources',  label: 'Resources',   icon: UsersThreeIcon,    path: `${B('delivery')}/resources` },
        { id: 'milestones', label: 'Milestones',  icon: FlagIcon,          path: `${B('delivery')}/milestones` },
        { id: 'risks',      label: 'Risks',       icon: WarningCircleIcon, path: `${B('delivery')}/risks` },
        { id: 'sows',       label: 'SOWs',        icon: HandshakeIcon,     path: `${B('delivery')}/sows` },
        { id: 'reports',    label: 'Reports',     icon: ChartBarIcon,      path: `${B('delivery')}/reports` },
        { id: 'playbooks',  label: 'Playbooks',   icon: ListChecksIcon,    path: `${B('delivery')}/playbooks` },
        { id: 'on-call',    label: 'On-Call',     icon: BellIcon,          path: `${B('delivery')}/on-call` },
        { id: 'supervisor', label: 'Supervisor',  icon: UserFocusIcon,     path: `${B('delivery')}/supervisor` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('delivery')) },
    ],
  },

  // ── Enterprise-grade additions ────────────────────────────────────────────

  {
    id: 'risk-compliance', name: 'Risk & Compliance', label: 'Risk & Compliance',
    description: 'ISO 27001, SOC 2, GDPR, DPDP, audit management & vendor risk',
    accentColor: '#B91C1C', base: B('risk-compliance'),
    navGroups: [
      { label: 'MY SPACE', color: '#B91C1C', items: mySpace(B('risk-compliance')) },
      { label: 'RISK OPS', color: '#EF4444', items: [
        { id: 'risk-register', label: 'Risk Register',       icon: WarningCircleIcon, path: `${B('risk-compliance')}/risk-register` },
        { id: 'frameworks',    label: 'Frameworks',          icon: ShieldCheckIcon,   path: `${B('risk-compliance')}/frameworks` },
        { id: 'audits',        label: 'Audit Management',    icon: GavelIcon,         path: `${B('risk-compliance')}/audits` },
        { id: 'vendor-risk',   label: 'Vendor Risk',         icon: BuildingsIcon,     path: `${B('risk-compliance')}/vendor-risk` },
        { id: 'policies',      label: 'Policies & Controls', icon: FileTextIcon,      path: `${B('risk-compliance')}/policies` },
        { id: 'exceptions',    label: 'Exceptions',          icon: WarningCircleIcon, path: `${B('risk-compliance')}/exceptions` },
        { id: 'playbooks',     label: 'Playbooks',           icon: ListChecksIcon,    path: `${B('risk-compliance')}/playbooks` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('risk-compliance')) },
    ],
  },
  {
    id: 'procurement', name: 'Procurement', label: 'Procurement',
    description: 'Purchase requests, orders, vendor management & spend governance',
    accentColor: '#7C3AED', base: B('procurement'),
    navGroups: [
      { label: 'MY SPACE',        color: '#7C3AED', items: mySpace(B('procurement')) },
      { label: 'PROCUREMENT OPS', color: '#A78BFA', items: [
        { id: 'requests',  label: 'Purchase Requests', icon: ReceiptIcon,   path: `${B('procurement')}/requests` },
        { id: 'orders',    label: 'Purchase Orders',   icon: FileTextIcon,  path: `${B('procurement')}/orders` },
        { id: 'vendors',   label: 'Vendor Directory',  icon: BuildingsIcon, path: `${B('procurement')}/vendors` },
        { id: 'contracts', label: 'Contracts',         icon: HandshakeIcon, path: `${B('procurement')}/contracts` },
        { id: 'spend',     label: 'Spend Analysis',    icon: ChartBarIcon,  path: `${B('procurement')}/spend` },
        { id: 'catalogue', label: 'Catalogue',         icon: PackageIcon,   path: `${B('procurement')}/catalogue` },
        { id: 'approvals', label: 'Approvals',         icon: StackIcon,     path: `${B('procurement')}/approvals` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('procurement')) },
    ],
  },
  {
    id: 'data-analytics', name: 'Data & Analytics', label: 'Data & Analytics',
    description: 'Dashboards, BI, KPI registry, data governance & forecasting',
    accentColor: '#0284C7', base: B('data-analytics'),
    navGroups: [
      { label: 'MY SPACE', color: '#0284C7', items: mySpace(B('data-analytics')) },
      { label: 'DATA OPS', color: '#38BDF8', items: [
        { id: 'dashboards',   label: 'Dashboards',      icon: ChartPieIcon,   path: `${B('data-analytics')}/dashboards` },
        { id: 'reports',      label: 'Reports',         icon: ArticleIcon,    path: `${B('data-analytics')}/reports` },
        { id: 'kpi-registry', label: 'KPI Registry',    icon: TargetIcon,     path: `${B('data-analytics')}/kpi-registry` },
        { id: 'data-sources', label: 'Data Sources',    icon: DatabaseIcon,   path: `${B('data-analytics')}/data-sources` },
        { id: 'governance',   label: 'Data Governance', icon: ShieldCheckIcon,path: `${B('data-analytics')}/governance` },
        { id: 'bi-requests',  label: 'BI Requests',     icon: ChartBarIcon,   path: `${B('data-analytics')}/bi-requests` },
        { id: 'forecasting',  label: 'Forecasting',     icon: TrendUpIcon,    path: `${B('data-analytics')}/forecasting` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('data-analytics')) },
    ],
  },
  {
    id: 'ai-automation', name: 'AI & Automation', label: 'AI & Automation',
    description: 'Agents, workflows, LLM operations, automation hub & AI governance',
    accentColor: '#D946EF', base: B('ai-automation'),
    navGroups: [
      { label: 'MY SPACE', color: '#D946EF', items: mySpace(B('ai-automation')) },
      { label: 'AI OPS',   color: '#E879F9', items: [
        { id: 'agents',      label: 'Agent Registry', icon: RobotIcon,          path: `${B('ai-automation')}/agents` },
        { id: 'workflows',   label: 'Workflows',      icon: LightningIcon,      path: `${B('ai-automation')}/workflows` },
        { id: 'llm-ops',     label: 'LLM Operations', icon: BrainIcon,          path: `${B('ai-automation')}/llm-ops` },
        { id: 'automation',  label: 'Automation Hub', icon: PlugsConnectedIcon, path: `${B('ai-automation')}/automation` },
        { id: 'governance',  label: 'AI Governance',  icon: ShieldCheckIcon,    path: `${B('ai-automation')}/governance` },
        { id: 'experiments', label: 'Experiments',    icon: FlaskIcon,          path: `${B('ai-automation')}/experiments` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('ai-automation')) },
    ],
  },
  {
    id: 'innovation-rd', name: 'Innovation & R&D', label: 'Innovation / R&D',
    description: 'Ideas pipeline, experiments, prototypes, patents & research library',
    accentColor: '#CA8A04', base: B('innovation-rd'),
    navGroups: [
      { label: 'MY SPACE', color: '#CA8A04', items: mySpace(B('innovation-rd')) },
      { label: 'R&D OPS',  color: '#FCD34D', items: [
        { id: 'ideas',       label: 'Ideas Pipeline',  icon: LightbulbFilamentIcon, path: `${B('innovation-rd')}/ideas` },
        { id: 'experiments', label: 'Experiments',     icon: FlaskIcon,             path: `${B('innovation-rd')}/experiments` },
        { id: 'prototypes',  label: 'Prototypes',      icon: PuzzlePieceIcon,       path: `${B('innovation-rd')}/prototypes` },
        { id: 'research',    label: 'Research Library',icon: ArticleIcon,           path: `${B('innovation-rd')}/research` },
        { id: 'patents',     label: 'Patents',         icon: CertificateIcon,       path: `${B('innovation-rd')}/patents` },
        { id: 'partners',    label: 'Partners',        icon: HandshakeIcon,         path: `${B('innovation-rd')}/partners` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('innovation-rd')) },
    ],
  },
  {
    id: 'operations', name: 'Operations', label: 'Operations',
    description: 'Business processes, capacity planning, BCP & SLA governance',
    accentColor: '#16A34A', base: B('operations'),
    navGroups: [
      { label: 'MY SPACE', color: '#16A34A', items: mySpace(B('operations')) },
      { label: 'OPS HUB',  color: '#4ADE80', items: [
        { id: 'processes', label: 'Process Registry',    icon: GearSixIcon,    path: `${B('operations')}/processes` },
        { id: 'capacity',  label: 'Capacity Planning',   icon: ChartBarIcon,   path: `${B('operations')}/capacity` },
        { id: 'vendors',   label: 'Vendor Management',   icon: BuildingsIcon,  path: `${B('operations')}/vendors` },
        { id: 'bcp',       label: 'Business Continuity', icon: ShieldCheckIcon,path: `${B('operations')}/bcp` },
        { id: 'sla',       label: 'SLA Tracker',         icon: ActivityIcon,   path: `${B('operations')}/sla` },
        { id: 'approvals', label: 'Approvals',           icon: StackIcon,      path: `${B('operations')}/approvals` },
        { id: 'reporting', label: 'Reporting',           icon: ArticleIcon,    path: `${B('operations')}/reporting` },
      ]},
      { label: 'TEAM', color: '#6366F1', items: teamItems(B('operations')) },
    ],
  },
]

export const DEPT_MAP = Object.fromEntries(DEPT_CONFIGS.map(d => [d.id, d])) as Record<string, DeptConfig>
