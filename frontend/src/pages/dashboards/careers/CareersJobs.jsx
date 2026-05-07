import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { Briefcase, MapPin, Building2, Search, Filter, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareersJobs = () => {
    // ... existing state ...
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Mock fetch or real fetch
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard/careers/jobs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
           const data = await res.json();
           setJobs(data.jobs || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(filter.toLowerCase()) ||
    job.department?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <DashboardLayout role="job_seeker" title="Jobs" subtitle="Explore open positions">
      <div className="space-y-6">
        {/* Public Portal Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between shadow-lg">
           <div>
              <h2 className="text-xl font-bold mb-1">Looking for more opportunities?</h2>
              <p className="text-purple-100 text-sm">View our full list of openings on our public career site.</p>
           </div>
           <Link to="/careers" className="px-5 py-2.5 bg-white dark:bg-gray-900 dark:border-gray-800 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2">
              Visit Career Site
              <ExternalLink className="w-4 h-4" />
           </Link>
        </div>

      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100">
        {/* Search & Filter */}
        <div className="flex gap-4 mb-6">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by role or department..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
           </div>
           <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4" /> Filters
           </button>
        </div>

        {/* Job List */}
        {loading ? (
           <div className="text-center py-10 text-gray-500">Loading jobs...</div>
        ) : filteredJobs.length > 0 ? (
           <div className="grid gap-4">
              {filteredJobs.map((job, i) => (
                 <div key={i} className="p-4 border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all flex items-center justify-between group">
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Briefcase className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                          <div className="flex gap-4 text-sm text-gray-500 mt-1">
                             <span className="flex items-center gap-1"><Building2 className="w-3 h-3"/> {job.department}</span>
                             <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location}</span>
                          </div>
                       </div>
                    </div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                       Apply Now
                    </button>
                 </div>
              ))}
           </div>
        ) : (
           <div className="text-center py-12 text-gray-500">
              <p>No jobs found matching your criteria.</p>
           </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  );
};

export default CareersJobs;
