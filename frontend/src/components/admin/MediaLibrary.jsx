import React, { useState, useEffect, useRef } from 'react';
import { 
  Image, FileText, Upload, Trash2, Search, FolderOpen, 
  Grid, List, RefreshCw, Check, X, Copy, ExternalLink,
  Download, File, MoreVertical
} from 'lucide-react';

/**
 * Media Library Component for Admin Dashboard
 * Supports images and documents with folder organization
 */
const MediaLibrary = ({ onSelectMedia, selectionMode = false }) => {
  const [media, setMedia] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filter, setFilter] = useState({ type: '', folder: '', search: '' });
  const [folders, setFolders] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', alt_text: '', folder: '' });
  const fileInputRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchMedia();
    fetchStats();
  }, [filter]);

  const fetchMedia = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      let url = `${API_URL}/api/admin/media?page=1&page_size=100`;
      if (filter.type) url += `&file_type=${filter.type}`;
      if (filter.folder) url += `&folder=${filter.folder}`;
      if (filter.search) url += `&search=${filter.search}`;

      const res = await fetch(url, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (res.ok) {
        const data = await res.json();
        setMedia(data.items || []);
        setFolders(data.folders || []);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/admin/media/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const token = localStorage.getItem('token');
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (uploadForm.title) formData.append('title', uploadForm.title);
        if (uploadForm.alt_text) formData.append('alt_text', uploadForm.alt_text);
        if (uploadForm.folder) formData.append('folder', uploadForm.folder);

        // Fixed: Use correct uploads endpoint
        const res = await fetch(`${API_URL}/api/uploads`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });

        if (!res.ok) {
          const error = await res.json();
          alert(`Failed to upload ${file.name}: ${error.detail}`);
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert(`Failed to upload ${file.name}`);
      }
    }
    
    setUploading(false);
    setShowUploadModal(false);
    setUploadForm({ title: '', alt_text: '', folder: '' });
    fetchMedia();
    fetchStats();
  };

  const handleDelete = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/admin/media/${mediaId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchMedia();
        fetchStats();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    if (!window.confirm(`Delete ${selectedItems.length} files?`)) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/admin/media/bulk-delete`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedItems)
      });
      if (res.ok) {
        setSelectedItems([]);
        fetchMedia();
        fetchStats();
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(`${API_URL}${url}`);
    alert('URL copied to clipboard!');
  };

  const toggleSelect = (mediaId) => {
    setSelectedItems(prev => 
      prev.includes(mediaId) 
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (item) => {
    if (item.file_type === 'image') {
      return <Image className="w-5 h-5 text-brand-blue" />;
    }
    return <FileText className="w-5 h-5 text-orange-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <File className="w-4 h-4" />
            <span className="text-sm">Total Files</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total_files || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Image className="w-4 h-4" />
            <span className="text-sm">Images</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total_images || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-sm">Documents</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total_documents || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <FolderOpen className="w-4 h-4" />
            <span className="text-sm">Storage Used</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total_size_formatted || '0 B'}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-64"
              data-testid="media-search-input"
            />
          </div>
          
          {/* Type Filter */}
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            data-testid="media-type-filter"
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
          </select>
          
          {/* Folder Filter */}
          {folders.length > 0 && (
            <select
              value={filter.folder}
              onChange={(e) => setFilter({ ...filter, folder: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              data-testid="media-folder-filter"
            >
              <option value="">All Folders</option>
              {folders.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          )}

          {/* View Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-[#0a0a0c]' : ''}`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-[#0a0a0c]' : ''}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200"
              data-testid="bulk-delete-btn"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedItems.length})
            </button>
          )}
          
          <button
            onClick={() => fetchMedia()}
            className="p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-gradient text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:brightness-110 transition-all"
            data-testid="upload-media-btn"
          >
            <Upload className="w-5 h-5" />
            Upload Media
          </button>
        </div>
      </div>

      {/* Media Grid/List */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : media.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className={`relative group rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                    selectedItems.includes(item.id) 
                      ? 'border-brand-blue ring-2 ring-blue-200' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => selectionMode ? onSelectMedia?.(item) : toggleSelect(item.id)}
                  data-testid={`media-item-${item.id}`}
                >
                  {/* Selection Checkbox */}
                  {!selectionMode && (
                    <div className={`absolute top-2 left-2 z-10 ${selectedItems.includes(item.id) || 'opacity-0 group-hover:opacity-100'}`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedItems.includes(item.id) ? 'bg-brand-gradient border-brand-blue' : 'bg-white dark:bg-gray-900 dark:border-gray-800 border-gray-300'
                      }`}>
                        {selectedItems.includes(item.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  )}
                  
                  {/* Thumbnail */}
                  <div className="aspect-square bg-gray-100 dark:bg-[#0a0a0c] flex items-center justify-center">
                    {item.file_type === 'image' ? (
                      <img 
                        src={`${API_URL}${item.url}`} 
                        alt={item.alt_text || item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileText className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                  </div>
                  
                  {/* Actions on Hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(item.url); }}
                      className="p-1.5 bg-white dark:bg-gray-900 dark:border-gray-800 rounded shadow hover:bg-gray-100"
                      title="Copy URL"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      className="p-1.5 bg-white dark:bg-gray-900 dark:border-gray-800 rounded shadow hover:bg-red-50 text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#050505]">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 w-8">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(media.map(m => m.id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                      checked={selectedItems.length === media.length && media.length > 0}
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">File</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Size</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Uploaded</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {media.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-[#0a0a0c] rounded flex items-center justify-center overflow-hidden">
                          {item.file_type === 'image' ? (
                            <img src={`${API_URL}${item.url}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.original_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        item.file_type === 'image' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {getFileIcon(item)}
                        {item.file_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatFileSize(item.size)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyToClipboard(item.url)}
                          className="p-2 text-gray-500 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={`${API_URL}${item.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded"
                          title="Open"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:bg-red-900/20 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center mb-4">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Media Files</h3>
            <p className="text-gray-500 mb-6">Upload images and documents to get started.</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-gradient text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:brightness-110 transition-all"
            >
              <Upload className="w-5 h-5" />
              Upload Media
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Media</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Drop Zone */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleUpload(e.dataTransfer.files);
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Drop files here or <span className="text-brand-blue">browse</span>
                </p>
                <p className="text-xs text-gray-400">
                  Images (JPG, PNG, GIF, WebP, SVG) up to 10MB<br />
                  Documents (PDF, DOC, XLS, PPT) up to 50MB
                </p>
              </div>
              
              {/* Optional Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (optional)</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Media title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Text (optional)</label>
                <input
                  type="text"
                  value={uploadForm.alt_text}
                  onChange={(e) => setUploadForm({ ...uploadForm, alt_text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Describe the media for accessibility"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Folder (optional)</label>
                <input
                  type="text"
                  value={uploadForm.folder}
                  onChange={(e) => setUploadForm({ ...uploadForm, folder: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="e.g., blog-images, documents"
                  list="folder-suggestions"
                />
                <datalist id="folder-suggestions">
                  {folders.map((f) => <option key={f} value={f} />)}
                </datalist>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Progress Indicator */}
      {uploading && (
        <div className="fixed bottom-6 right-6 bg-brand-gradient text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
