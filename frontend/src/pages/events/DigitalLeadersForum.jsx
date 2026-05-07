import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { eventsData } from '../../data/contentData';

const DigitalLeadersForum = () => {
  const event = eventsData.find(e => e.slug === 'digital-leaders-forum');
  const eventIndex = eventsData.findIndex(e => e.slug === 'digital-leaders-forum');
  
  const previousEvent = eventIndex > 0 ? eventsData[eventIndex - 1] : null;
  const nextEvent = eventIndex < eventsData.length - 1 ? eventsData[eventIndex + 1] : null;
  
  const relatedContent = eventsData
    .filter(e => e.slug !== 'digital-leaders-forum')
    .slice(0, 4)
    .map(e => ({ title: e.title, link: `/events/${e.slug}`, date: e.date }));

  return (
    <ContentDetailLayout
      contentType="Event"
      backLink="/events"
      backLabel="Back to Events"
      title={event.title}
      publishDate={event.date}
      readTime={event.time}
      author="Kangqore Executive Programs"
      authorRole="Leadership Team"
      authorBio="Our executive forums bring together C-level leaders to discuss strategic challenges and emerging opportunities in digital transformation."
      featuredImage={event.image}
      tags={[event.type, event.format, event.location]}
      previousContent={previousEvent ? { title: previousEvent.title, link: `/events/${previousEvent.slug}` } : null}
      nextContent={nextEvent ? { title: nextEvent.title, link: `/events/${nextEvent.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{event.description}</p>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-10">
        <div className="grid grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-sm text-orange-600 font-medium">Date</p>
            <p className="text-lg text-orange-800 font-semibold">{event.date}</p>
          </div>
          <div>
            <p className="text-sm text-orange-600 font-medium">Time</p>
            <p className="text-lg text-orange-800 font-semibold">{event.time}</p>
          </div>
          <div>
            <p className="text-sm text-orange-600 font-medium">Format</p>
            <p className="text-lg text-orange-800 font-semibold">{event.format}</p>
          </div>
          <div>
            <p className="text-sm text-orange-600 font-medium">Location</p>
            <p className="text-lg text-orange-800 font-semibold">{event.location}</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button className="px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors">
            Request Invitation
          </button>
        </div>
      </div>

      <h2>Forum Overview</h2>
      <p>An invitation-only gathering for senior technology executives to discuss digital strategy, transformation challenges, and emerging technologies in an intimate, peer-to-peer setting.</p>

      <h2>Discussion Topics</h2>
      <ul>
        <li>Digital transformation strategy and execution</li>
        <li>Technology investment prioritization</li>
        <li>Building high-performing technology organizations</li>
        <li>Navigating emerging technology landscape</li>
      </ul>

      <h2>Participation Criteria</h2>
      <p>This forum is designed for CIOs, CTOs, and SVPs of Technology at organizations with $1B+ revenue. Participation is by invitation only.</p>
    </ContentDetailLayout>
  );
};

export default DigitalLeadersForum;
