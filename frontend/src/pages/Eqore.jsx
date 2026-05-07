import React from 'react';
import { Shield, Eye, Users, Globe, Layers, Compass, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import SecondaryButton from '../components/ui/SecondaryButton';

const Eqore = () => {
  return (
    <div className="bg-white dark:bg-black">
      <SEO 
        title="Meet eQORE — Kangqore's Digital Guardian & Mascot"
        description="eQORE is the digital mascot of Kangqore — a hero engineered for the age of intelligent systems, embodying strength, intelligence, and people-first innovation."
        keywords="eQORE, Kangqore mascot, digital guardian, brand identity, technology mascot"
        url="/eqore"
      />
      <PageHero
        badge="Meet eQORE"
        title="Kangqore's Digital"
        titleHighlight="Hero"
        description="eQORE is the digital mascot of Kangqore — a hero engineered for the age of intelligent systems."
        primaryButton={{ text: 'Contact Us', link: '/contact' }}
        secondaryButton={{ text: 'Explore Our Services', link: '/services' }}
        stats={[
          { value: 'Intelligence', label: 'Core', sublabel: 'Structured & precise', color: 'text-cyan-400' },
          { value: 'Responsibility', label: 'Values', sublabel: 'People-first approach', color: 'text-blue-400' },
          { value: 'Unity', label: 'Mission', sublabel: 'Technology that unites', color: 'text-cyan-400' },
          { value: 'Powerful', label: 'Presence', sublabel: 'Guardian of progress', color: 'text-sky-400' },
        ]}
      />

      {/* Premium Opening Statement */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Decorative Corner Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-l-4 border-t-4 border-brand-blue opacity-20"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-4 border-b-4 border-brand-cyan opacity-20"></div>
            
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-2xl p-12 border border-gray-100 relative overflow-hidden">
              {/* Subtle Background Pattern */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
              
              <div className="relative">
                <div className="flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-brand-blue mr-3" />
                  <span className="text-sm font-semibold tracking-widest text-brand-blue uppercase">The Digital Guardian</span>
                  <Sparkles className="w-8 h-8 text-brand-blue ml-3" />
                </div>
                
                <p className="text-2xl md:text-3xl text-center text-gray-800 dark:text-gray-50 leading-relaxed font-light mb-4">
                  He stands as a visual embodiment of <span className="font-semibold text-brand-blue">strength</span>, <span className="font-semibold text-brand-blue">intelligence</span>, <span className="font-semibold text-brand-blue">responsibility</span>, and <span className="font-semibold text-brand-blue">unity</span>.
                </p>
                
                <p className="text-xl text-center text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                  Designed with a futuristic robotic form and a superhero-like presence, eQORE represents the spirit behind everything Kangqore builds: <span className="font-medium text-gray-900 dark:text-white">technology that is powerful, disciplined, and created for the benefit of all.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section with Hero Image */}
      <section id="about" className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero Image - No background, clean */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img 
                  src="https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/n17w3ast_Gemini_Generated_Image_i3f8bgi3f8bgi3f8.png"
                  alt="eQORE - Kangqore's Digital Mascot"
                  className="w-full object-contain drop-shadow-2xl"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </div>
            
            {/* Right: Text Content */}
            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <div className="inline-block mb-4">
                  <span className="text-sm font-bold tracking-widest text-brand-blue uppercase border-b-2 border-brand-blue pb-1">The Vision</span>
                </div>
                <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Engineered with <span className="bg-brand-gradient bg-clip-text text-transparent">Purpose</span>
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="pl-6 border-l-4 border-brand-blue">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    He is designed to embody how Kangqore builds systems, approaches innovation, and engages with the world: with <span className="font-semibold text-brand-blue">clarity</span>, <span className="font-semibold text-brand-blue">discipline</span>, and <span className="font-semibold text-brand-blue">respect for people</span> above everything else.
                  </p>
                </div>
                
                <div className="pl-6 border-l-4 border-brand-cyan">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    His presence combines a futuristic robotic form with a superhero-like stature, creating a symbol that feels <span className="font-semibold">strong</span>, <span className="font-semibold">reassuring</span>, and <span className="font-semibold">forward-looking</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold tracking-widest text-brand-blue uppercase border-b-2 border-brand-blue pb-1">Philosophy</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Design with <span className="bg-brand-gradient bg-clip-text text-transparent">Intention</span>
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-400 font-light max-w-3xl mx-auto italic">
              eQORE is not accidental in form or expression. Every aspect of his design is intentional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-16">
            <div className="group relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-2 h-full bg-brand-gradient rounded-l-3xl"></div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Robotic Build</h3>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                His robotic build reflects <span className="font-semibold text-brand-blue">advanced engineering</span> — structured, precise, and dependable. The design emphasizes technical excellence and reliability.
              </p>
            </div>

            <div className="group relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-brand-cyan to-cyan-400 rounded-l-3xl"></div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-cyan to-cyan-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Superhero Stance</h3>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                His superhero-inspired stance conveys <span className="font-semibold text-brand-cyan">readiness and protection</span>, not spectacle. Together, they create a figure that feels capable of carrying responsibility at scale.
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto bg-brand-gradient rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
            <div className="relative text-center">
              <p className="text-2xl md:text-3xl leading-relaxed font-light">
                The design avoids excess and aggression. Instead, it emphasizes <span className="font-bold">balance</span>, <span className="font-bold">control</span>, and <span className="font-bold">composure</span> — qualities that define Kangqore's approach to technology and long-term partnerships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Physical Appearance with Image */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold tracking-widest text-cyan-600 uppercase border-b-2 border-cyan-600 pb-1">Form & Function</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Physical <span className="bg-gradient-to-r from-cyan-600 to-brand-cyan bg-clip-text text-transparent">Presence</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image - No background */}
            <div className="relative">
              <img 
                src="https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/tfz1i8f5_Gemini_Generated_Image_mm8jqmmm8jqmmm8j.png"
                alt="eQORE Physical Design"
                className="w-full object-contain drop-shadow-2xl"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>

            {/* Text Content */}
            <div className="space-y-8">
              <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-10 shadow-xl border-l-4 border-cyan-600">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Body & Build</h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-cyan-600 to-brand-cyan"></div>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  eQORE's body is <span className="font-semibold text-cyan-600">athletic and proportioned</span>, built with layered, armor-like surfaces that suggest durability and intelligence rather than brute force.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  His metallic finish is refined and premium, enhanced with subtle highlights that give depth without distraction. These details signal <span className="font-semibold text-brand-blue">craftsmanship and attention to quality</span>, mirroring the way Kangqore engineers its platforms and systems.
                </p>
              </div>

              <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-10 shadow-xl border-l-4 border-brand-blue">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">The Cape</h3>
                  <div className="w-16 h-1 bg-brand-gradient"></div>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  The cape adds stature and motion, reinforcing his role as a <span className="font-semibold text-brand-blue">guardian figure in the digital realm</span> — watchful, present, and composed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Face, Expression & Presence */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Face, Expression & Presence</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-10 mb-8">
              <Eye className="w-12 h-12 text-brand-blue mb-6 mx-auto" />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center mb-6">
                eQORE's face is distinctly robotic, designed with <span className="font-semibold">symmetry and clean geometry</span> that convey precision and logic. His glowing eyes suggest awareness and insight — observant, attentive, and focused.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-10 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">His expressions are minimal yet meaningful:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-brand-gradient rounded-full mt-2"></div>
                  <p className="text-gray-700 dark:text-gray-300">Calm during observation</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-brand-gradient rounded-full mt-2"></div>
                  <p className="text-gray-700 dark:text-gray-300">Confident when facing forward</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-brand-gradient rounded-full mt-2"></div>
                  <p className="text-gray-700 dark:text-gray-300">Steady and grounded in every stance</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-10 text-center">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                He communicates assurance through <span className="font-semibold text-brand-blue">posture and stillness</span>, not exaggerated emotion. His presence feels stable and dependable, like a constant overseeing complex environments with care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values He Represents with Benchmark Image */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm font-bold tracking-widest text-brand-blue uppercase border-b-2 border-brand-blue pb-1">Core Principles</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              Values He <span className="bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">Represents</span>
            </h2>
            <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-light mb-4">
              eQORE stands for more than technological capability.
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
              He represents Kangqore's belief that technology must unite, not divide.
            </p>
          </div>

          {/* Benchmark/Hero Image - No background */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="relative">
              <img 
                src="https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/fhez1pni_%23%23BenchMark.jpg"
                alt="eQORE Standing Guard"
                className="w-full object-contain drop-shadow-2xl rounded-3xl"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-16">
            {/* We Do Not Promote */}
            <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-10 shadow-2xl border-l-4 border-red-600">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">We Do Not Promote</h3>
                  <div className="w-12 h-1 bg-red-600 mt-2"></div>
                </div>
              </div>
              <ul className="space-y-5">
                <li className="flex items-start gap-4 text-lg">
                  <span className="text-red-600 font-bold text-2xl">×</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Racism</span>
                </li>
                <li className="flex items-start gap-4 text-lg">
                  <span className="text-red-600 font-bold text-2xl">×</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Discrimination</span>
                </li>
                <li className="flex items-start gap-4 text-lg">
                  <span className="text-red-600 font-bold text-2xl">×</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Division based on background, belief, or identity</span>
                </li>
              </ul>
            </div>

            {/* eQORE Reflects Values Of */}
            <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl p-10 shadow-2xl border-l-4 border-green-600">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">eQORE Reflects</h3>
                  <div className="w-12 h-1 bg-green-600 mt-2"></div>
                </div>
              </div>
              <ul className="space-y-5">
                <li className="flex items-start gap-4 text-lg">
                  <span className="text-green-600 font-bold text-2xl">✓</span>
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">Equality and fairness</span>
                </li>
                <li className="flex items-start gap-4 text-lg">
                  <span className="text-green-600 font-bold text-2xl">✓</span>
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">Respect for all people and perspectives</span>
                </li>
                <li className="flex items-start gap-4 text-lg">
                  <span className="text-green-600 font-bold text-2xl">✓</span>
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">Collaboration across cultures and geographies</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand-blue to-brand-cyan rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
            <div className="relative text-center">
              <p className="text-2xl md:text-3xl leading-relaxed font-light">
                As Kangqore's digital mascot, he symbolizes an <span className="font-bold">inclusive vision of progress</span> — where systems are built to serve everyone responsibly and ethically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Within Kangqore */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Role Within Kangqore</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-10 mb-8">
              <Compass className="w-12 h-12 text-brand-blue mb-6 mx-auto" />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                eQORE acts as a <span className="font-semibold text-brand-blue">unifying visual anchor</span> across Kangqore's digital presence. He represents the mindset behind every solution, platform, and service — thoughtful engineering guided by values.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-10 shadow-lg text-center">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                His presence reassures visitors that what Kangqore builds is grounded not only in <span className="font-semibold text-brand-blue">technical excellence</span>, but also in <span className="font-semibold text-brand-cyan">integrity and accountability</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Experience He Creates */}
      <section className="py-24 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">The Experience He Creates</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              When visitors encounter eQORE on the Kangqore website, the experience should feel clear and confident:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Layers className="w-8 h-8 text-brand-blue" />
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                This is a company that builds with intelligence
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-brand-blue" />
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                This is a company that values responsibility
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-cyan-600" />
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                This is a company that believes progress must be inclusive
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-brand-gradient rounded-2xl p-12 text-white text-center">
            <p className="text-2xl font-bold leading-relaxed">
              eQORE embodies that message visually and emotionally — standing as the digital mascot of Kangqore and a symbol of purposeful, people-first innovation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section with Hero Image */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Hero Image - No background overlay */}
            <div className="order-2 lg:order-1">
              <div className="relative p-8">
                <img 
                  src="https://customer-assets.emergentagent.com/job_5aa25e8f-c4d3-4f3b-a26e-2705ad6a7b5e/artifacts/jna1csmv_Gemini_Generated_Image_9msncz9msncz9msn.png"
                  alt="eQORE - Guardian of Digital Innovation"
                  className="w-full object-contain drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))' }}
                />
              </div>
            </div>

            {/* Right: CTA Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-block mb-6">
                <span className="text-sm font-bold tracking-widest text-cyan-300 uppercase border-b-2 border-cyan-300 pb-1">Join The Journey</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Build with <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Kangqore</span>
              </h2>
              <p className="text-2xl text-blue-100 mb-10 leading-relaxed font-light">
                Experience technology built with <span className="font-semibold text-white">intelligence</span>, <span className="font-semibold text-white">responsibility</span>, and <span className="font-semibold text-white">respect for people</span>. Let's create something meaningful together.
              </p>
                <Link to="/contact" className="inline-block bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-105">
                  Contact Us
                </Link>
                <SecondaryButton
                  text="Explore Services"
                  link="/services"
                  theme="glass"
                />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Eqore;
