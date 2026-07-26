import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import SEO from '../../../components/SEO';
import { Brain, Zap, ShieldCheck, Search, Network, Target, TrendingUp } from 'lucide-react';

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is agentic AI?",
      "acceptedAnswer": { "@type": "Answer", "text": "Agentic AI refers to AI systems that can autonomously reason, plan, and execute multi-step tasks toward a goal — without requiring step-by-step human instructions." }
    },
    {
      "@type": "Question",
      "name": "How is agentic AI different from traditional automation?",
      "acceptedAnswer": { "@type": "Answer", "text": "Traditional automation follows fixed rules and breaks at edge cases. Agentic AI systems reason dynamically, adapt to new information, and self-correct — making them suitable for complex, unpredictable enterprise workflows." }
    },
    {
      "@type": "Question",
      "name": "What industries benefit most from agentic AI?",
      "acceptedAnswer": { "@type": "Answer", "text": "Financial services, supply chain, healthcare, and software engineering see the highest ROI — primarily through autonomous fraud investigation, inventory management, clinical data processing, and DevOps automation." }
    },
    {
      "@type": "Question",
      "name": "Is agentic AI safe for enterprise use?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes, when built with governance-first architecture. Kangqore's approach includes human-in-the-loop (HITL) oversight, immutable audit trails, and policy enforcement layers in every deployment." }
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
  AITransformationMagnet,
  AIToolsSection,
  AIFAQSection
} from '../../../components/services/cognition/AICustomSections';

const AgenticAI = () => {
  const service = {
    name: 'Agentic AI Services.',
    titleLine1: 'Agentic AI Services',
    titleHighlight: 'That Own the Outcome.',
    slug: 'agentic-ai',
    shortDescription: 'Deploy production-grade AI agents that reason, plan, and execute complex multi-step workflows autonomously — with governance, audit trails, and human oversight built in.',
    description: 'Deploy production-grade AI agents that reason, plan, and execute complex multi-step workflows autonomously — with governance, audit trails, and human oversight built in.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    videoBackground: '/videos/business-meeting-6774639.mp4',
    
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    
    hideGenericMidPageCta: true,
    hideGenericFaq: true,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'AI & Cognitive', link: '/department/ai-cognitive' },
      { label: 'Agentic AI' }
    ],

    stats: [
      { value: 'Autonomous', label: 'Goal Execution', color: 'text-brand-blue' },
      { value: 'Zero', label: 'Human Overhead', color: 'text-cyan-400' },
      { value: '100%', label: 'Governance Audit', color: 'text-brand-blue' },
      { value: 'Real-time', label: 'Adaptive Reasoning', color: 'text-cyan-400' },
    ],

    highFidelity: {
      narrative: {
        badge: 'Agentic AI Development Services · 2026',
        titleLine1: 'Enterprise',
        titleHighlight: 'Agentic AI.',
        titleLine2: 'Governed by Design.',
        description: 'Traditional automation breaks at scale. We engineer agentic AI systems that reason, plan, and execute complex multi-step workflows autonomously — with governance and human oversight built in from day one.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Rule-based automation that breaks at complexity and scale.',
        requirementLabel: 'The Requirement',
        requirementText: 'Adaptive, governed, goal-oriented digital operators.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
        statusLabel: 'Agent Health',
        statusValue: 'Operational'
      },
      philosophy: {
        icon: <Brain className="w-7 h-7 text-brand-blue" />,
        title: 'Agentic',
        titleHighlight: 'Intelligence-First Design.',
        description: 'We believe AI should not just assist work — it should operate work. Our "Intelligence-First" approach ensures every agent is designed for long-term autonomy, enterprise integration, and measurable outcome delivery.',
        pills: ['Multi-Agent Orchestration', 'HITL Governed', 'RAG Powered', 'LLMOps Ready']
      },
      matrix: {
        engineId: 'Engine :: AgentFlow_V5',
        title: 'Enablement Matrix',
        subtext: 'Our comprehensive agentic AI lifecycle deconstructed into modular, high-impact, and governed intelligence layers.',
        layers: [
          { title: 'Design', id: 'AGT_ARCH', icon: <Search />, desc: 'Agent architecture and goal-decomposition mapping.' },
          { title: 'Orchestrate', id: 'AGT_ORCH', icon: <Network />, desc: 'Multi-agent workflow and tool-use orchestration.' },
          { title: 'Deploy', id: 'AGT_RUN', icon: <Zap />, desc: 'Production deployment with HITL oversight and monitoring.' },
          { title: 'Govern', id: 'AGT_RULE', icon: <ShieldCheck />, desc: 'Audit trails, policy enforcement, and drift detection.' }
        ]
      },
      schematic: {
        titleLine1: 'Multi-Agent Orchestration',
        titleHighlight: 'at Enterprise Scale.',
        description: 'Your enterprise should run on intelligence, not instructions. We build the foundations for exponential autonomous operations.',
        stats: [
          { label: 'Autonomy', val: 'ABSOLUTE' },
          { label: 'Overhead', val: 'MINIMIZED' },
          { label: 'Scale', val: 'ELASTIC' }
        ]
      }
    },
    
    customSections: (
      <>
        <AILogoTrustSection />
        
        <AIChallengesSection
          title="Why Traditional Automation Fails at Scale —"
          subtitle="And How Agentic AI Fixes It."
          challenges={[
            {
              problem: 'Rules break at scale.',
              fix: 'Agentic systems reason through edge cases dynamically without human intervention.'
            },
            {
              problem: 'Isolated task execution.',
              fix: 'Multi-agent orchestration allows agents to collaborate and hand off complex workflows.'
            },
            {
              problem: 'Lack of enterprise control.',
              fix: 'Our architectures embed policy enforcement, audit trails, and HITL overrides by design.'
            }
          ]}
        />
        
        <AIArchitectureDiagram
          title="How Agentic AI Works: Our 4-Layer Architecture."
          nodes={[
            {
              title: 'Perception Layer',
              description: 'Agents ingest and understand multi-modal context from enterprise systems.',
              features: ['RAG Integration', 'API Connectors', 'Real-time Event Streams'],
              icon: Search
            },
            {
              title: 'Cognitive Engine',
              description: 'LLM-powered reasoning for planning, tool selection, and goal decomposition.',
              features: ['Multi-step Planning', 'Memory Management', 'Self-Correction', 'LangGraph Orchestration'],
              icon: Brain
            },
            {
              title: 'Action & Execution',
              description: 'Agents autonomously execute tasks across CRM, ERP, and internal tools.',
              features: ['Function Calling', 'Workflow Automation', 'System Write Access'],
              icon: Zap
            },
            {
              title: 'Governance Core',
              description: 'Strict oversight, ethical boundaries, and policy enforcement.',
              features: ['Audit Logs', 'RBAC', 'Human-in-the-Loop'],
              icon: ShieldCheck
            }
          ]}
        />
        
        <UseCasesMagnificationList
          title="Agentic AI Use Cases Across Industries."
          useCases={[
            {
              industry: 'Agentic AI for Banking & Financial Services',
              description: 'Autonomous agents for complex fraud investigation, dynamic risk modeling, and hyper-personalized wealth advisory.',
              tags: ['Agentic AI Banking', 'Risk Modeling', 'Fraud Detection', 'Wealth Advisory']
            },
            {
              industry: 'AI Agents for Supply Chain Automation',
              description: 'Multi-agent systems that negotiate with suppliers, re-route shipments dynamically, and optimize inventory without manual intervention.',
              tags: ['AI Agents Supply Chain', 'Inventory Ops', 'Supplier Negotiation', 'Route Optimization']
            },
            {
              industry: 'Agentic AI for Healthcare',
              description: 'Agents that process clinical data, automate prior authorizations, and coordinate multi-step patient workflows — with strict compliance and HITL oversight.',
              tags: ['Agentic AI Healthcare', 'Clinical Automation', 'Prior Authorization', 'Patient Workflow']
            },
            {
              industry: 'Agentic AI for DevOps & Software Engineering',
              description: 'DevOps agents that autonomously triage bugs, write tests, and deploy fixes to production with human oversight.',
              tags: ['Agentic AI DevOps', 'Automated QA', 'Bug Triage', 'CI/CD Automation']
            },
            {
              industry: 'Autonomous AI Agents for Customer Support',
              description: 'Level 2/3 support agents that resolve complex, multi-step customer issues by querying databases and updating systems.',
              tags: ['AI Agents Customer Support', 'L3 Support', 'Issue Resolution', 'Account Management']
            }
          ]}
        />
        
        <AIAcceleratorRoadmap
          title="How We Build & Deploy Agentic AI: From Design to Governed Production."
          phases={[
            {
              num: '01',
              title: 'Agent Architecture Design',
              desc: 'We map your workflows, identify agentic opportunities, and design the multi-agent system architecture.',
              deliverables: ['Workflow Decomposition', 'Agent Personas', 'System Blueprint', 'ROI Modeling']
            },
            {
              num: '02',
              title: 'Foundation & Integration',
              desc: 'Building the RAG pipelines, tool integrations, and secure environments needed for agents to operate.',
              deliverables: ['Vector DB Setup', 'API Tool Creation', 'Security Sandboxing', 'Data Pipelines']
            },
            {
              num: '03',
              title: 'Cognitive Orchestration',
              desc: 'Developing the LLM logic, memory systems, and multi-agent coordination frameworks.',
              deliverables: ['Prompt Engineering', 'LangGraph Setup', 'Memory Systems', 'Evaluation Framework']
            },
            {
              num: '04',
              title: 'Governed Deployment',
              desc: 'Rolling out the agents with human-in-the-loop oversight, audit trails, and continuous monitoring.',
              deliverables: ['HITL Dashboards', 'Production Deployment', 'Drift Monitoring', 'Policy Enforcement']
            }
          ]}
        />
        
        <AIMetricsSection
          metrics={[
            {
              title: 'Vendor Onboarding',
              desc: 'Faster enterprise vendor qualification using an autonomous AI agent for supply chain workflows.',
              prefix: '',
              value: '50',
              suffix: '%',
              metricLabel: 'Faster Cycle Time',
              icon: Zap
            },
            {
              title: 'Information Access',
              desc: 'Reduction in clicks to find answers — RAG-powered AI agents surface knowledge in one query.',
              prefix: '',
              value: '90',
              suffix: '%',
              metricLabel: 'Fewer Clicks',
              icon: Search
            },
            {
              title: 'Customer Satisfaction',
              desc: 'CSAT improvement from autonomous AI agents for customer support powered by sentiment analysis.',
              prefix: '',
              value: '35',
              suffix: '%',
              metricLabel: 'CSAT Increase',
              icon: TrendingUp
            },
            {
              title: 'Call Wait Time',
              desc: 'Reduction in wait time by centralizing incident resolution data into a governed agentic AI platform.',
              prefix: '',
              value: '20',
              suffix: '%',
              metricLabel: 'Wait Time Reduced',
              icon: Target
            }
          ]}
        />
        
        <AIToolsSection items={[
          {
            icon: 'Network',
            title: 'Orchestration & Frameworks',
            desc: 'Proprietary blueprints aligned with industry-standard agent frameworks',
          },
          {
            icon: 'Cpu',
            title: 'Models',
            desc: 'Leading LLMs with RAG, fine-tuning, and enterprise controls',
          },
          {
            icon: 'Layers',
            title: 'Integration',
            desc: 'APIs, microservices, and enterprise connectors',
          },
          {
            icon: 'Shield',
            title: 'Monitoring',
            desc: 'Real-time governance, audit, and optimization tools',
          },
        ]} />

        <AITransformationMagnet />

        <AIFAQSection faqs={[
          { q: 'What Agentic AI services does Kangqore offer?',            a: 'We don\'t build AI demos. We build AI operators. Kangqore delivers autonomous agent development, multi-agent orchestration, RAG-powered enterprise reasoning, and governed LLM deployments using LangGraph — all under our Cognition™ platform, which covers the full lifecycle from agent architecture design to production-scale optimization.' },
          { q: 'How is Agentic AI different from traditional AI or Generative AI?', a: 'Generative AI answers. Agentic AI acts. Traditional AI classifies or predicts from a fixed prompt. Agentic AI sets goals, decomposes them into multi-step plans, selects and uses tools, executes tasks autonomously, and self-corrects when outcomes deviate — without waiting for a human to issue the next instruction.' },
          { q: 'How does Kangqore help enterprises adopt Agentic AI safely?', a: 'Every agent we deploy has a governor, not just a goal. Our governance-first architecture embeds human-in-the-loop (HITL) controls, immutable audit trails, role-based access restrictions, and policy enforcement layers before a single autonomous action runs in production. Risk is validated at every phase — not discovered after go-live.' },
          { q: 'What business use cases can Agentic AI enable?',           a: 'If a human currently coordinates across three or more systems to complete a task, an agent can own it. High-impact use cases include autonomous fraud investigation, supply chain renegotiation, clinical prior authorization, Level 2/3 support resolution, DevOps incident triage, and intelligent procurement — wherever complexity has made automation impossible until now.' },
          { q: 'How fast can we deploy Agentic AI?',                      a: 'Eight weeks to a production agent — not a prototype, a live operator. A focused pilot targeting one high-value workflow typically deploys in 8–12 weeks using Kangqore\'s accelerated blueprints. Enterprise-grade multi-agent systems with full RAG integration and governance layers are production-ready within 16–24 weeks, depending on data readiness.' },
          { q: 'Does Agentic AI deliver measurable ROI?',                  a: 'We define the ROI metric before we write a line of code. Engagements are baselined during Discovery so success is measurable from day one. Outcomes we\'ve targeted include 42% faster vendor onboarding, 78% fewer clicks to surface enterprise knowledge, 31% CSAT improvement in support operations, and 17% reduction in incident wait time.' },
          { q: 'What industries do you serve with Agentic AI?',            a: 'Any industry where complexity has been the enemy of automation. Kangqore delivers agentic AI across banking and financial services, healthcare and life sciences, supply chain and logistics, enterprise software engineering, and customer operations — with Cognition™ blueprints built for the compliance and governance demands of each sector.' },
          { q: 'Do you provide end-to-end Agentic AI services?',          a: 'From "what should the agent do?" to "the agent is running in production" — that\'s our scope. Kangqore covers strategy and use-case identification, agent architecture design, RAG and LLM integration, multi-agent orchestration, governed deployment, and continuous post-launch optimization. One partner, full lifecycle, no handoff gaps.' },
          { q: 'What tech stack does Kangqore use for agentic AI?',       a: 'Orchestration runs on LangGraph for stateful multi-agent workflows, with LangChain for tool-calling and chain composition. Memory persistence uses a hybrid approach — short-term context in working memory, long-term state in vector stores (Pinecone, Weaviate, or pgvector depending on enterprise constraints). RAG pipelines are built on enterprise embedding models with retrieval re-ranking to minimize hallucination on domain-specific data. LLM selection (GPT-4o, Claude, Gemini, or fine-tuned open-source) is use-case and compliance driven. Observability and drift monitoring run through LangSmith or enterprise-compatible equivalents.' },
          { q: 'What happens when an agent makes a wrong decision?',       a: 'We design for failure before writing a line of code. Agents operate within bounded permissions — they cannot act outside their assigned scope. When a step fails, checkpoint-based state restoration replays it from its last valid state, not from zero. Critical decisions trigger automatic human-in-the-loop escalation. Every action is logged to an immutable audit trail — explainable, auditable, and reversible.' },
        ]} />
      </>
    ),
    capabilitiesTitle: 'Our Capabilities.',
    capabilities: [
      {
        title: 'Autonomous Goal Execution',
        bgImage: '/images/capabilities/agentic-goal-execution.png',
        items: [
          { heading: 'Multi-step Planning', description: 'Agents dynamically break down high-level goals into actionable tasks.' },
          { heading: 'Self-Correction', description: 'Built-in logic for agents to detect failures and automatically adjust their strategy.' },
          { heading: 'Tool Utilization', description: 'Agents access enterprise APIs, databases, and third-party systems independently.' },
          { heading: 'Dynamic Reasoning', description: 'Real-time contextual understanding adapting to complex workflow variables.' }
        ]
      },
      {
        title: 'Multi-Agent Orchestration',
        bgImage: '/images/capabilities/agentic-multi-agent.png',
        items: [
          { heading: 'Agent Collaboration', description: 'Deploy swarms of specialized agents that collaborate to solve enterprise challenges.' },
          { heading: 'Task Handoffs', description: 'Seamless transitions between specialized agents for continuous workflow execution.' },
          { heading: 'Conflict Resolution', description: 'Automated consensus mechanisms for agents working on shared datasets.' },
          { heading: 'Orchestrator Dashboards', description: 'Centralized platforms to monitor agent performance, status, and system health.' }
        ]
      },
      {
        title: 'Governed Autonomy',
        bgImage: '/images/capabilities/agentic-governed-autonomy.png',
        items: [
          { heading: 'Human-in-the-Loop', description: 'Strategic escalation pathways ensuring humans remain in control of high-stakes actions.' },
          { heading: 'Audit Trails', description: 'Immutable logs detailing every decision, tool call, and reasoning step taken by an agent.' },
          { heading: 'Policy Enforcement', description: 'Strict guardrails preventing agents from violating ethical or enterprise guidelines.' },
          { heading: 'Role-Based Access', description: 'Limiting agent permissions based on zero-trust security architectures.' }
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
      <SEO
        title="Agentic AI Services — Autonomous AI Agents for Enterprise"
        description="Kangqore builds production-grade agentic AI systems that reason, plan, and execute complex enterprise workflows autonomously — with human-in-the-loop oversight, audit trails, and governance by design."
        keywords="agentic AI services, autonomous AI agents, enterprise AI agent development, AI workflow automation, multi-agent orchestration, human-in-the-loop AI, LLM agents, governed AI agents, agentic AI consulting, LLM agent orchestration, RAG-powered agents"
        url="https://kangqore.com/services/agentic-ai"
        schemas={[FAQ_SCHEMA]}
      />
      <ServicePageTemplate service={pageData.service} department={pageData.department} disableSEO />
    </div>
  );
};

export default AgenticAI;
