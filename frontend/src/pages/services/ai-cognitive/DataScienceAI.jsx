import React from 'react';
import { Database, TrendingUp, Activity, ShieldCheck, Zap, Search, Layers, Brain, BarChart3, Cloud, Target } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import SEO from '../../../components/SEO';

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What if we don't have enough clean data to build reliable models?",
      "acceptedAnswer": { "@type": "Answer", "text": "Every engagement begins with a data readiness audit. If your data is insufficient, incomplete, or poorly structured, we address that first — building ingestion pipelines, applying data quality frameworks, and identifying supplementary data sources before any modeling begins. We will not build models on data that cannot support them." }
    },
    {
      "@type": "Question",
      "name": "How do you ensure your models are not biased or unfair?",
      "acceptedAnswer": { "@type": "Answer", "text": "We apply responsible AI practices at every stage: bias detection during feature engineering, fairness metrics during evaluation, and explainability frameworks (SHAP, LIME) in production. Every model comes with a model card documenting known limitations, training data provenance, and recommended use cases." }
    },
    {
      "@type": "Question",
      "name": "Who owns the models and intellectual property you build?",
      "acceptedAnswer": { "@type": "Answer", "text": "You do. All models, code, pipelines, and documentation produced during an engagement are fully transferred to the client at project completion. Kangqore retains no licensing rights, usage rights, or access to your models or data after the engagement concludes." }
    },
    {
      "@type": "Question",
      "name": "How do we measure whether a data science engagement actually delivered value?",
      "acceptedAnswer": { "@type": "Answer", "text": "We define success metrics before any technical work begins — specific business KPIs tied to the model's output, not generic accuracy scores. Every engagement includes a value realization report comparing pre-deployment baselines against post-deployment measurements, so the business impact is unambiguous and auditable." }
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

const DataScienceAI = () => {
  const service = {
    name: 'Data Science & AI.',
    titleLine1: 'Data Science',
    titleHighlight: '& AI.',
    slug: 'data-science-ai',
    badge: 'AI & Cognitive',
    shortDescription: 'Transform raw data into predictive intelligence, autonomous decision systems, and production-grade AI solutions.',
    description: 'Data Science without operational alignment is an experiment. We design and deploy enterprise AI systems — from advanced analytics and machine learning to generative AI and agentic intelligence — engineered for scale, governance, and measurable impact.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    videoBackground: '/videos/software-development-bg.mp4',
    
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

    hideGenericMidPageCta: true,
    hideGenericFaq: false,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'AI & Cognitive', link: '/department/ai-cognitive' },
      { label: 'Data Science & AI' }
    ],

    stats: [
      { value: '15+', label: 'AI Deployments', color: 'text-brand-blue' },
      { value: '97%', label: 'Model Reliability', color: 'text-cyan-400' },
      { value: 'Multi-Cloud', label: 'Infrastructure', color: 'text-brand-blue' },
      { value: 'Enterprise', label: 'Governance', color: 'text-cyan-400' }
    ],

    highFidelity: {
      narrative: {
        badge: 'Decision Intelligence :: 2026',
        titleLine1: 'Transform',
        titleHighlight: 'Data.',
        titleLine2: 'Power Decisions.',
        description: 'Data Science without operational alignment is an experiment. We design and deploy enterprise AI systems — from advanced analytics and machine learning to generative AI and agentic intelligence — engineered for scale, governance, and measurable impact.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Fragmented models, ungovernanced ML, and isolated analytics.',
        requirementLabel: 'The Requirement',
        requirementText: 'Governed, MLOps-ready, and AI-native enterprise intelligence.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        statusLabel: 'Intelligence Health',
        statusValue: 'Optimized'
      },
      philosophy: {
        icon: <Brain className="w-7 h-7 text-brand-blue" />,
        title: 'Data',
        titleHighlight: 'Intelligence-First Engineering.',
        description: 'We believe data should power decisions, not just inform them. Our "Intelligence-First" approach combines AI-native engineering, enterprise data architecture, and responsible AI governance into a single disciplined framework.',
        pills: ['MLOps Ready', 'Responsible AI', 'Gov Embedded', 'LLM Powered']
      },
      matrix: {
        engineId: 'Engine :: DS_Vision_V6',
        title: 'Enablement Matrix',
        subtext: 'Our comprehensive Data Science & AI lifecycle deconstructed into modular, governed, enterprise-grade intelligence layers.',
        layers: [
          { title: 'Ingest', id: 'DS_ENG', icon: <Database />, desc: 'Modern data platforms, ingestion pipelines, and lakehouse architecture.' },
          { title: 'Model', id: 'DS_ML', icon: <TrendingUp />, desc: 'Machine learning, predictive modeling, and GenAI system design.' },
          { title: 'Operate', id: 'DS_OPS', icon: <Activity />, desc: 'CI/CD for ML, model versioning, drift detection, and retraining.' },
          { title: 'Govern', id: 'DS_GOV', icon: <ShieldCheck />, desc: 'Responsible AI, bias detection, audit trails, and compliance controls.' }
        ]
      },
      schematic: {
        titleLine1: 'Unlock',
        titleHighlight: 'ROI.',
        description: 'Your data should be your greatest driver of competitive intelligence. We build the foundations for exponential AI-led decision-making.',
        stats: [
          { label: 'Accuracy', val: 'ABSOLUTE' },
          { label: 'Latency', val: 'ZERO' },
          { label: 'Scale', val: 'EXPONENTIAL' }
        ]
      }
    },
    
    customSections: (
      <>
        <AILogoTrustSection />
        
        <AIChallengesSection 
          title="The Limitations of"
          subtitle="Siloed Data Science."
          challenges={[
            {
              problem: 'Models stuck in notebooks.',
              fix: 'We engineer end-to-end MLOps pipelines that take models from experiment to production reliably.'
            },
            {
              problem: 'Stale data, poor decisions.',
              fix: 'Real-time streaming architectures and lakehouses ensure your models operate on the freshest data.'
            },
            {
              problem: 'Unmeasurable ROI.',
              fix: 'We tie every data science initiative to specific business metrics, proving value before scaling.'
            }
          ]}
        />
        
        <AIArchitectureDiagram 
          title="The Intelligence Pipeline."
          nodes={[
            {
              title: 'Data Engineering',
              description: 'Real-time pipelines, lakehouses, and robust ingestion frameworks.',
              features: ['Streaming Architecture', 'Data Quality Rules', 'Unified Profiles'],
              icon: Database
            },
            {
              title: 'Advanced Analytics',
              description: 'Extracting historical patterns and diagnosing performance drivers.',
              features: ['Statistical Modeling', 'Anomaly Detection', 'Causal Inference'],
              icon: BarChart3
            },
            {
              title: 'Machine Learning',
              description: 'Training predictive models to forecast outcomes and optimize decisions.',
              features: ['Supervised Learning', 'Feature Engineering', 'Optimization Algorithms'],
              icon: TrendingUp
            },
            {
              title: 'MLOps & CI/CD',
              description: 'Continuous integration, deployment, and monitoring for ML models.',
              features: ['Model Versioning', 'Drift Detection', 'Automated Retraining'],
              icon: Cloud
            }
          ]}
        />
        
        <UseCasesMagnificationList 
          title="Data Science Across Verticals."
          useCases={[
            {
              industry: 'Retail & Consumer Goods',
              description: 'Demand forecasting models that ingest weather patterns, social sentiment, and historical sales to optimize inventory distribution.',
              tags: ['Demand Forecasting', 'Pricing Optimization', 'Churn Prediction']
            },
            {
              industry: 'Banking & Financial Services',
              description: 'Algorithmic trading models, dynamic credit scoring, and real-time fraud detection systems powered by massive transaction datasets.',
              tags: ['Fraud Detection', 'Credit Scoring', 'Algorithmic Trading']
            },
            {
              industry: 'Manufacturing',
              description: 'Predictive maintenance models that analyze sensor telemetry to forecast equipment failure before it disrupts the supply chain.',
              tags: ['Predictive Maintenance', 'Yield Optimization', 'Supply Chain Analytics']
            },
            {
              industry: 'Healthcare',
              description: 'Clinical outcome prediction, drug discovery analytics, and patient risk stratification to improve care delivery.',
              tags: ['Risk Stratification', 'Clinical Analytics', 'Drug Discovery']
            }
          ]}
        />
        
        <AIAcceleratorRoadmap 
          title="Data Science Delivery Framework."
          phases={[
            {
              num: '01',
              title: 'Data Readiness & Feasibility',
              desc: 'We audit your data infrastructure, assess quality, and define the predictive use cases with the highest ROI.',
              deliverables: ['Data Quality Audit', 'Use Case Prioritization', 'Architecture Blueprint']
            },
            {
              num: '02',
              title: 'Model Development & Training',
              desc: 'Feature engineering, algorithm selection, and model training using historical datasets.',
              deliverables: ['Feature Store Setup', 'Trained Models', 'Performance Baseline']
            },
            {
              num: '03',
              title: 'MLOps Pipeline Engineering',
              desc: 'Building the infrastructure to deploy, scale, and monitor the models in a production environment.',
              deliverables: ['CI/CD Pipelines', 'Model Registry', 'Deployment APIs']
            },
            {
              num: '04',
              title: 'Continuous Optimization',
              desc: 'Monitoring model drift, evaluating business impact, and triggering automated retraining.',
              deliverables: ['Drift Dashboards', 'Retraining Triggers', 'Value Realization Reports']
            }
          ]}
        />
        
        <AIMetricsSection 
          metrics={[
            {
              title: 'Deployment Speed',
              desc: 'Faster time-to-market for predictive models.',
              prefix: '',
              value: '60',
              suffix: '%',
              metricLabel: 'Reduction in Time',
              icon: Zap
            },
            {
              title: 'Prediction Accuracy',
              desc: 'Improvement in forecasting precision.',
              prefix: '',
              value: '45',
              suffix: '%',
              metricLabel: 'Accuracy Increase',
              icon: Target
            },
            {
              title: 'Infrastructure Efficiency',
              desc: 'Reduction in cloud compute costs for ML training.',
              prefix: '',
              value: '30',
              suffix: '%',
              metricLabel: 'Cost Savings',
              icon: Cloud
            },
            {
              title: 'Model Availability',
              desc: 'Uptime for mission-critical ML APIs.',
              prefix: '',
              value: '99.9',
              suffix: '%',
              metricLabel: 'Reliability',
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
        title: 'Data Engineering & Modern Data Platforms',
        desc: 'Design scalable, secure, and modern data ecosystems that enable trusted analytics, artificial intelligence, and enterprise decision-making.',
        bgImage: '/images/capabilities/agentic-governed-autonomy.png',
        items: [
          { heading: 'Real-Time & Batch Data Engineering', description: 'Build high-performance data pipelines that process streaming and batch workloads to support operational intelligence and analytics at scale.' },
          { heading: 'Data Lakehouse & Warehouse Architecture', description: 'Design modern lakehouse and warehouse platforms that unify structured, semi-structured, and unstructured enterprise data.' },
          { heading: 'Event Streaming & Data Integration', description: 'Implement event-driven architectures that enable continuous data ingestion, real-time processing, and enterprise-wide data integration.' },
          { heading: 'Data Quality Engineering', description: 'Establish automated data validation, profiling, cleansing, monitoring, and quality controls to ensure trusted enterprise data.' },
          { heading: 'Data Governance & Lineage', description: 'Implement enterprise governance frameworks that provide data cataloguing, lineage tracking, metadata management, and policy enforcement.' },
          { heading: 'Enterprise Data Architecture', description: 'Develop scalable, cloud-native data architectures that support analytics, AI workloads, and long-term digital transformation initiatives.' }
        ]
      },
      {
        title: 'Machine Learning & Predictive Intelligence',
        desc: 'Develop intelligent machine learning solutions that enable prediction, optimization, automation, and data-driven business decision-making.',
        bgImage: '/images/capabilities/agentic-governed-autonomy.png',
        items: [
          { heading: 'Predictive Modelling & Forecasting', description: 'Develop advanced forecasting models for demand planning, financial forecasting, operational optimization, and strategic decision support.' },
          { heading: 'Classification & Anomaly Detection', description: 'Build intelligent classification and anomaly detection systems that identify fraud, operational risks, quality issues, and unusual behavior.' },
          { heading: 'Recommendation Intelligence', description: 'Create AI-powered recommendation systems that deliver personalised customer experiences and improve engagement, retention, and revenue.' },
          { heading: 'Statistical & Quantitative Modelling', description: 'Apply advanced statistical methods, experimentation, and causal analysis to generate reliable business insights.' },
          { heading: 'Feature Engineering & Model Development', description: 'Design high-quality data features and optimize machine learning models for improved predictive performance and scalability.' },
          { heading: 'Decision Intelligence', description: 'Combine machine learning, analytics, and business rules to support intelligent, explainable, and data-driven decision-making.' }
        ]
      },
      {
        title: 'Generative AI & Intelligent Systems',
        desc: 'Design enterprise-grade Generative AI solutions that enhance productivity, automate knowledge work, and enable intelligent business operations.',
        bgImage: '/images/capabilities/agentic-governed-autonomy.png',
        items: [
          { heading: 'Enterprise Copilots & AI Assistants', description: 'Develop secure AI assistants that augment employees with contextual knowledge, automation, and intelligent decision support.' },
          { heading: 'Retrieval-Augmented Generation (RAG)', description: 'Build enterprise RAG architectures that combine foundation models with trusted organizational knowledge for accurate and grounded AI responses.' },
          { heading: 'Enterprise Knowledge Intelligence', description: 'Develop intelligent search, semantic retrieval, and knowledge management platforms that unlock enterprise information.' },
          { heading: 'Domain-Specific Generative AI', description: 'Create industry-specific Generative AI applications tailored to unique business processes, regulations, and operational requirements.' },
          { heading: 'Multi-Agent AI Systems', description: 'Develop collaborative AI agent ecosystems capable of coordinating complex workflows, autonomous task execution, and enterprise orchestration.' },
          { heading: 'AI Workflow Automation', description: 'Integrate Generative AI into enterprise workflows to automate repetitive processes, improve productivity, and accelerate business operations.' }
        ]
      },
      {
        title: 'MLOps & AI Lifecycle Engineering',
        desc: 'Establish enterprise engineering practices that enable reliable, scalable, and governed deployment, operation, and continuous improvement of AI systems.',
        bgImage: '/images/capabilities/agentic-governed-autonomy.png',
        items: [
          { heading: 'AI Deployment Pipelines', description: 'Implement automated CI/CD pipelines that streamline the development, testing, deployment, and delivery of AI solutions.' },
          { heading: 'Model Lifecycle Management', description: 'Manage AI models across development, validation, deployment, monitoring, retraining, and retirement using governed lifecycle processes.' },
          { heading: 'Model Versioning & Registry', description: 'Maintain centralized model repositories with complete version history, documentation, metadata, and reproducibility.' },
          { heading: 'AI Performance Monitoring', description: 'Continuously monitor production models for accuracy, latency, throughput, reliability, and operational performance.' },
          { heading: 'Drift Detection & Continuous Learning', description: 'Automatically detect data and concept drift while enabling continuous retraining and model optimization.' },
          { heading: 'AI Observability', description: 'Provide end-to-end visibility into model behavior, inference quality, resource utilization, operational health, and production AI systems.' }
        ]
      },
      {
        title: 'AI Governance & Responsible AI',
        desc: 'Ensure enterprise AI systems operate responsibly, securely, transparently, and in compliance with organizational policies and regulatory requirements.',
        bgImage: '/images/capabilities/agentic-governed-autonomy.png',
        items: [
          { heading: 'Responsible AI Frameworks', description: 'Establish governance principles and organizational frameworks that guide the responsible design, deployment, and operation of AI systems.' },
          { heading: 'Fairness & Bias Management', description: 'Identify, measure, and mitigate bias across datasets, models, and AI-driven decision processes to promote equitable outcomes.' },
          { heading: 'Explainable AI', description: 'Implement interpretable AI techniques that provide transparent reasoning, confidence scores, and understandable decision explanations.' },
          { heading: 'AI Risk & Compliance', description: 'Manage AI-related operational, regulatory, ethical, and business risks while ensuring compliance with enterprise governance standards.' },
          { heading: 'Audit & Governance Controls', description: 'Maintain comprehensive audit trails, governance policies, approval workflows, and operational controls for enterprise AI systems.' },
          { heading: 'Privacy & Data Protection', description: 'Protect sensitive enterprise information through privacy-preserving AI practices, data governance, encryption, and regulatory compliance.' }
        ]
      }
    ]
  };

  const department = {
    name: 'AI & Cognitive',
    slug: 'ai-cognitive',
    description: 'Transform your business with cutting-edge AI & cognitive solutions.',
    icon: <Database className="w-6 h-6" />
  };

  const pageData = {
    service,
    department
  };

  return (
    <div className="ai-cognitive-page-override">
      <SEO
        title="Data Science & AI Services — Predictive Intelligence for Enterprise"
        description="Kangqore designs and deploys enterprise AI systems — from advanced analytics and machine learning to generative AI and MLOps — engineered for scale, governance, and measurable business impact."
        keywords="data science services, enterprise AI, machine learning consulting, predictive analytics, MLOps implementation, responsible AI, data engineering, AI model development, forecasting models, AI governance framework"
        url="https://kangqore.com/services/data-science-ai"
        schemas={[FAQ_SCHEMA]}
      />
      <ServicePageTemplate service={pageData.service} department={pageData.department} disableSEO />
    </div>
  );
};

export default DataScienceAI;
