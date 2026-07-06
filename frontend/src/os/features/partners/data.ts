import type { Partner, PartnerTask, Deliverable, PartnerPayment, PartnerNote } from './types'

export const PARTNERS: Partner[] = [
  {
    id: 'pt1', name: 'Codebridge Studio', type: 'agency', tier: 'platinum', status: 'active',
    country: 'United Kingdom', specialisms: ['React', 'Node.js', 'TypeScript', 'AWS', 'Mobile'],
    rating: 4.8, projectIds: ['pj1', 'pj5'], contact: { name: 'Tom Ashford', role: 'Lead Developer', email: 'tom@codebridge.io', phone: '+44 7700 800001' },
    joinDate: '2025-06-01', totalEarned: 148000, pendingPayment: 22000, activeTasks: 6, completedProjects: 4,
    description: 'Full-stack agency specialising in React + Node delivery. Primary partner for Alpha CRM and FinTrack.',
    logo: 'CB', hourlyRate: 185,
  },
  {
    id: 'pt2', name: 'Pixel & Co.', type: 'agency', tier: 'gold', status: 'active',
    country: 'Portugal', specialisms: ['UI/UX Design', 'Figma', 'Motion', 'Design Systems', 'Brand'],
    rating: 4.6, projectIds: ['pj3', 'pj4'], contact: { name: 'Ana Rodrigues', role: 'Creative Director', email: 'ana@pixelco.pt', phone: '+351 91 234 5678' },
    joinDate: '2025-09-15', totalEarned: 62000, pendingPayment: 8500, activeTasks: 4, completedProjects: 3,
    description: 'Award-winning design studio handling UI/UX for Nexus Portal and OS Dashboard.',
    logo: 'PX', hourlyRate: 145,
  },
  {
    id: 'pt3', name: 'DataNexus AI', type: 'consultancy', tier: 'platinum', status: 'active',
    country: 'India', specialisms: ['Python', 'ML/AI', 'LangChain', 'RAG', 'Data Engineering', 'FastAPI'],
    rating: 4.9, projectIds: ['pj2'], contact: { name: 'Arjun Mehta', role: 'Principal Consultant', email: 'arjun@datanexus.in', phone: '+91 98765 43210' },
    joinDate: '2025-07-01', totalEarned: 210000, pendingPayment: 34000, activeTasks: 5, completedProjects: 2,
    description: 'AI/ML consultancy powering eQORE RAG pipeline, lead scoring, and KIMMP signal engine.',
    logo: 'DN', hourlyRate: 160,
  },
  {
    id: 'pt4', name: 'Infra.Works', type: 'freelancer', tier: 'silver', status: 'active',
    country: 'Germany', specialisms: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'Security'],
    rating: 4.4, projectIds: ['pj2', 'pj4'], contact: { name: 'Klaus Weber', role: 'DevOps Engineer', email: 'k.weber@infra.works' },
    joinDate: '2025-11-01', totalEarned: 38500, pendingPayment: 7200, activeTasks: 3, completedProjects: 2,
    description: 'Infrastructure and DevOps specialist. Manages all AWS environments and CI/CD pipelines.',
    logo: 'IW', hourlyRate: 175,
  },
  {
    id: 'pt5', name: 'ContentFirst', type: 'freelancer', tier: 'associate', status: 'active',
    country: 'United Kingdom', specialisms: ['Content Strategy', 'SEO', 'Copywriting', 'Email Marketing'],
    rating: 4.2, projectIds: [], contact: { name: 'Jess Palmer', role: 'Content Strategist', email: 'jess@contentfirst.co.uk' },
    joinDate: '2026-01-15', totalEarned: 12000, pendingPayment: 3500, activeTasks: 2, completedProjects: 1,
    description: 'Content and SEO support for Kangqore marketing and SEA launch materials.',
    logo: 'CF', hourlyRate: 95,
  },
  {
    id: 'pt6', name: 'QA Hive', type: 'subcontractor', tier: 'silver', status: 'paused',
    country: 'Ukraine', specialisms: ['QA Testing', 'Playwright', 'Cypress', 'Test Strategy', 'Automation'],
    rating: 4.5, projectIds: ['pj1'], contact: { name: 'Olena Kovalenko', role: 'QA Lead', email: 'olena@qahive.io' },
    joinDate: '2025-10-01', totalEarned: 24000, pendingPayment: 0, activeTasks: 0, completedProjects: 3,
    description: 'QA and test automation partner. Currently paused — resumes when Sprint 4 begins.',
    logo: 'QH', hourlyRate: 85,
  },
]

export const PARTNER_TASKS: PartnerTask[] = [
  { id: 'pt1', partnerId: 'pt1', partnerName: 'Codebridge Studio', projectId: 'pj1', projectName: 'Alpha CRM', title: 'Build email integration (SMTP bidirectional)', description: 'Full email sync, threading, and log in client CRM.', status: 'in-progress', priority: 'high',   assignedDate: '2026-04-28', dueDate: '2026-05-15', storyPoints: 13, fee: 4420 },
  { id: 'pt2', partnerId: 'pt1', partnerName: 'Codebridge Studio', projectId: 'pj1', projectName: 'Alpha CRM', title: 'Analytics widget suite',                          description: 'KPI cards, funnel chart, activity chart.',        status: 'in-progress', priority: 'medium', assignedDate: '2026-04-28', dueDate: '2026-05-25', storyPoints: 8,  fee: 2775 },
  { id: 'pt3', partnerId: 'pt1', partnerName: 'Codebridge Studio', projectId: 'pj1', projectName: 'Alpha CRM', title: 'CSV import + bulk operations',                    description: 'Bulk lead import, bulk tag, bulk delete.',         status: 'assigned',    priority: 'medium', assignedDate: '2026-05-12', dueDate: '2026-06-01', storyPoints: 5,  fee: 1775 },
  { id: 'pt4', partnerId: 'pt1', partnerName: 'Codebridge Studio', projectId: 'pj5', projectName: 'FinTrack', title: 'P&L chart with drill-down',                        description: 'Monthly P&L with clickable drill into categories.',  status: 'in-progress', priority: 'high',   assignedDate: '2026-05-01', dueDate: '2026-05-28', storyPoints: 13, fee: 5550 },
  { id: 'pt5', partnerId: 'pt1', partnerName: 'Codebridge Studio', projectId: 'pj5', projectName: 'FinTrack', title: 'Multi-scenario forecast engine',                   description: 'Configurable forecast with 3 scenarios + export.',  status: 'assigned',    priority: 'high',   assignedDate: '2026-05-15', dueDate: '2026-06-15', storyPoints: 21, fee: 8325 },
  { id: 'pt6', partnerId: 'pt1', partnerName: 'Codebridge Studio', projectId: 'pj1', projectName: 'Alpha CRM', title: 'Lead scoring UI + admin config panel',            description: 'Display scores, configure signal weights.',          status: 'completed',   priority: 'high',   assignedDate: '2026-04-01', dueDate: '2026-04-14', completedDate: '2026-04-13', storyPoints: 8, fee: 2960 },
  { id: 'pt7', partnerId: 'pt2', partnerName: 'Pixel & Co.',       projectId: 'pj3', projectName: 'Nexus Portal', title: 'Earnings dashboard design',                    description: 'Full Figma screens for earnings module.',            status: 'review',      priority: 'high',   assignedDate: '2026-04-20', dueDate: '2026-05-05', storyPoints: 8,  fee: 3480 },
  { id: 'pt8', partnerId: 'pt2', partnerName: 'Pixel & Co.',       projectId: 'pj3', projectName: 'Nexus Portal', title: 'Document vault UX flow',                       description: 'Upload, preview, version, download screens.',        status: 'completed',   priority: 'medium', assignedDate: '2026-04-01', dueDate: '2026-04-20', completedDate: '2026-04-18', storyPoints: 5, fee: 2175 },
  { id: 'pt9', partnerId: 'pt2', partnerName: 'Pixel & Co.',       projectId: 'pj4', projectName: 'OS Dashboard', title: 'Design system component library',              description: 'Full Figma component set matching dev design system.', status: 'in-progress', priority: 'medium', assignedDate: '2026-05-01', dueDate: '2026-05-30', storyPoints: 13, fee: 4350 },
  { id: 'pt10',partnerId: 'pt3', partnerName: 'DataNexus AI',      projectId: 'pj2', projectName: 'eQORE v2',   title: 'RAG pipeline — Pinecone integration',            description: 'Full vector DB setup with chunking + retrieval.',    status: 'completed',   priority: 'critical',assignedDate: '2026-03-01', dueDate: '2026-04-01', completedDate: '2026-03-28', storyPoints: 21, fee: 18200 },
  { id: 'pt11',partnerId: 'pt3', partnerName: 'DataNexus AI',      projectId: 'pj2', projectName: 'eQORE v2',   title: 'Lead scoring v2 model (40+ signals)',            description: 'Train and deploy improved ML scoring model.',        status: 'review',      priority: 'critical',assignedDate: '2026-04-01', dueDate: '2026-05-05', storyPoints: 13, fee: 11200 },
  { id: 'pt12',partnerId: 'pt3', partnerName: 'DataNexus AI',      projectId: 'pj2', projectName: 'eQORE v2',   title: 'Real-time sync webhook engine',                  description: 'Event-driven sync between eQORE and external CRMs.', status: 'in-progress', priority: 'high',   assignedDate: '2026-05-01', dueDate: '2026-05-25', storyPoints: 13, fee: 9800 },
  { id: 'pt13',partnerId: 'pt4', partnerName: 'Infra.Works',       projectId: 'pj2', projectName: 'eQORE v2',   title: 'AWS infrastructure setup (prod)',                'description': 'VPC, RDS, ECS, CloudFront, WAF.',                  status: 'completed',   priority: 'high',   assignedDate: '2026-02-01', dueDate: '2026-03-01', completedDate: '2026-02-27', storyPoints: 13, fee: 7800 },
  { id: 'pt14',partnerId: 'pt4', partnerName: 'Infra.Works',       projectId: 'pj4', projectName: 'OS Dashboard','title': 'CI/CD pipeline + staging environment',        'description': 'GitHub Actions + staging on Vercel + preview URLs.',status: 'in-progress', priority: 'medium', assignedDate: '2026-05-01', dueDate: '2026-05-25', storyPoints: 8, fee: 4200 },
  { id: 'pt15',partnerId: 'pt5', partnerName: 'ContentFirst',      projectId: 'pj0', projectName: 'Marketing',  title: 'SEA launch content package (3 markets)',         description: 'Landing copy for SG, MY, ID — SEO-optimised.',      status: 'in-progress', priority: 'medium', assignedDate: '2026-05-10', dueDate: '2026-06-01', storyPoints: 5,  fee: 2850 },
]

export const DELIVERABLES: Deliverable[] = [
  { id: 'd1', partnerId: 'pt1', partnerName: 'Codebridge Studio', projectId: 'pj1', projectName: 'Alpha CRM', title: 'Sprint 1 — Core flows',          description: 'Lead pipeline, API, auth. Source code + demo video.',      status: 'approved',    dueDate: '2026-04-14', submittedDate: '2026-04-13', approvedDate: '2026-04-15', fee: 14800 },
  { id: 'd2', partnerId: 'pt1', partnerName: 'Codebridge Studio', projectId: 'pj1', projectName: 'Alpha CRM', title: 'Sprint 2 — Client profiles',      description: 'Client 360, email integration, dashboard analytics.',      status: 'approved',    dueDate: '2026-05-12', submittedDate: '2026-05-14', approvedDate: '2026-05-16', fee: 16500 },
  { id: 'd3', partnerId: 'pt1', partnerName: 'Codebridge Studio', projectId: 'pj1', projectName: 'Alpha CRM', title: 'Sprint 3 — Reporting & bulk ops', description: 'CSV, bulk actions, report builder.',                       status: 'in-progress', dueDate: '2026-06-09', fee: 14200 },
  { id: 'd4', partnerId: 'pt2', partnerName: 'Pixel & Co.',       projectId: 'pj3', projectName: 'Nexus Portal','title': 'Phase 1 UI Kit',              description: 'All Phase 1 Figma screens + component library.',          status: 'approved',    dueDate: '2026-04-01', submittedDate: '2026-03-30', approvedDate: '2026-04-02', fee: 9200, feedback: 'Excellent work. Clean, matches design system perfectly.' },
  { id: 'd5', partnerId: 'pt2', partnerName: 'Pixel & Co.',       projectId: 'pj3', projectName: 'Nexus Portal','title': 'Phase 2 UI — Earnings & Docs', description: 'Earnings dashboard + document vault screens.',             status: 'submitted',   dueDate: '2026-05-05', submittedDate: '2026-05-07', fee: 8800, feedback: 'Minor revisions needed on mobile layouts.' },
  { id: 'd6', partnerId: 'pt3', partnerName: 'DataNexus AI',      projectId: 'pj2', projectName: 'eQORE v2',  title: 'RAG Pipeline v1.0',              description: 'Full RAG implementation, docs, benchmarks.',              status: 'approved',    dueDate: '2026-04-01', submittedDate: '2026-03-28', approvedDate: '2026-04-03', fee: 18200, feedback: 'Outstanding. P95 latency under 800ms, exceeds spec.' },
  { id: 'd7', partnerId: 'pt3', partnerName: 'DataNexus AI',      projectId: 'pj2', projectName: 'eQORE v2',  title: 'Lead Scoring Model v2',          description: 'Trained model, evaluation report, deployment guide.',     status: 'revision',    dueDate: '2026-05-05', submittedDate: '2026-05-06', fee: 11200, feedback: 'Precision good but recall too low on cold leads. Retraining needed.' },
]

export const PAYMENTS: PartnerPayment[] = [
  { id: 'pp1', partnerId: 'pt1', partnerName: 'Codebridge Studio', invoiceNumber: 'CB-2026-001', description: 'Sprint 1 delivery — Alpha CRM',      amount: 14800, status: 'paid',       issuedDate: '2026-04-15', dueDate: '2026-05-15', paidDate: '2026-05-08' },
  { id: 'pp2', partnerId: 'pt1', partnerName: 'Codebridge Studio', invoiceNumber: 'CB-2026-002', description: 'Sprint 2 delivery — Alpha CRM',      amount: 16500, status: 'paid',       issuedDate: '2026-05-16', dueDate: '2026-06-15', paidDate: '2026-06-02' },
  { id: 'pp3', partnerId: 'pt1', partnerName: 'Codebridge Studio', invoiceNumber: 'CB-2026-003', description: 'FinTrack Phase 1 delivery',          amount: 22000, status: 'pending',    issuedDate: '2026-05-20', dueDate: '2026-06-20' },
  { id: 'pp4', partnerId: 'pt2', partnerName: 'Pixel & Co.',       invoiceNumber: 'PX-2026-001', description: 'Phase 1 UI Kit — Nexus Portal',     amount: 9200,  status: 'paid',       issuedDate: '2026-04-02', dueDate: '2026-05-02', paidDate: '2026-04-28' },
  { id: 'pp5', partnerId: 'pt2', partnerName: 'Pixel & Co.',       invoiceNumber: 'PX-2026-002', description: 'Phase 2 UI — Nexus Portal',         amount: 8500,  status: 'pending',    issuedDate: '2026-05-10', dueDate: '2026-06-10' },
  { id: 'pp6', partnerId: 'pt3', partnerName: 'DataNexus AI',      invoiceNumber: 'DN-2026-001', description: 'RAG Pipeline v1.0',                 amount: 18200, status: 'paid',       issuedDate: '2026-04-03', dueDate: '2026-05-03', paidDate: '2026-04-25' },
  { id: 'pp7', partnerId: 'pt3', partnerName: 'DataNexus AI',      invoiceNumber: 'DN-2026-002', description: 'KIMMP Signal Engine Phase 1',       amount: 24000, status: 'paid',       issuedDate: '2026-03-01', dueDate: '2026-04-01', paidDate: '2026-03-28' },
  { id: 'pp8', partnerId: 'pt3', partnerName: 'DataNexus AI',      invoiceNumber: 'DN-2026-003', description: 'Lead Scoring v2 + Sync Engine',    amount: 34000, status: 'processing', issuedDate: '2026-05-15', dueDate: '2026-06-15' },
  { id: 'pp9', partnerId: 'pt4', partnerName: 'Infra.Works',       invoiceNumber: 'IW-2026-001', description: 'AWS Prod Infrastructure',           amount: 7800,  status: 'paid',       issuedDate: '2026-03-01', dueDate: '2026-04-01', paidDate: '2026-03-25' },
  { id: 'pp10',partnerId: 'pt4', partnerName: 'Infra.Works',       invoiceNumber: 'IW-2026-002', description: 'CI/CD + Staging setup',             amount: 7200,  status: 'pending',    issuedDate: '2026-05-20', dueDate: '2026-06-20' },
  { id: 'pp11',partnerId: 'pt5', partnerName: 'ContentFirst',      invoiceNumber: 'CF-2026-001', description: 'Kangqore.com content refresh',      amount: 4200,  status: 'paid',       issuedDate: '2026-02-01', dueDate: '2026-03-01', paidDate: '2026-02-22' },
  { id: 'pp12',partnerId: 'pt5', partnerName: 'ContentFirst',      invoiceNumber: 'CF-2026-002', description: 'SEA launch content package',        amount: 3500,  status: 'pending',    issuedDate: '2026-05-10', dueDate: '2026-06-10' },
]

export const NOTES: PartnerNote[] = [
  { id: 'n1', partnerId: 'pt1', content: 'Tom and team consistently deliver ahead of schedule. Sprint 1 done a day early. Recommend for all future React projects.', author: 'C.O.D.E.', date: '2026-04-15', type: 'praise' },
  { id: 'n2', partnerId: 'pt1', content: 'Some communication lag last week — Tom was on holiday. Need backup contact for urgent items.', author: 'Dev Patel', date: '2026-05-08', type: 'issue' },
  { id: 'n3', partnerId: 'pt2', content: 'Ana delivered Phase 2 with minor mobile issues flagged. Good quality overall, just needs revision on 3 screens.', author: 'Anika Roy', date: '2026-05-08', type: 'performance' },
  { id: 'n4', partnerId: 'pt3', content: 'RAG pipeline benchmarks exceeded spec: P95 latency 780ms vs 800ms target. DataNexus AI is exceptional.', author: 'Ravi Nair', date: '2026-04-03', type: 'praise' },
  { id: 'n5', partnerId: 'pt3', content: 'Lead scoring recall issue on cold leads — agreed to retrain with expanded cold-start dataset by May 20.', author: 'Ravi Nair', date: '2026-05-07', type: 'performance' },
  { id: 'n6', partnerId: 'pt4', content: 'Infrastructure solid and well-documented. Klaus proactively added WAF rules we hadn\'t asked for. Great initiative.', author: 'C.O.D.E.', date: '2026-03-01', type: 'praise' },
]
