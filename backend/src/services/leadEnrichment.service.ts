import logger from '../utils/logger';

interface EnrichedData {
  industry: string;
  employees: string;
  revenue: string;
  techStack: string[];
  isEnterprise: boolean;
  score: number; // 0-100
}

/**
 * MOCK: Stealth Lead Enrichment Service
 * In production, this would call Clearbit, Apollo, or ZoomInfo APIs.
 */
export class LeadEnrichmentService {
  static async enrichFromEmail(email: string): Promise<EnrichedData | null> {
    const domainMatch = email.match(/@(.+)$/);
    if (!domainMatch) return null;
    
    const domain = domainMatch[1].toLowerCase();
    
    // Ignore generic free email providers
    const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com'];
    if (genericDomains.includes(domain)) {
      logger.info(`LeadEnrichment: Ignored generic domain ${domain}`);
      return null;
    }

    logger.info(`LeadEnrichment: Enriching domain ${domain}...`);

    // Simulated latency for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock Database
    const mockDb: Record<string, EnrichedData> = {
      'stripe.com': {
        industry: 'Financial Services / Fintech',
        employees: '5,000+',
        revenue: '$1B+',
        techStack: ['AWS', 'Ruby', 'React', 'Go', 'Microservices'],
        isEnterprise: true,
        score: 95
      },
      'netflix.com': {
        industry: 'Entertainment / Streaming',
        employees: '10,000+',
        revenue: '$10B+',
        techStack: ['AWS', 'Java', 'Node.js', 'React', 'Microservices'],
        isEnterprise: true,
        score: 99
      },
      'acme.com': {
        industry: 'Manufacturing',
        employees: '100-500',
        revenue: '$10M-$50M',
        techStack: ['Azure', '.NET', 'Angular', 'Monolith'],
        isEnterprise: false,
        score: 65
      },
      'startup.io': {
        industry: 'SaaS',
        employees: '10-50',
        revenue: '<$1M',
        techStack: ['Vercel', 'Next.js', 'Supabase'],
        isEnterprise: false,
        score: 45
      }
    };

    if (mockDb[domain]) {
      return mockDb[domain];
    }

    // Fallback for unknown corporate domains
    return {
      industry: 'B2B Software',
      employees: '500-1000',
      revenue: '$50M+',
      techStack: ['Cloud', 'React', 'Node.js'],
      isEnterprise: true,
      score: 75
    };
  }
}
