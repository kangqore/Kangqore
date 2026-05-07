import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { eventsData } from '../../data/contentData';

const EnterpriseAiConference = () => {
  const event = eventsData.find(e => e.slug === 'enterprise-ai-conference');
  const eventIndex = eventsData.findIndex(e => e.slug === 'enterprise-ai-conference');
  
  const previousEvent = eventIndex > 0 ? eventsData[eventIndex - 1] : null;
  const nextEvent = eventIndex < eventsData.length - 1 ? eventsData[eventIndex + 1] : null;
  
  const relatedContent = eventsData
    .filter(e => e.slug !== 'enterprise-ai-conference')
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
      author="Kangqore AI Practice"
      authorRole="Conference Organizers"
      authorBio="Our AI practice hosts premier conferences focused on practical enterprise AI implementation."
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
            Access Materials
          </button>
        </div>
      </div>

      <h2>Conference Recap</h2>
      <p>The Enterprise AI Conference brought together AI practitioners and business leaders to share insights on scaling AI in enterprise environments.</p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Strategies for moving AI from pilot to production</li>
        <li>Building effective AI governance frameworks</li>
        <li>Addressing AI talent and skills challenges</li>
        <li>Measuring ROI from AI investments</li>
      </ul>
    </ContentDetailLayout>
  );
};

export default EnterpriseAiConference;
