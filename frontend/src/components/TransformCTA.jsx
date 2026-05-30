import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Award, Globe, Fingerprint, HeartPulse, CreditCard, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const DancingWord = ({ word, startIndex = 0, letterClassName = "", hasSpaceAfter = false, isDancing = true }) => {
  return (
    <span className="inline-block whitespace-nowrap">
      {word.split("").map((char, index) => {
        const i = startIndex + index;
        
        if (char === 'i') {
          return (
            <motion.span 
              key={`${i}`} 
              className="relative inline-block cursor-default"
              whileHover={{ y: -20, scale: 1.2, transition: { type: 'spring', stiffness: 300 } }}
            >
              {/* Invisible 'i' to hold the exact layout space */}
              <span className={`invisible inline-block ${letterClassName}`}>i</span>
              
              {/* The animated dotless 'ı' */}
              <motion.span
                className={`absolute left-0 top-0 inline-block ${letterClassName}`}
                animate={{ 
                  y: isDancing ? [0, -8, 0] : 0,
                  rotate: isDancing ? [0, i % 2 === 0 ? 3 : -3, 0] : 0,
                }}
                transition={{
                  duration: isDancing ? 3 : 0.8,
                  repeat: isDancing ? Infinity : 0,
                  ease: isDancing ? "easeInOut" : "easeOut",
                  delay: isDancing ? i * 0.1 : 0,
                }}
                style={{ transformOrigin: "bottom center" }}
              >
                ı
              </motion.span>
              
              {/* The dynamically bouncing dot */}
              <motion.span
                animate={{ 
                  y: isDancing ? [0, -25, 0] : 0,
                  rotate: isDancing ? [0, 180, 360] : 0,
                  scale: isDancing ? [1, 1.3, 1] : 1
                }}
                transition={{
                  duration: isDancing ? 2 : 0.8,
                  repeat: isDancing ? Infinity : 0,
                  ease: isDancing ? "easeInOut" : "easeOut",
                  delay: isDancing ? i * 0.1 : 0
                }}
                className="absolute left-[50%] -ml-[0.125em] top-[0.15em] w-[0.25em] h-[0.25em] rounded-full bg-gradient-to-r from-[#2564ea] to-[#4ab6d4]"
                style={{ transformOrigin: "center" }}
              />
            </motion.span>
          );
        }

        if (char === '.') {
          return (
            <motion.span
              key={`${i}`}
              whileHover={{ y: -25, scale: 1.4, transition: { type: 'spring', stiffness: 300 } }}
              animate={{ 
                y: isDancing ? [0, -25, 0] : 0,
                rotate: isDancing ? [0, 180, 360] : 0,
                scale: isDancing ? [1, 1.3, 1] : 1
              }}
              transition={{
                duration: isDancing ? 2 : 0.8,
                repeat: isDancing ? Infinity : 0,
                ease: isDancing ? "easeInOut" : "easeOut",
                delay: isDancing ? i * 0.1 : 0
              }}
              className={`inline-block cursor-default ${letterClassName}`}
              style={{ transformOrigin: "center" }}
            >
              .
            </motion.span>
          );
        }

        return (
          <motion.span
            key={`${i}`}
            whileHover={{ y: -20, scale: 1.2, transition: { type: 'spring', stiffness: 300 } }}
            animate={{ 
              y: isDancing ? [0, -8, 0] : 0,
              rotate: isDancing ? [0, i % 2 === 0 ? 3 : -3, 0] : 0,
            }}
            transition={{
              duration: isDancing ? 3 : 0.8,
              repeat: isDancing ? Infinity : 0,
              ease: isDancing ? "easeInOut" : "easeOut",
              delay: isDancing ? i * 0.1 : 0,
            }}
            className={`inline-block cursor-default ${letterClassName}`}
            style={{ transformOrigin: "bottom center" }}
          >
            {char}
          </motion.span>
        );
      })}
      {hasSpaceAfter && (
        <span className="inline-block whitespace-pre"> </span>
      )}
    </span>
  );
};

const TransformCTA = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ once: true, threshold: 0.3 });
  const [isDancing, setIsDancing] = React.useState(true);

  React.useEffect(() => {
    let timeoutId;
    
    const loop = () => {
      setIsDancing(true);
      timeoutId = setTimeout(() => {
        setIsDancing(false);
        timeoutId = setTimeout(loop, 3000); // 3 seconds rest
      }, 5000); // 5 seconds dance
    };
    
    // Start the first phase
    timeoutId = setTimeout(() => {
      setIsDancing(false);
      timeoutId = setTimeout(loop, 3000);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div 
          ref={sectionRef}
          className={`transition-all duration-1000 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-20">
            {/* Large Headline */}
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold text-gray-900 dark:text-white leading-tight max-w-4xl cursor-default">
              <DancingWord word="We" startIndex={0} hasSpaceAfter={true} isDancing={isDancing} />
              <DancingWord 
                word="innovate" 
                startIndex={2} 
                letterClassName="bg-brand-gradient bg-clip-text text-transparent" 
                hasSpaceAfter={true}
                isDancing={isDancing}
              />
              <DancingWord word="futures." startIndex={10} isDancing={isDancing} />
            </h2>
            
            {/* Get in Touch Button */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand-gradient text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 self-start lg:self-auto whitespace-nowrap"
            >
              Get in touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          {/* Bottom Description */}
          <div className="max-w-2xl">
            <p className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl leading-relaxed">
              Let’s define your next competitive advantage. Talk to Kangqore’s transformation advisors.
            </p>
          </div>

          {/* Trust & Compliance Badges */}
          <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-900 flex flex-wrap items-center gap-3 sm:gap-4">
            {[
              { name: 'SOC 2 Aligned', id: 'soc2' },
              { name: 'ISO 27001 Oriented', id: 'iso27001' },
              { name: 'GDPR Ready', id: 'gdpr' },
              { name: 'DPDP Conscious', id: 'dpdp' },
              { name: 'HIPAA Aware', id: 'hipaa' },
              { name: 'PCI DSS Mindful', id: 'pcidss' },
              { name: 'CMMI Practiced', id: 'cmmi' }
            ].map(({ name, id }) => (
              <div 
                key={name} 
                className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-200 dark:hover:border-blue-900 transition-colors shadow-sm"
              >
                <img 
                  src={`/assets/badges/${id}.png`} 
                  alt={`${name} Logo`} 
                  className="w-5 h-5 object-contain"
                  onError={(e) => { 
                    if (e.target.src.endsWith('.png')) {
                      e.target.src = `/assets/badges/${id}.svg`;
                    } else {
                      e.target.style.display = 'none';
                    }
                  }} 
                />
                <span className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformCTA;

