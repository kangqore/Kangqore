import React from 'react';
import { Zap, Search, Layers, Activity, ShieldCheck } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const ECMSolutions = () => {
  // ============================================
  // SERVICE INFORMATION
  // Edit below to customize this service page
  // ============================================
  
  const service = {
    name: 'ECM Solutions',
    slug: 'ecm-solutions',
    shortDescription: 'Enterprise content management solutions',
    fullDescription: 'Implement ECM solutions for document management and content workflows.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
        highFidelity: {
      narrative: {
        badge: 'Enterprise Excellence :: 2026',
        titleLine1: 'Enterprise',
        titleHighlight: 'ECM Solutions.',
        titleLine2: 'At Scale.',
        description: 'We design and deliver ECM Solutions solutions that move beyond incremental improvement — embedding capability, governance, and measurable business value into every engagement.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Fragmented delivery and misaligned strategy limiting enterprise impact.',
        requirementLabel: 'The Requirement',
        requirementText: 'Governed, integrated, and outcome-assured ECM Solutions delivery.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        statusLabel: 'Delivery',
        statusValue: 'Optimized'
      },
      philosophy: {
        icon: <Zap className="w-7 h-7 text-brand-blue" />,
        title: 'ECM Solutions',
        titleHighlight: 'Outcome-First Design.',
        description: 'We believe every ECM Solutions engagement should deliver compounding enterprise value — not just deliverables, but lasting organizational capability.',
        pills: ['Outcome-Led', 'Governed', 'Scalable', 'ROI-Focused']
      },
      matrix: {
        engineId: 'Engine :: ECM-SOLU_V3',
        title: 'Enablement Matrix',
        subtext: 'Our ECM Solutions lifecycle deconstructed into modular, governed, enterprise-grade delivery layers.',
        layers: [
          { title: 'Assess', id: 'ECM-_ASSESS', icon: <Search />, desc: 'Discovery, assessment, and strategic alignment.' },
          { title: 'Design', id: 'ECM-_DESIGN', icon: <Layers />, desc: 'Architecture design and solution planning.' },
          { title: 'Deliver', id: 'ECM-_DEL', icon: <Activity />, desc: 'Structured implementation and delivery.' },
          { title: 'Govern', id: 'ECM-_GOV', icon: <ShieldCheck />, desc: 'Governance, monitoring, and continuous optimization.' }
        ]
      },
      schematic: {
        titleLine1: 'Deliver',
        titleHighlight: 'Value.',
        description: 'Your ECM Solutions investment should generate compounding business returns. We engineer the delivery frameworks that make it measurable and sustained.',
        stats: [
          { label: 'Quality', val: 'ABSOLUTE' },
          { label: 'Speed', val: 'ACCELERATED' },
          { label: 'ROI', val: 'MEASURABLE' }
        ]
      }
    }
    };
  
  const department = {
    name: 'Enterprise Applications',
    slug: 'enterprise-applications',
    description: 'Transform your business with cutting-edge enterprise applications solutions.'
  };

  // ============================================
  // CUSTOM CONTENT SECTIONS
  // Add or modify content below as needed
  // ============================================

  // Additional service details (optional)
  const additionalInfo = {
    overview: `With deep expertise in enterprise applications, we deliver ecm solutions solutions that drive measurable business outcomes. Our approach combines industry best practices with cutting-edge technology to ensure your success.`,
    
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
          description: `Comprehensive analysis of your current state and ecm solutions requirements to identify opportunities.` 
        },
        { 
          heading: 'Roadmap Development', 
          description: `Create a detailed implementation roadmap aligned with your business objectives and timelines.` 
        },
        { 
          heading: 'Architecture Design', 
          description: `Design scalable and robust ecm solutions architecture tailored to your needs.` 
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
          description: `Iterative development approach ensuring flexibility and rapid delivery of ecm solutions solutions.` 
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
          description: `24/7 monitoring, maintenance, and support to ensure optimal ecm solutions performance.` 
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
          description: `Stay ahead with latest ecm solutions trends, updates, and innovation initiatives.` 
        }
      ]
    }
  ];

  // Custom FAQs for this service
  const customFAQs = [
    {
      question: `What is ECM Solutions and how can it benefit my organization?`,
      answer: `ECM Solutions helps organizations enterprise content management solutions. By implementing ecm solutions, you can improve efficiency, reduce costs, and gain competitive advantage.`
    },
    {
      question: `How long does a typical ecm solutions project take?`,
      answer: `Project duration varies based on scope and complexity. A typical engagement ranges from 8-16 weeks for initial implementation, with ongoing optimization. We work with you to define realistic timelines aligned with your business priorities.`
    },
    {
      question: `What industries do you serve for ecm solutions?`,
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
      description: `Years of experience delivering successful ecm solutions projects across industries.` 
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

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default ECMSolutions;
