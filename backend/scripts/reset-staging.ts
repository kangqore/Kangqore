import { config } from 'dotenv';
config();

import { PrismaClient } from '@prisma/client';
import logger from '../src/utils/logger';

const prisma = new PrismaClient();

async function resetStaging() {
  if (process.env.NODE_ENV === 'production') {
    logger.error('FATAL: Cannot run staging reset in production environment.');
    process.exit(1);
  }

  logger.warn('WARNING: This will permanently delete all eQORE conversational data, leads, events, and agent logs.');
  
  if (process.env.CONFIRM_RESET !== 'true') {
    logger.info('Reset canceled. Set CONFIRM_RESET=true to proceed.');
    process.exit(0);
  }

  try {
    logger.info('Resetting eQORE Staging Environment...');

    // 1. Delete Agent Logs
    const deletedLogs = await prisma.eqoreAgentLog.deleteMany({});
    logger.info(`Deleted ${deletedLogs.count} Agent Logs`);

    // 2. Delete Lead Events
    const deletedEvents = await prisma.eqoreLeadEvent.deleteMany({});
    logger.info(`Deleted ${deletedEvents.count} Lead Events`);

    // 3. Delete Leads
    const deletedLeads = await prisma.eqoreLead.deleteMany({});
    logger.info(`Deleted ${deletedLeads.count} Leads`);

    // 4. Delete Messages
    const deletedMessages = await prisma.eqoreMessage.deleteMany({});
    logger.info(`Deleted ${deletedMessages.count} Messages`);

    // 5. Delete Conversations
    const deletedConversations = await prisma.eqoreConversation.deleteMany({});
    logger.info(`Deleted ${deletedConversations.count} Conversations`);

    logger.info('✅ Staging Environment Reset Complete');
  } catch (error) {
    logger.error('Failed to reset staging environment:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetStaging();
