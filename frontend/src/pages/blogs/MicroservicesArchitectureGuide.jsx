import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { blogsData } from '../../data/contentData';

const MicroservicesArchitectureGuide = () => {
  const blog = blogsData.find(b => b.slug === 'microservices-architecture-guide');
  const blogIndex = blogsData.findIndex(b => b.slug === 'microservices-architecture-guide');
  
  const previousBlog = blogIndex > 0 ? blogsData[blogIndex - 1] : null;
  const nextBlog = blogIndex < blogsData.length - 1 ? blogsData[blogIndex + 1] : null;
  
  const relatedContent = blogsData
    .filter(b => b.slug !== 'microservices-architecture-guide')
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
      authorRole="Chief Architect, Platform Engineering"
      authorBio="Lisa Wong is a distinguished architect with expertise in distributed systems and cloud-native architecture. She has designed scalable platforms serving millions of users across financial services and technology sectors."
      featuredImage={blog.image}
      tags={blog.tags}
      previousContent={previousBlog ? { title: previousBlog.title, link: `/blogs/${previousBlog.slug}` } : null}
      nextContent={nextBlog ? { title: nextBlog.title, link: `/blogs/${nextBlog.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{blog.excerpt}</p>

      <h2>Executive Summary</h2>
      <p>
        Microservices architecture has become the standard approach for building scalable, maintainable enterprise applications. This guide provides practical guidance for architecture decisions, implementation patterns, and operational considerations.
      </p>

      <h2>When Microservices Make Sense</h2>
      <p>
        Microservices are not universally applicable. They provide significant benefits for organizations with multiple development teams, complex domains, and requirements for independent scalability and deployment.
      </p>

      <h2>Core Principles</h2>
      <h3>Service Boundaries</h3>
      <p>Well-designed service boundaries align with business capabilities and enable independent evolution. Domain-driven design provides a useful framework for boundary identification.</p>

      <h3>Data Ownership</h3>
      <p>Each service owns its data and exposes capabilities through well-defined APIs. Shared databases undermine service independence and should be avoided.</p>

      <h3>Resilience Patterns</h3>
      <p>Distributed systems require explicit handling of partial failures. Implement circuit breakers, retries with backoff, and graceful degradation.</p>

      <h2>Implementation Considerations</h2>
      <ul>
        <li><strong>Service Mesh:</strong> Consider service mesh for consistent traffic management and observability</li>
        <li><strong>API Gateway:</strong> Implement API gateway for external traffic management and cross-cutting concerns</li>
        <li><strong>Event-Driven Integration:</strong> Leverage asynchronous messaging for loose coupling between services</li>
        <li><strong>Observability:</strong> Invest in comprehensive logging, tracing, and metrics from the start</li>
      </ul>

      <h2>Conclusion</h2>
      <p>
        Successful microservices adoption requires careful architecture design, appropriate tooling, and organizational alignment. Organizations that approach microservices strategically will realize significant benefits in agility and scalability.
      </p>
    </ContentDetailLayout>
  );
};

export default MicroservicesArchitectureGuide;
