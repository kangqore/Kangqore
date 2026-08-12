// Mirrors frontend/src/data/servicesData.js (identity fields only — slug/name/
// departmentSlug/featured, not full marketing copy) and departmentsData.js's 6
// canonical departments. Can't import those files directly (they pull in
// lucide-react/JSX), same reason content-mapping/data/seedBlueprints.ts mirrors
// page structure backend-side instead of importing frontend data.
//
// Source of truth: frontend/src/data/departmentsData.js ("6 Canonical
// Departments... single source of truth") + servicesData.js ("62 Services
// (canonical, single-layer)"). Re-sync this file if either changes.

export interface CanonicalService {
  slug: string;
  name: string;
  departmentSlug: string;
  featured: boolean;
}

export const CANONICAL_DEPARTMENTS: { slug: string; name: string }[] = [
  { slug: 'cognition', name: 'Kangqore Cognition' },
  { slug: 'foundry', name: 'Kangqore Foundry' },
  { slug: 'reimagine', name: 'Kangqore Reimagine' },
  { slug: 'shield', name: 'Kangqore Shield' },
  { slug: 'platforms', name: 'Kangqore Platforms' },
  { slug: 'growth', name: 'Kangqore Growth' },
];

export const CANONICAL_SERVICES: CanonicalService[] = [
  { slug: 'agentic-ai', name: 'Agentic AI Services', departmentSlug: 'cognition', featured: true },
  { slug: 'agentic-ai-led-application-modernization', name: 'Agentic AI-led Application Modernization', departmentSlug: 'cognition', featured: true },
  { slug: 'ai-cognitive-computing', name: 'AI & Cognitive Computing', departmentSlug: 'cognition', featured: false },
  { slug: 'data-science-ai', name: 'Data Science & AI', departmentSlug: 'cognition', featured: false },
  { slug: 'genai-business-services', name: 'GenAI Business Services', departmentSlug: 'cognition', featured: true },
  { slug: 'mlops', name: 'MLOps', departmentSlug: 'cognition', featured: false },
  { slug: 'ai-governance', name: 'AI Governance', departmentSlug: 'shield', featured: true },
  { slug: 'analytics', name: 'Analytics', departmentSlug: 'cognition', featured: false },
  { slug: 'big-data', name: 'Big Data', departmentSlug: 'cognition', featured: false },
  { slug: 'digital-process-automation', name: 'Digital Process Automation (DPA)', departmentSlug: 'cognition', featured: false },
  { slug: 'robotic-process-automation', name: 'Robotic Process Automation (RPA)', departmentSlug: 'cognition', featured: false },
  { slug: 'business-process-management', name: 'Business Process Management', departmentSlug: 'cognition', featured: false },
  { slug: 'intelligent-automation', name: 'Intelligent Automation', departmentSlug: 'cognition', featured: false },
  { slug: 'managed-cloud-services', name: 'Managed Cloud Services', departmentSlug: 'foundry', featured: false },
  { slug: 'aws', name: 'AWS', departmentSlug: 'foundry', featured: false },
  { slug: 'microsoft-services', name: 'Microsoft Services', departmentSlug: 'foundry', featured: false },
  { slug: 'google-cloud-services', name: 'Google Cloud Services', departmentSlug: 'foundry', featured: false },
  { slug: 'cloud-computing', name: 'Cloud Computing', departmentSlug: 'foundry', featured: false },
  { slug: 'embedded-design-systems', name: 'Embedded Design Systems & IT/OT', departmentSlug: 'foundry', featured: false },
  { slug: 'engineering-foundry', name: 'Engineering Foundry', departmentSlug: 'foundry', featured: true },
  { slug: 'engineering-rd-services', name: 'Engineering R&D Services', departmentSlug: 'foundry', featured: false },
  { slug: 'product-digital-engineering', name: 'Product Digital Engineering Services', departmentSlug: 'foundry', featured: false },
  { slug: 'devops-as-a-service', name: 'DevOps as a Service (DaaS)', departmentSlug: 'foundry', featured: false },
  { slug: 'managed-infrastructure-services', name: 'Managed Infrastructure Services', departmentSlug: 'foundry', featured: false },
  { slug: 'modernization-infrastructure', name: 'Modernization Infrastructure', departmentSlug: 'foundry', featured: false },
  { slug: 'managed-services', name: 'Managed Services', departmentSlug: 'foundry', featured: false },
  { slug: 'support-maintenance', name: 'Support And Maintenance', departmentSlug: 'foundry', featured: false },
  { slug: 'software-development', name: 'Software Development', departmentSlug: 'foundry', featured: false },
  { slug: 'api-microservices-engineering', name: 'API & Microservices Engineering', departmentSlug: 'foundry', featured: false },
  { slug: 'internet-of-things', name: 'Internet Of Things (IoT)', departmentSlug: 'foundry', featured: false },
  { slug: 'application-modernization', name: 'Application Modernization', departmentSlug: 'reimagine', featured: true },
  { slug: 'digital-transformation', name: 'Digital Transformation', departmentSlug: 'reimagine', featured: false },
  { slug: 'legacy-modernization', name: 'Legacy Modernization', departmentSlug: 'reimagine', featured: false },
  { slug: 'technology-modernization', name: 'Technology Modernization', departmentSlug: 'reimagine', featured: false },
  { slug: 'technology-transformation', name: 'Technology Transformation', departmentSlug: 'reimagine', featured: false },
  { slug: 'digital-business-transformation', name: 'Digital Business Transformation', departmentSlug: 'reimagine', featured: false },
  { slug: 'technology-consulting', name: 'Technology Consulting', departmentSlug: 'reimagine', featured: false },
  { slug: 'strategy-consulting', name: 'Strategy Consulting', departmentSlug: 'reimagine', featured: false },
  { slug: 'discover-frame-workshops', name: 'Discover & Frame Workshops', departmentSlug: 'reimagine', featured: false },
  { slug: 'mvp-acceleration', name: 'MVP Acceleration', departmentSlug: 'reimagine', featured: false },
  { slug: 'product-strategy-experience-design', name: 'Product Strategy & Experience Design', departmentSlug: 'reimagine', featured: false },
  { slug: 'blockchain', name: 'Blockchain', departmentSlug: 'reimagine', featured: false },
  { slug: 'it-security-services', name: 'IT Security Services', departmentSlug: 'shield', featured: false },
  { slug: 'finance-risk-management', name: 'Finance & Risk Management', departmentSlug: 'shield', featured: false },
  { slug: 'quality-engineering-assurance', name: 'Quality Engineering & Assurance', departmentSlug: 'shield', featured: false },
  { slug: 'operation-technology', name: 'Operation Technology (OT)', departmentSlug: 'shield', featured: false },
  { slug: 'enterprise-platform-integration', name: 'Enterprise Platform Integration', departmentSlug: 'platforms', featured: false },
  { slug: 'pimcore', name: 'Pimcore', departmentSlug: 'platforms', featured: false },
  { slug: 'salesforce', name: 'Salesforce', departmentSlug: 'platforms', featured: true },
  { slug: 'servicenow', name: 'ServiceNow', departmentSlug: 'platforms', featured: false },
  { slug: 'global-capability-centers', name: 'Global Capability Centers (GCC)', departmentSlug: 'platforms', featured: false },
  { slug: 'talent-organization', name: 'Talent & Organization', departmentSlug: 'platforms', featured: false },
  { slug: 'supply-chain', name: 'Supply Chain', departmentSlug: 'platforms', featured: false },
  { slug: 'unified-services-management', name: 'Unified Services Management (USM)', departmentSlug: 'platforms', featured: false },
  { slug: 'cdp-strategy', name: 'Customer Data Strategy', departmentSlug: 'growth', featured: false },
  { slug: 'marketing-ai-readiness', name: 'Marketing AI Readiness', departmentSlug: 'growth', featured: false },
  { slug: 'social-media-management', name: 'Social Media Management', departmentSlug: 'growth', featured: false },
  { slug: 'performance-marketing', name: 'Performance Marketing', departmentSlug: 'growth', featured: true },
  { slug: 'seo-organic-growth-strategy', name: 'SEO & Organic Growth Strategy', departmentSlug: 'growth', featured: false },
  { slug: 'growth-funnels-conversion-engineering', name: 'Growth Funnels & Conversion Engineering', departmentSlug: 'growth', featured: false },
  { slug: 'conversion-rate-optimization', name: 'Conversion Rate Optimization (CRO)', departmentSlug: 'growth', featured: false },
  { slug: 'campaign-planning', name: 'Campaign Planning', departmentSlug: 'growth', featured: false },
];
