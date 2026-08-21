import React from 'react';
import { Cloud, Zap, Search, Layers, ShieldCheck, Activity, TrendingUp, Server, RefreshCw, Database } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const ManagedCloudServices = () => {

  const service = {
    name: 'Managed Cloud Services',
    slug: 'managed-cloud-services',
    shortDescription: 'Modern cloud environments are powerful — but without operational discipline, cost control, and security governance, they become fragile and expensive. Kangqore delivers engineered cloud operations built on SRE, FinOps, and SecOps principles.',
    description: (
      <div>
        <p className="mb-4">
          Cloud adoption has accelerated — but complexity has multiplied. Multi-cloud environments, serverless architectures, distributed microservices, compliance mandates, and escalating costs mean that migrating to the cloud is not the destination.
        </p>
        <p>
          Running it reliably is. Kangqore transforms cloud from an infrastructure expense into a performance engine.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    stats: [
      { value: '24/7', label: 'Operational Monitoring', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
      { value: 'SRE', label: 'Grade Reliability', color: 'text-blue-400' },
      { value: 'FinOps', label: 'Cost Governance', color: 'text-emerald-400' },
      { value: 'Zero', label: 'Trust Security', color: 'text-purple-400' },
    ],
    primaryButton: { text: 'Request a Cloud Assessment', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    highFidelity: {
      narrative: {
        badge: 'Cloud Operations :: 2026',
        titleLine1: 'Run. Optimize.',
        titleHighlight: 'Secure & Scale.',
        titleLine2: 'Always On.',
        description: 'Without structured cloud operations, costs spiral unpredictably, security posture weakens, downtime risk increases, and engineering velocity slows. Kangqore delivers 24/7 reliability, measurable cost governance, continuous compliance, and proactive optimization.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Uncontrolled cloud sprawl leads to spiraling costs, security gaps, and operational fragility.',
        requirementLabel: 'The Requirement',
        requirementText: 'SRE, FinOps, and SecOps principles working in unison for resilient, optimized cloud operations.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
        statusLabel: 'Operations',
        statusValue: 'Always-On'
      },
      philosophy: {
        icon: <Cloud className="w-7 h-7 text-brand-blue" />,
        title: 'Operational Excellence.',
        titleHighlight: 'Six Measurable Outcomes.',
        description: 'Our Managed Cloud Services are structured around six outcomes: Enhanced Business Scalability, Improved Security & Compliance, Full Visibility & Observability, High Availability & Reliability, Cost-Efficient Engagement Models, and Dynamic & Robust Infrastructure.',
        pills: ['SRE-Driven', 'FinOps-Governed', 'SecOps-Embedded', 'Always-On']
      },
      matrix: {
        engineId: 'Engine :: CloudOps_V4',
        title: 'Cloud Operations Matrix',
        subtext: 'Four operational pillars — Adopt, Run, Optimize, Secure — that govern every managed cloud engagement.',
        layers: [
          { title: 'Adopt', id: 'COP_ADOPT', icon: <Search />, desc: 'Cloud readiness, landing zone setup, governance baselines, and secure multi-cloud design.' },
          { title: 'Run', id: 'COP_RUN', icon: <Activity />, desc: '24/7 monitoring, SLA/SLO management, backup & DR, and infrastructure automation.' },
          { title: 'Optimize', id: 'COP_OPT', icon: <TrendingUp />, desc: 'FinOps cost optimization, performance tuning, rightsizing, and usage analytics.' },
          { title: 'Secure', id: 'COP_SEC', icon: <ShieldCheck />, desc: 'Security hardening, IAM governance, compliance audits, and vulnerability management.' }
        ]
      },
      schematic: {
        titleLine1: 'Cloud as a',
        titleHighlight: 'Performance Engine.',
        description: 'When SRE discipline, FinOps governance, and SecOps rigor operate as an integrated system — cloud becomes a strategic competitive advantage, not an infrastructure liability.',
        stats: [
          { label: 'Reliability', val: 'SLO-DRIVEN' },
          { label: 'Cost Control', val: 'FINOPS' },
          { label: 'Security', val: 'ZERO-TRUST' }
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
      title: 'Cloud Consulting',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Cloud transformation without architectural clarity leads to cost overruns and instability. Kangqore\'s Cloud Consulting establishes a structured foundation before execution begins.',
      items: [
        { heading: 'Cloud Maturity & Readiness Assessment', description: 'Evaluate your current cloud posture, identify gaps, and define a roadmap aligned to business goals.' },
        { heading: 'Target-State Architecture Blueprint', description: 'Design the landing zone, governance framework, and multi-cloud or hybrid architecture strategy.' },
        { heading: 'Cost Modeling & ROI Forecasting', description: 'Build financial models that justify cloud investments with clear ROI projections and cost controls.' },
        { heading: 'Migration Prioritization Roadmap', description: 'Sequence workload migrations by business priority, risk, and technical readiness.' }
      ]
    },
    {
      title: 'Cloud Migration',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Migration is not just "moving servers." It\'s business continuity engineering. Kangqore executes structured migration programs that preserve data integrity and user experience.',
      items: [
        { heading: 'Application & Dependency Mapping', description: 'Comprehensive discovery of application dependencies before any migration begins.' },
        { heading: 'Database Migration Strategies', description: 'Rehost, replatform, or refactor strategies aligned to application criticality and target architecture.' },
        { heading: 'Cutover Planning & Rollback', description: 'Cutover planning with rollback mechanisms and downtime minimization strategies.' },
        { heading: 'Post-Migration Validation', description: 'Security hardening during transition and comprehensive post-migration performance testing.' }
      ]
    },
    {
      title: 'Cloud Optimization',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Many organizations overspend 20–40% due to poor resource planning. Kangqore introduces structured FinOps discipline to convert cloud spend into strategic investment.',
      items: [
        { heading: 'Resource Rightsizing & Auto-Scaling', description: 'Eliminate over-provisioning with rightsizing analysis and auto-scaling tuning.' },
        { heading: 'Cost Anomaly Detection', description: 'Proactive detection of cost anomalies before they escalate into budget overruns.' },
        { heading: 'Reserved Instance Strategy', description: 'Reserved instance and savings plan strategies that reduce committed spend by 30–60%.' },
        { heading: 'Cloud Spend Transparency Dashboards', description: 'Real-time dashboards that give engineering and finance teams full visibility into cloud expenditure.' }
      ]
    },
    {
      title: 'Cloud Modernization',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Legacy applications slow innovation. We modernize them into resilient, cloud-native systems architected for the next decade.',
      items: [
        { heading: 'Monolith-to-Microservices Transformation', description: 'Decompose monolithic applications into independently deployable, scalable microservices.' },
        { heading: 'Containerization (Docker & Kubernetes)', description: 'Containerize workloads and orchestrate them via Kubernetes for portability and resilience.' },
        { heading: 'Serverless & Event-Driven Architecture', description: 'Adopt serverless and event-driven patterns for elastic, cost-efficient compute.' },
        { heading: 'Database Modernization', description: 'Migrate to managed DB services and NoSQL solutions to reduce operational overhead.' }
      ]
    },
    {
      title: 'Cloud Monitoring & Support',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Cloud environments require continuous visibility and proactive intervention. We don\'t wait for outages — we predict and prevent them.',
      items: [
        { heading: 'Centralized Observability Dashboards', description: 'Unified dashboards covering cost, performance, latency, usage, and anomaly signals.' },
        { heading: 'Application Performance Monitoring (APM)', description: 'End-to-end APM covering service-level indicators and user experience metrics.' },
        { heading: 'Log Aggregation & Anomaly Detection', description: 'Automated log aggregation with ML-assisted anomaly detection and escalation workflows.' },
        { heading: 'SLA / SLO Management', description: 'Define and enforce SLOs with automated incident response and root cause analysis workflows.' }
      ]
    },
    {
      title: 'Cloud Security & Compliance',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Security cannot be an afterthought. Kangqore integrates SecOps directly into cloud operations — from design to runtime.',
      items: [
        { heading: 'Zero-Trust Architecture', description: 'Implement zero-trust network models with identity verification at every access layer.' },
        { heading: 'IAM & RBAC Governance', description: 'Identity & access management governance with role-based access control and least-privilege enforcement.' },
        { heading: 'Continuous Vulnerability Scanning', description: 'Automated vulnerability scanning, security posture monitoring, and patch management workflows.' },
        { heading: 'Regulatory Compliance Alignment', description: 'Compliance alignment for ISO, SOC 2, GDPR, HIPAA, and audit readiness reporting.' }
      ]
    },
    {
      title: 'DevOps on Cloud',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Cloud performance accelerates when DevOps discipline is embedded. Automation-first engineering reduces deployment risk and increases release velocity.',
      items: [
        { heading: 'CI/CD Pipeline Design & Automation', description: 'Design and implement CI/CD pipelines that automate testing, building, and deployment workflows.' },
        { heading: 'Infrastructure-as-Code (IaC)', description: 'Terraform and CloudFormation implementations for consistent, version-controlled infrastructure.' },
        { heading: 'DevSecOps Integration', description: 'Embed security scanning, compliance checks, and policy enforcement into every pipeline stage.' },
        { heading: 'Release Governance & Rollback', description: 'Release governance frameworks with automated rollback strategies for zero-impact deployments.' }
      ]
    },
    {
      title: 'Backup & Disaster Recovery',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Downtime is not a technical issue — it\'s a revenue risk. Kangqore builds resilient recovery frameworks that ensure systems recover quickly, predictably, and without data loss.',
      items: [
        { heading: 'Automated Backup Policies', description: 'Automated, policy-driven backup schedules with geo-redundant replication and archival strategies.' },
        { heading: 'Disaster Recovery Architecture', description: 'DR architecture design with RPO/RTO definition aligned to business continuity requirements.' },
        { heading: 'Failover Automation', description: 'Automated failover systems that activate without manual intervention during incident scenarios.' },
        { heading: 'Recovery Drills & Simulation Testing', description: 'Regular recovery drills and simulation testing to validate DR readiness before incidents occur.' }
      ]
    }
  ];

  const technologies = [
    { category: 'Cloud Platforms', items: ['Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform (GCP)', 'Multi-cloud & Hybrid Architectures'] },
    { category: 'Monitoring & Observability', items: ['Datadog', 'New Relic', 'Prometheus', 'Grafana', 'CloudWatch', 'Azure Monitor', 'Google Cloud Operations'] },
    { category: 'DevOps & Automation', items: ['Terraform', 'Ansible', 'CloudFormation', 'GitHub Actions', 'Azure DevOps', 'Jenkins', 'ArgoCD'] },
    { category: 'Containers & Orchestration', items: ['Docker', 'Kubernetes (EKS, AKS, GKE)', 'Helm', 'Istio Service Mesh', 'Serverless Frameworks'] },
    { category: 'Security & Compliance', items: ['AWS GuardDuty', 'Azure Sentinel', 'Prisma Cloud', 'HashiCorp Vault', 'CrowdStrike', 'Qualys', 'SIEM Stacks'] },
    { category: 'FinOps & Cost Management', items: ['AWS Cost Explorer', 'Azure Cost Management', 'CloudHealth', 'Apptio Cloudability', 'Spot.io'] }
  ];

  const customFAQs = [
    {
      question: 'What is the difference between Managed Cloud Services and standard cloud support?',
      answer: 'Managed Cloud Services goes beyond reactive support — it includes proactive monitoring, FinOps cost governance, security hardening, SRE-driven reliability engineering, and continuous optimization as an ongoing operational discipline.'
    },
    {
      question: 'Do you support multi-cloud environments?',
      answer: 'Yes. We manage workloads across AWS, Azure, and GCP — including hybrid and multi-cloud architectures. Our governance frameworks are designed to provide unified visibility and control regardless of provider.'
    },
    {
      question: 'How quickly can you reduce our cloud costs?',
      answer: 'Most organizations see 15–35% cost reduction within the first 60–90 days through rightsizing, idle resource elimination, and reserved instance optimization. Long-term FinOps governance sustains and compounds these savings.'
    },
    {
      question: 'How do you handle security and compliance?',
      answer: 'Security is embedded by design — not added after deployment. We implement zero-trust architecture, continuous vulnerability scanning, IAM governance, and regulatory compliance alignment (ISO, SOC 2, GDPR, HIPAA) from day one.'
    },
    {
      question: 'What SLAs do you commit to for monitoring and incident response?',
      answer: 'We define and manage to SLOs (Service Level Objectives) agreed with your team, covering uptime, incident response times, and mean time to recovery (MTTR). All commitments are documented and tracked via observability dashboards.'
    }
  ];

  const whyKangqoreIntro = `Kangqore treats cloud operations as an engineering discipline — not a support contract. We bring SRE rigor, FinOps discipline, and SecOps integration together into a unified managed services model that delivers measurable outcomes: reliability, cost control, security, and operational velocity.`;

  const whyKangqore = [
    { title: 'SRE-Grade Reliability Engineering', description: 'SLO-driven operations with incident response discipline and uptime accountability.' },
    { title: 'FinOps Cost Governance', description: 'Structured financial operations that convert cloud spend from a variable liability into a controlled investment.' },
    { title: 'SecOps Embedded by Design', description: 'Zero-trust security, IAM governance, and compliance alignment built into cloud operations from day one.' },
    { title: 'Full-Stack Observability', description: 'End-to-end monitoring of cost, performance, latency, usage, and anomalies — not just uptime metrics.' },
    { title: 'Automation-First Operations', description: 'Infrastructure automation, IaC, and DevOps pipelines reduce toil and accelerate response times.' }
  ];

  const industryIntro = `Managed cloud operations underpin mission-critical systems across every industry. Our SRE, FinOps, and SecOps capabilities are adapted to the specific compliance, performance, and cost requirements of each sector.`;

  const industries = [
    { name: 'Banking & Financial Services', description: 'Compliance-aware cloud operations, security hardening, and zero-downtime reliability for regulated environments.' },
    { name: 'Healthcare & Life Sciences', description: 'HIPAA-aligned cloud management, clinical data governance, and secure infrastructure operations.' },
    { name: 'Retail & eCommerce', description: 'Auto-scaling for peak traffic, cost optimization, and always-on platform reliability.' },
    { name: 'Manufacturing', description: 'IoT data pipeline management, operational technology integration, and disaster recovery planning.' },
    { name: 'Technology & SaaS', description: 'Multi-cloud architecture management, DevOps automation, and FinOps optimization for SaaS platforms.' },
    { name: 'Energy & Utilities', description: 'Secure infrastructure management, compliance automation, and high-availability operations.' }
  ];

  const additionalInfo = {
    overview: `Without structured cloud operations, costs spiral unpredictably, security posture weakens over time, downtime risk increases, and engineering velocity slows. Kangqore transforms cloud from an infrastructure expense into a performance engine — delivering 24/7 operational reliability, measurable cost governance, continuous compliance, and observability across systems.`,
    benefits: [
      '24/7 operational monitoring and proactive incident prevention',
      'Measurable cloud cost reduction through FinOps governance',
      'Security and compliance embedded into every operational layer',
      'SRE-grade reliability with SLO-driven accountability'
    ],
    useCases: [
      'Cloud Cost Optimization & FinOps Governance',
      'Multi-Cloud Operations Management',
      'Disaster Recovery Architecture & Testing',
      'Zero-Trust Security Implementation',
      'DevOps Automation & CI/CD Pipeline Design',
      'Cloud Migration with Zero-Disruption Cutover'
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

export default ManagedCloudServices;
