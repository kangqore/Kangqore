import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { whitePapersData } from '../../data/contentData';

const CloudSecurityFramework = () => {
  const wp = whitePapersData.find(w => w.slug === 'cloud-security-framework');
  const wpIndex = whitePapersData.findIndex(w => w.slug === 'cloud-security-framework');
  
  const previousWp = wpIndex > 0 ? whitePapersData[wpIndex - 1] : null;
  const nextWp = wpIndex < whitePapersData.length - 1 ? whitePapersData[wpIndex + 1] : null;
  
  const relatedContent = whitePapersData
    .filter(w => w.slug !== 'cloud-security-framework')
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
      authorRole="Kangqore Security Practice"
      authorBio="Our security practice provides strategic guidance on enterprise security architecture, risk management, and compliance across cloud environments."
      tags={wp.topics}
      previousContent={previousWp ? { title: previousWp.title, link: `/white-papers/${previousWp.slug}` } : null}
      nextContent={nextWp ? { title: nextWp.title, link: `/white-papers/${nextWp.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{wp.description}</p>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 rounded-xl p-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">Security Framework</p>
            <p className="text-lg text-purple-800 font-semibold">{wp.pages} Pages • {wp.downloads} Downloads</p>
          </div>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Download PDF
          </button>
        </div>
      </div>

      <h2>Executive Summary</h2>
      <p>Cloud security requires a comprehensive approach that balances risk management with business enablement. This framework provides a structured methodology for securing cloud infrastructure while maintaining operational agility.</p>

      <h2>Framework Components</h2>
      <ul>
        <li><strong>Identity & Access:</strong> Zero trust architecture and identity governance</li>
        <li><strong>Data Protection:</strong> Encryption, classification, and data loss prevention</li>
        <li><strong>Network Security:</strong> Micro-segmentation and secure connectivity</li>
        <li><strong>Compliance:</strong> Regulatory alignment and audit readiness</li>
      </ul>

      <h2>Implementation Guide</h2>
      <p>Step-by-step guidance for implementing the framework across AWS, Azure, and Google Cloud environments with specific configuration recommendations and best practices.</p>
    </ContentDetailLayout>
  );
};

export default CloudSecurityFramework;
