import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ChevronRight, Home, Briefcase, Users, BookOpen, Building2, Globe, Shield, FileText } from 'lucide-react';
import { departmentData } from '../../data/departmentData';

const Sitemap = () => {
  const sitemapSections = [
    {
      title: 'Main Pages',
      icon: Home,
      links: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about-us' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Careers', path: '/careers' },
        { name: 'News & Updates', path: '/news' },
        { name: 'Investors', path: '/investors' },
        { name: 'Communities', path: '/communities' },
      ]
    },
    {
      title: 'Who We Are',
      icon: Users,
      links: [
        { name: 'About Kangqore', path: '/about-us' },
        { name: 'Values & Culture', path: '/values' },
        { name: 'Leadership', path: '/leadership' },
        { name: 'Partners', path: '/partners' },
        { name: 'Testimonials', path: '/testimonials' },
        { name: 'Eqore', path: '/eqore' },
        { name: 'Location', path: '/location' },
        { name: 'Team', path: '/team' },
        { name: 'Brand Identity', path: '/brand-identity' },
      ]
    },
    {
      title: 'Industries',
      icon: Building2,
      links: [
        { name: 'Banking', path: '/industries/banking' },
        { name: 'Insurance', path: '/industries/insurance' },
        { name: 'EdTech', path: '/industries/edtech' },
        { name: 'Healthcare', path: '/industries/healthcare' },
        { name: 'Life Science', path: '/industries/life-science' },
        { name: 'Media & Technology', path: '/industries/media-technology' },
        { name: 'Retail', path: '/industries/retail' },
        { name: 'Travel & Hospitality', path: '/industries/travel-hospitality' },
        { name: 'Energy & Utilities', path: '/industries/energy-utilities' },
        { name: 'Manufacturing', path: '/industries/manufacturing' },
        { name: 'Information Services', path: '/industries/information-services' },
        { name: 'Consumer Goods', path: '/industries/consumer-goods' },
        { name: 'SaaS', path: '/industries/saas' },
      ]
    },
    {
      title: 'Insights & Content',
      icon: BookOpen,
      links: [
        { name: 'Blogs', path: '/blogs' },
        { name: 'Case Studies', path: '/case-studies' },
        { name: 'White Papers', path: '/white-paper' },
        { name: 'Brochures', path: '/brochures' },
        { name: 'Events', path: '/events' },
      ]
    },
    {
      title: 'Legal & Compliance',
      icon: Shield,
      links: [
        { name: 'Privacy Statement', path: '/privacy' },
        { name: 'Terms & Conditions', path: '/terms' },
        { name: 'Cookie Policy', path: '/cookies' },
        { name: 'Accessibility Statement', path: '/accessibility' },
        { name: 'Sitemap', path: '/sitemap' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-[#F5F5F7] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.4]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <nav className="flex items-center gap-1.5 text-xs font-medium mb-6 text-gray-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-gray-700 dark:text-gray-300 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600 dark:text-gray-400 font-semibold">Sitemap</span>
          </nav>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1D1D1F] rounded-2xl flex items-center justify-center">
              <Map className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-[#1D1D1F]">Sitemap</h1>
            </div>
          </div>
          <p className="text-lg text-gray-500 font-light max-w-3xl">
            A complete overview of all pages and sections available on the Kangqore website. Use this page to quickly find what you're looking for.
          </p>
        </div>
      </section>

      {/* General Sections */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 mb-20">
            {sitemapSections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{section.title}</h2>
                  </div>
                  <ul className="space-y-2.5 ml-1">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          to={link.path}
                          className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-blue transition-all duration-200"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                          <span className="text-sm">{link.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Service Departments - Dynamic from departmentData */}
          <div className="border-t border-gray-100 pt-16">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Services & Solutions</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
              {departmentData.map((department, deptIndex) => (
                <div key={deptIndex}>
                  <Link
                    to={`/department/${department.slug}`}
                    className="group flex items-center gap-2 mb-3"
                  >
                    <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors tracking-tight">
                      {department.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <ul className="space-y-1.5 ml-1">
                    {department.services.map((service, serviceIndex) => (
                      <li key={serviceIndex}>
                        <Link
                          to={service.link || `/services/${department.slug}/${service.slug}`}
                          className="group/link flex items-center gap-1.5 text-gray-500 hover:text-brand-blue transition-all duration-200"
                        >
                          <span className="w-1 h-1 rounded-full bg-gray-300 group-hover/link:bg-brand-blue transition-colors flex-shrink-0"></span>
                          <span className="text-xs">{service.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links CTA */}
      <section className="py-16 bg-gray-50 dark:bg-black dark:border-gray-700 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Can't find what you're looking for?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Our team is here to help. Get in touch and we'll point you in the right direction.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1D1D1F] text-white font-medium rounded-full hover:scale-105 transition-all duration-300"
              >
                Contact Us
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-white font-medium rounded-full border border-gray-200 hover:scale-105 transition-all duration-300"
              >
                All Services
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sitemap;
