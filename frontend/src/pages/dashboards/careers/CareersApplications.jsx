import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { ClipboardList, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

const CareersApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/careers/applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
           const data = await res.json();
           setApplications(data.applications || []);
        }
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    };
    fetchApps();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      submitted: 'bg-blue-100 text-blue-700',
      under_review: 'bg-amber-100 text-amber-700',
      interview_scheduled: 'bg-purple-100 text-purple-700',
      offer_extended: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      accepted: 'bg-emerald-100 text-emerald-700'
    };
    return (
       <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300'}`}>
          {status?.replace('_', ' ')}
       </span>
    );
  };

  return (
    <DashboardLayout role="job_seeker" title="Applications" subtitle="Track your progress">
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         {/* Head */}
         <div className="p-6 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white">Application History</h3>
         </div>
         
         {loading ? (
            <div className="p-8 text-center text-gray-500">Loading applications...</div>
         ) : applications.length > 0 ? (
            <div className="divide-y divide-gray-100">
               {applications.map((app, i) => (
                  <div key={i} className="p-6 hover:bg-gray-50 dark:bg-[#050505] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600">
                           <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                           <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{app.job_title}</h4>
                           <p className="text-gray-500 text-sm mb-1">{app.company || 'Kangqore'}</p>
                           <p className="text-xs text-gray-400">Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="text-right">
                           {getStatusBadge(app.status)}
                           <p className="text-xs text-gray-400 mt-2">Last updated {new Date(app.updated_at || app.applied_at).toLocaleDateString()}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="p-12 text-center text-gray-500">
               <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
               <p>You haven't applied to any jobs yet.</p>
            </div>
         )}
      </div>
    </DashboardLayout>
  );
};

export default CareersApplications;
