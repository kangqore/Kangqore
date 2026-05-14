import { EqoreOrchestratorService } from '../src/eqore/orchestrator/eqoreOrchestrator.service';
import { DeterministicRouter } from '../src/eqore/routing/deterministicRouter';
import { prisma } from '../src/lib/prisma';
import * as dotenv from 'dotenv';

dotenv.config();

async function test() {
  const message = "We are a startup company. Our app got crashed totally. We are a hospital management SaaS app company.";
  
  console.log('Testing message:', message);
  
  const decision = DeterministicRouter.route(message);
  console.log('Routing Decision:', JSON.stringify(decision, null, 2));

  if (!decision || decision.intent !== 'CLIENT_ASSURANCE_QUERY') {
    console.error('Failed to detect CLIENT_ASSURANCE_QUERY');
    return;
  }

  // Mock conversation and lead
  await prisma.eqoreConversation.upsert({
    where: { id: 'test-conv-assurance' },
    update: {},
    create: { id: 'test-conv-assurance', sessionId: 'test-session-assurance' }
  });

  const lead = await prisma.eqoreLead.create({
    data: {
      email: 'test-assurance@example.com',
      name: 'Assurance Tester',
      sessionId: 'test-session-assurance',
      conversationId: 'test-conv-assurance',
      leadScore: 50,
      status: 'NEW'
    }
  });

  console.log('Orchestrating...');
  const result = await EqoreOrchestratorService.orchestrate({
    decision,
    message,
    conversationId: 'test-conv-assurance',
    leadId: lead.id,
    messageId: 'test-msg-assurance',
    sessionId: 'test-session-assurance',
    messages: [{ id: '1', role: 'user', content: message }]
  });

  console.log('--- FINAL RESPONSE ---');
  console.log(result.responseContent);
  console.log('----------------------');
  
  // Cleanup
  await prisma.eqoreLead.delete({ where: { id: lead.id } });
}

test().catch(console.error).finally(() => prisma.$disconnect());
