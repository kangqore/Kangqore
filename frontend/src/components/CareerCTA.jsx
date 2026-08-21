import React from 'react';
import { Briefcase, Users, Globe, Zap, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const CareerCTA = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ once: true, threshold: 0.2 });

  const benefits = [
    {
      icon: Users,
      title: 'Startup Environment',
      description: 'High ownership, fast learning, real responsibility from day one.'
    },
    {
      icon: Globe,
      title: 'Enterprise Grade Work',
      description: 'Solve complex problems across AI, cloud, data, and transformation.'
    },
    {
      icon: Zap,
      title: 'India Centered, Globally Aware',
      description: 'Teams in Bengaluru & Jamshedpur, building for enterprise needs.'
    }
  ];

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div 
          ref={sectionRef}
          className={`transition-all duration-1000 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Main Career Banner */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/80 to-blue-900/40"></div>
            </div>
            
            {/* Content */}
            <div className="relative grid lg:grid-cols-2 gap-8 items-center min-h-[500px]">
              {/* Left - Text Content */}
              <div className="p-10 lg:p-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-brand-cyan rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent font-semibold tracking-wider uppercase">Careers</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Drive your career{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    forward
                  </span>
                  . Fast.
                </h2>
                
                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                  At Kangqore, you won’t just work on projects you’ll help build platforms, systems, and capabilities that power real enterprises. We’re a growing technology company building from India, with teams in Bengaluru and Jamshedpur, focused on AI, cloud, data, and large scale transformation.
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {benefits.map((benefit, index) => {
                    const IconComponent = benefit.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="w-10 h-10 bg-white dark:bg-black/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <IconComponent className="w-5 h-5 text-[#2564ea]" />
                        </div>
                        <p className="text-white font-bold text-sm">{benefit.title}</p>
                        <p className="text-white/70 text-xs">{benefit.description}</p>
                      </div>
                    );
                  })}
                </div>
                
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-blue-900 font-semibold rounded-lg hover:bg-cyan-400 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Join the Kangqore Team
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              {/* Right - Stats/Highlights */}
              <div className="hidden lg:flex flex-col justify-center p-10 lg:p-16">
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h3 className="text-5xl font-bold text-white mb-2">Small Teams, Big Impact</h3>
                    <p className="text-white/80">Work closely with senior engineers, architects, and founders.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h3 className="text-5xl font-bold bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent mb-2">Continuous Learning</h3>
                    <p className="text-white/80">Hands-on exposure to real enterprise systems and AI platforms.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h3 className="text-5xl font-bold text-white mb-2">Career Acceleration</h3>
                    <p className="text-white/80">Your growth compounds as the company grows.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Categories */}
          <div className="mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {['Engineering', 'Data & AI', 'Consulting', 'Design'].map((category, index) => (
              <a
                key={index}
                href="#"
                className="group bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:bg-brand-gradient rounded-xl p-6 text-center transition-all duration-300 border border-gray-200 hover:border-transparent hover:shadow-lg"
              >
                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-white mb-1">{category}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/80">View openings →</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerCTA;
