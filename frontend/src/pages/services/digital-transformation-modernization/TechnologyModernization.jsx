import React from 'react';
import { 
  Zap, 
  Search, 
  Layers, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  Cpu, 
  Cloud, 
  Code, 
  Terminal, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Workflow,
  Shield,
  Layout,
  Building2,
  Heart,
  ShoppingCart,
  Factory,
  Home,
  Film,
  Plane
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

const TechnologyModernization = () => {
  // ============================================
  // SERVICE INFORMATION
  // ============================================
  
  const service = {
    name: 'Technology Modernization',
    slug: 'technology-modernization',
    shortDescription: 'MODERNIZE FASTER. OPERATE LEANER. SCALE STRONGER.',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Technology Modernization, Engineered for Competitive Advantage</h2>
        <p>Legacy systems don’t just slow operations — they suffocate growth. Kangqore modernizes your technology stack with precision, intelligence, and controlled risk.</p>
        <p>We move beyond incremental improvement — embedding capability, governance, and measurable business value into every engagement.</p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80',
    imageClassName: 'aspect-[4/5]',
    fullWidthCustomOverview: true,
    primaryButton: { text: 'Schedule a Strategy Call', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    stats: [
      { value: '60%', label: 'Release Velocity', color: 'text-cyan-400' },
      { value: '45%', label: 'Cost Optimization', color: 'text-blue-400' },
      { value: '50%', label: 'Defect Reduction', color: 'text-emerald-400' },
      { value: '3x', label: 'Scaling Speed', color: 'text-purple-400' },
    ],
    highFidelity: {
      narrative: {
        badge: 'AI-ACCELERATED :: 2026',
        titleLine1: 'AI-Accelerated',
        titleHighlight: 'Modernization.',
        titleLine2: 'With Execution Discipline.',
        description: 'Modernization isn’t optional anymore. It’s strategic survival. We combine AI-powered engineering with deep architecture thinking to transform your technical debt into a strategic asset.',
        bottleneckLabel: 'The Impediment',
        bottleneckText: 'Escalating maintenance, security gaps, and innovation paralysis.',
        requirementLabel: 'The Outcome',
        requirementText: 'Structured transformation with architecture-first execution.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
        statusLabel: 'Modernization Flow',
        statusValue: 'ACCELERATED'
      },
      philosophy: {
        icon: <RefreshCw className="w-7 h-7 text-brand-blue" />,
        title: 'Our Approach is',
        titleHighlight: 'Capability Modernization.',
        description: 'We don’t just modernize systems. We modernize capability. We architect the future with a focus on governance, observability, and undisputed competitive advantage.',
        pills: ['Engineers-First', 'Architecture Before Execution', 'AI-Native Approach', 'Governance-Baked']
      },
      matrix: {
        engineId: 'Framework :: MODERNIZATION_V3',
        title: 'Modernization Framework',
        subtext: 'Our proprietary methodology for deconstructing enterprise debt and rebuilding for exponential growth.',
        layers: [
          { title: 'Diagnose', id: 'KQ_DIAG', icon: <Search />, desc: 'Technical debt mapping, dependency analysis, and strategic cost modeling.' },
          { title: 'Architect', id: 'KQ_ARCH', icon: <Layers />, desc: 'Design a cloud-native, composable, and AI-augmented target architecture.' },
          { title: 'Execute', id: 'KQ_EXEC', icon: <Zap />, desc: 'Controlled migration waves in parallel environments with phased rollout.' },
          { title: 'Optimize', id: 'KQ_OPT', icon: <Activity />, desc: 'Continuous observability, performance tuning, and infrastructure cost rightsizing.' },
          { title: 'Govern', id: 'KQ_GOV', icon: <ShieldCheck />, desc: 'SRE integration, security reinforcement, and DevSecOps automation at scale.' }
        ]
      },
      schematic: {
        titleLine1: 'Modernize',
        titleHighlight: 'Without Chaos.',
        description: 'Your transformation journey should fuel undisputed competitive advantage. We engineer the frameworks that make it measurable and sustained.',
        stats: [
          { label: 'Defect Reduction', val: '50% LESS' },
          { label: 'Release Velocity', val: '3X FASTER' },
          { label: 'ROI', val: 'MEASURABLE' }
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
  // CUSTOM SECTIONS
  // ============================================

  const customSections = (
    <>
      {/* Problem Positioning Section */}
      <section className="py-24 bg-white dark:bg-black dark:border-gray-800 overflow-hidden relative border-y border-gray-100">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/5 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-full text-xs font-bold mb-6 tracking-widest uppercase shadow-sm">
                <AlertTriangle className="w-4 h-4" /> The Cost of Inaction
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight font-display">
                Legacy Systems Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">Quietly Taxing</span> Your Business
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl font-light">
                Modernization isn’t optional anymore. It’s strategic survival. Aging stacks don't just stay stagnant — they accumulate risk and entropy every single day.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Escalating maintenance costs',
                  'Security vulnerabilities',
                  'Architectural rigidity',
                  'Vendor lock-ins',
                  'Innovation paralysis',
                  'Critical talent shortage'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:border-brand-blue/20 hover:shadow-md transition-all">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-brand-blue/10 blur-[100px] rounded-full scale-75 animate-pulse"></div>
              <div className="relative p-8 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-200/50">
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-brand-blue" />
                         </div>
                         <div>
                            <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Global Legacy Debt</div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">$1.52 Trillion USD</div>
                         </div>
                      </div>
                      <div className="text-brand-blue font-mono font-bold">+18% YoY</div>
                   </div>

                   <div className="flex flex-col items-center justify-center py-4">
                      <div className="relative w-48 h-48 mb-8">
                         <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            {/* Background circle (Innovation - 25%) */}
                            <circle
                               cx="50" cy="50" r="40"
                               fill="transparent"
                               stroke="#e2e8f0"
                               strokeWidth="12"
                               className="text-gray-200"
                            />
                            {/* Maintenance Ring (75%) */}
                            <circle
                               cx="50" cy="50" r="40"
                               fill="transparent"
                               stroke="url(#blueGradient)"
                               strokeWidth="12"
                               strokeDasharray="188.5 251.3"
                               strokeLinecap="round"
                               className="drop-shadow-sm"
                            />
                            <defs>
                               <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#2563eb" />
                                  <stop offset="100%" stopColor="#0066FF" />
                               </linearGradient>
                            </defs>
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white leading-none">75%</span>
                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter mt-1">Maintenance</span>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 w-full border-t border-gray-50 pt-8">
                         <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-brand-blue"></div>
                            <div>
                               <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Maintenance</div>
                               <div className="text-sm font-bold text-gray-900 dark:text-white">75-80% Budget</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                            <div>
                               <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Innovation</div>
                               <div className="text-sm font-bold text-gray-900 dark:text-white">&lt; 25% Strategic</div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-6 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                      <p className="text-sm text-brand-blue font-medium italic leading-relaxed">
                        "70-80% of average IT budgets are spent solely on 'keeping the lights on,' leaving less than 20% for strategic innovation."
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Enterprise Metrics Section */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-gray-100 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-xl shadow-gray-100/50">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>
            
            <div className="relative z-10 grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-12 mb-4 text-center">
                 <div className="font-mono text-[10px] text-brand-blue mb-4 tracking-[0.4em] uppercase font-bold">Projected Performance</div>
                 <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-[0.95] font-display">
                    Measurable ROI. <span className="text-transparent bg-clip-text bg-brand-gradient italic">Guaranteed Impact.</span>
                 </h2>
              </div>

              <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: '40–60%', label: 'Release Velocity', sub: 'Faster cycle times' },
                  { value: '25–45%', label: 'Cost Efficiency', sub: 'Infra optimization' },
                  { value: '30–50%', label: 'Defect Reduction', sub: 'AI-assisted QA' },
                  { value: '2–3x', label: 'Release Velocity', sub: 'Speed of delivery' }
                ].map((stat, i) => (
                  <div key={i} className="text-center group">
                    <div className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-110 group-hover:text-brand-blue transition-all tracking-tighter duration-500">
                      {stat.value}
                    </div>
                    <div className="font-bold text-brand-blue text-xs uppercase tracking-widest mb-1">{stat.label}</div>
                    <div className="text-[10px] text-gray-500 font-mono italic">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  // ============================================
  // CAPABILITIES (Service Cards)
  // ============================================
  const capabilitiesTitle = "Core Technology Modernization Capabilities";
  const capabilities = [
    {
      title: 'Lift & Shift',
      bgImage: '/images/capabilities/business-strategy.png',
      description: 'Migrate legacy technology to new environments like the cloud with few changes. Reduce operational and staffing costs with a minimally disruptive approach.',
      items: [
        'Cloud-native re-platforming',
        'Legacy monolith decomposition',
        'Database modernization',
        'Serverless architecture adoption'
      ]
    },
    {
      title: 'AI-Powered SDLC',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Reinvent software development with AI-driven precision and productivity, harnessing human-guided approaches to work smarter, get to market faster, and lower costs.',
      items: [
        'AI code generation & refactoring',
        'Automated test orchestration',
        'Security-first DevSecOps',
        'Velocity tracking & optimization'
      ]
    },
    {
      title: 'AI-Enabled Architecture',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Implement platform-centered transformation, legacy transformations, cloud migrations and greenfield solutions faster with AI-based tooling.',
      items: [
        'Microservices & mesh architecture',
        'Kubernetes orchestration',
        'Internal developer platforms',
        'Observability & SRE stacks'
      ]
    },
    {
      title: 'AI-Enabled Agile',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Pioneer innovation solutions that shape the future of software development by harnessing our expertise in AI practices and Agile.',
      items: [
        'Pioneering innovation solutions',
        'Future-shaping software development',
        'AI & Agile hybrid practices',
        'Iterative delivery models'
      ]
    }
  ];

  // ============================================
  // TECH STACK (Categorized Chips)
  // ============================================
  const technologies = [
    { category: 'Cloud & Platforms', items: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Linode'] },
    { category: 'Frameworks & Languages', items: ['React', 'Node.js', 'Next.js', 'TypeScript', 'Python', 'Go', '.Net Core'] },
    { category: 'DevOps & Tooling', items: ['Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'Prometheus', 'Grafana'] },
    { category: 'AI & Data', items: ['TensorFlow', 'PyTorch', 'OpenAI API', 'Hugging Face', 'MongoDB', 'PostgreSQL', 'Redis'] }
  ];

  // ============================================
  // WHY KANGQORE (Differentiators)
  // ============================================
  const whyKangqoreIntro = "Kangqore is an engineers-first organization. We prioritize architecture before execution, ensuring your modernization journey is stable, secure, and outcome-led.";
  const whyKangqore = [
    { title: 'Engineers-First Culture', icon: Terminal, description: 'Deep technical thinking is in our DNA. We solve complex architectural problems, not just tickets.' },
    { title: 'Architecture-First', icon: Layers, description: 'We never code without a robust, governed architectural foundation designed for your specific scale.' },
    { title: 'AI-Native Approach', icon: Cpu, description: 'We use AI to accelerate legacy assessment, code refactoring, and quality assurance workflows.' },
    { title: 'Governance Baked-In', icon: ShieldCheck, description: 'Compliance, security, and observability are core requirements, not afterthoughts.' },
    { title: 'ROI Focus', icon: TrendingUp, description: 'Every modernization wave is measured against deployment velocity, cost, and quality metrics.' },
    { title: 'Controlled Risk', icon: Shield, description: 'Our 5-phase modernization framework ensures phased migrations that maintain business continuity.' }
  ];

  // ============================================
  // INDUSTRY EXPERTISE (Targeted Descriptions)
  // ============================================
  const industryTitle = "Modernization Tailored for Your Industry Vertical";
  const industryIntro = "We bring deep domain knowledge to bridge the gap between legacy systems and modern industry requirements.";
  const industries = [
    { name: 'Fintech & Banking', icon: Building2, description: 'Modernizing legacy core banking and payments systems for real-time transactions and regulatory resilience.' },
    { name: 'Healthcare', icon: Heart, description: 'Decoupling monolith EHRs and patient portals to enable interoperability, AI diagnosis, and HIPAA-compliant cloud scale.' },
    { name: 'Retail & Commerce', icon: ShoppingCart, description: 'Modernizing inventory and POS systems for unified commerce and AI-personalized customer journeys.' },
    { name: 'Manufacturing', icon: Factory, description: 'Integrating legacy SCADA/MES with modern IoT, analytics, and autonomous supply chain systems.' },
    { name: 'Real Estate', icon: Home, description: 'Modernizing outdated CRM and listing engines for mobile-first, high-velocity digital sales cycles.' },
    { name: 'Media & Entertainment', icon: Film, description: 'Transforming monolithic CMS and distribution stacks for OTT streaming and personalized delivery at scale.' }
  ];

  // ============================================
  // FAQs (Modernization Framework Focused)
  // ============================================
  const customFAQs = [
    {
      question: `What is Kangqore's Modernization Framework?`,
      answer: `Kangqore follows a structured 5-phase modernization framework (Diagnose, Architect, Execute, Optimize, Govern) designed specifically for enterprise-scale technology modernization. It prioritizes controlled risk and architectural governance to ensure legacy systems are transformed into scalable assets without interrupting core business operations.`
    },
    {
      question: 'How do you mitigate risk during legacy migration?',
      answer: 'We follow an "Execute in Phases" strategy. This involves establishing parallel environments, conducting controlled migration waves, and performing rigorous pilot implementations for critical modules before full-scale rollout. This ensures that any issues are isolated and addressed without affecting the primary production environment.'
    },
    {
      question: 'Should I modernize or rebuild my legacy system?',
      answer: 'This depends on our initial "Diagnose & Deconstruct" phase. If the core business logic is sound but the delivery platform is outdated, refactoring or re-platforming is often better. If the architecture is fundamentally broken and restricts growth, a structured rewrite (re-architecting) using our proven modernization methodology is recommended.'
    },
    {
      question: 'How does AI accelerate the modernization process?',
      answer: 'We use AI-native tooling at three levels: 1) Automated technical debt mapping and dependency analysis, 2) Intelligent code refactoring and translation, and 3) AI-assisted test automation and security scanning. This typically improves project velocity by 40-60%.'
    },
    {
      question: 'How long does a typical modernization engagement take?',
      answer: 'A modular pilot typically takes 8-12 weeks. Complete enterprise modernization varies by scale, but our phased approach ensures you see measurable ROI and improved velocity within the first 90 days. We define clear milestones to maintain momentum.'
    },
    {
      question: 'How do you measure the success of modernization?',
      answer: 'Success is measured via core Enterprise Metrics: reduction in deployment cycle time (40-60%), infrastructure cost optimization (25-45%), defect reduction (30-50%), and overall release velocity improvement. We provide real-time dashboards to track these KPIs throughout the engagement.'
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
      capabilitiesTitle,
      whyKangqoreIntro,
      whyKangqore,
      industryTitle,
      industryIntro,
      industries,
      customFAQs,
      postIndustrySections: customSections,
      ctaTitle: 'Modernize Without Chaos.',
      ctaDescription: 'Let’s engineer your next technology chapter together. Accelerated delivery, architected for scale.',
      ctaButtonText: 'Schedule a Strategy Call'
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default TechnologyModernization;
