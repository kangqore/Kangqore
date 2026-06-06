import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Tag, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ContentSearch from '../components/ContentSearch';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';
import { contentSEO } from '../data/seoData';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          type: 'BLOG',
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          ...(searchQuery && { search: searchQuery })
        });

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/content?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }

        const data = await response.json();
        setBlogs(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1
  };

  return (
    <div className="bg-white dark:bg-black">
      <SEO 
        title={contentSEO.blogs.title}
        description={contentSEO.blogs.description}
        keywords={contentSEO.blogs.keywords}
        url={contentSEO.blogs.url}
      />
      <PageHero
        badge="Insights & Knowledge"
        title="Thought leadership and"
        titleHighlight="expert insights"
        description="Insights, trends, and thought leadership from our experts covering AI, cloud, cybersecurity, and digital transformation."
        primaryButton={{ text: 'Subscribe', link: '#subscribe' }}
        secondaryButton={{ text: 'Browse Topics', link: '#topics' }}
        stats={[
          { value: '100+', label: 'Articles', color: 'text-cyan-400' },
          { value: '20+', label: 'Expert Authors', color: 'text-blue-400' },
          { value: '50K+', label: 'Monthly Readers', color: 'text-emerald-400' },
          { value: '8', label: 'Categories', color: 'text-purple-400' },
        ]}
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Bar */}
          <div className="flex justify-between items-center mb-12 flex-col md:flex-row gap-4">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Articles</h2>
             <ContentSearch 
                onSearch={handleSearch} 
                placeholder="Search articles..." 
             />
          </div>

          {loading ? (
             <div className="flex justify-center items-center py-20">
               <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
             </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600">
              <p>Unable to load insights at this time. Please try again later.</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No insights published yet. Check back soon!</p>
            </div>
          ) : (
            <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link 
                  key={blog.id} 
                  to={`/blogs/${blog.slug}`}
                  className="block"
                >
                  <article className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer h-full flex flex-col">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 overflow-hidden relative">
                       {blog.featuredImage ? (
                          <img 
                            src={blog.featuredImage} 
                            alt={blog.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              // Could show fallback gradient/icon here
                            }}
                          />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#0a0a0c] text-gray-400">
                            <Tag className="w-10 h-10" />
                          </div>
                       )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        {blog.category && (
                          <span className="flex items-center gap-1"><Tag className="w-4 h-4" />{blog.category}</span>
                        )}
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{blog.readTime || '5 min read'}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">{blog.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">{blog.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-brand-blue font-medium flex items-center gap-1">Read More <ArrowRight className="w-4 h-4" /></span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blogs;