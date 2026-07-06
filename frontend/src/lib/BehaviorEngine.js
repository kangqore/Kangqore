/**
 * BehaviorEngine.js
 * Deterministic physics-to-semantics translator.
 * Transforms raw telemetry (scrolls, clicks, mouse moves) into Semantic Events.
 */

class BehaviorEngine {
  constructor() {
    this.sessionStart = Date.now();
    this.eventLedger = [];
    this.clickCount = 0;
    this.lastClickTime = 0;
  }

  logPhysics(type, data = {}) {
    const now = Date.now();
    let semanticEvent = null;

    if (type === 'CLICK') {
      if (now - this.lastClickTime < 500) {
        this.clickCount++;
        if (this.clickCount >= 3) {
          semanticEvent = 'CONFUSED'; // Rage click
          this.clickCount = 0;
        }
      } else {
        this.clickCount = 1;
      }
      this.lastClickTime = now;
    }

    if (type === 'SCROLL') {
      if (data.depth > 80 && (now - this.sessionStart) > 10000) {
        semanticEvent = 'READING_DEEPLY';
      }
      if (data.velocity > 5000 && data.path && data.path.includes('pricing')) {
        semanticEvent = 'PRICING_SHOCK';
      }
    }

    if (type === 'COPY') {
      if (data.path && (data.path.includes('api') || data.path.includes('docs'))) {
        semanticEvent = 'TECHNICAL_INTEREST';
      }
    }

    if (type === 'IDLE') {
      semanticEvent = 'IDLE';
    }

    if (semanticEvent) {
      this.emitSemanticEvent(semanticEvent, data.path);
    }
  }

  emitSemanticEvent(eventName, path) {
    const event = {
      event: eventName,
      timestamp: new Date().toISOString(),
      path: path || window.location.pathname
    };
    
    // Dispatch to the Reasoning Engine
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kq_semantic_event', { detail: event }));
    }
  }
}

export const behaviorEngine = new BehaviorEngine();
