import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Briefcase, Calendar, Download, TrendingUp, ArrowRight, Newspaper, Loader2 } from 'lucide-react';
import PageHero from '../components/PageHero';

const Insights = () => {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [latestCaseStudies, setLatestCaseStudies] = useState([]);
  // const [latestWhitePapers, setLatestWhitePapers] = useState([]); // Placeholder for future
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const [blogsRes, casesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/content?type=blog&limit=3`),
          fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/content?type=case_study&limit=3`)
        ]);

        const blogsData = await blogsRes.json();
        const casesData = await casesRes.json();

        setLatestBlogs(blogsData.items || []);
        setLatestCaseStudies(casesData.items || []);
        // setLatestWhitePapers(whitePapers.items || []);

      } catch (err) {
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const categories = [
    { 
      title: 'Blogs', 
      icon: BookOpen, 
      description: 'Latest insights and trends from our experts',
      // count: blogsData.length, // Dynamic count would require separate API call or context
      link: '/blogs',
      color: 'blue'
    },
    { 
      title: 'Case Studies', 
      icon: Briefcase, 
      description: 'Real results from real transformations',
      // count: caseStudiesData.length,
      link: '/case-studies',
      color: 'green'
    },
    { 
      title: 'White Papers', 
      icon: FileText, 
      description: 'In-depth research and analysis',
      count: 'Coming Soon',
      link: '/white-paper',
      color: 'purple'
    },
    { 
      title: 'Events', 
      icon: Calendar, 
      description: 'Upcoming conferences and workshops',
      count: 'Coming Soon',
      link: '/events',
      color: 'orange'
    },
    { 
      title: 'Brochures', 
      icon: Download, 
      description: 'Downloadable resources and catalogs',
      count: 'Coming Soon',
      link: '/brochures',
      color: 'cyan'
    },
    { 
      title: 'News', 
      icon: Newspaper, 
      description: 'Company announcements and press releases',
      count: 'Coming Soon',
      link: '/news',
      color: 'rose'
    }
  ];

  if (loading) {
    return (
      <div className="bg-white dark:bg-black min-h-screen">
          <PageHero
            badge="Knowledge Hub"
            title="Insights &"
            titleHighlight="Resources"
            description="Explore our latest thinking, research, and resources to help you navigate your digital transformation journey."
            primaryButton={{ text: 'View All Blogs', link: '/blogs' }}
            secondaryButton={{ text: 'Browse Resources', link: '#categories' }}
          />
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
          </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black">
      <PageHero
        badge="Knowledge Hub"
        title="Insights &"
        titleHighlight="Resources"
        description="Explore our latest thinking, research, and resources to help you navigate your digital transformation journey."
        primaryButton={{ text: 'View All Blogs', link: '/blogs' }}
        secondaryButton={{ text: 'Browse Resources', link: '#categories' }}
        stats={[
          { value: '100+', label: 'Articles', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          { value: '50+', label: 'Case Studies', color: 'text-blue-400' },
          { value: '20+', label: 'White Papers', color: 'text-emerald-400' },
          { value: '10+', label: 'Events', color: 'text-purple-400' },
        ]}
      />

      {/* Categories Grid */}
      <section id="categories" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              const colorStyles = {
                blue: { bg: 'bg-blue-100', text: 'text-brand-blue' },
                green: { bg: 'bg-green-100', text: 'text-green-600' },
                purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
                orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
                cyan: { bg: 'bg-cyan-100', text: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
                rose: { bg: 'bg-rose-100', text: 'text-rose-600' }
              };
              const colors = colorStyles[category.color] || colorStyles.blue;
              return (
                <Link 
                  key={index}
                  to={category.link}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border-2 border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:border-brand-blue h-full">
                    <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-blue transition-colors">{category.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      {category.count && <span className="text-sm font-semibold text-gray-500">{category.count} items</span>}
                      <span className="text-brand-blue font-medium flex items-center gap-1">
                        Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      {latestBlogs.length > 0 && (
        <section className="py-24 bg-gray-50 dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Latest Blogs</h2>
              <Link to="/blogs" className="text-brand-blue font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                View All <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {latestBlogs.map((blog) => (
                <Link key={blog.id} to={`/blogs/${blog.slug}`} className="group">
                  <article className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
                    <div className="h-48 overflow-hidden bg-gray-100 dark:bg-[#0a0a0c] relative">
                       {blog.featuredImage ? (
                        <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                             onError={(e) => { e.target.style.display = 'none'; }} />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                       )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-sm text-brand-blue font-semibold">{blog.category}</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">{blog.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{blog.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span>{blog.readTime || '5 min'}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Case Studies */}
      {latestCaseStudies.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Featured Case Studies</h2>
              <Link to="/case-studies" className="text-brand-blue font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                View All <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {latestCaseStudies.map((study) => (
                <Link key={study.id} to={`/case-studies/${study.slug}`} className="group">
                  <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-brand-blue transition-all h-full flex flex-col">
                    <div className="h-48 overflow-hidden bg-gray-100 dark:bg-[#0a0a0c] relative">
                      {study.featuredImage ? (
                        <img src={study.featuredImage} alt={study.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                             onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-sm text-brand-blue font-semibold">{study.industry || 'Enterprise'}</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">{study.title}</h3>
                      {study.excerpt && (
                         <div className="flex items-center gap-2 text-green-600 font-semibold mt-auto">
                            <TrendingUp className="w-5 h-5" />
                            <span className="line-clamp-1">{study.excerpt}</span>
                         </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-brand-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-blue-100 mb-8">Subscribe to our newsletter for the latest insights, research, and event announcements.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button className="w-full sm:w-auto bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Insights;
