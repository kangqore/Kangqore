import React from 'react';
import { Activity, BrainCircuit, ShieldCheck, RefreshCw, Zap, Database, TrendingUp, Cloud, Shield, Lock } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import SEO from '../../../components/SEO';

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What happens when a model drifts silently in production?",
      "acceptedAnswer": { "@type": "Answer", "text": "Silent drift is the most dangerous failure mode in production ML. Our MLOps frameworks deploy continuous telemetry that monitors data distribution, prediction confidence, and business KPI alignment in real-time. When drift exceeds defined thresholds, automated alerts trigger and retraining pipelines execute — without waiting for a human to notice a degrading metric." }
    },
    {
      "@type": "Question",
      "name": "Does MLOps require us to replace our existing data infrastructure?",
      "acceptedAnswer": { "@type": "Answer", "text": "No. We design MLOps pipelines to be platform-agnostic and integrate with your existing stack — whether that's AWS SageMaker, Azure ML, GCP Vertex, Databricks, or on-premise Kubernetes. We start with a workflow audit and select tooling that reduces friction, not adds it." }
    },
    {
      "@type": "Question",
      "name": "How do we ensure reproducibility across training and serving environments?",
      "acceptedAnswer": { "@type": "Answer", "text": "Reproducibility requires versioning at every layer: data, code, hyperparameters, and environment. We implement comprehensive experiment tracking (MLflow, W&B), dataset versioning, and containerized training environments so any experiment can be reproduced exactly — months or years later." }
    },
    {
      "@type": "Question",
      "name": "How quickly will we see ROI from an MLOps implementation?",
      "acceptedAnswer": { "@type": "Answer", "text": "Most clients see measurable ROI within the first 60 days — primarily through deployment speed (models that took weeks to ship now take hours) and reduced operational overhead (eliminating manual monitoring, retraining, and incident response). Our benchmark: 90% reduction in time-to-production and 50% reduction in ML infrastructure costs." }
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

const MLOps = () => {
  const service = {
    name: 'MLOps.',
    titleLine1: 'Enterprise',
    titleHighlight: 'MLOps.',
    slug: 'mlops',
    badge: 'AI & Cognitive',
    shortDescription: 'From Fragmentation to Standardized AI Excellence',
    description: 'Bridge the gap between experimental AI and industrial-scale production. We implement the governance, automation, and infrastructure needed to turn complex models into reliable business assets.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
    videoBackground: '/videos/engineering-rd-bg.mp4',
    
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

    hideGenericMidPageCta: true,
    hideGenericFaq: false,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'AI & Cognitive', link: '/department/ai-cognitive' },
      { label: 'MLOps' }
    ],

    stats: [
      { value: '60%', label: 'Faster Deployments', color: 'text-cyan-400' },
      { value: '40%', label: 'Reduced Drift', color: 'text-brand-blue' },
      { value: 'Auto', label: 'Retraining', color: 'text-cyan-400' },
      { value: 'Tier 1', label: 'Governance', color: 'text-brand-blue' }
    ],

    highFidelity: {
      narrative: {
        badge: 'Operational Intelligence :: 2026',
        titleLine1: 'Standardize',
        titleHighlight: 'Intelligence.',
        titleLine2: 'Scale Production.',
        description: 'Most AI initiatives fail at deployment. We engineer industrial-grade MLOps pipelines that bridge the gap between experimental data science and mission-critical software engineering — ensuring your models are reliable, scalable, and governed.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Models stuck in notebooks, manual deployments, and silent performance drift.',
        requirementLabel: 'The Requirement',
        requirementText: 'Automated CI/CD for machine learning, continuous monitoring, and scalable infrastructure.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
        statusLabel: 'Pipeline Status',
        statusValue: 'Automated'
      },
      philosophy: {
        icon: <RefreshCw className="w-7 h-7 text-brand-blue" />,
        title: 'MLOps',
        titleHighlight: 'Engineering Discipline.',
        description: 'We believe machine learning requires software engineering rigor. Our MLOps frameworks apply CI/CD principles, robust monitoring, and automated retraining to ensure models degrade gracefully and improve continuously.',
        pills: ['Zero-Touch CI/CD', 'Drift Monitored', 'Auto-Retraining', 'Policy-as-Code']
      },
      matrix: {
        engineId: 'Engine :: MLOps_Core_V4',
        title: 'Operations Matrix',
        subtext: 'Our comprehensive MLOps lifecycle deconstructed into automated, scalable production layers.',
        layers: [
          { title: 'Data', id: 'ML_DAT', icon: <Database />, desc: 'Feature stores, data versioning, and validation pipelines.' },
          { title: 'Train', id: 'ML_TRN', icon: <BrainCircuit />, desc: 'Experiment tracking, distributed training, and model registries.' },
          { title: 'Serve', id: 'ML_SRV', icon: <Cloud />, desc: 'High-performance inference, canary deployments, and auto-scaling.' },
          { title: 'Monitor', id: 'ML_MON', icon: <Activity />, desc: 'Data drift detection, performance telemetry, and auto-retraining.' }
        ]
      },
      schematic: {
        titleLine1: 'Automate',
        titleHighlight: 'Excellence.',
        description: 'Your models are only as good as the infrastructure that runs them. We build the pipelines that make intelligence operational.',
        stats: [
          { label: 'Uptime', val: '99.99%' },
          { label: 'Deployment', val: 'AUTOMATED' },
          { label: 'Drift', val: 'CONTROLLED' }
        ]
      }
    },
    
    customSections: (
      <>
        <AILogoTrustSection />
        
        <AIChallengesSection 
          title="The Friction of"
          subtitle="Manual ML."
          challenges={[
            {
              problem: 'Silent model degradation.',
              fix: 'Automated drift detection alerts you instantly when production data diverges from training data.'
            },
            {
              problem: 'Weeks to deploy a model.',
              fix: 'Zero-touch CI/CD pipelines reduce deployment times from months to minutes.'
            },
            {
              problem: 'Irreproducible results.',
              fix: 'Comprehensive experiment tracking and data versioning guarantee absolute reproducibility.'
            }
          ]}
        />
        
        <AIArchitectureDiagram 
          title="The MLOps Architecture."
          nodes={[
            {
              title: 'Feature Engineering',
              description: 'Centralized feature stores ensuring consistency between training and serving.',
              features: ['Feature Stores', 'Data Versioning', 'Validation Gates'],
              icon: Database
            },
            {
              title: 'Model Training',
              description: 'Automated hyperparameter tuning and comprehensive experiment tracking.',
              features: ['Experiment Tracking', 'Distributed Compute', 'Model Registry'],
              icon: BrainCircuit
            },
            {
              title: 'Deployment & Serving',
              description: 'High-performance inference endpoints with canary and shadow deployments.',
              features: ['Triton / Seldon', 'A/B Testing', 'Auto-scaling'],
              icon: Cloud
            },
            {
              title: 'Monitoring & Feedback',
              description: 'Real-time telemetry tracking model health, data drift, and bias metrics.',
              features: ['Drift Detection', 'Auto-Retraining', 'Alerting'],
              icon: Activity
            }
          ]}
        />
        
        <UseCasesMagnificationList 
          title="MLOps in Production."
          useCases={[
            {
              industry: 'Banking & FinTech',
              description: 'Maintaining sub-100ms model latency while processing millions of transactions with strict regulatory drift monitoring.',
              tags: ['Fraud Detection', 'High-Frequency', 'Regulatory Audit']
            },
            {
              industry: 'Retail & E-commerce',
              description: 'Managing thousands of micro-models for individual store locations with automated retraining based on sales velocity.',
              tags: ['Micro-models', 'Hyper-personalization', 'Auto-Retraining']
            },
            {
              industry: 'Healthcare',
              description: 'Secure HIPAA-compliant MLOps pipelines with end-to-end data lineage and rigorous human-in-the-loop validation.',
              tags: ['Data Lineage', 'HIPAA Compliant', 'HITL Validation']
            },
            {
              industry: 'Manufacturing',
              description: 'Deploying lightweight predictive maintenance models to edge devices across global factory floors with centralized monitoring.',
              tags: ['Edge Deployment', 'IoT Analytics', 'Centralized Ops']
            }
          ]}
        />
        
        <AIAcceleratorRoadmap 
          title="The MLOps Maturity Journey."
          phases={[
            {
              num: '01',
              title: 'Assessment & Architecture',
              desc: 'We evaluate your current ML workflows, identify bottlenecks, and design a scalable cloud-native MLOps architecture.',
              deliverables: ['Workflow Audit', 'Toolchain Selection', 'Architecture Blueprint']
            },
            {
              num: '02',
              title: 'Pipeline Engineering',
              desc: 'Building the CI/CD pipelines, feature stores, and model registries required for automated deployments.',
              deliverables: ['CI/CD Setup', 'Feature Store', 'Model Registry']
            },
            {
              num: '03',
              title: 'Monitoring & Observability',
              desc: 'Deploying the telemetry systems to track data drift, model degradation, and operational metrics in real-time.',
              deliverables: ['Drift Dashboards', 'Alerting Rules', 'Performance Metrics']
            },
            {
              num: '04',
              title: 'Closed-Loop Automation',
              desc: 'Implementing automated retraining triggers and shadow deployments to ensure models improve continuously.',
              deliverables: ['Auto-Retraining pipelines', 'A/B Testing Framework', 'Shadow Deployments']
            }
          ]}
        />
        
        <AIMetricsSection 
          metrics={[
            {
              title: 'Deployment Speed',
              desc: 'Reduction in time to move models from dev to prod.',
              prefix: '',
              value: '90',
              suffix: '%',
              metricLabel: 'Faster Deployments',
              icon: Zap
            },
            {
              title: 'Operational Cost',
              desc: 'Decrease in manual infrastructure management overhead.',
              prefix: '',
              value: '50',
              suffix: '%',
              metricLabel: 'Cost Savings',
              icon: TrendingUp
            },
            {
              title: 'Model Reliability',
              desc: 'Reduction in silent model failures due to data drift.',
              prefix: '',
              value: '95',
              suffix: '%',
              metricLabel: 'Incident Reduction',
              icon: ShieldCheck
            },
            {
              title: 'Experiment Velocity',
              desc: 'Increase in the number of ML experiments conducted monthly.',
              prefix: '',
              value: '3',
              suffix: 'x',
              metricLabel: 'Velocity Boost',
              icon: Activity
            }
          ]}
        />
        
        <AITransformationMagnet />
      </>
    ),
    capabilitiesTitle: 'Our MLOps Capabilities',
    capabilities: [
      {
        title: 'Data & Feature Engineering',
        bgImage: '/images/capabilities/data-analytics.png',
        items: [
          { heading: 'Automated ingestion pipelines', description: 'Streamline raw data flow into production-ready analytical datasets.' },
          { heading: 'Feature store architecture', description: 'Centralized repository for discovering, documenting, and serving ML features.' },
          { heading: 'Dataset versioning', description: 'Track data lineage and reproduce experiments with absolute precision.' },
          { heading: 'Data validation & lineage', description: 'Ensure data quality and integrity throughout the entire pipeline.' }
        ]
      },
      {
        title: 'Model Development & Deployment',
        bgImage: '/images/capabilities/ai-cognitive.png',
        items: [
          { heading: 'Experiment tracking', description: 'Automatically log parameters, metrics, and artifacts for every run.' },
          { heading: 'Canary deployments', description: 'Safely roll out models to a subset of users before full production release.' },
          { heading: 'Model registry', description: 'Central hub for managing model lifecycle from staging to production.' },
          { heading: 'CI/CD integration', description: 'Automated pipelines for testing and deploying ML models at scale.' },
          { heading: 'Containerized deployments', description: 'Ensure consistent runtime environments across development and production.' }
        ]
      },
      {
        title: 'Monitoring, Governance & Optimization',
        bgImage: '/images/capabilities/cybersecurity.png',
        items: [
          { heading: 'Drift detection', description: 'Identify when production data deviates from training sets in real-time.' },
          { heading: 'Performance monitoring', description: 'Track latency, throughput, and system health for deployed models.' },
          { heading: 'Auto-retraining triggers', description: 'Establish closed-loop systems that improve models based on live data.' },
          { heading: 'Audit logs', description: 'Maintain full traceability of every model version and deployment decision.' },
          { heading: 'Compliance guardrails', description: 'Enforce regulatory and ethical standards with policy-as-code gates.' }
        ]
      }
    ]
  };

  const department = {
    name: 'AI & Cognitive',
    slug: 'ai-cognitive',
    description: 'Transform your business with cutting-edge AI & cognitive solutions.',
    icon: <Activity className="w-6 h-6" />
  };

  const pageData = {
    service,
    department
  };

  return (
    <div className="ai-cognitive-page-override">
      <SEO
        title="MLOps Services — Enterprise ML Pipeline Automation & Governance"
        description="Kangqore engineers industrial-grade MLOps pipelines that bridge experimental data science and production-critical software — with automated CI/CD, drift detection, model monitoring, and closed-loop retraining."
        keywords="MLOps services, ML pipeline automation, model drift detection, CI/CD for machine learning, model deployment, ML monitoring, model registry, experiment tracking, auto-retraining, enterprise MLOps consulting"
        url="https://kangqore.com/services/mlops"
        schemas={[FAQ_SCHEMA]}
      />
      <ServicePageTemplate service={pageData.service} department={pageData.department} disableSEO />
    </div>
  );
};

export default MLOps;
