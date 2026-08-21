import React from 'react';
import { Gauge, Users, Target, Rocket, Zap, Activity, Shield } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const ModernEngineeringEffectiveness = () => {
  const service = {
    name: 'Modern Engineering Effectiveness',
    slug: 'modern-engineering-effectiveness',
    shortDescription: 'Optimize developer productivity and engineering quality',
    fullDescription: 'Implement modern engineering standards, AI-driven developer tools, and data-backed metrics to maximize your engineering output, quality, and velocity.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
    keyFeatures: [
      'Developer Experience (DevEx) optimization',
      'DORA & SPACE metrics implementation',
      'AI coding assistant deployments',
      'Internal Developer Platforms (IDP)',
      'Engineering culture & practice auditing'
    ],
    primaryButton: { text: 'Audit Your Engineering', link: '/contact' },
    secondaryButton: { text: 'View Methodology', link: '#capabilities' },
    stats: [
      { value: '40%', label: 'Velocity Gains', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
      { value: 'Elite', label: 'DORA Rating', color: 'text-blue-400' },
      { value: '2x', label: 'Deployment Frequency', color: 'text-emerald-400' },
      { value: 'Happy', label: 'Developer Culture', color: 'text-purple-400' },
    ],
    highFidelity: {
      narrative: {
        badge: 'Engineering Ops :: 2026',
        titleLine1: 'Engineering',
        titleHighlight: 'Effectiveness',
        titleLine2: 'Defined by Data.',
        description: 'Engineering excellence isn\'t just about speed — it\'s about creating the right environment for developers to thrive. We use engineering intelligence to remove cognitive load and friction from the developer journey.',
        bottleneckLabel: 'The Friction',
        bottleneckText: 'Cognitive overload, "Meeting culture", and fragmented toolchains that kill flow.',
        requirementLabel: 'The Standard',
        requirementText: 'Platform engineering and AI-assistants that enable self-service and high developer flow.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
        statusLabel: 'Effectiveness Score',
        statusValue: 'Optimizing...'
      },
      philosophy: {
        icon: <Gauge className="w-7 h-7 text-brand-blue" />,
        title: 'Modern',
        titleHighlight: 'Excellence.',
        description: 'We believe in "Shifting Left" — integrating quality, security, and operations directly into the developer workflow through automation and better tooling.',
        pills: ['DevEx First', 'Automated Guardrails', 'Platform Engineering', 'Observability']
      },
      matrix: {
        engineId: 'Engine :: EffiFlow_v2',
        title: 'Effectiveness Matrix',
        subtext: 'Our framework for measuring and improving engineering output and happiness.',
        layers: [
          { title: 'Measure', id: 'EE_METR', icon: <Target />, desc: 'Establishing baselines with DORA, SPACE, and qualitative audits.' },
          { title: 'Standardize', id: 'EE_STAN', icon: <Shield />, desc: 'Implementing common standards and automated guardrails.' },
          { title: 'Accelerate', id: 'EE_ACCE', icon: <Zap />, desc: 'Deploying AI coding tools and internal developer platforms.' },
          { title: 'Sustain', id: 'EE_SUST', icon: <Activity />, desc: 'Continuous coaching and iterative practice improvement.' }
        ]
      },
      schematic: {
        titleLine1: 'Maximize',
        titleHighlight: 'Developer flow.',
        description: 'Stop guessing about your engineering performance. Start engineering success with data-driven effectiveness programs.',
        stats: [
          { label: 'Latency', val: 'MINIMIZED' },
          { label: 'Quality', val: 'INBUILT' },
          { label: 'Morale', val: 'ELEVATED' }
        ]
      }
    }
  };

  const department = {
    name: 'Digital Engineering',
    slug: 'digital-engineering',
    description: 'Build innovative products and platforms with modern engineering practices.'
  };

  return <ServicePageTemplate service={service} department={department} />;
};

export default ModernEngineeringEffectiveness;
