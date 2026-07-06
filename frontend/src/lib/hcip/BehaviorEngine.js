/**
 * BehaviorEngine.js (Client-Side)
 * Deterministic physics-to-semantics translator.
 * Transforms raw telemetry into Semantic Events and pushes to EventEngine.
 */
import { eventEngine } from './EventEngine';

class BehaviorEngine {
  constructor() {
    this.sessionStart = Date.now();
    this.clickCount = 0;
    this.lastClickTime = 0;
  }

  logPhysics(type, data = {}) {
    const now = Date.now();
    const path = data.path || window.location.pathname;

    if (type === 'CLICK') {
      if (now - this.lastClickTime < 500) {
        this.clickCount++;
        if (this.clickCount >= 3) {
          eventEngine.push('CONFUSED', data, path); // Rage click
          this.clickCount = 0;
        }
      } else {
        this.clickCount = 1;
      }
      this.lastClickTime = now;
    }

    if (type === 'SCROLL') {
      if (data.depth > 80 && (now - this.sessionStart) > 10000) {
        eventEngine.push('READING_DEEPLY', data, path);
      }
      if (data.velocity > 5000 && path.includes('pricing')) {
        eventEngine.push('PRICING_SHOCK', data, path);
      }
    }

    if (type === 'COPY') {
      if (path.includes('api') || path.includes('docs')) {
        eventEngine.push('TECHNICAL_INTEREST', data, path);
      }
    }

    if (type === 'PAGE_VIEW') {
      eventEngine.push('PAGE_VIEW', data, path);
    }
    
    if (type === 'CHAT_EVENT') {
      eventEngine.push(data.semanticEvent, data, path);
    }
  }
}

export const behaviorEngine = new BehaviorEngine();
