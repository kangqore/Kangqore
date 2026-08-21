import React from 'react';
import { Bot, Brain, Layers, Cpu, Zap, Activity, Search } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const AgenticAIInfusedApplications = () => {
  const service = {
    name: 'Agentic AI Infused Applications',
    slug: 'agentic-ai-infused-applications',
    shortDescription: 'Build next-gen autonomous AI applications',
    fullDescription: 'Leverage agentic AI to build applications that reason, plan, and execute complex tasks with minimal human intervention.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    keyFeatures: [
      'Autonomous agents',
      'Reasoning loops',
      'Tool use & API integration',
      'Multi-agent orchestration',
      'Self-improving feedback loops'
    ],
    primaryButton: { text: 'Deploy Agentic AI', link: '/contact' },
    secondaryButton: { text: 'View Use Cases', link: '#capabilities' },
    stats: [
      { value: '99%', label: 'Task Autonomy', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
      { value: '5x', label: 'Processing Speed', color: 'text-blue-400' },
      { value: '24/7', label: 'Autonomous Operation', color: 'text-emerald-400' },
      { value: 'Zero', label: 'Prompt Latency', color: 'text-purple-400' },
    ],
    highFidelity: {
      narrative: {
        badge: 'AI Evolution :: 2026',
        titleLine1: 'Autonomous',
        titleHighlight: 'Intelligence',
        titleLine2: 'at the Core.',
        description: 'Moving beyond simple chatbots, we engineer applications that possess agency — the ability to reason, decompose complex goals, and interact with tools to achieve business outcomes.',
        bottleneckLabel: 'The Constraint',
        bottleneckText: 'Static workflows and rigid rule-based systems that fail in dynamic environments.',
        requirementLabel: 'The Paradigm',
        requirementText: 'Goal-oriented agents that adapt and refine their strategies in real-time.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
        statusLabel: 'Agent State',
        statusValue: 'Thinking...'
      },
      philosophy: {
        icon: <Brain className="w-7 h-7 text-brand-blue" />,
        title: 'Agentic',
        titleHighlight: 'Productivity.',
        description: 'We focus on building "Compound AI Systems" where autonomous agents orchestrate traditional software tools, APIs, and ML models to solve high-value problems.',
        pills: ['Reasoning Loops', 'Recursive Tasking', 'Memory Augmentation', 'Safety Guardrails']
      },
      matrix: {
        engineId: 'Engine :: AgentFlow_v1',
        title: 'Cognitive Matrix',
        subtext: 'Our architecture for building agentic applications, from perception to execution.',
        layers: [
          { title: 'Perceive', id: 'AG_PERC', icon: <Search />, desc: 'Ingesting multi-modal data and environmental context.' },
          { title: 'Reason', id: 'AG_PLAN', icon: <Layers />, desc: 'Decomposing goals into actionable sub-tasks using LLMs.' },
          { title: 'Act', id: 'AG_EXEC', icon: <Zap />, desc: 'Executing tool calls, API interactions, and code generation.' },
          { title: 'Learn', id: 'AG_OBSV', icon: <Activity />, desc: 'Continuous feedback loops for strategy refinement.' }
        ]
      },
      schematic: {
        titleLine1: 'Deploy',
        titleHighlight: 'Agency.',
        description: 'Empower your enterprise with applications that don\'t just follow instructions, but achieve objectives autonomously.',
        stats: [
          { label: 'Autonomy', val: 'MAXIMAL' },
          { label: 'Accuracy', val: 'PRECISION' },
          { label: 'Scale', val: 'ELASTIC' }
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

export default AgenticAIInfusedApplications;
