import React, { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { departmentsData, departmentsList } from '../../data/departmentsData';
import { servicesData } from '../../data/servicesData';
import { useIsRail } from '../services/shared/mobileRail';

const carouselDepartments = departmentsList.map((slug, index) => {
  const dept = departmentsData[slug];
  const bgImage = '/images/capabilities/agentic-governed-autonomy.png';
  return {
    n: String(index + 1).padStart(2, '0'),
    slug,
    title: dept.name,
    desc: dept.description,
    link: `/departments/${slug}`,
    image: bgImage,
    items: dept.heroServiceSlugs.map((s) => servicesData[s].name),
    serviceCount: dept.serviceCount,
  };
});

const BentoCard = ({ dept, i, cardClass, isExpanded, setExpandedCaps, scrollYProgress }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });
  const cardRef = useRef(null);

  // Simple scroll parallax for the background image
  // It moves slightly based on the scroll position
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 40]);

  // Framer motion variants for the staggered entrance
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current || isExpanded) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 8; 
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  const transformStyle = tilt.active
    ? {
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.025, 1.025, 1.025)`,
        transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease',
      }
    : {
        transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease',
      };

  const bgImage = dept.image || '';

  return (
    <motion.div
      variants={cardVariants}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className={`group svc-cap-group relative rounded-2xl overflow-hidden transition-all duration-500 ${cardClass} ${
        isExpanded 
          ? 'bg-[#0a0a0c] border border-white/10 shadow-2xl' 
          : 'bg-[#0d0e12] border border-white/[0.08] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85),0_5px_15px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,1)]'
      }`}
    >
      {!isExpanded && (
        <>
          <div className="absolute inset-0 z-30 pointer-events-none rounded-2xl border border-white/[0.06] shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.15),inset_0_-1.5px_0_0_rgba(0,0,0,0.6)]" />
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-black/40 z-30 pointer-events-none" />
        </>
      )}

      {!isExpanded && (
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" 
          style={{
            transform: tilt.active ? `translate3d(${-tilt.y * 1.5}px, ${tilt.x * 1.5}px, 0)` : 'none',
            transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        />
      )}

      <div className={`absolute inset-0 z-0 overflow-hidden rounded-2xl transition-opacity duration-500 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {bgImage && (
          <motion.img
            src={bgImage}
            alt={`${dept.title} — ${dept.desc}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{
              y: yParallax,
              transform: tilt.active ? `translate3d(${-tilt.y * 0.5}px, ${tilt.x * 0.5}px, 0) scale3d(1.1, 1.1, 1.1)` : 'scale3d(1.05, 1.05, 1.05)',
              transition: tilt.active ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.5s ease',
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/35 z-[1]" />
        <div className="absolute inset-x-0 top-0 h-1/2 z-[2]" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.45) 45%,rgba(0,0,0,0) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 z-[2]" style={{ background: 'linear-gradient(0deg,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.3) 50%,rgba(0,0,0,0) 100%)' }} />
      </div>

      {!isExpanded && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
      )}

      <div className={`relative z-20 h-full flex flex-col justify-between p-8 lg:p-10 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex flex-col h-full">
          <h3 className="text-2xl lg:text-3xl font-bold mb-2 transition-transform duration-300 shrink-0 text-white">
            {dept.title}
          </h3>
          <p className="text-xs lg:text-sm font-semibold mb-6 shrink-0 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">
            {dept.items.length} Key Capabilities
          </p>
          <div className="relative flex-1">
            <p className="svc-cap-desc absolute inset-0 leading-relaxed text-sm lg:text-[15px] text-white/90">
              {dept.desc}
            </p>
            <ul className="svc-cap-items absolute inset-0 space-y-2.5 text-white/90">
              <span className="block text-xs font-bold uppercase tracking-widest mb-2.5 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">Key Capabilities:</span>
              {dept.items.slice(0, 6).map((item, j) => (
                <li key={j} className="flex items-start text-[13px] lg:text-sm font-medium">
                  <span className="mr-2 opacity-80 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">✦</span>
                  {item.includes(':') ? item.split(':')[0] : item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Link to={dept.link} viewTransition className="inline-flex items-center font-bold w-fit shrink-0 transition-all duration-300 text-sm lg:text-base text-white hover:text-[#2564ea]">
            Explore Capability
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpandedCaps(prev => ({ ...prev, [i]: true }));
            }}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors pointer-events-auto shrink-0"
            aria-label="Expand details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>

      {/* Expanded Detail Overlay */}
      <div className={`absolute inset-0 z-30 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto svc-cap-no-scroll transition-all duration-500 ease-in-out border-t backdrop-blur-xl bg-[#0a0a0c]/98 border-white/10 ${isExpanded ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'}`} tabIndex={isExpanded ? 0 : -1} inert={!isExpanded}>
        <div className="flex flex-col text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border font-mono text-slate-300 bg-white/5 border-white/10">
              {dept.serviceCount} Total Services
            </span>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase font-mono bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">{dept.n}</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight text-white">
            {dept.title}
          </h4>
          <p className="text-xs sm:text-sm mb-5 leading-relaxed text-slate-400">
            {dept.desc}
          </p>
          <ul className="space-y-3">
            {dept.items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-sm leading-snug text-slate-300">
                <span className="font-bold shrink-0 mt-0.5 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">✦</span>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
          <Link to={dept.link} viewTransition className="inline-flex items-center font-bold text-sm text-[#2564ea] hover:text-[#2564ea] transition-colors pointer-events-auto">
            View All Services <ArrowRight className="ml-1.5 w-4 h-4" />
          </Link>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpandedCaps(prev => {
                const next = { ...prev };
                delete next[i];
                return next;
              });
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors pointer-events-auto shrink-0"
            aria-label="Close details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const DepartmentCarousel = () => {
  const [expandedCaps, setExpandedCaps] = useState({});
  const sectionRef = useRef(null);
  // Below `sm` the bento becomes a swipe rail (see `.kq-rail` in index.css).
  // Eight stacked cards cost 3,124px there — the single largest block on the
  // mobile service page.
  const isRail = useIsRail();
  
  // Track scroll progress of this specific section for parallax effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden bg-white dark:bg-[#050507]">
      <style dangerouslySetInnerHTML={{__html: `
        .svc-cap-group .svc-cap-desc {
          opacity: 1; transform: translateY(0);
          transition: opacity 0.4s cubic-bezier(0.25,1,0.5,1), transform 0.4s cubic-bezier(0.25,1,0.5,1);
          visibility: visible;
        }
        .svc-cap-group:hover .svc-cap-desc {
          opacity: 0; transform: translateY(12px); visibility: hidden; pointer-events: none;
        }
        .svc-cap-items {
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.4s cubic-bezier(0.25,1,0.5,1), transform 0.4s cubic-bezier(0.25,1,0.5,1);
          pointer-events: none; visibility: hidden;
        }
        .svc-cap-group:hover .svc-cap-items {
          opacity: 1; transform: translateY(0); pointer-events: auto; visibility: visible;
        }
        .svc-cap-no-scroll::-webkit-scrollbar { display: none; }
        .svc-cap-no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
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
          </div>
        </div>

        <motion.div
          className="kq-rail grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          role={isRail ? 'group' : undefined}
          aria-label={isRail ? `Capabilities — scroll sideways to see all ${carouselDepartments.length}` : undefined}
          tabIndex={isRail ? 0 : undefined}
        >
          {carouselDepartments.map((dept, i) => {
            const isExpanded = !!expandedCaps[i];
            
            let cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
            if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
            else if (i === 5) cardClass = 'col-span-1 sm:col-span-2 lg:col-span-3 h-[380px] lg:h-[400px]';
            else cardClass = 'col-span-1 h-[380px] lg:h-[400px]';

            return (
              <BentoCard
                key={i}
                dept={dept}
                i={i}
                cardClass={cardClass}
                isExpanded={isExpanded}
                setExpandedCaps={setExpandedCaps}
                scrollYProgress={scrollYProgress}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default DepartmentCarousel;
