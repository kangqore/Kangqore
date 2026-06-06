import React, { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, Building, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ContentSearch from '../components/ContentSearch';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';
import { contentSEO } from '../data/seoData';

const CaseStudiesPage = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        setLoading(true);
        // Build URL parameters
        const params = new URLSearchParams({
          type: 'CASE_STUDY',
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          ...(searchQuery && { search: searchQuery })
        });

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/content?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch case studies');
        }

        const data = await response.json();
        setCaseStudies(data.items || []);
        setTotalPages(data.totalPages || 1);
        
      } catch (err) {
        console.error('Error fetching case studies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 on search
  };

  return (
    <div className="bg-white dark:bg-black">
      <SEO 
        title={contentSEO.caseStudies.title}
        description={contentSEO.caseStudies.description}
        keywords={contentSEO.caseStudies.keywords}
        url={contentSEO.caseStudies.url}
      />
      <PageHero
        badge="Success Stories"
        title="Real results from real"
        titleHighlight="transformations"
        description="See how we deliver measurable impact through digital transformation, AI implementation, and enterprise modernization across industries."
        primaryButton={{ text: 'View All Cases', link: '#cases' }}
        secondaryButton={{ text: 'Request Demo', link: '/contact' }}
        stats={[
          { value: '100+', label: 'Projects Delivered', color: 'text-cyan-400' },
          { value: '40%', label: 'Avg Cost Reduction', color: 'text-blue-400' },
          { value: '98%', label: 'Client Satisfaction', color: 'text-emerald-400' },
          { value: '15+', label: 'Industries Served', color: 'text-purple-400' },
        ]}
      />

      <section id="cases" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Bar */}
          <div className="flex justify-between items-center mb-12 flex-col md:flex-row gap-4">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Case Studies</h2>
             <ContentSearch 
                onSearch={handleSearch} 
                placeholder="Search case studies..." 
             />
          </div>

          {loading ? (
             <div className="flex justify-center items-center py-20">
               <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
             </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600">
              <p>Unable to load case studies at this time. Please try again later.</p>
            </div>
          ) : caseStudies.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No case studies found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((study) => (
                  <Link
                    key={study.id}
                    // Using generic blog/content route for filter type compatibility
                    // Assuming we will route all content through /case-studies/:slug which maps to generic ContentDetails
                    to={`/case-studies/${study.slug}`} 
                    className="block"
                  >
                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer h-full flex flex-col">
                      <div className="h-48 overflow-hidden bg-gray-100 dark:bg-[#0a0a0c] relative">
                        {study.featuredImage ? (
                          <img src={study.featuredImage} alt={study.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                      </div>
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-4">
                          <Building className="w-5 h-5 text-brand-blue" />
                          {/* Use industry if available, otherwise generic */}
                          <span className="text-sm font-medium text-brand-blue">{study.industry || 'Enterprise'}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">{study.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">{study.excerpt}</p>
                        {/* If we had specific 'Result' metadata in backend, we'd display it. Using excerpt as proxy effectively. */}
                        <span className="text-brand-blue font-medium flex items-center gap-1 mt-auto pt-4">View Case Study <ArrowRight className="w-4 h-4" /></span>
                      </div>
                    </div>
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

export default CaseStudiesPage;