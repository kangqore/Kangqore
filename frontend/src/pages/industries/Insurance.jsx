import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import { ArrowRight, Shield, FileCheck, Users, Brain, LineChart, Umbrella } from 'lucide-react';

const Insurance = () => {
  const services = [
    { icon: FileCheck, title: 'Claims Processing', description: 'AI-automated claims processing for faster settlements and reduced fraud.' },
    { icon: Users, title: 'Customer Experience', description: 'Omnichannel platforms for seamless policyholder engagement.' },
    { icon: Brain, title: 'Underwriting AI', description: 'Machine learning models for intelligent risk assessment and pricing.' },
    { icon: LineChart, title: 'Actuarial Analytics', description: 'Advanced analytics for accurate risk modeling and forecasting.' },
    { icon: Shield, title: 'Fraud Detection', description: 'Real-time fraud prevention using predictive algorithms.' },
    { icon: Umbrella, title: 'Policy Management', description: 'Modern policy administration systems for all insurance lines.' }
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <PageHero
        badge="Insurance Industry"
        title="Insurance"
        titleHighlight="Solutions"
        description="Modernizing insurance operations with intelligent automation, data-driven insights, and customer-centric digital platforms."
        primaryButton={{ text: 'View Solutions', link: '#solutions' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '40%', label: 'Faster Claims', color: 'text-cyan-400' },
          { value: '30+', label: 'Insurance Firms', color: 'text-blue-400' },
          { value: '95%', label: 'Fraud Detection', color: 'text-emerald-400' },
          { value: '24/7', label: 'Support', color: 'text-purple-400' }
        ]}
      />

      {/* Services Grid */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Insurance Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Transform Your Insurance Business</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-black text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Insurance;
