import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { departmentData } from '../data/departmentData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ExploreServices = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);
  const [sectionRef, sectionVisible] = useScrollAnimation({ once: true, threshold: 0.1 });

  // Double the data for seamless loop
  const displayData = [...departmentData, ...departmentData];

  // Card width (340px) + gap (24px) = 364px
  const cardWidthWithGap = 364;

  // Handle scroll to update active index based on position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      // Calculate active index based on which card is in the 2nd position
      const indexInDisplayData = Math.round(scrollLeft / cardWidthWithGap) + 1;
      setActiveIndex(indexInDisplayData);

      // Seamless loop reset
      if (scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      } else if (scrollLeft <= 0) {
        // Optional: handle reverse if needed, but we scroll forward
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [cardWidthWithGap]);

  // Continuous loop animation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollStep = () => {
      if (!isHovered && sectionVisible) {
        container.scrollLeft += 1; // Adjust speed here (1px per frame)
      }
      animationRef.current = requestAnimationFrame(scrollStep);
    };

    animationRef.current = requestAnimationFrame(scrollStep);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, sectionVisible]);

  // Initial setup
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`py-28 md:py-36 lg:py-44 bg-white dark:bg-black transition-all duration-1000 ${
        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16 lg:mb-20">
          {/* Left Side - Title */}
          <div className="w-full">
            <span className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-4 block">
              What we offer
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Explore Our{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Capabilities/Departments
              </span>
            </h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <p className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl leading-relaxed max-w-3xl">
                From AI and cloud to cybersecurity, modernization, and automation — Kangqore helps businesses build systems that scale reliably.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-blue-700 group whitespace-nowrap"
              >
                View All Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Services Carousel */}
        <div 
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayData.map((dept, index) => {
            const IconComponent = dept.icon;
            const isActive = index === activeIndex;
            
            return (
              <div
                key={`${dept.slug}-${index}`}
                className={`flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] h-[420px] md:h-[500px] snap-start rounded-2xl transition-all duration-500 flex flex-col group/card ${
                  isActive 
                    ? 'bg-[#050505] shadow-[0_20px_50px_rgba(0,0,0,0.3)] opacity-100 ring-1 ring-white/10' 
                    : 'bg-gradient-to-br from-[#3ba1e3] to-[#4ab6d4] opacity-90 hover:opacity-100 hover:bg-[#050505] hover:shadow-2xl'
                }`}
              >
                <div className="p-6 md:p-8 flex flex-col h-full">
                  {/* Department Icon & Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/70">
                      {dept.services.length} services
                    </span>
                  </div>

                  {/* Department Name */}
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {dept.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm md:text-base mb-6 leading-relaxed text-white/90 line-clamp-6 flex-1">
                    {dept.description}
                  </p>

                  {/* Learn More Link */}
                  <Link
                    to={`/department/${dept.slug}`}
                    className="inline-flex items-center gap-2 font-semibold group text-white mt-auto pt-4 border-t border-white/10"
                  >
                    Learn More
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-10">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-gradient transition-all duration-500 rounded-full"
              style={{ width: `${((activeIndex + 1) / departmentData.length) * 100}%` }}
            />
          </div>
        </div>



        {/* Stats */}
        <div className="mt-20 lg:mt-28 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold bg-brand-gradient bg-clip-text text-transparent">
              15
            </div>
            <div className="text-gray-600 dark:text-gray-400 mt-2 text-base lg:text-lg">Departments</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold bg-brand-gradient bg-clip-text text-transparent">
              61+
            </div>
            <div className="text-gray-600 dark:text-gray-400 mt-2 text-base lg:text-lg">Services</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold bg-brand-gradient bg-clip-text text-transparent">
              200+
            </div>
            <div className="text-gray-600 dark:text-gray-400 mt-2 text-base lg:text-lg">Projects Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold bg-brand-gradient bg-clip-text text-transparent">
              98%
            </div>
            <div className="text-gray-600 dark:text-gray-400 mt-2 text-base lg:text-lg">Client Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ExploreServices;
