// ─── /departments/:slug — BIDS-inspired department page ──────────────────────
// Same data sources, completely redesigned UI to match the BIDS page aesthetic:
// pure-black bg · dark cards · brand gradient accents · scroll-reveal.
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useSeo from '../seo/useSeo';
import { BOOKING_CTA_LABEL, BOOKING_CTA_ROUTE } from '../data/cta';
import { ArrowRight, ChevronRight, Users, Target, Wrench } from 'lucide-react';

import { departmentsData, departmentsList } from '../data/departmentsData';
import { servicesData } from '../data/servicesData';
import { departmentSEO } from '../data/seoData';
import NotFound from './NotFound';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import VisualBackground from '../components/VisualBackground';
import ConciergeSection from '../components/concierge/ConciergeSection';

const SITE_URL = 'https://kangqore.com';
const ORG_NAME  = 'Kangqore';

// Single brand accent — matches linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)
const BRAND_HEX  = '#4ab6d4';
const BRAND_GLOW = 'rgba(37,100,234,0.20)';

export default function DepartmentPageReal() {
  const { slug } = useParams();

  // All hooks before any conditional return (React rules)
  const [heroRef,     heroVisible]     = useScrollAnimation({ once: true, threshold: 0.1  });
  const [overviewRef, overviewVisible] = useScrollAnimation({ once: true, threshold: 0.1  });
  const [servicesRef, servicesVisible] = useScrollAnimation({ once: true, threshold: 0.05 });
  const [outcomesRef, outcomesVisible] = useScrollAnimation({ once: true, threshold: 0.1  });
  const [processRef,  processVisible]  = useScrollAnimation({ once: true, threshold: 0.1  });
  const [relatedRef,  relatedVisible]  = useScrollAnimation({ once: true, threshold: 0.1  });
  const [ctaRef,      ctaVisible]      = useScrollAnimation({ once: true, threshold: 0.2  });

  const valid = Boolean(slug && departmentsList.includes(slug));
  const d    = valid ? departmentsData[slug] : null;
  const seo  = (valid && departmentSEO[slug]) || {};
  const Icon = d?.icon;

  const pageUrl         = `${SITE_URL}/departments/${slug}`;
  const pageTitle       = seo.title       || (d ? `${d.name} — ${d.tagline} | Kangqore` : 'Kangqore');
  const pageDescription = seo.description || d?.description || '';
  const ogImage         = `${SITE_URL}/og/default.png`;

  const deliverySteps = (d?.deliveryApproach || '').split(' → ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': pageUrl,
        name: d.name,
        description: d.description,
        provider: { '@type': 'Organization', name: ORG_NAME, url: SITE_URL },
        serviceType: d.tagline,
        url: pageUrl,
        brand: { '@type': 'Brand', name: d.bannerBrand.replace(/[™®]/g, '').trim() },
        audience: { '@type': 'BusinessAudience', audienceType: d.buyerPersonas.primary },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${d.shortName} services`,
          itemListElement: d.serviceSlugs.map((svcSlug, i) => {
            const svc = servicesData[svcSlug];
            return {
              '@type': 'Offer',
              position: i + 1,
              itemOffered: {
                '@type': 'Service',
                name: svc?.name || svcSlug,
                url: `${SITE_URL}/services/${svcSlug}`,
              },
            };
          }),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',        item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Departments', item: `${SITE_URL}/departments` },
          { '@type': 'ListItem', position: 3, name: d.shortName,   item: pageUrl },
        ],
      },
    ],
  };

  useSeo(
    valid
      ? {
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
        }
      : null
  );

  if (!valid) return <NotFound />;

  return (
    <div
      className="text-white overflow-x-hidden font-sans selection:bg-brand-blue selection:text-white"
      style={{ backgroundColor: '#000000' }}
    >

      {/* ─────────────────────── HERO ─────────────────────── */}
      <div className="w-full h-screen bg-white dark:bg-black p-2 relative transition-colors duration-500">
        <section className="relative w-full h-full flex items-end overflow-hidden pb-36 rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#06090f]">
          <VisualBackground forceDark={true} />

          {/* Brand glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] blur-[120px] rounded-full pointer-events-none mix-blend-screen"
            style={{ backgroundColor: BRAND_GLOW }}
          />

          <div
            ref={heroRef}
            className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-48 transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="max-w-3xl">
              {/* Dept badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-12">
                <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                <p className="text-xs font-bold tracking-[0.2em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase">
                  {d.name}
                </p>
              </div>

              <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.1] sm:leading-[0.96] tracking-[-0.045em] text-white mb-8 drop-shadow-2xl">
                {d.tagline}
              </h1>

              <p className="text-lg sm:text-xl font-semibold tracking-normal mb-6 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent/80">
                {d.description}
              </p>

              <p className="text-base text-white/50 leading-[1.8] max-w-lg mb-14 font-medium">
                {d.heroBody}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <Link
                  to={BOOKING_CTA_ROUTE}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_40px_rgba(37,100,234,0.2)] hover:shadow-[0_0_60px_rgba(37,100,234,0.4)] hover:bg-white/20"
                >
                  <span className="relative z-10 font-bold text-sm tracking-wide">{BOOKING_CTA_LABEL}</span>
                  <div className="relative w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center group-hover:bg-white transition-colors duration-300 z-10">
                    <ArrowRight className="w-4 h-4 text-white group-hover:text-brand-blue" />
                  </div>
                </Link>
                <Link
                  to="/departments"
                  className="group inline-flex items-center gap-2 px-6 py-4 text-white/60 hover:text-white text-sm font-bold tracking-wide transition-colors duration-200"
                >
                  Explore Our Capabilities
                  <ArrowRight className="w-4 h-4 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile stats strip */}
          <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl md:hidden">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 gap-4">
              {[
                { value: d.serviceCount,            label: 'Services'     },
                { value: d.businessOutcomes.length, label: 'Key Outcomes' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-white drop-shadow-lg">{s.value}</p>
                  <p className="text-[10px] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent/80 font-bold tracking-widest uppercase mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ─────────────────────── OVERVIEW ─────────────────────── */}
      <section id="overview" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={overviewRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${
            overviewVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-14">
            <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">
              WHAT {d.shortName.toUpperCase()} DELIVERS
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-0 max-w-4xl">
              The complete{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                {d.tagline}
              </span>{' '}
              practice.
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start mb-20">
            {/* Left — body + stats strip */}
            <div>
              <p className="text-white/60 text-lg sm:text-xl leading-[1.7] mb-10 font-light max-w-xl">
                {d.heroBody}
              </p>

              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/[0.08]">
                {[
                  { value: d.serviceCount,
                    label: 'Specialized\nServices' },
                  { value: d.businessOutcomes.length,
                    label: 'Key\nOutcomes' },
                  { value: [d.buyerPersonas.primary, ...d.buyerPersonas.secondary].length,
                    label: 'Buyer\nPersonas' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-4xl font-black text-white tracking-tight mb-1">{s.value}</p>
                    <p className="text-white/30 text-[10px] font-bold tracking-wide uppercase leading-tight whitespace-pre-line">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — 3 overview cards */}
            <div className="space-y-4">
              {[
                { Icon: Target, label: 'What this department does', body: d.description },
                { Icon: Users,  label: "Who it's for",              body: `${d.buyerPersonas.primary} · ${d.buyerPersonas.secondary.join(' · ')}` },
                { Icon: Wrench, label: 'How we deliver',            body: d.deliveryApproach },
              ].map(({ Icon: ItemIcon, label, body }) => (
                <div
                  key={label}
                  className="p-6 border border-white/[0.07] bg-[#06090f] rounded-2xl flex gap-4"
                >
                  <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ItemIcon className="w-4 h-4 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase mb-2">{label}</p>
                    <p className="text-white/70 text-sm font-medium leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pull quote */}
          <div className="border-l-2 border-white/10 pl-8">
            <p className="text-xl sm:text-2xl font-black text-white/50 leading-snug max-w-4xl">
              "{d.description}"
            </p>
            <p className="text-lg font-black text-white mt-3">
              {d.buyerPersonas.primary}-ready. Execution-first. Backed by the full Kangqore practice.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────── eQORE AI CONCIERGE ─────────────────────── */}
      <div>
        <ConciergeSection
          inverted
          suggestedPrompts={[
            `What is ${d.name}?`,
            `What services does ${d.shortName} offer?`,
            `Who is ${d.shortName} designed for?`,
            `How does a ${d.shortName} engagement work?`,
            `What are the business outcomes from ${d.shortName}?`,
            `What is ${d.bannerBrand}?`,
            `How long does a ${d.shortName} engagement take?`,
            `Book a ${d.shortName} diagnostic`,
          ]}
        />
      </div>

      {/* ─────────────────────── SERVICES ─────────────────────── */}
      <section className="py-32 relative overflow-hidden bg-black">
        <div
          ref={servicesRef}
          className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${
            servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-20">
            <p className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-5">
              SERVICES IN {d.shortName.toUpperCase()}
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6">
              {d.serviceCount}{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Specialized Services
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl text-lg sm:text-xl font-medium">
              Every service in {d.shortName} is built for{' '}
              {d.buyerPersonas.primary}-level outcomes — from initial engagement through to managed delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-start">
            {d.serviceSlugs.map((svcSlug, i) => {
              const svc = servicesData[svcSlug];
              if (!svc) return null;
              const elevated = i === 1 || i === 4;
              return (
                <Link
                  key={svcSlug}
                  to={`/services/${svcSlug}`}
                  className={`group relative flex flex-col transition-all duration-500 hover:-translate-y-2 ${
                    elevated ? 'lg:-translate-y-4' : ''
                  }`}
                >
                  {/* Image top */}
                  <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden transition-all duration-500 group-hover:h-56 sm:group-hover:h-64 shadow-lg relative">
                    <img src={svc.image} alt={svc.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, transparent 0%, #06090f60 100%)' }} />
                  </div>
                  {/* Dark card */}
                  <div className="relative w-[92%] mx-auto -mt-12 bg-[#06090f] border border-white/10 rounded-xl p-6 sm:p-7 shadow-2xl transition-all duration-500 group-hover:border-white/20">
                    <div className="w-5 h-0.5 rounded-full mb-4 bg-brand-cyan" />
                    <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-3">
                      {svc.name}
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed mb-4">
                      {svc.shortDescription}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent/80">Explore service</span>
                      <ArrowRight className="w-3 h-3 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent/80 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────── BUSINESS OUTCOMES ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={outcomesRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${
            outcomesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-24">
            <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">
              AFTER {d.shortName.toUpperCase()}
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
              {d.shortName} clients gain{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                measurable advantage.
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {d.businessOutcomes.map((o, i) => (
              <div
                key={i}
                className="p-7 border border-white/[0.07] bg-[#06090f] rounded-2xl flex flex-col"
              >
                <div className="flex items-start gap-5 mb-5">
                  <span className="text-[9px] font-black tracking-widest text-white/20 mt-1.5 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-4xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">
                    {o.metric}
                  </p>
                </div>
                <p className="text-white/60 text-base font-medium leading-snug pl-8">{o.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── ENGAGEMENT PROCESS ─────────────────────── */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div
          ref={processRef}
          className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${
            processVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-end mb-20">
            <div>
              <p className="text-[10px] font-black tracking-[0.45em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-8">
                THE PROCESS
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white">
                The {d.shortName}{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">
                  Engagement Process
                </span>
              </h2>
            </div>
            <div className="lg:pb-3">
              <p className="text-white/50 text-lg font-medium leading-relaxed mb-8">
                A structured, phased engagement from initial scoping through to managed delivery — designed to match
                the pace of how {d.buyerPersonas.primary}-led organizations actually make decisions.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-white/15 hover:border-brand-cyan/50 hover:bg-white/5 transition-all duration-300 group"
              >
                <span className="text-white font-black text-sm tracking-wide">Request a Scoping Session</span>
                <ArrowRight className="w-4 h-4 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-16 lg:gap-x-24">
            {deliverySteps.map((step, i) => (
              <div key={step} className="flex gap-6 py-8 border-t border-white/[0.06]">
                <span className="text-[9px] font-black tracking-widest mt-1 flex-shrink-0 w-6 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-white font-black text-base leading-tight">{step.trim()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────── RELATED DEPARTMENTS ─────────────────────── */}
      {d.relatedDepartments && d.relatedDepartments.length > 0 && (
        <section className="py-28 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
          <div
            ref={relatedRef}
            className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${
              relatedVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 mb-20">
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-8 h-px bg-white/30" />
                  <p className="text-[10px] font-black tracking-[0.45em] text-white/50 uppercase">
                    RELATED DEPARTMENTS
                  </p>
                </div>
                <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.2] tracking-tight text-white">
                  {d.shortName} pairs well<br />
                  with these{' '}
                  <span className="bg-brand-gradient bg-clip-text text-transparent">
                    departments.
                  </span>
                </h2>
              </div>
              <div className="flex lg:items-end lg:pb-3">
                <p className="text-white/50 text-lg font-medium leading-relaxed max-w-lg">
                  Kangqore departments are designed to work in combination — each capable of standalone delivery,
                  and more powerful when paired for broader transformation programs.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {d.relatedDepartments.map((relSlug) => {
                const rel     = departmentsData[relSlug];
                const RelIcon = rel?.icon;
                if (!rel) return null;
                return (
                  <Link
                    key={relSlug}
                    to={`/departments/${relSlug}`}
                    className="group flex flex-col p-7 border border-white/[0.08] bg-[#06090f] rounded-2xl hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      {RelIcon && (
                        <div className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center">
                          <RelIcon className="w-4 h-4 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent" strokeWidth={1.5} />
                        </div>
                      )}
                      <div className="w-2 h-2 rounded-full bg-brand-cyan/40" />
                    </div>
                    <p className="text-white font-black text-2xl mb-2">{rel.shortName}</p>
                    <p className="text-white/50 text-sm font-medium leading-relaxed flex-1 mb-6">
                      {rel.tagline}
                    </p>
                    <div className="flex items-center gap-2 pt-4 border-t border-white/[0.06]">
                      <span className="text-xs font-bold bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent/80">
                        Explore {rel.shortName}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent/80 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────── FINAL CTA ─────────────────────── */}
      <section
        ref={ctaRef}
        className={`py-28 md:py-36 lg:py-44 relative overflow-hidden transition-all duration-1000 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ backgroundColor: '#000000' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.2] tracking-tight text-white mb-8 lg:max-w-[50%]">
              Ready to talk about{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                {d.shortName}?
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 self-start lg:self-auto pt-4 lg:pt-6">
              <Link
                to={BOOKING_CTA_ROUTE}
                className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-colors duration-200"
              >
                {BOOKING_CTA_LABEL}
                <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/departments"
                className="group inline-flex items-center gap-3 px-7 py-4 rounded-full border border-white/15 hover:border-brand-cyan/50 hover:bg-white/5 text-white font-black text-sm tracking-wide transition-all duration-200"
              >
                Explore Our Capabilities
                <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="max-w-4xl mb-16">
            <p className="text-white/50 text-lg lg:text-xl leading-relaxed">
              Book a 30-minute architecture diagnostic with a named practice lead. Fixed agenda. No sales pitch.{' '}
              {d.shortName} engagements begin with clear scoping and move to delivery at the pace your
              organization requires.
            </p>
          </div>

          <div className="mt-10 pt-10 border-t border-white/[0.06]">
            <p className="text-2xl sm:text-3xl lg:text-[2.5rem] font-black leading-[1.25] text-white/50 max-w-3xl">
              {d.shortName} transformation, diagnosed and delivered.{' '}
              <span className="text-white">From first conversation to production.</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
