import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';
import SecondaryButton from '../components/ui/SecondaryButton';

const Partners = () => {
  const partners = [
    {
      name: 'AWS',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png',
      description: 'Cloud-native engineering, scalable architectures, and secure infrastructure modernization across enterprise workloads.'
    },
    {
      name: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png',
      description: 'Cloud, AI, data, and enterprise application engineering built on Microsoft Azure and the broader Microsoft ecosystem.'
    },
    {
      name: 'Google Cloud',
      logo: 'https://www.gstatic.com/devrel-devsite/prod/v0d244f667a3683225cca86d0ecf9b9b81b1e734e55a030bdcd3f3094b835c987/cloud/images/cloud-logo.svg',
      description: 'Data platforms, analytics, AI/ML, and cloud transformation designed for performance, security, and global scale.'
    },
    {
      name: 'Salesforce',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png',
      description: 'Customer experience platforms, CRM modernization, and industry-specific Salesforce implementations at enterprise scale.'
    },
    {
      name: 'Adobe',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/1200px-Adobe_Corporate_Logo.png',
      description: 'Digital experience platforms, content, commerce, and marketing technology solutions powered by Adobe expertise.'
    },
    {
      name: 'ServiceNow',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/ServiceNow_logo.svg/2560px-ServiceNow_logo.svg.png',
      description: 'Enterprise workflow automation, ITSM, and operational transformation through the ServiceNow platform.'
    },
    {
      name: 'Boomi',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Boomi_logo.svg/2560px-Boomi_logo.svg.png',
      description: 'Integration, API management, and data connectivity enabling unified enterprise ecosystems.'
    },
    {
      name: 'Open-source & Ecosystem',
      logo: null,
      description: 'Strategic collaboration with open-source foundations and technology communities to build future-ready systems.'
    }
  ];

  const valueBlocks = [
    {
      title: 'Accelerated Time-to-Market',
      description: 'Pre-integrated platforms, certified expertise, and proven architectures reduce delivery timelines.'
    },
    {
      title: 'Enterprise-Grade Reliability',
      description: 'Certified partnerships ensure security, compliance readiness, and long-term platform support.'
    },
    {
      title: 'Continuous Innovation',
      description: 'Early access to roadmap insights, tools, and training keeps client solutions future-ready.'
    }
  ];

  return (
    <div className="bg-white dark:bg-black" data-testid="partners-page">
      <SEO 
        title={coreSEO.partners.title}
        description={coreSEO.partners.description}
        keywords={coreSEO.partners.keywords}
        url={coreSEO.partners.url}
      />
      {/* 1️⃣ HERO SECTION - Blue gradient with visual impact */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <span className="inline-block px-4 py-2 bg-white dark:bg-black/10 backdrop-blur-sm rounded-full text-sm font-medium bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent mb-6">
                Strategic Partnerships
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                We build strategic partnerships to{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  engineer long-term impact
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                At Kangqore, partnerships are not transactional alliances. They are long-term, capability-driven collaborations that enable enterprises to innovate faster, operate smarter, and scale securely.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-slate-900 dark:text-white font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  Partner With Us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <SecondaryButton 
                  text="View Partners" 
                  link="#partners" 
                  theme="glass"
                />
              </div>
            </div>

            {/* Right - Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent mb-2">8+</div>
                <div className="text-gray-300">Global Partners</div>
              </div>
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl lg:text-5xl font-bold text-blue-400 mb-2">100+</div>
                <div className="text-gray-300">Certifications</div>
              </div>
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl lg:text-5xl font-bold text-emerald-400 mb-2">500+</div>
                <div className="text-gray-300">Joint Projects</div>
              </div>
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl lg:text-5xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-300">Partner Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* 2️⃣ THE POWER OF PARTNERSHIP */}
      <section id="partners" className="py-20 md:py-28 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-20 items-start">
            {/* Left Column */}
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Partners
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                The power of partnership
              </h2>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7">
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Our partnerships give us early access to platforms, tools, training, and certifications—allowing us to deliver solutions faster, with higher reliability and measurable outcomes for our clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ PARTNER CARDS GRID */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {partners.map((partner, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 dark:border-gray-800 p-8 rounded-lg border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                {/* Partner Logo */}
                <div className="h-12 mb-6 flex items-center">
                  {partner.logo ? (
                    <img 
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="h-8 max-w-[140px] object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span 
                    className={`text-2xl font-bold text-gray-400 ${partner.logo ? 'hidden' : ''}`}
                    style={{ display: partner.logo ? 'none' : 'block' }}
                  >
                    {partner.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* Partner Name */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {partner.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3">
                  {partner.description}
                </p>

                {/* Learn More Link */}
                <span className="text-gray-900 dark:text-white font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ WHY PARTNERSHIPS MATTER */}
      <section className="py-20 md:py-28 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-16">
            Why our partnerships matter
          </h2>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {valueBlocks.map((block, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {block.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ CALL TO ACTION */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Large Statement */}
            <div className="lg:max-w-3xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                Let&apos;s engineer impact together
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Whether you&apos;re a technology provider, platform company, or enterprise ecosystem player—Kangqore builds partnerships that deliver real-world outcomes.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
              >
                Get in touch
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7️⃣ FOOTER CONTINUITY - Related Links */}
      <section className="py-12 bg-white dark:bg-black dark:border-gray-800 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/services" className="group">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors">
                Services
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Explore our comprehensive technology and consulting services.</p>
            </Link>
            <Link to="/industries/banking" className="group">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors">
                Industries
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Discover how we serve enterprises across key industries.</p>
            </Link>
            <Link to="/about-us" className="group">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors">
                About Us
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Learn about Kangqore&apos;s mission, values, and approach.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
