import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, ArrowRight, Shield, Target, Users, TrendingUp, 
  Building2, Briefcase, CheckCircle2, FileText, BarChart3, 
  ClipboardList, Leaf
} from 'lucide-react';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';

const InvestorsPage = () => {
  // Core Focus Areas with icons
  const coreFocusAreas = [
    { name: 'AI & Cognitive Systems', icon: Target },
    { name: 'Cloud & Digital Foundations', icon: Building2 },
    { name: 'Enterprise Modernization', icon: TrendingUp },
    { name: 'Intelligent Operations', icon: Briefcase },
    { name: 'Product & Platform Engineering', icon: Shield }
  ];

  // Operating Model Points
  const operatingModel = [
    'Enterprise and mid-market clients',
    'Long-term transformation engagements',
    'Outcome-driven delivery models',
    'High-trust, repeat partnerships'
  ];

  // Investment Philosophy Points
  const philosophyPoints = [
    'Deep execution capability in mission-critical systems',
    'Long-term client relationships built on trust and delivery',
    'Disciplined capital allocation and risk awareness',
    'Governance structures that scale with the organization'
  ];

  // Capital Benefits
  const capitalBenefits = [
    { title: 'Strategic Independence', desc: 'Maintain decision clarity without external pressure' },
    { title: 'Deliberate Investment', desc: 'Focus on foundational capabilities and controls' },
    { title: 'Operational Alignment', desc: 'Growth aligned with readiness, not funding cycles' },
    { title: 'Durable Relationships', desc: 'Build client trust without external constraints' }
  ];

  // Governance Framework
  const governancePoints = [
    { icon: Target, text: 'Responsible capital allocation aligned with long-term strategy' },
    { icon: CheckCircle2, text: 'Clear accountability and auditable processes' },
    { icon: Shield, text: 'Data security and confidentiality by design' },
    { icon: TrendingUp, text: 'Oversight mechanisms that evolve with scale' }
  ];

  // Restricted Modules
  const restrictedModules = [
    { name: 'Financial Summaries', icon: BarChart3 },
    { name: 'Growth & Performance Metrics', icon: TrendingUp },
    { name: 'Board Decks & Reports', icon: ClipboardList },
    { name: 'ESG & Compliance Overview', icon: Leaf }
  ];

  return (
    <div className="bg-white dark:bg-black">
      <SEO 
        title={coreSEO.investors.title}
        description={coreSEO.investors.description}
        keywords={coreSEO.investors.keywords}
        url={coreSEO.investors.url}
      />
      {/* Hero Section */}
      <PageHero
        badge="Investor Relations"
        title="Building Enterprise Value Through"
        titleHighlight="Disciplined Execution"
        description="Kangqore is a value-driven technology company building enterprise-grade systems across AI, cloud, platforms, and operations. This page provides high-level information for existing and prospective investors."
        primaryButton={{ text: 'Request Access', link: '/contact' }}
        secondaryButton={{ text: 'Learn More', link: '#philosophy' }}
        stats={[
          { value: 'Bootstrapped', label: 'Founder-Funded', color: 'text-cyan-400' },
          { value: '5+', label: 'Focus Areas', color: 'text-blue-400' },
          { value: 'Enterprise', label: 'Grade Systems', color: 'text-emerald-400' },
          { value: 'Long-term', label: 'Value Creation', color: 'text-purple-400' },
        ]}
      />

      {/* Investment Philosophy */}
      <section id="philosophy" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-4 block">Our Approach</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Investment Philosophy
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Kangqore was established to build a technology company grounded in execution discipline, governance rigor, and long-term value creation.
                </p>
                <p>
                  We operate in complex enterprise environments where technology decisions have enduring operational, financial, and reputational implications.
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-50">
                  Our strategy prioritizes durability over speed, accountability over experimentation, and compounding outcomes over short-term performance signals.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 lg:p-10">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                We believe sustainable value is created through:
              </h3>
              <ul className="space-y-4">
                {philosophyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-4 group">
                    <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 pt-1">{point}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 dark:text-gray-400 mt-8 pt-6 border-t border-gray-200">
                This philosophy guides how we grow, invest, and operate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capital Structure & Ownership */}
      <section className="py-20 lg:py-28 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4 block">Ownership Structure</span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">
              Capital Structure & Ownership
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Kangqore is a <span className="text-white font-semibold">bootstrapped, founder-funded</span> organization and is not backed by external venture or institutional investors.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {capitalBenefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 dark:border-gray-800/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-brand-gradient/20 border border-brand-blue/30 rounded-xl p-8">
            <p className="text-gray-300 leading-relaxed">
              Kangqore remains open to <span className="text-white font-medium">strategic capital partnerships</span> that align with its long-term vision, governance standards, and commitment to sustainable value creation.
            </p>
          </div>
        </div>
      </section>

      {/* Business & Strategic Focus */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-4 block">Strategic Direction</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Business & Strategic Focus
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Delivering enterprise transformation through focused expertise and disciplined execution.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Core Focus Areas */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-brand-blue" />
                </div>
                Core Focus Areas
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {coreFocusAreas.map((area, index) => {
                  const IconComponent = area.icon;
                  return (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:bg-blue-50 transition-colors group cursor-default"
                    >
                      <div className="w-10 h-10 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <IconComponent className="w-5 h-5 text-brand-blue" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{area.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operating Model */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                </div>
                Operating Model
              </h3>
              <ul className="space-y-4">
                {operatingModel.map((point, index) => (
                  <li key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:bg-emerald-50 transition-colors">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-gray-500 mt-12 text-center max-w-2xl mx-auto">
            Detailed commercial, financial, and client-specific information is disclosed only through secure investor access.
          </p>
        </div>
      </section>

      {/* Leadership & Governance */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-4 block">Leadership</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Leadership & Governance
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Founder-led with a commitment to long-term stewardship and disciplined execution.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {/* Mahesh Kumar */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Mahesh Kumar
              </h3>
              <p className="text-brand-blue font-medium mb-4">
                Founder & Chief Executive Officer
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Founder-led organization with long-term execution and stewardship focus.
              </p>
            </div>

            {/* Dinesh Kumar */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Dinesh Kumar
              </h3>
              <p className="text-emerald-600 font-medium mb-4">
                Co-Founder & Chief Financial Officer
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Financial leadership anchored in discipline, transparency, and risk-aware growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board-Level Governance Statement */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-4 block">Board Statement</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Governance & Stewardship Statement
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Kangqore is governed with a clear commitment to accountability, transparency, and long-term value creation.
                </p>
                <p>
                  As a founder-led organization operating within a structured governance framework, we view governance as a core discipline that enables sustainable growth, effective risk management, and institutional trust.
                </p>
                <p>
                  We maintain strong internal controls, financial discipline, and regulatory awareness across the organization. Material decisions are evaluated through a governance lens that considers capital stewardship, risk exposure, data protection, and reputational impact prior to execution.
                </p>
              </div>
              
              {/* Signatures */}
              <div className="mt-10 pt-8 border-t border-gray-200 space-y-3">
                <p className="font-semibold text-gray-800 dark:text-gray-50">— Mahesh Kumar, Founder & CEO</p>
                <p className="font-semibold text-gray-800 dark:text-gray-50">— Dinesh Kumar, Co-Founder & CFO</p>
              </div>
            </div>
            
            <div className="bg-brand-gradient rounded-2xl p-8 lg:p-10 text-white">
              <h3 className="text-xl font-semibold mb-8">
                Our Governance Framework Emphasizes:
              </h3>
              <ul className="space-y-5">
                {governancePoints.map((point, index) => {
                  const IconComponent = point.icon;
                  return (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-gray-900 dark:border-gray-800/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-blue-50 pt-2">{point.text}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="text-blue-100 mt-8 pt-6 border-t border-white/20 text-sm">
                We are committed to stewarding Kangqore as a durable, well-governed enterprise that earns and retains the confidence of clients, partners, employees, and investors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reports & Disclosures (Gated) */}
      <section className="py-20 lg:py-28 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-4 block">Secure Access</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Reports & Disclosures
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Detailed financial information, board materials, and internal disclosures are available to verified investors through secure access.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {restrictedModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <IconComponent className="w-6 h-6 text-gray-500 group-hover:text-brand-blue transition-colors" />
                    </div>
                    <div className="w-8 h-8 bg-gray-100 dark:bg-[#0a0a0c] rounded-lg flex items-center justify-center self-start sm:self-auto">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-gray-800 dark:text-gray-50 font-semibold">{module.name}</h3>
                  <p className="text-gray-400 text-sm mt-2">Restricted Access</p>
                </div>
              );
            })}
          </div>

          <p className="text-gray-500 text-sm">
            Access is restricted to authorized investors only. All access is logged and monitored.
          </p>
        </div>
      </section>

      {/* Investor Access & Contact */}
      <section className="py-20 lg:py-28 bg-brand-gradient relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <span className="text-cyan-300 font-semibold text-sm uppercase tracking-wider mb-4 block">Get in Touch</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Investor Access
            </h2>
            <p className="text-xl text-blue-100 mb-4 leading-relaxed">
              Investor information is provided on a controlled, need-to-know basis.
            </p>
            <p className="text-blue-200 mb-10">
              To request access or initiate a conversation, please contact us directly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
              >
                Request Investor Access
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-all duration-300"
              >
                Contact Investor Relations
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestorsPage;
