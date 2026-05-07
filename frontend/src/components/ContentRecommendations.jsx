import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

const ContentRecommendations = ({ contentId, limit = 4 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const sessionId = sessionStorage.getItem('sessionId') || 
          (() => { 
            const id = 'sess_' + Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem('sessionId', id);
            return id;
          })();

        const response = await axios.get(`${BACKEND_URL}/api/recommendations`, {
          params: { contentId, limit },
          headers: { 'x-session-id': sessionId }
        });

        setRecommendations(response.data || []);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [contentId, limit]);

  // Get content type URL prefix
  const getContentUrl = (item) => {
    const typeMap = {
      'BLOG': '/blogs',
      'CASE_STUDY': '/case-studies',
      'WHITE_PAPER': '/white-papers',
      'EVENT': '/events',
      'BROCHURE': '/brochures'
    };
    const prefix = typeMap[item.contentType] || '/blogs';
    return `${prefix}/${item.slug}`;
  };

  // Format content type for display
  const formatType = (type) => {
    return type?.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || 'Article';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null; // Hide if no recommendations
  }

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          You Might Also Like
        </h3>
      </div>
      
      <div className="space-y-5">
        {recommendations.map((item) => (
          <Link 
            key={item.id}
            to={getContentUrl(item)}
            className="flex gap-4 group"
          >
            {item.featuredImage && (
              <img 
                src={item.featuredImage}
                alt={item.title}
                className="w-20 h-14 rounded-lg object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity"
              />
            )}
            <div className="flex-grow min-w-0">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {formatType(item.contentType)}
              </span>
              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors line-clamp-2 mt-0.5">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContentRecommendations;
