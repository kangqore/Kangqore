import { prisma } from '../../lib/prisma';
import { DataSourceRegistry } from '../data-sources/DataSourceRegistry';

export interface KpiCard {
  metric: string;
  label: string;
  source: string;
  value: number | string | null;
  status: 'live' | 'unconnected' | 'empty';
}

export class KpiAggregator {
  static async overview(): Promise<{ kpis: KpiCard[]; connected: string[]; unconnected: string[] }> {
    const sourceReport = await DataSourceRegistry.report();
    const connected = sourceReport.filter((s) => s.status === 'connected').map((s) => s.name);
    const unconnected = sourceReport.filter((s) => s.status !== 'connected').map((s) => s.name);

    const blueprintCount = await prisma.kangqoreVisPageBlueprint.count();
    const publishedCount = await prisma.kangqoreVisPageBlueprint.count({ where: { status: 'PUBLISHED' } });
    const faqCount = await prisma.kangqoreVisFAQ.count({ where: { published: true } });
    const internalLinkCount = await prisma.kangqoreVisInternalLink.count();
    const cwvSamples = await prisma.kangqoreVisCwvSample.count();
    const conciergeConversations = await prisma.conversation.count({ where: { kind: 'concierge' } });
    const visits = await prisma.visit.count();
    const consultationLeads = await prisma.consultation.count();

    const kpis: KpiCard[] = [
      { metric: 'pages_total', label: 'Page blueprints', source: 'kangqore-vis', value: blueprintCount, status: 'live' },
      { metric: 'pages_published', label: 'Published pages', source: 'kangqore-vis', value: publishedCount, status: 'live' },
      { metric: 'faq_total', label: 'FAQ entries', source: 'kangqore-vis', value: faqCount, status: 'live' },
      { metric: 'internal_links', label: 'Internal links tracked', source: 'kangqore-vis', value: internalLinkCount, status: 'live' },
      { metric: 'cwv_samples', label: 'Web Vitals samples', source: 'kangqore-vis', value: cwvSamples, status: cwvSamples > 0 ? 'live' : 'empty' },
      { metric: 'concierge_conversations', label: 'AI Concierge conversations', source: 'concierge', value: conciergeConversations, status: 'live' },
      { metric: 'visits_total', label: 'Site visits', source: 'analytics', value: visits, status: 'live' },
      { metric: 'consultation_leads', label: 'Consultation leads', source: 'lead-form', value: consultationLeads, status: 'live' },
      { metric: 'organic_impressions', label: 'Organic impressions', source: 'google-search-console', value: null, status: connected.includes('google-search-console') ? 'live' : 'unconnected' },
      { metric: 'organic_clicks', label: 'Organic clicks', source: 'google-search-console', value: null, status: connected.includes('google-search-console') ? 'live' : 'unconnected' },
      { metric: 'avg_ranking', label: 'Average ranking', source: 'google-search-console', value: null, status: connected.includes('google-search-console') ? 'live' : 'unconnected' },
      { metric: 'ai_overview_visibility', label: 'AI Overview visibility', source: 'answer-engine', value: null, status: connected.includes('answer-engine') ? 'live' : 'unconnected' },
      { metric: 'lighthouse_performance', label: 'Lighthouse performance', source: 'lighthouse', value: null, status: connected.includes('lighthouse') ? 'live' : 'unconnected' },
      { metric: 'backlink_count', label: 'Backlinks', source: 'ahrefs', value: null, status: connected.includes('ahrefs') ? 'live' : 'unconnected' },
    ];

    return { kpis, connected, unconnected };
  }
}
