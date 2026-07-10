import logger from '../utils/logger';
import { WebSearchService } from '../kangqore-immp/scout/webSearch.service';

interface EnrichedData {
  industry: string;
  employees: string;
  revenue: string;
  techStack: string[];
  isEnterprise: boolean;
  score: number; // 0-100
}

// Seed cache for well-known domains — avoids API calls for obvious cases
const KNOWN_DOMAINS: Record<string, EnrichedData> = {
  'stripe.com':  { industry: 'Financial Services / Fintech', employees: '5,000+', revenue: '$1B+',   techStack: ['AWS', 'Ruby', 'React', 'Go'],        isEnterprise: true,  score: 95 },
  'netflix.com': { industry: 'Entertainment / Streaming',    employees: '10,000+', revenue: '$10B+',  techStack: ['AWS', 'Java', 'Node.js', 'React'],   isEnterprise: true,  score: 99 },
  'acme.com':    { industry: 'Manufacturing',                employees: '100-500', revenue: '$10M-$50M', techStack: ['Azure', '.NET', 'Angular'],       isEnterprise: false, score: 65 },
  'startup.io':  { industry: 'SaaS',                         employees: '10-50',   revenue: '<$1M',   techStack: ['Vercel', 'Next.js', 'Supabase'],     isEnterprise: false, score: 45 },
};

const GENERIC_DOMAINS = new Set(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com']);

export class LeadEnrichmentService {
  static async enrichFromEmail(email: string): Promise<EnrichedData | null> {
    const domainMatch = email.match(/@(.+)$/);
    if (!domainMatch) return null;

    const domain = domainMatch[1].toLowerCase();

    if (GENERIC_DOMAINS.has(domain)) {
      logger.info(`LeadEnrichment: Ignored generic domain ${domain}`);
      return null;
    }

    if (KNOWN_DOMAINS[domain]) {
      logger.info(`LeadEnrichment: Cache hit for ${domain}`);
      return KNOWN_DOMAINS[domain];
    }

    logger.info(`LeadEnrichment: Searching web for ${domain}...`);

    try {
      const results = await WebSearchService.search(
        `${domain} company industry size enterprise B2B employees revenue`,
        5,
      );

      if (results.length === 0) {
        return this.defaultEnrichment();
      }

      const combined = results.map(r => `${r.title} ${r.snippet}`).join(' ').toLowerCase();

      const isEnterprise = /enterprise|global|fortune\s*[0-9]|billion|\$[0-9]+b\b|10,000|multinational/i.test(combined);
      const isMidMarket  = /mid.?market|series [bc]|\$[0-9]+m\b|1,000|500 employee/i.test(combined);

      const industry = this.inferIndustry(combined);
      const score    = isEnterprise ? 85 : isMidMarket ? 70 : 55;

      const enriched: EnrichedData = {
        industry,
        employees: isEnterprise ? '1,000+' : isMidMarket ? '100-1,000' : '10-100',
        revenue:   isEnterprise ? '$100M+'  : isMidMarket ? '$10M-$100M' : 'Unknown',
        techStack: [],
        isEnterprise,
        score,
      };

      KNOWN_DOMAINS[domain] = enriched; // cache for session
      return enriched;
    } catch (err: any) {
      logger.warn(`LeadEnrichment: Web search failed for ${domain}: ${err.message}`);
      return this.defaultEnrichment();
    }
  }

  private static inferIndustry(text: string): string {
    if (/fintech|banking|payment|finance/i.test(text))         return 'Financial Services';
    if (/health|medical|pharma|biotech/i.test(text))           return 'Healthcare / Life Sciences';
    if (/saas|software|platform|cloud/i.test(text))            return 'SaaS / Technology';
    if (/retail|ecommerce|e-commerce|shopping/i.test(text))    return 'Retail / E-Commerce';
    if (/manufact|supply.?chain|logistics/i.test(text))        return 'Manufacturing / Logistics';
    if (/media|entertainment|streaming/i.test(text))           return 'Media & Entertainment';
    if (/consult|advisory|professional service/i.test(text))   return 'Professional Services';
    if (/education|edtech|learning/i.test(text))               return 'Education / EdTech';
    return 'B2B Enterprise';
  }

  private static defaultEnrichment(): EnrichedData {
    return { industry: 'B2B Enterprise', employees: '100+', revenue: 'Unknown', techStack: [], isEnterprise: true, score: 60 };
  }
}
