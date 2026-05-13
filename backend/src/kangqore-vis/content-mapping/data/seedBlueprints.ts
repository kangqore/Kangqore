import type { KangqoreVisPageType, KangqoreVisSearchIntent, KangqoreVisCtaKind, KangqoreVisSchemaKind } from '@prisma/client';

export interface SeedBlueprint {
  pageName: string;
  url: string;
  pageType: KangqoreVisPageType;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  targetBuyer?: string;
  searchIntent?: KangqoreVisSearchIntent;
  aiIntent?: string;
  problemSolved?: string;
  businessOutcome?: string;
  faqRequired?: boolean;
  schemaRequired?: KangqoreVisSchemaKind[];
  ctaKind?: KangqoreVisCtaKind;
  conversionGoal?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export const SEED_BLUEPRINTS: SeedBlueprint[] = [
  {
    pageName: 'Home',
    url: '/',
    pageType: 'HOME',
    primaryKeyword: 'enterprise digital transformation',
    secondaryKeywords: ['enterprise AI', 'cloud engineering', 'AI consulting'],
    targetBuyer: 'CXO, CTO',
    searchIntent: 'LEARN_EVALUATE_HIRE',
    aiIntent: 'Which company offers enterprise AI and digital transformation?',
    problemSolved: 'Fragmented digital initiatives across enterprise functions',
    businessOutcome: 'Unified, AI-enabled enterprise transformation',
    schemaRequired: ['ORGANIZATION', 'WEBSITE'],
    ctaKind: 'BOOK_CONSULTATION',
    conversionGoal: 'Book consultation',
    metaTitle: 'Enterprise AI, Cloud & Digital Transformation',
    metaDescription:
      'Kangqore enables enterprises to achieve end-to-end digital transformation through modern engineering, AI-enabled innovation, and intelligence-first architecture.',
  },
  {
    pageName: 'About Us',
    url: '/about-us',
    pageType: 'COMPANY',
    primaryKeyword: 'about Kangqore',
    targetBuyer: 'Enterprise buyer, Investor',
    searchIntent: 'NAVIGATIONAL',
    schemaRequired: ['WEBPAGE', 'BREADCRUMB_LIST'],
    ctaKind: 'CONTACT_SALES',
    metaTitle: 'About Us — Engineering Modern Business',
    metaDescription:
      'Kangqore is a value-driven IT company delivering AI, cloud, cybersecurity, and digital transformation solutions across 15 departments and 61+ services.',
  },
  {
    pageName: 'Services',
    url: '/services',
    pageType: 'COMPANY',
    primaryKeyword: 'IT services',
    targetBuyer: 'CXO, CTO, COO',
    searchIntent: 'COMMERCIAL',
    schemaRequired: ['WEBPAGE', 'BREADCRUMB_LIST'],
    ctaKind: 'BOOK_CONSULTATION',
    metaTitle: 'Our Services — 15 Departments · 61 Services',
    metaDescription:
      "Explore Kangqore's full-spectrum digital capabilities: AI & Cognitive, Cloud Engineering, Cybersecurity, Digital Transformation, and 11 more departments.",
  },
  {
    pageName: 'Contact',
    url: '/contact',
    pageType: 'CONTACT',
    primaryKeyword: 'contact Kangqore',
    targetBuyer: 'Enterprise buyer',
    searchIntent: 'TRANSACTIONAL',
    schemaRequired: ['WEBPAGE', 'CONTACT_POINT'],
    ctaKind: 'CONTACT_SALES',
    metaTitle: 'Contact Us — Talk to Our Experts',
    metaDescription:
      "Get in touch with Kangqore's experts for AI, cloud, cybersecurity, and digital transformation consulting.",
  },
  {
    pageName: 'Careers',
    url: '/careers',
    pageType: 'CAREERS',
    primaryKeyword: 'Kangqore careers',
    targetBuyer: 'Job seeker',
    searchIntent: 'NAVIGATIONAL',
    schemaRequired: ['WEBPAGE', 'BREADCRUMB_LIST'],
    ctaKind: 'APPLY',
    metaTitle: 'Careers — Build the Future With Us',
    metaDescription:
      'Join Kangqore and work on cutting-edge AI, cloud, and digital transformation projects.',
  },
];

const DEPARTMENT_SLUGS = [
  ['ai-cognitive', 'AI & Cognitive Solutions'],
  ['cloud-engineering', 'Cloud Engineering'],
  ['cybersecurity', 'Cybersecurity'],
  ['digital-transformation', 'Digital Transformation'],
  ['data-analytics', 'Data & Analytics'],
  ['automation', 'Automation'],
  ['product-engineering', 'Product Engineering'],
  ['infrastructure', 'Infrastructure'],
  ['consulting', 'Consulting'],
  ['digital-engineering', 'Digital Engineering'],
  ['enterprise-apps', 'Enterprise Applications'],
  ['emerging-tech', 'Emerging Technologies'],
  ['business-ops', 'Business Operations'],
  ['digital-marketing', 'Digital Marketing'],
  ['conversion-engineering', 'Conversion Engineering'],
];

for (const [slug, name] of DEPARTMENT_SLUGS) {
  SEED_BLUEPRINTS.push({
    pageName: name,
    url: `/department/${slug}`,
    pageType: 'DEPARTMENT',
    primaryKeyword: name.toLowerCase(),
    targetBuyer: 'CXO, CTO',
    searchIntent: 'LEARN_EVALUATE_HIRE',
    schemaRequired: ['WEBPAGE', 'BREADCRUMB_LIST'],
    ctaKind: 'BOOK_CONSULTATION',
    metaTitle: `${name} — Kangqore`,
    metaDescription: `Kangqore's ${name} services for enterprise transformation.`,
  });
}

const INDUSTRY_SLUGS = [
  ['banking', 'Banking'],
  ['insurance', 'Insurance'],
  ['edtech', 'EdTech'],
  ['healthcare', 'Healthcare'],
  ['life-science', 'Life Science'],
  ['media', 'Media'],
  ['retail', 'Retail'],
  ['travel', 'Travel'],
  ['energy', 'Energy'],
  ['manufacturing', 'Manufacturing'],
  ['information-services', 'Information Services'],
  ['consumer-goods', 'Consumer Goods'],
];

for (const [slug, name] of INDUSTRY_SLUGS) {
  SEED_BLUEPRINTS.push({
    pageName: `${name} Industry`,
    url: `/industries/${slug}`,
    pageType: 'INDUSTRY',
    primaryKeyword: `${name.toLowerCase()} digital transformation`,
    targetBuyer: 'Industry CXO',
    searchIntent: 'COMMERCIAL',
    schemaRequired: ['WEBPAGE', 'BREADCRUMB_LIST'],
    ctaKind: 'BOOK_CONSULTATION',
    metaTitle: `${name} — Industry Solutions`,
    metaDescription: `Kangqore's ${name} industry capabilities and use cases.`,
  });
}

export { DEPARTMENT_SLUGS, INDUSTRY_SLUGS };
