import React, { useEffect, useState } from 'react';
import SchemaInjector from './SchemaInjector';
import { buildFAQPage } from '../registry/schemaBuilders';

const FaqBlock = ({ blueprintId, category, title = 'Frequently Asked Questions' }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (blueprintId) params.set('blueprintId', blueprintId);
    if (category) params.set('category', category);
    fetch(`/api/kangqore-vis/answerability/faqs?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : { faqs: [] }))
      .then((data) => setItems(data?.faqs ?? []))
      .catch(() => setItems([]));
  }, [blueprintId, category]);

  if (!items.length) return null;
  const faqSchema = buildFAQPage(items.map((f) => ({ question: f.question, answer: f.answer })));

  return (
    <>
      <SchemaInjector schemas={faqSchema} />
      <section className="mt-12">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
        <dl className="space-y-4">
          {items.map((faq) => (
            <div key={faq.id} className="border-b border-gray-200 pb-4">
              <dt className="font-medium text-gray-900 dark:text-white">{faq.question}</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
};

export default FaqBlock;
