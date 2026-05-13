export type PageType =
  | 'home'
  | 'department'
  | 'service'
  | 'industry'
  | 'case-study'
  | 'insight'
  | 'blog'
  | 'white-paper'
  | 'event'
  | 'brochure'
  | 'company'
  | 'legal'
  | 'careers'
  | 'contact'
  | 'other';

export type SearchIntent =
  | 'informational'
  | 'navigational'
  | 'commercial'
  | 'transactional'
  | 'learn-evaluate-hire';

export type AIIntent = string;

export type SchemaKind =
  | 'Organization'
  | 'WebSite'
  | 'WebPage'
  | 'Service'
  | 'FAQPage'
  | 'BreadcrumbList'
  | 'Article'
  | 'Person'
  | 'Product'
  | 'ProfessionalService'
  | 'ContactPoint';

export type CtaKind =
  | 'book-consultation'
  | 'contact-sales'
  | 'request-proposal'
  | 'download-asset'
  | 'subscribe'
  | 'apply'
  | 'none';

export type AdapterKind = 'analytics' | 'seo' | 'performance' | 'answer-engine';

export type ConnectorStatus = 'connected' | 'unconnected' | 'error';

export type GovernanceCheckId =
  | 'crawlable'
  | 'text-based'
  | 'title-clear'
  | 'intent-clear'
  | 'primary-keyword-mapped'
  | 'parent-hub-linked'
  | 'related-services-linked'
  | 'schema-added'
  | 'faqs-added'
  | 'gro-snippet-added'
  | 'cta-clear'
  | 'page-fast'
  | 'proof-visible'
  | 'enterprise-tone';

export interface CwvSamplePayload {
  url: string;
  metric: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType?: string;
  userAgent?: string;
}

export const KANGQORE_VIS_VERSION = '0.1.0';
