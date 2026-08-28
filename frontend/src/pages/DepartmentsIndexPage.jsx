// ─── /departments — Real index (Phase D) ──────────────────────────────────────
// Replaces the Phase C placeholder. Indexable (no robots noindex).
//
// Visual structure per plan Section 21.3 / 21.7:
//   6 department tiles, each with its own accent color + brand-pillar treatment.
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link } from 'react-router-dom';
import useSeo from '../seo/useSeo';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { departmentsData, departmentsList } from '../data/departmentsData';
import { servicesData } from '../data/servicesData';
import { coreSEO } from '../data/seoData';
import { BOOKING_CTA_LABEL, BOOKING_CTA_ROUTE } from '../data/cta';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import VisualBackground from '../components/VisualBackground';
import ConciergeSection from '../components/concierge/ConciergeSection';

const SITE_URL = 'https://kangqore.com';
const ORG_NAME = 'Kangqore';

// Single brand gradient — linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)
const BRAND_GRADIENT = 'linear-gradient(135deg, #2564ea 0%, #4ab6d4 100%)';

const DepartmentsIndexPage = () => {
  const seo = coreSEO.departments || {};
  const pageUrl = `${SITE_URL}/departments`;
  const pageTitle = seo.title || 'Departments — 6 Departments · 62 Services | Kangqore';
  const pageDescription =
    seo.description ||
    '6 Kangqore departments · 62 services. AI & Automation, Cloud & Engineering, Modernization, Security & Trust, Enterprise Platforms, and Growth.';
  const ogImage = `${SITE_URL}/og/default.png`;

  const [heroRef, heroVisible]   = useScrollAnimation({ once: true, threshold: 0.1 });
  const [introRef, introVisible] = useScrollAnimation({ once: true, threshold: 0.1 });
  const [cardsRef, cardsVisible] = useScrollAnimation({ once: true, threshold: 0.05 });
  const [ctaRef, ctaVisible]     = useScrollAnimation({ once: true, threshold: 0.2 });

  // JSON-LD: CollectionPage that lists the 6 departments + BreadcrumbList.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': pageUrl,
        name: 'Kangqore Departments',
        description: pageDescription,
        url: pageUrl,
        provider: {
          '@type': 'Organization',
          name: ORG_NAME,
          url: SITE_URL,
        },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: departmentsList.map((slug, i) => {
            const d = departmentsData[slug];
            return {
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Service',
                name: d.name,
                description: d.description,
                serviceType: d.tagline,
                url: `${SITE_URL}/departments/${slug}`,
              },
            };
          }),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Departments', item: pageUrl },
        ],
      },
    ],
  };

  useSeo({
    title: pageTitle,
    description: pageDescription,
    keywords: seo.keywords,
    canonical: pageUrl,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    lang: 'en',
    og: { type: 'website', url: pageUrl, title: pageTitle, description: pageDescription,
          image: ogImage, site_name: ORG_NAME, locale: 'en_GB' },
    twitter: { card: 'summary_large_image', site: '@kangqore', url: pageUrl,
               title: pageTitle, description: pageDescription, image: ogImage },
    jsonLd: [jsonLd],
  });

  return (
    <div className="text-white overflow-x-hidden font-sans selection:bg-brand-blue selection:text-white" style={{ backgroundColor: '#000000' }}>

      {/* ─── HERO ─── */}
      <div className="w-full h-screen bg-white dark:bg-black p-2 relative transition-colors duration-500">
        <section className="relative w-full h-full flex items-end overflow-hidden pb-36 rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#06090f]">
          <VisualBackground forceDark={true} />

          {/* Top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

          <div
            ref={heroRef}
            className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-48 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="w-full md:max-w-[58%] lg:max-w-[60%]">
              {/* Animated badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-12">
                <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                <p className="text-xs font-bold tracking-[0.2em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase">
                  One intelligence-led execution ecosystem
                </p>
              </div>

              <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.1] sm:leading-[0.96] tracking-[-0.045em] text-white mb-8 drop-shadow-2xl">
                6 Departments{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(37,100,234,0.4)]">· 62 Services</span>
              </h1>

              <p className="text-base text-white/50 leading-[1.8] max-w-lg mb-14 font-medium">
                Organized across six specialized departments — each owning a clear capability domain. AI, cloud, modernization, trust, enterprise platforms, and growth.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Link
                  to={BOOKING_CTA_ROUTE}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_40px_rgba(37,100,234,0.2)] hover:shadow-[0_0_60px_rgba(37,100,234,0.4)] hover:bg-white/20"
                >
                  <span className="relative z-10 font-bold text-sm tracking-wide">{BOOKING_CTA_LABEL}</span>
                  <div className="relative w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center group-hover:bg-white transition-colors duration-300 z-10">
                    <ArrowRight className="w-4 h-4 text-white group-hover:text-brand-blue" />
                  </div>
                </Link>
                <a
                  href="#departments"
                  className="group inline-flex items-center gap-2 px-6 py-4 text-white/60 hover:text-white text-sm font-bold tracking-wide transition-colors duration-200"
                >
                  Explore All Departments
                  <ArrowRight className="w-4 h-4 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile stats strip */}
          <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl md:hidden">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-4">
              {[
                { value: '6',  label: 'Departments' },
                { value: '61', label: 'Services' },
                { value: '5',  label: 'Engines' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-white drop-shadow-lg">{s.value}</p>
                  <p className="text-[10px] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent/80 font-bold tracking-widest uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ─── INTRO / STATS STRIP ─── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={introRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${introVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="mb-14">
            <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">WHAT WE DO</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-0 max-w-4xl">
              One ecosystem.{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Six specializations.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-20">
            <div>
              <p className="text-white/60 text-lg sm:text-xl leading-[1.7] mb-10 font-light max-w-xl">
                Each department owns a distinct capability domain — so expertise runs deep, accountability is clear, and every engagement draws on the right specialists.
              </p>
              <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-xl text-white/60 mb-14">
                The departments don't operate in silos.{' '}
                <span className="text-white">They cross-pollinate — and so does the value they deliver.</span>
              </p>
              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/[0.08]">
                {[
                  { value: '6',  label: 'Specialized\nDepartments' },
                  { value: '61', label: 'Canonical\nServices'       },
                  { value: '5',  label: 'Branded\nMethodologies'    },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-4xl font-black text-white tracking-tight mb-1">{s.value}</p>
                    <p className="text-white/30 text-[10px] font-bold tracking-wide uppercase leading-tight whitespace-pre-line">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — department name tags */}
            <div className="grid grid-cols-2 gap-3">
              {departmentsList.map((slug) => {
                const d = departmentsData[slug];
                const Icon = d.icon;
                return (
                  <Link
                    key={slug}
                    to={`/departments/${slug}`}
                    className="group flex items-center gap-3 p-4 rounded-xl border border-white/[0.07] bg-[#06090f] hover:border-white/20 transition-all duration-300"
                  >
                    {Icon && (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'rgba(74,182,212,0.10)' }}
                      >
                        <Icon className="w-4 h-4 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-black text-sm leading-tight">{d.shortName}</p>
                      <p className="text-white/35 text-[10px] font-medium mt-0.5">{d.serviceCount} services</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/50 ml-auto flex-shrink-0 transition-colors duration-200" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Brand footer bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 px-8 bg-[#06090f] border border-white/[0.08] rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span className="text-white font-black text-lg tracking-tight">Kangqore</span>
              <span className="hidden sm:block w-px h-5 bg-white/10" />
              <span className="text-white/35 text-sm font-medium">6 Departments · 62 Services · One Ecosystem</span>
            </div>
            <a
              href="#departments"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-bold text-sm tracking-wide hover:bg-white/90 transition-colors duration-200 flex-shrink-0"
            >
              Explore All Departments
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── eQORE AI CONCIERGE ─── */}
      <ConciergeSection inverted suggestedPrompts={[
        'What departments does Kangqore have?',
        'Which department handles AI and automation?',
        'What is Kangqore Cognition?',
        'What is Kangqore Foundry?',
        'What is Kangqore Reimagine?',
        'What is Kangqore Shield?',
        'What is Kangqore Platforms?',
        'What is Kangqore Growth?',
        'Which department is right for my company?',
        'What services does each department offer?',
        'How do the departments work together?',
        'Schedule a discovery call',
      ]} />

      {/* ─── 6 DEPARTMENTS GRID ─── */}
      <section id="departments" className="py-32 relative overflow-hidden bg-black">
        <div
          ref={cardsRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="mb-20">
            <p className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-5">OUR DEPARTMENTS</p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6">
              Six capability{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">domains</span>
            </h2>
            <p className="text-white/60 max-w-2xl text-lg sm:text-xl font-medium">
              Each department delivers a distinct, enterprise-grade capability — with its own methodology, branded framework, and specialist team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-start">
            {departmentsList.map((slug, i) => {
              const d = departmentsData[slug];
              const Icon = d.icon;
              const elevated = i === 1 || i === 4;
              const top3 = (d.heroServiceSlugs || d.serviceSlugs.slice(0, 3))
                .slice(0, 3)
                .map((s) => servicesData[s])
                .filter(Boolean);

              return (
                <Link
                  key={slug}
                  to={`/departments/${slug}`}
                  className={`group relative flex flex-col transition-all duration-500 hover:-translate-y-2 ${elevated ? 'lg:-translate-y-4' : ''}`}
                >
                  {/* Top image area */}
                  <div
                    className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden transition-all duration-500 group-hover:h-64 sm:group-hover:h-72 relative bg-black"
                  >
                    <img src={`/assets/frameworks/${['ai.png', 'cloud.png', 'strategy.png', 'cyber.png', 'data.png', 'ops.png'][i % 6]}`} alt={d.shortName} className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen transition-transform duration-700 group-hover:scale-105" />
                    {/* Subtle icon watermark */}
                    {Icon && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <Icon className="w-32 h-32 text-white" strokeWidth={0.75} />
                      </div>
                    )}
                    {/* Overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
                    {/* Dept label */}
                    <div className="absolute bottom-5 left-6">
                      <p className="text-white/50 text-[9px] font-black tracking-[0.35em] uppercase">Kangqore</p>
                      <p className="text-white font-black text-xl leading-tight drop-shadow-lg">{d.shortName}</p>
                    </div>
                  </div>

                  {/* Dark overlap card */}
                  <div className="relative w-[92%] mx-auto -mt-12 bg-[#06090f] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl transition-all duration-500 group-hover:border-white/20">
                    {/* Tagline */}
                    <p className="text-[10px] font-black tracking-[0.3em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-3">
                      {d.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-white/60 text-sm leading-relaxed mb-5">
                      {d.description}
                    </p>

                    {/* Top services */}
                    {top3.length > 0 && (
                      <ul className="space-y-1.5 mb-5">
                        {top3.map((svc) => (
                          <li key={svc.slug} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-brand-cyan flex-shrink-0" />
                            <span className="text-white/50 text-xs font-medium">{svc.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Footer row */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                      <p className="text-white/25 text-[10px] font-semibold">
                        {d.serviceCount} services · <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent/70">{d.bannerBrand}</span>
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-black bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent group-hover:gap-2 transition-all duration-200">
                        Explore
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* All services link */}
          <div className="mt-16 pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[9px] font-black tracking-[0.4em] text-white/25 uppercase mb-2">FULL CATALOG</p>
              <p className="text-white/50 text-sm font-medium">All 62 services across 6 departments — indexed and browsable.</p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 hover:border-brand-cyan/50 hover:bg-white/5 transition-all duration-300 group flex-shrink-0"
            >
              <span className="text-white font-black text-sm tracking-wide">Explore all 62 services</span>
              <ArrowRight className="w-4 h-4 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section
        ref={ctaRef}
        className={`py-28 md:py-36 lg:py-44 relative overflow-hidden transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ backgroundColor: '#000000' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-8 lg:max-w-[50%]">
              The right department for every{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">transformation challenge.</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 self-start lg:self-auto pt-4 lg:pt-6">
              <Link
                to={BOOKING_CTA_ROUTE}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-all duration-300 hover:scale-[1.02]"
              >
                {BOOKING_CTA_LABEL}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
              <Link
                to="/bids"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/15 text-white font-black text-sm tracking-wide hover:border-brand-cyan/50 hover:bg-white/5 transition-all duration-300"
              >
                Explore BIDS™ Diagnostic
                <ArrowRight className="w-4 h-4 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>
          </div>
          <div className="max-w-4xl mb-16">
            <p className="text-white/50 text-lg lg:text-xl leading-relaxed">
              Kangqore's six departments work as one intelligence-led ecosystem — from AI and cloud to security, modernization, platforms, and growth. The right specialists are already here; the question is where to begin.
            </p>
          </div>

          {/* Closing statement */}
          <div className="mt-16 pt-10 border-t border-white/[0.06]">
            <p className="text-2xl sm:text-3xl lg:text-[2.5rem] font-black leading-[1.25] text-white/50 max-w-3xl">
              The enterprises that build the right capabilities before they need them don't just grow.{' '}
              <span className="text-white">They dominate the curve.</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DepartmentsIndexPage;
