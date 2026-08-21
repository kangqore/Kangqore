import React from 'react';
import { Globe, Layers, Search, TrendingUp, Server, Activity, Briefcase, ShieldCheck } from 'lucide-react';
import ServicePageTemplate from '../../../components/ServicePageTemplate';

import {
  GCCPhilosophyBackground,
  GCCMarketContextStrip,
  GCCValueDeliverSection,
  GCCBuyerSegmentation,
  GCCMindsetTimeline,
  GCCCompetitiveDifferentiation,
  GCCFutureReady,
  GCCDiamondModel,
  KangqoreCommandCenterDashboard
} from '../../../components/services/platforms/GlobalCapabilityCentersCustomSections';

const GlobalCapabilityCenters = () => {
  // ============================================
  // SERVICE DATA — PRACTITIONER-GRADE REWRITE
  // ============================================
  
  const service = {
    name: 'Global Capability Centers (GCC)',
    titleLine1: 'Global',
    titleHighlight: 'Capability Centers',
    titleLine2: '',
    slug: 'global-capability-centers',
    shortDescription: 'We handle entity formation, compliance, infrastructure, and talent — you own the team, the IP, and the roadmap from Day 1.',
    description: 'Most first-time GCC builders spend 12-18 months before writing a single line of production code. Kangqore launches your India engineering center in 60 days — entity registered, workspace provisioned, engineers onboarded, shipping code by Day 90. You own everything. We operate everything underneath.',
    fullDescription: (
      <div className="space-y-4">
        <p className="font-light tracking-tight leading-snug opacity-80">
          Most first-time GCC builders spend 12-18 months before writing a single line of production code. Kangqore launches your India engineering center in 60 days — entity registered, workspace provisioned, engineers onboarded, shipping code by Day 90. You own everything. We operate everything underneath.
        </p>
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1260&q=80',
    videoBackground: '/videos/engineering-rd-bg.mp4',
    primaryButton: { text: 'Book a 30-Min GCC Strategy Call', link: '/contact?type=gcc-strategy' },
    secondaryButton: { text: 'Explore Capabilities', link: '#capabilities' },
    breadcrumb: [
      { label: 'Home', link: '/' },
      { label: 'Services', link: '/services' },
      { label: 'Business Operations', link: '/department/business-operations' },
      { label: 'Global Capability Centers' }
    ],
    
    // Stats — scannable, specific, no adjectives
    stats: [
      { value: '60', label: 'Days to First Sprint', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
      { value: '500+', label: 'Pre-Vetted Engineers', color: 'text-blue-400' },
      { value: '21', label: 'Days Avg. Time-to-Hire', color: 'text-emerald-400' },
      { value: '100%', label: 'Your Team. Your IP.', color: 'text-purple-400' },
    ],

    ctaTitle: "Your GCC should ship code in 60 days, not 6 months.",
    ctaDescription: "We handle entity formation, compliance, infrastructure, talent, and HR ops — you retain 100% ownership of the team, the IP, and the roadmap.",
    ctaButtonText: "Book a GCC Strategy Call",

    // High Fidelity Content
    highFidelity: {
      narrative: {
        badge: "GCC :: STRATEGIC OPERATING EXTENSION",
        titleLine1: "Strategic",
        titleHighlight: "Engineering Centers",
        titleLine2: "",
        description: "1,900+ GCCs operate in India today, generating $66B in annual revenue across 2 million professionals. By 2030, this ecosystem will cross $110B and 2,400+ centers. The question isn't whether to build a GCC — it's whether yours will become a strategic weapon or another cost line.",
        bottleneckLabel: "The 12-Month Trap",
        bottleneckText: "Most first-time GCC builders spend 12-18 months navigating entity registration, STPI/SEZ compliance, lease execution, local labor law (EPFO, ESI, Professional Tax), IT provisioning, and hiring — before a single line of production code is written. By the time the center is 'operational,' the business case has eroded.",
        requirementLabel: "The Kangqore Way",
        requirementText: "We compress this to 60 days. Entity formation through our registered company secretary, compliant workspace provisioning, AWS/Azure landing zones tunneled to your HQ, and a first unit of 8-12 engineers onboarded with domain immersion — shipping code by Day 90.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
        statusLabel: "Launch Velocity",
        statusValue: "60-DAY PLAYBOOK"
      },
      philosophy: {
        icon: <Globe className="w-7 h-7 text-gray-900 dark:text-white" />,
        title: "You Own the Team.",
        titleHighlight: "We Own the Friction.",
        description: "From Day 1, your GCC team reports to you, executes your roadmap, and builds your IP. We handle every operational surface that isn't engineering: entity compliance, facility management, HR operations, payroll, and infrastructure.",
        bgElement: <GCCPhilosophyBackground />,
        pills: ['Flexible Engagement', 'IP Ownership', 'Full Team Control', 'Outcome-Based Delivery'],
        features: [
          { title: '60-Day Launch Playbook', label: 'Entity → Compliance → Infrastructure → Team', icon: <Layers className="w-5 h-5 text-gray-400" />, content: 'PAN, TAN, GST, EPFO, ESI, Professional Tax registration. STPI/SEZ compliance filing. Lease execution. IT backbone provisioning. Developer workstation deployment. First unit onboarding — all within 60 days of commercial sign-off.' },
          { title: 'Flexible Commercial Models', label: 'Outcome-Based', icon: <Search className="w-5 h-5 text-gray-400" />, content: 'Engagement models structured around your scale requirements — from dedicated team retainers to outcome-based pricing. Commercial terms designed for flexibility, not vendor lock-in. Scale up or down based on business needs.' },
          { title: 'Full-Stack Talent Engine', label: 'Pre-Built Pipelines', icon: <ShieldCheck className="w-5 h-5 text-gray-400" />, content: 'AI-led screening across Bengaluru, Hyderabad, Pune, and NCR talent pools. 500+ pre-vetted engineers across platform, cloud, AI/ML, cybersecurity, and product engineering. Average time-to-fill: 21 days for niche roles.' },
          { title: 'HQ-Grade Operating Discipline', label: 'Not an Outpost', icon: <Activity className="w-5 h-5 text-gray-400" />, content: '30/60/90 onboarding: domain immersion sprints, codebase walkthroughs, shadow rotations with your HQ leads, first independent delivery by Day 90. Agile rituals calibrated to your existing sprint cadence.' }
        ]
      },
      matrix: {
        engineId: 'THE EXECUTION FRAMEWORK',
        title: 'Kangqore Command Center.',
        subtext: 'Your India execution platform. From commercial sign-off to first production sprint in four connected phases.',
        layers: [
          { title: 'Entity & Compliance', id: 'GCC_ENT', icon: <Search />, desc: 'Company secretary engagement, PAN/TAN/GST registration, STPI/SEZ filing, state labor department registrations, bank account activation.' },
          { title: 'Infrastructure & IT', id: 'GCC_INF', icon: <Layers />, desc: 'Workspace lease + fit-out, AWS/Azure landing zone provisioning, VPN tunnels to HQ, ISMS-aligned endpoint management, production-grade developer environments.' },
          { title: 'Talent & Onboarding', id: 'GCC_TAL', icon: <Server />, desc: 'AI-led sourcing, technical screening, offer management, 30/60/90 domain immersion, codebase walkthroughs, shadow rotations with HQ leads.' },
          { title: 'Operate & Scale', id: 'GCC_OPS', icon: <Activity />, desc: 'Sprint cadence alignment, governance rituals, KPI dashboards, quarterly business reviews, elastic scaling from unit (8) to squad (25) to division (100+).' }
        ]
      },
      schematic: {
        titleLine1: 'We Build It.',
        titleHighlight: 'You Own It.',
        description: 'The entity, the team, the codebase, the IP — yours from Day 1. Not after a 3-year BOT transition. Not after a transfer fee negotiation. Yours. Kangqore runs the operating layer underneath so your engineering leadership runs the roadmap above.',
        stats: [
          { label: 'Entity Ownership', val: 'DAY 1' },
          { label: 'IP & Codebase', val: '100% YOURS' },
          { label: 'Transfer Fees', val: 'NONE' },
          { label: 'Lock-in Period', val: 'ZERO' }
        ]
      }
    },

    // FIXED: Trust Pillars now focus on BUYER OUTCOMES (not capabilities)
    // De-duplicated from whyKangqore which focuses on HOW we deliver
    trustPillars: [
      { title: 'Your hiring velocity for niche AI/ML roles increases 3x', tag: 'Talent Speed', description: 'Pre-built pipelines across Bengaluru, Hyderabad, and Pune — not assembled on demand when you sign. 21-day average time-to-fill for platform engineers and ML specialists.' },
      { title: 'Your compliance risk drops to near-zero from Day 1', tag: 'Regulatory Safety', description: 'Entity formation, EPFO, ESI, Professional Tax, STPI/SEZ — all filed before your first engineer writes a line of code. Ongoing regulatory monitoring handled as part of the operating engagement.' },
      { title: 'Your engineering team ships production code by Day 90', tag: 'Speed-to-Value', description: '30/60/90 immersion model: domain context → codebase mastery → independent delivery. No 6-month ramp-up period.' },
      { title: 'Your operational cost stays 40-60% below self-setup', tag: 'Economics', description: 'Kangqore\'s operating model eliminates the overhead of building internal compliance, HR, and facilities teams from scratch — delivering cost advantages of 40-60% compared to self-managed GCC setup.' },
      { title: 'Your center runs like HQ, not an offshore outpost', tag: 'Cultural Parity', description: 'Same sprint cadence, same standup rituals, same JIRA boards. Shadow rotations with your HQ leads. Customer-empathy-led onboarding so the team understands WHY they build, not just WHAT.' },
      { title: 'You exit our model whenever you choose', tag: 'Zero Lock-in', description: 'No 3-year BOT contracts. No transfer fees. The team is yours, the IP is yours, the center is yours. When you are ready to internalize operations, we hand over and step back.' }
    ],

    // FIXED: whyKangqore now focuses on KANGQORE'S STRUCTURAL ADVANTAGES (how we deliver)
    // De-duplicated from trustPillars which focuses on buyer outcomes
    whyKangqore: [
      { title: 'We\'ve navigated India compliance so you don\'t have to', description: 'PAN, TAN, GST, EPFO, ESI, Professional Tax, STPI/SEZ, and critical Transfer Pricing frameworks (Cost-Plus markups) engineered upfront. Your GCC launches compliant and tax-optimized, not scrambling.', icon: Globe },
      { title: 'Elite engineers, not a bloated SI pyramid', description: 'We target the top 1% of India\'s engineering talent pool. You don\'t need 10,000 average developers; you need 50 elite platform engineers. 500+ pre-vetted experts across LLM, cloud, and cybersecurity. Average 21-day time-to-fill.', icon: Search },
      { title: 'We operate your GCC infrastructure — you focus on engineering', description: 'Facility management, IT provisioning, vendor management, payroll processing, compliance monitoring, and HR operations — all handled by Kangqore. Your engineering leadership focuses on product, not procurement.', icon: Layers },
      { title: 'Our commercial model has no traps', description: 'Flexible engagement models without multi-year lock-in. No BOT transfer fees. Scaling tied to your actual business needs. The center, team, and IP are yours — we provide the operating infrastructure underneath.', icon: Briefcase },
      { title: 'We do not compete with your engineering leadership', description: 'Your GCC team reports to your VP of Engineering, executes your roadmap, and attends your standups. We are the operating layer underneath — not a managed services provider inserting ourselves between you and your team.', icon: Activity },
      { title: 'We have a defined exit path — by design', description: 'When your center reaches operational maturity and you want to internalize HR, compliance, and facility management, we execute a structured handover. No extended transition fees. No artificial dependency. We succeed when you no longer need us.', icon: TrendingUp }
    ],

    whyKangqoreIntro: 'Unlike traditional GCC consultants who charge advisory fees to tell you what you already know, and unlike managed service providers who lock you into 3-year BOT contracts — Kangqore operates on a fundamentally different model.',

    industries: [
      { name: 'Financial Services & FinTech', description: 'Building the plumbing for modern finance. We deploy GCCs handling LLM fine-tuning for algorithmic trading, ISO 20022 payments modernization, and real-time fraud detection pipelines under strict RBI and SOC 2 Type II compliance.' },
      { name: 'Healthcare & Life Sciences', description: 'HIPAA BAA executed pre-launch. We build units driving clinical genomic data pipelines, FHIR API interoperability layers, and FDA 21 CFR Part 11 validation workflows directly inside your sprint cycle.' },
      { name: 'SaaS & Product Companies', description: 'We don\'t do IT support. We build product engineering units integrated directly into your CI/CD pipeline (GitHub Actions/GitLab) building multi-tenant microservices, WebAssembly modules, and real-time pub/sub systems.' },
      { name: 'Technology & ISVs', description: 'Your genuine extension in India. Platform engineering squads building Kubernetes operators, custom Terraform providers, and agentic AI workflows tightly coupled with your San Francisco or London HQ.' },
      { name: 'Retail & E-commerce', description: 'Omnichannel engineering units building composable MACH architectures (Microservices, API-first, Cloud-native, Headless) performing elastic scaling to handle peak global transaction volumes with sub-50ms latency.' },
      { name: 'Manufacturing & Industrial', description: 'Bridging OT-IT convergence. Our units build IoT SCADA telemetry hubs, predictive maintenance digital twins, and edge computing layers with strict ISA/IEC 62443 security compliance.' }
    ],

    // UI Structure Slots — REMOVED: GCCTrustStrip (generic), GCCWhyServiceSection (duplicate)
    // ADDED: Market context, Location Intelligence, Buyer Segmentation, Delivery Geography, Competitive Differentiation
    customSections: <GCCMarketContextStrip />,
    postCapabilitiesSections: (
      <div className="flex flex-col w-full">
        <GCCDiamondModel />
        <KangqoreCommandCenterDashboard />
        <GCCValueDeliverSection />
        <GCCBuyerSegmentation />
      </div>
    ),
    
    postFAQSections: (
      <div className="flex flex-col w-full">
        <GCCMindsetTimeline />
        <GCCCompetitiveDifferentiation />
        <GCCFutureReady />
      </div>
    ),

    // FIXED: FAQs rewritten as practitioner answers
    customFAQs: [
      {
        question: 'What exactly is GCC-as-a-Service, and how is Kangqore\'s model different?',
        answer: 'GCC-as-a-Service is our operating model where we handle entity formation (PAN, TAN, GST, STPI/SEZ), facility provisioning, compliance management (EPFO, ESI, Professional Tax), talent acquisition, IT infrastructure, and HR operations — while you retain 100% strategic control and IP ownership of your team. The center is yours from Day 1. Unlike traditional BOT models, there is no 3-year lock-in and no transfer fee — because there is nothing to "transfer." It was always yours.'
      },
      {
        question: 'How fast can a GCC go from sign-off to first production sprint?',
        answer: '60 days from commercial sign-off to first engineering sprint. The breakdown: Days 1-15 for entity registration and compliance filing, Days 10-30 for workspace lease execution and IT infrastructure provisioning (AWS/Azure landing zones, VPN tunnels, endpoint management), Days 15-45 for talent sourcing and technical screening, Days 30-60 for onboarding, domain immersion, and codebase walkthroughs. Your team ships independently by Day 90.'
      },
      {
        question: 'Which Indian cities does Kangqore operate GCCs in?',
        answer: 'Primary hubs: Bengaluru (deepest AI/ML and product engineering talent), Hyderabad (strong enterprise and cloud engineering pools, competitive costs), and Pune (emerging SaaS and DevOps concentration). We also support NCR (Delhi/Gurgaon/Noida) for enterprise-heavy functions. For Tier-2 expansion beyond 100 headcount, we advise on Jaipur, Indore, Coimbatore, and Visakhapatnam based on your specific role requirements and cost targets.'
      },
      {
        question: 'What does the commercial engagement model look like?',
        answer: 'Kangqore offers flexible engagement models tailored to your GCC stage and scale — from dedicated team retainers to outcome-based delivery pricing. Operating costs cover compliant workspace, IT infrastructure, HR operations (payroll, benefits, statutory compliance), facility management, and administrative services. We structure commercial terms to avoid multi-year lock-in so you retain the ability to scale or internalize operations based on your evolving business needs.'
      },
      {
        question: 'How does Kangqore handle India labor law and regulatory compliance?',
        answer: 'We manage full statutory compliance: Employees\' Provident Fund (EPFO), Employees\' State Insurance (ESI), Professional Tax (state-specific), Shops & Establishment Act registration, Payment of Gratuity Act, Maternity Benefit Act, and applicable state labor welfare fund contributions. For STPI/SEZ-registered entities, we handle annual compliance filings, foreign inward remittance documentation, and softex form submissions. All compliance is monitored continuously — not just at launch.'
      },
      {
        question: 'Can I scale the team up or down after launch?',
        answer: 'Yes. Our operating model scales elastically. Add engineers with 30-day ramp lead time (sourced through our pre-built pipeline). Scale down with appropriate notice — we handle the employment law implications, notice periods, and knowledge transfer. Typical growth trajectory: start with a unit of 8-12, grow to a squad of 20-30 within 6 months, and scale to 50-100+ within 12-18 months based on your product roadmap velocity.'
      }
    ]
  };

  const department = {
    name: 'Business Operations',
    slug: 'business-operations',
    description: 'Transform your business with intelligent and scalable operating models.',
    icon: <Briefcase className="w-6 h-6" />
  };

  // ============================================
  // CAPABILITIES — PRACTITIONER SPECIFICS
  // ============================================

  const capabilities = [
    {
      title: '60-Day GCC Launch Execution',
      description: 'From commercial sign-off to first engineering sprint in 60 days. Entity registration, STPI/SEZ compliance, lease execution, IT backbone provisioning, and first unit onboarding — structured as a single execution playbook, not a 12-month advisory engagement.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Entity setup & Transfer Pricing structures (Cost Plus markup) engineered upfront',
        'Pre-approved SEZ co-working incubators for immediate Day 1 engineering operations',
        'AWS/Azure landing zones with VPN tunnels to your HQ',
        'ISMS-aligned endpoint management + production-grade developer environments'
      ],
      micro: '60 days. Not 12 months.'
    },
    {
      title: 'AI/ML & GenAI Engineering Units',
      description: 'Pre-structured units of 8-12 AI/ML specialists — ML engineers, data scientists, LLMOps engineers, and NLP researchers — sourced from pre-built pipelines across Bengaluru and Hyderabad. Deployed into your sprint cadence with production deliverables from Week 6.',
      bgImage: '/images/capabilities/ai-cognitive.png',
      items: [
        'GenAI Center of Excellence: LLM fine-tuning, RAG pipelines, agentic AI workflows',
        'MLOps infrastructure: MLflow, Kubeflow, model registry, A/B experimentation',
        'AI-led screening with technical depth interviews + culture alignment',
        'Average 21-day time-to-fill for ML roles that take 60+ days conventionally'
      ],
      micro: 'Your AI/ML R&D center — operational in 6 weeks.'
    },
    {
      title: 'Cloud-Native & DevOps CoE Units',
      description: 'Plug-and-go Centers of Excellence for cloud-native engineering, platform modernization, and DevOps automation. Pre-configured unit structures built to accelerate cloud adoption and deliver infrastructure-as-code maturity from Day 1.',
      bgImage: '/images/capabilities/cloud-infrastructure.png',
      items: [
        'AWS / Azure / GCP architecture, migration, and FinOps optimization units',
        'Kubernetes orchestration, Terraform IaC, GitOps CI/CD automation',
        'SRE & platform engineering teams with production on-call readiness',
        'Cloud cost governance: FinOps dashboards, reserved instance management, right-sizing'
      ],
      micro: 'Cloud engineering at scale — not cloud consulting.'
    },
    {
      title: 'Cybersecurity & GRC Units',
      description: 'Dedicated security engineering and governance units that integrate into your GCC from launch. SOC operations, vulnerability management, compliance automation, and security architecture — staffed by certified professionals, not generalists.',
      bgImage: '/images/capabilities/cybersecurity.png',
      items: [
        'SOC-as-a-Service: 24/7 threat monitoring, SIEM management, incident response',
        'Compliance automation: SOC 2 Type II, ISO 27001, HIPAA, PCI-DSS preparation',
        'AppSec engineering: SAST/DAST pipeline integration, secure code review',
        'GRC framework: risk assessment, vendor security reviews, audit preparation'
      ],
      micro: 'Security built-in from Day 1 — not bolted on at Year 2.'
    },
    {
      title: 'Talent-as-a-Service Engine',
      description: 'Access niche-skilled engineering teams on demand through outcome-tied unit models. Whether you need product engineers, platform specialists, or data engineers — our pre-built talent pipelines deliver vetted candidates in 21 days, not 90.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        '500+ pre-vetted engineers across 12 technology domains',
        'AI-led sourcing from Bengaluru, Hyderabad, Pune, and NCR pipelines',
        'KPI-based engagement: velocity, quality, sprint completion, defect density',
        'Notice period management: we handle buyouts, negotiations, and onboarding logistics'
      ],
      micro: 'Hire the team you need in 21 days.'
    },
    {
      title: 'Data Engineering & Analytics CoE',
      description: 'Dedicated data engineering units that build and operate your data infrastructure — from lakehouse architecture and ETL pipelines to real-time analytics dashboards and business intelligence. Staffed by data engineers, analytics engineers, and BI specialists.',
      bgImage: '/images/capabilities/data-analytics.png',
      items: [
        'Lakehouse architecture: Databricks, Snowflake, BigQuery, Apache Spark',
        'ETL/ELT pipeline engineering: dbt, Airflow, Fivetran, Kafka Streams',
        'BI & analytics: Looker, Tableau, Power BI, custom dashboarding',
        'Data governance: catalog management, lineage tracking, PII classification'
      ],
      micro: 'Turn raw data into engineering-grade pipelines.'
    },
    {
      title: 'GCC Governance & Operating Cadence',
      description: 'Your GCC should run like HQ, not like an offshore annex. We embed governance structures, agile rituals, and operating discipline calibrated to your existing sprint cadence — so teams deliver with accountability, not ambiguity.',
      bgImage: '/images/capabilities/business-strategy.png',
      items: [
        'Sprint cadence alignment with HQ: same JIRA boards, same standups, same retros',
        '30/60/90 onboarding: domain immersion → codebase mastery → independent delivery',
        'KPI dashboards: velocity, cycle time, defect density, sprint completion rate',
        'Quarterly business reviews with full operating cost and performance transparency'
      ],
      micro: 'HQ discipline. Not offshore theater.'
    },
    {
      title: 'Post-Launch Growth & Lifecycle Management',
      description: 'The GCC journey doesn\'t end at launch. We provide continuous operational support — talent development, regulatory monitoring, facility expansion, capability diversification, and structured exit planning — so your center matures without disruption.',
      bgImage: '/images/capabilities/growth-marketing.png',
      items: [
        'Unit (8-12) → Squad (20-30) → Division (50-100+) elastic growth framework',
        'Regulatory continuity: EPFO/ESI filings, Professional Tax, Gratuity Act monitoring',
        'Capability diversification: add AI/ML, cloud, security, or data units incrementally',
        'Defined exit path: structured handover when you internalize operations'
      ],
      micro: 'Scale without restarting from zero.'
    }
  ];

  const technologies = [
    { category: 'Governance & Delivery', items: ['Jira / Confluence', 'Linear', 'GitHub Projects', 'Slack / Teams', 'Notion'] },
    { category: 'HR & Talent Systems', items: ['Workday', 'SAP SuccessFactors', 'Darwinbox', 'Greenhouse', 'Keka'] },
    { category: 'Security & Compliance', items: ['Okta', 'CrowdStrike', 'OneTrust', 'Vanta', 'Tenable'] },
    { category: 'Cloud Infrastructure', items: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Terraform', 'Kubernetes'] },
    { category: 'AI/ML Engineering', items: ['PyTorch', 'TensorFlow', 'Hugging Face', 'LangChain', 'MLflow'] },
    { category: 'DevOps & Platform', items: ['Docker', 'Helm', 'ArgoCD', 'GitHub Actions', 'Datadog'] }
  ];

  const pageData = {
    service: {
      ...service,
      technologies,
      technologiesTitle: 'The GCC Technology Stack',
      technologiesDescription: 'The infrastructure, tooling, and platforms we provision and operate across your GCC — from cloud backbone to AI/ML frameworks to DevOps automation.',
      capabilitiesTitle: 'Our Capabilities',
      capabilitiesDescription: 'Eight concrete execution streams that take your GCC from concept to production-grade engineering center. These are not advisory recommendations — they are services we deliver and are accountable for.',
      capabilities,
      trustPillars: service.trustPillars,
      whyKangqore: service.whyKangqore,
      whyKangqoreIntro: service.whyKangqoreIntro,
      industriesTitle: 'Industries We Build GCCs For',
      industryIntro: 'GCC operating models require industry-specific compliance, security, and workflow considerations. We don\'t apply a generic template — we configure the center for your regulatory and engineering context.',
      industries: service.industries,
      customSections: service.customSections,
      postCapabilitiesSections: service.postCapabilitiesSections,
      postFAQSections: service.postFAQSections,
      customFAQs: service.customFAQs
    },
    department
  };

  return (
    <div className="gcc-page-override">
      <style dangerouslySetInnerHTML={{__html: `
        .stat-counter-text { font-variant-numeric: tabular-nums; }
        .gcc-page-override > div > section { position: relative; z-index: 5; }

      `}} />
      <ServicePageTemplate
        service={pageData.service}
        department={department}
      />
    </div>
  );
};

export default GlobalCapabilityCenters;
