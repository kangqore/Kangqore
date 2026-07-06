import { SemanticEvent, HumanContextObject } from './schemas';
import { getIO } from '../socket';
import { prisma } from '../lib/prisma';
import { knowledgeEngine } from '../knowledge/KnowledgeEngine';

/**
 * Reasoning Engine
 * Infers Personas, Decision States, and Emotions from Semantic Events.
 */
export class ReasoningEngine {
  private hcoStore: Map<string, HumanContextObject> = new Map();
  // To track volatility: sessionId -> array of past 5 overall confidences
  private confidenceHistory: Map<string, number[]> = new Map();

  private getDefaultHCO(visitorId: string, sessionId: string): HumanContextObject {
    return {
      schemaVersion: "1.0",
      engineVersion: "2.4.0",
      visitorId,
      sessionId,
      persona: "UNKNOWN",
      decisionState: "DISCOVERY",
      emotion: "NEUTRAL",
      riskSignals: [],
      confidence: {
        overall: 0,
        persona: 0,
        decisionState: 0,
        emotion: 0,
        risk: 0
      },
      journeyTimeline: [],
      reasons: []
    };
  }

  public getContext(sessionId: string, visitorId: string): HumanContextObject {
    if (!this.hcoStore.has(sessionId)) {
      this.hcoStore.set(sessionId, this.getDefaultHCO(visitorId, sessionId));
    }
    return this.hcoStore.get(sessionId)!;
  }

  public processEvent(event: SemanticEvent): HumanContextObject {
    const hco = this.getContext(event.sessionId, event.visitorId);
    
    // Add to timeline
    hco.journeyTimeline.push(event);

    // Business Logic Rules
    switch (event.eventType) {
      case 'PAGE_VIEW': {
        const eventNode = knowledgeEngine.mapUrlToEventNode(event.page);
        if (eventNode) {
          const edges = knowledgeEngine.getOutgoingEdges(eventNode.id, 'INDICATES');
          for (const edge of edges) {
            const target = knowledgeEngine.getNode(edge.target);
            if (target?.type === 'state') {
              this.transitionState(hco, target.name.toUpperCase().replace(/ /g, '_'), edge.weight || 15, `Graph Path: ${eventNode.id} -> INDICATES -> ${target.id}`);
            }
            if (target?.type === 'persona') {
              this.transitionPersona(hco, target.name.toUpperCase().replace(/ /g, '_'), edge.weight || 15, `Graph Path: ${eventNode.id} -> INDICATES -> ${target.id}`);
            }
          }
        }
        break;
      }

      case 'CONFUSED':
      case 'PRICING_SHOCK':
        if (!hco.riskSignals.includes(event.eventType)) {
          hco.riskSignals.push(event.eventType);
        }
        hco.emotion = 'FRUSTRATED';
        hco.confidence.emotion = 80;
        hco.reasons.push(`Risk -> ${event.eventType}: Detected at ${event.page}`);
        break;

      default: {
        const eventNode = knowledgeEngine.mapEventIdToEventNode(event.eventType);
        if (eventNode) {
          const edges = knowledgeEngine.getOutgoingEdges(eventNode.id, 'INDICATES');
          for (const edge of edges) {
            const target = knowledgeEngine.getNode(edge.target);
            if (target?.type === 'state') {
              this.transitionState(hco, target.name.toUpperCase().replace(/ /g, '_'), edge.weight || 20, `Graph Path: ${eventNode.id} -> INDICATES -> ${target.id}`);
            }
            if (target?.type === 'persona') {
              this.transitionPersona(hco, target.name.toUpperCase().replace(/ /g, '_'), edge.weight || 25, `Graph Path: ${eventNode.id} -> INDICATES -> ${target.id}`);
            }
          }
        }
        break;
      }
    }

    // Recalculate overall confidence
    const c = hco.confidence;
    c.overall = Math.round((c.persona + c.decisionState + c.emotion + c.risk) / 4);

    // Track stability
    let history = this.confidenceHistory.get(event.sessionId) || [];
    history.push(c.overall);
    if (history.length > 5) history.shift();
    this.confidenceHistory.set(event.sessionId, history);

    if (history.length >= 3) {
      // Calculate max diff
      const max = Math.max(...history);
      const min = Math.min(...history);
      const diff = max - min;
      if (diff > 25) {
        c.stability = 'Low';
        c.stabilityReason = 'Conflicting evidence causing confidence oscillation';
      } else {
        c.stability = 'High';
        c.stabilityReason = undefined;
      }
    }

    this.hcoStore.set(event.sessionId, hco);
    
    // Asynchronously save Snapshot to DB for auditing & replay
    prisma.hcipDecisionSnapshot.create({
      data: {
        sessionId: hco.sessionId,
        visitorId: hco.visitorId,
        decisionState: hco.decisionState,
        persona: hco.persona,
        confidence: c.overall,
        risk: c.risk,
        engineVersion: hco.engineVersion,
      }
    }).catch((err: any) => console.error("Failed to save HCIP Snapshot:", err));

    // Broadcast to Admin WAANDA Dashboard (Flight Recorder)
    try {
      const io = getIO();
      if (io) {
        io.to('admin').emit('hcip_event', { event, hco });
      }
    } catch (e) {
      // Socket might not be initialized yet
    }

    return hco;
  }

  public getActiveSessions(): HumanContextObject[] {
    return Array.from(this.hcoStore.values());
  }

  private transitionState(hco: HumanContextObject, state: string, confidenceBoost: number, reason: string) {
    if (hco.decisionState !== state) {
      hco.reasons.push(`State -> ${state}: ${reason}`);
      hco.decisionState = state;
    }
    hco.confidence.decisionState = Math.min(99, hco.confidence.decisionState + confidenceBoost);
  }

  private transitionPersona(hco: HumanContextObject, persona: string, confidenceBoost: number, reason: string) {
    if (hco.persona !== persona) {
      hco.reasons.push(`Persona -> ${persona}: ${reason}`);
      hco.persona = persona;
    }
    hco.confidence.persona = Math.min(99, hco.confidence.persona + confidenceBoost);
  }
}

export const reasoningEngine = new ReasoningEngine();
