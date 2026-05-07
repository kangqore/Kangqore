import React from 'react';
import { Activity, BarChart3, Bot, BrainCircuit, Building2, CheckCircle2, Cpu, Database, Factory, Globe, Heart, Layers, LineChart, Lock, Search, Settings, Shield, ShoppingCart, Target, TrendingUp, Users, Workflow, Zap } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { Link } from 'react-router-dom';

const BusinessProcessManagement = () => {
  // ============================================
  // 1) HERO SECTION
  // ============================================
  const service = {
    name: 'Business Process Management',
    titleLine1: 'Business Process',
    titleHighlight: 'Management',
    slug: 'business-process-management',
    shortDescription: 'Driving 360° operational excellence to build future-ready enterprises.',
    videoBackground: '/videos/working-machine-4751312.mp4',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Driving 360° operational excellence to build future-ready enterprises.</h2>
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore helps organizations redesign, govern, and continuously improve business processes—combining BPM, automation, analytics, and AI to deliver scalable operating models and measurable outcomes.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    stats: [
      { value: 'Optimize', label: 'Business processes', color: 'text-blue-500' },
      { value: 'Reduce', label: 'Operational cost', color: 'text-brand-blue' },
      { value: 'Enhance', label: 'Customer experience', color: 'text-indigo-500' },
      { value: 'Drive', label: '360° excellence', color: 'text-purple-500' }
    ],

    // ============================================
    // 2–4) HIGH FIDELITY SECTIONS
    // ============================================
    highFidelity: {
      // 2) "Creating Real Impact"
      narrative: {
        badge: 'OPERATIONAL EXCELLENCE :: 2026',
        titleLine1: 'Creating Real Impact',
        titleHighlight: 'through Intelligent',
        titleLine2: 'Business Experiences.',
        description: 'Dynamic markets demand dynamic operations. Kangqore helps organizations redesign, govern, and continuously improve business processes—combining BPM, automation, analytics, and AI to deliver scalable operating models and measurable outcomes. Our approach brings structure to complexity—standardizing workflows, reducing operational friction, and enabling consistent service excellence across the enterprise.',
        bottleneckLabel: 'The Challenge',
        bottleneckText: 'Fragmented workflows, rising operational costs, inconsistent service delivery, and siloed processes that block agility and scale.',
        requirementLabel: 'Our Approach',
        requirementText: 'Technology-led BPM with GenAI-enabled innovation, experience-driven design, flexible structures, and three lines of defense for compliance and quality.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
        statusLabel: 'Process Maturity',
        statusValue: 'Optimized'
      },
      // 4) BPM Framework
      philosophy: {
        icon: <Workflow className="w-7 h-7 text-brand-blue" />,
        title: 'BPM',
        titleHighlight: 'Excellence-Driven.',
        description: 'We bring structure to complexity—standardizing workflows, reducing operational friction, and enabling consistent service excellence across the enterprise with automation, AI, and domain expertise.',
        pills: ['Process Design', 'Hyper-Automation', 'Analytics & AI', 'Compliance & Quality']
      },
      // 3) Delivery Model
      matrix: {
        engineId: 'Engine :: BPM_Core_V3',
        title: 'BPM Delivery Model',
        subtext: 'A structured, domain-led approach to process transformation — from assessment to continuous optimization.',
        layers: [
          { title: 'Assess & Model', id: 'BPM_ASSESS', icon: <Search />, desc: '3-Level business process modeling with standardization, elimination of redundancies, and automation opportunity identification.' },
          { title: 'Design & Architect', id: 'BPM_DESIGN', icon: <Layers />, desc: 'Experience-led process design using CX labs, BPM programs, analytics, and operational insights for zero-friction workflows.' },
          { title: 'Implement & Automate', id: 'BPM_IMPL', icon: <Zap />, desc: 'Deploy RPA, cognitive automation, and AI-powered workflows across sales, finance, HR, supply chain, and customer operations.' },
          { title: 'Govern & Optimize', id: 'BPM_GOV', icon: <Shield />, desc: 'Three lines of defense, dedicated compliance officers, KPI dashboards, and continuous improvement cadence.' }
        ]
      },
      schematic: {
        titleLine1: 'Drive',
        titleHighlight: 'Agility.',
        description: 'Your operations should enable scale, not impede it. We build the foundations for 360° operational excellence.',
        stats: [
          { label: 'Quality', val: 'HARDENED' },
          { label: 'Compliance', val: 'EMBEDDED' },
          { label: 'Scale', val: 'ENTERPRISE' }
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
  // 5) CAPABILITIES CAROUSEL — 7 BPM categories
  // ============================================
  const capabilities = [
    {
      title: 'Sales Operations',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Streamline your sales lifecycle with process automation, pipeline governance, and data-driven insights that accelerate revenue growth.',
      items: [
        'Lead-to-cash process automation',
        'Pipeline management & forecasting',
        'Sales analytics & performance dashboards',
        'CRM workflow optimization',
        'Order management & fulfillment'
      ]
    },
    {
      title: 'Customer Experience Management (CXM)',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'Deliver consistent, personalized customer experiences across every touchpoint with intelligent process orchestration and real-time insights.',
      items: [
        '360-degree customer engagement',
        'Omnichannel service orchestration',
        'Customer journey mapping & optimization',
        'Voice of Customer (VoC) analytics',
        'Service quality monitoring & SLA management'
      ]
    },
    {
      title: 'Hyper-Intelligent Automation',
      bgImage: '/images/capabilities/quality-testing.png',
      description: 'Combine RPA, AI, and cognitive technologies to automate complex, judgment-intensive processes at scale across the enterprise.',
      items: [
        'Robotic Process Automation (RPA)',
        'Intelligent Document Processing (IDP)',
        'AI-powered decision automation',
        'Cognitive workflow orchestration',
        'GenAI-enabled process augmentation'
      ]
    },
    {
      title: 'Finance & Accounting',
      bgImage: '/images/capabilities/finance.png',
      description: 'Transform financial operations with automated workflows, real-time reporting, and compliance-ready processes that reduce cost and risk.',
      items: [
        'Procure-to-pay automation',
        'Order-to-cash optimization',
        'Record-to-report streamlining',
        'Treasury & cash management',
        'Regulatory reporting & compliance'
      ]
    },
    {
      title: 'Supply Chain Management',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Build resilient, agile supply chains with end-to-end process visibility, predictive analytics, and automated procurement workflows.',
      items: [
        'Procurement & vendor management',
        'Inventory optimization & demand planning',
        'Logistics & fulfillment automation',
        'Supply chain risk management',
        'Supplier performance analytics'
      ]
    },
    {
      title: 'Marketing Operations & Content',
      bgImage: '/images/capabilities/growth-marketing.png',
      description: 'Scale marketing execution with automated campaign workflows, content operations, and performance analytics for measurable ROI.',
      items: [
        'Campaign management & automation',
        'Content lifecycle management',
        'Marketing analytics & attribution',
        'Brand compliance & governance',
        'Digital asset management'
      ]
    },
    {
      title: 'Human Resource Services',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Modernize HR operations with automated employee lifecycle management, compliance-ready processes, and workforce analytics.',
      items: [
        'Employee onboarding & offboarding',
        'Payroll & benefits administration',
        'Talent acquisition & management',
        'Workforce planning & analytics',
        'Learning & development programs'
      ]
    }
  ];

  // ============================================
  // 6) TRUST PILLARS — Operational Governance Approach
  // ============================================
  const trustPillars = [
    {
      title: 'Technology-led Innovation',
      tag: 'GenAI-enabled',
      description: 'Advanced technologies including automation, AI, and GenAI that elevate business operations. Scalable, tech-enabled models that reduce cost through smart process automation with continuous productivity gains.'
    },
    {
      title: 'Customer Experience at the Core',
      tag: 'CX-first',
      description: 'Experience-led transformation using CX labs, BPM programs, analytics, and operational insights. Persona-based design to remove redundancies, enabling zero-friction and zero-touch digital processes.'
    },
    {
      title: 'Flexible Engagement Models',
      tag: 'Adaptable',
      description: 'Choose from carve-outs of existing teams, build or ramp-up from scratch, or Build-Operate-Transfer (BOT) models — structured to fit your organizational needs and growth trajectory.'
    },
    {
      title: 'Compliance & Quality Framework',
      tag: 'Risk-aware',
      description: 'Three lines of defense embedded into BPM models with dedicated compliance officers. Risk-based quality framework for consistent outcomes, proactive risk identification, and regulatory readiness.'
    }
  ];

  // ============================================
  // TECHNOLOGIES
  // ============================================
  const technologies = [
    { category: 'BPM Platforms', items: ['Appian', 'Pega', 'ServiceNow', 'Camunda', 'Bizagi', 'IBM BPM', 'Nintex', 'Kissflow'] },
    { category: 'RPA & Automation', items: ['UiPath', 'Automation Anywhere', 'Blue Prism', 'Power Automate', 'WorkFusion', 'NICE', 'Kofax', 'Kryon'] },
    { category: 'Analytics & AI', items: ['Celonis', 'Tableau', 'Power BI', 'OpenAI', 'Google Document AI', 'Azure AI', 'AWS SageMaker', 'Dataiku'] },
    { category: 'CRM & Operations', items: ['Salesforce', 'SAP', 'Oracle', 'Workday', 'Microsoft Dynamics', 'HubSpot', 'Zoho', 'NetSuite'] },
    { category: 'Cloud & Infrastructure', items: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform'] },
    { category: 'DevOps & QA', items: ['Jenkins', 'GitLab CI', 'Selenium', 'Jira', 'Confluence', 'SonarQube', 'Postman'] },
    { category: 'Integration & Middleware', items: ['MuleSoft', 'Dell Boomi', 'Apache Kafka', 'Talend', 'Informatica', 'SnapLogic'] }
  ];

  // ============================================
  // WHY KANGQORE — 6 tiles
  // ============================================
  const whyKangqoreIntro = `Kangqore combines domain expertise, technology-led innovation, and a proven governance framework to deliver BPM solutions that create real, measurable impact across the enterprise.`;

  const whyKangqore = [
    {
      title: '3-Level Business Process Modeling',
      description: 'Process standardization to drive elimination, agility, and automation. Controls established for regulatory compliance across strategic, operational, and task-level workflows.'
    },
    {
      title: 'Robotic Process Automation (RPA)',
      description: 'Deploy bots that remove repetitive manual work at scale — integrating seamlessly with existing systems for 24/7 operational capacity and measurable cost savings.'
    },
    {
      title: 'Impactful Analytics',
      description: 'Operational analytics + KPI dashboards to measure outcomes and continuously optimize. Real-time visibility into process performance and improvement opportunities.'
    },
    {
      title: 'Three Lines of Defense',
      description: 'Embed risk ownership, compliance oversight, and independent assurance into your operating model — helping teams meet regulatory expectations and build a strong risk culture.'
    },
    {
      title: 'Transition Management Academy',
      description: 'Build transition-ready teams with structured training and certification — equipping SMEs and managers with process analysis, governance, and improvement skills for smooth BPM execution.'
    },
    {
      title: 'Quality & Compliance Framework',
      description: 'Drive consistent outcomes with a risk-based quality framework — proactively identifying process risks, strengthening controls, and improving compliance readiness across operations.'
    }
  ];

  // ============================================
  // INDUSTRIES
  // ============================================
  const industries = [
    { name: 'Banking' },
    { name: 'Capital Markets' },
    { name: 'Insurance' },
    { name: 'Mortgage' },
    { name: 'Healthcare' },
    { name: 'Life Sciences' },
    { name: 'Retail' },
    { name: 'Consumer Packaged Goods' },
    { name: 'High Tech & Manufacturing' },
    { name: 'Utilities' },
    { name: 'Telecom' }
  ];

  // ============================================
  // FAQs — 9 questions
  // ============================================
  const customFAQs = [
    {
      question: 'How does Kangqore enable 360° operational excellence?',
      answer: 'We combine 3-level process modeling, hyper-intelligent automation, analytics-driven insights, and embedded compliance frameworks to redesign and continuously optimize operations across every business function — from sales and finance to HR and supply chain.'
    },
    {
      question: 'Which technologies power Kangqore\'s BPM and automation solutions?',
      answer: 'We work across leading BPM platforms (Appian, Pega, ServiceNow, Camunda), RPA tools (UiPath, Automation Anywhere, Power Automate), analytics engines (Celonis, Tableau, Power BI), and AI/GenAI capabilities — selecting the right stack for your environment.'
    },
    {
      question: 'How does GenAI enhance business process management and automation?',
      answer: 'GenAI enables intelligent document processing, automated decision support, predictive process optimization, and natural-language workflow orchestration — extending automation beyond rules-based tasks into judgment-intensive processes.'
    },
    {
      question: 'What are the benefits of automation and AI in operations?',
      answer: 'Key benefits include reduced operational costs, faster cycle times, improved accuracy and compliance, enhanced customer experience, real-time visibility into process performance, and the ability to scale without proportional increases in headcount.'
    },
    {
      question: 'What kind of post-implementation support does Kangqore provide?',
      answer: 'We offer ongoing process monitoring, KPI dashboards, continuous optimization sprints, upskilling programs through our Transition Management Academy, and dedicated compliance oversight to ensure sustained value from your BPM investment.'
    },
    {
      question: 'How are solutions tailored to different users, teams, and industries?',
      answer: 'We start with persona-based requirements analysis to remove redundancies, then apply industry-specific process templates and domain expertise. Our flexible engagement models — carve-outs, build-from-scratch, or Build-Operate-Transfer — adapt to your organizational structure.'
    },
    {
      question: 'Which industries benefit most from Kangqore\'s BPM services?',
      answer: 'We serve Banking, Capital Markets, Insurance, Mortgage, Healthcare, Life Sciences, Retail, CPG, High Tech & Manufacturing, Utilities, and Telecom — each with industry-aligned operating models and compliance frameworks.'
    },
    {
      question: 'How do you ensure automation is secure, compliant, and scalable?',
      answer: 'Our three-lines-of-defense model embeds risk ownership, compliance oversight, and independent assurance into every operating model. Dedicated compliance officers, enterprise-grade security controls, and scalable architecture ensure readiness at any scale.'
    },
    {
      question: 'How quickly can BPM and digital process automation be deployed?',
      answer: 'Initial process assessment and modeling typically takes 2–4 weeks. A focused automation POC can be delivered in 4–6 weeks. Enterprise-wide BPM programs scale in phased sprints, with measurable outcomes visible from the first phase.'
    }
  ];

  // ============================================
  // "WHAT KANGQORE BRINGS TO THE TABLE" SECTION
  // ============================================
  const whatKangqoreBringsSection = (
    <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black" id="capabilities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            Our Approach
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display leading-[0.95]">
            What Kangqore Brings <span className="text-transparent bg-clip-text bg-brand-gradient italic">to the Table.</span>
          </h2>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
            Six foundational pillars that power our BPM delivery and set us apart.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <BrainCircuit className="w-6 h-6" />,
              title: 'Technology-led, GenAI-enabled Innovation',
              items: [
                'Advanced technologies (automation, AI, GenAI) that elevate business operations',
                'Scalable, tech-enabled models that reduce cost through smart process automation',
                'Continuous productivity, efficiency, and cost savings',
                'Tailored BPM services and operating models for enterprise needs'
              ]
            },
            {
              icon: <Heart className="w-6 h-6" />,
              title: 'Customer Experience at the Core',
              items: [
                'Experience-led transformation using CX labs, BPM programs, analytics, and operational insights',
                'Persona-based requirements to remove redundancies in operations',
                'Zero-friction and zero-touch digital processes',
                'Strong digital governance and execution cadence'
              ]
            },
            {
              icon: <Layers className="w-6 h-6" />,
              title: 'Flexible Structures',
              items: [
                'Carve-outs of existing teams',
                'Build or ramp-up from scratch',
                'Build-Operate-Transfer (BOT) model',
                'Joint ventures / SPVs for specialized delivery'
              ]
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: 'Unparalleled Domain Expertise',
              items: [
                'Hiring top talent across BPM + operations domains',
                'Ongoing upskilling of teams',
                'Best practices spanning end-to-end operating models for seamless execution'
              ]
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: 'Compliance and Quality',
              items: [
                'Three lines of defense embedded into BPM models',
                'Dedicated compliance officers for risk mitigation',
                'Risk-based quality framework for consistent outcomes'
              ]
            },
            {
              icon: <Globe className="w-6 h-6" />,
              title: 'Strong Partner Ecosystem',
              items: [
                'Best-of-breed solutions and integrations (CRM, supply chain, operations platforms)',
                'Partner-led accelerators to deliver value faster',
                'Platform-agnostic execution across leading BPM tools'
              ]
            }
          ].map((pillar, idx) => (
            <div key={idx} className="group bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl p-6 lg:p-8 hover:border-blue-200 hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-brand-gradient rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-4">{pillar.title}</h3>
              <ul className="space-y-2.5">
                {pillar.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-2.5 text-sm text-gray-500 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-blue/40 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ============================================
  // METRICS STRIP SECTION
  // ============================================
  const metricsStripSection = (
    <section className="py-12 lg:py-16 bg-gradient-to-r from-slate-900 via-[#1a1f3a] to-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
          {[
            { label: 'Multi-domain Delivery', sub: 'BPM + Automation + Data + AI' },
            { label: 'CoE-ready Governance', sub: 'Enterprise operating models' },
            { label: 'Platform-agnostic', sub: 'Execution across leading tools' },
            { label: 'Rapid POC-to-Scale', sub: 'Structured delivery model' },
            { label: 'Enterprise Security', sub: 'Hardened posture' },
            { label: '24/7 Support-ready', sub: 'Operational readiness' }
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

  // ============================================
  // DISCOVER MORE SECTION
  // ============================================
  const discoverMoreSection = (
    <section className="py-16 lg:py-20 bg-brand-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8 tracking-tight font-display">
          Discover More about Business Process Management
        </h2>
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800/15 backdrop-blur-md border border-white/20 text-white placeholder-white/50 text-lg focus:outline-none focus:border-white/40 focus:bg-white dark:bg-gray-900 dark:border-gray-800/20 transition-all"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            'Digital transformation in operations',
            'Business process automation',
            'Automation and AI in operations'
          ].map((chip, idx) => (
            <span key={idx} className="px-5 py-2.5 bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white/80 font-medium hover:bg-white dark:bg-gray-900 dark:border-gray-800/20 hover:text-white cursor-pointer transition-all">
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );

  // ============================================
  // INDUSTRY SOLUTIONS SECTION
  // ============================================
  const industrySolutionsSection = (
    <section className="py-20 lg:py-28 bg-[#F5F5F7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            Industry Focus
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display leading-[0.95]">
            Industry Solutions that <span className="text-transparent bg-clip-text bg-brand-gradient italic">Drive Real Value.</span>
          </h2>
          <p className="text-xl text-gray-500 font-light max-w-3xl mx-auto">
            With process complexity growing across industries, organizations need structured, industry-aligned BPM models to scale efficiently. Kangqore brings domain-led process design, automation, and measurable operational governance.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: 'Banking', icon: <Building2 className="w-6 h-6" /> },
            { name: 'Capital Markets', icon: <TrendingUp className="w-6 h-6" /> },
            { name: 'Insurance', icon: <Shield className="w-6 h-6" /> },
            { name: 'Mortgage', icon: <Building2 className="w-6 h-6" /> },
            { name: 'Healthcare', icon: <Heart className="w-6 h-6" /> },
            { name: 'Life Sciences', icon: <Activity className="w-6 h-6" /> },
            { name: 'Retail', icon: <ShoppingCart className="w-6 h-6" /> },
            { name: 'Consumer Packaged Goods', icon: <Factory className="w-6 h-6" /> },
            { name: 'High Tech & Manufacturing', icon: <Cpu className="w-6 h-6" /> },
            { name: 'Utilities', icon: <Zap className="w-6 h-6" /> },
            { name: 'Telecom', icon: <Globe className="w-6 h-6" /> }
          ].map((industry, idx) => (
            <div key={idx} className="group bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-5 flex items-center gap-4 border border-gray-100 hover:border-blue-200 hover:shadow-lg cursor-pointer transition-all duration-300">
              <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white transition-all duration-300 shrink-0">
                {industry.icon}
              </div>
              <span className="font-semibold text-sm text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{industry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Combine custom sections
  const preWhyKangqoreSections = (
    <>
      {whatKangqoreBringsSection}
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            Related Offerings
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
            Related <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Offerings.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
            Kangqore offers a range of services designed to aid and speed up digital transformation across a variety of journeys.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              name: 'Robotic Process Automation',
              link: '/services/automation/robotic-process-automation',
              icon: <Bot className="w-5 h-5" />,
              desc: 'Deploy secure, scalable software bots that automate high-volume, repetitive tasks across IT and business operations.'
            },
            {
              name: 'Digital Process Automation',
              link: '/services/automation/digital-process-automation',
              icon: <Workflow className="w-5 h-5" />,
              desc: 'End-to-end workflow orchestration combining process, digital, and cognitive automation layers.'
            },
            {
              name: 'AI & Cognitive Computing',
              link: '/services/data-ai/cognitive-services',
              icon: <BrainCircuit className="w-5 h-5" />,
              desc: 'Couple augmented intelligence with cognitive computing for smarter decision-making workflows.'
            },
            {
              name: 'GenAI',
              link: '/services/data-ai/generative-ai',
              icon: <Target className="w-5 h-5" />,
              desc: 'Drive innovation at scale with responsible and secure Generative AI capabilities.'
            },
            {
              name: 'Data Science',
              link: '/services/data-ai/data-science',
              icon: <LineChart className="w-5 h-5" />,
              desc: 'Unlock actionable insights with advanced analytics and data-driven decision making.'
            },
            {
              name: 'Agentic AI',
              link: '/services/data-ai/agentic-ai',
              icon: <BrainCircuit className="w-5 h-5" />,
              desc: 'Empower enterprises with intelligent agents that act, decide, and collaborate autonomously.'
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
  // "HOW WE HELP REDESIGN" — 5-Step Accordion
  // ============================================
  const [openStep, setOpenStep] = React.useState(null);

  const processSteps = [
    {
      title: 'Process Discovery & Strategy: Uncovering What\'s Working—and What\'s Not',
      content: 'We begin with a thorough assessment of your current processes, systems, and teams. Through stakeholder interviews, process mining, and data analysis, we identify bottlenecks, redundancies, and high-impact automation opportunities — building a clear picture of where you are and where you need to go.'
    },
    {
      title: 'Process Mapping & Design: Turning Complexity into Clarity',
      content: 'Using 3-level process modeling, we map your operations from strategic overview to task-level detail. We design optimized workflows that eliminate waste, reduce handoffs, and embed automation and governance checkpoints — creating a clear blueprint for execution.'
    },
    {
      title: 'Process Engineering & System Architecture: Building the Backbone of Scalable Execution',
      content: 'We architect the technology layer that powers your redesigned processes — integrating BPM platforms, RPA, AI, and analytics into a cohesive system. Every component is designed for scalability, resilience, and seamless integration with your existing enterprise stack.'
    },
    {
      title: 'Process Validation & Governance Setup: Ensuring Quality, Compliance & Performance',
      content: 'Before go-live, we validate every process against quality benchmarks, compliance requirements, and performance KPIs. We establish governance frameworks including three lines of defense, audit trails, and role-based access controls for sustained operational trust.'
    },
    {
      title: 'Continuous Optimization & Transformation Support: Scaling for Growth, Efficiency & Innovation',
      content: 'Post-deployment, we provide ongoing monitoring, analytics-driven optimization, and change management support. Our teams continuously identify improvement opportunities, scale automation across new functions, and ensure your processes evolve with your business.'
    }
  ];

  const processRedesignSection = (
    <section className="py-20 lg:py-28 bg-[#FAFAFA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header: Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              How We Help Redesign Your Business Process for <span className="text-transparent bg-clip-text bg-brand-gradient italic">Peak Performance</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full"></div>
          </div>
          <div className="lg:w-1/2 flex items-end">
            <p className="text-lg text-gray-500 leading-relaxed">
              Whether you're starting from scratch or need to optimize what exists, we provide a blueprint for success. The result you get are two: <strong className="text-gray-900 dark:text-white">1) End to operational ambiguity</strong> and <strong className="text-gray-900 dark:text-white">2) Measurable efficiency.</strong>
            </p>
          </div>
        </div>

        {/* Steps Accordion */}
        <div className="space-y-3">
          {processSteps.map((step, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-gray-900 dark:border-gray-800 border rounded-2xl transition-all duration-300 overflow-hidden ${openStep === idx ? 'border-gray-300 shadow-lg' : 'border-gray-100 hover:border-gray-200'}`}
            >
              <button
                onClick={() => setOpenStep(openStep === idx ? null : idx)}
                className="w-full flex items-center gap-5 p-5 lg:p-6 text-left"
              >
                <span className="shrink-0 w-14 h-10 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center text-xs font-bold text-gray-500 tracking-wide">
                  Step {idx + 1}
                </span>
                <span className="flex-1 text-base lg:text-lg font-semibold text-gray-900 dark:text-white tracking-tight leading-snug">
                  {step.title}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`text-gray-400 shrink-0 transition-transform duration-300 ${openStep === idx ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <div className={`transition-all duration-300 ${openStep === idx ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="px-5 lg:px-6 pb-6 pl-24">
                  <p className="text-gray-500 leading-relaxed">{step.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ============================================
  // "CHOOSE YOUR PREFERENCE" — 3-Tab Selector
  // ============================================
  const [activePreference, setActivePreference] = React.useState(0);

  const preferences = [
    {
      label: 'From Scratch Process Development',
      icon: <Workflow className="w-5 h-5" />,
      scenario: 'From Scratch Process Development',
      steps: [
        'Conduct discovery workshops to understand business goals and operational gaps.',
        'Identify core functions needing structured workflows.',
        'Design and map end-to-end business processes.',
        'Build automation-ready process architecture.',
        'Implement governance, compliance, and quality checkpoints.',
        'Deploy and stabilize with change management support.'
      ]
    },
    {
      label: 'Update of Existing Business Process',
      icon: <Settings className="w-5 h-5" />,
      scenario: 'Update of Existing Business Process',
      steps: [
        'Review existing processes and documentation.',
        'Conduct gap analysis to identify inefficiencies and pain points.',
        'Redesign workflows for agility, scalability, and automation.',
        'Integrate RPA and AI to eliminate manual bottlenecks.',
        'Validate updated processes against compliance benchmarks.',
        'Roll out with training and continuous improvement cadence.'
      ]
    },
    {
      label: 'Audit of Existing Business Process',
      icon: <Search className="w-5 h-5" />,
      scenario: 'Audit of Existing Business Process',
      steps: [
        'Perform a full audit of current workflows, roles, and tools.',
        'Benchmark processes against industry standards.',
        'Identify risks, redundancies, and improvement opportunities.',
        'Deliver a prioritized recommendations report.',
        'Provide automation readiness scores for each process.',
        'Define a transformation roadmap with quick wins and long-term initiatives.'
      ]
    }
  ];

  const bpmPreferenceSection = (
    <section className="py-20 lg:py-28 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header: Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              Choose Your Preference of <span className="text-transparent bg-clip-text bg-brand-gradient italic">BPM Service</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full"></div>
          </div>
          <div className="lg:w-1/2 flex items-end">
            <p className="text-lg text-gray-500 leading-relaxed">
              We help enterprise businesses at any stage of the process journey. If you have no defined processes, we build them from the ground up. If your processes exist but feel outdated, we will update and streamline them. And if you just want to improve, we audit what you have and show you exactly where to fix it.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 justify-center">
          {preferences.map((pref, idx) => (
            <button
              key={idx}
              onClick={() => setActivePreference(idx)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 border ${
                activePreference === idx
                  ? 'bg-white dark:bg-gray-900 dark:border-gray-800 border-gray-900 text-gray-900 dark:text-white shadow-md'
                  : 'bg-white dark:bg-gray-900 dark:border-gray-800 border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className={`${activePreference === idx ? 'text-brand-blue' : 'text-gray-400'}`}>
                {pref.icon}
              </span>
              {pref.label}
            </button>
          ))}
        </div>

        {/* Scenario Card */}
        <div className="bg-[#FAFAFA] border border-gray-100 rounded-3xl p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Scenario Name */}
            <div className="lg:w-2/5">
              <span className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-3 block">Scenario</span>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-snug">
                {preferences[activePreference].scenario}
              </h3>
            </div>

            {/* Right: Steps */}
            <div className="lg:w-3/5">
              <span className="text-xs font-bold text-brand-blue tracking-[0.2em] uppercase mb-6 block">Our Step-by-Step Approach</span>
              <div className="space-y-5">
                {preferences[activePreference].steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-4">
                    <div className="shrink-0 w-7 h-7 bg-brand-gradient rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      {sIdx + 1}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Combine post-WhyKangqore sections
  const postWhyKangqoreSections = (
    <>
      {processRedesignSection}
      {bpmPreferenceSection}
    </>
  );

  // ============================================
  // ASSEMBLE PAGE DATA
  // ============================================
  const pageData = {
    service: {
      ...service,
      technologies,
      technologiesTitle: 'Tools & Technologies',
      technologiesDescription: 'We implement on your preferred stack — integrating with leading BPM platforms, RPA tools, analytics engines, and enterprise systems.',
      capabilities,
      industryTitle: 'Industry Solutions that Drive Real Value.',
      trustPillars,
      trustPillarsRightTitle: 'Our Operational Approach',
      trustPillarsRightDescription: 'Kangqore combines technology-led innovation, customer-first design, flexible engagement models, and embedded compliance to deliver BPM programs that scale with confidence and measurable results.',
      trustPillarsRightButton: 'Request Assessment',
      preWhyKangqoreSections,
      whyKangqoreIntro,
      whyKangqore,
      postWhyKangqoreSections,
      postIndustrySections: (
        <section className="py-20 lg:py-28 bg-white dark:bg-black relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-1.5 bg-brand-blue/20 rounded-full mx-auto mb-10"></div>
            <p className="text-3xl lg:text-[2.75rem] font-bold text-gray-900 dark:text-white tracking-tight leading-[1.2] font-display">
              When growth outpaces structure, complexity becomes the bottleneck. <span className="text-transparent bg-clip-text bg-brand-gradient italic">Kangqore brings discipline to operations</span>—designing BPM programs that deliver measurable outcomes, not slideware.
            </p>
            <div className="w-16 h-1.5 bg-brand-blue/20 rounded-full mx-auto mt-10"></div>
          </div>
        </section>
      ),
      customFAQs,
      postFAQSections: relatedOfferings
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default BusinessProcessManagement;
