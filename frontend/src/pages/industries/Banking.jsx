import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import { ArrowRight, Building2, Shield, TrendingUp, Smartphone, CreditCard, PiggyBank } from 'lucide-react';

const Banking = () => {
  const services = [
    { icon: Shield, title: 'Digital Security', description: 'Advanced cybersecurity solutions to protect financial assets and customer data.' },
    { icon: TrendingUp, title: 'Risk Analytics', description: 'AI-powered risk assessment and fraud detection systems.' },
    { icon: Smartphone, title: 'Mobile Banking', description: 'Next-generation mobile banking platforms for seamless customer experiences.' },
    { icon: CreditCard, title: 'Payment Solutions', description: 'Modern payment processing and digital wallet integrations.' },
    { icon: PiggyBank, title: 'Wealth Management', description: 'Intelligent investment platforms and robo-advisory services.' },
    { icon: Building2, title: 'Core Banking', description: 'Cloud-native core banking transformation solutions.' }
  ];

  return (
    <div className="bg-white dark:bg-black">
      <PageHero
        badge="Financial Services"
        title="Banking &"
        titleHighlight="Financial Services"
        description="Transforming financial institutions with innovative digital solutions, AI-driven insights, and secure cloud platforms."
        primaryButton={{ text: 'View Solutions', link: '#solutions' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '50+', label: 'Banking Clients', color: 'text-cyan-400' },
          { value: '99.9%', label: 'Uptime SLA', color: 'text-blue-400' },
          { value: '$2B+', label: 'Transactions Daily', color: 'text-emerald-400' },
          { value: 'SOC 2', label: 'Certified', color: 'text-purple-400' },
        ]}
      />

      {/* Services Grid */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Banking Solutions</h2>
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
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Banking Operations?</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-black text-brand-blue px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Banking;
