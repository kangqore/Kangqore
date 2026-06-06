
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentDetailLayout from '../components/ContentDetailLayout';
import { Loader2 } from 'lucide-react';
import SEO from '../components/SEO';

import ShareButtons from '../components/ShareButtons';
import axios from 'axios';

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        // Ensure slug is valid
        if (!slug) return;

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/content/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
             throw new Error('Blog post not found');
          }
          throw new Error('Failed to fetch blog post');
        }

        const data = await response.json();
        setBlog(data);
        
        // Track View (Once per session for this content ideally, but simpler for now just call it)
        try {
          // Check local storage to prevent duplicate view counting in same session
          const viewedKey = `viewed_${data.id}`;
          if (!sessionStorage.getItem(viewedKey)) {
             await axios.post(`${process.env.REACT_APP_BACKEND_URL || ''}/api/admin/content/track/view`, {
               contentId: data.id,
               referrer: document.referrer
             });
             sessionStorage.setItem(viewedKey, 'true');
          }
        } catch (e) {
          console.error("Tracking error", e);
        }

      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#050505] px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Content Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/blogs')}
          className="px-6 py-2 bg-brand-gradient text-white rounded-lg hover:opacity-90 transition"
        >
          Return to Blogs
        </button>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <ContentDetailLayout
      contentId={blog.id}
      contentType={blog.contentType ? blog.contentType.replace('_', ' ') : "Blog"}
      backLink="/insights"
      backLabel="Back to Insights"
      title={blog.title}
      publishDate={formattedDate}
      readTime="5 min read" // Placeholder or calculate based on content length
      author={blog.author?.name || 'Kangqore Team'}
      authorRole={blog.author?.role || 'Contributor'}
      authorBio="Contributor at Kangqore."
      featuredImage={blog.featuredImage || 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800'}
      tags={(() => {
        if (!blog.tags) return [];
        if (Array.isArray(blog.tags)) return blog.tags;
        if (typeof blog.tags === 'string') {
          if (blog.tags.startsWith('[')) return JSON.parse(blog.tags);
          return blog.tags.split(',').map(t => t.trim()).filter(Boolean);
        }
        return [];
      })()}
      previousContent={null}
      nextContent={null}
      relatedContent={[]} 
    >
      <SEO 
        title={blog.metaTitle || blog.title}
        description={blog.metaDesc || blog.excerpt || blog.title}
        image={blog.featuredImage}
        type="article"
      />
      
      <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </ContentDetailLayout>
  );
};

export default BlogDetails;
