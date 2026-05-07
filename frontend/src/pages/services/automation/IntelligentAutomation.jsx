import React from 'react';
import { Activity, BarChart3, Bot, BrainCircuit, Building2, CheckCircle2, Cpu, Database, Factory, Globe, Heart, Layers, LineChart, Lock, Search, Settings, Shield, ShoppingCart, Target, TrendingUp, Users, Workflow, Zap, Eye, FileText, Cog, GraduationCap, Network } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { Link } from 'react-router-dom';

const IntelligentAutomation = () => {
  // ============================================
  // 1) HERO SECTION
  // ============================================
  const service = {
    name: 'Intelligent Automation',
    titleLine1: 'Intelligent',
    titleHighlight: 'Automation',
    slug: 'intelligent-automation',
    shortDescription: 'AI-led automation that turns operations into a real-time, self-improving system.',
    videoBackground: '/videos/working-machine-4751312.mp4',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">AI-led automation that turns operations into a real-time, self-improving system.</h2>
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore helps enterprises automate end-to-end workflows by combining RPA, API-led integration, process orchestration, and GenAI—so decisions are faster, operations are cleaner, and outcomes are measurable.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    stats: [
      { value: 'Automate', label: 'End-to-end workflows', color: 'text-blue-500' },
      { value: 'Integrate', label: 'Systems & data', color: 'text-brand-blue' },
      { value: 'Embed', label: 'AI-driven decisions', color: 'text-indigo-500' },
      { value: 'Scale', label: 'With governance', color: 'text-purple-500' }
    ],

    // ============================================
    // 2–4) HIGH FIDELITY SECTIONS
    // ============================================
    highFidelity: {
      narrative: {
        badge: 'INTELLIGENT AUTOMATION :: 2026',
        titleLine1: 'Real-time Insights.',
        titleHighlight: 'Automated',
        titleLine2: 'Execution.',
        description: 'Break data silos and manual dependencies by connecting applications, workflows, and teams. We enable intelligent automation across business and IT operations—integrating data, orchestrating processes, and embedding AI where decisions happen.',
        bottleneckLabel: 'The Challenge',
        bottleneckText: 'Disconnected systems, manual handoffs, decision bottlenecks, and lack of real-time visibility into operations.',
        requirementLabel: 'Our Approach',
        requirementText: 'Connected systems and unified workflows. Faster decision-making with AI-assisted automation. Governance-first execution: secure, compliant, auditable.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
        statusLabel: 'Automation Maturity',
        statusValue: 'Intelligent'
      },
      philosophy: {
        icon: <Zap className="w-7 h-7 text-brand-blue" />,
        title: 'Our',
        titleHighlight: 'Automation Framework.',
        description: 'At Kangqore, Intelligent Automation is structured across four integrated pillars—connecting data, embedding intelligence, scaling execution, and enabling teams.',
        pills: ['Connect', 'Decide', 'Execute', 'Enable']
      },
      matrix: {
        engineId: 'Engine :: IA_Flow_V2',
        title: 'How We Deliver',
        subtext: 'A structured, outcomes-driven delivery model—from process assessment to enterprise-wide automation at scale.',
        layers: [
          { title: 'Discover', id: 'IA_DISC', icon: <Search />, desc: 'Process assessment + automation pipeline + ROI model. Identify the highest-impact workflows and build a clear automation roadmap.' },
          { title: 'Design', id: 'IA_DES', icon: <Layers />, desc: 'Target workflows + system integrations + controls. Architect the automation solution with security, compliance, and scalability built in.' },
          { title: 'Deploy', id: 'IA_DEP', icon: <Zap />, desc: 'Build bots and workflows + testing + rollout. Execute the automation blueprint with structured QA, UAT, and change management.' },
          { title: 'Scale', id: 'IA_SCALE', icon: <TrendingUp />, desc: 'CoE governance + monitoring + continuous optimization. Expand automation across functions with KPI dashboards and improvement cadence.' }
        ]
      },
      schematic: {
        titleLine1: 'Synthesize',
        titleHighlight: 'Operations.',
        description: 'Design ecosystems where humans and digital workers collaborate seamlessly—tied to KPIs, ROI, and measurable business outcomes.',
        stats: [
          { label: 'Decisions', val: 'AI-DRIVEN' },
          { label: 'Workflows', val: 'ORCHESTRATED' },
          { label: 'Outcomes', val: 'MEASURABLE' }
        ]
      }
    }
  };

  const department = {
    name: 'Automation',
    slug: 'automation',
    description: 'Transform your business with cutting-edge intelligent automation solutions.'
  };

  // ============================================
  // CAPABILITIES — 4 cards
  // ============================================
  const capabilities = [
    {
      title: 'Digital Integration',
      bgImage: '/images/capabilities/digital-transformation.png',
      description: 'Build a connected enterprise with API-led integration, iPaaS modernization, and secure EDI/B2B enablement—designed to scale reliably across teams and ecosystems.',
      items: [
        'API-led connectivity & microservices orchestration',
        'iPaaS platform modernization & migration',
        'EDI/B2B integration & partner onboarding',
        'Real-time data synchronization across systems',
        'Legacy system connectivity & modernization',
        'Event-driven architecture & streaming pipelines',
        'Secure gateway & protocol management'
      ]
    },
    {
      title: 'Business Process Management (BPM)',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Modernize process orchestration with BPM-led operating models, process mining, real-time decisioning, and governance—improving customer experience, agility, and operational control.',
      items: [
        'Process & task mining (data-driven discovery)',
        'End-to-end process mapping & optimization',
        'BPM platform implementation & customization',
        'Real-time decisioning & dynamic routing',
        'Compliance & governance framework setup',
        'Process analytics & continuous improvement',
        'Customer journey orchestration'
      ]
    },
    {
      title: 'Next-Gen RPA & Document Processing',
      bgImage: '/images/capabilities/automation-rpa.png',
      description: 'Deploy enterprise-grade automation with a structured RPA CoE and Intelligent Document Processing—covering discovery to scale, with measurable productivity gains across operations.',
      items: [
        'Automation discovery & opportunity assessment',
        'Attended & unattended bot development',
        'Intelligent Document Processing (IDP)',
        'Invoice, contract & KYC automation',
        'RPA Center of Excellence (CoE) setup',
        'Bot monitoring, analytics & optimization',
        'Enterprise-wide scale & governance'
      ]
    },
    {
      title: 'AI & Cognitive Services',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Embed intelligence into operations with GenAI, NLP, computer vision, and decision engines—enabling workflows that learn, adapt, and self-improve with every cycle.',
      items: [
        'GenAI for operations (assist + automate)',
        'NLP & conversational AI deployment',
        'Computer vision & image processing',
        'Decision intelligence & recommendation engines',
        'Predictive analytics & anomaly detection',
        'AI model governance & responsible AI',
        'LLM integration & prompt engineering'
      ]
    }
  ];

  // ============================================
  // TRUST PILLARS — Operational Approach (deduplicated vs Why Kangqore)
  // ============================================
  const trustPillars = [
    {
      title: 'Data-Driven Discovery',
      tag: 'Process Mining',
      description: 'We don\'t rely on workshops and assumptions. Process mining, task mining, and operational data drive every automation decision—so you automate what actually matters, not what looks easy.'
    },
    {
      title: 'Human-in-the-Loop Design',
      tag: 'Collaborative',
      description: 'Automation doesn\'t replace your teams—it amplifies them. We design attended bots, AI copilots, and exception-handling workflows that keep human judgment where it counts.'
    },
    {
      title: 'Change Management Built In',
      tag: 'Adopted',
      description: 'Technology deployed without adoption is shelfware. Every engagement includes stakeholder alignment, training programs, and citizen developer enablement—so automation sticks.'
    },
    {
      title: 'Continuous Optimization Engine',
      tag: 'Evolving',
      description: 'Post-deployment, we don\'t walk away. KPI dashboards, bot health monitoring, and quarterly improvement sprints ensure your automation program compounds value over time.'
    }
  ];

  // ============================================
  // TECHNOLOGIES
  // ============================================
  const technologies = [
    { category: 'Automation & RPA', items: ['UiPath', 'Automation Anywhere', 'Blue Prism', 'Power Automate', 'WorkFusion', 'NICE'] },
    { category: 'BPM & Orchestration', items: ['ServiceNow', 'Appian', 'Pega', 'Camunda', 'Nintex', 'Bizagi'] },
    { category: 'Process Mining', items: ['Celonis', 'Microsoft Process Advisor', 'UiPath Process Mining', 'Minit', 'Signavio'] },
    { category: 'AI & GenAI', items: ['OpenAI', 'Azure OpenAI', 'Google Vertex AI', 'AWS Bedrock', 'Azure AI'] },
    { category: 'IDP & Document AI', items: ['ABBYY', 'Kofax', 'Hyperscience', 'Google Document AI', 'Azure Form Recognizer'] },
    { category: 'Integration & iPaaS', items: ['MuleSoft', 'Dell Boomi', 'Workato', 'SnapLogic', 'Apache Kafka', 'Talend'] }
  ];

  // ============================================
  // WHY KANGQORE — 5 tiles (deduplicated vs Trust Pillars)
  // ============================================
  const whyKangqoreIntro = `Kangqore delivers intelligent automation that connects systems, embeds AI, and scales with governance—turning fragmented operations into a unified, self-improving execution engine.`;

  const whyKangqore = [
    {
      title: 'Full-Stack Automation Delivery',
      description: 'Integration, BPM, RPA, IDP, and AI delivered as one unified program—not siloed tools. We own the full lifecycle from discovery to production and beyond.'
    },
    {
      title: 'Platform-Agnostic, Vendor-Neutral',
      description: 'UiPath, Automation Anywhere, ServiceNow, Appian, MuleSoft—we select the right tools for your environment and integrate them into one cohesive automation layer.'
    },
    {
      title: 'Weeks to Production, Not Months',
      description: 'Our structured pilot methodology proves ROI in 4–6 weeks. We validate fast, iterate quickly, and scale with confidence once value is demonstrated.'
    },
    {
      title: 'CoE-Ready from Day One',
      description: 'We don\'t just build bots—we establish Automation Centers of Excellence with operating models, governance frameworks, and compliance protocols for sustained value.'
    },
    {
      title: 'AI-Native, Not AI-Bolted',
      description: 'GenAI, NLP, and decision engines are embedded into workflows at the design phase—not added later. This creates operations that learn and self-improve with every cycle.'
    }
  ];

  // ============================================
  // INDUSTRIES
  // ============================================
  const industries = [
    { name: 'Banking & Financial Services' },
    { name: 'Insurance' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Manufacturing & Supply Chain' },
    { name: 'Retail & Consumer Goods' },
    { name: 'Technology & Telecom' }
  ];

  // ============================================
  // FAQs
  // ============================================
  const customFAQs = [
    {
      question: 'What is Intelligent Automation and how is it different from RPA?',
      answer: 'Intelligent Automation combines RPA with AI, machine learning, process orchestration, and API-led integration to automate end-to-end workflows—not just individual tasks. While RPA handles repetitive rule-based work, IA adds intelligence: document understanding, decision-making, predictive analytics, and self-improving processes.'
    },
    {
      question: 'Which processes should we automate first?',
      answer: 'We start with a structured discovery phase that maps your processes against automation readiness, business impact, and complexity. High-volume, rule-based processes with clear inputs/outputs are ideal early candidates. Our ROI model helps prioritize the automation pipeline by expected value.'
    },
    {
      question: 'How do you ensure security, compliance, and audit readiness?',
      answer: 'Every automation is built with governance from day one—role-based access controls, encrypted data handling, full audit trails, and compliance checkpoints. Our three-lines-of-defense model embeds risk ownership, oversight, and assurance into the operating model.'
    },
    {
      question: 'How long does a pilot take and what does "scale" mean?',
      answer: 'A focused pilot typically takes 4–6 weeks from discovery to production. "Scale" means expanding automation across functions, geographies, and use cases—supported by a CoE, governance model, monitoring dashboards, and continuous optimization cadence.'
    },
    {
      question: 'Can this integrate with our ERP/CRM and legacy tools?',
      answer: 'Yes. Our API-led integration and iPaaS capabilities connect modern and legacy systems—SAP, Oracle, Salesforce, Workday, and custom applications—into unified automated workflows without requiring full system replacement.'
    },
    {
      question: 'Do you set up an Automation CoE and governance model?',
      answer: 'Absolutely. We establish dedicated Automation Centers of Excellence with operating models, KPI frameworks, compliance protocols, citizen developer guardrails, and training programs—ensuring automation is sustained, scalable, and continuously optimized.'
    }
  ];


  // ============================================
  // METRICS STRIP
  // ============================================
  const metricsStripSection = (
    <section className="py-12 lg:py-16 bg-gradient-to-r from-slate-900 via-[#1a1f3a] to-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
          {[
            { label: '60%', sub: 'Avg. cycle time reduction' },
            { label: '4–6 Weeks', sub: 'Pilot to production' },
            { label: '40%', sub: 'Manual effort eliminated' },
            { label: '99.5%', sub: 'Bot uptime SLA' },
            { label: '15+', sub: 'Industries served' },
            { label: '3x', sub: 'Faster decision cycles' }
          ].map((metric, idx) => (
            <div key={idx} className="text-center group">
              <div className="text-lg lg:text-xl font-bold text-white tracking-tight mb-1 group-hover:text-cyan-400 transition-colors">
                {metric.label}
              </div>
              <div className="text-xs text-white/50 font-medium tracking-wide uppercase">
                {metric.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Combine pre-Why Kangqore sections
  const preWhyKangqoreSections = (
    <>
      {metricsStripSection}
    </>
  );

  // ============================================
  // RELATED OFFERINGS → postFAQSections
  // ============================================
  const relatedOfferings = (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:w-2/3 mb-16">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
            Related <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Offerings.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
            Kangqore offers a range of services designed to aid and accelerate your automation and digital transformation journey.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              name: 'Cloud Transformation',
              link: '/services/cloud/cloud-transformation',
              icon: <Globe className="w-5 h-5" />,
              desc: 'Migrate and modernize infrastructure to cloud-native architectures that support scalable automation workloads.'
            },
            {
              name: 'Data Engineering & Analytics',
              link: '/services/data-ai/data-engineering',
              icon: <Database className="w-5 h-5" />,
              desc: 'Build the data pipelines and analytics layer that feeds AI-driven automation with clean, real-time data.'
            },
            {
              name: 'Cybersecurity & Compliance',
              link: '/services/cybersecurity',
              icon: <Shield className="w-5 h-5" />,
              desc: 'Secure automated workflows with identity management, threat detection, and regulatory compliance frameworks.'
            },
            {
              name: 'GenAI & LLM Integration',
              link: '/services/data-ai/generative-ai',
              icon: <BrainCircuit className="w-5 h-5" />,
              desc: 'Embed generative AI and large language models into enterprise workflows for intelligent assist and automation.'
            },
            {
              name: 'Digital Business Transformation',
              link: '/services/consulting/digital-business-transformation',
              icon: <TrendingUp className="w-5 h-5" />,
              desc: 'Align automation initiatives with enterprise strategy, operating model redesign, and organizational change management.'
            },
            {
              name: 'Quality Engineering & Testing',
              link: '/services/engineering/quality-engineering',
              icon: <Target className="w-5 h-5" />,
              desc: 'Validate automated workflows with structured QA, regression testing, and continuous testing frameworks.'
            }
          ].map((offering, idx) => (
            <Link
              key={idx}
              to={offering.link}
              className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500"
            >
              <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                {offering.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </div>
                <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  // ============================================
  // ASSEMBLE PAGE DATA
  // ============================================
  const pageData = {
    service: {
      ...service,
      technologies,
      technologiesTitle: 'Tools & Technologies',
      technologiesDescription: 'Platform-agnostic implementation. Works with your stack—across RPA, BPM, AI, iPaaS, and cloud infrastructure.',
      capabilities,
      capabilitiesDescription: 'Kangqore helps enterprises integrate systems, orchestrate processes, and embed AI-driven intelligence across operations. From API-led integration and BPM to RPA, IDP, and cognitive services—we unlock efficiency, speed, and measurable business outcomes.',
      industryTitle: 'Industry Solutions Built for Scale.',
      trustPillars,
      trustPillarsRightTitle: 'Our Automation Philosophy',
      trustPillarsRightDescription: 'Kangqore builds automation that is governed, measurable, and self-improving—connecting systems, embedding intelligence, and scaling execution across the enterprise.',
      trustPillarsRightButton: 'Request Assessment',
      preWhyKangqoreSections,
      whyKangqoreIntro,
      whyKangqore,
      industries,
      customFAQs,
      postFAQSections: relatedOfferings
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default IntelligentAutomation;
