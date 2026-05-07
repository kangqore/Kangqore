import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { caseStudiesData } from '../../data/contentData';

const RetailAnalyticsImplementation = () => {
  const caseStudy = caseStudiesData.find(c => c.slug === 'retail-analytics-implementation');
  const csIndex = caseStudiesData.findIndex(c => c.slug === 'retail-analytics-implementation');
  
  const previousCs = csIndex > 0 ? caseStudiesData[csIndex - 1] : null;
  const nextCs = csIndex < caseStudiesData.length - 1 ? caseStudiesData[csIndex + 1] : null;
  
  const relatedContent = caseStudiesData
    .filter(c => c.slug !== 'retail-analytics-implementation')
    .slice(0, 4)
    .map(c => ({ title: c.title, link: `/case-studies/${c.slug}`, image: c.image, date: c.duration }));

  return (
    <ContentDetailLayout
      contentType="Case Study"
      backLink="/case-studies"
      backLabel="Back to Case Studies"
      title={caseStudy.title}
      publishDate={caseStudy.duration}
      readTime="8 min"
      author="Kangqore Retail Practice"
      authorRole="Analytics & Data Team"
      authorBio="Our Retail Practice helps leading retailers leverage data and analytics to drive customer engagement and operational excellence."
      featuredImage={caseStudy.image}
      tags={caseStudy.technologies}
      previousContent={previousCs ? { title: previousCs.title, link: `/case-studies/${previousCs.slug}` } : null}
      nextContent={nextCs ? { title: nextCs.title, link: `/case-studies/${nextCs.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{caseStudy.description}</p>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 rounded-xl p-6 mb-10">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-purple-700">25%</p>
            <p className="text-sm text-purple-600">Revenue Increase</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-700">60%</p>
            <p className="text-sm text-purple-600">Better Conversion</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-700">Real-time</p>
            <p className="text-sm text-purple-600">Personalization</p>
          </div>
        </div>
      </div>

      <h2>Client Context</h2>
      <p>A leading retail chain with 500+ locations needed to unify customer data across channels and enable real-time personalization to compete with digital-native competitors.</p>

      <h2>The Challenge</h2>
      <ul>
        <li><strong>Data Silos:</strong> Customer data fragmented across POS, e-commerce, and loyalty systems</li>
        <li><strong>Real-time Processing:</strong> Need for sub-second personalization at scale</li>
        <li><strong>Customer Insights:</strong> Limited visibility into cross-channel customer behavior</li>
      </ul>

      <h2>Our Solution</h2>
      <p>Built unified data platform on Google Cloud with real-time analytics, ML-powered recommendations, and integrated customer 360 view enabling personalized experiences across all touchpoints.</p>

      <h2>Results</h2>
      <p>The analytics platform drove 25% revenue increase through personalization, 60% improvement in conversion rates, and established foundation for continued analytics innovation.</p>
    </ContentDetailLayout>
  );
};

export default RetailAnalyticsImplementation;
