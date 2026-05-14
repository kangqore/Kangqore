import { Worker } from 'bullmq';
import { redisConnection } from '../../lib/redis';
import logger from '../../utils/logger';
import { prisma } from '../../lib/prisma';
import { EqoreShadowLeadAgent } from '../agents/shadowLead.agent';
import { EqoreLeadScoringService } from '../../eqore-lead-intelligence/scoring/leadScoring.service';
import { ShadowAnalysisJob } from './eqore.queue';
import { ServiceMatcherService } from '../../eqore-lead-intelligence/taxonomy/serviceMatcher.service';
import { NextBestQuestionService } from '../../eqore-lead-intelligence/taxonomy/nextBestQuestion.service';
import { EqoreSchedulingAgentService } from '../services/schedulingAgent.service';
import { EqoreValueService } from '../../eqore-lead-intelligence/scoring/valueProjection.service';

export class EqoreShadowWorker {
  private worker: Worker;

  constructor() {
    this.worker = new Worker('eqore-shadow-analysis', async (job) => {
      const { conversationId, leadId, latestMessageId } = job.data as ShadowAnalysisJob;
      
      logger.info(`Processing Shadow Analysis Job: ${job.id}`);

      try {
        // 1. Mark as running
        await prisma.eqoreLead.update({
          where: { id: leadId },
          data: { shadowAnalysisStatus: 'RUNNING' }
        });

        // 2. Get full conversation history
        const conversation = await prisma.eqoreConversation.findUnique({
          where: { id: conversationId },
          include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!conversation) throw new Error(`Conversation ${conversationId} not found`);

        const transcript = conversation.messages.map(m => `${m.role}: ${m.content}`).join('\n');

        // 3. Deterministic Service Matching (Authority)
        const matchResult = ServiceMatcherService.matchServices(transcript);

        // 4. Shadow Agent Analysis (Refinement)
        let intelligence = null;
        try {
          intelligence = await EqoreShadowLeadAgent.analyzeTranscript(
            conversationId,
            conversation.messages.map(m => ({ id: m.id, role: m.role, content: m.content })),
            conversation.sourcePage || undefined
          );
        } catch (llmError) {
          logger.error('Shadow Agent analysis failed, proceeding with deterministic match only:', llmError);
        }

        // 5. Merge and Persist
        if (intelligence) {
          await EqoreShadowLeadAgent.persistIntelligence(leadId, intelligence, latestMessageId);
          
          // Refine deterministic match with LLM refinement if available
          if (intelligence.primaryDepartment) matchResult.primaryDepartment = intelligence.primaryDepartment;
          if (intelligence.recommendedSolutionPackage) matchResult.recommendedSolutionPackage = intelligence.recommendedSolutionPackage;
          
          // Use NextBestQuestionService to finalize
          matchResult.nextBestQuestion = NextBestQuestionService.getNextBestQuestion(
            matchResult.matchedServices.map(s => s.slug),
            intelligence.buyingStage,
            intelligence.nextBestQuestion
          );
        }

        // Final Persistence of Service Intelligence
        await prisma.eqoreLead.update({
          where: { id: leadId },
          data: {
            primaryDepartment: matchResult.primaryDepartment,
            secondaryDepartments: matchResult.secondaryDepartments as any,
            matchedServices: matchResult.matchedServices as any,
            departmentFitScores: matchResult.departmentFitScores as any,
            serviceFitScores: matchResult.serviceFitScores as any,
            recommendedSolutionPackage: matchResult.recommendedSolutionPackage,
            serviceMatchReason: matchResult.serviceMatchReason,
            nextBestQuestion: matchResult.nextBestQuestion,
            serviceMatchVersion: 'taxonomy-v1',
            lastServiceMatchedAt: new Date()
          }
        });

        // 6. Log Service Match Event
        if (matchResult.matchedServices.length > 0) {
          await prisma.eqoreLeadEvent.create({
            data: {
              leadId,
              eventType: 'SERVICE_MATCHED',
              reason: matchResult.serviceMatchReason,
              eventData: {
                primaryDepartment: matchResult.primaryDepartment,
                matchedServices: matchResult.matchedServices.map(s => s.service),
                version: 'taxonomy-v1'
              } as any
            }
          });
        }

        // 7. Recalculate Score with semantic + service input
        await EqoreLeadScoringService.updateLeadScore(leadId, conversation.messages, intelligence || undefined);

        // 8. Trigger Scheduling Agent Flow
        if (intelligence) {
          const updatedLead = await prisma.eqoreLead.findUnique({ where: { id: leadId } });
          const negativeCategories = ["Student", "Researcher", "Competitor", "Job Seeker"];
          const isNegativeCategory = updatedLead?.visitorType && negativeCategories.includes(updatedLead.visitorType);
          
          const hasHighIntent = intelligence.schedulingIntent || intelligence.buyingStage === 'Ready To Talk';
          const isQualified = (updatedLead?.leadScore || 0) >= 44;

          if (!isNegativeCategory && (hasHighIntent || isQualified)) {
            const latestContent = conversation.messages[conversation.messages.length - 1]?.content || "";
            await EqoreSchedulingAgentService.processSchedulingIntent(leadId, latestContent);
          }
        }

        // 9. ROI Intelligence (Phase 5)
        await EqoreValueService.updateLeadValue(leadId);

        logger.info(`Completed Service Matcher & Shadow Analysis for Job: ${job.id}`);
      } catch (error) {
        logger.error(`Shadow Analysis Job ${job.id} failed:`, error);
        
        await prisma.eqoreLead.update({
          where: { id: leadId },
          data: { 
            shadowAnalysisStatus: 'FAILED',
            lastShadowError: (error as Error).message
          }
        });

        await prisma.eqoreLeadEvent.create({
          data: {
            leadId,
            eventType: 'SHADOW_ANALYSIS_FAILED',
            reason: (error as Error).message
          }
        });

        throw error; // Rethrow to let BullMQ handle retries
      }
    }, {
      connection: redisConnection,
      concurrency: 5
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`Shadow Worker job ${job?.id} failed with ${err.message}`);
    });
  }
}

// Instantiate the worker
export const eqoreShadowWorker = new EqoreShadowWorker();
