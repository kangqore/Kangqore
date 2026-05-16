import React from 'react';
import { Zap, Search, Layers, Activity, ShieldCheck, Brain, Network, Cpu, Shield, Sparkles } from 'lucide-react';
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

const GenAIBusinessServices = () => {
  const service = {
    name: 'GenAI Business Services.',
    titleLine1: 'GenAI',
    titleHighlight: 'Services.',
    slug: 'genai-business-services',
    badge: 'AI & Cognitive',
    shortDescription: 'Built for Scale, Governance & Real Enterprise Value',
    description: 'We design and deploy production-grade Generative AI solutions that move beyond pilots — embedding intelligence into workflows, products, and decision systems across the enterprise.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    videoBackground: '/videos/software-development-bg.mp4',
    
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

    hideGenericMidPageCta: true,
    hideGenericFaq: true,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'AI & Cognitive', link: '/department/ai-cognitive' },
      { label: 'GenAI Business Services' }
    ],

    stats: [
      { value: '50%', label: 'Faster Automation', color: 'text-cyan-400' },
      { value: '30-60%', label: 'Cost Optimization', color: 'text-brand-blue' },
      { value: 'Real-time', label: 'Data Access', color: 'text-cyan-400' },
      { value: 'Built-In', label: 'Governance', color: 'text-brand-blue' }
    ],

    highFidelity: {
      narrative: {
        badge: 'Generative AI :: 2026',
        titleLine1: 'Deploy',
        titleHighlight: 'GenAI.',
        titleLine2: 'Drive Enterprise Value.',
        description: 'Most enterprises struggle to move from AI experimentation to scalable value. We design and deploy production-grade Generative AI solutions — embedding intelligence into workflows, products, and decision systems with governance and control built in from day one.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Fragmented pilots, ungoverned LLMs, and unscaled POCs.',
        requirementLabel: 'The Requirement',
        requirementText: 'Governed, production-ready, and measurable GenAI deployments.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
        statusLabel: 'GenAI Health',
        statusValue: 'Production'
      },
      philosophy: {
        icon: <Sparkles className="w-7 h-7 text-brand-blue" />,
        title: 'GenAI',
        titleHighlight: 'Governance-First Deployment.',
        description: 'We believe GenAI is a business capability, not an IT experiment. Our "Governance-First" approach combines AI-native architecture, enterprise integration, LLMOps, and compliance controls from day one.',
        pills: ['LLMOps Monitored', 'RAG Secured', 'GDPR Ready', 'Agentic Scale']
      },
      matrix: {
        engineId: 'Engine :: GenAI_Aria_V5',
        title: 'Enablement Matrix',
        subtext: 'Our comprehensive GenAI business services lifecycle deconstructed into modular, governed production layers.',
        layers: [
          { title: 'Assess', id: 'GAI_PLAN', icon: <Search />, desc: 'AI readiness evaluation and high-value use case identification.' },
          { title: 'Pilot', id: 'GAI_POC', icon: <Zap />, desc: 'Production-grade pilot deployment with governance checkpoints.' },
          { title: 'Build', id: 'GAI_BUILD', icon: <Network />, desc: 'Governed AI copilots and agentic workflows with security guardrails.' },
          { title: 'Scale', id: 'GAI_SCALE', icon: <ShieldCheck />, desc: 'Enterprise-wide expansion with LLMOps monitoring and optimization.' }
        ]
      },
      schematic: {
        titleLine1: 'Generate',
        titleHighlight: 'ROI.',
        description: 'Your enterprise AI should pay for itself — with precision, velocity, and accountability. We build the foundations for measurable AI-led transformation.',
        stats: [
          { label: 'Automation', val: 'MAXIMUM' },
          { label: 'Governance', val: 'ABSOLUTE' },
          { label: 'ROI', val: 'MEASURABLE' }
        ]
      }
    },
    
    customSections: (
      <>
        <AILogoTrustSection />
        
        <AIChallengesSection 
          title="The Risk of"
          subtitle="Pilot Purgatory."
          challenges={[
            {
              problem: 'Hallucinations and inaccurate data.',
              fix: 'We engineer secure RAG architectures that ground generative models strictly in your enterprise data.'
            },
            {
              problem: 'Uncontrolled token costs.',
              fix: 'We implement LLMOps gateways to monitor usage, cache responses, and route to optimal models.'
            },
            {
              problem: 'Data privacy violations.',
              fix: 'Our deployments include PII masking, RBAC, and secure enterprise environments.'
            }
          ]}
        />
        
        <AIArchitectureDiagram 
          title="The GenAI Enterprise Stack."
          nodes={[
            {
              title: 'Application Layer',
              description: 'Copilots, chat interfaces, and embedded AI features.',
              features: ['Custom UIs', 'Agentic Workflows', 'API Integrations'],
              icon: Layers
            },
            {
              title: 'Cognitive Engine',
              description: 'The logic tier orchestrating prompts, memory, and tool usage.',
              features: ['Prompt Engineering', 'LangGraph / CrewAI', 'Context Management'],
              icon: Brain
            },
            {
              title: 'Data & Knowledge',
              description: 'Vector databases and search engines grounding the AI in truth.',
              features: ['Vector Databases', 'Semantic Search', 'Data Pipelines'],
              icon: Search
            },
            {
              title: 'LLMOps & Governance',
              description: 'Monitoring, routing, and securing all LLM interactions.',
              features: ['Cost Tracking', 'PII Masking', 'Model Routing'],
              icon: ShieldCheck
            }
          ]}
        />
        
        <UseCasesMagnificationList 
          title="GenAI Value Creation."
          useCases={[
            {
              industry: 'Customer Operations',
              description: 'Intelligent digital workers that resolve multi-step customer inquiries autonomously while escalating edge cases smoothly.',
              tags: ['L2 Support', 'Autonomous Resolution', 'Sentiment Analysis']
            },
            {
              industry: 'Software Engineering',
              description: 'DevOps copilots that assist in code generation, bug triage, legacy refactoring, and automated test writing.',
              tags: ['Code Generation', 'Automated QA', 'Refactoring']
            },
            {
              industry: 'Knowledge Management',
              description: 'Enterprise search assistants that instantly synthesize answers from thousands of scattered internal documents.',
              tags: ['Semantic Search', 'Document Q&A', 'Knowledge Synthesis']
            },
            {
              industry: 'Marketing & Content',
              description: 'Automated content pipelines that generate hyper-personalized copy at scale while maintaining brand voice.',
              tags: ['Content Generation', 'Personalization', 'SEO Optimization']
            }
          ]}
        />
        
        <AIAcceleratorRoadmap 
          title="The Path to Production."
          phases={[
            {
              num: '01',
              title: 'Use Case & Security Audit',
              desc: 'We map high-value workflows, assess your data security posture, and define the technical architecture.',
              deliverables: ['Use Case Matrix', 'Security Audit', 'Architecture Blueprint']
            },
            {
              num: '02',
              title: 'RAG & Data Foundation',
              desc: 'Building the data pipelines, vector databases, and semantic search capabilities needed to ground the AI.',
              deliverables: ['Vector DB Setup', 'Data Chunking Strategy', 'Search APIs']
            },
            {
              num: '03',
              title: 'Application Development',
              desc: 'Engineering the copilots, prompt logic, and integration into your existing systems.',
              deliverables: ['Copilot UI', 'Prompt Engineering', 'System Integration']
            },
            {
              num: '04',
              title: 'LLMOps & Go-Live',
              desc: 'Deploying monitoring tools to track token usage, response quality, and user engagement.',
              deliverables: ['Usage Dashboards', 'Production Deployment', 'User Training']
            }
          ]}
        />
        
        <AIMetricsSection 
          metrics={[
            {
              title: 'Productivity Gains',
              desc: 'Increase in output for automated knowledge workflows.',
              prefix: '',
              value: '40',
              suffix: '%',
              metricLabel: 'Efficiency Boost',
              icon: Zap
            },
            {
              title: 'Time to Value',
              desc: 'Speed from use-case identification to production pilot.',
              prefix: '',
              value: '8',
              suffix: 'Wks',
              metricLabel: 'Deployment Speed',
              icon: Activity
            },
            {
              title: 'Response Accuracy',
              desc: 'Accuracy rate for RAG-powered query responses.',
              prefix: '',
              value: '95',
              suffix: '%',
              metricLabel: 'Accuracy',
              icon: ShieldCheck
            },
            {
              title: 'Operating Cost',
              desc: 'Reduction in manual processing and support costs.',
              prefix: '',
              value: '30',
              suffix: '%',
              metricLabel: 'Cost Savings',
              icon: TrendingDown
            }
          ]}
        />
        
        <AITransformationMagnet />
      </>
    ),
    capabilitiesTitle: 'Our Capabilities.',
    capabilities: [
      {
        title: 'Agentic AI Systems',
        bgImage: '/images/capabilities/ai-cognitive.png',
        items: [
          { heading: 'Intelligent digital workers', description: 'Deploy autonomous AI agents that handle complex business processes end-to-end.' },
          { heading: 'Multi-agent workflow automation', description: 'Orchestrate multiple AI agents to collaborate on enterprise-scale tasks.' },
          { heading: 'Enterprise copilots', description: 'Build AI copilots that augment employee productivity across departments.' },
          { heading: 'Autonomous orchestration layers', description: 'Create self-managing AI systems that adapt and optimize in real-time.' }
        ]
      },
      {
        title: 'Information AI',
        bgImage: '/images/capabilities/data-analytics.png',
        items: [
          { heading: 'Contextual knowledge bots', description: 'AI-powered bots that understand context and deliver precise enterprise knowledge.' },
          { heading: 'Secure RAG implementations', description: 'Retrieval-augmented generation systems with enterprise-grade security controls.' },
          { heading: 'AI-powered document intelligence', description: 'Extract, analyze, and summarize information from complex document repositories.' },
          { heading: 'Compliance-aware summarization', description: 'Generate accurate summaries while respecting regulatory and compliance boundaries.' }
        ]
      },
      {
        title: 'Insights AI',
        bgImage: '/images/capabilities/ai-cognitive.png',
        items: [
          { heading: 'Conversational BI', description: 'Natural language interfaces for business intelligence — ask questions, get answers.' },
          { heading: 'Executive AI reporting', description: 'Automated executive summaries and strategic dashboards powered by AI.' },
          { heading: 'Predictive analytics with GenAI overlay', description: 'Combine predictive models with generative AI for richer, contextual insights.' },
          { heading: 'AI-driven strategic dashboards', description: 'Dynamic dashboards that surface trends, anomalies, and recommendations automatically.' }
        ]
      },
      {
        title: 'Content AI',
        bgImage: '/images/capabilities/ai-cognitive.png',
        items: [
          { heading: 'Automated content generation workflows', description: 'End-to-end content creation pipelines for marketing, documentation, and communications.' },
          { heading: 'Hyper-personalized marketing content', description: 'Generate tailored content at scale across channels, segments, and personas.' },
          { heading: 'Enterprise-grade translation & localization', description: 'AI-powered multilingual content with cultural context and brand consistency.' },
          { heading: 'AI knowledge publishing', description: 'Automate knowledge base creation, updates, and distribution across the enterprise.' }
        ]
      },
      {
        title: 'Product AI',
        bgImage: '/images/capabilities/ai-cognitive.png',
        items: [
          { heading: 'GenAI feature embedding in digital products', description: 'Integrate generative AI capabilities directly into your software products.' },
          { heading: 'AI copilots for SaaS platforms', description: 'Build intelligent assistants that enhance your SaaS user experience.' },
          { heading: 'AI-enabled UX experiences', description: 'Create adaptive, personalized user experiences powered by generative AI.' },
          { heading: 'Industry-specific AI accelerators', description: 'Pre-built GenAI modules tailored to specific industry verticals and use cases.' }
        ]
      }
    ]
  };

  const department = {
    name: 'AI & Cognitive',
    slug: 'ai-cognitive',
    description: 'Transform your business with cutting-edge AI & cognitive solutions.',
    icon: <Sparkles className="w-6 h-6" />
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

export default GenAIBusinessServices;
