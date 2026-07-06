import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Brain, Target, Shield, Zap, Users, Leaf, Heart,
  Globe, Code2, Layers, TrendingUp, MapPin, Check
} from 'lucide-react';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Local parallax (returns [ref, style]) ─────────────────────
const useParallax = (speed = 0.12) => {
  const ref   = useRef(null);
  const rafId = useRef(null);
  const [y, setY] = useState(0);
  useEffect(() => {
    const compute = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setY((rect.top + rect.height / 2 - window.innerHeight / 2) * speed);
    };
    const onScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [speed]);
  return [ref, { transform: `translateY(${y}px)`, willChange: 'transform' }];
};

// ── Animated counter ──────────────────────────────────────────
const Counter = ({ value, duration = 1800 }) => {
  const [count, setCount] = useState(0);
  const done    = useRef(false);
  const el      = useRef(null);
  const numeric = parseInt(value.replace(/\D/g, ''));
  const suffix  = value.replace(/[0-9]/g, '');
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let t0 = null;
        const step = ts => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / duration, 1);
          setCount(Math.floor(p * numeric));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (el.current) obs.observe(el.current);
    return () => { if (el.current) obs.unobserve(el.current); };
  }, [numeric, duration]);
  return <span ref={el}>{count}{suffix}</span>;
};

// ── Fade-in on scroll ─────────────────────────────────────────
const FadeIn = ({ children, className = '', delay = '0ms' }) => {
  const [ref, vis] = useScrollAnimation({ threshold: 0.08, once: true });
  return (
    <div ref={ref}
      className={`transition-all duration-700 ease-out ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: delay }}>
      {children}
    </div>
  );
};

// ── Small section label (agentic-ai style) ────────────────────
const Label = ({ children, color = 'text-amber-400' }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="h-px w-10 bg-white/15" />
    <span className={`text-[10px] font-bold uppercase tracking-[0.28em] ${color}`}>{children}</span>
  </div>
);

// ── Fixed left sidebar (agentic-ai numbered section markers) ──
const SIDEBAR = [
  { id: 'who-we-are',    label: 'WHO WE ARE'    },
  { id: 'challenge',     label: 'THE PROBLEM'   },
  { id: 'numbers',       label: 'BY THE NUMBERS'},
  { id: 'story',         label: 'OUR STORY'     },
  { id: 'leadership',    label: 'LEADERSHIP'    },
  { id: 'formula',       label: 'HOW WE WORK'   },
  { id: 'capabilities',  label: 'WHAT WE BUILD' },
  { id: 'esg',           label: 'ESG'           },
];

const LeftSidebar = () => {
  const [active, setActive] = useState('who-we-are');
  const [show,   setShow]   = useState(false);
  useEffect(() => {
    const tick = () => {
      setShow(window.scrollY > window.innerHeight * 0.55);
      for (const s of [...SIDEBAR].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 160) { setActive(s.id); break; }
      }
    };
    window.addEventListener('scroll', tick, { passive: true });
    return () => window.removeEventListener('scroll', tick);
  }, []);
  const go = id => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };
  return (
    <div className={`fixed left-5 top-1/2 -translate-y-1/2 z-[9200] hidden xl:flex flex-col gap-[18px] transition-all duration-500 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {SIDEBAR.map((s, i) => (
        <button key={s.id} onClick={() => go(s.id)} className="flex items-center gap-3 group text-left">
          <div className={`h-px transition-all duration-300 ${active === s.id ? 'w-8 bg-white/60' : 'w-4 bg-white/12 group-hover:bg-white/25 group-hover:w-6'}`} />
          <span className={`font-mono text-[8.5px] uppercase tracking-[0.18em] transition-colors duration-300 whitespace-nowrap ${active === s.id ? 'text-white/55' : 'text-white/12 group-hover:text-white/25'}`}>
            {String(i + 1).padStart(2, '0')}{active === s.id ? ` — ${s.label}` : ''}
          </span>
        </button>
      ))}
    </div>
  );
};

// ── Top anchor nav ────────────────────────────────────────────
const TopNav = () => {
  const [show,   setShow]   = useState(false);
  const [active, setActive] = useState('');
  useEffect(() => {
    const tick = () => {
      setShow(window.scrollY > window.innerHeight * 0.55);
      for (const s of [...SIDEBAR].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 60) { setActive(s.id); break; }
      }
    };
    window.addEventListener('scroll', tick, { passive: true });
    return () => window.removeEventListener('scroll', tick);
  }, []);
  const go = id => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 48, behavior: 'smooth' });
  };
  return (
    <div className={`fixed top-0 inset-x-0 z-[9500] transition-all duration-400 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
      <nav className="bg-[#06090f]/96 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SIDEBAR.map((s) => (
            <button key={s.id} onClick={() => go(s.id)}
              className={`shrink-0 px-5 py-[14px] text-[10px] font-bold uppercase tracking-[0.18em] border-b-2 transition-all duration-200 whitespace-nowrap
                ${active === s.id ? 'text-white border-brand-blue' : 'text-white/20 border-transparent hover:text-white/50 hover:border-white/15'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function AboutUs() {
  const [imgRef, imgStyle] = useParallax(-0.08);
  const [schRef, schStyle] = useParallax(-0.1);
  const [t1Ref,  t1Style]  = useParallax(-0.02);
  const [t2Ref,  t2Style]  = useParallax(-0.04);
  const [t3Ref,  t3Style]  = useParallax(-0.06);
  const [t4Ref,  t4Style]  = useParallax(-0.08);

  const diffRef = useRef(null);
  useEffect(() => {
    if (!diffRef.current) return;
    gsap.fromTo(diffRef.current.querySelectorAll('.dc'),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out',
        scrollTrigger: { trigger: diffRef.current, start: 'top 80%', once: true } });
  }, []);

  const capRef = useRef(null);
  useEffect(() => {
    if (!capRef.current) return;
    gsap.fromTo(capRef.current.querySelectorAll('.cc'),
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out',
        scrollTrigger: { trigger: capRef.current, start: 'top 75%', once: true } });
  }, []);

  const capabilities = [
    { title: 'Agentic AI',           sub: 'Autonomous agents that reason, plan, and execute.',       icon: Brain,      link: '/services/agentic-ai',             color: 'text-brand-blue', bgc: 'bg-brand-blue/10'  },
    { title: 'AI & Cognitive',        sub: 'GenAI, machine learning, MLOps at scale.',                icon: Zap,        link: '/department/ai-cognitive',         color: 'text-cyan-400',   bgc: 'bg-cyan-500/10'    },
    { title: 'Digital Engineering',   sub: 'Modern software, product design, cloud platforms.',       icon: Code2,      link: '/department/digital-engineering',  color: 'text-violet-400', bgc: 'bg-violet-500/10'  },
    { title: 'Cloud Infrastructure',  sub: 'Cloud-native, hybrid, multi-cloud architecture.',         icon: Layers,     link: '/department/cloud-infrastructure', color: 'text-sky-400',    bgc: 'bg-sky-500/10'     },
    { title: 'Cybersecurity',         sub: 'Zero-trust, compliance, and threat response.',            icon: Shield,     link: '/department/cybersecurity',        color: 'text-emerald-400',bgc: 'bg-emerald-500/10' },
    { title: 'Data & Analytics',      sub: 'Data engineering, BI, and insight platforms.',            icon: TrendingUp, link: '/department/data-analytics',      color: 'text-amber-400',  bgc: 'bg-amber-500/10'   },
  ];

  const leadership = [
    { name: 'C.O.D.E.', title: 'Founder & CEO', bio: 'Visionary technologist who founded Kangqore to bridge technology potential with real-world business execution.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
    { name: 'Open Position', title: 'Chief Technology Officer', bio: 'We are looking for a seasoned engineering leader to drive our technology strategy and AI innovation.', hiring: true },
    { name: 'Open Position', title: 'VP of Delivery', bio: 'A delivery leader to own client success, project excellence, and the Kangqore Zero Distance model.', hiring: true },
  ];

  const diffs = [
    { problem: 'Generalists spread too thin.',     solution: 'Deep specialists across AI, cloud, and modern engineering — not a feature factory.'      },
    { problem: 'Strategy without execution.',       solution: 'We bridge design and delivery — concept through production-deployed systems.'             },
    { problem: 'Technology without governance.',    solution: 'Security, responsible AI, and compliance are foundational in every architecture.'        },
    { problem: 'Siloed delivery models.',           solution: 'Zero distance — shared context, close collaboration, aligned outcomes every sprint.'     },
    { problem: 'Generic, off-the-shelf thinking.', solution: 'Every engagement is purpose-built for your specific context and constraints.'            },
    { problem: 'No continuity post-handoff.',       solution: 'End-to-end — strategy through engineering through operations and growth.'                },
  ];

  return (
    <div className="min-h-screen bg-[#06090f] text-white">
      <SEO
        title={coreSEO.aboutUs.title}
        description={coreSEO.aboutUs.description}
        keywords={coreSEO.aboutUs.keywords}
        url={coreSEO.aboutUs.url}
        schemas={[{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'About Kangqore', url: 'https://kangqore.com/about-us' }]}
      />

      <LeftSidebar />
      <TopNav />

      {/* ══════════════════════════════════════════════════
          HERO — cinematic left-aligned (matches agentic-ai)
      ══════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] overflow-hidden bg-[#06090f]">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-[0.22] scale-105">
          <source src="/videos/business-meeting-6774639.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#06090f]/95 via-[#06090f]/70 to-[#06090f]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06090f] via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '72px 72px' }} />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-blue/[0.06] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/[0.04] blur-[80px] pointer-events-none" />

        <div className="relative h-full flex flex-col justify-center max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-24">
          <FadeIn>
            <div className="inline-flex items-center gap-2 mb-10">
              <span className="w-4 h-px bg-amber-400/50" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400/70">About Kangqore · Est. 2023</span>
            </div>
          </FadeIn>
          <FadeIn delay="60ms">
            <h1 className="text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem] xl:text-[8rem] font-black text-white tracking-tighter leading-[0.88] mb-8 font-display max-w-4xl">
              We Build<br />
              Intelligent<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Enterprises.</span>
            </h1>
          </FadeIn>
          <FadeIn delay="130ms">
            <p className="text-lg sm:text-xl text-white/35 max-w-xl font-light leading-relaxed mb-12">
              End-to-end technology partner for organisations navigating digital transformation, AI adoption, and cloud modernisation at scale.
            </p>
          </FadeIn>
          <FadeIn delay="200ms">
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white text-gray-900 font-bold text-[13px] tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300">
                Talk to our team
                <span className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center group-hover:bg-gray-900 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </span>
              </Link>
              <Link to="/services" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/10 text-[13px] font-bold text-white/40 hover:text-white hover:border-white/25 transition-all duration-300">
                Explore capabilities <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Stats strip pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.06]">
            {[
              { v: '50+', l: 'Projects Delivered' },
              { v: '20+', l: 'Active Partners'    },
              { v: '15+', l: 'Capability Areas'   },
              { v: '5+',  l: 'Innovation Labs'    },
            ].map((s, i) => (
              <div key={i} className="py-7 px-4 text-center group cursor-default">
                <div className="text-2xl sm:text-[1.75rem] font-black text-white group-hover:text-cyan-400 transition-colors duration-300 font-display mb-1">
                  <Counter value={s.v} duration={1400 + i * 200} />
                </div>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover:text-white/45 transition-colors">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHO WE ARE — dark narrative, 7/5 grid
      ══════════════════════════════════════════════════ */}
      <section id="who-we-are" className="py-28 lg:py-40 bg-[#06090f] border-t border-white/[0.04] scroll-mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <FadeIn><Label>What Kangqore Does</Label></FadeIn>
              <FadeIn delay="60ms">
                <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4.5rem] font-black text-white mb-10 tracking-tighter leading-[0.9] font-display">
                  Engineering impact through{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">intelligent systems.</span>
                </h2>
              </FadeIn>
              <FadeIn delay="120ms">
                <p className="text-lg text-white/40 leading-relaxed font-light mb-6 max-w-2xl">
                  Kangqore is a value-driven technology company enabling enterprises and institutions to achieve end-to-end digital transformation through modern engineering and AI-enabled innovation.
                </p>
                <p className="text-lg text-white/40 leading-relaxed font-light max-w-2xl">
                  Our work bridges strategy and execution — turning advanced technologies into measurable business outcomes across AI, cloud, data, security, and digital engineering.
                </p>
              </FadeIn>
              <FadeIn delay="200ms">
                <div className="grid sm:grid-cols-2 gap-8 mt-12 pt-10 border-t border-white/[0.06]">
                  <div>
                    <p className="font-mono text-[9px] text-amber-400 font-bold tracking-widest uppercase mb-3">Mission</p>
                    <p className="text-sm text-white/25 font-light leading-relaxed italic">Design, engineer, and scale intelligent digital systems — secure, adaptable, built for long-term excellence.</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] text-cyan-400 font-bold tracking-widest uppercase mb-3">Vision</p>
                    <p className="text-sm text-white/25 font-light leading-relaxed italic">To be the trusted technology partner for organisations navigating an AI-driven world.</p>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-5 relative group" ref={imgRef} style={imgStyle}>
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] border border-white/[0.07]">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80" alt="Kangqore team"
                  className="w-full h-full object-cover opacity-55 grayscale group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06090f]/85 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest">Platform Status</span>
                    <span className="text-[10px] font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Operational
                    </span>
                  </div>
                  <div className="h-[2px] bg-white/[0.06] rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gradient-to-r from-brand-blue to-cyan-400 w-[88%]" />
                  </div>
                  <div className="flex gap-6">
                    {[['50+','Projects'],['20+','Partners'],['5+','Labs']].map(([v,l],i)=>(
                      <div key={i}>
                        <div className="text-[11px] font-mono text-white font-bold">{v}</div>
                        <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          THE CHALLENGE / THE APPROACH
          (direct mirror of agentic-ai challenge/solution)
      ══════════════════════════════════════════════════ */}
      <section id="challenge" className="py-28 lg:py-40 bg-[#06090f] border-t border-white/[0.04] scroll-mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
            <FadeIn>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-400 mb-6">The Challenge</p>
              <p className="text-2xl sm:text-3xl text-white/55 font-light leading-snug">
                Organisations face growing complexity in digital transformation without the depth, velocity, or governance to execute at enterprise scale.
              </p>
            </FadeIn>
            <FadeIn delay="100ms">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-400 mb-6">The Kangqore Approach</p>
              <p className="text-2xl sm:text-3xl text-white/55 font-light leading-snug">
                Kangqore aligns strategy, engineering, intelligence, and operations into one delivery model — so your teams make better decisions earlier and ship with confidence.
              </p>
            </FadeIn>
          </div>

          {/* Dark CTA bar — agentic-ai style */}
          <FadeIn delay="160ms">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl border border-white/[0.07] bg-white/[0.025]">
              <div>
                <p className="text-base font-bold text-white">Kangqore · Technology Partner</p>
                <p className="text-sm text-white/25 font-light mt-1">Full-stack digital transformation for ambitious organisations</p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <Link to="/services" className="px-5 py-2.5 rounded-full border border-white/10 text-[12px] font-bold text-white/45 hover:text-white hover:border-white/30 transition-all duration-300">
                  Explore Services
                </Link>
                <Link to="/contact" className="px-5 py-2.5 rounded-full bg-white text-gray-900 text-[12px] font-bold hover:scale-[1.02] transition-transform duration-300">
                  Talk to Us →
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BY THE NUMBERS — dark, large animated stats
      ══════════════════════════════════════════════════ */}
      <section id="numbers" className="py-28 lg:py-40 bg-[#06090f] border-t border-white/[0.04] scroll-mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <Label color="text-cyan-400">By the Numbers</Label>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-20 tracking-tight font-display leading-[0.95] max-w-xl">
              Delivered results.<br />
              <span className="text-white/20 font-light italic">Measurable impact.</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border border-white/[0.06] rounded-[2rem] overflow-hidden">
            {[
              { v: '50+', l: 'Projects Delivered', ctx: 'Across AI, cloud, data, and digital engineering.',  icon: TrendingUp, color: 'text-brand-blue' },
              { v: '20+', l: 'Active Partners',     ctx: 'Enterprises, startups, and institutions.',          icon: Users,      color: 'text-cyan-400'   },
              { v: '15+', l: 'Capability Areas',    ctx: 'Cross-disciplinary depth in a single team.',        icon: Layers,     color: 'text-violet-400' },
              { v: '5+',  l: 'Innovation Labs',     ctx: 'R&D units driving emerging technology.',            icon: Zap,        color: 'text-amber-400'  },
            ].map((m, i) => (
              <div key={i} className={`group relative p-10 lg:p-12 hover:bg-white/[0.02] transition-all duration-500 ${i < 3 ? 'border-r border-white/[0.06]' : ''}`}>
                <m.icon className={`w-5 h-5 ${m.color} opacity-35 mb-8 group-hover:opacity-100 transition-opacity duration-400`} />
                <div className={`text-[4rem] sm:text-[5rem] lg:text-[6rem] font-black leading-none mb-3 font-display tracking-tighter ${m.color}`}>
                  <Counter value={m.v} duration={1800 + i * 200} />
                </div>
                <div className="text-sm font-bold text-white/50 mb-2">{m.l}</div>
                <div className="text-[12px] text-white/18 font-light leading-relaxed">{m.ctx}</div>
              </div>
            ))}
          </div>

          {/* Tech logos */}
          <FadeIn delay="200ms">
            <div className="mt-20 pt-14 border-t border-white/[0.04]">
              <p className="text-center text-[9px] font-bold uppercase tracking-[0.22em] text-white/12 mb-10">Technologies & Platforms We Build On</p>
              <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16">
                {[
                  { name: 'OpenAI',       url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
                  { name: 'Anthropic',    url: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg' },
                  { name: 'Google Cloud', url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg' },
                  { name: 'AWS',          url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
                  { name: 'Azure',        url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg' },
                  { name: 'HuggingFace', url: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg' },
                ].map((logo, i) => (
                  <div key={i} className="opacity-12 hover:opacity-35 transition-opacity duration-300">
                    <img src={logo.url} alt={logo.name} className="h-7 max-w-[100px] object-contain filter invert" />
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          OUR STORY — numbered cards (agentic-ai capability style)
      ══════════════════════════════════════════════════ */}
      <section id="story" className="py-28 lg:py-40 bg-[#06090f] border-t border-white/[0.04] scroll-mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <Label color="text-amber-400">Our Story</Label>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-20 tracking-tight font-display leading-[0.95]">
              A journey built on ambition,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">execution, and impact.</span>
            </h2>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-5">
            {[
              { num:'01', badge:'Foundation', year:'2023', title:'Born in Bengaluru',      desc:'Kangqore was founded with a clear mandate — bridge technology potential with real-world business execution. Enterprise-ready digital systems that deliver measurable outcomes.', color:'text-brand-blue', bgc:'bg-brand-blue/10'  },
              { num:'02', badge:'Expansion',  year:'2024', title:'Building Depth',          desc:'Capabilities expanded across AI, cloud engineering, modernisation, automation, and cybersecurity — evolving into a multi-disciplinary technology partner for diverse industries.',  color:'text-cyan-400',   bgc:'bg-cyan-500/10'    },
              { num:'03', badge:'Now',         year:'2025', title:'Engineering the Future', desc:'Today, Kangqore engineers intelligent products, platforms, and services — helping organisations become adaptive, resilient, and future-ready in an AI-driven world.',              color:'text-amber-400',  bgc:'bg-amber-500/10'   },
            ].map((m, i) => (
              <FadeIn key={i} delay={`${i * 100}ms`}>
                <div className="relative group h-full p-8 lg:p-10 rounded-[2rem] border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.035] transition-all duration-500 overflow-hidden">
                  <span className="absolute -bottom-3 -right-1 text-[7.5rem] font-black text-white/[0.025] leading-none font-display select-none pointer-events-none">{m.num}</span>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${m.bgc} mb-6`}>
                    <span className={`font-mono text-[8.5px] font-black uppercase tracking-[0.2em] ${m.color}`}>{m.num} — {m.badge}</span>
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${m.color} mb-4 font-mono`}>{m.year}</p>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-5 font-display leading-tight">{m.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed font-light">{m.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LEADERSHIP — dark circular-photo cards
      ══════════════════════════════════════════════════ */}
      <section id="leadership" className="py-28 lg:py-40 bg-[#06090f] border-t border-white/[0.04] scroll-mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <Label color="text-cyan-400">Leadership</Label>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display leading-[0.95]">
                The people behind Kangqore
              </h2>
              <p className="text-sm text-white/25 font-light max-w-xs lg:text-right pb-1">
                Seasoned operators and technologists building intelligent enterprise systems.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {leadership.map((p, i) => (
              <FadeIn key={i} delay={`${i * 90}ms`}>
                {p.hiring ? (
                  <Link to="/careers"
                    className="group flex flex-col items-center text-center p-10 rounded-[2rem] border-2 border-dashed border-white/[0.06] hover:border-brand-blue/25 hover:bg-white/[0.015] transition-all duration-500 min-h-[300px] justify-center h-full">
                    <div className="w-20 h-20 rounded-full border border-white/[0.07] flex items-center justify-center mb-6 group-hover:border-brand-blue/25 transition-colors duration-500">
                      <Users className="w-7 h-7 text-white/12 group-hover:text-brand-blue/50 transition-colors duration-400" />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-brand-blue/60 group-hover:text-brand-blue mb-3 transition-colors">We're Hiring</p>
                    <h3 className="text-lg font-bold text-white/45 mb-4">{p.title}</h3>
                    <p className="text-sm text-white/20 font-light leading-relaxed mb-6">{p.bio}</p>
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-blue/40 group-hover:text-brand-blue group-hover:gap-3 transition-all">
                      View opening <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ) : (
                  <div className="group flex flex-col items-center text-center p-10 rounded-[2rem] border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.035] transition-all duration-500 h-full">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/[0.08] group-hover:border-brand-blue/35 transition-all duration-500 shadow-[0_0_0_4px_rgba(37,100,234,0.06)]">
                        <img src={p.img} alt={p.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          onError={e => { e.target.style.display = 'none'; }} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#06090f]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 font-display">{p.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-blue mb-5">{p.title}</p>
                    <p className="text-sm text-white/28 font-light leading-relaxed flex-1">{p.bio}</p>
                  </div>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          THE FORMULA — dark 4-col matrix with ghost numbers
          (agentic-ai enablement matrix, now fully dark)
      ══════════════════════════════════════════════════ */}
      <section id="formula" className="py-28 lg:py-40 bg-[#06090f] border-t border-white/[0.04] scroll-mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <Label color="text-amber-400">Formula · KANGQ_OS_V1</Label>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight font-display leading-[0.92] max-w-xl">
                The Kangqore{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400 italic">Formula.</span>
              </h2>
              <p className="text-sm text-white/22 italic max-w-xs lg:text-right leading-relaxed font-light pb-1">
                Four governing principles every engagement runs on.
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-px bg-white/[0.035] rounded-[2.5rem] overflow-hidden lg:grid-cols-4">
            {[
              { title: 'Strategy',     id: 'KANG_STR', Icon: Target,  desc: 'Business analysis, technology roadmapping, and architecture design aligned to your goals.',  color: 'text-brand-blue', bgc: 'bg-brand-blue/10'  },
              { title: 'Engineering',  id: 'KANG_ENG', Icon: Code2,   desc: 'High-velocity development, cloud-native systems, and modern platform delivery.',              color: 'text-cyan-400',   bgc: 'bg-cyan-500/10'    },
              { title: 'Intelligence', id: 'KANG_AI',  Icon: Brain,   desc: 'AI, automation, and data engineering embedded by design — not bolted on.',                    color: 'text-violet-400', bgc: 'bg-violet-500/10'  },
              { title: 'Operations',   id: 'KANG_OPS', Icon: Shield,  desc: 'Managed services, governance, security, and continuous optimisation.',                        color: 'text-amber-400',  bgc: 'bg-amber-500/10'   },
            ].map((m, i) => {
              const refs   = [t1Ref, t2Ref, t3Ref, t4Ref];
              const styles = [t1Style, t2Style, t3Style, t4Style];
              return (
                <div key={i} ref={refs[i]} style={styles[i]}
                  className="relative p-10 lg:p-12 bg-[#06090f] hover:bg-white/[0.02] transition-all duration-500 group overflow-hidden">
                  <span className="absolute -bottom-3 -right-1 text-[6.5rem] font-black text-white/[0.03] leading-none font-display select-none pointer-events-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="absolute top-6 right-7 font-mono text-[8px] text-white/12 font-bold tracking-widest">{m.id}</div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.bgc} mb-8 group-hover:scale-110 transition-transform duration-400`}>
                    <m.Icon size={20} className={m.color} />
                  </div>
                  <h4 className={`text-xl font-black ${m.color} mb-4 font-display italic tracking-tight`}>{m.title}</h4>
                  <p className="text-sm text-white/28 leading-relaxed font-light">{m.desc}</p>
                  <div className={`mt-8 w-6 h-[2px] ${m.bgc} rounded-full group-hover:w-16 transition-all duration-700`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SCHEMATIC — massive vision text on dark
      ══════════════════════════════════════════════════ */}
      <section className="py-44 lg:py-56 bg-[#06090f] border-t border-white/[0.04] text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[55vh] rounded-full bg-brand-blue/[0.05] blur-[150px] pointer-events-none" />
        <div className="flex items-center justify-center gap-4 mb-14">
          <div className="h-px w-12 bg-white/[0.08]" />
          <span className="text-[9px] font-black text-white/15 uppercase tracking-[0.3em]">Our Vision</span>
          <div className="h-px w-12 bg-white/[0.08]" />
        </div>
        <div ref={schRef} style={schStyle} className="relative z-10 px-6">
          <p className="text-[3rem] sm:text-[5rem] lg:text-[7.5rem] xl:text-[9.5rem] font-black text-white tracking-tighter leading-[0.86] mb-10 font-display">
            Intelligent<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-blue-400 to-cyan-400">Enterprises.</span>
          </p>
          <p className="text-lg text-white/18 font-light italic max-w-2xl mx-auto">
            Your organisation should run on systems that reason, adapt, and evolve — not systems that constrain.
          </p>
        </div>
        <div className="mt-20 inline-flex flex-wrap justify-center gap-16 text-center relative z-10">
          {[['Purpose','CLEAR'],['Depth','ABSOLUTE'],['Impact','EXPONENTIAL']].map(([l,v],i)=>(
            <div key={i} className="flex flex-col gap-1.5">
              <div className="font-mono text-[9px] text-white/12 tracking-widest uppercase">{l}</div>
              <div className="text-xs font-bold text-white/30 tracking-widest">{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHAT WE BUILD — dark numbered cards (agentic-ai capability card style)
      ══════════════════════════════════════════════════ */}
      <section id="capabilities" className="py-28 lg:py-40 bg-[#06090f] border-t border-white/[0.04] scroll-mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <Label color="text-cyan-400">What We Build</Label>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display leading-[0.95] max-w-2xl">
                Capabilities that span<br />the full technology stack.
              </h2>
              <Link to="/services" className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/22 hover:text-white/60 transition-colors flex-shrink-0 pb-1">
                All services <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>

          <div ref={capRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((c, i) => (
              <Link key={i} to={c.link}
                className="cc group relative p-8 lg:p-10 rounded-[2rem] border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-500 overflow-hidden block">
                <span className="absolute -bottom-3 -right-1 text-[6.5rem] font-black text-white/[0.025] leading-none font-display select-none pointer-events-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${c.bgc} mb-6`}>
                  <span className={`font-mono text-[8px] font-black uppercase tracking-[0.2em] ${c.color}`}>
                    {String(i + 1).padStart(2, '0')} — CAPABILITY
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bgc} mb-5 group-hover:scale-110 transition-transform duration-400`}>
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 font-display">{c.title}</h3>
                <p className="text-sm text-white/28 font-light leading-relaxed mb-6">{c.sub}</p>
                <span className={`inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] ${c.color} opacity-40 group-hover:opacity-100 group-hover:gap-3 transition-all duration-300`}>
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          THE SHIFT — vendor vs Kangqore comparison
          (agentic-ai "shift from X to Y" pattern)
      ══════════════════════════════════════════════════ */}
      <section className="py-28 lg:py-40 bg-[#06090f] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <Label color="text-amber-400">Why It Matters</Label>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-16 tracking-tight font-display leading-[0.95]">
              The shift from technology vendor<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">to transformation partner.</span>
            </h2>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-5 mb-14">
            <FadeIn>
              <div className="p-8 lg:p-10 rounded-[2rem] border border-white/[0.05] bg-white/[0.01]">
                <p className="font-mono text-[9px] text-white/18 uppercase tracking-widest mb-8">Traditional Vendor</p>
                {['Executes tasks without context','Optimises for hours billed','Delivers outputs, not outcomes','Hands off at go-live','Technology-first, business-second'].map((t, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full border border-white/8 flex items-center justify-center mt-0.5 shrink-0">
                      <div className="w-1.5 h-0.5 bg-white/12" />
                    </div>
                    <span className="text-sm text-white/18 font-light">{t}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay="80ms">
              <div className="p-8 lg:p-10 rounded-[2rem] border border-brand-blue/18 bg-brand-blue/[0.04] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/[0.05] to-transparent pointer-events-none" />
                <p className="font-mono text-[9px] text-brand-blue uppercase tracking-widest mb-8">Kangqore Approach</p>
                {['Deep business context in every sprint','Measured by outcomes, not hours','Strategy + engineering + shipped results','Continuous partnership post-launch','Business-first, technology-enabled'].map((t, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4 relative z-10">
                    <div className="w-4 h-4 rounded-full bg-brand-blue/15 flex items-center justify-center mt-0.5 shrink-0">
                      <Check className="w-2.5 h-2.5 text-brand-blue" />
                    </div>
                    <span className="text-sm text-white/50 font-light">{t}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn><p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/15 mb-6">What Sets Us Apart</p></FadeIn>
          <div ref={diffRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diffs.map((d, i) => (
              <div key={i} className="dc group relative p-7 rounded-2xl border border-white/[0.05] bg-white/[0.015] hover:border-white/[0.09] hover:bg-white/[0.025] transition-all duration-400 overflow-hidden">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/12 group-hover:bg-white/5 mt-1.5 shrink-0 transition-colors duration-500" />
                  <p className="text-sm font-bold text-white/25 italic group-hover:text-white/12 transition-colors duration-500 leading-snug">{d.problem}</p>
                </div>
                <div className="w-6 h-px bg-white/[0.05] group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-brand-blue group-hover:to-cyan-400 mb-4 transition-all duration-700 ease-out" />
                <div className="flex items-start gap-3 translate-y-1 opacity-40 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-blue scale-0 group-hover:scale-100 mt-1.5 shrink-0 transition-transform duration-500 origin-center" />
                  <p className="text-sm text-white/45 font-light leading-relaxed group-hover:text-white/65 transition-colors duration-500">{d.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ESG — dark image cards + location tiles
      ══════════════════════════════════════════════════ */}
      <section id="esg" className="py-28 lg:py-40 bg-[#06090f] border-t border-white/[0.04] scroll-mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <FadeIn>
            <Label color="text-cyan-400">ESG & Responsibility</Label>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-20 tracking-tight font-display leading-[0.95]">
              Responsible innovation —<br />
              <span className="text-white/18 font-light italic">for the planet and for people.</span>
            </h2>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            {[
              { tag:'Planet', tagColor:'text-emerald-400', Icon: Leaf,  iconBg:'bg-emerald-500/10', title:'Prioritising the planet', body:'We design energy-efficient architectures, promote ethical AI practices, and build sustainable systems — ensuring technology drives progress while respecting environmental responsibility.', img:'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1200&q=80' },
              { tag:'People', tagColor:'text-brand-blue',  Icon: Heart, iconBg:'bg-brand-blue/10',  title:'A people-first culture',  body:'We foster a culture of ownership, continuous learning, and collaboration — empowering individuals to solve meaningful problems and grow alongside the organisation.',              img:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80' },
            ].map((s, i) => (
              <FadeIn key={i} delay={`${i * 80}ms`}>
                <div className="group relative rounded-[2rem] overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500" style={{ minHeight: '440px' }}>
                  <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:opacity-35 group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06090f]/95 via-[#06090f]/55 to-[#06090f]/20" />
                  <div className="relative z-10 flex flex-col h-full p-10 lg:p-12 justify-end" style={{ minHeight: '440px' }}>
                    <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center mb-6`}>
                      <s.Icon className={`w-5 h-5 ${s.tagColor}`} />
                    </div>
                    <p className={`text-[9px] font-black uppercase tracking-[0.22em] ${s.tagColor} mb-3`}>Impact on {s.tag}</p>
                    <h3 className="text-2xl font-bold text-white mb-4 font-display">{s.title}</h3>
                    <p className="text-sm text-white/30 font-light leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {[
              { Icon: Globe,  tagColor:'text-brand-blue', title:'Global reach, local depth', body:'Partnering across BFSI, Retail, Healthcare, Manufacturing, E-commerce, Legal-Tech, Education, and emerging digital-first sectors worldwide.', link:'/case-studies', cta:'View case studies' },
              { Icon: MapPin, tagColor:'text-amber-400',  title:'Headquartered in Bengaluru', body:'With operational presence in Jamshedpur and a growing national footprint — staying close to clients wherever they operate.',               link:'/contact',      cta:'Get in touch'    },
            ].map((c, i) => (
              <FadeIn key={i} delay={`${i * 80}ms`}>
                <div className="group p-8 lg:p-10 rounded-[2rem] border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-500">
                  <c.Icon className={`w-6 h-6 ${c.tagColor} opacity-50 mb-6 group-hover:opacity-100 transition-opacity`} />
                  <h3 className="text-lg font-bold text-white mb-3 font-display">{c.title}</h3>
                  <p className="text-sm text-white/28 font-light leading-relaxed mb-6">{c.body}</p>
                  <Link to={c.link} className={`inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] ${c.tagColor} opacity-45 group-hover:opacity-100 group-hover:gap-3 transition-all`}>
                    {c.cta} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA — dark full-width
      ══════════════════════════════════════════════════ */}
      <section className="py-36 lg:py-52 bg-[#06090f] border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] rounded-full bg-brand-blue/[0.07] blur-[160px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center relative z-10">
          <FadeIn>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-white/[0.07]" />
              <span className="text-[9px] font-black text-white/18 uppercase tracking-[0.3em]">Ready to Start?</span>
              <div className="h-px w-12 bg-white/[0.07]" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-8 tracking-tight font-display leading-[1.04]">
              Let's build the future —<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400 italic font-light">intelligently.</span>
            </h2>
          </FadeIn>
          <FadeIn delay="80ms">
            <p className="text-lg text-white/28 leading-relaxed font-light mb-14 max-w-3xl mx-auto">
              Whether you're modernising platforms, adopting AI, or building something entirely new — Kangqore is ready to partner across the full transformation lifecycle.
            </p>
          </FadeIn>
          <FadeIn delay="160ms">
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/contact" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300">
                <span className="font-bold text-[14px] tracking-wide">Talk to our team</span>
                <span className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300">
                  <ArrowRight className="w-4 h-4 text-white" />
                </span>
              </Link>
              <div className="flex items-center gap-5">
                <Link to="/services" className="group text-[11px] font-bold uppercase tracking-[0.18em] text-white/20 hover:text-white/50 transition-colors flex items-center gap-2">
                  Services <ArrowRight className="w-3 h-3 text-cyan-400/40 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="w-px h-4 bg-white/[0.08]" />
                <Link to="/careers" className="group text-[11px] font-bold uppercase tracking-[0.18em] text-white/20 hover:text-white/50 transition-colors flex items-center gap-2">
                  Careers <ArrowRight className="w-3 h-3 text-cyan-400/40 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
