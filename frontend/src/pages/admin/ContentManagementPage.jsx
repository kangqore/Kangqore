import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { default as React, useState } from 'react';
import { ContentFormModal, ContentManagement, ContentStats } from '../../components/admin';
import DashboardLayout from '../../components/DashboardLayout';
import { useAdminContent, useAdminContentStats } from '../../hooks/useDashboardData';

const ContentManagementPage = () => {
  const queryClient = useQueryClient();
  const [contentFilter, setContentFilter] = useState({ type: '', status: '' });
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [contentForm, setContentForm] = useState({
    title: '', slug: '', content_type: 'blog', excerpt: '', content: '',
    image: '', category: '', tags: '', author: '', status: 'published',
    read_time: '', event_date: '', event_time: '', event_location: '', event_format: 'Virtual'
  });
  const [actionLoading, setActionLoading] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // Data Hooks
  const contentListQuery = useAdminContent(contentFilter);
  const contentStatsQuery = useAdminContentStats();
  
  const content = contentListQuery.data || [];
  const contentStats = contentStatsQuery.data;

  // Handlers (Simplified for brevity, similar to previous dashboard logic)
  const handleCreateNew = () => {
    setEditingContent(null);
    setContentForm({
      title: '', slug: '', content_type: 'blog', excerpt: '', content: '',
      image: '', category: '', tags: '', author: '', status: 'published',
      read_time: '', event_date: '', event_time: '', event_location: '', event_format: 'Virtual'
    });
    setShowContentForm(true);
  };

  const handleEditContent = (item) => {
    setEditingContent(item);
    // Handle tags: might be string, array, or undefined
    const tagsString = Array.isArray(item.tags) 
      ? item.tags.join(', ') 
      : (typeof item.tags === 'string' ? item.tags : '');
    
    // Unpack metadata if it exists
    const metadata = item.metadata || {};
    
    setContentForm({ 
      ...item, 
      tags: tagsString,
      // Ensure specific fields are present or defaulted
      read_time: metadata.read_time || '',
      event_date: metadata.event_date || '',
      event_time: metadata.event_time || '',
      event_location: metadata.event_location || '',
      event_format: metadata.event_format || 'Virtual'
    });
    setShowContentForm(true);
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    setActionLoading('content');
    
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Auto-generate slug if empty, with random suffix to avoid collisions
      let generatedSlug = contentForm.slug;
      if (!generatedSlug && contentForm.title) {
         const baseSlug = contentForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
         const randomSuffix = Math.random().toString(36).substring(2, 6);
         generatedSlug = `${baseSlug}-${randomSuffix}`;
      }

      // Transform field names to match backend schema
      const payload = {
        title: contentForm.title,
        slug: generatedSlug,
        contentType: contentForm.content_type?.toUpperCase() || 'BLOG', // Backend expects camelCase and uppercase value
        content: contentForm.content,
        excerpt: contentForm.excerpt || '',
        featuredImage: contentForm.image || '', // Backend expects 'featuredImage' not 'image'
        category: contentForm.category || '',
        author: typeof contentForm.author === 'object' ? contentForm.author?.name || '' : (contentForm.author || ''),
        status: contentForm.status?.toUpperCase() || 'DRAFT', // Backend expects uppercase
        metadata: {
          read_time: contentForm.read_time,
          event_date: contentForm.event_date,
          event_time: contentForm.event_time,
          event_location: contentForm.event_location,
          event_format: contentForm.event_format
        }
      };
      
      // Handle tags
      if (typeof contentForm.tags === 'string') {
        payload.tags = contentForm.tags.split(',').map(tag => tag.trim()).filter(Boolean).join(',');
      } else if (Array.isArray(contentForm.tags)) {
        payload.tags = contentForm.tags.map(t => String(t).trim()).filter(Boolean).join(',');
      } else {
        payload.tags = '';
      }

      if (editingContent) {
        await axios.put(`${API_URL}/api/admin/content/${editingContent.id}`, payload, { headers });
      } else {
        await axios.post(`${API_URL}/api/admin/content`, payload, { headers });
      }

      await queryClient.invalidateQueries(['admin-content']);
      await queryClient.invalidateQueries(['admin-content-stats']);
      setShowContentForm(false);
      setEditingContent(null);
      // Reset form
      setContentForm({
        title: '', slug: '', content_type: 'blog', excerpt: '', content: '',
        image: '', category: '', tags: '', author: '', status: 'draft',
        read_time: '', event_date: '', event_time: '', event_location: '', event_format: 'Virtual'
      });
    } catch (error) {
      console.error('Content submission error:', error);
      alert('Failed to save content: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await queryClient.invalidateQueries(['admin-content']);
      await queryClient.invalidateQueries(['admin-content-stats']);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete content');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      
      await axios.put(`${API_URL}/api/admin/content/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await queryClient.invalidateQueries(['admin-content']);
      await queryClient.invalidateQueries(['admin-content-stats']);
    } catch (error) {
      console.error('Status toggle error:', error);
      alert('Failed to update status');
    }
  };

  return (
    <DashboardLayout 
      role="admin" 
      title="Content Management" 
      subtitle="Manage blogs, news, case studies, and events."
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ContentStats stats={contentStats} onCreateNew={handleCreateNew} />
        
        <ContentManagement
            content={content}
            contentStats={contentStats}
            contentFilter={contentFilter}
            loading={contentListQuery.isLoading}
            onFilterChange={setContentFilter}
            onCreateNew={handleCreateNew}
            onEdit={handleEditContent}
            onDelete={handleDeleteContent} 
            onTogglePublish={handleTogglePublish}
          />

         <ContentFormModal
            isOpen={showContentForm}
            isEditing={!!editingContent}
            formData={contentForm}
            actionLoading={actionLoading}
            onFormChange={setContentForm}
            onSubmit={handleContentSubmit}
            onClose={() => setShowContentForm(false)}
            apiUrl={API_URL}
          />
      </div>
    </DashboardLayout>
  );
};

export default ContentManagementPage;
