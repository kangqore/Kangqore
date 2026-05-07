import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  SalesforceWhySection,
  SalesforceValueDeliver,
  SalesforceDeliveryModel,
  SalesforcePhilosophyBackground,
  SalesforceDiamondCoESection,
  SalesforceArchitectureShowcase,
  SalesforceExecutionEcosystem,
  SalesforceFutureReadySection
} from './components/SalesforceCustomSections';
import { 
    Cloud, 
    CheckCircle2, 
    RefreshCw, 
    Zap,
    Search, 
    Layers, 
    Server, 
    Activity, 
    TrendingUp, 
    Headset, 
    Megaphone, 
    ShoppingCart, 
    Rocket, 
    Network, 
    Database, 
    ShieldCheck, 
    Briefcase,
    Layout,
    Users,
    LineChart,
    MousePointer2,
    Shield
} from 'lucide-react';

const Salesforce = () => {
  // ============================================
  // SERVICE DATA
  // ============================================
  
  const service = {
    name: 'Salesforce Services',
    titleLine1: 'Salesforce',
    titleHighlight: 'Services.',
    slug: 'salesforce',
    shortDescription: 'Transform customer journeys, service operations, sales execution, commerce, and marketing on one connected platform.',
    description: 'Kangqore helps enterprises turn Salesforce into a true growth and relationship platform. We combine strategy, implementation, integration, migration, customization, Lightning modernization, and cloud-specific execution across Sales, Service, Community, Commerce, and Marketing Cloud to create more connected customer experiences, faster operations, stronger team productivity, and measurable business outcomes.',
    fullDescription: (
      <div className="space-y-4">
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore helps enterprises turn Salesforce into a true growth and relationship platform. We combine strategy, implementation, integration, migration, customization, Lightning modernization, and cloud-specific execution across Sales, Service, Community, Commerce, and Marketing Cloud to create more connected customer experiences, faster operations, stronger team productivity, and measurable business outcomes.
        </p>
      </div>
    ),
    image: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoBackground: '/videos/business-meeting-6774639.mp4', 
    primaryButton: { text: 'Schedule A Salesforce Assessment', link: '/contact' },
    secondaryButton: { text: 'Talk To Our Experts', link: '#capabilities' },
    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Enterprise Applications', link: '/department/enterprise-applications' },
      { label: 'Salesforce Services' }
    ],
    
    stats: [
      { value: 'Connect', label: 'Customers, teams, channels, and systems', color: 'text-cyan-400' },
      { value: 'Sell', label: 'Pipeline, forecasting, and opportunity velocity', color: 'text-blue-400' },
      { value: 'Serve', label: 'Faster support, better case handling, higher loyalty', color: 'text-emerald-400' },
      { value: 'Personalize', label: 'Journeys, campaigns, and commerce experiences', color: 'text-purple-400' },
    ],

    ctaTitle: "Ready to turn Salesforce into a connected growth platform for your business?",
    ctaDescription: "Let’s design the right Salesforce architecture, modernize the right workflows, and build a platform model that improves sales execution, service quality, commerce continuity, and customer engagement at scale.",
    ctaButtonText: "Schedule A Salesforce Assessment",

    // High Fidelity Content (Matches Software Development Benchmark)
    highFidelity: {
      narrative: {
        badge: "SALESFORCE :: CONNECTED OPERATIONS",
        titleLine1: "Connect every",
        titleHighlight: "Customer",
        titleLine2: "Touchpoint",
        description: "Customer growth slows when sales, service, engagement, and commerce operate in disconnected silos. Kangqore connects your Salesforce ecosystem to orchestrate value across the entire lifecycle.",
        bottleneckLabel: "The Challenge",
        bottleneckText: "Disconnected systems, fragmented customer views, manual processes, and weak workflow continuity reduce sales momentum, service quality, and marketing effectiveness.",
        requirementLabel: "The Advantage",
        requirementText: "A well-architected Salesforce ecosystem improves customer visibility, process orchestration, speed-to-response, cross-functional collaboration, and experience consistency.",
        image: "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=format&fit=crop&w=1260&q=80",
        statusLabel: "Platform Synergy",
        statusValue: "100% CONNECTED"
      },
      philosophy: {
        icon: <Cloud className="w-7 h-7 text-gray-900 dark:text-white" />,
        title: "Connect with Clarity.",
        titleHighlight: "Scale with Purpose.",
        description: "We replace fragmented CRM silos with a unified, connected Salesforce ecosystem designed for long-term growth and operational excellence.",
        bgElement: <SalesforcePhilosophyBackground />,
        pills: ['Strategy-First', 'Connected Clouds', 'Modernized UX', 'Governed Data'],
        features: [
          { title: 'Connected Strategy', label: 'Outcome-Driven Planning', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'Design Salesforce around revenue, service, and engagement outcomes—not just isolated cloud module activation.' },
          { title: 'Experience Design', label: 'Low-Friction Productivity', icon: <Layout className="w-5 h-5 text-gray-400" />, content: 'Modernize how your teams interact with the platform through Lightning-led UX, custom LWC, and mobile-optimized flows.' },
          { title: 'Integration Rigor', label: 'Ecosystem Connectivity', icon: <Network className="w-5 h-5 text-gray-400" />, content: 'Connect Salesforce to ERP, legacy systems, and external apps so information flows reliably across the whole enterprise.' },
          { title: 'Governed Evolution', label: 'Scalable Platform Maturity', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Treat Salesforce as a living asset that matures through continuous improvement, performance oversight, and roadmap discipline.' }
        ]
      },
      matrix: {
        engineId: 'Engine :: SF_V2',
        title: 'Our Salesforce Matrix.',
        subtext: 'A structured model for moving from cloud silos to a connected, scalable ecosystem.',
        layers: [
          { title: 'Assess', id: 'SF_ASS', icon: <Search />, desc: 'Assess customer journeys, cloud-fit, and process gaps to define the right Salesforce transformation roadmap.' },
          { title: 'Architect', id: 'SF_ARC', icon: <Layers />, desc: 'Design the solution model, data flows, and experience architecture for a connected, adopted platform.' },
          { title: 'Implement', id: 'SF_IMP', icon: <Server />, desc: 'Configure, integrate, and launch with precision across Sales, Service, Marketing, and Commerce cloud.' },
          { title: 'Optimize', id: 'SF_OPT', icon: <Activity />, desc: 'Sustain momentum through continuous refinement, analytics improvement, and roadmap execution.' }
        ]
      },
      schematic: {
        titleLine1: 'Connected Value.',
        titleHighlight: 'Sustainable Growth.',
        description: 'Your Salesforce environment is a growth engine. We engineer it to scale with your business—across every cloud module and customer milestone.',
        stats: [
          { label: 'Adoption Rate', val: '+45%' },
          { label: 'Sales Velocity', val: '+30%' },
          { label: 'Service Speed', val: '+50%' }
        ]
      }
    },

    trustPillars: [
      { title: 'Business-Led CRM Thinking', tag: 'Strategy', description: 'We design Salesforce around revenue, service, engagement, and operating outcomes—not isolated feature activation.' },
      { title: 'Connected Execution Across Clouds', tag: 'Ecosystem', description: 'We connect Sales, Service, Community, Commerce, and Marketing Cloud into a more coherent enterprise model.' },
      { title: 'Modernization with Control', tag: 'Architecture', description: 'From Lightning modernization to integration and migration, we reduce disruption while improving long-term value.' }
    ],
    whyKangqore: [
      { title: 'Business-Led CRM Thinking', description: 'We design Salesforce around revenue, service, engagement, and operating outcomes—not isolated feature activation.', icon: Zap },
      { title: 'Connected Execution Across Clouds', description: 'We connect Sales, Service, Community, Commerce, and Marketing Cloud into a more coherent enterprise model.', icon: Cloud },
      { title: 'Modernization with Control', description: 'From Lightning modernization to integration and migration, we reduce disruption while improving long-term platform value.', icon: CheckCircle2 }
    ],
    industries: [
      { name: 'Financial Services', description: 'Unified customer views and strict security across banking and insurance operations.' },
      { name: 'Retail & Commerce', description: 'Omnichannel personalization bridging Commerce Cloud and Marketing Cloud.' },
      { name: 'Manufacturing', description: 'Streamlined B2B sales pipelines and responsive dealer/partner communities.' },
      { name: 'Healthcare', description: 'Connected patient journeys prioritizing compliance and fast service response.' }
    ],
    
    // Premium Capabilities configured for the ServicePageTemplate Carousel
    capabilitiesTitle: 'Our Capabilities.',
    capabilitiesDescription: 'Kangqore provides comprehensive digital transformation services that empower organizations to foster agility, enhance customer experience, and spur business transformation. Our services leverage advanced technology enablers such as AI, Cloud, Automation, and Advanced Analytics to modernize operations, unlock actionable insights, and scale up quickly.',
    capabilities: [
      {
        title: 'Salesforce Strategy & Advisory',
        description: 'This capability is focused on making better decisions before implementation begins. Kangqore works with stakeholders to understand customer journeys, process gaps, operating friction, and transformation priorities, then translates that into a practical Salesforce roadmap. Instead of jumping straight into tools or cloud modules, we define what should be implemented, in what sequence, and why it matters to business outcomes.',
        bgImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80',
        items: ['Business process and CRM assessment', 'Cloud-fit and capability mapping', 'Operating model and roadmap design', 'Prioritization for speed and value'],
        micro: 'Shape the right Salesforce roadmap before complexity, cost, and customization begin to compound. We help organizations align business goals, customer operations, and platform decisions early so Salesforce is designed with clarity, not guesswork.'
      },
      {
        title: 'Salesforce Implementations',
        description: 'This capability covers end-to-end Salesforce implementation across key business functions. Kangqore configures the platform in a way that respects standard Salesforce strengths while tailoring the setup to real business workflows, user needs, and operational priorities. The goal is not only to go live, but to ensure the platform is actually usable, scalable, and ready to support team adoption from day one.',
        bgImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
        items: ['OOB configuration and solution setup', 'Business-specific implementation planning', 'Cloud rollout across functional teams', 'Adoption-ready deployment execution'],
        micro: 'Launch Salesforce clouds with the right mix of standard configuration and business-fit customization. We help enterprises move from platform intent to real operational use with cleaner setup, stronger adoption, and faster delivery confidence.'
      },
      {
        title: 'Salesforce Integrations',
        description: 'Salesforce becomes far more valuable when it is connected to the systems around it. Kangqore helps enterprises integrate Salesforce with ERP platforms, legacy systems, customer-facing apps, middleware layers, partner systems, and external tools so information flows more reliably across the business. This improves visibility, reduces duplication, and supports more connected experiences across sales, service, and engagement functions.',
        bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        items: ['API-led and middleware integration', 'OOB connectors and AppExchange connectivity', 'Legacy and third-party system integration', 'Multi-channel process continuity'],
        micro: 'Connect Salesforce cleanly into enterprise platforms, channels, and data flows. We design integration models that reduce siloed operations, improve data continuity, and help Salesforce work as part of the wider digital ecosystem.'
      },
      {
        title: 'Salesforce Data Migration',
        description: 'Migration is not just about moving records from one place to another. It requires careful analysis of source structures, target models, data quality issues, duplication risks, and business-critical dependencies. Kangqore approaches Salesforce migration as a structured transformation exercise—helping ensure the new environment starts with cleaner, more reliable, and more usable data that supports both users and downstream processes.',
        bgImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80',
        items: ['Org-to-org and legacy-to-cloud migration', 'Data model difference analysis', 'Deduplication and integrity assurance', 'Fast, reliable migration execution'],
        micro: 'Move data with stronger integrity, consistency, and transformation discipline. We help organizations migrate from older environments into Salesforce without compromising trust, usability, or operational continuity.'
      },
      {
        title: 'Classic-to-Lightning Modernization',
        description: 'This capability is designed for organizations still operating on older Salesforce experiences or carrying legacy user friction. Kangqore helps assess readiness for Lightning modernization, define the migration approach, and improve how teams interact with the platform across desktop, console, and mobile environments. The outcome is a more modern interface, better usability, and a stronger foundation for future enhancements using Lightning and LWC.',
        bgImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
        items: ['Lightning migration assessment', 'Roadmap and modernization planning', 'LWC-oriented experience upgrade', 'UI, mobile, and console optimization'],
        micro: 'Modernize Salesforce UX and productivity through a more scalable Lightning-led architecture. We help organizations move beyond legacy UI limitations and unlock a faster, more flexible, and more modern user experience.'
      },
      {
        title: 'Salesforce Analytics & Reporting',
        description: 'A Salesforce environment only creates real value when decision-makers can see what is happening inside it. Kangqore designs dashboards, reporting structures, KPI views, and business insight layers that make data more usable for managers, teams, and leadership. This helps organizations monitor pipeline health, service efficiency, productivity, and customer trends with greater clarity and speed.',
        bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
        items: ['Real-time dashboards and reporting', 'Productivity and performance insights', 'Pipeline and service trend visibility', 'Better decision support for business teams'],
        micro: 'Turn Salesforce data into actionable visibility across sales, service, and customer operations. We help enterprises move beyond passive reporting and create insight layers that support better decisions, faster responses, and stronger performance management.'
      },
      {
        title: 'Salesforce Customization & Experience Design',
        description: 'Not every business can rely on a standard platform setup. Kangqore customizes Salesforce to better reflect your operating model, process requirements, approval structures, and user expectations. We also focus on experience design—ensuring workflows, screens, and interactions support productivity rather than create friction. The result is a Salesforce environment that feels purpose-built instead of over-generic.',
        bgImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
        items: ['Business-fit process customization', 'Experience design for users and teams', 'Low-friction workflow enablement', 'Scalable feature and UI tailoring'],
        micro: 'Extend Salesforce to fit your workflows, user experiences, and business differentiation. We shape the platform around how your teams actually work so it feels more intuitive, more relevant, and more effective in daily use.'
      },
      {
        title: 'Managed Salesforce Evolution',
        description: 'Salesforce transformation does not stop at implementation. Business needs evolve, user behavior changes, reporting expectations expand, and new opportunities emerge over time. Kangqore supports the platform post-launch through continuous improvement, roadmap execution, issue resolution, performance optimization, and feature refinement—so Salesforce keeps generating value instead of becoming stagnant.',
        bgImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
        items: ['Continuous platform improvement', 'Managed performance and issue support', 'Feature evolution and roadmap execution', 'Long-term adoption and value realization'],
        micro: 'Keep the platform improving after go-live through structured optimization and support. We help enterprises sustain momentum through ongoing enhancement, performance oversight, and continuous platform maturity.'
      }
    ],

    // Tools & Technologies Configuration
    technologiesTitle: 'Tools & Technologies We Excel In',
    technologiesDescription: 'We unify your Salesforce initiative with a curated stack of platform enablers, engineering frameworks, and data intelligence tools to ensure every deployment is scalable, governed, and future-ready.',
    technologies: [
      { category: 'CRM & Core Cloud Platforms', items: ['Sales Cloud', 'Service Cloud', 'Community Cloud', 'Commerce Cloud', 'Marketing Cloud', 'Financial Services Cloud'] },
      { category: 'Engineering & Extensibility', items: ['Apex', 'Lightning Web Components (LWC)', 'Flow Builder', 'Salesforce CLI', 'Heroku', 'Scratch Orgs'] },
      { category: 'AI & Data Intelligence', items: ['Einstein GPT', 'Salesforce Data Cloud', 'Tableau', 'CRM Analytics (Einstein Analytics)', 'Prediction Builder'] },
      { category: 'Connectivity & Ecosystem', items: ['MuleSoft Anypoint Platform', 'Slack Enterprise Grid', 'AppExchange Ecosystem', 'Composite APIs', 'Platform Events'] },
      { category: 'Governance & DevSecOps', items: ['Salesforce Shield', 'Event Monitoring', 'Copado / Gearset', 'PMD Static Analysis', 'JWT-based Security', 'Sandbox Security'] },
      { category: 'Industry & Specialized Solutions', items: ['Health Cloud', 'Vlocity (Salesforce Industries)', 'Education Cloud', 'Nonprofit Success Pack', 'Field Service Lightning'] }
    ],

    // UI Structure Slots
    preMatrixSection: <SalesforceWhySection />,
    customSections: null,
    postCapabilitiesSections: (
      <div className="flex flex-col w-full sf-specific-overrides">
        <SalesforceDiamondCoESection />
        <SalesforceValueDeliver />
        <SalesforceDeliveryModel />
        <SalesforceFutureReadySection />
      </div>
    ),
    
    postFAQSections: (
      <div className="flex flex-col w-full">
        <SalesforceExecutionEcosystem />
      </div>
    )
  };

  const department = {
    name: 'Enterprise Applications',
    slug: 'enterprise-applications',
    description: 'Modernize business operations through connected platforms.',
    icon: <Cloud className="w-6 h-6" />
  };

  const customFAQs = [
    {
      question: 'What Salesforce services does Kangqore provide?',
      answer: 'Kangqore provides Salesforce advisory, implementation, integration, migration, Lightning modernization, analytics, customization, and cloud-specific transformation support.'
    },
    {
      question: 'Which Salesforce clouds do you work across?',
      answer: 'Sales Cloud, Service Cloud, Community Cloud, Commerce Cloud, and Marketing Cloud.'
    },
    {
      question: 'Do you support Salesforce integration with enterprise systems?',
      answer: 'Yes. Integration is a core part of our offering, including APIs, middleware, OOB connectors, AppExchange, and legacy or third-party systems.'
    },
    {
      question: 'Can you help migrate existing Salesforce or legacy environments?',
      answer: 'Yes. We cover org-to-org and legacy-to-Salesforce migration with integrity, consistency, and deduplication in focus.'
    },
    {
      question: 'Do you support Lightning and LWC modernization?',
      answer: 'Yes. We explicitly support Lightning and LWC capabilities and Classic-to-Lightning modernization to improve UX and performance.'
    },
    {
      question: 'How does Salesforce improve service operations?',
      answer: 'The Service Cloud focuses on unified visibility, dashboards, support metrics, faster responses, self-service communities, and stronger customer loyalty.'
    },
    {
      question: 'How does Salesforce improve sales execution?',
      answer: 'The Sales Cloud focuses on customer visibility, opportunity tracking, reporting, analytics, and faster deal movement.'
    },
    {
      question: 'How does Salesforce support commerce and marketing?',
      answer: 'The Commerce Cloud focuses on omnichannel commerce and shared commerce operations, while the Marketing Cloud focuses on personalized customer journeys, lifecycle engagement, and cross-channel activation.'
    }
  ];

  const pageData = {
    service: {
      ...service,
      customFAQs
    },
    department
  };

  return (
    <div className="salesforce-page-override">
      <style dangerouslySetInnerHTML={{__html: `
        .salesforce-page-override > div > section { position: relative; z-index: 5; background-color: inherit; }
        .salesforce-page-override *:not(.orbit-path) { border-width: 0 !important; border-style: none !important; }

      `}} />
      <ServicePageTemplate
        service={pageData.service}
        department={department}
      />
    </div>
  );
};

export default Salesforce;
