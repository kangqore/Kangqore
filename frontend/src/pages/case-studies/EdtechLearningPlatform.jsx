import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { caseStudiesData } from '../../data/contentData';

const EdtechLearningPlatform = () => {
  const caseStudy = caseStudiesData.find(c => c.slug === 'edtech-learning-platform');
  const csIndex = caseStudiesData.findIndex(c => c.slug === 'edtech-learning-platform');
  
  const previousCs = csIndex > 0 ? caseStudiesData[csIndex - 1] : null;
  const nextCs = csIndex < caseStudiesData.length - 1 ? caseStudiesData[csIndex + 1] : null;
  
  const relatedContent = caseStudiesData
    .filter(c => c.slug !== 'edtech-learning-platform')
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
      author="Kangqore EdTech Practice"
      authorRole="Platform Engineering Team"
      authorBio="Our EdTech Practice builds scalable learning platforms that deliver personalized education experiences to millions of learners worldwide."
      featuredImage={caseStudy.image}
      tags={caseStudy.technologies}
      previousContent={previousCs ? { title: previousCs.title, link: `/case-studies/${previousCs.slug}` } : null}
      nextContent={nextCs ? { title: nextCs.title, link: `/case-studies/${nextCs.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{caseStudy.description}</p>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-10">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-indigo-700">2M+</p>
            <p className="text-sm text-indigo-600">Active Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-700">85%</p>
            <p className="text-sm text-indigo-600">Completion Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-700">Global</p>
            <p className="text-sm text-indigo-600">Reach</p>
          </div>
        </div>
      </div>

      <h2>Client Context</h2>
      <p>An education technology company needed to build a scalable learning platform capable of delivering personalized learning experiences to millions of students worldwide.</p>

      <h2>The Challenge</h2>
      <ul>
        <li><strong>Scalability:</strong> Platform needed to support rapid growth from thousands to millions of users</li>
        <li><strong>Engagement:</strong> Low course completion rates requiring improved personalization</li>
        <li><strong>Global Reach:</strong> Multi-region deployment with low-latency content delivery</li>
      </ul>

      <h2>Our Solution</h2>
      <p>Built cloud-native learning platform on AWS with AI-powered personalization, gamification features, and global CDN for optimized content delivery across 50+ countries.</p>

      <h2>Results</h2>
      <p>Platform now serves 2M+ active users with 85% course completion rates (up from 30%), establishing the client as a leader in personalized online education.</p>
    </ContentDetailLayout>
  );
};

export default EdtechLearningPlatform;
