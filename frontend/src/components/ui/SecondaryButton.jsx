import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SecondaryButton = ({ text, link, onClick, className = '', theme = 'dark', icon: Icon = ArrowRight }) => {
  const isExternal = link && (link.startsWith('http') || link.startsWith('#'));
  
  const baseClasses = `group inline-flex items-center gap-4 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${className}`;
  
  const themeClasses = theme === 'dark' 
    ? 'bg-[#1D1D1F] text-white' 
    : theme === 'light'
    ? 'bg-white text-[#1D1D1F] border border-gray-200'
    : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20';

  const content = (
    <>
      <span className="font-semibold tracking-tight">{text}</span>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
        theme === 'dark' 
          ? 'bg-white dark:bg-gray-900 dark:border-gray-800 text-[#1D1D1F] group-hover:bg-brand-blue group-hover:text-white' 
          : theme === 'light'
          ? 'bg-[#1D1D1F] text-white group-hover:bg-brand-blue'
          : 'bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue group-hover:scale-110'
      }`}>
        <Icon className={`w-5 h-5 transition-transform ${Icon === ArrowRight ? 'group-hover:translate-x-0.5' : 'group-hover:scale-110'}`} />
      </div>
    </>
  );

  if (link) {
    if (isExternal) {
      if (link.startsWith('#')) {
        return (
          <a href={link} className={`${baseClasses} ${themeClasses}`}>
            {content}
          </a>
        );
      }
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" className={`${baseClasses} ${themeClasses}`}>
          {content}
        </a>
      );
    }
    return (
      <Link to={link} className={`${baseClasses} ${themeClasses}`}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${themeClasses}`}>
      {content}
    </button>
  );
};

export default SecondaryButton;
