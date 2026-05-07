import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { caseStudiesData } from '../../data/contentData';

const ManufacturingIotSolution = () => {
  const caseStudy = caseStudiesData.find(c => c.slug === 'manufacturing-iot-solution');
  const csIndex = caseStudiesData.findIndex(c => c.slug === 'manufacturing-iot-solution');
  
  const previousCs = csIndex > 0 ? caseStudiesData[csIndex - 1] : null;
  const nextCs = csIndex < caseStudiesData.length - 1 ? caseStudiesData[csIndex + 1] : null;
  
  const relatedContent = caseStudiesData
    .filter(c => c.slug !== 'manufacturing-iot-solution')
    .slice(0, 4)
    .map(c => ({ title: c.title, link: `/case-studies/${c.slug}`, image: c.image, date: c.duration }));

  return (
    <ContentDetailLayout
      contentType="Case Study"
      backLink="/case-studies"
      backLabel="Back to Case Studies"
      title={caseStudy.title}
      publishDate={caseStudy.duration}
      readTime="11 min"
      author="Kangqore Manufacturing Practice"
      authorRole="IoT & Industry 4.0 Team"
      authorBio="Our Manufacturing Practice helps industrial enterprises leverage IoT and AI to optimize operations and enable smart factory capabilities."
      featuredImage={caseStudy.image}
      tags={caseStudy.technologies}
      previousContent={previousCs ? { title: previousCs.title, link: `/case-studies/${previousCs.slug}` } : null}
      nextContent={nextCs ? { title: nextCs.title, link: `/case-studies/${nextCs.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{caseStudy.description}</p>

      <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-10">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-teal-700">50%</p>
            <p className="text-sm text-teal-600">Efficiency Gain</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-teal-700">70%</p>
            <p className="text-sm text-teal-600">Less Downtime</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-teal-700">35%</p>
            <p className="text-sm text-teal-600">Quality Improvement</p>
          </div>
        </div>
      </div>

      <h2>Client Context</h2>
      <p>A global manufacturer operating 50+ plants worldwide needed to reduce equipment downtime and improve quality control through smart factory capabilities.</p>

      <h2>The Challenge</h2>
      <ul>
        <li><strong>Equipment Downtime:</strong> Unplanned outages causing significant production losses</li>
        <li><strong>Quality Control:</strong> Reactive quality processes resulting in defects and rework</li>
        <li><strong>Operational Visibility:</strong> Limited real-time visibility into production performance</li>
      </ul>

      <h2>Our Solution</h2>
      <p>Deployed comprehensive IoT platform with 50,000+ sensors, predictive maintenance AI, and real-time production monitoring dashboards enabling proactive operations management.</p>

      <h2>Results</h2>
      <p>Achieved 50% efficiency gains, 70% reduction in unplanned downtime through predictive maintenance, and 35% improvement in quality metrics.</p>
    </ContentDetailLayout>
  );
};

export default ManufacturingIotSolution;
