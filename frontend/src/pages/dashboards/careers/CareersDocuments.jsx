import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { FileText, Download, Upload } from 'lucide-react';
import axios from 'axios';

const CareersDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/dashboard/careers/documents`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocuments(res.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [BACKEND_URL]);

  return (
    <DashboardLayout role="job_seeker" title="Documents" subtitle="Manage your career documents">
       <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h3 className="font-bold text-gray-900 dark:text-white">My Files</h3>
             {/* Upload handled in Profile for now */}
             {/* <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                <Upload size={16} /> Upload New
             </button> */}
          </div>
          
          <div className="divide-y divide-gray-100">
             {loading ? (
                <div className="p-8 text-center text-gray-500">Loading documents...</div>
             ) : documents.length > 0 ? (
                documents.map((doc, i) => (
                   <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:bg-[#050505] transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center">
                            <FileText size={20} />
                         </div>
                         <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{doc.title}</h4>
                            <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                               <span>{doc.type}</span>
                               <span>•</span>
                               <span>{new Date(doc.date).toLocaleDateString()}</span>
                            </div>
                         </div>
                      </div>
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-200 rounded-lg transition-colors"
                      >
                         <Download size={18} />
                      </a>
                   </div>
                ))
             ) : (
                <div className="p-12 text-center text-gray-500">
                   <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                   <p>No documents found. Documents from your applications will appear here.</p>
                </div>
             )}
          </div>
       </div>
    </DashboardLayout>
  );
};

export default CareersDocuments;
