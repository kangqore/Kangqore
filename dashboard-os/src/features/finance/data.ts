import type { Invoice, BudgetLine, CashFlowPoint, ProjectFinancial } from './types'

export const INVOICES: Invoice[] = [
  {
    id: 'inv1', number: 'KQ-2026-001', client: 'TechNova Inc.', projectId: 'pj1',
    projectName: 'Alpha CRM Platform', amount: 42000, currency: 'GBP',
    status: 'paid', issueDate: '2026-01-31', dueDate: '2026-02-28', paidDate: '2026-02-20',
    items: [
      { description: 'Discovery & Architecture (80h)', quantity: 80, rate: 250, amount: 20000 },
      { description: 'UI Design — Sprint 1 (60h)',      quantity: 60, rate: 185, amount: 11100 },
      { description: 'Backend Development (30h)',        quantity: 30, rate: 195, amount: 5850  },
      { description: 'Project Management (20h)',          quantity: 20, rate: 170, amount: 3400  },
      { description: 'Infrastructure setup (8h)',         quantity: 8,  rate: 175, amount: 1400  },
    ],
  },
  {
    id: 'inv2', number: 'KQ-2026-002', client: 'TechNova Inc.', projectId: 'pj1',
    projectName: 'Alpha CRM Platform', amount: 38500, currency: 'GBP',
    status: 'paid', issueDate: '2026-02-28', dueDate: '2026-03-31', paidDate: '2026-03-25',
    items: [
      { description: 'Full-stack Development — Sprint 2 (120h)', quantity: 120, rate: 195, amount: 23400 },
      { description: 'UI/UX Design (50h)',                        quantity: 50,  rate: 185, amount: 9250  },
      { description: 'QA Testing (30h)',                          quantity: 30,  rate: 160, amount: 4800  },
    ],
  },
  {
    id: 'inv3', number: 'KQ-2026-003', client: 'Nexus Partners', projectId: 'pj3',
    projectName: 'Nexus Partner Portal', amount: 22000, currency: 'GBP',
    status: 'paid', issueDate: '2026-03-15', dueDate: '2026-04-15', paidDate: '2026-04-10',
    items: [
      { description: 'Portal Development — Phase 1 (80h)', quantity: 80, rate: 195, amount: 15600 },
      { description: 'Design & UX (35h)',                   quantity: 35, rate: 185, amount: 6475  },
    ],
  },
  {
    id: 'inv4', number: 'KQ-2026-004', client: 'TechNova Inc.', projectId: 'pj1',
    projectName: 'Alpha CRM Platform', amount: 44000, currency: 'GBP',
    status: 'sent', issueDate: '2026-04-30', dueDate: '2026-05-31',
    items: [
      { description: 'Full-stack Development — Sprint 3–4 (140h)', quantity: 140, rate: 195, amount: 27300 },
      { description: 'AI Integration — eQORE bridge (40h)',         quantity: 40,  rate: 250, amount: 10000 },
      { description: 'Project Management (40h)',                     quantity: 40,  rate: 170, amount: 6800  },
    ],
  },
  {
    id: 'inv5', number: 'KQ-2026-005', client: 'Meridian Capital', projectId: 'pj5',
    projectName: 'FinTrack Analytics Suite', amount: 28000, currency: 'GBP',
    status: 'sent', issueDate: '2026-04-30', dueDate: '2026-05-30',
    items: [
      { description: 'Analytics Dashboard Build (80h)',   quantity: 80, rate: 195, amount: 15600 },
      { description: 'Financial Modelling Integration (50h)', quantity: 50, rate: 170, amount: 8500 },
      { description: 'Design (20h)',                       quantity: 20, rate: 185, amount: 3700  },
    ],
  },
  {
    id: 'inv6', number: 'KQ-2026-006', client: 'Nexus Partners', projectId: 'pj3',
    projectName: 'Nexus Partner Portal', amount: 18500, currency: 'GBP',
    status: 'overdue', issueDate: '2026-03-31', dueDate: '2026-04-30',
    items: [
      { description: 'Portal Development — Phase 2 (70h)', quantity: 70, rate: 195, amount: 13650 },
      { description: 'Earnings Dashboard (25h)',            quantity: 25, rate: 185, amount: 4625  },
    ],
  },
  {
    id: 'inv7', number: 'KQ-2026-007', client: 'Internal', projectId: 'pj2',
    projectName: 'eQORE v2 Rebuild', amount: 15000, currency: 'GBP',
    status: 'draft', issueDate: '2026-05-01', dueDate: '2026-05-31',
    items: [
      { description: 'eQORE internal cost allocation — Q2', quantity: 1, rate: 15000, amount: 15000 },
    ],
  },
  {
    id: 'inv8', number: 'KQ-2026-008', client: 'GlobeMed Group', projectId: 'pj6',
    projectName: 'GlobeMed Patient Portal', amount: 12000, currency: 'GBP',
    status: 'draft', issueDate: '2026-05-15', dueDate: '2026-06-15',
    items: [
      { description: 'Discovery & Requirements (48h)', quantity: 48, rate: 250, amount: 12000 },
    ],
  },
]

export const BUDGET_LINES: BudgetLine[] = [
  { id: 'b1',  category: 'Personnel',      department: 'Engineering',  description: 'Engineering salaries & contractors',    allocated: 720000, spent: 310000, committed: 180000 },
  { id: 'b2',  category: 'Personnel',      department: 'Design',       description: 'Design team salaries',                  allocated: 180000, spent: 74000,  committed: 45000  },
  { id: 'b3',  category: 'Personnel',      department: 'Product',      description: 'Product & PM salaries',                 allocated: 140000, spent: 58000,  committed: 35000  },
  { id: 'b4',  category: 'Personnel',      department: 'Sales',        description: 'Sales team + commissions',              allocated: 160000, spent: 62000,  committed: 40000  },
  { id: 'b5',  category: 'Software',       department: 'Engineering',  description: 'SaaS tools, licences, APIs',            allocated: 85000,  spent: 42000,  committed: 18000  },
  { id: 'b6',  category: 'Infrastructure', department: 'Engineering',  description: 'AWS, Vercel, Supabase, CDN',            allocated: 60000,  spent: 28500,  committed: 12000  },
  { id: 'b7',  category: 'Marketing',      department: 'Sales',        description: 'Content, SEO, events, ads',             allocated: 120000, spent: 38000,  committed: 22000  },
  { id: 'b8',  category: 'Travel',         department: 'Operations',   description: 'Client visits, conferences',            allocated: 40000,  spent: 18500,  committed: 8000   },
  { id: 'b9',  category: 'Legal',          department: 'Operations',   description: 'Contracts, IP, compliance',             allocated: 55000,  spent: 32000,  committed: 15000  },
  { id: 'b10', category: 'Other',          department: 'Operations',   description: 'Office, admin, misc',                   allocated: 40000,  spent: 14000,  committed: 6000   },
]

export const CASH_FLOW: CashFlowPoint[] = [
  { month: 'Jan', inflow: 58000,  outflow: 92000,  net: -34000, runningBalance: 186000 },
  { month: 'Feb', inflow: 98500,  outflow: 88000,  net: 10500,  runningBalance: 196500 },
  { month: 'Mar', inflow: 82000,  outflow: 95000,  net: -13000, runningBalance: 183500 },
  { month: 'Apr', inflow: 118000, outflow: 102000, net: 16000,  runningBalance: 199500 },
  { month: 'May', inflow: 72000,  outflow: 98000,  net: -26000, runningBalance: 173500 },
  { month: 'Jun', inflow: 145000, outflow: 105000, net: 40000,  runningBalance: 213500 },
  { month: 'Jul', inflow: 92000,  outflow: 108000, net: -16000, runningBalance: 197500 },
  { month: 'Aug', inflow: 110000, outflow: 98000,  net: 12000,  runningBalance: 209500 },
]

export const PROJECT_FINANCIALS: ProjectFinancial[] = [
  { projectId: 'pj1', projectName: 'Alpha CRM Platform',       projectColor: '#7c22ce', client: 'TechNova Inc.',    budget: 180000, invoiced: 124500, collected: 80500, spent: 98000,  margin: 46 },
  { projectId: 'pj2', projectName: 'eQORE v2 Rebuild',          projectColor: '#2563eb', client: 'Internal',        budget: 310000, invoiced: 15000,  collected: 0,     spent: 245000, margin: 21 },
  { projectId: 'pj3', projectName: 'Nexus Partner Portal',      projectColor: '#059669', client: 'Nexus Partners',  budget: 90000,  invoiced: 40500,  collected: 22000, spent: 52000,  margin: 42 },
  { projectId: 'pj4', projectName: 'Kangqore OS Dashboard',     projectColor: '#7c22ce', client: 'Internal',        budget: 95000,  invoiced: 0,      collected: 0,     spent: 28000,  margin: 0  },
  { projectId: 'pj5', projectName: 'FinTrack Analytics Suite',  projectColor: '#d97706', client: 'Meridian Capital', budget: 140000, invoiced: 28000,  collected: 0,     spent: 45000,  margin: 38 },
  { projectId: 'pj6', projectName: 'GlobeMed Patient Portal',   projectColor: '#dc2626', client: 'GlobeMed Group',  budget: 220000, invoiced: 12000,  collected: 0,     spent: 12000,  margin: 55 },
]
