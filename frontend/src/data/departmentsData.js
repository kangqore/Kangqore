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
    serviceCount: 12,
    serviceSlugs: [
      'agentic-ai',
      'agentic-ai-led-application-modernization',
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
    heroBody:
      'Kangqore Cognition delivers 12 services across agentic AI, application modernization, generative AI, MLOps, data science, analytics, and intelligent automation for Chief AI Officers and Chief Data Officers — building production-ready AI systems with governance and observability baked in from day one.',
    heroServiceSlugs: [
      'agentic-ai',
      'genai-business-services',
      'mlops',
      'ai-governance',
      'intelligent-automation',
    ],
    buyerPersonas: {
      primary: 'Chief AI Officer',
      secondary: ['Chief Data Officer', 'COO', 'CTO'],
    },
    businessOutcomes: [
      { metric: '60%', label: 'reduction in manual case-handling time with governed AI agents', caseStudySlug: null },
      { metric: '3x', label: 'faster turnaround on judgment-heavy workflows', caseStudySlug: null },
      { metric: '90 days', label: 'from pilot to governed production deployment', caseStudySlug: null },
    ],
    relatedDepartments: ['shield', 'growth'],
    deliveryApproach: 'Discover & Frame workshop → 90-day diagnostic → fixed-bid Wave 1 → managed run',
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
    heroBody:
      'Kangqore Foundry delivers 17 services across cloud platforms (AWS, Azure, GCP), engineering foundries, infrastructure, and product engineering for CTOs and VPs of Engineering — embedded pods that ship to production weekly with SLA-backed run.',
    heroServiceSlugs: [
      'engineering-foundry',
      'aws',
      'devops-as-a-service',
      'api-microservices-engineering',
      'cloud-computing',
    ],
    buyerPersonas: {
      primary: 'CTO',
      secondary: ['VP Engineering', 'Head of Platform', 'Head of Infrastructure'],
    },
    businessOutcomes: [
      { metric: 'Weekly', label: 'production deploys via golden CI/CD path', caseStudySlug: null },
      { metric: '99.9%', label: 'platform uptime under SRE-managed run', caseStudySlug: null },
      { metric: '6 months', label: 'from architecture review to embedded pod handover', caseStudySlug: null },
    ],
    relatedDepartments: ['reimagine', 'shield'],
    deliveryApproach: 'Architecture review → embedded engineering pod (1-5 FTE) → fixed-bid first delivery → SLA-backed managed run',
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
    heroBody:
      'Kangqore Reimagine delivers 12 services across application modernization, legacy migration, transformation consulting, and MVP acceleration for CIOs and Chief Transformation Officers — risk-managed waves with fixed-bid first sprint and no rewrite gamble.',
    heroServiceSlugs: [
      'application-modernization',
      'legacy-modernization',
      'digital-transformation',
      'strategy-consulting',
      'mvp-acceleration',
    ],
    buyerPersonas: {
      primary: 'CIO',
      secondary: ['Chief Transformation Officer', 'Head of Enterprise Architecture'],
    },
    businessOutcomes: [
      { metric: '90 days', label: 'diagnostic + fixed-bid Wave 1 SOW signed', caseStudySlug: null },
      { metric: '45%', label: 'latency reduction on modernized core systems', caseStudySlug: null },
      { metric: 'Zero', label: 'downtime cutover via risk-managed waves', caseStudySlug: null },
    ],
    relatedDepartments: ['foundry', 'cognition'],
    deliveryApproach: 'Discover & Frame workshop → 90-day diagnostic → fixed-bid Wave 1 → risk-managed waves → managed L3',
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
    heroBody:
      'Kangqore Shield delivers 5 services across cybersecurity, AI governance, finance and risk, quality engineering, and operation technology security for CISOs and CROs — a defensible trust posture across cloud, AI, and operational systems under one unified framework.',
    heroServiceSlugs: [
      'it-security-services',
      'ai-governance',
      'quality-engineering-assurance',
      'finance-risk-management',
      'operation-technology',
    ],
    buyerPersonas: {
      primary: 'CISO',
      secondary: ['Chief Risk Officer', 'DPO', 'Chief Compliance Officer'],
    },
    businessOutcomes: [
      { metric: '30 days', label: 'security posture snapshot + board-ready report', caseStudySlug: null },
      { metric: '100%', label: 'AI governance coverage across model lifecycle', caseStudySlug: null },
      { metric: 'Audit-ready', label: 'cybersecurity + AI governance + OT under one framework', caseStudySlug: null },
    ],
    relatedDepartments: ['cognition', 'foundry'],
    deliveryApproach: '30-day posture snapshot → fixed-bid remediation → managed detection & response → compliance-as-a-service',
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
    heroBody:
      'Kangqore Platforms delivers 8 services across Salesforce, ServiceNow, Pimcore, enterprise integration, GCC, and operations for CIOs and COOs — enterprise platforms implemented in 12 weeks with SLA-backed run and clean handover.',
    heroServiceSlugs: [
      'salesforce',
      'servicenow',
      'enterprise-platform-integration',
      'global-capability-centers',
      'pimcore',
    ],
    buyerPersonas: {
      primary: 'CIO',
      secondary: ['COO', 'CHRO', 'CFO'],
    },
    businessOutcomes: [
      { metric: '12 weeks', label: 'platform live with 3 prioritized integrations', caseStudySlug: null },
      { metric: 'SLA-backed', label: 'managed run with quarterly business reviews', caseStudySlug: null },
      { metric: '30%', label: 'reduction in process drift via unified service management', caseStudySlug: null },
    ],
    relatedDepartments: ['foundry', 'growth'],
    deliveryApproach: 'Platform discovery → 12-week implementation → hypercare → SLA-backed managed run',
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
    heroBody:
      'Kangqore Growth delivers 8 services across customer data strategy, marketing AI, SEO, performance marketing, and conversion engineering for CMOs and Heads of Growth — pipeline you can attribute, not traffic you can boast about.',
    heroServiceSlugs: [
      'performance-marketing',
      'conversion-rate-optimization',
      'seo-organic-growth-strategy',
      'cdp-strategy',
      'marketing-ai-readiness',
    ],
    buyerPersonas: {
      primary: 'CMO',
      secondary: ['CRO (Revenue)', 'Head of Growth', 'Head of Digital'],
    },
    businessOutcomes: [
      { metric: '90 days', label: 'pipeline engine audit + CRO test plan + GEO/LLMO report', caseStudySlug: null },
      { metric: '40%+', label: 'cost reduction in marketing operations via GenAI', caseStudySlug: null },
      { metric: '2-3x', label: 'pipeline attribution clarity vs. last-click models', caseStudySlug: null },
    ],
    relatedDepartments: ['cognition', 'platforms'],
    deliveryApproach: 'Pipeline Engine audit → CRO test plan + AI content runbook → retainer-based growth pod → performance-based scaling',
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
