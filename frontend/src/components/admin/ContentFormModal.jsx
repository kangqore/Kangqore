import React, { useRef, useState } from 'react';
import { X, Upload, RefreshCw } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import { CONTENT_TYPES } from './ContentManagement';

/**
 * Content Form Modal Component for Admin Dashboard
 * Used for creating and editing content
 */
const ContentFormModal = ({
  isOpen,
  isEditing,
  formData,
  actionLoading,
  onFormChange,
  onSubmit,
  onClose,
  apiUrl
}) => {
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  if (!isOpen) return null;

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload JPG, PNG, GIF, WebP, or SVG.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10MB.');
      return;
    }

    setUploadingImage(true);
    const token = localStorage.getItem('token');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      // Fixed: Use correct uploads endpoint
      const res = await fetch(`${apiUrl}/api/uploads`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload
      });

      if (res.ok) {
        const data = await res.json();
        // Backend returns file object with url
        onFormChange({ ...formData, image: `${apiUrl}${data.file.url}` });
      } else {
        const error = await res.json();
        alert(error.detail || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Content' : 'Create New Content'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg"
            data-testid="close-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Content Type & Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content Type</label>
              <select
                value={formData.content_type}
                onChange={(e) => onFormChange({ ...formData, content_type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
                data-testid="content-type-select"
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => onFormChange({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                data-testid="status-select"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Enter title"
              required
              data-testid="title-input"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => onFormChange({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="auto-generated-from-title"
              data-testid="slug-input"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => onFormChange({ ...formData, excerpt: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Brief description"
              data-testid="excerpt-input"
            />
          </div>

          {/* Rich Text Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => onFormChange({ ...formData, content: value })}
              placeholder="Write your content here... Use the toolbar for formatting."
            />
            <p className="mt-2 text-xs text-gray-500">Use the toolbar above for formatting: headings, bold, italics, lists, links, and more.</p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Featured Image</label>
            <div className="space-y-4">
              {/* Image Preview */}
              {formData.image && (
                <div className="relative inline-block">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="h-32 w-auto rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => onFormChange({ ...formData, image: '' })}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    data-testid="remove-image-btn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {/* Upload and URL Options */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    data-testid="image-file-input"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`inline-flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition-colors ${uploadingImage ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {uploadingImage ? (
                      <>
                        <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Upload Image</span>
                      </>
                    )}
                  </label>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP (max 10MB)</p>
                </div>
                
                <div className="flex items-center self-center">
                  <span className="text-sm text-gray-400">or</span>
                </div>
                
                <div className="flex-grow">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => onFormChange({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Paste image URL..."
                    data-testid="image-url-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => onFormChange({ ...formData, author: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Author name"
              data-testid="author-input"
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => onFormChange({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="e.g., Technology, Finance"
                data-testid="category-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => onFormChange({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="AI, Cloud, Digital"
                data-testid="tags-input"
              />
            </div>
          </div>

          {/* Blog-specific fields */}
          {formData.content_type === 'blog' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Read Time</label>
              <input
                type="text"
                value={formData.read_time}
                onChange={(e) => onFormChange({ ...formData, read_time: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="5 min"
                data-testid="read-time-input"
              />
            </div>
          )}

          {/* Event-specific fields */}
          {formData.content_type === 'event' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Date</label>
                <input
                  type="text"
                  value={formData.event_date}
                  onChange={(e) => onFormChange({ ...formData, event_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="March 15, 2025"
                  data-testid="event-date-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Time</label>
                <input
                  type="text"
                  value={formData.event_time}
                  onChange={(e) => onFormChange({ ...formData, event_time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="9:00 AM - 5:00 PM EST"
                  data-testid="event-time-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.event_location}
                  onChange={(e) => onFormChange({ ...formData, event_location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="New York, NY"
                  data-testid="event-location-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Format</label>
                <select
                  value={formData.event_format}
                  onChange={(e) => onFormChange({ ...formData, event_format: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  data-testid="event-format-select"
                >
                  <option value="Virtual">Virtual</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg transition-colors"
              data-testid="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading === 'content'}
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              data-testid="submit-btn"
            >
              {actionLoading === 'content' ? 'Saving...' : isEditing ? 'Update Content' : 'Create Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentFormModal;
