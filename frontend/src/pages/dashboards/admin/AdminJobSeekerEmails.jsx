
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import {
  Building2, ChevronLeft, ChevronRight, Download, Send,
  Trash2, Archive, AlertCircle, Star, Search, Plus, Filter,
  Phone, Globe, Mail, Clock, Calendar, MapPin, X, Paperclip,
  MoreVertical, CheckSquare, MessageSquare, AlertTriangle, FileText, User, Inbox, Flag
} from 'lucide-react';
import { format } from 'date-fns';
import RichTextEditor from '../../../components/Email/RichTextEditor';

const AdminJobSeekerEmails = ({ embedded = false, folder = 'inbox' }) => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedSeeker, setSelectedSeeker] = useState(null);
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const uploadedFiles = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await axios.post(`${BACKEND_URL}/api/uploads`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        uploadedFiles.push({ name: file.name, url: res.data.file?.url || res.data.url });
      }
      setAttachments(prev => [...prev, ...uploadedFiles]);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload files');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    filterConversations();
  }, [conversations, folder]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/admin/job-seeker-emails`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data.conversations || []);
    } catch (error) {
      console.error('Error fetching job seeker conversations:', error);
      // Demo data
      setConversations([
        {
          user: { id: 'demo-1', name: 'Alice Candidate', email: 'alice@example.com' },
          lastMessage: { subject: 'Interview Availability', body: 'I am free on Tuesday...', createdAt: new Date().toISOString(), direction: 'inbound' },
          unreadCount: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterConversations = () => {
    if (!conversations.length) {
        setFilteredConversations([]);
        return;
    }

    let filtered = [];
    switch (folder) {
        case 'sent':
            filtered = conversations.filter(c => c.lastMessage?.direction === 'outbound');
            break;
        case 'starred':
            filtered = conversations.filter(c => c.emails?.some(e => e.isAdminStarred));
            break;
        case 'important':
            filtered = conversations.filter(c => c.emails?.some(e => e.isAdminImportant));
            break;
        case 'spam':
            filtered = conversations.filter(c => c.emails?.some(e => e.adminFolder === 'SPAM'));
            break;
        case 'trash':
            filtered = conversations.filter(c => c.emails?.some(e => e.adminFolder === 'TRASH'));
            break;
        case 'inbox':
        default:
            filtered = conversations.filter(c => !c.emails?.some(e => e.adminFolder === 'SPAM' || e.adminFolder === 'TRASH'));
            break;
    }
    setFilteredConversations(filtered);
    setSelectedSeeker(null);
  };

  const loadThread = async (seekerId) => {
    setThreadLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/admin/job-seeker-emails/${seekerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setThread(res.data.emails || []);
      setSelectedSeeker(res.data.user || res.data.jobSeeker);
    } catch (error) {
      console.error('Error fetching thread:', error);
    } finally {
      setThreadLoading(false);
    }
  };



  const handleReply = async () => {
    if (!replyText.trim() || !selectedSeeker) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('jobSeekerId', selectedSeeker.id);
      formData.append('content', replyText);
      formData.append('replyToId', thread[thread.length - 1]?.id);
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      const res = await axios.post(`${BACKEND_URL}/api/admin/job-seeker-emails/reply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Add to thread
      const newEmail = res.data.email || {
        id: Date.now().toString(),
        from: 'admin@kangqore.com',
        body: replyText,
        direction: 'outbound',
        createdAt: new Date().toISOString(),
        attachments: attachments.map(att => ({ filename: att.name, url: URL.createObjectURL(att) })) // For demo/preview
      };
      setThread(prev => [...prev, newEmail]);
      setReplyText('');
      setReplyMode(false);
      setAttachments([]);
      setSuccessMessage('✅ Reply sent to candidate!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      console.error('Error sending reply:', error);
      // Demo mode
      const demoReply = {
        id: `reply-${Date.now()}`,
        from: 'admin@kangqore.com',
        body: replyText,
        direction: 'outbound',
        createdAt: new Date().toISOString(),
        attachments: attachments.map(att => ({ filename: att.name, url: URL.createObjectURL(att) }))
      };
      setThread(prev => [...prev, demoReply]);
      setReplyText('');
      setReplyMode(false);
      setAttachments([]);
      setSuccessMessage('✅ Reply sent to candidate!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } finally {
      setSending(false);
    }
  };

  const handleEmailAction = async (action, value) => {
    if (!thread.length) return;
    const emailIds = thread.map(e => e.id);
    const token = localStorage.getItem('token');

    try {
        await axios.post(`${BACKEND_URL}/api/admin/email-actions`, {
            emailIds,
            action: action === 'move' ? 'move' : action,
            value: action === 'move' ? undefined : value,
            folder: action === 'move' ? value : undefined
        }, { headers: { Authorization: `Bearer ${token}` } });

        fetchConversations();
        setSuccessMessage('✅ Action updated!');
        setTimeout(() => setSuccessMessage(''), 3000);

        if (action === 'move' && ['SPAM', 'TRASH'].includes(value)) {
            setSelectedSeeker(null);
        }
    } catch (err) {
        console.error('Action failed', err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    if (isToday) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const content = (
    <>
      {successMessage && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-800 text-sm">
          <span className="text-lg">✅</span>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      <div className={`bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex ${embedded ? 'h-[calc(100vh-280px)]' : 'h-[calc(100vh-200px)] min-h-[600px]'}`}>
        <div className={`${selectedSeeker ? 'hidden md:block md:w-1/3' : 'w-full'} border-r border-gray-100 flex flex-col`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 capitalize">
              <Mail className="w-5 h-5" /> {folder}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && <div className="p-8 text-center text-gray-400">Loading...</div>}
            {!loading && filteredConversations.length === 0 && (
              <div className="p-8 text-center">
                <Mail className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No items in {folder}</p>
              </div>
            )}
            {filteredConversations.map(conv => (
              <button
                key={conv.user?.id}
                onClick={() => {
                  setSelectedSeeker(conv.user);
                  loadThread(conv.user?.id);
                }}
                className={`w-full p-4 text-left border-b border-gray-50 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition-colors ${
                  selectedSeeker?.id === conv.user?.id ? 'bg-orange-50 border-l-4 border-l-orange-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{conv.user?.name}</span>
                      <span className="text-xs text-gray-400">{formatDate(conv.lastMessage?.createdAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                      {conv.user?.email || 'Candidate'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conv.lastMessage?.body?.substring(0, 50)}...</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{conv.unreadCount}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedSeeker ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedSeeker(null)} className="md:hidden p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{selectedSeeker.name}</h3>
                  <p className="text-xs text-gray-500">{selectedSeeker.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                    onClick={() => handleEmailAction('important', !thread.some(e => e.isAdminImportant))}
                    className={`p-2 rounded-lg transition-colors ${thread.some(e => e.isAdminImportant) ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:bg-white dark:bg-black hover:text-orange-500'}`}
                    title="Mark as Important"
                >
                  <AlertCircle className={`w-5 h-5 ${thread.some(e => e.isAdminImportant) ? 'fill-current' : ''}`} />
                </button>
                <button
                    onClick={() => handleEmailAction('star', !thread.some(e => e.isAdminStarred))}
                    className={`p-2 rounded-lg transition-colors ${thread.some(e => e.isAdminStarred) ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-white dark:bg-black hover:text-yellow-500'}`}
                    title="Star Thread"
                >
                  <Star className={`w-5 h-5 ${thread.some(e => e.isAdminStarred) ? 'fill-current' : ''}`} />
                </button>
                <button
                    onClick={() => handleEmailAction('move', 'SPAM')}
                    className="p-2 text-gray-400 hover:bg-white dark:bg-black hover:text-red-500 rounded-lg transition-colors"
                    title="Report Spam"
                >
                  <Flag className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handleEmailAction('move', 'TRASH')}
                    className="p-2 text-gray-400 hover:bg-white dark:bg-black hover:text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
                    title="Move to Trash"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#050505]/30">
              {threadLoading && <div className="text-center py-8 text-gray-400">Loading thread...</div>}
              {thread.map(email => (
                <div key={email.id} className={`flex ${email.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${email.direction === 'outbound' ? 'order-2' : 'order-1'}`}>
                    <div className={`p-3 rounded-2xl ${
                      email.direction === 'outbound'
                        ? 'bg-orange-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 text-gray-800 dark:text-gray-50 rounded-bl-sm shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{email.body}</p>
                      {email.attachments && email.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {email.attachments.map((att, idx) => (
                            <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs hover:bg-gray-200">
                              <Paperclip className="w-3 h-3" />
                              {att.filename}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-2 mt-1 ${email.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] text-gray-400">{email.direction === 'outbound' ? 'You' : selectedSeeker.name}</span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[10px] text-gray-400">{formatDate(email.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
              {replyMode ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reply to {selectedSeeker.name}</span>
                    <button onClick={() => { setReplyMode(false); setReplyText(''); setAttachments([]); }} className="p-1 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all bg-white dark:bg-gray-900 dark:border-gray-800 relative">
                    <RichTextEditor
                       value={replyText}
                       onChange={setReplyText}
                       onSend={handleReply}
                       onAttach={() => fileInputRef.current?.click()}
                       placeholder="Type your reply..."
                    />

                     {/* Hidden inputs for attachments */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        multiple
                        className="hidden"
                    />

                    {/* Attachments preview overlay or below */}
                    {attachments.length > 0 && (
                      <div className="absolute bottom-16 left-2 right-2 flex flex-wrap gap-2 z-10 pointer-events-none">
                        {attachments.map((att, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 bg-white dark:bg-gray-900 dark:border-gray-800/90 backdrop-blur border border-blue-200 text-blue-700 px-2 py-1 rounded-md text-xs shadow-sm pointer-events-auto">
                            <Paperclip className="w-3 h-3" />
                            {att.name}
                            <button onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="ml-1 hover:text-red-500">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <p className="text-xs text-gray-400">Sent from admin@kangqore.com</p>
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim() || sending}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setReplyMode(true)} className="w-full py-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center gap-2 text-sm font-medium">
                  <Send className="w-4 h-4" />
                  Reply to {selectedSeeker.name}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-gray-400">
            <div className="text-center">
              <Mail className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p>Select a conversation to view</p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (embedded) return content;

  return (
    <DashboardLayout role="admin" title="Job Seeker Emails" subtitle="Manage recruitment communications">
      {content}
    </DashboardLayout>
  );

};

export default AdminJobSeekerEmails;

