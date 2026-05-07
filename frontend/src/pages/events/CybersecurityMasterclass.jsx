import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { eventsData } from '../../data/contentData';

const CybersecurityMasterclass = () => {
  const event = eventsData.find(e => e.slug === 'cybersecurity-masterclass');
  const eventIndex = eventsData.findIndex(e => e.slug === 'cybersecurity-masterclass');
  
  const previousEvent = eventIndex > 0 ? eventsData[eventIndex - 1] : null;
  const nextEvent = eventIndex < eventsData.length - 1 ? eventsData[eventIndex + 1] : null;
  
  const relatedContent = eventsData
    .filter(e => e.slug !== 'cybersecurity-masterclass')
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
      author="Kangqore Security Practice"
      authorRole="Security Experts"
      authorBio="Our security team delivers advanced training programs covering the latest threats, defense strategies, and compliance requirements."
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
            Register Now
          </button>
        </div>
      </div>

      <h2>Masterclass Overview</h2>
      <p>An intensive program covering advanced security topics including threat intelligence, incident response, and zero trust architecture implementation.</p>

      <h2>Curriculum</h2>
      <ul>
        <li>Advanced threat landscape and attack patterns</li>
        <li>Zero trust architecture implementation</li>
        <li>Security operations and incident response</li>
        <li>Cloud security best practices</li>
      </ul>
    </ContentDetailLayout>
  );
};

export default CybersecurityMasterclass;
