import React from 'react';
import { Quote, Star } from 'lucide-react';
import PageHero from '../components/PageHero';

const Testimonials = () => {
  const testimonials = [
    { quote: 'Kangqore transformed our digital infrastructure, resulting in 40% cost reduction and 3x faster deployment cycles.', author: 'James Miller', role: 'CTO, Fortune 500 Bank', rating: 5 },
    { quote: 'Their AI solutions helped us predict customer behavior with 95% accuracy, revolutionizing our marketing strategy.', author: 'Sarah Chen', role: 'VP Digital, Retail Giant', rating: 5 },
    { quote: 'The team\'s expertise in cloud migration was exceptional. Zero downtime during our entire transition.', author: 'Michael Brown', role: 'IT Director, Healthcare Corp', rating: 5 },
    { quote: 'Kangqore\'s agile approach delivered our product 2 months ahead of schedule with superior quality.', author: 'Emily Watson', role: 'Product Head, Tech Startup', rating: 5 },
    { quote: 'Their cybersecurity audit identified critical vulnerabilities we had missed for years. Truly thorough.', author: 'David Park', role: 'CISO, Financial Services', rating: 5 },
    { quote: 'Outstanding partnership. They don\'t just deliver code, they deliver business outcomes.', author: 'Lisa Thompson', role: 'CEO, InsurTech Company', rating: 5 },
  ];

  return (
    <div className="bg-white dark:bg-black">
      <PageHero
        badge="Client Success"
        title="Trusted by leading"
        titleHighlight="enterprises worldwide"
        description="Hear from the enterprises we've helped transform through digital innovation, AI implementation, and cloud modernization."
        primaryButton={{ text: 'View Case Studies', link: '/case-studies' }}
        secondaryButton={{ text: 'Contact Us', link: '/contact' }}
        stats={[
          { value: '98%', label: 'Satisfaction Rate', color: 'text-cyan-400' },
          { value: '500+', label: 'Projects Delivered', color: 'text-blue-400' },
          { value: '15+', label: 'Industries', color: 'text-emerald-400' },
          { value: '4.9/5', label: 'Average Rating', color: 'text-purple-400' },
        ]}
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-8 rounded-2xl relative">
                <Quote className="w-10 h-10 text-blue-200 absolute top-6 right-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">"{item.quote}"</p>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{item.author}</p>
                  <p className="text-sm text-brand-blue">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
