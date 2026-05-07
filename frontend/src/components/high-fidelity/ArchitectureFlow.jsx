import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Database, Cpu, Zap, Cloud, Server, Shield } from 'lucide-react';

const ArchitectureFlow = ({ type = 'ai' }) => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Particle flow animation
      particlesRef.current.forEach((particle, i) => {
        gsap.to(particle, {
          x: '400',
          duration: 2 + Math.random() * 2,
          repeat: -1,
          ease: 'none',
          delay: i * 0.5,
          opacity: [0, 1, 0],
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const aiNodes = [
    { icon: Database, label: 'Data Sources', sub: 'Structured/Unstructured' },
    { icon: Cpu, label: 'AI Cognitive Core', sub: 'Agentic Reasoning', pulse: true },
    { icon: Zap, label: 'Business Outcome', sub: 'Actionable ROI' }
  ];

  const cloudNodes = [
    { icon: Server, label: 'Legacy Core', sub: 'Monolithic Systems' },
    { icon: Cloud, label: 'Cloud Nexus', sub: 'AWS/Azure/GCP Hub', pulse: true },
    { icon: Shield, label: 'Secure Delivery', sub: 'Edge Optimization' }
  ];

  const transformationNodes = [
    { icon: Server, label: 'Legacy Silos', sub: 'Aging Infrastructure' },
    { icon: Cpu, label: 'Modernization Hub', sub: 'API & Microservices', pulse: true },
    { icon: Zap, label: 'Digital Business', sub: 'Agile Performance' }
  ];

  const nodes = type === 'ai' ? aiNodes : type === 'cloud' ? cloudNodes : transformationNodes;

  return (
    <div ref={containerRef} className="relative w-full py-16 px-4 overflow-hidden bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 rounded-[40px] border border-gray-100">
      {/* Connector Line (Background) */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-y-1/2 z-0" />

      {/* Animated Particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          ref={el => particlesRef.current[i] = el}
          className={`absolute top-1/2 left-[20%] w-2 h-2 rounded-full blur-[2px] z-10 opacity-0
            ${type === 'ai' ? 'bg-blue-400' : type === 'cloud' ? 'bg-purple-400' : 'bg-emerald-400'}`}
          style={{ transform: 'translateY(-50%)' }}
        />
      ))}

      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 max-w-5xl mx-auto">
        {nodes.map((node, i) => (
          <div key={i} className="flex flex-col items-center group w-full md:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`relative w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center mb-6 
                ${node.pulse ? 'bg-[#1D1D1F] text-white shadow-2xl shadow-blue-500/20' : 'bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 text-gray-400 shadow-sm'}
                transition-all duration-500 group-hover:scale-110`}
            >
              {/* Pulse effect for center node */}
              {node.pulse && (
                <div className={`absolute inset-0 rounded-3xl animate-ping opacity-20 ${type === 'ai' ? 'bg-blue-500' : 'bg-purple-500'}`} />
              )}
              
              <node.icon className={`w-8 h-8 md:w-10 md:h-10 ${node.pulse ? 'text-white' : 'group-hover:text-blue-500 transition-colors'}`} />
              
              {/* Step Number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 shadow-sm flex items-center justify-center text-[10px] font-black text-gray-300 uppercase">
                0{i + 1}
              </div>
            </motion.div>

            <div className="text-center">
              <h4 className="text-lg font-bold text-[#1D1D1F] tracking-tight group-hover:text-blue-600 transition-colors">
                {node.label}
              </h4>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
                {node.sub}
              </p>
            </div>
            
            {/* Mobile Arrow */}
            {i < nodes.length - 1 && (
              <div className="md:hidden mt-8 text-gray-200">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Narrative Label */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800/50 backdrop-blur-sm border border-gray-100 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-2 h-2 rounded-full ${type === 'ai' ? 'bg-blue-500' : 'bg-purple-500'}`}
          />
          Live Data Propagation Architecture
        </div>
      </div>
    </div>
  );
};

export default ArchitectureFlow;
