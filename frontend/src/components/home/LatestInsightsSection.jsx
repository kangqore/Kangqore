import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LatestInsightsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  };

  return (
    <section className="py-24 bg-white text-gray-900 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-gray-400"></div>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
              testimonials
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Trusted by <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">leaders</span>.
            </h2>
          </div>
        </div>

        {/* Main Insights Layout */}
        <motion.div 
          className="flex flex-col gap-10 lg:gap-14 w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          
          {/* ── TOP FEATURED ITEM (Neon Waves Banner + Overlapping Dark Card) ── */}
          <motion.div variants={itemVariants} className="relative w-full flex flex-col lg:flex-row items-center min-h-0 lg:min-h-[380px]">
            {/* Neon Waves Media Banner */}
            <div className="w-full lg:w-[74%] h-[260px] sm:h-[320px] lg:h-[380px] rounded-xl overflow-hidden relative shadow-2xl border border-black/[0.05]">
              <img 
                src="/images/latest_insights_neon_waves.png" 
                alt="AI meets the grid: Shaping the data center power play" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/50 pointer-events-none" />
            </div>

            {/* Overlapping Dark Card (Top Right) */}
            <div className="w-full lg:w-[440px] lg:absolute lg:right-0 bg-[#1b1f28] p-8 lg:p-10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-10 mt-[-40px] lg:mt-0 border border-white/[0.06] flex flex-col justify-between min-h-[260px] lg:min-h-[300px]">
              <div>
                <p className="text-xs sm:text-sm font-normal text-gray-400 mb-5 flex items-center gap-2">
                  <span className="inline-block w-4 h-[1px] bg-gray-400" />
                  Report
                </p>
                <h3 className="text-xl sm:text-2xl font-normal text-white leading-snug mb-6 font-sans">
                  AI meets the grid: Shaping the data center power play
                </h3>
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase font-mono block">
                  CAPGEMINI RESEARCH INSTITUTE
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── BOTTOM ASYMMETRIC ROW ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full mt-4 lg:mt-6">
            
            {/* Bottom-Left Solid Navy Blue Card + Pill CTA */}
            <div className="lg:col-span-4 flex flex-col gap-6 w-full">
              <div className="bg-[#1a3458] p-8 lg:p-10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/[0.06] flex flex-col justify-between min-h-[300px] lg:min-h-[340px]">
                <div>
                  <p className="text-xs sm:text-sm font-normal text-slate-300 mb-5 flex items-center gap-2">
                    <span className="inline-block w-4 h-[1px] bg-slate-300" />
                    Capgemini Research Institute
                  </p>
                  <h3 className="text-xl sm:text-2xl font-normal text-white leading-snug mb-6 font-sans">
                    Open source: Key to reclaiming public sector digital sovereignty
                  </h3>
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 tracking-[0.2em] uppercase font-mono block">
                    CAPGEMINI RESEARCH INSTITUTE
                  </span>
                </div>
              </div>

              {/* Pill Button: More testimonials -> */}
              <div className="pt-2">
                <Link 
                  to="/testimonials"
                  viewTransition
                  className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-gray-900 text-gray-900 text-sm font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 group"
                >
                  More testimonials
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>


            {/* Bottom-Right Overlapping Card + Blue Leaf Banner */}
            <div className="lg:col-span-8 relative flex flex-col-reverse lg:flex-row items-center w-full min-h-0 lg:min-h-[380px]">
              
              {/* Overlapping Dark Card (Left side of right item) */}
              <div className="w-full lg:w-[400px] lg:absolute lg:left-0 bg-[#1b1f28] p-8 lg:p-10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-10 mt-[-40px] lg:mt-0 border border-white/[0.06] flex flex-col justify-between min-h-[240px] lg:min-h-[290px]">
                <div>
                  <p className="text-xs sm:text-sm font-normal text-gray-400 mb-5 flex items-center gap-2">
                    <span className="inline-block w-4 h-[1px] bg-gray-400" />
                    Report
                  </p>
                  <h3 className="text-xl sm:text-2xl font-normal text-white leading-snug mb-6 font-sans">
                    Data-powered Innovation Review | Wave 12
                  </h3>
                </div>
              </div>

              {/* Blue Leaf Media Banner (Right side) */}
              <div className="w-full lg:w-[70%] lg:ml-auto h-[260px] sm:h-[320px] lg:h-[380px] rounded-xl overflow-hidden relative shadow-2xl border border-white/[0.04]">
                <img 
                  src="/images/latest_insights_blue_leaf.png" 
                  alt="Data-powered Innovation Review | Wave 12" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />
              </div>

            </div>

          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};

export default LatestInsightsSection;
