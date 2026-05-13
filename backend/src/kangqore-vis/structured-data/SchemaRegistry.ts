import { buildOrganizationSchema } from './schemas/organization';
import { buildWebSiteSchema } from './schemas/website';
import { buildWebPageSchema } from './schemas/webpage';
import { buildServiceSchema } from './schemas/service';
import { buildFAQPageSchema } from './schemas/faqPage';
import { buildBreadcrumbListSchema } from './schemas/breadcrumbList';
import { buildArticleSchema } from './schemas/article';
import { buildPersonSchema } from './schemas/person';
import { buildProductSchema } from './schemas/product';
import { buildProfessionalServiceSchema } from './schemas/professionalService';
import { buildContactPointSchema } from './schemas/contactPoint';
import type { SchemaKind } from '../core/types';

export const SchemaRegistry = {
  Organization: buildOrganizationSchema,
  WebSite: buildWebSiteSchema,
  WebPage: buildWebPageSchema,
  Service: buildServiceSchema,
  FAQPage: buildFAQPageSchema,
  BreadcrumbList: buildBreadcrumbListSchema,
  Article: buildArticleSchema,
  Person: buildPersonSchema,
  Product: buildProductSchema,
  ProfessionalService: buildProfessionalServiceSchema,
  ContactPoint: buildContactPointSchema,
} as const;

export const DEFAULT_SCHEMAS_BY_TYPE: Record<string, SchemaKind[]> = {
  HOME: ['Organization', 'WebSite'],
  DEPARTMENT: ['WebPage', 'BreadcrumbList'],
  SERVICE: ['Service', 'BreadcrumbList', 'FAQPage'],
  INDUSTRY: ['WebPage', 'BreadcrumbList'],
  CASE_STUDY: ['Article', 'BreadcrumbList'],
  INSIGHT: ['Article', 'BreadcrumbList'],
  BLOG: ['Article', 'BreadcrumbList'],
  WHITE_PAPER: ['Article', 'BreadcrumbList'],
  EVENT: ['WebPage', 'BreadcrumbList'],
  BROCHURE: ['WebPage', 'BreadcrumbList'],
  COMPANY: ['WebPage', 'BreadcrumbList'],
  CAREERS: ['WebPage', 'BreadcrumbList'],
  CONTACT: ['WebPage', 'ContactPoint'],
  LEGAL: ['WebPage'],
  OTHER: ['WebPage'],
};
