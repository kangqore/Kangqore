import React, { useState } from 'react';
import { Bot, Layers, CheckCircle2, Search, Workflow, Zap, BrainCircuit, Code, Terminal, Smartphone, Activity } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { Link } from 'react-router-dom';

// Custom 3D Component with Liquid CSS Animation replacing the Trust Pillars
const DiscoverFoundry3D = () => {
  const pillars = [
    {
      num: '01',
      title: 'GenAI Native from Day One',
      desc: 'Designed with GenAI at its core, embedded within the Software Development Life Cycle (SDLC) for smarter automation.'
    },
    {
      num: '02',
      title: 'Modular & Future Proof',
      desc: 'Plug-and-play templates and extensible frameworks align and adapt fluidly alongside evolving software models.'
    },
    {
      num: '03',
      title: 'Built for Developers',
      desc: 'Supports engineers to remain focused on innovation without being weighed down by manual development phases.'
    },
    {
      num: '04',
      title: 'Enterprise Grade by Design',
      desc: 'Designed natively to meet stringent life cycle needs, ensuring robust governance and prompt compliance.'
    },
    {
      num: '05',
      title: 'Full SDLC Coverage',
      desc: 'Provides automated execution across every aspect of the Software Development Life Cycle, from BRD to deployment.'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#FEFFFC]">

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-20 text-left max-w-4xl px-4">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
            Discover <span className="text-transparent bg-clip-text bg-brand-gradient italic">EngineerFoundry</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6" style={{ perspective: '1200px' }}>
          {pillars.map((pillar, idx) => (
            <div 
              key={idx}
              className="group relative h-[320px] bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100/50 p-8 rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(37,100,234,0.08)] transition-all duration-700 ease-out flex flex-col cursor-crosshair"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'translateZ(0) rotateX(0deg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateZ(30px) translateY(-5px) rotateX(2deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateZ(0) translateY(0) rotateX(0deg)';
              }}
            >
              <div className="absolute inset-0 bg-white dark:bg-black rounded-[30px] z-0 pointer-events-none"></div>
              
              <div className="relative z-10 flex-grow flex flex-col h-full">
                <div className="flex items-start mb-6">
                  <span className="text-4xl font-light tracking-tighter text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors duration-500 relative">
                    {pillar.num}
                    <div className="absolute -right-4 -top-2 w-10 h-10 bg-brand-blue/5 rounded-full blur-md group-hover:bg-brand-blue/20 transition-all duration-500 group-hover:scale-150"></div>
                  </span>
                </div>
                
                <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-4 leading-snug pr-4">
                  {pillar.title}
                </h3>
                
                <p className="text-[14px] text-gray-500 leading-relaxed font-light flex-grow">
                  {pillar.desc}
                </p>
                
                <div className="mt-auto overflow-hidden">
                  <button className="text-[14px] font-bold text-brand-blue uppercase tracking-widest flex items-center gap-2 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    Explore <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- New Component: Tech Stack Pills (CTO Feedback) ---
const TechStackPills = () => {
  const stack = ['React', 'Node.js', 'Python', 'AWS', 'Azure GenAI', 'Docker', 'Kubernetes', 'GitHub Actions', 'Terraform', 'PostgreSQL'];
  return (
    <div className="mt-8">
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Natively Integrates With</p>
      <div className="flex flex-wrap gap-2.5">
        {stack.map(tech => (
          <span key={tech} className="px-4 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm font-semibold border border-gray-200 shadow-sm hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50 transition-all cursor-crosshair">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

// --- New Component: Business Outcomes Ribbon (CEO Feedback) ---
const BusinessOutcomesRibbon = () => (
  <section className="bg-brand-gradient py-16 text-white overflow-hidden relative border-y border-white/10 shadow-[inset_0_2px_20px_rgba(0,0,0,0.2)]">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-[0.05] bg-cover bg-center mix-blend-overlay"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-x divide-white/10">
        <div className="text-center px-4 hover:scale-105 transition-transform duration-500">
          <div 
            className="text-7xl lg:text-[5rem] font-bold font-display tracking-tighter mb-4"
            style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1), 2px 2px 0px rgba(0,0,0,0.1), 3px 3px 0px rgba(0,0,0,0.15), 4px 4px 0px rgba(0,0,0,0.15), 5px 5px 0px rgba(0,0,0,0.2)' }}
          >
            40<span className="text-cyan-400 opacity-90">%</span>
          </div>
          <div className="text-lg lg:text-xl font-bold tracking-wide uppercase opacity-95 mb-3">Faster Time-to-Market</div>
          <p className="text-sm lg:text-base opacity-80 font-light px-4 leading-relaxed">Accelerate product launches with GenAI model-driven scaffolding and automated architectures.</p>
        </div>
        <div className="text-center px-4 hover:scale-105 transition-transform duration-500">
          <div 
            className="text-7xl lg:text-[5rem] font-bold font-display tracking-tighter mb-4"
            style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1), 2px 2px 0px rgba(0,0,0,0.1), 3px 3px 0px rgba(0,0,0,0.15), 4px 4px 0px rgba(0,0,0,0.15), 5px 5px 0px rgba(0,0,0,0.2)' }}
          >
            60<span className="text-cyan-400 opacity-90">%</span>
          </div>
          <div className="text-lg lg:text-xl font-bold tracking-wide uppercase opacity-95 mb-3">Decrease in QA Cycles</div>
          <p className="text-sm lg:text-base opacity-80 font-light px-4 leading-relaxed">Automated robust test suite generation executing directly from API definitions and swagger files.</p>
        </div>
        <div className="text-center px-4 hover:scale-105 transition-transform duration-500">
          <div 
            className="text-7xl lg:text-[5rem] font-bold font-display tracking-tighter mb-4"
            style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1), 2px 2px 0px rgba(0,0,0,0.1), 3px 3px 0px rgba(0,0,0,0.15), 4px 4px 0px rgba(0,0,0,0.15), 5px 5px 0px rgba(0,0,0,0.2)' }}
          >
            Zero<span className="text-cyan-400 opacity-90">-Day</span>
          </div>
          <div className="text-lg lg:text-xl font-bold tracking-wide uppercase opacity-95 mb-3">Defect Deployments</div>
          <p className="text-sm lg:text-base opacity-80 font-light px-4 leading-relaxed">Human-in-the-loop observability combined with highly secure, zero-touch CI/CD pipelines.</p>
        </div>
      </div>
    </div>
  </section>
);

const EngineeringFoundry = () => {
  const service = {
    name: 'Engineering Foundry',
    titleLine1: 'Revolutionizing',
    titleHighlight: 'Software at Scale',
    slug: 'engineering-foundry',
    shortDescription: 'Accelerate digital product launches. Modernize legacy code. Automate the SDLC.',
    videoBackground: '/videos/data-center-2936993.mp4',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Modern engineering starts with EngineerFoundry.</h2>
        <p className="font-light tracking-tight leading-snug opacity-80">
          Engineering Foundry from Kangqore is a transformational platform that accelerates the Software Development Life Cycle (SDLC) by seamlessly integrating Generative AI and Automation at every structural level.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    stats: [
      { value: 'Optimize', label: 'SDLC Velocity', color: 'text-blue-500' },
      { value: 'Automate', label: 'Code Generation', color: 'text-emerald-500' },
      { value: 'Ensure', label: 'Enterprise Governance', color: 'text-indigo-500' },
      { value: 'Govern', label: 'Architectural Integrity', color: 'text-purple-500' }
    ],
    primaryButton: { text: "Talk To Our Experts", link: "/contact" },
    secondaryButton: { text: "Explore Capabilities", link: "#capabilities" },
    highFidelity: {
      narrative: {
        badge: 'ENGINEERING PIPELINE :: 2026',
        titleLine1: 'Accelerate',
        titleHighlight: 'Development.',
        titleLine2: 'at Scale.',
        description: 'In an environment where Speed, Quality, and Scale matter, Engineering Foundry enables enterprises to speed up digital product launches, modernize legacy products, and optimize software development without compromising architectural integrity.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Slow time-to-market, massive technical debt, and disjointed toolchains causing friction and delays across the SDLC.',
        requirementLabel: 'The Requirement',
        requirementText: 'A GenAI-native development platform that automates everything from Business Requirements Documents (BRD) to deployment.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
        statusLabel: 'Engineering Velocity',
        statusValue: 'Maximized'
      },
      philosophy: {
        icon: <Bot className="w-7 h-7 text-brand-blue" />,
        title: 'Our',
        titleHighlight: 'Foundry Framework.',
        description: 'At Kangqore, we deconstruct enterprise complexity into automated, predictable engineering life cycles—driven by Generative AI from Day One.',
        pills: ['Core Functionality', 'Engineering Capabilities', 'User Experience (UX)', 'Scalability']
      },
      matrix: {
        engineId: 'Foundry :: SDLC_V1',
        title: '4-Pillar Automation Architecture',
        subtext: 'We integrate GenAI across four foundational pillars of modern software engineering to accelerate delivery and ensure quality.',
        layers: [
          { title: 'Core Functionality', id: 'FND_CORE', icon: <Code />, desc: 'BRD-to-Code automation, headless architecture scaffolding, and robust model-driven design.' },
          { title: 'Engineering', id: 'FND_ENG', icon: <Terminal />, desc: 'Smart planning, automated swagger-based test suites, and zero-touch CI/CD pipeline integration.' },
          { title: 'UX Generation', id: 'FND_UX', icon: <Smartphone />, desc: 'Screen-based UI generation directly from Figma wireframes utilizing customizable, branded layouts.' },
          { title: 'Scalability', id: 'FND_SCALE', icon: <Activity />, desc: 'Reusable component libraries, modular architecture, and SOLID principles guaranteeing clean, maintainable code.' }
        ]
      },
      schematic: {
        titleLine1: 'Synthesize',
        titleHighlight: 'Software.',
        description: 'Design ecosystems where developers and AI agents collaborate seamlessly, tied directly to rapid deployment metrics and uncompromising architectural integrity.',
        stats: [
          { label: 'Time-to-Market', val: 'ACCELERATED' },
          { label: 'Technical Debt', val: 'REDUCED' },
          { label: 'Code Quality', val: 'STANDARDIZED' }
        ]
      }
    }
  };
  
  const department = {
    name: 'Product Engineering',
    slug: 'product-engineering',
    description: 'Transform innovative ideas into complete digital products with enterprise-scale engineering.'
  };

  // Capabilities Native Array to leverage ServicePageTemplate Component
  const capabilities = [
    {
      title: 'Core Functionality',
      description: 'Automate requirements-to-code translation and deploy headless architectures with strict model-driven design alignment.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80', // Code rendering
      bgImage: '/images/capabilities/business-strategy.png', // Abstract technical arrays
      items: [
        'BRD-to-Code Automation',
        'Headless Architecture Scaffolding',
        'Model-Driven Design',
        'Template-Driven Outputs'
      ]
    },
    {
      title: 'Engineering Capabilities',
      description: 'Accelerate the SDLC through intelligent scenario planning, automated test suite generation, and zero-touch CI/CD pipelines.',
      image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80', // Cloud server array
      bgImage: '/images/capabilities/data-analytics.png', // Dark server array
      items: [
        'Smart Scenario & Epic Generation',
        'API/Swagger Test Suite Creation',
        'Zero-Touch CI/CD Rollouts',
        'Automated Story Mapping'
      ]
    },
    {
      title: 'User Experience (UX)',
      description: 'Instantly generate responsive frontend shells directly from Figma designs while maintaining strict brand guidelines.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80', // App UI workflow
      bgImage: '/images/capabilities/ux-design.png', // Creative desk setup
      items: [
        'Screen-Based Gen from Figma',
        'Brand Guideline Injection',
        'Responsive Template Engine',
        'Component Library Syncing'
      ]
    },
    {
      title: 'Scalability & Extensibility',
      description: 'Ensure long-term viability with centralized component libraries, modular features, and strict adherence to SOLID principles.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80', // Nodes connecting
      bgImage: '/images/capabilities/data-analytics.png', // Technical structure
      items: [
        'Modular Feature Expansion',
        'Reusable Component Libraries',
        'Clean, Maintainable Architectures',
        'SOLID Principle Enforcement'
      ]
    }
  ];

  const technologies = [
    { category: 'Architecture & Design Generation', items: ['Figma to Code', 'OpenAPI/Swagger', 'Model-Driven Design', 'Template Code Scaffolding'] },
    { category: 'GenAI Development Assistants', items: ['GitHub Copilot', 'Kangqore GenAI Agents', 'GPT-4 Code Integration', 'Amazon CodeWhisperer'] },
    { category: 'DevOps & Pipeline Automation', items: ['Jenkins', 'GitHub Actions', 'GitLab CI/CD', 'Automated Provisioning'] },
    { category: 'Quality & Test Engineering', items: ['Selenium', 'Cypress Automation', 'Smart Test Generation', 'SonarQube'] },
    { category: 'Cloud Native Environments', items: ['AWS Serverless', 'Azure Native Apps', 'Google Cloud Run', 'Kubernetes Orchestration'] }
  ];

  // Unused default template carousel. Replaced structurally by DiscoverFoundry3D.
  const trustPillars = [];

  const whyKangqoreIntro = `Kangqore secures engineering velocity and architectural excellence simultaneously. We bridge the gap between traditional SDLC friction and modern AI-driven velocity.`;

  const whyKangqore = [
    { 
      title: 'SDLC Optimization', 
      description: 'Supercharge your software development lifecycle with GenAI by automating repetitive tasks across design, development, testing, and deployment. This helps teams build and release better software faster, while reducing errors and improving overall efficiency.' 
    },
    { 
      title: 'Greenfield Development', 
      description: 'Build brand new digital platforms or products from scratch faster and smarter. Skip the usual setup delays with ready to use architecture and automation, helping teams move from idea to launch much quicker.' 
    },
    { 
      title: 'Focus on innovation', 
      description: 'Upgrade outdated systems through re architecting and rewriting, turning legacy applications into modern, scalable platforms. Clean up messy code, remove technical debt, and build cloud ready solutions that are easier to maintain and built for future growth.' 
    },
    { 
      title: 'Full Stack Engineering', 
      description: 'Automate the entire development process across front end, back end, and deployment with DevOps. Reduce manual coding, streamline workflows, and speed up software delivery.' 
    }
  ];

  const industries = [
    { name: 'Banking & Financial Services' },
    { name: 'Healthcare & Life Sciences' },
    { name: 'Manufacturing & Supply Chain' },
    { name: 'Retail, CPG & Logistics' },
    { name: 'Hi-Tech and EdTech' }
  ];

  const customSections = (
    <section className="py-24 bg-[#FEFFFC] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
              Execution Ecosystem
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
              Related Foundry <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Capabilities.</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Scale your engineering journey by integrating autonomous development with our broader portfolio of digital service architectures.
            </p>
            <div className="space-y-4">
              {[
                { 
                  name: 'Digital Experience Design', 
                  link: '/services/digital-experiences/ux-ui',
                  icon: <Smartphone className="w-5 h-5" />,
                  desc: 'Craft intuitive interfaces generated directly into the Foundry.'
                },
                { 
                  name: 'Enterprise App Development', 
                  link: '/services/product-engineering/enterprise-application-development',
                  icon: <Layers className="w-5 h-5" />,
                  desc: 'Scale the applications built through our GenAI architecture.'
                },
                { 
                  name: 'Continuous Security', 
                  link: '/services/cybersecurity/cloud-security',
                  icon: <CheckCircle2 className="w-5 h-5" />,
                  desc: 'Governing the automated code pipeline against threats.'
                },
                { 
                  name: 'Conversational Integration', 
                  link: '/services/data-ai/generative-ai',
                  icon: <Bot className="w-5 h-5" />,
                  desc: 'Deploy agents native to your new software ecosystem.'
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
            <div className="mt-12 flex items-center gap-6">
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-brand-blue transition-all group shadow-xl"
              >
                Explore Services 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <div className="hidden sm:block text-sm text-gray-400 font-mono italic">
                // COMPILING_ECOSYSTEM...
              </div>
            </div>
          </div>

          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[11px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#KG_FND_GEN</span></div>
                <div className="flex justify-between gap-4"><span>ASSET:</span> <span>SOURCE CODE</span></div>
                <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">COMPILED</span></div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative">
                   <Code className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const engineeringFoundrySection = (
    <section className="py-20 lg:py-28 overflow-hidden relative bg-[#FEFFFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
          
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
            <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 font-display tracking-tight">
                The AI-Native <br />
                <span className="text-transparent bg-clip-text bg-brand-gradient">Engineering Hub</span>
              </h2>
              <p className="text-[16px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
                The Engineering Foundry orchestrates a centralized environment where AI generative agents and human developers collaborate cleanly. It isn't just a code generation tool; it is a holistic pipeline that automates architectural decisions, test execution, and deployment gating.
              </p>
              <p className="text-[16px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Our AI-assisted continuous delivery model drastically reduces technical debt, keeps human engineers focused on strategy rather than boilerplate, and seamlessly bridges the gap between modern cloud-native standards and legacy infrastructure.
              </p>
              
            </div>
          </div>

          <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
          
            {/* Desktop Diamond Layout */}
            <div className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
              <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
                
                <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="coe-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2564ea" />
                      <stop offset="100%" stopColor="#4ab6d4" />
                    </linearGradient>
                  </defs>
                  <circle cx="300" cy="40" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite' }} />
                  <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out forwards' }} />
                  <circle cx="40" cy="300" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 0.5s' }} />
                  <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.3s forwards' }} />
                  <circle cx="300" cy="560" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1s' }} />
                  <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.6s forwards' }} />
                  <circle cx="560" cy="300" r="7" fill="url(#coe-blue-grad)" style={{ animation: 'dot-ping 3s ease-in-out infinite 1.5s' }} />
                  <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#coe-blue-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="200" style={{ animation: 'connector-draw 2s ease-out 0.9s forwards' }} />
                </svg>

                <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                  <div className="w-full h-full rounded-[20px] p-[3px]" style={{
                    transform: 'rotate(45deg) rotateX(12deg)',
                    transformStyle: 'preserve-3d',
                    animation: 'diamond-float-3d 6s ease-in-out infinite',
                    filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))'
                  }}>
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      <div className="relative overflow-hidden flex items-center justify-center p-2" style={{
                        background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)',
                        transform: 'translateZ(6px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Core</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Functionality</span>
                        </div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-2" style={{
                        background: 'linear-gradient(180deg, #6db3f8 0%, #3b82f6 50%, #2564ea 100%)',
                        transform: 'translateZ(4px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Engineering</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Capabilities</span>
                        </div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-2" style={{
                        background: 'linear-gradient(180deg, #2564ea 0%, #1e40af 50%, #1e3a8a 100%)',
                        transform: 'translateZ(2px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[35%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>UX</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>Generation</span>
                        </div>
                      </div>
                      <div className="relative overflow-hidden flex items-center justify-center p-2" style={{
                        background: 'linear-gradient(180deg, #5cc8e0 0%, #4ab6d4 50%, #2d9db8 100%)',
                        transform: 'translateZ(3px)'
                      }}>
                        <div className="absolute top-0 left-0 right-0 h-[40%]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)' }}></div>
                        <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Scalability &</span>
                          <span className="text-white font-extrabold text-[16px] leading-tight tracking-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>Extensibility</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-[60px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>BRD-to-Code Automation</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Headless Architecture Scaffolding</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Model-Driven Design Alignment</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Template-Driven Outputs</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                  </ul>
                </div>

                <div className="absolute top-[120px] left-1/2 ml-[180px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Smart Scenario & Epic Generation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>API/Swagger Test Suite Creation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Zero-Touch CI/CD Rollouts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Automated Story Mapping</span>
                    </li>
                  </ul>
                </div>

                <div className="absolute bottom-[100px] right-1/2 mr-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Screen-Based Gen from Figma</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Brand Guideline Injection</span>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Responsive Template Engine</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                    <li className="flex items-center justify-end gap-3 text-right">
                      <span>Component Library Syncing</span>
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                    </li>
                  </ul>
                </div>

                <div className="absolute bottom-[60px] left-1/2 ml-[165px] w-[320px] z-20">
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Modular Feature Expansion</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Reusable Component Libraries</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>Clean, Maintainable Architectures</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0"></div>
                      <span>SOLID principle enforcement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
               {[
                 { 
                   title: 'Core Functionality', 
                   gradient: 'from-[#2564ea] to-[#3b82f6]',
                   dotColor: 'bg-[#2564ea]',
                   items: ['BRD-to-Code Automation', 'Headless Architecture Scaffolding', 'Model-Driven Design Alignment', 'Template-Driven Outputs']
                 },
                 { 
                   title: 'Engineering Capabilities', 
                   gradient: 'from-[#3b82f6] to-[#60a5fa]',
                   dotColor: 'bg-[#3b82f6]',
                   items: ['Smart Scenario & Epic Generation', 'API/Swagger Test Suite Creation', 'Zero-Touch CI/CD Rollouts', 'Automated Story Mapping']
                 },
                 { 
                   title: 'UX Generation', 
                   gradient: 'from-[#1e40af] to-[#2564ea]',
                   dotColor: 'bg-[#1e40af]',
                   items: ['Screen-Based Gen from Figma', 'Brand Guideline Injection', 'Responsive Template Engine', 'Component Library Syncing']
                 },
                 { 
                   title: 'Scalability & Extensibility', 
                   gradient: 'from-[#4ab6d4] to-[#38bdf8]',
                   dotColor: 'bg-[#4ab6d4]',
                   items: ['Modular Feature Expansion', 'Reusable Component Libraries', 'Clean, Maintainable Architectures', 'SOLID principle enforcement']
                 }
               ].map((quadrant, idx) => (
                 <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group">
                   <div className={`bg-gradient-to-r ${quadrant.gradient} p-4 relative`}>
                     <div className="absolute inset-0 bg-black/5"></div>
                     <h4 className="text-white font-bold text-base tracking-wide relative z-10">{quadrant.title}</h4>
                   </div>
                   <div className="p-5">
                     <ul className="space-y-2.5">
                       {quadrant.items.map((item, i) => (
                         <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                           <span className={`w-2 h-2 ${quadrant.dotColor} rounded-full mt-1.5 flex-shrink-0`}></span>
                           {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                 </div>
               ))}
            </div>

          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="space-y-4">
            {[
              {
                num: 1,
                title: 'Full SDLC Automation Guarantee',
                text: 'Unlike standalone code assistants, Engineering Foundry addresses the complete software lifecycle—from initial BRD and user story ingestion all the way through test execution and CI/CD deployment.'
              },
              {
                num: 2,
                title: 'Architectural Immutability',
                text: 'Driven by strict standardization of enterprise design patterns, the Foundry guarantees that auto-generated code aligns perfectly to clean, scalable, and maintainable architectural blueprints.'
              },
              {
                num: 3,
                title: 'Figma-to-Framework UI Generation',
                text: 'Bridging the design-to-development gap rapidly by ingesting Figma designs and wireframes to auto-generate fully responsive, React/Angular application shells that adhere strictly to brand design systems.'
              },
              {
                num: 4,
                title: 'Intelligent Test-Driven Security',
                text: 'The Foundry automatically generates granular test suites from API endpoints and Swagger documentation, embedding Quality Assurance natively inside the development flow.'
              },
              {
                num: 5,
                title: 'Legacy Technical Debt Elimination',
                text: 'We utilize LLMs and Model-Driven Design templates not just to create greenfield products, but to intelligently decouple and refactor monolithic legacy infrastructure.'
              }
            ].map((diff) => (
              <div key={diff.num} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-500 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
                <div className="w-11 h-11 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg group-hover:from-brand-blue group-hover:to-cyan-500 group-hover:scale-105 transition-all duration-500">
                  {diff.num}
                </div>
                <div>
                  <h4 className="font-bold text-base lg:text-lg text-gray-900 dark:text-white mb-1.5 group-hover:text-brand-blue transition-colors duration-300">{diff.title}</h4>
                  <p className="text-gray-500 leading-relaxed text-sm lg:text-base">{diff.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const pageData = {
    service: {
      ...service,
      technologies,
      technologiesTitle: 'Core Foundry Architecture & Plugins',
      technologiesDescription: (
        <>
          <p className="mb-8">A platform-agnostic automation stack integrating the world's leading LLMs, UI generation models, and CI/CD orchestration engines.</p>
          <TechStackPills />
        </>
      ),
      capabilities,
      trustPillars,
      trustPillarsRightTitle: 'Scale Development with Automation',
      trustPillarsRightDescription: 'Kangqore Engineering Foundry provides end-to-end SDLC automation that helps organizations accelerate throughput, eliminate systemic bottlenecks, and deploy code at unprecedented velocity. By combining intelligent planning and deep code generation, we engineer software ecosystems that are secure, structured, and inherently scalable.',
      trustPillarsRightButton: 'Request Foundry Assessment',
      preWhyKangqoreSections: (
        <>
          <BusinessOutcomesRibbon />
          {engineeringFoundrySection}
          <DiscoverFoundry3D />
        </>
      ),
      whyKangqoreIntro,
      whyKangqore,
      industryTitle: 'Engineered Products Across Key Industries',
      industryIntro: 'We bring deep domain engineering expertise to deliver robust, scalable application solutions across every major business vertical.',
      industries,
      postFAQSections: customSections,
      ctaTitle: 'Ready to Accelerate Your SDLC?',
      ctaDescription: 'Discover how the Kangqore Engineering Foundry can automate your development pipelines and significantly reduce time-to-market.'
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

export default EngineeringFoundry;
