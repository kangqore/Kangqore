import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { MessageSquare, Send, Paperclip, Search, FileText, X, Bot } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

// Reusing the logic from ClientMessages but wrapped in Investor Layout
const InvestorMessages = () => {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
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
      const res = await axios.get(`${BACKEND_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const finalContent = inputText.trim() || (attachments.length > 0 ? 'Sent an attachment' : '');
    
    if (!finalContent && attachments.length === 0) return;

    // Optimistic Update
    const optimisticMsg = {
        id: Date.now().toString(),
        content: finalContent,
        senderId: currentUser.id,
        receiverId: null, // To Admin
        attachments: attachments,
        createdAt: new Date().toISOString(),
        sender: { ...currentUser } // minimal user obj
    };

    setMessages(prev => [...prev, optimisticMsg]);
    const payload = { content: finalContent, attachments: attachments, receiverId: null };
    setInputText('');
    setAttachments([]);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/messages`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages(); // Sync
    } catch (error) {
      console.error('Failed to send:', error);
      alert('Failed to send message');
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

  return (
    <DashboardLayout role="investor" title="Messages" subtitle="Direct line to Investor Relations">
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-220px)] flex">
        
        {/* Sidebar (Simplified for Client/Investor) */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50">
          <div className="p-4 border-b border-gray-200">
             <h2 className="font-semibold text-gray-700 dark:text-gray-300">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <button className="w-full p-4 flex items-start gap-3 bg-white dark:bg-gray-900 dark:border-gray-800 border-l-4 border-l-brand-blue shadow-sm">
                 <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-brand-blue" />
                 </div>
                 <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">Admin Support</span>
                        <span className="text-xs text-gray-500">Now</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                        {messages.length > 0 ? messages[messages.length - 1].content : 'Start a conversation...'}
                    </p>
                 </div>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-black">
           {/* Header */}
           <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white dark:bg-gray-900 dark:border-gray-800">
               <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                   <Bot className="w-6 h-6 text-brand-blue" />
               </div>
               <div>
                   <h3 className="font-bold text-gray-900 dark:text-white">Admin Support</h3>
                   <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                       <span className="text-xs text-gray-500">Online</span>
                   </div>
               </div>
           </div>

           {/* Messages List */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#050505]/30">
               {messages.map((msg) => {
                   const isMe = msg.senderId === currentUser.id;
                   return (
                       <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                               isMe ? 'bg-gray-200' : 'bg-brand-blue text-white'
                           }`}>
                               {isMe ? <span className="text-xs font-bold text-gray-600 dark:text-gray-400">ME</span> : <Bot className="w-5 h-5" />}
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
                               <div className={`p-3 rounded-2xl ${
                                   isMe 
                                     ? 'bg-blue-600 text-white rounded-br-none' 
                                     : 'bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-800 dark:text-gray-50 rounded-bl-none shadow-sm'
                                 }`}>
                                   <p className="text-sm">{msg.content}</p>
                               </div>
                               <span className="text-[10px] text-gray-400 mt-1 block">
                                 {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </span>
                           </div>
                       </div>
                   )
               })}
               <div ref={messagesEndRef} />
           </div>

           {/* Input Area */}
           <div className="p-4 border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
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

               <form onSubmit={handleSendMessage} className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-full transition-colors"
                     >
                        <Paperclip className="w-5 h-5" />
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
                       value={inputText}
                       onChange={(e) => setInputText(e.target.value)}
                       className="flex-1 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 border-0 rounded-lg px-4 focus:ring-2 focus:ring-brand-blue outline-none"
                       placeholder="Type your message..."
                   />
                   <button 
                       type="submit"
                       disabled={!inputText.trim() && attachments.length === 0}
                       className="p-2 bg-brand-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                   >
                       <Send className="w-5 h-5" />
                   </button>
               </form>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvestorMessages;
