import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, Users, Brain, Target, Heart, ChevronRight, Briefcase, Globe } from 'lucide-react';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import SecondaryButton from '../components/ui/SecondaryButton';
import { coreSEO } from '../data/seoData';

const OurCulture = () => {
  return (
    <div className="bg-white dark:bg-black">
      <SEO 
        title="Our Culture | Kangqore"
        description="Join a team of visionaries, engineers, and creators. Discover the culture of impact, ingenuity, and collaboration at Kangqore."
        keywords="Kangqore culture, engineering culture, work life, tech jobs India, innovation team"
        url="https://kangqore.com/culture"
      />
      {/* HERO SECTION */}
      <PageHero
        badge="Our Culture"
        title="Building a Culture of"
        titleHighlight="Impact and Ingenuity"
        description="We are a collective of creators, problem-solvers, and visionaries engineering digital products that scale globally. Our culture is built on ownership, continuous learning, and zero distance to impact."
        primaryButton={{ text: 'Explore Careers', link: '/careers' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '30+', label: 'Core Builders', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          { value: '61', label: 'Active Services', color: 'text-blue-400' },
          { value: '15', label: 'Tech Departments', color: 'text-emerald-400' },
        ]}
      />

      {/* CORE PHILOSOPHY SECTION */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white mb-8">
                We are an <span className="text-transparent bg-clip-text bg-brand-gradient italic">early-stage team</span> building bold products.
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  At Kangqore, culture isn't just about perks—it's about the problems we solve and the way we solve them. We prioritize technical excellence, pragmatic thinking, and a "people-first" delivery model.
                </p>
                <p>
                  Our team is distributed yet deeply connected, with a presence in Bengaluru and Jamshedpur, and a growing global footprint. We align our goals with our partners to deliver seamless collaboration and faster execution.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Fast Iteration
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent dark:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent rounded-full text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  Ownership Culture
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                  <Globe className="w-4 h-4" />
                  Global Ambition
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80" 
                  alt="Kangqore Team" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating element */}
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 max-w-xs hidden sm:block">
                <p className="text-gray-600 dark:text-gray-400 italic text-sm">
                  "We bridge the gap between technology potential and real-world business execution."
                </p>
                <p className="mt-4 font-bold text-gray-900 dark:text-white text-sm">— Team Kangqore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES GRID */}
      <section className="py-24 lg:py-32 bg-gray-50 dark:bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">What we live by</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our values guide our decisions, our interactions, and the way we build digital systems.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Engineering Ingenuity</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We believe in deep expertise across AI, cloud, and modern engineering practices.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#2564ea]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Pragmatic Philosophy</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We design with real-world constraints—budget, risk, and legacy environments.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Zero Distance</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Close collaboration, absolute transparency, and shared goals with our partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 lg:py-32 bg-brand-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl sm:text-5xl font-bold mb-8 italic">Ready to build the future with us?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12 leading-relaxed">
            We're looking for visionaries who want to solve the world's most complex challenges through engineering and intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/careers" 
              className="px-10 py-4 bg-white text-brand-blue font-bold rounded-full hover:bg-blue-50 transition-all shadow-xl hover:scale-105"
            >
              See Openings
            </Link>
            <SecondaryButton 
              text="Our Services" 
              link="/services" 
              theme="glass" 
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurCulture;
