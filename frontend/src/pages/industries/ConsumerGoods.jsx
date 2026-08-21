import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import { ArrowRight, Package, Truck, BarChart3, Users, Sparkles, ShoppingBag } from 'lucide-react';

const ConsumerGoods = () => {
  const services = [
    { icon: Package, title: 'Product Innovation', description: 'Digital product development and innovation platforms.' },
    { icon: Truck, title: 'Supply Chain', description: 'End-to-end supply chain visibility and optimization.' },
    { icon: BarChart3, title: 'Consumer Analytics', description: 'Data-driven insights into consumer behavior and trends.' },
    { icon: Users, title: 'Direct-to-Consumer', description: 'D2C platform development and customer engagement.' },
    { icon: Sparkles, title: 'Brand Experience', description: 'Digital marketing and brand management solutions.' },
    { icon: ShoppingBag, title: 'Trade Promotion', description: 'Trade promotion management and retail execution.' }
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <PageHero
        badge="Consumer Goods"
        title="Consumer"
        titleHighlight="Goods"
        description="Transforming operations with digital innovation, automation, and data-driven insights for competitive advantage."
        primaryButton={{ text: 'View Solutions', link: '#solutions' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '200+', label: 'Brands', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          { value: '50M+', label: 'Consumers', color: 'text-blue-400' },
          { value: '45%', label: 'Market Growth', color: 'text-emerald-400' },
          { value: 'Global', label: 'Distribution', color: 'text-purple-400' }
        ]}
      />

      {/* Services Grid */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Consumer Goods Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-fuchsia-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <section className="py-24 bg-gradient-to-r from-rose-600 to-fuchsia-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Transform Your Consumer Goods Business</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-black text-rose-600 px-8 py-4 rounded-full font-semibold hover:bg-rose-50 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ConsumerGoods;
