import type { KangqoreVisSchemaKind } from '@prisma/client';

export interface SeedEntity {
  slug: string;
  name: string;
  description?: string;
  category: 'department' | 'industry' | 'product' | 'company';
  url?: string;
  schemaType?: KangqoreVisSchemaKind;
  sameAs?: string[];
  proofPoints?: string[];
}

export const SEED_ENTITIES: SeedEntity[] = [
  {
    slug: 'kangqore',
    name: 'Kangqore',
    description: 'Value-driven IT company for enterprise digital transformation.',
    category: 'company',
    url: '/',
    schemaType: 'ORGANIZATION',
    sameAs: [
      'https://www.linkedin.com/company/kangqore',
      'https://x.com/kangqore',
    ],
  },

  { slug: 'ai-cognitive', name: 'AI & Cognitive Solutions', category: 'department', url: '/department/ai-cognitive', schemaType: 'SERVICE' },
  { slug: 'cloud-engineering', name: 'Cloud Engineering', category: 'department', url: '/department/cloud-engineering', schemaType: 'SERVICE' },
  { slug: 'cybersecurity', name: 'Cybersecurity', category: 'department', url: '/department/cybersecurity', schemaType: 'SERVICE' },
  { slug: 'digital-transformation', name: 'Digital Transformation', category: 'department', url: '/department/digital-transformation', schemaType: 'SERVICE' },
  { slug: 'data-analytics', name: 'Data & Analytics', category: 'department', url: '/department/data-analytics', schemaType: 'SERVICE' },
  { slug: 'automation', name: 'Automation', category: 'department', url: '/department/automation', schemaType: 'SERVICE' },
  { slug: 'product-engineering', name: 'Product Engineering', category: 'department', url: '/department/product-engineering', schemaType: 'SERVICE' },
  { slug: 'infrastructure', name: 'Infrastructure', category: 'department', url: '/department/infrastructure', schemaType: 'SERVICE' },
  { slug: 'consulting', name: 'Consulting', category: 'department', url: '/department/consulting', schemaType: 'SERVICE' },
  { slug: 'digital-engineering', name: 'Digital Engineering', category: 'department', url: '/department/digital-engineering', schemaType: 'SERVICE' },
  { slug: 'enterprise-apps', name: 'Enterprise Applications', category: 'department', url: '/department/enterprise-apps', schemaType: 'SERVICE' },
  { slug: 'emerging-tech', name: 'Emerging Technologies', category: 'department', url: '/department/emerging-tech', schemaType: 'SERVICE' },
  { slug: 'business-ops', name: 'Business Operations', category: 'department', url: '/department/business-ops', schemaType: 'SERVICE' },
  { slug: 'digital-marketing', name: 'Digital Marketing', category: 'department', url: '/department/digital-marketing', schemaType: 'SERVICE' },
  { slug: 'conversion-engineering', name: 'Conversion Engineering', category: 'department', url: '/department/conversion-engineering', schemaType: 'SERVICE' },

  { slug: 'industry-banking', name: 'Banking', category: 'industry', url: '/industries/banking' },
  { slug: 'industry-insurance', name: 'Insurance', category: 'industry', url: '/industries/insurance' },
  { slug: 'industry-edtech', name: 'EdTech', category: 'industry', url: '/industries/edtech' },
  { slug: 'industry-healthcare', name: 'Healthcare', category: 'industry', url: '/industries/healthcare' },
  { slug: 'industry-life-science', name: 'Life Science', category: 'industry', url: '/industries/life-science' },
  { slug: 'industry-media', name: 'Media', category: 'industry', url: '/industries/media' },
  { slug: 'industry-retail', name: 'Retail', category: 'industry', url: '/industries/retail' },
  { slug: 'industry-travel', name: 'Travel', category: 'industry', url: '/industries/travel' },
  { slug: 'industry-energy', name: 'Energy', category: 'industry', url: '/industries/energy' },
  { slug: 'industry-manufacturing', name: 'Manufacturing', category: 'industry', url: '/industries/manufacturing' },
  { slug: 'industry-information-services', name: 'Information Services', category: 'industry', url: '/industries/information-services' },
  { slug: 'industry-consumer-goods', name: 'Consumer Goods', category: 'industry', url: '/industries/consumer-goods' },

  {
    slug: 'eqore',
    name: 'Eqore',
    description: 'Kangqore proprietary AI platform.',
    category: 'product',
    url: '/eqore',
    schemaType: 'PRODUCT',
  },
];
