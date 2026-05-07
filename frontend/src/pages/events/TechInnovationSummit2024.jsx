import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { eventsData } from '../../data/contentData';

const TechInnovationSummit2024 = () => {
  const event = eventsData.find(e => e.slug === 'tech-innovation-summit-2024');
  const eventIndex = eventsData.findIndex(e => e.slug === 'tech-innovation-summit-2024');
  
  const previousEvent = eventIndex > 0 ? eventsData[eventIndex - 1] : null;
  const nextEvent = eventIndex < eventsData.length - 1 ? eventsData[eventIndex + 1] : null;
  
  const relatedContent = eventsData
    .filter(e => e.slug !== 'tech-innovation-summit-2024')
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
      author="Kangqore Events"
      authorRole="Event Team"
      authorBio="Our flagship innovation summit brings together thought leaders to explore emerging technologies shaping enterprise futures."
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
            Watch Recordings
          </button>
        </div>
      </div>

      <h2>Event Recap</h2>
      <p>The Tech Innovation Summit 2024 brought together over 500 technology leaders to explore emerging trends in AI, cloud, and digital transformation. Key themes included responsible AI deployment, multi-cloud strategy, and building resilient technology organizations.</p>

      <h2>Highlights</h2>
      <ul>
        <li>Keynote addresses from Fortune 500 CIOs</li>
        <li>Panel discussions on AI governance and ethics</li>
        <li>Case studies from successful digital transformation initiatives</li>
        <li>Networking sessions with industry peers</li>
      </ul>
    </ContentDetailLayout>
  );
};

export default TechInnovationSummit2024;
