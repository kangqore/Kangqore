import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { ClipboardList, Clock, CheckCircle, Calendar, Paperclip, MessageSquare, ExternalLink, FileText, Upload } from 'lucide-react';

const PartnerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/partner/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [BACKEND_URL]);

  const handleStatusUpdate = async (taskId, newStatus) => {
    setUpdating(taskId);
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${BACKEND_URL}/api/partner/tasks/${taskId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
      setTasks(previousTasks); // Rollback
    } finally {
      setUpdating(null);
    }
  };

  const handleFileUpload = async (taskId, file) => {
      if (!file) return;
      setUpdating(taskId);
      try {
          const token = localStorage.getItem('token');
          // 1. Upload File
          const uploadData = new FormData();
          uploadData.append('file', file);
          const uploadRes = await axios.post(`${BACKEND_URL}/api/uploads`, uploadData, {
             headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          });
          const fileUrl = uploadRes.data.file?.url || uploadRes.data.url;

          // 2. Attach to Task (Need endpoint for this, or use comment/generic update)
          // Ideally POST /api/partner/tasks/:id/attachments
          // For now, let's assume we update the task's attachments array via PATCH or distinct endpoint
          // I will use a hypothetical endpoint: POST /api/partner/tasks/:id/attachments
          await axios.post(`${BACKEND_URL}/api/partner/tasks/${taskId}/attachments`, {
             name: file.name,
             url: fileUrl
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });

          alert('File uploaded successfully!');
          // Refresh tasks
          const res = await axios.get(`${BACKEND_URL}/api/partner/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTasks(res.data);

      } catch (error) {
          console.error('Upload failed', error);
          alert('Failed to upload file');
      } finally {
          setUpdating(null);
      }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'todo': return 'bg-gray-100 text-gray-600';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <DashboardLayout role="partner" title="Tasks" subtitle="Execute your assigned tasks">
      {/* Tasks List */}
      <div className="space-y-4">
        {loading && <div className="text-center py-12 text-gray-500">Loading tasks...</div>}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-dashed border-gray-200">
            <ClipboardList className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Tasks Assigned</h3>
            <p className="text-gray-500">You have no active tasks at this time.</p>
          </div>
        )}
        {tasks.map(task => (
          <div 
            key={task.id} 
            className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Task Header */}
            <div 
              className="p-5 flex items-start gap-4 cursor-pointer"
              onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
            >
              <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${task.status === 'completed' ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'}`}>
                {task.status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-base font-semibold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                  {task.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                
                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {/* Project Badge */}
                  <span className="text-xs bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                    {task.project?.name || "Project"}
                  </span>
                  
                  {/* Due Date */}
                  {task.dueDate && (
                    <span className={`text-xs flex items-center gap-1 ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-600' : 'text-gray-500'}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  
                  {/* Attachments Count */}
                  {task.attachments?.length > 0 && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Paperclip className="w-3.5 h-3.5" />
                      {task.attachments.length} file{task.attachments.length > 1 ? 's' : ''}
                    </span>
                  )}
                  
                  {/* Comments Count */}
                  {task.comments?.length > 0 && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {task.comments.length}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Right Side: Actions */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextStatus = task.status === 'todo' ? 'in_progress' : 
                                      task.status === 'in_progress' ? 'completed' : 'todo';
                    handleStatusUpdate(task.id, nextStatus);
                  }}
                  disabled={updating === task.id}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all transform active:scale-95 ${getStatusStyle(task.status)} hover:opacity-80 flex items-center gap-1 shadow-sm`}
                  title="Click to update status"
                >
                  {updating === task.id ? (
                     <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                  ) : null}
                  {task.status?.replace('_', ' ').toUpperCase()}
                </button>
                
                {/* Upload Button */}
                <label className="cursor-pointer text-xs px-3 py-1 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-600 dark:text-gray-400 rounded-full font-medium hover:bg-gray-50 flex items-center gap-1 shadow-sm transition-colors">
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                    <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(task.id, e.target.files[0])}
                        disabled={updating === task.id}
                    />
                </label>

                {task.priority && (
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${getPriorityStyle(task.priority)}`}>
                    {task.priority}
                  </span>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedTask === task.id && (
              <div className="border-t border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 p-5 space-y-4">
                {/* Internal Reference */}
                {task.internalReference && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Tracked internally as:</span>
                    <span className="font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-700 px-2 py-0.5 rounded text-xs">
                      {task.internalReference}
                    </span>
                  </div>
                )}
                
                {/* Attachments */}
                {task.attachments?.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Paperclip className="w-4 h-4" /> Attachments
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {task.attachments.map((att, idx) => (
                        <a 
                          key={idx}
                          href={att.url || att}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{att.name || att.split('/').pop()}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Comments */}
                {task.comments?.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Comments
                    </h5>
                    <div className="space-y-2">
                      {task.comments.map((comment, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-900 dark:text-white">{comment.author?.name || 'Admin'}</span>
                            <span className="text-xs text-gray-400">
                              {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{comment.content || comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* No extra details message */}
                {!task.internalReference && !task.attachments?.length && !task.comments?.length && (
                  <p className="text-sm text-gray-400 italic">No additional details available.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};
export default PartnerTasks;

