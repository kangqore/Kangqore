import React from 'react';
import { ShieldCheck, Search, Layers, Activity, Brain, Shield, AlertTriangle, Lock } from 'lucide-react';
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

const AIGovernance = () => {
  const service = {
    name: 'AI Governance.',
    titleLine1: 'AI',
    titleHighlight: 'Governance.',
    slug: 'ai-governance',
    badge: 'AI & Cognitive',
    shortDescription: 'Building Trust, Control, and Accountability into Enterprise AI Systems',
    description: 'Kangqore enables organizations to adopt, scale, and operationalize AI responsibly by embedding governance, transparency, and control across the entire AI lifecycle.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    videoBackground: '/videos/working-machine-4751312.mp4',
    
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

    hideGenericMidPageCta: true,
    hideGenericFaq: true,

    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'AI & Cognitive', link: '/department/ai-cognitive' },
      { label: 'AI Governance' }
    ],

    stats: [
      { value: '100%', label: 'Governance Coverage', color: 'text-brand-blue' },
      { value: '10+', label: 'Governed AI Models', color: 'text-cyan-400' },
      { value: '10+', label: 'Compliance Frameworks', color: 'text-brand-blue' },
      { value: '24/7', label: 'Policy Enforcement', color: 'text-cyan-400' }
    ],

    highFidelity: {
      narrative: {
        badge: 'Enterprise Trust :: 2026',
        titleLine1: 'Govern',
        titleHighlight: 'Intelligence.',
        titleLine2: 'Scale Safely.',
        description: 'As AI systems evolve from static models to autonomous agents, organizations must move beyond ad-hoc controls to governance-by-design. We engineer frameworks that operate continuously alongside intelligent systems — ensuring transparency, accountability, and control without slowing innovation.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Unmanaged AI adoption creating compliance, security, and reputational risks.',
        requirementLabel: 'The Requirement',
        requirementText: 'Embedded, continuous, and automated AI governance frameworks.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        statusLabel: 'Risk Status',
        statusValue: 'Mitigated'
      },
      philosophy: {
        icon: <ShieldCheck className="w-7 h-7 text-brand-blue" />,
        title: 'Governance',
        titleHighlight: 'by Design.',
        description: 'If AI can think, act, and remember — it must also be governed. Our philosophy unifies AI-native engineering, enterprise risk management, and systems governance to ensure intelligent systems remain safe, explainable, and aligned with business intent.',
        pills: ['Auditable', 'Explainable', 'Secure', 'Compliant']
      },
      matrix: {
        engineId: 'Engine :: AI-GOV_V2',
        title: 'Control Matrix',
        subtext: 'Our AI Governance lifecycle deconstructed into modular, enterprise-grade control layers.',
        layers: [
          { title: 'Policy', id: 'GOV_POL', icon: <Search />, desc: 'Ethical guidelines and decision policies.' },
          { title: 'Models', id: 'GOV_MOD', icon: <Layers />, desc: 'Lifecycle governance and behavioral constraints.' },
          { title: 'Data', id: 'GOV_DAT', icon: <Activity />, desc: 'Control over training data, privacy, and consent.' },
          { title: 'Oversight', id: 'GOV_EYE', icon: <ShieldCheck />, desc: 'Human-in-the-loop and escalation controls.' }
        ]
      },
      schematic: {
        titleLine1: 'Secure',
        titleHighlight: 'Trust.',
        description: 'Your AI investments require operational trust. We build the safeguards that make intelligence reliable and compliant.',
        stats: [
          { label: 'Control', val: 'ABSOLUTE' },
          { label: 'Risk', val: 'MITIGATED' },
          { label: 'Trust', val: 'VERIFIED' }
        ]
      }
    },
    
    customSections: (
      <>
        <AILogoTrustSection />
        
        <AIChallengesSection 
          title="The Risks of"
          subtitle="Ungoverned AI."
          challenges={[
            {
              problem: 'Black-box decision making.',
              fix: 'We implement Explainable AI (XAI) frameworks so every AI outcome can be traced and understood.'
            },
            {
              problem: 'Regulatory non-compliance.',
              fix: 'Our frameworks ensure alignment with the EU AI Act, GDPR, and industry-specific regulations.'
            },
            {
              problem: 'Unintended bias and drift.',
              fix: 'Automated monitoring systems detect data drift and bias, triggering human review before impact.'
            }
          ]}
        />
        
        <AIArchitectureDiagram 
          title="The Governance Architecture."
          nodes={[
            {
              title: 'Policy & Ethics',
              description: 'Enterprise AI principles, ethical guidelines, and risk classifications.',
              features: ['Risk Tiering', 'Ethical Guardrails', 'Usage Policies'],
              icon: Shield
            },
            {
              title: 'Model & Agent Control',
              description: 'Lifecycle governance for AI and agentic systems, including approvals and versioning.',
              features: ['Model Registries', 'Release Gates', 'Behavior Limits'],
              icon: Brain
            },
            {
              title: 'Data & Privacy',
              description: 'Control over training data, prompts, and context stores ensuring privacy and consent.',
              features: ['Data Masking', 'Consent Management', 'Lineage Tracking'],
              icon: Lock
            },
            {
              title: 'Execution Oversight',
              description: 'Human-in-the-loop checkpoints, override controls, and kill-switches.',
              features: ['HITL Workflows', 'Audit Logging', 'Anomaly Alerts'],
              icon: AlertTriangle
            }
          ]}
        />
        
        <UseCasesMagnificationList 
          title="Governance Across Industries."
          useCases={[
            {
              industry: 'Financial Services',
              description: 'Model risk management (MRM), AI-driven credit and fraud governance, regulatory reporting, and explainable decision systems.',
              tags: ['Model Risk', 'Explainability', 'Regulatory Audit']
            },
            {
              industry: 'Healthcare & Life Sciences',
              description: 'Clinical AI governance and validation, patient data privacy, explainability for diagnostic systems, and compliance with healthcare regulations.',
              tags: ['HIPAA / Privacy', 'Clinical Validation', 'Data Consent']
            },
            {
              industry: 'Retail & Consumer Goods',
              description: 'Governance for personalization engines, bias controls in pricing, secure customer data usage, and demand forecasting oversight.',
              tags: ['Fair Pricing', 'Bias Control', 'Consumer Privacy']
            },
            {
              industry: 'Technology & SaaS',
              description: 'AI governance for platforms and copilots, policy enforcement for customer-facing AI, and secure multi-tenant AI systems.',
              tags: ['Copilot Oversight', 'Multi-tenant Security', 'Policy Enforcement']
            }
          ]}
        />
        
        <AIAcceleratorRoadmap 
          title="Implementing Governance."
          phases={[
            {
              num: '01',
              title: 'Risk & Maturity Assessment',
              desc: 'We evaluate your current AI landscape, assess regulatory exposure, and define a target governance operating model.',
              deliverables: ['Risk Assessment Matrix', 'Maturity Scorecard', 'Governance Roadmap']
            },
            {
              num: '02',
              title: 'Policy & Framework Design',
              desc: 'Establishing the ethical guidelines, data privacy rules, and model lifecycle policies tailored to your enterprise.',
              deliverables: ['AI Usage Policies', 'Ethical Guidelines', 'Data Privacy Frameworks']
            },
            {
              num: '03',
              title: 'Technical Implementation',
              desc: 'Deploying the tools for model registries, bias detection, explainability dashboards, and audit logging.',
              deliverables: ['Model Registry Setup', 'XAI Dashboards', 'Automated Audit Trails']
            },
            {
              num: '04',
              title: 'Continuous Monitoring',
              desc: 'Operationalizing governance with human-in-the-loop workflows, drift detection, and automated compliance reporting.',
              deliverables: ['HITL Workflows', 'Drift Alerts', 'Compliance Reports']
            }
          ]}
        />
        
        <AIMetricsSection 
          metrics={[
            {
              title: 'Compliance Coverage',
              desc: 'AI systems operating within regulatory bounds.',
              prefix: '',
              value: '100',
              suffix: '%',
              metricLabel: 'Audit Readiness',
              icon: ShieldCheck
            },
            {
              title: 'Risk Mitigation',
              desc: 'Reduction in critical AI system failures.',
              prefix: '',
              value: '95',
              suffix: '%',
              metricLabel: 'Fewer Incidents',
              icon: AlertTriangle
            },
            {
              title: 'Time to Market',
              desc: 'Faster deployment of compliant AI models.',
              prefix: '',
              value: '40',
              suffix: '%',
              metricLabel: 'Speed Increase',
              icon: Activity
            },
            {
              title: 'Decision Traceability',
              desc: 'Ability to explain AI-driven outcomes.',
              prefix: '',
              value: '100',
              suffix: '%',
              metricLabel: 'Explainability',
              icon: Search
            }
          ]}
        />
        
        <AITransformationMagnet />
      </>
    ),
    capabilitiesTitle: 'Our Capabilities.',
    capabilities: [
      {
        title: 'Managing AI & GenAI Solution Quality',
        bgImage: '/images/capabilities/ai-cognitive.png',
        subtitle: 'Reliable, accurate, and bias-aware intelligence',
        items: [
          { heading: 'Data validation, cleansing, and enrichment pipelines', description: `Ensure high-quality data inputs for consistent AI performance` },
          { heading: 'Model testing and quality assurance frameworks', description: `Rigorous testing protocols to validate AI model accuracy and reliability` },
          { heading: 'Bias, hallucination, and anomaly detection mechanisms', description: `Proactive identification and mitigation of AI system risks` },
          { heading: 'Continuous performance monitoring and drift detection', description: `Real-time tracking to maintain optimal AI system performance` }
        ],
        outcome: 'Ensures consistent, high-quality AI outputs across production systems'
      },
      {
        title: 'Establishing Ethical AI Guidelines',
        bgImage: '/images/capabilities/ai-cognitive.png',
        subtitle: 'Fair, transparent, and accountable decision-making',
        items: [
          { heading: 'Ethical AI principles and governance policy frameworks', description: `Foundational guidelines for responsible AI development and deployment` },
          { heading: 'Fairness, accountability, and transparency standards', description: `Ensure AI systems align with ethical and societal values` },
          { heading: 'Responsible AI practices for GenAI and agentic systems', description: `Specialized governance for advanced autonomous AI systems` },
          { heading: 'Model accountability and explainability controls', description: `Enable understanding and trust in AI decision-making processes` }
        ],
        outcome: 'Builds trust by aligning AI behavior with human and enterprise values'
      },
      {
        title: 'Enabling Model Governance',
        bgImage: '/images/capabilities/ai-cognitive.png',
        subtitle: 'End-to-end control across the AI lifecycle',
        items: [
          { heading: 'Model versioning, documentation, and lineage tracking', description: `Complete visibility into model history and dependencies` },
          { heading: 'Approval workflows and controlled model deployments', description: `Gated processes ensuring only validated models go to production` },
          { heading: 'Continuous monitoring and performance validation', description: `Ongoing assessment to maintain model quality and relevance` },
          { heading: 'Governed updates, rollback, and retirement processes', description: `Safe model lifecycle management with fallback capabilities` }
        ],
        outcome: 'Prevents unmanaged model changes and operational risk'
      },
      {
        title: 'Navigating Compliance & Risk Management',
        bgImage: '/images/capabilities/cybersecurity.png',
        subtitle: 'Regulation-ready, enterprise-safe AI systems',
        items: [
          { heading: 'Compliance with global regulations and industry standards', description: `Alignment with GDPR, AI Act, and sector-specific requirements` },
          { heading: 'Data anonymization, encryption, and consent management', description: `Protect sensitive information across AI workflows` },
          { heading: 'Audit trails, logging, and policy enforcement mechanisms', description: `Complete traceability for regulatory and internal audits` },
          { heading: 'AI risk assessment and mitigation frameworks', description: `Proactive identification and management of AI-related risks` }
        ],
        outcome: 'Reduces legal, operational, and reputational exposure'
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

export default AIGovernance;
