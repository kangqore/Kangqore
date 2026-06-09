
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Building2, ChevronLeft, ChevronRight, Download, Send,
  Trash2, Archive, AlertCircle, Star, Search, Plus, Filter,
  MoreVertical, CheckSquare, MessageSquare, AlertTriangle, FileText, Inbox, Flag, Shield,
  Mail, Paperclip
} from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import RichTextEditor from './RichTextEditor';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const EmailClient = ({ role }) => {
  // State
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [activeFolder, setActiveFolder] = useState('INBOX');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ subject: '', body: '' });
  const [sending, setSending] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const replyFileInputRef = useRef(null);

  // Build API base path based on role
  const getApiBase = () => {
    if (role === 'job_seeker') return '/api/careers';
    return `/api/${role}`;
  };
  const API_BASE = getApiBase();

  // Get role-specific field names
  const getRoleFieldPrefix = () => {
    switch(role) {
      case 'client': return 'client';
      case 'partner': return 'partner';
      case 'investor': return 'investor';
      case 'job_seeker': return 'jobSeeker';
      default: return 'client';
    }
  };

  // Render formatted text (convert markdown to HTML)
  const renderFormattedText = (text) => {
    if (!text) return '';
    let html = text;
    
    // 1. Block-level replacements (Alignment, Quote, List)
    // Align
    html = html.replace(/\{\{align:(left|center|right)\}\}\n?([\s\S]+?)\n?\{\{\/align\}\}/g, '<div style="text-align:$1">$2</div>');
    // Quote
    html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 py-1 my-2 bg-gray-50 italic text-gray-700">$1</blockquote>');
    // List Items
    html = html.replace(/^• (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>'); // Numbered list simplistic approach
    // Wrap lists
    html = html.replace(/(<li>.+<\/li>\n?)+/g, '<ul class="list-disc ml-5 space-y-1 mb-2">$&</ul>');

    // 2. Inline replacements
    // Color & Bg
    html = html.replace(/\{\{color:(#[a-fA-F0-9]{6})\}\}(.+?)\{\{\/color\}\}/g, '<span style="color:$1">$2</span>');
    html = html.replace(/\{\{bg:(#[a-fA-F0-9]{6})\}\}(.+?)\{\{\/bg\}\}/g, '<span style="background-color:$1">$2</span>');
    
    // Font & Size
    html = html.replace(/\{\{font:(.+?)\}\}(.+?)\{\{\/font\}\}/g, '<span style="font-family:$1, sans-serif">$2</span>');
    html = html.replace(/\{\{size:(.+?)\}\}(.+?)\{\{\/size\}\}/g, (match, size, content) => {
        const sizeMap = { 'small': '0.875rem', 'normal': '1rem', 'large': '1.25rem', 'huge': '1.5rem' };
        return `<span style="font-size:${sizeMap[size] || size}">$2</span>`;
    });

    // Formatting
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    html = html.replace(/__(.+?)__/g, '<u>$1</u>');
    html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>');

    // Convert newlines to breaks if not in block
    html = html.replace(/\n/g, '<br />');
    
    // Cleanup double breaks
    html = html.replace(/(<br \/>){3,}/g, '<br /><br />');

    return html;
  };

  // Fetch emails and group into conversations
  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}${API_BASE}/emails`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Handle different response formats
      const emailList = res.data.emails || res.data || [];
      
      // Group emails by threadId into conversations
      const conversationMap = {};
      emailList.forEach(email => {
        const threadKey = email.threadId || email.id;
        if (!conversationMap[threadKey]) {
          conversationMap[threadKey] = {
            id: threadKey,
            emails: [],
            lastMessage: email,
            unreadCount: 0
          };
        }
        conversationMap[threadKey].emails.push(email);
        if (email.isUnread || !email.isRead) {
          conversationMap[threadKey].unreadCount++;
        }
        // Update lastMessage if this email is newer
        if (new Date(email.createdAt) > new Date(conversationMap[threadKey].lastMessage.createdAt)) {
          conversationMap[threadKey].lastMessage = email;
        }
      });
      
      // Convert to array and sort by last message date
      const convArray = Object.values(conversationMap).sort((a, b) => 
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
      );
      
      setConversations(convArray);
    } catch (err) {
      console.error('Error fetching emails:', err);
      // Demo data
      setConversations([
        {
          id: 'demo-1',
          emails: [
            { id: '1', from: 'admin@kangqore.com', to: 'user@email.com', subject: 'Welcome to Kangqore', body: 'Thank you for joining our platform!', direction: 'outbound', createdAt: new Date().toISOString(), isRead: false }
          ],
          lastMessage: { subject: 'Welcome to Kangqore', body: 'Thank you for joining our platform!', createdAt: new Date().toISOString(), direction: 'outbound' },
          unreadCount: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Filter conversations based on folder
  useEffect(() => {
    if (!conversations.length) {
      setFilteredConversations([]);
      return;
    }
    
    const prefix = getRoleFieldPrefix();
    const folderField = `${prefix}Folder`;
    const starredField = `is${prefix.charAt(0).toUpperCase() + prefix.slice(1)}Starred`;
    const importantField = `is${prefix.charAt(0).toUpperCase() + prefix.slice(1)}Important`;
    
    let filtered = [];
    switch (activeFolder) {
      case 'SENT':
        filtered = conversations.filter(c => c.lastMessage?.direction === 'inbound'); // User sent = inbound to admin
        break;
      case 'STARRED':
        filtered = conversations.filter(c => c.emails?.some(e => e[starredField]));
        break;
      case 'IMPORTANT':
        filtered = conversations.filter(c => c.emails?.some(e => e[importantField]));
        break;
      case 'SPAM':
        filtered = conversations.filter(c => c.emails?.some(e => e[folderField] === 'SPAM'));
        break;
      case 'TRASH':
        filtered = conversations.filter(c => c.emails?.some(e => e[folderField] === 'TRASH'));
        break;
      case 'DRAFTS':
        filtered = conversations.filter(c => c.emails?.some(e => e[folderField] === 'DRAFTS'));
        break;
      case 'IMMUTABLE': // Gap 6
        filtered = conversations.filter(c => c.emails?.some(e => e.isImmutable));
        break;
      case 'INBOX':
      default:
        filtered = conversations.filter(c => 
          !c.emails?.some(e => e[folderField] === 'SPAM' || e[folderField] === 'TRASH')
        );
        break;
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.lastMessage?.subject?.toLowerCase().includes(q) ||
        c.lastMessage?.body?.toLowerCase().includes(q)
      );
    }
    
    setFilteredConversations(filtered);
  }, [conversations, activeFolder, searchQuery, role]);

  // Load thread for a conversation
  const loadThread = (conversation) => {
    setSelectedConversation(conversation);
    // Sort emails by date
    const sortedEmails = [...(conversation.emails || [])].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
    setThread(sortedEmails);
    setReplyMode(false);
    setReplyText('');
  };

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
        
        const res = await axios.post(`${API_URL}/api/uploads`, formData, {
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
      if (replyFileInputRef.current) replyFileInputRef.current.value = '';
    }
  };

  // Send new email
  const handleSend = async () => {
    if (!composeData.subject.trim() || !composeData.body.trim()) {
      alert('Please fill in subject and body');
      return;
    }
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}${API_BASE}/emails/reply`, {
        subject: composeData.subject,
        content: composeData.body,
        body: composeData.body,
        attachments: attachments.map(a => a.url)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCompose(false);
      setComposeData({ subject: '', body: '' });
      setAttachments([]);
      setSuccessMessage('✅ Message sent to Kangqore Support!');
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchEmails();
    } catch (err) {
      console.error('Error sending email:', err);
      alert('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  // Reply to thread
  const handleReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;
    
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const lastEmail = thread[thread.length - 1];
      
      const res = await axios.post(`${API_URL}${API_BASE}/emails/reply`, {
        emailId: lastEmail?.id,
        content: replyText,
        body: replyText,
        attachments: attachments.map(a => a.url)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Add to thread
      const newEmail = res.data.email || {
        id: Date.now().toString(),
        from: 'me',
        body: replyText,
        direction: 'inbound',
        createdAt: new Date().toISOString()
      };
      setThread(prev => [...prev, newEmail]);
      setReplyText('');
      setReplyMode(false);
      setAttachments([]);
      setSuccessMessage('✅ Reply sent!');
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchEmails();
    } catch (err) {
      console.error('Error sending reply:', err);
      // Demo mode - still add the message
      const demoReply = {
        id: `reply-${Date.now()}`,
        from: 'me',
        body: replyText,
        direction: 'inbound',
        createdAt: new Date().toISOString()
      };
      setThread(prev => [...prev, demoReply]);
      setReplyText('');
      setReplyMode(false);
      setSuccessMessage('✅ Reply sent!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } finally {
      setSending(false);
    }
  };

  // Handle email actions (star, important, etc.)
  const handleEmailAction = async (action, value) => {
    if (!thread.length) return;
    const token = localStorage.getItem('token');
    const emailId = thread[0]?.id;
    
    try {
      if (action === 'star' || action === 'important') {
        await axios.patch(`${API_URL}${API_BASE}/emails/${emailId}/flags`, {
          starred: action === 'star' ? value : undefined,
          important: action === 'important' ? value : undefined
        }, { headers: { Authorization: `Bearer ${token}` } });
      } else if (action === 'move') {
        await axios.patch(`${API_URL}${API_BASE}/emails/${emailId}/folder`, {
          folder: value
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      
      fetchEmails();
      setSuccessMessage('✅ Action updated!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      if (action === 'move' && ['SPAM', 'TRASH'].includes(value)) {
        setSelectedConversation(null);
      }
    } catch (err) {
      console.error('Action failed', err);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    if (isToday) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Folder configuration
  const folders = [
    { id: 'INBOX', label: 'Inbox', icon: Inbox },
    { id: 'IMMUTABLE', label: 'Formal Notices', icon: Shield }, // Gap 6
    { id: 'SENT', label: 'Sent', icon: Send },
    { id: 'DRAFTS', label: 'Drafts', icon: FileText },
    { divider: true },
    { id: 'STARRED', label: 'Starred', icon: Star },
    { id: 'IMPORTANT', label: 'Important', icon: AlertCircle },
    { id: 'SPAM', label: 'Spam', icon: Flag },
    { id: 'TRASH', label: 'Trash', icon: Trash2 }
  ];

  const prefix = getRoleFieldPrefix();
  const starredField = `is${prefix.charAt(0).toUpperCase() + prefix.slice(1)}Starred`;
  const importantField = `is${prefix.charAt(0).toUpperCase() + prefix.slice(1)}Important`;

  return (
    <div className="h-full">
      {/* Success Toast */}
      {successMessage && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-800 text-sm">
          <span className="text-lg">✅</span>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex h-[calc(100vh-200px)] min-h-[600px]">
        {/* Sidebar - Folders */}
        <div className="w-64 border-r border-gray-100 flex flex-col bg-gray-50 dark:bg-gray-800 dark:border-gray-700/30">
          {/* Compose Button */}
          <div className="px-2 py-4">
            <button
              onClick={() => setShowCompose(true)}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all"
            >
              <Plus className="w-5 h-5" />
              Compose Mail
            </button>
          </div>

          {/* Folder List */}
          <nav className="flex-1 px-2">
            {folders.map((folder, idx) => 
              folder.divider ? (
                <div key={idx} className="my-2 border-t border-gray-200" />
              ) : (
                <button
                  key={folder.id}
                  onClick={() => {
                    setActiveFolder(folder.id);
                    setSelectedConversation(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1 transition-all ${
                    activeFolder === folder.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                >
                  <folder.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{folder.label}</span>
                </button>
              )
            )}
          </nav>
        </div>

        {/* Conversations List */}
        <div className={`${selectedConversation ? 'hidden md:block md:w-1/3' : 'flex-1'} border-r border-gray-100 flex flex-col`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 capitalize">
              <Inbox className="w-5 h-5" /> {activeFolder.toLowerCase()}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {loading && <div className="p-8 text-center text-gray-400">Loading...</div>}
            {!loading && filteredConversations.length === 0 && (
              <div className="p-8 text-center">
                <Mail className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No items in {activeFolder.toLowerCase()}</p>
              </div>
            )}
            {filteredConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => loadThread(conv)}
                className={`w-full p-4 text-left border-b border-gray-50 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">Kangqore Support</span>
                      <span className="text-xs text-gray-400">{formatDate(conv.lastMessage?.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate flex items-center gap-2">
                        {conv.emails?.some(e => e.isImmutable) && <Shield className="w-3 h-3 text-purple-600 fill-current" />}
                        {conv.lastMessage?.subject || '(No Subject)'}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage?.body?.substring(0, 50)}...</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{conv.unreadCount}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Thread View */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Kangqore Support</h3>
                  <p className="text-xs text-gray-500">admin@kangqore.com</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleEmailAction('important', !thread.some(e => e[importantField]))}
                  className={`p-2 rounded-lg transition-colors ${thread.some(e => e[importantField]) ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:bg-white dark:bg-black hover:text-orange-500'}`} 
                  title="Mark as Important"
                >
                  <AlertCircle className={`w-5 h-5 ${thread.some(e => e[importantField]) ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={() => handleEmailAction('star', !thread.some(e => e[starredField]))}
                  className={`p-2 rounded-lg transition-colors ${thread.some(e => e[starredField]) ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-white dark:bg-black hover:text-yellow-500'}`} 
                  title="Star Thread"
                >
                  <Star className={`w-5 h-5 ${thread.some(e => e[starredField]) ? 'fill-current' : ''}`} />
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

            {/* Messages - Chat Bubbles */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#050505]/30">
              {threadLoading && <div className="text-center py-8 text-gray-400">Loading thread...</div>}
              {thread.map(email => (
                <div key={email.id} className={`flex ${email.direction === 'inbound' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${email.direction === 'inbound' ? 'order-2' : 'order-1'}`}>
                    <div className={`p-3 rounded-2xl ${
                      email.direction === 'inbound' 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 text-gray-800 dark:text-gray-50 rounded-bl-sm shadow-sm'
                    }`}>
                      {email.subject && <p className="text-xs font-medium mb-1 opacity-80">{email.subject}</p>}
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
                                email.direction === 'inbound' 
                                  ? 'bg-white dark:bg-gray-900 dark:border-gray-800/10 border-white/20 hover:bg-white dark:bg-gray-900 dark:border-gray-800/20' 
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  email.direction === 'inbound' ? 'bg-white dark:bg-black/20' : 'bg-blue-100'
                                }`}>
                                  <FileText className={`w-4 h-4 ${email.direction === 'inbound' ? 'text-white' : 'text-blue-600'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-medium truncate ${email.direction === 'inbound' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{name}</p>
                                  <p className={`text-[10px] ${email.direction === 'inbound' ? 'text-white/70' : 'text-gray-400'}`}>Click to download</p>
                                </div>
                                <Download className={`w-4 h-4 ${email.direction === 'inbound' ? 'text-white/70' : 'text-gray-400'}`} />
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-2 mt-1 ${email.direction === 'inbound' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] text-gray-400">{email.direction === 'inbound' ? 'You' : 'Kangqore'}</span>
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

            {/* Reply Area */}
            <div className="p-4 border-t border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800">
              {replyMode ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reply to Kangqore Support</span>
                    <button onClick={() => { setReplyMode(false); setReplyText(''); setAttachments([]); }} className="p-1 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all bg-white dark:bg-gray-900 dark:border-gray-800 relative">
                    <RichTextEditor
                       value={replyText}
                       onChange={setReplyText}
                       onSend={handleReply}
                       onAttach={() => replyFileInputRef.current?.click()}
                       placeholder="Type your reply..."
                    />
                    
                    {/* Hidden inputs for attachments */}
                    <input
                        type="file"
                        ref={replyFileInputRef}
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
                    <p className="text-xs text-gray-400">Your message will be sent to Kangqore Support</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyMode(true)}
                  className="w-full py-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Send className="w-4 h-4" />
                  Reply to Kangqore Support
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

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">New Message to Kangqore Support</h3>
              <button onClick={() => { setShowCompose(false); setComposeData({ subject: '', body: '' }); setAttachments([]); }} className="p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="p-4 space-y-4">
              {/* To (Fixed) */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">To</label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  Kangqore Support (admin@kangqore.com)
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subject</label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter subject..."
                  className="mt-1 w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Message</label>
                <div className="mt-1 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 relative">
                  <RichTextEditor
                     value={composeData.body}
                     onChange={(val) => setComposeData(prev => ({ ...prev, body: val }))}
                     onSend={handleSend}
                     onAttach={() => fileInputRef.current?.click()}
                     placeholder="Type your message..."
                     isCompose={true}
                  />

                  {/* Hidden inputs for attachments */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                  />
                  
                  {/* Attachments preview moved to bottom of editor container or overlay */}
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
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 flex justify-end gap-3">
              <button
                onClick={() => { setShowCompose(false); setComposeData({ subject: '', body: '' }); setAttachments([]); }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!composeData.subject.trim() || !composeData.body.trim() || sending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailClient;
