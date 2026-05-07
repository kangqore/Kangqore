import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, BookOpen, Calendar, Newspaper, FolderOpen, Download, ArrowRight, Layers, Cpu } from 'lucide-react';
import { departmentData } from '../data/departmentData';

/**
 * Global Search Component
 * Searches across all published content types
 */
const GlobalSearch = ({ onClose, isOpen }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchContent = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        // 1. Client-side search for Departments and Services
        const searchTerm = query.toLowerCase();
        const localResults = [];
        
        departmentData.forEach(dept => {
          // Match Department
          if (dept.name.toLowerCase().includes(searchTerm)) {
            localResults.push({
              id: `dept-${dept.slug}`,
              title: dept.name,
              excerpt: dept.description,
              content_type: 'department',
              slug: dept.slug
            });
          }
          
          // Match Services within Department
          dept.services.forEach(svc => {
            if (svc.name.toLowerCase().includes(searchTerm) || svc.shortDescription.toLowerCase().includes(searchTerm)) {
              localResults.push({
                id: `svc-${svc.slug}`,
                title: svc.name,
                excerpt: svc.shortDescription,
                content_type: 'service',
                slug: svc.slug,
                deptSlug: dept.slug
              });
            }
          });
        });

        // 2. Server-side search for Insights/Content
        const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}&limit=10`);
        let serverResults = [];
        if (res.ok) {
          const data = await res.json();
          serverResults = data.results || [];
        }

        // 3. Merge results (prioritize Departments and Services)
        setResults([...localResults, ...serverResults]);
        setShowResults(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchContent, 300);
    return () => clearTimeout(debounce);
  }, [query, API_URL]);

  const getContentTypeIcon = (type) => {
    const icons = {
      blog: BookOpen,
      case_study: FolderOpen,
      white_paper: FileText,
      event: Calendar,
      news: Newspaper,
      brochure: Download,
      department: Layers,
      service: Cpu
    };
    return icons[type] || FileText;
  };

  const getContentTypeUrl = (item) => {
    const typeUrls = {
      blog: `/blogs/${item.slug}`,
      case_study: `/case-studies/${item.slug}`,
      white_paper: `/white-papers/${item.slug}`,
      event: `/events/${item.slug}`,
      news: `/news/${item.slug}`,
      brochure: `/brochures/${item.slug}`,
      department: `/department/${item.slug}`,
      service: `/services/${item.deptSlug}/${item.slug}`
    };
    return typeUrls[item.content_type] || `/insights`;
  };

  const handleResultClick = (item) => {
    const url = getContentTypeUrl(item);
    navigate(url);
    setQuery('');
    setShowResults(false);
    onClose?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setQuery('');
      setShowResults(false);
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-24">
      <div className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search services, departments, blogs, case studies..."
            className="flex-1 text-lg outline-none placeholder:text-gray-400"
            data-testid="global-search-input"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            onClick={() => { setQuery(''); setShowResults(false); onClose?.(); }}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : showResults && results.length > 0 ? (
            <div className="py-2">
              {results.map((item) => {
                const Icon = getContentTypeIcon(item.content_type);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleResultClick(item)}
                    className="w-full flex items-start gap-4 px-6 py-4 hover:bg-gray-50 dark:bg-[#050505] text-left transition-colors"
                    data-testid={`search-result-${item.id}`}
                  >
                    <div className="w-10 h-10 bg-gray-100 dark:bg-[#0a0a0c] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">{item.title}</h4>
                      {item.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.excerpt}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          ['department', 'service'].includes(item.content_type) 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'
                        }`}>
                          {item.content_type?.replace('_', ' ')}
                        </span>
                        {item.author && (
                          <span className="text-xs text-gray-400">by {item.author}</span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-3" />
                  </button>
                );
              })}
            </div>
          ) : showResults && query.length >= 2 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
              <p className="text-gray-500">Try different keywords or browse our content sections.</p>
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              <p className="mb-4">Type at least 2 characters to search</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['AI', 'Cloud', 'Digital Transformation', 'Cybersecurity'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 bg-gray-100 dark:bg-[#0a0a0c] hover:bg-gray-200 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>Press ESC to close</span>
          <span>Search across all published content</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
