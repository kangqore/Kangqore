/**
 * EventEngine.js
 * Batches Semantic Events and pushes them to the Server-Side HCIP Event Bus.
 */
import { getVisitorUuid, getSessionUuid } from '../../hooks/useVisitorIdentity';

const BASE = import.meta.env.VITE_BACKEND_URL || '';

class EventEngine {
  constructor() {
    this.batch = [];
    this.flushInterval = setInterval(() => this.flush(), 3000); // Flush every 3s
  }

  push(eventType, metadata = {}, page = window.location.pathname) {
    const event = {
      eventId: crypto.randomUUID(),
      eventType,
      visitorId: getVisitorUuid(),
      sessionId: getSessionUuid(),
      timestamp: new Date().toISOString(),
      source: 'web',
      page,
      metadata
    };
    
    this.batch.push(event);
    
    // Immediate flush for critical events
    if (['CORPORATE_EMAIL_SUBMITTED', 'PAGE_VIEW'].includes(eventType)) {
      this.flush();
    }
  }

  async flush() {
    if (this.batch.length === 0) return;
    
    const eventsToSend = [...this.batch];
    this.batch = [];

    try {
      await fetch(`${BASE}/api/hcip/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsToSend })
      });
      
      // Tell UI to poll for new recommendations since backend state might have changed
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kq_hcip_flush_complete'));
      }
    } catch(e) {
      // Re-queue on failure
      this.batch = [...eventsToSend, ...this.batch];
    }
  }
}

export const eventEngine = new EventEngine();
