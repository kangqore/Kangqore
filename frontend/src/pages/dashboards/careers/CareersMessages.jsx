import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { Send, Paperclip, FileText, X } from 'lucide-react';

const CareersMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  const messagesEndRef = React.useRef(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      // Use general messages endpoint
      const res = await axios.get(`${BACKEND_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // The general endpoint returns { messages: [] }
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll every 10s for new messages
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleSendMessage = async () => {
    const finalContent = newMessage.trim() || (attachments.length > 0 ? 'Sent an attachment' : '');
    
    if (!finalContent && attachments.length === 0) return;
    
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/messages`, {
        content: finalContent,
        attachments: attachments,
        // No receiverId needed for Job Seeker -> Admin
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewMessage('');
      setAttachments([]);
      fetchMessages(); // Refresh list immediately
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout role="job_seeker" title="Messages" subtitle="Chat with Recruitment Team">
       <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
             <h3 className="font-bold text-gray-900 dark:text-white">Recruitment Team</h3>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-gray-500">Online</span>
             </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-black">
             {loading && messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">Loading messages...</div>
             ) : messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                   <p>No messages yet. Start the conversation!</p>
                </div>
             ) : (
                messages.map(msg => {
                   // Identify if message is from me
                   const isMe = msg.sender?.role === 'JOB_SEEKER'; // Or match ID if available
                   
                   return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-gray-50 rounded-tl-none'}`}>
                            {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                               <div className={`mb-2 space-y-2 ${isMe ? 'flex flex-col items-end' : ''}`}>
                                  {msg.attachments.map((url, idx) => (
                                     <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-2 rounded-lg border border-gray-200 text-black">
                                        {renderAttachment(url)}
                                     </div>
                                  ))}
                               </div>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <span className={`text-[10px] mt-1 block opacity-70 ${isMe ? 'text-purple-100' : 'text-gray-400'}`}>
                               {new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                            </span>
                         </div>
                      </div>
                   );
                })
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          {/* Attachment Previews */}
          {attachments.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 px-4">
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

             <div className="flex gap-2 items-center">
                <button
                   disabled={isUploading}
                   onClick={() => fileInputRef.current?.click()}
                   className="p-3 text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-xl transition-colors relative"
                   title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                  {isUploading && (
                     <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
                  )}
                </button>
                <input 
                   type="file"
                   multiple
                   ref={fileInputRef}
                   className="hidden"
                   onChange={handleFileUpload}
                />
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..." 
                  className="flex-1 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={sending || (!newMessage.trim() && attachments.length === 0)}
                  className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]"
                >
                   <Send className="w-5 h-5" />
                </button>
             </div>
          </div>
       </div>

    </DashboardLayout>
  );
};
export default CareersMessages;
