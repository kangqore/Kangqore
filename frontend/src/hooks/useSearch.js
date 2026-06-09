import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * Custom hook for debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Unified search hook
 * @param {string} query - The search query
 * @param {string} type - 'all', 'users', 'projects', 'leads', etc.
 * @param {number} limit - Number of results per category
 */
export const useSearch = (query, type = 'all', limit = 10) => {
  const debouncedQuery = useDebounce(query, 300);
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['search', debouncedQuery, type, limit],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        return { 
            results: { 
                projects: [], deliverables: [], tasks: [], 
                users: [], leads: [], consultations: [], 
                media: [], insights: [] 
            } 
        };
      }

      const response = await axios.get(`${BACKEND_URL}/api/search`, {
        params: { q: debouncedQuery, type, limit },
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data;
    },
    enabled: !!token && debouncedQuery.length >= 2,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
