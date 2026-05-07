import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ChevronRight, Zap } from 'lucide-react';
import { departmentData } from '../data/departmentData';
import SEO from '../components/SEO';
import { departmentSEO } from '../data/seoData';
import InteractiveROICalculator from '../components/high-fidelity/InteractiveROICalculator';
import ArchitectureFlow from '../components/high-fidelity/ArchitectureFlow';
import AskEqoreCTA from '../components/concierge/AskEqoreCTA';
import SecondaryButton from '../components/ui/SecondaryButton';

const DepartmentPage = () => {
  const { departmentSlug } = useParams();
  const department = departmentData.find(d => d.slug === departmentSlug);

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Department Not Found</h1>
          <Link to="/" className="text-brand-blue hover:text-cyan-500">Return to Home</Link>
        </div>
      </div>
    );
  }

  const IconComponent = department.icon;

  const seo = departmentSEO[departmentSlug] || {};

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEO 
        title={seo.title || department.name}
        description={seo.description || department.description}
        keywords={seo.keywords}
        url={`/department/${departmentSlug}`}
        schemas={[{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": department.name,
          "url": `https://kangqore.com/department/${departmentSlug}`,
          "provider": { "@type": "Organization", "name": "Kangqore" },
          "description": seo.description || department.description,
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": `${department.name} Services`,
            "itemListElement": department.services.map((s, i) => ({
              "@type": "OfferCatalog",
              "position": i + 1,
              "name": s.name,
              "description": s.shortDescription
            }))
          }
        }]}
      />
      {/* ── Hero Section with Department Image ── */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-[#1D1D1F]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={department.image}
            alt={department.name}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-medium mb-8 text-white/50 tracking-wide">
            <Link to="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <Link to="/services" className="hover:text-white/80 transition-colors">Services</Link>
            <span className="text-white/30">/</span>
            <span className="text-white/70 font-semibold">{department.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800/10 border border-white/20 text-white text-xs font-semibold tracking-widest uppercase mb-8 backdrop-blur-sm">
                <IconComponent className="w-4 h-4" />
                {department.services.length} Services
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter leading-[0.95] mb-8 text-white font-display">
                {department.name}
              </h1>
              <p className="text-xl md:text-2xl font-light tracking-tight leading-snug mb-10 text-white/70 max-w-xl">
                {department.description}
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-[#1D1D1F] font-medium rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  Explore Services
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <SecondaryButton 
                  text="Contact Us" 
                  link="/contact" 
                  theme="glass"
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: `${department.services.length}`, label: 'Specialized Services', color: 'text-cyan-400' },
                { value: '100+', label: 'Projects Delivered', color: 'text-blue-400' },
                { value: '98%', label: 'Client Satisfaction', color: 'text-emerald-400' },
                { value: '24/7', label: 'Expert Support', color: 'text-purple-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-md border border-white/10 rounded-[20px] p-6 text-center hover:bg-white dark:bg-gray-900 dark:border-gray-800/15 transition-all duration-500">
                  <div className={`text-3xl lg:text-4xl font-semibold tracking-tighter mb-1 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-white/60 font-medium text-sm leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Department Overview Section ── */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-brand-blue text-xs font-semibold tracking-widest uppercase mb-6">
                Overview
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1D1D1F] tracking-tight mb-6">
                Why {department.name}?
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                {department.description} Our team of certified experts brings deep domain knowledge and proven methodologies to deliver measurable business outcomes.
              </p>
              <div className="space-y-4">
                {department.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1D1D1F] mb-1">{benefit.title}</h4>
                      <p className="text-gray-500 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50">
                <img
                  src={department.image}
                  alt={department.name}
                  className="w-full h-[450px] object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl p-5 border border-gray-100 hidden lg:flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-[#1D1D1F] text-lg">{department.services.length} Services</div>
                  <div className="text-gray-500 text-xs">Enterprise-Grade Solutions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Grid with Images ── */}
      <section id="services" className="py-20 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-brand-blue text-xs font-semibold tracking-widest uppercase mb-4">
              Our Capabilities
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1D1D1F] tracking-tight mb-4">
              {department.name} Services
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Explore our comprehensive {department.name.toLowerCase()} solutions designed for enterprise scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {department.services.map((service, index) => (
              <Link
                key={index}
                to={service.link || `/services/${departmentSlug}/${service.slug}`}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Card Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
                      {service.name}
                    </h3>
                  </div>
                  {/* Arrow indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white dark:bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>
                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {service.keyFeatures.slice(0, 3).map((feature, fi) => (
                      <span
                        key={fi}
                        className="px-2.5 py-1 bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 text-[11px] font-medium rounded-full group-hover:bg-blue-50 group-hover:text-brand-blue transition-colors duration-300"
                      >
                        {feature}
                      </span>
                    ))}
                    {service.keyFeatures.length > 3 && (
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-[#0a0a0c] text-gray-400 text-[11px] font-medium rounded-full">
                        +{service.keyFeatures.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── High-Fidelity Engineering Engine (Conditional) ── */}
      {(departmentSlug === 'ai-cognitive' || departmentSlug === 'cloud-engineering' || departmentSlug === 'digital-transformation-modernization') && (
        <section className="py-24 bg-white dark:bg-black overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-brand-blue text-xs font-semibold tracking-widest uppercase mb-6">
                  {departmentSlug === 'ai-cognitive' ? 'Intelligence Architecture' : departmentSlug === 'cloud-engineering' ? 'Cloud Ecosystem' : 'Modernization Roadmap'}
                </span>
                <h2 className="text-4xl lg:text-5xl font-bold text-[#1D1D1F] tracking-tighter leading-tight mb-8">
                  {departmentSlug === 'ai-cognitive' 
                    ? 'Engineering the Next Generation of Cognitive Systems.' 
                    : departmentSlug === 'cloud-engineering'
                    ? 'Architecting Resilient, Cloud-Native Futures.'
                    : 'Transforming Legacy Complexity into Digital Agility.'}
                </h2>
                <p className="text-xl text-gray-500 leading-relaxed mb-10">
                  We don't just {departmentSlug === 'ai-cognitive' ? 'deploy models' : departmentSlug === 'cloud-engineering' ? 'move servers' : 'update software'}. 
                  We engineer comprehensive {departmentSlug === 'ai-cognitive' ? 'agentic workflows' : departmentSlug === 'cloud-engineering' ? 'migration journeys' : 'digital transformations'} 
                  that prioritize performance, security, and measurable ROI.
                </p>
                
                <ArchitectureFlow type={departmentSlug === 'ai-cognitive' ? 'ai' : departmentSlug === 'cloud-engineering' ? 'cloud' : 'transformation'} />
              </div>

              <div>
                <InteractiveROICalculator type={departmentSlug === 'ai-cognitive' ? 'ai' : departmentSlug === 'cloud-engineering' ? 'cloud' : 'transformation'} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Benefits Section (Premium) ── */}
      <section className="py-20 bg-white dark:bg-black dark:border-gray-800 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-brand-blue text-xs font-semibold tracking-widest uppercase mb-4">
              Why Kangqore
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1D1D1F] tracking-tight">
              The Kangqore Advantage
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {department.benefits.map((benefit, index) => (
              <div
                key={index}
                className="relative p-8 rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 group"
              >
                <div className="absolute top-6 right-6 text-6xl font-black text-gray-100 group-hover:text-blue-50 transition-colors select-none">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">{benefit.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── eQORE Concierge CTA ── */}
      <AskEqoreCTA
        kind="department"
        name={department.name}
        slug={departmentSlug}
      />

      {/* ── CTA Section ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#1D1D1F]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(37,100,234,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(74,182,212,0.1),transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center z-10">
          <span className="inline-block px-4 py-2 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800/10 text-white/80 text-xs font-semibold tracking-widest uppercase mb-8 border border-white/10">
            {departmentSlug === 'ai-cognitive' ? 'Future-Proof Your Business' : departmentSlug === 'cloud-engineering' ? 'Scale Without Limits' : 'Accelerate Your Digital Evolution'}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight mb-6">
            {departmentSlug === 'ai-cognitive' 
              ? 'Ready to Deploy Enterprise-Grade AI?' 
              : departmentSlug === 'cloud-engineering'
              ? 'Ready to Modernize Your Cloud Infrastructure?'
              : 'Ready to Modernize Your Legacy Architecture?'}
          </h2>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            {departmentSlug === 'ai-cognitive'
              ? 'Join the top 1% of enterprises leveraging agentic AI to drive exponential productivity.'
              : departmentSlug === 'cloud-engineering'
              ? 'Transition from legacy bottlenecks to a cloud-native architecture built for 99.99% resilience.'
              : 'Break free from technical debt and unlock the agility of a truly digital enterprise.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-[#1D1D1F] font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-xl group"
            >
              {departmentSlug === 'ai-cognitive' ? 'Schedule an AI Strategy Audit' : departmentSlug === 'cloud-engineering' ? 'Request a Migration Roadmap' : 'Request a Modernization Audit'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <SecondaryButton 
              text="View Capability Deck" 
              link="/services" 
              theme="glass"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DepartmentPage;
