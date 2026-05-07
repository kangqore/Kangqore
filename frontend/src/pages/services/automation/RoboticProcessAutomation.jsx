import React from 'react';
import { Activity, Bot, BrainCircuit, Cpu, Layers, Lock, Search, Settings, Shield, Target, Workflow, Zap, CheckCircle2, BarChart3, FileText, Users, Factory, Building2, Heart, ShoppingCart, Radio, Database, Cloud, LineChart } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { Link } from 'react-router-dom';

const RoboticProcessAutomation = () => {
  // ============================================
  // 1) HERO SECTION
  // ============================================
  const service = {
    name: 'Robotic Process Automation',
    titleLine1: 'Robotic Process',
    titleHighlight: 'Automation',
    slug: 'robotic-process-automation',
    shortDescription: 'Integrate RPA with AI, ML, and knowledge-based systems to drive enterprise-wide transformation.',
    videoBackground: '/videos/working-machine-4751312.mp4',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Robotic Process Automation as a Service</h2>
        <p className="font-light tracking-tight leading-snug opacity-80">
          Kangqore's RPA as a Service helps you automate high-volume, repetitive tasks across IT and business operations—combining bots with AI to reduce cost, improve accuracy, and scale faster.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    stats: [
      { value: 'Automate', label: 'IT & Business processes', color: 'text-blue-500' },
      { value: 'Reduce', label: 'Operational cost', color: 'text-brand-blue' },
      { value: 'Increase', label: 'Efficiency', color: 'text-indigo-500' },
      { value: 'Improve', label: 'Compliance', color: 'text-purple-500' }
    ],

    // ============================================
    // 2–4) HIGH FIDELITY SECTIONS
    // ============================================
    highFidelity: {
      // 2) "Where RPA Fits"
      narrative: {
        badge: 'ENTERPRISE AUTOMATION :: 2026',
        titleLine1: 'Drive',
        titleHighlight: 'Transformation.',
        titleLine2: 'Reduce Cost.',
        description: 'With the shared services and business process outsourcing industry maturing, clients are demanding increased operational efficiency and higher transactional volumes. These conflicting requirements of increased efficiency and reduced costs are together fostering the shift towards robotic process automation.',
        bottleneckLabel: 'The Challenge',
        bottleneckText: 'Manual processes, legacy system silos, rising operational costs, and increasing transactional volumes demanding price cuts while maintaining quality.',
        requirementLabel: 'Our Solution',
        requirementText: 'Select the most appropriate RPA operating & governance model, assess and prioritize automation opportunities, build business cases, and implement scalable automation solutions.',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
        statusLabel: 'Automation Maturity',
        statusValue: 'Enterprise'
      },
      // 4) RPA Framework
      philosophy: {
        icon: <Cpu className="w-7 h-7 text-brand-blue" />,
        title: 'RPA',
        titleHighlight: 'End-to-End.',
        description: 'Our highly skilled RPA experts work alongside your business and IT teams to continuously identify processes ripe for automation, select suitable RPA technology, develop automation workflows, and help sustain your robot workforce.',
        pills: ['RPA Assessment', 'Process Discovery', 'Bot Development', 'Managed Services']
      },
      // 3) Delivery Model
      matrix: {
        engineId: 'Engine :: RPA_Core_V4',
        title: 'RPA Delivery Model',
        subtext: 'A structured approach empowering organizations to select the right operating model, prioritize automation opportunities, build business cases, and implement scalable solutions.',
        layers: [
          { title: 'Assess & Prioritize', id: 'RPA_ASSESS', icon: <Search />, desc: 'Assess and prioritize automation opportunities according to current automation rates, transactional volume, and ease of implementation.' },
          { title: 'Build Business Case', id: 'RPA_BIZ', icon: <BarChart3 />, desc: 'Build business case and verify its value during a first RPA pilot to secure management buy-in and align key stakeholders.' },
          { title: 'Implement & Develop', id: 'RPA_IMPL', icon: <Settings />, desc: 'Implement and develop services to create simple screen automation as well as cognitive robots for complex processes.' },
          { title: 'Sustain & Scale', id: 'RPA_SCALE', icon: <Zap />, desc: 'Help sustain robot workforce with continuous process identification, monitoring, optimization, and enterprise-wide scaling.' }
        ]
      },
      schematic: {
        titleLine1: 'Maximize',
        titleHighlight: 'Efficiency.',
        description: 'Create a digital workforce that is reliable, secure, and scalable — whether you are starting your RPA journey or expanding intelligent automation.',
        stats: [
          { label: 'Reliability', val: 'PROVEN' },
          { label: 'Security', val: 'HARDENED' },
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
  // 5) CAPABILITIES CAROUSEL — 3 categories
  // ============================================
  const capabilities = [
    {
      title: 'IT Process Automation',
      bgImage: '/images/capabilities/quality-testing.png',
      description: 'Improve accuracy and consistency of IT processes while saving time and cost.',
      items: [
        { heading: 'IT Operations Management', description: 'Automate repetitive and routine IT tasks to reduce downtime and improve incident management process.' },
        { heading: 'IT Services Management', description: 'Automate L1 and L2 support services that handled repetitive, manual processes.' },
        { heading: 'Security Operations Center', description: 'Automatically detect security threats across enterprise systems, send alerts, eliminate potential risks, and test security systems periodically to ensure they actually work and stay up to date.' },
        { heading: 'Repetitive Control Activities', description: 'Automate repetitive control activities and ensure controls are consistent across systems for easier audits and lesser findings.' }
      ]
    },
    {
      title: 'Business Process Automation',
      bgImage: '/images/capabilities/quality-testing.png',
      description: 'Scale your business to grow and enhance customer service without deploying any additional resources.',
      items: [
        'Human Resource',
        'New employee on boarding and off-boarding process',
        'Process candidate notifications pertaining to interviews, selections and feedback',
        'Streamline data across disparate systems for consolidating information from upstream to downstream systems',
        'Relationship management',
        'Employee account management',
        'Role based access management',
        'Finance and Accounting',
        'Payment Processing — source to pay process',
        'Fund accounting and management',
        'Credit operations',
        'Insurance',
        'Claims processing',
        'Corporate reporting',
        'Transaction processing',
        'Underwriting systems',
        'Insurance product management',
        'Customer Experience Management',
        '360-degree customer engagement',
        'Customer data management and insight discovery'
      ]
    },
    {
      title: 'Proof of Concept',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Explore new sources of value creation and prove the ROI of RPA implementation with a POC project.',
      tableData: {
        columns: ['Phase', 'POC Selection', 'Process Reengineering', 'Development and Testing'],
        rows: [
          { label: 'Activities', values: ['Determine complexity\nEstimate business value impact', 'Interview stakeholders\nEvaluate process efficiency', 'Install RPA platform\nDevelop automation solution'] },
          { label: 'Effort', values: ['1–2 days', '2 days', '5–7 days'] },
          { label: 'Stakeholders Involved', values: ['Business SME, RPA expert', 'Business SME, RPA expert', 'RPA COE'] }
        ]
      }
    }
  ];

  // ============================================
  // 6) GOVERNANCE & CONTROLS → Trust Pillars
  // ============================================
  const trustPillars = [
    {
      title: 'RPA Operating Model',
      tag: 'Governance',
      description: 'Select the most appropriate RPA operating & governance model, change management plan, and deployment strategy tailored to your organization\'s needs.'
    },
    {
      title: 'Process Assessment',
      tag: 'Discovery',
      description: 'Assess and prioritize automation opportunities and channel efforts according to current automation rates, transactional volume, and ease of implementation.'
    },
    {
      title: 'Business Case Validation',
      tag: 'ROI',
      description: 'Build business case and verify its value during a first RPA pilot to secure management buy-in and align key stakeholders across the organization.'
    },
    {
      title: 'Implementation & Cognitive Bots',
      tag: 'Development',
      description: 'Implement and develop services to create simple screen automation as well as cognitive robots that integrate AI, ML, and knowledge-based systems for complex processes.'
    }
  ];

  // ============================================
  // 11) TOOLS & TECHNOLOGIES — 3 columns
  // ============================================
  const technologies = [
    { category: 'RPA Platforms', items: ['UiPath', 'Automation Anywhere', 'Blue Prism', 'Power Automate'] },
    { category: 'Process Discovery', items: ['Celonis', 'Signavio', 'UiPath Process Mining', 'Minit'] },
    { category: 'Workflow & Orchestration', items: ['ServiceNow', 'Camunda', 'Appian', 'Pega', 'Salesforce Flow'] }
  ];

  // ============================================
  // 9) WHY KANGQORE — 5 proof cards
  // ============================================
  const whyKangqoreIntro = `At Kangqore, we work with companies of all sizes to create a digital workforce that is reliable, secure, and scalable. Whether you want to start your RPA journey or have already deployed RPA and want to start intelligent automation, our experts can help you.`;

  const whyKangqore = [
    {
      title: 'End-to-End RPA Services',
      description: 'From process assessment and opportunity discovery to bot development, deployment, and managed services — we cover the full RPA lifecycle.'
    },
    {
      title: 'IT & Business Process Expertise',
      description: 'Deep expertise in automating both IT processes (operations, service management, security) and business processes (HR, finance, insurance, customer experience).'
    },
    {
      title: 'Proven POC Methodology',
      description: 'Structured POC approach — from selection (1–2 days) to process reengineering (2 days) to development and testing (5–7 days) — ensuring rapid time-to-value.'
    },
    {
      title: 'AI & Cognitive Integration',
      description: 'Go beyond basic screen automation with cognitive robots that leverage AI, ML, and knowledge-based systems for intelligent process automation.'
    },
    {
      title: 'Scalable Governance',
      description: 'Select the right operating model, governance framework, and change management plan to scale from pilot to enterprise-wide automation with confidence.'
    }
  ];

  // ============================================
  // 10) INDUSTRIES
  // ============================================
  const industries = [
    { name: 'Banking, Financial Services & Insurance' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Manufacturing & Energy' },
    { name: 'Retail, CPG & Logistics' },
    { name: 'Hi-Tech & Media' }
  ];

  // ============================================
  // 12) FAQ — 6 crisp Q&As
  // ============================================
  const customFAQs = [
    {
      question: 'What is RPA and how can it help my organization?',
      answer: 'RPA (Robotic Process Automation) deploys software bots that mimic human actions on applications to execute high-volume, rules-based tasks. It helps organizations reduce operational cost, improve accuracy, increase efficiency, and free up employees to focus on higher-value work. RPA can automate both IT processes and business processes across your enterprise.'
    },
    {
      question: 'What IT processes can be automated with RPA?',
      answer: 'Our IT Process Automation covers IT Operations Management (reducing downtime, improving incident management), IT Services Management (automating L1/L2 support), Security Operations (threat detection, alerts, compliance testing), and repetitive control activities (ensuring consistent controls across systems for easier audits).'
    },
    {
      question: 'What business processes can be automated?',
      answer: 'We automate across Human Resources (onboarding, offboarding, candidate notifications), Finance & Accounting (payment processing, fund accounting, credit operations), Insurance (claims processing, underwriting, corporate reporting), and Customer Experience Management (360-degree engagement, customer data management, and insight discovery).'
    },
    {
      question: 'How does the Proof of Concept process work?',
      answer: 'Our structured POC approach has three phases: POC Selection (1–2 days) to determine complexity and estimate business value, Process Reengineering (2 days) to interview stakeholders and evaluate process efficiency, and Development & Testing (5–7 days) to install the RPA platform and develop the automation solution.'
    },
    {
      question: 'How do you select and prioritize automation opportunities?',
      answer: 'We assess and prioritize automation opportunities according to current automation rates, transactional volume, and ease of implementation. We help build a business case and verify its value during a first RPA pilot to secure management buy-in and align key stakeholders.'
    },
    {
      question: 'Can RPA integrate with AI and cognitive technologies?',
      answer: 'Yes. Kangqore\'s RPA services are designed to integrate with AI, machine learning, and knowledge-based systems. Beyond simple screen automation, we develop cognitive robots that can handle complex processes requiring document understanding, decision support, and intelligent data processing.'
    }
  ];

  // ============================================
  // 7) RPA CoE — Custom JSX Section
  // ============================================
  const rpaCoESection = (
    <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black" id="rpa-coe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Text */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
              Center of Excellence
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display leading-[0.95]">
              RPA CoE <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">in a Box.</span>
            </h2>
            <div className="w-20 h-1.5 bg-brand-blue/20 rounded-full mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-xl">
              Our highly skilled RPA experts work alongside your business and IT teams to continuously identify processes ripe for automation, select RPA technology suitable for your processes, develop automation workflows, and help sustain your robot workforce.
            </p>
            <div className="space-y-4 mb-10">
              {[
                { icon: <Search className="w-5 h-5" />, title: 'Process Discovery', desc: 'Identify and prioritize automation opportunities based on volume, complexity, and ROI' },
                { icon: <Settings className="w-5 h-5" />, title: 'RPA Technology Selection', desc: 'Select the right RPA platform and tools for your specific process requirements' },
                { icon: <Workflow className="w-5 h-5" />, title: 'Automation Workflows', desc: 'Develop screen automation and cognitive robots for simple and complex processes' },
                { icon: <BarChart3 className="w-5 h-5" />, title: 'Sustain & Optimize', desc: 'Continuous monitoring, optimization, and scaling of your digital workforce' }
              ].map((item, idx) => (
                <div key={idx} className="group flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
                  <div className="w-10 h-10 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl flex items-center justify-center text-brand-blue shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-base">{item.title}</div>
                    <div className="text-gray-500 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl"
            >
              Build an RPA CoE with Kangqore
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Right: Visual */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-square w-full max-w-[500px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              
              {/* Central Hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <Bot className="w-20 h-20 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
              </div>

              {/* Satellite Nodes */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <div className="w-20 h-20 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-blue-50 hover:-translate-y-2 transition-all">
                  <Cpu className="w-10 h-10 text-blue-600" />
                </div>
                <span className="block text-center text-[10px] font-bold text-gray-400 tracking-[0.15em] mt-2 uppercase">IT Ops</span>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="w-20 h-20 bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center hover:translate-y-2 transition-all">
                  <BarChart3 className="w-10 h-10 text-emerald-400" />
                </div>
                <span className="block text-center text-[10px] font-bold text-gray-400 tracking-[0.15em] mt-2 uppercase">BPA</span>
              </div>
              <div className="absolute top-1/2 left-4 -translate-y-1/2">
                <div className="w-20 h-20 bg-brand-gradient rounded-2xl shadow-xl flex items-center justify-center hover:-translate-x-2 transition-all">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <span className="block text-center text-[10px] font-bold text-gray-400 tracking-[0.15em] mt-2 uppercase">Security</span>
              </div>
              <div className="absolute top-1/2 right-4 -translate-y-1/2">
                <div className="w-20 h-20 bg-cyan-500 rounded-2xl shadow-xl flex items-center justify-center hover:translate-x-2 transition-all">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <span className="block text-center text-[10px] font-bold text-gray-400 tracking-[0.15em] mt-2 uppercase">POC</span>
              </div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="rpa-coe-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <path d="M250,250 L250,80" stroke="url(#rpa-coe-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L250,420" stroke="url(#rpa-coe-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L80,250" stroke="url(#rpa-coe-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L420,250" stroke="url(#rpa-coe-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <circle r="3" fill="#2564ea"><animateMotion path="M250,250 L250,80" dur="2s" repeatCount="indefinite" /></circle>
                <circle r="3" fill="#22d3ee"><animateMotion path="M250,250 L80,250" dur="2.5s" repeatCount="indefinite" /></circle>
                <circle r="3" fill="#10b981"><animateMotion path="M250,250 L250,420" dur="3s" repeatCount="indefinite" /></circle>
                <circle r="3" fill="#8b5cf6"><animateMotion path="M250,250 L420,250" dur="2.2s" repeatCount="indefinite" /></circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // ============================================
  // 8) TOP RPA USE CASES — Custom JSX Grid
  // ============================================
  const useCasesSection = (
    <section className="py-20 lg:py-28 bg-[#F5F5F7] relative overflow-hidden" id="rpa-use-cases">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            Proven Applications
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display leading-[0.95]">
            Top RPA <span className="text-transparent bg-clip-text bg-brand-gradient italic">Use Cases.</span>
          </h2>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
            Automation across IT operations and business processes — from HR and finance to insurance and customer experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              function: 'IT Operations',
              icon: <Cpu className="w-6 h-6" />,
              cases: [
                { process: 'IT Operations Management', systems: 'Monitoring, ITSM tools', outcome: 'Reduced downtime, faster incident resolution' },
                { process: 'IT Services Management', systems: 'ServiceNow, Jira, ITSM', outcome: 'Automated L1/L2 support tasks' },
                { process: 'Security Operations', systems: 'SIEM, endpoint tools', outcome: 'Automated threat detection & response' },
                { process: 'Control Activities', systems: 'Compliance systems', outcome: 'Consistent controls, easier audits' }
              ]
            },
            {
              function: 'HR & People',
              icon: <Users className="w-6 h-6" />,
              cases: [
                { process: 'Employee onboarding/offboarding', systems: 'HRIS, AD, IT systems', outcome: 'Seamless day-1 readiness' },
                { process: 'Candidate notifications', systems: 'ATS, Email platforms', outcome: 'Timely interview/selection updates' },
                { process: 'Data consolidation', systems: 'Multiple HR systems', outcome: 'Upstream-to-downstream sync' },
                { process: 'Access management', systems: 'IAM, AD, ITSM', outcome: 'Role-based provisioning' }
              ]
            },
            {
              function: 'Finance & Insurance',
              icon: <Building2 className="w-6 h-6" />,
              cases: [
                { process: 'Payment processing', systems: 'ERP, Bank portals', outcome: 'Source-to-pay automation' },
                { process: 'Fund accounting', systems: 'GL, ERP systems', outcome: 'Automated fund management' },
                { process: 'Claims processing', systems: 'Claims platforms', outcome: 'Faster claims resolution' },
                { process: 'Underwriting systems', systems: 'Policy admin systems', outcome: 'Automated risk assessment' }
              ]
            },
            {
              function: 'Customer Experience',
              icon: <Heart className="w-6 h-6" />,
              cases: [
                { process: '360° customer engagement', systems: 'CRM, multi-channel', outcome: 'Unified customer view' },
                { process: 'Data management & insights', systems: 'Data platforms, CRM', outcome: 'Actionable customer insights' },
                { process: 'Corporate reporting', systems: 'BI tools, ERP', outcome: 'Automated report generation' }
              ]
            }
          ].map((group, gIdx) => (
            <div key={gIdx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-500 border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center text-white">
                  {group.icon}
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">{group.function}</h3>
              </div>
              <div className="space-y-4">
                {group.cases.map((useCase, cIdx) => (
                  <div key={cIdx} className="border-l-2 border-blue-100 pl-4 py-1">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">{useCase.process}</div>
                    <div className="text-xs text-gray-400 font-mono">{useCase.systems}</div>
                    <div className="text-xs text-brand-blue font-medium">{useCase.outcome}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Combine CoE + Use Cases into preWhyKangqoreSections
  const preWhyKangqoreSections = (
    <>
      {rpaCoESection}
      {useCasesSection}
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
            Kangqore offers a range of offerings designed to aid and speed up digital transformation across a variety of journeys.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              name: 'Digital Process Automation',
              link: '/services/automation/digital-process-automation',
              icon: <Workflow className="w-5 h-5" />,
              desc: 'Digital Automation has become a key imperative for organizations to optimize their business processes.'
            },
            {
              name: 'AI & Cognitive Computing',
              link: '/services/data-ai/cognitive-services',
              icon: <BrainCircuit className="w-5 h-5" />,
              desc: 'Couple augmented intelligence with cognitive computing to enable smarter decision-making.'
            },
            {
              name: 'Big Data Engineering',
              link: '/services/data-ai/data-engineering',
              icon: <Database className="w-5 h-5" />,
              desc: 'Build the data pipelines and engineering capabilities that power your automation programs.'
            },
            {
              name: 'GenAI',
              link: '/services/data-ai/generative-ai',
              icon: <Target className="w-5 h-5" />,
              desc: 'Drive innovation at scale with responsible and secure Generative AI capabilities.'
            },
            {
              name: 'Agentic AI',
              link: '/services/data-ai/agentic-ai',
              icon: <BrainCircuit className="w-5 h-5" />,
              desc: 'Empower enterprises with intelligent agents that act, decide, and collaborate autonomously.'
            },
            {
              name: 'Data Science',
              link: '/services/data-ai/data-science',
              icon: <LineChart className="w-5 h-5" />,
              desc: 'Find innovative ways to unlock insights and drive data-driven decision making.'
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
      technologiesDescription: 'We implement on your preferred stack and integrate with enterprise systems across IT and business operations.',
      capabilities,
      trustPillars,
      trustPillarsRightTitle: 'Enterprise RPA Governance',
      trustPillarsRightDescription: 'Kangqore helps organizations select the most appropriate RPA operating & governance model, assess and prioritize automation opportunities, build validated business cases, and implement scalable solutions — from simple screen automation to cognitive robots.',
      trustPillarsRightButton: 'Get in Touch',
      preWhyKangqoreSections,
      whyKangqoreIntro,
      whyKangqore,
      industriesTitle: 'Enterprise Automation Across Industries',
      industries,
      customFAQs,
      postFAQSections: relatedOfferings
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default RoboticProcessAutomation;
