import React from 'react';
import { Database, TrendingUp, Activity, ShieldCheck, Zap, Search, Layers, Brain, BarChart3, Cloud, Target } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

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
    hideGenericFaq: true,

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
        title: 'Data Engineering & Modern Platforms',
        bgImage: '/images/capabilities/data-analytics.png',
        items: [
          { heading: 'Real-time & batch pipelines', description: 'Design and deploy scalable data pipelines for both real-time streaming and batch processing workloads.' },
          { heading: 'Data lakehouse & warehouse design', description: 'Build modern lakehouse architectures that unify structured and unstructured data for analytics and ML.' },
          { heading: 'Streaming architectures', description: 'Implement event-driven streaming systems for real-time data processing and instant insights.' },
          { heading: 'Data quality & governance frameworks', description: 'Establish data quality monitoring, lineage tracking, and governance policies across the enterprise.' }
        ]
      },
      {
        title: 'Machine Learning & Predictive Systems',
        bgImage: '/images/capabilities/education.png',
        items: [
          { heading: 'Forecasting & optimization models', description: 'Build predictive models for demand forecasting, resource optimization, and strategic planning.' },
          { heading: 'Classification & anomaly detection', description: 'Develop classifiers and anomaly detectors for fraud prevention, quality control, and risk assessment.' },
          { heading: 'Recommender systems', description: 'Create personalized recommendation engines that drive engagement and conversion.' },
          { heading: 'Advanced statistical modeling', description: 'Apply rigorous statistical methods for hypothesis testing, causal inference, and experimental design.' }
        ]
      },
      {
        title: 'Generative AI & Intelligent Assistants',
        bgImage: '/images/capabilities/ai-cognitive.png',
        items: [
          { heading: 'RAG systems & enterprise copilots', description: 'Build retrieval-augmented generation systems that ground AI responses in your enterprise knowledge.' },
          { heading: 'Knowledge retrieval engines', description: 'Deploy intelligent search and retrieval systems that surface relevant information instantly.' },
          { heading: 'Domain-specific GenAI applications', description: 'Create customized generative AI applications tailored to your industry and use cases.' },
          { heading: 'Multi-agent workflows', description: 'Orchestrate multiple AI agents to handle complex, multi-step business processes autonomously.' }
        ]
      },
      {
        title: 'MLOps & Model Lifecycle Management',
        bgImage: '/images/capabilities/ai-cognitive.png',
        items: [
          { heading: 'CI/CD for ML', description: 'Implement continuous integration and deployment pipelines specifically designed for machine learning workflows.' },
          { heading: 'Model versioning & rollback', description: 'Manage model versions with full lineage tracking and instant rollback capabilities.' },
          { heading: 'Performance monitoring', description: 'Track model performance metrics in production with automated alerting and reporting.' },
          { heading: 'Drift detection & retraining', description: 'Detect data and concept drift automatically and trigger retraining pipelines to maintain accuracy.' }
        ]
      },
      {
        title: 'AI Governance & Responsible AI',
        bgImage: '/images/capabilities/ai-cognitive.png',
        items: [
          { heading: 'Ethical AI policies', description: 'Establish organizational policies and frameworks for ethical AI development and deployment.' },
          { heading: 'Bias detection & mitigation', description: 'Identify and mitigate bias in training data and model predictions to ensure fair outcomes.' },
          { heading: 'Explainability frameworks', description: 'Implement model interpretability tools that make AI decisions transparent and understandable.' },
          { heading: 'Audit trails & compliance controls', description: 'Maintain comprehensive audit logs and compliance controls for regulatory adherence.' }
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
      <ServicePageTemplate service={pageData.service} department={pageData.department} />
    </div>
  );
};

export default DataScienceAI;
