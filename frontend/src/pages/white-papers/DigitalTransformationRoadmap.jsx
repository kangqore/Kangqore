import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { whitePapersData } from '../../data/contentData';

const DigitalTransformationRoadmap = () => {
  const wp = whitePapersData.find(w => w.slug === 'digital-transformation-roadmap');
  const wpIndex = whitePapersData.findIndex(w => w.slug === 'digital-transformation-roadmap');
  
  const previousWp = wpIndex > 0 ? whitePapersData[wpIndex - 1] : null;
  const nextWp = wpIndex < whitePapersData.length - 1 ? whitePapersData[wpIndex + 1] : null;
  
  const relatedContent = whitePapersData
    .filter(w => w.slug !== 'digital-transformation-roadmap')
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
      authorRole="Kangqore Strategy Practice"
      authorBio="Our strategy practice helps executives design and execute digital transformation programs that deliver sustainable business value."
      tags={wp.topics}
      previousContent={previousWp ? { title: previousWp.title, link: `/white-papers/${previousWp.slug}` } : null}
      nextContent={nextWp ? { title: nextWp.title, link: `/white-papers/${nextWp.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{wp.description}</p>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 rounded-xl p-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">Strategic Guide</p>
            <p className="text-lg text-purple-800 font-semibold">{wp.pages} Pages • {wp.downloads} Downloads</p>
          </div>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Download PDF
          </button>
        </div>
      </div>

      <h2>Executive Summary</h2>
      <p>Digital transformation success requires clear strategy, disciplined execution, and organizational alignment. This roadmap provides a proven methodology for planning and executing transformation initiatives.</p>

      <h2>Roadmap Phases</h2>
      <ul>
        <li><strong>Phase 1:</strong> Assessment and vision definition</li>
        <li><strong>Phase 2:</strong> Strategic planning and prioritization</li>
        <li><strong>Phase 3:</strong> Foundation and capability building</li>
        <li><strong>Phase 4:</strong> Execution and scale</li>
        <li><strong>Phase 5:</strong> Optimization and continuous improvement</li>
      </ul>
    </ContentDetailLayout>
  );
};

export default DigitalTransformationRoadmap;
