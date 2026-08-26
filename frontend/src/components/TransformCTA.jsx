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
    <section className="pt-28 md:pt-36 lg:pt-44 pb-14 md:pb-16 lg:pb-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div 
          ref={sectionRef}
          className={`transition-all duration-1000 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Main Content */}
          <div className="flex flex-col gap-8 mb-16">
            {/* Large Headline */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 dark:text-white leading-tight cursor-default lg:whitespace-nowrap">
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
            
            {/* Bottom Description */}
            <div className="max-w-4xl">
              <p className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl leading-relaxed">
                Let’s define your next competitive advantage. Talk to Kangqore’s transformation advisors.
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 w-full mt-10">
            <Link
              to="/contact"
              className="group flex-1 flex items-center justify-between bg-white/70 dark:bg-[#1a1c29]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl px-8 py-8 shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-[#1a1c29]/80 transition-all duration-300 text-gray-900 dark:text-white"
            >
              <span className="text-2xl md:text-3xl font-normal tracking-tight">Get in touch</span>
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5] transform transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
            <Link
              to="/book-discovery"
              className="group flex-1 flex items-center justify-between bg-white/70 dark:bg-[#1a1c29]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl px-8 py-8 shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-[#1a1c29]/80 transition-all duration-300 text-gray-900 dark:text-white"
            >
              <span className="text-2xl md:text-3xl font-normal tracking-tight">Schedule Your 30-min Discovery Call</span>
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5] transform transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformCTA;

