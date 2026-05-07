import React from 'react';
import ContentDetailLayout from '../../components/ContentDetailLayout';
import { eventsData } from '../../data/contentData';

const AiSummit2025 = () => {
  const event = eventsData.find(e => e.slug === 'ai-summit-2025');
  const eventIndex = eventsData.findIndex(e => e.slug === 'ai-summit-2025');
  
  const previousEvent = eventIndex > 0 ? eventsData[eventIndex - 1] : null;
  const nextEvent = eventIndex < eventsData.length - 1 ? eventsData[eventIndex + 1] : null;
  
  const relatedContent = eventsData
    .filter(e => e.slug !== 'ai-summit-2025')
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
      authorBio="Our events bring together industry leaders, practitioners, and innovators to share insights and explore emerging trends in enterprise technology."
      featuredImage={event.image}
      tags={[event.type, event.format, event.location]}
      previousContent={previousEvent ? { title: previousEvent.title, link: `/events/${previousEvent.slug}` } : null}
      nextContent={nextEvent ? { title: nextEvent.title, link: `/events/${nextEvent.slug}` } : null}
      relatedContent={relatedContent}
    >
      <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{event.description}</p>

      {/* Event Details Banner */}
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

      <h2>Event Overview</h2>
      <p>
        Join industry leaders and technology practitioners at the AI Summit 2025, a premier gathering focused on the practical application of artificial intelligence in enterprise environments. This event brings together C-suite executives, technology architects, and AI practitioners to explore the latest developments and share implementation insights.
      </p>

      <h2>What You'll Learn</h2>
      <ul>
        <li><strong>AI Strategy:</strong> How leading organizations are positioning AI for competitive advantage</li>
        <li><strong>Implementation Patterns:</strong> Proven approaches for moving AI from pilot to production</li>
        <li><strong>Governance Frameworks:</strong> Best practices for responsible AI deployment</li>
        <li><strong>Use Cases:</strong> Real-world examples from financial services, healthcare, and manufacturing</li>
      </ul>

      <h2>Featured Speakers</h2>
      <p>
        Our speaker lineup includes Fortune 500 CIOs, leading AI researchers, and practitioners who have successfully scaled AI initiatives across global enterprises.
      </p>

      <h2>Agenda Highlights</h2>
      <h3>Morning Sessions</h3>
      <ul>
        <li>Keynote: The State of Enterprise AI in 2025</li>
        <li>Panel: AI Governance and Risk Management</li>
        <li>Case Study: Banking Transformation with AI</li>
      </ul>

      <h3>Afternoon Sessions</h3>
      <ul>
        <li>Workshop: Building Scalable AI Platforms</li>
        <li>Panel: Talent and Organizational Readiness</li>
        <li>Closing Keynote: The Future of AI in Enterprise</li>
      </ul>

      <h2>Who Should Attend</h2>
      <ul>
        <li>Chief Technology Officers and Chief Information Officers</li>
        <li>VP/Directors of Data & Analytics</li>
        <li>Enterprise Architects and Technical Leaders</li>
        <li>AI/ML Practitioners and Data Scientists</li>
      </ul>
    </ContentDetailLayout>
  );
};

export default AiSummit2025;
