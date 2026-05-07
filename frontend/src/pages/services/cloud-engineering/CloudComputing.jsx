import React from 'react';
import { Cloud, Zap, Search, Layers, ShieldCheck, Activity, TrendingUp, Server, Database, RefreshCw } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const CloudComputing = () => {

  const service = {
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    shortDescription: 'Kangqore enables organizations to build secure, scalable, and future-ready cloud ecosystems — optimized for performance, governance, and business acceleration.',
    description: (
      <div>
        <p className="mb-4">
          At Kangqore, cloud computing is more than infrastructure provisioning. It is about elastic scalability, performance engineering, intelligent cost governance, secure-by-design architecture, and automation-driven operations.
        </p>
        <p>
          From strategy to architecture, migration to modernization — we transform cloud from infrastructure into competitive advantage. Cloud is your operating backbone. We make it resilient.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    stats: [
      { value: 'HA', label: 'High Availability', color: 'text-cyan-400' },
      { value: 'Zero', label: 'Trust Security', color: 'text-blue-400' },
      { value: '30–60%', label: 'Cost Optimization', color: 'text-emerald-400' },
      { value: 'AI-Ready', label: 'Architecture', color: 'text-purple-400' },
    ],
    primaryButton: { text: 'Talk to Our Cloud Architects', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    highFidelity: {
      narrative: {
        badge: 'Cloud Engineering :: 2026',
        titleLine1: 'Cloud Is Not Hosting.',
        titleHighlight: "It's Architecture.",
        titleLine2: 'We Engineer the Difference.',
        description: 'We build cloud systems that are high availability by default, zero-trust secure, DevOps-integrated, AI-ready, and enterprise governed. Most providers migrate infrastructure. Kangqore engineers digital platforms built to scale with your ambition.',
        bottleneckLabel: 'The Reality',
        bottleneckText: 'Unstructured cloud adoption leads to fragmentation, cost overruns, security exposure, and slowed engineering velocity.',
        requirementLabel: 'The Standard',
        requirementText: 'Cloud ecosystems engineered for performance, governance, resilience, and global scale — from day one.',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80',
        statusLabel: 'Architecture',
        statusValue: 'Resilient'
      },
      philosophy: {
        icon: <Cloud className="w-7 h-7 text-brand-blue" />,
        title: 'Engineers at Heart.',
        titleHighlight: 'Architects by Discipline.',
        description: 'Kangqore differentiates through a cloud-first architecture mindset, DevOps-native approach, governance-focused execution, security integrated from day one, performance-led optimization, and enterprise accountability. We don\'t just deploy cloud. We engineer cloud ecosystems.',
        pills: ['Cloud-First', 'DevOps-Native', 'Governance-Focused', 'Performance-Led']
      },
      matrix: {
        engineId: 'Engine :: CloudCore_V5',
        title: 'How We Engineer Cloud Differently',
        subtext: 'Five structured phases — Assess, Architect, Build, Optimize, Scale — that govern every cloud engineering engagement.',
        layers: [
          { title: 'Assess', id: 'CC_ASSESS', icon: <Search />, desc: 'Audit architecture, workloads, and operational maturity.' },
          { title: 'Architect', id: 'CC_ARC', icon: <Layers />, desc: 'Design a resilient, secure, performance-optimized blueprint.' },
          { title: 'Build', id: 'CC_BUILD', icon: <Server />, desc: 'Deploy with Infrastructure-as-Code and automation-first principles.' },
          { title: 'Optimize & Scale', id: 'CC_OPT', icon: <TrendingUp />, desc: 'Continuously monitor, improve, evolve, and enable long-term growth without architectural rework.' }
        ]
      },
      schematic: {
        titleLine1: 'Build Cloud Infrastructure',
        titleHighlight: 'That Thinks Ahead.',
        description: 'Future-ready architecture. Resilient systems. Engineered scale. Cloud Computing with Kangqore delivers 30–60% infrastructure cost optimization, improved deployment velocity, higher system uptime, and stronger security posture.',
        stats: [
          { label: 'Cost Reduction', val: '30–60%' },
          { label: 'Uptime', val: 'SLO-DRIVEN' },
          { label: 'Incidents', val: 'REDUCED' }
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
      title: 'Cloud Strategy & Roadmap',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Define a structured cloud vision aligned to business outcomes. Outcome: Clear direction. No blind migration.',
      items: [
        { heading: 'Cloud Maturity Assessment', description: 'Evaluate your current cloud posture and readiness across infrastructure, governance, and operations.' },
        { heading: 'Phased Transformation Roadmap', description: 'Design a sequenced, risk-managed transformation roadmap aligned to business cycles and priorities.' },
        { heading: 'Architecture Transition Planning', description: 'Define the technical migration path from current-state to target-state architecture.' },
        { heading: 'Governance Blueprint', description: 'Establish clear governance frameworks and policy baselines before execution begins.' },
        { heading: 'Risk Modeling', description: 'Comprehensive risk modeling and mitigation planning for the cloud transformation journey.' }
      ]
    },
    {
      title: 'Cloud Migration',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Secure, controlled movement from legacy to cloud. Outcome: Smooth transition with operational continuity.',
      items: [
        { heading: 'Application & Workload Assessment', description: 'Comprehensive discovery of applications, workloads, and system dependencies prior to migration.' },
        { heading: 'Dependency Mapping', description: 'Detailed mapping of interconnection between systems to ensure migration sequence integrity.' },
        { heading: 'Data Migration Strategy', description: 'Structured data replication, synchronization, and integrity validation across all migrated environments.' },
        { heading: 'Zero-Downtime Cutover Planning', description: 'Phased cutover strategies with rollback safeguards that preserve user experience during transition.' },
        { heading: 'Phased Transformation', description: 'Strategic migration in controlled waves to minimize business impact and maximize continuity.' }
      ]
    },
    {
      title: 'Cloud Modernization',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Re-engineer legacy systems into cloud-native architectures. Outcome: Faster systems. Scalable architecture.',
      items: [
        { heading: 'Monolith-to-Microservices Transformation', description: 'Decompose legacy monoliths into independently deployable, scalable microservices.' },
        { heading: 'Containerization', description: 'Containerize workloads for portability and operational resilience.' },
        { heading: 'API-First Redesign', description: 'Redesign systems around API-first principles for decoupled, integration-ready architectures.' },
        { heading: 'Serverless Adoption', description: 'Adopt serverless patterns for elastic, cost-efficient execution.' },
        { heading: 'Performance Refactoring', description: 'Architectural refactoring to improve performance, throughput, and scalability.' }
      ]
    },
    {
      title: 'Cloud Application Development',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Build applications designed specifically for cloud elasticity. Outcome: Applications that auto-scale and self-recover.',
      items: [
        { heading: 'Cloud-Native Engineering', description: 'Purpose-built applications leveraging managed services, auto-scaling, and cloud-native runtimes.' },
        { heading: 'Distributed System Architecture', description: 'Design distributed systems with fault tolerance, consistency, and global availability.' },
        { heading: 'Event-Driven Services', description: 'Real-time event streaming architectures for reactive, data-driven application behavior.' },
        { heading: 'Resilient Backend Systems', description: 'Backend architectures designed for self-healing and instant recovery from failures.' }
      ]
    },
    {
      title: 'Cloud-Based Application Monitoring',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Full visibility into system health. Outcome: Proactive issue resolution, reduced downtime.',
      items: [
        { heading: 'Real-Time Observability', description: 'Unified observability dashboards covering performance, latency, throughput, and error rates.' },
        { heading: 'Metrics & Log Aggregation', description: 'Centralized log aggregation with pattern recognition and search capabilities.' },
        { heading: 'Alert Automation', description: 'Automated alerting workflows that trigger remediation before users are impacted.' },
        { heading: 'Incident Diagnostics', description: 'Deep diagnostics and root cause analysis tools for rapid troubleshooting.' },
        { heading: 'Reliability Engineering', description: 'SRE disciplines that focus on continuous reliability and uptime improvements.' }
      ]
    },
    {
      title: 'Cloud Cost Optimization',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Cloud cost is architectural — we optimize both. Outcome: Controlled spend. Predictable budgets.',
      items: [
        { heading: 'Resource Right-Sizing', description: 'Eliminate over-provisioning through systematic rightsizing analysis across all compute.' },
        { heading: 'Usage Analytics', description: 'Detailed analysis of usage patterns to identify optimization opportunities.' },
        { heading: 'Idle Workload Elimination', description: 'Identify and decommission orphaned, idle, and underutilized cloud resources automatically.' },
        { heading: 'Budget Governance Models', description: 'FinOps governance frameworks with real-time spend dashboards and alerting.' },
        { heading: 'Performance-to-Cost Balance', description: 'Balancing architecture performance with financial efficiency to maximize value.' }
      ]
    },
    {
      title: 'Disaster Recovery Services',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Business continuity engineered into infrastructure. Outcome: Operational resilience under disruption.',
      items: [
        { heading: 'Backup Automation', description: 'Policy-driven automated backup schedules with geo-redundant replication.' },
        { heading: 'Geo-Redundancy', description: 'Multi-region data replication and redundancy for maximum resilience.' },
        { heading: 'Failover Architecture', description: 'Automated failover systems that activate without manual intervention during disasters.' },
        { heading: 'Recovery Time Optimization', description: 'Strategies to minimize recovery time (RTO) and data loss (RPO).' },
        { heading: 'Simulation Testing', description: 'Regular recovery drills and simulation testing to validate DR readiness.' }
      ]
    },
    {
      title: 'Managed Cloud Services',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'End-to-end lifecycle management of cloud environments. Outcome: Reduced operational overhead.',
      items: [
        { heading: 'Infrastructure Management', description: '24/7 infrastructure management covering compute, storage, and networking.' },
        { heading: 'Performance Monitoring', description: 'Continuous performance tracking and reporting for entire cloud environments.' },
        { heading: 'Patch & Update Control', description: 'Automated patch management and version control for cloud resources.' },
        { heading: 'Continuous Optimization', description: 'Ongoing rightsizing and architecture review to compound cloud efficiency.' },
        { heading: '24/7 Support', description: 'Dedicated support coverage for operational stability and incident resolution.' }
      ]
    },
    {
      title: 'Support & Maintenance',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Sustained performance and availability. Outcome: Stable and evolving cloud environment.',
      items: [
        { heading: 'System Health Audits', description: 'Periodic audits of infrastructure health and configuration drift.' },
        { heading: 'Performance Troubleshooting', description: 'Diagnostics and resolution of performance bottlenecks and system issues.' },
        { heading: 'Infrastructure Tuning', description: 'Ongoing tuning of cloud resources to match evolving workload demands.' },
        { heading: 'Ongoing Optimization', description: 'Continuous updates to the environment to leverage new cloud capabilities.' },
        { heading: 'Security Patching', description: 'Structured security patching cycles to maintain a secure cloud surface.' }
      ]
    },
    {
      title: 'Cloud Infrastructure Management',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Centralized orchestration of cloud resources. Outcome: Reliable, scalable infrastructure backbone.',
      items: [
        { heading: 'Compute & Storage Provisioning', description: 'Automated provisioning of compute, storage, and database resources.' },
        { heading: 'Network Configuration', description: 'Governed network architecture including VPC design and connectivity.' },
        { heading: 'Scalability Planning', description: 'Capacity planning for traffic growth without manual intervention.' },
        { heading: 'Security Updates', description: 'Automated rollout of security updates across the infrastructure.' },
        { heading: 'Monitoring Automation', description: 'Infrastructure monitoring with self-healing and automated remediation.' }
      ]
    },
    {
      title: 'Cloud Analytics',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Turn cloud data into strategic insight. Outcome: Data-driven decisions at scale.',
      items: [
        { heading: 'Real-Time Analytics Pipelines', description: 'Build streaming analytics pipelines that deliver insights at velocity.' },
        { heading: 'Data Lake Architecture', description: 'Design governed, scalable data lake architectures for unified storage.' },
        { heading: 'Business Intelligence Dashboards', description: 'Deploy BI dashboards for real-time decision intelligence.' },
        { heading: 'Predictive Modeling Frameworks', description: 'Predictive analytics frameworks aligned to enterprise business goals.' },
        { heading: 'Performance Analytics', description: 'Detailed analytics on system and process performance.' }
      ]
    }
  ];


  const technologies = [
    { category: 'Cloud Platforms', items: ['Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform (GCP)', 'Multi-Cloud & Hybrid Architectures'] },
    { category: 'Containers & Orchestration', items: ['Docker', 'Kubernetes (EKS / AKS / GKE)', 'Helm', 'Istio Service Mesh', 'Serverless Frameworks'] },
    { category: 'Infrastructure as Code', items: ['Terraform', 'AWS CloudFormation', 'Azure Bicep', 'Ansible', 'Pulumi'] },
    { category: 'Monitoring & Observability', items: ['Datadog', 'Prometheus', 'Grafana', 'New Relic', 'CloudWatch', 'Azure Monitor'] },
    { category: 'Security & Compliance', items: ['Zero-Trust Architecture', 'IAM Governance', 'SIEM Stacks', 'Vault (HashiCorp)', 'Prisma Cloud', 'CrowdStrike'] },
    { category: 'Networking & Delivery', items: ['Cloud CDN', 'Load Balancers', 'API Gateways', 'VPC Design', 'DNS Management', 'Private Connectivity'] }
  ];

  const customFAQs = [
    {
      question: 'Is cloud migration risky?',
      answer: 'Not with phased execution, rollback strategies, and environment simulation. We map all dependencies before migration begins and execute in controlled phases that preserve data integrity and user experience.'
    },
    {
      question: 'How do you control cloud cost?',
      answer: 'Cloud cost is architecture-driven, not just a billing problem. We implement architecture-level optimization — rightsizing, reserved capacity strategies, idle resource elimination — combined with automated FinOps governance and real-time spend dashboards.'
    },
    {
      question: 'Can we modernize gradually without a full cutover?',
      answer: 'Yes. We implement phased modernization aligned with business cycles. Applications can be migrated incrementally — starting with rehosting for speed, then refactoring for long-term structural improvement.'
    },
    {
      question: 'How secure is your cloud architecture?',
      answer: 'Security is engineered within — not layered on top. Every architecture includes zero-trust segmentation, IAM governance, encryption at rest and in transit, continuous threat monitoring, and automated compliance enforcement.'
    },
    {
      question: 'Who is cloud computing best suited for at Kangqore?',
      answer: 'Enterprises modernizing legacy infrastructure, high-growth startups scaling rapidly, SaaS platforms needing elastic performance, product companies moving to microservices, and organizations pursuing a cloud-first digital strategy.'
    }
  ];

  const whyKangqoreIntro = `Cloud Computing is no longer optional — it is the backbone of modern enterprises. Kangqore builds cloud ecosystems that are engineered for performance, designed for resilience, optimized for cost, and ready for global scale.`;

  const whyKangqore = [
    { title: 'Cloud-First Architecture Mindset', description: 'Every engagement starts with architecture — not tool selection. We design cloud systems that scale structurally.' },
    { title: 'DevOps-Native Approach', description: 'Infrastructure-as-Code, CI/CD automation, and SRE discipline embedded into every cloud delivery.' },
    { title: 'Governance-Focused Execution', description: 'Policy-driven cloud governance that provides cost visibility, access control, and compliance assurance.' },
    { title: 'Security Integrated from Day One', description: 'Zero-trust, encrypted, monitored, and compliance-aligned — security is never retrofitted after deployment.' },
    { title: 'Performance-Led Optimization', description: 'Continuous monitoring and optimization ensure cloud performance compounds — not degrades — over time.' },
    { title: 'Enterprise Accountability', description: 'SLO commitments, observability dashboards, and structured reporting keep cloud operations transparent and accountable.' }
  ];

  const industryIntro = `Cloud computing underpins every sector's digital operations. Kangqore tailors cloud architecture and delivery to the specific performance, compliance, and scalability requirements of each industry.`;

  const industries = [
    { name: 'Healthcare', description: 'Secure patient systems, compliance-ready infrastructure, and telehealth scalability without compromising data governance.' },
    { name: 'Banking & Finance', description: 'Low-latency systems, encrypted environments, and risk-managed cloud governance for regulated financial operations.' },
    { name: 'Retail & eCommerce', description: 'Elastic scaling for peak traffic events, intelligent load balancing, and real-time inventory data pipelines.' },
    { name: 'SaaS & Technology', description: 'Cloud-native product architecture purpose-built for rapid growth, multi-tenancy, and developer velocity.' },
    { name: 'Manufacturing', description: 'IoT data integration, predictive operations platforms, and resilient infrastructure for industry environments.' },
    { name: 'Energy & Utilities', description: 'Secure cloud environments for grid data, operational analytics, and sustainability reporting platforms.' }
  ];

  const additionalInfo = {
    overview: `Cloud Computing with Kangqore delivers measurable outcomes: 30–60% infrastructure cost optimization (depending on baseline), improved deployment velocity, higher system uptime, reduced incident frequency, faster product releases, and a stronger security posture. We align infrastructure performance with business performance — building once, scaling infinitely.`,
    benefits: [
      '30–60% infrastructure cost optimization depending on baseline',
      'Improved deployment velocity and faster product releases',
      'Higher system uptime with SLO-driven reliability engineering',
      'Stronger security posture with zero-trust, encrypted architecture'
    ],
    useCases: [
      'Cloud Architecture & Landing Zone Design',
      'Legacy Infrastructure Migration (Rehost / Replatform / Refactor)',
      'Cloud-Native Application Engineering',
      'FinOps Cost Optimization Programs',
      'Multi-Cloud Governance & Operations',
      'Disaster Recovery & Business Continuity'
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

export default CloudComputing;
