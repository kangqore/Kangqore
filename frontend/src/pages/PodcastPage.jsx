import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import EqoreShowSection from '../components/podcast/EqoreShowSection';

const PodcastPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Podcasts | Kangqore Insights"
        description="Listen to The eQORE Show and other podcasts from Kangqore, where we dive into the ideas, issues, and innovations reshaping enterprise architecture."
      />
      
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-28 bg-white dark:bg-[#0b101a] overflow-hidden">
        {/* Subtle Background Effects */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-blue/5 dark:bg-brand-blue/10 blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-50" />
          <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full bg-cyan-400/5 dark:bg-cyan-400/10 blur-3xl mix-blend-multiply dark:mix-blend-screen opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">Original Audio Series</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 font-display">
            Kangqore <span className="bg-brand-gradient bg-clip-text text-transparent">Podcasts</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Tune in to deep dives, strategic insights, and provocative conversations about the future of enterprise AI, cloud architecture, and digital transformation.
          </p>
        </div>
      </section>

      {/* The eQORE Show */}
      <div className="border-t border-gray-200 dark:border-white/10">
        <EqoreShowSection />
      </div>

    </>
  );
};

export default PodcastPage;
