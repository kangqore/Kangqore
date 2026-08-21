import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import { ArrowRight, Tv, Play, Radio, Smartphone, Cloud, Sparkles } from 'lucide-react';

const MediaTechnology = () => {
  const services = [
    { icon: Play, title: 'Streaming Platforms', description: 'Scalable video streaming and OTT platform development.' },
    { icon: Radio, title: 'Content Distribution', description: 'Multi-channel content delivery and management solutions.' },
    { icon: Sparkles, title: 'AI Content', description: 'AI-powered content creation, recommendation, and personalization.' },
    { icon: Smartphone, title: 'Digital Experience', description: 'Immersive digital experiences across all platforms and devices.' },
    { icon: Cloud, title: 'Cloud Media', description: 'Cloud-native media workflows and asset management.' },
    { icon: Tv, title: 'AdTech Solutions', description: 'Programmatic advertising and audience analytics platforms.' }
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <PageHero
        badge="Media & Technology"
        title="Media &"
        titleHighlight="Technology"
        description="Transforming operations with digital innovation, automation, and data-driven insights for competitive advantage."
        primaryButton={{ text: 'View Solutions', link: '#solutions' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '100M+', label: 'Users Reached', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          { value: '50+', label: 'Media Clients', color: 'text-blue-400' },
          { value: '5B+', label: 'Content Streams', color: 'text-emerald-400' },
          { value: '99.9%', label: 'Availability', color: 'text-purple-400' }
        ]}
      />

      {/* Services Grid */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Media & Technology Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <section className="py-24 bg-gradient-to-r from-orange-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Transform Your Media Business</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-black text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MediaTechnology;
