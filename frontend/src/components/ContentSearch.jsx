
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

/**
 * ContentSearch Component
 * @param {string} initialQuery - Initial search query
 * @param {function} onSearch - Callback function when search query changes (debounced)
 * @param {string} placeholder - Placeholder text
 */
const ContentSearch = ({ initialQuery = '', onSearch, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative max-w-md w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-900 dark:border-gray-800 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-brand-blue sm:text-sm"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default ContentSearch;
