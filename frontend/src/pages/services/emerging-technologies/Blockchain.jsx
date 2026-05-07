import React, { useEffect } from 'react';
import { Binary, ShieldCheck, Activity, Server, Briefcase, Search, Layers, Network } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import { 
  BlockchainPhilosophyBackground,
  BlockchainWhySection,
  BlockchainValueDeliver,
  BlockchainDiamondCoESection,
  BlockchainDeliveryModel,
  BlockchainExecutionEcosystem,
  BlockchainFutureReadySection
} from './components/BlockchainCustomSections';

gsap.registerPlugin(ScrollTrigger);

const Blockchain = () => {
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

  const service = {
    name: 'Blockchain Engineering',
    titleLine1: 'Blockchain',
    titleHighlight: 'Engineering.',
    slug: 'blockchain-engineering',
    shortDescription: 'Build trusted, scalable blockchain systems beyond experimentation.',
    description: 'Kangqore helps enterprises design, engineer, and secure blockchain ecosystems that move beyond concept-stage exploration into production-ready business platforms. We combine architecture strategy, platform engineering, smart contracts, dApps, security, interoperability, and analytics to help organizations build distributed systems that are resilient, governable, and commercially useful.',
    image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoBackground: '/videos/engineering-rd-bg.mp4', 
    primaryButton: { text: 'Schedule A Blockchain Strategy Review', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Emerging Technologies', link: '/department/emerging-technologies' },
      { label: 'Blockchain Engineering' }
    ],
    
    stats: [
      { value: 'Trust', label: 'Distributed, verifiable digital records', color: 'text-cyan-400' },
      { value: 'Secure', label: 'Smart contracts, identities, and transactions', color: 'text-blue-400' },
      { value: 'Scale', label: 'Platform foundations built for production', color: 'text-brand-blue' },
      { value: 'Apply', label: 'Industry-led blockchain use cases', color: 'text-purple-400' },
    ],

    highFidelity: {
      narrative: {
        badge: "BLOCKCHAIN :: TRUST ARCHITECTURE",
        titleLine1: "Trust",
        titleHighlight: "Harder",
        titleLine2: "to Engineer.",
        description: "Modern commerce demands more than just ledgers. It requires boundary clarity, cryptographic foresight, delivery rigor, identity-first security, and the ability to adapt as distributed networks expand. At Kangqore, we engineer blockchain ecosystems as resilient business platforms.",
        bottleneckLabel: "The Credibility Gap",
        bottleneckText: "Blockchain becomes meaningful only when it is translated from theory into a dependable system of record. At its core, it enables trust without central validation—but only if performance, interoperability, and security are architected correctly.",
        requirementLabel: "The Kangqore Way",
        requirementText: "A unified engineering discipline that connects protocol strategy, smart-contract rigor, platform governance, and identity-first security into one cohesive, scalable ecosystem.",
        image: "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=format&fit=crop&w=1260&q=80",
        statusLabel: "System Integrity",
        statusValue: "100% IMMUTABLE"
      },
      philosophy: {
        icon: <Binary className="w-7 h-7 text-gray-900 dark:text-white" />,
        title: "Standardize with Clarity.",
        titleHighlight: "Scale with Purpose.",
        description: "We replace experimental pilots with architected, governed blockchain platforms designed for absolute business confidence.",
        bgElement: <BlockchainPhilosophyBackground />,
        pills: ['Protocol Strategy', 'Smart Contract Rigor', 'Identity-First', 'Ecosystem Interop'],
        features: [
          { title: 'Protocol Strategy', label: 'Platform Fit Assessment', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'Make the right protocol and infrastructure decisions before build complexity leads to fragility.' },
          { title: 'Registry Discipline', label: 'Identity Governance', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'Define identity boundaries and access models using zero-trust principles to secure every interaction.' },
          { title: 'Contract Rigor', label: 'Immutable Logic', icon: <ShieldCheck className="w-5 h-5 text-gray-400" />, content: 'Embed auditability and security into the core contract fabric, ensuring logic scales with absolute control.' },
          { title: 'Runtime Control', label: 'Proactive Visibility', icon: <Activity className="w-5 h-5 text-gray-400" />, content: 'Integrate real-time monitoring and analytics into the ledger fabric to ensure total visibility.' }
        ]
      },
      matrix: {
        engineId: 'ENGINE :: BLOCK_V2',
        title: 'Our Execution Matrix.',
        subtext: 'A connected system for moving from blockchain experimentation to governed, scalable architectures.',
        layers: [
          { title: 'Assess', id: 'BC_ASSESS', icon: <Search />, desc: 'Use-case validation, protocol fit, and ecosystem requirement deconstruction.' },
          { title: 'Architect', id: 'BC_ARCH', icon: <Layers />, desc: 'Ledger model, security policy, and interaction planning for resilient systems.' },
          { title: 'Engineer', id: 'BC_ENG', icon: <Server />, desc: 'Smart contract implementation with automated audits and policy-as-code execution.' },
          { title: 'Operate', id: 'BC_OPER', icon: <Activity />, desc: 'Trust-based observability, lifecycle control, and runtime governance.' }
        ]
      },
      schematic: {
        titleLine1: 'Governed Trust.',
        titleHighlight: 'Sustainable Scale.',
        description: 'Your blockchain ecosystem should be your most trusted asset. We engineer it to stay that way—across every transaction and integration milestone.',
        stats: [
          { label: 'Network Uptime', val: '99.9%' },
          { label: 'Smart Contract Audits', val: '100%' },
          { label: 'Data Integrity', val: 'ABSOLUTE' }
        ]
      }
    },

    trustStrip: "Helping enterprises design blockchain platforms, smart contracts, distributed applications, and security models that create trust, resilience, and real-world operational value.",
    
    whyKangqore: [
      { title: 'Architecture-Led by Default', description: 'We define the right protocol, platform, infrastructure, and governance decisions before the build path risks compound.', icon: Layers },
      { title: 'Security-Native Engineering', description: 'Identity, cryptography, privacy, and smart-contract risk are core design concerns, not late-stage controls.', icon: ShieldCheck },
      { title: 'Platform + Application Depth', description: 'From ledger infrastructure and smart contracts to dApps and middleware, we engineer the full stack.', icon: Server }
    ],

    useCases: [
      { name: 'Supply Chain', description: 'Improve trust, traceability, and monitoring across multi-party supply environments.', icon: Network },
      { name: 'Healthcare', description: 'Interoperable frameworks for electronic health records and patient data integrity.', icon: Activity },
      { name: 'Cybersecurity & Identity', description: 'Self-sovereign identity models and tamper-resistant user verification.', icon: ShieldCheck },
      { name: 'Telecom', description: 'Settlement, fraud reduction, and network-wide transaction trust.', icon: Server },
      { name: 'Insurance', description: 'Claims-related trust, SLA performance, and customer-facing transparency.', icon: Briefcase }
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

    customFAQs: [
      {
        question: 'What makes blockchain different from a traditional system of record?',
        answer: 'Blockchain introduces distributed trust, immutability, and mathematical verification, which reduces dependence on a central validating authority for record integrity.'
      },
      {
        question: 'Why do many blockchain projects struggle to scale?',
        answer: 'Because performance, consensus overhead, infrastructure design, interoperability, and ecosystem readiness are often underestimated early.'
      },
      {
        question: 'What should enterprises decide before building a blockchain solution?',
        answer: 'They should define the use case, trust model, platform fit, consensus approach, compliance implications, integration needs, and security architecture.'
      },
      {
        question: 'Are smart contracts enough on their own?',
        answer: 'No. Smart contracts matter, but the broader value comes from the surrounding platform, applications, integrations, monitoring, analytics, and security model.'
      },
      {
        question: 'How do you secure blockchain environments?',
        answer: 'Through a combination of secure access design, privacy controls, key management, identity architecture, application security, device security, and third-party security reviews.'
      },
      {
        question: 'Where does blockchain deliver the strongest business value today?',
        answer: 'Supply chain, healthcare, cybersecurity, telecom, and insurance are currently the most meaningful use-case areas for distributed trust.'
      }
    ]
  };

  const department = {
    name: 'Emerging Technologies',
    slug: 'emerging-technologies',
    description: 'Transform your business with cutting-edge emerging technologies solutions.',
    icon: <Binary className="w-6 h-6" />
  };

  const capabilities = [
    {
      title: 'Advisory, Design & Architecture',
      description: 'Make the right blockchain architecture decisions before protocol, platform, and governance complexity multiply. We help define consensus models, infrastructure strategy, and compliance frameworks to ensure long-term stability.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Use-case and platform fit assessment',
        'Consensus and protocol strategy',
        'Governance and compliance design',
        'High-performance architecture planning'
      ],
      micro: 'The right foundation for distributed trust.'
    },
    {
      title: 'Blockchain Platform Engineering',
      description: 'Engineer the underlying platform for security, speed, interoperability, and long-term reliability. We design infrastructure layers that support high-speed transactions, monitoring, and cloud-native resilience.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Blockchain infrastructure design',
        'High-speed networking architecture',
        'Cloud-based engineering patterns',
        'Monitoring and analytics support'
      ],
      micro: 'Scalable infrastructure for global ledgers.'
    },
    {
      title: 'Industry-Specific dApps Engineering',
      description: 'Build web and mobile distributed applications that turn blockchain capability into usable business experiences. We combine UX-led design with smart-contract interaction models and scalable microservices.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Workflow and UX-led dApp design',
        'Web and mobile application engineering',
        'Smart-contract-connected interfaces',
        'Microservices-led application patterns'
      ],
      micro: 'Turning tech into intuitive experiences.'
    },
    {
      title: 'Smart Contract Solutions Development',
      description: 'Create secure, automated contract logic that reduces friction and supports new business models. Our engineering rigor ensures contracts are audited, testable, and integrated seamlessly into business workflows.',
      bgImage: '/images/capabilities/software-engineering.png',
      items: [
        'Smart contract engineering (Solidity/Go)',
        'Contract testing and automation',
        'Lifecycle audit and analytics',
        'Process integration and workflows'
      ],
      micro: 'Programmable trust for modern commerce.'
    },
    {
      title: 'Blockchain Security Services',
      description: 'Protect blockchain environments across identity, privacy, application security, and distributed infrastructure risk. We treat security as a core design concern rather than an afterthought.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'Secure access and cryptography',
        'Privacy and key management patterns',
        'Self-sovereign identity architecture',
        'Third-party security reviews'
      ],
      micro: 'Zero-trust rigor for distributed systems.'
    },
    {
      title: 'Middleware, Eventing & Analytics',
      description: 'Create the service layer that connects dApps, contracts, policies, events, and intelligence across the blockchain stack. We enable real-time observability and anomaly detection.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Identity and policy service development',
        'Event streaming and consensus services',
        'Analytics for anomaly detection',
        'Self-healing support patterns'
      ],
      micro: 'Intelligence across the ledger fabric.'
    }
  ];

  const technologies = [
    { category: 'Platforms & Frameworks', items: ['Ethereum', 'Hyperledger Fabric', 'Cordna', 'Quorum', 'Polygon', 'Solana'] },
    { category: 'Contract Development', items: ['Solidity', 'Rust', 'Go', 'Vyper', 'Truffle', 'Hardhat'] },
    { category: 'dApp Engineering', items: ['React', 'Next.js', 'Ethers.js', 'Web3.js', 'Node.js', 'GraphQL'] },
    { category: 'Platform & Infrastructure', items: ['AWS Blockchain', 'Azure Workbench', 'Kubernetes', 'Infura', 'Alchemy'] },
    { category: 'Security & Identity', items: ['OpenZeppelin', 'Identity.com', 'WalletConnect', 'Metamask', 'Vault'] },
    { category: 'Analytics & Intelligence', items: ['Dune Analytics', 'Graph Protocol', 'Splunk for Blockchain', 'Chainlink'] }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilitiesTitle: 'Our Capabilities.',
      capabilitiesDescription: 'Kangqore’s blockchain engineering capabilities are designed to help enterprises move from conceptual interest to production-ready distributed systems.',
      capabilities,
      trustPillars: [
        { title: 'Protocol foresight before scaling', tag: 'Architecture', description: 'Design ledgers that prioritize performance and governance without creating bottlenecks.' },
        { title: 'Identity-first security protocols', tag: 'Security', description: 'Protect every interaction with hardened authentication and zero-trust rigor.' },
        { title: 'Interoperability-first design', tag: 'Integration', description: 'Ensure shared data layers connect seamlessly with legacy and modern ecosystems.' }
      ],
      whyKangqore: service.whyKangqore,
      industries: service.useCases,
      preMatrixSection: null, // Custom sections handle this
      customSections: service.customSections,
      postCapabilitiesSections: null, // Custom sections handle this
      postFAQSections: service.postFAQSections,
      customFAQs: service.customFAQs
    },
    department
  };

  return (
    <div className="blockchain-page-override">
      <style dangerouslySetInnerHTML={{__html: `
        .stat-counter-text { font-variant-numeric: tabular-nums; }
        .blockchain-page-override > div > section { position: relative; z-index: 5; background-color: inherit; }

      `}} />
      <ServicePageTemplate
        service={pageData.service}
        department={department}
      />
    </div>
  );
};

export default Blockchain;
