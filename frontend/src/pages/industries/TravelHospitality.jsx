import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import { ArrowRight, Plane, Hotel, MapPin, Calendar, Star, Smartphone } from 'lucide-react';

const TravelHospitality = () => {
  const services = [
    { icon: Plane, title: 'Booking Platforms', description: 'Seamless travel booking and reservation management systems.' },
    { icon: Hotel, title: 'Property Management', description: 'Integrated PMS solutions for hotels and hospitality businesses.' },
    { icon: MapPin, title: 'Travel Experience', description: 'Personalized travel planning and itinerary management.' },
    { icon: Calendar, title: 'Revenue Management', description: 'Dynamic pricing and yield optimization solutions.' },
    { icon: Star, title: 'Guest Experience', description: 'Digital guest services and contactless hospitality solutions.' },
    { icon: Smartphone, title: 'Mobile Solutions', description: 'Mobile apps for travelers and hospitality staff.' }
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <PageHero
        badge="Travel & Hospitality"
        title="Travel &"
        titleHighlight="Hospitality"
        description="Transforming operations with digital innovation, automation, and data-driven insights for competitive advantage."
        primaryButton={{ text: 'View Solutions', link: '#solutions' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '100+', label: 'Travel Partners', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          { value: '10M+', label: 'Bookings', color: 'text-blue-400' },
          { value: '40%', label: 'Efficiency Gain', color: 'text-emerald-400' },
          { value: 'Global', label: 'Reach', color: 'text-purple-400' }
        ]}
      />

      {/* Services Grid */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Travel & Hospitality Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-600 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <section className="py-24 bg-gradient-to-r from-sky-600 to-indigo-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Transform Your Travel Business</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-black text-sky-600 px-8 py-4 rounded-full font-semibold hover:bg-sky-50 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TravelHospitality;
