import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { eventsData } from '../../data/contentData';

const CloudTransformationWorkshop = () => {
  const event = eventsData.find(e => e.slug === 'cloud-transformation-workshop');
  const eventIndex = eventsData.findIndex(e => e.slug === 'cloud-transformation-workshop');
  
  const previousEvent = eventIndex > 0 ? eventsData[eventIndex - 1] : null;
  const nextEvent = eventIndex < eventsData.length - 1 ? eventsData[eventIndex + 1] : null;
  
  const relatedContent = eventsData
    .filter(e => e.slug !== 'cloud-transformation-workshop')
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
      authorRole="Workshop Facilitators"
      authorBio="Our cloud experts deliver hands-on workshops that provide practical skills for cloud transformation initiatives."
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

      <h2>Workshop Overview</h2>
      <p>This hands-on workshop provides practical guidance for cloud migration and modernization. Participants will work through real-world scenarios and develop actionable plans for their organizations.</p>

      <h2>Learning Objectives</h2>
      <ul>
        <li>Cloud migration assessment and planning methodologies</li>
        <li>Multi-cloud architecture patterns and considerations</li>
        <li>Cost optimization and governance strategies</li>
        <li>Security and compliance frameworks for cloud environments</li>
      </ul>

      <h2>Workshop Format</h2>
      <p>Interactive exercises, case study discussions, and hands-on labs guided by experienced cloud architects.</p>
    </ContentDetailLayout>
  );
};

export default CloudTransformationWorkshop;
