import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import SEO from '../../../components/SEO';
import { Database, Layers, Zap, RefreshCw, Activity, Search, ShieldCheck, Cpu, LineChart, BarChart3, BrainCircuit } from 'lucide-react';

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Our data volumes are exploding — how do we scale without infrastructure costs spiraling out of control?",
      "acceptedAnswer": { "@type": "Answer", "text": "Unarchitected scale is the most expensive Big Data mistake. Kangqore designs lakehouse architectures with tiered storage, intelligent data lifecycle policies, and compute-storage separation so your infrastructure scales with actual usage patterns — not worst-case estimates. Clients typically see 40–60% reduction in per-TB storage costs within 12 months of architecture modernization." }
    },
    {
      "@type": "Question",
      "name": "How do we govern and secure petabyte-scale data without creating analytics bottlenecks?",
      "acceptedAnswer": { "@type": "Answer", "text": "Governance at scale requires automation, not manual oversight. We implement data catalogs, automated classification, role-based access controls, and column-level encryption that operate transparently within your analytics workflows. Analysts see the data they're authorized to see, instantly — without submitting access tickets or waiting for manual approvals." }
    },
    {
      "@type": "Question",
      "name": "What happens to our existing data investments if we modernize to a lakehouse architecture?",
      "acceptedAnswer": { "@type": "Answer", "text": "We design migration paths that preserve existing investments while eliminating technical debt. Our RDBMS-to-lakehouse migrations maintain full data lineage, historical continuity, and zero downtime for active reporting. We do not recommend rip-and-replace — we replace incrementally, proving value at each stage before decommissioning legacy infrastructure." }
    },
    {
      "@type": "Question",
      "name": "How long does it take to build a production-ready Big Data platform?",
      "acceptedAnswer": { "@type": "Answer", "text": "A foundational data platform — ingestion pipelines, lakehouse storage, governance layer, and first analytics workloads — can be production-ready in 8–12 weeks using our accelerated delivery framework. Enterprise-wide programs are structured in phased sprints, with each phase delivering operational capability before the next begins." }
    }
  ]
};

import {
  AIChallengesSection,
  AILogoTrustSection,
  AIArchitectureDiagram,
  UseCasesMagnificationList,
  AIAcceleratorRoadmap,
  AIMetricsSection,
  AITransformationMagnet
} from '../../../components/services/cognition/AICustomSections';

const BigData = () => {
  const service = {
    name: 'Big Data Engineering.',
    titleLine1: 'Big Data Platforms',
    titleHighlight: 'Built for Intelligence.',
    slug: 'big-data',
    shortDescription: 'Design, modernize, and operationalize enterprise-grade data ecosystems — from lakehouses and stream processing to governed migrations — that enable real-time intelligence and AI-driven growth at scale.',
    description: 'Design, modernize, and operationalize enterprise-grade data ecosystems — from lakehouses and stream processing to governed migrations — that enable real-time intelligence and AI-driven growth at scale.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    videoBackground: '/videos/business-meeting-6774639.mp4',

    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

    hideGenericMidPageCta: true,
    hideGenericFaq: false,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Analytics & Insights', link: '/department/analytics-insights' },
      { label: 'Big Data' }
    ],

    stats: [
      { value: '40%', label: 'Storage Cost Reduction', color: 'text-brand-blue' },
      { value: '10x', label: 'Query Performance', color: 'text-cyan-400' },
      { value: 'Real-time', label: 'Data Ingestion', color: 'text-brand-blue' },
      { value: '99.9%', label: 'Platform Uptime', color: 'text-cyan-400' },
    ],

    highFidelity: {
      narrative: {
        badge: 'Market Disruption :: 2026',
        titleLine1: 'The Data',
        titleHighlight: 'Explosion',
        titleLine2: 'is Real.',
        description: 'Modern enterprises are generating unimaginable volumes of data. Most are not just unready — they are operationally paralyzed by the sheer scale of fragmented information.',
        bottleneckLabel: 'The Bottleneck',
        bottleneckText: 'Incoherent cloud platforms & fragmented legacy systems.',
        requirementLabel: 'The Consequence',
        requirementText: 'Reactive scaling & skyrocketing architectural debt.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
        statusLabel: 'Latency Check',
        statusValue: '4ms_Target'
      },
      philosophy: {
        icon: <Database className="w-7 h-7 text-brand-blue" />,
        title: 'Big Data',
        titleHighlight: 'Logic-First.',
        description: 'We architect ecosystems that prioritize relevance and governance over simple collection — turning reactive datasets into proactive strategic assets.',
        pills: ['Enterprise ROI', 'Hardened Security', 'Reactive Autonomy', 'Zero Data Debt']
      },
      matrix: {
        engineId: 'Engine :: Kang_V4',
        title: 'Enablement Matrix',
        subtext: 'Comprehensive deconstruction of the enterprise data lifecycle into modular, governed intelligence layers.',
        layers: [
          { title: 'Acquisition', id: 'AQ_STRAT', icon: <RefreshCw />, desc: 'Intelligent multi-modal data capture pipelines.' },
          { title: 'Unification', id: 'UN_CORE', icon: <Layers />, desc: 'Semantic deconstruction of distributed silos.' },
          { title: 'Processing', id: 'PR_ENGINE', icon: <Cpu />, desc: 'AI-native streaming and transformation modules.' },
          { title: 'Assurance', id: 'AS_HARD', icon: <ShieldCheck />, desc: 'End-to-end provenance and governance fabric.' }
        ]
      },
      schematic: {
        titleLine1: 'Accelerate',
        titleHighlight: 'Everything.',
        description: 'Your data should not overwhelm your systems. It should be the fuel for undisputed competitive advantage.',
        stats: [
          { label: 'Latency', val: 'ZERO' },
          { label: 'ROI', val: 'EXPONENTIAL' },
          { label: 'Security', val: 'ABSOLUTE' }
        ]
      }
    },

    customSections: (
      <>
        <AILogoTrustSection />

        <AIChallengesSection
          title="The Limits of"
          subtitle="Legacy Data Infrastructure."
          challenges={[
            {
              problem: 'Data lakes without governance become data swamps.',
              fix: 'Our lakehouse architectures combine the scale of data lakes with the structure of warehouses — giving you governed, queryable data at petabyte scale without the chaos.'
            },
            {
              problem: 'ETL bottlenecks that make data stale before it reaches analysts.',
              fix: 'We replace batch ETL with event-driven streaming pipelines (Kafka, Flink, Kinesis) so data is fresh, continuous, and available the moment it matters.'
            },
            {
              problem: 'No real-time visibility into operations, risk, or customer behavior.',
              fix: 'Modern stream processing architectures enable sub-second operational dashboards and live alerting — replacing overnight reports with live intelligence.'
            }
          ]}
        />

        <AIArchitectureDiagram
          title="The Enterprise Data Platform."
          nodes={[
            {
              title: 'Ingestion & Integration',
              description: 'High-throughput, multi-source data ingestion across batch and streaming channels with built-in validation.',
              features: ['Kafka & Kinesis Streaming', 'REST & CDC Connectors', 'Schema Registry & Validation'],
              icon: RefreshCw
            },
            {
              title: 'Storage & Lakehouse',
              description: 'Open-format lakehouse architecture with tiered storage, compute-storage separation, and ACID transaction support.',
              features: ['Delta Lake / Iceberg Format', 'Tiered Storage Policies', 'Compute-Storage Separation'],
              icon: Database
            },
            {
              title: 'Processing & Compute',
              description: 'Distributed compute for batch transformations, real-time aggregations, and AI/ML workloads at enterprise scale.',
              features: ['Apache Spark & Flink', 'dbt Transformations', 'ML Feature Engineering'],
              icon: Cpu
            },
            {
              title: 'Governance & Observability',
              description: 'Automated data cataloguing, column-level access controls, lineage tracking, and quality monitoring baked in.',
              features: ['Data Catalog & Lineage', 'Role-Based Access Control', 'Data Quality Monitoring'],
              icon: ShieldCheck
            }
          ]}
        />

        <UseCasesMagnificationList
          title="Big Data Across Industries."
          useCases={[
            {
              industry: 'Big Data for Banking & Financial Services',
              description: 'Petabyte-scale regulatory data lakes, real-time transaction monitoring, Basel III/IV reporting pipelines, and governed data platforms that meet audit and compliance requirements without analyst bottlenecks.',
              tags: ['Regulatory Data Lake', 'Transaction Monitoring', 'Basel Reporting', 'Compliance Governance']
            },
            {
              industry: 'Manufacturing IoT & Operational Data',
              description: 'High-frequency sensor data ingestion from factory floor IoT devices, real-time OEE monitoring, predictive maintenance pipelines, and unified operational data platforms across multi-site facilities.',
              tags: ['IoT Data Ingestion', 'OEE Analytics', 'Predictive Maintenance', 'Multi-site Data Platform']
            },
            {
              industry: 'Retail Personalization at Scale',
              description: 'Unified customer data platforms that reconcile online, in-store, and loyalty data — enabling real-time personalization engines, recommendation systems, and cross-channel attribution at petabyte scale.',
              tags: ['Customer Data Platform', 'Real-time Personalization', 'Recommendation Engine', 'Cross-channel Attribution']
            },
            {
              industry: 'Healthcare Patient Data & Interoperability',
              description: 'FHIR-compliant data lakehouses that unify EHR, claims, genomics, and wearables data — enabling clinical research, population health analytics, and AI model training on governed, de-identified datasets.',
              tags: ['FHIR Data Lakehouse', 'EHR Integration', 'Population Health', 'Clinical Research Data']
            }
          ]}
        />

        <AIAcceleratorRoadmap
          title="The Data Modernization Journey."
          phases={[
            {
              num: '01',
              title: 'Assessment & Architecture',
              desc: 'Audit your current data estate — platforms, pipelines, quality, and governance gaps — and design the target state architecture with a phased migration plan.',
              deliverables: ['Data Estate Audit', 'Architecture Blueprint', 'Migration Roadmap']
            },
            {
              num: '02',
              title: 'Data Platform Build',
              desc: 'Provision and configure the lakehouse platform, establish ingestion pipelines, streaming infrastructure, and the foundational governance layer.',
              deliverables: ['Lakehouse Setup', 'Streaming Pipelines', 'Governance Layer Foundation']
            },
            {
              num: '03',
              title: 'Migration & Integration',
              desc: 'Migrate legacy RDBMS, data warehouses, and silos into the new platform with full lineage, zero downtime, and validated data integrity at every step.',
              deliverables: ['RDBMS Migration', 'Data Integrity Validation', 'Zero-downtime Cutover']
            },
            {
              num: '04',
              title: 'Governance & Optimization',
              desc: 'Activate automated data cataloguing, quality monitoring, access controls, and continuous cost optimization to make the platform self-sustaining.',
              deliverables: ['Data Catalog Activation', 'Automated Quality Monitoring', 'Cost Optimization Policies']
            }
          ]}
        />

        <AIMetricsSection
          metrics={[
            {
              title: 'Storage Cost',
              desc: 'Reduction in per-TB infrastructure cost achieved through tiered storage and compute-storage separation in lakehouse architectures.',
              prefix: '',
              value: '40',
              suffix: '%',
              metricLabel: 'Cost Reduction',
              icon: BarChart3
            },
            {
              title: 'Query Performance',
              desc: 'Improvement in analytical query speed after migrating from legacy RDBMS to columnar lakehouse formats with optimized compute.',
              prefix: '',
              value: '10',
              suffix: 'x',
              metricLabel: 'Query Speed',
              icon: Zap
            },
            {
              title: 'Data Freshness',
              desc: 'End-to-end latency from event generation to dashboard visibility using event-driven streaming pipelines replacing nightly batch jobs.',
              prefix: '',
              value: 'Real',
              suffix: '-time',
              metricLabel: 'Ingestion',
              icon: Activity
            },
            {
              title: 'Pipeline Reliability',
              desc: 'Platform uptime maintained across enterprise data pipelines with automated monitoring, failover, and managed operations.',
              prefix: '',
              value: '99.9',
              suffix: '%',
              metricLabel: 'Uptime',
              icon: ShieldCheck
            }
          ]}
        />

        <AITransformationMagnet />
      </>
    ),

    capabilitiesTitle: 'Our Capabilities.',
    capabilities: [
      {
        title: 'EDW Optimization',
        bgImage: '/images/capabilities/data-analytics.png',
        description: 'Equip your Enterprise Data Warehouse to tackle the growing demands of big data. Build a central data repository that unifies heterogeneous sources, maintains data quality, and gives you access to the information you need — when you need it.',
        items: [
          { heading: 'Modernization of legacy warehouses', description: 'Migrate aging data warehouse environments to modern cloud-native or hybrid architectures — improving query performance, reducing maintenance overhead, and eliminating end-of-life risk.' },
          { heading: 'ELT / Offload Architecture', description: 'Redesign data pipelines to leverage cloud compute for transformations, offloading heavy processing from legacy warehouse engines to scalable, cost-efficient compute layers.' },
          { heading: 'Data Archiving Solutions', description: 'Implement tiered data archiving strategies that move cold data to low-cost storage while keeping it queryable — reducing warehouse storage costs without sacrificing analytical access.' },
          { heading: 'Datastore, Governance & Security Management', description: 'Enforce data quality, access controls, lineage tracking, and security policies across the warehouse environment — with automated governance that scales with data volume.' },
          { heading: 'Self Service BI / Discovery Enablement', description: 'Design semantic layers, curated data marts, and governed data products that empower analysts to self-serve insights without IT dependency or raw data access.' }
        ]
      },
      {
        title: 'Lakehouse Architecture',
        bgImage: '/images/capabilities/software-engineering.png',
        description: 'Define, design, and develop the capabilities of dealing with data of any size, shape, and speed. Empower developers, data scientists, and analysts with the right tools to leverage enterprise-scale data assets.',
        items: [
          { heading: 'Strategy & Roadmap Development', description: 'Define the business case, technology choices, and phased migration plan for moving to a lakehouse architecture — grounded in your existing data estate and target analytics use cases.' },
          { heading: 'Prototyping & Tool Evaluation', description: 'Run structured proof-of-concepts across Delta Lake, Apache Iceberg, and Hudi to validate performance, compatibility, and governance capabilities before committing to a platform.' },
          { heading: 'Data Integration, Access & Services', description: 'Design and implement ingestion pipelines, API access layers, and data product catalogs that make lakehouse data accessible to every consumer — from BI tools to ML notebooks.' },
          { heading: 'Scalable Storage & Processing Architecture', description: 'Engineer compute-storage separation, partitioning strategies, and tiered storage policies that scale cost-efficiently with data volume and query concurrency.' },
          { heading: 'Construction & Go-Live Enablement', description: 'Build and validate the complete lakehouse stack — ingestion, storage, transformation, governance — and manage the go-live transition with zero-downtime cutover.' }
        ]
      },
      {
        title: 'Stream & Real-Time',
        bgImage: '/images/capabilities/business-strategy.png',
        description: 'Redefine real-time processing with event-driven stream analytics. Garner insights from data streams across disparate sources the moment events occur — replacing overnight reports with live operational intelligence.',
        items: [
          { heading: 'Real-time Data Ingestion', description: 'Deploy Kafka, Kinesis, and Flink-based ingestion pipelines that capture events from IoT devices, transactional systems, and digital channels at sub-second latency.' },
          { heading: 'Scalable Data Processing & Storage', description: 'Design stream processing topologies with elastic compute that scale automatically with event volume — without manual cluster management or capacity pre-provisioning.' },
          { heading: 'Event-driven Architecture & Flow', description: 'Engineer event-driven microservices and workflow triggers that react to data state changes in real time — enabling automated decisions, escalations, and downstream actions.' },
          { heading: 'Dashboards, Alerting & Monitoring Systems', description: 'Build real-time operational dashboards and intelligent alerting systems that surface anomalies, SLA breaches, and business KPI movements the moment they happen.' }
        ]
      },
      {
        title: 'Migration & Integration',
        bgImage: '/images/capabilities/digital-transformation.png',
        description: 'Platform consolidation and large-scale data absorption across multi-source environments. We ensure seamless transitions and data integrity during complex enterprise transformation initiatives.',
        items: [
          { heading: 'Large-scale data absorption & ingestion', description: 'Design and operate high-throughput ingestion frameworks that absorb petabyte-scale datasets from multiple source systems with built-in validation and error handling.' },
          { heading: 'Platform consolidation & unification', description: 'Merge fragmented data platforms — warehouses, lakes, marts — into a unified architecture with shared governance, consistent schemas, and a single lineage graph.' },
          { heading: 'Multi-source integration frameworks', description: 'Build reusable connector libraries and integration layers that standardize data extraction across ERP, CRM, SaaS, legacy, and streaming sources into the target platform.' },
          { heading: 'Structured & unstructured data handling', description: 'Ingest, parse, and normalize both structured relational data and unstructured content — documents, logs, images, and telemetry — within a unified data platform.' }
        ]
      },
      {
        title: 'Hadoop-Based Platforms',
        bgImage: '/images/capabilities/data-analytics.png',
        description: 'Leverage the power of distributed processing for cost-effective enterprise storage and high-concurrency analysis. We modernize Hadoop ecosystems for active archiving and scalable compute.',
        items: [
          { heading: 'Hadoop as Enterprise Data Warehouse', description: 'Architect Hadoop clusters as the primary analytical layer — enabling SQL-on-Hadoop for BI workloads at a fraction of the per-TB cost of traditional warehouse platforms.' },
          { heading: 'Hadoop as Active Archive Solution', description: 'Position Hadoop as a governed active archive tier — retaining years of historical data at low cost while keeping it queryable for compliance, research, and reprocessing.' },
          { heading: 'Large-scale concurrent processing', description: 'Configure and tune distributed compute (MapReduce, Spark, Tez) for high-concurrency batch workloads — maximizing cluster utilization and minimizing job completion times.' },
          { heading: 'Cost-effective long-term storage & retrieval', description: 'Implement HDFS tiering, storage policies, and lifecycle management to reduce the cost per TB of long-term data retention while maintaining sub-minute retrieval for analytical queries.' }
        ]
      },
      {
        title: 'RDBMS to NoSQL (R2M)',
        bgImage: '/images/capabilities/data-analytics.png',
        description: 'Automated conversion of legacy relational data into modern document-based schemas for high performance. Reduce manual migration errors and optimize for cloud-native speed.',
        items: [
          { heading: 'Automated schema conversion & mapping', description: 'Use AI-assisted tools to analyze relational schemas and generate equivalent NoSQL document models — eliminating manual schema re-design and accelerating migration timelines.' },
          { heading: 'Replication & integrity validation', description: 'Run parallel replication with automated row-count, checksum, and referential integrity validation to guarantee data fidelity before the legacy system is decommissioned.' },
          { heading: 'Performance optimization for NoSQL', description: 'Design partition keys, index strategies, and access patterns for the target NoSQL platform (MongoDB, DynamoDB, Cassandra) to maximize query performance at cloud scale.' },
          { heading: 'Reduced manual migration overhead', description: 'Replace manual ETL scripting with automated migration pipelines that handle data type mapping, null handling, and transformation — reducing migration effort by up to 70%.' }
        ]
      },
      {
        title: 'Managed Data Services',
        bgImage: '/images/capabilities/data-analytics.png',
        description: 'Reliable 24/7 managed support for data platforms, ensuring continuous uptime, performance tuning, and ongoing governance for your intelligence ecosystem.',
        items: [
          { heading: 'Platform monitoring & health checks', description: 'Proactive 24/7 monitoring of pipeline health, cluster utilization, and data freshness — with automated alerting and escalation before issues impact downstream consumers.' },
          { heading: 'Continuous performance optimization', description: 'Ongoing query tuning, storage optimization, and compute right-sizing cadences that keep platform performance improving and infrastructure costs contained over time.' },
          { heading: 'Ongoing governance & compliance', description: 'Maintain data catalogs, lineage records, access control reviews, and compliance reporting on a continuous basis — keeping your platform audit-ready at all times.' },
          { heading: 'Managed analytics operations', description: 'Operate your analytics infrastructure end-to-end — from pipeline orchestration and incident response to feature releases and user support — as a fully managed service.' }
        ]
      }
    ]
  };

  const department = {
    name: 'Analytics & Insights',
    slug: 'analytics-insights',
    description: 'Transform your data into a strategic advantage with scalable engineering.'
  };

  const pageData = {
    service,
    department
  };

  return (
    <div className="ai-cognitive-page-override">
      <SEO
        title="Big Data Services — Enterprise Data Platform & Lakehouse Architecture"
        description="Kangqore designs and modernizes enterprise Big Data platforms — from data lakehouses and real-time stream processing to Hadoop modernization and governed data ecosystems — built for AI-ready intelligence at scale."
        keywords="big data services, enterprise data platform, data lakehouse architecture, Hadoop modernization, real-time stream processing, data lake, cloud data platform, big data consulting, data engineering, scalable data infrastructure"
        url="https://kangqore.com/services/big-data"
        schemas={[FAQ_SCHEMA]}
      />
      <ServicePageTemplate service={pageData.service} department={department} disableSEO />
    </div>
  );
};

export default BigData;
