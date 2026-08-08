import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Layers, 
  Activity, 
  Target, 
  Brain, 
  Rocket,
  ArrowLeft,
  CheckCircle2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Minus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AccordionItem = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      className={`py-10 border-b border-brand-blue/20 group hover:bg-[#FEFFFC] transition-all cursor-pointer px-8 rounded-xl ${isExpanded ? 'bg-[#FEFFFC] shadow-xl shadow-blue-900/5' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between gap-12">
        <h4 className={`text-xl lg:text-2xl font-bold transition-all duration-300 pr-12 font-display ${isExpanded ? 'text-brand-blue' : 'text-slate-700 dark:text-gray-300 group-hover:text-brand-blue'}`}>
          {item.title}
        </h4>
        <div className={`w-10 h-10 rounded-full border border-brand-blue/20 flex items-center justify-center transition-all duration-500 flex-shrink-0 shadow-sm ${isExpanded ? 'rotate-45 bg-brand-blue text-white' : 'text-brand-blue group-hover:rotate-90 group-hover:bg-brand-blue group-hover:text-white'}`}>
          <Plus className="w-5 h-5" />
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-40 mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-600 dark:text-gray-400 text-lg leading-relaxed font-light lg:pr-32">
          {item.detail}
        </p>
      </div>
    </div>
  );
};

const TechnologyLedGrowthStrategy = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [isDataExpanded, setIsDataExpanded] = useState(false);
  const SLIDE_DURATION = 3000; 
  const PROGRESS_INTERVAL = 10; 
  
  const carouselSlides = [
    {
      title: "Platform-centric models are funding Total Enterprise Reinvention",
      description: "Shift from isolated applications to digital platforms that unlock ecosystem value. Reduce the cost of running technology and use those savings to invest in transformation.",
      image: "/assets/images/services/growth-strategy-carousel-1.png"
    },
    {
      title: "Product-led innovation is increasing growth velocity",
      description: "Evolve by introducing new processes and tools that ensure a permanent link between the investment in technology and achieving desired business outcomes.",
      image: "/assets/images/services/growth-strategy-carousel-2.png"
    },
    {
      title: "Data-driven positioning defines market leadership",
      description: "Turn enterprise data into strategic intelligence. Allocate capital toward scalable digital capabilities rather than legacy maintenance.",
      image: "/assets/images/services/growth-strategy-hero.png"
    }
  ];

  const TOTAL_DURATION = SLIDE_DURATION * carouselSlides.length;

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedTime((prev) => {
          const nextTime = prev + PROGRESS_INTERVAL;
          if (nextTime >= TOTAL_DURATION) {
            setActiveSlide(0);
            return 0;
          }
          const nextSlide = Math.floor(nextTime / SLIDE_DURATION);
          if (nextSlide !== activeSlide) {
            setActiveSlide(nextSlide);
          }
          return nextTime;
        });
      }, PROGRESS_INTERVAL);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeSlide, TOTAL_DURATION]);

  const handleManualNav = (direction) => {
    setIsPlaying(false);
    if (direction === 'next') {
      const nextSlide = (activeSlide + 1) % carouselSlides.length;
      setActiveSlide(nextSlide);
      setElapsedTime(nextSlide * SLIDE_DURATION);
    } else {
      const prevSlide = (activeSlide - 1 + carouselSlides.length) % carouselSlides.length;
      setActiveSlide(prevSlide);
      setElapsedTime(prevSlide * SLIDE_DURATION);
    }
  };

  const totalProgressWidth = (elapsedTime / TOTAL_DURATION) * 100;

  return (
    <div className="min-h-screen bg-[#FEFFFC] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          to="/services/digital-transformation-modernization/technology-transformation" 
          className="inline-flex items-center gap-2 text-sm text-white hover:opacity-90 transition-all group px-4 py-2 bg-brand-gradient rounded-full shadow-lg shadow-blue-900/10 font-bold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Technology Transformation
        </Link>
      </div>

      {/* Rebalance the Tech Ledger Section (Split Hero) - Light Theme */}
      <section className="py-24 bg-[#FEFFFC] overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <img 
                src="/assets/images/services/growth-strategy-hero.png" 
                alt="Growth Ledger" 
                className="w-full h-auto rounded-2xl relative z-10 shadow-2xl"
              />
            </div>
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.9] font-display">
                Engineer Growth. <br />
                <span className="text-transparent bg-clip-text bg-brand-gradient italic">Not Just Systems.</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-gray-400 mb-10 leading-relaxed font-light font-display">
                Technology must lead business strategy — not follow it. Kangqore helps enterprises shift from cost-centric IT models to platform-driven growth ecosystems.
              </p>
              <div className="flex flex-wrap gap-4">
              </div>
            </div>
          </div>

          <div className="mt-24 grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <p className="text-xl lg:text-2xl text-slate-500 leading-relaxed font-light">
                As companies invest in emerging tech to drive reinvention, rapid adoption is leading to a surge in <span className="text-slate-900 dark:text-white font-semibold">technical debt.</span> Technology defines growth velocity. We help enterprises shift from maintenance-centric IT models to <span className="text-brand-blue font-semibold">innovation-driven ecosystems</span> — powered by data, AI, and composable architectures.
              </p>
            </div>
            <div className="lg:col-span-1"></div>
            <div className="lg:col-span-4 self-end">
              <div 
                className={`bg-brand-gradient border border-brand-blue/20 p-10 rounded-2xl relative overflow-hidden group shadow-xl shadow-blue-900/10 cursor-pointer transition-all duration-500 ${isDataExpanded ? 'ring-2 ring-white/20' : ''}`}
                onClick={() => setIsDataExpanded(!isDataExpanded)}
              >
                <div className={`absolute top-4 right-4 text-white transition-all duration-500 z-20 ${isDataExpanded ? 'scale-110' : 'hover:rotate-90'}`}>
                  {isDataExpanded ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <div className="text-[11px] font-mono text-white/80 uppercase tracking-[0.3em] font-bold mb-6">Strategy Data</div>
                <div className="text-6xl font-bold text-white mb-4 tracking-tighter transition-all duration-500">41%</div>
                <p className="text-sm text-white/90 leading-relaxed uppercase tracking-wider font-bold">
                  of executives rate AI as the top contributor to technical debt.
                </p>

                <div className={`overflow-hidden transition-all duration-500 ${isDataExpanded ? 'max-h-96 mt-12 opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/20">
                      <div>
                        <div className="text-4xl font-bold text-white mb-2 tracking-tighter">97%</div>
                        <p className="text-[11px] text-white/70 uppercase tracking-[0.2em] leading-relaxed font-bold">
                          agree technology plays a critical role in reinvention.
                        </p>
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-white mb-2 tracking-tighter">7%</div>
                        <p className="text-[11px] text-white/70 uppercase tracking-[0.2em] leading-relaxed font-bold">
                          more budget spent on technical debt remediation.
                        </p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Tech Value is Changing (Carousel) - Light Theme */}
      <section className="py-32 bg-[#FEFFFC] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight font-display">
              How growth <span className="text-transparent bg-clip-text bg-brand-gradient italic">drivers</span> are changing
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
              {carouselSlides.map((slide, i) => (
                <img 
                  key={i}
                  src={slide.image} 
                  alt={slide.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
            </div>
            
            <div className="lg:pl-12">
              <div className="min-h-[250px] transition-all duration-500">
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight font-display">
                  {carouselSlides[activeSlide].title}
                </h3>
                <p className="text-xl text-slate-600 dark:text-gray-400 leading-relaxed font-light mb-8">
                  {carouselSlides[activeSlide].description}
                </p>
                
                {/* Continuous Growth Bar Line (Holistic Transition Indicator) */}
                <div className="w-full h-1 bg-gray-100 dark:bg-[#0a0a0c] rounded-full mb-12 overflow-hidden relative">
                   <div 
                     className="absolute inset-y-0 left-0 bg-brand-blue transition-[width] duration-100 ease-linear"
                     style={{ width: `${totalProgressWidth}%` }}
                   />
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-50 transition-colors shadow-sm"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-slate-900" /> : <Play className="w-5 h-5 fill-slate-900" />}
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleManualNav('prev')}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-50 transition-colors group shadow-sm"
                  >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                  <button 
                    onClick={() => handleManualNav('next')}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-50 transition-colors group shadow-sm"
                  >
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
                <div className="text-slate-400 font-mono text-sm ml-4">
                  {activeSlide + 1} / {carouselSlides.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Do Section (Accordion Style) - Light Theme with Blue Accents */}
      <section className="py-32 bg-[#FEFFFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-20 tracking-tighter font-display">
            What <span className="text-transparent bg-clip-text bg-brand-gradient">you can do</span>
          </h2>
          
          <div className="space-y-0 border-t border-brand-blue/20">
            {[
              {
                title: "Design digital platforms that unlock ecosystem value, not isolated applications.",
                detail: "Shift from monolithic architectures to composable, API-first platforms that simplify integration with partners and customers, creating new revenue channels."
              },
              {
                title: "Shift from project-based IT to product-based innovation cycles.",
                detail: "Implement durable product teams that own the entire lifecycle of a capability, ensuring continuous improvement and direct alignment with business KPIs."
              },
              {
                title: "Turn enterprise data into strategic intelligence for market leadership.",
                detail: "Architecture your data landscape to move beyond reporting into predictive analytics and real-time decisioning, powered by a unified digital core."
              },
              {
                title: "Allocate capital toward scalable digital capabilities, not legacy maintenance.",
                detail: "Systematically retire technical debt and legacy silos to redirect budget toward high-impact innovation projects like GenAI and autonomous systems."
              }
            ].map((item, i) => (
              <AccordionItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Achievement Metrics Section - Light Theme */}
      <section className="py-24 bg-[#FEFFFC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden">
            <div className="relative z-10 grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-12 text-center mb-4">
                 <div className="font-mono text-[11px] text-brand-blue mb-4 tracking-[0.4em] uppercase font-bold">Projected Performance</div>
                 <h2 className="text-4xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tighter leading-[0.95] font-display">
                    Measurable <span className="text-transparent bg-clip-text bg-brand-gradient italic">Achievement.</span>
                 </h2>
              </div>

              <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: '40%', label: 'Launch Cycles', sub: 'Faster cycles' },
                  { value: '75%', label: 'Debt Redux', sub: 'Technical clarity' },
                  { value: '2.5X', label: 'Revenue Growth', sub: 'Digital streams' },
                  { value: '3X', label: 'AI Acceleration', sub: 'Decision speed' }
                ].map((stat, i) => (
                  <div key={i} className="text-center group p-8 rounded-3xl bg-[#FEFFFC] border border-slate-100 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
                    <div className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2 group-hover:scale-110 group-hover:text-brand-blue transition-all tracking-tighter duration-500">
                      {stat.value}
                    </div>
                    <div className="font-bold text-brand-blue text-[11px] uppercase tracking-[0.3em] mb-1">{stat.label}</div>
                    <div className="text-[11px] text-slate-400 font-mono italic">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#FEFFFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/assets/images/services/growth-strategy-cta-bg.png" 
                alt="Growth Strategy CTA" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-[2px]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-12 lg:p-16 text-center text-white">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-display tracking-tight">Ready to Engineer Your Growth?</h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Let's align your business ambition with technical capability. Start your growth assessment today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-bold rounded-xl hover:bg-slate-50 transition-all shadow-xl shadow-black/10 flex items-center gap-2 group">
                  Request Strategy Call <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechnologyLedGrowthStrategy;
