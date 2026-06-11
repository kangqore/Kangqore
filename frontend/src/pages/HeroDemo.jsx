// Demo page — Superside-style hero for Product Strategy & Design
// Preview at: /demo/hero

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import FloatingButtons from '../components/FloatingButtons';
import PSEDRuler from '../components/services/reimagine/PSEDRuler';

// ─── Typewriter badge ─────────────────────────────────────────────────────────
const TypewriterText = ({ text, delay = 38 }) => {
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx < text.length) {
      const t = setTimeout(() => {
        setDisplayed(p => p + text[idx]);
        setIdx(p => p + 1);
      }, delay);
      return () => clearTimeout(t);
    }
  }, [idx, text, delay]);
  return (
    <span className="relative inline-block">
      <span className="opacity-0">{text}</span>
      <span className="absolute left-0 top-0 whitespace-nowrap">{displayed}</span>
    </span>
  );
};

// ─── Capability strip data ─────────────────────────────────────────────────────
const CAPABILITIES = [
  { label: 'Product Strategy',          color: '#22D3EE' },
  { label: 'UX / UI Design',            color: '#60A5FA' },
  { label: 'Design Systems',            color: '#A78BFA' },
  { label: 'Rapid Prototyping',         color: '#FB923C' },
  { label: 'User & Market Research',    color: '#34D399' },
  { label: 'Launch & Adoption',         color: '#F472B6' },
  { label: 'Maturity Assessment',       color: '#FDE047' },
  { label: 'Design-to-Build Alignment', color: '#E8614A' },
];

const STRIP = [...CAPABILITIES, ...CAPABILITIES, ...CAPABILITIES];

export default function HeroDemo() {
  const [showFullMenu, setShowFullMenu] = useState(false);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: 'var(--page-bg)' }}>

      {/* Top utility bar + main navbar */}
      <Header onMenuClick={() => setShowFullMenu(true)} />

      {/* PSEDRuler — renders via portal to document.body */}
      <PSEDRuler />

      {/* ─── White-space frame — p-2 creates 8px border on all sides ─────── */}
      <div className="p-2 h-screen" style={{ backgroundColor: 'var(--page-bg)' }}>

        {/* ─── HERO (fills the frame) ──────────────────────────────────────── */}
        <div className="relative w-full h-full overflow-hidden rounded-xl text-white">

          {/* Full-bleed background image */}
          <img
            src="/images/happy_team.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Left-to-right gradient: dark left, transparent right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10 pointer-events-none" />

          {/* Top/bottom vignette for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

          {/* ── Hero content ─────────────────────────────────────────────── */}
          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16">
              <div className="max-w-[62%] mt-[1cm]">

                {/* Typewriter badge */}
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                  <p className="text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase">
                    <TypewriterText text="Design what matters. Build what wins." />
                  </p>
                </div>

                {/* H1 */}
                <h1 className="text-[2.6rem] sm:text-[3.4rem] lg:text-[4.4rem] xl:text-[5.2rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-white mb-5 drop-shadow-2xl">
                  Product Strategy &{' '}
                  <span className="bg-brand-gradient bg-clip-text text-transparent">
                    Design.
                  </span>
                </h1>


                {/* Description */}
                <p className="text-base sm:text-lg text-white/50 leading-[1.8] max-w-[520px] mb-12 font-medium">
                  Kangqore helps organizations define better products, design stronger
                  user experiences, and turn ideas into execution-ready outcomes.
                </p>

                {/* 2 CTAs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                  >
                    Talk To Our Experts
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>

                  <a
                    href="#capabilities"
                    className="group inline-flex items-center gap-2 px-6 py-4 text-white/55 hover:text-white text-sm font-bold tracking-wide transition-colors duration-200"
                  >
                    Explore Capabilities
                    <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>

              </div>
            </div>
          </div>

          {/* ── Capability strip — shares visual line with the "+" FAB ──────── */}
          {/* Strip is absolute bottom-0 (~8px from viewport edge due to p-2)  */}
          {/* "+" FAB is fixed bottom-8 (32px) — floats within the strip band   */}
          <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/[0.08] bg-black/50 backdrop-blur-xl overflow-hidden">
            <div
              className="flex items-center"
              style={{
                animation: 'strip-scroll 32s linear infinite',
                width: 'max-content',
              }}
            >
              {STRIP.map((cap, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-7 py-4 border-r border-white/[0.07] flex-shrink-0 cursor-default group"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300 group-hover:scale-150"
                    style={{ backgroundColor: cap.color, boxShadow: `0 0 6px ${cap.color}` }}
                  />
                  <span className="text-[11px] font-bold tracking-[0.12em] text-white/40 uppercase whitespace-nowrap group-hover:text-white/80 transition-colors duration-200">
                    {cap.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FloatingButtons — "+" FAB sits at fixed bottom-8, within the strip band */}
      <FloatingButtons showFullMenu={showFullMenu} setShowFullMenu={setShowFullMenu} />

      {/* ─── Scroll indicator ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-300 dark:text-white/20 text-sm tracking-widest uppercase font-bold">
        <div className="w-px h-16 bg-gradient-to-b from-gray-300 dark:from-white/20 to-transparent" />
        Demo — scroll continues here
      </div>

      {/* ─── Keyframes ────────────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes strip-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes strip-scroll { 0%, 100% { transform: translateX(0); } }
        }
      ` }} />

    </div>
  );
}
