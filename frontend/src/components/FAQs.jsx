import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const FAQs = () => {
  const [sectionRef, sectionVisible] = useScrollAnimation({ once: true, threshold: 0.2 });
  const [expandedItem, setExpandedItem] = useState("");

  const faqs = [
    {
      question: "What kind of services does Kangqore provide?",
      answer: <>Kangqore offers a wide range of IT and AI <Link to="/services" className="text-brand-blue hover:underline font-medium">services</Link>, including custom software development, AI &amp; machine learning solutions, cloud migration and management, data engineering, cybersecurity, and digital consulting.</>
    },
    {
      question: "Which industries do you specialize in?",
      answer: "We specialize in Banking & Financial Services, Healthcare, Life Sciences, Retail & Consumer Goods, Manufacturing, Insurance, Communications & Media, and Technology sectors. Our industry-specific solutions are tailored to meet unique business challenges."
    },
    {
      question: "How does Kangqore approach a new project?",
      answer: "We follow a structured approach: Discovery (understanding your needs), Planning (developing a customized strategy), Implementation (executing with precision), and Optimization (continuously improving for maximum results)."
    },
    {
      question: "Can you help migrate our existing systems to the cloud?",
      answer: <>Yes! We offer comprehensive cloud migration <Link to="/services" className="text-brand-blue hover:underline font-medium">services</Link> including assessment, migration planning, application rehosting and refactoring, data migration, and post-migration optimization. We support AWS, Azure, Google Cloud, and multi-cloud environments.</>
    },
    {
      question: "What makes Kangqore different from other IT service companies?",
      answer: <>Kangqore combines deep industry expertise, cutting-edge technology solutions, and a proven track record of successful transformations. We focus on engineering intuition into technology, delivering <Link to="/services" className="text-brand-blue hover:underline font-medium">solutions</Link> that are not just innovative but also practical and scalable.</>
    },
    {
      question: "How do you ensure the security of the software you build?",
      answer: "Security is built into every phase of our development process. We follow industry best practices including secure coding standards, regular security testing, vulnerability assessments, penetration testing, and compliance with standards like ISO 27001, SOC 2, and GDPR."
    }
  ];

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div 
          ref={sectionRef}
          className={`grid lg:grid-cols-12 gap-12 lg:gap-16 items-start transition-all duration-1000 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Left - Title */}
          <div className="lg:col-span-3">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                FAQs
              </span>
            </h2>
          </div>

          {/* Right - Accordion */}
          <div className="lg:col-span-9">
            <Accordion 
              type="single" 
              collapsible 
              className="w-full space-y-6"
              value={expandedItem}
              onValueChange={setExpandedItem}
            >
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-gray-200"
                  onMouseEnter={() => setExpandedItem(`item-${index}`)}
                  onMouseLeave={() => setExpandedItem("")}
                >
                  <AccordionTrigger 
                    className="text-left text-lg font-semibold text-gray-900 dark:text-white hover:text-brand-blue py-6"
                    onClick={(e) => e.preventDefault()}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-400 text-base leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
