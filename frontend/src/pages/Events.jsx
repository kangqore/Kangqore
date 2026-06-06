import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Video, Users, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SEO from '../components/SEO';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Ensure we fetch events. We might want to sort by date, but API sort is mostly createdAt.
        // If we want real date sorting, we need backend support or client-side sort.
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/content?type=EVENT&limit=50`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data.items || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Helper to check if event is upcoming (naive check based on string date or metadata)
  // Ideally metadata.date should be ISO string.
  const isUpcoming = (event) => {
    const eventDate = event.metadata?.date ? new Date(event.metadata.date) : new Date(event.createdAt);
    return eventDate >= new Date();
  };

  const upcomingEvents = events.filter(e => isUpcoming(e));
  const pastEvents = events.filter(e => !isUpcoming(e));

  return (
    <div className="bg-white dark:bg-black">
      <SEO 
        title="Events & Conferences"
        description="Join Kangqore at upcoming global technology events, conferences, and workshops."
        keywords="tech events, AI conferences, cloud workshops, digital transformation events"
      />

      <PageHero
        badge="Events & Conferences"
        title="Join us at upcoming events,"
        titleHighlight="conferences, and workshops"
        description="Connect with industry leaders, learn from experts, and discover the latest in digital transformation, AI, and enterprise technology."
        primaryButton={{ text: 'Register Now', link: '#upcoming' }}
        secondaryButton={{ text: 'View Past Events', link: '#past' }}
        stats={[
          { value: '50+', label: 'Annual Events', color: 'text-cyan-400' },
          { value: '10K+', label: 'Attendees', color: 'text-blue-400' },
          { value: '100+', label: 'Expert Speakers', color: 'text-emerald-400' },
          { value: 'Global', label: 'Reach', color: 'text-purple-400' },
        ]}
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
             </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600">
               <p>Unable to load events at this time.</p>
            </div>
          ) : (
            <>
              <h2 id="upcoming" className="text-3xl font-bold mb-12">Upcoming Events</h2>
              {upcomingEvents.length === 0 ? (
                <div className="text-gray-500 mb-20 italic">No upcoming events scheduled. Check back soon.</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                  {upcomingEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.slug}`}
                      className="block"
                    >
                      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow group h-full">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-3 py-1 bg-blue-100 text-brand-blue text-sm font-medium rounded-full">{event.category || 'Event'}</span>
                          <span className="px-3 py-1 bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 text-sm font-medium rounded-full flex items-center gap-1">
                            {event.metadata?.format === 'Online' ? <Video className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                            {event.metadata?.format || 'In-Person'}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-brand-blue transition-colors">{event.title}</h3>
                        <div className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                          <div className="flex items-center gap-2">
                             <Calendar className="w-5 h-5" />
                             {event.metadata?.date || new Date(event.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                             <MapPin className="w-5 h-5" />
                             {event.metadata?.location || 'TBA'}
                          </div>
                        </div>
                        <span className="text-brand-blue font-semibold flex items-center gap-1">View Details <ArrowRight className="w-4 h-4" /></span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <h2 id="past" className="text-3xl font-bold mb-12">Past Events</h2>
              {pastEvents.length === 0 ? (
                 <div className="text-gray-500 italic">No past events found.</div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.slug}`}
                      className="block"
                    >
                      <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow group">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors">{event.title}</h4>
                        <p className="text-sm text-gray-500 mb-2">
                           {event.metadata?.date || new Date(event.createdAt).toLocaleDateString()}
                        </p>
                        {event.metadata?.attendees && (
                          <p className="text-sm text-brand-blue">{event.metadata.attendees} attendees</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </div>
  );
};

export default Events;