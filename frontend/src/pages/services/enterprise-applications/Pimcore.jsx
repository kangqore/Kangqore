import React, { useEffect } from 'react';
import { Layers, Search, ShieldCheck, Activity, Server, Briefcase, Database, Sparkles, FileText, Image as ImageIcon, ShoppingCart, Monitor, BrainCircuit, Network } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  PimWhySection,
  PimValueAccordion,
  PimProblemsGrid,
  PimHowWeHelp,
  PimArchitectureSchematic,
  PimUseCasesCarousel,
  PimBenefitsGrid
} from '../../../components/services/platforms/PimcoreCustomSections';

gsap.registerPlugin(ScrollTrigger);

const Pimcore = () => {
  useEffect(() => {
    const animateCounters = () => {
      const statElements = document.querySelectorAll('.stat-counter-text');
      statElements.forEach((el) => {
        const text = el.textContent || '';
        const match = text.match(/([\d.]+)/);
        if (match) {
          const targetNum = parseFloat(match[1]);
          const suffix = text.replace(match[0], '');
          const counter = { val: 0 };
          ScrollTrigger.create({
            trigger: el, start: 'top 85%', once: true,
            onEnter: () => {
              gsap.to(counter, {
                val: targetNum, duration: 2, ease: 'power2.out',
                onUpdate: () => {
                  const rawVal = counter.val;
                  const numVal = typeof rawVal === 'number' ? rawVal : parseFloat(rawVal);
                  if (!isNaN(numVal)) {
                    const formattedVal = targetNum % 1 === 0 ? Math.round(numVal) : numVal.toFixed(1);
                    el.textContent = `${formattedVal}${suffix}`;
                  }
                }
              });
            }
          });
        }
      });
    };
    const timer = setTimeout(animateCounters, 500);
    return () => { clearTimeout(timer); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  // ============================================
  // SERVICE DATA
  // ============================================

  const service = {
    name: 'Pimcore Services',
    titleLine1: 'Pimcore',
    titleHighlight: 'Services.',
    slug: 'pimcore',
    shortDescription: 'Unify product, master, asset, commerce, and experience operations on one scalable foundation.',
    description: 'Kangqore helps enterprises use Pimcore to centralize fragmented product information, master data, digital assets, commerce workflows, and digital experiences into one more connected operating model. We combine platform strategy, implementation, integration, AI-enabled enrichment, workflow automation, and managed support to help organizations reduce silos, improve data quality, accelerate launches, and deliver more consistent customer experiences.',
    fullDescription: (
      <div className="space-y-4">
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore helps enterprises use Pimcore to centralize fragmented product information, master data, digital assets, commerce workflows, and digital experiences into one more connected operating model. We combine platform strategy, implementation, integration, AI-enabled enrichment, workflow automation, and managed support to help organizations reduce silos, improve data quality, accelerate launches, and deliver more consistent customer experiences.
        </p>
      </div>
    ),
    image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoBackground: '/videos/business-meeting-6774639.mp4',
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Schedule A Pimcore Assessment', link: '/contact' },
    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Enterprise Applications', link: '/department/enterprise-applications' },
      { label: 'Pimcore' }
    ],

    stats: [
      { value: 'Unify', label: 'Product, master, and digital asset data', color: 'text-cyan-400' },
      { value: 'Enrich', label: 'Data quality, workflows, and AI-assisted content', color: 'text-blue-400' },
      { value: 'Accelerate', label: 'Commerce, catalog, and launch operations', color: 'text-emerald-400' },
      { value: 'Personalize', label: 'Omnichannel experiences at scale', color: 'text-purple-400' },
    ],

    ctaTitle: "Ready to turn Pimcore into a real business platform?",
    ctaDescription: "Let's define the right Pimcore architecture, unify your data and experience layers, and build a platform model that improves governance, accelerates operations, and supports scalable growth.",
    ctaButtonText: "Schedule A Pimcore Assessment",

    // High Fidelity Content
    highFidelity: {
      narrative: {
        badge: "PIMCORE :: PLATFORM STRATEGY",
        titleLine1: "Centralizing",
        titleHighlight: "Enterprise",
        titleLine2: "Data & Experience",
        description: "Modern enterprises need more than scattered tools. They need a unifying platform for product data, master records, digital assets, commerce content, and customer experiences. Kangqore helps organizations use Pimcore to build that unified foundation with discipline and scale in mind.",
        bottleneckLabel: "The Data Chaos",
        bottleneckText: "Fragmented product data, disconnected master records, scattered digital assets, and siloed commerce systems create hidden operational drag, slower launches, weaker governance, and inconsistent customer experiences.",
        requirementLabel: "The Kangqore Way",
        requirementText: "A unified Pimcore foundation that connects product information, master data, digital assets, commerce operations, and experience delivery into one governed, scalable platform model.",
        image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=format&fit=crop&w=1260&q=80",
        statusLabel: "Platform Maturity",
        statusValue: "UNIFIED"
      },
      philosophy: {
        icon: <Database className="w-7 h-7 text-gray-900 dark:text-white" />,
        title: "Unify with Structure.",
        titleHighlight: "Scale with Governance.",
        description: "We replace fragmented data sprawl with a governed, connected platform model designed for enterprise-scale data, commerce, and experience operations.",
        pills: ['Data Governance', 'Platform Strategy', 'AI-Enrichment', 'Omnichannel Ready'],
        features: [
          { title: 'Data Unification', label: 'Connected Operating Layer', icon: <Database className="w-5 h-5 text-gray-400" />, content: 'Bring product information, master data, and digital assets into one governed foundation that serves the entire enterprise.' },
          { title: 'Workflow Discipline', label: 'Automated Enrichment', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Structure approval flows, data enrichment, publishing, and localization into repeatable, automated processes.' },
          { title: 'Commerce Continuity', label: 'Connected Experiences', icon: <ShoppingCart className="w-5 h-5 text-gray-400" />, content: 'Connect rich product data, media, pricing, and personalized content into more effective digital commerce journeys.' },
          { title: 'Platform Governance', label: 'Enterprise Control', icon: <ShieldCheck className="w-5 h-5 text-gray-400" />, content: 'Support auditability, access control, stewardship, and master-record discipline across the platform.' }
        ]
      },
      matrix: {
        engineId: 'Engine :: PIMCORE_V4',
        title: 'Our Execution Matrix.',
        subtext: 'A connected system for moving from data fragmentation to governed, scalable Pimcore operations.',
        layers: [
          { title: 'Assess', id: 'PIM_ASSESS', icon: <Search />, desc: 'Platform assessment, use-case discovery, and architecture alignment.' },
          { title: 'Design', id: 'PIM_DESIGN', icon: <Layers />, desc: 'Data modeling, workflow planning, governance design, and roadmap definition.' },
          { title: 'Implement', id: 'PIM_IMPL', icon: <Server />, desc: 'PIM, MDM, DAM, commerce, and DXP implementation with integration engineering.' },
          { title: 'Evolve', id: 'PIM_EVOLVE', icon: <Activity />, desc: 'Managed services, optimization, enhancement, and continuous platform evolution.' }
        ]
      },
      schematic: {
        titleLine1: 'Governed Data.',
        titleHighlight: 'Scalable Platform.',
        description: 'Your Pimcore investment should generate compounding business returns. We engineer the platform model that makes it measurable and sustained.',
        stats: [
          { label: 'Data Quality', val: 'GOVERNED' },
          { label: 'Time-to-Market', val: 'ACCELERATED' },
          { label: 'Platform Scale', val: 'EXTENSIBLE' }
        ]
      }
    },

    trustPillars: [
      { title: 'Unified product and master data layer', tag: 'Data', description: 'Centralize fragmented information into one governed, channel-ready source of truth.' },
      { title: 'AI-assisted enrichment and automation', tag: 'Intelligence', description: 'Use AI to improve product content, mapping, validation, and operational efficiency.' },
      { title: 'End-to-end commerce enablement', tag: 'Commerce', description: 'Connect PIM-first data foundations into scalable B2B and B2C commerce experiences.' },
      { title: 'Governed digital asset operations', tag: 'Assets', description: 'Manage media centrally with workflows, metadata, and brand-consistent delivery.' },
      { title: 'Omnichannel experience delivery', tag: 'Experience', description: 'Compose and deliver contextual digital experiences across channels with personalization.' },
      { title: 'Platform-led scalability', tag: 'Scale', description: 'Architect for multi-market, multilingual, and multi-channel growth from day one.' }
    ],

    whyKangqore: [
      { title: 'Platform-Led Thinking', description: 'We shape Pimcore around business workflows, data governance, and experience delivery—not around isolated feature configuration.', icon: BrainCircuit },
      { title: 'Built Across the Full Value Chain', description: 'From product data and master data to assets, commerce, and digital experience, we connect the full operating picture.', icon: Network },
      { title: 'Execution with Evolution in Mind', description: 'We design for adoption, scale, integration, and managed growth so the platform remains valuable after launch.', icon: Activity }
    ],

    industries: [
      { name: 'Manufacturing', description: 'Product data governance, multi-channel catalog management, and B2B commerce enablement.' },
      { name: 'Retail & Consumer Goods', description: 'Omnichannel product experiences, DAM centralization, and personalized shopping journeys.' },
      { name: 'Distribution & Wholesale', description: 'Unified product data, dealer portals, and eStore platform enablement.' },
      { name: 'Healthcare & Life Sciences', description: 'Regulated content management, master data governance, and compliant digital experiences.' }
    ],

    // UI Structure Slots
    preMatrixSection: null,
    customSections: null,
    postCapabilitiesSections: (
      <div className="flex flex-col w-full">
        <PimWhySection />
        <PimValueAccordion />
        <PimProblemsGrid />
        <PimHowWeHelp />
        <PimArchitectureSchematic />
        <PimUseCasesCarousel />
        <PimBenefitsGrid />
      </div>
    ),
    postFAQSections: null
  };

  const department = {
    name: 'Enterprise Applications',
    slug: 'enterprise-applications',
    description: 'Transform your business with cutting-edge enterprise applications solutions.',
    icon: <Briefcase className="w-6 h-6" />
  };

  // ============================================
  // CAPABILITIES (6 Pimcore Products)
  // ============================================

  const capabilities = [
    {
      title: 'Product Information Management + GenAI',
      description: 'Kangqore helps enterprises combine Pimcore PIM with Generative AI to improve the speed and quality of product content operations. This can support enrichment, description generation, onboarding acceleration, data validation, and better consistency across large catalogs and multi-market environments.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'AI-assisted product content generation',
        'Product data accuracy and completeness improvement',
        'Automated mapping, validation, and onboarding support',
        'Localized and more consistent product experiences'
      ],
      micro: 'Use AI to enrich product data faster.'
    },
    {
      title: 'Product Information Management (PIM)',
      description: 'We help organizations turn fragmented product information into a governed, channel-ready product operating model. Kangqore uses Pimcore PIM to improve catalog quality, accelerate launch cycles, streamline approvals, and support richer product storytelling across digital touchpoints.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Product-data modeling and enrichment',
        'Workflow and approval automation',
        'ERP, CRM, supplier, and channel integration',
        'Localization and omnichannel publishing support'
      ],
      micro: 'Centralize and govern product information.'
    },
    {
      title: 'Master Data Management (MDM)',
      description: 'Kangqore helps enterprises use Pimcore MDM to reduce duplication, improve governance, and unify fragmented master data across domains. The outcome is a stronger source of truth for business operations, analytics, compliance, and decision-making.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Golden-record management',
        'Multi-domain master data support',
        'Governance and stewardship workflows',
        'Better integration with enterprise systems'
      ],
      micro: 'Create trusted, unified master records.'
    },
    {
      title: 'Digital Asset Management (DAM)',
      description: 'We help brands use Pimcore DAM to manage media assets more intelligently across teams, channels, and campaigns. Kangqore structures DAM around discoverability, reuse, governance, workflow, and scalable content operations so experiences stay consistent without slowing teams down.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Metadata and tagging frameworks',
        'Asset portals and self-service access',
        'Editorial workflow and lifecycle control',
        'Media transformation and multi-format delivery'
      ],
      micro: 'Centralize, govern, and reuse digital assets.'
    },
    {
      title: 'eCommerce',
      description: 'Kangqore uses Pimcore\'s commerce framework to help businesses connect catalog depth, pricing complexity, content, and customer experience into stronger digital commerce journeys. This is especially valuable when product complexity, regional variation, or B2B workflows outgrow simpler commerce stacks.',
      bgImage: '/images/capabilities/ecommerce.png',
      items: [
        'B2B and B2C commerce architecture',
        'PIM-first commerce foundations',
        'Content commerce and storefront enablement',
        'Omnichannel shopping and product experience support'
      ],
      micro: 'Build data-rich, scalable commerce experiences.'
    },
    {
      title: 'Digital Experience Platform (DXP / CMS)',
      description: 'We help organizations use Pimcore DXP to manage and deliver more adaptive digital experiences across websites, portals, campaigns, and customer interactions. Kangqore focuses on making experience delivery more flexible, scalable, and responsive to changing customer expectations.',
      bgImage: '/images/capabilities/ux-design.png',
      items: [
        'Headless or hybrid content delivery models',
        'AI-driven personalization strategy',
        'Contextual engagement across touchpoints',
        'Experience orchestration with scale in mind'
      ],
      micro: 'Compose contextual digital experiences.'
    }
  ];

  const technologies = [
    { category: 'Pimcore Core', items: ['PIM', 'MDM', 'DAM', 'eCommerce', 'DXP/CMS', 'Data Hub'] },
    { category: 'Integration & APIs', items: ['REST APIs', 'GraphQL', 'MuleSoft', 'Apache Kafka', 'RabbitMQ', 'Custom Connectors'] },
    { category: 'Cloud & Infrastructure', items: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform'] },
    { category: 'Commerce Platforms', items: ['Shopify', 'Magento', 'SAP Commerce', 'Salesforce Commerce', 'BigCommerce'] },
    { category: 'Enterprise Systems', items: ['SAP', 'Salesforce', 'Microsoft Dynamics', 'Oracle', 'NetSuite', 'HubSpot'] },
    { category: 'AI & Enrichment', items: ['OpenAI', 'Azure AI', 'Google Vertex AI', 'Custom ML Models', 'NLP Pipelines'] }
  ];

  const customFAQs = [
    {
      question: 'What is Pimcore and why do enterprises use it?',
      answer: 'Pimcore is used to centralize and manage product information, digital assets, master data, commerce content, and digital experiences in one connected platform environment.'
    },
    {
      question: 'What Pimcore services does Kangqore provide?',
      answer: 'Kangqore provides strategy, implementation, integration, AI-assisted enrichment, workflow design, and managed services across the Pimcore ecosystem.'
    },
    {
      question: 'Can Pimcore support both B2B and B2C use cases?',
      answer: 'Yes. It is well suited to product-rich, catalog-heavy, content-connected digital commerce and experience use cases across both B2B and B2C environments.'
    },
    {
      question: 'Can Pimcore integrate with ERP, CRM, eCommerce, and marketplace systems?',
      answer: 'Yes. A strong Pimcore engagement should include secure, scalable integration patterns across the broader enterprise stack.'
    },
    {
      question: 'Is Pimcore suitable for global catalogs and multi-market operations?',
      answer: 'Yes, especially when multilingual product data, localization, workflow governance, and cross-channel publishing are important.'
    },
    {
      question: 'How does AI fit into the Pimcore model?',
      answer: 'AI can help with product-content generation, enrichment, mapping, validation, personalization, and operational efficiency when used in the right business context.'
    },
    {
      question: 'What is the difference between PIM and MDM inside the Pimcore ecosystem?',
      answer: 'PIM focuses on product information and channel-ready enrichment, while MDM focuses more broadly on trusted core records across multiple enterprise domains.'
    },
    {
      question: 'How do you ensure Pimcore stays valuable after go-live?',
      answer: 'Through governance, integration discipline, workflow optimization, performance support, managed services, and a roadmap for continuous platform evolution.'
    }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities Across Pimcore Products.',
      capabilitiesDescription: 'Kangqore\'s Pimcore capabilities are designed to help enterprises connect product data, master data, digital assets, commerce operations, and digital experiences into one more coherent platform model. We combine architecture, platform implementation, workflow design, integration engineering, AI-assisted enrichment, and managed operations to help organizations unlock Pimcore as a true business enabler—not just a system deployment.',
      capabilities,
      trustPillars: service.trustPillars,
      whyKangqore: service.whyKangqore,
      industries: service.industries,
      preMatrixSection: service.preMatrixSection,
      customSections: service.customSections,
      postCapabilitiesSections: service.postCapabilitiesSections,
      postFAQSections: service.postFAQSections,
      customFAQs
    },
    department
  };

  return (
    <div className="pimcore-page-override">
      <style dangerouslySetInnerHTML={{__html: `
        .stat-counter-text { font-variant-numeric: tabular-nums; }
        .pimcore-page-override > div > section { position: relative; z-index: 5; background-color: inherit; }

      `}} />
      <ServicePageTemplate
        service={pageData.service}
        department={department}
      />
    </div>
  );
};

export default Pimcore;
