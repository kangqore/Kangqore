import { URGIPlatform } from './index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testUrgiFlow() {
  const visitorId = `visitor_test_${Date.now()}`;
  console.log(`Starting URGI test flow for visitor: ${visitorId}`);

  // This will trigger the entire pipeline (eROOT -> WAANDA -> eQORE -> WAANDA Memory)
  // Because it's an event-driven system, we'll wait a brief moment for the events to propagate
  await URGIPlatform.processInteraction(visitorId, { 
    page: '/pricing', 
    intent: 'Enterprise Architect looking for automation' 
  });

  console.log('Event emitted. Waiting 2 seconds for event propagation...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('Checking Database for URGI artifacts...');
  
  const profile = await prisma.unifiedRelationshipProfile.findUnique({
    where: { visitorId },
    include: {
      evidence: true,
      timeline: true
    }
  });

  if (!profile) {
    console.error('❌ Failed: UnifiedRelationshipProfile was not created.');
    process.exit(1);
  }

  console.log(`✅ Profile Found: ${profile.id}`);
  console.log(`   - Current Company: ${profile.currentCompany || 'N/A'}`);

  if (profile.evidence.length === 0) {
    console.error('❌ Failed: No EvidenceLedger records found.');
    process.exit(1);
  }
  
  console.log(`✅ Evidence Ledger Entries: ${profile.evidence.length}`);
  profile.evidence.forEach(e => {
    console.log(`   - [${e.evidenceType}] ${e.factKey}: ${e.factValue} (${e.confidenceScore * 100}%)`);
  });

  if (profile.timeline.length === 0) {
    console.error('❌ Failed: No RelationshipTimelineEvent records found.');
    process.exit(1);
  }

  console.log(`✅ Timeline Events: ${profile.timeline.length}`);
  profile.timeline.forEach(t => {
    console.log(`   - [${t.eventType}] ${t.description}`);
  });

  console.log('\n🚀 URGI E2E Test Passed Successfully!');
  process.exit(0);
}

testUrgiFlow().catch(e => {
  console.error('Test Failed:', e);
  process.exit(1);
});
