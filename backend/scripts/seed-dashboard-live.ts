import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding realistic Admin Dashboard data...');

  // 1. Clear old data to avoid duplicates/key conflicts
  console.log('Clearing old Dashboard data...');
  try {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "eqore_leads" CASCADE;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "eqore_conversations" CASCADE;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "bids_engagements" CASCADE;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "kimmp_goal" CASCADE;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "kimmp_signals" CASCADE;');
  } catch (err) {
    console.log('Table truncate failed (might be clean already):', (err as Error).message);
  }

  // 2. Seed EqoreLeads
  console.log('Seeding EqoreLeads...');
  const leadData = [
    { name: 'Rohan Sharma', company: 'TechVeda Solutions', email: 'rohan@techveda.in', status: 'NEW', score: 85, value: 45000 },
    { name: 'Dr. Priya Rao', company: 'Synapse Health Systems', email: 'priya@synapsehealth.org', status: 'CONTACTED', score: 92, value: 120000 },
    { name: 'Dev Patel', company: 'Nexus Tech Solutions', email: 'dev@nexustech.io', status: 'QUALIFIED', score: 78, value: 65000 },
    { name: 'Vikram Malhotra', company: 'Apex Global Logics', email: 'vikram@apexlogics.com', status: 'PROPOSAL', score: 88, value: 95000 },
    { name: 'Ananya Singh', company: 'TechDesk Media', email: 'ananya@techdesk.co', status: 'NEGOTIATION', score: 65, value: 30000 },
    { name: 'Aditya Birla', company: 'Birla Digital Labs', email: 'aditya@birladigital.com', status: 'WON', score: 95, value: 250000 },
    { name: 'Meera Nair', company: 'Zenith Retail Corp', email: 'meera@zenithretail.com', status: 'LOST', score: 40, value: 20000 },
    { name: 'Kunal Kapoor', company: 'Kapoor Capital', email: 'kunal@kapoorcap.com', status: 'NEW', score: 72, value: 50000 }
  ];

  for (const l of leadData) {
    const sessionId = `sess_${Math.random().toString(36).substring(2, 10)}`;
    const conversation = await (prisma as any).eqoreConversation.create({
      data: {
        sessionId,
        status: 'ACTIVE',
        currentIntent: 'TRANSFORMATION_INQUIRY',
        summary: `AI concierge chat with ${l.name} from ${l.company}.`
      }
    });

    await (prisma as any).eqoreLead.create({
      data: {
        conversationId: conversation.id,
        sessionId,
        name: l.name,
        companyName: l.company,
        email: l.email,
        status: l.status,
        leadScore: l.score,
        projectedValue: l.value,
        salesStage: l.status,
        salesPriority: l.score >= 80 ? 'HIGH' : 'MEDIUM'
      }
    });
  }

  // 3. Seed BidsEngagements
  console.log('Seeding BidsEngagements...');
  const bidsData = [
    {
      clientName: 'Tata Steel Jamshedpur',
      industry: 'Manufacturing',
      status: 'ACTIVE',
      leadConsultant: 'Mahesh Kumar',
      startedAt: new Date(Date.now() - 15 * 86400000),
      notes: 'Diagnostic assessment for supply chain digitization program.',
      deliverables: [
        { n: 1, name: 'Diagnostic Scorecard™', status: 'COMPLETE', completedAt: new Date(Date.now() - 10 * 86400000).toISOString() },
        { n: 2, name: 'Executive Intelligence Report™', status: 'COMPLETE', completedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
        { n: 3, name: 'Transformation Blueprint™', status: 'IN_PROGRESS', completedAt: null },
        { n: 4, name: 'Risk Register™', status: 'PENDING', completedAt: null },
        { n: 5, name: 'Opportunity Register™', status: 'PENDING', completedAt: null },
        { n: 6, name: 'Service Prescription Matrix™', status: 'PENDING', completedAt: null },
        { n: 7, name: '30/60/90/180-Day Roadmap™', status: 'PENDING', completedAt: null },
        { n: 8, name: 'Executive Board Presentation™', status: 'PENDING', completedAt: null },
        { n: 9, name: 'Executive Workshop™', status: 'PENDING', completedAt: null },
        { n: 10, name: 'ROI Projection Report™', status: 'PENDING', completedAt: null }
      ]
    },
    {
      clientName: 'Apollo Hospitals Group',
      industry: 'Healthcare',
      status: 'ACTIVE',
      leadConsultant: 'Dev Patel',
      startedAt: new Date(Date.now() - 8 * 86400000),
      notes: 'BIDS validation framework deployment for patient record migration.',
      deliverables: [
        { n: 1, name: 'Diagnostic Scorecard™', status: 'COMPLETE', completedAt: new Date(Date.now() - 6 * 86400000).toISOString() },
        { n: 2, name: 'Executive Intelligence Report™', status: 'PENDING', completedAt: null },
        { n: 3, name: 'Transformation Blueprint™', status: 'PENDING', completedAt: null },
        { n: 4, name: 'Risk Register™', status: 'PENDING', completedAt: null },
        { n: 5, name: 'Opportunity Register™', status: 'PENDING', completedAt: null },
        { n: 6, name: 'Service Prescription Matrix™', status: 'PENDING', completedAt: null },
        { n: 7, name: '30/60/90/180-Day Roadmap™', status: 'PENDING', completedAt: null },
        { n: 8, name: 'Executive Board Presentation™', status: 'PENDING', completedAt: null },
        { n: 9, name: 'Executive Workshop™', status: 'PENDING', completedAt: null },
        { n: 10, name: 'ROI Projection Report™', status: 'PENDING', completedAt: null }
      ]
    },
    {
      clientName: 'Infosys Innovation Labs',
      industry: 'Technology',
      status: 'DRAFT',
      leadConsultant: 'Mahesh Kumar',
      notes: 'Initial discussion for cloud-native partner alignment.',
      deliverables: [
        { n: 1, name: 'Diagnostic Scorecard™', status: 'PENDING', completedAt: null },
        { n: 2, name: 'Executive Intelligence Report™', status: 'PENDING', completedAt: null },
        { n: 3, name: 'Transformation Blueprint™', status: 'PENDING', completedAt: null },
        { n: 4, name: 'Risk Register™', status: 'PENDING', completedAt: null },
        { n: 5, name: 'Opportunity Register™', status: 'PENDING', completedAt: null },
        { n: 6, name: 'Service Prescription Matrix™', status: 'PENDING', completedAt: null },
        { n: 7, name: '30/60/90/180-Day Roadmap™', status: 'PENDING', completedAt: null },
        { n: 8, name: 'Executive Board Presentation™', status: 'PENDING', completedAt: null },
        { n: 9, name: 'Executive Workshop™', status: 'PENDING', completedAt: null },
        { n: 10, name: 'ROI Projection Report™', status: 'PENDING', completedAt: null }
      ]
    }
  ];

  for (const b of bidsData) {
    await (prisma as any).bidsEngagement.create({
      data: {
        clientName: b.clientName,
        industry: b.industry,
        status: b.status as any,
        leadConsultant: b.leadConsultant,
        startedAt: b.startedAt,
        notes: b.notes,
        deliverables: b.deliverables
      }
    });
  }

  // 4. Seed KimmpGoals & Tasks
  console.log('Seeding KimmpGoals...');
  const goalsData = [
    {
      objective: 'Establish partner network with 20 certified delivery partners',
      deadline: new Date(Date.now() + 60 * 86400000),
      status: 'ACTIVE',
      strategy: 'Scale delivery execution capacity through vetted partner program, standardizing onboarding and certification paths.',
      progressPct: 40,
      tasks: [
        { step: 1, title: 'Draft partner certification guidelines', description: 'Define P0 requirements and training modules.', status: 'DONE', dueDays: 5, completedAt: new Date(Date.now() - 3 * 86400000) },
        { step: 2, title: 'Publish partner registration page', description: 'Deploy registration flow and webhook endpoints.', status: 'DONE', dueDays: 10, completedAt: new Date(Date.now() - 1 * 86400000) },
        { step: 3, title: 'Onboard first batch of 5 partners', description: 'Conduct initial technical review and system access.', status: 'IN_PROGRESS', dueDays: 20 },
        { step: 4, title: 'Deploy joint execution dashboard', description: 'Configure shared deliverables panel in Partner Portal.', status: 'PENDING', dueDays: 30 }
      ]
    },
    {
      objective: 'Optimize sales pipeline response time under 15 minutes',
      deadline: new Date(Date.now() + 30 * 86400000),
      status: 'ACTIVE',
      strategy: 'Integrate Slack alerts with AI concierge and automate lead prioritization rules inside lead intelligence dashboard.',
      progressPct: 75,
      tasks: [
        { step: 1, title: 'Configure lead.created webhook logs', description: 'Verify payload delivery to gateway server.', status: 'DONE', dueDays: 3, completedAt: new Date(Date.now() - 5 * 86400000) },
        { step: 2, title: 'Create Slack notification channel', description: 'Enable interactive routing buttons on alert block.', status: 'DONE', dueDays: 7, completedAt: new Date(Date.now() - 2 * 86400000) },
        { step: 3, title: 'Deploy AI-first auto-responder rules', description: 'Draft template guidelines for high-intent visitors.', status: 'DONE', dueDays: 15, completedAt: new Date(Date.now() - 1 * 86400000) },
        { step: 4, title: 'Monitor response metrics for one week', description: 'Confirm median response time stays below 15 mins.', status: 'IN_PROGRESS', dueDays: 25 }
      ]
    }
  ];

  for (const g of goalsData) {
    const { tasks, ...goalData } = g;
    const goal = await (prisma as any).kimmpGoal.create({
      data: {
        ...goalData,
        strategy: g.strategy
      }
    });

    for (const t of tasks) {
      const due = new Date();
      due.setDate(due.getDate() + t.dueDays);
      await (prisma as any).kimmpGoalTask.create({
        data: {
          goalId: goal.id,
          step: t.step,
          title: t.title,
          description: t.description,
          status: t.status,
          dueDate: due,
          completedAt: t.completedAt ?? null
        }
      });
    }
  }

  // 5. Seed KimmpSignals
  console.log('Seeding KimmpSignals...');
  const signalsData = [
    { sourceModule: 'lead-intelligence', signalType: 'LEAD_SCORED', signalCategory: 'OPPORTUNITY', signalValue: 'Lead Priya Rao from Synapse Health scored 92% (High Intent). Urgency: Critical.', severity: 'HIGH', confidence: 95 },
    { sourceModule: 'bids', signalType: 'BIDS_ASSESSMENT_COMPLETED', signalCategory: 'DELIVERY', signalValue: 'Tata Steel Jamshedpur completed Diagnostic Scorecard with score 88.', severity: 'LOW', confidence: 90 },
    { sourceModule: 'kimmp.sentinel', signalType: 'SENTINEL_LOOP_AUDIT', signalCategory: 'SYSTEM', signalValue: 'SENTINEL post-loop: conf 95% | no runaway loops | 12 active processes monitored.', severity: 'LOW', confidence: 98 },
    { sourceModule: 'security', signalType: 'ACCESS_DENIED_ALERT', signalCategory: 'RISK', signalValue: 'Multiple failed login attempts detected on investor portal from IP 198.51.100.42.', severity: 'HIGH', confidence: 85 },
    { sourceModule: 'strategy', signalType: 'GOAL_TASK_OVERDUE', signalCategory: 'DELIVERY', signalValue: 'Goal task overdue: "Draft partner certification guidelines". Limit was 2 days ago.', severity: 'MODERATE', confidence: 90 }
  ];

  for (const s of signalsData) {
    await (prisma as any).kimmpSignal.create({
      data: {
        sourceModule: s.sourceModule,
        signalType: s.signalType,
        signalCategory: s.signalCategory,
        signalValue: s.signalValue,
        severity: s.severity,
        confidence: s.confidence
      }
    });
  }

  console.log('✅ Seeding complete!');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
