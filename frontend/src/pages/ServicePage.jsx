import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Users, TrendingUp, Shield, ChevronDown, ChevronUp,
  Building2, Factory, ShoppingCart, Heart, Briefcase, ArrowRight, Zap,
  Award, Target, Lightbulb, Globe, Star, Circle
} from 'lucide-react';
import { departmentData } from '../data/departmentData';
import PageHero from '../components/PageHero';

const ServicePage = () => {
  const { departmentSlug, serviceSlug } = useParams();
  const department = departmentData.find(d => d.slug === departmentSlug);
  const service = department?.services.find(s => s.slug === serviceSlug);
  const [openFaq, setOpenFaq] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!service || !department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Service Not Found</h1>
          <Link to="/" className="text-brand-blue hover:text-cyan-500">Return to Home</Link>
        </div>
      </div>
    );
  }

  // Dynamic capabilities data for 3-column card layout
  const capabilityCards = [
    {
      title: 'Strategy & Planning',
      items: [
        { heading: 'Assessment & Discovery', description: `Comprehensive analysis of your current state and ${service.name.toLowerCase()} requirements to identify opportunities.` },
        { heading: 'Roadmap Development', description: `Create a detailed implementation roadmap aligned with your business objectives and timelines.` },
        { heading: 'Architecture Design', description: `Design scalable and robust ${service.name.toLowerCase()} architecture tailored to your needs.` },
        { heading: 'Business Case Development', description: `Build compelling business cases with ROI projections and success metrics.` }
      ]
    },
    {
      title: 'Implementation & Delivery',
      items: [
        { heading: 'Agile Development', description: `Iterative development approach ensuring flexibility and rapid delivery of ${service.name.toLowerCase()} solutions.` },
        { heading: 'Integration Services', description: `Seamless integration with existing systems, APIs, and third-party platforms.` },
        { heading: 'Quality Assurance', description: `Rigorous testing protocols ensuring reliability, performance, and security standards.` },
        { heading: 'Change Management', description: `Comprehensive change management and user adoption programs for successful transitions.` }
      ]
    },
    {
      title: 'Operations & Optimization',
      items: [
        { heading: 'Managed Services', description: `24/7 monitoring, maintenance, and support to ensure optimal ${service.name.toLowerCase()} performance.` },
        { heading: 'Performance Optimization', description: `Continuous performance tuning and optimization to maximize efficiency and value.` },
        { heading: 'Analytics & Insights', description: `Data-driven insights and reporting to track KPIs and identify improvement opportunities.` },
        { heading: 'Continuous Innovation', description: `Stay ahead with latest ${service.name.toLowerCase()} trends, updates, and innovation initiatives.` }
      ]
    }
  ];

  const whyKangqore = [
    { icon: Award, title: 'Proven Expertise', description: `Years of experience delivering successful ${service.name.toLowerCase()} projects across industries.` },
    { icon: Target, title: 'Tailored Solutions', description: 'Customized approaches that address your unique business challenges and goals.' },
    { icon: Users, title: 'Dedicated Team', description: 'Access to certified professionals with deep domain expertise.' },
    { icon: Lightbulb, title: 'Innovation Focus', description: 'Leveraging latest technologies and best practices for optimal results.' },
    { icon: Globe, title: 'Global Delivery', description: 'Scalable delivery model with resources across multiple geographies.' },
    { icon: Shield, title: 'Quality Assurance', description: 'Rigorous quality standards and proven methodologies ensure success.' }
  ];

  const industries = [
    { name: 'Banking & Financial Services', icon: Building2 },
    { name: 'Healthcare & Life Sciences', icon: Heart },
    { name: 'Retail & Consumer Goods', icon: ShoppingCart },
    { name: 'Manufacturing', icon: Factory },
    { name: 'Technology', icon: Zap },
    { name: 'Professional Services', icon: Briefcase }
  ];

  const clients = [
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
    'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg'
  ];

  const insights = [
    { title: `The Future of ${service.name}`, type: 'Article', date: 'Dec 2024' },
    { title: `Best Practices for ${service.name} Implementation`, type: 'Whitepaper', date: 'Nov 2024' },
    { title: `${service.name} Trends to Watch in 2025`, type: 'Report', date: 'Oct 2024' }
  ];

  const faqs = [
    { question: `What is ${service.name} and how can it benefit my organization?`, answer: `${service.name} helps organizations ${service.shortDescription?.toLowerCase() || 'achieve digital transformation'}. By implementing ${service.name.toLowerCase()}, you can improve efficiency, reduce costs, and gain competitive advantage.` },
    { question: `How long does a typical ${service.name.toLowerCase()} project take?`, answer: `Project duration varies based on scope and complexity. A typical engagement ranges from 8-16 weeks for initial implementation, with ongoing optimization. We work with you to define realistic timelines aligned with your business priorities.` },
    { question: `What industries do you serve for ${service.name.toLowerCase()}?`, answer: `We serve clients across all major industries including Banking, Healthcare, Retail, Manufacturing, Technology, and more. Our industry-specific expertise ensures solutions are tailored to your sector's unique requirements.` },
    { question: `How do you ensure successful delivery?`, answer: `We follow a proven methodology combining agile practices, quality assurance, and change management. Regular checkpoints, transparent communication, and dedicated project management ensure successful outcomes.` },
    { question: `What post-implementation support do you offer?`, answer: `We provide comprehensive support including 24/7 technical assistance, regular health checks, optimization recommendations, and training. Our team remains engaged to ensure you maximize value from your investment.` }
  ];

  const technologies = [
    'AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform',
    'Python', 'Java', 'React', 'Node.js', 'TensorFlow', 'PyTorch',
    'Salesforce', 'ServiceNow', 'SAP', 'Oracle', 'MongoDB', 'PostgreSQL'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-brand-blue">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/services" className="text-gray-600 dark:text-gray-400 hover:text-brand-blue">Services</Link>
            <span className="text-gray-400">/</span>
            <Link to={`/department/${departmentSlug}`} className="text-gray-600 dark:text-gray-400 hover:text-brand-blue">
              {department.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium">{service.name}</span>
          </div>
        </div>
      </div>

      {/* 1. Hero Section - Heading & Sub-heading */}
      <PageHero
        badge={department.name}
        title={service.name}
        titleHighlight=""
        description={service.fullDescription || service.shortDescription}
        primaryButton={{ text: 'Get Started', link: '/contact' }}
        secondaryButton={{ text: `Back to ${department.name}`, link: `/department/${departmentSlug}` }}
        stats={[
          { value: '100+', label: 'Projects', color: 'text-cyan-400' },
          { value: '98%', label: 'Satisfaction', color: 'text-blue-400' },
          { value: '24/7', label: 'Support', color: 'text-emerald-400' },
          { value: 'Global', label: 'Delivery', color: 'text-purple-400' },
        ]}
        showWave={false}
      />

      {/* 2. Overview Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">Overview</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {service.fullDescription || `Our ${service.name.toLowerCase()} service is designed to help organizations achieve their digital transformation goals through innovative solutions and expert guidance.`}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                With deep expertise in {department.name.toLowerCase()}, we deliver solutions that drive measurable business outcomes. Our approach combines industry best practices with cutting-edge technology to ensure your success.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <img
                src={service.image}
                alt={service.name}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Capabilities - New Design */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Capabilities</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl">
              We bring comprehensive {service.name.toLowerCase()} expertise to help organizations transform their operations. Our capabilities span the full lifecycle – from strategy and planning through implementation and ongoing optimization.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mt-4">
              With deep domain expertise and proven methodologies, we deliver solutions that drive measurable business outcomes and sustainable competitive advantage.
            </p>
          </div>

          {/* Capability Cards - 3 Column Layout */}
          <div className="grid md:grid-cols-3 gap-8">
            {capabilityCards.map((card, cardIndex) => (
              <div key={cardIndex} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                {/* Card Header with Blue Gradient Circle Icon */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{card.title}</h3>
                </div>

                {/* Capability Items */}
                <ul className="space-y-4">
                  {(expandedCards[cardIndex] ? card.items : card.items.slice(0, 2)).map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <span className="text-brand-blue mt-2">•</span>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">{item.heading}:</span>{' '}
                        <span className="text-gray-600 dark:text-gray-400">{item.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Read More/Less Toggle */}
                <button
                  onClick={() => toggleCard(cardIndex)}
                  className="mt-4 text-brand-blue hover:text-cyan-500 font-medium text-sm flex items-center gap-1 transition-colors"
                >
                  {expandedCards[cardIndex] ? (
                    <>Read Less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Read More <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Kangqore */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Kangqore for {service.name}?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Partner with us to leverage our expertise and accelerate your {service.name.toLowerCase()} journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyKangqore.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-6 rounded-xl hover:shadow-lg transition-all duration-300 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-gradient transition-all duration-300">
                    <IconComponent className="w-7 h-7 text-brand-blue group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Industry Specific */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Industry Expertise</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We bring deep domain knowledge to deliver {service.name.toLowerCase()} solutions across industries
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((industry, index) => {
              const IconComponent = industry.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl text-center hover:bg-brand-gradient group transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg">
                  <IconComponent className="w-10 h-10 text-brand-blue mx-auto mb-3 group-hover:text-white transition-colors" />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-white transition-colors">{industry.name}</h4>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Our Clients */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Trusted by Industry Leaders</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Leading organizations trust Kangqore for their {service.name.toLowerCase()} needs
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {clients.map((logo, index) => (
              <div key={index} className="h-10 w-32 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                <img src={logo} alt="Client logo" className="h-full w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Insights */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">Insights</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">Latest thinking on {service.name.toLowerCase()}</p>
            </div>
            <Link to="/" className="text-brand-blue hover:text-cyan-500 font-semibold flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {insights.map((insight, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="h-48 bg-brand-gradient relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/20 text-8xl font-bold">{index + 1}</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white dark:bg-black/20 backdrop-blur-sm text-white text-sm rounded-full">{insight.type}</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{insight.date}</p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{insight.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Common questions about our {service.name.toLowerCase()} services
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl overflow-hidden">
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-100 dark:bg-[#0a0a0c] transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-brand-blue flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Career Opportunities */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 lg:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">{service.name} Career Opportunities</h2>
                <p className="text-white/80 mb-6 text-lg">
                  Join our team of {service.name.toLowerCase()} experts and work on transformative projects for global clients. We offer competitive compensation, continuous learning, and career growth.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-2 bg-white dark:bg-black/10 rounded-full text-sm">Remote Friendly</span>
                  <span className="px-4 py-2 bg-white dark:bg-black/10 rounded-full text-sm">Learning Budget</span>
                  <span className="px-4 py-2 bg-white dark:bg-black/10 rounded-full text-sm">Health Benefits</span>
                </div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-black text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-100 transition-all"
                >
                  View Open Positions <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">50+</div>
                  <div className="text-white/70 text-sm">Open Positions</div>
                </div>
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">40+</div>
                  <div className="text-white/70 text-sm">Countries</div>
                </div>
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">4.5</div>
                  <div className="text-white/70 text-sm flex items-center justify-center gap-1"><Star className="w-4 h-4 fill-cyan-400" /> Rating</div>
                </div>
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800/10 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">95%</div>
                  <div className="text-white/70 text-sm">Employee Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-gradient rounded-2xl p-12 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Adaptability & Innovation Starts Here
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let's discuss how {service.name.toLowerCase()} can drive your success.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Talk to Our Experts
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
