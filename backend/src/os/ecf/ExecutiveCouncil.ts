import { DomainRegistry } from '../edf/core/DomainRegistry';
import { EnterpriseProposal, ExecutiveDeliberationReport, ExecutiveOpinion } from './contracts/types';

export class ExecutiveCouncil {
  
  async deliberate(proposal: EnterpriseProposal): Promise<ExecutiveDeliberationReport> {
    console.log(`\n=== EXECUTIVE COUNCIL DELIBERATION ===`);
    console.log(`[Council] Proposal: ${proposal.title}`);
    console.log(`[Council] Action: ${proposal.proposedAction}\n`);

    const domains = DomainRegistry.getAll();
    const opinions: ExecutiveOpinion[] = [];

    // Round 1: Gather Opinions
    for (const domain of domains) {
      if (domain.executive && domain.executive.scope === 'DOMAIN') {
        const opinion = await domain.executive.evaluateProposal(proposal);
        if (opinion.stance !== 'ABSTAIN') {
          opinions.push(opinion);
        }
      }
    }

    // Process weighted deliberation based on stance, confidence, and contextual priority
    let supportWeight = 0;
    let opposeWeight = 0;
    const conflicts: string[] = [];

    for (const opinion of opinions) {
      console.log(`[Council] Received ${opinion.stance} from ${opinion.executiveId} (Confidence: ${opinion.confidence})`);
      
      // Basic contextual weighting (e.g., if Sales supports a revenue action, weight is higher)
      // This is a simplified stand-in for complex priority heuristics.
      let domainWeight = 1.0;
      if (proposal.proposedAction.includes('Pricing') && opinion.executiveId === 'SALES_EXEC') domainWeight = 1.5;
      if (proposal.proposedAction.includes('Pricing') && opinion.executiveId === 'CUST_EXEC') domainWeight = 1.5;

      const totalWeight = opinion.confidence * domainWeight;

      if (opinion.stance === 'SUPPORT') supportWeight += totalWeight;
      if (opinion.stance === 'OPPOSE') opposeWeight += totalWeight;

      if (opinion.escalationLevel === 'BLOCKER') {
        conflicts.push(`${opinion.executiveId} issued a BLOCKER: ${opinion.impactAssessment}`);
      }
      if (opinion.escalationLevel === 'ATTENTION_REQUIRED') {
        conflicts.push(`${opinion.executiveId} flagged risk: ${opinion.impactAssessment}`);
      }
    }

    // Determine consensus
    const totalVotes = supportWeight + opposeWeight;
    const consensusScore = totalVotes > 0 ? supportWeight / totalVotes : 0.5;

    let recommendedAction: 'PROCEED' | 'REJECT' | 'REQUIRE_MODIFICATION' | 'REQUEST_EVIDENCE';

    if (opinions.length === 0) {
      recommendedAction = 'REQUEST_EVIDENCE';
    } else if (conflicts.length > 0 && consensusScore < 0.7) {
      // If there are significant conflicts and consensus isn't overwhelming, require modification
      recommendedAction = 'REQUIRE_MODIFICATION';
    } else if (consensusScore >= 0.7) {
      recommendedAction = 'PROCEED';
    } else if (consensusScore <= 0.3) {
      recommendedAction = 'REJECT';
    } else {
      recommendedAction = 'REQUIRE_MODIFICATION';
    }

    console.log(`\n[Council] Deliberation Complete. Consensus: ${(consensusScore * 100).toFixed(1)}%. Recommendation: ${recommendedAction}\n`);

    return {
      reportId: `REP_${Date.now()}`,
      proposalId: proposal.proposalId,
      opinions,
      consensusScore,
      primaryConflicts: conflicts,
      recommendedAction
    };
  }
}
