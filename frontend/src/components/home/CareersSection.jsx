import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router';

const CareersSection = () => {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-white dark:bg-[#0a0a0c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Text Header */}
        <div className="text-center max-w-5xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            <span className="bg-brand-gradient bg-clip-text text-transparent">Build a Career</span> That Makes an Impact.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            At Kangqore, we leverage intelligent technologies to shape the future of business.<br className="hidden md:block"/> Join us to innovate, grow, and create lasting impact.
          </motion.p>
        </div>

        {/* Image Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center">
            
            {/* Image 1 - Tall */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[3/4] md:aspect-[2/3] rounded-2xl overflow-hidden shadow-xl"
            >
              <img src="/images/careers/portrait-1.png" alt="Career at Kangqore" className="w-full h-full object-cover" />
            </motion.div>

            {/* Image 2 - Square */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl md:translate-y-8"
            >
              <img src="/images/careers/portrait-2.png" alt="Career at Kangqore" className="w-full h-full object-cover" />
            </motion.div>

            {/* Image 3 - Square */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden shadow-xl md:translate-y-8"
            >
              <img src="/images/careers/portrait-3.png" alt="Career at Kangqore" className="w-full h-full object-cover" />
            </motion.div>

            {/* Image 4 - Tall */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative aspect-[3/4] md:aspect-[2/3] rounded-2xl overflow-hidden shadow-xl"
            >
              <img src="/images/careers/portrait-4.png" alt="Career at Kangqore" className="w-full h-full object-cover" />
            </motion.div>

          </div>

          {/* Frosted Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute bottom-4 md:-bottom-12 left-4 right-4 md:left-12 md:right-12 z-20"
          >
            <div className="bg-white/70 dark:bg-[#1a1c29]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
              <h3 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Find Your Spark at Kangqore
              </h3>
              <Link 
                to="/careers" 
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-sm whitespace-nowrap"
              >
                Build Your Legacy
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default CareersSection;
