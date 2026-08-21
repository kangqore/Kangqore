import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import SEO from '../../../components/SEO';
import { Database, BrainCircuit, Layers, LineChart, TrendingUp, Zap, Search, Activity } from 'lucide-react';

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "We have dashboards but nobody actually uses them — what's wrong?",
      "acceptedAnswer": { "@type": "Answer", "text": "Low dashboard adoption is almost always a design problem, not a data problem. Analytics built for the analyst rather than the decision-maker produces outputs that look comprehensive but answer no specific question. Kangqore designs analytics around decision flows — what does this person need to decide, how often, and with what confidence? That shift alone typically doubles engagement within the first 30 days of a redesigned deployment." }
    },
    {
      "@type": "Question",
      "name": "How do you ensure analytics outputs are accurate when our underlying data quality is poor?",
      "acceptedAnswer": { "@type": "Answer", "text": "Inaccurate analytics is worse than no analytics — it creates confident wrong decisions. We begin every engagement with a data quality assessment before a single report is designed. Our frameworks include validation pipelines, lineage tracking, anomaly detection, and governance controls so that what reaches a decision-maker has been verified, not just aggregated." }
    },
    {
      "@type": "Question",
      "name": "How quickly can we move from raw data to production analytics that drive real decisions?",
      "acceptedAnswer": { "@type": "Answer", "text": "Our accelerated delivery model targets a first meaningful dashboard within 3–4 weeks. This is not a prototype — it's a production deployment covering 2–3 critical decision domains, with governance, data pipeline, and KPI alignment in place. Full enterprise-wide analytics programs follow in phased sprints, each delivering measurable business impact before the next phase begins." }
    },
    {
      "@type": "Question",
      "name": "Can your analytics platform handle real-time streaming data alongside historical reporting?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. We design unified analytics architectures that process both real-time event streams (using Kafka, Kinesis, or Flink) and batch historical data within the same platform. This means your operational dashboards update in seconds while your strategic reports draw on the same governed, integrated data layer — no duplication, no reconciliation overhead." }
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

const Analytics = () => {
  const service = {
    name: 'Analytics & Business Intelligence.',
    titleLine1: 'Analytics & BI',
    titleHighlight: 'That Drive Decisions.',
    slug: 'analytics',
    shortDescription: 'Transform raw data into governed decision intelligence — from executive KPI command centers and predictive models to real-time streaming analytics engineered for measurable business impact.',
    description: 'Transform raw data into governed decision intelligence — from executive KPI command centers and predictive models to real-time streaming analytics engineered for measurable business impact.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    videoBackground: '/videos/business-meeting-6774639.mp4',

    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

    hideGenericMidPageCta: true,
    hideGenericFaq: false,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Analytics & Insights', link: '/department/analytics-insights' },
      { label: 'Analytics' }
    ],

    stats: [
      { value: 'Faster', label: 'Decision Velocity', color: 'text-brand-blue' },
      { value: '3x', label: 'Dashboard Adoption', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
      { value: 'Real-time', label: 'Streaming Analytics', color: 'text-brand-blue' },
      { value: 'Governed', label: 'Decision Systems', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
    ],

    highFidelity: {
      narrative: {
        badge: 'Strategic Intelligence :: 2026',
        titleLine1: 'Analytics',
        titleHighlight: 'Precision',
        titleLine2: 'for Decisions.',
        description: 'Data without context is noise. We engineer decision systems that bridge the gap between fragmented raw data and executive-ready intelligence.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Incoherent data lakes & siloed analytics reports.',
        requirementLabel: 'The Requirement',
        requirementText: 'Observable, governed, and AI-native decision pipelines.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        statusLabel: 'Decision Velocity',
        statusValue: 'Optimized'
      },
      philosophy: {
        icon: <LineChart className="w-7 h-7 text-brand-blue" />,
        title: 'Analytics',
        titleHighlight: 'Logic-First Intelligence.',
        description: 'We move beyond standard reporting into cognitive intelligence — architecting systems that prioritize relevance, provenance, and actionable outcomes.',
        pills: ['Predictive ROI', 'Hardened Governance', 'MLOps Ready', 'Zero Insight Debt']
      },
      matrix: {
        engineId: 'Engine :: Insights_V4',
        title: 'Enablement Matrix',
        subtext: 'Our end-to-end analytics engineering deconstructed into modular, governed intelligence layers.',
        layers: [
          { title: 'Ingestion', id: 'AN_AQ', icon: <Database />, desc: 'Multi-modal data capture and multi-source integration.' },
          { title: 'Unification', id: 'AN_UNI', icon: <Layers />, desc: 'Semantic modeling and distributed data lakehouse unification.' },
          { title: 'Intelligence', id: 'AN_IQ', icon: <BrainCircuit />, desc: 'Predictive modeling and cognitive intelligence modules.' },
          { title: 'Delivery', id: 'AN_DLV', icon: <Activity />, desc: 'Executive KPI command centers and real-time triggers.' }
        ]
      },
      schematic: {
        titleLine1: 'Transform',
        titleHighlight: 'Information.',
        description: 'Your data should stay as a strategic asset, not a technical burden. We build the foundations for undisputed competitive advantage.',
        stats: [
          { label: 'Accuracy', val: 'ABSOLUTE' },
          { label: 'Latency', val: 'ZERO' },
          { label: 'Velocity', val: 'EXPONENTIAL' }
        ]
      }
    },

    customSections: (
      <>
        <AILogoTrustSection />

        <AIChallengesSection
          title="The Cost of"
          subtitle="Disconnected Analytics."
          challenges={[
            {
              problem: 'Dashboards nobody uses.',
              fix: 'We redesign analytics around decision flows — what to decide, how often, and with what confidence — turning passive reports into active intelligence.'
            },
            {
              problem: 'Data siloes that prevent a single truth.',
              fix: 'Our unified semantic layer eliminates fragmentation, giving every stakeholder access to the same governed, reconciled data in real time.'
            },
            {
              problem: 'Delayed decisions from batch-only pipelines.',
              fix: 'Real-time streaming architectures (Kafka, Kinesis, Flink) mean your operational dashboards update in seconds — not overnight.'
            }
          ]}
        />

        <AIArchitectureDiagram
          title="The Analytics Intelligence Stack."
          nodes={[
            {
              title: 'Data Ingestion',
              description: 'Multi-source, multi-modal data capture with validation and lineage tracking from day one.',
              features: ['Batch & Streaming Pipelines', 'API Connectors', 'Data Quality Validation'],
              icon: Database
            },
            {
              title: 'Semantic Layer',
              description: 'A governed business logic layer that ensures every metric means the same thing to every consumer.',
              features: ['Unified Metric Definitions', 'dbt Transformations', 'Data Catalog Integration'],
              icon: Layers
            },
            {
              title: 'Analytics & BI',
              description: 'Descriptive, diagnostic, predictive, and prescriptive analytics delivered to decision-makers where they work.',
              features: ['Executive KPI Dashboards', 'Self-Service BI', 'Predictive Forecasting'],
              icon: TrendingUp
            },
            {
              title: 'Cognitive Intelligence',
              description: 'AI-augmented modules that embed NLP, graph analytics, and ML-driven pattern detection into your analytics workflows.',
              features: ['NLP Document Intelligence', 'Anomaly Detection', 'ML-Powered Insights'],
              icon: BrainCircuit
            }
          ]}
        />

        <UseCasesMagnificationList
          title="Analytics Across Industries."
          useCases={[
            {
              industry: 'Analytics for Banking & Financial Services',
              description: 'Real-time fraud detection, risk scoring engines, credit analytics, and regulatory reporting dashboards that give financial institutions a governed, auditable view of risk.',
              tags: ['Fraud Analytics', 'Risk Scoring', 'Credit Modeling', 'Regulatory Reporting']
            },
            {
              industry: 'Retail & E-commerce Demand Intelligence',
              description: 'Time-series demand forecasting, customer 360 segmentation, pricing optimization, and marketing attribution to maximize revenue and reduce inventory waste.',
              tags: ['Demand Forecasting', 'Customer Segmentation', 'Pricing Optimization', 'ROAS Analytics']
            },
            {
              industry: 'Manufacturing OEE & Quality Analytics',
              description: 'Operational efficiency dashboards, predictive maintenance signals, quality defect root cause analysis, and supply chain analytics to minimize downtime and cost.',
              tags: ['OEE Monitoring', 'Predictive Maintenance', 'Quality Analytics', 'Supply Chain BI']
            },
            {
              industry: 'Healthcare Clinical & Outcome Analytics',
              description: 'Patient risk stratification, clinical outcome forecasting, readmission prediction, and population health dashboards built on compliant, governed data architectures.',
              tags: ['Clinical Analytics', 'Patient Risk Modeling', 'Outcome Forecasting', 'Population Health']
            }
          ]}
        />

        <AIAcceleratorRoadmap
          title="From Data to Decisions."
          phases={[
            {
              num: '01',
              title: 'Assessment & Architecture',
              desc: 'We audit your current data estate, identify decision gaps, and design the target analytics architecture with governance built in.',
              deliverables: ['Data Quality Assessment', 'Decision Flow Mapping', 'Architecture Blueprint']
            },
            {
              num: '02',
              title: 'Data & Semantic Layer',
              desc: 'Build governed ingestion pipelines, semantic models, and a unified data platform that becomes the single source of truth.',
              deliverables: ['Ingestion Pipelines', 'Semantic Data Models', 'Data Catalog Setup']
            },
            {
              num: '03',
              title: 'Analytics & Dashboards',
              desc: 'Deploy production BI dashboards, self-service analytics, and predictive models aligned to the decision flows identified in Phase 1.',
              deliverables: ['Executive KPI Dashboards', 'Self-Service BI Rollout', 'Predictive Models']
            },
            {
              num: '04',
              title: 'Intelligence & Optimization',
              desc: 'Layer in cognitive analytics, real-time streaming, and continuous model monitoring to maintain accuracy as data volumes grow.',
              deliverables: ['Real-time Streaming', 'Cognitive Analytics Modules', 'Model Monitoring & Drift Detection']
            }
          ]}
        />

        <AIMetricsSection
          metrics={[
            {
              title: 'Decision Speed',
              desc: 'Faster time-to-insight across executive and operational decision layers after deploying unified analytics architectures.',
              prefix: '',
              value: '40',
              suffix: '%',
              metricLabel: 'Faster Decisions',
              icon: Zap
            },
            {
              title: 'Dashboard Adoption',
              desc: 'Increase in active dashboard usage when analytics are redesigned around decision flows rather than data availability.',
              prefix: '',
              value: '3',
              suffix: 'x',
              metricLabel: 'Higher Engagement',
              icon: TrendingUp
            },
            {
              title: 'Forecast Accuracy',
              desc: 'Improvement in demand and risk forecast accuracy after deploying governed ML pipelines with continuous monitoring.',
              prefix: '',
              value: '35',
              suffix: '%',
              metricLabel: 'Accuracy Gain',
              icon: Search
            },
            {
              title: 'Data Pipeline Latency',
              desc: 'End-to-end pipeline latency achieved with event-driven streaming architectures replacing nightly batch jobs.',
              prefix: '',
              value: 'Real',
              suffix: '-time',
              metricLabel: 'Processing',
              icon: Activity
            }
          ]}
        />

        <AITransformationMagnet />
      </>
    ),

    capabilitiesTitle: 'Our Capabilities.',
    capabilities: [
      {
        title: 'Descriptive & Diagnostic',
        bgImage: '/images/capabilities/business-strategy.png',
        items: [
          {
            heading: 'Descriptive Analytics',
            description: 'Understand what happened. Exploratory data analysis, KPI tracking, and executive reporting to provide visibility.'
          },
          {
            heading: 'Diagnostic Analytics',
            description: 'Understand why it happened. Root cause analysis, variance tracking, and segmentation to enable corrective actions.'
          }
        ]
      },
      {
        title: 'Predictive & Prescriptive',
        bgImage: '/images/capabilities/business-strategy.png',
        items: [
          {
            heading: 'Predictive Analytics',
            description: 'Understand what is likely to happen. Time-series forecasting and ML models for proactive business strategy.'
          },
          {
            heading: 'Prescriptive Solutions',
            description: 'Understand what action to take. Optimization modeling and decision engines to move from insight to execution.'
          }
        ]
      },
      {
        title: 'Cognitive Intelligence',
        bgImage: '/images/capabilities/ai-cognitive.png',
        items: [
          {
            heading: 'Cognitive Analytics',
            description: 'AI-augmented systems using NLP, Graph analytics, and pattern detection to embed AI into analytics workflows.'
          }
        ]
      }
    ]
  };

  const department = {
    name: 'Analytics & Insights',
    slug: 'analytics-insights',
    description: 'Transform your business with cutting-edge analytics & insights solutions.'
  };

  const pageData = {
    service,
    department
  };

  return (
    <div className="ai-cognitive-page-override">
      <SEO
        title="Analytics Services — Enterprise Business Intelligence & Predictive Analytics"
        description="Kangqore designs and deploys enterprise analytics solutions — from executive KPI dashboards and predictive models to real-time streaming analytics and cognitive intelligence — engineered to drive measurable decisions."
        keywords="analytics services, business intelligence, enterprise analytics, predictive analytics, data visualization, real-time analytics, cognitive analytics, KPI dashboards, data-driven decisions, analytics consulting"
        url="https://kangqore.com/services/analytics"
        schemas={[FAQ_SCHEMA]}
      />
      <ServicePageTemplate service={pageData.service} department={department} disableSEO />
    </div>
  );
};

export default Analytics;
