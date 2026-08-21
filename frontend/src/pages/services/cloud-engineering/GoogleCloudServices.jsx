import React from 'react';
import { Cloud, Zap, Search, Layers, ShieldCheck, Activity, TrendingUp, Database, Brain, BarChart3 } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const GoogleCloudServices = () => {

  const service = {
    name: 'Google Cloud Services',
    slug: 'google-cloud-services',
    shortDescription: 'AI-Native Cloud Engineering. Built for Scale. Designed for Intelligence.',
    description: (
      <div>
        <p className="mb-4">
          Enterprises today are not just migrating to the cloud — they are re-architecting their future around data, AI, and global scalability. Google Cloud offers one of the most advanced AI and data platforms in the world, but unlocking its full value requires architectural precision and operational maturity.
        </p>
        <p>
          Kangqore partners with organizations to design, migrate, modernize, and optimize workloads on Google Cloud — enabling intelligent, secure, and high-performance digital ecosystems.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80',
    stats: [
      { value: 'PB', label: 'Data Processed', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
      { value: 'Zero', label: 'Data Leakage', color: 'text-blue-400' },
      { value: '100%', label: 'AI/ML Synergy', color: 'text-emerald-400' },
      { value: 'Native', label: 'BigQuery Power', color: 'text-purple-400' },
    ],
    primaryButton: { text: 'Talk to Our Cloud Engineering Team', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    highFidelity: {
      narrative: {
        badge: 'AI-Native Cloud :: 2026',
        titleLine1: 'The Modernization',
        titleHighlight: 'Mandate.',
        titleLine2: 'Structured Execution.',
        description: 'Legacy infrastructure, fragmented data pipelines, rising cloud costs, and AI experimentation without production readiness are slowing enterprise velocity. Google Cloud provides a powerful AI-first ecosystem — but unlocking its full value requires structured execution. That\'s where Kangqore operates.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Disconnected data environments, underutilized AI capabilities, and governance gaps in multi-cloud environments.',
        requirementLabel: 'The Mandate',
        requirementText: 'Architectural precision + operational maturity to unlock Google Cloud\'s full AI and data platform value.',
        image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&q=80',
        statusLabel: 'Platform',
        statusValue: 'AI-Native'
      },
      philosophy: {
        icon: <Cloud className="w-7 h-7 text-brand-blue" />,
        title: 'Kangqore + Google Cloud.',
        titleHighlight: 'Engineering Intelligence.',
        description: 'We combine deep cloud architecture expertise, an AI-first engineering mindset, enterprise modernization frameworks, and DevOps & SRE maturity to operate as Cloud Architects, AI Integrators, Platform Modernizers, and Operational Strategists.',
        pills: ['Cloud Architects', 'AI Integrators', 'Platform Modernizers', 'Operational Strategists']
      },
      matrix: {
        engineId: 'Engine :: GCP_Intelligence_V3',
        title: 'Strategic Focus Matrix',
        subtext: 'Four structured focus areas that govern every Google Cloud engagement.',
        layers: [
          { title: 'Infrastructure', id: 'GCP_INFRA', icon: <Layers />, desc: 'Rebuild legacy infrastructure into resilient, cloud-native platforms designed for elasticity and reliability.' },
          { title: 'Workplace', id: 'GCP_WORK', icon: <Activity />, desc: 'Empower collaboration and productivity through secure cloud-based ecosystems.' },
          { title: 'App Modernization', id: 'GCP_APP', icon: <Zap />, desc: 'Refactor monoliths into scalable microservices and containerized architectures for faster innovation cycles.' },
          { title: 'Data & AI', id: 'GCP_DATA', icon: <Brain />, desc: 'Create unified data platforms that power analytics, AI models, and predictive decision systems.' }
        ]
      },
      schematic: {
        titleLine1: 'Engineer Your',
        titleHighlight: 'Intelligent Cloud Future.',
        description: 'From strategic consulting to AI-native cloud ecosystems, Kangqore enables enterprises to build secure, scalable, and autonomous digital platforms that scale with ambition.',
        stats: [
          { label: 'Deployment', val: 'AI-NATIVE' },
          { label: 'Analytics', val: 'ACCELERATED' },
          { label: 'Governance', val: 'EMBEDDED' }
        ]
      }
    }
  };

  const department = {
    name: 'Cloud Engineering',
    slug: 'cloud-engineering',
    description: 'Building and scaling enterprise cloud infrastructure across Azure, AWS, and GCP.'
  };

  const capabilities = [
    {
      title: 'Infrastructure Modernization',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Rebuild legacy infrastructure into resilient, cloud-native platforms designed for elasticity, reliability, and global scale.',
      items: [
        { heading: 'Cloud Readiness Assessment', description: 'Evaluate legacy infrastructure and identify modernization pathways aligned to business goals.' },
        { heading: 'Landing Zone Architecture', description: 'Design secure, governance-ready GCP landing zones with policy baselines and network controls.' },
        { heading: 'Containerization & Kubernetes (GKE)', description: 'Containerize workloads and orchestrate via Google Kubernetes Engine for portability and resilience.' },
        { heading: 'Cloud-Native Platform Design', description: 'Architect event-driven, serverless, and microservices platforms for elastic, cost-efficient operations.' }
      ]
    },
    {
      title: 'Digital Workplace Enablement',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Empower collaboration and productivity through secure, cloud-based ecosystems that support distributed enterprise teams.',
      items: [
        { heading: 'Google Workspace Integration', description: 'Deploy and govern Google Workspace environments with identity, access, and compliance controls.' },
        { heading: 'Secure Collaboration Architecture', description: 'Design collaboration frameworks that balance productivity with data security and governance.' },
        { heading: 'Identity & Access Management', description: 'IAM governance aligned to zero-trust principles and enterprise access requirements.' },
        { heading: 'Adoption & Productivity Frameworks', description: 'Structured adoption programs that drive measurable productivity outcomes for distributed teams.' }
      ]
    },
    {
      title: 'Application Modernization',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Refactor monoliths into scalable microservices and containerized architectures for faster innovation cycles.',
      items: [
        { heading: 'Monolith Decomposition', description: 'Strategically decompose legacy monoliths into independently deployable microservices.' },
        { heading: 'API-First Architecture', description: 'Design API-first systems using Apigee and Cloud Endpoints for integration clarity.' },
        { heading: 'Serverless Adoption', description: 'Adopt Cloud Run and Cloud Functions for elastic, cost-efficient compute without infrastructure management.' },
        { heading: 'Technical Debt Reduction', description: 'Systematic technical debt reduction roadmaps that improve maintainability and deployment velocity.' }
      ]
    },
    {
      title: 'Enterprise Data Transformation',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'Create unified data platforms that power analytics, AI models, and predictive decision systems across the enterprise.',
      items: [
        { heading: 'BigQuery Data Warehouse', description: 'Design and implement enterprise-grade BigQuery data warehouses for high-performance analytics at scale.' },
        { heading: 'Data Pipeline Engineering (Dataflow)', description: 'Build scalable streaming and batch data pipelines using Cloud Dataflow and Pub/Sub.' },
        { heading: 'Data Lakehouse Architecture', description: 'Design unified data lakehouse architectures on Cloud Storage with governed access layers.' },
        { heading: 'Looker & Analytics Enablement', description: 'Deploy Looker for governed, KPI-driven business intelligence and executive reporting.' }
      ]
    },
    {
      title: 'AI & Machine Learning (Vertex AI)',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Production-ready AI deployment on Google Cloud\'s Vertex AI platform — from model development to enterprise-scale inference.',
      items: [
        { heading: 'Vertex AI Platform Setup', description: 'Configure Vertex AI environments for model training, evaluation, and production deployment.' },
        { heading: 'AI Readiness Assessment', description: 'Evaluate data maturity, infrastructure readiness, and governance frameworks for AI adoption.' },
        { heading: 'ML Pipeline Engineering', description: 'Build automated ML pipelines for training, validation, deployment, and model monitoring.' },
        { heading: 'Generative AI Integration', description: 'Integrate Google\'s generative AI capabilities (Gemini) into enterprise workflows and applications.' }
      ]
    },
    {
      title: 'Cloud Security & Compliance',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Security and compliance embedded by design across every Google Cloud deployment.',
      items: [
        { heading: 'Security Command Center', description: 'Configure Google Security Command Center for unified threat detection and compliance monitoring.' },
        { heading: 'Zero-Trust Network Architecture', description: 'Implement BeyondCorp and VPC Service Controls for zero-trust access across GCP workloads.' },
        { heading: 'Regulatory Compliance Alignment', description: 'Align GCP environments with ISO 27001, SOC 2, GDPR, and industry-specific mandates.' },
        { heading: 'Audit Readiness & Reporting', description: 'Continuous compliance monitoring with audit-ready reporting and evidence collection.' }
      ]
    },
    {
      title: 'DevOps & MLOps on GCP',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Automation-first engineering discipline embedded across cloud and AI delivery pipelines on Google Cloud.',
      items: [
        { heading: 'Cloud Build & CI/CD Pipelines', description: 'Design and automate CI/CD pipelines using Cloud Build, Artifact Registry, and Cloud Deploy.' },
        { heading: 'Infrastructure-as-Code (Terraform)', description: 'Version-controlled GCP infrastructure managed via Terraform for consistency and repeatability.' },
        { heading: 'MLOps Pipeline Automation', description: 'Automated ML lifecycle management from experiment tracking to production monitoring and retraining.' },
        { heading: 'SRE & Observability', description: 'SLO-driven reliability engineering with Cloud Monitoring, Logging, and Trace for full observability.' }
      ]
    }
  ];

  const technologies = [
    { category: 'Compute & Containers', items: ['Google Kubernetes Engine (GKE)', 'Cloud Run', 'Cloud Functions', 'Compute Engine', 'App Engine', 'Anthos'] },
    { category: 'Data & Analytics', items: ['BigQuery', 'Cloud Dataflow', 'Cloud Pub/Sub', 'Cloud Dataproc', 'Cloud Composer', 'Looker', 'Data Catalog'] },
    { category: 'AI & Machine Learning', items: ['Vertex AI', 'Gemini API', 'AutoML', 'AI Platform Pipelines', 'TensorFlow on GCP', 'Document AI', 'Dialogflow CX'] },
    { category: 'Storage & Databases', items: ['Cloud Storage', 'Cloud Spanner', 'Cloud SQL', 'Firestore', 'Bigtable', 'Memorystore', 'AlloyDB'] },
    { category: 'Security & Identity', items: ['Google Security Command Center', 'Cloud IAM', 'BeyondCorp Enterprise', 'VPC Service Controls', 'Cloud Armor', 'Chronicle SIEM'] },
    { category: 'DevOps & Networking', items: ['Cloud Build', 'Artifact Registry', 'Cloud Deploy', 'Terraform on GCP', 'Cloud CDN', 'Cloud Load Balancing', 'Cloud DNS'] }
  ];

  const customFAQs = [
    {
      question: 'Why choose Google Cloud over other cloud providers?',
      answer: 'Google Cloud offers the most advanced AI and data platform in the enterprise market — with BigQuery, Vertex AI, and Gemini providing unmatched intelligence capabilities. For organizations prioritizing data analytics, AI production deployment, and global network performance, GCP provides structural advantages.'
    },
    {
      question: 'How does Kangqore approach Google Cloud migrations?',
      answer: 'We follow a structured program: cloud readiness assessment, dependency mapping, migration sequencing, cutover planning, and post-migration validation. Every migration is designed for zero data loss, minimal downtime, and security hardening throughout the transition.'
    },
    {
      question: 'Can you help us deploy production AI on GCP?',
      answer: 'Yes. We specialize in Vertex AI platform setup, ML pipeline automation, and Gemini API integration. Our AI readiness assessments evaluate data maturity, infrastructure requirements, and governance frameworks before any production deployment begins.'
    },
    {
      question: 'Do you manage multi-cloud environments that include GCP?',
      answer: 'Yes. We design and manage multi-cloud architectures that integrate GCP with AWS and Azure. Our governance frameworks provide unified visibility and control across providers.'
    },
    {
      question: 'What business outcomes can we expect from a GCP engagement?',
      answer: 'Typical outcomes include reduced infrastructure overhead, accelerated analytics performance, faster software deployment cycles, improved cloud cost visibility, production-ready AI deployment, and enhanced compliance and governance posture.'
    }
  ];

  const whyKangqoreIntro = `Kangqore combines deep cloud architecture expertise, an AI-first engineering mindset, enterprise modernization frameworks, and DevOps & SRE maturity. We don't just deploy Google Cloud — we engineer cloud systems that evolve with your ambition.`;

  const whyKangqore = [
    { title: 'Cloud Architecture Depth', description: 'Deep GCP architectural expertise across compute, networking, data, AI, and security layers.' },
    { title: 'AI-First Engineering Mindset', description: 'Every cloud engagement is evaluated for AI and analytics enablement — not just infrastructure deployment.' },
    { title: 'Enterprise Modernization Frameworks', description: 'Structured frameworks for legacy modernization that reduce risk and accelerate transformation timelines.' },
    { title: 'DevOps & SRE Maturity', description: 'Automation-first delivery with SLO-driven reliability engineered directly into cloud operations.' },
    { title: 'Governance-Driven Execution', description: 'Security, compliance, and cost governance embedded from design through operations — never retrofitted.' }
  ];

  const industryIntro = `Google Cloud\'s AI-first ecosystem powers transformation across every industry. Kangqore tailors GCP architecture and delivery to the specific data, compliance, and intelligence requirements of each sector.`;

  const industries = [
    { name: 'Banking & Financial Services', description: 'BigQuery-powered risk analytics, compliance-aligned infrastructure, and AI-driven fraud detection.' },
    { name: 'Healthcare & Life Sciences', description: 'HIPAA-aligned GCP environments, clinical data platforms, and AI-assisted diagnostic systems.' },
    { name: 'Retail & eCommerce', description: 'Personalization AI, demand forecasting, and scalable data pipelines for customer intelligence.' },
    { name: 'Manufacturing', description: 'IoT data ingestion, predictive maintenance AI, and operational analytics on Cloud Dataflow.' },
    { name: 'Media & Technology', description: 'Content intelligence, real-time streaming analytics, and AI-powered recommendation systems.' },
    { name: 'Energy & Utilities', description: 'Smart grid data platforms, environmental analytics, and sustainability reporting on GCP.' }
  ];

  const additionalInfo = {
    overview: `Cloud transformation becomes measurable, not theoretical. Kangqore delivers reduced infrastructure overhead, accelerated analytics performance, faster software deployment cycles, improved cloud cost visibility, production-ready AI deployment, and enhanced compliance and governance posture — on Google Cloud.`,
    benefits: [
      'Reduced infrastructure overhead and cloud cost visibility',
      'Accelerated analytics performance via BigQuery and Dataflow',
      'Production-ready AI deployment on Vertex AI',
      'Enhanced compliance and governance posture across GCP'
    ],
    useCases: [
      'GCP Migration Assessment & Planning',
      'BigQuery Enterprise Data Warehouse Design',
      'Vertex AI Production Deployment',
      'Google Workspace Security & Governance',
      'Multi-Cloud Integration (GCP + AWS + Azure)',
      'GKE Containerization & Modernization'
    ]
  };

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      additionalInfo,
      customFAQs,
      whyKangqoreIntro,
      whyKangqore,
      industryIntro,
      industries
    },
    department
  };

  return (
    <ServicePageTemplate
      service={pageData.service}
      department={department}
      primaryButton={service.primaryButton}
      secondaryButton={pageData.service.secondaryButton}
    />
  );
};

export default GoogleCloudServices;
