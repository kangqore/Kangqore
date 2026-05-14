import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Settings, 
  Copy, 
  ExternalLink, 
  Trash2, 
  Edit2, 
  Check, 
  Search, 
  Filter,
  User,
  Globe,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useToast } from '../../hooks/use-toast';

const SchedulingManagement = () => {
  const { toast } = useToast();
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('event-types'); // event-types, scheduled-events, availability

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/scheduling/event-types`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEventTypes(response.data.eventTypes);
    } catch (error) {
      console.error('Error fetching event types:', error);
      toast({
        title: "Error",
        description: "Failed to load event types",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (slug) => {
    const link = `${window.location.origin}/book/${slug}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Booking link copied to clipboard"
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Scheduling <span className="bg-brand-gradient bg-clip-text text-transparent">Ecosystem</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Manage your event types, availability, and bookings.</p>
          </div>
          
          <button 
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all"
            onClick={() => {/* TODO: Open Create Modal */}}
          >
            <Plus className="w-5 h-5" />
            New Event Type
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-px">
          {[
            { id: 'event-types', label: 'Event Types', icon: Calendar },
            { id: 'scheduled-events', label: 'Bookings', icon: Clock },
            { id: 'availability', label: 'Availability', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all relative ${
                activeTab === tab.id 
                ? 'text-brand-blue' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-brand-blue animate-spin mb-4" />
            <p className="text-gray-400 font-medium tracking-wide">Synchronizing your ecosystem...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTypes.map(type => (
              <div 
                key={type.id}
                className="group relative bg-white dark:bg-gray-900 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-500"
              >
                {/* Status indicator */}
                <div className="absolute top-6 right-6">
                  <div className={`w-2 h-2 rounded-full ${type.isActive ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <Clock className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{type.duration} mins • {type.locationType}</p>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                    {type.description || 'No description provided.'}
                  </p>

                  <div className="pt-6 flex items-center justify-between gap-3 border-t border-gray-50 dark:border-gray-800 mt-4">
                    <button 
                      onClick={() => copyLink(type.slug)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-brand-blue hover:text-white transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Link
                    </button>
                    
                    <button className="p-2 text-gray-400 hover:text-brand-blue transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State / Add Card */}
            <button className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] p-6 flex flex-col items-center justify-center text-gray-400 hover:border-brand-blue hover:text-brand-blue transition-all group min-h-[250px]">
              <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <p className="font-bold">Create Event Type</p>
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SchedulingManagement;
