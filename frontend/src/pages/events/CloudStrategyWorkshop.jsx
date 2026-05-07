import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { eventsData } from '../../data/contentData';

const CloudStrategyWorkshop = () => {
  const event = eventsData.find(e => e.slug === 'cloud-strategy-workshop');
  const eventIndex = eventsData.findIndex(e => e.slug === 'cloud-strategy-workshop');
  
  const previousEvent = eventIndex > 0 ? eventsData[eventIndex - 1] : null;
  const nextEvent = eventIndex < eventsData.length - 1 ? eventsData[eventIndex + 1] : null;
  
  const relatedContent = eventsData
    .filter(e => e.slug !== 'cloud-strategy-workshop')
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
      author="Kangqore Cloud Practice"
      authorRole="Workshop Team"
      authorBio="Our cloud experts deliver strategic workshops helping organizations develop effective cloud adoption strategies."
      featuredImage={event.image}
      tags={[event.type, event.format, 'Past Event']}
      previousContent={previousEvent ? { title: previousEvent.title, link: `/events/${previousEvent.slug}` } : null}
      nextContent={nextEvent ? { title: nextEvent.title, link: `/events/${nextEvent.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{event.description}</p>

      <div className="bg-gray-100 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-xl p-6 mb-10">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">This event has concluded</p>
          <button className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors">
            Download Materials
          </button>
        </div>
      </div>

      <h2>Workshop Summary</h2>
      <p>This workshop helped participants develop comprehensive cloud strategies aligned with business objectives.</p>

      <h2>Topics Covered</h2>
      <ul>
        <li>Cloud platform evaluation and selection</li>
        <li>Migration planning and prioritization</li>
        <li>Cost optimization strategies</li>
        <li>Security and compliance considerations</li>
      </ul>
    </ContentDetailLayout>
  );
};

export default CloudStrategyWorkshop;
