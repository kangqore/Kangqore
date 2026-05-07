import React from 'react';
import { MapPin, Phone, Clock, Globe, Zap, Headphones } from 'lucide-react';
import PageHero from '../components/PageHero';

const Location = () => {
  const deliveryCenters = [
    { 
      city: 'Bengaluru', 
      country: 'India', 
      address: 'Primary Delivery & Engineering Hub', 
      phone: '+91 80 XXXX XXXX', 
      type: 'Primary Delivery Center',
      services: [
        'Product Engineering',
        'AI & Platform Development',
        'Cloud, DevOps & Cybersecurity'
      ],
      hours: 'Mon–Fri | 9:00 AM – 6:00 PM IST'
    },
    { 
      city: 'Jamshedpur', 
      country: 'India', 
      address: 'Operations & Extended Delivery Center', 
      phone: '+91 657 XXXX XXXX', 
      type: 'Operations Center',
      services: [
        'QA & Automation',
        'Infrastructure & Managed Services',
        'Support & Operations'
      ],
      hours: 'Mon–Fri | 9:00 AM – 6:00 PM IST'
    },
  ];

  return (
    <div className="bg-white dark:bg-black">
      <PageHero
        badge="Global Delivery Model"
        title="Our Presence: India-Based. Globally Delivered."
        titleHighlight="India-Based"
        description="Kangqore operates from its delivery centers in Bengaluru and Jamshedpur, serving enterprises and institutions across North America, Europe, Middle East, and APAC through a global-first delivery model. We combine local engineering depth with global execution standards."
        primaryButton={{ text: 'Contact Us', link: '/contact' }}
        secondaryButton={{ text: 'Explore Our Services', link: '/services' }}
        stats={[
          { value: 'Global', label: 'Clients Served', sublabel: 'Across Americas, Europe, Middle East & APAC', color: 'text-cyan-400' },
          { value: '2', label: 'India-Based Delivery Centers', sublabel: 'Bengaluru & Jamshedpur', color: 'text-blue-400' },
          { value: 'Timezone', label: 'Aligned Execution', sublabel: 'Follow-the-sun delivery model', color: 'text-emerald-400' },
          { value: '24/7', label: 'Remote Support', sublabel: 'Always-on engineering & operations', color: 'text-purple-400' },
        ]}
      />

      {/* Delivery Locations Section */}
      <section className="py-24 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Delivery Locations</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our engineering, architecture, and delivery teams operate from India, enabling us to support global clients with speed, scale, and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {deliveryCenters.map((center, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="inline-block px-3 py-1 bg-blue-100 text-brand-blue text-sm font-medium rounded-full mb-4">{center.type}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{center.city}</h3>
                <p className="text-brand-blue font-medium mb-4">{center.country}</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{center.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{center.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{center.hours}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Key Services</h4>
                  <ul className="space-y-2">
                    {center.services.map((service, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-blue mt-1">•</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Coverage Without Offices Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Global Coverage. No Physical Borders.</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Kangqore follows a cloud-native, remote-first delivery model that allows us to serve global clients without the overhead of physical offices in every geography.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-8 rounded-2xl shadow-lg mb-12">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                Our teams collaborate across time zones, integrate seamlessly with client environments, and deliver outcomes aligned with regional compliance, security, and operational standards.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Faster Execution</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Agile, distributed teams delivering at speed</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Lower Operational Friction</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">No geographic constraints, seamless collaboration</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Higher Engineering Focus</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Resources dedicated to delivery, not real estate</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Cost-Efficient Global Delivery</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enterprise-grade service without premium overhead</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-gradient text-white p-8 rounded-2xl text-center">
              <h3 className="text-2xl font-bold mb-3">Ready to Experience Global Delivery Excellence?</h3>
              <p className="text-blue-100 mb-6">Let's discuss how our India-based teams can accelerate your global initiatives.</p>
              <div className="flex gap-4 justify-center">
                <a href="/contact" className="px-6 py-3 bg-white dark:bg-black text-brand-blue rounded-lg font-semibold hover:bg-blue-50 transition">
                  Contact Us
                </a>
                <a href="/services" className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition border border-brand-blue">
                  View Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Location;
