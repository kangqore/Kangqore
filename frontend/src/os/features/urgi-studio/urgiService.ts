import { api } from '../../lib/api';

export interface LiveSession {
  id: string;
  status: string;
  trustScore: number;
  maturityLevel: number;
  lastAction: string;
}

export interface EvidenceRow {
  id: number;
  timestamp: string;
  visitor: string;
  factKey: string;
  confidence: number;
  status: 'VERIFIED' | 'HYPOTHESIS' | 'SHADOW';
}

export interface DigitalTwin {
  id: string;
  identity: string;
  trustScore: number;
  maturity: string;
  recentFacts: string[];
  behavioralTraits: string[];
}

export const fetchLiveSessions = async (): Promise<LiveSession[]> => {
  const response = await api.get('/kangqore/urgi/sessions/live');
  return response.data.data;
};

export const fetchEvidenceLedger = async (): Promise<EvidenceRow[]> => {
  const response = await api.get('/kangqore/urgi/evidence');
  return response.data.data;
};

export const fetchDigitalTwin = async (id: string): Promise<DigitalTwin> => {
  const response = await api.get(`/kangqore/urgi/twin/${id}`);
  return response.data.data;
};

export const triggerReplayQueue = async (startTime: string, endTime: string): Promise<any> => {
  const response = await api.post('/kangqore/urgi/replay/initialize', { startTime, endTime });
  return response.data;
};

export const updateGovernance = async (action: string): Promise<any> => {
  const response = await api.post('/kangqore/urgi/governance/update', { action });
  return response.data;
};
