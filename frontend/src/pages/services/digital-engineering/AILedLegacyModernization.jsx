import React from 'react';
import { RefreshCw, Code2, Database, Layers, Zap, Activity, Shield } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const AILedLegacyModernization = () => {
  const service = {
    name: 'AI-Led Legacy Modernization',
    slug: 'ai-led-legacy-modernization',
    shortDescription: 'Modernize legacy systems using AI-powered automation',
    fullDescription: 'Accelerate the transformation of legacy codebases, monoliths, and outdated architectures into modern, cloud-native systems using advanced AI refactoring models.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
    keyFeatures: [
      'Automated code refactoring',
      'Monolith to Microservices translation',
      'Legacy knowledge extraction',
      'Automated unit test generation',
      'Technical debt visualization'
    ],
    primaryButton: { text: 'Modernize Now', link: '/contact' },
    secondaryButton: { text: 'How it Works', link: '#capabilities' },
    stats: [
      { value: '70%', label: 'Time Reduction', color: 'text-cyan-400' },
      { value: 'Zero', label: 'Regression Defects', color: 'text-blue-400' },
      { value: '60%', label: 'Cost Savings', color: 'text-emerald-400' },
      { value: 'AI', label: 'Powered Discovery', color: 'text-purple-400' },
    ],
    highFidelity: {
      narrative: {
        badge: 'Transformation :: 2026',
        titleLine1: 'Legacy',
        titleHighlight: 'Reinvented',
        titleLine2: 'by AI.',
        description: 'Legacy systems shouldn\'t be a liability. We use Large Language Models (LLMs) specialized in legacy syntax to rapidly translate and refactor ancient code into clean, modern architectures.',
        bottleneckLabel: 'The Inertia',
        bottleneckText: 'Unreadable spaghetti code, missing documentation, and fragile dependencies.',
        requirementLabel: 'The Strategy',
        requirementText: 'Automated extraction of business logic and recursive refactoring into modern stacks.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
        statusLabel: 'Modernization State',
        statusValue: 'Refactoring...'
      },
      philosophy: {
        icon: <RefreshCw className="w-7 h-7 text-brand-blue" />,
        title: 'Legacy',
        titleHighlight: 'Liberation.',
        description: 'We don\'t just "lift and shift." Our AI-led approach performs deep semantic analysis to ensure the new architecture is truly modern, not just a mirror of the old mess.',
        pills: ['Static Analysis', 'Code Translation', 'Architecture Synthesis', 'Safe De-commissioning']
      },
      matrix: {
        engineId: 'Engine :: ModFlow_v3',
        title: 'Modernization Matrix',
        subtext: 'Our AI-powered workflow for liberating your legacy core.',
        layers: [
          { title: 'Discover', id: 'LM_DISC', icon: <Search />, desc: 'AI-driven mapping of undocumented business logic and flows.' },
          { title: 'Refactor', id: 'LM_REFC', icon: <Code2 />, desc: 'Automated conversion of legacy code to modern frameworks.' },
          { title: 'Validate', id: 'LM_VALI', icon: <Shield />, desc: 'Automated testing and verification against parity metrics.' },
          { title: 'Optimize', id: 'LM_OPTI', icon: <Zap />, desc: 'Performance tuning for cloud-native runtime environments.' }
        ]
      },
      schematic: {
        titleLine1: 'Exit',
        titleHighlight: 'Technical Debt.',
        description: 'Turn your legacy burden into a modern competitive advantage with Kangqore\'s AI-led liberation engine.',
        stats: [
          { label: 'Safety', val: 'GUARANTEED' },
          { label: 'Velocity', val: 'UP TO 5X' },
          { label: 'Complexity', val: 'DECODED' }
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

export default AILedLegacyModernization;
