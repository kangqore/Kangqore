import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import { ArrowRight, GraduationCap, BookOpen, Monitor, Users, Brain, Award } from 'lucide-react';

const EdTech = () => {
  const services = [
    { icon: Monitor, title: 'Learning Platforms', description: 'Custom LMS and e-learning platform development for modern education.' },
    { icon: Brain, title: 'AI Tutoring', description: 'Intelligent tutoring systems with adaptive learning capabilities.' },
    { icon: Users, title: 'Collaboration Tools', description: 'Virtual classroom and student collaboration solutions.' },
    { icon: BookOpen, title: 'Content Management', description: 'Digital content creation and curriculum management systems.' },
    { icon: Award, title: 'Assessment Systems', description: 'Automated grading and proctoring solutions for online exams.' },
    { icon: GraduationCap, title: 'Student Success', description: 'Analytics-driven student engagement and retention platforms.' }
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <PageHero
        badge="Education Technology"
        title="EdTech"
        titleHighlight="Innovation"
        description="Revolutionizing education through technology with immersive learning experiences and intelligent educational platforms."
        primaryButton={{ text: 'View Solutions', link: '#solutions' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '10M+', label: 'Students Reached', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          { value: '500+', label: 'Institutions', color: 'text-blue-400' },
          { value: '95%', label: 'Engagement Rate', color: 'text-emerald-400' },
          { value: '50+', label: 'Countries', color: 'text-purple-400' }
        ]}
      />

      {/* Services Grid */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our EdTech Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="p-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <section className="py-24 bg-gradient-to-r from-green-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Transform Education with Technology</h2>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-black text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default EdTech;
