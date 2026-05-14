/**
 * eQORE Big Brain Knowledge Graph — Industry Taxonomy (Phase 5 v1)
 * 
 * Canonical industry vertical list approved by CTO.
 * This is the authoritative source for industry intelligence.
 */

export type KangqoreIndustry = {
  slug: string;
  name: string;
  description: string;
  priorityLevel: 'standard' | 'high' | 'strategic';
  commonPainPoints: string[];
  relevantDepartments: string[];
};

export const KANGQORE_INDUSTRIES: KangqoreIndustry[] = [
  {
    slug: 'financial-services',
    name: 'Financial Services',
    description: 'Banking, insurance, fintech, investment management, and capital markets.',
    priorityLevel: 'strategic',
    commonPainPoints: ['legacy system modernization', 'regulatory compliance', 'fraud detection', 'customer onboarding', 'real-time analytics'],
    relevantDepartments: ['digital-transformation-modernization', 'cybersecurity', 'ai-cognitive-solutions', 'cloud-engineering', 'enterprise-applications']
  },
  {
    slug: 'healthcare-life-sciences',
    name: 'Healthcare & Life Sciences',
    description: 'Hospitals, pharma, medtech, clinical operations, and health IT.',
    priorityLevel: 'strategic',
    commonPainPoints: ['patient data management', 'hipaa compliance', 'clinical workflow automation', 'drug discovery acceleration', 'telehealth integration'],
    relevantDepartments: ['ai-cognitive-solutions', 'cybersecurity', 'cloud-engineering', 'automation', 'analytics-insights']
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    description: 'Discrete and process manufacturing, industrial automation, and smart factories.',
    priorityLevel: 'high',
    commonPainPoints: ['supply chain visibility', 'predictive maintenance', 'quality control automation', 'legacy OT modernization', 'worker safety'],
    relevantDepartments: ['automation', 'infrastructure-networks-operations', 'ai-cognitive-solutions', 'emerging-technologies']
  },
  {
    slug: 'retail-consumer',
    name: 'Retail & Consumer',
    description: 'E-commerce, retail operations, CPG, and direct-to-consumer brands.',
    priorityLevel: 'high',
    commonPainPoints: ['omnichannel experience', 'personalization', 'inventory optimization', 'conversion rate optimization', 'customer retention'],
    relevantDepartments: ['digital-marketing', 'conversion-engineering', 'ai-cognitive-solutions', 'digital-engineering', 'analytics-insights']
  },
  {
    slug: 'technology-saas',
    name: 'Technology & SaaS',
    description: 'Software companies, SaaS platforms, dev tools, and technology startups.',
    priorityLevel: 'strategic',
    commonPainPoints: ['scaling infrastructure', 'devops maturity', 'product velocity', 'technical debt', 'market expansion'],
    relevantDepartments: ['product-engineering', 'cloud-engineering', 'digital-engineering', 'ai-cognitive-solutions', 'consulting-advisory']
  },
  {
    slug: 'real-estate-proptech',
    name: 'Real Estate & PropTech',
    description: 'Commercial and residential real estate, property management, and real estate technology.',
    priorityLevel: 'standard',
    commonPainPoints: ['property management automation', 'tenant experience', 'digital leasing', 'market analytics', 'portfolio optimization'],
    relevantDepartments: ['digital-transformation-modernization', 'digital-engineering', 'analytics-insights', 'automation']
  },
  {
    slug: 'education-edtech',
    name: 'Education & EdTech',
    description: 'Universities, K-12, online learning platforms, and educational technology companies.',
    priorityLevel: 'standard',
    commonPainPoints: ['learning management', 'student engagement', 'content delivery at scale', 'assessment automation', 'accessibility compliance'],
    relevantDepartments: ['digital-engineering', 'ai-cognitive-solutions', 'cloud-engineering', 'digital-marketing']
  },
  {
    slug: 'logistics-supply-chain',
    name: 'Logistics & Supply Chain',
    description: 'Freight, warehousing, last-mile delivery, and supply chain management.',
    priorityLevel: 'high',
    commonPainPoints: ['route optimization', 'warehouse automation', 'demand forecasting', 'shipment tracking', 'supplier management'],
    relevantDepartments: ['automation', 'ai-cognitive-solutions', 'analytics-insights', 'emerging-technologies', 'business-operations']
  },
  {
    slug: 'telecom-media-entertainment',
    name: 'Telecom, Media & Entertainment',
    description: 'Telecom operators, media companies, streaming, and content platforms.',
    priorityLevel: 'high',
    commonPainPoints: ['network modernization', 'content personalization', 'subscriber churn', 'ad-tech optimization', '5G deployment'],
    relevantDepartments: ['cloud-engineering', 'ai-cognitive-solutions', 'digital-engineering', 'analytics-insights', 'infrastructure-networks-operations']
  },
  {
    slug: 'energy-utilities',
    name: 'Energy & Utilities',
    description: 'Oil & gas, power, renewable energy, water utilities, and smart grid technology.',
    priorityLevel: 'standard',
    commonPainPoints: ['grid modernization', 'predictive maintenance', 'sustainability tracking', 'regulatory compliance', 'field operations'],
    relevantDepartments: ['emerging-technologies', 'automation', 'infrastructure-networks-operations', 'ai-cognitive-solutions']
  },
  {
    slug: 'public-sector-government',
    name: 'Public Sector & Government',
    description: 'Government agencies, defense, public services, and civic technology.',
    priorityLevel: 'standard',
    commonPainPoints: ['citizen service digitization', 'data security', 'legacy system replacement', 'inter-agency integration', 'regulatory compliance'],
    relevantDepartments: ['cybersecurity', 'digital-transformation-modernization', 'cloud-engineering', 'automation']
  },
  {
    slug: 'travel-hospitality',
    name: 'Travel & Hospitality',
    description: 'Airlines, hotels, travel agencies, and hospitality management.',
    priorityLevel: 'standard',
    commonPainPoints: ['booking system modernization', 'guest experience personalization', 'revenue management', 'loyalty programs', 'operational efficiency'],
    relevantDepartments: ['digital-engineering', 'ai-cognitive-solutions', 'digital-marketing', 'analytics-insights']
  },
  {
    slug: 'professional-services',
    name: 'Professional Services',
    description: 'Consulting firms, law firms, accounting firms, and staffing agencies.',
    priorityLevel: 'standard',
    commonPainPoints: ['project management', 'resource utilization', 'client portal automation', 'knowledge management', 'billing optimization'],
    relevantDepartments: ['automation', 'digital-engineering', 'consulting-advisory', 'business-operations']
  },
  {
    slug: 'automotive',
    name: 'Automotive',
    description: 'OEMs, auto parts manufacturers, dealerships, and connected vehicle technology.',
    priorityLevel: 'high',
    commonPainPoints: ['connected vehicle platforms', 'EV charging infrastructure', 'autonomous driving systems', 'dealer digitization', 'supply chain resilience'],
    relevantDepartments: ['emerging-technologies', 'ai-cognitive-solutions', 'product-engineering', 'infrastructure-networks-operations']
  },
  {
    slug: 'agriculture-food-systems',
    name: 'Agriculture & Food Systems',
    description: 'Agritech, food processing, precision agriculture, and food supply chain.',
    priorityLevel: 'standard',
    commonPainPoints: ['precision farming', 'supply chain traceability', 'crop monitoring', 'food safety compliance', 'sustainability reporting'],
    relevantDepartments: ['emerging-technologies', 'ai-cognitive-solutions', 'analytics-insights', 'automation']
  }
];
