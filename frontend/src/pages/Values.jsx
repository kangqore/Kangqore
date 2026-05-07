import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Lightbulb, Heart, Users, Trophy, BookOpen, TrendingUp, ChevronRight, Zap } from 'lucide-react';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';

const Values = () => {
  // Simple intersection observer for scroll animations
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current.disconnect();
  }, []);

  return (
    <div className="bg-white dark:bg-black overflow-hidden perspective-container">
      <SEO 
        title="Our Values — Purpose, Integrity & Excellence | Kangqore"
        description="Discover the 7 core values that define Kangqore: ownership, innovation, integrity, respect, excellence, learning, and long-term thinking. Built for lasting impact."
        keywords="Kangqore values, company culture, integrity, innovation, ownership, enterprise technology values"
        url="/values"
      />
      <style>{`
        .perspective-container {
          perspective: 1000px;
        }
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .card-3d:hover .card-inner {
          transform: rotateY(5deg) rotateX(2deg) scale(1.02);
        }
        .card-inner {
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
        }
        .floating-shape {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
        }
      `}</style>

      {/* HERO SECTION */}
      <PageHero
        badge="Our Values"
        title="The Kangqore"
        titleHighlight="Way"
        description="Principles that guide our decisions, shape our culture, and define how we build technology for a complex world."
        primaryButton={{ text: 'Our Services', link: '/services' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '7', label: 'Core Values', color: 'text-cyan-400' },
          { value: '100%', label: 'Accountability', color: 'text-blue-400' },
          { value: 'Every Day', label: 'Excellence', color: 'text-sky-400' },
          { value: 'Always', label: 'Integrity', color: 'text-brand-cyan' },
        ]}
      />

      {/* THE KANGQORE WAY - EXPANDED */}
      <section className="py-24 lg:py-32 relative">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-60 pointer-events-none"></div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-left w-full mb-6 scroll-animate">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 font-display">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-500 text-glow">Values That Define Us</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="md:col-span-12 lg:col-span-8 space-y-8 text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light scroll-animate" style={{ transitionDelay: '0.1s' }}>
              <p>
                At Kangqore, our values are not slogans on a wall or lines in a handbook.
                <strong className="text-gray-900 dark:text-white font-semibold block mt-2">
                  They are the principles that guide our decisions, shape our culture, and define how we design, engineer, and deliver technology.
                </strong>
              </p>
              
              <p>
                From the way we think about problems to the way we execute solutions, our values influence every layer of our organization — how we work with our clients, how we collaborate as a team, and how we hold ourselves accountable for outcomes.
              </p>
              
              <p>
                We operate in a world where technology, business models, and expectations evolve rapidly. In such an environment, tools and trends may change — <span className="text-brand-blue font-semibold">but values must remain constant</span>. They serve as our compass, helping us navigate complexity, make responsible decisions, and build systems that stand the test of time.
              </p>
            </div>
            
            <div className="md:col-span-12 lg:col-span-4 space-y-6 scroll-animate" style={{ transitionDelay: '0.2s' }}>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
                <Zap className="w-10 h-10 text-cyan-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Values in Action</h3>
                <p className="text-slate-300 leading-relaxed">
                  "At Kangqore, we believe meaningful impact is created when innovation is paired with discipline, ambition is backed by execution, and growth is guided by integrity."
                </p>
              </div>
              
              <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 shadow-xl relative overflow-hidden backdrop-blur-sm">
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "These values define not just what we do — but who we are, how we grow, and the legacy we are committed to creating."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PURPOSE, VISION, MISSION */}
      <section className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16 divide-y md:divide-y-0 md:divide-x divide-slate-800/50">
            {/* Purpose */}
            <div className="scroll-animate group pt-8 md:pt-0">
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-blue/20 text-brand-blue mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Our Purpose</h3>
              <p className="text-lg text-cyan-400 font-medium mb-4 leading-relaxed">
                To turn ambitious ideas into dependable, real-world technology systems.
              </p>
              <p className="text-slate-400 leading-relaxed font-light">
                We exist to bridge the gap between vision and execution — helping businesses, institutions, and innovators build with confidence, clarity, and long-term impact.
              </p>
            </div>

            {/* Vision */}
            <div className="scroll-animate group pt-12 md:pt-0 md:pl-12" style={{ transitionDelay: '0.1s' }}>
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Our Vision</h3>
              <p className="text-lg text-blue-400 font-medium mb-4 leading-relaxed">
                To shape the future by building technology systems that endure, scale, and matter.
              </p>
              <p className="text-slate-400 leading-relaxed font-light">
                We envision a world where technology is not just fast, but reliable; not just innovative, but responsible — and where globally relevant solutions are built from India for the world.
              </p>
            </div>

            {/* Mission */}
            <div className="scroll-animate group pt-12 md:pt-0 md:pl-12" style={{ transitionDelay: '0.2s' }}>
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Our Mission</h3>
              <p className="text-lg text-cyan-400 font-medium mb-4 leading-relaxed">
                To design, engineer, and deliver end-to-end technology solutions with complete ownership.
              </p>
              <p className="text-slate-400 leading-relaxed font-light">
                We take responsibility for the entire journey — from idea and architecture to execution, deployment, and long-term success.
              </p>
            </div>
          </div>

          <div className="mt-20 pt-1">
            <div className="scroll-animate">
              <h2 className="text-3xl font-bold text-white mb-8 text-left">
                We partner deeply with our clients to:
              </h2>
              <ul className="space-y-4 text-lg text-slate-300 font-light">
                <li className="flex items-start">
                  <span className="mr-3 text-brand-blue">•</span>
                  Solve complex, real-world problems
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-brand-blue">•</span>
                  Take accountability beyond delivery
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-brand-blue">•</span>
                  Build products, platforms, and infrastructures that perform in production — not just on paper
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* IMMERSIVE VALUES SECTIONS */}
      <div className="relative">
        <div className="absolute inset-0 bg-white dark:bg-black pointer-events-none"></div>

        {/* VALUE 1: Ownership & Accountability */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* 3D Image Card - Left */}
              <div className="card-3d relative scroll-animate">
                <div className="card-inner relative rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80" 
                    alt="Ownership and Accountability"
                    className="w-full aspect-[4/5] lg:aspect-square object-cover transform transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute bottom-8 left-8 right-8 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Shield className="w-12 h-12 text-white mb-4" />
                    <div className="h-1 w-12 bg-blue-500 rounded-full mb-4"></div>
                  </div>
                </div>
                {/* Floating decorative elements */}
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl floating-shape"></div>
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl floating-shape" style={{ animationDelay: '2s' }}></div>
              </div>

              {/* Text Content */}
              <div className="scroll-animate" style={{ transitionDelay: '0.2s' }}>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                  Ownership & <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2564ea] to-[#3b82f6]">Accountability</span>
                </h2>
                <div className="space-y-6 text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                  <p>
                    We take complete ownership of what we build — from idea to outcome. <span className="text-gray-900 dark:text-white font-medium">We don't pass responsibility; we stand by results.</span>
                  </p>
                  <p className="border-l-4 border-blue-500 pl-6 text-gray-800 dark:text-gray-50 italic">
                    "Accountability is not a role — it's a mindset."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE 2: Innovation With Purpose */}
        <section className="py-24 lg:py-32 relative overflow-hidden bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Text Content - Left */}
              <div className="order-2 lg:order-1 scroll-animate">
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                  Innovation With <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9]">Purpose</span>
                </h2>
                <div className="space-y-6 text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                  <p>
                    We embrace change, emerging technologies, and new ways of thinking — not for hype, but to solve real problems and create lasting value.
                  </p>
                  <p className="border-l-4 border-sky-500 pl-6 text-gray-800 dark:text-gray-50 italic">
                    "Innovation at Kangqore is practical, purposeful, and impact-driven."
                  </p>
                </div>
              </div>

              {/* 3D Image Card - Right */}
              <div className="order-1 lg:order-2 card-3d relative scroll-animate" style={{ transitionDelay: '0.2s' }}>
                <div className="card-inner relative rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80" 
                    alt="Innovation With Purpose"
                    className="w-full aspect-[4/5] lg:aspect-square object-cover transform transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute bottom-8 left-8 right-8 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Lightbulb className="w-12 h-12 text-white mb-4" />
                    <div className="h-1 w-12 bg-sky-500 rounded-full mb-4"></div>
                  </div>
                </div>
                {/* Floating decorative elements */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-sky-400/20 rounded-full blur-2xl floating-shape"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl floating-shape" style={{ animationDelay: '3s' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE 3: Integrity */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* 3D Image Card - Left */}
              <div className="card-3d relative scroll-animate">
                <div className="card-inner relative rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80" 
                    alt="Integrity"
                    className="w-full aspect-[4/5] lg:aspect-square object-cover transform transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute bottom-8 left-8 right-8 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Heart className="w-12 h-12 text-white mb-4" />
                    <div className="h-1 w-12 bg-cyan-500 rounded-full mb-4"></div>
                  </div>
                </div>
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl floating-shape"></div>
              </div>

              {/* Text Content */}
              <div className="scroll-animate" style={{ transitionDelay: '0.2s' }}>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                  Integrity in <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#4ab6d4]">Everything</span>
                </h2>
                <div className="space-y-6 text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                  <p>
                    We act with honesty, transparency, and authenticity — with our clients, our partners, and each other.
                  </p>
                  <p className="border-l-4 border-cyan-500 pl-6 text-gray-800 dark:text-gray-50 italic">
                    "Trust is earned through consistent actions, not promises."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE 4: Respect */}
        <section className="py-24 lg:py-32 relative overflow-hidden bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Text Content */}
              <div className="order-2 lg:order-1 scroll-animate">
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                  Respect for <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">People & Ideas</span>
                </h2>
                <div className="space-y-6 text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                  <p>
                    We value every individual and every idea. Diverse perspectives, open dialogue, and mutual respect are fundamental to how we collaborate and grow.
                  </p>
                  <p className="border-l-4 border-cyan-500 pl-6 text-gray-800 dark:text-gray-50 italic">
                    "Success at Kangqore is always shared."
                  </p>
                </div>
              </div>

              {/* 3D Image Card */}
              <div className="order-1 lg:order-2 card-3d relative scroll-animate" style={{ transitionDelay: '0.2s' }}>
                <div className="card-inner relative rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80" 
                    alt="Respect"
                    className="w-full aspect-[4/5] lg:aspect-square object-cover transform transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute bottom-8 left-8 right-8 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Users className="w-12 h-12 text-white mb-4" />
                    <div className="h-1 w-12 bg-cyan-500 rounded-full mb-4"></div>
                  </div>
                </div>
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl floating-shape"></div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE 5: Excellence */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* 3D Image Card */}
              <div className="card-3d relative scroll-animate">
                <div className="card-inner relative rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80" 
                    alt="Excellence"
                    className="w-full aspect-[4/5] lg:aspect-square object-cover transform transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute bottom-8 left-8 right-8 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Trophy className="w-12 h-12 text-white mb-4" />
                    <div className="h-1 w-12 bg-[#0ea5e9] rounded-full mb-4"></div>
                  </div>
                </div>
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-sky-400/20 rounded-full blur-2xl floating-shape"></div>
              </div>

              {/* Text Content */}
              <div className="scroll-animate" style={{ transitionDelay: '0.2s' }}>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                  Excellence Through <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e40af] to-[#2564ea]">Execution</span>
                </h2>
                <div className="space-y-6 text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                  <p>
                    We strive for high standards — in engineering, design, delivery, and communication.
                  </p>
                  <p className="border-l-4 border-blue-600 pl-6 text-gray-800 dark:text-gray-50 italic">
                    "Excellence is not about perfection; it's about discipline, accountability, and continuous improvement."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE 6: Learning */}
        <section className="py-24 lg:py-32 relative overflow-hidden bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Text Content */}
              <div className="order-2 lg:order-1 scroll-animate">
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                   Continuous <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2564ea] to-[#0ea5e9]">Learning</span>
                </h2>
                <div className="space-y-6 text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                  <p>
                    Technology never stands still — and neither do we.
                  </p>
                  <p className="border-l-4 border-blue-500 pl-6 text-gray-800 dark:text-gray-50 italic">
                    "We stay curious, challenge ourselves, learn fast, and share what we know, building collective intelligence across the organization."
                  </p>
                </div>
              </div>

              {/* 3D Image Card */}
              <div className="order-1 lg:order-2 card-3d relative scroll-animate" style={{ transitionDelay: '0.2s' }}>
                <div className="card-inner relative rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80" 
                    alt="Continuous Learning"
                    className="w-full aspect-[4/5] lg:aspect-square object-cover transform transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute bottom-8 left-8 right-8 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <BookOpen className="w-12 h-12 text-white mb-4" />
                    <div className="h-1 w-12 bg-blue-500 rounded-full mb-4"></div>
                  </div>
                </div>
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl floating-shape"></div>
              </div>
            </div>
          </div>
        </section>

        {/* VALUE 7: Long Term */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* 3D Image Card */}
              <div className="card-3d relative scroll-animate">
                <div className="card-inner relative rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80" 
                    alt="Long Term"
                    className="w-full aspect-[4/5] lg:aspect-square object-cover transform transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute bottom-8 left-8 right-8 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <TrendingUp className="w-12 h-12 text-white mb-4" />
                    <div className="h-1 w-12 bg-brand-cyan rounded-full mb-4"></div>
                  </div>
                </div>
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl floating-shape"></div>
              </div>

              {/* Text Content */}
              <div className="scroll-animate" style={{ transitionDelay: '0.2s' }}>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                  Building for the <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#4ab6d4]">Long Term</span>
                </h2>
                <div className="space-y-6 text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                  <p>
                    We think beyond short-term wins.
                  </p>
                  <p className="border-l-4 border-brand-cyan pl-6 text-gray-800 dark:text-gray-50 italic">
                    "Every decision we make is measured by its long-term impact on people, products, and platforms."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FINAL CTA - Enhanced with Glassmorphism */}
      <section className="py-32 relative bg-brand-gradient overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white dark:bg-black/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="w-full scroll-animate">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight whitespace-normal lg:whitespace-nowrap">
              Join a team that lives by these values
            </h2>
            <p className="text-xl text-blue-50 leading-relaxed mb-12 max-w-3xl mx-auto font-light">
              At Kangqore, we don't just talk about values — we embody them in everything we do.<br className="hidden md:block" /> If these principles resonate with you, we'd love to have you on our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/careers"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-bold rounded-full overflow-hidden shadow-lg transition-all transform hover:scale-105 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <span className="relative z-10">Explore Careers</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/about-us"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800/20 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white dark:bg-gray-900 dark:border-gray-800/30 transition-colors"
              >
                Learn About Us
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Values;
