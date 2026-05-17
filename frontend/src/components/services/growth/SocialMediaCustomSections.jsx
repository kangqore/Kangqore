import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Zap, Target, Layers, BrainCircuit, ChevronDown, CheckCircle2, ChevronRight, Users, Eye, TrendingUp, Shield, MessageCircle, BarChart3, Video, PenTool, Megaphone, Search, Sparkles, Building2, ShoppingCart, Briefcase, Heart, Globe, Rocket, Bot } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SecondaryButton from '../../ui/SecondaryButton';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SOCIAL CHALLENGES SECTION
// ═══════════════════════════════════════════════════════════════════════════════
export const SocialChallengesSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.smm-challenge');
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );
    }
  }, []);

  const challenges = [
    { problem: '"Social media is active, but not producing business outcomes."', fix: 'We connect content, campaigns, community, and analytics so social becomes a measurable growth channel — not a cosmetic activity.' },
    { problem: '"We don\'t know what works."', fix: 'Every platform decision is backed by audience analysis, competitor benchmarking, trend tracking, and performance reporting.' },
    { problem: '"Our brand looks different everywhere."', fix: 'We create one brand voice, visual system, content calendar, and approval flow across every platform.' },
    { problem: '"We don\'t have the time or team."', fix: 'You get strategy, creatives, captions, scheduling, engagement, reporting, and paid social execution through one managed system.' },
    { problem: '"Agencies gave us generic content."', fix: 'We build industry-specific playbooks for your audience, funnel, geography, offer, and growth stage.' },
    { problem: '"We don\'t know which platforms matter."', fix: 'We map platform priority by ICP, buying behavior, content format, competition, and conversion potential.' }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-16 text-left max-w-4xl">

          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
            Social Media Challenges <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">We Eliminate.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.map((c, idx) => (
            <div key={idx} className="smm-challenge bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-3xl p-8 border border-gray-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-300 group">
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-4 leading-snug italic">{c.problem}</p>
              <div className="w-8 h-px bg-gradient-to-r from-brand-blue to-cyan-400 mb-4 group-hover:w-16 transition-all duration-500"></div>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed text-sm">{c.fix}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. WHY SMM MATTERS — 4-Pillar Grid
// ═══════════════════════════════════════════════════════════════════════════════
export const WhySocialMattersSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const items = sectionRef.current.querySelectorAll('.smm-pillar');
      gsap.fromTo(items,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              Social Media Is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Revenue Surface.</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              Your customers research, compare, trust, complain, discover, and buy through social platforms. The brands that win are not the loudest — they are the most consistent, useful, visible, and measurable.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Visibility', icon: Eye, desc: 'Stay present where your buyers spend attention.' },
              { title: 'Consistency', icon: Target, desc: 'Build trust through repeated, high-quality communication.' },
              { title: 'Optimization', icon: TrendingUp, desc: 'Convert attention into pipeline through iteration.' },
              { title: 'Trust', icon: Shield, desc: 'Humanize the brand with proof and storytelling.' }
            ].map((item, idx) => (
              <div key={idx} className="smm-pillar bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-blue/10 transition-all duration-300">
                  <item.icon className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. 5-PHASE METHODOLOGY
// ═══════════════════════════════════════════════════════════════════════════════
export const FivePhaseMethodology = () => {
  const [activePhase, setActivePhase] = useState(0);
  const sectionRef = useRef(null);

  const phases = [
    { num: '01', title: 'Discovery & Brand Audit', desc: 'We audit your profiles, competitors, audience behavior, content gaps, positioning, engagement patterns, and platform readiness.' },
    { num: '02', title: 'Strategy & Content Planning', desc: 'We define content pillars, platform priorities, campaign themes, publishing rhythm, creative direction, and measurable KPIs.' },
    { num: '03', title: 'Launch & Community Building', desc: 'We optimize profiles, publish content, initiate engagement loops, activate community conversations, and launch paid campaigns where required.' },
    { num: '04', title: 'Growth & Engagement', desc: 'We scale winning content formats, test hooks, collaborate with influencers, improve community response, and expand reach.' },
    { num: '05', title: 'Scale & Optimize', desc: 'We track performance, refine strategy, test formats, improve ROI, and build a repeatable content engine.' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase(prev => (prev + 1) % phases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [phases.length]);

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16 text-left max-w-4xl">

          <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
            Our Social Media <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Growth System.</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-8">
            {phases.map((_, idx) => (
              <button key={idx} onClick={() => setActivePhase(idx)} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${idx === activePhase ? 'bg-gradient-to-r from-brand-blue to-cyan-400' : idx < activePhase ? 'bg-brand-blue/30' : 'bg-gray-200'}`} />
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-3xl p-10 lg:p-14 border border-gray-100 min-h-[240px] relative overflow-hidden">
            {phases.map((phase, idx) => (
              <div key={idx} className={`transition-all duration-500 ${idx === activePhase ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
                <div className="flex items-start gap-6">
                  <span className="text-6xl lg:text-7xl font-black text-brand-blue/20 font-mono leading-none">{phase.num}</span>
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">{phase.title}</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">{phase.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. EXECUTION POD — Team Structure
// ═══════════════════════════════════════════════════════════════════════════════
export const ExecutionPodSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.smm-pod-card');
      gsap.fromTo(cards,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );
    }
  }, []);

  const team = [
    { role: 'Social Media Strategist', focus: 'Positioning, channel strategy, content pillars, and growth roadmap.', icon: Target },
    { role: 'Content Writer / Copywriter', focus: 'Captions, scripts, carousels, hooks, thought leadership, and campaign messaging.', icon: PenTool },
    { role: 'Designer & Video Editor', focus: 'Platform-native creatives, reels, carousels, thumbnails, motion graphics, and ad assets.', icon: Video },
    { role: 'Community Manager', focus: 'Engagement, comments, DMs, response flows, and community health.', icon: MessageCircle },
    { role: 'Paid Social Specialist', focus: 'Meta, LinkedIn, YouTube, and X campaigns with testing, targeting, and budget optimization.', icon: Megaphone },
    { role: 'Performance Analyst', focus: 'Reach, engagement, CTR, CPL, conversions, content performance, and growth insights.', icon: BarChart3 }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,100,234,0.15)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display tracking-tight">
            Your Dedicated <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Execution Pod.</span>
          </h2>
          <p className="text-lg text-gray-400 font-light leading-relaxed">
            Not a freelancer. Not a junior intern. A full-stack social media execution team deployed under one operating model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((member, idx) => (
            <div key={idx} className="smm-pod-card bg-white dark:bg-gray-900 dark:border-gray-800/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-cyan-400/30 transition-all duration-300">
                <member.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{member.role}</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed">{member.focus}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. BUSINESS TYPES STRIP
// ═══════════════════════════════════════════════════════════════════════════════
export const BusinessTypesSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.smm-biz');
      gsap.fromTo(cards,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );
    }
  }, []);

  const types = [
    { name: 'Startups', desc: 'Build the first loyal audience, define brand voice, generate founder-led content, and create launch momentum.', icon: Rocket },
    { name: 'Enterprise', desc: 'Manage multi-brand governance, executive content, reputation control, regional campaigns, and platform consistency.', icon: Building2 },
    { name: 'B2B Companies', desc: 'Turn expertise into thought leadership, webinars, case-study content, lead nurturing, and decision-maker visibility.', icon: Briefcase },
    { name: 'B2C Brands', desc: 'Create trend-led content, influencer campaigns, community loyalty, product storytelling, and repeat-purchase demand.', icon: ShoppingCart },
    { name: 'Local Businesses', desc: 'Drive footfall, reviews, local visibility, WhatsApp inquiries, Google Business integration, and hyperlocal campaigns.', icon: Globe }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3 md:sticky md:top-32">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              Business Types <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">We Serve.</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              From pre-revenue startups to Fortune 500 enterprises — our social media frameworks adapt to your scale, audience, and growth stage.
            </p>
          </div>
          <div className="md:w-2/3 space-y-4">
            {types.map((biz, idx) => (
              <div key={idx} className="smm-biz bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border border-gray-100 flex items-start gap-5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-brand-blue/20 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-brand-blue/10 transition-all duration-300">
                  <biz.icon className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-blue transition-colors">{biz.name}</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">{biz.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. READINESS MAGNET CTA
// ═══════════════════════════════════════════════════════════════════════════════
export const SocialReadinessMagnet = () => {
  return (
    <section className="py-24 bg-[#FEFFFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-[#2564ea] to-[#4ab6d4]">
          <div className="absolute -inset-20 z-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#2564ea]/95 to-[#4ab6d4]/95 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10"></div>

          <div className="relative z-20">
            <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-2xl mb-8 backdrop-blur-md border border-white/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display">Build a Social Media Engine That Actually Ships.</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              Start with a strategy call. We'll audit your current presence, identify growth gaps, and map a <strong className="text-white">90-day execution roadmap</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">
                Book a Social Media Strategy Call
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <SecondaryButton 
                text="Get Your Growth Blueprint" 
                link="/contact" 
                theme="glass"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
