import React from 'react';
import { ArrowRight } from 'lucide-react';
import { caseStudies } from '../mock/mockData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Wrapper component for individual case study cards
const CaseStudyCard = ({ study, index }) => {
  const [cardRef, cardVisible] = useScrollAnimation({ once: true, threshold: 0.2 });
  
  return (
    <div
      ref={cardRef}
      className={`group relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 ${
        cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={study.image}
          alt={study.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 bg-cyan-400 text-xs font-semibold text-gray-900 dark:text-white rounded-full animate-pulse-glow">
            {study.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-brand-blue transition-colors">
          {study.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {study.description}
        </p>
        <a
          href={study.link}
          className="inline-flex items-center text-brand-blue font-semibold text-sm hover:text-cyan-500 transition-colors group"
        >
          Read more
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

const CaseStudies = () => {
  const [titleRef, titleVisible] = useScrollAnimation({ once: true, threshold: 0.3 });
  const [reportRef, reportVisible] = useScrollAnimation({ once: true, threshold: 0.3 });

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div 
          ref={titleRef}
          className={`mb-14 lg:mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
          }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Case{' '}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              studies
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
            We help companies anticipate and act with insight and speed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={study.id} study={study} index={index} />
          ))}
        </div>

        {/* Featured Report */}
        <div 
          ref={reportRef}
          className={`mt-20 lg:mt-28 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-3xl overflow-hidden shadow-lg transition-all duration-1000 transform ${
            reportVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 animate-float-slow min-h-[300px] lg:min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="AI-empowered customers report"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-10 lg:p-16 order-1 md:order-2">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                How are AI-empowered customers shaping tomorrow's markets?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl mb-10 leading-relaxed">
                Consumers who embrace AI could drive up to 55% of spending by 2030. It's time to understand the new AI-empowered customer and the wants, needs and expectations that will shape tomorrow's markets.
              </p>
              <a
                href="#"
                className="inline-flex items-center px-8 py-4 bg-brand-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Read the report
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;