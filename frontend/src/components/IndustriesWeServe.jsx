import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowRight } from 'lucide-react';

const IndustriesWeServe = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ once: true, threshold: 0.1 });

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div 
          ref={sectionRef}
          className={`transition-all duration-1000 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Section Header */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-14 lg:mb-16">
            Industries We{' '}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Serve
            </span>
          </h2>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-4">
            {/* Row 1 */}
            {/* Large Card - Banking & Insurance (spans 2 rows) */}
            <div className="col-span-12 md:col-span-5 row-span-2 bg-[#7ED957] rounded-2xl p-6 relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02] min-h-[380px]">
              <div className="absolute right-0 top-1/4 w-2/3 h-2/3">
                <img 
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&q=80"
                  alt="Banking"
                  className="w-full h-full object-cover rounded-xl opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end pb-4">
                <Link to="/industries/banking" className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide mb-3 hover:gap-3 transition-all">
                  Banking & Financial Services <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/industries/insurance" className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide hover:gap-3 transition-all">
                  Insurance <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Healthcare - Top Middle */}
            <div className="col-span-12 md:col-span-4 bg-[#00BFA6] rounded-2xl p-5 relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02] min-h-[180px]">
              <div className="absolute right-2 top-2 w-28 h-28">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&q=80"
                  alt="Healthcare"
                  className="w-full h-full object-cover rounded-lg opacity-90 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <Link to="/industries/healthcare" className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide hover:gap-3 transition-all">
                  Healthcare & Life Sciences <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Manufacturing & Energy - Top Right (spans 2 rows) */}
            <div className="col-span-12 md:col-span-3 row-span-2 bg-[#FFD54F] rounded-2xl p-5 relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02] min-h-[380px]">
              <div className="absolute right-0 top-4 w-full h-1/2 flex justify-end pr-2">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&q=80"
                  alt="Manufacturing"
                  className="w-3/4 h-full object-cover rounded-lg opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end pb-4">
                <Link to="/industries/manufacturing" className="flex items-center gap-2 text-gray-800 dark:text-gray-50 font-semibold text-sm uppercase tracking-wide mb-2 hover:gap-3 transition-all">
                  Industrial & Manufacturing <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/industries/energy-utilities" className="flex items-center gap-2 text-gray-800 dark:text-gray-50 font-semibold text-sm uppercase tracking-wide hover:gap-3 transition-all">
                  Energy & Utilities <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Row 2 */}
            {/* EdTech */}
            <div className="col-span-6 md:col-span-2 bg-[#2196F3] rounded-2xl p-5 relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02] min-h-[180px]">
              <div className="absolute right-2 bottom-12 w-16 h-16">
                <img 
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&q=80"
                  alt="EdTech"
                  className="w-full h-full object-cover rounded-lg opacity-90 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <Link to="/industries/edtech" className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wide hover:gap-3 transition-all">
                  EdTech <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Hi-Tech & Media */}
            <div className="col-span-6 md:col-span-2 bg-[#26A69A] rounded-2xl p-5 relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02] min-h-[180px]">
              <div className="absolute right-0 top-2 w-20 h-20">
                <img 
                  src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&q=80"
                  alt="Media"
                  className="w-full h-full object-cover rounded-lg opacity-90 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <Link to="/services" className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wide mb-1 hover:gap-3 transition-all">
                  Hi-Tech <ArrowRight className="w-3 h-3" />
                </Link>
                <Link to="/industries/media-technology" className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wide hover:gap-3 transition-all">
                  Media & Entertainment <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Row 3 - Additional Industries to make 10 */}
            {/* Travel & Hospitality */}
            <div className="col-span-6 md:col-span-3 bg-[#9C27B0] rounded-2xl p-5 relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02] min-h-[180px]">
              <div className="absolute right-2 top-2 w-24 h-24">
                <img 
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&q=80"
                  alt="Travel"
                  className="w-full h-full object-cover rounded-lg opacity-90 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <Link to="/industries/travel-hospitality" className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide hover:gap-3 transition-all">
                  Travel & Hospitality <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Retail & CPG */}
            <div className="col-span-6 md:col-span-3 bg-[#90CAF9] rounded-2xl p-5 relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02] min-h-[180px]">
              <div className="absolute right-0 top-0 w-28 h-28">
                <img 
                  src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=300&q=80"
                  alt="Retail"
                  className="w-full h-full object-cover rounded-lg opacity-90 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <Link to="/industries/retail" className="flex items-center gap-2 text-gray-800 dark:text-gray-50 font-semibold text-sm uppercase tracking-wide mb-1 hover:gap-3 transition-all">
                  Retail <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/industries/consumer-goods" className="flex items-center gap-2 text-gray-800 dark:text-gray-50 font-semibold text-sm uppercase tracking-wide hover:gap-3 transition-all">
                  CPG & Logistics <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Communications */}
            <div className="col-span-6 md:col-span-3 bg-[#FF7043] rounded-2xl p-5 relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02] min-h-[180px]">
              <div className="absolute right-2 top-2 w-24 h-24">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80"
                  alt="Communications"
                  className="w-full h-full object-cover rounded-lg opacity-90 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <Link to="/services" className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide hover:gap-3 transition-all">
                  Communications <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Automotive */}
            <div className="col-span-6 md:col-span-3 bg-[#455A64] rounded-2xl p-5 relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02] min-h-[180px]">
              <div className="absolute right-2 top-2 w-24 h-24">
                <img 
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&q=80"
                  alt="Automotive"
                  className="w-full h-full object-cover rounded-lg opacity-90 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <Link to="/services" className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wide hover:gap-3 transition-all">
                  Automotive <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesWeServe;
