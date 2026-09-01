import React, { useState, useEffect } from 'react';
import { Network, Globe, Zap, Layers, Cpu, Eye, ArrowRight, ShieldCheck, CheckCircle2, Server, Terminal, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ═══════════════════════════════════════════════════════════════════════════════
   THE INTEGRATION ECOSYSTEM — ARCHITECTURAL PLATFORMS & CAPABILITY SECTION
   Design: Chamfered Tech Cards with Layered 3D Fanned Gradient Wings & Obsidian Finish
   ═══════════════════════════════════════════════════════════════════════════════ */

const PLATFORM_ECOSYSTEM = [
  {
    id: 'ipaas',
    num: '01',
    icon: Network,
    title: 'Integration platforms and iPaaS',
    category: 'HYBRID ENGINE',
    managed: ['MuleSoft', 'Boomi', 'Informatica', 'Workato', 'SnapLogic'],
    selfHosted: ['Azure Logic Apps on Microsoft estates'],
    desc: 'The default for an estate of any size: connectors, transformation and lifecycle in one place. Licensed per connection or per flow, which stops making sense below roughly twenty interfaces — and above a few hundred, unless reuse is enforced.',
    keyRule: 'Platform does not create reuse; the governance model does.'
  },
  {
    id: 'apim',
    num: '02',
    icon: Globe,
    title: 'API management',
    category: 'EDGE GOVERNANCE',
    managed: ['Kong', 'Apigee', 'Azure API Management', 'AWS API Gateway'],
    selfHosted: ['Kong or NGINX where the runtime must stay yours'],
    desc: 'Policy, security, throttling and analytics at the edge of the estate. The gateway is the easy decision; the governance model behind it — who may publish, who owns a contract, how a version retires — is the one that matters.',
    keyRule: 'Synchronous request-response with strict zero-trust perimeter enforcement.'
  },
  {
    id: 'events',
    num: '03',
    icon: Zap,
    title: 'Event streaming and messaging',
    category: 'ASYNCHRONOUS FABRIC',
    managed: ['Apache Kafka', 'Confluent', 'Cloud-native event services'],
    selfHosted: ['RabbitMQ', 'ActiveMQ', 'IBM MQ where ordering is critical'],
    desc: 'Streaming and queueing are not interchangeable. Kafka is a durable log you replay; a message broker is a delivery guarantee you acknowledge. Choosing the wrong one is the single most common cause of an estate that cannot be reasoned about.',
    keyRule: 'Kafka = replayable log. Message Broker = acknowledged delivery guarantee.'
  },
  {
    id: 'b2b',
    num: '04',
    icon: Layers,
    title: 'B2B and EDI',
    category: 'PARTNER NETWORKS',
    managed: ['Vendor B2B gateways and managed EDI networks'],
    selfHosted: ['AS2 and SFTP endpoints inside your perimeter'],
    desc: 'X12, EDIFACT and the transport underneath. The engineering is unremarkable; partner onboarding at volume is the actual product, and the difference between an eight-week and a five-day onboarding is templating rather than tooling.',
    keyRule: 'Partner onboarding templating over bespoke point-to-point tooling.'
  },
  {
    id: 'runtime',
    num: '05',
    icon: Cpu,
    title: 'Runtime and deployment',
    category: 'EXECUTION PLANE',
    managed: ['Kubernetes', 'Containers', 'Serverless functions'],
    selfHosted: ['Whatever your platform team already operates'],
    desc: 'Where integration workloads actually run. Integration is stateful more often than teams expect, so serverless suits event handlers and fits long-running orchestration badly.',
    keyRule: 'Serverless for event triggers; persistent containers for long-running state.'
  },
  {
    id: 'observability',
    num: '06',
    icon: Eye,
    title: 'Observability',
    category: 'DISTRIBUTED TRACE',
    managed: ['Prometheus', 'Grafana', 'OpenSearch', 'Vendor API analytics'],
    selfHosted: ['Distributed tracing across every hop'],
    desc: 'Platform dashboards tell you a flow ran. They cannot tell you a transaction entered at one end and never arrived at the other, which is the question operations actually needs answered — and it requires tracing, not monitoring.',
    keyRule: 'End-to-end distributed payload trace instead of siloed run-status monitoring.'
  }
];

export const IntegrationEcosystemSection = ({
  eyebrow = 'THE INTEGRATION ECOSYSTEM',
  title = 'The platforms,',
  titleHighlight = 'and what each is actually for.',
  subtitle = 'Platform choice is mostly settled by what the group already licenses and by whether the hard problem is transformation, throughput or partner exchange. These are the defaults and what overrides them.'
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeItem = PLATFORM_ECOSYSTEM[activeTab];

  // Auto-cycle through the 6 platform tabs every 3 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % PLATFORM_ECOSYSTEM.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-20 md:py-32 bg-[#000000] relative overflow-hidden text-white"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* ── SECTION HEADER (2-COLUMN: HEADING LEFT, SUBTITLE RIGHT) ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-16 mb-16 md:mb-20">
          <div className="max-w-2xl">
            {eyebrow && (
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">
                  {eyebrow}
                </span>
              </div>
            )}
            <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white">
              {title}{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                {titleHighlight}
              </span>
            </h2>
          </div>

          {subtitle && (
            <div className="max-w-xl lg:pb-2">
              <p className="text-white/60 text-base sm:text-lg leading-relaxed font-sans">
                {subtitle}
              </p>
            </div>
          )}
        </div>

        {/* ── MAIN SHOWCASE: FANNED 3D WINGS + MASTER CHAMFERED CARD CONTAINER ── */}
        <div className="relative w-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">

          {/* ═══ LEFT SIDE: 3D FANNED GEOMETRIC GRADIENT FINS (REPRESENTING ECOSYSTEM PLATFORMS) ═══ */}
          <div className="w-full lg:w-[38%] flex flex-col justify-between relative">
            
            {/* Background Fanned Fin Layers with 3D White Glassmorphism */}
            <div className="relative w-full flex flex-col gap-2.5">
              {PLATFORM_ECOSYSTEM.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeTab === idx;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveTab(idx)}
                    className="relative cursor-pointer group transition-all duration-300 select-none"
                  >
                    {/* Fin Wing Shape */}
                    <div
                      style={{
                        clipPath: 'polygon(16px 0%, 100% 0%, calc(100% - 16px) 100%, 0% 100%)',
                        transform: isActive ? 'translateX(10px) scale(1.02)' : 'translateX(0px)',
                      }}
                      className={`relative flex items-center justify-between px-5 py-3.5 transition-all duration-300 overflow-hidden ${
                        isActive
                          ? 'bg-[#181818] border-t border-b border-[#2a2a2a] shadow-[0_16px_40px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.12)]'
                          : 'backdrop-blur-2xl border-t border-b border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Active State: Liquid Black Impasto Paint Texture + Specular White Lines */}
                      {isActive && (
                        <>
                          {/* Exact Liquid Black Oil Impasto Texture Artwork */}
                          <img
                            src="/images/capabilities/liquid-black-texture.png"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-90 select-none"
                          />

                          {/* Subtle Matte Contrast Gradient Overlay */}
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 'linear-gradient(90deg, rgba(16, 16, 18, 0.45) 0%, rgba(24, 24, 28, 0.25) 50%, rgba(16, 16, 18, 0.5) 100%)'
                            }}
                          />
                        </>
                      )}

                      {/* Inactive State 3D Iridescent Artwork Background */}
                      {!isActive && (
                        <>
                          <img
                            src="/images/capabilities/iridescent-glass-slabs-bg.jpg"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-60 select-none"
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 242, 252, 0.75) 50%, rgba(255, 255, 255, 0.84) 100%)',
                            }}
                          />
                          <div className="absolute inset-0 pointer-events-none opacity-70 bg-gradient-to-b from-white via-transparent to-transparent" />
                        </>
                      )}

                      {/* Content Row */}
                      <div className="flex items-center gap-3.5 relative z-10">
                        <span className={`text-xs font-mono font-black tracking-widest transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'}`}>
                          {item.num}
                        </span>
                        <div className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-950'}`}>
                          <Icon className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-xs sm:text-sm font-bold tracking-tight font-display transition-colors ${isActive ? 'text-white font-extrabold' : 'text-slate-800 group-hover:text-slate-950'}`}>
                            {item.title}
                          </span>
                          <span className={`text-[11px] font-mono tracking-wider uppercase font-semibold transition-colors ${isActive ? 'text-white/60' : 'text-slate-500'}`}>
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Right Arrow Indicator */}
                      <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100 text-white' : '-translate-x-2 opacity-0 group-hover:opacity-80 text-slate-700'}`}>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          {/* ═══ RIGHT SIDE: MASTER CHAMFERED ARCHITECTURE CARD (WHITE BODY + BLACK FOOTER) ═══ */}
          <div className="w-full lg:w-[62%] relative flex">
            {/* THE MASTER CHAMFERED CARD CONTAINER */}
            <div
              style={{
                /* Diagonal 45-degree chamfered cuts on top-left and bottom-right */
                clipPath: 'polygon(36px 0%, 100% 0%, 100% calc(100% - 36px), calc(100% - 36px) 100%, 0% 100%, 0% 36px)',
              }}
              className="relative w-full flex flex-col justify-between shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Card Specular Top Highlight (Black Accent) */}
              <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-black to-transparent z-20" />
              
              {/* ── CARD UPPER BODY (3D IRIDESCENT FROSTED GLASS SLABS DESIGN) ── */}
              <div className="w-full text-slate-900 p-6 sm:p-10 flex-1 flex flex-col justify-between relative overflow-hidden border-t border-l border-r border-white/90 shadow-[inset_0_2px_6px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(255,255,255,0.5),0_20px_45px_rgba(0,0,0,0.35)]">
                
                {/* 3D Iridescent Glass Slabs Artwork Background */}
                <img
                  src="/images/capabilities/iridescent-glass-slabs-bg.jpg"
                  alt="3D Iridescent Glass Slabs"
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-85 select-none"
                />

                {/* Studio Lighting & Frosted Glass Gradients Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(200, 208, 220, 0.35) 0%, rgba(255, 255, 255, 0.25) 30%, rgba(255, 255, 255, 0.8) 70%, rgba(255, 255, 255, 0.95) 100%)',
                  }}
                />

                {/* Specular Liquid Glare Highlights */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-70"
                  style={{
                    background: 'radial-gradient(ellipse at 25% 0%, rgba(255,255,255,0.95) 0%, transparent 65%)'
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-200/50">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-white uppercase px-4 py-1.5 rounded-full bg-[#111119] border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(0,0,0,0.8)]">
                          TIER {activeItem.num} · {activeItem.category}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1 font-display">
                        {activeItem.title}
                      </h3>
                    </div>

                    <div className="shrink-0 pt-1 text-slate-950">
                      {React.createElement(activeItem.icon, { className: "w-7 h-7 stroke-[2.2]" })}
                    </div>
                  </div>

                  {/* Core Thesis / Description */}
                  <div className="py-6">
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-sans font-normal">
                      {activeItem.desc}
                    </p>
                  </div>

                  {/* Managed vs Self-Hosted 2-Column Split Cards (Frosted Glass Finish) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    
                    {/* MANAGED PLATFORMS BOX (3D WHITE TACTILE CARD) */}
                    <div className="p-5 bg-gradient-to-b from-white/95 via-white/90 to-[#f2f4f8]/85 backdrop-blur-xl border border-white rounded-2xl relative shadow-[0_10px_25px_rgba(0,0,0,0.07),0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,1)] hover:-translate-y-0.5 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-slate-900">
                          MANAGED / CLOUD
                        </span>
                        <span className="w-2 h-2 rounded-full bg-slate-900 shadow-[0_0_6px_rgba(0,0,0,0.3)]" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeItem.managed.map((m, i) => (
                          <span 
                            key={i} 
                            className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-b from-white to-[#f5f6f9] border border-slate-200/80 text-slate-900 font-semibold font-sans shadow-[0_2px_6px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] hover:border-slate-400 hover:shadow-md transition-all"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* SELF-HOSTED PLATFORMS BOX (3D WHITE TACTILE CARD) */}
                    <div className="p-5 bg-gradient-to-b from-white/95 via-white/90 to-[#f2f4f8]/85 backdrop-blur-xl border border-white rounded-2xl relative shadow-[0_10px_25px_rgba(0,0,0,0.07),0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,1)] hover:-translate-y-0.5 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-slate-900">
                          SELF-HOSTED / PERIMETER
                        </span>
                        <Server className="w-3.5 h-3.5 text-slate-900" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeItem.selfHosted.map((s, i) => (
                          <span 
                            key={i} 
                            className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-b from-white to-[#f5f6f9] border border-slate-200/80 text-slate-900 font-semibold font-sans shadow-[0_2px_6px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] hover:border-slate-400 hover:shadow-md transition-all"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CARD FOOTER BAR (SOLID #181818 COLOR) ── */}
              <div className="w-full bg-[#181818] border-t border-[#2a2a2a] p-5 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
                
                {/* Footer Specular Bottom Highlight (White Line) */}
                <div className="absolute bottom-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent z-20" />

                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white/70 font-mono leading-tight">
                    <strong className="text-white font-semibold">Architectural Truth:</strong> {activeItem.keyRule}
                  </span>
                </div>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-b from-white via-[#f4f5f8] to-[#d8dbe0] text-slate-950 text-xs font-bold tracking-wide transition-all shrink-0 border border-white shadow-[0_4px_14px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-2px_3px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Talk To Our Experts</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default IntegrationEcosystemSection;
