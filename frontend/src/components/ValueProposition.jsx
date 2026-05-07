import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Users, ArrowRight, Plus, X } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';

// Card data with detailed explanations
const cardData = [
  {
    id: 1,
    icon: Cpu,
    title: "Modernization Without Disruption, Risk, Or Downtime.",
    shortDesc: "We help enterprises modernize legacy systems, infrastructure, and platforms without breaking business continuity—reducing technical debt while improving security, scalability, and cost efficiency.",
    detailedContent: {
      heading: "Enterprise Modernization Services",
      headingLink: "/services",
      description: "Our comprehensive modernization approach ensures your business never stops while we transform your technology landscape.",
      features: [
        {
          title: "Legacy System Migration",
          desc: "Seamlessly migrate from outdated systems to modern cloud-native architectures without service interruption."
        },
        {
          title: "Zero-Downtime Deployments",
          desc: "Implement blue-green deployments and canary releases to ensure continuous availability during updates."
        },
        {
          title: "Technical Debt Reduction",
          desc: "Systematically identify and eliminate technical debt while maintaining system stability."
        },
        {
          title: "Security-First Approach",
          desc: "Enhance security posture throughout the modernization journey with built-in compliance frameworks."
        }
      ],
      stats: [
        { value: "99.9%", label: "Uptime Maintained" },
        { value: "60%", label: "Cost Reduction" },
        { value: "3x", label: "Faster Deployment" }
      ]
    }
  },
  {
    id: 2,
    icon: Zap,
    title: "Design Operations That Scale, Adapt, And Self Optimize.",
    shortDesc: "Kangqore re-engineers enterprise processes using automation, data, and AI—eliminating friction, improving decision speed, and delivering measurable operational efficiency across functions.",
    detailedContent: {
      heading: "Intelligent Operations & Automation",
      headingLink: "/services",
      description: "Transform your operations into a self-optimizing ecosystem that continuously improves efficiency and reduces costs.",
      features: [
        {
          title: "Process Automation",
          desc: "Automate repetitive tasks and workflows with intelligent RPA and AI-driven decision systems."
        },
        {
          title: "Data-Driven Insights",
          desc: "Leverage real-time analytics and machine learning to optimize operations dynamically."
        },
        {
          title: "Adaptive Workflows",
          desc: "Build flexible processes that automatically adjust to changing business conditions and demands."
        },
        {
          title: "Performance Optimization",
          desc: "Continuously monitor and improve operational metrics with AI-powered recommendations."
        }
      ],
      stats: [
        { value: "40%", label: "Efficiency Gain" },
        { value: "75%", label: "Manual Tasks Automated" },
        { value: "2x", label: "Decision Speed" }
      ]
    }
  },
  {
    id: 3,
    icon: Users,
    title: "Experience Design Powered By Enterprise Grade Systems.",
    shortDesc: "We build digital experiences backed by scalable platforms, secure integrations, and real-time intelligence—ensuring every customer and employee interaction delivers consistency, performance, and business value.",
    detailedContent: {
      heading: "Digital Experience Excellence",
      headingLink: "/services",
      description: "Create exceptional digital experiences that delight users while delivering measurable business outcomes.",
      features: [
        {
          title: "Omnichannel Experiences",
          desc: "Deliver consistent, personalized experiences across all touchpoints—web, mobile, and beyond."
        },
        {
          title: "Real-Time Personalization",
          desc: "Use AI to deliver contextually relevant content and recommendations in real-time."
        },
        {
          title: "Enterprise Integration",
          desc: "Seamlessly connect with existing enterprise systems for unified data and experiences."
        },
        {
          title: "Performance at Scale",
          desc: "Handle millions of concurrent users with sub-second response times and 99.99% availability."
        }
      ],
      stats: [
        { value: "50%", label: "Engagement Increase" },
        { value: "35%", label: "Conversion Boost" },
        { value: "4.8/5", label: "User Satisfaction" }
      ]
    }
  }
];

// Modal Component
const DetailModal = ({ isOpen, onClose, card }) => {
  if (!isOpen || !card) return null;

  const IconComponent = card.icon;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 dark:border-gray-800 border-b border-gray-100 p-6 flex items-start justify-between rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-xl flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={1.5} />
            </div>
            {card.detailedContent.headingLink ? (
              <Link to={card.detailedContent.headingLink} className="text-2xl font-bold text-gray-900 dark:text-white hover:text-brand-blue transition-colors">
                {card.detailedContent.heading}
              </Link>
            ) : (
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{card.detailedContent.heading}</h2>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#0a0a0c] hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {card.detailedContent.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {card.detailedContent.stats.map((stat, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-5 text-center">
                <div className="text-3xl font-bold text-brand-blue mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Key Capabilities</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {card.detailedContent.features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-5">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex gap-4">
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={onClose}
              className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Typewriter component for the headline
const TypewriterText = ({ isVisible }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const fullText = "Today, we help organizations transform businesses & evolve industries through intelligent systems, scalable platforms, & outcome-driven engineering.";
  
  useEffect(() => {
    if (!isVisible) return;
    
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30); // Speed of typing
      
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, isVisible]);

  // Function to render text with gradient highlights
  const renderText = () => {
    const text = displayedText;
    const highlights = [
      { phrase: 'intelligent systems', start: text.indexOf('intelligent systems') },
      { phrase: 'scalable platforms', start: text.indexOf('scalable platforms') },
      { phrase: 'outcome-driven engineering', start: text.indexOf('outcome-driven engineering') }
    ];

    let result = [];
    let lastIndex = 0;

    // Sort highlights by their position
    const validHighlights = highlights
      .filter(h => h.start !== -1 && h.start < text.length)
      .sort((a, b) => a.start - b.start);

    validHighlights.forEach((highlight, idx) => {
      // Add text before this highlight
      if (highlight.start > lastIndex) {
        result.push(
          <span key={`text-${idx}`}>
            {text.slice(lastIndex, highlight.start)}
          </span>
        );
      }
      
      // Calculate how much of the highlight phrase is visible
      const endIndex = Math.min(highlight.start + highlight.phrase.length, text.length);
      const visiblePhrase = text.slice(highlight.start, endIndex);
      
      if (visiblePhrase.length > 0) {
        result.push(
          <span 
            key={`highlight-${idx}`}
            className="bg-brand-gradient bg-clip-text text-transparent"
          >
            {visiblePhrase}
          </span>
        );
      }
      
      lastIndex = endIndex;
    });

    // Add any remaining text
    if (lastIndex < text.length) {
      result.push(
        <span key="remaining">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white max-w-5xl mb-6 leading-tight">
      {renderText()}
      {!isComplete && (
        <span className="inline-block w-1 h-12 md:h-14 lg:h-16 bg-brand-gradient ml-1 animate-pulse" />
      )}
    </h2>
  );
};

const ValueProposition = () => {
  const [titleRef, titleVisible] = useScrollAnimation({ once: true, threshold: 0.3 });
  const [card1Ref, card1Visible] = useScrollAnimation({ once: true, threshold: 0.2 });
  const [card2Ref, card2Visible] = useScrollAnimation({ once: true, threshold: 0.2 });
  const [card3Ref, card3Visible] = useScrollAnimation({ once: true, threshold: 0.2 });
  const [featuredRef, featuredVisible] = useScrollAnimation({ once: true, threshold: 0.2 });
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (cardIndex) => {
    setActiveModal(cardData[cardIndex]);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* GlobalLogic-style Hero Text Section */}
        <div 
          ref={titleRef}
          className={`mb-24 lg:mb-32 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Introductory Text */}
          <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl lg:text-2xl max-w-4xl mb-12 leading-relaxed font-medium">
            Kangqore is a value-driven IT and digital transformation company trusted by enterprises to modernize, scale, and innovate in a rapidly changing world.
          </p>
          
          {/* Main Headline with Typewriter Effect */}
          <TypewriterText isVisible={titleVisible} />
          
          {/* Call to Action - Below the headline */}
          <Link 
            to="/contact"
            className="inline-flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white hover:text-brand-blue transition-colors group mt-4"
          >
            Learn more about what sets us apart
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {/* Card 1 */}
          <div 
            ref={card1Ref}
            className={`relative bg-white dark:bg-gray-900 dark:border-gray-800 p-8 lg:p-10 rounded-3xl shadow-sm hover:shadow-md transition-all duration-700 transform ${
              card1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{ transitionDelay: '0.1s' }}
          >
            <div className="mb-8">
              <Cpu className="w-10 h-10 text-gray-900 dark:text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{cardData[0].title}</h3>
            <p className="text-gray-500 leading-relaxed text-base mb-16">{cardData[0].shortDesc}</p>
            <button 
              onClick={() => openModal(0)}
              className="absolute bottom-6 right-6 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 hover:scale-110 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
          </div>

          {/* Card 2 */}
          <div 
            ref={card2Ref}
            className={`relative bg-white dark:bg-gray-900 dark:border-gray-800 p-8 lg:p-10 rounded-3xl shadow-sm hover:shadow-md transition-all duration-700 transform ${
              card2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div className="mb-8">
              <Zap className="w-10 h-10 text-gray-900 dark:text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{cardData[1].title}</h3>
            <p className="text-gray-500 leading-relaxed text-base mb-16">{cardData[1].shortDesc}</p>
            <button 
              onClick={() => openModal(1)}
              className="absolute bottom-6 right-6 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 hover:scale-110 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
          </div>

          {/* Card 3 */}
          <div 
            ref={card3Ref}
            className={`relative bg-white dark:bg-gray-900 dark:border-gray-800 p-8 lg:p-10 rounded-3xl shadow-sm hover:shadow-md transition-all duration-700 transform ${
              card3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{ transitionDelay: '0.3s' }}
          >
            <div className="mb-8">
              <Users className="w-10 h-10 text-gray-900 dark:text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{cardData[2].title}</h3>
            <p className="text-gray-500 leading-relaxed text-base mb-16">{cardData[2].shortDesc}</p>
            <button 
              onClick={() => openModal(2)}
              className="absolute bottom-6 right-6 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-700 hover:scale-110 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Featured section */}
        <div 
          ref={featuredRef}
          className={`mt-20 lg:mt-28 bg-brand-gradient rounded-3xl overflow-hidden shadow-xl transition-all duration-1000 transform ${
            featuredVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="p-10 lg:p-16">
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-8">
                Engineering AI for Real World Outcomes
              </h3>
              <p className="text-white/90 text-lg lg:text-xl mb-10 leading-relaxed">
                Kangqore engineers the last mile of enterprise AI deploying, governing, and operating AI systems across critical environments so intelligence delivers reliable, measurable business outcomes.
              </p>
              <a
                href="#"
                className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Get started
              </a>
            </div>
            <div className="h-full min-h-[300px] lg:min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80"
                alt="Engineering AI for impact"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <DetailModal isOpen={!!activeModal} onClose={closeModal} card={activeModal} />
    </section>
  );
};

export default ValueProposition;