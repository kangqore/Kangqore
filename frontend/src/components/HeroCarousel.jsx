import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { heroSlides } from '../mock/mockData';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Company logos - using placeholder logos from various free logo resources
  const companyLogos = [
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
    { name: 'Oracle', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg' },
    { name: 'SAP', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg' },
    { name: 'Salesforce', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
    { name: 'Adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg' },
    { name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg' },
    { name: 'Cisco', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg' },
    { name: 'Dell', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg' },
    { name: 'HP', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg' },
    { name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg' },
    { name: 'Deloitte', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg' },
    { name: 'KPMG', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/KPMG_logo.svg' },
    { name: 'PwC', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/PricewaterhouseCoopers_Logo.svg' },
    { name: 'McKinsey', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/McKinsey_and_Company_Logo_1.svg' },
    { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'Spotify', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg' },
    { name: 'Uber', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.svg' },
    { name: 'Airbnb', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg' },
    { name: 'Stripe', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' },
    { name: 'Shopify', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setTimeout(() => setIsAnimating(false), 500);
      }
    }, 6000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, isAnimating]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/12920671/12920671-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-6">
            <div className="inline-block">
              <span className="text-cyan-400 text-sm font-semibold tracking-wide uppercase">
                {heroSlides[currentSlide].tag}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight animate-fade-in">
              {heroSlides[currentSlide].title}
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
              {heroSlides[currentSlide].description}
            </p>
            
            <div className="pt-4">
              <a
                href={heroSlides[currentSlide].link}
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-blue-900 font-semibold rounded-md hover:bg-cyan-400 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {heroSlides[currentSlide].cta}
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div
              className="w-full h-full min-h-screen bg-cover bg-center rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 animate-float"
              style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
              aria-label={heroSlides[currentSlide].title}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Arrow Controls - Bottom positioned */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={prevSlide}
            className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 hover:bg-white dark:bg-gray-900 dark:border-gray-800/20 text-white rounded-full backdrop-blur-sm transition-all border border-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 hover:bg-white dark:bg-gray-900 dark:border-gray-800/20 text-white rounded-full backdrop-blur-sm transition-all border border-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Trusted By Section with Scrolling Logos */}
      <div className="relative pb-32">
        <div className="text-center mb-8">
          <p className="text-white/80 text-sm font-semibold tracking-widest uppercase">
            Trusted by Leading Companies Worldwide
          </p>
        </div>

        {/* Logo Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#2563EB] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#06B6D4] to-transparent z-10"></div>
          
          {/* Scrolling Logos */}
          <div className="flex animate-scroll-left">
            {/* First set of logos */}
            <div className="flex items-center gap-16 px-8">
              {companyLogos.map((company, index) => (
                <div
                  key={`logo-1-${index}`}
                  className="flex-shrink-0 h-10 w-28 flex items-center justify-center grayscale brightness-200 opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-h-full max-w-full object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
              ))}
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center gap-16 px-8">
              {companyLogos.map((company, index) => (
                <div
                  key={`logo-2-${index}`}
                  className="flex-shrink-0 h-10 w-28 flex items-center justify-center grayscale brightness-200 opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="max-h-full max-w-full object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/60 hover:text-white transition-colors cursor-pointer">
        <span className="text-xs mb-2">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroCarousel;
