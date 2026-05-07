import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp, Sparkles, Users, Globe, Award } from 'lucide-react';
import { departmentData } from '../data/departmentData';
import InteractiveServicesMap from '../components/InteractiveServicesMap';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';
import SecondaryButton from '../components/ui/SecondaryButton';

const Services = () => {
  const [expandedDept, setExpandedDept] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);

  // Calculate total services
  const totalServices = departmentData.reduce((acc, dept) => acc + dept.services.length, 0);

  // Featured departments (first 6 for the grid)
  const featuredDepartments = departmentData.slice(0, 6);

  // ItemList schema for departments
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Kangqore Services",
    "description": coreSEO.services.description,
    "numberOfItems": departmentData.length,
    "itemListElement": departmentData.map((dept, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": dept.name,
      "url": `https://kangqore.com/department/${dept.slug}`
    }))
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black" data-testid="services-page">
      <SEO 
        title={coreSEO.services.title}
        description={coreSEO.services.description}
        keywords={coreSEO.services.keywords}
        url={coreSEO.services.url}
        schemas={[servicesSchema]}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <span className="inline-block px-4 py-2 bg-white dark:bg-black/10 backdrop-blur-sm rounded-full text-sm font-medium text-cyan-300 mb-6">
                Services
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Harness our unique strengths across{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  data, design, and engineering
                </span>{' '}
                to drive impact for your business
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                Unlock the power of data, design, and engineering to fuel innovation and drive meaningful outcomes for your business.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-slate-900 dark:text-white font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  data-testid="services-contact-btn"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <SecondaryButton 
                  text="Explore Services" 
                  link="#explore-services" 
                  theme="glass"
                />
              </div>
            </div>

            {/* Right - Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl lg:text-5xl font-bold text-cyan-400 mb-2">
                  {departmentData.length}
                </div>
                <div className="text-gray-300">Departments</div>
              </div>
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl lg:text-5xl font-bold text-blue-400 mb-2">
                  {totalServices}
                </div>
                <div className="text-gray-300">Services</div>
              </div>
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl lg:text-5xl font-bold text-emerald-400 mb-2">
                  500+
                </div>
                <div className="text-gray-300">Projects Delivered</div>
              </div>
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl lg:text-5xl font-bold text-purple-400 mb-2">
                  98%
                </div>
                <div className="text-gray-300">Client Satisfaction</div>
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

      {/* Interactive Services Map Section */}
      <section id="explore-services" className="py-20 md:py-28 bg-[#050505] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
              Interactive <span className="text-cyan-400">Capability Map</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Explore our comprehensive ecosystem of technology and consulting services designed to accelerate digital innovation.
            </p>
          </div>
          
          <InteractiveServicesMap />
        </div>
      </section>

      {/* All Departments Section */}
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-4 block">
              Our Expertise
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {departmentData.length} Departments, {totalServices} Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
              Comprehensive technology and consulting services designed to transform your business and accelerate digital innovation.
            </p>
          </div>

          {/* Departments Accordion Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentData.map((dept) => {
              const IconComponent = dept.icon;
              const isExpanded = expandedDept === dept.slug;
              
              return (
                <div 
                  key={dept.slug}
                  className={`bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                  data-testid={`dept-accordion-${dept.slug}`}
                >
                  {/* Department Header */}
                  <button
                    onClick={() => setExpandedDept(isExpanded ? null : dept.slug)}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center shadow-lg">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{dept.name}</h3>
                        <p className="text-sm text-gray-500">{dept.services.length} services</p>
                      </div>
                    </div>
                    <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-blue-100 text-brand-blue' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'}`}>
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Services List */}
                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}>
                    <div className="px-6 pb-6 space-y-2">
                      {dept.services.map((service) => (
                        <Link
                          key={service.slug}
                          to={`/services/${dept.slug}/${service.slug}`}
                          className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-[#050505] hover:bg-blue-50 hover:text-brand-blue transition-colors group"
                          data-testid={`service-link-${service.slug}`}
                          onMouseEnter={() => setHoveredService(service.slug)}
                          onMouseLeave={() => setHoveredService(null)}
                        >
                          <span className="text-brand-blue">•</span>
                          <span className="flex-1 text-sm font-medium">{service.name}</span>
                          <ArrowRight className={`w-4 h-4 transition-all ${hoveredService === service.slug ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                        </Link>
                      ))}
                      <Link
                        to={`/department/${dept.slug}`}
                        className="flex items-center justify-center gap-2 mt-4 p-3 bg-brand-gradient text-white rounded-lg font-semibold hover:shadow-lg transition-all group"
                      >
                        View All {dept.name} Services
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What sets us apart
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Innovation First</h3>
              <p className="text-gray-600 dark:text-gray-400">Cutting-edge solutions using the latest technologies and methodologies.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Expert Team</h3>
              <p className="text-gray-600 dark:text-gray-400">World-class talent with deep expertise across industries.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Global Reach</h3>
              <p className="text-gray-600 dark:text-gray-400">Serving clients worldwide with localized expertise and support.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Proven Results</h3>
              <p className="text-gray-600 dark:text-gray-400">Delivering measurable business outcomes with a 98% satisfaction rate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40"></div>
        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to transform your business?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Let&apos;s discuss how our {totalServices}+ services across {departmentData.length} departments can help you achieve your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-slate-900 dark:text-white font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Schedule a Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <SecondaryButton 
              text="View Case Studies" 
              link="/case-studies" 
              theme="glass"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
