import React from 'react';
import { Activity, Layers, Search, ShieldCheck, Zap } from 'lucide-react';;
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const AutomationTesting = () => {
  // ============================================
  // SERVICE INFORMATION
  // Edit below to customize this service page
  // ============================================
  
  const service = {
    name: 'Automation Testing',
    slug: 'automation-testing',
    shortDescription: 'Automated testing for software quality assurance',
    fullDescription: 'Implement test automation frameworks and practices for faster, more reliable testing.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    stats: [
      { value: 'Zero', label: 'Regression Leaks', color: 'text-cyan-400' },
      { value: '5X', label: 'Test Velocity', color: 'text-blue-400' },
      { value: '99%', label: 'Code Coverage', color: 'text-emerald-400' },
      { value: 'Hardened', label: 'Build Integrity', color: 'text-purple-400' },
    ],
    primaryButton: { text: "Talk To Our Experts", link: "/contact" },
    secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
    highFidelity: {
      narrative: {
        badge: 'Quality Engineering :: 2026',
        titleLine1: 'Engineer',
        titleHighlight: 'Trust.',
        titleLine2: 'Validate Scale.',
        description: 'Manual testing is the bottleneck of modern delivery. We help you build a hardened, automated validation fabric that ensures every release is production-ready, security-verified, and bug-free.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Slow release cycles, regression debt, and unstable builds.',
        requirementLabel: 'The Requirement',
        requirementText: 'Shift-left, continuous, and highly-available test suites.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
        statusLabel: 'Build Health',
        statusValue: 'Verified'
      },
      philosophy: {
        icon: <ShieldCheck className="w-7 h-7 text-brand-blue" />,
        title: 'Testing',
        titleHighlight: 'Integrity-First.',
        description: 'We believe that quality is not an afterthought, but an engineering discipline. Our "Shift-Left" approach embeds automated validation into every stage of the lifecycle.',
        pills: ['Behavior Driven', 'API First', 'Hardened Security', 'Visual AI']
      },
      matrix: {
        engineId: 'Engine :: Test_Aria_V3',
        title: 'Enablement Matrix',
        subtext: 'Our comprehensive automation testing deconstructed into modular, high-fidelity validation layers.',
        layers: [
          { title: 'Deconstruct', id: 'QA_STRAT', icon: <Search />, desc: 'Test strategy and coverage mapping.' },
          { title: 'Architect', id: 'QA_ARCH', icon: <Layers />, desc: 'Designing resilient test automation frameworks.' },
          { title: 'Execute', id: 'QA_RUN', icon: <Zap />, desc: 'High-speed execution across browsers and platforms.' },
          { title: 'Monitor', id: 'QA_DLV', icon: <Activity />, desc: 'Real-time reporting and build integrity telemetry.' }
        ]
      },
      schematic: {
        titleLine1: 'Deploy',
        titleHighlight: 'Confidence.',
        description: 'Your builds should be bulletproof. We ensure they stay that way through precision validation.',
        stats: [
          { label: 'Quality', val: 'ABSOLUTE' },
          { label: 'Speed', val: 'VELOCITY' },
          { label: 'Reliability', val: 'HARDENED' }
        ]
      }
    }
  };
  
  const department = {
    name: 'Automation',
    slug: 'automation',
    description: 'Transform your business with cutting-edge automation solutions.'
  };

  // ============================================
  // CUSTOM CONTENT SECTIONS
  // Add or modify content below as needed
  // ============================================

  // Additional service details (optional)
  const additionalInfo = {
    overview: `With deep expertise in automation, we deliver automation testing solutions that drive measurable business outcomes. Our approach combines industry best practices with cutting-edge technology to ensure your success.`,
    
    // You can add custom benefits here
    benefits: [
      'Accelerated time to value',
      'Reduced operational costs',
      'Improved efficiency and productivity',
      'Scalable solutions that grow with your business'
    ],
    
    // Add specific use cases or success stories
    useCases: [
      'Enterprise-scale implementations',
      'Digital transformation initiatives',
      'Legacy system modernization',
      'Cloud migration and optimization'
    ]
  };

  // Technologies and tools (customize as needed)
  const technologies = [
    'AWS',
    'Azure',
    'Google Cloud',
    'Kubernetes',
    'Docker',
    'Python',
    'React',
    'Node.js',
    'TensorFlow',
    'MongoDB'
  ];

  // ============================================
  // OUR CAPABILITIES (Fully Editable)
  // Customize the three capability categories below
  // ============================================
  
  const capabilities = [
    {
      title: 'Strategy & Planning',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        { 
          heading: 'Assessment & Discovery', 
          description: `Comprehensive analysis of your current state and automation testing requirements to identify opportunities.` 
        },
        { 
          heading: 'Roadmap Development', 
          description: `Create a detailed implementation roadmap aligned with your business objectives and timelines.` 
        },
        { 
          heading: 'Architecture Design', 
          description: `Design scalable and robust automation testing architecture tailored to your needs.` 
        },
        { 
          heading: 'Business Case Development', 
          description: `Build compelling business cases with ROI projections and success metrics.` 
        }
      ]
    },
    {
      title: 'Implementation & Delivery',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        { 
          heading: 'Agile Development', 
          description: `Iterative development approach ensuring flexibility and rapid delivery of automation testing solutions.` 
        },
        { 
          heading: 'Integration Services', 
          description: `Seamless integration with existing systems, APIs, and third-party platforms.` 
        },
        { 
          heading: 'Quality Assurance', 
          description: `Rigorous testing protocols ensuring reliability, performance, and security standards.` 
        },
        { 
          heading: 'Change Management', 
          description: `Comprehensive change management and user adoption programs for successful transitions.` 
        }
      ]
    },
    {
      title: 'Operations & Optimization',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        { 
          heading: 'Managed Services', 
          description: `24/7 monitoring, maintenance, and support to ensure optimal automation testing performance.` 
        },
        { 
          heading: 'Performance Optimization', 
          description: `Continuous performance tuning and optimization to maximize efficiency and value.` 
        },
        { 
          heading: 'Analytics & Insights', 
          description: `Data-driven insights and reporting to track KPIs and identify improvement opportunities.` 
        },
        { 
          heading: 'Continuous Innovation', 
          description: `Stay ahead with latest automation testing trends, updates, and innovation initiatives.` 
        }
      ]
    }
  ];

  // Custom FAQs for this service
  const customFAQs = [
    {
      question: `What is Automation Testing and how can it benefit my organization?`,
      answer: `Automation Testing helps organizations automated testing for software quality assurance. By implementing automation testing, you can improve efficiency, reduce costs, and gain competitive advantage.`
    },
    {
      question: `How long does a typical automation testing project take?`,
      answer: `Project duration varies based on scope and complexity. A typical engagement ranges from 8-16 weeks for initial implementation, with ongoing optimization. We work with you to define realistic timelines aligned with your business priorities.`
    },
    {
      question: `What industries do you serve for automation testing?`,
      answer: `We serve clients across all major industries including Banking, Healthcare, Retail, Manufacturing, Technology, and more. Our industry-specific expertise ensures solutions are tailored to your sector's unique requirements.`
    },
    {
      question: 'How do you ensure successful delivery?',
      answer: 'We follow a proven methodology combining agile practices, quality assurance, and change management. Regular checkpoints, transparent communication, and dedicated project management ensure successful outcomes.'
    },
    {
      question: 'What post-implementation support do you offer?',
      answer: 'We provide comprehensive support including 24/7 technical assistance, regular health checks, optimization recommendations, and training. Our team remains engaged to ensure you maximize value from your investment.'
    }
  ];

  // ============================================
  // WHY KANGQORE (Fully Editable)
  // Customize the reasons to choose Kangqore
  // ============================================
  
  const whyKangqore = [
    { 
      title: 'Proven Expertise', 
      description: `Years of experience delivering successful automation testing projects across industries.` 
    },
    { 
      title: 'Tailored Solutions', 
      description: 'Customized approaches that address your unique business challenges and goals.' 
    },
    { 
      title: 'Dedicated Team', 
      description: 'Access to certified professionals with deep domain expertise.' 
    },
    { 
      title: 'Innovation Focus', 
      description: 'Leveraging latest technologies and best practices for optimal results.' 
    },
    { 
      title: 'Global Delivery', 
      description: 'Scalable delivery model with resources across multiple geographies.' 
    },
    { 
      title: 'Quality Assurance', 
      description: 'Rigorous quality standards and proven methodologies ensure success.' 
    }
  ];

  // ============================================
  // INDUSTRY EXPERTISE (Fully Editable)
  // Customize the industries you serve
  // ============================================
  
  const industries = [
    { name: 'Banking & Financial Services' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Retail & Consumer Goods' },
    { name: 'Manufacturing' },
    { name: 'Technology' },
    { name: 'Professional Services' },
    { name: 'Telecommunications' },
    { name: 'Energy & Utilities' },
    { name: 'Education' },
    { name: 'Government' },
    { name: 'Transportation & Logistics' },
    { name: 'Media & Entertainment' }
  ];

  // Combine all data for the template
  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      additionalInfo,
      customFAQs,
      whyKangqore,
      industries
    },
    department
  };

  return (
    <ServicePageTemplate 
      service={pageData.service} 
      department={department} 
      primaryButton={pageData.service.primaryButton}
      secondaryButton={pageData.service.secondaryButton}
    />
  );
};

export default AutomationTesting;
