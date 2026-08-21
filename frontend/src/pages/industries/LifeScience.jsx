import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import { ArrowRight, FlaskConical, Microscope, Pill, FileSearch, Database, Dna } from 'lucide-react';

const LifeScience = () => {
  const services = [
    { icon: Microscope, title: 'R&D Acceleration', description: 'Digital solutions to accelerate drug discovery and development.' },
    { icon: Pill, title: 'Clinical Trials', description: 'AI-powered clinical trial management and patient recruitment.' },
    { icon: FileSearch, title: 'Regulatory Compliance', description: 'Automated compliance solutions for FDA and global regulations.' },
    { icon: Database, title: 'Data Management', description: 'Secure, compliant data platforms for research and operations.' },
    { icon: Dna, title: 'Genomics Analytics', description: 'Advanced genomic analysis and personalized medicine solutions.' },
    { icon: FlaskConical, title: 'Manufacturing', description: 'Smart manufacturing and supply chain optimization.' }
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <PageHero
        badge="Life Sciences"
        title="Life Science"
        titleHighlight="Innovation"
        description="Transforming operations with digital innovation, automation, and data-driven insights for competitive advantage."
        primaryButton={{ text: 'View Solutions', link: '#solutions' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '50+', label: 'Research Labs', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          { value: 'FDA', label: 'Compliant', color: 'text-blue-400' },
          { value: '10+', label: 'Drug Discovery Projects', color: 'text-emerald-400' },
          { value: '99.9%', label: 'Data Accuracy', color: 'text-purple-400' }
        ]}
      />

      {/* Services Grid */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Life Sciences Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-fuchsia-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <section className="py-24 bg-gradient-to-r from-purple-600 to-fuchsia-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Accelerate Your Life Sciences Innovation</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-black text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LifeScience;
