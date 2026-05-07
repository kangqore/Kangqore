import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { caseStudiesData } from '../../data/contentData';

const HealthcarePlatformModernization = () => {
  const caseStudy = caseStudiesData.find(c => c.slug === 'healthcare-platform-modernization');
  const csIndex = caseStudiesData.findIndex(c => c.slug === 'healthcare-platform-modernization');
  
  const previousCs = csIndex > 0 ? caseStudiesData[csIndex - 1] : null;
  const nextCs = csIndex < caseStudiesData.length - 1 ? caseStudiesData[csIndex + 1] : null;
  
  const relatedContent = caseStudiesData
    .filter(c => c.slug !== 'healthcare-platform-modernization')
    .slice(0, 4)
    .map(c => ({ title: c.title, link: `/case-studies/${c.slug}`, image: c.image, date: c.duration }));

  return (
    <ContentDetailLayout
      contentType="Case Study"
      backLink="/case-studies"
      backLabel="Back to Case Studies"
      title={caseStudy.title}
      publishDate={caseStudy.duration}
      readTime="10 min"
      author="Kangqore Healthcare Practice"
      authorRole="Healthcare Technology Team"
      authorBio="Our Healthcare Practice delivers HIPAA-compliant solutions that improve patient outcomes while meeting stringent regulatory requirements."
      featuredImage={caseStudy.image}
      tags={caseStudy.technologies}
      previousContent={previousCs ? { title: previousCs.title, link: `/case-studies/${previousCs.slug}` } : null}
      nextContent={nextCs ? { title: nextCs.title, link: `/case-studies/${nextCs.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{caseStudy.description}</p>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-10">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-emerald-700">3x</p>
            <p className="text-sm text-emerald-600">Faster Processing</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-700">99.9%</p>
            <p className="text-sm text-emerald-600">System Uptime</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-700">40%</p>
            <p className="text-sm text-emerald-600">Improved Outcomes</p>
          </div>
        </div>
      </div>

      <h2>Client Context</h2>
      <p>A major healthcare provider operating across multiple states needed to modernize their patient care platform to improve clinical outcomes and operational efficiency while maintaining strict HIPAA compliance.</p>

      <h2>The Challenge</h2>
      <ul>
        <li><strong>Data Security:</strong> Protected health information requiring enterprise-grade security controls</li>
        <li><strong>System Integration:</strong> Complex integration requirements across EHR, billing, and clinical systems</li>
        <li><strong>Scalability:</strong> Growing patient volumes straining legacy infrastructure</li>
      </ul>

      <h2>Our Solution</h2>
      <p>Kangqore designed and implemented a HIPAA-compliant cloud platform on Azure with ML-powered diagnostics support and real-time patient monitoring capabilities.</p>

      <h2>Results</h2>
      <p>The modernized platform achieved 3x faster processing, 99.9% uptime, and measurable improvements in patient outcomes through better data accessibility and clinical decision support.</p>
    </ContentDetailLayout>
  );
};

export default HealthcarePlatformModernization;
