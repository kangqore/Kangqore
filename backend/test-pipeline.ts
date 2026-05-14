import { prisma } from './src/lib/prisma';
import { EqoreSalesPipelineService } from './src/eqore/sales/salesPipeline.service';
import logger from './src/utils/logger';

async function testPipeline() {
  console.log('--- Starting Phase 9 Pipeline Test ---');

  // 1. Create a mock lead that should qualify for the pipeline
  const lead = await prisma.eqoreLead.create({
    data: {
      sessionId: 'TEST_SESSION_' + Date.now(),
      email: 'cto@example-crisis.com',
      name: 'John Test',
      companyName: 'Crisis Corp',
      status: 'ACTIVE',
      leadScore: 90,
      leadConfidence: 80,
      urgency: 'CRISIS',
      primaryDepartment: 'Cybersecurity',
      leadCategory: 'Hot Lead',
      projectedValue: 150000,
      matchedServices: [
        { service: 'Incident Response', fitScore: 95 }
      ],
      conversation: {
        create: {
          sessionId: 'TEST_SESSION_' + Date.now()
        }
      }
    }
  });

  console.log(`✅ Created test lead: ${lead.id}`);

  // 2. Trigger pipeline evaluation
  const pipelineResult = await EqoreSalesPipelineService.evaluateAndCreateOpportunity(lead.id);
  console.log(`✅ Pipeline Evaluation Result: ${pipelineResult}`);

  if (!pipelineResult) {
    console.error('❌ Pipeline evaluation failed or skipped.');
    return;
  }

  // 3. Verify Opportunity
  const opp = await prisma.eqoreSalesOpportunity.findUnique({
    where: { leadId: lead.id },
    include: { tasks: true, activities: true, syncLogs: true }
  });

  if (opp) {
    console.log(`✅ Opportunity Created: ${opp.id}`);
    console.log(`   Owner: ${opp.ownerId} | Stage: ${opp.stage} | Priority: ${opp.priority}`);
    console.log(`   Tasks Generated: ${opp.tasks.length}`);
    console.log(`   Activities Logged: ${opp.activities.length}`);
  } else {
    console.error('❌ Opportunity not found in DB!');
  }

  // 4. Update stage to WON
  console.log('\n--- Updating Opportunity Stage ---');
  if (opp) {
    await EqoreSalesPipelineService.updateOpportunityStage(opp.id, 'WON', 'Customer confirmed via email.');
    const updatedOpp = await prisma.eqoreSalesOpportunity.findUnique({ where: { id: opp.id } });
    console.log(`✅ Stage updated to: ${updatedOpp?.stage}`);
    console.log(`   Won Reason: ${updatedOpp?.wonReason}`);
  }

  console.log('\n--- Test Complete ---');
}

testPipeline().catch(console.error).finally(() => process.exit(0));
