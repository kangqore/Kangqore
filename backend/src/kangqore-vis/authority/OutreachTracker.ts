export interface OutreachCampaign {
  id: string;
  name: string;
  startedAt: string;
  prospects: number;
  responses: number;
  placements: number;
  status: 'active' | 'paused' | 'closed';
}

const CAMPAIGNS: OutreachCampaign[] = [];

export class OutreachTracker {
  static list(): OutreachCampaign[] {
    return [...CAMPAIGNS];
  }

  static register(c: OutreachCampaign): void {
    CAMPAIGNS.push(c);
  }
}
