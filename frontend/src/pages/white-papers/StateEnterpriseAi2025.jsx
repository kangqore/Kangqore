import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { whitePapersData } from '../../data/contentData';

const StateEnterpriseAi2025 = () => {
  const wp = whitePapersData.find(w => w.slug === 'state-enterprise-ai-2025');
  const wpIndex = whitePapersData.findIndex(w => w.slug === 'state-enterprise-ai-2025');
  
  const previousWp = wpIndex > 0 ? whitePapersData[wpIndex - 1] : null;
  const nextWp = wpIndex < whitePapersData.length - 1 ? whitePapersData[wpIndex + 1] : null;
  
  const relatedContent = whitePapersData
    .filter(w => w.slug !== 'state-enterprise-ai-2025')
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
      authorRole="Kangqore Research"
      authorBio="This white paper represents the combined insights of Kangqore's AI research practice, drawing on engagements with Fortune 500 enterprises across multiple industries."
      tags={wp.topics}
      previousContent={previousWp ? { title: previousWp.title, link: `/white-papers/${previousWp.slug}` } : null}
      nextContent={nextWp ? { title: nextWp.title, link: `/white-papers/${nextWp.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{wp.description}</p>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 rounded-xl p-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">Research Report</p>
            <p className="text-lg text-purple-800 font-semibold">{wp.pages} Pages • {wp.downloads} Downloads</p>
          </div>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Download PDF
          </button>
        </div>
      </div>

      <h2>Executive Summary</h2>
      <p>
        Enterprise AI adoption has reached an inflection point. Organizations that strategically deploy AI capabilities are achieving measurable competitive advantage, while those that delay face increasing risk of disruption. This comprehensive report examines the current state of enterprise AI, identifies success patterns, and provides actionable guidance for technology and business leaders.
      </p>

      <h2>Key Findings</h2>
      <ul>
        <li><strong>Adoption Acceleration:</strong> 72% of enterprises have deployed AI in production, up from 47% in 2021</li>
        <li><strong>Value Concentration:</strong> Top performers capture 3x the value from AI investments compared to average</li>
        <li><strong>Governance Gap:</strong> Only 35% of organizations have mature AI governance frameworks</li>
        <li><strong>Talent Challenge:</strong> AI talent remains the primary constraint for 68% of enterprises</li>
      </ul>

      <h2>Report Contents</h2>
      <h3>Chapter 1: The AI Adoption Landscape</h3>
      <p>Comprehensive analysis of AI adoption patterns across industries, use cases, and organizational maturity levels.</p>

      <h3>Chapter 2: Success Patterns and Best Practices</h3>
      <p>Detailed examination of what differentiates AI leaders from laggards, with actionable recommendations.</p>

      <h3>Chapter 3: Technology Architecture</h3>
      <p>Reference architectures and technology considerations for scalable enterprise AI deployment.</p>

      <h3>Chapter 4: Governance and Risk</h3>
      <p>Framework for AI governance, ethics, and risk management in enterprise contexts.</p>

      <h3>Chapter 5: Building AI Capability</h3>
      <p>Strategies for talent development, organizational change, and sustainable capability building.</p>

      <h2>Methodology</h2>
      <p>
        This report is based on primary research including surveys of 500+ enterprise technology leaders, in-depth interviews with 50 AI practitioners, and analysis of Kangqore's engagement data across 200+ AI initiatives.
      </p>
    </ContentDetailLayout>
  );
};

export default StateEnterpriseAi2025;
