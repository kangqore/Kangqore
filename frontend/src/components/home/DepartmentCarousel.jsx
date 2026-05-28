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
  const getCardClasses = (slug) => {
    switch (slug) {
      case 'shield':
        return 'col-span-1 sm:row-span-2 row-span-1 h-[380px] sm:h-[772px] lg:h-[812px]';
      case 'growth':
        return 'sm:col-span-2 col-span-1 row-span-1 h-[380px] lg:h-[400px]';
      default:
        return 'col-span-1 row-span-1 h-[380px] lg:h-[400px]';
    }
  };

  return (
    <section className="py-24 bg-[#F5F5F7] dark:bg-[#0a0a0c] overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        .bento-desc {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          visibility: visible;
        }
        .group:hover .bento-desc {
          opacity: 0;
          transform: translateY(12px);
          visibility: hidden;
          pointer-events: none;
        }
        .bento-services {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          pointer-events: none;
          visibility: hidden;
        }
        .group:hover .bento-services {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          visibility: visible;
        }
      `}} />
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-gray-400 dark:bg-gray-700"></div>
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

        {/* Bento Grid */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 sm:grid-rows-auto md:grid-rows-2 grid-cols-1">
          {carouselDepartments.map((dept) => {
            const cardPlacement = getCardClasses(dept.slug);
            return (
              <Link
                key={dept.slug}
                to={dept.link}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_20px_40px_rgba(37,100,234,0.15)] transition-all duration-500 hover:-translate-y-1 block ${cardPlacement}`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
                  <img
                    src={dept.image}
                    alt={dept.title}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${dept.imageClass}`}
                  />
                  {/* Subtle overall dark tint for contrast */}
                  <div className="absolute inset-0 bg-black/25 z-[1] group-hover:bg-black/15 transition-colors duration-500" />
                  
                  {/* Premium top gradient vignette */}
                  <div
                    className="absolute inset-x-0 top-0 h-1/2 z-[2]"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.45) 45%, rgba(0, 0, 0, 0) 100%)',
                    }}
                  />
                </div>

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2564ea]/90 to-[#4ab6d4]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                {/* Content Overlay */}
                <div className="relative z-20 h-full flex flex-col justify-between p-8 lg:p-10">
                  <div className="flex flex-col h-full">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-1 shrink-0">
                      {dept.title}
                    </h3>
                    <p className="text-xs lg:text-sm font-semibold text-brand-cyan mb-6 group-hover:text-white transition-colors duration-300 shrink-0">
                      {dept.subtitle}
                    </p>

                    {/* Description vs Top Services container */}
                    <div className="relative flex-1">
                      {/* Short Description (Visible by default, hidden on hover) */}
                      <p className="bento-desc absolute inset-0 text-white/90 leading-relaxed text-sm lg:text-[15px]">
                        {dept.description}
                      </p>

                      {/* Top Services List (Hidden by default, visible on hover) */}
                      <ul className="bento-services absolute inset-0 space-y-2.5">
                        <span className="block text-xs font-bold uppercase tracking-widest text-brand-cyan mb-2.5">Key Services:</span>
                        {dept.topServices.slice(0, 6).map((service, sIdx) => (
                          <li key={sIdx} className="flex items-start text-white/90 text-[13px] lg:text-sm font-medium">
                            <span className="mr-2 text-brand-cyan opacity-80">✦</span>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Floating Action Link Button */}
                  <div className="inline-flex items-center text-white font-bold w-fit mt-4 shrink-0 transition-all duration-300 group-hover:translate-x-1.5 text-sm lg:text-base">
                    Learn More
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default DepartmentCarousel;

