import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { blogsData } from '../../data/contentData';

const CybersecurityTrends2025 = () => {
  const blog = blogsData.find(b => b.slug === 'cybersecurity-trends-2025');
  const blogIndex = blogsData.findIndex(b => b.slug === 'cybersecurity-trends-2025');
  
  const previousBlog = blogIndex > 0 ? blogsData[blogIndex - 1] : null;
  const nextBlog = blogIndex < blogsData.length - 1 ? blogsData[blogIndex + 1] : null;
  
  const relatedContent = blogsData
    .filter(b => b.slug !== 'cybersecurity-trends-2025')
    .slice(0, 4)
    .map(b => ({ title: b.title, link: `/blogs/${b.slug}`, image: b.image, date: b.date }));

  return (
    <ContentDetailLayout
      contentType="Blog"
      backLink="/blogs"
      backLabel="Back to Insights"
      title={blog.title}
      publishDate={blog.date}
      readTime={blog.readTime}
      author={blog.author}
      authorRole="Principal, Cybersecurity Practice"
      authorBio="Emily Johnson leads Kangqore's cybersecurity practice, advising enterprises on security strategy, risk management, and incident response. She previously served as CISO for a Fortune 100 financial services firm."
      featuredImage={blog.image}
      tags={blog.tags}
      previousContent={previousBlog ? { title: previousBlog.title, link: `/blogs/${previousBlog.slug}` } : null}
      nextContent={nextBlog ? { title: nextBlog.title, link: `/blogs/${nextBlog.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{blog.excerpt}</p>

      <h2>Executive Summary</h2>
      <p>
        The cybersecurity landscape continues to evolve rapidly, with threat actors becoming increasingly sophisticated and attack surfaces expanding. This analysis examines key trends shaping enterprise security in 2025 and provides strategic recommendations for security leaders.
      </p>

      <h2>Emerging Threat Landscape</h2>
      <p>
        The threat landscape in 2025 is characterized by AI-powered attacks, supply chain vulnerabilities, and nation-state activity. Organizations must adapt their security posture to address these evolving challenges.
      </p>

      <h3>AI-Powered Threats</h3>
      <p>
        Adversaries are leveraging AI to automate attack discovery, craft sophisticated phishing campaigns, and evade traditional detection mechanisms. Security teams must respond with AI-enhanced defensive capabilities.
      </p>

      <h3>Supply Chain Risk</h3>
      <p>
        Software supply chain attacks continue to present significant risk. Organizations must implement comprehensive third-party risk management and software bill of materials (SBOM) practices.
      </p>

      <h2>Strategic Priorities for 2025</h2>
      <ul>
        <li><strong>Zero Trust Architecture:</strong> Accelerate zero trust adoption across identity, network, and data layers</li>
        <li><strong>Security Operations Modernization:</strong> Invest in detection and response capabilities</li>
        <li><strong>Cloud Security Posture:</strong> Strengthen cloud security governance and monitoring</li>
        <li><strong>Resilience Planning:</strong> Enhance incident response and business continuity capabilities</li>
      </ul>

      <h2>Conclusion</h2>
      <p>
        Security in 2025 requires a balanced approach combining technology investment, organizational capability, and governance maturity. Organizations that invest strategically in these areas will be better positioned to manage evolving cyber risks.
      </p>
    </ContentDetailLayout>
  );
};

export default CybersecurityTrends2025;
