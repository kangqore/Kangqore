import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, DollarSign, FileText, ExternalLink, XCircle, Search, User, Linkedin, Github, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const JobApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [stats, setStats] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    fetchApplications();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const url = filter === 'all' 
        ? `${BACKEND_URL}/api/careers/applications`
        : `${BACKEND_URL}/api/careers/applications?status=${filter.toUpperCase()}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/careers/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${BACKEND_URL}/api/careers/applications/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      RECEIVED: 'bg-blue-100 text-blue-700',
      REVIEWING: 'bg-yellow-100 text-yellow-700',
      SHORTLISTED: 'bg-purple-100 text-purple-700',
      INTERVIEWING: 'bg-indigo-100 text-indigo-700',
      OFFERED: 'bg-green-100 text-green-700',
      ACCEPTED: 'bg-emerald-100 text-emerald-700',
      REJECTED: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/dashboard/admin?tab=management"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Job Applications</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage candidate applications and hiring pipeline</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-blue-700 mb-1">Received</p>
              <p className="text-2xl font-bold text-blue-900">{stats.received}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-yellow-700 mb-1">Reviewing</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.reviewing}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-purple-700 mb-1">Shortlisted</p>
              <p className="text-2xl font-bold text-purple-900">{stats.shortlisted}</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-indigo-700 mb-1">Interviewing</p>
              <p className="text-2xl font-bold text-indigo-900">{stats.interviewing}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-green-700 mb-1">Offered</p>
              <p className="text-2xl font-bold text-green-900">{stats.offered}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-emerald-700 mb-1">Accepted</p>
              <p className="text-2xl font-bold text-emerald-900">{stats.accepted}</p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['all', 'received', 'reviewing', 'shortlisted', 'interviewing', 'offered', 'accepted', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize whitespace-nowrap ${
                    filter === status
                      ? 'bg-brand-gradient text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-black divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 dark:bg-[#050505]">
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <p className="font-medium text-gray-900 dark:text-white">{application.name}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Mail className="w-4 h-4" />
                            {application.email}
                          </div>
                          {application.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-4 h-4" />
                              {application.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white font-medium">{application.position}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {application.experience || <span className="text-gray-400">Not specified</span>}
                      </td>
                      <td className="px-6 py-4">
                        {application.location ? (
                          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {application.location}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>  
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="text-brand-blue hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Application Details</h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-400"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Candidate Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Candidate Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-gray-900 dark:text-white font-medium">{selectedApplication.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900 dark:text-white">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900 dark:text-white">{selectedApplication.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Position Applied</label>
                        <p className="text-gray-900 dark:text-white font-medium">{selectedApplication.position}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Professional Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Experience</label>
                        <p className="text-gray-900 dark:text-white">{selectedApplication.experience || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Location</label>
                        <p className="text-gray-900 dark:text-white">{selectedApplication.location || 'Not specified'}</p>
                      </div>
                      {selectedApplication.expectedSalary && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Expected Salary</label>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-900 dark:text-white">{selectedApplication.expectedSalary}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Links & Documents</h3>
                    <div className="space-y-2">
                      {selectedApplication.resumeUrl && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#050505] rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-brand-blue" />
                            <span className="text-gray-900 dark:text-white font-medium">Resume</span>
                          </div>
                          <a
                            href={selectedApplication.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-blue hover:text-blue-800 flex items-center gap-1"
                          >
                            View <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                      {selectedApplication.linkedin && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#050505] rounded-lg">
                          <div className="flex items-center gap-2">
                            <Linkedin className="w-5 h-5 text-brand-blue" />
                            <span className="text-gray-900 dark:text-white font-medium">LinkedIn</span>
                          </div>
                          <a
                            href={selectedApplication.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-blue hover:text-blue-800 flex items-center gap-1"
                          >
                            View <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                      {selectedApplication.github && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#050505] rounded-lg">
                          <div className="flex items-center gap-2">
                            <Github className="w-5 h-5 text-gray-900 dark:text-white" />
                            <span className="text-gray-900 dark:text-white font-medium">GitHub</span>
                          </div>
                          <a
                            href={selectedApplication.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-blue hover:text-blue-800 flex items-center gap-1"
                          >
                            View <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                      {selectedApplication.portfolio && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#050505] rounded-lg">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-5 h-5 text-purple-600" />
                            <span className="text-gray-900 dark:text-white font-medium">Portfolio</span>
                          </div>
                          <a
                            href={selectedApplication.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-blue hover:text-blue-800 flex items-center gap-1"
                          >
                            View <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {selectedApplication.coverLetter && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Cover Letter</h3>
                      <div className="p-4 bg-gray-50 dark:bg-[#050505] rounded-lg">
                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                      </div>
                    </div>
                  )}

                  {/* Status Update */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {['RECEIVED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'ACCEPTED', 'REJECTED'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            updateStatus(selectedApplication.id, status);
                            setSelectedApplication(null);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium text-sm ${
                            selectedApplication.status === status
                              ? getStatusColor(status)
                              : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-4 border-t">
                    <p>Application ID: {selectedApplication.id}</p>
                    <p>Submitted: {new Date(selectedApplication.createdAt).toLocaleString()}</p>
                    <p>Source: {selectedApplication.source || 'careers-page'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsManagement;
