import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { whitePapersData } from '../../data/contentData';

const DataAnalyticsMaturityModel = () => {
  const wp = whitePapersData.find(w => w.slug === 'data-analytics-maturity-model');
  const wpIndex = whitePapersData.findIndex(w => w.slug === 'data-analytics-maturity-model');
  
  const previousWp = wpIndex > 0 ? whitePapersData[wpIndex - 1] : null;
  const nextWp = wpIndex < whitePapersData.length - 1 ? whitePapersData[wpIndex + 1] : null;
  
  const relatedContent = whitePapersData
    .filter(w => w.slug !== 'data-analytics-maturity-model')
    .slice(0, 4)
    .map(w => ({ title: w.title, link: `/white-papers/${w.slug}`, date: w.date }));

  return (
    <ContentDetailLayout
      contentType="White Paper"
      backLink="/white-paper"
      backLabel="Back to White Papers"
      title={wp.title}
      publishDate={wp.date}
      readTime={`${wp.pages} pages`}
      author={wp.authors.join(' & ')}
      authorRole="Kangqore Analytics Practice"
      authorBio="Our analytics practice helps organizations assess and advance their data capabilities to drive competitive advantage."
      tags={wp.topics}
      previousContent={previousWp ? { title: previousWp.title, link: `/white-papers/${previousWp.slug}` } : null}
      nextContent={nextWp ? { title: nextWp.title, link: `/white-papers/${nextWp.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{wp.description}</p>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 rounded-xl p-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">Assessment Framework</p>
            <p className="text-lg text-purple-800 font-semibold">{wp.pages} Pages • {wp.downloads} Downloads</p>
          </div>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Download PDF
          </button>
        </div>
      </div>

      <h2>Executive Summary</h2>
      <p>Organizations at different stages of analytics maturity require different strategies and investments. This model provides a framework for assessing current state and planning advancement.</p>

      <h2>Maturity Levels</h2>
      <ul>
        <li><strong>Level 1 - Ad Hoc:</strong> Manual, inconsistent reporting</li>
        <li><strong>Level 2 - Defined:</strong> Standardized reporting and basic analytics</li>
        <li><strong>Level 3 - Managed:</strong> Integrated data and predictive capabilities</li>
        <li><strong>Level 4 - Optimized:</strong> Real-time analytics and prescriptive insights</li>
      </ul>
    </ContentDetailLayout>
  );
};

export default DataAnalyticsMaturityModel;
