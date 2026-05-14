import React from 'react';
import { BookOpen } from 'lucide-react';

const TITLES = {
  '00-company-profile': 'Company Profile',
  '01-departments': 'Departments',
  '02-services-catalog': 'Services',
  '03-case-studies': 'Case Studies',
  '04-faqs': 'FAQs',
  '05-pricing-logic': 'Engagement Models',
  '06-contact-and-handoff': 'Contact',
  '07-brand-voice': 'Brand Voice',
};

function prettifyChunkId(chunkId) {
  if (TITLES[chunkId]) return TITLES[chunkId];
  const [parent, section] = chunkId.split('#');
  const parentLabel = TITLES[parent] || parent;
  if (!section) return parentLabel;
  const sectionLabel = section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return `${parentLabel} · ${sectionLabel}`;
}

const CitationBadge = ({ chunkId }) => {
  // The user requested: "don't show the Sources on the answer"
  return null;
};

export default CitationBadge;
