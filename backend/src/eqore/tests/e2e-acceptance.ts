import { config } from 'dotenv';
config();

import { AgentDispatcherService } from '../routing/agentDispatcher.service';
import { prisma } from '../../lib/prisma';

async function runE2E() {
  console.log('--- eQORE Baseline E2E Acceptance Test ---');
  
  const testMessage = "We are a fintech company. We need to modernize our internal workflow with AI automation. How much would it cost, and can we talk tomorrow afternoon?";

  // Create a clean session and lead
  const sessionId = 'test-e2e-session-' + Date.now();
  
  const conv = await prisma.eqoreConversation.create({
    data: { sessionId, sourcePage: '/e2e-test' },
    include: { lead: true }
  });

  const lead = await prisma.eqoreLead.create({
    data: {
      conversationId: conv.id,
      sessionId,
      status: 'NEW',
    }
  });

  const userMsg = await prisma.eqoreMessage.create({
    data: {
      conversationId: conv.id,
      role: 'USER',
      content: testMessage,
    }
  });

  console.log('\n[1] User Message:', testMessage);

  // Dispatch!
  // This will check routing, invoke orchestrator, and run the agents sync/async.
  // Note: Shadow Agent runs via BullMQ, so we'll wait a bit for it to complete if we want to test the full pipeline synchronously, 
  // or we can manually run the shadow agent inline for the test to ensure we see the Service Matcher output.
  // Let's run the Agent Dispatcher first.
  
  const result = await AgentDispatcherService.dispatch({
    message: testMessage,
    conversationId: conv.id,
    leadId: lead.id,
    messageId: userMsg.id,
    sessionId,
    history: [],
    messages: [{ id: userMsg.id, role: 'USER', content: testMessage }]
  });

  console.log('\n[2] Dispatcher Result (Initial Sync Phase):');
  console.log('Intent:', result.intent);
  console.log('Response:', result.responseContent);

  // Now, since Shadow Analysis runs in BullMQ, it might not have finished.
  // We'll manually invoke the Shadow Agent analysis to simulate the background job.
  console.log('\n[3] Simulating Background Shadow Agent Execution...');
  const { EqoreShadowLeadAgent } = await import('../agents/shadowLead.agent');
  const shadowResult = await EqoreShadowLeadAgent.analyzeTranscript(conv.id, [{ id: userMsg.id, role: 'USER', content: testMessage }]);
  
  if (shadowResult) {
    await EqoreShadowLeadAgent.persistIntelligence(lead.id, shadowResult, userMsg.id);
    console.log('Shadow Agent Extracted:', shadowResult.matchedServices);
    
    // Now simulate the second message or the Service Matcher re-run if needed.
    // Actually, Phase 7 Orchestrator logic says ServiceMatcher runs right away, but it skipped if no matchedServices.
    // We should wait 5 seconds and check the DB for the lead state to see if BullMQ did it.
  } else {
    console.log('Shadow Agent Failed to extract.');
  }

  // Let's check the AgentLog timeline.
  const logs = await prisma.eqoreAgentLog.findMany({
    where: { leadId: lead.id },
    orderBy: { createdAt: 'desc' }
  });

  console.log('\n[4] Agent Timeline Logs:');
  logs.forEach(l => {
    console.log(`- Intent: ${l.detectedIntent} | Source: ${l.routerSource} | Latency: ${l.totalLatencyMs}ms`);
    console.log(`  Selected Agents:`, l.selectedAgents);
    console.log(`  Skipped Agents:`, l.skippedAgents);
    console.log(`  Status: ${l.status}`);
  });

  process.exit(0);
}

runE2E().catch(console.error);
