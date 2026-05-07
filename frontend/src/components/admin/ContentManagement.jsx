import React from 'react';
import { 
  FileText, BookOpen, Calendar, Newspaper, Download, FolderOpen,
  Plus, Edit, Trash2, Eye, EyeOff, RefreshCw
} from 'lucide-react';

/**
 * Content Management Component for Admin Dashboard
 * Displays content stats, filters, and content list
 */

const CONTENT_TYPES = [
  { value: 'blog', label: 'Blog' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'white_paper', label: 'White Paper' },
  { value: 'event', label: 'Event' },
  { value: 'news', label: 'News' },
  { value: 'brochure', label: 'Brochure' },
  { value: 'leadership_update', label: 'Leadership Update' },
  { value: 'board_material', label: 'Board Material' }
];

const ContentManagement = ({
  content,
  contentStats,
  contentFilter,
  loading,
  onFilterChange,
  onCreateNew,
  onEdit,
  onDelete,
  onTogglePublish
}) => {
  const getContentTypeIcon = (type) => {
    const icons = { 
      blog: BookOpen, 
      case_study: FolderOpen, 
      white_paper: FileText, 
      event: Calendar, 
      news: Newspaper, 
      brochure: Download 
    };
    return icons[type] || FileText;
  };

  return (
    <>
      {/* Content Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {CONTENT_TYPES.map((type) => {
          const Icon = getContentTypeIcon(type.value);
          // Backend returns keys in UPPERCASE (e.g. BLOG), frontend uses lowercase (e.g. blog)
          const backendKey = type.value.toUpperCase();
          const count = contentStats?.byType?.[backendKey] || 0;
          return (
            <div 
              key={type.value} 
              className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-4 shadow-sm"
              data-testid={`content-stat-${type.value}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">{type.label}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{count}</h3>
            </div>
          );
        })}
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <select
            value={contentFilter.type}
            onChange={(e) => onFilterChange({ ...contentFilter, type: e.target.value })}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            data-testid="content-type-filter"
          >
            <option value="">All Types</option>
            {CONTENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <select
            value={contentFilter.status}
            onChange={(e) => onFilterChange({ ...contentFilter, status: e.target.value })}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            data-testid="content-status-filter"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-gradient text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:brightness-110 transition-all"
          data-testid="create-content-btn"
        >
          <Plus className="w-5 h-5" />
          Create Content
        </button>
      </div>

      {/* Content List */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden" data-testid="content-list">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : content.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#050505]">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Title</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500 text-sm">Created</th>
                <th className="text-right py-4 px-6 font-medium text-gray-500 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {content.map((item) => {
                const TypeIcon = getContentTypeIcon(item.content_type);
                return (
                  <tr 
                    key={item.id} 
                    className="border-t border-gray-100 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    data-testid={`content-row-${item.id}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                          <p className="text-sm text-gray-500">/{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full capitalize">
                        <TypeIcon className="w-3.5 h-3.5" />
                        {item.content_type?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                        item.status === 'PUBLISHED' 
                          ? 'bg-green-100 text-green-700' 
                          : item.status === 'ARCHIVED'
                          ? 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status === 'PUBLISHED' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(item.created_at || item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onTogglePublish(item.id, item.status)}
                          className={`p-2 rounded-lg transition-colors ${
                            item.status === 'PUBLISHED' 
                              ? 'text-amber-600 hover:bg-amber-50' 
                              : 'text-green-600 hover:bg-green-50 dark:bg-green-900/20'
                          }`}
                          title={item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                          data-testid={`toggle-publish-${item.id}`}
                        >
                          {item.status === 'PUBLISHED' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 text-brand-blue hover:bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                          data-testid={`edit-content-${item.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                          data-testid={`delete-content-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Content Yet</h3>
            <p className="text-gray-500 mb-6">Create your first piece of content to get started.</p>
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-gradient text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:brightness-110 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Content
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export { CONTENT_TYPES };
export default ContentManagement;
