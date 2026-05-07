import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Briefcase, FileText, Calendar, Users, Clock, CheckCircle, 
  Send, ArrowRight, RefreshCw, MapPin, Building2 
} from 'lucide-react';

const CareersDashboard = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      const [statsRes, applicationsRes, interviewsRes, jobsRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard/careers/stats`, { headers }),
        fetch(`${API_URL}/api/dashboard/careers/applications`, { headers }),
        fetch(`${API_URL}/api/dashboard/careers/interviews`, { headers }),
        fetch(`${API_URL}/api/dashboard/careers/jobs`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (applicationsRes.ok) setApplications((await applicationsRes.json()).applications || []);
      if (interviewsRes.ok) setInterviews((await interviewsRes.json()).interviews || []);
      if (jobsRes.ok) setJobs((await jobsRes.json()).jobs || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-700',
      under_review: 'bg-amber-100 text-amber-700',
      interview_scheduled: 'bg-purple-100 text-purple-700',
      offer_extended: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      accepted: 'bg-emerald-100 text-emerald-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout 
      role="job_seeker" 
      title="Careers Portal" 
      subtitle="Where do I stand and what's next?"
    >
      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg transition-colors"
          data-testid="refresh-dashboard-btn"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Hero Banner: Upcoming Interview */}
      <div className="mb-8">
        {loading ? (
           <div className="h-48 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl animate-pulse"></div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-8 shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                 {interviews.length > 0 ? (
                    <>
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-black/20 backdrop-blur-sm text-sm font-medium mb-3">
                          <Calendar className="w-4 h-4" />
                          Upcoming Interview
                       </div>
                       <h2 className="text-3xl font-bold mb-2">
                          {interviews[0].job_title} at {interviews[0].company || 'Kangqore'}
                       </h2>
                       <div className="flex flex-wrap items-center gap-4 text-purple-100">
                          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {formatDate(interviews[0].interview_date)}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {interviews[0].duration || '45 min'}</span>
                          <span className="flex items-center gap-1.5 capitalize"><Users className="w-4 h-4"/> {interviews[0].interview_type || 'Video Call'}</span>
                       </div>
                    </>
                 ) : (
                    <>
                       <h2 className="text-3xl font-bold mb-2">No Interviews Scheduled</h2>
                       <p className="text-purple-100 max-w-lg">
                          You don't have any upcoming interviews. Keep track of your application status below.
                       </p>
                    </>
                 )}
              </div>
              
              {interviews.length > 0 ? (
                 <button className="px-6 py-3 bg-white dark:bg-gray-900 dark:border-gray-800 text-purple-900 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg shadow-purple-900/20">
                    Join Meeting
                 </button>
              ) : (
                 <button className="px-6 py-3 bg-white dark:bg-gray-900 dark:border-gray-800/10 text-white rounded-xl font-medium hover:bg-white dark:bg-gray-900 dark:border-gray-800/20 transition-colors">
                    View Applications
                 </button>
              )}
            </div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm" data-testid="applications-sent-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1" data-testid="applications-sent-count">
            {loading ? '...' : stats?.applications_sent || 0}
          </h3>
          <p className="text-gray-500">Applied Jobs</p>
        </div>

        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm" data-testid="under-review-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-brand-blue" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1" data-testid="under-review-count">
            {loading ? '...' : stats?.under_review || 0}
          </h3>
          <p className="text-gray-500">In Review</p>
        </div>

        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm" data-testid="interviews-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1" data-testid="interviews-count">
             {loading ? '...' : (interviews.length > 0 ? interviews.length : (stats?.interviews_scheduled || 0))}
          </h3>
          <p className="text-gray-500">Interviews</p>
        </div>

        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm" data-testid="offers-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1" data-testid="offers-count">
            {loading ? '...' : stats?.offers_received || 0}
          </h3>
          <p className="text-gray-500">Offers</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm" data-testid="applications-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Applications</h2>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.slice(0, 5).map((app, index) => (
                <div 
                  key={app.id || index} 
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors"
                  data-testid={`application-item-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{app.job_title}</h4>
                      <p className="text-sm text-gray-500">{app.company || 'Kangqore'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(app.status)}`}>
                      {app.status?.replace('_', ' ')}
                    </span>
                    {app.applied_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Applications Yet</h3>
              <p className="text-gray-500 max-w-sm">Your job applications and their status will appear here.</p>
            </div>
          )}
        </div>

        {/* Jobs (Renamed from Open Positions) */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm" data-testid="jobs-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Latest Jobs</h2>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
              Browse <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.slice(0, 4).map((job, index) => (
                <div 
                  key={job.id || index} 
                  className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors cursor-pointer group"
                  data-testid={`job-item-${index}`}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">{job.title}</h4>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                    )}
                    <span>•</span>
                    <span className="capitalize">{job.type?.replace('_', ' ') || 'Full Time'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
               <div className="w-12 h-12 bg-gray-100 dark:bg-[#0a0a0c] rounded-full flex items-center justify-center mb-3">
                 <Briefcase className="w-6 h-6 text-gray-400" />
               </div>
               <p className="text-gray-500 text-sm">No open positions at this time</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CareersDashboard;
