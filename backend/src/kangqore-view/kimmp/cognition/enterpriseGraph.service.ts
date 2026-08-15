// ---------------------------------------------------------------------------
// Phase 6.5 — Enterprise Memory Graph
// Read-only traversal. No new data models — derives from the cognition pipeline.
// Max depth: 2 hops to prevent runaway queries on sparse data.
// ---------------------------------------------------------------------------

import { prisma } from '../../../lib/prisma';

export type GraphEntityType =
  | 'lead' | 'client' | 'signal' | 'decision' | 'project'
  | 'goal' | 'lesson' | 'principle';

export interface GraphNode {
  id:        string;
  type:      string;
  label:     string;
  summary:   string;
  status?:   string;
  createdAt: string;
}

export interface GraphEdge {
  from:  string;
  to:    string;
  label: string;
}

export interface GraphResult {
  rootNode: GraphNode;
  nodes:    GraphNode[];
  edges:    GraphEdge[];
}

function node(type: string, row: any, label: string, summary: string): GraphNode {
  return {
    id:        row.id,
    type,
    label,
    summary:   summary.slice(0, 120),
    status:    row.status ?? undefined,
    createdAt: (row.createdAt ?? new Date()).toISOString(),
  };
}

function edge(from: string, to: string, label: string): GraphEdge {
  return { from, to, label };
}

export class EnterpriseGraphService {
  static async traverse(entityId: string, entityType: GraphEntityType): Promise<GraphResult> {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const seen  = new Set<string>();

    const add = (n: GraphNode) => {
      if (!seen.has(n.id)) { seen.add(n.id); nodes.push(n); }
    };

    let rootNode: GraphNode;

    switch (entityType) {
      case 'decision': {
        const dec = await (prisma as any).kimmpDecision.findUnique({ where: { id: entityId } });
        if (!dec) throw new Error('Decision not found');
        rootNode = node('decision', dec, dec.decisionType, dec.recommendedAction ?? dec.reasoning ?? '');
        add(rootNode);

        // → Signal
        if (dec.signalId) {
          const sig = await (prisma as any).kimmpSignal.findUnique({ where: { id: dec.signalId } }).catch(() => null);
          if (sig) { const n = node('signal', sig, sig.signalType, sig.signalValue ?? ''); add(n); edges.push(edge(entityId, sig.id, 'spawned from')); }
        }
        // → Lead
        if (dec.leadId) {
          const lead = await (prisma as any).clientCRM.findUnique({ where: { id: dec.leadId } }).catch(() => null);
          if (lead) { const n = node('lead', lead, lead.companyName ?? lead.id, `Stage: ${lead.stage ?? 'unknown'}`); add(n); edges.push(edge(entityId, lead.id, 'linked to')); }
        }
        // → Lessons derived from this decision
        const lessons = await (prisma as any).enterpriseEvidence.findMany({ where: { decisionId: entityId }, take: 5 });
        for (const ev of lessons) {
          const ls = await (prisma as any).enterpriseLesson.findFirst({ where: { observationId: { in: (await (prisma as any).enterpriseObservation.findMany({ where: { evidenceId: ev.id }, select: { id: true } })).map((o: any) => o.id) } } }).catch(() => null);
          if (ls) { const n = node('lesson', ls, 'Lesson', ls.lesson); add(n); edges.push(edge(entityId, ls.id, 'generated')); }
        }
        break;
      }

      case 'lesson': {
        const ls = await (prisma as any).enterpriseLesson.findUnique({ where: { id: entityId }, include: { observation: true } });
        if (!ls) throw new Error('Lesson not found');
        rootNode = node('lesson', ls, 'Lesson', ls.lesson);
        add(rootNode);

        // → Observation
        if (ls.observation) {
          const n = node('observation', ls.observation, 'Observation', ls.observation.whatHappened); add(n); edges.push(edge(entityId, ls.observation.id, 'derived from'));
          // → Evidence
          const ev = await (prisma as any).enterpriseEvidence.findUnique({ where: { id: ls.observation.evidenceId } }).catch(() => null);
          if (ev?.decisionId) {
            const dec = await (prisma as any).kimmpDecision.findUnique({ where: { id: ev.decisionId } }).catch(() => null);
            if (dec) { const dn = node('decision', dec, dec.decisionType, dec.recommendedAction ?? ''); add(dn); edges.push(edge(ls.observation.id, dec.id, 'evidence from')); }
          }
        }

        // → Insights
        const li = await (prisma as any).enterpriseLessonInsight.findMany({ where: { lessonId: entityId }, include: { insight: true } });
        for (const row of li) {
          const n = node('insight', row.insight, 'Insight', row.insight.insight); add(n); edges.push(edge(entityId, row.insight.id, 'contributed to'));
        }
        break;
      }

      case 'principle': {
        const pr = await (prisma as any).enterprisePrinciple.findUnique({ where: { id: entityId } });
        if (!pr) throw new Error('Principle not found');
        rootNode = node('principle', pr, 'Principle', pr.statement);
        add(rootNode);

        // → Patterns
        const pp = await (prisma as any).enterprisePrinciplePattern.findMany({ where: { principleId: entityId }, include: { pattern: true } });
        for (const row of pp) {
          const n = node('pattern', row.pattern, 'Pattern', row.pattern.description); add(n); edges.push(edge(entityId, row.pattern.id, 'based on'));
        }

        // → Playbooks
        const pbp = await (prisma as any).enterprisePlaybookPrinciple.findMany({ where: { principleId: entityId }, include: { playbook: true } });
        for (const row of pbp) {
          const n = node('playbook', row.playbook, row.playbook.title, `${Array.isArray(row.playbook.steps) ? row.playbook.steps.length : 0} steps`); add(n); edges.push(edge(entityId, row.playbook.id, 'contributed to'));
        }

        // → Policies
        const policies = await (prisma as any).policyEvolution.findMany({ where: { principleId: entityId, status: 'ACTIVE' } });
        for (const pol of policies) {
          const n = node('policy', pol, 'Policy', pol.statement); add(n); edges.push(edge(entityId, pol.id, 'became'));
        }
        break;
      }

      case 'signal': {
        const sig = await (prisma as any).kimmpSignal.findUnique({ where: { id: entityId } });
        if (!sig) throw new Error('Signal not found');
        rootNode = node('signal', sig, sig.signalType, sig.signalValue ?? '');
        add(rootNode);

        const decs = await (prisma as any).kimmpDecision.findMany({ where: { signalId: entityId }, take: 5 });
        for (const dec of decs) { const n = node('decision', dec, dec.decisionType, dec.recommendedAction ?? ''); add(n); edges.push(edge(entityId, dec.id, 'generated')); }
        break;
      }

      case 'lead': {
        const lead = await (prisma as any).clientCRM.findUnique({ where: { id: entityId } });
        if (!lead) throw new Error('Lead not found');
        rootNode = node('lead', lead, lead.companyName ?? entityId, `Stage: ${lead.stage ?? 'unknown'}`);
        add(rootNode);

        const sigs = await (prisma as any).kimmpSignal.findMany({ where: { leadId: entityId }, take: 5 });
        sigs.forEach((s: any) => { const n = node('signal', s, s.signalType, s.signalValue ?? ''); add(n); edges.push(edge(entityId, s.id, 'generated')); });

        const decs = await (prisma as any).kimmpDecision.findMany({ where: { leadId: entityId }, take: 5 });
        decs.forEach((d: any) => { const n = node('decision', d, d.decisionType, d.recommendedAction ?? ''); add(n); edges.push(edge(entityId, d.id, 'triggered')); });
        break;
      }

      case 'goal': {
        const goal = await (prisma as any).kimmpGoal.findUnique({ where: { id: entityId } });
        if (!goal) throw new Error('Goal not found');
        rootNode = node('goal', goal, goal.title ?? 'Goal', goal.description ?? '');
        add(rootNode);

        const tasks = await (prisma as any).kimmpGoalTask.findMany({ where: { goalId: entityId }, take: 10 });
        tasks.forEach((t: any) => { const n = node('task', t, t.title ?? 'Task', t.description ?? ''); add(n); edges.push(edge(entityId, t.id, 'has task')); });
        break;
      }

      default: {
        rootNode = node(entityType, { id: entityId, createdAt: new Date() }, entityType, 'Entity');
        add(rootNode);
      }
    }

    return { rootNode, nodes, edges };
  }
}
