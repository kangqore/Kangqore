import { prisma } from './src/lib/prisma';
import crypto from 'crypto';

async function seed() {
  const sessionId = 'test-session-' + Date.now();
  const convId = 'test-conv-' + Date.now();

  const conv = await prisma.eqoreConversation.create({
    data: {
      id: convId,
      sessionId: sessionId,
      visitorType: 'BUSINESS',
      sourcePage: '/services/cloud-transformation',
      messages: {
        create: [
          { role: 'user', content: 'Hi, I am looking for cloud migration services for my enterprise.' },
          { role: 'assistant', content: 'Hello! Kangqore specializes in enterprise cloud transformation. Could you tell me more about your current infrastructure?' },
          { role: 'user', content: 'We have about 500 servers on-premise and want to move to AWS within 6 months. Budget is around $200k.' }
        ]
      }
    }
  });

  const lead = await prisma.eqoreLead.create({
    data: {
      conversationId: convId,
      sessionId: sessionId,
      email: 'test@enterprise.com',
      visitorType: 'BUSINESS',
      primaryDepartment: 'Cloud & Infrastructure',
      problemStatement: 'On-premise to AWS migration for 500 servers',
      urgency: 'HIGH',
      buyingStage: 'EVALUATION',
      leadScore: 85,
      leadConfidence: 90,
      status: 'NEW',
      schedulingStatus: 'BOOKED'
    }
  });

  console.log('Seed successful. Lead ID:', lead.id);
}

seed().then(() => prisma.$disconnect());
