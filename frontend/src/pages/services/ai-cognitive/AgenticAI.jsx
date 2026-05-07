import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { Brain, Zap, ShieldCheck, Search, Layers, Activity, Cpu, Network, Target, DollarSign, TrendingUp } from 'lucide-react';

import {
  AIChallengesSection,
  AILogoTrustSection,
  AIArchitectureDiagram,
  UseCasesMagnificationList,
  AIAcceleratorRoadmap,
  AIMetricsSection,
  AITransformationMagnet
} from './components/AICustomSections';

const AgenticAI = () => {
  const service = {
    name: 'Agentic AI.',
    titleLine1: 'Agentic',
    titleHighlight: 'AI.',
    slug: 'agentic-ai',
    shortDescription: 'Build autonomous AI agents that can reason, plan, and execute complex tasks',
    description: 'Deploy intelligent AI agents that reason, plan, and act — autonomously and responsibly — across your business.',
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
        badge: 'Autonomous Intelligence :: 2026',
        titleLine1: 'Engineer',
        titleHighlight: 'Autonomy.',
        titleLine2: 'Operate at Scale.',
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
        titleLine1: 'Scale',
        titleHighlight: 'Intelligence.',
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
          title="The Limits of"
          subtitle="Traditional Automation."
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
          title="Governed Agentic Architecture."
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
              features: ['Multi-step Planning', 'Memory Management', 'Self-Correction'],
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
          title="Where Agents Create Alpha."
          useCases={[
            {
              industry: 'Financial Services',
              description: 'Autonomous agents for complex fraud investigation, dynamic risk modeling, and hyper-personalized wealth advisory.',
              tags: ['Risk Modeling', 'Fraud Detection', 'Wealth Advisory']
            },
            {
              industry: 'Supply Chain & Logistics',
              description: 'Multi-agent systems that negotiate with suppliers, re-route shipments dynamically, and optimize inventory without manual intervention.',
              tags: ['Inventory Ops', 'Supplier Negotiation', 'Route Optimization']
            },
            {
              industry: 'Software Engineering',
              description: 'DevOps agents that autonomously triage bugs, write tests, and deploy fixes to production with human oversight.',
              tags: ['Automated QA', 'Bug Triage', 'DevOps Ops']
            },
            {
              industry: 'Customer Operations',
              description: 'Level 2/3 support agents that resolve complex, multi-step customer issues by querying databases and updating systems.',
              tags: ['L3 Support', 'Issue Resolution', 'Account Management']
            }
          ]}
        />
        
        <AIAcceleratorRoadmap 
          title="From Pilot to Production."
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
              title: 'Operational Velocity',
              desc: 'Faster execution of complex, multi-step workflows.',
              prefix: '',
              value: '40',
              suffix: '%',
              metricLabel: 'Increase in Speed',
              icon: Zap
            },
            {
              title: 'Error Reduction',
              desc: 'Decrease in human error for repetitive tasks.',
              prefix: '',
              value: '99',
              suffix: '%',
              metricLabel: 'Accuracy Rate',
              icon: Target
            },
            {
              title: 'Cost Efficiency',
              desc: 'Reduction in operational overhead and manual labor.',
              prefix: '',
              value: '60',
              suffix: '%',
              metricLabel: 'Cost Savings',
              icon: DollarSign
            },
            {
              title: 'Scalability',
              desc: 'Ability to handle workload spikes without adding headcount.',
              prefix: '',
              value: '10',
              suffix: 'x',
              metricLabel: 'Capacity Increase',
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
        title: 'Autonomous Goal Execution',
        bgImage: '/images/capabilities/ai-cognitive.png',
        items: [
          { heading: 'Multi-step Planning', description: 'Agents dynamically break down high-level goals into actionable tasks.' },
          { heading: 'Self-Correction', description: 'Built-in logic for agents to detect failures and automatically adjust their strategy.' },
          { heading: 'Tool Utilization', description: 'Agents access enterprise APIs, databases, and third-party systems independently.' },
          { heading: 'Dynamic Reasoning', description: 'Real-time contextual understanding adapting to complex workflow variables.' }
        ]
      },
      {
        title: 'Multi-Agent Orchestration',
        bgImage: '/images/capabilities/data-analytics.png',
        items: [
          { heading: 'Agent Collaboration', description: 'Deploy swarms of specialized agents that collaborate to solve enterprise challenges.' },
          { heading: 'Task Handoffs', description: 'Seamless transitions between specialized agents for continuous workflow execution.' },
          { heading: 'Conflict Resolution', description: 'Automated consensus mechanisms for agents working on shared datasets.' },
          { heading: 'Orchestrator Dashboards', description: 'Centralized platforms to monitor agent performance, status, and system health.' }
        ]
      },
      {
        title: 'Governed Autonomy',
        bgImage: '/images/capabilities/cybersecurity.png',
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
      <ServicePageTemplate service={pageData.service} department={pageData.department} />
    </div>
  );
};

export default AgenticAI;
