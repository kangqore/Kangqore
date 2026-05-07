import React from 'react';
import { Users, Award, Globe, Heart } from 'lucide-react';
import PageHero from '../components/PageHero';

const Team = () => {
  const heroStats = [
    { value: '200+', label: 'Team Members', color: 'text-cyan-400' },
    { value: '40+', label: 'Countries', color: 'text-blue-400' },
    { value: '500+', label: 'Certifications', color: 'text-emerald-400' },
    { value: '95%', label: 'Employee Satisfaction', color: 'text-purple-400' },
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Team Members' },
    { icon: Globe, value: '40+', label: 'Countries' },
    { icon: Award, value: '500+', label: 'Certifications' },
    { icon: Heart, value: '95%', label: 'Employee Satisfaction' },
  ];

  const departments = [
    'Engineering', 'Product', 'Design', 'Data Science', 
    'Cloud & DevOps', 'Consulting', 'Sales', 'Marketing', 
    'Human Resources', 'Finance'
  ];

  return (
    <div className="bg-white dark:bg-black">
      <PageHero
        badge="Our Team"
        title="Meet the talented individuals who make Kangqore"
        titleHighlight="a leader in digital transformation"
        description="Our diverse team of experts brings together deep technical knowledge, creative problem-solving, and a passion for innovation to deliver exceptional results for our clients."
        primaryButton={{ text: 'Join Our Team', link: '/careers' }}
        secondaryButton={{ text: 'View Careers', link: '/careers' }}
        stats={heroStats}
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Our Departments</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {departments.map((dept) => (
              <span
                key={dept}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 font-medium hover:bg-brand-gradient hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;