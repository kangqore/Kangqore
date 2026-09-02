import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Search, ChevronDown, HelpCircle, ArrowRight, Sparkles, Shield, Cpu, Layers } from 'lucide-react';
import SEO from '../components/SEO';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'architecture', label: 'Architecture & Krisnam' },
  { id: 'view', label: 'Kangqore View OS' },
  { id: 'governance', label: 'Security & HANUMANAS' },
  { id: 'services', label: 'Departments & Delivery' },
];

const FAQS_DATA = [
  {
    category: 'architecture',
    q: 'What is Krisnam, and how does it power the Kangqore ecosystem?',
    a: 'Krisnam is our proprietary foundational Large Language Model and reasoning engine. While HANUMANAS provides immutable policy governance and NOLAN structures semantic enterprise data, Krisnam is the cognitive brain. It reasons over enterprise graphs, translates high-level strategic intents into deterministic workflows, and drives autonomous action pipelines across Kangqore View.'
  },
  {
    category: 'architecture',
    q: 'How does KIMMP / WAANDA orchestrate autonomous missions?',
    a: 'KIMMP (Kangqore Intelligent Mission & Management Platform) acts as the cognitive routing architecture powered by Krisnam. When executives or operators state high-level goals, KIMMP decomposes them into governed functions, validates every operation against HANUMANAS compliance policies, and orchestrates real-time execution across systems.'
  },
  {
    category: 'view',
    q: 'What is Kangqore View, and how does it replace legacy enterprise tools?',
    a: 'Kangqore View is the unified enterprise operating system designed to eliminate siloed dashboards. It replaces disconnected suites of legacy tools (such as Jira, Monday, and disparate BI monitors) with an ontology-driven Command Center that correlates telemetry, resource allocation, and business outcomes into a single glass pane.'
  },
  {
    category: 'view',
    q: 'How does the Migration Studio handle messy legacy data?',
    a: 'Our Migration Studio uses Krisnam’s schema analysis engine to perform deep pre-migration scans. It ingests flat, unstructured exports from legacy task platforms, infers latent relational semantics, cleans orphaned data points, and strongly types entities into Kangqore’s enterprise ontology.'
  },
  {
    category: 'governance',
    q: 'What is HANUMANAS, and how does it guarantee enterprise safety?',
    a: 'HANUMANAS is Kangqore’s deterministic policy and governance enforcement engine. It operates at the architectural boundary between the LLM and the enterprise ActionEngine. Every autonomous action, pipeline execution, or resource change proposed by Krisnam must pass cryptographic HANUMANAS policy verification before execution.'
  },
  {
    category: 'governance',
    q: 'Where does enterprise client data reside, and is it used for training?',
    a: 'Never. Kangqore strictly enforces client data sovereignty. Enterprise telemetry, documents, and workflows remain within dedicated sovereign tenant perimeters (on-prem, hybrid, or private cloud VPC) and are never used to train public or foundational baseline models.'
  },
  {
    category: 'services',
    q: 'How are Kangqore’s 62 services organized across the 6 departments?',
    a: 'Our portfolio is cleanly partitioned into 6 specialized strategic departments: Kangqore Cognition (AI & Data Science), Kangqore Foundry (Engineering & Modernization), Kangqore Reimagine (Business Transformation & Operations), Kangqore Shield (Cybersecurity & Governance), Kangqore Platforms (Cloud & Enterprise Ecosystems), and Kangqore Growth (Marketing, Performance & Analytics).'
  },
  {
    category: 'services',
    q: 'How fast can an enterprise kick off an engagement with Kangqore?',
    a: 'Our engagements typically commence with a structured 2-to-4 week Architectural Discovery & Value-Proof Sprint. During this phase, our teams map existing telemetry into the NOLAN schema, deploy initial Krisnam intelligence agents, and benchmark measurable business impact before full production rollout.'
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndices, setOpenIndices] = useState({ 0: true });

  const toggleFaq = (idx) => {
    setOpenIndices(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const qLower = item.q.toLowerCase();
      const aLower = item.a.toLowerCase();
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = !searchLower || qLower.includes(searchLower) || aLower.includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQS_DATA.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SEO
        title="Frequently Asked Questions — Kangqore FAQs"
        description="Find clear answers to common questions about Kangqore's enterprise OS, AI architecture, Krisnam reasoning engine, governance models, and delivery."
        keywords="Kangqore FAQs, enterprise AI questions, Krisnam LLM, HANUMANAS governance, Kangqore View, enterprise IT FAQs"
        url="/kangqore-faqs"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 border-b border-black/5 dark:border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-cyan-400/20 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            Knowledge & Insights
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
            Clear, unhedged answers about the Kangqore View operating system, Krisnam AI reasoning engine, HANUMANAS governance, and our 62 service offerings.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by keyword or topic..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2564ea] transition-all shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 max-w-4xl mx-auto px-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none justify-start md:justify-center">
          {FAQ_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#2564ea] text-white shadow-sm'
                    : 'bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQs List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0c1222] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">No questions found matching "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="text-xs font-bold uppercase tracking-wider text-[#2564ea] hover:underline"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = !!openIndices[idx];
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c1222] transition-all duration-200 overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 select-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#2564ea]' : ''
                      }`}
                    />
                  </button>

                  <div className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden min-h-0">
                      <div className="px-6 pb-6 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/50">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Card */}
        <div className="mt-16 p-8 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-cyan-500/10 dark:from-blue-950/40 dark:via-[#0c1222] dark:to-cyan-950/30 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Have a question not answered here?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Our enterprise solutions architects are available for direct architecture and roadmap discussions.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2564ea] hover:bg-[#1d52c4] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all shrink-0"
          >
            Speak to an Expert <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
