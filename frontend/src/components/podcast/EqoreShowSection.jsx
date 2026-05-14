import React from 'react';
import { ArrowRight, Headphones } from 'lucide-react';
import EqoreAudioPlayer from './EqoreAudioPlayer';

// ============================================================================
// THE eQORE SHOW — Podcast Section (McKinsey-inspired layout)
// ============================================================================
import { usePodcast } from '../../context/PodcastContext';

const EqoreShowSection = () => {
  return (
    <section id="eqore-show" className="relative w-full py-28 md:py-36 lg:py-44 bg-black overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* ── Header — matches "Explore our services" exactly ── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16 lg:mb-20">
          {/* Left Side — Title */}
          <div className="lg:w-1/2">
            <span className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-4 block">
              Podcast
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              The eQORE{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
                Show
              </span>
            </h2>
          </div>
          
          {/* Right Side — Description + Listen Button */}
          <div className="lg:w-1/2 lg:pt-8 flex flex-col items-start gap-6">
            <p className="text-gray-400 text-lg lg:text-xl leading-relaxed">
              A shortcut to clarity in a noisy world, The eQORE Show dives into the ideas, issues, and innovations reshaping enterprise architecture.
            </p>
            <button
              onClick={() => document.getElementById('eqore-show-player')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-blue-500 font-semibold hover:text-blue-400 group"
            >
              Listen here
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── Featured Episode Card ── */}
        <div className="bg-white rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
          
          {/* Card Content — Left Side */}
          <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-widest">May 11, 2026</p>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight flex items-center gap-2 group cursor-pointer">
                Agentic Consent: The Permission Problem Nobody Is Solving
                <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">❯</span>
              </h3>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-6">
                Host: eQORE <span className="text-gray-300 mx-2">|</span> Produced by: Kangqore
              </p>
              <div className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl space-y-4">
                <p>At Kangqore — this is foundational to everything we build. Across all 15 departments. Across all 61 services. From Agentic AI to AI Governance. From Cybersecurity to Digital Transformation. From our Engineering Foundry to our Quality Engineering & Assurance practice.</p>
                <p className="font-medium text-gray-800">Because we believe intelligence only earns the right to scale when it scales with trust.</p>
              </div>
            </div>

            {/* Custom Audio Player */}
            <div id="eqore-show-player" className="w-full mt-4">
              <EqoreAudioPlayer src="/Podcasts/Ep-1.mp3" />
            </div>
          </div>

          {/* Card Image — Right Side */}
          <div className="w-full md:w-5/12 relative min-h-[300px] md:min-h-full">
            <img 
              src="/images/Ep-1.png" 
              alt="Agentic Consent Podcast Episode Cover" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
          </div>

          {/* Floating Headphones Decorator */}
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full shadow-lg flex items-center justify-center transform -rotate-12">
               <Headphones className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EqoreShowSection;
