import type { Department, OrgNode, DeptBudget } from './types'

export const DEPARTMENTS: Department[] = [
  {
    id: 'd1', name: 'Engineering', head: 'Dev Patel', headTitle: 'CTO',
    status: 'scaling', headcount: 6, openRoles: 2, budget: 620, spent: 285, budgetStatus: 'on-track',
    costCenter: 'CC-ENG', description: 'Full-stack product engineering, infrastructure, and AI/ML platform.',
    kpis: [
      { metric: 'Sprint velocity', value: '42 pts/sprint', trend: 'up' },
      { metric: 'Deploy frequency', value: '4.2/week', trend: 'up' },
      { metric: 'Bug backlog', value: '18 open', trend: 'down' },
    ],
    tags: ['product', 'platform', 'ai'],
  },
  {
    id: 'd2', name: 'Design & Product', head: 'Anika Roy', headTitle: 'Head of Product',
    status: 'active', headcount: 3, openRoles: 1, budget: 220, spent: 98, budgetStatus: 'on-track',
    costCenter: 'CC-PRD', description: 'Product strategy, UX design, and design system ownership.',
    kpis: [
      { metric: 'Features shipped', value: '8 this quarter', trend: 'up' },
      { metric: 'Design debt tickets', value: '12 open', trend: 'neutral' },
      { metric: 'User feedback score', value: '4.3 / 5', trend: 'up' },
    ],
    tags: ['ux', 'design-system', 'product-strategy'],
  },
  {
    id: 'd3', name: 'Sales & GTM', head: 'Sofia Mendez', headTitle: 'Head of Sales',
    status: 'scaling', headcount: 3, openRoles: 1, budget: 310, spent: 160, budgetStatus: 'at-risk',
    costCenter: 'CC-SAL', description: 'Pipeline development, AE coverage, and go-to-market execution.',
    kpis: [
      { metric: 'Pipeline value', value: '£1.43M', trend: 'up' },
      { metric: 'Deals closed (QTD)', value: '3', trend: 'up' },
      { metric: 'Average sales cycle', value: '47 days', trend: 'neutral' },
    ],
    tags: ['pipeline', 'outbound', 'enterprise'],
  },
  {
    id: 'd4', name: 'Client Delivery', head: 'Ravi Nair', headTitle: 'Head of Delivery',
    status: 'active', headcount: 4, openRoles: 0, budget: 280, spent: 130, budgetStatus: 'on-track',
    costCenter: 'CC-DEL', description: 'Client project delivery, SLAs, and account management.',
    kpis: [
      { metric: 'On-time delivery', value: '91%', trend: 'up' },
      { metric: 'NPS (client)', value: '72', trend: 'up' },
      { metric: 'Active projects', value: '6', trend: 'neutral' },
    ],
    tags: ['delivery', 'sla', 'account-management'],
  },
  {
    id: 'd5', name: 'Finance & Ops', head: 'Mahesh Kumar', headTitle: 'CEO / CFO',
    status: 'active', headcount: 2, openRoles: 0, budget: 120, spent: 54, budgetStatus: 'under',
    costCenter: 'CC-FIN', description: 'Financial reporting, cash management, legal, and company operations.',
    kpis: [
      { metric: 'Runway', value: '16 months', trend: 'neutral' },
      { metric: 'Cash burn / month', value: '£57k', trend: 'neutral' },
      { metric: 'AR outstanding', value: '£145k', trend: 'down' },
    ],
    tags: ['finance', 'legal', 'ops'],
  },
]

export const ORG_NODES: OrgNode[] = [
  { id: 'o1',  name: 'Mahesh Kumar',   title: 'CEO',                  department: 'Finance & Ops',    level: 0 },
  { id: 'o2',  name: 'Dev Patel',      title: 'CTO',                  department: 'Engineering',      level: 1, reportsTo: 'o1', headcount: 6 },
  { id: 'o3',  name: 'Anika Roy',      title: 'Head of Product',      department: 'Design & Product', level: 1, reportsTo: 'o1', headcount: 3 },
  { id: 'o4',  name: 'Sofia Mendez',   title: 'Head of Sales',        department: 'Sales & GTM',      level: 1, reportsTo: 'o1', headcount: 3 },
  { id: 'o5',  name: 'Ravi Nair',      title: 'Head of Delivery',     department: 'Client Delivery',  level: 1, reportsTo: 'o1', headcount: 4 },
  { id: 'o6',  name: 'Priya Chen',     title: 'Senior Engineer',      department: 'Engineering',      level: 2, reportsTo: 'o2' },
  { id: 'o7',  name: 'Jake Morton',    title: 'Backend Engineer',     department: 'Engineering',      level: 2, reportsTo: 'o2' },
  { id: 'o8',  name: 'Sara Lin',       title: 'Frontend Engineer',    department: 'Engineering',      level: 2, reportsTo: 'o2' },
  { id: 'o9',  name: 'Tom Hughes',     title: 'DevOps Engineer',      department: 'Engineering',      level: 2, reportsTo: 'o2' },
  { id: 'o10', name: 'Leila Amara',    title: 'Product Designer',     department: 'Design & Product', level: 2, reportsTo: 'o3' },
  { id: 'o11', name: 'Chris Ward',     title: 'AE — Enterprise',      department: 'Sales & GTM',      level: 2, reportsTo: 'o4' },
  { id: 'o12', name: 'Natasha Bloom',  title: 'SDR',                  department: 'Sales & GTM',      level: 3, reportsTo: 'o4' },
  { id: 'o13', name: 'Omar Khalid',    title: 'Delivery Lead',        department: 'Client Delivery',  level: 2, reportsTo: 'o5' },
  { id: 'o14', name: 'Amy Tan',        title: 'QA Engineer',          department: 'Client Delivery',  level: 3, reportsTo: 'o5' },
]

export const DEPT_BUDGETS: DeptBudget[] = [
  {
    deptId: 'd1', deptName: 'Engineering',
    annual: 620, q1: 155, q1Spent: 148, q2: 155, q2Spent: 137, q3: 155, q3Budget: 155, q4: 155, q4Budget: 155,
    categories: [
      { name: 'Salaries', budget: 480, spent: 220 },
      { name: 'Cloud / Infra', budget: 72, spent: 38 },
      { name: 'Tools & Licences', budget: 38, spent: 18 },
      { name: 'Training', budget: 30, spent: 9 },
    ],
  },
  {
    deptId: 'd2', deptName: 'Design & Product',
    annual: 220, q1: 55, q1Spent: 51, q2: 55, q2Spent: 47, q3: 55, q3Budget: 55, q4: 55, q4Budget: 55,
    categories: [
      { name: 'Salaries', budget: 180, spent: 83 },
      { name: 'Design Tools', budget: 22, spent: 9 },
      { name: 'User Research', budget: 18, spent: 6 },
    ],
  },
  {
    deptId: 'd3', deptName: 'Sales & GTM',
    annual: 310, q1: 78, q1Spent: 82, q2: 78, q2Spent: 78, q3: 77, q3Budget: 77, q4: 77, q4Budget: 77,
    categories: [
      { name: 'Salaries & OTE', budget: 220, spent: 108 },
      { name: 'Marketing Spend', budget: 50, spent: 34 },
      { name: 'Travel & Events', budget: 25, spent: 15 },
      { name: 'CRM & Tools', budget: 15, spent: 3 },
    ],
  },
  {
    deptId: 'd4', deptName: 'Client Delivery',
    annual: 280, q1: 70, q1Spent: 66, q2: 70, q2Spent: 64, q3: 70, q3Budget: 70, q4: 70, q4Budget: 70,
    categories: [
      { name: 'Salaries', budget: 240, spent: 112 },
      { name: 'Subcontractors', budget: 30, spent: 16 },
      { name: 'Tools', budget: 10, spent: 2 },
    ],
  },
]
