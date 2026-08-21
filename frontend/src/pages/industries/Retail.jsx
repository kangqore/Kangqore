import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import { ArrowRight, ShoppingCart, Store, Truck, BarChart3, Users, Sparkles } from 'lucide-react';

const Retail = () => {
  const services = [
    { icon: ShoppingCart, title: 'E-Commerce', description: 'Scalable e-commerce platforms with personalized shopping experiences.' },
    { icon: Store, title: 'Unified Commerce', description: 'Seamless omnichannel retail solutions connecting online and offline.' },
    { icon: Truck, title: 'Supply Chain', description: 'Intelligent supply chain and inventory management systems.' },
    { icon: BarChart3, title: 'Retail Analytics', description: 'Data-driven insights for merchandising and customer behavior.' },
    { icon: Users, title: 'Customer Loyalty', description: 'CRM and loyalty programs that drive repeat purchases.' },
    { icon: Sparkles, title: 'AI Personalization', description: 'AI-powered product recommendations and dynamic pricing.' }
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <PageHero
        badge="Retail Industry"
        title="Retail"
        titleHighlight="Transformation"
        description="Transforming operations with digital innovation, automation, and data-driven insights for competitive advantage."
        primaryButton={{ text: 'View Solutions', link: '#solutions' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '200+', label: 'Retail Clients', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          { value: '50M+', label: 'Transactions', color: 'text-blue-400' },
          { value: '35%', label: 'Sales Increase', color: 'text-emerald-400' },
          { value: '24/7', label: 'Operations', color: 'text-purple-400' }
        ]}
      />

      {/* Services Grid */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Retail Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Transform Your Retail Business</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-black text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Retail;
