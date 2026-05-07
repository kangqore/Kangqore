import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import { ArrowRight, Zap, Sun, Leaf, BarChart3, Settings, Grid3X3 } from 'lucide-react';

const EnergyUtilities = () => {
  const services = [
    { icon: Grid3X3, title: 'Smart Grid', description: 'Intelligent grid management and distribution optimization.' },
    { icon: Sun, title: 'Renewable Energy', description: 'Solar, wind, and clean energy management solutions.' },
    { icon: Leaf, title: 'Sustainability', description: 'Carbon tracking and environmental compliance platforms.' },
    { icon: BarChart3, title: 'Energy Analytics', description: 'Predictive analytics for demand forecasting and optimization.' },
    { icon: Settings, title: 'Asset Management', description: 'IoT-enabled asset monitoring and predictive maintenance.' },
    { icon: Zap, title: 'Customer Platforms', description: 'Digital customer engagement and billing solutions.' }
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <PageHero
        badge="Energy & Utilities"
        title="Energy &"
        titleHighlight="Utilities"
        description="Transforming operations with digital innovation, automation, and data-driven insights for competitive advantage."
        primaryButton={{ text: 'View Solutions', link: '#solutions' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '50+', label: 'Utility Clients', color: 'text-cyan-400' },
          { value: '100M+', label: 'Meters Managed', color: 'text-blue-400' },
          { value: '30%', label: 'Cost Reduction', color: 'text-emerald-400' },
          { value: 'Smart', label: 'Grid Ready', color: 'text-purple-400' }
        ]}
      />

      {/* Services Grid */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Energy & Utilities Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <section className="py-24 bg-gradient-to-r from-yellow-600 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Power Your Digital Transformation</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-black text-yellow-600 px-8 py-4 rounded-full font-semibold hover:bg-yellow-50 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default EnergyUtilities;
