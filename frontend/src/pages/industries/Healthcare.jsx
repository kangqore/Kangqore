import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import { ArrowRight, Heart, Stethoscope, FileText, Users, Brain, Activity } from 'lucide-react';

const Healthcare = () => {
  const services = [
    { icon: Stethoscope, title: 'Telehealth', description: 'Virtual care platforms enabling remote patient consultations.' },
    { icon: FileText, title: 'EHR Systems', description: 'Modern electronic health record solutions for seamless care coordination.' },
    { icon: Brain, title: 'Clinical AI', description: 'AI-powered diagnostics and clinical decision support systems.' },
    { icon: Users, title: 'Patient Engagement', description: 'Digital platforms for improved patient experience and outcomes.' },
    { icon: Activity, title: 'Health Analytics', description: 'Population health management and predictive analytics solutions.' },
    { icon: Heart, title: 'Care Management', description: 'Integrated care coordination and chronic disease management.' }
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <PageHero
        badge="Healthcare Solutions"
        title="Healthcare"
        titleHighlight="Innovation"
        description="Empowering healthcare providers with digital solutions that improve patient outcomes and operational efficiency."
        primaryButton={{ text: 'View Solutions', link: '#solutions' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '100+', label: 'Healthcare Clients', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          { value: '5M+', label: 'Patients Served', color: 'text-blue-400' },
          { value: 'HIPAA', label: 'Compliant', color: 'text-emerald-400' },
          { value: '99.9%', label: 'System Uptime', color: 'text-purple-400' }
        ]}
      />

      {/* Services Grid */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Healthcare Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <section className="py-24 bg-gradient-to-r from-red-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Transform Healthcare Delivery</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-black text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-red-50 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Healthcare;
