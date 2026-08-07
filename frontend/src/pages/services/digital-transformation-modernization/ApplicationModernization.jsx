import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { 
  Zap, 
  Search, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Cloud, 
  ArrowRight, 
  ChevronRight, 
  Globe, 
  Layout, 
  RefreshCw, 
  Box, 
  Database, 
  Workflow, 
  PenTool, 
  Smartphone, 
  Shield, 
  Eye, 
  Lock,
  Plus,
  Minus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ApplicationModernization = () => {
  // ============================================
  // SERVICE INFORMATION
  // ============================================
  
  const service = {
    name: 'Application Modernization',
    slug: 'application-modernization',
    shortDescription: 'MODERNIZE. SCALE. SHIP.',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Modernize Faster. Stay Resilient. Ship What’s Next.</h2>
        <p>Legacy systems shouldn’t slow growth. Kangqore modernizes applications with zero-disruption strategies, cloud-native engineering, and security-first architecture — improving performance, reducing TCO, and enabling rapid product evolution.</p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    imageClassName: 'aspect-[4/5]',
    fullWidthCustomOverview: true,
    primaryButton: { text: 'Request Modernization Assessment', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    stats: [
      { value: 'Zero', label: 'Disruption Risk', color: 'text-cyan-400' },
      { value: 'Accelerated', label: 'Release Velocity', color: 'text-blue-400' },
      { value: 'Reduced', label: 'Total Cost of Ownership', color: 'text-purple-400' },
      { value: 'Cloud-Native', label: 'Architecture Ready', color: 'text-orange-400' },
    ],
    highFidelity: {
      narrative: {
        badge: 'ENGINEERING VELOCITY :: 2026',
        titleLine1: 'Modernize Faster.',
        titleHighlight: 'Stay Resilient.',
        titleLine2: 'Ship What’s Next.',
        description: 'Modernization isn’t just “moving to cloud.” It’s removing the friction that blocks velocity. Kangqore helps teams transition from legacy complexity to modern capability through a structured modernization approach aligned to business outcomes, not just technology refresh.',
        bottleneckLabel: 'The Reality',
        bottleneckText: 'Monolith bottlenecks & fragile deployments.',
        requirementLabel: 'The Mandate',
        requirementText: 'Zero-disruption transformation at speed.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
        statusLabel: 'Engineering State',
        statusValue: 'CLOUD_NATIVE'
      },
      philosophy: {
        icon: <Zap className="w-7 h-7 text-brand-blue" />,
        title: 'Application',
        titleHighlight: 'Evolution.',
        description: 'We approach modernization as a continuous evolution, integrating cloud-native engineering and automated validation into a structured transformation pipeline.',
        pills: ['Zero Disruption', 'API-First', 'DevSecOps', 'Cloud-Native']
      },
      matrix: {
        engineId: 'Engine :: Mod_Enablement_V1',
        title: 'Modernization Enablement Model',
        subtext: 'A structured methodology that moves your organization from legacy technical debt to optimized engineering velocity.',
        layers: [
          { title: 'Assess', id: 'MOD_ASSESS', icon: <Search />, desc: 'Discovery, assessment, and strategic alignment of legacy assets.' },
          { title: 'Architect', id: 'MOD_ARC', icon: <Layers />, desc: 'Design resilient blueprints including microservices and serverless models.' },
          { title: 'Transform', id: 'MOD_BUILD', icon: <Activity />, desc: 'Structured migration, re-engineering, and platform uplift.' },
          { title: 'Validate', id: 'MOD_VAL', icon: <ShieldCheck />, desc: 'Continuous testing, integrity checks, and user validation.' },
          { title: 'Operate', id: 'MOD_GO', icon: <Zap />, desc: 'Continuous optimization and scaled agile operations.' }
        ]
      },
      schematic: {
        titleLine1: 'Modern Markets.',
        titleHighlight: 'Demand Speed.',
        description: 'Your modernization investment should generate compounding business returns. We engineer the delivery frameworks that make it measurable and sustained.',
        stats: [
          { label: 'Quality', val: 'ABSOLUTE' },
          { label: 'Speed', val: 'ACCELERATED' },
          { label: 'Cost', val: 'REDUCED' }
        ]
      }
    }
  };

  const department = {
    name: 'Digital Transformation & Modernization',
    slug: 'digital-transformation-modernization',
    description: 'Transforming legacy complexity into modern engineering capability through structured digital roadmaps.'
  };

  const technologies = [
    { category: 'Frontend Stacks', items: ['React', 'Angular', 'Vue.js', 'Next.js', 'Astro', 'HTML5/CSS3'] },
    { category: 'Backend Systems', items: ['.NET Cloud', 'Spring Boot (Java)', 'Node.js', 'Python/FastAPI', 'Golang', 'PHP/Laravel'] },
    { category: 'Mobile & PWA', items: ['iOS Swift', 'Android Kotlin', 'React Native', 'Flutter', 'PWA Lifecycle', 'Xamarin'] },
    { category: 'Cloud Infrastructure', items: ['AWS Modernization', 'Azure Replatforming', 'Google Cloud (GCP)', 'Serverless', 'Lambda'] },
    { category: 'Databases & Data', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Amazon RDS', 'CosmosDB', 'Cassandra'] },
    { category: 'DevOps & Tooling', items: ['Kubernetes', 'Docker', 'Terraform', 'GitHub Actions', 'Jenkins', 'Ansible'] }
  ];

  const capabilities = [
    {
      title: 'Legacy Application Assessment & Consulting',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'We start by deeply analyzing your legacy systems — evaluating code quality, architecture, dependencies, and integration touchpoints. Our experts help you uncover hidden risks, identify quick wins, and define a modernization roadmap aligned with your business objectives.',
      items: [
        'Comprehensive Code & Architecture Audit',
        'Technical Debt & Risk Quantification',
        'Modernization Roadmap & Strategy',
        'ROI & Business Case Modeling'
      ]
    },
    {
      title: 'Cloud Migration Services',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: 'Harness the power of the cloud with our comprehensive migration services. We facilitate a seamless and secure transition of your applications to the cloud, enhancing scalability, performance and efficiency while reducing operational costs.',
      items: [
        'Secure Application Cloud Transition',
        'Infrastructure as Code (IaC) Implementation',
        'Cloud-Native Performance Optimization',
        'Operational Cost Reduction Strategies'
      ]
    },
    {
      title: 'Application Reengineering',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'When legacy systems are too outdated to deliver modern capabilities, we help you rebuild them from the ground up using cloud-native technologies, modern frameworks, and modular, future-ready architecture.',
      items: [
        'Ground-up Cloud-Native Rebuilds',
        'Modular & Scalable Architecture Design',
        'Legacy Core System Stabilization',
        'Future-ready Tech Stack Adoption'
      ]
    },
    {
      title: 'Application Containerization',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'We leverage cutting-edge containerization technologies to boost the portability, scalability and manageability of your applications, promoting efficiency and flexibility across your IT infrastructure.',
      items: [
        'Docker & Kubernetes (K8s) Orchestration',
        'Micro-segmentation & Scaling Strategy',
        'CI/CD Pipeline Integration',
        'Portable Infrastructure Frameworks'
      ]
    },
    {
      title: 'Data Migration Services',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'We ensure a secure, seamless migration of your data during the modernization process, preserving its integrity and accessibility. Our data migration services prioritize data security, accuracy and minimal downtime.',
      items: [
        'High-Integrity Data Extraction & Load',
        'Security-First Migration Protocols',
        'Minimal Downtime Migration Execution',
        'Data Validation & Integrity Checks'
      ]
    },
    {
      title: 'Middleware & Database Modernization',
      bgImage: '/images/capabilities/data-analytics.png',
      description: 'We help you modernize outdated middleware platforms and legacy databases — migrating to scalable, cloud-compatible alternatives like PostgreSQL, MongoDB, or Amazon RDS for better performance and reduced maintenance.',
      items: [
        'Relational-to-NoSQL Transformation',
        'Cloud-Native Database Re-platforming',
        'Middleware Efficiency & Integration',
        'Query Performance Tuning & Optimization'
      ]
    },
    {
      title: 'Application Replatforming',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Move legacy applications to a modern runtime environment — optimizing databases, updating middleware, or transitioning to managed cloud services while boosting performance and resilience.',
      items: [
        'Runtime Environment Modernization',
        'Managed Cloud Service Transition',
        'Resilience & Availability Uplift',
        'Core Functionality Integrity Checks'
      ]
    },
    {
      title: 'UI/UX Modernization',
      bgImage: '/images/capabilities/ux-design.png',
      description: 'Redesign legacy user interfaces using responsive frameworks (React, Angular, Vue) with a focus on accessibility, usability, and brand alignment through user journey mapping and A/B testing.',
      items: [
        'Responsive Web & Mobile Redesign',
        'Accessibility (WCAG) Compliance',
        'User Journey & Persona Mapping',
        'High-Performance UI Engineering'
      ]
    },
    {
      title: 'Application Refactoring & Re-Architecting',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Deconstruct monolithic architectures into loosely coupled microservices, implement API-first strategies, and embed DevOps pipelines to enable faster deployments and independent scaling.',
      items: [
        'Monolith-to-Microservices Decomposition',
        'API-First Strategy & Design',
        'DevOps & Pipeline Automation',
        'Independent Component Scaling'
      ]
    }
  ];

  const trustPillars = [
    {
      title: 'Proven Legacy Transformation',
      tag: 'Experience',
      description: 'From monolith stabilization to cloud-native redesign — we modernize mission-critical systems without breaking operations. Learn More →'
    },
    {
      title: 'Full-Spectrum Capabilities',
      tag: 'Versatility',
      description: 'Rehost, refactor, replatform, re-architect, rebuild — we pick the right path for your business constraints and timeline. Learn More →'
    },
    {
      title: 'Engineering-First Execution',
      tag: 'Rigorous',
      description: 'Architecture discipline + delivery rigor + automation-first mindset — ensuring measurable outcomes instead of slideware. Learn More →'
    },
    {
      title: 'Cloud + DevOps + Security',
      tag: 'Integrated',
      description: 'Modernization is incomplete without pipeline maturity and security posture. We bake in DevSecOps by default. Learn More →'
    }
  ];

  const customSections = (
    <>
      {/* Overcoming Performance Hurdles Section */}
      <section className="py-24 bg-white dark:bg-black dark:border-gray-800 overflow-hidden relative border-t border-gray-100">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase border border-blue-100">
              Efficiency Maximization
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
              Overcoming Performance <span className="text-transparent bg-clip-text bg-brand-gradient italic">Hurdles</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
              We eliminate the friction points in legacy applications, transforming bottlenecks into engines of engineering velocity.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: 'High Cost of Ownership',
                icon: <Database className="w-8 h-8" />,
                description: "Our application modernization services help lower your applications’ total cost of ownership through features like efficient resource management, process automation and modern, cost-effective technologies. This results in significant cost savings and better resource allocation.",
                pill: 'Efficiency',
                color: 'from-blue-500/10 to-cyan-500/10',
                border: 'border-blue-100'
              },
              {
                title: 'Technical Debt',
                icon: <Shield className="w-8 h-8" />,
                description: "We aim to reduce technical debt with features such as legacy code analysis, code optimization and system upgrades. Our services replace or update outdated code and systems, significantly improving application performance and maintainability.",
                pill: 'Integrity',
                color: 'from-purple-500/10 to-pink-500/10',
                border: 'border-purple-100'
              },
              {
                title: 'Slow Evolution',
                icon: <RefreshCw className="w-8 h-8" />,
                description: "Our application modernization services enable faster evolution of your applications. Features like agile development practices, technology upgrades and flexible architecture help your applications keep up with changing business needs and technology trends, ensuring your competitiveness.",
                pill: 'Velocity',
                color: 'from-emerald-500/10 to-teal-500/10',
                border: 'border-emerald-100'
              }
            ].map((hurdle, idx) => (
              <div key={idx} className={`relative p-10 bg-white dark:bg-gray-900 dark:border-gray-800 border ${hurdle.border} rounded-[2.5rem] group hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-500 shadow-sm`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${hurdle.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]`}></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue mb-8 group-hover:scale-110 group-hover:bg-brand-gradient group-hover:text-white transition-all duration-500 shadow-sm">
                    {hurdle.icon}
                  </div>
                  <div className="inline-flex px-3 py-1 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-400 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-gray-100 group-hover:text-brand-blue group-hover:border-blue-200 transition-all">
                    {hurdle.pill}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight group-hover:text-brand-blue transition-colors">{hurdle.title}</h3>
                  <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 dark:text-gray-400 transition-colors">
                    {hurdle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Synergies Section */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
              Related Capabilities
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
              Strategic Digital <span className="text-transparent bg-clip-text bg-brand-gradient">Synergies</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Modernization is the catalyst. Integrate these core capabilities to accelerate your global digital dominance.
            </p>
            <div className="space-y-4">
              {[
                { 
                  name: 'Cloud Transformation', 
                  link: '/services/cloud-engineering/managed-cloud-services',
                  icon: <Cloud className="w-5 h-5" />,
                  desc: 'Accelerate cloud adoption with optimized migration and cloud-native design.'
                },
                { 
                  name: 'Mobility Solutions', 
                  link: '/services/digital-transformation-modernization/mobility-solutions',
                  icon: <Smartphone className="w-5 h-5" />,
                  desc: 'Enable mobile-first ecosystems that improve engagement and productivity.'
                },
                { 
                  name: 'Software Development', 
                  link: '/services/digital-engineering/software-development',
                  icon: <Cpu className="w-5 h-5" />,
                  desc: 'End-to-end custom software engineering with architecture-first discipline.'
                },
                { 
                  name: 'Enterprise Strategy', 
                  link: '/services/consulting-advisory/enterprise-modernization-strategy',
                  icon: <Workflow className="w-5 h-5" />,
                  desc: 'Comprehensive digital transformation frameworks for scalable growth.'
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
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                    <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-12 flex items-center gap-6">
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl"
              >
                View Portfolio 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="hidden sm:block text-sm text-gray-400 font-mono italic">
                // SYSTEM_UPGRADE_ACTIVE...
              </div>
            </div>
          </div>

          {/* Technical Schematic: Refactoring Pipeline / Systems-to-Cloud */}
          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>PIPELINE:</span> <span className="text-brand-blue">#MOD_7R</span></div>
                <div className="flex justify-between gap-4"><span>MODE:</span> <span>RE_ARCHITECT</span></div>
                <div className="flex justify-between gap-4"><span>LOAD:</span> <span className="text-emerald-500">STABLE</span></div>
              </div>

              {/* Central Core (Transformation Hub) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative">
                   <RefreshCw className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:rotate-180 transition-transform duration-1000" />
                </div>
                
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-45 transition-transform">
                  <Box className="w-7 h-7" />
                </div>
              </div>

              {/* Satellite Clusters (Migration, UX, Data) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:rotate-12 transition-transform duration-500">
                    <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                    <Cloud className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Migration</span>
                </div>
              </div>

              <div className="absolute bottom-20 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-500">
                    <PenTool className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-bold border border-white/20">UX</div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Experience</span>
                </div>
              </div>

              <div className="absolute bottom-20 right-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 bg-slate-900 rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center relative -translate-x-6 hover:translate-x-0 transition-transform duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative">
                      <Database className="w-16 h-16 text-emerald-400" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Data Fabric</span>
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
                <circle r="4" fill="#2564ea"><animateMotion path="M250,250 L250,140" dur="2s" repeatCount="indefinite" /></circle>
                <circle r="4" fill="#22d3ee"><animateMotion path="M250,250 L140,380" dur="2.5s" repeatCount="indefinite" /></circle>
                <circle r="4" fill="#10b981"><animateMotion path="M250,250 L360,380" dur="3s" repeatCount="indefinite" /></circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

  const whyKangqoreIntro = `Modernization is a journey of removing friction. Kangqore helps enterprises transition from fragmented legacy systems to cohesive, modern application architectures without breaking operations.`;

  const whyKangqore = [
    { title: 'Proven Transformation', description: 'From monolith stabilization to cloud-native redesign — we modernize mission-critical systems safely.' },
    { title: 'Full-Spectrum Paths', description: 'Rehost, refactor, replatform, re-architect, rebuild — we pick the right path for your constraints.' },
    { title: 'Engineering Rigor', description: 'Architecture discipline + delivery rigor + automation-first mindset — ensuring measurable ROI.' },
    { title: 'Security-First', description: 'Modernization is incomplete without pipeline maturity. We bake in DevSecOps by default.' },
    { title: 'Zero-Disruption Strategy', description: 'Blue/green, canary, and strangler patterns to modernize while staying live and operational.' },
    { title: 'Outcome-Led Roadmaps', description: 'Performance, scalability, and TCO benchmarks tracked through granular modernization KPIs.' }
  ];

  const industries = [
    { name: 'Healthcare & Life Sciences' },
    { name: 'Banking & Financial Services' },
    { name: 'Real Estate & Infrastructure' },
    { name: 'Travel & Transportation' },
    { name: 'Retail & eCommerce' },
    { name: 'Food & Beverage' },
    { name: 'Media & Entertainment' },
    { name: 'Software & Technology' }
  ];

  const ModernizationOutcomeAccordion = () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    
    const outcomes = [
      { 
        title: 'Modernized Infrastructure', 
        content: 'Our application modernization services transform your existing IT infrastructure into a modern, efficient system. We ensure that your IT solutions are resilient, capable of withstanding any disruptions and maintaining business continuity.' 
      },
      { 
        title: 'Reduced technical complexity', 
        content: 'We simplify your technical environment by reducing the complexity of your applications. This makes them easier to manage, maintain and update, saving you both time and resources.' 
      },
      { 
        title: 'High agility and scalability', 
        content: 'Our modernized applications are designed to be agile and scalable. This means they can quickly adapt to changing business needs, allowing you to scale up or down as required.' 
      },
      { 
        title: 'Reduction in TCO', 
        content: 'By modernizing your applications, we can help reduce your total cost of ownership. This includes savings on maintenance, hardware, software and labor costs.' 
      },
      { 
        title: 'Greater security', 
        content: 'We place a high priority on security. Our application modernization services include advanced security measures to protect your sensitive data and systems from threats.' 
      },
      { 
        title: 'Future-ready architecture', 
        content: 'We build systems with future-proof architectural patterns, ensuring your applications remain compatible with emerging technologies and industry standards for years to come.' 
      }
    ];

    return (
      <section className="py-24 bg-gray-50 dark:bg-black dark:border-gray-700 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Accordion Left */}
            <div className="space-y-4">
              {outcomes.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border transition-all duration-300 shadow-sm ${activeIndex === idx ? 'border-brand-blue ring-1 ring-brand-blue/10' : 'border-gray-100'}`}
                >
                  <button 
                    onClick={() => setActiveIndex(activeIndex === idx ? -1 : idx)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between group"
                  >
                    <span className={`text-xl font-bold transition-colors ${activeIndex === idx ? 'text-brand-blue' : 'text-gray-900 dark:text-white'}`}>
                      {item.title}
                    </span>
                    <div className={`p-1 rounded-lg transition-all ${activeIndex === idx ? 'bg-brand-blue text-white' : 'bg-gray-50 dark:bg-[#050505] text-gray-400 group-hover:text-brand-blue'}`}>
                      {activeIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                  </button>
                  {activeIndex === idx && (
                    <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Image Right */}
            <div className="relative group">
              <div className="relative z-10 group-hover:scale-105 transition-transform duration-500">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 aspect-[4/5] bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <img 
                  src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1200" 
                  alt="Modernization Strategy" 
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-10 left-10 p-8 bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-xl border border-white/20 rounded-3xl">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center text-xl font-bold">UX</div>
                    <div>
                      <div className="text-sm font-bold tracking-widest uppercase opacity-60">Modern Interface</div>
                      <div className="text-xl font-bold">System-Wide Clarity</div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const customFAQs = [
    {
      question: `How will application modernization impact my existing IT infrastructure?`,
      answer: `We modernize in phases to avoid disruption — integrating new components with your current setup, validating performance, and rolling out safely through controlled releases such as blue/green or canary deployments.`
    },
    {
      question: `Will modernization cause data loss?`,
      answer: `No. We use rigorous migration validation, backup strategies, integrity checks, and rollback planning to protect business-critical data throughout the transformation lifecycle.`
    },
    {
      question: `How do you ensure security during modernization?`,
      answer: `Security is embedded from day one — including DevSecOps pipelines, identity-first access controls, cloud posture management, and continuous vulnerability scanning.`
    },
    {
      question: `How long does modernization take?`,
      answer: `Timelines depend on scope and complexity. We start with a 6R assessment and define a phased roadmap with clear milestones that deliver measurable business value early in the process.`
    }
  ];

  const additionalInfo = {
    overview: `Modernized Infrastructure: Transform outdated environments into scalable platforms. Reduced Technical Complexity: Simplify codebases and accelerate change delivery. High Agility: Enable rapid iteration through cloud-native patterns.`,
    benefits: [
      'Modernized Infrastructure & Resiliency',
      'Reduced Technical Complexity & Debt',
      'High Agility & Scalability',
      'Significant Reduction in TCO',
      'Greater Security & Posture Control',
      'Future-ready Architecture'
    ],
    useCases: [
      'Monolith to Microservices Migration',
      'Legacy Re-platforming to Cloud',
      'Containerization & K8s Adoption',
      'UI/UX Responsive Redesign'
    ]
  };

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      trustPillars,
      trustPillarsRightTitle: 'Engineering the Future of Applications',
      trustPillarsRightDescription: 'Modern markets reward speed, resilience, and experience. Kangqore helps enterprises transition from legacy technical debt to cohesive, modern application architectures that enable faster releases, reduced cost, and stronger security.',
      trustPillarsRightButton: 'Request Assessment',
      whyKangqoreIntro,
      whyKangqore,
      industries,
      customFAQs,
      additionalInfo,
      postIndustrySections: customSections,
      postFAQSections: <ModernizationOutcomeAccordion />,
      ctaTitle: 'Modernize Without Slowing Down',
      ctaDescription: 'Kangqore helps you modernize applications with confidence. Let’s design your high-velocity engineering future.',
      ctaButtonText: 'Book a Modernization Strategy Session'
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default ApplicationModernization;
