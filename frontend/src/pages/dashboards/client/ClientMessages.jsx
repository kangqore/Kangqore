import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { MessageSquare, Send, Paperclip, Search, MoreVertical, Phone, Video, User, FileText, Image as ImageIcon, X, Gavel, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const ClientMessages = ({ isTabContent = false }) => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState([]); // Array of strings (URLs)
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.messages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!inputText.trim() && attachments.length === 0) || isUploading) return;

    const finalContent = inputText.trim() || (attachments.length > 0 ? 'Sent an attachment' : '');
    
    if (!finalContent && attachments.length === 0) return;

    const payload = {
      content: finalContent,
      attachments: attachments
    };

    // Optimistic Update
    const tempId = Date.now().toString();
    const optimisticMsg = {
      id: tempId,
      content: inputText,
      senderId: currentUser.id,
      receiverId: null, // Admin
      attachments: attachments,
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl
      }
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setInputText('');
    setAttachments([]);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/messages`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages(); // Sync real data
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error? or show retry
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post(`${BACKEND_URL}/api/uploads`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        uploadedUrls.push(res.data.file?.url || res.data.url);
      }

      setAttachments(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const renderAttachment = (url) => {
    const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i);
    const fileName = url.split('/').pop();

    if (isImage) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-2">
            <img src={url} alt="attachment" className="max-w-[200px] max-h-[200px] rounded-lg border border-gray-200" />
        </a>
      );
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors">
        <FileText className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{fileName}</span>
      </a>
    );
  };

  // Group messages logic is simplified: Client only has ONE thread -> With Admin/Support
  // In future, if we allow direct Client-Client or Client-Partner, we need the sidebar back.
  // For now, let's keep the layout simple: Sidebar lists "Admin Support" only.

  const content = (
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-220px)] flex">
        
        {/* Sidebar List (Simplified for Single Thread) */}
        <div className="w-80 border-r border-gray-200 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
             {/* Admin Thread Item */}
             <button className="w-full p-4 flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20/50 border-r-4 border-brand-blue text-left transition-colors">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-brand-gradient rounded-full flex items-center justify-center text-white">
                     <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-brand-blue">Client Support</span>
                    <span className="text-xs text-gray-400">Now</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-1">
                    {messages.length > 0 ? messages[messages.length - 1].content : 'Start a conversation...'}
                  </p>
                </div>
             </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#050505]/30">
            {/* Header */}
            <div className="p-4 bg-white dark:bg-gray-900 dark:border-gray-800 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-brand-gradient rounded-full flex items-center justify-center text-white">
                    <MessageSquare className="w-5 h-5" />
                 </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Client Support</h3>
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                     <span className="text-xs text-gray-500">Always available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No messages yet</h3>
                    <p className="text-gray-500 max-w-sm">
                      Send a message to get in touch with our team. We usually reply within a few hours.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === currentUser?.id;
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                         <div className="flex-shrink-0">
                            {isMe ? (
                               currentUser?.avatarUrl ? (
                                 <img src={currentUser.avatarUrl} alt="Me" className="w-8 h-8 rounded-full" />
                               ) : (
                                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold">ME</div>
                               )
                            ) : (
                               <div className="w-8 h-8 bg-brand-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
                            )}
                         </div>
                         <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                            {/* Attachments */}
                            {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                               <div className={`mb-2 space-y-2 ${isMe ? 'flex flex-col items-end' : ''}`}>
                                  {msg.attachments.map((url, idx) => (
                                     <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-2 rounded-lg border border-gray-200">
                                        {renderAttachment(url)}
                                     </div>
                                  ))}
                               </div>
                            )}

                            {/* Context Tag (Rich) */}
                            {msg.contextType && (
                                <div className={`text-[10px] mb-1 font-bold flex items-center gap-1 ${isMe ? 'items-end justify-end' : ''}`}>
                                    <span className={`px-2 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1 ${
                                        msg.contextType.includes('Decision') ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                        msg.contextType.includes('Risk') ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-500 border-gray-200'
                                    }`}>
                                        {msg.contextType.includes('Decision') ? <Gavel className="w-3 h-3" /> : 
                                         msg.contextType.includes('Risk') ? <AlertTriangle className="w-3 h-3" /> : 
                                         <LinkIcon className="w-3 h-3" />}
                                        
                                        {msg.contextTitle ? `Ref: ${msg.contextTitle}` : `Re: ${msg.contextType}`}
                                    </span>
                                </div>
                            )}

                            {/* Text Content */}
                            {msg.content && (
                              <div className={`p-4 rounded-2xl ${
                                isMe 
                                  ? 'bg-brand-gradient text-white rounded-br-none' 
                                  : 'bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-800 dark:text-gray-50 rounded-bl-none shadow-sm'
                              }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            )}
                            
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                         </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 dark:border-gray-800 border-t border-gray-200">
              {/* Attachment Previews */}
              {attachments.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                  {attachments.map((url, idx) => (
                    <div key={idx} className="relative group shrink-0">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                         {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                            <img src={url} alt="preview" className="w-full h-full object-cover" />
                         ) : (
                            <FileText className="w-8 h-8 text-gray-400" />
                         )}
                      </div>
                      <button 
                         onClick={() => removeAttachment(idx)}
                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                         <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                 <button
                   type="button"
                   disabled={isUploading}
                   onClick={() => fileInputRef.current?.click()}
                   className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-full transition-colors relative"
                   title="Attach file"
                 >
                   <Paperclip className="w-5 h-5" />
                   {isUploading && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                   )}
                 </button>
                 <input 
                   type="file"
                   multiple
                   ref={fileInputRef}
                   className="hidden"
                   onChange={handleFileUpload}
                 />

                 <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type a message..." 
                      className="w-full pl-4 pr-10 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white dark:bg-gray-900 dark:border-gray-800 transition-all"
                    />
                 </div>

                 <button
                   type="submit"
                   disabled={(!inputText.trim() && attachments.length === 0) || isUploading}
                   className="p-3 bg-brand-gradient text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                 >
                   <Send className="w-5 h-5" />
                 </button>
              </form>
            </div>
        </div>
      </div>
  );

  if (isTabContent) return content;

  return (
    <DashboardLayout role="client" title="Messages" subtitle="Direct line to Admin Support">
      {content}
    </DashboardLayout>
  );
};

export default ClientMessages;
