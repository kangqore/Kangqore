import { adminApi } from '../../lib/api';

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
  const response = await adminApi<{ success: boolean, data: LiveSession[] }>('/kangqore/urgi/sessions/live');
  return response.data;
};

export const fetchEvidenceLedger = async (): Promise<EvidenceRow[]> => {
  const response = await adminApi<{ success: boolean, data: EvidenceRow[] }>('/kangqore/urgi/evidence');
  return response.data;
};

export const fetchDigitalTwin = async (id: string): Promise<DigitalTwin> => {
  const response = await adminApi<{ success: boolean, data: DigitalTwin }>(`/kangqore/urgi/twin/${id}`);
  return response.data;
};

export const triggerReplayQueue = async (startTime: string, endTime: string): Promise<any> => {
  return await adminApi('/kangqore/urgi/replay/initialize', {
    method: 'POST',
    body: JSON.stringify({ startTime, endTime }),
  });
};

export const updateGovernance = async (action: string): Promise<any> => {
  return await adminApi('/kangqore/urgi/governance/update', {
    method: 'POST',
    body: JSON.stringify({ action }),
  });
};
