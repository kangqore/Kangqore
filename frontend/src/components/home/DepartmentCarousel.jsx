// ─── DepartmentCarousel — homepage 6-dept showcase ────────────────────────────
// Sources department data from the canonical single-source-of-truth
// (frontend/src/data/departmentsData.js + servicesData.js) so this carousel
// stays in lock-step with the 6-department × 61-service architecture and its
// 24 dataArchitecture invariant tests.
//
// Per Phase G locked constraints:
//  - All dept links use canonical `/departments/<slug>` (plural). The legacy
//    `/department/<old-slug>` pattern is forbidden — it would 301-hop through
//    the Express redirect middleware and dilute link equity.
//  - No hardcoded department data. Names, taglines, descriptions, and the
//    curated top-services list all derive from canonical sources.
//
// The only per-card local data is presentation-layer: the background image
// path and the cover-fit class overrides (some cards need `object-[center_top]`
// or `scale-[1.25]` so the image hero composition reads well at card size).
// ────────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { departmentsData, departmentsList } from '../../data/departmentsData';
import { servicesData } from '../../data/servicesData';

// Per-slug presentation overrides. Image paths point to the 6 PNGs in
// /public/images/departments/. `imageClass` falls back to a default when
// the dept-specific entry has no `imageClass` key.
const DEPT_PRESENTATION = {
  cognition: {
    image: '/images/departments/dept_bg_1_1778893880482.png',
  },
  foundry: {
    image: '/images/departments/dept_bg_2_1778893900884.png',
  },
  reimagine: {
    image: '/images/departments/dept_bg_3_1778893917993.png',
  },
  shield: {
    image: '/images/departments/dept_bg_4_1778893933258.png',
    imageClass:
      'object-cover object-[center_top] scale-[1.25] transition-transform duration-700 group-hover:scale-[1.35]',
  },
  platforms: {
    image: '/images/departments/dept_bg_5_1778893951306.png',
  },
  growth: {
    image: '/images/departments/dept_bg_6_1778893966258.png',
    imageClass:
      'object-cover object-[70%_top] scale-[1.25] transition-transform duration-700 group-hover:scale-[1.35]',
  },
};

const DEFAULT_IMAGE_CLASS =
  'object-cover transition-transform duration-700 group-hover:scale-110';

// Build the carousel view once at module load — keeps the render loop simple
// and means any canonical-data change is picked up at hot-reload time.
const carouselDepartments = departmentsList.map((slug) => {
  const dept = departmentsData[slug];
  const presentation = DEPT_PRESENTATION[slug] || {};
  return {
    slug,
    title: dept.name,
    subtitle: dept.tagline,
    description: dept.description,
    link: `/departments/${slug}`,
    image: presentation.image,
    imageClass: presentation.imageClass || DEFAULT_IMAGE_CLASS,
    topServices: dept.heroServiceSlugs.map((s) => servicesData[s].name),
  };
});

const DepartmentCarousel = () => {
  const scrollContainerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    let intervalId;
    if (!isHovered) {
      intervalId = setInterval(() => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
          const maxScroll = scrollWidth - clientWidth;

          // If we are at the end, snap back to the beginning
          if (scrollLeft >= maxScroll - 10) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollByAmount('right');
          }
        }
      }, 3000); // 3 seconds
    }
    return () => clearInterval(intervalId);
  }, [isHovered]);

  const scrollByAmount = (direction) => {
    if (scrollContainerRef.current) {
      // Scroll by approximately one card width + gap
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-black overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-gray-400 dark:bg-gray-500"></div>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              What we offer
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
              Explore <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">Kangqore Capabilities</span>.
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-md lg:text-right">
              6 Departments. 61 Services. One Execution Ecosystem.
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 scrollbar-hide"
            style={{
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none'  /* IE and Edge */
            }}
          >
            {/* Custom CSS to hide scrollbar for Webkit browsers is typically added in index.css,
                but we use inline styles to be safe, plus a class that can be defined globally. */}
            <style dangerouslySetInnerHTML={{__html: `
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}} />

            {carouselDepartments.map((dept) => (
              <div
                key={dept.slug}
                className="group relative flex-shrink-0 w-[320px] sm:w-[360px] h-[480px] rounded-[2rem] p-10 snap-start transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(37,100,234,0.2)] overflow-hidden cursor-pointer"
              >
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-[2rem]">
                  <img
                    src={dept.image}
                    alt={dept.title}
                    className={`w-full h-full ${dept.imageClass}`}
                  />
                  {/* Default Dark Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 transition-opacity duration-500 group-hover:opacity-0"></div>
                </div>

                {/* Gradient Overlay (Visible on Hover - fully opaque to hide image) */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex flex-col h-full">
                    <h3 className="text-3xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-1 shrink-0">
                      {dept.title}
                    </h3>
                    <p className="text-sm font-semibold text-brand-cyan mb-6 group-hover:text-white transition-colors duration-300 shrink-0">
                      {dept.subtitle}
                    </p>

                    {/* Description vs Top Services container */}
                    <div className="relative flex-1">
                      {/* Short Description (Visible by default, hidden on hover) */}
                      <p className="absolute inset-0 text-gray-300 leading-relaxed transition-all duration-500 opacity-100 group-hover:opacity-0 translate-y-0 group-hover:translate-y-4">
                        {dept.description}
                      </p>

                      {/* Top Services List (Hidden by default, visible on hover) */}
                      <ul className="absolute inset-0 space-y-3 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                        {dept.topServices.map((service, sIdx) => (
                          <li key={sIdx} className="flex items-start text-white/90 text-sm font-medium">
                            <span className="mr-2 text-white opacity-70">✦</span>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    to={dept.link}
                    className="inline-flex items-center text-white font-bold w-fit mt-4 shrink-0"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Controls (Progress Bar & Arrows) */}
        <div className="mt-8 flex items-center justify-between gap-8">
          {/* Progress Bar Track */}
          <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
            {/* Progress Indicator */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] rounded-full transition-all duration-150 ease-out"
              style={{ width: `${Math.max(5, scrollProgress)}%` }} // Minimum width of 5% so it's always visible
            />
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => scrollByAmount('left')}
              className="p-3 rounded-full bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90 transition-all focus:outline-none"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollByAmount('right')}
              className="p-3 rounded-full bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:opacity-90 transition-all focus:outline-none"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DepartmentCarousel;
