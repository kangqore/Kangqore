import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import { ArrowRight, Database, Search, FileText, Lock, Cloud, Layers } from 'lucide-react';

const InformationServices = () => {
  const services = [
    { icon: Database, title: 'Data Management', description: 'Enterprise data platforms and information governance solutions.' },
    { icon: Search, title: 'Search & Discovery', description: 'Intelligent search and knowledge discovery systems.' },
    { icon: FileText, title: 'Content Services', description: 'Document management and content automation platforms.' },
    { icon: Lock, title: 'Data Security', description: 'Information security and privacy compliance solutions.' },
    { icon: Cloud, title: 'Cloud Services', description: 'Cloud migration and managed information services.' },
    { icon: Layers, title: 'Integration', description: 'API management and data integration solutions.' }
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <PageHero
        badge="Information Services"
        title="Information"
        titleHighlight="Services"
        description="Transforming operations with digital innovation, automation, and data-driven insights for competitive advantage."
        primaryButton={{ text: 'View Solutions', link: '#solutions' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '100+', label: 'Enterprise Clients', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          { value: '1PB+', label: 'Data Processed', color: 'text-blue-400' },
          { value: '99.9%', label: 'Uptime', color: 'text-emerald-400' },
          { value: 'Real-time', label: 'Analytics', color: 'text-purple-400' }
        ]}
      />

      {/* Services Grid */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Information Services Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-brand-gradient rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Transform Your Information Strategy</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-black text-brand-blue px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default InformationServices;
