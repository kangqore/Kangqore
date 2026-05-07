import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { departmentData } from '../data/departmentData';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Realistic3DIcon from './ui/Realistic3DIcon';

const InteractiveServicesMap = () => {
  const [activeDept, setActiveDept] = useState(departmentData[0].slug);

  const currentDept = departmentData.find(d => d.slug === activeDept);
  const IconComponent = currentDept.icon;

  return (
    <div className="w-full bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[600px] max-h-[800px]">
      {/* Left sidebar - Departments List */}
      <div className="w-full lg:w-1/3 bg-black/50 backdrop-blur-md border-r border-white/5 p-6 overflow-y-auto no-scrollbar">
        <h3 className="text-white font-display font-bold text-xl mb-6 px-2">Core Capabilities</h3>
        <div className="space-y-2">
          {departmentData.map((dept) => {
            const DeptIcon = dept.icon;
            const isActive = activeDept === dept.slug;
            return (
              <button
                key={dept.slug}
                onClick={() => setActiveDept(dept.slug)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-cyan/20 border border-brand-cyan/30 text-white' 
                    : 'bg-white dark:bg-gray-900 dark:border-gray-800/5 border border-transparent text-slate-400 hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 hover:text-white'
                }`}
              >
                <Realistic3DIcon 
                  icon={DeptIcon} 
                  className="w-10 h-10 shrink-0" 
                  iconSize="w-5 h-5" 
                  theme={isActive ? "cyan" : "dark"} 
                />
                <span className="font-medium text-left flex-1 text-sm">{dept.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Content - Services Grid */}
      <div className="w-full lg:w-2/3 p-8 lg:p-12 relative bg-[#050505] overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDept.slug}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <Realistic3DIcon 
                icon={IconComponent} 
                className="w-16 h-16 shrink-0" 
                iconSize="w-8 h-8" 
                theme="brand" 
              />
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">{currentDept.name}</h2>
                <p className="text-cyan-400 font-medium text-sm sm:text-base">{currentDept.services.length} Specialized Services</p>
              </div>
            </div>
            
            <p className="text-slate-400 leading-relaxed mb-10 max-w-2xl text-sm sm:text-base">
              {currentDept.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 auto-rows-max mb-10">
              {currentDept.services.map((service, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={service.slug}
                >
                  <Link
                    to={`/services/${currentDept.slug}/${service.slug}`}
                    className="group block p-5 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800/5 border border-white/5 hover:border-cyan-400/30 hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-all duration-300 h-full flex flex-col justify-between"
                  >
                    <h4 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors text-sm">{service.name}</h4>
                    <div className="flex justify-end mt-2">
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto">
              <Link
                to={`/department/${currentDept.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-black text-black font-bold rounded-lg hover:bg-gray-200 transition-colors group text-sm"
              >
                Explore Full Department
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveServicesMap;
