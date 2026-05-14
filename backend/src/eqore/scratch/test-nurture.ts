import { prisma } from '../../lib/prisma';
import { EqoreNurtureAgent } from '../agents/nurture.agent';

async function test() {
  const lead = await prisma.eqoreLead.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!lead) {
    console.log('No leads found to test.');
    return;
  }

  console.log(`Testing nurture agent for lead: ${lead.id}`);
  
  try {
    const result = await EqoreNurtureAgent.generateNurtureAssets(lead.id);
    console.log('Nurture Agent Result:', JSON.stringify(result, null, 2));
    
    const updatedLead = await prisma.eqoreLead.findUnique({ where: { id: lead.id } });
    console.log('Updated Lead ROI:', {
      projectedValue: updatedLead?.projectedValue,
      pipelineWeight: updatedLead?.pipelineWeight,
      valueTier: updatedLead?.valueTier
    });
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test().then(() => prisma.$disconnect());
