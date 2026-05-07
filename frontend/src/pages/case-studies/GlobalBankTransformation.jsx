import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { caseStudiesData } from '../../data/contentData';

const GlobalBankTransformation = () => {
  const caseStudy = caseStudiesData.find(c => c.slug === 'global-bank-transformation');
  const csIndex = caseStudiesData.findIndex(c => c.slug === 'global-bank-transformation');
  
  const previousCs = csIndex > 0 ? caseStudiesData[csIndex - 1] : null;
  const nextCs = csIndex < caseStudiesData.length - 1 ? caseStudiesData[csIndex + 1] : null;
  
  const relatedContent = caseStudiesData
    .filter(c => c.slug !== 'global-bank-transformation')
    .slice(0, 4)
    .map(c => ({ title: c.title, link: `/case-studies/${c.slug}`, image: c.image, date: c.duration }));

  return (
    <ContentDetailLayout
      contentType="Case Study"
      backLink="/case-studies"
      backLabel="Back to Case Studies"
      title={caseStudy.title}
      publishDate={caseStudy.duration}
      readTime="12 min"
      author="Kangqore Banking Practice"
      authorRole="Enterprise Transformation Team"
      authorBio="Our Banking Practice combines deep industry expertise with technology leadership to deliver transformational outcomes for financial institutions worldwide."
      featuredImage={caseStudy.image}
      tags={caseStudy.technologies}
      previousContent={previousCs ? { title: previousCs.title, link: `/case-studies/${previousCs.slug}` } : null}
      nextContent={nextCs ? { title: nextCs.title, link: `/case-studies/${nextCs.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
        {caseStudy.description}
      </p>

      {/* Key Results Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-10">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-emerald-700">40%</p>
            <p className="text-sm text-emerald-600">Cost Reduction</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-700">3x</p>
            <p className="text-sm text-emerald-600">Faster Processing</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-700">95%</p>
            <p className="text-sm text-emerald-600">Customer Satisfaction</p>
          </div>
        </div>
      </div>

      <h2>Client Context</h2>
      <p>
        A Fortune 500 global bank with operations across 40 countries faced increasing pressure from digital-native competitors and rising customer expectations. Their legacy core banking systems, built over three decades, were limiting their ability to innovate and respond to market changes.
      </p>

      <h2>The Challenge</h2>
      <p>
        The bank faced a complex set of interconnected challenges:
      </p>
      <ul>
        <li><strong>Legacy Systems:</strong> Core banking platform built on 30-year-old mainframe technology with limited integration capabilities</li>
        <li><strong>Regulatory Compliance:</strong> Stringent requirements across multiple jurisdictions requiring enhanced data governance and audit capabilities</li>
        <li><strong>Customer Experience:</strong> Declining customer satisfaction due to slow transaction processing and limited digital capabilities</li>
        <li><strong>Operational Cost:</strong> High maintenance costs for legacy infrastructure consuming over 70% of IT budget</li>
      </ul>

      <h2>Our Approach</h2>
      <p>
        Kangqore partnered with the client to design and execute a comprehensive digital transformation program spanning 18 months. Our approach balanced risk management with aggressive delivery timelines.
      </p>

      <h3>Phase 1: Assessment & Strategy (Months 1-3)</h3>
      <p>
        Comprehensive assessment of existing systems, processes, and organizational capabilities. Developed transformation roadmap prioritizing high-impact, lower-risk initiatives for early momentum.
      </p>

      <h3>Phase 2: Foundation Building (Months 4-8)</h3>
      <p>
        Established cloud infrastructure on AWS with enterprise-grade security controls. Implemented API gateway and microservices foundation enabling modular migration of core capabilities.
      </p>

      <h3>Phase 3: Core Migration (Months 9-15)</h3>
      <p>
        Systematic migration of core banking functions to cloud-native architecture. Deployed AI-powered services for fraud detection, customer service, and risk assessment.
      </p>

      <h3>Phase 4: Optimization & Transition (Months 16-18)</h3>
      <p>
        Performance optimization, knowledge transfer, and operational stabilization. Established center of excellence for ongoing innovation and continuous improvement.
      </p>

      <h2>Technology Stack</h2>
      <p>
        The transformation leveraged modern, enterprise-grade technologies:
      </p>
      <ul>
        <li><strong>Cloud Platform:</strong> AWS with multi-region deployment for resilience</li>
        <li><strong>Container Orchestration:</strong> Kubernetes for workload management</li>
        <li><strong>Frontend:</strong> React-based customer and employee applications</li>
        <li><strong>Backend:</strong> Python microservices with event-driven architecture</li>
        <li><strong>AI/ML:</strong> TensorFlow for fraud detection and customer analytics</li>
      </ul>

      <h2>Results Achieved</h2>
      <p>
        The transformation delivered measurable business outcomes across multiple dimensions:
      </p>

      <h3>Operational Efficiency</h3>
      <p>
        40% reduction in operational costs through infrastructure optimization, process automation, and reduced maintenance burden.
      </p>

      <h3>Processing Speed</h3>
      <p>
        3x improvement in transaction processing speed, enabling real-time payments and faster loan decisioning.
      </p>

      <h3>Customer Satisfaction</h3>
      <p>
        Customer satisfaction scores improved from 72% to 95%, driven by improved digital experience and faster service delivery.
      </p>

      <h2>Key Success Factors</h2>
      <ul>
        <li><strong>Executive Commitment:</strong> Strong sponsorship from CEO and board ensured organizational alignment</li>
        <li><strong>Risk-Balanced Approach:</strong> Careful sequencing managed migration risk while maintaining momentum</li>
        <li><strong>Talent Investment:</strong> Parallel investment in internal capability building ensured sustainable outcomes</li>
        <li><strong>Governance Framework:</strong> Robust governance enabled effective decision-making and issue resolution</li>
      </ul>

      <h2>Client Testimonial</h2>
      <blockquote className="border-l-4 border-emerald-500 pl-6 italic text-gray-600 dark:text-gray-400 my-8">
        "Kangqore's expertise in banking transformation was evident from day one. They understood our regulatory constraints, our risk appetite, and our ambition. The results speak for themselves—we've fundamentally transformed our ability to serve customers and compete in the digital economy."
        <footer className="mt-4 text-gray-500 not-italic">— Chief Digital Officer, Fortune 500 Bank</footer>
      </blockquote>
    </ContentDetailLayout>
  );
};

export default GlobalBankTransformation;
