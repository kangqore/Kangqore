import React from 'react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Fingerprint, 
  Eye, 
  Zap, 
  Search, 
  Layers, 
  Activity, 
  Shield, 
  Globe, 
  ArrowRight, 
  ChevronRight, 
  Cpu, 
  ShieldCircle,
  Network
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ITSecurityServices = () => {
  // ============================================
  // SERVICE INFORMATION
  // ============================================
  
  const service = {
    name: 'Cybersecurity & IT Security Services',
    slug: 'it-security-services',
    shortDescription: 'SECURE. DEFEND. ENABLE.',
    fullDescription: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">IT Security Solutions</h2>
        <p>Cyber risk is accelerating. Cloud adoption, remote workforces, APIs, AI systems, and IoT have expanded the attack surface exponentially.</p>
        <p>Kangqore helps organizations transition from reactive security to predictive, defense-in-depth cyber resilience — integrating governance, monitoring, threat intelligence, and automation into a unified security posture.</p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
    imageClassName: 'aspect-[4/5]',
    fullWidthCustomOverview: true,
    primaryButton: { text: 'Request Security Assessment', link: '/contact' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    stats: [
      { value: '24/7', label: 'Monitoring Coverage', color: 'text-cyan-400' },
      { value: 'Multi-layered', label: 'Defense Architecture', color: 'text-blue-400' },
      { value: 'Zero-Trust', label: 'Ready Frameworks', color: 'text-purple-400' },
      { value: 'Expertise', label: 'Compliance Alignment', color: 'text-orange-400' },
    ],
    highFidelity: {
      narrative: {
        badge: 'CYBER RESILIENCE :: 2026',
        titleLine1: 'Secure the Core.',
        titleHighlight: 'Defend the Edge.',
        titleLine2: 'Enable the Future.',
        description: 'Modern enterprises no longer have a static edge. Cloud adoption, remote workforces, and AI systems have expanded the attack surface exponentially, requiring a predictive, defense-in-depth posture.',
        bottleneckLabel: 'The Reality',
        bottleneckText: 'Distributed silos & unmonitored endpoints.',
        requirementLabel: 'The Consequence',
        requirementText: 'Exponential risk & regulatory non-compliance.',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200',
        statusLabel: 'Defense State',
        statusValue: 'ZERO_TRUST'
      },
      philosophy: {
        icon: <ShieldCheck className="w-7 h-7 text-brand-blue" />,
        title: 'Cyber',
        titleHighlight: 'Resilience.',
        description: 'We approach security as an architectural discipline, integrating governance, monitoring, and automated response into a unified defensive fabric.',
        pills: ['Zero Trust', 'Intel-Driven', 'DevSecOps', 'Compliance-First']
      },
      matrix: {
        engineId: 'Engine :: Sec_Enablement_V2',
        title: 'Security Enablement Model',
        subtext: 'A structured methodology that moves your organization from reactive patching to optimized resilience.',
        layers: [
          { title: 'Assess', id: 'SEC_ASSESS', icon: <Search />, desc: 'Audit current posture, identify gaps, and evaluate risk across IT and OT.' },
          { title: 'Architect', id: 'SEC_ARC', icon: <Layers />, desc: 'Design resilient blueprints including Zero-Trust and Cloud security models.' },
          { title: 'Implement', id: 'SEC_BUILD', icon: <ShieldCheck />, desc: 'Deploy identity, data protection, and advanced threat management tools.' },
          { title: 'Monitor', id: 'SEC_MON', icon: <Activity />, desc: '24/7 detection and automated remediation across the enterprise.' },
          { title: 'Optimize', id: 'SEC_GO', icon: <Zap />, desc: 'Continuous posture improvement and adaptation to emerging threats.' }
        ]
      },
      schematic: {
        titleLine1: 'Intelligence-Driven.',
        titleHighlight: 'Predictive Defense.',
        description: 'Your security should not hinder your velocity. It should be the foundation for undisputed competitive reliability.',
        stats: [
          { label: 'Uptime', val: '99.99%' },
          { label: 'Security', val: 'ABSOLUTE' },
          { label: 'MTTR', val: 'MINIMIZED' }
        ]
      }
    }
  };

  const department = {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Protecting enterprise assets through intelligence-driven defense and governance-first security architecture.'
  };

  const technologies = [
    { category: 'Governance & Risk', items: ['GRC Platforms', 'RSA Archer', 'ServiceNow Risk', 'OneTrust', 'AuditBoard'] },
    { category: 'Monitoring & Response', items: ['Splunk (SIEM)', 'Sentinel', 'CrowdStrike (EDR)', 'Palo Alto XSOAR', 'LogRhythm'] },
    { category: 'Identity & Access', items: ['Okta', 'SailPoint', 'CyberArk', 'Azure AD / Entra ID', 'ForgeRock', 'Ping Identity'] },
    { category: 'Data Protection & Cloud', items: ['Netskope (CASB)', 'Varonis', 'Zscaler', 'Forcepoint', 'Wiz', 'Lacework'] },
    { category: 'Testing & Vulnerability', items: ['Tenable', 'Qualys', 'Rapid7', 'Checkmarx', 'Snyk', 'Burp Suite'] },
    { category: 'OT & Network Security', items: ['Nozomi Networks', 'Claroty', 'Palo Alto Firewalls', 'Fortinet', 'Cisco Firepower'] }
  ];

  const capabilities = [
    {
      title: 'Digital Risk & Compliance Consulting',
      bgImage: '/images/capabilities/cybersecurity.png',
      description: 'Build governance-driven security foundations aligned to regulatory and business mandates.',
      items: [
        'Compliance Consulting – ISO 27001, ISMS, PCI-DSS, SOX ITGC, NIST',
        'Risk Management – Cyber Risk, OT Risk, TPR, ASD, NESA, NIST, CSA',
        'Information Security Policy Review & Remediation',
        'Zero Trust Architecture (ZTA) Readiness & Assessment',
        'Control Automation & Compliance Tracking',
        'Business Continuity & Disaster Recovery (BCP/DR)',
        'Firewall Security Audit & Segmentation Review',
        'Infrastructure Security Testing (Servers/Networks)',
        'Virtual CISO (vCISO) as a Service',
        'Attack Simulation & Adversarial Testing'
      ]
    },
    {
      title: 'Managed Security Services',
      bgImage: '/images/capabilities/cybersecurity.png',
      description: 'Continuous monitoring, detection, and response powered by automation and intelligence.',
      items: [
        'MDR & EDR – 24x7, 16x5, 8x5 Operations Models',
        'Security Automation (SOAR) as a Service',
        'Threat Intelligence & Brand Monitoring',
        'OT/IT Integrated Security Monitoring',
        'Cloud Security Monitoring & Operations (CSPM)',
        'Firewall Management & Policy Optimization',
        'User Access Management (UAM) Manual Support',
        'Support & Enhancement (DLP, CASB, PAM, EPP)',
        'Cloud Security Compliance Drift Detection'
      ]
    },
    {
      title: 'Identity Security',
      bgImage: '/images/capabilities/cybersecurity.png',
      description: 'Secure access in distributed and hybrid ecosystems.',
      items: [
        'Identity Security Consulting (As-Is & Roadmap)',
        'Implementation – PAM, IAG, IDaaS Platforms',
        'Identity Vigil (IDaaS Platform) Deployment',
        'Zero-Trust Access Control Frameworks'
      ]
    },
    {
      title: 'Data Privacy & Protection',
      bgImage: '/images/capabilities/cybersecurity.png',
      description: 'Protect sensitive enterprise data across environments.',
      items: [
        'Sensitive Data Discovery & Classification',
        'Data Protection & Data Loss Prevention (DLP)',
        'Cloud Access Security Broker (CASB) Integration',
        'Global Privacy Compliance (GDPR/CCPA)'
      ]
    },
    {
      title: 'Advanced Threat & Vulnerability Management',
      bgImage: '/images/capabilities/cybersecurity.png',
      description: 'Proactively identify and eliminate exploitable weaknesses.',
      items: [
        'Application Security Testing (DAST/SAST)',
        'Continuous Vulnerability Management Programs',
        'Red Teaming & Advanced Adversarial Simulation',
        'Secure Code Reviews & DevSecOps Integration'
      ]
    },
    {
      title: 'OT Security',
      bgImage: '/images/capabilities/cybersecurity.png',
      description: 'Protect industrial and operational technology environments.',
      items: [
        'OT Risk Assessment & ICS Vulnerability Identification',
        'OT/IoT Security Threat Management',
        'OT Security Monitoring & Incident Response',
        'Infrastructure Air-Gap & Segmentation Design'
      ]
    }
  ];

  // Benchmarked side carousel (Trust Pillars)
  const trustPillars = [
    {
      title: 'Identity Vigil Platform',
      tag: 'Identity',
      description: 'The shift from on-prem to the cloud has made the workforce adopt a mobile-first strategy to support user access to data and applications securely. Learn More →'
    },
    {
      title: 'Virtual CISO',
      tag: 'Leadership',
      description: 'A Virtual Chief Information Security Officer is an outsourced security advisor whose responsibilities vary depending upon your business needs. Learn More →'
    },
    {
      title: 'Application Security Operations Center',
      tag: 'Development',
      description: 'Security can no longer be considered as an optional service. When you embed security into the software development lifecycle (SDLC), you have applications that are safe and protected by design. Learn More →'
    },
    {
      title: 'Cyber Risk Protection Platform',
      tag: 'Visibility',
      description: 'The evolution of digital technology has fostered businesses to expand their presence globally much faster than ever before. The increased attack surface requires a unified risk management approach. Learn More →'
    }
  ];

  // Technical Schematic Section
  const customSections = (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
              Defense Ecosystem
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight font-display">
              Related Security <span className="text-transparent bg-clip-text bg-brand-gradient">Offerings</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-xl">
              Strengthen your defensive posture by integrating core cybersecurity with our broader portfolio of resilience services.
            </p>
            <div className="space-y-4">
              {[
                { 
                  name: 'Cloud Security', 
                  link: '/services/cloud-engineering/managed-cloud-services',
                  icon: <Globe className="w-5 h-5" />,
                  desc: 'Hardened configurations and multi-cloud governance.'
                },
                { 
                  name: 'DevOps as a Service', 
                  link: '/services/product-engineering/devops-as-a-service',
                  icon: <Zap className="w-5 h-5" />,
                  desc: 'Security automation and CI/CD pipeline maturity for accelerated delivery.'
                },
                { 
                  name: 'AI Governance', 
                  link: '/services/ai-cognitive/agentic-ai',
                  icon: <Cpu className="w-5 h-5" />,
                  desc: 'Securing the data and models powering AI systems.'
                },
                { 
                  name: 'Enterprise Modernization', 
                  link: '/services/digital-transformation/enterprise-modernization',
                  icon: <Layers className="w-5 h-5" />,
                  desc: 'Modernizing legacy architectures for resilient growth.'
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
                Explore Services 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="hidden sm:block text-sm text-gray-400 font-mono italic">
                // SECURING_ECOSYSTEM...
              </div>
            </div>
          </div>

          {/* Technical Schematic: Security Operations Center (SOC) Hub */}
          <div className="lg:w-5/12 relative">
            <div className="relative aspect-square w-full max-w-[550px] mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 blur-[100px] rounded-full"></div>
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ background: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

              <div className="absolute top-10 left-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between gap-4"><span>ID:</span> <span className="text-brand-blue">#KG_SEC_01</span></div>
                <div className="flex justify-between gap-4"><span>LEVEL:</span> <span>ZERO_TRUST</span></div>
                <div className="flex justify-between gap-4"><span>STATUS:</span> <span className="text-emerald-500">PROTECTED</span></div>
              </div>

              <div className="absolute bottom-10 right-10 p-2 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm z-30 font-mono text-[10px] text-gray-400 shadow-sm animate-pulse-subtle">
                <div className="text-brand-blue mb-1 font-bold tracking-widest uppercase">Intel Hub</div>
                <div>SCANNING_NETWORK...</div>
                <div>LATENCY: 2MS</div>
              </div>

              {/* Central Core (Security Hub) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center justify-center relative z-20 group">
                <div className="absolute inset-4 bg-brand-gradient rounded-[32px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="absolute inset-8 border border-brand-blue/30 rounded-3xl border-dashed animate-spin-slow"></div>
                <div className="relative">
                   <Shield className="w-24 h-24 text-brand-blue drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                  <Eye className="w-7 h-7" />
                </div>
              </div>

              {/* Satellite Clusters (Infrastructure, Identity, Data) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-50 relative z-10 hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute inset-2 border border-blue-100 rounded-2xl"></div>
                    <Network className="w-14 h-14 text-blue-600 drop-shadow-sm" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Infrastructure</span>
                </div>
              </div>

              <div className="absolute bottom-20 left-0 group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center relative translate-x-4 hover:translate-x-0 transition-transform duration-300">
                    <Fingerprint className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-bold border border-white/20">IAM</div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase translate-x-4 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Identity</span>
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
                  <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] font-mono uppercase -translate-x-6 bg-white dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">Data Fabric</span>
                </div>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <linearGradient id="sec-flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2564ea" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4ab6d4" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path d="M250,250 L250,140" stroke="url(#sec-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L140,380" stroke="url(#sec-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <path d="M250,250 L360,380" stroke="url(#sec-flow-grad)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" />
                <circle r="4" fill="#2564ea"><animateMotion path="M250,250 L250,140" dur="2s" repeatCount="indefinite" /></circle>
                <circle r="4" fill="#22d3ee"><animateMotion path="M250,250 L140,380" dur="2.5s" repeatCount="indefinite" /></circle>
                <circle r="4" fill="#10b981"><animateMotion path="M250,250 L360,380" dur="3s" repeatCount="indefinite" /></circle>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const whyKangqoreIntro = `Kangqore secures enterprises without slowing innovation. We bridge the gap between complex threat landscapes and business velocity by integrating security into the very core of your digital architecture.`;

  const whyKangqore = [
    { title: 'Intelligence-driven defense', description: 'Leveraging AI and automated threat hunting to detect vulnerabilities before they are exploited.' },
    { title: 'Zero-trust architecture', description: 'Implementing identity-first security where no user or device is trusted by default.' },
    { title: 'Governance-first approach', description: 'Ensuring every security control is aligned to regulatory mandates and business outcomes.' },
    { title: 'Ecosystem resilience', description: 'Designing systems that don’t just detect attacks, but recover from them instantly.' },
    { title: 'MNC-grade leadership', description: 'Providing Virtual CISO and strategic advisory that meets Tier-1 enterprise expectations.' },
    { title: 'Proactive lifecycle management', description: 'Continuous posture optimization and DevSecOps integration from day one.' }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      capabilities,
      trustPillars,
      trustPillarsRightTitle: 'End-to-End Cyber Resilience Solutions',
      trustPillarsRightDescription: 'Kangqore provides next-generation digital transformation security solutions that help organizations accelerate innovation, enhance operational efficiency, and experience smoother customer interactions. By combining advanced learning technology and deep domain knowledge, we enable businesses to initiate Agile, Scalable, and Secure digital journeys according to their specific requirements.',
      trustPillarsRightButton: 'Request Consultation',
      whyKangqoreIntro,
      whyKangqore,
      postIndustrySections: customSections,
      ctaTitle: 'Build Security Into Your Growth Strategy',
      ctaDescription: 'Kangqore secures enterprises without slowing innovation. Let’s design your resilient digital ecosystem.',
      ctaButtonText: 'Book a Security Strategy Session'
    },
    department
  };

  return <ServicePageTemplate service={pageData.service} department={department} />;
};

export default ITSecurityServices;
