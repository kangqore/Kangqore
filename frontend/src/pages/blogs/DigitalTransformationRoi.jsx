import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { blogsData } from '../../data/contentData';

const DigitalTransformationRoi = () => {
  const blog = blogsData.find(b => b.slug === 'digital-transformation-roi');
  const blogIndex = blogsData.findIndex(b => b.slug === 'digital-transformation-roi');
  
  const previousBlog = blogIndex > 0 ? blogsData[blogIndex - 1] : null;
  const nextBlog = blogIndex < blogsData.length - 1 ? blogsData[blogIndex + 1] : null;
  
  const relatedContent = blogsData
    .filter(b => b.slug !== 'digital-transformation-roi')
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
      authorRole="Partner, Strategy & Transformation"
      authorBio="David Kumar advises C-suite executives on digital strategy and transformation. With over 20 years of consulting experience, he has led transformation programs across multiple industries generating billions in enterprise value."
      featuredImage={blog.image}
      tags={blog.tags}
      previousContent={previousBlog ? { title: previousBlog.title, link: `/blogs/${previousBlog.slug}` } : null}
      nextContent={nextBlog ? { title: nextBlog.title, link: `/blogs/${nextBlog.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{blog.excerpt}</p>

      <h2>Executive Summary</h2>
      <p>
        Digital transformation investments continue to grow, yet many organizations struggle to demonstrate clear return on investment. This analysis provides a framework for measuring transformation ROI and identifies common pitfalls that undermine value realization.
      </p>

      <h2>The ROI Challenge</h2>
      <p>
        Traditional ROI models often fail to capture the full value of digital transformation. Benefits span multiple dimensions—operational efficiency, revenue growth, risk reduction, and organizational agility—requiring a more comprehensive measurement approach.
      </p>

      <h2>A Multi-Dimensional Framework</h2>
      <h3>Operational Efficiency</h3>
      <p>Cost reduction and productivity improvements remain the most measurable transformation benefits. Establish clear baselines and track improvements across automated processes.</p>

      <h3>Revenue Impact</h3>
      <p>Digital capabilities enable new revenue streams and enhanced customer experiences. Attribution models should capture both direct and indirect revenue contributions.</p>

      <h3>Risk and Resilience</h3>
      <p>Modern digital infrastructure improves operational resilience and reduces technology risk. Quantify risk reduction through scenario analysis and incident cost avoidance.</p>

      <h2>Common Pitfalls</h2>
      <ul>
        <li><strong>Incomplete Baseline:</strong> Failing to establish comprehensive pre-transformation metrics</li>
        <li><strong>Narrow Scope:</strong> Measuring only direct cost savings while ignoring broader value</li>
        <li><strong>Short Timeframes:</strong> Expecting immediate returns from transformational initiatives</li>
      </ul>

      <h2>Conclusion</h2>
      <p>
        Demonstrating digital transformation ROI requires deliberate measurement design, comprehensive value capture, and realistic timeframes. Organizations that approach measurement strategically will be better positioned to justify continued investment and optimize program outcomes.
      </p>
    </ContentDetailLayout>
  );
};

export default DigitalTransformationRoi;
