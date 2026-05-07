import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, Clock, ArrowLeft, ArrowRight,
  ChevronRight
} from 'lucide-react';
import ShareButtons from './ShareButtons';
import NewsletterForm from './NewsletterForm';
import ContentRecommendations from './ContentRecommendations';

// Reusable Enterprise Content Layout for Blogs, Case Studies, White Papers, Events, Brochures
const ContentDetailLayout = ({ 
  contentId, // For recommendations
  contentType, // 'Blog' | 'Case Study' | 'White Paper' | 'Event' | 'Brochure'
  backLink,
  backLabel,
  title,
  publishDate,
  readTime,
  author,
  authorRole,
  authorBio,
  authorImage,
  featuredImage,
  tags = [],
  children, // Main content
  previousContent,
  nextContent,
  relatedContent = []
}) => {
  const location = useLocation();
  const currentUrl = window.location.origin + location.pathname;
  
  // Content type colors
  const typeColors = {
    'Blog': 'bg-blue-50 text-blue-700',
    'Case Study': 'bg-emerald-50 text-emerald-700',
    'White Paper': 'bg-purple-50 text-purple-700',
    'Event': 'bg-orange-50 text-orange-700',
    'Brochure': 'bg-slate-100 text-slate-700',
    'News': 'bg-red-50 text-red-700'
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      
      {/* Hero Section - Clean, minimal */}
      <section className="pt-8 pb-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link 
            to={backLink} 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-white text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
          
          {/* Metadata line */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[contentType] || 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'}`}>
              {contentType}
            </span>
            {publishDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {publishDate}
              </span>
            )}
            {readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readTime} read
              </span>
            )}
          </div>
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight max-w-4xl">
            {title}
          </h1>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left Column - Primary Content (70%) - Scrollable */}
          <article className="lg:col-span-8 min-h-0">
            {/* Featured Image */}
            {featuredImage && (
              <div className="mb-12 rounded-xl overflow-hidden">
                <img 
                  src={featuredImage} 
                  alt={title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Main Content - Enhanced Typography */}
            <div className="content-body">
              {children}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-16 pt-10 border-t border-gray-200">
                <div className="flex items-center gap-3 flex-wrap">
                  {tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-4 py-2 bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section at Bottom */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-gray-700 dark:text-gray-300 font-medium">Enjoyed this article? Share it with your network</p>
                <ShareButtons 
                  title={title}
                  url={currentUrl}
                  description={`Check out this ${contentType}: ${title}`}
                  variant="horizontal"
                />
              </div>
            </div>

            {/* Author Attribution */}
            {author && (
              <div className="mt-16 pt-10 border-t border-gray-200">
                <div className="flex items-start gap-5">
                  {authorImage ? (
                    <img 
                      src={authorImage} 
                      alt={author}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl font-semibold">
                        {author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{author}</h4>
                    {authorRole && (
                      <p className="text-gray-500 text-sm mb-3">{authorRole}</p>
                    )}
                    {authorBio && (
                      <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">{authorBio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Previous / Next Navigation */}
            <div className="mt-16 pt-10 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                {previousContent ? (
                  <Link 
                    to={previousContent.link}
                    className="group p-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors"
                  >
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Previous
                    </span>
                    <p className="mt-3 text-gray-900 dark:text-white font-semibold group-hover:text-brand-blue transition-colors line-clamp-2">
                      {previousContent.title}
                    </p>
                  </Link>
                ) : <div />}
                
                {nextContent ? (
                  <Link 
                    to={nextContent.link}
                    className="group p-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors text-right"
                  >
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-1 justify-end">
                      Next <ArrowRight className="w-3 h-3" />
                    </span>
                    <p className="mt-3 text-gray-900 dark:text-white font-semibold group-hover:text-brand-blue transition-colors line-clamp-2">
                      {nextContent.title}
                    </p>
                  </Link>
                ) : <div />}
              </div>
            </div>
          </article>

          {/* Right Column - Sticky Sidebar (30%) */}
          <aside className="lg:col-span-4 relative">
            <div className="sticky top-8 space-y-10 max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {/* Newsletter Subscription Card */}
              <NewsletterForm source="content-sidebar" />

              {/* AI-Powered Recommendations */}
              {contentId && <ContentRecommendations contentId={contentId} limit={4} />}

              {/* Recent / Popular Content (fallback if no recommendations) */}
              {relatedContent.length > 0 && (
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Related Insights
                  </h3>
                  <div className="space-y-6">
                    {relatedContent.slice(0, 4).map((item, idx) => (
                      <Link 
                        key={idx}
                        to={item.link}
                        className="flex gap-4 group"
                      >
                        {item.image && (
                          <img 
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors line-clamp-2">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1.5">{item.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics / Tags Section */}
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['AI', 'Cloud', 'Cybersecurity', 'FinTech', 'Digital Transformation', 'Data Analytics', 'Enterprise'].map((topic, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Soft CTA Card */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-3">
                  Engage with Kangqore
                </h3>
                <p className="text-sm text-gray-300 mb-5">
                  Explore how our expertise can support your enterprise objectives.
                </p>
                <Link 
                  to="/contact"
                  className="inline-flex items-center gap-2 text-white text-sm font-medium hover:underline"
                >
                  Talk to Our Experts
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Content Body Styles */}
      <style>{`
        .content-body {
          font-size: 1.125rem;
          line-height: 1.9;
          color: #374151;
        }
        
        .content-body > p {
          margin-bottom: 1.75rem;
        }
        
        .content-body > p:first-child {
          font-size: 1.25rem;
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }
        
        .content-body h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          margin-top: 3.5rem;
          margin-bottom: 1.25rem;
          line-height: 1.3;
          letter-spacing: -0.025em;
        }
        
        .content-body h3 {
          font-size: 1.375rem;
          font-weight: 600;
          color: #1f2937;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }
        
        .content-body h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        
        .content-body strong {
          font-weight: 600;
          color: #111827;
        }
        
        .content-body em {
          font-style: italic;
          color: #4b5563;
        }
        
        .content-body a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s;
        }
        
        .content-body a:hover {
          color: #1d4ed8;
        }
        
        .content-body ul {
          margin-top: 1.5rem;
          margin-bottom: 2rem;
          padding-left: 0;
          list-style: none;
        }
        
        .content-body ul li {
          position: relative;
          padding-left: 1.75rem;
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        
        .content-body ul li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.75rem;
          width: 6px;
          height: 6px;
          background-color: #2563eb;
          border-radius: 50%;
        }
        
        .content-body ol {
          margin-top: 1.5rem;
          margin-bottom: 2rem;
          padding-left: 0;
          list-style: none;
          counter-reset: item;
        }
        
        .content-body ol li {
          position: relative;
          padding-left: 2.5rem;
          margin-bottom: 1.25rem;
          line-height: 1.7;
          counter-increment: item;
        }
        
        .content-body ol li::before {
          content: counter(item);
          position: absolute;
          left: 0;
          top: 0;
          width: 1.75rem;
          height: 1.75rem;
          background-color: #f3f4f6;
          color: #374151;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .content-body blockquote {
          margin: 2.5rem 0;
          padding: 1.5rem 2rem;
          background-color: #f9fafb;
          border-left: 4px solid #2563eb;
          border-radius: 0 0.75rem 0.75rem 0;
        }
        
        .content-body blockquote p {
          font-size: 1.125rem;
          font-style: italic;
          color: #4b5563;
          margin-bottom: 0;
        }
        
        .content-body blockquote footer {
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
          font-style: normal;
        }
        
        .content-body hr {
          margin: 3rem 0;
          border: none;
          height: 1px;
          background-color: #e5e7eb;
        }
        
        .content-body table {
          width: 100%;
          margin: 2rem 0;
          border-collapse: collapse;
          font-size: 0.9375rem;
        }
        
        .content-body table th {
          text-align: left;
          padding: 1rem;
          background-color: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
          font-weight: 600;
          color: #111827;
        }
        
        .content-body table td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
        }
        
        .content-body code {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-size: 0.875em;
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          color: #1f2937;
        }
        
        .content-body pre {
          margin: 2rem 0;
          padding: 1.5rem;
          background-color: #1f2937;
          border-radius: 0.75rem;
          overflow-x: auto;
        }
        
        .content-body pre code {
          background: none;
          padding: 0;
          color: #e5e7eb;
          font-size: 0.875rem;
          line-height: 1.7;
        }
        
        .content-body img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 2rem 0;
        }
        
        .content-body figure {
          margin: 2.5rem 0;
        }
        
        .content-body figcaption {
          margin-top: 0.75rem;
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default ContentDetailLayout;
