import React, { useState, useEffect } from 'react';
import { Download, BookOpen, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';

const WhitePaper = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050'}/api/content?type=WHITE_PAPER`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch white papers');
        }

        const data = await response.json();
        setPapers(data.items || []);
      } catch (err) {
        console.error('Error fetching white papers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  return (
    <div className="bg-white dark:bg-black">
      <SEO 
        title="White Papers & Research"
        description="Download in-depth research, guides, and strategic reports on AI, Cloud, and Digital Transformation."
        keywords="white papers, tech research, enterprise guides, digital transformation reports"
      />

      <PageHero
        badge="Research & Analysis"
        title="White Papers &"
        titleHighlight="In-Depth Reports"
        description="In-depth research and insights from our industry experts. Download comprehensive guides, frameworks, and strategic reports."
        primaryButton={{ text: 'Download All', link: '#papers' }}
        secondaryButton={{ text: 'View Research', link: '/insights' }}
        stats={[
          { value: `${papers.length}`, label: 'White Papers', color: 'text-cyan-400' },
          { value: '10K+', label: 'Downloads', color: 'text-blue-400' },
          { value: '40+', label: 'Pages Avg', color: 'text-emerald-400' },
          { value: 'Free', label: 'Access', color: 'text-purple-400' },
        ]}
      />

      <section id="papers" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
             </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600">
               <p>Unable to load white papers at this time.</p>
            </div>
          ) : papers.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
               <p className="text-xl">No white papers published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {papers.map((paper) => (
                <Link
                  key={paper.id}
                  to={`/white-papers/${paper.slug}`}
                  className="block"
                >
                  <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow flex gap-6 group h-full">
                    <div className="w-24 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-10 h-10 text-brand-blue" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors">{paper.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{paper.excerpt || paper.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(paper.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                          {paper.metadata?.downloads && (
                            <>
                              <span>•</span>
                              <span>{paper.metadata.downloads} downloads</span>
                            </>
                          )}
                        </div>
                        <span className="text-brand-blue font-medium flex items-center gap-1">
                          View <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default WhitePaper;