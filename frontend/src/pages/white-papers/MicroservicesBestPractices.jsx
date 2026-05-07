import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { whitePapersData } from '../../data/contentData';

const MicroservicesBestPractices = () => {
  const wp = whitePapersData.find(w => w.slug === 'microservices-best-practices');
  const wpIndex = whitePapersData.findIndex(w => w.slug === 'microservices-best-practices');
  
  const previousWp = wpIndex > 0 ? whitePapersData[wpIndex - 1] : null;
  const nextWp = wpIndex < whitePapersData.length - 1 ? whitePapersData[wpIndex + 1] : null;
  
  const relatedContent = whitePapersData
    .filter(w => w.slug !== 'microservices-best-practices')
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
      authorRole="Kangqore Engineering Practice"
      authorBio="Our engineering practice delivers scalable architecture solutions based on proven patterns and real-world implementation experience."
      tags={wp.topics}
      previousContent={previousWp ? { title: previousWp.title, link: `/white-papers/${previousWp.slug}` } : null}
      nextContent={nextWp ? { title: nextWp.title, link: `/white-papers/${nextWp.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{wp.description}</p>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 rounded-xl p-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">Technical Guide</p>
            <p className="text-lg text-purple-800 font-semibold">{wp.pages} Pages • {wp.downloads} Downloads</p>
          </div>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Download PDF
          </button>
        </div>
      </div>

      <h2>Executive Summary</h2>
      <p>Microservices architecture enables scalability and agility but introduces complexity. This guide provides best practices for successful microservices implementation based on real-world experience.</p>

      <h2>Core Patterns</h2>
      <ul>
        <li><strong>Service Design:</strong> Domain-driven boundaries and API contracts</li>
        <li><strong>Data Management:</strong> Database per service and event sourcing</li>
        <li><strong>Communication:</strong> Synchronous vs asynchronous patterns</li>
        <li><strong>Resilience:</strong> Circuit breakers and graceful degradation</li>
        <li><strong>Observability:</strong> Distributed tracing and monitoring</li>
      </ul>
    </ContentDetailLayout>
  );
};

export default MicroservicesBestPractices;
