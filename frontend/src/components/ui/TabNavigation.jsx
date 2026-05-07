import React from 'react';
import { motion } from 'framer-motion';

const TabNavigation = ({ tabs, activeTab, onChange, layoutId = 'activeTab' }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8 bg-gray-100/50 dark:bg-gray-800/40 p-1.5 rounded-full w-fit border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        // Default active styles if not provided by tab
        const activeBg = tab.activeColor || 'bg-brand-blue'; 
        const activeText = tab.activeTextColor || 'text-white';
        const inactiveText = 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200/50 dark:hover:bg-gray-700/50';

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`group relative px-4 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 flex items-center gap-2 ${
              isActive ? activeText : inactiveText
            }`}
             style={{
                WebkitTapHighlightColor: "transparent",
              }}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className={`absolute inset-0 shadow-md rounded-full ${activeBg}`}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <tab.icon className={`w-4 h-4 ${isActive ? 'text-current' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-400'}`} />}
              {tab.label}
              {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white dark:bg-black/20' : 'bg-gray-200'}`}>
                      {tab.count}
                  </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;
