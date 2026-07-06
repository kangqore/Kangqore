import type { Lead, eQORESignal, LeadActivity, NurtureSequence } from './types'

export const LEADS: Lead[] = [
  { id: 'l1',  company: 'Apex Ventures',        contactName: 'Marcus Reid',      contactRole: 'CTO',               email: 'marcus@apexventures.io',   phone: '+44 7700 111001', country: 'UK',          industry: 'VC / PE',            stage: 'proposal',    source: 'eQORE',    score: 84, value: 280000, probability: 60, owner: 'C.O.D.E.',  createdAt: '2026-03-10', lastActivity: '2026-05-27', tags: ['high-value','investor-portal','ai'],          description: 'Apex wants a full investment management OS. eQORE flagged as top-tier ICP match.'  },
  { id: 'l2',  company: 'Synapse Health',        contactName: 'Dr. Priya Rao',    contactRole: 'Chief Digital Officer',email:'priya@synapsehealth.com', phone: '+65 9000 2001',  country: 'Singapore',   industry: 'Healthcare',         stage: 'negotiation', source: 'referral', score: 91, value: 320000, probability: 75, owner: 'Dev Patel',     createdAt: '2026-02-15', lastActivity: '2026-05-28', tags: ['strategic','healthcare','hipaa'],             description: 'GlobeMed referral. Patient portal + telemedicine. Strong fit, contract close expected.' },
  { id: 'l3',  company: 'RetailEdge',            contactName: 'Sophie Laurent',   contactRole: 'Head of E-Commerce', email:'slaurent@retailedge.fr',                             country: 'France',      industry: 'Retail',             stage: 'qualified',   source: 'inbound',  score: 67, value: 95000,  probability: 35, owner: 'Anika Roy',     createdAt: '2026-04-02', lastActivity: '2026-05-22', tags: ['e-commerce','frontend','design'],             description: 'Inbound from content. Wants D2C platform redesign + CRM integration.'              },
  { id: 'l4',  company: 'Orion Financial',       contactName: 'Ben Hartley',      contactRole: 'CFO',                email:'b.hartley@orionfinancial.com',phone: '+44 7700 111004', country: 'UK',         industry: 'Financial Services', stage: 'proposal',    source: 'outbound', score: 78, value: 175000, probability: 45, owner: 'Sofia Mendez',  createdAt: '2026-03-28', lastActivity: '2026-05-20', tags: ['fintech','analytics','reporting'],            description: 'Outbound hit. Needs investor reporting + compliance dashboards.'                   },
  { id: 'l5',  company: 'CloudNine Labs',        contactName: 'Yuki Tanaka',      contactRole: 'VP Engineering',     email:'ytanaka@cloudnine.io',      phone: '+81 90 1234 5678',country: 'Japan',       industry: 'SaaS / DevTools',    stage: 'qualified',   source: 'eQORE',    score: 73, value: 145000, probability: 40, owner: 'Ravi Nair',     createdAt: '2026-04-15', lastActivity: '2026-05-18', tags: ['ai','devtools','api-first'],                  description: 'eQORE scored as strong ML tooling buyer. Needs AI platform and API gateway work.'  },
  { id: 'l6',  company: 'Mosaic Education',      contactName: 'Claire Webb',      contactRole: 'CEO',                email:'claire@mosaicedu.com',                                country: 'UK',          industry: 'EdTech',             stage: 'new',         source: 'website',  score: 48, value: 55000,  probability: 20, owner: 'Anika Roy',     createdAt: '2026-05-10', lastActivity: '2026-05-10', tags: ['edtech','mvp','startup'],                     description: 'Website contact form. EdTech MVP build enquiry. Early stage, low priority.'        },
  { id: 'l7',  company: 'NovaCare Pharma',       contactName: 'Dr. Erik Larsson', contactRole: 'Head of Digital',    email:'elarsson@novacare.se',      phone: '+46 70 123 4567', country: 'Sweden',      industry: 'Pharma',             stage: 'new',         source: 'event',    score: 55, value: 120000, probability: 25, owner: 'C.O.D.E.',  createdAt: '2026-05-15', lastActivity: '2026-05-15', tags: ['pharma','compliance','data'],                 description: 'Met at HealthTech Europe. Interested in data governance and compliance tools.'     },
  { id: 'l8',  company: 'Stellar Logistics',     contactName: 'James Okonkwo',    contactRole: 'COO',                email:'j.okonkwo@stellarlog.com',                            country: 'Nigeria',     industry: 'Logistics',          stage: 'qualified',   source: 'outbound', score: 62, value: 88000,  probability: 30, owner: 'Sofia Mendez',  createdAt: '2026-04-20', lastActivity: '2026-05-14', tags: ['logistics','ops','tracking'],                 description: 'Outbound sequence. Wants fleet tracking + ops dashboard.'                          },
  { id: 'l9',  company: 'BrightPath Academy',    contactName: 'Rachel Kim',       contactRole: 'Product Lead',       email:'rkim@brightpath.io',                                  country: 'USA',         industry: 'EdTech',             stage: 'lost',        source: 'inbound',  score: 42, value: 45000,  probability: 0,  owner: 'Anika Roy',     createdAt: '2026-03-01', lastActivity: '2026-04-30', tags: ['lost','budget'],                              description: 'Lost to cheaper competitor. Budget constraints. Flag for re-engage in Q4.'         },
  { id: 'l10', company: 'Quantum Analytics',     contactName: 'Tom Blackwell',    contactRole: 'Data Director',      email:'t.blackwell@quantumai.io',  phone: '+44 7700 111010', country: 'UK',          industry: 'AI / Data',          stage: 'won',         source: 'eQORE',    score: 96, value: 210000, probability: 100,owner: 'C.O.D.E.',  createdAt: '2025-12-01', lastActivity: '2026-04-15', tags: ['won','data-platform','ai'],                   description: 'Closed deal. Full data platform + AI pipeline. Reference case in progress.'        },
  { id: 'l11', company: 'Urban Mobility Co.',    contactName: 'Fatima Al-Amin',   contactRole: 'CTO',                email:'fatima@urbanmobility.ae',   phone: '+971 50 234 5678',country: 'UAE',          industry: 'Transport / MaaS',   stage: 'negotiation', source: 'referral', score: 82, value: 195000, probability: 65, owner: 'Dev Patel',     createdAt: '2026-03-22', lastActivity: '2026-05-26', tags: ['maas','platform','real-time'],                description: 'Referred by Vantage Retail contact. MaaS platform with real-time tracking.'        },
  { id: 'l12', company: 'GreenSpark Energy',     contactName: 'Lucas Ferreira',   contactRole: 'CDO',                email:'l.ferreira@greenspark.com',                           country: 'Brazil',      industry: 'CleanTech',          stage: 'qualified',   source: 'eQORE',    score: 69, value: 130000, probability: 35, owner: 'Ravi Nair',     createdAt: '2026-04-28', lastActivity: '2026-05-19', tags: ['cleantech','iot','dashboard'],                description: 'eQORE matched from similar ICP. IoT sensor dashboard + analytics.'                },
]

export const EQORE_SIGNALS: eQORESignal[] = [
  // l1 - Apex Ventures (score 84)
  { id: 's1',  leadId: 'l1', signal: 'Visited pricing page 4×',          category: 'intent',       weight: 0.20, rawScore: 90, contribution: 18,  description: 'High-intent page visits in past 14 days' },
  { id: 's2',  leadId: 'l1', signal: 'Company headcount 50–200',          category: 'firmographic', weight: 0.15, rawScore: 85, contribution: 12.75,description: 'Ideal ICP size bracket' },
  { id: 's3',  leadId: 'l1', signal: 'Technology stack match',            category: 'fit',          weight: 0.25, rawScore: 88, contribution: 22,  description: 'Uses React, AWS, Postgres — high build affinity' },
  { id: 's4',  leadId: 'l1', signal: 'Opened 3 of 3 nurture emails',      category: 'engagement',   weight: 0.20, rawScore: 100,contribution: 20,  description: '100% email open rate this sequence' },
  { id: 's5',  leadId: 'l1', signal: 'Series B funded ($24M)',             category: 'firmographic', weight: 0.20, rawScore: 72, contribution: 14.4,description: 'Strong buying power, growth stage' },
  // l2 - Synapse Health (score 91)
  { id: 's6',  leadId: 'l2', signal: 'GlobeMed referral signal',           category: 'intent',       weight: 0.25, rawScore: 100,contribution: 25,  description: 'Direct referral from active strategic client' },
  { id: 's7',  leadId: 'l2', signal: 'HIPAA compliance requirement',       category: 'fit',          weight: 0.20, rawScore: 95, contribution: 19,  description: 'Exact-match service capability' },
  { id: 's8',  leadId: 'l2', signal: 'Hospital group (1200+ beds)',        category: 'firmographic', weight: 0.15, rawScore: 88, contribution: 13.2,description: 'Enterprise healthcare — high ACV potential' },
  { id: 's9',  leadId: 'l2', signal: 'Booked discovery call',              category: 'engagement',   weight: 0.25, rawScore: 100,contribution: 25,  description: 'Direct calendar booking — strong buying signal' },
  { id: 's10', leadId: 'l2', signal: 'LinkedIn profile viewed our page',   category: 'intent',       weight: 0.15, rawScore: 60, contribution: 9,   description: 'Moderate organic signal' },
  // l4 - Orion Financial (score 78)
  { id: 's11', leadId: 'l4', signal: 'Downloaded compliance whitepaper',   category: 'intent',       weight: 0.25, rawScore: 85, contribution: 21.25,description: 'Content download — strong intent signal' },
  { id: 's12', leadId: 'l4', signal: 'Fintech / Financial Services ICP',   category: 'fit',          weight: 0.20, rawScore: 92, contribution: 18.4,description: 'Top ICP vertical for Kangqore' },
  { id: 's13', leadId: 'l4', signal: 'ARR £5M–£25M range',                 category: 'firmographic', weight: 0.20, rawScore: 78, contribution: 15.6,description: 'Mid-market — typical deal size match' },
  { id: 's14', leadId: 'l4', signal: 'Replied to outbound email (Day 3)',  category: 'engagement',   weight: 0.35, rawScore: 65, contribution: 22.75,description: 'Replied to cold outbound — above-average signal' },
]

export const ACTIVITIES: LeadActivity[] = [
  { id: 'a1',  leadId: 'l1', type: 'score-change', title: 'Score updated by eQORE',           description: 'Composite score increased after pricing page visit and email open.',               date: '2026-05-27', owner: 'WAANDA',        metadata: '76 → 84' },
  { id: 'a2',  leadId: 'l1', type: 'meeting',       title: 'Solution demo — Marcus Reid',      description: 'Walked through portfolio management OS and AI capabilities. Very engaged.',        date: '2026-05-22', owner: 'C.O.D.E.' },
  { id: 'a3',  leadId: 'l1', type: 'email',         title: 'Proposal sent',                    description: 'Sent SOW + commercial proposal for Phase 1 (investment portal + analytics).',     date: '2026-05-18', owner: 'C.O.D.E.' },
  { id: 'a4',  leadId: 'l1', type: 'stage-change',  title: 'Moved to Proposal',                description: 'Discovery confirmed ICP fit. Moved from Qualified to Proposal.',                  date: '2026-05-05', owner: 'C.O.D.E.', metadata: 'Qualified → Proposal' },
  { id: 'a5',  leadId: 'l2', type: 'call',          title: 'Negotiation call — pricing',       description: 'Discussed phased payment structure. Synapse want 4 milestones. Agreed in principle.',date:'2026-05-28', owner: 'Dev Patel' },
  { id: 'a6',  leadId: 'l2', type: 'score-change',  title: 'Score boosted — discovery booked', description: 'Calendar booking triggered 25pt boost in eQORE engagement score.',                date: '2026-05-15', owner: 'eQORE',        metadata: '72 → 91' },
  { id: 'a7',  leadId: 'l2', type: 'meeting',       title: 'Technical discovery session',      description: '3-hour deep-dive on HIPAA requirements, patient flows, and integration points.',  date: '2026-05-20', owner: 'Dev Patel' },
  { id: 'a8',  leadId: 'l4', type: 'email',         title: 'Outbound reply from Ben Hartley',  description: 'Replied to Day 3 email. Interested in investor reporting module specifically.',    date: '2026-05-14', owner: 'Sofia Mendez' },
  { id: 'a9',  leadId: 'l4', type: 'note',          title: 'Budget confirmed £150k–£200k',     description: 'Ben mentioned budget range in call. Fits our delivery model well.',               date: '2026-05-20', owner: 'Sofia Mendez' },
  { id: 'a10', leadId: 'l11',type: 'meeting',       title: 'Architecture scoping call',        description: 'Deep-dive on real-time tracking requirements. Redis + WebSocket needed.',          date: '2026-05-26', owner: 'Dev Patel' },
  { id: 'a11', leadId: 'l11',type: 'stage-change',  title: 'Moved to Negotiation',             description: 'Technical fit confirmed. Proposal accepted. Moving to contract terms.',           date: '2026-05-22', owner: 'Dev Patel',    metadata: 'Proposal → Negotiation' },
]

export const NURTURE_SEQUENCES: NurtureSequence[] = [
  {
    id: 'n1', leadId: 'l3', leadCompany: 'RetailEdge', sequenceName: 'E-Commerce Decision Maker', status: 'active',
    currentStep: 3, enrolledDate: '2026-04-05', lastTouched: '2026-05-15', nextActionDate: '2026-05-31',
    steps: [
      { step: 1, title: 'Intro email — retail CX case study', type: 'email',    description: 'Send Vantage Retail case study + intro.', daysFromPrev: 0,  completed: true,  completedDate: '2026-04-05' },
      { step: 2, title: 'LinkedIn connect + note',            type: 'linkedin', description: 'Connect and mention the case study.',        daysFromPrev: 3,  completed: true,  completedDate: '2026-04-08' },
      { step: 3, title: 'Follow-up email — value prop',       type: 'email',    description: 'Personalised value prop for D2C retail.',    daysFromPrev: 5,  completed: true,  completedDate: '2026-04-13' },
      { step: 4, title: 'Wait — give breathing room',         type: 'wait',     description: 'Allow 2 weeks before next touch.',           daysFromPrev: 14, completed: false },
      { step: 5, title: 'Phone call attempt',                 type: 'call',     description: 'Direct call to Sophie Laurent.',             daysFromPrev: 0,  completed: false },
      { step: 6, title: 'Final email — meeting offer',        type: 'email',    description: 'Offer 30-min demo or "not a fit" close.',    daysFromPrev: 3,  completed: false },
    ],
  },
  {
    id: 'n2', leadId: 'l6', leadCompany: 'Mosaic Education', sequenceName: 'EdTech Founder Intro', status: 'active',
    currentStep: 1, enrolledDate: '2026-05-10', lastTouched: '2026-05-10', nextActionDate: '2026-05-13',
    steps: [
      { step: 1, title: 'Welcome + discovery email',          type: 'email',    description: 'Personalised intro, ask 3 qualifying questions.', daysFromPrev: 0, completed: true, completedDate: '2026-05-10' },
      { step: 2, title: 'Wait 3 days',                        type: 'wait',     description: 'Allow time to reply.',                       daysFromPrev: 3,  completed: false },
      { step: 3, title: 'Follow-up if no reply',              type: 'email',    description: 'Bump email — share edtech MVP case study.',   daysFromPrev: 0,  completed: false },
      { step: 4, title: 'LinkedIn touch',                     type: 'linkedin', description: 'React to recent post + send note.',          daysFromPrev: 4,  completed: false },
    ],
  },
  {
    id: 'n3', leadId: 'l7', leadCompany: 'NovaCare Pharma', sequenceName: 'Event Follow-up', status: 'active',
    currentStep: 1, enrolledDate: '2026-05-15', lastTouched: '2026-05-15', nextActionDate: '2026-05-18',
    steps: [
      { step: 1, title: 'Post-event connection email',        type: 'email',    description: 'Reference HealthTech Europe, share compliance whitepaper.', daysFromPrev: 0, completed: true, completedDate: '2026-05-15' },
      { step: 2, title: 'LinkedIn follow + article share',    type: 'linkedin', description: 'Share relevant data governance article.',    daysFromPrev: 3,  completed: false },
      { step: 3, title: 'Case study email',                   type: 'email',    description: 'Send GlobeMed HIPAA compliance case study.',  daysFromPrev: 5,  completed: false },
      { step: 4, title: 'Discovery call invite',              type: 'call',     description: 'Invite to 30-min discovery call.',           daysFromPrev: 7,  completed: false },
    ],
  },
  {
    id: 'n4', leadId: 'l9', leadCompany: 'BrightPath Academy', sequenceName: 'Re-Engagement Q4', status: 'paused',
    currentStep: 0, enrolledDate: '2026-09-01', lastTouched: '2026-04-30', nextActionDate: '2026-09-01',
    steps: [
      { step: 1, title: 'Re-engage after 90 days',            type: 'email',    description: 'Check if budget situation has changed.',     daysFromPrev: 0,  completed: false },
      { step: 2, title: 'New pricing option offer',           type: 'email',    description: 'Share phased delivery option at lower entry.', daysFromPrev: 7, completed: false },
    ],
  },
]
