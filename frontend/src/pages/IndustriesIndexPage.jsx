import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import VisualBackground from '../components/VisualBackground';
import IndustriesWeServe from '../components/IndustriesWeServe';
import ConciergeSection from '../components/concierge/ConciergeSection';

const SITE_URL = 'https://kangqore.com';

const STATS = [
  { value: '12+', label: 'Industries', color: 'text-brand-blue' },
  { value: '61',  label: 'Services',   color: 'text-cyan-400'   },
  { value: '5',   label: 'AI Engines', color: 'text-brand-blue' },
  { value: '∞',   label: 'Scale',      color: 'text-cyan-400'   },
];

const PILLARS = [
  {
    title: 'Domain Intelligence',
    description: "Sector-specific AI models and data pipelines calibrated to your industry's unique variables and compliance requirements.",
  },
  {
    title: 'Vertical Playbooks',
    description: 'Pre-built transformation roadmaps proven across banking, healthcare, manufacturing, retail, and more.',
  },
  {
    title: 'Cross-Industry Synergy',
    description: 'Capabilities forged across 12 industries feed back into every engagement — compounding your advantage.',
  },
  {
    title: 'Regulatory Alignment',
    description: 'Governance-first delivery ensures every solution meets the regulatory constraints of your sector from day one.',
  },
];

const IndustriesIndexPage = () => {
  const pageTitle = 'Industries — 12+ Sectors | Kangqore';
  const pageDescription =
    'Kangqore delivers intelligence-led transformation across 12+ industries — banking, healthcare, manufacturing, retail, energy, and beyond.';
  const pageUrl = `${SITE_URL}/industries`;
  const ogImage = `${SITE_URL}/og/default.png`;

  const [heroRef, heroVisible]   = useScrollAnimation({ once: true, threshold: 0.1 });
  const [introRef, introVisible] = useScrollAnimation({ once: true, threshold: 0.1 });
  const [pillarsRef, pillarsVisible] = useScrollAnimation({ once: true, threshold: 0.05 });
  const [ctaRef, ctaVisible]     = useScrollAnimation({ once: true, threshold: 0.2 });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': pageUrl,
        name: 'Kangqore Industries',
        description: pageDescription,
        url: pageUrl,
        provider: { '@type': 'Organization', name: 'Kangqore', url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',       item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Industries',  item: pageUrl  },
        ],
      },
    ],
  };

  return (
    <div className="text-white overflow-x-hidden font-sans selection:bg-brand-blue selection:text-white" style={{ backgroundColor: '#000000' }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={pageUrl} />
        <meta property="og:title"       content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image"       content={ogImage} />
        <meta property="og:site_name"   content="Kangqore" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:url"         content={pageUrl} />
        <meta name="twitter:title"       content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image"       content={ogImage} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ─── HERO ─── */}
      <div className="w-full h-screen bg-white dark:bg-black p-2 relative transition-colors duration-500">
        <section className="relative w-full h-full flex items-end overflow-hidden pb-36 rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#06090f]">
          <VisualBackground forceDark={true} />

          {/* Top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

          {/* Background image overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="/images/chess_bg.png"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06090f] via-[#06090f]/60 to-transparent" />
          </div>

          <div
            ref={heroRef}
            className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-48 transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[11px] text-white/30 font-medium tracking-wide uppercase mb-8">
              <Link to="/" className="hover:text-white/60 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-brand-cyan">Industries</span>
            </nav>

            <div className="max-w-3xl">
              {/* Animated badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-12">
                <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                <p className="text-xs font-bold tracking-[0.2em] text-brand-cyan uppercase">
                  Sector-calibrated intelligence · 2026
                </p>
              </div>

              <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.1] sm:leading-[0.96] tracking-[-0.045em] text-white mb-8 drop-shadow-2xl">
                Built for{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(37,100,234,0.4)]">
                  Every Industry.
                </span>
              </h1>

              <p className="text-base text-white/50 leading-[1.8] max-w-lg mb-14 font-medium">
                From banking floors to hospital corridors, manufacturing lines to retail ecosystems — Kangqore delivers intelligence-led transformation across 12+ sectors with domain-calibrated precision.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Link
                  to="/contact"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_40px_rgba(37,100,234,0.2)] hover:shadow-[0_0_60px_rgba(37,100,234,0.4)] hover:bg-white/20"
                >
                  <span className="relative z-10 font-bold text-sm tracking-wide">Talk to Our Industry Experts</span>
                  <div className="relative w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center group-hover:bg-white transition-colors duration-300 z-10">
                    <ArrowRight className="w-4 h-4 text-white group-hover:text-brand-blue" />
                  </div>
                </Link>
                <a
                  href="#industries"
                  className="group inline-flex items-center gap-2 px-6 py-4 text-white/60 hover:text-white text-sm font-bold tracking-wide transition-colors duration-200"
                >
                  Explore All Industries
                  <ArrowRight className="w-4 h-4 text-brand-cyan group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl md:hidden">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-4 gap-4">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <p className={`text-2xl font-black drop-shadow-lg ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-white/50 font-bold tracking-widest uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop stats strip */}
          <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl hidden md:block">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center gap-12">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-4">
                  <div>
                    <p className={`text-3xl font-black leading-none drop-shadow-lg ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-white/50 font-bold tracking-widest uppercase mt-1">{s.label}</p>
                  </div>
                  {i < STATS.length - 1 && <div className="w-px h-8 bg-white/10" />}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ─── INTRO / WHY SECTION ─── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={introRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${
            introVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-14">
            <p className="text-[10px] font-black tracking-[0.45em] text-brand-cyan uppercase mb-8">
              INDUSTRY INTELLIGENCE
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                  Precision built for your{' '}
                  <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">
                    sector.
                  </span>
                </h2>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white/50 text-base leading-relaxed mb-6">
                  Generic transformation stalls at the industry boundary. Kangqore goes deeper — we bring domain-specific AI, vertical playbooks, and sector compliance expertise to every engagement across 12+ industries.
                </p>
                <p className="text-white/35 text-sm leading-relaxed">
                  Our multi-industry footprint means the intelligence we've engineered for banking informs retail, the precision we've applied in healthcare sharpens manufacturing. Every engagement compounds the last.
                </p>
              </div>
            </div>
          </div>

          {/* 4 pillar cards */}
          <div
            ref={pillarsRef}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-1000 ${
              pillarsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {PILLARS.map((p, i) => (
              <div
                key={p.title}
                className="rounded-2xl border border-white/8 bg-white/3 p-6 hover:border-brand-blue/40 hover:bg-white/5 transition-all duration-300"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-8 h-8 rounded-xl bg-brand-gradient mb-4 flex items-center justify-center">
                  <span className="text-white font-black text-xs">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-white font-bold text-sm mb-2 leading-snug">{p.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INDUSTRIES BENTO GRID ─── */}
      <div id="industries" className="dark">
        <IndustriesWeServe />
      </div>

      {/* ─── CONCIERGE / AI ASSISTANT ─── */}
      <ConciergeSection />

      {/* ─── BOTTOM CTA ─── */}
      <section
        ref={ctaRef}
        className={`py-32 transition-all duration-1000 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ backgroundColor: '#000000' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative rounded-3xl overflow-hidden border border-white/8 bg-[#06090f] p-10 md:p-16 text-center">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-blue/15 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <p className="text-[10px] font-black tracking-[0.45em] text-brand-cyan uppercase mb-6">
                START YOUR TRANSFORMATION
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6 max-w-3xl mx-auto">
                Your industry,{' '}
                <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">
                  reimagined.
                </span>
              </h2>
              <p className="text-white/50 text-base leading-relaxed max-w-xl mx-auto mb-12">
                Tell us your sector and your biggest operational challenge. Our industry experts will map the right capabilities to the outcomes you need.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-bold text-sm tracking-wide hover:shadow-[0_0_40px_rgba(37,100,234,0.5)] transition-all duration-300 hover:scale-[1.03]"
                >
                  Schedule a Discovery Call
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-4 text-white/60 hover:text-white text-sm font-bold tracking-wide transition-colors duration-200"
                >
                  Explore Our Services
                  <ArrowRight className="w-4 h-4 text-brand-cyan" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndustriesIndexPage;
