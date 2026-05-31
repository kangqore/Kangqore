import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Compass, Activity, Zap, ShieldCheck, Cpu, 
  CheckCircle2, Brain, Cog, RefreshCw, Shield, Layers, TrendingUp,
  UserCheck, Milestone, Sparkles, Plus, X
} from 'lucide-react';
import { departmentsData, departmentsList } from '../data/departmentsData';
import { servicesData } from '../data/servicesData';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';

// Partner badges for the technology marquee
const partnerLogos = [
  { label: "Microsoft", src: "/assets/badges/microsoft.svg", scale: "h-10 sm:h-12" },
  { label: "NASSCOM", src: "/assets/badges/nasscom.svg", scale: "h-10 sm:h-12" },
  { label: "Adobe", src: "/assets/badges/adobe.svg", scale: "h-10 sm:h-12" },
  { label: "Salesforce", src: "/assets/badges/salesforce.svg", scale: "h-10 sm:h-12" },
  { label: "ServiceNow", src: "/assets/badges/servicenow.svg", scale: "h-10 sm:h-12" },
  { label: "Azure", src: "/assets/badges/azure.svg", scale: "h-10 sm:h-12" },
  { label: "AWS", src: "/assets/badges/aws.svg", scale: "h-10 sm:h-12" },
  { label: "Databricks", src: "/assets/badges/databricks.svg", scale: "h-10 sm:h-12" },
  { label: "Neo4j", src: "/assets/badges/neo4j.svg", scale: "h-10 sm:h-12" },
  { label: "Fivetran", src: "/assets/badges/fivetran.svg", scale: "h-10 sm:h-12" },
  { label: "Snowflake", src: "/assets/badges/snowflake.svg", scale: "h-10 sm:h-12" },
  { label: "Power BI", src: "/assets/badges/powerbi.svg", scale: "h-10 sm:h-12" },
  { label: "Google Cloud", src: "/assets/badges/gcp.svg", scale: "h-10 sm:h-12" },
];

/**
 * SpotlightCard - Interactive cursor spotlight border/background tracking component.
 * Elevates simple grids to premium Stripe-like visual aesthetic.
 */
const SpotlightCard = ({ children, className = "", accentColor = "#2564ea", dataTestId = "" }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      data-testid={dataTestId}
      className={`relative rounded-[1.5rem] overflow-hidden border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#0a0a0c] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* Background radial spotlight glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-500"
        style={{
          opacity: isFocused ? 0.08 : 0,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, ${accentColor}, transparent 80%)`,
        }}
      />
      
      {/* Border glow tracking */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[1.5rem] transition-opacity duration-500 border-2 z-20"
        style={{
          opacity: isFocused ? 0.4 : 0,
          borderColor: accentColor,
          maskImage: `radial-gradient(140px circle at ${coords.x}px ${coords.y}px, white, transparent)`,
          WebkitMaskImage: `radial-gradient(140px circle at ${coords.x}px ${coords.y}px, white, transparent)`,
        }}
      />

      <div className="relative z-10 h-full flex flex-col justify-between p-8">
        {children}
      </div>
    </div>
  );
};

const DEPT_PRESENTATION = {
  cognition: {
    image: '/images/departments/dept_bg_1_1778893880482.png',
  },
  foundry: {
    image: '/images/departments/dept_bg_2_1778893900884.png',
  },
  reimagine: {
    image: '/images/departments/dept_bg_3_1778893917993.png',
  },
  shield: {
    image: '/images/departments/dept_bg_4_1778893933258.png',
    imageClass:
      'object-cover object-[center_top] scale-[1.25] transition-transform duration-700 group-hover:scale-[1.35]',
  },
  platforms: {
    image: '/images/departments/dept_bg_5_1778893951306.png',
  },
  growth: {
    image: '/images/departments/dept_bg_6_1778893966258.png',
    imageClass:
      'object-cover object-[70%_top] scale-[1.25] transition-transform duration-700 group-hover:scale-[1.35]',
  },
};

const DEFAULT_IMAGE_CLASS =
  'object-cover transition-transform duration-700 group-hover:scale-110';

const DEPT_ICONS_THEMES = {
  cognition: 'brand',
  foundry: 'cyan',
  reimagine: 'dark',
  shield: 'dark',
  platforms: 'cyan',
  growth: 'glass',
};

const carouselDepartments = departmentsList.map((slug) => {
  const dept = departmentsData[slug];
  const presentation = DEPT_PRESENTATION[slug] || {};
  return {
    slug,
    title: dept.name,
    subtitle: dept.tagline,
    description: dept.description,
    link: `/departments/${slug}`,
    image: presentation.image,
    imageClass: presentation.imageClass || DEFAULT_IMAGE_CLASS,
    topServices: dept.heroServiceSlugs.map((s) => servicesData[s].name),
    icon: dept.icon,
    serviceCount: dept.serviceCount,
    businessOutcomes: dept.businessOutcomes,
    accentColor: dept.accentColor,
  };
});

const Services = () => {
  const navigate = useNavigate();
  const [expandedDepts, setExpandedDepts] = useState({});

  const toggleExpand = (slug, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedDepts((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const handleCardClick = (slug, link, e) => {
    const isExpanded = !!expandedDepts[slug];
    if (isExpanded) return;
    if (e.target.closest('.toggle-expand-btn')) return;
    navigate(link);
  };

  const getCardClasses = (slug) => {
    switch (slug) {
      case 'shield':
        return 'col-span-1 sm:row-span-2 row-span-1 h-[380px] sm:h-[772px] lg:h-[812px]';
      case 'growth':
        return 'sm:col-span-2 col-span-1 row-span-1 h-[380px] lg:h-[400px]';
      default:
        return 'col-span-1 row-span-1 h-[380px] lg:h-[400px]';
    }
  };

  const [activeStep, setActiveStep] = useState(0);
  const [activeDept, setActiveDept] = useState('cognition');

  // Calculate total services across canonical 6 departments
  const totalServices = Object.values(departmentsData).reduce(
    (acc, dept) => acc + (dept.serviceCount || 0),
    0
  );

  // Custom visual panel mockups for each department card to achieve world-class B2B aesthetic
  const visualPanels = {
    cognition: (
      <div className="bg-[#050507] border border-white/5 rounded-xl p-4 font-mono text-[10px] text-slate-400 space-y-2 shadow-inner mt-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">eQORE NEURAL NODE</span>
        </div>
        <div className="flex gap-2"><span className="text-cyan-400 font-bold font-mono">[AGENT]</span><span className="text-slate-300 font-mono">orchestrating automation streams...</span></div>
        <div className="flex gap-2"><span className="text-cyan-400 font-bold font-mono">[THOUGHT]</span><span className="text-slate-300 font-mono">optimizing decision tree nodes...</span></div>
        <div className="flex gap-2"><span className="text-emerald-400 font-bold font-mono">[METRIC]</span><span className="text-white font-semibold font-mono">manual processing reduced by 60%</span></div>
      </div>
    ),
    foundry: (
      <div className="bg-[#050507] border border-white/5 rounded-xl p-4 font-mono text-[10px] text-slate-400 space-y-2.5 shadow-inner mt-4">
        <div className="flex justify-between items-center text-white font-bold text-[9px] uppercase tracking-wider border-b border-white/5 pb-2 font-mono">
          <span>GOLDEN PATH PIPELINE</span>
          <span className="text-emerald-400 font-mono">UPTIME 99.9%</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>Production Deployments</span>
            <span className="text-white font-mono">WEEKLY</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '92%' }} />
          </div>
        </div>
      </div>
    ),
    reimagine: (
      <div className="bg-[#050507] border border-white/5 rounded-xl p-4 font-mono text-[10px] text-slate-400 space-y-2 shadow-inner mt-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">
          <span>Migration diff</span>
        </div>
        <div className="text-red-400/80 line-through text-[9px] font-mono">- Legacy core database bottleneck</div>
        <div className="text-emerald-400 text-[9px] font-mono">+ Managed SRE Serverless endpoints</div>
        <div className="text-cyan-400 text-[9px] font-mono">+ 45% latency reduction achieved</div>
      </div>
    ),
    shield: (
      <div className="bg-[#050507] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-inner mt-4">
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">SOC 2 / ISO 27001</div>
          <div className="text-[10px] text-slate-500 font-mono">Continuous posture audit</div>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold tracking-widest font-mono shadow-[0_0_12px_rgba(16,185,129,0.1)]">
          COMPLIANT
        </span>
      </div>
    ),
    platforms: (
      <div className="bg-[#050507] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4 shadow-inner mt-4">
        <span className="flex-1 text-center py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-mono text-white">Salesforce</span>
        <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="flex-1 text-center py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-mono text-white">ServiceNow</span>
      </div>
    ),
    growth: (
      <div className="bg-[#050507] border border-white/5 rounded-xl p-4 font-mono text-[10px] text-slate-400 space-y-2 shadow-inner mt-4">
        <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-slate-500 font-bold border-b border-white/5 pb-2 font-mono">
          <span>Engine Funnel</span>
          <span className="text-emerald-400 font-mono">+40% ROI</span>
        </div>
        <div className="flex justify-between text-[9px] font-mono">
          <span>GEO Optimization:</span>
          <span className="text-white font-mono">ACTIVE</span>
        </div>
        <div className="flex justify-between text-[9px] font-mono">
          <span>Pipeline Attribution:</span>
          <span className="text-cyan-400 font-bold font-mono">3x Clarity</span>
        </div>
      </div>
    )
  };

  // ItemList schema for 6 canonical departments
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Kangqore Services",
    "description": coreSEO.services.description,
    "numberOfItems": departmentsList.length,
    "itemListElement": departmentsList.map((slug, index) => {
      const dept = departmentsData[slug];
      return {
        "@type": "ListItem",
        "position": index + 1,
        "name": dept.name,
        "url": `https://kangqore.com/departments/${dept.slug}`
      };
    })
  };

  // Playbook methodology steps content
  const methodologySteps = [
    {
      step: "01",
      title: "Discover & Frame",
      headline: "Establish Alignment & Map Value Pools",
      description: "Collaborative, design-led workshops to evaluate organizational architecture, uncover optimization hubs, and design a customized capability matrix.",
      deliverables: ["Capability alignment report", "Stakeholder buy-in blueprint", "Value pool ROI analysis"],
      outcomes: ["Clear capability roadmap", "Identified risk areas", "Agreed Wave 1 deliverables"],
      icon: Compass,
      accent: "text-blue-500 bg-blue-500/10 border-blue-500/20"
    },
    {
      step: "02",
      title: "90-Day Diagnostic",
      headline: "Deep Code, SRE & Cloud Posture Audits",
      description: "Rigorous technical diagnostic mapping legacy codebases, validating AI pipelines, assessing cybersecurity gaps, and auditing cloud spend models.",
      deliverables: ["Legacy codebase dependency map", "FinOps cloud spend audit", "Trust & AI governance checklist"],
      outcomes: ["Prioritized remediation backlog", "Uptime baseline established", "Immediate cloud cost savings (15%+)"],
      icon: Activity,
      accent: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20"
    },
    {
      step: "03",
      title: "Fixed-Bid Wave 1",
      headline: "De-risk Execution with Sprint Milestones",
      description: "Mitigate execution risk by delivering a high-priority product slice or platform integration in a fixed-bid, rapid-deployment initial wave.",
      deliverables: ["Production-ready MVP slice", "Embedded team provisioning", "SLA baseline parameters"],
      outcomes: ["Tangible product demo", "Proof of delivery speed", "Established working cadence"],
      icon: Zap,
      accent: "text-purple-500 bg-purple-500/10 border-purple-500/20"
    },
    {
      step: "04",
      title: "SLA-Backed Run",
      headline: "Continuous Optimization & Managed Ops",
      description: "Seamless handover to high-performance, SLA-backed managed operations, continuous security scanning, and platform optimization.",
      deliverables: ["24/7 SRE monitoring console", "SLA compliance reports", "Quarterly optimization roadmap"],
      outcomes: ["99.9% SRE uptime", "Zero process drift guarantee", "Performance-linked scaling models"],
      icon: ShieldCheck,
      accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    }
  ];

  // Current selected department info for interactive map
  const activeDeptInfo = departmentsData[activeDept];
  const activeDeptServices = Object.values(servicesData).filter(
    (svc) => svc.departmentSlug === activeDept
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300" data-testid="services-page">
      <SEO 
        title={coreSEO.services.title}
        description={coreSEO.services.description}
        keywords={coreSEO.services.keywords}
        url={coreSEO.services.url}
        schemas={[servicesSchema]}
      />

      {/* Section 1: Premium Dark Hero */}
      <section className="relative w-full overflow-hidden rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#0a1228] mt-2 mx-auto" style={{ maxWidth: 'calc(100% - 1rem)' }}>
        <div className="relative min-h-[620px] md:min-h-[720px] lg:min-h-[800px] overflow-hidden flex items-center">
          
          {/* Immersive mesh & grid background */}
          <div className="absolute inset-0 bg-[#070b19] z-0 overflow-hidden">
            {/* Dark grid pattern */}
            <div className="absolute inset-0 opacity-[0.05]" style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: '28px 28px'
            }} />
            
            {/* Floating blurred glow meshes */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2564ea] rounded-full blur-[140px] opacity-40 animate-[floatGlow_12s_ease-in-out_infinite]" />
            <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#4ab6d4] rounded-full blur-[160px] opacity-25 animate-[floatGlow_16s_ease-in-out_infinite_2s]" />
            <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-purple-600/20 rounded-full blur-[130px] opacity-35 animate-[floatGlow_14s_ease-in-out_infinite_4s]" />
            
            {/* Ambient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-[1]" />
          </div>

          {/* Content Layer */}
          <div className="relative z-[2] w-full pt-[170px] pb-16 sm:pt-[200px] sm:pb-20 lg:pt-[240px] lg:pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Content */}
              <div className="lg:col-span-7 max-w-4xl flex flex-col h-full gap-10 mt-20">
                <div className="space-y-10 flex-shrink-0 text-left">
                  <span className="inline-block px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase bg-white/10 text-white border border-white/20 backdrop-blur-md">
                    OUR SERVICES
                  </span>
                  
                  <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.1] sm:leading-[0.96] tracking-[-0.045em] text-white animate-fade-in">
                    Built for enterprise. <br />
                    <span className="bg-brand-gradient bg-clip-text text-transparent font-black">
                      Designed to scale.
                    </span>
                  </h1>
                  
                  <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-[1.8] max-w-2xl animate-fade-in font-medium">
                    Intelligence systems, cloud architecture, and digital design — delivered as one integrated framework, not six disconnected services.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-8 animate-fade-in mt-5">
                  <Link
                    to="/contact"
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white/70 backdrop-blur-xl text-gray-900 shadow-xl"
                    data-testid="services-contact-btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    <span className="relative z-10 text-gray-900 font-bold tracking-wide text-[13px]">
                      Schedule Discovery Call
                    </span>
                    <div className="relative z-10 w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center transition-all duration-500 group-hover:bg-brand-blue shadow-md">
                      <ArrowRight className="w-4 h-4 text-white transition-all duration-500 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                  <a
                    href="#explore-services"
                    className="group inline-flex items-center gap-2 px-4 py-2 hover:opacity-80 transition-opacity duration-300"
                  >
                    <span className="text-[13px] font-bold text-white/90 tracking-wide uppercase">
                      Explore Capabilities
                    </span>
                    <ArrowRight className="w-4 h-4 text-cyan-400 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>

              {/* Right Side Stats */}
              <div className="lg:col-span-5 hidden lg:flex justify-end relative">
                <div className="w-full max-w-[360px] bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                  {/* Glowing background details */}
                  <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#2564ea]/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
                  <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#4ab6d4]/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
                  
                  <div className="space-y-8 relative z-10">
                    <div className="group/stat">
                      <div className="text-5xl font-black bg-brand-gradient bg-clip-text text-transparent mb-1 transition-transform duration-300 group-hover/stat:scale-105 origin-left">
                        6
                      </div>
                      <div className="text-xs font-bold text-white tracking-widest uppercase">Departments</div>
                      <p className="text-xs text-slate-400 mt-1">Cognition, Foundry, Reimagine, Shield, Platforms, Growth</p>
                    </div>
                    
                    <div className="h-[1px] bg-white/10" />
                    
                    <div className="group/stat">
                      <div className="text-5xl font-black bg-brand-gradient bg-clip-text text-transparent mb-1 transition-transform duration-300 group-hover/stat:scale-105 origin-left">
                        {totalServices}
                      </div>
                      <div className="text-xs font-bold text-white tracking-widest uppercase">Specialized Capabilities</div>
                      <p className="text-xs text-slate-400 mt-1">Enterprise-grade capabilities mapped to buyer personas</p>
                    </div>

                    <div className="h-[1px] bg-white/10" />

                    <div className="group/stat">
                      <div className="text-xl font-bold text-white mb-1 transition-transform duration-300 group-hover/stat:translate-x-1">
                        1 Unified Playbook
                      </div>
                      <p className="text-xs text-slate-400">Integrated delivery framework aligned with industry compliance standards.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 6-Department Bento Grid */}
      <section className="py-24 bg-[#F5F5F7] dark:bg-[#0a0a0c] overflow-hidden relative transition-colors duration-300">
        <style dangerouslySetInnerHTML={{__html: `
          .bento-desc {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            visibility: visible;
          }
          .group:hover .bento-desc {
            opacity: 0;
            transform: translateY(12px);
            visibility: hidden;
            pointer-events: none;
          }
          .bento-services {
            opacity: 0;
            transform: translateY(12px);
            transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            pointer-events: none;
            visibility: hidden;
          }
          .group:hover .bento-services {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
            visibility: visible;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          
          {/* Section Header */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-gray-400 dark:bg-gray-700"></div>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                What we offer
              </span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                Explore <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">Kangqore Capabilities</span>.
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-md lg:text-right">
                6 Departments. {totalServices} Capabilities. One Execution Ecosystem.
              </p>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 sm:grid-rows-auto md:grid-rows-2 grid-cols-1">
            {carouselDepartments.map((dept) => {
              const cardPlacement = getCardClasses(dept.slug);
              const isExpanded = !!expandedDepts[dept.slug];
              const outcome = dept.businessOutcomes && dept.businessOutcomes[0];
              const IconComponent = dept.icon;

              return (
                <div
                  key={dept.slug}
                  onClick={(e) => handleCardClick(dept.slug, dept.link, e)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_20px_40px_rgba(37,100,234,0.15)] transition-all duration-500 hover:-translate-y-1 block ${cardPlacement} ${
                    isExpanded 
                      ? 'bg-[#0a0a0c] border border-white/10 shadow-2xl' 
                      : 'border border-transparent'
                  }`}
                >
                  {/* Background Image */}
                  <div className={`absolute inset-0 z-0 overflow-hidden rounded-2xl transition-opacity duration-500 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <img
                      src={dept.image}
                      alt={dept.title}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${dept.imageClass}`}
                    />
                    {/* Subtle overall dark tint for contrast */}
                    <div className="absolute inset-0 bg-black/25 z-[1] group-hover:bg-black/15 transition-colors duration-500" />
                    
                    {/* Premium top gradient vignette */}
                    <div
                      className="absolute inset-x-0 top-0 h-1/2 z-[2]"
                      style={{
                        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.45) 45%, rgba(0, 0, 0, 0) 100%)',
                      }}
                    />
                  </div>

                  {/* Hover Gradient Overlay */}
                  {!isExpanded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2564ea]/90 to-[#4ab6d4]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  )}

                  {/* Default Content Overlay */}
                  <div className={`relative z-20 h-full flex flex-col justify-between p-8 lg:p-10 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex flex-col h-full">
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-1 shrink-0">
                        {dept.title}
                      </h3>
                      <p className="text-xs lg:text-sm font-semibold text-brand-cyan mb-6 group-hover:text-white transition-colors duration-300 shrink-0">
                        {dept.subtitle}
                      </p>

                      {/* Description vs Top Services container */}
                      <div className="relative flex-1">
                        {/* Short Description (Visible by default, hidden on hover) */}
                        <p className="bento-desc absolute inset-0 text-white/90 leading-relaxed text-sm lg:text-[15px]">
                          {dept.description}
                        </p>

                        {/* Top Services List (Hidden by default, visible on hover) */}
                        <ul className="bento-services absolute inset-0 space-y-2.5">
                          <span className="block text-xs font-bold uppercase tracking-widest text-brand-cyan mb-2.5">Key Capabilities:</span>
                          {dept.topServices.slice(0, 6).map((service, sIdx) => (
                            <li key={sIdx} className="flex items-start text-white/90 text-[13px] lg:text-sm font-medium">
                              <span className="mr-2 text-brand-cyan opacity-80">✦</span>
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Floating Action Link Button */}
                    <div className="inline-flex items-center text-white font-bold w-fit mt-4 shrink-0 transition-all duration-300 group-hover:translate-x-1.5 text-sm lg:text-base">
                      Learn More
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Detailed Content Overlay */}
                  <div
                    className={`absolute inset-0 z-30 bg-[#0a0a0c]/98 backdrop-blur-xl p-6 lg:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out border-t border-white/10 ${
                      isExpanded 
                        ? 'opacity-100 pointer-events-auto translate-y-0' 
                        : 'opacity-0 pointer-events-none translate-y-4'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      {/* Top Row: Icon & Category badge */}
                      <div className="flex items-center justify-between mb-4">
                        {IconComponent && (
                          <div 
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] text-white relative overflow-hidden group/icon"
                            style={{
                              background: `linear-gradient(135deg, ${dept.accentColor} 0%, ${dept.accentColor}dd 100%)`,
                            }}
                          >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
                            <IconComponent className="w-5.5 h-5.5 sm:w-6 sm:h-6 relative z-10" strokeWidth={1.5} fill="currentColor" />
                          </div>
                        )}
                        <span className="text-[9px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10 font-mono">
                          {dept.serviceCount} Capabilities
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <h4 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight font-display">
                        {dept.title}
                      </h4>
                      <p className="text-[9px] sm:text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest font-mono">
                        {dept.subtitle}
                      </p>

                      {/* Outcome Badge in Glass Container */}
                      {outcome && (
                        <div className="mb-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-md">
                          <span 
                            className="text-xl sm:text-2xl font-black shrink-0 tracking-tight leading-none drop-shadow-md"
                            style={{ color: dept.accentColor }}
                          >
                            {outcome.metric}
                          </span>
                          <span className="text-[10px] sm:text-xs text-slate-300 leading-snug font-medium">
                            {outcome.label}
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {dept.description}
                      </p>

                      {/* Custom Visual Panel Mockup */}
                      {visualPanels[dept.slug]}
                    </div>

                    {/* Bottom Link (leaves space for close button via pr-14) */}
                    <div className="pt-4 border-t border-white/5 mt-6 flex justify-between items-center pr-14">
                      <Link
                        to={dept.link}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-cyan-400 transition-colors group/link"
                      >
                        Explore Full Department
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Floating Plus/X Action Button */}
                  <button
                    onClick={(e) => toggleExpand(dept.slug, e)}
                    className={`toggle-expand-btn absolute bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                      isExpanded 
                        ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 hover:scale-110 active:scale-95' 
                        : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:scale-110 active:scale-95'
                    }`}
                    aria-label={isExpanded ? "Collapse details" : "Expand details"}
                  >
                    {isExpanded ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Section 3: Interactive Ecosystem Map - World Class CX Refinement */}
      <section id="explore-services" className="py-24 bg-gray-50 dark:bg-[#050505] transition-colors duration-300 border-t border-gray-100 dark:border-white/5 relative overflow-hidden">
        {/* Glow accent details */}
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          
          {/* Section Header */}
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-200 dark:border-white/5 pb-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-cyan-400"></div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
                  Ecosystem Explorer
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold text-gray-900 dark:text-white leading-[1.1] max-w-4xl tracking-tight">
                Interactive <span className="bg-brand-gradient bg-clip-text text-transparent font-black">Capability Map</span>
              </h2>
            </div>
            <p className="text-gray-500 dark:text-slate-400 max-w-md text-sm md:text-base leading-relaxed font-medium">
              Filter through our 6 pillars of digital expertise. Drill down into specific services, target buyer personas, and engagement playbooks.
            </p>
          </div>

          {/* Ecosystem Grid Console */}
          <div className="w-full bg-[#0a0a0c] border border-gray-200/50 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[640px] relative">
            
            {/* Left sidebar - Branded Department Selectors */}
            <div className="w-full lg:w-1/3 bg-black/40 backdrop-blur-md border-r border-gray-200/50 dark:border-white/5 p-6 overflow-y-auto no-scrollbar flex flex-col justify-start">
              <div>
                <h3 className="text-white/60 font-mono font-bold text-xs uppercase tracking-widest mb-6 px-2">
                  Select Department Node
                </h3>
                
                <div className="space-y-3">
                  {departmentsList.map((slug) => {
                    const dept = departmentsData[slug];
                    const DeptIcon = dept.icon;
                    const isActive = activeDept === slug;
                    
                    return (
                      <button
                        key={slug}
                        onClick={() => setActiveDept(slug)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
                          isActive 
                            ? 'bg-white/[0.04] border-white/10 text-white shadow-xl shadow-black/20' 
                            : 'bg-transparent border-transparent text-slate-400 hover:bg-white/[0.01] hover:text-slate-200'
                        }`}
                      >
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300"
                          style={{
                            backgroundColor: isActive ? `${dept.accentColor}20` : 'rgba(255,255,255,0.03)',
                            borderColor: isActive ? dept.accentColor : 'rgba(255,255,255,0.05)',
                            color: isActive ? dept.accentColor : '#94a3b8'
                          }}
                        >
                          <DeptIcon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 text-left">
                          <span className="font-bold text-sm block leading-tight">{dept.shortName}</span>
                          <span className="text-[10px] text-slate-500 font-mono tracking-wide">{dept.tagline}</span>
                        </div>

                        {isActive && (
                          <div 
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: dept.accentColor }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Content Panel - Interactive Profile & Service Cards */}
            <div className="w-full lg:w-2/3 p-8 lg:p-12 bg-[#050507] overflow-y-auto no-scrollbar flex flex-col justify-between">
              
              {/* Top: Profile Info & CX Personas */}
              <div className="space-y-6 mb-10 border-b border-white/5 pb-8">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase border mb-3"
                      style={{ 
                        color: activeDeptInfo.accentColor,
                        borderColor: `${activeDeptInfo.accentColor}30`,
                        backgroundColor: `${activeDeptInfo.accentColor}10`
                      }}
                    >
                      {activeDeptInfo.tagline}
                    </span>
                    <h3 className="text-3xl font-display font-bold text-white tracking-tight leading-none">
                      {activeDeptInfo.name}
                    </h3>
                  </div>

                  <span className="text-xs font-mono text-slate-500">
                    {activeDeptServices.length} Modules Registered
                  </span>
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {activeDeptInfo.heroBody}
                </p>

                {/* CX Persona Tags & Delivery Approach */}
                <div className="grid sm:grid-cols-2 gap-6 pt-4">
                  {/* Personas */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold uppercase tracking-wider font-mono">Target Decision Makers</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg">
                        {activeDeptInfo.buyerPersonas.primary}
                      </span>
                      {activeDeptInfo.buyerPersonas.secondary.map((s, i) => (
                        <span key={i} className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Approach */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Milestone className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider font-mono">Engagement Blueprint</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {activeDeptInfo.deliveryApproach}
                    </p>
                  </div>
                </div>

              </div>

              {/* Middle: Services Grid Catalog */}
              <div className="space-y-4 mb-8">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono block">
                  Available Modules
                </span>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {activeDeptServices.map((svc) => (
                    <Link
                      key={svc.slug}
                      to={`/services/${activeDept}/${svc.slug}`}
                      className="group/svc relative rounded-2xl p-5 border border-white/5 bg-[#0a0a0c] hover:border-white/10 hover:bg-white/[0.01] transition-all duration-300 flex flex-col justify-between shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <h4 className="text-white font-bold text-sm group-hover/svc:text-cyan-400 transition-colors">
                            {svc.name}
                          </h4>
                          {svc.featured && (
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {svc.shortDescription}
                        </p>
                      </div>

                      <div className="flex justify-end mt-4 pt-2 border-t border-white/[0.02]">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover/svc:text-cyan-400 group-hover/svc:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom: Department CTA */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between flex-wrap gap-4 mt-auto">
                <p className="text-xs text-slate-500">
                  Ready to deploy these capabilities into your business model?
                </p>
                <Link
                  to={`/departments/${activeDept}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-slate-100 active:scale-95 transition-all text-xs"
                >
                  Configure Department
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Section 4: Delivery Methodology - World Class Interactive Timeline */}
      <section className="py-24 bg-[#0a0a0c] border-y border-white/5 text-white relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#2564ea]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          
          {/* Section Header */}
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Our Methodology</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
              The Kangqore Delivery Playbook
            </h2>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              We take the risk out of enterprise operations and cloud transformation. Our engagement model guarantees measurable milestones at every phase.
            </p>
          </div>

          {/* Interactive Steps Selection Row */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch border border-white/5 bg-black/40 rounded-3xl p-4 mb-8 relative">
            
            {/* Desktop timeline line backdrop */}
            <div className="hidden md:block absolute top-1/2 left-[8%] right-[8%] h-[2px] bg-white/5 -translate-y-1/2 z-0" />
            
            {/* Desktop active highlight line */}
            <div 
              className="hidden md:block absolute top-1/2 h-[2px] bg-brand-gradient -translate-y-1/2 transition-all duration-500 ease-out z-0"
              style={{
                left: `${8 + activeStep * 28}%`,
                width: `${activeStep < 3 ? '28%' : '0%'}`
              }}
            />

            {methodologySteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`flex-1 flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 text-left relative z-10 ${
                    isActive 
                      ? 'bg-[#0e172a] border-[#2564ea]/30 text-white shadow-xl shadow-blue-900/10' 
                      : 'bg-[#050507]/40 border-transparent text-slate-500 hover:text-slate-300 hover:bg-[#050507]/80'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    isActive ? step.accent : 'bg-white/5 border-white/10'
                  }`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider block">PHASE {step.step}</span>
                    <span className="text-sm font-bold tracking-tight block">{step.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Playbook Info Card */}
          <div className="bg-black/50 border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl transition-all duration-500">
            {/* Top right phase indicator */}
            <div className="absolute top-8 right-8 text-7xl md:text-8xl font-black font-mono text-white/5 select-none">
              {methodologySteps[activeStep].step}
            </div>

            <div className="grid md:grid-cols-12 gap-8 items-start relative z-10">
              
              {/* Left Column: Summary */}
              <div className="md:col-span-7 space-y-6">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">
                  {methodologySteps[activeStep].title} Focus
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                  {methodologySteps[activeStep].headline}
                </h3>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  {methodologySteps[activeStep].description}
                </p>
              </div>

              {/* Right Column: Deliverables / Outcomes */}
              <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6 pt-4 md:pt-0">
                
                {/* Deliverables list */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block border-b border-white/5 pb-2">
                    Key Deliverables
                  </span>
                  <div className="space-y-2">
                    {methodologySteps[activeStep].deliverables.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcomes list */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block border-b border-white/5 pb-2">
                    Milestone Outcomes
                  </span>
                  <div className="space-y-2">
                    {methodologySteps[activeStep].outcomes.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Section 5: Technology Partnerships */}
      <section className="py-24 bg-white dark:bg-black transition-colors duration-300 border-b border-gray-100 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Header */}
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-gray-400"></div>
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                  Our Ecosystem
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white leading-tight max-w-4xl tracking-tight">
                Strategic <span className="bg-brand-gradient bg-clip-text text-transparent">Partnerships</span>
              </h2>
            </div>
            <p className="text-gray-600 dark:text-slate-400 max-w-md text-sm md:text-base leading-relaxed">
              We build integrated solutions alongside the world&apos;s leading cloud, data, and platform providers.
            </p>
          </div>
        </div>

        {/* Infinite Loop Badges Marquee */}
        <div className="relative w-full overflow-hidden mt-8">
          {/* Edge fade gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />
          
          <div className="flex w-max animate-[partnerMarquee_30s_linear_infinite] items-center gap-16 sm:gap-24 lg:gap-32 py-10 hover:[animation-play-state:paused]">
            {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, index) => (
              <div
                key={`${logo.label}-${index}`}
                className="flex items-center justify-center shrink-0 group"
              >
                <img
                  src={logo.src}
                  alt={logo.label}
                  className={`${logo.scale} w-auto object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 cursor-pointer filter`}
                />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes partnerMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
        `}</style>
      </section>

      {/* Section 6: CTA Conversion Block */}
      <section className="py-24 bg-white dark:bg-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* CTA Box wrapper matching homepage design aesthetics */}
          <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-[#0a1228] to-slate-900 border border-white/10 p-12 md:p-20 text-center text-white shadow-2xl z-[1]">
            {/* Soft decorative blur backgrounds */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-cyan/10 rounded-full blur-[100px] -z-10 animate-[floatGlow_12s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2564ea]/10 rounded-full blur-[100px] -z-10 animate-[floatGlow_16s_ease-in-out_infinite_4s]" />
            
            <h2 className="text-[2rem] sm:text-[3rem] md:text-[3.5rem] font-display font-bold leading-tight mb-6 max-w-3xl mx-auto tracking-tight">
              Ready to define your next <br className="hidden sm:inline" />
              <span className="bg-brand-gradient bg-clip-text text-transparent">competitive advantage?</span>
            </h2>
            
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Connect with Kangqore&apos;s transformation advisors to review your capability requirements and set up a risk-managed diagnostic.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 group"
              >
                Schedule a Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/case-studies"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 group"
              >
                View Case Studies
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        @keyframes floatGlow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, -20px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default Services;
