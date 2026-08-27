/**
 * eQORE Big Brain Knowledge Graph — Graph Seed Service (Phase 5)
 * 
 * Populates the graph from the Kangqore taxonomy. Idempotent — can be re-run safely.
 * Uses upsert for nodes and edges, deactivates missing nodes instead of deleting.
 */

import { prisma } from '../../lib/prisma';
import logger from '../../utils/logger';
import { KANGQORE_DEPARTMENTS, KANGQORE_SERVICES } from '../taxonomy/kangqoreServiceTaxonomy';
import { KANGQORE_INDUSTRIES } from '../taxonomy/kangqoreIndustryTaxonomy';

const SEED_VERSION = 'graph-seed-v1';

export class GraphSeedService {
  /**
   * Seeds the entire knowledge graph from the canonical taxonomy.
   */
  static async seedAll(): Promise<{ nodes: number; edges: number }> {
    let nodeCount = 0;
    let edgeCount = 0;

    try {
      // 1. Seed Department Nodes
      for (const dept of KANGQORE_DEPARTMENTS) {
        await this.upsertNode('DEPARTMENT', dept.slug, dept.name, dept.description);
        nodeCount++;
      }

      // 2. Seed Service Nodes + BELONGS_TO edges
      // Phase 5 correction: seed ALL services listed in departments, not just the ones with full definitions
      const allServiceSlugs = new Set<string>();
      for (const dept of KANGQORE_DEPARTMENTS) {
        for (const svcSlug of dept.services) {
          allServiceSlugs.add(svcSlug);
          const fullDef = KANGQORE_SERVICES[svcSlug];
          const label = fullDef?.name || this.humanize(svcSlug);
          const description = fullDef?.description || `${label} service within ${dept.name}`;
          const metadata = fullDef ? {
            priorityLevel: fullDef.priorityLevel,
            signalKeywords: fullDef.signalKeywords
          } : { priorityLevel: 'standard' };

          await this.upsertNode('SERVICE', svcSlug, label, description, metadata);
          nodeCount++;

          // BELONGS_TO → Department
          const edgeResult = await this.upsertEdge(
            'SERVICE', svcSlug,
            'DEPARTMENT', dept.slug,
            'BELONGS_TO',
            1.0, 100,
            `${label} belongs to ${dept.name}`
          );
          if (edgeResult) edgeCount++;
        }
      }

      // 3. Seed Problem Nodes from painPointSignals (only for services with full definitions)
      const seenProblems = new Set<string>();
      for (const [slug, service] of Object.entries(KANGQORE_SERVICES)) {
        for (const pain of service.painPointSignals) {
          const problemSlug = this.slugify(pain);
          if (!seenProblems.has(problemSlug)) {
            await this.upsertNode('PROBLEM', problemSlug, pain, `Business problem: ${pain}`);
            seenProblems.add(problemSlug);
            nodeCount++;
          }
          // SOLVES edge
          const edgeResult = await this.upsertEdge(
            'SERVICE', slug,
            'PROBLEM', problemSlug,
            'SOLVES',
            0.8, 90,
            `${service.name} addresses "${pain}"`
          );
          if (edgeResult) edgeCount++;
        }
      }

      // 4. Seed Solution Package Nodes
      const seenPackages = new Set<string>();
      for (const [slug, service] of Object.entries(KANGQORE_SERVICES)) {
        for (const pkg of service.recommendedSolutionPackages) {
          const pkgSlug = this.slugify(pkg);
          if (!seenPackages.has(pkgSlug)) {
            await this.upsertNode('SOLUTION_PACKAGE', pkgSlug, pkg, `Strategic solution: ${pkg}`);
            seenPackages.add(pkgSlug);
            nodeCount++;
          }
          // PACKAGED_AS edge
          const edgeResult = await this.upsertEdge(
            'SERVICE', slug,
            'SOLUTION_PACKAGE', pkgSlug,
            'PACKAGED_AS',
            0.9, 95,
            `${service.name} is delivered via "${pkg}"`
          );
          if (edgeResult) edgeCount++;
        }
      }

      // 5. Seed Industry Nodes
      for (const industry of KANGQORE_INDUSTRIES) {
        await this.upsertNode('INDUSTRY', industry.slug, industry.name, industry.description, {
          priorityLevel: industry.priorityLevel,
          commonPainPoints: industry.commonPainPoints
        });
        nodeCount++;

        // Also seed into EqoreIndustry table
        await prisma.eqoreIndustry.upsert({
          where: { slug: industry.slug },
          update: {
            name: industry.name,
            description: industry.description,
            priorityLevel: industry.priorityLevel,
            commonPainPoints: industry.commonPainPoints,
            relevantDepartments: industry.relevantDepartments
          },
          create: {
            slug: industry.slug,
            name: industry.name,
            description: industry.description,
            priorityLevel: industry.priorityLevel,
            commonPainPoints: industry.commonPainPoints,
            relevantDepartments: industry.relevantDepartments
          }
        });

        // PROVEN_IN edges: Connect departments to industries
        for (const deptSlug of industry.relevantDepartments) {
          const edgeResult = await this.upsertEdge(
            'DEPARTMENT', deptSlug,
            'INDUSTRY', industry.slug,
            'PROVEN_IN',
            0.7, 80,
            `${deptSlug} has proven delivery in ${industry.name}`
          );
          if (edgeResult) edgeCount++;
        }
      }

      // 6. Seed Cross-Sell / Complements edges (ALL services within same department)
      for (const dept of KANGQORE_DEPARTMENTS) {
        const deptServices = dept.services;
        for (let i = 0; i < deptServices.length; i++) {
          for (let j = i + 1; j < deptServices.length; j++) {
            const edgeResult = await this.upsertEdge(
              'SERVICE', deptServices[i],
              'SERVICE', deptServices[j],
              'COMPLEMENTS',
              0.6, 75,
              `Both within ${dept.name}, complementary offerings`
            );
            if (edgeResult) edgeCount++;
          }
        }
      }

      // 7. Seed Consultant Profiles
      const consultants = this.getV1Consultants();
      for (const c of consultants) {
        await prisma.eqoreConsultantProfile.upsert({
          where: { slug: c.slug },
          update: { ...c },
          create: { ...c }
        });

        await this.upsertNode('CONSULTANT', c.slug, c.name, c.bio || c.title || '', {
          title: c.title,
          expertiseTags: c.expertiseTags
        });
        nodeCount++;

        // LED_BY edges: Consultant → Department
        if (c.departmentSlugs) {
          for (const deptSlug of c.departmentSlugs as string[]) {
            const edgeResult = await this.upsertEdge(
              'DEPARTMENT', deptSlug,
              'CONSULTANT', c.slug,
              'LED_BY',
              0.8, 85,
              `${c.name} leads opportunities in ${deptSlug}`
            );
            if (edgeResult) edgeCount++;
          }
        }
      }

      // 8. Seed Case Studies
      const caseStudies = this.getV1CaseStudies();
      for (const cs of caseStudies) {
        // Find industry ID
        let industryId: string | null = null;
        if (cs.industrySlug) {
          const industry = await prisma.eqoreIndustry.findUnique({ where: { slug: cs.industrySlug } });
          industryId = industry?.id || null;
        }

        await prisma.eqoreCaseStudy.upsert({
          where: { slug: cs.slug },
          update: {
            title: cs.title,
            description: cs.description,
            departmentSlug: cs.departmentSlug,
            servicesSlugs: cs.servicesSlugs,
            outcomeMetrics: cs.outcomeMetrics,
            proofStatus: 'SEED_EXAMPLE',
            clientName: cs.clientName,
            isAnonymized: cs.isAnonymized,
            industryId
          },
          create: {
            slug: cs.slug,
            title: cs.title,
            description: cs.description,
            departmentSlug: cs.departmentSlug,
            servicesSlugs: cs.servicesSlugs,
            outcomeMetrics: cs.outcomeMetrics,
            proofStatus: 'SEED_EXAMPLE',
            clientName: cs.clientName,
            isAnonymized: cs.isAnonymized,
            industryId
          }
        });

        // Graph node for case study
        await this.upsertNode('CASE_STUDY', cs.slug, cs.title, cs.description);
        nodeCount++;

        // PROVEN_IN → Industry
        if (cs.industrySlug) {
          const edgeResult = await this.upsertEdge(
            'CASE_STUDY', cs.slug,
            'INDUSTRY', cs.industrySlug,
            'PROVEN_IN', 0.9, 90,
            `Case study proven in ${cs.industrySlug}`
          );
          if (edgeResult) edgeCount++;
        }

        // RECOMMENDED_FOR → Service
        if (cs.servicesSlugs) {
          for (const svcSlug of cs.servicesSlugs) {
            const edgeResult = await this.upsertEdge(
              'CASE_STUDY', cs.slug,
              'SERVICE', svcSlug,
              'RECOMMENDED_FOR', 0.85, 85,
              `Case study relevant to ${svcSlug}`
            );
            if (edgeResult) edgeCount++;
          }
        }
      }

      logger.info(`Graph seed completed: ${nodeCount} nodes, ${edgeCount} edges (version: ${SEED_VERSION})`);
      return { nodes: nodeCount, edges: edgeCount };

    } catch (error) {
      logger.error('GraphSeedService.seedAll failed:', error);
      throw error;
    }
  }

  // --- Helpers ---

  private static async upsertNode(
    type: string, slug: string, label: string,
    description?: string, metadata?: any
  ) {
    await prisma.eqoreGraphNode.upsert({
      where: { type_slug: { type, slug } },
      update: { label, description, metadata, version: SEED_VERSION, isActive: true },
      create: { type, slug, label, description, metadata, version: SEED_VERSION, isActive: true }
    });
  }

  private static async upsertEdge(
    fromType: string, fromSlug: string,
    toType: string, toSlug: string,
    edgeType: string, weight: number, confidence: number, reason: string
  ): Promise<boolean> {
    try {
      const fromNode = await prisma.eqoreGraphNode.findUnique({
        where: { type_slug: { type: fromType, slug: fromSlug } }
      });
      const toNode = await prisma.eqoreGraphNode.findUnique({
        where: { type_slug: { type: toType, slug: toSlug } }
      });

      if (!fromNode || !toNode) return false;

      await prisma.eqoreGraphEdge.upsert({
        where: {
          fromNodeId_toNodeId_type: {
            fromNodeId: fromNode.id,
            toNodeId: toNode.id,
            type: edgeType
          }
        },
        update: { weight, confidence, reason, version: SEED_VERSION, isActive: true },
        create: {
          fromNodeId: fromNode.id,
          toNodeId: toNode.id,
          type: edgeType,
          weight, confidence, reason,
          version: SEED_VERSION, isActive: true
        }
      });
      return true;
    } catch (err) {
      // Silently skip edge if nodes don't exist yet
      return false;
    }
  }

  private static slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  private static humanize(slug: string): string {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  private static getV1Consultants() {
    return [
      {
        slug: 'ai-solutions-consultant',
        name: 'AI Solutions Consultant',
        title: 'Principal AI & Cognitive Solutions Architect',
        bio: 'Specializes in enterprise AI strategy, agentic AI deployment, and GenAI implementation.',
        departmentSlugs: ['ai-cognitive-solutions'],
        serviceSlugs: ['agentic-ai', 'genai-business-services', 'ai-cognitive-computing', 'mlops'],
        expertiseTags: ['LLM', 'Agentic AI', 'Computer Vision', 'NLP', 'MLOps'],
        industryExperience: ['technology-saas', 'financial-services', 'healthcare-life-sciences'],
        priorityLevel: 'principal'
      },
      {
        slug: 'cloud-architect',
        name: 'Cloud Architect',
        title: 'Senior Cloud & Infrastructure Architect',
        bio: 'Expert in AWS, multi-cloud migration, and cloud-native architecture design.',
        departmentSlugs: ['cloud-engineering', 'infrastructure-networks-operations'],
        serviceSlugs: ['aws', 'managed-cloud-services', 'cloud-computing'],
        expertiseTags: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Cost Optimization'],
        industryExperience: ['technology-saas', 'financial-services', 'manufacturing'],
        priorityLevel: 'senior'
      },
      {
        slug: 'enterprise-apps-lead',
        name: 'Enterprise Applications Lead',
        title: 'Enterprise Platform Integration Specialist',
        bio: 'Deep expertise in ServiceNow, Salesforce, and Pimcore enterprise platform implementations.',
        departmentSlugs: ['enterprise-applications'],
        serviceSlugs: ['servicenow', 'salesforce', 'enterprise-integration-platform', 'pimcore'],
        expertiseTags: ['ServiceNow', 'Salesforce', 'ITSM', 'CRM', 'Platform Integration'],
        industryExperience: ['financial-services', 'manufacturing', 'professional-services'],
        priorityLevel: 'senior'
      },
      {
        slug: 'cybersecurity-advisor',
        name: 'Cybersecurity Advisor',
        title: 'Chief Information Security Consultant',
        bio: 'Comprehensive cybersecurity advisory covering threat assessment, compliance, and managed SOC services.',
        departmentSlugs: ['cybersecurity'],
        serviceSlugs: ['it-security-services'],
        expertiseTags: ['SOC2', 'GDPR', 'HIPAA', 'Penetration Testing', 'Managed SOC', 'Zero Trust'],
        industryExperience: ['financial-services', 'healthcare-life-sciences', 'public-sector-government'],
        priorityLevel: 'principal'
      },
      {
        slug: 'growth-strategy-consultant',
        name: 'Growth Strategy Consultant',
        title: 'Digital Marketing & Conversion Strategist',
        bio: 'Drives growth through SEO, performance marketing, and conversion rate optimization.',
        departmentSlugs: ['digital-marketing', 'conversion-engineering'],
        serviceSlugs: ['seo-organic-growth-strategy', 'performance-marketing', 'growth-funnels-conversion-engineering'],
        expertiseTags: ['SEO', 'CRO', 'Funnel Design', 'Marketing AI', 'Content Strategy'],
        industryExperience: ['technology-saas', 'retail-consumer', 'education-edtech'],
        priorityLevel: 'senior'
      },
      {
        slug: 'digital-transformation-lead',
        name: 'Digital Transformation Lead',
        title: 'Principal Digital Transformation Consultant',
        bio: 'Leads large-scale modernization programs spanning legacy systems, processes, and culture.',
        departmentSlugs: ['digital-transformation-modernization', 'consulting-advisory'],
        serviceSlugs: ['digital-transformation', 'legacy-modernization', 'application-modernization', 'technology-consulting'],
        expertiseTags: ['DX Strategy', 'Legacy Modernization', 'Change Management', 'Enterprise Architecture'],
        industryExperience: ['financial-services', 'manufacturing', 'public-sector-government'],
        priorityLevel: 'principal'
      }
    ];
  }

  private static getV1CaseStudies() {
    return [
      {
        slug: 'fortune-500-bank-itsm-overhaul',
        title: 'Fortune 500 Bank ITSM Modernization',
        description: 'Complete ServiceNow-powered ITSM transformation for a major financial institution, reducing ticket resolution time by 60%.',
        industrySlug: 'financial-services',
        departmentSlug: 'enterprise-applications',
        servicesSlugs: ['servicenow', 'enterprise-integration-platform'],
        outcomeMetrics: [
          { metric: 'Ticket Resolution Time', value: '-60%' },
          { metric: 'ITSM Automation Rate', value: '78%' },
          { metric: 'Annual Cost Savings', value: '$1.2M' }
        ],
        clientName: 'Major US Bank',
        isAnonymized: true
      },
      {
        slug: 'saas-platform-aws-migration',
        title: 'SaaS Platform Cloud Migration',
        description: 'Migrated a high-growth SaaS platform from on-premise to AWS, achieving 99.99% uptime and 40% cost reduction.',
        industrySlug: 'technology-saas',
        departmentSlug: 'cloud-engineering',
        servicesSlugs: ['aws', 'managed-cloud-services', 'cloud-computing'],
        outcomeMetrics: [
          { metric: 'Uptime', value: '99.99%' },
          { metric: 'Infrastructure Cost', value: '-40%' },
          { metric: 'Deployment Frequency', value: '+300%' }
        ],
        clientName: 'Series B SaaS Company',
        isAnonymized: true
      },
      {
        slug: 'healthcare-ai-diagnostics',
        title: 'AI-Powered Diagnostic Assistance',
        description: 'Developed a GenAI-powered diagnostic assistance tool for a healthcare network, improving diagnostic accuracy by 23%.',
        industrySlug: 'healthcare-life-sciences',
        departmentSlug: 'ai-cognitive-solutions',
        servicesSlugs: ['agentic-ai', 'genai-business-services'],
        outcomeMetrics: [
          { metric: 'Diagnostic Accuracy', value: '+23%' },
          { metric: 'Clinician Efficiency', value: '+35%' },
          { metric: 'Patient Wait Time', value: '-45%' }
        ],
        clientName: 'Regional Healthcare Network',
        isAnonymized: true
      },
      {
        slug: 'retail-conversion-optimization',
        title: 'E-Commerce Conversion Engineering',
        description: 'Full-funnel conversion optimization for a D2C brand, achieving 2.8x revenue growth in 6 months.',
        industrySlug: 'retail-consumer',
        departmentSlug: 'conversion-engineering',
        servicesSlugs: ['growth-funnels-conversion-engineering', 'seo-organic-growth-strategy'],
        outcomeMetrics: [
          { metric: 'Revenue Growth', value: '2.8x' },
          { metric: 'Conversion Rate', value: '+180%' },
          { metric: 'Customer Acquisition Cost', value: '-35%' }
        ],
        clientName: 'D2C Fashion Brand',
        isAnonymized: true
      },
      {
        slug: 'manufacturing-iot-predictive',
        title: 'Smart Factory IoT Deployment',
        description: 'Deployed IoT sensors and predictive maintenance AI across 3 manufacturing plants, reducing downtime by 52%.',
        industrySlug: 'manufacturing',
        departmentSlug: 'emerging-technologies',
        servicesSlugs: ['internet-of-things'],
        outcomeMetrics: [
          { metric: 'Equipment Downtime', value: '-52%' },
          { metric: 'Maintenance Cost', value: '-38%' },
          { metric: 'Production Output', value: '+15%' }
        ],
        clientName: 'Industrial Manufacturer',
        isAnonymized: true
      },
      {
        slug: 'fintech-cybersecurity-audit',
        title: 'Fintech Security Hardening Program',
        description: 'Comprehensive security audit and SOC2 compliance program for a fintech startup preparing for enterprise sales.',
        industrySlug: 'financial-services',
        departmentSlug: 'cybersecurity',
        servicesSlugs: ['it-security-services'],
        outcomeMetrics: [
          { metric: 'SOC2 Compliance', value: 'Achieved' },
          { metric: 'Vulnerabilities Resolved', value: '147' },
          { metric: 'Time to Enterprise Readiness', value: '4 months' }
        ],
        clientName: 'Series A Fintech',
        isAnonymized: true
      }
    ];
  }
}
