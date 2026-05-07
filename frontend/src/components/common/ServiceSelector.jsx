import React, { useState, useEffect, useRef } from 'react';
import { X, Check, ChevronDown, Tag } from 'lucide-react';
import { departmentData } from '../../data/departmentData';

/**
 * ServiceSelector - A multi-select component for choosing services from the catalog.
 * 
 * @param {Object} props
 * @param {string[]} props.selectedServices - Array of selected service slugs
 * @param {function} props.onChange - Callback (newSelectedServices[]) => void
 * @param {string} props.label - Label for the input
 * @param {string} props.placeholder - Placeholder text
 */
const ServiceSelector = ({ 
  selectedServices = [], 
  onChange, 
  label = "Select Services of Interest",
  placeholder = "Search for services..." 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  // Flatten departments into a searchable list of services
  const allServices = departmentData.flatMap(dept => 
    dept.services.map(svc => ({
      ...svc,
      departmentName: dept.name,
      departmentSlug: dept.slug
    }))
  );

  // Filter services based on search
  const filteredDepartments = departmentData.map(dept => {
    const matchingServices = dept.services.filter(svc => {
      const term = searchTerm.toLowerCase().trim();
      const svcName = svc.name.toLowerCase();
      
      if (!term) return true; // Show all if empty (though filteredDepartments usually needs length)
      
      // For single letter, strict startsWith to show "initials of A" behavior
      if (term.length === 1) {
        return svcName.startsWith(term);
      }

      // For normal search, fuzzy match service name or department
      return svcName.includes(term) || dept.name.toLowerCase().includes(term);
    });

    // Optional: Sort matches to show "starts with" results first within the group
    matchingServices.sort((a, b) => {
      const term = searchTerm.toLowerCase();
      const aStarts = a.name.toLowerCase().startsWith(term);
      const bStarts = b.name.toLowerCase().startsWith(term);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

    return {
      ...dept,
      services: matchingServices
    };
  }).filter(dept => dept.services.length > 0);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleService = (slug) => {
    if (selectedServices.includes(slug)) {
      onChange(selectedServices.filter(s => s !== slug));
    } else {
      onChange([...selectedServices, slug]);
    }
  };

  const removeService = (slug, e) => {
    e.stopPropagation();
    onChange(selectedServices.filter(s => s !== slug));
  };

  // Get service details for selected slugs
  const getSelectedDetails = () => {
    return selectedServices.map(slug => 
      allServices.find(s => s.slug === slug)
    ).filter(Boolean); // Remove undefined if slug invalid
  };

  // Handle backspace to remove last tag if input is empty
  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && searchTerm === '' && selectedServices.length > 0) {
      const newSelected = [...selectedServices];
      newSelected.pop();
      onChange(newSelected);
    }
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      {/* Input / Selected Tags Area */}
      <div 
        className={`min-h-[42px] px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border rounded-lg cursor-text flex flex-wrap gap-2 items-center transition-all ${
          isOpen ? 'border-brand-blue ring-2 ring-brand-blue/20' : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => {
          setIsOpen(true);
          // Focus the input when wrapper is clicked
          const input = wrapperRef.current?.querySelector('input');
          input?.focus();
        }}
      >
        {getSelectedDetails().map(svc => (
          <span 
            key={svc.slug} 
            className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-brand-blue px-2 py-1 rounded text-sm font-medium border border-blue-100"
          >
            {svc.name}
            <button 
              type="button"
              onClick={(e) => removeService(svc.slug, e)}
              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        {/* Unified Search Input */}
        <input
          type="text"
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent placeholder:text-gray-400"
          placeholder={selectedServices.length === 0 ? placeholder : ""}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-xl border border-gray-100 max-h-[400px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Stats Header (Search removed) */}
          <div className="p-2 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-xs text-slate-500 font-medium flex justify-between">
             <span>{allServices.length} Total Services</span>
             <span>{selectedServices.length} Selected</span>
          </div>

          {/* Scrollable List */}
          <div className="overflow-y-auto flex-1 p-2">
            {filteredDepartments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No services found matching &quot;{searchTerm}&quot;
              </div>
            ) : (
              filteredDepartments.map(dept => (
                <div key={dept.slug} className="mb-4 last:mb-0">
                  <div className="px-2 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-[#050505] rounded mb-1 sticky top-0">
                    {dept.name}
                  </div>
                  <div className="space-y-1">
                    {dept.services.map(svc => {
                      const isSelected = selectedServices.includes(svc.slug);
                      return (
                        <button
                          type="button"
                          key={svc.slug}
                          onClick={() => {
                            toggleService(svc.slug);
                            setSearchTerm(''); // Clear search after selection
                            // Refocus input for continuous selection
                            wrapperRef.current?.querySelector('input')?.focus();
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between group transition-colors ${
                            isSelected 
                              ? 'bg-brand-blue/10 text-brand-blue font-medium' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-[#0a0a0c]'
                          }`}
                        >
                          <span className="truncate pr-4">{svc.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-brand-blue flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;
