import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Shield, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export default function TeamScheduling() {
  const { toast } = useToast();
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/scheduling/event-types`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEventTypes(response.data.eventTypes.filter(et => et.assignmentStrategy !== 'SINGLE_HOST'));
    } catch (error) {
      console.error('Failed to fetch event types', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-brand-blue" />
            Team Scheduling
          </h1>
          <p className="text-gray-500 mt-2">Manage round-robin, collective, and host-pick pools.</p>
        </div>
        <button className="px-6 py-2 bg-brand-gradient text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Team Event
        </button>
      </div>

      <div className="grid gap-6">
        {eventTypes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Team Events</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2">Create a new Round-Robin or Collective event type to start scheduling with your team.</p>
          </div>
        ) : (
          eventTypes.map(et => (
            <div key={et.id} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{et.name}</h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">
                    {et.assignmentStrategy.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {et.teamMembers?.length || 0} Team Members • {et.duration} min
                </p>
              </div>
              <button className="p-3 bg-gray-50 hover:bg-brand-blue/10 rounded-xl text-brand-blue transition-colors group">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
