import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { ClipboardList, Calendar, CheckCircle, Paperclip, MessageSquare, ExternalLink, FileText, RefreshCw } from 'lucide-react';
import SmartProgressBar from '../../../components/ui/SmartProgressBar';

const ClientTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/client/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data.tasks || []);
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
    setIsSyncing(true);
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${BACKEND_URL}/api/client/tasks/${taskId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
      setTasks(previousTasks); // Rollback
    } finally {
      setUpdating(null);
      setIsSyncing(false);
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'todo': return 'bg-gray-100 text-gray-600';
      case 'in_progress': return 'bg-blue-100 text-blue-700 font-bold';
      case 'completed': return 'bg-emerald-100 text-emerald-700 font-bold';
      case 'approved': return 'bg-purple-100 text-purple-700 font-bold shadow-sm ring-1 ring-purple-200';
      case 'blocked': return 'bg-red-100 text-red-700 font-black';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-50 text-red-600 border border-red-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'low': return 'bg-green-50 text-green-600 border border-green-100';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  return (
    <DashboardLayout role="client" title="Project Tasks" subtitle="Track progress and approve completions">
      <SmartProgressBar isProcessing={isSyncing} label="Syncing Task with Global System of Record..." />

      {/* Tasks List */}
      <div className="space-y-4 max-w-5xl mx-auto">
        {loading && (
            <div className="space-y-4">
                {[1,2,3].map(i => (
                    <div key={i} className="h-24 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-gray-100 animate-pulse overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent animate-[shimmer_2s_infinite]" />
                    </div>
                ))}
            </div>
        )}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-dashed border-gray-200">
            <ClipboardList className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white font-black tracking-tight">No Active Tasks</h3>
            <p className="text-gray-500 text-sm">Everything is currently on track or completed.</p>
          </div>
        )}
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300 group ${updating === task.id ? 'opacity-70 ring-2 ring-blue-100' : ''}`}
          >
            {/* Task Header */}
            <div 
              className="p-6 flex items-start gap-4 cursor-pointer"
              onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
            >
              <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${task.status === 'completed' || task.status === 'approved' ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-200' : 'border-gray-200 hover:border-brand-blue bg-gray-50 dark:bg-gray-800 dark:border-gray-700'}`}>
                {(task.status === 'completed' || task.status === 'approved') && <CheckCircle className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h4 className={`text-lg font-black tracking-tight transition-all duration-300 ${task.status === 'completed' || task.status === 'approved' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white group-hover:text-brand-blue'}`}>
                        {task.title}
                    </h4>
                    {updating === task.id && (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse border border-blue-100">
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                            Syncing...
                        </span>
                    )}
                </div>
                <p className="text-[13px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                
                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {/* Project Badge */}
                  <span className="text-xs bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                    {task.project?.title || "Project"}
                  </span>

                  {/* Partner Badge (Assigned To) */}
                  {task.partner && (
                     <span className="text-xs flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 px-2 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Assigned: {task.partner.name}
                     </span>
                  )}
                  
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
                      {task.attachments.length}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Right Side: Status (Interactive) */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Client Cycle: todo -> approved (if completed?) No, clients might want to mark approved? 
                    // Let's keep simple cycle or maybe just Toggle Approved?
                    // For now, standard cycle: todo -> in_progress -> completed -> approved -> todo
                    const nextStatus = task.status === 'todo' ? 'in_progress' : 
                                      task.status === 'in_progress' ? 'completed' : 
                                      task.status === 'completed' ? 'approved' : 'todo';
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
                 {/* Details content similar to Partner... */}
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
                           <span className="text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{att.name || 'Attachment'}</span>
                           <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                         </a>
                       ))}
                     </div>
                   </div>
                 )}
                 {!task.attachments?.length && <p className="text-sm text-gray-400 italic">No additional details.</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};
export default ClientTasks;
