import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { caseStudiesData } from '../../data/contentData';

const InsuranceClaimsAutomation = () => {
  const caseStudy = caseStudiesData.find(c => c.slug === 'insurance-claims-automation');
  const csIndex = caseStudiesData.findIndex(c => c.slug === 'insurance-claims-automation');
  
  const previousCs = csIndex > 0 ? caseStudiesData[csIndex - 1] : null;
  const nextCs = csIndex < caseStudiesData.length - 1 ? caseStudiesData[csIndex + 1] : null;
  
  const relatedContent = caseStudiesData
    .filter(c => c.slug !== 'insurance-claims-automation')
    .slice(0, 4)
    .map(c => ({ title: c.title, link: `/case-studies/${c.slug}`, image: c.image, date: c.duration }));

  return (
    <ContentDetailLayout
      contentType="Case Study"
      backLink="/case-studies"
      backLabel="Back to Case Studies"
      title={caseStudy.title}
      publishDate={caseStudy.duration}
      readTime="9 min"
      author="Kangqore Insurance Practice"
      authorRole="Intelligent Automation Team"
      authorBio="Our Insurance Practice delivers AI-powered solutions that streamline operations and enhance customer experience for insurers worldwide."
      featuredImage={caseStudy.image}
      tags={caseStudy.technologies}
      previousContent={previousCs ? { title: previousCs.title, link: `/case-studies/${previousCs.slug}` } : null}
      nextContent={nextCs ? { title: nextCs.title, link: `/case-studies/${nextCs.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{caseStudy.description}</p>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-10">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-orange-700">80%</p>
            <p className="text-sm text-orange-600">Faster Claims</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-700">50%</p>
            <p className="text-sm text-orange-600">Cost Reduction</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-700">95%</p>
            <p className="text-sm text-orange-600">Fraud Detection</p>
          </div>
        </div>
      </div>

      <h2>Client Context</h2>
      <p>A major insurance company processing millions of claims annually needed to reduce processing time and improve fraud detection while enhancing customer satisfaction.</p>

      <h2>The Challenge</h2>
      <ul>
        <li><strong>Manual Processes:</strong> Claims processing requiring significant manual review and validation</li>
        <li><strong>Fraud Detection:</strong> Limited ability to identify fraudulent claims patterns</li>
        <li><strong>Customer Satisfaction:</strong> Long processing times impacting customer experience</li>
      </ul>

      <h2>Our Solution</h2>
      <p>Implemented AI-powered claims processing system with automated validation, ML-based fraud detection, and mobile-first customer application for real-time claim submission and tracking.</p>

      <h2>Results</h2>
      <p>Achieved 80% faster claims processing, 50% cost reduction through automation, and 95% accuracy in fraud detection, transforming the claims experience for customers and staff.</p>
    </ContentDetailLayout>
  );
};

export default InsuranceClaimsAutomation;
