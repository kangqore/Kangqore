import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { 
  Search, 
  Layers, 
  Activity, 
  Zap, 
  ShieldCheck,
  RefreshCw,
  Cloud,
  Globe,
  Cpu,
  ArrowRight, 
  ChevronRight, 
  Database,
  Code,
  Smartphone,
  Layout,
  Lock,
  Workflow,
  TrendingUp,
  Users,
  Building2,
  Heart,
  ShoppingCart,
  Factory,
  Plane,
  Film,
  Home,
  Rocket,
  Settings,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LegacyModernization = () => {
  // ============================================
  // SERVICE INFORMATION
  // ============================================
  
  const service = {
    name: 'Legacy Application Modernization',
    slug: 'legacy-modernization',
    shortDescription: 'REVAMP. MODERNIZE. SCALE.',
    fullDescription: (
      <div className="space-y-4">
        <p>Revamp your legacy systems with future-ready modernization services. Our legacy application modernization services are designed to eliminate these challenges by transitioning your mission-critical systems to modern, cloud-native, and scalable architectures.</p>
        <p>We focus on enhancing performance, improving maintainability, and ensuring seamless integration with emerging technologies, so your software evolves with your business. Your first consultation is on us!</p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    imageClassName: 'aspect-[4/5]',
    fullWidthCustomOverview: true,
    primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    stats: [
      { value: '100+', label: 'Systems Modernized', color: 'text-cyan-400' },
      { value: 'Cloud-Native', label: 'Architecture', color: 'text-blue-400' },
      { value: 'Zero', label: 'Downtime Migration', color: 'text-purple-400' },
      { value: 'Scalable', label: 'Future-Ready', color: 'text-orange-400' },
    ],
    highFidelity: {
      narrative: {
        badge: 'MODERNIZATION EXCELLENCE :: 2026',
        titleLine1: 'Revamp Legacy.',
        titleHighlight: 'Build Modern.',
        titleLine2: 'Scale Future.',
        description: 'Revamp your legacy systems with future-ready modernization services. We transition your mission-critical systems to modern, cloud-native, and scalable architectures — enhancing performance, improving maintainability, and ensuring seamless integration with emerging technologies.',
        bottleneckLabel: 'The Challenge',
        bottleneckText: 'Aging systems, technical debt & integration bottlenecks.',
        requirementLabel: 'The Outcome',
        requirementText: 'Modern, scalable & cloud-native enterprise systems.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        statusLabel: 'System State',
        statusValue: 'MODERNIZED'
      },
      philosophy: {
        icon: <RefreshCw className="w-7 h-7 text-brand-blue" />,
        title: 'Modernization is',
        titleHighlight: 'Outcome-First.',
        description: 'We believe every modernization engagement should deliver compounding enterprise value — not just deliverables, but lasting organizational capability, reduced technical debt, and future-proof architecture.',
        pills: ['Cloud-Native', 'Zero Downtime', 'Scalable', 'Future-Ready']
      },
      matrix: {
        engineId: 'Engine :: MOD_LIFECYCLE_V3',
        title: 'Modernization Lifecycle',
        subtext: 'A structured 7-phase methodology that moves your legacy systems from technical debt to modernized, scalable architecture.',
        layers: [
          { title: 'Discovery', id: 'MOD_DISC', icon: <Search />, desc: 'Comprehensive assessment of legacy landscape, architecture, codebase, dependencies, and integration points.' },
          { title: 'Strategy', id: 'MOD_STRAT', icon: <Layers />, desc: 'Define the right modernization path — rehost, refactor, rearchitect, or rewrite — based on risk and value.' },
          { title: 'Pilot', id: 'MOD_PILOT', icon: <Zap />, desc: 'Validate approach with a critical module before full-scale rollout to reduce risk and build confidence.' },
          { title: 'Migrate', id: 'MOD_MIG', icon: <Activity />, desc: 'Phased, modular migration and development — delivering value incrementally while keeping business running.' }
        ]
      },
      schematic: {
        titleLine1: 'Transform Legacy.',
        titleHighlight: 'Accelerate Growth.',
        description: 'Your modernization journey should fuel undisputed competitive advantage — eliminating technical debt while enabling innovation at scale.',
        stats: [
          { label: 'Performance', val: 'OPTIMIZED' },
          { label: 'Scalability', val: 'UNLIMITED' },
          { label: 'Tech Debt', val: 'ELIMINATED' }
        ]
      }
    }
  };

  const department = {
    name: 'Digital Transformation & Modernization',
    slug: 'digital-transformation-modernization',
    description: 'Transform your business with cutting-edge digital transformation & modernization solutions.'
  };

  // ============================================
  // TECHNOLOGIES (Chips Grid — categorized)
  // ============================================
  const technologies = [
    { category: 'Frontend Technologies', items: ['React', 'Angular', 'Vue.js', 'Next.js', 'Astro', 'HTML5', 'CSS'] },
    { category: 'Backend Technologies', items: ['.Net', 'Java', 'NodeJS', 'Python', 'PHP', 'GO'] },
    { category: 'Mobile', items: ['iOS', 'Android', 'Xamarin', 'Cordova', 'PWA', 'React Native', 'Flutter'] },
    { category: 'Cloud Technologies', items: ['AWS', 'Microsoft Azure', 'Google Cloud'] },
    { category: 'Databases / Data Storages', items: ['MySQL', 'SQL Server', 'MongoDB', 'Amazon S3', 'Amazon RDS', 'Cassandra'] },
    { category: 'DevOps', items: ['Linux', 'Linode', 'Jenkins', 'Terraform', 'Digital Ocean', 'Ansible', 'Chef', 'Puppet', 'Kubernetes', 'Docker'] }
  ];

  // ============================================
  // CAPABILITIES (11 Service Cards)
  // ============================================
  const capabilities = [
    {
      title: 'Application Modernization Consulting',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Looking for in-depth analysis and strategic guidance to assess your current application landscape? Our modernization experts identify areas for improvement, prioritize modernization efforts, and develop a tailored roadmap for your software modernization journey, all while ensuring your software aligns with your business objectives and remains competitive.',
      items: [
        'Current state assessment & gap analysis',
        'Modernization roadmap development',
        'Technology stack evaluation',
        'Business alignment strategy'
      ]
    },
    {
      title: 'Application Migration Services',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'We specialize in migrating your applications to modern platforms, such as cloud environments. Whether you are moving from on-premises systems or older cloud solutions, our migration services ensure a seamless transition with focus on scalability, flexibility, and cost-efficiency.',
      items: [
        'Cloud migration (AWS, Azure, GCP)',
        'On-premises to cloud transition',
        'Zero-downtime migration strategies',
        'Post-migration optimization'
      ]
    },
    {
      title: 'Software Re-Engineering',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Our re-engineering services involve a comprehensive overhaul of your software to enhance its performance, functionality, and architecture. We refactor code, improve user interfaces, and revamp the underlying structure to bring your software up to date with the latest industry standards.',
      items: [
        'Code refactoring & optimization',
        'Architecture modernization',
        'Performance enhancement',
        'Technical debt elimination'
      ]
    },
    {
      title: 'Data Integration Services',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'Several organizations struggle with data silos due to legacy systems. We provide data integration solutions that bridge the gap between old and new data sources, facilitating data accessibility and giving you a detailed look into the analytics side.',
      items: [
        'Data silo elimination',
        'ETL pipeline development',
        'Real-time data synchronization',
        'Analytics enablement'
      ]
    },
    {
      title: 'UI/UX Modernization',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'Enhance your software user interface and user experience to ensure it is visually appealing, user-friendly, and responsive across devices. Our modernization service focuses on aesthetics, usability, accessibility, and performance, giving your application a competitive edge in the digital space.',
      items: [
        'Responsive design implementation',
        'Accessibility compliance (WCAG)',
        'Modern UI frameworks adoption',
        'User research & testing'
      ]
    },
    {
      title: 'Data Modernization',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'We offer data modernization services to help you manage, transform, and utilize your critical business data efficiently. This includes migrating data to cloud platforms, optimizing data storage, and implementing advanced analytics for better decision-making.',
      items: [
        'Cloud data migration',
        'Data storage optimization',
        'Advanced analytics implementation',
        'Data governance frameworks'
      ]
    },
    {
      title: 'Digital Transformation Services',
      bgImage: '/images/capabilities/digital-transformation.png',
      description: 'Leveraging digital transformation services can help you to revamp business processes, enhance efficiency, agility, and resilience, all while optimizing ROI. With a deep understanding of your unique needs, we help you evolve your existing software and applications, seamlessly integrate them into your new digital ecosystem, or repurpose their components efficiently.',
      items: [
        'Business process re-engineering',
        'Digital ecosystem integration',
        'Legacy component repurposing',
        'ROI-driven transformation'
      ]
    },
    {
      title: 'Cloud-Native Development',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Our experts build and optimize applications specifically for cloud environments, leveraging containerization and microservices to ensure scalability and resilience. This approach is ideal for businesses aiming to maximize cloud benefits.',
      items: [
        'Container orchestration (Kubernetes)',
        'Microservices architecture',
        'Serverless computing',
        'Cloud-native CI/CD pipelines'
      ]
    },
    {
      title: 'API Development And Integration',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Enable seamless connectivity across your systems with robust API development and integration. We help you design and implement secure, scalable APIs that connect internal modules and integrate third-party services, enhancing interoperability, accelerating feature delivery, and supporting data-driven decision-making.',
      items: [
        'RESTful & GraphQL API design',
        'Third-party service integration',
        'API gateway implementation',
        'API security & versioning'
      ]
    },
    {
      title: 'Microservices Architecture Implementation',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Modernize your software architecture by transitioning to microservices. We help you decompose monolithic applications into modular, independent services, improving scalability, enabling faster deployments, and simplifying maintenance while preparing your system for cloud-native environments.',
      items: [
        'Monolith decomposition',
        'Service mesh implementation',
        'Event-driven architecture',
        'Independent deployment pipelines'
      ]
    },
    {
      title: 'Security & Compliance',
      bgImage: '/images/capabilities/cybersecurity.png',
      description: 'Our services encompass enhancing the security of your software through code audits, penetration testing, and the implementation of robust security protocols. This ensures your applications remain resilient against evolving threats and vulnerabilities.',
      items: [
        'Security code audits',
        'Penetration testing',
        'Compliance alignment (SOC 2, GDPR)',
        'Secure architecture design'
      ]
    }
  ];

  // ============================================
  // TRUST PILLARS (Advanced Technologies Accordion)
  // ============================================
  const trustPillars = [
    {
      title: 'Cloud Computing',
      tag: 'Infrastructure',
      description: 'Cloud computing provides a flexible, scalable, and cost-effective solution for legacy application modernization. By moving your legacy applications to the cloud, you can access vast computing resources on-demand, scale your operations with ease, and only pay for what you use. Plus, cloud platforms offer robust security measures, ensuring your data is protected.'
    },
    {
      title: 'Artificial Intelligence (AI)',
      tag: 'Intelligence',
      description: 'AI can breathe new life into your legacy software. From automating routine tasks to predicting user behavior, AI can significantly enhance your software capabilities. By integrating AI into your modernized software, you can improve efficiency, personalize user experiences, and gain valuable insights from your data.'
    },
    {
      title: 'Internet of Things (IoT)',
      tag: 'Connectivity',
      description: 'By seamlessly integrating IoT into your legacy systems, we unlock new levels of real-time data capture and analysis. This empowers your software with enhanced monitoring, control, and automation capabilities, ultimately leading to increased efficiency, informed decision-making, and a competitive edge in the digital landscape.'
    },
    {
      title: 'Blockchain',
      tag: 'Security',
      description: 'Blockchain modernization is particularly valuable in industries requiring robust authentication, transparency, and data privacy. Whether you are in finance, healthcare, supply chain, or any sector that demands tamper-proof records and transactions, blockchain modernization ensures that your legacy systems are not only up to date but also at the forefront of data security and accountability.'
    }
  ];

  // ============================================
  // CUSTOM SECTIONS (Related Offerings + Tailored Strategies)
  // ============================================
  const customSections = (
    <>
      {/* Tailored Modernization Strategies */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
                Modernization Strategies
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
                Adopting Tailored <span className="text-transparent bg-clip-text bg-brand-gradient">Strategies</span> For Optimal Results
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
                Every legacy system is unique. We recommend the right modernization strategy based on your system architecture, business value, and growth objectives.
              </p>
              <div className="space-y-4">
                {[
                  { 
                    name: 'Lift & Shift', 
                    icon: <Cloud className="w-5 h-5" />,
                    desc: 'Move existing applications to the cloud without code changes. Quick to implement with immediate benefits like improved scalability, flexibility, and reduced hardware costs.'
                  },
                  { 
                    name: 'Augment & Refactor', 
                    icon: <Code className="w-5 h-5" />,
                    desc: 'Make strategic code changes to improve performance and leverage new technologies. Integrating modern features, improving efficiency, and restructuring for scalability.'
                  },
                  { 
                    name: 'Rewrite', 
                    icon: <RefreshCw className="w-5 h-5" />,
                    desc: 'Completely redevelop your application using modern technologies and best practices. Most time-intensive but provides the most significant improvements in performance, scalability, and security.'
                  },
                  { 
                    name: 'Retiring', 
                    icon: <Settings className="w-5 h-5" />,
                    desc: 'Decommission legacy applications that are no longer needed or cost-effective to maintain. Reduces maintenance costs, streamlines IT infrastructure, and frees resources for higher-value areas.'
                  }
                ].map((strategy, idx) => (
                  <div 
                    key={idx} 
                    className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500"
                  >
                    <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                      {strategy.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{strategy.name}</span>
                      </div>
                      <p className="text-gray-500 leading-relaxed">{strategy.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 flex items-center gap-6">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl"
                >
                  Discuss Your Strategy 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="hidden sm:block text-sm text-gray-400 font-mono italic">
                  // MODERNIZING_LEGACY...
                </div>
              </div>
            </div>

            {/* Technical Schematic: Modernization Hub */}
            <div className="lg:w-5/12 relative">
              <div className="relative aspect-square w-full max-w-[550px] mx-auto">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 blur-[100px] rounded-full"></div>
                <div className="absolute inset-0 opacity-[0.05]" 
                     style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 flex flex-col gap-1 shadow-sm">
                  <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#KG_MOD_01</span></div>
                  <div className="flex justify-between gap-4"><span>PHASE:</span> <span>MODERNIZE</span></div>
                  <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">TRANSFORMING</span></div>
                </div>

                <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 shadow-sm animate-pulse-subtle">
                  <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">Migration Hub</div>
                  <div>PROCESSING_MODULES...</div>
                  <div>PROGRESS: 94%</div>
                </div>

                {/* Central Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                  <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                  <div className="relative">
                     <RefreshCw className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                    <Cpu className="w-7 h-7" />
                  </div>
                </div>

                {/* Satellite Clusters */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                      <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                      <Cloud className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Cloud</span>
                  </div>
                </div>

                <div className="absolute bottom-20 left-0 group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                      <Database className="w-12 h-12 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[11px] font-bold border border-white/20">API</div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Data</span>
                  </div>
                </div>

                <div className="absolute bottom-20 right-0 group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-300 overflow-hidden">
                      <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                      <div className="relative">
                        <Layers className="w-16 h-16 text-emerald-400" />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Microservices</span>
                  </div>
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                  <defs>
                    <linearGradient id="mod-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <path d="M250,250 L250,140" stroke="url(#mod-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                  <path d="M250,250 L140,380" stroke="url(#mod-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                  <path d="M250,250 L360,380" stroke="url(#mod-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                  <g><circle r="4" fill="#2564ea" /><animateMotion path="M250,250 L250,140" dur="2s" repeatCount="indefinite" /></g>
                  <g><circle r="4" fill="#22d3ee" /><animateMotion path="M250,250 L140,380" dur="2.5s" repeatCount="indefinite" /></g>
                  <g><circle r="4" fill="#10b981" /><animateMotion path="M250,250 L360,380" dur="3s" repeatCount="indefinite" /></g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  // ============================================
  // WHY KANGQORE (Benefits / Outcomes)
  // ============================================
  const whyKangqoreIntro = `Reshaping legacy systems into powerful digital assets. Our modernization services deliver measurable outcomes that transform your technology landscape from a liability into a competitive advantage.`;

  const whyKangqore = [
    { title: 'Higher app availability & scalability', description: 'We optimize applications for scalability and fault tolerance, ensuring they are available when you need them most. This results in increased app availability and the ability to handle varying workloads.' },
    { title: 'Ease of innovation', description: 'The modernization solutions we develop make it easier for your organization to embrace innovation. By removing the limitations of legacy systems, you can more readily adopt emerging technologies and stay ahead of the competition.' },
    { title: 'Increased speed of deployments', description: 'Modernized software are quicker to deploy and update. This agility ensures you can respond rapidly to market changes and customer demands, enabling faster time-to-market for new features and products.' },
    { title: 'State of the art security', description: 'Our legacy software modernization services include robust security enhancements to protect your applications and data, ensuring compliance with industry standards and safeguarding against cyber threats.' },
    { title: 'Faster adoption of emerging technologies', description: 'We help you stay updated by enabling the adoption of emerging technologies like Machine Learning, AI, and Big Data, ensuring your applications remain competitive and capable of leveraging data-driven insights.' },
    { title: 'Data-driven decision-making', description: 'We help to empower your organization with advanced analytics through our application modernization services. This facilitates data-driven decision-making, helping you gain insights and improve business processes.' }
  ];

  // ============================================
  // INDUSTRIES (with descriptions)
  // ============================================
  const industries = [
    { name: 'Healthcare', icon: Heart, description: 'Legacy EHRs, outdated patient portals, and siloed clinical systems often limit innovation and interoperability. We help healthcare providers modernize their tech stack while ensuring HIPAA compliance, enhancing patient engagement, and enabling data-driven care through AI and cloud-native architectures.' },
    { name: 'Fintech', icon: Building2, description: 'We re-engineer legacy banking, lending, or policy management systems to support real-time transactions, regulatory compliance such as PCI-DSS, IFRS, etc., and seamless customer experiences. Our modernization services focus on API enablement, microservices, and secure cloud infrastructure.' },
    { name: 'Retail & E-Commerce', icon: ShoppingCart, description: 'We modernize legacy POS systems, inventory tools, and customer portals to create unified commerce platforms. Whether it is integrating with AI-powered recommendation engines, streamlining omnichannel operations, or enabling headless commerce, we help retailers stay competitive.' },
    { name: 'Manufacturing', icon: Factory, description: 'Legacy ERP, MES, or SCADA systems often hinder efficiency and data visibility. We modernize these systems to support IoT integration, predictive maintenance, and real-time analytics while preserving critical data and workflows.' },
    { name: 'Real Estate', icon: Home, description: 'From outdated property listing platforms to legacy CRMs and lease management systems, we modernize these by introducing cloud scalability, mobile-first interfaces, and seamless integrations with payment gateways, virtual tours, and document verification.' },
    { name: 'Media & Entertainment', icon: Film, description: 'Legacy content management systems and monolithic distribution platforms cannot keep up with today is demand for high-quality, on-demand content. We help media companies modernize to support OTT streaming, personalized content delivery, DRM, and real-time analytics.' },
    { name: 'Travel & Transportation', icon: Plane, description: 'For travel agencies, airlines, and transportation providers, legacy booking engines and inventory systems often limit real-time updates and personalization. We modernize these to support dynamic pricing, real-time availability, mobile bookings, and third-party API integrations.' }
  ];

  // ============================================
  // FAQs
  // ============================================
  const customFAQs = [
    {
      question: `What is software modernization & why is it important?`,
      answer: `Software modernization is the process of updating, refactoring, or replacing outdated software applications to enhance their functionality, performance, security, and alignment with current technology trends. It is crucial to keep applications competitive, secure, and efficient in a rapidly evolving digital landscape. It also reduces maintenance costs and extends the lifespan of applications.`
    },
    {
      question: `How do I decide if my software needs modernization?`,
      answer: `Look for signs such as: Performance issues (frequent crashes, slow response times), security vulnerabilities that put your data at risk, rising maintenance costs from constant bug fixes, user complaints about usability or outdated interfaces, scalability challenges with growing data volumes, and integration difficulties with newer systems or third-party services.`
    },
    {
      question: `What do you need from my side to start the modernization process?`,
      answer: `To kickstart the modernization process, we will need several insights such as objectives, business requirements, budget, timeline and more, to ensure a successful modernization partnership. For deeper details, it would be great to connect with your technical personnel and developers who could provide assistance for a thorough overview. We also offer a free consultation session.`
    },
    {
      question: `What is the cost of software modernization?`,
      answer: `In general, the cost of software modernization varies widely depending on factors such as the scope of the project, the complexity of the software, and the extent of changes required. It is essential to conduct a thorough assessment and define clear project goals to determine costs accurately.`
    },
    {
      question: `How long does a modernization project typically take?`,
      answer: `Timelines vary based on the complexity, size, and chosen modernization strategy. A straightforward rehosting might take weeks, while re-architecting or rebuilding a large system can take several months. A discovery phase helps determine accurate timelines.`
    },
    {
      question: `Is it better to modernize or replace my legacy system?`,
      answer: `It depends on your existing system architecture, code quality, and alignment with current business needs. If the core logic is still valid, modernization might be more cost-effective. However, if the system no longer meets your functional or performance requirements, a complete rebuild may be necessary.`
    }
  ];

  // ============================================
  // ASSEMBLE PAGE DATA
  // ============================================
  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      capabilitiesTitle: 'Stay Ahead Of The Curve With Our Comprehensive Software Modernization Services',
      trustPillars,
      trustPillarsRightTitle: 'Empowering Legacy System Modernization With Advanced Technologies',
      trustPillarsRightDescription: 'We have been an early adopter of emerging technologies and have built extensive experience in various programming languages, frameworks, libraries, and tools. We continuously experiment with new technologies through our in-house R&D labs and pass on the learnings to our clients for a competitive edge.',
      trustPillarsRightButton: 'Request Consultation',
      whyKangqoreIntro,
      whyKangqore,
      industries,
      industryTitle: 'Legacy Application Modernization Services Tailored For Your Industry',
      customFAQs,
      postIndustrySections: customSections,
      ctaTitle: 'Ready To Modernize Your Legacy Systems?',
      ctaDescription: 'Transform aging applications into modern, scalable, cloud-native platforms. Your first consultation is on us.',
      ctaButtonText: 'Talk To Our Experts'
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default LegacyModernization;
