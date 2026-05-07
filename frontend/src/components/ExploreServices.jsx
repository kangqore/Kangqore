import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { departmentData } from '../data/departmentData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ExploreServices = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);
  const autoPlayRef = useRef(null);
  const [sectionRef, sectionVisible] = useScrollAnimation({ once: true, threshold: 0.1 });

  // Card width + gap - responsive
  const cardWidthWithGap = 404;

  // Get responsive card width
  const getCardWidth = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 280; // Mobile
      if (window.innerWidth < 768) return 320; // Tablet
      return 380; // Desktop
    }
    return 380;
  };

  const [cardWidth, setCardWidth] = useState(getCardWidth());

  useEffect(() => {
    const handleResize = () => setCardWidth(getCardWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToCard = (index) => {
    setActiveIndex(index);
    
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const targetScroll = index * cardWidthWithGap;
      
      container.scrollTo({
        left: Math.min(targetScroll, maxScroll),
        behavior: 'smooth'
      });
    }
  };

  const nextSlide = () => {
    const newIndex = activeIndex >= departmentData.length - 1 ? 0 : activeIndex + 1;
    scrollToCard(newIndex);
  };

  const prevSlide = () => {
    const newIndex = activeIndex <= 0 ? departmentData.length - 1 : activeIndex - 1;
    scrollToCard(newIndex);
  };

  // Auto-scroll effect
  useEffect(() => {
    if (isAutoPlaying && !isHovered && sectionVisible) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex(prev => {
          const newIndex = prev >= departmentData.length - 1 ? 0 : prev + 1;
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const maxScroll = container.scrollWidth - container.clientWidth;
            const targetScroll = newIndex * cardWidthWithGap;
            
            container.scrollTo({
              left: newIndex === 0 ? 0 : Math.min(targetScroll, maxScroll),
              behavior: 'smooth'
            });
          }
          return newIndex;
        });
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, isHovered, sectionVisible]);

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
          <div className="lg:w-1/2">
            <span className="text-sm font-semibold text-brand-blue uppercase tracking-wider mb-4 block">
              What we offer
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Explore our{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                services
              </span>
            </h2>
          </div>
          
          {/* Right Side - Description */}
          <div className="lg:w-1/2 lg:pt-8">
            <p className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl leading-relaxed mb-6">
              We deliver end-to-end technology solutions across 15 specialized departments, 
              offering 77+ services designed to transform your business and drive innovation.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-blue-700 group"
            >
              View All Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Services Carousel */}
        <div 
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {departmentData.map((dept, index) => {
            const IconComponent = dept.icon;
            const isActive = index === activeIndex;
            
            return (
              <div
                key={dept.slug}
                className={`flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] snap-start rounded-2xl transition-all duration-500 ${
                  isActive 
                    ? 'bg-brand-gradient text-white shadow-2xl md:scale-105' 
                    : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white hover:shadow-lg'
                }`}
              >
                <div className="p-5 md:p-6">
                  {/* Department Icon & Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-white dark:bg-gray-900 dark:border-gray-800/20' : 'bg-brand-gradient'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white'}`} />
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                      {dept.services.length} services
                    </span>
                  </div>

                  {/* Department Name */}
                  <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {dept.name}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm mb-3 leading-relaxed ${
                    isActive ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {dept.description}
                  </p>

                  {/* Learn More Link */}
                  <Link
                    to={`/department/${dept.slug}`}
                    className={`inline-flex items-center gap-2 font-semibold group ${
                      isActive ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}
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

        {/* Navigation Controls - Below the progress bar */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full border-2 border-gray-900 text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-gray-500 min-w-[60px] text-center">
            {activeIndex + 1} / {departmentData.length}
          </span>
          
          <button
            onClick={nextSlide}
            className="p-3 rounded-full border-2 border-gray-900 text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`p-3 rounded-full border-2 transition-all duration-300 ${
              isAutoPlaying 
                ? 'border-brand-blue text-brand-blue hover:bg-brand-gradient hover:text-white' 
                : 'border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white'
            }`}
            title={isAutoPlaying ? 'Pause auto-scroll' : 'Play auto-scroll'}
          >
            {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
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
              77+
            </div>
            <div className="text-gray-600 dark:text-gray-400 mt-2 text-base lg:text-lg">Services</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold bg-brand-gradient bg-clip-text text-transparent">
              500+
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
