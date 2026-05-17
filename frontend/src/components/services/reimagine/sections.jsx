// ─── Kangqore Reimagine — Premium Service Content (Phase G3) ─────────────────
// Per-service premium presentation layer for Reimagine. Each entry is an
// object that merges over the canonical base service from servicesData.js to
// produce the legacy-template-compatible shape consumed by
// ServicePageTemplate.
//
// Per DoD #3: do NOT include base identity fields here (name, slug,
// departmentSlug, shortDescription). ServicePageReal re-asserts those after
// the spread and will silently drop any duplicates.
//
// Schema for each entry (all fields optional unless noted):
//   - titleLine1 (string)             — first line of hero title
//   - titleHighlight (string)         — gradient-highlighted line of hero title
//   - description (string | JSX)      — punchy hero description (overrides fullDescription)
//   - image (string)                  — hero/narrative image URL
//   - videoBackground (string)        — hero video URL
//   - primaryButton (object)          — { text, link }
//   - secondaryButton (object | null) — { text, link } or null to suppress
//   - stats (array)                   — [{ value, label, color }]
//   - hideGenericMidPageCta (bool)    — suppress template's generic CTA
//   - hideGenericFaq (bool)           — suppress template's generic FAQ
//   - highFidelity (object)           — { narrative, philosophy, matrix, schematic }
//   - capabilitiesTitle (string)      — title for the capabilities section
//   - capabilities (array)            — capability groups (legacy shape)
//   - customSections (JSX)            — JSX fragment containing dept-specific sections
//   - postCapabilitiesSections (JSX)  — JSX injected after capabilities
//
// Slug normalization (G3):
//   legacy `blockchain-engineering` → canonical `blockchain`
//
// Technology-Transformation special: the canonical TT service is assembled
// from three legacy files — TechnologyTransformation.jsx (parent shape) plus
// two pillar detail pages (TechnologyLedGrowthStrategy +
// TechValueOptimization). The two pillars are decomposed into inline JSX
// (interactive carousel + accordion replaced with static equivalents) and
// injected via postCapabilitiesSections. The other 5 TT detail subpages were
// 29-line placeholder stubs and have been dropped.
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  // shared / blockchain
  Binary, ShieldCheck, Activity, Server, Briefcase, Search, Layers, Network,
  // consulting (technology / strategy / workshops)
  Compass, Target, Rocket, Award, TrendingUp, Gauge, Cloud, BrainCircuit,
  Lightbulb, BarChart3, LayoutTemplate, MonitorSmartphone, CalendarDays,
  Cpu, CheckCircle2, Radar,
  // technology-transformation parent + pillars
  Zap, AlertTriangle, Brain, Terminal, Globe, Building2, Heart, ShoppingCart,
  Factory, Film, Plane, PieChart,
} from 'lucide-react';
import {
  BlockchainPhilosophyBackground,
  BlockchainWhySection,
  BlockchainValueDeliver,
  BlockchainDiamondCoESection,
  BlockchainDeliveryModel,
  BlockchainExecutionEcosystem,
  BlockchainFutureReadySection,
} from './BlockchainCustomSections';

// ─── blockchain (Reimagine — canonical slug; legacy: blockchain-engineering) ──
const blockchain = {
  titleLine1: 'Blockchain',
  titleHighlight: 'Engineering.',
  description:
    'Kangqore helps enterprises design, engineer, and secure blockchain ecosystems that move beyond concept-stage exploration into production-ready business platforms. We combine architecture strategy, platform engineering, smart contracts, dApps, security, interoperability, and analytics to help organizations build distributed systems that are resilient, governable, and commercially useful.',
  image:
    'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  videoBackground: '/videos/engineering-rd-bg.mp4',

  primaryButton: { text: 'Schedule A Blockchain Strategy Review', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  stats: [
    { value: 'Trust', label: 'Distributed, verifiable digital records', color: 'text-cyan-400' },
    { value: 'Secure', label: 'Smart contracts, identities, and transactions', color: 'text-blue-400' },
    { value: 'Scale', label: 'Platform foundations built for production', color: 'text-brand-blue' },
    { value: 'Apply', label: 'Industry-led blockchain use cases', color: 'text-purple-400' },
  ],

  highFidelity: {
    narrative: {
      badge: 'BLOCKCHAIN :: TRUST ARCHITECTURE',
      titleLine1: 'Trust',
      titleHighlight: 'Harder',
      titleLine2: 'to Engineer.',
      description:
        'Modern commerce demands more than just ledgers. It requires boundary clarity, cryptographic foresight, delivery rigor, identity-first security, and the ability to adapt as distributed networks expand. At Kangqore, we engineer blockchain ecosystems as resilient business platforms.',
      bottleneckLabel: 'The Credibility Gap',
      bottleneckText:
        'Blockchain becomes meaningful only when it is translated from theory into a dependable system of record. At its core, it enables trust without central validation—but only if performance, interoperability, and security are architected correctly.',
      requirementLabel: 'The Kangqore Way',
      requirementText:
        'A unified engineering discipline that connects protocol strategy, smart-contract rigor, platform governance, and identity-first security into one cohesive, scalable ecosystem.',
      image:
        'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=format&fit=crop&w=1260&q=80',
      statusLabel: 'System Integrity',
      statusValue: '100% IMMUTABLE',
    },
    philosophy: {
      icon: <Binary className="w-7 h-7 text-gray-900 dark:text-white" />,
      title: 'Standardize with Clarity.',
      titleHighlight: 'Scale with Purpose.',
      description:
        'We replace experimental pilots with architected, governed blockchain platforms designed for absolute business confidence.',
      bgElement: <BlockchainPhilosophyBackground />,
      pills: ['Protocol Strategy', 'Smart Contract Rigor', 'Identity-First', 'Ecosystem Interop'],
      features: [
        { title: 'Protocol Strategy', label: 'Platform Fit Assessment', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Make the right protocol and infrastructure decisions before build complexity leads to fragility.' },
        { title: 'Registry Discipline', label: 'Identity Governance', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'Define identity boundaries and access models using zero-trust principles to secure every interaction.' },
        { title: 'Contract Rigor', label: 'Immutable Logic', icon: <ShieldCheck className="w-5 h-5 text-gray-400" />, content: 'Embed auditability and security into the core contract fabric, ensuring logic scales with absolute control.' },
        { title: 'Runtime Control', label: 'Proactive Visibility', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Integrate real-time monitoring and analytics into the ledger fabric to ensure total visibility.' },
      ],
    },
    matrix: {
      engineId: 'ENGINE :: BLOCK_V2',
      title: 'Our Execution Matrix.',
      subtext:
        'A connected system for moving from blockchain experimentation to governed, scalable architectures.',
      layers: [
        { title: 'Assess', id: 'BC_ASSESS', icon: <Search />, desc: 'Use-case validation, protocol fit, and ecosystem requirement deconstruction.' },
        { title: 'Architect', id: 'BC_ARCH', icon: <Layers />, desc: 'Ledger model, security policy, and interaction planning for resilient systems.' },
        { title: 'Engineer', id: 'BC_ENG', icon: <Server />, desc: 'Smart contract implementation with automated audits and policy-as-code execution.' },
        { title: 'Operate', id: 'BC_OPER', icon: <Activity />, desc: 'Trust-based observability, lifecycle control, and runtime governance.' },
      ],
    },
    schematic: {
      titleLine1: 'Governed Trust.',
      titleHighlight: 'Sustainable Scale.',
      description:
        'Your blockchain ecosystem should be your most trusted asset. We engineer it to stay that way—across every transaction and integration milestone.',
      stats: [
        { label: 'Network Uptime', val: '99.9%' },
        { label: 'Smart Contract Audits', val: '100%' },
        { label: 'Data Integrity', val: 'ABSOLUTE' },
      ],
    },
  },

  // Trust strip + why + use cases preserved from legacy
  trustStrip:
    'Helping enterprises design blockchain platforms, smart contracts, distributed applications, and security models that create trust, resilience, and real-world operational value.',

  whyKangqore: [
    { title: 'Architecture-Led by Default', description: 'We define the right protocol, platform, infrastructure, and governance decisions before the build path risks compound.', icon: Layers },
    { title: 'Security-Native Engineering', description: 'Identity, cryptography, privacy, and smart-contract risk are core design concerns, not late-stage controls.', icon: ShieldCheck },
    { title: 'Platform + Application Depth', description: 'From ledger infrastructure and smart contracts to dApps and middleware, we engineer the full stack.', icon: Server },
  ],

  industries: [
    { name: 'Supply Chain', description: 'Improve trust, traceability, and monitoring across multi-party supply environments.', icon: Network },
    { name: 'Healthcare', description: 'Interoperable frameworks for electronic health records and patient data integrity.', icon: Activity },
    { name: 'Cybersecurity & Identity', description: 'Self-sovereign identity models and tamper-resistant user verification.', icon: ShieldCheck },
    { name: 'Telecom', description: 'Settlement, fraud reduction, and network-wide transaction trust.', icon: Server },
    { name: 'Insurance', description: 'Claims-related trust, SLA performance, and customer-facing transparency.', icon: Briefcase },
  ],

  capabilitiesTitle: 'Our Capabilities.',
  capabilitiesDescription:
    "Kangqore’s blockchain engineering capabilities are designed to help enterprises move from conceptual interest to production-ready distributed systems.",
  capabilities: [
    {
      title: 'Advisory, Design & Architecture',
      description: 'Make the right blockchain architecture decisions before protocol, platform, and governance complexity multiply. We help define consensus models, infrastructure strategy, and compliance frameworks to ensure long-term stability.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Use-case and platform fit assessment',
        'Consensus and protocol strategy',
        'Governance and compliance design',
        'High-performance architecture planning',
      ],
      micro: 'The right foundation for distributed trust.',
    },
    {
      title: 'Blockchain Platform Engineering',
      description: 'Engineer the underlying platform for security, speed, interoperability, and long-term reliability. We design infrastructure layers that support high-speed transactions, monitoring, and cloud-native resilience.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Blockchain infrastructure design',
        'High-speed networking architecture',
        'Cloud-based engineering patterns',
        'Monitoring and analytics support',
      ],
      micro: 'Scalable infrastructure for global ledgers.',
    },
    {
      title: 'Industry-Specific dApps Engineering',
      description: 'Build web and mobile distributed applications that turn blockchain capability into usable business experiences. We combine UX-led design with smart-contract interaction models and scalable microservices.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Workflow and UX-led dApp design',
        'Web and mobile application engineering',
        'Smart-contract-connected interfaces',
        'Microservices-led application patterns',
      ],
      micro: 'Turning tech into intuitive experiences.',
    },
    {
      title: 'Smart Contract Solutions Development',
      description: 'Create secure, automated contract logic that reduces friction and supports new business models. Our engineering rigor ensures contracts are audited, testable, and integrated seamlessly into business workflows.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Smart contract engineering (Solidity/Go)',
        'Contract testing and automation',
        'Lifecycle audit and analytics',
        'Process integration and workflows',
      ],
      micro: 'Programmable trust for modern commerce.',
    },
    {
      title: 'Blockchain Security Services',
      description: 'Protect blockchain environments across identity, privacy, application security, and distributed infrastructure risk. We treat security as a core design concern rather than an afterthought.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Secure access and cryptography',
        'Privacy and key management patterns',
        'Self-sovereign identity architecture',
        'Third-party security reviews',
      ],
      micro: 'Zero-trust rigor for distributed systems.',
    },
    {
      title: 'Middleware, Eventing & Analytics',
      description: 'Create the service layer that connects dApps, contracts, policies, events, and intelligence across the blockchain stack. We enable real-time observability and anomaly detection.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Identity and policy service development',
        'Event streaming and consensus services',
        'Analytics for anomaly detection',
        'Self-healing support patterns',
      ],
      micro: 'Intelligence across the ledger fabric.',
    },
  ],

  technologies: [
    { category: 'Platforms & Frameworks', items: ['Ethereum', 'Hyperledger Fabric', 'Cordna', 'Quorum', 'Polygon', 'Solana'] },
    { category: 'Contract Development', items: ['Solidity', 'Rust', 'Go', 'Vyper', 'Truffle', 'Hardhat'] },
    { category: 'dApp Engineering', items: ['React', 'Next.js', 'Ethers.js', 'Web3.js', 'Node.js', 'GraphQL'] },
    { category: 'Platform & Infrastructure', items: ['AWS Blockchain', 'Azure Workbench', 'Kubernetes', 'Infura', 'Alchemy'] },
    { category: 'Security & Identity', items: ['OpenZeppelin', 'Identity.com', 'WalletConnect', 'Metamask', 'Vault'] },
    { category: 'Analytics & Intelligence', items: ['Dune Analytics', 'Graph Protocol', 'Splunk for Blockchain', 'Chainlink'] },
  ],

  trustPillars: [
    { title: 'Protocol foresight before scaling', tag: 'Architecture', description: 'Design ledgers that prioritize performance and governance without creating bottlenecks.' },
    { title: 'Identity-first security protocols', tag: 'Security', description: 'Protect every interaction with hardened authentication and zero-trust rigor.' },
    { title: 'Interoperability-first design', tag: 'Integration', description: 'Ensure shared data layers connect seamlessly with legacy and modern ecosystems.' },
  ],

  customFAQs: [
    { question: 'What makes blockchain different from a traditional system of record?', answer: 'Blockchain introduces distributed trust, immutability, and mathematical verification, which reduces dependence on a central validating authority for record integrity.' },
    { question: 'Why do many blockchain projects struggle to scale?', answer: 'Because performance, consensus overhead, infrastructure design, interoperability, and ecosystem readiness are often underestimated early.' },
    { question: 'What should enterprises decide before building a blockchain solution?', answer: 'They should define the use case, trust model, platform fit, consensus approach, compliance implications, integration needs, and security architecture.' },
    { question: 'Are smart contracts enough on their own?', answer: 'No. Smart contracts matter, but the broader value comes from the surrounding platform, applications, integrations, monitoring, analytics, and security model.' },
    { question: 'How do you secure blockchain environments?', answer: 'Through a combination of secure access design, privacy controls, key management, identity architecture, application security, device security, and third-party security reviews.' },
    { question: 'Where does blockchain deliver the strongest business value today?', answer: 'Supply chain, healthcare, cybersecurity, telecom, and insurance are currently the most meaningful use-case areas for distributed trust.' },
  ],

  customSections: (
    <div className="flex flex-col w-full">
      <BlockchainWhySection />
      <BlockchainValueDeliver />
      <BlockchainDiamondCoESection />
      <BlockchainDeliveryModel />
    </div>
  ),

  postFAQSections: (
    <div className="flex flex-col w-full">
      <BlockchainExecutionEcosystem />
      <BlockchainFutureReadySection />
    </div>
  ),
};

// ─── technology-consulting (Reimagine — T3, full bespoke inline JSX) ──────────
const technologyConsultingAdvisoryCoESection = (
  <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* ==================== TWO-COLUMN LAYOUT: INTRO + DIAGRAM ==================== */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
        {/* LEFT: Intro Text */}
        <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
          <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
            <p className="text-[17px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
              Kangqore's Advisory Center of Excellence (CoE) addresses four critical technology decision domains — <strong className="text-brand-blue">Discovery & Validation</strong>, <strong className="text-brand-blue">Architecture & Audit</strong>, <strong className="text-brand-blue">Strategy & Roadmap</strong>, and <strong className="text-brand-blue">Transformation & Migration</strong>.
            </p>
            <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              We replace fragmented advisory with a unified consulting model. From concept validation and legacy assessment to cloud migration planning and digital transformation, our framework ensures strategic clarity, reduced risk, and measurable transformation outcomes.
            </p>
          </div>
        </div>

        {/* RIGHT: Diamond Diagram */}
        <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
          {/* Desktop Diamond Layout */}
          <div className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
            <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
              {/* SVG — connector lines */}
              <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="coe-blue-grad-tc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" />
                    <stop offset="100%" stopColor="#4ab6d4" />
                  </linearGradient>
                </defs>
                <circle cx="300" cy="40" r="7" fill="url(#coe-blue-grad-tc)" />
                <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#coe-blue-grad-tc)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="40" cy="300" r="7" fill="url(#coe-blue-grad-tc)" />
                <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#coe-blue-grad-tc)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="300" cy="560" r="7" fill="url(#coe-blue-grad-tc)" />
                <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#coe-blue-grad-tc)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="560" cy="300" r="7" fill="url(#coe-blue-grad-tc)" />
                <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#coe-blue-grad-tc)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* ===== 3D DIAMOND ===== */}
              <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                <div className="w-full h-full rounded-[20px] p-[3px]" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d', filter: 'drop-shadow(0 40px 30px rgba(15,40,100,0.25)) drop-shadow(0 15px 15px rgba(37,100,234,0.15))' }}>
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Top Left -> Discovery & Validation */}
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #4b8bf5 0%, #2564ea 50%, #1d4ed8 100%)', transform: 'translateZ(6px)' }}>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight">Discovery &</span>
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight">Validation</span>
                      </div>
                    </div>
                    {/* Top Right -> Architecture & Audit */}
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #6db3f8 0%, #3b82f6 50%, #2564ea 100%)', transform: 'translateZ(4px)' }}>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight">Architecture &</span>
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight">Audit</span>
                      </div>
                    </div>
                    {/* Bottom Left -> Strategy & Roadmap */}
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #2564ea 0%, #1e40af 50%, #1e3a8a 100%)', transform: 'translateZ(2px)' }}>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight">Strategy &</span>
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight">Roadmap</span>
                      </div>
                    </div>
                    {/* Bottom Right -> Transformation & Migration */}
                    <div className="relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #5cc8e0 0%, #4ab6d4 50%, #2d9db8 100%)', transform: 'translateZ(3px)' }}>
                      <div className="-rotate-45 text-center flex flex-col justify-center relative z-10">
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight">Transformation</span>
                        <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight">& Migration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile / Tablet Layout */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {[
              { title: 'Discovery & Validation', gradient: 'from-[#2564ea] to-[#3b82f6]', dotColor: 'bg-[#2564ea]', items: ['Concept Validation', 'User Journey Framing', 'Feasibility Analysis', 'MVP & Stack Planning'] },
              { title: 'Architecture & Audit', gradient: 'from-[#3b82f6] to-[#60a5fa]', dotColor: 'bg-[#3b82f6]', items: ['Architecture Review', 'Risk & Gap Analysis', 'Scalability Evaluation', 'Opportunity Mapping'] },
              { title: 'Strategy & Roadmap', gradient: 'from-[#1e40af] to-[#2564ea]', dotColor: 'bg-[#1e40af]', items: ['Roadmap Creation', 'Investment Prioritization', 'Business-Tech Alignment', 'Decision Support'] },
              { title: 'Transformation & Migration', gradient: 'from-[#4ab6d4] to-[#38bdf8]', dotColor: 'bg-[#4ab6d4]', items: ['Migration Planning', 'Wave & Dependency Mapping', 'Digital Transformation', 'Change Enablement'] },
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

      {/* ==================== KEY DIFFERENTIATORS ==================== */}
      <div className="max-w-5xl mx-auto">
        <div className="space-y-4">
          {[
            { num: 1, title: 'Business-Aligned Advisory', text: 'We ensure technology strategy supports revenue, efficiency, customer experience, and long-term operating goals—connecting every recommendation to a measurable business outcome rather than isolated technical upgrades.' },
            { num: 2, title: 'Future-Ready Decisioning', text: 'We help organizations modernize confidently across cloud, AI, security, data, and platform engineering without relying on trend-driven guesswork—grounding every decision in feasibility and execution reality.' },
            { num: 3, title: 'Execution-Shaped Expertise', text: 'Our consulting approach is built on implementation depth, so the roadmap we deliver is practical, scalable, and operationally ready—not just a PowerPoint recommendation.' },
            { num: 4, title: 'Risk-Aware Transformation', text: "Every recommendation accounts for technical debt, migration risk, compliance constraints, and organizational readiness—ensuring that transformation doesn't create new problems while solving old ones." },
            { num: 5, title: 'Domain-Deep Technology Expertise', text: 'We bring proven depth across cloud strategy, platform engineering, architecture modernization, data, AI, and enterprise security—giving you access to specialized knowledge without the hiring overhead.' },
          ].map((diff) => (
            <div key={diff.num} className="diff-item group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-[2px] transition-all duration-500 relative overflow-hidden">
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

const technologyConsultingExecutionEcosystemSection = (
  <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        <div className="lg:w-1/2">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
            Related Advisory <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Expertise.</span>
          </h2>
          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
            Extend your technology consulting engagement with specialized capabilities in strategy, architecture, digital transformation, and operational modernization.
          </p>
          <div className="space-y-4">
            {[
              { name: 'Strategy Consulting', link: '/services/reimagine/strategy-consulting', icon: <Compass className="w-5 h-5" />, desc: 'Define business strategy aligned to technology decisions.' },
              { name: 'Cloud Infrastructure & Migrations', link: '/services/platforms/cloud-infrastructure-migrations', icon: <Cloud className="w-5 h-5" />, desc: 'Architect and deploy resilient cloud estates.' },
              { name: 'Operation Technology', link: '/services/platforms/operation-technology', icon: <Network className="w-5 h-5" />, desc: 'Converge industrial and IT operations at scale.' },
              { name: 'Managed Services', link: '/services/platforms/managed-services', icon: <ShieldCheck className="w-5 h-5" />, desc: 'Enterprise-grade managed IT operations.' },
            ].map((offering, idx) => (
              <a key={idx} href={offering.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all duration-500">
                <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-gradient group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                  {offering.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">{offering.name}</span>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{offering.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right Side — High-Fidelity Animated Schematic */}
        <div className="lg:w-1/2 relative flex justify-center lg:justify-end">
          <div className="relative aspect-square w-full max-w-[500px] mx-auto lg:mr-0">
            <div className="absolute top-0 right-0 w-72 h-72 bg-brand-blue/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400/10 blur-[100px] rounded-full"></div>

            <div className="absolute inset-0 opacity-[0.05]" style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '30px 30px', transform: 'perspective(500px) rotateX(45deg)' }}></div>

            <div className="absolute inset-4 rounded-full border border-dashed border-gray-200"></div>
            <div className="absolute inset-16 rounded-full border border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800/40 backdrop-blur-sm shadow-xl flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-brand-blue/20 border-t-brand-blue/60 border-l-brand-blue/60"></div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-slate-900 rounded-full shadow-[0_20px_50px_rgba(37,100,234,0.3)] flex flex-col items-center justify-center relative z-20 group border-4 border-white">
              <div className="absolute inset-0 bg-brand-gradient opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-700"></div>
              <BrainCircuit className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] mb-2" />
              <span className="font-mono text-[10px] text-white tracking-[0.2em] uppercase font-bold">ADVISORY</span>
              <span className="font-mono text-[9px] text-cyan-400 tracking-[0.1em] mt-1">KERNEL_V2</span>
            </div>

            {/* Orbiting Satellite Nodes */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group z-30">
              <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
                <Search className="w-7 h-7 text-blue-500" />
              </div>
            </div>
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 group z-30">
              <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 hover:translate-x-2 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300">
                <Layers className="w-7 h-7 text-indigo-500" />
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 group z-30">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center border border-slate-700 hover:translate-y-2 hover:shadow-2xl hover:border-purple-400 transition-all duration-300">
                <Target className="w-7 h-7 text-purple-400" />
              </div>
            </div>
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 group z-30">
              <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 hover:-translate-x-2 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300">
                <Rocket className="w-7 h-7 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const technologyConsulting = {
  titleLine1: 'Technology Consulting',
  titleHighlight: 'Services.',
  videoBackground: '/videos/business-meeting-6774639.mp4',
  description: 'Kangqore helps enterprises, scale-ups, and digital-first businesses define sharper technology roadmaps, modernize decision-making, and adopt the right platforms with confidence. We bring strategic clarity, engineering depth, and execution realism to every transformation journey—so your technology landscape evolves with purpose, not guesswork.',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  stats: [
    { value: 'Transition', label: 'To a stronger technology landscape', color: 'text-blue-500' },
    { value: 'Build', label: 'Future-ready digital capabilities', color: 'text-brand-blue' },
    { value: 'Accelerate', label: 'Time to value and adoption', color: 'text-indigo-500' },
    { value: 'Optimize', label: 'Cost, ROI, and long-term control', color: 'text-purple-500' },
  ],

  ctaTitle: 'Need clearer technology decisions before you commit major time and budget?',
  ctaDescription: "Let's define the right roadmap, evaluate the right-fit technologies, and turn your transformation priorities into a practical, scalable plan.",
  ctaSecondaryButton: { text: 'Explore Capabilities', link: '/contact' },

  highFidelity: {
    narrative: {
      badge: 'TECHNOLOGY ADVISORY :: 2026',
      titleLine1: 'When technology decisions outgrow',
      titleHighlight: 'internal clarity,',
      titleLine2: 'transformation slows.',
      description: 'Modern businesses are expected to modernize continuously—across cloud, data, AI, security, platforms, and customer experience—while still controlling cost and operational risk. Kangqore helps leaders cut through complexity, evaluate the right technology paths, and make confident decisions that improve scalability, resilience, and business velocity.',
      bottleneckLabel: 'The Drift',
      bottleneckText: 'Disconnected decisions across platforms, vendors, and teams quietly increase cost, delay, and technical debt.',
      requirementLabel: 'The Opportunity',
      requirementText: 'The right consulting model turns technology from a reactive support function into a lever for growth, modernization, and competitive advantage.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      statusLabel: 'Advisory Status',
      statusValue: 'STRATEGIC',
    },
    philosophy: {
      icon: <Compass className="w-7 h-7 text-brand-blue" />,
      title: 'Our Technology Consulting',
      titleHighlight: 'Delivery Model.',
      description: 'At Kangqore, technology consulting is structured as a disciplined advisory-to-execution model—designed to improve clarity, reduce risk, and create stronger transformation outcomes.',
      pills: ['Analyse', 'Strategize', 'Manage', 'Optimize'],
    },
    matrix: {
      engineId: 'Engine :: TECH_ADV_V1',
      title: '4-Phase Advisory Lifecycle',
      subtext: 'We deconstruct the complexity of technology transformation into governed, measurable advisory layers.',
      layers: [
        { title: 'Analyse', id: 'ADV_ANALYSE', icon: <Search />, desc: 'Understand business goals, current systems, process realities, dependencies, and risk areas.' },
        { title: 'Strategize', id: 'ADV_STRAT', icon: <Layers />, desc: 'Create a roadmap for modernization, architecture decisions, transformation priorities, and platform alignment.' },
        { title: 'Manage', id: 'ADV_MANAGE', icon: <ShieldCheck />, desc: 'Support solution planning, implementation readiness, stakeholder coordination, and team enablement.' },
        { title: 'Optimize', id: 'ADV_OPT', icon: <Activity />, desc: 'Continuously evaluate outcomes, refine the technology path, and adapt strategy as priorities evolve.' },
      ],
    },
    schematic: {
      titleLine1: 'Decisions that',
      titleHighlight: 'Actually Deliver.',
      description: 'Your technology consulting investment should generate compounding business returns. We engineer the advisory frameworks that make transformation measurable, sustainable, and outcome-driven.',
      stats: [
        { label: 'Clarity', val: 'STRATEGIC' },
        { label: 'Decisions', val: 'CONFIDENT' },
        { label: 'ROI', val: 'MEASURABLE' },
      ],
    },
  },

  capabilitiesDescription:
    "Kangqore's technology consulting capabilities are designed to help organizations make smarter technology decisions across discovery, architecture, modernization, migration, and transformation. We combine business-context understanding, engineering practicality, and roadmap precision to help leaders move from fragmented technology choices to scalable execution models.",
  capabilities: [
    {
      title: 'Product Discovery',
      description: 'Translate early ideas into structured, feasible digital opportunities.\n\nKangqore helps validate concepts, define user journeys, shape product scope, and identify the right-fit technology stack before investment moves into full-scale build.',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Concept validation and requirement discovery',
        'User journey and experience framing',
        'Scope shaping and feasibility analysis',
        'Technology fitment and MVP planning',
      ],
    },
    {
      title: 'Solution Audit',
      description: 'Assess systems, processes, and architecture to uncover risk and opportunity.\n\nWe evaluate your current technology landscape to identify structural gaps, performance limitations, technical debt, security concerns, and modernization priorities.',
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        'Architecture and solution review',
        'Risk, gap, and dependency analysis',
        'Performance and scalability evaluation',
        'Opportunity mapping and recommendation framework',
      ],
    },
    {
      title: 'Strategy Consulting',
      description: 'Build a technology roadmap that aligns with business direction.\n\nKangqore works with leadership teams to define practical roadmaps, investment priorities, platform direction, and execution sequencing that support business growth and transformation.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Technology roadmap creation',
        'Investment and platform prioritization',
        'Business-to-technology alignment',
        'Strategic decision support for scale and change',
      ],
    },
    {
      title: 'Modernization Consulting',
      description: 'Evolve legacy environments into more agile, integration-ready systems.\n\nWe help organizations rethink aging applications and architecture models so their technology estate becomes easier to scale, secure, integrate, and improve.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Legacy assessment and modernization planning',
        'Architecture evolution strategy',
        'Performance and maintainability improvement',
        'Integration readiness and future-state design',
      ],
    },
    {
      title: 'Migration Planning',
      description: 'Design lower-risk transitions across cloud, platforms, and architectures.\n\nKangqore helps plan migration journeys with business continuity, security, sequencing, and operational readiness at the core—so transition becomes controlled, not disruptive.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Migration readiness assessment',
        'Dependency mapping and wave planning',
        'Risk, security, and continuity alignment',
        'Transition roadmap and execution preparation',
      ],
    },
    {
      title: 'Digital Transformation',
      description: 'Turn technology change into business-level transformation.\n\nWe help enterprises adopt new technologies, redesign operating workflows, and create more agile digital models across experience, data, automation, and cloud-led initiatives.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/digital-transformation.png',
      items: [
        'Transformation vision and opportunity mapping',
        'Process and operating-model redesign',
        'Data, cloud, and automation alignment',
        'Change enablement and execution planning',
      ],
    },
  ],

  trustStripText: 'Helping organizations align technology strategy, modernization priorities, and execution roadmaps with real business outcomes.',

  trustPillars: [
    { title: 'Transition to a Better Technology Landscape', tag: 'Foundation', description: 'Assess current systems, architecture, and operating realities to identify better-fit technology paths with minimal business disruption.' },
    { title: 'Build Future-Ready Solutions', tag: 'Innovation', description: 'Shape scalable, modern technology foundations across AI, cloud, data, security, UX, and digital platforms.' },
    { title: 'Achieve Faster Time to Value', tag: 'Speed', description: 'Reduce wasted experimentation and move from evaluation to measurable execution with sharper prioritization and roadmap clarity.' },
    { title: 'Optimize Cost and ROI', tag: 'Efficiency', description: 'Align technology investments to business goals, reduce avoidable spend, and improve long-term return from platforms, teams, and vendors.' },
    { title: 'Improve Business Processes', tag: 'Transformation', description: 'Use technology as a lever to streamline workflows, strengthen analytics, improve decision-making, and support regulatory readiness.' },
    { title: 'Reduce Total Cost of Ownership', tag: 'Governance', description: 'Lower the total cost of ownership through modernization planning, vendor rationalization, governance, and sustainable operating choices.' },
  ],
  trustPillarsRightTitle: 'Value We Deliver with Technology Consulting',
  trustPillarsRightDescription: 'Kangqore combines strategic technology thinking with real engineering depth. We help organizations identify the right technology decisions, evaluate feasibility, reduce transformation risk, and prepare for scalable execution—turning advisory into measurable business value.',
  trustPillarsRightButton: 'Request a Consultation',

  whyKangqoreIntro: 'Kangqore combines strategic technology thinking with real engineering depth. We do not stop at recommendations—we help organizations identify the right technology decisions, evaluate feasibility, reduce transformation risk, and prepare for scalable execution.',
  whyKangqore: [
    { icon: Award, title: 'Business-Aligned Advisory', description: 'We make sure technology strategy supports revenue, efficiency, customer experience, and long-term operating goals—not isolated technical upgrades.' },
    { icon: Target, title: 'Future-Ready Decisioning', description: 'We help organizations modernize confidently across cloud, AI, security, data, and platform engineering without relying on trend-driven guesswork.' },
    { icon: Rocket, title: 'Execution-Shaped Expertise', description: 'Our consulting approach is grounded in implementation reality, so the roadmap is practical, scalable, and easier to operationalize.' },
    { icon: ShieldCheck, title: 'Risk-Aware Transformation', description: 'Every recommendation accounts for technical debt, migration risk, compliance constraints, and organizational readiness.' },
    { icon: TrendingUp, title: 'Measurable Outcomes', description: 'We track advisory impact against business KPIs—not vague improvement narratives—to keep transformation focused on value.' },
    { icon: Gauge, title: 'Domain-Deep Expertise', description: 'Our consultants bring proven depth across cloud strategy, platform engineering, architecture modernization, data, AI, and enterprise security.' },
  ],

  industryTitle: 'Industry-Specific Technology Advisory.',
  industryIntro: 'Technology strategy only works when it understands domain realities. Kangqore brings consulting depth across industries where architecture, compliance, scalability, customer experience, and modernization choices directly affect business performance.',
  industries: [
    { name: 'Healthcare', description: 'Shape secure, interoperable digital ecosystems across patient platforms, EHR-connected systems, compliance-aware infrastructure, and data-led care experiences.' },
    { name: 'Software & Technology', description: 'Improve product velocity, system architecture, cloud strategy, platform scalability, and engineering effectiveness across modern software businesses.' },
    { name: 'Fintech', description: 'Design trusted, resilient, high-compliance technology stacks for digital finance, lending, payment ecosystems, and financial product innovation.' },
    { name: 'Banking', description: 'Support modernization across secure banking systems, digital channels, integrations, CRM, risk controls, and customer-facing platform experiences.' },
    { name: 'Real Estate', description: 'Enable smarter property operations, CRM flows, analytics, digital customer journeys, and integrated real estate platforms that scale with demand.' },
    { name: 'Travel & Transportation', description: 'Improve efficiency, system coordination, mobile-led experiences, integration readiness, and digital transformation across service-heavy transport ecosystems.' },
  ],

  technologiesTitle: 'Tools & Technologies We Excel In',
  technologiesDescription: 'We work across modern product, platform, cloud, data, and delivery ecosystems—aligning technologies to your business goals, architecture needs, and execution model.',
  technologies: [
    { category: 'Frontend Technologies', items: ['React', 'Angular', 'Vue.js', 'Next.js', 'Astro', 'HTML5', 'CSS'] },
    { category: 'Backend Technologies', items: ['.NET', 'Java', 'Node.js', 'Python', 'PHP', 'Go'] },
    { category: 'Databases / Data Storage', items: ['MySQL', 'SQL Server', 'MongoDB', 'Amazon S3', 'Amazon RDS', 'Cassandra'] },
    { category: 'Cloud Technologies', items: ['AWS', 'Microsoft Azure', 'Google Cloud'] },
    { category: 'Mobile', items: ['iOS', 'Android', 'Xamarin', 'Cordova', 'PWA', 'React Native', 'Flutter'] },
    { category: 'DevOps', items: ['Linux', 'Jenkins', 'Terraform', 'Ansible', 'Kubernetes', 'Docker', 'Azure DevOps / GitHub Actions'] },
  ],

  faqTitle: 'Frequently Asked Questions',
  faqSubline: 'Common questions about our technology consulting approach, delivery model, and business outcomes.',
  customFAQs: [
    { question: 'Why are technology consulting services important?', answer: 'They help organizations make better technology decisions, reduce risk, improve cost efficiency, and adopt change with greater confidence. Without structured advisory, businesses often invest in platforms or architectures that create long-term friction instead of value.' },
    { question: 'What are the benefits of technology consulting services?', answer: 'Typical benefits include access to domain expertise, cost efficiency through smarter investments, reduced transformation risk, independent and unbiased advice, and exposure to more modern technology options that match real business needs.' },
    { question: 'What do technology consulting services include?', answer: 'They typically cover software consulting, IT advisory, cloud strategy, AI and IoT guidance, modernization planning, migration readiness, architecture reviews, digital transformation support, and vendor-neutral technology evaluation.' },
    { question: 'What is the difference between IT consulting and technology consulting?', answer: 'IT consulting focuses more narrowly on information systems and operational technology management. Technology consulting is broader and includes transformation strategy, AI, cloud, modernization, platform engineering, architecture evolution, and emerging technology direction.' },
    { question: 'How does Kangqore approach technology consulting differently?', answer: "We combine strategic thinking with engineering depth. Our advisory is grounded in implementation reality—we don't just recommend, we help evaluate feasibility, assess risk, and shape execution-ready roadmaps that organizations can actually operationalize." },
    { question: 'What industries does Kangqore serve for technology consulting?', answer: 'We serve clients across Healthcare, Software & Technology, Fintech, Banking, Real Estate, Travel & Transportation, and other sectors where architecture, compliance, scalability, and modernization decisions directly affect business performance.' },
  ],

  preWhyKangqoreSections: technologyConsultingAdvisoryCoESection,
  postFAQSections: technologyConsultingExecutionEcosystemSection,
};

// ─── strategy-consulting (Reimagine — T3, full bespoke inline JSX) ───────────
const strategyConsultingTrendsSection = (
  <section className="py-24 bg-slate-50 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Left Intro */}
        <div className="lg:w-1/3">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            What's Shaping <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Strategy Now.</span>
          </h2>
          <div className="w-16 h-1.5 bg-brand-blue rounded-full mb-8"></div>
          <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
            The most resilient strategies go beyond operational planning to address the active disruptions pushing markets forward. Here is what leading organizations are navigating today.
          </p>
        </div>

        {/* Right Layout: Strategy Constellation Motion Graphic (static — animations stripped) */}
        <div className="lg:w-2/3 flex items-center justify-center relative min-h-[500px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 800 600" className="w-full h-full max-w-3xl overflow-visible">
              <defs>
                <linearGradient id="strat-lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="strat-ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" stopOpacity="1" />
                  <stop offset="100%" stopColor="#f8fafc" stopOpacity="0" />
                </linearGradient>
                <filter id="strat-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Rings */}
              <g>
                <circle cx="400" cy="300" r="220" fill="none" stroke="url(#strat-ringGrad)" strokeWidth="1" strokeDasharray="4 8" />
                <circle cx="400" cy="300" r="280" fill="none" stroke="#f1f5f9" strokeWidth="1" />
              </g>

              {/* Central Kernel */}
              <g>
                <circle cx="400" cy="300" r="45" fill="#ffffff" filter="url(#strat-glow)" />
                <circle cx="400" cy="300" r="35" fill="#eff6ff" />
                <circle cx="400" cy="300" r="20" fill="#2563eb" />
                <text x="400" y="365" textAnchor="middle" className="text-sm font-bold fill-slate-800 tracking-widest uppercase">Growth in AI</text>
                <text x="400" y="385" textAnchor="middle" className="text-[10px] font-bold fill-blue-600 tracking-wider">CORE PRIORITY</text>
              </g>

              {/* Connecting Lines */}
              <g className="opacity-40">
                <path d="M 400 300 L 220 180" fill="none" stroke="url(#strat-lineGrad)" strokeWidth="2" />
                <path d="M 400 300 L 600 150" fill="none" stroke="url(#strat-lineGrad)" strokeWidth="2" />
                <path d="M 400 300 L 650 380" fill="none" stroke="url(#strat-lineGrad)" strokeWidth="2" />
                <path d="M 400 300 L 250 450" fill="none" stroke="url(#strat-lineGrad)" strokeWidth="2" />
                <path d="M 220 180 L 600 150" fill="none" stroke="url(#strat-lineGrad)" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 600 150 L 650 380" fill="none" stroke="url(#strat-lineGrad)" strokeWidth="1" strokeDasharray="4 4" />
              </g>

              {/* Orbital nodes with labels */}
              <g>
                <circle cx="220" cy="180" r="30" fill="#ffffff" filter="url(#strat-glow)" />
                <circle cx="220" cy="180" r="12" fill="#06b6d4" />
                <rect x="30" y="160" width="150" height="40" rx="6" fill="#ffffff" filter="url(#strat-glow)" />
                <text x="45" y="185" className="text-xs font-bold fill-slate-900 tracking-tight">Platform Strategy</text>
              </g>
              <g>
                <circle cx="600" cy="150" r="25" fill="#ffffff" filter="url(#strat-glow)" />
                <circle cx="600" cy="150" r="10" fill="#6366f1" />
                <rect x="640" y="130" width="160" height="40" rx="6" fill="#ffffff" filter="url(#strat-glow)" />
                <text x="655" y="155" className="text-xs font-bold fill-slate-900 tracking-tight">Complexity Dividend</text>
              </g>
              <g>
                <circle cx="650" cy="380" r="32" fill="#ffffff" filter="url(#strat-glow)" />
                <circle cx="650" cy="380" r="14" fill="#10b981" />
                <rect x="680" y="360" width="130" height="40" rx="6" fill="#ffffff" filter="url(#strat-glow)" />
                <text x="695" y="385" className="text-xs font-bold fill-slate-900 tracking-tight">Resilience Beyond</text>
              </g>
              <g>
                <circle cx="250" cy="450" r="28" fill="#ffffff" filter="url(#strat-glow)" />
                <circle cx="250" cy="450" r="12" fill="#a855f7" />
                <rect x="60" y="430" width="150" height="40" rx="6" fill="#ffffff" filter="url(#strat-glow)" />
                <text x="75" y="455" className="text-xs font-bold fill-slate-900 tracking-tight">Productivity Edge</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const strategyConsulting = {
  titleLine1: 'Strategy Consulting',
  titleHighlight: 'Services.',
  videoBackground: '/videos/business-meeting-6774639.mp4',
  description: 'Kangqore helps leadership teams redefine growth, sharpen strategic priorities, and build future-ready operating models for a market that changes faster every quarter. We combine business strategy, technology intelligence, AI-era decisioning, and execution realism to help organizations move from uncertainty to measurable momentum.',
  image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  stats: [
    { value: 'Reinvent', label: 'Growth & business direction', color: 'text-blue-500' },
    { value: 'Align', label: 'Business, technology & AI priorities', color: 'text-brand-blue' },
    { value: 'Improve', label: 'Cost, productivity & capital focus', color: 'text-indigo-500' },
    { value: 'Build', label: 'Resilient operating models', color: 'text-purple-500' },
  ],

  ctaTitle: 'Ready to turn strategy into measurable competitive advantage?',
  ctaDescription: "Let's define the right growth bets, operating priorities, and technology direction—so your organization can reinvent with confidence and execute with clarity.",
  ctaSecondaryButton: { text: 'Explore Capabilities', link: '/contact' },

  highFidelity: {
    narrative: {
      badge: 'STRATEGY ADVISORY',
      titleLine1: 'The old strategy cycle is',
      titleHighlight: 'too slow',
      titleLine2: "for today's market reality.",
      description: 'Disruption is compounding across technology, customer behavior, regulation, operating costs, and competitive pressure. Static planning is no longer enough. Kangqore helps organizations move from one-time strategic planning to continuous reinvention—so leadership teams can make better bets, adapt faster, and create stronger long-term value.',
      bottleneckLabel: 'The Pressure',
      bottleneckText: 'Strategy now has to respond to faster disruption, shorter decision windows, and more interconnected risks.',
      requirementLabel: 'The Shift',
      requirementText: 'The companies pulling ahead are not just planning better—they are reinventing faster, with technology and AI actively shaping strategy.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      statusLabel: 'Strategy Status',
      statusValue: 'REINVENTING',
    },
    philosophy: {
      icon: <Compass className="w-7 h-7 text-brand-blue" />,
      title: 'Our Strategy Consulting',
      titleHighlight: 'Delivery Model.',
      description: 'At Kangqore, strategy is structured as a disciplined advisory model—designed to sharpen choices, reduce uncertainty, and prepare leadership teams for confident execution.',
      pills: ['Understand', 'Reframe', 'Prioritize', 'Activate'],
    },
    matrix: {
      engineId: 'Engine :: STRAT_ADV_V1',
      title: '4-Phase Strategy Lifecycle',
      subtext: 'We deconstruct the complexity of business transformation into measurable strategic phases.',
      layers: [
        { title: 'Understand', id: 'STRT_UNDR', icon: <Search />, desc: 'Assess business context, market pressure, digital maturity, growth constraints, and strategic risk.' },
        { title: 'Reframe', id: 'STRT_RFRM', icon: <Lightbulb />, desc: 'Challenge assumptions, identify strategic opportunities, and define the future-state direction.' },
        { title: 'Prioritize', id: 'STRT_PRIO', icon: <Target />, desc: 'Turn ambition into decisions—bets, investments, operating shifts, and capability priorities.' },
        { title: 'Activate', id: 'STRT_ACT', icon: <Rocket />, desc: 'Translate strategy into execution roadmaps, governance, KPI models, and transformation momentum.' },
      ],
    },
    schematic: {
      titleLine1: 'Compounding',
      titleHighlight: 'Reinvention.',
      description: 'Emerging technology and AI are rewriting the rules of competitive advantage. Organizations that embed continuous reinvention into their strategy consistently outperform their peers.',
      stats: [
        { label: 'Growth Prem.', val: '+10%' },
        { label: 'Outperformance', val: '2.5x' },
        { label: 'Disruption', val: '+200%' },
      ],
    },
  },

  capabilitiesDescription:
    "Kangqore's strategy consulting capabilities are designed for organizations navigating growth pressure, cost pressure, AI disruption, and operating-model change at the same time. We help leadership teams connect strategy with technology, translate ambition into action, and build business models that stay competitive as markets evolve.",
  capabilities: [
    {
      title: 'Corporate Strategy & Growth',
      description: 'Shape a clearer growth agenda in markets where customer expectations, competitive dynamics, and AI-driven shifts are changing faster than traditional planning cycles can handle.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: [
        'Growth strategy and opportunity mapping',
        'Revenue model and market expansion planning',
        'Competitive positioning and strategic bet selection',
        'Strategic investment prioritization',
      ],
    },
    {
      title: 'Technology Strategy & AI Advisory',
      description: 'Align business strategy with the technology and AI decisions that will define future competitiveness.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Technology strategy and transformation direction',
        'AI and agentic-AI strategy alignment',
        'Platform and digital-core roadmap design',
        'Enterprise capability prioritization',
      ],
    },
    {
      title: 'Cost & Productivity Reinvention',
      description: 'Move beyond cost-cutting into productivity redesign that frees capital, strengthens competitiveness, and funds future growth.',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Cost and productivity diagnostics',
        'Operating leverage and efficiency strategy',
        'Investment reallocation and margin protection',
        'Workforce and process productivity strategy',
      ],
    },
    {
      title: 'Operating Model Strategy',
      description: 'Redesign how the business runs so strategy can scale through structure, accountability, decision rights, and execution rhythm.',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Enterprise and function operating models',
        'Governance and accountability design',
        'Cross-functional execution alignment',
        'Shared services / product operating model direction',
      ],
    },
    {
      title: 'Platform & Ecosystem Strategy',
      description: 'Build a platform- and partner-aware strategy for the AI era, where value increasingly depends on ecosystems, interoperability, and scalable digital foundations.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Platform strategy for new growth',
        'Ecosystem and partnership strategy',
        'Capability integration planning',
        'Digital-core and foundation prioritization',
      ],
    },
    {
      title: 'Resilience & Scenario Strategy',
      description: 'Strengthen strategic readiness in an environment shaped by volatility, complexity, and continuous external shocks.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Scenario planning and risk-informed strategy',
        'Resilience and continuity strategy',
        'Volatility response playbooks',
        'Strategic flexibility and contingency design',
      ],
    },
    {
      title: 'New Business & Market Entry',
      description: 'Identify where the next wave of growth can come from and design the path to enter, test, and scale new spaces with discipline.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'New market assessment',
        'Business case and adjacency planning',
        'New venture / new business model design',
        'Strategic expansion roadmaps',
      ],
    },
    {
      title: 'Strategy Execution & Value Realization',
      description: 'Make sure strategy does not stop at boardroom language. Translate it into portfolios, programs, measurable outcomes, and leadership cadence.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Initiative prioritization and roadmap design',
        'Transformation portfolio governance',
        'KPI and value-tracking framework',
        'Strategic execution rhythm and reviews',
      ],
    },
  ],

  trustStripText: 'Advising enterprises, growth-stage businesses, and transformation leaders on reinvention, profitable growth, strategic clarity, and execution-ready change.',

  trustPillars: [
    { title: 'Continuous reinvention, not static planning', tag: 'Agility', description: 'Help leadership teams shift from annual strategy cycles to dynamic, ongoing reinvention aligned to change.' },
    { title: 'Profitable growth with sharper strategic bets', tag: 'Growth', description: 'Identify where to grow, what to prioritize, and how to allocate investment with stronger confidence.' },
    { title: 'Technology- and AI-informed decision-making', tag: 'Intelligence', description: 'Use emerging technology, digital-core thinking, and AI-led insight to shape smarter strategic direction.' },
    { title: 'Cost and productivity reinvention', tag: 'Efficiency', description: 'Improve efficiency, create self-funded growth capacity, and redesign productivity for long-term competitiveness.' },
    { title: 'Resilience built into the strategy', tag: 'Resilience', description: 'Strengthen your business against volatility through scenario thinking, operating-model agility, and strategic flexibility.' },
    { title: 'Strategy translated into action', tag: 'Execution', description: 'Turn strategic ambition into portfolios, priorities, roadmaps, and measurable value realization.' },
  ],
  trustPillarsRightTitle: 'Value We Deliver with Strategy',
  trustPillarsRightDescription: 'We help organizations move from one-time strategic planning to continuous reinvention. By aligning business ambition with technology intelligence, AI, and operating realities, we ensure your strategy is built for profitable growth and execution.',
  trustPillarsRightButton: 'Request a Consultation',

  whyKangqoreIntro: 'Kangqore brings a more execution-shaped strategy model. We combine strategic thinking with technology depth, AI fluency, and implementation realism—so your strategy is not just intellectually strong, but operationally useful.',
  whyKangqore: [
    { icon: BrainCircuit, title: 'Business-Led, Tech-Shaped', description: 'We build strategies that connect business ambition with digital, AI, data, and platform realities.' },
    { icon: TrendingUp, title: 'Outcome-Oriented', description: 'We focus on profitable growth, productivity, resilience, and measurable enterprise value—not presentation-only strategy.' },
    { icon: Rocket, title: 'Built for Execution', description: 'We shape strategies that can actually be activated through roadmaps, governance, portfolios, and operating-model change.' },
  ],

  industryTitle: 'Where Our Strategy Work Creates Value',
  industryIntro: 'Strategy performs best when it is grounded in industry realities. Kangqore works across high-impact sectors to design growth paths, navigate disruption, and build future-ready operating models.',
  industries: [
    { name: 'Banking & Financial Services', description: 'Growth, resilience, digital-core modernization, platform strategy, and AI-led competitive response.' },
    { name: 'Healthcare & Life Sciences', description: 'Operating-model transformation, digital innovation, patient-centric growth, and data-led strategic direction.' },
    { name: 'High Tech & Software', description: 'Platform strategy, ecosystem growth, AI opportunity design, and product/business model reinvention.' },
    { name: 'Consumer, Retail & Commerce', description: 'Customer-led growth, operating efficiency, profitability improvement, and digital-channel strategy.' },
    { name: 'Manufacturing & Industrial', description: 'Resilience, supply-chain-linked strategic shifts, digital operations, and productivity reinvention.' },
    { name: 'Public Sector & Institutions', description: 'Service redesign, operational modernization, resilience, and digital strategy for long-term public value.' },
  ],

  technologiesTitle: 'Technology Foundations Shaping Strategy',
  technologiesDescription: 'Strategic advice must be grounded in platform reality. We guide enterprise decision-making across the dominant technology, data, and AI ecosystems that drive competitive advantage.',
  technologies: [
    { category: 'AI & Data Ecosystems', items: ['OpenAI / GPT-4', 'Anthropic Claude', 'Databricks', 'Snowflake', 'Microsoft Fabric', 'Google Vertex AI'] },
    { category: 'Enterprise Core', items: ['SAP S/4HANA', 'Salesforce Platform', 'Oracle Cloud ERP', 'Microsoft Dynamics 365', 'Workday'] },
    { category: 'Cloud & Infrastructure', items: ['Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform (GCP)', 'Hybrid Cloud Governance'] },
    { category: 'Value Orchestration', items: ['ServiceNow', 'Jira Align', 'Apptio', 'LeanIX (Enterprise Architecture)', 'Anaplan'] },
    { category: 'Business Intelligence', items: ['Microsoft Power BI', 'Tableau', 'Looker', 'Qlik Sense', 'Palantir Foundry'] },
    { category: 'Emerging Tech', items: ['Digital Twins', 'IoT Edge Platforms', 'Computer Vision', 'Agentic Workflow Engines'] },
  ],

  faqTitle: 'Frequently Asked Questions',
  faqSubline: 'Common questions about our strategy consulting approach and execution model.',
  customFAQs: [
    { question: 'What does Kangqore Strategy Consulting include?', answer: 'It includes growth strategy, technology and AI strategy, operating-model design, cost and productivity reinvention, resilience planning, and strategy execution support.' },
    { question: 'How is this different from technology consulting?', answer: 'Technology consulting focuses more deeply on solution, architecture, and platform decisions. Strategy consulting sits higher up—linking business direction, competitive priorities, value pools, operating models, and transformation choices.' },
    { question: 'Can you help align AI initiatives to business strategy?', answer: 'Yes. One of the strongest use cases for strategy consulting today is helping leadership teams connect AI investment to growth, productivity, platform readiness, and business value.' },
    { question: 'Do you support cost, growth, and operating-model strategy together?', answer: 'Yes. Those themes are increasingly interconnected, and modern strategy work performs best when they are addressed together.' },
    { question: 'How do you translate strategy into execution?', answer: 'We turn strategic direction into priorities, roadmaps, governance models, KPI frameworks, and transformation portfolios.' },
    { question: 'Which organizations benefit most from strategy consulting?', answer: 'Enterprises facing reinvention pressure, scaling companies entering a new growth phase, and leadership teams navigating AI, cost, resilience, or operating-model change.' },
  ],

  preWhyKangqoreSections: strategyConsultingTrendsSection,
};

// ─── discover-frame-workshops (Reimagine — T3, full bespoke inline JSX) ──────
const discoverFrameDeliverablesStepper = (
  <section className="py-24 bg-white dark:bg-black relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
        {/* LEFT: Heading & Image */}
        <div className="lg:w-[45%] h-full">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight font-display leading-[1.1]">
                Discovery Masterclass: <br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic">6-Step Strategic Workshop.</span>
              </h2>
              <div className="w-20 h-1.5 bg-brand-blue/20 rounded-full"></div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-brand-gradient opacity-[0.03] rounded-[2rem] -rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Workshop Analysis" className="relative z-10 rounded-[2rem] shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 aspect-[4/3] object-cover" />
            </div>
          </div>
        </div>

        {/* RIGHT: Stepper Content */}
        <div className="lg:w-[50%] relative py-12">
          <div className="absolute left-1 top-2 bottom-0 w-px bg-gray-100 dark:bg-[#0a0a0c] z-0"></div>

          <div className="space-y-24">
            {[
              { title: 'STEP 01: Strategic Discovery & Vision Alignment', points: ['Distill core product concepts into a cohesive vision that aligns with long-term enterprise objectives and business trajectory.', 'Identify unique value drivers, potential friction points, and market white spaces to sharpen your competitive advantage.', 'Execute rigorous feasibility research—balancing technical, commercial, and operational viability—to ensure a definitive path to success.'] },
              { title: 'STEP 02: Requirement Synthesis & Domain Analysis', points: ['Conduct a thorough landscape audit of competing ecosystems to pinpoint opportunities for disruptive innovation and functional superiority.', 'Decipher complex business logic into distinct, high-impact features that differentiate your digital product from the status quo.', 'Engineer a structured requirements backlog, translating user stories into technical specifications that define the functional perimeter.', 'Map intricate system dependencies and user interactions through high-fidelity diagrams, ensuring total transparency across the workflow.'] },
              { title: 'STEP 03: Solution Framework & MVP Scoping', points: ['Isolate mission-critical features to architect an MVP that delivers immediate market value while supporting core business goals.', "Deep-dive into the target persona's psychographics—addressing pain points and aspirations—to achieve seamless user-product resonance."] },
              { title: 'STEP 04: Visual Experience Architecture (UX/UI)', points: ["Architect high-fidelity wireframes that serve as a functional skeleton, allowing stakeholders to experience the product's narrative flow.", "Establish a sophisticated design language and aesthetic tokens that mirror your brand's DNA while optimizing the digital experience.", 'Engineer intuitive navigation pathways and micro-interactions that elevate usability into a world-class user journey.'] },
              { title: 'STEP 05: Technical Ecosystem & Scalability Blueprint', points: ['Appoint a future-ready technology stack—spanning frontend, robust backend, and cloud-native infrastructure—built for infinite scale.', 'Synthesize strategic third-party integrations, from secure payment gateways to AI-driven analytics, for a feature-rich implementation.', 'Design a multi-tier architectural block diagram, visualizing data orchestration and core component relationships.'] },
              { title: 'STEP 06: Transformation Roadmap & Commercial Blueprint', points: ['Produce a comprehensive project dossier detailing scope, resource allocation, and investment estimates with total commercial clarity.', 'Present a phased engineering roadmap with clearly defined sprints and deliverables, ensuring end-to-end visibility for stakeholders.', 'Solidify the execution timeline with critical milestones, establishing a high-accountability framework for launch and scale.'] },
            ].map((step, idx) => (
              <div key={idx} className="relative pl-12 group">
                <div className="absolute left-0 top-1.5 w-3 h-3 bg-white dark:bg-gray-900 dark:border-gray-800 border-2 border-brand-blue rounded-full z-10 transition-transform duration-300 group-hover:scale-125"></div>
                <div>
                  <h4 className="text-[17px] lg:text-[18px] font-bold text-brand-blue mb-6 tracking-wide uppercase font-display">
                    {step.title}
                  </h4>
                  <div className="space-y-4">
                    {step.points.map((p, pIdx) => (
                      <p key={pIdx} className="text-gray-500 text-[15px] lg:text-[16px] leading-relaxed font-light">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const discoverFrameDiscoveryCoESection = (
  <section className="py-20 lg:py-28 overflow-hidden relative bg-white dark:bg-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-12 mb-20 lg:mb-32">
        <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col justify-center">
          <div className="relative pl-6 border-l-[3px] border-transparent" style={{ borderImage: 'linear-gradient(180deg, #2564ea, #4ab6d4) 1' }}>
            <p className="text-[17px] lg:text-lg text-gray-800 dark:text-gray-50 leading-relaxed font-medium mb-5">
              Our <strong className="text-brand-blue">Discovery & Frame CoE</strong> provides a high-fidelity operational blueprint, surrounding your product idea with four critical execution layers.
            </p>
            <p className="text-[15px] lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              We replace "guess-work engineering" with "governed framing." By unifying market validation, user-centered design, technical architecture, and commercial planning, we ensure your product is built on a foundation of clarity rather than a mountain of assumptions.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[60%] xl:w-[65%] relative flex justify-center lg:justify-end">
          <div className="hidden lg:block relative lg:w-[550px] lg:h-[330px] xl:w-[750px] xl:h-[450px]">
            <div className="absolute top-0 left-[50%] lg:left-0 -translate-x-1/2 lg:-translate-x-0 w-[1000px] h-[600px] lg:origin-top-left flex items-center justify-center lg:scale-[0.55] xl:scale-[0.75]">
              <svg className="absolute w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600">
                <defs>
                  <linearGradient id="disc-blue-grad-dfw" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" />
                    <stop offset="100%" stopColor="#4ab6d4" />
                  </linearGradient>
                </defs>
                <circle cx="300" cy="40" r="7" fill="url(#disc-blue-grad-dfw)" />
                <path d="M 300 40 L 300 85 L 195 190" fill="none" stroke="url(#disc-blue-grad-dfw)" strokeWidth="3" />
                <circle cx="40" cy="300" r="7" fill="url(#disc-blue-grad-dfw)" />
                <path d="M 40 300 L 85 300 L 190 405" fill="none" stroke="url(#disc-blue-grad-dfw)" strokeWidth="3" />
                <circle cx="300" cy="560" r="7" fill="url(#disc-blue-grad-dfw)" />
                <path d="M 300 560 L 300 515 L 405 410" fill="none" stroke="url(#disc-blue-grad-dfw)" strokeWidth="3" />
                <circle cx="560" cy="300" r="7" fill="url(#disc-blue-grad-dfw)" />
                <path d="M 560 300 L 515 300 L 410 195" fill="none" stroke="url(#disc-blue-grad-dfw)" strokeWidth="3" />
              </svg>

              {/* 3D DIAMOND */}
              <div className="relative z-10 w-[300px] h-[300px]" style={{ perspective: '900px', perspectiveOrigin: '50% 40%' }}>
                <div className="w-full h-full rounded-[20px] p-[3px] shadow-2xl" style={{ transform: 'rotate(45deg) rotateX(12deg)', transformStyle: 'preserve-3d' }}>
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[3px] rounded-[18px] overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-800" style={{ transform: 'translateZ(6px)' }}>
                      <div className="-rotate-45 text-center text-white font-bold text-[15px]">Market & Business<br />Analysis</div>
                    </div>
                    <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 to-blue-600" style={{ transform: 'translateZ(4px)' }}>
                      <div className="-rotate-45 text-center text-white font-bold text-[15px]">User & UX<br />Framing</div>
                    </div>
                    <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-slate-900" style={{ transform: 'translateZ(2px)' }}>
                      <div className="-rotate-45 text-center text-white font-bold text-[15px]">Technical &<br />Architecture</div>
                    </div>
                    <div className="relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-cyan-500 to-cyan-700" style={{ transform: 'translateZ(3px)' }}>
                      <div className="-rotate-45 text-center text-white font-bold text-[15px]">Delivery &<br />Roadmap</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile CoE Cards */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {[
              { title: 'Market & Business', items: ['Growth mapping', 'Benchmarking'], gradient: 'from-blue-600 to-blue-800' },
              { title: 'User & UX Framing', items: ['Persona mapping', 'Wireframing'], gradient: 'from-blue-400 to-blue-600' },
              { title: 'Technical Design', items: ['Architecture', 'Stack definition'], gradient: 'from-blue-900 to-slate-900' },
              { title: 'Delivery Roadmap', items: ['MVP planning', 'Estimation'], gradient: 'from-cyan-500 to-cyan-700' },
            ].map((q, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                <div className={`bg-gradient-to-r ${q.gradient} p-4 text-white font-bold text-sm`}>{q.title}</div>
                <div className="p-4">
                  <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    {q.items.map((i, k) => <li key={k}>• {i}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DIFFERENTIATORS */}
      <div className="max-w-5xl mx-auto">
        <div className="space-y-4">
          {[
            { num: 1, title: 'Execution-Led Advisory', text: "We don't deliver \"shelf-ware.\" Our discovery outputs are designed to be handed straight to an engineering team for a build-ready start." },
            { num: 2, title: 'Technical Feasibility First', text: 'We validate assumptions against engineering reality during the workshop, ensuring the MVP concept is actually buildable within scope.' },
            { num: 3, title: 'User Psyche Focus', text: 'We go beyond "UI" to frame the psychological needs of your target persona, ensuring the product solves real user pain points.' },
            { num: 4, title: 'Scalable Architecture Blueprint', text: 'Even for lean MVPs, we define a technical path that allows room for enterprise-scale growth and future platform extensions.' },
            { num: 5, title: 'Unified Commercial Clarity', text: 'We replace vague quotes with structured, phased roadmaps that give stakeholders full visibility into delivery, effort, and ROI.' },
          ].map((d) => (
            <div key={d.num} className="diff-item group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-l-2xl"></div>
              <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 group-hover:bg-brand-blue transition-colors">{d.num}</div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-brand-blue transition-colors">{d.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{d.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const discoverFrameExecutionEcosystemSection = (
  <section className="py-24 bg-gray-50 dark:bg-black overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight leading-tight">
            Related Execution <br /><span className="text-transparent bg-clip-text bg-brand-gradient italic">Expertise.</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl">
            Turn your workshop roadmap into code. Kangqore provides the end-to-end engineering muscle to bring your framed product to market.
          </p>
          <div className="space-y-4">
            {[
              { name: 'MVP Acceleration', link: '/services/foundry/mvp-acceleration', icon: <Rocket className="w-5 h-5" />, desc: 'Rapid, high-fidelity engineering for net-new products.' },
              { name: 'Product Digital Engineering', link: '/services/foundry/product-digital-engineering', icon: <Cpu className="w-5 h-5" />, desc: 'Enterprise-grade platform development at scale.' },
              { name: 'Modernization Infrastructure', link: '/services/platforms/modernization-infrastructure', icon: <Server className="w-5 h-5" />, desc: 'Modernize legacy debt into a scalable digital core.' },
            ].map((e, idx) => (
              <a key={idx} href={e.link} className="group flex items-start gap-5 p-6 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-3xl hover:border-blue-300 transition-all shadow-sm">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">{e.icon}</div>
                <div>
                  <span className="font-bold text-lg block mb-1 group-hover:text-brand-blue transition-colors">{e.name}</span>
                  <p className="text-gray-500 text-sm">{e.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="relative aspect-square w-full max-w-[550px] mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/10 blur-[100px] rounded-full"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
              <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="absolute inset-6 border border-brand-blue/30 rounded-3xl border-dashed"></div>
              <div className="relative">
                <LayoutTemplate className="w-20 h-20 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
              </div>

              <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 shadow-2xl border border-white/10">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                  <Rocket className="w-12 h-12 text-brand-blue" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">MVP_Accelerate</span>
              </div>
            </div>

            <div className="absolute bottom-10 left-0 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 bg-slate-900 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                  <Cpu className="w-12 h-12 text-cyan-400" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Digi_Eng</span>
              </div>
            </div>

            <div className="absolute bottom-10 right-0 group">
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 bg-gradient-to-br from-brand-blue to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center relative -translate-x-4 hover:translate-x-0 transition-transform duration-300">
                  <Radar className="w-12 h-12 text-white" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest font-mono uppercase -translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Modernize</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const discoverFrameWorkshops = {
  titleLine1: 'Discover & Frame',
  titleHighlight: 'Workshops.',
  videoBackground: '/videos/business-meeting-6774639.mp4',
  description: 'Kangqore’s Discover & Frame Workshops help organizations define, validate, and structure product ideas before development begins. We align business goals, user needs, product priorities, technical direction, and execution planning—so teams move forward with clarity, speed, and confidence.',
  image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80',

  primaryButton: { text: 'Talk To Our Experts', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  stats: [
    { value: 'Clarify', label: 'Product vision & business intent', color: 'text-blue-500' },
    { value: 'Validate', label: 'Scope, feasibility & priorities', color: 'text-emerald-500' },
    { value: 'Design', label: 'MVP, workflows & user journeys', color: 'text-purple-500' },
    { value: 'Plan', label: 'Architecture, timeline & roadmap', color: 'text-brand-blue' },
  ],

  ctaTitle: 'Ready to turn your idea into a build-ready roadmap?',
  ctaDescription: 'Schedule a Kangqore Discover & Frame Workshop to validate your concept, define the right MVP, align stakeholders, and move into execution with greater confidence.',
  ctaSecondaryButton: { text: 'Explore Capabilities', link: '/contact' },

  highFidelity: {
    narrative: {
      badge: 'WHY DISCOVER & FRAME',
      titleLine1: 'Without structured discovery, product ideas become',
      titleHighlight: 'expensive assumptions.',
      titleLine2: '',
      description: 'Too many software initiatives begin with enthusiasm but little alignment. Business goals remain broad, scope keeps shifting, user needs stay partially understood, and technical direction is defined too late. Kangqore’s Discover & Frame Workshops bring structure to early-stage uncertainty—so you can validate the opportunity, prioritize what matters, and build on a stronger foundation.',
      bottleneckLabel: 'The Overload',
      bottleneckText: '70% of product waste stems from poorly defined requirements or weak discovery alignment.*',
      requirementLabel: 'The Advantage',
      requirementText: '3x faster time-to-market for products that undergo disciplined discovery before full-scale build.*',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80',
      statusLabel: 'Discovery State',
      statusValue: 'VALIDATING',
    },
    philosophy: {
      icon: <Compass className="w-7 h-7 text-brand-blue" />,
      title: 'Our Discover & Frame',
      titleHighlight: 'Delivery Model.',
      description: 'At Kangqore, discovery is not a loose brainstorming exercise. It is a structured advisory process designed to reduce uncertainty, sharpen priorities, and prepare teams for confident execution.',
      pills: ['Discover', 'Analyze', 'Frame', 'Visualize', 'Architect', 'Plan'],
    },
    matrix: {
      engineId: 'Engine :: DISC_FRM_V1',
      title: '6-Phase Workshop Lifecycle',
      subtext: 'A structured blueprint to turn abstract ideas into an engineered reality.',
      layers: [
        { title: 'Discover', id: 'PH_01', icon: <Search />, desc: 'Understand the product vision, business goals, users, market context, and opportunity.' },
        { title: 'Analyze', id: 'PH_02', icon: <BarChart3 />, desc: 'Evaluate requirements, assumptions, differentiation opportunities, and feasibility.' },
        { title: 'Frame', id: 'PH_03', icon: <LayoutTemplate />, desc: 'Define workflows, MVP scope, solution direction, and user interaction logic.' },
        { title: 'Visualize', id: 'PH_04', icon: <MonitorSmartphone />, desc: 'Create sketches and wireframes to make the concept tangible and testable.' },
        { title: 'Architect', id: 'PH_05', icon: <Server />, desc: 'Recommend technical direction, integrations, and architecture-level design thinking.' },
        { title: 'Plan', id: 'PH_06', icon: <CalendarDays />, desc: 'Translate discovery into commercials, milestones, timelines, and a development roadmap.' },
      ],
    },
    schematic: {
      titleLine1: 'Engineering Excellence. ',
      titleHighlight: 'Absolute Accountability.',
    },
  },

  capabilitiesTitle: 'Our Capabilities.',
  capabilitiesDescription: 'Our structured advisory process is built to convert early-stage product uncertainty into strategic clarity. We unify business analysis, UX framing, and technical planning before capital is committed.',
  capabilities: [
    {
      title: 'Concept Analysis & Product Discovery',
      description: 'Understand the product idea in the context of business goals, market opportunity, and long-term value creation.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Product vision and business-context discovery',
        'USP, opportunity, and gap identification',
        'Market-fit and feasibility thinking',
        'Strategic alignment with growth intent',
      ],
    },
    {
      title: 'Requirement Analysis & Functional Framing',
      description: 'Translate ideas into clearer product behavior, feature scope, and use-case expectations.',
      bgImage: '/images/capabilities/ux-design.png',
      items: [
        'Feature and workflow requirement analysis',
        'User stories, assumptions, and notifications framing',
        'Competitor and adjacent-solution review',
        'Functional scope definition',
      ],
    },
    {
      title: 'Solution Framing & MVP Design',
      description: 'Define what the product must do first—and what can wait.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Core feature prioritization',
        'MVP scope definition',
        'User-need and pain-point alignment',
        'Business workflow and product flow mapping',
      ],
    },
    {
      title: 'Wireframing & UX Direction',
      description: 'Bring early-stage ideas to life through a user-centered visual foundation.',
      bgImage: '/images/capabilities/ux-design.png',
      items: [
        'Sketches and low-fidelity concept framing',
        'Clickable wireframes and interaction preview',
        'UX flow validation and usability direction',
        'Design principles aligned to product intent',
      ],
    },
    {
      title: 'Technical Architecture Planning',
      description: 'Shape a practical technical direction that supports delivery, scalability, and future growth.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Recommended technology stack direction',
        'Frontend, backend, data, and cloud planning',
        'Third-party integrations and ecosystem mapping',
        'High-level architecture and data-flow design',
      ],
    },
    {
      title: 'Techno-Commercial Planning',
      description: 'Turn discovery into a practical execution and commercial plan.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Delivery scope alignment',
        'Resource and effort estimation',
        'Timeline and milestone planning',
        'Commercial framing and phased roadmap',
      ],
    },
  ],

  trustStripText: 'Helping enterprises, startups, and innovation teams define product direction, reduce ambiguity, and move from idea to execution with greater confidence.',

  trustPillars: [
    { title: 'Strategic clarity before development begins', tag: 'Alignment', description: 'Bring business intent, product direction, user needs, and execution expectations into one aligned discovery process.' },
    { title: 'Better concept validation and lower delivery risk', tag: 'Validation', description: 'Test assumptions early through structured requirement analysis, market understanding, and feasibility framing.' },
    { title: 'Sharper MVP definition', tag: 'Focus', description: 'Identify the essential features needed for launch so your first version is focused, usable, and commercially meaningful.' },
    { title: 'Faster path to execution', tag: 'Velocity', description: 'Reduce ambiguity in planning by defining workflows, wireframes, architecture direction, and implementation scope upfront.' },
    { title: 'More confident stakeholder alignment', tag: 'Clarity', description: 'Give founders, business teams, product owners, and delivery teams a common blueprint for decisions and execution.' },
    { title: 'A roadmap you can actually build from', tag: 'Execution', description: 'Walk away with a structured development direction covering user journeys, feature scope, technical thinking, commercials, and milestones.' },
  ],

  whyKangqore: [
    { title: 'Strategy Before Build', description: 'We align product thinking with business goals, market opportunity, and user realities before delivery begins.', icon: BrainCircuit },
    { title: 'Built for Clarity', description: 'Our workshops reduce ambiguity across scope, priorities, workflows, and feasibility—making next steps easier to act on.', icon: Search },
    { title: 'Execution-Ready Output', description: 'We deliver structured outputs that are useful for design, delivery, stakeholder buy-in, budgeting, and roadmap planning.', icon: Rocket },
  ],

  industriesTitle: 'Where Discover & Frame Adds Most Value',
  industriesDescription: 'Discovery is crucial whether you are building a Net-New disruptive platform or modernizing a legacy core.',
  industries: [
    { name: 'Startup Product Validation', description: 'Validate new product ideas before committing to full-scale build investment.' },
    { name: 'Enterprise Innovation Initiatives', description: 'Bring structure to internal product, platform, or digital innovation concepts.' },
    { name: 'Legacy Reimagination', description: 'Reframe outdated systems into modern product opportunities with clearer execution direction.' },
    { name: 'New Venture & MVP Planning', description: 'Define the leanest launchable version of a product while preserving long-term scalability.' },
    { name: 'Platform Extensions & New Modules', description: 'Assess what should be added, how it should work, and where it fits within the larger product strategy.' },
    { name: 'Complex Stakeholder Alignment', description: 'Create one common view across founders, business teams, product owners, design, and engineering.' },
  ],

  technologiesTitle: 'Tools & Technologies We Use Across Discovery.',
  technologiesDescription: 'Our workshops remain business-led and technology-aware. We use modern product, UX, architecture, and planning frameworks to move from ambiguity to a structured roadmap.',
  technologies: [
    { category: 'Product & Discovery', items: ['Miro', 'FigJam', 'Notion', 'Jira Product Discovery'] },
    { category: 'UX & Wireframing', items: ['Figma', 'Whimsical', 'Adobe XD', 'Clickable Prototyping Tools'] },
    { category: 'Architecture & Planning', items: ['Draw.io', 'Lucidchart', 'Architecture Frameworks', 'Roadmapping Templates'] },
    { category: 'Delivery Readiness', items: ['Jira / Confluence', 'Azure DevOps', 'Sprint Planning Systems', 'Estimation Models'] },
  ],

  customFAQs: [
    { question: 'What is a Discover & Frame Workshop?', answer: 'It is a structured, collaborative discovery engagement that helps define product vision, user needs, requirements, MVP scope, UX direction, technical thinking, and execution planning before development starts.' },
    { question: 'Why should I invest in a discovery workshop before development?', answer: 'Because it reduces ambiguity, improves prioritization, validates assumptions earlier, and helps avoid expensive rework later in the lifecycle.' },
    { question: 'What deliverables do we receive at the end of the workshop?', answer: 'Typical outputs include personas, prioritized feature scope, MVP definition, wireframes, architecture direction, and a roadmap covering timelines and commercials.' },
    { question: 'Is this useful only for startups?', answer: 'No. It is equally valuable for enterprises exploring innovation initiatives, platform extensions, modernization paths, or new digital products.' },
    { question: 'Can Kangqore take the product forward after the workshop?', answer: 'Yes. The workshop can seamlessly flow into UX design, architecture, MVP engineering, platform development, modernization, or managed delivery.' },
    { question: 'How long does a Discover & Frame Workshop usually take?', answer: 'The duration depends on product complexity, stakeholder availability, and scope depth, but the goal is always to arrive at clarity faster than a conventional start-to-build process.' },
  ],

  postCapabilitiesSections: (
    <>
      {discoverFrameDeliverablesStepper}
      {discoverFrameDiscoveryCoESection}
    </>
  ),
  postFAQSections: discoverFrameExecutionEcosystemSection,
};

// ─── technology-transformation (Reimagine — assembled from 3 legacy files) ──
// Parent shape from TechnologyTransformation.jsx; 2 pillars (Technology-Led
// Growth Strategy + Tech Value & Cost Optimization) decomposed and injected
// via postCapabilitiesSections.

// Pillar 1: Technology-Led Growth Strategy — decomposed.
// Extracted: split-hero with stats card (state-driven expand/collapse
// replaced with a static both-states-visible layout), "What you can do"
// accordion (interactive expand replaced with a static expanded list), and
// "Measurable Achievement" stats grid.
// Dropped: page back-link (Link/router chrome), 3-slide auto-rotating
// carousel ("How growth drivers are changing" — requires useState/useEffect
// timer that cannot live in a data-export module), page-level standalone CTA.
const technologyTransformationPillar1 = (
  <section className="py-24 bg-[#FEFFFC] overflow-hidden relative border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-full text-xs font-bold mb-6 tracking-widest uppercase shadow-sm">
        Pillar 01 :: Technology-Led Growth Strategy
      </div>

      {/* Split Hero */}
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <img src="/assets/images/services/growth-strategy-hero.png" alt="Growth Ledger" className="w-full h-auto rounded-2xl relative z-10 shadow-2xl" />
        </div>
        <div>
          <h3 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.9] font-display">
            Engineer Growth. <br />
            <span className="text-transparent bg-clip-text bg-brand-gradient italic">Not Just Systems.</span>
          </h3>
          <p className="text-xl text-slate-600 dark:text-gray-400 mb-10 leading-relaxed font-light font-display">
            Technology must lead business strategy — not follow it. Kangqore helps enterprises shift from cost-centric IT models to platform-driven growth ecosystems.
          </p>
        </div>
      </div>

      {/* Context + Stats Card (static both-views) */}
      <div className="mt-24 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7">
          <p className="text-xl lg:text-2xl text-slate-500 leading-relaxed font-light">
            As companies invest in emerging tech to drive reinvention, rapid adoption is leading to a surge in <span className="text-slate-900 dark:text-white font-semibold">technical debt.</span> Technology defines growth velocity. We help enterprises shift from maintenance-centric IT models to <span className="text-brand-blue font-semibold">innovation-driven ecosystems</span> — powered by data, AI, and composable architectures.
          </p>
        </div>
        <div className="lg:col-span-1"></div>
        <div className="lg:col-span-4 self-end">
          <div className="bg-brand-gradient border border-brand-blue/20 p-10 rounded-2xl relative overflow-hidden group shadow-xl shadow-blue-900/10">
            <div className="text-[10px] font-mono text-white/80 uppercase tracking-[0.3em] font-bold mb-6">Strategy Data</div>
            <div className="text-6xl font-bold text-white mb-4 tracking-tighter">41%</div>
            <p className="text-sm text-white/90 leading-relaxed uppercase tracking-wider font-bold">
              of executives rate AI as the top contributor to technical debt.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8 mt-12 border-t border-white/20">
              <div>
                <div className="text-4xl font-bold text-white mb-2 tracking-tighter">97%</div>
                <p className="text-[10px] text-white/70 uppercase tracking-[0.2em] leading-relaxed font-bold">
                  agree technology plays a critical role in reinvention.
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2 tracking-tighter">7%</div>
                <p className="text-[10px] text-white/70 uppercase tracking-[0.2em] leading-relaxed font-bold">
                  more budget spent on technical debt remediation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You Can Do (static expanded list — accordion interaction dropped) */}
      <div className="mt-32">
        <h3 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-20 tracking-tighter font-display">
          What <span className="text-transparent bg-clip-text bg-brand-gradient">you can do</span>
        </h3>

        <div className="space-y-0 border-t border-brand-blue/20">
          {[
            { title: 'Design digital platforms that unlock ecosystem value, not isolated applications.', detail: 'Shift from monolithic architectures to composable, API-first platforms that simplify integration with partners and customers, creating new revenue channels.' },
            { title: 'Shift from project-based IT to product-based innovation cycles.', detail: 'Implement durable product teams that own the entire lifecycle of a capability, ensuring continuous improvement and direct alignment with business KPIs.' },
            { title: 'Turn enterprise data into strategic intelligence for market leadership.', detail: 'Architecture your data landscape to move beyond reporting into predictive analytics and real-time decisioning, powered by a unified digital core.' },
            { title: 'Allocate capital toward scalable digital capabilities, not legacy maintenance.', detail: 'Systematically retire technical debt and legacy silos to redirect budget toward high-impact innovation projects like GenAI and autonomous systems.' },
          ].map((item, i) => (
            <div key={i} className="py-10 border-b border-brand-blue/20 px-8 rounded-xl">
              <div className="flex items-center justify-between gap-12 mb-4">
                <h4 className="text-xl lg:text-2xl font-bold text-brand-blue pr-12 font-display">
                  {item.title}
                </h4>
              </div>
              <p className="text-slate-600 dark:text-gray-400 text-lg leading-relaxed font-light lg:pr-32">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Measurable Achievement Stats */}
      <div className="mt-24">
        <div className="text-center mb-4">
          <div className="font-mono text-[10px] text-brand-blue mb-4 tracking-[0.4em] uppercase font-bold">Projected Performance</div>
          <h3 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter leading-[0.95] font-display mb-12">
            Measurable <span className="text-transparent bg-clip-text bg-brand-gradient italic">Achievement.</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '40%', label: 'Launch Cycles', sub: 'Faster cycles' },
            { value: '75%', label: 'Debt Redux', sub: 'Technical clarity' },
            { value: '2.5X', label: 'Revenue Growth', sub: 'Digital streams' },
            { value: '3X', label: 'AI Acceleration', sub: 'Decision speed' },
          ].map((stat, i) => (
            <div key={i} className="text-center group p-8 rounded-3xl bg-[#FEFFFC] border border-slate-100 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
              <div className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2 group-hover:scale-110 group-hover:text-brand-blue transition-all tracking-tighter duration-500">
                {stat.value}
              </div>
              <div className="font-bold text-brand-blue text-[10px] uppercase tracking-[0.3em] mb-1">{stat.label}</div>
              <div className="text-[10px] text-slate-400 font-mono italic">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Pillar 2: Tech Value & Cost Optimization — decomposed.
// Extracted: dark hero panel with capital-efficiency stats card, "Silent
// Erosion" two-column with cost distortion factors + 2x2 capability cards,
// "Business Impact Delivered" 3-card grid.
// Dropped: page back-link (Link/router chrome), page-level standalone CTA.
const technologyTransformationPillar2 = (
  <section className="bg-white dark:bg-black border-t border-gray-100">
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm mt-12 ml-4 sm:ml-6 lg:ml-8">
      Pillar 02 :: Tech Value & Cost Optimization
    </div>

    {/* Hero Panel (Dark) */}
    <section className="py-24 bg-slate-900 relative overflow-hidden mt-8">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between text-white mb-4">
                  <span className="text-sm font-mono text-emerald-400 uppercase tracking-widest">Capital Efficiency</span>
                  <span className="text-2xl font-bold">+35%</span>
                </div>
                <div className="h-2 w-full bg-white dark:bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full w-[75%] bg-brand-gradient"></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { label: 'Run', val: '-25%', color: 'text-blue-400' },
                    { label: 'Cloud', val: '-40%', color: 'text-emerald-400' },
                    { label: 'Value', val: '2.5X', color: 'text-purple-400' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 dark:border-gray-800/5 p-4 rounded-xl border border-white/5">
                      <div className={`text-xl font-bold ${s.color}`}>{s.val}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-tighter">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h3 className="text-4xl lg:text-6xl font-bold text-white mb-8 tracking-tighter leading-[0.9] font-display">
              Turn Spend Into <br />
              <span className="text-transparent bg-clip-text bg-brand-gradient italic">Competitive Advantage.</span>
            </h3>
            <p className="text-xl text-blue-100/80 mb-10 leading-relaxed font-light">
              Technology investment should accelerate growth — not accumulate silent debt. Kangqore transforms opaque IT costs into measurable business value.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Silent Erosion */}
    <section className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight font-display">
              The Silent Erosion: <br />
              <span className="text-brand-blue">Unchecked Technical Debt.</span>
            </h3>
            <p className="text-xl text-slate-600 dark:text-gray-400 mb-8 leading-relaxed font-light">
              As organizations rapidly adopt AI and cloud, technical debt is growing at an unprecedented rate. 41% of executives identify AI as the leading contributor to technical debt.
            </p>
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl">
              <div className="flex items-start gap-4">
                <PieChart className="w-12 h-12 text-brand-blue flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Cost Distortion Factors</h4>
                  <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {['Redundant tools', 'Overprovisioned cloud', 'Shadow IT expansion', 'Run-cost inflation'].map((t, i) => (
                      <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-brand-blue rounded-full"></div> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Portfolio Rationalization', desc: 'Identify and eliminate redundant systems and low-return contracts.', icon: Target },
              { title: 'Cloud FinOps', desc: 'Real-time visibility and optimization of cloud infrastructure spend.', icon: Activity },
              { title: 'Debt Reduction', desc: 'Systematic mapping and retirement of high-friction technical debt.', icon: ShieldCheck },
              { title: 'Value Governance', desc: 'Linking every technology dollar to a measurable enterprise outcome.', icon: BarChart3 },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white dark:bg-gray-900 dark:border-gray-800 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <item.icon className="w-8 h-8 text-brand-blue mb-4" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Business Impact Delivered */}
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Business Impact Delivered</h3>
          <p className="text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">Optimization is about more than just cutting costs — it's about shifting capital toward innovation.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Improved Financial Governance', desc: 'Clear visibility into IT spend and value contribution across the enterprise.', icon: CheckCircle2 },
            { title: 'Reduced IT Run Costs', desc: 'Efficiency gains through automation and vendor rationalization.', icon: CheckCircle2 },
            { title: 'Increased Reinvestment Capacity', desc: 'Freed capital redirected into AI and competitive differentiation.', icon: CheckCircle2 },
          ].map((card, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-10 rounded-[2rem] border border-slate-200">
              <card.icon className="w-10 h-10 text-emerald-500 mb-6" />
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{card.title}</h4>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-light">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </section>
);

// Parent "Why Transformation Can't Wait" panel (was parent's postCapabilitiesSections)
const technologyTransformationWhyWaitSection = (
  <section className="py-24 bg-white dark:bg-black dark:border-gray-800 overflow-hidden relative border-y border-gray-100">
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/5 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-full text-xs font-bold mb-6 tracking-widest uppercase shadow-sm">
          <AlertTriangle className="w-4 h-4" /> Why Transformation Can't Wait
        </div>
        <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
          The Market Won't <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-blue-400">Wait For You</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
          Global markets are shifting faster than traditional organizations can adapt. Kangqore positions you in the prepared category.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { value: '200%', label: 'Increase in systemic volatility', desc: 'Global markets are shifting faster than traditional organizations can adapt.' },
          { value: '97%', label: 'Leaders depend on tech for reinvention', desc: 'Technology is no longer a support function — it defines competitiveness.' },
          { value: '21%', label: 'Truly integrate tech into strategy', desc: 'Most companies experiment. Few architect.' },
          { value: '38%', label: 'CXOs fear AI-led disruption', desc: 'Disruption favors prepared systems, not reactive ones.' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-50 border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:border-brand-blue/20 transition-all duration-500 group text-center">
            <div className="text-4xl lg:text-5xl font-bold text-brand-blue mb-3 group-hover:scale-110 transition-transform duration-500 tracking-tighter">
              {stat.value}
            </div>
            <div className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-widest mb-3">{stat.label}</div>
            <p className="text-gray-500 text-sm leading-relaxed">{stat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Parent's bespoke "We Don't Sell Workshops" + "Proof, Not Promises" — kept
// as the entry's `customSections` (parent originally injected via
// postIndustrySections, but locked decision #4 says lift verbatim into
// customSections).
const technologyTransformationCustomSections = (
  <>
    <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
            We Don't Sell <span className="text-transparent bg-clip-text bg-brand-gradient italic">Workshops.</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            We engineer transformation systems that deliver compounding enterprise value.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Brain, title: 'AI-Native Architectures', desc: 'Systems designed from the ground up with AI at the core, not bolted on as an afterthought.' },
            { icon: Target, title: 'Outcome-Linked Modernization', desc: 'Every transformation initiative is tied to measurable business KPIs and value realization.' },
            { icon: Rocket, title: 'Execution-Led Transformation', desc: "We don't just advise — we architect and build scalable systems alongside your teams." },
            { icon: TrendingUp, title: 'Measurable ROI Systems', desc: 'KPI-driven governance with continuous tracking, milestone management, and capital optimization.' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:border-brand-blue/20 transition-all duration-500 group">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-gradient transition-all duration-300">
                <item.icon className="w-7 h-7 text-brand-blue group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Transformation Impact Snapshot */}
    <section className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-gray-100 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-xl shadow-gray-100/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none"></div>

          <div className="relative z-10 text-center">
            <div className="font-mono text-[10px] text-brand-blue mb-4 tracking-[0.4em] uppercase font-bold">Transformation Impact</div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-[0.95] font-display mb-12">
              Proof, Not <span className="text-transparent bg-clip-text bg-brand-gradient italic">Promises.</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '35%', label: 'Infrastructure Cost Reduction', sub: 'Optimized spend' },
                { value: '40%', label: 'Deployment Velocity', sub: 'Faster releases' },
                { value: '2.5x', label: 'Release Cycle Improvement', sub: 'Product acceleration' },
                { value: '100%', label: 'AI-Led Automation', sub: 'Core workflows' },
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

const technologyTransformation = {
  // Note: original parent used a JSX fullDescription; we lift the strapline
  // as `description` (the schema's punchy hero string) and let it render.
  titleLine1: 'Technology',
  titleHighlight: 'Transformation.',
  description:
    'Markets are unstable. Technology cycles are compressing. AI is redefining competitive baselines. Kangqore transforms enterprises by rebuilding strategy, architecture, and operating models around scalable, AI-native systems.',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',

  primaryButton: { text: 'Start Transformation Assessment', link: '/contact' },
  secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },

  stats: [
    { value: '200%', label: 'Systemic Volatility', color: 'text-cyan-400' },
    { value: '97%', label: 'Leaders on Tech', color: 'text-blue-400' },
    { value: '21%', label: 'True Integration', color: 'text-emerald-400' },
    { value: '38%', label: 'CXO Disruption Fear', color: 'text-purple-400' },
  ],

  ctaTitle: "Transform. Don't Just Upgrade.",
  ctaDescription: "Let's engineer your next technology chapter together. Strategy, architecture, and execution — aligned for measurable advantage.",
  ctaButtonText: 'Start Transformation Assessment',

  highFidelity: {
    narrative: {
      badge: 'GROWTH ENGINEERING :: 2026',
      titleLine1: 'Growth Engineering',
      titleHighlight: 'Through Technology.',
      titleLine2: 'At Enterprise Scale.',
      description: "Kangqore transforms enterprises by rebuilding strategy, architecture, and operating models around scalable, AI-native systems. We don't sell workshops — we engineer transformation.",
      bottleneckLabel: 'The Impediment',
      bottleneckText: 'Static planning, fragmented delivery, and misaligned technology strategy limiting enterprise impact.',
      requirementLabel: 'The Outcome',
      requirementText: 'Platform-driven growth ecosystems powered by data, AI, and composable architectures.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      statusLabel: 'Transformation Engine',
      statusValue: 'ACTIVE',
    },
    philosophy: {
      icon: <Rocket className="w-7 h-7 text-brand-blue" />,
      title: 'Our Approach is',
      titleHighlight: 'Growth Engineering.',
      description: 'Technology must lead business strategy — not follow it. We align business ambition with technical capability to create sustainable competitive advantage.',
      pills: ['Platform-Driven', 'AI-Native', 'Outcome-Linked', 'Governance-First'],
    },
    matrix: {
      engineId: 'Framework :: TRANSFORM_V3',
      title: 'Transformation Framework',
      subtext: 'Our structured methodology for rebuilding enterprise strategy, architecture, and operating models.',
      layers: [
        { title: 'Assess', id: 'TF_ASSESS', icon: <Search />, desc: 'Strategic assessment, technology audit, and competitive positioning analysis.' },
        { title: 'Strategize', id: 'TF_STRAT', icon: <Target />, desc: 'Platform-centric business model design and technology investment prioritization.' },
        { title: 'Architect', id: 'TF_ARCH', icon: <Layers />, desc: 'Cloud-native, AI-ready enterprise architecture and data modernization.' },
        { title: 'Execute', id: 'TF_EXEC', icon: <Zap />, desc: 'Agile execution, DevSecOps integration, and value stream alignment.' },
        { title: 'Govern', id: 'TF_GOV', icon: <ShieldCheck />, desc: 'KPI-driven governance, continuous ROI tracking, and capital allocation optimization.' },
      ],
    },
    schematic: {
      titleLine1: 'Transform.',
      titleHighlight: "Don't Just Upgrade.",
      description: 'Your transformation journey should fuel undisputed competitive advantage. We engineer the frameworks that make it measurable and sustained.',
      stats: [
        { label: 'Infra Cost', val: '35% LESS' },
        { label: 'Deploy Velocity', val: '40% FASTER' },
        { label: 'Release Cycles', val: '2.5X' },
      ],
    },
  },

  capabilities: [
    {
      title: 'Technology-Led Growth Strategy',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Rebuild business strategy with technology at the core. We help organizations shift from static planning to platform-driven growth models powered by data, AI, and scalable digital capabilities.',
      items: [
        'Platform-centric business models',
        'Digital product strategy',
        'Data-led competitive positioning',
        'Technology investment alignment',
      ],
    },
    {
      title: 'Tech Value & Cost Optimization',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Turn technology spend into measurable business value. We create transparency across IT investments, reduce technical debt, and shift capital from maintenance-heavy systems to innovation-led initiatives.',
      items: [
        'Spend visibility & cost intelligence',
        'Portfolio rationalization',
        'Technical debt reduction',
        'ROI-linked governance frameworks',
      ],
    },
    {
      title: 'Digital Core & Enterprise Architecture',
      bgImage: '/images/capabilities/software-engineering.png',
      description: 'Modern architecture is the foundation of speed, scale, and resilience. We design AI-ready, cloud-native enterprise architectures that support continuous innovation.',
      items: [
        'Cloud-native infrastructure design',
        'API-led ecosystems',
        'Data architecture modernization',
        'AI-ready system integration',
      ],
    },
    {
      title: 'Operating Model Reinvention',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Technology transformation fails without structural alignment. We redesign operating models to support agile execution, DevSecOps maturity, and data-driven decision systems.',
      items: [
        'Agile & product-based operating models',
        'DevSecOps transformation',
        'Cross-functional value stream alignment',
        'AI-enabled workflow redesign',
      ],
    },
    {
      title: 'Transformation Governance & Value Management',
      bgImage: '/images/capabilities/digital-transformation.png',
      description: 'Transformation must be measurable. We establish execution discipline through KPI-driven governance, milestone tracking, and value realization frameworks.',
      items: [
        'Enterprise transformation office setup',
        'Program & portfolio governance',
        'Continuous ROI tracking',
        'Capital allocation optimization',
      ],
    },
    {
      title: 'Cloud Strategy & Platform Modernization',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      description: "Cloud is not migration — it's reinvention. We design scalable, secure, and cost-efficient cloud architectures that enable performance and flexibility.",
      items: [
        'Multi-cloud architecture strategy',
        'Infrastructure automation',
        'FinOps & cost optimization',
        'Platform modernization',
      ],
    },
    {
      title: 'AI Strategy & Enterprise Embedding',
      bgImage: '/images/capabilities/ai-cognitive.png',
      description: 'Move beyond experimentation to operational AI. We embed AI across enterprise workflows, products, and decision systems to create sustainable competitive advantage.',
      items: [
        'Generative AI integration',
        'Intelligent automation',
        'AI governance frameworks',
        'Continuous improvement systems',
      ],
    },
  ],

  trustPillars: [
    { title: 'AI-Native Architecture Design', tag: 'Architecture', description: 'We design enterprise architectures with AI embedded at the core — not bolted on as an afterthought. Our systems are built for composability, scalability, and intelligent automation from day one, enabling organizations to leverage AI across every workflow and decision point.' },
    { title: 'Outcome-Linked Delivery', tag: 'Governance', description: "Every transformation initiative at Kangqore is tied to measurable business outcomes. We don't measure success by deliverables shipped — we measure it by KPIs moved, costs reduced, and revenue unlocked. Our governance frameworks ensure continuous value realization." },
    { title: 'Execution-Led Engineering', tag: 'Engineering', description: "We don't stop at strategy decks and advisory reports. Kangqore engineers build, deploy, and scale transformation systems alongside your teams. Our execution-first culture ensures that architectural vision translates into production-grade systems." },
    { title: 'Platform-Driven Growth', tag: 'Strategy', description: 'Organizations that treat technology as infrastructure struggle to scale. We help enterprises shift from cost-centric IT models to platform-driven growth ecosystems — powered by data, AI, and composable architectures that create sustainable competitive advantage.' },
  ],
  trustPillarsRightTitle: 'Empowering Enterprise Transformation With Engineered Capabilities',
  trustPillarsRightDescription: 'Kangqore combines deep engineering expertise with AI-native thinking to deliver transformation systems that create lasting competitive advantage. Our approach goes beyond advisory — we build, deploy, and scale.',
  trustPillarsRightButton: 'Request Consultation',

  whyKangqoreIntro: "We don't sell workshops. We engineer AI-native architectures, outcome-linked modernization, execution-led transformation, and measurable ROI systems. Kangqore is built for enterprises that demand results, not reports.",
  whyKangqore: [
    { title: 'Engineers-First Culture', icon: Terminal, description: 'Deep technical thinking is in our DNA. We solve complex architectural problems, not just tickets.' },
    { title: 'Architecture-First', icon: Layers, description: 'We never code without a robust, governed architectural foundation designed for your specific scale.' },
    { title: 'AI-Native Approach', icon: Cpu, description: 'We embed AI across enterprise workflows, products, and decision systems — not as a feature, but as a foundation.' },
    { title: 'Governance Baked-In', icon: ShieldCheck, description: 'Compliance, security, and observability are core requirements, not afterthoughts.' },
    { title: 'ROI Focus', icon: TrendingUp, description: 'Every transformation wave is measured against deployment velocity, cost, and quality metrics.' },
    { title: 'Strategic Partnerships', icon: Globe, description: 'Multi-cloud ecosystem partnerships, enterprise SaaS alliances, and AI & data ecosystem collaborators.' },
  ],

  industryTitle: 'Enterprise Transformation Across Industries',
  industryIntro: 'Kangqore brings deep domain knowledge to deliver technology transformation solutions tailored to industry-specific challenges and regulatory requirements.',
  industries: [
    { name: 'Banking & Financial Services', icon: Building2, description: 'Core banking modernization, real-time payment systems, and regulatory compliance automation.' },
    { name: 'Healthcare & Life Sciences', icon: Heart, description: 'Clinical data platforms, EHR modernization, and AI-powered diagnostic systems.' },
    { name: 'Retail & Consumer Goods', icon: ShoppingCart, description: 'Omnichannel platforms, supply chain intelligence, and personalized customer experiences.' },
    { name: 'Manufacturing', icon: Factory, description: 'Smart factory systems, IoT integration, and predictive maintenance platforms.' },
    { name: 'Media & Technology', icon: Film, description: 'Content delivery platforms, streaming infrastructure, and data monetization.' },
    { name: 'Travel & Hospitality', icon: Plane, description: 'Booking platform modernization, dynamic pricing engines, and guest experience systems.' },
  ],

  technologies: [
    { category: 'Cloud & Platforms', items: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform'] },
    { category: 'Frameworks & Languages', items: ['React', 'Node.js', 'Next.js', 'TypeScript', 'Python', 'Go', '.Net Core'] },
    { category: 'DevOps & Tooling', items: ['GitHub Actions', 'Jenkins', 'Ansible', 'Prometheus', 'Grafana', 'ArgoCD'] },
    { category: 'AI & Data', items: ['TensorFlow', 'PyTorch', 'OpenAI API', 'Hugging Face', 'MongoDB', 'PostgreSQL', 'Redis'] },
  ],

  customFAQs: [
    { question: "What makes Kangqore's approach to technology transformation different?", answer: "We don't advise from the sidelines. Kangqore engineers work alongside your teams to architect, build, and deploy transformation systems. Every initiative is tied to measurable business outcomes — not just deliverables. Our approach combines AI-native architecture design with execution-led engineering and KPI-driven governance." },
    { question: 'How long does a typical technology transformation engagement take?', answer: 'A strategic assessment typically takes 4-6 weeks. Full transformation programs are phased over 6-18 months depending on scope, with measurable ROI delivered within the first 90 days. We define clear milestones and track value realization continuously.' },
    { question: 'How do you handle the risk of large-scale transformation?', answer: 'Risk mitigation is built into our methodology. We use phased execution with controlled migration waves, parallel environments, and continuous monitoring. Our governance framework includes milestone tracking, value gates, and rollback protocols to ensure business continuity.' },
    { question: 'How does AI fit into your transformation approach?', answer: "AI is not a bolt-on feature — it's embedded into every layer of our framework. From AI-powered technical debt mapping to intelligent automation and generative AI integration, we help enterprises move beyond experimentation to operational AI that drives sustainable competitive advantage." },
    { question: 'What industries do you serve?', answer: "We serve enterprises across Banking, Healthcare, Retail, Manufacturing, Media & Technology, Travel & Hospitality, Energy, and more. Our industry-specific expertise ensures solutions are tailored to your sector's unique regulatory, operational, and competitive requirements." },
  ],

  // Parent's bespoke marketing JSX
  customSections: technologyTransformationCustomSections,

  // Combined: parent's original postCapabilitiesSections (Why Wait) plus the
  // 2 decomposed pillar sections injected per Phase G3 PR2 requirements.
  postCapabilitiesSections: (
    <>
      {technologyTransformationWhyWaitSection}
      {technologyTransformationPillar1}
      {technologyTransformationPillar2}
    </>
  ),
};

// ─── Registry export ───────────────────────────────────────────────────────────
// 5 services wired in G3 PR2 (Reimagine):
//   - blockchain (legacy slug `blockchain-engineering` normalized to canonical
//     `blockchain` per Phase G locked decision)
//   - technology-consulting (T3, 500+ lines inline JSX preserved)
//   - strategy-consulting (T3, 125+ lines inline JSX preserved)
//   - discover-frame-workshops (T3, 360+ lines inline JSX preserved)
//   - technology-transformation (parent + 2 decomposed pillars injected via
//     postCapabilitiesSections; 5 other TT detail subpages were placeholder
//     stubs and have been dropped)
export const REIMAGINE_SECTIONS = {
  'blockchain': blockchain,
  'technology-consulting': technologyConsulting,
  'strategy-consulting': strategyConsulting,
  'discover-frame-workshops': discoverFrameWorkshops,
  'technology-transformation': technologyTransformation,
};
