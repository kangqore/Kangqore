export interface SemanticEvent {
  eventId: string;
  eventType: string; // e.g., 'READING_DEEPLY', 'CONFUSED', 'PRICING_SHOCK', 'PAGE_VIEW'
  visitorId: string;
  sessionId: string;
  timestamp: string;
  source: string; // 'web', 'mobile', etc.
  page: string;
  metadata?: any;
  confidence?: number;
}

export interface ConfidenceMatrix {
  overall: number;
  persona: number;
  decisionState: number;
  emotion: number;
  risk: number;
  stability?: 'High' | 'Low'; // Detected volatility over time
  stabilityReason?: string;
}

export interface HumanContextObject {
  schemaVersion: string;
  engineVersion: string;
  visitorId: string;
  sessionId: string;
  persona: string;
  decisionState: string;
  emotion: string;
  riskSignals: string[];
  confidence: ConfidenceMatrix;
  journeyTimeline: SemanticEvent[];
  reasons: string[];
}

export interface DecisionRecommendation {
  id: string; // Add recommendation ID for feedback loop
  objective: string;
  reason: string;
  confidence: number;
  impact: number;
  urgency: number;
  businessValue?: number;
  priority: number;
  suggestedAction?: string; // Optional hint for consumers
  engineVersion: string;
}
