import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, Users, Leaf, Brain, Target, Globe, Heart, ChevronRight, Play } from 'lucide-react';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * numericValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [numericValue, duration]);

  return <>{count}{suffix}</>;
};

const FadeInSection = ({ children, className = "", delay = "0ms" }) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1, once: true });
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen text-gray-900 overflow-hidden selection:bg-cyan-500/30 transition-colors duration-500">
      <SEO 
        title={coreSEO.aboutUs.title}
        description={coreSEO.aboutUs.description}
        keywords={coreSEO.aboutUs.keywords}
        url={coreSEO.aboutUs.url}
        schemas={[{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Kangqore",
          "url": "https://kangqore.com/about-us",
          "description": coreSEO.aboutUs.description,
          "mainEntity": {
            "@type": "Organization",
            "name": "Kangqore",
            "url": "https://kangqore.com"
          }
        }]}
      />

      {/* ── HERO SECTION & STRIP ── */}
      <div className="w-full bg-white px-2 pt-2 pb-2 relative transition-colors duration-500">
        <section className="relative w-full overflow-hidden rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-gray-200 z-[1] bg-[#0a1228]">
          <div className="relative min-h-[720px] sm:min-h-[760px] lg:min-h-[800px] overflow-hidden flex flex-col justify-end pb-24 pt-32 lg:pt-48">
            <div className="absolute inset-0 bg-[#0a1228] z-0">
              {/* Subtle gradient glowing orbs */}
              <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/10 blur-[120px] mix-blend-screen" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[100px] mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1228]/50 to-[#0a1228]" />
            </div>

            <div className="relative z-[2] max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex flex-col items-start h-full justify-center">
              <FadeInSection>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">About Us</span>
                </div>
              </FadeInSection>

              <FadeInSection delay="100ms">
                <h1 className="text-[3rem] sm:text-[4rem] lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-white mb-6 max-w-5xl font-display">
                  Engineering Impact Through <br className="hidden md:block" />
                  <span className="bg-brand-gradient bg-clip-text text-transparent">Intelligent Systems</span>
                </h1>
              </FadeInSection>

              <FadeInSection delay="200ms">
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl font-medium mb-12">
                  <span className="text-white font-bold">We Innovate Futures.</span> Building intelligent products, platforms, and services that help organizations operate smarter, scale faster, and transform with confidence.
                </p>
              </FadeInSection>

              <FadeInSection delay="300ms">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link
                    to="/services"
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white/90 backdrop-blur-xl text-gray-900 shadow-[0_0_40px_rgba(255,255,255,0.1)] w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    <span className="relative z-10 font-bold tracking-wide text-[14px]">Our Services</span>
                    <div className="relative z-10 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center transition-all duration-500 group-hover:bg-brand-blue shadow-md">
                      <ArrowRight className="w-4 h-4 text-white transition-all duration-500 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 px-6 py-4 hover:opacity-80 transition-opacity duration-300 w-full sm:w-auto justify-center"
                  >
                    <span className="text-[14px] font-bold text-white/90 tracking-wide uppercase">Contact Us</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </FadeInSection>
            </div>
          </div>

          {/* ── HERO BOTTOM STATS STRIP ── */}
          <div className="relative z-20 w-full bg-black/40 backdrop-blur-xl border-y border-white/[0.05] overflow-hidden mt-[-1px]">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.05]">
              {[
                { value: '50+', label: 'Projects Delivered' },
                { value: '20+', label: 'Active Partners' },
                { value: '15+', label: 'Departments' },
                { value: '5+', label: 'Innovation Labs' },
              ].map((stat, i) => (
                <div key={i} className="py-8 md:py-12 px-6 flex flex-col items-center md:items-start text-center md:text-left group cursor-default">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors duration-500 font-display">
                    <AnimatedNumber value={stat.value} duration={1500 + (i * 200)} />
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white/70 transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── MAIN HEADLINE SECTION (Editorial Style) ── */}
      <section className="py-24 lg:py-36 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-8">
              <FadeInSection>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-gray-900 mb-10 font-serif">
                  Kangqore: <span className="text-transparent bg-clip-text bg-brand-gradient italic font-light">Engineering impact</span> through intelligent systems
                </h2>
              </FadeInSection>
              
              <div className="space-y-8 text-lg sm:text-xl text-gray-600 leading-relaxed font-light">
                <FadeInSection delay="100ms">
                  <p>
                    We build intelligent products, platforms, and <Link to="/services" className="text-brand-blue hover:text-cyan-500 hover:underline transition-colors font-medium">services</Link> that help organizations operate smarter, scale faster, and transform with confidence.
                  </p>
                </FadeInSection>
                <FadeInSection delay="200ms">
                  <p>
                    Kangqore is a value-driven IT company enabling enterprises and institutions to achieve end-to-end digital transformation through modern engineering and AI-enabled innovation. Our work bridges strategy and execution—turning advanced technologies into measurable business outcomes.
                  </p>
                </FadeInSection>
              </div>
            </div>
            
            <div className="lg:col-span-4 lg:pt-4">
              <FadeInSection delay="300ms">
                <div className="p-8 lg:p-10 bg-gray-50 rounded-[2rem] border border-gray-200 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium relative z-10">
                    Our mission is to design, engineer, and scale intelligent digital systems—secure, adaptable, and engineered for long-term excellence.
                  </p>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── PURPOSE SECTION ── */}
      <section className="py-32 lg:py-48 relative overflow-hidden bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
          <FadeInSection>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-light text-gray-900 leading-tight font-serif mb-12">
              Our purpose is to <span className="italic bg-brand-gradient bg-clip-text text-transparent">innovate futures</span> that empower society and the planet
            </h2>
          </FadeInSection>
          
          <div className="max-w-3xl mx-auto space-y-8 text-xl sm:text-2xl text-gray-600 leading-relaxed font-light">
            <FadeInSection delay="100ms">
              <p className="font-medium text-gray-800">
                Technology should move humanity forward—not just businesses.
              </p>
            </FadeInSection>
            <FadeInSection delay="200ms">
              <p>
                At Kangqore, we create positive, lasting impact by building intelligent systems that enhance human potential, strengthen enterprises, and support sustainable progress. In a world accelerated by AI and digital complexity, we ensure innovation remains responsible, secure, and meaningful.
              </p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── JOURNEY / TIMELINE SECTION ── */}
      <section className="py-24 lg:py-36 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <FadeInSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-20 tracking-tight">
              Our journey so far
            </h2>
          </FadeInSection>
          
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                year: "2023",
                title: "Foundation",
                desc: "Kangqore was founded in Bengaluru, India, with a clear vision: to bridge technology potential with real-world business execution. From day one, we focused on building enterprise-ready digital systems that deliver measurable outcomes."
              },
              {
                year: "2024",
                title: "Expansion & Identity",
                desc: "As our capabilities expanded across AI, cloud engineering, enterprise modernization, automation, and cybersecurity, Kangqore evolved into a multi-disciplinary technology partner, serving enterprises and innovation-led organizations."
              },
              {
                year: "Present",
                title: "Engineering the Future",
                desc: <>Today, Kangqore engineers intelligent products, platforms, and <Link to="/services" className="text-brand-blue hover:text-cyan-500 hover:underline font-medium">services</Link> that help organizations become adaptive, resilient, and future-ready in an AI-driven world.</>
              }
            ].map((item, idx) => (
              <FadeInSection key={idx} delay={`${idx * 150}ms`}>
                <div className="relative group pl-8 md:pl-0 border-l border-gray-200 md:border-l-0">
                  {/* Glowing Node / Line */}
                  <div className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-gray-200 md:hidden" />
                  <div className="absolute -left-[5px] top-1.5 w-[10px] h-[10px] rounded-full bg-brand-blue shadow-[0_0_15px_rgba(37,100,234,0.3)] group-hover:scale-150 group-hover:bg-cyan-500 transition-all duration-500 md:hidden" />
                  
                  <div className="hidden md:block absolute -top-8 left-0 right-0 h-[2px] bg-gray-200" />
                  <div className="hidden md:block absolute -top-[37px] left-0 w-[12px] h-[12px] rounded-full bg-brand-blue shadow-[0_0_15px_rgba(37,100,234,0.3)] group-hover:scale-150 group-hover:bg-cyan-500 transition-all duration-500" />
                  
                  <div className="text-sm font-bold tracking-[0.2em] text-brand-blue mb-3 uppercase">{item.year}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-5 group-hover:text-brand-blue transition-colors">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
                    {item.desc}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESIGN × ENGINEERING × INTELLIGENCE ── */}
      <section className="py-24 lg:py-36 bg-gray-50 relative border-t border-gray-200">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[600px] bg-brand-gradient opacity-[0.03] blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeInSection>
              <p className="text-3xl lg:text-5xl text-gray-900 leading-tight font-serif">
                Kangqore brings together deep expertise at the intersection of engineering, intelligence, and execution.
              </p>
            </FadeInSection>
            
            <div className="space-y-16">
              {[
                { title: "Designed for Adaptability", desc: "We create digital systems that evolve with changing business needs, market dynamics, and technology shifts—without disrupting operations.", color: "border-brand-blue" },
                { title: "Engineered for Excellence", desc: "From architecture to deployment, our engineering practices emphasize reliability, security, scalability, and performance across cloud, AI, and software platforms.", color: "border-cyan-500" },
                { title: "Curated for Intelligence", desc: "Data, AI, and automation are embedded by design—enabling smarter decisions, faster operations, and continuous optimization.", color: "border-indigo-500" }
              ].map((item, idx) => (
                <FadeInSection key={idx} delay={`${idx * 150}ms`}>
                  <div className={`border-l-2 ${item.color} pl-8 group`}>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 transition-colors">{item.title}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT SETS US APART (Premium Grid) ── */}
      <section className="py-24 lg:py-36 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <FadeInSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-16 tracking-tight">
              What sets us apart
            </h2>
          </FadeInSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: Brain, title: "Engineering Ingenuity", desc: "Deep expertise in AI, cloud-native platforms, data engineering, and modern software development." },
              { icon: Target, title: "Pragmatic Philosophy", desc: "We design with real-world constraints in mind—legacy environments, budgets, timelines, and change readiness." },
              { icon: Sparkles, title: "Intelligent Optimization", desc: "Data-driven insights that inform design, automation, and continuous improvement." },
              { icon: Users, title: "Zero Distance to Partners", desc: "A people-first delivery model built on close collaboration, transparency, and speed." },
              { icon: Shield, title: "Responsible Innovation", desc: "Security, privacy, compliance, and ethical AI are foundational—not optional." },
              { icon: Zap, title: "Industry-Shaping Execution", desc: "Experience building software and platforms that redefine how industries operate." }
            ].map((feature, idx) => (
              <FadeInSection key={idx} delay={`${idx * 100}ms`}>
                <div className="group h-full bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:border-gray-300 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/0 via-transparent to-cyan-500/0 group-hover:from-brand-blue/5 group-hover:to-cyan-500/5 transition-colors duration-700" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
                      <feature.icon className="w-6 h-6 text-brand-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-light">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT ON PLANET & PEOPLE (McKinsey Editorial Visuals) ── */}
      <section className="py-24 lg:py-36 bg-gray-50 relative border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-24 lg:space-y-40">
          
          {/* Planet */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeInSection className="order-2 lg:order-1">
              <div className="relative group overflow-hidden rounded-[2rem] aspect-[4/3] sm:aspect-auto sm:h-[600px] border border-gray-200 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1200&q=80" 
                  alt="Impact on planet"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-color" />
                <div className="absolute inset-0 flex flex-col justify-end p-10 lg:p-14">
                  <Leaf className="w-12 h-12 text-emerald-400 mb-6 opacity-90" />
                  <h3 className="text-3xl sm:text-4xl font-serif text-white leading-tight">Environmental<br/>Responsibility</h3>
                </div>
              </div>
            </FadeInSection>
            <div className="order-1 lg:order-2">
              <FadeInSection delay="100ms">
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-6">Impact on planet</p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
                  Prioritizing the planet
                </h2>
                <p className="text-xl text-gray-700 font-medium mb-8 font-serif italic">
                  Responsible innovation is central to Kangqore's philosophy.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed font-light">
                  We design energy-efficient architectures, promote ethical AI practices, and build secure, sustainable systems—ensuring technology drives progress while respecting environmental responsibility.
                </p>
              </FadeInSection>
            </div>
          </div>

          {/* People */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-1 lg:order-1">
              <FadeInSection>
                <p className="text-[11px] font-bold text-brand-blue uppercase tracking-widest mb-6">Impact on people</p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
                  A people-first culture
                </h2>
                <p className="text-xl text-gray-700 font-medium mb-8 font-serif italic">
                  Kangqore operates with integrity—building trust with our people and our partners.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed font-light">
                  We foster a culture of ownership, continuous learning, and collaboration, empowering individuals to solve meaningful problems and grow alongside the organization.
                </p>
              </FadeInSection>
            </div>
            <FadeInSection className="order-2 lg:order-2" delay="100ms">
              <div className="relative group overflow-hidden rounded-[2rem] aspect-[4/3] sm:aspect-auto sm:h-[600px] border border-gray-200 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80" 
                  alt="Impact on people"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105 filter grayscale-[20%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-brand-blue/10 mix-blend-color" />
                <div className="absolute inset-0 flex flex-col justify-end p-10 lg:p-14">
                  <Heart className="w-12 h-12 text-cyan-400 mb-6 opacity-90" />
                  <h3 className="text-3xl sm:text-4xl font-serif text-white leading-tight">Human<br/>Potential</h3>
                </div>
              </div>
            </FadeInSection>
          </div>
          
        </div>
      </section>

      {/* ── CLIENT IMPACT & ZERO DISTANCE ── */}
      <section className="py-24 lg:py-36 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-20">
          
          <FadeInSection>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
              Discover how we're engineering impact with clients around the world
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed font-light mb-10">
              We partner with forward-thinking organizations across BFSI, Retail, Healthcare, Manufacturing, Automotive, E-commerce, Real Estate, Legal-Tech, Education, Beauty-Tech, and emerging digital-first sectors.
            </p>
            <Link 
              to="/case-studies"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-blue uppercase tracking-widest hover:text-cyan-500 transition-colors group"
            >
              View all case studies 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeInSection>

          <FadeInSection delay="150ms">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
              "Zero distance" to our partners
            </h2>
            <p className="text-xl text-gray-700 font-medium mb-6 font-serif italic">
              Kangqore's delivery model ensures proximity—not just geographically, but strategically.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              With headquarters in Bengaluru, an operational presence in Jamshedpur, and a growing footprint across India, we align teams, time zones, and goals to deliver seamless collaboration and faster execution.
            </p>
          </FadeInSection>

        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 lg:py-48 relative overflow-hidden bg-brand-blue text-white rounded-t-[2.5rem] lg:rounded-t-[4rem]">
        <div className="absolute inset-0 bg-brand-gradient opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
          <FadeInSection>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
              Let's build the future—<span className="italic font-serif font-light text-cyan-200">intelligently</span>
            </h2>
          </FadeInSection>
          <FadeInSection delay="100ms">
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-light mb-12 max-w-3xl mx-auto">
              Whether you're modernizing platforms, adopting AI, or building something entirely new, Kangqore is ready to partner across the full transformation lifecycle—from strategy and consulting to engineering, deployment, operations, and growth.
            </p>
          </FadeInSection>
          <FadeInSection delay="200ms">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/contact"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white text-brand-blue shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                <span className="relative z-10 font-bold tracking-wide text-[14px]">Talk to our team</span>
                <div className="relative z-10 w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center transition-all duration-500 group-hover:bg-gray-900 shadow-md">
                  <ArrowRight className="w-4 h-4 text-white transition-all duration-500 group-hover:translate-x-0.5" />
                </div>
              </Link>
              <div className="flex items-center gap-6 mt-4 sm:mt-0">
                <Link to="/services" className="text-[13px] font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors group flex items-center gap-2">
                  Services <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="w-[1px] h-4 bg-white/30" />
                <Link to="/careers" className="text-[13px] font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors group flex items-center gap-2">
                  Careers <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
