
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Building2, ChevronLeft, ChevronRight, Download, Send, 
  Trash2, Archive, AlertCircle, Star, Search, Plus, Filter,
  Phone, Globe, Mail, Clock, Calendar, MapPin, X, Paperclip, 
  MoreVertical, CheckSquare, MessageSquare, AlertTriangle, FileText, Inbox, User, Flag
} from 'lucide-react';
import { format } from 'date-fns';
import RichTextEditor from '../../../components/Email/RichTextEditor';

const AdminClientEmails = ({ embedded = false, folder = 'inbox' }) => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';


    const [isNotice, setIsNotice] = useState(false); // Gap 6: Formal Notices
    
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
      e.target.value = '';
    }
  };

  // Render formatted text (convert markdown to HTML)
  const renderFormattedText = (text) => {
    if (!text) return '';
    // Convert color tags: {{color:#hex}}text{{/color}} -> <span style="color:#hex">text</span>
    let html = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" class="text-blue-500 underline">$1</a>');
    html = html.replace(/^• (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.+<\/li>\n?)+/g, '<ul class="list-disc ml-4">$&</ul>');
    return html;
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
      const res = await axios.get(`${BACKEND_URL}/api/admin/client-emails`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data.conversations || []);
    } catch (error) {
      console.error('Error fetching client conversations:', error);
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
    // Deselect if switching folders
    setSelectedClient(null);
  };

  const loadThread = async (clientId) => {
    setThreadLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/admin/client-emails/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setThread(res.data.emails || []);
      setSelectedClient(res.data.user || res.data.client); // API might return 'user' or 'client'
    } catch (error) {
      console.error('Error fetching thread:', error);
    } finally {
      setThreadLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedClient) return;
    
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BACKEND_URL}/api/admin/client-emails/reply`, {
        clientId: selectedClient.id,
        content: replyText,
        replyToId: thread[thread.length - 1]?.id,
        isNotice, // Gap 6
        attachments: attachments.map(a => a.url)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newEmail = res.data.email || {
        id: Date.now().toString(),
        from: 'admin@kangqore.com',
        body: replyText,
        direction: 'outbound',
        createdAt: new Date().toISOString()
      };
      setThread(prev => [...prev, newEmail]);
      // setReplied(true); 
      setReplyText('');
      setAttachments([]);
      setIsNotice(false);
      setReplyMode(false);
      setSuccessMessage('✅ Reply sent to client!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      console.error('Error sending reply:', error);
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

        // Optimistic update or refetch
        fetchConversations();
        
        // Show success
        setSuccessMessage('✅ Action updated!');
        setTimeout(() => setSuccessMessage(''), 3000);

        if (action === 'move' && ['SPAM', 'TRASH'].includes(value)) {
            setSelectedClient(null);
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
        <div className={`${selectedClient ? 'hidden md:block md:w-1/3' : 'w-full'} border-r border-gray-100 flex flex-col`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 capitalize">
              <Inbox className="w-5 h-5" /> {folder}
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
                  setSelectedClient(conv.user);
                  loadThread(conv.user?.id);
                }}
                className={`w-full p-4 text-left border-b border-gray-50 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition-colors ${
                  selectedClient?.id === conv.user?.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{conv.user?.name}</span>
                      <span className="text-xs text-gray-400">{formatDate(conv.lastMessage?.createdAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                      <Building2 className="w-3 h-3" /> {conv.user?.company || 'Client'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conv.lastMessage?.body?.substring(0, 50)}...</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{conv.unreadCount}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedClient ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedClient(null)} className="md:hidden p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{selectedClient.name}</h3>
                  <p className="text-xs text-gray-500">{selectedClient.email} • {selectedClient.company}</p>
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
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 text-gray-800 dark:text-gray-50 rounded-bl-sm shadow-sm'
                    }`}>
                      <div 
                        className="text-sm whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: renderFormattedText(email.body) }}
                      />
                      {/* Display attachments */}
                      {email.attachments && email.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {email.attachments.map((att, idx) => {
                            const url = typeof att === 'string' ? att : att.url;
                            const name = typeof att === 'string' ? `Attachment ${idx + 1}` : att.name;
                            const isImage = url && (url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.includes('/image'));
                            return isImage ? (
                              <div key={idx} className="rounded-lg overflow-hidden border border-white/20">
                                <img src={url} alt={name} className="max-w-full max-h-48 object-cover" />
                                <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-black/10 text-xs hover:bg-black/20 transition-colors">
                                  <Download className="w-3 h-3" />
                                  {name}
                                </a>
                              </div>
                            ) : (
                              <a key={idx} href={url} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                                email.direction === 'outbound' 
                                  ? 'bg-white dark:bg-gray-900 dark:border-gray-800/10 border-white/20 hover:bg-white dark:bg-gray-900 dark:border-gray-800/20' 
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  email.direction === 'outbound' ? 'bg-white dark:bg-black/20' : 'bg-blue-100'
                                }`}>
                                  <FileText className={`w-4 h-4 ${email.direction === 'outbound' ? 'text-white' : 'text-blue-600'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-medium truncate ${email.direction === 'outbound' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{name}</p>
                                  <p className={`text-[10px] ${email.direction === 'outbound' ? 'text-white/70' : 'text-gray-400'}`}>Click to download</p>
                                </div>
                                <Download className={`w-4 h-4 ${email.direction === 'outbound' ? 'text-white/70' : 'text-gray-400'}`} />
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-2 mt-1 ${email.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] text-gray-400">{email.direction === 'outbound' ? 'You' : selectedClient.name}</span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[10px] text-gray-400">{formatDate(email.createdAt)}</span>
                      {email.attachments && email.attachments.length > 0 && (
                        <span className="text-[10px] text-gray-400">📎 {email.attachments.length}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

            </div>

            <div className="p-4 border-t border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
              {replyMode ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reply to {selectedClient.name}</span>
                    <button onClick={() => { setReplyMode(false); setReplyText(''); }} className="p-1 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded">
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
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isNotice ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-800 group-hover:border-purple-400'}`}>
                                {isNotice && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={isNotice} 
                                onChange={(e) => setIsNotice(e.target.checked)} 
                            />
                            <span className={`text-xs font-medium ${isNotice ? 'text-purple-700' : 'text-gray-500'}`}>Send as Formal Notice</span>
                            {isNotice && <Shield className="w-3 h-3 text-purple-600 ml-1" />}
                        </label>
                        <p className="text-xs text-gray-400 border-l border-gray-200 pl-3 ml-2">Sent from admin@kangqore.com</p>
                    </div>
                  </div>

                </div>
              ) : (
                <button onClick={() => setReplyMode(true)} className="w-full py-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center gap-2 text-sm font-medium">
                  <Send className="w-4 h-4" />
                  Reply to {selectedClient.name}
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
    <DashboardLayout role="admin" title="Client Emails" subtitle="Manage client communications">
      {content}
    </DashboardLayout>
  );

};

export default AdminClientEmails;
