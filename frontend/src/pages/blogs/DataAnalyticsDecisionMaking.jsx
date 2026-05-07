import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { blogsData } from '../../data/contentData';

const DataAnalyticsDecisionMaking = () => {
  const blog = blogsData.find(b => b.slug === 'data-analytics-decision-making');
  const blogIndex = blogsData.findIndex(b => b.slug === 'data-analytics-decision-making');
  
  const previousBlog = blogIndex > 0 ? blogsData[blogIndex - 1] : null;
  const nextBlog = blogIndex < blogsData.length - 1 ? blogsData[blogIndex + 1] : null;
  
  const relatedContent = blogsData
    .filter(b => b.slug !== 'data-analytics-decision-making')
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
      authorRole="Director, Data & Analytics Practice"
      authorBio="Robert Taylor leads analytics engagements for enterprise clients, helping organizations build data-driven decision-making capabilities. He specializes in analytics strategy, data governance, and organizational transformation."
      featuredImage={blog.image}
      tags={blog.tags}
      previousContent={previousBlog ? { title: previousBlog.title, link: `/blogs/${previousBlog.slug}` } : null}
      nextContent={nextBlog ? { title: nextBlog.title, link: `/blogs/${nextBlog.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{blog.excerpt}</p>

      <h2>Executive Summary</h2>
      <p>
        Data-driven decision-making has evolved from competitive advantage to operational necessity. This analysis examines how leading organizations are leveraging analytics to drive strategic decisions and build sustainable competitive advantage.
      </p>

      <h2>The Analytics Maturity Journey</h2>
      <p>
        Organizations progress through distinct maturity stages in their analytics capabilities, from basic reporting to predictive and prescriptive analytics. Understanding current maturity helps prioritize investments.
      </p>

      <h3>Descriptive Analytics</h3>
      <p>Foundation-level capability focused on understanding historical performance. Most organizations have achieved basic descriptive analytics but often struggle with data quality and integration.</p>

      <h3>Diagnostic Analytics</h3>
      <p>Understanding why outcomes occurred through root cause analysis and correlation discovery. Requires more sophisticated data integration and analytical capabilities.</p>

      <h3>Predictive Analytics</h3>
      <p>Forecasting future outcomes using statistical models and machine learning. Enables proactive decision-making but requires significant data science capability.</p>

      <h3>Prescriptive Analytics</h3>
      <p>Recommending optimal actions based on predicted outcomes. Represents the most advanced maturity level and requires integration with operational systems.</p>

      <h2>Building Analytics Capability</h2>
      <ul>
        <li><strong>Data Foundation:</strong> Invest in data quality, integration, and governance</li>
        <li><strong>Technology Platform:</strong> Select scalable platforms that support analytics evolution</li>
        <li><strong>Talent Development:</strong> Build both specialized and broad analytics skills</li>
        <li><strong>Cultural Change:</strong> Foster data-driven decision-making culture throughout the organization</li>
      </ul>

      <h2>Conclusion</h2>
      <p>
        Analytics excellence requires sustained investment in data, technology, people, and culture. Organizations that build strong analytics foundations will be better positioned to compete in an increasingly data-driven economy.
      </p>
    </ContentDetailLayout>
  );
};

export default DataAnalyticsDecisionMaking;
