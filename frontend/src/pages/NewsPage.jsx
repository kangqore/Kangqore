import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Tag, Loader2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ContentSearch from '../components/ContentSearch';
import Pagination from '../components/Pagination';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          type: 'NEWS',
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          ...(searchQuery && { search: searchQuery })
        });

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050'}/api/content?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch news articles');
        }

        const data = await response.json();
        setNews(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1
  };

  const featuredNews = news.length > 0 ? news[0] : null;
  const remainingNews = news.length > 1 ? news.slice(1) : (featuredNews ? [] : news);

  return (
    <div className="bg-white dark:bg-black">
      <PageHero
        badge="Latest News"
        title="Stay informed about"
        titleHighlight="innovation and growth"
        description="Stay informed about Kangqore's latest announcements, achievements, partnerships, and insights from across the technology landscape."
        primaryButton={{ text: 'Subscribe', link: '#newsletter' }}
        secondaryButton={{ text: 'View All', link: '#all-news' }}
        stats={[
          { value: '100+', label: 'Press Releases', color: 'text-cyan-400' },
          { value: '50+', label: 'Partnerships', color: 'text-blue-400' },
          { value: '25+', label: 'Awards', color: 'text-emerald-400' },
          { value: 'Global', label: 'Coverage', color: 'text-purple-400' },
        ]}
      />

      {/* Search Bar Section */}
      <section className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Updates</h2>
            <ContentSearch 
              onSearch={handleSearch} 
              placeholder="Search news by title, category, or keywords..." 
            />
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center items-center py-20 min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin text-brand-blue" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-600 min-h-[400px]">
          <p className="text-xl font-medium">Unable to load news at this time. Please try again later.</p>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-20 text-gray-500 min-h-[400px]">
          <div className="bg-gray-50 dark:bg-[#050505] inline-block p-6 rounded-full mb-4">
             <Tag className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-xl font-medium">No results found {searchQuery && `for "${searchQuery}"`}</p>
          <p className="mt-2">Try adjusting your search criteria or check back later.</p>
        </div>
      ) : (
        <>
          {/* Featured Article - Only on page 1 and if not searching or if it's the only result */}
          {featuredNews && currentPage === 1 && !searchQuery && (
            <section className="pb-16 pt-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Featured Story</h3>
                <Link to={`/blogs/${featuredNews.slug}`} className="block">
                  <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                    <div className="grid md:grid-cols-2">
                      <div className="h-64 md:h-[400px] overflow-hidden relative">
                        {featuredNews.featuredImage ? (
                          <img 
                            src={featuredNews.featuredImage} 
                            alt={featuredNews.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-brand-blue/5 to-cyan-500/5 flex items-center justify-center">
                            <Tag className="w-20 h-20 text-brand-blue/10" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-4 py-1.5 bg-brand-gradient text-white text-xs font-bold rounded-full shadow-lg">
                            {featuredNews.category || 'News'}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-4 h-4 text-brand-blue" />
                            {new Date(featuredNews.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-4 h-4 text-brand-blue" />
                            {featuredNews.readTime || '4 min read'}
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 group-hover:text-brand-blue transition-colors leading-tight">
                          {featuredNews.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 line-clamp-3 leading-relaxed">
                          {featuredNews.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-brand-blue font-bold group-hover:gap-5 transition-all">
                          Read Full Story
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* News Grid */}
          <section className={`py-16 ${!searchQuery && currentPage === 1 ? 'bg-gray-50/50' : 'bg-white dark:bg-black'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchQuery || currentPage > 1 ? news : remainingNews).map((article) => (
                  <Link key={article.id} to={`/blogs/${article.slug}`} className="block h-full">
                    <article className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                      <div className="h-52 overflow-hidden relative">
                        {article.featuredImage ? (
                          <img 
                            src={article.featuredImage} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center">
                            <Tag className="w-12 h-12 text-gray-200" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white dark:bg-gray-900 dark:border-gray-800/90 backdrop-blur-sm text-brand-blue text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm border border-gray-100">
                            {article.category || 'Update'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 mb-4 text-xs font-medium text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{article.excerpt}</p>
                        <div className="flex items-center gap-2 text-brand-blue text-sm font-bold group-hover:gap-3 transition-all mt-auto pt-4 border-t border-gray-50">
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-16">
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Newsletter CTA */}
      <section id="newsletter" className="py-24 bg-brand-gradient relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-6">Stay Ahead of the Curve</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Subscribe to the Kangqore Briefing and never miss important updates, innovation insights, and global industry news.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your business email"
              className="flex-1 px-8 py-4 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-white/20 transition-all shadow-xl"
              required
            />
            <button className="px-10 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue rounded-2xl font-bold hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-xl">
              Subscribe Now
            </button>
          </form>
          <p className="mt-6 text-blue-200/60 text-xs">
            Join 5,000+ industry leaders. Zero spam, just pure innovation.
          </p>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
