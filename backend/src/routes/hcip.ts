import express from 'express';
import { SemanticEvent } from '../hcip/schemas';
import { reasoningEngine } from '../hcip/ReasoningEngine';
import { decisionEngine } from '../hcip/DecisionEngine';
import { knowledgeEngine } from '../knowledge/KnowledgeEngine';
import { prisma } from '../lib/prisma';

const router = express.Router();

/**
 * POST /api/hcip/events
 * Ingests an array of Semantic Events from the client.
 */
router.post('/events', (req, res) => {
  const events: SemanticEvent[] = req.body.events;
  if (!events || !Array.isArray(events)) {
    return res.status(400).json({ error: 'Expected an array of events' });
  }

  // Process all events through ReasoningEngine (in-memory)
  let lastHco = null;
  for (const event of events) {
    lastHco = reasoningEngine.processEvent(event);
  }

  // Persist session snapshot + events to DB (non-blocking — never fails the response)
  if (lastHco) {
    const sessionId = lastHco.sessionId as string
    ;(async () => {
      try {
        // Upsert HcipSession with latest in-memory state
        const pageSeq = (lastHco.journeyTimeline ?? []).map((t: SemanticEvent) => t.page ?? '').filter(Boolean)
        const snapshot = {
          persona:       lastHco.persona       ?? null,
          decisionStage: lastHco.decisionState ?? null,
          intentSignals: (lastHco.riskSignals  ?? []) as any,
          goalsCaptured: (lastHco.reasons      ?? []) as any,
          pageSequence:  pageSeq,
        }
        await (prisma as any).hcipSession.upsert({
          where:  { sessionId },
          create: { sessionId, visitorStage: 'UNKNOWN', ...snapshot },
          update: snapshot,
        })

        // Write each event to HcipEvent table
        for (const event of events) {
          await (prisma as any).hcipEvent.create({
            data: {
              sessionId: event.sessionId ?? sessionId,
              eventType: event.eventType ?? 'UNKNOWN',
              page:      event.page      ?? null,
              metadata:  event.metadata  ?? null,
            },
          }).catch(() => {})
        }
      } catch { /* ignore DB errors — in-memory engine is authoritative */ }
    })()
  }

  res.json({ success: true });
});

/**
 * GET /api/hcip/context/:sessionId
 * Retrieves the current HumanContextObject for a session.
 */
router.get('/context/:sessionId', (req, res) => {
  const visitorId = req.query.visitorId as string || 'unknown';
  const hco = reasoningEngine.getContext(req.params.sessionId, visitorId);
  res.json(hco);
});

/**
 * GET /api/hcip/sessions
 * Returns all active sessions. (Admin only - WAANDA Session Replay)
 */
router.get('/sessions', (req, res) => {
  const sessions = reasoningEngine.getActiveSessions();
  // Ensure we sort by recent activity or just return all
  res.json({ sessions });
});

/**
 * GET /api/hcip/replay/:sessionId
 * Returns the timeline of a specific session for the flight recorder.
 */
router.get('/replay/:sessionId', (req, res) => {
  const hco = reasoningEngine.getContext(req.params.sessionId, 'unknown');
  res.json({ timeline: hco.journeyTimeline, hco });
});

/**
 * GET /api/hcip/recommendations/:sessionId
 * Generates the current objective for the UI/agents.
 */
router.get('/recommendations/:sessionId', (req, res) => {
  const visitorId = req.query.visitorId as string || 'unknown';
  const hco = reasoningEngine.getContext(req.params.sessionId, visitorId);
  const recommendation = decisionEngine.generateRecommendation(hco);
  res.json({ recommendation, hco }); // UI usually wants both to execute
});

/**
 * GET /api/hcip/mission-control
 * Aggregates active sessions with trends and alerts.
 */
router.get('/mission-control', (req, res) => {
  const sessions = reasoningEngine.getActiveSessions();
  const total = sessions.length;
  const enterprise = sessions.filter(s => s.persona === 'ENTERPRISE_BUYER').length;
  const pricingShock = sessions.filter(s => s.riskSignals.includes('PRICING_SHOCK')).length;
  const highIntent = sessions.filter(s => s.decisionState === 'VENDOR_SELECTION' || s.decisionState === 'PURCHASE').length;

  res.json({
    metrics: {
      totalVisitors: total,
      enterpriseProspects: enterprise,
      highIntent: highIntent,
      pricingShock: pricingShock
    },
    // Mock trends for V1 UI
    trends: {
      enterpriseProspects: '↑ +3 Last Hour',
      pricingShock: pricingShock > 0 ? `↑ +${pricingShock} Last 30 Minutes` : 'Stable'
    },
    alerts: pricingShock > 0 ? [{ id: '1', message: 'Pricing Shock Spike detected', severity: 'high' }] : []
  });
});

/**
 * GET /api/hcip/recommendation-queue
 * Pulls high-priority recommendations across all active sessions.
 */
router.get('/recommendation-queue', (req, res) => {
  const sessions = reasoningEngine.getActiveSessions();
  const queue = sessions
    .map(s => {
      const rec = decisionEngine.generateRecommendation(s);
      return { recommendation: rec, session: s };
    })
    .filter(item => item.recommendation.priority > 0)
    .sort((a, b) => b.recommendation.priority - a.recommendation.priority);

  res.json({ queue });
});

/**
 * POST /api/hcip/feedback
 * Persists operator feedback to the HcipFeedback store.
 */
router.post('/feedback', async (req, res) => {
  try {
    const { recommendationId, visitorId, sessionId, operatorId, engineVersion, action, reason, comment } = req.body;
    const feedback = await prisma.hcipFeedback.create({
      data: {
        recommendationId,
        visitorId,
        sessionId,
        operatorId,
        engineVersion,
        action,
        reason,
        comment
      }
    });
    res.json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ error: 'Failed to persist feedback' });
  }
});

/**
 * POST /api/hcip/outcome
 * Persists actual business results to the HcipOutcome store.
 */
router.post('/outcome', async (req, res) => {
  try {
    const { recommendationId, outcome, revenue, notes } = req.body;
    const result = await prisma.hcipOutcome.create({
      data: {
        recommendationId,
        outcome,
        revenue,
        notes
      }
    });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to persist outcome' });
  }
});

/**
 * GET /api/hcip/graph/stats
 * Returns platform health metrics for the Knowledge Layer.
 */
router.get('/graph/stats', (req, res) => {
  res.json(knowledgeEngine.getGraphStats());
});

/**
 * GET /api/hcip/graph
 * Returns the entire Knowledge Graph (Nodes and Edges).
 */
router.get('/graph', (req, res) => {
  res.json({
    nodes: knowledgeEngine.getAllNodes(),
    edges: knowledgeEngine.getAllEdges()
  });
});

/**
 * POST /api/hcip/explain
 * Reconstructs the reasoning trace backwards.
 */
router.post('/explain', (req, res) => {
  const { recommendationId, sessionId, visitorId } = req.body;
  const hco = reasoningEngine.getContext(sessionId, visitorId || 'unknown');
  const recommendation = decisionEngine.generateRecommendation(hco);

  // Reconstruct path: recommendation -> objective -> state -> event -> visitor
  // This is a simplified static trace for demonstration, using the graph Engine
  const nodes = knowledgeEngine.getAllNodes();
  const edges = knowledgeEngine.getAllEdges();

  const trace = {
    visitor: { id: hco.visitorId, persona: hco.persona },
    events: hco.journeyTimeline.map(e => e.eventType),
    decisionState: hco.decisionState,
    objective: recommendation.objective,
    recommendation: recommendation.suggestedAction,
    confidence: hco.confidence.overall
  };

  // Rejected alternatives (demo data matching user request)
  const alternatives = [];
  if (recommendation.suggestedAction === 'Architecture Review') {
    alternatives.push({
      action: 'Offer Demo',
      confidence: 74,
      rejectedReason: 'Policy violation: Trust too low'
    });
  }

  res.json({
    trace,
    alternatives,
    hco
  });
});

/**
 * GET /api/hcip/graph/trace/:sessionId
 * Returns the dynamic reasoning trace subgraph for a specific visitor.
 */
router.get('/graph/trace/:sessionId', (req, res) => {
  const visitorId = req.query.visitorId as string || 'unknown';
  const hco = reasoningEngine.getContext(req.params.sessionId, visitorId);
  const rec = decisionEngine.generateRecommendation(hco);

  // Here we would dynamically build a subgraph, but for now we'll return 
  // the full graph + the session info so the frontend can trace it.
  res.json({
    hco,
    recommendation: rec,
    graph: {
      nodes: knowledgeEngine.getAllNodes(),
      edges: knowledgeEngine.getAllEdges()
    }
  });
});

export default router;
