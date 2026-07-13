/**
 * Seed: Bootstrap Enterprise Cognition (Phase 6.4)
 *
 * Creates 10 KimmpDecision rows with realistic decision types and outcomes,
 * then runs CognitionOrchestrator.process() on each to bootstrap the full
 * knowledge hierarchy:
 *   Evidence → Lesson → Insight → Pattern → Principle → Playbook → Policy
 *
 * Run: npx tsx prisma/seedCognition.ts
 */

import { PrismaClient } from '@prisma/client';
import { CognitionOrchestrator } from '../src/kangqore-immp/cognition/cognitionOrchestrator';

const prisma = new PrismaClient();

const SEED_DECISIONS = [
  {
    decisionType: 'SALES_ALERT',
    targetModule:  'CRM',
    domain:        'sales',
    tier:          'HIGH',
    reasoning:     'Lead showed 3 consecutive engagement spikes; confidence 91%.',
    outcome:       'Lead converted to paid client within 14 days. ACV ₹1.8Cr.',
    isPositive:    true,
    confidence:    91,
    roiValue:      1800000,
  },
  {
    decisionType: 'RISK_ALERT',
    targetModule:  'Projects',
    domain:        'operations',
    tier:          'CRITICAL',
    reasoning:     'Project milestone 3 weeks overdue; blocker unresolved for 8 days.',
    outcome:       'Client escalated; milestone delivery delayed by 6 weeks. Revenue risk materialised.',
    isPositive:    false,
    confidence:    87,
    roiValue:      -500000,
  },
  {
    decisionType: 'PRICING_REVIEW',
    targetModule:  'Finance',
    domain:        'finance',
    tier:          'HIGH',
    reasoning:     'Cost-of-delivery increased 18%; pricing model not revised in 9 months.',
    outcome:       'Revised pricing adopted. Margin improved 4.2pp within quarter.',
    isPositive:    true,
    confidence:    78,
    roiValue:      420000,
  },
  {
    decisionType: 'HIRING_SIGNAL',
    targetModule:  'Operations',
    domain:        'people',
    tier:          'MEDIUM',
    reasoning:     '2 senior engineers leaving; pipeline capacity under threat.',
    outcome:       'Backfill hired in 3 weeks. No delivery disruption.',
    isPositive:    true,
    confidence:    74,
    roiValue:      0,
  },
  {
    decisionType: 'COMPETITOR_MOVE',
    targetModule:  'Intelligence',
    domain:        'market',
    tier:          'HIGH',
    reasoning:     'Competitor launched adjacent product; 3 shared prospects evaluating alternatives.',
    outcome:       'Won 2 of 3 prospects on BIDS™ differentiation. One lost.',
    isPositive:    true,
    confidence:    68,
    roiValue:      2200000,
  },
  {
    decisionType: 'CASH_FLOW_ALERT',
    targetModule:  'Finance',
    domain:        'finance',
    tier:          'CRITICAL',
    reasoning:     'Outstanding invoices > 60 days totalling ₹38L; runway impact projected.',
    outcome:       'Collections completed within 45 days after follow-up campaign.',
    isPositive:    true,
    confidence:    83,
    roiValue:      3800000,
  },
  {
    decisionType: 'PRODUCT_FEEDBACK',
    targetModule:  'Goals',
    domain:        'product',
    tier:          'MEDIUM',
    reasoning:     'Three enterprise clients requested on-premise deployment option.',
    outcome:       'On-prem evaluation deferred; hybrid-cloud alternative offered. 2 of 3 accepted.',
    isPositive:    true,
    confidence:    65,
    roiValue:      0,
  },
  {
    decisionType: 'DELIVERY_RISK',
    targetModule:  'Projects',
    domain:        'operations',
    tier:          'HIGH',
    reasoning:     'Two project PMs simultaneously absent; resource contention detected.',
    outcome:       'Temporary reallocation resolved. Delivery on time.',
    isPositive:    true,
    confidence:    80,
    roiValue:      0,
  },
  {
    decisionType: 'PARTNERSHIP_SIGNAL',
    targetModule:  'Decisions',
    domain:        'market',
    tier:          'MEDIUM',
    reasoning:     'Systems integrator expressed interest in co-selling BIDS™ in MENA.',
    outcome:       'MoU signed. First co-sell opportunity in pipeline: ACV target ₹2.5Cr.',
    isPositive:    true,
    confidence:    72,
    roiValue:      2500000,
  },
  {
    decisionType: 'AUTOMATION_OPPORTUNITY',
    targetModule:  'Operations',
    domain:        'ai',
    tier:          'MEDIUM',
    reasoning:     'Manual invoice reconciliation consuming 12 hrs/week; automation threshold met.',
    outcome:       'Automated. Weekly savings: 11 hrs, 2 error incidents eliminated.',
    isPositive:    true,
    confidence:    88,
    roiValue:      150000,
  },
];

async function main() {
  console.log('[seedCognition] Starting...');

  for (let i = 0; i < SEED_DECISIONS.length; i++) {
    const d = SEED_DECISIONS[i];
    console.log(`\n[${i + 1}/${SEED_DECISIONS.length}] ${d.decisionType} — ${d.domain}`);

    // Create the KimmpDecision with evidence and outcome already set
    const decision = await (prisma as any).kimmpDecision.create({
      data: {
        decisionType:      d.decisionType,
        targetModule:      d.targetModule,
        reasoning:         d.reasoning,
        recommendedAction: `Review and approve ${d.decisionType} for ${d.targetModule}`,
        confidence:        d.confidence,
        priority:          i < 3 ? 34 : i < 7 ? 21 : 13,
        status:            'APPROVED',
        approvedAt:        new Date(Date.now() - (10 - i) * 7 * 24 * 3600 * 1000),
        outcome:           d.outcome,
        outcomeAt:         new Date(Date.now() - (10 - i) * 4 * 24 * 3600 * 1000),
      },
    });

    try {
      const result = await CognitionOrchestrator.process({
        type:       'decision_outcome',
        sourceId:   decision.id,
        outcome:    d.outcome,
        domain:     d.domain,
        tier:       d.tier,
        isPositive: d.isPositive,
        confidence: d.confidence,
        roiValue:   d.roiValue ?? 0,
      });

      console.log(
        `  Evidence: ${result.evidence.id.slice(0, 8)}... ` +
        `Lesson: ${result.lesson?.id?.slice(0, 8) ?? 'none'} ` +
        `Insight: ${result.insight?.id?.slice(0, 8) ?? 'none'} ` +
        `Promoted: ${result.promoted} ` +
        `ETI: ${result.etiImpact.before} → ${result.etiImpact.after}`
      );
    } catch (e: any) {
      console.error(`  [WARN] Cognition processing failed: ${e.message}`);
    }
  }

  console.log('\n[seedCognition] Complete. Run GET /api/admin/kangqore-immp/cognition/lessons to verify.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
