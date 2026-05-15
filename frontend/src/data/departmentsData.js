// ─── Kangqore Departments — 6 Canonical Departments ───────────────────────────
// Single source of truth for the 6 departments (the "what we do" pillars).
// Each department owns a defined ordered list of service slugs (canonical, no
// cross-tagging). All service-level data lives in servicesData.js.
//
// ARCHITECTURE: 6 Departments · 61 Services (canonical, single-layer)
// Supersedes the legacy 15-department structure in departmentData.js
// (note: legacy file is singular `departmentData.js`; this canonical file
// is plural `departmentsData.js`).
// See: /Users/maheshkumar/.claude/plans/act-as-the-lead-curious-starlight.md
//      Sections 17, 18, 19 for the architecture decisions and rationale.
// ────────────────────────────────────────────────────────────────────────────────

import { Brain, Cog, RefreshCw, Shield, Layers, TrendingUp } from 'lucide-react';

export const departmentsData = {
  cognition: {
    slug: 'cognition',
    name: 'Kangqore Cognition',
    shortName: 'Cognition',
    tagline: 'AI, Data & Automation',
    description: 'AI, data, and automation systems your enterprise can actually deploy.',
    bannerBrand: 'eQORE™',
    bannerBrandSlug: 'eqore',
    icon: Brain,
    accentColor: '#2564ea',
    serviceCount: 11,
    serviceSlugs: [
      'agentic-ai',
      'ai-cognitive-computing',
      'data-science-ai',
      'genai-business-services',
      'mlops',
      'analytics',
      'big-data',
      'digital-process-automation',
      'robotic-process-automation',
      'business-process-management',
      'intelligent-automation',
    ],
  },

  foundry: {
    slug: 'foundry',
    name: 'Kangqore Foundry',
    shortName: 'Foundry',
    tagline: 'Cloud, Engineering & Infrastructure',
    description: 'Cloud platforms and engineering teams that ship to production weekly.',
    bannerBrand: 'Engineering Foundry™',
    bannerBrandSlug: 'engineering-foundry',
    icon: Cog,
    accentColor: '#4ab6d4',
    serviceCount: 17,
    serviceSlugs: [
      'managed-cloud-services',
      'aws',
      'microsoft-services',
      'google-cloud-services',
      'cloud-computing',
      'embedded-design-systems',
      'engineering-foundry',
      'engineering-rd-services',
      'product-digital-engineering',
      'devops-as-a-service',
      'managed-infrastructure-services',
      'modernization-infrastructure',
      'managed-services',
      'support-maintenance',
      'software-development',
      'api-microservices-engineering',
      'internet-of-things',
    ],
  },

  reimagine: {
    slug: 'reimagine',
    name: 'Kangqore Reimagine',
    shortName: 'Reimagine',
    tagline: 'Modernization & Transformation',
    description: 'Modernize legacy cores — without the rewrite gamble.',
    bannerBrand: 'The Kangqore Modernization Playbook™',
    bannerBrandSlug: 'modernization-playbook',
    icon: RefreshCw,
    accentColor: '#7c3aed',
    serviceCount: 12,
    serviceSlugs: [
      'application-modernization',
      'digital-transformation',
      'legacy-modernization',
      'technology-modernization',
      'technology-transformation',
      'digital-business-transformation',
      'technology-consulting',
      'strategy-consulting',
      'discover-frame-workshops',
      'mvp-acceleration',
      'product-strategy-experience-design',
      'blockchain',
    ],
  },

  shield: {
    slug: 'shield',
    name: 'Kangqore Shield',
    shortName: 'Shield',
    tagline: 'Security, Risk & Trust',
    description: 'Cybersecurity, AI governance, and assurance — under one trust framework.',
    bannerBrand: 'Shield™ Trust & Governance Framework',
    bannerBrandSlug: 'shield-framework',
    icon: Shield,
    accentColor: '#dc2626',
    serviceCount: 5,
    serviceSlugs: [
      'it-security-services',
      'finance-risk-management',
      'ai-governance',
      'quality-engineering-assurance',
      'operation-technology',
    ],
  },

  platforms: {
    slug: 'platforms',
    name: 'Kangqore Platforms',
    shortName: 'Platforms',
    tagline: 'Enterprise Applications & Operations',
    description: 'Salesforce, ServiceNow, Pimcore — implemented in 12 weeks, run with SLA.',
    bannerBrand: 'ALIS™',
    bannerBrandSlug: 'alis',
    icon: Layers,
    accentColor: '#0891b2',
    serviceCount: 8,
    serviceSlugs: [
      'enterprise-platform-integration',
      'pimcore',
      'salesforce',
      'servicenow',
      'global-capability-centers',
      'talent-organization',
      'supply-chain',
      'unified-services-management',
    ],
  },

  growth: {
    slug: 'growth',
    name: 'Kangqore Growth',
    shortName: 'Growth',
    tagline: 'Marketing, Visibility & Conversion',
    description: 'Pipeline you can attribute, not traffic you can boast about.',
    bannerBrand: 'KVIS™',
    bannerBrandSlug: 'kvis',
    icon: TrendingUp,
    accentColor: '#16a34a',
    serviceCount: 8,
    serviceSlugs: [
      'cdp-strategy',
      'marketing-ai-readiness',
      'social-media-management',
      'performance-marketing',
      'seo-organic-growth-strategy',
      'growth-funnels-conversion-engineering',
      'conversion-rate-optimization',
      'campaign-planning',
    ],
  },
};

// Ordered list of department slugs (for nav, sitemap, iteration order).
export const departmentsList = [
  'cognition',
  'foundry',
  'reimagine',
  'shield',
  'platforms',
  'growth',
];

// Lookup helper. Throws on invalid slug so callers fail loudly rather than
// rendering an empty page.
export const getDepartment = (slug) => {
  const department = departmentsData[slug];
  if (!department) {
    throw new Error(
      `Unknown department slug: "${slug}". Valid slugs: ${departmentsList.join(', ')}`
    );
  }
  return department;
};

export default departmentsData;
