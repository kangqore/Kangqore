import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, Users, Leaf, Brain, Target, Globe, Heart, ChevronRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import SecondaryButton from '../components/ui/SecondaryButton';
import { coreSEO } from '../data/seoData';

const AboutUs = () => {
  return (
    <div className="bg-white dark:bg-black">
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
      {/* HERO SECTION */}
      <PageHero
        badge="About Us"
        title="Engineering Impact Through"
        titleHighlight="Intelligent Systems"
        description="We Innovate Futures. Building intelligent products, platforms, and services that help organizations operate smarter, scale faster, and transform with confidence."
        primaryButton={{ text: 'Our Services', link: '/services' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '50+', label: 'Projects Delivered', color: 'text-cyan-400' },
          { value: '20+', label: 'Active Partners', color: 'text-blue-400' },
          { value: '15+', label: 'Departments', color: 'text-emerald-400' },
          { value: '5+', label: 'Innovation Labs', color: 'text-purple-400' },
        ]}
      />

      {/* MAIN HEADLINE SECTION */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Main headline - Left side */}
            <div className="lg:col-span-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white mb-8">
                Kangqore: <span className="text-transparent bg-clip-text bg-brand-gradient italic">Engineering impact</span> through intelligent systems
              </h2>
              
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  We build intelligent products, platforms, and <Link to="/services" className="text-brand-blue hover:underline font-medium">services</Link> that help organizations operate smarter, scale faster, and transform with confidence.
                </p>
                <p>
                  Kangqore is a value-driven IT company enabling enterprises and institutions to achieve end-to-end digital transformation through modern engineering and AI-enabled innovation. Our work bridges strategy and execution—turning advanced technologies into measurable business outcomes.
                </p>
              </div>
            </div>
            
            {/* Side Mission Text - Right side */}
            <div className="lg:col-span-4 lg:pt-4">
              <div className="lg:text-right p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our mission is to design, engineer, and scale intelligent digital systems—secure, adaptable, and engineered for long-term excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blue Gradient Decorative Bar */}
      <div className="relative h-[300px] lg:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient">
          {/* Abstract 3D-like shapes */}
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-cyan-400/30 to-transparent rounded-[50px] transform -rotate-12 -translate-y-1/2"></div>
          <div className="absolute top-0 right-1/4 w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] bg-gradient-to-tl from-blue-400/30 to-transparent rounded-[50px] transform rotate-12 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] lg:w-[350px] lg:h-[350px] bg-gradient-to-tr from-cyan-300/20 to-transparent rounded-[40px] transform translate-y-1/2"></div>
        </div>
      </div>

      {/* PURPOSE SECTION - Centered, single statement */}
      <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-700 dark:text-gray-300 leading-tight italic">
            Our purpose is to innovate futures that empower society and the planet
          </h2>
          
          <div className="mt-12 max-w-3xl mx-auto space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Technology should move humanity forward—not just businesses.
            </p>
            <p>
              At Kangqore, we create positive, lasting impact by building intelligent systems that enhance human potential, strengthen enterprises, and support sustainable progress. In a world accelerated by AI and digital complexity, we ensure innovation remains responsible, secure, and meaningful.
            </p>
          </div>
        </div>
      </section>

      {/* JOURNEY / TIMELINE SECTION */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-16 text-center lg:text-left">
            Our journey so far
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {/* 2023 */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-brand-gradient rounded-full hidden md:block"></div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2023 — Foundation</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Kangqore was founded in Bengaluru, India, with a clear vision: to bridge technology potential with real-world business execution. From day one, we focused on building enterprise-ready digital systems that deliver measurable outcomes.
              </p>
            </div>
            
            {/* 2024 */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-brand-gradient rounded-full hidden md:block"></div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2024 — Expansion & Identity</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                As our capabilities expanded across AI, cloud engineering, enterprise modernization, automation, and cybersecurity, Kangqore evolved into a multi-disciplinary technology partner, serving enterprises and innovation-led organizations.
              </p>
            </div>
            
            {/* Present */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-brand-gradient rounded-full hidden md:block"></div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Present — Engineering the Future</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Today, Kangqore engineers intelligent products, platforms, and <Link to="/services" className="text-brand-blue hover:underline font-medium">services</Link> that help organizations become adaptive, resilient, and future-ready in an AI-driven world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DESIGN × ENGINEERING × INTELLIGENCE - Split layout */}
      <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left statement */}
            <div>
              <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                Kangqore brings together deep expertise at the intersection of engineering, intelligence, and execution.
              </p>
            </div>
            
            {/* Right stacked content */}
            <div className="space-y-12">
              <div className="border-l-4 border-brand-blue pl-6">
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-600 dark:text-gray-400 mb-3">Designed for Adaptability</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We create digital systems that evolve with changing business needs, market dynamics, and technology shifts—without disrupting operations.
                </p>
              </div>
              
              <div className="border-l-4 border-cyan-500 pl-6">
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-600 dark:text-gray-400 mb-3">Engineered for Excellence</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  From architecture to deployment, our engineering practices emphasize reliability, security, scalability, and performance across cloud, AI, and software platforms.
                </p>
              </div>
              
              <div className="border-l-4 border-brand-blue pl-6">
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-600 dark:text-gray-400 mb-3">Curated for Intelligence</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Data, AI, and automation are embedded by design—enabling smarter decisions, faster operations, and continuous optimization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT SETS US APART - Grid */}
      <section className="py-24 lg:py-32 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-16">
            What sets us apart
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Engineering Ingenuity</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Deep expertise in AI, cloud-native platforms, data engineering, and modern software development.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Pragmatic Philosophy</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We design with real-world constraints in mind—legacy environments, budgets, timelines, and change readiness.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Intelligent Optimization</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Data-driven insights that inform design, automation, and continuous improvement.
              </p>
            </div>
            
            {/* Card 4 */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Zero Distance to Partners</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A people-first delivery model built on close collaboration, transparency, and speed.
              </p>
            </div>
            
            {/* Card 5 */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Responsible Innovation</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Security, privacy, compliance, and ethical AI are foundational—not optional.
              </p>
            </div>
            
            {/* Card 6 */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Industry-Shaping Execution</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Experience building software and platforms that redefine how industries operate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT ON PLANET - Split image + text */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-green-400 to-emerald-600">
                <img 
                  src="https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80" 
                  alt="Impact on planet"
                  className="w-full h-full object-cover mix-blend-overlay opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="w-24 h-24 text-white/80" />
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div>
              <p className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-4">Impact on planet</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Prioritizing the planet
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
                Responsible innovation is central to Kangqore's philosophy.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We design energy-efficient architectures, promote ethical AI practices, and build secure, sustainable systems—ensuring technology drives progress while respecting environmental responsibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT ON PEOPLE - Split image + text (reversed) */}
      <section className="py-24 lg:py-32 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <p className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-4">Impact on people</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                A people-first culture
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
                Kangqore operates with integrity—building trust with our people and our partners.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We foster a culture of ownership, continuous learning, and collaboration, empowering individuals to solve meaningful problems and grow alongside the organization.
              </p>
            </div>
            
            {/* Image */}
            <div className="relative order-1 lg:order-2">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" 
                  alt="Impact on people"
                  className="w-full h-full object-cover mix-blend-overlay opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="w-24 h-24 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT IMPACT - Case studies strip */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Discover how we're engineering impact with clients around the world
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              We partner with forward-thinking organizations across BFSI, Retail, Healthcare, Manufacturing, Automotive, E-commerce, Real Estate, Legal-Tech, Education, Beauty-Tech, and emerging digital-first sectors.
            </p>
            <Link 
              to="/case-studies"
              className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-blue-700 transition-colors group"
            >
              View all case studies 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* METRICS STRIP */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-16 text-center">
            <div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">50+</p>
              <p className="text-gray-400 text-sm sm:text-base">Projects delivered</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">20+</p>
              <p className="text-gray-400 text-sm sm:text-base">Active partners</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">5+</p>
              <p className="text-gray-400 text-sm sm:text-base">Innovation initiatives & digital labs</p>
            </div>
          </div>
        </div>
      </section>

      {/* ZERO DISTANCE SECTION - Large typography */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              "Zero distance" to our partners
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-6">
              Kangqore's delivery model ensures proximity—not just geographically, but strategically.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              With headquarters in Bengaluru, an operational presence in Jamshedpur, and a growing footprint across India, we align teams, time zones, and goals to deliver seamless collaboration and faster execution.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 lg:py-32 bg-brand-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Let's build the future—intelligently
            </h2>
            <p className="text-base sm:text-lg text-blue-100 leading-relaxed mb-10">
              Whether you're modernizing platforms, adopting AI, or building something entirely new, Kangqore is ready to partner across the full transformation lifecycle—from strategy and consulting to engineering, deployment, operations, and growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-blue-50 transition-colors shadow-lg"
              >
                Talk to our team
                <ArrowRight className="w-5 h-5" />
              </Link>
              <SecondaryButton 
                text="Explore our services" 
                link="/services" 
                theme="glass"
              />
              <SecondaryButton 
                text="Careers at Kangqore" 
                link="/careers" 
                theme="glass"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
