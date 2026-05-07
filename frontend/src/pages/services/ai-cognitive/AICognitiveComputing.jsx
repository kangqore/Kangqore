import React from 'react';
import { Zap, Search, Layers, Activity, ShieldCheck, Brain, DollarSign, Target, TrendingUp } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  AIChallengesSection,
  AILogoTrustSection,
  AIArchitectureDiagram,
  UseCasesMagnificationList,
  AIAcceleratorRoadmap,
  AIMetricsSection,
  AITransformationMagnet
} from './components/AICustomSections';

const AICognitiveComputing = () => {
  const service = {
    name: 'AI & Cognitive Computing.',
    titleLine1: 'Cognitive',
    titleHighlight: 'Computing.',
    slug: 'ai-cognitive-computing',
    badge: 'AI & Cognitive',
    shortDescription: 'Engineering Intelligent Systems for the Modern Enterprise',
    description: 'Deploy AI systems that can perceive, understand, learn, and reason — transforming raw data into actionable intelligence across your organization.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
    videoBackground: '/videos/engineering-rd-bg.mp4',
    
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

    hideGenericMidPageCta: true,
    hideGenericFaq: true,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'AI & Cognitive', link: '/department/ai-cognitive' },
      { label: 'AI & Cognitive Computing' }
    ],

    highFidelity: {
      narrative: {
        badge: 'Enterprise Excellence :: 2026',
        titleLine1: 'Enterprise',
        titleHighlight: 'AI & Cognitive Computing.',
        titleLine2: 'At Scale.',
        description: 'We design and deliver AI & Cognitive Computing solutions that move beyond incremental improvement — embedding capability, governance, and measurable business value into every engagement.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Fragmented delivery and misaligned strategy limiting enterprise impact.',
        requirementLabel: 'The Requirement',
        requirementText: 'Governed, integrated, and outcome-assured AI & Cognitive Computing delivery.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        statusLabel: 'Delivery',
        statusValue: 'Optimized'
      },
      philosophy: {
        icon: <Zap className="w-7 h-7 text-brand-blue" />,
        title: 'AI & Cognitive Computing',
        titleHighlight: 'Outcome-First Design.',
        description: 'We believe every AI & Cognitive Computing engagement should deliver compounding enterprise value — not just deliverables, but lasting organizational capability.',
        pills: ['Outcome-Led', 'Governed', 'Scalable', 'ROI-Focused']
      },
      matrix: {
        engineId: 'Engine :: AI-COGNI_V3',
        title: 'Enablement Matrix',
        subtext: 'Our AI & Cognitive Computing lifecycle deconstructed into modular, governed, enterprise-grade delivery layers.',
        layers: [
          { title: 'Assess', id: 'AI-C_ASSESS', icon: <Search />, desc: 'Discovery, assessment, and strategic alignment.' },
          { title: 'Design', id: 'AI-C_DESIGN', icon: <Layers />, desc: 'Architecture design and solution planning.' },
          { title: 'Deliver', id: 'AI-C_DEL', icon: <Activity />, desc: 'Structured implementation and delivery.' },
          { title: 'Govern', id: 'AI-C_GOV', icon: <ShieldCheck />, desc: 'Governance, monitoring, and continuous optimization.' }
        ]
      },
      schematic: {
        titleLine1: 'Deliver',
        titleHighlight: 'Value.',
        description: 'Your AI & Cognitive Computing investment should generate compounding business returns. We engineer the delivery frameworks that make it measurable and sustained.',
        stats: [
          { label: 'Quality', val: 'ABSOLUTE' },
          { label: 'Speed', val: 'ACCELERATED' },
          { label: 'ROI', val: 'MEASURABLE' }
        ]
      }
    },
    
    customSections: (
      <>
        <AILogoTrustSection />
        
        <AIChallengesSection 
          title="The Limits of"
          subtitle="Basic Analytics."
          challenges={[
            {
              problem: 'Data without context.',
              fix: 'Cognitive systems understand unstructured data, extracting meaning from text, audio, and vision.'
            },
            {
              problem: 'Reactive decision making.',
              fix: 'Predictive and prescriptive models anticipate outcomes and recommend optimal actions.'
            },
            {
              problem: 'Black-box algorithms.',
              fix: 'We engineer explainable AI so human operators trust the logic behind every decision.'
            }
          ]}
        />
        
        <AIArchitectureDiagram 
          title="Cognitive System Architecture."
          nodes={[
            {
              title: 'Ingestion',
              description: 'Process structured and unstructured data at scale from any enterprise source.',
              features: ['Computer Vision', 'Audio Processing', 'NLP / Text Mining'],
              icon: Layers
            },
            {
              title: 'Understanding',
              description: 'Extract semantic meaning, sentiment, and relationships from raw inputs.',
              features: ['Entity Recognition', 'Contextual Analysis', 'Knowledge Graphs'],
              icon: Search
            },
            {
              title: 'Reasoning',
              description: 'Evaluate multiple scenarios and optimize for the best possible outcome.',
              features: ['Predictive Modeling', 'Optimization Algorithms', 'Reinforcement Learning'],
              icon: Brain
            },
            {
              title: 'Interaction',
              description: 'Deliver insights through natural interfaces that humans can easily understand.',
              features: ['Conversational UI', 'Explainability Dashboards', 'API Integration'],
              icon: Activity
            }
          ]}
        />
        
        <UseCasesMagnificationList 
          title="Cognitive Intelligence in Action."
          useCases={[
            {
              industry: 'Healthcare & Life Sciences',
              description: 'Clinical decision support systems that analyze patient history, lab results, and medical literature to recommend personalized treatment pathways.',
              tags: ['Decision Support', 'Medical Imaging', 'Patient Care']
            },
            {
              industry: 'Manufacturing & Industry',
              description: 'Computer vision systems that detect microscopic defects on assembly lines in real-time, reducing waste and ensuring absolute quality control.',
              tags: ['Quality Control', 'Defect Detection', 'Predictive Maintenance']
            },
            {
              industry: 'Retail & Consumer Goods',
              description: 'Demand forecasting models that ingest weather patterns, social sentiment, and historical sales to optimize inventory distribution.',
              tags: ['Demand Forecasting', 'Pricing Optimization', 'Sentiment Analysis']
            },
            {
              industry: 'Media & Entertainment',
              description: 'Audio and video intelligence that automatically categorizes content, generates highlights, and personalizes viewer recommendations.',
              tags: ['Content Tagging', 'Video Analytics', 'Personalization']
            }
          ]}
        />
        
        <AIAcceleratorRoadmap 
          title="The Path to Intelligence."
          phases={[
            {
              num: '01',
              title: 'Data & Feasibility Assessment',
              desc: 'We evaluate your data readiness, identify high-value cognitive use cases, and validate technical feasibility.',
              deliverables: ['Data Readiness Score', 'Use Case Prioritization', 'Technical Feasibility Report']
            },
            {
              num: '02',
              title: 'Model Engineering',
              desc: 'Developing, training, and fine-tuning custom models (vision, NLP, predictive) tailored to your specific domain.',
              deliverables: ['Custom Model Development', 'Feature Engineering', 'Algorithm Selection']
            },
            {
              num: '03',
              title: 'System Integration',
              desc: 'Embedding cognitive capabilities directly into your existing enterprise applications and workflows.',
              deliverables: ['API Development', 'Workflow Integration', 'User Interface Design']
            },
            {
              num: '04',
              title: 'Optimization & MLOps',
              desc: 'Deploying robust monitoring to track model drift, ensure accuracy, and continuously improve performance.',
              deliverables: ['Performance Dashboards', 'Drift Monitoring', 'Automated Retraining Pipelines']
            }
          ]}
        />
        
        <AIMetricsSection 
          metrics={[
            {
              title: 'Decision Speed',
              desc: 'Faster analysis of complex data sets.',
              prefix: '',
              value: '80',
              suffix: '%',
              metricLabel: 'Reduction in Time',
              icon: Zap
            },
            {
              title: 'Insight Accuracy',
              desc: 'Improvement in prediction and classification.',
              prefix: '',
              value: '35',
              suffix: '%',
              metricLabel: 'Accuracy Gain',
              icon: Target
            },
            {
              title: 'Operational Cost',
              desc: 'Reduction in manual data processing.',
              prefix: '',
              value: '50',
              suffix: '%',
              metricLabel: 'Cost Savings',
              icon: DollarSign
            },
            {
              title: 'System Adaptability',
              desc: 'Continuous learning from new data inputs.',
              prefix: '',
              value: '24',
              suffix: '/7',
              metricLabel: 'Continuous Improvement',
              icon: TrendingUp
            }
          ]}
        />
        
        <AITransformationMagnet />
      </>
    ),
    capabilitiesTitle: 'Our Capabilities.',
    capabilities: [
      {
        title: 'Machine Learning',
        bgImage: '/images/capabilities/education.png',
        description: 'Machine Learning enables systems to identify patterns, learn from data, and improve outcomes without explicit programming. Our ML capabilities drive faster decision-making, intelligent automation, predictive and prescriptive insights, and scalable learning systems.',
        items: [
          { heading: 'Deep Learning', description: `Advanced neural networks for complex pattern recognition and predictive modeling.` },
          { heading: 'Predictive Analytics', description: `Forecast trends, behaviors, and outcomes using historical and real-time data.` },
          { heading: 'Statistical Modeling', description: `Build robust statistical models for data analysis and decision support.` },
          { heading: 'Data Mining', description: `Extract valuable insights and patterns from large datasets.` },
          { heading: 'Supervised & Unsupervised Learning', description: `Implement classification, regression, clustering, and dimensionality reduction techniques.` }
        ]
      },
      {
        title: 'Image Processing & Video Analytics',
        bgImage: '/images/capabilities/data-analytics.png',
        description: 'Extract meaningful intelligence from visual data while reducing manual effort and improving operational efficiency.',
        items: [
          { heading: 'Face Detection', description: `Accurately detect and identify faces in images and video streams.` },
          { heading: 'Object Identification', description: `Recognize and classify objects within visual content for automated analysis.` },
          { heading: 'OCR (Optical Character Recognition)', description: `Convert printed and handwritten text from images into machine-readable data.` },
          { heading: 'Scene Understanding', description: `Analyze and interpret visual scenes for context-aware decision-making.` },
          { heading: 'Person Tracking', description: `Track individuals across video frames for security and analytics applications.` },
          { heading: 'Image & Video Tagging', description: `Automatically tag and categorize visual content for organization and search.` }
        ]
      },
      {
        title: 'Natural Language Understanding (NLU)',
        bgImage: '/images/capabilities/ai-cognitive.png',
        description: 'Enable machines to understand, interpret, and respond to human language with context and accuracy.',
        items: [
          { heading: 'Conversational Interfaces & Chatbots', description: `Build intelligent conversational agents for customer service and support.` },
          { heading: 'Speech & Voice Recognition', description: `Convert spoken language into text and enable voice-based interactions.` },
          { heading: 'Text Mining', description: `Extract insights and patterns from unstructured text data.` },
          { heading: 'Information Extraction', description: `Automatically identify and extract relevant information from documents.` },
          { heading: 'Question Answering Systems', description: `Build systems that understand questions and provide accurate answers.` },
          { heading: 'Intelligent Search & Retrieval', description: `Implement semantic search capabilities for improved information discovery.` }
        ]
      },
      {
        title: 'Augmented & Virtual Reality',
        bgImage: '/images/capabilities/cybersecurity.png',
        description: 'Deliver immersive, interactive experiences that enhance engagement, visualization, and learning.',
        items: [
          { heading: 'AR/VR Product Visualization', description: `Enable customers to visualize products in real-world environments before purchase.` },
          { heading: 'Data Visualization in VR', description: `Explore complex data in immersive 3D environments for better insights.` },
          { heading: 'Retail & Fashion Experiences', description: `Virtual try-ons and immersive shopping experiences.` },
          { heading: 'Automotive Simulations', description: `Design, test, and experience vehicles in virtual environments.` },
          { heading: 'Smart Navigation & Augmented Maps', description: `Overlay navigation and contextual information on real-world views.` }
        ]
      }
    ]
  };

  const department = {
    name: 'AI & Cognitive',
    slug: 'ai-cognitive',
    description: 'Transform your business with cutting-edge AI & cognitive solutions.',
    icon: <Brain className="w-6 h-6" />
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

export default AICognitiveComputing;
