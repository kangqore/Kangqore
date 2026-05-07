import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { newsItems } from '../mock/mockData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Wrapper component for individual news cards
const NewsCard = ({ news, index }) => {
  const [cardRef, cardVisible] = useScrollAnimation({ once: true, threshold: 0.2 });
  
  return (
    <div
      ref={cardRef}
      className={`bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-700 transform hover:-translate-y-2 ${
        cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <div className="relative h-48 overflow-hidden group">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
          <span className="font-semibold text-brand-blue">{news.type}</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {news.date}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {news.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {news.excerpt}
        </p>
        
        <a
          href={news.link}
          className="inline-flex items-center text-brand-blue font-semibold text-sm hover:text-cyan-500 transition-colors group"
        >
          Know more
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

const News = () => {
  const [titleRef, titleVisible] = useScrollAnimation({ once: true, threshold: 0.3 });
  const [btnRef, btnVisible] = useScrollAnimation({ once: true, threshold: 0.5 });

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div 
          ref={titleRef}
          className={`mb-14 lg:mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              News
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {newsItems.map((news, index) => (
            <NewsCard key={news.id} news={news} index={index} />
          ))}
        </div>

        <div 
          ref={btnRef}
          className={`mt-16 lg:mt-20 text-center transition-all duration-1000 ${
            btnVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <a
            href="#"
            className="inline-flex items-center px-8 py-4 bg-brand-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            See all Kangqore news
          </a>
        </div>
      </div>
    </section>
  );
};

export default News;